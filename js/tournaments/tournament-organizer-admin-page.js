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

let sbwOrganizerEditorCurrent = null;
let sbwOrganizerEditorSlug = "";
let sbwOrganizerEditorIsNew = false;
let sbwOrganizerEditorTournamentsCache = [];
let sbwOrganizerEditorEditingTournament = null;
let sbwOrganizerEditorManagingTournament = null;
let sbwOrganizerEditorParticipantsCache = [];
let sbwOrganizerSeasonTournamentFilter = "all";
let sbwOrganizerSeasonTournamentSearch = "";

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
      ? "Formato avançado em beta controlado com MVP básico de divisão única, equipes reais após check-in e confrontos por equipe."
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
    { label: "Escalações", value: "3 + 1", detail: "Confirmar titulares e reserva antes do confronto." },
    { label: "Rodadas", value: "Round-robin", detail: "Gerar confrontos da divisão única e acompanhar resultados." }
  ];
  const releaseChecks = [
    "Formato ainda bloqueado para criação real.",
    "Primeira liberação deve usar somente divisão única.",
    "Modo com várias divisões fica reservado para etapa avançada.",
    "Inscrição, check-in e resultados reais entram apenas após validação controlada."
  ];
  const visualBoard = helper && typeof helper.buildTeamBattleLeagueVisualPreviewBoard === "function"
    ? helper.buildTeamBattleLeagueVisualPreviewBoard(tournament || {}, { leagueMode: "basic_single_division" })
    : null;
  const testPackage = helper && typeof helper.buildTeamBattleLeagueControlledTestPackage === "function"
    ? helper.buildTeamBattleLeagueControlledTestPackage(tournament || {}, { leagueMode: "basic_single_division" })
    : null;
  const mvpModel = helper && typeof helper.buildTeamBattleLeagueBasicMvpAdminSummary === "function"
    ? helper.buildTeamBattleLeagueBasicMvpAdminSummary(tournament || {}, { leagueMode: "basic_single_division" })
    : null;
  const setupPreview = helper && typeof helper.buildTeamBattleLeagueBasicMvpSetupPreview === "function"
    ? helper.buildTeamBattleLeagueBasicMvpSetupPreview(tournament || {}, { leagueMode: "basic_single_division" })
    : null;
  const testGates = Array.isArray(testPackage?.gates) ? testPackage.gates.slice(0, 6) : [];
  const mvpCards = Array.isArray(mvpModel?.cards) ? mvpModel.cards.slice(0, 4) : [];
  const mvpRequired = Array.isArray(mvpModel?.requiredData) ? mvpModel.requiredData.slice(0, 4) : [];
  const setupFields = Array.isArray(setupPreview?.fields) ? setupPreview.fields.slice(0, 8) : [];
  const setupCards = Array.isArray(setupPreview?.cards) ? setupPreview.cards.slice(0, 4) : [];
  const boardStandings = Array.isArray(visualBoard?.standings) ? visualBoard.standings.slice(0, 4) : [];
  const boardMatches = Array.isArray(visualBoard?.matches) ? visualBoard.matches.slice(0, 2) : [];

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
                <p>${sbwOrganizerEditorEscape(card.detail || "Preparado para teste controlado.")}</p>
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
          <p>${sbwOrganizerEditorEscape(mvpModel.nextAction || "Executar teste interno antes de liberar criação real.")}</p>
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
              <strong>Classificação</strong>
              ${boardStandings.length ? boardStandings.map((row, index) => `
                <div>
                  <span>${sbwOrganizerEditorEscape(row.position || index + 1)}º</span>
                  <strong>${sbwOrganizerEditorEscape(row.teamName || row.name || "Equipe confirmada")}</strong>
                  <small>${sbwOrganizerEditorEscape(row.battlePoints || 0)} pts · ${sbwOrganizerEditorEscape(row.teamMatchWins || 0)}V</small>
                </div>
              `).join("") : `<p>As equipes reais confirmadas aparecerão aqui após o check-in.</p>`}
            </div>
            <div class="organizer-admin-team-battle-round-preview">
              <strong>Rodada inicial</strong>
              ${boardMatches.length ? boardMatches.map((match) => `
                <article>
                  <small>${sbwOrganizerEditorEscape(match.label || "Confronto")}</small>
                  <div><span>${sbwOrganizerEditorEscape(match.homeTeamName || "Equipe confirmada")}</span><em>vs</em><span>${sbwOrganizerEditorEscape(match.awayTeamName || "Equipe confirmada")}</span></div>
                  <p>${sbwOrganizerEditorEscape(match.statusLabel || "A definir")}</p>
                </article>
              `).join("") : `<p>Os confrontos serão gerados quando houver equipes reais confirmadas.</p>`}
            </div>
          </div>
        </div>
      ` : ""}

      ${testGates.length ? `
        <div class="organizer-admin-team-battle-test-gates" aria-label="Etapas do teste controlado Team Battle League 4v4">
          <div class="organizer-admin-team-battle-test-gates__head">
            <div>
              <small>Teste controlado</small>
              <strong>${sbwOrganizerEditorEscape(testPackage?.releaseLabel || "Teste interno planejado")}</strong>
            </div>
            <span>${sbwOrganizerEditorEscape(testPackage?.modeLabel || "Básica · divisão única")}</span>
          </div>
          <div class="organizer-admin-team-battle-test-gates__grid">
            ${testGates.map((gate) => `
              <article class="is-${sbwOrganizerEditorEscape(gate.status || "pending")}">
                <small>${sbwOrganizerEditorEscape(gate.stateLabel || "Pendente")}</small>
                <strong>${sbwOrganizerEditorEscape(gate.label || "Etapa")}</strong>
                <p>${sbwOrganizerEditorEscape(gate.description || "Preparado para teste controlado.")}</p>
              </article>
            `).join("")}
          </div>
        </div>
      ` : ""}

      <div class="organizer-admin-team-battle-release-checks" aria-label="Checklist de liberação do formato">
        ${releaseChecks.map((item) => `<span>${sbwOrganizerEditorEscape(item)}</span>`).join("")}
      </div>

      <p class="organizer-admin-format-preview__warning">${sbwOrganizerEditorEscape(model?.lockedMessage || "Formato ainda em preparação. A configuração deve aparecer na criação; depois de criado, o torneio mostra a Divisão Única vazia até o check-in confirmar equipes reais.")}</p>
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
        <strong>Acesso restrito.</strong><br>
        Sua conta ainda não possui permissão da -SBW- para criar ou gerenciar uma Organização de Torneios.
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
    const meta = [
      sbwOrganizerEditorGetTournamentGame(tournament),
      sbwOrganizerEditorGetTournamentDate(tournament),
      typeof sbwGetParticipantsLabel === "function" ? sbwGetParticipantsLabel(tournament) : "Participantes"
    ].filter(Boolean).join(" · ");
    sbwOrganizerTournamentParticipantsMeta.textContent = meta || "Gerencie inscritos reais da plataforma -SBW-.";
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
  sbwOrganizerEditorRenderFormatPreview(sbwOrganizerTournamentEditFormat?.value);
  if (sbwOrganizerTournamentEditStatus) sbwOrganizerTournamentEditStatus.value = tournament?.status || tournament?.raw?.status || "draft";
  if (sbwOrganizerTournamentEditStartDate) sbwOrganizerTournamentEditStartDate.value = sbwOrganizerEditorFormatInputDate(tournament?.startsAt || tournament?.starts_at || tournament?.raw?.starts_at || tournament?.date);
  if (sbwOrganizerTournamentEditStartTime) sbwOrganizerTournamentEditStartTime.value = sbwOrganizerEditorFormatInputTime(tournament?.startsAt || tournament?.starts_at || tournament?.raw?.starts_at || tournament?.time);
  if (sbwOrganizerTournamentEditMax) sbwOrganizerTournamentEditMax.value = tournament?.maxParticipants || tournament?.max_participants || tournament?.raw?.max_participants || "";
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

  if (sbwOrganizerEditorTournamentsList && sbwOrganizerEditorTournamentsList.dataset.boundTournamentEdit !== "true") {
    sbwOrganizerEditorTournamentsList.dataset.boundTournamentEdit = "true";

    sbwOrganizerEditorTournamentsList.addEventListener("click", (event) => {
      const participantButton = event.target.closest?.("[data-organizer-tournament-participants]");
      const editButton = event.target.closest?.("[data-organizer-tournament-edit]");
      const button = participantButton || editButton;
      if (!button) return;

      event.preventDefault();

      const key = participantButton
        ? participantButton.dataset.organizerTournamentParticipants || ""
        : editButton.dataset.organizerTournamentEdit || "";

      const tournament = sbwOrganizerEditorFindTournamentByKey(key);

      if (!tournament) {
        const message = participantButton
          ? "Torneio não encontrado para carregar inscritos."
          : "Torneio não encontrado na lista carregada.";
        sbwOrganizerEditorSetTournamentEditMessage(message, "error");
        sbwOrganizerEditorSetParticipantsMessage(message, "error");
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
    sbwOrganizerTournamentEditFormat.addEventListener("change", () => sbwOrganizerEditorRenderFormatPreview(sbwOrganizerTournamentEditFormat.value));
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

      const tournamentId = sbwOrganizerTournamentEditId?.value || sbwOrganizerEditorGetTournamentKey(sbwOrganizerEditorEditingTournament);
      const selectedFormat = sbwOrganizerTournamentEditFormat?.value || "double-elimination";
      const formatMetadata = sbwOrganizerEditorGetFormatMetadata(selectedFormat);

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
            max_participants: sbwOrganizerTournamentEditMax?.value || null,
            cover_url: sbwOrganizerTournamentEditCover?.value || "",
            description: sbwOrganizerTournamentEditDescription?.value || "",
            rules: sbwOrganizerTournamentEditRules?.value || "",
            settings: {
              formatConfig: formatMetadata,
              formatFamily: formatMetadata.family,
              formatStatus: formatMetadata.status,
              teamMode: formatMetadata.teamMode
            },
            metadata: {
              format: formatMetadata
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
            <button class="organizer-admin-small-link organizer-admin-small-link--button organizer-admin-small-link--primary" type="button" data-organizer-tournament-participants="${sbwOrganizerEditorEscape(key)}">Inscritos</button>
            <a class="organizer-admin-small-link" href="${sbwOrganizerEditorEscape(sbwOrganizerEditorGetTournamentManageUrl(tournament))}">Gerenciar</a>
          </div>
        </article>
      `;
    }).join("");
  } catch (error) {
    console.error("[SBW Organizadores] Erro ao carregar torneios do painel:", error);
    sbwOrganizerEditorTournamentsCache = [];
    sbwOrganizerEditorTournamentsList.innerHTML = `
      <div class="organizer-admin-empty-row">
        Não foi possível carregar os torneios desta organização agora.
      </div>
    `;
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

async function sbwOrganizerEditorLoad() {
  const isNewOrganizationEntry = sbwGetQueryParam("novo") === "1" || sbwGetQueryParam("create") === "1";
  sbwOrganizerEditorSlug = sbwGetQueryParam("slug") || sbwGetQueryParam("id") || "";

  const hasAccess = await sbwOrganizerEditorCheckAccess();

  if (!hasAccess) {
    return;
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
      sbwOrganizerEditorStatusText.textContent = "Permissão confirmada. Preencha os dados para criar uma Organização de Torneios real no Supabase.";
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
  sbwOrganizerEditorHydrateSeasonForm(sbwOrganizerEditorCurrent);
  sbwOrganizerEditorRenderRankings();
  sbwOrganizerEditorLoadTournaments();
  sbwOrganizerEditorLoadStaff();
}

sbwOrganizerEditorLoad();
