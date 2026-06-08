(function () {
  "use strict";

  const sidebarLinks = [
  { id: "home", label: "Início", href: "/index.html", icon: "⌂" },
  { id: "news", label: "Notícias", href: "/blog/noticias.html", icon: "▤" },
  { id: "about", label: "Sobre", href: "/pages/sobre.html", icon: "ⓘ" },
  { id: "creators", label: "Creators", href: "/creators/creators.html", icon: "✦" },
  { id: "profiles", label: "Perfis", href: "/perfis/perfis.html", icon: "♙" },
  { id: "teams", label: "Equipes", href: "/equipes/equipes.html", icon: "♟" },
  { id: "tournaments", label: "Torneios", href: "/torneios/torneios.html", icon: "🏆" },
  { id: "communities", label: "Comunidades", href: "/comunidades/comunidades.html", icon: "◎" },
  { id: "rankings", label: "Rankings", href: "/rankings/rankings.html", icon: "▥" },
  { id: "transfers", label: "Transferências", href: "/transferencias/transferencias.html", icon: "⇄" },
  { id: "shop", label: "Loja", href: "/pages/loja.html", icon: "🛒" }
];

  function escapeHtml(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function getActivePage() {
    return document.body.dataset.sbwActivePage || "home";
  }

  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function waitForSupabaseClient() {
    for (let attempt = 0; attempt < 30; attempt += 1) {
      const client = window.SBWSupabase?.client;

      if (client?.auth) {
        return client;
      }

      await wait(100);
    }

    return null;
  }

  function getInitialFromUser(user) {
    const raw =
      user?.user_metadata?.display_name ||
      user?.user_metadata?.full_name ||
      user?.user_metadata?.name ||
      user?.user_metadata?.nickname ||
      user?.email ||
      "SBW";

    return String(raw).trim().charAt(0).toUpperCase() || "S";
  }

  function getDisplayNameFromUser(user) {
    const metadata = user?.user_metadata || {};

    return (
      metadata.display_name ||
      metadata.full_name ||
      metadata.name ||
      metadata.nickname ||
      user?.email?.split("@")[0] ||
      "Usuário SBW"
    );
  }

  function getProfileDisplayName(profile, user) {
  const metadata = user?.user_metadata || {};

  return (
    profile?.display_name ||
    profile?.displayName ||
    profile?.nickname ||
    profile?.username ||
    metadata.display_name ||
    metadata.full_name ||
    metadata.name ||
    metadata.nickname ||
    user?.email?.split("@")[0] ||
    "Usuário SBW"
  );
}

function getProfileKey(profile, user) {
  return (
    profile?.slug ||
    profile?.username ||
    profile?.userId ||
    profile?.user_id ||
    profile?.id ||
    user?.id ||
    ""
  );
}

function getProfilePermissions(profile) {
  const rawPermissions =
    profile?.permissions ||
    profile?.metadata?.permissions ||
    {};

  const organizerPermission =
    profile?.organizerPermission ||
    profile?.organizer_permission ||
    null;

  const isApprovedOrganizer =
    organizerPermission &&
    organizerPermission.status === "approved" &&
    organizerPermission.can_create_tournaments === true;

  return {
    canCreateTournament: Boolean(
      rawPermissions.canCreateTournament ||
      rawPermissions.can_create_tournament ||
      rawPermissions.can_create_tournaments ||
      rawPermissions.isAdmin ||
      rawPermissions.is_admin ||
      isApprovedOrganizer
    ),

    isAdmin: Boolean(
      rawPermissions.isAdmin ||
      rawPermissions.is_admin
    )
  };
}

async function getCurrentProfileSafely(user) {
  if (!user) return null;

  try {
    if (
      window.SBWAuth &&
      typeof window.SBWAuth.ensureCurrentUserProfile === "function"
    ) {
      const profile = await window.SBWAuth.ensureCurrentUserProfile();

      if (profile) {
        return profile;
      }
    }

    const client = await waitForSupabaseClient();

    if (!client) return null;

    const result = await client
      .from("profiles")
      .select("*")
      .eq("auth_user_id", user.id)
      .maybeSingle();

    if (result.error) {
      console.warn("[SBW Sidebar] Não foi possível buscar profile:", result.error);
      return null;
    }

    return result.data || null;
  } catch (error) {
    console.warn("[SBW Sidebar] Erro ao carregar profile:", error);
    return null;
  }
}

async function getCurrentTeamForProfile(profile, user) {
  const profileKey = getProfileKey(profile, user);

  if (!profileKey) return null;

  try {
    const client = await waitForSupabaseClient();

    if (!client) return null;

    const tableName =
      window.SBWSupabaseConfig?.tables?.teamMembers ||
      "team_members";

    const result = await client
      .from(tableName)
      .select("team_slug, role, status")
      .eq("profile_slug", profileKey)
      .eq("status", "active")
      .limit(1)
      .maybeSingle();

    if (result.error) {
      console.warn("[SBW Sidebar] Não foi possível buscar equipe atual:", result.error);
      return null;
    }

    if (!result.data || !result.data.team_slug) {
      return null;
    }

    return {
      teamSlug: result.data.team_slug,
      role: result.data.role || "member"
    };
  } catch (error) {
    console.warn("[SBW Sidebar] Erro ao buscar equipe atual:", error);
    return null;
  }
}

  async function getCurrentUserSafely() {
    try {
      const client = await waitForSupabaseClient();

      if (client?.auth?.getSession) {
        const sessionResult = await client.auth.getSession();
        const sessionUser = sessionResult?.data?.session?.user;

        if (sessionUser) {
          return sessionUser;
        }
      }

      if (client?.auth?.getUser) {
        const userResult = await client.auth.getUser();
        const user = userResult?.data?.user;

        if (user) {
          return user;
        }
      }

      if (window.SBWAuth?.getUser) {
        const result = await window.SBWAuth.getUser();

        if (result?.user) return result.user;
        if (result?.data?.user) return result.data.user;
        if (result?.id || result?.email) return result;
      }
    } catch (error) {
      console.warn("[SBW Sidebar] Não foi possível carregar usuário:", error);
    }

    return null;
  }

  async function signOutSafely() {
    try {
      const client = await waitForSupabaseClient();

      if (window.SBWAuth?.signOut) {
        await window.SBWAuth.signOut();
      } else if (window.SBWAuth?.logout) {
        await window.SBWAuth.logout();
      } else if (client?.auth?.signOut) {
        await client.auth.signOut();
      }
    } catch (error) {
      console.warn("[SBW Sidebar] Erro ao sair:", error);
    } finally {
      window.location.href = "/index.html";
    }
  }

  function renderLinks(activePage) {
    return sidebarLinks
      .map((link) => {
        const isActive = link.id === activePage ? "is-active" : "";

        return `
          <a class="sbw-sidebar__link ${isActive}" href="${link.href}" data-sbw-sidebar-nav>
            <span class="sbw-sidebar__icon">${link.icon}</span>
            <span>${link.label}</span>
          </a>
        `;
      })
      .join("");
  }

  function renderLoggedOutAccount() {
  return `
    <div class="sbw-account-card">
      <div class="sbw-account-card__top">
        <div class="sbw-account-card__avatar">S</div>

        <div>
          <strong>Conta -SBW-</strong>
          <small>Entre para acessar perfil, inscrições e torneios.</small>
        </div>
      </div>

      <nav class="sbw-account-menu" aria-label="Conta SaberWolf">
        <a class="sbw-account-menu__item sbw-account-menu__item--primary" href="/auth/login.html">
          <span>↪</span>
          <strong>Entrar / Criar conta</strong>
        </a>
      </nav>
    </div>
  `;
}

  function renderLoggedInAccount(user, accountData = {}) {
  const profile = accountData.profile || null;
  const currentTeam = accountData.currentTeam || null;
  const permissions = getProfilePermissions(profile);

  const name = escapeHtml(getProfileDisplayName(profile, user));
  const initial = escapeHtml(getInitialFromUser(user));
  const email = escapeHtml(user?.email || "");

  const teamItem = currentTeam?.teamSlug
    ? `
      <a class="sbw-account-menu__item" href="/equipes/minha-equipe.html">
        <span>🛡️</span>
        <strong>Minha equipe</strong>
      </a>
    `
    : "";

  const organizerItem = permissions.canCreateTournament
    ? `
      <a class="sbw-account-menu__item" href="/torneios/create-tournament/criar-torneio.html">
        <span>🏆</span>
        <strong>Criar torneio</strong>
      </a>
    `
    : "";

  return `
    <div class="sbw-account-card sbw-account-card--logged">
      <div class="sbw-account-card__top">
        <div class="sbw-account-card__avatar">${initial}</div>

        <div>
          <strong>${name}</strong>
          <small>${email || "Conta SaberWolf"}</small>
        </div>
      </div>

      <nav class="sbw-account-menu" aria-label="Menu da conta">
        <a class="sbw-account-menu__item sbw-account-menu__item--primary" href="/perfis/meu-perfil.html">
          <span>👤</span>
          <strong>Meu perfil</strong>
        </a>

        ${teamItem}

        <span class="sbw-account-menu__item sbw-account-menu__item--muted">
          <span>🎟️</span>
          <strong>Minhas inscrições</strong>
          <small>Em breve</small>
        </span>

        <a class="sbw-account-menu__item" href="/perfis/meu-perfil.html#convites">
          <span>✉️</span>
          <strong>Convites</strong>
        </a>

        ${organizerItem}

        <button class="sbw-account-menu__item sbw-account-menu__item--danger" type="button" data-sbw-logout>
          <span>⏻</span>
          <strong>Sair</strong>
        </button>
      </nav>
    </div>
  `;
}

  async function updateAccountArea(sidebarElement) {
  const accountArea = sidebarElement.querySelector("[data-sbw-sidebar-account]");

  if (!accountArea) return;

  accountArea.innerHTML = renderLoggedOutAccount();

  const user = await getCurrentUserSafely();

  if (!user) return;

  const profile = await getCurrentProfileSafely(user);
  const currentTeam = await getCurrentTeamForProfile(profile, user);

  accountArea.innerHTML = renderLoggedInAccount(user, {
    profile,
    currentTeam
  });

  const logoutButton = accountArea.querySelector("[data-sbw-logout]");

  if (logoutButton) {
    logoutButton.addEventListener("click", signOutSafely);
  }
}

  function closeMobileSidebar() {
    document.body.classList.remove("sbw-sidebar-open");
  }

  function initSidebarControls() {
    const toggle = document.querySelector("[data-sbw-sidebar-toggle]");
    const backdrop = document.querySelector("[data-sbw-sidebar-close]");

    if (toggle) {
      toggle.addEventListener("click", () => {
        document.body.classList.toggle("sbw-sidebar-open");
      });
    }

    if (backdrop) {
      backdrop.addEventListener("click", closeMobileSidebar);
    }

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMobileSidebar();
      }
    });
  }

  async function listenToAuthChanges(sidebarElement) {
    const client = await waitForSupabaseClient();

    if (!client?.auth?.onAuthStateChange) return;

    client.auth.onAuthStateChange(() => {
      updateAccountArea(sidebarElement);
    });
  }

  async function initSidebar() {
    const mount = document.getElementById("sbwSidebarMount");

    if (!mount) return;

    const activePage = getActivePage();

    document.body.classList.add("sbw-has-sidebar");

    mount.innerHTML = `
      <aside class="sbw-sidebar" aria-label="Menu principal SaberWolf">
        <a class="sbw-sidebar__brand" href="/index.html" aria-label="SaberWolf eSports">
          <div class="sbw-sidebar__brand-mark">SW</div>

          <div class="sbw-sidebar__brand-text">
            <strong>SaberWolf</strong>
            <span>eSports</span>
          </div>
        </a>

        <nav class="sbw-sidebar__nav" aria-label="Navegação principal">
          ${renderLinks(activePage)}
        </nav>

        <div class="sbw-sidebar__account" data-sbw-sidebar-account>
          ${renderLoggedOutAccount()}
        </div>
      </aside>
    `;

    const sidebarElement = mount.querySelector(".sbw-sidebar");

    mount.querySelectorAll("[data-sbw-sidebar-nav]").forEach((link) => {
      link.addEventListener("click", closeMobileSidebar);
    });

    initSidebarControls();
    await updateAccountArea(sidebarElement);
    listenToAuthChanges(sidebarElement);

    requestAnimationFrame(() => {
    document.body.classList.remove("sbw-sidebar-no-transition");
   });
  }

  document.addEventListener("DOMContentLoaded", initSidebar);
})();