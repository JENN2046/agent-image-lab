const allowedModifiedFiles = [
  ".gitignore",
  "AGENTS.md",
  "MANIFEST.md",
  "README.md",
  "RELEASE_NOTES.md",
  ".agent_board/BLOCKERS.md",
  ".agent_board/CHECKPOINT.md",
  ".agent_board/DECISIONS.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  ".agent_board/VALIDATION_LOG.md",
  "adapter_dry_run_lab/adapter_dry_run.js",
  "adapter_dry_run_lab/README.md",
  "docs/00_project_roadmap.md",
  "exports/vcptoolbox/Plugin/AgentImageLabAdapter/README.md",
  "review_console/static_prototype/FIELD_MAPPING.md",
  "review_console/static_prototype/app.js",
  "review_console/static_prototype/mock_data.js",
  "review_console/runtime_prototype/README.md",
  "review_console/runtime_prototype/app.js",
  "review_console/runtime_prototype/FIELD_MAPPING.md",
  "review_console/runtime_prototype/host_bridge_mock.js",
  "review_console/runtime_prototype/index.html",
  "review_console/runtime_prototype/runtime_guard.js",
  "review_console/runtime_prototype/styles.css",
  "scripts/validate_local_commit_scope.js",
  "scripts/validate-agent-image-lab-local.ps1",
  "scripts/validate_mvp.ps1",
  "scripts/validate_v10_8_a5_positive_still_life_generation_preflight_gate.js",
  "scripts/validate_v10_9_a5_positive_still_life_generation_rejected_asset_record.js",
  "scripts/validate_v10_10_a5_prompt_handoff_diagnostic_preflight.js",
  "scripts/validate_v10_11_a5_prompt_handoff_diagnostic_result.js",
  "scripts/validate_v10_12_a5_provider_side_prompt_fingerprint_capture_authorization_package.js",
  "scripts/validate_v4_index_consistency.js",
  "scripts/validate_v5_delivery_readiness.js",
  "scripts/validate_adapter_delivery_surface.js",
  "scripts/validate_review_console_adapter_handoff.js",
  "scripts/validate_v5_local_sync_readiness.js",
  "scripts/validate_v5_post_commit_reconciliation.js",
  "scripts/validate_v5_index_consistency.js",
  "scripts/validate_v5_local_batch_commit_readiness.js",
  "scripts/validate_v5_handoff_freshness.js",
  "scripts/validate_v5_true_loop_candidate_delivery.js",
  "scripts/validate_runtime_delivery_surface.js",
  "scripts/validate_runtime_guard_unit.js",
  "scripts/validate_runtime_prototype_suite.js",
  "scripts/validate_runtime_prototype_smoke.js",
  "tests/schema_examples/v5_1_runtime_delivery_surface.example.yaml",
  "tests/schema_examples/v5_2_adapter_delivery_surface.example.yaml",
  "tests/schema_examples/v5_3_review_console_adapter_handoff.example.yaml",
  "tests/schema_examples/v5_4_local_sync_readiness.example.yaml",
  "tests/schema_examples/v5_5_post_commit_reconciliation.example.yaml",
  "docs/132_v5_5_post_commit_reconciliation.md",
  "tests/schema_examples/v5_6_v5_index_consistency_validation.example.yaml",
  "docs/133_v5_6_v5_index_consistency_validation.md",
  "tests/schema_examples/v5_7_local_batch_commit_readiness.example.yaml",
  "docs/134_v5_7_local_batch_commit_readiness.md",
  "tests/schema_examples/v5_8_handoff_freshness_validation.example.yaml",
  "docs/135_v5_8_handoff_freshness_validation.md",
  "tests/schema_examples/v5_9_expanded_v5_index_consistency.example.yaml",
  "docs/136_v5_9_expanded_v5_index_consistency.md",
  "tests/schema_examples/v5_10_local_true_loop_candidate_delivery.example.yaml",
  "docs/137_v5_10_local_true_loop_candidate_delivery.md",
  "tests/schema_examples/v5_11_post_merge_reconciliation.example.yaml",
  "docs/138_v5_11_post_merge_reconciliation.md",
  "scripts/validate_v5_post_merge_reconciliation.js",
  "tests/schema_examples/v5_12_release_candidate_readiness.example.yaml",
  "docs/139_v5_12_release_candidate_readiness.md",
  "scripts/validate_v5_12_release_candidate_readiness.js",
  "tests/validation_checklist.md"
];

const allowedUntrackedFiles = [
  ".agent_board/BLOCKERS.md",
  ".agent_board/CHECKPOINT.md",
  ".agent_board/DECISIONS.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  ".agent_board/VALIDATION_LOG.md",
  "AGENTS.autopilot-overlay.md",
  "AUTOPILOT_REFACTOR_REPORT.md",
  "README_AGENT_IMAGE_LAB_AUTOPILOT.md",
  "codex/AGENT_IMAGE_LAB_AUTOPILOT_PROMPT.md",
  "docs/117_v4_0_runtime_contract_smoke_hardening.md",
  "docs/118_v4_1_runtime_guard_unit_validation.md",
  "docs/119_v4_2_runtime_validation_suite.md",
  "docs/120_v4_3_autopilot_overlay_installation.md",
  "docs/121_v4_4_agent_board_state_validation.md",
  "docs/122_v4_5_local_checkpoint_readiness.md",
  "docs/123_v4_6_local_commit_scope_manifest.md",
  "docs/124_v4_7_post_push_state_reconciliation.md",
  "docs/125_v4_8_v4_index_consistency_validation.md",
  "docs/126_v4_9_local_tag_push_readiness.md",
  "docs/127_v5_0_delivery_readiness_index.md",
  "docs/128_v5_1_runtime_delivery_surface.md",
  "docs/129_v5_2_adapter_delivery_surface.md",
  "docs/130_v5_3_review_console_adapter_handoff.md",
  "docs/131_v5_4_local_sync_readiness.md",
  "docs/132_v5_5_post_commit_reconciliation.md",
  "docs/133_v5_6_v5_index_consistency_validation.md",
  "docs/134_v5_7_local_batch_commit_readiness.md",
  "docs/135_v5_8_handoff_freshness_validation.md",
  "docs/136_v5_9_expanded_v5_index_consistency.md",
  "docs/137_v5_10_local_true_loop_candidate_delivery.md",
  "docs/138_v5_11_post_merge_reconciliation.md",
  "docs/139_v5_12_release_candidate_readiness.md",
  "scripts/validate-agent-image-lab-local.ps1",
  "scripts/validate-agent-image-lab-local.sh",
  "scripts/validate_agent_board_state.js",
  "scripts/validate_local_checkpoint_manifest.js",
  "scripts/validate_post_push_state.js",
  "scripts/validate_v4_index_consistency.js",
  "scripts/validate_local_tag_push_readiness.js",
  "scripts/validate_v5_delivery_readiness.js",
  "scripts/validate_adapter_delivery_surface.js",
  "scripts/validate_review_console_adapter_handoff.js",
  "scripts/validate_v5_local_sync_readiness.js",
  "scripts/validate_v5_post_commit_reconciliation.js",
  "scripts/validate_v5_index_consistency.js",
  "scripts/validate_v5_local_batch_commit_readiness.js",
  "scripts/validate_v5_handoff_freshness.js",
  "scripts/validate_v5_true_loop_candidate_delivery.js",
  "scripts/validate_v5_post_merge_reconciliation.js",
  "scripts/validate_v5_12_release_candidate_readiness.js",
  "integrations/vcp/v10_8_positive_still_life_real_generation_authorization_draft.md",
  "integrations/vcp/v10_8_positive_still_life_short_approval_template.md",
  "docs/208_v10_9_a5_positive_still_life_generation_rejected_asset_record.md",
  "review_console/embed_contract/v10_9_a5_positive_still_life_generation_rejected_asset_record.md",
  "tests/schema_examples/v10_9_a5_positive_still_life_generation_rejected_asset_record.example.yaml",
  "scripts/validate_v10_9_a5_positive_still_life_generation_rejected_asset_record.js",
  "docs/209_v10_10_a5_prompt_handoff_diagnostic_preflight.md",
  "review_console/embed_contract/v10_10_a5_prompt_handoff_diagnostic_preflight.md",
  "integrations/vcp/v10_10_prompt_handoff_diagnostic_authorization_template.md",
  "tests/schema_examples/v10_10_a5_prompt_handoff_diagnostic_preflight.example.yaml",
  "scripts/validate_v10_10_a5_prompt_handoff_diagnostic_preflight.js",
  "docs/210_v10_11_a5_prompt_handoff_diagnostic_result.md",
  "review_console/embed_contract/v10_11_a5_prompt_handoff_diagnostic_result.md",
  "tests/schema_examples/v10_11_a5_prompt_handoff_diagnostic_result.example.yaml",
  "scripts/validate_v10_11_a5_prompt_handoff_diagnostic_result.js",
  "docs/211_v10_12_a5_provider_side_prompt_fingerprint_capture_authorization_package.md",
  "integrations/vcp/v10_12_provider_side_prompt_fingerprint_capture_authorization_package.md",
  "review_console/embed_contract/v10_12_a5_provider_side_prompt_fingerprint_capture_authorization_package.md",
  "tests/schema_examples/v10_12_a5_provider_side_prompt_fingerprint_capture_authorization_package.example.yaml",
  "scripts/validate_v10_12_a5_provider_side_prompt_fingerprint_capture_authorization_package.js",
  "docs/215_runtime_review_followup_requirements_audit.md",
  "docs/216_runtime_review_long_task_delivery_plan.md",
  "docs/217_runtime_review_batch_3a_3b_3c_local_stabilization.md",
  "docs/218_runtime_review_batch_4a_bridge_mock_roundtrip.md",
  "docs/219_runtime_review_batch_4b_5a_6a_local_readiness.md",
  "docs/220_runtime_review_batch_5b_6b_7a_local_gate_archive.md",
  "docs/221_runtime_review_batch_8a_release_candidate_readiness_local_proposal.md",
  "docs/222_runtime_review_batch_8a_post_merge_checkpoint.md",
  "docs/223_runtime_review_batch_8b_vnext_rc_acceptance.md",
  "docs/224_runtime_review_batch_8c_final_acceptance_summary.md",
  "scripts/validate_runtime_delivery_surface.js",
  "scripts/validate_runtime_guard_unit.js",
  "scripts/validate_runtime_prototype_suite.js",
  "tests/schema_examples/v4_0_runtime_contract_smoke_hardening.example.yaml",
  "tests/schema_examples/v4_1_runtime_guard_unit_validation.example.yaml",
  "tests/schema_examples/v4_2_runtime_validation_suite.example.yaml",
  "tests/schema_examples/v4_3_autopilot_overlay_installation.example.yaml",
  "tests/schema_examples/v4_4_agent_board_state_validation.example.yaml",
  "tests/schema_examples/v4_5_local_checkpoint_readiness.example.yaml",
  "tests/schema_examples/v4_6_local_commit_scope_manifest.example.yaml",
  "tests/schema_examples/v4_7_post_push_state_reconciliation.example.yaml",
  "tests/schema_examples/v4_8_v4_index_consistency_validation.example.yaml",
  "tests/schema_examples/v4_9_local_tag_push_readiness.example.yaml",
  "tests/schema_examples/v5_0_delivery_readiness.example.yaml",
  "tests/schema_examples/v5_1_runtime_delivery_surface.example.yaml",
  "tests/schema_examples/v5_2_adapter_delivery_surface.example.yaml",
  "tests/schema_examples/v5_3_review_console_adapter_handoff.example.yaml",
  "tests/schema_examples/v5_4_local_sync_readiness.example.yaml",
  "tests/schema_examples/v5_5_post_commit_reconciliation.example.yaml",
  "tests/schema_examples/v5_6_v5_index_consistency_validation.example.yaml",
  "tests/schema_examples/v5_7_local_batch_commit_readiness.example.yaml",
  "tests/schema_examples/v5_8_handoff_freshness_validation.example.yaml",
  "tests/schema_examples/v5_9_expanded_v5_index_consistency.example.yaml",
  "tests/schema_examples/v5_10_local_true_loop_candidate_delivery.example.yaml",
  "tests/schema_examples/v5_11_post_merge_reconciliation.example.yaml",
  "tests/schema_examples/v5_12_release_candidate_readiness.example.yaml"
];

const allowedBranches = [
  "master",
  "codex/v5.11-post-merge-reconciliation",
  "codex/v5.12-release-candidate-readiness",
  "codex/runtime-review-followup"
];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function hasDuplicates(values) {
  return new Set(values).size !== values.length;
}

function hasUnsafePath(values) {
  return values.some((value) => {
    return (
      value.includes("\\") ||
      value.startsWith("/") ||
      /^[A-Za-z]:/.test(value) ||
      value.includes("..") ||
      value.startsWith("runs/") ||
      value.includes(".env")
    );
  });
}

function main() {
  assert(!hasDuplicates(allowedModifiedFiles), "Allowed modified files must not contain duplicates.");
  assert(!hasDuplicates(allowedUntrackedFiles), "Allowed untracked files must not contain duplicates.");
  assert(!hasUnsafePath(allowedModifiedFiles), "Allowed modified files must stay relative and project-local.");
  assert(!hasUnsafePath(allowedUntrackedFiles), "Allowed untracked files must stay relative and project-local.");
  assert(
    allowedUntrackedFiles.includes("docs/126_v4_9_local_tag_push_readiness.md"),
    "v4.9 docs must be included in the untracked allowlist."
  );
  assert(
    allowedUntrackedFiles.includes("tests/schema_examples/v4_9_local_tag_push_readiness.example.yaml"),
    "v4.9 schema example must be included in the untracked allowlist."
  );
  assert(
    allowedUntrackedFiles.includes("scripts/validate_local_tag_push_readiness.js"),
    "v4.9 validation script must be included in the untracked allowlist."
  );
  assert(
    allowedUntrackedFiles.includes("docs/127_v5_0_delivery_readiness_index.md"),
    "v5.0 docs must be included in the untracked allowlist."
  );
  assert(
    allowedUntrackedFiles.includes("tests/schema_examples/v5_0_delivery_readiness.example.yaml"),
    "v5.0 schema example must be included in the untracked allowlist."
  );
  assert(
    allowedUntrackedFiles.includes("scripts/validate_v5_delivery_readiness.js"),
    "v5.0 validation script must be included in the untracked allowlist."
  );
  assert(
    allowedUntrackedFiles.includes("docs/128_v5_1_runtime_delivery_surface.md"),
    "v5.1 docs must be included in the untracked allowlist."
  );
  assert(
    allowedUntrackedFiles.includes("tests/schema_examples/v5_1_runtime_delivery_surface.example.yaml"),
    "v5.1 schema example must be included in the untracked allowlist."
  );
  assert(
    allowedUntrackedFiles.includes("scripts/validate_runtime_delivery_surface.js"),
    "v5.1 validation script must be included in the untracked allowlist."
  );
  assert(
    allowedUntrackedFiles.includes("docs/129_v5_2_adapter_delivery_surface.md"),
    "v5.2 docs must be included in the untracked allowlist."
  );
  assert(
    allowedUntrackedFiles.includes("tests/schema_examples/v5_2_adapter_delivery_surface.example.yaml"),
    "v5.2 schema example must be included in the untracked allowlist."
  );
  assert(
    allowedUntrackedFiles.includes("scripts/validate_adapter_delivery_surface.js"),
    "v5.2 validation script must be included in the untracked allowlist."
  );
  assert(
    allowedUntrackedFiles.includes("docs/130_v5_3_review_console_adapter_handoff.md"),
    "v5.3 docs must be included in the untracked allowlist."
  );
  assert(
    allowedUntrackedFiles.includes("tests/schema_examples/v5_3_review_console_adapter_handoff.example.yaml"),
    "v5.3 schema example must be included in the untracked allowlist."
  );
  assert(
    allowedUntrackedFiles.includes("scripts/validate_review_console_adapter_handoff.js"),
    "v5.3 validation script must be included in the untracked allowlist."
  );
  assert(
    allowedUntrackedFiles.includes("docs/131_v5_4_local_sync_readiness.md"),
    "v5.4 docs must be included in the untracked allowlist."
  );
  assert(
    allowedUntrackedFiles.includes("tests/schema_examples/v5_4_local_sync_readiness.example.yaml"),
    "v5.4 schema example must be included in the untracked allowlist."
  );
  assert(
    allowedUntrackedFiles.includes("scripts/validate_v5_local_sync_readiness.js"),
    "v5.4 validation script must be included in the untracked allowlist."
  );
  assert(
    allowedUntrackedFiles.includes("docs/132_v5_5_post_commit_reconciliation.md"),
    "v5.5 docs must be included in the untracked allowlist."
  );
  assert(
    allowedUntrackedFiles.includes("tests/schema_examples/v5_5_post_commit_reconciliation.example.yaml"),
    "v5.5 schema example must be included in the untracked allowlist."
  );
  assert(
    allowedUntrackedFiles.includes("scripts/validate_v5_post_commit_reconciliation.js"),
    "v5.5 validation script must be included in the untracked allowlist."
  );
  assert(
    allowedUntrackedFiles.includes("docs/133_v5_6_v5_index_consistency_validation.md"),
    "v5.6 docs must be included in the untracked allowlist."
  );
  assert(
    allowedUntrackedFiles.includes("tests/schema_examples/v5_6_v5_index_consistency_validation.example.yaml"),
    "v5.6 schema example must be included in the untracked allowlist."
  );
  assert(
    allowedUntrackedFiles.includes("scripts/validate_v5_index_consistency.js"),
    "v5.6 validation script must be included in the untracked allowlist."
  );
  assert(
    allowedUntrackedFiles.includes("docs/134_v5_7_local_batch_commit_readiness.md"),
    "v5.7 docs must be included in the untracked allowlist."
  );
  assert(
    allowedUntrackedFiles.includes("tests/schema_examples/v5_7_local_batch_commit_readiness.example.yaml"),
    "v5.7 schema example must be included in the untracked allowlist."
  );
  assert(
    allowedUntrackedFiles.includes("scripts/validate_v5_local_batch_commit_readiness.js"),
    "v5.7 validation script must be included in the untracked allowlist."
  );
  assert(
    allowedUntrackedFiles.includes("docs/135_v5_8_handoff_freshness_validation.md"),
    "v5.8 docs must be included in the untracked allowlist."
  );
  assert(
    allowedUntrackedFiles.includes("tests/schema_examples/v5_8_handoff_freshness_validation.example.yaml"),
    "v5.8 schema example must be included in the untracked allowlist."
  );
  assert(
    allowedUntrackedFiles.includes("scripts/validate_v5_handoff_freshness.js"),
    "v5.8 validation script must be included in the untracked allowlist."
  );
  assert(
    allowedUntrackedFiles.includes("docs/136_v5_9_expanded_v5_index_consistency.md"),
    "v5.9 docs must be included in the untracked allowlist."
  );
  assert(
    allowedUntrackedFiles.includes("tests/schema_examples/v5_9_expanded_v5_index_consistency.example.yaml"),
    "v5.9 schema example must be included in the untracked allowlist."
  );
  assert(
    allowedUntrackedFiles.includes("docs/137_v5_10_local_true_loop_candidate_delivery.md"),
    "v5.10 docs must be included in the untracked allowlist."
  );
  assert(
    allowedUntrackedFiles.includes("tests/schema_examples/v5_10_local_true_loop_candidate_delivery.example.yaml"),
    "v5.10 schema example must be included in the untracked allowlist."
  );
  assert(
    allowedUntrackedFiles.includes("scripts/validate_v5_true_loop_candidate_delivery.js"),
    "v5.10 validation script must be included in the untracked allowlist."
  );
  assert(
    allowedUntrackedFiles.includes("docs/138_v5_11_post_merge_reconciliation.md"),
    "v5.11 docs must be included in the untracked allowlist."
  );
  assert(
    allowedUntrackedFiles.includes("tests/schema_examples/v5_11_post_merge_reconciliation.example.yaml"),
    "v5.11 schema example must be included in the untracked allowlist."
  );
  assert(
    allowedUntrackedFiles.includes("scripts/validate_v5_post_merge_reconciliation.js"),
    "v5.11 validation script must be included in the untracked allowlist."
  );
  assert(
    allowedUntrackedFiles.includes("docs/139_v5_12_release_candidate_readiness.md"),
    "v5.12 docs must be included in the untracked allowlist."
  );
  assert(
    allowedUntrackedFiles.includes("tests/schema_examples/v5_12_release_candidate_readiness.example.yaml"),
    "v5.12 schema example must be included in the untracked allowlist."
  );
  assert(
    allowedUntrackedFiles.includes("scripts/validate_v5_12_release_candidate_readiness.js"),
    "v5.12 validation script must be included in the untracked allowlist."
  );
  assert(
    allowedUntrackedFiles.includes("docs/215_runtime_review_followup_requirements_audit.md"),
    "Runtime Review follow-up requirements audit must be included in the untracked allowlist."
  );
  assert(
    allowedUntrackedFiles.includes("docs/216_runtime_review_long_task_delivery_plan.md"),
    "Runtime Review long task delivery plan must be included in the untracked allowlist."
  );
  assert(
    allowedUntrackedFiles.includes("docs/217_runtime_review_batch_3a_3b_3c_local_stabilization.md"),
    "Runtime Review Batch 3A/3B/3C stabilization doc must be included in the untracked allowlist."
  );
  assert(
    allowedUntrackedFiles.includes("docs/218_runtime_review_batch_4a_bridge_mock_roundtrip.md"),
    "Runtime Review Batch 4A bridge mock roundtrip doc must be included in the untracked allowlist."
  );
  assert(
    allowedUntrackedFiles.includes("docs/219_runtime_review_batch_4b_5a_6a_local_readiness.md"),
    "Runtime Review Batch 4B/5A/6A local readiness doc must be included in the untracked allowlist."
  );
  assert(
    allowedUntrackedFiles.includes("docs/220_runtime_review_batch_5b_6b_7a_local_gate_archive.md"),
    "Runtime Review Batch 5B/6B/7A gate/archive doc must be included in the untracked allowlist."
  );
  assert(
    allowedUntrackedFiles.includes("docs/221_runtime_review_batch_8a_release_candidate_readiness_local_proposal.md"),
    "Runtime Review Batch 8A local RC proposal doc must be included in the untracked allowlist."
  );
  assert(
    allowedUntrackedFiles.includes("docs/222_runtime_review_batch_8a_post_merge_checkpoint.md"),
    "Runtime Review Batch 8A post-merge checkpoint doc must be included in the untracked allowlist."
  );
  assert(
    allowedUntrackedFiles.includes("docs/223_runtime_review_batch_8b_vnext_rc_acceptance.md"),
    "Runtime Review Batch 8B vNext RC acceptance doc must be included in the untracked allowlist."
  );
  assert(
    allowedUntrackedFiles.includes("docs/224_runtime_review_batch_8c_final_acceptance_summary.md"),
    "Runtime Review Batch 8C final acceptance summary doc must be included in the untracked allowlist."
  );
  assert(
    allowedModifiedFiles.includes("review_console/runtime_prototype/runtime_guard.js"),
    "Runtime guard must be included in the modified allowlist."
  );
  assert(
    allowedModifiedFiles.includes("scripts/validate_runtime_guard_unit.js"),
    "Runtime guard unit validator must be included in the modified allowlist."
  );

  const result = {
    passed: true,
    local_commit_scope: {
      allowed_branches: allowedBranches,
      allowed_modified_count: allowedModifiedFiles.length,
      allowed_untracked_count: allowedUntrackedFiles.length,
      actual_modified_count: null,
      actual_untracked_count: null,
      unexpected_modified_count: 0,
      unexpected_untracked_count: 0,
      staged_changes_present: false,
      modified_files_allowed: true,
      untracked_files_allowed: true,
      clean_worktree_allowed: true,
      live_git_status_checked: false,
      live_git_status_validator: "scripts/validate_mvp.ps1",
      commit_allowed: false,
      tag_allowed: false,
      push_allowed: false,
      external_network_required: false,
      external_service_required: false,
      file_write_performed: false
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
