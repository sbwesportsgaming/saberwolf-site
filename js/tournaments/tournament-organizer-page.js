const sbwOrganizerPageRoot = document.getElementById("organizerPageRoot");
const sbwOrganizerHero = document.getElementById("organizerHero");
const sbwOrganizerStats = document.getElementById("organizerStats");
const sbwOrganizerTournamentsGrid = document.getElementById("organizerTournamentsGrid");
const sbwOrganizerMembersGrid = document.getElementById("organizerMembersGrid");
const sbwOrganizerStatusText = document.getElementById("organizerStatusText");

function sbwGetOrganizerInitials(organizer) {
  return String(organizer?.tag || organizer?.name || "ORG")
    .trim()
    .slice(0, 4)
    .toUpperCase();
}

function sbwGetOrganizerDisplayName(organizer) {
  return organizer?.name || organizer?.displayName || "Organizador";
}

function sbwGetOrganizerPageSourceLabel(organizer) {
  if (organizer?.source === "supabase") {
    return "Supabase";
  }

  if (organizer?.source === "demo") {
    return "Demo";
  }

  return "Local";
}

function sbwGetOrganizerPageStatusLabel(organizer) {
  if (typeof sbwGetOrganizerStatusLabel === "function") {
    return sbwGetOrganizerStatusLabel(organizer?.status);
  }

  return organizer?.statusLabel || "Ativo";
}

function sbwGetOrganizerTournamentStartLabel(tournament) {
  if (tournament?.date && tournament?.time) {
    return `${tournament.date} às ${tournament.time}`;
  }

  if (tournament?.date) {
    return tournament.date;
  }

  return sbwFormatDate(sbwGetStartDate(tournament));
}

function sbwRenderOrganizerLoading() {
  if (sbwOrganizerHero) {
    sbwOrganizerHero.innerHTML = `
      <div class="organizer-profile-loading">
        Carregando organizador...
      </div>
    `;
  }
}

function sbwRenderOrganizerNotFound() {
  if (sbwOrganizerPageRoot) {
    sbwOrganizerPageRoot.innerHTML = `
      <section class="tournament-section-block organizer-profile-empty">
        <span class="section-label">Organizador</span>
        <h2>Organizador não encontrado</h2>
        <p>
          Não encontramos um organizador com esse slug/id. Volte para a central de torneios
          e escolha um organizador listado.
        </p>
        <a class="organizer-profile-btn" href="torneios.html">Voltar para Torneios</a>
      </section>
    `;
  }
}

function sbwRenderOrganizerHero(organizer, tournaments) {
  const name = sbwGetOrganizerDisplayName(organizer);
  const initials = sbwGetOrganizerInitials(organizer);
  const status = sbwGetOrganizerPageStatusLabel(organizer);
  const games = Array.isArray(organizer?.games) ? organizer.games : [];
  const description = organizer?.description || "Organizador autorizado para publicar torneios na plataforma -SBW-.";
  const logoHTML = organizer?.logoUrl
    ? `<img src="${sbwEscapeHTML(organizer.logoUrl)}" alt="Logo ${sbwEscapeHTML(name)}">`
    : `<span>${sbwEscapeHTML(initials || "ORG")}</span>`;
  const bannerHTML = organizer?.bannerUrl
    ? `<img class="organizer-profile-cover-image" src="${sbwEscapeHTML(organizer.bannerUrl)}" alt="" aria-hidden="true">`
    : "";
  const themeStyle = typeof sbwGetTournamentOrganizerThemeStyle === "function"
    ? sbwGetTournamentOrganizerThemeStyle(organizer)
    : "";
  const organizerSlug = organizer?.slug || organizer?.id || name;
  const editUrl = `editar-organizador.html?slug=${encodeURIComponent(organizerSlug)}`;
  const links = organizer?.links && typeof organizer.links === "object" ? organizer.links : {};
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
    .map(([key, url]) => {
      return `<a href="${sbwEscapeHTML(url)}" target="_blank" rel="noopener noreferrer">${sbwEscapeHTML(linkLabels[key] || key)}</a>`;
    })
    .join("");

  if (sbwOrganizerPageRoot) {
    sbwOrganizerPageRoot.setAttribute("style", themeStyle);
  }

  if (sbwOrganizerHero) {
    sbwOrganizerHero.setAttribute("style", themeStyle);
  }

  sbwOrganizerHero.innerHTML = `
    <div class="organizer-profile-cover">
      ${bannerHTML}
      <div class="organizer-profile-cover-overlay"></div>
    </div>

    <div class="organizer-profile-main-card">
      <div class="organizer-profile-logo">
        ${logoHTML}
      </div>

      <div class="organizer-profile-heading">
        <div class="organizer-profile-kicker">
          <span>${sbwEscapeHTML(sbwGetOrganizerPageSourceLabel(organizer))}</span>
          <span>${sbwEscapeHTML(status)}</span>
          ${organizer?.verified ? "<span>Verificado</span>" : ""}
        </div>

        <h2>${sbwEscapeHTML(name)}</h2>
        <p>${sbwEscapeHTML(description)}</p>

        <div class="organizer-profile-tags">
          <span>${sbwEscapeHTML(organizer?.type || "Organizador de torneios")}</span>
          <span>${tournaments.length} torneio${tournaments.length === 1 ? "" : "s"}</span>
          <span>Identidade visual própria</span>
          ${organizer?.localOverride ? "<span>Ajuste local ativo</span>" : ""}
          ${games.map((game) => `<span>${sbwEscapeHTML(game)}</span>`).join("")}
        </div>

        ${linksHTML ? `<div class="organizer-profile-links">${linksHTML}</div>` : ""}

        <div class="organizer-profile-actions">
          <a class="organizer-profile-btn" href="${sbwEscapeHTML(editUrl)}">Editar organizador</a>
          <a class="organizer-profile-btn" href="torneios.html">Voltar para Torneios</a>
        </div>
      </div>
    </div>
  `;
}

function sbwRenderOrganizerStats(organizer, tournaments, members) {
  const runningCount = tournaments.filter((tournament) => {
    return sbwGetStatusInfo(tournament?.status).className === "running";
  }).length;

  const openCount = tournaments.filter((tournament) => {
    return sbwGetStatusInfo(tournament?.status).className === "open";
  }).length;

  const finishedCount = tournaments.filter((tournament) => {
    return sbwGetStatusInfo(tournament?.status).className === "finished";
  }).length;

  sbwOrganizerStats.innerHTML = `
    <article>
      <span>Total de torneios</span>
      <strong>${tournaments.length}</strong>
    </article>

    <article>
      <span>Inscrições abertas</span>
      <strong>${openCount}</strong>
    </article>

    <article>
      <span>Em andamento</span>
      <strong>${runningCount}</strong>
    </article>

    <article>
      <span>Encerrados</span>
      <strong>${finishedCount}</strong>
    </article>

    <article>
      <span>Gestores/membros</span>
      <strong>${members.length}</strong>
    </article>
  `;
}

function sbwRenderOrganizerTournamentCard(tournament) {
  const status = sbwGetStatusInfo(tournament?.status);
  const format = sbwGetTournamentFormat(tournament);
  const detailUrl = `detalhe-torneio.html?id=${encodeURIComponent(tournament.id || tournament.slug || tournament.supabaseId)}`;

  return `
    <article class="organizer-tournament-card">
      <div class="organizer-tournament-topline">
        <span class="status-pill ${sbwEscapeHTML(status.className)}">${sbwEscapeHTML(status.label)}</span>
        <span>${sbwEscapeHTML(tournament?.source === "supabase" ? "Supabase" : tournament?.source === "demo" ? "Demo" : "Local")}</span>
      </div>

      <h3>${sbwEscapeHTML(tournament?.name || tournament?.title || "Torneio sem nome")}</h3>
      <p>${sbwEscapeHTML(sbwGetDescription(tournament))}</p>

      <div class="organizer-tournament-meta">
        <div>
          <span>Jogo</span>
          <strong>${sbwEscapeHTML(tournament?.game || tournament?.gameName || "A definir")}</strong>
        </div>
        <div>
          <span>Formato</span>
          <strong>${sbwEscapeHTML(sbwGetFormatLabel(format))}</strong>
        </div>
        <div>
          <span>Participantes</span>
          <strong>${sbwEscapeHTML(sbwGetParticipantsLabel(tournament))}</strong>
        </div>
        <div>
          <span>Início</span>
          <strong>${sbwEscapeHTML(sbwGetOrganizerTournamentStartLabel(tournament))}</strong>
        </div>
      </div>

      <a class="organizer-profile-btn" href="${sbwEscapeHTML(detailUrl)}">Ver torneio</a>
    </article>
  `;
}

function sbwRenderOrganizerTournaments(tournaments) {
  if (!sbwOrganizerTournamentsGrid) {
    return;
  }

  if (!Array.isArray(tournaments) || tournaments.length === 0) {
    sbwOrganizerTournamentsGrid.innerHTML = `
      <div class="organizer-profile-empty-card">
        Nenhum torneio vinculado a este organizador foi encontrado ainda.
      </div>
    `;
    return;
  }

  sbwOrganizerTournamentsGrid.innerHTML = tournaments
    .map(sbwRenderOrganizerTournamentCard)
    .join("");
}

function sbwRenderOrganizerMembers(members) {
  if (!sbwOrganizerMembersGrid) {
    return;
  }

  if (!Array.isArray(members) || members.length === 0) {
    sbwOrganizerMembersGrid.innerHTML = `
      <div class="organizer-profile-empty-card">
        Nenhum gestor/membro público foi encontrado ainda.
      </div>
    `;
    return;
  }

  sbwOrganizerMembersGrid.innerHTML = members.map((member) => {
    const initials = String(member?.name || "M")
      .trim()
      .slice(0, 2)
      .toUpperCase();
    const avatarHTML = member?.avatarUrl
      ? `<img src="${sbwEscapeHTML(member.avatarUrl)}" alt="${sbwEscapeHTML(member.name)}">`
      : `<span>${sbwEscapeHTML(initials)}</span>`;

    return `
      <article class="organizer-member-card">
        <div class="organizer-member-avatar">
          ${avatarHTML}
        </div>
        <div>
          <strong>${sbwEscapeHTML(member?.name || "Membro autorizado")}</strong>
          <span>${sbwEscapeHTML(member?.roleLabel || member?.role || "Membro")}</span>
        </div>
      </article>
    `;
  }).join("");
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

  document.title = `${sbwGetOrganizerDisplayName(organizer)} | Organizador -SBW-`;

  if (sbwOrganizerStatusText) {
    sbwOrganizerStatusText.textContent = `${sbwGetOrganizerDisplayName(organizer)} carregado com ${tournaments.length} torneio${tournaments.length === 1 ? "" : "s"} vinculado${tournaments.length === 1 ? "" : "s"}.`;
  }

  sbwRenderOrganizerHero(organizer, tournaments);
  sbwRenderOrganizerStats(organizer, tournaments, members);
  sbwRenderOrganizerTournaments(tournaments);
  sbwRenderOrganizerMembers(members);
}

sbwLoadTournamentOrganizerPage();
