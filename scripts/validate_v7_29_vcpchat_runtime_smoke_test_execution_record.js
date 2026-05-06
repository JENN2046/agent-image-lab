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
    "docs/181_v7_29_vcpchat_runtime_smoke_test_execution_record.md",
    "review_console/embed_contract/vcpchat_runtime_smoke_test_execution_record.md",
    "tests/schema_examples/v7_29_vcpchat_runtime_smoke_test_execution_record.example.yaml",
    "scripts/validate_v7_29_vcpchat_runtime_smoke_test_execution_record.js",
    "tests/validation_checklist.md",
    "docs/180_v7_28_vcpchat_runtime_smoke_test_execution_preflight.md"
  ];
  const missing = requiredFiles.filter((relativePath) => !exists(relativePath));
  assert(missing.length === 0, `Missing v7.29 runtime smoke test execution record files: ${missing.join(", ")}`);

  const currentFiles = [
    "docs/181_v7_29_vcpchat_runtime_smoke_test_execution_record.md",
    "review_console/embed_contract/vcpchat_runtime_smoke_test_execution_record.md",
    "tests/schema_examples/v7_29_vcpchat_runtime_smoke_test_execution_record.example.yaml"
  ];
  const contents = requiredFiles
    .filter((relativePath) => !relativePath.endsWith(".js"))
    .map((relativePath) => read(relativePath))
    .join("\n");
  const currentContents = currentFiles.map((relativePath) => read(relativePath)).join("\n");
  const checklist = read("tests/validation_checklist.md");

  const phaseRecorded = includesAll(contents, [
    "v7.29 vcpchat runtime smoke test execution record",
    "current_head: 193c2b4",
    "head_commit_short: 193c2b4",
    "docs/180_v7_28_vcpchat_runtime_smoke_test_execution_preflight.md",
    "v7.30 VCPChat Runtime Smoke Test Revised Authorization Gate"
  ]);

  const authorizationRecorded = includesAll(currentContents, [
    "app_launch_authorized_by_user: true",
    "requested_launch_command: npm run start:desktop:utf8",
    "target_branch: main",
    "target_head_short: b320e39"
  ]);

  const preLaunchRecorded = includesAll(currentContents, [
    "target_branch_is_main: true",
    "target_head_is_b320e39: true",
    "origin_main_head_is_b320e39: true",
    "vcpchat_worktree_clean: true",
    "electron_dependency_present: true",
    "required_bridge_files_present: true",
    "dependency_install_performed: false",
    "env_or_secret_file_read: false"
  ]);

  const staticChecksRecorded = includesAll(currentContents, [
    "node_check_main_js: passed",
    "node_check_image_lab_review_handlers: passed",
    "node_check_chat_preload: passed",
    "node_check_image_lab_review_mount: passed"
  ]);

  const blockedRecorded = includesAll(currentContents, [
    "status: blocked_before_app_launch",
    "app_launch_performed: false",
    "runtime_smoke_test_performed: false",
    "启动前安全停止",
    "常规启动路径可能触发模型拉取、WebSocket 或设置读取"
  ]);

  const runtimeNotPerformedRecorded = includesAll(currentContents, [
    "window_image_lab_review_checked: false",
    "image_lab_review_mount_checked: false",
    "window_image_lab_review_runtime_checked: false",
    "review_session_draft_checked: false",
    "image_case_draft_checked: false",
    "memory_delta_draft_checked: false",
    "prototype_guard_checked: false"
  ]);

  const sideEffectGuardRecorded = includesAll(currentContents, [
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
    "branch_deleted: false",
    "github_release_performed: false"
  ]);

  const forbiddenTrueKeys = [
    "app_launch_performed",
    "runtime_smoke_test_performed",
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
    "## v7.29 VCPChat Runtime Smoke Test Execution Record 检查",
    "docs/181_v7_29_vcpchat_runtime_smoke_test_execution_record.md",
    "review_console/embed_contract/vcpchat_runtime_smoke_test_execution_record.md",
    "tests/schema_examples/v7_29_vcpchat_runtime_smoke_test_execution_record.example.yaml",
    "scripts/validate_v7_29_vcpchat_runtime_smoke_test_execution_record.js",
    "status=blocked_before_app_launch",
    "app_launch_performed=false",
    "runtime_smoke_test_performed=false",
    "v7.30 VCPChat Runtime Smoke Test Revised Authorization Gate"
  ]);

  assert(phaseRecorded, "v7.29 phase must be recorded.");
  assert(authorizationRecorded, "v7.29 authorization must be recorded.");
  assert(preLaunchRecorded, "v7.29 pre-launch checks must be recorded.");
  assert(staticChecksRecorded, "v7.29 static checks must be recorded.");
  assert(blockedRecorded, "v7.29 blocked-before-launch result must be recorded.");
  assert(runtimeNotPerformedRecorded, "v7.29 runtime checks must be marked not performed.");
  assert(sideEffectGuardRecorded, "v7.29 side effect guard must be recorded.");
  assert(noForbiddenTrue, "v7.29 must not set forbidden side-effect flags to true.");
  assert(noRawLocalPath, "v7.29 must not save raw local VCP or user paths.");
  assert(checklistCurrent, "validation checklist must include v7.29 checks.");

  process.stdout.write(`${JSON.stringify({
    passed: true,
    v7_29_runtime_smoke_test_execution_record: {
      phase_recorded: phaseRecorded,
      authorization_recorded: authorizationRecorded,
      pre_launch_recorded: preLaunchRecorded,
      static_checks_recorded: staticChecksRecorded,
      blocked_recorded: blockedRecorded,
      runtime_not_performed_recorded: runtimeNotPerformedRecorded,
      side_effect_guard_recorded: sideEffectGuardRecorded,
      no_forbidden_true_flags: noForbiddenTrue,
      no_raw_local_path: noRawLocalPath,
      checklist_current: checklistCurrent,
      target_head_short: "b320e39",
      app_launch_performed: false,
      runtime_smoke_test_performed: false,
      next_safe_phase: "v7.30 VCPChat Runtime Smoke Test Revised Authorization Gate"
    }
  }, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
}
