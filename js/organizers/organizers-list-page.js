(function () {
  "use strict";

  const state = {
    organizers: [],
    context: null
  };

  function $(selector, root = document) {
    return root.querySelector(selector);
  }

  function escapeHtml(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function waitForSupabase() {
    for (let attempt = 0; attempt < 40; attempt += 1) {
      if (window.SBWSupabase?.client && window.SBWSupabase?.isEnabled?.()) {
        return window.SBWSupabase.client;
      }
      await wait(100);
    }

    return null;
  }

  async function loadContext() {
    try {
      if (window.SBWSessionContext?.getCurrentContext) {
        state.context = await window.SBWSessionContext.getCurrentContext({ refresh: true });
        return state.context;
      }
    } catch (error) {
      console.warn("[SBW Organizadores] Não foi possível carregar contexto:", error);
    }

    state.context = null;
    return null;
  }

  function canCreateOrganization() {
    return Boolean(
      state.context?.canCreateTournamentOrganizer ||
      state.context?.permissions?.canCreateTournamentOrganizer ||
      state.context?.permissions?.isAdminSbw ||
      state.context?.permissions?.isMasterAdmin
    );
  }

  function getTableName() {
    return window.SBWSupabaseConfig?.tables?.tournamentOrganizers || "tournament_organizers";
  }

  function normalizeOrganizer(row) {
    if (typeof window.sbwNormalizeSupabaseTournamentOrganizer === "function") {
      return window.sbwNormalizeSupabaseTournamentOrganizer(row);
    }

    const metadata = row?.metadata && typeof row.metadata === "object" ? row.metadata : {};
    return {
      id: row?.id || row?.slug || "",
      slug: row?.slug || row?.id || "",
      name: row?.name || row?.display_name || metadata.displayName || "Organização de Torneios",
      displayName: row?.display_name || row?.name || metadata.displayName || "Organização de Torneios",
      tag: row?.tag || row?.short_tag || metadata.tag || "",
      type: row?.type || row?.organizer_type || metadata.type || "Organizador de torneios",
      status: row?.status || "active",
      statusLabel: row?.status || "Ativo",
      description: row?.description || metadata.description || "Organização autorizada na plataforma -SBW-.",
      logoUrl: row?.logo_url || row?.logoUrl || metadata.logoUrl || "",
      games: Array.isArray(row?.games) ? row.games : Array.isArray(metadata.games) ? metadata.games : []
    };
  }

  async function loadOrganizers() {
    const client = await waitForSupabase();

    if (!client) {
      return [];
    }

    const { data, error } = await client
      .from(getTableName())
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("[SBW Organizadores] Falha ao carregar organizadores:", error);
      return [];
    }

    return Array.isArray(data)
      ? data.map(normalizeOrganizer).filter((organizer) => String(organizer.status || "active").toLowerCase() !== "deleted")
      : [];
  }

  function renderGate() {
    const root = $("#organizerCreatorGate");
    if (!root) return;

    if (canCreateOrganization()) {
      root.innerHTML = `
        <div class="sbw-organizers-gate-content">
          <span class="sbw-tournaments-eyebrow">Permissão confirmada</span>
          <h2>Criar Organização</h2>
          <p>Sua conta tem permissão real da -SBW- para iniciar uma Organização de Torneios.</p>
          <a class="sbw-tournaments-btn sbw-tournaments-btn--primary" href="../torneios/editar-organizador.html?novo=1">
            Criar organização
          </a>
        </div>
      `;
      return;
    }

    root.innerHTML = `
      <div class="sbw-organizers-gate-content">
        <span class="sbw-tournaments-eyebrow">Acesso controlado</span>
        <h2>Organização de Torneios</h2>
        <p>Para criar uma organização, a conta precisa receber permissão real da equipe -SBW-.</p>
        <small>Usuários SBW podem visualizar organizadores públicos, mas não criam organizações sem autorização.</small>
      </div>
    `;
  }

  function renderOrganizers() {
    const grid = $("#sbwOrganizersGrid");
    const count = $("#sbwOrganizersCount");
    if (count) count.textContent = String(state.organizers.length);

    if (!grid) return;

    if (!state.organizers.length) {
      grid.innerHTML = `
        <div class="empty-tournament-state">
          Nenhuma Organização de Torneios publicada ainda.
        </div>
      `;
      return;
    }

    grid.innerHTML = state.organizers.map(renderOrganizerCard).join("");
  }

  function renderOrganizerCard(organizer) {
    const slug = organizer.slug || organizer.id || "";
    const href = `../torneios/organizador.html?slug=${encodeURIComponent(slug)}`;
    const name = organizer.displayName || organizer.name || "Organização";
    const initials = String(organizer.tag || name || "ORG").slice(0, 3).toUpperCase();
    const games = Array.isArray(organizer.games) ? organizer.games.slice(0, 3).join(" · ") : "";

    return `
      <article class="tournament-organizer-card sbw-organizers-public-card">
        <div class="tournament-organizer-head">
          <div class="tournament-organizer-logo">
            ${organizer.logoUrl ? `<img src="${escapeHtml(organizer.logoUrl)}" alt="Logo ${escapeHtml(name)}">` : escapeHtml(initials)}
          </div>
          <div>
            <strong>${escapeHtml(name)}</strong>
            <small>${escapeHtml([organizer.tag, organizer.type, games].filter(Boolean).join(" · "))}</small>
          </div>
        </div>
        <p>${escapeHtml(organizer.description || "Organização autorizada para torneios na -SBW-.")}</p>
        <a class="sbw-tournaments-btn sbw-tournaments-btn--ghost" href="${escapeHtml(href)}">Ver organizador</a>
      </article>
    `;
  }

  async function init() {
    await loadContext();
    renderGate();

    state.organizers = await loadOrganizers();
    renderOrganizers();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
