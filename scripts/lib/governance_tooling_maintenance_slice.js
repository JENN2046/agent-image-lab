"use strict";

const EXPECTED_PREVIEW_SCRIPT = "node scripts/serve_review_console_static.js";
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

function fileAllowedInGovernanceToolingSlice(file) {
  return EXPECTED_GOVERNANCE_TOOLING_MAINTENANCE_SLICE.includes(file);
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
  const pathAllowed = sortedChangedFiles.every(fileAllowedInGovernanceToolingSlice);
  const exactSliceMatches = sameStringList(sortedChangedFiles, EXPECTED_GOVERNANCE_TOOLING_MAINTENANCE_SLICE);
  const packageReport = packageChangeIsPreviewScriptOnly(currentPackageJson, baselinePackageJson, sortedChangedFiles);
  const fileDiff = diffStringList(sortedChangedFiles, EXPECTED_GOVERNANCE_TOOLING_MAINTENANCE_SLICE);

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
    package_change_allowed: packageReport.allowed,
    package_change_mode: packageReport.mode,
    expected_file_count: EXPECTED_GOVERNANCE_TOOLING_MAINTENANCE_SLICE.length,
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
      passed: sameStringList(EXPECTED_GOVERNANCE_TOOLING_MAINTENANCE_SLICE, EXPECTED_GOVERNANCE_TOOLING_MAINTENANCE_SLICE)
    },
    {
      check: "exact_slice_rejects_missing_file",
      passed: !sameStringList(EXPECTED_GOVERNANCE_TOOLING_MAINTENANCE_SLICE.slice(1), EXPECTED_GOVERNANCE_TOOLING_MAINTENANCE_SLICE)
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
  buildGovernanceToolingMaintenanceSliceReport,
  fileAllowedInGovernanceToolingSlice,
  governanceToolingMaintenanceSliceSelfCheck,
  packageChangeIsPreviewScriptOnly
};
