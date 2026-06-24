function sbwEscapeHTML(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function sbwFormatDate(value) {
  if (!value) {
    return "Aguardando data";
  }

  const safeValue = String(value);

  if (safeValue.includes("/")) {
    return safeValue;
  }

  const date = new Date(`${safeValue}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return safeValue;
  }

  return date.toLocaleDateString("pt-BR");
}

function sbwGetQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

function sbwGetTournamentStructure(tournament) {
  if (!tournament) {
    return null;
  }

  return tournament.structure ||
    tournament.tournamentStructure ||
    tournament.generatedStructure ||
    null;
}

function sbwGetTournamentFormat(tournament) {
  if (!tournament) {
    return "unknown";
  }

  const structure = sbwGetTournamentStructure(tournament);
  const settings = tournament.settings || {};
  const metadata = tournament.metadata || {};
  const formatMeta = metadata.format || metadata.tournamentFormat || metadata.tournament_format || settings.formatMeta || settings.formatMetadata || settings.format_metadata || {};

  const rawFormat =
    formatMeta.key ||
    formatMeta.formatKey ||
    formatMeta.format_key ||
    tournament.formatKey ||
    tournament.format_key ||
    tournament.format ||
    tournament.type ||
    settings.formatKey ||
    settings.format_key ||
    settings.format ||
    structure?.type ||
    structure?.format ||
    "";

  const normalized = String(rawFormat).toLowerCase().trim();

  if (window.SBWTournamentFormats?.get) {
    const registered = window.SBWTournamentFormats.get(normalized || rawFormat);
    if (registered?.key) {
      return registered.key;
    }
  }

  if (
    normalized === "groups-playoffs" ||
    normalized === "groups_playoffs" ||
    normalized === "group-playoffs" ||
    normalized === "grupo-playoffs" ||
    normalized.includes("grupo")
  ) {
    return "groups-playoffs";
  }

  if (
    normalized === "league" ||
    normalized === "liga" ||
    normalized === "pontos-corridos" ||
    normalized === "pontos corridos" ||
    normalized === "round-robin" ||
    normalized.includes("liga") ||
    normalized.includes("pontos")
  ) {
    return "league";
  }

  if (
    normalized === "double-elimination" ||
    normalized === "double_elimination" ||
    normalized.includes("double")
  ) {
    return "double-elimination";
  }

  if (
    normalized === "single-elimination" ||
    normalized === "single_elimination" ||
    normalized.includes("single") ||
    normalized.includes("simples")
  ) {
    return "single-elimination";
  }

  return rawFormat || "unknown";
}

function sbwGetFormatLabel(format) {
  if (window.SBWTournamentFormats?.getLabel) {
    const label = window.SBWTournamentFormats.getLabel(format, "");
    if (label) return label;
  }

  const labels = {
    "groups-playoffs": "Grupos + Playoffs",
    league: "Liga / Pontos Corridos",
    "double-elimination": "Double Elimination",
    "single-elimination": "Eliminação Simples"
  };

  return labels[format] || format || "Formato não definido";
}

function sbwGetStatusInfo(status) {
  const normalized = String(status || "draft").toLowerCase();

  const statusMap = {
    draft: {
      label: "Rascunho",
      className: "draft"
    },

    open: {
      label: "Inscrições abertas",
      className: "open"
    },

    published: {
      label: "Publicado",
      className: "open"
    },

    "registration-open": {
      label: "Inscrições abertas",
      className: "open"
    },

    "structure-generated": {
      label: "Estrutura gerada",
      className: "running"
    },

    "in-progress": {
      label: "Em andamento",
      className: "running"
    },

    running: {
      label: "Em andamento",
      className: "running"
    },

    finished: {
      label: "Encerrado",
      className: "finished"
    },

    completed: {
      label: "Encerrado",
      className: "finished"
    }
  };

  return statusMap[normalized] || {
    label: normalized,
    className: "draft"
  };
}

function sbwGetParticipants(tournament) {
  if (!tournament) {
    return [];
  }

  return Array.isArray(tournament.participants)
    ? tournament.participants
    : [];
}

function sbwGetParticipantsCount(tournament) {
  return sbwGetParticipants(tournament).length;
}

function sbwGetMaxParticipants(tournament) {
  if (!tournament) {
    return "∞";
  }

  return tournament.maxParticipants ||
    tournament.participantLimit ||
    tournament.limitParticipants ||
    tournament.limit ||
    tournament.settings?.maxParticipants ||
    "∞";
}

function sbwGetParticipantsLabel(tournament) {
  const count = sbwGetParticipantsCount(tournament);
  const maxParticipants = sbwGetMaxParticipants(tournament);

  if (maxParticipants && maxParticipants !== "∞") {
    return `${count} / ${maxParticipants}`;
  }

  if (count > 0) {
    return `${count} inscrito${count === 1 ? "" : "s"}`;
  }

  return "Participantes a definir";
}

function sbwGetDescription(tournament) {
  if (!tournament) {
    return "Torneio publicado na plataforma SaberWolf.";
  }

  return tournament.description ||
    tournament.shortDescription ||
    tournament.rules ||
    "Torneio publicado na plataforma SaberWolf.";
}

function sbwGetRules(tournament) {
  if (!tournament) {
    return "Regras ainda não publicadas pelo organizador.";
  }

  return tournament.rules ||
    tournament.ruleSet ||
    "Regras ainda não publicadas pelo organizador.";
}

function sbwGetPrize(tournament) {
  if (!tournament) {
    return "A definir";
  }

  return tournament.prize ||
    tournament.prizePool ||
    tournament.settings?.prize ||
    "A definir";
}

function sbwGetOrganizerName(tournament) {
  if (!tournament) {
    return "SaberWolf";
  }

  const organizer = tournament.organizer || tournament.organizerName;

  if (!organizer) {
    return "SaberWolf";
  }

  if (typeof organizer === "string") {
    return organizer;
  }

  if (typeof organizer === "object") {
    return organizer.name ||
      organizer.displayName ||
      organizer.nickname ||
      organizer.title ||
      "Organizador";
  }

  return "Organizador";
}

function sbwGetPlatformLabel(tournament) {
  if (!tournament) {
    return "Plataforma a definir";
  }

  return tournament.platform ||
    tournament.gamePlatform ||
    tournament.console ||
    tournament.settings?.platform ||
    "Plataforma a definir";
}

function sbwGetMatchFormat(tournament) {
  if (!tournament) {
    return "";
  }

  return tournament.matchFormat ||
    tournament.matchRules ||
    tournament.setFormat ||
    tournament.matchType ||
    tournament.settings?.matchFormat ||
    "";
}

function sbwGetStartDate(tournament) {
  if (!tournament) {
    return "";
  }

  return tournament.startDate ||
    tournament.date ||
    tournament.eventDate ||
    tournament.settings?.startDate ||
    "";
}

function sbwGetStartTime(tournament) {
  if (!tournament) {
    return "A definir";
  }

  return tournament.startTime ||
    tournament.settings?.startTime ||
    "A definir";
}

function sbwGetCheckInTime(tournament) {
  if (!tournament) {
    return "A definir";
  }

  return tournament.checkInTime ||
    tournament.settings?.checkInTime ||
    "A definir";
}

function sbwGetPlayerName(player) {
  if (!player) {
    return "A definir";
  }

  return player.nickname ||
    player.name ||
    player.playerName ||
    player.displayName ||
    "Jogador";
}

function sbwGetPlayerTeam(player) {
  if (!player) {
    return "Sem equipe";
  }

  return player.team ||
    player.organization ||
    player.club ||
    "Sem equipe";
}

function sbwGetMatchScore(match, field) {
  if (!match) {
    return "-";
  }

  const value = match[field];

  if (value === null || value === undefined || value === "") {
    return "-";
  }

  return value;
}