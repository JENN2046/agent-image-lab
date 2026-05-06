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
    "docs/182_v7_30_vcpchat_runtime_smoke_test_partial_execution_record.md",
    "review_console/embed_contract/vcpchat_runtime_smoke_test_partial_execution_record.md",
    "tests/schema_examples/v7_30_vcpchat_runtime_smoke_test_partial_execution_record.example.yaml",
    "scripts/validate_v7_30_vcpchat_runtime_smoke_test_partial_execution_record.js",
    "tests/validation_checklist.md",
    "docs/181_v7_29_vcpchat_runtime_smoke_test_execution_record.md"
  ];
  const missing = requiredFiles.filter((relativePath) => !exists(relativePath));
  assert(missing.length === 0, `Missing v7.30 runtime smoke test partial execution record files: ${missing.join(", ")}`);

  const currentFiles = [
    "docs/182_v7_30_vcpchat_runtime_smoke_test_partial_execution_record.md",
    "review_console/embed_contract/vcpchat_runtime_smoke_test_partial_execution_record.md",
    "tests/schema_examples/v7_30_vcpchat_runtime_smoke_test_partial_execution_record.example.yaml"
  ];
  const contents = requiredFiles
    .filter((relativePath) => !relativePath.endsWith(".js"))
    .map((relativePath) => read(relativePath))
    .join("\n");
  const currentContents = currentFiles.map((relativePath) => read(relativePath)).join("\n");
  const checklist = read("tests/validation_checklist.md");

  const phaseRecorded = includesAll(contents, [
    "v7.30 vcpchat runtime smoke test partial execution record",
    "current_head: 3a23e51",
    "head_commit_short: 3a23e51",
    "docs/181_v7_29_vcpchat_runtime_smoke_test_execution_record.md",
    "v7.31 VCPChat Renderer Global Verification Gate"
  ]);

  const authorizationRecorded = includesAll(currentContents, [
    "normal_vcpchat_startup_settings_read_allowed: true",
    "normal_vcpchat_startup_existing_connection_attempt_allowed: true",
    "review_console_bridge_plugin_call_allowed: false",
    "review_console_bridge_api_call_allowed: false",
    "review_console_bridge_project_file_write_allowed: false"
  ]);

  const preLaunchRecorded = includesAll(currentContents, [
    "target_branch_is_main: true",
    "target_head_is_b320e39: true",
    "origin_main_head_is_b320e39: true",
    "vcpchat_worktree_clean_before_launch: true",
    "electron_dependency_present: true",
    "required_bridge_files_present: true",
    "dependency_install_performed: false",
    "env_or_secret_file_read_by_codex: false"
  ]);

  const staticChecksRecorded = includesAll(currentContents, [
    "node_check_main_js: passed",
    "node_check_image_lab_review_handlers: passed",
    "node_check_chat_preload: passed",
    "node_check_image_lab_review_mount: passed"
  ]);

  const windowSmokeRecorded = includesAll(currentContents, [
    "launch_command_executed: npm run start:desktop:utf8",
    "app_launch_performed: true",
    "electron_process_observed: true",
    "main_window_observed: true",
    "VCPdesktop",
    "VCPChat",
    "launcher_process_tree_closed_after_observation: true"
  ]);

  const rendererPendingRecorded = includesAll(currentContents, [
    "automatic_verification_performed: false",
    "window_image_lab_review_checked: false",
    "image_lab_review_mount_checked: false",
    "window_image_lab_review_runtime_checked: false",
    "review_session_draft_checked: false",
    "image_case_draft_checked: false",
    "memory_delta_draft_checked: false",
    "prototype_guard_checked: false"
  ]);

  const sideEffectRecorded = includesAll(currentContents, [
    "vcpchat_worktree_dirty_after_launch: true",
    "changed_path: .vcp_ready",
    "restored_by_codex: true",
    "vcpchat_worktree_clean_after_restore: true"
  ]);

  const bridgeGuardRecorded = includesAll(currentContents, [
    "bridge_load_session_called: false",
    "bridge_preview_draft_called: false",
    "bridge_submit_draft_called: false",
    "bridge_cancel_called: false",
    "review_console_bridge_plugin_called: false",
    "review_console_bridge_api_called: false",
    "review_console_bridge_daily_note_called: false",
    "review_console_bridge_vcp_memory_written: false",
    "review_console_bridge_disk_write_performed: false",
    "review_console_bridge_image_created: false"
  ]);

  const generalGuardRecorded = includesAll(currentContents, [
    "dependency_changed: false",
    "package_manifest_changed: false",
    "lockfile_changed: false",
    "secret_value_copied: false",
    "raw_local_path_saved: false",
    "vcpchat_pushed: false",
    "branch_deleted: false",
    "github_release_performed: false"
  ]);

  const forbiddenTrueKeys = [
    "bridge_load_session_called",
    "bridge_preview_draft_called",
    "bridge_submit_draft_called",
    "bridge_cancel_called",
    "review_console_bridge_plugin_called",
    "review_console_bridge_api_called",
    "review_console_bridge_daily_note_called",
    "review_console_bridge_vcp_memory_written",
    "review_console_bridge_disk_write_performed",
    "review_console_bridge_image_created",
    "dependency_changed",
    "package_manifest_changed",
    "lockfile_changed",
    "secret_value_copied",
    "raw_local_path_saved",
    "vcpchat_pushed",
    "branch_deleted",
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
    "## v7.30 VCPChat Runtime Smoke Test Partial Execution Record 检查",
    "docs/182_v7_30_vcpchat_runtime_smoke_test_partial_execution_record.md",
    "review_console/embed_contract/vcpchat_runtime_smoke_test_partial_execution_record.md",
    "tests/schema_examples/v7_30_vcpchat_runtime_smoke_test_partial_execution_record.example.yaml",
    "scripts/validate_v7_30_vcpchat_runtime_smoke_test_partial_execution_record.js",
    "status=partial_pass_window_smoke_only",
    "app_launch_performed=true",
    "renderer global 自动验证未完成",
    ".vcp_ready"
  ]);

  assert(phaseRecorded, "v7.30 phase must be recorded.");
  assert(authorizationRecorded, "v7.30 revised authorization must be recorded.");
  assert(preLaunchRecorded, "v7.30 pre-launch checks must be recorded.");
  assert(staticChecksRecorded, "v7.30 static checks must be recorded.");
  assert(windowSmokeRecorded, "v7.30 window smoke result must be recorded.");
  assert(rendererPendingRecorded, "v7.30 renderer global verification pending state must be recorded.");
  assert(sideEffectRecorded, "v7.30 startup side effect must be recorded.");
  assert(bridgeGuardRecorded, "v7.30 Review Console bridge guard must be recorded.");
  assert(generalGuardRecorded, "v7.30 general guard must be recorded.");
  assert(noForbiddenTrue, "v7.30 must not set bridge or forbidden side-effect flags to true.");
  assert(noRawLocalPath, "v7.30 must not save raw local VCP or user paths.");
  assert(checklistCurrent, "validation checklist must include v7.30 checks.");

  process.stdout.write(`${JSON.stringify({
    passed: true,
    v7_30_runtime_smoke_test_partial_execution_record: {
      phase_recorded: phaseRecorded,
      revised_authorization_recorded: authorizationRecorded,
      pre_launch_recorded: preLaunchRecorded,
      static_checks_recorded: staticChecksRecorded,
      window_smoke_recorded: windowSmokeRecorded,
      renderer_global_pending_recorded: rendererPendingRecorded,
      startup_side_effect_recorded: sideEffectRecorded,
      bridge_guard_recorded: bridgeGuardRecorded,
      general_guard_recorded: generalGuardRecorded,
      no_forbidden_true_flags: noForbiddenTrue,
      no_raw_local_path: noRawLocalPath,
      checklist_current: checklistCurrent,
      app_launch_performed: true,
      window_level_smoke: "passed",
      renderer_global_smoke: "not_completed",
      next_safe_phase: "v7.31 VCPChat Renderer Global Verification Gate"
    }
  }, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
}
