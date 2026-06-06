const sbwPublicTournamentGrid = document.getElementById("publicTournamentGrid");
const sbwTournamentOrganizersGrid = document.getElementById("tournamentOrganizersGrid");
const sbwTournamentOrganizerCount = document.getElementById("tournamentOrganizerCount");
const sbwTournamentFilter = document.getElementById("tournamentFilter");
const sbwTournamentCount = document.getElementById("tournamentCount");

let sbwTournamentListRenderRequest = 0;

function sbwNormalizeTournamentFormatValue(format) {
  return String(format || "")
    .trim()
    .toLowerCase()
    .replaceAll("_", "-");
}

function sbwGetTournamentComparableFormat(tournament) {
  return sbwNormalizeTournamentFormatValue(sbwGetTournamentFormat(tournament));
}

function sbwGetTournamentSourceLabel(tournament) {
  if (tournament?.source === "supabase") {
    return "Publicado no Supabase";
  }

  if (tournament?.source === "demo") {
    return "Demo pública";
  }

  if (tournament?.source === "local") {
    return "Criado localmente";
  }

  return "Publicado";
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
    return "Supabase";
  }

  if (organizer?.source === "demo") {
    return "Demo";
  }

  return "Local";
}

function sbwRenderTournamentOrganizerCard(organizer, tournaments = []) {
  const tournamentCount = sbwCountTournamentsByOrganizer(organizer, tournaments);
  const tags = Array.isArray(organizer?.games)
    ? organizer.games.slice(0, 3)
    : [];
  const initials = String(organizer?.tag || organizer?.name || "ORG")
    .trim()
    .slice(0, 4)
    .toUpperCase();
  const status = typeof sbwGetOrganizerStatusLabel === "function"
    ? sbwGetOrganizerStatusLabel(organizer?.status)
    : (organizer?.statusLabel || "Ativo");
  const name = organizer?.name || organizer?.displayName || "Organizador";
  const description = organizer?.description || "Organizador autorizado para publicar torneios na plataforma -SBW-.";
  const organizerSlug = organizer?.slug || organizer?.id || name;
  const organizerUrl = `organizador.html?slug=${encodeURIComponent(organizerSlug)}`;
  const logoHTML = organizer?.logoUrl
    ? `<img src="${sbwEscapeHTML(organizer.logoUrl)}" alt="Logo ${sbwEscapeHTML(name)}">`
    : `<span>${sbwEscapeHTML(initials || "ORG")}</span>`;
  const bannerHTML = organizer?.bannerUrl
    ? `<img class="tournament-organizer-cover-image" src="${sbwEscapeHTML(organizer.bannerUrl)}" alt="" aria-hidden="true">`
    : "";
  const themeStyle = typeof sbwGetTournamentOrganizerThemeStyle === "function"
    ? sbwGetTournamentOrganizerThemeStyle(organizer)
    : "";

  return `
    <article class="tournament-organizer-card" style="${sbwEscapeHTML(themeStyle)}">
      <div class="tournament-organizer-cover">
        ${bannerHTML}
        <span>${sbwEscapeHTML(sbwGetOrganizerSourceLabel(organizer))}</span>
      </div>

      <div class="tournament-organizer-content">
        <div class="tournament-organizer-head">
          <div class="tournament-organizer-logo">
            ${logoHTML}
          </div>

          <div>
            <strong>${sbwEscapeHTML(name)}</strong>
            <small>${sbwEscapeHTML(organizer?.type || "Organizador de torneios")}</small>
          </div>
        </div>

        <p>${sbwEscapeHTML(description)}</p>

        <div class="tournament-organizer-badges">
          <span>${sbwEscapeHTML(status)}</span>
          ${organizer?.verified ? "<span>Verificado</span>" : ""}
          <span>${tournamentCount} torneio${tournamentCount === 1 ? "" : "s"}</span>
        </div>

        ${
          tags.length > 0
            ? `<div class="tournament-organizer-tags">${tags.map((tag) => `<span>${sbwEscapeHTML(tag)}</span>`).join("")}</div>`
            : ""
        }

        <div class="tournament-organizer-actions">
          <a href="${sbwEscapeHTML(organizerUrl)}">
            Ver organizador
          </a>
        </div>
      </div>
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

  if (!Array.isArray(organizers) || organizers.length === 0) {
    sbwTournamentOrganizersGrid.innerHTML = `
      <div class="empty-tournament-state">
        Nenhum organizador publicado foi encontrado ainda.
      </div>
    `;
  } else {
    sbwTournamentOrganizersGrid.innerHTML = organizers
      .map((organizer) => sbwRenderTournamentOrganizerCard(organizer, tournaments))
      .join("");
  }

  if (sbwTournamentOrganizerCount) {
    sbwTournamentOrganizerCount.textContent = organizers.length;
  }
}

function sbwGetTournamentStartLabel(tournament) {
  if (tournament?.source === "supabase") {
    if (tournament.date && tournament.time) {
      return `${tournament.date} às ${tournament.time}`;
    }

    if (tournament.date) {
      return tournament.date;
    }
  }

  return sbwFormatDate(sbwGetStartDate(tournament));
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

function sbwTournamentMatchesFilter(tournament, filter) {
  if (filter === "all") {
    return true;
  }

  const status = sbwGetStatusInfo(tournament?.status).className;
  const format = sbwGetTournamentComparableFormat(tournament);

  if (["open", "running", "finished", "draft"].includes(filter)) {
    return status === filter;
  }

  if (["groups-playoffs", "league", "double-elimination"].includes(filter)) {
    return format === filter;
  }

  if (filter === "fighting-games" || filter === "fps") {
    return sbwGetTournamentCategory(tournament) === filter;
  }

  return true;
}

function sbwRenderTournamentCard(tournament) {
  const status = sbwGetStatusInfo(tournament?.status);
  const format = sbwGetTournamentComparableFormat(tournament);
  const participantsLabel = sbwGetParticipantsLabel(tournament);
  const startLabel = sbwGetTournamentStartLabel(tournament);
  const platformLabel = sbwGetPlatformLabel(tournament);
  const matchFormat = sbwGetMatchFormat(tournament);
  const detailUrl = `detalhe-torneio.html?id=${encodeURIComponent(tournament.id)}`;
  const alreadyRegistered = sbwHasRegistration(tournament.id);

  const matchFormatHTML = matchFormat
    ? `<span>${sbwEscapeHTML(matchFormat)}</span>`
    : "";

  return `
    <article
      class="public-tournament-card tournament-item"
      data-status="${sbwEscapeHTML(status.className)}"
      data-format="${sbwEscapeHTML(format || "")}"
      data-category="${sbwEscapeHTML(sbwGetTournamentCategory(tournament))}"
    >
      <div class="public-tournament-banner">
        <span>${sbwEscapeHTML(sbwGetTournamentSourceLabel(tournament))}</span>
      </div>

      <div class="public-tournament-card-content">

        <span class="status-pill ${sbwEscapeHTML(status.className)}">
          ${sbwEscapeHTML(status.label)}
        </span>

        ${
          alreadyRegistered
            ? `<span class="status-pill registration">Inscrição simulada</span>`
            : ""
        }

        <h3>
          ${sbwEscapeHTML(tournament.name || tournament.title || "Torneio sem nome")}
        </h3>

        <p>
          ${sbwEscapeHTML(sbwGetDescription(tournament))}
        </p>

        <div class="public-tournament-meta">

          <div>
            <span>Jogo</span>
            <strong>${sbwEscapeHTML(tournament.game || tournament.gameName || "A definir")}</strong>
          </div>

          <div>
            <span>Formato</span>
            <strong>${sbwEscapeHTML(sbwGetFormatLabel(format))}</strong>
          </div>

          <div>
            <span>Participantes</span>
            <strong>${sbwEscapeHTML(participantsLabel)}</strong>
          </div>

          <div>
            <span>Início</span>
            <strong>${sbwEscapeHTML(startLabel)}</strong>
          </div>

        </div>

        <div class="public-tournament-tags">
          <span>Organizador: ${sbwEscapeHTML(sbwGetOrganizerName(tournament))}</span>
          <span>${sbwEscapeHTML(platformLabel)}</span>
          ${matchFormatHTML}
        </div>

        <div class="public-tournament-actions">

          <a class="profile-btn" href="${sbwEscapeHTML(detailUrl)}">
            Ver torneio
          </a>

          <a href="${sbwEscapeHTML(detailUrl)}#inscricao" class="public-card-btn secondary">
            ${alreadyRegistered ? "Ver inscrição" : "Inscrever-se"}
          </a>

        </div>

      </div>
    </article>
  `;
}

function sbwRenderTournamentSection(title, label, description, tournaments, emptyMessage) {
  return `
    <section class="public-tournament-group">

      <div class="public-tournament-group-header">

        <div>
          <span>${sbwEscapeHTML(label)}</span>
          <h3>${sbwEscapeHTML(title)}</h3>
          <p>${sbwEscapeHTML(description)}</p>
        </div>

        <strong class="public-tournament-group-count">
          ${tournaments.length} torneio${tournaments.length === 1 ? "" : "s"}
        </strong>

      </div>

      ${
        tournaments.length > 0
          ? `
            <div class="public-tournament-subgrid">
              ${tournaments.map(sbwRenderTournamentCard).join("")}
            </div>
          `
          : `
            <div class="empty-tournament-state">
              ${sbwEscapeHTML(emptyMessage)}
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

async function sbwRenderTournamentsListPage() {
  const currentRequest = ++sbwTournamentListRenderRequest;

  if (!sbwPublicTournamentGrid) {
    console.error("publicTournamentGrid não encontrado.");
    return;
  }

  const filter = sbwTournamentFilter ? sbwTournamentFilter.value : "all";

  sbwPublicTournamentGrid.innerHTML = `
    <div class="empty-tournament-state">
      Carregando torneios...
    </div>
  `;

  let tournaments = [];

  try {
    tournaments = await sbwLoadTournamentsForListPage();
  } catch (error) {
    console.error("Erro ao carregar torneios:", error);
    tournaments = sbwGetAllTournaments();
  }

  if (currentRequest !== sbwTournamentListRenderRequest) {
    return;
  }

  await sbwRenderTournamentOrganizers(tournaments);

  const filteredTournaments = tournaments.filter((tournament) => {
    return sbwTournamentMatchesFilter(tournament, filter);
  });

  const supabaseTournaments = filteredTournaments.filter((tournament) => {
    return tournament.source === "supabase";
  });

  const localTournaments = filteredTournaments.filter((tournament) => {
    return tournament.source === "local";
  });

  const demoTournaments = filteredTournaments.filter((tournament) => {
    return tournament.source === "demo";
  });

  if (filteredTournaments.length === 0) {
    sbwPublicTournamentGrid.innerHTML = `
      <div class="empty-tournament-state">
        Nenhum torneio encontrado para o filtro selecionado.
      </div>
    `;
  } else {
    const sections = [];

    if (supabaseTournaments.length > 0) {
      sections.push(
        sbwRenderTournamentSection(
          "Torneios publicados",
          "Supabase conectado",
          "Eventos carregados diretamente do banco Supabase da SaberWolf.",
          supabaseTournaments,
          "Nenhum torneio publicado foi encontrado no Supabase."
        )
      );
    }

    if (localTournaments.length > 0 || supabaseTournaments.length === 0) {
      sections.push(
        sbwRenderTournamentSection(
          "Torneios criados localmente",
          "Painel do organizador",
          "Eventos criados pelo painel nesta versão demo. Eles ficam salvos apenas neste navegador usando localStorage.",
          localTournaments,
          "Nenhum torneio criado pelo painel foi encontrado neste navegador."
        )
      );
    }

    if (demoTournaments.length > 0 || supabaseTournaments.length === 0) {
      sections.push(
        sbwRenderTournamentSection(
          "Torneios demo",
          "Modelos de apresentação",
          "Exemplos fixos usados para demonstrar formatos, inscrição simulada e páginas públicas.",
          demoTournaments,
          "Nenhum torneio demo corresponde ao filtro atual."
        )
      );
    }

    sbwPublicTournamentGrid.innerHTML = sections.join("");
  }

  if (sbwTournamentCount) {
    sbwTournamentCount.textContent = filteredTournaments.length;
  }
}

if (sbwTournamentFilter) {
  sbwTournamentFilter.addEventListener("change", function () {
    sbwRenderTournamentsListPage();
  });
}

sbwRenderTournamentsListPage();