(function () {
  const PLAYER_SCORING_TIERS = [
    { min: 1, max: 1, points: 50, label: "1º" },
    { min: 2, max: 2, points: 40, label: "2º" },
    { min: 3, max: 3, points: 35, label: "3º" },
    { min: 4, max: 4, points: 30, label: "4º" },
    { min: 5, max: 6, points: 25, label: "5º/6º" },
    { min: 7, max: 8, points: 20, label: "7º/8º" },
    { min: 9, max: 12, points: 15, label: "9º–12º" },
    { min: 13, max: 16, points: 10, label: "13º–16º" },
    { min: 17, max: 24, points: 5, label: "17º–24º" },
    { min: 25, max: 32, points: 3, label: "25º–32º" },
    { min: 33, max: 48, points: 2, label: "33º–48º" },
    { min: 49, max: 64, points: 1, label: "49º–64º" }
  ];

  const PLAYER_POINTS = PLAYER_SCORING_TIERS.reduce(function (acc, tier) {
    for (let placement = tier.min; placement <= tier.max; placement += 1) {
      acc[placement] = tier.points;
    }

    return acc;
  }, {});

  const TEAM_POINTS = {
    1: 100,
    2: 75,
    3: 50,
    4: 30,
    5: 20,
    6: 15,
    7: 10,
    8: 5
  };

  function nowIso() {
    return new Date().toISOString();
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
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function uniqueStrings(values) {
    const seen = new Set();
    const result = [];

    asArray(values).forEach(function (value) {
      const normalized = String(value || "").trim();

      if (!normalized || seen.has(normalized)) {
        return;
      }

      seen.add(normalized);
      result.push(normalized);
    });

    return result;
  }

  function getPlacementPoints(placement) {
    return getPlayerPlacementPoints(placement);
  }

  function getPlayerPlacementPoints(placement) {
    return PLAYER_POINTS[Number(placement || 0)] || 0;
  }

  function getTeamPlacementPoints(placement) {
    return TEAM_POINTS[Number(placement || 0)] || 0;
  }

  function getPlacementLabel(placement) {
    const numeric = Number(placement || 0);

    if (numeric === 1) return "Campeão";
    if (numeric === 2) return "Vice-campeão";
    if (numeric === 3) return "3º lugar";
    if (numeric > 0) return numeric + "º lugar";

    return "Participação";
  }

  function getMedalTone(placement) {
    const numeric = Number(placement || 0);

    if (numeric === 1) return "gold";
    if (numeric === 2) return "silver";
    if (numeric === 3) return "bronze";
    if (numeric > 3 && numeric <= 8) return "top8";

    return "participation";
  }

  function rankingSupabaseEnabled() {
    return Boolean(
      window.SBWSupabase &&
      typeof window.SBWSupabase.isEnabled === "function" &&
      window.SBWSupabase.isEnabled()
    );
  }

  function getTournamentsTableName() {
    const config = window.SBWSupabaseConfig || {};

    if (config.tables && config.tables.tournaments) {
      return config.tables.tournaments;
    }

    return "tournaments";
  }

  function getTeamIdFromPlacement(placement) {
    return String(
      placement.teamId ||
      placement.team_id ||
      placement.teamSlug ||
      placement.team_slug ||
      placement.currentTeamId ||
      placement.current_team_id ||
      ""
    ).trim();
  }

  function getTeamNameFromPlacement(placement) {
    return String(
      placement.teamName ||
      placement.team_name ||
      placement.team ||
      placement.organization ||
      placement.club ||
      ""
    ).trim();
  }

  function getTeamKeyFromPlacement(placement) {
    const teamId = getTeamIdFromPlacement(placement);
    const teamName = getTeamNameFromPlacement(placement);

    return teamId || normalizeText(teamName);
  }

  function teamLooksValid(placement) {
    const teamName = getTeamNameFromPlacement(placement);
    const teamKey = getTeamKeyFromPlacement(placement);
    const invalidNames = [
      "",
      "sem-equipe",
      "sem-time",
      "free-agent",
      "n-a",
      "nao-informado",
      "não-informado"
    ];

    if (!teamKey) {
      return false;
    }

    return !invalidNames.includes(normalizeText(teamName || teamKey));
  }

  function getTournamentSettings(tournament) {
    return tournament && tournament.settings && typeof tournament.settings === "object"
      ? tournament.settings
      : {};
  }

  function getTournamentMetadata(tournament) {
    return tournament && tournament.metadata && typeof tournament.metadata === "object"
      ? tournament.metadata
      : {};
  }

  function getFinalResults(tournament) {
    const settings = getTournamentSettings(tournament);
    const metadata = getTournamentMetadata(tournament);

    return settings.finalResults || metadata.finalResults || tournament?.finalResults || null;
  }

  function getYearFromValue(value) {
    if (!value) {
      return String(new Date().getFullYear());
    }

    const date = new Date(value);

    if (!Number.isNaN(date.getTime())) {
      return String(date.getFullYear());
    }

    const match = String(value).match(/(20\d{2}|19\d{2})/);
    return match ? match[1] : String(new Date().getFullYear());
  }

  function getTournamentSeason(tournament) {
    const settings = getTournamentSettings(tournament);
    const metadata = getTournamentMetadata(tournament);
    const finalResults = getFinalResults(tournament) || {};

    return String(
      settings.rankingSeason ||
      settings.season ||
      metadata.rankingSeason ||
      metadata.season ||
      finalResults.rankingSeason ||
      finalResults.season ||
      getYearFromValue(
        finalResults.completedAt ||
        finalResults.finalizedAt ||
        settings.completedAt ||
        metadata.completedAt ||
        tournament?.updatedAt ||
        tournament?.updated_at ||
        tournament?.startsAt ||
        tournament?.created_at
      )
    );
  }

  function getTournamentCircuit(tournament) {
    const settings = getTournamentSettings(tournament);
    const metadata = getTournamentMetadata(tournament);
    const finalResults = getFinalResults(tournament) || {};

    return String(
      settings.rankingCircuit ||
      settings.circuitName ||
      metadata.rankingCircuit ||
      metadata.circuitName ||
      finalResults.rankingCircuit ||
      finalResults.circuitName ||
      "Temporada " + getTournamentSeason(tournament)
    ).trim();
  }

  function valueIsExplicitFalse(value) {
    return value === false || value === "false" || value === 0 || value === "0";
  }

  function valueIsExplicitTrue(value) {
    return value === true || value === "true" || value === 1 || value === "1" || value === "yes" || value === "sim" || value === "on";
  }

  function getFirstDefinedValue(values) {
    return asArray(values).find(function (value) {
      return value !== undefined && value !== null && String(value).trim() !== "";
    });
  }

  function getTournamentRankingConfig(tournament) {
    const settings = getTournamentSettings(tournament);
    const metadata = getTournamentMetadata(tournament);
    const finalResults = getFinalResults(tournament) || {};
    const ranking = settings.ranking || metadata.ranking || {};
    const rankingFlag = getFirstDefinedValue([
      ranking.enabled,
      ranking.rankingEnabled,
      ranking.ranking_enabled,
      ranking.countsForRanking,
      ranking.counts_for_ranking,
      ranking.countsForOrganizerRanking,
      ranking.counts_for_organizer_ranking,
      settings.rankingEnabled,
      settings.ranking_enabled,
      settings.countsForRanking,
      settings.counts_for_ranking,
      settings.countsForOrganizerRanking,
      settings.counts_for_organizer_ranking,
      metadata.rankingEnabled,
      metadata.ranking_enabled,
      metadata.countsForRanking,
      metadata.counts_for_ranking,
      metadata.countsForOrganizerRanking,
      metadata.counts_for_organizer_ranking,
      finalResults.rankingApplied,
      finalResults.ranking_applied
    ]);
    const organizerEligible = rankingFlag === undefined ? true : !valueIsExplicitFalse(rankingFlag);
    const globalStatus = organizerEligible ? "pointable" : "not_pointable";

    return {
      organizerEligible,
      globalStatus,
      globalApproved: organizerEligible,
      globalRequested: false,
      scopeLabel: organizerEligible ? "Pontua no Ranking Global -SBW-" : "Torneio não pontuável"
    };
  }

  function getTournamentIdentity(tournament) {
    const settings = getTournamentSettings(tournament);
    const metadata = getTournamentMetadata(tournament);
    const finalResults = getFinalResults(tournament) || {};
    const rankingConfig = getTournamentRankingConfig(tournament);

    return {
      id: String(tournament?.supabaseId || tournament?.id || tournament?.slug || ""),
      slug: String(tournament?.slug || tournament?.id || ""),
      title: tournament?.title || tournament?.name || metadata.title || "Torneio -SBW-",
      gameId: tournament?.gameId || tournament?.game_id || metadata.gameId || settings.gameId || normalizeText(tournament?.game || tournament?.gameName || ""),
      gameName: tournament?.gameName || tournament?.game || tournament?.game_name || metadata.gameName || settings.gameName || "Jogo não informado",
      organizerId: tournament?.organizerId || tournament?.organizer_id || metadata.organizerId || settings.organizerId || "",
      organizerSlug: tournament?.organizerSlug || tournament?.organizer_slug || metadata.organizerSlug || settings.organizerSlug || "",
      organizerName: tournament?.organizerName || tournament?.organizer || metadata.organizerName || settings.organizerName || "Organizador -SBW-",
      completedAt: finalResults.completedAt || finalResults.finalizedAt || settings.completedAt || metadata.completedAt || tournament?.updatedAt || tournament?.updated_at || tournament?.startsAt || tournament?.created_at || nowIso(),
      season: getTournamentSeason(tournament),
      circuitName: getTournamentCircuit(tournament),
      organizerEligible: rankingConfig.organizerEligible,
      globalRankingStatus: rankingConfig.globalStatus,
      globalApproved: rankingConfig.globalApproved,
      scopeLabel: rankingConfig.scopeLabel,
      source: tournament?.source || "local"
    };
  }

  function getTournamentSourceStatus(tournament) {
    return String(tournament?.status || "").toLowerCase();
  }

  function tournamentIsCompleted(tournament) {
    const status = getTournamentSourceStatus(tournament);
    const finalResults = getFinalResults(tournament);

    return Boolean(finalResults && status === "completed");
  }

  function normalizePlacement(placement, tournament, index) {
    const safePlacement = placement || {};
    const tournamentInfo = getTournamentIdentity(tournament);
    const placementNumber = Number(safePlacement.placement || safePlacement.position || index + 1);
    const playerName = String(
      safePlacement.nickname ||
      safePlacement.name ||
      safePlacement.playerName ||
      safePlacement.displayName ||
      "Jogador"
    ).trim();

    const playerKey = uniqueStrings([
      safePlacement.profileId,
      safePlacement.profile_id,
      safePlacement.profileSlug,
      safePlacement.profile_slug,
      safePlacement.playerSlug,
      safePlacement.player_slug,
      safePlacement.authUserId,
      safePlacement.auth_user_id,
      safePlacement.playerId,
      safePlacement.participantId,
      safePlacement.id,
      playerName ? "name-" + normalizeText(playerName) : ""
    ])[0] || "player-" + normalizeText(playerName || index + 1);

    const teamName = getTeamNameFromPlacement(safePlacement);
    const teamKey = getTeamKeyFromPlacement(safePlacement);
    const playerPoints = getPlayerPlacementPoints(placementNumber);
    const teamPoints = getTeamPlacementPoints(placementNumber);

    return {
      id: [tournamentInfo.slug || tournamentInfo.id, playerKey, placementNumber].join("::"),
      playerKey,
      playerId: safePlacement.playerId || safePlacement.id || "",
      participantId: safePlacement.participantId || safePlacement.participant_id || "",
      profileId: safePlacement.profileId || safePlacement.profile_id || "",
      profileSlug: safePlacement.profileSlug || safePlacement.profile_slug || safePlacement.playerSlug || safePlacement.player_slug || "",
      playerSlug: safePlacement.playerSlug || safePlacement.player_slug || safePlacement.profileSlug || safePlacement.profile_slug || "",
      authUserId: safePlacement.authUserId || safePlacement.auth_user_id || "",
      nickname: playerName,
      name: playerName,
      teamId: getTeamIdFromPlacement(safePlacement),
      teamKey,
      teamName,
      placement: placementNumber,
      placementLabel: safePlacement.placementLabel || safePlacement.placement_label || getPlacementLabel(placementNumber),
      points: playerPoints,
      playerPoints,
      teamPoints,
      medalTone: getMedalTone(placementNumber),
      tournamentId: tournamentInfo.id,
      tournamentSlug: tournamentInfo.slug,
      tournamentName: tournamentInfo.title,
      gameId: tournamentInfo.gameId,
      gameName: tournamentInfo.gameName,
      organizerId: tournamentInfo.organizerId,
      organizerSlug: tournamentInfo.organizerSlug,
      organizerName: tournamentInfo.organizerName,
      completedAt: tournamentInfo.completedAt,
      season: tournamentInfo.season,
      circuitName: tournamentInfo.circuitName,
      organizerEligible: tournamentInfo.organizerEligible,
      globalRankingStatus: tournamentInfo.globalRankingStatus,
      globalApproved: tournamentInfo.globalApproved,
      scopeLabel: tournamentInfo.scopeLabel,
      source: tournamentInfo.source,
      raw: safePlacement
    };
  }

  function normalizeTournamentRecords(tournament) {
    const finalResults = getFinalResults(tournament);
    const placements = asArray(finalResults && finalResults.placements);

    if (!tournamentIsCompleted(tournament) || placements.length === 0) {
      return [];
    }

    return placements.map(function (placement, index) {
      return normalizePlacement(placement, tournament, index);
    });
  }

  async function getCompletedTournamentsFromSupabase() {
    if (!rankingSupabaseEnabled()) {
      return [];
    }

    if (typeof sbwGetAllTournamentsAsync === "function") {
      const tournaments = await sbwGetAllTournamentsAsync();
      return asArray(tournaments).filter(tournamentIsCompleted);
    }

    const tableName = getTournamentsTableName();

    try {
      const result = await window.SBWSupabase.client
        .from(tableName)
        .select("*")
        .eq("status", "completed")
        .order("updated_at", { ascending: false });

      if (result.error) {
        console.warn("[SaberWolf Rankings] Erro ao buscar torneios concluídos:", result.error);
        return [];
      }

      return asArray(result.data);
    } catch (error) {
      console.warn("[SaberWolf Rankings] Falha ao buscar torneios concluídos:", error);
      return [];
    }
  }

  async function getCompletedTournaments() {
    if (rankingSupabaseEnabled()) {
      const supabaseTournaments = await getCompletedTournamentsFromSupabase();

      if (supabaseTournaments.length > 0) {
        return supabaseTournaments;
      }
    }

    if (typeof sbwGetAllTournamentsAsync === "function") {
      const tournaments = await sbwGetAllTournamentsAsync();
      return asArray(tournaments).filter(tournamentIsCompleted);
    }

    return [];
  }

  function sortRankingRows(rows) {
    return asArray(rows).sort(function (a, b) {
      if (Number(b.points || 0) !== Number(a.points || 0)) return Number(b.points || 0) - Number(a.points || 0);
      if (Number(b.titles || 0) !== Number(a.titles || 0)) return Number(b.titles || 0) - Number(a.titles || 0);
      if (Number(b.podiums || 0) !== Number(a.podiums || 0)) return Number(b.podiums || 0) - Number(a.podiums || 0);
      if (Number(b.top8 || 0) !== Number(a.top8 || 0)) return Number(b.top8 || 0) - Number(a.top8 || 0);
      return String(a.name || "").localeCompare(String(b.name || ""), "pt-BR");
    }).map(function (row, index) {
      return {
        ...row,
        rank: index + 1
      };
    });
  }

  function aggregatePlayerRecords(records) {
    const map = new Map();

    asArray(records).forEach(function (record) {
      if (record.playerPoints <= 0) {
        return;
      }

      const key = record.playerKey;

      if (!map.has(key)) {
        map.set(key, {
          type: "player",
          key,
          profileId: record.profileId,
          profileSlug: record.profileSlug || record.playerSlug || record.playerKey,
          playerSlug: record.playerSlug,
          authUserId: record.authUserId,
          name: record.nickname || record.name || "Jogador",
          teamName: record.teamName || "",
          points: 0,
          titles: 0,
          podiums: 0,
          top8: 0,
          events: 0,
          bestPlacement: 999,
          bestPlacementLabel: "",
          games: new Set(),
          organizers: new Set(),
          seasons: new Set(),
          circuits: new Set(),
          records: []
        });
      }

      const row = map.get(key);
      row.points += record.playerPoints;
      row.events += 1;
      row.bestPlacement = Math.min(row.bestPlacement, record.placement || 999);
      row.bestPlacementLabel = getPlacementLabel(row.bestPlacement);
      row.teamName = record.teamName || row.teamName;
      row.records.push(record);

      if (record.placement === 1) row.titles += 1;
      if (record.placement >= 1 && record.placement <= 3) row.podiums += 1;
      if (record.placement >= 1 && record.placement <= 8) row.top8 += 1;

      if (record.gameName) row.games.add(record.gameName);
      if (record.organizerName) row.organizers.add(record.organizerName);
      if (record.season) row.seasons.add(record.season);
      if (record.circuitName) row.circuits.add(record.circuitName);
    });

    return sortRankingRows(Array.from(map.values()).map(function (row) {
      return {
        ...row,
        games: Array.from(row.games),
        organizers: Array.from(row.organizers),
        seasons: Array.from(row.seasons),
        circuits: Array.from(row.circuits),
        bestPlacement: row.bestPlacement === 999 ? null : row.bestPlacement
      };
    }));
  }

  function aggregateTeamRecords(records) {
    const bestByTournamentTeam = new Map();

    asArray(records).forEach(function (record) {
      if (!teamLooksValid(record)) {
        return;
      }

      const key = [record.tournamentSlug || record.tournamentId, record.teamKey].join("::");
      const current = bestByTournamentTeam.get(key);

      if (!current || Number(record.placement || 999) < Number(current.placement || 999)) {
        bestByTournamentTeam.set(key, record);
      }
    });

    const map = new Map();

    Array.from(bestByTournamentTeam.values()).forEach(function (record) {
      const key = record.teamKey;

      if (!map.has(key)) {
        map.set(key, {
          type: "team",
          key,
          teamId: record.teamId,
          teamSlug: record.teamId || record.teamKey,
          name: record.teamName || "Equipe",
          points: 0,
          titles: 0,
          podiums: 0,
          top8: 0,
          events: 0,
          bestPlacement: 999,
          bestPlacementLabel: "",
          games: new Set(),
          organizers: new Set(),
          seasons: new Set(),
          circuits: new Set(),
          records: []
        });
      }

      const row = map.get(key);
      row.points += record.teamPoints;
      row.events += 1;
      row.bestPlacement = Math.min(row.bestPlacement, record.placement || 999);
      row.bestPlacementLabel = getPlacementLabel(row.bestPlacement);
      row.records.push(record);

      if (record.placement === 1) row.titles += 1;
      if (record.placement >= 1 && record.placement <= 3) row.podiums += 1;
      if (record.placement >= 1 && record.placement <= 8) row.top8 += 1;

      if (record.gameName) row.games.add(record.gameName);
      if (record.organizerName) row.organizers.add(record.organizerName);
      if (record.season) row.seasons.add(record.season);
      if (record.circuitName) row.circuits.add(record.circuitName);
    });

    return sortRankingRows(Array.from(map.values()).map(function (row) {
      return {
        ...row,
        games: Array.from(row.games),
        organizers: Array.from(row.organizers),
        seasons: Array.from(row.seasons),
        circuits: Array.from(row.circuits),
        bestPlacement: row.bestPlacement === 999 ? null : row.bestPlacement
      };
    }));
  }

  function recordMatchesFilters(record, filters) {
    const safeFilters = filters || {};
    const game = String(safeFilters.game || "all");
    const organizer = String(safeFilters.organizer || "all");
    const season = String(safeFilters.season || "all");
    const globalStatus = String(safeFilters.globalStatus || "organizer");

    if (!record.organizerEligible) {
      return false;
    }

    const gameMatches = game === "all" || record.gameName === game || record.gameId === game;
    const organizerMatches = organizer === "all" || record.organizerName === organizer || record.organizerSlug === organizer || record.organizerId === organizer;
    const seasonMatches = season === "all" || String(record.season || "") === season;

    return gameMatches && organizerMatches && seasonMatches;
  }

  function applyRecordFilters(records, filters) {
    return asArray(records).filter(function (record) {
      return recordMatchesFilters(record, filters);
    });
  }

  function applyFilters(rows, filters) {
    const safeFilters = filters || {};
    const search = normalizeText(safeFilters.search || "");

    return asArray(rows).filter(function (row) {
      const haystack = normalizeText([
        row.name,
        row.teamName,
        row.games && row.games.join(" "),
        row.organizers && row.organizers.join(" "),
        row.seasons && row.seasons.join(" "),
        row.circuits && row.circuits.join(" ")
      ].join(" "));

      return !search || haystack.includes(search);
    });
  }

  function buildOptionsFromRecords(records, property) {
    const values = new Set();

    asArray(records).forEach(function (record) {
      const value = record[property];
      if (value) values.add(String(value));
    });

    return Array.from(values).sort(function (a, b) {
      return String(a).localeCompare(String(b), "pt-BR");
    });
  }

  function countUnique(values) {
    return new Set(asArray(values).filter(Boolean)).size;
  }

  function buildScopeLabel(filters) {
    const safeFilters = filters || {};
    const parts = [];

    if (safeFilters.organizer && safeFilters.organizer !== "all") {
      parts.push("Organizador: " + safeFilters.organizer);
    }

    if (safeFilters.season && safeFilters.season !== "all") {
      parts.push("Temporada: " + safeFilters.season);
    }

    if (safeFilters.game && safeFilters.game !== "all") {
      parts.push("Jogo: " + safeFilters.game);
    }

    if (safeFilters.globalStatus === "global") {
      parts.push("Ranking Global -SBW-");
    } else {
      parts.push("Ranking do organizador/plataforma");
    }

    return parts.join(" • ");
  }

  async function getRankingSnapshotAsync(filters) {
    const safeFilters = filters || {};
    const tournaments = await getCompletedTournaments();
    const allRecords = tournaments.flatMap(normalizeTournamentRecords);
    const eligibleRecords = allRecords.filter(function (record) {
      return record.organizerEligible;
    });
    const filteredRecords = applyRecordFilters(eligibleRecords, safeFilters);
    const playerRows = aggregatePlayerRecords(filteredRecords);
    const teamRows = aggregateTeamRecords(filteredRecords);
    const scoredPlayerRecords = filteredRecords.filter(function (record) { return record.playerPoints > 0; });
    const scoredTeamRecords = filteredRecords.filter(function (record) { return record.teamPoints > 0 && teamLooksValid(record); });

    return {
      version: "v1.6.70.1",
      generatedAt: nowIso(),
      source: rankingSupabaseEnabled() ? "supabase" : "local-demo",
      filters: {
        game: safeFilters.game || "all",
        organizer: safeFilters.organizer || "all",
        season: safeFilters.season || "all",
        globalStatus: safeFilters.globalStatus || "organizer"
      },
      scopeLabel: buildScopeLabel(safeFilters),
      scoring: {
        playerPreset: "Capcom / World Warrior",
        playerTiers: PLAYER_SCORING_TIERS.map(function (tier) { return { ...tier }; }),
        playerPoints: { ...PLAYER_POINTS },
        teamPreset: "Modelo reduzido estilo EWC",
        teamPoints: { ...TEAM_POINTS },
        teamRule: "Somente o melhor colocado da equipe em cada torneio conta para a pontuação da equipe.",
        organizerRule: "Torneios concluídos contam por padrão para o ranking do organizador, exceto quando marcados como não elegíveis.",
        globalRule: "Todo torneio marcado como pontuável entra no ranking do organizador e também é elegível para o Ranking Global -SBW-."
      },
      tournaments,
      records: filteredRecords,
      allRecords,
      players: playerRows,
      teams: teamRows,
      options: {
        games: buildOptionsFromRecords(eligibleRecords, "gameName"),
        organizers: buildOptionsFromRecords(eligibleRecords, "organizerName"),
        seasons: buildOptionsFromRecords(eligibleRecords, "season")
      },
      summary: {
        completedTournaments: countUnique(filteredRecords.map(function (record) { return record.tournamentSlug || record.tournamentId; })),
        allCompletedTournaments: tournaments.length,
        rankedPlayers: playerRows.length,
        rankedTeams: teamRows.length,
        scoredPlayerRecords: scoredPlayerRecords.length,
        scoredTeamRecords: scoredTeamRecords.length,
        activeSeason: safeFilters.season && safeFilters.season !== "all" ? safeFilters.season : "Todas",
        activeOrganizer: safeFilters.organizer && safeFilters.organizer !== "all" ? safeFilters.organizer : "Todos",
        activeGame: safeFilters.game && safeFilters.game !== "all" ? safeFilters.game : "Todos"
      }
    };
  }

  window.SBWRankingsStorage = {
    version: "v1.6.70.0",
    playerScoringTiers: PLAYER_SCORING_TIERS,
    playerPoints: PLAYER_POINTS,
    teamPoints: TEAM_POINTS,
    getPlacementPoints,
    getPlayerPlacementPoints,
    getTeamPlacementPoints,
    getPlacementLabel,
    getMedalTone,
    getRankingSnapshotAsync,
    applyFilters,
    applyRecordFilters,
    normalizeTournamentRecords,
    aggregatePlayerRecords,
    aggregateTeamRecords
  };
})();
