(function () {
  "use strict";

  const state = {
    snapshot: null,
    currentUser: null,
    currentProfile: null,
    currentTeamKeys: new Set(),
    selectedOrganizer: "all",
    selectedTournament: "",
    search: "",
    isLoading: false
  };

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function asArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function normalizeText(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  }

  function normalizeKey(value) {
    return normalizeText(value).replace(/\s+/g, "-");
  }

  function wait(ms) {
    return new Promise(function (resolve) {
      setTimeout(resolve, ms);
    });
  }

  async function waitForSupabaseClient() {
    for (let attempt = 0; attempt < 30; attempt += 1) {
      const client = window.SBWSupabase?.client;

      if (client?.auth) {
        return client;
      }

      await wait(100);
    }

    return null;
  }

  async function getCurrentUserSafely() {
    try {
      const client = await waitForSupabaseClient();

      if (client?.auth?.getSession) {
        const sessionResult = await client.auth.getSession();
        const sessionUser = sessionResult?.data?.session?.user;

        if (sessionUser) return sessionUser;
      }

      if (client?.auth?.getUser) {
        const userResult = await client.auth.getUser();
        const user = userResult?.data?.user;

        if (user) return user;
      }
    } catch (error) {
      console.warn("[SBW Rankings] Não foi possível carregar usuário atual:", error);
    }

    return null;
  }

  async function getCurrentProfileSafely(user) {
    if (!user) return null;

    try {
      const client = await waitForSupabaseClient();

      if (!client) return null;

      const result = await client
        .from("profiles")
        .select("*")
        .eq("auth_user_id", user.id)
        .maybeSingle();

      if (result.error) {
        console.warn("[SBW Rankings] Não foi possível buscar profile atual:", result.error);
        return null;
      }

      return result.data || null;
    } catch (error) {
      console.warn("[SBW Rankings] Erro ao buscar profile atual:", error);
      return null;
    }
  }

  function getProfileKeys(profile, user) {
    const metadata = user?.user_metadata || {};

    return [
      user?.id,
      user?.email,
      user?.email?.split("@")[0],
      metadata.display_name,
      metadata.full_name,
      metadata.name,
      metadata.nickname,
      profile?.id,
      profile?.slug,
      profile?.username,
      profile?.display_name,
      profile?.displayName,
      profile?.nickname
    ]
      .map(normalizeKey)
      .filter(Boolean);
  }

  async function getCurrentTeamKeysSafely(profile) {
    const keys = new Set();

    if (!profile) return keys;

    const profileCandidates = [
      profile.slug,
      profile.username,
      profile.id,
      profile.user_id,
      profile.auth_user_id
    ].filter(Boolean);

    if (!profileCandidates.length) return keys;

    try {
      const client = await waitForSupabaseClient();

      if (!client) return keys;

      const tableName = window.SBWSupabaseConfig?.tables?.teamMembers || "team_members";

      for (const profileKey of profileCandidates.slice(0, 2)) {
        const result = await client
          .from(tableName)
          .select("team_slug, team_id, status")
          .eq("profile_slug", profileKey)
          .limit(10);

        if (!result.error && Array.isArray(result.data)) {
          result.data.forEach(function (row) {
            if (!row.status || String(row.status).toLowerCase() === "active") {
              if (row.team_slug) keys.add(normalizeKey(row.team_slug));
              if (row.team_id) keys.add(normalizeKey(row.team_id));
            }
          });
        }
      }
    } catch (error) {
      console.warn("[SBW Rankings] Não foi possível buscar equipes do usuário:", error);
    }

    return keys;
  }

  function formatDate(value) {
    if (!value) return "Data não definida";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return String(value);

    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  }

  function formatDateTime(value) {
    if (!value) return "Agora";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return String(value);

    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  function formatNumber(value) {
    const number = Number(value || 0);

    if (!Number.isFinite(number)) return String(value || 0);

    return number.toLocaleString("pt-BR");
  }

  function getRankClass(rank) {
    if (rank === 1) return "rank-gold";
    if (rank === 2) return "rank-silver";
    if (rank === 3) return "rank-bronze";
    return "";
  }

  function getMedalLabel(rank) {
    if (rank === 1) return "Ouro";
    if (rank === 2) return "Prata";
    if (rank === 3) return "Bronze";
    return "Rank";
  }

  function getProfileUrl(row) {
    const id = row.profileSlug || row.playerSlug || row.profileId || row.key || "";
    return id ? "../perfis/perfil.html?id=" + encodeURIComponent(id) : "../perfis/perfis.html";
  }

  function getTeamUrl(row) {
    const id = row.teamSlug || row.teamId || row.key || "";
    return id ? "../equipes/equipe.html?id=" + encodeURIComponent(id) : "../equipes/equipes.html";
  }

  function getTournamentUrl(value) {
    return "../torneios/detalhe-torneio.html?id=" + encodeURIComponent(value || "");
  }

  function uniqueStrings(values) {
    const seen = new Set();
    const result = [];

    asArray(values).forEach(function (value) {
      const safeValue = String(value || "").trim();

      if (!safeValue || seen.has(safeValue)) return;

      seen.add(safeValue);
      result.push(safeValue);
    });

    return result;
  }

  function isCurrentPlayerRow(row) {
    const currentKeys = new Set(getProfileKeys(state.currentProfile, state.currentUser));

    if (!currentKeys.size) return false;

    const rowKeys = [
      row.authUserId,
      row.profileId,
      row.profileSlug,
      row.playerSlug,
      row.playerId,
      row.key,
      row.name
    ].map(normalizeKey).filter(Boolean);

    return rowKeys.some(function (key) {
      return currentKeys.has(key);
    });
  }

  function isCurrentTeamRow(row) {
    if (!state.currentTeamKeys.size) return false;

    const rowKeys = [
      row.teamSlug,
      row.teamId,
      row.key,
      row.name
    ].map(normalizeKey).filter(Boolean);

    return rowKeys.some(function (key) {
      return state.currentTeamKeys.has(key);
    });
  }

  function isCurrentRow(row, type) {
    return type === "team" ? isCurrentTeamRow(row) : isCurrentPlayerRow(row);
  }

  function getStat(selector) {
    return document.querySelector(selector);
  }

  function setText(selector, value) {
    const element = getStat(selector);
    if (element) element.textContent = value;
  }

  function renderMetricCards() {
    const summary = state.snapshot?.summary || {};
    const options = state.snapshot?.options || {};
    const tournaments = asArray(state.snapshot?.tournaments);

    setText("[data-ranking-stat-players]", formatNumber(summary.rankedPlayers || 0));
    setText("[data-ranking-stat-teams]", formatNumber(summary.rankedTeams || 0));
    setText("[data-ranking-stat-organizers]", formatNumber(asArray(options.organizers).length || 0));
    setText("[data-ranking-stat-tournaments]", formatNumber(summary.allCompletedTournaments || tournaments.length || 0));
  }

  function renderTopRow(row, type, compact) {
    const isTeam = type === "team";
    const url = isTeam ? getTeamUrl(row) : getProfileUrl(row);
    const current = isCurrentRow(row, type);
    const subtitleParts = [];

    if (!isTeam && row.teamName) subtitleParts.push(row.teamName);
    if (Array.isArray(row.games) && row.games[0]) subtitleParts.push(row.games[0]);
    if (Array.isArray(row.organizers) && row.organizers[0]) subtitleParts.push(row.organizers[0]);

    return `
      <article class="sbw-rank-item ${compact ? "is-compact" : ""} ${getRankClass(row.rank)} ${current ? "is-current-user" : ""}">
        <div class="sbw-rank-position">
          <strong>#${escapeHtml(row.rank || "-")}</strong>
          <span>${escapeHtml(getMedalLabel(row.rank))}</span>
        </div>

        <div class="sbw-rank-namebox">
          <a href="${escapeHtml(url)}" class="sbw-rank-name">
            ${escapeHtml(row.name || (isTeam ? "Equipe" : "Jogador"))}
          </a>
          <small>${escapeHtml(subtitleParts.filter(Boolean).join(" • ") || (isTeam ? "Equipe competitiva" : "Jogador competitivo"))}</small>
          ${current ? `<em>Você</em>` : ""}
        </div>

        <div class="sbw-rank-points">
          <strong>${escapeHtml(row.points || 0)}</strong>
          <span>pts</span>
        </div>

        ${compact ? "" : `
          <div class="sbw-rank-extra">
            <span>${escapeHtml(row.titles || 0)} títulos</span>
            <span>${escapeHtml(row.podiums || 0)} pódios</span>
            <span>${escapeHtml(row.events || 0)} eventos</span>
          </div>
        `}
      </article>
    `;
  }

  function renderList(rows, type, options) {
    const safeOptions = options || {};
    const limit = safeOptions.limit || 6;
    const empty = safeOptions.empty || "Nenhum resultado ranqueado encontrado.";
    const compact = Boolean(safeOptions.compact);
    const visibleRows = asArray(rows).slice(0, limit);

    if (!visibleRows.length) {
      return `<div class="sbw-ranking-empty">${escapeHtml(empty)}</div>`;
    }

    return `
      <div class="sbw-rank-list ${compact ? "is-compact" : ""}">
        ${visibleRows.map(function (row) {
          return renderTopRow(row, type, compact);
        }).join("")}
      </div>
    `;
  }

  function renderGlobalBlocks() {
    const playersRoot = document.querySelector("[data-ranking-global-players]");
    const teamsRoot = document.querySelector("[data-ranking-global-teams]");
    const updatedRoot = document.querySelector("[data-ranking-updated-at]");

    if (!state.snapshot) return;

    if (playersRoot) {
      playersRoot.innerHTML = renderList(state.snapshot.players, "player", {
        limit: 5,
        compact: true,
        empty: "Nenhum jogador pontuou ainda no ranking global."
      });
    }

    if (teamsRoot) {
      teamsRoot.innerHTML = renderList(state.snapshot.teams, "team", {
        limit: 5,
        compact: true,
        empty: "Nenhuma equipe pontuou ainda no ranking global."
      });
    }

    if (updatedRoot) {
      updatedRoot.textContent = "Atualizado em " + formatDateTime(state.snapshot.generatedAt);
    }
  }

  function renderSelectOptions(select, values, placeholder, selectedValue) {
    if (!select) return;

    const current = selectedValue || select.value || "";

    select.innerHTML = `
      <option value="">${escapeHtml(placeholder)}</option>
      ${asArray(values).map(function (value) {
        return `<option value="${escapeHtml(value.value)}">${escapeHtml(value.label)}</option>`;
      }).join("")}
    `;

    select.value = asArray(values).some(function (value) { return value.value === current; }) ? current : "";
  }

  function getOrganizerOptions() {
    return asArray(state.snapshot?.options?.organizers).map(function (organizer) {
      return { value: organizer, label: organizer };
    });
  }

  function getTournamentOptions() {
    const map = new Map();

    asArray(state.snapshot?.records).forEach(function (record) {
      const value = record.tournamentSlug || record.tournamentId || record.tournamentName;
      if (!value || map.has(value)) return;

      map.set(value, {
        value,
        label: [record.tournamentName || "Torneio", record.gameName, record.organizerName]
          .filter(Boolean)
          .join(" • "),
        completedAt: record.completedAt || ""
      });
    });

    return Array.from(map.values()).sort(function (a, b) {
      return String(b.completedAt || "").localeCompare(String(a.completedAt || ""));
    });
  }

  function syncBlockSelects() {
    renderSelectOptions(
      document.querySelector("[data-ranking-organizer-select]"),
      getOrganizerOptions(),
      "Selecionar organizador",
      state.selectedOrganizer
    );

    renderSelectOptions(
      document.querySelector("[data-ranking-tournament-select]"),
      getTournamentOptions(),
      "Selecionar torneio",
      state.selectedTournament
    );
  }

  async function getOrganizerSnapshot() {
    if (!state.selectedOrganizer) return null;

    if (!window.SBWRankingsStorage?.getRankingSnapshotAsync) return null;

    return window.SBWRankingsStorage.getRankingSnapshotAsync({
      organizer: state.selectedOrganizer,
      game: "all",
      season: "all",
      globalStatus: "organizer"
    });
  }

  async function updateOrganizerBlock() {
    const root = document.querySelector("[data-ranking-organizer-body]");

    if (!root) return;

    if (!state.selectedOrganizer) {
      root.innerHTML = `
        <div class="sbw-ranking-empty">
          Selecione um organizador para visualizar o ranking acumulado dele.
        </div>
      `;
      return;
    }

    root.innerHTML = `<div class="sbw-ranking-empty">Atualizando ranking do organizador...</div>`;

    try {
      const snapshot = await getOrganizerSnapshot();
      const summary = snapshot?.summary || {};

      root.innerHTML = `
        <div class="sbw-organizer-rank-header">
          <div>
            <span>Organizador selecionado</span>
            <h3>${escapeHtml(state.selectedOrganizer)}</h3>
            <p>${escapeHtml(summary.completedTournaments || 0)} torneios pontuando neste recorte.</p>
          </div>
          <div class="sbw-organizer-rank-badge">Ranking do organizador</div>
        </div>

        <div class="sbw-dual-rank-grid">
          <section>
            <h4>Top jogadores</h4>
            ${renderList(snapshot?.players || [], "player", {
              limit: 5,
              compact: true,
              empty: "Nenhum jogador pontuou neste organizador."
            })}
          </section>

          <section>
            <h4>Top equipes</h4>
            ${renderList(snapshot?.teams || [], "team", {
              limit: 5,
              compact: true,
              empty: "Nenhuma equipe pontuou neste organizador."
            })}
          </section>
        </div>
      `;
    } catch (error) {
      console.error("[SBW Rankings] Erro ao atualizar ranking do organizador:", error);
      root.innerHTML = `
        <div class="sbw-ranking-empty">
          Não foi possível carregar o ranking deste organizador agora.
        </div>
      `;
    }
  }

  function getTournamentRecords() {
    if (!state.selectedTournament) return [];

    return asArray(state.snapshot?.records).filter(function (record) {
      return [
        record.tournamentSlug,
        record.tournamentId,
        record.tournamentName
      ].map(String).includes(String(state.selectedTournament));
    }).sort(function (a, b) {
      return Number(a.placement || 999) - Number(b.placement || 999);
    });
  }

  function renderTournamentRow(record) {
    const playerCurrent = isCurrentPlayerRow({
      authUserId: record.authUserId,
      profileId: record.profileId,
      profileSlug: record.profileSlug,
      playerSlug: record.playerSlug,
      key: record.playerKey,
      name: record.name
    });

    return `
      <article class="sbw-tournament-rank-row ${playerCurrent ? "is-current-user" : ""}">
        <div class="sbw-rank-position ${getRankClass(Number(record.placement || 0))}">
          <strong>#${escapeHtml(record.placement || "-")}</strong>
          <span>${escapeHtml(record.placementLabel || "Resultado")}</span>
        </div>
        <div class="sbw-rank-namebox">
          <strong>${escapeHtml(record.name || record.nickname || "Jogador")}</strong>
          <small>${escapeHtml(record.teamName || "Sem equipe informada")}</small>
          ${playerCurrent ? `<em>Você</em>` : ""}
        </div>
        <div class="sbw-tournament-rank-points">
          <span>Jogador</span>
          <strong>${escapeHtml(record.playerPoints || 0)} pts</strong>
        </div>
        <div class="sbw-tournament-rank-points">
          <span>Equipe</span>
          <strong>${escapeHtml(record.teamPoints || 0)} pts</strong>
        </div>
      </article>
    `;
  }

  function updateTournamentBlock() {
    const root = document.querySelector("[data-ranking-tournament-body]");

    if (!root) return;

    if (!state.selectedTournament) {
      root.innerHTML = `
        <div class="sbw-ranking-empty">
          Selecione um torneio para consultar a pontuação daquele evento.
        </div>
      `;
      return;
    }

    const records = getTournamentRecords();
    const firstRecord = records[0] || null;
    const tournamentUrl = getTournamentUrl(state.selectedTournament);

    if (!records.length) {
      root.innerHTML = `
        <div class="sbw-ranking-empty">
          Nenhum resultado ranqueado foi encontrado para este torneio.
        </div>
      `;
      return;
    }

    root.innerHTML = `
      <div class="sbw-tournament-rank-header">
        <div>
          <span>Ranking por torneio</span>
          <h3>${escapeHtml(firstRecord.tournamentName || "Torneio")}</h3>
          <p>
            ${escapeHtml(firstRecord.organizerName || "Organizador")} •
            ${escapeHtml(firstRecord.gameName || "Jogo")} •
            ${escapeHtml(formatDate(firstRecord.completedAt))}
          </p>
        </div>
        <a href="${escapeHtml(tournamentUrl)}">Ver torneio</a>
      </div>

      <div class="sbw-tournament-rank-list">
        ${records.slice(0, 12).map(renderTournamentRow).join("")}
      </div>
    `;
  }

  function getSearchContextLabel() {
    if (state.selectedTournament) return "torneio selecionado";
    if (state.selectedOrganizer) return "organizador selecionado";
    return "ranking global -SBW-";
  }

  function getSearchRowsForContext() {
    if (state.selectedTournament) {
      const tournamentRows = getTournamentRecords();

      return tournamentRows.flatMap(function (record) {
        const rows = [{
          type: "player",
          rank: record.placement,
          name: record.name || record.nickname,
          points: record.playerPoints || 0,
          teamName: record.teamName || "",
          authUserId: record.authUserId,
          profileId: record.profileId,
          profileSlug: record.profileSlug,
          playerSlug: record.playerSlug,
          key: record.playerKey,
          context: record.tournamentName || "Torneio selecionado"
        }];

        if (record.teamName) {
          rows.push({
            type: "team",
            rank: record.placement,
            name: record.teamName,
            points: record.teamPoints || 0,
            teamSlug: record.teamId || record.teamKey,
            teamId: record.teamId,
            key: record.teamKey,
            context: record.tournamentName || "Torneio selecionado"
          });
        }

        return rows;
      });
    }

    if (state.selectedOrganizer) {
      const records = asArray(state.snapshot?.records).filter(function (record) {
        return record.organizerName === state.selectedOrganizer || record.organizerSlug === state.selectedOrganizer;
      });

      return [
        ...window.SBWRankingsStorage.aggregatePlayerRecords(records).map(function (row) {
          return { ...row, type: "player", context: state.selectedOrganizer };
        }),
        ...window.SBWRankingsStorage.aggregateTeamRecords(records).map(function (row) {
          return { ...row, type: "team", context: state.selectedOrganizer };
        })
      ];
    }

    return [
      ...asArray(state.snapshot?.players).map(function (row) {
        return { ...row, type: "player", context: "Ranking Global -SBW-" };
      }),
      ...asArray(state.snapshot?.teams).map(function (row) {
        return { ...row, type: "team", context: "Ranking Global de Equipes -SBW-" };
      })
    ];
  }

  function updateSearchBlock() {
    const label = document.querySelector("[data-ranking-search-context]");
    const root = document.querySelector("[data-ranking-search-results]");
    const search = normalizeText(state.search);

    if (label) label.textContent = "Contexto: " + getSearchContextLabel();
    if (!root) return;

    if (!search) {
      root.innerHTML = `
        <div class="sbw-ranking-empty">
          Digite o nome de um jogador ou equipe para encontrar posição e pontuação rapidamente.
        </div>
      `;
      return;
    }

    const results = getSearchRowsForContext()
      .filter(function (row) {
        const haystack = normalizeText([
          row.name,
          row.teamName,
          row.context,
          asArray(row.games).join(" "),
          asArray(row.organizers).join(" ")
        ].join(" "));

        return haystack.includes(search);
      })
      .sort(function (a, b) {
        return Number(a.rank || 999) - Number(b.rank || 999);
      })
      .slice(0, 8);

    if (!results.length) {
      root.innerHTML = `
        <div class="sbw-ranking-empty">
          Nenhum jogador ou equipe encontrado neste contexto.
        </div>
      `;
      return;
    }

    root.innerHTML = `
      <div class="sbw-search-result-list">
        ${results.map(function (row) {
          const current = isCurrentRow(row, row.type);
          const url = row.type === "team" ? getTeamUrl(row) : getProfileUrl(row);

          return `
            <article class="sbw-search-result ${current ? "is-current-user" : ""}">
              <div>
                <span>${row.type === "team" ? "Equipe" : "Jogador"}</span>
                <a href="${escapeHtml(url)}">${escapeHtml(row.name || "Resultado")}</a>
                <small>${escapeHtml(row.context || "Ranking")}</small>
                ${current ? `<em>Você</em>` : ""}
              </div>
              <strong>#${escapeHtml(row.rank || "-")}</strong>
              <b>${escapeHtml(row.points || 0)} pts</b>
            </article>
          `;
        }).join("")}
      </div>
    `;
  }

  function renderScoringRules() {
    const root = document.querySelector("[data-ranking-rules-table]");

    if (!root) return;

    const tiers = asArray(window.SBWRankingsStorage?.playerScoringTiers);
    const teamPoints = window.SBWRankingsStorage?.teamPoints || {};

    root.innerHTML = `
      <div class="sbw-rules-grid">
        <section>
          <h4>Pontuação de jogadores</h4>
          <div class="sbw-score-pill-grid">
            ${tiers.slice(0, 12).map(function (tier) {
              return `
                <span>
                  <strong>${escapeHtml(tier.label)}</strong>
                  <em>${escapeHtml(tier.points)} pts</em>
                </span>
              `;
            }).join("")}
          </div>
        </section>

        <section>
          <h4>Pontuação de equipes</h4>
          <div class="sbw-score-pill-grid">
            ${Object.keys(teamPoints).map(function (placement) {
              return `
                <span>
                  <strong>${escapeHtml(placement)}º</strong>
                  <em>${escapeHtml(teamPoints[placement])} pts</em>
                </span>
              `;
            }).join("")}
          </div>
        </section>
      </div>
    `;
  }

  function renderInitialLoading() {
    [
      "[data-ranking-global-players]",
      "[data-ranking-global-teams]",
      "[data-ranking-organizer-body]",
      "[data-ranking-tournament-body]",
      "[data-ranking-search-results]",
      "[data-ranking-rules-table]"
    ].forEach(function (selector) {
      const element = document.querySelector(selector);
      if (element) {
        element.innerHTML = `<div class="sbw-ranking-empty">Carregando rankings...</div>`;
      }
    });
  }

  function chooseDefaultOrganizer() {
    const organizers = asArray(state.snapshot?.options?.organizers);

    if (!organizers.length) return "";

    const preferred = organizers.find(function (organizer) {
      return normalizeText(organizer).includes("sbw") || normalizeText(organizer).includes("saberwolf");
    });

    return preferred || organizers[0] || "";
  }

  function chooseDefaultTournament() {
    const tournaments = getTournamentOptions();
    return tournaments[0]?.value || "";
  }

  async function loadRankings() {
    if (!window.SBWRankingsStorage?.getRankingSnapshotAsync) {
      renderInitialLoading();
      const firstRoot = document.querySelector("[data-ranking-global-players]");
      if (firstRoot) firstRoot.innerHTML = `<div class="sbw-ranking-empty">O módulo de rankings não carregou corretamente.</div>`;
      return;
    }

    state.isLoading = true;
    renderInitialLoading();

    try {
      const userPromise = getCurrentUserSafely();
      state.snapshot = await window.SBWRankingsStorage.getRankingSnapshotAsync({
        game: "all",
        organizer: "all",
        season: "all",
        globalStatus: "organizer"
      });
      state.currentUser = await userPromise;
      state.currentProfile = await getCurrentProfileSafely(state.currentUser);
      state.currentTeamKeys = await getCurrentTeamKeysSafely(state.currentProfile);

      state.selectedOrganizer = chooseDefaultOrganizer();
      state.selectedTournament = chooseDefaultTournament();

      renderMetricCards();
      renderGlobalBlocks();
      syncBlockSelects();
      await updateOrganizerBlock();
      updateTournamentBlock();
      updateSearchBlock();
      renderScoringRules();
    } catch (error) {
      console.error("[SBW Rankings] Erro ao carregar rankings:", error);
      renderInitialLoading();
      const elements = document.querySelectorAll(".sbw-ranking-empty");
      elements.forEach(function (element) {
        element.textContent = "Não foi possível carregar os rankings agora.";
      });
    } finally {
      state.isLoading = false;
    }
  }

  function bindEvents() {
    const organizerSelect = document.querySelector("[data-ranking-organizer-select]");
    const tournamentSelect = document.querySelector("[data-ranking-tournament-select]");
    const searchInput = document.querySelector("[data-ranking-search]");

    if (organizerSelect) {
      organizerSelect.addEventListener("change", async function () {
        state.selectedOrganizer = organizerSelect.value || "";
        await updateOrganizerBlock();
        updateSearchBlock();
      });
    }

    if (tournamentSelect) {
      tournamentSelect.addEventListener("change", function () {
        state.selectedTournament = tournamentSelect.value || "";
        updateTournamentBlock();
        updateSearchBlock();
      });
    }

    if (searchInput) {
      searchInput.addEventListener("input", function () {
        state.search = searchInput.value || "";
        updateSearchBlock();
      });
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    bindEvents();
    loadRankings();
  });
})();
