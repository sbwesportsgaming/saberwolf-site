// v1.6.72.16 — Contrato técnico e checklist final do Team Battle League 4v4 da plataforma -SBW-
(function () {
  "use strict";

  const FORMAT_KEY = "team-battle-league-4v4";
  const SCHEMA_VERSION = "tbleague4v4.v1";

  const DEFAULT_CONFIG = Object.freeze({
    teamSize: 4,
    startersPerTeamMatch: 3,
    reservePerTeamMatch: 1,
    mainMatches: 3,
    minTeams: 2,
    recommendedMaxTeamsBasic: 16,
    extraMatchOnDraw: true,
    leagueMode: "basic_single_division",
    divisionsEnabled: true,
    advancedDivisionsEnabled: false,
    defaultDivisionName: "Divisão Única",
    maxDivisions: 1,
    playoffsEnabled: true,
    mainMatchPointsBySlot: [10, 10, 20],
    defaultMainMatchPoints: 10,
    defaultExtraMatchPoints: 10,
    defaultWinCondition: "best_of_3",
    status: "planned"
  });

  const MATCH_SLOT_TYPES = Object.freeze({
    MAIN: "main",
    EXTRA: "extra"
  });

  const TEAM_MATCH_STATUS = Object.freeze({
    DRAFT: "draft",
    READY: "ready",
    LIVE: "live",
    EXTRA_REQUIRED: "extra_required",
    FINISHED: "finished"
  });

  const LINEUP_ROLE_TYPES = Object.freeze({
    STARTER: "starter",
    RESERVE: "reserve"
  });

  const PLAYOFF_STAGE_TYPES = Object.freeze({
    DIVISION_SEMIFINAL: "division_semifinal",
    DIVISION_FINAL: "division_final",
    LEAGUE_SEMIFINAL: "league_semifinal",
    GRAND_FINAL: "grand_final",
    THIRD_PLACE: "third_place"
  });

  const LEAGUE_MODE_TYPES = Object.freeze({
    BASIC_SINGLE_DIVISION: "basic_single_division",
    ADVANCED_MULTI_DIVISION: "advanced_multi_division"
  });

  const TEAM_REGISTRATION_STATUS = Object.freeze({
    DRAFT: "draft",
    PENDING: "pending",
    APPROVED: "approved",
    REJECTED: "rejected",
    WAITLIST: "waitlist"
  });

  const TEAM_CHECKIN_STATUS = Object.freeze({
    PENDING: "pending",
    READY: "ready",
    MISSING: "missing",
    LATE: "late",
    MANUAL_REVIEW: "manual_review"
  });

  const LEAGUE_OPERATION_STATUS = Object.freeze({
    DRAFT: "draft",
    PENDING: "pending",
    READY: "ready",
    LIVE: "live",
    EXTRA_REQUIRED: "extra_required",
    FINISHED: "finished",
    BLOCKED: "blocked"
  });

  function asObject(value) {
    return value && typeof value === "object" && !Array.isArray(value) ? value : {};
  }

  function asArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function cleanText(value, fallback = "") {
    const text = String(value || "").trim();
    return text || fallback;
  }

  function cleanKey(value, fallback = "") {
    const text = cleanText(value, fallback)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    return text || fallback;
  }

  function clampNumber(value, min, max, fallback) {
    const number = Number(value);
    if (!Number.isFinite(number)) return fallback;
    return Math.min(max, Math.max(min, number));
  }

  function normalizeLeagueMode(value) {
    const normalized = cleanKey(value, DEFAULT_CONFIG.leagueMode);

    if (["advanced", "advanced-divisions", "advanced_multi_division", "advanced-multi-division", "multi-division", "multi_division", "divisions", "varias-divisoes"].includes(normalized)) {
      return LEAGUE_MODE_TYPES.ADVANCED_MULTI_DIVISION;
    }

    return LEAGUE_MODE_TYPES.BASIC_SINGLE_DIVISION;
  }

  function isAdvancedLeagueMode(value) {
    return normalizeLeagueMode(value) === LEAGUE_MODE_TYPES.ADVANCED_MULTI_DIVISION;
  }

  function getLeagueModeLabel(value) {
    return isAdvancedLeagueMode(value) ? "Avançada · várias divisões" : "Básica · divisão única";
  }

  function getLeagueModeDescription(value) {
    return isAdvancedLeagueMode(value)
      ? "Modo avançado com várias divisões, classificação por divisão e playoffs entre campeões."
      : "Modo básico com uma divisão única para simplificar a primeira versão funcional do formato 4v4.";
  }

  function normalizeConfig(config = {}) {
    const source = asObject(config);
    const rawPoints = asArray(source.mainMatchPointsBySlot).length
      ? source.mainMatchPointsBySlot
      : DEFAULT_CONFIG.mainMatchPointsBySlot;

    return {
      ...DEFAULT_CONFIG,
      ...source,
      teamSize: clampNumber(source.teamSize, 4, 4, DEFAULT_CONFIG.teamSize),
      startersPerTeamMatch: clampNumber(source.startersPerTeamMatch, 3, 3, DEFAULT_CONFIG.startersPerTeamMatch),
      reservePerTeamMatch: clampNumber(source.reservePerTeamMatch, 1, 1, DEFAULT_CONFIG.reservePerTeamMatch),
      mainMatches: clampNumber(source.mainMatches, 3, 3, DEFAULT_CONFIG.mainMatches),
      minTeams: clampNumber(source.minTeams || source.min_teams, 2, 128, DEFAULT_CONFIG.minTeams),
      recommendedMaxTeamsBasic: clampNumber(source.recommendedMaxTeamsBasic || source.recommended_max_teams_basic, 2, 64, DEFAULT_CONFIG.recommendedMaxTeamsBasic),
      mainMatchPointsBySlot: Array.from({ length: DEFAULT_CONFIG.mainMatches }, (_, index) => {
        return clampNumber(rawPoints[index], 1, 99, DEFAULT_CONFIG.mainMatchPointsBySlot[index] || DEFAULT_CONFIG.defaultMainMatchPoints);
      }),
      defaultMainMatchPoints: clampNumber(source.defaultMainMatchPoints, 1, 99, DEFAULT_CONFIG.defaultMainMatchPoints),
      defaultExtraMatchPoints: clampNumber(source.defaultExtraMatchPoints, 1, 99, DEFAULT_CONFIG.defaultExtraMatchPoints),
      extraMatchOnDraw: source.extraMatchOnDraw !== false,
      leagueMode: normalizeLeagueMode(source.leagueMode || source.league_mode || source.mode || source.divisionMode || source.division_mode),
      divisionsEnabled: true,
      advancedDivisionsEnabled: isAdvancedLeagueMode(source.leagueMode || source.league_mode || source.mode || source.divisionMode || source.division_mode),
      defaultDivisionName: cleanText(source.defaultDivisionName || source.default_division_name, DEFAULT_CONFIG.defaultDivisionName),
      maxDivisions: isAdvancedLeagueMode(source.leagueMode || source.league_mode || source.mode || source.divisionMode || source.division_mode)
        ? clampNumber(source.maxDivisions || source.max_divisions, 1, 32, 32)
        : 1,
      playoffsEnabled: source.playoffsEnabled !== false,
      defaultWinCondition: cleanText(source.defaultWinCondition, DEFAULT_CONFIG.defaultWinCondition),
      status: cleanText(source.status, DEFAULT_CONFIG.status)
    };
  }

  function getDefaultSlotPoints(slotIndex, type = MATCH_SLOT_TYPES.MAIN, config = {}) {
    const normalizedConfig = normalizeConfig(config);
    const safeIndex = clampNumber(slotIndex, 1, 9, 1);

    if (type === MATCH_SLOT_TYPES.EXTRA) {
      return normalizedConfig.defaultExtraMatchPoints;
    }

    return normalizedConfig.mainMatchPointsBySlot[safeIndex - 1] || normalizedConfig.defaultMainMatchPoints;
  }

  function createEmptyDivision(index = 1, overrides = {}) {
    const source = asObject(overrides);
    const safeIndex = clampNumber(index, 1, 99, 1);

    return {
      id: cleanText(source.id, `division-${safeIndex}`),
      name: cleanText(source.name, `Divisão ${safeIndex}`),
      order: clampNumber(source.order, 1, 99, safeIndex),
      teams: asArray(source.teams),
      rounds: asArray(source.rounds),
      standings: asArray(source.standings),
      metadata: asObject(source.metadata)
    };
  }

  function normalizeTeamEntry(team, index = 1, divisionId = "") {
    const source = asObject(team);
    const name = cleanText(source.name || source.teamName || source.displayName || source.title, `Equipe ${index}`);
    const id = cleanText(source.id || source.teamId || source.slug || source.teamSlug, cleanKey(name, `team-${index}`));

    return {
      id,
      slug: cleanText(source.slug || source.teamSlug, cleanKey(id, `team-${index}`)),
      name,
      tag: cleanText(source.tag || source.teamTag),
      seed: clampNumber(source.seed || source.order || index, 1, 999, index),
      divisionId: cleanText(source.divisionId || source.division_id, divisionId),
      roster: asArray(source.roster || source.players || source.members).slice(0, DEFAULT_CONFIG.teamSize),
      metadata: asObject(source.metadata)
    };
  }

  function createDivisionFromTeams(index = 1, teams = [], overrides = {}) {
    const division = createEmptyDivision(index, overrides);
    const normalizedTeams = asArray(teams).map((team, teamIndex) => normalizeTeamEntry(team, teamIndex + 1, division.id));

    return {
      ...division,
      teams: normalizedTeams,
      metadata: {
        ...division.metadata,
        teamCount: normalizedTeams.length
      }
    };
  }

  function createMatchSlot(slotIndex, type = MATCH_SLOT_TYPES.MAIN, overrides = {}, config = {}) {
    const source = asObject(overrides);
    const safeIndex = clampNumber(slotIndex, 1, 9, 1);
    const slotType = type === MATCH_SLOT_TYPES.EXTRA ? MATCH_SLOT_TYPES.EXTRA : MATCH_SLOT_TYPES.MAIN;
    const defaultPoints = getDefaultSlotPoints(safeIndex, slotType, config);

    return {
      slot: safeIndex,
      type: slotType,
      label: cleanText(source.label, slotType === MATCH_SLOT_TYPES.EXTRA ? "Partida extra" : `Partida ${safeIndex}`),
      homePlayerId: cleanText(source.homePlayerId),
      awayPlayerId: cleanText(source.awayPlayerId),
      winnerSide: cleanText(source.winnerSide),
      points: clampNumber(source.points, 1, 99, defaultPoints),
      score: asObject(source.score),
      status: cleanText(source.status, TEAM_MATCH_STATUS.DRAFT),
      metadata: asObject(source.metadata)
    };
  }

  function createTeamMatchSeed(overrides = {}, config = {}) {
    const source = asObject(overrides);
    const normalizedConfig = normalizeConfig(config);
    const mainMatches = Array.from({ length: normalizedConfig.mainMatches }, (_, index) => {
      return createMatchSlot(index + 1, MATCH_SLOT_TYPES.MAIN, asArray(source.matches)[index], normalizedConfig);
    });

    return {
      formatKey: FORMAT_KEY,
      schemaVersion: SCHEMA_VERSION,
      id: cleanText(source.id),
      round: clampNumber(source.round, 1, 99, 1),
      divisionId: cleanText(source.divisionId),
      homeTeamId: cleanText(source.homeTeamId),
      awayTeamId: cleanText(source.awayTeamId),
      status: cleanText(source.status, TEAM_MATCH_STATUS.DRAFT),
      homeLineup: asArray(source.homeLineup).slice(0, normalizedConfig.teamSize),
      awayLineup: asArray(source.awayLineup).slice(0, normalizedConfig.teamSize),
      matches: mainMatches,
      extraMatch: source.extraMatch ? createMatchSlot(4, MATCH_SLOT_TYPES.EXTRA, source.extraMatch, normalizedConfig) : null,
      metadata: asObject(source.metadata)
    };
  }

  function calculateTeamMatchScore(teamMatch) {
    const item = asObject(teamMatch);
    const slots = [...asArray(item.matches), item.extraMatch].filter(Boolean);
    const result = {
      homePoints: 0,
      awayPoints: 0,
      homeWins: 0,
      awayWins: 0,
      played: 0,
      draw: false,
      winnerSide: ""
    };

    slots.forEach((slot) => {
      const match = asObject(slot);
      const winnerSide = cleanText(match.winnerSide).toLowerCase();
      const points = clampNumber(match.points, 1, 99, match.type === MATCH_SLOT_TYPES.EXTRA ? DEFAULT_CONFIG.defaultExtraMatchPoints : getDefaultSlotPoints(match.slot, MATCH_SLOT_TYPES.MAIN));

      if (winnerSide !== "home" && winnerSide !== "away") return;

      result.played += 1;

      if (winnerSide === "home") {
        result.homeWins += 1;
        result.homePoints += points;
      } else {
        result.awayWins += 1;
        result.awayPoints += points;
      }
    });

    result.draw = result.homePoints === result.awayPoints;
    result.winnerSide = result.draw ? "" : result.homePoints > result.awayPoints ? "home" : "away";

    return result;
  }

  function needsExtraMatch(teamMatch) {
    const score = calculateTeamMatchScore(teamMatch);
    const item = asObject(teamMatch);
    const hasExtraWinner = Boolean(cleanText(asObject(item.extraMatch).winnerSide));

    return score.played >= DEFAULT_CONFIG.mainMatches && score.draw && !hasExtraWinner;
  }

  function normalizeWinnerSide(value) {
    const winnerSide = cleanText(value).toLowerCase();
    return winnerSide === "home" || winnerSide === "away" ? winnerSide : "";
  }

  function normalizeSlotScore(score = {}) {
    const source = asObject(score);
    const home = Number(source.home ?? source.homeScore ?? source.home_score ?? source.homeGames ?? source.home_games ?? 0);
    const away = Number(source.away ?? source.awayScore ?? source.away_score ?? source.awayGames ?? source.away_games ?? 0);

    return {
      home: Number.isFinite(home) ? home : 0,
      away: Number.isFinite(away) ? away : 0,
      label: cleanText(source.label || source.result),
      raw: asObject(source.raw)
    };
  }

  function isMatchSlotPlayed(slot) {
    return Boolean(normalizeWinnerSide(asObject(slot).winnerSide));
  }

  function getMainMatchScore(teamMatch) {
    const item = asObject(teamMatch);
    return calculateTeamMatchScore({
      ...item,
      extraMatch: null,
      matches: asArray(item.matches).filter((match) => asObject(match).type !== MATCH_SLOT_TYPES.EXTRA)
    });
  }

  function areMainMatchesComplete(teamMatch, config = {}) {
    const normalizedConfig = normalizeConfig(config);
    const item = createTeamMatchSeed(teamMatch, normalizedConfig);
    const played = asArray(item.matches).filter(isMatchSlotPlayed).length;

    return played >= normalizedConfig.mainMatches;
  }

  function shouldPlayExtraMatch(teamMatch, config = {}) {
    const normalizedConfig = normalizeConfig(config);
    if (!normalizedConfig.extraMatchOnDraw || !areMainMatchesComplete(teamMatch, normalizedConfig)) return false;

    const mainScore = getMainMatchScore(teamMatch);
    const item = asObject(teamMatch);
    const hasExtraWinner = isMatchSlotPlayed(item.extraMatch);

    return mainScore.draw && !hasExtraWinner;
  }

  function updateMatchSlotResult(teamMatch = {}, slotIndex = 1, result = {}, config = {}) {
    const normalizedConfig = normalizeConfig(config);
    const source = createTeamMatchSeed(teamMatch, normalizedConfig);
    const payload = asObject(result);
    const type = payload.type === MATCH_SLOT_TYPES.EXTRA ? MATCH_SLOT_TYPES.EXTRA : MATCH_SLOT_TYPES.MAIN;
    const safeSlot = clampNumber(slotIndex, 1, normalizedConfig.mainMatches + 1, 1);
    const winnerSide = normalizeWinnerSide(payload.winnerSide || payload.winner || payload.side);
    const status = winnerSide ? TEAM_MATCH_STATUS.FINISHED : cleanText(payload.status, TEAM_MATCH_STATUS.LIVE);
    const score = normalizeSlotScore(payload.score || payload.result || payload.games);
    const commonPatch = {
      winnerSide,
      status,
      score,
      metadata: {
        updatedAt: new Date().toISOString(),
        source: "team-battle-result",
        ...asObject(payload.metadata)
      }
    };

    if (type === MATCH_SLOT_TYPES.EXTRA || safeSlot > normalizedConfig.mainMatches) {
      const currentExtra = source.extraMatch || createMatchSlot(normalizedConfig.mainMatches + 1, MATCH_SLOT_TYPES.EXTRA, {}, normalizedConfig);
      return finalizeTeamMatchResult({
        ...source,
        extraMatch: {
          ...currentExtra,
          ...commonPatch,
          type: MATCH_SLOT_TYPES.EXTRA,
          slot: normalizedConfig.mainMatches + 1
        }
      }, normalizedConfig);
    }

    const matches = source.matches.map((match) => {
      if (Number(match.slot) !== safeSlot) return match;
      return {
        ...match,
        ...commonPatch,
        type: MATCH_SLOT_TYPES.MAIN,
        slot: safeSlot
      };
    });

    return finalizeTeamMatchResult({
      ...source,
      matches
    }, normalizedConfig);
  }

  function applyTeamMatchResults(teamMatch = {}, results = [], config = {}) {
    const normalizedConfig = normalizeConfig(config);
    return asArray(results).reduce((currentMatch, result, index) => {
      const payload = asObject(result);
      const slot = payload.slot || payload.matchSlot || payload.match_slot || index + 1;
      return updateMatchSlotResult(currentMatch, slot, payload, normalizedConfig);
    }, createTeamMatchSeed(teamMatch, normalizedConfig));
  }

  function getTeamMatchProgress(teamMatch = {}, config = {}) {
    const normalizedConfig = normalizeConfig(config);
    const item = createTeamMatchSeed(teamMatch, normalizedConfig);
    const mainPlayed = asArray(item.matches).filter(isMatchSlotPlayed).length;
    const extraRequired = shouldPlayExtraMatch(item, normalizedConfig);
    const extraPlayed = isMatchSlotPlayed(item.extraMatch);
    const score = calculateTeamMatchScore(item);
    const readyToFinalize = mainPlayed >= normalizedConfig.mainMatches && (!extraRequired || extraPlayed);

    return {
      mainPlayed,
      mainRequired: normalizedConfig.mainMatches,
      extraRequired,
      extraPlayed,
      readyToFinalize,
      played: score.played,
      score,
      status: readyToFinalize ? TEAM_MATCH_STATUS.FINISHED : extraRequired ? TEAM_MATCH_STATUS.EXTRA_REQUIRED : mainPlayed > 0 ? TEAM_MATCH_STATUS.LIVE : cleanText(item.status, TEAM_MATCH_STATUS.DRAFT)
    };
  }

  function finalizeTeamMatchResult(teamMatch = {}, config = {}) {
    const normalizedConfig = normalizeConfig(config);
    const source = createTeamMatchSeed(teamMatch, normalizedConfig);
    const progress = getTeamMatchProgress(source, normalizedConfig);
    const finalStatus = progress.readyToFinalize
      ? TEAM_MATCH_STATUS.FINISHED
      : progress.extraRequired
        ? TEAM_MATCH_STATUS.EXTRA_REQUIRED
        : progress.mainPlayed > 0
          ? TEAM_MATCH_STATUS.LIVE
          : cleanText(source.status, TEAM_MATCH_STATUS.DRAFT);

    return {
      ...source,
      status: finalStatus,
      result: {
        homePoints: progress.score.homePoints,
        awayPoints: progress.score.awayPoints,
        homeWins: progress.score.homeWins,
        awayWins: progress.score.awayWins,
        draw: progress.score.draw,
        winnerSide: progress.score.winnerSide,
        extraRequired: progress.extraRequired,
        mainPlayed: progress.mainPlayed,
        finalized: progress.readyToFinalize,
        updatedAt: new Date().toISOString()
      },
      metadata: {
        ...asObject(source.metadata),
        resultStatus: finalStatus,
        resultSchema: `${SCHEMA_VERSION}.result.v1`,
        updatedAt: new Date().toISOString()
      }
    };
  }

  function buildTeamMatchPublicResult(teamMatch = {}, config = {}) {
    const item = finalizeTeamMatchResult(teamMatch, config);
    const result = asObject(item.result);
    const homeLabel = cleanText(item.metadata?.homeTeamName || item.homeTeamName || item.homeTeamId, "Mandante");
    const awayLabel = cleanText(item.metadata?.awayTeamName || item.awayTeamName || item.awayTeamId, "Visitante");
    const winnerLabel = result.winnerSide === "home" ? homeLabel : result.winnerSide === "away" ? awayLabel : "Empate";

    return {
      id: cleanText(item.id),
      status: cleanText(item.status, TEAM_MATCH_STATUS.DRAFT),
      homeTeamId: cleanText(item.homeTeamId),
      awayTeamId: cleanText(item.awayTeamId),
      homeLabel,
      awayLabel,
      scoreLabel: `${result.homePoints || 0} x ${result.awayPoints || 0}`,
      winsLabel: `${result.homeWins || 0} x ${result.awayWins || 0}`,
      winnerSide: cleanText(result.winnerSide),
      winnerLabel,
      extraRequired: result.extraRequired === true,
      finalized: result.finalized === true
    };
  }


  function normalizeRosterMember(member, index = 1) {
    const source = asObject(member);
    const name = cleanText(source.nickname || source.name || source.displayName || source.display_name || source.playerName, `Jogador ${index}`);
    const id = cleanText(source.id || source.profileId || source.profile_id || source.authUserId || source.auth_user_id || source.slug || source.profileSlug || source.profile_slug, cleanKey(name, `player-${index}`));

    return {
      id,
      profileId: cleanText(source.profileId || source.profile_id || source.id, id),
      slug: cleanText(source.slug || source.profileSlug || source.profile_slug, cleanKey(id, `player-${index}`)),
      name,
      nickname: cleanText(source.nickname || source.nick || source.username, name),
      teamId: cleanText(source.teamId || source.team_id || source.teamSlug || source.team_slug),
      metadata: asObject(source.metadata)
    };
  }

  function normalizeTeamRoster(team) {
    const source = asObject(team);
    const roster = asArray(source.roster || source.players || source.members || source.lineup || source.elenco);

    return roster
      .map((member, index) => normalizeRosterMember(member, index + 1))
      .filter((member) => cleanText(member.id || member.name))
      .slice(0, DEFAULT_CONFIG.teamSize);
  }

  function createLineupSlot(slotIndex = 1, member = {}, role = LINEUP_ROLE_TYPES.STARTER, overrides = {}) {
    const source = asObject(overrides);
    const player = normalizeRosterMember(member, slotIndex);
    const safeRole = role === LINEUP_ROLE_TYPES.RESERVE ? LINEUP_ROLE_TYPES.RESERVE : LINEUP_ROLE_TYPES.STARTER;

    return {
      slot: clampNumber(source.slot ?? slotIndex, 1, DEFAULT_CONFIG.teamSize, slotIndex),
      role: safeRole,
      playerId: cleanText(source.playerId || source.player_id || player.id),
      profileId: cleanText(source.profileId || source.profile_id || player.profileId || player.id),
      playerSlug: cleanText(source.playerSlug || source.player_slug || player.slug),
      playerName: cleanText(source.playerName || source.player_name || player.nickname || player.name, `Jogador ${slotIndex}`),
      character: cleanText(source.character || source.mainCharacter || source.main_character),
      order: clampNumber(source.order ?? source.slot ?? slotIndex, 1, DEFAULT_CONFIG.teamSize, slotIndex),
      metadata: asObject(source.metadata)
    };
  }

  function buildDefaultTeamLineup(team, options = {}) {
    const config = normalizeConfig(options.config || options);
    const roster = normalizeTeamRoster(team);
    const starters = roster.slice(0, config.startersPerTeamMatch).map((member, index) => {
      return createLineupSlot(index + 1, member, LINEUP_ROLE_TYPES.STARTER);
    });
    const reserveMember = roster[config.startersPerTeamMatch] || null;
    const reserve = reserveMember
      ? createLineupSlot(config.startersPerTeamMatch + 1, reserveMember, LINEUP_ROLE_TYPES.RESERVE)
      : null;

    return {
      teamId: cleanText(asObject(team).id || asObject(team).teamId || asObject(team).slug || asObject(team).teamSlug),
      starters,
      reserve,
      slots: reserve ? [...starters, reserve] : starters,
      metadata: {
        generated: true,
        source: "roster-order"
      }
    };
  }

  function normalizeTeamLineup(lineup = {}, team = {}, options = {}) {
    const source = asObject(lineup);
    const config = normalizeConfig(options.config || options);
    const fallback = buildDefaultTeamLineup(team, config);
    const starterSource = asArray(source.starters || source.main || source.players || source.slots).length
      ? asArray(source.starters || source.main || source.players || source.slots)
      : fallback.starters;
    const reserveSource = source.reserve || asArray(source.reserves)[0] || fallback.reserve;
    const starters = starterSource.slice(0, config.startersPerTeamMatch).map((entry, index) => {
      return createLineupSlot(index + 1, entry, LINEUP_ROLE_TYPES.STARTER, entry);
    });
    const reserve = reserveSource
      ? createLineupSlot(config.startersPerTeamMatch + 1, reserveSource, LINEUP_ROLE_TYPES.RESERVE, reserveSource)
      : null;

    return {
      teamId: cleanText(source.teamId || source.team_id || fallback.teamId),
      starters,
      reserve,
      slots: reserve ? [...starters, reserve] : starters,
      locked: source.locked === true,
      submittedBy: cleanText(source.submittedBy || source.submitted_by),
      submittedAt: cleanText(source.submittedAt || source.submitted_at),
      metadata: asObject(source.metadata)
    };
  }

  function validateTeamLineup(lineup = {}, team = {}, options = {}) {
    const config = normalizeConfig(options.config || options);
    const normalizedLineup = normalizeTeamLineup(lineup, team, config);
    const roster = normalizeTeamRoster(team);
    const rosterIds = new Set(roster.map((member) => cleanText(member.id)).filter(Boolean));
    const playerIds = normalizedLineup.slots.map((slot) => cleanText(slot.playerId)).filter(Boolean);
    const uniqueIds = new Set(playerIds);
    const errors = [];
    const warnings = [];

    if (normalizedLineup.starters.length !== config.startersPerTeamMatch) {
      errors.push(`Escalação precisa ter ${config.startersPerTeamMatch} titulares.`);
    }

    if (!normalizedLineup.reserve) {
      errors.push("Escalação precisa ter 1 reserva.");
    }

    if (playerIds.length !== uniqueIds.size) {
      errors.push("A escalação não pode repetir o mesmo jogador.");
    }

    if (rosterIds.size && playerIds.some((playerId) => !rosterIds.has(playerId))) {
      errors.push("Todos os escalados precisam estar no elenco da equipe.");
    }

    if (roster.length && roster.length < config.teamSize) {
      warnings.push(`Elenco incompleto: ${roster.length}/${config.teamSize} jogadores.`);
    }

    return {
      valid: errors.length === 0,
      ready: errors.length === 0 && normalizedLineup.starters.length === config.startersPerTeamMatch && Boolean(normalizedLineup.reserve),
      lineup: normalizedLineup,
      requiredStarters: config.startersPerTeamMatch,
      requiredReserve: config.reservePerTeamMatch,
      errors,
      warnings
    };
  }

  function applyLineupsToTeamMatch(teamMatch = {}, homeLineup = {}, awayLineup = {}, config = {}) {
    const normalizedConfig = normalizeConfig(config);
    const source = createTeamMatchSeed(teamMatch, normalizedConfig);
    const home = normalizeTeamLineup(homeLineup, { id: source.homeTeamId }, normalizedConfig);
    const away = normalizeTeamLineup(awayLineup, { id: source.awayTeamId }, normalizedConfig);
    const matches = source.matches.map((match, index) => {
      const homeSlot = home.starters[index] || {};
      const awaySlot = away.starters[index] || {};

      return {
        ...match,
        homePlayerId: cleanText(match.homePlayerId || homeSlot.playerId),
        awayPlayerId: cleanText(match.awayPlayerId || awaySlot.playerId),
        metadata: {
          ...asObject(match.metadata),
          homePlayerName: cleanText(homeSlot.playerName),
          awayPlayerName: cleanText(awaySlot.playerName)
        }
      };
    });
    const extraMatch = source.extraMatch || createMatchSlot(normalizedConfig.mainMatches + 1, MATCH_SLOT_TYPES.EXTRA, {}, normalizedConfig);

    return {
      ...source,
      homeLineup: home,
      awayLineup: away,
      matches,
      extraMatch: {
        ...extraMatch,
        homePlayerId: cleanText(extraMatch.homePlayerId || home.reserve?.playerId),
        awayPlayerId: cleanText(extraMatch.awayPlayerId || away.reserve?.playerId),
        metadata: {
          ...asObject(extraMatch.metadata),
          homePlayerName: cleanText(home.reserve?.playerName),
          awayPlayerName: cleanText(away.reserve?.playerName),
          onlyRequiredOnDraw: true
        }
      }
    };
  }

  function validateTeamMatchLineups(teamMatch = {}, homeTeam = {}, awayTeam = {}, config = {}) {
    const item = asObject(teamMatch);
    const homeValidation = validateTeamLineup(item.homeLineup, homeTeam, config);
    const awayValidation = validateTeamLineup(item.awayLineup, awayTeam, config);
    const errors = [
      ...homeValidation.errors.map((error) => `Mandante: ${error}`),
      ...awayValidation.errors.map((error) => `Visitante: ${error}`)
    ];

    return {
      valid: errors.length === 0,
      ready: homeValidation.ready && awayValidation.ready,
      home: homeValidation,
      away: awayValidation,
      errors,
      warnings: [
        ...homeValidation.warnings.map((warning) => `Mandante: ${warning}`),
        ...awayValidation.warnings.map((warning) => `Visitante: ${warning}`)
      ]
    };
  }

  function createTeamMatchFromTeams(homeTeam = {}, awayTeam = {}, overrides = {}, config = {}) {
    const home = normalizeTeamEntry(homeTeam, 1);
    const away = normalizeTeamEntry(awayTeam, 2);
    const seed = createTeamMatchSeed({
      ...asObject(overrides),
      homeTeamId: home.id,
      awayTeamId: away.id,
      homeLineup: buildDefaultTeamLineup(homeTeam, config),
      awayLineup: buildDefaultTeamLineup(awayTeam, config)
    }, config);

    return applyLineupsToTeamMatch(seed, seed.homeLineup, seed.awayLineup, config);
  }

  function validateRoster(roster) {
    const members = asArray(roster).map((member) => asObject(member)).filter((member) => cleanText(member.id || member.profileId || member.slug || member.name));

    return {
      valid: members.length === DEFAULT_CONFIG.teamSize,
      required: DEFAULT_CONFIG.teamSize,
      current: members.length,
      starters: members.slice(0, DEFAULT_CONFIG.startersPerTeamMatch),
      reserve: members.slice(DEFAULT_CONFIG.startersPerTeamMatch, DEFAULT_CONFIG.teamSize)[0] || null
    };
  }

  function buildRoundRobinPairings(teams = []) {
    const sourceTeams = asArray(teams).map((team, index) => normalizeTeamEntry(team, index + 1));
    const hasBye = sourceTeams.length % 2 !== 0;
    const rotationTeams = hasBye
      ? [...sourceTeams, { id: "__bye__", name: "Folga", isBye: true }]
      : [...sourceTeams];
    const rounds = [];
    const roundsCount = Math.max(0, rotationTeams.length - 1);
    const half = rotationTeams.length / 2;
    let pool = [...rotationTeams];

    for (let roundIndex = 0; roundIndex < roundsCount; roundIndex += 1) {
      const matches = [];

      for (let pairIndex = 0; pairIndex < half; pairIndex += 1) {
        const first = pool[pairIndex];
        const second = pool[pool.length - 1 - pairIndex];

        if (!first || !second || first.isBye || second.isBye) continue;

        const invertHomeAway = (roundIndex + pairIndex) % 2 === 1;
        matches.push({
          round: roundIndex + 1,
          matchOrder: matches.length + 1,
          homeTeamId: invertHomeAway ? second.id : first.id,
          awayTeamId: invertHomeAway ? first.id : second.id
        });
      }

      rounds.push({
        id: `round-${roundIndex + 1}`,
        round: roundIndex + 1,
        label: `Rodada ${roundIndex + 1}`,
        matches
      });

      pool = [pool[0], pool[pool.length - 1], ...pool.slice(1, pool.length - 1)];
    }

    return rounds;
  }

  function createDivisionSchedule(division, options = {}) {
    const source = createEmptyDivision(1, division);
    const normalizedTeams = asArray(source.teams).map((team, index) => normalizeTeamEntry(team, index + 1, source.id));
    const config = normalizeConfig(options.config || options);
    const pairingRounds = buildRoundRobinPairings(normalizedTeams);

    const rounds = pairingRounds.map((round) => {
      return {
        ...round,
        divisionId: source.id,
        matches: asArray(round.matches).map((match, matchIndex) => createTeamMatchSeed({
          id: cleanText(match.id, `${source.id}-r${round.round}-m${matchIndex + 1}`),
          round: round.round,
          divisionId: source.id,
          homeTeamId: match.homeTeamId,
          awayTeamId: match.awayTeamId,
          status: TEAM_MATCH_STATUS.DRAFT
        }, config))
      };
    });

    return {
      ...source,
      teams: normalizedTeams,
      rounds,
      standings: calculateDivisionStandings({ ...source, teams: normalizedTeams }, [])
    };
  }

  function getLeagueSourceTeams(league = {}) {
    const source = asObject(league);
    return asArray(source.teams || source.teamEntries || source.team_entries || source.participants || source.participantTeams);
  }

  function getLeagueSourceDivisions(league = {}, options = {}) {
    const source = asObject(league);
    const config = normalizeConfig(options.config || source.config || source.settings || source);
    const rawDivisions = asArray(source.divisions || source.groups || source.conferences);

    if (isAdvancedLeagueMode(config.leagueMode)) {
      return rawDivisions.slice(0, config.maxDivisions || 32).map((division, index) => createEmptyDivision(index + 1, division));
    }

    const firstDivision = rawDivisions[0] ? createEmptyDivision(1, rawDivisions[0]) : createEmptyDivision(1, {
      id: "division-unica",
      name: config.defaultDivisionName
    });
    const teams = firstDivision.teams.length ? firstDivision.teams : getLeagueSourceTeams(source);

    return [{
      ...firstDivision,
      id: cleanText(firstDivision.id, "division-unica"),
      name: cleanText(firstDivision.name, config.defaultDivisionName),
      order: 1,
      teams
    }];
  }

  function buildTeamBattleLeagueStructure(league = {}, options = {}) {
    const source = asObject(league);
    const config = normalizeConfig(options.config || source.config || source.settings || source);
    const divisions = getLeagueSourceDivisions(source, { ...options, config }).map((division, index) => {
      const baseDivision = createEmptyDivision(index + 1, division);
      return baseDivision.rounds.length ? baseDivision : createDivisionSchedule(baseDivision, { ...options, config });
    });

    return {
      formatKey: FORMAT_KEY,
      schemaVersion: `${SCHEMA_VERSION}.structure.v1`,
      title: cleanText(source.title || source.name, "Team Battle League 4v4"),
      leagueMode: config.leagueMode,
      leagueModeLabel: getLeagueModeLabel(config.leagueMode),
      leagueModeDescription: getLeagueModeDescription(config.leagueMode),
      divisions,
      divisionCount: divisions.length,
      metadata: {
        generatedAt: new Date().toISOString(),
        mode: config.leagueMode,
        source: "team-battle-structure"
      }
    };
  }

  function flattenDivisionMatches(division) {
    const rounds = asArray(asObject(division).rounds);
    return rounds.flatMap((round) => asArray(round.matches));
  }

  function calculateDivisionStandings(division, matches = []) {
    const source = asObject(division);
    const teams = asArray(source.teams).map((team, index) => normalizeTeamEntry(team, index + 1, source.id));
    const rows = new Map();

    teams.forEach((team, index) => {
      rows.set(team.id, {
        teamId: team.id,
        teamName: team.name,
        tag: team.tag,
        seed: team.seed || index + 1,
        played: 0,
        teamMatchWins: 0,
        teamMatchLosses: 0,
        draws: 0,
        battlePoints: 0,
        battlePointsAgainst: 0,
        individualWins: 0,
        individualLosses: 0,
        position: index + 1
      });
    });

    const allMatches = asArray(matches).length ? asArray(matches) : flattenDivisionMatches(source);

    allMatches.forEach((teamMatch) => {
      const item = asObject(teamMatch);
      const homeRow = rows.get(cleanText(item.homeTeamId));
      const awayRow = rows.get(cleanText(item.awayTeamId));
      const score = calculateTeamMatchScore(item);

      if (!homeRow || !awayRow || score.played <= 0) return;

      homeRow.played += 1;
      awayRow.played += 1;
      homeRow.battlePoints += score.homePoints;
      homeRow.battlePointsAgainst += score.awayPoints;
      homeRow.individualWins += score.homeWins;
      homeRow.individualLosses += score.awayWins;
      awayRow.battlePoints += score.awayPoints;
      awayRow.battlePointsAgainst += score.homePoints;
      awayRow.individualWins += score.awayWins;
      awayRow.individualLosses += score.homeWins;

      if (score.winnerSide === "home") {
        homeRow.teamMatchWins += 1;
        awayRow.teamMatchLosses += 1;
      } else if (score.winnerSide === "away") {
        awayRow.teamMatchWins += 1;
        homeRow.teamMatchLosses += 1;
      } else {
        homeRow.draws += 1;
        awayRow.draws += 1;
      }
    });

    return Array.from(rows.values())
      .map((row) => ({
        ...row,
        battlePointDiff: row.battlePoints - row.battlePointsAgainst,
        individualDiff: row.individualWins - row.individualLosses
      }))
      .sort((first, second) => {
        const battleDiff = second.battlePoints - first.battlePoints;
        if (battleDiff !== 0) return battleDiff;

        const teamWinsDiff = second.teamMatchWins - first.teamMatchWins;
        if (teamWinsDiff !== 0) return teamWinsDiff;

        const individualDiff = second.individualDiff - first.individualDiff;
        if (individualDiff !== 0) return individualDiff;

        const pointDiff = second.battlePointDiff - first.battlePointDiff;
        if (pointDiff !== 0) return pointDiff;

        return first.teamName.localeCompare(second.teamName, "pt-BR");
      })
      .map((row, index) => ({ ...row, position: index + 1 }));
  }


  function normalizeStandingRow(row = {}, index = 1) {
    const source = asObject(row);
    const teamName = cleanText(source.teamName || source.name || source.displayName || source.display_name, `Equipe ${index}`);
    const teamId = cleanText(source.teamId || source.id || source.teamSlug || source.slug, cleanKey(teamName, `team-${index}`));

    return {
      teamId,
      teamName,
      tag: cleanText(source.tag || source.teamTag || source.team_tag),
      position: clampNumber(source.position || source.rank || index, 1, 999, index),
      seed: clampNumber(source.seed || source.position || source.rank || index, 1, 999, index),
      battlePoints: Number(source.battlePoints || source.points || 0) || 0,
      teamMatchWins: Number(source.teamMatchWins || source.wins || 0) || 0,
      individualWins: Number(source.individualWins || 0) || 0,
      battlePointDiff: Number(source.battlePointDiff || source.pointDiff || 0) || 0,
      source: asObject(source)
    };
  }

  function getQualifiedTeamsFromStandings(standings = [], limit = 3) {
    const safeLimit = clampNumber(limit, 1, 16, 3);

    return asArray(standings)
      .map((row, index) => normalizeStandingRow(row, index + 1))
      .sort((first, second) => {
        const positionDiff = first.position - second.position;
        if (positionDiff !== 0) return positionDiff;

        const pointsDiff = second.battlePoints - first.battlePoints;
        if (pointsDiff !== 0) return pointsDiff;

        const winsDiff = second.teamMatchWins - first.teamMatchWins;
        if (winsDiff !== 0) return winsDiff;

        return first.teamName.localeCompare(second.teamName, "pt-BR");
      })
      .slice(0, safeLimit)
      .map((row, index) => ({
        ...row,
        seed: index + 1,
        qualifierLabel: `${index + 1}º colocado`
      }));
  }

  function createPlayoffTeamReference(row = {}, fallbackSeed = 1) {
    const source = normalizeStandingRow(row, fallbackSeed);

    return {
      id: source.teamId,
      teamId: source.teamId,
      name: source.teamName,
      teamName: source.teamName,
      tag: source.tag,
      seed: clampNumber(source.seed || fallbackSeed, 1, 999, fallbackSeed),
      label: source.qualifierLabel || `${source.seed || fallbackSeed}º colocado`,
      source
    };
  }

  function createPlayoffMatch(options = {}, config = {}) {
    const source = asObject(options);
    const home = asObject(source.homeTeam);
    const away = asObject(source.awayTeam);
    const stageType = cleanText(source.stageType || source.stage, PLAYOFF_STAGE_TYPES.DIVISION_FINAL);
    const label = cleanText(source.label, "Playoff");
    const match = createTeamMatchSeed({
      id: cleanText(source.id, cleanKey(`${source.divisionId || "league"}-${label}`)),
      round: clampNumber(source.round, 1, 99, 1),
      divisionId: cleanText(source.divisionId),
      homeTeamId: cleanText(home.teamId || home.id),
      awayTeamId: cleanText(away.teamId || away.id),
      status: TEAM_MATCH_STATUS.DRAFT,
      metadata: {
        stageType,
        label,
        homeTeamName: cleanText(home.teamName || home.name, "Mandante"),
        awayTeamName: cleanText(away.teamName || away.name, "Visitante"),
        homeSeed: home.seed || null,
        awaySeed: away.seed || null,
        source: "team-battle-playoffs",
        ...asObject(source.metadata)
      }
    }, config);

    return {
      ...match,
      playoff: {
        stageType,
        label,
        order: clampNumber(source.order, 1, 99, 1),
        winnerFeedsTo: cleanText(source.winnerFeedsTo),
        loserFeedsTo: cleanText(source.loserFeedsTo)
      }
    };
  }

  function buildDivisionPlayoffBracket(division = {}, options = {}) {
    const source = asObject(division);
    const config = normalizeConfig(options.config || options);
    const standings = asArray(options.standings).length
      ? asArray(options.standings)
      : asArray(source.standings).length
        ? asArray(source.standings)
        : calculateDivisionStandings(source);
    const qualified = getQualifiedTeamsFromStandings(standings, options.qualifiersPerDivision || 3);
    const divisionId = cleanText(source.id || source.divisionId, "division-1");
    const divisionName = cleanText(source.name || source.label, "Divisão");
    const stages = [];

    if (qualified.length < 2) {
      return {
        divisionId,
        divisionName,
        qualifiedTeams: qualified,
        stages,
        championSlot: null,
        status: "waiting_qualified_teams"
      };
    }

    const seed1 = createPlayoffTeamReference(qualified[0], 1);
    const seed2 = createPlayoffTeamReference(qualified[1], 2);
    const seed3 = qualified[2] ? createPlayoffTeamReference(qualified[2], 3) : null;
    const finalMatchId = `${divisionId}-division-final`;

    if (seed3) {
      const semifinalId = `${divisionId}-division-semifinal`;
      const semifinal = createPlayoffMatch({
        id: semifinalId,
        divisionId,
        round: 1,
        order: 1,
        stageType: PLAYOFF_STAGE_TYPES.DIVISION_SEMIFINAL,
        label: `${divisionName} — Semifinal`,
        homeTeam: seed2,
        awayTeam: seed3,
        winnerFeedsTo: finalMatchId
      }, config);
      const semifinalWinner = {
        id: `winner:${semifinalId}`,
        teamId: `winner:${semifinalId}`,
        name: `Vencedor ${semifinal.metadata.label}`,
        teamName: `Vencedor ${semifinal.metadata.label}`,
        seed: 2,
        label: "Vencedor da semifinal"
      };
      const final = createPlayoffMatch({
        id: finalMatchId,
        divisionId,
        round: 2,
        order: 1,
        stageType: PLAYOFF_STAGE_TYPES.DIVISION_FINAL,
        label: `${divisionName} — Final`,
        homeTeam: seed1,
        awayTeam: semifinalWinner
      }, config);

      stages.push({
        id: `${divisionId}-playoff-semifinal-stage`,
        type: PLAYOFF_STAGE_TYPES.DIVISION_SEMIFINAL,
        label: "Semifinal da divisão",
        matches: [semifinal]
      });
      stages.push({
        id: `${divisionId}-playoff-final-stage`,
        type: PLAYOFF_STAGE_TYPES.DIVISION_FINAL,
        label: "Final da divisão",
        matches: [final]
      });
    } else {
      const final = createPlayoffMatch({
        id: finalMatchId,
        divisionId,
        round: 1,
        order: 1,
        stageType: PLAYOFF_STAGE_TYPES.DIVISION_FINAL,
        label: `${divisionName} — Final`,
        homeTeam: seed1,
        awayTeam: seed2
      }, config);

      stages.push({
        id: `${divisionId}-playoff-final-stage`,
        type: PLAYOFF_STAGE_TYPES.DIVISION_FINAL,
        label: "Final da divisão",
        matches: [final]
      });
    }

    return {
      divisionId,
      divisionName,
      qualifiedTeams: qualified,
      stages,
      championSlot: {
        id: `winner:${finalMatchId}`,
        teamId: `winner:${finalMatchId}`,
        name: `Campeão ${divisionName}`,
        teamName: `Campeão ${divisionName}`,
        seed: 1,
        sourceMatchId: finalMatchId
      },
      status: "ready"
    };
  }

  function buildLeaguePlayoffPlan(divisions = [], options = {}) {
    const config = normalizeConfig(options.config || options);
    const brackets = asArray(divisions).map((division, index) => {
      return buildDivisionPlayoffBracket(division, {
        ...options,
        config,
        standings: asArray(asObject(division).standings),
        qualifiersPerDivision: options.qualifiersPerDivision || 3,
        divisionIndex: index + 1
      });
    });
    const championSlots = brackets.map((bracket, index) => {
      const slot = asObject(bracket.championSlot);
      return Object.keys(slot).length ? { ...slot, seed: index + 1 } : null;
    }).filter(Boolean);
    const finalStages = [];

    if (championSlots.length >= 2) {
      const grandFinal = createPlayoffMatch({
        id: "team-battle-grand-final",
        round: 99,
        order: 1,
        stageType: PLAYOFF_STAGE_TYPES.GRAND_FINAL,
        label: "Grande Final",
        homeTeam: championSlots[0],
        awayTeam: championSlots[1],
        metadata: {
          sourceDivisionChampionA: championSlots[0].sourceMatchId || "",
          sourceDivisionChampionB: championSlots[1].sourceMatchId || ""
        }
      }, config);

      finalStages.push({
        id: "team-battle-grand-final-stage",
        type: PLAYOFF_STAGE_TYPES.GRAND_FINAL,
        label: "Grande Final",
        matches: [grandFinal]
      });
    }

    return {
      formatKey: FORMAT_KEY,
      schemaVersion: `${SCHEMA_VERSION}.playoffs.v1`,
      status: brackets.some((bracket) => bracket.status === "ready") ? "ready" : "waiting_qualified_teams",
      qualifiersPerDivision: clampNumber(options.qualifiersPerDivision || 3, 1, 16, 3),
      divisionBrackets: brackets,
      finalStages,
      metadata: {
        generatedAt: new Date().toISOString(),
        divisionCount: brackets.length,
        finalistCount: championSlots.length
      }
    };
  }


  function findTeamReference(teams = [], teamId = "") {
    const key = cleanText(teamId);
    if (!key) return null;

    return asArray(teams).map((team, index) => normalizeTeamEntry(team, index + 1)).find((team) => {
      return [team.id, team.slug, team.name, team.tag].map(cleanText).includes(key);
    }) || null;
  }

  function getTeamDisplayLabel(team = {}, fallback = "Equipe") {
    const source = asObject(team);
    const tag = cleanText(source.tag || source.teamTag || source.team_tag);
    const name = cleanText(source.name || source.teamName || source.team_name || source.displayName || source.display_name, fallback);

    return tag ? `${tag} ${name}` : name;
  }

  function buildMatchSlotPublicSummary(slot = {}) {
    const source = asObject(slot);
    const score = normalizeSlotScore(source.score);
    const winnerSide = normalizeWinnerSide(source.winnerSide);
    const status = cleanText(source.status, winnerSide ? TEAM_MATCH_STATUS.FINISHED : TEAM_MATCH_STATUS.DRAFT);
    const homePlayerName = cleanText(source.metadata?.homePlayerName || source.homePlayerName || source.homePlayerId, "Mandante");
    const awayPlayerName = cleanText(source.metadata?.awayPlayerName || source.awayPlayerName || source.awayPlayerId, "Visitante");

    return {
      slot: clampNumber(source.slot, 1, 9, 1),
      type: source.type === MATCH_SLOT_TYPES.EXTRA ? MATCH_SLOT_TYPES.EXTRA : MATCH_SLOT_TYPES.MAIN,
      label: cleanText(source.label, source.type === MATCH_SLOT_TYPES.EXTRA ? "Partida extra" : `Partida ${source.slot || 1}`),
      status,
      points: clampNumber(source.points, 1, 99, getDefaultSlotPoints(source.slot, source.type)),
      homePlayerId: cleanText(source.homePlayerId),
      awayPlayerId: cleanText(source.awayPlayerId),
      homePlayerName,
      awayPlayerName,
      score,
      scoreLabel: `${score.home || 0} x ${score.away || 0}`,
      winnerSide,
      winnerLabel: winnerSide === "home" ? homePlayerName : winnerSide === "away" ? awayPlayerName : "A definir"
    };
  }

  function buildTeamMatchPublicSummary(teamMatch = {}, options = {}) {
    const source = finalizeTeamMatchResult(teamMatch, options.config || options);
    const teams = asArray(options.teams);
    const homeTeam = findTeamReference(teams, source.homeTeamId) || {
      id: source.homeTeamId,
      name: source.metadata?.homeTeamName || source.homeTeamName || source.homeTeamId || "Mandante"
    };
    const awayTeam = findTeamReference(teams, source.awayTeamId) || {
      id: source.awayTeamId,
      name: source.metadata?.awayTeamName || source.awayTeamName || source.awayTeamId || "Visitante"
    };
    const publicResult = buildTeamMatchPublicResult(source, options.config || options);
    const mainMatches = asArray(source.matches).map(buildMatchSlotPublicSummary);
    const extraMatch = source.extraMatch ? buildMatchSlotPublicSummary(source.extraMatch) : null;

    return {
      id: cleanText(source.id),
      round: clampNumber(source.round, 1, 99, 1),
      divisionId: cleanText(source.divisionId),
      status: cleanText(source.status, TEAM_MATCH_STATUS.DRAFT),
      stageType: cleanText(source.playoff?.stageType || source.metadata?.stageType),
      stageLabel: cleanText(source.playoff?.label || source.metadata?.label),
      homeTeamId: cleanText(source.homeTeamId),
      awayTeamId: cleanText(source.awayTeamId),
      homeTeamLabel: getTeamDisplayLabel(homeTeam, "Mandante"),
      awayTeamLabel: getTeamDisplayLabel(awayTeam, "Visitante"),
      scoreLabel: publicResult.scoreLabel,
      winsLabel: publicResult.winsLabel,
      winnerSide: publicResult.winnerSide,
      winnerLabel: publicResult.winnerLabel,
      extraRequired: publicResult.extraRequired,
      finalized: publicResult.finalized,
      mainMatches,
      extraMatch,
      metadata: {
        source: "team-battle-public-summary",
        updatedAt: new Date().toISOString()
      }
    };
  }

  function buildRoundPublicSummary(round = {}, options = {}) {
    const source = asObject(round);
    const teams = asArray(options.teams);
    const matches = asArray(source.matches).map((match) => buildTeamMatchPublicSummary(match, {
      ...options,
      teams
    }));

    return {
      id: cleanText(source.id, `round-${source.round || 1}`),
      round: clampNumber(source.round, 1, 99, 1),
      label: cleanText(source.label, `Rodada ${source.round || 1}`),
      divisionId: cleanText(source.divisionId || options.divisionId),
      matches,
      matchCount: matches.length,
      finishedCount: matches.filter((match) => match.finalized).length
    };
  }

  function buildDivisionPublicSummary(division = {}, options = {}) {
    const source = asObject(division);
    const teams = asArray(source.teams).map((team, index) => normalizeTeamEntry(team, index + 1, source.id));
    const standings = asArray(source.standings).length ? asArray(source.standings) : calculateDivisionStandings({ ...source, teams });
    const rounds = asArray(source.rounds).map((round) => buildRoundPublicSummary(round, {
      ...options,
      divisionId: source.id,
      teams
    }));
    const playoffBracket = options.includePlayoffs === false ? null : buildDivisionPlayoffBracket({ ...source, teams, standings }, options);

    return {
      id: cleanText(source.id || source.divisionId, "division-1"),
      name: cleanText(source.name || source.label, "Divisão"),
      teamCount: teams.length,
      roundCount: rounds.length,
      matchCount: rounds.reduce((total, round) => total + Number(round.matchCount || 0), 0),
      finishedMatchCount: rounds.reduce((total, round) => total + Number(round.finishedCount || 0), 0),
      teams: teams.map((team) => ({
        id: team.id,
        slug: team.slug,
        name: team.name,
        tag: team.tag,
        label: getTeamDisplayLabel(team, team.name),
        seed: team.seed
      })),
      standings: standings.map((row, index) => normalizeStandingRow(row, index + 1)),
      rounds,
      playoffBracket,
      status: rounds.length ? "scheduled" : "draft"
    };
  }

  function buildLeaguePublicSummary(league = {}, options = {}) {
    const source = asObject(league);
    const config = normalizeConfig(options.config || source.config || source.settings || source);
    const divisionsSource = getLeagueSourceDivisions(source, { ...options, config });
    const divisions = divisionsSource.map((division, index) => buildDivisionPublicSummary(division, {
      ...options,
      config,
      divisionIndex: index + 1,
      includePlayoffs: options.includePlayoffs !== false
    }));
    const playoffPlan = options.includePlayoffs === false ? null : buildLeaguePlayoffPlan(divisionsSource, { ...options, config });
    const totals = divisions.reduce((acc, division) => {
      acc.teams += Number(division.teamCount || 0);
      acc.rounds += Number(division.roundCount || 0);
      acc.matches += Number(division.matchCount || 0);
      acc.finishedMatches += Number(division.finishedMatchCount || 0);
      return acc;
    }, { teams: 0, rounds: 0, matches: 0, finishedMatches: 0 });

    return {
      formatKey: FORMAT_KEY,
      schemaVersion: `${SCHEMA_VERSION}.public.v1`,
      title: cleanText(source.title || source.name, "Team Battle League 4v4"),
      status: cleanText(source.status, DEFAULT_CONFIG.status),
      leagueMode: config.leagueMode,
      leagueModeLabel: getLeagueModeLabel(config.leagueMode),
      leagueModeDescription: getLeagueModeDescription(config.leagueMode),
      divisionCount: divisions.length,
      totals,
      divisions,
      playoffPlan,
      summaryLabel: `${getLeagueModeLabel(config.leagueMode)} · ${divisions.length} divisão${divisions.length === 1 ? "" : "ões"} · ${totals.teams} equipe${totals.teams === 1 ? "" : "s"} · ${totals.matches} confronto${totals.matches === 1 ? "" : "s"}`,
      metadata: {
        generatedAt: new Date().toISOString(),
        source: "team-battle-public-overview"
      }
    };
  }

  function buildTeamBattlePublicOverview(data = {}, options = {}) {
    return buildLeaguePublicSummary(data, options);
  }


  function getTeamEntryKey(team = {}, fallback = "") {
    const source = asObject(team);
    return cleanText(source.id || source.teamId || source.team_id || source.slug || source.teamSlug || source.team_slug || source.name || source.teamName, fallback);
  }

  function getRosterReadinessLabel(validation = {}) {
    const source = asObject(validation);

    if (source.valid) return "Pronto";
    if (Number(source.current || 0) <= 0) return "Sem elenco";
    return `Incompleto (${source.current || 0}/${source.required || DEFAULT_CONFIG.teamSize})`;
  }

  function validateDivisionTeams(division = {}, options = {}) {
    const source = asObject(division);
    const divisionId = cleanText(source.id || source.divisionId || source.division_id, `division-${options.divisionIndex || 1}`);
    const teams = asArray(source.teams).map((team, index) => normalizeTeamEntry(team, index + 1, divisionId));
    const seenTeams = new Map();
    const errors = [];
    const warnings = [];
    const rosterStatus = [];

    teams.forEach((team, index) => {
      const key = getTeamEntryKey(team, `team-${index + 1}`);
      const rosterValidation = validateRoster(team.roster);

      if (seenTeams.has(key)) {
        errors.push(`Equipe duplicada na ${source.name || divisionId}: ${team.name}.`);
      }

      seenTeams.set(key, team);

      rosterStatus.push({
        teamId: team.id,
        teamName: team.name,
        tag: team.tag,
        valid: rosterValidation.valid,
        current: rosterValidation.current,
        required: rosterValidation.required,
        label: getRosterReadinessLabel(rosterValidation)
      });

      if (!rosterValidation.valid) {
        warnings.push(`${team.name}: elenco ${rosterValidation.current}/${rosterValidation.required}.`);
      }
    });

    if (teams.length < 2) {
      errors.push(`A ${source.name || divisionId} precisa de pelo menos 2 equipes.`);
    }

    return {
      valid: errors.length === 0,
      ready: errors.length === 0 && rosterStatus.every((item) => item.valid),
      divisionId,
      divisionName: cleanText(source.name || source.label, `Divisão ${options.divisionIndex || 1}`),
      teamCount: teams.length,
      readyTeams: rosterStatus.filter((item) => item.valid).length,
      teams: rosterStatus,
      errors,
      warnings
    };
  }

  function validateDivisionSchedule(division = {}, options = {}) {
    const source = asObject(division);
    const teams = asArray(source.teams).map((team, index) => normalizeTeamEntry(team, index + 1, source.id));
    const teamIds = new Set(teams.map((team) => cleanText(team.id)).filter(Boolean));
    const rounds = asArray(source.rounds);
    const matches = rounds.flatMap((round) => asArray(round.matches).map((match) => ({ ...asObject(match), roundId: round.id, round: round.round })));
    const seenMatchIds = new Set();
    const pairCount = new Map();
    const errors = [];
    const warnings = [];

    matches.forEach((match, index) => {
      const id = cleanText(match.id, `match-${index + 1}`);
      const homeTeamId = cleanText(match.homeTeamId);
      const awayTeamId = cleanText(match.awayTeamId);
      const pairKey = [homeTeamId, awayTeamId].sort().join("::");

      if (seenMatchIds.has(id)) {
        errors.push(`Confronto duplicado no calendário: ${id}.`);
      }

      seenMatchIds.add(id);

      if (!teamIds.has(homeTeamId)) {
        errors.push(`Mandante fora da divisão no confronto ${id}.`);
      }

      if (!teamIds.has(awayTeamId)) {
        errors.push(`Visitante fora da divisão no confronto ${id}.`);
      }

      if (homeTeamId && awayTeamId && homeTeamId === awayTeamId) {
        errors.push(`Confronto ${id} usa a mesma equipe dos dois lados.`);
      }

      if (homeTeamId && awayTeamId) {
        pairCount.set(pairKey, Number(pairCount.get(pairKey) || 0) + 1);
      }
    });

    if (!rounds.length && teams.length >= 2) {
      warnings.push("Calendário ainda não gerado para a divisão.");
    }

    const expectedPairCount = teams.length >= 2 ? (teams.length * (teams.length - 1)) / 2 : 0;
    const generatedPairs = pairCount.size;

    if (matches.length && generatedPairs < expectedPairCount) {
      warnings.push(`Calendário parcial: ${generatedPairs}/${expectedPairCount} confrontos únicos.`);
    }

    return {
      valid: errors.length === 0,
      ready: errors.length === 0 && rounds.length > 0 && generatedPairs >= expectedPairCount,
      roundCount: rounds.length,
      matchCount: matches.length,
      expectedPairCount,
      generatedPairs,
      errors,
      warnings
    };
  }

  function validateTeamBattleLeagueStructure(league = {}, options = {}) {
    const source = asObject(league);
    const config = normalizeConfig(options.config || source.config || source.settings || source);
    const rawDivisions = asArray(source.divisions || source.groups || source.conferences);
    const divisions = getLeagueSourceDivisions(source, { ...options, config });
    const errors = [];
    const warnings = [];

    if (!divisions.length) {
      errors.push(isAdvancedLeagueMode(config.leagueMode) ? "A liga avançada precisa ter pelo menos uma divisão." : "A liga básica precisa ter uma divisão única.");
    }

    if (!isAdvancedLeagueMode(config.leagueMode) && rawDivisions.length > 1) {
      warnings.push("Modo básico usa divisão única; divisões extras ficam reservadas para o modo avançado.");
    }

    const divisionReports = divisions.map((division, index) => {
      const teamReport = validateDivisionTeams(division, { ...options, divisionIndex: index + 1 });
      const scheduleReport = validateDivisionSchedule(division, { ...options, divisionIndex: index + 1 });

      return {
        divisionId: teamReport.divisionId,
        divisionName: teamReport.divisionName,
        valid: teamReport.valid && scheduleReport.valid,
        ready: teamReport.ready && scheduleReport.ready,
        teams: teamReport,
        schedule: scheduleReport,
        errors: [...teamReport.errors, ...scheduleReport.errors],
        warnings: [...teamReport.warnings, ...scheduleReport.warnings]
      };
    });

    divisionReports.forEach((report) => {
      errors.push(...report.errors.map((error) => `${report.divisionName}: ${error}`));
      warnings.push(...report.warnings.map((warning) => `${report.divisionName}: ${warning}`));
    });

    const readyDivisions = divisionReports.filter((report) => report.ready).length;
    const totalTeams = divisionReports.reduce((total, report) => total + Number(report.teams.teamCount || 0), 0);
    const readyTeams = divisionReports.reduce((total, report) => total + Number(report.teams.readyTeams || 0), 0);
    const totalMatches = divisionReports.reduce((total, report) => total + Number(report.schedule.matchCount || 0), 0);

    return {
      valid: errors.length === 0,
      ready: errors.length === 0 && divisions.length > 0 && readyDivisions === divisionReports.length,
      formatKey: FORMAT_KEY,
      schemaVersion: `${SCHEMA_VERSION}.readiness.v1`,
      title: cleanText(source.title || source.name, "Team Battle League 4v4"),
      leagueMode: config.leagueMode,
      leagueModeLabel: getLeagueModeLabel(config.leagueMode),
      leagueModeDescription: getLeagueModeDescription(config.leagueMode),
      divisionCount: divisions.length,
      readyDivisions,
      totalTeams,
      readyTeams,
      totalMatches,
      divisions: divisionReports,
      errors,
      warnings,
      generatedAt: new Date().toISOString()
    };
  }



  function getTeamBattleLeagueModePreset(mode = DEFAULT_CONFIG.leagueMode) {
    const normalizedMode = normalizeLeagueMode(mode);
    const isAdvanced = normalizedMode === LEAGUE_MODE_TYPES.ADVANCED_MULTI_DIVISION;

    return {
      key: normalizedMode,
      label: isAdvanced ? "Team Battle League 4v4 avançada" : "Team Battle League 4v4 básica",
      shortLabel: isAdvanced ? "Avançada" : "Básica",
      divisionLabel: isAdvanced ? "Várias divisões" : "Divisão única",
      description: getLeagueModeDescription(normalizedMode),
      maxDivisions: isAdvanced ? 32 : 1,
      defaultDivisionName: isAdvanced ? "Divisão 1" : DEFAULT_CONFIG.defaultDivisionName,
      recommendedFirstImplementation: !isAdvanced,
      requiresDivisionManagement: isAdvanced,
      status: isAdvanced ? "advanced_planned" : "base_priority"
    };
  }

  function createBasicSingleDivisionLeague(teams = [], overrides = {}, options = {}) {
    const source = asObject(overrides);
    const optionConfig = asObject(options.config);
    const sourceConfig = asObject(source.config || source.settings);
    const config = normalizeConfig({
      ...optionConfig,
      ...sourceConfig,
      leagueMode: LEAGUE_MODE_TYPES.BASIC_SINGLE_DIVISION,
      defaultDivisionName: cleanText(source.defaultDivisionName || source.default_division_name || sourceConfig.defaultDivisionName, DEFAULT_CONFIG.defaultDivisionName)
    });
    const sourceTeams = asArray(teams).length ? asArray(teams) : getLeagueSourceTeams(source);
    const normalizedTeams = sourceTeams.map((team, index) => normalizeTeamEntry(team, index + 1, "division-unica"));
    const division = createDivisionFromTeams(1, normalizedTeams, {
      id: "division-unica",
      name: config.defaultDivisionName,
      order: 1,
      metadata: {
        mode: LEAGUE_MODE_TYPES.BASIC_SINGLE_DIVISION,
        source: "basic-single-division-preset"
      }
    });
    const scheduledDivision = createDivisionSchedule(division, { ...options, config });

    return {
      formatKey: FORMAT_KEY,
      schemaVersion: `${SCHEMA_VERSION}.basic-single-division.v1`,
      title: cleanText(source.title || source.name, "Team Battle League 4v4 básica"),
      leagueMode: LEAGUE_MODE_TYPES.BASIC_SINGLE_DIVISION,
      leagueModeLabel: getLeagueModeLabel(LEAGUE_MODE_TYPES.BASIC_SINGLE_DIVISION),
      leagueModeDescription: getLeagueModeDescription(LEAGUE_MODE_TYPES.BASIC_SINGLE_DIVISION),
      config: {
        ...config,
        leagueMode: LEAGUE_MODE_TYPES.BASIC_SINGLE_DIVISION,
        advancedDivisionsEnabled: false,
        maxDivisions: 1
      },
      teams: normalizedTeams,
      divisions: [scheduledDivision],
      divisionCount: 1,
      metadata: {
        ...asObject(source.metadata),
        mode: LEAGUE_MODE_TYPES.BASIC_SINGLE_DIVISION,
        generatedAt: new Date().toISOString(),
        source: "team-battle-basic-single-division"
      }
    };
  }

  function createAdvancedMultiDivisionLeague(divisions = [], overrides = {}, options = {}) {
    const source = asObject(overrides);
    const optionConfig = asObject(options.config);
    const sourceConfig = asObject(source.config || source.settings);
    const config = normalizeConfig({
      ...optionConfig,
      ...sourceConfig,
      leagueMode: LEAGUE_MODE_TYPES.ADVANCED_MULTI_DIVISION,
      maxDivisions: source.maxDivisions || source.max_divisions || sourceConfig.maxDivisions || 32
    });
    const sourceDivisions = asArray(divisions).length ? asArray(divisions) : asArray(source.divisions || source.groups || source.conferences);
    const normalizedDivisions = sourceDivisions.slice(0, config.maxDivisions).map((division, index) => {
      const baseDivision = createEmptyDivision(index + 1, division);
      const teams = asArray(baseDivision.teams).map((team, teamIndex) => normalizeTeamEntry(team, teamIndex + 1, baseDivision.id));
      return createDivisionSchedule({ ...baseDivision, teams }, { ...options, config });
    });

    return {
      formatKey: FORMAT_KEY,
      schemaVersion: `${SCHEMA_VERSION}.advanced-multi-division.v1`,
      title: cleanText(source.title || source.name, "Team Battle League 4v4 avançada"),
      leagueMode: LEAGUE_MODE_TYPES.ADVANCED_MULTI_DIVISION,
      leagueModeLabel: getLeagueModeLabel(LEAGUE_MODE_TYPES.ADVANCED_MULTI_DIVISION),
      leagueModeDescription: getLeagueModeDescription(LEAGUE_MODE_TYPES.ADVANCED_MULTI_DIVISION),
      config: {
        ...config,
        leagueMode: LEAGUE_MODE_TYPES.ADVANCED_MULTI_DIVISION,
        advancedDivisionsEnabled: true
      },
      divisions: normalizedDivisions,
      divisionCount: normalizedDivisions.length,
      metadata: {
        ...asObject(source.metadata),
        mode: LEAGUE_MODE_TYPES.ADVANCED_MULTI_DIVISION,
        generatedAt: new Date().toISOString(),
        source: "team-battle-advanced-multi-division"
      }
    };
  }

  function createTeamBattleLeagueByMode(mode = DEFAULT_CONFIG.leagueMode, payload = {}, options = {}) {
    const normalizedMode = normalizeLeagueMode(mode || asObject(payload).leagueMode || asObject(payload).mode);
    const source = asObject(payload);

    if (normalizedMode === LEAGUE_MODE_TYPES.ADVANCED_MULTI_DIVISION) {
      return createAdvancedMultiDivisionLeague(source.divisions || source.groups || [], source, options);
    }

    return createBasicSingleDivisionLeague(source.teams || source.teamEntries || source.participants || [], source, options);
  }

  function buildBasicSingleDivisionReadinessReport(league = {}, options = {}) {
    const source = Array.isArray(league)
      ? createBasicSingleDivisionLeague(league, {}, options)
      : createTeamBattleLeagueByMode(LEAGUE_MODE_TYPES.BASIC_SINGLE_DIVISION, league, options);

    return buildTeamBattleLeagueReadinessReport(source, {
      ...options,
      config: {
        ...asObject(options.config),
        leagueMode: LEAGUE_MODE_TYPES.BASIC_SINGLE_DIVISION,
        maxDivisions: 1
      }
    });
  }



  function normalizeTeamRegistrationStatus(value) {
    const normalized = cleanKey(value, TEAM_REGISTRATION_STATUS.PENDING);

    if (["approved", "aprovado", "accepted", "aceito", "confirmado"].includes(normalized)) return TEAM_REGISTRATION_STATUS.APPROVED;
    if (["rejected", "recusado", "reprovado", "declined"].includes(normalized)) return TEAM_REGISTRATION_STATUS.REJECTED;
    if (["waitlist", "lista-espera", "lista-de-espera", "waiting"].includes(normalized)) return TEAM_REGISTRATION_STATUS.WAITLIST;
    if (["draft", "rascunho"].includes(normalized)) return TEAM_REGISTRATION_STATUS.DRAFT;

    return TEAM_REGISTRATION_STATUS.PENDING;
  }

  function createTeamRegistrationEntry(team = {}, options = {}) {
    const source = asObject(team);
    const normalizedTeam = normalizeTeamEntry(source, options.index || 1, options.divisionId || "division-unica");
    const roster = normalizeTeamRoster({ ...source, roster: source.roster || source.players || source.members });
    const status = normalizeTeamRegistrationStatus(source.status || source.registrationStatus || source.registration_status || options.status);

    return {
      id: cleanText(source.registrationId || source.registration_id || source.entryId || source.entry_id, `entry-${normalizedTeam.id}`),
      teamId: normalizedTeam.id,
      teamSlug: normalizedTeam.slug,
      teamName: normalizedTeam.name,
      teamTag: normalizedTeam.tag,
      divisionId: cleanText(source.divisionId || source.division_id || options.divisionId, "division-unica"),
      status,
      roster,
      rosterCount: roster.length,
      captainProfileId: cleanText(source.captainProfileId || source.captain_profile_id || source.captainId || source.captain_id),
      submittedAt: cleanText(source.submittedAt || source.submitted_at),
      approvedAt: status === TEAM_REGISTRATION_STATUS.APPROVED ? cleanText(source.approvedAt || source.approved_at) : "",
      metadata: {
        ...asObject(source.metadata),
        source: "team-battle-team-registration"
      }
    };
  }

  function validateTeamRegistrationEntry(entry = {}, options = {}) {
    const config = normalizeConfig(options.config || options);
    const normalizedEntry = createTeamRegistrationEntry(entry, options);
    const rosterValidation = validateRoster(normalizedEntry.roster);
    const rosterIds = normalizedEntry.roster.map((member) => cleanText(member.id || member.profileId || member.slug || member.name)).filter(Boolean);
    const uniqueRosterIds = new Set(rosterIds);
    const errors = [];
    const warnings = [];

    if (!normalizedEntry.teamId || !normalizedEntry.teamName) {
      errors.push("A inscrição precisa estar vinculada a uma equipe.");
    }

    if (!rosterValidation.valid) {
      errors.push(`A equipe precisa ter elenco com ${config.teamSize} jogadores.`);
    }

    if (rosterIds.length !== uniqueRosterIds.size) {
      errors.push("O elenco da inscrição não pode repetir jogadores.");
    }

    if (!normalizedEntry.captainProfileId) {
      warnings.push("Capitão da equipe ainda não identificado na inscrição.");
    }

    return {
      valid: errors.length === 0,
      ready: errors.length === 0 && normalizedEntry.status === TEAM_REGISTRATION_STATUS.APPROVED,
      entry: normalizedEntry,
      roster: rosterValidation,
      errors,
      warnings
    };
  }

  function getApprovedTeamRegistrationEntries(entries = [], options = {}) {
    return asArray(entries)
      .map((entry, index) => createTeamRegistrationEntry(entry, { ...options, index: index + 1 }))
      .filter((entry) => entry.status === TEAM_REGISTRATION_STATUS.APPROVED);
  }

  function buildTeamRegistrationSummary(entries = [], options = {}) {
    const normalizedEntries = asArray(entries).map((entry, index) => createTeamRegistrationEntry(entry, { ...options, index: index + 1 }));
    const validations = normalizedEntries.map((entry, index) => validateTeamRegistrationEntry(entry, { ...options, index: index + 1 }));
    const byStatus = normalizedEntries.reduce((acc, entry) => {
      acc[entry.status] = Number(acc[entry.status] || 0) + 1;
      return acc;
    }, {});
    const approvedEntries = normalizedEntries.filter((entry) => entry.status === TEAM_REGISTRATION_STATUS.APPROVED);
    const readyEntries = validations.filter((validation) => validation.ready);

    return {
      total: normalizedEntries.length,
      approved: approvedEntries.length,
      pending: Number(byStatus[TEAM_REGISTRATION_STATUS.PENDING] || 0),
      waitlist: Number(byStatus[TEAM_REGISTRATION_STATUS.WAITLIST] || 0),
      rejected: Number(byStatus[TEAM_REGISTRATION_STATUS.REJECTED] || 0),
      draft: Number(byStatus[TEAM_REGISTRATION_STATUS.DRAFT] || 0),
      ready: readyEntries.length,
      incomplete: validations.filter((validation) => !validation.valid).length,
      byStatus,
      entries: normalizedEntries,
      validations,
      summaryLabel: `${approvedEntries.length} equipe${approvedEntries.length === 1 ? "" : "s"} aprovada${approvedEntries.length === 1 ? "" : "s"} · ${readyEntries.length} pronta${readyEntries.length === 1 ? "" : "s"} para a liga básica`
    };
  }

  function buildBasicLeagueFromApprovedRegistrations(registrations = [], overrides = {}, options = {}) {
    const approvedEntries = getApprovedTeamRegistrationEntries(registrations, options);
    const teams = approvedEntries.map((entry, index) => normalizeTeamEntry({
      id: entry.teamId,
      slug: entry.teamSlug,
      name: entry.teamName,
      tag: entry.teamTag,
      roster: entry.roster,
      seed: index + 1,
      divisionId: entry.divisionId || "division-unica",
      metadata: {
        registrationId: entry.id,
        captainProfileId: entry.captainProfileId
      }
    }, index + 1, "division-unica"));

    return createBasicSingleDivisionLeague(teams, {
      ...asObject(overrides),
      metadata: {
        ...asObject(asObject(overrides).metadata),
        registrationCount: asArray(registrations).length,
        approvedRegistrationCount: approvedEntries.length,
        source: "approved-team-registrations"
      }
    }, options);
  }

  function appendTeamRegistrationToLeagueDraft(league = {}, team = {}, options = {}) {
    const source = asObject(league);
    const currentEntries = asArray(source.teamRegistrations || source.team_registrations || source.registrations || source.entries);
    const entry = createTeamRegistrationEntry(team, {
      ...options,
      index: currentEntries.length + 1,
      status: options.status || TEAM_REGISTRATION_STATUS.PENDING
    });
    const entries = [...currentEntries, entry];
    const registrationSummary = buildTeamRegistrationSummary(entries, options);

    return {
      ...source,
      teamRegistrations: entries,
      registrationSummary,
      metadata: {
        ...asObject(source.metadata),
        updatedAt: new Date().toISOString(),
        source: "team-battle-registration-draft"
      }
    };
  }


  function normalizeTeamCheckinStatus(value) {
    const normalized = cleanKey(value, TEAM_CHECKIN_STATUS.PENDING);

    if (["ready", "ok", "confirmado", "confirmed", "presente", "checkin", "checked-in", "checked_in"].includes(normalized)) return TEAM_CHECKIN_STATUS.READY;
    if (["missing", "ausente", "faltando", "no-show", "noshow", "nao-presente"].includes(normalized)) return TEAM_CHECKIN_STATUS.MISSING;
    if (["late", "atrasado", "expirado", "fora-do-prazo"].includes(normalized)) return TEAM_CHECKIN_STATUS.LATE;
    if (["manual", "manual-review", "manual_review", "revisao", "revisao-manual"].includes(normalized)) return TEAM_CHECKIN_STATUS.MANUAL_REVIEW;

    return TEAM_CHECKIN_STATUS.PENDING;
  }

  function createTeamCheckinEntry(team = {}, options = {}) {
    const source = asObject(team);
    const normalizedTeam = normalizeTeamEntry(source, options.index || 1, source.divisionId || source.division_id || options.divisionId || "division-unica");
    const roster = normalizeTeamRoster({ ...source, roster: source.roster || source.players || source.members });
    const status = normalizeTeamCheckinStatus(source.checkinStatus || source.checkin_status || source.status || options.status);
    const confirmedLineup = source.lineup || source.confirmedLineup || source.confirmed_lineup || source.activeLineup || source.active_lineup;

    return {
      id: cleanText(source.checkinId || source.checkin_id || source.id, `checkin-${normalizedTeam.id}`),
      teamId: normalizedTeam.id,
      teamSlug: normalizedTeam.slug,
      teamName: normalizedTeam.name,
      teamTag: normalizedTeam.tag,
      divisionId: normalizedTeam.divisionId || "division-unica",
      round: clampNumber(source.round || options.round, 1, 99, 1),
      status,
      roster,
      rosterCount: roster.length,
      lineup: confirmedLineup ? normalizeTeamLineup(confirmedLineup, roster, options) : [],
      captainProfileId: cleanText(source.captainProfileId || source.captain_profile_id || source.captainId || source.captain_id),
      checkedAt: cleanText(source.checkedAt || source.checked_at || source.confirmedAt || source.confirmed_at),
      expiresAt: cleanText(source.expiresAt || source.expires_at || options.expiresAt),
      metadata: {
        ...asObject(source.metadata),
        source: "team-battle-team-checkin"
      }
    };
  }

  function validateTeamCheckinEntry(entry = {}, options = {}) {
    const normalizedEntry = createTeamCheckinEntry(entry, options);
    const rosterValidation = validateRoster(normalizedEntry.roster);
    const lineupValidation = normalizedEntry.lineup.length
      ? validateTeamLineup(normalizedEntry.lineup, normalizedEntry.roster, options)
      : { valid: false, errors: ["Escalação ainda não confirmada."], warnings: [] };
    const errors = [];
    const warnings = [];

    if (!normalizedEntry.teamId || !normalizedEntry.teamName) {
      errors.push("Check-in precisa estar vinculado a uma equipe.");
    }

    if (!rosterValidation.valid) {
      errors.push("Equipe precisa ter elenco 4v4 completo antes do check-in.");
    }

    if (normalizedEntry.status !== TEAM_CHECKIN_STATUS.READY) {
      warnings.push("Check-in ainda não confirmado como pronto.");
    }

    if (!lineupValidation.valid) {
      warnings.push("Escalação inicial ainda precisa ser confirmada pelo capitão ou organizador.");
    }

    return {
      valid: errors.length === 0,
      ready: errors.length === 0 && normalizedEntry.status === TEAM_CHECKIN_STATUS.READY && lineupValidation.valid,
      entry: normalizedEntry,
      roster: rosterValidation,
      lineup: lineupValidation,
      errors,
      warnings
    };
  }

  function buildTeamCheckinSummary(entries = [], options = {}) {
    const normalizedEntries = asArray(entries).map((entry, index) => createTeamCheckinEntry(entry, { ...options, index: index + 1 }));
    const validations = normalizedEntries.map((entry, index) => validateTeamCheckinEntry(entry, { ...options, index: index + 1 }));
    const byStatus = normalizedEntries.reduce((acc, entry) => {
      acc[entry.status] = Number(acc[entry.status] || 0) + 1;
      return acc;
    }, {});
    const readyCount = validations.filter((validation) => validation.ready).length;

    return {
      total: normalizedEntries.length,
      ready: readyCount,
      pending: Number(byStatus[TEAM_CHECKIN_STATUS.PENDING] || 0),
      missing: Number(byStatus[TEAM_CHECKIN_STATUS.MISSING] || 0),
      late: Number(byStatus[TEAM_CHECKIN_STATUS.LATE] || 0),
      manualReview: Number(byStatus[TEAM_CHECKIN_STATUS.MANUAL_REVIEW] || 0),
      byStatus,
      entries: normalizedEntries,
      validations,
      allReady: normalizedEntries.length > 0 && readyCount === normalizedEntries.length,
      summaryLabel: `${readyCount}/${normalizedEntries.length} equipe${normalizedEntries.length === 1 ? "" : "s"} com check-in e escalação pronta${normalizedEntries.length === 1 ? "" : "s"}`
    };
  }

  function buildTeamCheckinEntriesFromLeague(league = {}, options = {}) {
    const source = asObject(league);
    const divisions = getLeagueSourceDivisions(source);
    const teams = divisions.length
      ? divisions.flatMap((division) => asArray(division.teams).map((team) => ({ ...team, divisionId: division.id || team.divisionId || "division-unica" })))
      : getLeagueSourceTeams(source);
    const currentCheckins = asArray(source.teamCheckins || source.team_checkins || source.checkins);
    const currentMap = new Map(currentCheckins.map((entry) => [cleanText(entry.teamId || entry.team_id || entry.id), entry]));

    return asArray(teams).map((team, index) => {
      const teamKey = cleanText(team.id || team.teamId || team.slug || team.name);
      const saved = currentMap.get(teamKey) || {};
      return createTeamCheckinEntry({ ...team, ...saved }, { ...options, index: index + 1, divisionId: team.divisionId || "division-unica" });
    });
  }

  function validateTeamMatchCheckinReadiness(teamMatch = {}, checkins = [], options = {}) {
    const match = asObject(teamMatch);
    const entries = asArray(checkins).map((entry, index) => createTeamCheckinEntry(entry, { ...options, index: index + 1 }));
    const findEntry = (teamId) => entries.find((entry) => cleanText(entry.teamId) === cleanText(teamId));
    const home = findEntry(match.homeTeamId);
    const away = findEntry(match.awayTeamId);
    const homeValidation = home ? validateTeamCheckinEntry(home, options) : null;
    const awayValidation = away ? validateTeamCheckinEntry(away, options) : null;
    const errors = [];
    const warnings = [];

    if (!home) errors.push("Equipe mandante ainda não possui check-in preparado.");
    if (!away) errors.push("Equipe visitante ainda não possui check-in preparado.");
    if (homeValidation && !homeValidation.ready) warnings.push("Equipe mandante ainda não está pronta para o confronto.");
    if (awayValidation && !awayValidation.ready) warnings.push("Equipe visitante ainda não está pronta para o confronto.");

    return {
      ready: errors.length === 0 && (!homeValidation || homeValidation.ready) && (!awayValidation || awayValidation.ready),
      home,
      away,
      homeValidation,
      awayValidation,
      errors,
      warnings
    };
  }

  function attachReadyCheckinsToTeamMatch(teamMatch = {}, checkins = [], options = {}) {
    const readiness = validateTeamMatchCheckinReadiness(teamMatch, checkins, options);
    const match = asObject(teamMatch);

    if (!readiness.ready) {
      return {
        ...match,
        checkinReadiness: readiness,
        status: match.status || TEAM_MATCH_STATUS.DRAFT
      };
    }

    return applyLineupsToTeamMatch(match, readiness.home.lineup, readiness.away.lineup, {
      ...options,
      status: TEAM_MATCH_STATUS.READY
    });
  }

  function buildLeagueCheckinReadinessReport(league = {}, options = {}) {
    const source = asObject(league);
    const checkins = buildTeamCheckinEntriesFromLeague(source, options);
    const summary = buildTeamCheckinSummary(checkins, options);
    const matches = flattenDivisionMatches(source);
    const matchReadiness = matches.map((teamMatch) => validateTeamMatchCheckinReadiness(teamMatch, checkins, options));
    const readyMatches = matchReadiness.filter((item) => item.ready).length;

    return {
      ready: summary.allReady && (matchReadiness.length === 0 || readyMatches === matchReadiness.length),
      checkins,
      summary,
      matchReadiness,
      readyMatches,
      totalMatches: matchReadiness.length,
      summaryLabel: `${summary.summaryLabel} · ${readyMatches}/${matchReadiness.length} confronto${matchReadiness.length === 1 ? "" : "s"} pronto${matchReadiness.length === 1 ? "" : "s"}`
    };
  }


  function normalizeLeagueOperationStatus(value) {
    const normalized = cleanKey(value, LEAGUE_OPERATION_STATUS.DRAFT);

    if (["finished", "finalizado", "concluido", "complete", "completed"].includes(normalized)) return LEAGUE_OPERATION_STATUS.FINISHED;
    if (["extra", "extra-required", "extra_required", "desempate"].includes(normalized)) return LEAGUE_OPERATION_STATUS.EXTRA_REQUIRED;
    if (["live", "ao-vivo", "em-andamento", "running", "started"].includes(normalized)) return LEAGUE_OPERATION_STATUS.LIVE;
    if (["ready", "pronto", "prepared", "scheduled"].includes(normalized)) return LEAGUE_OPERATION_STATUS.READY;
    if (["pending", "pendente", "waiting", "aguardando"].includes(normalized)) return LEAGUE_OPERATION_STATUS.PENDING;
    if (["blocked", "bloqueado", "invalid", "erro"].includes(normalized)) return LEAGUE_OPERATION_STATUS.BLOCKED;

    return LEAGUE_OPERATION_STATUS.DRAFT;
  }

  function getTeamMatchLifecycleStatus(teamMatch = {}, options = {}) {
    const source = asObject(teamMatch);
    const status = normalizeLeagueOperationStatus(source.status);
    const progress = getTeamMatchProgress(source, options.config || options);

    if (status === LEAGUE_OPERATION_STATUS.FINISHED || progress.finished) return LEAGUE_OPERATION_STATUS.FINISHED;
    if (status === LEAGUE_OPERATION_STATUS.EXTRA_REQUIRED || progress.extraRequired) return LEAGUE_OPERATION_STATUS.EXTRA_REQUIRED;
    if (status === LEAGUE_OPERATION_STATUS.LIVE || Number(progress.mainPlayed || 0) > 0 || progress.extraPlayed) return LEAGUE_OPERATION_STATUS.LIVE;
    if (status === LEAGUE_OPERATION_STATUS.READY || source.checkinReadiness?.ready === true) return LEAGUE_OPERATION_STATUS.READY;
    if (status === LEAGUE_OPERATION_STATUS.BLOCKED) return LEAGUE_OPERATION_STATUS.BLOCKED;

    return LEAGUE_OPERATION_STATUS.DRAFT;
  }

  function buildTeamBattleRoundLifecycle(round = {}, options = {}) {
    const source = asObject(round);
    const matches = asArray(source.matches).map((match) => {
      const status = getTeamMatchLifecycleStatus(match, options);
      return {
        id: cleanText(match?.id),
        homeTeamId: cleanText(match?.homeTeamId),
        awayTeamId: cleanText(match?.awayTeamId),
        status
      };
    });
    const total = matches.length;
    const finished = matches.filter((match) => match.status === LEAGUE_OPERATION_STATUS.FINISHED).length;
    const live = matches.filter((match) => [LEAGUE_OPERATION_STATUS.LIVE, LEAGUE_OPERATION_STATUS.EXTRA_REQUIRED].includes(match.status)).length;
    const ready = matches.filter((match) => match.status === LEAGUE_OPERATION_STATUS.READY).length;
    const blocked = matches.filter((match) => match.status === LEAGUE_OPERATION_STATUS.BLOCKED).length;
    let status = LEAGUE_OPERATION_STATUS.DRAFT;

    if (blocked > 0) status = LEAGUE_OPERATION_STATUS.BLOCKED;
    else if (total > 0 && finished >= total) status = LEAGUE_OPERATION_STATUS.FINISHED;
    else if (live > 0) status = LEAGUE_OPERATION_STATUS.LIVE;
    else if (total > 0 && ready >= total) status = LEAGUE_OPERATION_STATUS.READY;
    else if (total > 0 && ready > 0) status = LEAGUE_OPERATION_STATUS.PENDING;

    return {
      id: cleanText(source.id, `round-${source.round || 1}`),
      round: clampNumber(source.round, 1, 99, 1),
      label: cleanText(source.label, `Rodada ${source.round || 1}`),
      divisionId: cleanText(source.divisionId || options.divisionId),
      status,
      totalMatches: total,
      readyMatches: ready,
      liveMatches: live,
      finishedMatches: finished,
      blockedMatches: blocked,
      matches,
      summaryLabel: total
        ? `${finished}/${total} confronto${total === 1 ? "" : "s"} finalizado${total === 1 ? "" : "s"}`
        : "Rodada ainda sem confrontos"
    };
  }

  function buildTeamBattleDivisionLifecycle(division = {}, options = {}) {
    const source = asObject(division);
    const rounds = asArray(source.rounds).map((round) => buildTeamBattleRoundLifecycle(round, {
      ...options,
      divisionId: source.id || source.divisionId
    }));
    const totalMatches = rounds.reduce((total, round) => total + Number(round.totalMatches || 0), 0);
    const finishedMatches = rounds.reduce((total, round) => total + Number(round.finishedMatches || 0), 0);
    const liveMatches = rounds.reduce((total, round) => total + Number(round.liveMatches || 0), 0);
    const readyMatches = rounds.reduce((total, round) => total + Number(round.readyMatches || 0), 0);
    const blockedMatches = rounds.reduce((total, round) => total + Number(round.blockedMatches || 0), 0);
    let status = LEAGUE_OPERATION_STATUS.DRAFT;

    if (blockedMatches > 0) status = LEAGUE_OPERATION_STATUS.BLOCKED;
    else if (totalMatches > 0 && finishedMatches >= totalMatches) status = LEAGUE_OPERATION_STATUS.FINISHED;
    else if (liveMatches > 0) status = LEAGUE_OPERATION_STATUS.LIVE;
    else if (totalMatches > 0 && readyMatches >= totalMatches) status = LEAGUE_OPERATION_STATUS.READY;
    else if (totalMatches > 0) status = LEAGUE_OPERATION_STATUS.PENDING;

    return {
      id: cleanText(source.id || source.divisionId, "division-1"),
      name: cleanText(source.name || source.label, "Divisão"),
      status,
      teamCount: asArray(source.teams).length,
      roundCount: rounds.length,
      totalMatches,
      readyMatches,
      liveMatches,
      finishedMatches,
      blockedMatches,
      rounds,
      summaryLabel: `${cleanText(source.name || source.label, "Divisão")} · ${finishedMatches}/${totalMatches} confronto${totalMatches === 1 ? "" : "s"} finalizado${totalMatches === 1 ? "" : "s"}`
    };
  }

  function buildTeamBattleLeagueLifecycleReport(league = {}, options = {}) {
    const source = asObject(league);
    const config = normalizeConfig(options.config || source.config || source.settings || source);
    const structureReport = buildTeamBattleLeagueReadinessReport(source, { ...options, config });
    const checkinReport = buildLeagueCheckinReadinessReport(source, { ...options, config });
    const divisions = getLeagueSourceDivisions(source, { ...options, config }).map((division) => buildTeamBattleDivisionLifecycle(division, { ...options, config }));
    const totalMatches = divisions.reduce((total, division) => total + Number(division.totalMatches || 0), 0);
    const finishedMatches = divisions.reduce((total, division) => total + Number(division.finishedMatches || 0), 0);
    const liveMatches = divisions.reduce((total, division) => total + Number(division.liveMatches || 0), 0);
    const readyMatches = divisions.reduce((total, division) => total + Number(division.readyMatches || 0), 0);
    const approvedRegistrations = getApprovedTeamRegistrationEntries(source.teamRegistrations || source.team_registrations || source.registrations, options).length;
    let status = LEAGUE_OPERATION_STATUS.DRAFT;
    let currentStep = "Configuração";

    if (!structureReport.valid) {
      status = LEAGUE_OPERATION_STATUS.BLOCKED;
      currentStep = "Corrigir estrutura";
    } else if (totalMatches > 0 && finishedMatches >= totalMatches) {
      status = LEAGUE_OPERATION_STATUS.FINISHED;
      currentStep = "Liga finalizada";
    } else if (liveMatches > 0) {
      status = LEAGUE_OPERATION_STATUS.LIVE;
      currentStep = "Confrontos em andamento";
    } else if (checkinReport.ready && totalMatches > 0 && readyMatches >= totalMatches) {
      status = LEAGUE_OPERATION_STATUS.READY;
      currentStep = "Pronta para iniciar";
    } else if (approvedRegistrations >= config.minTeams || Number(structureReport.totalTeams || 0) >= config.minTeams) {
      status = LEAGUE_OPERATION_STATUS.PENDING;
      currentStep = checkinReport.summary?.total ? "Check-in das equipes" : "Gerar calendário e check-in";
    }

    return {
      formatKey: FORMAT_KEY,
      schemaVersion: `${SCHEMA_VERSION}.lifecycle.v1`,
      status,
      currentStep,
      leagueMode: config.leagueMode,
      leagueModeLabel: getLeagueModeLabel(config.leagueMode),
      structure: structureReport,
      checkin: checkinReport,
      divisions,
      totals: {
        approvedRegistrations,
        divisions: divisions.length,
        teams: Number(structureReport.totalTeams || 0),
        matches: totalMatches,
        readyMatches,
        liveMatches,
        finishedMatches
      },
      summaryLabel: `${getLeagueModeLabel(config.leagueMode)} · ${currentStep} · ${finishedMatches}/${totalMatches} confronto${totalMatches === 1 ? "" : "s"} finalizado${totalMatches === 1 ? "" : "s"}`,
      generatedAt: new Date().toISOString()
    };
  }

  function createTeamBattleTimelineStep(key, label, status, details = {}) {
    return {
      key,
      label,
      status: normalizeLeagueOperationStatus(status),
      description: cleanText(details.description),
      actionLabel: cleanText(details.actionLabel),
      countLabel: cleanText(details.countLabel),
      metadata: asObject(details.metadata)
    };
  }

  function buildTeamBattleLeagueTimeline(league = {}, options = {}) {
    const report = buildTeamBattleLeagueLifecycleReport(league, options);
    const structureReady = report.structure?.ready === true;
    const totalTeams = Number(report.structure?.totalTeams || 0);
    const readyTeams = Number(report.structure?.readyTeams || 0);
    const totalCheckins = Number(report.checkin?.summary?.total || 0);
    const readyCheckins = Number(report.checkin?.summary?.ready || 0);
    const totalMatches = Number(report.totals?.matches || 0);
    const readyMatches = Number(report.totals?.readyMatches || 0);
    const liveMatches = Number(report.totals?.liveMatches || 0);
    const finishedMatches = Number(report.totals?.finishedMatches || 0);

    return {
      ...report,
      steps: [
        createTeamBattleTimelineStep("setup", "Estrutura", structureReady ? LEAGUE_OPERATION_STATUS.FINISHED : report.status === LEAGUE_OPERATION_STATUS.BLOCKED ? LEAGUE_OPERATION_STATUS.BLOCKED : LEAGUE_OPERATION_STATUS.PENDING, {
          description: "Modo, divisão única ou divisões avançadas, equipes e calendário base.",
          countLabel: `${readyTeams}/${totalTeams} equipe${totalTeams === 1 ? "" : "s"} pronta${totalTeams === 1 ? "" : "s"}`,
          actionLabel: structureReady ? "Estrutura pronta" : "Completar estrutura"
        }),
        createTeamBattleTimelineStep("registrations", "Inscrições", Number(report.totals?.approvedRegistrations || 0) >= 2 ? LEAGUE_OPERATION_STATUS.FINISHED : LEAGUE_OPERATION_STATUS.PENDING, {
          description: "Equipes aprovadas com elenco 4v4 válido.",
          countLabel: `${report.totals?.approvedRegistrations || 0} equipe${Number(report.totals?.approvedRegistrations || 0) === 1 ? "" : "s"} aprovada${Number(report.totals?.approvedRegistrations || 0) === 1 ? "" : "s"}`,
          actionLabel: Number(report.totals?.approvedRegistrations || 0) >= 2 ? "Inscrições suficientes" : "Aprovar equipes"
        }),
        createTeamBattleTimelineStep("checkin", "Check-in", totalCheckins && readyCheckins >= totalCheckins ? LEAGUE_OPERATION_STATUS.FINISHED : totalCheckins ? LEAGUE_OPERATION_STATUS.PENDING : LEAGUE_OPERATION_STATUS.DRAFT, {
          description: "Confirmação das equipes e escalações antes dos confrontos.",
          countLabel: `${readyCheckins}/${totalCheckins} check-in${totalCheckins === 1 ? "" : "s"} pronto${totalCheckins === 1 ? "" : "s"}`,
          actionLabel: totalCheckins && readyCheckins >= totalCheckins ? "Check-in pronto" : "Conferir check-ins"
        }),
        createTeamBattleTimelineStep("rounds", "Rodadas", finishedMatches && finishedMatches >= totalMatches ? LEAGUE_OPERATION_STATUS.FINISHED : liveMatches ? LEAGUE_OPERATION_STATUS.LIVE : readyMatches ? LEAGUE_OPERATION_STATUS.READY : totalMatches ? LEAGUE_OPERATION_STATUS.PENDING : LEAGUE_OPERATION_STATUS.DRAFT, {
          description: "Confrontos por equipe com 3 partidas principais e extra em caso de empate.",
          countLabel: `${finishedMatches}/${totalMatches} confronto${totalMatches === 1 ? "" : "s"} finalizado${totalMatches === 1 ? "" : "s"}`,
          actionLabel: liveMatches ? "Rodada em andamento" : readyMatches ? "Pronta para iniciar" : "Aguardar confrontos"
        }),
        createTeamBattleTimelineStep("playoffs", "Playoffs", finishedMatches && finishedMatches >= totalMatches && totalMatches > 0 ? LEAGUE_OPERATION_STATUS.READY : LEAGUE_OPERATION_STATUS.DRAFT, {
          description: "Fase final reservada para o encerramento da liga.",
          countLabel: report.leagueMode === LEAGUE_MODE_TYPES.BASIC_SINGLE_DIVISION ? "Divisão única" : "Múltiplas divisões",
          actionLabel: finishedMatches && finishedMatches >= totalMatches && totalMatches > 0 ? "Preparar playoffs" : "Aguardar fase classificatória"
        })
      ]
    };
  }

  function getTeamBattleLeagueNextOperationalAction(league = {}, options = {}) {
    const timeline = buildTeamBattleLeagueTimeline(league, options);
    const next = asArray(timeline.steps).find((step) => ![LEAGUE_OPERATION_STATUS.FINISHED, LEAGUE_OPERATION_STATUS.READY].includes(step.status));

    if (!next && timeline.status === LEAGUE_OPERATION_STATUS.FINISHED) {
      return {
        key: "finished",
        label: "Liga finalizada",
        message: "Todos os confrontos foram finalizados. O próximo passo é revisar ranking, histórico e publicação final.",
        status: LEAGUE_OPERATION_STATUS.FINISHED
      };
    }

    return {
      key: next?.key || "ready",
      label: next?.actionLabel || "Pronta para operação",
      message: next?.description || "A estrutura está pronta para os próximos controles visuais do formato.",
      status: next?.status || timeline.status
    };
  }


  function getTeamBattleLeagueStepStateLabel(status) {
    const normalized = normalizeLeagueOperationStatus(status);
    const labels = {
      [LEAGUE_OPERATION_STATUS.DRAFT]: "Rascunho",
      [LEAGUE_OPERATION_STATUS.PENDING]: "Pendente",
      [LEAGUE_OPERATION_STATUS.READY]: "Pronto",
      [LEAGUE_OPERATION_STATUS.LIVE]: "Em andamento",
      [LEAGUE_OPERATION_STATUS.EXTRA_REQUIRED]: "Partida extra necessária",
      [LEAGUE_OPERATION_STATUS.FINISHED]: "Finalizado",
      [LEAGUE_OPERATION_STATUS.BLOCKED]: "Bloqueado"
    };

    return labels[normalized] || "Rascunho";
  }

  function buildTeamBattleLeagueAdminChecklist(league = {}, options = {}) {
    const lifecycle = buildTeamBattleLeagueLifecycleReport(league, options);
    const timeline = buildTeamBattleLeagueTimeline(league, options);
    const action = getTeamBattleLeagueNextOperationalAction(league, options);
    const structure = asObject(lifecycle.structure);
    const checkin = asObject(lifecycle.checkin);
    const totalMatches = Number(lifecycle.totals?.matches || 0);
    const finishedMatches = Number(lifecycle.totals?.finishedMatches || 0);
    const liveMatches = Number(lifecycle.totals?.liveMatches || 0);
    const readyMatches = Number(lifecycle.totals?.readyMatches || 0);
    const approvedRegistrations = Number(lifecycle.totals?.approvedRegistrations || 0);
    const checkinTotal = Number(checkin.summary?.total || 0);
    const checkinReady = Number(checkin.summary?.ready || 0);

    const checklist = [
      {
        key: "format",
        label: "Formato e modo",
        state: structure.leagueMode ? LEAGUE_OPERATION_STATUS.FINISHED : LEAGUE_OPERATION_STATUS.PENDING,
        stateLabel: structure.leagueMode ? "Definido" : "Pendente",
        description: `${structure.leagueModeLabel || getLeagueModeLabel(DEFAULT_CONFIG.leagueMode)} · ${structure.leagueModeDescription || getLeagueModeDescription(DEFAULT_CONFIG.leagueMode)}`,
        countLabel: structure.leagueMode === LEAGUE_MODE_TYPES.ADVANCED_MULTI_DIVISION ? "Modo avançado" : "Divisão única"
      },
      {
        key: "teams",
        label: "Equipes e elencos",
        state: Number(structure.readyTeams || 0) >= Number(structure.totalTeams || 0) && Number(structure.totalTeams || 0) >= DEFAULT_CONFIG.minTeams ? LEAGUE_OPERATION_STATUS.FINISHED : LEAGUE_OPERATION_STATUS.PENDING,
        stateLabel: `${Number(structure.readyTeams || 0)}/${Number(structure.totalTeams || 0)} pronta${Number(structure.readyTeams || 0) === 1 ? "" : "s"}`,
        description: "Cada equipe precisa de elenco 4v4 válido para entrar na liga.",
        countLabel: `${Number(structure.totalTeams || 0)} equipe${Number(structure.totalTeams || 0) === 1 ? "" : "s"}`
      },
      {
        key: "registrations",
        label: "Inscrições aprovadas",
        state: approvedRegistrations >= DEFAULT_CONFIG.minTeams ? LEAGUE_OPERATION_STATUS.FINISHED : LEAGUE_OPERATION_STATUS.PENDING,
        stateLabel: approvedRegistrations >= DEFAULT_CONFIG.minTeams ? "Suficiente" : "Pendente",
        description: "A liga básica pode ser montada a partir das equipes aprovadas.",
        countLabel: `${approvedRegistrations} aprovada${approvedRegistrations === 1 ? "" : "s"}`
      },
      {
        key: "schedule",
        label: "Calendário e confrontos",
        state: totalMatches > 0 ? LEAGUE_OPERATION_STATUS.FINISHED : LEAGUE_OPERATION_STATUS.PENDING,
        stateLabel: totalMatches > 0 ? "Gerado" : "A gerar",
        description: "Confrontos por equipe dentro da divisão única ou das divisões avançadas.",
        countLabel: `${totalMatches} confronto${totalMatches === 1 ? "" : "s"}`
      },
      {
        key: "checkin",
        label: "Check-in e escalações",
        state: checkinTotal && checkinReady >= checkinTotal ? LEAGUE_OPERATION_STATUS.FINISHED : checkinTotal ? LEAGUE_OPERATION_STATUS.PENDING : LEAGUE_OPERATION_STATUS.DRAFT,
        stateLabel: `${checkinReady}/${checkinTotal} pronto${checkinTotal === 1 ? "" : "s"}`,
        description: "Confirmação dos titulares e reserva antes dos confrontos.",
        countLabel: `${checkinTotal} check-in${checkinTotal === 1 ? "" : "s"}`
      },
      {
        key: "operation",
        label: "Operação dos confrontos",
        state: finishedMatches && finishedMatches >= totalMatches ? LEAGUE_OPERATION_STATUS.FINISHED : liveMatches ? LEAGUE_OPERATION_STATUS.LIVE : readyMatches ? LEAGUE_OPERATION_STATUS.READY : totalMatches ? LEAGUE_OPERATION_STATUS.PENDING : LEAGUE_OPERATION_STATUS.DRAFT,
        stateLabel: `${finishedMatches}/${totalMatches} finalizado${totalMatches === 1 ? "" : "s"}`,
        description: "Registro dos resultados das 3 partidas principais e extra quando houver empate.",
        countLabel: `${readyMatches} pronto${readyMatches === 1 ? "" : "s"} · ${liveMatches} ao vivo`
      },
      {
        key: "next_action",
        label: "Próxima ação",
        state: action.status,
        stateLabel: action.label,
        description: action.message,
        countLabel: getTeamBattleLeagueStepStateLabel(action.status)
      }
    ];

    return checklist.map((item) => ({
      ...item,
      state: normalizeLeagueOperationStatus(item.state),
      stateLabel: cleanText(item.stateLabel, getTeamBattleLeagueStepStateLabel(item.state)),
      description: cleanText(item.description),
      countLabel: cleanText(item.countLabel)
    }));
  }

  function buildTeamBattleLeagueOperationalSnapshot(league = {}, options = {}) {
    const source = asObject(league);
    const lifecycle = buildTeamBattleLeagueLifecycleReport(source, options);
    const timeline = buildTeamBattleLeagueTimeline(source, options);
    const readiness = buildTeamBattleLeagueReadinessReport(source, options);
    const publicOverview = buildTeamBattlePublicOverview(source, options);
    const nextAction = getTeamBattleLeagueNextOperationalAction(source, options);
    const adminChecklist = buildTeamBattleLeagueAdminChecklist(source, options);
    const registrations = buildTeamRegistrationSummary(source.teamRegistrations || source.team_registrations || source.registrations, options);
    const checkin = buildLeagueCheckinReadinessReport(source, options);
    const errors = [
      ...asArray(readiness.errors),
      ...asArray(lifecycle.structure?.errors)
    ].filter(Boolean);
    const warnings = [
      ...asArray(readiness.warnings),
      ...asArray(lifecycle.structure?.warnings)
    ].filter(Boolean);

    return {
      formatKey: FORMAT_KEY,
      schemaVersion: `${SCHEMA_VERSION}.snapshot.v1`,
      generatedAt: new Date().toISOString(),
      title: cleanText(source.title || source.name, "Team Battle League 4v4"),
      status: lifecycle.status,
      statusLabel: getTeamBattleLeagueStepStateLabel(lifecycle.status),
      currentStep: lifecycle.currentStep,
      leagueMode: lifecycle.leagueMode,
      leagueModeLabel: lifecycle.leagueModeLabel,
      summaryLabel: lifecycle.summaryLabel,
      readyForInternalTest: readiness.ready === true && errors.length === 0,
      nextAction,
      totals: {
        divisions: Number(lifecycle.totals?.divisions || 0),
        teams: Number(lifecycle.totals?.teams || 0),
        matches: Number(lifecycle.totals?.matches || 0),
        readyMatches: Number(lifecycle.totals?.readyMatches || 0),
        liveMatches: Number(lifecycle.totals?.liveMatches || 0),
        finishedMatches: Number(lifecycle.totals?.finishedMatches || 0),
        approvedRegistrations: Number(lifecycle.totals?.approvedRegistrations || 0),
        checkins: Number(checkin.summary?.total || 0),
        readyCheckins: Number(checkin.summary?.ready || 0)
      },
      adminChecklist,
      timelineSteps: asArray(timeline.steps),
      readiness,
      lifecycle,
      registrations,
      checkin,
      publicOverview,
      errors,
      warnings
    };
  }


  function getTeamBattleLeagueDataFromTournament(tournament = {}) {
    const source = asObject(tournament);
    const metadata = asObject(source.metadata);
    const settings = asObject(source.settings);
    const formatData = asObject(source.teamBattleLeague || source.team_battle_league || metadata.teamBattleLeague || metadata.team_battle_league || settings.teamBattleLeague || settings.team_battle_league);
    const formatConfig = asObject(formatData.config || metadata.teamBattleConfig || metadata.team_battle_config || settings.teamBattleConfig || settings.team_battle_config);
    const mode = normalizeLeagueMode(
      formatData.leagueMode ||
      formatData.league_mode ||
      formatConfig.leagueMode ||
      formatConfig.league_mode ||
      metadata.teamBattleLeagueMode ||
      metadata.team_battle_league_mode ||
      settings.teamBattleLeagueMode ||
      settings.team_battle_league_mode ||
      source.leagueMode ||
      source.league_mode
    );

    return {
      ...formatData,
      formatKey: FORMAT_KEY,
      schemaVersion: cleanText(formatData.schemaVersion || formatData.schema_version, SCHEMA_VERSION),
      title: cleanText(formatData.title || source.title || source.name, "Team Battle League 4v4"),
      leagueMode: mode,
      leagueModeLabel: getLeagueModeLabel(mode),
      config: normalizeConfig({
        ...formatConfig,
        ...asObject(formatData.config),
        leagueMode: mode,
        maxDivisions: mode === LEAGUE_MODE_TYPES.BASIC_SINGLE_DIVISION ? 1 : formatConfig.maxDivisions || formatConfig.max_divisions || DEFAULT_CONFIG.maxDivisions
      }),
      teams: asArray(formatData.teams || source.teams || source.teamEntries || source.team_entries),
      divisions: asArray(formatData.divisions || source.divisions),
      teamRegistrations: asArray(formatData.teamRegistrations || formatData.team_registrations || source.teamRegistrations || source.team_registrations),
      checkins: asArray(formatData.checkins || formatData.teamCheckins || formatData.team_checkins || source.checkins)
    };
  }

  function normalizeTeamBattleLeagueTournamentPayload(tournament = {}, options = {}) {
    const data = getTeamBattleLeagueDataFromTournament(tournament);
    const mode = normalizeLeagueMode(options.leagueMode || options.league_mode || data.leagueMode);
    const payload = {
      ...data,
      ...asObject(options.overrides),
      leagueMode: mode,
      config: normalizeConfig({
        ...asObject(data.config),
        ...asObject(options.config),
        leagueMode: mode,
        maxDivisions: mode === LEAGUE_MODE_TYPES.BASIC_SINGLE_DIVISION ? 1 : asObject(options.config).maxDivisions || asObject(data.config).maxDivisions
      })
    };

    const league = createTeamBattleLeagueByMode(mode, payload, {
      ...options,
      config: payload.config
    });

    return {
      ...league,
      sourceTournamentId: cleanText(asObject(tournament).id || asObject(tournament).supabaseId || asObject(tournament).supabase_id),
      sourceTournamentSlug: cleanText(asObject(tournament).slug),
      teamRegistrations: asArray(data.teamRegistrations),
      checkins: asArray(data.checkins),
      metadata: {
        ...asObject(league.metadata),
        ...asObject(data.metadata),
        source: "tournament-metadata-adapter",
        adaptedAt: new Date().toISOString()
      }
    };
  }

  function buildTeamBattleLeagueTournamentMetadata(league = {}, options = {}) {
    const source = asObject(league);
    const mode = normalizeLeagueMode(source.leagueMode || source.league_mode || options.leagueMode);
    const snapshot = buildTeamBattleLeagueOperationalSnapshot(source, options);

    return {
      formatKey: FORMAT_KEY,
      schemaVersion: `${SCHEMA_VERSION}.tournament-metadata.v1`,
      leagueMode: mode,
      leagueModeLabel: getLeagueModeLabel(mode),
      title: cleanText(source.title || source.name, mode === LEAGUE_MODE_TYPES.ADVANCED_MULTI_DIVISION ? "Team Battle League 4v4 avançada" : "Team Battle League 4v4 básica"),
      status: DEFAULT_CONFIG.status,
      config: normalizeConfig({
        ...asObject(source.config),
        leagueMode: mode,
        maxDivisions: mode === LEAGUE_MODE_TYPES.BASIC_SINGLE_DIVISION ? 1 : asObject(source.config).maxDivisions
      }),
      teams: asArray(source.teams),
      divisions: asArray(source.divisions),
      teamRegistrations: asArray(source.teamRegistrations || source.team_registrations),
      checkins: asArray(source.checkins || source.teamCheckins || source.team_checkins),
      operationalSnapshot: snapshot,
      updatedAt: new Date().toISOString()
    };
  }

  function attachTeamBattleLeagueToTournamentDraft(tournament = {}, league = {}, options = {}) {
    const source = asObject(tournament);
    const currentMetadata = asObject(source.metadata);
    const currentSettings = asObject(source.settings);
    const metadataPayload = buildTeamBattleLeagueTournamentMetadata(league, options);

    return {
      ...source,
      format: FORMAT_KEY,
      tournamentFormat: FORMAT_KEY,
      tournament_format: FORMAT_KEY,
      settings: {
        ...currentSettings,
        teamBattleLeague: metadataPayload,
        team_battle_league: metadataPayload,
        formatKey: FORMAT_KEY,
        format_key: FORMAT_KEY,
        formatFamily: "team_battle",
        format_family: "team_battle"
      },
      metadata: {
        ...currentMetadata,
        teamBattleLeague: metadataPayload,
        team_battle_league: metadataPayload,
        format: {
          ...asObject(currentMetadata.format),
          key: FORMAT_KEY,
          label: "Team Battle League 4v4",
          family: "team_battle",
          category: "advanced",
          status: DEFAULT_CONFIG.status,
          leagueMode: metadataPayload.leagueMode,
          leagueModeLabel: metadataPayload.leagueModeLabel
        }
      }
    };
  }

  function buildTeamBattleLeagueTournamentAdminPreview(tournament = {}, options = {}) {
    const league = normalizeTeamBattleLeagueTournamentPayload(tournament, options);
    const snapshot = buildTeamBattleLeagueOperationalSnapshot(league, options);
    const mode = normalizeLeagueMode(league.leagueMode);

    return {
      formatKey: FORMAT_KEY,
      title: cleanText(league.title, "Team Battle League 4v4"),
      leagueMode: mode,
      leagueModeLabel: getLeagueModeLabel(mode),
      status: DEFAULT_CONFIG.status,
      statusLabel: "Em preparação",
      canCreateRealTournament: false,
      isBasicMode: mode === LEAGUE_MODE_TYPES.BASIC_SINGLE_DIVISION,
      isAdvancedMode: mode === LEAGUE_MODE_TYPES.ADVANCED_MULTI_DIVISION,
      summaryLabel: snapshot.summaryLabel,
      nextAction: snapshot.nextAction,
      totals: snapshot.totals,
      checklist: snapshot.adminChecklist,
      timelineSteps: snapshot.timelineSteps,
      warnings: snapshot.warnings,
      errors: snapshot.errors
    };
  }


  function getTeamBattleLeagueAvailabilityBadge(league = {}, options = {}) {
    const payload = normalizeTeamBattleLeagueTournamentPayload(league, options);
    const mode = normalizeLeagueMode(payload.leagueMode);

    return {
      status: DEFAULT_CONFIG.status,
      label: "Em preparação",
      tone: "warning",
      formatKey: FORMAT_KEY,
      leagueMode: mode,
      leagueModeLabel: getLeagueModeLabel(mode),
      canCreateRealTournament: false,
      message: "Formato em preparação técnica. A primeira versão funcional deve priorizar a liga básica com divisão única antes do modo avançado com várias divisões."
    };
  }

  function buildTeamBattleLeagueModeComparison() {
    return [
      {
        key: LEAGUE_MODE_TYPES.BASIC_SINGLE_DIVISION,
        title: "Team Battle League 4v4 básica",
        shortLabel: "Básica",
        divisionModel: "Divisão única",
        recommendedFirstRelease: true,
        status: "prioridade inicial",
        description: "Modelo mais simples para a primeira versão funcional: todas as equipes ficam em uma única divisão e jogam em calendário de liga.",
        highlights: [
          "Uma divisão única",
          "Calendário mais fácil de gerar e revisar",
          "Menor risco operacional para os primeiros testes",
          "Ideal para validar inscrições, escalações, check-in e resultados 4v4"
        ]
      },
      {
        key: LEAGUE_MODE_TYPES.ADVANCED_MULTI_DIVISION,
        title: "Team Battle League 4v4 avançada",
        shortLabel: "Avançada",
        divisionModel: "Várias divisões",
        recommendedFirstRelease: false,
        status: "fase posterior",
        description: "Modelo expandido para ligas maiores, com várias divisões, classificações separadas e playoffs entre campeões ou classificados.",
        highlights: [
          "Várias divisões",
          "Classificação por divisão",
          "Playoffs entre classificados",
          "Mais controle para temporadas longas e grandes comunidades"
        ]
      }
    ];
  }

  function buildTeamBattleLeagueRulebookSummary(config = {}) {
    const normalizedConfig = normalizeConfig(config);

    return {
      title: "Resumo do formato Team Battle League 4v4",
      teamSize: normalizedConfig.teamSize,
      startersPerTeamMatch: normalizedConfig.startersPerTeamMatch,
      reservePerTeamMatch: normalizedConfig.reservePerTeamMatch,
      mainMatches: normalizedConfig.mainMatches,
      extraMatchOnDraw: normalizedConfig.extraMatchOnDraw,
      scoreModel: [
        { slot: 1, label: "Partida 1", points: normalizedConfig.mainMatchPointsBySlot[0] || 10 },
        { slot: 2, label: "Partida 2", points: normalizedConfig.mainMatchPointsBySlot[1] || 10 },
        { slot: 3, label: "Partida 3", points: normalizedConfig.mainMatchPointsBySlot[2] || 20 },
        { slot: 4, label: "Partida extra", points: normalizedConfig.defaultExtraMatchPoints, conditional: true }
      ],
      rules: [
        "Cada equipe possui elenco de 4 jogadores.",
        "Cada confronto entre equipes usa 3 partidas principais.",
        "A equipe escala 3 titulares e mantém 1 reserva.",
        "A terceira partida principal vale mais pontos para aumentar o peso estratégico do confronto.",
        "Se houver empate após as partidas principais, a partida extra decide o confronto.",
        "O modo básico usa divisão única; o modo avançado usa várias divisões."
      ]
    };
  }

  function buildTeamBattleLeagueAdminSectionModel(tournament = {}, options = {}) {
    const league = normalizeTeamBattleLeagueTournamentPayload(tournament, options);
    const preview = buildTeamBattleLeagueTournamentAdminPreview(tournament, options);
    const snapshot = buildTeamBattleLeagueOperationalSnapshot(league, options);
    const readiness = buildTeamBattleLeagueReadinessReport(league, options);
    const badge = getTeamBattleLeagueAvailabilityBadge(league, options);
    const rulebook = buildTeamBattleLeagueRulebookSummary(league.config);

    return {
      formatKey: FORMAT_KEY,
      schemaVersion: `${SCHEMA_VERSION}.admin-section.v1`,
      title: "Team Battle League 4v4",
      subtitle: "Formato por equipes em preparação para a plataforma -SBW-.",
      badge,
      preview,
      modeComparison: buildTeamBattleLeagueModeComparison(),
      rulebook,
      cards: [
        {
          key: "mode",
          label: "Modo recomendado",
          value: preview.leagueModeLabel,
          description: getLeagueModeDescription(preview.leagueMode)
        },
        {
          key: "teams",
          label: "Equipes",
          value: String(snapshot.totals.teams || 0),
          description: `${snapshot.totals.readyTeams || 0} equipe${Number(snapshot.totals.readyTeams || 0) === 1 ? "" : "s"} com elenco 4v4 pronto.`
        },
        {
          key: "matches",
          label: "Confrontos",
          value: String(snapshot.totals.matches || 0),
          description: "Confrontos entre equipes previstos na estrutura da liga."
        },
        {
          key: "status",
          label: "Prontidão",
          value: readiness.statusLabel,
          description: snapshot.nextAction.label
        }
      ],
      sections: [
        {
          key: "structure",
          title: "Estrutura",
          status: snapshot.adminChecklist.structure.status,
          items: [
            `${snapshot.totals.divisions || 0} divisão${Number(snapshot.totals.divisions || 0) === 1 ? "" : "ões"}`,
            `${snapshot.totals.teams || 0} equipe${Number(snapshot.totals.teams || 0) === 1 ? "" : "s"}`,
            preview.isBasicMode ? "Modelo básico com divisão única" : "Modelo avançado com várias divisões"
          ]
        },
        {
          key: "registrations",
          title: "Inscrições de equipes",
          status: snapshot.adminChecklist.registrations.status,
          items: [
            `${snapshot.totals.approvedRegistrations || 0} inscrição${Number(snapshot.totals.approvedRegistrations || 0) === 1 ? "" : "ões"} aprovada${Number(snapshot.totals.approvedRegistrations || 0) === 1 ? "" : "s"}`,
            "Cada equipe precisa de elenco com 4 jogadores"
          ]
        },
        {
          key: "checkin",
          title: "Check-in e escalações",
          status: snapshot.adminChecklist.checkins.status,
          items: [
            `${snapshot.totals.readyCheckins || 0} check-in${Number(snapshot.totals.readyCheckins || 0) === 1 ? "" : "s"} pronto${Number(snapshot.totals.readyCheckins || 0) === 1 ? "" : "s"}`,
            "3 titulares + 1 reserva por confronto"
          ]
        },
        {
          key: "rounds",
          title: "Rodadas e resultados",
          status: snapshot.adminChecklist.rounds.status,
          items: [
            `${snapshot.totals.rounds || 0} rodada${Number(snapshot.totals.rounds || 0) === 1 ? "" : "s"}`,
            `${snapshot.totals.matches || 0} confronto${Number(snapshot.totals.matches || 0) === 1 ? "" : "s"}`,
            "Pontuação 10 / 10 / 20 + extra 10"
          ]
        }
      ],
      timelineSteps: snapshot.timelineSteps,
      nextAction: snapshot.nextAction,
      warnings: snapshot.warnings,
      errors: snapshot.errors,
      lockedMessage: "Criação real ainda bloqueada. Esta área serve como preparação visual e administrativa para a implementação funcional futura."
    };
  }

  function buildTeamBattleLeaguePublicSectionModel(tournament = {}, options = {}) {
    const league = normalizeTeamBattleLeagueTournamentPayload(tournament, options);
    const mode = normalizeLeagueMode(league.leagueMode);
    const publicOverview = buildTeamBattlePublicOverview(league, options);
    const badge = getTeamBattleLeagueAvailabilityBadge(league, options);
    const rulebook = buildTeamBattleLeagueRulebookSummary(league.config);

    return {
      formatKey: FORMAT_KEY,
      schemaVersion: `${SCHEMA_VERSION}.public-section.v1`,
      title: "Team Battle League 4v4",
      subtitle: "Formato por equipes com confrontos estratégicos, escalações e partidas individuais.",
      badge,
      leagueMode: mode,
      leagueModeLabel: getLeagueModeLabel(mode),
      description: getLeagueModeDescription(mode),
      publicOverview,
      rulebook,
      highlights: [
        "Equipes com 4 jogadores",
        "3 partidas principais por confronto",
        "Reserva para partida extra em caso de empate",
        "Pontuação por partidas individuais",
        mode === LEAGUE_MODE_TYPES.BASIC_SINGLE_DIVISION ? "Liga básica com divisão única" : "Liga avançada com várias divisões"
      ],
      transparencyNotes: [
        "Formato ainda em preparação na plataforma -SBW-.",
        "A primeira versão funcional deve priorizar a liga básica com divisão única.",
        "O modo avançado com várias divisões fica reservado para uma etapa posterior."
      ],
      emptyState: {
        title: "Formato em preparação",
        description: "Quando o Team Battle League 4v4 for liberado, esta área poderá mostrar divisões, rodadas, confrontos, escalações e classificação."
      }
    };
  }

  function buildTeamBattleLeagueImplementationPlan() {
    return [
      {
        key: "functional-basic",
        title: "Primeira versão funcional",
        label: "Básica · divisão única",
        status: "próximo bloco recomendado",
        items: [
          "Liberar criação controlada do modo básico",
          "Permitir inscrição de equipes com elenco 4v4",
          "Gerar calendário de divisão única",
          "Exibir confrontos e classificação pública"
        ]
      },
      {
        key: "operations",
        title: "Operação de rodada",
        label: "Check-in, escalações e resultados",
        status: "após criação funcional",
        items: [
          "Confirmar check-in por equipe",
          "Registrar 3 titulares e 1 reserva",
          "Salvar resultados das partidas individuais",
          "Ativar partida extra quando houver empate"
        ]
      },
      {
        key: "advanced",
        title: "Modo avançado",
        label: "Várias divisões",
        status: "fase posterior",
        items: [
          "Criar múltiplas divisões",
          "Gerar classificação por divisão",
          "Montar playoffs entre classificados",
          "Preparar grande final entre campeões"
        ]
      }
    ];
  }

  function buildTeamBattleLeagueConsolidatedModel(tournament = {}, options = {}) {
    const league = normalizeTeamBattleLeagueTournamentPayload(tournament, options);

    return {
      formatKey: FORMAT_KEY,
      schemaVersion: `${SCHEMA_VERSION}.consolidated-model.v1`,
      status: DEFAULT_CONFIG.status,
      availability: getTeamBattleLeagueAvailabilityBadge(league, options),
      admin: buildTeamBattleLeagueAdminSectionModel(league, options),
      public: buildTeamBattleLeaguePublicSectionModel(league, options),
      implementationPlan: buildTeamBattleLeagueImplementationPlan(),
      metadata: buildTeamBattleLeagueTournamentMetadata(league, options)
    };
  }


  function createTeamBattleLeagueInternalTestRoster(teamIndex = 1) {
    const safeTeamIndex = clampNumber(teamIndex, 1, 99, 1);

    return Array.from({ length: DEFAULT_CONFIG.teamSize }, (_, index) => {
      const playerIndex = index + 1;
      return normalizeRosterMember({
        id: `test-team-${safeTeamIndex}-player-${playerIndex}`,
        slug: `teste-time-${safeTeamIndex}-jogador-${playerIndex}`,
        nickname: `Jogador ${safeTeamIndex}.${playerIndex}`,
        name: `Jogador ${safeTeamIndex}.${playerIndex}`,
        teamId: `test-team-${safeTeamIndex}`,
        metadata: {
          source: "internal-test-scenario",
          temporary: true
        }
      }, playerIndex);
    });
  }

  function createTeamBattleLeagueInternalTestTeam(index = 1, overrides = {}) {
    const source = asObject(overrides);
    const safeIndex = clampNumber(index, 1, 99, 1);
    const name = cleanText(source.name || source.teamName, `Equipe Teste ${safeIndex}`);
    const id = cleanText(source.id || source.teamId || source.slug, `test-team-${safeIndex}`);

    return normalizeTeamEntry({
      id,
      slug: cleanText(source.slug, `equipe-teste-${safeIndex}`),
      name,
      tag: cleanText(source.tag, `T${safeIndex}`),
      seed: clampNumber(source.seed || safeIndex, 1, 999, safeIndex),
      divisionId: "division-unica",
      roster: asArray(source.roster).length ? source.roster : createTeamBattleLeagueInternalTestRoster(safeIndex),
      metadata: {
        source: "internal-test-scenario",
        temporary: true,
        ...asObject(source.metadata)
      }
    }, safeIndex, "division-unica");
  }

  function buildTeamBattleLeagueInternalTestTeams(count = 4, overrides = []) {
    const total = clampNumber(count, 2, 16, 4);
    const overrideList = asArray(overrides);

    return Array.from({ length: total }, (_, index) => {
      return createTeamBattleLeagueInternalTestTeam(index + 1, overrideList[index]);
    });
  }

  function getFirstTeamBattleLeagueMatch(league = {}) {
    const source = asObject(league);
    const division = asArray(source.divisions)[0] || {};
    const round = asArray(division.rounds)[0] || {};
    const match = asArray(round.matches)[0] || null;

    return match ? {
      divisionId: cleanText(division.id),
      round: clampNumber(round.round, 1, 99, 1),
      matchId: cleanText(match.id),
      match
    } : null;
  }

  function buildTeamBattleLeagueInternalTestResultsPlan(teamMatch = {}) {
    const source = createTeamMatchSeed(teamMatch, DEFAULT_CONFIG);

    return [
      {
        slot: 1,
        winnerSide: "home",
        score: { home: 2, away: 0 },
        metadata: { source: "internal-test-results-plan" }
      },
      {
        slot: 2,
        winnerSide: "away",
        score: { home: 1, away: 2 },
        metadata: { source: "internal-test-results-plan" }
      },
      {
        slot: 3,
        winnerSide: "home",
        score: { home: 2, away: 1 },
        metadata: { source: "internal-test-results-plan" }
      },
      ...(shouldPlayExtraMatch(source) ? [{
        slot: 4,
        type: MATCH_SLOT_TYPES.EXTRA,
        winnerSide: "home",
        score: { home: 2, away: 1 },
        metadata: { source: "internal-test-results-plan" }
      }] : [])
    ];
  }

  function applyTeamBattleLeagueInternalTestResults(league = {}, options = {}) {
    const source = asObject(league);
    const config = normalizeConfig(options.config || source.config || source.settings || source);
    const firstMatchInfo = getFirstTeamBattleLeagueMatch(source);

    if (!firstMatchInfo) {
      return {
        ...source,
        metadata: {
          ...asObject(source.metadata),
          internalTestStatus: "without-match-to-simulate",
          internalTestUpdatedAt: new Date().toISOString()
        }
      };
    }

    const resultsPlan = asArray(options.resultsPlan).length
      ? asArray(options.resultsPlan)
      : buildTeamBattleLeagueInternalTestResultsPlan(firstMatchInfo.match);
    const simulatedMatch = applyTeamMatchResults(firstMatchInfo.match, resultsPlan, config);
    const divisions = asArray(source.divisions).map((division) => {
      const divisionSource = asObject(division);
      const rounds = asArray(divisionSource.rounds).map((round) => {
        const roundSource = asObject(round);
        return {
          ...roundSource,
          matches: asArray(roundSource.matches).map((match) => {
            return cleanText(match.id) === firstMatchInfo.matchId ? simulatedMatch : match;
          })
        };
      });
      const divisionWithRounds = {
        ...divisionSource,
        rounds
      };

      return {
        ...divisionWithRounds,
        standings: calculateDivisionStandings(divisionWithRounds)
      };
    });

    return {
      ...source,
      divisions,
      metadata: {
        ...asObject(source.metadata),
        internalTestStatus: "simulated-first-match",
        internalTestMatchId: firstMatchInfo.matchId,
        internalTestUpdatedAt: new Date().toISOString(),
        internalTestSource: "team-battle-basic-internal-scenario"
      }
    };
  }

  function buildTeamBattleLeagueBasicInternalTestScenario(options = {}) {
    const source = asObject(options);
    const teams = asArray(source.teams).length
      ? source.teams
      : buildTeamBattleLeagueInternalTestTeams(source.teamCount || 4, source.teamOverrides);
    const draftLeague = createBasicSingleDivisionLeague(teams, {
      title: cleanText(source.title, "Cenário interno · Team Battle League 4v4 básica"),
      metadata: {
        source: "internal-test-scenario",
        temporary: true,
        purpose: "Validar divisão única, calendário, escalações, resultado e classificação antes de liberar criação real."
      }
    }, source);
    const simulatedLeague = source.withResults === false
      ? draftLeague
      : applyTeamBattleLeagueInternalTestResults(draftLeague, source);
    const snapshot = buildTeamBattleLeagueOperationalSnapshot(simulatedLeague, source);
    const firstMatchInfo = getFirstTeamBattleLeagueMatch(simulatedLeague);

    return {
      formatKey: FORMAT_KEY,
      schemaVersion: `${SCHEMA_VERSION}.internal-test-scenario.v1`,
      generatedAt: new Date().toISOString(),
      mode: LEAGUE_MODE_TYPES.BASIC_SINGLE_DIVISION,
      modeLabel: getLeagueModeLabel(LEAGUE_MODE_TYPES.BASIC_SINGLE_DIVISION),
      status: "internal-test-only",
      teams,
      draftLeague,
      simulatedLeague,
      firstMatch: firstMatchInfo ? buildTeamMatchPublicSummary(firstMatchInfo.match) : null,
      snapshot,
      ready: snapshot.readyForInternalTest === true,
      nextAction: snapshot.nextAction,
      warnings: asArray(snapshot.warnings),
      errors: asArray(snapshot.errors)
    };
  }

  function buildTeamBattleLeagueInternalTestReport(options = {}) {
    const scenario = buildTeamBattleLeagueBasicInternalTestScenario(options);
    const snapshot = asObject(scenario.snapshot);
    const totals = asObject(snapshot.totals);

    return {
      formatKey: FORMAT_KEY,
      schemaVersion: `${SCHEMA_VERSION}.internal-test-report.v1`,
      generatedAt: new Date().toISOString(),
      title: "Relatório interno · Team Battle League 4v4 básica",
      status: scenario.ready ? "ready-for-internal-browser-test" : "needs-adjustments-before-test",
      summary: `${scenario.modeLabel} · ${totals.teams || 0} equipes · ${totals.matches || 0} confronto${Number(totals.matches || 0) === 1 ? "" : "s"} · ${totals.finishedMatches || 0} simulado${Number(totals.finishedMatches || 0) === 1 ? "" : "s"}`,
      checks: [
        {
          key: "single-division",
          label: "Divisão única criada",
          ok: Number(totals.divisions || 0) === 1
        },
        {
          key: "teams",
          label: "Equipes suficientes",
          ok: Number(totals.teams || 0) >= DEFAULT_CONFIG.minTeams
        },
        {
          key: "calendar",
          label: "Calendário gerado",
          ok: Number(totals.matches || 0) > 0
        },
        {
          key: "results",
          label: "Resultado simulado sem quebrar classificação",
          ok: options.withResults === false ? true : Number(totals.finishedMatches || 0) > 0
        },
        {
          key: "snapshot",
          label: "Snapshot operacional disponível",
          ok: Boolean(snapshot.currentStep || snapshot.status)
        }
      ],
      nextAction: scenario.nextAction,
      warnings: scenario.warnings,
      errors: scenario.errors,
      scenario
    };
  }


  function buildTeamBattleLeagueIntegrationContract(options = {}) {
    const source = asObject(options);
    const config = normalizeConfig(source.config || source);

    return {
      formatKey: FORMAT_KEY,
      schemaVersion: `${SCHEMA_VERSION}.integration-contract.v1`,
      generatedAt: new Date().toISOString(),
      status: "technical-contract",
      availability: getTeamBattleLeagueAvailabilityBadge(),
      preferredInitialMode: LEAGUE_MODE_TYPES.BASIC_SINGLE_DIVISION,
      modes: buildTeamBattleLeagueModeComparison(),
      storage: {
        primaryMetadataKey: "metadata.teamBattleLeague",
        primarySettingsKey: "settings.teamBattleLeague",
        formatMetaKey: "settings.formatMeta",
        schemaVersion: SCHEMA_VERSION,
        safeDraftOnly: true,
        notes: [
          "A primeira integração real deve salvar apenas rascunho controlado do formato.",
          "O modo básico usa uma divisão única e deve ser priorizado antes do modo avançado.",
          "Não salvar dados pessoais adicionais fora dos jogadores/equipes já participantes da competição."
        ]
      },
      entities: [
        { key: "league", label: "Liga", required: true, description: "Configuração geral do formato, modo, status e metadados." },
        { key: "division", label: "Divisão", required: true, description: "No modo básico existe apenas a Divisão Única." },
        { key: "team", label: "Equipe", required: true, description: "Equipe participante com tag, nome, seed e elenco." },
        { key: "roster_member", label: "Jogador do elenco", required: true, description: "Membro do elenco 4v4 vinculado à equipe." },
        { key: "team_match", label: "Confronto entre equipes", required: true, description: "Duelo entre duas equipes, com 3 partidas principais e possível partida extra." },
        { key: "match_slot", label: "Partida individual", required: true, description: "Partida 1, 2, 3 ou extra dentro do confronto." },
        { key: "lineup", label: "Escalação", required: true, description: "3 titulares e 1 reserva por equipe no confronto." },
        { key: "registration", label: "Inscrição de equipe", required: false, description: "Base futura para inscrição e aprovação de equipes." },
        { key: "checkin", label: "Check-in de equipe", required: false, description: "Base futura para confirmar presença e escalação antes do confronto." }
      ],
      scoring: {
        mainMatches: config.mainMatchPointsBySlot.map((points, index) => ({ slot: index + 1, points })),
        extraMatch: { enabled: config.extraMatchOnDraw, points: config.defaultExtraMatchPoints },
        summary: "Partida 1 vale 10 pts, Partida 2 vale 10 pts, Partida 3 vale 20 pts e Partida extra vale 10 pts em caso de empate."
      },
      releaseGuards: [
        "Manter criação real bloqueada enquanto o formato estiver com status em preparação.",
        "Começar pelo modo básico com Divisão Única.",
        "Não criar tabelas Supabase novas nesta base técnica sem uma etapa SQL própria.",
        "Não misturar esse formato com o bracket Double Elimination atual.",
        "Não habilitar check-in ou inscrição real de equipe antes de existir tela própria de gestão."
      ],
      suggestedNextBatches: buildTeamBattleLeagueNextImplementationBatches()
    };
  }

  function buildTeamBattleLeaguePreReleaseChecklist(tournament = {}, options = {}) {
    const source = asObject(options);
    const league = Object.keys(asObject(tournament)).length
      ? getTeamBattleLeagueDataFromTournament(tournament)
      : buildTeamBattleLeagueBasicInternalTestScenario({ withResults: true }).simulatedLeague;
    const snapshot = buildTeamBattleLeagueOperationalSnapshot(league, source);
    const internalReport = buildTeamBattleLeagueInternalTestReport({ withResults: true });
    const contract = buildTeamBattleLeagueIntegrationContract(source);
    const availability = getTeamBattleLeagueAvailabilityBadge();

    const checks = [
      {
        key: "format-still-locked",
        label: "Formato segue bloqueado para criação real",
        ok: availability.available !== true,
        severity: "required"
      },
      {
        key: "basic-mode-defined",
        label: "Modo básico definido como Divisão Única",
        ok: normalizeLeagueMode(league?.config?.leagueMode || league?.leagueMode) === LEAGUE_MODE_TYPES.BASIC_SINGLE_DIVISION,
        severity: "required"
      },
      {
        key: "technical-contract",
        label: "Contrato técnico disponível para próxima integração",
        ok: Boolean(contract?.storage?.primaryMetadataKey),
        severity: "required"
      },
      {
        key: "metadata-adapter",
        label: "Adaptador de metadados disponível",
        ok: typeof buildTeamBattleLeagueTournamentMetadata === "function" && typeof getTeamBattleLeagueDataFromTournament === "function",
        severity: "required"
      },
      {
        key: "internal-test",
        label: "Cenário interno básico executável",
        ok: internalReport.status === "ready-for-internal-browser-test" || internalReport.status === "needs-adjustments-before-test",
        severity: "recommended"
      },
      {
        key: "snapshot",
        label: "Snapshot operacional disponível",
        ok: Boolean(snapshot?.currentStep || snapshot?.status),
        severity: "recommended"
      },
      {
        key: "public-admin-models",
        label: "Modelos público e administrativo preparados",
        ok: typeof buildTeamBattleLeaguePublicSectionModel === "function" && typeof buildTeamBattleLeagueAdminSectionModel === "function",
        severity: "recommended"
      }
    ];

    const requiredChecks = checks.filter((check) => check.severity === "required");
    const requiredReady = requiredChecks.every((check) => check.ok === true);
    const recommendedReady = checks.every((check) => check.ok === true);

    return {
      formatKey: FORMAT_KEY,
      schemaVersion: `${SCHEMA_VERSION}.pre-release-checklist.v1`,
      generatedAt: new Date().toISOString(),
      status: requiredReady ? "ready-for-next-visual-integration" : "blocked",
      readyForNextVisualIntegration: requiredReady,
      readyForRealCreation: false,
      recommendedReady,
      checks,
      warnings: [
        "Este checklist libera apenas próxima integração visual/administrativa de rascunho, não criação real pública.",
        "A primeira versão funcional deve usar Team Battle League 4v4 básica com Divisão Única."
      ],
      nextBatches: buildTeamBattleLeagueNextImplementationBatches(),
      snapshot,
      internalReport
    };
  }

  function buildTeamBattleLeagueNextImplementationBatches() {
    return [
      {
        key: "admin-draft-preview",
        label: "Prévia administrativa de rascunho",
        goal: "Mostrar no painel do organizador o resumo do formato, checklist e aviso de em preparação.",
        suggestedVersion: "v1.6.73",
        scope: ["painel do organizador", "prévia visual", "sem salvar estrutura real ainda"]
      },
      {
        key: "basic-league-setup-screen",
        label: "Tela de configuração da liga básica",
        goal: "Permitir configurar Divisão Única, limite de equipes e regras base em ambiente controlado.",
        suggestedVersion: "v1.6.74",
        scope: ["modo básico", "divisão única", "rascunho"]
      },
      {
        key: "team-registration-flow",
        label: "Inscrição e aprovação de equipes 4v4",
        goal: "Criar fluxo real de equipes inscritas com elenco de 4 jogadores.",
        suggestedVersion: "v1.6.75",
        scope: ["equipes", "elenco", "aprovação"]
      },
      {
        key: "lineup-checkin-results",
        label: "Escalações, check-in e resultados",
        goal: "Criar operação dos confrontos: titulares, reserva, check-in, placar e partida extra.",
        suggestedVersion: "v1.6.76",
        scope: ["check-in", "escalações", "resultados"]
      },
      {
        key: "public-league-pages",
        label: "Páginas públicas da liga",
        goal: "Exibir divisões, rodadas, confrontos, classificação e playoffs de forma limpa.",
        suggestedVersion: "v1.6.77",
        scope: ["público", "classificação", "confrontos"]
      },
      {
        key: "advanced-divisions",
        label: "Modo avançado com várias divisões",
        goal: "Expandir a base da liga básica para múltiplas divisões quando o modo inicial estiver validado.",
        suggestedVersion: "v1.6.78+",
        scope: ["modo avançado", "múltiplas divisões", "playoffs entre divisões"]
      }
    ];
  }

  function getTeamBattleLeagueNextSetupSteps(report = {}) {
    const source = asObject(report);
    const steps = [];

    if (!source.divisionCount) {
      steps.push(source.leagueMode === LEAGUE_MODE_TYPES.ADVANCED_MULTI_DIVISION ? "Criar pelo menos uma divisão." : "Criar a divisão única da liga básica.");
    }

    if (Number(source.totalTeams || 0) < 2) {
      steps.push("Adicionar equipes suficientes para gerar confrontos.");
    }

    if (Number(source.readyTeams || 0) < Number(source.totalTeams || 0)) {
      steps.push("Completar elencos com 4 jogadores por equipe.");
    }

    if (asArray(source.divisions).some((division) => !asObject(division.schedule).ready)) {
      steps.push("Gerar ou revisar o calendário round-robin das divisões.");
    }

    if (!steps.length && source.ready) {
      steps.push("Estrutura pronta para testes internos do formato.");
    }

    return steps;
  }

  function buildTeamBattleLeagueReadinessReport(league = {}, options = {}) {
    const validation = validateTeamBattleLeagueStructure(league, options);
    const nextSteps = getTeamBattleLeagueNextSetupSteps(validation);

    return {
      ...validation,
      statusLabel: validation.ready ? "Pronta para testes internos" : validation.valid ? "Estrutura parcial" : "Requer ajustes",
      nextSteps,
      summaryLabel: `${validation.leagueModeLabel} · ${validation.readyDivisions}/${validation.divisionCount} divisão${validation.divisionCount === 1 ? "" : "ões"} pronta${validation.divisionCount === 1 ? "" : "s"} · ${validation.readyTeams}/${validation.totalTeams} equipes com elenco completo · ${validation.totalMatches} confronto${validation.totalMatches === 1 ? "" : "s"}`
    };
  }

  window.SBWTeamBattleLeague = Object.freeze({
    FORMAT_KEY,
    SCHEMA_VERSION,
    DEFAULT_CONFIG,
    MATCH_SLOT_TYPES,
    TEAM_MATCH_STATUS,
    LINEUP_ROLE_TYPES,
    PLAYOFF_STAGE_TYPES,
    LEAGUE_MODE_TYPES,
    TEAM_REGISTRATION_STATUS,
    TEAM_CHECKIN_STATUS,
    LEAGUE_OPERATION_STATUS,
    normalizeLeagueMode,
    isAdvancedLeagueMode,
    getLeagueModeLabel,
    getLeagueModeDescription,
    getTeamBattleLeagueModePreset,
    createBasicSingleDivisionLeague,
    createAdvancedMultiDivisionLeague,
    createTeamBattleLeagueByMode,
    buildBasicSingleDivisionReadinessReport,
    normalizeTeamRegistrationStatus,
    createTeamRegistrationEntry,
    validateTeamRegistrationEntry,
    getApprovedTeamRegistrationEntries,
    buildTeamRegistrationSummary,
    buildBasicLeagueFromApprovedRegistrations,
    appendTeamRegistrationToLeagueDraft,
    normalizeTeamCheckinStatus,
    createTeamCheckinEntry,
    validateTeamCheckinEntry,
    buildTeamCheckinSummary,
    buildTeamCheckinEntriesFromLeague,
    validateTeamMatchCheckinReadiness,
    attachReadyCheckinsToTeamMatch,
    buildLeagueCheckinReadinessReport,
    normalizeLeagueOperationStatus,
    getTeamMatchLifecycleStatus,
    buildTeamBattleRoundLifecycle,
    buildTeamBattleDivisionLifecycle,
    buildTeamBattleLeagueLifecycleReport,
    createTeamBattleTimelineStep,
    buildTeamBattleLeagueTimeline,
    getTeamBattleLeagueNextOperationalAction,
    getTeamBattleLeagueStepStateLabel,
    buildTeamBattleLeagueAdminChecklist,
    buildTeamBattleLeagueOperationalSnapshot,
    getTeamBattleLeagueDataFromTournament,
    normalizeTeamBattleLeagueTournamentPayload,
    buildTeamBattleLeagueTournamentMetadata,
    attachTeamBattleLeagueToTournamentDraft,
    buildTeamBattleLeagueTournamentAdminPreview,
    getTeamBattleLeagueAvailabilityBadge,
    buildTeamBattleLeagueModeComparison,
    buildTeamBattleLeagueRulebookSummary,
    buildTeamBattleLeagueAdminSectionModel,
    buildTeamBattleLeaguePublicSectionModel,
    buildTeamBattleLeagueImplementationPlan,
    buildTeamBattleLeagueConsolidatedModel,
    createTeamBattleLeagueInternalTestRoster,
    createTeamBattleLeagueInternalTestTeam,
    buildTeamBattleLeagueInternalTestTeams,
    getFirstTeamBattleLeagueMatch,
    buildTeamBattleLeagueInternalTestResultsPlan,
    applyTeamBattleLeagueInternalTestResults,
    buildTeamBattleLeagueBasicInternalTestScenario,
    buildTeamBattleLeagueInternalTestReport,
    buildTeamBattleLeagueIntegrationContract,
    buildTeamBattleLeaguePreReleaseChecklist,
    buildTeamBattleLeagueNextImplementationBatches,
    normalizeConfig,
    getDefaultSlotPoints,
    createEmptyDivision,
    normalizeTeamEntry,
    createDivisionFromTeams,
    createMatchSlot,
    createTeamMatchSeed,
    calculateTeamMatchScore,
    needsExtraMatch,
    normalizeWinnerSide,
    normalizeSlotScore,
    isMatchSlotPlayed,
    getMainMatchScore,
    areMainMatchesComplete,
    shouldPlayExtraMatch,
    updateMatchSlotResult,
    applyTeamMatchResults,
    getTeamMatchProgress,
    finalizeTeamMatchResult,
    buildTeamMatchPublicResult,
    normalizeRosterMember,
    normalizeTeamRoster,
    createLineupSlot,
    buildDefaultTeamLineup,
    normalizeTeamLineup,
    validateTeamLineup,
    applyLineupsToTeamMatch,
    validateTeamMatchLineups,
    createTeamMatchFromTeams,
    validateRoster,
    buildRoundRobinPairings,
    createDivisionSchedule,
    getLeagueSourceTeams,
    getLeagueSourceDivisions,
    buildTeamBattleLeagueStructure,
    flattenDivisionMatches,
    calculateDivisionStandings,
    normalizeStandingRow,
    getQualifiedTeamsFromStandings,
    createPlayoffTeamReference,
    createPlayoffMatch,
    buildDivisionPlayoffBracket,
    buildLeaguePlayoffPlan,
    findTeamReference,
    getTeamDisplayLabel,
    buildMatchSlotPublicSummary,
    buildTeamMatchPublicSummary,
    buildRoundPublicSummary,
    buildDivisionPublicSummary,
    buildLeaguePublicSummary,
    buildTeamBattlePublicOverview,
    getTeamEntryKey,
    getRosterReadinessLabel,
    validateDivisionTeams,
    validateDivisionSchedule,
    validateTeamBattleLeagueStructure,
    getTeamBattleLeagueNextSetupSteps,
    buildTeamBattleLeagueReadinessReport,
  });
})();
