(function () {
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
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
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
    return config.teamTypes?.mainTeam || "main";
  }

  function getSubteamType() {
    const config = getConfig();
    return config.teamTypes?.subteam || config.teamTypes?.subTeam || "subteam";
  }

  function getCommonTeamLimit() {
    const config = getConfig();
    return Number(config.limits?.commonTeamMembers || 50);
  }

  function getTeamId(team) {
    return team?.slug || team?.id || team?.teamId || "";
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

  function getPublicTitleLabel(value) {
    const labels = {
      pro_player: "Player Pro",
      coach: "Coach",
      staff: "Staff",
      academy_player: "Academy Player",
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

    if (team?.teamType === getSubteamType()) {
      return "Subequipe";
    }

    return "Equipe principal";
  }

  function getVerificationLabel(team) {
    const models = getModels();

    if (typeof models.getVerificationLabel === "function") {
      return models.getVerificationLabel(team);
    }

    if (team?.verificationStatus === getVerifiedStatus() || team?.isVerified) {
      return "Equipe verificada";
    }

    return "Equipe não verificada";
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
    if (team?.tag) {
      return team.tag;
    }

    return String(team?.name || "?")
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 4)
      .toUpperCase();
  }

  function getMemberName(member) {
    return member?.displayName || member?.nickname || member?.name || "Membro";
  }

  function getMemberNickname(member) {
    return member?.nickname || member?.displayName || member?.name || "Membro";
  }

  function getMemberInitials(member) {
    return String(getMemberNickname(member))
      .slice(0, 2)
      .toUpperCase();
  }

  function getMemberAvatarHtml(member) {
    if (member?.avatarUrl) {
      return `
        <img src="${escapeHtml(member.avatarUrl)}" alt="${escapeHtml(getMemberName(member))}" />
      `;
    }

    return escapeHtml(getMemberInitials(member));
  }

  function getMemberProfileUrl(member) {
    if (!member?.userId) {
      return "";
    }

    return `../perfis/perfil.html?id=${encodeURIComponent(member.userId)}`;
  }

  function getActiveMembers(members) {
    return members.filter((member) => {
      return (member.status || "active") === "active";
    });
  }

  function getGameNameMap(team) {
    const map = new Map();

    (team.games || []).forEach((game) => {
      if (typeof game === "string") {
        map.set(game, game);
        return;
      }

      map.set(game.id, game.name);
    });

    return map;
  }

  function getMemberGamesLabel(member, team) {
    const gameMap = getGameNameMap(team);
    const games = Array.isArray(member.games) ? member.games : [];

    if (!games.length) {
      return "—";
    }

    return games
      .map((game) => {
        if (typeof game === "string") {
          return gameMap.get(game) || game;
        }

        return game.name || gameMap.get(game.id) || game.id || "Jogo";
      })
      .filter(Boolean)
      .join(", ");
  }

  function getMembersByGame(members, gameId) {
    return members.filter((member) => {
      if (!Array.isArray(member.games)) {
        return false;
      }

      return member.games.some((game) => {
        if (typeof game === "string") {
          return game === gameId;
        }

        return game.id === gameId;
      });
    });
  }

  function renderPublicTitle(member) {
    const directLabel = member.publicTitleLabel || "";
    const mappedLabel = getPublicTitleLabel(member.publicTitle || "");
    const label = directLabel || mappedLabel;

    if (!label) {
      return `<span class="sbw-rank-empty">—</span>`;
    }

    return `
      <span class="sbw-rank-badge">
        ${escapeHtml(label)}
      </span>
    `;
  }

  function renderSocialLinks(team) {
    const links = team.socialLinks || {};

    const socialItems = [
      {
        key: "discord",
        label: "Discord",
        url: links.discord
      },
      {
        key: "youtube",
        label: "YouTube",
        url: links.youtube
      },
      {
        key: "instagram",
        label: "Instagram",
        url: links.instagram
      },
      {
        key: "x",
        label: "X / Twitter",
        url: links.x || links.twitter
      }
    ].filter((item) => item.url);

    if (!socialItems.length) {
      return `
        <p class="sbw-team-muted">
          Nenhuma rede pública cadastrada.
        </p>
      `;
    }

    return `
      <div class="sbw-team-social-list">
        ${socialItems
          .map((item) => {
            return `
              <a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">
                ${escapeHtml(item.label)}
              </a>
            `;
          })
          .join("")}
      </div>
    `;
  }

  function renderParentTeamBox(parentTeam) {
    if (!parentTeam) {
      return "";
    }

    return `
      <div class="sbw-parent-team-box">
        <span>Subequipe oficial vinculada a</span>

        <a href="equipe.html?id=${encodeURIComponent(getTeamId(parentTeam))}">
          ${escapeHtml(parentTeam.name)}
        </a>
      </div>
    `;
  }

    /* =========================================================
     SaberWolf v1.5.4 - Tipo público da equipe
     ========================================================= */

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

      if (found && found.source !== "default") {
        return found;
      }
    }

    return storage.getTeamTypeByTeamId(getTeamId(team));
  }

  function renderTeamPublicTypeBadge(team) {
    const teamType = getTeamPublicType(team);

    if (!teamType) {
      return "";
    }

    return `
      <span class="sbw-team-public-type-badge sbw-team-public-type-${escapeHtml(teamType.type)}">
        ${escapeHtml(teamType.label)}
      </span>
    `;
  }

  function renderTeamPublicTypePanel(team) {
    const teamType = getTeamPublicType(team);

    if (!teamType) {
      return "";
    }

    const focusTags = Array.isArray(teamType.focusTags) ? teamType.focusTags : [];

    return `
      <div class="sbw-profile-panel sbw-team-public-type-panel">
        <div class="sbw-profile-panel-heading">
          <div>
            <span>Identidade</span>
            <h2>${escapeHtml(teamType.label)}</h2>
          </div>

          <small>${escapeHtml(teamType.shortLabel || teamType.label)}</small>
        </div>

        <p class="sbw-team-muted">
          ${escapeHtml(teamType.descriptionText || teamType.description || "Tipo público da equipe na plataforma SaberWolf.")}
        </p>

        ${
          focusTags.length
            ? `
              <div class="sbw-team-public-type-tags">
                ${focusTags
                  .map(function (tag) {
                    return `<span>${escapeHtml(tag)}</span>`;
                  })
                  .join("")}
              </div>
            `
            : ""
        }
      </div>
    `;
  }

  function renderStats(team) {
    return `
      <div class="sbw-team-profile-stats">
        <div>
          <strong>${Number(team.stats?.tournamentsPlayed || 0)}</strong>
          <span>Torneios</span>
        </div>

        <div>
          <strong>${Number(team.stats?.titles || 0)}</strong>
          <span>Títulos</span>
        </div>

        <div>
          <strong>${Number(team.stats?.podiums || 0)}</strong>
          <span>Pódios</span>
        </div>

        <div>
          <strong>${formatPrize(team.stats)}</strong>
          <span>Premiação</span>
        </div>
      </div>
    `;
  }

  function renderGamesSummary(team, members) {
    const games = Array.isArray(team.games) ? team.games : [];
    const activeMembers = getActiveMembers(members);

    if (!games.length) {
      return `
        <div class="sbw-profile-panel">
          <div class="sbw-profile-panel-heading">
            <div>
              <span>Modalidades</span>
              <h2>Elencos por jogo</h2>
            </div>
          </div>

          <div class="sbw-empty-state">
            Nenhuma modalidade cadastrada.
          </div>
        </div>
      `;
    }

    return `
      <div class="sbw-profile-panel">
        <div class="sbw-profile-panel-heading">
          <div>
            <span>Modalidades</span>
            <h2>Elencos por jogo</h2>
          </div>
        </div>

        <div class="sbw-simple-game-list">
          ${games
            .map((game) => {
              const gameId = typeof game === "string" ? game : game.id;
              const gameName = typeof game === "string" ? game : game.name;
              const gameCategory = typeof game === "string" ? "Modalidade" : game.category || "Modalidade";
              const gameMembers = getMembersByGame(activeMembers, gameId);

              return `
                <div class="sbw-simple-game-row">
                  <div>
                    <strong>${escapeHtml(gameName || "Jogo")}</strong>
                    <span>${escapeHtml(gameCategory)}</span>
                  </div>

                  <b>${gameMembers.length} membro${gameMembers.length === 1 ? "" : "s"}</b>
                </div>
              `;
            })
            .join("")}
        </div>
      </div>
    `;
  }

  function renderMembersList(team, members) {
    const activeMembers = getActiveMembers(members);
    const memberLimit = Number(team.memberLimit || getCommonTeamLimit());

    return `
      <div class="sbw-profile-panel sbw-members-panel">
        <div class="sbw-profile-panel-heading">
          <div>
            <span>Equipe</span>
            <h2>Membros</h2>
          </div>

          <small>${activeMembers.length}/${memberLimit} membros</small>
        </div>

        <p class="sbw-team-muted">
          Clique em um jogador para abrir o perfil pessoal público dele.
        </p>

        ${
          activeMembers.length
            ? `
              <div class="sbw-rank-list">
                <div class="sbw-rank-list-head">
                  <span>#</span>
                  <span>Membro</span>
                  <span>Cargo</span>
                  <span>Função</span>
                  <span>Modalidades</span>
                </div>

                ${activeMembers
                  .map((member, index) => {
                    const profileUrl = getMemberProfileUrl(member);
                    const memberName = getMemberName(member);
                    const nickname = getMemberNickname(member);

                    const memberIdentity = `
                      <div class="sbw-rank-avatar">
                        ${getMemberAvatarHtml(member)}
                      </div>

                      <div class="sbw-rank-member-info">
                        <strong>${escapeHtml(memberName)}</strong>
                        <span>@${escapeHtml(nickname)}</span>
                      </div>
                    `;

                    return `
                      <article class="sbw-rank-list-row">
                        <div class="sbw-rank-position">
                          ${index + 1}
                        </div>

                        ${
                          profileUrl
                            ? `
                              <a class="sbw-rank-member sbw-rank-member-link" href="${profileUrl}">
                                ${memberIdentity}
                              </a>
                            `
                            : `
                              <div class="sbw-rank-member">
                                ${memberIdentity}
                              </div>
                            `
                        }

                        <div class="sbw-rank-cell">
                          ${escapeHtml(getRoleLabel(member.role))}
                        </div>

                        <div class="sbw-rank-cell">
                          ${renderPublicTitle(member)}
                        </div>

                        <div class="sbw-rank-cell">
                          ${escapeHtml(getMemberGamesLabel(member, team))}
                        </div>
                      </article>
                    `;
                  })
                  .join("")}
              </div>
            `
            : `
              <div class="sbw-empty-state">
                Nenhum membro ativo cadastrado publicamente.
              </div>
            `
        }
      </div>
    `;
  }

  function renderSubteams(subteams) {
    if (!subteams.length) {
      return "";
    }

    return `
      <div class="sbw-profile-panel">
        <div class="sbw-profile-panel-heading">
          <div>
            <span>Estrutura</span>
            <h2>Subequipes vinculadas</h2>
          </div>
        </div>

        <div class="sbw-linked-team-list">
          ${subteams
            .map((team) => {
              return `
                <a class="sbw-linked-team-card" href="equipe.html?id=${encodeURIComponent(getTeamId(team))}">
                  <div class="sbw-linked-team-logo">
                    ${escapeHtml(getTeamInitials(team))}
                  </div>

                  <div>
                    <strong>${escapeHtml(team.name)}</strong>
                    <span>${escapeHtml(team.tag)} · ${escapeHtml(getTeamTypeLabel(team))}</span>
                  </div>
                </a>
              `;
            })
            .join("")}
        </div>
      </div>
    `;
  }

  function renderLoading() {
    const root = getRoot();

    if (!root) {
      return;
    }

    root.innerHTML = `
      <div class="sbw-empty-state">
        Carregando equipe...
      </div>
    `;
  }

  function renderError(message) {
    const root = getRoot();

    if (!root) {
      return;
    }

    root.innerHTML = `
      <div class="sbw-empty-state">
        ${escapeHtml(message)}
      </div>
    `;
  }

  function renderProfile(team, members, subteams, parentTeam) {
    const root = getRoot();

    if (!root) {
      return;
    }

    const primary = team.theme?.primaryColor || "#00e5ff";
    const secondary = team.theme?.secondaryColor || "#7c3cff";
    const isVerified =
      team.verificationStatus === getVerifiedStatus() ||
      team.isVerified === true;

    const activeMembers = getActiveMembers(members);
    const teamId = getTeamId(team);

    document.title = `${team.name || "Equipe"} | SaberWolf`;

    root.innerHTML = `
      <section
        class="sbw-team-profile"
        style="--team-primary: ${escapeHtml(primary)}; --team-secondary: ${escapeHtml(secondary)};"
      >
        <div class="sbw-team-cover">
          <div class="sbw-team-profile-top">
            <div class="sbw-team-profile-logo">
              ${escapeHtml(getTeamInitials(team))}
            </div>

            <div class="sbw-team-profile-main">
              <span class="sbw-team-profile-kicker">
                ${escapeHtml(getTeamTypeLabel(team))}
                ${
                  team.source === "supabase"
                    ? " · Supabase"
                    : ""
                }
              </span>

              <div class="sbw-team-title-row">
                <h1>
                  ${escapeHtml(team.name || "Equipe SaberWolf")}
                  ${
                    isVerified
                      ? `<span class="sbw-verified-badge" title="${escapeHtml(getVerificationLabel(team))}">✓</span>`
                      : ""
                  }
                </h1>

                ${renderTeamPublicTypeBadge(team)}
              </div>

              <p>
                ${escapeHtml(team.tag || "TAG")} · ${escapeHtml(team.captainName || "Capitão não informado")}
              </p>

              ${renderParentTeamBox(parentTeam)}
            </div>
          </div>
        </div>

        <div class="sbw-team-profile-layout">
          <aside class="sbw-profile-side">
            <div class="sbw-profile-panel">
              <div class="sbw-profile-panel-heading">
                <div>
                  <span>Resumo</span>
                  <h2>Dados da equipe</h2>
                </div>
              </div>

              ${renderStats(team)}

              <p class="sbw-team-muted">
                A premiação acumulada considera apenas torneios realizados dentro da plataforma SaberWolf.
              </p>
            </div>

            <div class="sbw-profile-panel">
              <div class="sbw-profile-panel-heading">
                <div>
                  <span>Contato</span>
                  <h2>Redes públicas</h2>
                </div>
              </div>

              ${renderSocialLinks(team)}
            </div>

            <div class="sbw-profile-panel">
              <div class="sbw-profile-panel-heading">
                <div>
                  <span>Navegação</span>
                  <h2>Perfil</h2>
                </div>
              </div>

              <div class="sbw-public-profile-tabs">
                <button class="sbw-public-profile-tab is-active" type="button" data-public-profile-tab="overview">
                  <span>Visão geral</span>
                </button>

                <button class="sbw-public-profile-tab" type="button" data-public-profile-tab="members">
                  <span>Membros</span>
                  <b>${activeMembers.length}/${Number(team.memberLimit || getCommonTeamLimit())}</b>
                </button>
              </div>
            </div>

            <div class="sbw-profile-actions">
              <a class="sbw-team-btn sbw-team-btn-primary" href="minha-equipe.html?id=${encodeURIComponent(teamId)}">
                Gerenciar
              </a>

              <a class="sbw-team-btn" href="equipes.html">
                Voltar
              </a>
            </div>
          </aside>

          <main class="sbw-profile-main">
            <section class="sbw-public-profile-panel is-active" data-public-profile-panel="overview">
              <div class="sbw-profile-panel">
                <div class="sbw-profile-panel-heading">
                  <div>
                    <span>Sobre</span>
                    <h2>Descrição</h2>
                  </div>
                </div>

                <p class="sbw-profile-description">
                  ${escapeHtml(team.description || team.bio || "Esta equipe ainda não adicionou uma descrição pública.")}
                </p>
              </div>

              ${renderTeamPublicTypePanel(team)}

              ${renderGamesSummary(team, members)}

              ${renderSubteams(subteams)}
            </section>

            <section class="sbw-public-profile-panel" data-public-profile-panel="members" hidden>
              ${renderMembersList(team, members)}
            </section>
          </main>
        </div>
      </section>
    `;

    bindProfileTabs();
  }

  function bindProfileTabs() {
    const buttons = document.querySelectorAll("[data-public-profile-tab]");
    const panels = document.querySelectorAll("[data-public-profile-panel]");

    buttons.forEach((button) => {
      button.addEventListener("click", function () {
        const target = button.dataset.publicProfileTab;

        buttons.forEach((item) => {
          item.classList.toggle("is-active", item === button);
        });

        panels.forEach((panel) => {
          const isTarget = panel.dataset.publicProfilePanel === target;

          panel.classList.toggle("is-active", isTarget);

          if (isTarget) {
            panel.removeAttribute("hidden");
          } else {
            panel.setAttribute("hidden", "");
          }
        });
      });
    });
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

    if (team.parentTeamId && typeof storage.getTeamById === "function") {
      parentTeam = await storage.getTeamById(team.parentTeamId);
    }

    renderProfile(team, members || [], subteams || [], parentTeam);
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