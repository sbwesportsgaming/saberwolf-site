(function () {
  "use strict";

  function getConfig() {
    return window.SBW_TEAMS_CONFIG || {};
  }

  function getStorage() {
    return window.SBWTeamsStorage || null;
  }

  function getModels() {
    return window.SBWTeamsModels || {};
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function safeUrl(value) {
    const raw = String(value || "").trim();

    if (!raw) return "";

    if (/^(javascript|data:text\/html)/i.test(raw)) return "";

    if (/^https?:\/\//i.test(raw) || raw.startsWith("/") || raw.startsWith("../")) {
      return raw;
    }

    if (raw.startsWith("assets/")) {
      return "../" + raw;
    }

    return raw;
  }

  function getParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
  }

  function getRoot() {
    return document.querySelector("[data-team-profile-root]");
  }

  function getVerifiedStatus() {
    const config = getConfig();
    return config.verificationStatus?.verified || "verified";
  }

  function getMainTeamType() {
    const config = getConfig();
    return config.teamTypes?.mainTeam || "main_team";
  }

  function getSubteamType() {
    const config = getConfig();
    return config.teamTypes?.subteam || config.teamTypes?.subTeam || "subteam";
  }

  function getCommonTeamLimit() {
    const config = getConfig();
    return Number(config.limits?.commonTeamMembers || 50);
  }

  function getVerifiedTeamLimit() {
    const config = getConfig();
    return Number(config.limits?.verifiedTeamMembers || 100);
  }

  function getTeamId(team) {
    return team?.slug || team?.id || team?.teamId || "";
  }

  function getTeamIdentifiers(team) {
    return [
      team?.slug,
      team?.id,
      team?.teamId,
      team?.teamSlug,
      team?.supabaseId,
      team?.supabase_id
    ]
      .filter(Boolean)
      .map((value) => String(value));
  }

  function teamsMatch(teamA, teamB) {
    if (!teamA || !teamB) return false;

    const a = new Set(getTeamIdentifiers(teamA));

    return getTeamIdentifiers(teamB).some((identifier) => a.has(identifier));
  }

  function canOpenMyTeam(team, sessionContext) {
    if (!team || !sessionContext?.user) return false;

    if (teamsMatch(team, sessionContext.currentTeam)) return true;

    return (sessionContext.ownedTeams || []).some((ownedTeam) => teamsMatch(team, ownedTeam));
  }

  async function getSessionContext() {
    try {
      if (window.SBWSessionContext?.getCurrentContext) {
        return await window.SBWSessionContext.getCurrentContext();
      }
    } catch (error) {
      console.warn("[SaberWolf Teams] Não foi possível carregar contexto da sessão:", error);
    }

    return null;
  }

  function getTeamInitials(team) {
    if (team?.tag) return String(team.tag).slice(0, 5).toUpperCase();

    return String(team?.name || "Equipe")
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .slice(0, 4)
      .toUpperCase();
  }

  function formatPublicTeamTag(team) {
    const rawTag = String(team?.tag || "").trim();

    if (!rawTag) return "";

    const cleaned = rawTag.replace(/^-+|-+$/g, "").toUpperCase();

    return cleaned ? `-${cleaned}-` : "";
  }

  function getRoleLabel(role) {
    const labels = {
      owner: "Dono",
      captain: "Capitão",
      vice_captain: "Vice-capitão",
      manager: "Manager",
      coach: "Coach",
      staff: "Staff",
      member: "Membro",
      pending: "Pendente"
    };

    return labels[role] || "Membro";
  }

  function getPublicTitleLabel(value) {
    const labels = {
      pro_player: "Player profissional",
      coach: "Coach",
      manager: "Manager",
      staff: "Staff",
      academy_player: "Academy",
      creator: "Creator",
      analyst: "Analista",
      social_media: "Social Media"
    };

    return labels[value] || "";
  }

  function getTeamTypeLabel(team) {
    const models = getModels();

    if (typeof models.getTeamTypeLabel === "function") {
      return models.getTeamTypeLabel(team);
    }

    const type = String(team?.teamType || team?.type || "").toLowerCase();

    if (type === getSubteamType() || type.includes("sub")) return "Subequipe / Academy";
    if (type.includes("community")) return "Comunidade";
    if (type.includes("academy")) return "Academy";
    if (type.includes("casual")) return "Casual";
    if (type.includes("creator")) return "Creators";
    if (type.includes("competitive")) return "Competitiva";
    if (type.includes("organization") || type.includes("main")) return "Organização competitiva";

    return "Equipe";
  }

  function getVerificationLabel(team) {
    const models = getModels();

    if (typeof models.getVerificationLabel === "function") {
      return models.getVerificationLabel(team);
    }

    if (isTeamVerified(team)) return "Equipe verificada pela -SBW-";

    return "Equipe não verificada";
  }

  function isTeamVerified(team) {
    return team?.verificationStatus === getVerifiedStatus() || team?.isVerified === true;
  }

  function isSubteam(team) {
    const type = String(team?.teamType || "").toLowerCase();

    return type === getSubteamType() || type.includes("sub") || Boolean(team?.parentTeamId || team?.parentTeamSlug);
  }

  function asArray(value) {
    if (Array.isArray(value)) return value;
    if (!value || typeof value !== "object") return [];
    if (Array.isArray(value.items)) return value.items;
    if (Array.isArray(value.data)) return value.data;
    return [];
  }

  function asObject(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) return {};
    return value;
  }

  function getMeta(team) {
    return asObject(team?.metadata);
  }



  function clampNumber(value, min, max, fallback) {
    const number = Number(value);
    if (!Number.isFinite(number)) return fallback;
    return Math.min(max, Math.max(min, number));
  }

  function getTeamAssetFrame(team, assetType) {
    const metadata = getMeta(team);
    const teamAssets = metadata.teamAssets && typeof metadata.teamAssets === "object" && !Array.isArray(metadata.teamAssets)
      ? metadata.teamAssets
      : {};
    const fallbackAssets = metadata.assetFrames && typeof metadata.assetFrames === "object" && !Array.isArray(metadata.assetFrames)
      ? metadata.assetFrames
      : {};
    const raw = teamAssets[assetType] || fallbackAssets[assetType] || {};

    return {
      positionX: clampNumber(raw.positionX ?? raw.x ?? raw.objectPositionX, 0, 100, 50),
      positionY: clampNumber(raw.positionY ?? raw.y ?? raw.objectPositionY, 0, 100, 50),
      zoom: clampNumber(raw.zoom ?? raw.scale ?? raw.size, 100, assetType === "banner" ? 180 : 160, 100)
    };
  }

  function getTeamAssetFrameStyle(team) {
    const banner = getTeamAssetFrame(team, "banner");
    const logo = getTeamAssetFrame(team, "logo");
    const bannerSize = banner.zoom <= 100 ? "cover" : `${banner.zoom}% auto`;

    return [
      `--sbw-team-banner-x:${banner.positionX}%`,
      `--sbw-team-banner-y:${banner.positionY}%`,
      `--sbw-team-banner-size:${bannerSize}`,
      `--sbw-team-logo-x:${logo.positionX}%`,
      `--sbw-team-logo-y:${logo.positionY}%`,
      `--sbw-team-logo-scale:${(logo.zoom / 100).toFixed(2)}`
    ].join("; ") + ";";
  }

  function styleAttribute(value) {
    const safeValue = String(value || "").trim();
    return safeValue ? `style="${escapeHtml(safeValue)}"` : "";
  }

  function formatDate(value) {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return String(value);

    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  }

  function formatPrize(stats) {
    const amount = Number(stats?.prizeAmount || stats?.prize_amount || 0);
    const currency = stats?.prizeCurrency || stats?.prize_currency || "BRL";

    if (!amount) return "R$ 0";

    if (currency === "BRL") {
      return amount.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
      });
    }

    return `${amount} ${currency}`;
  }

  function getTeamPublicType(team) {
    const storage = getStorage();

    if (!storage || typeof storage.getTeamTypeByTeamId !== "function") {
      return null;
    }

    const identifiers = [
      team?.id,
      team?.teamId,
      team?.slug,
      team?.teamSlug,
      getTeamId(team)
    ].filter(Boolean);

    for (const identifier of identifiers) {
      const found = storage.getTeamTypeByTeamId(identifier);

      if (found && found.source !== "default") return found;
    }

    return storage.getTeamTypeByTeamId(getTeamId(team));
  }

  function getPublicTypeLabel(team) {
    const teamType = getTeamPublicType(team);
    return teamType?.label || getTeamTypeLabel(team);
  }

  function getFocusTags(team) {
    const teamType = getTeamPublicType(team);
    const meta = getMeta(team);
    const fromType = Array.isArray(teamType?.focusTags) ? teamType.focusTags : [];
    const fromTeam = Array.isArray(team?.focusTags) ? team.focusTags : [];
    const fromMeta = Array.isArray(meta.focusTags) ? meta.focusTags : [];
    const fromGames = (team?.games || [])
      .map((game) => (typeof game === "string" ? game : game.category || game.name || game.id))
      .filter(Boolean);

    return Array.from(new Set([...fromType, ...fromTeam, ...fromMeta, ...fromGames])).slice(0, 7);
  }

  function getLocationLabel(team) {
    const meta = getMeta(team);
    const parts = [
      team?.city || meta.city,
      team?.state || meta.state,
      team?.country || meta.country
    ].filter(Boolean);

    if (parts.length) return parts.join(" · ");

    return team?.location || meta.location || "Região não informada";
  }

  function getMemberName(member) {
    return member?.displayName || member?.display_name || member?.nickname || member?.name || "Membro";
  }

  function getMemberNickname(member) {
    return member?.nickname || member?.displayName || member?.display_name || member?.name || "Membro";
  }

  function getMemberInitials(member) {
    return String(getMemberNickname(member)).slice(0, 2).toUpperCase();
  }

  function getMemberProfileUrl(member) {
    const id = member?.userId || member?.profileSlug || member?.profileId || member?.profile_slug;

    if (!id) return "";

    return window.SBWRoutes?.profile ? window.SBWRoutes.profile(id) : `../perfis/perfil.html?id=${encodeURIComponent(id)}`;
  }

  function getMemberAvatarHtml(member) {
    const url = safeUrl(member?.avatarUrl || member?.avatar_url || "");

    if (url) {
      return `<img src="${escapeHtml(url)}" alt="${escapeHtml(getMemberName(member))}" loading="lazy" />`;
    }

    return escapeHtml(getMemberInitials(member));
  }

  function getActiveMembers(members) {
    return (members || []).filter((member) => (member.status || "active") === "active");
  }

  function getGameNameMap(team) {
    const map = new Map();

    (team.games || []).forEach((game) => {
      if (typeof game === "string") {
        map.set(game, game);
        return;
      }

      map.set(game.id, game.name || game.id);
    });

    return map;
  }

  function getMemberGamesLabel(member, team) {
    const gameMap = getGameNameMap(team);
    const games = Array.isArray(member.games) ? member.games : [];

    if (!games.length) return "—";

    return games
      .map((game) => {
        if (typeof game === "string") return gameMap.get(game) || game;
        return game.name || gameMap.get(game.id) || game.id || "Jogo";
      })
      .filter(Boolean)
      .join(", ");
  }

  function getMembersByGame(members, gameId) {
    return members.filter((member) => {
      if (!Array.isArray(member.games)) return false;

      return member.games.some((game) => {
        if (typeof game === "string") return game === gameId;
        return game.id === gameId;
      });
    });
  }

  function getPlayerMembers(members) {
    return getActiveMembers(members).filter((member) => {
      const role = String(member.role || "").toLowerCase();
      const title = String(member.publicTitle || member.publicTitleLabel || member.functionName || member.function || "").toLowerCase();

      return !["manager", "coach", "staff", "social_media", "analyst"].includes(role) && !title.includes("coach") && !title.includes("manager") && !title.includes("staff");
    });
  }

  function renderLogo(team, className) {
    const url = safeUrl(team?.logoUrl || team?.logo_url || "");

    if (url) {
      return `
        <div class="${className}">
          <img src="${escapeHtml(url)}" alt="Logo ${escapeHtml(team?.name || "Equipe")}" loading="lazy" onerror="this.closest('.${className}')?.classList.add('is-logo-error'); this.remove();" />
          <span>${escapeHtml(getTeamInitials(team))}</span>
        </div>
      `;
    }

    return `
      <div class="${className} is-logo-fallback">
        <span>${escapeHtml(getTeamInitials(team))}</span>
      </div>
    `;
  }

  function renderVerifiedBadge(team, label) {
    if (!isTeamVerified(team)) return "";

    return `<span class="sbw-team-v2-badge sbw-team-v2-badge-verified" title="${escapeHtml(label || getVerificationLabel(team))}">✓ Verificada</span>`;
  }

  function renderPill(value, modifier) {
    if (!value) return "";

    return `<span class="sbw-team-v2-pill ${modifier || ""}">${escapeHtml(value)}</span>`;
  }

  function renderPublicTitle(member) {
    const directLabel = member.publicTitleLabel || "";
    const mappedLabel = getPublicTitleLabel(member.publicTitle || "");
    const label = directLabel || mappedLabel || member.functionName || member.function || "Player";

    return `<span class="sbw-team-v2-role-badge">${escapeHtml(label)}</span>`;
  }

  function renderParentTeamBox(parentTeam) {
    if (!parentTeam) return "";

    return `
      <div class="sbw-team-v2-parent">
        <span>Subequipe oficial vinculada a</span>
        <a href="${escapeHtml(window.SBWRoutes?.team ? window.SBWRoutes.team(getTeamId(parentTeam)) : `equipe.html?id=${encodeURIComponent(getTeamId(parentTeam))}`)}">${escapeHtml(parentTeam.name)}</a>
      </div>
    `;
  }

  function renderHero(team, members, parentTeam, sessionContext) {
    const meta = getMeta(team);
    const bannerUrl = safeUrl(team.bannerUrl || team.banner_url || "");
    const verified = isTeamVerified(team);
    const website = safeUrl(team.website || meta.website || team.socialLinks?.website || "");
    const teamKey = getTeamId(team);
    const myTeamUrl = window.SBWRoutes?.myTeam ? window.SBWRoutes.myTeam(teamKey) : `minha-equipe.html?id=${encodeURIComponent(teamKey)}`;
    const showMyTeamButton = canOpenMyTeam(team, sessionContext);
    const heroStyle = styleAttribute([
      bannerUrl ? `--team-banner-image: url('${bannerUrl}')` : "",
      getTeamAssetFrameStyle(team)
    ].filter(Boolean).join("; "));

    return `
      <section class="sbw-team-v2-hero sbw-team-v2-hero-clean sbw-team-v2-hero-social sbw-team-v2-hero-facebook sbw-team-v2-hero-minimal ${bannerUrl ? "has-team-banner" : "is-team-banner-placeholder"}" ${heroStyle}>
        <div class="sbw-team-v2-cover" aria-label="Banner público da equipe"></div>

        <div class="sbw-team-v2-profile-strip">
          ${renderLogo(team, "sbw-team-v2-logo")}

          <div class="sbw-team-v2-identity-main">
            <h1>
              ${escapeHtml(team.name || "Equipe -SBW-")}
              ${verified ? `<span class="sbw-verified-badge" title="${escapeHtml(getVerificationLabel(team))}">✓</span>` : ""}
            </h1>
            ${formatPublicTeamTag(team) ? `<p class="sbw-team-v2-public-tag">${escapeHtml(formatPublicTeamTag(team))}</p>` : ""}
            ${renderParentTeamBox(parentTeam)}
          </div>

          <div class="sbw-team-v2-actions sbw-team-v2-hero-actions">
            ${showMyTeamButton ? `<a class="sbw-team-v2-button sbw-team-v2-button-primary" href="${escapeHtml(myTeamUrl)}">Minha equipe</a>` : ""}
            ${website ? `<a class="sbw-team-v2-button" href="${escapeHtml(website)}" target="_blank" rel="noopener noreferrer">Site oficial</a>` : ""}
            <a class="sbw-team-v2-button ${showMyTeamButton ? "" : "sbw-team-v2-button-primary"}" href="${escapeHtml(window.SBWRoutes?.teams ? window.SBWRoutes.teams() : "equipes.html")}">Ver outras equipes</a>
          </div>
        </div>
      </section>
    `;
  }

  function renderMetric(icon, label, value, hint) {
    return `
      <article class="sbw-team-v2-metric">
        <span class="sbw-team-v2-metric-icon">${escapeHtml(icon)}</span>
        <div>
          <strong>${escapeHtml(value)}</strong>
          <span>${escapeHtml(label)}</span>
          ${hint ? `<small>${escapeHtml(hint)}</small>` : ""}
        </div>
      </article>
    `;
  }

  function renderMetrics(team, members) {
    const stats = team.stats || {};
    const meta = getMeta(team);
    const activeMembers = getActiveMembers(members);
    const games = Array.isArray(team.games) ? team.games : [];
    const verified = isTeamVerified(team);
    const limit = Number(team.memberLimit || (verified ? getVerifiedTeamLimit() : getCommonTeamLimit()));
    const rank = stats.rankPosition || stats.rankingPosition || stats.globalRank || team.rankingPosition || "—";
    const recruitment = asObject(team.recruitment || meta.recruitment);
    const recruitmentOpen = Boolean(recruitment.isOpen || team.recruiting === true || meta.recruiting === true);

    return `
      <section class="sbw-team-v2-metrics" aria-label="Métricas da equipe">
        ${renderMetric("👥", "Membros", activeMembers.length, `limite ${limit}`)}
        ${renderMetric("🎮", "Jogos / divisões", games.length, "modalidades")}
        ${renderMetric("🏆", "Títulos -SBW-", Number(stats.titles || 0), `${Number(stats.podiums || 0)} pódios`)}
        ${renderMetric("📅", "Torneios", Number(stats.tournamentsPlayed || 0), "histórico")}
        ${renderMetric("#", "Ranking", rank === "—" ? "—" : `#${rank}`, "global SBW")}
        ${renderMetric("🔎", "Recrutamento", recruitmentOpen ? "Aberto" : "Fechado", "status público")}
      </section>
    `;
  }

  function renderRoster(team, members) {
    const activeMembers = getActiveMembers(members);

    return `
      <section class="sbw-team-v2-panel sbw-team-v2-roster-panel">
        <header class="sbw-team-v2-panel-head">
          <div>
            <span>Roster principal</span>
            <h2>Membros da equipe</h2>
          </div>
          <small>${activeMembers.length} ativo${activeMembers.length === 1 ? "" : "s"}</small>
        </header>

        ${
          activeMembers.length
            ? `
              <div class="sbw-team-v2-roster-table">
                <div class="sbw-team-v2-roster-head">
                  <span>Membro</span>
                  <span>Cargo</span>
                  <span>Função</span>
                  <span>Modalidades</span>
                </div>

                ${activeMembers
                  .map((member) => {
                    const profileUrl = getMemberProfileUrl(member);
                    const identity = `
                      <div class="sbw-team-v2-member-avatar">${getMemberAvatarHtml(member)}</div>
                      <div class="sbw-team-v2-member-name">
                        <strong>${escapeHtml(getMemberName(member))}</strong>
                        <span>@${escapeHtml(getMemberNickname(member))}</span>
                      </div>
                    `;

                    return `
                      <article class="sbw-team-v2-roster-row ${member.role === "captain" ? "is-captain" : ""}">
                        ${
                          profileUrl
                            ? `<a class="sbw-team-v2-member" href="${profileUrl}">${identity}</a>`
                            : `<div class="sbw-team-v2-member">${identity}</div>`
                        }
                        <div class="sbw-team-v2-cell">${escapeHtml(getRoleLabel(member.role))}</div>
                        <div class="sbw-team-v2-cell">${renderPublicTitle(member)}</div>
                        <div class="sbw-team-v2-cell">${escapeHtml(getMemberGamesLabel(member, team))}</div>
                      </article>
                    `;
                  })
                  .join("")}
              </div>
            `
            : `<div class="sbw-team-v2-empty">Nenhum membro ativo cadastrado publicamente.</div>`
        }
      </section>
    `;
  }

  function renderDivisions(team, members) {
    const games = Array.isArray(team.games) ? team.games : [];
    const activeMembers = getActiveMembers(members);

    return `
      <section class="sbw-team-v2-panel">
        <header class="sbw-team-v2-panel-head">
          <div>
            <span>Jogos / divisões</span>
            <h2>Modalidades competitivas</h2>
          </div>
        </header>

        ${
          games.length
            ? `
              <div class="sbw-team-v2-division-list">
                ${games
                  .map((game) => {
                    const gameId = typeof game === "string" ? game : game.id;
                    const name = typeof game === "string" ? game : game.name || game.id || "Jogo";
                    const category = typeof game === "string" ? "Modalidade" : game.category || game.division || "Divisão";
                    const status = typeof game === "string" ? "Ativa" : game.status || (game.active === false ? "Em formação" : "Ativa");
                    const rank = typeof game === "string" ? "" : game.rank || game.ranking || game.rankPosition || "";
                    const count = getMembersByGame(activeMembers, gameId).length;

                    return `
                      <article class="sbw-team-v2-division">
                        <div>
                          <strong>${escapeHtml(name)}</strong>
                          <span>${escapeHtml(category)}</span>
                        </div>
                        <div class="sbw-team-v2-division-meta">
                          <b>${count} jogador${count === 1 ? "" : "es"}</b>
                          ${rank ? `<b>#${escapeHtml(rank)}</b>` : ""}
                          <em>${escapeHtml(status)}</em>
                        </div>
                      </article>
                    `;
                  })
                  .join("")}
              </div>
            `
            : `<div class="sbw-team-v2-empty">Nenhuma modalidade cadastrada publicamente.</div>`
        }
      </section>
    `;
  }

  function getInternalAchievements(team) {
    const meta = getMeta(team);
    const achievements = [
      ...asArray(team.achievements),
      ...asArray(meta.achievements),
      ...asArray(team.internalAchievements),
      ...asArray(meta.internalAchievements)
    ];

    return achievements.filter((item) => {
      const source = String(item.source || item.origin || "sbw").toLowerCase();
      return !source || source === "sbw" || source === "internal" || source === "saberwolf";
    });
  }

  function getExternalAchievements(team) {
    const meta = getMeta(team);

    return [
      ...asArray(team.externalAchievements),
      ...asArray(meta.externalAchievements)
    ];
  }

  function renderAchievementItem(item, index) {
    const title = item.title || item.name || item.tournamentName || `Conquista #${index + 1}`;
    const subtitle = [item.game, item.organizer, item.placement || item.position].filter(Boolean).join(" · ");

    return `
      <article class="sbw-team-v2-achievement">
        <span>🏆</span>
        <div>
          <strong>${escapeHtml(title)}</strong>
          <small>${escapeHtml(subtitle || "Conquista registrada")}</small>
        </div>
        <time>${escapeHtml(formatDate(item.date || item.finishedAt || item.createdAt))}</time>
      </article>
    `;
  }

  function renderInternalAchievements(team) {
    const items = getInternalAchievements(team);

    return `
      <section class="sbw-team-v2-panel">
        <header class="sbw-team-v2-panel-head">
          <div>
            <span>Conquistas -SBW-</span>
            <h2>Títulos</h2>
          </div>
        </header>

        ${
          items.length
            ? `<div class="sbw-team-v2-achievement-list">${items.slice(0, 6).map(renderAchievementItem).join("")}</div>`
            : `
              <div class="sbw-team-v2-empty">
                Nenhum título registrado ainda. Resultados oficiais da plataforma poderão aparecer aqui conforme forem finalizados.
              </div>
            `
        }
      </section>
    `;
  }

  function renderExternalAchievements(team) {
    const items = getExternalAchievements(team);

    return `
      <section class="sbw-team-v2-panel sbw-team-v2-external-panel">
        <header class="sbw-team-v2-panel-head">
          <div>
            <span>Conquistas externas</span>
            <h2>Integrações futuras</h2>
          </div>
        </header>

        ${
          items.length
            ? `<div class="sbw-team-v2-achievement-list">${items.slice(0, 5).map(renderAchievementItem).join("")}</div>`
            : `
              <div class="sbw-team-v2-empty">
                Nenhuma conquista externa vinculada ainda. Futuras integrações poderão exibir resultados externos aqui sem misturar com o histórico interno da -SBW-.
              </div>
            `
        }
      </section>
    `;
  }

  function getRecentResults(team) {
    const meta = getMeta(team);

    return [
      ...asArray(team.recentResults),
      ...asArray(team.recentTournaments),
      ...asArray(team.results),
      ...asArray(meta.recentResults),
      ...asArray(meta.recentTournaments)
    ];
  }

  function renderRecentResults(team) {
    const results = getRecentResults(team);

    return `
      <section class="sbw-team-v2-panel">
        <header class="sbw-team-v2-panel-head">
          <div>
            <span>Últimos torneios / resultados</span>
            <h2>Histórico recente</h2>
          </div>
        </header>

        ${
          results.length
            ? `
              <div class="sbw-team-v2-result-list">
                ${results
                  .slice(0, 6)
                  .map((result) => {
                    const title = result.tournamentName || result.name || result.title || "Torneio";
                    const meta = [result.game, result.organizer, result.participants ? `${result.participants} participantes` : ""].filter(Boolean).join(" · ");
                    const placement = result.placement || result.position || result.rank || "—";
                    const points = result.points || result.score || "";

                    return `
                      <article class="sbw-team-v2-result">
                        <div>
                          <strong>${escapeHtml(title)}</strong>
                          <span>${escapeHtml(meta || "Resultado interno")}</span>
                        </div>
                        <div>
                          <b>${escapeHtml(placement)}</b>
                          ${points ? `<small>${escapeHtml(points)} pts</small>` : ""}
                        </div>
                        <time>${escapeHtml(formatDate(result.date || result.finishedAt || result.createdAt))}</time>
                      </article>
                    `;
                  })
                  .join("")}
              </div>
            `
            : `<div class="sbw-team-v2-empty">Nenhum resultado recente vinculado ao perfil público desta equipe.</div>`
        }
      </section>
    `;
  }

  function renderSubteams(subteams, parentTeam) {
    const parentVerified = isTeamVerified(parentTeam);

    return `
      <section class="sbw-team-v2-panel">
        <header class="sbw-team-v2-panel-head">
          <div>
            <span>Subequipes / Academy</span>
            <h2>Estrutura vinculada</h2>
          </div>
        </header>

        ${
          subteams.length
            ? `
              <div class="sbw-team-v2-subteam-grid">
                ${subteams
                  .map((team) => {
                    const verified = parentVerified || isTeamVerified(team);
                    const games = Array.isArray(team.games) ? team.games : [];

                    return `
                      <a class="sbw-team-v2-subteam" href="${escapeHtml(window.SBWRoutes?.team ? window.SBWRoutes.team(getTeamId(team)) : `equipe.html?id=${encodeURIComponent(getTeamId(team))}`)}">
                        ${renderLogo(team, "sbw-team-v2-subteam-logo")}
                        <div>
                          <strong>${escapeHtml(team.name)}</strong>
                          <span>${escapeHtml(games[0]?.name || games[0] || getTeamTypeLabel(team))}</span>
                          ${verified ? `<small>✓ Verificada</small>` : ""}
                        </div>
                      </a>
                    `;
                  })
                  .join("")}
              </div>
            `
            : `
              <div class="sbw-team-v2-empty">
                Nenhuma subequipe pública vinculada no momento. Equipes verificadas podem organizar Academy, base ou line secundária.
              </div>
            `
        }
      </section>
    `;
  }

  function renderSocialLinks(team) {
    const links = team.socialLinks || {};
    const meta = getMeta(team);
    const merged = Object.assign({}, links, meta.socialLinks || {});

    const socialItems = [
      ["discord", "Discord"],
      ["x", "X / Twitter"],
      ["twitter", "X / Twitter"],
      ["instagram", "Instagram"],
      ["youtube", "YouTube"],
      ["twitch", "Twitch"],
      ["tiktok", "TikTok"],
      ["website", "Site"]
    ]
      .map(([key, label]) => ({ key, label, url: safeUrl(merged[key] || "") }))
      .filter((item, index, list) => item.url && list.findIndex((other) => other.url === item.url) === index);

    if (!socialItems.length) {
      return `<div class="sbw-team-v2-empty">Nenhuma rede pública cadastrada.</div>`;
    }

    return `
      <div class="sbw-team-v2-social-grid">
        ${socialItems.map((item) => `<a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.label)}</a>`).join("")}
      </div>
    `;
  }

  function renderAbout(team, members) {
    const meta = getMeta(team);
    const foundedAt = team.foundedAt || team.createdAt || meta.foundedAt || meta.foundationDate || "";
    const type = getPublicTypeLabel(team);
    const location = getLocationLabel(team);
    const verified = isTeamVerified(team);
    const memberLimit = Number(team.memberLimit || (verified ? getVerifiedTeamLimit() : getCommonTeamLimit()));
    const activeMembers = getActiveMembers(members || []);
    const recruitmentOpen = Boolean(team.recruitment?.isOpen || meta.recruitment?.isOpen || team.recruiting === true || meta.recruiting === true);

    return `
      <section class="sbw-team-v2-panel">
        <header class="sbw-team-v2-panel-head">
          <div>
            <span>Sobre a equipe</span>
            <h2>Informações públicas</h2>
          </div>
        </header>

        <p class="sbw-team-v2-about-text">${escapeHtml(team.bio || team.description || "Esta equipe ainda não adicionou uma descrição institucional completa.")}</p>

        <dl class="sbw-team-v2-info-list">
          <div><dt>Fundada em</dt><dd>${escapeHtml(formatDate(foundedAt))}</dd></div>
          <div><dt>Sede / região</dt><dd>${escapeHtml(location)}</dd></div>
          <div><dt>Tipo</dt><dd>${escapeHtml(type)}</dd></div>
          <div><dt>Identidade</dt><dd>${escapeHtml(isSubteam(team) ? "Subequipe" : "Equipe principal")}</dd></div>
          <div><dt>Membros</dt><dd>${escapeHtml(`${activeMembers.length}/${memberLimit}`)}</dd></div>
          <div><dt>Recrutamento</dt><dd>${escapeHtml(recruitmentOpen ? "Aberto" : "Fechado")}</dd></div>
          <div><dt>Status</dt><dd>${escapeHtml(getVerificationLabel(team))}</dd></div>
        </dl>
      </section>
    `;
  }

  function renderRecruitment(team) {
    const meta = getMeta(team);
    const recruitment = asObject(team.recruitment || meta.recruitment);
    const isOpen = Boolean(recruitment.isOpen || team.recruiting === true || meta.recruiting === true);
    const games = asArray(recruitment.games || recruitment.openGames).map((item) => (typeof item === "string" ? item : item.name || item.id)).filter(Boolean);
    const requirements = recruitment.requirements || recruitment.description || "Fluxo público de entrada será refinado nas próximas etapas.";

    return `
      <section class="sbw-team-v2-panel ${isOpen ? "sbw-team-v2-recruitment-open" : ""}">
        <header class="sbw-team-v2-panel-head">
          <div>
            <span>Recrutamento</span>
            <h2>${isOpen ? "Recrutamento aberto" : "Recrutamento fechado"}</h2>
          </div>
        </header>

        <p class="sbw-team-v2-about-text">${escapeHtml(isOpen ? requirements : "Esta equipe não está com recrutamento público aberto no momento.")}</p>

        ${games.length ? `<div class="sbw-team-v2-tags">${games.map((game) => `<span>${escapeHtml(game)}</span>`).join("")}</div>` : ""}

        <button class="sbw-team-v2-button sbw-team-v2-button-wide" type="button" disabled>
          ${isOpen ? "Solicitar entrada em breve" : "Indisponível no momento"}
        </button>
      </section>
    `;
  }

  function renderSide(team, subteams, parentTeam, members) {
    return `
      <aside class="sbw-team-v2-side">
        ${renderAbout(team, members)}

        <section class="sbw-team-v2-panel">
          <header class="sbw-team-v2-panel-head">
            <div>
              <span>Redes sociais</span>
              <h2>Comunidade</h2>
            </div>
          </header>
          ${renderSocialLinks(team)}
        </section>

        ${renderRecruitment(team)}

        ${renderSubteams(subteams, team)}
      </aside>
    `;
  }

  function renderLoading() {
    const root = getRoot();
    if (!root) return;

    if (window.SBWPageState?.renderLoading) {
      window.SBWPageState.renderLoading(root, {
        title: "Carregando equipe",
        message: "Buscando perfil público, membros e dados competitivos.",
        rows: 6
      });
      return;
    }

    root.innerHTML = `<div class="sbw-empty-state">Carregando equipe...</div>`;
  }

  function renderError(message) {
    const root = getRoot();
    if (!root) return;

    if (window.SBWPageState?.renderError) {
      window.SBWPageState.renderError(root, {
        title: "Não foi possível carregar a equipe",
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

  function renderProfile(team, members, subteams, parentTeam, sessionContext) {
    const root = getRoot();
    if (!root) return;

    const primary = team.theme?.primaryColor || "#00e5ff";
    const secondary = team.theme?.secondaryColor || "#7c3cff";

    document.title = `${team.name || "Equipe"} | SaberWolf`;

    root.innerHTML = `
      <section class="sbw-team-profile-v2" style="--team-primary: ${escapeHtml(primary)}; --team-secondary: ${escapeHtml(secondary)};">
        ${renderHero(team, members, parentTeam, sessionContext)}
        ${renderMetrics(team, members)}

        <div class="sbw-team-v2-layout">
          <main class="sbw-team-v2-main">
            ${renderRoster(team, members)}
            ${renderDivisions(team, members)}
            ${renderInternalAchievements(team)}
            ${renderExternalAchievements(team)}
            ${renderRecentResults(team)}
          </main>

          ${renderSide(team, subteams, parentTeam, members)}
        </div>
      </section>
    `;
  }

  async function loadTeam() {
    const storage = getStorage();

    if (!storage) {
      renderError("Storage de equipes não carregou. Verifique teams-storage.js e a ordem dos scripts.");
      return;
    }

    const id = getParam("id");
    const slug = getParam("slug");

    if (!id && !slug) {
      renderError("Equipe não informada na URL.");
      return;
    }

    let team = null;

    if (id && typeof storage.getTeamById === "function") {
      team = await storage.getTeamById(id);
    }

    if (!team && slug && typeof storage.getTeamBySlug === "function") {
      team = await storage.getTeamBySlug(slug);
    }

    if (!team) {
      renderError("Equipe não encontrada.");
      return;
    }

    const teamId = getTeamId(team);
    let members = [];
    let subteams = [];
    let parentTeam = null;

    if (typeof storage.getTeamMembers === "function") {
      members = await storage.getTeamMembers(teamId);
    }

    if (typeof storage.getSubteams === "function") {
      subteams = await storage.getSubteams(teamId);
    }

    if ((team.parentTeamId || team.parentTeamSlug) && typeof storage.getTeamById === "function") {
      parentTeam = await storage.getTeamById(team.parentTeamId || team.parentTeamSlug);
    }

    const sessionContext = await getSessionContext();

    renderProfile(team, members || [], subteams || [], parentTeam, sessionContext);
  }

  async function init() {
    renderLoading();

    try {
      await loadTeam();
    } catch (error) {
      console.error("[SaberWolf Teams] Erro ao carregar perfil da equipe:", error);
      renderError("Erro ao carregar perfil da equipe.");
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
