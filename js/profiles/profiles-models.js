(function () {
  const config = window.SBWProfilesConfig || {};
  const defaults = config.defaults || {};

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

  function asArray(value) {
    if (Array.isArray(value)) {
      return value;
    }

    if (!value) {
      return [];
    }

    return [value];
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function getDefaultStats() {
    const stats = defaults.stats || {};

    return {
      tournamentsPlayed: Number(stats.tournamentsPlayed || 0),
      wins: Number(stats.wins || 0),
      podiums: Number(stats.podiums || 0),
      titles: Number(stats.titles || 0),
      prizeAmount: Number(stats.prizeAmount || 0),
      prizeCurrency: stats.prizeCurrency || "BRL"
    };
  }

  function normalizeStats(stats) {
    const base = getDefaultStats();
    const safeStats = stats || {};

    return {
      tournamentsPlayed: Number(safeStats.tournamentsPlayed || base.tournamentsPlayed || 0),
      wins: Number(safeStats.wins || base.wins || 0),
      podiums: Number(safeStats.podiums || base.podiums || 0),
      titles: Number(safeStats.titles || base.titles || 0),
      prizeAmount: Number(safeStats.prizeAmount || base.prizeAmount || 0),
      prizeCurrency: safeStats.prizeCurrency || base.prizeCurrency || "BRL"
    };
  }

  function normalizePermissions(permissions) {
    const base = defaults.permissions || {};
    const safePermissions = permissions || {};

    return {
      canCreateTeam: Boolean(safePermissions.canCreateTeam || base.canCreateTeam),
      canCreateTournament: Boolean(safePermissions.canCreateTournament || base.canCreateTournament),
      isAdmin: Boolean(safePermissions.isAdmin || base.isAdmin)
    };
  }

  function normalizeGame(game) {
    if (typeof game === "string") {
      return {
        id: game,
        name: game,
        category: ""
      };
    }

    const safeGame = game || {};
    const id = safeGame.id || safeGame.slug || safeGame.name || "";

    return {
      id: id,
      name: safeGame.name || id || "Jogo",
      category: safeGame.category || safeGame.genre || ""
    };
  }

  function normalizeGames(games) {
    return asArray(games)
      .map(function (game) {
        return normalizeGame(game);
      })
      .filter(function (game) {
        return Boolean(game.id || game.name);
      });
  }

  function normalizeSocialLinks(links) {
    const safeLinks = links || {};

    return {
      twitch: safeLinks.twitch || "",
      youtube: safeLinks.youtube || "",
      instagram: safeLinks.instagram || "",
      twitter: safeLinks.twitter || safeLinks.x || "",
      x: safeLinks.x || safeLinks.twitter || "",
      tiktok: safeLinks.tiktok || "",
      discord: safeLinks.discord || "",
      website: safeLinks.website || ""
    };
  }

  function normalizeProfile(profile) {
    const safeProfile = profile || {};
    const id = safeProfile.id || safeProfile.userId || createId("user");

    return Object.assign({}, safeProfile, {
      id: id,
      userId: safeProfile.userId || id,

      nickname: safeProfile.nickname || "",
      displayName:
        safeProfile.displayName ||
        safeProfile.name ||
        safeProfile.nickname ||
        "Usuário SaberWolf",

      profileType: safeProfile.profileType || defaults.profileType || "player",

      headline: safeProfile.headline || defaults.headline || "",
      bio: safeProfile.bio || defaults.bio || "",

      country: safeProfile.country || defaults.country || "Brasil",
      state: safeProfile.state || defaults.state || "",
      city: safeProfile.city || defaults.city || "",

      avatarUrl: safeProfile.avatarUrl || defaults.avatarUrl || "",
      bannerUrl: safeProfile.bannerUrl || defaults.bannerUrl || "",

      mainGames: normalizeGames(safeProfile.mainGames || defaults.mainGames || []),
      roleTags: asArray(safeProfile.roleTags || defaults.roleTags || ["Player"]),

      socialLinks: normalizeSocialLinks(safeProfile.socialLinks),

      stats: normalizeStats(safeProfile.stats),
      permissions: normalizePermissions(safeProfile.permissions),

      createdAt: safeProfile.createdAt || nowIso(),
      updatedAt: safeProfile.updatedAt || nowIso()
    });
  }

  function normalizeHistoryItem(item) {
    const safeItem = item || {};
    const id = safeItem.id || createId("history");
    const type = safeItem.type || "tournament";

    return Object.assign({}, safeItem, {
      id: id,
      type: type,
      title: safeItem.title || getHistoryTypeLabel(type),
      description: safeItem.description || "",
      date: safeItem.date || String(safeItem.occurredAt || nowIso()).slice(0, 10),
      occurredAt: safeItem.occurredAt || safeItem.createdAt || nowIso(),
      createdAt: safeItem.createdAt || nowIso()
    });
  }

  function normalizeInvite(invite) {
    const safeInvite = invite || {};

    return Object.assign(
      {
        id: createId("invite"),
        status: "pending",
        role: "member",
        functionName: "Player",
        createdAt: nowIso(),
        updatedAt: nowIso()
      },
      safeInvite
    );
  }

  function getProfileTypeLabel(type) {
    const profileTypes = Array.isArray(config.profileTypes) ? config.profileTypes : [];
    const found = profileTypes.find(function (item) {
      return item.id === type;
    });

    if (found && found.label) {
      return found.label;
    }

    const labels = {
      player: "Jogador",
      creator: "Creator",
      organizer: "Organizador",
      staff: "Staff",
      admin: "Admin"
    };

    return labels[type] || "Perfil";
  }

  function getHistoryTypeConfig(type) {
    const historyTypes = config.historyTypes || {};

    return historyTypes[type] || {
      label: "Histórico",
      group: "general"
    };
  }

  function getHistoryTypeLabel(type) {
    return getHistoryTypeConfig(type).label || "Histórico";
  }

  function getHistoryTypeGroup(type) {
    return getHistoryTypeConfig(type).group || "general";
  }

  function formatDate(value) {
    if (!value) {
      return "Data não informada";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return String(value);
    }

    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  }

  function formatCurrency(amount, currency) {
    const safeAmount = Number(amount || 0);
    const safeCurrency = currency || "BRL";

    if (safeCurrency === "BRL") {
      return safeAmount.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
      });
    }

    return safeAmount + " " + safeCurrency;
  }

  function getProfilePublicUrl(profileId) {
    return "perfil.html?id=" + encodeURIComponent(profileId || "");
  }

  function getTeamPublicUrl(teamId) {
    return "../equipes/equipe.html?id=" + encodeURIComponent(teamId || "");
  }

  window.SBWProfilesModels = {
    nowIso: nowIso,
    createId: createId,
    clone: clone,
    asArray: asArray,

    getDefaultStats: getDefaultStats,
    normalizeStats: normalizeStats,
    normalizePermissions: normalizePermissions,
    normalizeGame: normalizeGame,
    normalizeGames: normalizeGames,
    normalizeSocialLinks: normalizeSocialLinks,
    normalizeProfile: normalizeProfile,
    normalizeHistoryItem: normalizeHistoryItem,
    normalizeInvite: normalizeInvite,

    getProfileTypeLabel: getProfileTypeLabel,
    getHistoryTypeConfig: getHistoryTypeConfig,
    getHistoryTypeLabel: getHistoryTypeLabel,
    getHistoryTypeGroup: getHistoryTypeGroup,

    formatDate: formatDate,
    formatCurrency: formatCurrency,

    getProfilePublicUrl: getProfilePublicUrl,
    getTeamPublicUrl: getTeamPublicUrl
  };
})();