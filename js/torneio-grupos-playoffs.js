// SABERWOLF | GRUPOS + PLAYOFFS
// Controla a troca entre visão de grupos e bracket completa.

document.addEventListener("DOMContentLoaded", () => {
  setupFilters();
  setupPlayerHighlight();

  requestAnimationFrame(drawConnections);

  window.addEventListener("resize", () => {
    const bracketScroll = document.querySelector(".gpb-scroll");

    if (!bracketScroll?.hidden) {
      drawConnections();
    }
  });
});

function setupFilters() {
  const filters = document.querySelectorAll(".gpb-filter");
  const groupsView = document.getElementById("groupsView");
  const bracketScroll = document.querySelector(".gpb-scroll");
  const sideA = document.querySelector(".gpb-side-a");
  const sideB = document.querySelector(".gpb-side-b");
  const final = document.querySelector(".gpb-grand-final");
  const svg = document.getElementById("groupsPlayoffSvg");

  function resetPlayoffFocus() {
    sideA?.classList.remove("is-dimmed");
    sideB?.classList.remove("is-dimmed");
    final?.classList.remove("is-dimmed");
  }

  function showGroups() {
    if (groupsView) {
      groupsView.hidden = false;
    }

    if (bracketScroll) {
      bracketScroll.hidden = true;
    }

    resetPlayoffFocus();

    if (svg) {
      svg.innerHTML = "";
    }
  }

  function showPlayoffs(focus) {
    if (groupsView) {
      groupsView.hidden = true;
    }

    if (bracketScroll) {
      bracketScroll.hidden = false;
    }

    resetPlayoffFocus();

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

    requestAnimationFrame(drawConnections);
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

    const sourceRect = match.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    const sourceCenterX = sourceRect.left - boardRect.left + sourceRect.width / 2;
    const targetCenterX = targetRect.left - boardRect.left + targetRect.width / 2;

    const goingRight = targetCenterX > sourceCenterX;

    const x1 = goingRight
      ? sourceRect.right - boardRect.left
      : sourceRect.left - boardRect.left;

    const x2 = goingRight
      ? targetRect.left - boardRect.left
      : targetRect.right - boardRect.left;

    const y1 = sourceRect.top - boardRect.top + sourceRect.height / 2;
    const y2 = targetRect.top - boardRect.top + targetRect.height / 2;

    const midX = goingRight
      ? x1 + Math.max(14, (x2 - x1) / 2)
      : x1 - Math.max(14, (x1 - x2) / 2);

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

    path.setAttribute("class", "gpb-line");
    path.setAttribute("d", `M ${x1} ${y1} H ${midX} V ${y2} H ${x2}`);

    svg.appendChild(path);
  });
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
  return playerElement.dataset.player || playerElement.querySelector("strong")?.textContent.trim() || "";
}