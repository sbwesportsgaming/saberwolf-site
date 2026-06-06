(function () {
  "use strict";

  const transfers = Array.isArray(window.SBWTransfersDemoData)
    ? window.SBWTransfersDemoData
    : [];

  const elements = {
    stats: document.getElementById("transferStats"),
    list: document.getElementById("transferList"),
    empty: document.getElementById("transferEmpty"),
    search: document.getElementById("transferSearch"),
    type: document.getElementById("transferTypeFilter"),
    game: document.getElementById("transferGameFilter"),
    clear: document.getElementById("clearTransferFilters")
  };

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function normalizeText(value) {
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function formatDate(dateValue) {
    if (!dateValue) return "Data não informada";

    const date = new Date(dateValue + "T12:00:00");

    if (Number.isNaN(date.getTime())) {
      return dateValue;
    }

    return date.toLocaleDateString("pt-BR");
  }

  function getPlayerUrl(transfer) {
    if (!transfer.playerId) return "";
    return "../perfis/perfil.html?id=" + encodeURIComponent(transfer.playerId);
  }

  function getTeamUrl(teamId) {
    if (!teamId) return "";
    return "../equipes/equipe.html?id=" + encodeURIComponent(teamId);
  }

  function getTypeClass(type) {
    if (type === "signing") return "is-signing";
    if (type === "transfer") return "is-transfer";
    if (type === "release") return "is-release";
    if (type === "internal") return "is-internal";
    return "";
  }

  function renderStats(data) {
    const total = data.length;
    const signings = data.filter((item) => item.type === "signing").length;
    const transfersCount = data.filter((item) => item.type === "transfer").length;
    const releases = data.filter((item) => item.type === "release").length;

    elements.stats.innerHTML = `
      <article class="sbw-stat-card">
        <span>Total</span>
        <strong>${total}</strong>
      </article>

      <article class="sbw-stat-card">
        <span>Contratações</span>
        <strong>${signings}</strong>
      </article>

      <article class="sbw-stat-card">
        <span>Transferências</span>
        <strong>${transfersCount}</strong>
      </article>

      <article class="sbw-stat-card">
        <span>Saídas</span>
        <strong>${releases}</strong>
      </article>
    `;
  }

  function renderGameOptions() {
    const games = Array.from(
      new Set(
        transfers
          .map((transfer) => transfer.game)
          .filter(Boolean)
      )
    ).sort();

    games.forEach((game) => {
      const option = document.createElement("option");
      option.value = game;
      option.textContent = game;
      elements.game.appendChild(option);
    });
  }

  function teamChip(teamId, teamName, teamTag, extraClass) {
    const url = getTeamUrl(teamId);
    const content = `
      <span class="sbw-team-tag">${escapeHtml(teamTag || "FA")}</span>
      <span>${escapeHtml(teamName || "Sem clube")}</span>
    `;

    if (!url) {
      return `<div class="sbw-team-chip ${extraClass || ""}">${content}</div>`;
    }

    return `
      <a class="sbw-team-chip ${extraClass || ""}" href="${escapeHtml(url)}">
        ${content}
      </a>
    `;
  }

  function renderTransferCard(transfer) {
    const playerUrl = getPlayerUrl(transfer);
    const typeClass = getTypeClass(transfer.type);
    const playerName = transfer.playerName || transfer.nickname || "Jogador";

    return `
      <article class="sbw-transfer-card ${typeClass}">
        <div class="sbw-transfer-top">
          <span class="sbw-transfer-type">${escapeHtml(transfer.typeLabel || "Movimentação")}</span>
          <span class="sbw-transfer-date">${escapeHtml(formatDate(transfer.date))}</span>
        </div>

        <div class="sbw-transfer-player">
          ${
            playerUrl
              ? `<a href="${escapeHtml(playerUrl)}">${escapeHtml(playerName)}</a>`
              : `<strong>${escapeHtml(playerName)}</strong>`
          }
          <span>${escapeHtml(transfer.game || "Modalidade não informada")}</span>
        </div>

        <div class="sbw-transfer-route">
          ${teamChip(transfer.fromTeamId, transfer.fromTeamName, transfer.fromTeamTag, "from")}
          <div class="sbw-transfer-arrow">→</div>
          ${teamChip(transfer.toTeamId, transfer.toTeamName, transfer.toTeamTag, "to")}
        </div>

        <p class="sbw-transfer-description">
          ${escapeHtml(transfer.description || "")}
        </p>

        <div class="sbw-transfer-footer">
          <span>${escapeHtml(transfer.category || "Geral")}</span>
          <span>Status: concluída</span>
        </div>
      </article>
    `;
  }

  function getFilteredTransfers() {
    const searchValue = normalizeText(elements.search.value);
    const typeValue = elements.type.value;
    const gameValue = elements.game.value;

    return transfers.filter((transfer) => {
      const searchHaystack = normalizeText([
        transfer.playerName,
        transfer.nickname,
        transfer.fromTeamName,
        transfer.fromTeamTag,
        transfer.toTeamName,
        transfer.toTeamTag,
        transfer.game,
        transfer.category,
        transfer.typeLabel,
        transfer.date
      ].join(" "));

      const matchesSearch = !searchValue || searchHaystack.includes(searchValue);
      const matchesType = typeValue === "all" || transfer.type === typeValue;
      const matchesGame = gameValue === "all" || transfer.game === gameValue;

      return matchesSearch && matchesType && matchesGame;
    });
  }

  function render() {
    const filtered = getFilteredTransfers();

    renderStats(filtered);

    elements.list.innerHTML = filtered.map(renderTransferCard).join("");
    elements.empty.hidden = filtered.length > 0;
  }

  function clearFilters() {
    elements.search.value = "";
    elements.type.value = "all";
    elements.game.value = "all";
    render();
  }

  function bindEvents() {
    elements.search.addEventListener("input", render);
    elements.type.addEventListener("change", render);
    elements.game.addEventListener("change", render);
    elements.clear.addEventListener("click", clearFilters);
  }

  function init() {
    renderGameOptions();
    bindEvents();
    render();
  }

  init();
})();