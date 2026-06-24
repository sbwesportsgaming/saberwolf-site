// v1.6.71 — Registro central de formatos competitivos da plataforma -SBW-
(function () {
  "use strict";

  const formats = [
    {
      key: "double-elimination",
      label: "Double Elimination",
      shortLabel: "Double Elimination",
      family: "bracket",
      category: "core",
      status: "active",
      teamMode: "solo",
      description: "Formato FGC com Winners Bracket, Lower Bracket, Grand Final e possível reset.",
      publicNote: "Indicado para torneios eliminatórios de jogadores individuais.",
      flowTitle: "Chave com segunda chance",
      flowDescription: "Jogadores avançam pela Winners Bracket e ainda podem disputar a Lower Bracket antes da eliminação definitiva.",
      features: ["Winners Bracket", "Lower Bracket", "Grand Final", "Reset se necessário"],
      requirements: ["Participantes individuais", "Chave gerada após check-in", "Registro de resultados por partida"],
      roadmap: ["Base funcional disponível", "Refinos futuros de estatísticas e histórico por fase"],
      specs: [
        { label: "Participação", value: "Jogadores individuais" },
        { label: "Estrutura", value: "Chave Winners + Lower" },
        { label: "Progressão", value: "Derrota envia para a Lower; segunda derrota elimina" },
        { label: "Ranking", value: "Colocação final pode pontuar quando o torneio for marcado como pontuável" }
      ],
      capabilities: {
        players: true,
        teams: false,
        brackets: true,
        divisions: false,
        lineups: false,
        publicStandings: true,
        rankingCompatible: true
      }
    },
    {
      key: "groups-playoffs",
      label: "Grupos + Playoffs",
      shortLabel: "Grupos + Playoffs",
      family: "hybrid",
      category: "core",
      status: "active",
      teamMode: "solo",
      description: "Formato com fase de grupos, classificados e chave final.",
      publicNote: "Indicado para eventos com fase classificatória antes dos playoffs.",
      flowTitle: "Classificação antes do mata-mata",
      flowDescription: "Participantes passam por grupos iniciais e os melhores avançam para uma chave decisiva.",
      features: ["Fase de grupos", "Classificados", "Playoffs", "Final"],
      requirements: ["Participantes individuais", "Definição de grupos", "Critérios de classificação", "Playoffs configurados"],
      roadmap: ["Base conceitual disponível", "Automação completa de grupos pode evoluir em etapa própria"],
      specs: [
        { label: "Participação", value: "Jogadores individuais" },
        { label: "Estrutura", value: "Grupos classificatórios + chave final" },
        { label: "Progressão", value: "Melhores de cada grupo avançam para os playoffs" },
        { label: "Ranking", value: "Pontuação por colocação final quando o torneio for pontuável" }
      ],
      capabilities: {
        players: true,
        teams: false,
        brackets: true,
        groups: true,
        divisions: false,
        lineups: false,
        publicStandings: true,
        rankingCompatible: true
      }
    },
    {
      key: "league",
      aliases: ["round-robin", "pontos-corridos"],
      label: "Pontos Corridos / Liga",
      shortLabel: "Liga",
      family: "league",
      category: "core",
      status: "active",
      teamMode: "solo",
      description: "Formato com tabela, rodadas e classificação geral sem chave final obrigatória.",
      publicNote: "Indicado para temporadas longas, ligas e confrontos recorrentes.",
      flowTitle: "Tabela e rodadas contínuas",
      flowDescription: "Participantes acumulam resultados ao longo de rodadas, formando uma classificação geral.",
      features: ["Rodadas", "Tabela geral", "Pontuação acumulada", "Temporada longa"],
      requirements: ["Calendário de rodadas", "Tabela de classificação", "Critérios de desempate", "Encerramento com colocação final validada"],
      roadmap: ["Base conceitual disponível", "Automação completa de rodadas pode evoluir em etapa própria"],
      specs: [
        { label: "Participação", value: "Jogadores individuais ou estrutura customizada pelo organizador" },
        { label: "Estrutura", value: "Rodadas, tabela e classificação acumulada" },
        { label: "Progressão", value: "Pontuação contínua em vez de eliminação direta" },
        { label: "Ranking", value: "Pode alimentar ranking quando houver colocação final validada" }
      ],
      capabilities: {
        players: true,
        teams: false,
        brackets: false,
        leagueTable: true,
        divisions: false,
        lineups: false,
        publicStandings: true,
        rankingCompatible: true
      }
    },
    {
      key: "team-battle-league-4v4",
      label: "Team Battle League 4v4",
      shortLabel: "Team Battle 4v4",
      family: "team-league",
      category: "advanced",
      status: "planned",
      teamMode: "team_4v4",
      implementationKey: "team-battle-league-4v4",
      schemaVersion: "tbleague4v4.v1",
      helperNamespace: "SBWTeamBattleLeague",
      description: "Formato avançado futuro com equipes de 4 jogadores, escalações, confrontos por equipe e suporte a liga básica ou avançada.",
      publicNote: "Planejado para uma etapa futura da plataforma -SBW-. A primeira versão funcional deve priorizar a liga básica com divisão única.",
      flowTitle: "Liga por equipes 4v4",
      flowDescription: "Equipes disputam confrontos com escalações, partidas individuais, pontuação por duelo e playoffs. O modo básico usa uma divisão única; o modo avançado permite várias divisões.",
      features: ["Equipes de 4", "Modo básico com divisão única", "Modo avançado com várias divisões", "Escalações", "Team matches", "Playoffs"],
      requirements: ["Equipes com elenco de 4 jogadores", "Capitão ou responsável por escalação", "Divisão única no modo básico", "Várias divisões no modo avançado", "Rodadas e confrontos por equipe", "Sistema de partida extra em caso de empate"],
      roadmap: ["Priorizar preset básico com divisão única", "Adicionar elenco e escalações", "Adicionar confrontos por equipe", "Adicionar classificação da divisão única", "Expandir para modo avançado com múltiplas divisões e playoffs entre divisões"],
      specs: [
        { label: "Participação", value: "Equipes com elenco de 4 jogadores" },
        { label: "Modo básico", value: "Uma divisão única para simplificar a primeira versão funcional" },
        { label: "Modo avançado", value: "Várias divisões, classificação por divisão e playoffs entre campeões" },
        { label: "Confronto", value: "3 partidas principais, reserva e partida extra em caso de empate" },
        { label: "Pontuação", value: "Modelo planejado por partidas individuais e resultado do confronto" },
        { label: "Status", value: "Base planejada; criação funcional será liberada em etapa própria" }
      ],
      capabilities: {
        players: true,
        teams: true,
        teamSize: 4,
        brackets: true,
        divisions: true,
        basicSingleDivision: true,
        advancedMultiDivision: true,
        lineups: true,
        teamMatches: true,
        mainMatches: 3,
        reservePlayer: true,
        extraMatchOnDraw: true,
        publicStandings: true,
        rankingCompatible: true,
        requiresAdvancedSetup: true,
        defaultLeagueMode: "basic_single_division",
        advancedLeagueMode: "advanced_multi_division"
      }
    }
  ];

  const normalize = (value) => String(value || "").trim().toLowerCase();

  function cloneStringList(values) {
    return Array.isArray(values)
      ? values.map((value) => String(value || "").trim()).filter(Boolean)
      : [];
  }

  function cloneSpecs(specs) {
    return Array.isArray(specs)
      ? specs
          .filter((item) => item && typeof item === "object")
          .map((item) => ({
            label: String(item.label || "").trim(),
            value: String(item.value || "").trim()
          }))
          .filter((item) => item.label && item.value)
      : [];
  }

  function cloneCapabilities(capabilities) {
    return capabilities && typeof capabilities === "object" && !Array.isArray(capabilities)
      ? { ...capabilities }
      : {};
  }

  function list() {
    return formats.map((format) => ({
      ...format,
      features: cloneStringList(format.features),
      requirements: cloneStringList(format.requirements),
      roadmap: cloneStringList(format.roadmap),
      specs: cloneSpecs(format.specs),
      capabilities: cloneCapabilities(format.capabilities)
    }));
  }

  function get(value) {
    const key = normalize(value);
    return formats.find((format) => {
      return normalize(format.key) === key || (Array.isArray(format.aliases) && format.aliases.map(normalize).includes(key));
    }) || null;
  }

  function getLabel(value, fallback = "Formato") {
    const format = get(value);
    return format?.label || String(value || fallback).trim() || fallback;
  }

  function toMetadata(value) {
    const format = get(value);

    if (!format) {
      return {
        key: String(value || "").trim(),
        label: String(value || "Formato").trim(),
        family: "custom",
        category: "custom",
        status: "custom",
        teamMode: "solo",
        requirements: [],
        roadmap: [],
        specs: [],
        capabilities: {}
      };
    }

    return {
      key: format.key,
      label: format.label,
      shortLabel: format.shortLabel || format.label,
      family: format.family,
      category: format.category,
      status: format.status,
      teamMode: format.teamMode,
      implementationKey: format.implementationKey || "",
      schemaVersion: format.schemaVersion || "",
      helperNamespace: format.helperNamespace || "",
      publicNote: format.publicNote || "",
      flowTitle: format.flowTitle || "",
      flowDescription: format.flowDescription || "",
      features: cloneStringList(format.features),
      requirements: cloneStringList(format.requirements),
      roadmap: cloneStringList(format.roadmap),
      specs: cloneSpecs(format.specs),
      capabilities: cloneCapabilities(format.capabilities)
    };
  }

  function isAvailable(value) {
    const format = get(value);
    return Boolean(format && format.status === "active");
  }

  function isPlanned(value) {
    const format = get(value);
    return Boolean(format && format.status === "planned");
  }

  function canCreate(value) {
    return isAvailable(value);
  }

  function getStatusLabel(value) {
    const format = get(value);
    const status = normalize(format?.status || value);

    if (status === "active") return "Disponível";
    if (status === "planned") return "Em preparação";
    if (status === "custom") return "Customizado";

    return "Formato";
  }

  function getCreationBlockReason(value) {
    const format = get(value);

    if (!format) {
      return "Formato não registrado no catálogo competitivo da plataforma -SBW-.";
    }

    if (format.status === "planned") {
      return `${format.label || "Este formato"} está em preparação e ainda não deve ser usado para criação real de torneios.`;
    }

    if (format.status !== "active") {
      return `${format.label || "Este formato"} ainda não está disponível para criação real de torneios.`;
    }

    return "";
  }

  function normalizeKey(value) {
    const format = get(value);
    return format?.key || String(value || "").trim();
  }

  window.SBWTournamentFormats = Object.freeze({
    list,
    get,
    getLabel,
    toMetadata,
    isAvailable,
    isPlanned,
    canCreate,
    getStatusLabel,
    getCreationBlockReason,
    normalizeKey
  });
})();
