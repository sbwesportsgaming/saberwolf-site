const sbwOrganizerPageRoot = document.getElementById("organizerPageRoot");
const sbwOrganizerHero = document.getElementById("organizerHero");
const sbwOrganizerStats = document.getElementById("organizerStats");
const sbwOrganizerOverviewTournaments = document.getElementById("organizerOverviewTournaments");
const sbwOrganizerTournamentsGrid = document.getElementById("organizerTournamentsGrid");
const sbwOrganizerStatusText = document.getElementById("organizerStatusText");
const sbwOrganizerTournamentSearch = document.getElementById("organizerTournamentSearch");
const sbwOrganizerTournamentStatusFilter = document.getElementById("organizerTournamentStatusFilter");
const sbwOrganizerHistoryList = document.getElementById("organizerHistoryList");
const sbwOrganizerSeasonsGrid = document.getElementById("organizerSeasonsGrid");
const sbwOrganizerRankingsGrid = document.getElementById("organizerRankingsGrid");
const sbwOrganizerOverviewRankingGrid = document.getElementById("organizerOverviewRankingGrid");
const sbwOrganizerNavActions = document.getElementById("organizerNavActions");

const sbwOrganizerPageState = {
  organizer: null,
  tournaments: [],
  members: [],
  access: null
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

function sbwGetOrganizerRankingRows(organizer, type) {
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
        return source[key];
      }
    }
  }

  return [];
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

function sbwRenderOrganizerRankingTable(organizer, type) {
  const rows = sbwGetOrganizerRankingRows(organizer, type);
  const topRows = [...rows]
    .sort((first, second) => sbwGetOrganizerRankingPoints(second) - sbwGetOrganizerRankingPoints(first))
    .slice(0, 5);
  const isTeams = type === "teams";
  const title = isTeams ? "Equipes" : "Jogadores";
  const label = isTeams ? "Equipe" : "Jogador";
  const emptyText = isTeams
    ? "Equipes aparecerão quando houver pontuação."
    : "Jogadores aparecerão quando houver pontuação.";

  const rowsHTML = topRows.length
    ? topRows.map((row, index) => {
        const currentPosition = Number(row.position ?? row.rank ?? row.currentPosition ?? row.current_position ?? index + 1);
        const safePosition = Number.isFinite(currentPosition) && currentPosition > 0 ? currentPosition : index + 1;
        const name = row.name || row.displayName || row.display_name || row.teamName || row.playerName || row.username || row.slug || "Participante";
        return `
          <tr>
            <td>${sbwRenderOrganizerRankingPosition(row, safePosition)}</td>
            <td class="sbw-organizer-ranking-name">${sbwOrganizerEscape(name)}</td>
            <td>${sbwRenderOrganizerRankingPoints(row)}</td>
          </tr>
        `;
      }).join("")
    : `<tr><td colspan="3" class="sbw-organizer-ranking-empty">${emptyText}</td></tr>`;

  return `
    <article class="sbw-organizer-ranking-card sbw-organizer-ranking-card--compact">
      <div class="sbw-organizer-ranking-head">
        <div>
          <span class="sbw-organizer-eyebrow">Ranking</span>
          <h3>${title}</h3>
        </div>
      </div>
      <div class="sbw-organizer-ranking-table-wrap">
        <table class="sbw-organizer-ranking-table sbw-organizer-ranking-table--compact">
          <thead>
            <tr>
              <th>Pos.</th>
              <th>${label}</th>
              <th>Pontos</th>
            </tr>
          </thead>
          <tbody>${rowsHTML}</tbody>
        </table>
      </div>
    </article>
  `;
}

function sbwRenderOrganizerRankings(organizer) {
  const html = `
    ${sbwRenderOrganizerRankingTable(organizer, "players")}
    ${sbwRenderOrganizerRankingTable(organizer, "teams")}
  `;

  if (sbwOrganizerOverviewRankingGrid) {
    sbwOrganizerOverviewRankingGrid.innerHTML = html;
  }

  if (sbwOrganizerRankingsGrid) {
    sbwOrganizerRankingsGrid.innerHTML = html;
  }
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

function sbwRenderOrganizerSeasons(organizer, tournaments) {
  if (!sbwOrganizerSeasonsGrid) return;

  sbwOrganizerSeasonsGrid.innerHTML = `
    <div class="sbw-organizer-empty-state">As temporadas deste organizador aparecerão aqui quando forem cadastradas.</div>
  `;
}

function sbwRenderOrganizerHistory(tournaments) {
  if (!sbwOrganizerHistoryList) return;

  const finished = tournaments.filter((tournament) => sbwGetStatusInfo(tournament?.status).className === "finished");

  if (finished.length === 0) {
    sbwOrganizerHistoryList.innerHTML = `<div class="sbw-organizer-empty-state">O histórico aparecerá após os primeiros torneios finalizados.</div>`;
    return;
  }

  sbwOrganizerHistoryList.innerHTML = finished.map((tournament) => {
    return `
      <article class="sbw-organizer-history-item">
        <strong>${sbwOrganizerEscape(tournament?.name || tournament?.title || "Torneio finalizado")}</strong>
        <span>${sbwOrganizerEscape(sbwGetOrganizerTournamentDateLabel(tournament))} · ${sbwOrganizerEscape(tournament?.game || tournament?.gameName || "Jogo a definir")}</span>
      </article>
    `;
  }).join("");
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

function sbwBindOrganizerTabs() {
  document.querySelectorAll("[data-organizer-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      const tab = button.dataset.organizerTab;

      document.querySelectorAll("[data-organizer-tab]").forEach((item) => {
        item.classList.toggle("is-active", item === button);
      });

      document.querySelectorAll("[data-organizer-panel]").forEach((panel) => {
        const isActive = panel.dataset.organizerPanel === tab;
        panel.hidden = !isActive;
        panel.classList.toggle("is-active", isActive);
      });
    });
  });

  document.addEventListener("click", (event) => {
    const shortcut = event.target.closest("[data-organizer-tab-shortcut]");

    if (!shortcut) return;

    const tab = shortcut.dataset.organizerTabShortcut;
    const button = document.querySelector(`[data-organizer-tab="${tab}"]`);

    if (button) {
      button.click();
      button.scrollIntoView({ behavior: "smooth", block: "center" });
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

  document.title = `${sbwGetOrganizerDisplayName(organizer)} | Organizador -SBW-`;

  if (sbwOrganizerStatusText) {
    sbwOrganizerStatusText.textContent = `${sbwGetOrganizerDisplayName(organizer)} · ${tournaments.length} torneio${tournaments.length === 1 ? "" : "s"} publicado${tournaments.length === 1 ? "" : "s"}.`;
  }

  sbwRenderOrganizerHero(organizer, tournaments, access);
  sbwRenderOrganizerNavActions(organizer, access);
  sbwRenderOrganizerRankings(organizer);
  sbwRenderOrganizerStats(tournaments, members, organizer);
  sbwRenderOrganizerOverviewTournaments(tournaments);
  sbwRenderOrganizerTournaments(tournaments);
  sbwRenderOrganizerSeasons(organizer, tournaments);
  sbwRenderOrganizerHistory(tournaments);
  sbwBindOrganizerTabs();
}

sbwLoadTournamentOrganizerPage();
