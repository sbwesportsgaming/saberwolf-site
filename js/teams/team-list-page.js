(function () {
  "use strict";

  const state = {
    teams: [],
    search: "",
    type: "all",
    game: "all",
    status: "all",
    loading: false,
    error: ""
  };

  function getStorage() {
    return window.SBWTeamsStorage || null;
  }

  function getModels() {
    return window.SBWTeamsModels || {};
  }

  function getConfig() {
    return window.SBW_TEAMS_CONFIG || {};
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function safeColor(value, fallback) {
    const color = String(value || "").trim();

    if (/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(color)) {
      return color;
    }

    if (/^rgba?\([0-9\s.,%]+\)$/i.test(color)) {
      return color;
    }

    return fallback;
  }

  function safeImageUrl(value) {
    const url = String(value || "").trim();

    if (!url) return "";

    const allowed =
      url.startsWith("http://") ||
      url.startsWith("https://") ||
      url.startsWith("/") ||
      url.startsWith("../") ||
      url.startsWith("./") ||
      url.startsWith("img/") ||
      url.startsWith("assets/") ||
      url.startsWith("data:image/");

    return allowed ? url.replace(/["'\\()]/g, "") : "";
  }

  function getMeta(team) {
    const metadata = team?.metadata;
    return metadata && typeof metadata === "object" && !Array.isArray(metadata) ? metadata : {};
  }

  function clampNumber(value, min, max, fallback) {
    const number = Number(value);
    if (!Number.isFinite(number)) return fallback;
    return Math.min(max, Math.max(min, number));
  }

  function getTeamAssetFrame(team, assetType) {
    const metadata = getMeta(team);
    const teamAssets = metadata.teamAssets && typeof metadata.teamAssets === "object" && !Array.isArray(metadata.teamAssets)
      ? metadata.teamAssets
      : {};
    const fallbackAssets = metadata.assetFrames && typeof metadata.assetFrames === "object" && !Array.isArray(metadata.assetFrames)
      ? metadata.assetFrames
      : {};
    const raw = teamAssets[assetType] || fallbackAssets[assetType] || {};

    return {
      positionX: clampNumber(raw.positionX ?? raw.x ?? raw.objectPositionX, 0, 100, 50),
      positionY: clampNumber(raw.positionY ?? raw.y ?? raw.objectPositionY, 0, 100, 50),
      zoom: clampNumber(raw.zoom ?? raw.scale ?? raw.size, 100, assetType === "banner" ? 180 : 160, 100)
    };
  }

  function getTeamAssetFrameStyle(team) {
    const banner = getTeamAssetFrame(team, "banner");
    const logo = getTeamAssetFrame(team, "logo");
    const bannerSize = banner.zoom <= 100 ? "cover" : `${banner.zoom}% auto`;

    return [
      `--sbw-team-banner-x:${banner.positionX}%`,
      `--sbw-team-banner-y:${banner.positionY}%`,
      `--sbw-team-banner-size:${bannerSize}`,
      `--sbw-team-logo-x:${logo.positionX}%`,
      `--sbw-team-logo-y:${logo.positionY}%`,
      `--sbw-team-logo-scale:${(logo.zoom / 100).toFixed(2)}`
    ].join("; ") + ";";
  }

  function getVerifiedStatus() {
    const config = getConfig();
    return config.verificationStatus?.verified || "verified";
  }

  function getSubteamType() {
    const config = getConfig();
    return config.teamTypes?.subteam || config.teamTypes?.subTeam || "subteam";
  }

  function getCommonTeamLimit() {
    const config = getConfig();
    return Number(config.limits?.commonTeamMembers || 50);
  }

  function getVerifiedTeamLimit() {
    const config = getConfig();
    return Number(config.limits?.verifiedTeamMembers || 100);
  }

  function getTeamPublicUrl(team) {
    const teamId = getTeamId(team);

    if (window.SBWRoutes && typeof window.SBWRoutes.team === "function") {
      return window.SBWRoutes.team(teamId);
    }

    return `equipe.html?id=${encodeURIComponent(teamId)}`;
  }

  function getTeamId(team) {
    return team?.slug || team?.id || team?.teamId || team?.teamSlug || "";
  }

  function getTeamGames(team) {
    return Array.isArray(team?.games) ? team.games : [];
  }

  function getGameLabel(game) {
    if (typeof game === "string") return game;
    return game?.name || game?.id || "Jogo";
  }

  function getGameCategory(game) {
    if (!game || typeof game === "string") return "";
    return game.category || game.type || "";
  }

  function getTeamTypeLabel(team) {
    const models = getModels();

    if (typeof models.getTeamTypeLabel === "function") {
      return models.getTeamTypeLabel(team);
    }

    if (team?.teamType === getSubteamType()) {
      return "Subequipe";
    }

    return "Equipe";
  }

  function getVerificationLabel(team) {
    const models = getModels();

    if (typeof models.getVerificationLabel === "function") {
      return models.getVerificationLabel(team);
    }

    return isTeamVerified(team) ? "Equipe verificada" : "Não verificada";
  }

  function isTeamVerified(team) {
    return team?.verificationStatus === getVerifiedStatus() || team?.isVerified === true;
  }

  function isSubteam(team) {
    return team?.teamType === getSubteamType() || Boolean(team?.parentTeamId || team?.parentTeamSlug);
  }

  function getTeamPublicType(team) {
    const storage = getStorage();

    if (!storage || typeof storage.getTeamTypeByTeamId !== "function") {
      return null;
    }

    const identifiers = [
      team?.id,
      team?.teamId,
      team?.slug,
      team?.teamSlug,
      getTeamId(team)
    ].filter(Boolean);

    for (const identifier of identifiers) {
      const found = storage.getTeamTypeByTeamId(identifier);

      if (found && found.source !== "default") {
        return found;
      }
    }

    return storage.getTeamTypeByTeamId(getTeamId(team));
  }

  function getTeamPublicTypeLabel(team) {
    const teamType = getTeamPublicType(team);
    return teamType?.label || teamType?.shortLabel || getTeamTypeLabel(team);
  }

  function getTeamTypeOptionsForFilter() {
    const storage = getStorage();

    if (!storage || typeof storage.getTeamTypeOptions !== "function") {
      return [];
    }

    const options = storage.getTeamTypeOptions();
    return Array.isArray(options) ? options : [];
  }

  function getMemberCount(team) {
    const summary = team?.rosterSummary || {};
    const stats = team?.stats || {};
    const metadata = team?.metadata || {};

    return Number(
      summary.activeMembers ??
      summary.members ??
      summary.totalMembers ??
      stats.activeMembers ??
      stats.members ??
      stats.memberCount ??
      metadata.activeMembers ??
      metadata.memberCount ??
      0
    );
  }

  function getTeamLimit(team) {
    if (Number(team?.memberLimit || 0) > 0) return Number(team.memberLimit);
    return isTeamVerified(team) ? getVerifiedTeamLimit() : getCommonTeamLimit();
  }

  function getTournamentsPlayed(team) {
    return Number(team?.stats?.tournamentsPlayed || team?.stats?.tournaments || team?.metadata?.tournamentsPlayed || 0);
  }

  function getTitles(team) {
    return Number(team?.stats?.titles || team?.stats?.championships || 0);
  }

  function getPodiums(team) {
    return Number(team?.stats?.podiums || 0);
  }

  function formatPrize(stats) {
    const amount = Number(stats?.prizeAmount || 0);
    const currency = stats?.prizeCurrency || "BRL";

    if (!amount) return "R$ 0";

    if (currency === "BRL") {
      return amount.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
        maximumFractionDigits: 0
      });
    }

    return `${amount} ${currency}`;
  }

  function isRecruitingOpen(team) {
    const metadata = team?.metadata || {};
    const recruiting = team?.recruiting || metadata.recruiting || {};

    return Boolean(
      team?.isRecruiting ||
      team?.recruitingOpen ||
      metadata.recruitingOpen ||
      recruiting.open ||
      recruiting.status === "open" ||
      team?.status === "recruiting"
    );
  }

  function getLocationLabel(team) {
    const metadata = team?.metadata || {};
    const parts = [
      team?.city || metadata.city,
      team?.state || metadata.state,
      team?.country || metadata.country
    ].filter(Boolean);

    if (parts.length) return parts.join(" / ");

    if (metadata.region) return metadata.region;
    return "Região não informada";
  }

  function getFocusTags(team) {
    const teamType = getTeamPublicType(team);
    const tags = [];

    if (Array.isArray(teamType?.focusTags)) {
      tags.push(...teamType.focusTags);
    }

    getTeamGames(team).forEach((game) => {
      const category = getGameCategory(game);
      if (category) tags.push(category);
    });

    if (isSubteam(team)) tags.push("Academy");
    if (isRecruitingOpen(team)) tags.push("Recrutamento aberto");

    return Array.from(new Set(tags.filter(Boolean))).slice(0, 5);
  }

  function getAvailableTeamGames() {
    const gamesMap = new Map();

    state.teams.forEach((team) => {
      getTeamGames(team).forEach((game) => {
        if (typeof game === "string") {
          gamesMap.set(game, game);
          return;
        }

        const gameId = game.id || game.name || "";
        const gameName = game.name || game.id || "";

        if (gameId && gameName) {
          gamesMap.set(gameId, gameName);
        }
      });
    });

    return Array.from(gamesMap.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
  }

  function matchesTeamGame(team) {
    if (state.game === "all") return true;

    return getTeamGames(team).some((game) => {
      if (typeof game === "string") {
        return game === state.game;
      }

      return game.id === state.game || game.name === state.game;
    });
  }

  function matchesTeamStatus(team) {
    if (state.status === "all") return true;
    if (state.status === "verified") return isTeamVerified(team);
    if (state.status === "recruiting") return isRecruitingOpen(team);
    if (state.status === "subteams") return isSubteam(team);
    return true;
  }

  function getFilteredTeams() {
    const search = state.search.trim().toLowerCase();

    return state.teams.filter((team) => {
      const teamPublicType = getTeamPublicType(team);

      const gamesText = getTeamGames(team)
        .map((game) => {
          if (typeof game === "string") return game;
          return `${game.name || ""} ${game.category || ""} ${game.id || ""}`;
        })
        .join(" ");

      const tagsText = getFocusTags(team).join(" ");

      const haystack = [
        team?.name,
        team?.tag,
        team?.description,
        team?.bio,
        team?.captainName,
        team?.captainUserId,
        team?.source,
        getTeamPublicTypeLabel(team),
        teamPublicType?.descriptionText,
        tagsText,
        gamesText,
        getLocationLabel(team)
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = !search || haystack.includes(search);
      const matchesType = state.type === "all" || teamPublicType?.type === state.type;

      return matchesSearch && matchesType && matchesTeamGame(team) && matchesTeamStatus(team);
    });
  }

  function getSortedTeams(teams) {
    return teams.slice().sort((a, b) => {
      const scoreA = getTeamScore(a);
      const scoreB = getTeamScore(b);

      if (scoreA !== scoreB) return scoreB - scoreA;

      return String(a?.name || "").localeCompare(String(b?.name || ""), "pt-BR");
    });
  }

  function getTeamScore(team) {
    let score = 0;

    if (isTeamVerified(team)) score += 1000;
    if (!isSubteam(team)) score += 160;
    if (isRecruitingOpen(team)) score += 70;
    score += getTitles(team) * 45;
    score += getPodiums(team) * 18;
    score += getTournamentsPlayed(team) * 4;
    score += getTeamGames(team).length * 12;
    score += getMemberCount(team);

    return score;
  }

  function getFeaturedTeams() {
    const base = getSortedTeams(state.teams).filter((team) => {
      return isTeamVerified(team) || getTitles(team) > 0 || getTeamGames(team).length > 1;
    });

    const featured = base.length ? base : getSortedTeams(state.teams);
    return featured.slice(0, 3);
  }

  function renderLogo(team, className) {
    const logoUrl = safeImageUrl(team?.logoUrl || team?.logo_url || "");
    const tag = escapeHtml(team?.tag || "SW");

    if (logoUrl) {
      return `
        <div class="${className}">
          <img src="${escapeHtml(logoUrl)}" alt="Logo ${escapeHtml(team?.name || "Equipe")}" loading="lazy" />
        </div>
      `;
    }

    return `<div class="${className}"><span>${tag.slice(0, 4)}</span></div>`;
  }

  function renderStatusBadges(team) {
    const badges = [];

    if (isTeamVerified(team)) {
      badges.push(`<span class="sbw-team-badge-v2 sbw-team-badge-v2--verified">Verificada</span>`);
    }

    if (isSubteam(team)) {
      badges.push(`<span class="sbw-team-badge-v2">Subequipe</span>`);
    }

    if (isRecruitingOpen(team)) {
      badges.push(`<span class="sbw-team-badge-v2 sbw-team-badge-v2--success">Recrutando</span>`);
    }

    badges.push(`<span class="sbw-team-badge-v2">${escapeHtml(getTeamPublicTypeLabel(team))}</span>`);

    return badges.join("");
  }

  function renderGamePills(team, limit) {
    const games = getTeamGames(team);

    if (!games.length) {
      return `<span class="sbw-team-pill-v2">Sem modalidade</span>`;
    }

    return games
      .slice(0, limit || 4)
      .map((game) => `<span class="sbw-team-pill-v2">${escapeHtml(getGameLabel(game))}</span>`)
      .join("");
  }

  function renderFocusTags(team) {
    const tags = getFocusTags(team);

    if (!tags.length) return "";

    return tags
      .map((tag) => `<span class="sbw-team-focus-tag-v2">${escapeHtml(tag)}</span>`)
      .join("");
  }

  function renderTeamCard(team, options = {}) {
    const primary = safeColor(team?.theme?.primaryColor, "#38bdf8");
    const secondary = safeColor(team?.theme?.secondaryColor, "#0ea5e9");
    const bannerUrl = safeImageUrl(team?.bannerUrl || team?.banner_url || "");
    const teamId = getTeamId(team);
    const teamUrl = getTeamPublicUrl(team);
    const memberCount = getMemberCount(team);
    const memberLimit = getTeamLimit(team);
    const cardClass = options.featured ? "sbw-team-card-v2 sbw-team-card-v2--featured" : "sbw-team-card-v2";
    const assetFrameStyle = getTeamAssetFrameStyle(team);
    const cardStyle = `--team-primary: ${escapeHtml(primary)}; --team-secondary: ${escapeHtml(secondary)}; ${assetFrameStyle}`;
    const bannerStyle = bannerUrl
      ? `background-image: linear-gradient(90deg, rgba(3,8,20,.92), rgba(3,8,20,.35), rgba(3,8,20,.88)), url('${escapeHtml(bannerUrl)}');`
      : "";

    return `
      <article class="${cardClass}" style="${cardStyle}">
        <div class="sbw-team-card-v2__banner" style="${bannerStyle}"></div>

        <div class="sbw-team-card-v2__content">
          <div class="sbw-team-card-v2__top">
            ${renderLogo(team, "sbw-team-card-v2__logo")}

            <div class="sbw-team-card-v2__identity">
              <div class="sbw-team-card-v2__badges">
                ${renderStatusBadges(team)}
              </div>

              <h3>
                <span>${escapeHtml(team?.name || "Equipe SaberWolf")}</span>
                ${isTeamVerified(team) ? `<span class="sbw-verified-badge" title="${escapeHtml(getVerificationLabel(team))}">✓</span>` : ""}
              </h3>

              <p>${team?.tag ? `${escapeHtml(team.tag)} • ` : ""}${escapeHtml(getLocationLabel(team))}</p>
            </div>
          </div>

          <p class="sbw-team-card-v2__description">
            ${escapeHtml(team?.description || team?.bio || "Equipe pública cadastrada na plataforma -SBW-.")}
          </p>

          <div class="sbw-team-card-v2__focus">
            ${renderFocusTags(team)}
          </div>

          <div class="sbw-team-card-v2__games">
            ${renderGamePills(team, options.featured ? 5 : 4)}
          </div>

          <div class="sbw-team-card-v2__stats">
            <div>
              <strong>${memberCount || "—"}</strong>
              <span>Membros</span>
            </div>
            <div>
              <strong>${memberLimit}</strong>
              <span>Limite</span>
            </div>
            <div>
              <strong>${getTitles(team)}</strong>
              <span>Títulos</span>
            </div>
            <div>
              <strong>${getTournamentsPlayed(team)}</strong>
              <span>Torneios</span>
            </div>
          </div>

          <div class="sbw-team-card-v2__footer">
            <span class="sbw-team-card-v2__source">
              Perfil público
            </span>

            <a class="sbw-team-v2-btn sbw-team-v2-btn--primary" href="${teamUrl}">
              Ver equipe
              <span>→</span>
            </a>
          </div>
        </div>
      </article>
    `;
  }

  function renderTeamTypeFilter() {
    const select = document.querySelector("[data-teams-type-filter]");
    if (!select) return;

    const currentValue = select.value || state.type || "all";
    const options = getTeamTypeOptionsForFilter();

    select.innerHTML = `
      <option value="all">Todos os tipos</option>
      ${options
        .map((option) => `<option value="${escapeHtml(option.id)}">${escapeHtml(option.label)}</option>`)
        .join("")}
    `;

    select.value = options.some((option) => option.id === currentValue) ? currentValue : "all";
    state.type = select.value;
  }

  function renderTeamGameFilter() {
    const select = document.querySelector("[data-teams-game-filter]");
    if (!select) return;

    const currentValue = select.value || state.game || "all";
    const games = getAvailableTeamGames();

    select.innerHTML = `
      <option value="all">Todos os jogos</option>
      ${games
        .map((game) => `<option value="${escapeHtml(game.id)}">${escapeHtml(game.name)}</option>`)
        .join("")}
    `;

    select.value = games.some((game) => game.id === currentValue) ? currentValue : "all";
    state.game = select.value;
  }

  function renderStats() {
    const total = state.teams.length;
    const verified = state.teams.filter(isTeamVerified).length;
    const recruiting = state.teams.filter(isRecruitingOpen).length;
    const games = new Set();

    state.teams.forEach((team) => {
      getTeamGames(team).forEach((game) => {
        const label = getGameLabel(game);
        if (label) games.add(label);
      });
    });

    setText("[data-teams-stat-total]", total || "—");
    setText("[data-teams-stat-verified]", verified || "—");
    setText("[data-teams-stat-games]", games.size || "—");
    setText("[data-teams-stat-recruiting]", recruiting || "—");
  }

  function setText(selector, value) {
    const element = document.querySelector(selector);
    if (element) element.textContent = String(value);
  }

  function renderPageLoading(root, title, description, items = 1) {
    if (!root) return;

    const safeItems = Math.max(1, Number(items) || 1);
    const placeholders = Array.from({ length: safeItems })
      .map(() => `
        <div class="sbw-team-empty-v2">
          <strong>${escapeHtml(title || "Carregando")}</strong>
          <span>${escapeHtml(description || "Aguarde um instante.")}</span>
        </div>
      `)
      .join("");

    root.innerHTML = placeholders;
  }

  function renderPageError(root, title, description) {
    if (!root) return;

    root.innerHTML = `
      <div class="sbw-team-empty-v2 sbw-team-empty-v2--large">
        <strong>${escapeHtml(title || "Não foi possível carregar")}</strong>
        <span>${escapeHtml(description || "Tente atualizar a página em instantes.")}</span>
      </div>
    `;
  }

  function renderPageEmpty(root, title, description) {
    if (!root) return;

    root.innerHTML = `
      <div class="sbw-team-empty-v2 sbw-team-empty-v2--large">
        <strong>${escapeHtml(title || "Nenhum resultado encontrado")}</strong>
        <span>${escapeHtml(description || "Tente novamente mais tarde.")}</span>
      </div>
    `;
  }

  function renderFeaturedTeams() {
    const grid = document.querySelector("[data-teams-featured-grid]");
    if (!grid) return;

    if (state.loading) {
      renderPageLoading(grid, "Carregando destaques", "Buscando equipes verificadas, ativas e em destaque.", 3);
      return;
    }

    if (state.error) {
      renderPageError(grid, "Não foi possível carregar os destaques", state.error);
      return;
    }

    const teams = getFeaturedTeams();

    if (!teams.length) {
      renderPageEmpty(grid, "Nenhuma equipe em destaque", "As equipes verificadas ou mais ativas aparecerão aqui.");
      return;
    }

    grid.innerHTML = teams.map((team) => renderTeamCard(team, { featured: true })).join("");
  }

  function renderTeams() {
    const grid = document.querySelector("[data-teams-grid]");
    const count = document.querySelector("[data-teams-count]");

    if (!grid) {
      console.warn("[SaberWolf Teams] Elemento [data-teams-grid] não encontrado.");
      return;
    }

    if (state.loading) {
      grid.innerHTML = `<div class="sbw-team-empty-v2">Carregando equipes...</div>`;
      if (count) count.textContent = "Carregando equipes...";
      return;
    }

    if (state.error) {
      grid.innerHTML = `<div class="sbw-team-empty-v2">${escapeHtml(state.error)}</div>`;
      if (count) count.textContent = "Erro ao carregar equipes";
      return;
    }

    const teams = getSortedTeams(getFilteredTeams());

    if (count) {
      count.textContent = `${teams.length} equipe${teams.length === 1 ? "" : "s"} encontrada${teams.length === 1 ? "" : "s"}`;
    }

    if (!teams.length) {
      grid.innerHTML = `
        <div class="sbw-team-empty-v2 sbw-team-empty-v2--large">
          <strong>Nenhuma equipe encontrada</strong>
          <span>Tente limpar os filtros ou buscar por outro nome, tag, jogo ou modalidade.</span>
        </div>
      `;
      return;
    }

    grid.innerHTML = teams.map((team) => renderTeamCard(team)).join("");
  }

  function renderAll() {
    renderStats();
    renderTeams();
  }

  function clearFilters() {
    state.search = "";
    state.type = "all";
    state.game = "all";
    state.status = "all";

    const searchInput = document.querySelector("[data-teams-search]");
    const typeFilter = document.querySelector("[data-teams-type-filter]");
    const gameFilter = document.querySelector("[data-teams-game-filter]");
    const statusFilter = document.querySelector("[data-teams-status-filter]");

    if (searchInput) searchInput.value = "";
    if (typeFilter) typeFilter.value = "all";
    if (gameFilter) gameFilter.value = "all";
    if (statusFilter) statusFilter.value = "all";

    renderAll();
  }

  function bindEvents() {
    const searchInput = document.querySelector("[data-teams-search]");
    const typeFilter = document.querySelector("[data-teams-type-filter]");
    const gameFilter = document.querySelector("[data-teams-game-filter]");
    const statusFilter = document.querySelector("[data-teams-status-filter]");
    const clearButton = document.querySelector("[data-teams-clear-filters]");

    if (searchInput) {
      searchInput.addEventListener("input", () => {
        state.search = searchInput.value || "";
        renderTeams();
      });
    }

    if (typeFilter) {
      typeFilter.addEventListener("change", () => {
        state.type = typeFilter.value || "all";
        renderTeams();
      });
    }

    if (gameFilter) {
      gameFilter.addEventListener("change", () => {
        state.game = gameFilter.value || "all";
        renderTeams();
      });
    }

    if (statusFilter) {
      statusFilter.addEventListener("change", () => {
        state.status = statusFilter.value || "all";
        renderTeams();
      });
    }

    if (clearButton) {
      clearButton.addEventListener("click", clearFilters);
    }
  }

  async function loadTeams() {
    const storage = getStorage();

    if (!storage || typeof storage.getAllTeams !== "function") {
      state.error = "Storage de equipes não carregou. Verifique teams-storage.js e a ordem dos scripts.";
      state.teams = [];
      return;
    }

    const teams = await storage.getAllTeams();
    state.teams = Array.isArray(teams) ? teams : [];
  }

  async function init() {
    state.loading = true;
    renderAll();

    try {
      await loadTeams();
    } catch (error) {
      console.error("[SaberWolf Teams] Erro ao carregar equipes:", error);
      state.error = "Erro ao carregar equipes.";
      state.teams = [];
    }

    state.loading = false;

    renderTeamTypeFilter();
    renderTeamGameFilter();
    bindEvents();
    renderAll();

    requestAnimationFrame(() => {
      document.body.classList.remove("sbw-sidebar-no-transition");
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
