// ===============================
// SABERWOLF | TORNEIO DEMO
// Abas, inscrição fake, cronômetro,
// participantes, timeline e bracket.
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  setupTournamentTabs();
  setupOpenTabButtons();
  setupCountdown();
  setupSignupForm();
  setupParticipantToggle();
  setupTimelineDays();
  setupBracketRounds();
  setupOverlayDemo();
});

function setupTournamentTabs() {
  const tabs = document.querySelectorAll(".td-tab");
  const panels = document.querySelectorAll(".td-tab-panel");

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
  const openButtons = document.querySelectorAll("[data-open-tab]");

  openButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.openTab;
      const targetTab = document.querySelector(`.td-tab[data-tab="${target}"]`);

      if (targetTab) {
        targetTab.click();
        document.querySelector(".td-content")?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  });
}

function setupCountdown() {
  const countdown = document.getElementById("tournamentCountdown");

  if (!countdown) return;

  const startValue = countdown.dataset.start;
  const startDate = new Date(startValue).getTime();

  const dayElement = document.getElementById("countDays");
  const hourElement = document.getElementById("countHours");
  const minuteElement = document.getElementById("countMinutes");
  const secondElement = document.getElementById("countSeconds");
  const messageElement = document.getElementById("countdownMessage");

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = startDate - now;

    if (distance <= 0) {
      dayElement.textContent = "00";
      hourElement.textContent = "00";
      minuteElement.textContent = "00";
      secondElement.textContent = "00";

      if (messageElement) {
        messageElement.textContent = "Torneio iniciado ou data demonstrativa encerrada.";
      }

      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((distance / (1000 * 60)) % 60);
    const seconds = Math.floor((distance / 1000) % 60);

    dayElement.textContent = String(days).padStart(2, "0");
    hourElement.textContent = String(hours).padStart(2, "0");
    minuteElement.textContent = String(minutes).padStart(2, "0");
    secondElement.textContent = String(seconds).padStart(2, "0");
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

function setupSignupForm() {
  const form = document.getElementById("signupForm");
  const success = document.getElementById("signupSuccess");

  if (!form || !success) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    success.classList.add("active");

    success.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  });
}

function setupParticipantToggle() {
  const button = document.getElementById("toggleParticipants");
  const grid = document.getElementById("participantGrid");

  if (!button || !grid) return;

  button.addEventListener("click", () => {
    grid.classList.toggle("active");

    const isOpen = grid.classList.contains("active");
    button.textContent = isOpen ? "Ocultar participantes em destaque" : "Ver participantes em destaque";
  });
}

function setupTimelineDays() {
  const buttons = document.querySelectorAll(".td-day-button");
  const days = document.querySelectorAll(".td-timeline-day");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.day;

      buttons.forEach((item) => item.classList.remove("active"));
      days.forEach((day) => day.classList.remove("active"));

      button.classList.add("active");
      document.getElementById(target)?.classList.add("active");
    });
  });
}

function setupBracketRounds() {
  const buttons = document.querySelectorAll(".td-round-button");
  const rounds = document.querySelectorAll(".td-bracket-round");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.round;

      buttons.forEach((item) => item.classList.remove("active"));
      rounds.forEach((round) => round.classList.remove("active"));

      button.classList.add("active");
      document.getElementById(target)?.classList.add("active");
    });
  });
}

function setupOverlayDemo() {
  const button = document.getElementById("generateOverlay");
  const message = document.getElementById("overlayMessage");

  if (!button || !message) return;

  button.addEventListener("click", () => {
    message.classList.add("active");
    button.innerHTML = '<i class="fa-solid fa-check"></i> Card preparado';
  });
}
