(function () {
  const models = window.SBWProfilesModels || {};

  const STORAGE_KEYS = {
    profiles: "sbw_profiles_v1_4_2",
    teamMembers: "sbw_team_members_v1_3_9"
  };

    const state = {
    profiles: [],
    teamMembers: [],
    search: "",
    type: "all",
    game: "all",
    teamStatus: "all",
    playerStatus: "all"
  };

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function readJson(key, fallback) {
    try {
      const raw = localStorage.getItem(key);

      if (!raw) {
        return fallback;
      }

      return JSON.parse(raw);
    } catch (error) {
      console.warn("Erro ao ler localStorage:", key, error);
      return fallback;
    }
  }

  function getProfilesStorage() {
    return window.SBWProfilesStorage || null;
  }

    /* =========================================================
     SaberWolf v1.5.5 - Filtro público por Status do Jogador
     ========================================================= */

  function getProfilesStorage() {
    return window.SBWProfilesStorage || null;
  }

  function getProfileId(profile) {
    return profile?.userId || profile?.id || "";
  }

  function getPlayerStatus(profile) {
    const storage = getProfilesStorage();

    if (!storage || typeof storage.getPlayerStatusByUserId !== "function") {
      return null;
    }

    return storage.getPlayerStatusByUserId(getProfileId(profile));
  }

  function getPlayerStatusOptions() {
    const storage = getProfilesStorage();

    if (!storage || typeof storage.getPlayerStatusOptions !== "function") {
      return [];
    }

    return storage.getPlayerStatusOptions();
  }

  function matchesPlayerStatus(profile) {
    if (state.playerStatus === "all") {
      return true;
    }

    const status = getPlayerStatus(profile);

    return status?.status === state.playerStatus;
  }

  function renderPlayerStatusFilter() {
    const select = document.querySelector("[data-profile-player-status-filter]");

    if (!select) {
      return;
    }

    const currentValue = select.value || "all";
    const options = getPlayerStatusOptions();

    select.innerHTML = `
      <option value="all">Todos os status</option>
      ${options
        .map((option) => {
          return `
            <option value="${escapeHtml(option.id)}">
              ${escapeHtml(option.label)}
            </option>
          `;
        })
        .join("")}
    `;

    select.value = options.some((option) => option.id === currentValue)
      ? currentValue
      : "all";

    state.playerStatus = select.value;
  }

  function renderPlayerStatusBadge(profile) {
    const status = getPlayerStatus(profile);

    if (!status) {
      return "";
    }

    return `
      <div class="sbw-profile-directory-status-row">
        <span class="sbw-profile-directory-status-badge sbw-player-status-${escapeHtml(status.status)}">
          ${escapeHtml(status.label)}
        </span>
      </div>
    `;
  }

  function getProfileTypeLabel(type) {
    if (typeof models.getProfileTypeLabel === "function") {
      return models.getProfileTypeLabel(type);
    }

    const labels = {
      player: "Jogador",
      creator: "Creator",
      organizer: "Organizador",
      staff: "Staff",
      admin: "Admin"
    };

    return labels[type] || "Perfil";
  }

  function getInitials(profile) {
    return String(profile.nickname || profile.displayName || "?")
      .slice(0, 2)
      .toUpperCase();
  }

  function getAvatarHtml(profile) {
    if (profile.avatarUrl) {
      return `
        <img src="${escapeHtml(profile.avatarUrl)}" alt="${escapeHtml(profile.displayName || "Avatar")}" />
      `;
    }

    return escapeHtml(getInitials(profile));
  }

  function getBannerStyle(profile) {
    if (!profile.bannerUrl) {
      return "";
    }

    return `
      style="background-image:
        linear-gradient(135deg, rgba(5, 11, 22, 0.24), rgba(5, 11, 22, 0.92)),
        url('${escapeHtml(profile.bannerUrl)}');"
    `;
  }

  function getGames(profile) {
    return Array.isArray(profile.mainGames) ? profile.mainGames : [];
  }

  function getTags(profile) {
    return Array.isArray(profile.roleTags) ? profile.roleTags : [];
  }

  function getProfileId(profile) {
    return profile.userId ||
      profile.id ||
      profile.slug ||
      profile.username ||
      "";
  }

  function getProfileSourceLabel(profile) {
    if (profile.source === "supabase") {
      return "Supabase";
    }

    return "Local-demo";
  }

  function getTeamFromProfile(profile) {
    if (profile.currentTeam && typeof profile.currentTeam === "object") {
      return profile.currentTeam;
    }

    if (Array.isArray(profile.currentTeams) && profile.currentTeams.length > 0) {
      return profile.currentTeams[0];
    }

    if (profile.currentTeamName || profile.teamName) {
      return {
        teamName: profile.currentTeamName || profile.teamName,
        teamTag: profile.currentTeamTag || profile.teamTag || "",
        teamId: profile.currentTeamId || profile.teamId || ""
      };
    }

    return null;
  }

  function getTeamMembership(profile) {
    const userId = getProfileId(profile);

    const localMembership = state.teamMembers.find((member) => {
      return (
        member.userId === userId &&
        (member.status || "active") === "active"
      );
    });

    if (localMembership) {
      return localMembership;
    }

    return getTeamFromProfile(profile);
  }

  function formatPrize(stats) {
    const amount = Number(stats?.prizeAmount || 0);
    const currency = stats?.prizeCurrency || "BRL";

    if (currency === "BRL") {
      return amount.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
      });
    }

    return `${amount} ${currency}`;
  }

    function getSearchText(profile) {
    const games = getGames(profile)
      .map((game) => {
        if (typeof game === "string") {
          return game;
        }

        return `${game.name || ""} ${game.category || ""}`;
      })
      .join(" ");

    const tags = getTags(profile).join(" ");
    const membership = getTeamMembership(profile);
    const playerStatus = getPlayerStatus(profile);

    return [
      profile.nickname,
      profile.displayName,
      profile.headline,
      profile.bio,
      profile.city,
      profile.state,
      profile.country,
      profile.profileType,
      games,
      tags,
      playerStatus?.label,
      playerStatus?.shortLabel,
      playerStatus?.availabilityText,
      Array.isArray(playerStatus?.preferredGames) ? playerStatus.preferredGames.join(" ") : "",
      Array.isArray(playerStatus?.lookingFor) ? playerStatus.lookingFor.join(" ") : "",
      Array.isArray(playerStatus?.preferredRoles) ? playerStatus.preferredRoles.join(" ") : "",
      membership?.teamName,
      membership?.teamTag,
      membership?.name,
      membership?.tag
    ]
      .join(" ")
      .toLowerCase();
  }

  function matchesGame(profile) {
    if (state.game === "all") {
      return true;
    }

    return getGames(profile).some((game) => {
      if (typeof game === "string") {
        return game === state.game;
      }

      return game.id === state.game || game.name === state.game;
    });
  }

  function matchesTeamStatus(profile) {
    if (state.teamStatus === "all") {
      return true;
    }

    const hasTeam = Boolean(getTeamMembership(profile));

    if (state.teamStatus === "with-team") {
      return hasTeam;
    }

    if (state.teamStatus === "free-agent") {
      return !hasTeam;
    }

    return true;
  }

  function getFilteredProfiles() {
    const query = state.search.trim().toLowerCase();

    return state.profiles.filter((profile) => {
      const matchesSearch = !query || getSearchText(profile).includes(query);
      const matchesType = state.type === "all" || profile.profileType === state.type;

        return (
        matchesSearch &&
        matchesType &&
        matchesGame(profile) &&
        matchesTeamStatus(profile) &&
        matchesPlayerStatus(profile)
      );
    });
  }

  function getAvailableGames() {
    const gamesMap = new Map();

    state.profiles.forEach((profile) => {
      getGames(profile).forEach((game) => {
        if (typeof game === "string") {
          gamesMap.set(game, game);
          return;
        }

        if (game.id && game.name) {
          gamesMap.set(game.id, game.name);
        }
      });
    });

    return Array.from(gamesMap.entries()).map(([id, name]) => {
      return { id, name };
    });
  }

  function renderGameFilter() {
    const select = document.querySelector("[data-profile-game-filter]");

    if (!select) {
      return;
    }

    const currentValue = select.value || "all";
    const games = getAvailableGames();

    select.innerHTML = `
      <option value="all">Todos os jogos</option>
      ${games
        .map((game) => {
          return `
            <option value="${escapeHtml(game.id)}">
              ${escapeHtml(game.name)}
            </option>
          `;
        })
        .join("")}
    `;

    select.value = games.some((game) => game.id === currentValue)
      ? currentValue
      : "all";

    state.game = select.value;
  }

  function getProfileStats(profile) {
    return profile.stats || {
      tournamentsPlayed: 0,
      wins: 0,
      podiums: 0,
      titles: 0,
      prizeAmount: 0,
      prizeCurrency: "BRL"
    };
  }

  function renderProfileCard(profile) {
    const membership = getTeamMembership(profile);
    const games = getGames(profile);
    const tags = getTags(profile);
    const stats = getProfileStats(profile);
    const profileId = getProfileId(profile);
    const profileUrl = `perfil.html?id=${encodeURIComponent(profileId)}`;

    const teamName =
      membership?.teamName ||
      membership?.name ||
      membership?.teamTag ||
      membership?.tag ||
      membership?.teamId ||
      "Equipe";

    return `
      <article class="sbw-profile-directory-card">
        <a class="sbw-profile-directory-cover" href="${profileUrl}" ${getBannerStyle(profile)}>
          <div class="sbw-profile-directory-avatar">
            ${getAvatarHtml(profile)}
          </div>

          <div>
            <span>${escapeHtml(getProfileTypeLabel(profile.profileType))}</span>
            <h2>${escapeHtml(profile.displayName || profile.nickname || "Perfil")}</h2>
            <p>@${escapeHtml(profile.nickname || profile.username || "jogador")}</p>
          </div>
        </a>

        <div class="sbw-profile-directory-body">
          <p>
            ${escapeHtml(profile.headline || profile.bio || "Perfil SaberWolf.")}
          </p>

          ${renderPlayerStatusBadge(profile)}

          <div class="sbw-profile-directory-tags">
            ${
              tags.length
                ? tags
                    .slice(0, 4)
                    .map((tag) => `<span>${escapeHtml(tag)}</span>`)
                    .join("")
                : `<span>Player</span>`
            }

            <span>${escapeHtml(getProfileSourceLabel(profile))}</span>
          </div>

          <div class="sbw-profile-directory-games">
            ${
              games.length
                ? games
                    .slice(0, 3)
                    .map((game) => {
                      const label = typeof game === "string" ? game : game.name;
                      return `<span>${escapeHtml(label)}</span>`;
                    })
                    .join("")
                : `<span>Nenhum jogo cadastrado</span>`
            }
          </div>

          <div class="sbw-profile-directory-team">
            ${
              membership
                ? `
                  <span>Equipe atual</span>
                  <strong>${escapeHtml(teamName)}</strong>
                `
                : `
                  <span>Status</span>
                  <strong>Sem equipe</strong>
                `
            }
          </div>

          <div class="sbw-profile-directory-stats">
            <div>
              <strong>${Number(stats.tournamentsPlayed || 0)}</strong>
              <span>Torneios</span>
            </div>

            <div>
              <strong>${Number(stats.titles || 0)}</strong>
              <span>Títulos</span>
            </div>

            <div>
              <strong>${Number(stats.podiums || 0)}</strong>
              <span>Pódios</span>
            </div>

            <div>
              <strong>${formatPrize(stats)}</strong>
              <span>Premiação</span>
            </div>
          </div>

          <a class="sbw-profile-directory-link" href="${profileUrl}">
            Ver perfil
          </a>
        </div>
      </article>
    `;
  }

  function renderLoading() {
    const root = document.querySelector("[data-profiles-list-root]");
    const total = document.querySelector("[data-profiles-total]");

    if (total) {
      total.textContent = "0";
    }

    if (!root) {
      return;
    }

    root.innerHTML = `
      <div class="sbw-empty-state">
        Carregando perfis...
      </div>
    `;
  }

  function renderProfiles() {
    const root = document.querySelector("[data-profiles-list-root]");
    const total = document.querySelector("[data-profiles-total]");

    if (!root) {
      return;
    }

    if (state.loading) {
      renderLoading();
      return;
    }

    const profiles = getFilteredProfiles();

    if (total) {
      total.textContent = profiles.length;
    }

    if (!profiles.length) {
      root.innerHTML = `
        <div class="sbw-empty-state">
          Nenhum perfil encontrado com os filtros atuais.
        </div>
      `;
      return;
    }

    root.innerHTML = `
      <div class="sbw-profile-directory-grid">
        ${profiles.map(renderProfileCard).join("")}
      </div>
    `;
  }

  function bindFilters() {
    const search = document.querySelector("[data-profile-search]");
    const type = document.querySelector("[data-profile-type-filter]");
    const game = document.querySelector("[data-profile-game-filter]");
    const team = document.querySelector("[data-profile-team-filter]");
    const playerStatus = document.querySelector("[data-profile-player-status-filter]");

    if (search) {
      search.addEventListener("input", function () {
        state.search = search.value || "";
        renderProfiles();
      });
    }

    if (type) {
      type.addEventListener("change", function () {
        state.type = type.value || "all";
        renderProfiles();
      });
    }

    if (game) {
      game.addEventListener("change", function () {
        state.game = game.value || "all";
        renderProfiles();
      });
    }

    if (team) {
      team.addEventListener("change", function () {
        state.teamStatus = team.value || "all";
        renderProfiles();
      });
    }

    if (playerStatus) {
      playerStatus.addEventListener("change", function () {
        state.playerStatus = playerStatus.value || "all";
        renderProfiles();
      });
    }
  }
  
  async function loadProfiles() {
    const storage = getProfilesStorage();

    if (storage && typeof storage.getProfilesAsync === "function") {
      state.profiles = await storage.getProfilesAsync();
    } else if (storage && typeof storage.getProfiles === "function") {
      state.profiles = storage.getProfiles();
    } else {
      const storedProfiles = readJson(STORAGE_KEYS.profiles, null);
      state.profiles = Array.isArray(storedProfiles) ? storedProfiles : [];
    }

    if (storage && typeof storage.getTeamMembers === "function") {
      state.teamMembers = storage.getTeamMembers();
    } else {
      const members = readJson(STORAGE_KEYS.teamMembers, []);
      state.teamMembers = Array.isArray(members) ? members : [];
    }

    if (!Array.isArray(state.profiles)) {
      state.profiles = [];
    }

    if (!Array.isArray(state.teamMembers)) {
      state.teamMembers = [];
    }
  }

    async function init() {
    state.loading = true;
    renderProfiles();

    try {
      await loadProfiles();
    } catch (error) {
      console.error("[SaberWolf Profiles] Erro ao carregar listagem de perfis:", error);
      state.profiles = [];
      state.teamMembers = [];
    }

    state.loading = false;

    renderGameFilter();
    renderPlayerStatusFilter();
    bindFilters();
    renderProfiles();
  }

  document.addEventListener("DOMContentLoaded", init);
})();