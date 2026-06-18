(function () {
  "use strict";

  const STORAGE_KEYS = {
    profiles: "sbw_profiles_v1_4_2",
    teamMembers: "sbw_team_members_v1_3_9"
  };

  const state = {
    profiles: [],
    teams: [],
    teamMembers: [],
    currentUser: null,
    search: "",
    game: "all",
    status: "all",
    team: "all",
    region: "all",
    ranking: "all",
    sort: "featured",
    loading: true
  };

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function readJson(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      console.warn("[SBW Profiles] Erro ao ler storage:", key, error);
      return fallback;
    }
  }


  function renderDirectoryLoading(target, title, message, rows = 4) {
    if (window.SBWPageState?.renderLoading) {
      window.SBWPageState.renderLoading(target, { title, message, rows });
      return;
    }

    if (target) target.innerHTML = `<div class="sbw-profiles-v2-empty">${escapeHtml(message || title || "Carregando...")}</div>`;
  }

  function renderDirectoryEmpty(target, title, message) {
    if (window.SBWPageState?.renderEmpty) {
      window.SBWPageState.renderEmpty(target, { title, message });
      return;
    }

    if (target) target.innerHTML = `<div class="sbw-profiles-v2-empty">${escapeHtml(message || title || "Nada encontrado.")}</div>`;
  }

  function renderDirectoryError(target, title, message, details = "") {
    if (window.SBWPageState?.renderError) {
      window.SBWPageState.renderError(target, { title, message, details });
      return;
    }

    if (target) target.innerHTML = `<div class="sbw-profiles-v2-empty">${escapeHtml(message || title || "Erro ao carregar.")}</div>`;
  }

  function asArray(value) {
    if (Array.isArray(value)) return value;
    if (!value || typeof value !== "object") return [];
    if (Array.isArray(value.items)) return value.items;
    if (Array.isArray(value.data)) return value.data;
    return Object.keys(value).map((key) => value[key]);
  }

  function slugify(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function looksLikeInternalProfileCode(value) {
    const raw = String(value || "").trim().toLowerCase();

    if (!raw) return false;

    return /^sbw-[a-z0-9]{4,}/.test(raw) || /^user-[a-z0-9]{4,}/.test(raw) || /^[0-9a-f]{8}-[0-9a-f-]{20,}$/i.test(raw);
  }

  function getPublicDisplayName(profile) {
    const candidates = [
      profile?.displayName,
      profile?.display_name,
      profile?.nickname,
      profile?.username
    ]
      .map((item) => String(item || "").trim())
      .filter(Boolean);

    const name = candidates.find((item) => !looksLikeInternalProfileCode(item));
    return name || "Perfil -SBW-";
  }

  function getPublicNickname(profile) {
    const candidates = [profile?.nickname, profile?.username, profile?.slug]
      .map((item) => String(item || "").trim())
      .filter(Boolean);

    const nickname = candidates.find((item) => !looksLikeInternalProfileCode(item));
    return nickname || getPublicDisplayName(profile);
  }

  function getProfilesStorage() {
    return window.SBWProfilesStorage || null;
  }

  function getTeamsStorage() {
    return window.SBWTeamsStorage || null;
  }

  async function getCurrentUserSafely() {
    try {
      if (window.SBWAuth && typeof window.SBWAuth.getCurrentUser === "function") {
        const user = await window.SBWAuth.getCurrentUser();
        if (user) return user;
      }

      if (window.SBWSupabase?.client?.auth?.getSession) {
        const result = await window.SBWSupabase.client.auth.getSession();
        return result?.data?.session?.user || null;
      }
    } catch (error) {
      console.warn("[SBW Profiles] Não foi possível identificar usuário logado:", error);
    }

    return null;
  }

  function getProfileId(profile) {
    return (
      profile?.userId ||
      profile?.user_id ||
      profile?.authUserId ||
      profile?.auth_user_id ||
      profile?.id ||
      profile?.slug ||
      profile?.username ||
      ""
    );
  }

  function getProfileUrl(profile) {
    const id = getProfileId(profile);
    return window.SBWRoutes?.profile ? window.SBWRoutes.profile(id) : `/perfis/perfil.html?id=${encodeURIComponent(id)}`;
  }

  function getDisplayName(profile) {
    return getPublicDisplayName(profile);
  }

  function getNickname(profile) {
    return getPublicNickname(profile);
  }

  function getInitials(profile) {
    const raw = getDisplayName(profile);
    return String(raw || "SBW").slice(0, 2).toUpperCase();
  }

  function getAvatarUrl(profile) {
    return profile?.avatarUrl || profile?.avatar_url || profile?.photoUrl || profile?.photo_url || "";
  }

  function getBannerUrl(profile) {
    return profile?.bannerUrl || profile?.banner_url || profile?.coverUrl || profile?.cover_url || "";
  }

  function getGames(profile) {
    const games = profile?.mainGames || profile?.games || profile?.modalities || [];
    return asArray(games)
      .map((game) => {
        if (typeof game === "string") return { id: slugify(game), name: game };
        return {
          id: game.id || game.slug || slugify(game.name || game.title || game.label),
          name: game.name || game.title || game.label || game.id || "Jogo"
        };
      })
      .filter((game) => game.name);
  }

  function getTags(profile) {
    return asArray(profile?.roleTags || profile?.tags || profile?.roles || [])
      .map((tag) => (typeof tag === "string" ? tag : tag.label || tag.name || tag.id || ""))
      .filter(Boolean);
  }

  function getStats(profile) {
    const stats = profile?.stats || profile?.competitiveStats || {};
    const points = Number(
      stats.rankingPoints ||
      stats.points ||
      stats.score ||
      stats.totalPoints ||
      stats.ranking_points ||
      0
    );

    return {
      tournamentsPlayed: Number(stats.tournamentsPlayed || stats.tournaments_played || stats.tournaments || 0),
      matchesPlayed: Number(stats.matchesPlayed || stats.matches_played || stats.matches || 0),
      wins: Number(stats.wins || 0),
      titles: Number(stats.titles || stats.gold || 0),
      podiums: Number(stats.podiums || stats.medals || 0),
      points,
      rank: Number(stats.rank || stats.position || 0)
    };
  }

  function getUpdatedAt(profile) {
    return profile?.updatedAt || profile?.updated_at || profile?.lastActivityAt || profile?.last_activity_at || profile?.createdAt || profile?.created_at || "";
  }

  function getTimestamp(value) {
    const time = value ? new Date(value).getTime() : 0;
    return Number.isFinite(time) ? time : 0;
  }

  function formatRelativeTime(value) {
    const timestamp = getTimestamp(value);
    if (!timestamp) return "Atualizado recentemente";

    const diff = Date.now() - timestamp;
    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;

    if (diff < hour) return "Atualizado há pouco";
    if (diff < day) return `Atualizado há ${Math.max(1, Math.round(diff / hour))}h`;
    if (diff < day * 30) return `Atualizado há ${Math.max(1, Math.round(diff / day))}d`;

    return new Date(timestamp).toLocaleDateString("pt-BR");
  }

  function getLocation(profile) {
    const city = profile?.city || profile?.cidade || "";
    const region = profile?.state || profile?.estado || profile?.region || profile?.regiao || "";
    const country = profile?.country || profile?.pais || "";

    return [city, region, country].filter(Boolean).join(", ");
  }

  function getRegionValue(profile) {
    const region = profile?.state || profile?.estado || profile?.region || profile?.regiao || profile?.country || profile?.pais || "";
    return String(region || "").trim();
  }

  function getPlayerStatusRaw(profile) {
    const storage = getProfilesStorage();
    const profileId = getProfileId(profile);

    if (storage && typeof storage.getPlayerStatusByUserId === "function") {
      const status = storage.getPlayerStatusByUserId(profileId);
      if (status) return status;
    }

    return profile?.playerStatus || profile?.player_status || profile?.status || null;
  }

  function getTeamFromProfile(profile) {
    if (profile?.currentTeam && typeof profile.currentTeam === "object") return profile.currentTeam;
    if (Array.isArray(profile?.currentTeams) && profile.currentTeams.length) return profile.currentTeams[0];

    if (profile?.currentTeamName || profile?.teamName || profile?.team_name) {
      return {
        id: profile.currentTeamId || profile.teamId || profile.team_id || "",
        slug: profile.currentTeamSlug || profile.teamSlug || profile.team_slug || "",
        name: profile.currentTeamName || profile.teamName || profile.team_name || "",
        tag: profile.currentTeamTag || profile.teamTag || profile.team_tag || ""
      };
    }

    const profileId = getProfileId(profile);
    const membership = state.teamMembers.find((member) => {
      const memberUser = member.userId || member.user_id || member.profileId || member.profile_id || member.profile_slug;
      const status = member.status || "active";
      return memberUser === profileId && status === "active";
    });

    if (membership) {
      const teamId = membership.teamId || membership.team_id || membership.teamSlug || membership.team_slug || membership.team_slug;
      const team = state.teams.find((item) => {
        return [item.id, item.slug, item.teamSlug, item.team_slug].includes(teamId);
      });

      return {
        id: team?.id || teamId,
        slug: team?.slug || team?.teamSlug || team?.team_slug || teamId,
        name: team?.name || team?.teamName || membership.teamName || membership.team_name || teamId,
        tag: team?.tag || team?.teamTag || membership.teamTag || membership.team_tag || ""
      };
    }

    return null;
  }

  function getStatusInfo(profile) {
    const status = getPlayerStatusRaw(profile);
    const membership = getTeamFromProfile(profile);
    const raw = typeof status === "string" ? status : status?.status || status?.id || "";
    const normalized = slugify(raw);

    if (normalized.includes("casual")) return { id: "casual", label: "Casual" };
    if (normalized.includes("proposal") || normalized.includes("proposta") || normalized.includes("looking") || normalized.includes("buscando")) {
      return { id: "open-to-proposals", label: "Aberto a propostas" };
    }
    if (normalized.includes("free") || normalized.includes("agent") || normalized.includes("sem-equipe")) {
      return { id: "free-agent", label: "Free Agent" };
    }
    if (membership) return { id: "with-team", label: "Em equipe" };

    return { id: "free-agent", label: "Free Agent" };
  }

  function isCurrentUserProfile(profile) {
    if (!state.currentUser) return false;

    const userIds = [
      state.currentUser.id,
      state.currentUser.userId,
      state.currentUser.email,
      state.currentUser.user_metadata?.username,
      state.currentUser.user_metadata?.nickname
    ].filter(Boolean).map(String);

    const profileIds = [
      getProfileId(profile),
      profile?.authUserId,
      profile?.auth_user_id,
      profile?.userId,
      profile?.user_id,
      profile?.email,
      profile?.nickname,
      profile?.username
    ].filter(Boolean).map(String);

    return profileIds.some((id) => userIds.includes(id));
  }

  function getScore(profile) {
    const stats = getStats(profile);
    const games = getGames(profile).length;
    const hasAvatar = getAvatarUrl(profile) ? 1 : 0;
    const hasBanner = getBannerUrl(profile) ? 1 : 0;
    const hasTeam = getTeamFromProfile(profile) ? 1 : 0;
    const activity = getTimestamp(getUpdatedAt(profile)) / 100000000000;

    return stats.points + stats.titles * 180 + stats.podiums * 90 + stats.tournamentsPlayed * 8 + games * 12 + hasTeam * 30 + hasAvatar * 24 + hasBanner * 36 + activity;
  }

  function getRankedProfiles() {
    return [...state.profiles]
      .filter(isPublicProfile)
      .sort((a, b) => getScore(b) - getScore(a))
      .map((profile, index) => Object.assign({}, profile, { __rankPosition: index + 1 }));
  }

  function getRankPosition(profile) {
    if (profile.__rankPosition) return profile.__rankPosition;
    const id = getProfileId(profile);
    const ranked = getRankedProfiles();
    const index = ranked.findIndex((item) => getProfileId(item) === id);
    return index >= 0 ? index + 1 : 0;
  }

  function isPublicProfile(profile) {
    const visibility = profile?.visibility || profile?.publicVisibility || profile?.status || "public";
    const normalized = slugify(visibility);
    return !["private", "privado", "banned", "banido", "suspended", "suspenso"].includes(normalized);
  }

  function getSearchText(profile) {
    const team = getTeamFromProfile(profile);
    const status = getStatusInfo(profile);
    const games = getGames(profile).map((game) => game.name).join(" ");
    const tags = getTags(profile).join(" ");

    return [
      getDisplayName(profile),
      getNickname(profile),
      profile?.headline,
      profile?.bio,
      getLocation(profile),
      games,
      tags,
      status.label,
      team?.name,
      team?.tag
    ].filter(Boolean).join(" ").toLowerCase();
  }

  function matchesFilters(profile) {
    const query = state.search.trim().toLowerCase();
    const games = getGames(profile);
    const team = getTeamFromProfile(profile);
    const status = getStatusInfo(profile);
    const stats = getStats(profile);
    const rank = getRankPosition(profile);
    const region = getRegionValue(profile);

    if (query && !getSearchText(profile).includes(query)) return false;

    if (state.game !== "all") {
      const matchesGame = games.some((game) => game.id === state.game || slugify(game.name) === state.game);
      if (!matchesGame) return false;
    }

    if (state.status !== "all" && status.id !== state.status) return false;

    if (state.team !== "all") {
      const teamKey = slugify(team?.slug || team?.id || team?.name || team?.tag || "");
      if (teamKey !== state.team) return false;
    }

    if (state.region !== "all" && slugify(region) !== state.region) return false;

    if (state.ranking === "top-10" && (!rank || rank > 10)) return false;
    if (state.ranking === "top-50" && (!rank || rank > 50)) return false;
    if (state.ranking === "with-points" && stats.points <= 0) return false;
    if (state.ranking === "with-medals" && stats.titles + stats.podiums <= 0) return false;

    return true;
  }

  function sortProfiles(profiles) {
    const list = [...profiles];

    if (state.sort === "ranking") {
      return list.sort((a, b) => getScore(b) - getScore(a));
    }

    if (state.sort === "recent") {
      return list.sort((a, b) => getTimestamp(b.createdAt || b.created_at) - getTimestamp(a.createdAt || a.created_at));
    }

    if (state.sort === "updated") {
      return list.sort((a, b) => getTimestamp(getUpdatedAt(b)) - getTimestamp(getUpdatedAt(a)));
    }

    return list.sort((a, b) => getScore(b) - getScore(a));
  }

  function getFilteredProfiles() {
    return sortProfiles(getRankedProfiles().filter(matchesFilters));
  }

  function getAvailableGames() {
    const map = new Map();
    state.profiles.forEach((profile) => {
      getGames(profile).forEach((game) => {
        map.set(game.id || slugify(game.name), game.name);
      });
    });

    return Array.from(map.entries()).sort((a, b) => a[1].localeCompare(b[1], "pt-BR"));
  }

  function getAvailableTeams() {
    const map = new Map();

    state.profiles.forEach((profile) => {
      const team = getTeamFromProfile(profile);
      if (!team) return;
      const key = slugify(team.slug || team.id || team.name || team.tag);
      if (key) map.set(key, team.name || team.tag || key);
    });

    state.teams.forEach((team) => {
      const name = team.name || team.teamName || team.title || "Equipe";
      const key = slugify(team.slug || team.id || team.teamSlug || name);
      if (key) map.set(key, name);
    });

    return Array.from(map.entries()).sort((a, b) => a[1].localeCompare(b[1], "pt-BR"));
  }

  function getAvailableRegions() {
    const map = new Map();
    state.profiles.forEach((profile) => {
      const region = getRegionValue(profile);
      const key = slugify(region);
      if (key) map.set(key, region);
    });
    return Array.from(map.entries()).sort((a, b) => a[1].localeCompare(b[1], "pt-BR"));
  }

  function fillSelect(selector, firstLabel, options, currentValue) {
    const select = document.querySelector(selector);
    if (!select) return;

    const current = currentValue || select.value || "all";

    select.innerHTML = `
      <option value="all">${escapeHtml(firstLabel)}</option>
      ${options.map(([value, label]) => `<option value="${escapeHtml(value)}">${escapeHtml(label)}</option>`).join("")}
    `;

    select.value = options.some(([value]) => value === current) ? current : "all";
  }

  function renderFilters() {
    fillSelect("[data-profile-game-filter]", "Todos os jogos", getAvailableGames(), state.game);
    fillSelect("[data-profile-team-filter]", "Todas", getAvailableTeams(), state.team);
    fillSelect("[data-profile-region-filter]", "Todas", getAvailableRegions(), state.region);
  }

  function renderAvatar(profile, sizeClass) {
    const avatar = getAvatarUrl(profile);
    const cls = sizeClass ? ` sbw-profiles-v2-avatar--${sizeClass}` : "";

    return `
      <div class="sbw-profiles-v2-avatar${cls}">
        ${avatar ? `<img src="${escapeHtml(avatar)}" alt="${escapeHtml(getDisplayName(profile))}" loading="lazy" />` : escapeHtml(getInitials(profile))}
      </div>
    `;
  }

  function getBannerCss(profile) {
    const banner = getBannerUrl(profile);
    if (!banner) return "";
    return ` style="--profile-banner: linear-gradient(180deg, rgba(4, 12, 24, 0.10), rgba(4, 12, 24, 0.82)), url('${escapeHtml(banner)}');"`;
  }

  function renderMedals(profile) {
    const stats = getStats(profile);
    const medals = [];

    if (stats.titles > 0) medals.push("🏆");
    if (stats.podiums > 0) medals.push("🥉");
    if (stats.tournamentsPlayed > 0) medals.push("🎮");
    if (stats.points > 0) medals.push("✦");

    return `
      <div class="sbw-profiles-v2-medals" aria-label="Conquistas principais">
        ${(medals.length ? medals : ["◇", "◇", "◇"]).slice(0, 4).map((item) => `<span class="sbw-profiles-v2-medal">${item}</span>`).join("")}
      </div>
    `;
  }

  function renderBadges(profile) {
    const team = getTeamFromProfile(profile);
    const status = getStatusInfo(profile);
    const badges = [];

    if (isCurrentUserProfile(profile)) badges.push(`<span class="sbw-profiles-v2-badge sbw-profiles-v2-badge--verified">Você</span>`);
    if (profile?.isVerified || profile?.verified) badges.push(`<span class="sbw-profiles-v2-badge sbw-profiles-v2-badge--verified">Verificado</span>`);
    if (team) badges.push(`<span class="sbw-profiles-v2-badge sbw-profiles-v2-badge--team">${escapeHtml(team.name || team.tag || "Em equipe")}</span>`);
    badges.push(`<span class="sbw-profiles-v2-badge ${status.id === "open-to-proposals" ? "sbw-profiles-v2-badge--open" : ""}">${escapeHtml(status.label)}</span>`);

    return `<div class="sbw-profiles-v2-badges">${badges.join("")}</div>`;
  }

  function renderFeaturedProfile(profile) {
    if (!profile) {
      return `<div class="sbw-profiles-v2-empty">Nenhum perfil público disponível para destaque.</div>`;
    }

    const stats = getStats(profile);
    const team = getTeamFromProfile(profile);
    const games = getGames(profile);
    const tags = getTags(profile);
    const rank = getRankPosition(profile);
    const location = getLocation(profile);
    const profileUrl = getProfileUrl(profile);

    return `
      <article class="sbw-profiles-v2-featured-card${isCurrentUserProfile(profile) ? " is-current-user" : ""}"${getBannerCss(profile)}>
        <div class="sbw-profiles-v2-featured-media">
          ${renderAvatar(profile)}
        </div>

        <div class="sbw-profiles-v2-featured-info">
          ${renderBadges(profile)}
          <h3>${escapeHtml(getDisplayName(profile))}</h3>
          <p>${escapeHtml(profile?.headline || profile?.bio || "Competidor da plataforma -SBW- com perfil público ativo.")}</p>

          <div class="sbw-profiles-v2-meta">
            ${team ? `<span>🛡️ ${escapeHtml(team.name || team.tag)}</span>` : `<span>🧭 Free Agent</span>`}
            ${games[0] ? `<span>🎮 ${escapeHtml(games[0].name)}</span>` : ""}
            ${tags[0] ? `<span>⚔️ ${escapeHtml(tags[0])}</span>` : ""}
            ${location ? `<span>📍 ${escapeHtml(location)}</span>` : ""}
          </div>
        </div>

        <div class="sbw-profiles-v2-featured-stats">
          <div class="sbw-profiles-v2-stat">
            <strong>${rank ? `#${rank}` : "—"}</strong>
            <span>Ranking -SBW-</span>
          </div>
          <div class="sbw-profiles-v2-stat">
            <strong>${stats.points}</strong>
            <span>Pontos</span>
          </div>
          <div class="sbw-profiles-v2-stat">
            <strong>${stats.tournamentsPlayed}</strong>
            <span>Torneios</span>
          </div>
          <div class="sbw-profiles-v2-stat">
            <strong>${stats.titles + stats.podiums}</strong>
            <span>Conquistas</span>
          </div>
          <a class="sbw-profiles-v2-action" href="${profileUrl}">Ver perfil →</a>
        </div>
      </article>
    `;
  }

  function renderProfileCard(profile) {
    const stats = getStats(profile);
    const team = getTeamFromProfile(profile);
    const games = getGames(profile);
    const tags = getTags(profile);
    const status = getStatusInfo(profile);
    const rank = getRankPosition(profile);
    const location = getLocation(profile);

    return `
      <article class="sbw-profiles-v2-card ${isCurrentUserProfile(profile) ? "is-current-user" : ""}">
        <div class="sbw-profiles-v2-card__top"${getBannerCss(profile)}>
          <span class="sbw-profiles-v2-card__status status-${escapeHtml(status.id)}">
            ${escapeHtml(isCurrentUserProfile(profile) ? "Você" : status.label)}
          </span>
          <div class="sbw-profiles-v2-card__avatar">
            ${renderAvatar(profile)}
          </div>
        </div>

        <div class="sbw-profiles-v2-card__body">
          <h3>${escapeHtml(getDisplayName(profile))}${profile?.isVerified || profile?.verified ? " ✦" : ""}</h3>
          <p>${escapeHtml(team ? team.name || team.tag : "Free Agent")}</p>

          <div class="sbw-profiles-v2-card__meta">
            ${games[0] ? `<span>🎮 ${escapeHtml(games[0].name)}</span>` : ""}
            ${tags[0] ? `<span>⚔️ ${escapeHtml(tags[0])}</span>` : ""}
            ${location ? `<span>📍 ${escapeHtml(location)}</span>` : ""}
          </div>

          <div class="sbw-profiles-v2-card__tags">
            ${tags.slice(0, 3).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("") || `<span>Competidor</span>`}
          </div>

          ${renderMedals(profile)}
        </div>

        <div class="sbw-profiles-v2-card__bottom">
          <div>
            <strong>${rank ? `#${rank}` : "—"}</strong>
            <span>Ranking -SBW-</span>
          </div>
          <div>
            <strong>${stats.points}</strong>
            <span>Pontos</span>
          </div>
        </div>

        <a class="sbw-profiles-v2-card-action" href="${getProfileUrl(profile)}">Ver perfil →</a>
      </article>
    `;
  }

  function renderMiniProfile(profile, index, mode) {
    const stats = getStats(profile);
    const team = getTeamFromProfile(profile);
    const subtitle = mode === "recent" ? formatRelativeTime(getUpdatedAt(profile)) : (team ? team.name || team.tag : getStatusInfo(profile).label);
    const score = mode === "recent" ? (getGames(profile)[0]?.name || getStatusInfo(profile).label) : `${stats.points} pts`;

    return `
      <a class="sbw-profiles-v2-mini ${isCurrentUserProfile(profile) ? "is-current-user" : ""}" href="${getProfileUrl(profile)}">
        ${mode === "weekly" ? `<span class="sbw-profiles-v2-mini__rank">${index + 1}</span>` : renderAvatar(profile, "mini")}
        ${mode === "weekly" ? renderAvatar(profile, "mini") : ""}
        <div>
          <h3>${escapeHtml(getDisplayName(profile))}</h3>
          <p>${escapeHtml(subtitle)}</p>
        </div>
        <strong class="sbw-profiles-v2-mini__score">${escapeHtml(score)}</strong>
      </a>
    `;
  }

  function getTeamId(team) {
    return team?.id || team?.slug || team?.teamSlug || team?.team_slug || slugify(team?.name || team?.teamName || "");
  }

  function getTeamName(team) {
    return team?.name || team?.teamName || team?.title || "Equipe -SBW-";
  }

  function getTeamLogo(team) {
    return team?.logoUrl || team?.logo_url || team?.avatarUrl || team?.avatar_url || "";
  }

  function isRecruitingTeam(team) {
    const raw = [
      team?.recruitingStatus,
      team?.recruiting_status,
      team?.recruitmentStatus,
      team?.recruitment_status,
      team?.status,
      team?.publicStatus,
      team?.public_status
    ].filter(Boolean).join(" ");

    if (team?.isRecruiting || team?.recruitingOpen || team?.recruitmentOpen || team?.is_recruiting) return true;
    return /recrut|vaga|open|abert|looking/i.test(raw);
  }

  function getTeamGames(team) {
    const games = asArray(team?.games || team?.mainGames || team?.modalities || team?.divisions || []);
    return games.map((game) => typeof game === "string" ? game : game.name || game.title || game.label || game.game || "").filter(Boolean);
  }

  function renderTeamLogo(team) {
    const logo = getTeamLogo(team);
    const name = getTeamName(team);
    return `
      <div class="sbw-profiles-v2-team-logo">
        ${logo ? `<img src="${escapeHtml(logo)}" alt="${escapeHtml(name)}" loading="lazy" />` : escapeHtml(name.slice(0, 2).toUpperCase())}
      </div>
    `;
  }

  function renderRecruitingTeam(team) {
    const name = getTeamName(team);
    const games = getTeamGames(team);
    const verified = team?.isVerified || team?.verified || team?.verificationStatus === "verified" || team?.verification_status === "verified";
    const id = getTeamId(team);

    return `
      <article class="sbw-profiles-v2-team-card">
        ${renderTeamLogo(team)}
        <div>
          <h3>${escapeHtml(name)} ${verified ? "✦" : ""}</h3>
          <p>${escapeHtml(games.slice(0, 2).join(" • ") || "Recrutamento competitivo")}</p>
        </div>
        <a class="sbw-profiles-v2-team-action" href="${escapeHtml(window.SBWRoutes?.team ? window.SBWRoutes.team(id) : `/equipes/equipe.html?id=${encodeURIComponent(id)}`)}">Ver equipe →</a>
      </article>
    `;
  }

  function renderLoading() {
    const roots = [
      "[data-featured-profile-root]",
      "[data-profiles-list-root]",
      "[data-weekly-profiles-root]",
      "[data-recent-profiles-root]",
      "[data-recruiting-teams-root]"
    ];

    roots.forEach((selector) => {
      const root = document.querySelector(selector);
      if (root) {
        renderDirectoryLoading(root, "Carregando perfis", "Buscando jogadores, equipes e destaques públicos.", 4);
      }
    });
  }

  function renderAll() {
    if (state.loading) {
      renderLoading();
      return;
    }

    const filtered = getFilteredProfiles();
    const ranked = getRankedProfiles();
    const total = document.querySelector("[data-profiles-total]");
    const listRoot = document.querySelector("[data-profiles-list-root]");
    const featuredRoot = document.querySelector("[data-featured-profile-root]");
    const weeklyRoot = document.querySelector("[data-weekly-profiles-root]");
    const recentRoot = document.querySelector("[data-recent-profiles-root]");
    const recruitingRoot = document.querySelector("[data-recruiting-teams-root]");

    if (total) total.textContent = `${filtered.length} resultado${filtered.length === 1 ? "" : "s"}`;

    if (featuredRoot) {
      const featured = ranked.find((profile) => getAvatarUrl(profile) || getBannerUrl(profile)) || ranked[0] || null;
      featuredRoot.innerHTML = renderFeaturedProfile(featured);
    }

    if (listRoot) {
      listRoot.innerHTML = filtered.length
        ? `<div class="sbw-profiles-v2-card-grid">${filtered.map(renderProfileCard).join("")}</div>`
        : (() => {
            const wrapper = document.createElement("div");
            renderDirectoryEmpty(wrapper, "Nenhum perfil encontrado", "Ajuste os filtros ou limpe a busca para encontrar outros jogadores.");
            return wrapper.innerHTML;
          })();
    }

    if (weeklyRoot) {
      const weekly = ranked.slice(0, 5);
      weeklyRoot.innerHTML = weekly.length
        ? `<div class="sbw-profiles-v2-list">${weekly.map((profile, index) => renderMiniProfile(profile, index, "weekly")).join("")}</div>`
        : (() => {
            const wrapper = document.createElement("div");
            renderDirectoryEmpty(wrapper, "Sem destaques semanais", "Os perfis com atividade recente aparecerão aqui.");
            return wrapper.innerHTML;
          })();
    }

    if (recentRoot) {
      const recent = [...state.profiles]
        .filter(isPublicProfile)
        .sort((a, b) => getTimestamp(getUpdatedAt(b)) - getTimestamp(getUpdatedAt(a)))
        .slice(0, 5);

      recentRoot.innerHTML = recent.length
        ? `<div class="sbw-profiles-v2-list">${recent.map((profile, index) => renderMiniProfile(profile, index, "recent")).join("")}</div>`
        : (() => {
            const wrapper = document.createElement("div");
            renderDirectoryEmpty(wrapper, "Nenhum perfil atualizado", "Atualizações recentes de perfis aparecerão aqui.");
            return wrapper.innerHTML;
          })();
    }

    if (recruitingRoot) {
      const recruiting = state.teams
        .filter((team) => isRecruitingTeam(team) || team?.isVerified || team?.verified || team?.verificationStatus === "verified")
        .slice(0, 4);

      recruitingRoot.innerHTML = recruiting.length
        ? `<div class="sbw-profiles-v2-list">${recruiting.map(renderRecruitingTeam).join("")}</div>`
        : (() => {
            const wrapper = document.createElement("div");
            renderDirectoryEmpty(wrapper, "Nenhuma equipe recrutando", "Equipes com recrutamento público aparecerão aqui.");
            return wrapper.innerHTML;
          })();
    }
  }

  function bindFilters() {
    const search = document.querySelector("[data-profile-search]");
    const game = document.querySelector("[data-profile-game-filter]");
    const status = document.querySelector("[data-profile-status-filter]");
    const team = document.querySelector("[data-profile-team-filter]");
    const region = document.querySelector("[data-profile-region-filter]");
    const ranking = document.querySelector("[data-profile-ranking-filter]");
    const sort = document.querySelector("[data-profile-sort-filter]");
    const clear = document.querySelector("[data-profiles-clear-filters]");

    if (search) {
      search.addEventListener("input", () => {
        state.search = search.value || "";
        renderAll();
      });
    }

    [
      [game, "game"],
      [status, "status"],
      [team, "team"],
      [region, "region"],
      [ranking, "ranking"],
      [sort, "sort"]
    ].forEach(([element, key]) => {
      if (!element) return;
      element.addEventListener("change", () => {
        state[key] = element.value || "all";
        renderAll();
      });
    });

    if (clear) {
      clear.addEventListener("click", () => {
        state.search = "";
        state.game = "all";
        state.status = "all";
        state.team = "all";
        state.region = "all";
        state.ranking = "all";
        state.sort = "featured";

        if (search) search.value = "";
        [game, status, team, region, ranking].forEach((element) => {
          if (element) element.value = "all";
        });
        if (sort) sort.value = "featured";

        renderAll();
      });
    }
  }

  async function loadProfiles() {
    const storage = getProfilesStorage();

    if (storage && typeof storage.getProfilesAsync === "function") {
      state.profiles = await storage.getProfilesAsync();
    } else if (storage && typeof storage.getAllProfilesAsync === "function") {
      state.profiles = await storage.getAllProfilesAsync();
    } else if (storage && typeof storage.getProfiles === "function") {
      state.profiles = storage.getProfiles();
    } else {
      state.profiles = readJson(STORAGE_KEYS.profiles, []);
    }

    state.profiles = asArray(state.profiles).filter(isPublicProfile);

    if (storage && typeof storage.getTeamMembers === "function") {
      state.teamMembers = asArray(storage.getTeamMembers());
    } else {
      state.teamMembers = asArray(readJson(STORAGE_KEYS.teamMembers, []));
    }
  }

  async function loadTeams() {
    const teamsStorage = getTeamsStorage();

    try {
      if (teamsStorage && typeof teamsStorage.getAllTeams === "function") {
        state.teams = asArray(await teamsStorage.getAllTeams());
      } else if (teamsStorage && typeof teamsStorage.getTeams === "function") {
        state.teams = asArray(await teamsStorage.getTeams());
      } else {
        state.teams = [];
      }
    } catch (error) {
      console.warn("[SBW Profiles] Não foi possível carregar equipes para recrutamento:", error);
      state.teams = [];
    }
  }

  async function init() {
    state.loading = true;
    renderAll();

    try {
      state.currentUser = await getCurrentUserSafely();
      await Promise.all([loadProfiles(), loadTeams()]);
    } catch (error) {
      console.error("[SBW Profiles] Erro ao carregar perfis:", error);
      state.profiles = [];
      state.teams = [];
      state.teamMembers = [];
    }

    state.loading = false;

    renderFilters();
    bindFilters();
    renderAll();

    requestAnimationFrame(() => {
      document.body.classList.remove("sbw-sidebar-no-transition");
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
