(function () {
  "use strict";

  const CONSENT_KEY = "sbw_cookie_consent_v1";
  const CONSENT_VERSION = "2026-06-10";

  function getStoredConsent() {
    try {
      const raw = window.localStorage.getItem(CONSENT_KEY);
      if (!raw) return null;

      const parsed = JSON.parse(raw);
      if (!parsed || parsed.version !== CONSENT_VERSION) return null;

      return parsed;
    } catch (error) {
      console.warn("[SBW Compliance] Não foi possível ler consentimento:", error);
      return null;
    }
  }

  function saveConsent(options) {
    const consent = {
      version: CONSENT_VERSION,
      necessary: true,
      analytics: Boolean(options && options.analytics),
      updatedAt: new Date().toISOString()
    };

    try {
      window.localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
    } catch (error) {
      console.warn("[SBW Compliance] Não foi possível salvar consentimento:", error);
    }

    window.SBWCookieConsent = consent;
    window.dispatchEvent(new CustomEvent("sbw:cookies-consent-updated", { detail: consent }));

    return consent;
  }

  function routeUrl(path) {
    if (window.SBWRoutes && typeof window.SBWRoutes.url === "function") {
      return window.SBWRoutes.url(path);
    }

    return path.startsWith("/") ? path : "/" + path.replace(/^\/+/, "");
  }

  function createElementFromHtml(html) {
    const template = document.createElement("template");
    template.innerHTML = html.trim();
    return template.content.firstElementChild;
  }

  function ensureFooter() {
    if (document.querySelector("[data-sbw-site-footer]")) return;

    const existingFooter = document.querySelector("footer:not([data-sbw-site-footer])");

    if (existingFooter) {
      existingFooter.classList.add("sbw-legacy-footer");
      return;
    }

    const footer = createElementFromHtml(`
      <footer class="sbw-site-footer" data-sbw-site-footer>
        <div class="sbw-site-footer__inner">
          <p class="sbw-site-footer__copy">© 2026 -SBW- Project. Todos os direitos reservados.</p>

          <nav class="sbw-site-footer__legal" aria-label="Links legais">
            <a href="${routeUrl("pages/termos.html")}">Termos</a>
            <a href="${routeUrl("pages/privacidade.html")}">Privacidade</a>
            <a href="${routeUrl("pages/cookies.html")}">Cookies</a>
          </nav>
        </div>
      </footer>
    `);

    document.body.appendChild(footer);
  }

  function closeCookieBanner() {
    const banner = document.querySelector("[data-sbw-cookie-banner]");
    if (banner) banner.remove();
  }

  function openPreferences() {
    const current = getStoredConsent() || { analytics: false };
    const existing = document.querySelector("[data-sbw-cookie-modal]");
    if (existing) existing.remove();

    const modal = createElementFromHtml(`
      <div class="sbw-cookie-modal" data-sbw-cookie-modal role="dialog" aria-modal="true" aria-labelledby="sbwCookieModalTitle">
        <div class="sbw-cookie-modal__backdrop" data-sbw-cookie-close></div>
        <div class="sbw-cookie-modal__panel">
          <div class="sbw-cookie-modal__header">
            <span class="sbw-cookie-modal__eyebrow">Preferências</span>
            <h2 id="sbwCookieModalTitle">Cookies da -SBW-</h2>
            <button type="button" class="sbw-cookie-modal__close" data-sbw-cookie-close aria-label="Fechar">×</button>
          </div>

          <div class="sbw-cookie-modal__content">
            <label class="sbw-cookie-option is-required">
              <input type="checkbox" checked disabled />
              <span>
                <strong>Necessários</strong>
                <small>Essenciais para login, segurança, preferências básicas e funcionamento da plataforma.</small>
              </span>
            </label>

            <label class="sbw-cookie-option">
              <input type="checkbox" data-sbw-cookie-analytics ${current.analytics ? "checked" : ""} />
              <span>
                <strong>Analytics futuro</strong>
                <small>Reservado para métricas agregadas da plataforma quando esse recurso for ativado.</small>
              </span>
            </label>
          </div>

          <div class="sbw-cookie-modal__actions">
            <button type="button" class="sbw-cookie-button sbw-cookie-button--ghost" data-sbw-cookie-necessary>Somente necessários</button>
            <button type="button" class="sbw-cookie-button" data-sbw-cookie-save>Salvar preferências</button>
          </div>
        </div>
      </div>
    `);

    document.body.appendChild(modal);

    modal.querySelectorAll("[data-sbw-cookie-close]").forEach((button) => {
      button.addEventListener("click", () => modal.remove());
    });

    const necessaryButton = modal.querySelector("[data-sbw-cookie-necessary]");
    if (necessaryButton) {
      necessaryButton.addEventListener("click", () => {
        saveConsent({ analytics: false });
        modal.remove();
        closeCookieBanner();
      });
    }

    const saveButton = modal.querySelector("[data-sbw-cookie-save]");
    if (saveButton) {
      saveButton.addEventListener("click", () => {
        const analytics = Boolean(modal.querySelector("[data-sbw-cookie-analytics]")?.checked);
        saveConsent({ analytics });
        modal.remove();
        closeCookieBanner();
      });
    }
  }

  function ensureCookieBanner() {
    const storedConsent = getStoredConsent();
    if (storedConsent) {
      window.SBWCookieConsent = storedConsent;
      return;
    }

    if (document.querySelector("[data-sbw-cookie-banner]")) return;

    const banner = createElementFromHtml(`
      <section class="sbw-cookie-banner" data-sbw-cookie-banner aria-label="Aviso de cookies">
        <div class="sbw-cookie-banner__text">
          <strong>Cookies e preferências</strong>
          <span>Usamos recursos necessários para login, segurança e funcionamento da plataforma. Métricas adicionais só devem ser ativadas com preferência salva.</span>
        </div>

        <div class="sbw-cookie-banner__actions">
          <button type="button" class="sbw-cookie-button sbw-cookie-button--ghost" data-sbw-cookie-preferences>Preferências</button>
          <button type="button" class="sbw-cookie-button sbw-cookie-button--ghost" data-sbw-cookie-necessary>Somente necessários</button>
          <button type="button" class="sbw-cookie-button" data-sbw-cookie-accept>Aceitar</button>
        </div>
      </section>
    `);

    document.body.appendChild(banner);

    banner.querySelector("[data-sbw-cookie-preferences]")?.addEventListener("click", openPreferences);
    banner.querySelector("[data-sbw-cookie-necessary]")?.addEventListener("click", () => {
      saveConsent({ analytics: false });
      closeCookieBanner();
    });
    banner.querySelector("[data-sbw-cookie-accept]")?.addEventListener("click", () => {
      saveConsent({ analytics: true });
      closeCookieBanner();
    });
  }

  function initCompliance() {
    ensureFooter();
    ensureCookieBanner();

    window.SBWCompliance = {
      getConsent: getStoredConsent,
      saveConsent,
      openCookiePreferences: openPreferences
    };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCompliance);
  } else {
    initCompliance();
  }
})();
