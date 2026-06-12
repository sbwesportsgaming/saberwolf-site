(function () {
  "use strict";

  const FALLBACK_AVATAR = "../assets/images/logo-sbw.jpg";

  const creators = [
    {
      id: "dlucca",
      name: "D'Lucca SBW",
      role: "Founder / Ecossistema SBW",
      description:
        "Fundador da -SBW- e responsável pela construção do ecossistema, torneios, comunidade e expansão da plataforma.",
      avatar: "../assets/images/dlucca-avatar.jpg",
      href: "creator-dlucca.html",
      tags: ["Founder", "SBW", "Ecossistema"],
      filters: ["sbw", "community"]
    },
    {
      id: "elitz",
      name: "SBW EliTz",
      role: "Creator oficial",
      description:
        "Creator conectado à comunidade -SBW-, com foco em gameplay, presença digital e conteúdo gamer.",
      avatar: "../assets/images/elitz-avatar.jpg",
      href: "creator-elitz.html",
      tags: ["Gameplay", "Community", "SBW"],
      filters: ["sbw", "gameplay", "community"]
    },
    {
      id: "kari-akane",
      name: "Kari Akane",
      role: "FGC / Comunidade parceira",
      description:
        "Representante da Fighting Girls Community, fortalecendo presença, acolhimento e visibilidade feminina na FGC.",
      avatar: "../assets/images/kari-akane-avatar.jpg",
      href: "creator-kari-akane.html",
      tags: ["FGC", "Community", "Fighting Girls"],
      filters: ["fgc", "community"]
    },
    {
      id: "tiger-furious",
      name: "Tiger Furious",
      role: "Creator parceiro",
      description:
        "Creator parceiro conectado a gameplay, comunidade e conteúdo competitivo dentro do ecossistema SaberWolf.",
      avatar: "../assets/images/tigerfurious-avatar.jpg",
      href: "creator-tiger-furious.html",
      tags: ["Gameplay", "Live", "Community"],
      filters: ["gameplay", "community"]
    }
  ];

  let activeFilter = "all";
  let activeSearch = "";
  let featuredIndex = 0;
  let featuredTimer = null;

  function qs(selector, root = document) {
    return root.querySelector(selector);
  }

  function qsa(selector, root = document) {
    return Array.from(root.querySelectorAll(selector));
  }

  function escapeHtml(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function getCreatorUrl(creator) {
    return creator.href || "creators.html";
  }

  function imageWithFallback(event) {
    const image = event.currentTarget;
    if (!image || image.dataset.fallbackApplied === "true") return;
    image.dataset.fallbackApplied = "true";
    image.src = FALLBACK_AVATAR;
  }

  function creatorMatches(creator) {
    const matchesFilter =
      activeFilter === "all" ||
      creator.filters.includes(activeFilter) ||
      creator.tags.some((tag) => tag.toLowerCase().includes(activeFilter));

    const haystack = [
      creator.name,
      creator.role,
      creator.description,
      ...(creator.tags || [])
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch = !activeSearch || haystack.includes(activeSearch.toLowerCase());

    return matchesFilter && matchesSearch;
  }

  function renderCreatorCard(creator) {
    const tags = creator.tags
      .slice(0, 3)
      .map((tag) => `<span>${escapeHtml(tag)}</span>`)
      .join("");

    return `
      <a class="sbw-creator-card" href="${escapeHtml(getCreatorUrl(creator))}">
        <div class="sbw-creator-card__top">
          <img class="sbw-creator-card__avatar" src="${escapeHtml(creator.avatar)}" alt="${escapeHtml(creator.name)}" loading="lazy" />
          <span class="sbw-creator-card__badge">Oficial</span>
        </div>

        <div>
          <h3>${escapeHtml(creator.name)}</h3>
          <p>${escapeHtml(creator.description)}</p>
        </div>

        <div class="sbw-creator-card__footer">
          <div class="sbw-creator-card__tags">${tags}</div>
          <span>Ver perfil →</span>
        </div>
      </a>
    `;
  }

  function renderGrid() {
    const grid = qs("[data-creators-grid]");
    if (!grid) return;

    const filtered = creators.filter(creatorMatches);

    if (!filtered.length) {
      grid.innerHTML = `
        <div class="sbw-creators-empty">
          Nenhum creator oficial encontrado com os filtros atuais.
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(renderCreatorCard).join("");
    qsa("img", grid).forEach((image) => image.addEventListener("error", imageWithFallback));
  }

  function renderFeatured() {
    const creator = creators[featuredIndex] || creators[0];
    if (!creator) return;

    const card = qs("[data-featured-creator]");
    const avatar = qs("[data-featured-avatar]");
    const role = qs("[data-featured-role]");
    const name = qs("[data-featured-name]");
    const description = qs("[data-featured-description]");
    const tags = qs("[data-featured-tags]");
    const link = qs("[data-featured-link]");

    const applyContent = () => {
      if (avatar) {
        avatar.src = creator.avatar || FALLBACK_AVATAR;
        avatar.alt = creator.name;
        avatar.addEventListener("error", imageWithFallback);
      }

      if (role) role.textContent = creator.role || "Creator oficial";
      if (name) name.textContent = creator.name || "Creator -SBW-";
      if (description) description.textContent = creator.description || "Creator conectado à SaberWolf.";

      if (tags) {
        tags.innerHTML = creator.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("");
      }

      if (link) {
        link.href = getCreatorUrl(creator);
      }
    };

    if (!card) {
      applyContent();
      return;
    }

    card.classList.add("is-changing");
    window.setTimeout(() => {
      applyContent();
      requestAnimationFrame(() => card.classList.remove("is-changing"));
    }, 150);
  }

  function moveFeatured(direction) {
    featuredIndex = (featuredIndex + direction + creators.length) % creators.length;
    renderFeatured();
    restartFeaturedTimer();
  }

  function restartFeaturedTimer() {
    if (featuredTimer) window.clearInterval(featuredTimer);

    featuredTimer = window.setInterval(() => {
      featuredIndex = (featuredIndex + 1) % creators.length;
      renderFeatured();
    }, 6200);
  }

  function bindEvents() {
    const search = qs("[data-creator-search]");

    if (search) {
      search.addEventListener("input", () => {
        activeSearch = search.value.trim();
        renderGrid();
      });
    }

    qsa("[data-creator-filter]").forEach((button) => {
      button.addEventListener("click", () => {
        activeFilter = button.dataset.creatorFilter || "all";

        qsa("[data-creator-filter]").forEach((item) => {
          item.classList.toggle("is-active", item === button);
        });

        renderGrid();
      });
    });

    const prev = qs("[data-feature-prev]");
    const next = qs("[data-feature-next]");

    if (prev) prev.addEventListener("click", () => moveFeatured(-1));
    if (next) next.addEventListener("click", () => moveFeatured(1));
  }

  function init() {
    renderFeatured();
    renderGrid();
    bindEvents();
    restartFeaturedTimer();

    window.addEventListener("beforeunload", () => {
      if (featuredTimer) window.clearInterval(featuredTimer);
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
