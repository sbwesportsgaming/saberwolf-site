(function () {
  "use strict";

  const editorialCategories = [
    {
      category: "Torneios",
      description: "Comunicados oficiais sobre calendários, inscrições, resultados e cobertura competitiva."
    },
    {
      category: "Equipes",
      description: "Atualizações sobre equipes, perfis públicos, recrutamento e movimentações do ecossistema."
    },
    {
      category: "Rankings",
      description: "Notas sobre pontuação, temporadas, rankings globais e rankings por organizador."
    },
    {
      category: "Creators",
      description: "Espaço preparado para ações, entrevistas, chamadas e conteúdos de creators oficiais."
    }
  ];

  const officialNews = [];

  function normalize(value) {
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  }

  function getActiveCategory() {
    return document.querySelector("[data-sbw-news-category].is-active")?.dataset.sbwNewsCategory || "all";
  }

  function renderEditorialPlaceholders(grid) {
    grid.innerHTML = editorialCategories
      .map((item) => `
        <article class="sbw-news-card">
          <span>${item.category}</span>
          <h3>Categoria preparada</h3>
          <p>${item.description}</p>
        </article>
      `)
      .join("");
  }

  function renderNews() {
    const grid = document.querySelector("[data-sbw-news-grid]");
    const empty = document.querySelector("[data-sbw-news-empty]");
    const searchInput = document.querySelector("[data-sbw-news-search]");

    if (!grid || !empty) return;

    const activeCategory = getActiveCategory();
    const searchTerm = normalize(searchInput?.value || "");

    const filtered = officialNews.filter((item) => {
      const matchesCategory = activeCategory === "all" || normalize(item.category) === activeCategory;
      const matchesSearch = !searchTerm || normalize(`${item.title} ${item.summary} ${item.category}`).includes(searchTerm);
      return matchesCategory && matchesSearch;
    });

    if (!filtered.length) {
      renderEditorialPlaceholders(grid);
      empty.classList.remove("is-hidden");
      return;
    }

    empty.classList.add("is-hidden");
    grid.innerHTML = filtered
      .map((item) => `
        <article class="sbw-news-card">
          <span>${item.category}</span>
          <h3>${item.title}</h3>
          <p>${item.summary}</p>
          <a class="sbw-news-button sbw-news-button--ghost" href="${item.href}">Ler mais</a>
        </article>
      `)
      .join("");
  }

  function bindFilters() {
    document.querySelectorAll("[data-sbw-news-category]").forEach((button) => {
      button.addEventListener("click", () => {
        document.querySelectorAll("[data-sbw-news-category]").forEach((item) => item.classList.remove("is-active"));
        button.classList.add("is-active");
        renderNews();
      });
    });

    document.querySelector("[data-sbw-news-search]")?.addEventListener("input", renderNews);
  }

  function initNewsPage() {
    bindFilters();
    renderNews();

    requestAnimationFrame(() => {
      document.body.classList.remove("sbw-sidebar-no-transition");
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initNewsPage);
  } else {
    initNewsPage();
  }
})();
