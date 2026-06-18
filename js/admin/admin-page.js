(function () {
  "use strict";

  const state = {
    context: null,
    client: null,
    profiles: [],
    teams: [],
    logs: [],
    rlsResults: [],
    profileListExpanded: false,
    teamListExpanded: false,
    profileLetterFilter: "",
    teamLetterFilter: ""
  };

  function $(selector, root = document) {
    return root.querySelector(selector);
  }

  function $all(selector, root = document) {
    return Array.from(root.querySelectorAll(selector));
  }

  function escapeHtml(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function waitForSupabaseClient() {
    for (let attempt = 0; attempt < 40; attempt += 1) {
      const client = window.SBWSupabase?.client;

      if (client?.auth) {
        return client;
      }

      await wait(100);
    }

    return null;
  }

  function getTable(name, fallback) {
    return window.SBWSupabaseConfig?.tables?.[name] || fallback;
  }

  function asObject(value) {
    return value && typeof value === "object" && !Array.isArray(value) ? value : {};
  }

  function getProfileName(profile) {
    return (
      profile?.display_name ||
      profile?.displayName ||
      profile?.nickname ||
      profile?.username ||
      profile?.name ||
      profile?.email ||
      "Perfil sem nome"
    );
  }

  function getProfileKey(profile) {
    return (
      profile?.slug ||
      profile?.username ||
      profile?.profile_slug ||
      profile?.id ||
      profile?.auth_user_id ||
      ""
    );
  }

  function getTeamKey(team) {
    return team?.slug || team?.id || team?.teamSlug || team?.teamId || "";
  }

  function getTeamName(team) {
    return team?.name || team?.teamName || team?.displayName || team?.title || "Equipe sem nome";
  }

  function getTeamTag(team) {
    return team?.tag || team?.shortName || team?.teamTag || "";
  }

  function isVerifiedTeam(team) {
    return Boolean(
      team?.isVerified === true ||
      team?.is_verified === true ||
      team?.verificationStatus === "verified" ||
      team?.verification_status === "verified"
    );
  }

  function getProfilePermissions(profile) {
    const metadata = asObject(profile?.metadata);
    return asObject(profile?.permissions || metadata.permissions);
  }

  function isMasterProfile(profile) {
    const permissions = getProfilePermissions(profile);
    return Boolean(permissions.isMasterAdmin || permissions.is_master_admin);
  }

  function isAdminProfile(profile) {
    const permissions = getProfilePermissions(profile);
    return Boolean(
      permissions.isAdmin ||
      permissions.is_admin ||
      permissions.isAdminSbw ||
      permissions.is_admin_sbw ||
      isMasterProfile(profile)
    );
  }

  function isCurrentAdminProfile(profile) {
    const userId = state.context?.user?.id || "";
    const profileId = state.context?.profile?.id || "";

    return Boolean(
      (userId && (profile?.auth_user_id === userId || profile?.authUserId === userId)) ||
      (profileId && profile?.id === profileId)
    );
  }

  function hasOrganizerPermission(profile) {
    const permissions = getProfilePermissions(profile);
    return Boolean(
      permissions.canCreateTournament ||
      permissions.can_create_tournament ||
      permissions.canCreateTournaments ||
      permissions.can_create_tournaments ||
      permissions.isOrganizer ||
      permissions.is_organizer
    );
  }

  function shouldShowApproveOrganizer(profile) {
    if (!profile) return false;

    // A conta Admin/Master atual não precisa ser tratada como aprovação pendente.
    if (isCurrentAdminProfile(profile) && canAccessAdmin(state.context)) return false;

    // Admins do site não usam este fluxo; organizadores devem ser usuários SBW aprovados para uma organização.
    if (isAdminProfile(profile)) return false;

    return !hasOrganizerPermission(profile);
  }

  function getProfileBadges(profile) {
    const permissions = getProfilePermissions(profile);
    const badges = [];

    if (permissions.isMasterAdmin || permissions.is_master_admin) badges.push("Master Admin");
    if (permissions.isAdmin || permissions.is_admin || permissions.isAdminSbw || permissions.is_admin_sbw) badges.push("Admin SBW");
    if (hasOrganizerPermission(profile)) badges.push("Organizador");
    if (permissions.canManagePermissions || permissions.can_manage_permissions) badges.push("Permissões");

    return badges;
  }

  function normalizeSearch(value) {
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  }

  function matchesProfile(profile, query) {
    const needle = normalizeSearch(query);
    if (!needle) return true;

    const haystack = normalizeSearch([
      profile?.id,
      profile?.auth_user_id,
      profile?.email,
      profile?.username,
      profile?.slug,
      profile?.display_name,
      profile?.displayName,
      profile?.nickname,
      profile?.headline
    ].join(" "));

    return haystack.includes(needle);
  }

  function matchesTeam(team, query) {
    const needle = normalizeSearch(query);
    if (!needle) return true;

    const modalities = Array.isArray(team?.modalities) ? team.modalities.join(" ") : "";
    const games = Array.isArray(team?.games) ? team.games.join(" ") : "";

    const haystack = normalizeSearch([
      team?.id,
      team?.slug,
      getTeamName(team),
      getTeamTag(team),
      team?.description,
      team?.game,
      team?.mainGame,
      modalities,
      games
    ].join(" "));

    return haystack.includes(needle);
  }

  function sortProfilesByName(profiles = []) {
    return [...profiles].sort((a, b) => {
      const nameA = normalizeSearch(getProfileName(a));
      const nameB = normalizeSearch(getProfileName(b));
      return nameA.localeCompare(nameB, "pt-BR");
    });
  }

  function sortTeamsByName(teams = []) {
    return [...teams].sort((a, b) => {
      const nameA = normalizeSearch(getTeamName(a));
      const nameB = normalizeSearch(getTeamName(b));
      return nameA.localeCompare(nameB, "pt-BR");
    });
  }


  function getInitialLetter(value) {
    const normalized = normalizeSearch(value);
    const first = normalized.charAt(0);

    if (!first) return "#";
    if (first >= "a" && first <= "z") return first.toUpperCase();
    return "#";
  }

  function getProfileInitialLetter(profile) {
    return getInitialLetter(getProfileName(profile));
  }

  function getTeamInitialLetter(team) {
    return getInitialLetter(getTeamName(team));
  }

  function getCurrentProfileQuery() {
    return $("[data-sbw-admin-profile-search] input")?.value || "";
  }

  function getCurrentTeamQuery() {
    return $("[data-sbw-admin-team-search] input")?.value || "";
  }

  function applyLetterFilter(items, letter, getLetter) {
    if (!letter) return items;
    return items.filter((item) => getLetter(item) === letter);
  }

  function getFilteredProfiles() {
    const query = getCurrentProfileQuery();
    const filteredByQuery = state.profiles.filter((profile) => matchesProfile(profile, query));
    return applyLetterFilter(filteredByQuery, state.profileLetterFilter, getProfileInitialLetter);
  }

  function getFilteredTeams() {
    const query = getCurrentTeamQuery();
    const filteredByQuery = state.teams.filter((team) => matchesTeam(team, query));
    return applyLetterFilter(filteredByQuery, state.teamLetterFilter, getTeamInitialLetter);
  }

  function getListLimit(isExpanded, defaultLimit) {
    return isExpanded ? 0 : defaultLimit;
  }

  function renderProfilesList() {
    renderProfileResults(sortProfilesByName(getFilteredProfiles()), {
      limit: getListLimit(state.profileListExpanded, 40)
    });
    updateListControls();
  }

  function renderTeamsList() {
    renderTeamResults(sortTeamsByName(getFilteredTeams()), {
      limit: getListLimit(state.teamListExpanded, 60)
    });
    updateListControls();
  }

  function renderAlphaFilter(rootId, scope, selectedLetter) {
    const root = document.getElementById(rootId);
    if (!root) return;

    const letters = ["", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")];
    root.innerHTML = letters
      .map((letter) => {
        const label = letter || "Todos";
        const isActive = selectedLetter === letter;
        return `
          <button
            class="sbw-admin-alpha-button ${isActive ? "is-active" : ""}"
            type="button"
            data-admin-action="filter-list-letter"
            data-filter-scope="${escapeHtml(scope)}"
            data-filter-letter="${escapeHtml(letter)}"
          >${escapeHtml(label)}</button>
        `;
      })
      .join("");
  }

  function renderAlphaFilters() {
    renderAlphaFilter("sbwAdminProfileAlphaFilter", "profiles", state.profileLetterFilter);
    renderAlphaFilter("sbwAdminTeamAlphaFilter", "teams", state.teamLetterFilter);
  }

  function updateListControls() {
    const profileLess = $("[data-admin-action='show-less-profiles']");
    const teamLess = $("[data-admin-action='show-less-teams']");

    if (profileLess) profileLess.hidden = !state.profileListExpanded && !state.profileLetterFilter;
    if (teamLess) teamLess.hidden = !state.teamListExpanded && !state.teamLetterFilter;
  }

  function setStatus(message, tone = "muted") {
    const el = $("#sbwAdminSessionStatus");
    if (!el) return;

    el.innerHTML = message;
    el.dataset.tone = tone;
  }

  function showGate(message, isError = false) {
    const gate = $("#sbwAdminGate");
    const shell = $("#sbwAdminShell");

    if (shell) shell.hidden = true;

    if (gate) {
      gate.hidden = false;
      gate.innerHTML = `
        <div class="sbw-admin-message ${isError ? "sbw-admin-message--error" : ""}">
          ${message}
        </div>
      `;
    }
  }

  function showShell() {
    const gate = $("#sbwAdminGate");
    const shell = $("#sbwAdminShell");

    if (gate) gate.hidden = true;
    if (shell) shell.hidden = false;
  }

  function canAccessAdmin(context) {
    return Boolean(
      context?.permissions?.isMasterAdmin ||
      context?.permissions?.isAdminSbw ||
      context?.permissions?.canManagePermissions
    );
  }

  function canGrantMaster(context) {
    return Boolean(context?.permissions?.isMasterAdmin);
  }

  function addLog(message, tone = "info") {
    state.logs.unshift({
      message,
      tone,
      time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    });

    state.logs = state.logs.slice(0, 30);
    renderLogs();
  }

  function renderLogs() {
    const root = $("#sbwAdminLog");
    if (!root) return;

    if (!state.logs.length) {
      root.innerHTML = `<p class="sbw-admin-muted">Nenhuma ação registrada nesta sessão.</p>`;
      return;
    }

    root.innerHTML = state.logs
      .map((item) => {
        return `
          <div class="sbw-admin-log__item" data-tone="${escapeHtml(item.tone)}">
            <strong>${escapeHtml(item.time)}</strong> — ${escapeHtml(item.message)}
          </div>
        `;
      })
      .join("");
  }


  function getSupabaseErrorTone(error, optional = false) {
    if (!error) return "success";

    const code = String(error.code || "");
    const message = String(error.message || "").toLowerCase();

    if (optional && (code === "42P01" || code === "PGRST205" || message.includes("does not exist") || message.includes("not found"))) {
      return "warning";
    }

    if (message.includes("permission") || message.includes("policy") || message.includes("rls") || code === "42501") {
      return "warning";
    }

    return "error";
  }

  function explainSupabaseError(error, optional = false) {
    if (!error) return "Leitura permitida.";

    const code = error.code ? ` (${error.code})` : "";
    const message = error.message || "Erro sem mensagem.";

    if (optional && (String(error.code || "") === "42P01" || String(error.code || "") === "PGRST205")) {
      return `Tabela opcional ausente ou não exposta${code}.`;
    }

    return `${message}${code}`;
  }

  function renderRlsResults(results = state.rlsResults) {
    const root = $("#sbwAdminRlsResults");
    if (!root) return;

    if (!results.length) {
      root.innerHTML = `<p class="sbw-admin-muted">Nenhum diagnóstico executado ainda.</p>`;
      return;
    }

    root.innerHTML = results
      .map((item) => {
        return `
          <article class="sbw-admin-diagnostic" data-tone="${escapeHtml(item.tone)}">
            <div>
              <strong>${escapeHtml(item.label)}</strong>
              <small>${escapeHtml(item.target || "")}</small>
            </div>
            <span>${escapeHtml(item.status)}</span>
            <p>${escapeHtml(item.detail || "")}</p>
          </article>
        `;
      })
      .join("");
  }

  async function runSafeSelectDiagnostic(table, label, options = {}) {
    const target = options.target || table;
    const optional = Boolean(options.optional);
    const columns = options.columns || "*";

    if (!state.client) {
      return {
        label,
        target,
        status: "Erro",
        tone: "error",
        detail: "Cliente Supabase não disponível."
      };
    }

    try {
      const result = await state.client
        .from(table)
        .select(columns)
        .limit(1);

      if (result.error) {
        return {
          label,
          target,
          status: optional ? "Atenção" : "Bloqueado/erro",
          tone: getSupabaseErrorTone(result.error, optional),
          detail: explainSupabaseError(result.error, optional)
        };
      }

      return {
        label,
        target,
        status: "OK",
        tone: "success",
        detail: `Leitura permitida. Registros retornados: ${(result.data || []).length}.`
      };
    } catch (error) {
      return {
        label,
        target,
        status: optional ? "Atenção" : "Erro",
        tone: getSupabaseErrorTone(error, optional),
        detail: explainSupabaseError(error, optional)
      };
    }
  }

  async function runRlsDiagnostics() {
    addLog("Diagnóstico Supabase/RLS iniciado.");

    const results = [];

    if (!state.client) {
      results.push({
        label: "Supabase client",
        target: "window.SBWSupabase.client",
        status: "Erro",
        tone: "error",
        detail: "Cliente Supabase não carregado."
      });
      state.rlsResults = results;
      renderRlsResults(results);
      return;
    }

    try {
      const session = await state.client.auth.getSession();
      const user = session?.data?.session?.user || null;

      results.push({
        label: "Sessão Auth",
        target: "supabase.auth.getSession()",
        status: user ? "OK" : "Sem sessão",
        tone: user ? "success" : "warning",
        detail: user ? `Usuário autenticado: ${user.email || user.id}` : "Nenhum usuário autenticado no navegador atual."
      });
    } catch (error) {
      results.push({
        label: "Sessão Auth",
        target: "supabase.auth.getSession()",
        status: "Erro",
        tone: "error",
        detail: explainSupabaseError(error)
      });
    }

    const profileTable = getTable("profiles", "profiles");
    const teamsTable = getTable("teams", "teams");
    const membersTable = getTable("teamMembers", "team_members");
    const invitesTable = getTable("teamInvites", "team_invites");

    results.push(await runSafeSelectDiagnostic(profileTable, "Leitura de perfis", { target: profileTable }));
    results.push(await runSafeSelectDiagnostic(teamsTable, "Leitura de equipes", { target: teamsTable }));
    results.push(await runSafeSelectDiagnostic(membersTable, "Leitura de membros", { target: membersTable, optional: true }));
    results.push(await runSafeSelectDiagnostic(invitesTable, "Leitura de convites", { target: invitesTable, optional: true }));
    results.push(await runSafeSelectDiagnostic("organizer_permissions", "Permissões de organizador", { target: "organizer_permissions", optional: true }));
    results.push(await runSafeSelectDiagnostic("site_permissions", "Permissões globais", { target: "site_permissions", optional: true }));

    const context = window.SBWSessionContext?.getCachedContext?.() || state.context;
    const roles = context?.permissions?.roles || [];

    results.push({
      label: "Contexto SBW",
      target: "SBWSessionContext",
      status: context?.user ? "OK" : "Atenção",
      tone: context?.user ? "success" : "warning",
      detail: context?.user ? `Roles detectadas: ${roles.length ? roles.join(", ") : "nenhuma role explícita"}.` : "Contexto sem usuário carregado."
    });

    state.rlsResults = results;
    renderRlsResults(results);

    const warnings = results.filter((item) => item.tone !== "success").length;
    addLog(`Diagnóstico concluído com ${warnings} atenção/erro(s).`, warnings ? "warning" : "info");
  }

  async function loadProfilesFromSupabase() {
    if (!state.client) return [];

    try {
      const result = await state.client
        .from(getTable("profiles", "profiles"))
        .select("*")
        .limit(500);

      if (result.error) throw result.error;
      return result.data || [];
    } catch (error) {
      console.warn("[SBW Admin] Falha ao carregar profiles no Supabase:", error);
      return [];
    }
  }

  async function loadProfilesFromFallback() {
    try {
      if (window.SBWProfilesStorage?.getProfilesAsync) {
        return await window.SBWProfilesStorage.getProfilesAsync();
      }

      if (window.SBWProfilesStorage?.getProfiles) {
        return window.SBWProfilesStorage.getProfiles();
      }
    } catch (error) {
      console.warn("[SBW Admin] Falha ao carregar profiles no fallback:", error);
    }

    return [];
  }

  async function loadTeams() {
    try {
      const storage = window.SBWTeamsStorage || null;

      if (typeof storage?.getAllTeamsForAdmin === "function") {
        return await storage.getAllTeamsForAdmin();
      }

      if (typeof storage?.getAllTeamsForSession === "function") {
        return await storage.getAllTeamsForSession();
      }

      if (typeof storage?.getAllTeams === "function") {
        return await storage.getAllTeams({ publicOnly: false });
      }
    } catch (error) {
      console.warn("[SBW Admin] Falha ao carregar equipes:", error);
    }

    return [];
  }

  async function loadOrganizerCount() {
    if (!state.client) return 0;

    try {
      const result = await state.client
        .from("organizer_permissions")
        .select("id, auth_user_id, status")
        .eq("status", "approved")
        .limit(1000);

      if (result.error) throw result.error;
      return (result.data || []).length;
    } catch (error) {
      return 0;
    }
  }

  async function refreshData() {
    const [supabaseProfiles, fallbackProfiles, teams, organizerCount] = await Promise.all([
      loadProfilesFromSupabase(),
      loadProfilesFromFallback(),
      loadTeams(),
      loadOrganizerCount()
    ]);

    const profilesByKey = new Map();

    [...supabaseProfiles, ...fallbackProfiles].forEach((profile) => {
      const key = getProfileKey(profile) || profile?.id || profile?.auth_user_id || JSON.stringify(profile);
      if (key && !profilesByKey.has(key)) profilesByKey.set(key, profile);
    });

    state.profiles = sortProfilesByName(Array.from(profilesByKey.values()));
    state.teams = sortTeamsByName(teams);

    renderStats(organizerCount);
  }

  function renderStats(organizerCount = 0) {
    const stats = {
      profiles: state.profiles.length,
      teams: state.teams.length,
      verifiedTeams: state.teams.filter(isVerifiedTeam).length,
      organizers: organizerCount
    };

    Object.entries(stats).forEach(([key, value]) => {
      const el = $(`[data-sbw-admin-stat="${key}"]`);
      if (el) el.textContent = String(value);
    });
  }

  function renderProfileResults(profiles, options = {}) {
    const root = $("#sbwAdminProfileResults");
    if (!root) return;

    const safeProfiles = Array.isArray(profiles) ? profiles : [];
    const limit = Number.isFinite(options.limit) ? Number(options.limit) : 40;
    const visibleProfiles = limit > 0 ? safeProfiles.slice(0, limit) : safeProfiles;

    if (!safeProfiles.length) {
      root.innerHTML = `<p class="sbw-admin-muted">Nenhum perfil encontrado.</p>`;
      return;
    }

    root.innerHTML = `
      <p class="sbw-admin-muted">
        ${visibleProfiles.length} de ${safeProfiles.length} perfil(is) exibido(s).
      </p>
      ${visibleProfiles.map((profile) => renderProfileCard(profile)).join("")}
    `;
  }

  function renderProfileCard(profile) {
    const name = getProfileName(profile);
    const key = getProfileKey(profile);
    const email = profile?.email || profile?.metadata?.email || profile?.auth_email || "";
    const initial = String(name || "S").charAt(0).toUpperCase();
    const badges = getProfileBadges(profile);
    const profileId = profile?.id || key;
    const authUserId = profile?.auth_user_id || profile?.authUserId || "";

    return `
      <article class="sbw-admin-result-card" data-profile-id="${escapeHtml(profileId)}">
        <div class="sbw-admin-result-main">
          <div class="sbw-admin-avatar">${escapeHtml(initial)}</div>

          <div class="sbw-admin-result-title">
            <strong>${escapeHtml(name)}</strong>
            <small>${escapeHtml([key, email, authUserId].filter(Boolean).join(" · "))}</small>
          </div>

          <div class="sbw-admin-badges">
            ${badges.length ? badges.map((badge) => `<span class="sbw-admin-badge sbw-admin-badge--success">${escapeHtml(badge)}</span>`).join("") : `<span class="sbw-admin-badge">Usuário</span>`}
          </div>
        </div>

        <div class="sbw-admin-actions">
          <a class="sbw-admin-button sbw-admin-button--ghost" href="${escapeHtml(window.SBWRoutes?.profile ? window.SBWRoutes.profile(key) : `../perfis/perfil.html?u=${encodeURIComponent(key)}`)}" target="_blank" rel="noopener">
            Ver perfil
          </a>

          <button class="sbw-admin-button sbw-admin-button--ghost" type="button" data-admin-action="toggle-profile-permission" data-permission="isAdminSbw" data-profile-key="${escapeHtml(profileId)}">
            Admin SBW
          </button>

          ${canGrantMaster(state.context) ? `
            <button class="sbw-admin-button sbw-admin-button--danger" type="button" data-admin-action="toggle-profile-permission" data-permission="isMasterAdmin" data-profile-key="${escapeHtml(profileId)}">
              Master
            </button>
          ` : ""}

          ${shouldShowApproveOrganizer(profile) ? `
            <button class="sbw-admin-button sbw-admin-button--ghost" type="button" data-admin-action="approve-organizer" data-profile-key="${escapeHtml(profileId)}">
              Aprovar organizador
            </button>
          ` : ""}
        </div>
      </article>
    `;
  }

  function renderTeamResults(teams, options = {}) {
    const root = $("#sbwAdminTeamResults");
    if (!root) return;

    const safeTeams = Array.isArray(teams) ? teams : [];
    const limit = Number.isFinite(options.limit) ? Number(options.limit) : 60;
    const visibleTeams = limit > 0 ? safeTeams.slice(0, limit) : safeTeams;

    if (!safeTeams.length) {
      root.innerHTML = `<p class="sbw-admin-muted">Nenhuma equipe encontrada.</p>`;
      return;
    }

    root.innerHTML = `
      <p class="sbw-admin-muted">
        ${visibleTeams.length} de ${safeTeams.length} equipe(s) exibida(s).
      </p>
      ${visibleTeams.map((team) => renderTeamCard(team)).join("")}
    `;
  }

  function renderTeamCard(team) {
    const key = getTeamKey(team);
    const name = getTeamName(team);
    const tag = getTeamTag(team);
    const verified = isVerifiedTeam(team);
    const memberLimit = team.memberLimit || team.member_limit || (verified ? 100 : 50);
    const modalities = Array.isArray(team.modalities) ? team.modalities.slice(0, 4).join(", ") : "";
    const visibility = team.isPublic === false || team.is_public === false ? "Privada" : "Pública";
    const status = team.status || team.state || "active";
    const captain = team.captainName || team.captain_name || team.captainProfileSlug || team.captain_profile_slug || team.captainUserId || team.captain_user_id || "";

    return `
      <article class="sbw-admin-result-card" data-team-key="${escapeHtml(key)}">
        <div class="sbw-admin-result-main">
          <div class="sbw-admin-avatar">${escapeHtml(tag || name.charAt(0).toUpperCase())}</div>

          <div class="sbw-admin-result-title">
            <strong>${escapeHtml(name)}</strong>
            <small>${escapeHtml([tag, key, visibility, status, captain ? `Capitão: ${captain}` : "", modalities].filter(Boolean).join(" · "))}</small>
          </div>

          <div class="sbw-admin-badges">
            <span class="sbw-admin-badge ${verified ? "sbw-admin-badge--success" : ""}">${verified ? "Verificada" : "Comum"}</span>
            <span class="sbw-admin-badge">Limite ${escapeHtml(memberLimit)}</span>
          </div>
        </div>

        <div class="sbw-admin-actions">
          <a class="sbw-admin-button sbw-admin-button--ghost" href="${escapeHtml(window.SBWRoutes?.team ? window.SBWRoutes.team(key) : `../equipes/equipe.html?id=${encodeURIComponent(key)}`)}" target="_blank" rel="noopener">
            Ver perfil
          </a>

          <a class="sbw-admin-button sbw-admin-button--ghost" href="${escapeHtml(window.SBWRoutes?.myTeam ? window.SBWRoutes.myTeam(key) : `../equipes/minha-equipe.html?id=${encodeURIComponent(key)}`)}">
            Gerenciar
          </a>

          <button class="sbw-admin-button" type="button" data-admin-action="verify-team" data-team-key="${escapeHtml(key)}">
            Verificar equipe
          </button>

          <button class="sbw-admin-button sbw-admin-button--danger" type="button" data-admin-action="unverify-team" data-team-key="${escapeHtml(key)}">
            Remover verificação
          </button>
        </div>
      </article>
    `;
  }

  function getProfileByKey(key) {
    return state.profiles.find((profile) => {
      return String(profile?.id || "") === String(key) || String(getProfileKey(profile) || "") === String(key);
    }) || null;
  }

  function getTeamByKey(key) {
    return state.teams.find((team) => {
      return String(getTeamKey(team) || "") === String(key) || String(team?.id || "") === String(key);
    }) || null;
  }

  async function saveProfilePermissions(profile, permissionKey) {
    if (!profile) return;

    const currentPermissions = getProfilePermissions(profile);
    const nextPermissions = {
      ...currentPermissions,
      [permissionKey]: !Boolean(currentPermissions[permissionKey])
    };

    if (permissionKey === "isMasterAdmin" && !canGrantMaster(state.context)) {
      addLog("Apenas Master Admin pode conceder/remover Master.", "error");
      return;
    }

    const nextMetadata = {
      ...asObject(profile.metadata),
      permissions: nextPermissions
    };

    let saved = false;

    if (state.client && profile.id) {
      try {
        const result = await state.client
          .from(getTable("profiles", "profiles"))
          .update({
            metadata: nextMetadata,
            permissions: nextPermissions,
            updated_at: new Date().toISOString()
          })
          .eq("id", profile.id)
          .select("*")
          .maybeSingle();

        if (result.error) throw result.error;

        if (result.data) {
          Object.assign(profile, result.data);
        } else {
          profile.metadata = nextMetadata;
          profile.permissions = nextPermissions;
        }

        saved = true;
      } catch (error) {
        console.warn("[SBW Admin] Falha ao atualizar permissões no Supabase:", error);
        addLog(`Supabase/RLS recusou atualizar permissão de ${getProfileName(profile)}.`, "warning");
      }
    }

    if (!saved && window.SBWProfilesStorage?.saveProfile) {
      try {
        await window.SBWProfilesStorage.saveProfile({
          ...profile,
          metadata: nextMetadata,
          permissions: nextPermissions
        });
        profile.metadata = nextMetadata;
        profile.permissions = nextPermissions;
        saved = true;
        addLog(`Permissão salva no fallback local para ${getProfileName(profile)}.`, "warning");
      } catch (error) {
        console.warn("[SBW Admin] Falha ao salvar permissão no fallback:", error);
      }
    }

    if (saved) {
      addLog(`Permissão ${permissionKey} alternada para ${getProfileName(profile)}.`);
      renderProfilesList();

      if (profile?.auth_user_id === state.context?.user?.id || profile?.id === state.context?.profile?.id) {
        window.SBWSessionContext?.clearCache?.();
        state.context = await window.SBWSessionContext?.refresh?.();
      }
    }
  }

  async function approveOrganizer(profile) {
    if (!profile) return;

    const authUserId = profile.auth_user_id || profile.authUserId;

    if (!authUserId) {
      addLog(`Perfil ${getProfileName(profile)} não tem auth_user_id para aprovar organizador.`, "error");
      return;
    }

    if (!state.client) {
      addLog("Supabase não disponível para aprovar organizador.", "error");
      return;
    }

    const payload = {
      auth_user_id: authUserId,
      status: "approved",
      role: "organizer_owner",
      can_create_tournaments: true,
      updated_at: new Date().toISOString()
    };

    try {
      const existing = await state.client
        .from("organizer_permissions")
        .select("*")
        .eq("auth_user_id", authUserId)
        .maybeSingle();

      let result;

      if (!existing.error && existing.data?.id) {
        result = await state.client
          .from("organizer_permissions")
          .update(payload)
          .eq("id", existing.data.id)
          .select("*")
          .maybeSingle();
      } else {
        result = await state.client
          .from("organizer_permissions")
          .insert({ ...payload, created_at: new Date().toISOString() })
          .select("*")
          .maybeSingle();
      }

      if (result.error) throw result.error;

      addLog(`Organizador aprovado para ${getProfileName(profile)}.`);
      await refreshData();
    } catch (error) {
      console.warn("[SBW Admin] Falha ao aprovar organizador:", error);
      addLog("Não foi possível aprovar organizador. Provável falta de tabela/policy RLS.", "warning");
    }
  }

  async function saveTeamVerification(team, shouldVerify) {
    if (!team) return;

    const key = getTeamKey(team);
    const patch = {
      isVerified: shouldVerify,
      is_verified: shouldVerify,
      verificationStatus: shouldVerify ? "verified" : "not_verified",
      verification_status: shouldVerify ? "verified" : "not_verified",
      memberLimit: shouldVerify ? 100 : 50,
      member_limit: shouldVerify ? 100 : 50,
      updatedAt: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    let saved = false;

    if (state.client) {
      const table = getTable("teams", "teams");
      const attempts = [];

      if (team.id) attempts.push(["id", team.id]);
      if (team.slug) attempts.push(["slug", team.slug]);

      for (const [column, value] of attempts) {
        try {
          const result = await state.client
            .from(table)
            .update({
              is_verified: shouldVerify,
              verification_status: shouldVerify ? "verified" : "not_verified",
              member_limit: shouldVerify ? 100 : 50,
              updated_at: new Date().toISOString()
            })
            .eq(column, value)
            .select("*")
            .maybeSingle();

          if (!result.error) {
            saved = true;
            break;
          }
        } catch (error) {
          // tenta fallback abaixo
        }
      }

      if (!saved) {
        addLog(`Supabase/RLS recusou atualizar verificação de ${getTeamName(team)}.`, "warning");
      }
    }

    if (!saved && window.SBWTeamsStorage?.saveTeam) {
      try {
        await window.SBWTeamsStorage.saveTeam({ ...team, ...patch });
        saved = true;
        addLog(`Verificação salva no fallback local para ${getTeamName(team)}.`, "warning");
      } catch (error) {
        console.warn("[SBW Admin] Falha ao salvar equipe no fallback:", error);
      }
    }

    if (saved) {
      addLog(`${shouldVerify ? "Verificação concedida" : "Verificação removida"} para ${getTeamName(team)}.`);
      await refreshData();
      renderTeamsList();
    }
  }

  function bindTabs() {
    $all("[data-sbw-admin-tab]").forEach((button) => {
      button.addEventListener("click", () => {
        const tab = button.dataset.sbwAdminTab;

        $all("[data-sbw-admin-tab]").forEach((item) => {
          item.classList.toggle("is-active", item === button);
        });

        $all("[data-sbw-admin-panel]").forEach((panel) => {
          panel.classList.toggle("is-active", panel.dataset.sbwAdminPanel === tab);
        });
      });
    });
  }

  function bindSearchForms() {
    const profileForm = $("[data-sbw-admin-profile-search]");
    const teamForm = $("[data-sbw-admin-team-search]");

    if (profileForm) {
      profileForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const query = profileForm.query.value || "";

        state.profileListExpanded = false;
        state.profileLetterFilter = "";
        renderAlphaFilters();

        if (query.trim().length < 2) {
          renderProfileResults([]);
          $("#sbwAdminProfileResults").innerHTML = `<p class="sbw-admin-muted">Digite pelo menos 2 caracteres para buscar perfis.</p>`;
          updateListControls();
          return;
        }

        renderProfilesList();
      });
    }

    if (teamForm) {
      teamForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const query = teamForm.query.value || "";

        state.teamListExpanded = false;
        state.teamLetterFilter = "";
        renderAlphaFilters();

        if (query.trim().length < 2) {
          renderTeamResults([]);
          $("#sbwAdminTeamResults").innerHTML = `<p class="sbw-admin-muted">Digite pelo menos 2 caracteres para buscar equipes.</p>`;
          updateListControls();
          return;
        }

        renderTeamsList();
      });
    }
  }

  function bindActions() {
    document.addEventListener("click", async (event) => {
      const button = event.target.closest("[data-admin-action]");
      if (!button) return;

      const action = button.dataset.adminAction;
      button.disabled = true;

      try {
        if (action === "run-rls-diagnostics") {
          await runRlsDiagnostics();
        }

        if (action === "show-all-profiles") {
          state.profileListExpanded = true;
          state.profileLetterFilter = "";
          renderAlphaFilters();
          renderProfilesList();
          addLog(`Listando todos os ${state.profiles.length} perfil(is) carregado(s) para a conta Admin.`);
        }

        if (action === "show-less-profiles") {
          state.profileListExpanded = false;
          state.profileLetterFilter = "";
          renderAlphaFilters();
          renderProfilesList();
          addLog("Lista de perfis recolhida.");
        }

        if (action === "show-all-teams") {
          state.teamListExpanded = true;
          state.teamLetterFilter = "";
          renderAlphaFilters();
          renderTeamsList();
          addLog(`Listando todas as ${state.teams.length} equipe(s) carregada(s) para a conta Admin.`);
        }

        if (action === "show-less-teams") {
          state.teamListExpanded = false;
          state.teamLetterFilter = "";
          renderAlphaFilters();
          renderTeamsList();
          addLog("Lista de equipes recolhida.");
        }

        if (action === "filter-list-letter") {
          const scope = button.dataset.filterScope;
          const letter = button.dataset.filterLetter || "";

          if (scope === "profiles") {
            state.profileLetterFilter = letter;
            state.profileListExpanded = true;
            renderAlphaFilters();
            renderProfilesList();
          }

          if (scope === "teams") {
            state.teamLetterFilter = letter;
            state.teamListExpanded = true;
            renderAlphaFilters();
            renderTeamsList();
          }
        }

        if (action === "toggle-profile-permission") {
          const profile = getProfileByKey(button.dataset.profileKey);
          await saveProfilePermissions(profile, button.dataset.permission);
        }

        if (action === "approve-organizer") {
          const profile = getProfileByKey(button.dataset.profileKey);
          await approveOrganizer(profile);
        }

        if (action === "verify-team") {
          const team = getTeamByKey(button.dataset.teamKey);
          await saveTeamVerification(team, true);
        }

        if (action === "unverify-team") {
          const team = getTeamByKey(button.dataset.teamKey);
          await saveTeamVerification(team, false);
        }
      } finally {
        button.disabled = false;
      }
    });
  }

  async function init() {
    const page = document.getElementById("sbwAdminPage");
    window.SBWPageState?.setBusy?.(page, true);

    try {
      bindTabs();
      bindSearchForms();
      bindActions();

      state.client = await waitForSupabaseClient();

      if (!window.SBWSessionContext?.getCurrentContext) {
        setStatus("Núcleo de sessão não carregado.", "error");
        showGate("Não foi possível carregar o contexto de sessão. Verifique se <code>js/core/sbw-session-context.js</code> foi carregado.", true);
        return;
      }

      state.context = await window.SBWSessionContext.getCurrentContext({ refresh: true });

      if (!state.context?.user) {
        setStatus("Sessão ausente.", "error");
        showGate(`Você precisa estar logado para acessar o Admin Master. <a href="${escapeHtml(window.SBWRoutes?.login ? window.SBWRoutes.login(window.location.href) : "../auth/login.html")}">Entrar</a>`, true);
        return;
      }

      const adminRoles = state.context.permissions?.roles?.join(", ") || "sem roles explícitas";

      setStatus(`
        <strong>${escapeHtml(state.context.displayName || state.context.email)}</strong><br />
        ${escapeHtml(state.context.email || "")}
        <br /><small>${escapeHtml(adminRoles)}</small>
      `);

      if (!canAccessAdmin(state.context)) {
        showGate(
          "Sua conta está logada, mas ainda não possui permissão administrativa no site. " +
          "Nesta fase, a permissão precisa existir no Supabase/profile/site_permissions para abrir o painel.",
          true
        );
        return;
      }

      showShell();
      await refreshData();
      renderAlphaFilters();
      updateListControls();
      addLog("Painel Admin Master inicial carregado.");
    } catch (error) {
      console.error("[SBW Admin] Falha ao carregar painel Admin Master:", error);
      setStatus("Erro ao carregar painel.", "error");
      showGate("Não foi possível carregar o painel administrativo. Atualize a página e tente novamente.", true);
    } finally {
      window.SBWPageState?.setBusy?.(page, false);
      window.SBWPageState?.markReady?.();
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
