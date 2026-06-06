// SABERWOLF | SF6 OPEN BRACKET
// Double elimination FGC + navegação por fases 1/2/3/4.

document.addEventListener("DOMContentLoaded", () => {
  setupStageNavigation();
  setupPlayerPathHighlight();

  applyStage(1);
  redrawBracket();

  window.addEventListener("resize", redrawBracket);
  window.addEventListener("load", redrawBracket);
});

let currentStage = 1;
const minStage = 1;
const maxStage = 4;

function setupStageNavigation() {
  const stageButtons = document.querySelectorAll(".stage-step");
  const arrows = document.querySelectorAll("[data-stage-control]");

  stageButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const stage = Number(button.dataset.stageTarget);
      applyStage(stage);
    });
  });

  arrows.forEach((button) => {
    button.addEventListener("click", () => {
      const control = button.dataset.stageControl;

      if (control === "prev") {
        applyStage(Math.max(minStage, currentStage - 1));
      }

      if (control === "next") {
        applyStage(Math.min(maxStage, currentStage + 1));
      }
    });
  });
}

function applyStage(stage) {
  currentStage = Number(stage);

  const board = document.getElementById("bracketBoard");
  const stageButtons = document.querySelectorAll(".stage-step");
  const stageBlocks = document.querySelectorAll(
    ".bracket-column[data-stage], .bracket-track-finals[data-stage]"
  );

  if (board) {
    board.dataset.activeStage = String(currentStage);
  }

  stageButtons.forEach((button) => {
    const buttonStage = Number(button.dataset.stageTarget);
    button.classList.toggle("active", buttonStage === currentStage);
  });

  stageBlocks.forEach((block) => {
    const blockStage = Number(block.dataset.stage);

    if (blockStage < currentStage) {
      block.hidden = true;
    } else {
      block.hidden = false;
    }
  });

  redrawBracket();
}

function redrawBracket() {
  requestAnimationFrame(() => {
    requestAnimationFrame(drawBracketConnections);
  });
}

function drawBracketConnections() {
  const board = document.getElementById("bracketBoard");
  const svg = document.getElementById("bracketSvg");

  if (!board || !svg) return;

  svg.innerHTML = "";

  const boardRect = board.getBoundingClientRect();
  const width = Math.ceil(board.scrollWidth || boardRect.width);
  const height = Math.ceil(board.scrollHeight || boardRect.height);

  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("width", width);
  svg.setAttribute("height", height);

  const matches = board.querySelectorAll(".match-card[data-next]");

  matches.forEach((match) => {
    const nextId = match.dataset.next;
    const target = board.querySelector(`#${nextId}`);

    if (!target) return;
    if (!isElementVisible(match) || !isElementVisible(target)) return;

    const start = getConnectionAnchor(match, target, boardRect, "source");
    const end = getConnectionAnchor(target, match, boardRect, "target");

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

    path.setAttribute("class", "bracket-line");
    path.setAttribute("d", buildOutsideConnector(start, end));

    svg.appendChild(path);
  });
}

function isElementVisible(element) {
  if (!element) return false;
  if (element.hidden) return false;
  if (element.closest("[hidden]")) return false;

  const rect = element.getBoundingClientRect();

  return rect.width > 0 && rect.height > 0;
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
  const players = Array.from(match.querySelectorAll(".player"));

  if (!players.length) {
    const rect = match.getBoundingClientRect();

    return {
      left: rect.left,
      right: rect.right,
      top: rect.top,
      bottom: rect.bottom,
      width: rect.width,
      height: rect.height
    };
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
  const exitGap = Math.max(8, Math.min(16, distanceX * 0.18));
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

function setupPlayerPathHighlight() {
  const board = document.getElementById("bracketBoard");

  if (!board) return;

  const players = board.querySelectorAll(".player");

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