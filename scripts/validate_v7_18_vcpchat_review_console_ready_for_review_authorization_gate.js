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
    "docs/170_v7_18_vcpchat_review_console_ready_for_review_authorization_gate.md",
    "review_console/embed_contract/vcpchat_review_console_ready_for_review_authorization_gate.md",
    "tests/schema_examples/v7_18_vcpchat_review_console_ready_for_review_authorization_gate.example.yaml",
    "scripts/validate_v7_18_vcpchat_review_console_ready_for_review_authorization_gate.js",
    "tests/validation_checklist.md",
    "docs/169_v7_17_vcpchat_review_console_pr_review_follow_up.md"
  ];
  const missingFiles = requiredFiles.filter((relativePath) => !exists(relativePath));
  assert(missingFiles.length === 0, `Missing v7.18 ready-for-review authorization files: ${missingFiles.join(", ")}`);

  const currentRecordFiles = [
    "docs/170_v7_18_vcpchat_review_console_ready_for_review_authorization_gate.md",
    "review_console/embed_contract/vcpchat_review_console_ready_for_review_authorization_gate.md",
    "tests/schema_examples/v7_18_vcpchat_review_console_ready_for_review_authorization_gate.example.yaml"
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
    "v7.18 vcpchat review console ready-for-review authorization gate",
    "current_head: 2aea837",
    "head_commit_short: 2aea837",
    "docs/169_v7_17_vcpchat_review_console_pr_review_follow_up.md",
    "v7.19 VCPChat Review Console Ready-for-review Execution Record"
  ]);

  const gateInputsRecorded = includesAll(contents, [
    "pr_number: 34",
    "pr_title: \"[codex] add Image Lab Review Console bridge\"",
    "pr_url: \"https://github.com/JENN2046/VCPChat/pull/34\"",
    "pr_state: OPEN",
    "pr_is_draft: true",
    "mergeable_state: MERGEABLE",
    "head_branch: codex/image-lab-review-console-bridge",
    "head_commit_short: 426a2a9",
    "status_checks_total: 2",
    "status_checks_success: 2",
    "status_checks_failed: 0",
    "status_checks_pending: 0",
    "all_observed_checks_success: true"
  ]);

  const authorizationGateRecorded = includesAll(contents, [
    "ready_for_review_authorization_request",
    "approval_required_before_remote_pr_state_change: true",
    "target_action: mark_pr_ready_for_review",
    "allowed_command_after_approval",
    "gh pr ready 34",
    "expected_after_action",
    "pr_is_draft: false",
    "pr_merge_performed: false",
    "我明确授权将 VCPChat PR #34 转为 ready-for-review。",
    "broad_no_approval_preference_is_not_merge_authorization: true"
  ]);

  const forbiddenActionsRecorded = includesAll(contents, [
    "gh pr merge 34",
    "gh pr close 34",
    "git push --force",
    "modify_vcpchat_code",
    "publish_release",
    "dependency_install_or_update"
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
    "pr_ready_for_review_blocked_until_action: true",
    "pr_merge_blocked_until_separate_authorization: true",
    "唯一允许的后续远端状态切换动作是 `gh pr ready 34`",
    "不代表 PR 已转 ready"
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
    "## v7.18 VCPChat Review Console Ready-for-review Authorization Gate 检查",
    "docs/170_v7_18_vcpchat_review_console_ready_for_review_authorization_gate.md",
    "review_console/embed_contract/vcpchat_review_console_ready_for_review_authorization_gate.md",
    "tests/schema_examples/v7_18_vcpchat_review_console_ready_for_review_authorization_gate.example.yaml",
    "scripts/validate_v7_18_vcpchat_review_console_ready_for_review_authorization_gate.js",
    "ready_for_review_authorization_request_ready=true",
    "gh pr ready 34",
    "pr_ready_for_review_performed=false",
    "pr_merge_performed=false"
  ]);

  assert(phaseRecorded, "v7.18 phase and baseline must be recorded.");
  assert(gateInputsRecorded, "v7.18 must record PR gate inputs.");
  assert(authorizationGateRecorded, "v7.18 must record ready-for-review authorization gate.");
  assert(forbiddenActionsRecorded, "v7.18 must record forbidden actions.");
  assert(sideEffectGuardRecorded, "v7.18 must record side effect guard.");
  assert(stopBoundaryRecorded, "v7.18 must stop before PR state changes.");
  assert(noForbiddenTrue, "v7.18 must not set forbidden side-effect flags to true.");
  assert(noRawLocalPath, "v7.18 must not save raw local VCP or user paths.");
  assert(checklistCurrent, "validation checklist must include v7.18 checks.");

  process.stdout.write(`${JSON.stringify({
    passed: true,
    v7_18_ready_for_review_authorization_gate: {
      phase_recorded: phaseRecorded,
      gate_inputs_recorded: gateInputsRecorded,
      authorization_gate_recorded: authorizationGateRecorded,
      forbidden_actions_recorded: forbiddenActionsRecorded,
      side_effect_guard_recorded: sideEffectGuardRecorded,
      stop_boundary_recorded: stopBoundaryRecorded,
      no_forbidden_true_flags: noForbiddenTrue,
      no_raw_local_path: noRawLocalPath,
      checklist_current: checklistCurrent,
      pr_number: 34,
      allowed_future_action: "gh pr ready 34",
      pr_ready_for_review_performed: false,
      pr_merge_performed: false,
      next_safe_phase: "v7.19 VCPChat Review Console Ready-for-review Execution Record"
    }
  }, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
}
