(function () {
  "use strict";

  if (window.SBWPageState) return;

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function getTarget(target) {
    if (!target) return null;
    if (typeof target === "string") return document.querySelector(target);
    return target;
  }

  function makeSkeletonRows(count) {
    const total = Number.isFinite(Number(count)) ? Number(count) : 4;
    return Array.from({ length: Math.max(1, total) })
      .map(
        (_, index) => `
          <span class="sbw-skeleton-line ${index === 0 ? "is-wide" : ""}" aria-hidden="true"></span>
        `
      )
      .join("");
  }

  function renderLoading(target, options = {}) {
    const el = getTarget(target);
    if (!el) return;

    const title = options.title || "Carregando dados";
    const message = options.message || "Aguarde enquanto a -SBW- prepara esta área.";
    const rows = options.rows || 4;

    el.innerHTML = `
      <section class="sbw-page-state sbw-page-state--loading" aria-live="polite" aria-busy="true">
        <div class="sbw-page-state__orb" aria-hidden="true"></div>
        <div>
          <strong>${escapeHtml(title)}</strong>
          <p>${escapeHtml(message)}</p>
          <div class="sbw-skeleton-stack">
            ${makeSkeletonRows(rows)}
          </div>
        </div>
      </section>
    `;
  }

  function renderEmpty(target, options = {}) {
    const el = getTarget(target);
    if (!el) return;

    const title = options.title || "Nada encontrado";
    const message = options.message || "Ainda não há dados suficientes para exibir esta área.";
    const action = options.action || null;

    el.innerHTML = `
      <section class="sbw-page-state sbw-page-state--empty" aria-live="polite">
        <div class="sbw-page-state__icon" aria-hidden="true">◇</div>
        <div>
          <strong>${escapeHtml(title)}</strong>
          <p>${escapeHtml(message)}</p>
          ${
            action?.href && action?.label
              ? `<a class="sbw-page-state__action" href="${escapeHtml(action.href)}">${escapeHtml(action.label)}</a>`
              : ""
          }
        </div>
      </section>
    `;
  }

  function renderError(target, options = {}) {
    const el = getTarget(target);
    if (!el) return;

    const title = options.title || "Não foi possível carregar";
    const message = options.message || "Atualize a página e tente novamente.";
    const details = options.details || "";

    el.innerHTML = `
      <section class="sbw-page-state sbw-page-state--error" aria-live="assertive">
        <div class="sbw-page-state__icon" aria-hidden="true">!</div>
        <div>
          <strong>${escapeHtml(title)}</strong>
          <p>${escapeHtml(message)}</p>
          ${details ? `<small>${escapeHtml(details)}</small>` : ""}
          <button class="sbw-page-state__button" type="button" data-sbw-page-reload>Recarregar</button>
        </div>
      </section>
    `;

    const reloadButton = el.querySelector("[data-sbw-page-reload]");
    if (reloadButton) {
      reloadButton.addEventListener("click", () => window.location.reload());
    }
  }

  function setBusy(target, isBusy) {
    const el = getTarget(target);
    if (!el) return;

    el.toggleAttribute("aria-busy", Boolean(isBusy));
    el.classList.toggle("is-sbw-loading", Boolean(isBusy));
  }

  function markReady() {
    document.body.classList.remove("sbw-page-booting");
    document.body.classList.add("sbw-page-ready");
  }

  function markBooting() {
    document.body.classList.add("sbw-page-booting");
    document.body.classList.remove("sbw-page-ready");
  }

  async function safeRun(target, callback, options = {}) {
    const el = getTarget(target);

    try {
      if (el && options.loading !== false) {
        renderLoading(el, options.loadingOptions || {});
      }

      const result = await callback();
      markReady();
      return result;
    } catch (error) {
      console.error("[SBWPageState] Falha ao carregar área:", error);

      if (el) {
        renderError(el, {
          title: options.errorTitle || "Erro ao carregar área",
          message: options.errorMessage || "Ocorreu uma falha temporária ao carregar os dados.",
          details: error?.message || ""
        });
      }

      markReady();
      return null;
    }
  }

  window.SBWPageState = {
    escapeHtml,
    renderLoading,
    renderEmpty,
    renderError,
    setBusy,
    markReady,
    markBooting,
    safeRun
  };

  markBooting();

  window.addEventListener("load", () => {
    window.setTimeout(markReady, 250);
  });
})();
