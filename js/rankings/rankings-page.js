(function () {
  const state = {
    snapshot: null,
    tab: "players",
    search: "",
    game: "all",
    organizer: "all",
    season: "all",
    globalStatus: "organizer",
    isLoading: false
  };

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function formatDateTime(value) {
    if (!value) {
      return "Agora";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return String(value);
    }

    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  function getRoot() {
    return document.querySelector("[data-rankings-root]");
  }

  function getRowsForCurrentTab() {
    if (!state.snapshot) {
      return [];
    }

    const rows = state.tab === "teams"
      ? state.snapshot.teams
      : state.snapshot.players;

    if (!window.SBWRankingsStorage || typeof window.SBWRankingsStorage.applyFilters !== "function") {
      return rows || [];
    }

    return window.SBWRankingsStorage.applyFilters(rows, {
      search: state.search
    });
  }

  function getRankClass(rank) {
    if (rank === 1) return "rank-gold";
    if (rank === 2) return "rank-silver";
    if (rank === 3) return "rank-bronze";
    return "";
  }

  function getProfileUrl(row) {
    const id = row.profileSlug || row.playerSlug || row.profileId || row.key || "";
    return id ? "../perfis/perfil.html?id=" + encodeURIComponent(id) : "../perfis/perfis.html";
  }

  function getTeamUrl(row) {
    const id = row.teamSlug || row.teamId || row.key || "";
    return id ? "../equipes/equipe.html?id=" + encodeURIComponent(id) : "../equipes/equipes.html";
  }

  function renderRecordChips(row) {
    const chips = [];

    (row.games || []).slice(0, 2).forEach(function (game) {
      chips.push(game);
    });

    (row.organizers || []).slice(0, 1).forEach(function (organizer) {
      chips.push(organizer);
    });

    (row.seasons || []).slice(0, 1).forEach(function (season) {
      chips.push("Temporada " + season);
    });

    return chips.map(function (chip) {
      return `<span>${escapeHtml(chip)}</span>`;
    }).join("");
  }

  function renderRow(row) {
    const isTeam = state.tab === "teams";
    const url = isTeam ? getTeamUrl(row) : getProfileUrl(row);
    const subtitle = isTeam
      ? "Equipe competitiva"
      : (row.teamName ? "Equipe atual: " + row.teamName : "Jogador competitivo");
    const recentRecord = Array.isArray(row.records) && row.records.length
      ? row.records.slice().sort(function (a, b) {
          return String(b.completedAt || "").localeCompare(String(a.completedAt || ""));
        })[0]
      : null;

    return `
      <article class="sbw-ranking-row ${getRankClass(row.rank)}">
        <div class="sbw-ranking-position">
          <strong>#${escapeHtml(row.rank)}</strong>
          <span>${escapeHtml(row.bestPlacementLabel || "")}</span>
        </div>

        <div class="sbw-ranking-identity">
          <a href="${escapeHtml(url)}" class="sbw-ranking-name">
            ${escapeHtml(row.name || "Competidor")}
          </a>
          <span>${escapeHtml(subtitle)}</span>
          ${recentRecord ? `
            <small>
              Último resultado: ${escapeHtml(recentRecord.placementLabel)} em ${escapeHtml(recentRecord.tournamentName)}
            </small>
          ` : ""}
        </div>

        <div class="sbw-ranking-tags">
          ${renderRecordChips(row)}
        </div>

        <div class="sbw-ranking-stats">
          <div>
            <strong>${escapeHtml(row.points || 0)}</strong>
            <span>pontos</span>
          </div>
          <div>
            <strong>${escapeHtml(row.titles || 0)}</strong>
            <span>títulos</span>
          </div>
          <div>
            <strong>${escapeHtml(row.podiums || 0)}</strong>
            <span>pódios</span>
          </div>
          <div>
            <strong>${escapeHtml(row.top8 || 0)}</strong>
            <span>top 8</span>
          </div>
        </div>
      </article>
    `;
  }

  function renderScoringTable() {
    const storage = window.SBWRankingsStorage || {};

    if (state.tab === "teams") {
      const points = storage.teamPoints || {};

      return `
        <div class="sbw-ranking-scoring-grid">
          ${Object.keys(points).map(function (placement) {
            return `
              <div class="sbw-ranking-score-pill">
                <strong>${escapeHtml(placement)}º</strong>
                <span>${escapeHtml(points[placement])} pts</span>
              </div>
            `;
          }).join("")}
        </div>
      `;
    }

    const tiers = storage.playerScoringTiers || [];

    return `
      <div class="sbw-ranking-scoring-grid">
        ${tiers.map(function (tier) {
          return `
            <div class="sbw-ranking-score-pill">
              <strong>${escapeHtml(tier.label)}</strong>
              <span>${escapeHtml(tier.points)} pts</span>
            </div>
          `;
        }).join("")}
      </div>
    `;
  }

  function renderSummary() {
    const snapshot = state.snapshot;

    if (!snapshot) {
      return "";
    }

    const summary = snapshot.summary || {};
    const sourceLabel = snapshot.source === "supabase" ? "Supabase" : "Local-demo";

    return `
      <section class="sbw-ranking-summary">
        <div>
          <span>Fonte</span>
          <strong>${escapeHtml(sourceLabel)}</strong>
        </div>
        <div>
          <span>Torneios no recorte</span>
          <strong>${escapeHtml(summary.completedTournaments || 0)}</strong>
        </div>
        <div>
          <span>Temporada</span>
          <strong>${escapeHtml(summary.activeSeason || "Todas")}</strong>
        </div>
        <div>
          <span>Jogadores</span>
          <strong>${escapeHtml(summary.rankedPlayers || 0)}</strong>
        </div>
        <div>
          <span>Equipes</span>
          <strong>${escapeHtml(summary.rankedTeams || 0)}</strong>
        </div>
      </section>
    `;
  }

  function renderScopeCard() {
    const snapshot = state.snapshot;

    if (!snapshot) {
      return "";
    }

    const filters = snapshot.filters || {};
    const scopeTitle = filters.organizer !== "all"
      ? "Ranking do organizador"
      : "Ranking geral visual da plataforma";
    const seasonLabel = filters.season !== "all" ? filters.season : "Todas as temporadas";
    const gameLabel = filters.game !== "all" ? filters.game : "Todos os jogos";
    const organizerLabel = filters.organizer !== "all" ? filters.organizer : "Todos os organizadores";

    return `
      <section class="sbw-ranking-scope-card">
        <div>
          <span>Recorte ativo</span>
          <h2>${escapeHtml(scopeTitle)}</h2>
          <p>
            O ranking agora é recalculado com base no recorte selecionado, não apenas filtrado visualmente.
            Isso prepara rankings próprios por organizador, temporada/circuito e jogo.
          </p>
        </div>

        <div class="sbw-ranking-scope-pills">
          <span>${escapeHtml(organizerLabel)}</span>
          <span>${escapeHtml(seasonLabel)}</span>
          <span>${escapeHtml(gameLabel)}</span>
        </div>
      </section>
    `;
  }

  function renderOptions(select, values, label, selectedValue) {
    if (!select) {
      return;
    }

    const currentValue = selectedValue || select.value || "all";

    select.innerHTML = `
      <option value="all">${escapeHtml(label)}</option>
      ${(values || []).map(function (value) {
        return `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`;
      }).join("")}
    `;

    select.value = (values || []).includes(currentValue) ? currentValue : "all";
  }

  function syncFilters() {
    const gameSelect = document.querySelector("[data-ranking-game-filter]");
    const organizerSelect = document.querySelector("[data-ranking-organizer-filter]");
    const seasonSelect = document.querySelector("[data-ranking-season-filter]");

    if (!state.snapshot) {
      return;
    }

    renderOptions(gameSelect, state.snapshot.options?.games || [], "Todos os jogos", state.game);
    renderOptions(organizerSelect, state.snapshot.options?.organizers || [], "Todos os organizadores", state.organizer);
    renderOptions(seasonSelect, state.snapshot.options?.seasons || [], "Todas as temporadas", state.season);
  }

  function render() {
    const root = getRoot();

    if (!root) {
      return;
    }

    if (!state.snapshot) {
      root.innerHTML = `
        <div class="sbw-ranking-empty">
          Carregando rankings competitivos...
        </div>
      `;
      return;
    }

    const rows = getRowsForCurrentTab();
    const snapshot = state.snapshot;
    const title = state.tab === "teams" ? "Ranking de equipes" : "Ranking de jogadores";
    const description = state.tab === "teams"
      ? "Pontuação por equipe usa o modelo reduzido estilo EWC e considera apenas o melhor colocado da equipe em cada torneio."
      : "Pontuação individual usa o preset Capcom/World Warrior, somada a partir dos resultados finais oficiais dos torneios concluídos.";

    root.innerHTML = `
      ${renderSummary()}
      ${renderScopeCard()}

      <section class="sbw-ranking-rules-card">
        <div>
          <span>Sistema de pontuação</span>
          <h2>${state.tab === "teams" ? "Equipes: modelo reduzido estilo EWC" : "Jogadores: preset Capcom/World Warrior"}</h2>
          <p>
            Este ranking usa torneios com status <strong>completed</strong> e <strong>settings.finalResults</strong>.
            Organizadores podem usar rankings próprios; o ranking global/oficial SBW continuará preparado para aprovação administrativa futura.
          </p>
        </div>
        ${renderScoringTable()}
      </section>

      <section class="sbw-ranking-board">
        <div class="sbw-ranking-board-header">
          <div>
            <span>Classificação</span>
            <h2>${escapeHtml(title)}</h2>
            <p>${escapeHtml(description)}</p>
          </div>
          <small>Atualizado em ${escapeHtml(formatDateTime(snapshot.generatedAt))}</small>
        </div>

        <div class="sbw-ranking-tabs" role="tablist">
          <button type="button" class="${state.tab === "players" ? "is-active" : ""}" data-ranking-tab="players">
            Jogadores
          </button>
          <button type="button" class="${state.tab === "teams" ? "is-active" : ""}" data-ranking-tab="teams">
            Equipes
          </button>
        </div>

        <div class="sbw-ranking-list">
          ${state.isLoading ? `
            <div class="sbw-ranking-empty">
              Atualizando recorte do ranking...
            </div>
          ` : rows.length ? rows.map(renderRow).join("") : `
            <div class="sbw-ranking-empty">
              Nenhum resultado encontrado para os filtros atuais.
            </div>
          `}
        </div>
      </section>
    `;
  }

  function getRankingFilters() {
    return {
      game: state.game,
      organizer: state.organizer,
      season: state.season,
      globalStatus: state.globalStatus
    };
  }

  async function loadRankings() {
    const root = getRoot();

    if (!root) {
      return;
    }

    if (!window.SBWRankingsStorage || typeof window.SBWRankingsStorage.getRankingSnapshotAsync !== "function") {
      root.innerHTML = `
        <div class="sbw-ranking-empty">
          O módulo de rankings não foi carregado corretamente.
        </div>
      `;
      return;
    }

    state.isLoading = true;
    render();

    try {
      state.snapshot = await window.SBWRankingsStorage.getRankingSnapshotAsync(getRankingFilters());
      syncFilters();
    } catch (error) {
      console.error("[SaberWolf Rankings] Erro ao carregar rankings:", error);
      root.innerHTML = `
        <div class="sbw-ranking-empty">
          Não foi possível carregar os rankings agora. Verifique o Console para detalhes.
        </div>
      `;
      return;
    } finally {
      state.isLoading = false;
    }

    render();
  }

  function bindEvents() {
    const searchInput = document.querySelector("[data-ranking-search]");
    const gameSelect = document.querySelector("[data-ranking-game-filter]");
    const organizerSelect = document.querySelector("[data-ranking-organizer-filter]");
    const seasonSelect = document.querySelector("[data-ranking-season-filter]");
    const root = getRoot();

    if (searchInput) {
      searchInput.addEventListener("input", function () {
        state.search = searchInput.value || "";
        render();
      });
    }

    if (gameSelect) {
      gameSelect.addEventListener("change", function () {
        state.game = gameSelect.value || "all";
        loadRankings();
      });
    }

    if (organizerSelect) {
      organizerSelect.addEventListener("change", function () {
        state.organizer = organizerSelect.value || "all";
        loadRankings();
      });
    }

    if (seasonSelect) {
      seasonSelect.addEventListener("change", function () {
        state.season = seasonSelect.value || "all";
        loadRankings();
      });
    }

    if (root) {
      root.addEventListener("click", function (event) {
        const tabButton = event.target.closest("[data-ranking-tab]");

        if (!tabButton) {
          return;
        }

        state.tab = tabButton.dataset.rankingTab || "players";
        render();
      });
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    bindEvents();
    loadRankings();
  });
})();
