(function () {
  const config = window.SBW_TEAMS_CONFIG || {};
  const demo = window.SBW_TEAMS_DEMO_DATA || {};
  const models = window.SBWTeamsModels || {};

  const storageKeys = config.storageKeys || {};
  const teamTypes = config.teamTypes || {};
  const verificationStatus = config.verificationStatus || {};
  const limits = config.limits || {};
  const tagRules = config.tagRules || {};

  function getStorageKey(name, fallback) {
    return storageKeys[name] || fallback;
  }

  function getMainTeamType() {
    return teamTypes.mainTeam || "main";
  }

  function getSubteamType() {
    return teamTypes.subteam || teamTypes.subTeam || "subteam";
  }

  function getVerifiedStatus() {
    return verificationStatus.verified || "verified";
  }

  function localDemoFallbackAllowed() {
    const host = String(window.location?.hostname || "").toLowerCase();
    const cfg = window.SBW_TEAMS_CONFIG || {};

    return Boolean(
      cfg.allowLocalDemoFallback === true ||
      host === "localhost" ||
      host === "127.0.0.1" ||
      host === ""
    );
  }

  function localSupabaseMergeAllowed() {
    const cfg = window.SBW_TEAMS_CONFIG || {};
    return Boolean(cfg.allowLocalMergeWithSupabase === true && localDemoFallbackAllowed());
  }

  function getNotVerifiedStatus() {
    return verificationStatus.notVerified || verificationStatus.not_verified || "not_verified";
  }

  function getRejectedStatus() {
    return verificationStatus.rejected || "rejected";
  }

  function getCommonTeamLimit() {
    return Number(limits.commonTeamMembers || 50);
  }

  function getVerifiedTeamLimit() {
    return Number(limits.verifiedTeamMembers || 100);
  }

  function readJson(key, fallback) {
    try {
      const raw = localStorage.getItem(key);

      if (!raw) {
        return fallback;
      }

      return JSON.parse(raw);
    } catch (error) {
      console.warn("Erro ao ler storage:", key, error);
      return fallback;
    }
  }

  function writeJson(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn("Erro ao salvar storage:", key, error);
      return false;
    }
  }

  function asArray(value) {
    if (Array.isArray(value)) {
      return value;
    }

    if (!value || typeof value !== "object") {
      return [];
    }

    if (Array.isArray(value.items)) {
      return value.items;
    }

    if (Array.isArray(value.data)) {
      return value.data;
    }

    return Object.keys(value).map(function (key) {
      return value[key];
    });
  }

  function asObject(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      return {};
    }

    return value;
  }

  function normalizeTag(tag) {
    if (typeof models.normalizeTag === "function") {
      return models.normalizeTag(tag);
    }

    return String(tag || "")
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "");
  }

  function createSlug(value) {
    if (typeof models.createSlug === "function") {
      return models.createSlug(value);
    }

    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function normalizeTeamLocal(team) {
    const safeTeam = team || {};
    let normalized = null;

    if (typeof models.normalizeTeam === "function") {
      try {
        normalized = models.normalizeTeam(safeTeam);
      } catch (error) {
        console.warn("[SaberWolf Teams] Erro ao normalizar equipe pelo model:", error);
      }
    }

    if (!normalized) {
      const id = safeTeam.id || safeTeam.slug || "team-" + createSlug(safeTeam.name || "equipe");

      normalized = {
        id: id,
        slug: safeTeam.slug || id,
        name: safeTeam.name || "Equipe SaberWolf",
        tag: normalizeTag(safeTeam.tag || ""),
        teamType: safeTeam.teamType || getMainTeamType(),
        parentTeamId: safeTeam.parentTeamId || safeTeam.parentTeamSlug || null,

        description: safeTeam.description || safeTeam.bio || "",

        logoUrl: safeTeam.logoUrl || "",
        bannerUrl: safeTeam.bannerUrl || "",

        theme: safeTeam.theme || {
          primaryColor: "#00e5ff",
          secondaryColor: "#7c3cff",
          accentColor: "#ffffff",
          backgroundMode: "dark",
          source: "default"
        },

        verificationStatus: safeTeam.verificationStatus || getNotVerifiedStatus(),
        verificationType: safeTeam.verificationType || safeTeam.teamType || getMainTeamType(),
        memberLimit: safeTeam.memberLimit || getCommonTeamLimit(),

        captainUserId: safeTeam.captainUserId || "",
        captainName: safeTeam.captainName || "Capitão",

        games: Array.isArray(safeTeam.games) ? safeTeam.games : [],
        socialLinks: safeTeam.socialLinks || {},

        stats: safeTeam.stats || {
          tournamentsPlayed: 0,
          titles: 0,
          podiums: 0,
          prizeAmount: 0,
          prizeCurrency: "BRL"
        },

        createdAt: safeTeam.createdAt || new Date().toISOString(),
        updatedAt: safeTeam.updatedAt || new Date().toISOString()
      };
    }

    return Object.assign({}, normalized, {
      supabaseId: safeTeam.supabaseId || normalized.supabaseId || null,
      source: safeTeam.source || normalized.source || "local-demo",
      isPublic: typeof safeTeam.isPublic === "boolean" ? safeTeam.isPublic : normalized.isPublic,
      isVerified: typeof safeTeam.isVerified === "boolean" ? safeTeam.isVerified : normalized.isVerified,
      rosterSummary: safeTeam.rosterSummary || normalized.rosterSummary || {},
      achievements: safeTeam.achievements || normalized.achievements || [],
      subteams: safeTeam.subteams || normalized.subteams || [],
      metadata: safeTeam.metadata || normalized.metadata || {}
    });
  }

  function normalizeMemberLocal(member) {
    if (typeof models.normalizeMember === "function") {
      return models.normalizeMember(member);
    }

    const safeMember = member || {};

    return {
      id: safeMember.id || "member-" + (safeMember.teamId || "team") + "-" + (safeMember.userId || "user"),
      teamId: safeMember.teamId || "",
      userId: safeMember.userId || "",
      profileId: safeMember.profileId || safeMember.userId || "",
      nickname: safeMember.nickname || safeMember.displayName || "Jogador",
      displayName: safeMember.displayName || safeMember.nickname || "Jogador",
      avatarUrl: safeMember.avatarUrl || "",
      role: safeMember.role || "member",
      function: safeMember.function || safeMember.functionName || "Player",
      functionName: safeMember.functionName || safeMember.function || "Player",
      games: Array.isArray(safeMember.games) ? safeMember.games : [],
      status: safeMember.status || "active",
      joinedAt: safeMember.joinedAt || safeMember.createdAt || "",
      createdAt: safeMember.createdAt || new Date().toISOString(),
      updatedAt: safeMember.updatedAt || new Date().toISOString()
    };
  }

  function getLocalTeams() {
    return readJson(getStorageKey("teams", "sbw_teams_v1_3_9"), []);
  }

  function saveLocalTeams(teams) {
    return writeJson(getStorageKey("teams", "sbw_teams_v1_3_9"), teams);
  }

  function getLocalMembers() {
    return readJson(getStorageKey("teamMembers", "sbw_team_members_v1_3_9"), []);
  }

  function saveLocalMembers(members) {
    return writeJson(getStorageKey("teamMembers", "sbw_team_members_v1_3_9"), members);
  }

  function mergeDemoAndLocalTeams() {
    const demoTeams = Array.isArray(demo.teams) ? demo.teams : [];
    const localTeams = getLocalTeams();

    const map = new Map();

    demoTeams.forEach((team) => {
      const normalized = normalizeTeamLocal(team);
      map.set(normalized.id, normalized);
    });

    localTeams.forEach((team) => {
      const normalized = normalizeTeamLocal(team);
      map.set(normalized.id, normalized);
    });

    return Array.from(map.values());
  }

  function mergeDemoAndLocalMembers() {
    const demoMembers = Array.isArray(demo.members) ? demo.members : [];
    const localMembers = getLocalMembers();

    const map = new Map();

    demoMembers.forEach((member) => {
      const normalized = normalizeMemberLocal(member);
      map.set(normalized.id, normalized);
    });

    localMembers.forEach((member) => {
      const normalized = normalizeMemberLocal(member);
      map.set(normalized.id, normalized);
    });

    return Array.from(map.values());
  }

  /* =========================================================
     SaberWolf v1.4.7 - Supabase Teams Adapter
     ========================================================= */

  function teamsSupabaseEnabled() {
    const supabaseConfig = window.SBWSupabaseConfig || {};

    return Boolean(
      supabaseConfig.mode !== "local-demo" &&
      window.SBWSupabase &&
      typeof window.SBWSupabase.isEnabled === "function" &&
      window.SBWSupabase.isEnabled()
    );
  }

  function getTeamsSupabaseTableName() {
    const supabaseConfig = window.SBWSupabaseConfig || {};

    if (supabaseConfig.tables && supabaseConfig.tables.teams) {
      return supabaseConfig.tables.teams;
    }

    return "teams";
  }

  function getSupabaseTeamType(row) {
    const type = String(row.team_type || "").toLowerCase();

    if (type === "subteam" || type === "sub_team" || type === "secondary") {
      return getSubteamType();
    }

    return getMainTeamType();
  }

  function normalizeSupabaseTeam(row) {
    const safeRow = row || {};
    const metadata = asObject(safeRow.metadata);
    const teamType = getSupabaseTeamType(safeRow);

    const theme = {
      primaryColor: safeRow.primary_color || metadata.primaryColor || "#00e5ff",
      secondaryColor: safeRow.secondary_color || metadata.secondaryColor || "#7c3cff",
      accentColor: safeRow.accent_color || metadata.accentColor || "#ffffff",
      backgroundMode: metadata.backgroundMode || "dark",
      source: "supabase"
    };

    return normalizeTeamLocal({
      id: safeRow.slug || safeRow.id,
      slug: safeRow.slug || safeRow.id,
      supabaseId: safeRow.id,

      name: safeRow.name || "Equipe SaberWolf",
      tag: safeRow.tag || "",

      teamType: teamType,
      parentTeamId: safeRow.parent_team_slug || null,
      parentTeamSlug: safeRow.parent_team_slug || null,

      description: safeRow.description || safeRow.bio || "",
      bio: safeRow.bio || safeRow.description || "",

      logoUrl: safeRow.logo_url || "",
      bannerUrl: safeRow.banner_url || "",

      theme: theme,

      verificationStatus: safeRow.is_verified ? getVerifiedStatus() : getNotVerifiedStatus(),
      verificationType: teamType,
      memberLimit: safeRow.member_limit || (safeRow.is_verified ? getVerifiedTeamLimit() : getCommonTeamLimit()),

      captainUserId: safeRow.captain_user_id || safeRow.captain_profile_slug || "",
      captainProfileSlug: safeRow.captain_profile_slug || "",
      captainName: safeRow.captain_name || "Capitão",

      games: asArray(safeRow.games),
      socialLinks: asObject(safeRow.social_links),

      rosterSummary: asObject(safeRow.roster_summary),
      achievements: asArray(safeRow.achievements),
      stats: asObject(safeRow.stats),
      subteams: asArray(safeRow.subteams),

      isPublic: Boolean(safeRow.is_public),
      isVerified: Boolean(safeRow.is_verified),
      status: safeRow.status || "active",

      source: "supabase",
      metadata: metadata,

      createdAt: safeRow.created_at || new Date().toISOString(),
      updatedAt: safeRow.updated_at || new Date().toISOString()
    });
  }

  async function getAllTeamsFromSupabase(options) {
    const safeOptions = options || {};
    const publicOnly = safeOptions.publicOnly !== false;

    if (!teamsSupabaseEnabled()) {
      return [];
    }

    const tableName = getTeamsSupabaseTableName();

    try {
      let query = window.SBWSupabase.client
        .from(tableName)
        .select("*");

      if (publicOnly) {
        // Público: mostra equipes publicadas e equipes antigas onde is_public ainda não foi preenchido.
        // Admin/Minha Equipe usam publicOnly:false para não perder equipes privadas/pendentes do dono.
        query = query.or("is_public.eq.true,is_public.is.null");
      }

      const result = await query.order("name", {
        ascending: true
      });

      if (result.error) {
        console.error("[SaberWolf Teams] Erro ao buscar equipes no Supabase:", result.error);
        return [];
      }

      if (!Array.isArray(result.data)) {
        return [];
      }

      return result.data.map(normalizeSupabaseTeam);
    } catch (error) {
      console.error("[SaberWolf Teams] Falha inesperada ao buscar equipes:", error);
      return [];
    }
  }

  function teamToSupabaseRow(teamData) {
    const team = normalizeTeamLocal(teamData);
    const theme = team.theme || {};
    const metadata = team.metadata || {};
    const isSubteam = team.teamType === getSubteamType() || Boolean(team.parentTeamId);

    return {
      slug: team.slug || team.id,
      name: team.name,
      tag: normalizeTag(team.tag),

      team_type: isSubteam ? "subteam" : "main",
      parent_team_slug: team.parentTeamId || team.parentTeamSlug || null,

      description: team.description || "",
      bio: team.bio || team.description || "",

      logo_url: team.logoUrl || "",
      banner_url: team.bannerUrl || "",

      primary_color: theme.primaryColor || "#00e5ff",
      secondary_color: theme.secondaryColor || "#7c3cff",
      accent_color: theme.accentColor || "#ffffff",

      captain_profile_slug: team.captainProfileSlug || team.captainUserId || "",
      captain_user_id: team.captainUserId || "",
      captain_name: team.captainName || "",

      games: Array.isArray(team.games) ? team.games : [],
      social_links: team.socialLinks || {},
      roster_summary: team.rosterSummary || {},
      achievements: Array.isArray(team.achievements) ? team.achievements : [],
      stats: team.stats || {},
      subteams: Array.isArray(team.subteams) ? team.subteams : [],

      member_limit: team.memberLimit || getCommonTeamLimit(),

      is_public: team.isPublic !== false,
      is_verified:
        team.isVerified === true ||
        team.verificationStatus === getVerifiedStatus(),

      status: team.status || "active",

      metadata: Object.assign({}, metadata, {
        source: metadata.source || "supabase-write",
        version: metadata.version || "1.6.12"
      })
    };
  }

  async function saveTeamToSupabase(teamData) {
    if (!teamsSupabaseEnabled()) {
      return null;
    }

    const tableName = getTeamsSupabaseTableName();
    const row = teamToSupabaseRow(teamData);

    try {
      const result = await window.SBWSupabase.client
        .from(tableName)
        .upsert(row, {
          onConflict: "slug"
        })
        .select("*")
        .maybeSingle();

      if (result.error) {
        console.error("[SaberWolf Teams] Erro ao salvar equipe no Supabase:", result.error);
        return null;
      }

      return result.data ? normalizeSupabaseTeam(result.data) : null;
    } catch (error) {
      console.error("[SaberWolf Teams] Falha inesperada ao salvar equipe:", error);
      return null;
    }
  }

    function getTeamMembersSupabaseTableName() {
    const supabaseConfig = window.SBWSupabaseConfig || {};

    if (supabaseConfig.tables && supabaseConfig.tables.teamMembers) {
      return supabaseConfig.tables.teamMembers;
    }

    return "team_members";
  }


  /* =========================================================
     SaberWolf v1.6.14 - Convites de equipe / busca de jogadores
     ========================================================= */

  function nowIso() {
    return new Date().toISOString();
  }

  function getTeamInvitesSupabaseTableName() {
    const supabaseConfig = window.SBWSupabaseConfig || {};

    if (supabaseConfig.tables && supabaseConfig.tables.teamInvites) {
      return supabaseConfig.tables.teamInvites;
    }

    return "team_invites";
  }

  function getTeamInvitesLocalKey() {
    return getStorageKey("teamJoinRequests", "sbw_team_join_requests_v1_3_9");
  }

  function getProfileInvitesLocalKey() {
    return getStorageKey("profileInvites", "sbw_profile_invites_v1_4_2");
  }

  function getLocalTeamInvitesRaw() {
    return asArray(readJson(getTeamInvitesLocalKey(), []));
  }

  function saveLocalTeamInvitesRaw(invites) {
    return writeJson(getTeamInvitesLocalKey(), asArray(invites));
  }

  function getLocalProfileInvitesRaw() {
    return asArray(readJson(getProfileInvitesLocalKey(), []));
  }

  function saveLocalProfileInvitesRaw(invites) {
    return writeJson(getProfileInvitesLocalKey(), asArray(invites));
  }

  function getInviteTeamSlug(invite) {
    return String(
      invite?.teamSlug ||
        invite?.teamId ||
        invite?.team_slug ||
        invite?.metadata?.teamSlug ||
        ""
    );
  }

  function getInviteProfileSlug(invite) {
    return String(
      invite?.profileSlug ||
        invite?.invitedProfileSlug ||
        invite?.invited_profile_slug ||
        invite?.userId ||
        invite?.profileId ||
        invite?.metadata?.invitedProfileSlug ||
        ""
    );
  }

  function normalizeTeamInviteLocal(inviteData) {
    const safeInvite = inviteData || {};
    const teamSlug = getInviteTeamSlug(safeInvite);
    const profileSlug = getInviteProfileSlug(safeInvite);
    const createdAt = safeInvite.createdAt || safeInvite.created_at || safeInvite.invitedAt || safeInvite.invited_at || nowIso();

    return {
      id:
        safeInvite.id ||
        "invite-" + teamSlug + "-" + profileSlug + "-" + String(createdAt).replace(/[^0-9a-z]/gi, ""),

      teamId: teamSlug,
      teamSlug: teamSlug,
      teamName: safeInvite.teamName || safeInvite.team_name || safeInvite.metadata?.teamName || "Equipe",
      teamTag: safeInvite.teamTag || safeInvite.team_tag || safeInvite.metadata?.teamTag || "",
      teamLogoUrl: safeInvite.teamLogoUrl || safeInvite.team_logo_url || safeInvite.metadata?.teamLogoUrl || "",

      userId: profileSlug,
      profileId: profileSlug,
      profileSlug: profileSlug,
      invitedProfileSlug: profileSlug,
      invitedByProfileSlug:
        safeInvite.invitedByProfileSlug ||
        safeInvite.invited_by_profile_slug ||
        safeInvite.metadata?.invitedByProfileSlug ||
        "",

      displayName:
        safeInvite.displayName ||
        safeInvite.profileName ||
        safeInvite.profile_name ||
        safeInvite.nickname ||
        safeInvite.metadata?.displayName ||
        profileSlug ||
        "Jogador",
      nickname: safeInvite.nickname || safeInvite.metadata?.nickname || "",
      avatarUrl: safeInvite.avatarUrl || safeInvite.avatar_url || safeInvite.metadata?.avatarUrl || "",

      role: safeInvite.role || "member",
      roleOffered: safeInvite.roleOffered || safeInvite.role || "Membro",
      functionName: safeInvite.functionName || safeInvite.function_name || "Player",
      publicTitle: safeInvite.publicTitle || safeInvite.public_title || "",

      status: safeInvite.status || "pending",
      inviteType: safeInvite.inviteType || safeInvite.invite_type || "team_to_player",
      message: safeInvite.message || "",

      invitedAt: safeInvite.invitedAt || safeInvite.invited_at || createdAt,
      respondedAt: safeInvite.respondedAt || safeInvite.responded_at || "",
      expiresAt: safeInvite.expiresAt || safeInvite.expires_at || "",
      createdAt: createdAt,
      updatedAt: safeInvite.updatedAt || safeInvite.updated_at || nowIso(),

      source: safeInvite.source || "local-demo",
      metadata: asObject(safeInvite.metadata)
    };
  }

  function normalizeSupabaseTeamInvite(row) {
    const safeRow = row || {};
    const metadata = asObject(safeRow.metadata);

    return normalizeTeamInviteLocal({
      id: safeRow.id,
      teamSlug: safeRow.team_slug,
      invitedProfileSlug: safeRow.invited_profile_slug,
      invitedByProfileSlug: safeRow.invited_by_profile_slug,
      role: safeRow.role,
      functionName: safeRow.function_name,
      publicTitle: safeRow.public_title,
      status: safeRow.status,
      message: safeRow.message,
      invitedAt: safeRow.invited_at,
      respondedAt: safeRow.responded_at,
      expiresAt: safeRow.expires_at,
      createdAt: safeRow.created_at,
      updatedAt: safeRow.updated_at,
      source: "supabase",
      metadata: metadata,
      teamName: metadata.teamName,
      teamTag: metadata.teamTag,
      teamLogoUrl: metadata.teamLogoUrl,
      displayName: metadata.displayName,
      nickname: metadata.nickname,
      avatarUrl: metadata.avatarUrl
    });
  }

  function inviteFingerprint(invite) {
    return [
      getInviteTeamSlug(invite),
      getInviteProfileSlug(invite),
      String(invite?.status || "pending"),
      String(invite?.inviteType || "team_to_player")
    ].join("::");
  }

  function mergeInvites(...lists) {
    const map = new Map();

    lists.flat().forEach(function (invite) {
      const normalized = normalizeTeamInviteLocal(invite);
      const key = inviteFingerprint(normalized);

      if (!map.has(key) || normalized.source === "supabase") {
        map.set(key, normalized);
      }
    });

    return Array.from(map.values()).sort(function (a, b) {
      return String(b.createdAt || "").localeCompare(String(a.createdAt || ""));
    });
  }

  function getTeamInvitesFromLocal(teamId) {
    const key = String(teamId || "");
    const legacyInvites = getLocalTeamInvitesRaw();
    const profileInvites = getLocalProfileInvitesRaw();

    return mergeInvites(legacyInvites, profileInvites).filter(function (invite) {
      return getInviteTeamSlug(invite) === key;
    });
  }

  async function getTeamInvitesFromSupabase(teamId) {
    if (!teamsSupabaseEnabled() || !teamId) {
      return [];
    }

    const tableName = getTeamInvitesSupabaseTableName();

    try {
      const result = await window.SBWSupabase.client
        .from(tableName)
        .select("*")
        .eq("team_slug", teamId)
        .order("created_at", {
          ascending: false
        });

      if (result.error) {
        console.warn("[SaberWolf Teams] Erro ao buscar convites no Supabase:", result.error);
        return [];
      }

      return Array.isArray(result.data) ? result.data.map(normalizeSupabaseTeamInvite) : [];
    } catch (error) {
      console.warn("[SaberWolf Teams] Falha inesperada ao buscar convites:", error);
      return [];
    }
  }

  async function getTeamInvites(teamId) {
    const localInvites = getTeamInvitesFromLocal(teamId);

    if (!teamsSupabaseEnabled()) {
      return localInvites;
    }

    const supabaseInvites = await getTeamInvitesFromSupabase(teamId);

    return mergeInvites(supabaseInvites, localInvites).filter(function (invite) {
      return getInviteTeamSlug(invite) === String(teamId || "");
    });
  }

  function saveTeamInviteToLocal(inviteData) {
    const invite = normalizeTeamInviteLocal(inviteData);
    const teamInvites = getLocalTeamInvitesRaw();
    const profileInvites = getLocalProfileInvitesRaw();

    const isSamePendingInvite = function (item) {
      return (
        getInviteTeamSlug(item) === invite.teamSlug &&
        getInviteProfileSlug(item) === invite.profileSlug &&
        String(item.status || "pending") === "pending"
      );
    };

    const addOrReplace = function (list) {
      const index = list.findIndex(isSamePendingInvite);

      if (index >= 0) {
        list[index] = Object.assign({}, list[index], invite, {
          updatedAt: nowIso()
        });
      } else {
        list.push(invite);
      }

      return list;
    };

    saveLocalTeamInvitesRaw(addOrReplace(teamInvites.slice()));
    saveLocalProfileInvitesRaw(addOrReplace(profileInvites.slice()));

    return invite;
  }



  async function createTeamInviteViaRpcV1643(inviteData) {
    if (!teamsSupabaseEnabled() || !window.SBWSupabase?.client?.rpc) {
      return null;
    }

    const invite = normalizeTeamInviteLocal(inviteData);

    try {
      const result = await window.SBWSupabase.client.rpc("sbw_create_team_invite", {
        p_team_key: invite.teamSlug,
        p_invited_profile_slug: invite.profileSlug,
        p_role: invite.role || "member",
        p_function_name: invite.functionName || "Player",
        p_public_title: invite.publicTitle || "",
        p_message: invite.message || "",
        p_metadata: Object.assign({}, invite.metadata || {}, {
          teamName: invite.teamName,
          teamTag: invite.teamTag,
          teamLogoUrl: invite.teamLogoUrl,
          displayName: invite.displayName,
          nickname: invite.nickname,
          avatarUrl: invite.avatarUrl,
          source: "team-admin-v1.6.43"
        })
      });

      if (result.error) {
        console.warn("[SaberWolf Teams] RPC recusou criação do convite:", result.error);
        return null;
      }

      const data = result.data && typeof result.data === "object" ? result.data : null;
      const row = data?.invite || data;

      if (!row) {
        return null;
      }

      return normalizeSupabaseTeamInvite(row);
    } catch (error) {
      console.warn("[SaberWolf Teams] Erro inesperado ao criar convite via RPC:", error);
      return null;
    }
  }
  async function saveTeamInviteToSupabase(inviteData) {
    if (!teamsSupabaseEnabled()) {
      return null;
    }

    const invite = normalizeTeamInviteLocal(inviteData);
    const rpcInvite = await createTeamInviteViaRpcV1643(invite);

    if (rpcInvite) {
      return rpcInvite;
    }

    const tableName = getTeamInvitesSupabaseTableName();

    const row = {
      team_slug: invite.teamSlug,
      invited_profile_slug: invite.profileSlug,
      invited_by_profile_slug: invite.invitedByProfileSlug || null,
      role: invite.role || "member",
      function_name: invite.functionName || "Player",
      public_title: invite.publicTitle || null,
      status: invite.status || "pending",
      message: invite.message || "",
      invited_at: invite.invitedAt || nowIso(),
      expires_at: invite.expiresAt || null,
      metadata: Object.assign({}, invite.metadata || {}, {
        teamName: invite.teamName,
        teamTag: invite.teamTag,
        teamLogoUrl: invite.teamLogoUrl,
        displayName: invite.displayName,
        nickname: invite.nickname,
        avatarUrl: invite.avatarUrl,
        source: "team-admin-v1.6.43-direct-fallback"
      })
    };

    try {
      const result = await window.SBWSupabase.client
        .from(tableName)
        .insert(row)
        .select("*")
        .maybeSingle();

      if (result.error) {
        console.warn("[SaberWolf Teams] Supabase recusou criação do convite. Usando fallback local:", result.error);
        return null;
      }

      return result.data ? normalizeSupabaseTeamInvite(result.data) : null;
    } catch (error) {
      console.warn("[SaberWolf Teams] Erro inesperado ao criar convite no Supabase:", error);
      return null;
    }
  }

  async function createTeamInvite(inviteData) {
    const invite = normalizeTeamInviteLocal(inviteData);
    const existing = await getTeamInvites(invite.teamSlug);

    const pendingDuplicate = existing.find(function (item) {
      return (
        getInviteProfileSlug(item) === invite.profileSlug &&
        String(item.status || "pending") === "pending"
      );
    });

    if (pendingDuplicate) {
      return {
        ok: true,
        invite: pendingDuplicate,
        duplicate: true,
        source: pendingDuplicate.source || "local-demo",
        message: "Já existe convite pendente para esse jogador."
      };
    }

    let savedInvite = null;

    if (config.allowSupabaseWrites === true) {
      savedInvite = await saveTeamInviteToSupabase(invite);
    }

    if (!savedInvite) {
      savedInvite = saveTeamInviteToLocal(invite);
    } else {
      // Espelho local para testes no VS Code e fallback visual.
      saveTeamInviteToLocal(savedInvite);
    }

    return {
      ok: true,
      invite: savedInvite,
      duplicate: false,
      source: savedInvite.source || "local-demo",
      message: savedInvite.source === "supabase" ? "Convite enviado." : "Convite salvo no fallback local."
    };
  }

  async function getAllActiveTeamMembers() {
    const teams = await getAllTeams();
    const allMembers = [];

    for (const team of teams) {
      const key = team.slug || team.id || team.teamSlug || team.teamId;
      const members = await getTeamMembers(key);

      members.forEach(function (member) {
        if (String(member.status || "active") === "active") {
          allMembers.push(Object.assign({}, member, {
            teamId: member.teamId || key,
            teamSlug: member.teamSlug || key,
            teamName: member.teamName || team.name || "Equipe",
            teamTag: member.teamTag || team.tag || ""
          }));
        }
      });
    }

    return allMembers;
  }

  async function getActiveMembershipsForProfile(profileId) {
    const key = String(profileId || "");

    if (!key) {
      return [];
    }

    const members = await getAllActiveTeamMembers();

    return members.filter(function (member) {
      return (
        String(member.profileSlug || "") === key ||
        String(member.profileId || "") === key ||
        String(member.userId || "") === key ||
        String(member.authUserId || "") === key
      );
    });
  }

  function normalizeSupabaseMember(row) {
    const safeRow = row || {};
    const metadata = asObject(safeRow.metadata);

    const normalized = normalizeMemberLocal({
      id:
        safeRow.id ||
        "member-" + (safeRow.team_slug || "team") + "-" + (safeRow.profile_slug || "profile"),

      supabaseId: safeRow.id,

      teamId: safeRow.team_slug || "",
      teamSlug: safeRow.team_slug || "",

      userId: safeRow.profile_slug || "",
      authUserId: safeRow.auth_user_id || metadata.authUserId || "",
      profileId: safeRow.profile_slug || "",
      profileSlug: safeRow.profile_slug || "",

      nickname: safeRow.nickname || safeRow.display_name || safeRow.profile_slug || "Jogador",
      displayName: safeRow.display_name || safeRow.nickname || safeRow.profile_slug || "Jogador",
      avatarUrl: safeRow.avatar_url || "",

      role: safeRow.role || "member",

      function: safeRow.function_name || "Player",
      functionName: safeRow.function_name || "Player",

      publicTitle: safeRow.public_title || "",
      publicTitleLabel: metadata.publicTitleLabel || "",

      games: asArray(safeRow.games),

      status: safeRow.status || "active",

      joinedAt: safeRow.joined_at || "",
      leftAt: safeRow.left_at || "",

      invitedByProfileSlug: safeRow.invited_by_profile_slug || "",
      approvedByProfileSlug: safeRow.approved_by_profile_slug || "",
      transferRequestId: safeRow.transfer_request_id || "",

      metadata: metadata,

      source: "supabase",

      createdAt: safeRow.created_at || new Date().toISOString(),
      updatedAt: safeRow.updated_at || new Date().toISOString()
    });

    return Object.assign({}, normalized, {
      supabaseId: safeRow.id,
      teamSlug: safeRow.team_slug || normalized.teamSlug || normalized.teamId || "",
      profileSlug: safeRow.profile_slug || normalized.profileSlug || normalized.userId || "",
      publicTitle: safeRow.public_title || normalized.publicTitle || "",
      publicTitleLabel: metadata.publicTitleLabel || normalized.publicTitleLabel || "",
      source: "supabase",
      metadata: metadata
    });
  }

  async function getTeamMembersFromSupabase(teamId) {
    if (!teamsSupabaseEnabled() || !teamId) {
      return [];
    }

    const tableName = getTeamMembersSupabaseTableName();

    try {
      const result = await window.SBWSupabase.client
        .from(tableName)
        .select("*")
        .eq("team_slug", teamId)
        .eq("status", "active")
        .order("role", {
          ascending: true
        })
        .order("display_name", {
          ascending: true
        });

      if (result.error) {
        console.error("[SaberWolf Teams] Erro ao buscar membros no Supabase:", result.error);
        return [];
      }

      if (!Array.isArray(result.data)) {
        return [];
      }

      return result.data.map(normalizeSupabaseMember);
    } catch (error) {
      console.error("[SaberWolf Teams] Falha inesperada ao buscar membros:", error);
      return [];
    }
  }

  function mergeSupabaseAndLocalTeamsForAllowedFallback(supabaseTeams) {
    if (!localSupabaseMergeAllowed()) {
      return supabaseTeams;
    }

    const map = new Map();

    supabaseTeams.forEach((team) => {
      map.set(team.id, team);
    });

    getLocalTeams().forEach((team) => {
      const normalized = normalizeTeamLocal(team);
      map.set(normalized.id, normalized);
    });

    return Array.from(map.values());
  }

  async function getAllTeams(options) {
    const safeOptions = options || {};

    if (teamsSupabaseEnabled()) {
      const supabaseTeams = await getAllTeamsFromSupabase({
        publicOnly: safeOptions.publicOnly !== false
      });

      if (supabaseTeams.length > 0) {
        return mergeSupabaseAndLocalTeamsForAllowedFallback(supabaseTeams);
      }

      if (!localDemoFallbackAllowed()) {
        return [];
      }

      console.warn("[SaberWolf Teams] Nenhuma equipe retornada do Supabase. Usando fallback local-demo apenas em ambiente local.");
    }

    return mergeDemoAndLocalTeams();
  }

  async function getAllTeamsForSession() {
    // Usado por Meu Perfil/Minha Equipe para localizar vínculo real mesmo se a equipe ainda não estiver pública.
    return getAllTeams({ publicOnly: false });
  }

  async function getAllTeamsForAdmin() {
    // Usado pelo Admin Master para listar todas as equipes que a RLS permitir à conta atual.
    return getAllTeams({ publicOnly: false });
  }

  async function getTeamById(teamId) {
    const teams = await getAllTeams();

    return (
      teams.find((team) => {
        return (
          team.id === teamId ||
          team.slug === teamId ||
          team.teamId === teamId ||
          team.supabaseId === teamId
        );
      }) || null
    );
  }

  async function getTeamBySlug(slug) {
    const teams = await getAllTeams();

    return (
      teams.find((team) => {
        return team.slug === slug || team.id === slug;
      }) || null
    );
  }

  async function getTeamMembers(teamId) {
    if (teamsSupabaseEnabled()) {
      const supabaseMembers = await getTeamMembersFromSupabase(teamId);

      if (supabaseMembers.length > 0) {
        return supabaseMembers;
      }

      if (!localDemoFallbackAllowed()) {
        return [];
      }
    }

    const members = mergeDemoAndLocalMembers();

    return members.filter((member) => {
      return (
        member.teamId === teamId ||
        member.teamSlug === teamId
      );
    });
  }

  async function getSubteams(parentTeamId) {
    const teams = await getAllTeams();

    return teams.filter((team) => {
      return (
        team.parentTeamId === parentTeamId ||
        team.parentTeamSlug === parentTeamId
      );
    });
  }

  async function saveTeam(teamData) {
    const normalized = normalizeTeamLocal(teamData);

    if (teamsSupabaseEnabled() && config.allowSupabaseWrites === true) {
      const supabaseTeam = await saveTeamToSupabase(normalized);

      if (supabaseTeam) {
        return supabaseTeam;
      }

      console.warn("[SaberWolf Teams] Salvamento no Supabase falhou. Salvando local-demo.");
    }

    const localTeams = getLocalTeams();

    const index = localTeams.findIndex((team) => {
      return team.id === normalized.id || team.slug === normalized.slug;
    });

    if (index >= 0) {
      localTeams[index] = normalized;
    } else {
      localTeams.push(normalized);
    }

    saveLocalTeams(localTeams);

    return normalized;
  }

  async function isTagAvailable(tag, ignoredTeamId) {
    const normalizedTag = normalizeTag(tag);
    const teams = await getAllTeams();

    const blockedTags = Array.isArray(tagRules.blockedTags)
      ? tagRules.blockedTags.map(normalizeTag)
      : [];

    const blocked = blockedTags.includes(normalizedTag);

    if (blocked) {
      return {
        available: false,
        reason: "Essa tag é reservada pela SaberWolf."
      };
    }

    const maxLength = Number(tagRules.maxLength || 5);

    if (
      !tagRules.allowExtendedTag &&
      normalizedTag.length > maxLength
    ) {
      return {
        available: false,
        reason: "A tag pode ter no máximo " + maxLength + " caracteres."
      };
    }

    const alreadyUsed = teams.some((team) => {
      return (
        normalizeTag(team.tag) === normalizedTag &&
        team.id !== ignoredTeamId &&
        team.slug !== ignoredTeamId
      );
    });

    if (alreadyUsed) {
      return {
        available: false,
        reason: "Essa tag já está sendo usada por outra equipe."
      };
    }

    return {
      available: true,
      reason: "Tag disponível."
    };
  }

  function canCreateSubteam(team) {
    if (!team) {
      return false;
    }

    return (
      team.teamType === getMainTeamType() &&
      team.verificationStatus === getVerifiedStatus()
    );
  }

  function canRequestVerification(team) {
    if (!team) {
      return false;
    }

    return (
      team.verificationStatus === getNotVerifiedStatus() ||
      team.verificationStatus === getRejectedStatus()
    );
  }

    /* =========================================================
     SaberWolf v1.5.4 - Tipos de Equipe / Clã / Guilda
     Futuro: usado em Equipes, Perfis, Transferências, Rankings e filtros.
     ========================================================= */

  const SBW_TEAM_TYPE_STORAGE_KEY = "sbw_team_types_v1";

  const SBW_TEAM_TYPE_OPTIONS = [
    {
      id: "organization",
      label: "Organização",
      shortLabel: "Org",
      description: "Equipe com estrutura de organização, elenco, staff e presença competitiva/comunitária.",
      tone: "cyan"
    },
    {
      id: "competitive",
      label: "Competitiva",
      shortLabel: "Competitiva",
      description: "Equipe focada em torneios, ranqueadas, ligas e formação competitiva.",
      tone: "red"
    },
    {
      id: "casual",
      label: "Casual",
      shortLabel: "Casual",
      description: "Equipe voltada para comunidade, diversão, amizade e jogos sem foco obrigatório em competição.",
      tone: "green"
    },
    {
      id: "hybrid",
      label: "Híbrida",
      shortLabel: "Híbrida",
      description: "Equipe que mistura comunidade casual, competição e organização interna.",
      tone: "purple"
    },
    {
      id: "clan",
      label: "Clã/Guilda",
      shortLabel: "Clã/Guilda",
      description: "Grupo de jogadores organizado como clã, guilda, line ou comunidade interna.",
      tone: "gold"
    },
    {
      id: "community",
      label: "Comunidade",
      shortLabel: "Comunidade",
      description: "Comunidade aberta, projeto coletivo ou grupo social focado em reunir jogadores.",
      tone: "blue"
    },
    {
      id: "academy",
      label: "Academy/Subequipe",
      shortLabel: "Academy",
      description: "Equipe secundária, base, academy ou line vinculada a uma equipe principal.",
      tone: "muted"
    }
  ];

  const SBW_DEMO_TEAM_TYPES = [
    {
      teamId: "team-sbw-fgc",
      teamSlug: "team-sbw-fgc",
      type: "organization",
      focusTags: ["Fighting Games", "Competitivo", "Comunidade"],
      descriptionText: "Organização focada em Fighting Games, torneios e desenvolvimento de comunidade.",
      updatedAt: "2026-06-03T00:00:00.000Z",
      source: "local-demo"
    }
  ];

  function teamTypeNowIso() {
    return new Date().toISOString();
  }

  function getTeamTypeOptions() {
    return SBW_TEAM_TYPE_OPTIONS.slice();
  }

  function getTeamTypeOption(typeId) {
    const found = SBW_TEAM_TYPE_OPTIONS.find(function (option) {
      return option.id === typeId;
    });

    return found || SBW_TEAM_TYPE_OPTIONS[0];
  }

  function getStoredTeamTypes() {
    try {
      const stored = localStorage.getItem(SBW_TEAM_TYPE_STORAGE_KEY);

      if (!stored) {
        return null;
      }

      const parsed = JSON.parse(stored);

      if (Array.isArray(parsed)) {
        return parsed;
      }

      return null;
    } catch (error) {
      console.warn("[SaberWolf Teams] Erro ao ler tipos de equipe:", error);
      return null;
    }
  }

  function saveTeamTypes(teamTypes) {
    try {
      const safeTeamTypes = Array.isArray(teamTypes) ? teamTypes : [];
      localStorage.setItem(SBW_TEAM_TYPE_STORAGE_KEY, JSON.stringify(safeTeamTypes));
      return safeTeamTypes;
    } catch (error) {
      console.warn("[SaberWolf Teams] Erro ao salvar tipos de equipe:", error);
      return [];
    }
  }

  function getAllTeamTypes() {
    const stored = getStoredTeamTypes();

    if (Array.isArray(stored)) {
      return stored;
    }

    return SBW_DEMO_TEAM_TYPES.slice();
  }

  function normalizeTeamType(teamTypeData) {
    const safeType = teamTypeData || {};
    const option = getTeamTypeOption(safeType.type || "competitive");

    return {
      teamId: safeType.teamId || safeType.teamSlug || "",
      teamSlug: safeType.teamSlug || safeType.teamId || "",

      type: option.id,
      label: option.label,
      shortLabel: option.shortLabel,
      description: option.description,
      tone: option.tone,

      focusTags: Array.isArray(safeType.focusTags) ? safeType.focusTags : [],
      descriptionText: safeType.descriptionText || option.description,

      updatedAt: safeType.updatedAt || teamTypeNowIso(),
      source: safeType.source || "local-demo"
    };
  }

  function getTeamTypeByTeamId(teamId) {
    if (!teamId) {
      return normalizeTeamType({
        type: "competitive"
      });
    }

    const found = getAllTeamTypes().find(function (teamTypeData) {
      return teamTypeData.teamId === teamId || teamTypeData.teamSlug === teamId;
    });

    if (!found) {
      return normalizeTeamType({
        teamId: teamId,
        teamSlug: teamId,
        type: "competitive",
        focusTags: [],
        descriptionText: "Equipe competitiva da plataforma SaberWolf.",
        source: "default"
      });
    }

    return normalizeTeamType(found);
  }

  function saveTeamTypeByTeamId(teamId, typePayload) {
    const teamTypes = getAllTeamTypes();
    const safePayload = typePayload || {};

    const index = teamTypes.findIndex(function (teamTypeData) {
      return teamTypeData.teamId === teamId || teamTypeData.teamSlug === teamId;
    });

    const nextType = Object.assign({}, index >= 0 ? teamTypes[index] : {}, safePayload, {
      teamId: teamId,
      teamSlug: teamId,
      updatedAt: teamTypeNowIso(),
      source: "local-demo"
    });

    if (index >= 0) {
      teamTypes[index] = nextType;
    } else {
      teamTypes.push(nextType);
    }

    saveTeamTypes(teamTypes);

    return normalizeTeamType(nextType);
  }

  function applyTeamTypeToTeam(team) {
    if (!team) {
      return team;
    }

    const teamId = team.id || team.slug || team.teamId || team.teamSlug || "";
    const teamType = getTeamTypeByTeamId(teamId);

    return Object.assign({}, team, {
      teamType: teamType.type,
      teamTypeLabel: teamType.label,
      teamTypeShortLabel: teamType.shortLabel,
      teamTypeDescription: teamType.descriptionText,
      teamTypeTone: teamType.tone,
      teamTypeFocusTags: teamType.focusTags
    });
  }

  window.SBWTeamsStorage = {
  getAllTeams,
  getAllTeamsForSession,
  getAllTeamsForAdmin,
  getTeamById,
  getTeamBySlug,
  getTeamMembers,
  getSubteams,
  saveTeam,
  isTagAvailable,
  canCreateSubteam,
  canRequestVerification,

  getTeamInvites,
  getTeamInvitesFromLocal,
  getTeamInvitesFromSupabase,
  createTeamInvite,
  saveTeamInviteToLocal,
  saveTeamInviteToSupabase,
  normalizeTeamInviteLocal,
  normalizeSupabaseTeamInvite,
  getAllActiveTeamMembers,
  getActiveMembershipsForProfile,

  teamsSupabaseEnabled,
  getAllTeamsFromSupabase,
  getTeamMembersFromSupabase,
  saveTeamToSupabase,
  normalizeSupabaseTeam,
  normalizeSupabaseMember,

  getTeamTypeOptions,
  getTeamTypeByTeamId,
  saveTeamTypeByTeamId,
  getAllTeamTypes,
  applyTeamTypeToTeam
};
})();