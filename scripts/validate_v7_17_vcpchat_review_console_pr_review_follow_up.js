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
    "docs/169_v7_17_vcpchat_review_console_pr_review_follow_up.md",
    "review_console/embed_contract/vcpchat_review_console_pr_review_follow_up.md",
    "tests/schema_examples/v7_17_vcpchat_review_console_pr_review_follow_up.example.yaml",
    "scripts/validate_v7_17_vcpchat_review_console_pr_review_follow_up.js",
    "tests/validation_checklist.md",
    "docs/168_v7_16_vcpchat_review_console_post_pr_handoff.md"
  ];
  const missingFiles = requiredFiles.filter((relativePath) => !exists(relativePath));
  assert(missingFiles.length === 0, `Missing v7.17 PR review follow-up files: ${missingFiles.join(", ")}`);

  const currentRecordFiles = [
    "docs/169_v7_17_vcpchat_review_console_pr_review_follow_up.md",
    "review_console/embed_contract/vcpchat_review_console_pr_review_follow_up.md",
    "tests/schema_examples/v7_17_vcpchat_review_console_pr_review_follow_up.example.yaml"
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
    "v7.17 vcpchat review console pr review follow-up",
    "current_head: 702104a",
    "head_commit_short: 702104a",
    "docs/168_v7_16_vcpchat_review_console_post_pr_handoff.md",
    "v7.18 VCPChat Review Console Ready-for-review Authorization Gate"
  ]);

  const prStatusRecorded = includesAll(contents, [
    "pr_number: 34",
    "pr_title: \"[codex] add Image Lab Review Console bridge\"",
    "pr_url: \"https://github.com/JENN2046/VCPChat/pull/34\"",
    "pr_state: OPEN",
    "pr_is_draft: true",
    "review_decision: none_recorded",
    "mergeable_state: MERGEABLE",
    "base_branch: main",
    "base_head_short: c97ff0c",
    "head_branch: codex/image-lab-review-console-bridge",
    "head_commit_short: 426a2a9",
    "pr_ready_for_review_performed: false",
    "pr_merge_performed: false",
    "vcpchat_main_updated_by_this_phase: false"
  ]);

  const ciStatusRecorded = includesAll(contents, [
    "status_checks_observed: true",
    "status_checks_total: 2",
    "status_checks_success: 2",
    "status_checks_failed: 0",
    "status_checks_pending: 0",
    "all_required_observed_checks_success: true",
    "workflow_name: \"VCPChat JS Smoke\"",
    "check_name: \"JS syntax and optional Photo Studio smoke\"",
    "conclusion: SUCCESS"
  ]);

  const readinessRecorded = includesAll(contents, [
    "ready_for_review_candidate: true",
    "ready_for_review_requires_separate_authorization: true",
    "gh pr ready 34",
    "gh pr merge 34",
    "modify_vcpchat_code",
    "ambiguous_continue_is_not_enough: true"
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
    "pr_ready_for_review_performed: false",
    "pr_merge_performed: false",
    "github_release_performed: false"
  ]);

  const stopBoundaryRecorded = includesAll(contents, [
    "stop_here: true",
    "pr_ready_for_review_blocked_until_authorized: true",
    "pr_merge_blocked_until_authorized: true",
    "v7.17 表示 PR #34 当前仍为 draft",
    "不代表 PR 已转 ready-for-review"
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
    "pr_ready_for_review_performed",
    "pr_merge_performed",
    "github_release_performed",
    "vcpchat_main_updated_by_this_phase"
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
    "## v7.17 VCPChat Review Console PR Review Follow-up 检查",
    "docs/169_v7_17_vcpchat_review_console_pr_review_follow_up.md",
    "review_console/embed_contract/vcpchat_review_console_pr_review_follow_up.md",
    "tests/schema_examples/v7_17_vcpchat_review_console_pr_review_follow_up.example.yaml",
    "scripts/validate_v7_17_vcpchat_review_console_pr_review_follow_up.js",
    "pr_number=34",
    "pr_is_draft=true",
    "mergeable_state=MERGEABLE",
    "status_checks_success=2",
    "ready_for_review_candidate=true"
  ]);

  assert(phaseRecorded, "v7.17 phase and baseline must be recorded.");
  assert(prStatusRecorded, "v7.17 must record PR status.");
  assert(ciStatusRecorded, "v7.17 must record CI status.");
  assert(readinessRecorded, "v7.17 must record ready-for-review readiness.");
  assert(sideEffectGuardRecorded, "v7.17 must record side effect guard.");
  assert(stopBoundaryRecorded, "v7.17 must stop before PR state changes.");
  assert(noForbiddenTrue, "v7.17 must not set forbidden side-effect flags to true.");
  assert(noRawLocalPath, "v7.17 must not save raw local VCP or user paths.");
  assert(checklistCurrent, "validation checklist must include v7.17 checks.");

  process.stdout.write(`${JSON.stringify({
    passed: true,
    v7_17_pr_review_follow_up: {
      phase_recorded: phaseRecorded,
      pr_status_recorded: prStatusRecorded,
      ci_status_recorded: ciStatusRecorded,
      readiness_recorded: readinessRecorded,
      side_effect_guard_recorded: sideEffectGuardRecorded,
      stop_boundary_recorded: stopBoundaryRecorded,
      no_forbidden_true_flags: noForbiddenTrue,
      no_raw_local_path: noRawLocalPath,
      checklist_current: checklistCurrent,
      pr_number: 34,
      pr_is_draft: true,
      mergeable_state: "MERGEABLE",
      status_checks_success: 2,
      ready_for_review_candidate: true,
      next_safe_phase: "v7.18 VCPChat Review Console Ready-for-review Authorization Gate"
    }
  }, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
}
