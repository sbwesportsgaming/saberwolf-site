// SABERWOLF | TORNEIO PONTOS CORRIDOS
// Protótipo com tabela automática, rodadas e partidas.

const leaguePlayers = [
  "Elitz",
  "Seed 01",
  "Maya Loop",
  "WolfRyu",
  "ShadowKen",
  "FGC Minas",
  "Kaiser",
  "BlueDrive",
  "Akane",
  "PixelAkuma",
  "SaberClaw",
  "TigerRush"
];

const leagueMatches = [
  { round: 1, p1: "Elitz", p2: "TigerRush", s1: 2, s2: 0, status: "done" },
  { round: 1, p1: "Seed 01", p2: "SaberClaw", s1: 2, s2: 0, status: "done" },
  { round: 1, p1: "Maya Loop", p2: "PixelAkuma", s1: 2, s2: 1, status: "done" },
  { round: 1, p1: "WolfRyu", p2: "Akane", s1: 2, s2: 1, status: "done" },
  { round: 1, p1: "ShadowKen", p2: "BlueDrive", s1: 2, s2: 0, status: "done" },
  { round: 1, p1: "FGC Minas", p2: "Kaiser", s1: 1, s2: 2, status: "done" },

  { round: 2, p1: "Elitz", p2: "SaberClaw", s1: 2, s2: 0, status: "done" },
  { round: 2, p1: "Seed 01", p2: "PixelAkuma", s1: 2, s2: 1, status: "done" },
  { round: 2, p1: "Maya Loop", p2: "Akane", s1: 2, s2: 0, status: "done" },
  { round: 2, p1: "WolfRyu", p2: "BlueDrive", s1: 2, s2: 1, status: "done" },
  { round: 2, p1: "ShadowKen", p2: "Kaiser", s1: 2, s2: 1, status: "done" },
  { round: 2, p1: "FGC Minas", p2: "TigerRush", s1: 2, s2: 0, status: "done" },

  { round: 3, p1: "Elitz", p2: "PixelAkuma", s1: 2, s2: 0, status: "done" },
  { round: 3, p1: "Seed 01", p2: "Akane", s1: 2, s2: 0, status: "done" },
  { round: 3, p1: "Maya Loop", p2: "BlueDrive", s1: 2, s2: 1, status: "done" },
  { round: 3, p1: "WolfRyu", p2: "Kaiser", s1: 1, s2: 2, status: "done" },
  { round: 3, p1: "ShadowKen", p2: "TigerRush", s1: 2, s2: 0, status: "done" },
  { round: 3, p1: "FGC Minas", p2: "SaberClaw", s1: 2, s2: 1, status: "done" },

  { round: 4, p1: "Elitz", p2: "Akane", s1: 0, s2: 0, status: "live" },
  { round: 4, p1: "Seed 01", p2: "BlueDrive", s1: null, s2: null, status: "pending" },
  { round: 4, p1: "Maya Loop", p2: "Kaiser", s1: null, s2: null, status: "pending" },
  { round: 4, p1: "WolfRyu", p2: "TigerRush", s1: null, s2: null, status: "pending" },
  { round: 4, p1: "ShadowKen", p2: "SaberClaw", s1: null, s2: null, status: "pending" },
  { round: 4, p1: "FGC Minas", p2: "PixelAkuma", s1: null, s2: null, status: "pending" },

  { round: 5, p1: "Elitz", p2: "BlueDrive", s1: null, s2: null, status: "pending" },
  { round: 5, p1: "Seed 01", p2: "Kaiser", s1: null, s2: null, status: "pending" },
  { round: 5, p1: "Maya Loop", p2: "TigerRush", s1: null, s2: null, status: "pending" },
  { round: 5, p1: "WolfRyu", p2: "SaberClaw", s1: null, s2: null, status: "pending" },
  { round: 5, p1: "ShadowKen", p2: "PixelAkuma", s1: null, s2: null, status: "pending" },
  { round: 5, p1: "FGC Minas", p2: "Akane", s1: null, s2: null, status: "pending" }
];

document.addEventListener("DOMContentLoaded", () => {
  setupLeagueTabs();
  setupOpenTabButtons();

  renderLeague();
});

function setupLeagueTabs() {
  const tabs = document.querySelectorAll(".league-tab");
  const panels = document.querySelectorAll(".league-tab-panel");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.tab;

      tabs.forEach((item) => item.classList.remove("active"));
      panels.forEach((panel) => panel.classList.remove("active"));

      tab.classList.add("active");
      document.getElementById(target)?.classList.add("active");
    });
  });
}

function setupOpenTabButtons() {
  const buttons = document.querySelectorAll("[data-open-tab]");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.openTab;
      const tab = document.querySelector(`.league-tab[data-tab="${target}"]`);

      if (tab) {
        tab.click();

        document.querySelector(".league-content")?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  });
}

function renderLeague() {
  const standings = calculateStandings();

  renderStats(standings);
  renderStandings(standings);
  renderHighlights(standings);
  renderRoundNavigation();
  renderRound(4);
  renderMatchFeed();
}

function calculateStandings() {
  const table = leaguePlayers.map((name) => ({
    name,
    played: 0,
    wins: 0,
    losses: 0,
    setsWon: 0,
    setsLost: 0,
    points: 0
  }));

  const tableByName = new Map(table.map((item) => [item.name, item]));

  leagueMatches
    .filter((match) => match.status === "done")
    .forEach((match) => {
      const player1 = tableByName.get(match.p1);
      const player2 = tableByName.get(match.p2);

      if (!player1 || !player2) return;

      player1.played += 1;
      player2.played += 1;

      player1.setsWon += match.s1;
      player1.setsLost += match.s2;

      player2.setsWon += match.s2;
      player2.setsLost += match.s1;

      if (match.s1 > match.s2) {
        player1.wins += 1;
        player1.points += 3;
        player2.losses += 1;
      } else {
        player2.wins += 1;
        player2.points += 3;
        player1.losses += 1;
      }
    });

  return table
    .map((player) => ({
      ...player,
      setDiff: player.setsWon - player.setsLost,
      winRate: player.played ? Math.round((player.wins / player.played) * 100) : 0
    }))
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.setDiff !== a.setDiff) return b.setDiff - a.setDiff;
      if (b.wins !== a.wins) return b.wins - a.wins;
      return b.setsWon - a.setsWon;
    });
}

function renderStats(standings) {
  const stats = document.getElementById("leagueStats");
  if (!stats) return;

  const completedMatches = leagueMatches.filter((match) => match.status === "done").length;
  const pendingMatches = leagueMatches.filter((match) => match.status === "pending").length;
  const liveMatches = leagueMatches.filter((match) => match.status === "live").length;
  const leader = standings[0];

  stats.innerHTML = `
    <article>
      <span>Jogadores</span>
      <strong>${leaguePlayers.length}</strong>
      <p>participantes ativos</p>
    </article>

    <article>
      <span>Partidas jogadas</span>
      <strong>${completedMatches}</strong>
      <p>resultados cadastrados</p>
    </article>

    <article>
      <span>Ao vivo</span>
      <strong>${liveMatches}</strong>
      <p>partida em andamento</p>
    </article>

    <article>
      <span>Líder</span>
      <strong>${leader.name}</strong>
      <p>${leader.points} pontos</p>
    </article>
  `;
}

function renderStandings(standings) {
  const tbody = document.getElementById("leagueTableBody");
  if (!tbody) return;

  tbody.innerHTML = standings.map((player, index) => {
    const position = index + 1;
    const isTopCut = position === 1;

    return `
      <tr class="${isTopCut ? "top-cut" : ""}">
        <td class="league-position">${position}</td>
        <td class="league-player-name">${player.name}</td>
        <td>${player.played}</td>
        <td>${player.wins}</td>
        <td>${player.losses}</td>
        <td>${player.setsWon}-${player.setsLost}</td>
        <td>${player.setDiff > 0 ? "+" : ""}${player.setDiff}</td>
        <td>${player.winRate}%</td>
        <td><strong>${player.points}</strong></td>
        <td>
          <span class="league-status-badge ${position === 1 ? "qualified" : "chasing"}">
            ${position === 1 ? "Líder" : "Disputa"}
        </span>
            
        </td>
      </tr>
    `;
  }).join("");
}

function renderHighlights(standings) {
  const highlights = document.getElementById("leagueHighlights");
  if (!highlights) return;

  const leader = standings[0];
  const bestDiff = [...standings].sort((a, b) => b.setDiff - a.setDiff)[0];
  const chase = standings[4];

  highlights.innerHTML = `
    <article>
      <span>Líder atual</span>
      <strong>${leader.name}</strong>
      <p>${leader.points} pts · ${leader.winRate}% WR</p>
    </article>

    <article>
      <span>Melhor saldo</span>
      <strong>${bestDiff.name}</strong>
      <p>${bestDiff.setDiff > 0 ? "+" : ""}${bestDiff.setDiff} de saldo de sets</p>
    </article>

    <article>
      <span>Na caça ao top 4</span>
      <strong>${chase.name}</strong>
      <p>${chase.points} pts · precisa vencer próximas rodadas</p>
    </article>
  `;
}

function renderRoundNavigation() {
  const nav = document.getElementById("leagueRoundNav");
  if (!nav) return;

  const rounds = [...new Set(leagueMatches.map((match) => match.round))];

  nav.innerHTML = rounds.map((round) => `
    <button
      class="league-round-btn ${round === 4 ? "active" : ""}"
      type="button"
      data-round="${round}">
      Rodada ${round}
    </button>
  `).join("");

  const buttons = nav.querySelectorAll(".league-round-btn");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");

      renderRound(Number(button.dataset.round));
    });
  });
}

function renderRound(round) {
  const list = document.getElementById("leagueRoundList");
  if (!list) return;

  const matches = leagueMatches.filter((match) => match.round === round);

  list.innerHTML = matches.map(renderMatchCard).join("");
}

function renderMatchFeed() {
  const feed = document.getElementById("leagueMatchFeed");
  if (!feed) return;

  feed.innerHTML = leagueMatches.map(renderMatchCard).join("");
}

function renderMatchCard(match) {
  const score = match.status === "pending"
    ? "x"
    : `${match.s1} - ${match.s2}`;

  const p1Winner = match.status !== "pending" && match.s1 > match.s2;
  const p2Winner = match.status !== "pending" && match.s2 > match.s1;

  const statusText = {
    done: "Finalizada",
    pending: "Pendente",
    live: "Ao vivo"
  }[match.status];

  return `
    <article class="league-match-card">
      <small>Rodada ${match.round}</small>

      <div class="league-match-versus">
        <div class="league-match-player ${p1Winner ? "winner" : ""}">
          ${match.p1}
        </div>

        <strong class="league-match-score">${score}</strong>

        <div class="league-match-player ${p2Winner ? "winner" : ""}">
          ${match.p2}
        </div>
      </div>

      <span class="league-match-status ${match.status}">
        ${statusText}
      </span>
    </article>
  `;
}