(function () {
  const config = window.SBWProfilesConfig || {};
  const configKeys = config.storageKeys || {};
  const models = window.SBWProfilesModels || {};

  const STORAGE_KEYS = {
    profiles: configKeys.profiles || "sbw_profiles_v1_4_2",
    profileInvites: configKeys.profileInvites || "sbw_profile_invites_v1_4_2",
    profileHistory: configKeys.profileHistory || "sbw_profile_history_v1_4_2",
    currentUser: configKeys.currentUser || "sbw_current_user_v1_3_9",
    teamMembers: configKeys.teamMembers || "sbw_team_members_v1_3_9",
    teams: configKeys.teams || "sbw_teams_v1_3_9"
  };

  const DEMO_PROFILES = [
    {
      id: "user-demo-team-creator",
      userId: "user-demo-team-creator",
      nickname: "CapitaoDemo",
      displayName: "Capitão Demo",
      profileType: "player",
      headline: "Capitão de equipe e jogador competitivo",
      bio: "Perfil demo usado para testar equipes, torneios e permissões dentro da plataforma SaberWolf.",
      country: "Brasil",
      state: "MG",
      city: "Belo Horizonte",
      avatarUrl: "",
      bannerUrl: "",
      mainGames: [
        {
          id: "sf6",
          name: "Street Fighter 6",
          category: "Fighting Games"
        },
        {
          id: "tekken-8",
          name: "Tekken 8",
          category: "Fighting Games"
        }
      ],
      roleTags: ["Player", "Capitão", "FGC"],
      socialLinks: {},
      stats: {
        tournamentsPlayed: 12,
        wins: 8,
        podiums: 3,
        titles: 2,
        prizeAmount: 250,
        prizeCurrency: "BRL"
      },
      permissions: {
        canCreateTeam: true,
        canCreateTournament: true,
        isAdmin: false
      },
      createdAt: "2026-06-01T00:00:00.000Z",
      updatedAt: "2026-06-01T00:00:00.000Z"
    },
    {
      id: "user-demo-common",
      userId: "user-demo-common",
      nickname: "UsuarioDemo",
      displayName: "Usuário Demo",
      profileType: "player",
      headline: "Jogador da comunidade SaberWolf",
      bio: "Perfil comum usado para simular um usuário sem permissões especiais.",
      country: "Brasil",
      state: "",
      city: "",
      avatarUrl: "",
      bannerUrl: "",
      mainGames: [
        {
          id: "sf6",
          name: "Street Fighter 6",
          category: "Fighting Games"
        }
      ],
      roleTags: ["Player"],
      socialLinks: {},
      stats: {
        tournamentsPlayed: 2,
        wins: 1,
        podiums: 0,
        titles: 0,
        prizeAmount: 0,
        prizeCurrency: "BRL"
      },
      permissions: {
        canCreateTeam: false,
        canCreateTournament: false,
        isAdmin: false
      },
      createdAt: "2026-06-01T00:00:00.000Z",
      updatedAt: "2026-06-01T00:00:00.000Z"
    }
  ];

  const DEMO_INVITES = [
    {
      id: "invite-sbw-fgc-user-demo-common",
      userId: "user-demo-common",
      teamId: "team-sbw-fgc",
      teamName: "SaberWolf FGC",
      teamTag: "SBW",
      teamLogoUrl: "",
      role: "member",
      functionName: "Player",
      status: "pending",
      message: "Convite demo para testar entrada em equipe dentro da plataforma SaberWolf.",
      createdAt: "2026-06-01T00:00:00.000Z",
      updatedAt: "2026-06-01T00:00:00.000Z"
    }
  ];

  const DEMO_HISTORY = [
    {
      id: "history-demo-title-001",
      userId: "user-demo-team-creator",
      type: "title",
      title: "Campeão Demo SaberWolf",
      description: "Título demonstrativo usado para validar o histórico público de perfil.",
      tournamentName: "SaberWolf FGC Open Demo",
      gameName: "Street Fighter 6",
      date: "2026-05-20",
      occurredAt: "2026-05-20T20:00:00.000Z",
      createdAt: "2026-06-01T00:00:00.000Z"
    },
    {
      id: "history-demo-podium-001",
      userId: "user-demo-common",
      type: "podium",
      title: "Top 3 Demo",
      description: "Pódio demonstrativo usado para testar histórico de atleta.",
      tournamentName: "SaberWolf Community Cup",
      gameName: "Street Fighter 6",
      position: 3,
      date: "2026-05-22",
      occurredAt: "2026-05-22T20:00:00.000Z",
      createdAt: "2026-06-01T00:00:00.000Z"
    }
  ];

  function nowIso() {
    return new Date().toISOString();
  }

  function createId(prefix) {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return prefix + "-" + window.crypto.randomUUID();
    }

    return (
      prefix +
      "-" +
      Date.now().toString(36) +
      "-" +
      Math.random().toString(36).slice(2, 9)
    );
  }

  function readJson(key, fallback) {
    try {
      const raw = localStorage.getItem(key);

      if (!raw) {
        return fallback;
      }

      const parsed = JSON.parse(raw);

      if (parsed === null || typeof parsed === "undefined") {
        return fallback;
      }

      return parsed;
    } catch (error) {
      console.warn("[SaberWolf Profiles] Erro ao ler localStorage:", key, error);
      return fallback;
    }
  }

  function writeJson(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error("[SaberWolf Profiles] Erro ao salvar localStorage:", key, error);
      return false;
    }
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
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

  function normalizeProfile(profile) {
    if (typeof models.normalizeProfile === "function") {
      return models.normalizeProfile(profile);
    }

    const safeProfile = profile || {};
    const id = safeProfile.id || safeProfile.userId || createId("user");

    return Object.assign({}, safeProfile, {
      id: id,
      userId: safeProfile.userId || id,
      nickname: safeProfile.nickname || "",
      displayName: safeProfile.displayName || safeProfile.nickname || "Usuário SaberWolf",
      profileType: safeProfile.profileType || "player",
      headline: safeProfile.headline || "",
      bio: safeProfile.bio || "",
      country: safeProfile.country || "Brasil",
      state: safeProfile.state || "",
      city: safeProfile.city || "",
      avatarUrl: safeProfile.avatarUrl || "",
      bannerUrl: safeProfile.bannerUrl || "",
      mainGames: Array.isArray(safeProfile.mainGames) ? safeProfile.mainGames : [],
      roleTags: Array.isArray(safeProfile.roleTags) ? safeProfile.roleTags : [],
      socialLinks: safeProfile.socialLinks || {},
      stats: safeProfile.stats || {
        tournamentsPlayed: 0,
        wins: 0,
        podiums: 0,
        titles: 0,
        prizeAmount: 0,
        prizeCurrency: "BRL"
      },
      permissions: safeProfile.permissions || {},
      createdAt: safeProfile.createdAt || nowIso(),
      updatedAt: safeProfile.updatedAt || nowIso()
    });
  }

  function normalizeProfilesList(list) {
    return asArray(list).map(function (profile) {
      return normalizeProfile(profile);
    });
  }

    /* =========================================================
     SaberWolf v1.4.6 - Supabase Profiles Adapter
     ========================================================= */

  function profilesSupabaseEnabled() {
    return Boolean(
      window.SBWSupabase &&
      typeof window.SBWSupabase.isEnabled === "function" &&
      window.SBWSupabase.isEnabled()
    );
  }

  function getProfilesSupabaseTableName() {
    const supabaseConfig = window.SBWSupabaseConfig || {};

    if (supabaseConfig.tables && supabaseConfig.tables.profiles) {
      return supabaseConfig.tables.profiles;
    }

    return "profiles";
  }

  function profileLooksLikeUUID(value) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      String(value || "")
    );
  }

  function profileGameIdFromName(name) {
    return String(name || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function normalizeSupabaseProfile(row) {
    const safeRow = row || {};

    const publicTags = Array.isArray(safeRow.public_tags)
      ? safeRow.public_tags
      : [];

    const roles = Array.isArray(safeRow.roles)
      ? safeRow.roles
      : [];

    const socialLinks =
      safeRow.social_links && typeof safeRow.social_links === "object"
        ? safeRow.social_links
        : {};

    const careerHistory =
      safeRow.career_history && typeof safeRow.career_history === "object"
        ? safeRow.career_history
        : {};

    const tournamentHistory =
      safeRow.tournament_history && typeof safeRow.tournament_history === "object"
        ? safeRow.tournament_history
        : {};

    const achievements = Array.isArray(safeRow.achievements)
      ? safeRow.achievements
      : [];

    const metadata =
      safeRow.metadata && typeof safeRow.metadata === "object"
        ? safeRow.metadata
        : {};

    const profileId = safeRow.slug || safeRow.username || safeRow.id || createId("user");

    const mainGames = safeRow.main_game
      ? [
          {
            id: profileGameIdFromName(safeRow.main_game),
            name: safeRow.main_game,
            category: metadata.mainGameCategory || ""
          }
        ]
      : [];

    const roleTags = publicTags.length
      ? publicTags
      : safeRow.main_role
        ? [safeRow.main_role]
        : roles;

    const hasCaptainRole = roles.includes("captain") || roles.includes("capitao");

    const permissions = metadata.permissions || {
      canCreateTeam: hasCaptainRole,
      canCreateTournament: false,
      isAdmin: false
    };

    const defaultStats = {
      tournamentsPlayed: 0,
      wins: 0,
      podiums: 0,
      titles: 0,
      prizeAmount: 0,
      prizeCurrency: "BRL"
    };

    const stats = metadata.stats || tournamentHistory.stats || defaultStats;

    const currentTeam =
      safeRow.current_team_slug || safeRow.current_team_id || safeRow.current_team_name
        ? {
            id: safeRow.current_team_slug || safeRow.current_team_id || "",
            teamId: safeRow.current_team_slug || safeRow.current_team_id || "",
            name: safeRow.current_team_name || "Equipe",
            teamName: safeRow.current_team_name || "Equipe",
            slug: safeRow.current_team_slug || "",
            tag: metadata.currentTeamTag || "",
            teamTag: metadata.currentTeamTag || "",
            logoUrl: metadata.currentTeamLogoUrl || "",
            teamLogoUrl: metadata.currentTeamLogoUrl || "",
            isVerified: Boolean(metadata.currentTeamVerified),
            role: safeRow.main_role || "Player",
            function: safeRow.main_role || "Player",
            functionName: safeRow.main_role || "Player",
            status: "active",
            joinedAt: metadata.currentTeamJoinedAt || "",
            url: "../equipes/equipe.html?id=" + encodeURIComponent(safeRow.current_team_slug || safeRow.current_team_id || "")
          }
        : null;

    return normalizeProfile({
      id: profileId,
      userId: profileId,

      supabaseId: safeRow.id,
      authUserId: safeRow.auth_user_id || "",
      auth_user_id: safeRow.auth_user_id || "",
      slug: safeRow.slug || "",
      username: safeRow.username || "",

      nickname: safeRow.nickname || safeRow.username || "",
      displayName: safeRow.display_name || safeRow.nickname || safeRow.username || "Usuário -SBW-",

      profileType: metadata.profileType || "player",

      headline: safeRow.headline || "",
      bio: safeRow.bio || "",

      country: safeRow.country || "Brasil",
      state: safeRow.state || "",
      city: safeRow.city || "",

      avatarUrl: safeRow.avatar_url || "",
      bannerUrl: safeRow.banner_url || "",

      metadata: metadata,
      profileAssets: metadata.profileAssets || metadata.assetFrames || {},

      mainGames: Array.isArray(metadata.mainGames) && metadata.mainGames.length ? metadata.mainGames : mainGames,
      roleTags: roleTags,
      socialLinks: socialLinks,

      stats: stats,
      permissions: permissions,

      currentTeam: currentTeam,
      currentTeams: currentTeam ? [currentTeam] : [],

      careerHistory: careerHistory,
      tournamentHistory: tournamentHistory,
      achievements: achievements,

      isPublic: Boolean(safeRow.is_public),
      isVerified: Boolean(safeRow.is_verified),

      source: "supabase",

      createdAt: safeRow.created_at || nowIso(),
      updatedAt: safeRow.updated_at || nowIso()
    });
  }

  async function getProfilesFromSupabase() {
    if (!profilesSupabaseEnabled()) {
      return [];
    }

    const tableName = getProfilesSupabaseTableName();

    try {
      const result = await window.SBWSupabase.client
        .from(tableName)
        .select("*")
        .eq("is_public", true)
        .order("display_name", {
          ascending: true
        });

      if (result.error) {
        console.error("[SaberWolf Profiles] Erro ao buscar perfis no Supabase:", result.error);
        return [];
      }

      if (!Array.isArray(result.data)) {
        return [];
      }

      return result.data.map(normalizeSupabaseProfile);
    } catch (error) {
      console.error("[SaberWolf Profiles] Falha inesperada ao buscar perfis:", error);
      return [];
    }
  }

  async function getProfilesAsync() {
    const competitiveProfiles = profilesSupabaseEnabled()
      ? await getCompetitiveProfilesFromCompletedTournamentsAsync()
      : [];

    if (profilesSupabaseEnabled()) {
      const supabaseProfiles = await getProfilesFromSupabase();

      if (supabaseProfiles.length > 0 || competitiveProfiles.length > 0) {
        return mergeProfilesWithCompetitiveProfiles(supabaseProfiles, competitiveProfiles);
      }

      console.warn("[SaberWolf Profiles] Nenhum perfil retornado do Supabase. Usando fallback local-demo.");
    }

    return mergeProfilesWithCompetitiveProfiles(getProfiles(), competitiveProfiles);
  }

  async function getSupabaseProfileByColumn(column, value) {
    if (!profilesSupabaseEnabled() || !value) {
      return null;
    }

    const tableName = getProfilesSupabaseTableName();

    try {
      const result = await window.SBWSupabase.client
        .from(tableName)
        .select("*")
        .eq(column, value)
        .maybeSingle();

      if (result.error) {
        console.warn("[SaberWolf Profiles] Busca por " + column + " falhou:", result.error);
        return null;
      }

      return result.data ? normalizeSupabaseProfile(result.data) : null;
    } catch (error) {
      console.error("[SaberWolf Profiles] Erro na busca por " + column + ":", error);
      return null;
    }
  }

  async function getProfileByIdAsync(profileId) {
    if (!profileId) {
      return null;
    }

    if (profilesSupabaseEnabled()) {
      const bySlug = await getSupabaseProfileByColumn("slug", profileId);

      if (bySlug) {
        return bySlug;
      }

      const byUsername = await getSupabaseProfileByColumn("username", profileId);

      if (byUsername) {
        return byUsername;
      }

      if (profileLooksLikeUUID(profileId)) {
        const byId = await getSupabaseProfileByColumn("id", profileId);

        if (byId) {
          return byId;
        }
      }
    }

    const localProfile = getProfileById(profileId);

    if (localProfile) {
      return localProfile;
    }

    return getVirtualCompetitiveProfileByIdAsync(profileId);
  }

  async function getProfileByUserIdAsync(userId) {
    return getProfileByIdAsync(userId);
  }

  async function getCurrentProfileAsync() {
    const currentUser = getCurrentUser();
    const userId = currentUser.userId || currentUser.id;

    return getProfileByUserIdAsync(userId);
  }

    function getProfileTeamsSupabaseTableName() {
    const supabaseConfig = window.SBWSupabaseConfig || {};

    if (supabaseConfig.tables && supabaseConfig.tables.teams) {
      return supabaseConfig.tables.teams;
    }

    return "teams";
  }

  function getProfileTeamMembersSupabaseTableName() {
    const supabaseConfig = window.SBWSupabaseConfig || {};

    if (supabaseConfig.tables && supabaseConfig.tables.teamMembers) {
      return supabaseConfig.tables.teamMembers;
    }

    return "team_members";
  }

  function profileAsObject(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      return {};
    }

    return value;
  }

  function profileTeamLooksReal(team) {
    if (!team) {
      return false;
    }

    const teamId = team.teamId || team.id || team.slug || "";
    const teamName = team.teamName || team.name || "";

    if (!teamId && !teamName) {
      return false;
    }

    if (!teamId && String(teamName).toLowerCase().includes("sem equipe")) {
      return false;
    }

    return true;
  }

  function normalizeCurrentTeamFromSupabase(member, teamRow) {
    const safeMember = member || {};
    const safeTeam = teamRow || {};
    const teamSlug = safeMember.team_slug || safeTeam.slug || "";

    return {
      id: teamSlug,
      teamId: teamSlug,
      slug: teamSlug,

      name: safeTeam.name || teamSlug || "Equipe",
      teamName: safeTeam.name || teamSlug || "Equipe",

      tag: safeTeam.tag || "",
      teamTag: safeTeam.tag || "",

      logoUrl: safeTeam.logo_url || "",
      teamLogoUrl: safeTeam.logo_url || "",

      isVerified: Boolean(safeTeam.is_verified),

      role: safeMember.role || "member",
      function: safeMember.function_name || "Player",
      functionName: safeMember.function_name || "Player",

      joinedAt: safeMember.joined_at || "",
      status: safeMember.status || "active",

      source: "supabase",

      metadata: profileAsObject(safeMember.metadata),

      url: "../equipes/equipe.html?id=" + encodeURIComponent(teamSlug)
    };
  }

  function addProfileLookupCandidate(candidates, value) {
    const item = String(value || "").trim();

    if (item && !candidates.includes(item)) {
      candidates.push(item);
    }
  }

  async function resolveProfileLookupCandidates(userId) {
    const candidates = [];
    addProfileLookupCandidate(candidates, userId);

    if (!profilesSupabaseEnabled() || !userId) {
      return candidates;
    }

    const columns = ["slug", "username", "id", "auth_user_id"];

    for (const column of columns) {
      try {
        const profile = await getSupabaseProfileByColumn(column, userId);

        if (profile) {
          addProfileLookupCandidate(candidates, profile.slug);
          addProfileLookupCandidate(candidates, profile.username);
          addProfileLookupCandidate(candidates, profile.id);
          addProfileLookupCandidate(candidates, profile.userId);
          addProfileLookupCandidate(candidates, profile.authUserId);
          addProfileLookupCandidate(candidates, profile.auth_user_id);
        }
      } catch (error) {
        console.warn("[SaberWolf Profiles] Falha ao resolver candidato de vínculo por " + column + ":", error);
      }
    }

    return candidates;
  }

  async function getCurrentTeamsByUserIdFromSupabase(userId) {
    if (!profilesSupabaseEnabled() || !userId) {
      return [];
    }

    const teamMembersTable = getProfileTeamMembersSupabaseTableName();
    const teamsTable = getProfileTeamsSupabaseTableName();

    try {
      const profileCandidates = await resolveProfileLookupCandidates(userId);
      let membersResult = await window.SBWSupabase.client
        .from(teamMembersTable)
        .select("*")
        .in("profile_slug", profileCandidates)
        .eq("status", "active")
        .order("joined_at", {
          ascending: false
        });

      if ((!membersResult.data || !membersResult.data.length) && String(userId || "")) {
        const authMembersResult = await window.SBWSupabase.client
          .from(teamMembersTable)
          .select("*")
          .eq("auth_user_id", userId)
          .eq("status", "active")
          .order("joined_at", {
            ascending: false
          });

        if (!authMembersResult.error && Array.isArray(authMembersResult.data) && authMembersResult.data.length) {
          membersResult = authMembersResult;
        }
      }

      if (membersResult.error) {
        console.error("[SaberWolf Profiles] Erro ao buscar team_members do perfil:", membersResult.error);
        return [];
      }

      const members = Array.isArray(membersResult.data) ? membersResult.data : [];

      if (!members.length) {
        return [];
      }

      const teamSlugs = Array.from(
        new Set(
          members
            .map(function (member) {
              return member.team_slug;
            })
            .filter(Boolean)
        )
      );

      if (!teamSlugs.length) {
        return [];
      }

      const teamsResult = await window.SBWSupabase.client
        .from(teamsTable)
        .select("*")
        .in("slug", teamSlugs)
        .eq("is_public", true);

      if (teamsResult.error) {
        console.warn("[SaberWolf Profiles] Não foi possível buscar teams do perfil. Usando dados básicos dos vínculos.", teamsResult.error);

        return members.map(function (member) {
          return normalizeCurrentTeamFromSupabase(member, null);
        });
      }

      const teams = Array.isArray(teamsResult.data) ? teamsResult.data : [];
      const teamsMap = new Map();

      teams.forEach(function (team) {
        teamsMap.set(team.slug, team);
      });

      return members.map(function (member) {
        return normalizeCurrentTeamFromSupabase(member, teamsMap.get(member.team_slug));
      });
    } catch (error) {
      console.error("[SaberWolf Profiles] Falha inesperada ao buscar equipes atuais do perfil:", error);
      return [];
    }
  }

  async function getCurrentTeamsByUserIdAsync(userId) {
    if (profilesSupabaseEnabled()) {
      const supabaseTeams = await getCurrentTeamsByUserIdFromSupabase(userId);

      if (supabaseTeams.length > 0) {
        return supabaseTeams;
      }
    }

    const profile = await getProfileByUserIdAsync(userId);

    if (profilesSupabaseEnabled() && profile && profile.source === "supabase") {
      // Em produção, vínculos atuais de equipe devem vir de public.team_members + public.teams.
      // Evita exibir equipes órfãs/legadas salvas diretamente no perfil como se fossem reais.
      return [];
    }

    if (profile && Array.isArray(profile.currentTeams) && profile.currentTeams.length > 0) {
      return profile.currentTeams.filter(profileTeamLooksReal);
    }

    if (profile && profileTeamLooksReal(profile.currentTeam)) {
      return [profile.currentTeam];
    }

    return getCurrentTeamsByUserId(userId);
  }

  function getProfiles() {
    const stored = readJson(STORAGE_KEYS.profiles, null);

    if (Array.isArray(stored) && stored.length) {
      return normalizeProfilesList(stored);
    }

    return normalizeProfilesList(clone(DEMO_PROFILES));
  }

  function saveProfiles(profiles) {
    const normalized = normalizeProfilesList(profiles);
    return writeJson(STORAGE_KEYS.profiles, normalized);
  }

  function getProfileById(profileId) {
    const profiles = getProfiles();

    return (
      profiles.find(function (profile) {
        return profile.id === profileId || profile.userId === profileId;
      }) || null
    );
  }

  function getProfileByUserId(userId) {
    return getProfileById(userId);
  }

  function saveProfile(profileData) {
    const profile = normalizeProfile(profileData);
    const profiles = getProfiles();
    const index = profiles.findIndex(function (item) {
      return item.id === profile.id || item.userId === profile.userId;
    });

    profile.updatedAt = nowIso();

    if (index >= 0) {
      profiles[index] = Object.assign({}, profiles[index], profile);
    } else {
      profiles.push(profile);
    }

    saveProfiles(profiles);

    return profile;
  }

  function getCurrentAuthUserIdFallback(profileData) {
    const currentUser = getCurrentUser();
    const safeProfile = profileData || {};

    return (
      safeProfile.authUserId ||
      safeProfile.auth_user_id ||
      currentUser.authUserId ||
      currentUser.auth_user_id ||
      ""
    );
  }

  async function getCurrentAuthUserId(profileData) {
    if (window.SBWAuth && typeof window.SBWAuth.getUser === "function") {
      try {
        const authUser = await window.SBWAuth.getUser();

        if (authUser && authUser.id) {
          return authUser.id;
        }
      } catch (error) {
        console.warn("[SaberWolf Profiles] Não foi possível ler usuário autenticado para salvar perfil:", error);
      }
    }

    return getCurrentAuthUserIdFallback(profileData);
  }

  function buildSupabaseProfileUpdatePayload(profile, currentRow) {
    const currentMetadata =
      currentRow && currentRow.metadata && typeof currentRow.metadata === "object" && !Array.isArray(currentRow.metadata)
        ? currentRow.metadata
        : {};
    const incomingMetadata =
      profile.metadata && typeof profile.metadata === "object" && !Array.isArray(profile.metadata)
        ? profile.metadata
        : {};
    const profileAssets =
      incomingMetadata.profileAssets && typeof incomingMetadata.profileAssets === "object" && !Array.isArray(incomingMetadata.profileAssets)
        ? incomingMetadata.profileAssets
        : currentMetadata.profileAssets || currentMetadata.assetFrames || {};
    const roleTags = Array.isArray(profile.roleTags) ? profile.roleTags : [];
    const mainGames = Array.isArray(profile.mainGames) ? profile.mainGames : [];
    const primaryGame = mainGames[0] || null;

    return {
      nickname: profile.nickname || profile.displayName || currentRow?.nickname || "",
      display_name: profile.displayName || profile.nickname || currentRow?.display_name || "Usuário -SBW-",
      headline: profile.headline || "",
      bio: profile.bio || "",
      country: profile.country || "Brasil",
      state: profile.state || "",
      city: profile.city || "",
      avatar_url: profile.avatarUrl || "",
      banner_url: profile.bannerUrl || "",
      main_game: primaryGame ? (primaryGame.name || primaryGame.id || "") : "",
      main_role: roleTags[0] || currentRow?.main_role || "Player",
      public_tags: roleTags.length ? roleTags : ["Player"],
      social_links: profile.socialLinks || {},
      metadata: {
        ...currentMetadata,
        ...incomingMetadata,
        profileType: profile.profileType || incomingMetadata.profileType || currentMetadata.profileType || "player",
        mainGames: mainGames,
        stats: profile.stats || incomingMetadata.stats || currentMetadata.stats || {},
        profileAssets: profileAssets
      },
      is_public: true,
      profile_completed: true,
      updated_at: nowIso()
    };
  }

  function syncCurrentUserFromProfile(profile) {
    const currentUser = getCurrentUser();
    const nextUser = Object.assign({}, currentUser, {
      id: profile.slug || profile.username || profile.id || currentUser.id,
      userId: profile.slug || profile.username || profile.id || currentUser.userId,
      profileId: profile.supabaseId || currentUser.profileId,
      authUserId: profile.authUserId || profile.auth_user_id || currentUser.authUserId,
      nickname: profile.nickname || currentUser.nickname,
      displayName: profile.displayName || currentUser.displayName,
      avatarUrl: profile.avatarUrl || "",
      permissions: profile.permissions || currentUser.permissions || {}
    });

    setCurrentUser(nextUser);

    return nextUser;
  }

  async function saveCurrentUserProfile(profileData) {
    const profile = normalizeProfile(profileData);

    if (!profilesSupabaseEnabled()) {
      return saveProfile(profile);
    }

    const authUserId = await getCurrentAuthUserId(profile);

    if (!authUserId) {
      return saveProfile(profile);
    }

    const tableName = getProfilesSupabaseTableName();

    try {
      const currentResult = await window.SBWSupabase.client
        .from(tableName)
        .select("*")
        .eq("auth_user_id", authUserId)
        .maybeSingle();

      if (currentResult.error) {
        throw currentResult.error;
      }

      const currentRow = currentResult.data || null;
      const payload = buildSupabaseProfileUpdatePayload(profile, currentRow);
      let result;

      if (currentRow && currentRow.id) {
        result = await window.SBWSupabase.client
          .from(tableName)
          .update(payload)
          .eq("id", currentRow.id)
          .select("*")
          .single();
      } else {
        result = await window.SBWSupabase.client
          .from(tableName)
          .update(payload)
          .eq("auth_user_id", authUserId)
          .select("*")
          .maybeSingle();
      }

      if (result.error) {
        throw result.error;
      }

      if (!result.data) {
        throw new Error("Perfil não encontrado no Supabase para atualizar.");
      }

      const normalized = normalizeSupabaseProfile(result.data);
      syncCurrentUserFromProfile(normalized);

      return normalized;
    } catch (error) {
      console.error("[SaberWolf Profiles] Erro ao salvar perfil no Supabase:", error);
      throw new Error(error.message || "Não foi possível salvar o perfil no Supabase.");
    }
  }

  async function getCurrentUserProfileAsync() {
    if (profilesSupabaseEnabled()) {
      const authUserId = await getCurrentAuthUserId({});

      if (authUserId) {
        const byAuth = await getSupabaseProfileByColumn("auth_user_id", authUserId);

        if (byAuth) {
          return byAuth;
        }
      }
    }

    const currentUser = getCurrentUser();
    const userId = currentUser.userId || currentUser.id;

    let profile = getProfileByUserId(userId);

    if (!profile) {
      profile = saveProfile({
        id: userId,
        userId: userId,
        nickname: currentUser.nickname || "UsuarioDemo",
        displayName: currentUser.displayName || currentUser.nickname || "Usuário -SBW-",
        profileType: "player",
        headline: "Jogador -SBW-",
        bio: "",
        country: "Brasil",
        state: "",
        city: "",
        avatarUrl: currentUser.avatarUrl || "",
        bannerUrl: "",
        mainGames: [],
        roleTags: ["Player"],
        socialLinks: {},
        stats: {
          tournamentsPlayed: 0,
          wins: 0,
          podiums: 0,
          titles: 0,
          prizeAmount: 0,
          prizeCurrency: "BRL"
        },
        permissions: currentUser.permissions || {}
      });
    }

    return profile;
  }

  function deleteProfile(profileId) {
    const profiles = getProfiles().filter(function (profile) {
      return profile.id !== profileId && profile.userId !== profileId;
    });

    saveProfiles(profiles);

    return true;
  }

  function getCurrentUser() {
    const stored = readJson(STORAGE_KEYS.currentUser, null);

    if (stored && typeof stored === "object") {
      return stored;
    }

    return {
      id: "user-demo-common",
      userId: "user-demo-common",
      nickname: "UsuarioDemo",
      displayName: "Usuário Demo",
      permissions: {
        canCreateTeam: false,
        canCreateTournament: false,
        isAdmin: false
      }
    };
  }

  function setCurrentUser(user) {
    const safeUser = user || {};
    writeJson(STORAGE_KEYS.currentUser, safeUser);
    return safeUser;
  }

  function getCurrentProfile() {
    const currentUser = getCurrentUser();
    const userId = currentUser.userId || currentUser.id;

    return getProfileByUserId(userId);
  }

    /* =========================================================
     SaberWolf v1.5.0 - Supabase Team Invites Adapter
     ========================================================= */

  function getTeamInvitesSupabaseTableName() {
    const supabaseConfig = window.SBWSupabaseConfig || {};

    if (supabaseConfig.tables && supabaseConfig.tables.teamInvites) {
      return supabaseConfig.tables.teamInvites;
    }

    return "team_invites";
  }

  function normalizeSupabaseTeamInvite(row, teamInfo) {
    const safeRow = row || {};
    const safeTeam = teamInfo || {};
    const metadata =
      safeRow.metadata && typeof safeRow.metadata === "object"
        ? safeRow.metadata
        : {};

    return {
      id: safeRow.id || "invite-" + safeRow.team_slug + "-" + safeRow.invited_profile_slug,

      userId: safeRow.invited_profile_slug || "",
      invitedProfileSlug: safeRow.invited_profile_slug || "",

      teamId: safeRow.team_slug || "",
      teamSlug: safeRow.team_slug || "",
      teamName: safeTeam.name || metadata.teamName || safeRow.team_slug || "Equipe",
      teamTag: safeTeam.tag || metadata.teamTag || "",
      teamLogoUrl: safeTeam.logo_url || metadata.teamLogoUrl || "",

      invitedByProfileSlug: safeRow.invited_by_profile_slug || "",

      role: safeRow.role || "member",
      functionName: safeRow.function_name || "Player",
      memberFunction: safeRow.function_name || "Player",
      publicTitle: safeRow.public_title || "",

      status: safeRow.status || "pending",
      message: safeRow.message || "",

      createdAt: safeRow.created_at || safeRow.invited_at || nowIso(),
      updatedAt: safeRow.updated_at || nowIso(),
      invitedAt: safeRow.invited_at || "",
      respondedAt: safeRow.responded_at || "",
      expiresAt: safeRow.expires_at || "",

      source: "supabase",
      metadata: metadata
    };
  }

  async function getTeamInfoForInvite(teamSlug) {
    if (!profilesSupabaseEnabled() || !teamSlug) {
      return null;
    }

    const teamsTable =
      (window.SBWSupabaseConfig &&
        window.SBWSupabaseConfig.tables &&
        window.SBWSupabaseConfig.tables.teams) ||
      "teams";

    try {
      const result = await window.SBWSupabase.client
        .from(teamsTable)
        .select("*")
        .eq("slug", teamSlug)
        .maybeSingle();

      if (result.error) {
        console.warn("[SaberWolf Profiles] Não foi possível buscar equipe do convite:", result.error);
        return null;
      }

      return result.data || null;
    } catch (error) {
      console.warn("[SaberWolf Profiles] Erro ao buscar equipe do convite:", error);
      return null;
    }
  }

  async function getInvitesByUserIdFromSupabase(userId) {
    if (!profilesSupabaseEnabled() || !userId) {
      return [];
    }

    const tableName = getTeamInvitesSupabaseTableName();

    try {
      const result = await window.SBWSupabase.client
        .from(tableName)
        .select("*")
        .eq("invited_profile_slug", userId)
        .order("created_at", {
          ascending: false
        });

      if (result.error) {
        console.error("[SaberWolf Profiles] Erro ao buscar convites no Supabase:", result.error);
        return [];
      }

      const rows = Array.isArray(result.data) ? result.data : [];

      if (!rows.length) {
        return [];
      }

      const teamSlugs = Array.from(
        new Set(
          rows
            .map(function (invite) {
              return invite.team_slug;
            })
            .filter(Boolean)
        )
      );

      const teamsMap = new Map();

      if (teamSlugs.length) {
        const teamsTable =
          (window.SBWSupabaseConfig &&
            window.SBWSupabaseConfig.tables &&
            window.SBWSupabaseConfig.tables.teams) ||
          "teams";

        const teamsResult = await window.SBWSupabase.client
          .from(teamsTable)
          .select("*")
          .in("slug", teamSlugs);

        if (!teamsResult.error && Array.isArray(teamsResult.data)) {
          teamsResult.data.forEach(function (team) {
            teamsMap.set(team.slug, team);
          });
        }
      }

      return rows.map(function (row) {
        return normalizeSupabaseTeamInvite(row, teamsMap.get(row.team_slug));
      });
    } catch (error) {
      console.error("[SaberWolf Profiles] Falha inesperada ao buscar convites:", error);
      return [];
    }
  }


  async function getCurrentUserInvitesFromSupabaseRpcV1643() {
    if (!profilesSupabaseEnabled()) {
      return [];
    }

    const client = window.SBWSupabase?.client;

    if (!client?.rpc) {
      return [];
    }

    try {
      const result = await client.rpc("sbw_get_current_user_team_invites");

      if (result.error) {
        console.warn("[SaberWolf Profiles] RPC de convites recebidos indisponível:", result.error);
        return [];
      }

      const rows = Array.isArray(result.data) ? result.data : [];
      return rows.map(function (row) {
        return normalizeSupabaseTeamInvite(row, null);
      });
    } catch (error) {
      console.warn("[SaberWolf Profiles] Erro inesperado na RPC de convites recebidos:", error);
      return [];
    }
  }

  async function acceptSupabaseTeamInviteRpcV1643(inviteId) {
    if (!profilesSupabaseEnabled()) {
      return {
        ok: false,
        message: "Supabase indisponível para aceitar convite."
      };
    }

    const client = window.SBWSupabase?.client;

    if (!client?.rpc) {
      return {
        ok: false,
        message: "RPC do Supabase indisponível para aceitar convite."
      };
    }

    try {
      const result = await client.rpc("sbw_accept_team_invite", {
        p_invite_id: String(inviteId || "")
      });

      if (result.error) {
        console.warn("[SaberWolf Profiles] RPC recusou aceite do convite:", result.error);
        return {
          ok: false,
          message: result.error.message || "Não foi possível aceitar o convite."
        };
      }

      const data = result.data && typeof result.data === "object" ? result.data : {};

      return {
        ok: data.ok !== false,
        data,
        message: data.message || "Convite aceito. Você entrou na equipe."
      };
    } catch (error) {
      console.warn("[SaberWolf Profiles] Erro inesperado ao aceitar convite via RPC:", error);
      return {
        ok: false,
        message: error?.message || "Erro inesperado ao aceitar convite."
      };
    }
  }

  async function declineSupabaseTeamInviteRpcV1643(inviteId) {
    if (!profilesSupabaseEnabled()) {
      return {
        ok: false,
        message: "Supabase indisponível para recusar convite."
      };
    }

    const client = window.SBWSupabase?.client;

    if (!client?.rpc) {
      return {
        ok: false,
        message: "RPC do Supabase indisponível para recusar convite."
      };
    }

    try {
      const result = await client.rpc("sbw_decline_team_invite", {
        p_invite_id: String(inviteId || "")
      });

      if (result.error) {
        console.warn("[SaberWolf Profiles] RPC recusou recusa do convite:", result.error);
        return {
          ok: false,
          message: result.error.message || "Não foi possível recusar o convite."
        };
      }

      const data = result.data && typeof result.data === "object" ? result.data : {};

      return {
        ok: data.ok !== false,
        data,
        message: data.message || "Convite recusado."
      };
    } catch (error) {
      console.warn("[SaberWolf Profiles] Erro inesperado ao recusar convite via RPC:", error);
      return {
        ok: false,
        message: error?.message || "Erro inesperado ao recusar convite."
      };
    }
  }

  async function getPendingInvitesByUserIdFromSupabase(userId) {
    const invites = await getInvitesByUserIdFromSupabase(userId);

    return invites.filter(function (invite) {
      return (invite.status || "pending") === "pending";
    });
  }

  function saveProfileInvites(invites) {
    return writeJson(STORAGE_KEYS.profileInvites, asArray(invites));
  }

  function getInvitesByUserId(userId) {
    return getProfileInvites().filter(function (invite) {
      return invite.userId === userId;
    });
  }

  function getPendingInvitesByUserId(userId) {
    return getInvitesByUserId(userId).filter(function (invite) {
      return (invite.status || "pending") === "pending";
    });
  }

  function createTeamInvite(inviteData) {
    const invite = Object.assign(
      {
        id: createId("invite"),
        status: "pending",
        createdAt: nowIso(),
        updatedAt: nowIso()
      },
      inviteData || {}
    );

    const invites = getProfileInvites();
    invites.push(invite);
    saveProfileInvites(invites);

    return invite;
  }

  function getProfileHistory() {
    const stored = readJson(STORAGE_KEYS.profileHistory, null);

    if (Array.isArray(stored)) {
      return stored;
    }

    return clone(DEMO_HISTORY);
  }

  function saveProfileHistory(history) {
    return writeJson(STORAGE_KEYS.profileHistory, asArray(history));
  }

  function sortHistoryByDate(history) {
    return history.sort(function (a, b) {
      const dateA = new Date(a.occurredAt || a.date || a.createdAt || 0).getTime();
      const dateB = new Date(b.occurredAt || b.date || b.createdAt || 0).getTime();

      return dateB - dateA;
    });
  }

  function getHistoryByUserId(userId) {
    const history = getProfileHistory().filter(function (item) {
      return item.userId === userId;
    });

    return sortHistoryByDate(history);
  }

  function addHistoryItem(historyData) {
    const item = Object.assign(
      {
        id: createId("history"),
        createdAt: nowIso(),
        occurredAt: nowIso()
      },
      historyData || {}
    );

    const history = getProfileHistory();
    history.push(item);
    saveProfileHistory(history);

    return item;
  }

  function getTeams() {
    const primary = readJson(STORAGE_KEYS.teams, null);

    if (Array.isArray(primary) && primary.length) {
      return primary;
    }

    const fallbackKeys = [
      "sbw_teams_v1_3_9",
      "sbw_teams_v1_4_0",
      "sbw_teams_v1_4_1",
      "sbw_teams_v1_4_2"
    ];

    for (let i = 0; i < fallbackKeys.length; i += 1) {
      const value = readJson(fallbackKeys[i], null);

      if (Array.isArray(value) && value.length) {
        return value;
      }

      const list = asArray(value);

      if (list.length) {
        return list;
      }
    }

    return [];
  }

  function getTeamById(teamId) {
    const teams = getTeams();

    return (
      teams.find(function (team) {
        return team.id === teamId || team.teamId === teamId || team.slug === teamId;
      }) || null
    );
  }

  function getTeamDisplayInfo(teamId, fallback) {
    const team = getTeamById(teamId);
    const safeFallback = fallback || {};

    if (!team) {
      return {
        id: teamId,
        name: safeFallback.teamName || safeFallback.name || teamId || "Equipe",
        tag: safeFallback.teamTag || safeFallback.tag || "",
        logoUrl: safeFallback.teamLogoUrl || safeFallback.logoUrl || "",
        isVerified: Boolean(safeFallback.isVerified)
      };
    }

    return {
      id: team.id || team.teamId || teamId,
      name: team.name || team.teamName || safeFallback.teamName || teamId || "Equipe",
      tag: team.tag || team.teamTag || safeFallback.teamTag || "",
      logoUrl:
        team.logoUrl ||
        team.logo ||
        team.avatarUrl ||
        team.badgeUrl ||
        safeFallback.teamLogoUrl ||
        "",
      isVerified: Boolean(team.isVerified || team.verified || safeFallback.isVerified)
    };
  }

  function getTeamMembers() {
    const stored = readJson(STORAGE_KEYS.teamMembers, []);

    return asArray(stored);
  }

  function saveTeamMembers(members) {
    return writeJson(STORAGE_KEYS.teamMembers, asArray(members));
  }

  function getProfileGameIds(profile) {
    const games = Array.isArray(profile.mainGames) ? profile.mainGames : [];

    return games
      .map(function (game) {
        if (typeof game === "string") {
          return game;
        }

        return game.id || game.name || "";
      })
      .filter(function (game) {
        return Boolean(game);
      });
  }

  function upsertTeamMemberFromInvite(invite) {
    const profile = getProfileByUserId(invite.userId) || {};
    const teamInfo = getTeamDisplayInfo(invite.teamId, invite);
    const members = getTeamMembers();

    const existingIndex = members.findIndex(function (member) {
      return member.userId === invite.userId && member.teamId === invite.teamId;
    });

    const memberFunction =
      invite.functionName ||
      invite.memberFunction ||
      invite["function"] ||
      "Player";

    const memberData = {
      id: "member-" + invite.teamId + "-" + invite.userId,
      teamId: invite.teamId,
      teamName: teamInfo.name,
      teamTag: teamInfo.tag,
      teamLogoUrl: teamInfo.logoUrl,
      userId: invite.userId,
      profileId: invite.userId,
      nickname: profile.nickname || invite.nickname || invite.userId,
      displayName: profile.displayName || profile.nickname || invite.userId,
      avatarUrl: profile.avatarUrl || "",
      role: invite.role || "member",
      function: memberFunction,
      functionName: memberFunction,
      games: getProfileGameIds(profile),
      status: "active",
      joinedAt: invite.acceptedAt || nowIso(),
      createdAt: invite.createdAt || nowIso(),
      updatedAt: nowIso()
    };

    if (existingIndex >= 0) {
      members[existingIndex] = Object.assign({}, members[existingIndex], memberData);
    } else {
      members.push(memberData);
    }

    saveTeamMembers(members);

    return memberData;
  }

  function acceptTeamInvite(inviteId, userId) {
    const invites = getProfileInvites();
    const index = invites.findIndex(function (invite) {
      const sameInvite = invite.id === inviteId;
      const sameUser = !userId || invite.userId === userId;

      return sameInvite && sameUser;
    });

    if (index < 0) {
      return {
        ok: false,
        message: "Convite não encontrado."
      };
    }

    const acceptedAt = nowIso();

    invites[index] = Object.assign({}, invites[index], {
      status: "accepted",
      acceptedAt: acceptedAt,
      respondedAt: acceptedAt,
      updatedAt: acceptedAt
    });

    saveProfileInvites(invites);

    const invite = invites[index];
    const member = upsertTeamMemberFromInvite(invite);
    const teamInfo = getTeamDisplayInfo(invite.teamId, invite);

    addHistoryItem({
      userId: invite.userId,
      type: "team_join",
      title: "Entrada em equipe",
      description: "Entrou na equipe " + teamInfo.name + ".",
      teamId: invite.teamId,
      teamName: teamInfo.name,
      teamTag: teamInfo.tag,
      teamLogoUrl: teamInfo.logoUrl,
      fromTeamId: "",
      fromTeamName: "",
      toTeamId: invite.teamId,
      toTeamName: teamInfo.name,
      date: acceptedAt.slice(0, 10),
      occurredAt: acceptedAt,
      status: "completed"
    });

    return {
      ok: true,
      invite: invite,
      member: member,
      message: "Convite aceito com sucesso."
    };
  }

  function declineTeamInvite(inviteId, userId) {
    const invites = getProfileInvites();
    const index = invites.findIndex(function (invite) {
      const sameInvite = invite.id === inviteId;
      const sameUser = !userId || invite.userId === userId;

      return sameInvite && sameUser;
    });

    if (index < 0) {
      return {
        ok: false,
        message: "Convite não encontrado."
      };
    }

    const declinedAt = nowIso();

    invites[index] = Object.assign({}, invites[index], {
      status: "declined",
      declinedAt: declinedAt,
      respondedAt: declinedAt,
      updatedAt: declinedAt
    });

    saveProfileInvites(invites);

    return {
      ok: true,
      invite: invites[index],
      message: "Convite recusado."
    };
  }

  function getCurrentTeamsByUserId(userId) {
    const members = getTeamMembers();

    return members
      .filter(function (member) {
        const status = member.status || "active";

        return member.userId === userId && status === "active";
      })
      .map(function (member) {
        const teamInfo = getTeamDisplayInfo(member.teamId, member);

        return {
          id: teamInfo.id,
          teamId: member.teamId,
          name: teamInfo.name,
          teamName: teamInfo.name,
          tag: teamInfo.tag,
          teamTag: teamInfo.tag,
          logoUrl: teamInfo.logoUrl,
          teamLogoUrl: teamInfo.logoUrl,
          isVerified: teamInfo.isVerified,
          role: member.role || "member",
          function: member["function"] || member.functionName || "Player",
          functionName: member.functionName || member["function"] || "Player",
          joinedAt: member.joinedAt || member.createdAt || "",
          status: member.status || "active",
          url: "../equipes/equipe.html?id=" + encodeURIComponent(member.teamId)
        };
      });
  }

  function removeUserFromTeam(userId, teamId, options) {
    const safeOptions = options || {};
    const removedAt = safeOptions.removedAt || nowIso();
    const members = getTeamMembers();
    let removedMember = null;

    const updatedMembers = members.map(function (member) {
      if (member.userId === userId && member.teamId === teamId && (member.status || "active") === "active") {
        removedMember = member;

        return Object.assign({}, member, {
          status: "inactive",
          leftAt: removedAt,
          updatedAt: removedAt
        });
      }

      return member;
    });

    saveTeamMembers(updatedMembers);

    if (removedMember) {
      const teamInfo = getTeamDisplayInfo(teamId, removedMember);

      addHistoryItem({
        userId: userId,
        type: "team_leave",
        title: "Saída de equipe",
        description: "Saiu da equipe " + teamInfo.name + ".",
        teamId: teamId,
        teamName: teamInfo.name,
        teamTag: teamInfo.tag,
        teamLogoUrl: teamInfo.logoUrl,
        fromTeamId: teamId,
        fromTeamName: teamInfo.name,
        toTeamId: "",
        toTeamName: "",
        date: removedAt.slice(0, 10),
        occurredAt: removedAt,
        status: "completed"
      });
    }

    return {
      ok: Boolean(removedMember),
      member: removedMember
    };
  }

    /* =========================================================
     SaberWolf v1.5.0 - Compatibilidade local de convites
     Mantém o fallback local-demo funcionando junto do Supabase.
     ========================================================= */

  function getProfileInvites() {
    const stored = readJson(STORAGE_KEYS.profileInvites, null);

    if (Array.isArray(stored)) {
      return stored;
    }

    return clone(DEMO_INVITES);
  }

  function saveProfileInvites(invites) {
    return writeJson(STORAGE_KEYS.profileInvites, asArray(invites));
  }

  function getInvitesByUserId(userId) {
    return getProfileInvites().filter(function (invite) {
      return invite.userId === userId || invite.invitedProfileSlug === userId;
    });
  }

  function getPendingInvitesByUserId(userId) {
    return getInvitesByUserId(userId).filter(function (invite) {
      return (invite.status || "pending") === "pending";
    });
  }

    /* =========================================================
     SaberWolf v1.5.3 - Medalhas e Conquistas Demo
     Futuro: Torneios vão alimentar automaticamente esses dados.
     ========================================================= */

  const SBW_PROFILE_MEDALS_STORAGE_KEY = "sbw_profile_medals_v1";

  const SBW_DEMO_PROFILE_MEDALS = [
    {
      id: "medal-user-demo-common-sf6-open-gold",
      userId: "user-demo-common",
      profileSlug: "user-demo-common",

      medalType: "gold",
      medalIcon: "🏆",
      medalLabel: "Campeão",
      medalShortLabel: "Ouro",

      title: "Campeão — Street Fighter 6 Open",
      description: "Conquista demo de primeiro lugar em torneio da plataforma SaberWolf.",

      tournamentId: "sf6-open-supabase-demo",
      tournamentName: "Street Fighter 6 Open",
      organizerName: "-SBW- Championship",

      game: "Street Fighter 6",
      category: "Fighting Games",

      placement: 1,
      points: 100,
      prizeAmount: 500,
      prizeCurrency: "BRL",

      awardedAt: "2026-06-03",
      season: "2026",

      source: "local-demo",
      featured: true
    },
    {
      id: "medal-user-demo-common-fatal-fury-silver",
      userId: "user-demo-common",
      profileSlug: "user-demo-common",

      medalType: "silver",
      medalIcon: "🥈",
      medalLabel: "Vice-campeão",
      medalShortLabel: "Prata",

      title: "Vice-campeão — Fatal Fury Clash",
      description: "Conquista demo de segundo lugar em torneio da comunidade.",

      tournamentId: "fatal-fury-clash-demo",
      tournamentName: "Fatal Fury Clash",
      organizerName: "Organizador Parceiro",

      game: "Fatal Fury: City of the Wolves",
      category: "Fighting Games",

      placement: 2,
      points: 70,
      prizeAmount: 250,
      prizeCurrency: "BRL",

      awardedAt: "2026-06-12",
      season: "2026",

      source: "local-demo",
      featured: true
    },
    {
      id: "medal-user-demo-common-top8-tekken",
      userId: "user-demo-common",
      profileSlug: "user-demo-common",

      medalType: "top8",
      medalIcon: "🎖️",
      medalLabel: "Top 8",
      medalShortLabel: "Top 8",

      title: "Top 8 — Tekken 8 Community Cup",
      description: "Conquista demo de destaque entre os oito melhores colocados.",

      tournamentId: "tekken-community-cup-demo",
      tournamentName: "Tekken 8 Community Cup",
      organizerName: "Comunidade FGC",

      game: "Tekken 8",
      category: "Fighting Games",

      placement: 7,
      points: 25,
      prizeAmount: 0,
      prizeCurrency: "BRL",

      awardedAt: "2026-06-18",
      season: "2026",

      source: "local-demo",
      featured: false
    },
    {
      id: "medal-user-demo-team-creator-bronze",
      userId: "user-demo-team-creator",
      profileSlug: "user-demo-team-creator",

      medalType: "bronze",
      medalIcon: "🥉",
      medalLabel: "3º lugar",
      medalShortLabel: "Bronze",

      title: "3º lugar — -SBW- Championship Qualifier",
      description: "Conquista demo de terceiro lugar em classificatória oficial.",

      tournamentId: "sbw-championship-qualifier-demo",
      tournamentName: "-SBW- Championship Qualifier",
      organizerName: "-SBW- Championship",

      game: "Street Fighter 6",
      category: "Fighting Games",

      placement: 3,
      points: 50,
      prizeAmount: 150,
      prizeCurrency: "BRL",

      awardedAt: "2026-06-22",
      season: "2026",

      source: "local-demo",
      featured: true
    }
  ];

  function getStoredProfileMedals() {
    try {
      const stored = localStorage.getItem(SBW_PROFILE_MEDALS_STORAGE_KEY);

      if (!stored) {
        return null;
      }

      const parsed = JSON.parse(stored);

      if (Array.isArray(parsed)) {
        return parsed;
      }

      return null;
    } catch (error) {
      console.warn("[SaberWolf Profiles] Erro ao ler medalhas locais:", error);
      return null;
    }
  }

  function saveProfileMedals(medals) {
    try {
      const safeMedals = Array.isArray(medals) ? medals : [];
      localStorage.setItem(SBW_PROFILE_MEDALS_STORAGE_KEY, JSON.stringify(safeMedals));
      return safeMedals;
    } catch (error) {
      console.warn("[SaberWolf Profiles] Erro ao salvar medalhas locais:", error);
      return [];
    }
  }

  function getAllProfileMedals() {
    const stored = getStoredProfileMedals();

    if (Array.isArray(stored)) {
      return stored;
    }

    return SBW_DEMO_PROFILE_MEDALS.slice();
  }

  function normalizeProfileMedal(medal) {
    const safeMedal = medal || {};

    return {
      id: safeMedal.id || "medal-" + Date.now(),

      userId: safeMedal.userId || safeMedal.profileSlug || "",
      profileSlug: safeMedal.profileSlug || safeMedal.userId || "",

      medalType: safeMedal.medalType || "achievement",
      medalIcon: safeMedal.medalIcon || "🏅",
      medalLabel: safeMedal.medalLabel || "Conquista",
      medalShortLabel: safeMedal.medalShortLabel || safeMedal.medalLabel || "Medalha",

      title: safeMedal.title || "Conquista SaberWolf",
      description: safeMedal.description || "",

      tournamentId: safeMedal.tournamentId || "",
      tournamentName: safeMedal.tournamentName || "",
      organizerName: safeMedal.organizerName || "",

      game: safeMedal.game || "",
      category: safeMedal.category || "",

      placement: Number(safeMedal.placement || 0),
      points: Number(safeMedal.points || 0),

      prizeAmount: Number(safeMedal.prizeAmount || 0),
      prizeCurrency: safeMedal.prizeCurrency || "BRL",

      awardedAt: safeMedal.awardedAt || "",
      season: safeMedal.season || "2026",

      source: safeMedal.source || "local-demo",
      featured: Boolean(safeMedal.featured)
    };
  }

  function getProfileMedalsByUserId(userId) {
    if (!userId) {
      return [];
    }

    return getAllProfileMedals()
      .map(normalizeProfileMedal)
      .filter(function (medal) {
        return medal.userId === userId || medal.profileSlug === userId;
      })
      .sort(function (a, b) {
        const dateA = new Date(a.awardedAt || "1900-01-01").getTime();
        const dateB = new Date(b.awardedAt || "1900-01-01").getTime();

        return dateB - dateA;
      });
  }

  function getFeaturedProfileMedalsByUserId(userId) {
    return getProfileMedalsByUserId(userId)
      .filter(function (medal) {
        return medal.featured;
      })
      .slice(0, 4);
  }

  function getProfileMedalSummaryByUserId(userId) {
    const medals = getProfileMedalsByUserId(userId);

    return {
      total: medals.length,
      gold: medals.filter(function (medal) {
        return medal.medalType === "gold";
      }).length,
      silver: medals.filter(function (medal) {
        return medal.medalType === "silver";
      }).length,
      bronze: medals.filter(function (medal) {
        return medal.medalType === "bronze";
      }).length,
      top8: medals.filter(function (medal) {
        return medal.medalType === "top8";
      }).length,
      points: medals.reduce(function (total, medal) {
        return total + Number(medal.points || 0);
      }, 0),
      prizeAmount: medals.reduce(function (total, medal) {
        return total + Number(medal.prizeAmount || 0);
      }, 0)
    };
  }


    /* =========================================================
     SaberWolf v1.5.9.0 - Histórico competitivo pós-torneio
     Lê torneios finalizados e inscrições reais do Supabase para gerar
     histórico/medalhas derivados de settings.finalResults.
     ========================================================= */

  function getCompetitiveTournamentsTableName() {
    const supabaseConfig = window.SBWSupabaseConfig || {};

    if (supabaseConfig.tables && supabaseConfig.tables.tournaments) {
      return supabaseConfig.tables.tournaments;
    }

    return "tournaments";
  }

  function getCompetitiveParticipantsTableName() {
    const supabaseConfig = window.SBWSupabaseConfig || {};

    if (supabaseConfig.tables && supabaseConfig.tables.tournamentParticipants) {
      return supabaseConfig.tables.tournamentParticipants;
    }

    return "tournament_participants";
  }

  function profileHistoryLooksLikeUUID(value) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      String(value || "")
    );
  }

  function uniqueProfileHistoryStrings(values) {
    const seen = new Set();
    const result = [];

    (Array.isArray(values) ? values : []).forEach(function (value) {
      const normalized = String(value || "").trim();

      if (!normalized || seen.has(normalized)) {
        return;
      }

      seen.add(normalized);
      result.push(normalized);
    });

    return result;
  }

  function getCompetitiveProfileLookupKeys(profileOrUserId) {
    const profile = typeof profileOrUserId === "object" && profileOrUserId
      ? profileOrUserId
      : { id: profileOrUserId, userId: profileOrUserId };

    return uniqueProfileHistoryStrings([
      profile.id,
      profile.userId,
      profile.profileSlug,
      profile.slug,
      profile.username,
      profile.supabaseId,
      profile.authUserId,
      profile.auth_user_id,
      profile.nickname
    ]);
  }

  function getFinalResultsFromTournamentRow(row) {
    const settings = row && row.settings && typeof row.settings === "object" ? row.settings : {};
    const metadata = row && row.metadata && typeof row.metadata === "object" ? row.metadata : {};

    return settings.finalResults || metadata.finalResults || null;
  }

  function getTournamentHistoryIdentity(row) {
    const settings = row && row.settings && typeof row.settings === "object" ? row.settings : {};
    const metadata = row && row.metadata && typeof row.metadata === "object" ? row.metadata : {};

    return {
      id: String(row.id || row.slug || ""),
      slug: String(row.slug || row.id || ""),
      title: row.title || row.name || metadata.title || "Torneio -SBW-",
      gameName: row.game_name || row.game_id || metadata.gameName || metadata.game || settings.gameName || settings.game || "Jogo não informado",
      organizerName: row.organizer_name || metadata.organizerName || metadata.organizer_name || "Organizador -SBW-",
      startsAt: row.starts_at || metadata.startsAt || metadata.startDate || row.created_at || "",
      completedAt: settings.completedAt || metadata.completedAt || row.updated_at || "",
      status: row.status || "completed"
    };
  }

  function participantMatchesTournamentRow(participant, tournamentIdentity) {
    const tournamentId = String(participant.tournament_id || "");
    const tournamentSlug = String(participant.tournament_slug || "");

    return Boolean(
      tournamentId && (tournamentId === tournamentIdentity.id || tournamentId === tournamentIdentity.slug) ||
      tournamentSlug && (tournamentSlug === tournamentIdentity.id || tournamentSlug === tournamentIdentity.slug)
    );
  }

  function getParticipantPlacementInFinalResults(participant, finalResults) {
    const placements = Array.isArray(finalResults && finalResults.placements)
      ? finalResults.placements
      : [];

    const keys = uniqueProfileHistoryStrings([
      participant.id,
      participant.participant_id,
      participant.profile_id,
      participant.player_slug,
      participant.auth_user_id,
      participant.player_name
    ]);

    return placements.find(function (placement) {
      const placementKeys = uniqueProfileHistoryStrings([
        placement.id,
        placement.playerId,
        placement.participantId,
        placement.profileId,
        placement.profileSlug,
        placement.playerSlug,
        placement.authUserId,
        placement.nickname,
        placement.name
      ]);

      return placementKeys.some(function (key) {
        return keys.includes(key);
      });
    }) || null;
  }

  function getPlacementLabel(placement) {
    const numeric = Number(placement || 0);

    if (numeric === 1) return "Campeão";
    if (numeric === 2) return "Vice-campeão";
    if (numeric === 3) return "3º lugar";
    if (numeric > 0) return numeric + "º lugar";

    return "Participação";
  }

  function getMedalConfigByPlacement(placement) {
    const numeric = Number(placement || 0);

    if (numeric === 1) {
      return { type: "gold", icon: "🏆", label: "Campeão", shortLabel: "Ouro", points: 100, featured: true };
    }

    if (numeric === 2) {
      return { type: "silver", icon: "🥈", label: "Vice-campeão", shortLabel: "Prata", points: 75, featured: true };
    }

    if (numeric === 3) {
      return { type: "bronze", icon: "🥉", label: "3º lugar", shortLabel: "Bronze", points: 50, featured: true };
    }

    const top8Points = {
      4: 30,
      5: 20,
      6: 15,
      7: 10,
      8: 5
    };

    if (numeric >= 4 && numeric <= 8) {
      return { type: "top8", icon: "🏅", label: "Top 8", shortLabel: "Top 8", points: top8Points[numeric] || 5, featured: false };
    }

    return null;
  }

  function normalizeGeneratedCompetitiveRecord(profileOrUserId, participant, tournamentRow) {
    const profile = typeof profileOrUserId === "object" && profileOrUserId
      ? profileOrUserId
      : { id: profileOrUserId, userId: profileOrUserId };
    const profileId = profile.userId || profile.id || participant.profile_id || participant.player_slug || "";
    const tournament = getTournamentHistoryIdentity(tournamentRow);
    const finalResults = getFinalResultsFromTournamentRow(tournamentRow);
    const placement = getParticipantPlacementInFinalResults(participant, finalResults);
    const placementNumber = Number(placement && placement.placement ? placement.placement : 0);
    const placementLabel = placement && placement.placementLabel ? placement.placementLabel : getPlacementLabel(placementNumber);
    const playerName = participant.player_name || placement?.nickname || placement?.name || profile.displayName || profile.nickname || "Jogador";
    const type = placementNumber === 1
      ? "title"
      : (placementNumber > 1 && placementNumber <= 3 ? "podium" : "tournament");
    const occurredAt = finalResults?.completedAt || finalResults?.finalizedAt || tournament.completedAt || tournament.startsAt || nowIso();
    const date = String(occurredAt || "").slice(0, 10);

    return {
      id: "competitive-history-" + profileId + "-" + (tournament.slug || tournament.id) + "-" + (placementNumber || "participation"),
      userId: profileId,
      profileSlug: profile.slug || profile.username || profile.userId || profile.id || participant.player_slug || "",
      type,
      title: placementNumber
        ? placementLabel + " — " + tournament.title
        : "Participação — " + tournament.title,
      description: placementNumber
        ? playerName + " ficou em " + placementLabel + " no torneio " + tournament.title + "."
        : playerName + " participou do torneio " + tournament.title + ".",
      tournamentId: tournament.id,
      tournamentSlug: tournament.slug,
      tournamentName: tournament.title,
      gameName: tournament.gameName,
      organizerName: tournament.organizerName,
      position: placementNumber || null,
      placement: placementNumber || null,
      placementLabel,
      occurredAt,
      date,
      source: "supabase-final-results",
      createdAt: occurredAt
    };
  }

  function createMedalFromCompetitiveRecord(record) {
    const config = getMedalConfigByPlacement(record.placement);

    if (!config) {
      return null;
    }

    return normalizeProfileMedal({
      id: "medal-" + record.userId + "-" + (record.tournamentSlug || record.tournamentId) + "-" + record.placement,
      userId: record.userId,
      profileSlug: record.profileSlug || record.userId,
      medalType: config.type,
      medalIcon: config.icon,
      medalLabel: config.label,
      medalShortLabel: config.shortLabel,
      title: config.label + " — " + record.tournamentName,
      description: record.description,
      tournamentId: record.tournamentSlug || record.tournamentId,
      tournamentName: record.tournamentName,
      organizerName: record.organizerName,
      game: record.gameName,
      category: "Competitivo",
      placement: record.placement,
      points: config.points,
      prizeAmount: 0,
      prizeCurrency: "BRL",
      awardedAt: record.date,
      season: String(record.date || "").slice(0, 4) || "2026",
      source: "supabase-final-results",
      featured: config.featured
    });
  }

  function dedupeByIdOrSignature(items, signatureFactory) {
    const seen = new Set();
    const result = [];

    (Array.isArray(items) ? items : []).forEach(function (item) {
      const signature = String(
        item.id ||
        (typeof signatureFactory === "function" ? signatureFactory(item) : "") ||
        ""
      );

      if (!signature || seen.has(signature)) {
        return;
      }

      seen.add(signature);
      result.push(item);
    });

    return result;
  }

  function mergeProfileHistoryLists(baseHistory, generatedHistory) {
    return sortHistoryByDate(dedupeByIdOrSignature(
      [].concat(Array.isArray(generatedHistory) ? generatedHistory : [], Array.isArray(baseHistory) ? baseHistory : []),
      function (item) {
        return [item.userId, item.type, item.tournamentId || item.tournamentSlug || item.tournamentName, item.placement || item.position || ""].join(":");
      }
    ));
  }

  function mergeProfileMedalLists(baseMedals, generatedMedals) {
    return dedupeByIdOrSignature(
      [].concat(Array.isArray(generatedMedals) ? generatedMedals : [], Array.isArray(baseMedals) ? baseMedals : []),
      function (item) {
        return [item.userId, item.medalType, item.tournamentId || item.tournamentName, item.placement || ""].join(":");
      }
    ).sort(function (a, b) {
      const dateA = new Date(a.awardedAt || "1900-01-01").getTime();
      const dateB = new Date(b.awardedAt || "1900-01-01").getTime();
      return dateB - dateA;
    });
  }

  function getCompetitiveStatsFromRecords(records, medals) {
    const safeRecords = Array.isArray(records) ? records : [];
    const safeMedals = Array.isArray(medals) ? medals : [];

    return {
      tournamentsPlayed: safeRecords.length,
      wins: safeMedals.filter(function (medal) { return medal.placement === 1; }).length,
      podiums: safeMedals.filter(function (medal) { return Number(medal.placement || 0) >= 1 && Number(medal.placement || 0) <= 3; }).length,
      titles: safeMedals.filter(function (medal) { return medal.medalType === "gold"; }).length,
      prizeAmount: safeMedals.reduce(function (total, medal) { return total + Number(medal.prizeAmount || 0); }, 0),
      prizeCurrency: "BRL"
    };
  }


  function getFinalResultPlacementsFromTournamentRow(row) {
    const finalResults = getFinalResultsFromTournamentRow(row);
    return Array.isArray(finalResults && finalResults.placements)
      ? finalResults.placements
      : [];
  }

  function getCompetitivePlacementLookupKeys(placement) {
    return uniqueProfileHistoryStrings([
      placement && placement.id,
      placement && placement.playerId,
      placement && placement.participantId,
      placement && placement.profileId,
      placement && placement.profileSlug,
      placement && placement.playerSlug,
      placement && placement.authUserId,
      placement && placement.auth_user_id,
      placement && placement.nickname,
      placement && placement.name
    ]);
  }

  function placementMatchesCompetitiveProfile(placement, profileOrUserId) {
    const profileKeys = getCompetitiveProfileLookupKeys(profileOrUserId).map(function (key) {
      return String(key || "").toLowerCase();
    });
    const placementKeys = getCompetitivePlacementLookupKeys(placement).map(function (key) {
      return String(key || "").toLowerCase();
    });

    if (!profileKeys.length || !placementKeys.length) {
      return false;
    }

    return placementKeys.some(function (key) {
      return profileKeys.includes(key);
    });
  }

  function normalizeCompetitiveParticipantFromPlacement(placement, tournamentRow) {
    const tournament = getTournamentHistoryIdentity(tournamentRow);
    const id = String(
      placement.participantId ||
      placement.playerId ||
      placement.id ||
      placement.profileId ||
      placement.playerSlug ||
      placement.nickname ||
      placement.name ||
      ""
    ).trim();
    const playerName = placement.nickname || placement.name || "Jogador";

    return {
      id: id || playerName,
      participant_id: id || playerName,
      tournament_id: tournament.id,
      tournament_slug: tournament.slug,
      tournament_name: tournament.title,
      auth_user_id: placement.authUserId || placement.auth_user_id || "",
      profile_id: placement.profileId || placement.profileSlug || placement.playerSlug || id || "",
      player_name: playerName,
      player_slug: placement.playerSlug || placement.profileSlug || id || playerName,
      team_name: placement.team || placement.teamName || "",
      status: "registered",
      check_in_status: "checked_in",
      metadata: {
        source: "finalResultsPlacement"
      },
      created_at: tournament.completedAt || tournament.startsAt || nowIso(),
      updated_at: tournament.completedAt || nowIso()
    };
  }

  function profileLooksLikeCompetitiveVirtual(profile) {
    return profile && profile.source === "supabase-final-results-profile";
  }

  function getCompetitiveProfileKey(profile) {
    return String(profile && (profile.id || profile.userId || profile.slug || profile.username || profile.nickname || "")).toLowerCase();
  }

  function mergeProfilesWithCompetitiveProfiles(baseProfiles, competitiveProfiles) {
    const result = [];
    const seen = new Set();

    [].concat(Array.isArray(baseProfiles) ? baseProfiles : [], Array.isArray(competitiveProfiles) ? competitiveProfiles : []).forEach(function (profile) {
      const normalized = normalizeProfile(profile);
      const keys = uniqueProfileHistoryStrings([
        normalized.id,
        normalized.userId,
        normalized.slug,
        normalized.username,
        normalized.profileSlug,
        normalized.nickname,
        normalized.displayName
      ]).map(function (key) {
        return String(key || "").toLowerCase();
      });
      const signature = keys[0] || createId("profile");

      if (keys.some(function (key) { return seen.has(key); })) {
        return;
      }

      keys.forEach(function (key) { seen.add(key); });
      seen.add(signature);
      result.push(normalized);
    });

    return result;
  }

  function buildVirtualCompetitiveProfileFromPlacement(placement, tournamentRow) {
    const tournament = getTournamentHistoryIdentity(tournamentRow);
    const playerName = placement.nickname || placement.name || "Jogador";
    const id = String(
      placement.profileId ||
      placement.profileSlug ||
      placement.playerSlug ||
      placement.playerId ||
      placement.participantId ||
      placement.id ||
      playerName
    ).trim();
    const placementNumber = Number(placement.placement || 0);
    const medalConfig = getMedalConfigByPlacement(placementNumber);

    return normalizeProfile({
      id: id,
      userId: id,
      slug: placement.profileSlug || placement.playerSlug || id,
      username: placement.playerSlug || placement.profileSlug || id,
      nickname: playerName,
      displayName: playerName,
      profileType: "player",
      headline: placementNumber
        ? getPlacementLabel(placementNumber) + " em " + tournament.title
        : "Participante de torneio -SBW-",
      bio: "Perfil competitivo gerado automaticamente a partir do resultado final oficial do torneio " + tournament.title + ".",
      country: "Brasil",
      state: "",
      city: "",
      avatarUrl: "",
      bannerUrl: "",
      mainGames: tournament.gameName
        ? [{ id: profileGameIdFromName(tournament.gameName), name: tournament.gameName, category: "Competitivo" }]
        : [],
      roleTags: ["Player", medalConfig ? medalConfig.shortLabel : "Competitivo"].filter(Boolean),
      stats: {
        tournamentsPlayed: 1,
        wins: placementNumber === 1 ? 1 : 0,
        podiums: placementNumber >= 1 && placementNumber <= 3 ? 1 : 0,
        titles: placementNumber === 1 ? 1 : 0,
        prizeAmount: 0,
        prizeCurrency: "BRL"
      },
      currentTeam: placement.team
        ? {
            id: "",
            teamId: "",
            name: placement.team,
            teamName: placement.team,
            teamTag: "",
            tag: ""
          }
        : null,
      currentTeams: placement.team
        ? [{ teamName: placement.team, name: placement.team }]
        : [],
      source: "supabase-final-results-profile",
      createdAt: tournament.completedAt || tournament.startsAt || nowIso(),
      updatedAt: tournament.completedAt || nowIso()
    });
  }

  async function getCompetitiveProfilesFromCompletedTournamentsAsync() {
    if (!profilesSupabaseEnabled()) {
      return [];
    }

    try {
      const tournaments = await getSupabaseCompletedTournamentsForCompetitiveHistory();
      const profilesMap = new Map();

      tournaments.forEach(function (row) {
        getFinalResultPlacementsFromTournamentRow(row).forEach(function (placement) {
          const virtualProfile = buildVirtualCompetitiveProfileFromPlacement(placement, row);
          const key = getCompetitiveProfileKey(virtualProfile);

          if (!key) {
            return;
          }

          const existing = profilesMap.get(key);

          if (!existing) {
            profilesMap.set(key, virtualProfile);
            return;
          }

          const existingStats = existing.stats || {};
          const nextStats = virtualProfile.stats || {};
          profilesMap.set(key, normalizeProfile({
            ...existing,
            stats: {
              tournamentsPlayed: Number(existingStats.tournamentsPlayed || 0) + Number(nextStats.tournamentsPlayed || 0),
              wins: Number(existingStats.wins || 0) + Number(nextStats.wins || 0),
              podiums: Number(existingStats.podiums || 0) + Number(nextStats.podiums || 0),
              titles: Number(existingStats.titles || 0) + Number(nextStats.titles || 0),
              prizeAmount: Number(existingStats.prizeAmount || 0) + Number(nextStats.prizeAmount || 0),
              prizeCurrency: existingStats.prizeCurrency || nextStats.prizeCurrency || "BRL"
            },
            updatedAt: virtualProfile.updatedAt || existing.updatedAt
          }));
        });
      });

      return Array.from(profilesMap.values());
    } catch (error) {
      console.warn("[SaberWolf Profiles] Não foi possível gerar perfis competitivos virtuais:", error);
      return [];
    }
  }

  async function getVirtualCompetitiveProfileByIdAsync(profileId) {
    const target = String(profileId || "").toLowerCase();

    if (!target) {
      return null;
    }

    const virtualProfiles = await getCompetitiveProfilesFromCompletedTournamentsAsync();

    return virtualProfiles.find(function (profile) {
      return uniqueProfileHistoryStrings([
        profile.id,
        profile.userId,
        profile.slug,
        profile.username,
        profile.profileSlug,
        profile.nickname,
        profile.displayName
      ]).map(function (key) {
        return String(key || "").toLowerCase();
      }).includes(target);
    }) || null;
  }

  async function getSupabaseParticipantsForCompetitiveProfile(profileOrUserId) {
    if (!profilesSupabaseEnabled()) {
      return [];
    }

    const keys = getCompetitiveProfileLookupKeys(profileOrUserId);

    if (!keys.length) {
      return [];
    }

    const tableName = getCompetitiveParticipantsTableName();
    const columns = "id,tournament_id,tournament_slug,tournament_name,auth_user_id,profile_id,player_name,player_slug,team_name,status,check_in_status,metadata,created_at,updated_at";
    const rows = [];

    async function collectBy(column, value) {
      const { data, error } = await window.SBWSupabase.client
        .from(tableName)
        .select(columns)
        .eq(column, value)
        .in("status", ["registered", "waitlist"])
        .order("created_at", { ascending: false });

      if (error) {
        console.warn("[SaberWolf Profiles] Não foi possível buscar histórico competitivo por " + column + ":", error);
        return;
      }

      if (Array.isArray(data)) {
        rows.push.apply(rows, data);
      }
    }

    for (const key of keys) {
      await collectBy("profile_id", key);
      await collectBy("player_slug", key);

      if (profileHistoryLooksLikeUUID(key)) {
        await collectBy("auth_user_id", key);
      }
    }

    return dedupeByIdOrSignature(rows, function (row) {
      return [row.tournament_id, row.tournament_slug, row.profile_id, row.player_slug, row.auth_user_id].join(":");
    });
  }

  async function getSupabaseCompletedTournamentsForCompetitiveHistory() {
    if (!profilesSupabaseEnabled()) {
      return [];
    }

    const tableName = getCompetitiveTournamentsTableName();

    const { data, error } = await window.SBWSupabase.client
      .from(tableName)
      .select("id,slug,title,game_id,game_name,organizer_name,status,settings,metadata,starts_at,updated_at,created_at")
      .eq("status", "completed")
      .order("updated_at", { ascending: false })
      .limit(100);

    if (error) {
      console.warn("[SaberWolf Profiles] Não foi possível buscar torneios finalizados:", error);
      return [];
    }

    return Array.isArray(data) ? data : [];
  }

  async function getCompetitiveProfileSnapshotAsync(profileOrUserId) {
    if (!profilesSupabaseEnabled()) {
      return {
        history: [],
        medals: [],
        stats: getCompetitiveStatsFromRecords([], []),
        source: "local-demo"
      };
    }

    try {
      const participants = await getSupabaseParticipantsForCompetitiveProfile(profileOrUserId);
      const tournaments = await getSupabaseCompletedTournamentsForCompetitiveHistory();
      const history = [];

      tournaments.forEach(function (row) {
        const identity = getTournamentHistoryIdentity(row);
        const finalResults = getFinalResultsFromTournamentRow(row);

        if (!finalResults) {
          return;
        }

        const matchedParticipants = participants.filter(function (participant) {
          return participantMatchesTournamentRow(participant, identity);
        });

        if (matchedParticipants.length > 0) {
          matchedParticipants.forEach(function (participant) {
            history.push(normalizeGeneratedCompetitiveRecord(profileOrUserId, participant, row));
          });
          return;
        }

        getFinalResultPlacementsFromTournamentRow(row)
          .filter(function (placement) {
            return placementMatchesCompetitiveProfile(placement, profileOrUserId);
          })
          .forEach(function (placement) {
            history.push(normalizeGeneratedCompetitiveRecord(
              profileOrUserId,
              normalizeCompetitiveParticipantFromPlacement(placement, row),
              row
            ));
          });
      });

      const medals = history
        .map(createMedalFromCompetitiveRecord)
        .filter(Boolean);

      return {
        history: sortHistoryByDate(history),
        medals: mergeProfileMedalLists([], medals),
        stats: getCompetitiveStatsFromRecords(history, medals),
        source: "supabase-final-results"
      };
    } catch (error) {
      console.warn("[SaberWolf Profiles] Erro ao montar snapshot competitivo:", error);
      return {
        history: [],
        medals: [],
        stats: getCompetitiveStatsFromRecords([], []),
        source: "supabase-final-results",
        error
      };
    }
  }

    /* =========================================================
     SaberWolf v1.5.4 - Status Público do Jogador
     Futuro: usado em Perfis, Transferências, Contratações e Rankings.
     ========================================================= */

  const SBW_PLAYER_STATUS_STORAGE_KEY = "sbw_player_status_v1";

  const SBW_PLAYER_STATUS_OPTIONS = [
    {
      id: "free_agent",
      label: "Free Agent",
      shortLabel: "Livre",
      description: "Jogador sem equipe no momento.",
      tone: "green"
    },
    {
      id: "looking_team",
      label: "Buscando equipe",
      shortLabel: "Buscando equipe",
      description: "Jogador procurando equipe, clã ou organização.",
      tone: "cyan"
    },
    {
      id: "in_team",
      label: "Em equipe",
      shortLabel: "Em equipe",
      description: "Jogador já faz parte de uma equipe.",
      tone: "blue"
    },
    {
      id: "open_offers",
      label: "Aberto a propostas",
      shortLabel: "Aberto a propostas",
      description: "Jogador já pode estar em equipe, mas aceita conversar sobre propostas.",
      tone: "purple"
    },
    {
      id: "casual_only",
      label: "Apenas casual",
      shortLabel: "Casual",
      description: "Jogador utiliza o perfil para comunidade, clã ou jogos casuais.",
      tone: "gold"
    },
    {
      id: "unavailable",
      label: "Não disponível",
      shortLabel: "Indisponível",
      description: "Jogador não está aberto a convites ou propostas no momento.",
      tone: "muted"
    }
  ];

  const SBW_DEMO_PLAYER_STATUS = [
    {
      userId: "user-demo-common",
      profileSlug: "user-demo-common",
      status: "open_offers",
      lookingFor: ["Equipe competitiva", "Torneios", "Fighting Games"],
      preferredGames: ["Street Fighter 6", "Tekken 8"],
      preferredRoles: ["Player"],
      availabilityText: "Aberto a propostas de equipes e torneios de Fighting Games.",
      updatedAt: "2026-06-03T00:00:00.000Z",
      source: "local-demo"
    },
    {
      userId: "user-demo-team-creator",
      profileSlug: "user-demo-team-creator",
      status: "in_team",
      lookingFor: ["Gestão de equipe", "Organização", "Fighting Games"],
      preferredGames: ["Street Fighter 6"],
      preferredRoles: ["Capitão", "Player"],
      availabilityText: "Capitão da equipe, focado em gestão e competição.",
      updatedAt: "2026-06-03T00:00:00.000Z",
      source: "local-demo"
    }
  ];

  function getPlayerStatusOptions() {
    return SBW_PLAYER_STATUS_OPTIONS.slice();
  }

  function getPlayerStatusOption(statusId) {
    const found = SBW_PLAYER_STATUS_OPTIONS.find(function (option) {
      return option.id === statusId;
    });

    return found || SBW_PLAYER_STATUS_OPTIONS[0];
  }

  function getStoredPlayerStatuses() {
    try {
      const stored = localStorage.getItem(SBW_PLAYER_STATUS_STORAGE_KEY);

      if (!stored) {
        return null;
      }

      const parsed = JSON.parse(stored);

      if (Array.isArray(parsed)) {
        return parsed;
      }

      return null;
    } catch (error) {
      console.warn("[SaberWolf Profiles] Erro ao ler status dos jogadores:", error);
      return null;
    }
  }

  function savePlayerStatuses(statuses) {
    try {
      const safeStatuses = Array.isArray(statuses) ? statuses : [];
      localStorage.setItem(SBW_PLAYER_STATUS_STORAGE_KEY, JSON.stringify(safeStatuses));
      return safeStatuses;
    } catch (error) {
      console.warn("[SaberWolf Profiles] Erro ao salvar status dos jogadores:", error);
      return [];
    }
  }

  function getAllPlayerStatuses() {
    const stored = getStoredPlayerStatuses();

    if (Array.isArray(stored)) {
      return stored;
    }

    return SBW_DEMO_PLAYER_STATUS.slice();
  }

  function normalizePlayerStatus(statusData) {
    const safeStatus = statusData || {};
    const option = getPlayerStatusOption(safeStatus.status || "free_agent");

    return {
      userId: safeStatus.userId || safeStatus.profileSlug || "",
      profileSlug: safeStatus.profileSlug || safeStatus.userId || "",

      status: option.id,
      label: option.label,
      shortLabel: option.shortLabel,
      description: option.description,
      tone: option.tone,

      lookingFor: Array.isArray(safeStatus.lookingFor) ? safeStatus.lookingFor : [],
      preferredGames: Array.isArray(safeStatus.preferredGames) ? safeStatus.preferredGames : [],
      preferredRoles: Array.isArray(safeStatus.preferredRoles) ? safeStatus.preferredRoles : [],

      availabilityText: safeStatus.availabilityText || option.description,

      updatedAt: safeStatus.updatedAt || nowIso(),
      source: safeStatus.source || "local-demo"
    };
  }

  function getPlayerStatusByUserId(userId) {
    if (!userId) {
      return normalizePlayerStatus({
        status: "free_agent"
      });
    }

    const found = getAllPlayerStatuses().find(function (statusData) {
      return statusData.userId === userId || statusData.profileSlug === userId;
    });

    if (!found) {
      return normalizePlayerStatus({
        userId: userId,
        profileSlug: userId,
        status: "free_agent",
        lookingFor: [],
        preferredGames: [],
        preferredRoles: [],
        availabilityText: "Jogador livre para definir seu status público.",
        source: "default"
      });
    }

    return normalizePlayerStatus(found);
  }

  function savePlayerStatusByUserId(userId, statusPayload) {
    const statuses = getAllPlayerStatuses();
    const safePayload = statusPayload || {};
    const index = statuses.findIndex(function (statusData) {
      return statusData.userId === userId || statusData.profileSlug === userId;
    });

    const nextStatus = Object.assign({}, index >= 0 ? statuses[index] : {}, safePayload, {
      userId: userId,
      profileSlug: userId,
      updatedAt: nowIso(),
      source: "local-demo"
    });

    if (index >= 0) {
      statuses[index] = nextStatus;
    } else {
      statuses.push(nextStatus);
    }

    savePlayerStatuses(statuses);

    return normalizePlayerStatus(nextStatus);
  }

  window.SBWProfilesStorage = {
    storageKeys: STORAGE_KEYS,

    readJson: readJson,
    writeJson: writeJson,

    getProfiles: getProfiles,
    getAllProfiles: getProfiles,
    getProfilesAsync: getProfilesAsync,
    getAllProfilesAsync: getProfilesAsync,

    saveProfiles: saveProfiles,

    getProfileById: getProfileById,
    getProfileByUserId: getProfileByUserId,
    getProfile: getProfileById,

    getProfileByIdAsync: getProfileByIdAsync,
    getProfileByUserIdAsync: getProfileByUserIdAsync,
    getProfileAsync: getProfileByIdAsync,
    saveProfile: saveProfile,
    saveCurrentUserProfile: saveCurrentUserProfile,
    upsertProfile: saveProfile,
    updateProfile: saveProfile,
    deleteProfile: deleteProfile,

    getCurrentUser: getCurrentUser,
    setCurrentUser: setCurrentUser,
    getCurrentProfile: getCurrentProfile,
    getCurrentProfileAsync: getCurrentProfileAsync,

    getProfileInvites: getProfileInvites,
    getInvites: getProfileInvites,
    saveProfileInvites: saveProfileInvites,

    getInvitesByUserId: getInvitesByUserId,
    getProfileInvitesByUserId: getInvitesByUserId,
    getPendingInvitesByUserId: getPendingInvitesByUserId,

    getInvitesByUserIdFromSupabase: getInvitesByUserIdFromSupabase,
    getPendingInvitesByUserIdFromSupabase: getPendingInvitesByUserIdFromSupabase,
    createTeamInvite: createTeamInvite,
    acceptTeamInvite: acceptTeamInvite,
    declineTeamInvite: declineTeamInvite,
    rejectTeamInvite: declineTeamInvite,

    getProfileHistory: getProfileHistory,
    getHistory: getProfileHistory,
    saveProfileHistory: saveProfileHistory,
    getHistoryByUserId: getHistoryByUserId,
    getProfileHistoryByUserId: getHistoryByUserId,
    addHistoryItem: addHistoryItem,
    getCompetitiveProfileSnapshotAsync: getCompetitiveProfileSnapshotAsync,
    getCompetitiveProfilesFromCompletedTournamentsAsync: getCompetitiveProfilesFromCompletedTournamentsAsync,
    getVirtualCompetitiveProfileByIdAsync: getVirtualCompetitiveProfileByIdAsync,
    mergeProfileHistoryLists: mergeProfileHistoryLists,
    mergeProfileMedalLists: mergeProfileMedalLists,

    getTeams: getTeams,
    getTeamById: getTeamById,
    getTeamDisplayInfo: getTeamDisplayInfo,

    getTeamMembers: getTeamMembers,
    saveTeamMembers: saveTeamMembers,
    getCurrentTeamsByUserId: getCurrentTeamsByUserId,
    getCurrentTeamsByUserIdAsync: getCurrentTeamsByUserIdAsync,
    getCurrentTeamsByUserIdFromSupabase: getCurrentTeamsByUserIdFromSupabase,
    removeUserFromTeam: removeUserFromTeam,

    profilesSupabaseEnabled: profilesSupabaseEnabled,
    normalizeSupabaseProfile: normalizeSupabaseProfile
  };

  /* =========================================================
     SaberWolf v1.4.3 - Compatibilidade com profile-admin-page.js
     ========================================================= */

  window.SBWProfilesStorage.getCurrentUserProfile = getCurrentUserProfileAsync;
  window.SBWProfilesStorage.getCurrentUserProfileAsync = getCurrentUserProfileAsync;

    function normalizeInviteForAdminPanel(invite) {
    const safeInvite = invite || {};

    return Object.assign({}, safeInvite, {
      userId:
        safeInvite.userId ||
        safeInvite.invitedProfileSlug ||
        safeInvite.invited_profile_slug ||
        "",

      teamId:
        safeInvite.teamId ||
        safeInvite.teamSlug ||
        safeInvite.team_slug ||
        "",

      teamSlug:
        safeInvite.teamSlug ||
        safeInvite.teamId ||
        safeInvite.team_slug ||
        "",

      teamName:
        safeInvite.teamName ||
        safeInvite.name ||
        safeInvite.team_slug ||
        "Equipe",

      teamTag:
        safeInvite.teamTag ||
        safeInvite.tag ||
        "",

      teamLogoUrl:
        safeInvite.teamLogoUrl ||
        safeInvite.logoUrl ||
        "",

      inviteType: safeInvite.inviteType || "received",

      roleOffered:
        safeInvite.roleOffered ||
        safeInvite.publicTitle ||
        safeInvite.functionName ||
        safeInvite.memberFunction ||
        safeInvite.role ||
        "Membro",

      status: safeInvite.status || "pending",

      createdAt:
        safeInvite.createdAt ||
        safeInvite.invitedAt ||
        safeInvite.invited_at ||
        nowIso()
    });
  }

    window.SBWProfilesStorage.getAllProfileMedals = getAllProfileMedals;
  window.SBWProfilesStorage.saveProfileMedals = saveProfileMedals;
  window.SBWProfilesStorage.getProfileMedalsByUserId = getProfileMedalsByUserId;
  window.SBWProfilesStorage.getFeaturedProfileMedalsByUserId = getFeaturedProfileMedalsByUserId;
  window.SBWProfilesStorage.getProfileMedalSummaryByUserId = getProfileMedalSummaryByUserId;
  window.SBWProfilesStorage.getCompetitiveProfileSnapshotAsync = getCompetitiveProfileSnapshotAsync;
  window.SBWProfilesStorage.getCompetitiveProfilesFromCompletedTournamentsAsync = getCompetitiveProfilesFromCompletedTournamentsAsync;
  window.SBWProfilesStorage.getVirtualCompetitiveProfileByIdAsync = getVirtualCompetitiveProfileByIdAsync;
  window.SBWProfilesStorage.mergeProfileHistoryLists = mergeProfileHistoryLists;
  window.SBWProfilesStorage.mergeProfileMedalLists = mergeProfileMedalLists;
    window.SBWProfilesStorage.getPlayerStatusOptions = getPlayerStatusOptions;
  window.SBWProfilesStorage.getPlayerStatusByUserId = getPlayerStatusByUserId;
  window.SBWProfilesStorage.savePlayerStatusByUserId = savePlayerStatusByUserId;
  window.SBWProfilesStorage.getAllPlayerStatuses = getAllPlayerStatuses;

  window.SBWProfilesStorage.getCurrentUserInvites = async function () {
    const currentUser = getCurrentUser();
    const userId = currentUser.userId || currentUser.id;

    if (profilesSupabaseEnabled() && typeof getInvitesByUserIdFromSupabase === "function") {
      try {
        const supabaseInvites = await getInvitesByUserIdFromSupabase(userId);

        if (Array.isArray(supabaseInvites) && supabaseInvites.length > 0) {
          return supabaseInvites.map(normalizeInviteForAdminPanel);
        }
      } catch (error) {
        console.warn("[SaberWolf Profiles] Erro ao buscar convites do usuário no Supabase:", error);
      }
    }

    return getInvitesByUserId(userId).map(normalizeInviteForAdminPanel);
  };

  window.SBWProfilesStorage.getCurrentUserHistory = function () {
    const currentUser = getCurrentUser();
    const userId = currentUser.userId || currentUser.id;

    return getHistoryByUserId(userId).map(function (item) {
      return Object.assign({}, item, {
        source: item.source || "SaberWolf",
        subtitle:
          item.subtitle ||
          item.description ||
          item.tournamentName ||
          item.teamName ||
          ""
      });
    });
  };

  window.SBWProfilesStorage.updateInviteStatus = function (inviteId, status) {
    const currentUser = getCurrentUser();
    const userId = currentUser.userId || currentUser.id;

    if (status === "accepted") {
      return acceptTeamInvite(inviteId, userId);
    }

    if (status === "declined") {
      return declineTeamInvite(inviteId, userId);
    }

    const invites = getProfileInvites();
    const updatedAt = nowIso();

    const updatedInvites = invites.map(function (invite) {
      if (invite.id !== inviteId || invite.userId !== userId) {
        return invite;
      }

      return Object.assign({}, invite, {
        status: status,
        updatedAt: updatedAt
      });
    });

    saveProfileInvites(updatedInvites);

    return {
      ok: true,
      message: "Status do convite atualizado."
    };
  };

  /* =========================================================
     SaberWolf v1.6.15 - Convites recebidos / Meu Perfil
     ========================================================= */

  function getProfileKeyFromContext(context) {
    return String(
      context?.profileKey ||
        context?.profile?.slug ||
        context?.profile?.username ||
        context?.profile?.profile_slug ||
        context?.profile?.id ||
        context?.user?.id ||
        ""
    );
  }

  function getInviteIdentifiersFromContext(context) {
    const values = [];

    if (Array.isArray(context?.identifiers)) {
      values.push.apply(values, context.identifiers);
    }

    values.push(
      getProfileKeyFromContext(context),
      context?.profile?.slug,
      context?.profile?.username,
      context?.profile?.profile_slug,
      context?.profile?.id,
      context?.user?.id,
      context?.user?.email
    );

    return Array.from(
      new Set(
        values
          .map(function (value) {
            return String(value || "").trim();
          })
          .filter(Boolean)
      )
    );
  }

  async function getInviteProfileContext() {
    try {
      if (window.SBWSessionContext && typeof window.SBWSessionContext.getCurrentContext === "function") {
        const context = await window.SBWSessionContext.getCurrentContext({ refresh: true });

        if (context && context.user) {
          return context;
        }
      }
    } catch (error) {
      console.warn("[SaberWolf Profiles] Não foi possível carregar contexto de sessão para convites:", error);
    }

    const currentUser = getCurrentUser();
    const userId = currentUser.userId || currentUser.id || "";
    const profile = getProfileByUserId(userId) || getCurrentProfile() || null;

    return {
      user: currentUser || null,
      profile: profile,
      profileKey: profile?.slug || profile?.username || profile?.id || userId,
      identifiers: [userId, profile?.slug, profile?.username, profile?.id].filter(Boolean),
      displayName: profile?.displayName || profile?.nickname || currentUser?.displayName || "Usuário SBW",
      currentTeam: null,
      currentTeamMember: null
    };
  }

  function inviteTeamKeyV1615(invite) {
    return String(invite?.teamSlug || invite?.teamId || invite?.team_slug || "");
  }

  function inviteProfileKeyV1615(invite) {
    return String(
      invite?.userId ||
        invite?.profileSlug ||
        invite?.profileId ||
        invite?.invitedProfileSlug ||
        invite?.invited_profile_slug ||
        ""
    );
  }

  function normalizeInviteForCurrentProfile(invite, context) {
    const normalized = normalizeInviteForAdminPanel(invite);
    const profileKey = getProfileKeyFromContext(context);

    return Object.assign({}, normalized, {
      userId: normalized.userId || profileKey,
      profileSlug: normalized.profileSlug || normalized.userId || profileKey,
      invitedProfileSlug: normalized.invitedProfileSlug || normalized.userId || profileKey,
      inviteType: normalized.inviteType === "team_to_player" ? "received" : normalized.inviteType || "received"
    });
  }

  function mergeCurrentProfileInvites(lists, context) {
    const identifiers = getInviteIdentifiersFromContext(context);
    const map = new Map();

    lists.flat().forEach(function (invite) {
      const normalized = normalizeInviteForCurrentProfile(invite, context);
      const profileKey = inviteProfileKeyV1615(normalized);

      if (profileKey && identifiers.length && !identifiers.includes(profileKey)) {
        return;
      }

      const key = normalized.id || [inviteTeamKeyV1615(normalized), profileKey, normalized.status || "pending"].join("::");

      if (!map.has(key) || normalized.source === "supabase") {
        map.set(key, normalized);
      }
    });

    return Array.from(map.values()).sort(function (a, b) {
      return String(b.createdAt || "").localeCompare(String(a.createdAt || ""));
    });
  }

  async function getCurrentUserInvitesV1615() {
    const context = await getInviteProfileContext();
    const identifiers = getInviteIdentifiersFromContext(context);
    const localInvites = [];
    let supabaseInvites = [];

    identifiers.forEach(function (identifier) {
      localInvites.push.apply(localInvites, getInvitesByUserId(identifier));
    });

    if (profilesSupabaseEnabled()) {
      supabaseInvites = await getCurrentUserInvitesFromSupabaseRpcV1643();

      if (!supabaseInvites.length && typeof getInvitesByUserIdFromSupabase === "function") {
        for (const identifier of identifiers) {
          try {
            const rows = await getInvitesByUserIdFromSupabase(identifier);
            supabaseInvites.push.apply(supabaseInvites, rows);
          } catch (error) {
            console.warn("[SaberWolf Profiles] Erro ao buscar convite recebido no Supabase:", error);
          }
        }
      }
    }

    return mergeCurrentProfileInvites([supabaseInvites, localInvites], context);
  }

  async function findCurrentProfileInvite(inviteId, context) {
    const invites = await getCurrentUserInvitesV1615();

    return invites.find(function (invite) {
      return String(invite.id || "") === String(inviteId || "");
    }) || null;
  }

  async function getCurrentActiveTeamMembershipsV1615(context) {
    const identifiers = getInviteIdentifiersFromContext(context);
    const map = new Map();

    if (context?.currentTeam) {
      const key = context.currentTeam.slug || context.currentTeam.id || "current-team";
      map.set(key, {
        teamId: key,
        teamSlug: key,
        teamName: context.currentTeam.name || "Equipe atual",
        status: "active",
        source: "session-context"
      });
    }

    if (window.SBWTeamsStorage && typeof window.SBWTeamsStorage.getActiveMembershipsForProfile === "function") {
      for (const identifier of identifiers) {
        try {
          const memberships = await window.SBWTeamsStorage.getActiveMembershipsForProfile(identifier);
          (Array.isArray(memberships) ? memberships : []).forEach(function (membership) {
            const key = String(membership.teamSlug || membership.teamId || membership.team_id || "");
            if (key) map.set(key, membership);
          });
        } catch (error) {
          console.warn("[SaberWolf Profiles] Não foi possível verificar vínculo atual de equipe:", error);
        }
      }
    }

    return Array.from(map.values()).filter(function (membership) {
      return String(membership.status || "active") === "active";
    });
  }

  function getProfileGamesForMemberRow(profile) {
    return (profile?.mainGames || [])
      .map(function (game) {
        if (typeof game === "string") return game;
        return game.id || game.name || "";
      })
      .filter(Boolean);
  }

  async function upsertSupabaseTeamMemberFromInviteV1615(invite, context) {
    if (!profilesSupabaseEnabled()) {
      return null;
    }

    const client = window.SBWSupabase?.client;
    if (!client) return null;

    const tableName =
      (window.SBWSupabaseConfig &&
        window.SBWSupabaseConfig.tables &&
        window.SBWSupabaseConfig.tables.teamMembers) ||
      "team_members";

    const teamSlug = inviteTeamKeyV1615(invite);
    const profileSlug = getProfileKeyFromContext(context) || inviteProfileKeyV1615(invite);
    const profile = context.profile || {};
    const metadata = profile.metadata && typeof profile.metadata === "object" ? profile.metadata : {};
    const joinedAt = nowIso();

    if (!teamSlug || !profileSlug) {
      return null;
    }

    const row = {
      team_slug: teamSlug,
      profile_slug: profileSlug,
      auth_user_id: context.user?.id || null,
      nickname: profile.nickname || profile.username || context.displayName || profileSlug,
      display_name:
        profile.display_name ||
        profile.displayName ||
        profile.nickname ||
        context.displayName ||
        profileSlug,
      avatar_url: profile.avatar_url || profile.avatarUrl || metadata.avatarUrl || "",
      role: invite.role || "member",
      function_name: invite.functionName || invite.memberFunction || "Player",
      public_title: invite.publicTitle || "",
      games: getProfileGamesForMemberRow(profile),
      status: "active",
      joined_at: joinedAt,
      invited_by_profile_slug: invite.invitedByProfileSlug || null,
      metadata: {
        source: "profile-invite-accept-v1.6.15",
        inviteId: invite.id || "",
        teamName: invite.teamName || "",
        teamTag: invite.teamTag || ""
      }
    };

    try {
      const existing = await client
        .from(tableName)
        .select("id")
        .eq("team_slug", teamSlug)
        .eq("profile_slug", profileSlug)
        .maybeSingle();

      if (!existing.error && existing.data?.id) {
        const updateResult = await client
          .from(tableName)
          .update(Object.assign({}, row, { updated_at: joinedAt }))
          .eq("id", existing.data.id)
          .select("*")
          .maybeSingle();

        if (updateResult.error) {
          console.warn("[SaberWolf Profiles] Supabase recusou atualização do membro:", updateResult.error);
          return null;
        }

        return updateResult.data || row;
      }

      const insertResult = await client
        .from(tableName)
        .insert(row)
        .select("*")
        .maybeSingle();

      if (insertResult.error) {
        console.warn("[SaberWolf Profiles] Supabase recusou criação do membro:", insertResult.error);
        return null;
      }

      return insertResult.data || row;
    } catch (error) {
      console.warn("[SaberWolf Profiles] Erro inesperado ao criar vínculo de equipe:", error);
      return null;
    }
  }

  async function updateSupabaseInviteStatusV1615(invite, status) {
    if (!profilesSupabaseEnabled() || !invite?.id) {
      return false;
    }

    const client = window.SBWSupabase?.client;
    if (!client) return false;

    const tableName = getTeamInvitesSupabaseTableName();
    const respondedAt = nowIso();

    try {
      const result = await client
        .from(tableName)
        .update({
          status: status,
          responded_at: respondedAt,
          updated_at: respondedAt
        })
        .eq("id", invite.id)
        .select("*")
        .maybeSingle();

      if (result.error) {
        console.warn("[SaberWolf Profiles] Supabase recusou atualização do convite:", result.error);
        return false;
      }

      return true;
    } catch (error) {
      console.warn("[SaberWolf Profiles] Erro inesperado ao atualizar convite:", error);
      return false;
    }
  }

  function mirrorInviteToLocalForCurrentProfile(invite, context) {
    const profileKey = getProfileKeyFromContext(context) || inviteProfileKeyV1615(invite);
    const localInvite = Object.assign({}, invite, {
      userId: profileKey,
      profileId: profileKey,
      profileSlug: profileKey,
      invitedProfileSlug: profileKey,
      teamId: inviteTeamKeyV1615(invite),
      teamSlug: inviteTeamKeyV1615(invite),
      inviteType: "received",
      source: invite.source || "local-demo"
    });

    const invites = getProfileInvites();
    const index = invites.findIndex(function (item) {
      return String(item.id || "") === String(localInvite.id || "");
    });

    if (index >= 0) {
      invites[index] = Object.assign({}, invites[index], localInvite);
    } else {
      invites.push(localInvite);
    }

    saveProfileInvites(invites);

    return localInvite;
  }

  async function acceptCurrentUserTeamInviteV1615(inviteId) {
    const context = await getInviteProfileContext();
    const invite = await findCurrentProfileInvite(inviteId, context);

    if (!context?.user && !context?.profile) {
      return {
        ok: false,
        message: "Entre na sua conta para aceitar convites."
      };
    }

    if (!invite) {
      return {
        ok: false,
        message: "Convite não encontrado para este perfil."
      };
    }

    if (String(invite.status || "pending") !== "pending") {
      return {
        ok: false,
        invite: invite,
        message: "Este convite já foi respondido."
      };
    }

    const teamSlug = inviteTeamKeyV1615(invite);
    const memberships = await getCurrentActiveTeamMembershipsV1615(context);
    const otherMembership = memberships.find(function (membership) {
      const membershipTeam = String(membership.teamSlug || membership.teamId || membership.team_id || "");
      return membershipTeam && teamSlug && membershipTeam !== teamSlug;
    });

    if (otherMembership) {
      return {
        ok: false,
        invite: invite,
        message: "Você já participa de outra equipe ativa. Saia da equipe atual antes de aceitar outro convite."
      };
    }

    if (invite.source === "supabase") {
      const rpcResult = await acceptSupabaseTeamInviteRpcV1643(invite.id);

      if (!rpcResult.ok) {
        return {
          ok: false,
          invite,
          source: "supabase",
          message: rpcResult.message || "Não foi possível aceitar o convite."
        };
      }

      const mirroredInvite = mirrorInviteToLocalForCurrentProfile(invite, context);
      const localResult = acceptTeamInvite(mirroredInvite.id, mirroredInvite.userId);

      if (window.SBWSessionContext?.clearCache) {
        window.SBWSessionContext.clearCache();
      }

      return {
        ok: true,
        invite: Object.assign({}, invite, { status: "accepted", respondedAt: nowIso() }),
        member: localResult.member || rpcResult.data?.member || null,
        source: "supabase",
        message: rpcResult.message || "Convite aceito. Você entrou na equipe."
      };
    }

    const mirroredInvite = mirrorInviteToLocalForCurrentProfile(invite, context);
    const localResult = acceptTeamInvite(mirroredInvite.id, mirroredInvite.userId);

    if (window.SBWSessionContext?.clearCache) {
      window.SBWSessionContext.clearCache();
    }

    return {
      ok: localResult.ok,
      invite: Object.assign({}, invite, { status: "accepted", respondedAt: nowIso() }),
      member: localResult.member || null,
      source: "local-demo",
      message: localResult.message || "Convite aceito no fallback local."
    };
  }

  async function declineCurrentUserTeamInviteV1615(inviteId) {
    const context = await getInviteProfileContext();
    const invite = await findCurrentProfileInvite(inviteId, context);

    if (!invite) {
      return {
        ok: false,
        message: "Convite não encontrado para este perfil."
      };
    }

    if (invite.source === "supabase") {
      const rpcResult = await declineSupabaseTeamInviteRpcV1643(invite.id);

      if (!rpcResult.ok) {
        return {
          ok: false,
          invite,
          source: "supabase",
          message: rpcResult.message || "Não foi possível recusar o convite."
        };
      }

      const mirroredInvite = mirrorInviteToLocalForCurrentProfile(invite, context);
      declineTeamInvite(mirroredInvite.id, mirroredInvite.userId);

      if (window.SBWSessionContext?.clearCache) {
        window.SBWSessionContext.clearCache();
      }

      return {
        ok: true,
        invite: Object.assign({}, invite, { status: "declined", respondedAt: nowIso() }),
        source: "supabase",
        message: rpcResult.message || "Convite recusado."
      };
    }

    const mirroredInvite = mirrorInviteToLocalForCurrentProfile(invite, context);
    const localResult = declineTeamInvite(mirroredInvite.id, mirroredInvite.userId);

    if (window.SBWSessionContext?.clearCache) {
      window.SBWSessionContext.clearCache();
    }

    return {
      ok: localResult.ok,
      invite: Object.assign({}, invite, { status: "declined", respondedAt: nowIso() }),
      source: "local-demo",
      message: localResult.message || "Convite recusado no fallback local."
    };
  }

  window.SBWProfilesStorage.getCurrentUserInvites = getCurrentUserInvitesV1615;
  window.SBWProfilesStorage.acceptTeamInvite = acceptCurrentUserTeamInviteV1615;
  window.SBWProfilesStorage.declineTeamInvite = declineCurrentUserTeamInviteV1615;
  window.SBWProfilesStorage.rejectTeamInvite = declineCurrentUserTeamInviteV1615;

  window.SBWProfilesStorage.updateInviteStatus = async function (inviteId, status) {
    if (status === "accepted") {
      return acceptCurrentUserTeamInviteV1615(inviteId);
    }

    if (status === "declined") {
      return declineCurrentUserTeamInviteV1615(inviteId);
    }

    return {
      ok: false,
      message: "Status de convite não suportado nesta etapa."
    };
  };

})();