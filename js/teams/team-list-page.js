(function () {
  const state = {
  teams: [],
  search: "",
  type: "all",
  game: "all",
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

  function getVerifiedStatus() {
    const config = getConfig();
    return config.verificationStatus?.verified || "verified";
  }

  function getSubteamType() {
    const config = getConfig();
    return config.teamTypes?.subteam || config.teamTypes?.subTeam || "subteam";
  }

  function getTeamTypeLabel(team) {
    const models = getModels();

    if (typeof models.getTeamTypeLabel === "function") {
      return models.getTeamTypeLabel(team);
    }

    if (team.teamType === getSubteamType()) {
      return "Subequipe";
    }

    return "Equipe principal";
  }

    /* =========================================================
     SaberWolf v1.5.4 - Tipo público nos cards de equipes
     ========================================================= */

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

  function renderTeamPublicTypeBadge(teamType) {
    if (!teamType) {
      return "";
    }

    return `
      <span class="sbw-team-list-type-badge sbw-team-list-type-${escapeHtml(teamType.type)}">
        ${escapeHtml(teamType.label)}
      </span>
    `;
  }

  function renderTeamPublicTypeTags(teamType) {
    if (!teamType || !Array.isArray(teamType.focusTags) || !teamType.focusTags.length) {
      return "";
    }

    return `
      <div class="sbw-team-list-type-tags">
        ${teamType.focusTags
          .slice(0, 4)
          .map(function (tag) {
            return `<span>${escapeHtml(tag)}</span>`;
          })
          .join("")}
      </div>
    `;
  }

  function getTeamTypeOptionsForFilter() {
  const storage = getStorage();

  if (!storage || typeof storage.getTeamTypeOptions !== "function") {
    return [];
  }

  const options = storage.getTeamTypeOptions();

  return Array.isArray(options) ? options : [];
}

function renderTeamTypeFilter() {
  const select = document.querySelector("[data-teams-type-filter]");

  if (!select) {
    return;
  }

  const currentValue = select.value || state.type || "all";
  const options = getTeamTypeOptionsForFilter();

  select.innerHTML = `
    <option value="all">Todos os tipos</option>
    ${options
      .map(function (option) {
        return `
          <option value="${escapeHtml(option.id)}">
            ${escapeHtml(option.label)}
          </option>
        `;
      })
      .join("")}
  `;

  select.value = options.some(function (option) {
    return option.id === currentValue;
  })
    ? currentValue
    : "all";

  state.type = select.value;
}

function getAvailableTeamGames() {
  const gamesMap = new Map();

  state.teams.forEach(function (team) {
    getTeamGames(team).forEach(function (game) {
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

  return Array.from(gamesMap.entries()).map(function ([id, name]) {
    return { id, name };
  });
}

function renderTeamGameFilter() {
  const select = document.querySelector("[data-teams-game-filter]");

  if (!select) {
    return;
  }

  const currentValue = select.value || state.game || "all";
  const games = getAvailableTeamGames();

  select.innerHTML = `
    <option value="all">Todos os jogos</option>
    ${games
      .map(function (game) {
        return `
          <option value="${escapeHtml(game.id)}">
            ${escapeHtml(game.name)}
          </option>
        `;
      })
      .join("")}
  `;

  select.value = games.some(function (game) {
    return game.id === currentValue;
  })
    ? currentValue
    : "all";

  state.game = select.value;
}

function matchesTeamGame(team) {
  if (state.game === "all") {
    return true;
  }

  return getTeamGames(team).some(function (game) {
    if (typeof game === "string") {
      return game === state.game;
    }

    return game.id === state.game || game.name === state.game;
  });
}

  function getVerificationLabel(team) {
    const models = getModels();

    if (typeof models.getVerificationLabel === "function") {
      return models.getVerificationLabel(team);
    }

    if (team.verificationStatus === getVerifiedStatus() || team.isVerified) {
      return "Equipe verificada";
    }

    return "Equipe não verificada";
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

  function getTeamId(team) {
    return team.slug || team.id || team.teamId || "";
  }

  function getTeamGames(team) {
    return Array.isArray(team.games) ? team.games : [];
  }

  function getFilteredTeams() {
  const search = state.search.trim().toLowerCase();

  return state.teams.filter((team) => {
    const teamPublicType = getTeamPublicType(team);

    const gamesText = getTeamGames(team)
      .map((game) => {
        if (typeof game === "string") {
          return game;
        }

        return `${game.name || ""} ${game.category || ""}`;
      })
      .join(" ");

    const haystack = [
      team.name,
      team.tag,
      team.description,
      team.bio,
      team.captainName,
      team.captainUserId,
      team.source,
      teamPublicType?.label,
      teamPublicType?.shortLabel,
      teamPublicType?.descriptionText,
      Array.isArray(teamPublicType?.focusTags) ? teamPublicType.focusTags.join(" ") : "",
      gamesText
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch = !search || haystack.includes(search);
    const matchesType = state.type === "all" || teamPublicType?.type === state.type;
    const matchesGame = matchesTeamGame(team);

    return matchesSearch && matchesType && matchesGame;
  });
}

  function renderTeamCard(team) {
    const isVerified =
      team.verificationStatus === getVerifiedStatus() ||
      team.isVerified === true;

    const isSubteam = team.teamType === getSubteamType();
    const teamPublicType = getTeamPublicType(team);

    const games = getTeamGames(team);

    const primary = team.theme?.primaryColor || "#00e5ff";
    const secondary = team.theme?.secondaryColor || "#7c3cff";

    const teamId = getTeamId(team);
    const teamUrl = `equipe.html?id=${encodeURIComponent(teamId)}`;
    const manageUrl = `minha-equipe.html?id=${encodeURIComponent(teamId)}`;

    return `
      <article 
        class="sbw-team-card"
        style="--team-primary: ${escapeHtml(primary)}; --team-secondary: ${escapeHtml(secondary)};"
      >
        <div class="sbw-team-card-inner">
          <div class="sbw-team-card-banner"></div>

          <div class="sbw-team-card-head">
            <div class="sbw-team-logo">
              ${escapeHtml(team.tag || "?")}
            </div>

            <div class="sbw-team-name-wrap">
              <h3 class="sbw-team-name">
                <span>${escapeHtml(team.name || "Equipe SaberWolf")}</span>
                ${
                  isVerified
                    ? `<span class="sbw-verified-badge" title="${escapeHtml(getVerificationLabel(team))}">✓</span>`
                    : ""
                }
              </h3>

              <div class="sbw-team-tag">
                ${team.tag ? `${escapeHtml(team.tag)} | ` : ""}
                ${escapeHtml(getTeamTypeLabel(team))}
              </div>

              ${renderTeamPublicTypeBadge(teamPublicType)}
            </div>
          </div>

          ${
            isSubteam
              ? `<span class="sbw-subteam-badge">Subequipe</span>`
              : ""
          }

          <p class="sbw-team-description">
            ${escapeHtml(team.description || team.bio || "Equipe competitiva da plataforma SaberWolf.")}
          </p>

          ${renderTeamPublicTypeTags(teamPublicType)}

          <div class="sbw-team-stats">
            <div class="sbw-team-stat">
              <strong>${Number(team.stats?.titles || 0)}</strong>
              <span>Títulos</span>
            </div>

            <div class="sbw-team-stat">
              <strong>${Number(team.stats?.podiums || 0)}</strong>
              <span>Pódios</span>
            </div>

            <div class="sbw-team-stat">
              <strong>${escapeHtml(formatPrize(team.stats))}</strong>
              <span>Premiação SBW</span>
            </div>
          </div>

          <div class="sbw-team-games">
            ${
              games.length
                ? games
                    .slice(0, 4)
                    .map((game) => {
                      const label = typeof game === "string" ? game : game.name;
                      return `<span class="sbw-team-game-pill">${escapeHtml(label || "Jogo")}</span>`;
                    })
                    .join("")
                : `<span class="sbw-team-game-pill">Sem modalidades cadastradas</span>`
            }

            ${
              team.source === "supabase"
                ? `<span class="sbw-team-game-pill">Supabase</span>`
                : `<span class="sbw-team-game-pill">Local-demo</span>`
            }
          </div>

          <div class="sbw-teams-actions">
            <a class="sbw-team-btn sbw-team-btn-primary" href="${teamUrl}">
              Ver equipe
            </a>

            <a class="sbw-team-btn" href="${manageUrl}">
              Gerenciar
            </a>
          </div>
        </div>
      </article>
    `;
  }

  function renderTeams() {
    const grid = document.querySelector("[data-teams-grid]");
    const count = document.querySelector("[data-teams-count]");

    if (!grid) {
      console.warn("[SaberWolf Teams] Elemento [data-teams-grid] não encontrado.");
      return;
    }

    if (state.loading) {
      grid.innerHTML = `
        <div class="sbw-empty-state">
          Carregando equipes...
        </div>
      `;

      if (count) {
        count.textContent = "Carregando equipes...";
      }

      return;
    }

    if (state.error) {
      grid.innerHTML = `
        <div class="sbw-empty-state">
          ${escapeHtml(state.error)}
        </div>
      `;

      if (count) {
        count.textContent = "Erro ao carregar equipes";
      }

      return;
    }

    const teams = getFilteredTeams();

    if (count) {
      count.textContent = `${teams.length} equipe${teams.length === 1 ? "" : "s"} encontrada${teams.length === 1 ? "" : "s"}`;
    }

    if (!teams.length) {
      grid.innerHTML = `
        <div class="sbw-empty-state">
          Nenhuma equipe encontrada com os filtros atuais.
        </div>
      `;
      return;
    }

    grid.innerHTML = teams.map(renderTeamCard).join("");
  }

  function bindEvents() {
  const searchInput = document.querySelector("[data-teams-search]");
const typeFilter = document.querySelector("[data-teams-type-filter]");
const gameFilter = document.querySelector("[data-teams-game-filter]");

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      state.search = searchInput.value || "";
      renderTeams();
    });
  }

  if (typeFilter) {
    typeFilter.addEventListener("change", function () {
      state.type = typeFilter.value || "all";
      renderTeams();
    });
  }
  if (gameFilter) {
  gameFilter.addEventListener("change", function () {
    state.game = gameFilter.value || "all";
    renderTeams();
  });
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
  renderTeams();

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
renderTeams();
}

document.addEventListener("DOMContentLoaded", init);
})();