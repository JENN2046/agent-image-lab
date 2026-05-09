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
    nextSession.review_queue = requireArray(nextSession.review_queue);
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

  function guardsAreClean(values) {
    return values.every((guard) => guard === undefined || guardIsClean(guard));
  }

  function executionFlagsAreFalse(flags) {
    if (!flags || typeof flags !== "object") return false;
    return [
      "bridge_called",
      "plugin_called",
      "api_called",
      "daily_note_called",
      "vcp_memory_written",
      "image_created",
      "commit_performed",
      "tag_performed",
      "push_performed",
      "pr_created",
      "release_created"
    ].every((key) => flags[key] === false);
  }

  function inactiveAuthorizationCapsulesAreSafe(draft) {
    const packageDraft = draft.inactive_authorization_capsules_draft;
    if (!packageDraft || typeof packageDraft !== "object") return false;
    if (packageDraft.package_status !== "draft_only") return false;
    if (packageDraft.authorization_status !== "inactive_package") return false;
    if (packageDraft.side_effects_performed !== false) return false;
    if (!guardIsClean(packageDraft.no_execution_guard)) return false;
    const capsules = requireArray(packageDraft.capsules);
    if (capsules.length === 0 || packageDraft.capsule_count !== capsules.length) return false;
    for (const capsule of capsules) {
      if (capsule.authorization_status !== "inactive_package") return false;
      if (capsule.activation_required !== true) return false;
      if (!executionFlagsAreFalse(capsule.execution_flags)) return false;
      if (!guardIsClean(capsule.no_execution_guard)) return false;
      if (!capsule.rollback_plan_cn || !capsule.activation_rule_cn) return false;
      if (!Array.isArray(capsule.forbidden_actions_cn) || capsule.forbidden_actions_cn.length === 0) return false;
      if (!Array.isArray(capsule.sanitization_rules_cn) || capsule.sanitization_rules_cn.length === 0) return false;
      if (!capsule.max_call_counts || typeof capsule.max_call_counts !== "object") return false;
    }
    return true;
  }

  function runtimeReviewStateIsSafe(draft) {
    const runtimeState = draft.runtime_review_state_draft;
    if (!runtimeState || typeof runtimeState !== "object") return false;
    if (runtimeState.package_status !== "draft_only") return false;
    if (runtimeState.side_effects_performed !== false) return false;
    if (!guardIsClean(runtimeState.no_execution_guard)) return false;
    if (!Array.isArray(runtimeState.mismatch_items_cn)) return false;
    if (runtimeState.mismatch_items_cn.length !== 0) return false;
    const state = runtimeState.normalized_state || {};
    if (state.write_authorized === true && state.write_requested !== true) return false;
    if (state.write_authorized === true && state.write_performed === true) return false;
    if (state.human_override_performed === true && state.prompt_compliance_complete === true) return false;
    if (["candidate", "accepted_candidate", "accepted_by_human_override", "rejected", "blocked"].includes(state.asset_state_key) === false) {
      return false;
    }
    return true;
  }

  function localCommitScopePlanIsSafe(draft) {
    const plan = draft.local_commit_scope_plan_draft;
    if (!plan || typeof plan !== "object") return false;
    if (plan.package_status !== "draft_only") return false;
    if (plan.staged_changes_present !== false) return false;
    if (plan.commit_allowed !== false) return false;
    if (plan.tag_allowed !== false) return false;
    if (plan.push_allowed !== false) return false;
    if (plan.pr_allowed !== false) return false;
    if (plan.release_allowed !== false) return false;
    if (plan.side_effects_performed !== false) return false;
    if (!guardIsClean(plan.no_execution_guard)) return false;
    if (!Array.isArray(plan.scope_groups) || plan.scope_groups.length < 4) return false;
    if (!Array.isArray(plan.rollback_guidance_cn) || plan.rollback_guidance_cn.length === 0) return false;
    const combinedRollback = plan.rollback_guidance_cn.join("\n").toLowerCase();
    if (combinedRollback.includes("reset --hard") || combinedRollback.includes("git clean")) return false;
    return true;
  }

  function bridgeMockRoundtripCandidateIsSafe(draft) {
    const roundtrip = draft.bridge_mock_roundtrip_candidate_draft;
    if (!roundtrip || typeof roundtrip !== "object") return false;
    if (roundtrip.package_status !== "draft_only") return false;
    if (roundtrip.roundtrip_status !== "mock_roundtrip_candidate") return false;
    if (roundtrip.bridge_mode !== "project_local_mock") return false;
    if (roundtrip.source_fixture_policy !== "project_local_fixtures_only") return false;
    if (roundtrip.production_bridge_invocation_performed !== false) return false;
    if (roundtrip.real_cdp_called !== false) return false;
    if (roundtrip.submitDraft_called !== false) return false;
    if (roundtrip.side_effects_performed !== false) return false;
    if (roundtrip.plugin_called !== false) return false;
    if (roundtrip.api_called !== false) return false;
    if (roundtrip.daily_note_called !== false) return false;
    if (roundtrip.vcp_memory_written !== false) return false;
    if (roundtrip.image_created !== false) return false;
    if (!guardIsClean(roundtrip.no_execution_guard)) return false;
    const methods = requireArray(roundtrip.selected_methods);
    if (methods.length !== 2 || methods[0] !== "loadSession" || methods[1] !== "previewDraft") return false;
    const calls = roundtrip.bridge_calls_observed || {};
    if (calls.mock_only !== true) return false;
    if (calls.total !== 2) return false;
    if (calls.loadSession !== 1) return false;
    if (calls.previewDraft !== 1) return false;
    if (calls.cancel !== 0) return false;
    if (calls.submitDraft !== 0) return false;
    if (calls.production_submitDraft !== 0) return false;
    const adapterRef = roundtrip.adapter_handoff_ref || {};
    if (adapterRef.execution_blocked !== true || adapterRef.max_plugin_calls !== 0 || adapterRef.selected_plugin !== null) {
      return false;
    }
    const acknowledgements = requireArray(roundtrip.ack_summaries);
    if (acknowledgements.length !== 2) return false;
    return acknowledgements.every(
      (ack) =>
        ack &&
        ack.mock_only === true &&
        ack.side_effects_performed === false &&
        ack.plugin_called === false &&
        ack.api_called === false &&
        ack.daily_note_called === false &&
        ack.vcp_memory_written === false &&
        ack.image_created === false &&
        Array.isArray(ack.ack_keys) &&
        ack.ack_keys.length > 0
    );
  }

  function realBridgeAuthorizationPackageIsSafe(draft) {
    const packageDraft = draft.real_bridge_authorization_package_draft;
    if (!packageDraft || typeof packageDraft !== "object") return false;
    if (packageDraft.package_status !== "draft_only") return false;
    if (packageDraft.authorization_status !== "inactive_package") return false;
    if (packageDraft.activation_required !== true) return false;
    if (packageDraft.execution_authorized_by_this_record !== false) return false;
    if (packageDraft.production_bridge_invocation_performed !== false) return false;
    if (packageDraft.real_cdp_called !== false) return false;
    if (packageDraft.source_read_performed !== false) return false;
    if (packageDraft.submitDraft_allowed !== false) return false;
    if (packageDraft.submitDraft_called !== false) return false;
    if (packageDraft.side_effects_performed !== false) return false;
    if (packageDraft.plugin_called !== false) return false;
    if (packageDraft.api_called !== false) return false;
    if (packageDraft.daily_note_called !== false) return false;
    if (packageDraft.vcp_memory_written !== false) return false;
    if (packageDraft.image_created !== false) return false;
    if (!guardIsClean(packageDraft.no_execution_guard)) return false;
    const allowedMethods = requireArray(packageDraft.allowed_methods);
    const forbiddenMethods = requireArray(packageDraft.forbidden_methods);
    if (allowedMethods.join("|") !== "cancel|loadSession|previewDraft") return false;
    if (!forbiddenMethods.includes("submitDraft")) return false;
    if (packageDraft.max_bridge_calls_per_method !== 1) return false;
    if (packageDraft.target_root_refs?.raw_path_stored !== false) return false;
    const bridgeRef = packageDraft.bridge_mock_roundtrip_ref || {};
    if (bridgeRef.submitDraft_calls !== 0) return false;
    return Array.isArray(packageDraft.required_authorization_fields) && packageDraft.required_authorization_fields.length > 0;
  }

  function pluginReliabilityPromptDisciplineIsSafe(draft) {
    const packageDraft = draft.plugin_reliability_prompt_discipline_draft;
    if (!packageDraft || typeof packageDraft !== "object") return false;
    if (packageDraft.package_status !== "draft_only") return false;
    if (packageDraft.reliability_status !== "local_prompt_reliability_candidate") return false;
    if (packageDraft.prompt_registry_status !== "local_registry_candidate") return false;
    if (typeof packageDraft.prompt_hash !== "string" || !packageDraft.prompt_hash.startsWith("fnv1a32:")) return false;
    if (packageDraft.max_plugin_calls_allowed !== 0) return false;
    if (packageDraft.plugin_called !== false) return false;
    if (packageDraft.api_called !== false) return false;
    if (packageDraft.image_created !== false) return false;
    if (packageDraft.side_effects_performed !== false) return false;
    if (!guardIsClean(packageDraft.no_execution_guard)) return false;
    const families = requireArray(packageDraft.prompt_families);
    if (families.length === 0) return false;
    const family = families[0];
    if (family.selected_plugin_id !== "DoubaoGen") return false;
    if (family.requested_model !== "doubao-seedream-5-0-260128") return false;
    if (!Array.isArray(family.banned_subjects_cn) || family.banned_subjects_cn.length === 0) return false;
    if (!Array.isArray(family.prompt_lint_rules_cn) || family.prompt_lint_rules_cn.length === 0) return false;
    if (packageDraft.provider_side_capture?.authorization_status !== "inactive_package") return false;
    if (packageDraft.provider_side_capture?.execution_authorized_by_this_record !== false) return false;
    if (packageDraft.provider_side_capture?.raw_request_capture_allowed !== false) return false;
    return requireArray(packageDraft.failure_taxonomy).length >= 4;
  }

  function memoryWriteCompletionCandidateIsSafe(draft) {
    const packageDraft = draft.memory_write_completion_candidate_draft;
    if (!packageDraft || typeof packageDraft !== "object") return false;
    if (packageDraft.package_status !== "draft_only") return false;
    if (packageDraft.candidate_status !== "memory_write_completion_preflight_candidate") return false;
    if (packageDraft.daily_note_called !== false) return false;
    if (packageDraft.vcp_memory_written !== false) return false;
    if (packageDraft.write_complete_declared !== false) return false;
    if (packageDraft.side_effects_performed !== false) return false;
    if (!guardIsClean(packageDraft.no_execution_guard)) return false;
    const criteria = packageDraft.completion_criteria || {};
    if (criteria.plugin_success_sufficient !== false) return false;
    if (criteria.write_requested_required !== true) return false;
    if (criteria.write_authorized_required !== true) return false;
    if (criteria.writer_executed_required !== true) return false;
    if (criteria.canonical_target_exists_required !== true) return false;
    if (criteria.canonical_target_hash_matches_required !== true) return false;
    const observed = packageDraft.observed_state || {};
    if (observed.writer_executed !== false) return false;
    if (observed.canonical_target_exists !== false) return false;
    if (observed.canonical_target_hash_matches !== false) return false;
    if (observed.write_complete_declared !== false) return false;
    if (packageDraft.wrong_location_classification?.completion_allowed !== false) return false;
    return requireArray(packageDraft.completion_required_sequence).length === 5;
  }

  function singleRealGenerationRetryGateIsSafe(draft) {
    const packageDraft = draft.single_real_generation_retry_gate_draft;
    if (!packageDraft || typeof packageDraft !== "object") return false;
    if (packageDraft.package_status !== "draft_only") return false;
    if (packageDraft.gate_status !== "single_real_generation_retry_gate_inactive") return false;
    if (packageDraft.authorization_status !== "inactive_package") return false;
    if (packageDraft.selected_plugin_id !== "DoubaoGen") return false;
    if (packageDraft.selected_plugin_command !== "generate") return false;
    if (packageDraft.requested_model !== "doubao-seedream-5-0-260128") return false;
    if (typeof packageDraft.prompt_hash !== "string" || !packageDraft.prompt_hash.startsWith("fnv1a32:")) return false;
    if (packageDraft.max_plugin_calls_per_run !== 1) return false;
    if (packageDraft.plugin_calls_observed !== 0) return false;
    if (packageDraft.execution_authorized_by_this_record !== false) return false;
    if (packageDraft.real_generation_performed !== false) return false;
    if (packageDraft.plugin_called !== false) return false;
    if (packageDraft.api_called !== false) return false;
    if (packageDraft.image_created !== false) return false;
    if (packageDraft.daily_note_called !== false) return false;
    if (packageDraft.vcp_memory_written !== false) return false;
    if (packageDraft.side_effects_performed !== false) return false;
    if (!guardIsClean(packageDraft.no_execution_guard)) return false;
    if (packageDraft.output_directory_policy?.raw_path_stored !== false) return false;
    if (packageDraft.output_directory_policy?.overwrite_existing_files_allowed !== false) return false;
    if (packageDraft.future_run_summary_schema?.raw_plugin_output_allowed !== false) return false;
    if (packageDraft.future_run_summary_schema?.image_binary_in_git_or_memory_allowed !== false) return false;
    const memoryBlock = packageDraft.memory_write_block || {};
    if (memoryBlock.memory_write_allowed_by_this_record !== false) return false;
    if (memoryBlock.requires_accepted_candidate !== true) return false;
    if (memoryBlock.requires_memory_approval !== true) return false;
    if (memoryBlock.requires_safety_review_passed !== true) return false;
    return Array.isArray(packageDraft.required_authorization_fields) && packageDraft.required_authorization_fields.length >= 8;
  }

  function realMemoryWriteAuthorizationPackageIsSafe(draft) {
    const packageDraft = draft.real_memory_write_authorization_package_draft;
    if (!packageDraft || typeof packageDraft !== "object") return false;
    if (packageDraft.package_status !== "draft_only") return false;
    if (packageDraft.authorization_status !== "inactive_package") return false;
    if (packageDraft.max_daily_note_writes !== 1) return false;
    if (packageDraft.max_vcp_memory_writes !== 1) return false;
    if (packageDraft.max_retry_attempts !== 1) return false;
    if (packageDraft.target_refs?.raw_path_stored !== false) return false;
    if (packageDraft.no_success_fabrication_rule !== true) return false;
    if (packageDraft.execution_authorized_by_this_record !== false) return false;
    if (packageDraft.daily_note_write_authorized_by_this_record !== false) return false;
    if (packageDraft.vcp_memory_write_authorized_by_this_record !== false) return false;
    if (packageDraft.plugin_called !== false) return false;
    if (packageDraft.api_called !== false) return false;
    if (packageDraft.image_created !== false) return false;
    if (packageDraft.daily_note_called !== false) return false;
    if (packageDraft.vcp_memory_written !== false) return false;
    if (packageDraft.write_complete_declared !== false) return false;
    if (packageDraft.side_effects_performed !== false) return false;
    if (!guardIsClean(packageDraft.no_execution_guard)) return false;
    if (packageDraft.completion_preflight_ref?.plugin_success_sufficient !== false) return false;
    if (packageDraft.completion_preflight_ref?.writer_executed !== false) return false;
    if (packageDraft.completion_preflight_ref?.canonical_target_exists !== false) return false;
    if (packageDraft.completion_preflight_ref?.canonical_target_hash_matches !== false) return false;
    if (!Array.isArray(packageDraft.content_rules_cn) || packageDraft.content_rules_cn.length === 0) return false;
    if (!Array.isArray(packageDraft.reject_path_cn) || packageDraft.reject_path_cn.length === 0) return false;
    return Array.isArray(packageDraft.required_authorization_fields) && packageDraft.required_authorization_fields.length >= 8;
  }

  function assetArchiveCandidateIsSafe(draft) {
    const packageDraft = draft.asset_archive_candidate_draft;
    if (!packageDraft || typeof packageDraft !== "object") return false;
    if (packageDraft.package_status !== "draft_only") return false;
    if (packageDraft.archive_status !== "asset_archive_candidate_no_binary") return false;
    if (packageDraft.archive_policy !== "metadata_only_no_binary") return false;
    if (typeof packageDraft.asset_hash !== "string" || !packageDraft.asset_hash.startsWith("fnv1a32:")) return false;
    if (packageDraft.raw_output_path_stored !== false) return false;
    if (packageDraft.binary_storage_allowed !== false) return false;
    if (packageDraft.git_binary_stored !== false) return false;
    if (packageDraft.memory_binary_stored !== false) return false;
    if (packageDraft.side_effects_performed !== false) return false;
    if (packageDraft.plugin_called !== false) return false;
    if (packageDraft.api_called !== false) return false;
    if (packageDraft.daily_note_called !== false) return false;
    if (packageDraft.vcp_memory_written !== false) return false;
    if (packageDraft.image_created !== false) return false;
    if (!guardIsClean(packageDraft.no_execution_guard)) return false;
    if (["accepted_candidate", "needs_human_review", "rejected"].includes(packageDraft.asset_status_classification) === false) {
      return false;
    }
    const fields = requireArray(packageDraft.archived_fields);
    for (const requiredField of ["output_path_ref", "asset_hash", "review_score", "sanitized_review_summary_cn", "reusable_rules_cn", "human_override_reason_cn"]) {
      if (!fields.includes(requiredField)) return false;
    }
    const closeouts = requireArray(packageDraft.closeout_templates);
    const statuses = closeouts.map((item) => item.asset_status).sort().join("|");
    return statuses === "accepted_candidate|needs_human_review|rejected";
  }

  var VALID_ASSET_STATUSES = Object.freeze(["draft", "accepted_candidate", "needs_human_review", "rejected"]);
var VALID_HUMAN_DECISIONS = Object.freeze(["pending", "accepted", "rejected", "needs_review"]);
var VALID_MEMORY_SUITABILITIES = Object.freeze(["not_evaluated", "suitable", "unsuitable"]);
var VALID_FILTER_STATUSES = Object.freeze(["all", "accepted_candidate", "needs_human_review", "rejected", "memory_suitable"]);
var VALID_TASK_STAGES = Object.freeze(["draft", "planning", "in_review", "blocked", "completed"]);
var VALID_IMPORT_PREVIEW_STATUSES = Object.freeze(["not_loaded", "valid", "stale", "tampered", "incompatible"]);
var VALID_APPROVAL_STATUSES = Object.freeze(["pending", "approved", "rejected", "blocked"]);
var VALID_REVIEWER_ROLES = Object.freeze(["ImageLab_Master", "Archivist_Agent", "Gatekeeper", "Human"]);
var VALID_DISPATCH_STATUSES = Object.freeze(["draft", "mapped", "blocked", "ready_for_human_review"]);
var VALID_GATEKEEPER_STATUSES = Object.freeze(["required", "pending", "reviewed", "blocked"]);
var VALID_TRACE_STATES = Object.freeze(["dispatch_draft", "plan_draft", "review_draft"]);
var VALID_VALIDATOR_STATUSES = Object.freeze(["pending", "passed", "failed"]);
var VALID_DIRTY_TREE_STATUSES = Object.freeze(["clean", "dirty", "unknown"]);
var VALID_RELEASE_NOTES_STATUSES = Object.freeze(["draft", "ready", "missing"]);

  function v6MemoryQueueIsSafe(draft) {
    var v6 = draft && draft.v6_product_runtime_draft;
    if (!v6) { return true; }
    var mq = v6.memory_queue;
    if (!mq || typeof mq !== "object") { return false; }
    if (mq.draft_only !== true) { return false; }
    if (mq.side_effects_performed !== false) { return false; }
    if (!guardIsClean(mq.no_execution_guard)) { return false; }
    if (mq.queue_status !== "draft_queue") { return false; }
    if (!Array.isArray(mq.entries)) { return false; }
    for (var i = 0; i < mq.entries.length; i++) {
      var entry = mq.entries[i];
      if (!entry || typeof entry !== "object") { return false; }
      if (VALID_APPROVAL_STATUSES.indexOf(entry.approval_status) === -1) { return false; }
      if (VALID_REVIEWER_ROLES.indexOf(entry.reviewer_role) === -1) { return false; }
      if (entry.write_authorized !== false) { return false; }
      if (entry.write_performed !== false) { return false; }
      if (entry.canonical_location_verified !== false) { return false; }
      if (entry.canonical_hash_matched !== false) { return false; }
      if (entry.contains_secret !== false) { return false; }
      if (entry.contains_private_path !== false) { return false; }
      if (entry.contains_customer_private_data !== false) { return false; }
      if (entry.image_binary_included !== false) { return false; }
      if (entry.raw_payload_stored !== false) { return false; }
      if (entry.approval_status === "blocked" && !entry.block_reason_cn) { return false; }
      if (entry.approval_status === "rejected" && !entry.reject_reason_cn) { return false; }
      if (entry.should_write_to_vcp === true && entry.write_performed === true) { return false; }
      if (typeof entry.chinese_diary_title !== "string") { return false; }
      if (typeof entry.chinese_diary_content_preview !== "string") { return false; }
    }
    if (mq.counts) {
      var c = mq.counts;
      if (c.total !== mq.entries.length) { return false; }
      var pendCount = 0, apprCount = 0, rejCount = 0, blkCount = 0;
      for (var j = 0; j < mq.entries.length; j++) {
        var s = mq.entries[j].approval_status;
        if (s === "pending") { pendCount++; }
        else if (s === "approved") { apprCount++; }
        else if (s === "rejected") { rejCount++; }
        else if (s === "blocked") { blkCount++; }
      }
      if (c.pending !== pendCount) { return false; }
      if (c.approved !== apprCount) { return false; }
      if (c.rejected !== rejCount) { return false; }
      if (c.blocked !== blkCount) { return false; }
    }
    return true;
  }

  function v6AssetIndexIsSafe(draft) {
    var v6 = draft && draft.v6_product_runtime_draft;
    if (!v6) { return true; }
    var ai = v6.asset_index;
    if (!ai || typeof ai !== "object") { return false; }
    if (ai.draft_only !== true) { return false; }
    if (ai.side_effects_performed !== false) { return false; }
    if (!guardIsClean(ai.no_execution_guard)) { return false; }
    if (!Array.isArray(ai.entries)) { return false; }
    if (VALID_FILTER_STATUSES.indexOf(ai.filter_status) === -1) { return false; }
    for (var i = 0; i < ai.entries.length; i++) {
      var entry = ai.entries[i];
      if (!entry || typeof entry !== "object") { return false; }
      if (VALID_ASSET_STATUSES.indexOf(entry.asset_status) === -1) { return false; }
      if (VALID_HUMAN_DECISIONS.indexOf(entry.human_decision) === -1) { return false; }
      if (VALID_MEMORY_SUITABILITIES.indexOf(entry.memory_suitability) === -1) { return false; }
      if (entry.binary_stored !== false) { return false; }
      if (entry.raw_path_stored !== false) { return false; }
      if (typeof entry.asset_ref === "string" && /^[A-Za-z]:\\|\//.test(entry.asset_ref)) {
        return false;
      }
    }
    return true;
  }

  function v6SessionStoreIsSafe(draft) {
    var v6 = draft && draft.v6_product_runtime_draft;
    if (!v6) { return true; }
    var ss = v6.session_store;
    if (!ss || typeof ss !== "object") { return false; }
    if (ss.draft_only !== true) { return false; }
    if (ss.side_effects_performed !== false) { return false; }
    if (!guardIsClean(ss.no_execution_guard)) { return false; }
    if (!ss.current_session || typeof ss.current_session !== "object") { return false; }
    if (typeof ss.current_session.session_id !== "string") { return false; }
    if (!Array.isArray(ss.current_session.linked_asset_refs)) { return false; }
    if (!ss.import_preview || typeof ss.import_preview !== "object") { return false; }
    if (VALID_IMPORT_PREVIEW_STATUSES.indexOf(ss.import_preview.status) === -1) { return false; }
    if (ss.import_preview.side_effects_performed !== false) { return false; }
    if (!Array.isArray(ss.session_list.entries)) { return false; }
    for (var i = 0; i < ss.session_list.entries.length; i++) {
      var entry = ss.session_list.entries[i];
      if (!entry || typeof entry !== "object") { return false; }
      if (entry.raw_payload_stored !== false) { return false; }
      if (entry.disk_write_performed !== false) { return false; }
      if (!Array.isArray(entry.linked_asset_refs)) { return false; }
    }
    return true;
  }

  function v6ReleaseReadinessIsSafe(draft) {
    var rrd = draft && draft.v6_product_runtime_draft && draft.v6_product_runtime_draft.release_readiness_draft;
    if (!rrd) { return true; }
    if (rrd.draft_only !== true) { return false; }
    if (rrd.side_effects_performed !== false) { return false; }
    if (!guardIsClean(rrd.no_execution_guard)) { return false; }
    if (rrd.push_allowed !== false) { return false; }
    if (rrd.tag_allowed !== false) { return false; }
    if (rrd.release_allowed !== false) { return false; }
    if (rrd.github_release_allowed !== false) { return false; }
    if (rrd.deploy_allowed !== false) { return false; }
    if (rrd.a5_production_execution_allowed !== false) { return false; }
    if (rrd.validator_status) {
      var vs = rrd.validator_status;
      var vsKeys = ["v6_9", "v6_8", "v6_7", "runtime_suite", "validate_mvp"];
      for (var vi = 0; vi < vsKeys.length; vi++) {
        if (vs[vsKeys[vi]] && VALID_VALIDATOR_STATUSES.indexOf(vs[vsKeys[vi]]) === -1) { return false; }
      }
    }
    if (rrd.dirty_tree_status && VALID_DIRTY_TREE_STATUSES.indexOf(rrd.dirty_tree_status) === -1) { return false; }
    if (rrd.release_notes_status && VALID_RELEASE_NOTES_STATUSES.indexOf(rrd.release_notes_status) === -1) { return false; }
    return true;
  }

  function v6DispatchPlanIsSafe(draft) {
    var dpd = draft && draft.v6_product_runtime_draft && draft.v6_product_runtime_draft.dispatch_plan_draft;
    if (!dpd) { return true; }
    if (dpd.draft_only !== true) { return false; }
    if (dpd.side_effects_performed !== false) { return false; }
    if (!guardIsClean(dpd.no_execution_guard)) { return false; }
    if (dpd.dry_run_required !== true) { return false; }
    if (dpd.execution_blocked !== true) { return false; }
    if (dpd.max_plugin_calls !== 0) { return false; }
    if (dpd.allow_file_write !== false) { return false; }
    if (dpd.allow_image_binary !== false) { return false; }

    var sp = dpd.selected_plugin;
    if (!sp || typeof sp !== "object") { return false; }
    if (sp.source !== "local_draft_fixture") { return false; }
    if (sp.real_manifest_loaded !== false) { return false; }
    if (sp.real_plugin_available_confirmed !== false) { return false; }

    if (!Array.isArray(dpd.parameters)) { return false; }
    for (var pi = 0; pi < dpd.parameters.length; pi++) {
      var p = dpd.parameters[pi];
      if (!p || typeof p !== "object") { return false; }
      if (p.raw_secret_stored !== false) { return false; }
      if (p.raw_endpoint_stored !== false) { return false; }
      if (p.raw_path_stored !== false) { return false; }
    }

    if (dpd.gatekeeper_required !== true) { return false; }
    if (!Array.isArray(dpd.forbidden_actions) || dpd.forbidden_actions.length === 0) { return false; }
    if (VALID_DISPATCH_STATUSES.indexOf(dpd.dispatch_status) === -1) { return false; }
    if (VALID_GATEKEEPER_STATUSES.indexOf(dpd.gatekeeper_status) === -1) { return false; }
    if (VALID_TRACE_STATES.indexOf(dpd.trace_state) === -1) { return false; }
    return true;
  }

  function v6ProductRuntimeIsSafe(draft) {
    var v6 = draft && draft.v6_product_runtime_draft;
    if (!v6) { return true; }
    if (v6.layer_status !== "draft_only") { return false; }
    var tp = v6.task_panel;
    if (!tp) { return false; }
    if (tp.draft_only !== true) { return false; }
    if (tp.side_effects_performed !== false) { return false; }
    if (!guardIsClean(v6.no_execution_guard)) { return false; }
    if (VALID_TASK_STAGES.indexOf(tp.current_stage) === -1) { return false; }
    if (typeof tp.visual_goal_cn !== "string") { return false; }
    if (tp.current_stage === "blocked" && !tp.blocked_reason_cn) { return false; }
    if (!v6DispatchPlanIsSafe(draft)) { return false; }
    if (!v6ReleaseReadinessIsSafe(draft)) { return false; }
    return true;
  }

  function draftSideSurfacesAreSafe(draft) {
    const exportDraft = draft.runtime_session_export_draft;
    const deliveryPackage = draft.accepted_candidate_delivery_package_draft;
    const humanOverrideTraceability = draft.human_override_traceability_draft;
    if (
      exportDraft &&
      (exportDraft.package_status !== "draft_only" ||
        exportDraft.side_effects_performed !== false ||
        !guardIsClean(exportDraft.prototype_guard))
    ) {
      return false;
    }
    if (
      deliveryPackage &&
      (deliveryPackage.package_status !== "draft_only" ||
        deliveryPackage.draft_only !== true ||
        deliveryPackage.submitDraft_called !== false ||
        deliveryPackage.side_effects_performed !== false ||
        deliveryPackage.plugin_called !== false ||
        deliveryPackage.api_called !== false ||
        deliveryPackage.daily_note_called !== false ||
        deliveryPackage.vcp_memory_written !== false ||
        deliveryPackage.image_created !== false ||
        !guardIsClean(deliveryPackage.no_execution_guard))
    ) {
      return false;
    }
    if (
      humanOverrideTraceability &&
      (humanOverrideTraceability.package_status !== "draft_only" ||
        humanOverrideTraceability.side_effects_performed !== false ||
        humanOverrideTraceability.plugin_called !== false ||
        humanOverrideTraceability.api_called !== false ||
        humanOverrideTraceability.daily_note_called !== false ||
        humanOverrideTraceability.vcp_memory_written !== false ||
        humanOverrideTraceability.image_created !== false ||
        !guardIsClean(humanOverrideTraceability.no_execution_guard))
    ) {
      return false;
    }
    return guardsAreClean([
      draft.batch_review_summary_draft?.no_execution_guard,
      draft.batch_decision_draft?.no_execution_guard,
      draft.risk_review_summary_draft?.no_execution_guard,
      draft.a5_preauthorization_review_package_draft?.no_execution_guard,
      draft.inactive_authorization_capsules_draft?.no_execution_guard,
      draft.human_inspection_checklist_draft?.no_execution_guard,
      draft.human_override_traceability_draft?.no_execution_guard,
      draft.accepted_candidate_delivery_package_draft?.no_execution_guard,
      draft.runtime_review_state_draft?.no_execution_guard,
      draft.local_commit_scope_plan_draft?.no_execution_guard,
      draft.bridge_mock_roundtrip_candidate_draft?.no_execution_guard,
      draft.real_bridge_authorization_package_draft?.no_execution_guard,
      draft.plugin_reliability_prompt_discipline_draft?.no_execution_guard,
      draft.memory_write_completion_candidate_draft?.no_execution_guard,
      draft.single_real_generation_retry_gate_draft?.no_execution_guard,
      draft.real_memory_write_authorization_package_draft?.no_execution_guard,
      draft.asset_archive_candidate_draft?.no_execution_guard,
      exportDraft?.prototype_guard
    ]);
  }

  function memoryCompletionStateIsSafe(draft) {
    const memoryDelta = draft.memory_delta_draft;
    const memoryCompletion = draft.memory_completion_state_draft;
    if (!memoryCompletion || typeof memoryCompletion !== "object") return false;
    const hasMemoryContent = Boolean(memoryDelta.chinese_diary_content && memoryDelta.chinese_diary_content.trim());
    if (memoryCompletion.write_requested !== hasMemoryContent) return false;
    if (memoryCompletion.write_authorized !== (memoryDelta.approval_status === "approved")) return false;
    if (memoryCompletion.write_performed !== false) return false;
    if (memoryCompletion.canonical_location_verified !== false) return false;
    if (memoryCompletion.canonical_hash_matched !== false) return false;
    if (memoryCompletion.plugin_success_sufficient !== false) return false;
    if (memoryCompletion.write_authorized === true && memoryCompletion.write_requested !== true) return false;
    if (memoryDelta.final_decision?.should_write_to_vcp === true && memoryCompletion.write_authorized !== true) {
      return false;
    }
    if (memoryDelta.final_decision?.should_write_to_vcp === true && memoryCompletion.write_requested !== true) {
      return false;
    }
    return true;
  }

  function draftIsSafe(draft) {
    if (!draft || typeof draft !== "object") return false;
    if (!draft.review_session_draft || !draft.image_case_draft || !draft.memory_delta_draft || !draft.memory_completion_state_draft) return false;
    if (!guardIsClean(draft.prototype_guard)) return false;

    const auditEntry = requireArray(draft.review_session_draft.audit_log)[0];
    if (!guardIsClean(auditEntry?.prototype_guard)) return false;
    if (!draftSideSurfacesAreSafe(draft)) return false;
    if (!memoryCompletionStateIsSafe(draft)) return false;
    if (!inactiveAuthorizationCapsulesAreSafe(draft)) return false;
    if (!runtimeReviewStateIsSafe(draft)) return false;
    if (!localCommitScopePlanIsSafe(draft)) return false;
    if (!bridgeMockRoundtripCandidateIsSafe(draft)) return false;
    if (!realBridgeAuthorizationPackageIsSafe(draft)) return false;
    if (!pluginReliabilityPromptDisciplineIsSafe(draft)) return false;
    if (!memoryWriteCompletionCandidateIsSafe(draft)) return false;
    if (!singleRealGenerationRetryGateIsSafe(draft)) return false;
    if (!realMemoryWriteAuthorizationPackageIsSafe(draft)) return false;
    if (!assetArchiveCandidateIsSafe(draft)) return false;
    if (!v6ProductRuntimeIsSafe(draft)) return false;
    if (!v6AssetIndexIsSafe(draft)) return false;
    if (!v6SessionStoreIsSafe(draft)) return false;
    if (!v6MemoryQueueIsSafe(draft)) return false;

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
      throw new Error("草案必须是对象。");
    }
    if (!draft.review_session_draft || !draft.image_case_draft || !draft.memory_delta_draft || !draft.memory_completion_state_draft) {
      throw new Error("草案缺少必需区块。");
    }
    if (!guardIsClean(draft.prototype_guard)) {
      throw new Error("草案的 prototype_guard 显示存在外部副作用。");
    }
    const auditEntry = requireArray(draft.review_session_draft.audit_log)[0];
    if (!guardIsClean(auditEntry?.prototype_guard)) {
      throw new Error("草案审计 guard 显示存在外部副作用。");
    }
    if (!draftSideSurfacesAreSafe(draft)) {
      throw new Error("草案附属区块 guard 或 runtime session export 状态不满足本地草案边界。");
    }
    if (!memoryCompletionStateIsSafe(draft)) {
      throw new Error("记忆完成状态拆分与 memory_delta_draft 不一致，或存在越界完成标记。");
    }
    if (!inactiveAuthorizationCapsulesAreSafe(draft)) {
      throw new Error("未激活授权胶囊必须保持 inactive_package，且不能包含真实执行标记。");
    }
    if (!runtimeReviewStateIsSafe(draft)) {
      throw new Error("runtime review 状态收敛草案存在矛盾或越界执行标记。");
    }
    if (!localCommitScopePlanIsSafe(draft)) {
      throw new Error("本地 commit scope 计划不能包含 staged changes、版本动作授权或破坏性回滚。");
    }
    if (!bridgeMockRoundtripCandidateIsSafe(draft)) {
      throw new Error("bridge mock roundtrip 候选必须保持项目内 mock-only、previewDraft no-write 和 submitDraft 禁止状态。");
    }
    if (!realBridgeAuthorizationPackageIsSafe(draft)) {
      throw new Error("真实 bridge 授权包草案必须保持 inactive_package，且不能包含真实 CDP、bridge 或 submitDraft 执行标记。");
    }
    if (!pluginReliabilityPromptDisciplineIsSafe(draft)) {
      throw new Error("插件可靠性与 prompt discipline 草案不能包含插件调用、图片创建或 provider-side 捕获激活标记。");
    }
    if (!memoryWriteCompletionCandidateIsSafe(draft)) {
      throw new Error("记忆写入完成候选不能声明真实写入、canonical 校验完成或 plugin success 充分。");
    }
    if (!singleRealGenerationRetryGateIsSafe(draft)) {
      throw new Error("单次真实生图重试授权门必须保持 inactive_package，且不能包含插件调用、API 调用或图片创建标记。");
    }
    if (!realMemoryWriteAuthorizationPackageIsSafe(draft)) {
      throw new Error("真实记忆写入授权包必须保持 inactive_package，且不能包含 DailyNote/VCP memory 写入或完成标记。");
    }
    if (!assetArchiveCandidateIsSafe(draft)) {
      throw new Error("资产归档候选必须保持 metadata-only/no-binary，且不能包含真实写入标记。");
    }
    if (!v6ProductRuntimeIsSafe(draft)) {
      throw new Error("v6 Product Runtime 必须保持 draft_only，Task Panel stage 必须来自允许枚举，blocked 状态必须有 blocked_reason_cn，guard 必须 clean。");
    }
    if (!v6AssetIndexIsSafe(draft)) {
      throw new Error("v6 Asset Index 必须保持 draft_only、side_effects_performed=false、guard clean，entry 字段必须来自允许枚举，binary_stored 和 raw_path_stored 必须为 false，asset_ref 不得包含 raw absolute path。");
    }
    if (!v6SessionStoreIsSafe(draft)) {
      throw new Error("v6 Session Store 必须保持 draft_only、side_effects_performed=false、guard clean，current_session 必须有 session_id 和 linked_asset_refs 数组，import_preview 状态必须来自允许枚举，session_list entries 必须保持 raw_payload_stored=false、disk_write_performed=false、linked_asset_refs 为数组。");
    }
    if (!v6MemoryQueueIsSafe(draft)) {
      throw new Error("v6 Memory Queue 必须保持 draft_only、side_effects_performed=false、guard clean，entries approval_status/reviewer_role 必须来自允许枚举，write_authorized/write_performed/canonical_location_verified/canonical_hash_matched/contains_secret/contains_private_path/contains_customer_private_data/image_binary_included/raw_payload_stored 必须全部为 false，blocked 必须有 block_reason_cn，rejected 必须有 reject_reason_cn。");
    }
    if (draft.image_case_draft.asset_status === "accepted" && draft.image_case_draft.human_approval?.approved !== true) {
      throw new Error("资产标记为 accepted 前必须先获得人工明确批准。");
    }
    if (
      draft.memory_delta_draft.final_decision?.should_write_to_vcp === true &&
      draft.memory_delta_draft.approval_status !== "approved"
    ) {
      throw new Error("记忆写入申请必须先通过记忆审批。");
    }
  }

  return {
    cleanGuard,
    clone,
    requireArray,
    normalizeSession,
    guardIsClean,
    guardsAreClean,
    executionFlagsAreFalse,
    inactiveAuthorizationCapsulesAreSafe,
    runtimeReviewStateIsSafe,
    localCommitScopePlanIsSafe,
    bridgeMockRoundtripCandidateIsSafe,
    realBridgeAuthorizationPackageIsSafe,
    pluginReliabilityPromptDisciplineIsSafe,
    memoryWriteCompletionCandidateIsSafe,
    singleRealGenerationRetryGateIsSafe,
    realMemoryWriteAuthorizationPackageIsSafe,
    assetArchiveCandidateIsSafe,
    v6AssetIndexIsSafe,
    v6SessionStoreIsSafe,
    v6MemoryQueueIsSafe,
    v6DispatchPlanIsSafe,
    v6ReleaseReadinessIsSafe,
    VALID_VALIDATOR_STATUSES,
    VALID_DIRTY_TREE_STATUSES,
    VALID_RELEASE_NOTES_STATUSES,
    VALID_DISPATCH_STATUSES,
    VALID_GATEKEEPER_STATUSES,
    VALID_TRACE_STATES,
    VALID_IMPORT_PREVIEW_STATUSES,
    VALID_APPROVAL_STATUSES,
    VALID_REVIEWER_ROLES,
    VALID_ASSET_STATUSES,
    VALID_HUMAN_DECISIONS,
    VALID_MEMORY_SUITABILITIES,
    VALID_FILTER_STATUSES,
    v6ProductRuntimeIsSafe,
    VALID_TASK_STAGES,
    draftSideSurfacesAreSafe,
    draftIsSafe,
    assertDraftSafe
  };
})();
