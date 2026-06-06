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

  async function getAllTeamsFromSupabase() {
    if (!teamsSupabaseEnabled()) {
      return [];
    }

    const tableName = getTeamsSupabaseTableName();

    try {
      const result = await window.SBWSupabase.client
        .from(tableName)
        .select("*")
        .eq("is_public", true)
        .order("name", {
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
        version: metadata.version || "1.4.7"
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

  async function getAllTeams() {
    if (teamsSupabaseEnabled()) {
      const supabaseTeams = await getAllTeamsFromSupabase();

      if (supabaseTeams.length > 0) {
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

      console.warn("[SaberWolf Teams] Nenhuma equipe retornada do Supabase. Usando fallback local-demo.");
    }

    return mergeDemoAndLocalTeams();
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
  getTeamById,
  getTeamBySlug,
  getTeamMembers,
  getSubteams,
  saveTeam,
  isTagAvailable,
  canCreateSubteam,
  canRequestVerification,

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