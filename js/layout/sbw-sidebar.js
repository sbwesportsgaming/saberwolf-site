(function () {
  "use strict";

  const sidebarLinks = [
    { id: "home", label: "Início", href: "/index.html", icon: "⌂" },
    { id: "news", label: "Notícias", href: "/blog/noticias.html", icon: "▤" },
    { id: "about", label: "Sobre", href: "/pages/sobre.html", icon: "ⓘ" },
    { id: "creators", label: "Creators", href: "/creators/creators.html", icon: "✦" },
    { id: "profiles", label: "Perfis", href: "/perfis/perfis.html", icon: "♙", beta: true },
    { id: "teams", label: "Equipes", href: "/equipes/equipes.html", icon: "♟", beta: true },
    { id: "organizers", label: "Organizadores", href: "/organizadores/organizadores.html", icon: "♜", beta: true },
    { id: "tournaments", label: "Torneios", href: "/torneios/torneios.html", icon: "🏆", beta: true },
    { id: "communities", label: "Comunidades", href: "/comunidades/comunidades.html", icon: "◎" },
    { id: "rankings", label: "Rankings", href: "/rankings/rankings.html", icon: "▥", beta: true },
    { id: "transfers", label: "Transferências", href: "/transferencias/transferencias.html", icon: "⇄", beta: true },
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

  function asObject(value) {
    return value && typeof value === "object" && !Array.isArray(value) ? value : {};
  }

  function getAvatarUrlFromProfile(profile, user) {
    const userMetadata = asObject(user?.user_metadata);
    const profileMetadata = asObject(profile?.metadata);
    const profileAssets = asObject(profileMetadata.profileAssets || profileMetadata.profile_assets || profileMetadata.assets);
    const assetFrames = asObject(profileMetadata.assetFrames || profileMetadata.asset_frames);
    const avatarAsset = asObject(profileAssets.avatar || profileAssets.profile || profileAssets.photo);
    const photoAsset = asObject(profileMetadata.photo || profileMetadata.avatar || profileMetadata.profilePhoto);

    return String(
      profile?.avatar_url ||
      profile?.avatarUrl ||
      profile?.photo_url ||
      profile?.photoUrl ||
      profile?.profile_image_url ||
      profile?.profileImageUrl ||
      profile?.image_url ||
      profile?.imageUrl ||
      profileMetadata.avatar_url ||
      profileMetadata.avatarUrl ||
      profileMetadata.photo_url ||
      profileMetadata.photoUrl ||
      profileMetadata.profile_image_url ||
      profileMetadata.profileImageUrl ||
      profileMetadata.picture ||
      profileMetadata.imageUrl ||
      profileMetadata.image_url ||
      profileAssets.avatarUrl ||
      profileAssets.avatar_url ||
      profileAssets.photoUrl ||
      profileAssets.photo_url ||
      avatarAsset.url ||
      avatarAsset.src ||
      avatarAsset.publicUrl ||
      avatarAsset.public_url ||
      avatarAsset.signedUrl ||
      avatarAsset.signed_url ||
      photoAsset.url ||
      photoAsset.src ||
      photoAsset.publicUrl ||
      photoAsset.public_url ||
      photoAsset.signedUrl ||
      photoAsset.signed_url ||
      assetFrames.avatarUrl ||
      assetFrames.avatar_url ||
      userMetadata.avatar_url ||
      userMetadata.picture ||
      ""
    ).trim();
  }

  function mergeSidebarContexts(primary, fallback) {
    if (!primary) return fallback;
    if (!fallback) return primary;

    const primaryPermissions = asObject(primary.permissions);
    const fallbackPermissions = asObject(fallback.permissions);

    return {
      ...fallback,
      ...primary,
      user: primary.user || fallback.user,
      profile: primary.profile || fallback.profile,
      displayName: primary.displayName || fallback.displayName,
      email: primary.email || fallback.email,
      avatarUrl:
        primary.avatarUrl ||
        getAvatarUrlFromProfile(primary.profile, primary.user) ||
        fallback.avatarUrl ||
        getAvatarUrlFromProfile(fallback.profile, fallback.user),
      permissions: mergePermissionObjects(primaryPermissions, fallbackPermissions)
    };
  }

  function normalizePermissionSource(source) {
    const raw = asObject(source);
    const roles = Array.isArray(raw.roles) ? raw.roles.map((role) => String(role || "").toLowerCase()) : [];
    const permissionKey = String(raw.permission_key || raw.permissionKey || raw.permission || raw.role || raw.type || "").toLowerCase();

    return {
      isMasterAdmin: Boolean(raw.isMasterAdmin || raw.is_master_admin || raw.master_admin || roles.includes("master_admin") || roles.includes("owner") || ["master", "master_admin", "owner", "super_admin"].includes(permissionKey)),
      isAdminSbw: Boolean(raw.isAdminSbw || raw.is_admin_sbw || raw.isAdmin || raw.is_admin || raw.admin_sbw || roles.includes("admin_sbw") || roles.includes("site_admin") || ["admin", "admin_sbw", "site_admin", "staff_admin"].includes(permissionKey)),
      canManagePermissions: Boolean(raw.canManagePermissions || raw.can_manage_permissions || roles.includes("can_manage_permissions") || ["can_manage_permissions", "permission_admin", "permissions_admin"].includes(permissionKey))
    };
  }

  function mergePermissionObjects(...sources) {
    const normalized = sources.map(normalizePermissionSource);
    const isMasterAdmin = normalized.some((item) => item.isMasterAdmin);
    const isAdminSbw = isMasterAdmin || normalized.some((item) => item.isAdminSbw);
    const canManagePermissions = isMasterAdmin || normalized.some((item) => item.canManagePermissions);

    return {
      isMasterAdmin,
      isAdminSbw,
      canManagePermissions
    };
  }

  function canAccessAdmin(context) {
    const permissions = context?.permissions || {};

    return Boolean(
      permissions.isMasterAdmin ||
      permissions.is_master_admin ||
      permissions.isAdminSbw ||
      permissions.is_admin_sbw ||
      permissions.isAdmin ||
      permissions.is_admin ||
      permissions.canManagePermissions ||
      permissions.can_manage_permissions
    );
  }

  async function getCurrentContextSafely() {
    try {
      if (window.SBWSessionContext?.getCurrentContext) {
        return await window.SBWSessionContext.getCurrentContext({ refresh: true });
      }
    } catch (error) {
      console.warn("[SBW Sidebar] Não foi possível carregar contexto central:", error);
    }

    return null;
  }

  async function canManageAdminViaRpc(client) {
    if (!client?.rpc) return false;

    try {
      const result = await client.rpc("sbw_admin_panel_can_manage");
      return !result?.error && result?.data === true;
    } catch (error) {
      return false;
    }
  }

  async function getSidebarContextViaRpc(client) {
    if (!client?.rpc) return null;

    try {
      const result = await client.rpc("sbw_get_sidebar_context");
      if (result?.error || !result?.data) return null;

      const data = result.data && typeof result.data === "object" ? result.data : {};
      const profile = data.profile && typeof data.profile === "object" ? data.profile : null;
      const userData = data.user && typeof data.user === "object" ? data.user : null;
      const permissions = mergePermissionObjects(
        asObject(profile?.permissions || profile?.metadata?.permissions),
        asObject(data.permissions),
        data.canAdmin === true || data.can_admin === true ? { isAdminSbw: true, canManagePermissions: true } : null
      );

      return {
        profile,
        userData,
        displayName:
          profile?.display_name ||
          profile?.displayName ||
          profile?.nickname ||
          profile?.username ||
          userData?.display_name ||
          userData?.name ||
          "",
        email: data.email || userData?.email || "",
        avatarUrl: getAvatarUrlFromProfile(profile, userData),
        permissions
      };
    } catch (error) {
      return null;
    }
  }

  async function buildFallbackContextFromSupabase(user) {
    if (!user) return null;

    const client = await waitForSupabaseClient();
    const rpcContext = await getSidebarContextViaRpc(client);
    const adminAllowedByRpc = await canManageAdminViaRpc(client);

    const profile = rpcContext?.profile || null;
    const mergedUser = Object.assign({}, rpcContext?.userData || {}, user || {});
    const permissions = mergePermissionObjects(
      asObject(profile?.permissions || profile?.metadata?.permissions),
      rpcContext?.permissions,
      adminAllowedByRpc ? { isAdminSbw: true, canManagePermissions: true } : null
    );

    return {
      user: mergedUser,
      profile,
      displayName:
        rpcContext?.displayName ||
        profile?.display_name ||
        profile?.displayName ||
        profile?.nickname ||
        profile?.username ||
        getDisplayNameFromUser(user),
      avatarUrl: rpcContext?.avatarUrl || getAvatarUrlFromProfile(profile, user),
      email: user.email || rpcContext?.email || "",
      permissions
    };
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
        const betaBadge = link.beta
          ? `<span class="sbw-sidebar__beta-badge" aria-label="Área em beta">Beta</span>`
          : "";

        return `
          <a class="sbw-sidebar__link ${isActive}" href="${link.href}" data-sbw-sidebar-nav>
            <span class="sbw-sidebar__icon">${link.icon}</span>
            <span class="sbw-sidebar__label">
              <span>${link.label}</span>
              ${betaBadge}
            </span>
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

        <div class="sbw-account-card__actions">
          <a class="sbw-sidebar-button" href="/auth/login.html">
            Entrar / Criar conta
          </a>
        </div>
      </div>
    `;
  }

  function renderAccountAvatar(user, context = null) {
    const displayName = context?.displayName || getDisplayNameFromUser(user);
    const avatarUrl = context?.avatarUrl || getAvatarUrlFromProfile(context?.profile, user);
    const initial = escapeHtml(String(displayName || getInitialFromUser(user)).trim().charAt(0).toUpperCase() || "S");

    if (avatarUrl) {
      return `<span class="sbw-account-card__avatar sbw-account-card__avatar--image"><img src="${escapeHtml(avatarUrl)}" alt="" loading="lazy" /></span>`;
    }

    return `<span class="sbw-account-card__avatar">${initial}</span>`;
  }

  function renderLoggedInAccount(user, context = null) {
    const displayName = context?.displayName || getDisplayNameFromUser(user);
    const name = escapeHtml(displayName);
    const avatar = renderAccountAvatar(user, context);
    const canOpenAdmin = canAccessAdmin(context);
    const adminItem = canOpenAdmin
      ? `
          <a class="sbw-account-dropdown__item sbw-account-dropdown__item--primary" href="/admin/admin.html">
            <span>⚙️</span>
            <strong>Administrador</strong>
          </a>
        `
      : "";
    return `
      <div class="sbw-account-compact" data-sbw-account-compact>
        <button
          class="sbw-account-compact__button"
          type="button"
          aria-expanded="false"
          data-sbw-account-toggle
        >
          ${avatar}

          <span class="sbw-account-compact__name">
            ${name}
          </span>

          <span class="sbw-account-compact__chevron">▾</span>
        </button>

        <nav class="sbw-account-dropdown" aria-label="Menu do perfil" data-sbw-account-menu hidden>
          <a class="sbw-account-dropdown__item sbw-account-dropdown__item--primary" href="/perfis/meu-perfil.html">
            <span>👤</span>
            <strong>Meu perfil</strong>
          </a>

          <a class="sbw-account-dropdown__item" href="/equipes/minha-equipe.html">
            <span>🛡️</span>
            <strong>Minha equipe</strong>
          </a>

          <a class="sbw-account-dropdown__item" href="/perfis/meu-perfil.html#inscricoes">
            <span>🎟️</span>
            <strong>Minhas inscrições</strong>
          </a>

          <a class="sbw-account-dropdown__item" href="/perfis/meu-perfil.html#convites">
            <span>✉️</span>
            <strong>Convites</strong>
          </a>


          ${adminItem}

          <button class="sbw-account-dropdown__item sbw-account-dropdown__item--danger" type="button" data-sbw-logout>
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

    let context = await getCurrentContextSafely();
    const user = context?.user || await getCurrentUserSafely();

    if (!user) return;

    const fallbackContext = await buildFallbackContextFromSupabase(user);
    context = mergeSidebarContexts(context, fallbackContext) || { user };

    accountArea.innerHTML = renderLoggedInAccount(user, context);

    const logoutButton = accountArea.querySelector("[data-sbw-logout]");

    if (logoutButton) {
      logoutButton.addEventListener("click", signOutSafely);
    }

    const accountToggle = accountArea.querySelector("[data-sbw-account-toggle]");
    const accountMenu = accountArea.querySelector("[data-sbw-account-menu]");

    if (accountToggle && accountMenu) {
      accountToggle.addEventListener("click", () => {
        const isOpen = accountToggle.getAttribute("aria-expanded") === "true";

        accountToggle.setAttribute("aria-expanded", String(!isOpen));
        accountMenu.hidden = isOpen;
        accountArea.classList.toggle("is-account-menu-open", !isOpen);
      });

      accountMenu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMobileSidebar);
      });
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


  function ensureVisualBalanceStyles() {
    const id = "sbwVisualBalanceStyles";

    if (document.getElementById(id)) return;

    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = "/css/core/sbw-visual-balance.css?v=1634";

    document.head.appendChild(link);
  }

  async function initSidebar() {
    ensureVisualBalanceStyles();

    const mount = document.getElementById("sbwSidebarMount");

    if (!mount) return;

    const activePage = getActivePage();

    document.body.classList.add("sbw-has-sidebar");

    mount.innerHTML = `
      <aside class="sbw-sidebar" aria-label="Menu principal SaberWolf">
        <div class="sbw-sidebar__top sbw-sidebar__top--account-only">
          <div class="sbw-sidebar__account sbw-sidebar__account--top" data-sbw-sidebar-account>
            ${renderLoggedOutAccount()}
          </div>
        </div>

        <nav class="sbw-sidebar__nav" aria-label="Navegação principal">
          ${renderLinks(activePage)}
        </nav>
      </aside>
    `;

    const sidebarElement = mount.querySelector(".sbw-sidebar");

    if (!sidebarElement) return;

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