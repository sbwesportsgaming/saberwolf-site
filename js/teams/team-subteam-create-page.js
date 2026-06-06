(function () {
  const config = window.SBW_TEAMS_CONFIG;
  const storage = window.SBWTeamsStorage;
  const models = window.SBWTeamsModels;

  const state = {
    currentUser: null,
    parentTeam: null,
    selectedGames: new Set(),
    tagStatus: null
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
    },
    {
      id: "valorant",
      name: "Valorant",
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

  function getCurrentUser() {
    return readJson(config.storageKeys.currentUser, getDefaultUser());
  }

  function isAdminSbw(user) {
    const roles = Array.isArray(user?.roles) ? user.roles : [];
    return roles.includes("admin_sbw");
  }

  function canManageTeam(user, team) {
    if (!user || !team) return false;

    if (isAdminSbw(user)) return true;

    return team.captainUserId === user.id;
  }

  function getRoot() {
    return document.querySelector("[data-subteam-create-root]");
  }

  function getTagHelpClass(status) {
    if (!status) return "";

    return status.available
      ? "sbw-form-help-success"
      : "sbw-form-help-error";
  }

  function getVerificationLabel(status) {
    const labels = {
      not_verified: "Não verificada",
      pending: "Solicitação em análise",
      verified: "Verificada",
      rejected: "Verificação recusada",
      revoked: "Verificação removida"
    };

    return labels[status] || "Não verificada";
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

  function getMergedGameOptions(parentTeam) {
    const map = new Map();

    defaultGames.forEach((game) => {
      map.set(game.id, game);
    });

    (parentTeam.games || []).forEach((game) => {
      map.set(game.id, {
        id: game.id,
        name: game.name,
        category: game.category || "Modalidade"
      });
    });

    return Array.from(map.values());
  }

  function prepareDefaultSelectedGames(parentTeam) {
    state.selectedGames.clear();

    (parentTeam.games || []).forEach((game) => {
      state.selectedGames.add(game.id);
    });
  }

  async function findParentTeam() {
    const user = state.currentUser;
    const parentId = getParam("parent");
    const teams = await storage.getAllTeams();

    let parentTeam = null;

    if (parentId) {
      parentTeam = teams.find((team) => team.id === parentId) || null;
    }

    if (!parentTeam) {
      parentTeam =
        teams.find((team) => {
          return (
            team.teamType === config.teamTypes.mainTeam &&
            team.captainUserId === user.id
          );
        }) || null;
    }

    if (!parentTeam) return null;

    if (parentTeam.teamType !== config.teamTypes.mainTeam) {
      return null;
    }

    if (!canManageTeam(user, parentTeam)) {
      return null;
    }

    return parentTeam;
  }

  function renderNoParentTeam() {
    const root = getRoot();
    if (!root) return;

    root.innerHTML = `
      <section class="sbw-create-layout">
        <article class="sbw-create-panel sbw-create-blocked">
          <div class="sbw-create-panel-kicker">Equipe principal não encontrada</div>

          <h2>Você precisa ter uma equipe principal</h2>

          <p>
            Para criar uma subequipe, primeiro é necessário ter uma equipe principal
            criada e gerenciada por este usuário.
          </p>

          <div class="sbw-create-actions">
            <a class="sbw-team-btn sbw-team-btn-primary" href="criar-equipe.html">
              Criar equipe principal
            </a>

            <a class="sbw-team-btn" href="equipes.html">
              Ver equipes
            </a>
          </div>
        </article>

        <aside class="sbw-create-side-card">
          <h3>Regra da SaberWolf</h3>

          <p>
            A criação de subequipes não é independente. Ela sempre precisa estar
            vinculada a uma equipe principal existente.
          </p>
        </aside>
      </section>
    `;
  }

  function renderNotVerifiedState(parentTeam) {
    const root = getRoot();
    if (!root) return;

    root.innerHTML = `
      <section class="sbw-create-layout">
        <article class="sbw-create-panel sbw-create-blocked">
          <div class="sbw-create-panel-kicker">Subequipe bloqueada</div>

          <h2>Esta equipe ainda não pode criar subequipe</h2>

          <p>
            Apenas equipes verificadas pela SaberWolf podem criar subequipes,
            academies, line secundária ou divisões vinculadas.
          </p>

          <div class="sbw-permission-box">
            <strong>${escapeHtml(parentTeam.name)}</strong>
            <span>
              Tag: ${escapeHtml(parentTeam.tag)} · Status:
              ${escapeHtml(getVerificationLabel(parentTeam.verificationStatus))}
            </span>
          </div>

          <div class="sbw-create-actions">
            <a class="sbw-team-btn sbw-team-btn-primary" href="minha-equipe.html?id=${encodeURIComponent(parentTeam.id)}">
              Voltar para o painel
            </a>

            <button class="sbw-team-btn" type="button" data-demo-approve-parent>
              Simular aprovação SBW
            </button>
          </div>
        </article>

        <aside class="sbw-create-side-card">
          <h3>Demo local</h3>

          <p>
            O botão de simular aprovação é apenas para teste local da v1.4.0.
            No Supabase, essa aprovação será feita por admin SBW no banco.
          </p>

          <div class="sbw-permission-box">
            <strong>Regra futura</strong>
            <span>
              O front-end não decide sozinho. A criação real será protegida por
              RLS, constraint e/ou RPC no Supabase.
            </span>
          </div>
        </aside>
      </section>
    `;

    bindBlockedActions();
  }

  function renderCreateForm(parentTeam) {
    const root = getRoot();
    if (!root) return;

    prepareDefaultSelectedGames(parentTeam);

    const gameOptions = getMergedGameOptions(parentTeam);
    const primary = parentTeam.theme?.primaryColor || "#00e5ff";
    const secondary = parentTeam.theme?.secondaryColor || "#7c3cff";

    root.innerHTML = `
      <section 
        class="sbw-create-layout"
        style="--team-primary: ${escapeHtml(primary)}; --team-secondary: ${escapeHtml(secondary)};"
      >
        <article class="sbw-create-panel">
          <div class="sbw-create-panel-kicker">Subequipe liberada</div>

          <h2>Criar subequipe vinculada</h2>

          <p>
            Esta subequipe será vinculada à equipe principal
            <strong>${escapeHtml(parentTeam.name)}</strong>.
            O capitão/dono máximo será o mesmo da equipe principal.
          </p>

          <form class="sbw-team-form" data-subteam-create-form>
            <div class="sbw-form-grid">
              <label class="sbw-form-field">
                <span>Nome da subequipe *</span>
                <input
                  type="text"
                  name="name"
                  placeholder="Ex: ${escapeHtml(parentTeam.name)} Academy"
                  maxlength="50"
                  required
                />
              </label>

              <label class="sbw-form-field">
                <span>Tag oficial da subequipe *</span>
                <input
                  type="text"
                  name="tag"
                  placeholder="Ex: ${escapeHtml(parentTeam.tag)}A"
                  maxlength="${config.tagRules.extendedMaxLength}"
                  required
                  data-subteam-tag-input
                />

                <small class="sbw-form-help" data-subteam-tag-help>
                  A tag precisa ser única. Tags iguais à equipe principal ou a outras equipes são bloqueadas.
                </small>
              </label>
            </div>

            <label class="sbw-form-field">
              <span>Descrição pública</span>
              <textarea
                name="description"
                rows="4"
                maxlength="260"
                placeholder="Explique a função da subequipe: Academy, base, line secundária, treino, projeto competitivo etc."
              ></textarea>
            </label>

            <div class="sbw-form-section">
              <div class="sbw-form-section-heading">
                <strong>Modalidades da subequipe</strong>
                <span>
                  Por padrão, puxamos as modalidades da equipe principal. Você pode ajustar.
                </span>
              </div>

              <div class="sbw-game-picker">
                ${gameOptions
                  .map((game) => {
                    const checked = state.selectedGames.has(game.id) ? "checked" : "";

                    return `
                      <label class="sbw-game-option">
                        <input
                          type="checkbox"
                          value="${escapeHtml(game.id)}"
                          data-subteam-game-option
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

            <div class="sbw-form-section">
              <div class="sbw-form-section-heading">
                <strong>Identidade visual</strong>
                <span>
                  A subequipe pode ter cores próprias, mas continuará exibindo vínculo com a equipe principal.
                </span>
              </div>

              <div class="sbw-form-grid">
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

            <div class="sbw-form-section">
              <div class="sbw-form-section-heading">
                <strong>Redes e contato</strong>
                <span>
                  Opcional. Pode usar redes próprias da subequipe ou deixar em branco.
                </span>
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
                Criar subequipe demo
              </button>

              <a class="sbw-team-btn" href="minha-equipe.html?id=${encodeURIComponent(parentTeam.id)}">
                Cancelar
              </a>
            </div>

            <div class="sbw-form-result" data-subteam-form-result></div>
          </form>
        </article>

        <aside class="sbw-create-side-card">
          <h3>Equipe principal</h3>

          <div class="sbw-current-user-card">
            <strong>${escapeHtml(getTeamInitials(parentTeam))}</strong>
            <span>${escapeHtml(parentTeam.name)}</span>
          </div>

          <p>
            A subequipe será exibida no perfil público da equipe principal como uma
            equipe secundária vinculada.
          </p>

          <div class="sbw-permission-box">
            <strong>Capitão principal</strong>
            <span>${escapeHtml(parentTeam.captainName || "Capitão")}</span>
          </div>

          <div class="sbw-permission-box">
            <strong>Limite inicial da subequipe</strong>
            <span>${config.limits.commonSubteamMembers} membros</span>
          </div>
        </aside>
      </section>
    `;

    bindFormActions();
  }

  async function render() {
    const parentTeam = state.parentTeam;

    if (!parentTeam) {
      renderNoParentTeam();
      return;
    }

    if (!storage.canCreateSubteam(parentTeam)) {
      renderNotVerifiedState(parentTeam);
      return;
    }

    renderCreateForm(parentTeam);
  }

  function bindBlockedActions() {
    const approveButton = document.querySelector("[data-demo-approve-parent]");

    if (approveButton) {
      approveButton.addEventListener("click", async function () {
        const confirmed = window.confirm(
          "Simular aprovação SBW desta equipe? Na demo local, a equipe será marcada como verificada."
        );

        if (!confirmed) return;

        const updatedParentTeam = {
          ...state.parentTeam,
          verificationStatus: config.verificationStatus.verified,
          memberLimit: config.limits.verifiedTeamMembers
        };

        const savedTeam = await storage.saveTeam(updatedParentTeam);

        if (!savedTeam) {
          alert("Não foi possível simular a aprovação da equipe.");
          return;
        }

        state.parentTeam = savedTeam;
        await render();
      });
    }
  }

  function bindFormActions() {
    const form = document.querySelector("[data-subteam-create-form]");
    const tagInput = document.querySelector("[data-subteam-tag-input]");
    const gameInputs = document.querySelectorAll("[data-subteam-game-option]");

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
    const help = document.querySelector("[data-subteam-tag-help]");

    if (!help) return false;

    const normalized = models.normalizeTag(tag);

    if (!normalized) {
      state.tagStatus = null;
      help.className = "sbw-form-help";
      help.textContent = "A tag precisa ser única. Tags iguais não são permitidas.";
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
      state.tagStatus = await storage.isTagAvailable(normalized);
    }

    help.className = `sbw-form-help ${getTagHelpClass(state.tagStatus)}`;
    help.textContent = state.tagStatus.reason;

    return state.tagStatus.available;
  }

  function getSelectedGames(parentTeam) {
    const map = new Map();

    defaultGames.forEach((game) => {
      map.set(game.id, game);
    });

    (parentTeam.games || []).forEach((game) => {
      map.set(game.id, game);
    });

    return Array.from(state.selectedGames).map((gameId) => {
      const game = map.get(gameId);

      return {
        id: gameId,
        name: game?.name || gameId,
        category: game?.category || "Modalidade",
        active: true
      };
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const result = document.querySelector("[data-subteam-form-result]");
    const formData = new FormData(form);
    const parentTeam = state.parentTeam;

    if (!parentTeam) {
      renderNoParentTeam();
      return;
    }

    if (!storage.canCreateSubteam(parentTeam)) {
      renderNotVerifiedState(parentTeam);
      return;
    }

    const name = String(formData.get("name") || "").trim();
    const tag = models.normalizeTag(formData.get("tag"));

    if (!name || !tag) {
      if (result) {
        result.innerHTML = `
          <div class="sbw-form-message sbw-form-message-error">
            Preencha nome da subequipe e tag oficial.
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

    const games = getSelectedGames(parentTeam);

    if (!games.length) {
      if (result) {
        result.innerHTML = `
          <div class="sbw-form-message sbw-form-message-error">
            Selecione pelo menos uma modalidade para a subequipe.
          </div>
        `;
      }

      return;
    }

    const slug = models.createSlug(name);
    const timestamp = Date.now();

    const newSubteam = {
      id: `subteam-${slug}-${timestamp}`,
      name,
      tag,
      slug: `${slug}-${timestamp}`,

      teamType: config.teamTypes.subteam,
      parentTeamId: parentTeam.id,

      description: String(formData.get("description") || "").trim(),

      logoUrl: "",
      bannerUrl: "",

      theme: {
        primaryColor: String(formData.get("primaryColor") || parentTeam.theme?.primaryColor || "#00e5ff"),
        secondaryColor: String(formData.get("secondaryColor") || parentTeam.theme?.secondaryColor || "#7c3cff"),
        accentColor: "#ffffff",
        backgroundMode: "dark",
        source: "manual-subteam-demo"
      },

      verificationStatus: config.verificationStatus.notVerified,
      verificationType: config.teamTypes.subteam,
      memberLimit: config.limits.commonSubteamMembers,

      captainUserId: parentTeam.captainUserId,
      captainName: parentTeam.captainName,

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

    const savedSubteam = await storage.saveTeam(newSubteam);

    if (!savedSubteam) {
      if (result) {
        result.innerHTML = `
          <div class="sbw-form-message sbw-form-message-error">
            Não foi possível salvar a subequipe.
          </div>
        `;
      }

      return;
    }

    if (result) {
      result.innerHTML = `
        <div class="sbw-form-message sbw-form-message-success">
          <strong>Subequipe criada com sucesso.</strong>
          <span>
            Ela está vinculada à equipe principal ${escapeHtml(parentTeam.name)}.
          </span>

          <div class="sbw-create-actions">
            <a class="sbw-team-btn sbw-team-btn-primary" href="equipe.html?id=${encodeURIComponent(savedSubteam.id)}">
              Ver subequipe
            </a>

            <a class="sbw-team-btn" href="equipe.html?id=${encodeURIComponent(parentTeam.id)}">
              Ver equipe principal
            </a>

            <a class="sbw-team-btn" href="minha-equipe.html?id=${encodeURIComponent(savedSubteam.id)}">
              Gerenciar subequipe
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
    state.parentTeam = await findParentTeam();

    await render();
  }

  document.addEventListener("DOMContentLoaded", init);
})();