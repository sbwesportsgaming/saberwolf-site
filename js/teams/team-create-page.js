(function () {
  "use strict";

  const config = window.SBW_TEAMS_CONFIG || {};
  const storage = window.SBWTeamsStorage;
  const models = window.SBWTeamsModels || {};

  const state = {
    authUser: null,
    profile: null,
    account: null,
    selectedGames: new Set(),
    tagStatus: null,
    existingTeam: null,
    existingMembership: null
  };

  const defaultGames = [
    { id: "sf6", name: "Street Fighter 6", category: "Competitivo · Fighting Games" },
    { id: "fatal-fury", name: "Fatal Fury", category: "Competitivo · Fighting Games" },
    { id: "tekken-8", name: "Tekken 8", category: "Competitivo · Fighting Games" },
    { id: "mortal-kombat-1", name: "Mortal Kombat 1", category: "Competitivo · Fighting Games" },
    { id: "guilty-gear-strive", name: "Guilty Gear -Strive-", category: "Competitivo · Fighting Games" },
    { id: "granblue-versus", name: "Granblue Fantasy Versus", category: "Competitivo · Fighting Games" },
    { id: "dragon-ball-fighterz", name: "Dragon Ball FighterZ", category: "Competitivo · Fighting Games" },
    { id: "valorant", name: "Valorant", category: "Competitivo · FPS" },
    { id: "counter-strike-2", name: "Counter-Strike 2", category: "Competitivo · FPS" },
    { id: "call-of-duty", name: "Call of Duty", category: "Competitivo · FPS" },
    { id: "apex-legends", name: "Apex Legends", category: "Competitivo · Battle Royale" },
    { id: "fortnite", name: "Fortnite", category: "Competitivo / Casual · Battle Royale" },
    { id: "rainbow-six-siege", name: "Rainbow Six Siege", category: "Competitivo · FPS" },
    { id: "league-of-legends", name: "League of Legends", category: "Competitivo · MOBA" },
    { id: "dota-2", name: "Dota 2", category: "Competitivo · MOBA" },
    { id: "overwatch-2", name: "Overwatch 2", category: "Competitivo · Hero Shooter" },
    { id: "rocket-league", name: "Rocket League", category: "Competitivo · Esportes" },
    { id: "ea-sports-fc", name: "EA Sports FC", category: "Competitivo · Esportes" },
    { id: "efootball", name: "eFootball", category: "Competitivo · Esportes" },
    { id: "nba-2k", name: "NBA 2K", category: "Competitivo · Esportes" },
    { id: "pokemon", name: "Pokémon", category: "Competitivo / Comunidade" },
    { id: "minecraft", name: "Minecraft", category: "Casual / Comunidade" },
    { id: "roblox", name: "Roblox", category: "Casual / Comunidade" },
    { id: "gta-rp", name: "GTA RP", category: "Casual / RP" },
    { id: "variety", name: "Variedade / Outros jogos", category: "Casual / Multigaming" }
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
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      console.warn("[SBW Create Team] Erro ao ler storage:", key, error);
      return fallback;
    }
  }

  function writeJson(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn("[SBW Create Team] Erro ao salvar storage:", key, error);
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

  function getRoot() {
    return document.querySelector("[data-team-create-root]");
  }

  function normalizeTag(tag) {
    if (typeof models.normalizeTag === "function") {
      return models.normalizeTag(tag);
    }

    return String(tag || "")
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "");
  }

  function createSlug(value) {
    if (typeof models.createSlug === "function") {
      return models.createSlug(value);
    }

    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
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

  function getProfileAvatar(profile, user) {
    const metadata = user?.user_metadata || {};

    return (
      profile?.avatar_url ||
      profile?.avatarUrl ||
      metadata.avatar_url ||
      metadata.picture ||
      ""
    );
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
      console.warn("[SBW Create Team] Não foi possível carregar usuário:", error);
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
      console.warn("[SBW Create Team] ensureCurrentUserProfile falhou:", error);
    }

    try {
      const client = await waitForSupabaseClient();
      if (!client) return null;

      const byAuthUserId = await client
        .from("profiles")
        .select("*")
        .eq("auth_user_id", user.id)
        .maybeSingle();

      if (!byAuthUserId.error && byAuthUserId.data) {
        return byAuthUserId.data;
      }

      const byId = await client
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (!byId.error && byId.data) {
        return byId.data;
      }
    } catch (error) {
      console.warn("[SBW Create Team] Não foi possível buscar profile:", error);
    }

    return null;
  }

  async function getCurrentAccount() {
    const authUser = await getCurrentAuthUser();

    if (!authUser) {
      return null;
    }

    const profile = await getCurrentProfile(authUser);
    const profileSlug = getProfileSlug(profile, authUser);
    const displayName = getProfileDisplayName(profile, authUser);
    const avatarUrl = getProfileAvatar(profile, authUser);

    return {
      authUser,
      profile,
      profileSlug,
      displayName,
      avatarUrl,
      email: authUser.email || ""
    };
  }

  function isMainTeam(team) {
    const mainType = config.teamTypes?.mainTeam || "main_team";
    return !team?.parentTeamId && !team?.parentTeamSlug && String(team?.teamType || mainType) === String(mainType);
  }

  async function getExistingMainTeam(account) {
    if (!account || !storage?.getAllTeams) return null;

    const teams = await storage.getAllTeams();
    const profileSlug = String(account.profileSlug || "");
    const userId = String(account.authUser?.id || "");

    return (
      teams.find((team) => {
        if (!isMainTeam(team)) return false;

        return (
          String(team.captainUserId || "") === userId ||
          String(team.captainProfileSlug || "") === profileSlug ||
          String(team.metadata?.createdByAuthUserId || "") === userId ||
          String(team.metadata?.createdByProfileSlug || "") === profileSlug
        );
      }) || null
    );
  }

  async function getExistingActiveMembership(account) {
    if (!account || !storage?.getAllTeams || !storage?.getTeamMembers) return null;

    const teams = await storage.getAllTeams();
    const profileSlug = String(account.profileSlug || "");
    const userId = String(account.authUser?.id || "");

    for (const team of teams) {
      const teamKey = team.slug || team.id;
      const members = await storage.getTeamMembers(teamKey);

      const found = members.find((member) => {
        const status = String(member.status || "active");
        if (status !== "active") return false;

        return (
          String(member.profileSlug || "") === profileSlug ||
          String(member.profileId || "") === profileSlug ||
          String(member.userId || "") === profileSlug ||
          String(member.userId || "") === userId ||
          String(member.authUserId || "") === userId
        );
      });

      if (found) {
        return {
          team,
          member: found
        };
      }
    }

    return null;
  }

  function renderLoginRequiredState() {
    const root = getRoot();
    if (!root) return;

    root.innerHTML = `
      <section class="sbw-create-layout-v2">
        <article class="sbw-create-panel-v2 sbw-create-panel-v2--blocked">
          <div class="sbw-create-panel-kicker-v2">Login necessário</div>

          <h2>Entre para criar sua equipe</h2>

          <p>
            A criação de equipe agora é aberta para usuários logados. Entre com sua conta -SBW- para criar uma equipe principal e gerenciar seu elenco.
          </p>

          <div class="sbw-create-info-box-v2">
            <strong>Regra atual da plataforma</strong>
            <span>Cada conta pode criar apenas uma equipe principal e participar de uma equipe ativa.</span>
          </div>

          <div class="sbw-create-actions-v2">
            <a class="sbw-team-btn sbw-team-btn-primary" href="../auth/login.html">
              Entrar / Criar conta
            </a>

            <a class="sbw-team-btn" href="equipes.html">
              Ver equipes
            </a>
          </div>
        </article>
      </section>
    `;
  }

  function renderAlreadyHasTeamState(team, membership) {
    const root = getRoot();
    if (!root) return;

    const activeTeam = team || membership?.team;
    const teamId = activeTeam?.slug || activeTeam?.id || "";
    const title = team ? "Você já criou uma equipe principal" : "Você já participa de uma equipe";
    const description = team
      ? "Cada usuário pode criar apenas uma equipe principal. Para continuar, gerencie sua equipe atual."
      : "Cada usuário pode participar de apenas uma equipe ativa. Para criar outra equipe, primeiro será necessário sair da equipe atual.";

    root.innerHTML = `
      <section class="sbw-create-layout-v2">
        <article class="sbw-create-panel-v2">
          <div class="sbw-create-panel-kicker-v2">Limite de equipe atingido</div>

          <h2>${escapeHtml(title)}</h2>

          <p>${escapeHtml(description)}</p>

          <div class="sbw-create-info-box-v2">
            <strong>${escapeHtml(activeTeam?.name || "Equipe atual")}</strong>
            <span>
              Tag: ${escapeHtml(activeTeam?.tag || "-")} · Status:
              ${escapeHtml(activeTeam?.verificationStatus || "not_verified")}
            </span>
          </div>

          <div class="sbw-create-actions-v2">
            <a class="sbw-team-btn sbw-team-btn-primary" href="minha-equipe.html?id=${encodeURIComponent(teamId)}">
              Gerenciar minha equipe
            </a>

            <a class="sbw-team-btn" href="equipe.html?id=${encodeURIComponent(teamId)}">
              Ver perfil público
            </a>

            <a class="sbw-team-btn" href="equipes.html">
              Voltar para equipes
            </a>
          </div>
        </article>

        <aside class="sbw-create-side-card-v2">
          <h3>Subequipes e verificação</h3>
          <p>
            Subequipes são liberadas para equipes verificadas. A verificação depende de aprovação da administração -SBW-.
          </p>
        </aside>
      </section>
    `;
  }

  function getTagHelpClass(status) {
    if (!status) return "";
    return status.available ? "sbw-form-help-success" : "sbw-form-help-error";
  }

  function renderCreateForm() {
    const root = getRoot();
    if (!root) return;

    const account = state.account;

    state.selectedGames.clear();
    state.tagStatus = null;

    root.innerHTML = `
      <section class="sbw-create-layout-v2">
        <article class="sbw-create-panel-v2">
          <div class="sbw-create-panel-kicker-v2">Criação liberada</div>

          <h2>Dados principais da equipe</h2>

          <p>
            Preencha as informações públicas da sua equipe. Ela começará como equipe comum e poderá solicitar verificação futuramente.
          </p>

          <form class="sbw-team-form sbw-team-form-v2" data-team-create-form>
            <div class="sbw-form-grid">
              <label class="sbw-form-field">
                <span>Nome da equipe *</span>
                <input type="text" name="name" placeholder="Ex: Fighting Wolves Gaming" maxlength="60" required />
              </label>

              <label class="sbw-form-field">
                <span>Tag oficial *</span>
                <input
                  type="text"
                  name="tag"
                  placeholder="Ex: FWG"
                  maxlength="${Number(config.tagRules?.extendedMaxLength || 12)}"
                  required
                  data-team-tag-input
                />

                <small class="sbw-form-help" data-tag-help>
                  Use de ${Number(config.tagRules?.minLength || 2)} a ${Number(config.tagRules?.extendedMaxLength || 12)} caracteres. Tags iguais não são permitidas.
                </small>
              </label>
            </div>

            <label class="sbw-form-field">
              <span>Descrição pública</span>
              <textarea name="description" rows="4" maxlength="360" placeholder="Conte um resumo sobre a equipe, jogos principais, foco competitivo e identidade."></textarea>
            </label>

            <div class="sbw-form-section">
              <div class="sbw-form-section-heading">
                <strong>Modalidades iniciais</strong>
                <span>Opcional. Escolha jogos competitivos ou casuais em que a equipe atua. Você pode editar depois no painel.</span>
              </div>

              <div class="sbw-game-picker sbw-game-picker-v2">
                ${defaultGames
                  .map((game) => `
                    <label class="sbw-game-option">
                      <input type="checkbox" value="${escapeHtml(game.id)}" data-game-option />
                      <span>
                        <strong>${escapeHtml(game.name)}</strong>
                        <small>${escapeHtml(game.category)}</small>
                      </span>
                    </label>
                  `)
                  .join("")}
              </div>
            </div>

            <div class="sbw-form-section">
              <div class="sbw-form-section-heading">
                <strong>Identidade visual</strong>
                <span>As cores entram no perfil público. Upload real de logo/banner pode ser refinado depois com Storage.</span>
              </div>

              <div class="sbw-form-grid">
                <label class="sbw-form-field">
                  <span>Cor principal</span>
                  <input type="color" name="primaryColor" value="#00e5ff" />
                </label>

                <label class="sbw-form-field">
                  <span>Cor secundária</span>
                  <input type="color" name="secondaryColor" value="#7c3cff" />
                </label>
              </div>
            </div>

            <div class="sbw-form-section">
              <div class="sbw-form-section-heading">
                <strong>Redes e contato</strong>
                <span>Campos opcionais para o perfil público.</span>
              </div>

              <div class="sbw-form-grid">
                <label class="sbw-form-field">
                  <span>Discord</span>
                  <input type="url" name="discord" placeholder="https://discord.gg/..." />
                </label>

                <label class="sbw-form-field">
                  <span>YouTube</span>
                  <input type="url" name="youtube" placeholder="https://youtube.com/..." />
                </label>

                <label class="sbw-form-field">
                  <span>Instagram</span>
                  <input type="url" name="instagram" placeholder="https://instagram.com/..." />
                </label>

                <label class="sbw-form-field">
                  <span>X / Twitter</span>
                  <input type="url" name="x" placeholder="https://x.com/..." />
                </label>
              </div>
            </div>

            <div class="sbw-create-actions-v2">
              <button class="sbw-team-btn sbw-team-btn-primary" type="submit">
                Criar equipe
              </button>

              <a class="sbw-team-btn" href="equipes.html">
                Cancelar
              </a>
            </div>

            <div class="sbw-form-result" data-form-result></div>
          </form>
        </article>

        <aside class="sbw-create-side-card-v2">
          <h3>Conta atual</h3>

          <div class="sbw-current-user-card-v2">
            <strong>${escapeHtml(account?.displayName || "Usuário SBW")}</strong>
            <span>${escapeHtml(account?.email || "Conta logada")}</span>
          </div>

          <ul class="sbw-create-rule-list-v2">
            <li>Equipe comum: limite padrão de membros.</li>
            <li>Equipe verificada: até 100 membros.</li>
            <li>Subequipes: apenas para equipes verificadas.</li>
            <li>Verificação: aprovada pela administração -SBW-.</li>
          </ul>
        </aside>
      </section>
    `;

    bindFormActions();
  }

  async function render() {
    const root = getRoot();
    if (!root) return;

    if (!storage || !models) {
      root.innerHTML = `
        <div class="sbw-empty-state">
          Não foi possível carregar os módulos de equipes.
        </div>
      `;
      return;
    }

    state.account = await getCurrentAccount();

    if (!state.account) {
      renderLoginRequiredState();
      return;
    }

    state.existingTeam = await getExistingMainTeam(state.account);
    state.existingMembership = await getExistingActiveMembership(state.account);

    if (state.existingTeam || state.existingMembership) {
      renderAlreadyHasTeamState(state.existingTeam, state.existingMembership);
      return;
    }

    renderCreateForm();
  }

  function bindFormActions() {
    const form = document.querySelector("[data-team-create-form]");
    const tagInput = document.querySelector("[data-team-tag-input]");
    const gameInputs = document.querySelectorAll("[data-game-option]");

    if (tagInput) {
      tagInput.addEventListener("input", async function () {
        const tag = normalizeTag(tagInput.value);
        tagInput.value = tag;
        await validateTag(tag);
      });

      tagInput.addEventListener("blur", async function () {
        const tag = normalizeTag(tagInput.value);
        tagInput.value = tag;
        await validateTag(tag);
      });
    }

    gameInputs.forEach((input) => {
      input.addEventListener("change", function () {
        if (input.checked) {
          state.selectedGames.add(input.value);
        } else {
          state.selectedGames.delete(input.value);
        }
      });
    });

    if (form) {
      form.addEventListener("submit", handleSubmit);
    }
  }

  async function validateTag(tag) {
    const help = document.querySelector("[data-tag-help]");
    if (!help) return false;

    const normalized = normalizeTag(tag);
    const minLength = Number(config.tagRules?.minLength || 2);
    const extendedMaxLength = Number(config.tagRules?.extendedMaxLength || 12);
    const maxLength = Number(config.tagRules?.maxLength || 6);

    if (!normalized) {
      state.tagStatus = null;
      help.className = "sbw-form-help";
      help.textContent = `Use de ${minLength} a ${extendedMaxLength} caracteres. Tags iguais não são permitidas.`;
      return false;
    }

    if (normalized.length < minLength) {
      state.tagStatus = {
        available: false,
        reason: `A tag precisa ter pelo menos ${minLength} caracteres.`
      };
    } else if (normalized.length > extendedMaxLength) {
      state.tagStatus = {
        available: false,
        reason: `A tag pode ter no máximo ${extendedMaxLength} caracteres.`
      };
    } else if (!config.tagRules?.allowExtendedTag && normalized.length > maxLength) {
      state.tagStatus = {
        available: false,
        reason: `A tag pode ter no máximo ${maxLength} caracteres.`
      };
    } else if (storage?.isTagAvailable) {
      state.tagStatus = await storage.isTagAvailable(normalized);
    } else {
      state.tagStatus = {
        available: true,
        reason: "Tag disponível."
      };
    }

    help.className = `sbw-form-help ${getTagHelpClass(state.tagStatus)}`;
    help.textContent = state.tagStatus.reason;

    return state.tagStatus.available;
  }

  function getSelectedGames() {
    return defaultGames
      .filter((game) => state.selectedGames.has(game.id))
      .map((game) => ({
        id: game.id,
        name: game.name,
        category: game.category,
        active: true,
        status: "active"
      }));
  }

  async function saveCaptainMembership(savedTeam, account, games) {
    const teamSlug = savedTeam?.slug || savedTeam?.id;
    if (!teamSlug || !account) return false;

    const memberPayload = {
      id: `member-${teamSlug}-${account.profileSlug}`,
      teamId: teamSlug,
      teamSlug: teamSlug,
      userId: account.profileSlug,
      authUserId: account.authUser?.id || "",
      profileId: account.profileSlug,
      profileSlug: account.profileSlug,
      nickname: account.displayName,
      displayName: account.displayName,
      avatarUrl: account.avatarUrl || "",
      role: config.memberRoles?.captain || "captain",
      function: "Captain",
      functionName: "Captain",
      publicTitle: "Capitão",
      games: games,
      status: "active",
      joinedAt: new Date().toISOString(),
      metadata: {
        source: savedTeam.source === "supabase" ? "supabase-write" : "local-create",
        createdBy: "team-create-page"
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    let supabaseOk = false;

    try {
      const client = await waitForSupabaseClient();
      const supabaseEnabled = window.SBWSupabase?.isEnabled?.() === true;
      const tableName = window.SBWSupabaseConfig?.tables?.teamMembers || "team_members";

      if (client && supabaseEnabled && savedTeam.source === "supabase") {
        const result = await client
          .from(tableName)
          .upsert({
            team_slug: teamSlug,
            profile_slug: account.profileSlug,
            display_name: account.displayName,
            nickname: account.displayName,
            avatar_url: account.avatarUrl || "",
            role: config.memberRoles?.captain || "captain",
            function_name: "Captain",
            public_title: "Capitão",
            games: games,
            status: "active",
            joined_at: new Date().toISOString(),
            approved_by_profile_slug: account.profileSlug,
            metadata: memberPayload.metadata
          }, {
            onConflict: "team_slug,profile_slug"
          });

        if (result.error) {
          console.warn("[SBW Create Team] Vínculo do capitão não foi salvo no Supabase:", result.error);
        } else {
          supabaseOk = true;
        }
      }
    } catch (error) {
      console.warn("[SBW Create Team] Erro ao salvar membro capitão no Supabase:", error);
    }

    const key = config.storageKeys?.teamMembers || "sbw_team_members_v1_3_9";
    const localMembers = readJson(key, []);
    const index = localMembers.findIndex((member) => {
      return (
        String(member.teamId || member.teamSlug || "") === teamSlug &&
        String(member.profileSlug || member.profileId || member.userId || "") === account.profileSlug
      );
    });

    if (index >= 0) {
      localMembers[index] = memberPayload;
    } else {
      localMembers.push(memberPayload);
    }

    writeJson(key, localMembers);

    return supabaseOk || savedTeam.source !== "supabase";
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const result = document.querySelector("[data-form-result]");
    const formData = new FormData(form);

    if (result) {
      result.innerHTML = `
        <div class="sbw-form-message">
          Criando equipe...
        </div>
      `;
    }

    const account = await getCurrentAccount();

    if (!account) {
      renderLoginRequiredState();
      return;
    }

    const existingTeam = await getExistingMainTeam(account);
    const existingMembership = await getExistingActiveMembership(account);

    if (existingTeam || existingMembership) {
      renderAlreadyHasTeamState(existingTeam, existingMembership);
      return;
    }

    const name = String(formData.get("name") || "").trim();
    const tag = normalizeTag(formData.get("tag"));

    if (!name || !tag) {
      if (result) {
        result.innerHTML = `
          <div class="sbw-form-message sbw-form-message-error">
            Preencha nome da equipe e tag oficial.
          </div>
        `;
      }
      return;
    }

    const tagIsValid = await validateTag(tag);

    if (!tagIsValid) {
      if (result) {
        result.innerHTML = `
          <div class="sbw-form-message sbw-form-message-error">
            A tag informada não está disponível.
          </div>
        `;
      }
      return;
    }

    const games = getSelectedGames();

    const timestamp = Date.now();
    const slugBase = createSlug(tag || name) || "equipe";
    const slug = `${slugBase}-${timestamp}`;
    const commonLimit = Number(config.limits?.commonTeamMembers || 50);

    const newTeam = {
      id: `team-${slug}`,
      name,
      tag,
      slug,
      teamType: config.teamTypes?.mainTeam || "main_team",
      parentTeamId: null,
      parentTeamSlug: null,

      description: String(formData.get("description") || "").trim(),
      bio: String(formData.get("description") || "").trim(),

      logoUrl: "",
      bannerUrl: "",

      theme: {
        primaryColor: String(formData.get("primaryColor") || "#00e5ff"),
        secondaryColor: String(formData.get("secondaryColor") || "#7c3cff"),
        accentColor: "#ffffff",
        backgroundMode: "dark",
        source: "team-create"
      },

      verificationStatus: config.verificationStatus?.notVerified || "not_verified",
      verificationType: config.teamTypes?.mainTeam || "main_team",
      memberLimit: commonLimit,
      isVerified: false,
      isPublic: true,
      status: "active",

      captainUserId: account.authUser.id,
      captainProfileSlug: account.profileSlug,
      captainName: account.displayName,

      games,

      socialLinks: {
        discord: String(formData.get("discord") || "").trim(),
        youtube: String(formData.get("youtube") || "").trim(),
        instagram: String(formData.get("instagram") || "").trim(),
        x: String(formData.get("x") || "").trim()
      },

      rosterSummary: {
        totalMembers: 1,
        activePlayers: 1,
        staff: 0
      },

      stats: {
        tournamentsPlayed: 0,
        titles: 0,
        podiums: 0,
        prizeAmount: 0,
        prizeCurrency: "BRL"
      },

      achievements: [],
      subteams: [],

      metadata: {
        source: "team-create-page",
        version: "1.6.11",
        createdByAuthUserId: account.authUser.id,
        createdByProfileSlug: account.profileSlug,
        verificationFlow: "not_requested",
        externalIntegrationsReady: true
      },

      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const savedTeam = await storage.saveTeam(newTeam);

    if (!savedTeam) {
      if (result) {
        result.innerHTML = `
          <div class="sbw-form-message sbw-form-message-error">
            Não foi possível salvar a equipe. Verifique as permissões do Supabase ou tente novamente.
          </div>
        `;
      }
      return;
    }

    const captainLinked = await saveCaptainMembership(savedTeam, account, games);
    const savedTeamId = savedTeam.slug || savedTeam.id || newTeam.slug;
    const isSupabase = savedTeam.source === "supabase";

    if (result) {
      result.innerHTML = `
        <div class="sbw-form-message sbw-form-message-success">
          <strong>Equipe criada com sucesso.</strong>
          <span>
            ${isSupabase
              ? "A equipe foi salva na plataforma e já pode aparecer publicamente."
              : "A equipe foi salva no modo local/fallback deste navegador. Para ficar pública para todos, confirme as permissões de gravação no Supabase."}
          </span>

          ${captainLinked ? "" : `
            <span class="sbw-form-warning">
              A equipe foi criada, mas o vínculo de capitão pode precisar ser revisado no Supabase.
            </span>
          `}

          <div class="sbw-create-actions-v2">
            <a class="sbw-team-btn sbw-team-btn-primary" href="equipe.html?id=${encodeURIComponent(savedTeamId)}">
              Ver equipe criada
            </a>

            <a class="sbw-team-btn" href="minha-equipe.html?id=${encodeURIComponent(savedTeamId)}">
              Gerenciar minha equipe
            </a>

            <a class="sbw-team-btn" href="equipes.html">
              Voltar para lista
            </a>
          </div>
        </div>
      `;
    }

    form.reset();
    state.selectedGames.clear();
    state.tagStatus = null;
  }

  document.addEventListener("DOMContentLoaded", render);
})();
