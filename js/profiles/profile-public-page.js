(function () {
  const models = window.SBWProfilesModels || {};

  function getStorage() {
    return window.SBWProfilesStorage || null;
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function getRoot() {
    return document.querySelector("[data-profile-public-root]");
  }

  function getUrlParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
  }

  function looksLikeInternalProfileCode(value) {
    const raw = String(value || "").trim().toLowerCase();

    if (!raw) {
      return false;
    }

    return /^sbw-[a-z0-9]{4,}/.test(raw) || /^user-[a-z0-9]{4,}/.test(raw) || /^[0-9a-f]{8}-[0-9a-f-]{20,}$/i.test(raw);
  }

  function getPublicHandle(profile) {
    const candidates = [profile?.nickname, profile?.username, profile?.slug]
      .map(function (item) {
        return String(item || "").trim();
      })
      .filter(Boolean);

    const handle = candidates.find(function (item) {
      return !looksLikeInternalProfileCode(item);
    });

    return handle || "";
  }

  function getPublicDisplayName(profile) {
    const candidates = [profile?.displayName, profile?.display_name, profile?.nickname, profile?.username]
      .map(function (item) {
        return String(item || "").trim();
      })
      .filter(Boolean);

    const name = candidates.find(function (item) {
      return !looksLikeInternalProfileCode(item);
    });

    return name || "Perfil -SBW-";
  }


  function getProfileIdFromUrl() {
    return getUrlParam("id") || getUrlParam("userId") || "";
  }

  function formatDate(value) {
    if (typeof models.formatDate === "function") {
      return models.formatDate(value);
    }

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
    if (typeof models.formatCurrency === "function") {
      return models.formatCurrency(amount, currency);
    }

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

  function getProfileTypeLabel(type) {
    if (typeof models.getProfileTypeLabel === "function") {
      return models.getProfileTypeLabel(type);
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

  function getHistoryTypeLabel(type) {
    if (typeof models.getHistoryTypeLabel === "function") {
      return models.getHistoryTypeLabel(type);
    }

    const labels = {
      team_join: "Entrada em equipe",
      team_leave: "Saída de equipe",
      team_transfer: "Transferência",
      tournament: "Torneio",
      title: "Título",
      podium: "Pódio",
      prize: "Premiação",
      platform: "Plataforma"
    };

    return labels[type] || "Histórico";
  }

  function getInitials(profile) {
    return String(profile.nickname || profile.displayName || "?")
      .slice(0, 2)
      .toUpperCase();
  }

  function getTeamInitials(team) {
    return String(team.teamTag || team.tag || team.teamName || team.name || "SBW")
      .slice(0, 3)
      .toUpperCase();
  }

  function getProfileAvatar(profile) {
    if (profile.avatarUrl) {
      return `
        <img src="${escapeHtml(profile.avatarUrl)}" alt="${escapeHtml(profile.displayName || profile.nickname || "Avatar")}" />
      `;
    }

    return escapeHtml(getInitials(profile));
  }

  function getTeamLogo(team) {
    const logoUrl = team.teamLogoUrl || team.logoUrl || "";

    if (logoUrl) {
      return `
        <img src="${escapeHtml(logoUrl)}" alt="${escapeHtml(team.teamName || team.name || "Equipe")}" />
      `;
    }

    return escapeHtml(getTeamInitials(team));
  }

  function getBannerStyle(profile) {
    if (!profile.bannerUrl) {
      return "";
    }

    return `
      style="background-image:
        linear-gradient(135deg, rgba(5, 11, 22, 0.18), rgba(5, 11, 22, 0.92)),
        url('${escapeHtml(profile.bannerUrl)}');"
    `;
  }

  function getGames(profile) {
    return Array.isArray(profile.mainGames) ? profile.mainGames : [];
  }

  function getTags(profile) {
    return Array.isArray(profile.roleTags) ? profile.roleTags : [];
  }

  function getStats(profile) {
    return profile.stats || {
      tournamentsPlayed: 0,
      wins: 0,
      podiums: 0,
      titles: 0,
      prizeAmount: 0,
      prizeCurrency: "BRL"
    };
  }

  function getProfileId(profile) {
    return profile.userId || profile.id || profile.slug || profile.username || "";
  }

  function mergeProfileStats(baseStats, generatedStats) {
    const base = baseStats || {};
    const generated = generatedStats || {};

    return {
      tournamentsPlayed: Math.max(Number(base.tournamentsPlayed || 0), Number(generated.tournamentsPlayed || 0)),
      wins: Math.max(Number(base.wins || 0), Number(generated.wins || 0)),
      podiums: Math.max(Number(base.podiums || 0), Number(generated.podiums || 0)),
      titles: Math.max(Number(base.titles || 0), Number(generated.titles || 0)),
      prizeAmount: Math.max(Number(base.prizeAmount || 0), Number(generated.prizeAmount || 0)),
      prizeCurrency: base.prizeCurrency || generated.prizeCurrency || "BRL"
    };
  }

  async function getCompetitiveSnapshot(profile) {
    const storage = getStorage();

    if (!storage || typeof storage.getCompetitiveProfileSnapshotAsync !== "function") {
      return { history: [], medals: [], stats: {} };
    }

    try {
      return await storage.getCompetitiveProfileSnapshotAsync(profile);
    } catch (error) {
      console.warn("[SaberWolf Profiles] Não foi possível carregar histórico competitivo:", error);
      return { history: [], medals: [], stats: {}, error };
    }
  }

  function mergeByIdOrSignature(items, signatureFactory) {
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

  function getTeamsFromProfile(profile) {
    if (Array.isArray(profile.currentTeams) && profile.currentTeams.length > 0) {
      return profile.currentTeams;
    }

    if (profile.currentTeam && typeof profile.currentTeam === "object") {
      return [profile.currentTeam];
    }

    return [];
  }

    function publicProfileTeamLooksReal(team) {
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

  async function getCurrentTeams(profile) {
    const storage = getStorage();
    const userId = getProfileId(profile);

    if (storage && typeof storage.getCurrentTeamsByUserIdAsync === "function") {
      try {
        const supabaseTeams = await storage.getCurrentTeamsByUserIdAsync(userId);

        if (Array.isArray(supabaseTeams) && supabaseTeams.length > 0) {
          return supabaseTeams;
        }
      } catch (error) {
        console.warn("[SaberWolf Profiles] Erro ao buscar equipes async:", error);
      }
    }

    const directTeams = getTeamsFromProfile(profile).filter(publicProfileTeamLooksReal);

    if (directTeams.length > 0) {
      return directTeams;
    }

    if (storage && typeof storage.getCurrentTeamsByUserId === "function") {
      return storage.getCurrentTeamsByUserId(userId) || [];
    }

    return [];
  }

  function getHistoryFromProfile(profile) {
    const historyItems = [];

    if (profile.careerHistory && Array.isArray(profile.careerHistory.teams)) {
      profile.careerHistory.teams.forEach(function (item) {
        historyItems.push({
          type: item.type || "team_join",
          title: item.title || "Histórico de equipe",
          description: item.description || "",
          teamName: item.teamName || item.name || "",
          fromTeamName: item.fromTeamName || "",
          toTeamName: item.toTeamName || item.teamName || item.name || "",
          occurredAt: item.occurredAt || item.joinedAt || item.date || item.createdAt || "",
          date: item.date || item.joinedAt || ""
        });
      });
    }

    if (profile.tournamentHistory && Array.isArray(profile.tournamentHistory.events)) {
      profile.tournamentHistory.events.forEach(function (item) {
        historyItems.push({
          type: item.type || "tournament",
          title: item.title || item.tournamentName || "Torneio",
          description: item.description || item.gameName || "",
          tournamentName: item.tournamentName || item.title || "",
          gameName: item.gameName || "",
          occurredAt: item.occurredAt || item.date || item.createdAt || "",
          date: item.date || ""
        });
      });
    }

    if (Array.isArray(profile.achievements)) {
      profile.achievements.forEach(function (item) {
        historyItems.push({
          type: item.type || "title",
          title: item.title || "Conquista",
          description: item.description || "",
          occurredAt: item.occurredAt || item.date || item.createdAt || "",
          date: item.date || ""
        });
      });
    }

    return historyItems;
  }

  function getHistory(profile) {
    const directHistory = getHistoryFromProfile(profile);

    if (directHistory.length > 0) {
      return directHistory;
    }

       function getProfileMedals(profile) {
    const storage = getStorage();

    if (!storage || typeof storage.getProfileMedalsByUserId !== "function") {
      return [];
    }

    return storage.getProfileMedalsByUserId(getProfileId(profile)) || [];
  }

  function getFeaturedProfileMedals(profile) {
    const storage = getStorage();

    if (!storage || typeof storage.getFeaturedProfileMedalsByUserId !== "function") {
      return [];
    }

    return storage.getFeaturedProfileMedalsByUserId(getProfileId(profile)) || [];
  }

  function getProfileMedalSummary(profile) {
    const storage = getStorage();

    if (!storage || typeof storage.getProfileMedalSummaryByUserId !== "function") {
      return {
        total: 0,
        gold: 0,
        silver: 0,
        bronze: 0,
        top8: 0,
        points: 0,
        prizeAmount: 0
      };
    }

    return storage.getProfileMedalSummaryByUserId(getProfileId(profile));
  }

  function renderFeaturedMedals(profile) {
    const medals = getFeaturedProfileMedals(profile);

    if (!medals.length) {
      return "";
    }

    return `
      <div class="sbw-profile-featured-medals" title="Medalhas em destaque">
        ${medals
          .map(function (medal) {
            return `
              <span class="sbw-profile-featured-medal sbw-medal-${escapeHtml(medal.medalType)}" title="${escapeHtml(medal.title)}">
                ${escapeHtml(medal.medalIcon)}
              </span>
            `;
          })
          .join("")}
      </div>
    `;
  }

  function renderMedalCard(medal) {
    return `
      <article class="sbw-profile-medal-card sbw-medal-card-${escapeHtml(medal.medalType)}">
        <div class="sbw-profile-medal-icon">
          ${escapeHtml(medal.medalIcon)}
        </div>

        <div class="sbw-profile-medal-content">
          <div class="sbw-profile-medal-top">
            <span>${escapeHtml(medal.medalLabel)}</span>
            <b>${escapeHtml(medal.season || "2026")}</b>
          </div>

          <h3>${escapeHtml(medal.title)}</h3>

          <p>${escapeHtml(medal.description || "Conquista registrada na plataforma SaberWolf.")}</p>

          <div class="sbw-profile-medal-meta">
            <span>${escapeHtml(medal.game || "Jogo não informado")}</span>
            <span>${escapeHtml(medal.tournamentName || "Torneio")}</span>
            <span>${escapeHtml(medal.organizerName || "Organizador")}</span>
          </div>

          <div class="sbw-profile-medal-footer">
            <span>#${Number(medal.placement || 0)} colocado</span>
            <span>${Number(medal.points || 0)} pts</span>
          </div>
        </div>
      </article>
    `;
  }

  function renderMedalsSection(profile) {
    const medals = getProfileMedals(profile);
    const summary = getProfileMedalSummary(profile);

    return `
      <section class="sbw-profile-card sbw-profile-medals-card">
        <div class="sbw-profile-card-header">
          <div>
            <span>Conquistas</span>
            <h2>Medalhas</h2>
          </div>
        </div>

        <div class="sbw-profile-medal-summary">
          <div>
            <strong>${Number(summary.gold || 0)}</strong>
            <span>Ouro</span>
          </div>

          <div>
            <strong>${Number(summary.silver || 0)}</strong>
            <span>Prata</span>
          </div>

          <div>
            <strong>${Number(summary.bronze || 0)}</strong>
            <span>Bronze</span>
          </div>

          <div>
            <strong>${Number(summary.top8 || 0)}</strong>
            <span>Top 8</span>
          </div>

          <div>
            <strong>${Number(summary.points || 0)}</strong>
            <span>Pontos</span>
          </div>
        </div>

        ${
          medals.length
            ? `
              <div class="sbw-profile-medal-list">
                ${medals.map(renderMedalCard).join("")}
              </div>
            `
            : `
              <div class="sbw-empty-state">
                Nenhuma medalha registrada ainda.
              </div>
            `
        }
      </section>
    `;
  }

    const storage = getStorage();

    if (!storage || typeof storage.getHistoryByUserId !== "function") {
      return [];
    }

    return storage.getHistoryByUserId(getProfileId(profile)) || [];
  }

  function renderError(message) {
    const root = getRoot();

    if (!root) {
      return;
    }

    if (window.SBWPageState?.renderError) {
      window.SBWPageState.renderError(root, {
        title: "Não foi possível carregar o perfil",
        message: message || "Atualize a página e tente novamente."
      });
      return;
    }

    root.innerHTML = `
      <div class="sbw-empty-state">
        ${escapeHtml(message)}
      </div>
    `;
  }

  function renderLoading() {
    const root = getRoot();

    if (!root) {
      return;
    }

    if (window.SBWPageState?.renderLoading) {
      window.SBWPageState.renderLoading(root, {
        title: "Carregando perfil",
        message: "Buscando dados públicos, equipe atual e histórico competitivo.",
        rows: 6
      });
      return;
    }

    root.innerHTML = `
      <div class="sbw-empty-state">
        Carregando perfil...
      </div>
    `;
  }

    /* =========================================================
     SaberWolf v1.5.3/v1.5.9.0 - Medalhas no Perfil Público
     Agora combina medalhas locais com conquistas geradas de torneios finalizados.
     ========================================================= */

  function getProfileMedals(profile, competitiveSnapshot) {
    const storage = getStorage();
    const localMedals = storage && typeof storage.getProfileMedalsByUserId === "function"
      ? storage.getProfileMedalsByUserId(getProfileId(profile)) || []
      : [];
    const generatedMedals = competitiveSnapshot && Array.isArray(competitiveSnapshot.medals)
      ? competitiveSnapshot.medals
      : [];

    if (storage && typeof storage.mergeProfileMedalLists === "function") {
      return storage.mergeProfileMedalLists(localMedals, generatedMedals);
    }

    return mergeByIdOrSignature(
      [].concat(generatedMedals, localMedals),
      function (medal) {
        return [medal.userId, medal.medalType, medal.tournamentId || medal.tournamentName, medal.placement || ""].join(":");
      }
    );
  }

  function getFeaturedProfileMedals(profile, competitiveSnapshot) {
    return getProfileMedals(profile, competitiveSnapshot)
      .filter(function (medal) {
        return medal.featured;
      })
      .slice(0, 4);
  }

  function getProfileMedalSummary(profile, competitiveSnapshot) {
    const medals = getProfileMedals(profile, competitiveSnapshot);

    return {
      total: medals.length,
      gold: medals.filter(function (medal) { return medal.medalType === "gold"; }).length,
      silver: medals.filter(function (medal) { return medal.medalType === "silver"; }).length,
      bronze: medals.filter(function (medal) { return medal.medalType === "bronze"; }).length,
      top8: medals.filter(function (medal) { return medal.medalType === "top8"; }).length,
      points: medals.reduce(function (total, medal) { return total + Number(medal.points || 0); }, 0),
      prizeAmount: medals.reduce(function (total, medal) { return total + Number(medal.prizeAmount || 0); }, 0)
    };
  }

  function renderFeaturedMedals(profile, competitiveSnapshot) {
    const medals = getFeaturedProfileMedals(profile, competitiveSnapshot);

    if (!medals.length) {
      return "";
    }

    return `
      <div class="sbw-profile-featured-medals" title="Medalhas em destaque">
        ${medals
          .map(function (medal) {
            return `
              <span class="sbw-profile-featured-medal sbw-medal-${escapeHtml(medal.medalType)}" title="${escapeHtml(medal.title)}">
                ${escapeHtml(medal.medalIcon)}
              </span>
            `;
          })
          .join("")}
      </div>
    `;
  }

  function renderMedalCard(medal) {
    return `
      <article class="sbw-profile-medal-card sbw-medal-card-${escapeHtml(medal.medalType)}">
        <div class="sbw-profile-medal-icon">
          ${escapeHtml(medal.medalIcon)}
        </div>

        <div class="sbw-profile-medal-content">
          <div class="sbw-profile-medal-top">
            <span>${escapeHtml(medal.medalLabel)}</span>
            <b>${escapeHtml(medal.season || "2026")}</b>
          </div>

          <h3>${escapeHtml(medal.title)}</h3>

          <p>${escapeHtml(medal.description || "Conquista registrada na plataforma SaberWolf.")}</p>

          <div class="sbw-profile-medal-meta">
            <span>${escapeHtml(medal.game || "Jogo não informado")}</span>
            <span>${escapeHtml(medal.tournamentName || "Torneio")}</span>
            <span>${escapeHtml(medal.organizerName || "Organizador")}</span>
          </div>

          <div class="sbw-profile-medal-footer">
            <span>#${Number(medal.placement || 0)} colocado</span>
            <span>${Number(medal.points || 0)} pts</span>
          </div>
        </div>
      </article>
    `;
  }

  function renderMedalsSection(profile, competitiveSnapshot) {
    const medals = getProfileMedals(profile, competitiveSnapshot);
    const summary = getProfileMedalSummary(profile, competitiveSnapshot);
    const hasGeneratedMedals = medals.some(function (medal) {
      return medal.source === "supabase-final-results";
    });

    return `
      <section class="sbw-profile-card sbw-profile-medals-card">
        <div class="sbw-profile-card-header">
          <div>
            <span>Conquistas</span>
            <h2>Medalhas</h2>
          </div>
        </div>

        ${hasGeneratedMedals ? `
          <p class="sbw-profile-public-text">
            Inclui conquistas geradas automaticamente a partir de torneios finalizados na plataforma.
          </p>
        ` : ""}

        <div class="sbw-profile-medal-summary">
          <div>
            <strong>${Number(summary.gold || 0)}</strong>
            <span>Ouro</span>
          </div>

          <div>
            <strong>${Number(summary.silver || 0)}</strong>
            <span>Prata</span>
          </div>

          <div>
            <strong>${Number(summary.bronze || 0)}</strong>
            <span>Bronze</span>
          </div>

          <div>
            <strong>${Number(summary.top8 || 0)}</strong>
            <span>Top 8</span>
          </div>

          <div>
            <strong>${Number(summary.points || 0)}</strong>
            <span>Pontos</span>
          </div>
        </div>

        ${
          medals.length
            ? `
              <div class="sbw-profile-medal-list">
                ${medals.map(renderMedalCard).join("")}
              </div>
            `
            : `
              <div class="sbw-empty-state">
                Nenhuma medalha registrada ainda.
              </div>
            `
        }
      </section>
    `;
  }

    /* =========================================================
     SaberWolf v1.5.4 - Status público do jogador
     ========================================================= */

  function getPlayerStatus(profile) {
    const storage = getStorage();

    if (!storage || typeof storage.getPlayerStatusByUserId !== "function") {
      return null;
    }

    return storage.getPlayerStatusByUserId(getProfileId(profile));
  }

  function renderPlayerStatusBadge(profile) {
    const status = getPlayerStatus(profile);

    if (!status) {
      return "";
    }

    return `
      <div class="sbw-profile-player-status sbw-player-status-${escapeHtml(status.status)}">
        <span>${escapeHtml(status.label)}</span>
      </div>
    `;
  }

  function renderPlayerStatusSection(profile) {
    const status = getPlayerStatus(profile);

    if (!status) {
      return "";
    }

    const preferredGames = Array.isArray(status.preferredGames) ? status.preferredGames : [];
    const lookingFor = Array.isArray(status.lookingFor) ? status.lookingFor : [];
    const preferredRoles = Array.isArray(status.preferredRoles) ? status.preferredRoles : [];

    return `
      <section class="sbw-profile-card sbw-profile-status-card">
        <div class="sbw-profile-card-header">
          <div>
            <span>Status público</span>
            <h2>${escapeHtml(status.label)}</h2>
          </div>
        </div>

        <p>${escapeHtml(status.availabilityText || status.description || "")}</p>

        ${
          preferredGames.length
            ? `
              <div class="sbw-profile-status-group">
                <strong>Jogos de interesse</strong>
                <div>
                  ${preferredGames
                    .map(function (game) {
                      return `<span>${escapeHtml(game)}</span>`;
                    })
                    .join("")}
                </div>
              </div>
            `
            : ""
        }

        ${
          lookingFor.length
            ? `
              <div class="sbw-profile-status-group">
                <strong>Buscando</strong>
                <div>
                  ${lookingFor
                    .map(function (item) {
                      return `<span>${escapeHtml(item)}</span>`;
                    })
                    .join("")}
                </div>
              </div>
            `
            : ""
        }

        ${
          preferredRoles.length
            ? `
              <div class="sbw-profile-status-group">
                <strong>Funções</strong>
                <div>
                  ${preferredRoles
                    .map(function (role) {
                      return `<span>${escapeHtml(role)}</span>`;
                    })
                    .join("")}
                </div>
              </div>
            `
            : ""
        }
      </section>
    `;
  }

  function renderProfileHero(profile, competitiveSnapshot) {
    const stats = mergeProfileStats(getStats(profile), competitiveSnapshot ? competitiveSnapshot.stats : null);

    return `
      <section class="sbw-profile-public-hero" ${getBannerStyle(profile)}>
        <div class="sbw-profile-public-avatar">
          ${getProfileAvatar(profile)}
        </div>

        <div class="sbw-profile-public-main">
          <span class="sbw-profile-public-kicker">
            ${escapeHtml(getProfileTypeLabel(profile.profileType))}
            ${
              profile.isVerified || profile.is_verified
                ? " · Verificado"
                : ""
            }
          </span>

          <div class="sbw-profile-name-row">
           <h1>${escapeHtml(getPublicDisplayName(profile))}</h1>
              ${renderFeaturedMedals(profile, competitiveSnapshot)}
              ${renderPlayerStatusBadge(profile)}
          </div>

          ${getPublicHandle(profile) ? `
            <p class="sbw-profile-public-nickname">
              @${escapeHtml(getPublicHandle(profile))}
            </p>
          ` : ""}

          <p class="sbw-profile-public-headline">
            ${escapeHtml(profile.headline || profile.bio || "Perfil público da plataforma -SBW-.")}
          </p>

          <div class="sbw-profile-public-tags">
            ${
              getTags(profile).length
                ? getTags(profile)
                    .map(function (tag) {
                      return `<span>${escapeHtml(tag)}</span>`;
                    })
                    .join("")
                : `<span>Player</span>`
            }

            ${
              profile.isVerified
                ? `<span>Verificado</span>`
                : ""
            }
          </div>
        </div>

        <div class="sbw-profile-public-stats">
          <div>
            <strong>${Number(stats.tournamentsPlayed || 0)}</strong>
            <span>Torneios</span>
          </div>

          <div>
            <strong>${Number(stats.titles || 0)}</strong>
            <span>Títulos</span>
          </div>

          <div>
            <strong>${Number(stats.podiums || 0)}</strong>
            <span>Pódios</span>
          </div>

          <div>
            <strong>${formatCurrency(stats.prizeAmount, stats.prizeCurrency)}</strong>
            <span>Premiação</span>
          </div>
        </div>
      </section>
    `;
  }

  function renderBioSection(profile) {
    return `
      <section class="sbw-profile-card">
        <div class="sbw-profile-card-header">
          <div>
            <span>Sobre</span>
            <h2>Bio do perfil</h2>
          </div>
        </div>

        <p class="sbw-profile-public-text">
          ${escapeHtml(profile.bio || "Este usuário ainda não cadastrou uma bio pública.")}
        </p>

        <div class="sbw-profile-public-location">
          <span>${escapeHtml(profile.country || "Brasil")}</span>
          ${
            profile.state
              ? `<span>${escapeHtml(profile.state)}</span>`
              : ""
          }
          ${
            profile.city
              ? `<span>${escapeHtml(profile.city)}</span>`
              : ""
          }
        </div>
      </section>
    `;
  }

  function renderGamesSection(profile) {
    const games = getGames(profile);

    return `
      <section class="sbw-profile-card">
        <div class="sbw-profile-card-header">
          <div>
            <span>Jogos</span>
            <h2>Jogos principais</h2>
          </div>
        </div>

        ${
          games.length
            ? `
              <div class="sbw-profile-public-games">
                ${games
                  .map(function (game) {
                    if (typeof game === "string") {
                      return `
                        <article>
                          <strong>${escapeHtml(game)}</strong>
                          <span>Jogo cadastrado</span>
                        </article>
                      `;
                    }

                    return `
                      <article>
                        <strong>${escapeHtml(game.name || game.id || "Jogo")}</strong>
                        <span>${escapeHtml(game.category || "Modalidade")}</span>
                      </article>
                    `;
                  })
                  .join("")}
              </div>
            `
            : `
              <div class="sbw-empty-state">
                Nenhum jogo principal cadastrado.
              </div>
            `
        }
      </section>
    `;
  }

  function renderCurrentTeamsSection(profile, teams) {
    return `
      <section class="sbw-profile-card">
        <div class="sbw-profile-card-header">
          <div>
            <span>Equipe</span>
            <h2>Equipe atual</h2>
          </div>
        </div>

        ${
          teams.length
            ? `
              <div class="sbw-current-team-list">
                ${teams
                  .map(function (team) {
                    const teamName = team.teamName || team.name || "Equipe";
                    const teamTag = team.teamTag || team.tag || "";
                    const teamUrl =
                      team.url ||
                      (window.SBWRoutes?.team ? window.SBWRoutes.team(team.teamId || team.id || "") : "../equipes/equipe.html?id=" + encodeURIComponent(team.teamId || team.id || ""));

                    return `
                      <a class="sbw-current-team-card" href="${escapeHtml(teamUrl)}">
                        <div class="sbw-current-team-logo">
                          ${getTeamLogo(team)}
                        </div>

                        <div>
                          <strong>
                            ${escapeHtml(teamName)}
                            ${
                              team.isVerified
                                ? `<span class="sbw-verified-badge">Verificada</span>`
                                : ""
                            }
                          </strong>

                          <span>
                            ${teamTag ? escapeHtml(teamTag) + " · " : ""}
                            ${escapeHtml(team.functionName || team["function"] || team.role || "Player")}
                          </span>

                          <small>
                            Entrada: ${escapeHtml(formatDate(team.joinedAt))}
                          </small>
                        </div>
                      </a>
                    `;
                  })
                  .join("")}
              </div>
            `
            : `
              <div class="sbw-empty-state">
                Este jogador está sem equipe no momento.
              </div>
            `
        }
      </section>
    `;
  }

  function getHistory(profile, competitiveSnapshot) {
    const storage = getStorage();
    const directHistory = getHistoryFromProfile(profile);
    const storageHistory = storage && typeof storage.getHistoryByUserId === "function"
      ? storage.getHistoryByUserId(getProfileId(profile)) || []
      : [];
    const generatedHistory = competitiveSnapshot && Array.isArray(competitiveSnapshot.history)
      ? competitiveSnapshot.history
      : [];

    if (storage && typeof storage.mergeProfileHistoryLists === "function") {
      return storage.mergeProfileHistoryLists([].concat(directHistory, storageHistory), generatedHistory);
    }

    return mergeByIdOrSignature(
      [].concat(generatedHistory, directHistory, storageHistory),
      function (item) {
        return [item.userId, item.type, item.tournamentId || item.tournamentSlug || item.tournamentName, item.placement || item.position || ""].join(":");
      }
    ).sort(function (a, b) {
      const dateA = new Date(a.occurredAt || a.date || a.createdAt || 0).getTime();
      const dateB = new Date(b.occurredAt || b.date || b.createdAt || 0).getTime();
      return dateB - dateA;
    });
  }

  function getHistoryGroups(history) {
    return {
      teams: history.filter(function (item) {
        return item.type === "team_join" || item.type === "team_leave" || item.type === "team_transfer";
      }),
      tournaments: history.filter(function (item) {
        return item.type === "tournament";
      }),
      titles: history.filter(function (item) {
        return item.type === "title" || item.type === "platform";
      }),
      podiums: history.filter(function (item) {
        return item.type === "podium";
      }),
      prizes: history.filter(function (item) {
        return item.type === "prize";
      })
    };
  }

  function renderTeamMovement(item) {
    const type = item.type || "";
    let fromName = item.fromTeamName || "";
    let toName = item.toTeamName || "";

    if (type === "team_join") {
      fromName = fromName || "Sem equipe";
      toName = toName || item.teamName || "Equipe";
    }

    if (type === "team_leave") {
      fromName = fromName || item.teamName || "Equipe";
      toName = toName || "Sem equipe";
    }

    if (type === "team_transfer") {
      fromName = fromName || "Equipe anterior";
      toName = toName || item.teamName || "Nova equipe";
    }

    return `
      <article class="sbw-transfer-card">
        <div class="sbw-transfer-side">
          <div class="sbw-transfer-logo">
            ${escapeHtml(String(fromName).slice(0, 3).toUpperCase())}
          </div>
          <strong>${escapeHtml(fromName)}</strong>
        </div>

        <div class="sbw-transfer-center">
          <span>${escapeHtml(getHistoryTypeLabel(type))}</span>
          <small>${escapeHtml(formatDate(item.occurredAt || item.date || item.createdAt))}</small>
        </div>

        <div class="sbw-transfer-side">
          <div class="sbw-transfer-logo">
            ${escapeHtml(String(toName).slice(0, 3).toUpperCase())}
          </div>
          <strong>${escapeHtml(toName)}</strong>
        </div>

        <p>${escapeHtml(item.description || item.title || "")}</p>
      </article>
    `;
  }

  function renderHistoryItem(item) {
    if (item.type === "team_join" || item.type === "team_leave" || item.type === "team_transfer") {
      return renderTeamMovement(item);
    }

    return `
      <article class="sbw-profile-history-item">
        <div>
          <span>${escapeHtml(getHistoryTypeLabel(item.type))}</span>
          <h3>${escapeHtml(item.title || "Histórico")}</h3>
          <p>
            ${escapeHtml(item.description || item.tournamentName || item.teamName || "Registro da plataforma SaberWolf.")}
          </p>
        </div>

        <time>${escapeHtml(formatDate(item.occurredAt || item.date || item.createdAt))}</time>
      </article>
    `;
  }

  function renderHistoryGroup(title, items, emptyText) {
    return `
      <section class="sbw-profile-history-group">
        <h3>${escapeHtml(title)}</h3>

        ${
          items.length
            ? items.map(renderHistoryItem).join("")
            : `<div class="sbw-empty-state">${escapeHtml(emptyText)}</div>`
        }
      </section>
    `;
  }

  function renderHistorySection(profile, competitiveSnapshot) {
    const history = getHistory(profile, competitiveSnapshot);
    const groups = getHistoryGroups(history);

    return `
      <section class="sbw-profile-card sbw-profile-history-card">
        <div class="sbw-profile-card-header">
          <div>
            <span>Carreira</span>
            <h2>Histórico público</h2>
          </div>
        </div>

        <div class="sbw-profile-history-grid">
          ${renderHistoryGroup("Equipes", groups.teams, "Nenhum histórico de equipe registrado.")}
          ${renderHistoryGroup("Torneios", groups.tournaments, "Nenhum torneio registrado.")}
          ${renderHistoryGroup("Títulos", groups.titles, "Nenhum título registrado.")}
          ${renderHistoryGroup("Pódios", groups.podiums, "Nenhum pódio registrado.")}
          ${renderHistoryGroup("Premiações", groups.prizes, "Nenhuma premiação registrada.")}
        </div>
      </section>
    `;
  }

  async function renderProfile(profile) {
    const root = getRoot();

    if (!root) {
      return;
    }

    const teams = await getCurrentTeams(profile);
    const competitiveSnapshot = await getCompetitiveSnapshot(profile);

    document.title = `${getPublicDisplayName(profile)} | -SBW-`;

    root.innerHTML = `
      <div class="sbw-profile-public-shell">
        ${renderProfileHero(profile, competitiveSnapshot)}

        <div class="sbw-profile-public-grid">
          <div class="sbw-profile-public-main-column">
             ${renderPlayerStatusSection(profile)}
             ${renderBioSection(profile)}
             ${renderMedalsSection(profile, competitiveSnapshot)}
             ${renderHistorySection(profile, competitiveSnapshot)}
          </div>

          <aside class="sbw-profile-public-side-column">
            ${renderCurrentTeamsSection(profile, teams)}
            ${renderGamesSection(profile)}
          </aside>
        </div>
      </div>
    `;
  }

  async function loadProfileById(profileId) {
    const storage = getStorage();

    if (!storage) {
      return null;
    }

    if (typeof storage.getProfileByIdAsync === "function") {
      return await storage.getProfileByIdAsync(profileId);
    }

    if (typeof storage.getProfileById === "function") {
      return storage.getProfileById(profileId);
    }

    return null;
  }

  async function init() {
    const storage = getStorage();

    if (!storage) {
      renderError("O storage de perfis não carregou. Verifique profiles-storage.js.");
      return;
    }

    const profileId = getProfileIdFromUrl();

    if (!profileId) {
      renderError("Perfil não informado na URL.");
      return;
    }

    renderLoading();

    let profile = null;

    try {
      profile = await loadProfileById(profileId);
    } catch (error) {
      console.error("[SaberWolf Profiles] Erro ao carregar perfil público:", error);
    }

    if (!profile) {
      renderError("Perfil não encontrado.");
      return;
    }

    await renderProfile(profile);
  }

  document.addEventListener("DOMContentLoaded", init);
})();