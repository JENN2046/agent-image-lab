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

function main() {
  const requiredFiles = [
    "docs/179_v7_27_vcpchat_runtime_smoke_test_preflight.md",
    "review_console/embed_contract/vcpchat_runtime_smoke_test_preflight.md",
    "tests/schema_examples/v7_27_vcpchat_runtime_smoke_test_preflight.example.yaml",
    "scripts/validate_v7_27_vcpchat_runtime_smoke_test_preflight.js",
    "tests/validation_checklist.md",
    "docs/178_v7_26_vcpchat_local_main_sync_execution_record.md"
  ];
  const missing = requiredFiles.filter((relativePath) => !exists(relativePath));
  assert(missing.length === 0, `Missing v7.27 runtime smoke test preflight files: ${missing.join(", ")}`);

  const currentFiles = [
    "docs/179_v7_27_vcpchat_runtime_smoke_test_preflight.md",
    "review_console/embed_contract/vcpchat_runtime_smoke_test_preflight.md",
    "tests/schema_examples/v7_27_vcpchat_runtime_smoke_test_preflight.example.yaml"
  ];
  const contents = requiredFiles
    .filter((relativePath) => !relativePath.endsWith(".js"))
    .map((relativePath) => read(relativePath))
    .join("\n");
  const currentContents = currentFiles.map((relativePath) => read(relativePath)).join("\n");
  const checklist = read("tests/validation_checklist.md");

  const phaseRecorded = includesAll(contents, [
    "v7.27 vcpchat runtime smoke test preflight",
    "current_head: 5bdde3a",
    "head_commit_short: 5bdde3a",
    "docs/178_v7_26_vcpchat_local_main_sync_execution_record.md",
    "v7.28 VCPChat Runtime Smoke Test Execution Record"
  ]);

  const baselineRecorded = includesAll(contents, [
    "current_local_branch: main",
    "current_local_head_short: b320e39",
    "local_main_head_short: b320e39",
    "local_origin_main_head_short: b320e39",
    "worktree_clean: true",
    "bridge_files_present: true",
    "modules/ipc/imageLabReviewHandlers.js",
    "modules/renderer/imageLabReviewMount.js"
  ]);

  const launchScriptsRecorded = includesAll(contents, [
    "package_name: vcp-chat-desktop",
    "package_scripts_read_only_inspected: true",
    "npm run start:desktop:utf8",
    "npm run start:desktop",
    "npm run start:utf8",
    "npm start",
    "recommended_future_launch_script: npm run start:desktop:utf8",
    "script_execution_performed_by_this_phase: false"
  ]);

  const smokeScopeRecorded = includesAll(contents, [
    "preload_bridge_presence_check",
    "renderer_mount_presence_check",
    "draft_generation_guard_check",
    "ipc_ack_contract_check",
    "window.imageLabReview.loadSession 是函数",
    "prototype_guard.api_called 为 false",
    "prototype_guard.daily_note_called 为 false",
    "prototype_guard.vcp_plugin_called 为 false",
    "prototype_guard.image_file_created 为 false"
  ]);

  const candidateCommandsRecorded = includesAll(contents, [
    "node --check main.js",
    "node --check modules\\ipc\\imageLabReviewHandlers.js",
    "node --check preloads\\chat.js",
    "node --check modules\\renderer\\imageLabReviewMount.js",
    "launch_command_candidates",
    "app_launch_requires_explicit_authorization: true"
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
    "app_launch_performed: false",
    "runtime_smoke_test_performed: false",
    "renderer_devtools_used: false",
    "branch_deleted: false",
    "github_release_performed: false"
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
    "app_launch_performed",
    "runtime_smoke_test_performed",
    "renderer_devtools_used",
    "branch_deleted",
    "github_release_performed",
    "tag_created_by_this_phase"
  ];
  const noForbiddenTrue = excludesAll(
    currentContents,
    forbiddenTrueKeys.map((key) => `${key}: ${"true"}`)
  );

  const noRawLocalPath = excludesAll(currentContents, [
    "A:\\VCP",
    "A:/VCP",
    "C:\\Users",
    "C:/Users"
  ]);

  const checklistCurrent = includesAll(checklist, [
    "## v7.27 VCPChat Runtime Smoke Test Preflight 检查",
    "docs/179_v7_27_vcpchat_runtime_smoke_test_preflight.md",
    "review_console/embed_contract/vcpchat_runtime_smoke_test_preflight.md",
    "tests/schema_examples/v7_27_vcpchat_runtime_smoke_test_preflight.example.yaml",
    "scripts/validate_v7_27_vcpchat_runtime_smoke_test_preflight.js",
    "current_local_head_short=b320e39",
    "recommended_future_launch_script=npm run start:desktop:utf8",
    "runtime_smoke_test_performed=false"
  ]);

  assert(phaseRecorded, "v7.27 phase must be recorded.");
  assert(baselineRecorded, "v7.27 VCPChat baseline must be recorded.");
  assert(launchScriptsRecorded, "v7.27 launch scripts must be recorded.");
  assert(smokeScopeRecorded, "v7.27 smoke scope must be recorded.");
  assert(candidateCommandsRecorded, "v7.27 candidate commands must be recorded.");
  assert(sideEffectGuardRecorded, "v7.27 side effect guard must be recorded.");
  assert(noForbiddenTrue, "v7.27 must not set forbidden side-effect flags to true.");
  assert(noRawLocalPath, "v7.27 must not save raw local VCP or user paths.");
  assert(checklistCurrent, "validation checklist must include v7.27 checks.");

  process.stdout.write(`${JSON.stringify({
    passed: true,
    v7_27_runtime_smoke_test_preflight: {
      phase_recorded: phaseRecorded,
      baseline_recorded: baselineRecorded,
      launch_scripts_recorded: launchScriptsRecorded,
      smoke_scope_recorded: smokeScopeRecorded,
      candidate_commands_recorded: candidateCommandsRecorded,
      side_effect_guard_recorded: sideEffectGuardRecorded,
      no_forbidden_true_flags: noForbiddenTrue,
      no_raw_local_path: noRawLocalPath,
      checklist_current: checklistCurrent,
      current_local_head_short: "b320e39",
      recommended_future_launch_script: "npm run start:desktop:utf8",
      runtime_smoke_test_performed: false,
      next_safe_phase: "v7.28 VCPChat Runtime Smoke Test Execution Record"
    }
  }, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
}
