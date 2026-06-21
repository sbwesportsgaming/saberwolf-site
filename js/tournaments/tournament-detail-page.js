const root = document.getElementById("tournamentDetailRoot");

const escapeHTML = sbwEscapeHTML;
const getQueryParam = sbwGetQueryParam;

let sbwCurrentDetailTournament = null;
let sbwCurrentDetailAuthUser = null;
let sbwCurrentDetailProfile = null;
let sbwCurrentDetailRegistration = null;
let sbwCurrentDetailParticipants = [];
let sbwCurrentDetailRegistrationChecked = false;
let sbwCurrentDetailRegistrationBusy = false;


function sbwGetTournamentCoverData(tournament) {
  const metadata = tournament?.metadata && typeof tournament.metadata === "object" ? tournament.metadata : {};
  const settings = tournament?.settings && typeof tournament.settings === "object" ? tournament.settings : {};
  const assets = metadata.tournamentAssets || metadata.tournament_assets || settings.tournamentAssets || settings.tournament_assets || {};
  const cover = assets.cover || assets.banner || metadata.cover || settings.cover || {};
  const coverUrl =
    tournament?.coverUrl ||
    tournament?.cover_url ||
    tournament?.bannerUrl ||
    tournament?.banner_url ||
    tournament?.imageUrl ||
    tournament?.image_url ||
    cover.url ||
    cover.publicUrl ||
    cover.public_url ||
    metadata.coverUrl ||
    metadata.cover_url ||
    settings.coverUrl ||
    settings.cover_url ||
    "";

  const framing = cover.framing || cover.frame || cover.crop || cover.position || metadata.coverFrame || metadata.coverFraming || settings.coverFrame || {};
  const zoom = Number(framing.zoom || framing.scale || cover.zoom || 100);
  const x = Number(framing.x || framing.positionX || framing.horizontal || cover.x || 50);
  const y = Number(framing.y || framing.positionY || framing.vertical || cover.y || 50);

  return {
    url: String(coverUrl || "").trim(),
    zoom: Number.isFinite(zoom) && zoom > 0 ? zoom : 100,
    x: Number.isFinite(x) ? x : 50,
    y: Number.isFinite(y) ? y : 50
  };
}

function sbwBuildTournamentHeroStyle(tournament) {
  const cover = sbwGetTournamentCoverData(tournament);

  if (!cover.url) {
    return "";
  }

  const safeUrl = String(cover.url).replace(/\\/g, "\\\\").replace(/'/g, "\\'");
  const size = Math.max(100, Math.min(180, cover.zoom));
  const x = Math.max(0, Math.min(100, cover.x));
  const y = Math.max(0, Math.min(100, cover.y));

  return ` style="--tournament-cover: url('${safeUrl}'); --tournament-cover-x: ${x}%; --tournament-cover-y: ${y}%; --tournament-cover-size: ${size}% auto; --tournament-cover-opacity: 0.88;"`;
}

function findTournamentById(tournamentId) {
  if (typeof sbwGetTournamentById === "function") {
    return sbwGetTournamentById(tournamentId);
  }

  return null;
}

function sbwLooksLikeUUID(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    String(value || "")
  );
}

async function findTournamentByIdAsync(tournamentId) {
  if (!tournamentId) {
    return null;
  }

  if (
    window.SBWSupabase &&
    typeof window.SBWSupabase.isEnabled === "function" &&
    window.SBWSupabase.isEnabled()
  ) {
    const tableName =
      window.SBWSupabaseConfig?.tables?.tournaments || "tournaments";

    try {
      const slugResult = await window.SBWSupabase.client
        .from(tableName)
        .select("*")
        .eq("slug", tournamentId)
        .maybeSingle();

      if (slugResult.error) {
        console.warn("[SaberWolf Supabase] Busca por slug falhou:", slugResult.error);
      }

      if (slugResult.data) {
        return typeof sbwNormalizeSupabaseTournament === "function"
          ? sbwNormalizeSupabaseTournament(slugResult.data)
          : slugResult.data;
      }

      if (sbwLooksLikeUUID(tournamentId)) {
        const idResult = await window.SBWSupabase.client
          .from(tableName)
          .select("*")
          .eq("id", tournamentId)
          .maybeSingle();

        if (idResult.error) {
          console.warn("[SaberWolf Supabase] Busca por id falhou:", idResult.error);
        }

        if (idResult.data) {
          return typeof sbwNormalizeSupabaseTournament === "function"
            ? sbwNormalizeSupabaseTournament(idResult.data)
            : idResult.data;
        }
      }
    } catch (error) {
      console.error("[SaberWolf Supabase] Erro ao buscar torneio no detalhe:", error);
    }
  }

  if (typeof sbwGetTournamentByIdAsync === "function") {
    try {
      const tournament = await sbwGetTournamentByIdAsync(tournamentId);

      if (tournament) {
        return tournament;
      }
    } catch (error) {
      console.error("Erro ao buscar torneio de forma assíncrona:", error);
    }
  }

  return findTournamentById(tournamentId);
}

function renderLoading() {
  root.innerHTML = `
    <section class="not-found-state">
      <div class="not-found-card">
        <h2>Carregando torneio...</h2>

        <p>
          Buscando informações do torneio na plataforma -SBW-.
        </p>
      </div>
    </section>
  `;
}

function getTournamentStructure(tournament) {
  if (!tournament) {
    return null;
  }

  return tournament.structure ||
    tournament.tournamentStructure ||
    tournament.generatedStructure ||
    tournament.settings?.structure ||
    tournament.metadata?.structure ||
    null;
}

function getTournamentMatches(tournament) {
  const structure = getTournamentStructure(tournament);

  if (Array.isArray(tournament?.matches) && tournament.matches.length > 0) {
    return tournament.matches;
  }

  if (Array.isArray(tournament?.settings?.matches) && tournament.settings.matches.length > 0) {
    return tournament.settings.matches;
  }

  if (Array.isArray(tournament?.metadata?.matches) && tournament.metadata.matches.length > 0) {
    return tournament.metadata.matches;
  }

  if (Array.isArray(structure?.matches) && structure.matches.length > 0) {
    return structure.matches;
  }

  return [];
}

function getTournamentStandings(tournament) {
  const structure = getTournamentStructure(tournament);

  if (Array.isArray(tournament?.standings) && tournament.standings.length > 0) {
    return tournament.standings;
  }

  if (Array.isArray(tournament?.settings?.standings) && tournament.settings.standings.length > 0) {
    return tournament.settings.standings;
  }

  if (Array.isArray(tournament?.metadata?.standings) && tournament.metadata.standings.length > 0) {
    return tournament.metadata.standings;
  }

  if (Array.isArray(structure?.standings) && structure.standings.length > 0) {
    return structure.standings;
  }

  if (Array.isArray(structure?.league?.standings) && structure.league.standings.length > 0) {
    return structure.league.standings;
  }

  return [];
}

function getStructureGeneratedAt(tournament) {
  const structure = getTournamentStructure(tournament);

  return tournament?.settings?.structureGeneratedAt ||
    tournament?.metadata?.structureGeneratedAt ||
    structure?.generatedAt ||
    "";
}

function getStructureGeneratedFrom(tournament) {
  const structure = getTournamentStructure(tournament);

  return tournament?.settings?.structureGeneratedFrom ||
    tournament?.metadata?.structureGeneratedFrom ||
    structure?.source ||
    "";
}

function getStructurePlayersUsed(tournament) {
  const structure = getTournamentStructure(tournament);

  return Number(
    structure?.eligibleParticipantsCount ||
    structure?.playersUsed ||
    tournament?.metadata?.structurePlayersUsed ||
    tournament?.settings?.structurePlayersUsed ||
    0
  );
}

function hasGeneratedStructure(tournament) {
  return Boolean(getTournamentStructure(tournament));
}

function getTournamentFormat(tournament) {
  const structure = getTournamentStructure(tournament);

  const rawFormat =
    tournament.format ||
    tournament.type ||
    tournament.settings?.format ||
    structure?.type ||
    structure?.format ||
    "";

  const normalized = String(rawFormat).toLowerCase().trim();

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

  function getFormatLabel(format) {
    const labels = {
      "groups-playoffs": "Grupos + Playoffs",
      league: "Liga / Pontos Corridos",
      "double-elimination": "Double Elimination",
      "single-elimination": "Eliminação Simples"
    };

    return labels[format] || format || "Formato não definido";
  }

  function getStatusInfo(status) {
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

  function formatDate(value) {
    if (!value) {
      return "Data a definir";
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

  function getParticipants(tournament) {
    return Array.isArray(tournament.participants)
      ? tournament.participants
      : [];
  }

  function getParticipantsCount(tournament) {
  const directCount =
    tournament?.currentParticipants ??
    tournament?.participantsCount ??
    tournament?.registeredParticipants ??
    tournament?.registrationsCount ??
    null;

  if (directCount !== null && directCount !== undefined && directCount !== "") {
    const numberValue = Number(directCount);

    if (Number.isFinite(numberValue)) {
      return numberValue;
    }
  }

  return getParticipants(tournament).length;
}

  function getMaxParticipants(tournament) {
    return tournament.maxParticipants ||
      tournament.participantLimit ||
      tournament.limitParticipants ||
      "∞";
  }

  function getDescription(tournament) {
    return tournament.description ||
      tournament.shortDescription ||
      "Torneio publicado na plataforma SaberWolf.";
  }

  function getRules(tournament) {
    return tournament.rules ||
      tournament.ruleSet ||
      "Regras ainda não publicadas pelo organizador.";
  }

  function getPrize(tournament) {
    return tournament.prize ||
      tournament.prizePool ||
      "A definir";
  }

  function getOrganizer(tournament) {
    return tournament.organizer ||
      tournament.organizerName ||
      "SaberWolf";
  }

  function getPlayerName(player) {
    if (!player) {
      return "A definir";
    }

    return player.nickname ||
      player.name ||
      player.playerName ||
      player.displayName ||
      "Jogador";
  }

  function getPlayerTeam(player) {
    if (!player) {
      return "Sem equipe";
    }

    return player.team ||
      player.organization ||
      player.club ||
      "Sem equipe";
  }

  function getMatchScore(match, field) {
    if (!match) {
      return "-";
    }

    const value = match[field];

    if (value === null || value === undefined || value === "") {
      return "-";
    }

    return value;
  }


  function hasMatchScore(match) {
    return Boolean(
      match &&
      match.scoreA !== null &&
      match.scoreA !== undefined &&
      match.scoreA !== "" &&
      match.scoreB !== null &&
      match.scoreB !== undefined &&
      match.scoreB !== ""
    );
  }

  function getMatchPlayer(match, side) {
    if (!match) {
      return null;
    }

    if (side === "A") {
      return match.playerA ||
        match.a ||
        match.home ||
        match.participantA ||
        match.player1 ||
        match.teamA ||
        match.players?.[0] ||
        match.participants?.[0] ||
        null;
    }

    return match.playerB ||
      match.b ||
      match.away ||
      match.participantB ||
      match.player2 ||
      match.teamB ||
      match.players?.[1] ||
      match.participants?.[1] ||
      null;
  }

  function getPlayerKey(player) {
    if (!player) {
      return "";
    }

    return String(
      player.id ||
      player.profileId ||
      player.profile_id ||
      player.playerSlug ||
      player.player_slug ||
      player.slug ||
      player.nickname ||
      player.name ||
      player.playerName ||
      ""
    );
  }

  function getMatchWinnerSide(match) {
    if (!match) {
      return "";
    }

    const playerA = getMatchPlayer(match, "A");
    const playerB = getMatchPlayer(match, "B");
    const winnerId = match.winnerId || match.winner_id || match.winner?.id || "";

    if (winnerId) {
      const safeWinnerId = String(winnerId);

      if (playerA && getPlayerKey(playerA) && safeWinnerId === getPlayerKey(playerA)) {
        return "A";
      }

      if (playerB && getPlayerKey(playerB) && safeWinnerId === getPlayerKey(playerB)) {
        return "B";
      }
    }

    if (!hasMatchScore(match)) {
      return "";
    }

    const scoreA = Number(match.scoreA);
    const scoreB = Number(match.scoreB);

    if (!Number.isFinite(scoreA) || !Number.isFinite(scoreB) || scoreA === scoreB) {
      return "";
    }

    return scoreA > scoreB ? "A" : "B";
  }

  function getMatchWinnerName(match) {
    const winnerSide = getMatchWinnerSide(match);

    if (winnerSide === "A") {
      return getPlayerName(getMatchPlayer(match, "A"));
    }

    if (winnerSide === "B") {
      return getPlayerName(getMatchPlayer(match, "B"));
    }

    return "";
  }

  function getMatchPublicStatus(match) {
    const rawStatus = String(match?.status || "").toLowerCase();

    if (rawStatus === "bye" || rawStatus === "free-win") {
      return {
        className: "bye",
        label: "BYE"
      };
    }

    if (
      rawStatus === "completed" ||
      rawStatus === "finished" ||
      rawStatus === "done" ||
      hasMatchScore(match)
    ) {
      return {
        className: "completed",
        label: "Finalizada"
      };
    }

    if (rawStatus === "in-progress" || rawStatus === "live") {
      return {
        className: "live",
        label: "Em andamento"
      };
    }

    if (rawStatus.includes("waiting")) {
      return {
        className: "pending",
        label: "Aguardando resultado"
      };
    }

    return {
      className: "pending",
      label: "Pendente"
    };
  }

  function formatDateTimeLabel(value) {
    if (!value) {
      return "Ainda não atualizado";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return String(value);
    }

    return date.toLocaleString("pt-BR");
  }

  function getResultsUpdatedAt(tournament) {
    return tournament?.settings?.resultsUpdatedAt ||
      tournament?.metadata?.resultsUpdatedAt ||
      tournament?.resultsUpdatedAt ||
      "";
  }

  function getFinalResults(tournament) {
    return tournament?.settings?.finalResults ||
      tournament?.metadata?.finalResults ||
      tournament?.finalResults ||
      null;
  }

  function renderFinalResultsSummary(tournament) {
    const finalResults = getFinalResults(tournament);

    if (!finalResults) {
      return "";
    }

    const champion = finalResults.champion || null;
    const placements = Array.isArray(finalResults.placements) ? finalResults.placements : [];
    const finalizedAt = finalResults.finalizedAt || finalResults.completedAt || tournament?.metadata?.completedAt || tournament?.settings?.completedAt || "";
    const finalizedDate = finalizedAt ? new Date(finalizedAt) : null;
    const finalizedLabel = finalizedDate && !Number.isNaN(finalizedDate.getTime())
      ? finalizedDate.toLocaleString("pt-BR")
      : (finalizedAt || "Data não registrada");

    return `
      <div class="detail-card final-results-card">
        <div>
          <strong>Resultado final oficial</strong>
          <p>
            Torneio encerrado pelo organizador. Campeão: <b>${escapeHTML(champion?.nickname || champion?.name || "A definir")}</b>.
          </p>
        </div>

        <div class="structure-meta-grid">
          <span><b>Status</b>Encerrado</span>
          <span><b>Finalizado em</b>${escapeHTML(finalizedLabel)}</span>
          <span><b>Partidas concluídas</b>${escapeHTML(finalResults.matchesSummary?.completedMatches || 0)} / ${escapeHTML(finalResults.matchesSummary?.totalPlayableMatches || 0)}</span>
          <span><b>Origem</b>${escapeHTML(finalResults.source || "Painel do organizador")}</span>
        </div>

        ${placements.length > 0 ? `
          <div class="public-final-placements">
            ${placements.slice(0, 8).map((player) => `
              <div class="public-final-placement-row">
                <strong>${escapeHTML(player.placementLabel || `${player.placement || "-"}º lugar`)}</strong>
                <span>${escapeHTML(player.nickname || player.name || "Jogador")}</span>
                ${player.team ? `<em>${escapeHTML(player.team)}</em>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}
      </div>
    `;
  }

  function getResultCounts(tournament) {
    const matches = getTournamentMatches(tournament);

    return matches.reduce((acc, match) => {
      const playerA = getMatchPlayer(match, "A");
      const playerB = getMatchPlayer(match, "B");

      if (!playerA || !playerB) {
        return acc;
      }

      acc.total += 1;

      if (getMatchPublicStatus(match).className === "completed") {
        acc.completed += 1;
      }

      return acc;
    }, {
      total: 0,
      completed: 0
    });
  }

  function sbwGetTournamentStatusKey(tournament) {
    return String(tournament?.status || "draft").trim().toLowerCase();
  }

  function sbwGetMaxParticipantsNumber(tournament) {
    const maxParticipants = Number(getMaxParticipants(tournament));
    return Number.isFinite(maxParticipants) && maxParticipants > 0 ? maxParticipants : null;
  }

  function sbwIsRegistrationStatusOpen(tournament) {
    const status = sbwGetTournamentStatusKey(tournament);

    return [
      "open",
      "published",
      "registration-open",
      "registrations-open",
      "inscricoes-abertas",
      "inscrições-abertas"
    ].includes(status);
  }

  function sbwGetRegistrationAvailability(tournament) {
    const participantsCount = getParticipantsCount(tournament);
    const maxParticipants = sbwGetMaxParticipantsNumber(tournament);
    const rawStatus = sbwGetTournamentStatusKey(tournament);
    const statusInfo = getStatusInfo(rawStatus);
    const isFull = Boolean(maxParticipants && participantsCount >= maxParticipants);
    const isOpenStatus = sbwIsRegistrationStatusOpen(tournament);
    const percent = maxParticipants
      ? Math.max(0, Math.min(100, Math.round((participantsCount / maxParticipants) * 100)))
      : 0;

    if (isFull) {
      return {
        open: false,
        className: "full",
        label: "Vagas esgotadas",
        shortLabel: "Lotado",
        reason: "O limite de participantes foi atingido.",
        participantsCount,
        maxParticipants,
        percent
      };
    }

    if (isOpenStatus) {
      return {
        open: true,
        className: "open",
        label: "Inscrições abertas",
        shortLabel: "Aberta",
        reason: "Jogadores logados podem confirmar participação.",
        participantsCount,
        maxParticipants,
        percent
      };
    }

    if (["draft", "rascunho"].includes(rawStatus)) {
      return {
        open: false,
        className: "draft",
        label: "Inscrição em preparação",
        shortLabel: "Em breve",
        reason: "O organizador ainda está preparando a publicação do torneio.",
        participantsCount,
        maxParticipants,
        percent
      };
    }

    if (["completed", "finished", "finalizado", "encerrado", "cancelled", "canceled", "archived"].includes(rawStatus)) {
      return {
        open: false,
        className: "closed",
        label: "Inscrições encerradas",
        shortLabel: "Encerrada",
        reason: "Este torneio não recebe novas inscrições neste momento.",
        participantsCount,
        maxParticipants,
        percent
      };
    }

    return {
      open: false,
      className: statusInfo.className || "closed",
      label: "Inscrições indisponíveis",
      shortLabel: "Fechada",
      reason: "A inscrição será liberada pelo organizador quando o torneio estiver pronto.",
      participantsCount,
      maxParticipants,
      percent
    };
  }

  function isOpenForRegistration(tournament) {
    return sbwGetRegistrationAvailability(tournament).open;
  }

  function sbwGetParticipantStatusInfo(participant) {
    const status = String(participant?.status || "registered").trim().toLowerCase().replaceAll("-", "_");

    if (status === "waitlist" || status === "lista_espera") {
      return {
        className: "waitlist",
        label: "Lista de espera"
      };
    }

    if (status === "confirmed" || status === "approved") {
      return {
        className: "confirmed",
        label: "Confirmado"
      };
    }

    return {
      className: "registered",
      label: "Inscrito"
    };
  }

  function sbwGetCheckInStatusInfo(participant) {
    const raw = String(participant?.checkInStatus || participant?.check_in_status || "pending")
      .trim()
      .toLowerCase()
      .replaceAll("-", "_");

    if (participant?.checkedIn || raw === "checked_in" || raw === "confirmed") {
      return {
        className: "checked-in",
        label: "Check-in confirmado",
        icon: "fa-circle-check"
      };
    }

    if (raw === "missed" || raw === "no_show") {
      return {
        className: "missed",
        label: "Check-in perdido",
        icon: "fa-circle-xmark"
      };
    }

    if (raw === "waived") {
      return {
        className: "waived",
        label: "Check-in dispensado",
        icon: "fa-circle-minus"
      };
    }

    return {
      className: "pending",
      label: "Check-in pendente",
      icon: "fa-clock"
    };
  }

  function renderNotFound() {
    root.innerHTML = `
      <section class="not-found-state">
        <div class="not-found-card">
          <h2>Torneio não encontrado</h2>

          <p>
            Não encontramos o torneio solicitado. Ele pode ter sido removido,
            não estar salvo neste navegador ou o link pode estar incorreto.
          </p>

          <a class="detail-btn" href="torneios.html">
            Voltar para Torneios
          </a>
        </div>
      </section>
    `;
  }

  function sbwGetParticipantMetaItems(participant) {
    const items = [];
    const raw = participant?.raw && typeof participant.raw === "object" ? participant.raw : {};
    const metadata = raw.metadata && typeof raw.metadata === "object" ? raw.metadata : {};

    const playerSlug = participant?.playerSlug || participant?.player_slug || raw.player_slug || "";
    const character = participant?.character || participant?.mainCharacter || metadata.character || metadata.mainCharacter || "";
    const source = participant?.source === "supabase" ? "Inscrição real" : "Registro local";

    if (playerSlug) {
      items.push(`@${playerSlug}`);
    }

    if (character) {
      items.push(character);
    }

    items.push(source);

    return items;
  }

  function renderParticipantsOverview(tournament, availability) {
    const participants = getParticipants(tournament)
      .filter((participant) => {
        const status = String(participant.status || "registered").toLowerCase();
        return !["removed", "cancelled", "canceled", "disqualified"].includes(status);
      });
    const checkedInCount = participants.filter((participant) => sbwGetCheckInStatusInfo(participant).className === "checked-in").length;
    const waitlistCount = participants.filter((participant) => sbwGetParticipantStatusInfo(participant).className === "waitlist").length;
    const maxLabel = availability.maxParticipants ? availability.maxParticipants : "∞";

    return `
      <div class="participants-overview-grid">
        <div class="participants-overview-card">
          <span>Inscritos</span>
          <strong>${escapeHTML(availability.participantsCount)} / ${escapeHTML(maxLabel)}</strong>
        </div>

        <div class="participants-overview-card">
          <span>Check-in</span>
          <strong>${escapeHTML(checkedInCount)} confirmado${checkedInCount === 1 ? "" : "s"}</strong>
        </div>

        <div class="participants-overview-card">
          <span>Lista de espera</span>
          <strong>${escapeHTML(waitlistCount)}</strong>
        </div>

        <div class="participants-overview-card ${escapeHTML(availability.className)}">
          <span>Status da inscrição</span>
          <strong>${escapeHTML(availability.shortLabel)}</strong>
        </div>
      </div>
    `;
  }

  function renderParticipants(tournament) {
    const participants = getParticipants(tournament)
      .filter((participant) => {
        const status = String(participant.status || "registered").toLowerCase();
        return !["removed", "cancelled", "canceled", "disqualified"].includes(status);
      })
      .sort((a, b) => {
        const seedA = Number(a.seed || 999999);
        const seedB = Number(b.seed || 999999);

        if (seedA !== seedB) {
          return seedA - seedB;
        }

        return String(getPlayerName(a)).localeCompare(String(getPlayerName(b)), "pt-BR");
      });

    if (participants.length === 0) {
      return `
        <div class="participant-empty-state">
          <div class="participant-empty-icon">
            <i class="fa-solid fa-user-plus"></i>
          </div>
          <div>
            <strong>Nenhum participante publicado ainda</strong>
            <p>Quando jogadores confirmarem inscrição, eles aparecerão aqui com status, equipe e check-in.</p>
          </div>
        </div>
      `;
    }

    return `
      <div class="participants-grid participants-grid--premium">
        ${participants.map((participant, index) => {
          const checkIn = sbwGetCheckInStatusInfo(participant);
          const participantStatus = sbwGetParticipantStatusInfo(participant);
          const seedLabel = Number(participant.seed) > 0 ? `Seed ${participant.seed}` : `#${index + 1}`;
          const metaItems = sbwGetParticipantMetaItems(participant);

          return `
            <article class="participant-card participant-card--premium ${escapeHTML(checkIn.className)}">
              <div class="participant-rank-badge">${escapeHTML(seedLabel)}</div>

              <div class="participant-card-top">
                <div>
                  <strong>${escapeHTML(getPlayerName(participant))}</strong>
                  <span>${escapeHTML(getPlayerTeam(participant))}</span>
                </div>

                <span class="participant-status-pill ${escapeHTML(participantStatus.className)}">
                  ${escapeHTML(participantStatus.label)}
                </span>
              </div>

              <div class="participant-meta-row">
                ${metaItems.map((item) => `<span>${escapeHTML(item)}</span>`).join("")}
              </div>

              <div class="participant-checkin-row ${escapeHTML(checkIn.className)}">
                <i class="fa-solid ${escapeHTML(checkIn.icon)}"></i>
                ${escapeHTML(checkIn.label)}
              </div>
            </article>
          `;
        }).join("")}
      </div>
    `;
  }

  function renderLeagueTable(tournament) {
    const standings = getTournamentStandings(tournament);

    if (!Array.isArray(standings) || standings.length === 0) {
      const participants = getParticipants(tournament);

      if (participants.length === 0) {
        return `
          <div class="detail-card">
            <p>
              A tabela da liga será exibida quando o organizador gerar ou lançar os resultados.
            </p>
          </div>
        `;
      }

      return `
        <div class="detail-card">
          <p>
            Participantes inscritos. A classificação será exibida após o lançamento dos resultados.
          </p>
        </div>

        ${renderParticipants(tournament)}
      `;
    }

    return `
      <div class="public-table-wrap">
        <table class="public-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Jogador</th>
              <th>Vitórias</th>
              <th>Derrotas</th>
              <th>Saldo</th>
              <th>Pontos</th>
            </tr>
          </thead>

          <tbody>
            ${standings.map((row, index) => `
              <tr>
                <td><strong>${index + 1}</strong></td>
                <td><strong>${escapeHTML(getPlayerName(row))}</strong></td>
                <td>${escapeHTML(row.wins ?? row.victories ?? 0)}</td>
                <td>${escapeHTML(row.losses ?? row.defeats ?? 0)}</td>
                <td>${escapeHTML(row.scoreDiff ?? row.setDiff ?? row.balance ?? 0)}</td>
                <td><strong>${escapeHTML(row.points ?? 0)}</strong></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `;
  }

    function getLeagueRounds(tournament) {
    const structure = getTournamentStructure(tournament);

    const rounds =
      structure?.league?.rounds ||
      structure?.rounds ||
      tournament.leagueRounds ||
      tournament.rounds ||
      [];

    if (Array.isArray(rounds) && rounds.length > 0) {
      return rounds;
    }

    const matches =
      structure?.league?.matches ||
      structure?.matches ||
      tournament.leagueMatches ||
      getTournamentMatches(tournament) ||
      [];

    if (Array.isArray(matches) && matches.length > 0) {
      const grouped = {};

      matches.forEach((match) => {
        const roundName =
          match.roundName ||
          match.roundLabel ||
          (match.round ? `Rodada ${match.round}` : "Histórico de partidas");

        if (!grouped[roundName]) {
          grouped[roundName] = [];
        }

        grouped[roundName].push(match);
      });

      return Object.entries(grouped).map(([name, roundMatches]) => ({
        name,
        matches: roundMatches
      }));
    }

    return [];
  }

  function getLeagueMatchPlayer(match, side) {
    if (!match) {
      return null;
    }

    if (side === "A") {
      return match.playerA ||
        match.a ||
        match.home ||
        match.participantA ||
        match.player1 ||
        null;
    }

    return match.playerB ||
      match.b ||
      match.away ||
      match.participantB ||
      match.player2 ||
      null;
  }

  function getLeagueMatchStatus(match) {
    const status = String(match?.status || "").toLowerCase();

    if (
      status === "completed" ||
      status === "finished" ||
      status === "done"
    ) {
      return "completed";
    }

    if (
      match?.scoreA !== null &&
      match?.scoreA !== undefined &&
      match?.scoreB !== null &&
      match?.scoreB !== undefined
    ) {
      return "completed";
    }

    return "pending";
  }

  function renderLeagueRounds(tournament) {
    const rounds = getLeagueRounds(tournament);

    if (!Array.isArray(rounds) || rounds.length === 0) {
      return `
        <div class="detail-card">
          <p>
            As rodadas e partidas da liga serão exibidas quando o organizador gerar a estrutura.
          </p>
        </div>
      `;
    }

    return `
      <div class="league-rounds-public">
        ${rounds.map((round, roundIndex) => {
          const matches = Array.isArray(round.matches)
            ? round.matches
            : [];

          return `
            <div class="league-round-card">
              <h4>${escapeHTML(round.name || round.label || `Rodada ${roundIndex + 1}`)}</h4>

              <div class="league-match-list">
                ${
                  matches.length > 0
                    ? matches.map((match) => {
                      const playerA = getLeagueMatchPlayer(match, "A");
                      const playerB = getLeagueMatchPlayer(match, "B");
                      const status = getMatchPublicStatus(match);
                      const winnerSide = getMatchWinnerSide(match);
                      const scoreA = getMatchScore(match, "scoreA");
                      const scoreB = getMatchScore(match, "scoreB");

                      return `
                        <div class="league-match-row ${status.className}">
                          <strong class="${winnerSide === "A" ? "winner" : ""}">${escapeHTML(getPlayerName(playerA))}</strong>

                          <span class="league-match-score">
                            ${escapeHTML(scoreA)} x ${escapeHTML(scoreB)}
                          </span>

                          <strong class="player-b ${winnerSide === "B" ? "winner" : ""}">${escapeHTML(getPlayerName(playerB))}</strong>

                          <span class="league-match-status-pill ${status.className}">${escapeHTML(status.label)}</span>
                        </div>
                      `;
                    }).join("")
                    : `
                      <div class="league-match-row">
                        <strong>Partidas a definir</strong>
                        <span class="league-match-score">-</span>
                        <strong class="player-b">Aguardando</strong>
                      </div>
                    `
                }
              </div>
            </div>
          `;
        }).join("")}
      </div>
    `;
  }

  function getAdvancePerGroup(tournament, groupCount) {
    const directValue =
      tournament.advancePerGroup ||
      tournament.qualifiedPerGroup ||
      tournament.playoffAdvancePerGroup ||
      tournament.groupConfig?.advancePerGroup ||
      tournament.groupsConfig?.advancePerGroup ||
      tournament.structure?.advancePerGroup;

    if (Number(directValue) > 0) {
      return Number(directValue);
    }

    const totalQualified =
      tournament.playoffQualifiedTotal ||
      tournament.qualifiedTotal ||
      tournament.totalQualified ||
      tournament.structure?.playoffQualifiedTotal ||
      tournament.structure?.playoffs?.totalQualified;

    if (Number(totalQualified) > 0 && Number(groupCount) > 0) {
      return Math.floor(Number(totalQualified) / Number(groupCount));
    }

    return 0;
  }

  function renderGroups(tournament) {
    const structure = getTournamentStructure(tournament);

    const groups =
      structure?.groups ||
      tournament.groups ||
      [];

    if (!Array.isArray(groups) || groups.length === 0) {
      return `
        <div class="detail-card">
          <p>
            Os grupos serão exibidos quando a estrutura do torneio for gerada pelo organizador.
          </p>
        </div>
      `;
    }

    const advancePerGroup = getAdvancePerGroup(tournament, groups.length);

    return `
      <div class="groups-public-grid">
        ${groups.map((group, groupIndex) => {
          const rows = group.standings || group.players || group.participants || [];

          return `
            <div class="public-group-card">
              <h4>${escapeHTML(group.name || group.label || `Grupo ${String.fromCharCode(65 + groupIndex)}`)}</h4>

              ${
                rows.length > 0
                  ? rows.map((player, index) => `
                    <div class="public-group-player ${advancePerGroup > 0 && index < advancePerGroup ? "qualified" : ""}">
                      <strong>${index + 1}. ${escapeHTML(getPlayerName(player))}</strong>
                      <span>${player.points !== undefined ? `${escapeHTML(player.points)} pts` : ""}</span>
                    </div>
                  `).join("")
                  : `
                    <div class="public-group-player">
                      <strong>Participantes a definir</strong>
                      <span>-</span>
                    </div>
                  `
              }
            </div>
          `;
        }).join("")}
      </div>
    `;
  }

    function getHistoryPlayer(match, side) {
    if (!match) {
      return null;
    }

    if (side === "A") {
      return match.playerA ||
        match.a ||
        match.home ||
        match.participantA ||
        match.player1 ||
        match.teamA ||
        match.players?.[0] ||
        match.participants?.[0] ||
        null;
    }

    return match.playerB ||
      match.b ||
      match.away ||
      match.participantB ||
      match.player2 ||
      match.teamB ||
      match.players?.[1] ||
      match.participants?.[1] ||
      null;
  }

  function getHistoryMatchStatus(match) {
    const status = String(match?.status || "").toLowerCase();

    if (
      status === "completed" ||
      status === "finished" ||
      status === "done"
    ) {
      return "completed";
    }

    if (
      match?.scoreA !== null &&
      match?.scoreA !== undefined &&
      match?.scoreB !== null &&
      match?.scoreB !== undefined
    ) {
      return "completed";
    }

    return "pending";
  }

  function getHistoryRoundsFromGroups(tournament) {
    const structure = getTournamentStructure(tournament);

    const groups =
      structure?.groups ||
      tournament.groups ||
      [];

    if (!Array.isArray(groups) || groups.length === 0) {
      return [];
    }

    const historyRounds = [];

    groups.forEach((group, groupIndex) => {
      const groupName =
        group.name ||
        group.label ||
        `Grupo ${String.fromCharCode(65 + groupIndex)}`;

      if (Array.isArray(group.rounds) && group.rounds.length > 0) {
        group.rounds.forEach((round, roundIndex) => {
          historyRounds.push({
            name: `${groupName} — ${round.name || round.label || `Rodada ${roundIndex + 1}`}`,
            matches: Array.isArray(round.matches) ? round.matches : []
          });
        });
      }

      if (Array.isArray(group.matches) && group.matches.length > 0) {
        historyRounds.push({
          name: `${groupName} — partidas`,
          matches: group.matches
        });
      }
    });

    return historyRounds.filter((round) => {
      return Array.isArray(round.matches) && round.matches.length > 0;
    });
  }

  function getHistoryRoundsFromLeague(tournament) {
    const structure = getTournamentStructure(tournament);

    const rounds =
      structure?.league?.rounds ||
      structure?.rounds ||
      tournament.leagueRounds ||
      tournament.rounds ||
      [];

    if (Array.isArray(rounds) && rounds.length > 0) {
      return rounds;
    }

    const matches =
      structure?.league?.matches ||
      structure?.matches ||
      tournament.leagueMatches ||
      getTournamentMatches(tournament) ||
      [];

    if (Array.isArray(matches) && matches.length > 0) {
      return [
        {
          name: "Histórico de partidas",
          matches
        }
      ];
    }

    return [];
  }

  function renderHistoryRounds(rounds) {
    return `
      <div class="league-rounds-public">
        ${rounds.map((round, roundIndex) => {
          const matches = Array.isArray(round.matches)
            ? round.matches
            : [];

          return `
            <div class="league-round-card">
              <h4>${escapeHTML(round.name || round.label || `Rodada ${roundIndex + 1}`)}</h4>

              <div class="league-match-list">
                ${matches.map((match) => {
                  const playerA = getHistoryPlayer(match, "A");
                  const playerB = getHistoryPlayer(match, "B");
                  const status = getMatchPublicStatus(match);
                  const winnerSide = getMatchWinnerSide(match);
                  const scoreA = getMatchScore(match, "scoreA");
                  const scoreB = getMatchScore(match, "scoreB");

                  return `
                    <div class="league-match-row ${status.className}">
                      <strong class="${winnerSide === "A" ? "winner" : ""}">${escapeHTML(getPlayerName(playerA))}</strong>

                      <span class="league-match-score">
                        ${escapeHTML(scoreA)} x ${escapeHTML(scoreB)}
                      </span>

                      <strong class="player-b ${winnerSide === "B" ? "winner" : ""}">${escapeHTML(getPlayerName(playerB))}</strong>

                      <span class="league-match-status-pill ${status.className}">${escapeHTML(status.label)}</span>
                    </div>
                  `;
                }).join("")}
              </div>
            </div>
          `;
        }).join("")}
      </div>
    `;
  }

  function renderCollapsedMatchHistory(title, rounds) {
    if (!Array.isArray(rounds) || rounds.length === 0) {
      return "";
    }

    const totalMatches = rounds.reduce((total, round) => {
      return total + (Array.isArray(round.matches) ? round.matches.length : 0);
    }, 0);

    return `
      <details class="match-history-accordion">
        <summary>
          ${escapeHTML(title)} — ${totalMatches} partida${totalMatches === 1 ? "" : "s"}
        </summary>

        <div class="match-history-body">
          ${renderHistoryRounds(rounds)}
        </div>
      </details>
    `;
  }

  function renderGroupPhaseHistory(tournament) {
    return renderCollapsedMatchHistory(
      "Ver histórico da fase de grupos",
      getHistoryRoundsFromGroups(tournament)
    );
  }

  function renderLeagueHistory(tournament) {
    return renderCollapsedMatchHistory(
      "Ver histórico de partidas da liga",
      getHistoryRoundsFromLeague(tournament)
    );
  }

  function isMatchWinner(match, player) {
    if (!match || !player) {
      return false;
    }

    if (match.winnerId && player.id) {
      return String(match.winnerId) === String(player.id);
    }

    const scoreA = Number(match.scoreA);
    const scoreB = Number(match.scoreB);

    if (!Number.isFinite(scoreA) || !Number.isFinite(scoreB)) {
      return false;
    }

    return false;
  }

  function renderMatch(match, options = {}) {
    const playerA = getMatchPlayer(match, "A");
    const playerB = getMatchPlayer(match, "B");
    const scoreA = getMatchScore(match, "scoreA");
    const scoreB = getMatchScore(match, "scoreB");
    const status = getMatchPublicStatus(match);
    const winnerSide = getMatchWinnerSide(match);
    const winnerName = getMatchWinnerName(match);

    const winnerA = winnerSide === "A";
    const winnerB = winnerSide === "B";

    const hasNextRound = Boolean(options.hasNextRound);
    const matchIndex = Number(options.matchIndex || 0);
    const rowSpan = Number(options.rowSpan || 1);
    const startRow = Number(options.startRow || 1);
    const connectorHeight = Number(options.connectorHeight || 118);

    const connectorClass = hasNextRound
      ? `has-next-round ${matchIndex % 2 === 0 ? "connect-down" : "connect-up"}`
      : "";

    return `
      <div
        class="bracket-public-match ${connectorClass} ${status.className}"
        style="--grid-row: ${startRow} / span ${rowSpan}; --connector-height: ${connectorHeight}px;"
      >
        <div class="bracket-public-player ${winnerA ? "winner" : ""}">
          <span>${escapeHTML(getPlayerName(playerA))}</span>
          <strong>${escapeHTML(scoreA)}</strong>
        </div>

        <div class="bracket-public-player ${winnerB ? "winner" : ""}">
          <span>${escapeHTML(getPlayerName(playerB))}</span>
          <strong>${escapeHTML(scoreB)}</strong>
        </div>

        <div class="bracket-public-match-footer">
          <span class="bracket-status-pill ${status.className}">${escapeHTML(status.label)}</span>
          ${winnerName ? `<span class="bracket-winner-label">Vencedor: ${escapeHTML(winnerName)}</span>` : ""}
        </div>
      </div>
    `;
  }

  function renderRounds(rounds) {
    if (!Array.isArray(rounds) || rounds.length === 0) {
      return `
        <div class="detail-card">
          <p>
            O chaveamento será exibido quando as partidas forem geradas.
          </p>
        </div>
      `;
    }

    const firstRoundMatches = Array.isArray(rounds[0]?.matches)
      ? rounds[0].matches.length
      : 1;

    const baseMatchCount = Math.max(firstRoundMatches, 1);
    const slotHeight = 118;

    return `
      <div class="bracket-public-area">
        <div class="bracket-public">
          ${rounds.map((round, roundIndex) => {
            const isLastRound = roundIndex === rounds.length - 1;
            const matches = Array.isArray(round.matches) ? round.matches : [];
            const rowSpan = Math.pow(2, roundIndex);

            return `
              <div class="bracket-public-round">
                <h4>${escapeHTML(round.name || round.label || `Rodada ${roundIndex + 1}`)}</h4>

                <div
                  class="bracket-public-round-matches"
                  style="--base-match-count: ${baseMatchCount};"
                >
                  ${matches.map((match, matchIndex) => {
                    const startRow = matchIndex * rowSpan + 1;
                    const connectorHeight = slotHeight * rowSpan;

                    return renderMatch(match, {
                      hasNextRound: !isLastRound,
                      matchIndex,
                      rowSpan,
                      startRow,
                      connectorHeight
                    });
                  }).join("")}
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;
  }

  function renderPlayoffs(tournament) {
    const structure = getTournamentStructure(tournament);

    const playoffs =
      structure?.playoffs ||
      tournament.playoffs ||
      structure?.bracket ||
      tournament.bracket ||
      null;

    if (!playoffs) {
      return `
        <div class="detail-card">
          <p>
            Os playoffs serão exibidos quando a fase eliminatória for gerada.
          </p>
        </div>
      `;
    }

    if (Array.isArray(playoffs.sides) && playoffs.sides.length > 0) {
      return `
        <div class="playoffs-public-block">
          ${playoffs.sides.map((side) => `
            <div class="detail-card public-bracket-card">
              <h4>${escapeHTML(side.label || side.name || "Chave")}</h4>
              ${renderRounds(side.rounds || [])}
            </div>
          `).join("")}

          ${
            playoffs.final
              ? `
                <div class="detail-card public-final-card">
                  <h4>${escapeHTML(playoffs.final.name || "Final Geral")}</h4>
                  ${renderMatch(playoffs.final)}
                </div>
              `
              : ""
          }

          ${
            playoffs.thirdPlace
              ? `
                <div class="detail-card public-final-card">
                  <h4>${escapeHTML(playoffs.thirdPlace.name || "Disputa de 3º lugar")}</h4>
                  ${renderMatch(playoffs.thirdPlace)}
                </div>
              `
              : ""
          }
        </div>
      `;
    }

    if (Array.isArray(playoffs.rounds) && playoffs.rounds.length > 0) {
      return renderRounds(playoffs.rounds);
    }

    return `
      <div class="detail-card">
        <p>
          A bracket existe, mas ainda não possui rodadas públicas para exibir.
        </p>
      </div>
    `;
  }

  function renderDoubleEliminationFinalsPublic(rounds) {
  if (!Array.isArray(rounds) || rounds.length === 0) {
    return `
      <div class="detail-card double-elim-placeholder">
        <strong>Grand Final em preparação</strong>
        <p>
          A Grand Final será exibida quando a progressão completa do Double Elimination
          estiver disponível.
        </p>
      </div>
    `;
  }

  return `
    <div class="double-elim-finals-grid">
      ${rounds.map((round, roundIndex) => {
        const matches = Array.isArray(round.matches)
          ? round.matches
          : [];

        return `
          <div class="detail-card double-elim-final-card">
            <span>${roundIndex === 0 ? "Final principal" : "Reset opcional"}</span>
            <h4>${escapeHTML(round.name || `Final ${roundIndex + 1}`)}</h4>

            ${
              matches.length > 0
                ? matches.map((match) => renderMatch(match)).join("")
                : `
                  <p class="double-elim-final-empty">
                    Partida ainda não definida.
                  </p>
                `
            }
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function renderDoubleEliminationPublic(tournament) {
  const structure = getTournamentStructure(tournament);

  if (!structure) {
    return `
      <div class="detail-card double-elim-placeholder">
        <strong>Double Elimination em preparação</strong>
        <p>
          O chaveamento Double Elimination será exibido quando o organizador gerar a estrutura.
        </p>
      </div>
    `;
  }

  const winnersRounds = Array.isArray(structure.winnersBracket)
    ? structure.winnersBracket
    : [];

  const losersRounds = Array.isArray(structure.losersBracket)
    ? structure.losersBracket
    : [];

  const grandFinalRounds = Array.isArray(structure.grandFinal?.rounds)
    ? structure.grandFinal.rounds
    : [];

  return `
    <div class="structure-block">

      <div class="detail-section-header">
        <span>Double Elimination</span>
        <h3>Winners Bracket</h3>
      </div>

      ${
        winnersRounds.length > 0
          ? renderRounds(winnersRounds)
          : `
            <div class="detail-card double-elim-placeholder">
              <strong>Winners Bracket em preparação</strong>
              <p>
                A Winners Bracket será exibida quando as partidas forem geradas.
              </p>
            </div>
          `
      }

      <div class="detail-section-header">
        <span>Double Elimination</span>
        <h3>Losers Bracket</h3>
      </div>

      ${
        losersRounds.length > 0
          ? renderRounds(losersRounds)
          : `
            <div class="detail-card double-elim-placeholder">
              <strong>Losers Bracket em preparação</strong>
              <p>
                A Losers Bracket ainda não foi gerada nesta versão. Ela será alimentada
                conforme os resultados da Winners Bracket forem refinados.
              </p>
            </div>
          `
      }

      <div class="detail-section-header">
        <span>Final</span>
        <h3>Grand Final</h3>
      </div>

      ${renderDoubleEliminationFinalsPublic(grandFinalRounds)}

    </div>
  `;
}
function renderStructureMeta(tournament) {
  const structure = getTournamentStructure(tournament);

  if (!structure) {
    return `
      <div class="detail-card structure-meta-card pending">
        <strong>Estrutura ainda não gerada</strong>
        <p>
          O organizador ainda não publicou a estrutura competitiva deste torneio.
        </p>
      </div>
    `;
  }

  const generatedAt = getStructureGeneratedAt(tournament);
  const generatedFrom = getStructureGeneratedFrom(tournament);
  const playersUsed = getStructurePlayersUsed(tournament);
  const totalSnapshot = Number(structure.totalParticipantsSnapshot || 0);
  const matchesCount = getTournamentMatches(tournament).length;
  const resultCounts = getResultCounts(tournament);
  const resultsUpdatedAt = getResultsUpdatedAt(tournament);
  const generatedDate = generatedAt ? new Date(generatedAt) : null;
  const generatedLabel = generatedDate && !Number.isNaN(generatedDate.getTime())
    ? generatedDate.toLocaleString("pt-BR")
    : (generatedAt || "Data não registrada");
  const sourceLabel = generatedFrom === "real-registrations" || generatedFrom === "supabase-real-registrations"
    ? "Inscritos reais do Supabase"
    : "Estrutura publicada";

  return `
    <div class="detail-card structure-meta-card">
      <div>
        <strong>Estrutura oficial publicada</strong>
        <p>
          Esta estrutura foi gerada pelo painel do organizador e está sendo lida do Supabase.
        </p>
      </div>

      <div class="structure-meta-grid">
        <span><b>Origem</b>${escapeHTML(sourceLabel)}</span>
        <span><b>Jogadores usados</b>${escapeHTML(playersUsed || "-")}${totalSnapshot ? ` / ${escapeHTML(totalSnapshot)}` : ""}</span>
        <span><b>Partidas</b>${escapeHTML(matchesCount || "A definir")}</span>
        <span><b>Resultados</b>${escapeHTML(resultCounts.completed)} / ${escapeHTML(resultCounts.total || matchesCount || 0)}</span>
        <span><b>Gerada em</b>${escapeHTML(generatedLabel)}</span>
        <span><b>Último resultado</b>${escapeHTML(formatDateTimeLabel(resultsUpdatedAt))}</span>
      </div>
    </div>
  `;
}

  function renderStructure(tournament) {
        const format = getTournamentFormat(tournament);
        const metaHtml = renderStructureMeta(tournament);
        const finalResultsHtml = renderFinalResultsSummary(tournament);

    if (format === "league") {
      return `
        <div class="structure-block">
          ${metaHtml}
          ${finalResultsHtml}

          <div class="detail-section-header">
            <span>Liga</span>
            <h3>Tabela de classificação</h3>
          </div>

          ${renderLeagueTable(tournament)}

          ${renderLeagueHistory(tournament)}
        </div>
      `;
    }

    if (format === "groups-playoffs") {
      return `
        <div class="structure-block">
          ${metaHtml}
          ${finalResultsHtml}

          <div class="detail-section-header">
            <span>Fase de grupos</span>
            <h3>Grupos e classificação</h3>
          </div>

          ${renderGroupPhaseHistory(tournament)}

          ${renderGroups(tournament)}

          <div class="detail-section-header">
            <span>Playoffs</span>
            <h3>Chaveamento público</h3>
          </div>

          ${renderPlayoffs(tournament)}
        </div>
      `;
    }

if (format === "double-elimination") {
  return `
    <div class="structure-block">
      ${metaHtml}
      ${finalResultsHtml}
      ${renderDoubleEliminationPublic(tournament)}
    </div>
  `;
}

    return `
      <div class="structure-block">
        ${metaHtml}
        ${hasGeneratedStructure(tournament) ? "" : `
          <div class="detail-card">
            <p>
              A estrutura competitiva será exibida quando o organizador gerar o torneio.
            </p>
          </div>
        `}
      </div>
    `;
  }

function hasDemoRegistration(tournamentId) {
  return sbwHasRegistration(tournamentId);
}

function isSupabaseRegistrationReady() {
  return Boolean(
    window.SBWSupabase &&
    typeof window.SBWSupabase.isEnabled === "function" &&
    window.SBWSupabase.isEnabled()
  );
}

function getLoginUrlForCurrentPage() {
  if (window.SBWAuth && typeof window.SBWAuth.getLoginUrl === "function") {
    return window.SBWAuth.getLoginUrl(window.location.href);
  }

  return "../auth/login.html";
}

async function hydrateDetailRegistrationState(tournament) {
  sbwCurrentDetailAuthUser = null;
  sbwCurrentDetailProfile = null;
  sbwCurrentDetailRegistration = null;
  sbwCurrentDetailParticipants = [];
  sbwCurrentDetailRegistrationChecked = false;

  if (!tournament || !isSupabaseRegistrationReady()) {
    sbwCurrentDetailRegistrationChecked = true;
    return;
  }

  try {
    if (typeof sbwGetSupabaseTournamentParticipants === "function") {
      sbwCurrentDetailParticipants = await sbwGetSupabaseTournamentParticipants(tournament);

      if (sbwCurrentDetailParticipants.length > 0) {
        tournament.participants = sbwCurrentDetailParticipants;
        tournament.currentParticipants = sbwCurrentDetailParticipants.length;
        tournament.participantsCount = sbwCurrentDetailParticipants.length;
      }
    }
  } catch (error) {
    console.warn("[SaberWolf Torneios] Não foi possível carregar participantes reais:", error);
  }

  try {
    if (!window.SBWAuth || typeof window.SBWAuth.getUser !== "function") {
      sbwCurrentDetailRegistrationChecked = true;
      return;
    }

    sbwCurrentDetailAuthUser = await window.SBWAuth.getUser();

    if (!sbwCurrentDetailAuthUser) {
      sbwCurrentDetailRegistrationChecked = true;
      return;
    }

    if (typeof window.SBWAuth.ensureCurrentUserProfile === "function") {
      sbwCurrentDetailProfile = await window.SBWAuth.ensureCurrentUserProfile();
    }

    if (typeof sbwGetCurrentTournamentRegistrationAsync === "function") {
      sbwCurrentDetailRegistration = await sbwGetCurrentTournamentRegistrationAsync(
        tournament,
        sbwCurrentDetailAuthUser
      );
    }
  } catch (error) {
    console.warn("[SaberWolf Torneios] Não foi possível verificar login/inscrição:", error);
  } finally {
    sbwCurrentDetailRegistrationChecked = true;
  }
}

function sbwBuildRegistrationViewState(tournament, registrationOpen) {
  const availability = sbwGetRegistrationAvailability(tournament);
  const supabaseMode = isSupabaseRegistrationReady();
  const localAlreadyRegistered = hasDemoRegistration(tournament.id);
  const alreadyRegistered = supabaseMode
    ? Boolean(sbwCurrentDetailRegistration)
    : localAlreadyRegistered;

  if (!registrationOpen) {
    return {
      availability,
      supabaseMode,
      alreadyRegistered,
      title: availability.label,
      description: availability.reason,
      notice: availability.maxParticipants && availability.className === "full"
        ? "O torneio atingiu o limite de vagas configurado pelo organizador."
        : "Quando o organizador abrir inscrições, jogadores logados poderão se registrar com a conta -SBW-.",
      buttonLabel: availability.className === "full" ? "Torneio lotado" : "Inscrição fechada",
      disabled: true
    };
  }

  if (alreadyRegistered) {
    return {
      availability,
      supabaseMode,
      alreadyRegistered: true,
      title: supabaseMode ? "Você já está inscrito" : "Inscrição simulada neste navegador",
      description: supabaseMode
        ? "Sua inscrição oficial foi encontrada. A próxima etapa será acompanhar check-in, cronograma e orientações do organizador."
        : "Esta inscrição foi registrada apenas no modo local-demo deste navegador.",
      notice: supabaseMode
        ? "Inscrição real vinculada à sua conta -SBW-."
        : "Modo demo: esta inscrição não vale como inscrição oficial em produção.",
      buttonLabel: supabaseMode ? "Inscrição confirmada" : "Inscrição já simulada",
      disabled: true
    };
  }

  if (supabaseMode && !sbwCurrentDetailAuthUser) {
    return {
      availability,
      supabaseMode,
      alreadyRegistered: false,
      requiresLogin: true,
      title: "Entre para se inscrever",
      description: "Para participar oficialmente, você precisa entrar com sua conta -SBW-. O sistema usará seu perfil público como dados de jogador.",
      notice: "Conta obrigatória: login por e-mail/senha ou provedor configurado no Supabase Auth.",
      buttonLabel: "Entrar para se inscrever",
      disabled: false
    };
  }

  if (supabaseMode) {
    return {
      availability,
      supabaseMode,
      alreadyRegistered: false,
      title: "Inscrições abertas",
      description: "Você está logado. Ao confirmar, sua inscrição será salva como inscrição real do torneio.",
      notice: "A inscrição fica vinculada à sua conta -SBW- e ao seu perfil público de jogador.",
      buttonLabel: "Confirmar inscrição",
      disabled: false
    };
  }

  return {
    availability,
    supabaseMode,
    alreadyRegistered: false,
    title: "Inscrições abertas em modo demonstração",
    description: "Supabase/Auth não está ativo nesta execução. A ação abaixo apenas simula o interesse de inscrição neste navegador.",
    notice: "Modo local-demo: para inscrição real, ative Supabase e crie a tabela tournament_participants.",
    buttonLabel: "Simular inscrição",
    disabled: false
  };
}

function renderRegistrationNotice(registrationState) {
  if (!registrationState?.notice) {
    return "";
  }

  return `
    <div class="registration-notice-card ${registrationState.supabaseMode ? "real" : "demo"}">
      <i class="fa-solid ${registrationState.supabaseMode ? "fa-shield-halved" : "fa-triangle-exclamation"}"></i>
      <p>
        <strong>${registrationState.supabaseMode ? "Sistema de inscrição" : "Aviso"}</strong>
        ${escapeHTML(registrationState.notice)}
      </p>
    </div>
  `;
}

function renderRegistrationPanel(tournament, registrationState, availability) {
  const maxLabel = availability.maxParticipants ? availability.maxParticipants : "∞";
  const checkInLabel = tournament.checkInTime || tournament.checkinStartsAt || tournament.checkin || "A definir";
  const accountLabel = registrationState.supabaseMode
    ? (registrationState.requiresLogin ? "Login obrigatório" : "Conta conectada")
    : "Modo demonstração";
  const progressStyle = availability.maxParticipants ? ` style="--registration-progress: ${availability.percent}%;"` : "";

  return `
    <div class="registration-panel">
      <div class="registration-status-card ${escapeHTML(availability.className)}">
        <div>
          <span>Status da inscrição</span>
          <strong>${escapeHTML(registrationState.title)}</strong>
          <p>${escapeHTML(registrationState.description)}</p>
        </div>

        <span class="registration-status-badge ${escapeHTML(availability.className)}">
          ${escapeHTML(availability.shortLabel)}
        </span>
      </div>

      <div class="registration-progress-card"${progressStyle}>
        <div class="registration-progress-head">
          <span>Vagas preenchidas</span>
          <strong>${escapeHTML(availability.participantsCount)} / ${escapeHTML(maxLabel)}</strong>
        </div>
        <div class="registration-progress-track"><span></span></div>
      </div>

      <div class="registration-flow-grid">
        <div class="registration-flow-card ${registrationState.requiresLogin ? "attention" : ""}">
          <i class="fa-solid fa-user-shield"></i>
          <span>Conta</span>
          <strong>${escapeHTML(accountLabel)}</strong>
        </div>

        <div class="registration-flow-card">
          <i class="fa-solid fa-clipboard-check"></i>
          <span>Check-in</span>
          <strong>${escapeHTML(checkInLabel)}</strong>
        </div>

        <div class="registration-flow-card">
          <i class="fa-solid fa-people-group"></i>
          <span>Participantes</span>
          <strong>${escapeHTML(availability.participantsCount)} inscritos</strong>
        </div>
      </div>

      ${renderRegistrationNotice(registrationState)}

      <button
        type="button"
        class="detail-btn registration-main-button"
        data-action="tournament-registration"
        data-tournament-id="${escapeHTML(tournament.id)}"
        ${registrationState.disabled ? "disabled" : ""}
      >
        <i class="fa-solid ${registrationState.requiresLogin ? "fa-right-to-bracket" : registrationState.alreadyRegistered ? "fa-circle-check" : "fa-ticket"}"></i>
        ${escapeHTML(registrationState.buttonLabel)}
      </button>
    </div>
  `;
}

function saveDetailRegistration(tournament, registrationData = {}) {
  if (!tournament) {
    return {
      success: false,
      message: "Torneio não encontrado."
    };
  }

  const tournamentId = tournament.id;
  const registrations = sbwGetRegistrations();

  if (registrations[tournamentId]) {
    return {
      success: false,
      message: "Você já simulou inscrição neste torneio neste navegador."
    };
  }

  registrations[tournamentId] = {
    tournamentId,
    tournamentName: tournament.name || tournament.title || "Torneio",
    status: "pending-login",
    createdAt: new Date().toISOString(),
    note: "Inscrição simulada. Na versão final, o usuário precisará estar logado na SaberWolf.",
    source: tournament.source || "local",
    ...registrationData
  };

  sbwSaveRegistrations(registrations);

  return {
    success: true,
    message: "Inscrição simulada registrada.",
    registration: registrations[tournamentId]
  };
}

async function handleTournamentRegistration(tournamentId) {
  if (sbwCurrentDetailRegistrationBusy) {
    return;
  }

  const tournament =
    findTournamentById(tournamentId) ||
    (
      sbwCurrentDetailTournament &&
      String(sbwCurrentDetailTournament.id) === String(tournamentId)
        ? sbwCurrentDetailTournament
        : null
    );

  if (!tournament) {
    alert("Torneio não encontrado.");
    return;
  }

  if (!isOpenForRegistration(tournament)) {
    alert("As inscrições deste torneio não estão abertas neste momento.");
    return;
  }

  if (isSupabaseRegistrationReady()) {
    if (!window.SBWAuth || typeof window.SBWAuth.getUser !== "function") {
      window.location.href = getLoginUrlForCurrentPage();
      return;
    }

    sbwCurrentDetailRegistrationBusy = true;

    try {
      sbwCurrentDetailAuthUser = await window.SBWAuth.getUser();

      if (!sbwCurrentDetailAuthUser) {
        window.location.href = getLoginUrlForCurrentPage();
        return;
      }

      if (typeof window.SBWAuth.ensureCurrentUserProfile === "function") {
        sbwCurrentDetailProfile = await window.SBWAuth.ensureCurrentUserProfile();
      }

      if (typeof sbwCreateTournamentRegistrationAsync !== "function") {
        alert("Função de inscrição Supabase não encontrada.");
        return;
      }

      const result = await sbwCreateTournamentRegistrationAsync(tournament, {
        authUser: sbwCurrentDetailAuthUser,
        profile: sbwCurrentDetailProfile
      });

      if (!result.success) {
        if (result.requiresLogin) {
          window.location.href = getLoginUrlForCurrentPage();
          return;
        }

        if (result.alreadyRegistered && result.registration) {
          sbwCurrentDetailRegistration = result.registration;
          renderTournament(tournament);
        }

        alert(result.message || "Não foi possível registrar a inscrição.");
        return;
      }

      sbwCurrentDetailRegistration = result.registration;

      if (result.registration) {
        const participants = Array.isArray(tournament.participants)
          ? [...tournament.participants]
          : [];

        participants.push(result.registration);
        tournament.participants = participants;
        tournament.currentParticipants = participants.length;
        tournament.participantsCount = participants.length;
      }

      alert("Inscrição confirmada com sucesso na sua conta -SBW-.");
      renderTournament(tournament);
    } finally {
      sbwCurrentDetailRegistrationBusy = false;
    }

    return;
  }

  const result = saveDetailRegistration(tournament);

  if (!result.success) {
    alert(result.message || "Não foi possível registrar a inscrição.");
    return;
  }

  alert("Inscrição simulada registrada. Ative Supabase/Auth para inscrição real.");

  renderTournament(tournament);
}

      function renderTournament(tournament) {

       const status = getStatusInfo(tournament.status);
       const participantsCount = getParticipantsCount(tournament);
       const maxParticipants = getMaxParticipants(tournament);
       const registrationAvailability = sbwGetRegistrationAvailability(tournament);
       const registrationOpen = registrationAvailability.open;
       const registrationState = sbwBuildRegistrationViewState(tournament, registrationOpen);
       const alreadyRegistered = registrationState.alreadyRegistered;
       const registrationButtonLabel = registrationState.buttonLabel;
       const registrationButtonDisabled = registrationState.disabled ? "disabled" : "";

    document.title = `${tournament.name || "Torneio"} | -SBW-`;

    root.innerHTML = `
      <div class="tournament-detail-page">

        <section class="detail-topbar" aria-label="Navegação do torneio">
          <a href="torneios.html" class="detail-back-link">
            <i class="fa-solid fa-arrow-left"></i>
            Torneios
          </a>
        </section>

        <section class="detail-hero"${sbwBuildTournamentHeroStyle(tournament)}>

          <div class="detail-hero-content">

            <div class="detail-hero-grid">

              <div class="detail-hero-main">

                <span class="status-pill ${escapeHTML(status.className)}">
                  ${escapeHTML(status.label)}
                </span>

                <h2>
                  ${escapeHTML(tournament.name || tournament.title || "Torneio sem nome")}
                </h2>

                <p>
                  ${escapeHTML(getDescription(tournament))}
                </p>

                <div class="detail-hero-tags">
                  <span><i class="fa-solid fa-gamepad"></i> ${escapeHTML(tournament.game || "Jogo a definir")}</span>
                  <span><i class="fa-solid fa-sitemap"></i> ${escapeHTML(getFormatLabel(getTournamentFormat(tournament)))}</span>
                  <span><i class="fa-solid fa-tv"></i> ${escapeHTML(tournament.platform || "Plataforma a definir")}</span>
                  <span><i class="fa-solid fa-shield-halved"></i> ${escapeHTML(getOrganizer(tournament))}</span>
                  <span class="detail-registration-tag ${escapeHTML(registrationAvailability.className)}"><i class="fa-solid fa-ticket"></i> ${escapeHTML(registrationAvailability.label)}</span>
                </div>

              </div>

              <aside class="detail-summary-card">

                <span class="status-pill ${escapeHTML(status.className)}">
                  ${escapeHTML(status.label)}
                </span>

                <div class="detail-summary-grid">

                  <div class="detail-summary-item">
                    <span>Participantes</span>
                    <strong>${participantsCount} / ${escapeHTML(maxParticipants)}</strong>
                  </div>

                  <div class="detail-summary-item">
                    <span>Inscrição</span>
                    <strong>${escapeHTML(registrationAvailability.shortLabel)}</strong>
                  </div>

                  <div class="detail-summary-item">
                    <span>Início</span>
                    <strong>${escapeHTML(formatDate(tournament.startDate))}</strong>
                  </div>

                  <div class="detail-summary-item">
                    <span>Horário</span>
                    <strong>${escapeHTML(tournament.startTime || "A definir")}</strong>
                  </div>

                  <div class="detail-summary-item">
                    <span>Check-in</span>
                    <strong>${escapeHTML(tournament.checkInTime || "A definir")}</strong>
                  </div>

                  <div class="detail-summary-item">
                    <span>Partidas</span>
                    <strong>${escapeHTML(tournament.matchFormat || "A definir")}</strong>
                  </div>

                  <div class="detail-summary-item">
                    <span>Premiação</span>
                    <strong>${escapeHTML(getPrize(tournament))}</strong>
                  </div>

                </div>

                <div class="detail-actions">
                  <button
                    type="button"
                    class="detail-btn"
                    data-action="tournament-registration"
                    data-tournament-id="${escapeHTML(tournament.id)}"
                    ${registrationButtonDisabled}
                  >
                    <i class="fa-solid ${alreadyRegistered ? "fa-circle-check" : registrationState.requiresLogin ? "fa-right-to-bracket" : "fa-ticket"}"></i>
                    ${escapeHTML(registrationButtonLabel)}
                  </button>

                  <a class="detail-btn secondary" href="#estrutura">
                    Ver estrutura
                  </a>
                </div>

              </aside>

            </div>

          </div>

        </section>

        <section class="detail-nav-section">

          <nav class="detail-nav">
            <a href="#visao-geral">Visão geral</a>
            <a href="#cronograma">Cronograma</a>
            <a href="#participantes">Participantes</a>
            <a href="#estrutura">Estrutura</a>
            <a href="#regras">Regras</a>
            <a href="#inscricao">Inscrição</a>
          </nav>

        </section>

        <section class="detail-content">

          <section class="detail-section" id="visao-geral">

            <div class="detail-section-header">
              <span>Visão geral</span>
              <h3>Informações do torneio</h3>
            </div>

            <div class="stats-grid">

              <div class="info-mini-card">
                <span>Organizador</span>
                <strong>${escapeHTML(getOrganizer(tournament))}</strong>
              </div>

              <div class="info-mini-card">
                <span>Formato</span>
                <strong>${escapeHTML(getFormatLabel(getTournamentFormat(tournament)))}</strong>
              </div>

              <div class="info-mini-card">
                <span>Jogo</span>
                <strong>${escapeHTML(tournament.game || "A definir")}</strong>
              </div>

              <div class="info-mini-card">
                <span>Plataforma</span>
                <strong>${escapeHTML(tournament.platform || "A definir")}</strong>
              </div>

            </div>

            <div class="detail-card">
              <p>${escapeHTML(getDescription(tournament))}</p>
            </div>

          </section>

          <section class="detail-section" id="cronograma">

            <div class="detail-section-header">
              <span>Cronograma</span>
              <h3>Datas e horários</h3>
            </div>

            <div class="timeline-grid">

              <div class="info-mini-card">
                <span>Check-in</span>
                <strong>${escapeHTML(tournament.checkInTime || "A definir")}</strong>
              </div>

              <div class="info-mini-card">
                <span>Data de início</span>
                <strong>${escapeHTML(formatDate(tournament.startDate))}</strong>
              </div>

              <div class="info-mini-card">
                <span>Horário de início</span>
                <strong>${escapeHTML(tournament.startTime || "A definir")}</strong>
              </div>

              <div class="info-mini-card">
                <span>Status</span>
                <strong>${escapeHTML(status.label)}</strong>
              </div>

            </div>

          </section>

          <section class="detail-section" id="participantes">

            <div class="detail-section-header">
              <span>Participantes</span>
              <h3>Inscritos e confirmados</h3>
            </div>

            ${renderParticipantsOverview(tournament, registrationAvailability)}
            ${renderParticipants(tournament)}

          </section>

          <section class="detail-section" id="estrutura">

            <div class="detail-section-header">
              <span>Competição</span>
              <h3>Estrutura pública</h3>
            </div>

            ${renderStructure(tournament)}

          </section>

          <section class="detail-section" id="regras">

            <div class="detail-section-header">
              <span>Regras</span>
              <h3>Regulamento do torneio</h3>
            </div>

            <div class="detail-card">
              <p>${escapeHTML(getRules(tournament))}</p>
            </div>

          </section>

          <section class="detail-section" id="inscricao">

            <div class="detail-section-header">
              <span>Inscrição</span>
              <h3>Participar do torneio</h3>
            </div>

            ${renderRegistrationPanel(tournament, registrationState, registrationAvailability)}

          </section>

        </section>

      </div>
    `;
  }

  root.addEventListener("click", function(event) {
    const button = event.target.closest("[data-action]");

    if (!button) {
      return;
    }

    const action = button.dataset.action;

    if (action === "tournament-registration") {
      event.preventDefault();
      handleTournamentRegistration(button.dataset.tournamentId);
    }
  });

function sbwWithTimeout(promise, timeoutMs = 8000) {
  return Promise.race([
    promise,
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(null);
      }, timeoutMs);
    })
  ]);
}

async function initTournamentDetailPage() {
  const tournamentId = getQueryParam("id");

  if (!tournamentId) {
    renderNotFound();
    return;
  }

  renderLoading();

  let tournament = null;

  try {
    tournament = await sbwWithTimeout(
      findTournamentByIdAsync(tournamentId),
      8000
    );
  } catch (error) {
    console.error("Erro ao inicializar detalhe do torneio:", error);
  }

  if (!tournament) {
    renderNotFound();
    return;
  }

  sbwCurrentDetailTournament = tournament;
  await hydrateDetailRegistrationState(tournament);
  renderTournament(tournament);

  if (window.location.hash) {
    const target = document.querySelector(window.location.hash);

    if (target) {
      setTimeout(() => {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }, 80);
    }
  }
}

initTournamentDetailPage();
