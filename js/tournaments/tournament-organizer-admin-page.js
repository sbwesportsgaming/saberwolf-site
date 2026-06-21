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

const sbwOrganizerEditorAssetConfig = {
  bucket: "sbw-team-assets",
  allowedTypes: ["image/png", "image/jpeg", "image/webp"],
  logoMaxBytes: 2 * 1024 * 1024,
  bannerMaxBytes: 4 * 1024 * 1024
};

function sbwOrganizerEditorEscape(value) {
  if (typeof sbwEscapeHTML === "function") {
    return sbwEscapeHTML(value);
  }

  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function sbwOrganizerEditorAsObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function sbwOrganizerEditorClampNumber(value, min, max, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, number));
}

function sbwOrganizerEditorStyleAttribute(...parts) {
  const value = parts.filter(Boolean).join(" ").trim();
  return value ? `style="${sbwOrganizerEditorEscape(value)}"` : "";
}

function sbwOrganizerEditorGetAssetLabel(assetType) {
  return assetType === "banner" ? "banner" : "logo";
}

function sbwOrganizerEditorGetAssetMaxBytes(assetType) {
  return assetType === "banner"
    ? sbwOrganizerEditorAssetConfig.bannerMaxBytes
    : sbwOrganizerEditorAssetConfig.logoMaxBytes;
}

function sbwOrganizerEditorFormatBytes(bytes) {
  const safeBytes = Number(bytes || 0);
  if (safeBytes >= 1024 * 1024) {
    return `${(safeBytes / (1024 * 1024)).toFixed(1).replace(".0", "")} MB`;
  }

  return `${Math.max(1, Math.round(safeBytes / 1024))} KB`;
}

function sbwOrganizerEditorGetFileExtension(file) {
  const byName = String(file?.name || "").split(".").pop().toLowerCase();

  if (["png", "jpg", "jpeg", "webp"].includes(byName)) {
    return byName === "jpeg" ? "jpg" : byName;
  }

  if (file?.type === "image/png") return "png";
  if (file?.type === "image/webp") return "webp";

  return "jpg";
}

function sbwOrganizerEditorGetOrganizerAssets(organizer = sbwOrganizerEditorCurrent) {
  const metadata = sbwOrganizerEditorAsObject(organizer?.metadata);
  const assets =
    organizer?.organizerAssets ||
    metadata.organizerAssets ||
    metadata.organizer_assets ||
    metadata.assetFrames ||
    {};

  return sbwOrganizerEditorAsObject(assets);
}

function sbwOrganizerEditorGetAssetFrame(organizer, assetType) {
  const assets = sbwOrganizerEditorGetOrganizerAssets(organizer);
  const raw = sbwOrganizerEditorAsObject(
    assets[assetType] ||
    assets[assetType === "logo" ? "avatar" : assetType] ||
    {}
  );
  const nestedFrame = sbwOrganizerEditorAsObject(raw.frame || raw.framing || raw.crop || raw.position);
  const source = Object.keys(nestedFrame).length ? { ...raw, ...nestedFrame } : raw;

  const defaultPositionY = assetType === "banner" ? 46 : 50;

  return {
    positionX: sbwOrganizerEditorClampNumber(source.positionX ?? source.x ?? source.objectPositionX, 0, 100, 50),
    positionY: sbwOrganizerEditorClampNumber(source.positionY ?? source.y ?? source.objectPositionY, 0, 100, defaultPositionY),
    zoom: sbwOrganizerEditorClampNumber(source.zoom ?? source.scale ?? source.size, 100, assetType === "banner" ? 180 : 160, 100)
  };
}

function sbwOrganizerEditorGetAssetFrameStyle(organizer, assetType) {
  const frame = sbwOrganizerEditorGetAssetFrame(organizer, assetType);

  if (assetType === "banner") {
    const scale = Math.max(1, frame.zoom / 100).toFixed(2);
    return [
      `--org-editor-banner-x:${frame.positionX}%`,
      `--org-editor-banner-y:${frame.positionY}%`,
      `--org-editor-banner-scale:${scale}`
    ].join("; ");
  }

  return [
    `--org-editor-logo-x:${frame.positionX}%`,
    `--org-editor-logo-y:${frame.positionY}%`,
    `--org-editor-logo-scale:${Math.max(1, frame.zoom / 100).toFixed(2)}`
  ].join("; ");
}

function sbwOrganizerEditorGetAssetFrameForm(assetType) {
  const controls = document.querySelector(`[data-organizer-asset-frame-group="${assetType}"]`);

  if (!controls) {
    return sbwOrganizerEditorGetAssetFrame(sbwOrganizerEditorCurrent, assetType);
  }

  const defaultPositionY = assetType === "banner" ? 46 : 50;

  return {
    positionX: sbwOrganizerEditorClampNumber(controls.querySelector(`[data-organizer-asset-frame="positionX"]`)?.value, 0, 100, 50),
    positionY: sbwOrganizerEditorClampNumber(controls.querySelector(`[data-organizer-asset-frame="positionY"]`)?.value, 0, 100, defaultPositionY),
    zoom: sbwOrganizerEditorClampNumber(controls.querySelector(`[data-organizer-asset-frame="zoom"]`)?.value, 100, assetType === "banner" ? 180 : 160, 100)
  };
}

function sbwOrganizerEditorSetAssetFrameForm(assetType, frame) {
  const controls = document.querySelector(`[data-organizer-asset-frame-group="${assetType}"]`);
  if (!controls) return;

  const safeFrame = {
    positionX: sbwOrganizerEditorClampNumber(frame?.positionX, 0, 100, 50),
    positionY: sbwOrganizerEditorClampNumber(frame?.positionY, 0, 100, 50),
    zoom: sbwOrganizerEditorClampNumber(frame?.zoom, 100, assetType === "banner" ? 180 : 160, 100)
  };

  const xInput = controls.querySelector(`[data-organizer-asset-frame="positionX"]`);
  const yInput = controls.querySelector(`[data-organizer-asset-frame="positionY"]`);
  const zoomInput = controls.querySelector(`[data-organizer-asset-frame="zoom"]`);

  if (xInput) xInput.value = String(Math.round(safeFrame.positionX));
  if (yInput) yInput.value = String(Math.round(safeFrame.positionY));
  if (zoomInput) zoomInput.value = String(Math.round(safeFrame.zoom));

  sbwOrganizerEditorUpdateAssetFrameOutputs(assetType, safeFrame);
}

function sbwOrganizerEditorUpdateAssetFrameOutputs(assetType, frame) {
  const controls = document.querySelector(`[data-organizer-asset-frame-group="${assetType}"]`);
  if (!controls) return;

  const zoomOutput = controls.querySelector(`[data-organizer-asset-frame-output="zoom"]`);
  const xOutput = controls.querySelector(`[data-organizer-asset-frame-output="positionX"]`);
  const yOutput = controls.querySelector(`[data-organizer-asset-frame-output="positionY"]`);

  if (zoomOutput) zoomOutput.textContent = `${Math.round(frame.zoom)}%`;
  if (xOutput) xOutput.textContent = `${Math.round(frame.positionX)}%`;
  if (yOutput) yOutput.textContent = `${Math.round(frame.positionY)}%`;
}

function sbwOrganizerEditorSetAssetFeedback(assetType, message, status) {
  document.querySelectorAll(`[data-organizer-asset-feedback="${assetType}"], [data-organizer-asset-frame-feedback="${assetType}"]`).forEach((feedback) => {
    feedback.textContent = message || "";
    feedback.classList.remove("is-error", "is-success", "is-loading");
    if (status) feedback.classList.add(`is-${status}`);
  });
}

function sbwOrganizerEditorSetAssetUploading(assetType, isUploading) {
  document.querySelectorAll(`[data-organizer-asset-input="${assetType}"]`).forEach((input) => {
    input.disabled = Boolean(isUploading);
  });

  document.querySelectorAll(`[data-organizer-asset-trigger="${assetType}"]`).forEach((label) => {
    label.classList.toggle("is-uploading", Boolean(isUploading));
    label.setAttribute("aria-busy", isUploading ? "true" : "false");
  });
}

function sbwOrganizerEditorValidateAssetFile(file, assetType) {
  if (!file) {
    return `Selecione uma imagem para alterar o ${sbwOrganizerEditorGetAssetLabel(assetType)}.`;
  }

  if (!sbwOrganizerEditorAssetConfig.allowedTypes.includes(file.type)) {
    return "Formato inválido. Use PNG, JPG ou WebP.";
  }

  const maxBytes = sbwOrganizerEditorGetAssetMaxBytes(assetType);
  if (file.size > maxBytes) {
    return `Arquivo muito grande. O limite para ${sbwOrganizerEditorGetAssetLabel(assetType)} é ${sbwOrganizerEditorFormatBytes(maxBytes)}.`;
  }

  return "";
}

function sbwOrganizerEditorGetSafeAssetOrganizerKey() {
  const raw =
    sbwOrganizerEditorCurrent?.slug ||
    sbwOrganizerEditorCurrent?.id ||
    sbwOrganizerEditorSlug ||
    sbwOrganizerEditorGetField("organizerName")?.value ||
    "organizer";

  return String(raw || "organizer")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80) || "organizer";
}

function sbwOrganizerEditorBuildAssetPath(file, assetType) {
  const organizerKey = sbwOrganizerEditorGetSafeAssetOrganizerKey();
  const extension = sbwOrganizerEditorGetFileExtension(file);
  const randomSuffix = Math.random().toString(36).slice(2, 8);
  return `organizers/${organizerKey}/${assetType}/${assetType}-${Date.now()}-${randomSuffix}.${extension}`;
}

function sbwOrganizerEditorGetSupabaseStorageClient() {
  return window.SBWSupabase?.client?.storage || null;
}

async function sbwOrganizerEditorUploadAssetToSupabase(file, assetType) {
  const storageClient = sbwOrganizerEditorGetSupabaseStorageClient();

  if (!storageClient) {
    throw new Error("Supabase Storage indisponível nesta sessão.");
  }

  const path = sbwOrganizerEditorBuildAssetPath(file, assetType);
  const bucket = storageClient.from(sbwOrganizerEditorAssetConfig.bucket);
  const uploadResult = await bucket.upload(path, file, {
    cacheControl: "3600",
    contentType: file.type,
    upsert: false
  });

  if (uploadResult.error) {
    throw uploadResult.error;
  }

  const publicUrlResult = bucket.getPublicUrl(path);
  const publicUrl = publicUrlResult?.data?.publicUrl || "";

  if (!publicUrl) {
    throw new Error("Upload concluído, mas não foi possível gerar a URL pública.");
  }

  return publicUrl;
}

function sbwOrganizerEditorGetAssetUrl(assetType) {
  const fieldId = assetType === "banner" ? "organizerBannerUrl" : "organizerLogoUrl";
  return sbwOrganizerEditorGetField(fieldId)?.value.trim() || "";
}

function sbwOrganizerEditorSetAssetUrl(assetType, value) {
  const url = String(value || "").trim();
  const hiddenId = assetType === "banner" ? "organizerBannerUrl" : "organizerLogoUrl";
  const manualId = assetType === "banner" ? "organizerBannerUrlManual" : "organizerLogoUrlManual";
  const hidden = sbwOrganizerEditorGetField(hiddenId);
  const manual = sbwOrganizerEditorGetField(manualId);

  if (hidden) hidden.value = url;
  if (manual) manual.value = url;
}

function sbwOrganizerEditorBuildAssetMetadataPatch(assetType, extra = {}) {
  const frame = sbwOrganizerEditorGetAssetFrameForm(assetType);
  return {
    [assetType]: {
      ...frame,
      ...extra,
      updatedAt: new Date().toISOString()
    }
  };
}

async function sbwOrganizerEditorSaveMediaPatch(payload) {
  const client = window.SBWSupabase?.client;

  if (!client?.rpc) {
    throw new Error("Sessão Supabase indisponível para salvar mídia do organizador.");
  }

  const organizerKey = sbwOrganizerEditorCurrent?.slug || sbwOrganizerEditorSlug || sbwOrganizerEditorCurrent?.id || "";

  if (!organizerKey || sbwOrganizerEditorIsNew) {
    throw new Error("Salve a organização uma vez antes de enviar ou enquadrar imagens.");
  }

  const result = await client.rpc("sbw_update_tournament_organizer_media", {
    p_slug: organizerKey,
    p_payload: payload
  });

  if (result.error) {
    throw result.error;
  }

  const organizer = result.data?.organizer || result.data?.data || result.data || null;

  if (organizer) {
    const normalized = typeof sbwNormalizeSupabaseTournamentOrganizer === "function"
      ? sbwNormalizeSupabaseTournamentOrganizer(organizer)
      : organizer;

    sbwOrganizerEditorCurrent = {
      ...(sbwOrganizerEditorCurrent || {}),
      ...(normalized || {})
    };
    sbwOrganizerEditorSlug = sbwOrganizerEditorCurrent.slug || sbwOrganizerEditorSlug;
  }

  return result.data;
}

async function sbwOrganizerEditorSaveAssetUrl(assetType, publicUrl) {
  const urlKey = assetType === "banner" ? "bannerUrl" : "logoUrl";
  const framePatch = sbwOrganizerEditorBuildAssetMetadataPatch(assetType, { url: publicUrl });

  try {
    await sbwOrganizerEditorSaveMediaPatch({
      [urlKey]: publicUrl,
      organizerAssets: framePatch
    });
  } catch (error) {
    console.warn("[SBW Organizadores] RPC dedicada de mídia falhou, tentando salvar pelo formulário principal:", error);

    if (typeof sbwUpdateTournamentOrganizerProfileAsync !== "function") {
      throw error;
    }

    const fallbackResult = await sbwUpdateTournamentOrganizerProfileAsync(
      sbwOrganizerEditorSlug || sbwOrganizerEditorCurrent?.slug,
      sbwOrganizerEditorReadForm()
    );

    if (fallbackResult?.organizer) {
      sbwOrganizerEditorCurrent = fallbackResult.organizer;
      sbwOrganizerEditorSlug = fallbackResult.organizer.slug || sbwOrganizerEditorSlug;
    }
  }
}

async function sbwOrganizerEditorSaveAssetFrame(assetType) {
  const framePatch = sbwOrganizerEditorBuildAssetMetadataPatch(assetType, {
    url: sbwOrganizerEditorGetAssetUrl(assetType)
  });

  try {
    sbwOrganizerEditorSetAssetFeedback(assetType, "Salvando enquadramento...", "loading");
    await sbwOrganizerEditorSaveMediaPatch({ organizerAssets: framePatch });
    sbwOrganizerEditorSetAssetFrameEditMode(assetType, false);
    sbwOrganizerEditorSetAssetFeedback(assetType, "Enquadramento salvo.", "success");
  } catch (error) {
    console.error("[SBW Organizadores] Falha ao salvar enquadramento:", error);
    sbwOrganizerEditorSetAssetFeedback(assetType, error?.message || "Não foi possível salvar o enquadramento.", "error");
  }
}

function sbwOrganizerEditorApplyAssetFramePreview(assetType) {
  const frame = sbwOrganizerEditorGetAssetFrameForm(assetType);
  sbwOrganizerEditorUpdateAssetFrameOutputs(assetType, frame);

  if (assetType === "banner") {
    document.querySelectorAll(`[data-organizer-asset-preview="banner"], .organizer-admin-preview-cover`).forEach((element) => {
      element.style.setProperty("--org-editor-banner-x", `${frame.positionX}%`);
      element.style.setProperty("--org-editor-banner-y", `${frame.positionY}%`);
      element.style.setProperty("--org-editor-banner-scale", Math.max(1, frame.zoom / 100).toFixed(2));
    });
    return;
  }

  document.querySelectorAll(`[data-organizer-asset-preview="logo"], .organizer-admin-preview-logo`).forEach((element) => {
    element.style.setProperty("--org-editor-logo-x", `${frame.positionX}%`);
    element.style.setProperty("--org-editor-logo-y", `${frame.positionY}%`);
    element.style.setProperty("--org-editor-logo-scale", Math.max(1, frame.zoom / 100).toFixed(2));
  });
}

function sbwOrganizerEditorRenderProfileMediaPreview() {
  const bannerUrl = sbwOrganizerEditorGetAssetUrl("banner");
  const logoUrl = sbwOrganizerEditorGetAssetUrl("logo");
  const name = sbwOrganizerEditorGetField("organizerName")?.value.trim() || "Organizador";
  const initials = sbwOrganizerEditorGetInitials({
    name,
    tag: sbwOrganizerEditorGetField("organizerTag")?.value.trim()
  });

  document.querySelectorAll(`[data-organizer-asset-preview="banner"]`).forEach((element) => {
    element.classList.toggle("has-image", Boolean(bannerUrl));
    element.innerHTML = bannerUrl
      ? `<img src="${sbwOrganizerEditorEscape(bannerUrl)}" alt="Prévia do banner">`
      : `<span>Prévia do banner</span>`;
    element.setAttribute("style", sbwOrganizerEditorGetAssetFrameStyle(sbwOrganizerEditorCurrent, "banner"));
  });

  document.querySelectorAll(`[data-organizer-asset-preview="logo"]`).forEach((element) => {
    element.classList.toggle("has-image", Boolean(logoUrl));
    element.innerHTML = logoUrl
      ? `<img src="${sbwOrganizerEditorEscape(logoUrl)}" alt="Logo ${sbwOrganizerEditorEscape(name)}">`
      : `<span>${sbwOrganizerEditorEscape(initials)}</span>`;
    element.setAttribute("style", sbwOrganizerEditorGetAssetFrameStyle(sbwOrganizerEditorCurrent, "logo"));
  });

  sbwOrganizerEditorApplyAssetFramePreview("banner");
  sbwOrganizerEditorApplyAssetFramePreview("logo");
}

function sbwOrganizerEditorPreviewSelectedAsset(file, assetType) {
  if (!file) return;

  const url = URL.createObjectURL(file);
  sbwOrganizerEditorSetAssetUrl(assetType, url);

  if (assetType === "banner") {
    document.querySelectorAll(`[data-organizer-asset-preview="banner"]`).forEach((element) => {
      element.classList.add("has-image");
      element.innerHTML = `<img src="${url}" alt="Prévia do banner">`;
    });
  } else {
    document.querySelectorAll(`[data-organizer-asset-preview="logo"]`).forEach((element) => {
      element.classList.add("has-image");
      element.innerHTML = `<img src="${url}" alt="Prévia da logo">`;
    });
  }

  sbwOrganizerEditorApplyAssetFramePreview(assetType);
}

function sbwOrganizerEditorIsAssetFrameEditActive(assetType) {
  const controls = document.querySelector(`[data-organizer-asset-frame-group="${assetType}"]`);
  return controls?.dataset.organizerAssetFrameEditing === "true";
}

function sbwOrganizerEditorSetAssetFrameEditMode(assetType, isActive) {
  const active = Boolean(isActive);
  const label = assetType === "banner" ? "banner" : "logo";
  const controls = document.querySelector(`[data-organizer-asset-frame-group="${assetType}"]`);

  if (controls) {
    controls.dataset.organizerAssetFrameEditing = active ? "true" : "false";
    controls.classList.toggle("is-frame-editing", active);

    controls.querySelectorAll("[data-organizer-asset-zoom], [data-organizer-asset-frame-save]").forEach((control) => {
      control.disabled = !active;
      control.setAttribute("aria-disabled", active ? "false" : "true");
    });
  }

  document.querySelectorAll(`[data-organizer-asset-frame-toggle="${assetType}"]`).forEach((button) => {
    button.setAttribute("aria-pressed", active ? "true" : "false");
    button.textContent = active ? `Bloquear enquadramento do ${label}` : `Editar enquadramento do ${label}`;
    button.classList.toggle("is-active", active);
  });

  document.querySelectorAll(`[data-organizer-asset-drag-target="${assetType}"]`).forEach((element) => {
    element.classList.toggle("is-frame-editing", active);
  });
}

function sbwOrganizerEditorNudgeAssetZoom(assetType, direction) {
  if (!sbwOrganizerEditorIsAssetFrameEditActive(assetType)) {
    sbwOrganizerEditorSetAssetFeedback(assetType, "Ative a edição de enquadramento antes de alterar o zoom.", "loading");
    return;
  }

  const frame = sbwOrganizerEditorGetAssetFrameForm(assetType);
  const step = assetType === "banner" ? 5 : 4;
  const next = {
    ...frame,
    zoom: sbwOrganizerEditorClampNumber(frame.zoom + direction * step, 100, assetType === "banner" ? 180 : 160, 100)
  };

  sbwOrganizerEditorSetAssetFrameForm(assetType, next);
  sbwOrganizerEditorApplyAssetFramePreview(assetType);
  sbwOrganizerEditorSetAssetFeedback(assetType, "Ajuste alterado. Clique em Salvar enquadramento para aplicar.", "loading");
}

function sbwOrganizerEditorBindAssetDragTarget(element) {
  if (!element || element.dataset.organizerAssetDragReady === "true") return;

  const assetType = element.dataset.organizerAssetDragTarget;
  if (!assetType) return;

  element.dataset.organizerAssetDragReady = "true";
  element.setAttribute("role", "button");
  element.setAttribute("tabindex", "0");

  let drag = null;

  const finishDrag = (event) => {
    if (!drag) return;
    const pointerId = drag.pointerId;
    drag = null;
    element.classList.remove("is-dragging");
    try {
      element.releasePointerCapture?.(event?.pointerId || pointerId);
    } catch (error) {}
  };

  element.addEventListener("pointerdown", (event) => {
    if (event.button !== undefined && event.button !== 0) return;
    if (!sbwOrganizerEditorIsAssetFrameEditActive(assetType)) return;

    const rect = element.getBoundingClientRect();
    const frame = sbwOrganizerEditorGetAssetFrameForm(assetType);

    drag = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      frame,
      sensitivity: {
        x: assetType === "banner" ? 72 / Math.max(1, rect.width) : 90 / Math.max(1, rect.width),
        y: assetType === "banner" ? 175 / Math.max(1, rect.height) : 90 / Math.max(1, rect.height)
      }
    };

    element.classList.add("is-dragging");
    element.setPointerCapture?.(event.pointerId);
    event.preventDefault();
  });

  element.addEventListener("pointermove", (event) => {
    if (!drag || drag.pointerId !== event.pointerId) return;

    const next = {
      ...drag.frame,
      positionX: sbwOrganizerEditorClampNumber(drag.frame.positionX - (event.clientX - drag.startX) * drag.sensitivity.x, 0, 100, 50),
      positionY: sbwOrganizerEditorClampNumber(drag.frame.positionY - (event.clientY - drag.startY) * drag.sensitivity.y, 0, 100, 50)
    };

    sbwOrganizerEditorSetAssetFrameForm(assetType, next);
    sbwOrganizerEditorApplyAssetFramePreview(assetType);
    sbwOrganizerEditorSetAssetFeedback(assetType, "Ajuste alterado. Clique em Salvar enquadramento para aplicar.", "loading");
    event.preventDefault();
  });

  element.addEventListener("pointerup", finishDrag);
  element.addEventListener("pointercancel", finishDrag);
  element.addEventListener("lostpointercapture", finishDrag);
}

function sbwOrganizerEditorBindAssetControls() {
  document.querySelectorAll("[data-organizer-asset-input]").forEach((input) => {
    input.addEventListener("change", async () => {
      const assetType = input.dataset.organizerAssetInput;
      const file = input.files?.[0] || null;
      const validationError = sbwOrganizerEditorValidateAssetFile(file, assetType);

      if (validationError) {
        sbwOrganizerEditorSetAssetFeedback(assetType, validationError, "error");
        input.value = "";
        return;
      }

      if (sbwOrganizerEditorIsNew || !sbwOrganizerEditorSlug) {
        sbwOrganizerEditorSetAssetFeedback(assetType, "Salve a organização antes de enviar imagens.", "error");
        input.value = "";
        return;
      }

      sbwOrganizerEditorSetAssetUploading(assetType, true);
      sbwOrganizerEditorSetAssetFeedback(assetType, `Enviando ${sbwOrganizerEditorGetAssetLabel(assetType)}...`, "loading");
      sbwOrganizerEditorPreviewSelectedAsset(file, assetType);

      try {
        const publicUrl = await sbwOrganizerEditorUploadAssetToSupabase(file, assetType);
        sbwOrganizerEditorSetAssetUrl(assetType, publicUrl);
        sbwOrganizerEditorSetAssetFeedback(assetType, "Upload concluído. Salvando no organizador...", "loading");
        await sbwOrganizerEditorSaveAssetUrl(assetType, publicUrl);
        sbwOrganizerEditorSetAssetFrameForm(assetType, sbwOrganizerEditorGetAssetFrame(sbwOrganizerEditorCurrent, assetType));
        sbwOrganizerEditorRenderProfileMediaPreview();
        sbwOrganizerEditorRenderPreview();
        sbwOrganizerEditorSetAssetFeedback(assetType, `${sbwOrganizerEditorGetAssetLabel(assetType).replace(/^./, (letter) => letter.toUpperCase())} atualizado.`, "success");
      } catch (error) {
        console.error(`[SBW Organizadores] Falha ao enviar ${assetType}:`, error);
        sbwOrganizerEditorSetAssetFeedback(assetType, error?.message || "Não foi possível enviar a imagem.", "error");
      } finally {
        sbwOrganizerEditorSetAssetUploading(assetType, false);
        input.value = "";
      }
    });
  });

  document.querySelectorAll("[data-organizer-asset-url-input]").forEach((input) => {
    input.addEventListener("input", () => {
      const assetType = input.dataset.organizerAssetUrlInput;
      sbwOrganizerEditorSetAssetUrl(assetType, input.value);
      sbwOrganizerEditorRenderProfileMediaPreview();
      sbwOrganizerEditorRenderPreview();
    });

    input.addEventListener("change", () => {
      const assetType = input.dataset.organizerAssetUrlInput;
      sbwOrganizerEditorSetAssetUrl(assetType, input.value);
      sbwOrganizerEditorRenderProfileMediaPreview();
      sbwOrganizerEditorRenderPreview();
    });
  });

  document.querySelectorAll("[data-organizer-asset-zoom]").forEach((button) => {
    button.addEventListener("click", () => {
      const direction = button.dataset.organizerAssetZoom === "in" ? 1 : -1;
      sbwOrganizerEditorNudgeAssetZoom(button.dataset.organizerAssetType, direction);
    });
  });

  document.querySelectorAll("[data-organizer-asset-frame-save]").forEach((button) => {
    button.addEventListener("click", () => {
      sbwOrganizerEditorSaveAssetFrame(button.dataset.organizerAssetFrameSave);
    });
  });

  document.querySelectorAll("[data-organizer-asset-frame-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const assetType = button.dataset.organizerAssetFrameToggle;
      sbwOrganizerEditorSetAssetFrameEditMode(assetType, !sbwOrganizerEditorIsAssetFrameEditActive(assetType));
    });
  });

  document.querySelectorAll("[data-organizer-asset-drag-target]").forEach((element) => {
    sbwOrganizerEditorBindAssetDragTarget(element);
  });

  ["banner", "logo"].forEach((assetType) => {
    sbwOrganizerEditorSetAssetFrameEditMode(assetType, false);
  });
}


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
    },
    organizerAssets: {
      ...sbwOrganizerEditorGetOrganizerAssets(sbwOrganizerEditorCurrent),
      banner: {
        ...sbwOrganizerEditorGetAssetFrameForm("banner"),
        url: sbwOrganizerEditorGetAssetUrl("banner")
      },
      logo: {
        ...sbwOrganizerEditorGetAssetFrameForm("logo"),
        url: sbwOrganizerEditorGetAssetUrl("logo")
      }
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
  sbwOrganizerEditorSetAssetUrl("banner", organizer?.bannerUrl || "");
  sbwOrganizerEditorSetAssetUrl("logo", organizer?.logoUrl || "");
  sbwOrganizerEditorSetAssetFrameForm("banner", sbwOrganizerEditorGetAssetFrame(organizer, "banner"));
  sbwOrganizerEditorSetAssetFrameForm("logo", sbwOrganizerEditorGetAssetFrame(organizer, "logo"));
  sbwOrganizerEditorRenderProfileMediaPreview();
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
    ? `<img src="${sbwOrganizerEditorEscape(formData.bannerUrl)}" alt="" aria-hidden="true">`
    : "";
  const bannerFrameStyle = sbwOrganizerEditorGetAssetFrameStyle(previewOrganizer, "banner");
  const logoFrameStyle = sbwOrganizerEditorGetAssetFrameStyle(previewOrganizer, "logo");
  const activeLinks = Object.entries(formData.links || {}).filter(([, value]) => Boolean(value));

  sbwOrganizerPreview.setAttribute("style", themeStyle);
  sbwOrganizerPreview.innerHTML = `
    <div class="organizer-admin-preview-cover" ${sbwOrganizerEditorStyleAttribute(bannerFrameStyle)}>
      ${bannerHTML}
    </div>

    <div class="organizer-admin-preview-body">
      <div class="organizer-admin-preview-head">
        <div class="organizer-admin-preview-logo" ${sbwOrganizerEditorStyleAttribute(logoFrameStyle)}>
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
    sbwOrganizerEditorBindAssetControls();
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
  sbwOrganizerEditorBindAssetControls();
  sbwOrganizerEditorBindSave();
  sbwOrganizerEditorBindReset();
  sbwOrganizerEditorRenderPreview();
}

sbwOrganizerEditorLoad();
