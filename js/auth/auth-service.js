(function () {
  const CURRENT_USER_STORAGE_KEY = "sbw_current_user_v1_3_9";
  const AUTH_RETURN_URL_STORAGE_KEY = "sbw_auth_return_url_v1_5_6";

  function isAuthPageUrl(url) {
  try {
    const parsedUrl = new URL(url, window.location.href);
    return parsedUrl.pathname.includes("/auth/");
  } catch (error) {
    return false;
  }
}

function normalizeReturnUrl(value) {
  if (!value) {
    return "";
  }

  try {
    const parsedUrl = new URL(value, window.location.href);
    const rootUrl = new URL(getRootUrl());

    const isSameOrigin = parsedUrl.origin === window.location.origin;
    const isInsideProject = parsedUrl.href.startsWith(rootUrl.href);
    const isAuthPage = parsedUrl.pathname.includes("/auth/");

    if (!isSameOrigin || !isInsideProject || isAuthPage) {
      return "";
    }

    return parsedUrl.href;
  } catch (error) {
    return "";
  }
}

function getReturnUrlFromQuery() {
  const params = new URLSearchParams(window.location.search);
  return normalizeReturnUrl(params.get("redirect"));
}

function getCurrentPageAsReturnUrl() {
  if (isAuthPageUrl(window.location.href)) {
    return "";
  }

  return normalizeReturnUrl(window.location.href);
}

function rememberReturnUrl(value) {
  const safeUrl = normalizeReturnUrl(value);

  if (!safeUrl) {
    return "";
  }

  sessionStorage.setItem(AUTH_RETURN_URL_STORAGE_KEY, safeUrl);

  return safeUrl;
}

function getStoredReturnUrl() {
  return normalizeReturnUrl(sessionStorage.getItem(AUTH_RETURN_URL_STORAGE_KEY));
}

function clearStoredReturnUrl() {
  sessionStorage.removeItem(AUTH_RETURN_URL_STORAGE_KEY);
}

function prepareAuthReturnUrl(fallbackUrl) {
  const queryReturnUrl = getReturnUrlFromQuery();
  const fallbackReturnUrl = normalizeReturnUrl(fallbackUrl);
  const currentPageReturnUrl = getCurrentPageAsReturnUrl();

  return (
    rememberReturnUrl(queryReturnUrl) ||
    rememberReturnUrl(fallbackReturnUrl) ||
    rememberReturnUrl(currentPageReturnUrl) ||
    getStoredReturnUrl()
  );
}

  function getClient() {
    if (
      !window.SBWSupabase ||
      typeof window.SBWSupabase.isEnabled !== "function" ||
      !window.SBWSupabase.isEnabled()
    ) {
      return null;
    }

    return window.SBWSupabase.client;
  }

  function getRootUrl() {
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

  function getCallbackUrl() {
  const callbackUrl = new URL("auth/callback.html", getRootUrl());
  const returnUrl = getReturnUrlFromQuery() || getStoredReturnUrl();

  if (returnUrl) {
    callbackUrl.searchParams.set("redirect", returnUrl);
  }

  return callbackUrl.href;
}

function getPasswordResetUrl() {
  return new URL("auth/redefinir-senha.html", getRootUrl()).href;
}

  function getAfterLoginUrl() {
  const returnUrl = getReturnUrlFromQuery() || getStoredReturnUrl();

  if (returnUrl) {
    clearStoredReturnUrl();
    return returnUrl;
  }

  return new URL("index.html", getRootUrl()).href;
}

function getLoginUrl(returnUrl) {
  const loginUrl = new URL("auth/login.html", getRootUrl());
  const safeReturnUrl = normalizeReturnUrl(returnUrl) || getCurrentPageAsReturnUrl();

  if (safeReturnUrl) {
    loginUrl.searchParams.set("redirect", safeReturnUrl);
  }

  return loginUrl.href;
}

  function normalizeText(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function createPublicUsername(user) {
    const metadata = user.user_metadata || {};
    const emailPrefix = user.email ? user.email.split("@")[0] : "";
    const base =
      normalizeText(metadata.user_name) ||
      normalizeText(metadata.preferred_username) ||
      normalizeText(metadata.name) ||
      normalizeText(metadata.full_name) ||
      normalizeText(emailPrefix) ||
      "usuario";

    return base + "-" + String(user.id || "").slice(0, 6);
  }

  function getProviderName(user) {
    if (!user) return "email";

    if (Array.isArray(user.identities) && user.identities.length) {
      return user.identities[0].provider || "email";
    }

    return user.app_metadata?.provider || "email";
  }

  function getDisplayName(user) {
    const metadata = user.user_metadata || {};
    const emailPrefix = user.email ? user.email.split("@")[0] : "";

    return (
      metadata.full_name ||
      metadata.name ||
      metadata.display_name ||
      metadata.preferred_username ||
      metadata.user_name ||
      emailPrefix ||
      "Usuário -SBW-"
    );
  }

  function getAvatarUrl(user) {
    const metadata = user.user_metadata || {};

    return (
      metadata.avatar_url ||
      metadata.picture ||
      metadata.image_url ||
      ""
    );
  }

  function getDefaultPermissions() {
  return {
    canCreateTeam: false,
    canCreateTournament: false,
    isAdmin: false,
    organizerStatus: "none"
  };
}

function normalizeProfilePermissions(profile) {
  const rawPermissions =
    profile?.metadata?.permissions ||
    profile?.permissions ||
    {};

  return {
    canCreateTeam: Boolean(
      rawPermissions.canCreateTeam ||
      rawPermissions.can_create_team
    ),
    canCreateTournament: Boolean(
      rawPermissions.canCreateTournament ||
      rawPermissions.can_create_tournament
    ),
    isAdmin: Boolean(
      rawPermissions.isAdmin ||
      rawPermissions.is_admin
    ),
    organizerStatus:
      rawPermissions.organizerStatus ||
      rawPermissions.organizer_status ||
      "none"
  };
}

function mergePermissions(profile, organizerPermission) {
  const basePermissions = normalizeProfilePermissions(profile);

  const isApprovedOrganizer =
    organizerPermission &&
    organizerPermission.status === "approved" &&
    organizerPermission.can_create_tournaments === true;

  return {
    canCreateTeam: Boolean(basePermissions.canCreateTeam),
    canCreateTournament: Boolean(
      basePermissions.canCreateTournament ||
      isApprovedOrganizer ||
      basePermissions.isAdmin
    ),
    isAdmin: Boolean(basePermissions.isAdmin),
    organizerStatus: organizerPermission?.status || basePermissions.organizerStatus || "none"
  };
}

 function writeCurrentUser(profile, user, permissionsOverride) {
  const profileId =
    profile.slug ||
    profile.username ||
    profile.id ||
    user.id;

  const currentUser = {
    id: profileId,
    userId: profileId,
    profileId: profile.id,
    authUserId: user.id,
    email: user.email || "",
    nickname: profile.nickname || profile.username || getDisplayName(user),
    displayName: profile.display_name || profile.displayName || getDisplayName(user),
    avatarUrl: profile.avatar_url || profile.avatarUrl || getAvatarUrl(user),
    permissions: permissionsOverride || normalizeProfilePermissions(profile) || getDefaultPermissions()
  };

  localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(currentUser));

  return currentUser;
}

  async function getSession() {
    const client = getClient();

    if (!client) {
      return null;
    }

    const result = await client.auth.getSession();

    if (result.error) {
      console.warn("[SBW Auth] Erro ao buscar sessão:", result.error);
      return null;
    }

    return result.data.session || null;
  }

  async function getUser() {
  const client = getClient();

  if (!client) {
    return null;
  }

  const session = await getSession();

  if (!session) {
    return null;
  }

  const result = await client.auth.getUser();

  if (result.error) {
    console.warn("[SBW Auth] Erro ao buscar usuário:", result.error);
    return null;
  }

  return result.data.user || null;
}

async function getOrganizerPermission(authUserId) {
  const client = getClient();

  if (!client || !authUserId) {
    return null;
  }

  const result = await client
    .from("organizer_permissions")
    .select("*")
    .eq("auth_user_id", authUserId)
    .maybeSingle();

  if (result.error) {
    console.warn("[SBW Auth] Erro ao buscar permissão de organizador:", result.error);
    return null;
  }

  return result.data || null;
}

  async function findProfileByAuthUserId(authUserId) {
    const client = getClient();

    if (!client || !authUserId) {
      return null;
    }

    const result = await client
      .from("profiles")
      .select("*")
      .eq("auth_user_id", authUserId)
      .maybeSingle();

    if (result.error) {
      console.warn("[SBW Auth] Erro ao buscar profile por auth_user_id:", result.error);
      return null;
    }

    return result.data || null;
  }

  async function createBasicProfile(user) {
    const client = getClient();

    if (!client || !user) {
      return null;
    }

    const username = createPublicUsername(user);
const publicProfileId = username;
const displayName = getDisplayName(user);
const avatarUrl = getAvatarUrl(user);
const provider = getProviderName(user);
const now = new Date().toISOString();

      const row = {
      id: publicProfileId,
      auth_user_id: user.id,
      username: username,
      slug: username,
      nickname: displayName,
      display_name: displayName,
      avatar_url: avatarUrl,
      banner_url: "",
      headline: "",
      bio: "",
      country: "Brasil",
      state: "",
      city: "",
      main_role: "Player",
      public_tags: ["Player"],
      roles: ["player"],
      social_links: {},
      metadata: {
        permissions: {
          canCreateTeam: false,
          canCreateTournament: false,
          isAdmin: false
        },
        authProvider: provider
      },
      is_public: true,
      is_verified: false,
      profile_completed: false,
      created_via: provider,
      last_login_at: now,
      created_at: now,
      updated_at: now
    };

    const result = await client
      .from("profiles")
      .insert(row)
      .select("*")
      .single();

    if (result.error) {
      console.error("[SBW Auth] Erro ao criar profile básico:", result.error);
      throw result.error;
    }

    return result.data;
  }

  async function updateLastLogin(profileId) {
    const client = getClient();

    if (!client || !profileId) {
      return;
    }

    await client
      .from("profiles")
      .update({
        last_login_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq("id", profileId);
  }

 async function ensureCurrentUserProfile() {
  const user = await getUser();

  if (!user) {
    return null;
  }

  let profile = await findProfileByAuthUserId(user.id);

  if (!profile) {
    profile = await createBasicProfile(user);
  } else {
    await updateLastLogin(profile.id);
  }

  const organizerPermission = await getOrganizerPermission(user.id);
  const permissions = mergePermissions(profile, organizerPermission);

  profile.permissions = permissions;
  profile.organizerPermission = organizerPermission;

  writeCurrentUser(profile, user, permissions);

  return profile;
}
  async function signUpWithEmail(email, password, displayName) {
  const client = getClient();

  if (!client) {
    throw new Error("Supabase não está configurado.");
  }

  prepareAuthReturnUrl();

  return client.auth.signUp({
      email: email,
      password: password,
      options: {
        emailRedirectTo: getCallbackUrl(),
        data: {
          display_name: displayName || "",
          full_name: displayName || ""
        }
      }
    });
  }

  async function signInWithEmail(email, password) {
  const client = getClient();

  if (!client) {
    throw new Error("Supabase não está configurado.");
  }

  prepareAuthReturnUrl();

  return client.auth.signInWithPassword({
      email: email,
      password: password
    });
  }

async function requestPasswordReset(email) {
  const client = getClient();

  if (!client) {
    throw new Error("Supabase não está configurado.");
  }

  return client.auth.resetPasswordForEmail(email, {
    redirectTo: getPasswordResetUrl()
  });
}

async function updatePassword(newPassword) {
  const client = getClient();

  if (!client) {
    throw new Error("Supabase não está configurado.");
  }

  return client.auth.updateUser({
    password: newPassword
  });
}

function onAuthStateChange(callback) {
  const client = getClient();

  if (!client || typeof callback !== "function") {
    return null;
  }

  return client.auth.onAuthStateChange(callback);
}

  async function signInWithProvider(provider) {
  const client = getClient();

  if (!client) {
    throw new Error("Supabase não está configurado.");
  }

  prepareAuthReturnUrl();

  return client.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: getCallbackUrl()
      }
    });
  }

  async function signOut() {
    const client = getClient();

    localStorage.removeItem(CURRENT_USER_STORAGE_KEY);

    if (!client) {
      return;
    }

    await client.auth.signOut();
  }

  window.SBWAuth = {
  getClient: getClient,
  getRootUrl: getRootUrl,
  getCallbackUrl: getCallbackUrl,
  getPasswordResetUrl: getPasswordResetUrl,
  getAfterLoginUrl: getAfterLoginUrl,
  getLoginUrl: getLoginUrl,
  prepareAuthReturnUrl: prepareAuthReturnUrl,

    getSession: getSession,
    getUser: getUser,

    signUpWithEmail: signUpWithEmail,
    signInWithEmail: signInWithEmail,
    requestPasswordReset: requestPasswordReset,
    updatePassword: updatePassword,
    onAuthStateChange: onAuthStateChange,
    signInWithProvider: signInWithProvider,
    signOut: signOut,

    ensureCurrentUserProfile: ensureCurrentUserProfile,
    findProfileByAuthUserId: findProfileByAuthUserId,
    getOrganizerPermission: getOrganizerPermission
  };
})();