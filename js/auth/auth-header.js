(function () {
  const AUTH_NAV_SELECTOR = "[data-sbw-auth-nav]";
  const CURRENT_USER_STORAGE_KEY = "sbw_current_user_v1_3_9";

  function getRootUrl() {
    if (window.SBWAuth && typeof window.SBWAuth.getRootUrl === "function") {
      return window.SBWAuth.getRootUrl();
    }

    const origin = window.location.origin;
    const path = window.location.pathname || "/";
    const knownFolders = [
      "/auth/",
      "/beta/",
      "/perfis/",
      "/equipes/",
      "/torneios/",
      "/comunidades/",
      "/creators/",
      "/transferencias/",
      "/rankings/",
      "/pages/",
      "/blog/",
      "/atletas/"
    ];

    const matchedFolder = knownFolders.find(function (folder) {
      return path.includes(folder);
    });

    if (matchedFolder) {
      return origin + path.split(matchedFolder)[0] + "/";
    }

    return origin + path.substring(0, path.lastIndexOf("/") + 1);
  }

  function getUrl(path) {
    return new URL(path, getRootUrl()).href;
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function getCachedCurrentUser() {
  try {
    const raw = localStorage.getItem(CURRENT_USER_STORAGE_KEY);

    if (!raw) {
      return null;
    }

    const user = JSON.parse(raw);

    if (!user || !user.authUserId) {
      return null;
    }

    return user;
  } catch (error) {
    return null;
  }
}

function renderInstantAuthState(nav) {
  const cachedUser = getCachedCurrentUser();

  clearExistingAuthNav(nav);

  if (cachedUser) {
    renderLoggedIn(nav, cachedUser, {
      id: cachedUser.authUserId,
      email: cachedUser.email || "Conta -SBW-",
      user_metadata: {}
    });

    return true;
  }

  renderLoggedOut(nav);
  return false;
}

  function getProfileDisplayName(profile, user) {
    const metadata = user?.user_metadata || {};

    return (
      profile?.display_name ||
      profile?.displayName ||
      profile?.nickname ||
      profile?.username ||
      metadata.full_name ||
      metadata.name ||
      metadata.display_name ||
      metadata.preferred_username ||
      user?.email?.split("@")[0] ||
      "Usuário -SBW-"
    );
  }

  function getProfileAvatar(profile, user) {
    const metadata = user?.user_metadata || {};

    return (
      profile?.avatar_url ||
      profile?.avatarUrl ||
      metadata.avatar_url ||
      metadata.picture ||
      metadata.image_url ||
      ""
    );
  }

  function getInitials(name) {
    const cleanName = String(name || "SBW").trim();

    const parts = cleanName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2);

    if (!parts.length) {
      return "SB";
    }

    return parts
      .map(function (part) {
        return part.charAt(0).toUpperCase();
      })
      .join("");
  }

  function getProfilePermissions(profile) {
  const rawPermissions =
    profile?.metadata?.permissions ||
    profile?.permissions ||
    {};

  const organizerPermission =
    profile?.organizerPermission ||
    profile?.organizer_permission ||
    null;

  const isApprovedOrganizer =
    organizerPermission &&
    organizerPermission.status === "approved";

  const canCreateTournamentOrganizer = Boolean(
    rawPermissions.canCreateTournamentOrganizer ||
    rawPermissions.can_create_tournament_organizer ||
    rawPermissions.canCreateTournamentOrganizers ||
    rawPermissions.can_create_tournament_organizers ||
    rawPermissions.canCreateOrganization ||
    rawPermissions.can_create_organization ||
    rawPermissions.canCreateOrganizations ||
    rawPermissions.can_create_organizations ||
    (
      isApprovedOrganizer &&
      (
        organizerPermission.can_create_organizations === true ||
        organizerPermission.can_create_organization === true ||
        organizerPermission.can_create_tournament_organizers === true ||
        organizerPermission.can_create_tournament_organizer === true
      )
    )
  );

  return {
    canCreateTeam: Boolean(
      rawPermissions.canCreateTeam ||
      rawPermissions.can_create_team
    ),

    canCreateTournamentOrganizer: Boolean(
      canCreateTournamentOrganizer ||
      rawPermissions.isAdmin ||
      rawPermissions.is_admin
    ),

    canCreateTournament: Boolean(
      rawPermissions.canCreateTournament ||
      rawPermissions.can_create_tournament ||
      rawPermissions.can_create_tournaments ||
      (isApprovedOrganizer && organizerPermission.can_create_tournaments === true) ||
      rawPermissions.isAdmin ||
      rawPermissions.is_admin
    ),

    isAdmin: Boolean(
      rawPermissions.isAdmin ||
      rawPermissions.is_admin
    ),

    organizerStatus:
      rawPermissions.organizerStatus ||
      rawPermissions.organizer_status ||
      organizerPermission?.status ||
      "none"
  };
}

  function injectStyles() {
  if (document.getElementById("sbw-auth-header-styles")) {
    return;
  }

  const style = document.createElement("style");
  style.id = "sbw-auth-header-styles";
  style.textContent = `
    .sbw-auth-nav-item {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-left: 12px;
      line-height: 1;
      z-index: 3000;
    }

    .sbw-auth-login-link {
      min-height: 38px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0 16px;
      border: 1px solid rgba(34, 211, 238, 0.34);
      border-radius: 999px;
      background:
        linear-gradient(135deg, rgba(34, 211, 238, 0.16), rgba(124, 58, 237, 0.18)),
        rgba(2, 6, 23, 0.72);
      color: #e0faff !important;
      font-size: 0.82rem;
      font-weight: 950;
      text-decoration: none;
      letter-spacing: 0.02em;
      white-space: nowrap;
      box-shadow: 0 0 0 1px rgba(34, 211, 238, 0.05), 0 12px 26px rgba(0, 0, 0, 0.22);
      transition: transform 0.18s ease, border-color 0.18s ease, background 0.18s ease;
    }

    .sbw-auth-login-link:hover {
      transform: translateY(-1px);
      border-color: rgba(34, 211, 238, 0.72);
      background:
        linear-gradient(135deg, rgba(34, 211, 238, 0.24), rgba(124, 58, 237, 0.24)),
        rgba(2, 6, 23, 0.86);
    }

    .sbw-auth-avatar-button {
      width: 42px;
      height: 42px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      border: 1px solid rgba(34, 211, 238, 0.48);
      border-radius: 999px;
      background:
        radial-gradient(circle at 30% 18%, rgba(34, 211, 238, 0.38), transparent 42%),
        linear-gradient(135deg, rgba(15, 23, 42, 0.96), rgba(30, 41, 59, 0.94));
      color: #e0faff;
      font-size: 0.78rem;
      font-weight: 950;
      letter-spacing: 0.02em;
      cursor: pointer;
      box-shadow:
        0 0 0 3px rgba(34, 211, 238, 0.07),
        0 14px 34px rgba(0, 0, 0, 0.32);
      transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
    }

    .sbw-auth-avatar-button:hover {
      transform: translateY(-1px);
      border-color: rgba(34, 211, 238, 0.82);
      box-shadow:
        0 0 0 4px rgba(34, 211, 238, 0.1),
        0 18px 42px rgba(0, 0, 0, 0.38);
    }

    .sbw-auth-avatar-button img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .sbw-auth-dropdown {
      position: absolute;
      top: calc(100% + 14px);
      right: 0;
      width: 274px;
      display: none;
      overflow: hidden;
      border: 1px solid rgba(34, 211, 238, 0.18);
      border-radius: 20px;
      background:
        radial-gradient(circle at top left, rgba(34, 211, 238, 0.12), transparent 36%),
        linear-gradient(180deg, rgba(15, 23, 42, 0.98), rgba(2, 6, 23, 0.98));
      box-shadow:
        0 24px 80px rgba(0, 0, 0, 0.56),
        inset 0 1px 0 rgba(255, 255, 255, 0.04);
      backdrop-filter: blur(16px);
      z-index: 5000;
    }

    .sbw-auth-dropdown::before {
      content: "";
      position: absolute;
      top: -7px;
      right: 17px;
      width: 14px;
      height: 14px;
      transform: rotate(45deg);
      border-left: 1px solid rgba(34, 211, 238, 0.18);
      border-top: 1px solid rgba(34, 211, 238, 0.18);
      background: rgba(15, 23, 42, 0.98);
    }

    .sbw-auth-nav-item.is-open .sbw-auth-dropdown {
      display: block;
      animation: sbwAuthDropdownIn 0.16s ease-out;
    }

    @keyframes sbwAuthDropdownIn {
      from {
        opacity: 0;
        transform: translateY(-4px) scale(0.98);
      }

      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    .sbw-auth-dropdown-header {
      padding: 15px 15px 13px;
      border-bottom: 1px solid rgba(34, 211, 238, 0.1);
    }

    .sbw-auth-dropdown-header strong {
      display: block;
      color: #f8fafc;
      font-size: 0.92rem;
      line-height: 1.25;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .sbw-auth-dropdown-header span {
      display: block;
      margin-top: 5px;
      color: rgba(203, 213, 225, 0.68);
      font-size: 0.74rem;
      line-height: 1.3;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .sbw-auth-dropdown-list {
      display: grid;
      gap: 3px;
      padding: 9px;
    }

    .sbw-auth-dropdown-list a,
    .sbw-auth-dropdown-list button,
    .sbw-auth-dropdown-list span {
      width: 100%;
      min-height: 39px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 9px;
      border: 0;
      border-radius: 13px;
      background: transparent;
      color: rgba(226, 232, 240, 0.86);
      padding: 0 11px;
      font: inherit;
      font-size: 0.84rem;
      font-weight: 850;
      text-align: left;
      text-decoration: none;
    }

    .sbw-auth-dropdown-list a,
    .sbw-auth-dropdown-list button {
      cursor: pointer;
      transition: background 0.16s ease, color 0.16s ease, transform 0.16s ease;
    }

    .sbw-auth-dropdown-list a:hover,
    .sbw-auth-dropdown-list button:hover {
      transform: translateX(2px);
      background: rgba(34, 211, 238, 0.1);
      color: #67e8f9;
    }

    .sbw-auth-dropdown-list span {
      color: rgba(148, 163, 184, 0.58);
      cursor: default;
    }

    .sbw-auth-dropdown-divider {
      height: 1px;
      margin: 6px 8px;
      background: linear-gradient(90deg, transparent, rgba(34, 211, 238, 0.18), transparent);
    }

    .sbw-auth-signout {
      color: #fca5a5 !important;
    }

    .sbw-auth-signout:hover {
      background: rgba(248, 113, 113, 0.1) !important;
      color: #fecaca !important;
    }

    @media (max-width: 860px) {
      .sbw-auth-nav-item {
        width: 100%;
        margin-left: 0;
        justify-content: flex-start;
      }

      .sbw-auth-login-link {
        width: 100%;
      }

      .sbw-auth-dropdown {
        position: static;
        width: 100%;
        margin-top: 10px;
        border-radius: 16px;
      }

      .sbw-auth-dropdown::before {
        display: none;
      }
    }
  `;

  document.head.appendChild(style);
}

  function findMainNav() {
    return document.querySelector("body > header .main-nav") ||
      document.querySelector(".sbw-main-header .main-nav") ||
      document.querySelector("body > header nav");
  }

  function clearExistingAuthNav(nav) {
    if (!nav) return;

    nav.querySelectorAll(AUTH_NAV_SELECTOR).forEach(function (node) {
      node.remove();
    });
  }

  function renderLoggedOut(nav) {
    const wrapper = document.createElement("span");
    wrapper.className = "sbw-auth-nav-item";
    wrapper.setAttribute("data-sbw-auth-nav", "logged-out");

    const loginUrl =
   window.SBWAuth && typeof window.SBWAuth.getLoginUrl === "function"
    ? window.SBWAuth.getLoginUrl(window.location.href)
    : getUrl("auth/login.html");

   wrapper.innerHTML = `
  <a class="sbw-auth-login-link" href="${loginUrl}">
    Login -SBW-
  </a>
`;

    nav.appendChild(wrapper);
  }

  function renderLoggedIn(nav, profile, user) {
    const displayName = getProfileDisplayName(profile, user);
    const avatarUrl = getProfileAvatar(profile, user);
    const initials = getInitials(displayName);
    const permissions = getProfilePermissions(profile);
    const canCreateTournamentOrganizer = Boolean(permissions.canCreateTournamentOrganizer || permissions.isAdmin);
    const canCreateTournament = Boolean(permissions.canCreateTournament || permissions.isAdmin);

    const wrapper = document.createElement("span");
    wrapper.className = "sbw-auth-nav-item";
    wrapper.setAttribute("data-sbw-auth-nav", "logged-in");

    const avatarHtml = avatarUrl
      ? `<img src="${escapeHtml(avatarUrl)}" alt="${escapeHtml(displayName)}" />`
      : escapeHtml(initials);

    wrapper.innerHTML = `
  <button
    class="sbw-auth-avatar-button"
    type="button"
    aria-label="Abrir menu da conta"
    aria-expanded="false"
    data-sbw-auth-toggle
  >
    ${avatarHtml}
  </button>

  <div class="sbw-auth-dropdown" data-sbw-auth-dropdown>
    <div class="sbw-auth-dropdown-header">
      <strong>${escapeHtml(displayName)}</strong>
      <span>${escapeHtml(user?.email || "Conta -SBW-")}</span>
    </div>

    <div class="sbw-auth-dropdown-list">
      <a href="${getUrl("perfis/meu-perfil.html")}">Meu perfil</a>
      <span>Minhas inscrições em breve</span>
      <a href="${getUrl("perfis/meu-perfil.html#convites")}">Convites</a>
      <a href="${getUrl("equipes/minha-equipe.html")}">Minha equipe</a>

      ${
        canCreateTournamentOrganizer || canCreateTournament
          ? `
            <div class="sbw-auth-dropdown-divider"></div>
            ${canCreateTournamentOrganizer ? `<a href="${getUrl("torneios/editar-organizador.html?novo=1")}">Criar organização</a>` : ``}
            ${canCreateTournament ? `<a href="${getUrl("torneios/create-tournament/criar-torneio.html")}">Criar torneio</a>` : ``}
            <span>Minhas organizações em breve</span>
          `
          : ``
      }

      <div class="sbw-auth-dropdown-divider"></div>

      <button class="sbw-auth-signout" type="button" data-sbw-auth-signout>
        Sair
      </button>
    </div>
  </div>
`;

    nav.appendChild(wrapper);

    const toggle = wrapper.querySelector("[data-sbw-auth-toggle]");
    const signOutButton = wrapper.querySelector("[data-sbw-auth-signout]");

    if (toggle) {
      toggle.addEventListener("click", function (event) {
        event.stopPropagation();

        const isOpen = wrapper.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", String(isOpen));
      });
    }

    if (signOutButton) {
      signOutButton.addEventListener("click", async function () {
        if (!window.SBWAuth || typeof window.SBWAuth.signOut !== "function") {
          return;
        }

        await window.SBWAuth.signOut();

        window.location.href = getUrl("index.html");
      });
    }

    document.addEventListener("click", function (event) {
      if (!wrapper.contains(event.target)) {
        wrapper.classList.remove("is-open");

        if (toggle) {
          toggle.setAttribute("aria-expanded", "false");
        }
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        wrapper.classList.remove("is-open");

        if (toggle) {
          toggle.setAttribute("aria-expanded", "false");
        }
      }
    });
  }

  async function initAuthHeader() {
  injectStyles();

  const nav = findMainNav();

  if (!nav) {
    return;
  }

  const renderedFromCache = renderInstantAuthState(nav);

  if (!window.SBWAuth || typeof window.SBWAuth.getUser !== "function") {
    return;
  }

  try {
    const user = await window.SBWAuth.getUser();

    clearExistingAuthNav(nav);

    if (!user) {
      renderLoggedOut(nav);
      return;
    }

    let profile = null;

if (typeof window.SBWAuth.ensureCurrentUserProfile === "function") {
  profile = await window.SBWAuth.ensureCurrentUserProfile();
}

if (
  profile &&
  typeof window.SBWAuth.getOrganizerPermission === "function"
) {
  const organizerPermission = await window.SBWAuth.getOrganizerPermission(user.id);

  if (organizerPermission) {
    profile.organizerPermission = organizerPermission;

    const currentPermissions = getProfilePermissions(profile);

    profile.permissions = {
      ...currentPermissions,
      canCreateTournamentOrganizer: Boolean(
        currentPermissions.canCreateTournamentOrganizer ||
        (
          organizerPermission.status === "approved" &&
          (
            organizerPermission.can_create_organizations === true ||
            organizerPermission.can_create_organization === true ||
            organizerPermission.can_create_tournament_organizers === true ||
            organizerPermission.can_create_tournament_organizer === true
          )
        )
      ),
      canCreateTournament: Boolean(
        currentPermissions.canCreateTournament ||
        (
          organizerPermission.status === "approved" &&
          organizerPermission.can_create_tournaments === true
        )
      ),
      organizerStatus: organizerPermission.status || currentPermissions.organizerStatus || "none"
    };
  }
}

renderLoggedIn(nav, profile, user);
  } catch (error) {
    console.warn("[SBW Auth Header] Não foi possível sincronizar o menu de conta:", error);

    if (!renderedFromCache) {
      clearExistingAuthNav(nav);
      renderLoggedOut(nav);
    }
  }
}

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAuthHeader);
  } else {
    initAuthHeader();
  }

  window.SBWAuthHeader = {
    init: initAuthHeader
  };
})();