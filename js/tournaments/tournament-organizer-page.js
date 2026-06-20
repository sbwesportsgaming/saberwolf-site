const sbwOrganizerPageRoot = document.getElementById("organizerPageRoot");
const sbwOrganizerHero = document.getElementById("organizerHero");
const sbwOrganizerStats = document.getElementById("organizerStats");
const sbwOrganizerRecentTournaments = document.getElementById("organizerRecentTournaments");
const sbwOrganizerTournamentsGrid = document.getElementById("organizerTournamentsGrid");
const sbwOrganizerStatusText = document.getElementById("organizerStatusText");
const sbwOrganizerTournamentSearch = document.getElementById("organizerTournamentSearch");
const sbwOrganizerTournamentStatusFilter = document.getElementById("organizerTournamentStatusFilter");
const sbwOrganizerHistoryList = document.getElementById("organizerHistoryList");
const sbwOrganizerSeasonsGrid = document.getElementById("organizerSeasonsGrid");
const sbwOrganizerRankingsGrid = document.getElementById("organizerRankingsGrid");

const sbwOrganizerPageState = {
  organizer: null,
  tournaments: [],
  members: [],
  access: null
};

function sbwGetOrganizerInitials(organizer) {
  return String(organizer?.tag || organizer?.name || organizer?.displayName || "ORG")
    .trim()
    .slice(0, 4)
    .toUpperCase() || "ORG";
}

function sbwGetOrganizerDisplayName(organizer) {
  return organizer?.name || organizer?.displayName || organizer?.display_name || "Organizador";
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
    ""
  );
}

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
      const itemKeys = [item.id, item.slug, item.name, item.displayName]
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
  if (!access) {
    return false;
  }

  const role = String(access.memberRole || access.role || access.currentUserRole || "").toLowerCase();

  return Boolean(
    access.canCreateTournament === true ||
    access.can_create_tournaments === true ||
    ["owner", "admin", "manager", "organizer_admin", "tournament_admin"].includes(role)
  );
}

function sbwOrganizerCanCreateTournament(access) {
  if (!access) {
    return false;
  }

  const role = String(access.memberRole || access.role || access.currentUserRole || "").toLowerCase();

  return Boolean(
    access.canCreateTournament === true ||
    access.can_create_tournaments === true ||
    ["owner", "admin", "manager", "organizer_admin", "tournament_admin"].includes(role)
  );
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

function sbwRenderOrganizerHero(organizer, tournaments, access) {
  const name = sbwGetOrganizerDisplayName(organizer);
  const initials = sbwGetOrganizerInitials(organizer);
  const status = sbwGetOrganizerPublicStatusLabel(organizer);
  const games = Array.isArray(organizer?.games) ? organizer.games : [];
  const description = organizer?.description || "Organizador autorizado para publicar torneios na plataforma -SBW-.";
  const links = organizer?.links && typeof organizer.links === "object" ? organizer.links : {};
  const organizerSlug = organizer?.slug || organizer?.id || name;
  const canManage = sbwOrganizerCanManage(access);
  const canCreateTournament = sbwOrganizerCanCreateTournament(access);
  const createTournamentUrl = sbwGetOrganizerCreateTournamentUrl(organizer);
  const logoHTML = organizer?.logoUrl
    ? `<img src="${sbwOrganizerEscape(organizer.logoUrl)}" alt="Logo ${sbwOrganizerEscape(name)}">`
    : `<span>${sbwOrganizerEscape(initials)}</span>`;
  const bannerHTML = organizer?.bannerUrl
    ? `<img src="${sbwOrganizerEscape(organizer.bannerUrl)}" alt="" aria-hidden="true">`
    : "";
  const runningCount = tournaments.filter((tournament) => sbwGetStatusInfo(tournament?.status).className === "running").length;
  const openCount = tournaments.filter((tournament) => sbwGetStatusInfo(tournament?.status).className === "open").length;
  const finishedCount = tournaments.filter((tournament) => sbwGetStatusInfo(tournament?.status).className === "finished").length;
  const linkLabels = {
    website: "Site",
    discord: "Discord",
    instagram: "Instagram",
    youtube: "YouTube",
    twitch: "Twitch",
    x: "X/Twitter"
  };
  const linksHTML = Object.entries(links)
    .filter(([, url]) => Boolean(String(url || "").trim()))
    .map(([key, url]) => `<a href="${sbwOrganizerEscape(url)}" target="_blank" rel="noopener noreferrer">${sbwOrganizerEscape(linkLabels[key] || key)}</a>`)
    .join("");
  const manageHTML = canManage
    ? `<a class="sbw-organizer-action-btn" href="editar-organizador.html?slug=${encodeURIComponent(organizerSlug)}">Gerenciar organizador</a>`
    : "";
  const createTournamentHTML = canCreateTournament
    ? `<a class="sbw-organizer-action-btn sbw-organizer-action-btn--create" href="${sbwOrganizerEscape(createTournamentUrl)}">Criar Torneio</a>`
    : "";

  sbwSetOrganizerTheme(organizer);

  sbwOrganizerHero.innerHTML = `
    <div class="sbw-organizer-hero-cover">${bannerHTML}</div>
    <div class="sbw-organizer-hero-grid">
      <div class="sbw-organizer-identity">
        <div class="sbw-organizer-brand-row">
          <div class="sbw-organizer-logo">${logoHTML}</div>
          <div>
            <div class="sbw-organizer-badges">
              <span class="sbw-organizer-badge sbw-organizer-badge--primary">Organizador</span>
              <span class="sbw-organizer-badge">${sbwOrganizerEscape(status)}</span>
              ${organizer?.verified ? `<span class="sbw-organizer-badge">Verificado</span>` : ""}
              ${canManage ? `<span class="sbw-organizer-badge">Área liberada para sua conta</span>` : ""}
            </div>
            <h1>${sbwOrganizerEscape(name)}</h1>
          </div>
        </div>

        <p>${sbwOrganizerEscape(description)}</p>

        <div class="sbw-organizer-tags">
          <span class="sbw-organizer-tag">${sbwOrganizerEscape(organizer?.type || "Organizador de torneios")}</span>
          <span class="sbw-organizer-tag">${tournaments.length} torneio${tournaments.length === 1 ? "" : "s"}</span>
          ${games.slice(0, 5).map((game) => `<span class="sbw-organizer-tag">${sbwOrganizerEscape(game)}</span>`).join("")}
        </div>

        ${linksHTML ? `<div class="sbw-organizer-hero-links">${linksHTML}</div>` : ""}

        <div class="sbw-organizer-actions">
          <button class="sbw-organizer-action-btn" type="button" data-organizer-tab-shortcut="tournaments">Ver torneios</button>
          ${createTournamentHTML}
          ${manageHTML}
        </div>
      </div>

      <aside class="sbw-organizer-hero-side" aria-label="Resumo do organizador">
        <article class="sbw-organizer-hero-metric"><span>Torneios ativos</span><strong>${openCount + runningCount}</strong></article>
        <article class="sbw-organizer-hero-metric"><span>Finalizados</span><strong>${finishedCount}</strong></article>
        <article class="sbw-organizer-hero-metric"><span>Temporada atual</span><strong>Beta</strong></article>
      </aside>
    </div>
  `;
}

function sbwRenderOrganizerStats(tournaments, members) {
  if (!sbwOrganizerStats) {
    return;
  }

  const runningCount = tournaments.filter((tournament) => sbwGetStatusInfo(tournament?.status).className === "running").length;
  const openCount = tournaments.filter((tournament) => sbwGetStatusInfo(tournament?.status).className === "open").length;
  const finishedCount = tournaments.filter((tournament) => sbwGetStatusInfo(tournament?.status).className === "finished").length;
  const uniqueGames = new Set(tournaments.map((tournament) => tournament?.game || tournament?.gameName).filter(Boolean));

  sbwOrganizerStats.innerHTML = `
    <article><span>Torneios ativos</span><strong>${openCount + runningCount}</strong></article>
    <article><span>Torneios finalizados</span><strong>${finishedCount}</strong></article>
    <article><span>Jogos/modalidades</span><strong>${uniqueGames.size || 0}</strong></article>
    <article><span>Staff público</span><strong>${members.length}</strong></article>
    <article><span>Temporadas</span><strong>0</strong></article>
    <article><span>Rankings ativos</span><strong>0</strong></article>
  `;
}

function sbwRenderOrganizerTournamentCard(tournament) {
  const status = sbwGetStatusInfo(tournament?.status);
  const format = sbwGetTournamentFormat(tournament);
  const detailUrl = `detalhe-torneio.html?id=${encodeURIComponent(tournament.id || tournament.slug || tournament.supabaseId)}`;
  const cover = sbwGetOrganizerTournamentCover(tournament);

  return `
    <article class="sbw-organizer-tournament-card" data-status="${sbwOrganizerEscape(status.className)}" data-name="${sbwOrganizerEscape(String(tournament?.name || tournament?.title || "").toLowerCase())}">
      <div class="sbw-organizer-tournament-cover">
        ${cover ? `<img src="${sbwOrganizerEscape(cover)}" alt="" aria-hidden="true">` : ""}
      </div>
      <div class="sbw-organizer-tournament-body">
        <div class="sbw-organizer-badges">
          <span class="status-pill ${sbwOrganizerEscape(status.className)}">${sbwOrganizerEscape(status.label)}</span>
          <span class="sbw-organizer-badge">${sbwOrganizerEscape(tournament?.game || tournament?.gameName || "Jogo a definir")}</span>
        </div>
        <h3>${sbwOrganizerEscape(tournament?.name || tournament?.title || "Torneio sem nome")}</h3>
        <p>${sbwOrganizerEscape(sbwGetDescription(tournament))}</p>
        <div class="sbw-organizer-meta-grid">
          <div><span>Formato</span><strong>${sbwOrganizerEscape(sbwGetFormatLabel(format))}</strong></div>
          <div><span>Participantes</span><strong>${sbwOrganizerEscape(sbwGetParticipantsLabel(tournament))}</strong></div>
          <div><span>Início</span><strong>${sbwOrganizerEscape(sbwGetOrganizerTournamentDateLabel(tournament))}</strong></div>
          <div><span>Origem</span><strong>${sbwOrganizerEscape(tournament?.source === "supabase" ? "Supabase" : "Local")}</strong></div>
        </div>
        <a class="sbw-organizer-action-btn" href="${sbwOrganizerEscape(detailUrl)}">Ver torneio</a>
      </div>
    </article>
  `;
}

function sbwRenderOrganizerTournaments(tournaments) {
  if (!sbwOrganizerTournamentsGrid) {
    return;
  }

  if (!Array.isArray(tournaments) || tournaments.length === 0) {
    sbwOrganizerTournamentsGrid.innerHTML = `<div class="sbw-organizer-empty-state">Este organizador ainda não publicou torneios.</div>`;
    return;
  }

  sbwOrganizerTournamentsGrid.innerHTML = tournaments.map(sbwRenderOrganizerTournamentCard).join("");
}

function sbwRenderOrganizerRecentTournaments(tournaments) {
  if (!sbwOrganizerRecentTournaments) {
    return;
  }

  const recent = [...tournaments].slice(0, 4);

  if (recent.length === 0) {
    sbwOrganizerRecentTournaments.innerHTML = `<div class="sbw-organizer-empty-state">Nenhum torneio publicado ainda.</div>`;
    return;
  }

  sbwOrganizerRecentTournaments.innerHTML = recent.map((tournament) => {
    const status = sbwGetStatusInfo(tournament?.status);
    return `
      <a class="sbw-organizer-compact-item" href="detalhe-torneio.html?id=${encodeURIComponent(tournament.id || tournament.slug || tournament.supabaseId)}">
        <strong>${sbwOrganizerEscape(tournament?.name || tournament?.title || "Torneio sem nome")}</strong>
        <span>${sbwOrganizerEscape(status.label)} · ${sbwOrganizerEscape(tournament?.game || tournament?.gameName || "Jogo a definir")}</span>
      </a>
    `;
  }).join("");
}

function sbwRenderOrganizerHistory(tournaments) {
  if (!sbwOrganizerHistoryList) {
    return;
  }

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

    if (!shortcut) {
      return;
    }

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
  sbwRenderOrganizerStats(tournaments, members);
  sbwRenderOrganizerRecentTournaments(tournaments);
  sbwRenderOrganizerTournaments(tournaments);
  sbwRenderOrganizerHistory(tournaments);
  sbwBindOrganizerTabs();
}

sbwLoadTournamentOrganizerPage();
