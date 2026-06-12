(function () {
  const config = window.SBW_TEAMS_CONFIG;
  const storage = window.SBWTeamsStorage;
  const models = window.SBWTeamsModels;

   const state = {
    currentUser: null,
    currentAccount: null,
    teams: [],
    activeTeam: null,
    members: [],
    teamInvites: [],
    subteams: [],
    teamType: null,
    tagStatus: null
  };

  const defaultGames = [
    { id: "sf6", name: "Street Fighter 6", category: "Competitivo · Fighting Games" },
    { id: "fatal-fury", name: "Fatal Fury", category: "Competitivo · Fighting Games" },
    { id: "tekken-8", name: "Tekken 8", category: "Competitivo · Fighting Games" },
    { id: "mortal-kombat-1", name: "Mortal Kombat 1", category: "Competitivo · Fighting Games" },
    { id: "guilty-gear-strive", name: "Guilty Gear -Strive-", category: "Competitivo · Fighting Games" },
    { id: "valorant", name: "Valorant", category: "Competitivo · FPS" },
    { id: "counter-strike-2", name: "Counter-Strike 2", category: "Competitivo · FPS" },
    { id: "call-of-duty", name: "Call of Duty", category: "Competitivo · FPS" },
    { id: "apex-legends", name: "Apex Legends", category: "Competitivo · Battle Royale" },
    { id: "fortnite", name: "Fortnite", category: "Competitivo / Casual · Battle Royale" },
    { id: "league-of-legends", name: "League of Legends", category: "Competitivo · MOBA" },
    { id: "dota-2", name: "Dota 2", category: "Competitivo · MOBA" },
    { id: "overwatch-2", name: "Overwatch 2", category: "Competitivo · Hero Shooter" },
    { id: "rocket-league", name: "Rocket League", category: "Competitivo · Esportes" },
    { id: "ea-sports-fc", name: "EA Sports FC", category: "Competitivo · Esportes" },
    { id: "pokemon", name: "Pokémon", category: "Competitivo / Comunidade" },
    { id: "minecraft", name: "Minecraft", category: "Casual / Comunidade" },
    { id: "roblox", name: "Roblox", category: "Casual / Comunidade" },
    { id: "gta-rp", name: "GTA RP", category: "Casual / RP" },
    { id: "variety", name: "Variedade / Outros jogos", category: "Casual / Multigaming" }
  ];

  const publicTitleOptions = [
    {
      value: "",
      label: "Sem função pública"
    },
    {
      value: "pro_player",
      label: "Player Pro"
    },
    {
      value: "coach",
      label: "Coach"
    },
    {
      value: "staff",
      label: "Staff"
    },
    {
      value: "academy_player",
      label: "Academy Player"
    },
    {
      value: "creator",
      label: "Creator"
    },
    {
      value: "analyst",
      label: "Analista"
    },
    {
      value: "social_media",
      label: "Social Media"
    }
  ];

  const editableRoleOptions = [
    {
      value: "vice_captain",
      label: "Vice-capitão"
    },
    {
      value: "manager",
      label: "Manager"
    },
    {
      value: "member",
      label: "Membro"
    }
  ];

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
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch (error) {
      console.warn("Erro ao ler storage:", key, error);
      return fallback;
    }
  }

  function writeJson(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn("Erro ao salvar storage:", key, error);
      return false;
    }
  }

  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function waitForSupabaseClient() {
    for (let attempt = 0; attempt < 30; attempt += 1) {
      const client = window.SBWSupabase?.client;

      if (client?.auth) return client;

      await wait(100);
    }

    return null;
  }

  async function getCurrentAuthUser() {
    try {
      const client = await waitForSupabaseClient();

      if (client?.auth?.getSession) {
        const sessionResult = await client.auth.getSession();
        const sessionUser = sessionResult?.data?.session?.user;
        if (sessionUser) return sessionUser;
      }

      if (client?.auth?.getUser) {
        const userResult = await client.auth.getUser();
        const user = userResult?.data?.user;
        if (user) return user;
      }
    } catch (error) {
      console.warn("[SBW Team Admin] Não foi possível carregar usuário autenticado:", error);
    }

    return null;
  }

  async function getCurrentProfile(user) {
    if (!user) return null;

    try {
      if (window.SBWAuth?.ensureCurrentUserProfile) {
        const ensured = await window.SBWAuth.ensureCurrentUserProfile();
        if (ensured) return ensured;
      }
    } catch (error) {
      console.warn("[SBW Team Admin] ensureCurrentUserProfile falhou:", error);
    }

    try {
      const client = await waitForSupabaseClient();
      if (!client) return null;

      const byAuthUserId = await client
        .from("profiles")
        .select("*")
        .eq("auth_user_id", user.id)
        .maybeSingle();

      if (!byAuthUserId.error && byAuthUserId.data) return byAuthUserId.data;

      const byId = await client
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (!byId.error && byId.data) return byId.data;
    } catch (error) {
      console.warn("[SBW Team Admin] Não foi possível buscar profile:", error);
    }

    return null;
  }

  function getProfileDisplayName(profile, user) {
    const metadata = user?.user_metadata || {};

    return (
      profile?.display_name ||
      profile?.displayName ||
      profile?.nickname ||
      profile?.username ||
      metadata.display_name ||
      metadata.full_name ||
      metadata.name ||
      metadata.nickname ||
      user?.email?.split("@")[0] ||
      "Usuário SBW"
    );
  }

  function getProfileSlug(profile, user) {
    return (
      profile?.slug ||
      profile?.username ||
      profile?.profile_slug ||
      profile?.id ||
      user?.id ||
      ""
    );
  }

  async function getCurrentAccount() {
    if (window.SBWSessionContext?.getCurrentContext) {
      try {
        const context = await window.SBWSessionContext.getCurrentContext({
          refresh: true
        });

        if (!context?.user) {
          return {
            authUser: null,
            profile: null,
            profileSlug: "",
            displayName: "Usuário SBW",
            email: "",
            fallbackUser: null,
            context
          };
        }

        return {
          authUser: context.user,
          profile: context.profile,
          profileSlug: context.profileKey,
          displayName: context.displayName,
          email: context.email,
          fallbackUser: null,
          context
        };
      } catch (error) {
        console.warn("[SBW Team Admin] Contexto central falhou, usando fallback local da página:", error);
      }
    }

    const authUser = await getCurrentAuthUser();

    if (!authUser) {
      return {
        authUser: null,
        profile: null,
        profileSlug: "",
        displayName: "Usuário SBW",
        email: "",
        fallbackUser: null
      };
    }

    const profile = await getCurrentProfile(authUser);

    return {
      authUser,
      profile,
      profileSlug: getProfileSlug(profile, authUser),
      displayName: getProfileDisplayName(profile, authUser),
      email: authUser.email || "",
      fallbackUser: null
    };
  }

  function getParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
  }

  function getDefaultUser() {
    return {
      id: "user-demo-common",
      name: "Usuário Demo",
      nickname: "UsuarioDemo",
      roles: ["user"],
      permissions: {
        can_create_team: false
      }
    };
  }

  function getAuthorizedDemoUser() {
    return {
      id: "user-demo-team-creator",
      name: "Capitão Demo",
      nickname: "CapitaoDemo",
      roles: ["user", "team_creator"],
      permissions: {
        can_create_team: true
      }
    };
  }

  function getCurrentUser() {
    return readJson(config.storageKeys.currentUser, getDefaultUser());
  }

  function saveCurrentUser(user) {
    writeJson(config.storageKeys.currentUser, user);
    state.currentUser = user;
  }

  function getLocalMembers() {
    return readJson(config.storageKeys.teamMembers, []);
  }

  function saveLocalMembers(members) {
    writeJson(config.storageKeys.teamMembers, members);
  }

  function getPublicTitleLabel(value) {
    const option = publicTitleOptions.find((item) => item.value === value);
    return option ? option.label : "";
  }

  function saveLocalMember(memberData) {
    const localMembers = getLocalMembers();
    const existingIndex = localMembers.findIndex((member) => member.id === memberData.id);

    const normalizedMember = {
      id: memberData.id,
      teamId: memberData.teamId,
      userId: memberData.userId || memberData.id,
      nickname: memberData.nickname || "Membro",
      displayName: memberData.displayName || memberData.nickname || "Membro",
      avatarUrl: memberData.avatarUrl || "",
      role: memberData.role || config.memberRoles.member,
      status: memberData.status || "active",
      games: Array.isArray(memberData.games) ? memberData.games : [],
      publicTitle: memberData.publicTitle || "",
      publicTitleLabel: getPublicTitleLabel(memberData.publicTitle || ""),
      createdAt: memberData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      localMembers[existingIndex] = {
        ...localMembers[existingIndex],
        ...normalizedMember
      };
    } else {
      localMembers.push(normalizedMember);
    }

    saveLocalMembers(localMembers);

    return normalizedMember;
  }

  function removeLocalMember(memberId) {
    const localMembers = getLocalMembers();
    const nextMembers = localMembers.filter((member) => member.id !== memberId);
    saveLocalMembers(nextMembers);
  }

  function isVerifiedTeam(team) {
    return team?.verificationStatus === config.verificationStatus.verified;
  }

  function isCaptain(member) {
    return member?.role === config.memberRoles.captain;
  }

  function isAdminSbw(user) {
    const roles = Array.isArray(user?.roles) ? user.roles : [];
    const permissions = user?.permissions || {};

    return Boolean(
      roles.includes("master_admin") ||
      roles.includes("admin_sbw") ||
      roles.includes("admin") ||
      permissions.isMasterAdmin ||
      permissions.is_master_admin ||
      permissions.isAdminSbw ||
      permissions.is_admin_sbw ||
      permissions.isAdmin ||
      permissions.is_admin
    );
  }

  function canManageTeam(user, team) {
    if (!user || !team) return false;

    if (window.SBWSessionContext?.canManageTeam) {
      try {
        const context = state.currentAccount?.context || null;

        if (context) {
          return window.SBWSessionContext.canManageTeam(team, context);
        }
      } catch (error) {
        console.warn("[SBW Team Admin] canManageTeam central falhou:", error);
      }
    }

    if (isAdminSbw(user)) return true;

    const userId = String(user.id || "");
    const profileSlug = String(user.profileSlug || user.profileId || user.userId || "");

    return (
      String(team.captainUserId || "") === userId ||
      String(team.captainUserId || "") === profileSlug ||
      String(team.captainProfileSlug || "") === profileSlug ||
      String(team.metadata?.createdByAuthUserId || "") === userId ||
      String(team.metadata?.createdByProfileSlug || "") === profileSlug
    );
  }

  function getRoot() {
    return document.querySelector("[data-team-admin-root]");
  }

  function getRoleLabel(role) {
    const labels = {
      captain: "Capitão",
      vice_captain: "Vice-capitão",
      manager: "Manager",
      member: "Membro",
      pending: "Pendente"
    };

    return labels[role] || "Membro";
  }

  function getVerificationStatusLabel(status) {
    const labels = {
      not_verified: "Não verificada",
      pending: "Solicitação em análise",
      verified: "Verificada",
      rejected: "Verificação recusada",
      revoked: "Verificação removida"
    };

    return labels[status] || "Não verificada";
  }

  function formatPrize(stats) {
    const amount = Number(stats?.prizeAmount || 0);
    const currency = stats?.prizeCurrency || "BRL";

    if (currency === "BRL") {
      return amount.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
      });
    }

    return `${amount} ${currency}`;
  }

  function getTeamInitials(team) {
    if (team?.tag) return team.tag;

    return String(team?.name || "?")
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 4)
      .toUpperCase();
  }

    /* =========================================================
     SaberWolf v1.5.4 - Tipo público da equipe no painel
     ========================================================= */

  function csvToArray(value) {
    return String(value || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  function arrayToCsv(value) {
    if (!Array.isArray(value)) {
      return "";
    }

    return value.join(", ");
  }

  function getTeamPublicType(team) {
    if (!team || !storage || typeof storage.getTeamTypeByTeamId !== "function") {
      return null;
    }

    const identifiers = [
      team.id,
      team.teamId,
      team.slug,
      team.teamSlug
    ].filter(Boolean);

    for (const identifier of identifiers) {
      const found = storage.getTeamTypeByTeamId(identifier);

      if (found && found.source !== "default") {
        return found;
      }
    }

    return storage.getTeamTypeByTeamId(team.id || team.slug || team.teamId || "");
  }

  function getTeamTypeOptionsForPanel() {
    if (!storage || typeof storage.getTeamTypeOptions !== "function") {
      return [];
    }

    return storage.getTeamTypeOptions();
  }

  function getMemberInitials(member) {
    return String(member?.nickname || member?.displayName || "?")
      .slice(0, 2)
      .toUpperCase();
  }

  function localDemoFallbackAllowed() {
    const host = String(window.location?.hostname || "").toLowerCase();
    return host === "localhost" || host === "127.0.0.1" || host === "" || window.SBW_TEAMS_CONFIG?.allowLocalDemoFallback === true;
  }

  function isLocalDemoTeam(team) {
    const source = String(team?.source || "").toLowerCase();
    const id = String(team?.id || team?.slug || "").toLowerCase();

    return (
      source.includes("local") ||
      source.includes("demo") ||
      id.includes("demo") ||
      id.includes("team-sbw-fgc")
    );
  }

  function teamMatchesContextCurrentTeam(team) {
    const currentTeam = state.currentAccount?.context?.currentTeam || null;
    if (!team || !currentTeam) return false;

    const currentKeys = [
      currentTeam.id,
      currentTeam.slug,
      currentTeam.teamId,
      currentTeam.teamSlug,
      currentTeam.supabaseId
    ].map((value) => String(value || "")).filter(Boolean);

    const teamKeys = [
      team.id,
      team.slug,
      team.teamId,
      team.teamSlug,
      team.supabaseId
    ].map((value) => String(value || "")).filter(Boolean);

    return teamKeys.some((key) => currentKeys.includes(key));
  }

  function teamBelongsDirectlyToCurrentProfile(team) {
    const context = state.currentAccount?.context || null;

    if (!team || !context) return false;

    if (teamMatchesContextCurrentTeam(team)) return true;

    if (window.SBWSessionContext?.teamBelongsToProfile) {
      try {
        return window.SBWSessionContext.teamBelongsToProfile(team, context);
      } catch (error) {
        return false;
      }
    }

    return false;
  }

  function sortTeamsForMyTeamPage(teams) {
    return [...teams].sort((a, b) => {
      const aCurrent = teamMatchesContextCurrentTeam(a) ? 0 : 1;
      const bCurrent = teamMatchesContextCurrentTeam(b) ? 0 : 1;
      if (aCurrent !== bCurrent) return aCurrent - bCurrent;

      const aDirect = teamBelongsDirectlyToCurrentProfile(a) ? 0 : 1;
      const bDirect = teamBelongsDirectlyToCurrentProfile(b) ? 0 : 1;
      if (aDirect !== bDirect) return aDirect - bDirect;

      const aDemo = isLocalDemoTeam(a) ? 1 : 0;
      const bDemo = isLocalDemoTeam(b) ? 1 : 0;
      if (aDemo !== bDemo) return aDemo - bDemo;

      return String(a.name || "").localeCompare(String(b.name || ""), "pt-BR");
    });
  }

  function getOwnedTeams() {
    const user = state.currentUser;
    const manageable = state.teams.filter((team) => {
      return canManageTeam(user, team);
    });

    const directTeams = manageable.filter(teamBelongsDirectlyToCurrentProfile);

    if (directTeams.length) {
      return sortTeamsForMyTeamPage(directTeams);
    }

    if (!localDemoFallbackAllowed()) {
      return sortTeamsForMyTeamPage(manageable.filter((team) => !isLocalDemoTeam(team)));
    }

    return sortTeamsForMyTeamPage(manageable);
  }

  function getGameIds(team) {
    return new Set((team.games || []).map((game) => game.id));
  }

  function getMergedGameOptions(team) {
    const map = new Map();

    defaultGames.forEach((game) => {
      map.set(game.id, game);
    });

    (team.games || []).forEach((game) => {
      map.set(game.id, {
        id: game.id,
        name: game.name,
        category: game.category || "Modalidade"
      });
    });

    return Array.from(map.values());
  }

  function getMemberGamesLabel(member, team) {
    const gameMap = new Map();

    (team.games || []).forEach((game) => {
      gameMap.set(game.id, game.name);
    });

    const games = Array.isArray(member.games) ? member.games : [];

    if (!games.length) return "—";

    return games
      .map((gameId) => gameMap.get(gameId) || gameId)
      .join(", ");
  }

  function getActiveMembers(members) {
    return members.filter((member) => {
      return (member.status || "active") === "active";
    });
  }

  async function loadMembersForTeam(team) {
    if (!team) return [];

    let members = await storage.getTeamMembers(team.slug || team.id);
    members = getActiveMembers(members);

    const hasCaptain = members.some((member) => {
      return member.role === config.memberRoles.captain;
    });

    if (!hasCaptain && (localDemoFallbackAllowed() || String(team.source || "").toLowerCase() !== "supabase")) {
      const captainMember = saveLocalMember({
        id: `member-${team.slug || team.id}-${team.captainUserId || "captain"}`,
        teamId: team.slug || team.id,
        teamSlug: team.slug || team.id,
        userId: team.captainUserId || "captain",
        nickname: team.captainName || "Capitão",
        displayName: `${team.tag || ""} | ${team.captainName || "Capitão"}`.trim(),
        role: config.memberRoles.captain,
        status: "active",
        games: (team.games || []).map((game) => game.id),
        publicTitle: isVerifiedTeam(team) ? "staff" : ""
      });

      members = [captainMember, ...members];
    }

    return members;
  }

  function renderNoTeamState() {
    const root = getRoot();
    if (!root) return;

    root.innerHTML = `
      <section class="sbw-admin-empty-layout">
        <article class="sbw-admin-panel">
          <div class="sbw-admin-kicker">Nenhuma equipe encontrada</div>

          <h2>Você ainda não possui equipe para gerenciar</h2>

          <p>
            Para acessar este painel, você precisa estar logado e ser capitão/dono de uma equipe ativa.
            Se acabou de criar uma equipe e ela não aparecer aqui, atualize a página ou confira se o vínculo
            de capitão foi salvo em <strong>team_members</strong>.
          </p>

          <div class="sbw-admin-actions">
            <a class="sbw-team-btn sbw-team-btn-primary" href="criar-equipe.html">
              Criar equipe
            </a>


            <a class="sbw-team-btn" href="equipes.html">
              Ver equipes
            </a>
          </div>
        </article>
      </section>
    `;

    bindDemoUserButtons();
  }

  function renderAccessDenied(team) {
    const root = getRoot();
    if (!root) return;

    root.innerHTML = `
      <section class="sbw-admin-empty-layout">
        <article class="sbw-admin-panel sbw-admin-danger-panel">
          <div class="sbw-admin-kicker">Acesso bloqueado</div>

          <h2>Você não pode gerenciar esta equipe</h2>

          <p>
            A equipe <strong>${escapeHtml(team.name)}</strong> só pode ser gerenciada
            pelo capitão/dono principal, por cargos autorizados ou por admin SBW.
          </p>

          <div class="sbw-admin-actions">
            <a class="sbw-team-btn sbw-team-btn-primary" href="minha-equipe.html">
              Abrir minha equipe
            </a>

            <a class="sbw-team-btn" href="equipes.html">
              Voltar para equipes
            </a>
          </div>
        </article>
      </section>
    `;
  }

  function renderVerificationCard(team) {
    const canRequest = storage.canRequestVerification(team);
    const canCreateSubteam = storage.canCreateSubteam(team);

    let verificationMessage = "";

    if (team.verificationStatus === config.verificationStatus.verified) {
      verificationMessage = `
        <div class="sbw-admin-status-box sbw-admin-status-success">
          <strong>Equipe verificada</strong>
          <span>
            Esta equipe possui selo de verificação, limite maior, criação de subequipes
            e funções públicas avançadas para membros.
          </span>
        </div>
      `;
    } else if (team.verificationStatus === config.verificationStatus.pending) {
      verificationMessage = `
        <div class="sbw-admin-status-box sbw-admin-status-warning">
          <strong>Solicitação em análise</strong>
          <span>A SBW precisa avaliar a equipe antes de liberar o selo de verificação.</span>
        </div>
      `;
    } else {
      verificationMessage = `
        <div class="sbw-admin-status-box">
          <strong>Equipe não verificada</strong>
          <span>
            Equipes verificadas podem receber selo, limite maior, criar subequipes
            e marcar membros como Player Pro, Coach, Staff, Creator e Academy.
          </span>
        </div>
      `;
    }

    return `
      <div class="sbw-admin-card">
        <div class="sbw-admin-card-heading">
          <div>
            <span>Verificação</span>
            <h3>Status da equipe</h3>
          </div>
        </div>

        ${verificationMessage}

        <div class="sbw-admin-info-grid">
          <div>
            <strong>${escapeHtml(getVerificationStatusLabel(team.verificationStatus))}</strong>
            <span>Status atual</span>
          </div>

          <div>
            <strong>${Number(team.memberLimit || 0)}</strong>
            <span>Limite de membros</span>
          </div>

          <div>
            <strong>${canCreateSubteam ? "Liberado" : "Bloqueado"}</strong>
            <span>Criar subequipe</span>
          </div>
        </div>

        <div class="sbw-admin-actions">
          ${
            canRequest
              ? `
                <button class="sbw-team-btn sbw-team-btn-primary" type="button" data-request-verification>
                  Solicitar verificação
                </button>
              `
              : ""
          }

          ${
            canCreateSubteam
              ? `
                <button class="sbw-team-btn" type="button" data-create-subteam>
                  Criar subequipe
                </button>
              `
              : `
                <button class="sbw-team-btn" type="button" disabled title="Disponível apenas para equipes verificadas">
                  Criar subequipe bloqueado
                </button>
              `
          }
        </div>

        <p class="sbw-admin-note">
          A verificação real será feita pela SBW. O botão de solicitação futuramente pode levar
          para um canal específico no Discord ou abrir um fluxo interno.
        </p>
      </div>
    `;
  }

  function renderTeamSelector(ownedTeams, activeTeam) {
    if (ownedTeams.length <= 1) {
      return "";
    }

    return `
      <div class="sbw-admin-card">
        <div class="sbw-admin-card-heading">
          <div>
            <span>Minhas equipes</span>
            <h3>Selecionar equipe</h3>
          </div>
        </div>

        <div class="sbw-admin-team-switcher">
          ${ownedTeams
            .map((team) => {
              const activeClass = team.id === activeTeam.id ? "is-active" : "";

              return `
                <a 
                  class="sbw-admin-team-switch ${activeClass}" 
                  href="minha-equipe.html?id=${encodeURIComponent(team.slug || team.id)}"
                >
                  <strong>${escapeHtml(team.name)}</strong>
                  <span>${escapeHtml(team.tag)} | ${escapeHtml(models.getTeamTypeLabel(team))}</span>
                </a>
              `;
            })
            .join("")}
        </div>
      </div>
    `;
  }

  function renderRoleSelect(member) {
    if (isCaptain(member)) {
      return `
        <span class="sbw-admin-member-locked">
          Capitão protegido
        </span>
      `;
    }

    return `
      <select class="sbw-admin-select" data-member-role-select data-member-id="${escapeHtml(member.id)}">
        ${editableRoleOptions
          .map((option) => {
            const selected = member.role === option.value ? "selected" : "";

            return `
              <option value="${escapeHtml(option.value)}" ${selected}>
                ${escapeHtml(option.label)}
              </option>
            `;
          })
          .join("")}
      </select>
    `;
  }

  function renderPublicTitleSelect(team, member) {
    if (!isVerifiedTeam(team)) {
      return `
        <span class="sbw-admin-member-locked">
          Bloqueado
        </span>
      `;
    }

    return `
      <select class="sbw-admin-select" data-member-public-title-select data-member-id="${escapeHtml(member.id)}">
        ${publicTitleOptions
          .map((option) => {
            const selected = (member.publicTitle || "") === option.value ? "selected" : "";

            return `
              <option value="${escapeHtml(option.value)}" ${selected}>
                ${escapeHtml(option.label)}
              </option>
            `;
          })
          .join("")}
      </select>
    `;
  }

  function renderMemberPublicBadge(member) {
    const label = getPublicTitleLabel(member.publicTitle || "");

    if (!label) {
      return "";
    }

    return `
      <span class="sbw-member-title-badge">
        ${escapeHtml(label)}
      </span>
    `;
  }

  function renderMemberActions(member) {
    if (isCaptain(member)) {
      return `
        <span class="sbw-admin-member-locked">
          Protegido
        </span>
      `;
    }

    return `
      <button class="sbw-admin-mini-danger-btn" type="button" data-remove-member data-member-id="${escapeHtml(member.id)}">
        Remover
      </button>
    `;
  }

function renderMembersCard(team, members) {
  const verified = isVerifiedTeam(team);
  const activeMembers = getActiveMembers(members);
  const memberLimit = Number(team.memberLimit || config.limits.commonTeamMembers || 50);

  return `
    <div class="sbw-admin-card sbw-admin-members-card">
      <div class="sbw-admin-card-heading">
        <div>
          <span>Membros</span>
          <h3>Gerenciamento de membros</h3>
        </div>

        <small>${activeMembers.length}/${memberLimit} membros</small>
      </div>

      ${
        verified
          ? `
            <div class="sbw-verified-feature-box">
              <strong>Equipe verificada</strong>
              <span>
                Funções públicas liberadas: Player Pro, Coach, Staff, Academy, Creator,
                Analista e Social Media.
              </span>
            </div>
          `
          : `
            <div class="sbw-verified-feature-box sbw-verified-feature-box-locked">
              <strong>Funções públicas bloqueadas</strong>
              <span>
                Equipes comuns gerenciam cargos internos. Funções públicas avançadas
                são liberadas para equipes verificadas.
              </span>
            </div>
          `
      }

      <div class="sbw-admin-members-toolbar">
        <p>
          Use esta lista para acompanhar cargos, funções públicas e organização interna da equipe.
          Novos membros entram pelo fluxo de convites.
        </p>
      </div>

      ${
        activeMembers.length
          ? `
            <div class="sbw-admin-member-list-compact">
              <div class="sbw-admin-member-list-head">
                <span>Membro</span>
                <span>Cargo interno</span>
                <span>Função pública</span>
                <span>Modalidades</span>
                <span>Ações</span>
              </div>

              ${activeMembers
                .map((member) => {
                  return `
                    <article class="sbw-admin-member-list-row">
                      <div class="sbw-admin-member-person">
                        <div class="sbw-rank-avatar">
                          ${escapeHtml(getMemberInitials(member))}
                        </div>

                        <div>
                          <strong>
                            ${escapeHtml(member.displayName || member.nickname)}
                            ${renderMemberPublicBadge(member)}
                          </strong>

                          <small>${escapeHtml(member.nickname || "Membro")}</small>
                        </div>
                      </div>

                      <div class="sbw-admin-member-cell">
                        ${renderRoleSelect(member)}
                      </div>

                      <div class="sbw-admin-member-cell">
                        ${renderPublicTitleSelect(team, member)}
                      </div>

                      <div class="sbw-admin-member-cell sbw-admin-member-games">
                        ${escapeHtml(getMemberGamesLabel(member, team))}
                      </div>

                      <div class="sbw-admin-member-cell">
                        ${renderMemberActions(member)}
                      </div>
                    </article>
                  `;
                })
                .join("")}
            </div>
          `
          : `
            <div class="sbw-empty-state">
              Nenhum membro ativo encontrado.
            </div>
          `
      }

      <p class="sbw-admin-note">
        Cargo interno define permissões de gerenciamento. Função pública define como o membro aparece para o público.
      </p>
    </div>
  `;
}

  function renderTeamTypeCard(team, teamType) {
    const safeTeamType = teamType || getTeamPublicType(team);
    const options = getTeamTypeOptionsForPanel();
    const currentType = safeTeamType?.type || "competitive";

    if (!options.length) {
      return `
        <div class="sbw-admin-card">
          <div class="sbw-admin-card-heading">
            <div>
              <span>Tipo público</span>
              <h3>Identidade da equipe</h3>
            </div>
          </div>

          <div class="sbw-admin-status-box">
            <strong>Módulo indisponível</strong>
            <span>As opções de tipo de equipe ainda não foram carregadas.</span>
          </div>
        </div>
      `;
    }

    return `
      <div class="sbw-admin-card sbw-admin-team-type-card">
        <div class="sbw-admin-card-heading">
          <div>
            <span>Tipo público</span>
            <h3>Identidade da equipe</h3>
          </div>

          <small>${escapeHtml(safeTeamType?.label || "Competitiva")}</small>
        </div>

        <div class="sbw-admin-status-box">
          <strong>Como esta equipe aparece publicamente</strong>
          <span>
            Esse tipo aparece no perfil público da equipe, nos cards da listagem e futuramente será usado em filtros,
            transferências, convites e rankings.
          </span>
        </div>

        <div class="sbw-form-grid">
          <label class="sbw-form-field">
            <span>Tipo da equipe</span>

            <select name="teamPublicType">
              ${options
                .map((option) => {
                  const selected = option.id === currentType ? "selected" : "";

                  return `
                    <option value="${escapeHtml(option.id)}" ${selected}>
                      ${escapeHtml(option.label)}
                    </option>
                  `;
                })
                .join("")}
            </select>
          </label>

          <label class="sbw-form-field">
            <span>Tags de foco</span>

            <input
              type="text"
              name="teamTypeFocusTags"
              value="${escapeHtml(arrayToCsv(safeTeamType?.focusTags || []))}"
              placeholder="FGC, Competitivo, Comunidade"
            />

            <small class="sbw-form-help">
              Separe por vírgula. Exemplo: FGC, Competitivo, Comunidade.
            </small>
          </label>
        </div>

        <label class="sbw-form-field">
          <span>Descrição da identidade</span>

          <textarea
            name="teamTypeDescriptionText"
            rows="4"
            maxlength="220"
            placeholder="Descreva o foco público da equipe."
          >${escapeHtml(safeTeamType?.descriptionText || safeTeamType?.description || "")}</textarea>
        </label>
      </div>
    `;
  }

  function renderInvitePlayerCard(team) {
    return `
      <div class="sbw-admin-card sbw-admin-invite-card">
        <div class="sbw-admin-card-heading">
          <div>
            <span>Convites</span>
            <h3>Pesquisar e convidar jogador</h3>
          </div>
        </div>

        <p class="sbw-admin-note">
          Busque um perfil público pelo nome ou nickname. O convite fica registrado para o jogador
          e respeita a regra de 1 usuário por equipe ativa.
        </p>

        <div class="sbw-admin-search-row">
          <input type="search" data-player-search-input placeholder="Digite o nome ou nickname do jogador..." />
          <button class="sbw-team-btn" type="button" data-player-search-button>Pesquisar</button>
        </div>

        <div class="sbw-admin-player-results" data-player-search-results>
          <span>Digite pelo menos 2 caracteres para pesquisar jogadores.</span>
        </div>

        <div class="sbw-admin-invite-feedback" data-player-invite-feedback></div>
      </div>
    `;
  }

  function renderGamesCard(team) {
    const selectedGameIds = getGameIds(team);
    const gameOptions = getMergedGameOptions(team);

    return `
      <div class="sbw-admin-card">
        <div class="sbw-admin-card-heading">
          <div>
            <span>Modalidades</span>
            <h3>Jogos em que a equipe atua</h3>
          </div>

          <small>${selectedGameIds.size} selecionado${selectedGameIds.size === 1 ? "" : "s"}</small>
        </div>

        <div class="sbw-admin-game-picker">
          ${gameOptions
            .map((game) => {
              const checked = selectedGameIds.has(game.id) ? "checked" : "";

              return `
                <label class="sbw-game-option">
                  <input
                    type="checkbox"
                    value="${escapeHtml(game.id)}"
                    data-admin-game-option
                    ${checked}
                  />

                  <span>
                    <strong>${escapeHtml(game.name)}</strong>
                    <small>${escapeHtml(game.category || "Modalidade")}</small>
                  </span>
                </label>
              `;
            })
            .join("")}
        </div>
      </div>
    `;
  }

  const adminPanelTabs = [
    { id: "geral", label: "Geral", hint: "Resumo" },
    { id: "perfil", label: "Perfil público", hint: "Dados públicos" },
    { id: "membros", label: "Membros", hint: "Pessoal" },
    { id: "convites", label: "Convites", hint: "Entradas" },
    { id: "titulos", label: "Títulos", hint: "Conquistas" },
    { id: "rankings", label: "Rankings", hint: "Posição" },
    { id: "redes", label: "Redes sociais", hint: "Links" },
    { id: "configuracoes", label: "Configurações", hint: "Status" }
  ];

  function getTeamKey(team) {
    return team?.slug || team?.id || team?.teamId || team?.supabaseId || "";
  }

  function getActiveAdminTab() {
    const requested = getParam("tab") || "geral";
    const exists = adminPanelTabs.some((tab) => tab.id === requested);
    return exists ? requested : "geral";
  }

  function getAdminTabUrl(team, tabId) {
    const teamKey = getTeamKey(team);
    const query = new URLSearchParams();

    if (teamKey) query.set("id", teamKey);
    query.set("tab", tabId);

    return `minha-equipe.html?${query.toString()}`;
  }

  function getAdminTabPanelClass(tabId, activeTab) {
    return `sbw-admin-tab-panel ${tabId === activeTab ? "is-active" : ""}`;
  }

  function renderAdminTabNavigation(team, activeTab) {
    return `
      <nav class="sbw-admin-tabs" aria-label="Navegação do painel da equipe">
        ${adminPanelTabs
          .map((tab) => {
            const activeClass = tab.id === activeTab ? "is-active" : "";

            return `
              <a
                class="sbw-admin-tab-link ${activeClass}"
                href="${escapeHtml(getAdminTabUrl(team, tab.id))}"
                data-admin-tab-link
                data-admin-tab="${escapeHtml(tab.id)}"
              >
                <strong>${escapeHtml(tab.label)}</strong>
                <span>${escapeHtml(tab.hint)}</span>
              </a>
            `;
          })
          .join("")}
      </nav>
    `;
  }

  function renderAdminQuickMetric(label, value, note) {
    return `
      <div class="sbw-admin-quick-metric">
        <strong>${escapeHtml(value)}</strong>
        <span>${escapeHtml(label)}</span>
        ${note ? `<small>${escapeHtml(note)}</small>` : ""}
      </div>
    `;
  }

  function getRecruitmentLabel(team) {
    return team?.recruitment?.isOpen || team?.metadata?.recruitmentOpen ? "Aberto" : "Fechado";
  }

  function getTeamRankingPosition(team) {
    return (
      team?.ranking?.globalPosition ||
      team?.ranking?.position ||
      team?.stats?.globalRank ||
      team?.stats?.rankingPosition ||
      team?.metadata?.globalRank ||
      "—"
    );
  }

  function getTeamPoints(team) {
    return (
      team?.ranking?.points ||
      team?.stats?.points ||
      team?.stats?.rankingPoints ||
      team?.metadata?.points ||
      0
    );
  }

  function renderGeneralTab(team, members) {
    const activeMembers = getActiveMembers(members);
    const memberLimit = Number(team.memberLimit || config.limits.commonTeamMembers || 50);
    const gamesCount = Array.isArray(team.games) ? team.games.length : 0;
    const verifiedLabel = getVerificationStatusLabel(team.verificationStatus);

    return `
      <div class="sbw-admin-card sbw-admin-overview-card">
        <div class="sbw-admin-card-heading">
          <div>
            <span>Geral</span>
            <h3>Resumo da equipe</h3>
          </div>

          <small>${escapeHtml(team.tag || "SBW")}</small>
        </div>

        <div class="sbw-admin-overview-grid">
          ${renderAdminQuickMetric("Membros", `${activeMembers.length}/${memberLimit}`, "limite atual")}
          ${renderAdminQuickMetric("Modalidades", String(gamesCount), "jogos vinculados")}
          ${renderAdminQuickMetric("Ranking global", String(getTeamRankingPosition(team)), "equipes -SBW-")}
          ${renderAdminQuickMetric("Recrutamento", getRecruitmentLabel(team), "status público")}
        </div>

        <div class="sbw-admin-status-box">
          <strong>${escapeHtml(verifiedLabel)}</strong>
          <span>
            Este painel é a central privada da equipe. Use as abas para editar perfil público,
            membros, convites, títulos, rankings e redes sociais sem misturar com a página pública.
          </span>
        </div>

        <div class="sbw-admin-actions">
          <a class="sbw-team-btn sbw-team-btn-primary" href="equipe.html?id=${encodeURIComponent(getTeamKey(team))}">
            Ver perfil público
          </a>

          <a class="sbw-team-btn" href="equipes.html">
            Lista de equipes
          </a>
        </div>
      </div>

      <div class="sbw-admin-card">
        <div class="sbw-admin-card-heading">
          <div>
            <span>Próximas áreas</span>
            <h3>Estrutura do painel</h3>
          </div>
        </div>

        <div class="sbw-admin-feature-list">
          <div><strong>Perfil público</strong><span>Nome, tag, descrição, identidade visual, modalidades e recrutamento.</span></div>
          <div><strong>Membros</strong><span>Capitão, staff, cargos internos e funções públicas.</span></div>
          <div><strong>Convites</strong><span>Busca de jogadores, convites enviados e solicitações recebidas.</span></div>
          <div><strong>Rankings</strong><span>Posição global da equipe e leitura por modalidade.</span></div>
        </div>
      </div>
    `;
  }

  function renderPublicProfileTab(team, primary, secondary) {
    return `
      <div class="sbw-admin-card">
        <div class="sbw-admin-card-heading">
          <div>
            <span>Dados públicos</span>
            <h3>Informações principais</h3>
          </div>
        </div>

        <div class="sbw-form-grid">
          <label class="sbw-form-field">
            <span>Nome da equipe</span>
            <input type="text" name="name" maxlength="50" value="${escapeHtml(team.name)}" required />
          </label>

          <label class="sbw-form-field">
            <span>Tag oficial</span>
            <input 
              type="text" 
              name="tag" 
              maxlength="${config.tagRules.extendedMaxLength}" 
              value="${escapeHtml(team.tag)}" 
              data-admin-tag-input
              required 
            />

            <small class="sbw-form-help" data-admin-tag-help>
              Tags iguais ou reservadas não são permitidas.
            </small>
          </label>
        </div>

        <label class="sbw-form-field">
          <span>Descrição pública</span>
          <textarea name="description" rows="4" maxlength="260">${escapeHtml(team.description)}</textarea>
        </label>
      </div>

      ${renderTeamTypeCard(team, state.teamType)}

      <div class="sbw-admin-card">
        <div class="sbw-admin-card-heading">
          <div>
            <span>Identidade visual</span>
            <h3>Logo, banner e cores</h3>
          </div>
        </div>

        <div class="sbw-form-grid">
          <label class="sbw-form-field">
            <span>Logo da equipe</span>
            <input type="url" name="logoUrl" value="${escapeHtml(team.logoUrl || "")}" placeholder="https://.../logo.png" />
            <small class="sbw-form-help">Por enquanto use uma URL pública. Upload via Storage será conectado depois.</small>
          </label>

          <label class="sbw-form-field">
            <span>Banner da equipe</span>
            <input type="url" name="bannerUrl" value="${escapeHtml(team.bannerUrl || "")}" placeholder="https://.../banner.jpg" />
            <small class="sbw-form-help">Imagem larga recomendada para o topo do perfil público.</small>
          </label>

          <label class="sbw-form-field">
            <span>Cor principal</span>
            <input type="color" name="primaryColor" value="${escapeHtml(primary)}" />
          </label>

          <label class="sbw-form-field">
            <span>Cor secundária</span>
            <input type="color" name="secondaryColor" value="${escapeHtml(secondary)}" />
          </label>
        </div>
      </div>

      ${renderGamesCard(team)}

      <div class="sbw-admin-card">
        <div class="sbw-admin-card-heading">
          <div>
            <span>Recrutamento</span>
            <h3>Status de recrutamento</h3>
          </div>
        </div>

        <label class="sbw-admin-checkline">
          <input type="checkbox" name="recruitmentOpen" ${(team.recruitment?.isOpen || team.metadata?.recruitmentOpen) ? "checked" : ""} />
          <span>Equipe aberta para receber novos jogadores</span>
        </label>

        <div class="sbw-form-grid">
          <label class="sbw-form-field">
            <span>Modalidades com vagas</span>
            <input type="text" name="recruitmentGames" value="${escapeHtml(arrayToCsv(team.recruitment?.games || team.metadata?.recruitmentGames || []))}" placeholder="Street Fighter 6, Tekken 8, Valorant" />
          </label>

          <label class="sbw-form-field">
            <span>Requisitos / observação</span>
            <input type="text" name="recruitmentDescription" value="${escapeHtml(team.recruitment?.description || team.metadata?.recruitmentDescription || "")}" placeholder="Ex: jogadores ativos, treino semanal, Discord obrigatório" />
          </label>
        </div>
      </div>
    `;
  }

  function renderSocialLinksTab(team) {
    return `
      <div class="sbw-admin-card">
        <div class="sbw-admin-card-heading">
          <div>
            <span>Redes</span>
            <h3>Links públicos</h3>
          </div>
        </div>

        <div class="sbw-form-grid">
          <label class="sbw-form-field">
            <span>Discord</span>
            <input type="url" name="discord" value="${escapeHtml(team.socialLinks?.discord || "")}" />
          </label>

          <label class="sbw-form-field">
            <span>YouTube</span>
            <input type="url" name="youtube" value="${escapeHtml(team.socialLinks?.youtube || "")}" />
          </label>

          <label class="sbw-form-field">
            <span>Instagram</span>
            <input type="url" name="instagram" value="${escapeHtml(team.socialLinks?.instagram || "")}" />
          </label>

          <label class="sbw-form-field">
            <span>X / Twitter</span>
            <input type="url" name="x" value="${escapeHtml(team.socialLinks?.x || "")}" />
          </label>

          <label class="sbw-form-field">
            <span>Twitch</span>
            <input type="url" name="twitch" value="${escapeHtml(team.socialLinks?.twitch || "")}" />
          </label>

          <label class="sbw-form-field">
            <span>TikTok</span>
            <input type="url" name="tiktok" value="${escapeHtml(team.socialLinks?.tiktok || "")}" />
          </label>

          <label class="sbw-form-field">
            <span>Site oficial</span>
            <input type="url" name="website" value="${escapeHtml(team.socialLinks?.website || team.socialLinks?.site || "")}" />
          </label>
        </div>
      </div>
    `;
  }

  function getTeamLocalInvites(team) {
    const teamKey = getTeamKey(team);

    return (state.teamInvites || []).filter((invite) => {
      return String(invite.teamId || invite.teamSlug || "") === String(teamKey);
    });
  }

  function getInviteStatusLabel(status) {
    const labels = {
      pending: "Pendente",
      accepted: "Aceito",
      declined: "Recusado",
      cancelled: "Cancelado",
      expired: "Expirado"
    };

    return labels[status] || status || "Pendente";
  }

  function getInviteTypeLabel(invite) {
    return invite?.inviteType === "player_to_team" ? "Solicitação recebida" : "Convite enviado";
  }

  function renderInviteSourceBadge(invite) {
    const source = String(invite?.source || "local-demo");

    if (source === "supabase") {
      return `<em class="sbw-admin-invite-source">Supabase</em>`;
    }

    return `<em class="sbw-admin-invite-source sbw-admin-invite-source--local">Fallback local</em>`;
  }

  function renderTeamInvitesList(team) {
    const invites = getTeamLocalInvites(team);

    if (!invites.length) {
      return `
        <div class="sbw-empty-state">
          Nenhum convite ou solicitação registrada para esta equipe ainda.
        </div>
      `;
    }

    return `
      <div class="sbw-admin-invite-list">
        ${invites
          .map((invite) => {
            const status = invite.status || "pending";
            const type = getInviteTypeLabel(invite);
            const dateLabel = invite.createdAt || invite.invitedAt
              ? new Date(invite.createdAt || invite.invitedAt).toLocaleDateString("pt-BR")
              : "Data não informada";

            return `
              <article class="sbw-admin-invite-row">
                <div>
                  <strong>${escapeHtml(invite.displayName || invite.profileName || invite.nickname || invite.userId || "Jogador")}</strong>
                  <span>${escapeHtml(type)} · ${escapeHtml(getInviteStatusLabel(status))}</span>
                </div>

                <div class="sbw-admin-invite-meta">
                  ${renderInviteSourceBadge(invite)}
                  <small>${escapeHtml(dateLabel)}</small>
                </div>
              </article>
            `;
          })
          .join("")}
      </div>
    `;
  }

  function renderInvitesTab(team) {
    return `
      ${renderInvitePlayerCard(team)}

      <div class="sbw-admin-card">
        <div class="sbw-admin-card-heading">
          <div>
            <span>Convites recebidos e enviados</span>
            <h3>Histórico de convites</h3>
          </div>
        </div>

        <p class="sbw-admin-note">
          Convites enviados aparecem aqui. Quando o jogador aceitar no Meu Perfil, ele passa a entrar
          no vínculo de membros da equipe, respeitando o limite de 1 equipe ativa por usuário.
        </p>

        ${renderTeamInvitesList(team)}
      </div>
    `;
  }

  function renderTitlesTab(team) {
    const titles = Array.isArray(team.achievements) ? team.achievements : [];

    return `
      <div class="sbw-admin-card">
        <div class="sbw-admin-card-heading">
          <div>
            <span>Títulos</span>
            <h3>Conquistas -SBW-</h3>
          </div>
        </div>

        ${
          titles.length
            ? `
              <div class="sbw-admin-title-list">
                ${titles
                  .map((title) => `
                    <article class="sbw-admin-title-row">
                      <strong>${escapeHtml(title.name || title.tournament || "Título")}</strong>
                      <span>${escapeHtml(title.game || "Modalidade")} · ${escapeHtml(title.date || "Data não informada")}</span>
                    </article>
                  `)
                  .join("")}
              </div>
            `
            : `
              <div class="sbw-empty-state">
                Nenhuma conquista -SBW- registrada para esta equipe ainda.
              </div>
            `
        }
      </div>

      <div class="sbw-admin-card">
        <div class="sbw-admin-card-heading">
          <div>
            <span>Conquistas externas</span>
            <h3>Área preparada para dados externos</h3>
          </div>
        </div>

        <div class="sbw-admin-status-box">
          <strong>Nenhuma conquista externa vinculada ainda</strong>
          <span>
            Esta seção fica reservada para futuras integrações e registros externos, sem misturar com as conquistas internas da plataforma.
          </span>
        </div>
      </div>
    `;
  }

  function renderRankingsTab(team) {
    const points = Number(getTeamPoints(team) || 0);
    const globalPosition = getTeamRankingPosition(team);
    const games = Array.isArray(team.games) ? team.games : [];

    return `
      <div class="sbw-admin-card">
        <div class="sbw-admin-card-heading">
          <div>
            <span>Ranking global</span>
            <h3>Posição da equipe na -SBW-</h3>
          </div>

          <small>${escapeHtml(String(points))} pontos</small>
        </div>

        <div class="sbw-admin-overview-grid">
          ${renderAdminQuickMetric("Posição global", String(globalPosition), "ranking de equipes")}
          ${renderAdminQuickMetric("Pontos", String(points), "pontuação acumulada")}
          ${renderAdminQuickMetric("Modalidades", String(games.length), "áreas vinculadas")}
          ${renderAdminQuickMetric("Títulos", String(Number(team.stats?.titles || 0)), "conquistas internas")}
        </div>

        <div class="sbw-admin-actions">
          <a class="sbw-team-btn sbw-team-btn-primary" href="../rankings/rankings.html">
            Ver ranking completo
          </a>
        </div>
      </div>

      <div class="sbw-admin-card">
        <div class="sbw-admin-card-heading">
          <div>
            <span>Modalidades</span>
            <h3>Ranking por jogo/modalidade</h3>
          </div>
        </div>

        ${
          games.length
            ? `
              <div class="sbw-admin-feature-list">
                ${games
                  .map((game) => `
                    <a class="sbw-admin-feature-link" href="../rankings/rankings.html">
                      <strong>${escapeHtml(game.name || game.id || "Modalidade")}</strong>
                      <span>${escapeHtml(game.category || "Ranking da modalidade")}</span>
                    </a>
                  `)
                  .join("")}
              </div>
            `
            : `
              <div class="sbw-empty-state">
                Nenhuma modalidade vinculada ao ranking desta equipe ainda.
              </div>
            `
        }
      </div>
    `;
  }

  function renderSettingsTab(team) {
    return `
      ${renderVerificationCard(team)}

      <div class="sbw-admin-card">
        <div class="sbw-admin-card-heading">
          <div>
            <span>Regras da equipe</span>
            <h3>Permissões e limites</h3>
          </div>
        </div>

        <div class="sbw-admin-feature-list">
          <div><strong>Equipe comum</strong><span>Limite menor de membros e sem criação de subequipes.</span></div>
          <div><strong>Equipe verificada</strong><span>Limite maior, selo público e possibilidade de subequipes.</span></div>
          <div><strong>Aprovação -SBW-</strong><span>Verificação e permissões especiais dependem da administração da plataforma.</span></div>
        </div>
      </div>
    `;
  }

  function renderAdminPanel() {
    const root = getRoot();
    if (!root || !state.activeTeam) return;

    const team = state.activeTeam;
    const ownedTeams = getOwnedTeams();
    const activeTab = getActiveAdminTab();

    const primary = team.theme?.primaryColor || "#00e5ff";
    const secondary = team.theme?.secondaryColor || "#7c3cff";

    root.innerHTML = `
      <section 
        class="sbw-admin-layout"
        style="--team-primary: ${escapeHtml(primary)}; --team-secondary: ${escapeHtml(secondary)};"
      >
        <aside class="sbw-admin-sidebar">
          <div class="sbw-admin-team-card">
            <div class="sbw-admin-team-logo">
              ${escapeHtml(getTeamInitials(team))}
            </div>

            <div>
              <span class="sbw-admin-kicker">${escapeHtml(models.getTeamTypeLabel(team))}</span>

              <h2>
                ${escapeHtml(team.name)}
                ${
                  team.verificationStatus === config.verificationStatus.verified
                    ? `<span class="sbw-verified-badge">✓</span>`
                    : ""
                }
              </h2>

              <p>${escapeHtml(team.tag)} | Painel privado</p>
            </div>
          </div>

          ${renderAdminTabNavigation(team, activeTab)}

          <div class="sbw-admin-side-links">
            <a class="sbw-team-btn sbw-team-btn-primary" href="equipe.html?id=${encodeURIComponent(getTeamKey(team))}">
              Ver perfil público
            </a>

            <a class="sbw-team-btn" href="equipes.html">
              Lista de equipes
            </a>
          </div>

          ${renderTeamSelector(ownedTeams, team)}
        </aside>

        <section class="sbw-admin-content">
          <div class="sbw-admin-tab-heading">
            <span>Painel da equipe</span>
            <h2>${escapeHtml(adminPanelTabs.find((tab) => tab.id === activeTab)?.label || "Geral")}</h2>
          </div>

          <form class="sbw-admin-form" data-admin-team-form>
            <div class="${getAdminTabPanelClass("geral", activeTab)}" data-admin-tab-panel="geral">
              ${renderGeneralTab(team, state.members)}
            </div>

            <div class="${getAdminTabPanelClass("perfil", activeTab)}" data-admin-tab-panel="perfil">
              ${renderPublicProfileTab(team, primary, secondary)}
            </div>

            <div class="${getAdminTabPanelClass("membros", activeTab)}" data-admin-tab-panel="membros">
              ${renderMembersCard(team, state.members)}
            </div>

            <div class="${getAdminTabPanelClass("convites", activeTab)}" data-admin-tab-panel="convites">
              ${renderInvitesTab(team)}
            </div>

            <div class="${getAdminTabPanelClass("titulos", activeTab)}" data-admin-tab-panel="titulos">
              ${renderTitlesTab(team)}
            </div>

            <div class="${getAdminTabPanelClass("rankings", activeTab)}" data-admin-tab-panel="rankings">
              ${renderRankingsTab(team)}
            </div>

            <div class="${getAdminTabPanelClass("redes", activeTab)}" data-admin-tab-panel="redes">
              ${renderSocialLinksTab(team)}
            </div>

            <div class="${getAdminTabPanelClass("configuracoes", activeTab)}" data-admin-tab-panel="configuracoes">
              ${renderSettingsTab(team)}
            </div>

            <div class="sbw-admin-save-bar">
              <button class="sbw-team-btn sbw-team-btn-primary" type="submit">
                Salvar alterações
              </button>

              <span data-admin-save-result></span>
            </div>
          </form>
        </section>
      </section>
    `;

    bindAdminEvents();
  }

  async function validateTag(tag, ignoredTeamId) {
    const help = document.querySelector("[data-admin-tag-help]");

    if (!help) return false;

    const normalized = models.normalizeTag(tag);

    if (!normalized) {
      state.tagStatus = null;
      help.className = "sbw-form-help";
      help.textContent = "Tags iguais ou reservadas não são permitidas.";
      return false;
    }

    if (normalized.length < config.tagRules.minLength) {
      state.tagStatus = {
        available: false,
        reason: `A tag precisa ter pelo menos ${config.tagRules.minLength} caracteres.`
      };
    } else if (normalized.length > config.tagRules.extendedMaxLength) {
      state.tagStatus = {
        available: false,
        reason: `A tag pode ter no máximo ${config.tagRules.extendedMaxLength} caracteres.`
      };
    } else {
      state.tagStatus = await storage.isTagAvailable(normalized, ignoredTeamId);
    }

    help.className = `sbw-form-help ${state.tagStatus.available ? "sbw-form-help-success" : "sbw-form-help-error"}`;
    help.textContent = state.tagStatus.reason;

    return state.tagStatus.available;
  }

  function getSelectedGamesFromForm(team) {
    const selected = new Set();

    document.querySelectorAll("[data-admin-game-option]").forEach((input) => {
      if (input.checked) {
        selected.add(input.value);
      }
    });

    const map = new Map();

    defaultGames.forEach((game) => {
      map.set(game.id, game);
    });

    (team.games || []).forEach((game) => {
      map.set(game.id, game);
    });

    return Array.from(selected).map((gameId) => {
      const game = map.get(gameId);

      return {
        id: gameId,
        name: game?.name || gameId,
        category: game?.category || "Modalidade",
        active: true
      };
    });
  }

  async function handleSaveTeam(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const result = document.querySelector("[data-admin-save-result]");
    const formData = new FormData(form);

    const team = state.activeTeam;

    const name = String(formData.get("name") || "").trim();
    const tag = models.normalizeTag(formData.get("tag"));

    if (!name || !tag) {
      if (result) {
        result.innerHTML = `<span class="sbw-admin-result-error">Preencha nome e tag.</span>`;
      }

      return;
    }

    const tagIsValid = await validateTag(tag, team.id);

    if (!tagIsValid) {
      if (result) {
        result.innerHTML = `<span class="sbw-admin-result-error">A tag informada não está disponível.</span>`;
      }

      return;
    }

        const teamTypePayload = {
      type: String(formData.get("teamPublicType") || "competitive"),
      focusTags: csvToArray(formData.get("teamTypeFocusTags")),
      descriptionText: String(formData.get("teamTypeDescriptionText") || "").trim()
    };

    const games = getSelectedGamesFromForm(team);


    const updatedTeam = {
      ...team,
      name,
      tag,
      description: String(formData.get("description") || "").trim(),
      logoUrl: String(formData.get("logoUrl") || "").trim(),
      bannerUrl: String(formData.get("bannerUrl") || "").trim(),

      theme: {
        ...(team.theme || {}),
        primaryColor: String(formData.get("primaryColor") || "#00e5ff"),
        secondaryColor: String(formData.get("secondaryColor") || "#7c3cff"),
        accentColor: "#ffffff",
        backgroundMode: "dark",
        source: "manual-admin-demo"
      },

      socialLinks: {
        ...(team.socialLinks || {}),
        discord: String(formData.get("discord") || "").trim(),
        youtube: String(formData.get("youtube") || "").trim(),
        instagram: String(formData.get("instagram") || "").trim(),
        x: String(formData.get("x") || "").trim(),
        twitch: String(formData.get("twitch") || "").trim(),
        tiktok: String(formData.get("tiktok") || "").trim(),
        website: String(formData.get("website") || "").trim()
      },

      recruitment: {
        isOpen: formData.get("recruitmentOpen") === "on",
        games: csvToArray(formData.get("recruitmentGames")),
        description: String(formData.get("recruitmentDescription") || "").trim(),
        updatedAt: new Date().toISOString()
      },

      metadata: {
        ...(team.metadata || {}),
        recruitmentOpen: formData.get("recruitmentOpen") === "on",
        recruitmentGames: csvToArray(formData.get("recruitmentGames")),
        recruitmentDescription: String(formData.get("recruitmentDescription") || "").trim(),
        visualEditedFromAdmin: true
      },

      games
    };

    const savedTeam = await storage.saveTeam(updatedTeam);

    if (!savedTeam) {
      if (result) {
        result.innerHTML = `<span class="sbw-admin-result-error">Não foi possível salvar.</span>`;
      }

      return;
    }

       state.activeTeam = savedTeam;

    if (typeof storage.saveTeamTypeByTeamId === "function") {
      state.teamType = storage.saveTeamTypeByTeamId(savedTeam.id || team.id, teamTypePayload);
    }

    if (result) {
      result.innerHTML = `<span class="sbw-admin-result-success">Alterações salvas.</span>`;
    }

    await reloadState(savedTeam.id);
    renderAdminPanel();
  }

  async function handleRequestVerification() {
    if (!state.activeTeam) return;

    const confirmed = window.confirm(
      "Solicitar verificação desta equipe? O status será marcado como 'Solicitação em análise'."
    );

    if (!confirmed) return;

    const updatedTeam = {
      ...state.activeTeam,
      verificationStatus: config.verificationStatus.pending
    };

    const savedTeam = await storage.saveTeam(updatedTeam);

    if (!savedTeam) return;

    await reloadState(savedTeam.id);
    renderAdminPanel();
  }

  function handleCreateSubteam() {
    const team = state.activeTeam;

    if (!team) return;

    window.location.href = `criar-subequipe.html?parent=${encodeURIComponent(team.id)}`;
  }

  async function handleAddDemoMember() {
    const team = state.activeTeam;

    if (!team) return;

    const memberNumber = state.members.length + 1;
    const firstGame = team.games?.[0]?.id || "";

    saveLocalMember({
      id: `member-${team.id}-demo-${Date.now()}`,
      teamId: team.id,
      userId: `user-demo-member-${Date.now()}`,
      nickname: `Membro ${memberNumber}`,
      displayName: `${team.tag || "TEAM"} | Membro ${memberNumber}`,
      role: config.memberRoles.member,
      status: "active",
      games: firstGame ? [firstGame] : [],
      publicTitle: ""
    });

    await reloadState(team.id);
    renderAdminPanel();
  }

  async function handleMemberRoleChange(event) {
    const select = event.currentTarget;
    const memberId = select.dataset.memberId;
    const newRole = select.value;

    const member = state.members.find((item) => item.id === memberId);

    if (!member) return;

    if (isCaptain(member)) {
      alert("O capitão principal não pode ser alterado por este painel demo.");
      return;
    }

    saveLocalMember({
      ...member,
      role: newRole
    });

    await reloadState(state.activeTeam.id);
    renderAdminPanel();
  }

  async function handleMemberPublicTitleChange(event) {
    const select = event.currentTarget;
    const memberId = select.dataset.memberId;
    const newPublicTitle = select.value;

    const team = state.activeTeam;
    const member = state.members.find((item) => item.id === memberId);

    if (!team || !member) return;

    if (!isVerifiedTeam(team)) {
      alert("Funções públicas avançadas estão disponíveis apenas para equipes verificadas.");
      return;
    }

    saveLocalMember({
      ...member,
      publicTitle: newPublicTitle,
      publicTitleLabel: getPublicTitleLabel(newPublicTitle)
    });

    await reloadState(team.id);
    renderAdminPanel();
  }

  async function handleRemoveMember(event) {
    const button = event.currentTarget;
    const memberId = button.dataset.memberId;

    const member = state.members.find((item) => item.id === memberId);

    if (!member) return;

    if (isCaptain(member)) {
      alert("O capitão principal não pode ser removido.");
      return;
    }

    const confirmed = window.confirm(
      `Remover ${member.displayName || member.nickname} da equipe?`
    );

    if (!confirmed) return;

    removeLocalMember(member.id);

    await reloadState(state.activeTeam.id);
    renderAdminPanel();
  }

  function getProfileName(profile) {
    return (
      profile?.displayName ||
      profile?.display_name ||
      profile?.nickname ||
      profile?.username ||
      profile?.slug ||
      profile?.id ||
      "Perfil SBW"
    );
  }

  function getProfileId(profile) {
    return profile?.slug || profile?.username || profile?.userId || profile?.user_id || profile?.id || "";
  }

  function getProfileAvatar(profile) {
    return profile?.avatarUrl || profile?.avatar_url || profile?.picture || "";
  }

  function getProfileSubtitle(profile) {
    const games = Array.isArray(profile?.mainGames) ? profile.mainGames : [];
    const gameLabel = games[0]?.name || profile?.mainGame || profile?.main_game || "";
    const status = profile?.headline || profile?.profileType || profile?.status || "Perfil público";

    return gameLabel ? `${status} · ${gameLabel}` : status;
  }

  function profileMatchesCurrentAccount(profile) {
    const profileId = String(getProfileId(profile) || "");
    const account = state.currentAccount || {};
    const context = account.context || {};
    const identifiers = context.identifiers || [];

    return identifiers.some((identifier) => String(identifier || "") === profileId);
  }

  async function getSearchableProfiles() {
    try {
      const profilesStorage = window.SBWProfilesStorage;

      if (profilesStorage?.getAllProfilesAsync) {
        return await profilesStorage.getAllProfilesAsync();
      }

      if (profilesStorage?.getProfilesAsync) {
        return await profilesStorage.getProfilesAsync();
      }

      if (profilesStorage?.getAllProfiles) {
        return profilesStorage.getAllProfiles();
      }

      if (profilesStorage?.getProfiles) {
        return profilesStorage.getProfiles();
      }
    } catch (error) {
      console.warn("[SBW Team Admin] Erro ao buscar perfis:", error);
    }

    return [];
  }

  async function getAllActiveMembershipsSafely() {
    try {
      if (storage.getAllActiveTeamMembers) {
        return await storage.getAllActiveTeamMembers();
      }
    } catch (error) {
      console.warn("[SBW Team Admin] Não foi possível carregar membros ativos:", error);
    }

    return getActiveMembers(state.members);
  }

  function getMembershipForProfile(profileId, memberships) {
    const key = String(profileId || "");

    return (memberships || []).find((member) => {
      return (
        String(member.profileSlug || "") === key ||
        String(member.profileId || "") === key ||
        String(member.userId || "") === key ||
        String(member.authUserId || "") === key
      );
    }) || null;
  }

  function getPendingInviteForProfile(profileId, invites) {
    const key = String(profileId || "");

    return (invites || []).find((invite) => {
      return (
        String(invite.profileSlug || invite.invitedProfileSlug || invite.userId || "") === key &&
        String(invite.status || "pending") === "pending"
      );
    }) || null;
  }

  function getProfileSearchText(profile) {
    return [
      getProfileName(profile),
      profile?.nickname,
      profile?.username,
      profile?.displayName,
      profile?.display_name,
      profile?.email,
      profile?.headline,
      profile?.mainGame,
      profile?.main_game,
      ...(Array.isArray(profile?.roleTags) ? profile.roleTags : []),
      ...(Array.isArray(profile?.publicTags) ? profile.publicTags : [])
    ]
      .join(" ")
      .toLowerCase();
  }

  async function handleSearchPlayer() {
    const input = document.querySelector("[data-player-search-input]");
    const results = document.querySelector("[data-player-search-results]");
    const feedback = document.querySelector("[data-player-invite-feedback]");

    if (!input || !results || !state.activeTeam) return;

    const query = String(input.value || "").trim().toLowerCase();

    if (feedback) feedback.innerHTML = "";

    if (query.length < 2) {
      results.innerHTML = `<span>Digite pelo menos 2 caracteres para pesquisar jogadores.</span>`;
      return;
    }

    results.innerHTML = `<span>Pesquisando perfis...</span>`;

    const [profiles, memberships] = await Promise.all([
      getSearchableProfiles(),
      getAllActiveMembershipsSafely()
    ]);

    const teamKey = getTeamKey(state.activeTeam);
    const invites = state.teamInvites || [];

    const matches = profiles
      .filter((profile) => {
        if (!profile || profileMatchesCurrentAccount(profile)) return false;
        return getProfileSearchText(profile).includes(query);
      })
      .slice(0, 10);

    if (!matches.length) {
      results.innerHTML = `<span>Nenhum perfil encontrado para essa busca.</span>`;
      return;
    }

    results.innerHTML = matches
      .map((profile) => {
        const profileId = getProfileId(profile);
        const name = getProfileName(profile);
        const avatar = getProfileAvatar(profile);
        const membership = getMembershipForProfile(profileId, memberships);
        const pendingInvite = getPendingInviteForProfile(profileId, invites);
        const currentMemberTeamKey = String(membership?.teamSlug || membership?.teamId || "");
        const alreadyInThisTeam = Boolean(membership && currentMemberTeamKey === String(teamKey));
        const alreadyInOtherTeam = Boolean(membership && currentMemberTeamKey && currentMemberTeamKey !== String(teamKey));
        const disabled = alreadyInThisTeam || alreadyInOtherTeam || Boolean(pendingInvite);

        let buttonLabel = "Convidar";
        let statusLabel = "Disponível para convite";

        if (alreadyInThisTeam) {
          buttonLabel = "Já é membro";
          statusLabel = "Já faz parte desta equipe";
        } else if (alreadyInOtherTeam) {
          buttonLabel = "Indisponível";
          statusLabel = `Já está em ${membership.teamName || membership.teamTag || "outra equipe"}`;
        } else if (pendingInvite) {
          buttonLabel = "Convite pendente";
          statusLabel = "Convite já enviado";
        }

        return `
          <div class="sbw-admin-player-result">
            <div class="sbw-admin-player-avatar">
              ${avatar ? `<img src="${escapeHtml(avatar)}" alt="" />` : escapeHtml(String(name).charAt(0).toUpperCase() || "P")}
            </div>

            <div>
              <strong>${escapeHtml(name)}</strong>
              <span>${escapeHtml(getProfileSubtitle(profile))}</span>
              <small>${escapeHtml(statusLabel)}</small>
            </div>

            <button
              class="sbw-team-btn"
              type="button"
              data-invite-player
              data-profile-id="${escapeHtml(profileId)}"
              data-profile-name="${escapeHtml(name)}"
              data-profile-avatar="${escapeHtml(avatar)}"
              data-profile-subtitle="${escapeHtml(getProfileSubtitle(profile))}"
              ${disabled ? "disabled" : ""}
            >
              ${escapeHtml(buttonLabel)}
            </button>
          </div>
        `;
      })
      .join("");

    bindInviteButtons();
  }

  async function createInviteForProfile(profileId, profileName, profileAvatar, profileSubtitle) {
    if (!state.activeTeam || !profileId) {
      return {
        ok: false,
        message: "Equipe ou perfil inválido."
      };
    }

    const teamKey = getTeamKey(state.activeTeam);
    const inviterProfileSlug = state.currentAccount?.profileSlug || state.currentUser?.profileSlug || "";

    if (storage.createTeamInvite) {
      return await storage.createTeamInvite({
        teamId: teamKey,
        teamSlug: teamKey,
        teamName: state.activeTeam.name,
        teamTag: state.activeTeam.tag,
        teamLogoUrl: state.activeTeam.logoUrl || "",
        userId: profileId,
        profileId,
        profileSlug: profileId,
        invitedProfileSlug: profileId,
        invitedByProfileSlug: inviterProfileSlug,
        displayName: profileName,
        profileName,
        nickname: profileName,
        avatarUrl: profileAvatar,
        role: "member",
        roleOffered: "Membro",
        functionName: "Player",
        status: "pending",
        inviteType: "team_to_player",
        message: "Convite enviado pelo painel Minha Equipe.",
        metadata: {
          subtitle: profileSubtitle,
          createdFrom: "team-admin-v1.6.14"
        }
      });
    }

    return {
      ok: false,
      message: "Storage de convites indisponível."
    };
  }

  function bindInviteButtons() {
    document.querySelectorAll("[data-invite-player]").forEach((button) => {
      button.addEventListener("click", async function () {
        const feedback = document.querySelector("[data-player-invite-feedback]");
        const profileId = button.dataset.profileId || "";
        const profileName = button.dataset.profileName || "Jogador";
        const profileAvatar = button.dataset.profileAvatar || "";
        const profileSubtitle = button.dataset.profileSubtitle || "";

        button.disabled = true;
        button.textContent = "Enviando...";

        const result = await createInviteForProfile(profileId, profileName, profileAvatar, profileSubtitle);

        if (result?.ok) {
          button.textContent = result.duplicate ? "Já convidado" : "Convite enviado";

          if (feedback) {
            feedback.innerHTML = `<span class="sbw-admin-result-success">${escapeHtml(result.message || "Convite registrado.")}</span>`;
          }

          await reloadState(getTeamKey(state.activeTeam));
          renderAdminPanel();
          return;
        }

        button.disabled = false;
        button.textContent = "Convidar";

        if (feedback) {
          feedback.innerHTML = `<span class="sbw-admin-result-error">${escapeHtml(result?.message || "Não foi possível criar o convite.")}</span>`;
        }
      });
    });
  }

  function bindDemoUserButtons() {
    const authorizeButton = document.querySelector("[data-demo-authorize]");

    if (authorizeButton) {
      authorizeButton.addEventListener("click", async function () {
        saveCurrentUser(getAuthorizedDemoUser());
        await init();
      });
    }
  }

  function bindAdminEvents() {
    const form = document.querySelector("[data-admin-team-form]");
    const tagInput = document.querySelector("[data-admin-tag-input]");
    const requestVerificationButton = document.querySelector("[data-request-verification]");
    const createSubteamButton = document.querySelector("[data-create-subteam]");
    const addDemoMemberButton = document.querySelector("[data-add-demo-member]");
    const playerSearchButton = document.querySelector("[data-player-search-button]");
    const playerSearchInput = document.querySelector("[data-player-search-input]");

    if (form) {
      form.addEventListener("submit", handleSaveTeam);
    }

    if (tagInput) {
      tagInput.addEventListener("input", async function () {
        const tag = models.normalizeTag(tagInput.value);
        tagInput.value = tag;
        await validateTag(tag, state.activeTeam.id);
      });
    }

    if (requestVerificationButton) {
      requestVerificationButton.addEventListener("click", handleRequestVerification);
    }

    if (createSubteamButton) {
      createSubteamButton.addEventListener("click", handleCreateSubteam);
    }

    if (addDemoMemberButton) {
      addDemoMemberButton.addEventListener("click", handleAddDemoMember);
    }

    if (playerSearchButton) {
      playerSearchButton.addEventListener("click", handleSearchPlayer);
    }

    if (playerSearchInput) {
      playerSearchInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
          event.preventDefault();
          handleSearchPlayer();
        }
      });
    }

    document.querySelectorAll("[data-member-role-select]").forEach((select) => {
      select.addEventListener("change", handleMemberRoleChange);
    });

    document.querySelectorAll("[data-member-public-title-select]").forEach((select) => {
      select.addEventListener("change", handleMemberPublicTitleChange);
    });

    document.querySelectorAll("[data-remove-member]").forEach((button) => {
      button.addEventListener("click", handleRemoveMember);
    });
  }

  function findTeamByAnyId(teamId) {
    const key = String(teamId || "");

    if (!key) return null;

    return (
      state.teams.find((team) => {
        return (
          String(team.id || "") === key ||
          String(team.slug || "") === key ||
          String(team.teamId || "") === key ||
          String(team.supabaseId || "") === key
        );
      }) || null
    );
  }

  async function loadTeamsForManagement() {
    if (!storage) return [];

    if (typeof storage.getAllTeamsForSession === "function") {
      return await storage.getAllTeamsForSession();
    }

    if (typeof storage.getAllTeamsForAdmin === "function") {
      return await storage.getAllTeamsForAdmin();
    }

    if (typeof storage.getAllTeams === "function") {
      return await storage.getAllTeams({ publicOnly: false });
    }

    return [];
  }


  function buildCurrentManagerUser(account) {
    const fallbackUser = account?.fallbackUser || null;
    const authUser = account?.authUser || null;
    const context = account?.context || null;

    return {
      ...(fallbackUser || {}),
      id: authUser?.id || fallbackUser?.id || "",
      userId: authUser?.id || fallbackUser?.userId || fallbackUser?.id || "",
      profileSlug: account?.profileSlug || fallbackUser?.profileSlug || fallbackUser?.id || "",
      profileId: account?.profileSlug || fallbackUser?.profileId || fallbackUser?.id || "",
      name: account?.displayName || fallbackUser?.name || "Usuário SBW",
      nickname: account?.displayName || fallbackUser?.nickname || "Usuário SBW",
      email: account?.email || fallbackUser?.email || "",
      roles: context?.permissions?.roles || fallbackUser?.roles || [],
      permissions: context?.permissions || fallbackUser?.permissions || {}
    };
  }

  async function reloadState(activeTeamId) {
    if (window.SBWSessionContext?.clearCache) {
      window.SBWSessionContext.clearCache();
    }

    state.currentAccount = await getCurrentAccount();
    state.currentUser = buildCurrentManagerUser(state.currentAccount);
    state.teams = await loadTeamsForManagement();

    const team = findTeamByAnyId(activeTeamId);

    state.activeTeam = team;
    state.members = team ? await loadMembersForTeam(team) : [];
    state.teamInvites = team && storage.getTeamInvites ? await storage.getTeamInvites(getTeamKey(team)) : [];
    state.subteams = team ? await storage.getSubteams(team.slug || team.id) : [];
    state.teamType = team ? getTeamPublicType(team) : null;
  }

  async function init() {
    const root = getRoot();

    if (window.SBWPageState?.renderLoading) {
      window.SBWPageState.renderLoading(root, {
        title: "Carregando painel da equipe",
        message: "Validando sessão, equipe gerenciável, membros e convites.",
        rows: 4
      });
    }

    try {
      if (window.SBWSessionContext?.clearCache) {
        window.SBWSessionContext.clearCache();
      }

      state.currentAccount = await getCurrentAccount();
      state.currentUser = buildCurrentManagerUser(state.currentAccount);
      state.teams = await loadTeamsForManagement();

      const requestedTeamId = getParam("id");
      const ownedTeams = getOwnedTeams();

      if (!ownedTeams.length) {
        renderNoTeamState();
        return;
      }

      let activeTeam = null;

      if (requestedTeamId) {
        activeTeam = findTeamByAnyId(requestedTeamId);

        if (activeTeam && !canManageTeam(state.currentUser, activeTeam)) {
          renderAccessDenied(activeTeam);
          return;
        }
      }

      if (!activeTeam) {
        activeTeam = ownedTeams.find(teamMatchesContextCurrentTeam) || ownedTeams[0];
      }

      state.activeTeam = activeTeam;
      state.members = await loadMembersForTeam(activeTeam);
      state.teamInvites = storage.getTeamInvites ? await storage.getTeamInvites(getTeamKey(activeTeam)) : [];
      state.subteams = await storage.getSubteams(activeTeam.slug || activeTeam.id);
      state.teamType = getTeamPublicType(activeTeam);

      renderAdminPanel();
    } catch (error) {
      console.error("[SBW Team Admin] Falha ao carregar painel da equipe:", error);

      if (window.SBWPageState?.renderError) {
        window.SBWPageState.renderError(root, {
          title: "Não foi possível carregar Minha Equipe",
          message: "A sessão, a equipe ou os vínculos de membros não responderam corretamente.",
          details: error?.message || ""
        });
      }
    } finally {
      window.SBWPageState?.markReady?.();
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();