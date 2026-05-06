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
    "docs/173_v7_21_vcpchat_review_console_merge_authorization_preflight.md",
    "review_console/embed_contract/vcpchat_review_console_merge_authorization_preflight.md",
    "tests/schema_examples/v7_21_vcpchat_review_console_merge_authorization_preflight.example.yaml",
    "scripts/validate_v7_21_vcpchat_review_console_merge_authorization_preflight.js",
    "tests/validation_checklist.md",
    "docs/172_v7_20_vcpchat_review_console_review_ci_response_loop.md"
  ];
  const missingFiles = requiredFiles.filter((relativePath) => !exists(relativePath));
  assert(missingFiles.length === 0, `Missing v7.21 merge authorization preflight files: ${missingFiles.join(", ")}`);

  const currentRecordFiles = [
    "docs/173_v7_21_vcpchat_review_console_merge_authorization_preflight.md",
    "review_console/embed_contract/vcpchat_review_console_merge_authorization_preflight.md",
    "tests/schema_examples/v7_21_vcpchat_review_console_merge_authorization_preflight.example.yaml"
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
    "v7.21 vcpchat review console merge authorization preflight",
    "current_head: b3dd2be",
    "head_commit_short: b3dd2be",
    "docs/172_v7_20_vcpchat_review_console_review_ci_response_loop.md",
    "v7.22 VCPChat Review Console Merge PR Execution"
  ]);

  const snapshotRecorded = includesAll(contents, [
    "pr_number: 34",
    "pr_title: \"[codex] add Image Lab Review Console bridge\"",
    "pr_url: \"https://github.com/JENN2046/VCPChat/pull/34\"",
    "pr_state: OPEN",
    "pr_is_draft: false",
    "mergeable_state: MERGEABLE",
    "review_decision: none_recorded",
    "reviews_total: 0",
    "latest_reviews_total: 0",
    "blocking_review_observed: false",
    "base_branch: main",
    "base_head_short: c97ff0c",
    "head_branch: codex/image-lab-review-console-bridge",
    "head_commit_short: 426a2a9"
  ]);

  const ciRecorded = includesAll(contents, [
    "status_checks_observed: true",
    "status_checks_total: 2",
    "status_checks_success: 2",
    "status_checks_failed: 0",
    "status_checks_pending: 0",
    "all_observed_checks_success: true",
    "workflow_name: \"VCPChat JS Smoke\"",
    "conclusion: SUCCESS"
  ]);

  const readinessRecorded = includesAll(contents, [
    "merge_preflight_passed: true",
    "merge_candidate: true",
    "merge_authorization_ready: true",
    "可以进入单独的 merge 授权点",
    "must_reconfirm_before_merge"
  ]);

  const authorizationRequestRecorded = includesAll(contents, [
    "approval_required_before_merge: true",
    "target_action: merge_pr_34",
    "allowed_merge_methods",
    "recommended_merge_method: squash",
    "gh pr merge 34 --squash --delete-branch=false",
    "feature_branch_deletion_performed: false",
    "我明确授权以 squash 方式 merge VCPChat PR #34，且不删除 feature branch。",
    "broad_no_approval_preference_is_not_merge_authorization: true"
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
    "feature_branch_deleted: false",
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
    "feature_branch_deleted",
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
    "## v7.21 VCPChat Review Console Merge Authorization Preflight 检查",
    "docs/173_v7_21_vcpchat_review_console_merge_authorization_preflight.md",
    "review_console/embed_contract/vcpchat_review_console_merge_authorization_preflight.md",
    "tests/schema_examples/v7_21_vcpchat_review_console_merge_authorization_preflight.example.yaml",
    "scripts/validate_v7_21_vcpchat_review_console_merge_authorization_preflight.js",
    "merge_preflight_passed=true",
    "merge_authorization_ready=true",
    "gh pr merge 34 --squash --delete-branch=false",
    "pr_merge_performed=false"
  ]);

  assert(phaseRecorded, "v7.21 phase and baseline must be recorded.");
  assert(snapshotRecorded, "v7.21 must record merge preflight snapshot.");
  assert(ciRecorded, "v7.21 must record CI confirmation.");
  assert(readinessRecorded, "v7.21 must record merge readiness decision.");
  assert(authorizationRequestRecorded, "v7.21 must record merge authorization request.");
  assert(sideEffectGuardRecorded, "v7.21 must record side effect guard.");
  assert(stopBoundaryRecorded, "v7.21 must stop before merge.");
  assert(noForbiddenTrue, "v7.21 must not set forbidden side-effect flags to true.");
  assert(noRawLocalPath, "v7.21 must not save raw local VCP or user paths.");
  assert(checklistCurrent, "validation checklist must include v7.21 checks.");

  process.stdout.write(`${JSON.stringify({
    passed: true,
    v7_21_merge_authorization_preflight: {
      phase_recorded: phaseRecorded,
      snapshot_recorded: snapshotRecorded,
      ci_recorded: ciRecorded,
      readiness_recorded: readinessRecorded,
      authorization_request_recorded: authorizationRequestRecorded,
      side_effect_guard_recorded: sideEffectGuardRecorded,
      stop_boundary_recorded: stopBoundaryRecorded,
      no_forbidden_true_flags: noForbiddenTrue,
      no_raw_local_path: noRawLocalPath,
      checklist_current: checklistCurrent,
      pr_number: 34,
      merge_preflight_passed: true,
      merge_authorization_ready: true,
      pr_merge_performed: false,
      next_safe_phase: "v7.22 VCPChat Review Console Merge PR Execution"
    }
  }, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
}
