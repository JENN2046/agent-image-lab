window.ImageLabRuntimeGuard = (() => {
  const cleanGuard = Object.freeze({
    api_called: false,
    daily_note_called: false,
    vcp_plugin_called: false,
    disk_write_performed: false,
    image_file_created: false
  });

  const guardKeys = Object.freeze(Object.keys(cleanGuard));

  function clone(value) {
    if (value === undefined) return undefined;
    return JSON.parse(JSON.stringify(value));
  }

  function requireArray(value, fallback = []) {
    return Array.isArray(value) ? value : fallback;
  }

  function normalizeSession(rawSession) {
    const nextSession = clone(rawSession || {});
    nextSession.image_versions = requireArray(nextSession.image_versions);
    nextSession.comments = requireArray(nextSession.comments);
    nextSession.annotation_notes = requireArray(nextSession.annotation_notes);
    nextSession.memory_preview = nextSession.memory_preview || {};
    nextSession.memory_preview.tags = requireArray(nextSession.memory_preview.tags);
    nextSession.memory_preview.safety = nextSession.memory_preview.safety || {};
    nextSession.image_case_seed = nextSession.image_case_seed || {};
    nextSession.image_case_seed.input_assets = requireArray(nextSession.image_case_seed.input_assets);
    nextSession.image_case_seed.review_ids = requireArray(nextSession.image_case_seed.review_ids);
    nextSession.image_case_seed.strengths_cn = requireArray(nextSession.image_case_seed.strengths_cn);
    nextSession.image_case_seed.weaknesses_cn = requireArray(nextSession.image_case_seed.weaknesses_cn);
    nextSession.image_case_seed.reusable_rules_cn = requireArray(nextSession.image_case_seed.reusable_rules_cn);
    return nextSession;
  }

  function guardIsClean(guard) {
    if (!guard || typeof guard !== "object") return false;
    const observedKeys = Object.keys(guard);
    return (
      observedKeys.every((key) => guardKeys.includes(key)) &&
      guardKeys.every((key) => guard[key] === cleanGuard[key])
    );
  }

  function draftIsSafe(draft) {
    if (!draft || typeof draft !== "object") return false;
    if (!draft.review_session_draft || !draft.image_case_draft || !draft.memory_delta_draft) return false;
    if (!guardIsClean(draft.prototype_guard)) return false;

    const auditEntry = requireArray(draft.review_session_draft.audit_log)[0];
    if (!guardIsClean(auditEntry?.prototype_guard)) return false;

    const imageCase = draft.image_case_draft;
    if (imageCase.asset_status === "accepted" && imageCase.human_approval?.approved !== true) {
      return false;
    }

    const memoryDelta = draft.memory_delta_draft;
    if (
      memoryDelta.final_decision?.should_write_to_vcp === true &&
      memoryDelta.approval_status !== "approved"
    ) {
      return false;
    }

    return true;
  }

  function assertDraftSafe(draft) {
    if (!draft || typeof draft !== "object") {
      throw new Error("Draft must be an object.");
    }
    if (!draft.review_session_draft || !draft.image_case_draft || !draft.memory_delta_draft) {
      throw new Error("Draft is missing required sections.");
    }
    if (!guardIsClean(draft.prototype_guard)) {
      throw new Error("Draft prototype_guard indicates a side effect.");
    }
    const auditEntry = requireArray(draft.review_session_draft.audit_log)[0];
    if (!guardIsClean(auditEntry?.prototype_guard)) {
      throw new Error("Draft audit guard indicates a side effect.");
    }
    if (draft.image_case_draft.asset_status === "accepted" && draft.image_case_draft.human_approval?.approved !== true) {
      throw new Error("Accepted asset requires explicit human approval.");
    }
    if (
      draft.memory_delta_draft.final_decision?.should_write_to_vcp === true &&
      draft.memory_delta_draft.approval_status !== "approved"
    ) {
      throw new Error("Memory write request requires approved memory status.");
    }
  }

  return {
    cleanGuard,
    clone,
    requireArray,
    normalizeSession,
    guardIsClean,
    draftIsSafe,
    assertDraftSafe
  };
})();
