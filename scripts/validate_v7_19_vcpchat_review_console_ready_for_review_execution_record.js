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
    "docs/171_v7_19_vcpchat_review_console_ready_for_review_execution_record.md",
    "review_console/embed_contract/vcpchat_review_console_ready_for_review_execution_record.md",
    "tests/schema_examples/v7_19_vcpchat_review_console_ready_for_review_execution_record.example.yaml",
    "scripts/validate_v7_19_vcpchat_review_console_ready_for_review_execution_record.js",
    "tests/validation_checklist.md",
    "docs/170_v7_18_vcpchat_review_console_ready_for_review_authorization_gate.md"
  ];
  const missingFiles = requiredFiles.filter((relativePath) => !exists(relativePath));
  assert(missingFiles.length === 0, `Missing v7.19 ready-for-review execution record files: ${missingFiles.join(", ")}`);

  const currentRecordFiles = [
    "docs/171_v7_19_vcpchat_review_console_ready_for_review_execution_record.md",
    "review_console/embed_contract/vcpchat_review_console_ready_for_review_execution_record.md",
    "tests/schema_examples/v7_19_vcpchat_review_console_ready_for_review_execution_record.example.yaml"
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
    "v7.19 vcpchat review console ready-for-review execution record",
    "current_head: b40900e",
    "head_commit_short: b40900e",
    "docs/170_v7_18_vcpchat_review_console_ready_for_review_authorization_gate.md",
    "v7.20 VCPChat Review Console Review and CI Response Loop"
  ]);

  const authorizationRecorded = includesAll(contents, [
    "explicit_user_authorization_received: true",
    "我明确授权将 VCPChat PR #34 转为 ready-for-review。",
    "target_pr_number: 34",
    "gh pr ready 34",
    "command_result: success",
    "remote_pr_state_change_performed: true",
    "code_push_performed_by_this_phase: false",
    "merge_performed_by_this_phase: false"
  ]);

  const beforeAfterRecorded = includesAll(contents, [
    "before_action",
    "pr_is_draft: true",
    "after_action",
    "pr_is_draft: false",
    "pr_state: OPEN",
    "mergeable_state: MERGEABLE",
    "head_branch: codex/image-lab-review-console-bridge",
    "head_commit_short: 426a2a9",
    "pr_url: \"https://github.com/JENN2046/VCPChat/pull/34\""
  ]);

  const ciStatusRecorded = includesAll(contents, [
    "status_checks_observed: true",
    "status_checks_total: 2",
    "status_checks_success: 2",
    "status_checks_failed: 0",
    "status_checks_pending: 0",
    "all_observed_checks_success: true",
    "workflow_name: \"VCPChat JS Smoke\"",
    "conclusion: SUCCESS"
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
    "pr_ready_for_review_performed: true",
    "pr_merge_performed: false",
    "vcpchat_code_modified_by_this_phase: false",
    "github_release_performed: false"
  ]);

  const nextGateRecorded = includesAll(contents, [
    "pr_ready_for_review_complete: true",
    "pr_waiting_for_review_or_merge_preflight: true",
    "merge_requires_separate_authorization: true",
    "release_requires_separate_authorization: true",
    "runtime_smoke_test_not_performed: true",
    "不代表已 merge"
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
    "## v7.19 VCPChat Review Console Ready-for-review Execution Record 检查",
    "docs/171_v7_19_vcpchat_review_console_ready_for_review_execution_record.md",
    "review_console/embed_contract/vcpchat_review_console_ready_for_review_execution_record.md",
    "tests/schema_examples/v7_19_vcpchat_review_console_ready_for_review_execution_record.example.yaml",
    "scripts/validate_v7_19_vcpchat_review_console_ready_for_review_execution_record.js",
    "command_result=success",
    "pr_is_draft=false",
    "pr_ready_for_review_performed=true",
    "pr_merge_performed=false"
  ]);

  assert(phaseRecorded, "v7.19 phase and baseline must be recorded.");
  assert(authorizationRecorded, "v7.19 must record authorization and command.");
  assert(beforeAfterRecorded, "v7.19 must record before and after PR state.");
  assert(ciStatusRecorded, "v7.19 must record CI status after action.");
  assert(sideEffectGuardRecorded, "v7.19 must record side effect guard.");
  assert(nextGateRecorded, "v7.19 must record next gate.");
  assert(noForbiddenTrue, "v7.19 must not set forbidden side-effect flags to true.");
  assert(noRawLocalPath, "v7.19 must not save raw local VCP or user paths.");
  assert(checklistCurrent, "validation checklist must include v7.19 checks.");

  process.stdout.write(`${JSON.stringify({
    passed: true,
    v7_19_ready_for_review_execution_record: {
      phase_recorded: phaseRecorded,
      authorization_recorded: authorizationRecorded,
      before_after_recorded: beforeAfterRecorded,
      ci_status_recorded: ciStatusRecorded,
      side_effect_guard_recorded: sideEffectGuardRecorded,
      next_gate_recorded: nextGateRecorded,
      no_forbidden_true_flags: noForbiddenTrue,
      no_raw_local_path: noRawLocalPath,
      checklist_current: checklistCurrent,
      pr_number: 34,
      pr_is_draft_after: false,
      pr_ready_for_review_performed: true,
      pr_merge_performed: false,
      next_safe_phase: "v7.20 VCPChat Review Console Review and CI Response Loop"
    }
  }, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
}
