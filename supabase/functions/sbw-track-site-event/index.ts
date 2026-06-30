// =========================================================
// -SBW- v1.6.80.8 — Analytics Edge Function
// Função pública para registrar eventos com origem aproximada por IP temporário.
// Política do patch:
// - O IP é lido somente dentro da função para geolocalização aproximada.
// - O IP bruto NÃO é salvo no banco.
// - A função salva somente país/estado/região agregados no metadata.
// - Se a consulta externa falhar, o evento é salvo sem localização por IP.
// =========================================================

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const MAX_META_KEYS = 18;
const MAX_META_VALUE = 160;

const BR_REGION_BY_UF: Record<string, string> = {
  AC: "Norte",
  AP: "Norte",
  AM: "Norte",
  PA: "Norte",
  RO: "Norte",
  RR: "Norte",
  TO: "Norte",
  AL: "Nordeste",
  BA: "Nordeste",
  CE: "Nordeste",
  MA: "Nordeste",
  PB: "Nordeste",
  PE: "Nordeste",
  PI: "Nordeste",
  RN: "Nordeste",
  SE: "Nordeste",
  DF: "Centro-Oeste",
  GO: "Centro-Oeste",
  MT: "Centro-Oeste",
  MS: "Centro-Oeste",
  ES: "Sudeste",
  MG: "Sudeste",
  RJ: "Sudeste",
  SP: "Sudeste",
  PR: "Sul",
  RS: "Sul",
  SC: "Sul",
};

const BLOCKED_META_KEYS = new Set([
  "email",
  "user_email",
  "name",
  "full_name",
  "display_name",
  "username",
  "nickname",
  "auth_user_id",
  "user_id",
  "profile_id",
  "ip",
  "ip_address",
  "client_ip",
  "user_agent",
  "fingerprint",
]);

function jsonResponse(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...CORS_HEADERS,
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}

function cleanText(value: unknown, max = 120): string {
  return String(value ?? "")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

function cleanMetaKey(value: unknown): string {
  return cleanText(value, 48).replace(/[^a-zA-Z0-9_:-]/g, "_");
}

function sanitizeMetadata(metadata: unknown): Record<string, unknown> {
  const source = metadata && typeof metadata === "object" && !Array.isArray(metadata)
    ? metadata as Record<string, unknown>
    : {};

  const output: Record<string, unknown> = {};

  for (const [rawKey, rawValue] of Object.entries(source).slice(0, MAX_META_KEYS)) {
    const key = cleanMetaKey(rawKey);
    if (!key || BLOCKED_META_KEYS.has(key)) continue;
    if (rawValue === null || rawValue === undefined) continue;

    if (typeof rawValue === "boolean" || typeof rawValue === "number") {
      output[key] = rawValue;
      continue;
    }

    output[key] = cleanText(rawValue, MAX_META_VALUE);
  }

  return output;
}

function sanitizeEvent(event: unknown): Record<string, unknown> {
  const source = event && typeof event === "object" && !Array.isArray(event)
    ? event as Record<string, unknown>
    : {};

  return {
    event_type: cleanText(source.event_type || "page_view", 40) || "page_view",
    event_name: cleanText(source.event_name || source.event_type || "page_view", 80) || "page_view",
    page_path: cleanText(source.page_path || "/", 180) || "/",
    page_title: cleanText(source.page_title || "", 140),
    page_category: cleanText(source.page_category || "site", 60) || "site",
    referrer_path: cleanText(source.referrer_path || "", 160),
    device_type: cleanText(source.device_type || "unknown", 30) || "unknown",
    browser_family: cleanText(source.browser_family || "unknown", 30) || "unknown",
    os_family: cleanText(source.os_family || "unknown", 30) || "unknown",
    is_pwa: Boolean(source.is_pwa),
    viewport_width: Number.isFinite(Number(source.viewport_width)) ? Number(source.viewport_width) : null,
    viewport_height: Number.isFinite(Number(source.viewport_height)) ? Number(source.viewport_height) : null,
    metadata: sanitizeMetadata(source.metadata),
  };
}

function getHeaderIp(headers: Headers): string {
  const candidates = [
    headers.get("cf-connecting-ip"),
    headers.get("x-real-ip"),
    headers.get("x-forwarded-for")?.split(",")[0],
    headers.get("fly-client-ip"),
    headers.get("x-client-ip"),
  ];

  return cleanText(candidates.find(Boolean) || "", 80);
}

function isPrivateOrLocalIp(ip: string): boolean {
  const value = ip.trim().toLowerCase();

  if (!value) return true;
  if (value === "::1" || value === "localhost") return true;
  if (value.startsWith("127.")) return true;
  if (value.startsWith("10.")) return true;
  if (value.startsWith("192.168.")) return true;
  if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(value)) return true;
  if (value.startsWith("fc") || value.startsWith("fd") || value.startsWith("fe80:")) return true;

  return false;
}

function getBrazilRegion(uf: string): string {
  return BR_REGION_BY_UF[String(uf || "").trim().toUpperCase()] || "";
}

async function fetchWithTimeout(url: string, ms = 1800): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);

  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function lookupGeo(ip: string): Promise<Record<string, unknown>> {
  if (!ip || isPrivateOrLocalIp(ip)) {
    return {
      geo_source: "ip_not_available",
      geo_ip_saved: false,
    };
  }

  const enabled = String(Deno.env.get("SBW_GEO_LOOKUP_ENABLED") || "true").toLowerCase();
  if (["0", "false", "no", "off"].includes(enabled)) {
    return {
      geo_source: "disabled",
      geo_ip_saved: false,
    };
  }

  try {
    const response = await fetchWithTimeout(`https://ipapi.co/${encodeURIComponent(ip)}/json/`, 1800);
    if (!response.ok) throw new Error(`geo_http_${response.status}`);

    const data = await response.json();
    if (!data || data.error) throw new Error("geo_lookup_error");

    const countryCode = cleanText(data.country_code || data.country || "", 8).toUpperCase();
    const countryName = cleanText(data.country_name || "", 80);
    const stateCode = cleanText(data.region_code || "", 16).toUpperCase();
    const stateName = cleanText(data.region || "", 80);
    const brazilRegion = countryCode === "BR" ? getBrazilRegion(stateCode) : "";
    const timezone = cleanText(data.timezone || "", 64);

    return {
      country_code: countryCode,
      country: countryName || countryCode,
      country_name: countryName,
      state_code: stateCode,
      state: stateName || stateCode,
      region_code: stateCode,
      region: stateName || stateCode,
      region_name: stateName,
      brazil_region: brazilRegion,
      timezone_ip: timezone,
      geo_source: "ipapi_ephemeral",
      geo_precision: stateCode ? "country_region" : "country",
      geo_ip_saved: false,
    };
  } catch (error) {
    console.warn("[SBW Analytics] Geo lookup ignorado:", error instanceof Error ? error.message : error);

    return {
      geo_source: "lookup_failed",
      geo_ip_saved: false,
    };
  }
}

async function recordEvent(event: Record<string, unknown>): Promise<unknown> {
  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";

  if (!supabaseUrl || !anonKey) {
    throw new Error("SUPABASE_URL/SUPABASE_ANON_KEY ausentes na Edge Function.");
  }

  const response = await fetch(`${supabaseUrl.replace(/\/+$/, "")}/rest/v1/rpc/sbw_track_site_event`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": anonKey,
      "Authorization": `Bearer ${anonKey}`,
    },
    body: JSON.stringify({
      p_event: event,
    }),
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(text || `rpc_http_${response.status}`);
  }

  try {
    return JSON.parse(text);
  } catch (_) {
    return { ok: true };
  }
}

Deno.serve(async (request: Request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  if (request.method !== "POST") {
    return jsonResponse({ ok: false, message: "Método não permitido." }, 405);
  }

  try {
    const body = await request.json().catch(() => ({}));
    const rawEvent = body?.event || body?.p_event || body || {};
    const event = sanitizeEvent(rawEvent);

    const ip = getHeaderIp(request.headers);
    const geo = await lookupGeo(ip);
    const metadata = sanitizeMetadata({
      ...(event.metadata as Record<string, unknown>),
      ...geo,
    });

    // Garante que o IP bruto nunca vá para o banco, mesmo se enviado por engano.
    for (const key of BLOCKED_META_KEYS) {
      delete metadata[key];
    }

    event.metadata = metadata;

    const result = await recordEvent(event);

    return jsonResponse({
      ok: true,
      result,
      geo_source: metadata.geo_source || "unknown",
      ip_saved: false,
    });
  } catch (error) {
    console.error("[SBW Analytics] Edge Function falhou:", error);

    return jsonResponse({
      ok: false,
      message: error instanceof Error ? error.message : "Falha ao registrar analytics.",
      ip_saved: false,
    }, 500);
  }
});
