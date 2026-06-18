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

  function normalizeTransfer(item) {
    return {
      id: item.id || item.slug || item.transfer_id || "transfer-" + Math.random().toString(36).slice(2),
      type: item.type || item.kind || "player",
      status: item.status || item.transfer_status || "confirmed",
      playerId: item.player_id || item.playerId || item.profile_id || item.profileId || "",
      playerName: item.player_name || item.playerName || item.nickname || item.display_name || "Participante",
      role: item.role || item.position || item.function || "",
      game: item.game || item.modality || item.category || "",
      fromTeamId: item.from_team_id || item.fromTeamId || "",
      fromTeamName: item.from_team_name || item.fromTeamName || item.from || "Sem equipe",
      toTeamId: item.to_team_id || item.toTeamId || "",
      toTeamName: item.to_team_name || item.toTeamName || item.to || "Sem equipe",
      date: item.date || item.created_at || item.updated_at || "",
      description: item.description || item.summary || "",
      source: item.source || "SBW"
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

  async function loadMembershipTransfersFromSupabase() {
    const client = await getSupabaseClient();

    if (!client?.from) {
      return [];
    }

    try {
      const membersResult = await client
        .from("team_members")
        .select("*")
        .eq("status", "active")
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
  async function loadTransfers() {
    if (Array.isArray(window.SBWTransfersData)) {
      return window.SBWTransfersData.map(normalizeTransfer);
    }

    const client = await getSupabaseClient();

    if (client?.from) {
      try {
        const result = await client
          .from("transfers")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(80);

        if (!result.error && Array.isArray(result.data) && result.data.length) {
          return result.data.map(normalizeTransfer);
        }
      } catch (error) {
        console.warn("[SBW Transfers] Tabela transfers indisponível ou bloqueada:", error);
      }
    }

    const membershipTransfers = await loadMembershipTransfersFromSupabase();

    if (membershipTransfers.length) {
      return membershipTransfers;
    }

    return readLocalJson("sbw_transfers_v1", []).map(normalizeTransfer);
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
        <span class="sbw-transfer-status ${statusClass}">${escapeHtml(item.status === "rumor" ? "Rumor" : "Confirmada")}</span>
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

  async function init() {
    try {
      if (window.SBWPageState) {
        window.SBWPageState.showLoading(document.querySelector(".sbw-transfer-panel"), {
          title: "Carregando transferências",
          message: "Buscando movimentações oficiais da plataforma."
        });
      }

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

      if (window.SBWPageState) {
        window.SBWPageState.showError(document.querySelector(".sbw-transfer-panel"), {
          title: "Não foi possível carregar transferências",
          message: "Recarregue a página ou tente novamente mais tarde."
        });
      }
    } finally {
      document.body.classList.remove("sbw-sidebar-no-transition");
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
