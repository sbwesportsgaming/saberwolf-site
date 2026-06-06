(function () {
  window.SBWProfilesConfig = {
    version: "1.4.3",

    storageKeys: {
      profiles: "sbw_profiles_v1_4_2",
      profileInvites: "sbw_profile_invites_v1_4_2",
      profileHistory: "sbw_profile_history_v1_4_2",
      currentUser: "sbw_current_user_v1_3_9",
      teamMembers: "sbw_team_members_v1_3_9",
      teams: "sbw_teams_v1_3_9"
    },

    routes: {
      profilesList: "perfis.html",
      publicProfile: "perfil.html",
      myProfile: "meu-perfil.html",
      teamsListFromProfiles: "../equipes/equipes.html",
      tournamentsListFromProfiles: "../torneios/torneios.html",
      teamProfileFromProfiles: "../equipes/equipe.html"
    },

    defaults: {
      profileType: "player",
      country: "Brasil",
      state: "",
      city: "",
      avatarUrl: "",
      bannerUrl: "",
      headline: "",
      bio: "",
      mainGames: [],
      roleTags: ["Player"],

      stats: {
        tournamentsPlayed: 0,
        wins: 0,
        podiums: 0,
        titles: 0,
        prizeAmount: 0,
        prizeCurrency: "BRL"
      },

      permissions: {
        canCreateTeam: false,
        canCreateTournament: false,
        isAdmin: false
      }
    },

    profileTypes: [
      {
        id: "player",
        label: "Jogador"
      },
      {
        id: "creator",
        label: "Creator"
      },
      {
        id: "organizer",
        label: "Organizador"
      },
      {
        id: "staff",
        label: "Staff"
      },
      {
        id: "admin",
        label: "Admin"
      }
    ],

    historyTypes: {
      team_join: {
        label: "Entrada em equipe",
        group: "teams"
      },
      team_leave: {
        label: "Saída de equipe",
        group: "teams"
      },
      team_transfer: {
        label: "Transferência",
        group: "teams"
      },
      tournament: {
        label: "Torneio",
        group: "tournaments"
      },
      title: {
        label: "Título",
        group: "titles"
      },
      podium: {
        label: "Pódio",
        group: "podiums"
      },
      prize: {
        label: "Premiação",
        group: "prizes"
      }
    }
  };
})();