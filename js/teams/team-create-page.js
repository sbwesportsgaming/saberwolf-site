(function () {
  const config = window.SBW_TEAMS_CONFIG;
  const storage = window.SBWTeamsStorage;
  const models = window.SBWTeamsModels;

  const state = {
    currentUser: null,
    tagStatus: null,
    selectedGames: new Set()
  };

  const defaultGames = [
    {
      id: "sf6",
      name: "Street Fighter 6",
      category: "Fighting Games"
    },
    {
      id: "fatal-fury",
      name: "Fatal Fury",
      category: "Fighting Games"
    },
    {
      id: "tekken-8",
      name: "Tekken 8",
      category: "Fighting Games"
    },
    {
      id: "overwatch",
      name: "Overwatch",
      category: "FPS / Hero Shooter"
    },
    {
      id: "call-of-duty",
      name: "Call of Duty",
      category: "FPS"
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

  function canCreateTeam(user) {
    if (!user) return false;

    const roles = Array.isArray(user.roles) ? user.roles : [];
    const permissions = user.permissions || {};

    return (
      permissions.can_create_team === true ||
      roles.includes("team_creator") ||
      roles.includes("admin_sbw")
    );
  }

  function getRoot() {
    return document.querySelector("[data-team-create-root]");
  }

  function getTagHelpClass(status) {
    if (!status) return "";

    return status.available
      ? "sbw-form-help-success"
      : "sbw-form-help-error";
  }

  async function getUserMainTeam(user) {
    if (!user) return null;

    const teams = await storage.getAllTeams();

    return (
      teams.find((team) => {
        return (
          team.captainUserId === user.id &&
          team.teamType === config.teamTypes.mainTeam
        );
      }) || null
    );
  }

  function renderAlreadyHasTeamState(team) {
    const root = getRoot();
    if (!root) return;

    const canCreateSubteam = storage.canCreateSubteam(team);

    root.innerHTML = `
      <section class="sbw-create-layout">
        <article class="sbw-create-panel">
          <div class="sbw-create-panel-kicker">Equipe principal já criada</div>

          <h2>Você já possui uma equipe principal</h2>

          <p>
            Cada perfil autorizado pode criar apenas uma equipe principal dentro da SaberWolf.
            Para continuar, gerencie sua equipe atual.
          </p>

          <div class="sbw-permission-box">
            <strong>${escapeHtml(team.name)}</strong>
            <span>
              Tag: ${escapeHtml(team.tag)} · Status:
              ${escapeHtml(team.verificationStatus)}
            </span>
          </div>

          <div class="sbw-create-actions">
            <a class="sbw-team-btn sbw-team-btn-primary" href="minha-equipe.html?id=${encodeURIComponent(team.id)}">
              Gerenciar minha equipe
            </a>

            <a class="sbw-team-btn" href="equipe.html?id=${encodeURIComponent(team.id)}">
              Ver perfil público
            </a>

            <a class="sbw-team-btn" href="equipes.html">
              Voltar para equipes
            </a>
          </div>
        </article>

        <aside class="sbw-create-side-card">
          <h3>Subequipes</h3>

          <p>
            Subequipes serão liberadas apenas para equipes verificadas.
            Elas não serão criadas por esta página de criação comum.
          </p>

          <div class="sbw-permission-box">
            <strong>${canCreateSubteam ? "Subequipe liberada" : "Subequipe bloqueada"}</strong>
            <span>
              ${
                canCreateSubteam
                  ? "Esta equipe está verificada e poderá criar subequipes pelo painel."
                  : "Solicite verificação da equipe para liberar criação de subequipe."
              }
            </span>
          </div>
        </aside>
      </section>
    `;
  }

  function renderBlockedState() {
    const root = getRoot();
    if (!root) return;

    root.innerHTML = `
      <section class="sbw-create-layout">
        <article class="sbw-create-panel sbw-create-blocked">
          <div class="sbw-create-panel-kicker">Permissão necessária</div>

          <h2>Solicite autorização para criar uma equipe</h2>

          <p>
            Qualquer usuário pode ter perfil e participar de torneios, mas a criação
            de equipes é liberada apenas para contas autorizadas pela SaberWolf.
          </p>

          <div class="sbw-permission-box">
            <strong>Fluxo futuro com Supabase</strong>

            <span>
              A SBW libera a permissão <code>can_create_team</code> para usuários aprovados.
              Depois disso, o botão de criação fica disponível no painel.
            </span>
          </div>

          <div class="sbw-create-actions">
            <button class="sbw-team-btn sbw-team-btn-primary" type="button" data-request-permission>
              Solicitar pelo Discord
            </button>

            <a class="sbw-team-btn" href="equipes.html">
              Ver equipes
            </a>
          </div>
        </article>

        <aside class="sbw-create-side-card">
          <h3>Simulação local</h3>

          <p>
            Enquanto não conectamos Supabase/Auth, use os botões abaixo para testar
            o comportamento de usuário comum e usuário autorizado.
          </p>

          <div class="sbw-create-actions sbw-create-actions-column">
            <button class="sbw-team-btn sbw-team-btn-primary" type="button" data-demo-authorize>
              Simular usuário autorizado
            </button>

            <button class="sbw-team-btn" type="button" data-demo-common>
              Simular usuário comum
            </button>
          </div>
        </aside>
      </section>
    `;

    bindCommonActions();
  }

  function renderCreateForm() {
    const root = getRoot();
    if (!root) return;

    const user = state.currentUser || getDefaultUser();

    state.selectedGames.clear();
    state.tagStatus = null;

    root.innerHTML = `
      <section class="sbw-create-layout">
        <article class="sbw-create-panel">
          <div class="sbw-create-panel-kicker">Usuário autorizado</div>

          <h2>Dados principais da equipe</h2>

          <p>
            Esta criação salva a equipe na demo local. Futuramente, o mesmo fluxo
            será enviado para o Supabase com validação por RLS.
          </p>

          <form class="sbw-team-form" data-team-create-form>
            <div class="sbw-form-grid">
              <label class="sbw-form-field">
                <span>Nome da equipe *</span>
                <input
                  type="text"
                  name="name"
                  placeholder="Ex: Fighting Wolves Gaming"
                  maxlength="50"
                  required
                />
              </label>

              <label class="sbw-form-field">
                <span>Tag oficial *</span>
                <input
                  type="text"
                  name="tag"
                  placeholder="Ex: FWG"
                  maxlength="${config.tagRules.extendedMaxLength}"
                  required
                  data-team-tag-input
                />

                <small class="sbw-form-help" data-tag-help>
                  Use de ${config.tagRules.minLength} a ${config.tagRules.maxLength} caracteres.
                  Tags iguais não são permitidas.
                </small>
              </label>
            </div>

            <label class="sbw-form-field">
              <span>Descrição pública</span>
              <textarea
                name="description"
                rows="4"
                maxlength="260"
                placeholder="Conte um resumo sobre a equipe, jogos principais e identidade competitiva."
              ></textarea>
            </label>

            <div class="sbw-form-section">
              <div class="sbw-form-section-heading">
                <strong>Modalidades iniciais</strong>
                <span>Escolha os jogos em que a equipe atua.</span>
              </div>

              <div class="sbw-game-picker">
                ${defaultGames
                  .map((game) => {
                    return `
                      <label class="sbw-game-option">
                        <input
                          type="checkbox"
                          value="${escapeHtml(game.id)}"
                          data-game-option
                        />

                        <span>
                          <strong>${escapeHtml(game.name)}</strong>
                          <small>${escapeHtml(game.category)}</small>
                        </span>
                      </label>
                    `;
                  })
                  .join("")}
              </div>
            </div>

            <div class="sbw-form-section">
              <div class="sbw-form-section-heading">
                <strong>Identidade visual</strong>
                <span>
                  Nesta versão local, vamos salvar cores manuais. Depois, podemos extrair
                  cores do banner/logo enviado.
                </span>
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

              <div class="sbw-upload-rules">
                <div>
                  <strong>Logo</strong>
                  <span>PNG, JPG ou WebP · recomendado 512x512 · até 2MB</span>
                </div>

                <div>
                  <strong>Banner</strong>
                  <span>PNG, JPG ou WebP · recomendado 1600x500 ou 1920x600 · até 5MB</span>
                </div>
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

            <div class="sbw-create-actions">
              <button class="sbw-team-btn sbw-team-btn-primary" type="submit">
                Criar equipe demo
              </button>

              <a class="sbw-team-btn" href="equipes.html">
                Cancelar
              </a>
            </div>

            <div class="sbw-form-result" data-form-result></div>
          </form>
        </article>

        <aside class="sbw-create-side-card">
          <h3>Conta atual</h3>

          <div class="sbw-current-user-card">
            <strong>${escapeHtml(user.name || user.nickname || "Usuário")}</strong>
            <span>Permissão: <b>can_create_team</b></span>
          </div>

          <p>
            Ao criar a equipe, este usuário será salvo como capitão/dono principal.
          </p>

          <div class="sbw-create-actions sbw-create-actions-column">
            <button class="sbw-team-btn" type="button" data-demo-common>
              Simular usuário comum
            </button>
          </div>
        </aside>
      </section>
    `;

    bindFormActions();
    bindCommonActions();
  }

  async function render() {
    const user = state.currentUser || getDefaultUser();

    if (!canCreateTeam(user)) {
      renderBlockedState();
      return;
    }

    const existingMainTeam = await getUserMainTeam(user);

    if (existingMainTeam) {
      renderAlreadyHasTeamState(existingMainTeam);
      return;
    }

    renderCreateForm();
  }

  function bindCommonActions() {
    const authorizeButton = document.querySelector("[data-demo-authorize]");
    const commonButton = document.querySelector("[data-demo-common]");
    const requestButton = document.querySelector("[data-request-permission]");

    if (authorizeButton) {
      authorizeButton.addEventListener("click", async function () {
        saveCurrentUser(getAuthorizedDemoUser());
        await render();
      });
    }

    if (commonButton) {
      commonButton.addEventListener("click", async function () {
        saveCurrentUser(getDefaultUser());
        await render();
      });
    }

    if (requestButton) {
      requestButton.addEventListener("click", function () {
        alert(
          "Fluxo futuro: este botão levará ao canal oficial da SaberWolf no Discord para solicitar permissão de criação de equipe."
        );
      });
    }
  }

  function bindFormActions() {
    const form = document.querySelector("[data-team-create-form]");
    const tagInput = document.querySelector("[data-team-tag-input]");
    const gameInputs = document.querySelectorAll("[data-game-option]");

    if (tagInput) {
      tagInput.addEventListener("input", async function () {
        const tag = models.normalizeTag(tagInput.value);
        tagInput.value = tag;

        await validateTag(tag);
      });

      tagInput.addEventListener("blur", async function () {
        const tag = models.normalizeTag(tagInput.value);
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

    const normalized = models.normalizeTag(tag);

    if (!normalized) {
      state.tagStatus = null;
      help.className = "sbw-form-help";
      help.textContent = `Use de ${config.tagRules.minLength} a ${config.tagRules.maxLength} caracteres. Tags iguais não são permitidas.`;
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
    } else if (
      !config.tagRules.allowExtendedTag &&
      normalized.length > config.tagRules.maxLength
    ) {
      state.tagStatus = {
        available: false,
        reason: `A tag pode ter no máximo ${config.tagRules.maxLength} caracteres.`
      };
    } else {
      state.tagStatus = await storage.isTagAvailable(normalized);
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
        active: true
      }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const result = document.querySelector("[data-form-result]");
    const formData = new FormData(form);

    const user = state.currentUser || getDefaultUser();

    if (!canCreateTeam(user)) {
      if (result) {
        result.innerHTML = `
          <div class="sbw-form-message sbw-form-message-error">
            Este usuário não tem permissão para criar equipe.
          </div>
        `;
      }

      return;
    }

    const existingMainTeam = await getUserMainTeam(user);

    if (existingMainTeam) {
      renderAlreadyHasTeamState(existingMainTeam);
      return;
    }

    const name = String(formData.get("name") || "").trim();
    const tag = models.normalizeTag(formData.get("tag"));

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

    if (!games.length) {
      if (result) {
        result.innerHTML = `
          <div class="sbw-form-message sbw-form-message-error">
            Selecione pelo menos uma modalidade inicial.
          </div>
        `;
      }

      return;
    }

    const slug = models.createSlug(name);
    const timestamp = Date.now();

    const newTeam = {
      id: `team-${slug}-${timestamp}`,
      name,
      tag,
      slug: `${slug}-${timestamp}`,
      teamType: config.teamTypes.mainTeam,
      parentTeamId: null,

      description: String(formData.get("description") || "").trim(),

      logoUrl: "",
      bannerUrl: "",

      theme: {
        primaryColor: String(formData.get("primaryColor") || "#00e5ff"),
        secondaryColor: String(formData.get("secondaryColor") || "#7c3cff"),
        accentColor: "#ffffff",
        backgroundMode: "dark",
        source: "manual-demo"
      },

      verificationStatus: config.verificationStatus.notVerified,
      verificationType: config.teamTypes.mainTeam,
      memberLimit: config.limits.commonTeamMembers,

      captainUserId: user.id,
      captainName: user.nickname || user.name || "Capitão",

      games,

      socialLinks: {
        discord: String(formData.get("discord") || "").trim(),
        youtube: String(formData.get("youtube") || "").trim(),
        instagram: String(formData.get("instagram") || "").trim(),
        x: String(formData.get("x") || "").trim()
      },

      stats: {
        tournamentsPlayed: 0,
        titles: 0,
        podiums: 0,
        prizeAmount: 0,
        prizeCurrency: "BRL"
      }
    };

    const savedTeam = await storage.saveTeam(newTeam);

    if (!savedTeam) {
      if (result) {
        result.innerHTML = `
          <div class="sbw-form-message sbw-form-message-error">
            Não foi possível salvar a equipe.
          </div>
        `;
      }

      return;
    }

    if (result) {
      result.innerHTML = `
        <div class="sbw-form-message sbw-form-message-success">
          <strong>Equipe criada com sucesso.</strong>
          <span>Você já pode visualizar o perfil público demo.</span>

          <div class="sbw-create-actions">
            <a class="sbw-team-btn sbw-team-btn-primary" href="equipe.html?id=${encodeURIComponent(savedTeam.id)}">
              Ver equipe criada
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

  async function init() {
    state.currentUser = getCurrentUser();
    await render();
  }

  document.addEventListener("DOMContentLoaded", init);
})();