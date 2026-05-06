const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function includesAll(content, values) {
  return values.every((value) => content.includes(value));
}

function excludesAll(content, values) {
  return values.every((value) => !content.includes(value));
}

function main() {
  const requiredFiles = [
    "docs/172_v7_20_vcpchat_review_console_review_ci_response_loop.md",
    "review_console/embed_contract/vcpchat_review_console_review_ci_response_loop.md",
    "tests/schema_examples/v7_20_vcpchat_review_console_review_ci_response_loop.example.yaml",
    "scripts/validate_v7_20_vcpchat_review_console_review_ci_response_loop.js",
    "tests/validation_checklist.md",
    "docs/171_v7_19_vcpchat_review_console_ready_for_review_execution_record.md"
  ];
  const missingFiles = requiredFiles.filter((relativePath) => !exists(relativePath));
  assert(missingFiles.length === 0, `Missing v7.20 review and CI response files: ${missingFiles.join(", ")}`);

  const currentRecordFiles = [
    "docs/172_v7_20_vcpchat_review_console_review_ci_response_loop.md",
    "review_console/embed_contract/vcpchat_review_console_review_ci_response_loop.md",
    "tests/schema_examples/v7_20_vcpchat_review_console_review_ci_response_loop.example.yaml"
  ];
  const recordFiles = requiredFiles.filter((relativePath) => !relativePath.endsWith(".js"));
  const contents = recordFiles
    .map((relativePath) => read(relativePath))
    .join("\n");
  const currentContents = currentRecordFiles
    .map((relativePath) => read(relativePath))
    .join("\n");
  const checklist = read("tests/validation_checklist.md");

  const phaseRecorded = includesAll(contents, [
    "v7.20 vcpchat review console review and ci response loop",
    "current_head: 1af484c",
    "head_commit_short: 1af484c",
    "docs/171_v7_19_vcpchat_review_console_ready_for_review_execution_record.md",
    "v7.21 VCPChat Review Console Merge Authorization Preflight"
  ]);

  const reviewSnapshotRecorded = includesAll(contents, [
    "pr_number: 34",
    "pr_title: \"[codex] add Image Lab Review Console bridge\"",
    "pr_url: \"https://github.com/JENN2046/VCPChat/pull/34\"",
    "pr_state: OPEN",
    "pr_is_draft: false",
    "review_decision: none_recorded",
    "reviews_total: 0",
    "latest_reviews_total: 0",
    "blocking_review_observed: false",
    "unresolved_review_threads_observed: false",
    "review_policy_inferred: false"
  ]);

  const ciSnapshotRecorded = includesAll(contents, [
    "mergeable_state: MERGEABLE",
    "base_branch: main",
    "base_head_short: c97ff0c",
    "head_branch: codex/image-lab-review-console-bridge",
    "head_commit_short: 426a2a9",
    "status_checks_total: 2",
    "status_checks_success: 2",
    "status_checks_failed: 0",
    "status_checks_pending: 0",
    "all_observed_checks_success: true",
    "workflow_name: \"VCPChat JS Smoke\"",
    "conclusion: SUCCESS"
  ]);

  const routingDecisionRecorded = includesAll(contents, [
    "ci_failure_response_required: false",
    "review_comment_response_required: false",
    "additional_code_patch_required_now: false",
    "merge_preflight_candidate: true",
    "merge_preflight_recommended: true",
    "建议进入 merge authorization preflight",
    "merge_preflight_must_reconfirm"
  ]);

  const sideEffectGuardRecorded = includesAll(currentContents, [
    "plugin_called: false",
    "api_called: false",
    "daily_note_called: false",
    "vcp_memory_written: false",
    "image_created: false",
    "dependency_changed: false",
    "package_manifest_changed: false",
    "lockfile_changed: false",
    "env_or_secret_file_read: false",
    "secret_value_copied: false",
    "raw_local_path_saved: false",
    "pr_state_changed_by_this_phase: false",
    "pr_merge_performed: false",
    "vcpchat_code_modified_by_this_phase: false",
    "github_release_performed: false"
  ]);

  const stopBoundaryRecorded = includesAll(contents, [
    "stop_here: true",
    "merge_blocked_until_explicit_authorization: true",
    "release_blocked_until_explicit_authorization: true",
    "不执行 merge",
    "不代表 PR 已 merge"
  ]);

  const forbiddenTrueKeys = [
    "plugin_called",
    "api_called",
    "daily_note_called",
    "vcp_memory_written",
    "image_created",
    "dependency_changed",
    "package_manifest_changed",
    "lockfile_changed",
    "env_or_secret_file_read",
    "secret_value_copied",
    "raw_local_path_saved",
    "pr_state_changed_by_this_phase",
    "pr_merge_performed",
    "vcpchat_code_modified_by_this_phase",
    "github_release_performed"
  ];
  const noForbiddenTrue = excludesAll(
    currentContents,
    forbiddenTrueKeys.map((key) => `${key}: true`)
  );

  const noRawLocalPath = excludesAll(currentContents, [
    "A:\\VCP",
    "A:/VCP",
    "C:\\Users",
    "C:/Users"
  ]);

  const checklistCurrent = includesAll(checklist, [
    "## v7.20 VCPChat Review Console Review and CI Response Loop 检查",
    "docs/172_v7_20_vcpchat_review_console_review_ci_response_loop.md",
    "review_console/embed_contract/vcpchat_review_console_review_ci_response_loop.md",
    "tests/schema_examples/v7_20_vcpchat_review_console_review_ci_response_loop.example.yaml",
    "scripts/validate_v7_20_vcpchat_review_console_review_ci_response_loop.js",
    "reviews_total=0",
    "status_checks_success=2",
    "merge_preflight_candidate=true",
    "pr_merge_performed=false"
  ]);

  assert(phaseRecorded, "v7.20 phase and baseline must be recorded.");
  assert(reviewSnapshotRecorded, "v7.20 must record review snapshot.");
  assert(ciSnapshotRecorded, "v7.20 must record CI and mergeability snapshot.");
  assert(routingDecisionRecorded, "v7.20 must record routing decision.");
  assert(sideEffectGuardRecorded, "v7.20 must record side effect guard.");
  assert(stopBoundaryRecorded, "v7.20 must stop before merge.");
  assert(noForbiddenTrue, "v7.20 must not set forbidden side-effect flags to true.");
  assert(noRawLocalPath, "v7.20 must not save raw local VCP or user paths.");
  assert(checklistCurrent, "validation checklist must include v7.20 checks.");

  process.stdout.write(`${JSON.stringify({
    passed: true,
    v7_20_review_ci_response_loop: {
      phase_recorded: phaseRecorded,
      review_snapshot_recorded: reviewSnapshotRecorded,
      ci_snapshot_recorded: ciSnapshotRecorded,
      routing_decision_recorded: routingDecisionRecorded,
      side_effect_guard_recorded: sideEffectGuardRecorded,
      stop_boundary_recorded: stopBoundaryRecorded,
      no_forbidden_true_flags: noForbiddenTrue,
      no_raw_local_path: noRawLocalPath,
      checklist_current: checklistCurrent,
      pr_number: 34,
      reviews_total: 0,
      status_checks_success: 2,
      merge_preflight_candidate: true,
      pr_merge_performed: false,
      next_safe_phase: "v7.21 VCPChat Review Console Merge Authorization Preflight"
    }
  }, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
}
