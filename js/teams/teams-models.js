(function () {
  function nowIso() {
    return new Date().toISOString();
  }

  function normalizeString(value) {
    return String(value || "").trim();
  }

  function normalizeTag(value) {
    return normalizeString(value)
      .toUpperCase()
      .replace(/\s+/g, "")
      .replace(/[^A-Z0-9_-]/g, "");
  }

  function createSlug(value) {
    return normalizeString(value)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  function normalizeTeam(rawTeam) {
    const config = window.SBW_TEAMS_CONFIG;

    const name = normalizeString(rawTeam.name);
    const tag = normalizeTag(rawTeam.tag);

    const teamType =
      rawTeam.teamType ||
      rawTeam.team_type ||
      config.teamTypes.mainTeam;

    const verificationStatus =
      rawTeam.verificationStatus ||
      rawTeam.verification_status ||
      config.verificationStatus.notVerified;

    const isVerified =
      verificationStatus === config.verificationStatus.verified;

    const isSubteam = teamType === config.teamTypes.subteam;

    let defaultLimit = config.limits.commonTeamMembers;

    if (isSubteam && isVerified) {
      defaultLimit = config.limits.verifiedSubteamMembers;
    } else if (isSubteam) {
      defaultLimit = config.limits.commonSubteamMembers;
    } else if (isVerified) {
      defaultLimit = config.limits.verifiedTeamMembers;
    }

    return {
      id: rawTeam.id || `team-${Date.now()}`,
      name,
      tag,
      slug: rawTeam.slug || createSlug(name),
      teamType,
      parentTeamId: rawTeam.parentTeamId || rawTeam.parent_team_id || null,

      description: normalizeString(rawTeam.description),

      logoUrl: rawTeam.logoUrl || rawTeam.logo_url || "",
      bannerUrl: rawTeam.bannerUrl || rawTeam.banner_url || "",

      theme: rawTeam.theme || {
        primaryColor: "#00e5ff",
        secondaryColor: "#7c3cff",
        accentColor: "#ffffff",
        backgroundMode: "dark",
        source: "default"
      },

      verificationStatus,
      verificationType:
        rawTeam.verificationType ||
        rawTeam.verification_type ||
        teamType,

      memberLimit: Number(rawTeam.memberLimit || rawTeam.member_limit || defaultLimit),

      captainUserId: rawTeam.captainUserId || rawTeam.captain_user_id || null,
      captainName: normalizeString(rawTeam.captainName || rawTeam.captain_name),

      games: Array.isArray(rawTeam.games) ? rawTeam.games : [],

      socialLinks: rawTeam.socialLinks || rawTeam.social_links || {
        discord: "",
        x: "",
        instagram: "",
        youtube: ""
      },

      stats: rawTeam.stats || {
        tournamentsPlayed: 0,
        titles: 0,
        podiums: 0,
        prizeAmount: 0,
        prizeCurrency: "BRL"
      },

      createdAt: rawTeam.createdAt || rawTeam.created_at || nowIso(),
      updatedAt: nowIso()
    };
  }

function normalizeMember(raw = {}) {
  return {
    id: raw.id || `member-${Date.now()}`,
    teamId: raw.teamId || "",
    userId: raw.userId || "",
    nickname: raw.nickname || raw.name || "Membro",
    displayName: raw.displayName || raw.nickname || raw.name || "Membro",
    avatarUrl: raw.avatarUrl || "",

    role: raw.role || config.memberRoles.member,
    status: raw.status || "active",

    games: Array.isArray(raw.games) ? raw.games : [],

    publicTitle: raw.publicTitle || "",
    publicTitleLabel: raw.publicTitleLabel || "",

    createdAt: raw.createdAt || nowIso(),
    updatedAt: raw.updatedAt || nowIso()
  };
}

  function getVerificationLabel(team) {
    const config = window.SBW_TEAMS_CONFIG;

    if (!team || team.verificationStatus !== config.verificationStatus.verified) {
      return "Não verificada";
    }

    if (team.teamType === config.teamTypes.subteam) {
      return "Subequipe verificada";
    }

    return "Equipe verificada";
  }

  function getTeamTypeLabel(team) {
    const config = window.SBW_TEAMS_CONFIG;

    if (!team) return "Equipe";

    if (team.teamType === config.teamTypes.subteam) {
      return "Subequipe";
    }

    return "Equipe";
  }

  window.SBWTeamsModels = {
    nowIso,
    normalizeString,
    normalizeTag,
    createSlug,
    normalizeTeam,
    normalizeMember,
    getVerificationLabel,
    getTeamTypeLabel
  };
})();