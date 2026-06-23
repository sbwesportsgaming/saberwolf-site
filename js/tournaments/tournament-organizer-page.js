const sbwOrganizerPageRoot = document.getElementById("organizerPageRoot");
const sbwOrganizerHero = document.getElementById("organizerHero");
const sbwOrganizerStats = document.getElementById("organizerStats");
const sbwOrganizerOverviewTournaments = document.getElementById("organizerOverviewTournaments");
const sbwOrganizerOverviewHighlights = document.getElementById("organizerOverviewHighlights");
const sbwOrganizerTournamentsGrid = document.getElementById("organizerTournamentsGrid");
const sbwOrganizerTournamentsSummary = document.getElementById("organizerTournamentsSummary");
const sbwOrganizerStatusText = document.getElementById("organizerStatusText");
const sbwOrganizerTournamentSearch = document.getElementById("organizerTournamentSearch");
const sbwOrganizerTournamentStatusFilter = document.getElementById("organizerTournamentStatusFilter");
const sbwOrganizerHistoryList = document.getElementById("organizerHistoryList");
const sbwOrganizerSeasonsGrid = document.getElementById("organizerSeasonsGrid");
const sbwOrganizerRankingsGrid = document.getElementById("organizerRankingsGrid");
const sbwOrganizerNavActions = document.getElementById("organizerNavActions");

const sbwOrganizerPageState = {
  organizer: null,
  tournaments: [],
  members: [],
  access: null,
  rankingSnapshot: null,
  rankingSeasonFilter: "all",
  rankingTypeFilter: "all",
  rankingSearch: "",
  rankingSort: "points"
};

function sbwOrganizerEscape(value) {
  if (typeof sbwEscapeHTML === "function") {
    return sbwEscapeHTML(value);
  }

  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function sbwOrganizerNormalizeKey(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}


function sbwOrganizerAsObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function sbwOrganizerClampNumber(value, min, max, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, number));
}

function sbwGetOrganizerAssetFrame(organizer, assetType) {
  const metadata = sbwOrganizerAsObject(organizer?.metadata);
  const assets = sbwOrganizerAsObject(
    organizer?.organizerAssets ||
    metadata.organizerAssets ||
    metadata.organizer_assets ||
    metadata.assetFrames
  );
  const raw = sbwOrganizerAsObject(assets[assetType] || assets[assetType === "logo" ? "avatar" : assetType]);
  const nestedFrame = sbwOrganizerAsObject(raw.frame || raw.framing || raw.crop || raw.position);
  const source = Object.keys(nestedFrame).length ? { ...raw, ...nestedFrame } : raw;
  const defaultZoom = assetType === "banner" ? 112 : 100;
  const defaultPositionY = assetType === "banner" ? 46 : 50;

  return {
    positionX: sbwOrganizerClampNumber(source.positionX ?? source.x ?? source.objectPositionX, 0, 100, 50),
    positionY: sbwOrganizerClampNumber(source.positionY ?? source.y ?? source.objectPositionY, 0, 100, defaultPositionY),
    zoom: sbwOrganizerClampNumber(source.zoom ?? source.scale ?? source.size, 100, assetType === "banner" ? 180 : 160, defaultZoom)
  };
}

function sbwGetOrganizerAssetStyle(organizer, assetType) {
  const frame = sbwGetOrganizerAssetFrame(organizer, assetType);

  if (assetType === "banner") {
    return [
      `--org-banner-x:${frame.positionX}%`,
      `--org-banner-y:${frame.positionY}%`,
      `--org-banner-scale:${Math.max(1, frame.zoom / 100).toFixed(2)}`
    ].join("; ");
  }

  return [
    `--org-logo-x:${frame.positionX}%`,
    `--org-logo-y:${frame.positionY}%`,
    `--org-logo-scale:${Math.max(1, frame.zoom / 100).toFixed(2)}`
  ].join("; ");
}

function sbwOrganizerStyleAttribute(value) {
  const style = String(value || "").trim();
  return style ? `style="${sbwOrganizerEscape(style)}"` : "";
}

function sbwGetOrganizerFullRankingUrl(organizer) {
  const value = String(
    organizer?.slug ||
    organizer?.id ||
    organizer?.name ||
    organizer?.displayName ||
    organizer?.display_name ||
    ""
  ).trim();

  const query = value ? `?organizer=${encodeURIComponent(value)}#ranking-organizador` : "#ranking-organizador";
  return `../rankings/rankings.html${query}`;
}

function sbwGetOrganizerSelfUrl(organizer, params = {}) {
  const slug = String(
    organizer?.slug ||
    organizer?.id ||
    organizer?.name ||
    organizer?.displayName ||
    organizer?.display_name ||
    ""
  ).trim();
  const query = new URLSearchParams();

  if (slug) query.set("slug", slug);

  Object.entries(params || {}).forEach(([key, value]) => {
    const safeValue = String(value || "").trim();
    if (safeValue) query.set(key, safeValue);
  });

  const queryString = query.toString();
  return `organizador.html${queryString ? `?${queryString}` : ""}`;
}


function sbwGetOrganizerInitials(organizer) {
  return String(organizer?.tag || organizer?.name || organizer?.displayName || "ORG")
    .trim()
    .slice(0, 4)
    .toUpperCase() || "ORG";
}

function sbwGetOrganizerDisplayName(organizer) {
  return organizer?.name || organizer?.displayName || organizer?.display_name || "Organizador";
}

function sbwGetOrganizerHeroPhrase(organizer) {
  const metadata = organizer?.metadata || {};
  const settings = organizer?.settings || {};

  return String(
    organizer?.tagline ||
    organizer?.slogan ||
    organizer?.headline ||
    organizer?.heroPhrase ||
    organizer?.hero_phrase ||
    organizer?.shortDescription ||
    organizer?.short_description ||
    metadata?.tagline ||
    metadata?.slogan ||
    metadata?.headline ||
    metadata?.heroPhrase ||
    metadata?.hero_phrase ||
    settings?.tagline ||
    settings?.slogan ||
    settings?.headline ||
    organizer?.description ||
    ""
  ).trim();
}

function sbwGetOrganizerTournamentCaption(tournament) {
  const metadata = tournament?.metadata || {};
  const settings = tournament?.settings || {};

  return String(
    tournament?.tagline ||
    tournament?.slogan ||
    tournament?.subtitle ||
    tournament?.shortDescription ||
    tournament?.short_description ||
    tournament?.summary ||
    metadata?.tagline ||
    metadata?.slogan ||
    metadata?.subtitle ||
    metadata?.shortDescription ||
    metadata?.short_description ||
    settings?.tagline ||
    settings?.subtitle ||
    tournament?.description ||
    ""
  ).trim();
}

function sbwGetOrganizerPublicStatusLabel(organizer) {
  if (typeof sbwGetOrganizerStatusLabel === "function") {
    return sbwGetOrganizerStatusLabel(organizer?.status);
  }

  const status = String(organizer?.status || "active").toLowerCase();
  const labels = {
    active: "Ativo",
    approved: "Aprovado",
    verified: "Verificado",
    pending: "Em análise",
    inactive: "Inativo",
    draft: "Rascunho"
  };

  return labels[status] || "Ativo";
}

function sbwGetOrganizerTournamentDateLabel(tournament) {
  if (tournament?.date && tournament?.time) {
    return `${tournament.date} às ${tournament.time}`;
  }

  if (tournament?.date) {
    return tournament.date;
  }

  return sbwFormatDate(sbwGetStartDate(tournament));
}

function sbwGetOrganizerTournamentCover(tournament) {
  return (
    tournament?.bannerUrl ||
    tournament?.banner_url ||
    tournament?.imageUrl ||
    tournament?.image_url ||
    tournament?.coverUrl ||
    tournament?.cover_url ||
    tournament?.settings?.bannerUrl ||
    tournament?.settings?.coverUrl ||
    ""
  );
}

function sbwGetOrganizerSocialLinks(organizer) {
  const links = {
    website: organizer?.websiteUrl || organizer?.website_url || organizer?.site || "",
    discord: organizer?.discordUrl || organizer?.discord_url || "",
    instagram: organizer?.instagramUrl || organizer?.instagram_url || "",
    youtube: organizer?.youtubeUrl || organizer?.youtube_url || "",
    twitch: organizer?.twitchUrl || organizer?.twitch_url || "",
    x: organizer?.xUrl || organizer?.twitterUrl || organizer?.x_url || organizer?.twitter_url || ""
  };

  const source = organizer?.links || organizer?.socialLinks || organizer?.social_links || organizer?.metadata?.links || organizer?.metadata?.socialLinks || {};

  if (source && typeof source === "object") {
    Object.entries(source).forEach(([key, value]) => {
      const normalizedKey = String(key || "").toLowerCase();
      if (normalizedKey.includes("site") || normalizedKey.includes("web")) links.website = value;
      if (normalizedKey.includes("discord")) links.discord = value;
      if (normalizedKey.includes("instagram") || normalizedKey === "ig") links.instagram = value;
      if (normalizedKey.includes("youtube")) links.youtube = value;
      if (normalizedKey.includes("twitch")) links.twitch = value;
      if (normalizedKey === "x" || normalizedKey.includes("twitter")) links.x = value;
    });
  }

  return Object.fromEntries(
    Object.entries(links).filter(([, url]) => Boolean(String(url || "").trim()))
  );
}

function sbwNormalizeOrganizerUrl(url) {
  const cleanUrl = String(url || "").trim();
  if (!cleanUrl) return "";
  if (/^(https?:)?\/\//i.test(cleanUrl) || /^mailto:/i.test(cleanUrl)) return cleanUrl;
  return `https://${cleanUrl}`;
}

async function sbwGetOrganizerPublicAccess(organizer) {
  if (!organizer || typeof sbwGetMyTournamentOrganizerAccessAsync !== "function") {
    return null;
  }

  try {
    const accessList = await sbwGetMyTournamentOrganizerAccessAsync();
    const organizerKeys = [organizer.id, organizer.slug, organizer.name, organizer.displayName]
      .filter(Boolean)
      .map(sbwOrganizerNormalizeKey);

    const match = (Array.isArray(accessList) ? accessList : []).find((item) => {
      const itemKeys = [item.id, item.slug, item.name, item.displayName, item.display_name]
        .filter(Boolean)
        .map(sbwOrganizerNormalizeKey);

      return itemKeys.some((key) => organizerKeys.includes(key));
    });

    return match || null;
  } catch (error) {
    console.warn("[SBW Organizadores] Não foi possível validar acesso público do organizador:", error);
    return null;
  }
}

function sbwOrganizerCanManage(access) {
  if (!access) return false;

  const role = String(access.memberRole || access.member_role || access.role || access.currentUserRole || "").toLowerCase();

  return Boolean(
    access.canCreateTournament === true ||
    access.canCreateTournaments === true ||
    access.can_create_tournaments === true ||
    ["owner", "admin", "manager", "organizer_admin", "tournament_admin", "admin_sbw"].includes(role)
  );
}

function sbwOrganizerCanCreateTournament(access) {
  return sbwOrganizerCanManage(access);
}

function sbwGetOrganizerCreateTournamentUrl(organizer) {
  const organizerKey = organizer?.slug || organizer?.id || "";

  if (!organizerKey) {
    return "create-tournament/criar-torneio.html";
  }

  return `create-tournament/criar-torneio.html?organizer=${encodeURIComponent(organizerKey)}`;
}

function sbwSetOrganizerTheme(organizer) {
  const themeStyle = typeof sbwGetTournamentOrganizerThemeStyle === "function"
    ? sbwGetTournamentOrganizerThemeStyle(organizer)
    : "";

  if (sbwOrganizerPageRoot) {
    sbwOrganizerPageRoot.setAttribute("style", themeStyle);
  }

  if (sbwOrganizerHero) {
    sbwOrganizerHero.setAttribute("style", themeStyle);
  }
}

function sbwRenderOrganizerLoading() {
  if (sbwOrganizerHero) {
    sbwOrganizerHero.innerHTML = `<div class="sbw-organizer-loading-card">Carregando organizador...</div>`;
  }
}

function sbwRenderOrganizerNotFound() {
  if (sbwOrganizerPageRoot) {
    sbwOrganizerPageRoot.innerHTML = `
      <section class="sbw-organizer-section-card">
        <span class="sbw-organizer-eyebrow">Organizador</span>
        <h2>Organizador não encontrado</h2>
        <p class="sbw-organizer-card-note">
          Não encontramos um organizador com esse slug/id. Volte para a central de Organizadores e escolha um perfil publicado.
        </p>
        <a class="sbw-organizer-action-btn" href="../organizadores/organizadores.html">Voltar para Organizadores</a>
      </section>
    `;
  }
}

function sbwRenderOrganizerNavActions(organizer, access) {
  if (!sbwOrganizerNavActions) return;

  const organizerSlug = organizer?.slug || organizer?.id || sbwGetOrganizerDisplayName(organizer);
  const canManage = sbwOrganizerCanManage(access);
  const canCreateTournament = sbwOrganizerCanCreateTournament(access);
  const createTournamentUrl = sbwGetOrganizerCreateTournamentUrl(organizer);

  const createTournamentHTML = canCreateTournament
    ? `<a class="sbw-organizer-action-btn sbw-organizer-action-btn--create" href="${sbwOrganizerEscape(createTournamentUrl)}">Criar Torneio</a>`
    : "";
  const manageHTML = canManage
    ? `<a class="sbw-organizer-action-btn" href="editar-organizador.html?slug=${encodeURIComponent(organizerSlug)}">Gerenciar organização</a>`
    : "";

  sbwOrganizerNavActions.innerHTML = `
    ${createTournamentHTML}
    ${manageHTML}
  `;
}

function sbwRenderOrganizerSocialLinks(organizer) {
  const links = sbwGetOrganizerSocialLinks(organizer);
  const iconLabels = {
    website: "WEB",
    discord: "DC",
    instagram: "IG",
    youtube: "YT",
    twitch: "TW",
    x: "X"
  };
  const ariaLabels = {
    website: "Site oficial",
    discord: "Discord",
    instagram: "Instagram",
    youtube: "YouTube",
    twitch: "Twitch",
    x: "X/Twitter"
  };

  const html = Object.entries(links)
    .map(([key, url]) => {
      const safeUrl = sbwNormalizeOrganizerUrl(url);
      if (!safeUrl) return "";
      return `
        <a class="sbw-organizer-social-icon" href="${sbwOrganizerEscape(safeUrl)}" target="_blank" rel="noopener noreferrer" aria-label="${sbwOrganizerEscape(ariaLabels[key] || key)}">
          ${sbwOrganizerEscape(iconLabels[key] || key.slice(0, 2).toUpperCase())}
        </a>
      `;
    })
    .join("");

  return html ? `<div class="sbw-organizer-hero-links" aria-label="Redes sociais do organizador">${html}</div>` : "";
}

function sbwRenderOrganizerHero(organizer, tournaments, access) {
  if (!sbwOrganizerHero) return;

  const name = sbwGetOrganizerDisplayName(organizer);
  const initials = sbwGetOrganizerInitials(organizer);
  const status = sbwGetOrganizerPublicStatusLabel(organizer);
  const games = Array.isArray(organizer?.games) ? organizer.games : [];
  const description = sbwGetOrganizerHeroPhrase(organizer);
  const logoHTML = organizer?.logoUrl
    ? `<img src="${sbwOrganizerEscape(organizer.logoUrl)}" alt="Logo ${sbwOrganizerEscape(name)}">`
    : `<span>${sbwOrganizerEscape(initials)}</span>`;
  const bannerHTML = organizer?.bannerUrl
    ? `<img src="${sbwOrganizerEscape(organizer.bannerUrl)}" alt="" aria-hidden="true">`
    : "";
  const bannerFrameStyle = sbwGetOrganizerAssetStyle(organizer, "banner");
  const logoFrameStyle = sbwGetOrganizerAssetStyle(organizer, "logo");

  sbwSetOrganizerTheme(organizer);

  sbwOrganizerHero.innerHTML = `
    <div class="sbw-organizer-hero-cover" ${sbwOrganizerStyleAttribute(bannerFrameStyle)}>${bannerHTML}</div>
    <div class="sbw-organizer-hero-grid sbw-organizer-hero-grid--compact">
      <div class="sbw-organizer-identity">
        <div class="sbw-organizer-brand-row">
          <div class="sbw-organizer-logo" ${sbwOrganizerStyleAttribute(logoFrameStyle)}>${logoHTML}</div>
          <div class="sbw-organizer-title-stack">
            <div class="sbw-organizer-badges">
              <span class="sbw-organizer-badge sbw-organizer-badge--primary">Organizador</span>
              <span class="sbw-organizer-badge">${sbwOrganizerEscape(status)}</span>
              ${organizer?.verified ? `<span class="sbw-organizer-badge">Selo -SBW-</span>` : ""}
            </div>
            <h1>${sbwOrganizerEscape(name)}</h1>
            ${description ? `<p class="sbw-organizer-hero-phrase">${sbwOrganizerEscape(description)}</p>` : ""}
          </div>
        </div>

        <div class="sbw-organizer-hero-bottomline">
          <div class="sbw-organizer-tags">
            ${organizer?.country ? `<span class="sbw-organizer-tag">${sbwOrganizerEscape(organizer.country)}</span>` : ""}
            ${organizer?.region ? `<span class="sbw-organizer-tag">${sbwOrganizerEscape(organizer.region)}</span>` : ""}
            ${games.slice(0, 4).map((game) => `<span class="sbw-organizer-tag">${sbwOrganizerEscape(game)}</span>`).join("")}
          </div>
          ${sbwRenderOrganizerSocialLinks(organizer)}
        </div>
      </div>
    </div>
  `;
}

function sbwGetTournamentParticipantCount(tournament) {
  const value = tournament?.currentParticipants ?? tournament?.current_participants ?? tournament?.participantsCount ?? tournament?.participants_count ?? 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function sbwGetTournamentTeamCount(tournament) {
  const value = tournament?.teamsCount ?? tournament?.teams_count ?? tournament?.teamParticipants ?? tournament?.team_participants ?? 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function sbwGetOrganizerCurrentSeasonLabel(organizer) {
  return organizer?.currentSeasonName ||
    organizer?.current_season_name ||
    organizer?.metadata?.currentSeasonName ||
    organizer?.metadata?.current_season_name ||
    organizer?.metadata?.currentSeason?.name ||
    "A definir";
}

function sbwRenderOrganizerStats(tournaments, members, organizer) {
  if (!sbwOrganizerStats) return;

  const runningCount = tournaments.filter((tournament) => sbwGetStatusInfo(tournament?.status).className === "running").length;
  const openCount = tournaments.filter((tournament) => sbwGetStatusInfo(tournament?.status).className === "open").length;
  const finishedCount = tournaments.filter((tournament) => sbwGetStatusInfo(tournament?.status).className === "finished").length;
  const participantCount = tournaments.reduce((total, tournament) => total + sbwGetTournamentParticipantCount(tournament), 0);
  const teamCount = tournaments.reduce((total, tournament) => total + sbwGetTournamentTeamCount(tournament), 0);

  sbwOrganizerStats.innerHTML = `
    <article><span>Participantes</span><strong>${participantCount}</strong></article>
    <article><span>Equipes participantes</span><strong>${teamCount}</strong></article>
    <article><span>Torneios ativos</span><strong>${openCount + runningCount}</strong></article>
    <article><span>Torneios finalizados</span><strong>${finishedCount}</strong></article>
    <article><span>Total de torneios</span><strong>${Array.isArray(tournaments) ? tournaments.length : 0}</strong></article>
  `;
}


function sbwOrganizerAsArray(value) {
  return Array.isArray(value) ? value : [];
}

function sbwOrganizerUniqueValues(values) {
  const seen = new Set();
  const result = [];

  values.forEach((value) => {
    const safeValue = String(value || "").trim();
    const key = sbwOrganizerNormalizeKey(safeValue);

    if (!safeValue || !key || seen.has(key)) return;

    seen.add(key);
    result.push(safeValue);
  });

  return result;
}

function sbwGetOrganizerRankingFilterCandidates(organizer) {
  return sbwOrganizerUniqueValues([
    organizer?.slug,
    organizer?.id,
    organizer?.name,
    organizer?.displayName,
    organizer?.display_name,
    organizer?.tag,
    ...(Array.isArray(organizer?.aliases) ? organizer.aliases : [])
  ]);
}

function sbwOrganizerGetRecordPlayerName(record) {
  return String(
    record?.nickname ||
    record?.name ||
    record?.playerName ||
    record?.displayName ||
    record?.profileSlug ||
    record?.playerSlug ||
    "Jogador"
  ).trim();
}

function sbwOrganizerGetRecordTeamName(record) {
  return String(
    record?.teamName ||
    record?.team_name ||
    record?.team?.name ||
    record?.teamTag ||
    record?.team_tag ||
    ""
  ).trim();
}

function sbwOrganizerMergeRankingRowsWithRecords(baseRows, records, type) {
  const isTeams = type === "teams";
  const map = new Map();

  sbwOrganizerAsArray(baseRows).forEach((row) => {
    const key = String(
      row?.key ||
      row?.teamKey ||
      row?.teamId ||
      row?.teamSlug ||
      row?.playerKey ||
      row?.profileId ||
      row?.authUserId ||
      row?.profileSlug ||
      row?.name ||
      ""
    ).trim();

    if (!key) return;

    map.set(key, {
      ...row,
      key,
      points: Number(row?.points || row?.totalPoints || row?.total_points || row?.score || 0),
      events: Number(row?.events || row?.tournaments || row?.tournamentCount || 0),
      source: row?.source || "ranking"
    });
  });

  sbwOrganizerAsArray(records).forEach((record) => {
    const key = String(isTeams
      ? (record?.teamKey || record?.teamId || record?.teamName || "")
      : (record?.playerKey || record?.profileId || record?.authUserId || record?.playerSlug || record?.nickname || record?.name || "")
    ).trim();

    if (!key) return;

    if (isTeams && !sbwOrganizerGetRecordTeamName(record)) return;

    const current = map.get(key) || {
      type: isTeams ? "team" : "player",
      key,
      name: isTeams ? sbwOrganizerGetRecordTeamName(record) : sbwOrganizerGetRecordPlayerName(record),
      teamName: !isTeams ? sbwOrganizerGetRecordTeamName(record) : "",
      points: 0,
      events: 0,
      records: [],
      source: "participation"
    };

    const recordPoints = Number(isTeams ? record?.teamPoints : record?.playerPoints);
    const currentPoints = Number(current.points || 0);

    current.points = Math.max(currentPoints, Number.isFinite(recordPoints) ? recordPoints : 0, currentPoints);
    current.events = Math.max(Number(current.events || 0), 1);
    current.name = current.name || (isTeams ? sbwOrganizerGetRecordTeamName(record) : sbwOrganizerGetRecordPlayerName(record));
    current.teamName = current.teamName || (!isTeams ? sbwOrganizerGetRecordTeamName(record) : "");
    current.records = Array.isArray(current.records) ? current.records : [];
    current.records.push(record);
    map.set(key, current);
  });

  return Array.from(map.values())
    .sort((first, second) => {
      const pointsDiff = Number(second.points || 0) - Number(first.points || 0);
      if (pointsDiff !== 0) return pointsDiff;

      const firstEvents = Number(first.events || first.tournaments || first.tournamentCount || 0);
      const secondEvents = Number(second.events || second.tournaments || second.tournamentCount || 0);
      if (secondEvents !== firstEvents) return secondEvents - firstEvents;

      return sbwGetOrganizerRankingRowName(first, isTeams).localeCompare(sbwGetOrganizerRankingRowName(second, isTeams), "pt-BR");
    })
    .map((row, index) => ({
      ...row,
      position: index + 1,
      rank: index + 1,
      participationOnly: Number(row.points || 0) <= 0
    }));
}

function sbwGetOrganizerRankingRows(organizer, type, snapshot) {
  let rows = [];

  if (snapshot && type === "teams" && Array.isArray(snapshot.teams)) {
    rows = snapshot.teams;
  } else if (snapshot && type !== "teams" && Array.isArray(snapshot.players)) {
    rows = snapshot.players;
  } else {
    const possibleSources = [
      organizer?.rankings,
      organizer?.ranking,
      organizer?.settings?.rankings,
      organizer?.settings?.ranking,
      organizer?.metadata?.rankings,
      organizer?.metadata?.ranking
    ].filter(Boolean);

    const keys = type === "teams"
      ? ["teams", "equipes", "teamRanking", "rankingEquipes"]
      : ["players", "jogadores", "playerRanking", "rankingJogadores"];

    for (const source of possibleSources) {
      for (const key of keys) {
        if (Array.isArray(source?.[key])) {
          rows = source[key];
          break;
        }
      }
      if (rows.length) break;
    }
  }

  if (snapshot && Array.isArray(snapshot.records)) {
    return sbwOrganizerMergeRankingRowsWithRecords(rows, snapshot.records, type);
  }

  return rows;
}

function sbwGetOrganizerRankingPositionDelta(row, currentPosition) {
  const explicitDelta = row?.positionDelta ?? row?.position_delta ?? row?.rankDelta ?? row?.rank_delta ?? row?.movement ?? row?.movementValue;
  const parsedExplicit = Number(explicitDelta);
  if (Number.isFinite(parsedExplicit) && parsedExplicit !== 0) {
    return parsedExplicit;
  }

  const previousPosition = Number(row?.previousPosition ?? row?.previous_position ?? row?.lastPosition ?? row?.last_position ?? row?.oldPosition ?? row?.old_position);
  if (Number.isFinite(previousPosition) && previousPosition > 0) {
    return previousPosition - currentPosition;
  }

  const direction = String(row?.movementDirection ?? row?.movement_direction ?? row?.trend ?? "").toLowerCase();
  if (["up", "subiu", "alta", "rise", "gain"].includes(direction)) return 1;
  if (["down", "desceu", "baixa", "fall", "loss"].includes(direction)) return -1;

  return 0;
}

function sbwRenderOrganizerRankingPosition(row, currentPosition) {
  const delta = sbwGetOrganizerRankingPositionDelta(row, currentPosition);
  const trendClass = delta > 0 ? "is-up" : delta < 0 ? "is-down" : "is-neutral";
  const trendIcon = delta > 0 ? "▲" : delta < 0 ? "▼" : "—";
  const label = delta > 0
    ? `Subiu ${Math.abs(delta)} posição${Math.abs(delta) === 1 ? "" : "ões"}`
    : delta < 0
      ? `Caiu ${Math.abs(delta)} posição${Math.abs(delta) === 1 ? "" : "ões"}`
      : "Sem variação";

  return `
    <span class="sbw-organizer-rank-position ${trendClass}" title="${sbwOrganizerEscape(label)}">
      <strong>${currentPosition}</strong>
      <span aria-hidden="true">${trendIcon}</span>
    </span>
  `;
}

function sbwGetOrganizerRankingPoints(row) {
  const raw = row?.pointsDelta ?? row?.points_delta ?? row?.gainedPoints ?? row?.gained_points ?? row?.earnedPoints ?? row?.earned_points ?? row?.points ?? row?.score ?? row?.totalPoints ?? row?.total_points ?? 0;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : 0;
}

function sbwRenderOrganizerRankingPoints(row) {
  const points = sbwGetOrganizerRankingPoints(row);
  const prefix = points > 0 ? "+" : "";
  return `<span class="sbw-organizer-rank-points">${prefix}${sbwOrganizerEscape(points)}</span>`;
}

function sbwGetOrganizerRankingRowPoints(row) {
  const points = Number(row?.points ?? row?.totalPoints ?? row?.total_points ?? row?.score ?? 0);
  return Number.isFinite(points) ? points : 0;
}

function sbwGetOrganizerRankingRowName(row, isTeams) {
  if (isTeams) {
    return row?.name || row?.teamName || row?.displayName || row?.display_name || row?.slug || "Equipe";
  }

  return row?.name || row?.nickname || row?.displayName || row?.display_name || row?.playerName || row?.username || row?.slug || "Jogador";
}

function sbwGetOrganizerRankingMeta(snapshot) {
  const summary = snapshot?.summary || {};
  const filters = snapshot?.filters || {};
  const season = summary.activeSeason || filters.season || "Todas";
  const tournaments = Number(summary.completedTournaments || 0);
  const source = snapshot?.source === "supabase" ? "Supabase" : snapshot?.source === "local-demo" ? "Local/demo" : "Dados do organizador";

  return {
    season,
    tournaments,
    source,
    hasLiveSnapshot: Boolean(snapshot)
  };
}

function sbwNormalizeOrganizerRankingSeasonKey(value) {
  const normalized = sbwOrganizerNormalizeKey(value);
  return normalized || "all";
}

function sbwGetOrganizerRankingRecordSeason(record) {
  return String(
    record?.season ||
    record?.seasonName ||
    record?.season_name ||
    record?.seasonTitle ||
    record?.season_title ||
    record?.seasonSlug ||
    record?.season_slug ||
    record?.tournamentSeason ||
    record?.tournament_season ||
    "Temporada atual"
  ).trim() || "Temporada atual";
}

function sbwGetOrganizerRankingTournamentSeason(tournament, organizer) {
  if (typeof sbwOrganizerGetTournamentSeasonLabel === "function") {
    return sbwOrganizerGetTournamentSeasonLabel(tournament, organizer);
  }

  const metadata = sbwOrganizerAsObject(tournament?.metadata);
  const settings = sbwOrganizerAsObject(tournament?.settings);
  const season = sbwOrganizerAsObject(tournament?.season || metadata.season || settings.season);

  return String(
    tournament?.seasonName ||
    tournament?.season_name ||
    settings?.seasonName ||
    settings?.season_name ||
    metadata?.seasonName ||
    metadata?.season_name ||
    season?.name ||
    season?.title ||
    "Temporada atual"
  ).trim() || "Temporada atual";
}

function sbwGetOrganizerRankingSeasonOptions(organizer, snapshot) {
  const map = new Map();

  const addOption = (label) => {
    const safeLabel = String(label || "").trim();
    if (!safeLabel) return;
    const key = sbwNormalizeOrganizerRankingSeasonKey(safeLabel);
    if (!key || key === "all" || map.has(key)) return;
    map.set(key, safeLabel);
  };

  addOption(sbwGetOrganizerCurrentSeasonLabel(organizer));
  sbwOrganizerAsArray(snapshot?.records).forEach((record) => addOption(sbwGetOrganizerRankingRecordSeason(record)));
  sbwOrganizerAsArray(snapshot?.tournaments).forEach((tournament) => addOption(sbwGetOrganizerRankingTournamentSeason(tournament, organizer)));
  sbwOrganizerAsArray(sbwOrganizerPageState.tournaments).forEach((tournament) => addOption(sbwGetOrganizerRankingTournamentSeason(tournament, organizer)));

  const options = Array.from(map.entries()).map(([key, label]) => ({ key, label }));
  return [{ key: "all", label: "Todas" }, ...options];
}

function sbwGetOrganizerRankingSelectedSeasonLabel(organizer, snapshot) {
  const selected = sbwNormalizeOrganizerRankingSeasonKey(sbwOrganizerPageState.rankingSeasonFilter || "all");
  const options = sbwGetOrganizerRankingSeasonOptions(organizer, snapshot);
  return options.find((option) => option.key === selected)?.label || "Todas";
}

function sbwFilterOrganizerRankingSnapshotBySeason(organizer, snapshot) {
  const selected = sbwNormalizeOrganizerRankingSeasonKey(sbwOrganizerPageState.rankingSeasonFilter || "all");

  if (!snapshot || selected === "all") return snapshot;

  const records = sbwOrganizerAsArray(snapshot.records).filter((record) => {
    return sbwNormalizeOrganizerRankingSeasonKey(sbwGetOrganizerRankingRecordSeason(record)) === selected;
  });

  const tournamentKeys = new Set(records.map((record) => String(record?.tournamentSlug || record?.tournamentId || "").trim()).filter(Boolean));
  const tournaments = sbwOrganizerAsArray(snapshot.tournaments).filter((tournament) => {
    const seasonMatches = sbwNormalizeOrganizerRankingSeasonKey(sbwGetOrganizerRankingTournamentSeason(tournament, organizer)) === selected;
    const key = sbwGetOrganizerRankingTournamentKey(tournament);
    return seasonMatches || tournamentKeys.has(String(tournament?.id || "")) || tournamentKeys.has(String(tournament?.slug || "")) || tournamentKeys.has(key);
  });

  const completedTournaments = tournaments.length || new Set(records.map((record) => String(record?.tournamentSlug || record?.tournamentId || "").trim()).filter(Boolean)).size;

  return {
    ...snapshot,
    records,
    tournaments,
    filters: {
      ...(snapshot.filters || {}),
      season: sbwGetOrganizerRankingSelectedSeasonLabel(organizer, snapshot)
    },
    summary: {
      ...(snapshot.summary || {}),
      completedTournaments,
      rankedPlayers: records.filter((record) => Number(record?.playerPoints || 0) > 0).length,
      rankedTeams: records.filter((record) => Number(record?.teamPoints || 0) > 0).length
    }
  };
}

function sbwRenderOrganizerRankingSeasonFilter(organizer, snapshot) {
  const options = sbwGetOrganizerRankingSeasonOptions(organizer, snapshot);

  if (options.length <= 2) return "";

  const selected = sbwNormalizeOrganizerRankingSeasonKey(sbwOrganizerPageState.rankingSeasonFilter || "all");

  return `
    <div class="sbw-organizer-ranking-season-filter" aria-label="Filtrar ranking por temporada">
      <span>Temporada</span>
      <div>
        ${options.map((option) => `
          <button type="button" class="${option.key === selected ? "is-active" : ""}" data-organizer-ranking-season="${sbwOrganizerEscape(option.key)}">
            ${sbwOrganizerEscape(option.label)}
          </button>
        `).join("")}
      </div>
    </div>
  `;
}

function sbwRenderOrganizerRankingControls() {
  const typeFilter = String(sbwOrganizerPageState.rankingTypeFilter || "all");
  const search = String(sbwOrganizerPageState.rankingSearch || "");
  const sort = String(sbwOrganizerPageState.rankingSort || "points");

  const typeOptions = [
    { key: "all", label: "Todos" },
    { key: "players", label: "Jogadores" },
    { key: "teams", label: "Equipes" }
  ];

  return `
    <div class="sbw-organizer-ranking-controls" aria-label="Filtros do ranking do organizador">
      <label class="sbw-organizer-ranking-search">
        <span>Buscar</span>
        <input type="search" data-organizer-ranking-search placeholder="Buscar jogador ou equipe..." value="${sbwOrganizerEscape(search)}">
      </label>
      <div class="sbw-organizer-ranking-type-filter" aria-label="Tipo de ranking">
        ${typeOptions.map((option) => `
          <button type="button" class="${option.key === typeFilter ? "is-active" : ""}" data-organizer-ranking-type="${sbwOrganizerEscape(option.key)}">
            ${sbwOrganizerEscape(option.label)}
          </button>
        `).join("")}
      </div>
      <label class="sbw-organizer-ranking-sort">
        <span>Ordenar</span>
        <select data-organizer-ranking-sort>
          <option value="points" ${sort === "points" ? "selected" : ""}>Pontos</option>
          <option value="name" ${sort === "name" ? "selected" : ""}>Nome</option>
          <option value="events" ${sort === "events" ? "selected" : ""}>Participações</option>
        </select>
      </label>
    </div>
  `;
}

function sbwGetOrganizerRankingRowEvents(row) {
  const events = Number(row?.events || row?.tournaments || row?.tournamentCount || (Array.isArray(row?.records) ? row.records.length : 0) || 0);
  return Number.isFinite(events) ? events : 0;
}

function sbwGetOrganizerRankingSearchText(row, isTeams) {
  return [
    sbwGetOrganizerRankingRowName(row, isTeams),
    row?.teamName,
    row?.tag,
    row?.slug,
    row?.username,
    row?.displayName,
    row?.display_name
  ].map((item) => String(item || "").toLowerCase()).join(" ");
}

function sbwFilterAndSortOrganizerRankingRows(rows, isTeams) {
  const search = String(sbwOrganizerPageState.rankingSearch || "").trim().toLowerCase();
  const sort = String(sbwOrganizerPageState.rankingSort || "points");

  const filteredRows = search
    ? rows.filter((row) => sbwGetOrganizerRankingSearchText(row, isTeams).includes(search))
    : rows;

  return [...filteredRows].sort((first, second) => {
    if (sort === "name") {
      return sbwGetOrganizerRankingRowName(first, isTeams).localeCompare(sbwGetOrganizerRankingRowName(second, isTeams), "pt-BR");
    }

    if (sort === "events") {
      const eventsDiff = sbwGetOrganizerRankingRowEvents(second) - sbwGetOrganizerRankingRowEvents(first);
      if (eventsDiff !== 0) return eventsDiff;
      const pointsDiff = sbwGetOrganizerRankingRowPoints(second) - sbwGetOrganizerRankingRowPoints(first);
      if (pointsDiff !== 0) return pointsDiff;
      return sbwGetOrganizerRankingRowName(first, isTeams).localeCompare(sbwGetOrganizerRankingRowName(second, isTeams), "pt-BR");
    }

    const pointsDiff = sbwGetOrganizerRankingRowPoints(second) - sbwGetOrganizerRankingRowPoints(first);
    if (pointsDiff !== 0) return pointsDiff;
    const eventsDiff = sbwGetOrganizerRankingRowEvents(second) - sbwGetOrganizerRankingRowEvents(first);
    if (eventsDiff !== 0) return eventsDiff;
    return sbwGetOrganizerRankingRowName(first, isTeams).localeCompare(sbwGetOrganizerRankingRowName(second, isTeams), "pt-BR");
  });
}


function sbwRenderOrganizerRankingTable(organizer, type, snapshot) {
  const rows = sbwGetOrganizerRankingRows(organizer, type, snapshot);
  const listRows = sbwFilterAndSortOrganizerRankingRows(rows, type === "teams");
  const isTeams = type === "teams";
  const title = isTeams ? "Equipes" : "Jogadores";
  const label = isTeams ? "Equipe" : "Jogador";
  const meta = sbwGetOrganizerRankingMeta(snapshot);
  const emptyText = snapshot
    ? `A lista completa de ${isTeams ? "equipes" : "jogadores"} aparecerá após torneios finalizados e pontuáveis deste organizador.`
    : isTeams
      ? "Equipes aparecerão quando houver participação em torneios pontuáveis."
      : "Jogadores aparecerão quando houver participação em torneios pontuáveis.";

  const rowsHTML = listRows.length
    ? listRows.map((row, index) => {
        const currentPosition = Number(row.position ?? row.rank ?? row.currentPosition ?? row.current_position ?? index + 1);
        const safePosition = Number.isFinite(currentPosition) && currentPosition > 0 ? currentPosition : index + 1;
        const name = sbwGetOrganizerRankingRowName(row, isTeams);
        const events = sbwGetOrganizerRankingRowEvents(row);
        const points = sbwGetOrganizerRankingRowPoints(row);
        const status = points > 0 ? `${points} pts` : "0 pts";
        const subLabel = points > 0
          ? `${events || 1} torneio${Number(events || 1) === 1 ? "" : "s"} pontuável${Number(events || 1) === 1 ? "" : "eis"}`
          : `Participou${events ? ` de ${events} torneio${events === 1 ? "" : "s"}` : ""} · sem pontuação`;

        return `
          <div class="sbw-organizer-ranking-list-row ${points > 0 ? "is-scored" : "is-zero"}">
            <span class="sbw-organizer-ranking-list-pos">${sbwOrganizerEscape(safePosition)}</span>
            <span class="sbw-organizer-ranking-list-main">
              <strong>${sbwOrganizerEscape(name)}</strong>
              <small>${sbwOrganizerEscape(subLabel)}</small>
            </span>
            <span class="sbw-organizer-ranking-list-points">${sbwOrganizerEscape(status)}</span>
          </div>
        `;
      }).join("")
    : `<div class="sbw-organizer-ranking-list-empty">${emptyText}</div>`;

  return `
    <section class="sbw-organizer-ranking-list-card ${snapshot ? "sbw-organizer-ranking-card--live" : ""}">
      <div class="sbw-organizer-ranking-list-head">
        <div>
          <span class="sbw-organizer-eyebrow">${snapshot ? "Ranking real" : "Ranking"}</span>
          <h3>${title}</h3>
        </div>
        <span class="sbw-organizer-ranking-season" title="${sbwOrganizerEscape(meta.source)}">
          ${listRows.length ? `${sbwOrganizerEscape(listRows.length)} ${isTeams ? "equipes" : "jogadores"}` : label}
        </span>
      </div>
      <div class="sbw-organizer-ranking-list" role="list" aria-label="Lista de ${sbwOrganizerEscape(title.toLowerCase())} do ranking do organizador">
        ${rowsHTML}
      </div>
    </section>
  `;
}

function sbwRenderOrganizerRankingSummary(organizer, snapshot) {
  if (!snapshot) return "";

  const summary = snapshot.summary || {};
  const playerRows = sbwGetOrganizerRankingRows(organizer, "players", snapshot);
  const teamRows = sbwGetOrganizerRankingRows(organizer, "teams", snapshot);
  const updatedAt = snapshot.generatedAt ? new Date(snapshot.generatedAt) : null;
  const updatedLabel = updatedAt && !Number.isNaN(updatedAt.getTime())
    ? updatedAt.toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })
    : "Agora";

  return `
    <div class="sbw-organizer-ranking-summary" aria-label="Resumo do ranking real do organizador">
      <span><strong>${sbwOrganizerEscape(summary.completedTournaments || 0)}</strong> torneio${Number(summary.completedTournaments || 0) === 1 ? "" : "s"} pontuável${Number(summary.completedTournaments || 0) === 1 ? "" : "eis"}</span>
      <span><strong>${sbwOrganizerEscape(playerRows.length || 0)}</strong> participante${Number(playerRows.length || 0) === 1 ? "" : "s"}</span>
      <span><strong>${sbwOrganizerEscape(teamRows.length || 0)}</strong> equipe${Number(teamRows.length || 0) === 1 ? "" : "s"}</span>
      <span>Atualizado ${sbwOrganizerEscape(updatedLabel)}</span>
    </div>
  `;
}

function sbwOrganizerHasLiveRankingRows(snapshot) {
  const summary = snapshot?.summary || {};
  return Number(summary.rankedPlayers || 0) > 0 || Number(summary.rankedTeams || 0) > 0 || Number(summary.completedTournaments || 0) > 0;
}

function sbwRenderOrganizerRankingEmptyPanel(snapshot) {
  if (sbwOrganizerHasLiveRankingRows(snapshot)) return "";

  return `
    <article class="sbw-organizer-ranking-empty-panel">
      <span class="sbw-organizer-eyebrow">Ranking em preparação</span>
      <h3>A classificação deste organizador aparecerá após torneios finalizados e pontuáveis.</h3>
      <p>
        A aba Rankings fica reservada para a pontuação oficial do organizador. Quando houver resultados finalizados,
        a plataforma -SBW- exibirá jogadores, equipes e a base usada para calcular a pontuação.
      </p>
    </article>
  `;
}

function sbwRenderOrganizerRankingRulesPanel() {
  return `
    <aside class="sbw-organizer-ranking-rules" aria-label="Resumo das regras de ranking do organizador">
      <span class="sbw-organizer-eyebrow">Regras aplicadas</span>
      <ul>
        <li>Somente torneios finalizados e marcados como pontuáveis entram no ranking do organizador.</li>
        <li>Jogadores pontuam conforme a colocação final registrada no torneio.</li>
        <li>Equipes usam a regra de melhor colocado da equipe por torneio para evitar pontuação inflada.</li>
      </ul>
    </aside>
  `;
}


function sbwGetOrganizerRankingTournamentKey(tournament) {
  return String(tournament?.slug || tournament?.id || tournament?.supabaseId || tournament?.title || tournament?.name || "").trim();
}

function sbwGetOrganizerRankingTournamentTitle(tournament) {
  return String(tournament?.title || tournament?.name || tournament?.metadata?.title || "Torneio pontuável").trim();
}

function sbwGetOrganizerRankingTournamentUrl(tournament) {
  const key = String(tournament?.slug || tournament?.id || tournament?.supabaseId || "").trim();
  return key ? `detalhe-torneio.html?id=${encodeURIComponent(key)}&view=resultados` : "#";
}

function sbwGetOrganizerRankingTournamentDate(tournament) {
  const dateValue = tournament?.settings?.finalResults?.completedAt ||
    tournament?.metadata?.finalResults?.completedAt ||
    tournament?.settings?.finalResults?.finalizedAt ||
    tournament?.metadata?.finalResults?.finalizedAt ||
    tournament?.updatedAt ||
    tournament?.updated_at ||
    tournament?.startsAt ||
    tournament?.created_at ||
    tournament?.date ||
    "";
  return sbwFormatDate(dateValue);
}

function sbwBuildOrganizerRankingAuditItems(snapshot) {
  if (!snapshot) return [];

  const tournaments = Array.isArray(snapshot.tournaments) ? snapshot.tournaments : [];
  const records = Array.isArray(snapshot.records) ? snapshot.records : [];
  const recordMap = records.reduce((acc, record) => {
    const key = String(record?.tournamentSlug || record?.tournamentId || "").trim();
    if (!key) return acc;

    if (!acc[key]) {
      acc[key] = {
        records: 0,
        playerPoints: 0,
        teamPoints: 0,
        season: record?.season || "",
        champion: ""
      };
    }

    acc[key].records += 1;
    acc[key].playerPoints += Number(record?.playerPoints || 0);
    acc[key].teamPoints += Number(record?.teamPoints || 0);

    if (!acc[key].champion && Number(record?.placement || record?.position || 0) === 1) {
      acc[key].champion = record?.nickname || record?.name || record?.playerName || "";
    }

    return acc;
  }, {});

  return tournaments
    .map((tournament) => {
      const key = sbwGetOrganizerRankingTournamentKey(tournament);
      const audit = recordMap[key] || recordMap[String(tournament?.id || "")] || recordMap[String(tournament?.slug || "")] || null;
      if (!audit) return null;

      return {
        tournament,
        key,
        title: sbwGetOrganizerRankingTournamentTitle(tournament),
        game: tournament?.gameName || tournament?.game || tournament?.game_name || "Jogo não informado",
        date: sbwGetOrganizerRankingTournamentDate(tournament),
        season: audit.season || "Temporada atual",
        champion: audit.champion || "Campeão a validar",
        records: audit.records,
        playerPoints: audit.playerPoints,
        teamPoints: audit.teamPoints,
        url: sbwGetOrganizerRankingTournamentUrl(tournament)
      };
    })
    .filter(Boolean)
    .sort((first, second) => new Date(second.tournament?.updatedAt || second.tournament?.updated_at || second.tournament?.date || 0) - new Date(first.tournament?.updatedAt || first.tournament?.updated_at || first.tournament?.date || 0))
    .slice(0, 6);
}

function sbwRenderOrganizerRankingAuditPanel(snapshot) {
  const items = sbwBuildOrganizerRankingAuditItems(snapshot);

  if (!items.length) return "";

  return `
    <section class="sbw-organizer-ranking-audit" aria-label="Torneios pontuáveis recentes">
      <div class="sbw-organizer-ranking-audit-head">
        <div>
          <span class="sbw-organizer-eyebrow">Base do ranking</span>
          <h3>Torneios pontuáveis recentes</h3>
        </div>
        <span>${sbwOrganizerEscape(items.length)} exibido${items.length === 1 ? "" : "s"}</span>
      </div>
      <div class="sbw-organizer-ranking-audit-list">
        ${items.map((item) => `
          <a class="sbw-organizer-ranking-audit-item" href="${sbwOrganizerEscape(item.url)}">
            <span>
              <strong>${sbwOrganizerEscape(item.title)}</strong>
              <small>${sbwOrganizerEscape(item.game)} · ${sbwOrganizerEscape(item.date)} · ${sbwOrganizerEscape(item.season)}</small>
            </span>
            <span class="sbw-organizer-ranking-audit-meta">
              <small>Campeão</small>
              <strong>${sbwOrganizerEscape(item.champion)}</strong>
            </span>
            <span class="sbw-organizer-ranking-audit-points">
              <small>${sbwOrganizerEscape(item.records)} resultado${item.records === 1 ? "" : "s"}</small>
              <strong>${sbwOrganizerEscape(item.playerPoints)}J / ${sbwOrganizerEscape(item.teamPoints)}E pts</strong>
            </span>
          </a>
        `).join("")}
      </div>
    </section>
  `;
}

function sbwRenderOrganizerRankings(organizer, snapshot) {
  const fullRankingUrl = sbwGetOrganizerFullRankingUrl(organizer);
  const organizerName = sbwGetOrganizerDisplayName(organizer);
  const filteredSnapshot = sbwFilterOrganizerRankingSnapshotBySeason(organizer, snapshot);
  const hasData = sbwOrganizerHasLiveRankingRows(filteredSnapshot);
  const selectedSeasonLabel = sbwGetOrganizerRankingSelectedSeasonLabel(organizer, snapshot);
  const html = `
    <div class="sbw-organizer-ranking-page-head">
      <div>
        <span class="sbw-organizer-eyebrow">Ranking do organizador</span>
        <h3>${sbwOrganizerEscape(organizerName)}</h3>
        <p>
          Ranking próprio deste organizador dentro da plataforma -SBW-, separado do Ranking Global -SBW-.
          ${selectedSeasonLabel !== "Todas" ? `Filtro atual: ${sbwOrganizerEscape(selectedSeasonLabel)}.` : ""}
        </p>
      </div>
      <a class="sbw-organizer-small-action" href="${sbwOrganizerEscape(fullRankingUrl)}">Ver ranking completo</a>
    </div>
    ${sbwRenderOrganizerRankingSeasonFilter(organizer, snapshot)}
    ${sbwRenderOrganizerRankingControls()}
    ${sbwRenderOrganizerRankingSummary(organizer, filteredSnapshot)}
    ${sbwRenderOrganizerRankingEmptyPanel(filteredSnapshot)}
    <div class="sbw-organizer-ranking-tables ${hasData ? "" : "sbw-organizer-ranking-tables--empty"}">
      ${sbwOrganizerPageState.rankingTypeFilter !== "teams" ? sbwRenderOrganizerRankingTable(organizer, "players", filteredSnapshot) : ""}
      ${sbwOrganizerPageState.rankingTypeFilter !== "players" ? sbwRenderOrganizerRankingTable(organizer, "teams", filteredSnapshot) : ""}
    </div>
    ${sbwRenderOrganizerRankingAuditPanel(filteredSnapshot)}
    ${sbwRenderOrganizerRankingRulesPanel()}
  `;

  if (sbwOrganizerRankingsGrid) {
    sbwOrganizerRankingsGrid.innerHTML = html;
  }
}

async function sbwBuildOrganizerLiveRankingSnapshot(organizer) {
  const storage = window.SBWRankingsStorage;

  if (!storage || typeof storage.getRankingSnapshotAsync !== "function") {
    return null;
  }

  const candidates = sbwGetOrganizerRankingFilterCandidates(organizer);
  let fallbackSnapshot = null;

  for (const organizerFilter of candidates) {
    try {
      const snapshot = await storage.getRankingSnapshotAsync({
        organizer: organizerFilter,
        globalStatus: "organizer"
      });

      if (!fallbackSnapshot) {
        fallbackSnapshot = snapshot;
      }

      if (Number(snapshot?.summary?.completedTournaments || 0) > 0 || Number(snapshot?.summary?.rankedPlayers || 0) > 0 || Number(snapshot?.summary?.rankedTeams || 0) > 0) {
        return snapshot;
      }
    } catch (error) {
      console.warn("[SBW Organizador] Não foi possível gerar ranking real do organizador:", error);
    }
  }

  return fallbackSnapshot;
}


function sbwOrganizerGetTournamentStats(tournaments) {
  const items = Array.isArray(tournaments) ? tournaments : [];
  const stats = {
    total: items.length,
    open: 0,
    running: 0,
    finished: 0,
    draft: 0,
    pointable: 0,
    participants: 0
  };

  items.forEach((tournament) => {
    const status = sbwGetStatusInfo(tournament?.status).className || "draft";

    if (status === "open") stats.open += 1;
    else if (status === "running") stats.running += 1;
    else if (status === "finished") stats.finished += 1;
    else stats.draft += 1;

    if (sbwOrganizerIsPointableTournament(tournament)) stats.pointable += 1;
    stats.participants += Number(sbwGetTournamentParticipantCount(tournament) || 0);
  });

  return stats;
}

function sbwRenderOrganizerTournamentsSummary(tournaments) {
  if (!sbwOrganizerTournamentsSummary) return;

  const stats = sbwOrganizerGetTournamentStats(tournaments);

  if (!stats.total) {
    sbwOrganizerTournamentsSummary.innerHTML = `
      <div class="sbw-organizer-tournaments-summary-empty">
        <strong>Nenhum torneio publicado ainda.</strong>
        <span>Quando este organizador criar torneios, o resumo aparecerá aqui.</span>
      </div>
    `;
    return;
  }

  sbwOrganizerTournamentsSummary.innerHTML = `
    <div class="sbw-organizer-tournaments-summary-grid">
      <article><span>Total</span><strong>${sbwOrganizerEscape(stats.total)}</strong></article>
      <article><span>Abertos</span><strong>${sbwOrganizerEscape(stats.open)}</strong></article>
      <article><span>Em andamento</span><strong>${sbwOrganizerEscape(stats.running)}</strong></article>
      <article><span>Finalizados</span><strong>${sbwOrganizerEscape(stats.finished)}</strong></article>
      <article><span>Pontuáveis</span><strong>${sbwOrganizerEscape(stats.pointable)}</strong></article>
      <article><span>Inscrições</span><strong>${sbwOrganizerEscape(stats.participants)}</strong></article>
    </div>
  `;
}

function sbwRenderOrganizerTournamentCard(tournament) {
  const status = sbwGetStatusInfo(tournament?.status);
  const detailUrl = `detalhe-torneio.html?id=${encodeURIComponent(tournament.id || tournament.slug || tournament.supabaseId)}`;
  const cover = sbwGetOrganizerTournamentCover(tournament);
  const title = tournament?.name || tournament?.title || "Torneio sem nome";
  const game = tournament?.game || tournament?.gameName || "Jogo a definir";
  const caption = sbwGetOrganizerTournamentCaption(tournament);

  return `
    <article class="sbw-organizer-tournament-card sbw-organizer-tournament-card--mini" data-status="${sbwOrganizerEscape(status.className)}" data-name="${sbwOrganizerEscape(String(title).toLowerCase())}">
      <div class="sbw-organizer-tournament-cover">
        ${cover ? `<img src="${sbwOrganizerEscape(cover)}" alt="" aria-hidden="true">` : `<span class="sbw-organizer-tournament-cover-fallback">${sbwOrganizerEscape(game)}</span>`}
        <span class="status-pill ${sbwOrganizerEscape(status.className)}">${sbwOrganizerEscape(status.label)}</span>
      </div>
      <div class="sbw-organizer-tournament-body">
        <div class="sbw-organizer-tournament-kicker">${sbwOrganizerEscape(game)}</div>
        <h3>${sbwOrganizerEscape(title)}</h3>
        ${caption ? `<p class="sbw-organizer-tournament-caption">${sbwOrganizerEscape(caption)}</p>` : ""}
        <div class="sbw-organizer-tournament-mini-meta">
          <span>${sbwOrganizerEscape(sbwGetParticipantsLabel(tournament))}</span>
          <span>${sbwOrganizerEscape(sbwGetOrganizerTournamentDateLabel(tournament))}</span>
        </div>
        <a class="sbw-organizer-action-btn" href="${sbwOrganizerEscape(detailUrl)}">Ver torneio</a>
      </div>
    </article>
  `;
}

function sbwRenderOrganizerTournaments(tournaments) {
  if (!sbwOrganizerTournamentsGrid) return;

  if (!Array.isArray(tournaments) || tournaments.length === 0) {
    sbwOrganizerTournamentsGrid.innerHTML = `<div class="sbw-organizer-empty-state">Este organizador ainda não publicou torneios.</div>`;
    return;
  }

  sbwOrganizerTournamentsGrid.innerHTML = tournaments.map(sbwRenderOrganizerTournamentCard).join("");
}

function sbwRenderOrganizerOverviewTournaments(tournaments) {
  if (!sbwOrganizerOverviewTournaments) return;

  const items = Array.isArray(tournaments) ? tournaments : [];

  if (items.length === 0) {
    sbwOrganizerOverviewTournaments.innerHTML = `<div class="sbw-organizer-empty-state">Nenhum torneio publicado ainda.</div>`;
    return;
  }

  sbwOrganizerOverviewTournaments.innerHTML = items.map(sbwRenderOrganizerTournamentCard).join("");
}


function sbwOrganizerGetComparableDate(tournament) {
  const value = tournament?.startsAt ||
    tournament?.start_date ||
    tournament?.startDate ||
    tournament?.date ||
    tournament?.scheduledAt ||
    tournament?.scheduled_at ||
    tournament?.createdAt ||
    tournament?.created_at ||
    "";
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime()) ? date : null;
}

function sbwOrganizerGetUpcomingTournament(tournaments) {
  const now = Date.now();
  const items = Array.isArray(tournaments) ? tournaments : [];

  return items
    .map((tournament) => ({ tournament, date: sbwOrganizerGetComparableDate(tournament) }))
    .filter((item) => item.date && item.date.getTime() >= now && sbwGetStatusInfo(item.tournament?.status).className !== "finished")
    .sort((first, second) => first.date.getTime() - second.date.getTime())[0]?.tournament || null;
}

function sbwOrganizerGetLatestFinishedTournament(tournaments) {
  const items = Array.isArray(tournaments) ? tournaments : [];

  return items
    .filter((tournament) => sbwGetStatusInfo(tournament?.status).className === "finished")
    .map((tournament) => ({ tournament, date: sbwOrganizerGetComparableDate(tournament) || new Date(tournament?.updatedAt || tournament?.updated_at || 0) }))
    .sort((first, second) => second.date.getTime() - first.date.getTime())[0]?.tournament || null;
}

function sbwRenderOrganizerOverviewHighlights(organizer, tournaments, snapshot) {
  if (!sbwOrganizerOverviewHighlights) return;

  const items = Array.isArray(tournaments) ? tournaments : [];
  const upcoming = sbwOrganizerGetUpcomingTournament(items);
  const latestFinished = sbwOrganizerGetLatestFinishedTournament(items);
  const activeSeason = sbwGetOrganizerCurrentSeasonLabel(organizer) || "Temporada atual";
  const rankedPlayers = Number(snapshot?.summary?.rankedPlayers || 0);
  const rankedTeams = Number(snapshot?.summary?.rankedTeams || 0);
  const pointableCount = items.filter(sbwOrganizerIsPointableTournament).length;

  const upcomingTitle = upcoming?.name || upcoming?.title || "Nenhum torneio futuro publicado";
  const upcomingMeta = upcoming
    ? `${sbwOrganizerEscape(upcoming.game || upcoming.gameName || "Jogo a definir")} · ${sbwOrganizerEscape(sbwGetOrganizerTournamentDateLabel(upcoming))}`
    : "Os próximos torneios aparecerão aqui quando forem publicados.";
  const upcomingUrl = upcoming ? `detalhe-torneio.html?id=${encodeURIComponent(upcoming.id || upcoming.slug || upcoming.supabaseId)}` : "#";

  const latestTitle = latestFinished?.name || latestFinished?.title || "Histórico em preparação";
  const latestChampion = latestFinished ? sbwOrganizerGetTournamentChampionLabel(latestFinished) : "Campeão a validar";
  const latestUrl = latestFinished ? sbwOrganizerGetTournamentHistoryUrl(latestFinished) : "#";

  sbwOrganizerOverviewHighlights.innerHTML = `
    <div class="sbw-organizer-overview-highlight-grid">
      <article class="sbw-organizer-overview-highlight-card">
        <span>Próximo torneio</span>
        <strong>${sbwOrganizerEscape(upcomingTitle)}</strong>
        <small>${upcomingMeta}</small>
        ${upcoming ? `<a href="${sbwOrganizerEscape(upcomingUrl)}">Abrir torneio</a>` : `<button type="button" data-organizer-tab-shortcut="tournaments">Ver torneios</button>`}
      </article>
      <article class="sbw-organizer-overview-highlight-card">
        <span>Último campeão</span>
        <strong>${sbwOrganizerEscape(latestChampion)}</strong>
        <small>${latestFinished ? sbwOrganizerEscape(latestTitle) : "Quando houver torneios finalizados, o campeão mais recente aparece aqui."}</small>
        ${latestFinished ? `<a href="${sbwOrganizerEscape(latestUrl)}">Ver resultado</a>` : `<button type="button" data-organizer-tab-shortcut="history">Ver histórico</button>`}
      </article>
      <article class="sbw-organizer-overview-highlight-card sbw-organizer-overview-highlight-card--season">
        <span>Temporada e ranking</span>
        <strong>${sbwOrganizerEscape(activeSeason)}</strong>
        <small>${sbwOrganizerEscape(pointableCount)} torneio${pointableCount === 1 ? "" : "s"} pontuável${pointableCount === 1 ? "" : "eis"} · ${sbwOrganizerEscape(rankedPlayers)} jogador${rankedPlayers === 1 ? "" : "es"} · ${sbwOrganizerEscape(rankedTeams)} equipe${rankedTeams === 1 ? "" : "s"}</small>
        <button type="button" data-organizer-tab-shortcut="rankings">Ver rankings</button>
      </article>
    </div>
  `;
}

function sbwOrganizerGetTournamentSeasonLabel(tournament, organizer) {
  const metadata = sbwOrganizerAsObject(tournament?.metadata);
  const settings = sbwOrganizerAsObject(tournament?.settings);
  const season = sbwOrganizerAsObject(tournament?.season || metadata.season || settings.season);

  return String(
    tournament?.seasonName ||
    tournament?.season_name ||
    tournament?.seasonTitle ||
    tournament?.season_title ||
    tournament?.season_id ||
    tournament?.seasonId ||
    settings?.seasonName ||
    settings?.season_name ||
    settings?.seasonTitle ||
    settings?.season_title ||
    settings?.season_id ||
    settings?.seasonId ||
    metadata?.seasonName ||
    metadata?.season_name ||
    metadata?.seasonTitle ||
    metadata?.season_title ||
    metadata?.season_id ||
    metadata?.seasonId ||
    season?.name ||
    season?.title ||
    season?.slug ||
    sbwGetOrganizerCurrentSeasonLabel(organizer) ||
    "Temporada atual"
  ).trim() || "Temporada atual";
}

function sbwOrganizerGetSeasonDateValue(tournament) {
  return tournament?.startsAt ||
    tournament?.start_date ||
    tournament?.startDate ||
    tournament?.date ||
    tournament?.created_at ||
    tournament?.createdAt ||
    "";
}

function sbwOrganizerGetSeasonEndDateValue(tournament) {
  return tournament?.endsAt ||
    tournament?.end_date ||
    tournament?.endDate ||
    tournament?.settings?.endDate ||
    tournament?.settings?.end_date ||
    tournament?.updated_at ||
    tournament?.updatedAt ||
    sbwOrganizerGetSeasonDateValue(tournament) ||
    "";
}

function sbwOrganizerIsPointableTournament(tournament) {
  const finalData = sbwOrganizerGetTournamentFinalData(tournament);
  return Boolean(
    tournament?.countsForOrganizerRanking ||
    tournament?.counts_for_organizer_ranking ||
    tournament?.rankingEnabled ||
    tournament?.ranking_enabled ||
    tournament?.settings?.rankingEnabled ||
    tournament?.settings?.ranking_enabled ||
    tournament?.settings?.countsForOrganizerRanking ||
    tournament?.settings?.counts_for_organizer_ranking ||
    finalData?.rankingApplied ||
    finalData?.ranking_applied
  );
}

function sbwBuildOrganizerSeasonPreview(organizer, tournaments) {
  const items = Array.isArray(tournaments) ? tournaments : [];
  const map = new Map();

  items.forEach((tournament) => {
    const label = sbwOrganizerGetTournamentSeasonLabel(tournament, organizer);
    const key = sbwOrganizerNormalizeKey(label) || "temporada-atual";
    const status = sbwGetStatusInfo(tournament?.status).className;
    const startValue = sbwOrganizerGetSeasonDateValue(tournament);
    const endValue = sbwOrganizerGetSeasonEndDateValue(tournament);
    const startDate = startValue ? new Date(startValue) : null;
    const endDate = endValue ? new Date(endValue) : null;

    if (!map.has(key)) {
      map.set(key, {
        label,
        total: 0,
        open: 0,
        running: 0,
        finished: 0,
        pointable: 0,
        startDate: null,
        endDate: null,
        games: new Set(),
        tournaments: []
      });
    }

    const season = map.get(key);
    const tournamentKey = tournament?.id || tournament?.slug || tournament?.supabaseId || tournament?.uuid || "";
    const title = tournament?.name || tournament?.title || "Torneio sem nome";
    const gameLabel = String(tournament?.game || tournament?.gameName || tournament?.game_name || "Jogo a definir").trim() || "Jogo a definir";
    const dateLabel = sbwGetOrganizerTournamentDateLabel(tournament);
    const pointable = sbwOrganizerIsPointableTournament(tournament);

    season.tournaments.push({
      key: tournamentKey,
      title,
      game: gameLabel,
      dateLabel,
      status,
      pointable,
      url: tournamentKey ? `detalhe-torneio.html?id=${encodeURIComponent(tournamentKey)}` : "#"
    });

    season.total += 1;
    if (status === "open") season.open += 1;
    if (status === "running") season.running += 1;
    if (status === "finished") season.finished += 1;
    if (pointable) season.pointable += 1;

    const game = gameLabel;
    if (game) season.games.add(game);

    if (startDate && !Number.isNaN(startDate.getTime())) {
      if (!season.startDate || startDate < season.startDate) season.startDate = startDate;
    }

    if (endDate && !Number.isNaN(endDate.getTime())) {
      if (!season.endDate || endDate > season.endDate) season.endDate = endDate;
    }
  });

  return Array.from(map.values()).sort((first, second) => {
    const firstTime = first.startDate ? first.startDate.getTime() : 0;
    const secondTime = second.startDate ? second.startDate.getTime() : 0;
    return secondTime - firstTime;
  }).map((season) => ({
    ...season,
    tournaments: Array.isArray(season.tournaments)
      ? season.tournaments.sort((first, second) => String(first.dateLabel || "").localeCompare(String(second.dateLabel || ""), "pt-BR"))
      : []
  }));
}


function sbwOrganizerParseSeasonDate(value) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(`${String(value).slice(0, 10)}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function sbwGetOrganizerSeasonTimelineStatus(season) {
  const start = sbwOrganizerParseSeasonDate(season?.startDate);
  const end = sbwOrganizerParseSeasonDate(season?.endDate);
  const today = sbwOrganizerParseSeasonDate(new Date().toISOString().slice(0, 10));

  if (!start || !end) return { label: "Planejada", className: "draft", action: "Calendário em preparação." };
  if (today && today < start) return { label: "Programada", className: "scheduled", action: "Próximo passo: abertura da temporada." };
  if (today && today > end) return { label: "Encerrada", className: "finished", action: "Resultados e ranking prontos para revisão." };
  return { label: "Ativa", className: "live", action: "Temporada em andamento." };
}

function sbwGetOrganizerSeasonStatus(season) {
  const timelineStatus = sbwGetOrganizerSeasonTimelineStatus(season);
  if (timelineStatus.className !== "draft") return timelineStatus;
  if (Number(season.running || 0) > 0) return { label: "Em andamento", className: "live", action: "Temporada em andamento." };
  if (Number(season.open || 0) > 0) return { label: "Inscrições abertas", className: "open", action: "Inscrições abertas em torneios da temporada." };
  if (Number(season.total || 0) > 0 && Number(season.finished || 0) >= Number(season.total || 0)) return { label: "Concluída", className: "finished", action: "Resultados e ranking prontos para revisão." };
  return timelineStatus;
}

function sbwFormatOrganizerSeasonRange(season) {
  const start = season?.startDate ? sbwFormatDate(season.startDate.toISOString()) : "Início a definir";
  const end = season?.endDate ? sbwFormatDate(season.endDate.toISOString()) : "Fim a definir";
  return `${start} — ${end}`;
}

function sbwRenderOrganizerSeasons(organizer, tournaments) {
  if (!sbwOrganizerSeasonsGrid) return;

  const seasons = sbwBuildOrganizerSeasonPreview(organizer, tournaments);

  if (!seasons.length) {
    sbwOrganizerSeasonsGrid.innerHTML = `
      <div class="sbw-organizer-empty-state sbw-organizer-seasons-empty">
        <strong>Temporadas em preparação</strong>
        <span>Quando o organizador vincular torneios a temporadas, a plataforma -SBW- exibirá o calendário, torneios pontuáveis e progresso competitivo nesta área.</span>
      </div>
    `;
    return;
  }

  sbwOrganizerSeasonsGrid.innerHTML = `
    <div class="sbw-organizer-seasons-summary">
      <span><strong>${sbwOrganizerEscape(seasons.length)}</strong> temporada${seasons.length === 1 ? "" : "s"}</span>
      <span><strong>${sbwOrganizerEscape(seasons.reduce((total, season) => total + Number(season.total || 0), 0))}</strong> torneio${seasons.reduce((total, season) => total + Number(season.total || 0), 0) === 1 ? "" : "s"}</span>
      <span><strong>${sbwOrganizerEscape(seasons.reduce((total, season) => total + Number(season.pointable || 0), 0))}</strong> pontuável${seasons.reduce((total, season) => total + Number(season.pointable || 0), 0) === 1 ? "" : "eis"}</span>
    </div>
    <div class="sbw-organizer-seasons-grid">
      ${seasons.map((season) => {
        const status = sbwGetOrganizerSeasonStatus(season);
        const games = Array.from(season.games || []).slice(0, 3);
        return `
          <article class="sbw-organizer-season-card sbw-organizer-season-card--${sbwOrganizerEscape(status.className)}">
            <div class="sbw-organizer-season-card-head">
              <span class="sbw-organizer-season-status">${sbwOrganizerEscape(status.label)}</span>
              <strong>${sbwOrganizerEscape(season.label)}</strong>
              <small>${sbwOrganizerEscape(sbwFormatOrganizerSeasonRange(season))}</small>
              <em>${sbwOrganizerEscape(status.action || "Calendário competitivo da temporada.")}</em>
            </div>
            <div class="sbw-organizer-season-metrics">
              <span><strong>${sbwOrganizerEscape(season.total)}</strong> torneio${Number(season.total || 0) === 1 ? "" : "s"}</span>
              <span><strong>${sbwOrganizerEscape(season.finished)}</strong> finalizado${Number(season.finished || 0) === 1 ? "" : "s"}</span>
              <span><strong>${sbwOrganizerEscape(season.pointable)}</strong> pontuável${Number(season.pointable || 0) === 1 ? "" : "eis"}</span>
            </div>
            ${games.length ? `<div class="sbw-organizer-season-games">${games.map((game) => `<span>${sbwOrganizerEscape(game)}</span>`).join("")}</div>` : ""}
            ${Array.isArray(season.tournaments) && season.tournaments.length ? `
              <div class="sbw-organizer-season-tournaments-preview">
                <span class="sbw-organizer-season-tournaments-title">Torneios vinculados</span>
                ${season.tournaments.slice(0, 4).map((item) => `
                  <a href="${sbwOrganizerEscape(item.url)}" class="sbw-organizer-season-tournament-link">
                    <span>${sbwOrganizerEscape(item.title)}</span>
                    <small>${sbwOrganizerEscape(item.game)} · ${sbwOrganizerEscape(item.dateLabel)}${item.pointable ? " · Pontuável" : ""}</small>
                  </a>
                `).join("")}
                ${season.tournaments.length > 4 ? `<small class="sbw-organizer-season-tournaments-more">+${sbwOrganizerEscape(season.tournaments.length - 4)} torneio${season.tournaments.length - 4 === 1 ? "" : "s"} nesta temporada</small>` : ""}
              </div>
            ` : ""}
            <div class="sbw-organizer-season-actions">
              <a href="${sbwOrganizerEscape(sbwGetOrganizerSelfUrl(organizer, { tab: "rankings", season: season.label }))}">Ranking da temporada</a>
              <a href="${sbwOrganizerEscape(sbwGetOrganizerSelfUrl(organizer, { tab: "tournaments" }))}">Torneios do organizador</a>
            </div>
          </article>
        `;
      }).join("")}
    </div>
  `;
}

function sbwOrganizerGetTournamentFinalData(tournament) {
  return sbwOrganizerAsObject(
    tournament?.settings?.finalResults ||
    tournament?.settings?.final_results ||
    tournament?.metadata?.finalResults ||
    tournament?.metadata?.final_results ||
    tournament?.finalResults ||
    tournament?.final_results
  );
}

function sbwOrganizerGetTournamentChampionLabel(tournament) {
  const finalData = sbwOrganizerGetTournamentFinalData(tournament);
  const champion = sbwOrganizerAsObject(finalData.champion || finalData.winner || finalData.firstPlace || finalData.first_place);

  return String(
    champion.nickname ||
    champion.name ||
    champion.playerName ||
    champion.player_name ||
    champion.teamName ||
    champion.team_name ||
    finalData.championName ||
    finalData.champion_name ||
    finalData.winnerName ||
    finalData.winner_name ||
    finalData.firstPlaceName ||
    finalData.first_place_name ||
    "Campeão a validar"
  ).trim();
}

function sbwOrganizerGetTournamentHistoryStatus(tournament) {
  const status = sbwGetStatusInfo(tournament?.status);
  const finalData = sbwOrganizerGetTournamentFinalData(tournament);
  const isPointable = Boolean(
    tournament?.countsForOrganizerRanking ||
    tournament?.counts_for_organizer_ranking ||
    tournament?.rankingEnabled ||
    tournament?.ranking_enabled ||
    tournament?.settings?.rankingEnabled ||
    tournament?.settings?.ranking_enabled ||
    tournament?.settings?.countsForOrganizerRanking ||
    tournament?.settings?.counts_for_organizer_ranking ||
    finalData?.rankingApplied ||
    finalData?.ranking_applied
  );

  if (status.className !== "finished") {
    return { label: status.label || "Em andamento", className: "live" };
  }

  return isPointable
    ? { label: "Pontuável", className: "pointable" }
    : { label: "Finalizado", className: "finished" };
}

function sbwOrganizerGetTournamentHistoryPlacements(tournament) {
  const finalData = sbwOrganizerGetTournamentFinalData(tournament);
  const candidates = [
    finalData.standings,
    finalData.placements,
    finalData.finalStandings,
    finalData.final_standings,
    finalData.results,
    tournament?.settings?.standings,
    tournament?.metadata?.standings
  ];

  const list = candidates.find((value) => Array.isArray(value)) || [];

  return list.slice(0, 3).map((row, index) => {
    const name = String(
      row?.nickname ||
      row?.name ||
      row?.playerName ||
      row?.player_name ||
      row?.teamName ||
      row?.team_name ||
      `Top ${index + 1}`
    ).trim();

    return {
      position: Number(row?.placement || row?.position || row?.rank || index + 1),
      name
    };
  });
}

function sbwOrganizerGetTournamentHistoryUrl(tournament) {
  const key = String(tournament?.slug || tournament?.id || tournament?.supabaseId || "").trim();
  return key ? `detalhe-torneio.html?id=${encodeURIComponent(key)}&view=resultados` : "#";
}

function sbwRenderOrganizerHistory(tournaments) {
  if (!sbwOrganizerHistoryList) return;

  const items = Array.isArray(tournaments) ? tournaments : [];
  const finished = items
    .filter((tournament) => sbwGetStatusInfo(tournament?.status).className === "finished")
    .sort((first, second) => new Date(second?.updatedAt || second?.updated_at || second?.date || 0) - new Date(first?.updatedAt || first?.updated_at || first?.date || 0));

  if (finished.length === 0) {
    sbwOrganizerHistoryList.innerHTML = `
      <div class="sbw-organizer-empty-state sbw-organizer-history-empty">
        <strong>Histórico em preparação</strong>
        <span>Os torneios finalizados deste organizador aparecerão aqui com campeão, jogo, data e acesso rápido aos resultados.</span>
      </div>
    `;
    return;
  }

  const pointableCount = finished.filter((tournament) => sbwOrganizerGetTournamentHistoryStatus(tournament).className === "pointable").length;

  sbwOrganizerHistoryList.innerHTML = `
    <div class="sbw-organizer-history-summary">
      <span><strong>${sbwOrganizerEscape(finished.length)}</strong> torneio${finished.length === 1 ? "" : "s"} finalizado${finished.length === 1 ? "" : "s"}</span>
      <span><strong>${sbwOrganizerEscape(pointableCount)}</strong> pontuável${pointableCount === 1 ? "" : "eis"}</span>
    </div>
    <div class="sbw-organizer-history-timeline">
      ${finished.map((tournament) => {
        const title = tournament?.name || tournament?.title || "Torneio finalizado";
        const game = tournament?.game || tournament?.gameName || tournament?.game_name || "Jogo a definir";
        const format = tournament?.formatName || tournament?.format_name || tournament?.format || "Formato a definir";
        const status = sbwOrganizerGetTournamentHistoryStatus(tournament);
        const champion = sbwOrganizerGetTournamentChampionLabel(tournament);
        const placements = sbwOrganizerGetTournamentHistoryPlacements(tournament);
        const url = sbwOrganizerGetTournamentHistoryUrl(tournament);

        return `
          <article class="sbw-organizer-history-card sbw-organizer-history-card--${sbwOrganizerEscape(status.className)}">
            <div class="sbw-organizer-history-card-main">
              <span class="sbw-organizer-history-status">${sbwOrganizerEscape(status.label)}</span>
              <h3>${sbwOrganizerEscape(title)}</h3>
              <p>${sbwOrganizerEscape(game)} · ${sbwOrganizerEscape(format)} · ${sbwOrganizerEscape(sbwGetOrganizerTournamentDateLabel(tournament))}</p>
            </div>
            <div class="sbw-organizer-history-card-result">
              <small>Campeão</small>
              <strong>${sbwOrganizerEscape(champion)}</strong>
              ${placements.length ? `
                <div class="sbw-organizer-history-podium">
                  ${placements.map((row) => `<span>${sbwOrganizerEscape(row.position)}º ${sbwOrganizerEscape(row.name)}</span>`).join("")}
                </div>
              ` : ""}
            </div>
            <a class="sbw-organizer-history-link" href="${sbwOrganizerEscape(url)}">Ver resultados</a>
          </article>
        `;
      }).join("")}
    </div>
  `;
}

function sbwFilterOrganizerTournaments() {
  const search = String(sbwOrganizerTournamentSearch?.value || "").trim().toLowerCase();
  const status = String(sbwOrganizerTournamentStatusFilter?.value || "all");

  document.querySelectorAll(".sbw-organizer-tournament-card").forEach((card) => {
    const cardName = card.dataset.name || "";
    const cardStatus = card.dataset.status || "";
    const matchesSearch = !search || cardName.includes(search);
    const matchesStatus = status === "all" || status === cardStatus;
    card.hidden = !(matchesSearch && matchesStatus);
  });
}

function sbwSelectOrganizerTab(tab, options = {}) {
  const safeTab = String(tab || "overview").replace("#", "");
  const button = document.querySelector(`[data-organizer-tab="${safeTab}"]`);

  if (!button) return false;

  document.querySelectorAll("[data-organizer-tab]").forEach((item) => {
    item.classList.toggle("is-active", item === button);
  });

  document.querySelectorAll("[data-organizer-panel]").forEach((panel) => {
    const isActive = panel.dataset.organizerPanel === safeTab;
    panel.hidden = !isActive;
    panel.classList.toggle("is-active", isActive);
  });

  if (options.updateHash) {
    history.replaceState(null, "", `#${safeTab}`);
  }

  return true;
}

function sbwBindOrganizerTabs() {
  document.querySelectorAll("[data-organizer-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      sbwSelectOrganizerTab(button.dataset.organizerTab, { updateHash: true });
    });
  });

  document.addEventListener("click", (event) => {
    const rankingSeasonButton = event.target.closest("[data-organizer-ranking-season]");

    if (rankingSeasonButton) {
      sbwOrganizerPageState.rankingSeasonFilter = sbwNormalizeOrganizerRankingSeasonKey(rankingSeasonButton.dataset.organizerRankingSeason || "all");
      if (sbwOrganizerPageState.organizer) {
        sbwRenderOrganizerRankings(sbwOrganizerPageState.organizer, sbwOrganizerPageState.rankingSnapshot);
      }
      return;
    }

    const rankingTypeButton = event.target.closest("[data-organizer-ranking-type]");

    if (rankingTypeButton) {
      const type = String(rankingTypeButton.dataset.organizerRankingType || "all");
      sbwOrganizerPageState.rankingTypeFilter = ["all", "players", "teams"].includes(type) ? type : "all";
      if (sbwOrganizerPageState.organizer) {
        sbwRenderOrganizerRankings(sbwOrganizerPageState.organizer, sbwOrganizerPageState.rankingSnapshot);
      }
      return;
    }

    const shortcut = event.target.closest("[data-organizer-tab-shortcut]");

    if (!shortcut) return;

    const tab = shortcut.dataset.organizerTabShortcut;

    if (sbwSelectOrganizerTab(tab, { updateHash: true })) {
      document.querySelector(`[data-organizer-tab="${tab}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });

  const requestedTab = sbwGetQueryParam("tab") || String(window.location.hash || "").replace("#", "");
  if (requestedTab) {
    sbwSelectOrganizerTab(requestedTab);
  }

  document.addEventListener("input", (event) => {
    const searchInput = event.target.closest("[data-organizer-ranking-search]");
    if (!searchInput) return;
    sbwOrganizerPageState.rankingSearch = String(searchInput.value || "");
    if (sbwOrganizerPageState.organizer) {
      sbwRenderOrganizerRankings(sbwOrganizerPageState.organizer, sbwOrganizerPageState.rankingSnapshot);
      const restoredInput = document.querySelector("[data-organizer-ranking-search]");
      if (restoredInput) {
        restoredInput.focus({ preventScroll: true });
        const end = String(restoredInput.value || "").length;
        try { restoredInput.setSelectionRange(end, end); } catch (error) { /* noop */ }
      }
    }
  });

  document.addEventListener("change", (event) => {
    const sortSelect = event.target.closest("[data-organizer-ranking-sort]");
    if (!sortSelect) return;
    const sort = String(sortSelect.value || "points");
    sbwOrganizerPageState.rankingSort = ["points", "name", "events"].includes(sort) ? sort : "points";
    if (sbwOrganizerPageState.organizer) {
      sbwRenderOrganizerRankings(sbwOrganizerPageState.organizer, sbwOrganizerPageState.rankingSnapshot);
    }
  });

  sbwOrganizerTournamentSearch?.addEventListener("input", sbwFilterOrganizerTournaments);
  sbwOrganizerTournamentStatusFilter?.addEventListener("change", sbwFilterOrganizerTournaments);
}

async function sbwLoadTournamentOrganizerPage() {
  sbwRenderOrganizerLoading();

  const slug = sbwGetQueryParam("slug") || sbwGetQueryParam("id");

  if (!slug) {
    sbwRenderOrganizerNotFound();
    return;
  }

  let organizer = null;
  let tournaments = [];
  let members = [];
  let access = null;

  try {
    organizer = await sbwGetTournamentOrganizerBySlugAsync(slug);
  } catch (error) {
    console.error("Erro ao buscar organizador:", error);
  }

  if (!organizer) {
    sbwRenderOrganizerNotFound();
    return;
  }

  try {
    tournaments = await sbwGetTournamentsByOrganizerAsync(organizer);
  } catch (error) {
    console.error("Erro ao buscar torneios do organizador:", error);
    tournaments = [];
  }

  try {
    members = await sbwGetTournamentOrganizerMembersAsync(organizer);
  } catch (error) {
    console.error("Erro ao buscar membros do organizador:", error);
    members = [];
  }

  access = await sbwGetOrganizerPublicAccess(organizer);
  sbwOrganizerPageState.organizer = organizer;
  sbwOrganizerPageState.tournaments = tournaments;
  sbwOrganizerPageState.members = members;
  sbwOrganizerPageState.access = access;
  sbwOrganizerPageState.rankingSeasonFilter = sbwNormalizeOrganizerRankingSeasonKey(sbwGetQueryParam("season") || sbwGetQueryParam("temporada") || "all");
  sbwOrganizerPageState.rankingTypeFilter = ["players", "teams", "all"].includes(String(sbwGetQueryParam("type") || sbwGetQueryParam("tipo") || "all"))
    ? String(sbwGetQueryParam("type") || sbwGetQueryParam("tipo") || "all")
    : "all";
  sbwOrganizerPageState.rankingSearch = String(sbwGetQueryParam("search") || sbwGetQueryParam("busca") || sbwGetQueryParam("q") || "");
  sbwOrganizerPageState.rankingSort = ["points", "name", "events"].includes(String(sbwGetQueryParam("sort") || sbwGetQueryParam("ordenar") || "points"))
    ? String(sbwGetQueryParam("sort") || sbwGetQueryParam("ordenar") || "points")
    : "points";
  sbwOrganizerPageState.rankingSnapshot = await sbwBuildOrganizerLiveRankingSnapshot(organizer);

  document.title = `${sbwGetOrganizerDisplayName(organizer)} | Organizador -SBW-`;

  if (sbwOrganizerStatusText) {
    sbwOrganizerStatusText.textContent = `${sbwGetOrganizerDisplayName(organizer)} · ${tournaments.length} torneio${tournaments.length === 1 ? "" : "s"} publicado${tournaments.length === 1 ? "" : "s"}.`;
  }

  sbwRenderOrganizerHero(organizer, tournaments, access);
  sbwRenderOrganizerNavActions(organizer, access);
  sbwRenderOrganizerRankings(organizer, sbwOrganizerPageState.rankingSnapshot);
  sbwRenderOrganizerStats(tournaments, members, organizer);
  sbwRenderOrganizerOverviewHighlights(organizer, tournaments, sbwOrganizerPageState.rankingSnapshot);
  sbwRenderOrganizerOverviewTournaments(tournaments);
  sbwRenderOrganizerTournamentsSummary(tournaments);
  sbwRenderOrganizerTournaments(tournaments);
  sbwRenderOrganizerSeasons(organizer, tournaments);
  sbwRenderOrganizerHistory(tournaments);
  sbwBindOrganizerTabs();
}

sbwLoadTournamentOrganizerPage();
