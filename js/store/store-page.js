(function () {
  "use strict";

  function initStoreFilters() {
    const filterButtons = Array.from(document.querySelectorAll("[data-sbw-store-filter]"));
    const cards = Array.from(document.querySelectorAll("[data-store-category]"));

    if (!filterButtons.length || !cards.length) return;

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const selected = button.dataset.sbwStoreFilter || "all";

        filterButtons.forEach((item) => item.classList.toggle("is-active", item === button));

        cards.forEach((card) => {
          const category = card.dataset.storeCategory || "";
          const shouldShow = selected === "all" || category === selected;
          card.classList.toggle("is-hidden", !shouldShow);
        });
      });
    });
  }

  function initStorePage() {
    initStoreFilters();

    requestAnimationFrame(() => {
      document.body.classList.remove("sbw-sidebar-no-transition");
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initStorePage);
  } else {
    initStorePage();
  }
})();
