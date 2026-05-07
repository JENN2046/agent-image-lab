const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const runtimeGuardPath = path.join(root, "review_console", "runtime_prototype", "runtime_guard.js");

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function loadRuntimeGuard() {
  const context = vm.createContext({
    window: {},
    JSON,
    Object,
    Array,
    Error
  });
  context.window.window = context.window;
  const source = fs.readFileSync(runtimeGuardPath, "utf8");
  vm.runInContext(source, context, { filename: "runtime_guard.js" });
  return context.window.ImageLabRuntimeGuard;
}

function makeBaseDraft(runtimeGuard) {
  return {
    review_session_draft: {
      audit_log: [
        {
          prototype_guard: runtimeGuard.clone(runtimeGuard.cleanGuard)
        }
      ]
    },
    image_case_draft: {
      asset_status: "candidate",
      human_approval: {
        approved: false
      }
    },
    memory_delta_draft: {
      approval_status: "pending",
      chinese_diary_content: "本次评审保留记忆草案。",
      final_decision: {
        should_write_to_vcp: false
      }
    },
    memory_completion_state_draft: {
      write_requested: true,
      write_authorized: false,
      write_performed: false,
      canonical_location_verified: false,
      canonical_hash_matched: false,
      plugin_success_sufficient: false
    },
    batch_review_summary_draft: {
      no_execution_guard: runtimeGuard.clone(runtimeGuard.cleanGuard)
    },
    batch_decision_draft: {
      no_execution_guard: runtimeGuard.clone(runtimeGuard.cleanGuard)
    },
    risk_review_summary_draft: {
      no_execution_guard: runtimeGuard.clone(runtimeGuard.cleanGuard)
    },
    a5_preauthorization_review_package_draft: {
      no_execution_guard: runtimeGuard.clone(runtimeGuard.cleanGuard)
    },
    inactive_authorization_capsules_draft: {
      package_status: "draft_only",
      authorization_status: "inactive_package",
      capsule_count: 1,
      capsules: [
        {
          authorization_status: "inactive_package",
          activation_required: true,
          activation_rule_cn: "需要用户明确激活。",
          forbidden_actions_cn: ["调用插件"],
          sanitization_rules_cn: ["只保存脱敏 ref。"],
          rollback_plan_cn: "只回滚本地草案。",
          max_call_counts: {
            plugin_calls: 1
          },
          execution_flags: {
            bridge_called: false,
            plugin_called: false,
            api_called: false,
            daily_note_called: false,
            vcp_memory_written: false,
            image_created: false,
            commit_performed: false,
            tag_performed: false,
            push_performed: false,
            pr_created: false,
            release_created: false
          },
          no_execution_guard: runtimeGuard.clone(runtimeGuard.cleanGuard)
        }
      ],
      side_effects_performed: false,
      no_execution_guard: runtimeGuard.clone(runtimeGuard.cleanGuard)
    },
    human_inspection_checklist_draft: {
      no_execution_guard: runtimeGuard.clone(runtimeGuard.cleanGuard)
    },
    human_override_traceability_draft: {
      package_status: "draft_only",
      side_effects_performed: false,
      plugin_called: false,
      api_called: false,
      daily_note_called: false,
      vcp_memory_written: false,
      image_created: false,
      no_execution_guard: runtimeGuard.clone(runtimeGuard.cleanGuard)
    },
    accepted_candidate_delivery_package_draft: {
      package_status: "draft_only",
      draft_only: true,
      submitDraft_called: false,
      side_effects_performed: false,
      plugin_called: false,
      api_called: false,
      daily_note_called: false,
      vcp_memory_written: false,
      image_created: false,
      no_execution_guard: runtimeGuard.clone(runtimeGuard.cleanGuard)
    },
    runtime_review_state_draft: {
      package_status: "draft_only",
      convergence_status: "converged",
      normalized_state: {
        asset_state_key: "candidate",
        write_requested: true,
        write_authorized: false,
        write_performed: false,
        human_override_performed: false,
        prompt_compliance_complete: false
      },
      mismatch_items_cn: [],
      side_effects_performed: false,
      no_execution_guard: runtimeGuard.clone(runtimeGuard.cleanGuard)
    },
    local_commit_scope_plan_draft: {
      package_status: "draft_only",
      staged_changes_present: false,
      commit_allowed: false,
      tag_allowed: false,
      push_allowed: false,
      pr_allowed: false,
      release_allowed: false,
      scope_groups: [
        { group_id: "runtime_prototype", files_cn: [] },
        { group_id: "validators", files_cn: [] },
        { group_id: "docs_indexes", files_cn: [] },
        { group_id: "agent_board", files_cn: [] }
      ],
      rollback_guidance_cn: ["按文件组排除，不使用破坏性命令。"],
      side_effects_performed: false,
      no_execution_guard: runtimeGuard.clone(runtimeGuard.cleanGuard)
    },
    bridge_mock_roundtrip_candidate_draft: {
      package_status: "draft_only",
      roundtrip_status: "mock_roundtrip_candidate",
      bridge_mode: "project_local_mock",
      source_fixture_policy: "project_local_fixtures_only",
      selected_methods: ["loadSession", "previewDraft"],
      bridge_calls_observed: {
        mock_only: true,
        total: 2,
        cancel: 0,
        loadSession: 1,
        previewDraft: 1,
        submitDraft: 0,
        production_submitDraft: 0
      },
      adapter_handoff_ref: {
        selected_plugin: null,
        max_plugin_calls: 0,
        execution_blocked: true
      },
      ack_summaries: [
        {
          selected_method: "loadSession",
          mock_only: true,
          accepted_by_host_mock: true,
          validation_passed: true,
          ack_keys: ["session_id", "review_queue"],
          side_effects_performed: false,
          plugin_called: false,
          api_called: false,
          daily_note_called: false,
          vcp_memory_written: false,
          image_created: false
        },
        {
          selected_method: "previewDraft",
          mock_only: true,
          accepted_by_host_mock: true,
          validation_passed: true,
          ack_keys: ["selected_method", "validation_passed"],
          side_effects_performed: false,
          plugin_called: false,
          api_called: false,
          daily_note_called: false,
          vcp_memory_written: false,
          image_created: false
        }
      ],
      production_bridge_invocation_performed: false,
      real_cdp_called: false,
      submitDraft_called: false,
      side_effects_performed: false,
      plugin_called: false,
      api_called: false,
      daily_note_called: false,
      vcp_memory_written: false,
      image_created: false,
      no_execution_guard: runtimeGuard.clone(runtimeGuard.cleanGuard)
    },
    real_bridge_authorization_package_draft: {
      package_status: "draft_only",
      authorization_status: "inactive_package",
      activation_required: true,
      target_root_refs: {
        raw_path_stored: false
      },
      allowed_methods: ["cancel", "loadSession", "previewDraft"],
      forbidden_methods: ["submitDraft"],
      max_bridge_calls_per_method: 1,
      required_authorization_fields: ["mode", "real_vcpchat_root_ref"],
      bridge_mock_roundtrip_ref: {
        submitDraft_calls: 0
      },
      execution_authorized_by_this_record: false,
      production_bridge_invocation_performed: false,
      real_cdp_called: false,
      source_read_performed: false,
      submitDraft_allowed: false,
      submitDraft_called: false,
      side_effects_performed: false,
      plugin_called: false,
      api_called: false,
      daily_note_called: false,
      vcp_memory_written: false,
      image_created: false,
      no_execution_guard: runtimeGuard.clone(runtimeGuard.cleanGuard)
    },
    plugin_reliability_prompt_discipline_draft: {
      package_status: "draft_only",
      reliability_status: "local_prompt_reliability_candidate",
      prompt_registry_status: "local_registry_candidate",
      prompt_hash: "fnv1a32:00000000",
      prompt_families: [
        {
          selected_plugin_id: "DoubaoGen",
          requested_model: "doubao-seedream-5-0-260128",
          banned_subjects_cn: ["人物", "文字"],
          prompt_lint_rules_cn: ["禁止人物。", "禁止文字。"]
        }
      ],
      provider_side_capture: {
        authorization_status: "inactive_package",
        execution_authorized_by_this_record: false,
        raw_request_capture_allowed: false
      },
      failure_taxonomy: [{}, {}, {}, {}],
      max_plugin_calls_allowed: 0,
      plugin_called: false,
      api_called: false,
      image_created: false,
      side_effects_performed: false,
      no_execution_guard: runtimeGuard.clone(runtimeGuard.cleanGuard)
    },
    memory_write_completion_candidate_draft: {
      package_status: "draft_only",
      candidate_status: "memory_write_completion_preflight_candidate",
      completion_required_sequence: [
        "write_requested",
        "write_authorized",
        "writer_executed",
        "canonical_target_exists",
        "canonical_target_hash_matches"
      ],
      observed_state: {
        write_requested: true,
        write_authorized: false,
        writer_executed: false,
        canonical_target_exists: false,
        canonical_target_hash_matches: false,
        write_complete_declared: false
      },
      completion_criteria: {
        write_requested_required: true,
        write_authorized_required: true,
        writer_executed_required: true,
        canonical_target_exists_required: true,
        canonical_target_hash_matches_required: true,
        plugin_success_sufficient: false
      },
      wrong_location_classification: {
        completion_allowed: false
      },
      daily_note_called: false,
      vcp_memory_written: false,
      write_complete_declared: false,
      side_effects_performed: false,
      no_execution_guard: runtimeGuard.clone(runtimeGuard.cleanGuard)
    },
    single_real_generation_retry_gate_draft: {
      package_status: "draft_only",
      gate_status: "single_real_generation_retry_gate_inactive",
      authorization_status: "inactive_package",
      selected_plugin_id: "DoubaoGen",
      selected_plugin_command: "generate",
      requested_model: "doubao-seedream-5-0-260128",
      prompt_hash: "fnv1a32:00000000",
      max_plugin_calls_per_run: 1,
      plugin_calls_observed: 0,
      output_directory_policy: {
        raw_path_stored: false,
        overwrite_existing_files_allowed: false
      },
      required_authorization_fields: ["phase", "selected_plugin_id", "max_plugin_calls", "input_reference", "output_directory_ref", "rollback_plan", "gatekeeper_approved", "no_execution_guard"],
      future_run_summary_schema: {
        raw_plugin_output_allowed: false,
        image_binary_in_git_or_memory_allowed: false
      },
      memory_write_block: {
        memory_write_allowed_by_this_record: false,
        requires_accepted_candidate: true,
        requires_memory_approval: true,
        requires_safety_review_passed: true
      },
      execution_authorized_by_this_record: false,
      real_generation_performed: false,
      plugin_called: false,
      api_called: false,
      image_created: false,
      daily_note_called: false,
      vcp_memory_written: false,
      side_effects_performed: false,
      no_execution_guard: runtimeGuard.clone(runtimeGuard.cleanGuard)
    },
    real_memory_write_authorization_package_draft: {
      package_status: "draft_only",
      authorization_status: "inactive_package",
      max_daily_note_writes: 1,
      max_vcp_memory_writes: 1,
      max_retry_attempts: 1,
      target_refs: {
        raw_path_stored: false
      },
      required_authorization_fields: ["phase", "daily_note_write_allowed", "vcp_memory_write_allowed", "max_daily_note_writes", "max_vcp_memory_writes", "chinese_desensitized_body", "canonical_target_ref", "no_execution_guard"],
      content_rules_cn: ["中文脱敏摘要。"],
      reject_path_cn: ["失败不得伪造完成。"],
      no_success_fabrication_rule: true,
      completion_preflight_ref: {
        plugin_success_sufficient: false,
        writer_executed: false,
        canonical_target_exists: false,
        canonical_target_hash_matches: false
      },
      execution_authorized_by_this_record: false,
      daily_note_write_authorized_by_this_record: false,
      vcp_memory_write_authorized_by_this_record: false,
      plugin_called: false,
      api_called: false,
      image_created: false,
      daily_note_called: false,
      vcp_memory_written: false,
      write_complete_declared: false,
      side_effects_performed: false,
      no_execution_guard: runtimeGuard.clone(runtimeGuard.cleanGuard)
    },
    asset_archive_candidate_draft: {
      package_status: "draft_only",
      archive_status: "asset_archive_candidate_no_binary",
      archive_policy: "metadata_only_no_binary",
      asset_hash: "fnv1a32:00000000",
      raw_output_path_stored: false,
      binary_storage_allowed: false,
      git_binary_stored: false,
      memory_binary_stored: false,
      asset_status_classification: "needs_human_review",
      archived_fields: [
        "output_path_ref",
        "asset_hash",
        "review_score",
        "sanitized_review_summary_cn",
        "reusable_rules_cn",
        "human_override_reason_cn"
      ],
      closeout_templates: [
        { asset_status: "accepted_candidate" },
        { asset_status: "needs_human_review" },
        { asset_status: "rejected" }
      ],
      side_effects_performed: false,
      plugin_called: false,
      api_called: false,
      daily_note_called: false,
      vcp_memory_written: false,
      image_created: false,
      no_execution_guard: runtimeGuard.clone(runtimeGuard.cleanGuard)
    },
    runtime_session_export_draft: {
      package_status: "draft_only",
      side_effects_performed: false,
      prototype_guard: runtimeGuard.clone(runtimeGuard.cleanGuard)
    },
    prototype_guard: runtimeGuard.clone(runtimeGuard.cleanGuard)
  };
}

function assertThrows(fn, message) {
  try {
    fn();
  } catch (_error) {
    return;
  }
  throw new Error(message);
}

function main() {
  const runtimeGuard = loadRuntimeGuard();
  assert(runtimeGuard && typeof runtimeGuard === "object", "Runtime guard must load.");
  assert(typeof runtimeGuard.clone === "function", "Runtime guard must expose clone().");
  assert(typeof runtimeGuard.normalizeSession === "function", "Runtime guard must expose normalizeSession().");
  assert(typeof runtimeGuard.guardIsClean === "function", "Runtime guard must expose guardIsClean().");
  assert(typeof runtimeGuard.guardsAreClean === "function", "Runtime guard must expose guardsAreClean().");
  assert(typeof runtimeGuard.executionFlagsAreFalse === "function", "Runtime guard must expose executionFlagsAreFalse().");
  assert(
    typeof runtimeGuard.inactiveAuthorizationCapsulesAreSafe === "function",
    "Runtime guard must expose inactiveAuthorizationCapsulesAreSafe()."
  );
  assert(typeof runtimeGuard.runtimeReviewStateIsSafe === "function", "Runtime guard must expose runtimeReviewStateIsSafe().");
  assert(typeof runtimeGuard.localCommitScopePlanIsSafe === "function", "Runtime guard must expose localCommitScopePlanIsSafe().");
  assert(
    typeof runtimeGuard.bridgeMockRoundtripCandidateIsSafe === "function",
    "Runtime guard must expose bridgeMockRoundtripCandidateIsSafe()."
  );
  assert(
    typeof runtimeGuard.realBridgeAuthorizationPackageIsSafe === "function",
    "Runtime guard must expose realBridgeAuthorizationPackageIsSafe()."
  );
  assert(
    typeof runtimeGuard.pluginReliabilityPromptDisciplineIsSafe === "function",
    "Runtime guard must expose pluginReliabilityPromptDisciplineIsSafe()."
  );
  assert(
    typeof runtimeGuard.memoryWriteCompletionCandidateIsSafe === "function",
    "Runtime guard must expose memoryWriteCompletionCandidateIsSafe()."
  );
  assert(
    typeof runtimeGuard.singleRealGenerationRetryGateIsSafe === "function",
    "Runtime guard must expose singleRealGenerationRetryGateIsSafe()."
  );
  assert(
    typeof runtimeGuard.realMemoryWriteAuthorizationPackageIsSafe === "function",
    "Runtime guard must expose realMemoryWriteAuthorizationPackageIsSafe()."
  );
  assert(
    typeof runtimeGuard.assetArchiveCandidateIsSafe === "function",
    "Runtime guard must expose assetArchiveCandidateIsSafe()."
  );
  assert(
    typeof runtimeGuard.draftSideSurfacesAreSafe === "function",
    "Runtime guard must expose draftSideSurfacesAreSafe()."
  );
  assert(typeof runtimeGuard.draftIsSafe === "function", "Runtime guard must expose draftIsSafe().");
  assert(typeof runtimeGuard.assertDraftSafe === "function", "Runtime guard must expose assertDraftSafe().");

  const cleanGuard = runtimeGuard.clone(runtimeGuard.cleanGuard);
  assert(runtimeGuard.guardIsClean(cleanGuard), "Clean guard must pass.");

  const dirtyGuard = runtimeGuard.clone(runtimeGuard.cleanGuard);
  dirtyGuard.api_called = true;
  assert(runtimeGuard.guardIsClean(dirtyGuard) === false, "Dirty guard must fail.");

  const extraKeyGuard = runtimeGuard.clone(runtimeGuard.cleanGuard);
  extraKeyGuard.unexpected_flag = false;
  assert(runtimeGuard.guardIsClean(extraKeyGuard) === false, "Guard with extra keys must fail.");

  const original = {
    nested: {
      value: "original"
    }
  };
  const cloned = runtimeGuard.clone(original);
  cloned.nested.value = "changed";
  assert(original.nested.value === "original", "clone() must deep copy JSON data.");

  const normalized = runtimeGuard.normalizeSession({
    memory_preview: {},
    image_case_seed: {}
  });
  assert(Array.isArray(normalized.image_versions), "normalizeSession() must default image_versions to an array.");
  assert(Array.isArray(normalized.review_queue), "normalizeSession() must default review_queue to an array.");
  assert(Array.isArray(normalized.comments), "normalizeSession() must default comments to an array.");
  assert(Array.isArray(normalized.annotation_notes), "normalizeSession() must default annotation_notes to an array.");
  assert(Array.isArray(normalized.memory_preview.tags), "normalizeSession() must default memory_preview.tags to an array.");
  assert(Array.isArray(normalized.image_case_seed.input_assets), "normalizeSession() must default input_assets to an array.");
  assert(Array.isArray(normalized.image_case_seed.review_ids), "normalizeSession() must default review_ids to an array.");
  assert(Array.isArray(normalized.image_case_seed.strengths_cn), "normalizeSession() must default strengths_cn to an array.");
  assert(Array.isArray(normalized.image_case_seed.weaknesses_cn), "normalizeSession() must default weaknesses_cn to an array.");
  assert(Array.isArray(normalized.image_case_seed.reusable_rules_cn), "normalizeSession() must default reusable_rules_cn to an array.");

  const safeDraft = makeBaseDraft(runtimeGuard);
  assert(runtimeGuard.draftIsSafe(safeDraft), "Base candidate draft must be safe.");
  runtimeGuard.assertDraftSafe(safeDraft);
  assert(runtimeGuard.inactiveAuthorizationCapsulesAreSafe(safeDraft), "Inactive authorization capsules must be safe.");
  assert(runtimeGuard.runtimeReviewStateIsSafe(safeDraft), "Runtime review state must be safe.");
  assert(runtimeGuard.localCommitScopePlanIsSafe(safeDraft), "Local commit scope plan must be safe.");
  assert(runtimeGuard.bridgeMockRoundtripCandidateIsSafe(safeDraft), "Bridge mock roundtrip candidate must be safe.");
  assert(runtimeGuard.realBridgeAuthorizationPackageIsSafe(safeDraft), "Real bridge authorization package must be safe.");
  assert(
    runtimeGuard.pluginReliabilityPromptDisciplineIsSafe(safeDraft),
    "Plugin reliability prompt discipline draft must be safe."
  );
  assert(runtimeGuard.memoryWriteCompletionCandidateIsSafe(safeDraft), "Memory write completion candidate must be safe.");
  assert(runtimeGuard.singleRealGenerationRetryGateIsSafe(safeDraft), "Single real generation retry gate must be safe.");
  assert(runtimeGuard.realMemoryWriteAuthorizationPackageIsSafe(safeDraft), "Real memory write authorization package must be safe.");
  assert(runtimeGuard.assetArchiveCandidateIsSafe(safeDraft), "Asset archive candidate must be safe.");

  const acceptedDraft = runtimeGuard.clone(safeDraft);
  acceptedDraft.image_case_draft.asset_status = "accepted";
  acceptedDraft.image_case_draft.human_approval.approved = true;
  assert(runtimeGuard.draftIsSafe(acceptedDraft), "Accepted draft with approval must be safe.");

  const acceptedWithoutApproval = runtimeGuard.clone(safeDraft);
  acceptedWithoutApproval.image_case_draft.asset_status = "accepted";
  assert(runtimeGuard.draftIsSafe(acceptedWithoutApproval) === false, "Accepted draft without approval must fail.");
  assertThrows(
    () => runtimeGuard.assertDraftSafe(acceptedWithoutApproval),
    "assertDraftSafe() must reject accepted draft without approval."
  );

  const memoryWriteWithoutApproval = runtimeGuard.clone(safeDraft);
  memoryWriteWithoutApproval.memory_delta_draft.final_decision.should_write_to_vcp = true;
  assert(runtimeGuard.draftIsSafe(memoryWriteWithoutApproval) === false, "Memory write without approval must fail.");

  const memoryWriteWithApproval = runtimeGuard.clone(safeDraft);
  memoryWriteWithApproval.memory_delta_draft.approval_status = "approved";
  memoryWriteWithApproval.memory_delta_draft.final_decision.should_write_to_vcp = true;
  memoryWriteWithApproval.memory_completion_state_draft.write_authorized = true;
  assert(runtimeGuard.draftIsSafe(memoryWriteWithApproval), "Memory write with approval must be safe as a request.");

  const memoryWriteRequestedMismatchDraft = runtimeGuard.clone(safeDraft);
  memoryWriteRequestedMismatchDraft.memory_completion_state_draft.write_requested = false;
  assert(
    runtimeGuard.draftIsSafe(memoryWriteRequestedMismatchDraft) === false,
    "Memory write requested mismatch must fail."
  );

  const memoryWritePerformedDraft = runtimeGuard.clone(memoryWriteWithApproval);
  memoryWritePerformedDraft.memory_completion_state_draft.write_performed = true;
  assert(runtimeGuard.draftIsSafe(memoryWritePerformedDraft) === false, "Memory write performed state must fail in no-write prototype.");

  const memoryCanonicalHashMatchedDraft = runtimeGuard.clone(memoryWriteWithApproval);
  memoryCanonicalHashMatchedDraft.memory_completion_state_draft.canonical_location_verified = true;
  memoryCanonicalHashMatchedDraft.memory_completion_state_draft.canonical_hash_matched = true;
  assert(runtimeGuard.draftIsSafe(memoryCanonicalHashMatchedDraft) === false, "Canonical hash matched state must fail in no-write prototype.");

  const pluginSuccessSufficientDraft = runtimeGuard.clone(memoryWriteWithApproval);
  pluginSuccessSufficientDraft.memory_completion_state_draft.plugin_success_sufficient = true;
  assert(runtimeGuard.draftIsSafe(pluginSuccessSufficientDraft) === false, "Plugin success sufficient state must fail in no-write prototype.");

  const dirtyAuditDraft = runtimeGuard.clone(safeDraft);
  dirtyAuditDraft.review_session_draft.audit_log[0].prototype_guard.api_called = true;
  assert(runtimeGuard.draftIsSafe(dirtyAuditDraft) === false, "Dirty audit guard must fail.");

  const dirtyBatchDraft = runtimeGuard.clone(safeDraft);
  dirtyBatchDraft.batch_decision_draft.no_execution_guard.api_called = true;
  assert(runtimeGuard.draftIsSafe(dirtyBatchDraft) === false, "Dirty batch side-surface guard must fail.");
  assertThrows(
    () => runtimeGuard.assertDraftSafe(dirtyBatchDraft),
    "assertDraftSafe() must reject dirty batch side-surface guard."
  );

  const dirtyDeliveryPackageDraft = runtimeGuard.clone(safeDraft);
  dirtyDeliveryPackageDraft.accepted_candidate_delivery_package_draft.submitDraft_called = true;
  assert(runtimeGuard.draftIsSafe(dirtyDeliveryPackageDraft) === false, "Delivery package with submitDraft_called must fail.");
  assertThrows(
    () => runtimeGuard.assertDraftSafe(dirtyDeliveryPackageDraft),
    "assertDraftSafe() must reject delivery package submitDraft_called=true."
  );

  const dirtyOverrideTraceabilityDraft = runtimeGuard.clone(safeDraft);
  dirtyOverrideTraceabilityDraft.human_override_traceability_draft.no_execution_guard.daily_note_called = true;
  assert(runtimeGuard.draftIsSafe(dirtyOverrideTraceabilityDraft) === false, "Dirty override traceability guard must fail.");

  const activeAuthorizationCapsuleDraft = runtimeGuard.clone(safeDraft);
  activeAuthorizationCapsuleDraft.inactive_authorization_capsules_draft.capsules[0].authorization_status = "active";
  assert(
    runtimeGuard.draftIsSafe(activeAuthorizationCapsuleDraft) === false,
    "Activated authorization capsule must fail."
  );

  const capsuleExecutionFlagDraft = runtimeGuard.clone(safeDraft);
  capsuleExecutionFlagDraft.inactive_authorization_capsules_draft.capsules[0].execution_flags.plugin_called = true;
  assert(
    runtimeGuard.draftIsSafe(capsuleExecutionFlagDraft) === false,
    "Authorization capsule with execution flag must fail."
  );

  const runtimeStateMismatchDraft = runtimeGuard.clone(safeDraft);
  runtimeStateMismatchDraft.runtime_review_state_draft.mismatch_items_cn.push("测试矛盾。");
  assert(runtimeGuard.draftIsSafe(runtimeStateMismatchDraft) === false, "Runtime state mismatch must fail.");

  const runtimeStateOverridePromptDraft = runtimeGuard.clone(safeDraft);
  runtimeStateOverridePromptDraft.runtime_review_state_draft.normalized_state.human_override_performed = true;
  runtimeStateOverridePromptDraft.runtime_review_state_draft.normalized_state.prompt_compliance_complete = true;
  assert(
    runtimeGuard.draftIsSafe(runtimeStateOverridePromptDraft) === false,
    "Human override must not imply prompt compliance complete."
  );

  const stagedCommitScopeDraft = runtimeGuard.clone(safeDraft);
  stagedCommitScopeDraft.local_commit_scope_plan_draft.staged_changes_present = true;
  assert(runtimeGuard.draftIsSafe(stagedCommitScopeDraft) === false, "Staged commit scope plan must fail.");

  const destructiveRollbackDraft = runtimeGuard.clone(safeDraft);
  destructiveRollbackDraft.local_commit_scope_plan_draft.rollback_guidance_cn = ["git reset --hard"];
  assert(runtimeGuard.draftIsSafe(destructiveRollbackDraft) === false, "Destructive rollback guidance must fail.");

  const bridgeSubmitDraftCallDraft = runtimeGuard.clone(safeDraft);
  bridgeSubmitDraftCallDraft.bridge_mock_roundtrip_candidate_draft.bridge_calls_observed.submitDraft = 1;
  assert(runtimeGuard.draftIsSafe(bridgeSubmitDraftCallDraft) === false, "Bridge roundtrip with submitDraft call must fail.");

  const bridgeProductionInvocationDraft = runtimeGuard.clone(safeDraft);
  bridgeProductionInvocationDraft.bridge_mock_roundtrip_candidate_draft.production_bridge_invocation_performed = true;
  assert(
    runtimeGuard.draftIsSafe(bridgeProductionInvocationDraft) === false,
    "Bridge roundtrip with production invocation must fail."
  );

  const activeRealBridgeAuthorizationDraft = runtimeGuard.clone(safeDraft);
  activeRealBridgeAuthorizationDraft.real_bridge_authorization_package_draft.authorization_status = "active";
  assert(
    runtimeGuard.draftIsSafe(activeRealBridgeAuthorizationDraft) === false,
    "Activated real bridge authorization package must fail."
  );

  const realBridgeCdpCalledDraft = runtimeGuard.clone(safeDraft);
  realBridgeCdpCalledDraft.real_bridge_authorization_package_draft.real_cdp_called = true;
  assert(runtimeGuard.draftIsSafe(realBridgeCdpCalledDraft) === false, "Real bridge package with CDP called must fail.");

  const promptReliabilityPluginCallDraft = runtimeGuard.clone(safeDraft);
  promptReliabilityPluginCallDraft.plugin_reliability_prompt_discipline_draft.max_plugin_calls_allowed = 1;
  assert(runtimeGuard.draftIsSafe(promptReliabilityPluginCallDraft) === false, "Prompt reliability allowing plugin calls must fail.");

  const providerCaptureActiveDraft = runtimeGuard.clone(safeDraft);
  providerCaptureActiveDraft.plugin_reliability_prompt_discipline_draft.provider_side_capture.authorization_status = "active";
  assert(runtimeGuard.draftIsSafe(providerCaptureActiveDraft) === false, "Active provider-side capture must fail.");

  const memoryCompletionDeclaredDraft = runtimeGuard.clone(safeDraft);
  memoryCompletionDeclaredDraft.memory_write_completion_candidate_draft.write_complete_declared = true;
  assert(runtimeGuard.draftIsSafe(memoryCompletionDeclaredDraft) === false, "Memory completion declared state must fail.");

  const memoryCompletionCanonicalDraft = runtimeGuard.clone(safeDraft);
  memoryCompletionCanonicalDraft.memory_write_completion_candidate_draft.observed_state.canonical_target_hash_matches = true;
  assert(runtimeGuard.draftIsSafe(memoryCompletionCanonicalDraft) === false, "Memory completion canonical hash observed state must fail.");

  const generationRetryObservedCallDraft = runtimeGuard.clone(safeDraft);
  generationRetryObservedCallDraft.single_real_generation_retry_gate_draft.plugin_calls_observed = 1;
  assert(runtimeGuard.draftIsSafe(generationRetryObservedCallDraft) === false, "Generation retry gate with observed plugin call must fail.");

  const generationRetryImageCreatedDraft = runtimeGuard.clone(safeDraft);
  generationRetryImageCreatedDraft.single_real_generation_retry_gate_draft.image_created = true;
  assert(runtimeGuard.draftIsSafe(generationRetryImageCreatedDraft) === false, "Generation retry gate with image creation must fail.");

  const realMemoryWriteCalledDraft = runtimeGuard.clone(safeDraft);
  realMemoryWriteCalledDraft.real_memory_write_authorization_package_draft.daily_note_called = true;
  assert(runtimeGuard.draftIsSafe(realMemoryWriteCalledDraft) === false, "Real memory write authorization with DailyNote call must fail.");

  const realMemoryCompletionDeclaredDraft = runtimeGuard.clone(safeDraft);
  realMemoryCompletionDeclaredDraft.real_memory_write_authorization_package_draft.write_complete_declared = true;
  assert(runtimeGuard.draftIsSafe(realMemoryCompletionDeclaredDraft) === false, "Real memory write authorization with completion declared must fail.");

  const assetArchiveBinaryDraft = runtimeGuard.clone(safeDraft);
  assetArchiveBinaryDraft.asset_archive_candidate_draft.binary_storage_allowed = true;
  assert(runtimeGuard.draftIsSafe(assetArchiveBinaryDraft) === false, "Asset archive candidate with binary storage must fail.");

  const assetArchiveRawPathDraft = runtimeGuard.clone(safeDraft);
  assetArchiveRawPathDraft.asset_archive_candidate_draft.raw_output_path_stored = true;
  assert(runtimeGuard.draftIsSafe(assetArchiveRawPathDraft) === false, "Asset archive candidate with raw output path must fail.");

  const dirtyExportDraft = runtimeGuard.clone(safeDraft);
  dirtyExportDraft.runtime_session_export_draft.side_effects_performed = true;
  assert(runtimeGuard.draftIsSafe(dirtyExportDraft) === false, "Runtime export with side effects must fail.");
  assertThrows(
    () => runtimeGuard.assertDraftSafe(dirtyExportDraft),
    "assertDraftSafe() must reject runtime export with side effects."
  );

  const missingSectionDraft = runtimeGuard.clone(safeDraft);
  delete missingSectionDraft.memory_delta_draft;
  assert(runtimeGuard.draftIsSafe(missingSectionDraft) === false, "Draft missing required sections must fail.");

  const missingCompletionDraft = runtimeGuard.clone(safeDraft);
  delete missingCompletionDraft.memory_completion_state_draft;
  assert(runtimeGuard.draftIsSafe(missingCompletionDraft) === false, "Draft missing memory completion state must fail.");

  const result = {
    passed: true,
    runtime_guard_unit: {
      clean_guard_passed: true,
      dirty_guard_rejected: true,
      extra_key_guard_rejected: true,
      clone_deep_copy_verified: true,
      normalize_session_defaults_verified: true,
      base_candidate_draft_safe: true,
      accepted_without_approval_rejected: true,
      memory_write_without_approval_rejected: true,
      memory_write_with_approval_allowed_as_request: true,
      memory_write_requested_mismatch_rejected: true,
      memory_write_performed_rejected: true,
      canonical_hash_matched_rejected: true,
      plugin_success_sufficient_rejected: true,
      dirty_audit_guard_rejected: true,
      dirty_batch_side_surface_guard_rejected: true,
      dirty_delivery_package_rejected: true,
      dirty_override_traceability_guard_rejected: true,
      active_authorization_capsule_rejected: true,
      authorization_capsule_execution_flag_rejected: true,
      runtime_state_mismatch_rejected: true,
      runtime_state_override_prompt_complete_rejected: true,
      staged_commit_scope_rejected: true,
      destructive_commit_scope_rollback_rejected: true,
      bridge_submit_draft_call_rejected: true,
      bridge_production_invocation_rejected: true,
      active_real_bridge_authorization_rejected: true,
      real_bridge_cdp_called_rejected: true,
      prompt_reliability_plugin_call_rejected: true,
      provider_capture_active_rejected: true,
      memory_completion_declared_rejected: true,
      memory_completion_canonical_observed_rejected: true,
      generation_retry_observed_call_rejected: true,
      generation_retry_image_created_rejected: true,
      real_memory_write_called_rejected: true,
      real_memory_completion_declared_rejected: true,
      asset_archive_binary_rejected: true,
      asset_archive_raw_path_rejected: true,
      runtime_export_side_effects_rejected: true,
      missing_required_section_rejected: true,
      missing_memory_completion_section_rejected: true
    }
  };

  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
}
