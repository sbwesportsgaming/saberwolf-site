(function () {
  "use strict";

  const state = {
    snapshot: null,
    globalSnapshot: null,
    currentUser: null,
    currentProfile: null,
    currentTeamKeys: new Set(),
    selectedOrganizer: "all",
    selectedTournament: "",
    selectedGlobalGame: "all",
    selectedGlobalSeason: "all",
    search: "",
    isLoading: false,
    initialParams: new URLSearchParams(window.location.search)
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

  function getInitialParam(names) {
    const keys = Array.isArray(names) ? names : [names];

    for (const key of keys) {
      const value = state.initialParams.get(key);
      if (value && String(value).trim()) {
        return String(value).trim();
      }
    }

    return "";
  }

  function valuesMatch(value, candidate) {
    if (!value || !candidate) return false;
    return String(value) === String(candidate) || normalizeKey(value) === normalizeKey(candidate);
  }

  function findOptionValueByParam(options, param) {
    if (!param) return "";

    const found = asArray(options).find(function (option) {
      return valuesMatch(option.value, param) || valuesMatch(option.label, param);
    });

    return found?.value || param;
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
    return id
      ? (window.SBWRoutes?.profile ? window.SBWRoutes.profile(id) : "../perfis/perfil.html?id=" + encodeURIComponent(id))
      : (window.SBWRoutes?.profiles ? window.SBWRoutes.profiles() : "../perfis/perfis.html");
  }

  function getTeamUrl(row) {
    const id = row.teamSlug || row.teamId || row.key || "";
    return id
      ? (window.SBWRoutes?.team ? window.SBWRoutes.team(id) : "../equipes/equipe.html?id=" + encodeURIComponent(id))
      : (window.SBWRoutes?.teams ? window.SBWRoutes.teams() : "../equipes/equipes.html");
  }

  function getTournamentUrl(value) {
    return window.SBWRoutes?.tournament ? window.SBWRoutes.tournament(value || "") : "../torneios/detalhe-torneio.html?id=" + encodeURIComponent(value || "");
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
    const globalSummary = state.globalSnapshot?.summary || {};
    const options = state.snapshot?.options || {};

    setText("[data-ranking-stat-players]", formatNumber(globalSummary.rankedPlayers || 0));
    setText("[data-ranking-stat-teams]", formatNumber(globalSummary.rankedTeams || 0));
    setText("[data-ranking-stat-organizers]", formatNumber(asArray(options.organizers).length || 0));
    setText("[data-ranking-stat-tournaments]", formatNumber(globalSummary.completedTournaments || 0));
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

  function getGlobalOptionValues(kind) {
    const options = state.snapshot?.options || {};
    const values = kind === "season" ? options.seasons : options.games;

    return asArray(values).map(function (value) {
      return { value: String(value), label: String(value) };
    }).sort(function (a, b) {
      return String(a.label).localeCompare(String(b.label), "pt-BR");
    });
  }

  function chooseGlobalFilterValue(kind, param) {
    if (!param) return "all";

    const options = getGlobalOptionValues(kind);
    const found = options.find(function (option) {
      return valuesMatch(option.value, param) || valuesMatch(option.label, param);
    });

    return found?.value || "all";
  }

  function renderGlobalSelectOptions(select, values, allLabel, selectedValue) {
    if (!select) return;

    const current = selectedValue || "all";
    const safeValues = asArray(values);
    const hasCurrent = current === "all" || safeValues.some(function (value) {
      return String(value.value) === String(current);
    });
    const customCurrentOption = current !== "all" && !hasCurrent
      ? `<option value="${escapeHtml(current)}">${escapeHtml(current)} · filtro ativo</option>`
      : "";

    select.innerHTML = `
      <option value="all">${escapeHtml(allLabel)}</option>
      ${customCurrentOption}
      ${safeValues.map(function (value) {
        return `<option value="${escapeHtml(value.value)}">${escapeHtml(value.label)}</option>`;
      }).join("")}
    `;

    select.value = hasCurrent || customCurrentOption ? current : "all";
  }

  function syncGlobalFilterControls() {
    renderGlobalSelectOptions(
      document.querySelector("[data-ranking-global-game-select]"),
      getGlobalOptionValues("game"),
      "Todos os jogos",
      state.selectedGlobalGame
    );

    renderGlobalSelectOptions(
      document.querySelector("[data-ranking-global-season-select]"),
      getGlobalOptionValues("season"),
      "Todas as temporadas",
      state.selectedGlobalSeason
    );

    const context = document.querySelector("[data-ranking-global-filter-context]");
    if (context) {
      const parts = [];
      if (state.selectedGlobalGame && state.selectedGlobalGame !== "all") parts.push("Jogo: " + state.selectedGlobalGame);
      if (state.selectedGlobalSeason && state.selectedGlobalSeason !== "all") parts.push("Temporada: " + state.selectedGlobalSeason);
      context.textContent = parts.length
        ? "Ranking Global -SBW- filtrado por " + parts.join(" • ") + "."
        : "Ranking Global -SBW- completo.";
    }
  }

  function renderGlobalRankingLoading() {
    [
      "[data-ranking-global-players]",
      "[data-ranking-global-teams]",
      "[data-ranking-global-eligibility]",
      "[data-ranking-global-highlights]",
      "[data-ranking-global-source]"
    ].forEach(function (selector) {
      const element = document.querySelector(selector);
      if (!element) return;
      element.innerHTML = `<div class="sbw-ranking-empty">Atualizando recorte do Ranking Global -SBW-...</div>`;
    });
  }

  async function updateGlobalRankingSnapshot() {
    if (!window.SBWRankingsStorage?.getRankingSnapshotAsync) return;

    renderGlobalRankingLoading();

    state.globalSnapshot = await window.SBWRankingsStorage.getRankingSnapshotAsync({
      game: state.selectedGlobalGame || "all",
      organizer: "all",
      season: state.selectedGlobalSeason || "all",
      globalStatus: "global"
    });

    renderMetricCards();
    renderGlobalBlocks();
    renderGlobalHighlightsPanel();
    renderCurrentRankingPanel();
    renderGlobalEligibilityPanel();
    renderGlobalSourcePanel();
    updateSearchBlock();
  }

  function recordMatchesGlobalFilters(record) {
    const game = state.selectedGlobalGame || "all";
    const season = state.selectedGlobalSeason || "all";
    const gameMatches = game === "all" || record.gameName === game || record.gameId === game;
    const seasonMatches = season === "all" || String(record.season || "") === season;

    return gameMatches && seasonMatches;
  }

  function renderGlobalBlocks() {
    const playersRoot = document.querySelector("[data-ranking-global-players]");
    const teamsRoot = document.querySelector("[data-ranking-global-teams]");
    const updatedRoot = document.querySelector("[data-ranking-updated-at]");
    const snapshot = state.globalSnapshot || state.snapshot;

    if (!snapshot) return;

    if (playersRoot) {
      playersRoot.innerHTML = renderList(snapshot.players, "player", {
        limit: 5,
        compact: true,
        empty: "Nenhum jogador pontuou ainda no ranking global."
      });
    }

    if (teamsRoot) {
      teamsRoot.innerHTML = renderList(snapshot.teams, "team", {
        limit: 5,
        compact: true,
        empty: "Nenhuma equipe pontuou ainda no ranking global."
      });
    }

    if (updatedRoot) {
      updatedRoot.textContent = "Atualizado em " + formatDateTime(snapshot.generatedAt);
    }
  }


  function getGlobalFilteredRecords() {
    return asArray(state.snapshot?.allRecords || state.snapshot?.records)
      .filter(recordMatchesGlobalFilters)
      .filter(function (record) {
        return record.organizerEligible !== false;
      });
  }

  function buildGlobalTopCount(records, property, fallbackLabel) {
    const map = new Map();

    asArray(records).forEach(function (record) {
      const label = String(record[property] || fallbackLabel || "A definir").trim() || (fallbackLabel || "A definir");
      const current = map.get(label) || { label, count: 0, points: 0 };
      current.count += 1;
      current.points += Number(record.playerPoints || 0);
      map.set(label, current);
    });

    return Array.from(map.values()).sort(function (a, b) {
      if (Number(b.count || 0) !== Number(a.count || 0)) return Number(b.count || 0) - Number(a.count || 0);
      if (Number(b.points || 0) !== Number(a.points || 0)) return Number(b.points || 0) - Number(a.points || 0);
      return String(a.label).localeCompare(String(b.label), "pt-BR");
    })[0] || null;
  }

  function getLatestGlobalTournament(records) {
    const map = new Map();

    asArray(records).forEach(function (record) {
      const key = String(record.tournamentSlug || record.tournamentId || record.tournamentName || "").trim();
      if (!key) return;

      const current = map.get(key) || {
        key,
        tournamentSlug: record.tournamentSlug || record.tournamentId || record.tournamentName || "",
        title: record.tournamentName || "Torneio pontuável",
        gameName: record.gameName || "Jogo não informado",
        organizerName: record.organizerName || "Organizador",
        completedAt: record.completedAt || "",
        entries: 0
      };

      current.entries += 1;
      if (!current.completedAt && record.completedAt) current.completedAt = record.completedAt;
      map.set(key, current);
    });

    return Array.from(map.values()).sort(function (a, b) {
      return new Date(b.completedAt || 0) - new Date(a.completedAt || 0);
    })[0] || null;
  }

  function renderGlobalHighlightCard(options) {
    const safeOptions = options || {};
    const href = safeOptions.href ? `href="${escapeHtml(safeOptions.href)}"` : "";
    const tagName = safeOptions.href ? "a" : "article";

    return `
      <${tagName} class="sbw-global-highlight-card ${safeOptions.tone ? "is-" + escapeHtml(safeOptions.tone) : ""}" ${href}>
        <span>${escapeHtml(safeOptions.label || "Destaque")}</span>
        <strong>${escapeHtml(safeOptions.value || "A definir")}</strong>
        <small>${escapeHtml(safeOptions.meta || "Aguardando dados pontuáveis.")}</small>
      </${tagName}>
    `;
  }

  function renderGlobalHighlightsPanel() {
    const root = document.querySelector("[data-ranking-global-highlights]");
    if (!root) return;

    const snapshot = state.globalSnapshot || state.snapshot || {};
    const records = getGlobalFilteredRecords();
    const topPlayer = asArray(snapshot.players)[0] || null;
    const topTeam = asArray(snapshot.teams)[0] || null;
    const topGame = buildGlobalTopCount(records, "gameName", "Jogo não informado");
    const topOrganizer = buildGlobalTopCount(records, "organizerName", "Organizador");
    const latestTournament = getLatestGlobalTournament(records);
    const context = getGlobalFilterContextLabel();

    root.innerHTML = `
      <div class="sbw-global-highlights-head">
        <div>
          <span>Destaques do recorte</span>
          <h2>Resumo do Ranking Global -SBW-</h2>
          <p>Uma visão rápida dos líderes e da base competitiva usada no filtro atual: ${escapeHtml(context)}.</p>
        </div>
        <a href="#ranking-global-torneios-pontuaveis">Ver torneios pontuáveis</a>
      </div>

      <div class="sbw-global-highlights-grid">
        ${renderGlobalHighlightCard({
          label: "Líder entre jogadores",
          value: topPlayer ? `#${topPlayer.rank || 1} ${topPlayer.name || "Jogador"}` : "Sem líder ainda",
          meta: topPlayer ? `${formatNumber(topPlayer.points || 0)} pts • ${formatNumber(topPlayer.events || 0)} evento${Number(topPlayer.events || 0) === 1 ? "" : "s"}` : "Nenhum jogador pontuou no recorte atual.",
          href: topPlayer ? getProfileUrl(topPlayer) : "",
          tone: "player"
        })}
        ${renderGlobalHighlightCard({
          label: "Líder entre equipes",
          value: topTeam ? `#${topTeam.rank || 1} ${topTeam.name || "Equipe"}` : "Sem equipe ainda",
          meta: topTeam ? `${formatNumber(topTeam.points || 0)} pts • ${formatNumber(topTeam.events || 0)} evento${Number(topTeam.events || 0) === 1 ? "" : "s"}` : "Nenhuma equipe pontuou no recorte atual.",
          href: topTeam ? getTeamUrl(topTeam) : "",
          tone: "team"
        })}
        ${renderGlobalHighlightCard({
          label: "Jogo mais movimentado",
          value: topGame ? topGame.label : "Sem jogo ainda",
          meta: topGame ? `${formatNumber(topGame.count)} resultado${Number(topGame.count || 0) === 1 ? "" : "s"} pontuável${Number(topGame.count || 0) === 1 ? "" : "eis"}` : "Nenhum resultado pontuável no recorte atual.",
          tone: "game"
        })}
        ${renderGlobalHighlightCard({
          label: "Organizador mais ativo",
          value: topOrganizer ? topOrganizer.label : "Sem organizador ainda",
          meta: topOrganizer ? `${formatNumber(topOrganizer.count)} resultado${Number(topOrganizer.count || 0) === 1 ? "" : "s"} usado${Number(topOrganizer.count || 0) === 1 ? "" : "s"} no Global` : "Nenhum organizador com resultado pontuável.",
          tone: "organizer"
        })}
        ${renderGlobalHighlightCard({
          label: "Último torneio usado",
          value: latestTournament ? latestTournament.title : "Nenhum torneio ainda",
          meta: latestTournament ? `${latestTournament.gameName} • ${latestTournament.organizerName} • ${formatDate(latestTournament.completedAt)}` : "Torneios finalizados e pontuáveis aparecerão aqui.",
          href: latestTournament ? getTournamentUrl(latestTournament.tournamentSlug || latestTournament.key) : "",
          tone: "tournament"
        })}
      </div>
    `;
  }

  function getGlobalEligibilityRows() {
    const records = asArray(state.snapshot?.allRecords || state.snapshot?.records)
      .filter(recordMatchesGlobalFilters);
    const map = new Map();

    records.forEach(function (record) {
      const key = String(record.tournamentSlug || record.tournamentId || record.tournamentName || "").trim();
      if (!key) return;

      const isPointable = record.organizerEligible !== false;
      const current = map.get(key) || {
        key,
        tournamentName: record.tournamentName || "Torneio",
        gameName: record.gameName || "Jogo",
        organizerName: record.organizerName || "Organizador",
        completedAt: record.completedAt,
        isPointable,
        records: 0
      };

      current.records += 1;
      current.isPointable = current.isPointable && isPointable;
      map.set(key, current);
    });

    return Array.from(map.values());
  }

  function getGlobalEligibilityStatus(row) {
    if (row?.isPointable === false) {
      return { key: "notPointable", label: "Não pontuável", tone: "blocked" };
    }

    return { key: "pointable", label: "Pontua no Global", tone: "approved" };
  }

  function getGlobalFilterContextLabel() {
    const parts = [];

    if (state.selectedGlobalGame && state.selectedGlobalGame !== "all") {
      parts.push("Jogo: " + state.selectedGlobalGame);
    }

    if (state.selectedGlobalSeason && state.selectedGlobalSeason !== "all") {
      parts.push("Temporada: " + state.selectedGlobalSeason);
    }

    return parts.length ? parts.join(" • ") : "Ranking Global -SBW- completo";
  }

  function getCurrentRankingRow(kind) {
    const snapshot = state.globalSnapshot || state.snapshot || {};
    const rows = kind === "team" ? asArray(snapshot.teams) : asArray(snapshot.players);
    const matcher = kind === "team" ? isCurrentTeamRow : isCurrentPlayerRow;

    return rows.find(function (row) {
      return matcher(row);
    }) || null;
  }

  function renderCurrentRankingCard(kind, row, options) {
    const safeOptions = options || {};
    const isTeam = kind === "team";
    const title = isTeam ? "Sua equipe" : "Seu jogador";
    const emptyTitle = safeOptions.emptyTitle || "Sem pontuação no recorte";
    const emptyText = safeOptions.emptyText || "Ainda não há pontuação registrada neste recorte do Ranking Global -SBW-.";

    if (!row) {
      return `
        <article class="sbw-global-current-card is-empty">
          <span>${escapeHtml(title)}</span>
          <strong>${escapeHtml(emptyTitle)}</strong>
          <p>${escapeHtml(emptyText)}</p>
        </article>
      `;
    }

    const url = isTeam ? getTeamUrl(row) : getProfileUrl(row);
    const subtitle = [
      !isTeam ? row.teamName : "Equipe vinculada",
      Array.isArray(row.games) ? row.games[0] : "",
      Array.isArray(row.organizers) ? row.organizers[0] : ""
    ].filter(Boolean).join(" • ");

    return `
      <article class="sbw-global-current-card is-ranked">
        <span>${escapeHtml(title)}</span>
        <div class="sbw-global-current-card__rank">
          <strong>#${escapeHtml(row.rank || "-")}</strong>
          <em>${escapeHtml(formatNumber(row.points || 0))} pts</em>
        </div>
        <a href="${escapeHtml(url)}">${escapeHtml(row.name || (isTeam ? "Equipe" : "Jogador"))}</a>
        <p>${escapeHtml(subtitle || "Ranking Global -SBW-")}</p>
        <small>${escapeHtml(row.events || 0)} evento${Number(row.events || 0) === 1 ? "" : "s"} • ${escapeHtml(row.podiums || 0)} pódio${Number(row.podiums || 0) === 1 ? "" : "s"} • ${escapeHtml(row.titles || 0)} título${Number(row.titles || 0) === 1 ? "" : "s"}</small>
      </article>
    `;
  }

  function renderCurrentRankingPanel() {
    const root = document.querySelector("[data-ranking-current-summary]");
    if (!root) return;

    const contextLabel = getGlobalFilterContextLabel();

    if (!state.currentUser) {
      root.innerHTML = `
        <div class="sbw-global-current-head">
          <div>
            <span>Minha posição</span>
            <h2>Acompanhe seu lugar no Ranking Global -SBW-</h2>
            <p>Entre na plataforma para destacar sua posição e a posição da sua equipe no recorte atual.</p>
          </div>
          <strong>${escapeHtml(contextLabel)}</strong>
        </div>
        <div class="sbw-global-current-grid">
          <article class="sbw-global-current-card is-empty">
            <span>Jogador</span>
            <strong>Login necessário</strong>
            <p>Com sua conta conectada, esta área mostra sua colocação no Ranking Global -SBW-.</p>
          </article>
          <article class="sbw-global-current-card is-empty">
            <span>Equipe</span>
            <strong>Login necessário</strong>
            <p>Se você estiver vinculado a uma equipe, a posição dela também aparece aqui.</p>
          </article>
        </div>
      `;
      return;
    }

    const playerRow = getCurrentRankingRow("player");
    const teamRow = getCurrentRankingRow("team");
    const hasTeamLink = state.currentTeamKeys && state.currentTeamKeys.size > 0;

    root.innerHTML = `
      <div class="sbw-global-current-head">
        <div>
          <span>Minha posição</span>
          <h2>Seu recorte no Ranking Global -SBW-</h2>
          <p>Resumo rápido da sua colocação e da sua equipe no filtro global ativo, sem alterar os rankings por organizador ou por torneio.</p>
        </div>
        <strong>${escapeHtml(contextLabel)}</strong>
      </div>
      <div class="sbw-global-current-grid">
        ${renderCurrentRankingCard("player", playerRow, {
          emptyTitle: "Você ainda não pontuou",
          emptyText: "Seu perfil ainda não tem pontos neste recorte. Ao participar de torneios pontuáveis finalizados, sua posição aparecerá aqui."
        })}
        ${renderCurrentRankingCard("team", teamRow, {
          emptyTitle: hasTeamLink ? "Equipe sem pontuação" : "Equipe não vinculada",
          emptyText: hasTeamLink
            ? "Sua equipe ainda não tem pontos neste recorte do Ranking Global -SBW-."
            : "Entre em uma equipe da plataforma -SBW- para acompanhar também a posição coletiva."
        })}
      </div>
    `;
  }

  function renderGlobalEligibilityPanel() {
    const root = document.querySelector("[data-ranking-global-eligibility]");
    if (!root) return;

    const rows = getGlobalEligibilityRows();
    const summary = rows.reduce(function (acc, row) {
      const status = getGlobalEligibilityStatus(row);
      acc[status.key] = (acc[status.key] || 0) + 1;
      return acc;
    }, { pointable: 0, notPointable: 0 });
    const organizerCount = new Set(rows.map(function (row) { return row.organizerName; }).filter(Boolean)).size;
    const gameCount = new Set(rows.map(function (row) { return row.gameName; }).filter(Boolean)).size;
    const recentRows = rows
      .slice()
      .sort(function (a, b) {
        return new Date(b.completedAt || 0) - new Date(a.completedAt || 0);
      })
      .slice(0, 4);

    root.innerHTML = `
      <div class="sbw-global-eligibility-head">
        <div>
          <span>Critério global</span>
          <h2>Ranking Global -SBW- por torneios pontuáveis</h2>
          <p>Todo torneio criado na plataforma pode escolher se pontua ou não. Se estiver marcado como pontuável, ele conta para o ranking do organizador e também para o Ranking Global -SBW-. Os números abaixo respeitam o filtro global ativo.</p>
        </div>
        <strong>${escapeHtml(summary.pointable || 0)} ${Number(summary.pointable || 0) === 1 ? "pontuável" : "pontuáveis"}</strong>
      </div>

      <div class="sbw-global-eligibility-grid">
        <article><span>Pontuáveis</span><strong>${escapeHtml(summary.pointable || 0)}</strong></article>
        <article><span>Não pontuáveis</span><strong>${escapeHtml(summary.notPointable || 0)}</strong></article>
        <article><span>Organizadores</span><strong>${escapeHtml(organizerCount || 0)}</strong></article>
        <article><span>Jogos</span><strong>${escapeHtml(gameCount || 0)}</strong></article>
      </div>

      <div class="sbw-global-eligibility-list">
        ${recentRows.length ? recentRows.map(function (row) {
          const status = getGlobalEligibilityStatus(row);
          return `
            <article class="sbw-global-eligibility-row is-${escapeHtml(status.tone)}">
              <div>
                <strong>${escapeHtml(row.tournamentName)}</strong>
                <span>${escapeHtml(row.gameName)} • ${escapeHtml(row.organizerName)} • ${escapeHtml(formatDate(row.completedAt))}</span>
              </div>
              <em>${escapeHtml(status.label)}</em>
            </article>
          `;
        }).join("") : `<div class="sbw-ranking-empty">Nenhum torneio finalizado encontrado para avaliar o Ranking Global -SBW-.</div>`}
      </div>
    `;
  }


  function buildGlobalSourceRows() {
    const records = asArray(state.snapshot?.allRecords || state.snapshot?.records)
      .filter(recordMatchesGlobalFilters)
      .filter(function (record) {
        return record.organizerEligible !== false;
      });
    const map = new Map();

    records.forEach(function (record) {
      const key = String(record.tournamentSlug || record.tournamentId || record.tournamentName || "").trim();
      if (!key) return;

      if (!map.has(key)) {
        map.set(key, {
          key,
          tournamentSlug: record.tournamentSlug || record.tournamentId || record.tournamentName || "",
          tournamentName: record.tournamentName || "Torneio pontuável",
          gameName: record.gameName || "Jogo não informado",
          organizerName: record.organizerName || "Organizador",
          season: record.season || "Temporada atual",
          completedAt: record.completedAt || "",
          entries: 0,
          teams: new Set(),
          champion: "",
          totalPlayerPoints: 0,
          totalTeamPoints: 0
        });
      }

      const row = map.get(key);
      row.entries += 1;
      row.totalPlayerPoints += Number(record.playerPoints || 0);
      row.totalTeamPoints += Number(record.teamPoints || 0);
      if (record.teamName) row.teams.add(record.teamName);
      if (Number(record.placement || 0) === 1 && !row.champion) {
        row.champion = record.name || record.nickname || record.playerName || "Campeão";
      }
      if (!row.completedAt && record.completedAt) row.completedAt = record.completedAt;
      if (!row.season && record.season) row.season = record.season;
    });

    return Array.from(map.values()).map(function (row) {
      return {
        ...row,
        teams: Array.from(row.teams)
      };
    }).sort(function (a, b) {
      return new Date(b.completedAt || 0) - new Date(a.completedAt || 0);
    });
  }

  function renderGlobalSourcePanel() {
    const root = document.querySelector("[data-ranking-global-source]");
    if (!root) return;

    const rows = buildGlobalSourceRows();
    const totalPlayerPoints = rows.reduce(function (total, row) {
      return total + Number(row.totalPlayerPoints || 0);
    }, 0);
    const totalTeamPoints = rows.reduce(function (total, row) {
      return total + Number(row.totalTeamPoints || 0);
    }, 0);
    const totalResults = rows.reduce(function (total, row) {
      return total + Number(row.entries || 0);
    }, 0);
    const visibleRows = rows.slice(0, 8);

    root.innerHTML = `
      <div class="sbw-global-source-head">
        <div>
          <span>Base do Ranking Global</span>
          <h2>Torneios pontuáveis usados na classificação</h2>
          <p>Esta área mostra quais torneios estão alimentando o Ranking Global -SBW- no recorte atual. Ela ajuda a validar a origem dos pontos sem criar fluxo de aprovação separado.</p>
        </div>
        <a href="#ranking-global-elegibilidade">Ver critério</a>
      </div>

      <div class="sbw-global-source-summary">
        <article><span>Torneios usados</span><strong>${escapeHtml(rows.length)}</strong></article>
        <article><span>Resultados</span><strong>${escapeHtml(totalResults)}</strong></article>
        <article><span>Pontos jogadores</span><strong>${escapeHtml(formatNumber(totalPlayerPoints))}</strong></article>
        <article><span>Pontos equipes</span><strong>${escapeHtml(formatNumber(totalTeamPoints))}</strong></article>
      </div>

      <div class="sbw-global-source-list">
        ${visibleRows.length ? visibleRows.map(function (row) {
          const pointsLabel = `${formatNumber(row.totalPlayerPoints)}J / ${formatNumber(row.totalTeamPoints)}E pts`;
          const seasonLabel = row.season ? `Temporada ${row.season}` : "Temporada atual";
          return `
            <article class="sbw-global-source-row">
              <div class="sbw-global-source-row__main">
                <strong>${escapeHtml(row.tournamentName)}</strong>
                <span>${escapeHtml([row.gameName, row.organizerName, formatDate(row.completedAt), seasonLabel].filter(Boolean).join(" • "))}</span>
                ${row.champion ? `<em>Campeão: ${escapeHtml(row.champion)}</em>` : ""}
              </div>
              <div class="sbw-global-source-row__meta">
                <strong>${escapeHtml(pointsLabel)}</strong>
                <small>${escapeHtml(row.entries)} resultado${Number(row.entries || 0) === 1 ? "" : "s"}</small>
                <a href="${escapeHtml(getTournamentUrl(row.tournamentSlug || row.key))}">Ver torneio</a>
              </div>
            </article>
          `;
        }).join("") : `<div class="sbw-ranking-empty">Nenhum torneio pontuável encontrado para o recorte atual do Ranking Global -SBW-.</div>`}
      </div>
    `;
  }

  function renderSelectOptions(select, values, placeholder, selectedValue) {
    if (!select) return;

    const current = selectedValue || select.value || "";
    const safeValues = asArray(values);
    const hasCurrent = safeValues.some(function (value) {
      return String(value.value) === String(current);
    });
    const customCurrentOption = current && !hasCurrent
      ? `<option value="${escapeHtml(current)}">${escapeHtml(current)} · filtro ativo</option>`
      : "";

    select.innerHTML = `
      <option value="">${escapeHtml(placeholder)}</option>
      ${customCurrentOption}
      ${safeValues.map(function (value) {
        return `<option value="${escapeHtml(value.value)}">${escapeHtml(value.label)}</option>`;
      }).join("")}
    `;

    select.value = current && (hasCurrent || customCurrentOption) ? current : "";
  }

  function getOrganizerOptions() {
    const map = new Map();

    asArray(state.snapshot?.records).forEach(function (record) {
      const label = record.organizerName || record.organizerSlug || record.organizerId || "Organizador";
      const primaryValue = record.organizerSlug || record.organizerName || record.organizerId || "";

      if (primaryValue && !map.has(primaryValue)) {
        map.set(primaryValue, { value: primaryValue, label });
      }

      if (record.organizerName && !map.has(record.organizerName)) {
        map.set(record.organizerName, { value: record.organizerName, label: record.organizerName });
      }
    });

    asArray(state.snapshot?.options?.organizers).forEach(function (organizer) {
      if (!map.has(organizer)) {
        map.set(organizer, { value: organizer, label: organizer });
      }
    });

    return Array.from(map.values()).sort(function (a, b) {
      return String(a.label).localeCompare(String(b.label), "pt-BR");
    });
  }

  function getOrganizerDisplayLabel(value) {
    if (!value) return "Organizador";

    const option = getOrganizerOptions().find(function (candidate) {
      return String(candidate.value) === String(value);
    });

    if (option?.label) return option.label;

    const record = asArray(state.snapshot?.records).find(function (item) {
      return valuesMatch(item.organizerSlug, value) || valuesMatch(item.organizerName, value) || valuesMatch(item.organizerId, value);
    });

    return record?.organizerName || value;
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



  function buildOrganizerTournamentAuditRows(snapshot) {
    const map = new Map();

    asArray(snapshot?.records).forEach(function (record) {
      const key = record.tournamentSlug || record.tournamentId || record.tournamentName;
      if (!key) return;

      if (!map.has(key)) {
        map.set(key, {
          key,
          tournamentSlug: record.tournamentSlug || record.tournamentId || record.tournamentName || "",
          tournamentName: record.tournamentName || "Torneio",
          gameName: record.gameName || "Jogo não informado",
          completedAt: record.completedAt || "",
          circuitName: record.circuitName || "",
          season: record.season || "",
          totalPlayerPoints: 0,
          totalTeamPoints: 0,
          entries: 0,
          teams: new Set(),
          champion: ""
        });
      }

      const row = map.get(key);
      row.entries += 1;
      row.totalPlayerPoints += Number(record.playerPoints || 0);
      row.totalTeamPoints += Number(record.teamPoints || 0);
      if (record.teamName) row.teams.add(record.teamName);
      if (Number(record.placement || 0) === 1 && !row.champion) {
        row.champion = record.name || record.nickname || "Campeão";
      }
    });

    return Array.from(map.values()).map(function (row) {
      return {
        ...row,
        teams: Array.from(row.teams)
      };
    }).sort(function (a, b) {
      return String(b.completedAt || "").localeCompare(String(a.completedAt || ""));
    });
  }

  function renderOrganizerTournamentAudit(snapshot) {
    const rows = buildOrganizerTournamentAuditRows(snapshot).slice(0, 8);

    if (!rows.length) {
      return `
        <section class="sbw-organizer-rank-audit">
          <div class="sbw-organizer-rank-audit__head">
            <div>
              <span>Base do ranking</span>
              <h4>Torneios pontuáveis</h4>
            </div>
          </div>
          <div class="sbw-ranking-empty">Nenhum torneio pontuável encontrado para este organizador.</div>
        </section>
      `;
    }

    return `
      <section class="sbw-organizer-rank-audit">
        <div class="sbw-organizer-rank-audit__head">
          <div>
            <span>Base do ranking</span>
            <h4>Torneios pontuáveis recentes</h4>
          </div>
          <small>${escapeHtml(rows.length)} exibido${rows.length === 1 ? "" : "s"}</small>
        </div>

        <div class="sbw-organizer-rank-audit__list">
          ${rows.map(function (row) {
            const url = getTournamentUrl(row.tournamentSlug || row.key);
            const pointsLabel = `${Number(row.totalPlayerPoints || 0)} pts jogadores • ${Number(row.totalTeamPoints || 0)} pts equipes`;
            return `
              <article class="sbw-organizer-rank-audit__row">
                <div>
                  <strong>${escapeHtml(row.tournamentName)}</strong>
                  <span>${escapeHtml([row.gameName, formatDate(row.completedAt), row.season ? "Temporada " + row.season : ""].filter(Boolean).join(" • "))}</span>
                  ${row.champion ? `<em>Campeão: ${escapeHtml(row.champion)}</em>` : ""}
                </div>
                <div class="sbw-organizer-rank-audit__meta">
                  <span>${escapeHtml(pointsLabel)}</span>
                  <small>${escapeHtml(row.entries)} resultado${row.entries === 1 ? "" : "s"}</small>
                  <a href="${escapeHtml(url)}">Ver torneio</a>
                </div>
              </article>
            `;
          }).join("")}
        </div>
      </section>
    `;
  }

  function renderOrganizerScoringSummary(snapshot) {
    const scoring = snapshot?.scoring || {};
    const playerTiers = asArray(scoring.playerTiers).slice(0, 7);
    const teamPoints = scoring.teamPoints || {};
    const teamRows = Object.keys(teamPoints).slice(0, 8).map(function (placement) {
      return `${placement}º ${teamPoints[placement]} pts`;
    });

    return `
      <section class="sbw-organizer-rank-rules">
        <article>
          <span>Jogadores</span>
          <strong>${escapeHtml(scoring.playerPreset || "Pontuação por colocação")}</strong>
          <p>${escapeHtml(playerTiers.map(function (tier) {
            return `${tier.label}: ${tier.points} pts`;
          }).join(" • ") || "A pontuação será exibida quando houver regra carregada.")}</p>
        </article>
        <article>
          <span>Equipes</span>
          <strong>${escapeHtml(scoring.teamPreset || "Pontuação por equipe")}</strong>
          <p>${escapeHtml(teamRows.join(" • ") || "Ranking de equipes será exibido quando houver pontuação.")}</p>
          <small>${escapeHtml(scoring.teamRule || "Somente o melhor colocado da equipe conta por torneio.")}</small>
        </article>
      </section>
    `;
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
            <h3>${escapeHtml(getOrganizerDisplayLabel(state.selectedOrganizer))}</h3>
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

        ${renderOrganizerTournamentAudit(snapshot)}
        ${renderOrganizerScoringSummary(snapshot)}
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

    const globalSnapshot = state.globalSnapshot || state.snapshot;

    return [
      ...asArray(globalSnapshot?.players).map(function (row) {
        return { ...row, type: "player", context: "Ranking Global -SBW-" };
      }),
      ...asArray(globalSnapshot?.teams).map(function (row) {
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
      "[data-ranking-rules-table]",
      "[data-ranking-current-summary]",
      "[data-ranking-global-eligibility]",
      "[data-ranking-global-highlights]"
    ].forEach(function (selector) {
      const element = document.querySelector(selector);

      if (!element) return;

      if (window.SBWPageState?.renderLoading) {
        window.SBWPageState.renderLoading(element, {
          title: "Carregando rankings",
          message: "Atualizando pontuações, posições e dados competitivos.",
          rows: 3
        });
        return;
      }

      element.innerHTML = `<div class="sbw-ranking-empty">Carregando rankings...</div>`;
    });
  }

  function chooseDefaultOrganizer() {
    const options = getOrganizerOptions();
    const organizerParam = getInitialParam(["organizer", "organizador", "organizerSlug", "organizer_slug"]);

    if (organizerParam) {
      return findOptionValueByParam(options, organizerParam);
    }

    if (!options.length) return "";

    const preferred = options.find(function (organizer) {
      return normalizeText(organizer.label).includes("sbw") || normalizeText(organizer.label).includes("saberwolf");
    });

    return preferred?.value || options[0]?.value || "";
  }

  function chooseDefaultTournament() {
    const tournaments = getTournamentOptions();
    const tournamentParam = getInitialParam(["tournament", "torneio", "event", "evento"]);

    if (tournamentParam) {
      return findOptionValueByParam(tournaments, tournamentParam);
    }

    return tournaments[0]?.value || "";
  }

  async function loadRankings() {
    if (!window.SBWRankingsStorage?.getRankingSnapshotAsync) {
      renderInitialLoading();
      const firstRoot = document.querySelector("[data-ranking-global-players]");
      if (firstRoot) {
        if (window.SBWPageState?.renderError) {
          window.SBWPageState.renderError(firstRoot, {
            title: "Rankings indisponíveis",
            message: "O módulo de rankings não carregou corretamente."
          });
        } else {
          firstRoot.innerHTML = `<div class="sbw-ranking-empty">O módulo de rankings não carregou corretamente.</div>`;
        }
      }
      return;
    }

    state.isLoading = true;
    renderInitialLoading();

    try {
      const userPromise = getCurrentUserSafely();
      const platformSnapshotPromise = window.SBWRankingsStorage.getRankingSnapshotAsync({
        game: "all",
        organizer: "all",
        season: "all",
        globalStatus: "organizer"
      });
      state.snapshot = await platformSnapshotPromise;
      state.selectedGlobalGame = chooseGlobalFilterValue("game", getInitialParam(["game", "jogo", "globalGame", "global_game"]));
      state.selectedGlobalSeason = chooseGlobalFilterValue("season", getInitialParam(["season", "temporada", "globalSeason", "global_season"]));
      state.globalSnapshot = await window.SBWRankingsStorage.getRankingSnapshotAsync({
        game: state.selectedGlobalGame || "all",
        organizer: "all",
        season: state.selectedGlobalSeason || "all",
        globalStatus: "global"
      });
      state.currentUser = await userPromise;
      state.currentProfile = await getCurrentProfileSafely(state.currentUser);
      state.currentTeamKeys = await getCurrentTeamKeysSafely(state.currentProfile);

      state.selectedOrganizer = chooseDefaultOrganizer();
      state.selectedTournament = chooseDefaultTournament();
      state.search = getInitialParam(["search", "busca", "q"]);

      const searchInput = document.querySelector("[data-ranking-search]");
      if (searchInput && state.search) {
        searchInput.value = state.search;
      }

      renderMetricCards();
      syncGlobalFilterControls();
      renderGlobalBlocks();
      renderGlobalHighlightsPanel();
      renderCurrentRankingPanel();
      renderGlobalEligibilityPanel();
      renderGlobalSourcePanel();
      syncBlockSelects();
      await updateOrganizerBlock();
      updateTournamentBlock();
      updateSearchBlock();
      renderScoringRules();
    } catch (error) {
      console.error("[SBW Rankings] Erro ao carregar rankings:", error);
      const targets = document.querySelectorAll(
        "[data-ranking-global-players], [data-ranking-global-teams], [data-ranking-global-highlights], [data-ranking-current-summary], [data-ranking-global-eligibility], [data-ranking-global-source], [data-ranking-organizer-body], [data-ranking-tournament-body], [data-ranking-search-results], [data-ranking-rules-table]"
      );

      targets.forEach(function (element) {
        if (window.SBWPageState?.renderError) {
          window.SBWPageState.renderError(element, {
            title: "Não foi possível carregar os rankings",
            message: "Atualize a página e tente novamente.",
            details: error?.message || ""
          });
        } else {
          element.innerHTML = `<div class="sbw-ranking-empty">Não foi possível carregar os rankings agora.</div>`;
        }
      });
    } finally {
      state.isLoading = false;
    }
  }

  function bindEvents() {
    const organizerSelect = document.querySelector("[data-ranking-organizer-select]");
    const tournamentSelect = document.querySelector("[data-ranking-tournament-select]");
    const globalGameSelect = document.querySelector("[data-ranking-global-game-select]");
    const globalSeasonSelect = document.querySelector("[data-ranking-global-season-select]");
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

    if (globalGameSelect) {
      globalGameSelect.addEventListener("change", async function () {
        state.selectedGlobalGame = globalGameSelect.value || "all";
        syncGlobalFilterControls();
        await updateGlobalRankingSnapshot();
      });
    }

    if (globalSeasonSelect) {
      globalSeasonSelect.addEventListener("change", async function () {
        state.selectedGlobalSeason = globalSeasonSelect.value || "all";
        syncGlobalFilterControls();
        await updateGlobalRankingSnapshot();
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
