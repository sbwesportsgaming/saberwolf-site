(function () {
  "use strict";

  const state = {
    transfers: [],
    recruitingTeams: [],
    freeAgents: [],
    activeStatus: "all",
    search: ""
  };

  const elements = {
    stats: document.getElementById("transferStats"),
    tabs: document.getElementById("transferTabs"),
    search: document.getElementById("transferSearch"),
    clear: document.getElementById("clearTransferFilters"),
    featured: document.getElementById("transferFeatured"),
    list: document.getElementById("transferList"),
    empty: document.getElementById("transferEmpty"),
    count: document.getElementById("transferCount"),
    recruitingTeams: document.getElementById("recruitingTeamsList"),
    freeAgents: document.getElementById("freeAgentsList")
  };

  function escapeHtml(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function normalizeText(value) {
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function formatDate(value) {
    if (!value) return "Data não informada";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return String(value);

    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  }

  function route(path, fallback) {
    if (window.SBWRoutes && typeof window.SBWRoutes[path] === "function") {
      return window.SBWRoutes[path];
    }

    return fallback;
  }

  function profileUrl(id) {
    if (!id) return "../perfis/perfis.html";

    const profileRoute = route("profile", null);

    if (profileRoute) {
      return profileRoute(id);
    }

    return "../perfis/perfil.html?id=" + encodeURIComponent(id);
  }

  function teamUrl(id) {
    if (!id) return "../equipes/equipes.html";

    const teamRoute = route("team", null);

    if (teamRoute) {
      return teamRoute(id);
    }

    return "../equipes/equipe.html?id=" + encodeURIComponent(id);
  }

  async function getSupabaseClient() {
    for (let attempt = 0; attempt < 20; attempt += 1) {
      if (window.SBWSupabase?.client) return window.SBWSupabase.client;
      await new Promise((resolve) => setTimeout(resolve, 80));
    }

    return null;
  }

  function readLocalJson(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : fallback;
    } catch (error) {
      return fallback;
    }
  }


  function normalizeStatus(value) {
    const status = String(value || "").toLowerCase().trim();

    if (["completed", "complete", "concluido", "concluído", "accepted", "active", "ativo"].includes(status)) {
      return "confirmed";
    }

    if (["cancelled", "canceled", "cancelado", "declined", "rejected"].includes(status)) {
      return "cancelled";
    }

    if (["rumor", "rumour", "boato"].includes(status)) {
      return "rumor";
    }

    return status || "confirmed";
  }

  function normalizeTransfer(item) {
    const data = item && typeof item === "object" ? item : {};

    return {
      id: data.id || data.slug || data.transfer_id || data.transferId || "transfer-" + Math.random().toString(36).slice(2),
      type: data.type || data.kind || "player",
      status: normalizeStatus(data.status || data.transfer_status || data.transferStatus || data.situation || "confirmed"),
      playerId: data.player_id || data.playerId || data.profile_id || data.profileId || data.profile_slug || data.profileSlug || "",
      playerName: data.player_name || data.playerName || data.nickname || data.display_name || data.displayName || data.profile_name || data.profileName || "Participante",
      role: data.role || data.position || data.function || data.function_name || data.public_title || "",
      game: data.game || data.modality || data.category || data.main_game || "",
      fromTeamId: data.from_team_id || data.fromTeamId || "",
      fromTeamName: data.from_team_name || data.fromTeamName || data.from || "Sem equipe",
      toTeamId: data.to_team_id || data.toTeamId || data.team_slug || data.teamSlug || "",
      toTeamName: data.to_team_name || data.toTeamName || data.to || data.team_name || data.teamName || "Sem equipe",
      date: data.date || data.created_at || data.createdAt || data.joined_at || data.joinedAt || data.updated_at || data.updatedAt || "",
      description: data.description || data.summary || "",
      source: data.source || data.feed_source || data.feedSource || "SBW"
    };
  }



  function normalizeMemberTransfer(member, teamMap) {
    const teamKey = String(member.team_slug || member.teamSlug || member.teamId || "");
    const team = teamMap?.get(teamKey) || {};
    const metadata = member.metadata && typeof member.metadata === "object" ? member.metadata : {};
    const displayName = member.display_name || member.displayName || member.nickname || member.profile_slug || "Jogador";
    const joinedAt = member.joined_at || member.joinedAt || member.created_at || member.createdAt || "";

    return normalizeTransfer({
      id: "member-join-" + teamKey + "-" + String(member.profile_slug || member.profileSlug || member.id || "").replace(/[^a-z0-9_-]/gi, ""),
      type: "player",
      status: "confirmed",
      player_id: member.profile_slug || member.profileSlug || member.profileId || "",
      player_name: displayName,
      role: member.public_title || member.publicTitle || member.function_name || member.functionName || member.role || "Jogador",
      game: Array.isArray(member.games) && member.games.length ? member.games[0]?.name || member.games[0]?.id || member.games[0] : "",
      from_team_id: "",
      from_team_name: "Sem equipe",
      to_team_id: team.slug || teamKey,
      to_team_name: team.name || metadata.teamName || member.teamName || teamKey || "Equipe",
      date: joinedAt,
      description: displayName + " entrou para " + (team.name || metadata.teamName || member.teamName || "uma equipe") + ".",
      source: "team_members"
    });
  }

  function mergeTransfers(primary, secondary) {
    const map = new Map();

    [...primary, ...secondary].forEach((item) => {
      const transfer = normalizeTransfer(item);
      const key = [
        transfer.id,
        normalizeText(transfer.playerId),
        normalizeText(transfer.playerName),
        normalizeText(transfer.toTeamId),
        normalizeText(transfer.toTeamName),
        String(transfer.date || "").slice(0, 10)
      ].join("|");

      if (!map.has(key)) {
        map.set(key, transfer);
      }
    });

    return Array.from(map.values()).sort((a, b) => {
      const dateA = new Date(a.date || 0).getTime() || 0;
      const dateB = new Date(b.date || 0).getTime() || 0;
      return dateB - dateA;
    });
  }

  function loadStaticTransfers() {
    const officialStatic = Array.isArray(window.SBWTransfersData) ? window.SBWTransfersData : [];
    const legacyMarket = Array.isArray(window.SBWTransfersDemoData) ? window.SBWTransfersDemoData : [];

    return [...officialStatic, ...legacyMarket].map((item) => {
      return normalizeTransfer({
        ...item,
        source: item.source || (officialStatic.includes(item) ? "static" : "mercado-base")
      });
    });
  }

  async function loadTransferFeedFromSupabase() {
    const client = await getSupabaseClient();

    if (!client?.rpc) {
      return [];
    }

    try {
      const result = await client.rpc("sbw_get_transfer_feed");

      if (!result.error && Array.isArray(result.data)) {
        return result.data.map(normalizeTransfer);
      }

      if (result.error) {
        console.warn("[SBW Transfers] RPC sbw_get_transfer_feed indisponível:", result.error);
      }
    } catch (error) {
      console.warn("[SBW Transfers] Não foi possível carregar feed real de transferências:", error);
    }

    return [];
  }

  async function loadMembershipTransfersFromSupabase() {
    const client = await getSupabaseClient();

    if (!client?.from) {
      return [];
    }

    try {
      const membersResult = await client
        .from("team_members")
        .select("*")
        .in("status", ["active", "ativo", "accepted", "confirmed"])
        .order("joined_at", { ascending: false })
        .limit(80);

      if (membersResult.error || !Array.isArray(membersResult.data) || !membersResult.data.length) {
        return [];
      }

      const teamSlugs = Array.from(new Set(membersResult.data.map((member) => member.team_slug).filter(Boolean)));
      const teamMap = new Map();

      if (teamSlugs.length) {
        const teamsResult = await client
          .from("teams")
          .select("id, slug, name, tag, logo_url")
          .in("slug", teamSlugs);

        if (!teamsResult.error && Array.isArray(teamsResult.data)) {
          teamsResult.data.forEach((team) => {
            teamMap.set(team.slug, team);
          });
        }
      }

      return membersResult.data.map((member) => normalizeMemberTransfer(member, teamMap));
    } catch (error) {
      console.warn("[SBW Transfers] Não foi possível derivar transferências de team_members:", error);
      return [];
    }
  }

  async function loadOfficialTransfersFromSupabase() {
    const client = await getSupabaseClient();

    if (!client?.from) {
      return [];
    }

    try {
      const result = await client
        .from("transfers")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(80);

      if (!result.error && Array.isArray(result.data)) {
        return result.data.map(normalizeTransfer);
      }
    } catch (error) {
      console.warn("[SBW Transfers] Tabela transfers indisponível ou bloqueada:", error);
    }

    return [];
  }

  async function loadTransfers() {
    const client = await getSupabaseClient();
    const staticTransfers = loadStaticTransfers();

    if (client?.from || client?.rpc) {
      const [transferFeed, officialTransfers, membershipTransfers] = await Promise.all([
        loadTransferFeedFromSupabase(),
        loadOfficialTransfersFromSupabase(),
        loadMembershipTransfersFromSupabase()
      ]);

      return mergeTransfers(
        transferFeed,
        mergeTransfers(officialTransfers, mergeTransfers(membershipTransfers, staticTransfers))
      );
    }

    return mergeTransfers(staticTransfers, readLocalJson("sbw_transfers_v1", []).map(normalizeTransfer));
  }

  async function loadRecruitingTeams() {
    const client = await getSupabaseClient();

    if (client?.from) {
      try {
        const result = await client
          .from("teams")
          .select("id, slug, name, tag, is_recruiting, recruiting_open, games, modalities")
          .or("is_recruiting.eq.true,recruiting_open.eq.true")
          .limit(6);

        if (!result.error && Array.isArray(result.data)) {
          return result.data.map((team) => ({
            id: team.slug || team.id,
            name: team.name || team.tag || "Equipe",
            tag: team.tag || "",
            game: Array.isArray(team.games) ? team.games[0] : Array.isArray(team.modalities) ? team.modalities[0] : "",
            label: "Recrutando"
          }));
        }
      } catch (error) {
        console.warn("[SBW Transfers] Não foi possível carregar equipes recrutando:", error);
      }
    }

    return [];
  }

  async function loadFreeAgents() {
    const client = await getSupabaseClient();

    if (client?.from) {
      try {
        const result = await client
          .from("profiles")
          .select("id, slug, username, display_name, nickname, status, public_status, main_game")
          .in("public_status", ["free_agent", "open_to_offers"])
          .limit(6);

        if (!result.error && Array.isArray(result.data)) {
          return result.data.map((profile) => ({
            id: profile.slug || profile.username || profile.id,
            name: profile.display_name || profile.nickname || profile.username || "Jogador",
            game: profile.main_game || "",
            label: profile.public_status === "open_to_offers" ? "Aberto a propostas" : "Free agent"
          }));
        }
      } catch (error) {
        console.warn("[SBW Transfers] Não foi possível carregar free agents:", error);
      }
    }

    return [];
  }

  function getFilteredTransfers() {
    const search = normalizeText(state.search);

    return state.transfers.filter((item) => {
      const haystack = normalizeText([
        item.playerName,
        item.role,
        item.game,
        item.fromTeamName,
        item.toTeamName,
        item.status,
        item.type,
        item.description,
        item.source
      ].join(" "));

      const matchesSearch = !search || haystack.includes(search);
      const matchesStatus =
        state.activeStatus === "all" ||
        item.status === state.activeStatus ||
        item.type === state.activeStatus;

      return matchesSearch && matchesStatus;
    });
  }

  function renderStats() {
    const transfers = state.transfers;
    const confirmed = transfers.filter((item) => item.status === "confirmed").length;
    const rumors = transfers.filter((item) => item.status === "rumor").length;
    const players = transfers.filter((item) => item.type === "player" || item.playerId).length;
    const recruiting = state.recruitingTeams.length;

    elements.stats.innerHTML = `
      <article class="sbw-transfer-stat">
        <span class="sbw-transfer-stat__icon">▣</span>
        <div><span>Janela ativa</span><strong>${transfers.length ? "Aberta" : "—"}</strong></div>
      </article>
      <article class="sbw-transfer-stat">
        <span class="sbw-transfer-stat__icon">⇄</span>
        <div><span>Movimentações</span><strong>${confirmed}</strong></div>
      </article>
      <article class="sbw-transfer-stat">
        <span class="sbw-transfer-stat__icon">◎</span>
        <div><span>Rumores</span><strong>${rumors}</strong></div>
      </article>
      <article class="sbw-transfer-stat">
        <span class="sbw-transfer-stat__icon">♙</span>
        <div><span>Free agents / vagas</span><strong>${players + recruiting}</strong></div>
      </article>
    `;
  }

  function renderFeatured() {
    const item = state.transfers[0];

    if (!item) {
      elements.featured.className = "sbw-transfer-feature is-empty";
      elements.featured.innerHTML = `
        <div class="sbw-transfer-feature__avatar" aria-hidden="true">⇄</div>
        <div>
          <span class="sbw-transfers-eyebrow">Transferência em destaque</span>
          <h2>Nenhuma movimentação oficial publicada ainda</h2>
          <p>
            A área de destaque será preenchida quando equipes, jogadores ou administradores
            publicarem movimentações reais da plataforma.
          </p>
        </div>
      `;
      return;
    }

    elements.featured.className = "sbw-transfer-feature";
    elements.featured.innerHTML = `
      <div class="sbw-transfer-feature__avatar" aria-hidden="true">${escapeHtml(item.playerName.charAt(0).toUpperCase())}</div>
      <div>
        <span class="sbw-transfers-eyebrow">Transferência em destaque</span>
        <h2>${escapeHtml(item.playerName)}</h2>
        <p>${escapeHtml(item.description || "Movimentação publicada no ecossistema -SBW-.")}</p>
      </div>
      <div class="sbw-transfer-route">
        ${renderTeamRouteItem(item.fromTeamId, item.fromTeamName, "De")}
        ${renderTeamRouteItem(item.toTeamId, item.toTeamName, "Para")}
      </div>
    `;
  }

  function renderTeamRouteItem(id, name, label) {
    const content = `
      <span class="sbw-transfer-route__mark">${escapeHtml((name || "FA").slice(0, 3).toUpperCase())}</span>
      <span><small>${escapeHtml(label)}</small><strong>${escapeHtml(name || "Sem equipe")}</strong></span>
    `;

    if (!id) {
      return `<div class="sbw-transfer-route__item">${content}</div>`;
    }

    return `<a class="sbw-transfer-route__item" href="${escapeHtml(teamUrl(id))}">${content}</a>`;
  }

  function renderTransferCard(item) {
    const statusClass = item.status === "rumor" ? "is-rumor" : "";
    const playerHref = item.playerId ? profileUrl(item.playerId) : "../perfis/perfis.html";

    return `
      <article class="sbw-transfer-card">
        <div>
          <a href="${escapeHtml(playerHref)}">${escapeHtml(item.playerName)}</a>
          <p>${escapeHtml(item.role || item.game || "Perfil competitivo")}</p>
        </div>
        <div><small>De</small><strong>${escapeHtml(item.fromTeamName || "Sem equipe")}</strong></div>
        <div><small>Para</small><strong>${escapeHtml(item.toTeamName || "Sem equipe")}</strong></div>
        <div><small>Data</small><strong>${escapeHtml(formatDate(item.date))}</strong></div>
        <span class="sbw-transfer-status ${statusClass}">${escapeHtml(item.status === "rumor" ? "Rumor" : item.status === "cancelled" ? "Cancelada" : "Confirmada")}</span>
      </article>
    `;
  }

  function renderList() {
    const filtered = getFilteredTransfers();

    elements.count.textContent = filtered.length === 1 ? "1 registro" : filtered.length + " registros";
    elements.list.innerHTML = filtered.map(renderTransferCard).join("");
    elements.empty.hidden = filtered.length > 0;
  }

  function renderMiniList(element, items, emptyMessage, urlBuilder) {
    if (!items.length) {
      element.innerHTML = `<div class="sbw-transfer-side-empty">${escapeHtml(emptyMessage)}</div>`;
      return;
    }

    element.innerHTML = items.map((item) => `
      <a class="sbw-transfer-mini-item" href="${escapeHtml(urlBuilder(item.id))}">
        <span class="sbw-transfer-mini-item__avatar">${escapeHtml((item.name || "S").charAt(0).toUpperCase())}</span>
        <span><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.game || item.label || "")}</small></span>
        <span>→</span>
      </a>
    `).join("");
  }

  function renderSidebars() {
    renderMiniList(
      elements.recruitingTeams,
      state.recruitingTeams,
      "Nenhuma equipe com recrutamento oficial publicado no momento.",
      teamUrl
    );

    renderMiniList(
      elements.freeAgents,
      state.freeAgents,
      "Nenhum free agent oficial publicado no momento.",
      profileUrl
    );
  }

  function render() {
    renderStats();
    renderFeatured();
    renderList();
    renderSidebars();
  }

  function bindEvents() {
    elements.search.addEventListener("input", () => {
      state.search = elements.search.value;
      renderList();
    });

    elements.clear.addEventListener("click", () => {
      state.search = "";
      state.activeStatus = "all";
      elements.search.value = "";
      elements.tabs.querySelectorAll("button").forEach((button) => {
        button.classList.toggle("is-active", button.dataset.transferStatus === "all");
      });
      renderList();
    });

    elements.tabs.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", () => {
        state.activeStatus = button.dataset.transferStatus || "all";
        elements.tabs.querySelectorAll("button").forEach((item) => item.classList.remove("is-active"));
        button.classList.add("is-active");
        renderList();
      });
    });
  }

  function showTransferFallbackError() {
    if (elements.list) {
      elements.list.innerHTML = `
        <article class="sbw-transfer-card">
          <div class="sbw-transfer-main">
            <span class="sbw-transfer-status">Erro</span>
            <h3>Não foi possível carregar transferências</h3>
            <p>Recarregue a página ou tente novamente mais tarde.</p>
          </div>
        </article>
      `;
    }

    if (elements.empty) {
      elements.empty.hidden = true;
    }
  }

  function showOptionalPageLoading() {
    const pageState = window.SBWPageState;

    if (!pageState || typeof pageState.showLoading !== "function") {
      return;
    }

    pageState.showLoading(document.querySelector(".sbw-transfer-panel"), {
      title: "Carregando transferências",
      message: "Buscando movimentações oficiais da plataforma."
    });
  }

  function showOptionalPageError() {
    const pageState = window.SBWPageState;

    if (pageState && typeof pageState.showError === "function") {
      pageState.showError(document.querySelector(".sbw-transfer-panel"), {
        title: "Não foi possível carregar transferências",
        message: "Recarregue a página ou tente novamente mais tarde."
      });
      return;
    }

    showTransferFallbackError();
  }

  async function init() {
    try {
      showOptionalPageLoading();

      const [transfers, recruitingTeams, freeAgents] = await Promise.all([
        loadTransfers(),
        loadRecruitingTeams(),
        loadFreeAgents()
      ]);

      state.transfers = transfers;
      state.recruitingTeams = recruitingTeams;
      state.freeAgents = freeAgents;

      bindEvents();
      render();
    } catch (error) {
      console.error("[SBW Transfers] Falha ao iniciar página:", error);
      showOptionalPageError();
    } finally {
      document.body.classList.remove("sbw-sidebar-no-transition");
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
