"use strict";

const EXPECTED_PREVIEW_SCRIPT = "node scripts/serve_review_console_static.js";
const GOVERNANCE_TOOLING_SLICE_HELPER_FILE = "scripts/lib/governance_tooling_maintenance_slice.js";
const EXPECTED_GOVERNANCE_TOOLING_MAINTENANCE_SLICE = [
  ".agent_board/AUTOPILOT_LEDGER.md",
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  "AGENTS.autopilot-overlay.md",
  "AGENTS.md",
  "docs/00_project_roadmap.md",
  "docs/AUTOPILOT_AGENT_BOARD_RESUME_COMPACTION_GUARD.md",
  "docs/AUTOPILOT_COMPLETE_READINESS_GATE.md",
  "docs/AUTOPILOT_AMBER_PACKET_TO_RECEIPT_TRACEABILITY.md",
  "docs/AUTOPILOT_EVOLUTION_ENGINE.md",
  "docs/AUTOPILOT_READINESS_RECEIPT_REGISTRY_CROSS_CLAIMS.md",
  "package.json",
  "review_console/static_prototype/app.js",
  "review_console/static_prototype/index.html",
  "review_console/static_prototype/styles.css",
  "scripts/detect_autopilot_evolution_gaps.js",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/serve_review_console_static.js",
  "scripts/simulate_amber_dry_run_execution_loop.js",
  "scripts/validate_autopilot_agent_board_resume_compaction_guard.js",
  "scripts/validate_autopilot_amber_packet_to_receipt_traceability.js",
  "scripts/validate_autopilot_evolution_engine.js",
  "scripts/validate_autopilot_readiness_receipt_registry_cross_claims.js",
  "scripts/validate_complete_autopilot_readiness_gate.js",
  "scripts/validate_controlled_visual_production_loop_checkpoint_readiness.js",
  "scripts/validate_controlled_visual_production_loop_commit_and_authorization_readiness_audit.js",
  "scripts/validate_controlled_visual_production_loop_exact_file_commit_readiness_review.js",
  "scripts/validate_mvp.ps1",
  "scripts/validate_mvp_capsule_product_core.ps1",
  "tests/schema_examples/amber_dry_run_execution_loop.example.json",
  "tests/schema_examples/autopilot_agent_board_resume_compaction_guard.example.json",
  "tests/schema_examples/autopilot_amber_action_packet.example.json",
  "tests/schema_examples/autopilot_amber_packet_to_receipt_traceability.example.json",
  "tests/schema_examples/autopilot_evolution_backlog.example.json",
  "tests/schema_examples/autopilot_receipt_registry.example.json",
  "tests/schema_examples/autopilot_readiness_receipt_registry_cross_claims.example.json",
  "tests/schema_examples/complete_autopilot_readiness_gate.example.json"
].sort();

const EXPECTED_V0_3_1_REAL_PROVIDER_COST_BOUNDARY_PLAN_SLICE = [
  ".agent_board/AUTOPILOT_LEDGER.md",
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  "docs/00_project_roadmap.md",
  "docs/V0_3_1_REAL_PROVIDER_COST_BOUNDARY_PLAN.md",
  "docs/V0_3_CONTROLLED_REAL_PROVIDER_PRODUCTION_LOOP.md",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_autopilot_agent_board_resume_compaction_guard.js",
  "scripts/validate_v0_3_1_real_provider_cost_boundary_plan.js",
  "tests/schema_examples/autopilot_agent_board_resume_compaction_guard.example.json",
  "tests/schema_examples/v0_3_1_real_provider_cost_boundary_plan.example.json"
].sort();

const EXPECTED_V0_3_2_LIVE_CANDIDATE_ACTION_PACKET_SLICE = [
  ".agent_board/AUTOPILOT_LEDGER.md",
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  "docs/00_project_roadmap.md",
  "docs/V0_3_1_REAL_PROVIDER_COST_BOUNDARY_PLAN.md",
  "docs/V0_3_2_LIVE_CANDIDATE_ACTION_PACKET.md",
  "docs/V0_3_CONTROLLED_REAL_PROVIDER_PRODUCTION_LOOP.md",
  "prompts/image_generation/fashion_night_balcony_vertical_portrait_v1.yaml",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_autopilot_agent_board_resume_compaction_guard.js",
  "scripts/validate_mvp.ps1",
  "scripts/validate_v0_3_1_real_provider_cost_boundary_plan.js",
  "scripts/validate_v0_3_2_live_candidate_action_packet.js",
  "tests/schema_examples/autopilot_agent_board_resume_compaction_guard.example.json",
  "tests/schema_examples/v0_3_1_real_provider_cost_boundary_plan.example.json",
  "tests/schema_examples/v0_3_2_live_candidate_action_packet.example.json"
].sort();

const EXPECTED_V0_3_3_FIRST_LIVE_GENERATION_PILOT_GATE_SLICE = [
  ".agent_board/AUTOPILOT_LEDGER.md",
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  "docs/00_project_roadmap.md",
  "docs/V0_3_1_REAL_PROVIDER_COST_BOUNDARY_PLAN.md",
  "docs/V0_3_2_LIVE_CANDIDATE_ACTION_PACKET.md",
  "docs/V0_3_3_FIRST_LIVE_GENERATION_PILOT_GATE.md",
  "docs/V0_3_CONTROLLED_REAL_PROVIDER_PRODUCTION_LOOP.md",
  "prompts/image_generation/fashion_night_balcony_vertical_portrait_v1.yaml",
  "prompts/image_generation/fashion_night_balcony_vertical_portrait_retry_001_simple.yaml",
  "prompts/image_generation/neutral_smoke_test_red_apple_v1.yaml",
  "prompts/image_generation/safe_adult_editorial_portrait_v1.yaml",
  "reports/provider_receipts/provider_receipt_registry.json",
  "reports/provider_receipts/v0_3_3_codex_sample_first_trial_receipt.json",
  "reports/provider_receipts/v0_3_3_retry_001_receipt.json",
  "reports/provider_receipts/v0_3_3_retry_001_registry.json",
  "reports/provider_receipts/v0_3_3_safe_portrait_001_receipt.json",
  "reports/provider_receipts/v0_3_3_safe_portrait_001_registry.json",
  "reports/provider_receipts/v0_3_3_smoke_001_neutral_receipt.json",
  "reports/provider_receipts/v0_3_3_smoke_001_neutral_registry.json",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_autopilot_agent_board_resume_compaction_guard.js",
  "scripts/validate_mvp.ps1",
  "scripts/validate_v0_3_1_real_provider_cost_boundary_plan.js",
  "scripts/validate_v0_3_2_live_candidate_action_packet.js",
  "scripts/validate_v0_3_3_first_live_generation_pilot_gate.js",
  "tests/schema_examples/autopilot_agent_board_resume_compaction_guard.example.json",
  "tests/schema_examples/v0_3_1_real_provider_cost_boundary_plan.example.json",
  "tests/schema_examples/v0_3_2_live_candidate_action_packet.example.json",
  "tests/schema_examples/v0_3_3_first_live_generation_pilot_gate.example.json"
].sort();

const EXPECTED_PROVIDER_RECEIPT_ARTIFACT_REPAIR_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  ".gitignore",
  "reports/provider_receipts/v0_3_3_safe_portrait_001_receipt.json",
  "reports/provider_receipts/v0_3_3_smoke_001_neutral_receipt.json",
  "runs/real_generation/v0_3_3_codex_sample_first_trial/generation_attempt_result.json",
  "runs/real_generation/v0_3_3_retry_001_codex_sample/generation_attempt_result.json",
  "runs/real_generation/v0_3_3_safe_portrait_001/generation_attempt_result.json",
  "runs/real_generation/v0_3_3_smoke_001_neutral/generation_attempt_result.json",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_controlled_visual_production_loop_checkpoint_readiness.js",
  "scripts/validate_controlled_visual_production_loop_exact_file_commit_readiness_review.js",
  "scripts/validate_local_commit_scope.js",
  "scripts/validate_mvp.ps1",
  "scripts/validate_provider_receipt_artifacts.js"
].sort();

const EXPECTED_V0_3_4_VISUAL_ASSET_GOVERNANCE_RECONCILIATION_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  "assets/visual_asset_authorization_registry.example.json",
  "docs/00_project_roadmap.md",
  "docs/V0_3_4_VISUAL_ASSET_GOVERNANCE_AND_RECEIPT_STATE_RECONCILIATION.md",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_autopilot_agent_board_resume_compaction_guard.js",
  "scripts/validate_local_commit_scope.js",
  "scripts/validate_mvp.ps1",
  "scripts/validate_v0_3_3_first_live_generation_pilot_gate.js",
  "scripts/validate_visual_asset_authorization_policy.js",
  "tests/schema_examples/autopilot_agent_board_resume_compaction_guard.example.json",
  "tests/schema_examples/v0_3_3_first_live_generation_pilot_gate.example.json"
].sort();

const EXPECTED_V0_3_5_VISUAL_ASSET_PROMOTION_GATE_DESIGN_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  "assets/visual_asset_authorization_registry.example.json",
  "docs/00_project_roadmap.md",
  "docs/V0_3_4_VISUAL_ASSET_GOVERNANCE_AND_RECEIPT_STATE_RECONCILIATION.md",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_mvp.ps1",
  "scripts/validate_v0_3_3_first_live_generation_pilot_gate.js",
  "scripts/validate_visual_asset_authorization_policy.js",
  "tests/schema_examples/v0_3_3_first_live_generation_pilot_gate.example.json"
].sort();

const EXPECTED_V0_3_6_BOUNDED_L4_AUTOPILOT_REQUIREMENTS_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  ".agent_board/VALIDATION_LOG.md",
  "AGENTS.autopilot-overlay.md",
  "docs/00_project_roadmap.md",
  "docs/SMART_AUTOPILOT_GOVERNANCE_KERNEL.md",
  "docs/STANDING_OWNER_AUTOMATIC_AUTHORIZATION_POLICY.md",
  "docs/V0_3_6_BOUNDED_L4_AUTOPILOT_REQUIREMENTS_AND_AMBER_SUBCLASS_GATE.md",
  "schemas/autopilot_receipt_registry.schema.yaml",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_bounded_l4_autopilot_requirements.js",
  "scripts/validate_mvp.ps1",
  "tests/schema_examples/autopilot_receipt_registry.example.json",
  "tests/schema_examples/bounded_l4_autopilot_requirements.example.json"
].sort();

const EXPECTED_V0_3_6_POST_PUSH_STATE_SYNC_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  ".agent_board/VALIDATION_LOG.md",
  "docs/00_project_roadmap.md"
].sort();

const EXPECTED_V0_3_7_BOUNDED_L4_EXECUTOR_PREFLIGHT_CONTRACT_SLICE = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  ".agent_board/VALIDATION_LOG.md",
  "AGENTS.autopilot-overlay.md",
  "docs/00_project_roadmap.md",
  "docs/SMART_AUTOPILOT_GOVERNANCE_KERNEL.md",
  "docs/STANDING_OWNER_AUTOMATIC_AUTHORIZATION_POLICY.md",
  "docs/V0_3_7_BOUNDED_L4_EXECUTOR_PREFLIGHT_CONTRACT_GATE.md",
  "schemas/bounded_l4_executor_preflight_packet.schema.yaml",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_bounded_l4_executor_preflight_contract.js",
  "scripts/validate_mvp.ps1",
  "tests/schema_examples/bounded_l4_executor_preflight_packet.example.json"
].sort();

const GOVERNANCE_TOOLING_ALLOWED_SLICES = [
  {
    id: "governance_tooling_maintenance_slice_v1",
    files: EXPECTED_GOVERNANCE_TOOLING_MAINTENANCE_SLICE
  },
  {
    id: "v0_3_1_real_provider_cost_boundary_plan_slice",
    files: EXPECTED_V0_3_1_REAL_PROVIDER_COST_BOUNDARY_PLAN_SLICE
  },
  {
    id: "v0_3_2_live_candidate_action_packet_slice",
    files: EXPECTED_V0_3_2_LIVE_CANDIDATE_ACTION_PACKET_SLICE
  },
  {
    id: "v0_3_3_first_live_generation_pilot_gate_slice",
    files: EXPECTED_V0_3_3_FIRST_LIVE_GENERATION_PILOT_GATE_SLICE
  },
  {
    id: "provider_receipt_artifact_repair_slice",
    files: EXPECTED_PROVIDER_RECEIPT_ARTIFACT_REPAIR_SLICE
  },
  {
    id: "v0_3_4_visual_asset_governance_reconciliation_slice",
    files: EXPECTED_V0_3_4_VISUAL_ASSET_GOVERNANCE_RECONCILIATION_SLICE
  },
  {
    id: "v0_3_5_visual_asset_promotion_gate_design_slice",
    files: EXPECTED_V0_3_5_VISUAL_ASSET_PROMOTION_GATE_DESIGN_SLICE
  },
  {
    id: "v0_3_6_bounded_l4_autopilot_requirements_slice",
    files: EXPECTED_V0_3_6_BOUNDED_L4_AUTOPILOT_REQUIREMENTS_SLICE
  },
  {
    id: "v0_3_6_post_push_state_sync_slice",
    files: EXPECTED_V0_3_6_POST_PUSH_STATE_SYNC_SLICE
  },
  {
    id: "v0_3_7_bounded_l4_executor_preflight_contract_slice",
    files: EXPECTED_V0_3_7_BOUNDED_L4_EXECUTOR_PREFLIGHT_CONTRACT_SLICE
  }
];

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (!value || typeof value !== "object") return value;
  return Object.keys(value).sort().reduce((result, key) => {
    result[key] = stable(value[key]);
    return result;
  }, {});
}

function sameJson(left, right) {
  return JSON.stringify(stable(left)) === JSON.stringify(stable(right));
}

function sameStringList(left, right) {
  return JSON.stringify([...left].sort()) === JSON.stringify([...right].sort());
}

function diffStringList(actual, expected) {
  const actualSet = new Set(actual);
  const expectedSet = new Set(expected);
  return {
    unexpected_files: actual.filter((file) => !expectedSet.has(file)).sort(),
    missing_files: expected.filter((file) => !actualSet.has(file)).sort()
  };
}

function normalizeChangedFilesForSliceMatching(changedFiles) {
  const withoutHelper = changedFiles.filter((file) => file !== GOVERNANCE_TOOLING_SLICE_HELPER_FILE);
  const isPostPushSyncRegistrationPatch = changedFiles.includes(GOVERNANCE_TOOLING_SLICE_HELPER_FILE)
    && sameStringList(withoutHelper, EXPECTED_V0_3_6_POST_PUSH_STATE_SYNC_SLICE);

  return isPostPushSyncRegistrationPatch ? withoutHelper : changedFiles;
}

function fileAllowedInGovernanceToolingSlice(file) {
  return GOVERNANCE_TOOLING_ALLOWED_SLICES.some((slice) => slice.files.includes(file));
}

function findMatchingGovernanceToolingSlice(changedFiles) {
  const normalizedChangedFiles = normalizeChangedFilesForSliceMatching(changedFiles);
  return GOVERNANCE_TOOLING_ALLOWED_SLICES.find((slice) => sameStringList(normalizedChangedFiles, slice.files)) || null;
}

function closestGovernanceToolingSlice(changedFiles) {
  const sortedChangedFiles = normalizeChangedFilesForSliceMatching([...changedFiles].sort());
  return GOVERNANCE_TOOLING_ALLOWED_SLICES
    .map((slice) => {
      const diff = diffStringList(sortedChangedFiles, slice.files);
      return {
        id: slice.id,
        files: slice.files,
        diff,
        distance: diff.unexpected_files.length + diff.missing_files.length
      };
    })
    .sort((left, right) => left.distance - right.distance || left.id.localeCompare(right.id))[0];
}

function packageChangeIsPreviewScriptOnly(currentPackageJson, baselinePackageJson, changedFiles) {
  if (!changedFiles.includes("package.json")) {
    return { allowed: true, mode: "package_json_unchanged" };
  }

  const current = cloneJson(currentPackageJson);
  const baseline = cloneJson(baselinePackageJson);
  const currentPreview = current.scripts?.["preview:review-console"];
  const baselinePreview = baseline.scripts?.["preview:review-console"];

  if (baselinePreview === currentPreview && sameJson(current, baseline)) {
    return { allowed: true, mode: "package_json_identical" };
  }

  if (baselinePreview !== undefined) {
    return { allowed: false, mode: "preview_script_already_existed_or_changed" };
  }

  if (currentPreview !== EXPECTED_PREVIEW_SCRIPT) {
    return { allowed: false, mode: "preview_script_value_unexpected" };
  }

  delete current.scripts["preview:review-console"];
  if (Object.keys(current.scripts).length === 0 && baseline.scripts === undefined) {
    delete current.scripts;
  }

  return {
    allowed: sameJson(current, baseline),
    mode: sameJson(current, baseline)
      ? "preview_review_console_script_added_only"
      : "package_json_has_other_changes"
  };
}

function buildGovernanceToolingMaintenanceSliceReport({ changedFiles, stagedFiles, behind, currentPackageJson, baselinePackageJson }) {
  const sortedChangedFiles = [...changedFiles].sort();
  const normalizedChangedFiles = normalizeChangedFilesForSliceMatching(sortedChangedFiles);
  const pathAllowed = sortedChangedFiles.every(fileAllowedInGovernanceToolingSlice);
  const matchingSlice = findMatchingGovernanceToolingSlice(sortedChangedFiles);
  const closestSlice = matchingSlice || closestGovernanceToolingSlice(normalizedChangedFiles);
  const exactSliceMatches = matchingSlice !== null;
  const packageReport = packageChangeIsPreviewScriptOnly(currentPackageJson, baselinePackageJson, sortedChangedFiles);
  const fileDiff = closestSlice
    ? diffStringList(normalizedChangedFiles, closestSlice.files)
    : { unexpected_files: normalizedChangedFiles, missing_files: [] };

  return {
    passed: behind === 0
      && stagedFiles.length === 0
      && sortedChangedFiles.length > 0
      && pathAllowed
      && exactSliceMatches
      && packageReport.allowed,
    behind_count_is_zero: behind === 0,
    staged_file_count_is_zero: stagedFiles.length === 0,
    path_allowed: pathAllowed,
    exact_slice_matches: exactSliceMatches,
    matched_slice_id: matchingSlice?.id || null,
    closest_slice_id: closestSlice?.id || null,
    package_change_allowed: packageReport.allowed,
    package_change_mode: packageReport.mode,
    expected_file_count: closestSlice?.files.length || 0,
    actual_file_count: sortedChangedFiles.length,
    unexpected_files: fileDiff.unexpected_files,
    missing_files: fileDiff.missing_files
  };
}

function governanceToolingMaintenanceSliceSelfCheck() {
  const baselinePackage = {
    name: "agent-image-lab",
    scripts: {
      "validate:mvp": "powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1"
    },
    dependencies: {
      keep: "1.0.0"
    }
  };
  const previewOnlyPackage = cloneJson(baselinePackage);
  previewOnlyPackage.scripts["preview:review-console"] = EXPECTED_PREVIEW_SCRIPT;
  const dependencyChangedPackage = cloneJson(previewOnlyPackage);
  dependencyChangedPackage.dependencies.extra = "2.0.0";
  const arbitraryScriptPackage = cloneJson(baselinePackage);
  arbitraryScriptPackage.scripts["other:new-script"] = "node scripts/other.js";

  const checks = [
    {
      check: "allowlist_accepts_expected_helper",
      passed: fileAllowedInGovernanceToolingSlice("scripts/lib/governance_tooling_maintenance_slice.js")
    },
    {
      check: "allowlist_rejects_env",
      passed: !fileAllowedInGovernanceToolingSlice(".env")
    },
    {
      check: "exact_slice_matches_expected",
      passed: findMatchingGovernanceToolingSlice(EXPECTED_GOVERNANCE_TOOLING_MAINTENANCE_SLICE)?.id
        === "governance_tooling_maintenance_slice_v1"
    },
    {
      check: "exact_slice_matches_v0_3_1_plan",
      passed: findMatchingGovernanceToolingSlice(EXPECTED_V0_3_1_REAL_PROVIDER_COST_BOUNDARY_PLAN_SLICE)?.id
        === "v0_3_1_real_provider_cost_boundary_plan_slice"
    },
    {
      check: "exact_slice_matches_v0_3_2_packet",
      passed: findMatchingGovernanceToolingSlice(EXPECTED_V0_3_2_LIVE_CANDIDATE_ACTION_PACKET_SLICE)?.id
        === "v0_3_2_live_candidate_action_packet_slice"
    },
    {
      check: "exact_slice_matches_v0_3_3_gate",
      passed: findMatchingGovernanceToolingSlice(EXPECTED_V0_3_3_FIRST_LIVE_GENERATION_PILOT_GATE_SLICE)?.id
        === "v0_3_3_first_live_generation_pilot_gate_slice"
    },
    {
      check: "exact_slice_matches_provider_receipt_artifact_repair",
      passed: findMatchingGovernanceToolingSlice(EXPECTED_PROVIDER_RECEIPT_ARTIFACT_REPAIR_SLICE)?.id
        === "provider_receipt_artifact_repair_slice"
    },
    {
      check: "exact_slice_matches_v0_3_4_visual_asset_governance_reconciliation",
      passed: findMatchingGovernanceToolingSlice(EXPECTED_V0_3_4_VISUAL_ASSET_GOVERNANCE_RECONCILIATION_SLICE)?.id
        === "v0_3_4_visual_asset_governance_reconciliation_slice"
    },
    {
      check: "exact_slice_matches_v0_3_6_post_push_state_sync",
      passed: findMatchingGovernanceToolingSlice(EXPECTED_V0_3_6_POST_PUSH_STATE_SYNC_SLICE)?.id
        === "v0_3_6_post_push_state_sync_slice"
    },
    {
      check: "exact_slice_matches_v0_3_6_post_push_state_sync_registration_patch",
      passed: findMatchingGovernanceToolingSlice([
        ...EXPECTED_V0_3_6_POST_PUSH_STATE_SYNC_SLICE,
        GOVERNANCE_TOOLING_SLICE_HELPER_FILE
      ])?.id === "v0_3_6_post_push_state_sync_slice"
    },
    {
      check: "exact_slice_matches_v0_3_7_bounded_l4_executor_preflight_contract",
      passed: findMatchingGovernanceToolingSlice(EXPECTED_V0_3_7_BOUNDED_L4_EXECUTOR_PREFLIGHT_CONTRACT_SLICE)?.id
        === "v0_3_7_bounded_l4_executor_preflight_contract_slice"
    },
    {
      check: "exact_slice_rejects_missing_file",
      passed: findMatchingGovernanceToolingSlice(EXPECTED_GOVERNANCE_TOOLING_MAINTENANCE_SLICE.slice(1)) === null
    },
    {
      check: "package_allows_preview_script_only",
      passed: packageChangeIsPreviewScriptOnly(previewOnlyPackage, baselinePackage, ["package.json"]).allowed
    },
    {
      check: "package_rejects_dependency_change",
      passed: !packageChangeIsPreviewScriptOnly(dependencyChangedPackage, baselinePackage, ["package.json"]).allowed
    },
    {
      check: "package_rejects_arbitrary_script_change",
      passed: !packageChangeIsPreviewScriptOnly(arbitraryScriptPackage, baselinePackage, ["package.json"]).allowed
    }
  ];

  return {
    passed: checks.every((item) => item.passed),
    failures: checks.filter((item) => !item.passed),
    checks
  };
}

module.exports = {
  EXPECTED_GOVERNANCE_TOOLING_MAINTENANCE_SLICE,
  EXPECTED_V0_3_1_REAL_PROVIDER_COST_BOUNDARY_PLAN_SLICE,
  EXPECTED_V0_3_2_LIVE_CANDIDATE_ACTION_PACKET_SLICE,
  EXPECTED_V0_3_3_FIRST_LIVE_GENERATION_PILOT_GATE_SLICE,
  EXPECTED_PROVIDER_RECEIPT_ARTIFACT_REPAIR_SLICE,
  EXPECTED_V0_3_4_VISUAL_ASSET_GOVERNANCE_RECONCILIATION_SLICE,
  EXPECTED_V0_3_5_VISUAL_ASSET_PROMOTION_GATE_DESIGN_SLICE,
  EXPECTED_V0_3_6_BOUNDED_L4_AUTOPILOT_REQUIREMENTS_SLICE,
  EXPECTED_V0_3_6_POST_PUSH_STATE_SYNC_SLICE,
  EXPECTED_V0_3_7_BOUNDED_L4_EXECUTOR_PREFLIGHT_CONTRACT_SLICE,
  GOVERNANCE_TOOLING_ALLOWED_SLICES,
  buildGovernanceToolingMaintenanceSliceReport,
  fileAllowedInGovernanceToolingSlice,
  governanceToolingMaintenanceSliceSelfCheck,
  packageChangeIsPreviewScriptOnly
};
