(function () {
  "use strict";

  const CACHE_TTL_MS = 15000;
  const state = {
    context: null,
    promise: null,
    loadedAt: 0
  };

  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function waitForSupabaseClient() {
    for (let attempt = 0; attempt < 40; attempt += 1) {
      const client = window.SBWSupabase?.client;

      if (client?.auth) {
        return client;
      }

      await wait(100);
    }

    return null;
  }

  function getSupabaseTable(name, fallback) {
    return window.SBWSupabaseConfig?.tables?.[name] || fallback;
  }

  function asObject(value) {
    return value && typeof value === "object" && !Array.isArray(value) ? value : {};
  }

  function asArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function uniqueValues(values) {
    return Array.from(
      new Set(
        values
          .map((value) => String(value || "").trim())
          .filter(Boolean)
      )
    );
  }

  function getDisplayName(profile, user) {
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

  function getAvatarUrl(profile, user) {
    const metadata = user?.user_metadata || {};

    return (
      profile?.avatar_url ||
      profile?.avatarUrl ||
      metadata.avatar_url ||
      metadata.picture ||
      ""
    );
  }

  function getProfileKey(profile, user) {
    return (
      profile?.slug ||
      profile?.username ||
      profile?.profile_slug ||
      profile?.publicProfileKey ||
      profile?.metadata?.publicProfileKey ||
      profile?.id ||
      user?.id ||
      ""
    );
  }

  function getProfileIdentifiers(profile, user) {
    return uniqueValues([
      getProfileKey(profile, user),
      profile?.slug,
      profile?.username,
      profile?.profile_slug,
      profile?.id,
      user?.id,
      user?.email
    ]);
  }

  function normalizePermissionSource(source) {
    const raw = asObject(source);

    const roles = uniqueValues([
      ...(Array.isArray(raw.roles) ? raw.roles : []),
      raw.role,
      raw.permission,
      raw.permission_key,
      raw.permissionKey,
      raw.type
    ]).map((role) => role.toLowerCase());

    const isMasterAdmin = Boolean(
      raw.master_admin ||
      raw.is_master_admin ||
      raw.isMasterAdmin ||
      roles.includes("master_admin") ||
      roles.includes("owner")
    );

    const isAdminSbw = Boolean(
      isMasterAdmin ||
      raw.admin_sbw ||
      raw.is_admin_sbw ||
      raw.isAdminSbw ||
      raw.isAdmin ||
      raw.is_admin ||
      roles.includes("admin_sbw") ||
      roles.includes("admin")
    );

    const canCreateTournament = Boolean(
      isAdminSbw ||
      raw.canCreateTournament ||
      raw.can_create_tournament ||
      raw.canCreateTournaments ||
      raw.can_create_tournaments ||
      raw.tournament_admin ||
      roles.includes("tournament_admin")
    );

    const canVerifyTeam = Boolean(
      isAdminSbw ||
      raw.canVerifyTeam ||
      raw.can_verify_team ||
      raw.canManageTeams ||
      raw.can_manage_teams ||
      roles.includes("team_admin")
    );

    const canManagePermissions = Boolean(
      isMasterAdmin ||
      raw.canManagePermissions ||
      raw.can_manage_permissions ||
      roles.includes("permission_admin")
    );

    return {
      roles,
      isMasterAdmin,
      isAdminSbw,
      canCreateTournament,
      canVerifyTeam,
      canManagePermissions
    };
  }

  function mergePermissions(...sources) {
    const normalized = sources.map(normalizePermissionSource);
    const roles = uniqueValues(normalized.flatMap((item) => item.roles));

    return {
      roles,
      isMasterAdmin: normalized.some((item) => item.isMasterAdmin),
      isAdminSbw: normalized.some((item) => item.isAdminSbw),
      canCreateTournament: normalized.some((item) => item.canCreateTournament),
      canVerifyTeam: normalized.some((item) => item.canVerifyTeam),
      canManagePermissions: normalized.some((item) => item.canManagePermissions)
    };
  }

  function permissionRowIsActive(row) {
    const safeRow = asObject(row);
    const status = String(safeRow.status || safeRow.state || "active").toLowerCase();

    if (["inactive", "disabled", "revoked", "rejected", "denied", "blocked"].includes(status)) {
      return false;
    }

    if (safeRow.active === false || safeRow.is_active === false || safeRow.enabled === false) {
      return false;
    }

    return true;
  }

  function normalizeSitePermissionRows(rows) {
    const activeRows = asArray(rows).filter(permissionRowIsActive);
    const roles = [];
    const merged = {
      roles,
      isMasterAdmin: false,
      isAdminSbw: false,
      canCreateTournament: false,
      canVerifyTeam: false,
      canManagePermissions: false,
      source: "site_permissions"
    };

    activeRows.forEach((row) => {
      const safeRow = asObject(row);
      const permissionKey = String(
        safeRow.permission_key ||
        safeRow.permissionKey ||
        safeRow.permission ||
        safeRow.role ||
        safeRow.type ||
        safeRow.name ||
        ""
      ).trim().toLowerCase();

      if (permissionKey) roles.push(permissionKey);

      const direct = normalizePermissionSource(safeRow);

      merged.isMasterAdmin = merged.isMasterAdmin || direct.isMasterAdmin || ["master", "master_admin", "owner", "super_admin"].includes(permissionKey);
      merged.isAdminSbw = merged.isAdminSbw || direct.isAdminSbw || ["admin", "admin_sbw", "site_admin", "staff_admin"].includes(permissionKey);
      merged.canCreateTournament = merged.canCreateTournament || direct.canCreateTournament || ["can_create_tournament", "can_create_tournaments", "tournament_admin", "organizer_admin"].includes(permissionKey);
      merged.canVerifyTeam = merged.canVerifyTeam || direct.canVerifyTeam || ["can_verify_team", "team_admin", "teams_admin", "verify_team"].includes(permissionKey);
      merged.canManagePermissions = merged.canManagePermissions || direct.canManagePermissions || ["can_manage_permissions", "permission_admin", "permissions_admin"].includes(permissionKey);
    });

    merged.roles = uniqueValues(roles);

    if (merged.isMasterAdmin) {
      merged.isAdminSbw = true;
      merged.canManagePermissions = true;
      merged.canCreateTournament = true;
      merged.canVerifyTeam = true;
    }

    if (merged.isAdminSbw) {
      merged.canCreateTournament = true;
      merged.canVerifyTeam = true;
    }

    return activeRows.length ? merged : null;
  }

  async function getCurrentUser() {
    try {
      if (window.SBWAuth?.getUser) {
        const result = await window.SBWAuth.getUser();

        if (result?.id || result?.email) return result;
        if (result?.user) return result.user;
        if (result?.data?.user) return result.data.user;
      }

      const client = await waitForSupabaseClient();

      if (client?.auth?.getSession) {
        const sessionResult = await client.auth.getSession();
        const sessionUser = sessionResult?.data?.session?.user;

        if (sessionUser) return sessionUser;
      }

      if (client?.auth?.getUser) {
        const userResult = await client.auth.getUser();
        const user = userResult?.data?.user;

        if (user) return user;
      }
    } catch (error) {
      console.warn("[SBW Session] Não foi possível obter usuário autenticado:", error);
    }

    return null;
  }

  async function getCurrentProfile(user) {
    if (!user) return null;

    try {
      if (window.SBWAuth?.ensureCurrentUserProfile) {
        const ensuredProfile = await window.SBWAuth.ensureCurrentUserProfile();

        if (ensuredProfile) {
          return ensuredProfile;
        }
      }
    } catch (error) {
      console.warn("[SBW Session] ensureCurrentUserProfile falhou:", error);
    }

    try {
      const client = await waitForSupabaseClient();
      const tableName = getSupabaseTable("profiles", "profiles");

      if (!client) return null;

      const byAuthUserId = await client
        .from(tableName)
        .select("*")
        .eq("auth_user_id", user.id)
        .maybeSingle();

      if (!byAuthUserId.error && byAuthUserId.data) {
        return byAuthUserId.data;
      }

      const byId = await client
        .from(tableName)
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (!byId.error && byId.data) {
        return byId.data;
      }
    } catch (error) {
      console.warn("[SBW Session] Não foi possível obter profile real:", error);
    }

    return null;
  }

  async function getOrganizerPermission(user) {
    if (!user) return null;

    try {
      if (window.SBWAuth?.getOrganizerPermission) {
        const result = await window.SBWAuth.getOrganizerPermission(user.id);
        if (result) return result;
      }
    } catch (error) {
      console.warn("[SBW Session] Permissão de organizador via SBWAuth falhou:", error);
    }

    try {
      const client = await waitForSupabaseClient();

      if (!client) return null;

      const result = await client
        .from("organizer_permissions")
        .select("*")
        .eq("auth_user_id", user.id)
        .maybeSingle();

      if (!result.error && result.data) return result.data;
    } catch (error) {
      console.warn("[SBW Session] Não foi possível consultar organizer_permissions:", error);
    }

    return null;
  }

  async function getSitePermission(user, profile) {
    if (!user && !profile) return null;

    const client = await waitForSupabaseClient();

    if (!client) return null;

    const profileKey = getProfileKey(profile, user);
    const attempts = [
      ["auth_user_id", user?.id],
      ["user_id", user?.id],
      ["profile_id", profile?.id],
      ["profile_slug", profileKey],
      ["slug", profileKey],
      ["email", user?.email],
      ["user_email", user?.email]
    ].filter((item) => item[1]);

    for (const [column, value] of attempts) {
      try {
        const result = await client
          .from("site_permissions")
          .select("*")
          .eq(column, value)
          .limit(50);

        if (!result.error && Array.isArray(result.data) && result.data.length) {
          const mergedRows = normalizeSitePermissionRows(result.data);
          if (mergedRows) return mergedRows;
        }
      } catch (error) {
        // A tabela/coluna pode ainda não existir no beta. Não bloquear a página por isso.
      }
    }

    return null;
  }


  function normalizeOrganizerPermission(permission) {
    if (!permission) return {};

    return {
      canCreateTournament:
        permission.status === "approved" &&
        permission.can_create_tournaments === true,
      organizerStatus: permission.status || "none",
      role: permission.role || ""
    };
  }

  async function getAllTeams() {
    const storage = window.SBWTeamsStorage || null;

    if (!storage?.getAllTeams && !storage?.getAllTeamsForSession) return [];

    try {
      if (typeof storage.getAllTeamsForSession === "function") {
        return await storage.getAllTeamsForSession();
      }

      return await storage.getAllTeams({ publicOnly: false });
    } catch (error) {
      console.warn("[SBW Session] Não foi possível carregar equipes:", error);
      return [];
    }
  }

  async function getTeamMembers(team) {
    if (!team || !window.SBWTeamsStorage?.getTeamMembers) return [];

    const key = team.slug || team.id || team.teamSlug || team.teamId || "";

    if (!key) return [];

    try {
      return await window.SBWTeamsStorage.getTeamMembers(key);
    } catch (error) {
      console.warn("[SBW Session] Não foi possível carregar membros da equipe:", error);
      return [];
    }
  }

  function isMainTeam(team) {
    if (!team) return false;

    const type = String(team.teamType || team.team_type || "main").toLowerCase();

    return (
      !team.parentTeamId &&
      !team.parentTeamSlug &&
      !team.parent_team_slug &&
      type !== "subteam" &&
      type !== "sub_team" &&
      type !== "academy"
    );
  }

  function teamBelongsToProfile(team, context) {
    if (!team || !context) return false;

    const identifiers = context.identifiers || [];
    const authUserId = context.user?.id || "";
    const profileKey = context.profileKey || "";

    return (
      identifiers.includes(String(team.captainUserId || "")) ||
      identifiers.includes(String(team.captainProfileSlug || "")) ||
      identifiers.includes(String(team.ownerUserId || "")) ||
      identifiers.includes(String(team.ownerProfileSlug || "")) ||
      String(team.captainUserId || "") === authUserId ||
      String(team.captainProfileSlug || "") === profileKey ||
      String(team.metadata?.createdByAuthUserId || "") === authUserId ||
      String(team.metadata?.createdByProfileSlug || "") === profileKey
    );
  }

  function memberBelongsToProfile(member, context) {
    if (!member || !context) return false;

    const identifiers = context.identifiers || [];
    const authUserId = context.user?.id || "";
    const profileKey = context.profileKey || "";

    return (
      identifiers.includes(String(member.profileSlug || "")) ||
      identifiers.includes(String(member.profileId || "")) ||
      identifiers.includes(String(member.userId || "")) ||
      identifiers.includes(String(member.authUserId || "")) ||
      String(member.profileSlug || "") === profileKey ||
      String(member.profileId || "") === profileKey ||
      String(member.userId || "") === profileKey ||
      String(member.userId || "") === authUserId ||
      String(member.authUserId || "") === authUserId
    );
  }

  function memberCanManage(member) {
    const role = String(member?.role || "").toLowerCase();

    return ["captain", "owner", "team_owner", "vice_captain", "manager", "admin"].includes(role);
  }

  async function findCurrentTeam(context) {
    if (!context?.user) {
      return {
        currentTeam: null,
        currentTeamMember: null,
        ownedTeams: [],
        manageableTeams: []
      };
    }

    const teams = await getAllTeams();
    const ownedTeams = [];
    const manageableTeams = [];
    let currentTeam = null;
    let currentTeamMember = null;

    for (const team of teams) {
      const isOwner = isMainTeam(team) && teamBelongsToProfile(team, context);
      const members = await getTeamMembers(team);
      const member = members.find((item) => {
        return String(item.status || "active") === "active" && memberBelongsToProfile(item, context);
      });

      if (isOwner) {
        ownedTeams.push(team);
      }

      if (isOwner || memberCanManage(member) || context.permissions.isAdminSbw) {
        manageableTeams.push(team);
      }

      if (!currentTeam && member) {
        currentTeam = team;
        currentTeamMember = member;
      }

      if (!currentTeam && isOwner) {
        currentTeam = team;
        currentTeamMember = member || {
          role: "captain",
          status: "active",
          profileSlug: context.profileKey,
          displayName: context.displayName
        };
      }
    }

    return {
      currentTeam,
      currentTeamMember,
      ownedTeams,
      manageableTeams
    };
  }

  function canManageTeam(team, context) {
    if (!team || !context?.user) return false;

    if (context.permissions?.isAdminSbw || context.permissions?.isMasterAdmin) {
      return true;
    }

    if (teamBelongsToProfile(team, context)) {
      return true;
    }

    const currentTeamKey = context.currentTeam?.slug || context.currentTeam?.id || "";
    const targetTeamKey = team.slug || team.id || "";

    if (currentTeamKey && targetTeamKey && currentTeamKey === targetTeamKey) {
      return memberCanManage(context.currentTeamMember);
    }

    return false;
  }

  function canCreateTeam(context) {
    if (!context?.user) return false;

    return !context.currentTeam && !(context.ownedTeams || []).length;
  }

  function canCreateSubteam(team, context) {
    if (!canManageTeam(team, context)) return false;

    const isVerified =
      team?.isVerified === true ||
      team?.verificationStatus === "verified" ||
      team?.is_verified === true;

    return Boolean(isVerified);
  }

  function canCreateTournament(context) {
    return Boolean(
      context?.permissions?.canCreateTournament ||
      context?.permissions?.isAdminSbw ||
      context?.permissions?.isMasterAdmin
    );
  }

  function canVerifyTeam(context) {
    return Boolean(
      context?.permissions?.canVerifyTeam ||
      context?.permissions?.isAdminSbw ||
      context?.permissions?.isMasterAdmin
    );
  }

  function isMasterAdmin(context) {
    return Boolean(context?.permissions?.isMasterAdmin);
  }

  async function buildContext() {
    const user = await getCurrentUser();
    const profile = user ? await getCurrentProfile(user) : null;
    const profilePermissions = asObject(profile?.metadata?.permissions || profile?.permissions);
    const organizerPermission = user ? await getOrganizerPermission(user) : null;
    const sitePermission = user ? await getSitePermission(user, profile) : null;
    const organizerNormalized = normalizeOrganizerPermission(organizerPermission);

    const permissions = mergePermissions(
      profilePermissions,
      organizerNormalized,
      sitePermission
    );

    if (organizerNormalized.canCreateTournament) {
      permissions.canCreateTournament = true;
    }

    const context = {
      user,
      profile,
      profileKey: getProfileKey(profile, user),
      identifiers: getProfileIdentifiers(profile, user),
      displayName: getDisplayName(profile, user),
      avatarUrl: getAvatarUrl(profile, user),
      email: user?.email || "",
      permissions,
      organizerPermission,
      sitePermission,
      currentTeam: null,
      currentTeamMember: null,
      ownedTeams: [],
      manageableTeams: []
    };

    const teamState = await findCurrentTeam(context);

    Object.assign(context, teamState);

    context.canCreateTeam = canCreateTeam(context);
    context.canCreateTournament = canCreateTournament(context);
    context.canVerifyTeam = canVerifyTeam(context);
    context.isMasterAdmin = isMasterAdmin(context);

    return context;
  }

  async function getCurrentContext(options = {}) {
    const now = Date.now();

    if (
      !options.refresh &&
      state.context &&
      now - state.loadedAt < CACHE_TTL_MS
    ) {
      return state.context;
    }

    if (!options.refresh && state.promise) {
      return state.promise;
    }

    state.promise = buildContext()
      .then((context) => {
        state.context = context;
        state.loadedAt = Date.now();
        return context;
      })
      .finally(() => {
        state.promise = null;
      });

    return state.promise;
  }

  function clearCache() {
    state.context = null;
    state.promise = null;
    state.loadedAt = 0;
  }

  window.SBWSessionContext = {
    getCurrentContext,
    refresh: () => getCurrentContext({ refresh: true }),
    clearCache,

    getCurrentUser,
    getCurrentProfile,
    getProfileKey,
    getDisplayName,

    canCreateTeam,
    canManageTeam,
    canCreateSubteam,
    canCreateTournament,
    canVerifyTeam,
    isMasterAdmin,

    teamBelongsToProfile,
    memberBelongsToProfile,
    memberCanManage
  };
})();
