(function attachRuntimeV1RealEntryViewer(root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.RUNTIME_V1_REAL_ENTRY_VIEWER = factory();
  }
})(typeof globalThis !== "undefined" ? globalThis : window, function createRuntimeV1RealEntryViewer() {
  "use strict";

  const requiredDisplayFields = [
    "run_id",
    "prompt_package_ref",
    "provider_route",
    "provider_mode",
    "model_required",
    "model_sent",
    "image_dimensions",
    "image_sha256",
    "audit_receipt_ref",
    "artifact_record_ref"
  ];

  const forbiddenTrueGuardFields = [
    "image_binary_read_performed",
    "fetch_performed",
    "file_write_performed",
    "approval_write_performed",
    "archive_write_performed",
    "accepted_samples_write_performed",
    "production_candidate_created",
    "provider_contact_performed",
    "plugin_call_performed",
    "api_call_performed",
    "image_generation_performed",
    "DailyNote_write_performed",
    "VCP_memory_write_performed",
    "secret_value_read_performed",
    "push_tag_release_deploy_performed"
  ];

  function isObject(value) {
    return value && typeof value === "object" && !Array.isArray(value);
  }

  function requireString(value, label, errors) {
    if (typeof value !== "string" || value.trim() === "") {
      errors.push(`${label} must be a non-empty string`);
    }
  }

  function validateRuntimeV1RealEntrySession(session) {
    const errors = [];
    if (!isObject(session)) {
      return { valid: false, errors: ["session must be an object"] };
    }

    if (session.schema !== "runtime_v1_readonly_review_session.v1") errors.push("schema mismatch");
    if (session.session_mode !== "runtime_v1_real_entry_readonly") errors.push("session_mode mismatch");
    if (session.status !== "readonly_real_session") errors.push("status mismatch");
    if (session.current_review_status !== "pending_human_review") errors.push("current_review_status mismatch");

    ["session_id", "case_id", "task_id", "adapter_id", "adapter_contract"].forEach((field) => {
      requireString(session[field], field, errors);
    });

    if (!isObject(session.display_fields)) {
      errors.push("display_fields must be an object");
    } else {
      requiredDisplayFields.forEach((field) => {
        requireString(session.display_fields[field], `display_fields.${field}`, errors);
      });
    }

    if (!Array.isArray(session.image_versions) || session.image_versions.length !== 1) {
      errors.push("image_versions must contain exactly one metadata row");
    } else {
      const version = session.image_versions[0];
      ["version_id", "label", "asset_ref", "mime_type", "dimensions", "sha256"].forEach((field) => {
        requireString(version[field], `image_versions[0].${field}`, errors);
      });
      if (version.image_binary_loaded !== false) {
        errors.push("image_versions[0].image_binary_loaded must be false");
      }
    }

    if (!isObject(session.audit_summary)) {
      errors.push("audit_summary must be an object");
    } else if (!isObject(session.audit_summary.calls_used)) {
      errors.push("audit_summary.calls_used must be an object");
    }

    if (!Array.isArray(session.forbidden_actions)) {
      errors.push("forbidden_actions must be an array");
    } else {
      ["read_image_binary", "call_provider", "write_production_candidate", "write_memory"].forEach((action) => {
        if (!session.forbidden_actions.includes(action)) errors.push(`forbidden action missing: ${action}`);
      });
    }

    if (!isObject(session.guard)) {
      errors.push("guard must be an object");
    } else {
      if (session.guard.read_only !== true) errors.push("guard.read_only must be true");
      if (session.guard.metadata_only !== true) errors.push("guard.metadata_only must be true");
      forbiddenTrueGuardFields.forEach((field) => {
        if (session.guard[field] === true) errors.push(`guard.${field} must be false`);
      });
    }

    return { valid: errors.length === 0, errors };
  }

  function createRuntimeV1RealEntryViewModel(session) {
    const validation = validateRuntimeV1RealEntrySession(session);
    if (!validation.valid) {
      return {
        valid: false,
        title: "Blocked runtime v1 real-entry session",
        status: "blocked_invalid_session",
        errors: validation.errors,
        fields: []
      };
    }

    const display = session.display_fields;
    const version = session.image_versions[0];
    return {
      valid: true,
      title: "Runtime v1 readonly real-entry session",
      status: session.status,
      errors: [],
      fields: [
        ["run id", display.run_id],
        ["task id", session.task_id],
        ["prompt package", display.prompt_package_ref],
        ["provider route", display.provider_route],
        ["provider mode", display.provider_mode],
        ["model required", display.model_required],
        ["model sent", display.model_sent],
        ["dimensions", display.image_dimensions],
        ["sha256", display.image_sha256],
        ["artifact ref", display.artifact_record_ref],
        ["audit ref", display.audit_receipt_ref],
        ["asset metadata ref", version.asset_ref],
        ["review status", session.current_review_status],
        ["calls used", `provider=${session.audit_summary.calls_used.provider}; plugin=${session.audit_summary.calls_used.plugin}; api=${session.audit_summary.calls_used.api}`]
      ],
      guard: {
        read_only: session.guard.read_only,
        metadata_only: session.guard.metadata_only,
        image_binary_read_performed: session.guard.image_binary_read_performed,
        fetch_performed: session.guard.fetch_performed,
        file_write_performed: session.guard.file_write_performed,
        provider_contact_performed: session.guard.provider_contact_performed,
        production_candidate_created: session.guard.production_candidate_created,
        VCP_memory_write_performed: session.guard.VCP_memory_write_performed
      }
    };
  }

  function setText(doc, id, value) {
    const element = doc.getElementById(id);
    if (element) element.textContent = String(value);
  }

  function renderRuntimeV1RealEntrySession(session, doc) {
    const documentRef = doc || (typeof document !== "undefined" ? document : null);
    const viewModel = createRuntimeV1RealEntryViewModel(session);
    if (!documentRef) return viewModel;

    setText(documentRef, "runtimeV1RealEntryTitle", viewModel.title);
    setText(documentRef, "runtimeV1RealEntryStatus", viewModel.status);
    const fields = documentRef.getElementById("runtimeV1RealEntryFields");
    if (fields) {
      fields.innerHTML = viewModel.fields.map(([label, value]) => (
        `<div class="runtime-v1-field"><span>${label}</span><strong>${String(value)}</strong></div>`
      )).join("");
    }
    const guard = documentRef.getElementById("runtimeV1RealEntryGuard");
    if (guard) {
      guard.innerHTML = viewModel.valid
        ? Object.entries(viewModel.guard).map(([label, value]) => (
          `<span>${label}: <strong>${String(value)}</strong></span>`
        )).join("")
        : viewModel.errors.map((error) => `<span>${error}</span>`).join("");
    }
    return viewModel;
  }

  function initRuntimeV1RealEntryViewer() {
    const root = typeof window !== "undefined" ? window : {};
    return renderRuntimeV1RealEntrySession(root.RUNTIME_V1_REAL_ENTRY_SESSION);
  }

  if (typeof window !== "undefined") {
    window.addEventListener("DOMContentLoaded", initRuntimeV1RealEntryViewer);
  }

  return {
    validateRuntimeV1RealEntrySession,
    createRuntimeV1RealEntryViewModel,
    renderRuntimeV1RealEntrySession,
    initRuntimeV1RealEntryViewer
  };
});
