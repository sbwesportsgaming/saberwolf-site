(function () {
  const SBW_TEAMS_DEMO_DATA = {
    teams: [
      {
        id: "team-sbw-fgc",
        name: "SaberWolf FGC",
        tag: "SBW",
        slug: "saberwolf-fgc",
        teamType: "main_team",
        parentTeamId: null,

        description:
          "Equipe competitiva focada em Fighting Games dentro do ecossistema SaberWolf.",

        logoUrl: "img/sbw-logo-demo.png",
        bannerUrl: "img/sbw-team-banner-demo.jpg",

        theme: {
          primaryColor: "#00e5ff",
          secondaryColor: "#7c3cff",
          accentColor: "#ffffff",
          backgroundMode: "dark",
          source: "demo"
        },

        verificationStatus: "verified",
        verificationType: "main_team",
        memberLimit: 100,

        captainUserId: "user-lobo-prime",
        captainName: "Lobo Prime",

        games: [
          {
            id: "sf6",
            name: "Street Fighter 6",
            category: "Fighting Games",
            active: true
          },
          {
            id: "fatal-fury",
            name: "Fatal Fury",
            category: "Fighting Games",
            active: true
          },
          {
            id: "tekken-8",
            name: "Tekken 8",
            category: "Fighting Games",
            active: false
          }
        ],

        socialLinks: {
          discord: "https://discord.gg/saberwolf",
          x: "",
          instagram: "",
          youtube: ""
        },

        stats: {
          tournamentsPlayed: 12,
          titles: 4,
          podiums: 9,
          prizeAmount: 650,
          prizeCurrency: "BRL"
        },

        createdAt: "2026-05-31T00:00:00.000Z",
        updatedAt: "2026-05-31T00:00:00.000Z"
      },

      {
        id: "team-sbw-academy",
        name: "SaberWolf Academy",
        tag: "SBWA",
        slug: "saberwolf-academy",
        teamType: "subteam",
        parentTeamId: "team-sbw-fgc",

        description:
          "Subequipe oficial voltada para desenvolvimento de novos talentos competitivos.",

        logoUrl: "img/sbw-logo-demo.png",
        bannerUrl: "img/sbw-academy-banner-demo.jpg",

        theme: {
          primaryColor: "#7c3cff",
          secondaryColor: "#00e5ff",
          accentColor: "#ffffff",
          backgroundMode: "dark",
          source: "demo"
        },

        verificationStatus: "not_verified",
        verificationType: "subteam",
        memberLimit: 50,

        captainUserId: "user-lobo-prime",
        captainName: "Lobo Prime",

        games: [
          {
            id: "sf6",
            name: "Street Fighter 6",
            category: "Fighting Games",
            active: true
          }
        ],

        socialLinks: {
          discord: "https://discord.gg/saberwolf",
          x: "",
          instagram: "",
          youtube: ""
        },

        stats: {
          tournamentsPlayed: 3,
          titles: 1,
          podiums: 2,
          prizeAmount: 150,
          prizeCurrency: "BRL"
        },

        createdAt: "2026-05-31T00:00:00.000Z",
        updatedAt: "2026-05-31T00:00:00.000Z"
      }
    ],

    members: [
      {
        id: "member-1",
        teamId: "team-sbw-fgc",
        userId: "user-lobo-prime",
        nickname: "Lobo Prime",
        displayName: "SBW | Lobo Prime",
        role: "captain",
        games: ["sf6", "fatal-fury"],
        status: "active",
        joinedAt: "2026-05-31T00:00:00.000Z"
      },
      {
        id: "member-2",
        teamId: "team-sbw-fgc",
        userId: "user-akira",
        nickname: "Akira",
        displayName: "SBW | Akira",
        role: "vice_captain",
        games: ["sf6"],
        status: "active",
        joinedAt: "2026-05-31T00:00:00.000Z"
      },
      {
        id: "member-3",
        teamId: "team-sbw-fgc",
        userId: "user-neo",
        nickname: "NeoWolf",
        displayName: "SBW | NeoWolf",
        role: "member",
        games: ["fatal-fury"],
        status: "active",
        joinedAt: "2026-05-31T00:00:00.000Z"
      },
      {
        id: "member-4",
        teamId: "team-sbw-academy",
        userId: "user-ragna",
        nickname: "Ragna",
        displayName: "SBWA | Ragna",
        role: "vice_captain",
        games: ["sf6"],
        status: "active",
        joinedAt: "2026-05-31T00:00:00.000Z"
      }
    ]
  };

  window.SBW_TEAMS_DEMO_DATA = SBW_TEAMS_DEMO_DATA;
})();