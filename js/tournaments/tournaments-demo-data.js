const SBW_DEMO_TOURNAMENTS = [
  {
    id: "demo-groups-playoffs-sf6",
    name: "SBW Groups Clash Demo",
    game: "Street Fighter 6",
    platform: "PC / Crossplay",
    format: "groups-playoffs",
    matchFormat: "MD3",
    status: "open",
    organizer: "SaberWolf",
    maxParticipants: 64,
    startDate: "2026-06-20",
    startTime: "19:00",
    checkInTime: "18:30",
    prize: "A definir",
    description: "Demonstração pública de torneio com fase de grupos, playoffs, final geral e disputa de terceiro lugar.",
    rules: "Regras demonstrativas. O organizador poderá definir regras oficiais, formato das partidas, check-in e critérios de desempate.",
    participants: [
      { id: "demo-p1", nickname: "SBW EliTz", team: "SaberWolf", checkedIn: true },
      { id: "demo-p2", nickname: "Player Alpha", team: "Equipe Alpha", checkedIn: true },
      { id: "demo-p3", nickname: "Player Bravo", team: "Sem equipe", checkedIn: true },
      { id: "demo-p4", nickname: "Player Omega", team: "Comunidade FGC", checkedIn: true }
    ],
    structure: {
      groups: [
        {
          name: "Grupo A",
          standings: [
            { id: "demo-p1", nickname: "SBW EliTz", points: 9, wins: 3, losses: 0 },
            { id: "demo-p2", nickname: "Player Alpha", points: 6, wins: 2, losses: 1 }
          ],
          rounds: [
            {
              name: "Rodada 1",
              matches: [
                {
                  id: "demo-ga-r1-m1",
                  playerA: { id: "demo-p1", nickname: "SBW EliTz" },
                  playerB: { id: "demo-p2", nickname: "Player Alpha" },
                  scoreA: 2,
                  scoreB: 1,
                  winnerId: "demo-p1",
                  status: "completed"
                }
              ]
            }
          ]
        },
        {
          name: "Grupo B",
          standings: [
            { id: "demo-p4", nickname: "Player Omega", points: 9, wins: 3, losses: 0 },
            { id: "demo-p3", nickname: "Player Bravo", points: 6, wins: 2, losses: 1 }
          ],
          rounds: [
            {
              name: "Rodada 1",
              matches: [
                {
                  id: "demo-gb-r1-m1",
                  playerA: { id: "demo-p4", nickname: "Player Omega" },
                  playerB: { id: "demo-p3", nickname: "Player Bravo" },
                  scoreA: 2,
                  scoreB: 0,
                  winnerId: "demo-p4",
                  status: "completed"
                }
              ]
            }
          ]
        }
      ],
      playoffs: {
        rounds: [
          {
            name: "Semifinal",
            matches: [
              {
                playerA: { id: "demo-p1", nickname: "SBW EliTz" },
                playerB: { id: "demo-p3", nickname: "Player Bravo" },
                scoreA: 2,
                scoreB: 1,
                winnerId: "demo-p1",
                status: "completed"
              },
              {
                playerA: { id: "demo-p4", nickname: "Player Omega" },
                playerB: { id: "demo-p2", nickname: "Player Alpha" },
                scoreA: 2,
                scoreB: 0,
                winnerId: "demo-p4",
                status: "completed"
              }
            ]
          },
          {
            name: "Final Geral",
            matches: [
              {
                playerA: { id: "demo-p1", nickname: "SBW EliTz" },
                playerB: { id: "demo-p4", nickname: "Player Omega" },
                scoreA: null,
                scoreB: null,
                winnerId: null,
                status: "pending"
              }
            ]
          }
        ]
      }
    }
  },

  {
    id: "demo-league-fgc",
    name: "Liga SaberWolf FGC",
    game: "Street Fighter 6",
    platform: "PC / Crossplay",
    format: "league",
    matchFormat: "MD3",
    status: "running",
    organizer: "SaberWolf",
    maxParticipants: 16,
    startDate: "2026-06-28",
    startTime: "20:00",
    checkInTime: "19:30",
    prize: "Premiação simbólica",
    description: "Demonstração de liga/pontos corridos, com tabela geral, rodadas e campeão por pontuação.",
    rules: "Vitória vale 3 pontos. Derrota vale 0. Desempates por pontos, saldo de sets, vitórias e sets vencidos.",
    participants: [
      { id: "league-p1", nickname: "Player A", team: "SBW", checkedIn: true },
      { id: "league-p2", nickname: "Player B", team: "FGC Minas", checkedIn: true },
      { id: "league-p3", nickname: "Player C", team: "Sem equipe", checkedIn: true }
    ],
    structure: {
      league: {
        standings: [
          { id: "league-p1", nickname: "Player A", wins: 4, losses: 0, points: 12, scoreDiff: 7 },
          { id: "league-p2", nickname: "Player B", wins: 3, losses: 1, points: 9, scoreDiff: 4 },
          { id: "league-p3", nickname: "Player C", wins: 1, losses: 3, points: 3, scoreDiff: -2 }
        ]
      }
    }
  },

  {
    id: "demo-double-elimination",
    name: "SBW FGC Double Elimination",
    game: "Street Fighter 6",
    platform: "PC / Crossplay",
    format: "double-elimination",
    matchFormat: "MD3",
    status: "draft",
    organizer: "SaberWolf",
    maxParticipants: 32,
    startDate: "2026-07-05",
    startTime: "18:00",
    checkInTime: "17:30",
    prize: "A definir",
    description: "Demonstração preparada para o formato tradicional de jogos de luta com Winners, Losers e Grand Final.",
    rules: "Formato em evolução. A estrutura Double Elimination será refinada nas próximas etapas.",
    participants: []
  }
];