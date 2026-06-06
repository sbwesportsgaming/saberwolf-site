(function () {
  if (window.SBWMenuAlreadyInitialized) {
    return;
  }

  window.SBWMenuAlreadyInitialized = true;

  function initMenu() {
    const header = document.querySelector("body > header");
    const toggleButton = document.querySelector(".menu-toggle");
    const nav = document.querySelector("body > header nav");

    if (!header || !toggleButton || !nav) {
      return;
    }

    toggleButton.addEventListener("click", function () {
      header.classList.toggle("is-open");
      nav.classList.toggle("active");
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMenu);
  } else {
    initMenu();
  }
})();