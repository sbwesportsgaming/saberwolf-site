(function () {
  const SBW_TEAMS_CONFIG = {
    version: "1.3.9",
    featureName: "Equipes",

    storageMode: "local-demo", 
    // Futuro:
    // "local-demo" = usa dados demo + localStorage
    // "supabase" = usa banco real

    storageKeys: {
      teams: "sbw_teams_v1_3_9",
      teamMembers: "sbw_team_members_v1_3_9",
      teamJoinRequests: "sbw_team_join_requests_v1_3_9",
      currentUser: "sbw_current_user_v1_3_9"
    },

    routes: {
      teamsList: "equipes.html",
      teamProfile: "equipe.html",
      createTeam: "criar-equipe.html",
      myTeam: "minha-equipe.html"
    },

    tagRules: {
      minLength: 2,
      maxLength: 6,
      allowExtendedTag: true,
      extendedMaxLength: 12,
      blockedTags: ["SBW", "SABERWOLF", "ADMIN", "MOD", "STAFF"]
    },

    imageRules: {
      logo: {
        allowedTypes: ["image/png", "image/jpeg", "image/webp"],
        recommendedSize: "512x512",
        maxSizeMB: 2
      },
      banner: {
        allowedTypes: ["image/png", "image/jpeg", "image/webp"],
        recommendedSize: "1600x500 ou 1920x600",
        maxSizeMB: 5
      }
    },

    limits: {
      commonTeamMembers: 50,
      verifiedTeamMembers: 100,
      commonSubteamMembers: 50,
      verifiedSubteamMembers: 100
    },

    verificationStatus: {
      notVerified: "not_verified",
      pending: "pending",
      verified: "verified",
      rejected: "rejected",
      revoked: "revoked"
    },

    teamTypes: {
      mainTeam: "main_team",
      subteam: "subteam"
    },

    memberRoles: {
      captain: "captain",
      viceCaptain: "vice_captain",
      manager: "manager",
      member: "member",
      pending: "pending"
    }
  };

  window.SBW_TEAMS_CONFIG = SBW_TEAMS_CONFIG;
})();