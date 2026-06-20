const sbwOrganizerEditorAccess = document.getElementById("organizerEditorAccess");
const sbwOrganizerEditorShell = document.getElementById("organizerEditorShell");
const sbwOrganizerEditorForm = document.getElementById("organizerEditorForm");
const sbwOrganizerEditorMessage = document.getElementById("organizerEditorMessage");
const sbwOrganizerEditorStatusText = document.getElementById("organizerEditorStatusText");
const sbwOrganizerPreview = document.getElementById("organizerPreview");
const sbwOrganizerOpenPublic = document.getElementById("organizerOpenPublic");
const sbwOrganizerResetLocal = document.getElementById("organizerResetLocal");
const sbwOrganizerCreateTournament = document.getElementById("organizerCreateTournament");

let sbwOrganizerEditorCurrent = null;
let sbwOrganizerEditorSlug = "";
let sbwOrganizerEditorIsNew = false;

function sbwOrganizerEditorGetField(id) {
  return document.getElementById(id);
}

function sbwOrganizerEditorSetMessage(message, type = "success") {
  if (!sbwOrganizerEditorMessage) {
    return;
  }

  sbwOrganizerEditorMessage.textContent = message;
  sbwOrganizerEditorMessage.classList.add("is-visible");
  sbwOrganizerEditorMessage.classList.toggle("error", type === "error");
}

function sbwOrganizerEditorClearMessage() {
  if (!sbwOrganizerEditorMessage) {
    return;
  }

  sbwOrganizerEditorMessage.textContent = "";
  sbwOrganizerEditorMessage.classList.remove("is-visible", "error");
}

function sbwOrganizerEditorSplitList(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function sbwOrganizerEditorJoinList(value) {
  if (!Array.isArray(value)) {
    return "";
  }

  return value.filter(Boolean).join(", ");
}

function sbwOrganizerEditorGetTheme(organizer) {
  if (typeof sbwGetTournamentOrganizerTheme === "function") {
    return sbwGetTournamentOrganizerTheme(organizer);
  }

  return organizer?.theme || {
    primary: "#38bdf8",
    secondary: "#7c3cff",
    accent: "#facc15",
    text: "#f8fafc"
  };
}

function sbwOrganizerEditorGetInitials(organizer) {
  return String(organizer?.tag || organizer?.name || "ORG")
    .trim()
    .slice(0, 4)
    .toUpperCase();
}

function sbwOrganizerEditorGetLoginUrl() {
  if (window.SBWAuth && typeof window.SBWAuth.getLoginUrl === "function") {
    return window.SBWAuth.getLoginUrl(window.location.href);
  }

  return "../auth/login.html";
}

function sbwOrganizerEditorCanCreateTournament(organizer) {
  if (!organizer) {
    return false;
  }

  const role = String(organizer.memberRole || organizer.role || organizer.currentUserRole || "").toLowerCase();

  return Boolean(
    organizer.canCreateTournament === true ||
    organizer.can_create_tournaments === true ||
    organizer.canManage === true ||
    organizer.can_manage === true ||
    ["owner", "admin", "manager", "organizer_admin", "tournament_admin"].includes(role)
  );
}

function sbwOrganizerEditorBuildCreateTournamentUrl(organizer) {
  const slug = organizer?.slug || sbwOrganizerEditorSlug || "";
  const id = organizer?.id || organizer?.raw?.id || "";
  const key = slug || id;

  if (!key) {
    return "create-tournament/criar-torneio.html";
  }

  return `create-tournament/criar-torneio.html?organizer=${encodeURIComponent(key)}`;
}

function sbwOrganizerEditorUpdateCreateTournamentLink(organizer) {
  if (!sbwOrganizerCreateTournament) {
    return;
  }

  const slug = organizer?.slug || sbwOrganizerEditorSlug || "";
  const id = organizer?.id || organizer?.raw?.id || "";
  const canCreateTournament = sbwOrganizerEditorCanCreateTournament(organizer);

  if (!slug && !id) {
    sbwOrganizerCreateTournament.hidden = true;
    sbwOrganizerCreateTournament.removeAttribute("href");
    return;
  }

  sbwOrganizerCreateTournament.hidden = !canCreateTournament;
  sbwOrganizerCreateTournament.href = sbwOrganizerEditorBuildCreateTournamentUrl(organizer);
}

async function sbwOrganizerEditorMergeAccess(organizer) {
  if (!organizer || typeof sbwGetMyTournamentOrganizerAccessAsync !== "function") {
    return organizer;
  }

  try {
    const accessList = await sbwGetMyTournamentOrganizerAccessAsync();
    const organizerKeys = [organizer.id, organizer.slug, organizer.name, organizer.displayName, organizer.raw?.id, organizer.raw?.slug]
      .filter(Boolean)
      .map((value) => String(value).trim().toLowerCase());

    const match = (Array.isArray(accessList) ? accessList : []).find((item) => {
      const itemKeys = [item.id, item.slug, item.name, item.displayName, item.raw?.id, item.raw?.slug]
        .filter(Boolean)
        .map((value) => String(value).trim().toLowerCase());

      return itemKeys.some((key) => organizerKeys.includes(key));
    });

    if (!match) {
      return organizer;
    }

    return {
      ...organizer,
      memberRole: match.memberRole || match.role || organizer.memberRole || organizer.role,
      role: match.memberRole || match.role || organizer.role,
      canCreateTournament: match.canCreateTournament === true || match.can_create_tournaments === true || ["owner", "admin", "manager", "organizer_admin", "tournament_admin"].includes(String(match.memberRole || match.role || "").toLowerCase()),
      can_create_tournaments: match.can_create_tournaments === true || match.canCreateTournament === true || ["owner", "admin", "manager", "organizer_admin", "tournament_admin"].includes(String(match.memberRole || match.role || "").toLowerCase()),
      canManage: true
    };
  } catch (error) {
    console.warn("[SBW Organizadores] Não foi possível validar permissão de criar torneio:", error);
    return organizer;
  }
}

async function sbwOrganizerEditorCheckAccess() {
  if (sbwOrganizerEditorAccess) {
    sbwOrganizerEditorAccess.hidden = false;
    sbwOrganizerEditorAccess.innerHTML = "Verificando conta e permissão real de organização...";
  }

  if (!window.SBWAuth || typeof window.SBWAuth.getUser !== "function") {
    if (sbwOrganizerEditorAccess) {
      sbwOrganizerEditorAccess.innerHTML = `
        <strong>Login -SBW- não carregado.</strong><br>
        Volte pelo menu principal e tente acessar novamente.
      `;
    }

    return false;
  }

  const user = await window.SBWAuth.getUser();

  if (!user) {
    window.location.href = sbwOrganizerEditorGetLoginUrl();
    return false;
  }

  let context = null;

  if (window.SBWSessionContext && typeof window.SBWSessionContext.getCurrentContext === "function") {
    context = await window.SBWSessionContext.getCurrentContext({ refresh: true });
  }

  let profile = context?.profile || null;

  if (!profile && typeof window.SBWAuth.ensureCurrentUserProfile === "function") {
    profile = await window.SBWAuth.ensureCurrentUserProfile();
  }

  const permissions = context?.permissions || profile?.permissions || {};
  const canCreateOrganization = Boolean(
    context?.canCreateTournamentOrganizer ||
    permissions.canCreateTournamentOrganizer ||
    permissions.can_create_tournament_organizer ||
    permissions.canCreateTournamentOrganizers ||
    permissions.can_create_tournament_organizers ||
    permissions.canCreateOrganization ||
    permissions.can_create_organization ||
    permissions.canCreateOrganizations ||
    permissions.can_create_organizations ||
    permissions.isAdminSbw ||
    permissions.is_admin_sbw ||
    permissions.isMasterAdmin ||
    permissions.is_master_admin ||
    permissions.isAdmin ||
    permissions.is_admin
  );

  if (!canCreateOrganization) {
    if (sbwOrganizerEditorAccess) {
      sbwOrganizerEditorAccess.innerHTML = `
        <strong>Acesso restrito.</strong><br>
        Sua conta ainda não possui permissão da -SBW- para criar ou gerenciar uma Organização de Torneios.
      `;
    }

    if (sbwOrganizerEditorShell) {
      sbwOrganizerEditorShell.hidden = true;
    }

    return false;
  }

  if (sbwOrganizerEditorAccess) {
    sbwOrganizerEditorAccess.hidden = true;
  }

  if (sbwOrganizerEditorShell) {
    sbwOrganizerEditorShell.hidden = false;
  }

  return true;
}

function sbwOrganizerEditorReadForm() {
  return {
    slug: sbwOrganizerEditorCurrent?.slug || sbwOrganizerEditorSlug,
    name: sbwOrganizerEditorGetField("organizerName")?.value.trim() || "Organizador",
    displayName: sbwOrganizerEditorGetField("organizerName")?.value.trim() || "Organizador",
    tag: sbwOrganizerEditorGetField("organizerTag")?.value.trim() || "",
    type: sbwOrganizerEditorGetField("organizerType")?.value.trim() || "Organizador de torneios",
    status: sbwOrganizerEditorGetField("organizerStatus")?.value || "active",
    description: sbwOrganizerEditorGetField("organizerDescription")?.value.trim() || "",
    games: sbwOrganizerEditorSplitList(sbwOrganizerEditorGetField("organizerGames")?.value),
    aliases: sbwOrganizerEditorSplitList(sbwOrganizerEditorGetField("organizerAliases")?.value),
    bannerUrl: sbwOrganizerEditorGetField("organizerBannerUrl")?.value.trim() || "",
    logoUrl: sbwOrganizerEditorGetField("organizerLogoUrl")?.value.trim() || "",
    theme: {
      primary: sbwOrganizerEditorGetField("organizerThemePrimary")?.value || "#38bdf8",
      secondary: sbwOrganizerEditorGetField("organizerThemeSecondary")?.value || "#7c3cff",
      accent: sbwOrganizerEditorGetField("organizerThemeAccent")?.value || "#facc15",
      text: sbwOrganizerEditorGetField("organizerThemeText")?.value || "#f8fafc"
    },
    links: {
      website: sbwOrganizerEditorGetField("organizerWebsite")?.value.trim() || "",
      discord: sbwOrganizerEditorGetField("organizerDiscord")?.value.trim() || "",
      instagram: sbwOrganizerEditorGetField("organizerInstagram")?.value.trim() || "",
      youtube: sbwOrganizerEditorGetField("organizerYoutube")?.value.trim() || "",
      twitch: sbwOrganizerEditorGetField("organizerTwitch")?.value.trim() || "",
      x: sbwOrganizerEditorGetField("organizerX")?.value.trim() || ""
    }
  };
}

function sbwOrganizerEditorHydrateForm(organizer) {
  const theme = sbwOrganizerEditorGetTheme(organizer);
  const links = organizer?.links || {};

  sbwOrganizerEditorGetField("organizerName").value = organizer?.name || organizer?.displayName || "";
  sbwOrganizerEditorGetField("organizerTag").value = organizer?.tag || "";
  sbwOrganizerEditorGetField("organizerType").value = organizer?.type || "Organizador de torneios";
  sbwOrganizerEditorGetField("organizerStatus").value = organizer?.status || "active";
  sbwOrganizerEditorGetField("organizerDescription").value = organizer?.description || "";
  sbwOrganizerEditorGetField("organizerGames").value = sbwOrganizerEditorJoinList(organizer?.games);
  sbwOrganizerEditorGetField("organizerAliases").value = sbwOrganizerEditorJoinList(organizer?.aliases);
  sbwOrganizerEditorGetField("organizerBannerUrl").value = organizer?.bannerUrl || "";
  sbwOrganizerEditorGetField("organizerLogoUrl").value = organizer?.logoUrl || "";
  sbwOrganizerEditorGetField("organizerThemePrimary").value = theme.primary || "#38bdf8";
  sbwOrganizerEditorGetField("organizerThemeSecondary").value = theme.secondary || "#7c3cff";
  sbwOrganizerEditorGetField("organizerThemeAccent").value = theme.accent || "#facc15";
  sbwOrganizerEditorGetField("organizerThemeText").value = theme.text || "#f8fafc";
  sbwOrganizerEditorGetField("organizerWebsite").value = links.website || "";
  sbwOrganizerEditorGetField("organizerDiscord").value = links.discord || "";
  sbwOrganizerEditorGetField("organizerInstagram").value = links.instagram || "";
  sbwOrganizerEditorGetField("organizerYoutube").value = links.youtube || "";
  sbwOrganizerEditorGetField("organizerTwitch").value = links.twitch || "";
  sbwOrganizerEditorGetField("organizerX").value = links.x || "";
}

function sbwOrganizerEditorRenderPreview() {
  if (!sbwOrganizerPreview) {
    return;
  }

  const formData = sbwOrganizerEditorReadForm();
  const previewOrganizer = {
    ...sbwOrganizerEditorCurrent,
    ...formData
  };
  const themeStyle = typeof sbwGetTournamentOrganizerThemeStyle === "function"
    ? sbwGetTournamentOrganizerThemeStyle(previewOrganizer)
    : "";
  const name = formData.name || "Organizador";
  const initials = sbwOrganizerEditorGetInitials(previewOrganizer);
  const logoHTML = formData.logoUrl
    ? `<img src="${sbwEscapeHTML(formData.logoUrl)}" alt="Logo ${sbwEscapeHTML(name)}">`
    : `<span>${sbwEscapeHTML(initials)}</span>`;
  const bannerHTML = formData.bannerUrl
    ? `<img src="${sbwEscapeHTML(formData.bannerUrl)}" alt="" aria-hidden="true">`
    : "";
  const activeLinks = Object.entries(formData.links || {}).filter(([, value]) => Boolean(value));

  sbwOrganizerPreview.setAttribute("style", themeStyle);
  sbwOrganizerPreview.innerHTML = `
    <div class="organizer-admin-preview-cover">
      ${bannerHTML}
    </div>

    <div class="organizer-admin-preview-body">
      <div class="organizer-admin-preview-head">
        <div class="organizer-admin-preview-logo">
          ${logoHTML}
        </div>

        <div>
          <h3>${sbwEscapeHTML(name)}</h3>
          <div class="organizer-admin-preview-badges">
            <span>${sbwEscapeHTML(formData.type || "Organizador")}</span>
            <span>${sbwEscapeHTML(typeof sbwGetOrganizerStatusLabel === "function" ? sbwGetOrganizerStatusLabel(formData.status) : formData.status)}</span>
            ${formData.games.slice(0, 3).map((game) => `<span>${sbwEscapeHTML(game)}</span>`).join("")}
          </div>
        </div>
      </div>

      <p>${sbwEscapeHTML(formData.description || "Descrição pública do organizador.")}</p>

      ${activeLinks.length
        ? `<div class="organizer-admin-preview-links">${activeLinks.map(([key]) => `<span>${sbwEscapeHTML(key)}</span>`).join("")}</div>`
        : `<p class="organizer-admin-note">Nenhum link público configurado ainda.</p>`
      }
    </div>
  `;
}

function sbwOrganizerEditorBindPreviewEvents() {
  if (!sbwOrganizerEditorForm) {
    return;
  }

  sbwOrganizerEditorForm.querySelectorAll("input, textarea, select").forEach((field) => {
    field.addEventListener("input", sbwOrganizerEditorRenderPreview);
    field.addEventListener("change", sbwOrganizerEditorRenderPreview);
  });
}

function sbwOrganizerEditorSetSaving(isSaving) {
  const submitButton = sbwOrganizerEditorForm?.querySelector('button[type="submit"]');

  if (!submitButton) {
    return;
  }

  submitButton.disabled = Boolean(isSaving);
  submitButton.classList.toggle("is-loading", Boolean(isSaving));
  submitButton.innerHTML = isSaving
    ? `<i class="fa-solid fa-circle-notch fa-spin"></i> Salvando...`
    : `<i class="fa-solid fa-floppy-disk"></i> Salvar organização`;
}

function sbwOrganizerEditorBindSave() {
  if (!sbwOrganizerEditorForm) {
    return;
  }

  sbwOrganizerEditorForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    sbwOrganizerEditorClearMessage();
    sbwOrganizerEditorSetSaving(true);

    try {
      const formData = sbwOrganizerEditorReadForm();
      let result = null;

      if (sbwOrganizerEditorIsNew) {
        if (typeof sbwCreateTournamentOrganizerAsync !== "function") {
          throw new Error("Função de criação real de organização não encontrada.");
        }

        result = await sbwCreateTournamentOrganizerAsync(formData);
        sbwOrganizerEditorIsNew = false;
      } else {
        if (typeof sbwUpdateTournamentOrganizerProfileAsync !== "function") {
          throw new Error("Função de edição real de organização não encontrada.");
        }

        result = await sbwUpdateTournamentOrganizerProfileAsync(sbwOrganizerEditorSlug, formData);
      }

      let organizer = result?.organizer || null;

      if (!organizer) {
        throw new Error("Supabase salvou, mas não retornou os dados da organização.");
      }

      organizer = await sbwOrganizerEditorMergeAccess(organizer);
      sbwOrganizerEditorCurrent = organizer;
      sbwOrganizerEditorSlug = organizer.slug || sbwOrganizerEditorSlug;

      if (sbwOrganizerEditorSlug && window.history?.replaceState) {
        const nextUrl = `${window.location.pathname}?slug=${encodeURIComponent(sbwOrganizerEditorSlug)}`;
        window.history.replaceState({}, "", nextUrl);
      }

      if (sbwOrganizerOpenPublic) {
        sbwOrganizerOpenPublic.href = `organizador.html?slug=${encodeURIComponent(sbwOrganizerEditorSlug)}`;
      }

      sbwOrganizerEditorUpdateCreateTournamentLink(organizer);

      if (sbwOrganizerEditorStatusText) {
        sbwOrganizerEditorStatusText.textContent = `${organizer.name || organizer.displayName || "Organização"} salva no Supabase. O perfil público já pode ser aberto.`;
      }

      sbwOrganizerEditorHydrateForm(organizer);
      sbwOrganizerEditorRenderPreview();
      sbwOrganizerEditorSetMessage(result?.message || "Organização salva no Supabase.");
    } catch (error) {
      console.error("Erro ao salvar organização no Supabase:", error);
      sbwOrganizerEditorSetMessage(error?.message || "Não foi possível salvar a organização no Supabase.", "error");
    } finally {
      sbwOrganizerEditorSetSaving(false);
    }
  });
}

function sbwOrganizerEditorBindReset() {
  if (!sbwOrganizerResetLocal) {
    return;
  }

  sbwOrganizerResetLocal.addEventListener("click", async () => {
    sbwOrganizerEditorClearMessage();

    if (sbwOrganizerEditorIsNew) {
      const shouldClear = window.confirm("Limpar o formulário de criação da organização?");

      if (!shouldClear) {
        return;
      }

      sbwOrganizerEditorCurrent = null;
      sbwOrganizerEditorHydrateForm({
        name: "",
        tag: "",
        type: "Organizador de torneios",
        status: "active",
        description: "",
        games: [],
        aliases: [],
        links: {},
        theme: {}
      });
      sbwOrganizerEditorRenderPreview();
      sbwOrganizerEditorSetMessage("Formulário limpo. Preencha novamente para criar a organização.");
      return;
    }

    if (!sbwOrganizerEditorSlug) {
      return;
    }

    const shouldReload = window.confirm("Recarregar os dados reais desta organização do Supabase?");

    if (!shouldReload) {
      return;
    }

    let organizer = await sbwGetTournamentOrganizerBySlugAsync(sbwOrganizerEditorSlug);
    organizer = await sbwOrganizerEditorMergeAccess(organizer);
    sbwOrganizerEditorCurrent = organizer;
    sbwOrganizerEditorHydrateForm(organizer);
    sbwOrganizerEditorRenderPreview();
    sbwOrganizerEditorUpdateCreateTournamentLink(organizer);
    sbwOrganizerEditorSetMessage("Dados recarregados do Supabase.");
  });
}

async function sbwOrganizerEditorLoad() {
  const isNewOrganizationEntry = sbwGetQueryParam("novo") === "1" || sbwGetQueryParam("create") === "1";
  sbwOrganizerEditorSlug = sbwGetQueryParam("slug") || sbwGetQueryParam("id") || "";

  const hasAccess = await sbwOrganizerEditorCheckAccess();

  if (!hasAccess) {
    return;
  }

  if (!sbwOrganizerEditorSlug && isNewOrganizationEntry) {
    sbwOrganizerEditorIsNew = true;
    sbwOrganizerEditorCurrent = {
      name: "",
      tag: "",
      type: "Organizador de torneios",
      status: "active",
      description: "",
      games: [],
      aliases: [],
      links: {},
      theme: {}
    };

    document.title = "Criar Organização de Torneios | -SBW-";

    if (sbwOrganizerEditorAccess) {
      sbwOrganizerEditorAccess.hidden = true;
    }

    if (sbwOrganizerEditorShell) {
      sbwOrganizerEditorShell.hidden = false;
    }

    if (sbwOrganizerEditorStatusText) {
      sbwOrganizerEditorStatusText.textContent = "Permissão confirmada. Preencha os dados para criar uma Organização de Torneios real no Supabase.";
    }

    if (sbwOrganizerOpenPublic) {
      sbwOrganizerOpenPublic.href = "torneios.html";
    }

    sbwOrganizerEditorUpdateCreateTournamentLink(null);

    sbwOrganizerEditorHydrateForm(sbwOrganizerEditorCurrent);
    sbwOrganizerEditorBindPreviewEvents();
    sbwOrganizerEditorBindSave();
    sbwOrganizerEditorBindReset();
    sbwOrganizerEditorRenderPreview();
    return;
  }

  if (!sbwOrganizerEditorSlug) {
    if (sbwOrganizerEditorShell) {
      sbwOrganizerEditorShell.hidden = true;
    }

    if (sbwOrganizerEditorAccess) {
      sbwOrganizerEditorAccess.hidden = false;
      sbwOrganizerEditorAccess.innerHTML = `
        <strong>Organizador não informado.</strong><br>
        Abra este painel a partir da página pública do organizador ou use a entrada “Criar organização”.
      `;
    }

    return;
  }


  let organizer = null;

  try {
    organizer = await sbwGetTournamentOrganizerBySlugAsync(sbwOrganizerEditorSlug);
  } catch (error) {
    console.error("Erro ao carregar organizador para edição:", error);
  }

  if (!organizer) {
    if (sbwOrganizerEditorAccess) {
      sbwOrganizerEditorAccess.hidden = false;
      sbwOrganizerEditorAccess.innerHTML = `
        <strong>Organizador não encontrado.</strong><br>
        Confira o slug/id usado na URL.
      `;
    }

    if (sbwOrganizerEditorShell) {
      sbwOrganizerEditorShell.hidden = true;
    }

    return;
  }

  organizer = await sbwOrganizerEditorMergeAccess(organizer);
  sbwOrganizerEditorCurrent = organizer;

  document.title = `Editar ${organizer.name || organizer.displayName || "Organizador"} | -SBW-`;

  if (sbwOrganizerEditorStatusText) {
    sbwOrganizerEditorStatusText.textContent = `${organizer.name || organizer.displayName || "Organizador"} carregado. As alterações agora são salvas no Supabase.`;
  }

  if (sbwOrganizerOpenPublic) {
    sbwOrganizerOpenPublic.href = `organizador.html?slug=${encodeURIComponent(organizer.slug || sbwOrganizerEditorSlug)}`;
  }

  sbwOrganizerEditorUpdateCreateTournamentLink(organizer);

  sbwOrganizerEditorHydrateForm(organizer);
  sbwOrganizerEditorBindPreviewEvents();
  sbwOrganizerEditorBindSave();
  sbwOrganizerEditorBindReset();
  sbwOrganizerEditorRenderPreview();
}

sbwOrganizerEditorLoad();
