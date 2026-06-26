const sbwOrganizerEditorAccess = document.getElementById("organizerEditorAccess");
const sbwOrganizerEditorShell = document.getElementById("organizerEditorShell");
const sbwOrganizerEditorForm = document.getElementById("organizerEditorForm");
const sbwOrganizerEditorMessage = document.getElementById("organizerEditorMessage");
const sbwOrganizerEditorStatusText = document.getElementById("organizerEditorStatusText");
const sbwOrganizerEditorDashboardGrid = document.getElementById("organizerEditorDashboardGrid");
const sbwOrganizerPreview = document.getElementById("organizerPreview");
const sbwOrganizerOpenPublic = document.getElementById("organizerOpenPublic");
const sbwOrganizerResetLocal = document.getElementById("organizerResetLocal");
const sbwOrganizerCreateTournament = document.getElementById("organizerCreateTournament");
const sbwOrganizerStaffList = document.getElementById("organizerStaffList");
const sbwOrganizerStaffCount = document.getElementById("organizerStaffCount");
const sbwOrganizerStaffInviteForm = document.getElementById("organizerStaffInviteForm");
const sbwOrganizerStaffProfileKey = document.getElementById("organizerStaffProfileKey");
const sbwOrganizerStaffRole = document.getElementById("organizerStaffRole");
const sbwOrganizerStaffInviteButton = document.getElementById("organizerStaffInviteButton");
const sbwOrganizerStaffMessage = document.getElementById("organizerStaffMessage");
const sbwOrganizerEditorTournamentsList = document.getElementById("organizerEditorTournamentsList");
const sbwOrganizerEditorTournamentCreateInline = document.getElementById("organizerEditorTournamentCreateInline");
const sbwOrganizerSeasonForm = document.getElementById("organizerSeasonForm");
const sbwOrganizerSeasonName = document.getElementById("organizerSeasonName");
const sbwOrganizerSeasonStart = document.getElementById("organizerSeasonStart");
const sbwOrganizerSeasonEnd = document.getElementById("organizerSeasonEnd");
const sbwOrganizerSeasonMessage = document.getElementById("organizerSeasonMessage");
const sbwOrganizerSeasonGuard = document.getElementById("organizerSeasonGuard");
const sbwOrganizerSeasonTournamentsManager = document.getElementById("organizerSeasonTournamentsManager");
const sbwOrganizerSeasonAudit = document.getElementById("organizerSeasonAudit");
const sbwOrganizerEditorRankingPlayers = document.getElementById("organizerEditorRankingPlayers");
const sbwOrganizerEditorRankingTeams = document.getElementById("organizerEditorRankingTeams");
const sbwOrganizerTournamentEditForm = document.getElementById("organizerTournamentEditForm");
const sbwOrganizerTournamentEditTitle = document.getElementById("organizerTournamentEditTitle");
const sbwOrganizerTournamentEditId = document.getElementById("organizerTournamentEditId");
const sbwOrganizerTournamentEditName = document.getElementById("organizerTournamentEditName");
const sbwOrganizerTournamentEditGame = document.getElementById("organizerTournamentEditGame");
const sbwOrganizerTournamentEditFormat = document.getElementById("organizerTournamentEditFormat");
const sbwOrganizerTournamentEditFormatPreview = document.getElementById("organizerTournamentEditFormatPreview");
const sbwOrganizerTournamentEditStatus = document.getElementById("organizerTournamentEditStatus");
const sbwOrganizerTournamentEditStartDate = document.getElementById("organizerTournamentEditStartDate");
const sbwOrganizerTournamentEditStartTime = document.getElementById("organizerTournamentEditStartTime");
const sbwOrganizerTournamentEditMax = document.getElementById("organizerTournamentEditMax");
const sbwOrganizerTournamentEditMaxLabel = document.querySelector('label[for="organizerTournamentEditMax"]');
const sbwOrganizerTournamentEditMaxNote = document.getElementById("organizerTournamentEditMaxNote");
const sbwOrganizerTournamentEditRegistrationOpens = document.getElementById("organizerTournamentEditRegistrationOpens");
const sbwOrganizerTournamentEditRegistrationCloses = document.getElementById("organizerTournamentEditRegistrationCloses");
const sbwOrganizerTournamentEditCheckinStarts = document.getElementById("organizerTournamentEditCheckinStarts");
const sbwOrganizerTournamentEditCheckinEnds = document.getElementById("organizerTournamentEditCheckinEnds");
const sbwOrganizerTournamentEditCover = document.getElementById("organizerTournamentEditCover");
const sbwOrganizerTournamentEditCoverManual = document.getElementById("organizerTournamentEditCoverManual");
const sbwOrganizerTournamentCoverFile = document.getElementById("organizerTournamentCoverFile");
const sbwOrganizerTournamentCoverPreview = document.getElementById("organizerTournamentCoverPreview");
const sbwOrganizerTournamentCoverMessage = document.getElementById("organizerTournamentCoverMessage");
const sbwOrganizerTournamentEditDescription = document.getElementById("organizerTournamentEditDescription");
const sbwOrganizerTournamentEditRules = document.getElementById("organizerTournamentEditRules");
const sbwOrganizerTournamentEditSave = document.getElementById("organizerTournamentEditSave");
const sbwOrganizerTournamentEditCancel = document.getElementById("organizerTournamentEditCancel");
const sbwOrganizerTournamentEditPublicLink = document.getElementById("organizerTournamentEditPublicLink");
const sbwOrganizerTournamentEditManageLink = document.getElementById("organizerTournamentEditManageLink");
const sbwOrganizerTournamentEditMessage = document.getElementById("organizerTournamentEditMessage");
const sbwOrganizerTournamentParticipantsPanel = document.getElementById("organizerTournamentParticipantsPanel");
const sbwOrganizerTournamentParticipantsTitle = document.getElementById("organizerTournamentParticipantsTitle");
const sbwOrganizerTournamentParticipantsMeta = document.getElementById("organizerTournamentParticipantsMeta");
const sbwOrganizerTournamentParticipantsClose = document.getElementById("organizerTournamentParticipantsClose");
const sbwOrganizerTournamentParticipantsList = document.getElementById("organizerTournamentParticipantsList");
const sbwOrganizerTournamentParticipantsMessage = document.getElementById("organizerTournamentParticipantsMessage");
const sbwOrganizerTournamentParticipantsPublicLink = document.getElementById("organizerTournamentParticipantsPublicLink");
const sbwOrganizerTournamentParticipantsRegistered = document.getElementById("organizerTournamentParticipantsRegistered");
const sbwOrganizerTournamentParticipantsCheckedIn = document.getElementById("organizerTournamentParticipantsCheckedIn");
const sbwOrganizerTournamentParticipantsWaitlist = document.getElementById("organizerTournamentParticipantsWaitlist");
const sbwOrganizerTournamentParticipantsRemoved = document.getElementById("organizerTournamentParticipantsRemoved");
const sbwOrganizerTeamBattleSchedulePanel = document.getElementById("organizerTeamBattleSchedulePanel");
const sbwOrganizerTeamBattleScheduleTitle = document.getElementById("organizerTeamBattleScheduleTitle");
const sbwOrganizerTeamBattleScheduleMeta = document.getElementById("organizerTeamBattleScheduleMeta");
const sbwOrganizerTeamBattleScheduleClose = document.getElementById("organizerTeamBattleScheduleClose");
const sbwOrganizerTeamBattleSchedulePublicLink = document.getElementById("organizerTeamBattleSchedulePublicLink");
const sbwOrganizerTeamBattleScheduleForm = document.getElementById("organizerTeamBattleScheduleForm");
const sbwOrganizerTeamBattleScheduleList = document.getElementById("organizerTeamBattleScheduleList");
const sbwOrganizerTeamBattleScheduleSave = document.getElementById("organizerTeamBattleScheduleSave");
const sbwOrganizerTeamBattleScheduleMessage = document.getElementById("organizerTeamBattleScheduleMessage");
const sbwOrganizerTeamBattleResultsPanel = document.getElementById("organizerTeamBattleResultsPanel");
const sbwOrganizerTeamBattleResultsTitle = document.getElementById("organizerTeamBattleResultsTitle");
const sbwOrganizerTeamBattleResultsMeta = document.getElementById("organizerTeamBattleResultsMeta");
const sbwOrganizerTeamBattleResultsClose = document.getElementById("organizerTeamBattleResultsClose");
const sbwOrganizerTeamBattleResultsPublicLink = document.getElementById("organizerTeamBattleResultsPublicLink");
const sbwOrganizerTeamBattleResultsForm = document.getElementById("organizerTeamBattleResultsForm");
const sbwOrganizerTeamBattleResultsList = document.getElementById("organizerTeamBattleResultsList");
const sbwOrganizerTeamBattleResultsSave = document.getElementById("organizerTeamBattleResultsSave");
const sbwOrganizerTeamBattleResultsMessage = document.getElementById("organizerTeamBattleResultsMessage");
const sbwOrganizerTeamBattlePlayoffsPanel = document.getElementById("organizerTeamBattlePlayoffsPanel");
const sbwOrganizerTeamBattlePlayoffsTitle = document.getElementById("organizerTeamBattlePlayoffsTitle");
const sbwOrganizerTeamBattlePlayoffsMeta = document.getElementById("organizerTeamBattlePlayoffsMeta");
const sbwOrganizerTeamBattlePlayoffsClose = document.getElementById("organizerTeamBattlePlayoffsClose");
const sbwOrganizerTeamBattlePlayoffsPublicLink = document.getElementById("organizerTeamBattlePlayoffsPublicLink");
const sbwOrganizerTeamBattlePlayoffsForm = document.getElementById("organizerTeamBattlePlayoffsForm");
const sbwOrganizerTeamBattlePlayoffsList = document.getElementById("organizerTeamBattlePlayoffsList");
const sbwOrganizerTeamBattlePlayoffsSave = document.getElementById("organizerTeamBattlePlayoffsSave");
const sbwOrganizerTeamBattlePlayoffsMessage = document.getElementById("organizerTeamBattlePlayoffsMessage");

let sbwOrganizerEditorCurrent = null;
let sbwOrganizerEditorSlug = "";
let sbwOrganizerEditorIsNew = false;
let sbwOrganizerEditorTournamentsCache = [];
let sbwOrganizerEditorEditingTournament = null;
let sbwOrganizerEditorManagingTournament = null;
let sbwOrganizerEditorSchedulingTournament = null;
let sbwOrganizerEditorResultsTournament = null;
let sbwOrganizerEditorPlayoffsTournament = null;
let sbwOrganizerEditorParticipantsCache = [];
let sbwOrganizerTeamBattleScheduleRowsCache = [];
let sbwOrganizerTeamBattleResultsRowsCache = [];
let sbwOrganizerTeamBattlePlayoffsStateCache = null;
let sbwOrganizerSeasonTournamentFilter = "all";
let sbwOrganizerSeasonTournamentSearch = "";

const SBW_ORGANIZER_TEAM_BATTLE_4V4_FORMAT = "team-battle-league-4v4";

function sbwOrganizerEditorIsTeamBattleLeague4v4Format(format) {
  return String(format || "").trim().toLowerCase() === SBW_ORGANIZER_TEAM_BATTLE_4V4_FORMAT;
}

function sbwOrganizerEditorNormalizeEvenCapacity(value, options = {}) {
  const min = Number(options.min || 2);
  const max = Number(options.max || 256);
  const fallback = Number(options.fallback || min);
  let number = Number.parseInt(value, 10);

  if (!Number.isFinite(number)) {
    number = fallback;
  }

  number = Math.max(min, Math.min(max, number));

  if (number % 2 !== 0) {
    number += 1;
  }

  if (number > max) {
    number = max % 2 === 0 ? max : max - 1;
  }

  return Math.max(min, number);
}

const sbwOrganizerEditorAssetConfig = {
  bucket: "sbw-team-assets",
  allowedTypes: ["image/png", "image/jpeg", "image/webp"],
  logoMaxBytes: 2 * 1024 * 1024,
  bannerMaxBytes: 4 * 1024 * 1024
};

function sbwOrganizerEditorEscape(value) {
  if (typeof sbwEscapeHTML === "function") {
    return sbwEscapeHTML(value);
  }

  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function sbwOrganizerEditorAsObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function sbwOrganizerEditorCleanKey(value, fallback = "") {
  const text = String(value || fallback || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return text || fallback;
}

function sbwOrganizerEditorGetTeamBattleData(tournament) {
  const metadata = sbwOrganizerEditorAsObject(tournament?.metadata);
  const settings = sbwOrganizerEditorAsObject(tournament?.settings);
  return sbwOrganizerEditorAsObject(
    metadata.teamBattleLeague ||
    metadata.team_battle_league ||
    settings.teamBattleLeague ||
    settings.team_battle_league
  );
}

function sbwOrganizerEditorGetTeamBattleScheduleSavedMatches(tournament) {
  const helper = window.SBWTeamBattleLeague;
  if (helper && typeof helper.getTeamBattleSavedMatchResults === "function") {
    const matches = helper.getTeamBattleSavedMatchResults(tournament || {});
    if (Array.isArray(matches)) return matches;
  }

  const teamBattle = sbwOrganizerEditorGetTeamBattleData(tournament);
  return [
    tournament?.teamBattleMatches,
    tournament?.team_battle_matches,
    tournament?.teamMatches,
    tournament?.team_matches,
    teamBattle.matches,
    teamBattle.teamMatches,
    teamBattle.team_matches,
    teamBattle.results,
    sbwOrganizerEditorAsObject(teamBattle.results).matches
  ].find((items) => Array.isArray(items)) || [];
}

function sbwOrganizerEditorGetTeamBattleMatchMergeKey(match = {}) {
  const item = sbwOrganizerEditorAsObject(match);
  const id = String(item.id || item.matchId || item.match_id || "").trim();
  if (id) return `id:${id}`;

  const home = sbwOrganizerEditorCleanKey(item.homeTeamId || item.home_team_id || item.homeTeamSlug || item.home_team_slug || item.home?.id || item.home?.slug);
  const away = sbwOrganizerEditorCleanKey(item.awayTeamId || item.away_team_id || item.awayTeamSlug || item.away_team_slug || item.away?.id || item.away?.slug);
  const round = String(item.round || item.roundNumber || item.round_number || 1).trim() || "1";
  return `pair:${round}:${home}:${away}`;
}

function sbwOrganizerEditorGetTeamBattleMatchLabel(match = {}, fallback = "Confronto") {
  const item = sbwOrganizerEditorAsObject(match);
  return String(item.label || item.roundLabel || item.round_label || fallback || "Confronto").trim();
}

function sbwOrganizerEditorGetTeamBattleTeamLabel(match = {}, side = "home") {
  const item = sbwOrganizerEditorAsObject(match);
  const team = side === "away"
    ? sbwOrganizerEditorAsObject(item.away || item.awayTeam || item.away_team)
    : sbwOrganizerEditorAsObject(item.home || item.homeTeam || item.home_team);
  const id = side === "away" ? item.awayTeamId || item.away_team_id : item.homeTeamId || item.home_team_id;
  const name = side === "away"
    ? item.awayTeamName || item.away_team_name || item.metadata?.awayTeamName
    : item.homeTeamName || item.home_team_name || item.metadata?.homeTeamName;
  const tag = team.tag || team.teamTag || team.team_tag || "";
  const finalName = name || team.name || team.teamName || team.team_name || team.displayName || team.display_name || id || (side === "away" ? "Visitante" : "Mandante");

  return tag ? `${tag} ${finalName}` : finalName;
}

function sbwOrganizerEditorNormalizeTeamBattleSchedule(match = {}) {
  const helper = window.SBWTeamBattleLeague;
  if (helper && typeof helper.normalizeMatchSchedule === "function") {
    return helper.normalizeMatchSchedule(match, { leagueMode: "basic_single_division" });
  }

  const schedule = sbwOrganizerEditorAsObject(match.schedule || match.scheduling || match.matchSchedule || match.match_schedule);
  const date = String(schedule.date || schedule.scheduledDate || match.scheduledDate || "").slice(0, 10);
  const time = String(schedule.time || schedule.scheduledTime || match.scheduledTime || "").slice(0, 5);
  const status = String(schedule.status || match.scheduleStatus || "to_define").trim() || "to_define";
  const label = date ? `${date.split("-").reverse().join("/")}${time ? ` · ${time}` : ""}` : "A definir pelo organizador";

  return {
    status,
    statusLabel: status === "scheduled" ? "Agendado" : status === "live" ? "Ao vivo" : status === "postponed" ? "Adiado/remarcando" : status === "finished" ? "Finalizado" : status === "cancelled" ? "Cancelado" : "A definir pelo organizador",
    label,
    date,
    time,
    scheduledAt: date ? `${date}T${time || "00:00"}:00` : "",
    timezone: schedule.timezone || "America/Sao_Paulo",
    note: schedule.note || schedule.notes || schedule.observation || "",
    streamUrl: schedule.streamUrl || schedule.stream_url || schedule.broadcastUrl || ""
  };
}

function sbwOrganizerEditorBuildTeamBattleScheduleRows(tournament) {
  const helper = window.SBWTeamBattleLeague;
  const state = helper && typeof helper.buildTeamBattleLeagueBasicPublicState === "function"
    ? helper.buildTeamBattleLeagueBasicPublicState(tournament || {}, { leagueMode: "basic_single_division" })
    : null;
  const division = sbwOrganizerEditorAsObject(state?.division);
  const rounds = Array.isArray(division.rounds) ? division.rounds : [];

  return rounds.flatMap((round, roundIndex) => {
    const matches = Array.isArray(round.matches) ? round.matches : [];
    return matches.map((match, matchIndex) => {
      const item = sbwOrganizerEditorAsObject(match);
      const schedule = sbwOrganizerEditorNormalizeTeamBattleSchedule(item);
      const id = String(item.id || item.matchId || item.match_id || `round-${roundIndex + 1}-match-${matchIndex + 1}`);

      return {
        id,
        key: sbwOrganizerEditorGetTeamBattleMatchMergeKey({ ...item, id }),
        round: Number(item.round || round.round || roundIndex + 1) || roundIndex + 1,
        roundLabel: String(round.label || round.name || `Rodada ${roundIndex + 1}`),
        label: sbwOrganizerEditorGetTeamBattleMatchLabel(item, `Confronto ${matchIndex + 1}`),
        homeTeamLabel: sbwOrganizerEditorGetTeamBattleTeamLabel(item, "home"),
        awayTeamLabel: sbwOrganizerEditorGetTeamBattleTeamLabel(item, "away"),
        source: item,
        schedule
      };
    });
  });
}

function sbwOrganizerEditorSetTeamBattleScheduleMessage(message, type = "") {
  if (!sbwOrganizerTeamBattleScheduleMessage) return;
  sbwOrganizerTeamBattleScheduleMessage.textContent = message || "";
  sbwOrganizerTeamBattleScheduleMessage.classList.remove("is-error", "is-success", "is-loading");
  if (type) sbwOrganizerTeamBattleScheduleMessage.classList.add(`is-${type}`);
}

function sbwOrganizerEditorSetTeamBattleResultsMessage(message, type = "") {
  if (!sbwOrganizerTeamBattleResultsMessage) return;
  sbwOrganizerTeamBattleResultsMessage.textContent = message || "";
  sbwOrganizerTeamBattleResultsMessage.classList.remove("is-error", "is-success", "is-loading");
  if (type) sbwOrganizerTeamBattleResultsMessage.classList.add(`is-${type}`);
}

function sbwOrganizerEditorSetTeamBattlePlayoffsMessage(message, type = "") {
  if (!sbwOrganizerTeamBattlePlayoffsMessage) return;
  sbwOrganizerTeamBattlePlayoffsMessage.textContent = message || "";
  sbwOrganizerTeamBattlePlayoffsMessage.classList.remove("is-error", "is-success", "is-loading");
  if (type) sbwOrganizerTeamBattlePlayoffsMessage.classList.add(`is-${type}`);
}


function sbwOrganizerEditorCreateTeamBattleAuditEntry(action, label, detail, extra = {}) {
  const source = sbwOrganizerEditorAsObject(extra);
  const now = new Date().toISOString();

  return {
    id: `team-battle-audit-${now.replace(/[^0-9]/g, "")}-${String(action || "update").replace(/[^a-z0-9_-]/gi, "-")}`,
    action: String(action || "team_battle_update"),
    label: String(label || "Atualização Team Battle 4v4"),
    detail: String(detail || "Registro operacional atualizado pelo organizador."),
    date: now,
    createdAt: now,
    scope: "team_battle_league_4v4",
    actor: String(source.actor || sbwOrganizerEditorCurrent?.name || sbwOrganizerEditorCurrent?.title || sbwOrganizerEditorCurrent?.slug || "Organizador"),
    matchCount: Number(source.matchCount || 0) || 0,
    finishedCount: Number(source.finishedCount || 0) || 0,
    metadata: {
      tournamentKey: String(source.tournamentKey || ""),
      source: String(source.source || "organizer-team-battle-panel"),
      ...sbwOrganizerEditorAsObject(source.metadata)
    }
  };
}

function sbwOrganizerEditorGetTeamBattleAuditEntriesFromData(teamBattle = {}) {
  const source = sbwOrganizerEditorAsObject(teamBattle);
  const entries = [
    ...(Array.isArray(source.auditLog) ? source.auditLog : []),
    ...(Array.isArray(source.audit_log) ? source.audit_log : []),
    ...(Array.isArray(source.operationalAudit) ? source.operationalAudit : []),
    ...(Array.isArray(source.operational_audit) ? source.operational_audit : [])
  ];
  const unique = new Map();

  entries.forEach((entry, index) => {
    const item = sbwOrganizerEditorAsObject(entry);
    const normalized = {
      id: String(item.id || `team-battle-audit-${index + 1}`),
      action: String(item.action || item.type || "team_battle_update"),
      label: String(item.label || item.title || "Atualização Team Battle 4v4"),
      detail: String(item.detail || item.description || item.message || "Registro operacional atualizado pelo organizador."),
      date: String(item.date || item.createdAt || item.created_at || item.updatedAt || item.updated_at || ""),
      actor: String(item.actor || item.actorName || item.actor_name || "Organizador"),
      matchCount: Number(item.matchCount || item.match_count || 0) || 0,
      finishedCount: Number(item.finishedCount || item.finished_count || 0) || 0,
      metadata: sbwOrganizerEditorAsObject(item.metadata)
    };
    const key = `${normalized.action}:${normalized.date}:${normalized.detail}`;
    if (!unique.has(key)) unique.set(key, normalized);
  });

  return Array.from(unique.values())
    .sort((first, second) => String(second.date || "").localeCompare(String(first.date || "")));
}

function sbwOrganizerEditorGetTeamBattleAuditEntries(tournament = {}, limit = 8) {
  const helper = window.SBWTeamBattleLeague;
  if (helper && typeof helper.getTeamBattleAuditEntries === "function") {
    return helper.getTeamBattleAuditEntries(tournament || {}, { limit });
  }

  const metadata = sbwOrganizerEditorAsObject(tournament?.metadata);
  const settings = sbwOrganizerEditorAsObject(tournament?.settings);
  const teamBattle = {
    ...sbwOrganizerEditorAsObject(settings.teamBattleLeague || settings.team_battle_league),
    ...sbwOrganizerEditorAsObject(metadata.teamBattleLeague || metadata.team_battle_league)
  };

  return sbwOrganizerEditorGetTeamBattleAuditEntriesFromData(teamBattle).slice(0, limit);
}

function sbwOrganizerEditorBuildTeamBattleAuditLog(teamBattleBase = {}, entry = null) {
  const previousEntries = sbwOrganizerEditorGetTeamBattleAuditEntriesFromData(teamBattleBase);
  const nextEntries = entry ? [entry, ...previousEntries] : previousEntries;
  const unique = new Map();

  nextEntries.forEach((item, index) => {
    const entryObject = sbwOrganizerEditorAsObject(item);
    const key = `${entryObject.action || "update"}:${entryObject.date || index}:${entryObject.detail || ""}`;
    if (!unique.has(key)) unique.set(key, entryObject);
  });

  return Array.from(unique.values())
    .sort((first, second) => String(second.date || "").localeCompare(String(first.date || "")))
    .slice(0, 40);
}

function sbwOrganizerEditorRenderTeamBattleAuditTrail(tournament = {}, options = {}) {
  const entries = sbwOrganizerEditorGetTeamBattleAuditEntries(tournament, Number(options.limit || 6) || 6);
  const compact = options.compact === true;

  if (!entries.length) {
    return `
      <aside class="organizer-admin-team-battle-audit ${compact ? "is-compact" : ""}">
        <div class="organizer-admin-team-battle-audit__head">
          <span>Auditoria operacional</span>
          <strong>Nenhum registro ainda</strong>
        </div>
        <p>Agenda, resultados, playoffs e fechamento serão registrados aqui quando o organizador salvar alterações.</p>
      </aside>
    `;
  }

  return `
    <aside class="organizer-admin-team-battle-audit ${compact ? "is-compact" : ""}">
      <div class="organizer-admin-team-battle-audit__head">
        <span>Auditoria operacional</span>
        <strong>${entries.length} registro${entries.length === 1 ? "" : "s"} recente${entries.length === 1 ? "" : "s"}</strong>
      </div>
      <div class="organizer-admin-team-battle-audit__list">
        ${entries.map((entry) => `
          <article class="organizer-admin-team-battle-audit__item">
            <span>${sbwOrganizerEditorEscape(entry.label || "Atualização Team Battle")}</span>
            <strong>${sbwOrganizerEditorEscape(entry.detail || "Registro operacional atualizado.")}</strong>
            <small>${sbwOrganizerEditorEscape(entry.actor || "Organizador")} · ${sbwOrganizerEditorEscape(sbwOrganizerEditorFormatDateTime(entry.date || entry.createdAt))}</small>
          </article>
        `).join("")}
      </div>
    </aside>
  `;
}


function sbwOrganizerEditorGetTeamBattleSlotPoints(slot = 1) {
  const index = Number(slot) || 1;
  if (index === 3) return 20;
  return 10;
}

function sbwOrganizerEditorNormalizeTeamBattleResultSlot(slot = {}, slotIndex = 1) {
  const item = sbwOrganizerEditorAsObject(slot);
  const score = sbwOrganizerEditorAsObject(item.score);
  const winnerSide = String(item.winnerSide || item.winner_side || "").trim().toLowerCase();
  const safeWinner = winnerSide === "home" || winnerSide === "away" ? winnerSide : "";
  const points = Number(item.points || sbwOrganizerEditorGetTeamBattleSlotPoints(slotIndex));

  return {
    slot: Number(item.slot || slotIndex) || slotIndex,
    type: item.type === "extra" ? "extra" : "main",
    label: String(item.label || (item.type === "extra" ? "Partida extra" : `Partida ${slotIndex}`)),
    winnerSide: safeWinner,
    points: Number.isFinite(points) ? points : sbwOrganizerEditorGetTeamBattleSlotPoints(slotIndex),
    score: {
      home: Number(score.home ?? score.homeScore ?? score.home_score ?? 0) || 0,
      away: Number(score.away ?? score.awayScore ?? score.away_score ?? 0) || 0
    },
    status: safeWinner ? "finished" : String(item.status || "draft"),
    metadata: sbwOrganizerEditorAsObject(item.metadata)
  };
}

function sbwOrganizerEditorGetTeamBattleResultSummary(match = {}) {
  const helper = window.SBWTeamBattleLeague;
  if (helper && typeof helper.finalizeTeamMatchResult === "function") {
    const finalized = helper.finalizeTeamMatchResult(match, { leagueMode: "basic_single_division" });
    const result = sbwOrganizerEditorAsObject(finalized.result);
    return {
      status: String(finalized.status || "draft"),
      homePoints: Number(result.homePoints || 0),
      awayPoints: Number(result.awayPoints || 0),
      homeWins: Number(result.homeWins || 0),
      awayWins: Number(result.awayWins || 0),
      extraRequired: result.extraRequired === true,
      finalized: result.finalized === true,
      winnerSide: String(result.winnerSide || "")
    };
  }

  const slots = [...(Array.isArray(match.matches) ? match.matches : []), match.extraMatch].filter(Boolean);
  return slots.reduce((acc, slot) => {
    const item = sbwOrganizerEditorNormalizeTeamBattleResultSlot(slot, slot?.slot || 1);
    if (!item.winnerSide) return acc;
    if (item.winnerSide === "home") {
      acc.homePoints += item.points;
      acc.homeWins += 1;
    } else {
      acc.awayPoints += item.points;
      acc.awayWins += 1;
    }
    return acc;
  }, { status: "draft", homePoints: 0, awayPoints: 0, homeWins: 0, awayWins: 0, extraRequired: false, finalized: false, winnerSide: "" });
}

function sbwOrganizerEditorBuildTeamBattleResultsRows(tournament) {
  const rows = sbwOrganizerEditorBuildTeamBattleScheduleRows(tournament);

  return rows.map((row) => {
    const source = sbwOrganizerEditorAsObject(row.source);
    const matches = Array.isArray(source.matches) ? source.matches : [];
    const mainMatches = [1, 2, 3].map((slotIndex) => {
      const current = matches.find((match) => Number(match?.slot || 0) === slotIndex) || matches[slotIndex - 1] || {};
      return sbwOrganizerEditorNormalizeTeamBattleResultSlot({
        ...current,
        slot: slotIndex,
        type: "main",
        label: current.label || `Partida ${slotIndex}`,
        points: current.points || sbwOrganizerEditorGetTeamBattleSlotPoints(slotIndex)
      }, slotIndex);
    });
    const extraMatch = source.extraMatch || source.extra_match || {};
    const normalizedExtra = sbwOrganizerEditorNormalizeTeamBattleResultSlot({
      ...extraMatch,
      slot: 4,
      type: "extra",
      label: extraMatch.label || "Partida extra",
      points: extraMatch.points || 10
    }, 4);
    const summary = sbwOrganizerEditorGetTeamBattleResultSummary({
      ...source,
      matches: mainMatches,
      extraMatch: normalizedExtra.winnerSide ? normalizedExtra : null
    });

    return {
      ...row,
      mainMatches,
      extraMatch: normalizedExtra,
      resultSummary: summary
    };
  });
}

function sbwOrganizerEditorRenderTeamBattleSlotFields(row, slot, options = {}) {
  const homeLabel = row.homeTeamLabel || "Mandante";
  const awayLabel = row.awayTeamLabel || "Visitante";
  const isExtra = options.extra === true;
  const slotId = isExtra ? "extra" : String(slot.slot || 1);
  const score = sbwOrganizerEditorAsObject(slot.score);

  return `
    <div class="organizer-admin-team-battle-result-slot ${isExtra ? "is-extra" : ""}" data-team-battle-result-slot="${sbwOrganizerEditorEscape(slotId)}">
      <div class="organizer-admin-team-battle-result-slot__label">
        <strong>${sbwOrganizerEditorEscape(slot.label || (isExtra ? "Partida extra" : `Partida ${slot.slot || 1}`))}</strong>
        <span>${Number(slot.points || 0) || sbwOrganizerEditorGetTeamBattleSlotPoints(slot.slot)} pts</span>
      </div>
      <label>
        Vencedor
        <select data-team-battle-result-field="winnerSide" data-team-battle-result-slot-field="${sbwOrganizerEditorEscape(slotId)}">
          <option value="" ${!slot.winnerSide ? "selected" : ""}>A definir</option>
          <option value="home" ${slot.winnerSide === "home" ? "selected" : ""}>${sbwOrganizerEditorEscape(homeLabel)}</option>
          <option value="away" ${slot.winnerSide === "away" ? "selected" : ""}>${sbwOrganizerEditorEscape(awayLabel)}</option>
        </select>
      </label>
      <label>
        Placar ${sbwOrganizerEditorEscape(homeLabel)}
        <input type="number" min="0" max="9" step="1" data-team-battle-result-field="homeScore" data-team-battle-result-slot-field="${sbwOrganizerEditorEscape(slotId)}" value="${Number(score.home || 0)}">
      </label>
      <label>
        Placar ${sbwOrganizerEditorEscape(awayLabel)}
        <input type="number" min="0" max="9" step="1" data-team-battle-result-field="awayScore" data-team-battle-result-slot-field="${sbwOrganizerEditorEscape(slotId)}" value="${Number(score.away || 0)}">
      </label>
    </div>
  `;
}


function sbwOrganizerEditorGetFormatMetadata(format) {
  const registry = window.SBWTournamentFormats;

  if (registry && typeof registry.toMetadata === "function") {
    return registry.toMetadata(format);
  }

  const key = String(format || "").trim() || "double-elimination";
  const labels = {
    "double-elimination": "Double Elimination",
    "single-elimination": "Single Elimination",
    "groups-playoffs": "Grupos + Playoffs",
    "round-robin": "Pontos Corridos",
    league: "Liga",
    "team-battle-league-4v4": "Team Battle League 4v4"
  };

  return {
    key,
    label: labels[key] || key,
    family: key === "team-battle-league-4v4" ? "team-league" : "core",
    category: key === "team-battle-league-4v4" ? "advanced" : "core",
    status: key === "team-battle-league-4v4" ? "beta" : "active",
    teamMode: key === "team-battle-league-4v4" ? "team_4v4" : "solo",
    description: key === "team-battle-league-4v4"
      ? "Formato avançado em beta controlado para testes reais, com MVP básico de divisão única, equipes reais após check-in e confrontos por equipe."
      : "Formato competitivo base da plataforma -SBW-.",
    features: key === "team-battle-league-4v4"
      ? ["Equipes de 4", "Divisão única", "Equipes reais após check-in", "Team matches"]
      : [],
    requirements: key === "team-battle-league-4v4"
      ? ["Elenco de 4 jogadores", "Check-in encerrado", "Divisão única", "Sistema de escalação"]
      : []
  };
}


function sbwOrganizerEditorGetTournamentFormatValue(tournament) {
  const metadata = sbwOrganizerEditorAsObject(tournament?.metadata);
  const settings = sbwOrganizerEditorAsObject(tournament?.settings);
  const raw = sbwOrganizerEditorAsObject(tournament?.raw);
  const rawMetadata = sbwOrganizerEditorAsObject(raw?.metadata);
  const rawSettings = sbwOrganizerEditorAsObject(raw?.settings);
  const metadataFormat = sbwOrganizerEditorAsObject(metadata.format || metadata.tournamentFormat || metadata.tournament_format);
  const settingsFormat = sbwOrganizerEditorAsObject(settings.format || settings.formatMeta || settings.format_meta || settings.formatConfig || settings.format_config);
  const rawMetadataFormat = sbwOrganizerEditorAsObject(rawMetadata.format || rawMetadata.tournamentFormat || rawMetadata.tournament_format);
  const rawSettingsFormat = sbwOrganizerEditorAsObject(rawSettings.format || rawSettings.formatMeta || rawSettings.format_meta || rawSettings.formatConfig || rawSettings.format_config);

  return String(
    tournament?.format ||
    tournament?.formatKey ||
    tournament?.format_key ||
    tournament?.tournamentFormat ||
    tournament?.tournament_format ||
    metadataFormat.key ||
    metadataFormat.value ||
    settingsFormat.key ||
    settingsFormat.value ||
    raw?.format ||
    raw?.format_key ||
    rawMetadataFormat.key ||
    rawMetadataFormat.value ||
    rawSettingsFormat.key ||
    rawSettingsFormat.value ||
    "double-elimination"
  ).trim() || "double-elimination";
}

function sbwOrganizerEditorIsFormatAvailableForSave(format) {
  const registry = window.SBWTournamentFormats;

  if (registry && typeof registry.canCreate === "function") {
    return registry.canCreate(format);
  }

  return sbwOrganizerEditorGetFormatMetadata(format).status === "active";
}

function sbwOrganizerEditorGetFormatBlockReason(format) {
  const registry = window.SBWTournamentFormats;

  if (registry && typeof registry.getCreationBlockReason === "function") {
    const reason = registry.getCreationBlockReason(format);
    if (reason) return reason;
  }

  const metadata = sbwOrganizerEditorGetFormatMetadata(format);

  if (metadata.status === "beta") {
    return "";
  }

  if (metadata.status === "planned") {
    return `${metadata.label || "Este formato"} está em preparação e ainda não deve ser usado em torneios reais.`;
  }

  return `${metadata.label || "Este formato"} ainda não está disponível para torneios reais.`;
}

function sbwOrganizerEditorGetTournamentFormatMetadata(tournament) {
  const value = sbwOrganizerEditorGetTournamentFormatValue(tournament);
  const metadata = sbwOrganizerEditorGetFormatMetadata(value);
  const tournamentMetadata = sbwOrganizerEditorAsObject(tournament?.metadata);
  const settings = sbwOrganizerEditorAsObject(tournament?.settings);
  const raw = sbwOrganizerEditorAsObject(tournament?.raw);
  const rawMetadata = sbwOrganizerEditorAsObject(raw?.metadata);
  const rawSettings = sbwOrganizerEditorAsObject(raw?.settings);
  const saved = sbwOrganizerEditorAsObject(
    tournamentMetadata.format ||
    tournamentMetadata.tournamentFormat ||
    settings.format ||
    settings.formatMeta ||
    settings.formatConfig ||
    rawMetadata.format ||
    rawSettings.format ||
    rawSettings.formatMeta ||
    rawSettings.formatConfig
  );

  return {
    ...metadata,
    ...saved,
    key: metadata.key || saved.key || value,
    label: saved.label || saved.name || metadata.label || value,
    shortLabel: saved.shortLabel || saved.short_label || metadata.shortLabel || saved.label || metadata.label || value,
    status: saved.status || metadata.status || "active",
    category: saved.category || metadata.category || "core",
    family: saved.family || metadata.family || "core",
    teamMode: saved.teamMode || saved.team_mode || metadata.teamMode || "solo"
  };
}

function sbwOrganizerEditorGetFormatStatusLabel(status) {
  const normalized = String(status || "").toLowerCase();
  if (normalized === "beta") return "Beta controlado";
  if (normalized === "planned") return "Em preparação";
  if (normalized === "active") return "Disponível";
  if (normalized === "custom") return "Customizado";
  return "Formato";
}

function sbwOrganizerEditorGetFormatCategoryLabel(category) {
  const normalized = String(category || "").toLowerCase();
  if (normalized === "advanced") return "Avançado";
  if (normalized === "core") return "Base";
  if (normalized === "custom") return "Custom";
  return "Formato";
}

function sbwOrganizerEditorRenderFormatBadge(tournament, options = {}) {
  const metadata = sbwOrganizerEditorGetTournamentFormatMetadata(tournament);
  const status = String(metadata.status || "active").toLowerCase();
  const category = String(metadata.category || "core").toLowerCase();
  const label = options.short
    ? (metadata.shortLabel || metadata.label || "Formato")
    : (metadata.label || "Formato competitivo");
  const statusLabel = sbwOrganizerEditorGetFormatStatusLabel(status);
  const categoryLabel = sbwOrganizerEditorGetFormatCategoryLabel(category);

  return `
    <span class="organizer-admin-format-badge organizer-admin-format-badge--${sbwOrganizerEditorEscape(status)} organizer-admin-format-badge--${sbwOrganizerEditorEscape(category)}" title="${sbwOrganizerEditorEscape(categoryLabel)} · ${sbwOrganizerEditorEscape(statusLabel)}">
      <strong>${sbwOrganizerEditorEscape(label)}</strong>
      ${options.compact ? "" : `<small>${sbwOrganizerEditorEscape(categoryLabel)} · ${sbwOrganizerEditorEscape(statusLabel)}</small>`}
    </span>
  `;
}


function sbwOrganizerEditorRenderTeamBattleFormatPanel(formatValue, tournament = sbwOrganizerEditorEditingTournament) {
  const metadata = sbwOrganizerEditorGetFormatMetadata(formatValue || "double-elimination");
  const key = String(metadata.key || formatValue || "").toLowerCase();

  if (key !== "team-battle-league-4v4") return "";

  const helper = window.SBWTeamBattleLeague;
  const model = helper && typeof helper.buildTeamBattleLeagueAdminSectionModel === "function"
    ? helper.buildTeamBattleLeagueAdminSectionModel(tournament || {}, { leagueMode: "basic_single_division" })
    : null;
  const modes = model?.modeComparison || (helper && typeof helper.buildTeamBattleLeagueModeComparison === "function"
    ? helper.buildTeamBattleLeagueModeComparison()
    : []);
  const rulebook = model?.rulebook || (helper && typeof helper.buildTeamBattleLeagueRulebookSummary === "function"
    ? helper.buildTeamBattleLeagueRulebookSummary()
    : null);
  const cards = Array.isArray(model?.cards) ? model.cards : [
    { label: "Modo recomendado", value: "Divisão única", description: "Primeira versão funcional planejada." },
    { label: "Equipes", value: "4v4", description: "Cada equipe usa elenco de 4 jogadores." },
    { label: "Pontuação", value: "10/10/20", description: "Partida extra vale 10 pontos se houver empate." }
  ];
  const operations = [
    { label: "Configuração", value: "Divisão única", detail: "Criar a liga básica com todas as equipes no mesmo grupo." },
    { label: "Inscrições", value: "Equipes aprovadas", detail: "Validar equipes com elenco mínimo de 4 jogadores." },
    { label: "Agenda", value: "Livre por confronto", detail: "Organizador define datas e horários por rodada/confronto." },
    { label: "Escalações", value: "3 + 1", detail: "Confirmar titulares e reserva antes do confronto." },
    { label: "Rodadas", value: "Round-robin", detail: "Gerar confrontos da divisão única e acompanhar resultados." }
  ];
  const releaseChecks = [
    "Formato em beta controlado para criação do MVP básico.",
    "Primeira liberação deve usar somente divisão única.",
    "Playoffs básicos seguem a escada -SBW-: Top 4, FT50/FT70, sem partida extra.",
    "Agenda das partidas fica sob controle do organizador por ser campeonato longo.",
    "Modo com várias divisões fica reservado para etapa avançada com Top 3 por divisão."
  ];
  const visualBoard = helper && typeof helper.buildTeamBattleLeagueVisualPreviewBoard === "function"
    ? helper.buildTeamBattleLeagueVisualPreviewBoard(tournament || {}, { leagueMode: "basic_single_division" })
    : null;
  const testPackage = helper && typeof helper.buildTeamBattleLeagueControlledTestPackage === "function"
    ? helper.buildTeamBattleLeagueControlledTestPackage(tournament || {}, { leagueMode: "basic_single_division" })
    : null;
  const realTestChecklist = helper && typeof helper.buildTeamBattleLeagueRealTestChecklist === "function"
    ? helper.buildTeamBattleLeagueRealTestChecklist(tournament || {}, { leagueMode: "basic_single_division" })
    : null;
  const mvpModel = helper && typeof helper.buildTeamBattleLeagueBasicMvpAdminSummary === "function"
    ? helper.buildTeamBattleLeagueBasicMvpAdminSummary(tournament || {}, { leagueMode: "basic_single_division" })
    : null;
  const setupPreview = helper && typeof helper.buildTeamBattleLeagueBasicMvpSetupPreview === "function"
    ? helper.buildTeamBattleLeagueBasicMvpSetupPreview(tournament || {}, { leagueMode: "basic_single_division" })
    : null;
  const testGates = Array.isArray(testPackage?.gates) ? testPackage.gates.slice(0, 6) : [];
  const realTestChecks = Array.isArray(realTestChecklist?.checks) ? realTestChecklist.checks.slice(0, 8) : [];
  const mvpCards = Array.isArray(mvpModel?.cards) ? mvpModel.cards.slice(0, 4) : [];
  const mvpRequired = Array.isArray(mvpModel?.requiredData) ? mvpModel.requiredData.slice(0, 4) : [];
  const setupFields = Array.isArray(setupPreview?.fields) ? setupPreview.fields.slice(0, 8) : [];
  const setupCards = Array.isArray(setupPreview?.cards) ? setupPreview.cards.slice(0, 4) : [];
  const boardStandings = Array.isArray(visualBoard?.standings) ? visualBoard.standings.slice(0, 4) : [];
  const boardStandingsStatus = visualBoard?.standingsStatus || null;
  const boardStandingsStatusLabel = boardStandingsStatus?.progressLabel || (boardStandings.length ? "Classificação oficial" : "Aguardando classificação");
  const boardStandingsStatusDetail = boardStandingsStatus?.detailLabel || "Somente confrontos finalizados entram na tabela.";
  const boardMatches = Array.isArray(visualBoard?.matches) ? visualBoard.matches.slice(0, 2) : [];
  const boardByes = Array.isArray(visualBoard?.byes) ? visualBoard.byes.slice(0, 2) : [];
  const playoffPreview = visualBoard?.playoffPreview || null;
  const playoffMatches = Array.isArray(playoffPreview?.matches) ? playoffPreview.matches.slice(0, 3) : [];
  const playoffRules = Array.isArray(playoffPreview?.rules) ? playoffPreview.rules.slice(0, 4) : [];
  const scheduleSummary = model?.scheduleSummary || visualBoard?.scheduleSummary || (helper && typeof helper.buildTeamBattleScheduleAutonomySummary === "function"
    ? helper.buildTeamBattleScheduleAutonomySummary(tournament || {}, { leagueMode: "basic_single_division" })
    : null);
  const scheduleCards = Array.isArray(scheduleSummary?.cards) ? scheduleSummary.cards.slice(0, 4) : [];
  const scheduleRules = Array.isArray(scheduleSummary?.rules) ? scheduleSummary.rules.slice(0, 4) : [];

  return `
    <section class="organizer-admin-team-battle-preview" aria-label="Prévia administrativa Team Battle League 4v4">
      <div class="organizer-admin-team-battle-preview__head">
        <div>
          <span class="organizer-admin-eyebrow">Prévia visual 4v4</span>
          <strong>Team Battle League 4v4</strong>
          <p>Prévia administrativa do formato. A versão básica usa Divisão Única e só deve preencher equipes reais após o check-in.</p>
        </div>
        <span>${sbwOrganizerEditorEscape(metadata.status === "beta" ? "Beta controlado" : model?.badge?.label || "Em preparação")}</span>
      </div>

      <div class="organizer-admin-team-battle-cards">
        ${cards.slice(0, 4).map((card) => `
          <article>
            <small>${sbwOrganizerEditorEscape(card.label || "Item")}</small>
            <strong>${sbwOrganizerEditorEscape(card.value || "—")}</strong>
            <p>${sbwOrganizerEditorEscape(card.description || "Preparado para etapa futura.")}</p>
          </article>
        `).join("")}
      </div>

      <div class="organizer-admin-team-battle-modes">
        ${modes.slice(0, 2).map((mode) => `
          <article class="${mode.recommendedFirstRelease ? "is-recommended" : ""}">
            <small>${sbwOrganizerEditorEscape(mode.shortLabel || mode.status || "Modo")}</small>
            <strong>${sbwOrganizerEditorEscape(mode.divisionModel || mode.title || "Modo")}</strong>
            <p>${sbwOrganizerEditorEscape(mode.description || "Modelo planejado para a liga.")}</p>
          </article>
        `).join("")}
      </div>

      ${Array.isArray(rulebook?.scoreModel) ? `
        <div class="organizer-admin-team-battle-score">
          ${rulebook.scoreModel.map((slot) => `
            <span><strong>${sbwOrganizerEditorEscape(slot.points || 0)}</strong>${sbwOrganizerEditorEscape(slot.label || "Partida")}${slot.conditional ? " · se empate" : ""}</span>
          `).join("")}
        </div>
      ` : ""}

      <div class="organizer-admin-team-battle-ops" aria-label="Fluxo operacional planejado do Team Battle League 4v4">
        ${operations.map((item) => `
          <article>
            <small>${sbwOrganizerEditorEscape(item.label)}</small>
            <strong>${sbwOrganizerEditorEscape(item.value)}</strong>
            <p>${sbwOrganizerEditorEscape(item.detail)}</p>
          </article>
        `).join("")}
      </div>

      ${scheduleSummary ? `
        <div class="organizer-admin-team-battle-schedule" aria-label="Agenda livre de partidas Team Battle League 4v4">
          <div class="organizer-admin-team-battle-schedule__head">
            <div>
              <small>${sbwOrganizerEditorEscape(scheduleSummary.badge || "Controle do organizador")}</small>
              <strong>${sbwOrganizerEditorEscape(scheduleSummary.title || "Agenda livre de partidas")}</strong>
              <p>${sbwOrganizerEditorEscape(scheduleSummary.description || "Datas e horários dos confrontos são definidos pelo organizador.")}</p>
            </div>
            <span>${sbwOrganizerEditorEscape(scheduleSummary.timezone || "America/Sao_Paulo")}</span>
          </div>
          <div class="organizer-admin-team-battle-schedule__grid">
            ${(scheduleCards.length ? scheduleCards : [
              { label: "Tipo", value: "Livre por confronto", detail: "Cada rodada/confronto pode ter agenda própria." },
              { label: "Controle", value: "Organizador", detail: "Remarcações não dependem do formato rápido." }
            ]).map((card) => `
              <article>
                <small>${sbwOrganizerEditorEscape(card.label || "Item")}</small>
                <strong>${sbwOrganizerEditorEscape(card.value || "—")}</strong>
                <p>${sbwOrganizerEditorEscape(card.detail || "Gerenciado pelo organizador.")}</p>
              </article>
            `).join("")}
          </div>
          <div class="organizer-admin-team-battle-schedule__rules">
            ${(scheduleRules.length ? scheduleRules : ["Datas por rodada/confronto", "Remarcação livre pelo organizador", "Data inicial é referência pública", "Resultados alimentam a classificação"]).map((rule) => `<span>${sbwOrganizerEditorEscape(rule)}</span>`).join("")}
          </div>
        </div>
      ` : ""}

      ${mvpModel ? `
        <div class="organizer-admin-team-battle-mvp" aria-label="MVP básico Team Battle League 4v4">
          <div class="organizer-admin-team-battle-mvp__head">
            <div>
              <small>${sbwOrganizerEditorEscape(mvpModel.releaseLabel || "Liberação controlada")}</small>
              <strong>${sbwOrganizerEditorEscape(mvpModel.title || "MVP básico Team Battle League 4v4")}</strong>
              <p>${sbwOrganizerEditorEscape(mvpModel.summary || "Primeira liberação planejada com divisão única.")}</p>
            </div>
            <span>${sbwOrganizerEditorEscape(mvpModel.statusLabel || "Preparando MVP")}</span>
          </div>
          <div class="organizer-admin-team-battle-mvp__grid">
            ${mvpCards.map((card) => `
              <article>
                <small>${sbwOrganizerEditorEscape(card.label || "Item")}</small>
                <strong>${sbwOrganizerEditorEscape(card.value || "—")}</strong>
                <p>${sbwOrganizerEditorEscape(card.detail || "Preparado para teste real controlado.")}</p>
              </article>
            `).join("")}
          </div>
          <div class="organizer-admin-team-battle-mvp__checks">
            ${mvpRequired.map((item) => `
              <span class="${item.ok ? "is-ok" : "is-pending"}">
                <small>${item.ok ? "OK" : "Pendente"}</small>
                ${sbwOrganizerEditorEscape(item.label || "Requisito")} · ${sbwOrganizerEditorEscape(item.current ?? 0)}/${sbwOrganizerEditorEscape(item.required ?? 1)}
              </span>
            `).join("")}
          </div>
          <p>${sbwOrganizerEditorEscape(mvpModel.nextAction || "Executar teste real controlado com equipes reais.")}</p>
        </div>
      ` : ""}

      ${setupPreview ? `
        <div class="organizer-admin-team-battle-setup" aria-label="Configuração do MVP básico Team Battle League 4v4">
          <div class="organizer-admin-team-battle-setup__head">
            <div>
              <small>${sbwOrganizerEditorEscape(setupPreview.badge || "Configuração visual")}</small>
              <strong>${sbwOrganizerEditorEscape(setupPreview.label || "Configuração do MVP básico")}</strong>
              <p>${sbwOrganizerEditorEscape(setupPreview.previewNote || "Configuração sem equipes demo. A tabela pública fica vazia até o check-in.")}</p>
            </div>
            <span>${setupPreview.ready ? "Pronto" : "Revisar"}</span>
          </div>
          <div class="organizer-admin-team-battle-setup__cards">
            ${setupCards.map((card) => `
              <article>
                <small>${sbwOrganizerEditorEscape(card.label || "Item")}</small>
                <strong>${sbwOrganizerEditorEscape(card.value || "—")}</strong>
                <p>${sbwOrganizerEditorEscape(card.detail || "Preparado para validação controlada.")}</p>
              </article>
            `).join("")}
          </div>
          <div class="organizer-admin-team-battle-setup__fields">
            ${setupFields.map((field) => `
              <span class="${field.locked ? "is-locked" : "is-editable"}">
                <small>${field.locked ? "Travado" : "Configurável"}</small>
                ${sbwOrganizerEditorEscape(field.label || "Campo")}: <strong>${sbwOrganizerEditorEscape(field.value ?? "—")}</strong>
              </span>
            `).join("")}
          </div>
          ${Array.isArray(setupPreview.warnings) && setupPreview.warnings.length ? `<p>${sbwOrganizerEditorEscape(setupPreview.warnings[0])}</p>` : ""}
        </div>
      ` : ""}

      ${visualBoard ? `
        <div class="organizer-admin-team-battle-board" aria-label="Prévia administrativa da divisão única">
          <div class="organizer-admin-team-battle-board__head">
            <div>
              <small>Prévia da liga básica</small>
              <strong>${sbwOrganizerEditorEscape(visualBoard.divisionName || "Divisão única")}</strong>
            </div>
            <span>${sbwOrganizerEditorEscape(visualBoard.leagueModeLabel || "Básica · divisão única")}</span>
          </div>
          <div class="organizer-admin-team-battle-board__grid">
            <div class="organizer-admin-team-battle-standings-preview">
              <strong>Classificação oficial</strong>
              <small class="organizer-admin-team-battle-standings-status">${sbwOrganizerEditorEscape(boardStandingsStatusLabel)} · ${sbwOrganizerEditorEscape(boardStandingsStatusDetail)}</small>
              ${boardStandings.length ? boardStandings.map((row, index) => `
                <div>
                  <span>${sbwOrganizerEditorEscape(row.position || index + 1)}º</span>
                  <strong>${sbwOrganizerEditorEscape(row.teamName || row.name || "Equipe confirmada")}</strong>
                  <small>${sbwOrganizerEditorEscape(row.battlePoints || 0)} pts · ${sbwOrganizerEditorEscape(row.teamMatchWins || 0)}V · ${sbwOrganizerEditorEscape(row.played || 0)}J</small>
                </div>
              `).join("") : `<p>As equipes reais confirmadas aparecerão aqui após o check-in.</p>`}
            </div>
            <div class="organizer-admin-team-battle-round-preview">
              <strong>Rodada inicial</strong>
              ${(boardMatches.length || boardByes.length) ? `
                ${boardMatches.map((match) => `
                  <article>
                    <small>${sbwOrganizerEditorEscape(match.label || "Confronto")}</small>
                    <div><span>${sbwOrganizerEditorEscape(match.homeTeamName || "Equipe confirmada")}</span><em>vs</em><span>${sbwOrganizerEditorEscape(match.awayTeamName || "Equipe confirmada")}</span></div>
                    <p>${sbwOrganizerEditorEscape(match.statusLabel || "A definir")}</p>
                  </article>
                `).join("")}
                ${boardByes.map((bye) => `
                  <article class="is-bye">
                    <small>${sbwOrganizerEditorEscape(bye.label || "Folga da rodada")}</small>
                    <div><span>${sbwOrganizerEditorEscape(bye.teamLabel || bye.teamName || "Equipe em folga")}</span><em>folga</em><span>sem equipe fake</span></div>
                    <p>${sbwOrganizerEditorEscape(bye.description || "Folga técnica quando a quantidade confirmada de equipes for ímpar.")}</p>
                  </article>
                `).join("")}
              ` : `<p>Os confrontos serão gerados quando houver equipes reais confirmadas.</p>`}
            </div>
          </div>
        </div>
      ` : ""}

      ${playoffPreview ? `
        <div class="organizer-admin-team-battle-playoffs" aria-label="Playoffs -SBW- do Team Battle League 4v4">
          <div class="organizer-admin-team-battle-playoffs__head">
            <div>
              <small>${sbwOrganizerEditorEscape(playoffPreview.rulesetLabel || "-SBW- · escada Top 4")}</small>
              <strong>${sbwOrganizerEditorEscape(playoffPreview.title || "Playoffs -SBW-")}</strong>
              <p>${sbwOrganizerEditorEscape(playoffPreview.description || "Fase final calculada a partir da classificação real.")}</p>
            </div>
            <span>${sbwOrganizerEditorEscape(playoffPreview.statusLabel || "Aguardando classificação")}</span>
          </div>
          <div class="organizer-admin-team-battle-playoffs__grid">
            ${playoffMatches.length ? playoffMatches.map((match) => `
              <article>
                <small>${sbwOrganizerEditorEscape(match.stageLabel || "Playoff")}</small>
                <strong>${sbwOrganizerEditorEscape(match.firstToLabel || "FT")}</strong>
                <div><span>${sbwOrganizerEditorEscape(match.homeTeamLabel || "Classificado")}</span><em>vs</em><span>${sbwOrganizerEditorEscape(match.awayTeamLabel || "Classificado")}</span></div>
                <p>${sbwOrganizerEditorEscape(match.statusLabel || "Aguardando")} · ${sbwOrganizerEditorEscape(match.noExtraMatch ? "sem partida extra" : "com partida extra")}</p>
              </article>
            `).join("") : `
              <article>
                <small>${sbwOrganizerEditorEscape(playoffPreview.emptyState?.title || "Aguardando Top 4")}</small>
                <strong>3º x 4º → 2º → 1º</strong>
                <p>${sbwOrganizerEditorEscape(playoffPreview.emptyState?.description || "Os playoffs aparecem quando a classificação da Divisão Única estiver pronta.")}</p>
              </article>
            `}
          </div>
          <div class="organizer-admin-team-battle-playoffs__rules">
            ${(playoffRules.length ? playoffRules : ["Quartas/Semifinal FT50", "Grande Final FT70", "Sem partida extra", "Escalação com uso obrigatório do elenco"]).map((rule) => `<span>${sbwOrganizerEditorEscape(rule)}</span>`).join("")}
          </div>
        </div>
      ` : ""}

      ${testGates.length ? `
        <div class="organizer-admin-team-battle-test-gates" aria-label="Etapas do teste controlado Team Battle League 4v4">
          <div class="organizer-admin-team-battle-test-gates__head">
            <div>
              <small>Teste real controlado</small>
              <strong>${sbwOrganizerEditorEscape(testPackage?.releaseLabel || "Teste real controlado")}</strong>
            </div>
            <span>${sbwOrganizerEditorEscape(testPackage?.modeLabel || "Básica · divisão única")}</span>
          </div>
          <div class="organizer-admin-team-battle-test-gates__grid">
            ${testGates.map((gate) => `
              <article class="is-${sbwOrganizerEditorEscape(gate.status || "pending")}">
                <small>${sbwOrganizerEditorEscape(gate.stateLabel || "Pendente")}</small>
                <strong>${sbwOrganizerEditorEscape(gate.label || "Etapa")}</strong>
                <p>${sbwOrganizerEditorEscape(gate.description || "Preparado para teste real controlado.")}</p>
              </article>
            `).join("")}
          </div>
        </div>
      ` : ""}

      ${realTestChecks.length ? `
        <div class="organizer-admin-team-battle-test-gates" aria-label="Checklist para teste real Team Battle League 4v4">
          <div class="organizer-admin-team-battle-test-gates__head">
            <div>
              <small>Checklist fim de semana</small>
              <strong>${sbwOrganizerEditorEscape(realTestChecklist?.statusLabel || "Pronto para teste real controlado")}</strong>
            </div>
            <span>${sbwOrganizerEditorEscape(`${realTestChecklist?.readyCount || 0}/${realTestChecklist?.totalChecks || realTestChecks.length}`)} OK</span>
          </div>
          <div class="organizer-admin-team-battle-test-gates__grid">
            ${realTestChecks.map((check) => `
              <article class="is-${check.ok ? "ready" : "pending"}">
                <small>${check.ok ? "OK" : "Revisar"}</small>
                <strong>${sbwOrganizerEditorEscape(check.label || "Item")}</strong>
                <p>${sbwOrganizerEditorEscape(check.detail || "Validar durante o teste real.")}</p>
              </article>
            `).join("")}
          </div>
        </div>
      ` : ""}

      <div class="organizer-admin-team-battle-release-checks" aria-label="Checklist de liberação do formato">
        ${releaseChecks.map((item) => `<span>${sbwOrganizerEditorEscape(item)}</span>`).join("")}
      </div>

      <p class="organizer-admin-format-preview__warning">${sbwOrganizerEditorEscape(model?.lockedMessage || "Beta controlado. A configuração aparece na criação; depois de criado, o torneio mostra a Divisão Única vazia até o check-in confirmar equipes reais. Os playoffs -SBW- ficam aguardando a classificação real.")}</p>
    </section>
  `;
}

function sbwOrganizerEditorRenderFormatPreview(formatValue = sbwOrganizerTournamentEditFormat?.value) {
  if (!sbwOrganizerTournamentEditFormatPreview) return;

  const metadata = sbwOrganizerEditorGetFormatMetadata(formatValue || "double-elimination");
  const features = Array.isArray(metadata.features) ? metadata.features.slice(0, 5) : [];
  const requirements = Array.isArray(metadata.requirements) ? metadata.requirements.slice(0, 5) : [];
  const statusLabel = metadata.status === "planned" ? "Em preparação" : metadata.status === "beta" ? "Beta controlado" : metadata.status === "active" ? "Disponível" : "Customizado";
  const categoryLabel = metadata.category === "advanced" ? "Formato avançado" : metadata.category === "core" ? "Formato base" : "Formato customizado";
  const unavailableReason = sbwOrganizerEditorIsFormatAvailableForSave(formatValue || "double-elimination")
    ? ""
    : sbwOrganizerEditorGetFormatBlockReason(formatValue || metadata.key);

  sbwOrganizerTournamentEditFormatPreview.innerHTML = `
    <div class="organizer-admin-format-preview__head">
      <div>
        <span class="organizer-admin-eyebrow">Formato competitivo</span>
        <strong>${sbwOrganizerEditorEscape(metadata.label || "Formato")}</strong>
      </div>
      <span>${sbwOrganizerEditorEscape(categoryLabel)} · ${sbwOrganizerEditorEscape(statusLabel)}</span>
    </div>
    ${metadata.description ? `<p>${sbwOrganizerEditorEscape(metadata.description)}</p>` : ""}
    ${features.length ? `<div class="organizer-admin-format-preview__chips">${features.map((item) => `<span>${sbwOrganizerEditorEscape(item)}</span>`).join("")}</div>` : ""}
    ${requirements.length ? `
      <ul>
        ${requirements.map((item) => `<li>${sbwOrganizerEditorEscape(item)}</li>`).join("")}
      </ul>
    ` : ""}
    ${sbwOrganizerEditorRenderTeamBattleFormatPanel(formatValue)}
    ${unavailableReason ? `<p class="organizer-admin-format-preview__warning">${sbwOrganizerEditorEscape(unavailableReason)}</p>` : ""}
  `;
}

function sbwOrganizerEditorClampNumber(value, min, max, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, number));
}

function sbwOrganizerEditorApplyTournamentCapacityMode(formatValue = sbwOrganizerTournamentEditFormat?.value || "") {
  if (!sbwOrganizerTournamentEditMax) return;

  const isTeamBattle = sbwOrganizerEditorIsTeamBattleLeague4v4Format(formatValue);
  sbwOrganizerTournamentEditMax.min = "2";
  sbwOrganizerTournamentEditMax.max = "256";
  sbwOrganizerTournamentEditMax.step = "2";
  sbwOrganizerTournamentEditMax.placeholder = isTeamBattle ? "Ex: 8 equipes" : "Ex: 32";

  if (sbwOrganizerTournamentEditMaxLabel) {
    sbwOrganizerTournamentEditMaxLabel.textContent = isTeamBattle ? "Limite de equipes" : "Limite de participantes";
  }

  if (sbwOrganizerTournamentEditMaxNote) {
    sbwOrganizerTournamentEditMaxNote.textContent = isTeamBattle
      ? "No Team Battle League 4v4, este campo representa equipes reais. Use sempre número par; se a quantidade final confirmada for ímpar, a tabela/bracket aplica bye/encaixe conforme planejado."
      : "Use capacidade em número par. Se o torneio terminar com número ímpar de inscritos reais, a bracket usa bye/encaixe normalmente.";
  }

  if (String(sbwOrganizerTournamentEditMax.value || "").trim()) {
    const normalized = sbwOrganizerEditorNormalizeEvenCapacity(sbwOrganizerTournamentEditMax.value, {
      fallback: isTeamBattle ? 8 : 32
    });
    if (String(normalized) !== String(sbwOrganizerTournamentEditMax.value)) {
      sbwOrganizerTournamentEditMax.value = normalized;
    }
  }
}

function sbwOrganizerEditorGetTournamentCapacityInputValue(formatValue = sbwOrganizerTournamentEditFormat?.value || "") {
  const normalized = sbwOrganizerEditorNormalizeEvenCapacity(sbwOrganizerTournamentEditMax?.value, {
    fallback: sbwOrganizerEditorIsTeamBattleLeague4v4Format(formatValue) ? 8 : 32
  });

  if (sbwOrganizerTournamentEditMax) {
    sbwOrganizerTournamentEditMax.value = normalized;
  }

  return normalized;
}

function sbwOrganizerEditorBuildTeamBattleLeagueSettings(formatValue, context = {}) {
  if (!sbwOrganizerEditorIsTeamBattleLeague4v4Format(formatValue)) return null;

  const helper = window.SBWTeamBattleLeague;

  if (helper && typeof helper.buildTeamBattleLeagueBasicControlledCreationPayload === "function") {
    return helper.buildTeamBattleLeagueBasicControlledCreationPayload(context, {
      leagueMode: "basic_single_division"
    });
  }

  const createdAt = new Date().toISOString();
  const payload = {
    enabled: true,
    formatKey: SBW_ORGANIZER_TEAM_BATTLE_4V4_FORMAT,
    schemaVersion: "tbleague4v4.v1",
    status: "beta_controlled",
    leagueMode: "basic_single_division",
    divisionName: "Divisão Única",
    source: "real_checkin_only",
    realTeamsOnly: true,
    publicMoldBeforeCheckin: true,
    checkinRequiredBeforeTeams: true,
    teamSize: 4,
    startersPerTeamMatch: 3,
    reservePerTeamMatch: 1,
    mainMatchPointsBySlot: [10, 10, 20],
    defaultExtraMatchPoints: 10,
    createdAt
  };

  return {
    settings: payload,
    metadata: {
      ...payload,
      title: context.title || "",
      game: context.game || "",
      organizerName: context.organizerName || ""
    }
  };
}

function sbwOrganizerEditorStyleAttribute(...parts) {
  const value = parts.filter(Boolean).join(" ").trim();
  return value ? `style="${sbwOrganizerEditorEscape(value)}"` : "";
}

function sbwOrganizerEditorGetAssetLabel(assetType) {
  return assetType === "banner" ? "banner" : "logo";
}

function sbwOrganizerEditorGetAssetMaxBytes(assetType) {
  return assetType === "banner"
    ? sbwOrganizerEditorAssetConfig.bannerMaxBytes
    : sbwOrganizerEditorAssetConfig.logoMaxBytes;
}

function sbwOrganizerEditorFormatBytes(bytes) {
  const safeBytes = Number(bytes || 0);
  if (safeBytes >= 1024 * 1024) {
    return `${(safeBytes / (1024 * 1024)).toFixed(1).replace(".0", "")} MB`;
  }

  return `${Math.max(1, Math.round(safeBytes / 1024))} KB`;
}

function sbwOrganizerEditorGetFileExtension(file) {
  const byName = String(file?.name || "").split(".").pop().toLowerCase();

  if (["png", "jpg", "jpeg", "webp"].includes(byName)) {
    return byName === "jpeg" ? "jpg" : byName;
  }

  if (file?.type === "image/png") return "png";
  if (file?.type === "image/webp") return "webp";

  return "jpg";
}

function sbwOrganizerEditorGetOrganizerAssets(organizer = sbwOrganizerEditorCurrent) {
  const metadata = sbwOrganizerEditorAsObject(organizer?.metadata);
  const assets =
    organizer?.organizerAssets ||
    metadata.organizerAssets ||
    metadata.organizer_assets ||
    metadata.assetFrames ||
    {};

  return sbwOrganizerEditorAsObject(assets);
}

function sbwOrganizerEditorGetAssetFrame(organizer, assetType) {
  const assets = sbwOrganizerEditorGetOrganizerAssets(organizer);
  const raw = sbwOrganizerEditorAsObject(
    assets[assetType] ||
    assets[assetType === "logo" ? "avatar" : assetType] ||
    {}
  );
  const nestedFrame = sbwOrganizerEditorAsObject(raw.frame || raw.framing || raw.crop || raw.position);
  const source = Object.keys(nestedFrame).length ? { ...raw, ...nestedFrame } : raw;

  const defaultPositionY = assetType === "banner" ? 46 : 50;

  return {
    positionX: sbwOrganizerEditorClampNumber(source.positionX ?? source.x ?? source.objectPositionX, 0, 100, 50),
    positionY: sbwOrganizerEditorClampNumber(source.positionY ?? source.y ?? source.objectPositionY, 0, 100, defaultPositionY),
    zoom: sbwOrganizerEditorClampNumber(source.zoom ?? source.scale ?? source.size, 100, assetType === "banner" ? 180 : 160, 100)
  };
}

function sbwOrganizerEditorGetAssetFrameStyle(organizer, assetType) {
  const frame = sbwOrganizerEditorGetAssetFrame(organizer, assetType);

  if (assetType === "banner") {
    const scale = Math.max(1, frame.zoom / 100).toFixed(2);
    return [
      `--org-editor-banner-x:${frame.positionX}%`,
      `--org-editor-banner-y:${frame.positionY}%`,
      `--org-editor-banner-scale:${scale}`
    ].join("; ");
  }

  return [
    `--org-editor-logo-x:${frame.positionX}%`,
    `--org-editor-logo-y:${frame.positionY}%`,
    `--org-editor-logo-scale:${Math.max(1, frame.zoom / 100).toFixed(2)}`
  ].join("; ");
}

function sbwOrganizerEditorGetAssetFrameForm(assetType) {
  const controls = document.querySelector(`[data-organizer-asset-frame-group="${assetType}"]`);

  if (!controls) {
    return sbwOrganizerEditorGetAssetFrame(sbwOrganizerEditorCurrent, assetType);
  }

  const defaultPositionY = assetType === "banner" ? 46 : 50;

  return {
    positionX: sbwOrganizerEditorClampNumber(controls.querySelector(`[data-organizer-asset-frame="positionX"]`)?.value, 0, 100, 50),
    positionY: sbwOrganizerEditorClampNumber(controls.querySelector(`[data-organizer-asset-frame="positionY"]`)?.value, 0, 100, defaultPositionY),
    zoom: sbwOrganizerEditorClampNumber(controls.querySelector(`[data-organizer-asset-frame="zoom"]`)?.value, 100, assetType === "banner" ? 180 : 160, 100)
  };
}

function sbwOrganizerEditorSetAssetFrameForm(assetType, frame) {
  const controls = document.querySelector(`[data-organizer-asset-frame-group="${assetType}"]`);
  if (!controls) return;

  const safeFrame = {
    positionX: sbwOrganizerEditorClampNumber(frame?.positionX, 0, 100, 50),
    positionY: sbwOrganizerEditorClampNumber(frame?.positionY, 0, 100, 50),
    zoom: sbwOrganizerEditorClampNumber(frame?.zoom, 100, assetType === "banner" ? 180 : 160, 100)
  };

  const xInput = controls.querySelector(`[data-organizer-asset-frame="positionX"]`);
  const yInput = controls.querySelector(`[data-organizer-asset-frame="positionY"]`);
  const zoomInput = controls.querySelector(`[data-organizer-asset-frame="zoom"]`);

  if (xInput) xInput.value = String(Math.round(safeFrame.positionX));
  if (yInput) yInput.value = String(Math.round(safeFrame.positionY));
  if (zoomInput) zoomInput.value = String(Math.round(safeFrame.zoom));

  sbwOrganizerEditorUpdateAssetFrameOutputs(assetType, safeFrame);
}

function sbwOrganizerEditorUpdateAssetFrameOutputs(assetType, frame) {
  const controls = document.querySelector(`[data-organizer-asset-frame-group="${assetType}"]`);
  if (!controls) return;

  const zoomOutput = controls.querySelector(`[data-organizer-asset-frame-output="zoom"]`);
  const xOutput = controls.querySelector(`[data-organizer-asset-frame-output="positionX"]`);
  const yOutput = controls.querySelector(`[data-organizer-asset-frame-output="positionY"]`);

  if (zoomOutput) zoomOutput.textContent = `${Math.round(frame.zoom)}%`;
  if (xOutput) xOutput.textContent = `${Math.round(frame.positionX)}%`;
  if (yOutput) yOutput.textContent = `${Math.round(frame.positionY)}%`;
}

function sbwOrganizerEditorSetAssetFeedback(assetType, message, status) {
  document.querySelectorAll(`[data-organizer-asset-feedback="${assetType}"], [data-organizer-asset-frame-feedback="${assetType}"]`).forEach((feedback) => {
    feedback.textContent = message || "";
    feedback.classList.remove("is-error", "is-success", "is-loading");
    if (status) feedback.classList.add(`is-${status}`);
  });
}

function sbwOrganizerEditorSetAssetUploading(assetType, isUploading) {
  document.querySelectorAll(`[data-organizer-asset-input="${assetType}"]`).forEach((input) => {
    input.disabled = Boolean(isUploading);
  });

  document.querySelectorAll(`[data-organizer-asset-trigger="${assetType}"]`).forEach((label) => {
    label.classList.toggle("is-uploading", Boolean(isUploading));
    label.setAttribute("aria-busy", isUploading ? "true" : "false");
  });
}

function sbwOrganizerEditorValidateAssetFile(file, assetType) {
  if (!file) {
    return `Selecione uma imagem para alterar o ${sbwOrganizerEditorGetAssetLabel(assetType)}.`;
  }

  if (!sbwOrganizerEditorAssetConfig.allowedTypes.includes(file.type)) {
    return "Formato inválido. Use PNG, JPG ou WebP.";
  }

  const maxBytes = sbwOrganizerEditorGetAssetMaxBytes(assetType);
  if (file.size > maxBytes) {
    return `Arquivo muito grande. O limite para ${sbwOrganizerEditorGetAssetLabel(assetType)} é ${sbwOrganizerEditorFormatBytes(maxBytes)}.`;
  }

  return "";
}

function sbwOrganizerEditorGetSafeAssetOrganizerKey() {
  const raw =
    sbwOrganizerEditorCurrent?.slug ||
    sbwOrganizerEditorCurrent?.id ||
    sbwOrganizerEditorSlug ||
    sbwOrganizerEditorGetField("organizerName")?.value ||
    "organizer";

  return String(raw || "organizer")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80) || "organizer";
}

function sbwOrganizerEditorBuildAssetPath(file, assetType) {
  const organizerKey = sbwOrganizerEditorGetSafeAssetOrganizerKey();
  const extension = sbwOrganizerEditorGetFileExtension(file);
  const randomSuffix = Math.random().toString(36).slice(2, 8);
  return `organizers/${organizerKey}/${assetType}/${assetType}-${Date.now()}-${randomSuffix}.${extension}`;
}

function sbwOrganizerEditorGetSupabaseStorageClient() {
  return window.SBWSupabase?.client?.storage || null;
}

async function sbwOrganizerEditorUploadAssetToSupabase(file, assetType) {
  const storageClient = sbwOrganizerEditorGetSupabaseStorageClient();

  if (!storageClient) {
    throw new Error("Supabase Storage indisponível nesta sessão.");
  }

  const path = sbwOrganizerEditorBuildAssetPath(file, assetType);
  const bucket = storageClient.from(sbwOrganizerEditorAssetConfig.bucket);
  const uploadResult = await bucket.upload(path, file, {
    cacheControl: "3600",
    contentType: file.type,
    upsert: false
  });

  if (uploadResult.error) {
    throw uploadResult.error;
  }

  const publicUrlResult = bucket.getPublicUrl(path);
  const publicUrl = publicUrlResult?.data?.publicUrl || "";

  if (!publicUrl) {
    throw new Error("Upload concluído, mas não foi possível gerar a URL pública.");
  }

  return publicUrl;
}

function sbwOrganizerEditorGetAssetUrl(assetType) {
  const fieldId = assetType === "banner" ? "organizerBannerUrl" : "organizerLogoUrl";
  return sbwOrganizerEditorGetField(fieldId)?.value.trim() || "";
}

function sbwOrganizerEditorSetAssetUrl(assetType, value) {
  const url = String(value || "").trim();
  const hiddenId = assetType === "banner" ? "organizerBannerUrl" : "organizerLogoUrl";
  const manualId = assetType === "banner" ? "organizerBannerUrlManual" : "organizerLogoUrlManual";
  const hidden = sbwOrganizerEditorGetField(hiddenId);
  const manual = sbwOrganizerEditorGetField(manualId);

  if (hidden) hidden.value = url;
  if (manual) manual.value = url;
}

function sbwOrganizerEditorBuildAssetMetadataPatch(assetType, extra = {}) {
  const frame = sbwOrganizerEditorGetAssetFrameForm(assetType);
  return {
    [assetType]: {
      ...frame,
      ...extra,
      updatedAt: new Date().toISOString()
    }
  };
}

async function sbwOrganizerEditorSaveMediaPatch(payload) {
  const client = window.SBWSupabase?.client;

  if (!client?.rpc) {
    throw new Error("Sessão Supabase indisponível para salvar mídia do organizador.");
  }

  const organizerKey = sbwOrganizerEditorCurrent?.slug || sbwOrganizerEditorSlug || sbwOrganizerEditorCurrent?.id || "";

  if (!organizerKey || sbwOrganizerEditorIsNew) {
    throw new Error("Salve a organização uma vez antes de enviar ou enquadrar imagens.");
  }

  const result = await client.rpc("sbw_update_tournament_organizer_media", {
    p_slug: organizerKey,
    p_payload: payload
  });

  if (result.error) {
    throw result.error;
  }

  const organizer = result.data?.organizer || result.data?.data || result.data || null;

  if (organizer) {
    const normalized = typeof sbwNormalizeSupabaseTournamentOrganizer === "function"
      ? sbwNormalizeSupabaseTournamentOrganizer(organizer)
      : organizer;

    sbwOrganizerEditorCurrent = {
      ...(sbwOrganizerEditorCurrent || {}),
      ...(normalized || {})
    };
    sbwOrganizerEditorSlug = sbwOrganizerEditorCurrent.slug || sbwOrganizerEditorSlug;
  }

  return result.data;
}

async function sbwOrganizerEditorSaveAssetUrl(assetType, publicUrl) {
  const urlKey = assetType === "banner" ? "bannerUrl" : "logoUrl";
  const framePatch = sbwOrganizerEditorBuildAssetMetadataPatch(assetType, { url: publicUrl });

  try {
    await sbwOrganizerEditorSaveMediaPatch({
      [urlKey]: publicUrl,
      organizerAssets: framePatch
    });
  } catch (error) {
    console.warn("[SBW Organizadores] RPC dedicada de mídia falhou, tentando salvar pelo formulário principal:", error);

    if (typeof sbwUpdateTournamentOrganizerProfileAsync !== "function") {
      throw error;
    }

    const fallbackResult = await sbwUpdateTournamentOrganizerProfileAsync(
      sbwOrganizerEditorSlug || sbwOrganizerEditorCurrent?.slug,
      sbwOrganizerEditorReadForm()
    );

    if (fallbackResult?.organizer) {
      sbwOrganizerEditorCurrent = fallbackResult.organizer;
      sbwOrganizerEditorSlug = fallbackResult.organizer.slug || sbwOrganizerEditorSlug;
    }
  }
}

async function sbwOrganizerEditorSaveAssetFrame(assetType) {
  const framePatch = sbwOrganizerEditorBuildAssetMetadataPatch(assetType, {
    url: sbwOrganizerEditorGetAssetUrl(assetType)
  });

  try {
    sbwOrganizerEditorSetAssetFeedback(assetType, "Salvando enquadramento...", "loading");
    await sbwOrganizerEditorSaveMediaPatch({ organizerAssets: framePatch });
    sbwOrganizerEditorSetAssetFrameEditMode(assetType, false);
    sbwOrganizerEditorSetAssetFeedback(assetType, "Enquadramento salvo.", "success");
  } catch (error) {
    console.error("[SBW Organizadores] Falha ao salvar enquadramento:", error);
    sbwOrganizerEditorSetAssetFeedback(assetType, error?.message || "Não foi possível salvar o enquadramento.", "error");
  }
}

function sbwOrganizerEditorApplyAssetFramePreview(assetType) {
  const frame = sbwOrganizerEditorGetAssetFrameForm(assetType);
  sbwOrganizerEditorUpdateAssetFrameOutputs(assetType, frame);

  if (assetType === "banner") {
    document.querySelectorAll(`[data-organizer-asset-preview="banner"], .organizer-admin-preview-cover`).forEach((element) => {
      element.style.setProperty("--org-editor-banner-x", `${frame.positionX}%`);
      element.style.setProperty("--org-editor-banner-y", `${frame.positionY}%`);
      element.style.setProperty("--org-editor-banner-scale", Math.max(1, frame.zoom / 100).toFixed(2));
    });
    return;
  }

  document.querySelectorAll(`[data-organizer-asset-preview="logo"], .organizer-admin-preview-logo`).forEach((element) => {
    element.style.setProperty("--org-editor-logo-x", `${frame.positionX}%`);
    element.style.setProperty("--org-editor-logo-y", `${frame.positionY}%`);
    element.style.setProperty("--org-editor-logo-scale", Math.max(1, frame.zoom / 100).toFixed(2));
  });
}

function sbwOrganizerEditorRenderProfileMediaPreview() {
  const bannerUrl = sbwOrganizerEditorGetAssetUrl("banner");
  const logoUrl = sbwOrganizerEditorGetAssetUrl("logo");
  const name = sbwOrganizerEditorGetField("organizerName")?.value.trim() || "Organizador";
  const initials = sbwOrganizerEditorGetInitials({
    name,
    tag: sbwOrganizerEditorGetField("organizerTag")?.value.trim()
  });

  document.querySelectorAll(`[data-organizer-asset-preview="banner"]`).forEach((element) => {
    element.classList.toggle("has-image", Boolean(bannerUrl));
    element.innerHTML = bannerUrl
      ? `<img src="${sbwOrganizerEditorEscape(bannerUrl)}" alt="Prévia do banner">`
      : `<span>Prévia do banner</span>`;
    element.setAttribute("style", sbwOrganizerEditorGetAssetFrameStyle(sbwOrganizerEditorCurrent, "banner"));
  });

  document.querySelectorAll(`[data-organizer-asset-preview="logo"]`).forEach((element) => {
    element.classList.toggle("has-image", Boolean(logoUrl));
    element.innerHTML = logoUrl
      ? `<img src="${sbwOrganizerEditorEscape(logoUrl)}" alt="Logo ${sbwOrganizerEditorEscape(name)}">`
      : `<span>${sbwOrganizerEditorEscape(initials)}</span>`;
    element.setAttribute("style", sbwOrganizerEditorGetAssetFrameStyle(sbwOrganizerEditorCurrent, "logo"));
  });

  sbwOrganizerEditorApplyAssetFramePreview("banner");
  sbwOrganizerEditorApplyAssetFramePreview("logo");
}

function sbwOrganizerEditorPreviewSelectedAsset(file, assetType) {
  if (!file) return;

  const url = URL.createObjectURL(file);
  sbwOrganizerEditorSetAssetUrl(assetType, url);

  if (assetType === "banner") {
    document.querySelectorAll(`[data-organizer-asset-preview="banner"]`).forEach((element) => {
      element.classList.add("has-image");
      element.innerHTML = `<img src="${url}" alt="Prévia do banner">`;
    });
  } else {
    document.querySelectorAll(`[data-organizer-asset-preview="logo"]`).forEach((element) => {
      element.classList.add("has-image");
      element.innerHTML = `<img src="${url}" alt="Prévia da logo">`;
    });
  }

  sbwOrganizerEditorApplyAssetFramePreview(assetType);
}

function sbwOrganizerEditorIsAssetFrameEditActive(assetType) {
  const controls = document.querySelector(`[data-organizer-asset-frame-group="${assetType}"]`);
  return controls?.dataset.organizerAssetFrameEditing === "true";
}

function sbwOrganizerEditorSetAssetFrameEditMode(assetType, isActive) {
  const active = Boolean(isActive);
  const label = assetType === "banner" ? "banner" : "logo";
  const controls = document.querySelector(`[data-organizer-asset-frame-group="${assetType}"]`);

  if (controls) {
    controls.dataset.organizerAssetFrameEditing = active ? "true" : "false";
    controls.classList.toggle("is-frame-editing", active);

    controls.querySelectorAll("[data-organizer-asset-zoom], [data-organizer-asset-frame-save]").forEach((control) => {
      control.disabled = !active;
      control.setAttribute("aria-disabled", active ? "false" : "true");
    });
  }

  document.querySelectorAll(`[data-organizer-asset-frame-toggle="${assetType}"]`).forEach((button) => {
    button.setAttribute("aria-pressed", active ? "true" : "false");
    button.textContent = active ? `Bloquear enquadramento do ${label}` : `Editar enquadramento do ${label}`;
    button.classList.toggle("is-active", active);
  });

  document.querySelectorAll(`[data-organizer-asset-drag-target="${assetType}"]`).forEach((element) => {
    element.classList.toggle("is-frame-editing", active);
  });
}

function sbwOrganizerEditorNudgeAssetZoom(assetType, direction) {
  if (!sbwOrganizerEditorIsAssetFrameEditActive(assetType)) {
    sbwOrganizerEditorSetAssetFeedback(assetType, "Ative a edição de enquadramento antes de alterar o zoom.", "loading");
    return;
  }

  const frame = sbwOrganizerEditorGetAssetFrameForm(assetType);
  const step = assetType === "banner" ? 5 : 4;
  const next = {
    ...frame,
    zoom: sbwOrganizerEditorClampNumber(frame.zoom + direction * step, 100, assetType === "banner" ? 180 : 160, 100)
  };

  sbwOrganizerEditorSetAssetFrameForm(assetType, next);
  sbwOrganizerEditorApplyAssetFramePreview(assetType);
  sbwOrganizerEditorSetAssetFeedback(assetType, "Ajuste alterado. Clique em Salvar enquadramento para aplicar.", "loading");
}

function sbwOrganizerEditorBindAssetDragTarget(element) {
  if (!element || element.dataset.organizerAssetDragReady === "true") return;

  const assetType = element.dataset.organizerAssetDragTarget;
  if (!assetType) return;

  element.dataset.organizerAssetDragReady = "true";
  element.setAttribute("role", "button");
  element.setAttribute("tabindex", "0");

  let drag = null;

  const finishDrag = (event) => {
    if (!drag) return;
    const pointerId = drag.pointerId;
    drag = null;
    element.classList.remove("is-dragging");
    try {
      element.releasePointerCapture?.(event?.pointerId || pointerId);
    } catch (error) {}
  };

  element.addEventListener("pointerdown", (event) => {
    if (event.button !== undefined && event.button !== 0) return;
    if (!sbwOrganizerEditorIsAssetFrameEditActive(assetType)) return;

    const rect = element.getBoundingClientRect();
    const frame = sbwOrganizerEditorGetAssetFrameForm(assetType);

    drag = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      frame,
      sensitivity: {
        x: assetType === "banner" ? 72 / Math.max(1, rect.width) : 90 / Math.max(1, rect.width),
        y: assetType === "banner" ? 175 / Math.max(1, rect.height) : 90 / Math.max(1, rect.height)
      }
    };

    element.classList.add("is-dragging");
    element.setPointerCapture?.(event.pointerId);
    event.preventDefault();
  });

  element.addEventListener("pointermove", (event) => {
    if (!drag || drag.pointerId !== event.pointerId) return;

    const next = {
      ...drag.frame,
      positionX: sbwOrganizerEditorClampNumber(drag.frame.positionX - (event.clientX - drag.startX) * drag.sensitivity.x, 0, 100, 50),
      positionY: sbwOrganizerEditorClampNumber(drag.frame.positionY - (event.clientY - drag.startY) * drag.sensitivity.y, 0, 100, 50)
    };

    sbwOrganizerEditorSetAssetFrameForm(assetType, next);
    sbwOrganizerEditorApplyAssetFramePreview(assetType);
    sbwOrganizerEditorSetAssetFeedback(assetType, "Ajuste alterado. Clique em Salvar enquadramento para aplicar.", "loading");
    event.preventDefault();
  });

  element.addEventListener("pointerup", finishDrag);
  element.addEventListener("pointercancel", finishDrag);
  element.addEventListener("lostpointercapture", finishDrag);
}

function sbwOrganizerEditorBindAssetControls() {
  document.querySelectorAll("[data-organizer-asset-input]").forEach((input) => {
    input.addEventListener("change", async () => {
      const assetType = input.dataset.organizerAssetInput;
      const file = input.files?.[0] || null;
      const validationError = sbwOrganizerEditorValidateAssetFile(file, assetType);

      if (validationError) {
        sbwOrganizerEditorSetAssetFeedback(assetType, validationError, "error");
        input.value = "";
        return;
      }

      if (sbwOrganizerEditorIsNew || !sbwOrganizerEditorSlug) {
        sbwOrganizerEditorSetAssetFeedback(assetType, "Salve a organização antes de enviar imagens.", "error");
        input.value = "";
        return;
      }

      sbwOrganizerEditorSetAssetUploading(assetType, true);
      sbwOrganizerEditorSetAssetFeedback(assetType, `Enviando ${sbwOrganizerEditorGetAssetLabel(assetType)}...`, "loading");
      sbwOrganizerEditorPreviewSelectedAsset(file, assetType);

      try {
        const publicUrl = await sbwOrganizerEditorUploadAssetToSupabase(file, assetType);
        sbwOrganizerEditorSetAssetUrl(assetType, publicUrl);
        sbwOrganizerEditorSetAssetFeedback(assetType, "Upload concluído. Salvando no organizador...", "loading");
        await sbwOrganizerEditorSaveAssetUrl(assetType, publicUrl);
        sbwOrganizerEditorSetAssetFrameForm(assetType, sbwOrganizerEditorGetAssetFrame(sbwOrganizerEditorCurrent, assetType));
        sbwOrganizerEditorRenderProfileMediaPreview();
        sbwOrganizerEditorRenderPreview();
        sbwOrganizerEditorSetAssetFeedback(assetType, `${sbwOrganizerEditorGetAssetLabel(assetType).replace(/^./, (letter) => letter.toUpperCase())} atualizado.`, "success");
      } catch (error) {
        console.error(`[SBW Organizadores] Falha ao enviar ${assetType}:`, error);
        sbwOrganizerEditorSetAssetFeedback(assetType, error?.message || "Não foi possível enviar a imagem.", "error");
      } finally {
        sbwOrganizerEditorSetAssetUploading(assetType, false);
        input.value = "";
      }
    });
  });

  document.querySelectorAll("[data-organizer-asset-url-input]").forEach((input) => {
    input.addEventListener("input", () => {
      const assetType = input.dataset.organizerAssetUrlInput;
      sbwOrganizerEditorSetAssetUrl(assetType, input.value);
      sbwOrganizerEditorRenderProfileMediaPreview();
      sbwOrganizerEditorRenderPreview();
    });

    input.addEventListener("change", () => {
      const assetType = input.dataset.organizerAssetUrlInput;
      sbwOrganizerEditorSetAssetUrl(assetType, input.value);
      sbwOrganizerEditorRenderProfileMediaPreview();
      sbwOrganizerEditorRenderPreview();
    });
  });

  document.querySelectorAll("[data-organizer-asset-zoom]").forEach((button) => {
    button.addEventListener("click", () => {
      const direction = button.dataset.organizerAssetZoom === "in" ? 1 : -1;
      sbwOrganizerEditorNudgeAssetZoom(button.dataset.organizerAssetType, direction);
    });
  });

  document.querySelectorAll("[data-organizer-asset-frame-save]").forEach((button) => {
    button.addEventListener("click", () => {
      sbwOrganizerEditorSaveAssetFrame(button.dataset.organizerAssetFrameSave);
    });
  });

  document.querySelectorAll("[data-organizer-asset-frame-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const assetType = button.dataset.organizerAssetFrameToggle;
      sbwOrganizerEditorSetAssetFrameEditMode(assetType, !sbwOrganizerEditorIsAssetFrameEditActive(assetType));
    });
  });

  document.querySelectorAll("[data-organizer-asset-drag-target]").forEach((element) => {
    sbwOrganizerEditorBindAssetDragTarget(element);
  });

  ["banner", "logo"].forEach((assetType) => {
    sbwOrganizerEditorSetAssetFrameEditMode(assetType, false);
  });
}


function sbwOrganizerEditorGetField(id) {
  return document.getElementById(id);
}

function sbwOrganizerEditorSetMessage(message, type = "success") {
  if (!sbwOrganizerEditorMessage) {
    return;
  }

  sbwOrganizerEditorMessage.textContent = message;
  sbwOrganizerEditorMessage.classList.add("is-visible");
  sbwOrganizerEditorMessage.classList.toggle("error", type === "error");
}

function sbwOrganizerEditorClearMessage() {
  if (!sbwOrganizerEditorMessage) {
    return;
  }

  sbwOrganizerEditorMessage.textContent = "";
  sbwOrganizerEditorMessage.classList.remove("is-visible", "error");
}

function sbwOrganizerEditorSplitList(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function sbwOrganizerEditorJoinList(value) {
  if (!Array.isArray(value)) {
    return "";
  }

  return value.filter(Boolean).join(", ");
}

function sbwOrganizerEditorGetTheme(organizer) {
  if (typeof sbwGetTournamentOrganizerTheme === "function") {
    return sbwGetTournamentOrganizerTheme(organizer);
  }

  return organizer?.theme || {
    primary: "#38bdf8",
    secondary: "#7c3cff",
    accent: "#facc15",
    text: "#f8fafc"
  };
}

function sbwOrganizerEditorGetInitials(organizer) {
  return String(organizer?.tag || organizer?.name || "ORG")
    .trim()
    .slice(0, 4)
    .toUpperCase();
}

function sbwOrganizerEditorGetLoginUrl() {
  if (window.SBWAuth && typeof window.SBWAuth.getLoginUrl === "function") {
    return window.SBWAuth.getLoginUrl(window.location.href);
  }

  return "../auth/login.html";
}

function sbwOrganizerEditorCanCreateTournament(organizer) {
  if (!organizer) {
    return false;
  }

  const role = String(organizer.memberRole || organizer.role || organizer.currentUserRole || "").toLowerCase();

  return Boolean(
    organizer.canCreateTournament === true ||
    organizer.can_create_tournaments === true ||
    organizer.canManage === true ||
    organizer.can_manage === true ||
    ["owner", "admin", "manager", "organizer_admin", "tournament_admin"].includes(role)
  );
}

function sbwOrganizerEditorBuildCreateTournamentUrl(organizer) {
  const slug = organizer?.slug || sbwOrganizerEditorSlug || "";
  const id = organizer?.id || organizer?.raw?.id || "";
  const key = slug || id;

  if (!key) {
    return "create-tournament/criar-torneio.html";
  }

  return `create-tournament/criar-torneio.html?organizer=${encodeURIComponent(key)}`;
}

function sbwOrganizerEditorUpdateCreateTournamentLink(organizer) {
  if (!sbwOrganizerCreateTournament) {
    return;
  }

  const slug = organizer?.slug || sbwOrganizerEditorSlug || "";
  const id = organizer?.id || organizer?.raw?.id || "";
  const canCreateTournament = sbwOrganizerEditorCanCreateTournament(organizer);

  if (!slug && !id) {
    sbwOrganizerCreateTournament.hidden = true;
    sbwOrganizerCreateTournament.removeAttribute("href");
    return;
  }

  const tournamentUrl = sbwOrganizerEditorBuildCreateTournamentUrl(organizer);
  sbwOrganizerCreateTournament.hidden = !canCreateTournament;
  sbwOrganizerCreateTournament.href = tournamentUrl;

  if (sbwOrganizerEditorTournamentCreateInline) {
    sbwOrganizerEditorTournamentCreateInline.hidden = !canCreateTournament;
    sbwOrganizerEditorTournamentCreateInline.href = tournamentUrl;
  }
}

async function sbwOrganizerEditorMergeAccess(organizer) {
  if (!organizer || typeof sbwGetMyTournamentOrganizerAccessAsync !== "function") {
    return organizer;
  }

  try {
    const accessList = await sbwGetMyTournamentOrganizerAccessAsync();
    const organizerKeys = [organizer.id, organizer.slug, organizer.name, organizer.displayName, organizer.raw?.id, organizer.raw?.slug]
      .filter(Boolean)
      .map((value) => String(value).trim().toLowerCase());

    const match = (Array.isArray(accessList) ? accessList : []).find((item) => {
      const itemKeys = [item.id, item.slug, item.name, item.displayName, item.raw?.id, item.raw?.slug]
        .filter(Boolean)
        .map((value) => String(value).trim().toLowerCase());

      return itemKeys.some((key) => organizerKeys.includes(key));
    });

    if (!match) {
      return organizer;
    }

    return {
      ...organizer,
      memberRole: match.memberRole || match.role || organizer.memberRole || organizer.role,
      role: match.memberRole || match.role || organizer.role,
      canCreateTournament: match.canCreateTournament === true || match.can_create_tournaments === true || ["owner", "admin", "manager", "organizer_admin", "tournament_admin"].includes(String(match.memberRole || match.role || "").toLowerCase()),
      can_create_tournaments: match.can_create_tournaments === true || match.canCreateTournament === true || ["owner", "admin", "manager", "organizer_admin", "tournament_admin"].includes(String(match.memberRole || match.role || "").toLowerCase()),
      canManage: true
    };
  } catch (error) {
    console.warn("[SBW Organizadores] Não foi possível validar permissão de criar torneio:", error);
    return organizer;
  }
}

async function sbwOrganizerEditorCheckAccess() {
  if (sbwOrganizerEditorAccess) {
    sbwOrganizerEditorAccess.hidden = false;
    sbwOrganizerEditorAccess.innerHTML = "Verificando conta e permissão real de organização...";
  }

  if (!window.SBWAuth || typeof window.SBWAuth.getUser !== "function") {
    if (sbwOrganizerEditorAccess) {
      sbwOrganizerEditorAccess.innerHTML = `
        <strong>Login -SBW- não carregado.</strong><br>
        Volte pelo menu principal e tente acessar novamente.
      `;
    }

    return false;
  }

  const user = await window.SBWAuth.getUser();

  if (!user) {
    window.location.href = sbwOrganizerEditorGetLoginUrl();
    return false;
  }

  let context = null;

  if (window.SBWSessionContext && typeof window.SBWSessionContext.getCurrentContext === "function") {
    context = await window.SBWSessionContext.getCurrentContext({ refresh: true });
  }

  let profile = context?.profile || null;

  if (!profile && typeof window.SBWAuth.ensureCurrentUserProfile === "function") {
    profile = await window.SBWAuth.ensureCurrentUserProfile();
  }

  const permissions = context?.permissions || profile?.permissions || {};
  const canCreateOrganization = Boolean(
    context?.canCreateTournamentOrganizer ||
    permissions.canCreateTournamentOrganizer ||
    permissions.can_create_tournament_organizer ||
    permissions.canCreateTournamentOrganizers ||
    permissions.can_create_tournament_organizers ||
    permissions.canCreateOrganization ||
    permissions.can_create_organization ||
    permissions.canCreateOrganizations ||
    permissions.can_create_organizations ||
    permissions.isAdminSbw ||
    permissions.is_admin_sbw ||
    permissions.isMasterAdmin ||
    permissions.is_master_admin ||
    permissions.isAdmin ||
    permissions.is_admin
  );

  if (!canCreateOrganization) {
    if (sbwOrganizerEditorAccess) {
      sbwOrganizerEditorAccess.innerHTML = `
        <strong>Acesso restrito a organizadores autorizados.</strong><br>
        Conta comum não cria organização nem torneio na plataforma -SBW-.
        <div class="organizer-admin-access-steps">
          <span>Pré-requisito para a Rinha Online:</span>
          <ol>
            <li>A -SBW- libera a permissão de organizador para esta conta.</li>
            <li>A organização cria o próprio perfil organizacional por este painel.</li>
            <li>Depois disso, os torneios são criados vinculados à organização.</li>
          </ol>
        </div>
      `;
    }

    if (sbwOrganizerEditorShell) {
      sbwOrganizerEditorShell.hidden = true;
    }

    return false;
  }

  if (sbwOrganizerEditorAccess) {
    sbwOrganizerEditorAccess.hidden = true;
  }

  if (sbwOrganizerEditorShell) {
    sbwOrganizerEditorShell.hidden = false;
  }

  return true;
}

function sbwOrganizerEditorReadForm() {
  return {
    slug: sbwOrganizerEditorCurrent?.slug || sbwOrganizerEditorSlug,
    name: sbwOrganizerEditorGetField("organizerName")?.value.trim() || "Organizador",
    displayName: sbwOrganizerEditorGetField("organizerName")?.value.trim() || "Organizador",
    tag: sbwOrganizerEditorGetField("organizerTag")?.value.trim() || "",
    type: sbwOrganizerEditorGetField("organizerType")?.value.trim() || "Organizador de torneios",
    status: sbwOrganizerEditorGetField("organizerStatus")?.value || "active",
    description: sbwOrganizerEditorGetField("organizerDescription")?.value.trim() || "",
    games: sbwOrganizerEditorSplitList(sbwOrganizerEditorGetField("organizerGames")?.value),
    aliases: sbwOrganizerEditorSplitList(sbwOrganizerEditorGetField("organizerAliases")?.value),
    bannerUrl: sbwOrganizerEditorGetField("organizerBannerUrl")?.value.trim() || "",
    logoUrl: sbwOrganizerEditorGetField("organizerLogoUrl")?.value.trim() || "",
    theme: {
      primary: sbwOrganizerEditorGetField("organizerThemePrimary")?.value || "#38bdf8",
      secondary: sbwOrganizerEditorGetField("organizerThemeSecondary")?.value || "#7c3cff",
      accent: sbwOrganizerEditorGetField("organizerThemeAccent")?.value || "#facc15",
      text: sbwOrganizerEditorGetField("organizerThemeText")?.value || "#f8fafc"
    },
    links: {
      website: sbwOrganizerEditorGetField("organizerWebsite")?.value.trim() || "",
      discord: sbwOrganizerEditorGetField("organizerDiscord")?.value.trim() || "",
      instagram: sbwOrganizerEditorGetField("organizerInstagram")?.value.trim() || "",
      youtube: sbwOrganizerEditorGetField("organizerYoutube")?.value.trim() || "",
      twitch: sbwOrganizerEditorGetField("organizerTwitch")?.value.trim() || "",
      x: sbwOrganizerEditorGetField("organizerX")?.value.trim() || ""
    },
    organizerAssets: {
      ...sbwOrganizerEditorGetOrganizerAssets(sbwOrganizerEditorCurrent),
      banner: {
        ...sbwOrganizerEditorGetAssetFrameForm("banner"),
        url: sbwOrganizerEditorGetAssetUrl("banner")
      },
      logo: {
        ...sbwOrganizerEditorGetAssetFrameForm("logo"),
        url: sbwOrganizerEditorGetAssetUrl("logo")
      }
    }
  };
}

function sbwOrganizerEditorHydrateForm(organizer) {
  const theme = sbwOrganizerEditorGetTheme(organizer);
  const links = organizer?.links || {};

  sbwOrganizerEditorGetField("organizerName").value = organizer?.name || organizer?.displayName || "";
  sbwOrganizerEditorGetField("organizerTag").value = organizer?.tag || "";
  sbwOrganizerEditorGetField("organizerType").value = organizer?.type || "Organizador de torneios";
  sbwOrganizerEditorGetField("organizerStatus").value = organizer?.status || "active";
  sbwOrganizerEditorGetField("organizerDescription").value = organizer?.description || "";
  sbwOrganizerEditorGetField("organizerGames").value = sbwOrganizerEditorJoinList(organizer?.games);
  sbwOrganizerEditorGetField("organizerAliases").value = sbwOrganizerEditorJoinList(organizer?.aliases);
  sbwOrganizerEditorSetAssetUrl("banner", organizer?.bannerUrl || "");
  sbwOrganizerEditorSetAssetUrl("logo", organizer?.logoUrl || "");
  sbwOrganizerEditorSetAssetFrameForm("banner", sbwOrganizerEditorGetAssetFrame(organizer, "banner"));
  sbwOrganizerEditorSetAssetFrameForm("logo", sbwOrganizerEditorGetAssetFrame(organizer, "logo"));
  sbwOrganizerEditorRenderProfileMediaPreview();
  sbwOrganizerEditorGetField("organizerThemePrimary").value = theme.primary || "#38bdf8";
  sbwOrganizerEditorGetField("organizerThemeSecondary").value = theme.secondary || "#7c3cff";
  sbwOrganizerEditorGetField("organizerThemeAccent").value = theme.accent || "#facc15";
  sbwOrganizerEditorGetField("organizerThemeText").value = theme.text || "#f8fafc";
  sbwOrganizerEditorGetField("organizerWebsite").value = links.website || "";
  sbwOrganizerEditorGetField("organizerDiscord").value = links.discord || "";
  sbwOrganizerEditorGetField("organizerInstagram").value = links.instagram || "";
  sbwOrganizerEditorGetField("organizerYoutube").value = links.youtube || "";
  sbwOrganizerEditorGetField("organizerTwitch").value = links.twitch || "";
  sbwOrganizerEditorGetField("organizerX").value = links.x || "";
}

function sbwOrganizerEditorRenderPreview() {
  if (!sbwOrganizerPreview) {
    return;
  }

  const formData = sbwOrganizerEditorReadForm();
  const previewOrganizer = {
    ...sbwOrganizerEditorCurrent,
    ...formData
  };
  const themeStyle = typeof sbwGetTournamentOrganizerThemeStyle === "function"
    ? sbwGetTournamentOrganizerThemeStyle(previewOrganizer)
    : "";
  const name = formData.name || "Organizador";
  const initials = sbwOrganizerEditorGetInitials(previewOrganizer);
  const logoHTML = formData.logoUrl
    ? `<img src="${sbwEscapeHTML(formData.logoUrl)}" alt="Logo ${sbwEscapeHTML(name)}">`
    : `<span>${sbwEscapeHTML(initials)}</span>`;
  const bannerHTML = formData.bannerUrl
    ? `<img src="${sbwOrganizerEditorEscape(formData.bannerUrl)}" alt="" aria-hidden="true">`
    : "";
  const bannerFrameStyle = sbwOrganizerEditorGetAssetFrameStyle(previewOrganizer, "banner");
  const logoFrameStyle = sbwOrganizerEditorGetAssetFrameStyle(previewOrganizer, "logo");
  const activeLinks = Object.entries(formData.links || {}).filter(([, value]) => Boolean(value));

  sbwOrganizerPreview.setAttribute("style", themeStyle);
  sbwOrganizerPreview.innerHTML = `
    <div class="organizer-admin-preview-cover" ${sbwOrganizerEditorStyleAttribute(bannerFrameStyle)}>
      ${bannerHTML}
    </div>

    <div class="organizer-admin-preview-body">
      <div class="organizer-admin-preview-head">
        <div class="organizer-admin-preview-logo" ${sbwOrganizerEditorStyleAttribute(logoFrameStyle)}>
          ${logoHTML}
        </div>

        <div>
          <h3>${sbwEscapeHTML(name)}</h3>
          <div class="organizer-admin-preview-badges">
            <span>${sbwEscapeHTML(formData.type || "Organizador")}</span>
            <span>${sbwEscapeHTML(typeof sbwGetOrganizerStatusLabel === "function" ? sbwGetOrganizerStatusLabel(formData.status) : formData.status)}</span>
            ${formData.games.slice(0, 3).map((game) => `<span>${sbwEscapeHTML(game)}</span>`).join("")}
          </div>
        </div>
      </div>

      <p>${sbwEscapeHTML(formData.description || "Descrição pública do organizador.")}</p>

      ${activeLinks.length
        ? `<div class="organizer-admin-preview-links">${activeLinks.map(([key]) => `<span>${sbwEscapeHTML(key)}</span>`).join("")}</div>`
        : `<p class="organizer-admin-note">Nenhum link público configurado ainda.</p>`
      }
    </div>
  `;
}

function sbwOrganizerEditorBindPreviewEvents() {
  if (!sbwOrganizerEditorForm) {
    return;
  }

  sbwOrganizerEditorForm.querySelectorAll("input, textarea, select").forEach((field) => {
    field.addEventListener("input", sbwOrganizerEditorRenderPreview);
    field.addEventListener("change", sbwOrganizerEditorRenderPreview);
  });
}

function sbwOrganizerEditorSetSaving(isSaving) {
  const submitButton = sbwOrganizerEditorForm?.querySelector('button[type="submit"]');

  if (!submitButton) {
    return;
  }

  submitButton.disabled = Boolean(isSaving);
  submitButton.classList.toggle("is-loading", Boolean(isSaving));
  submitButton.innerHTML = isSaving
    ? `<i class="fa-solid fa-circle-notch fa-spin"></i> Salvando...`
    : `<i class="fa-solid fa-floppy-disk"></i> Salvar organização`;
}

function sbwOrganizerEditorBindSave() {
  if (!sbwOrganizerEditorForm) {
    return;
  }

  sbwOrganizerEditorForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    sbwOrganizerEditorClearMessage();
    sbwOrganizerEditorSetSaving(true);

    try {
      const formData = sbwOrganizerEditorReadForm();
      let result = null;

      if (sbwOrganizerEditorIsNew) {
        if (typeof sbwCreateTournamentOrganizerAsync !== "function") {
          throw new Error("Função de criação real de organização não encontrada.");
        }

        result = await sbwCreateTournamentOrganizerAsync(formData);
        sbwOrganizerEditorIsNew = false;
      } else {
        if (typeof sbwUpdateTournamentOrganizerProfileAsync !== "function") {
          throw new Error("Função de edição real de organização não encontrada.");
        }

        result = await sbwUpdateTournamentOrganizerProfileAsync(sbwOrganizerEditorSlug, formData);
      }

      let organizer = result?.organizer || null;

      if (!organizer) {
        throw new Error("Supabase salvou, mas não retornou os dados da organização.");
      }

      organizer = await sbwOrganizerEditorMergeAccess(organizer);
      sbwOrganizerEditorCurrent = organizer;
      sbwOrganizerEditorSlug = organizer.slug || sbwOrganizerEditorSlug;

      if (sbwOrganizerEditorSlug && window.history?.replaceState) {
        const nextUrl = `${window.location.pathname}?slug=${encodeURIComponent(sbwOrganizerEditorSlug)}`;
        window.history.replaceState({}, "", nextUrl);
      }

      if (sbwOrganizerOpenPublic) {
        sbwOrganizerOpenPublic.href = `organizador.html?slug=${encodeURIComponent(sbwOrganizerEditorSlug)}`;
      }

      sbwOrganizerEditorUpdateCreateTournamentLink(organizer);

      if (sbwOrganizerEditorStatusText) {
        sbwOrganizerEditorStatusText.textContent = `${organizer.name || organizer.displayName || "Organização"} salva no Supabase. O perfil público já pode ser aberto.`;
      }

      sbwOrganizerEditorHydrateForm(organizer);
      sbwOrganizerEditorRenderPreview();
      sbwOrganizerEditorRenderTestReadinessGuide(organizer);
      sbwOrganizerEditorBindStaff();
      await sbwOrganizerEditorLoadStaff();
      await sbwOrganizerEditorLoadTournaments();
      sbwOrganizerEditorHydrateSeasonForm(sbwOrganizerEditorCurrent);
      sbwOrganizerEditorRenderRankings();
      sbwOrganizerEditorSetMessage(result?.message || "Organização salva no Supabase.");
    } catch (error) {
      console.error("Erro ao salvar organização no Supabase:", error);
      sbwOrganizerEditorSetMessage(error?.message || "Não foi possível salvar a organização no Supabase.", "error");
    } finally {
      sbwOrganizerEditorSetSaving(false);
    }
  });
}

function sbwOrganizerEditorBindReset() {
  if (!sbwOrganizerResetLocal) {
    return;
  }

  sbwOrganizerResetLocal.addEventListener("click", async () => {
    sbwOrganizerEditorClearMessage();

    if (sbwOrganizerEditorIsNew) {
      const shouldClear = window.confirm("Limpar o formulário de criação da organização?");

      if (!shouldClear) {
        return;
      }

      sbwOrganizerEditorCurrent = null;
      sbwOrganizerEditorHydrateForm({
        name: "",
        tag: "",
        type: "Organizador de torneios",
        status: "active",
        description: "",
        games: [],
        aliases: [],
        links: {},
        theme: {}
      });
      sbwOrganizerEditorRenderPreview();
      sbwOrganizerEditorRenderTestReadinessGuide(sbwOrganizerEditorCurrent);
      sbwOrganizerEditorSetMessage("Formulário limpo. Preencha novamente para criar a organização.");
      return;
    }

    if (!sbwOrganizerEditorSlug) {
      return;
    }

    const shouldReload = window.confirm("Recarregar os dados reais desta organização do Supabase?");

    if (!shouldReload) {
      return;
    }

    let organizer = await sbwGetTournamentOrganizerBySlugAsync(sbwOrganizerEditorSlug);
    organizer = await sbwOrganizerEditorMergeAccess(organizer);
    sbwOrganizerEditorCurrent = organizer;
    sbwOrganizerEditorHydrateForm(organizer);
    sbwOrganizerEditorRenderPreview();
    sbwOrganizerEditorRenderTestReadinessGuide(organizer);
    sbwOrganizerEditorUpdateCreateTournamentLink(organizer);
    sbwOrganizerEditorSetMessage("Dados recarregados do Supabase.");
  });
}


function sbwOrganizerEditorGetTournamentTitle(tournament) {
  return tournament?.title || tournament?.name || tournament?.publicName || "Torneio sem nome";
}

function sbwOrganizerEditorGetTournamentGame(tournament) {
  return tournament?.gameName || tournament?.game_name || tournament?.game || "Jogo a definir";
}

function sbwOrganizerEditorGetTournamentDate(tournament) {
  const raw = tournament?.startsAt || tournament?.starts_at || tournament?.date || tournament?.startDate || tournament?.created_at;
  if (!raw) return "Data a definir";
  try {
    return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(raw));
  } catch (error) {
    return String(raw);
  }
}

function sbwOrganizerEditorGetTournamentDetailUrl(tournament) {
  const key = tournament?.id || tournament?.slug || tournament?.supabaseId || tournament?.raw?.id || "";
  return `detalhe-torneio.html?id=${encodeURIComponent(key)}`;
}

function sbwOrganizerEditorGetTournamentManageUrl(tournament) {
  const key = tournament?.id || tournament?.supabaseId || tournament?.slug || tournament?.raw?.id || "";
  const organizerKey = sbwOrganizerEditorCurrent?.slug || sbwOrganizerEditorCurrent?.id || sbwOrganizerEditorSlug || "";
  const params = new URLSearchParams();

  if (organizerKey) {
    params.set("organizer", organizerKey);
  }

  if (key) {
    params.set("manage", key);
  }

  const query = params.toString();
  return `create-tournament/criar-torneio.html${query ? `?${query}` : ""}`;
}

function sbwOrganizerEditorGetTournamentKey(tournament) {
  return String(tournament?.supabaseId || tournament?.raw?.id || tournament?.id || tournament?.slug || "");
}

function sbwOrganizerEditorFormatInputDate(raw) {
  if (!raw) return "";
  const value = String(raw);
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10);
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

function sbwOrganizerEditorFormatInputTime(raw) {
  if (!raw) return "";
  const value = String(raw);
  const match = value.match(/T?(\d{2}:\d{2})/);
  if (match) return match[1];
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(11, 16);
}

function sbwOrganizerEditorFormatInputDateTime(raw) {
  const date = sbwOrganizerEditorFormatInputDate(raw);
  const time = sbwOrganizerEditorFormatInputTime(raw);

  if (!date) return "";

  return `${date}T${time || "00:00"}`;
}

function sbwOrganizerEditorGetWindowDateTimeValue(input) {
  const value = String(input?.value || "").trim();
  return value ? `${value}:00` : "";
}

function sbwOrganizerEditorValidateTournamentWindows(registrationOpensAt, registrationClosesAt, checkinStartsAt, checkinEndsAt) {
  const checks = [
    [registrationOpensAt, registrationClosesAt, "A abertura das inscrições precisa ser antes do fechamento."],
    [checkinStartsAt, checkinEndsAt, "A abertura do check-in precisa ser antes do fechamento."]
  ];

  for (const [start, end, message] of checks) {
    if (start && end && new Date(start).getTime() >= new Date(end).getTime()) {
      return message;
    }
  }

  if (registrationClosesAt && checkinStartsAt && new Date(registrationClosesAt).getTime() > new Date(checkinStartsAt).getTime()) {
    return "O check-in deve abrir no mesmo momento ou depois do fechamento das inscrições.";
  }

  return "";
}

function sbwOrganizerEditorGetTournamentAssets(tournament = sbwOrganizerEditorEditingTournament) {
  const metadata = sbwOrganizerEditorAsObject(tournament?.metadata || tournament?.raw?.metadata);
  return sbwOrganizerEditorAsObject(
    tournament?.tournamentAssets ||
    metadata.tournamentAssets ||
    metadata.tournament_assets ||
    metadata.assets ||
    {}
  );
}

function sbwOrganizerEditorGetTournamentCoverFrame(tournament = sbwOrganizerEditorEditingTournament) {
  const assets = sbwOrganizerEditorGetTournamentAssets(tournament);
  const raw = sbwOrganizerEditorAsObject(assets.cover || assets.banner || assets.coverImage || {});
  const nested = sbwOrganizerEditorAsObject(raw.frame || raw.framing || raw.crop || raw.position);
  const source = Object.keys(nested).length ? { ...raw, ...nested } : raw;

  return {
    positionX: sbwOrganizerEditorClampNumber(source.positionX ?? source.x ?? source.objectPositionX, 0, 100, 50),
    positionY: sbwOrganizerEditorClampNumber(source.positionY ?? source.y ?? source.objectPositionY, 0, 100, 50),
    zoom: sbwOrganizerEditorClampNumber(source.zoom ?? source.scale ?? source.size, 100, 180, 100)
  };
}

function sbwOrganizerEditorGetTournamentCoverFrameForm() {
  const group = document.querySelector("[data-tournament-cover-frame-group]");
  if (!group) return sbwOrganizerEditorGetTournamentCoverFrame();

  return {
    zoom: sbwOrganizerEditorClampNumber(group.querySelector('[data-tournament-cover-frame="zoom"]')?.value, 100, 180, 100),
    positionX: sbwOrganizerEditorClampNumber(group.querySelector('[data-tournament-cover-frame="positionX"]')?.value, 0, 100, 50),
    positionY: sbwOrganizerEditorClampNumber(group.querySelector('[data-tournament-cover-frame="positionY"]')?.value, 0, 100, 50)
  };
}

function sbwOrganizerEditorSetTournamentCoverFrameForm(frame) {
  const group = document.querySelector("[data-tournament-cover-frame-group]");
  if (!group) return;

  const safeFrame = {
    zoom: sbwOrganizerEditorClampNumber(frame?.zoom, 100, 180, 100),
    positionX: sbwOrganizerEditorClampNumber(frame?.positionX, 0, 100, 50),
    positionY: sbwOrganizerEditorClampNumber(frame?.positionY, 0, 100, 50)
  };

  const zoomInput = group.querySelector('[data-tournament-cover-frame="zoom"]');
  const xInput = group.querySelector('[data-tournament-cover-frame="positionX"]');
  const yInput = group.querySelector('[data-tournament-cover-frame="positionY"]');

  if (zoomInput) zoomInput.value = String(Math.round(safeFrame.zoom));
  if (xInput) xInput.value = String(Math.round(safeFrame.positionX));
  if (yInput) yInput.value = String(Math.round(safeFrame.positionY));

  sbwOrganizerEditorUpdateTournamentCoverFrameOutputs(safeFrame);
}

function sbwOrganizerEditorUpdateTournamentCoverFrameOutputs(frame = sbwOrganizerEditorGetTournamentCoverFrameForm()) {
  document.querySelectorAll('[data-tournament-cover-output="zoom"]').forEach((item) => { item.textContent = `${Math.round(frame.zoom)}%`; });
  document.querySelectorAll('[data-tournament-cover-output="positionX"]').forEach((item) => { item.textContent = `${Math.round(frame.positionX)}%`; });
  document.querySelectorAll('[data-tournament-cover-output="positionY"]').forEach((item) => { item.textContent = `${Math.round(frame.positionY)}%`; });
}

function sbwOrganizerEditorGetTournamentCoverFrameStyle(frame = sbwOrganizerEditorGetTournamentCoverFrameForm()) {
  return [
    `--org-tournament-cover-x:${frame.positionX}%`,
    `--org-tournament-cover-y:${frame.positionY}%`,
    `--org-tournament-cover-scale:${Math.max(1, frame.zoom / 100).toFixed(2)}`
  ].join("; ");
}

function sbwOrganizerEditorApplyTournamentCoverPreview() {
  if (!sbwOrganizerTournamentCoverPreview) return;

  sbwOrganizerTournamentCoverPreview.setAttribute("style", sbwOrganizerEditorGetTournamentCoverFrameStyle());
}

function sbwOrganizerEditorSetTournamentCoverUrl(url) {
  const safeUrl = String(url || "").trim();
  if (sbwOrganizerTournamentEditCover) sbwOrganizerTournamentEditCover.value = safeUrl;
  if (sbwOrganizerTournamentEditCoverManual) sbwOrganizerTournamentEditCoverManual.value = safeUrl;

  if (sbwOrganizerTournamentCoverPreview) {
    sbwOrganizerTournamentCoverPreview.classList.toggle("has-image", Boolean(safeUrl));
    sbwOrganizerTournamentCoverPreview.innerHTML = safeUrl
      ? `<img src="${sbwOrganizerEditorEscape(safeUrl)}" alt="Prévia da capa do torneio">`
      : `<span>Prévia da capa</span>`;
    sbwOrganizerEditorApplyTournamentCoverPreview();
  }
}

function sbwOrganizerEditorSetTournamentCoverMessage(message, type = "") {
  if (!sbwOrganizerTournamentCoverMessage) return;
  sbwOrganizerTournamentCoverMessage.textContent = message || "";
  sbwOrganizerTournamentCoverMessage.classList.remove("is-error", "is-success", "is-loading");
  if (type) sbwOrganizerTournamentCoverMessage.classList.add(`is-${type}`);
}

function sbwOrganizerEditorGetSafeTournamentKey(tournament = sbwOrganizerEditorEditingTournament) {
  const raw = sbwOrganizerEditorGetTournamentKey(tournament) || tournament?.slug || tournament?.title || tournament?.name || "torneio";
  return String(raw || "torneio")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80) || "torneio";
}

function sbwOrganizerEditorBuildTournamentCoverPath(file) {
  const organizerKey = sbwOrganizerEditorGetSafeAssetOrganizerKey();
  const tournamentKey = sbwOrganizerEditorGetSafeTournamentKey();
  const extension = sbwOrganizerEditorGetFileExtension(file);
  const randomSuffix = Math.random().toString(36).slice(2, 8);
  return `tournaments/${organizerKey}/${tournamentKey}/cover/cover-${Date.now()}-${randomSuffix}.${extension}`;
}

async function sbwOrganizerEditorUploadTournamentCover(file) {
  const validationMessage = sbwOrganizerEditorValidateAssetFile(file, "banner");
  if (validationMessage) throw new Error(validationMessage);

  const storageClient = sbwOrganizerEditorGetSupabaseStorageClient();
  if (!storageClient) throw new Error("Supabase Storage indisponível nesta sessão.");

  const path = sbwOrganizerEditorBuildTournamentCoverPath(file);
  const bucket = storageClient.from(sbwOrganizerEditorAssetConfig.bucket);
  const uploadResult = await bucket.upload(path, file, {
    cacheControl: "3600",
    contentType: file.type,
    upsert: false
  });

  if (uploadResult.error) throw uploadResult.error;

  const publicUrl = bucket.getPublicUrl(path)?.data?.publicUrl || "";
  if (!publicUrl) throw new Error("Upload concluído, mas não foi possível gerar a URL pública.");

  return publicUrl;
}

function sbwOrganizerEditorBindTournamentCoverEditor() {
  if (sbwOrganizerTournamentCoverFile && sbwOrganizerTournamentCoverFile.dataset.bound !== "true") {
    sbwOrganizerTournamentCoverFile.dataset.bound = "true";
    sbwOrganizerTournamentCoverFile.addEventListener("change", async () => {
      const file = sbwOrganizerTournamentCoverFile.files?.[0] || null;
      if (!file) return;

      try {
        sbwOrganizerEditorSetTournamentCoverMessage("Enviando capa do torneio...", "loading");
        const publicUrl = await sbwOrganizerEditorUploadTournamentCover(file);
        sbwOrganizerEditorSetTournamentCoverUrl(publicUrl);
        sbwOrganizerEditorSetTournamentCoverMessage("Upload concluído. Clique em Salvar alterações para gravar no torneio.", "success");
      } catch (error) {
        console.error("[SBW Organizadores] Erro no upload da capa do torneio:", error);
        sbwOrganizerEditorSetTournamentCoverMessage(error?.message || "Não foi possível enviar a capa.", "error");
      } finally {
        sbwOrganizerTournamentCoverFile.value = "";
      }
    });
  }

  if (sbwOrganizerTournamentEditCoverManual && sbwOrganizerTournamentEditCoverManual.dataset.bound !== "true") {
    sbwOrganizerTournamentEditCoverManual.dataset.bound = "true";
    sbwOrganizerTournamentEditCoverManual.addEventListener("change", () => {
      sbwOrganizerEditorSetTournamentCoverUrl(sbwOrganizerTournamentEditCoverManual.value);
      sbwOrganizerEditorSetTournamentCoverMessage("URL manual aplicada. Clique em Salvar alterações para gravar.", "success");
    });
  }

  document.querySelectorAll("[data-tournament-cover-frame]").forEach((input) => {
    if (input.dataset.boundTournamentCoverFrame === "true") return;
    input.dataset.boundTournamentCoverFrame = "true";
    input.addEventListener("input", () => {
      const frame = sbwOrganizerEditorGetTournamentCoverFrameForm();
      sbwOrganizerEditorUpdateTournamentCoverFrameOutputs(frame);
      sbwOrganizerEditorApplyTournamentCoverPreview();
    });
  });
}

function sbwOrganizerEditorSetTournamentEditMessage(message, type = "") {
  if (!sbwOrganizerTournamentEditMessage) return;
  sbwOrganizerTournamentEditMessage.textContent = message || "";
  sbwOrganizerTournamentEditMessage.classList.remove("is-error", "is-success", "is-loading");
  if (type) sbwOrganizerTournamentEditMessage.classList.add(`is-${type}`);
}


function sbwOrganizerEditorGetParticipantKey(participant) {
  return String(
    participant?.participantId ||
    participant?.id ||
    participant?.raw?.id ||
    ""
  );
}

function sbwOrganizerEditorGetStatusLabel(status) {
  const value = String(status || "registered").toLowerCase().replaceAll("-", "_");

  if (value === "waitlist") return "Lista de espera";
  if (value === "cancelled" || value === "canceled") return "Cancelado";
  if (value === "removed") return "Removido";
  if (value === "disqualified") return "Desclassificado";
  return "Inscrito";
}

function sbwOrganizerEditorGetCheckInLabel(status) {
  const value = String(status || "pending").toLowerCase().replaceAll("-", "_");

  if (value === "checked_in" || value === "confirmed") return "Check-in feito";
  if (value === "missed") return "Ausente";
  if (value === "waived") return "Dispensado";
  return "Check-in pendente";
}

function sbwOrganizerEditorGetParticipantInitial(participant) {
  const name = String(participant?.name || participant?.playerName || participant?.displayName || "Jogador").trim();
  return (name.charAt(0) || "J").toUpperCase();
}

function sbwOrganizerEditorFormatDateTime(raw) {
  if (!raw) return "Data não registrada";

  try {
    const date = new Date(raw);
    if (Number.isNaN(date.getTime())) return String(raw);
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(date);
  } catch (error) {
    return String(raw);
  }
}

function sbwOrganizerEditorSetParticipantsMessage(message, type = "") {
  if (!sbwOrganizerTournamentParticipantsMessage) return;
  sbwOrganizerTournamentParticipantsMessage.textContent = message || "";
  sbwOrganizerTournamentParticipantsMessage.classList.remove("is-error", "is-success", "is-loading");
  if (type) sbwOrganizerTournamentParticipantsMessage.classList.add(`is-${type}`);
}

function sbwOrganizerEditorFindTournamentByKey(key) {
  const normalized = String(key || "");

  return sbwOrganizerEditorTournamentsCache.find((item) => {
    return String(sbwOrganizerEditorGetTournamentKey(item)) === normalized
      || String(item?.slug || "") === normalized
      || String(item?.id || "") === normalized
      || String(item?.supabaseId || "") === normalized
      || String(item?.raw?.id || "") === normalized;
  }) || null;
}

function sbwOrganizerEditorUpdateParticipantsStats(participants = []) {
  const list = Array.isArray(participants) ? participants : [];
  const registered = list.filter((participant) => String(participant?.status || "registered").toLowerCase() === "registered").length;
  const waitlist = list.filter((participant) => String(participant?.status || "").toLowerCase() === "waitlist").length;
  const removed = list.filter((participant) => ["removed", "cancelled", "canceled", "disqualified"].includes(String(participant?.status || "").toLowerCase())).length;
  const checkedIn = list.filter((participant) => Boolean(participant?.checkedIn) || ["checked_in", "checked-in", "confirmed"].includes(String(participant?.checkInStatus || "").toLowerCase())).length;

  if (sbwOrganizerTournamentParticipantsRegistered) sbwOrganizerTournamentParticipantsRegistered.textContent = String(registered);
  if (sbwOrganizerTournamentParticipantsCheckedIn) sbwOrganizerTournamentParticipantsCheckedIn.textContent = String(checkedIn);
  if (sbwOrganizerTournamentParticipantsWaitlist) sbwOrganizerTournamentParticipantsWaitlist.textContent = String(waitlist);
  if (sbwOrganizerTournamentParticipantsRemoved) sbwOrganizerTournamentParticipantsRemoved.textContent = String(removed);
}

function sbwOrganizerEditorRenderParticipants(participants = []) {
  if (!sbwOrganizerTournamentParticipantsList) return;

  const list = Array.isArray(participants) ? participants : [];
  sbwOrganizerEditorUpdateParticipantsStats(list);

  if (!list.length) {
    sbwOrganizerTournamentParticipantsList.innerHTML = `
      <div class="organizer-admin-empty-row">
        Nenhum inscrito real encontrado para este torneio. Quando usuários entrarem pela plataforma -SBW-, eles aparecerão aqui.
      </div>
    `;
    return;
  }

  sbwOrganizerTournamentParticipantsList.innerHTML = list.map((participant, index) => {
    const participantKey = sbwOrganizerEditorGetParticipantKey(participant);
    const status = String(participant?.status || "registered").toLowerCase();
    const checkInStatus = String(participant?.checkInStatus || participant?.raw?.check_in_status || "pending").toLowerCase();
    const checkedIn = Boolean(participant?.checkedIn) || ["checked_in", "checked-in", "confirmed"].includes(checkInStatus);
    const removed = ["removed", "cancelled", "canceled", "disqualified"].includes(status);
    const createdAt = participant?.createdAt || participant?.created_at || participant?.raw?.created_at || "";
    const seed = participant?.seed || participant?.raw?.seed || "";
    const playerSlug = participant?.playerSlug || participant?.raw?.player_slug || "";
    const team = participant?.team || participant?.teamName || participant?.raw?.team_name || "Sem equipe";

    return `
      <article class="organizer-admin-participant-card ${removed ? "is-muted" : ""}" data-organizer-participant-id="${sbwOrganizerEditorEscape(participantKey)}">
        <div class="organizer-admin-participant-main">
          <div class="organizer-admin-participant-avatar" aria-hidden="true">${sbwOrganizerEditorEscape(sbwOrganizerEditorGetParticipantInitial(participant))}</div>
          <div class="organizer-admin-participant-copy">
            <span class="organizer-admin-eyebrow">#${sbwOrganizerEditorEscape(seed || index + 1)} · ${sbwOrganizerEditorEscape(team)}</span>
            <strong>${sbwOrganizerEditorEscape(participant?.name || participant?.playerName || participant?.displayName || "Jogador")}</strong>
            <small>${playerSlug ? `@${sbwOrganizerEditorEscape(playerSlug)} · ` : ""}${sbwOrganizerEditorEscape(sbwOrganizerEditorFormatDateTime(createdAt))}</small>
          </div>
        </div>
        <div class="organizer-admin-participant-tags">
          <span class="organizer-admin-participant-pill organizer-admin-participant-pill--status">${sbwOrganizerEditorEscape(sbwOrganizerEditorGetStatusLabel(status))}</span>
          <span class="organizer-admin-participant-pill ${checkedIn ? "is-ok" : ""}">${sbwOrganizerEditorEscape(sbwOrganizerEditorGetCheckInLabel(checkInStatus))}</span>
        </div>
        <div class="organizer-admin-participant-actions">
          <button class="organizer-admin-small-link organizer-admin-small-link--button" type="button" data-organizer-participant-action="checkin" data-organizer-participant-next="${checkedIn ? "pending" : "checked_in"}" data-organizer-participant-id="${sbwOrganizerEditorEscape(participantKey)}" ${removed ? "disabled" : ""}>
            ${checkedIn ? "Reverter check-in" : "Fazer check-in"}
          </button>
          <button class="organizer-admin-small-link organizer-admin-small-link--button organizer-admin-small-link--danger" type="button" data-organizer-participant-action="remove" data-organizer-participant-id="${sbwOrganizerEditorEscape(participantKey)}" ${removed ? "disabled" : ""}>
            Remover
          </button>
        </div>
      </article>
    `;
  }).join("");
}

function sbwOrganizerEditorHideParticipantsPanel() {
  sbwOrganizerEditorManagingTournament = null;
  sbwOrganizerEditorParticipantsCache = [];

  if (sbwOrganizerTournamentParticipantsPanel) {
    sbwOrganizerTournamentParticipantsPanel.hidden = true;
  }

  sbwOrganizerEditorSetParticipantsMessage("");
}

async function sbwOrganizerEditorLoadParticipantsForTournament(tournament = sbwOrganizerEditorManagingTournament) {
  if (!sbwOrganizerTournamentParticipantsList || !tournament) return;

  if (typeof sbwGetTournamentParticipantsForOrganizerAsync !== "function") {
    sbwOrganizerEditorSetParticipantsMessage("Função de gestão de inscritos não carregada.", "error");
    return;
  }

  const tournamentKey = sbwOrganizerEditorGetTournamentKey(tournament);
  const organizerKey = sbwOrganizerEditorCurrent?.slug || sbwOrganizerEditorCurrent?.id || sbwOrganizerEditorSlug;

  try {
    sbwOrganizerTournamentParticipantsList.innerHTML = `<div class="organizer-admin-empty-row">Carregando inscritos reais da plataforma -SBW-...</div>`;
    sbwOrganizerEditorSetParticipantsMessage("Carregando inscritos do torneio...", "loading");

    const result = await sbwGetTournamentParticipantsForOrganizerAsync({
      organizer: organizerKey,
      tournament: tournamentKey
    });

    const participants = Array.isArray(result?.participants) ? result.participants : [];
    sbwOrganizerEditorParticipantsCache = participants;
    sbwOrganizerEditorRenderParticipants(participants);
    sbwOrganizerEditorSetParticipantsMessage(participants.length ? "Inscritos carregados." : "Nenhum inscrito real encontrado ainda.", participants.length ? "success" : "");
  } catch (error) {
    console.error("[SBW Organizadores] Erro ao carregar inscritos:", error);
    sbwOrganizerEditorParticipantsCache = [];
    sbwOrganizerEditorUpdateParticipantsStats([]);
    sbwOrganizerTournamentParticipantsList.innerHTML = `
      <div class="organizer-admin-empty-row">
        Não foi possível carregar os inscritos deste torneio agora.
      </div>
    `;
    sbwOrganizerEditorSetParticipantsMessage(error?.message || "Falha ao carregar inscritos.", "error");
  }
}

function sbwOrganizerEditorOpenParticipantsPanel(tournament) {
  if (!sbwOrganizerTournamentParticipantsPanel || !tournament) return;

  sbwOrganizerEditorManagingTournament = tournament;

  if (sbwOrganizerTournamentParticipantsTitle) {
    sbwOrganizerTournamentParticipantsTitle.textContent = sbwOrganizerEditorGetTournamentTitle(tournament);
  }

  if (sbwOrganizerTournamentParticipantsMeta) {
    const isTeamBattleLeagueTournament = sbwOrganizerEditorIsTeamBattleLeague4v4Format(sbwOrganizerEditorGetTournamentFormatValue(tournament));
    const unitLabel = isTeamBattleLeagueTournament ? "Equipes reais 4v4" : (typeof sbwGetParticipantsLabel === "function" ? sbwGetParticipantsLabel(tournament) : "Participantes");
    const meta = [
      sbwOrganizerEditorGetTournamentGame(tournament),
      sbwOrganizerEditorGetTournamentDate(tournament),
      unitLabel
    ].filter(Boolean).join(" · ");
    sbwOrganizerTournamentParticipantsMeta.textContent = meta || (isTeamBattleLeagueTournament ? "Gerencie equipes reais da plataforma -SBW-." : "Gerencie inscritos reais da plataforma -SBW-.");
  }

  if (sbwOrganizerTournamentParticipantsPublicLink) {
    sbwOrganizerTournamentParticipantsPublicLink.href = sbwOrganizerEditorGetTournamentDetailUrl(tournament);
  }

  sbwOrganizerTournamentParticipantsPanel.hidden = false;
  sbwOrganizerTournamentParticipantsPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  sbwOrganizerEditorLoadParticipantsForTournament(tournament);
}

async function sbwOrganizerEditorUpdateParticipantAction(participant, actionButton) {
  if (!participant || !sbwOrganizerEditorManagingTournament) return;

  if (typeof sbwUpdateTournamentParticipantForOrganizerAsync !== "function") {
    sbwOrganizerEditorSetParticipantsMessage("Função de atualização de inscritos não carregada.", "error");
    return;
  }

  const action = actionButton?.dataset?.organizerParticipantAction || "";
  const nextCheckIn = actionButton?.dataset?.organizerParticipantNext || "pending";
  const participantId = sbwOrganizerEditorGetParticipantKey(participant);
  const organizerKey = sbwOrganizerEditorCurrent?.slug || sbwOrganizerEditorCurrent?.id || sbwOrganizerEditorSlug;
  const tournamentKey = sbwOrganizerEditorGetTournamentKey(sbwOrganizerEditorManagingTournament);
  let payload = {};

  if (action === "checkin") {
    payload = { checkInStatus: nextCheckIn };
  } else if (action === "remove") {
    const playerName = participant?.name || participant?.playerName || "este inscrito";
    const confirmed = window.confirm(`Remover ${playerName} deste torneio? A inscrição ficará preservada como removida para histórico.`);
    if (!confirmed) return;
    payload = { status: "removed", checkInStatus: "missed" };
  } else {
    return;
  }

  try {
    actionButton.disabled = true;
    sbwOrganizerEditorSetParticipantsMessage("Atualizando inscrição...", "loading");

    await sbwUpdateTournamentParticipantForOrganizerAsync({
      organizer: organizerKey,
      tournament: tournamentKey,
      participantId,
      payload
    });

    sbwOrganizerEditorSetParticipantsMessage("Inscrição atualizada.", "success");
    await sbwOrganizerEditorLoadParticipantsForTournament();
    await sbwOrganizerEditorLoadTournaments();
  } catch (error) {
    console.error("[SBW Organizadores] Erro ao atualizar inscrito:", error);
    sbwOrganizerEditorSetParticipantsMessage(error?.message || "Não foi possível atualizar a inscrição.", "error");
  } finally {
    actionButton.disabled = false;
  }
}

function sbwOrganizerEditorBuildTeamBattlePlayoffsState(tournament) {
  const helper = window.SBWTeamBattleLeague;
  if (helper && typeof helper.buildTeamBattleLeagueOperationalPlayoffState === "function") {
    return helper.buildTeamBattleLeagueOperationalPlayoffState(tournament || {}, { leagueMode: "basic_single_division" });
  }
  return {
    ready: false,
    canGenerate: false,
    status: "locked",
    statusLabel: "Playoffs indisponíveis",
    lockReasons: ["Módulo Team Battle League 4v4 não carregado."],
    progress: { finishedMatches: 0, totalMatches: 0, label: "0/0 confrontos finalizados" },
    qualifiedTeams: [],
    playoffPreview: null,
    playoffPlan: null,
    rules: []
  };
}



function sbwOrganizerEditorBuildTeamBattleFinalSummary(tournament) {
  const helper = window.SBWTeamBattleLeague;
  if (helper && typeof helper.buildTeamBattleLeagueFinalSummary === "function") {
    return helper.buildTeamBattleLeagueFinalSummary(tournament || {}, { leagueMode: "basic_single_division" });
  }
  return {
    readyToFinalize: false,
    finalized: false,
    status: "waiting_champion",
    statusLabel: "Aguardando campeão",
    placements: [],
    publicDescription: "Módulo Team Battle League 4v4 não carregado."
  };
}

function sbwOrganizerEditorRenderTeamBattleFinalSummaryCard(finalSummary = {}) {
  const source = sbwOrganizerEditorAsObject(finalSummary);
  if (source.readyToFinalize !== true) return "";
  const placements = Array.isArray(source.placements) ? source.placements.slice(0, 4) : [];

  return `
    <div class="organizer-admin-team-battle-final-summary ${source.finalized ? "is-finished" : "is-ready"}">
      <div class="organizer-admin-team-battle-final-summary__head">
        <div>
          <span>${sbwOrganizerEditorEscape(source.statusLabel || "Final Team Battle")}</span>
          <strong>${sbwOrganizerEditorEscape(source.publicTitle || "Campeão definido")}</strong>
          <p>${sbwOrganizerEditorEscape(source.publicDescription || "Confira o pódio e finalize oficialmente o torneio.")}</p>
        </div>
        <em>${sbwOrganizerEditorEscape(source.finalized ? "Concluído" : "Pendente")}</em>
      </div>
      ${placements.length ? `
        <div class="organizer-admin-team-battle-final-summary__podium">
          ${placements.map((team) => `
            <article>
              <small>${sbwOrganizerEditorEscape(team.label || `${team.position || ""}º lugar`)}</small>
              <strong>${sbwOrganizerEditorEscape(team.teamName || team.name || "Equipe")}</strong>
            </article>
          `).join("")}
        </div>
      ` : ""}
      <p>${sbwOrganizerEditorEscape(source.progressLabel || "Playoffs finalizados.")}${source.finalizedAt ? ` · Encerrado em ${sbwOrganizerEditorEscape(String(source.finalizedAt).slice(0, 16).replace("T", " "))}` : ""}</p>
      ${source.finalized ? "" : `<button class="organizer-admin-small-link organizer-admin-small-link--button organizer-admin-small-link--cyan" type="button" data-team-battle-finalize="true">Finalizar Team Battle 4v4</button>`}
    </div>
  `;
}

function sbwOrganizerEditorGetTeamBattlePlayoffPlanForEditing(state = {}) {
  const helper = window.SBWTeamBattleLeague;
  const saved = sbwOrganizerEditorAsObject(state.savedPlayoffs);
  const plan = sbwOrganizerEditorAsObject(saved.plan || state.playoffPlan);

  if (helper && typeof helper.hydrateTeamBattlePlayoffPlanWithResults === "function") {
    return helper.hydrateTeamBattlePlayoffPlanWithResults(plan, { leagueMode: "basic_single_division" });
  }

  return plan;
}

function sbwOrganizerEditorFlattenTeamBattlePlayoffSeries(plan = {}) {
  const source = sbwOrganizerEditorAsObject(plan);
  const rows = [];
  const pushStage = (stage, groupLabel, groupIndex) => {
    const stageObj = sbwOrganizerEditorAsObject(stage);
    (Array.isArray(stageObj.matches) ? stageObj.matches : []).forEach((series, index) => {
      const item = sbwOrganizerEditorAsObject(series);
      const result = sbwOrganizerEditorAsObject(item.result);
      rows.push({
        id: String(item.id || `playoff-${groupIndex}-${index + 1}`),
        groupLabel: groupLabel || "Playoffs -SBW-",
        stageLabel: String(item.stageLabel || item.label || stageObj.label || "Playoff"),
        firstToLabel: String(item.firstToLabel || item.playoff?.firstToLabel || `FT${item.targetPoints || 50}`),
        homeTeamLabel: String(item.homeTeam?.teamName || item.homeTeam?.name || "Mandante"),
        awayTeamLabel: String(item.awayTeam?.teamName || item.awayTeam?.name || "Visitante"),
        homeIsPlaceholder: item.homeTeam?.placeholder === true || String(item.homeTeam?.id || "").startsWith("winner:"),
        awayIsPlaceholder: item.awayTeam?.placeholder === true || String(item.awayTeam?.id || "").startsWith("winner:"),
        source: item,
        result,
        order: Number(item.order || index + 1) || index + 1
      });
    });
  };

  (Array.isArray(source.divisionBrackets) ? source.divisionBrackets : []).forEach((bracket, bracketIndex) => {
    const bracketObj = sbwOrganizerEditorAsObject(bracket);
    (Array.isArray(bracketObj.stages) ? bracketObj.stages : []).forEach((stage, stageIndex) => {
      pushStage(stage, bracketObj.divisionName || bracketObj.rulesetLabel || "Divisão Única", `${bracketIndex + 1}-${stageIndex + 1}`);
    });
  });

  (Array.isArray(source.finalStages) ? source.finalStages : []).forEach((stage, stageIndex) => {
    pushStage(stage, "Final geral", `final-${stageIndex + 1}`);
  });

  return rows;
}

function sbwOrganizerEditorBuildTeamBattlePlayoffResultRows(state = {}) {
  const plan = sbwOrganizerEditorGetTeamBattlePlayoffPlanForEditing(state);
  return sbwOrganizerEditorFlattenTeamBattlePlayoffSeries(plan).map((row) => {
    const source = sbwOrganizerEditorAsObject(row.source);
    const result = sbwOrganizerEditorAsObject(source.result);
    const needsMoreSets = result.needsMoreSets === true && result.finalized !== true;
    const sets = Array.isArray(source.sets) ? source.sets.slice() : [];
    const helper = window.SBWTeamBattleLeague;

    if (needsMoreSets && sets.length < 9 && helper && typeof helper.createSflCapcomPlayoffSet === "function") {
      sets.push(helper.createSflCapcomPlayoffSet(sets.length + 1, {
        stageType: source.stageType || source.playoff?.stageType,
        stageLabel: source.stageLabel || source.label,
        id: `${source.id || row.id}-set-${sets.length + 1}`
      }, { leagueMode: "basic_single_division" }));
    }

    return {
      ...row,
      sets,
      scoreLabel: `${Number(result.homePoints || 0)} x ${Number(result.awayPoints || 0)}`,
      statusLabel: result.finalized === true
        ? `Finalizado · vencedor: ${result.winnerSide === "home" ? row.homeTeamLabel : row.awayTeamLabel}`
        : result.needsMoreSets === true
          ? "Série empatada ou sem meta atingida · adicione mais um set"
          : Number(result.playedSlots || 0) > 0
            ? "Em andamento"
            : "Aguardando resultado"
    };
  });
}

function sbwOrganizerEditorRenderTeamBattlePlayoffSlotFields(row, set, slot, setIndex, slotIndex) {
  const slotObj = sbwOrganizerEditorAsObject(slot);
  const score = sbwOrganizerEditorAsObject(slotObj.score);
  const fieldId = `${row.id}__${setIndex + 1}__${slotIndex + 1}`;
  const points = Number(slotObj.points || sbwOrganizerEditorGetTeamBattleSlotPoints(slotIndex + 1) || 0) || 0;

  return `
    <div class="organizer-admin-team-battle-playoff-slot" data-team-battle-playoff-slot="${sbwOrganizerEditorEscape(String(slotIndex + 1))}">
      <div class="organizer-admin-team-battle-playoff-slot__label">
        <strong>${sbwOrganizerEditorEscape(slotObj.label || `Partida ${slotIndex + 1}`)}</strong>
        <span>${points} pts</span>
      </div>
      <label>
        Vencedor
        <select data-team-battle-playoff-field="winnerSide" data-team-battle-playoff-slot-field="${sbwOrganizerEditorEscape(fieldId)}">
          <option value="" ${!slotObj.winnerSide ? "selected" : ""}>A definir</option>
          <option value="home" ${slotObj.winnerSide === "home" ? "selected" : ""}>${sbwOrganizerEditorEscape(row.homeTeamLabel)}</option>
          <option value="away" ${slotObj.winnerSide === "away" ? "selected" : ""}>${sbwOrganizerEditorEscape(row.awayTeamLabel)}</option>
        </select>
      </label>
      <label>
        Placar ${sbwOrganizerEditorEscape(row.homeTeamLabel)}
        <input type="number" min="0" max="9" step="1" data-team-battle-playoff-field="homeScore" data-team-battle-playoff-slot-field="${sbwOrganizerEditorEscape(fieldId)}" value="${Number(score.home || 0)}">
      </label>
      <label>
        Placar ${sbwOrganizerEditorEscape(row.awayTeamLabel)}
        <input type="number" min="0" max="9" step="1" data-team-battle-playoff-field="awayScore" data-team-battle-playoff-slot-field="${sbwOrganizerEditorEscape(fieldId)}" value="${Number(score.away || 0)}">
      </label>
    </div>
  `;
}

function sbwOrganizerEditorRenderTeamBattlePlayoffResultsEditor(rows = []) {
  if (!rows.length) {
    return `
      <div class="organizer-admin-team-battle-playoff-results is-empty">
        <strong>Resultados dos playoffs -SBW-</strong>
        <p>Libere a fase final primeiro. Depois o lançamento de resultados aparece aqui.</p>
      </div>
    `;
  }

  return `
    <div class="organizer-admin-team-battle-playoff-results">
      <div class="organizer-admin-team-battle-playoff-results__head">
        <div>
          <strong>Resultados dos playoffs -SBW-</strong>
          <p>Lance os sets da escada. O vencedor avança automaticamente para a próxima etapa.</p>
        </div>
        <span>FT50 / FT70</span>
      </div>
      ${rows.map((row) => {
        const disabled = row.homeIsPlaceholder || row.awayIsPlaceholder;
        return `
          <article class="organizer-admin-team-battle-playoff-result-row ${disabled ? "is-locked" : ""}" data-team-battle-playoff-series="${sbwOrganizerEditorEscape(row.id)}">
            <div class="organizer-admin-team-battle-playoff-result-row__main">
              <span>${sbwOrganizerEditorEscape(row.groupLabel)} · ${sbwOrganizerEditorEscape(row.stageLabel)}</span>
              <strong>${sbwOrganizerEditorEscape(row.homeTeamLabel)} <em>vs</em> ${sbwOrganizerEditorEscape(row.awayTeamLabel)}</strong>
              <small>${sbwOrganizerEditorEscape(row.firstToLabel)} · ${sbwOrganizerEditorEscape(row.statusLabel)} · ${sbwOrganizerEditorEscape(row.scoreLabel)}</small>
              ${disabled ? `<p>Aguardando vencedor da etapa anterior antes de lançar resultado.</p>` : `<p>Sem partida extra: continue adicionando sets até uma equipe atingir a meta de pontos.</p>`}
            </div>
            ${disabled ? "" : `
              <div class="organizer-admin-team-battle-playoff-sets">
                ${row.sets.map((set, setIndex) => {
                  const setObj = sbwOrganizerEditorAsObject(set);
                  const slots = Array.isArray(setObj.matches) ? setObj.matches : [];
                  return `
                    <div class="organizer-admin-team-battle-playoff-set" data-team-battle-playoff-set="${sbwOrganizerEditorEscape(String(setIndex + 1))}">
                      <strong>${sbwOrganizerEditorEscape(setObj.label || `Set ${setIndex + 1}`)}</strong>
                      <div>
                        ${slots.map((slot, slotIndex) => sbwOrganizerEditorRenderTeamBattlePlayoffSlotFields(row, setObj, slot, setIndex, slotIndex)).join("")}
                      </div>
                    </div>
                  `;
                }).join("")}
              </div>
            `}
          </article>
        `;
      }).join("")}
    </div>
  `;
}

function sbwOrganizerEditorCollectTeamBattlePlayoffResultRows(state = {}) {
  if (!sbwOrganizerTeamBattlePlayoffsList) return [];
  const helper = window.SBWTeamBattleLeague;
  const rows = sbwOrganizerEditorBuildTeamBattlePlayoffResultRows(state);

  return rows.map((row) => {
    const rowElement = Array.from(sbwOrganizerTeamBattlePlayoffsList.querySelectorAll("[data-team-battle-playoff-series]"))
      .find((item) => String(item.dataset.teamBattlePlayoffSeries || "") === String(row.id));

    if (!rowElement || row.homeIsPlaceholder || row.awayIsPlaceholder) {
      return row.source;
    }

    const sets = row.sets.map((set, setIndex) => {
      const setObj = sbwOrganizerEditorAsObject(set);
      const matches = (Array.isArray(setObj.matches) ? setObj.matches : []).map((slot, slotIndex) => {
        const slotObj = sbwOrganizerEditorAsObject(slot);
        const fieldId = `${row.id}__${setIndex + 1}__${slotIndex + 1}`;
        const slotFields = Array.from(rowElement.querySelectorAll("[data-team-battle-playoff-slot-field]"));
        const getFieldValue = (field) => {
          const input = slotFields.find((item) => String(item.dataset.teamBattlePlayoffSlotField || "") === fieldId && String(item.dataset.teamBattlePlayoffField || "") === field);
          return input?.value || "";
        };
        const winnerSide = String(getFieldValue("winnerSide")).trim();
        const homeScore = Number(getFieldValue("homeScore") || 0) || 0;
        const awayScore = Number(getFieldValue("awayScore") || 0) || 0;

        return {
          ...slotObj,
          winnerSide: winnerSide === "home" || winnerSide === "away" ? winnerSide : "",
          score: { home: homeScore, away: awayScore },
          status: winnerSide ? "finished" : "draft",
          metadata: {
            ...sbwOrganizerEditorAsObject(slotObj.metadata),
            source: "organizer-team-battle-playoff-result-editor",
            updatedAt: new Date().toISOString()
          }
        };
      });

      return {
        ...setObj,
        matches,
        status: matches.some((match) => match.winnerSide) ? "finished" : "draft",
        metadata: {
          ...sbwOrganizerEditorAsObject(setObj.metadata),
          updatedAt: new Date().toISOString()
        }
      };
    });

    const series = {
      ...row.source,
      sets,
      metadata: {
        ...sbwOrganizerEditorAsObject(row.source?.metadata),
        resultManagedByOrganizer: true,
        resultUpdatedAt: new Date().toISOString()
      }
    };

    return helper && typeof helper.createSflCapcomPlayoffSeries === "function"
      ? helper.createSflCapcomPlayoffSeries(series, { leagueMode: "basic_single_division" })
      : series;
  });
}

function sbwOrganizerEditorMergeTeamBattlePlayoffSeriesIntoPlan(plan = {}, editedSeries = []) {
  const source = JSON.parse(JSON.stringify(sbwOrganizerEditorAsObject(plan)));
  const map = new Map((Array.isArray(editedSeries) ? editedSeries : []).map((series) => [String(series?.id || ""), series]));
  const mergeStages = (stages = []) => (Array.isArray(stages) ? stages : []).map((stage) => ({
    ...stage,
    matches: (Array.isArray(stage.matches) ? stage.matches : []).map((series) => map.get(String(series?.id || "")) || series)
  }));

  return {
    ...source,
    divisionBrackets: (Array.isArray(source.divisionBrackets) ? source.divisionBrackets : []).map((bracket) => ({
      ...bracket,
      stages: mergeStages(bracket.stages)
    })),
    finalStages: mergeStages(source.finalStages)
  };
}

async function sbwOrganizerEditorSaveTeamBattlePlayoffResults(state = {}) {
  if (!sbwOrganizerEditorPlayoffsTournament) {
    sbwOrganizerEditorSetTeamBattlePlayoffsMessage("Selecione um torneio Team Battle League 4v4 para lançar playoffs.", "error");
    return;
  }

  if (typeof sbwUpdateTournamentForOrganizerAsync !== "function") {
    sbwOrganizerEditorSetTeamBattlePlayoffsMessage("Função de edição do torneio não carregada.", "error");
    return;
  }

  const helper = window.SBWTeamBattleLeague;
  const currentPlan = sbwOrganizerEditorGetTeamBattlePlayoffPlanForEditing(state);
  const editedSeries = sbwOrganizerEditorCollectTeamBattlePlayoffResultRows(state);
  const mergedPlan = sbwOrganizerEditorMergeTeamBattlePlayoffSeriesIntoPlan(currentPlan, editedSeries);
  const hydratedPlan = helper && typeof helper.hydrateTeamBattlePlayoffPlanWithResults === "function"
    ? helper.hydrateTeamBattlePlayoffPlanWithResults(mergedPlan, { leagueMode: "basic_single_division" })
    : mergedPlan;
  const preview = helper && typeof helper.buildTeamBattleLeaguePlayoffPreview === "function"
    ? helper.buildTeamBattleLeaguePlayoffPreview(hydratedPlan, { metadata: { operational: true, savedByOrganizer: true } })
    : state.playoffPreview;

  const tournament = sbwOrganizerEditorPlayoffsTournament;
  const tournamentKey = sbwOrganizerEditorGetTournamentKey(tournament);
  const metadata = sbwOrganizerEditorAsObject(tournament?.metadata);
  const settings = sbwOrganizerEditorAsObject(tournament?.settings);
  const metadataTeamBattle = sbwOrganizerEditorAsObject(metadata.teamBattleLeague || metadata.team_battle_league);
  const settingsTeamBattle = sbwOrganizerEditorAsObject(settings.teamBattleLeague || settings.team_battle_league);
  const teamBattleBase = {
    ...settingsTeamBattle,
    ...metadataTeamBattle
  };
  const now = new Date().toISOString();
  const progress = sbwOrganizerEditorAsObject(hydratedPlan.progress);
  const championTeam = sbwOrganizerEditorAsObject(hydratedPlan.championTeam || hydratedPlan.metadata?.championTeam);
  const playoffPayload = {
    ...sbwOrganizerEditorAsObject(teamBattleBase.playoffs),
    status: championTeam.teamName || championTeam.name ? "finished" : "ready",
    plan: hydratedPlan,
    preview,
    progress,
    championTeam: Object.keys(championTeam).length ? championTeam : null,
    resultsUpdatedAt: now,
    savedAt: teamBattleBase.playoffs?.savedAt || now,
    source: "organizer-team-battle-playoff-result-editor"
  };
  const auditEntry = sbwOrganizerEditorCreateTeamBattleAuditEntry(
    "playoffs_results_updated",
    championTeam.teamName || championTeam.name ? "Campeão definido" : "Resultados dos playoffs atualizados",
    championTeam.teamName || championTeam.name
      ? `Grande Final concluída. Campeão: ${championTeam.teamName || championTeam.name}.`
      : `${Number(progress.finalizedSeries || 0)}/${Number(progress.totalSeries || 0)} série${Number(progress.totalSeries || 0) === 1 ? "" : "s"} dos playoffs finalizada${Number(progress.totalSeries || 0) === 1 ? "" : "s"}.`,
    {
      tournamentKey,
      matchCount: Number(progress.totalSeries || 0) || 0,
      finishedCount: Number(progress.finalizedSeries || 0) || 0,
      source: "team-battle-playoff-results-editor"
    }
  );
  const auditLog = sbwOrganizerEditorBuildTeamBattleAuditLog(teamBattleBase, auditEntry);
  const teamBattlePayload = {
    ...teamBattleBase,
    auditLog,
    audit_log: auditLog,
    operationalAudit: auditLog,
    operational_audit: auditLog,
    playoffs: playoffPayload,
    playoffPlan: hydratedPlan,
    playoff_plan: hydratedPlan,
    playoffPreview: preview,
    playoff_preview: preview,
    playoffsStatus: playoffPayload.status,
    playoffs_status: playoffPayload.status,
    playoffsResultsUpdatedAt: now,
    playoffs_results_updated_at: now
  };

  try {
    if (sbwOrganizerTeamBattlePlayoffsSave) sbwOrganizerTeamBattlePlayoffsSave.disabled = true;
    sbwOrganizerEditorSetTeamBattlePlayoffsMessage("Salvando resultados dos playoffs -SBW-...", "loading");

    const result = await sbwUpdateTournamentForOrganizerAsync({
      organizer: sbwOrganizerEditorCurrent?.slug || sbwOrganizerEditorCurrent?.id || sbwOrganizerEditorSlug,
      tournamentId: tournamentKey,
      payload: {
        settings: {
          ...settings,
          teamBattleLeague: teamBattlePayload,
          team_battle_league: teamBattlePayload
        },
        metadata: {
          ...metadata,
          teamBattleLeague: teamBattlePayload,
          team_battle_league: teamBattlePayload
        }
      }
    });

    const updated = result?.tournament || result?.data || result?.row || result;
    if (updated && typeof updated === "object") {
      sbwOrganizerEditorPlayoffsTournament = updated;
    }

    sbwOrganizerEditorSetTeamBattlePlayoffsMessage(championTeam.teamName || championTeam.name ? "Playoffs finalizados. Campeão definido na página pública." : "Resultados dos playoffs salvos. Vencedores avançados automaticamente.", "success");
    await sbwOrganizerEditorLoadTournaments();
    if (updated && typeof updated === "object") {
      sbwOrganizerEditorOpenTeamBattlePlayoffsPanel(updated);
      sbwOrganizerEditorSetTeamBattlePlayoffsMessage(championTeam.teamName || championTeam.name ? "Playoffs finalizados. Campeão definido na página pública." : "Resultados dos playoffs salvos. Vencedores avançados automaticamente.", "success");
    }
  } catch (error) {
    console.error("[SBW Organizadores] Erro ao salvar resultados dos playoffs Team Battle:", error);
    sbwOrganizerEditorSetTeamBattlePlayoffsMessage(error?.message || "Não foi possível salvar os resultados dos playoffs -SBW-.", "error");
  } finally {
    if (sbwOrganizerTeamBattlePlayoffsSave) sbwOrganizerTeamBattlePlayoffsSave.disabled = false;
  }
}


async function sbwOrganizerEditorFinalizeTeamBattleTournament() {
  if (!sbwOrganizerEditorPlayoffsTournament) {
    sbwOrganizerEditorSetTeamBattlePlayoffsMessage("Selecione um torneio Team Battle League 4v4 para finalizar.", "error");
    return;
  }

  if (typeof sbwUpdateTournamentForOrganizerAsync !== "function") {
    sbwOrganizerEditorSetTeamBattlePlayoffsMessage("Função de edição do torneio não carregada.", "error");
    return;
  }

  const tournament = sbwOrganizerEditorPlayoffsTournament;
  const finalSummary = sbwOrganizerEditorBuildTeamBattleFinalSummary(tournament);
  if (finalSummary.readyToFinalize !== true) {
    sbwOrganizerEditorSetTeamBattlePlayoffsMessage("A Grande Final precisa estar finalizada antes de encerrar o Team Battle 4v4.", "error");
    return;
  }

  const tournamentKey = sbwOrganizerEditorGetTournamentKey(tournament);
  const metadata = sbwOrganizerEditorAsObject(tournament?.metadata);
  const settings = sbwOrganizerEditorAsObject(tournament?.settings);
  const metadataTeamBattle = sbwOrganizerEditorAsObject(metadata.teamBattleLeague || metadata.team_battle_league);
  const settingsTeamBattle = sbwOrganizerEditorAsObject(settings.teamBattleLeague || settings.team_battle_league);
  const teamBattleBase = {
    ...settingsTeamBattle,
    ...metadataTeamBattle
  };
  const now = new Date().toISOString();
  const champion = sbwOrganizerEditorAsObject(finalSummary.championTeam || finalSummary.placements?.[0]);
  const finalResults = {
    schemaVersion: "team-battle-league-4v4-final-v1",
    formatKey: "team-battle-league-4v4",
    status: "finished",
    champion,
    winner: champion,
    placements: Array.isArray(finalSummary.placements) ? finalSummary.placements : [],
    standings: Array.isArray(finalSummary.placements) ? finalSummary.placements : [],
    finalStandings: Array.isArray(finalSummary.placements) ? finalSummary.placements : [],
    final_standings: Array.isArray(finalSummary.placements) ? finalSummary.placements : [],
    finalizedAt: now,
    finalized_at: now,
    rankingApplied: false,
    ranking_applied: false,
    source: "team-battle-league-4v4-playoffs-sbw"
  };
  const auditEntry = sbwOrganizerEditorCreateTeamBattleAuditEntry(
    "team_battle_finalized",
    "Team Battle finalizado",
    `Torneio encerrado oficialmente. Campeão: ${champion.teamName || champion.name || "Equipe campeã"}.`,
    {
      tournamentKey,
      matchCount: Number(finalSummary.totalSeries || 0) || 0,
      finishedCount: Number(finalSummary.finalizedSeries || 0) || 0,
      source: "team-battle-finalize"
    }
  );
  const auditLog = sbwOrganizerEditorBuildTeamBattleAuditLog(teamBattleBase, auditEntry);
  const teamBattlePayload = {
    ...teamBattleBase,
    auditLog,
    audit_log: auditLog,
    operationalAudit: auditLog,
    operational_audit: auditLog,
    finalStatus: "finished",
    final_status: "finished",
    finalSummary: {
      ...finalSummary,
      finalized: true,
      finalizedAt: now,
      status: "finished",
      statusLabel: "Team Battle finalizado"
    },
    final_summary: {
      ...finalSummary,
      finalized: true,
      finalizedAt: now,
      status: "finished",
      statusLabel: "Team Battle finalizado"
    },
    completedAt: now,
    completed_at: now,
    finalizedAt: now,
    finalized_at: now
  };

  try {
    sbwOrganizerEditorSetTeamBattlePlayoffsMessage("Finalizando Team Battle 4v4...", "loading");
    const result = await sbwUpdateTournamentForOrganizerAsync({
      organizer: sbwOrganizerEditorCurrent?.slug || sbwOrganizerEditorCurrent?.id || sbwOrganizerEditorSlug,
      tournamentId: tournamentKey,
      payload: {
        status: "completed",
        settings: {
          ...settings,
          teamBattleLeague: teamBattlePayload,
          team_battle_league: teamBattlePayload,
          finalResults,
          final_results: finalResults
        },
        metadata: {
          ...metadata,
          teamBattleLeague: teamBattlePayload,
          team_battle_league: teamBattlePayload,
          finalResults,
          final_results: finalResults
        }
      }
    });

    const updated = result?.tournament || result?.data || result?.row || result;
    await sbwOrganizerEditorLoadTournaments();
    if (updated && typeof updated === "object") {
      sbwOrganizerEditorOpenTeamBattlePlayoffsPanel(updated);
    }
    sbwOrganizerEditorSetTeamBattlePlayoffsMessage("Team Battle 4v4 finalizado. Campeão e pódio publicados na página pública.", "success");
  } catch (error) {
    console.error("[SBW Organizadores] Erro ao finalizar Team Battle:", error);
    sbwOrganizerEditorSetTeamBattlePlayoffsMessage(error?.message || "Não foi possível finalizar o Team Battle 4v4.", "error");
  }
}

function sbwOrganizerEditorHideTeamBattlePlayoffsPanel() {
  sbwOrganizerEditorPlayoffsTournament = null;
  sbwOrganizerTeamBattlePlayoffsStateCache = null;

  if (sbwOrganizerTeamBattlePlayoffsPanel) {
    sbwOrganizerTeamBattlePlayoffsPanel.hidden = true;
  }

  sbwOrganizerEditorSetTeamBattlePlayoffsMessage("");
}

function sbwOrganizerEditorRenderTeamBattlePlayoffsPanel(tournament) {
  if (!sbwOrganizerTeamBattlePlayoffsList) return;

  const state = sbwOrganizerEditorBuildTeamBattlePlayoffsState(tournament);
  sbwOrganizerTeamBattlePlayoffsStateCache = state;
  const preview = state.playoffPreview || {};
  const qualified = Array.isArray(state.qualifiedTeams) ? state.qualifiedTeams : [];
  const matches = Array.isArray(preview.matches) ? preview.matches : [];
  const rules = Array.isArray(state.rules) && state.rules.length ? state.rules : (Array.isArray(preview.rules) ? preview.rules : []);
  const lockReasons = Array.isArray(state.lockReasons) ? state.lockReasons : [];
  const saved = state.savedPlayoffs?.saved === true;
  const playoffResultRows = saved ? sbwOrganizerEditorBuildTeamBattlePlayoffResultRows(state) : [];
  const championTeam = state.playoffPreview?.championTeam || state.playoffPlan?.championTeam || state.savedPlayoffs?.source?.championTeam || null;
  const finalSummary = sbwOrganizerEditorBuildTeamBattleFinalSummary(tournament);

  if (sbwOrganizerTeamBattlePlayoffsSave) {
    sbwOrganizerTeamBattlePlayoffsSave.disabled = saved ? false : state.canGenerate !== true;
    sbwOrganizerTeamBattlePlayoffsSave.textContent = saved ? "Salvar resultados dos playoffs -SBW-" : "Liberar playoffs -SBW-";
  }

  sbwOrganizerTeamBattlePlayoffsList.innerHTML = `
    <div class="organizer-admin-team-battle-playoffs-status ${state.canGenerate ? "is-ready" : "is-locked"}">
      <div>
        <span>${sbwOrganizerEditorEscape(state.statusLabel || "Playoffs -SBW-")}</span>
        <strong>${sbwOrganizerEditorEscape(state.progress?.label || "Fase classificatória")}</strong>
        <p>${saved ? `Playoffs já liberados${state.savedPlayoffs?.savedAt ? ` em ${sbwOrganizerEditorEscape(String(state.savedPlayoffs.savedAt).slice(0, 16).replace("T", " "))}` : ""}.` : "A liberação grava o Top 4 e a escada -SBW- nos metadados do torneio."}</p>
      </div>
      <em>${state.canGenerate ? "Pronto" : "Travado"}</em>
    </div>

    ${lockReasons.length ? `
      <div class="organizer-admin-team-battle-playoffs-locks">
        ${lockReasons.map((reason) => `<span>${sbwOrganizerEditorEscape(reason)}</span>`).join("")}
      </div>
    ` : ""}

    ${championTeam ? `
      <div class="organizer-admin-team-battle-playoffs-champion">
        <span>Campeão definido</span>
        <strong>${sbwOrganizerEditorEscape(championTeam.teamName || championTeam.name || "Campeão")}</strong>
        <p>Grande Final finalizada nos Playoffs -SBW-.</p>
      </div>
    ` : ""}

    ${sbwOrganizerEditorRenderTeamBattleFinalSummaryCard(finalSummary)}

    <div class="organizer-admin-team-battle-playoffs-qualified">
      <strong>Top 4 classificado</strong>
      <div>
        ${qualified.length ? qualified.map((team, index) => `
          <article>
            <small>${sbwOrganizerEditorEscape(team.label || `${index + 1}º colocado`)}</small>
            <span>${sbwOrganizerEditorEscape(team.teamName || team.name || "Equipe classificada")}</span>
          </article>
        `).join("") : `
          <article class="is-empty">
            <small>Aguardando classificação</small>
            <span>O Top 4 será gerado a partir dos resultados finalizados.</span>
          </article>
        `}
      </div>
    </div>

    <div class="organizer-admin-team-battle-playoffs-bracket">
      <strong>Escada -SBW- · escada Top 4</strong>
      ${matches.length ? matches.map((match) => `
        <article>
          <small>${sbwOrganizerEditorEscape(match.stageLabel || "Playoff")}</small>
          <span>${sbwOrganizerEditorEscape(match.homeTeamLabel || "Classificado")} <em>vs</em> ${sbwOrganizerEditorEscape(match.awayTeamLabel || "Classificado")}</span>
          <p>${sbwOrganizerEditorEscape(match.firstToLabel || "FT")}; ${match.noExtraMatch ? "sem partida extra" : "partida extra se necessário"}</p>
        </article>
      `).join("") : `
        <article class="is-empty">
          <small>Modelo</small>
          <span>3º x 4º <em>→</em> 2º <em>→</em> 1º</span>
          <p>Quartas/Semifinal FT50; Grande Final FT70.</p>
        </article>
      `}
    </div>

    ${saved ? sbwOrganizerEditorRenderTeamBattlePlayoffResultsEditor(playoffResultRows) : ""}

    ${sbwOrganizerEditorRenderTeamBattleAuditTrail(tournament, { limit: 7 })}

    ${rules.length ? `
      <div class="organizer-admin-team-battle-playoffs-rules">
        ${rules.map((rule) => `<span>${sbwOrganizerEditorEscape(rule)}</span>`).join("")}
      </div>
    ` : ""}
  `;
}

function sbwOrganizerEditorOpenTeamBattlePlayoffsPanel(tournament) {
  if (!sbwOrganizerTeamBattlePlayoffsPanel || !tournament) return;

  const format = sbwOrganizerEditorGetTournamentFormatValue(tournament);
  if (!sbwOrganizerEditorIsTeamBattleLeague4v4Format(format)) {
    sbwOrganizerEditorSetTeamBattlePlayoffsMessage("Os playoffs -SBW- estão disponíveis apenas para Team Battle League 4v4.", "error");
    return;
  }

  sbwOrganizerEditorPlayoffsTournament = tournament;

  if (sbwOrganizerTeamBattlePlayoffsTitle) {
    sbwOrganizerTeamBattlePlayoffsTitle.textContent = sbwOrganizerEditorGetTournamentTitle(tournament);
  }

  if (sbwOrganizerTeamBattlePlayoffsMeta) {
    sbwOrganizerTeamBattlePlayoffsMeta.textContent = "Libere a escada -SBW- a partir do Top 4 real da Divisão Única somente depois da fase classificatória.";
  }

  if (sbwOrganizerTeamBattlePlayoffsPublicLink) {
    sbwOrganizerTeamBattlePlayoffsPublicLink.href = sbwOrganizerEditorGetTournamentDetailUrl(tournament);
  }

  sbwOrganizerEditorRenderTeamBattlePlayoffsPanel(tournament);
  sbwOrganizerTeamBattlePlayoffsPanel.hidden = false;
  sbwOrganizerEditorSetTeamBattlePlayoffsMessage("Playoffs carregados. A liberação só fica ativa quando a fase classificatória estiver completa.");
  sbwOrganizerTeamBattlePlayoffsPanel.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function sbwOrganizerEditorSaveTeamBattlePlayoffs() {
  if (!sbwOrganizerEditorPlayoffsTournament) {
    sbwOrganizerEditorSetTeamBattlePlayoffsMessage("Selecione um torneio Team Battle League 4v4 para liberar playoffs.", "error");
    return;
  }

  if (typeof sbwUpdateTournamentForOrganizerAsync !== "function") {
    sbwOrganizerEditorSetTeamBattlePlayoffsMessage("Função de edição do torneio não carregada.", "error");
    return;
  }

  const state = sbwOrganizerEditorBuildTeamBattlePlayoffsState(sbwOrganizerEditorPlayoffsTournament);
  if (state.savedPlayoffs?.saved === true) {
    await sbwOrganizerEditorSaveTeamBattlePlayoffResults(state);
    return;
  }

  if (state.canGenerate !== true) {
    sbwOrganizerEditorSetTeamBattlePlayoffsMessage("Finalize todos os confrontos da fase classificatória antes de liberar os playoffs -SBW-.", "error");
    sbwOrganizerEditorRenderTeamBattlePlayoffsPanel(sbwOrganizerEditorPlayoffsTournament);
    return;
  }

  const tournament = sbwOrganizerEditorPlayoffsTournament;
  const tournamentKey = sbwOrganizerEditorGetTournamentKey(tournament);
  const metadata = sbwOrganizerEditorAsObject(tournament?.metadata);
  const settings = sbwOrganizerEditorAsObject(tournament?.settings);
  const metadataTeamBattle = sbwOrganizerEditorAsObject(metadata.teamBattleLeague || metadata.team_battle_league);
  const settingsTeamBattle = sbwOrganizerEditorAsObject(settings.teamBattleLeague || settings.team_battle_league);
  const teamBattleBase = {
    ...settingsTeamBattle,
    ...metadataTeamBattle
  };
  const now = new Date().toISOString();
  const playoffPayload = {
    status: "ready",
    ruleset: state.playoffPlan?.ruleset || "sfl_capcom_basic_stepladder",
    rulesetLabel: state.playoffPlan?.rulesetLabel || "-SBW- · escada Top 4 · escada Top 4",
    plan: state.playoffPlan,
    preview: state.playoffPreview,
    qualifiedTeams: state.qualifiedTeams,
    progress: state.progress,
    generatedAt: now,
    savedAt: now,
    source: "organizer-team-battle-playoffs-editor"
  };
  const auditEntry = sbwOrganizerEditorCreateTeamBattleAuditEntry(
    "playoffs_unlocked",
    "Playoffs liberados",
    "Playoffs -SBW- liberados a partir do Top 4 real da Divisão Única.",
    {
      tournamentKey,
      matchCount: Number(state.progress?.totalMatches || 0) || 0,
      finishedCount: Number(state.progress?.finishedMatches || 0) || 0,
      source: "team-battle-playoffs-unlock"
    }
  );
  const auditLog = sbwOrganizerEditorBuildTeamBattleAuditLog(teamBattleBase, auditEntry);
  const teamBattlePayload = {
    ...teamBattleBase,
    auditLog,
    audit_log: auditLog,
    operationalAudit: auditLog,
    operational_audit: auditLog,
    playoffs: playoffPayload,
    playoffPlan: state.playoffPlan,
    playoff_plan: state.playoffPlan,
    playoffPreview: state.playoffPreview,
    playoff_preview: state.playoffPreview,
    playoffsStatus: "ready",
    playoffs_status: "ready",
    playoffsUnlockedAt: now,
    playoffs_unlocked_at: now
  };

  try {
    if (sbwOrganizerTeamBattlePlayoffsSave) sbwOrganizerTeamBattlePlayoffsSave.disabled = true;
    sbwOrganizerEditorSetTeamBattlePlayoffsMessage("Salvando playoffs -SBW-...", "loading");

    const result = await sbwUpdateTournamentForOrganizerAsync({
      organizer: sbwOrganizerEditorCurrent?.slug || sbwOrganizerEditorCurrent?.id || sbwOrganizerEditorSlug,
      tournamentId: tournamentKey,
      payload: {
        settings: {
          ...settings,
          teamBattleLeague: teamBattlePayload,
          team_battle_league: teamBattlePayload
        },
        metadata: {
          ...metadata,
          teamBattleLeague: teamBattlePayload,
          team_battle_league: teamBattlePayload
        }
      }
    });

    const updated = result?.tournament || result?.data || result?.row || result;
    if (updated && typeof updated === "object") {
      sbwOrganizerEditorPlayoffsTournament = updated;
    }

    sbwOrganizerEditorSetTeamBattlePlayoffsMessage("Playoffs -SBW- liberados. A página pública já pode exibir a escada Top 4.", "success");
    await sbwOrganizerEditorLoadTournaments();
    if (updated && typeof updated === "object") {
      sbwOrganizerEditorOpenTeamBattlePlayoffsPanel(updated);
      sbwOrganizerEditorSetTeamBattlePlayoffsMessage("Playoffs -SBW- liberados. A página pública já pode exibir a escada Top 4.", "success");
    }
  } catch (error) {
    console.error("[SBW Organizadores] Erro ao liberar playoffs Team Battle:", error);
    sbwOrganizerEditorSetTeamBattlePlayoffsMessage(error?.message || "Não foi possível salvar os playoffs -SBW-.", "error");
  } finally {
    if (sbwOrganizerTeamBattlePlayoffsSave) sbwOrganizerTeamBattlePlayoffsSave.disabled = state.canGenerate !== true;
  }
}

function sbwOrganizerEditorHideTeamBattleSchedulePanel() {
  sbwOrganizerEditorSchedulingTournament = null;
  sbwOrganizerTeamBattleScheduleRowsCache = [];

  if (sbwOrganizerTeamBattleSchedulePanel) {
    sbwOrganizerTeamBattleSchedulePanel.hidden = true;
  }

  sbwOrganizerEditorSetTeamBattleScheduleMessage("");
}

function sbwOrganizerEditorRenderTeamBattleSchedulePanel(tournament) {
  if (!sbwOrganizerTeamBattleScheduleList) return;

  const rows = sbwOrganizerEditorBuildTeamBattleScheduleRows(tournament);
  sbwOrganizerTeamBattleScheduleRowsCache = rows;

  if (!rows.length) {
    sbwOrganizerTeamBattleScheduleList.innerHTML = `
      <div class="organizer-admin-empty-row">
        A agenda editável aparece depois que o check-in gerar confrontos reais da Divisão Única. Nenhuma equipe fake será criada para montar esta lista.
      </div>
    `;

    if (sbwOrganizerTeamBattleScheduleSave) {
      sbwOrganizerTeamBattleScheduleSave.disabled = true;
    }
    return;
  }

  if (sbwOrganizerTeamBattleScheduleSave) {
    sbwOrganizerTeamBattleScheduleSave.disabled = false;
  }

  sbwOrganizerTeamBattleScheduleList.innerHTML = rows.map((row) => {
    const schedule = row.schedule || {};
    return `
      <article class="organizer-admin-team-battle-schedule-row" data-team-battle-schedule-row="${sbwOrganizerEditorEscape(row.id)}">
        <div class="organizer-admin-team-battle-schedule-row__main">
          <span>${sbwOrganizerEditorEscape(row.roundLabel)}</span>
          <strong>${sbwOrganizerEditorEscape(row.homeTeamLabel)} <em>vs</em> ${sbwOrganizerEditorEscape(row.awayTeamLabel)}</strong>
          <small>${sbwOrganizerEditorEscape(row.label)} · ${sbwOrganizerEditorEscape(schedule.statusLabel || "A definir pelo organizador")}</small>
        </div>

        <div class="organizer-admin-team-battle-schedule-fields">
          <label>
            Data
            <input type="date" data-team-battle-schedule-field="date" value="${sbwOrganizerEditorEscape(schedule.date || "")}">
          </label>
          <label>
            Horário
            <input type="time" data-team-battle-schedule-field="time" value="${sbwOrganizerEditorEscape(schedule.time || "")}">
          </label>
          <label>
            Status
            <select data-team-battle-schedule-field="status">
              ${[
                ["to_define", "A definir"],
                ["scheduled", "Agendado"],
                ["live", "Ao vivo"],
                ["postponed", "Adiado/remarcando"],
                ["finished", "Finalizado"],
                ["cancelled", "Cancelado"]
              ].map(([value, label]) => `<option value="${value}" ${String(schedule.status || "to_define") === value ? "selected" : ""}>${label}</option>`).join("")}
            </select>
          </label>
          <label>
            Transmissão
            <input type="url" data-team-battle-schedule-field="streamUrl" value="${sbwOrganizerEditorEscape(schedule.streamUrl || "")}" placeholder="https://...">
          </label>
          <label class="is-wide">
            Observação
            <input type="text" data-team-battle-schedule-field="note" value="${sbwOrganizerEditorEscape(schedule.note || "")}" placeholder="Ex: rodada remarcada, lobby, canal ou instrução pública">
          </label>
        </div>
      </article>
    `;
  }).join("") + sbwOrganizerEditorRenderTeamBattleAuditTrail(tournament, { limit: 5, compact: true });
}

function sbwOrganizerEditorOpenTeamBattleSchedulePanel(tournament) {
  if (!sbwOrganizerTeamBattleSchedulePanel || !tournament) return;

  const format = sbwOrganizerEditorGetTournamentFormatValue(tournament);
  if (!sbwOrganizerEditorIsTeamBattleLeague4v4Format(format)) {
    sbwOrganizerEditorSetTeamBattleScheduleMessage("A agenda livre por confronto está disponível apenas para Team Battle League 4v4.", "error");
    return;
  }

  sbwOrganizerEditorSchedulingTournament = tournament;

  if (sbwOrganizerTeamBattleScheduleTitle) {
    sbwOrganizerTeamBattleScheduleTitle.textContent = sbwOrganizerEditorGetTournamentTitle(tournament);
  }

  if (sbwOrganizerTeamBattleScheduleMeta) {
    sbwOrganizerTeamBattleScheduleMeta.textContent = "Gerencie datas, horários, status, observações e transmissão dos confrontos reais do Team Battle League 4v4.";
  }

  if (sbwOrganizerTeamBattleSchedulePublicLink) {
    sbwOrganizerTeamBattleSchedulePublicLink.href = sbwOrganizerEditorGetTournamentDetailUrl(tournament);
  }

  sbwOrganizerEditorRenderTeamBattleSchedulePanel(tournament);
  sbwOrganizerTeamBattleSchedulePanel.hidden = false;
  sbwOrganizerEditorSetTeamBattleScheduleMessage("Agenda livre carregada. Salve apenas depois de revisar os confrontos.");
  sbwOrganizerTeamBattleSchedulePanel.scrollIntoView({ behavior: "smooth", block: "start" });
}

function sbwOrganizerEditorCollectTeamBattleScheduleRows() {
  if (!sbwOrganizerTeamBattleScheduleList) return [];

  return sbwOrganizerTeamBattleScheduleRowsCache.map((row) => {
    const element = Array.from(sbwOrganizerTeamBattleScheduleList.querySelectorAll("[data-team-battle-schedule-row]"))
      .find((item) => String(item.dataset.teamBattleScheduleRow || "") === String(row.id));
    const getValue = (field) => String(element?.querySelector(`[data-team-battle-schedule-field="${field}"]`)?.value || "").trim();
    const date = getValue("date");
    const time = getValue("time");
    const status = getValue("status") || "to_define";
    const streamUrl = getValue("streamUrl");
    const note = getValue("note");
    const scheduledAt = date ? `${date}T${time || "00:00"}:00` : "";

    return {
      ...row.source,
      id: row.id,
      matchId: row.id,
      round: row.round,
      label: row.label,
      roundLabel: row.roundLabel,
      schedule: {
        organizerManaged: true,
        mode: "organizer_per_match",
        status,
        date,
        time,
        scheduledAt,
        timezone: "America/Sao_Paulo",
        note,
        streamUrl,
        publicVisible: true,
        editableByOrganizer: true,
        allowReschedule: true,
        updatedAt: new Date().toISOString()
      },
      scheduling: {
        organizerManaged: true,
        mode: "organizer_per_match",
        status,
        date,
        time,
        scheduledAt,
        timezone: "America/Sao_Paulo",
        note,
        streamUrl,
        publicVisible: true,
        editableByOrganizer: true,
        allowReschedule: true,
        updatedAt: new Date().toISOString()
      },
      scheduleStatus: status,
      scheduledAt,
      scheduledDate: date,
      scheduledTime: time,
      timezone: "America/Sao_Paulo",
      streamUrl,
      metadata: {
        ...sbwOrganizerEditorAsObject(row.source?.metadata),
        scheduling: {
          organizerManaged: true,
          mode: "organizer_per_match",
          status,
          date,
          time,
          scheduledAt,
          timezone: "America/Sao_Paulo",
          note,
          streamUrl,
          publicVisible: true,
          editableByOrganizer: true,
          allowReschedule: true,
          updatedAt: new Date().toISOString()
        },
        organizerManagedSchedule: true
      }
    };
  });
}

function sbwOrganizerEditorMergeTeamBattleScheduledMatches(tournament, scheduledMatches) {
  const map = new Map();

  sbwOrganizerEditorGetTeamBattleScheduleSavedMatches(tournament).forEach((match) => {
    const item = sbwOrganizerEditorAsObject(match);
    map.set(sbwOrganizerEditorGetTeamBattleMatchMergeKey(item), item);
  });

  scheduledMatches.forEach((match) => {
    const item = sbwOrganizerEditorAsObject(match);
    const key = sbwOrganizerEditorGetTeamBattleMatchMergeKey(item);
    const previous = map.get(key) || {};
    map.set(key, {
      ...previous,
      ...item,
      matches: Array.isArray(previous.matches) && previous.matches.length ? previous.matches : item.matches,
      extraMatch: previous.extraMatch || previous.extra_match || item.extraMatch || item.extra_match,
      result: previous.result || item.result,
      status: previous.status || item.status || "draft"
    });
  });

  return Array.from(map.values());
}

async function sbwOrganizerEditorSaveTeamBattleSchedule() {
  if (!sbwOrganizerEditorSchedulingTournament) {
    sbwOrganizerEditorSetTeamBattleScheduleMessage("Selecione um torneio Team Battle League 4v4 para editar a agenda.", "error");
    return;
  }

  if (typeof sbwUpdateTournamentForOrganizerAsync !== "function") {
    sbwOrganizerEditorSetTeamBattleScheduleMessage("Função de edição do torneio não carregada.", "error");
    return;
  }

  const scheduledRows = sbwOrganizerEditorCollectTeamBattleScheduleRows();
  if (!scheduledRows.length) {
    sbwOrganizerEditorSetTeamBattleScheduleMessage("Nenhum confronto real foi encontrado para salvar agenda.", "error");
    return;
  }

  const tournament = sbwOrganizerEditorSchedulingTournament;
  const tournamentKey = sbwOrganizerEditorGetTournamentKey(tournament);
  const metadata = sbwOrganizerEditorAsObject(tournament?.metadata);
  const settings = sbwOrganizerEditorAsObject(tournament?.settings);
  const metadataTeamBattle = sbwOrganizerEditorAsObject(metadata.teamBattleLeague || metadata.team_battle_league);
  const settingsTeamBattle = sbwOrganizerEditorAsObject(settings.teamBattleLeague || settings.team_battle_league);
  const teamBattleBase = {
    ...settingsTeamBattle,
    ...metadataTeamBattle
  };
  const mergedMatches = sbwOrganizerEditorMergeTeamBattleScheduledMatches(tournament, scheduledRows);
  const now = new Date().toISOString();
  const matchScheduling = {
    ...sbwOrganizerEditorAsObject(settings.matchScheduling || metadata.matchScheduling || teamBattleBase.matchScheduling),
    organizerManaged: true,
    mode: "organizer_per_match",
    timezone: "America/Sao_Paulo",
    allowRoundSchedule: true,
    allowMatchScheduleOverride: true,
    allowReschedule: true,
    longFormLeague: true,
    updatedAt: now
  };
  const auditEntry = sbwOrganizerEditorCreateTeamBattleAuditEntry(
    "schedule_updated",
    "Agenda atualizada",
    `Agenda livre salva para ${mergedMatches.length} confronto${mergedMatches.length === 1 ? "" : "s"}.`,
    {
      tournamentKey,
      matchCount: mergedMatches.length,
      source: "team-battle-schedule-editor"
    }
  );
  const auditLog = sbwOrganizerEditorBuildTeamBattleAuditLog(teamBattleBase, auditEntry);
  const teamBattlePayload = {
    ...teamBattleBase,
    auditLog,
    audit_log: auditLog,
    operationalAudit: auditLog,
    operational_audit: auditLog,
    matches: mergedMatches,
    teamMatches: mergedMatches,
    team_matches: mergedMatches,
    results: {
      ...sbwOrganizerEditorAsObject(teamBattleBase.results),
      matches: mergedMatches,
      updatedAt: now
    },
    matchScheduling,
    organizerManagedSchedule: true,
    scheduleUpdatedAt: now
  };

  try {
    if (sbwOrganizerTeamBattleScheduleSave) sbwOrganizerTeamBattleScheduleSave.disabled = true;
    sbwOrganizerEditorSetTeamBattleScheduleMessage("Salvando agenda das partidas...", "loading");

    const result = await sbwUpdateTournamentForOrganizerAsync({
      organizer: sbwOrganizerEditorCurrent?.slug || sbwOrganizerEditorCurrent?.id || sbwOrganizerEditorSlug,
      tournamentId: tournamentKey,
      payload: {
        settings: {
          ...settings,
          matchScheduling,
          organizerManagedSchedule: true,
          teamBattleLeague: teamBattlePayload,
          team_battle_league: teamBattlePayload
        },
        metadata: {
          ...metadata,
          matchScheduling,
          organizerManagedSchedule: true,
          teamBattleLeague: teamBattlePayload,
          team_battle_league: teamBattlePayload
        }
      }
    });

    const updated = result?.tournament || result?.data || result?.row || result;
    if (updated && typeof updated === "object") {
      sbwOrganizerEditorSchedulingTournament = updated;
    }

    sbwOrganizerEditorSetTeamBattleScheduleMessage("Agenda das partidas salva com sucesso.", "success");
    await sbwOrganizerEditorLoadTournaments();
    if (updated && typeof updated === "object") {
      sbwOrganizerEditorOpenTeamBattleSchedulePanel(updated);
      sbwOrganizerEditorSetTeamBattleScheduleMessage("Agenda das partidas salva com sucesso.", "success");
    }
  } catch (error) {
    console.error("[SBW Organizadores] Erro ao salvar agenda Team Battle:", error);
    sbwOrganizerEditorSetTeamBattleScheduleMessage(error?.message || "Não foi possível salvar a agenda das partidas.", "error");
  } finally {
    if (sbwOrganizerTeamBattleScheduleSave) sbwOrganizerTeamBattleScheduleSave.disabled = false;
  }
}

function sbwOrganizerEditorHideTeamBattleResultsPanel() {
  sbwOrganizerEditorResultsTournament = null;
  sbwOrganizerTeamBattleResultsRowsCache = [];

  if (sbwOrganizerTeamBattleResultsPanel) {
    sbwOrganizerTeamBattleResultsPanel.hidden = true;
  }

  sbwOrganizerEditorSetTeamBattleResultsMessage("");
}

function sbwOrganizerEditorRenderTeamBattleResultsPanel(tournament) {
  if (!sbwOrganizerTeamBattleResultsList) return;

  const rows = sbwOrganizerEditorBuildTeamBattleResultsRows(tournament);
  sbwOrganizerTeamBattleResultsRowsCache = rows;

  if (!rows.length) {
    sbwOrganizerTeamBattleResultsList.innerHTML = `
      <div class="organizer-admin-empty-row">
        Os resultados editáveis aparecem depois que o check-in gerar confrontos reais da Divisão Única. Nenhuma equipe fake será criada para lançar placar.
      </div>
    `;

    if (sbwOrganizerTeamBattleResultsSave) {
      sbwOrganizerTeamBattleResultsSave.disabled = true;
    }
    return;
  }

  if (sbwOrganizerTeamBattleResultsSave) {
    sbwOrganizerTeamBattleResultsSave.disabled = false;
  }

  sbwOrganizerTeamBattleResultsList.innerHTML = rows.map((row) => {
    const summary = row.resultSummary || {};
    const scoreLabel = `${Number(summary.homePoints || 0)} x ${Number(summary.awayPoints || 0)}`;
    const statusLabel = summary.finalized
      ? "Finalizado"
      : summary.extraRequired
        ? "Partida extra necessária"
        : Number(summary.homePoints || 0) || Number(summary.awayPoints || 0)
          ? "Em andamento"
          : "Aguardando resultado";

    return `
      <article class="organizer-admin-team-battle-result-row" data-team-battle-result-row="${sbwOrganizerEditorEscape(row.id)}">
        <div class="organizer-admin-team-battle-result-row__main">
          <span>${sbwOrganizerEditorEscape(row.roundLabel)}</span>
          <strong>${sbwOrganizerEditorEscape(row.homeTeamLabel)} <em>vs</em> ${sbwOrganizerEditorEscape(row.awayTeamLabel)}</strong>
          <small>${sbwOrganizerEditorEscape(row.label)} · ${sbwOrganizerEditorEscape(statusLabel)} · ${sbwOrganizerEditorEscape(scoreLabel)}</small>
          <p>Use as 3 partidas principais. A partida extra só conta quando as principais terminarem empatadas em pontos.</p>
        </div>

        <div class="organizer-admin-team-battle-result-fields">
          ${row.mainMatches.map((slot) => sbwOrganizerEditorRenderTeamBattleSlotFields(row, slot)).join("")}
          <div class="organizer-admin-team-battle-result-extra-hint">
            <strong>Desempate opcional</strong>
            <span>Use somente se o placar principal ficar empatado.</span>
          </div>
          ${sbwOrganizerEditorRenderTeamBattleSlotFields(row, row.extraMatch, { extra: true })}
        </div>
      </article>
    `;
  }).join("") + sbwOrganizerEditorRenderTeamBattleAuditTrail(tournament, { limit: 5, compact: true });
}

function sbwOrganizerEditorOpenTeamBattleResultsPanel(tournament) {
  if (!sbwOrganizerTeamBattleResultsPanel || !tournament) return;

  const format = sbwOrganizerEditorGetTournamentFormatValue(tournament);
  if (!sbwOrganizerEditorIsTeamBattleLeague4v4Format(format)) {
    sbwOrganizerEditorSetTeamBattleResultsMessage("Resultados por confronto estão disponíveis apenas para Team Battle League 4v4.", "error");
    return;
  }

  sbwOrganizerEditorResultsTournament = tournament;

  if (sbwOrganizerTeamBattleResultsTitle) {
    sbwOrganizerTeamBattleResultsTitle.textContent = sbwOrganizerEditorGetTournamentTitle(tournament);
  }

  if (sbwOrganizerTeamBattleResultsMeta) {
    sbwOrganizerTeamBattleResultsMeta.textContent = "Lance os vencedores das 3 partidas principais e, se necessário, a partida extra de desempate.";
  }

  if (sbwOrganizerTeamBattleResultsPublicLink) {
    sbwOrganizerTeamBattleResultsPublicLink.href = sbwOrganizerEditorGetTournamentDetailUrl(tournament);
  }

  sbwOrganizerEditorRenderTeamBattleResultsPanel(tournament);
  sbwOrganizerTeamBattleResultsPanel.hidden = false;
  sbwOrganizerEditorSetTeamBattleResultsMessage("Resultados carregados. Revise antes de salvar porque eles alimentam classificação e playoffs.");
  sbwOrganizerTeamBattleResultsPanel.scrollIntoView({ behavior: "smooth", block: "start" });
}

function sbwOrganizerEditorCollectTeamBattleResultRows() {
  if (!sbwOrganizerTeamBattleResultsList) return [];

  const helper = window.SBWTeamBattleLeague;

  return sbwOrganizerTeamBattleResultsRowsCache.map((row) => {
    const element = Array.from(sbwOrganizerTeamBattleResultsList.querySelectorAll("[data-team-battle-result-row]"))
      .find((item) => String(item.dataset.teamBattleResultRow || "") === String(row.id));

    const readSlot = (slotId, slotIndex, extra = false) => {
      const selector = `[data-team-battle-result-slot-field="${slotId}"]`;
      const winnerSide = String(element?.querySelector(`${selector}[data-team-battle-result-field="winnerSide"]`)?.value || "").trim();
      const homeScore = Number(element?.querySelector(`${selector}[data-team-battle-result-field="homeScore"]`)?.value || 0) || 0;
      const awayScore = Number(element?.querySelector(`${selector}[data-team-battle-result-field="awayScore"]`)?.value || 0) || 0;
      return {
        slot: slotIndex,
        type: extra ? "extra" : "main",
        label: extra ? "Partida extra" : `Partida ${slotIndex}`,
        winnerSide: winnerSide === "home" || winnerSide === "away" ? winnerSide : "",
        points: extra ? 10 : sbwOrganizerEditorGetTeamBattleSlotPoints(slotIndex),
        score: { home: homeScore, away: awayScore },
        status: winnerSide ? "finished" : "draft",
        metadata: {
          source: "organizer-team-battle-result-editor",
          updatedAt: new Date().toISOString()
        }
      };
    };

    const mainMatches = [1, 2, 3].map((slotIndex) => readSlot(String(slotIndex), slotIndex, false));
    const extraMatch = readSlot("extra", 4, true);
    const hasExtraResult = Boolean(extraMatch.winnerSide);
    const baseMatch = {
      ...row.source,
      id: row.id,
      matchId: row.id,
      round: row.round,
      label: row.label,
      roundLabel: row.roundLabel,
      matches: mainMatches,
      extraMatch: hasExtraResult ? extraMatch : null,
      metadata: {
        ...sbwOrganizerEditorAsObject(row.source?.metadata),
        homeTeamName: row.homeTeamLabel,
        awayTeamName: row.awayTeamLabel,
        resultEditorUpdatedAt: new Date().toISOString()
      }
    };
    const finalizedMatch = helper && typeof helper.finalizeTeamMatchResult === "function"
      ? helper.finalizeTeamMatchResult(baseMatch, { leagueMode: "basic_single_division" })
      : baseMatch;
    const result = sbwOrganizerEditorAsObject(finalizedMatch.result);
    const schedule = sbwOrganizerEditorAsObject(finalizedMatch.schedule || row.source?.schedule || row.source?.scheduling);
    const nextScheduleStatus = result.finalized === true
      ? "finished"
      : (Number(result.mainPlayed || 0) > 0 ? "live" : (schedule.status || row.source?.scheduleStatus || "to_define"));

    return {
      ...finalizedMatch,
      schedule: {
        ...schedule,
        status: nextScheduleStatus,
        updatedAt: new Date().toISOString()
      },
      scheduling: {
        ...schedule,
        status: nextScheduleStatus,
        updatedAt: new Date().toISOString()
      },
      scheduleStatus: nextScheduleStatus,
      metadata: {
        ...sbwOrganizerEditorAsObject(finalizedMatch.metadata),
        homeTeamName: row.homeTeamLabel,
        awayTeamName: row.awayTeamLabel,
        resultManagedByOrganizer: true,
        resultUpdatedAt: new Date().toISOString()
      }
    };
  });
}

function sbwOrganizerEditorMergeTeamBattleResultMatches(tournament, resultMatches) {
  const map = new Map();

  sbwOrganizerEditorGetTeamBattleScheduleSavedMatches(tournament).forEach((match) => {
    const item = sbwOrganizerEditorAsObject(match);
    map.set(sbwOrganizerEditorGetTeamBattleMatchMergeKey(item), item);
  });

  resultMatches.forEach((match) => {
    const item = sbwOrganizerEditorAsObject(match);
    const key = sbwOrganizerEditorGetTeamBattleMatchMergeKey(item);
    const previous = map.get(key) || {};
    map.set(key, {
      ...previous,
      ...item,
      schedule: item.schedule || previous.schedule || previous.scheduling,
      scheduling: item.scheduling || item.schedule || previous.scheduling || previous.schedule,
      matches: Array.isArray(item.matches) ? item.matches : previous.matches,
      extraMatch: item.extraMatch || item.extra_match || null,
      result: item.result || previous.result,
      status: item.status || previous.status || "draft"
    });
  });

  return Array.from(map.values());
}

async function sbwOrganizerEditorSaveTeamBattleResults() {
  if (!sbwOrganizerEditorResultsTournament) {
    sbwOrganizerEditorSetTeamBattleResultsMessage("Selecione um torneio Team Battle League 4v4 para lançar resultados.", "error");
    return;
  }

  if (typeof sbwUpdateTournamentForOrganizerAsync !== "function") {
    sbwOrganizerEditorSetTeamBattleResultsMessage("Função de edição do torneio não carregada.", "error");
    return;
  }

  const resultRows = sbwOrganizerEditorCollectTeamBattleResultRows();
  if (!resultRows.length) {
    sbwOrganizerEditorSetTeamBattleResultsMessage("Nenhum confronto real foi encontrado para salvar resultados.", "error");
    return;
  }

  const tournament = sbwOrganizerEditorResultsTournament;
  const tournamentKey = sbwOrganizerEditorGetTournamentKey(tournament);
  const metadata = sbwOrganizerEditorAsObject(tournament?.metadata);
  const settings = sbwOrganizerEditorAsObject(tournament?.settings);
  const metadataTeamBattle = sbwOrganizerEditorAsObject(metadata.teamBattleLeague || metadata.team_battle_league);
  const settingsTeamBattle = sbwOrganizerEditorAsObject(settings.teamBattleLeague || settings.team_battle_league);
  const teamBattleBase = {
    ...settingsTeamBattle,
    ...metadataTeamBattle
  };
  const mergedMatches = sbwOrganizerEditorMergeTeamBattleResultMatches(tournament, resultRows);
  const now = new Date().toISOString();
  const finishedCount = mergedMatches.filter((match) => sbwOrganizerEditorAsObject(match).result?.finalized === true || sbwOrganizerEditorAsObject(match).status === "finished").length;
  const resultSummary = {
    totalMatches: mergedMatches.length,
    finishedMatches: finishedCount,
    pendingMatches: Math.max(0, mergedMatches.length - finishedCount),
    updatedAt: now,
    source: "team-battle-result-editor"
  };
  const auditEntry = sbwOrganizerEditorCreateTeamBattleAuditEntry(
    "results_updated",
    "Resultados atualizados",
    `${finishedCount}/${mergedMatches.length} confronto${mergedMatches.length === 1 ? "" : "s"} finalizado${mergedMatches.length === 1 ? "" : "s"} na fase classificatória.`,
    {
      tournamentKey,
      matchCount: mergedMatches.length,
      finishedCount,
      source: "team-battle-results-editor"
    }
  );
  const auditLog = sbwOrganizerEditorBuildTeamBattleAuditLog(teamBattleBase, auditEntry);
  const teamBattlePayload = {
    ...teamBattleBase,
    auditLog,
    audit_log: auditLog,
    operationalAudit: auditLog,
    operational_audit: auditLog,
    matches: mergedMatches,
    teamMatches: mergedMatches,
    team_matches: mergedMatches,
    results: {
      ...sbwOrganizerEditorAsObject(teamBattleBase.results),
      matches: mergedMatches,
      summary: resultSummary,
      updatedAt: now
    },
    resultSummary,
    resultsUpdatedAt: now
  };

  try {
    if (sbwOrganizerTeamBattleResultsSave) sbwOrganizerTeamBattleResultsSave.disabled = true;
    sbwOrganizerEditorSetTeamBattleResultsMessage("Salvando resultados dos confrontos...", "loading");

    const result = await sbwUpdateTournamentForOrganizerAsync({
      organizer: sbwOrganizerEditorCurrent?.slug || sbwOrganizerEditorCurrent?.id || sbwOrganizerEditorSlug,
      tournamentId: tournamentKey,
      payload: {
        settings: {
          ...settings,
          teamBattleLeague: teamBattlePayload,
          team_battle_league: teamBattlePayload
        },
        metadata: {
          ...metadata,
          teamBattleLeague: teamBattlePayload,
          team_battle_league: teamBattlePayload
        }
      }
    });

    const updated = result?.tournament || result?.data || result?.row || result;
    if (updated && typeof updated === "object") {
      sbwOrganizerEditorResultsTournament = updated;
    }

    sbwOrganizerEditorSetTeamBattleResultsMessage("Resultados salvos. A classificação e os playoffs usam esses placares.", "success");
    await sbwOrganizerEditorLoadTournaments();
    if (updated && typeof updated === "object") {
      sbwOrganizerEditorOpenTeamBattleResultsPanel(updated);
      sbwOrganizerEditorSetTeamBattleResultsMessage("Resultados salvos. A classificação e os playoffs usam esses placares.", "success");
    }
  } catch (error) {
    console.error("[SBW Organizadores] Erro ao salvar resultados Team Battle:", error);
    sbwOrganizerEditorSetTeamBattleResultsMessage(error?.message || "Não foi possível salvar os resultados dos confrontos.", "error");
  } finally {
    if (sbwOrganizerTeamBattleResultsSave) sbwOrganizerTeamBattleResultsSave.disabled = false;
  }
}

function sbwOrganizerEditorBindParticipantsPanel() {
  if (sbwOrganizerTournamentParticipantsClose && sbwOrganizerTournamentParticipantsClose.dataset.bound !== "true") {
    sbwOrganizerTournamentParticipantsClose.dataset.bound = "true";
    sbwOrganizerTournamentParticipantsClose.addEventListener("click", sbwOrganizerEditorHideParticipantsPanel);
  }

  if (sbwOrganizerTournamentParticipantsList && sbwOrganizerTournamentParticipantsList.dataset.bound !== "true") {
    sbwOrganizerTournamentParticipantsList.dataset.bound = "true";
    sbwOrganizerTournamentParticipantsList.addEventListener("click", (event) => {
      const actionButton = event.target.closest?.("[data-organizer-participant-action]");
      if (!actionButton) return;

      event.preventDefault();
      const participantId = String(actionButton.dataset.organizerParticipantId || "");
      const participant = sbwOrganizerEditorParticipantsCache.find((item) => String(sbwOrganizerEditorGetParticipantKey(item)) === participantId);

      if (!participant) {
        sbwOrganizerEditorSetParticipantsMessage("Inscrito não encontrado na lista carregada.", "error");
        return;
      }

      sbwOrganizerEditorUpdateParticipantAction(participant, actionButton);
    });
  }
}

function sbwOrganizerEditorHideTournamentEditForm() {
  sbwOrganizerEditorEditingTournament = null;

  if (sbwOrganizerTournamentEditForm) {
    sbwOrganizerTournamentEditForm.hidden = true;
  }

  sbwOrganizerEditorSetTournamentEditMessage("");
}

function sbwOrganizerEditorOpenTournamentEditForm(tournament) {
  if (!sbwOrganizerTournamentEditForm || !tournament) return;

  const key = sbwOrganizerEditorGetTournamentKey(tournament);
  sbwOrganizerEditorEditingTournament = tournament;

  if (sbwOrganizerTournamentEditTitle) {
    sbwOrganizerTournamentEditTitle.textContent = sbwOrganizerEditorGetTournamentTitle(tournament);
  }

  if (sbwOrganizerTournamentEditId) sbwOrganizerTournamentEditId.value = key;
  if (sbwOrganizerTournamentEditName) sbwOrganizerTournamentEditName.value = sbwOrganizerEditorGetTournamentTitle(tournament);
  if (sbwOrganizerTournamentEditGame) sbwOrganizerTournamentEditGame.value = sbwOrganizerEditorGetTournamentGame(tournament);
  if (sbwOrganizerTournamentEditFormat) sbwOrganizerTournamentEditFormat.value = sbwOrganizerEditorGetTournamentFormatValue(tournament);
  if (sbwOrganizerTournamentEditStatus) sbwOrganizerTournamentEditStatus.value = tournament?.status || tournament?.raw?.status || "draft";
  if (sbwOrganizerTournamentEditStartDate) sbwOrganizerTournamentEditStartDate.value = sbwOrganizerEditorFormatInputDate(tournament?.startsAt || tournament?.starts_at || tournament?.raw?.starts_at || tournament?.date);
  if (sbwOrganizerTournamentEditStartTime) sbwOrganizerTournamentEditStartTime.value = sbwOrganizerEditorFormatInputTime(tournament?.startsAt || tournament?.starts_at || tournament?.raw?.starts_at || tournament?.time);
  if (sbwOrganizerTournamentEditMax) sbwOrganizerTournamentEditMax.value = tournament?.maxParticipants || tournament?.max_participants || tournament?.raw?.max_participants || "";
  if (sbwOrganizerTournamentEditRegistrationOpens) sbwOrganizerTournamentEditRegistrationOpens.value = sbwOrganizerEditorFormatInputDateTime(tournament?.registrationOpensAt || tournament?.registration_opens_at || tournament?.raw?.registration_opens_at);
  if (sbwOrganizerTournamentEditRegistrationCloses) sbwOrganizerTournamentEditRegistrationCloses.value = sbwOrganizerEditorFormatInputDateTime(tournament?.registrationClosesAt || tournament?.registration_closes_at || tournament?.raw?.registration_closes_at);
  if (sbwOrganizerTournamentEditCheckinStarts) sbwOrganizerTournamentEditCheckinStarts.value = sbwOrganizerEditorFormatInputDateTime(tournament?.checkinStartsAt || tournament?.checkInStartsAt || tournament?.check_in_starts_at || tournament?.raw?.checkin_starts_at);
  if (sbwOrganizerTournamentEditCheckinEnds) sbwOrganizerTournamentEditCheckinEnds.value = sbwOrganizerEditorFormatInputDateTime(tournament?.checkinEndsAt || tournament?.checkInEndsAt || tournament?.check_in_ends_at || tournament?.raw?.checkin_ends_at);
  sbwOrganizerEditorRenderFormatPreview(sbwOrganizerTournamentEditFormat?.value);
  sbwOrganizerEditorApplyTournamentCapacityMode(sbwOrganizerTournamentEditFormat?.value);
  sbwOrganizerEditorSetTournamentCoverFrameForm(sbwOrganizerEditorGetTournamentCoverFrame(tournament));
  sbwOrganizerEditorSetTournamentCoverUrl(tournament?.coverUrl || tournament?.cover_url || tournament?.raw?.cover_url || "");
  sbwOrganizerEditorSetTournamentCoverMessage("");
  if (sbwOrganizerTournamentEditDescription) sbwOrganizerTournamentEditDescription.value = tournament?.description || tournament?.raw?.description || "";
  if (sbwOrganizerTournamentEditRules) sbwOrganizerTournamentEditRules.value = tournament?.rules || tournament?.raw?.rules || "";

  if (sbwOrganizerTournamentEditPublicLink) {
    sbwOrganizerTournamentEditPublicLink.href = sbwOrganizerEditorGetTournamentDetailUrl(tournament);
  }

  if (sbwOrganizerTournamentEditManageLink) {
    sbwOrganizerTournamentEditManageLink.href = sbwOrganizerEditorGetTournamentManageUrl(tournament);
  }

  sbwOrganizerTournamentEditForm.hidden = false;
  sbwOrganizerEditorSetTournamentEditMessage("Editando dados básicos deste torneio.");
  sbwOrganizerTournamentEditForm.scrollIntoView({ behavior: "smooth", block: "start" });
}

function sbwOrganizerEditorBindTournamentEditor() {
  sbwOrganizerEditorBindTournamentCoverEditor();
  sbwOrganizerEditorBindParticipantsPanel();

  if (sbwOrganizerTeamBattleScheduleClose && sbwOrganizerTeamBattleScheduleClose.dataset.bound !== "true") {
    sbwOrganizerTeamBattleScheduleClose.dataset.bound = "true";
    sbwOrganizerTeamBattleScheduleClose.addEventListener("click", sbwOrganizerEditorHideTeamBattleSchedulePanel);
  }

  if (sbwOrganizerTeamBattleScheduleForm && sbwOrganizerTeamBattleScheduleForm.dataset.bound !== "true") {
    sbwOrganizerTeamBattleScheduleForm.dataset.bound = "true";
    sbwOrganizerTeamBattleScheduleForm.addEventListener("submit", (event) => {
      event.preventDefault();
      sbwOrganizerEditorSaveTeamBattleSchedule();
    });
  }

  if (sbwOrganizerTeamBattleResultsClose && sbwOrganizerTeamBattleResultsClose.dataset.bound !== "true") {
    sbwOrganizerTeamBattleResultsClose.dataset.bound = "true";
    sbwOrganizerTeamBattleResultsClose.addEventListener("click", sbwOrganizerEditorHideTeamBattleResultsPanel);
  }

  if (sbwOrganizerTeamBattleResultsForm && sbwOrganizerTeamBattleResultsForm.dataset.bound !== "true") {
    sbwOrganizerTeamBattleResultsForm.dataset.bound = "true";
    sbwOrganizerTeamBattleResultsForm.addEventListener("submit", (event) => {
      event.preventDefault();
      sbwOrganizerEditorSaveTeamBattleResults();
    });
  }

  if (sbwOrganizerTeamBattlePlayoffsClose && sbwOrganizerTeamBattlePlayoffsClose.dataset.bound !== "true") {
    sbwOrganizerTeamBattlePlayoffsClose.dataset.bound = "true";
    sbwOrganizerTeamBattlePlayoffsClose.addEventListener("click", sbwOrganizerEditorHideTeamBattlePlayoffsPanel);
  }

  if (sbwOrganizerTeamBattlePlayoffsForm && sbwOrganizerTeamBattlePlayoffsForm.dataset.bound !== "true") {
    sbwOrganizerTeamBattlePlayoffsForm.dataset.bound = "true";
    sbwOrganizerTeamBattlePlayoffsForm.addEventListener("submit", (event) => {
      event.preventDefault();
      sbwOrganizerEditorSaveTeamBattlePlayoffs();
    });
  }

  if (sbwOrganizerTeamBattlePlayoffsList && sbwOrganizerTeamBattlePlayoffsList.dataset.boundFinalize !== "true") {
    sbwOrganizerTeamBattlePlayoffsList.dataset.boundFinalize = "true";
    sbwOrganizerTeamBattlePlayoffsList.addEventListener("click", (event) => {
      const finalizeButton = event.target.closest?.("[data-team-battle-finalize]");
      if (!finalizeButton) return;
      event.preventDefault();
      sbwOrganizerEditorFinalizeTeamBattleTournament();
    });
  }

  if (sbwOrganizerEditorTournamentsList && sbwOrganizerEditorTournamentsList.dataset.boundTournamentEdit !== "true") {
    sbwOrganizerEditorTournamentsList.dataset.boundTournamentEdit = "true";

    sbwOrganizerEditorTournamentsList.addEventListener("click", (event) => {
      const scheduleButton = event.target.closest?.("[data-organizer-tournament-schedule]");
      const resultsButton = event.target.closest?.("[data-organizer-tournament-results]");
      const playoffsButton = event.target.closest?.("[data-organizer-tournament-playoffs]");
      const participantButton = event.target.closest?.("[data-organizer-tournament-participants]");
      const editButton = event.target.closest?.("[data-organizer-tournament-edit]");
      const button = scheduleButton || resultsButton || playoffsButton || participantButton || editButton;
      if (!button) return;

      event.preventDefault();

      const key = scheduleButton
        ? scheduleButton.dataset.organizerTournamentSchedule || ""
        : resultsButton
          ? resultsButton.dataset.organizerTournamentResults || ""
          : playoffsButton
            ? playoffsButton.dataset.organizerTournamentPlayoffs || ""
            : participantButton
            ? participantButton.dataset.organizerTournamentParticipants || ""
            : editButton.dataset.organizerTournamentEdit || "";

      const tournament = sbwOrganizerEditorFindTournamentByKey(key);

      if (!tournament) {
        const message = scheduleButton
          ? "Torneio não encontrado para carregar agenda."
          : resultsButton
            ? "Torneio não encontrado para lançar resultados."
            : playoffsButton
              ? "Torneio não encontrado para liberar playoffs."
              : participantButton
              ? "Torneio não encontrado para carregar inscritos."
              : "Torneio não encontrado na lista carregada.";
        sbwOrganizerEditorSetTournamentEditMessage(message, "error");
        sbwOrganizerEditorSetParticipantsMessage(message, "error");
        sbwOrganizerEditorSetTeamBattleScheduleMessage(message, "error");
        sbwOrganizerEditorSetTeamBattleResultsMessage(message, "error");
        sbwOrganizerEditorSetTeamBattlePlayoffsMessage(message, "error");
        return;
      }

      if (scheduleButton) {
        sbwOrganizerEditorOpenTeamBattleSchedulePanel(tournament);
        return;
      }

      if (resultsButton) {
        sbwOrganizerEditorOpenTeamBattleResultsPanel(tournament);
        return;
      }

      if (playoffsButton) {
        sbwOrganizerEditorOpenTeamBattlePlayoffsPanel(tournament);
        return;
      }

      if (participantButton) {
        sbwOrganizerEditorOpenParticipantsPanel(tournament);
        return;
      }

      sbwOrganizerEditorOpenTournamentEditForm(tournament);
    });
  }

  if (sbwOrganizerTournamentEditCancel && sbwOrganizerTournamentEditCancel.dataset.bound !== "true") {
    sbwOrganizerTournamentEditCancel.dataset.bound = "true";
    sbwOrganizerTournamentEditCancel.addEventListener("click", sbwOrganizerEditorHideTournamentEditForm);
  }

  if (sbwOrganizerTournamentEditFormat && sbwOrganizerTournamentEditFormat.dataset.boundFormatPreview !== "true") {
    sbwOrganizerTournamentEditFormat.dataset.boundFormatPreview = "true";
    sbwOrganizerTournamentEditFormat.addEventListener("change", () => {
      sbwOrganizerEditorRenderFormatPreview(sbwOrganizerTournamentEditFormat.value);
      sbwOrganizerEditorApplyTournamentCapacityMode(sbwOrganizerTournamentEditFormat.value);
    });
  }

  if (sbwOrganizerTournamentEditMax && sbwOrganizerTournamentEditMax.dataset.boundEvenCapacity !== "true") {
    sbwOrganizerTournamentEditMax.dataset.boundEvenCapacity = "true";
    sbwOrganizerTournamentEditMax.addEventListener("change", () => sbwOrganizerEditorGetTournamentCapacityInputValue(sbwOrganizerTournamentEditFormat?.value));
    sbwOrganizerTournamentEditMax.addEventListener("blur", () => sbwOrganizerEditorGetTournamentCapacityInputValue(sbwOrganizerTournamentEditFormat?.value));
  }

  if (sbwOrganizerTournamentEditForm && sbwOrganizerTournamentEditForm.dataset.bound !== "true") {
    sbwOrganizerTournamentEditForm.dataset.bound = "true";

    sbwOrganizerTournamentEditForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (!sbwOrganizerEditorEditingTournament) {
        sbwOrganizerEditorSetTournamentEditMessage("Selecione um torneio para editar.", "error");
        return;
      }

      if (typeof sbwUpdateTournamentForOrganizerAsync !== "function") {
        sbwOrganizerEditorSetTournamentEditMessage("Função de edição do torneio não carregada.", "error");
        return;
      }

      const title = String(sbwOrganizerTournamentEditName?.value || "").trim();
      const game = String(sbwOrganizerTournamentEditGame?.value || "").trim();

      if (!title) {
        sbwOrganizerEditorSetTournamentEditMessage("Informe o nome do torneio.", "error");
        return;
      }

      if (!game) {
        sbwOrganizerEditorSetTournamentEditMessage("Informe o jogo do torneio.", "error");
        return;
      }

      const startDate = sbwOrganizerTournamentEditStartDate?.value || "";
      const startTime = sbwOrganizerTournamentEditStartTime?.value || "";
      const startsAt = startDate
        ? `${startDate}T${startTime || "00:00"}:00`
        : "";
      const registrationOpensAt = sbwOrganizerEditorGetWindowDateTimeValue(sbwOrganizerTournamentEditRegistrationOpens);
      const registrationClosesAt = sbwOrganizerEditorGetWindowDateTimeValue(sbwOrganizerTournamentEditRegistrationCloses);
      const checkinStartsAt = sbwOrganizerEditorGetWindowDateTimeValue(sbwOrganizerTournamentEditCheckinStarts);
      const checkinEndsAt = sbwOrganizerEditorGetWindowDateTimeValue(sbwOrganizerTournamentEditCheckinEnds);
      const windowValidationMessage = sbwOrganizerEditorValidateTournamentWindows(registrationOpensAt, registrationClosesAt, checkinStartsAt, checkinEndsAt);

      if (windowValidationMessage) {
        sbwOrganizerEditorSetTournamentEditMessage(windowValidationMessage, "error");
        return;
      }

      const tournamentId = sbwOrganizerTournamentEditId?.value || sbwOrganizerEditorGetTournamentKey(sbwOrganizerEditorEditingTournament);
      const selectedFormat = sbwOrganizerTournamentEditFormat?.value || "double-elimination";
      const formatMetadata = sbwOrganizerEditorGetFormatMetadata(selectedFormat);
      const capacityValue = sbwOrganizerEditorGetTournamentCapacityInputValue(selectedFormat);
      const isTeamBattleLeagueTournament = sbwOrganizerEditorIsTeamBattleLeague4v4Format(selectedFormat);
      const teamBattleLeagueDraft = sbwOrganizerEditorBuildTeamBattleLeagueSettings(selectedFormat, {
        title,
        game,
        organizerName: sbwOrganizerEditorCurrent?.name || sbwOrganizerEditorCurrent?.displayName || sbwOrganizerEditorCurrent?.slug || ""
      });

      if (!Number.isInteger(capacityValue) || capacityValue < 2 || capacityValue > 256 || capacityValue % 2 !== 0) {
        sbwOrganizerEditorSetTournamentEditMessage(`O limite de ${isTeamBattleLeagueTournament ? "equipes" : "participantes"} precisa estar entre 2 e 256 e sempre em número par.`, "error");
        sbwOrganizerTournamentEditMax?.focus();
        return;
      }

      if (!sbwOrganizerEditorIsFormatAvailableForSave(selectedFormat)) {
        sbwOrganizerEditorRenderFormatPreview(selectedFormat);
        sbwOrganizerEditorSetTournamentEditMessage(sbwOrganizerEditorGetFormatBlockReason(selectedFormat), "error");
        sbwOrganizerTournamentEditFormat?.focus();
        return;
      }

      try {
        if (sbwOrganizerTournamentEditSave) sbwOrganizerTournamentEditSave.disabled = true;
        sbwOrganizerEditorSetTournamentEditMessage("Salvando alterações do torneio...", "loading");

        const result = await sbwUpdateTournamentForOrganizerAsync({
          organizer: sbwOrganizerEditorCurrent?.slug || sbwOrganizerEditorCurrent?.id || sbwOrganizerEditorSlug,
          tournamentId,
          payload: {
            title,
            name: title,
            gameName: game,
            game_name: game,
            format: selectedFormat,
            formatLabel: formatMetadata.label,
            format_label: formatMetadata.label,
            status: sbwOrganizerTournamentEditStatus?.value || "draft",
            starts_at: startsAt,
            registration_opens_at: registrationOpensAt,
            registration_closes_at: registrationClosesAt,
            checkin_starts_at: checkinStartsAt,
            checkin_ends_at: checkinEndsAt,
            max_participants: capacityValue || null,
            cover_url: sbwOrganizerTournamentEditCover?.value || "",
            description: sbwOrganizerTournamentEditDescription?.value || "",
            rules: sbwOrganizerTournamentEditRules?.value || "",
            settings: {
              formatConfig: formatMetadata,
              formatFamily: formatMetadata.family,
              formatStatus: formatMetadata.status,
              teamMode: formatMetadata.teamMode,
              maxPlayers: capacityValue,
              maxParticipants: capacityValue,
              participantCapacityUnit: isTeamBattleLeagueTournament ? "teams" : "participants",
              capacityUnit: isTeamBattleLeagueTournament ? "teams" : "participants",
              registrationOpensAt,
              registrationClosesAt,
              checkinStartsAt,
              checkInStartsAt: checkinStartsAt,
              checkinEndsAt,
              checkInEndsAt: checkinEndsAt,
              ...(isTeamBattleLeagueTournament ? {
                matchScheduling: teamBattleLeagueDraft?.settings?.matchScheduling || {
                  organizerManaged: true,
                  mode: "organizer_per_match",
                  timezone: "America/Sao_Paulo",
                  allowRoundSchedule: true,
                  allowMatchScheduleOverride: true,
                  allowReschedule: true
                },
                organizerManagedSchedule: true,
                longFormLeague: true,
                maxTeams: capacityValue,
                teamLimit: capacityValue,
                teamCapacity: capacityValue
              } : {}),
              ...(teamBattleLeagueDraft ? {
                teamBattleLeague: teamBattleLeagueDraft.settings,
                team_battle_league: teamBattleLeagueDraft.settings
              } : {})
            },
            metadata: {
              format: formatMetadata,
              capacity: {
                value: capacityValue,
                unit: isTeamBattleLeagueTournament ? "teams" : "participants",
                evenOnly: true
              },
              registration: {
                opensAt: registrationOpensAt,
                closesAt: registrationClosesAt
              },
              checkin: {
                startsAt: checkinStartsAt,
                endsAt: checkinEndsAt,
                required: true
              },
              ...(isTeamBattleLeagueTournament ? {
                matchScheduling: teamBattleLeagueDraft?.metadata?.matchScheduling || teamBattleLeagueDraft?.settings?.matchScheduling || {
                  organizerManaged: true,
                  mode: "organizer_per_match",
                  timezone: "America/Sao_Paulo",
                  allowRoundSchedule: true,
                  allowMatchScheduleOverride: true,
                  allowReschedule: true
                }
              } : {}),
              ...(teamBattleLeagueDraft ? {
                teamBattleLeague: teamBattleLeagueDraft.metadata,
                team_battle_league: teamBattleLeagueDraft.metadata
              } : {})
            },
            tournamentAssets: {
              cover: {
                ...sbwOrganizerEditorGetTournamentCoverFrameForm(),
                url: sbwOrganizerTournamentEditCover?.value || "",
                updatedAt: new Date().toISOString()
              }
            }
          }
        });

        const updated = result?.tournament || result?.data || result?.row || result;
        sbwOrganizerEditorSetTournamentEditMessage("Torneio atualizado.", "success");

        if (updated && typeof updated === "object") {
          sbwOrganizerEditorEditingTournament = updated;
        }

        await sbwOrganizerEditorLoadTournaments();
      } catch (error) {
        console.error("[SBW Organizadores] Erro ao salvar torneio:", error);
        sbwOrganizerEditorSetTournamentEditMessage(error?.message || "Não foi possível salvar o torneio.", "error");
      } finally {
        if (sbwOrganizerTournamentEditSave) sbwOrganizerTournamentEditSave.disabled = false;
      }
    });
  }
}

async function sbwOrganizerEditorLoadTournaments() {
  if (!sbwOrganizerEditorTournamentsList) return;

  sbwOrganizerEditorBindTournamentEditor();

  if (!sbwOrganizerEditorCurrent) {
    sbwOrganizerEditorTournamentsCache = [];
    sbwOrganizerEditorTournamentsList.innerHTML = `<div class="organizer-admin-empty-row">Organizador ainda não carregado.</div>`;
    return;
  }

  sbwOrganizerEditorTournamentsList.innerHTML = `<div class="organizer-admin-empty-row">Carregando torneios vinculados...</div>`;

  try {
    const tournaments = typeof sbwGetTournamentsByOrganizerAsync === "function"
      ? await sbwGetTournamentsByOrganizerAsync(sbwOrganizerEditorCurrent)
      : [];

    const list = Array.isArray(tournaments) ? tournaments : [];
    sbwOrganizerEditorTournamentsCache = list;
    sbwOrganizerEditorRenderSeasonGuard(sbwOrganizerEditorCurrent);
    sbwOrganizerEditorRenderSeasonTournamentsManager(sbwOrganizerEditorCurrent);

    if (!list.length) {
      sbwOrganizerEditorTournamentsList.innerHTML = `
        <div class="organizer-admin-empty-row">
          Nenhum torneio vinculado a esta organização foi encontrado ainda.
        </div>
      `;
      sbwOrganizerEditorRenderTestReadinessGuide(sbwOrganizerEditorCurrent);
      return;
    }

    sbwOrganizerEditorTournamentsList.innerHTML = list.map((tournament) => {
      const key = sbwOrganizerEditorGetTournamentKey(tournament);
      const status = typeof sbwGetStatusInfo === "function"
        ? sbwGetStatusInfo(tournament?.status)
        : { label: tournament?.status || "Ativo", className: "open" };
      const participants = typeof sbwGetParticipantsLabel === "function"
        ? sbwGetParticipantsLabel(tournament)
        : `${tournament?.currentParticipants || tournament?.current_participants || 0} / ${tournament?.maxParticipants || tournament?.max_participants || "—"}`;
      const formatBadge = sbwOrganizerEditorRenderFormatBadge(tournament, { short: true, compact: true });
      const isTeamBattleLeagueTournament = sbwOrganizerEditorIsTeamBattleLeague4v4Format(sbwOrganizerEditorGetTournamentFormatValue(tournament));

      return `
        <article class="organizer-admin-tournament-row">
          <div>
            <span class="organizer-admin-eyebrow">${sbwOrganizerEditorEscape(sbwOrganizerEditorGetTournamentGame(tournament))}</span>
            <strong>${sbwOrganizerEditorEscape(sbwOrganizerEditorGetTournamentTitle(tournament))}</strong>
            <div class="organizer-admin-tournament-meta-row">
              ${formatBadge}
              <small>${sbwOrganizerEditorEscape(participants)} · ${sbwOrganizerEditorEscape(sbwOrganizerEditorGetTournamentDate(tournament))}</small>
            </div>
          </div>
          <span class="status-pill ${sbwOrganizerEditorEscape(status.className || "open")}">${sbwOrganizerEditorEscape(status.label || "Ativo")}</span>
          <div class="organizer-admin-tournament-actions">
            <a class="organizer-admin-small-link" href="${sbwOrganizerEditorEscape(sbwOrganizerEditorGetTournamentDetailUrl(tournament))}">Ver</a>
            <button class="organizer-admin-small-link organizer-admin-small-link--button" type="button" data-organizer-tournament-edit="${sbwOrganizerEditorEscape(key)}">Editar</button>
            ${isTeamBattleLeagueTournament ? `<button class="organizer-admin-small-link organizer-admin-small-link--button organizer-admin-small-link--cyan" type="button" data-organizer-tournament-schedule="${sbwOrganizerEditorEscape(key)}">Agenda 4v4</button>` : ""}
            ${isTeamBattleLeagueTournament ? `<button class="organizer-admin-small-link organizer-admin-small-link--button organizer-admin-small-link--cyan" type="button" data-organizer-tournament-results="${sbwOrganizerEditorEscape(key)}">Resultados 4v4</button>` : ""}
            ${isTeamBattleLeagueTournament ? `<button class="organizer-admin-small-link organizer-admin-small-link--button organizer-admin-small-link--cyan" type="button" data-organizer-tournament-playoffs="${sbwOrganizerEditorEscape(key)}">Playoffs 4v4</button>` : ""}
            <button class="organizer-admin-small-link organizer-admin-small-link--button organizer-admin-small-link--primary" type="button" data-organizer-tournament-participants="${sbwOrganizerEditorEscape(key)}">Inscritos</button>
            <a class="organizer-admin-small-link" href="${sbwOrganizerEditorEscape(sbwOrganizerEditorGetTournamentManageUrl(tournament))}">Gerenciar</a>
          </div>
        </article>
      `;
    }).join("");
    sbwOrganizerEditorRenderTestReadinessGuide(sbwOrganizerEditorCurrent);
  } catch (error) {
    console.error("[SBW Organizadores] Erro ao carregar torneios do painel:", error);
    sbwOrganizerEditorTournamentsCache = [];
    sbwOrganizerEditorTournamentsList.innerHTML = `
      <div class="organizer-admin-empty-row">
        Não foi possível carregar os torneios desta organização agora.
      </div>
    `;
    sbwOrganizerEditorRenderTestReadinessGuide(sbwOrganizerEditorCurrent);
  }
}

function sbwOrganizerEditorGetCurrentSeason(organizer = sbwOrganizerEditorCurrent) {
  const metadata = sbwOrganizerEditorAsObject(organizer?.metadata);
  const settings = sbwOrganizerEditorAsObject(organizer?.settings);
  return sbwOrganizerEditorAsObject(
    metadata.currentSeason ||
    metadata.season ||
    sbwOrganizerEditorAsObject(metadata.seasons).current ||
    settings.currentSeason ||
    {}
  );
}

function sbwOrganizerEditorHydrateSeasonForm(organizer = sbwOrganizerEditorCurrent) {
  const season = sbwOrganizerEditorGetCurrentSeason(organizer);
  if (sbwOrganizerSeasonName) sbwOrganizerSeasonName.value = season.name || season.title || "";
  if (sbwOrganizerSeasonStart) sbwOrganizerSeasonStart.value = String(season.startDate || season.start_date || "").slice(0, 10);
  if (sbwOrganizerSeasonEnd) sbwOrganizerSeasonEnd.value = String(season.endDate || season.end_date || "").slice(0, 10);
  sbwOrganizerEditorRenderSeasonGuard(organizer);
  sbwOrganizerEditorRenderSeasonTournamentsManager(organizer);
  sbwOrganizerEditorRenderSeasonAudit(organizer);
}

function sbwOrganizerEditorSetSeasonMessage(message, type = "") {
  if (!sbwOrganizerSeasonMessage) return;
  sbwOrganizerSeasonMessage.textContent = message || "";
  sbwOrganizerSeasonMessage.classList.remove("is-error", "is-success", "is-loading");
  if (type) sbwOrganizerSeasonMessage.classList.add(`is-${type}`);
}

function sbwOrganizerEditorParseSeasonDate(value) {
  if (!value) return null;
  const date = new Date(`${String(value).slice(0, 10)}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function sbwOrganizerEditorGetSeasonDurationDays(startDate, endDate) {
  const start = sbwOrganizerEditorParseSeasonDate(startDate);
  const end = sbwOrganizerEditorParseSeasonDate(endDate);
  if (!start || !end) return 0;
  return Math.round((end.getTime() - start.getTime()) / 86400000) + 1;
}

function sbwOrganizerEditorNormalizeSeasonKey(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function sbwOrganizerEditorGetTournamentSeasonLabel(tournament) {
  const metadata = sbwOrganizerEditorAsObject(tournament?.metadata);
  const settings = sbwOrganizerEditorAsObject(tournament?.settings);
  const season = sbwOrganizerEditorAsObject(tournament?.season || metadata.season || settings.season);

  return String(
    tournament?.seasonName ||
    tournament?.season_name ||
    tournament?.seasonTitle ||
    tournament?.season_title ||
    settings.seasonName ||
    settings.season_name ||
    settings.seasonTitle ||
    settings.season_title ||
    metadata.seasonName ||
    metadata.season_name ||
    metadata.seasonTitle ||
    metadata.season_title ||
    season.name ||
    season.title ||
    ""
  ).trim();
}


function sbwOrganizerEditorGetTournamentSeasonSlug(tournament) {
  const metadata = sbwOrganizerEditorAsObject(tournament?.metadata);
  const settings = sbwOrganizerEditorAsObject(tournament?.settings);
  const season = sbwOrganizerEditorAsObject(tournament?.season || metadata.season || settings.season);
  return sbwOrganizerEditorNormalizeSeasonKey(
    tournament?.seasonSlug ||
    tournament?.season_slug ||
    settings.seasonSlug ||
    settings.season_slug ||
    metadata.seasonSlug ||
    metadata.season_slug ||
    season.slug ||
    season.key ||
    sbwOrganizerEditorGetTournamentSeasonLabel(tournament)
  );
}

function sbwOrganizerEditorIsTournamentExplicitlyLinkedToSeason(tournament, season) {
  const seasonKey = sbwOrganizerEditorNormalizeSeasonKey(season?.slug || season?.key || season?.name || season?.title || "");
  const tournamentSeasonKey = sbwOrganizerEditorGetTournamentSeasonSlug(tournament);
  return Boolean(seasonKey && tournamentSeasonKey && seasonKey === tournamentSeasonKey);
}

function sbwOrganizerEditorIsTournamentInsideSeasonPeriod(tournament, season) {
  const start = sbwOrganizerEditorParseSeasonDate(season?.startDate || season?.start_date);
  const end = sbwOrganizerEditorParseSeasonDate(season?.endDate || season?.end_date);
  const tournamentDate = sbwOrganizerEditorGetTournamentDateObject(tournament);
  if (!start || !end || !tournamentDate) return false;
  return tournamentDate >= start && tournamentDate <= end;
}

function sbwOrganizerEditorIsTournamentPointableForOrganizer(tournament) {
  const metadata = sbwOrganizerEditorAsObject(tournament?.metadata);
  const settings = sbwOrganizerEditorAsObject(tournament?.settings);
  const finalData = sbwOrganizerEditorAsObject(settings.finalResults || settings.final_results || metadata.finalResults || metadata.final_results);
  return Boolean(
    tournament?.countsForRanking ||
    tournament?.counts_for_ranking ||
    tournament?.countsForOrganizerRanking ||
    tournament?.counts_for_organizer_ranking ||
    tournament?.rankingEnabled ||
    tournament?.ranking_enabled ||
    tournament?.globalRankingEligible ||
    tournament?.global_ranking_eligible ||
    tournament?.sbwGlobalRankingEligible ||
    settings.countsForRanking ||
    settings.counts_for_ranking ||
    settings.countsForOrganizerRanking ||
    settings.counts_for_organizer_ranking ||
    settings.rankingEnabled ||
    settings.ranking_enabled ||
    settings.globalRankingEligible ||
    settings.global_ranking_eligible ||
    settings.sbwGlobalRankingEligible ||
    metadata.countsForRanking ||
    metadata.counts_for_ranking ||
    metadata.countsForOrganizerRanking ||
    metadata.counts_for_organizer_ranking ||
    metadata.rankingEnabled ||
    metadata.ranking_enabled ||
    metadata.globalRankingEligible ||
    metadata.global_ranking_eligible ||
    metadata.sbwGlobalRankingEligible ||
    finalData.rankingApplied ||
    finalData.ranking_applied
  );
}

function sbwOrganizerEditorGetTournamentStatusKey(tournament) {
  return String(tournament?.status || tournament?.state || "")
    .trim()
    .toLowerCase();
}

function sbwOrganizerEditorGetTournamentFinalData(tournament) {
  const metadata = sbwOrganizerEditorAsObject(tournament?.metadata);
  const settings = sbwOrganizerEditorAsObject(tournament?.settings);
  return sbwOrganizerEditorAsObject(
    tournament?.finalResults ||
    tournament?.final_results ||
    settings.finalResults ||
    settings.final_results ||
    metadata.finalResults ||
    metadata.final_results ||
    {}
  );
}

function sbwOrganizerEditorHasTournamentFinalResults(tournament) {
  const finalData = sbwOrganizerEditorGetTournamentFinalData(tournament);
  const champion = finalData.champion || finalData.winner || finalData.championName || finalData.champion_name;
  const standings = finalData.standings || finalData.classification || finalData.results || finalData.finalStandings || finalData.final_standings;
  const status = sbwOrganizerEditorGetTournamentStatusKey(tournament);
  return Boolean(
    champion ||
    (Array.isArray(standings) && standings.length) ||
    ["completed", "complete", "finished", "finalizado", "encerrado"].includes(status)
  );
}

function sbwOrganizerEditorGetSeasonRankingImpact(candidates, season) {
  const items = Array.isArray(candidates) ? candidates : [];
  const linked = items.filter((item) => item?.state?.linked);
  const pointable = items.filter((item) => item?.state?.pointable);
  const ready = pointable.filter((item) => item?.state?.insidePeriod && sbwOrganizerEditorHasTournamentFinalResults(item.tournament));
  const pendingResults = pointable.filter((item) => item?.state?.insidePeriod && !sbwOrganizerEditorHasTournamentFinalResults(item.tournament));
  const outsidePointable = pointable.filter((item) => !item?.state?.insidePeriod);
  const eligibleUnlinked = items.filter((item) => item?.state?.insidePeriod && !item?.state?.linked);
  const linkedNotPointable = linked.filter((item) => !item?.state?.pointable);

  return {
    linkedCount: linked.length,
    pointableCount: pointable.length,
    readyCount: ready.length,
    pendingResultsCount: pendingResults.length,
    outsidePointableCount: outsidePointable.length,
    eligibleUnlinkedCount: eligibleUnlinked.length,
    linkedNotPointableCount: linkedNotPointable.length,
    seasonLabel: String(season?.name || season?.title || "Temporada atual").trim() || "Temporada atual"
  };
}

function sbwOrganizerEditorRenderSeasonRankingImpact(impact) {
  const warnings = [];
  if (impact.pendingResultsCount) warnings.push(`${impact.pendingResultsCount} pontuável${impact.pendingResultsCount === 1 ? "" : "eis"} ainda sem resultado final.`);
  if (impact.outsidePointableCount) warnings.push(`${impact.outsidePointableCount} pontuável${impact.outsidePointableCount === 1 ? "" : "eis"} fora do período.`);
  if (impact.eligibleUnlinkedCount) warnings.push(`${impact.eligibleUnlinkedCount} torneio${impact.eligibleUnlinkedCount === 1 ? " apto" : "s aptos"} ainda não vinculado${impact.eligibleUnlinkedCount === 1 ? "" : "s"}.`);

  return `
    <div class="organizer-admin-season-impact-panel">
      <div>
        <span class="organizer-admin-eyebrow">Impacto no ranking</span>
        <strong>${sbwOrganizerEditorEscape(impact.seasonLabel)}</strong>
        <p>Prévia de segurança para revisar o que já pode entrar no ranking do organizador.</p>
      </div>
      <div class="organizer-admin-season-impact-grid">
        <span><strong>${sbwOrganizerEditorEscape(impact.readyCount)}</strong> prontos</span>
        <span><strong>${sbwOrganizerEditorEscape(impact.pendingResultsCount)}</strong> sem resultado final</span>
        <span><strong>${sbwOrganizerEditorEscape(impact.linkedNotPointableCount)}</strong> vinculados sem pontuar</span>
        <span><strong>${sbwOrganizerEditorEscape(impact.eligibleUnlinkedCount)}</strong> aptos não vinculados</span>
      </div>
      ${warnings.length ? `
        <div class="organizer-admin-season-impact-warning">
          ${warnings.map((item) => `<span>${sbwOrganizerEditorEscape(item)}</span>`).join("")}
        </div>
      ` : `
        <div class="organizer-admin-season-impact-ok">Ranking da temporada sem alertas visuais no momento.</div>
      `}
    </div>
  `;
}

function sbwOrganizerEditorGetTournamentRawDate(tournament) {
  return tournament?.startsAt ||
    tournament?.starts_at ||
    tournament?.startDate ||
    tournament?.start_date ||
    tournament?.date ||
    tournament?.created_at ||
    tournament?.createdAt ||
    "";
}

function sbwOrganizerEditorGetTournamentDateObject(tournament) {
  return sbwOrganizerEditorParseSeasonDate(sbwOrganizerEditorGetTournamentRawDate(tournament));
}

function sbwOrganizerEditorIsTournamentLinkedToSeason(tournament, season) {
  const seasonName = String(season?.name || season?.title || "").trim();
  const seasonKey = sbwOrganizerEditorNormalizeSeasonKey(seasonName);
  const tournamentSeason = sbwOrganizerEditorGetTournamentSeasonLabel(tournament);
  const tournamentSeasonKey = sbwOrganizerEditorNormalizeSeasonKey(tournamentSeason);

  if (seasonKey && tournamentSeasonKey) {
    return seasonKey === tournamentSeasonKey;
  }

  const start = sbwOrganizerEditorParseSeasonDate(season?.startDate || season?.start_date);
  const end = sbwOrganizerEditorParseSeasonDate(season?.endDate || season?.end_date);
  const tournamentDate = sbwOrganizerEditorGetTournamentDateObject(tournament);

  if (start && end && tournamentDate) {
    return tournamentDate >= start && tournamentDate <= end;
  }

  return false;
}

function sbwOrganizerEditorGetSeasonLinkedTournaments(season = sbwOrganizerEditorGetCurrentSeason()) {
  const list = Array.isArray(sbwOrganizerEditorTournamentsCache) ? sbwOrganizerEditorTournamentsCache : [];
  return list.filter((tournament) => sbwOrganizerEditorIsTournamentLinkedToSeason(tournament, season));
}

function sbwOrganizerEditorValidateSeasonPayload(seasonPayload) {
  const errors = [];
  const startDate = seasonPayload?.startDate || "";
  const endDate = seasonPayload?.endDate || "";
  const start = sbwOrganizerEditorParseSeasonDate(startDate);
  const end = sbwOrganizerEditorParseSeasonDate(endDate);

  if (start && end && start > end) {
    errors.push("A data final não pode ser anterior à data de início.");
  }

  const durationDays = sbwOrganizerEditorGetSeasonDurationDays(startDate, endDate);
  if (durationDays > 366) {
    errors.push("A temporada não pode passar de 1 ano.");
  }

  const currentSeason = sbwOrganizerEditorGetCurrentSeason();
  const currentEnd = sbwOrganizerEditorParseSeasonDate(currentSeason.endDate || currentSeason.end_date);
  const newEnd = sbwOrganizerEditorParseSeasonDate(endDate);

  if (currentEnd && newEnd && newEnd < currentEnd) {
    const linkedAfterNewEnd = sbwOrganizerEditorGetSeasonLinkedTournaments(currentSeason).filter((tournament) => {
      const tournamentDate = sbwOrganizerEditorGetTournamentDateObject(tournament);
      return tournamentDate && tournamentDate > newEnd;
    });

    if (linkedAfterNewEnd.length) {
      const names = linkedAfterNewEnd
        .slice(0, 3)
        .map((tournament) => sbwOrganizerEditorGetTournamentTitle(tournament))
        .join(", ");
      const suffix = linkedAfterNewEnd.length > 3 ? ` e mais ${linkedAfterNewEnd.length - 3}` : "";
      errors.push(`Não é possível encurtar a temporada porque há torneios vinculados depois da nova data final: ${names}${suffix}.`);
    }
  }

  return errors;
}


function sbwOrganizerEditorGetSeasonTimelineStatus(season) {
  const start = sbwOrganizerEditorParseSeasonDate(season?.startDate || season?.start_date);
  const end = sbwOrganizerEditorParseSeasonDate(season?.endDate || season?.end_date);
  const today = sbwOrganizerEditorParseSeasonDate(new Date().toISOString().slice(0, 10));

  if (!start || !end) {
    return {
      label: "Planejada",
      className: "draft",
      action: "Defina início e fim para liberar vínculos e pontuação com segurança."
    };
  }

  if (start > end) {
    return {
      label: "Datas inválidas",
      className: "danger",
      action: "Corrija o período antes de salvar a temporada."
    };
  }

  if (today && today < start) {
    return {
      label: "Programada",
      className: "scheduled",
      action: "Vincule torneios elegíveis e revise quais serão pontuáveis para o ranking do organizador e para o Ranking Global -SBW-."
    };
  }

  if (today && today > end) {
    return {
      label: "Encerrada",
      className: "finished",
      action: "Revise resultados finalizados e use a auditoria antes de fechar o ranking da temporada."
    };
  }

  return {
    label: "Ativa",
    className: "active",
    action: "Acompanhe torneios vinculados, check-ins e pontuação do ranking do organizador."
  };
}

function sbwOrganizerEditorRenderSeasonGuard(organizer = sbwOrganizerEditorCurrent) {
  if (!sbwOrganizerSeasonGuard) return;

  const season = sbwOrganizerEditorGetCurrentSeason(organizer);
  const name = String(season.name || season.title || "Temporada atual").trim() || "Temporada atual";
  const startDate = String(season.startDate || season.start_date || "").slice(0, 10);
  const endDate = String(season.endDate || season.end_date || "").slice(0, 10);
  const durationDays = sbwOrganizerEditorGetSeasonDurationDays(startDate, endDate);
  const linked = sbwOrganizerEditorGetSeasonLinkedTournaments(season);
  const pointable = linked.filter((tournament) => sbwOrganizerEditorIsTournamentPointableForOrganizer(tournament)).length;
  const timelineStatus = sbwOrganizerEditorGetSeasonTimelineStatus(season);
  const durationState = durationDays > 366 ? "danger" : timelineStatus.className || (durationDays > 0 ? "ok" : "draft");
  const durationLabel = durationDays > 0 ? `${durationDays} dia${durationDays === 1 ? "" : "s"}` : "Datas a definir";

  sbwOrganizerSeasonGuard.innerHTML = `
    <section class="organizer-admin-season-panel organizer-admin-season-panel--${sbwOrganizerEditorEscape(durationState)}">
      <div class="organizer-admin-season-panel-head">
        <div>
          <span class="organizer-admin-eyebrow">Controle da temporada</span>
          <strong>${sbwOrganizerEditorEscape(name)}</strong>
          <small>${sbwOrganizerEditorEscape(startDate || "Início a definir")} — ${sbwOrganizerEditorEscape(endDate || "Fim a definir")}</small>
        </div>
        <div class="organizer-admin-season-head-badges">
          <span class="organizer-admin-season-status organizer-admin-season-status--${sbwOrganizerEditorEscape(timelineStatus.className)}">${sbwOrganizerEditorEscape(timelineStatus.label)}</span>
          <span class="organizer-admin-season-duration">${sbwOrganizerEditorEscape(durationLabel)}</span>
        </div>
      </div>
      <div class="organizer-admin-season-next-action">
        <strong>Próxima ação</strong>
        <span>${sbwOrganizerEditorEscape(timelineStatus.action)}</span>
      </div>
      <div class="organizer-admin-season-metrics">
        <span><strong>${sbwOrganizerEditorEscape(linked.length)}</strong> torneio${linked.length === 1 ? "" : "s"} vinculado${linked.length === 1 ? "" : "s"}</span>
        <span><strong>${sbwOrganizerEditorEscape(pointable)}</strong> pontuável${pointable === 1 ? "" : "eis"}</span>
        <span><strong>1 ano</strong> limite máximo</span>
      </div>
      ${linked.length ? `
        <div class="organizer-admin-season-linked-list">
          ${linked.slice(0, 5).map((tournament) => `
            <article>
              <strong>${sbwOrganizerEditorEscape(sbwOrganizerEditorGetTournamentTitle(tournament))}</strong>
              <small>${sbwOrganizerEditorEscape(sbwOrganizerEditorGetTournamentGame(tournament))} · ${sbwOrganizerEditorEscape(sbwOrganizerEditorGetTournamentDate(tournament))}</small>
            </article>
          `).join("")}
          ${linked.length > 5 ? `<p>+ ${sbwOrganizerEditorEscape(linked.length - 5)} torneio${linked.length - 5 === 1 ? "" : "s"} vinculado${linked.length - 5 === 1 ? "" : "s"}</p>` : ""}
        </div>
      ` : `
        <div class="organizer-admin-season-empty-note">
          Nenhum torneio vinculado a esta temporada ainda. Torneios com o mesmo nome de temporada ou dentro do período aparecerão aqui.
        </div>
      `}
    </section>
  `;
}


function sbwOrganizerEditorGetSeasonCandidateTournaments(season = sbwOrganizerEditorGetCurrentSeason()) {
  const list = Array.isArray(sbwOrganizerEditorTournamentsCache) ? sbwOrganizerEditorTournamentsCache : [];
  return list.slice().sort((a, b) => {
    const aDate = sbwOrganizerEditorGetTournamentDateObject(a)?.getTime() || 0;
    const bDate = sbwOrganizerEditorGetTournamentDateObject(b)?.getTime() || 0;
    return bDate - aDate;
  });
}

function sbwOrganizerEditorGetTournamentSeasonStatus(tournament, season) {
  const explicitLinked = sbwOrganizerEditorIsTournamentExplicitlyLinkedToSeason(tournament, season);
  const legacyLinked = sbwOrganizerEditorIsTournamentLinkedToSeason(tournament, season);
  const insidePeriod = sbwOrganizerEditorIsTournamentInsideSeasonPeriod(tournament, season);
  const pointable = sbwOrganizerEditorIsTournamentPointableForOrganizer(tournament);
  const tournamentDate = sbwOrganizerEditorGetTournamentDateObject(tournament);
  const hasSeason = Boolean(season?.name || season?.title || season?.slug);

  return {
    hasSeason,
    explicitLinked,
    legacyLinked,
    insidePeriod,
    linked: explicitLinked || legacyLinked,
    pointable,
    dateLabel: tournamentDate ? sbwOrganizerEditorGetTournamentDate(tournament) : "Data a definir"
  };
}


function sbwOrganizerEditorGetSeasonAuditEntries(organizer = sbwOrganizerEditorCurrent) {
  const metadata = sbwOrganizerEditorAsObject(organizer?.metadata);
  const season = sbwOrganizerEditorGetCurrentSeason(organizer);
  const seasonKey = sbwOrganizerEditorNormalizeSeasonKey(season.slug || season.key || season.name || season.title || "");
  const rawEntries = [
    metadata.seasonAuditLog,
    metadata.season_audit_log,
    sbwOrganizerEditorAsObject(metadata.seasons).auditLog,
    sbwOrganizerEditorAsObject(metadata.seasons).audit_log
  ].find((value) => Array.isArray(value)) || [];

  const explicitEntries = rawEntries.slice(-5).map((entry) => ({
    type: entry?.type || entry?.action || "Atualização",
    title: entry?.title || entry?.label || "Temporada atualizada",
    detail: entry?.detail || entry?.description || entry?.message || "Alteração registrada na temporada.",
    date: entry?.date || entry?.createdAt || entry?.created_at || entry?.updatedAt || entry?.updated_at || ""
  }));

  const tournamentEntries = (Array.isArray(sbwOrganizerEditorTournamentsCache) ? sbwOrganizerEditorTournamentsCache : [])
    .filter((tournament) => {
      const state = sbwOrganizerEditorGetTournamentSeasonStatus(tournament, season);
      if (!state.linked && !state.pointable) return false;
      if (!seasonKey) return state.linked || state.pointable;
      const tournamentSeasonKey = sbwOrganizerEditorGetTournamentSeasonSlug(tournament);
      return !tournamentSeasonKey || tournamentSeasonKey === seasonKey || state.linked;
    })
    .map((tournament) => {
      const metadata = sbwOrganizerEditorAsObject(tournament?.metadata);
      const settings = sbwOrganizerEditorAsObject(tournament?.settings);
      const state = sbwOrganizerEditorGetTournamentSeasonStatus(tournament, season);
      const title = sbwOrganizerEditorGetTournamentTitle(tournament);
      const updatedAt = metadata.seasonUpdatedAt || metadata.season_updated_at || settings.seasonUpdatedAt || settings.season_updated_at || tournament?.updatedAt || tournament?.updated_at || "";
      return {
        type: state.pointable ? "Pontuação" : "Vínculo",
        title: state.pointable ? `Pontuação ativa — ${title}` : `Torneio vinculado — ${title}`,
        detail: state.pointable
          ? "Este torneio conta para o ranking do organizador e para o Ranking Global -SBW- nesta temporada."
          : "Este torneio está vinculado à temporada, mas ainda não pontua.",
        date: updatedAt
      };
    });

  const entries = explicitEntries.concat(tournamentEntries).sort((first, second) => {
    const firstTime = first.date ? new Date(first.date).getTime() : 0;
    const secondTime = second.date ? new Date(second.date).getTime() : 0;
    return secondTime - firstTime;
  });

  return entries.slice(0, 6);
}

function sbwOrganizerEditorFormatAuditDate(value) {
  if (!value) return "Data não registrada";
  if (typeof sbwFormatDate === "function") return sbwFormatDate(value);
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value).slice(0, 10) || "Data não registrada";
  return date.toLocaleDateString("pt-BR");
}

function sbwOrganizerEditorRenderSeasonAudit(organizer = sbwOrganizerEditorCurrent) {
  if (!sbwOrganizerSeasonAudit) return;
  const entries = sbwOrganizerEditorGetSeasonAuditEntries(organizer);

  sbwOrganizerSeasonAudit.innerHTML = `
    <section class="organizer-admin-season-audit-panel">
      <div class="organizer-admin-season-audit-head">
        <div>
          <span class="organizer-admin-eyebrow">Auditoria da temporada</span>
          <strong>Alterações recentes</strong>
          <p>Resumo visual dos vínculos e torneios pontuáveis da temporada atual.</p>
        </div>
        <span>${sbwOrganizerEditorEscape(entries.length)} registro${entries.length === 1 ? "" : "s"}</span>
      </div>
      ${entries.length ? `
        <div class="organizer-admin-season-audit-list">
          ${entries.map((entry) => `
            <article class="organizer-admin-season-audit-item">
              <span>${sbwOrganizerEditorEscape(entry.type)}</span>
              <strong>${sbwOrganizerEditorEscape(entry.title)}</strong>
              <small>${sbwOrganizerEditorEscape(entry.detail)} · ${sbwOrganizerEditorEscape(sbwOrganizerEditorFormatAuditDate(entry.date))}</small>
            </article>
          `).join("")}
        </div>
      ` : `
        <div class="organizer-admin-season-empty-note">
          Nenhuma alteração recente registrada. Quando torneios forem vinculados ou marcados como pontuáveis, o resumo aparecerá aqui.
        </div>
      `}
    </section>
  `;
}

function sbwOrganizerEditorRenderSeasonTournamentsManager(organizer = sbwOrganizerEditorCurrent) {
  if (!sbwOrganizerSeasonTournamentsManager) return;
  const season = sbwOrganizerEditorGetCurrentSeason(organizer);
  const seasonName = String(season.name || season.title || "").trim();
  const seasonKey = sbwOrganizerEditorNormalizeSeasonKey(season.slug || season.key || seasonName);
  const startDate = String(season.startDate || season.start_date || "").slice(0, 10);
  const endDate = String(season.endDate || season.end_date || "").slice(0, 10);
  const candidates = sbwOrganizerEditorGetSeasonCandidateTournaments(season);

  if (!seasonName || !startDate || !endDate) {
    sbwOrganizerSeasonTournamentsManager.innerHTML = `
      <section class="organizer-admin-season-tournaments-panel">
        <div class="organizer-admin-season-tournaments-head">
          <div>
            <span class="organizer-admin-eyebrow">Torneios da temporada</span>
            <strong>Crie uma temporada para vincular torneios</strong>
            <p>Defina nome, início e fim da temporada antes de escolher quais torneios contam para o ranking do organizador e para o Ranking Global -SBW-.</p>
          </div>
        </div>
      </section>
    `;
    return;
  }

  const decoratedCandidates = candidates.map((tournament) => {
    const state = sbwOrganizerEditorGetTournamentSeasonStatus(tournament, season);
    const title = sbwOrganizerEditorGetTournamentTitle(tournament);
    const game = sbwOrganizerEditorGetTournamentGame(tournament);
    const formatMeta = sbwOrganizerEditorGetTournamentFormatMetadata(tournament);
    const searchableText = `${title} ${game} ${state.dateLabel} ${formatMeta.label || ""} ${formatMeta.shortLabel || ""}`.toLowerCase();
    return { tournament, state, title, game, formatMeta, searchableText };
  });

  const linkedCount = decoratedCandidates.filter((item) => item.state.linked).length;
  const pointableCount = decoratedCandidates.filter((item) => item.state.pointable).length;
  const eligibleCount = decoratedCandidates.filter((item) => item.state.insidePeriod && !item.state.linked).length;
  const outsideLinkedCount = decoratedCandidates.filter((item) => item.state.linked && !item.state.insidePeriod).length;
  const outsideCount = decoratedCandidates.filter((item) => !item.state.insidePeriod).length;
  const search = String(sbwOrganizerSeasonTournamentSearch || "").trim().toLowerCase();

  const searchedCandidates = decoratedCandidates.filter((item) => !search || item.searchableText.includes(search));
  const visibleCandidates = searchedCandidates.filter((item) => {
    if (sbwOrganizerSeasonTournamentFilter === "linked") return item.state.linked;
    if (sbwOrganizerSeasonTournamentFilter === "pointable") return item.state.pointable;
    if (sbwOrganizerSeasonTournamentFilter === "eligible") return item.state.insidePeriod && !item.state.linked;
    if (sbwOrganizerSeasonTournamentFilter === "outside") return !item.state.insidePeriod;
    return true;
  });

  const filterButtons = [
    ["all", "Todos", candidates.length],
    ["linked", "Vinculados", linkedCount],
    ["pointable", "Pontuáveis", pointableCount],
    ["eligible", "Aptos", eligibleCount],
    ["outside", "Fora do período", outsideCount]
  ];
  const rankingImpact = sbwOrganizerEditorGetSeasonRankingImpact(decoratedCandidates, season);

  sbwOrganizerSeasonTournamentsManager.innerHTML = `
    <section class="organizer-admin-season-tournaments-panel" data-season-key="${sbwOrganizerEditorEscape(seasonKey)}">
      <div class="organizer-admin-season-tournaments-head">
        <div>
          <span class="organizer-admin-eyebrow">Torneios da temporada</span>
          <strong>Vínculo e pontuação</strong>
          <p>Escolha quais torneios entram na temporada e quais contam para o ranking do organizador e para o Ranking Global -SBW-.</p>
        </div>
        <div class="organizer-admin-season-tournaments-summary">
          <span><strong>${sbwOrganizerEditorEscape(linkedCount)}</strong> vinculados</span>
          <span><strong>${sbwOrganizerEditorEscape(pointableCount)}</strong> pontuáveis</span>
          ${outsideLinkedCount ? `<span class="is-warning"><strong>${sbwOrganizerEditorEscape(outsideLinkedCount)}</strong> fora do período</span>` : ""}
        </div>
      </div>
      ${candidates.length ? `
        ${sbwOrganizerEditorRenderSeasonRankingImpact(rankingImpact)}
        <div class="organizer-admin-season-toolbar">
          <label class="organizer-admin-season-search">
            <span>Buscar torneio</span>
            <input type="search" data-season-search placeholder="Nome, jogo ou data" value="${sbwOrganizerEditorEscape(sbwOrganizerSeasonTournamentSearch)}">
          </label>
          <div class="organizer-admin-season-filter-list" aria-label="Filtrar torneios da temporada">
            ${filterButtons.map(([key, label, count]) => `
              <button type="button" data-season-filter="${sbwOrganizerEditorEscape(key)}" class="${sbwOrganizerSeasonTournamentFilter === key ? "is-active" : ""}">
                ${sbwOrganizerEditorEscape(label)} <strong>${sbwOrganizerEditorEscape(count)}</strong>
              </button>
            `).join("")}
          </div>
          <small>${sbwOrganizerEditorEscape(visibleCandidates.length)} de ${sbwOrganizerEditorEscape(candidates.length)} torneio${candidates.length === 1 ? "" : "s"} exibido${visibleCandidates.length === 1 ? "" : "s"}</small>
        </div>
        ${visibleCandidates.length ? `
          <div class="organizer-admin-season-tournament-list">
            ${visibleCandidates.map(({ tournament, state, title, game }) => {
              const key = sbwOrganizerEditorGetTournamentKey(tournament);
              const canLink = state.insidePeriod || state.explicitLinked;
              const statusLabel = state.explicitLinked
                ? "Vinculado"
                : state.legacyLinked
                  ? "Elegível por período"
                  : state.insidePeriod
                    ? "Dentro do período"
                    : "Fora do período";
              const statusClass = state.explicitLinked || state.legacyLinked
                ? "is-linked"
                : state.insidePeriod
                  ? "is-eligible"
                  : "is-outside";
              return `
                <article class="organizer-admin-season-tournament-item ${statusClass}">
                  <div class="organizer-admin-season-tournament-main">
                    <span class="organizer-admin-season-tournament-status">${sbwOrganizerEditorEscape(statusLabel)}</span>
                    <strong>${sbwOrganizerEditorEscape(title)}</strong>
                    <small>${sbwOrganizerEditorEscape(game)} · ${sbwOrganizerEditorEscape(state.dateLabel)}</small>
                  </div>
                  <div class="organizer-admin-season-tournament-flags">
                    ${sbwOrganizerEditorRenderFormatBadge(tournament, { short: true, compact: true })}
                    <span class="${state.pointable ? "is-on" : ""}">${state.pointable ? "Pontuável" : "Não pontua"}</span>
                    ${!state.insidePeriod ? `<span class="is-warning">fora do período</span>` : ""}
                  </div>
                  <div class="organizer-admin-season-tournament-actions">
                    ${state.explicitLinked ? `
                      <button type="button" class="organizer-admin-small-link organizer-admin-small-link--button" data-season-unlink-tournament="${sbwOrganizerEditorEscape(key)}">Desvincular</button>
                    ` : `
                      <button type="button" class="organizer-admin-small-link organizer-admin-small-link--button" data-season-link-tournament="${sbwOrganizerEditorEscape(key)}" ${canLink ? "" : "disabled"}>Vincular</button>
                    `}
                    <button type="button" class="organizer-admin-small-link organizer-admin-small-link--button organizer-admin-small-link--primary" data-season-toggle-ranking="${sbwOrganizerEditorEscape(key)}" ${state.linked && state.insidePeriod ? "" : "disabled"}>
                      ${state.pointable ? "Remover pontuação" : "Pontuar ranking"}
                    </button>
                  </div>
                </article>
              `;
            }).join("")}
          </div>
        ` : `
          <div class="organizer-admin-season-empty-note">Nenhum torneio encontrado com o filtro atual.</div>
        `}
      ` : `
        <div class="organizer-admin-season-empty-note">Nenhum torneio carregado para este organizador.</div>
      `}
    </section>
  `;
}

async function sbwOrganizerEditorUpdateTournamentSeason(tournamentKey, options = {}) {
  const tournament = sbwOrganizerEditorTournamentsCache.find((item) => sbwOrganizerEditorGetTournamentKey(item) === tournamentKey);
  if (!tournament) throw new Error("Torneio não encontrado na lista carregada.");
  if (typeof sbwUpdateTournamentForOrganizerAsync !== "function") {
    throw new Error("Função de edição do torneio não carregada.");
  }

  const season = sbwOrganizerEditorGetCurrentSeason();
  const seasonName = String(season.name || season.title || "Temporada atual").trim() || "Temporada atual";
  const seasonSlug = sbwOrganizerEditorNormalizeSeasonKey(season.slug || season.key || seasonName);
  const link = options.link !== false;
  const pointable = Boolean(options.pointable);
  const metadata = sbwOrganizerEditorAsObject(tournament?.metadata);
  const settings = sbwOrganizerEditorAsObject(tournament?.settings);
  const seasonPayload = link ? {
    name: seasonName,
    title: seasonName,
    slug: seasonSlug,
    startDate: season.startDate || season.start_date || "",
    endDate: season.endDate || season.end_date || "",
    linkedAt: new Date().toISOString()
  } : null;

  const payload = {
    seasonName: link ? seasonName : "",
    season_name: link ? seasonName : "",
    seasonSlug: link ? seasonSlug : "",
    season_slug: link ? seasonSlug : "",
    countsForRanking: link && pointable,
    counts_for_ranking: link && pointable,
    countsForOrganizerRanking: link && pointable,
    counts_for_organizer_ranking: link && pointable,
    rankingEnabled: link && pointable,
    ranking_enabled: link && pointable,
    globalRankingEligible: link && pointable,
    global_ranking_eligible: link && pointable,
    sbwGlobalRankingEligible: link && pointable,
    rankingScope: link && pointable ? "organizer_and_global" : "none",
    metadata: {
      ...metadata,
      season: seasonPayload,
      seasonName: link ? seasonName : "",
      seasonSlug: link ? seasonSlug : "",
      countsForRanking: link && pointable,
      countsForOrganizerRanking: link && pointable,
      rankingEnabled: link && pointable,
      globalRankingEligible: link && pointable,
      sbwGlobalRankingEligible: link && pointable,
      rankingScope: link && pointable ? "organizer_and_global" : "none",
      ranking: {
        ...sbwOrganizerEditorAsObject(metadata.ranking),
        enabled: link && pointable,
        countsForRanking: link && pointable,
        countsForOrganizerRanking: link && pointable,
        globalRankingEligible: link && pointable,
        scope: link && pointable ? "organizer_and_global" : "none"
      },
      seasonUpdatedAt: new Date().toISOString()
    },
    settings: {
      ...settings,
      season: seasonPayload,
      seasonName: link ? seasonName : "",
      seasonSlug: link ? seasonSlug : "",
      countsForRanking: link && pointable,
      countsForOrganizerRanking: link && pointable,
      rankingEnabled: link && pointable,
      globalRankingEligible: link && pointable,
      sbwGlobalRankingEligible: link && pointable,
      rankingScope: link && pointable ? "organizer_and_global" : "none",
      ranking: {
        ...sbwOrganizerEditorAsObject(settings.ranking),
        enabled: link && pointable,
        countsForRanking: link && pointable,
        countsForOrganizerRanking: link && pointable,
        globalRankingEligible: link && pointable,
        scope: link && pointable ? "organizer_and_global" : "none"
      }
    }
  };

  const result = await sbwUpdateTournamentForOrganizerAsync({
    organizer: sbwOrganizerEditorCurrent?.slug || sbwOrganizerEditorCurrent?.id || sbwOrganizerEditorSlug,
    tournamentId: tournamentKey,
    payload
  });

  return result?.tournament || result?.data || result?.row || result || tournament;
}

function sbwOrganizerEditorBindSeasonTournamentActions() {
  if (!sbwOrganizerSeasonTournamentsManager || sbwOrganizerSeasonTournamentsManager.dataset.bound === "true") return;
  sbwOrganizerSeasonTournamentsManager.dataset.bound = "true";
  sbwOrganizerSeasonTournamentsManager.addEventListener("click", async (event) => {
    const filterButton = event.target.closest("[data-season-filter]");
    if (filterButton) {
      sbwOrganizerSeasonTournamentFilter = filterButton.dataset.seasonFilter || "all";
      sbwOrganizerEditorRenderSeasonTournamentsManager(sbwOrganizerEditorCurrent);
      return;
    }

    const button = event.target.closest("[data-season-link-tournament], [data-season-unlink-tournament], [data-season-toggle-ranking]");
    if (!button) return;
    const key = button.dataset.seasonLinkTournament || button.dataset.seasonUnlinkTournament || button.dataset.seasonToggleRanking || "";
    if (!key) return;
    const tournament = sbwOrganizerEditorTournamentsCache.find((item) => sbwOrganizerEditorGetTournamentKey(item) === key);
    if (!tournament) {
      sbwOrganizerEditorSetSeasonMessage("Torneio não encontrado na lista carregada.", "error");
      return;
    }

    const state = sbwOrganizerEditorGetTournamentSeasonStatus(tournament, sbwOrganizerEditorGetCurrentSeason());
    const isUnlink = Boolean(button.dataset.seasonUnlinkTournament);
    const isToggleRanking = Boolean(button.dataset.seasonToggleRanking);
    const nextPointable = isToggleRanking ? !state.pointable : state.pointable;
    const shouldLink = isUnlink ? false : true;

    if (isUnlink && state.pointable && !window.confirm("Este torneio está pontuando para a temporada e para o Ranking Global -SBW-. Deseja desvincular e remover a pontuação?")) {
      return;
    }

    try {
      button.disabled = true;
      sbwOrganizerEditorSetSeasonMessage("Atualizando vínculo do torneio...", "loading");
      await sbwOrganizerEditorUpdateTournamentSeason(key, {
        link: shouldLink,
        pointable: shouldLink && nextPointable
      });
      await sbwOrganizerEditorLoadTournaments();
      sbwOrganizerEditorSetSeasonMessage("Torneio atualizado na temporada.", "success");
    } catch (error) {
      console.error("[SBW Organizadores] Erro ao atualizar torneio da temporada:", error);
      sbwOrganizerEditorSetSeasonMessage(error?.message || "Não foi possível atualizar o torneio na temporada.", "error");
    } finally {
      button.disabled = false;
    }
  });

  sbwOrganizerSeasonTournamentsManager.addEventListener("input", (event) => {
    const input = event.target.closest("[data-season-search]");
    if (!input) return;
    sbwOrganizerSeasonTournamentSearch = input.value || "";
    window.clearTimeout(sbwOrganizerSeasonTournamentsManager._sbwSearchTimer);
    sbwOrganizerSeasonTournamentsManager._sbwSearchTimer = window.setTimeout(() => {
      sbwOrganizerEditorRenderSeasonTournamentsManager(sbwOrganizerEditorCurrent);
    }, 120);
  });
}

function sbwOrganizerEditorBindSeasonForm() {
  if (!sbwOrganizerSeasonForm || sbwOrganizerSeasonForm.dataset.bound === "true") return;
  sbwOrganizerSeasonForm.dataset.bound = "true";

  sbwOrganizerSeasonForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const startDate = sbwOrganizerSeasonStart?.value || "";
    const endDate = sbwOrganizerSeasonEnd?.value || "";

    const seasonPayloadPreview = {
      name: sbwOrganizerSeasonName?.value || "Temporada atual",
      startDate,
      endDate
    };
    const validationErrors = sbwOrganizerEditorValidateSeasonPayload(seasonPayloadPreview);

    if (validationErrors.length) {
      sbwOrganizerEditorSetSeasonMessage(validationErrors[0], "error");
      return;
    }

    if (typeof sbwUpdateTournamentOrganizerProfileAsync !== "function") {
      sbwOrganizerEditorSetSeasonMessage("Função de salvamento do organizador não carregada.", "error");
      return;
    }

    try {
      sbwOrganizerEditorSetSeasonMessage("Salvando temporada...", "loading");
      const seasonPayload = {
        ...seasonPayloadPreview,
        slug: sbwOrganizerEditorNormalizeSeasonKey(seasonPayloadPreview.name || "temporada-atual"),
        status: "active",
        maxDurationDays: 366,
        linkedTournamentsCount: sbwOrganizerEditorGetSeasonLinkedTournaments(sbwOrganizerEditorGetCurrentSeason()).length,
        updatedAt: new Date().toISOString()
      };
      const currentMetadata = sbwOrganizerEditorAsObject(sbwOrganizerEditorCurrent?.metadata);
      const organizerName = String(
        sbwOrganizerEditorCurrent?.name ||
        sbwOrganizerEditorCurrent?.displayName ||
        sbwOrganizerEditorCurrent?.title ||
        sbwOrganizerEditorCurrent?.slug ||
        sbwOrganizerEditorSlug ||
        "Organizador"
      ).trim() || "Organizador";

      const result = await sbwUpdateTournamentOrganizerProfileAsync(
        sbwOrganizerEditorCurrent?.slug || sbwOrganizerEditorSlug,
        {
          name: organizerName,
          displayName: organizerName,
          description: sbwOrganizerEditorCurrent?.description || "",
          shortDescription: sbwOrganizerEditorCurrent?.shortDescription || sbwOrganizerEditorCurrent?.short_description || "",
          logoUrl: sbwOrganizerEditorCurrent?.logoUrl || sbwOrganizerEditorCurrent?.logo_url || "",
          bannerUrl: sbwOrganizerEditorCurrent?.bannerUrl || sbwOrganizerEditorCurrent?.banner_url || "",
          country: sbwOrganizerEditorCurrent?.country || "",
          region: sbwOrganizerEditorCurrent?.region || "",
          websiteUrl: sbwOrganizerEditorCurrent?.websiteUrl || sbwOrganizerEditorCurrent?.website_url || "",
          links: sbwOrganizerEditorCurrent?.links || currentMetadata.links || {},
          socialLinks: sbwOrganizerEditorCurrent?.socialLinks || sbwOrganizerEditorCurrent?.social_links || currentMetadata.links || {},
          games: Array.isArray(sbwOrganizerEditorCurrent?.games) ? sbwOrganizerEditorCurrent.games : [],
          metadata: {
            ...currentMetadata,
            currentSeason: seasonPayload,
            seasons: {
              ...sbwOrganizerEditorAsObject(currentMetadata.seasons),
              current: seasonPayload
            }
          }
        }
      );
      const organizer = result?.organizer || result || sbwOrganizerEditorCurrent;
      sbwOrganizerEditorCurrent = await sbwOrganizerEditorMergeAccess(organizer);
      sbwOrganizerEditorHydrateSeasonForm(sbwOrganizerEditorCurrent);
      sbwOrganizerEditorSetSeasonMessage("Temporada salva.", "success");
    } catch (error) {
      console.error("[SBW Organizadores] Erro ao salvar temporada:", error);
      sbwOrganizerEditorSetSeasonMessage(error?.message || "Não foi possível salvar a temporada.", "error");
    }
  });
}

function sbwOrganizerEditorGetRankingData(type, organizer = sbwOrganizerEditorCurrent) {
  const metadata = sbwOrganizerEditorAsObject(organizer?.metadata);
  const settings = sbwOrganizerEditorAsObject(organizer?.settings);
  const ranking = sbwOrganizerEditorAsObject(
    metadata.rankings || metadata.ranking || settings.rankings || settings.ranking || organizer?.rankings || organizer?.ranking
  );
  const keys = type === "teams"
    ? ["teams", "equipes", "teamRanking", "rankingEquipes"]
    : ["players", "jogadores", "playerRanking", "rankingJogadores"];

  for (const key of keys) {
    if (Array.isArray(ranking[key])) return ranking[key];
    if (Array.isArray(metadata[key])) return metadata[key];
    if (Array.isArray(settings[key])) return settings[key];
  }

  return [];
}

function sbwOrganizerEditorRenderRanking(type) {
  const root = type === "teams" ? sbwOrganizerEditorRankingTeams : sbwOrganizerEditorRankingPlayers;
  if (!root) return;

  const label = type === "teams" ? "Equipes" : "Jogadores";
  const rows = sbwOrganizerEditorGetRankingData(type)
    .slice()
    .sort((a, b) => Number(b.points || b.score || 0) - Number(a.points || a.score || 0))
    .slice(0, 5);

  if (!rows.length) {
    root.innerHTML = `<div class="organizer-admin-empty-row">${label} aparecerão quando houver pontuação.</div>`;
    return;
  }

  root.innerHTML = rows.map((item, index) => {
    const position = item.position || item.rank || index + 1;
    const name = item.name || item.playerName || item.teamName || item.profileSlug || item.teamSlug || "Sem nome";
    const points = Number(item.points || item.score || 0);
    return `
      <div class="organizer-admin-ranking-row">
        <span>#${sbwOrganizerEditorEscape(position)}</span>
        <strong>${sbwOrganizerEditorEscape(name)}</strong>
        <em>+${sbwOrganizerEditorEscape(points)}</em>
      </div>
    `;
  }).join("");
}

function sbwOrganizerEditorRenderRankings() {
  sbwOrganizerEditorRenderRanking("players");
  sbwOrganizerEditorRenderRanking("teams");
}


const sbwOrganizerEditorPanelMap = {
  organizerEditorTournaments: "tournaments",
  organizerEditorSeasons: "seasons",
  organizerEditorRankings: "rankings",
  organizerEditorStaff: "staff",
  organizerEditorSettings: "settings"
};

function sbwOrganizerEditorGetViewFromHash() {
  const hash = String(window.location.hash || "").replace(/^#/, "");
  return sbwOrganizerEditorPanelMap[hash] || "overview";
}

function sbwOrganizerEditorSetActiveView(view = "overview") {
  const normalizedView = ["overview", "tournaments", "seasons", "rankings", "staff", "settings"].includes(view)
    ? view
    : "overview";

  document.querySelectorAll("[data-organizer-admin-panel]").forEach((panel) => {
    const isVisible = panel.dataset.organizerAdminPanel === normalizedView;
    panel.hidden = !isVisible;
    panel.classList.toggle("is-active", isVisible);
  });

  document.querySelectorAll("[data-organizer-admin-view]").forEach((control) => {
    const isActive = control.dataset.organizerAdminView === normalizedView;
    control.classList.toggle("is-active", isActive);
    if (control.tagName === "BUTTON") {
      control.setAttribute("aria-pressed", isActive ? "true" : "false");
    } else if (isActive) {
      control.setAttribute("aria-current", "page");
    } else {
      control.removeAttribute("aria-current");
    }
  });

  if (sbwOrganizerEditorDashboardGrid) {
    sbwOrganizerEditorDashboardGrid.dataset.activeView = normalizedView;
    sbwOrganizerEditorDashboardGrid.classList.toggle("is-overview", normalizedView === "overview");
    sbwOrganizerEditorDashboardGrid.classList.toggle("is-panel-mode", normalizedView !== "overview");
  }

  if (sbwOrganizerEditorShell) {
    sbwOrganizerEditorShell.classList.add("is-nav-ready");
  }
}

function sbwOrganizerEditorGetViewFromTarget(target) {
  const raw = String(target || "").replace(/^#/, "");
  return sbwOrganizerEditorPanelMap[raw] || (raw === "organizerEditorOverview" ? "overview" : "overview");
}

function sbwOrganizerEditorBindInternalNavigation() {
  if (document.body.dataset.sbwOrganizerNavReady === "true") {
    sbwOrganizerEditorSetActiveView(sbwOrganizerEditorGetViewFromHash());
    return;
  }

  document.body.dataset.sbwOrganizerNavReady = "true";

  document.querySelectorAll("[data-organizer-admin-view]").forEach((control) => {
    control.addEventListener("click", (event) => {
      const view = control.dataset.organizerAdminView || "overview";

      if (control.tagName === "BUTTON") {
        event.preventDefault();
        if (window.history?.replaceState) {
          window.history.replaceState({}, "", `${window.location.pathname}${window.location.search}`);
        }
        sbwOrganizerEditorSetActiveView("overview");
        return;
      }

      sbwOrganizerEditorSetActiveView(view);
    });
  });

  document.querySelectorAll('a[href^="#organizerEditor"]').forEach((link) => {
    link.addEventListener("click", () => {
      const view = link.dataset.organizerAdminView || sbwOrganizerEditorGetViewFromTarget(link.getAttribute("href"));
      window.setTimeout(() => sbwOrganizerEditorSetActiveView(view), 0);
    });
  });

  window.addEventListener("hashchange", () => {
    sbwOrganizerEditorSetActiveView(sbwOrganizerEditorGetViewFromHash());
  });

  sbwOrganizerEditorSetActiveView(sbwOrganizerEditorGetViewFromHash());
}


function sbwOrganizerEditorGetStaffOrganizerKey() {
  return sbwOrganizerEditorCurrent?.slug || sbwOrganizerEditorCurrent?.id || sbwOrganizerEditorSlug || "";
}

function sbwOrganizerEditorSetStaffMessage(message, type = "") {
  if (!sbwOrganizerStaffMessage) return;
  sbwOrganizerStaffMessage.textContent = message || "";
  sbwOrganizerStaffMessage.classList.remove("is-success", "is-error");
  if (type) sbwOrganizerStaffMessage.classList.add(`is-${type}`);
}

function sbwOrganizerEditorGetStaffInitials(member) {
  return String(member?.displayName || member?.name || member?.profileSlug || "ST")
    .trim()
    .split(/\s+/)
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase() || "ST";
}

function sbwOrganizerEditorRenderStaffList(staff = []) {
  if (!sbwOrganizerStaffList) return;

  const activeStaff = Array.isArray(staff) ? staff : [];

  if (sbwOrganizerStaffCount) {
    sbwOrganizerStaffCount.textContent = `${activeStaff.length} membro${activeStaff.length === 1 ? "" : "s"}`;
  }

  if (!activeStaff.length) {
    sbwOrganizerStaffList.innerHTML = `
      <div class="organizer-admin-staff-empty">
        Nenhum membro de staff encontrado ainda. Adicione usuários pelo slug ou username do perfil SBW.
      </div>
    `;
    return;
  }

  sbwOrganizerStaffList.innerHTML = activeStaff.map((member) => {
    const id = member.id || member.profileId || member.authUserId || member.profileSlug || "";
    const isOwner = String(member.role || "").toLowerCase() === "owner";
    const name = member.displayName || member.name || member.profileSlug || "Membro autorizado";
    const subline = [member.profileSlug ? `@${member.profileSlug}` : "", member.statusLabel || member.status || "Ativo"]
      .filter(Boolean)
      .join(" • ");
    const avatarHTML = member.avatarUrl
      ? `<img src="${sbwOrganizerEditorEscape(member.avatarUrl)}" alt="${sbwOrganizerEditorEscape(name)}">`
      : `<span>${sbwOrganizerEditorEscape(sbwOrganizerEditorGetStaffInitials(member))}</span>`;

    return `
      <div class="organizer-admin-staff-item organizer-admin-staff-item--real" data-organizer-staff-id="${sbwOrganizerEditorEscape(id)}">
        <div class="organizer-admin-staff-avatar">${avatarHTML}</div>
        <div class="organizer-admin-staff-main">
          <strong>${sbwOrganizerEditorEscape(name)}</strong>
          <span>${sbwOrganizerEditorEscape(subline || "Membro do organizador")}</span>
        </div>
        <div class="organizer-admin-staff-actions">
          ${isOwner
            ? `<span class="organizer-admin-pill">Dono</span>`
            : `
              <select class="organizer-admin-staff-role-select" data-organizer-staff-role="${sbwOrganizerEditorEscape(id)}">
                <option value="staff" ${member.role === "staff" || member.role === "member" ? "selected" : ""}>Staff</option>
                <option value="manager" ${member.role === "manager" ? "selected" : ""}>Gestor</option>
                <option value="admin" ${member.role === "admin" || member.role === "organizer_admin" ? "selected" : ""}>Administrador</option>
              </select>
              <button class="organizer-admin-action-btn organizer-admin-staff-remove" type="button" data-organizer-staff-remove="${sbwOrganizerEditorEscape(id)}" aria-label="Remover membro">
                <i class="fa-solid fa-user-minus"></i>
              </button>
            `
          }
        </div>
      </div>
    `;
  }).join("");
}

async function sbwOrganizerEditorLoadStaff() {
  if (!sbwOrganizerStaffList) return;

  if (sbwOrganizerEditorIsNew || !sbwOrganizerEditorGetStaffOrganizerKey()) {
    sbwOrganizerEditorRenderStaffList([]);
    sbwOrganizerEditorSetStaffMessage("Salve a organização antes de adicionar staff.");
    return;
  }

  sbwOrganizerStaffList.innerHTML = `
    <div class="organizer-admin-staff-empty">Carregando staff do organizador...</div>
  `;

  try {
    const staff = typeof sbwGetTournamentOrganizerStaffAsync === "function"
      ? await sbwGetTournamentOrganizerStaffAsync(sbwOrganizerEditorCurrent)
      : [];
    sbwOrganizerEditorRenderStaffList(staff);
  } catch (error) {
    console.error("Erro ao carregar staff do organizador:", error);
    sbwOrganizerEditorSetStaffMessage(error?.message || "Não foi possível carregar o staff.", "error");
  }
}

function sbwOrganizerEditorSetStaffSaving(isSaving) {
  if (sbwOrganizerStaffInviteButton) {
    sbwOrganizerStaffInviteButton.disabled = Boolean(isSaving);
    sbwOrganizerStaffInviteButton.innerHTML = isSaving
      ? `<i class="fa-solid fa-circle-notch fa-spin"></i> Adicionando...`
      : `<i class="fa-solid fa-user-plus"></i> Adicionar staff`;
  }
}

function sbwOrganizerEditorBindStaff() {
  if (sbwOrganizerStaffInviteForm && sbwOrganizerStaffInviteForm.dataset.sbwReady !== "true") {
    sbwOrganizerStaffInviteForm.dataset.sbwReady = "true";
    sbwOrganizerStaffInviteForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      sbwOrganizerEditorSetStaffMessage("");

      const profileKey = String(sbwOrganizerStaffProfileKey?.value || "").trim().replace(/^@/, "");
      const role = String(sbwOrganizerStaffRole?.value || "staff").trim() || "staff";
      const organizerKey = sbwOrganizerEditorGetStaffOrganizerKey();

      if (!organizerKey) {
        sbwOrganizerEditorSetStaffMessage("Salve a organização antes de adicionar staff.", "error");
        return;
      }

      if (!profileKey) {
        sbwOrganizerEditorSetStaffMessage("Informe o slug, username ou ID do perfil SBW.", "error");
        return;
      }

      try {
        sbwOrganizerEditorSetStaffSaving(true);
        const result = await sbwAddTournamentOrganizerStaffAsync({ organizer: organizerKey, profileKey, role });
        sbwOrganizerStaffProfileKey.value = "";
        sbwOrganizerEditorSetStaffMessage(result?.message || "Membro adicionado ao staff.", "success");
        await sbwOrganizerEditorLoadStaff();
      await sbwOrganizerEditorLoadTournaments();
      sbwOrganizerEditorHydrateSeasonForm(sbwOrganizerEditorCurrent);
      sbwOrganizerEditorRenderRankings();
      } catch (error) {
        console.error("Erro ao adicionar staff:", error);
        sbwOrganizerEditorSetStaffMessage(error?.message || "Não foi possível adicionar o usuário ao staff.", "error");
      } finally {
        sbwOrganizerEditorSetStaffSaving(false);
      }
    });
  }

  if (sbwOrganizerStaffList && sbwOrganizerStaffList.dataset.sbwReady !== "true") {
    sbwOrganizerStaffList.dataset.sbwReady = "true";
    sbwOrganizerStaffList.addEventListener("change", async (event) => {
      const select = event.target.closest?.("[data-organizer-staff-role]");
      if (!select) return;

      try {
        await sbwUpdateTournamentOrganizerStaffRoleAsync({
          organizer: sbwOrganizerEditorGetStaffOrganizerKey(),
          memberId: select.dataset.organizerStaffRole,
          role: select.value
        });
        sbwOrganizerEditorSetStaffMessage("Cargo atualizado.", "success");
        await sbwOrganizerEditorLoadStaff();
      await sbwOrganizerEditorLoadTournaments();
      sbwOrganizerEditorHydrateSeasonForm(sbwOrganizerEditorCurrent);
      sbwOrganizerEditorRenderRankings();
      } catch (error) {
        console.error("Erro ao atualizar cargo do staff:", error);
        sbwOrganizerEditorSetStaffMessage(error?.message || "Não foi possível atualizar o cargo.", "error");
        await sbwOrganizerEditorLoadStaff();
      await sbwOrganizerEditorLoadTournaments();
      sbwOrganizerEditorHydrateSeasonForm(sbwOrganizerEditorCurrent);
      sbwOrganizerEditorRenderRankings();
      }
    });

    sbwOrganizerStaffList.addEventListener("click", async (event) => {
      const button = event.target.closest?.("[data-organizer-staff-remove]");
      if (!button) return;

      const confirmed = window.confirm("Remover este usuário do staff do organizador?");
      if (!confirmed) return;

      try {
        button.disabled = true;
        await sbwRemoveTournamentOrganizerStaffAsync({
          organizer: sbwOrganizerEditorGetStaffOrganizerKey(),
          memberId: button.dataset.organizerStaffRemove
        });
        sbwOrganizerEditorSetStaffMessage("Membro removido do staff.", "success");
        await sbwOrganizerEditorLoadStaff();
      await sbwOrganizerEditorLoadTournaments();
      sbwOrganizerEditorHydrateSeasonForm(sbwOrganizerEditorCurrent);
      sbwOrganizerEditorRenderRankings();
      } catch (error) {
        console.error("Erro ao remover staff:", error);
        sbwOrganizerEditorSetStaffMessage(error?.message || "Não foi possível remover o membro.", "error");
        button.disabled = false;
      }
    });
  }
}


function sbwOrganizerEditorAccessItemCanManage(item) {
  if (!item) return false;
  const role = String(item.memberRole || item.role || item.currentUserRole || "").toLowerCase();

  return Boolean(
    item.canCreateTournament === true ||
    item.can_create_tournaments === true ||
    item.canManage === true ||
    item.can_manage === true ||
    ["owner", "admin", "manager", "organizer_admin", "tournament_admin", "admin_sbw"].includes(role)
  );
}

async function sbwOrganizerEditorGetEntryOrganizations() {
  if (typeof sbwGetMyTournamentOrganizerAccessAsync !== "function") {
    return [];
  }

  try {
    const accessList = await sbwGetMyTournamentOrganizerAccessAsync();
    return Array.isArray(accessList) ? accessList : [];
  } catch (error) {
    console.warn("[SBW Organizadores] Não foi possível resolver organizações vinculadas à conta:", error);
    return [];
  }
}

function sbwOrganizerEditorGetEntryOrganizationKey(organizer) {
  return String(organizer?.slug || organizer?.id || organizer?.raw?.slug || organizer?.raw?.id || "").trim();
}

function sbwOrganizerEditorApplyEntryUrl(params = {}) {
  if (!window.history?.replaceState) return;

  const nextParams = new URLSearchParams(window.location.search);
  Object.entries(params || {}).forEach(([key, value]) => {
    const safeValue = String(value || "").trim();
    if (safeValue) {
      nextParams.set(key, safeValue);
    } else {
      nextParams.delete(key);
    }
  });

  const query = nextParams.toString();
  window.history.replaceState({}, "", `${window.location.pathname}${query ? `?${query}` : ""}`);
}

function sbwOrganizerEditorGetTournamentStatusKey(tournament) {
  return String(tournament?.status || tournament?.status_key || tournament?.state || "")
    .trim()
    .toLowerCase();
}

function sbwOrganizerEditorGetTournamentWindowValue(tournament, keys = []) {
  const metadata = sbwOrganizerEditorAsObject(tournament?.metadata);
  const settings = sbwOrganizerEditorAsObject(tournament?.settings);
  const sourceList = [tournament, tournament?.raw, metadata, settings, sbwOrganizerEditorAsObject(metadata.registration), sbwOrganizerEditorAsObject(settings.registration)];

  for (const source of sourceList) {
    if (!source || typeof source !== "object") continue;
    for (const key of keys) {
      const value = source[key];
      if (value) return value;
    }
  }

  return "";
}

function sbwOrganizerEditorTournamentHasRegistrationWindows(tournament) {
  const registrationOpen = sbwOrganizerEditorGetTournamentWindowValue(tournament, ["registration_opens_at", "registrationOpensAt", "registration_open_at", "registrationOpenAt"]);
  const registrationClose = sbwOrganizerEditorGetTournamentWindowValue(tournament, ["registration_closes_at", "registrationClosesAt", "registration_close_at", "registrationCloseAt"]);
  const checkinStart = sbwOrganizerEditorGetTournamentWindowValue(tournament, ["checkin_starts_at", "checkinStartsAt", "check_in_starts_at", "checkInStartsAt"]);
  const checkinEnd = sbwOrganizerEditorGetTournamentWindowValue(tournament, ["checkin_ends_at", "checkinEndsAt", "check_in_ends_at", "checkInEndsAt"]);

  return Boolean(registrationOpen && registrationClose && checkinStart && checkinEnd);
}

function sbwOrganizerEditorTournamentAcceptsPublicRegistrations(tournament) {
  const status = sbwOrganizerEditorGetTournamentStatusKey(tournament);
  return ["published", "registration-open", "registration_open", "open", "scheduled"].includes(status);
}

function sbwOrganizerEditorGetTournamentParticipantTotals(tournament) {
  const metadata = sbwOrganizerEditorAsObject(tournament?.metadata);
  const stats = sbwOrganizerEditorAsObject(tournament?.stats || tournament?.statistics || metadata.stats || metadata.participants);
  const registered = Number(tournament?.currentParticipants ?? tournament?.current_participants ?? stats.registered ?? stats.total ?? 0) || 0;
  const checkedIn = Number(tournament?.checkedInParticipants ?? tournament?.checked_in_participants ?? stats.checkedIn ?? stats.checked_in ?? 0) || 0;

  return { registered, checkedIn };
}

function sbwOrganizerEditorBuildExternalOrganizerReadiness(organizer = sbwOrganizerEditorCurrent, tournaments = sbwOrganizerEditorTournamentsCache) {
  const list = Array.isArray(tournaments) ? tournaments : [];
  const isNew = Boolean(sbwOrganizerEditorIsNew || !organizer?.slug);
  const canCreateTournament = sbwOrganizerEditorCanCreateTournament(organizer);
  const profileReady = Boolean(!isNew && organizer?.slug && (organizer?.name || organizer?.displayName));
  const publicReady = Boolean(profileReady && organizer?.slug);
  const hasTournament = list.length > 0;
  const openTournament = list.find(sbwOrganizerEditorTournamentAcceptsPublicRegistrations) || null;
  const windowsTournament = list.find(sbwOrganizerEditorTournamentHasRegistrationWindows) || null;
  const totals = list.reduce((acc, tournament) => {
    const itemTotals = sbwOrganizerEditorGetTournamentParticipantTotals(tournament);
    acc.registered += itemTotals.registered;
    acc.checkedIn += itemTotals.checkedIn;
    return acc;
  }, { registered: 0, checkedIn: 0 });

  const checks = [
    {
      key: "permission",
      label: "Permissão de organizador",
      detail: "Conta autorizada para operar organização de torneios. Conta comum permanece bloqueada.",
      done: true
    },
    {
      key: "profile",
      label: "Perfil organizacional",
      detail: profileReady ? "Organização criada e carregada no painel." : "Preencha e salve o perfil da Rinha Online antes de criar torneios.",
      done: profileReady
    },
    {
      key: "public_profile",
      label: "Perfil público acessível",
      detail: publicReady ? "Perfil público pode ser aberto para conferência." : "Disponível depois que a organização tiver slug salvo.",
      done: publicReady
    },
    {
      key: "tournament",
      label: "Torneio vinculado",
      detail: hasTournament ? `${list.length} torneio(s) vinculado(s) encontrados.` : "Crie pelo menos um torneio pelo botão deste painel.",
      done: hasTournament
    },
    {
      key: "registration_windows",
      label: "Janelas de inscrição e check-in",
      detail: windowsTournament ? "Pelo menos um torneio já possui janelas reais configuradas." : "Configure abertura/fechamento de inscrições e check-in para o teste real.",
      done: Boolean(windowsTournament)
    },
    {
      key: "public_registration",
      label: "Inscrição pública preparada",
      detail: openTournament ? `Torneio pronto para inscrição pública: ${sbwOrganizerEditorGetTournamentTitle(openTournament)}.` : "Publique ou abra inscrições em um torneio comum antes de chamar jogadores.",
      done: Boolean(openTournament)
    },
    {
      key: "participants",
      label: "Acompanhamento de inscritos",
      detail: totals.registered > 0 ? `${totals.registered} inscrito(s) e ${totals.checkedIn} check-in(s) detectados no painel.` : "Durante o teste, acompanhe inscritos e check-ins pela aba Torneios.",
      done: totals.registered > 0,
      optional: true
    }
  ];

  const requiredChecks = checks.filter((check) => !check.optional);
  const doneRequired = requiredChecks.filter((check) => check.done).length;
  const next = checks.find((check) => !check.done && !check.optional) || checks.find((check) => !check.done) || null;

  return {
    checks,
    requiredTotal: requiredChecks.length,
    doneRequired,
    statusLabel: doneRequired >= requiredChecks.length ? "Fluxo pronto para teste real" : `${doneRequired}/${requiredChecks.length} etapas obrigatórias prontas`,
    nextLabel: next ? next.label : "Acompanhar execução real",
    canCreateTournament,
    isNew,
    hasTournament,
    publicReady
  };
}

function sbwOrganizerEditorRenderTestReadinessGuide(organizer = sbwOrganizerEditorCurrent) {
  const overview = document.getElementById("organizerEditorOverview");

  if (!overview) return;

  let guide = overview.querySelector("[data-organizer-test-readiness]");

  if (!guide) {
    guide = document.createElement("div");
    guide.className = "organizer-admin-readiness-guide";
    guide.setAttribute("data-organizer-test-readiness", "true");
    overview.appendChild(guide);
  }

  const readiness = sbwOrganizerEditorBuildExternalOrganizerReadiness(organizer);
  const publicUrl = organizer?.slug ? `organizador.html?slug=${encodeURIComponent(organizer.slug)}` : "organizador.html";
  const tournamentUrl = organizer ? sbwOrganizerEditorBuildCreateTournamentUrl(organizer) : "create-tournament/criar-torneio.html";
  const tournamentPanelUrl = "#organizerEditorTournaments";

  guide.innerHTML = `
    <div class="organizer-admin-readiness-head">
      <div>
        <span class="organizer-admin-eyebrow">Teste real com organizador externo</span>
        <strong>Checklist operacional da Rinha Online</strong>
      </div>
      <em>${sbwOrganizerEditorEscape(readiness.statusLabel)}</em>
    </div>
    <div class="organizer-admin-readiness-next">
      <span>Próximo foco</span>
      <strong>${sbwOrganizerEditorEscape(readiness.nextLabel)}</strong>
      <small>Use este card como conferência rápida antes de chamar jogadores reais.</small>
    </div>
    <ol class="organizer-admin-readiness-list">
      ${readiness.checks.map((check, index) => `
        <li class="${check.done ? "is-done" : index === readiness.doneRequired ? "is-current" : ""} ${check.optional ? "is-optional" : ""}">
          <span>${check.done ? "✓" : index + 1}</span>
          <p>
            <strong>${sbwOrganizerEditorEscape(check.label)}${check.optional ? " · acompanhamento" : ""}</strong>
            <small>${sbwOrganizerEditorEscape(check.detail)}</small>
          </p>
        </li>
      `).join("")}
    </ol>
    <div class="organizer-admin-readiness-note">
      A Rinha Online só deve conseguir operar depois da permissão de organizador. Criação de organização/torneio por conta comum continua bloqueada.
    </div>
    <div class="organizer-admin-readiness-actions">
      ${readiness.publicReady ? `<a href="${sbwOrganizerEditorEscape(publicUrl)}">Ver perfil público</a>` : ""}
      ${readiness.canCreateTournament ? `<a href="${sbwOrganizerEditorEscape(tournamentUrl)}">Criar torneio</a>` : ""}
      ${readiness.hasTournament ? `<a href="${sbwOrganizerEditorEscape(tournamentPanelUrl)}" data-organizer-admin-view="tournaments">Revisar torneios</a>` : ""}
    </div>
  `;

  guide.querySelectorAll("[data-organizer-admin-view]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      sbwOrganizerEditorShowPanel(link.getAttribute("data-organizer-admin-view"));
    });
  });
}

async function sbwOrganizerEditorLoad() {
  let isNewOrganizationEntry = sbwGetQueryParam("novo") === "1" || sbwGetQueryParam("create") === "1";
  sbwOrganizerEditorSlug = sbwGetQueryParam("slug") || sbwGetQueryParam("id") || "";

  const hasAccess = await sbwOrganizerEditorCheckAccess();

  if (!hasAccess) {
    return;
  }

  if (!sbwOrganizerEditorSlug && !isNewOrganizationEntry) {
    const entryOrganizations = await sbwOrganizerEditorGetEntryOrganizations();
    const preferredOrganization = entryOrganizations.find(sbwOrganizerEditorAccessItemCanManage) || entryOrganizations[0] || null;
    const preferredKey = sbwOrganizerEditorGetEntryOrganizationKey(preferredOrganization);

    if (preferredKey) {
      sbwOrganizerEditorSlug = preferredKey;
      sbwOrganizerEditorApplyEntryUrl({ slug: preferredKey, novo: "", create: "" });

      if (sbwOrganizerEditorStatusText) {
        sbwOrganizerEditorStatusText.textContent = "Organização vinculada encontrada. Carregando painel operacional...";
      }
    } else {
      isNewOrganizationEntry = true;
      sbwOrganizerEditorApplyEntryUrl({ novo: "1", create: "", slug: "", id: "" });

      if (sbwOrganizerEditorStatusText) {
        sbwOrganizerEditorStatusText.textContent = "Permissão confirmada. Crie o perfil organizacional para liberar a operação de torneios.";
      }
    }
  }

  if (!sbwOrganizerEditorSlug && isNewOrganizationEntry) {
    sbwOrganizerEditorIsNew = true;
    sbwOrganizerEditorCurrent = {
      name: "",
      tag: "",
      type: "Organizador de torneios",
      status: "active",
      description: "",
      games: [],
      aliases: [],
      links: {},
      theme: {}
    };

    document.title = "Criar Organização de Torneios | -SBW-";

    if (sbwOrganizerEditorAccess) {
      sbwOrganizerEditorAccess.hidden = true;
    }

    if (sbwOrganizerEditorShell) {
      sbwOrganizerEditorShell.hidden = false;
    }

    if (sbwOrganizerEditorStatusText) {
      sbwOrganizerEditorStatusText.textContent = "Permissão confirmada. Preencha e salve o perfil organizacional. Depois disso, a criação de torneios vinculados será liberada.";
    }

    if (sbwOrganizerOpenPublic) {
      sbwOrganizerOpenPublic.href = "torneios.html";
    }

    sbwOrganizerEditorUpdateCreateTournamentLink(null);

    sbwOrganizerEditorHydrateForm(sbwOrganizerEditorCurrent);
    sbwOrganizerEditorBindInternalNavigation();
    sbwOrganizerEditorBindPreviewEvents();
    sbwOrganizerEditorBindAssetControls();
    sbwOrganizerEditorBindSave();
    sbwOrganizerEditorBindReset();
    sbwOrganizerEditorBindStaff();
    sbwOrganizerEditorBindSeasonForm();
  sbwOrganizerEditorBindSeasonTournamentActions();
    sbwOrganizerEditorRenderPreview();
    sbwOrganizerEditorRenderTestReadinessGuide(sbwOrganizerEditorCurrent);
    sbwOrganizerEditorHydrateSeasonForm(sbwOrganizerEditorCurrent);
    sbwOrganizerEditorRenderRankings();
    sbwOrganizerEditorLoadTournaments();
    sbwOrganizerEditorLoadStaff();
    return;
  }

  if (!sbwOrganizerEditorSlug) {
    if (sbwOrganizerEditorShell) {
      sbwOrganizerEditorShell.hidden = true;
    }

    if (sbwOrganizerEditorAccess) {
      sbwOrganizerEditorAccess.hidden = false;
      sbwOrganizerEditorAccess.innerHTML = `
        <strong>Organizador não informado.</strong><br>
        Abra este painel a partir da página pública do organizador ou use a entrada “Criar organização”.
      `;
    }

    return;
  }


  let organizer = null;

  try {
    organizer = await sbwGetTournamentOrganizerBySlugAsync(sbwOrganizerEditorSlug);
  } catch (error) {
    console.error("Erro ao carregar organizador para edição:", error);
  }

  if (!organizer) {
    if (sbwOrganizerEditorAccess) {
      sbwOrganizerEditorAccess.hidden = false;
      sbwOrganizerEditorAccess.innerHTML = `
        <strong>Organizador não encontrado.</strong><br>
        Confira o slug/id usado na URL.
      `;
    }

    if (sbwOrganizerEditorShell) {
      sbwOrganizerEditorShell.hidden = true;
    }

    return;
  }

  organizer = await sbwOrganizerEditorMergeAccess(organizer);
  sbwOrganizerEditorCurrent = organizer;

  document.title = `Editar ${organizer.name || organizer.displayName || "Organizador"} | -SBW-`;

  if (sbwOrganizerEditorStatusText) {
    sbwOrganizerEditorStatusText.textContent = `${organizer.name || organizer.displayName || "Organizador"} carregado. As alterações agora são salvas no Supabase.`;
  }

  if (sbwOrganizerOpenPublic) {
    sbwOrganizerOpenPublic.href = `organizador.html?slug=${encodeURIComponent(organizer.slug || sbwOrganizerEditorSlug)}`;
  }

  sbwOrganizerEditorUpdateCreateTournamentLink(organizer);

  sbwOrganizerEditorHydrateForm(organizer);
  sbwOrganizerEditorBindInternalNavigation();
  sbwOrganizerEditorBindPreviewEvents();
  sbwOrganizerEditorBindAssetControls();
  sbwOrganizerEditorBindSave();
  sbwOrganizerEditorBindReset();
  sbwOrganizerEditorBindStaff();
  sbwOrganizerEditorBindSeasonForm();
  sbwOrganizerEditorBindSeasonTournamentActions();
  sbwOrganizerEditorRenderPreview();
  sbwOrganizerEditorRenderTestReadinessGuide(sbwOrganizerEditorCurrent);
  sbwOrganizerEditorHydrateSeasonForm(sbwOrganizerEditorCurrent);
  sbwOrganizerEditorRenderRankings();
  sbwOrganizerEditorLoadTournaments();
  sbwOrganizerEditorLoadStaff();
}

sbwOrganizerEditorLoad();
