const sbwPublicTournamentGrid = document.getElementById("publicTournamentGrid");
const sbwTournamentOrganizersGrid = document.getElementById("tournamentOrganizersGrid");
const sbwTournamentOrganizerCount = document.getElementById("tournamentOrganizerCount");
const sbwTournamentCount = document.getElementById("tournamentCount");
const sbwTournamentGameFilter = document.getElementById("tournamentGameFilter");
const sbwTournamentStatusFilter = document.getElementById("tournamentStatusFilter");
const sbwTournamentFormatFilter = document.getElementById("tournamentFormatFilter");
const sbwTournamentPlatformFilter = document.getElementById("tournamentPlatformFilter");
const sbwTournamentOrganizerFilter = document.getElementById("tournamentOrganizerFilter");
const sbwTournamentSearch = document.getElementById("tournamentSearch");
const sbwTournamentClearFilters = document.getElementById("tournamentClearFilters");
const sbwFeaturedTournamentMount = document.getElementById("featuredTournamentMount");
const sbwTournamentCalendarList = document.getElementById("tournamentCalendarList");
const sbwTournamentRankingPreview = document.getElementById("tournamentRankingPreview");
const sbwTournamentLiveCount = document.getElementById("tournamentLiveCount");
const sbwTournamentUpcomingCount = document.getElementById("tournamentUpcomingCount");
const sbwTournamentFinishedCount = document.getElementById("tournamentFinishedCount");
const sbwTournamentPlayersCount = document.getElementById("tournamentPlayersCount");

let sbwTournamentListRenderRequest = 0;
let sbwTournamentListCache = [];


function sbwTournamentPageLoading(target, title, message, rows = 4) {
  if (window.SBWPageState?.renderLoading) {
    window.SBWPageState.renderLoading(target, { title, message, rows });
    return;
  }

  if (target) {
    target.innerHTML = `<div class="empty-tournament-state">${sbwSafeEscape(message || title || "Carregando...")}</div>`;
  }
}

function sbwTournamentPageEmpty(target, title, message) {
  if (window.SBWPageState?.renderEmpty) {
    window.SBWPageState.renderEmpty(target, { title, message });
    return;
  }

  if (target) {
    target.innerHTML = `<div class="empty-tournament-state">${sbwSafeEscape(message || title || "Nada encontrado.")}</div>`;
  }
}

function sbwTournamentPageError(target, title, message, details = "") {
  if (window.SBWPageState?.renderError) {
    window.SBWPageState.renderError(target, { title, message, details });
    return;
  }

  if (target) {
    target.innerHTML = `<div class="empty-tournament-state">${sbwSafeEscape(message || title || "Erro ao carregar.")}</div>`;
  }
}

function sbwNormalizeTournamentFormatValue(format) {
  return String(format || "")
    .trim()
    .toLowerCase()
    .replaceAll("_", "-");
}

function sbwGetTournamentComparableFormat(tournament) {
  return sbwNormalizeTournamentFormatValue(sbwGetTournamentFormat(tournament));
}

function sbwNormalizeTextForCompare(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function sbwNormalizeSearchText(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function sbwSafeEscape(value) {
  if (typeof sbwEscapeHTML === "function") {
    return sbwEscapeHTML(value);
  }

  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function sbwGetTournamentPublicUrl(tournament) {
  const publicId = typeof sbwGetTournamentPublicId === "function"
    ? sbwGetTournamentPublicId(tournament)
    : String(tournament?.slug || tournament?.id || tournament?.supabaseId || "");

  return window.SBWRoutes?.tournament ? window.SBWRoutes.tournament(publicId) : `/torneios/detalhe-torneio.html?id=${encodeURIComponent(publicId)}`;
}

function sbwGetTournamentNameSafe(tournament) {
  if (typeof sbwGetTournamentName === "function") {
    return sbwGetTournamentName(tournament);
  }

  return String(tournament?.name || tournament?.title || "Torneio");
}

function sbwGetTournamentSourceLabel(tournament) {
  if (tournament?.source === "supabase") {
    return "Online";
  }

  if (tournament?.source === "local") {
    return "Local";
  }

  if (tournament?.source === "demo") {
    return "Fallback";
  }

  return "Publicado";
}

function sbwGetTournamentStartLabel(tournament) {
  const dateLabel = sbwFormatDate(sbwGetStartDate(tournament));
  const timeLabel = sbwGetStartTime(tournament);

  if (timeLabel && timeLabel !== "A definir") {
    return `${dateLabel} às ${timeLabel}`;
  }

  return dateLabel;
}

function sbwParseTournamentDate(value) {
  if (!value) {
    return null;
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value;
  }

  const raw = String(value).trim();

  if (!raw) {
    return null;
  }

  const direct = new Date(raw);

  if (!Number.isNaN(direct.getTime())) {
    return direct;
  }

  const brDate = raw.match(/^(\d{2})\/(\d{2})\/(\d{4})/);

  if (brDate) {
    const parsed = new Date(`${brDate[3]}-${brDate[2]}-${brDate[1]}T00:00:00`);

    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  return null;
}

function sbwGetTournamentStartDateObject(tournament) {
  return sbwParseTournamentDate(
    tournament?.startsAt ||
    tournament?.starts_at ||
    tournament?.startDate ||
    tournament?.date ||
    tournament?.eventDate ||
    tournament?.settings?.startDate ||
    ""
  );
}

function sbwGetTournamentTimestamp(tournament) {
  const date = sbwGetTournamentStartDateObject(tournament);
  return date ? date.getTime() : Number.POSITIVE_INFINITY;
}

function sbwGetTournamentTimestampForRecent(tournament) {
  const timestamp = sbwGetTournamentTimestamp(tournament);
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function sbwGetTournamentCategory(tournament) {
  const game = String(tournament?.game || tournament?.gameName || "").toLowerCase();
  const format = sbwGetTournamentComparableFormat(tournament);

  if (
    game.includes("street fighter") ||
    game.includes("tekken") ||
    game.includes("mortal") ||
    game.includes("kof") ||
    game.includes("guilty") ||
    format === "double-elimination"
  ) {
    return "fighting-games";
  }

  if (
    game.includes("valorant") ||
    game.includes("counter") ||
    game.includes("cs2") ||
    game.includes("call of duty")
  ) {
    return "fps";
  }

  return "all";
}

function sbwGetStatusClass(tournament) {
  return sbwGetStatusInfo(tournament?.status).className;
}

function sbwIsTournamentRunning(tournament) {
  const status = sbwGetStatusClass(tournament);
  const raw = String(tournament?.status || "").toLowerCase();

  return status === "running" || raw.includes("live") || raw.includes("ao-vivo");
}

function sbwIsTournamentOpen(tournament) {
  return sbwGetStatusClass(tournament) === "open";
}

function sbwIsTournamentFinished(tournament) {
  return sbwGetStatusClass(tournament) === "finished";
}

function sbwIsTournamentWithoutDate(tournament) {
  return !Number.isFinite(sbwGetTournamentTimestamp(tournament));
}

function sbwGetTournamentSectionKey(tournament) {
  if (sbwIsTournamentRunning(tournament)) {
    return "live";
  }

  if (sbwIsTournamentFinished(tournament)) {
    return "finished";
  }

  if (sbwIsTournamentWithoutDate(tournament)) {
    return "withoutDate";
  }

  return "upcoming";
}

function sbwGetTournamentOrganizerComparableValues(tournament) {
  const organizer = tournament?.organizer;
  const values = [
    tournament?.organizerId,
    tournament?.organizerSlug,
    tournament?.organizerName
  ];

  if (typeof organizer === "string") {
    values.push(organizer);
  }

  if (organizer && typeof organizer === "object") {
    values.push(
      organizer.id,
      organizer.slug,
      organizer.name,
      organizer.displayName,
      organizer.title
    );
  }

  return values
    .filter(Boolean)
    .map(sbwNormalizeTextForCompare)
    .filter(Boolean);
}

function sbwGetTournamentOrganizerFilterValue(tournament) {
  const values = sbwGetTournamentOrganizerComparableValues(tournament);
  return values[0] || sbwNormalizeTextForCompare(sbwGetOrganizerName(tournament));
}

function sbwCountTournamentsByOrganizer(organizer, tournaments = []) {
  if (typeof sbwTournamentBelongsToOrganizer === "function") {
    return tournaments.filter((tournament) => sbwTournamentBelongsToOrganizer(tournament, organizer)).length;
  }

  const organizerValues = [
    organizer?.id,
    organizer?.slug,
    organizer?.name,
    organizer?.displayName
  ]
    .filter(Boolean)
    .map(sbwNormalizeTextForCompare)
    .filter(Boolean);

  if (organizerValues.length === 0) {
    return 0;
  }

  return tournaments.filter((tournament) => {
    const tournamentValues = sbwGetTournamentOrganizerComparableValues(tournament);
    return tournamentValues.some((value) => organizerValues.includes(value));
  }).length;
}

function sbwGetOrganizerSourceLabel(organizer) {
  if (organizer?.source === "supabase") {
    return "Online";
  }

  if (organizer?.source === "demo") {
    return "Fallback";
  }

  return "Local";
}

function sbwRenderTournamentOrganizerCard(organizer, tournaments = []) {
  const tournamentCount = sbwCountTournamentsByOrganizer(organizer, tournaments);
  const initials = String(organizer?.tag || organizer?.name || "ORG")
    .trim()
    .slice(0, 3)
    .toUpperCase();
  const name = organizer?.name || organizer?.displayName || "Organizador";
  const status = typeof sbwGetOrganizerStatusLabel === "function"
    ? sbwGetOrganizerStatusLabel(organizer?.status)
    : (organizer?.statusLabel || "Ativo");
  const organizerSlug = organizer?.slug || organizer?.id || name;
  const organizerUrl = window.SBWRoutes?.organizer ? window.SBWRoutes.organizer(organizerSlug) : `/torneios/organizador.html?slug=${encodeURIComponent(organizerSlug)}`;
  const logoHTML = organizer?.logoUrl
    ? `<img src="${sbwSafeEscape(organizer.logoUrl)}" alt="Logo ${sbwSafeEscape(name)}">`
    : `<span>${sbwSafeEscape(initials || "ORG")}</span>`;
  const themeStyle = typeof sbwGetTournamentOrganizerThemeStyle === "function"
    ? sbwGetTournamentOrganizerThemeStyle(organizer)
    : "";

  return `
    <article class="tournament-organizer-card" style="${sbwSafeEscape(themeStyle)}">
      <div class="tournament-organizer-head">
        <div class="tournament-organizer-logo">
          ${logoHTML}
        </div>

        <div>
          <strong>${sbwSafeEscape(name)}</strong>
          <small>${sbwSafeEscape(status)} · ${tournamentCount} torneio${tournamentCount === 1 ? "" : "s"}</small>
        </div>
      </div>

      <a href="${sbwSafeEscape(organizerUrl)}">
        Ver organizador
      </a>
    </article>
  `;
}

async function sbwRenderTournamentOrganizers(tournaments = []) {
  if (!sbwTournamentOrganizersGrid) {
    return;
  }

  sbwTournamentOrganizersGrid.innerHTML = `
    <div class="empty-tournament-state">
      Carregando organizadores...
    </div>
  `;

  let organizers = [];

  try {
    if (typeof sbwGetAllTournamentOrganizersAsync === "function") {
      organizers = await sbwGetAllTournamentOrganizersAsync();
    }
  } catch (error) {
    console.error("Erro ao carregar organizadores de torneio:", error);
    organizers = [];
  }

  const organizersWithTournaments = Array.isArray(organizers)
    ? organizers
      .map((organizer) => ({
        organizer,
        count: sbwCountTournamentsByOrganizer(organizer, tournaments)
      }))
      .sort((a, b) => b.count - a.count)
    : [];

  if (organizersWithTournaments.length === 0) {
    sbwTournamentOrganizersGrid.innerHTML = `
      <div class="empty-tournament-state">
        Nenhum organizador publicado foi encontrado ainda.
      </div>
    `;
  } else {
    sbwTournamentOrganizersGrid.innerHTML = organizersWithTournaments
      .slice(0, 6)
      .map((entry) => sbwRenderTournamentOrganizerCard(entry.organizer, tournaments))
      .join("");
  }

  if (sbwTournamentOrganizerCount) {
    sbwTournamentOrganizerCount.textContent = String(organizersWithTournaments.length);
  }
}

function sbwGetWatchUrl(tournament) {
  return tournament?.streamUrl ||
    tournament?.watchUrl ||
    tournament?.liveUrl ||
    tournament?.metadata?.streamUrl ||
    tournament?.metadata?.watchUrl ||
    "";
}

function sbwGetTournamentCoverStyle(tournament) {
  const coverUrl = tournament?.coverUrl || tournament?.bannerUrl || tournament?.imageUrl || tournament?.metadata?.coverUrl || "";

  if (!coverUrl) {
    return "";
  }

  return ` style="--tournament-cover: url('${sbwSafeEscape(coverUrl)}')"`;
}

function sbwRenderSourceBadge(tournament) {
  const sourceLabel = sbwGetTournamentSourceLabel(tournament);

  return `
    <span class="sbw-tournament-source-badge ${tournament?.source === "supabase" ? "is-online" : ""}">
      ${sbwSafeEscape(sourceLabel)}
    </span>
  `;
}

function sbwRenderRegistrationBadge(tournament) {
  if (typeof sbwHasRegistration !== "function") {
    return "";
  }

  const publicId = typeof sbwGetTournamentPublicId === "function"
    ? sbwGetTournamentPublicId(tournament)
    : tournament?.id;

  if (!sbwHasRegistration(publicId) && !sbwHasRegistration(tournament?.id)) {
    return "";
  }

  return `<span class="status-pill registration">Inscrição registrada</span>`;
}

function sbwRenderTournamentCard(tournament, options = {}) {
  const status = sbwGetStatusInfo(tournament?.status);
  const format = sbwGetTournamentComparableFormat(tournament);
  const participantsLabel = sbwGetParticipantsLabel(tournament);
  const startLabel = sbwGetTournamentStartLabel(tournament);
  const platformLabel = sbwGetPlatformLabel(tournament);
  const matchFormat = sbwGetMatchFormat(tournament);
  const detailUrl = sbwGetTournamentPublicUrl(tournament);
  const organizerName = sbwGetOrganizerName(tournament);
  const isRunning = sbwIsTournamentRunning(tournament);
  const isOpen = sbwIsTournamentOpen(tournament);
  const watchUrl = sbwGetWatchUrl(tournament);
  const title = sbwGetTournamentNameSafe(tournament);
  const description = sbwGetDescription(tournament);
  const cardClass = options.featured ? "public-tournament-card public-tournament-card--featured" : "public-tournament-card";
  const coverStyle = sbwGetTournamentCoverStyle(tournament);
  const primaryHref = isRunning && watchUrl ? watchUrl : detailUrl;
  const primaryLabel = isRunning ? "Assistir agora" : "Ver torneio";
  const primaryTarget = isRunning && watchUrl ? " target=\"_blank\" rel=\"noopener noreferrer\"" : "";

  return `
    <article
      class="${cardClass} tournament-item"
      data-status="${sbwSafeEscape(status.className)}"
      data-format="${sbwSafeEscape(format || "")}" 
      data-category="${sbwSafeEscape(sbwGetTournamentCategory(tournament))}"
    >
      <div class="public-tournament-banner"${coverStyle}>
        <div class="public-tournament-banner__shade"></div>
        <div class="public-tournament-banner__badges">
          ${sbwRenderSourceBadge(tournament)}
          <span class="status-pill ${sbwSafeEscape(status.className)}">${sbwSafeEscape(status.label)}</span>
          ${sbwRenderRegistrationBadge(tournament)}
        </div>
      </div>

      <div class="public-tournament-card-content">
        <div class="public-tournament-card-kicker">
          <span>${sbwSafeEscape(tournament.game || tournament.gameName || "Jogo a definir")}</span>
          <span>${sbwSafeEscape(platformLabel)}</span>
        </div>

        <h3>${sbwSafeEscape(title)}</h3>

        <p>${sbwSafeEscape(description)}</p>

        <div class="public-tournament-meta">
          <div>
            <span>Organizador</span>
            <strong>${sbwSafeEscape(organizerName)}</strong>
          </div>

          <div>
            <span>Data</span>
            <strong>${sbwSafeEscape(startLabel)}</strong>
          </div>

          <div>
            <span>Formato</span>
            <strong>${sbwSafeEscape(sbwGetFormatLabel(format))}</strong>
          </div>

          <div>
            <span>Participantes</span>
            <strong>${sbwSafeEscape(participantsLabel)}</strong>
          </div>
        </div>

        <div class="public-tournament-tags">
          ${matchFormat ? `<span>${sbwSafeEscape(matchFormat)}</span>` : ""}
          <span>${sbwSafeEscape(sbwGetTournamentSourceLabel(tournament))}</span>
        </div>

        <div class="public-tournament-actions">
          <a class="profile-btn" href="${sbwSafeEscape(primaryHref)}"${primaryTarget}>
            ${sbwSafeEscape(primaryLabel)}
            <i class="fa-solid fa-arrow-right"></i>
          </a>

          ${isOpen ? `
            <a class="public-card-btn secondary" href="${sbwSafeEscape(detailUrl)}#inscricao">
              Inscrever-se
            </a>
          ` : `
            <a class="public-card-btn secondary" href="${sbwSafeEscape(detailUrl)}">
              Detalhes
            </a>
          `}
        </div>
      </div>
    </article>
  `;
}

function sbwSortTournamentsForSection(sectionKey, tournaments) {
  const copy = [...tournaments];

  if (sectionKey === "finished") {
    return copy.sort((a, b) => sbwGetTournamentTimestampForRecent(b) - sbwGetTournamentTimestampForRecent(a));
  }

  return copy.sort((a, b) => sbwGetTournamentTimestamp(a) - sbwGetTournamentTimestamp(b));
}

function sbwRenderTournamentSection(title, label, description, tournaments, emptyMessage, sectionKey) {
  const sortedTournaments = sbwSortTournamentsForSection(sectionKey, tournaments);

  if (sortedTournaments.length === 0 && sectionKey !== "upcoming") {
    return "";
  }

  return `
    <section class="public-tournament-group public-tournament-group--${sbwSafeEscape(sectionKey)}">
      <div class="public-tournament-group-header">
        <div>
          <span>${sbwSafeEscape(label)}</span>
          <h3>${sbwSafeEscape(title)}</h3>
          <p>${sbwSafeEscape(description)}</p>
        </div>

        <strong class="public-tournament-group-count">
          ${sortedTournaments.length} torneio${sortedTournaments.length === 1 ? "" : "s"}
        </strong>
      </div>

      ${
        sortedTournaments.length > 0
          ? `
            <div class="public-tournament-subgrid">
              ${sortedTournaments.map((tournament) => sbwRenderTournamentCard(tournament)).join("")}
            </div>
          `
          : `
            <div class="empty-tournament-state">
              ${sbwSafeEscape(emptyMessage)}
            </div>
          `
      }
    </section>
  `;
}

async function sbwLoadTournamentsForListPage() {
  if (typeof sbwGetAllTournamentsAsync === "function") {
    return await sbwGetAllTournamentsAsync();
  }

  return sbwGetAllTournaments();
}

function sbwTournamentMatchesFilters(tournament) {
  const gameFilter = sbwTournamentGameFilter ? sbwTournamentGameFilter.value : "all";
  const statusFilter = sbwTournamentStatusFilter ? sbwTournamentStatusFilter.value : "all";
  const formatFilter = sbwTournamentFormatFilter ? sbwTournamentFormatFilter.value : "all";
  const platformFilter = sbwTournamentPlatformFilter ? sbwTournamentPlatformFilter.value : "all";
  const organizerFilter = sbwTournamentOrganizerFilter ? sbwTournamentOrganizerFilter.value : "all";
  const searchValue = sbwNormalizeSearchText(sbwTournamentSearch ? sbwTournamentSearch.value : "");

  const gameValue = sbwNormalizeTextForCompare(tournament?.game || tournament?.gameName || "");
  const statusValue = sbwGetStatusClass(tournament);
  const formatValue = sbwGetTournamentComparableFormat(tournament);
  const platformValue = sbwNormalizeTextForCompare(sbwGetPlatformLabel(tournament));
  const organizerValues = sbwGetTournamentOrganizerComparableValues(tournament);

  if (gameFilter !== "all" && gameValue !== gameFilter) return false;
  if (statusFilter !== "all" && statusValue !== statusFilter) return false;
  if (formatFilter !== "all" && formatValue !== formatFilter) return false;
  if (platformFilter !== "all" && platformValue !== platformFilter) return false;
  if (organizerFilter !== "all" && !organizerValues.includes(organizerFilter)) return false;

  if (searchValue) {
    const haystack = sbwNormalizeSearchText([
      sbwGetTournamentNameSafe(tournament),
      tournament?.game,
      tournament?.gameName,
      sbwGetOrganizerName(tournament),
      sbwGetFormatLabel(formatValue),
      sbwGetPlatformLabel(tournament),
      sbwGetDescription(tournament)
    ].filter(Boolean).join(" "));

    if (!haystack.includes(searchValue)) {
      return false;
    }
  }

  return true;
}

function sbwSetSelectOptions(selectElement, items, placeholder) {
  if (!selectElement) return;

  const currentValue = selectElement.value || "all";
  const options = [`<option value="all">${sbwSafeEscape(placeholder)}</option>`]
    .concat(
      items.map((item) => `
        <option value="${sbwSafeEscape(item.value)}">${sbwSafeEscape(item.label)}</option>
      `)
    );

  selectElement.innerHTML = options.join("");

  const hasCurrentValue = Array.from(selectElement.options).some((option) => option.value === currentValue);
  selectElement.value = hasCurrentValue ? currentValue : "all";
}

function sbwPopulateTournamentFilters(tournaments = []) {
  const gameMap = new Map();
  const formatMap = new Map();
  const platformMap = new Map();
  const organizerMap = new Map();

  tournaments.forEach((tournament) => {
    const gameLabel = tournament?.game || tournament?.gameName || "Jogo a definir";
    const gameValue = sbwNormalizeTextForCompare(gameLabel);

    if (gameValue) gameMap.set(gameValue, gameLabel);

    const formatValue = sbwGetTournamentComparableFormat(tournament);
    const formatLabel = sbwGetFormatLabel(formatValue);

    if (formatValue) formatMap.set(formatValue, formatLabel);

    const platformLabel = sbwGetPlatformLabel(tournament);
    const platformValue = sbwNormalizeTextForCompare(platformLabel);

    if (platformValue) platformMap.set(platformValue, platformLabel);

    const organizerLabel = sbwGetOrganizerName(tournament);
    const organizerValue = sbwGetTournamentOrganizerFilterValue(tournament);

    if (organizerValue) organizerMap.set(organizerValue, organizerLabel);
  });

  const toSortedItems = (map) => Array.from(map.entries())
    .map(([value, label]) => ({ value, label }))
    .sort((a, b) => String(a.label).localeCompare(String(b.label), "pt-BR"));

  sbwSetSelectOptions(sbwTournamentGameFilter, toSortedItems(gameMap), "Todos os jogos");
  sbwSetSelectOptions(sbwTournamentFormatFilter, toSortedItems(formatMap), "Todos");
  sbwSetSelectOptions(sbwTournamentPlatformFilter, toSortedItems(platformMap), "Todas");
  sbwSetSelectOptions(sbwTournamentOrganizerFilter, toSortedItems(organizerMap), "Todos");
}

function sbwGetTournamentGroups(tournaments = []) {
  return tournaments.reduce((groups, tournament) => {
    const key = sbwGetTournamentSectionKey(tournament);
    groups[key].push(tournament);
    return groups;
  }, {
    live: [],
    upcoming: [],
    finished: [],
    withoutDate: []
  });
}

function sbwRenderFeaturedTournament(tournaments = []) {
  if (!sbwFeaturedTournamentMount) return;

  const sorted = [...tournaments].sort((a, b) => {
    const statusScore = (tournament) => {
      if (sbwIsTournamentRunning(tournament)) return 0;
      if (sbwIsTournamentOpen(tournament)) return 1;
      if (!sbwIsTournamentFinished(tournament)) return 2;
      return 3;
    };

    return statusScore(a) - statusScore(b) || sbwGetTournamentTimestamp(a) - sbwGetTournamentTimestamp(b);
  });

  const featured = sorted[0];

  if (!featured) {
    sbwFeaturedTournamentMount.innerHTML = `
      <div class="sbw-tournaments-feature__empty">
        <span>Nenhum torneio publicado</span>
        <strong>Crie ou publique eventos para destacar aqui.</strong>
      </div>
    `;
    return;
  }

  sbwFeaturedTournamentMount.innerHTML = `
    <div class="sbw-tournaments-feature__label">
      <i class="fa-solid fa-star"></i>
      Destaque
    </div>
    ${sbwRenderTournamentCard(featured, { featured: true })}
  `;
}

function sbwRenderCalendar(tournaments = []) {
  if (!sbwTournamentCalendarList) return;

  const upcoming = tournaments
    .filter((tournament) => !sbwIsTournamentFinished(tournament) && Number.isFinite(sbwGetTournamentTimestamp(tournament)))
    .sort((a, b) => sbwGetTournamentTimestamp(a) - sbwGetTournamentTimestamp(b))
    .slice(0, 5);

  if (upcoming.length === 0) {
    sbwTournamentCalendarList.innerHTML = `<p>Nenhuma data próxima publicada.</p>`;
    return;
  }

  sbwTournamentCalendarList.innerHTML = upcoming.map((tournament) => {
    const date = sbwGetTournamentStartDateObject(tournament);
    const day = date ? String(date.getDate()).padStart(2, "0") : "--";
    const month = date ? date.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "") : "---";
    const detailUrl = sbwGetTournamentPublicUrl(tournament);

    return `
      <a class="sbw-tournaments-calendar-item" href="${sbwSafeEscape(detailUrl)}">
        <span>
          <strong>${sbwSafeEscape(day)}</strong>
          <small>${sbwSafeEscape(month)}</small>
        </span>

        <div>
          <strong>${sbwSafeEscape(sbwGetTournamentNameSafe(tournament))}</strong>
          <small>${sbwSafeEscape(tournament.game || tournament.gameName || "Jogo a definir")}</small>
        </div>
      </a>
    `;
  }).join("");
}

function sbwUpdateStats(tournaments = []) {
  const groups = sbwGetTournamentGroups(tournaments);
  const participants = tournaments.reduce((total, tournament) => {
    const count = Number(tournament?.participantsCount || tournament?.currentParticipants || sbwGetParticipantsCount(tournament) || 0);
    return total + (Number.isFinite(count) ? count : 0);
  }, 0);

  if (sbwTournamentLiveCount) sbwTournamentLiveCount.textContent = String(groups.live.length);
  if (sbwTournamentUpcomingCount) sbwTournamentUpcomingCount.textContent = String(groups.upcoming.length);
  if (sbwTournamentFinishedCount) sbwTournamentFinishedCount.textContent = String(groups.finished.length);
  if (sbwTournamentPlayersCount) sbwTournamentPlayersCount.textContent = String(participants);
}

function sbwGetRankingRowUrl(row, type) {
  if (type === "teams") {
    const teamId = row?.teamSlug || row?.teamId || row?.key || "";
    return teamId
      ? (window.SBWRoutes?.team ? window.SBWRoutes.team(teamId) : `/equipes/equipe.html?id=${encodeURIComponent(teamId)}`)
      : (window.SBWRoutes?.rankings ? window.SBWRoutes.rankings() : "/rankings/rankings.html");
  }

  const profileId = row?.profileSlug || row?.playerSlug || row?.profileId || row?.key || "";
  return profileId
    ? (window.SBWRoutes?.profile ? window.SBWRoutes.profile(profileId) : `/perfis/perfil.html?id=${encodeURIComponent(profileId)}`)
    : (window.SBWRoutes?.rankings ? window.SBWRoutes.rankings() : "/rankings/rankings.html");
}

function sbwRenderRankingRows(rows = [], type = "players") {
  const labels = type === "teams"
    ? { empty: "Equipes entram aqui quando pontuarem nos torneios oficiais.", fallback: "Equipe" }
    : { empty: "Jogadores entram aqui quando pontuarem nos torneios oficiais.", fallback: "Jogador" };

  if (!rows.length) {
    return `<div class="sbw-tournaments-ranking-empty">${sbwSafeEscape(labels.empty)}</div>`;
  }

  return rows.slice(0, 3).map((row, index) => {
    const rank = Number(row?.rank || index + 1);
    const points = Number(row?.points || 0);
    const name = row?.name || row?.teamName || row?.playerName || `${labels.fallback} ${rank}`;
    const url = sbwGetRankingRowUrl(row, type);

    return `
      <a class="sbw-tournaments-ranking-row" href="${sbwSafeEscape(url)}">
        <span class="sbw-tournaments-ranking-position">#${sbwSafeEscape(rank)}</span>
        <strong>${sbwSafeEscape(name)}</strong>
        <em>${sbwSafeEscape(points)} pts</em>
      </a>
    `;
  }).join("");
}

async function sbwRenderGlobalRankingPreview() {
  if (!sbwTournamentRankingPreview) return;

  const storage = window.SBWRankingsStorage;

  if (!storage || typeof storage.getRankingSnapshotAsync !== "function") {
    sbwTournamentRankingPreview.innerHTML = `
      <div class="sbw-tournaments-ranking-empty">
        Ranking global em preparação.
      </div>
    `;
    return;
  }

  try {
    const snapshot = await storage.getRankingSnapshotAsync({
      organizer: "all",
      game: "all",
      season: "all",
      globalStatus: "organizer"
    });

    const players = Array.isArray(snapshot?.players) ? snapshot.players.slice(0, 3) : [];
    const teams = Array.isArray(snapshot?.teams) ? snapshot.teams.slice(0, 3) : [];

    sbwTournamentRankingPreview.innerHTML = `
      <div class="sbw-tournaments-ranking-block">
        <div class="sbw-tournaments-ranking-title">
          <span>Jogadores</span>
          <small>Top 3</small>
        </div>
        ${sbwRenderRankingRows(players, "players")}
      </div>

      <div class="sbw-tournaments-ranking-block">
        <div class="sbw-tournaments-ranking-title">
          <span>Times</span>
          <small>Top 3</small>
        </div>
        ${sbwRenderRankingRows(teams, "teams")}
      </div>

      <a class="sbw-tournaments-ranking-link" href="${sbwSafeEscape(window.SBWRoutes?.rankings ? window.SBWRoutes.rankings() : "/rankings/rankings.html")}">
        Ver ranking completo
        <i class="fa-solid fa-arrow-right"></i>
      </a>
    `;
  } catch (error) {
    console.warn("[SBW Torneios] Não foi possível carregar prévia do ranking:", error);
    sbwTournamentRankingPreview.innerHTML = `
      <div class="sbw-tournaments-ranking-empty">
        Ranking global em atualização.
      </div>
    `;
  }
}

function sbwRenderTournamentSections(tournaments = []) {
  const groups = sbwGetTournamentGroups(tournaments);
  const sections = [
    sbwRenderTournamentSection(
      "Ao vivo agora",
      "Em andamento",
      "Torneios que já começaram ou estão com estrutura/partidas em andamento.",
      groups.live,
      "Nenhum torneio está em andamento no momento.",
      "live"
    ),
    sbwRenderTournamentSection(
      "Próximos torneios",
      "Inscrições e calendário",
      "Eventos abertos, publicados ou agendados, ordenados pela data mais próxima.",
      groups.upcoming,
      "Nenhum próximo torneio encontrado para os filtros atuais.",
      "upcoming"
    ),
    sbwRenderTournamentSection(
      "Finalizados recentemente",
      "Histórico recente",
      "Competições concluídas, exibidas das mais recentes para as mais antigas.",
      groups.finished,
      "Nenhum torneio finalizado encontrado.",
      "finished"
    ),
    sbwRenderTournamentSection(
      "Sem data definida",
      "Aguardando agenda",
      "Eventos publicados ou preparados pelo organizador sem data pública definida.",
      groups.withoutDate,
      "Nenhum torneio sem data encontrado.",
      "withoutDate"
    )
  ].filter(Boolean);

  return sections.join("");
}

async function sbwRenderTournamentsListPage() {
  const currentRequest = ++sbwTournamentListRenderRequest;

  if (!sbwPublicTournamentGrid) {
    console.error("publicTournamentGrid não encontrado.");
    return;
  }

  sbwTournamentPageLoading(
    sbwPublicTournamentGrid,
    "Carregando torneios",
    "Buscando competições publicadas pelos organizadores.",
    5
  );

  let tournaments = [];

  try {
    tournaments = await sbwLoadTournamentsForListPage();
  } catch (error) {
    console.error("Erro ao carregar torneios:", error);
    tournaments = typeof sbwGetAllTournaments === "function" ? sbwGetAllTournaments() : [];

    if (!Array.isArray(tournaments) || tournaments.length === 0) {
      sbwTournamentPageError(
        sbwPublicTournamentGrid,
        "Não foi possível carregar os torneios",
        "Atualize a página ou tente novamente em alguns instantes.",
        error?.message || ""
      );
      return;
    }
  }

  if (currentRequest !== sbwTournamentListRenderRequest) {
    return;
  }

  sbwTournamentListCache = Array.isArray(tournaments) ? tournaments : [];
  sbwPopulateTournamentFilters(sbwTournamentListCache);
  await sbwRenderTournamentOrganizers(sbwTournamentListCache);
  sbwRenderFeaturedTournament(sbwTournamentListCache);
  sbwRenderCalendar(sbwTournamentListCache);
  sbwUpdateStats(sbwTournamentListCache);
  await sbwRenderGlobalRankingPreview();

  const filteredTournaments = sbwTournamentListCache.filter(sbwTournamentMatchesFilters);

  if (filteredTournaments.length === 0) {
    sbwTournamentPageEmpty(
      sbwPublicTournamentGrid,
      "Nenhum torneio encontrado",
      "Ajuste os filtros ou limpe a busca para ver outros torneios."
    );
  } else {
    sbwPublicTournamentGrid.innerHTML = sbwRenderTournamentSections(filteredTournaments);
  }

  if (sbwTournamentCount) {
    sbwTournamentCount.textContent = String(filteredTournaments.length);
  }
}

function sbwRerenderTournamentFiltersOnly() {
  if (!sbwPublicTournamentGrid) return;

  const filteredTournaments = sbwTournamentListCache.filter(sbwTournamentMatchesFilters);

  if (filteredTournaments.length === 0) {
    sbwTournamentPageEmpty(
      sbwPublicTournamentGrid,
      "Nenhum torneio encontrado",
      "Ajuste os filtros ou limpe a busca para ver outros torneios."
    );
  } else {
    sbwPublicTournamentGrid.innerHTML = sbwRenderTournamentSections(filteredTournaments);
  }

  if (sbwTournamentCount) {
    sbwTournamentCount.textContent = String(filteredTournaments.length);
  }
}

function sbwRegisterTournamentFilterEvents() {
  [
    sbwTournamentGameFilter,
    sbwTournamentStatusFilter,
    sbwTournamentFormatFilter,
    sbwTournamentPlatformFilter,
    sbwTournamentOrganizerFilter
  ].forEach((element) => {
    if (element) {
      element.addEventListener("change", sbwRerenderTournamentFiltersOnly);
    }
  });

  if (sbwTournamentSearch) {
    sbwTournamentSearch.addEventListener("input", sbwRerenderTournamentFiltersOnly);
  }

  if (sbwTournamentClearFilters) {
    sbwTournamentClearFilters.addEventListener("click", () => {
      [
        sbwTournamentGameFilter,
        sbwTournamentStatusFilter,
        sbwTournamentFormatFilter,
        sbwTournamentPlatformFilter,
        sbwTournamentOrganizerFilter
      ].forEach((element) => {
        if (element) element.value = "all";
      });

      if (sbwTournamentSearch) {
        sbwTournamentSearch.value = "";
      }

      sbwRerenderTournamentFiltersOnly();
    });
  }
}

sbwRegisterTournamentFilterEvents();
sbwRenderTournamentsListPage();
