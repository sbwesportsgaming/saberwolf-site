(function () {
  const EXPECTED_DOMAIN = "sbwgg.com.br";

  const CRITICAL_LINKS = [
    { label: "Home", href: "../index.html" },
    { label: "Login", href: "../auth/login.html" },
    { label: "Esqueci senha", href: "../auth/esqueci-senha.html" },
    { label: "Redefinir senha", href: "../auth/redefinir-senha.html" },
    { label: "Perfis", href: "../perfis/perfis.html" },
    { label: "Equipes", href: "../equipes/equipes.html" },
    { label: "Torneios", href: "../torneios/torneios.html" },
    { label: "Criar/Gerenciar torneio", href: "../torneios/create-tournament/criar-torneio.html" },
    { label: "Rankings", href: "../rankings/rankings.html" },
    { label: "Transferências", href: "../transferencias/transferencias.html" }
  ];

  const PUBLIC_TABLES = [
    { key: "profiles", label: "profiles" },
    { key: "teams", label: "teams" },
    { key: "tournaments", label: "tournaments" },
    { key: "tournamentParticipants", label: "tournament_participants" },
    { key: "tournamentOrganizers", label: "tournament_organizers" }
  ];

  function getRootUrl() {
    if (window.SBWAuth && typeof window.SBWAuth.getRootUrl === "function") {
      return window.SBWAuth.getRootUrl();
    }

    return new URL("../", window.location.href).href;
  }

  function getTarget(group) {
    return document.querySelector(`[data-beta-checks="${group}"]`);
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function renderCheck(group, status, title, detail) {
    const target = getTarget(group);

    if (!target) {
      return;
    }

    const labels = {
      ok: "OK",
      warn: "!",
      error: "X",
      info: "i"
    };

    const item = document.createElement("div");
    item.className = `sbw-beta-check sbw-beta-${status || "info"}`;
    item.innerHTML = `
      <span class="sbw-beta-icon">${labels[status] || labels.info}</span>
      <span>
        <strong>${escapeHtml(title)}</strong>
        <span>${escapeHtml(detail)}</span>
      </span>
    `;

    target.appendChild(item);
  }

  function renderSummary(counts) {
    const target = document.querySelector("[data-beta-summary]");

    if (!target) {
      return;
    }

    const total = counts.ok + counts.warn + counts.error + counts.info;
    const status = counts.error ? "error" : counts.warn ? "warn" : "ok";
    const message = counts.error
      ? "Existem bloqueios para revisar antes do beta."
      : counts.warn
        ? "Beta quase pronto; revise os avisos antes de liberar."
        : "Checklist básico aprovado para teste fechado.";

    target.className = `sbw-beta-summary sbw-beta-${status}`;
    target.innerHTML = `
      <span class="sbw-beta-icon">${status === "ok" ? "OK" : status === "warn" ? "!" : "X"}</span>
      <span><strong>${escapeHtml(message)}</strong> ${total} checagens · ${counts.ok} OK · ${counts.warn} avisos · ${counts.error} erros.</span>
    `;
  }

  function makeCounter() {
    const counts = { ok: 0, warn: 0, error: 0, info: 0 };

    return {
      add(status) {
        counts[status] = (counts[status] || 0) + 1;
      },
      values() {
        return counts;
      }
    };
  }

  async function checkFront(counter) {
    const host = window.location.hostname;
    const isLocal = ["localhost", "127.0.0.1", ""].includes(host);
    const isExpectedDomain = host === EXPECTED_DOMAIN || host === `www.${EXPECTED_DOMAIN}`;

    const domainStatus = isExpectedDomain || isLocal ? "ok" : "warn";
    renderCheck(
      "front",
      domainStatus,
      "Domínio/origem",
      isExpectedDomain
        ? `Rodando no domínio oficial: ${host}`
        : isLocal
          ? `Rodando em ambiente local: ${host || "arquivo local"}`
          : `Origem atual: ${host}. Para beta real, validar em ${EXPECTED_DOMAIN}.`
    );
    counter.add(domainStatus);

    const robotsMeta = document.querySelector('meta[name="robots"]');
    renderCheck(
      "front",
      robotsMeta ? "ok" : "warn",
      "Página de checklist não indexável",
      robotsMeta ? `Meta robots: ${robotsMeta.content}` : "Adicione noindex/nofollow se expor páginas internas de beta."
    );
    counter.add(robotsMeta ? "ok" : "warn");

    const config = window.SBWSupabaseConfig || {};
    const key = String(config.publishableKey || "");
    const secretLike = /service_role|secret/i.test(key);
    renderCheck(
      "front",
      !secretLike && key ? "ok" : "error",
      "Chave pública do Supabase",
      !secretLike && key
        ? "Chave pública/publishable carregada no front. Não parece ser service_role."
        : "Chave ausente ou com aparência de segredo. Nunca publique service_role no front."
    );
    counter.add(!secretLike && key ? "ok" : "error");
  }

  async function checkSupabase(counter) {
    const config = window.SBWSupabaseConfig || {};
    const client = window.SBWSupabase?.client || null;

    renderCheck(
      "supabase",
      config.enabled && config.mode === "supabase" ? "ok" : "warn",
      "Modo Supabase",
      `enabled=${Boolean(config.enabled)} · mode=${config.mode || "não definido"}`
    );
    counter.add(config.enabled && config.mode === "supabase" ? "ok" : "warn");

    renderCheck(
      "supabase",
      client ? "ok" : "error",
      "Cliente Supabase",
      client ? "Cliente inicializado no navegador." : "Cliente não inicializado. Verifique URL, publishableKey e CDN do Supabase."
    );
    counter.add(client ? "ok" : "error");

    if (!client) {
      return;
    }

    try {
      const { data, error } = await client.auth.getSession();
      const hasSession = Boolean(data?.session);
      renderCheck(
        "supabase",
        error ? "warn" : "ok",
        "Sessão/Auth",
        error
          ? `Auth respondeu com aviso: ${error.message}`
          : hasSession
            ? "Sessão ativa encontrada."
            : "Sem sessão ativa nesta aba. Login ainda pode funcionar normalmente."
      );
      counter.add(error ? "warn" : "ok");
    } catch (error) {
      renderCheck("supabase", "error", "Sessão/Auth", error.message || "Falha ao consultar sessão.");
      counter.add("error");
    }
  }

  async function checkTables(counter) {
    const config = window.SBWSupabaseConfig || {};
    const client = window.SBWSupabase?.client || null;

    if (!client) {
      renderCheck("tables", "error", "Tabelas", "Cliente Supabase indisponível.");
      counter.add("error");
      return;
    }

    for (const table of PUBLIC_TABLES) {
      const tableName = config.tables?.[table.key] || table.label;

      try {
        const { error, count } = await client
          .from(tableName)
          .select("*", { count: "exact", head: true });

        if (error) {
          const blocked = ["PGRST116", "42501"].includes(error.code) || /permission|policy|forbidden/i.test(error.message || "");
          renderCheck(
            "tables",
            blocked ? "warn" : "error",
            tableName,
            `${error.code || "erro"}: ${error.message || "consulta bloqueada"}`
          );
          counter.add(blocked ? "warn" : "error");
        } else {
          renderCheck("tables", "ok", tableName, `Tabela acessível pela API REST. Registros visíveis: ${count ?? "n/d"}.`);
          counter.add("ok");
        }
      } catch (error) {
        renderCheck("tables", "error", tableName, error.message || "Falha inesperada.");
        counter.add("error");
      }
    }
  }

  async function checkLinks(counter) {
    const rootUrl = getRootUrl();

    CRITICAL_LINKS.forEach(function (link) {
      const url = new URL(link.href, window.location.href);
      const insideRoot = url.href.startsWith(rootUrl);

      renderCheck(
        "links",
        insideRoot ? "ok" : "warn",
        link.label,
        insideRoot ? url.pathname : `Fora da raiz detectada: ${url.href}`
      );
      counter.add(insideRoot ? "ok" : "warn");
    });
  }

  async function init() {
    const counter = makeCounter();

    await checkFront(counter);
    await checkSupabase(counter);
    await checkTables(counter);
    await checkLinks(counter);

    renderSummary(counter.values());
  }

  document.addEventListener("DOMContentLoaded", init);
})();
