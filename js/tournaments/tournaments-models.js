function sbwCreateId(prefix = "id") {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function sbwNormalizeOrganizer(tournament) {
  const organizer = tournament?.organizer || tournament?.organizerName;

  if (!organizer) {
    return {
      id: "org_saberwolf",
      name: "SaberWolf"
    };
  }

  if (typeof organizer === "string") {
    return {
      id: organizer.toLowerCase().replace(/\s+/g, "_"),
      name: organizer
    };
  }

  if (typeof organizer === "object") {
    return {
      id: organizer.id || organizer.slug || sbwCreateId("org"),
      name: organizer.name ||
        organizer.displayName ||
        organizer.nickname ||
        organizer.title ||
        "Organizador"
    };
  }

  return {
    id: "org_unknown",
    name: "Organizador"
  };
}

function sbwNormalizeParticipant(participant, index = 0) {
  const safeParticipant = participant || {};

  return {
    id: safeParticipant.id ||
      safeParticipant.userId ||
      safeParticipant.playerId ||
      sbwCreateId(`participant_${index + 1}`),

    userId: safeParticipant.userId || safeParticipant.profileId || null,

    nickname: safeParticipant.nickname ||
      safeParticipant.name ||
      safeParticipant.playerName ||
      safeParticipant.displayName ||
      `Jogador ${index + 1}`,

    team: safeParticipant.team ||
      safeParticipant.organization ||
      safeParticipant.club ||
      "Sem equipe",

    platform: safeParticipant.platform || "",
    character: safeParticipant.character || "",
    discord: safeParticipant.discord || "",
    twitter: safeParticipant.twitter || "",

    checkedIn: Boolean(safeParticipant.checkedIn),

    status: safeParticipant.status ||
      (safeParticipant.checkedIn ? "checked-in" : "registered"),

    seed: safeParticipant.seed || index + 1,

    createdAt: safeParticipant.createdAt || null
  };
}

function sbwNormalizeMatchPlayer(player) {
  if (!player) {
    return null;
  }

  return {
    id: player.id || player.userId || player.playerId || null,
    nickname: player.nickname ||
      player.name ||
      player.playerName ||
      player.displayName ||
      "Jogador",
    team: player.team || player.organization || player.club || "Sem equipe"
  };
}

function sbwNormalizeMatch(match, index = 0) {
  const safeMatch = match || {};

  const playerA = safeMatch.playerA ||
    safeMatch.a ||
    safeMatch.home ||
    safeMatch.participantA ||
    safeMatch.player1 ||
    null;

  const playerB = safeMatch.playerB ||
    safeMatch.b ||
    safeMatch.away ||
    safeMatch.participantB ||
    safeMatch.player2 ||
    null;

  return {
    id: safeMatch.id || sbwCreateId(`match_${index + 1}`),

    roundId: safeMatch.roundId || null,
    roundName: safeMatch.roundName ||
      safeMatch.roundLabel ||
      safeMatch.round ||
      "",

    groupId: safeMatch.groupId || null,
    groupName: safeMatch.groupName || "",

    playerA: sbwNormalizeMatchPlayer(playerA),
    playerB: sbwNormalizeMatchPlayer(playerB),

    scoreA: safeMatch.scoreA ?? null,
    scoreB: safeMatch.scoreB ?? null,

    winnerId: safeMatch.winnerId || null,

    status: safeMatch.status || "pending",

    resultWorkflow: safeMatch.resultWorkflow || {
      reportedBy: null,
      confirmedBy: [],
      disputed: false,
      validatedByAdmin: false
    },

    scheduledAt: safeMatch.scheduledAt || null,
    createdAt: safeMatch.createdAt || null,
    updatedAt: safeMatch.updatedAt || null
  };
}

function sbwNormalizeRegistration(registration) {
  const safeRegistration = registration || {};

  return {
    id: safeRegistration.id || sbwCreateId("registration"),

    tournamentId: safeRegistration.tournamentId || null,
    userId: safeRegistration.userId || null,

    nickname: safeRegistration.nickname ||
      safeRegistration.playerName ||
      "Jogador",

    platform: safeRegistration.platform || "",
    team: safeRegistration.team || "Sem equipe",
    character: safeRegistration.character || "",
    discord: safeRegistration.discord || "",
    twitter: safeRegistration.twitter || "",

    status: safeRegistration.status || "pending-login",

    createdAt: safeRegistration.createdAt || new Date().toISOString(),
    updatedAt: safeRegistration.updatedAt || null,

    note: safeRegistration.note || ""
  };
}

function sbwNormalizeTournament(tournament) {
  const safeTournament = tournament || {};
  const organizer = sbwNormalizeOrganizer(safeTournament);

  const participants = Array.isArray(safeTournament.participants)
    ? safeTournament.participants.map(sbwNormalizeParticipant)
    : [];

  const registrations = Array.isArray(safeTournament.registrations)
    ? safeTournament.registrations.map(sbwNormalizeRegistration)
    : [];

  const matches = Array.isArray(safeTournament.matches)
    ? safeTournament.matches.map(sbwNormalizeMatch)
    : [];

  const structure = safeTournament.structure ||
    safeTournament.tournamentStructure ||
    safeTournament.generatedStructure ||
    {};

  const settings = {
    maxParticipants: safeTournament.settings?.maxParticipants ||
      safeTournament.maxParticipants ||
      safeTournament.participantLimit ||
      safeTournament.limitParticipants ||
      safeTournament.limit ||
      "",

    matchFormat: safeTournament.settings?.matchFormat ||
      safeTournament.matchFormat ||
      safeTournament.matchRules ||
      safeTournament.setFormat ||
      "",

    startDate: safeTournament.settings?.startDate ||
      safeTournament.startDate ||
      safeTournament.date ||
      safeTournament.eventDate ||
      "",

    startTime: safeTournament.settings?.startTime ||
      safeTournament.startTime ||
      "",

    checkInTime: safeTournament.settings?.checkInTime ||
      safeTournament.checkInTime ||
      "",

    platform: safeTournament.settings?.platform ||
      safeTournament.platform ||
      safeTournament.gamePlatform ||
      ""
  };

  return {
    id: safeTournament.id || sbwCreateId("tournament"),

    name: safeTournament.name ||
      safeTournament.title ||
      "Torneio sem nome",

    game: safeTournament.game || "Jogo a definir",

    platform: settings.platform || "Plataforma a definir",

     format: typeof sbwGetTournamentFormat === "function"
     ? sbwGetTournamentFormat(safeTournament)
     : safeTournament.format || "unknown",

    status: safeTournament.status || "draft",

    organizer,

    settings,

    maxParticipants: settings.maxParticipants,
    matchFormat: settings.matchFormat,
    startDate: settings.startDate,
    startTime: settings.startTime,
    checkInTime: settings.checkInTime,

    prize: safeTournament.prize ||
      safeTournament.prizePool ||
      "A definir",

    description: safeTournament.description ||
      safeTournament.shortDescription ||
      "Torneio publicado na plataforma SaberWolf.",

    rules: safeTournament.rules ||
      safeTournament.ruleSet ||
      "Regras ainda não publicadas pelo organizador.",

    participants,
    registrations,
    matches,
    structure,

    source: safeTournament.source || "local",

    createdAt: safeTournament.createdAt || null,
    updatedAt: safeTournament.updatedAt || null
  };
}

function sbwNormalizeTournamentList(tournaments) {
  if (!Array.isArray(tournaments)) {
    return [];
  }

  return tournaments.map(sbwNormalizeTournament);
}