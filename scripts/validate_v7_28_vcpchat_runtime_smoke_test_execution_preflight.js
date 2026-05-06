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
  if (!condition) throw new Error(message);
}

function includesAll(content, values) {
  return values.every((value) => content.includes(value));
}

function excludesAll(content, values) {
  return values.every((value) => !content.includes(value));
}

function excludesExactTrueFlags(content, keys) {
  const lines = content.split(/\r?\n/).map((line) => line.trim());
  return keys.every((key) => !lines.some((line) => line === `${key}: true`));
}

function main() {
  const requiredFiles = [
    "docs/180_v7_28_vcpchat_runtime_smoke_test_execution_preflight.md",
    "review_console/embed_contract/vcpchat_runtime_smoke_test_execution_preflight.md",
    "tests/schema_examples/v7_28_vcpchat_runtime_smoke_test_execution_preflight.example.yaml",
    "scripts/validate_v7_28_vcpchat_runtime_smoke_test_execution_preflight.js",
    "tests/validation_checklist.md",
    "docs/179_v7_27_vcpchat_runtime_smoke_test_preflight.md"
  ];
  const missing = requiredFiles.filter((relativePath) => !exists(relativePath));
  assert(missing.length === 0, `Missing v7.28 runtime smoke test execution preflight files: ${missing.join(", ")}`);

  const currentFiles = [
    "docs/180_v7_28_vcpchat_runtime_smoke_test_execution_preflight.md",
    "review_console/embed_contract/vcpchat_runtime_smoke_test_execution_preflight.md",
    "tests/schema_examples/v7_28_vcpchat_runtime_smoke_test_execution_preflight.example.yaml"
  ];
  const contents = requiredFiles
    .filter((relativePath) => !relativePath.endsWith(".js"))
    .map((relativePath) => read(relativePath))
    .join("\n");
  const currentContents = currentFiles.map((relativePath) => read(relativePath)).join("\n");
  const checklist = read("tests/validation_checklist.md");

  const phaseRecorded = includesAll(contents, [
    "v7.28 vcpchat runtime smoke test execution preflight",
    "current_head: 683ff22",
    "head_commit_short: 683ff22",
    "docs/179_v7_27_vcpchat_runtime_smoke_test_preflight.md",
    "v7.29 VCPChat Runtime Smoke Test Execution Record"
  ]);

  const authorizationGateRecorded = includesAll(currentContents, [
    "hard_authorization_required_before_launch: true",
    "hard_authorization_granted_by_this_phase: false",
    "app_launch_authorized_by_this_phase: false",
    "runtime_smoke_test_authorized_by_this_phase: false",
    "requires_explicit_app_launch_authorization: true"
  ]);

  const targetRecorded = includesAll(currentContents, [
    "target_repository_name: VCPChat",
    "target_branch: main",
    "target_head_short: b320e39",
    "expected_head_short: b320e39",
    "require_worktree_clean: true",
    "require_origin_main_synced: true"
  ]);

  const commandsRecorded = includesAll(currentContents, [
    "node --check main.js",
    "node --check modules\\ipc\\imageLabReviewHandlers.js",
    "node --check preloads\\chat.js",
    "node --check modules\\renderer\\imageLabReviewMount.js",
    "npm run start:desktop:utf8",
    "command_execution_performed_by_this_phase: false"
  ]);

  const runtimeAssertionsRecorded = includesAll(currentContents, [
    "window.imageLabReview.loadSession",
    "window.imageLabReview.previewDraft",
    "window.imageLabReview.submitDraft",
    "window.imageLabReview.cancel",
    "imageLabReviewMount",
    "window.imageLabReviewRuntime",
    "review_session_draft",
    "image_case_draft",
    "memory_delta_draft",
    "prototype_guard.api_called 为 false",
    "prototype_guard.disk_write_performed 为 false",
    "prototype_guard.image_file_created 为 false"
  ]);

  const abortConditionsRecorded = includesAll(currentContents, [
    "abort_if_target_branch_not_main: true",
    "abort_if_target_head_not_b320e39: true",
    "abort_if_vcpchat_worktree_dirty: true",
    "abort_if_dependency_install_required: true",
    "abort_if_env_or_secret_prompt_appears: true",
    "abort_if_plugin_api_dailynote_or_memory_action_requested: true"
  ]);

  const sideEffectGuardRecorded = includesAll(currentContents, [
    "runtime_smoke_test_performed: false",
    "app_launch_performed: false",
    "renderer_devtools_used: false",
    "plugin_called: false",
    "api_called: false",
    "daily_note_called: false",
    "vcp_memory_written: false",
    "disk_write_performed: false",
    "image_created: false",
    "dependency_changed: false",
    "package_manifest_changed: false",
    "lockfile_changed: false",
    "env_or_secret_file_read: false",
    "secret_value_copied: false",
    "raw_local_path_saved: false",
    "vcpchat_pushed: false",
    "github_release_performed: false"
  ]);

  const forbiddenTrueKeys = [
    "hard_authorization_granted_by_this_phase",
    "app_launch_authorized_by_this_phase",
    "runtime_smoke_test_authorized_by_this_phase",
    "runtime_smoke_test_performed",
    "app_launch_performed",
    "renderer_devtools_used",
    "plugin_called",
    "api_called",
    "daily_note_called",
    "vcp_memory_written",
    "disk_write_performed",
    "image_created",
    "dependency_changed",
    "package_manifest_changed",
    "lockfile_changed",
    "env_or_secret_file_read",
    "secret_value_copied",
    "raw_local_path_saved",
    "vcpchat_pushed",
    "github_release_performed"
  ];
  const noForbiddenTrue = excludesExactTrueFlags(currentContents, forbiddenTrueKeys);

  const noRawLocalPath = excludesAll(currentContents, [
    "A:\\VCP",
    "A:/VCP",
    "C:\\Users",
    "C:/Users"
  ]);

  const checklistCurrent = includesAll(checklist, [
    "## v7.28 VCPChat Runtime Smoke Test Execution Preflight 检查",
    "docs/180_v7_28_vcpchat_runtime_smoke_test_execution_preflight.md",
    "review_console/embed_contract/vcpchat_runtime_smoke_test_execution_preflight.md",
    "tests/schema_examples/v7_28_vcpchat_runtime_smoke_test_execution_preflight.example.yaml",
    "scripts/validate_v7_28_vcpchat_runtime_smoke_test_execution_preflight.js",
    "current_head: 683ff22",
    "target_head_short=b320e39",
    "npm run start:desktop:utf8",
    "runtime_smoke_test_performed=false"
  ]);

  assert(phaseRecorded, "v7.28 phase must be recorded.");
  assert(authorizationGateRecorded, "v7.28 authorization gate must be recorded.");
  assert(targetRecorded, "v7.28 target baseline must be recorded.");
  assert(commandsRecorded, "v7.28 candidate commands must be recorded.");
  assert(runtimeAssertionsRecorded, "v7.28 runtime assertions must be recorded.");
  assert(abortConditionsRecorded, "v7.28 abort conditions must be recorded.");
  assert(sideEffectGuardRecorded, "v7.28 side effect guard must be recorded.");
  assert(noForbiddenTrue, "v7.28 must not set forbidden side-effect flags to true.");
  assert(noRawLocalPath, "v7.28 must not save raw local VCP or user paths.");
  assert(checklistCurrent, "validation checklist must include v7.28 checks.");

  process.stdout.write(`${JSON.stringify({
    passed: true,
    v7_28_runtime_smoke_test_execution_preflight: {
      phase_recorded: phaseRecorded,
      authorization_gate_recorded: authorizationGateRecorded,
      target_recorded: targetRecorded,
      commands_recorded: commandsRecorded,
      runtime_assertions_recorded: runtimeAssertionsRecorded,
      abort_conditions_recorded: abortConditionsRecorded,
      side_effect_guard_recorded: sideEffectGuardRecorded,
      no_forbidden_true_flags: noForbiddenTrue,
      no_raw_local_path: noRawLocalPath,
      checklist_current: checklistCurrent,
      target_head_short: "b320e39",
      candidate_launch_command: "npm run start:desktop:utf8",
      runtime_smoke_test_performed: false,
      next_safe_phase: "v7.29 VCPChat Runtime Smoke Test Execution Record"
    }
  }, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
}
