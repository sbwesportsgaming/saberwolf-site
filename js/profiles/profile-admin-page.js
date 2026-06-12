(function () {
  const storage = window.SBWProfilesStorage;
  const models = window.SBWProfilesModels;

      const state = {
    profile: null,
    invites: [],
    history: [],
    medals: [],
    playerStatus: null,
    sessionContext: null,
    inviteMessage: "",
    inviteMessageType: "",
    activeTab: "overview",
    activeHistoryTab: "teams"
  };

  const gameOptions = [
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

  const historyTabs = [
  {
    id: "teams",
    label: "Equipes",
    types: ["team_join", "team_leave", "team_transfer"]
  },
    {
      id: "tournaments",
      label: "Torneios",
      types: ["tournament"]
    },
    {
      id: "titles",
      label: "Títulos",
      types: ["title"]
    },
    {
      id: "podiums",
      label: "Pódios",
      types: ["podium"]
    },
    {
      id: "prizes",
      label: "Premiações",
      types: ["prize"]
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

  function getInitials(profile) {
    return String(profile?.nickname || profile?.displayName || "?")
      .slice(0, 2)
      .toUpperCase();
  }

  function getAvatarHtml(profile) {
  if (profile?.avatarUrl) {
    return `
      <img src="${escapeHtml(profile.avatarUrl)}" alt="${escapeHtml(profile.displayName || "Avatar")}" />
    `;
  }

  return escapeHtml(getInitials(profile));
}

function getBannerStyle(profile) {
  if (!profile?.bannerUrl) return "";

  return `
    style="background-image:
      linear-gradient(135deg, rgba(5, 11, 22, 0.18), rgba(5, 11, 22, 0.82)),
      url('${escapeHtml(profile.bannerUrl)}');"
  `;
}

function readImageFile(file, maxSizeMb) {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve("");
      return;
    }

    if (!file.type.startsWith("image/")) {
      reject(new Error("Envie apenas arquivos de imagem."));
      return;
    }

    const maxBytes = maxSizeMb * 1024 * 1024;

    if (file.size > maxBytes) {
      reject(new Error(`A imagem precisa ter no máximo ${maxSizeMb}MB.`));
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      resolve(String(reader.result || ""));
    };

    reader.onerror = () => {
      reject(new Error("Não foi possível ler a imagem."));
    };

    reader.readAsDataURL(file);
  });
}

  function getSelectedGameIds(profile) {
    return new Set((profile.mainGames || []).map((game) => game.id));
  }

  function formatDate(value) {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleDateString("pt-BR");
  }

  function formatCurrency(value, currency) {
    const amount = Number(value || 0);

    if ((currency || "BRL") === "BRL") {
      return amount.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
      });
    }

    return `${amount} ${currency || ""}`.trim();
  }

  function getInviteStatusLabel(status) {
    const labels = {
      pending: "Pendente",
      accepted: "Aceito",
      declined: "Recusado",
      expired: "Expirado"
    };

    return labels[status] || "Pendente";
  }

  function getInviteTypeLabel(type) {
    const labels = {
      received: "Convite recebido",
      team_to_player: "Convite recebido",
      sent_request: "Solicitação enviada"
    };

    return labels[type] || "Convite";
  }

  function getContextTeamKey(team) {
    return String(team?.slug || team?.id || team?.teamSlug || team?.teamId || "");
  }

  function renderCurrentTeamStatus(context) {
    const team = context?.currentTeam || null;
    const member = context?.currentTeamMember || null;
    const teamKey = getContextTeamKey(team);

    if (!team) {
      return `
        <div class="sbw-profile-team-status sbw-profile-team-status--empty">
          <span>Equipe atual</span>
          <strong>Sem equipe</strong>
          <p>Você ainda não está vinculado a uma equipe ativa. Convites aceitos aparecerão aqui.</p>
        </div>
      `;
    }

    return `
      <div class="sbw-profile-team-status">
        <span>Equipe atual</span>
        <strong>${escapeHtml(team.name || team.displayName || "Equipe")}</strong>
        <p>${escapeHtml(member?.role || "membro")} · ${escapeHtml(team.tag || team.typeLabel || "Equipe SaberWolf")}</p>

        <div class="sbw-profile-team-status__actions">
          <a href="${escapeHtml(window.SBWRoutes?.team ? window.SBWRoutes.team(teamKey) : `../equipes/equipe.html?id=${encodeURIComponent(teamKey)}`)}">Ver equipe</a>
          <a href="${escapeHtml(window.SBWRoutes?.myTeam ? window.SBWRoutes.myTeam(teamKey) : `../equipes/minha-equipe.html?id=${encodeURIComponent(teamKey)}`)}">Minha equipe</a>
        </div>
      </div>
    `;
  }

  async function refreshSessionContext() {
    try {
      if (window.SBWSessionContext && typeof window.SBWSessionContext.getCurrentContext === "function") {
        state.sessionContext = await window.SBWSessionContext.getCurrentContext({ refresh: true });
        return state.sessionContext;
      }
    } catch (error) {
      console.warn("[SaberWolf Profiles] Não foi possível carregar contexto de equipe do usuário:", error);
    }

    state.sessionContext = null;
    return null;
  }

    function getProfileId(profile) {
    return profile.userId || profile.id || profile.profileSlug || "";
  }

  function getCurrentUserMedals(profile) {
    const userId = getProfileId(profile);

    if (!storage || typeof storage.getProfileMedalsByUserId !== "function") {
      return [];
    }

    return storage.getProfileMedalsByUserId(userId) || [];
  }

  async function getCurrentUserCompetitiveSnapshot(profile) {
    if (!storage || typeof storage.getCompetitiveProfileSnapshotAsync !== "function") {
      return { history: [], medals: [], stats: {} };
    }

    try {
      return await storage.getCompetitiveProfileSnapshotAsync(profile);
    } catch (error) {
      console.warn("[SaberWolf Profiles] Não foi possível carregar snapshot competitivo no painel:", error);
      return { history: [], medals: [], stats: {}, error };
    }
  }

  function mergeHistoryForPanel(baseHistory, competitiveSnapshot) {
    const generatedHistory = competitiveSnapshot && Array.isArray(competitiveSnapshot.history)
      ? competitiveSnapshot.history
      : [];

    if (storage && typeof storage.mergeProfileHistoryLists === "function") {
      return storage.mergeProfileHistoryLists(baseHistory || [], generatedHistory);
    }

    return [].concat(generatedHistory, Array.isArray(baseHistory) ? baseHistory : []);
  }

  function mergeMedalsForPanel(baseMedals, competitiveSnapshot) {
    const generatedMedals = competitiveSnapshot && Array.isArray(competitiveSnapshot.medals)
      ? competitiveSnapshot.medals
      : [];

    if (storage && typeof storage.mergeProfileMedalLists === "function") {
      return storage.mergeProfileMedalLists(baseMedals || [], generatedMedals);
    }

    return [].concat(generatedMedals, Array.isArray(baseMedals) ? baseMedals : []);
  }

  function getMedalSummaryFromList(medals) {
    const safeMedals = Array.isArray(medals) ? medals : [];

    return {
      total: safeMedals.length,
      gold: safeMedals.filter((medal) => medal.medalType === "gold").length,
      silver: safeMedals.filter((medal) => medal.medalType === "silver").length,
      bronze: safeMedals.filter((medal) => medal.medalType === "bronze").length,
      top8: safeMedals.filter((medal) => medal.medalType === "top8").length,
      points: safeMedals.reduce((total, medal) => {
        return total + Number(medal.points || 0);
      }, 0),
      prizeAmount: safeMedals.reduce((total, medal) => {
        return total + Number(medal.prizeAmount || 0);
      }, 0)
    };
  }

  function renderAdminMedalCard(medal) {
    return `
      <article class="sbw-profile-medal-card sbw-medal-card-${escapeHtml(medal.medalType)}">
        <div class="sbw-profile-medal-icon">
          ${escapeHtml(medal.medalIcon || "🏅")}
        </div>

        <div class="sbw-profile-medal-content">
          <div class="sbw-profile-medal-top">
            <span>${escapeHtml(medal.medalLabel || "Conquista")}</span>
            <b>${escapeHtml(medal.season || "2026")}</b>
          </div>

          <h3>${escapeHtml(medal.title || "Conquista SaberWolf")}</h3>

          <p>
            ${escapeHtml(medal.description || "Conquista registrada na plataforma SaberWolf.")}
          </p>

          <div class="sbw-profile-medal-meta">
            <span>${escapeHtml(medal.game || "Jogo não informado")}</span>
            <span>${escapeHtml(medal.tournamentName || "Torneio")}</span>
            <span>${escapeHtml(formatDate(medal.awardedAt))}</span>
          </div>

          <div class="sbw-profile-medal-footer">
            <span>#${Number(medal.placement || 0)} colocado</span>
            <span>${Number(medal.points || 0)} pts</span>
            <span>${formatCurrency(medal.prizeAmount || 0, medal.prizeCurrency || "BRL")}</span>
          </div>
        </div>
      </article>
    `;
  }

  function renderMedalsPanel(profile, medals) {
    const safeMedals = Array.isArray(medals) ? medals : [];
    const summary = getMedalSummaryFromList(safeMedals);

    return `
      <section ${renderPanelAttrs("medals")}>
        <div class="sbw-profile-panel">
          <div class="sbw-profile-panel-heading">
            <div>
              <span>Conquistas</span>
              <h2>Medalhas</h2>
            </div>

            <small>${summary.total} registrada${summary.total === 1 ? "" : "s"}</small>
          </div>

          <p class="sbw-profile-muted">
            Medalhas locais e conquistas geradas automaticamente a partir de torneios finalizados aparecem aqui. Ranking global oficial fica para etapa própria.
          </p>

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
            safeMedals.length
              ? `
                <div class="sbw-profile-medal-list">
                  ${safeMedals.map(renderAdminMedalCard).join("")}
                </div>
              `
              : `
                <div class="sbw-empty-state">
                  Nenhuma medalha registrada ainda.
                </div>
              `
          }
        </div>
      </section>
    `;
  }

  /* =========================================================
     SaberWolf v1.5.4 - Painel Status do Jogador
     ========================================================= */

  function csvToArray(value) {
    return String(value || "")
      .split(",")
      .map(function (item) {
        return item.trim();
      })
      .filter(Boolean);
  }

  function arrayToCsv(value) {
    if (!Array.isArray(value)) {
      return "";
    }

    return value.join(", ");
  }

  function getCurrentUserPlayerStatus(profile) {
    const userId = getProfileId(profile);

    if (!storage || typeof storage.getPlayerStatusByUserId !== "function") {
      return null;
    }

    return storage.getPlayerStatusByUserId(userId);
  }

  function getPlayerStatusOptionsForPanel() {
    if (!storage || typeof storage.getPlayerStatusOptions !== "function") {
      return [];
    }

    return storage.getPlayerStatusOptions();
  }

  function renderPlayerStatusPanel(profile, playerStatus) {
    const status = playerStatus || getCurrentUserPlayerStatus(profile);
    const options = getPlayerStatusOptionsForPanel();
    const currentStatus = status && status.status ? status.status : "free_agent";

    return `
      <section ${renderPanelAttrs("status")}>
        <div class="sbw-profile-panel">
          <div class="sbw-profile-panel-heading">
            <div>
              <span>Disponibilidade</span>
              <h2>Status público do jogador</h2>
            </div>

            <small>${escapeHtml(status ? status.label : "Free Agent")}</small>
          </div>

          <p class="sbw-profile-muted">
            Esse status aparece no seu perfil público e futuramente será usado em filtros de perfis, transferências, convites e contratações.
          </p>

          <form class="sbw-profile-status-form" id="sbwPlayerStatusForm">
            <label class="sbw-profile-field">
              <span>Status atual</span>
              <select name="status">
                ${options
                  .map(function (option) {
                    return `
                      <option value="${escapeHtml(option.id)}" ${option.id === currentStatus ? "selected" : ""}>
                        ${escapeHtml(option.label)}
                      </option>
                    `;
                  })
                  .join("")}
              </select>
            </label>

            <label class="sbw-profile-field">
              <span>Texto de disponibilidade</span>
              <textarea name="availabilityText" rows="4" placeholder="Ex: Aberto a propostas para Fighting Games, principalmente Street Fighter 6.">${escapeHtml(
                status ? status.availabilityText : ""
              )}</textarea>
            </label>

            <label class="sbw-profile-field">
              <span>Jogos de interesse</span>
              <input
                name="preferredGames"
                type="text"
                value="${escapeHtml(arrayToCsv(status ? status.preferredGames : []))}"
                placeholder="Street Fighter 6, Tekken 8, Fatal Fury"
              />
            </label>

            <label class="sbw-profile-field">
              <span>Buscando</span>
              <input
                name="lookingFor"
                type="text"
                value="${escapeHtml(arrayToCsv(status ? status.lookingFor : []))}"
                placeholder="Equipe competitiva, Clã casual, Torneios"
              />
            </label>

            <label class="sbw-profile-field">
              <span>Funções</span>
              <input
                name="preferredRoles"
                type="text"
                value="${escapeHtml(arrayToCsv(status ? status.preferredRoles : []))}"
                placeholder="Player, Coach, Manager, Capitão"
              />
            </label>

            <div class="sbw-profile-status-preview">
              <strong>Como aparece no perfil:</strong>
              <span class="sbw-profile-player-status sbw-player-status-${escapeHtml(currentStatus)}">
                ${escapeHtml(status ? status.label : "Free Agent")}
              </span>
            </div>

            <div class="sbw-profile-form-actions">
              <button class="sbw-profile-primary-button" type="submit">
                Salvar status
              </button>
            </div>
          </form>
        </div>
      </section>
    `;
  }

  function bindPlayerStatusFormOnce() {
    if (window.__sbwPlayerStatusFormBound) {
      return;
    }

    window.__sbwPlayerStatusFormBound = true;

    document.addEventListener("submit", async function (event) {
      const form = event.target.closest("#sbwPlayerStatusForm");

      if (!form) {
        return;
      }

      event.preventDefault();

      if (!storage || typeof storage.savePlayerStatusByUserId !== "function") {
        alert("O módulo de status ainda não está disponível.");
        return;
      }

      const profile = state.profile || (await storage.getCurrentUserProfile());
      const userId = getProfileId(profile);
      const formData = new FormData(form);

      const savedStatus = storage.savePlayerStatusByUserId(userId, {
        status: formData.get("status"),
        availabilityText: formData.get("availabilityText"),
        preferredGames: csvToArray(formData.get("preferredGames")),
        lookingFor: csvToArray(formData.get("lookingFor")),
        preferredRoles: csvToArray(formData.get("preferredRoles"))
      });

      state.playerStatus = savedStatus;

      await reloadAndRender();

      alert("Status público atualizado.");
    });
  }

  function renderGamePicker(profile) {
    const selected = getSelectedGameIds(profile);

    return `
      <div class="sbw-profile-game-picker">
        ${gameOptions
          .map((game) => {
            const checked = selected.has(game.id) ? "checked" : "";

            return `
              <label class="sbw-profile-game-option">
                <input type="checkbox" value="${escapeHtml(game.id)}" data-profile-game-option ${checked} />

                <span>
                  <strong>${escapeHtml(game.name)}</strong>
                  <small>${escapeHtml(game.category)}</small>
                </span>
              </label>
            `;
          })
          .join("")}
      </div>
    `;
  }

  function renderAdminTabButton(id, label, count) {
    const activeClass = state.activeTab === id ? "is-active" : "";
    const countHtml = typeof count === "number" ? `<b>${count}</b>` : "";

    return `
      <button class="sbw-profile-admin-tab ${activeClass}" type="button" data-profile-admin-tab="${escapeHtml(id)}">
        <span>${escapeHtml(label)}</span>
        ${countHtml}
      </button>
    `;
  }

  function renderPanelAttrs(id) {
    const active = state.activeTab === id;

    return `
      class="sbw-profile-admin-panel-state ${active ? "is-active" : ""}"
      data-profile-admin-panel="${escapeHtml(id)}"
      ${active ? "" : "hidden"}
    `;
  }

  function renderOverviewPanel(profile) {
    return `
      <section ${renderPanelAttrs("overview")}>
        <form class="sbw-profile-admin-form" data-profile-form>
          <div class="sbw-profile-panel">
            <div class="sbw-profile-panel-heading">
              <div>
                <span>Imagem</span>
                <h2>Foto e banner</h2>
              </div>
            </div>

            <div class="sbw-profile-media-editor">
              <div class="sbw-profile-banner-preview" ${getBannerStyle(profile)}>
                <div class="sbw-player-avatar sbw-profile-avatar-preview">
                  ${getAvatarHtml(profile)}
                </div>
              </div>

              <div class="sbw-profile-form-grid">
                <label class="sbw-profile-field">
                  <span>Foto de perfil</span>
                  <input type="file" name="avatarFile" accept="image/*" />
                  <small>Recomendado: imagem quadrada. Máximo 2MB no modo demo.</small>
                </label>

                <label class="sbw-profile-field">
                  <span>Banner de fundo</span>
                  <input type="file" name="bannerFile" accept="image/*" />
                  <small>Recomendado: imagem horizontal. Máximo 4MB no modo demo.</small>
                </label>
              </div>

              <div class="sbw-profile-media-actions">
                <label>
                  <input type="checkbox" name="removeAvatar" />
                  Remover foto atual
                </label>

                <label>
                  <input type="checkbox" name="removeBanner" />
                  Remover banner atual
                </label>
              </div>
            </div>
          </div>
          <div class="sbw-profile-panel">
            <div class="sbw-profile-panel-heading">
              <div>
                <span>Dados públicos</span>
                <h2>Informações principais</h2>
              </div>
            </div>

            <div class="sbw-profile-form-grid">
              <label class="sbw-profile-field">
                <span>Nome público</span>
                <input type="text" name="displayName" value="${escapeHtml(profile.displayName)}" maxlength="40" required />
              </label>

              <label class="sbw-profile-field">
                <span>Nickname</span>
                <input type="text" name="nickname" value="${escapeHtml(profile.nickname)}" maxlength="32" required />
              </label>

              <label class="sbw-profile-field">
                <span>Tipo de perfil</span>
                <select name="profileType">
                  <option value="player" ${profile.profileType === "player" ? "selected" : ""}>Jogador</option>
                  <option value="creator" ${profile.profileType === "creator" ? "selected" : ""}>Creator</option>
                  <option value="organizer" ${profile.profileType === "organizer" ? "selected" : ""}>Organizador</option>
                  <option value="staff" ${profile.profileType === "staff" ? "selected" : ""}>Staff</option>
                </select>
              </label>

              <label class="sbw-profile-field">
                <span>Headline</span>
                <input type="text" name="headline" value="${escapeHtml(profile.headline)}" maxlength="80" />
              </label>
            </div>

            <label class="sbw-profile-field">
              <span>Bio pública</span>
              <textarea name="bio" rows="4" maxlength="360">${escapeHtml(profile.bio)}</textarea>
            </label>
          </div>

          <div class="sbw-profile-panel">
            <div class="sbw-profile-panel-heading">
              <div>
                <span>Localização</span>
                <h2>Dados regionais</h2>
              </div>
            </div>

            <div class="sbw-profile-form-grid">
              <label class="sbw-profile-field">
                <span>País</span>
                <input type="text" name="country" value="${escapeHtml(profile.country)}" />
              </label>

              <label class="sbw-profile-field">
                <span>Estado</span>
                <input type="text" name="state" value="${escapeHtml(profile.state)}" />
              </label>

              <label class="sbw-profile-field">
                <span>Cidade</span>
                <input type="text" name="city" value="${escapeHtml(profile.city)}" />
              </label>

              <label class="sbw-profile-field">
                <span>Tags públicas</span>
                <input type="text" name="roleTags" value="${escapeHtml((profile.roleTags || []).join(", "))}" />
              </label>
            </div>
          </div>

          <div class="sbw-profile-panel">
            <div class="sbw-profile-panel-heading">
              <div>
                <span>Jogos</span>
                <h2>Jogos principais</h2>
              </div>
            </div>

            ${renderGamePicker(profile)}
          </div>

          <div class="sbw-profile-panel">
            <div class="sbw-profile-panel-heading">
              <div>
                <span>Redes</span>
                <h2>Links públicos</h2>
              </div>
            </div>

            <div class="sbw-profile-form-grid">
              <label class="sbw-profile-field">
                <span>Discord</span>
                <input type="text" name="discord" value="${escapeHtml(profile.socialLinks?.discord || "")}" />
              </label>

              <label class="sbw-profile-field">
                <span>YouTube</span>
                <input type="url" name="youtube" value="${escapeHtml(profile.socialLinks?.youtube || "")}" />
              </label>

              <label class="sbw-profile-field">
                <span>Instagram</span>
                <input type="url" name="instagram" value="${escapeHtml(profile.socialLinks?.instagram || "")}" />
              </label>

              <label class="sbw-profile-field">
                <span>X / Twitter</span>
                <input type="url" name="x" value="${escapeHtml(profile.socialLinks?.x || "")}" />
              </label>

              <label class="sbw-profile-field">
                <span>Twitch</span>
                <input type="url" name="twitch" value="${escapeHtml(profile.socialLinks?.twitch || "")}" />
              </label>
            </div>
          </div>

          <div class="sbw-profile-save-bar">
            <button class="sbw-profile-btn sbw-profile-btn-primary" type="submit">
              Salvar perfil
            </button>

            <span data-profile-save-result></span>
          </div>
        </form>
      </section>
    `;
  }

    function getInviteTeamUrl(invite) {
    const teamSlug =
      invite.teamSlug ||
      invite.teamId ||
      invite.team_slug ||
      "";

    if (!teamSlug) {
      return "";
    }

    return window.SBWRoutes?.team ? window.SBWRoutes.team(teamSlug) : "../equipes/equipe.html?id=" + encodeURIComponent(teamSlug);
  }

  function renderInvitesPanel(invites) {
    const pendingCount = invites.filter((invite) => invite.status === "pending").length;

    return `
      <section ${renderPanelAttrs("invites")}>
        <div class="sbw-profile-panel">
          <div class="sbw-profile-panel-heading">
            <div>
              <span>Equipes</span>
              <h2>Convites</h2>
            </div>

            <small>${pendingCount} pendente${pendingCount === 1 ? "" : "s"}</small>
          </div>

          <p class="sbw-profile-muted">
            Aqui aparecem convites recebidos de equipes e solicitações enviadas para entrar em uma equipe.
          </p>

          ${
            state.inviteMessage
              ? `
                <div class="sbw-profile-inline-message ${state.inviteMessageType === "error" ? "is-error" : "is-success"}">
                  ${escapeHtml(state.inviteMessage)}
                </div>
              `
              : ""
          }

          ${
            invites.length
              ? `
                <div class="sbw-profile-invite-list">
                  ${invites
                    .map((invite) => {
                     const isPending = invite.status === "pending";
                      const canRespond =
                        isPending &&
                        (invite.inviteType === "received" ||
                          invite.inviteType === "team_to_player" ||
                          !invite.inviteType);

                      const teamUrl = getInviteTeamUrl(invite);
                      const teamName = invite.teamName || invite.teamSlug || invite.teamId || "Equipe";

                      return `
                        <article class="sbw-profile-invite-card">
                          ${
                            teamUrl
                              ? `
                                <a class="sbw-profile-invite-logo" href="${escapeHtml(teamUrl)}" title="Ver perfil da equipe">
                                  ${escapeHtml(invite.teamTag || "EQ")}
                                </a>
                              `
                              : `
                                <div class="sbw-profile-invite-logo">
                                  ${escapeHtml(invite.teamTag || "EQ")}
                                </div>
                              `
                          }

                          <div class="sbw-profile-invite-main">
                            <span>${escapeHtml(getInviteTypeLabel(invite.inviteType))}</span>
                            ${
                              teamUrl
                                ? `
                                  <a class="sbw-profile-invite-team-link" href="${escapeHtml(teamUrl)}">
                                    ${escapeHtml(teamName)}
                                  </a>
                                `
                                : `
                                  <strong>${escapeHtml(teamName)}</strong>
                                `
                            }
                            <p>${escapeHtml(invite.message || "Convite de equipe.")}</p>

                            <div class="sbw-profile-invite-meta">
                              <b>${escapeHtml(invite.roleOffered || "Membro")}</b>
                              <b>${escapeHtml(getInviteStatusLabel(invite.status))}</b>
                              <b>${escapeHtml(formatDate(invite.createdAt))}</b>
                            </div>
                          </div>

                          <div class="sbw-profile-invite-actions">
                            ${
                              canRespond
                                ? `
                                  <button class="sbw-profile-mini-btn sbw-profile-mini-btn-primary" type="button" data-invite-accept="${escapeHtml(invite.id)}">
                                    Aceitar
                                  </button>

                                  <button class="sbw-profile-mini-btn" type="button" data-invite-decline="${escapeHtml(invite.id)}">
                                    Recusar
                                  </button>
                                `
                                : `
                                  <span class="sbw-profile-invite-status">
                                    ${escapeHtml(getInviteStatusLabel(invite.status))}
                                  </span>
                                `
                            }
                          </div>
                        </article>
                      `;
                    })
                    .join("")}
                </div>
              `
              : `
                <div class="sbw-empty-state">
                  Nenhum convite encontrado.
                </div>
              `
          }
        </div>
      </section>
    `;
  }

  function renderHistoryTabButton(tab) {
    const activeClass = state.activeHistoryTab === tab.id ? "is-active" : "";

    return `
      <button class="sbw-profile-history-tab ${activeClass}" type="button" data-profile-history-tab="${escapeHtml(tab.id)}">
        ${escapeHtml(tab.label)}
      </button>
    `;
  }

  function renderHistoryItem(item) {
    const prize = item.type === "prize"
      ? `<strong class="sbw-profile-history-prize">${formatCurrency(item.amount, item.currency)}</strong>`
      : "";

    return `
      <article class="sbw-profile-history-row">
        <div>
          <span>${escapeHtml(formatDate(item.date))} · ${escapeHtml(item.source || "SaberWolf")}</span>
          <strong>${escapeHtml(item.title)}</strong>
          <p>${escapeHtml(item.subtitle || "")}</p>
        </div>

        ${prize}
      </article>
    `;
  }

  function renderHistoryPanel(history) {
    return `
      <section ${renderPanelAttrs("history")}>
        <div class="sbw-profile-panel">
          <div class="sbw-profile-panel-heading">
            <div>
              <span>Carreira</span>
              <h2>Histórico</h2>
            </div>
          </div>

          <p class="sbw-profile-muted">
            Este histórico combina registros locais com resultados de torneios finalizados na plataforma. Rankings e temporadas globais entram em etapa própria.
          </p>

          <div class="sbw-profile-history-tabs">
            ${historyTabs.map(renderHistoryTabButton).join("")}
          </div>

          <div class="sbw-profile-history-content">
            ${historyTabs
              .map((tab) => {
                const active = state.activeHistoryTab === tab.id;
                const items = history.filter((item) => tab.types.includes(item.type));

                return `
                  <div class="sbw-profile-history-list ${active ? "is-active" : ""}" data-profile-history-panel="${escapeHtml(tab.id)}" ${active ? "" : "hidden"}>
                    ${
                      items.length
                        ? items.map(renderHistoryItem).join("")
                        : `
                          <div class="sbw-empty-state">
                            Nenhum registro encontrado nesta categoria.
                          </div>
                        `
                    }
                  </div>
                `;
              })
              .join("")}
          </div>
        </div>
      </section>
    `;
  }

  function renderAdmin(profile, invites, history) {
    const root = document.querySelector("[data-profile-admin-root]");
    if (!root) return;

    const pendingInvites = invites.filter((invite) => invite.status === "pending").length;
    const medalsCount = Array.isArray(arguments[3]) ? arguments[3].length : 0;

    root.innerHTML = `
      <section class="sbw-profile-admin-layout">
        <aside class="sbw-player-side">
          <div class="sbw-profile-panel">
            <div class="sbw-player-mini-card">
              <div class="sbw-player-avatar">
                ${getAvatarHtml(profile)}
              </div>

              <div>
                <strong>${escapeHtml(profile.displayName)}</strong>
                <span>@${escapeHtml(profile.nickname)}</span>
              </div>
            </div>

            <p class="sbw-profile-muted">
              ${escapeHtml(profile.headline || "Jogador SaberWolf")}
            </p>
          </div>

          <div class="sbw-profile-panel">
            ${renderCurrentTeamStatus(state.sessionContext)}
          </div>

          <div class="sbw-profile-panel">
            <div class="sbw-profile-panel-heading">
              <div>
                <span>Navegação</span>
                <h2>Meu perfil</h2>
              </div>
            </div>

            <div class="sbw-profile-admin-tabs">
              ${renderAdminTabButton("overview", "Dados públicos")}
              ${renderAdminTabButton("status", "Status")}
              ${renderAdminTabButton("invites", "Convites", pendingInvites)}
              ${renderAdminTabButton("medals", "Medalhas", medalsCount)}
              ${renderAdminTabButton("history", "Histórico")}
            </div>
          </div>

          <div class="sbw-profile-actions">
            <a class="sbw-profile-btn sbw-profile-btn-primary" href="perfil.html?id=${encodeURIComponent(profile.userId)}">
              Ver perfil público
            </a>

            <a class="sbw-profile-btn" href="${escapeHtml(window.SBWRoutes?.teams ? window.SBWRoutes.teams() : "../equipes/equipes.html")}">
              Ver equipes
            </a>
          </div>
        </aside>

        <main class="sbw-player-content">
          ${renderOverviewPanel(profile)}
          ${renderPlayerStatusPanel(profile, arguments[4] || null)}
          ${renderInvitesPanel(invites)}
          ${renderMedalsPanel(profile, arguments[3] || [])}
          ${renderHistoryPanel(history)}
        </main>
      </section>
    `;

    bindEvents(profile);
  }

  function getSelectedGames() {
    const selected = [];

    document.querySelectorAll("[data-profile-game-option]").forEach((input) => {
      if (!input.checked) return;

      const game = gameOptions.find((item) => item.id === input.value);

      if (game) {
        selected.push(game);
      }
    });

    return selected;
  }

  function bindAdminTabs() {
    document.querySelectorAll("[data-profile-admin-tab]").forEach((button) => {
      button.addEventListener("click", function () {
        const target = button.dataset.profileAdminTab;
        state.activeTab = target;

        document.querySelectorAll("[data-profile-admin-tab]").forEach((item) => {
          item.classList.toggle("is-active", item === button);
        });

        document.querySelectorAll("[data-profile-admin-panel]").forEach((panel) => {
          const active = panel.dataset.profileAdminPanel === target;

          panel.classList.toggle("is-active", active);

          if (active) {
            panel.removeAttribute("hidden");
          } else {
            panel.setAttribute("hidden", "");
          }
        });
      });
    });
  }

  function bindHistoryTabs() {
    document.querySelectorAll("[data-profile-history-tab]").forEach((button) => {
      button.addEventListener("click", function () {
        const target = button.dataset.profileHistoryTab;
        state.activeHistoryTab = target;

        document.querySelectorAll("[data-profile-history-tab]").forEach((item) => {
          item.classList.toggle("is-active", item === button);
        });

        document.querySelectorAll("[data-profile-history-panel]").forEach((panel) => {
          const active = panel.dataset.profileHistoryPanel === target;

          panel.classList.toggle("is-active", active);

          if (active) {
            panel.removeAttribute("hidden");
          } else {
            panel.setAttribute("hidden", "");
          }
        });
      });
    });
  }

  function setInviteMessage(message, type) {
    state.inviteMessage = message || "";
    state.inviteMessageType = type || "";
  }

  function bindInviteActions() {
    document.querySelectorAll("[data-invite-accept]").forEach((button) => {
      button.addEventListener("click", async function () {
        state.activeTab = "invites";
        button.disabled = true;
        button.textContent = "Aceitando...";

        try {
          let result = null;

          if (typeof storage.acceptTeamInvite === "function") {
            result = await storage.acceptTeamInvite(button.dataset.inviteAccept);
          } else {
            result = await storage.updateInviteStatus(button.dataset.inviteAccept, "accepted");
          }

          setInviteMessage(
            result?.message || (result?.ok ? "Convite aceito." : "Não foi possível aceitar o convite."),
            result?.ok ? "success" : "error"
          );
        } catch (error) {
          setInviteMessage(error.message || "Erro ao aceitar convite.", "error");
        }

        await reloadAndRender();
      });
    });

    document.querySelectorAll("[data-invite-decline]").forEach((button) => {
      button.addEventListener("click", async function () {
        state.activeTab = "invites";
        button.disabled = true;
        button.textContent = "Recusando...";

        try {
          let result = null;

          if (typeof storage.declineTeamInvite === "function") {
            result = await storage.declineTeamInvite(button.dataset.inviteDecline);
          } else {
            result = await storage.updateInviteStatus(button.dataset.inviteDecline, "declined");
          }

          setInviteMessage(
            result?.message || (result?.ok ? "Convite recusado." : "Não foi possível recusar o convite."),
            result?.ok ? "success" : "error"
          );
        } catch (error) {
          setInviteMessage(error.message || "Erro ao recusar convite.", "error");
        }

        await reloadAndRender();
      });
    });
  }

  function bindForm(profile) {
    const form = document.querySelector("[data-profile-form]");
    const result = document.querySelector("[data-profile-save-result]");

    if (!form) return;

    form.addEventListener("submit", async function (event) {
      event.preventDefault();

      const formData = new FormData(form);

      try {
        const avatarFile = formData.get("avatarFile");
        const bannerFile = formData.get("bannerFile");

        let avatarUrl = profile.avatarUrl || "";
        let bannerUrl = profile.bannerUrl || "";

        if (formData.get("removeAvatar")) {
          avatarUrl = "";
        }

        if (formData.get("removeBanner")) {
          bannerUrl = "";
        }

        if (avatarFile && avatarFile.size > 0) {
          avatarUrl = await readImageFile(avatarFile, 2);
        }

        if (bannerFile && bannerFile.size > 0) {
          bannerUrl = await readImageFile(bannerFile, 4);
        }

        const updatedProfile = {
          ...profile,

          displayName: String(formData.get("displayName") || "").trim(),
          nickname: String(formData.get("nickname") || "").trim(),
          profileType: String(formData.get("profileType") || "player"),
          headline: String(formData.get("headline") || "").trim(),
          bio: String(formData.get("bio") || "").trim(),

          country: String(formData.get("country") || "").trim(),
          state: String(formData.get("state") || "").trim(),
          city: String(formData.get("city") || "").trim(),

          avatarUrl,
          bannerUrl,

          roleTags: String(formData.get("roleTags") || "")
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),

          mainGames: getSelectedGames(),

          socialLinks: {
            discord: String(formData.get("discord") || "").trim(),
            youtube: String(formData.get("youtube") || "").trim(),
            instagram: String(formData.get("instagram") || "").trim(),
            x: String(formData.get("x") || "").trim(),
            twitch: String(formData.get("twitch") || "").trim()
          }
        };

        const saved = await storage.saveProfile(updatedProfile);

        if (result) {
          result.innerHTML = `
            <strong class="sbw-profile-save-success">
              Perfil salvo.
            </strong>
          `;
        }

        state.profile = saved;
        state.activeTab = "overview";

        await reloadAndRender();
      } catch (error) {
        if (result) {
          result.innerHTML = `
            <strong class="sbw-profile-save-error">
              ${escapeHtml(error.message || "Erro ao salvar imagem.")}
            </strong>
          `;
        }
      }
    });
  }

  function bindEvents(profile) {
    bindAdminTabs();
    bindHistoryTabs();
    bindInviteActions();
    bindForm(profile);
  }

   async function syncAuthenticatedProfileBeforeRender() {
  if (
    !window.SBWAuth ||
    typeof window.SBWAuth.ensureCurrentUserProfile !== "function"
  ) {
    return;
  }

  try {
    await window.SBWAuth.ensureCurrentUserProfile();
  } catch (error) {
    console.warn("[SaberWolf Profiles] Não foi possível sincronizar usuário autenticado:", error);
  }
}

async function reloadAndRender() {
  await syncAuthenticatedProfileBeforeRender();
  await refreshSessionContext();

  state.profile = await storage.getCurrentUserProfile();
  state.invites = await storage.getCurrentUserInvites();
  const competitiveSnapshot = await getCurrentUserCompetitiveSnapshot(state.profile);
  state.history = mergeHistoryForPanel(await storage.getCurrentUserHistory(), competitiveSnapshot);
  state.medals = mergeMedalsForPanel(getCurrentUserMedals(state.profile), competitiveSnapshot);
  state.playerStatus = getCurrentUserPlayerStatus(state.profile);

  renderAdmin(state.profile, state.invites, state.history, state.medals, state.playerStatus);
  bindPlayerStatusFormOnce();
}

async function init() {
  const root = document.querySelector("[data-profile-admin-root]");

  if (window.SBWPageState?.renderLoading) {
    window.SBWPageState.renderLoading(root, {
      title: "Carregando Meu Perfil",
      message: "Validando conta, equipe atual, convites e histórico competitivo.",
      rows: 4
    });
  }

  try {
    await syncAuthenticatedProfileBeforeRender();
    await refreshSessionContext();

    state.profile = await storage.getCurrentUserProfile();
    state.invites = await storage.getCurrentUserInvites();
    const competitiveSnapshot = await getCurrentUserCompetitiveSnapshot(state.profile);
    state.history = mergeHistoryForPanel(await storage.getCurrentUserHistory(), competitiveSnapshot);
    state.medals = mergeMedalsForPanel(getCurrentUserMedals(state.profile), competitiveSnapshot);
    state.playerStatus = getCurrentUserPlayerStatus(state.profile);

    renderAdmin(state.profile, state.invites, state.history, state.medals, state.playerStatus);
    bindPlayerStatusFormOnce();
  } catch (error) {
    console.error("[SBW Profile Admin] Falha ao carregar Meu Perfil:", error);

    if (window.SBWPageState?.renderError) {
      window.SBWPageState.renderError(root, {
        title: "Não foi possível carregar Meu Perfil",
        message: "A sessão, o profile ou os convites não responderam corretamente.",
        details: error?.message || ""
      });
    }
  } finally {
    window.SBWPageState?.markReady?.();
  }
}

  document.addEventListener("DOMContentLoaded", init);
})();