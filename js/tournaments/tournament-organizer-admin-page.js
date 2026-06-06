const sbwOrganizerEditorAccess = document.getElementById("organizerEditorAccess");
const sbwOrganizerEditorShell = document.getElementById("organizerEditorShell");
const sbwOrganizerEditorForm = document.getElementById("organizerEditorForm");
const sbwOrganizerEditorMessage = document.getElementById("organizerEditorMessage");
const sbwOrganizerEditorStatusText = document.getElementById("organizerEditorStatusText");
const sbwOrganizerPreview = document.getElementById("organizerPreview");
const sbwOrganizerOpenPublic = document.getElementById("organizerOpenPublic");
const sbwOrganizerResetLocal = document.getElementById("organizerResetLocal");

let sbwOrganizerEditorCurrent = null;
let sbwOrganizerEditorSlug = "";

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

async function sbwOrganizerEditorCheckAccess() {
  if (sbwOrganizerEditorAccess) {
    sbwOrganizerEditorAccess.innerHTML = "Verificando conta e permissões do organizador...";
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

  let profile = null;

  if (typeof window.SBWAuth.ensureCurrentUserProfile === "function") {
    profile = await window.SBWAuth.ensureCurrentUserProfile();
  }

  const permissions = profile?.permissions || {};
  const canEditOrganizer = Boolean(
    permissions.canCreateTournament ||
    permissions.can_create_tournament ||
    permissions.can_create_tournaments ||
    permissions.isAdmin ||
    permissions.is_admin
  );

  if (!canEditOrganizer) {
    if (sbwOrganizerEditorAccess) {
      sbwOrganizerEditorAccess.innerHTML = `
        <strong>Acesso restrito.</strong><br>
        Apenas organizadores aprovados pela -SBW- podem editar perfis de organizador.
      `;
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

function sbwOrganizerEditorBindSave() {
  if (!sbwOrganizerEditorForm) {
    return;
  }

  sbwOrganizerEditorForm.addEventListener("submit", (event) => {
    event.preventDefault();
    sbwOrganizerEditorClearMessage();

    try {
      const formData = sbwOrganizerEditorReadForm();

      if (typeof sbwSaveTournamentOrganizerLocalOverride !== "function") {
        throw new Error("Função de salvamento local não encontrada.");
      }

      sbwSaveTournamentOrganizerLocalOverride(sbwOrganizerEditorSlug, formData);
      sbwOrganizerEditorCurrent = {
        ...sbwOrganizerEditorCurrent,
        ...formData,
        localOverride: true
      };

      sbwOrganizerEditorRenderPreview();
      sbwOrganizerEditorSetMessage("Alterações salvas no teste local. Abra o perfil público para conferir o resultado.");
    } catch (error) {
      console.error("Erro ao salvar organizador localmente:", error);
      sbwOrganizerEditorSetMessage("Não foi possível salvar as alterações locais. Veja o Console para detalhes.", "error");
    }
  });
}

function sbwOrganizerEditorBindReset() {
  if (!sbwOrganizerResetLocal) {
    return;
  }

  sbwOrganizerResetLocal.addEventListener("click", async () => {
    if (!sbwOrganizerEditorSlug) {
      return;
    }

    const shouldReset = window.confirm("Limpar as alterações locais deste organizador e voltar para os dados originais?");

    if (!shouldReset) {
      return;
    }

    if (typeof sbwClearTournamentOrganizerLocalOverride === "function") {
      sbwClearTournamentOrganizerLocalOverride(sbwOrganizerEditorSlug);
    }

    const organizer = await sbwGetTournamentOrganizerBySlugAsync(sbwOrganizerEditorSlug);
    sbwOrganizerEditorCurrent = organizer;
    sbwOrganizerEditorHydrateForm(organizer);
    sbwOrganizerEditorRenderPreview();
    sbwOrganizerEditorSetMessage("Alterações locais limpas. O organizador voltou para a origem Supabase/demo.");
  });
}

async function sbwOrganizerEditorLoad() {
  sbwOrganizerEditorSlug = sbwGetQueryParam("slug") || sbwGetQueryParam("id") || "";

  if (!sbwOrganizerEditorSlug) {
    if (sbwOrganizerEditorAccess) {
      sbwOrganizerEditorAccess.innerHTML = `
        <strong>Organizador não informado.</strong><br>
        Abra este painel a partir da página pública do organizador.
      `;
    }

    return;
  }

  const hasAccess = await sbwOrganizerEditorCheckAccess();

  if (!hasAccess) {
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

  sbwOrganizerEditorCurrent = organizer;

  document.title = `Editar ${organizer.name || organizer.displayName || "Organizador"} | -SBW-`;

  if (sbwOrganizerEditorStatusText) {
    sbwOrganizerEditorStatusText.textContent = `${organizer.name || organizer.displayName || "Organizador"} carregado. As alterações desta versão ficam em localStorage para teste visual.`;
  }

  if (sbwOrganizerOpenPublic) {
    sbwOrganizerOpenPublic.href = `organizador.html?slug=${encodeURIComponent(organizer.slug || sbwOrganizerEditorSlug)}`;
  }

  sbwOrganizerEditorHydrateForm(organizer);
  sbwOrganizerEditorBindPreviewEvents();
  sbwOrganizerEditorBindSave();
  sbwOrganizerEditorBindReset();
  sbwOrganizerEditorRenderPreview();
}

sbwOrganizerEditorLoad();
