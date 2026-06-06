// SABERWOLF | GROUPS CLASH BRACKET
// Grupos / Playoffs + linhas externas conectando nas laterais dos cards.

document.addEventListener("DOMContentLoaded", () => {
  setupFilters();
  setupPlayerHighlight();
  redrawBracket();

  window.addEventListener("resize", () => {
    const bracketScroll = document.querySelector(".gpb-scroll");
    if (!bracketScroll?.hidden) redrawBracket();
  });

  window.addEventListener("load", () => {
    const bracketScroll = document.querySelector(".gpb-scroll");
    if (!bracketScroll?.hidden) redrawBracket();
  });
});

function redrawBracket() {
  requestAnimationFrame(() => {
    requestAnimationFrame(drawConnections);
  });
}

function setupFilters() {
  const filters = document.querySelectorAll(".gpb-filter");
  const groupsView = document.getElementById("groupsView");
  const bracketScroll = document.querySelector(".gpb-scroll");
  const sideA = document.querySelector(".gpb-side-a");
  const sideB = document.querySelector(".gpb-side-b");
  const final = document.querySelector(".gpb-grand-final");
  const svg = document.getElementById("groupsPlayoffSvg");

  function resetFocus() {
    sideA?.classList.remove("is-dimmed");
    sideB?.classList.remove("is-dimmed");
    final?.classList.remove("is-dimmed");
  }

  function showGroups() {
    if (groupsView) groupsView.hidden = false;
    if (bracketScroll) bracketScroll.hidden = true;

    resetFocus();

    if (svg) {
      svg.innerHTML = "";
    }
  }

  function showPlayoffs(focus) {
    if (groupsView) groupsView.hidden = true;
    if (bracketScroll) bracketScroll.hidden = false;

    resetFocus();

    if (focus === "a") {
      sideB?.classList.add("is-dimmed");
      final?.classList.add("is-dimmed");
    }

    if (focus === "b") {
      sideA?.classList.add("is-dimmed");
      final?.classList.add("is-dimmed");
    }

    if (focus === "final") {
      sideA?.classList.add("is-dimmed");
      sideB?.classList.add("is-dimmed");
    }

    redrawBracket();
  }

  filters.forEach((button) => {
    button.addEventListener("click", () => {
      const focus = button.dataset.focus;

      filters.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");

      if (focus === "groups") {
        showGroups();
        return;
      }

      showPlayoffs(focus);
    });
  });
}

function drawConnections() {
  const board = document.getElementById("groupsPlayoffBoard");
  const svg = document.getElementById("groupsPlayoffSvg");
  const bracketScroll = document.querySelector(".gpb-scroll");

  if (!board || !svg || bracketScroll?.hidden) return;

  svg.innerHTML = "";

  const boardRect = board.getBoundingClientRect();
  const width = Math.ceil(board.scrollWidth || boardRect.width);
  const height = Math.ceil(board.scrollHeight || boardRect.height);

  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("width", width);
  svg.setAttribute("height", height);

  const matches = board.querySelectorAll(".gpb-match[data-next]");

  matches.forEach((match) => {
    const target = board.querySelector(`#${match.dataset.next}`);
    if (!target) return;

    const start = getConnectionAnchor(match, target, boardRect, "source");
    const end = getConnectionAnchor(target, match, boardRect, "target");

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("class", "gpb-line");
    path.setAttribute("d", buildOutsideConnector(start, end));

    svg.appendChild(path);
  });
}

function getConnectionAnchor(currentMatch, relatedMatch, boardRect, mode) {
  const currentRect = getPlayersStackRect(currentMatch);
  const relatedRect = getPlayersStackRect(relatedMatch);

  const currentCenterX = currentRect.left + currentRect.width / 2;
  const relatedCenterX = relatedRect.left + relatedRect.width / 2;

  const goingRight = relatedCenterX > currentCenterX;

  let x;

  if (mode === "source") {
    x = goingRight ? currentRect.right : currentRect.left;
  } else {
    x = goingRight ? currentRect.left : currentRect.right;
  }

  return {
    x: x - boardRect.left,
    y: currentRect.top + currentRect.height / 2 - boardRect.top,
    goingRight
  };
}

function getPlayersStackRect(match) {
  const players = Array.from(match.querySelectorAll(".gpb-player"));

  if (!players.length) {
    return match.getBoundingClientRect();
  }

  const rects = players.map((player) => player.getBoundingClientRect());

  const left = Math.min(...rects.map((rect) => rect.left));
  const right = Math.max(...rects.map((rect) => rect.right));
  const top = Math.min(...rects.map((rect) => rect.top));
  const bottom = Math.max(...rects.map((rect) => rect.bottom));

  return {
    left,
    right,
    top,
    bottom,
    width: right - left,
    height: bottom - top
  };
}

function buildOutsideConnector(start, end) {
  const x1 = start.x;
  const y1 = start.y;
  const x2 = end.x;
  const y2 = end.y;

  const goingRight = x2 > x1;
  const dir = goingRight ? 1 : -1;

  const distanceX = Math.abs(x2 - x1);

  /*
    Linha sempre sai do card, anda um pouco para fora,
    faz a curva no corredor entre colunas e entra no próximo card.
  */
  const exitGap = Math.max(10, Math.min(18, distanceX * 0.18));
  const midX = x1 + dir * (distanceX / 2);

  const xOut = x1 + dir * exitGap;
  const xIn = x2 - dir * exitGap;

  const radius = 8;

  if (Math.abs(y2 - y1) < 3) {
    return `
      M ${x1} ${y1}
      H ${xOut}
      C ${xOut + dir * radius} ${y1}, ${xIn - dir * radius} ${y2}, ${xIn} ${y2}
      H ${x2}
    `;
  }

  return `
    M ${x1} ${y1}
    H ${xOut}
    C ${xOut + dir * radius} ${y1}, ${midX} ${y1}, ${midX} ${y1}
    V ${y2}
    C ${midX} ${y2}, ${xIn - dir * radius} ${y2}, ${xIn} ${y2}
    H ${x2}
  `;
}

function setupPlayerHighlight() {
  const board = document.getElementById("groupsPlayoffBoard");
  if (!board) return;

  const players = board.querySelectorAll(".gpb-player");

  players.forEach((player) => {
    player.addEventListener("mouseenter", () => {
      const name = getPlayerName(player);
      if (!name) return;

      board.classList.add("is-tracing");

      players.forEach((item) => {
        if (getPlayerName(item) === name) {
          item.classList.add("is-highlighted");
        }
      });
    });

    player.addEventListener("mouseleave", () => {
      board.classList.remove("is-tracing");
      players.forEach((item) => item.classList.remove("is-highlighted"));
    });
  });
}

function getPlayerName(playerElement) {
  return (
    playerElement.dataset.player ||
    playerElement.querySelector("strong")?.textContent.trim() ||
    ""
  );
}