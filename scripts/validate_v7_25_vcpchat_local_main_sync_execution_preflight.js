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
    "docs/177_v7_25_vcpchat_local_main_sync_execution_preflight.md",
    "review_console/embed_contract/vcpchat_local_main_sync_execution_preflight.md",
    "tests/schema_examples/v7_25_vcpchat_local_main_sync_execution_preflight.example.yaml",
    "scripts/validate_v7_25_vcpchat_local_main_sync_execution_preflight.js",
    "tests/validation_checklist.md",
    "docs/176_v7_24_vcpchat_local_main_sync_plan.md"
  ];
  const missing = requiredFiles.filter((relativePath) => !exists(relativePath));
  assert(missing.length === 0, `Missing v7.25 local main sync execution preflight files: ${missing.join(", ")}`);

  const currentFiles = [
    "docs/177_v7_25_vcpchat_local_main_sync_execution_preflight.md",
    "review_console/embed_contract/vcpchat_local_main_sync_execution_preflight.md",
    "tests/schema_examples/v7_25_vcpchat_local_main_sync_execution_preflight.example.yaml"
  ];
  const contents = requiredFiles
    .filter((relativePath) => !relativePath.endsWith(".js"))
    .map((relativePath) => read(relativePath))
    .join("\n");
  const currentContents = currentFiles.map((relativePath) => read(relativePath)).join("\n");
  const checklist = read("tests/validation_checklist.md");

  const phaseRecorded = includesAll(contents, [
    "v7.25 vcpchat local main sync execution preflight",
    "current_head: 3e9edfb",
    "head_commit_short: 3e9edfb",
    "docs/176_v7_24_vcpchat_local_main_sync_plan.md",
    "v7.26 VCPChat Local Main Sync Execution Record"
  ]);

  const observationsRecorded = includesAll(contents, [
    "worktree_clean: true",
    "current_local_branch: codex/image-lab-review-console-bridge",
    "current_local_head_short: 426a2a9",
    "current_branch_is_main: false",
    "backup_branch_name: backup/vcpchat-main-before-review-console-sync-20260506",
    "backup_branch_exists: false",
    "local_main_head_short: 426a2a9",
    "local_origin_main_head_short_before_fetch: c97ff0c",
    "remote_main_head_short_observed_via_ls_remote: b320e39",
    "remote_feature_branch_head_short_observed_via_ls_remote: 426a2a9",
    "pr_34_state: MERGED"
  ]);

  const decisionRecorded = includesAll(contents, [
    "sync_execution_candidate: true",
    "sync_execution_ready: true",
    "可以进入一次性同步执行授权点",
    "确认允许创建 backup branch",
    "确认允许 fetch origin main",
    "确认允许将本地 main 指针显式对齐 origin/main"
  ]);

  const commandsRecorded = includesAll(contents, [
    "git branch backup/vcpchat-main-before-review-console-sync-20260506 main",
    "git fetch origin main codex/image-lab-review-console-bridge",
    "git rev-parse --short origin/main",
    "git branch -f main origin/main",
    "git switch main",
    "expected_after_success"
  ]);

  const stopRecorded = includesAll(contents, [
    "stop_if_worktree_dirty: true",
    "stop_if_backup_branch_exists: true",
    "stop_if_remote_main_not_b320e39: true",
    "stop_if_branch_force_update_would_target_current_branch: true",
    "local_main_sync_blocked_until_explicit_execution_authorization: true"
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
    "local_main_sync_performed: false",
    "git_fetch_performed: false",
    "git_switch_performed: false",
    "git_pull_performed: false",
    "branch_pointer_changed_by_this_phase: false",
    "backup_branch_created_by_this_phase: false",
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
    "local_main_sync_performed",
    "git_fetch_performed",
    "git_switch_performed",
    "git_pull_performed",
    "branch_pointer_changed_by_this_phase",
    "backup_branch_created_by_this_phase",
    "branch_deleted",
    "github_release_performed"
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
    "## v7.25 VCPChat Local Main Sync Execution Preflight 检查",
    "docs/177_v7_25_vcpchat_local_main_sync_execution_preflight.md",
    "review_console/embed_contract/vcpchat_local_main_sync_execution_preflight.md",
    "tests/schema_examples/v7_25_vcpchat_local_main_sync_execution_preflight.example.yaml",
    "scripts/validate_v7_25_vcpchat_local_main_sync_execution_preflight.js",
    "sync_execution_ready=true",
    "backup_branch_exists=false",
    "local_main_sync_performed=false"
  ]);

  assert(phaseRecorded, "v7.25 phase must be recorded.");
  assert(observationsRecorded, "v7.25 observations must be recorded.");
  assert(decisionRecorded, "v7.25 decision must be recorded.");
  assert(commandsRecorded, "v7.25 candidate commands must be recorded.");
  assert(stopRecorded, "v7.25 stop conditions must be recorded.");
  assert(sideEffectGuardRecorded, "v7.25 side effect guard must be recorded.");
  assert(noForbiddenTrue, "v7.25 must not set forbidden side-effect flags to true.");
  assert(noRawLocalPath, "v7.25 must not save raw local VCP or user paths.");
  assert(checklistCurrent, "validation checklist must include v7.25 checks.");

  process.stdout.write(`${JSON.stringify({
    passed: true,
    v7_25_local_main_sync_execution_preflight: {
      phase_recorded: phaseRecorded,
      observations_recorded: observationsRecorded,
      decision_recorded: decisionRecorded,
      commands_recorded: commandsRecorded,
      stop_recorded: stopRecorded,
      side_effect_guard_recorded: sideEffectGuardRecorded,
      no_forbidden_true_flags: noForbiddenTrue,
      no_raw_local_path: noRawLocalPath,
      checklist_current: checklistCurrent,
      sync_execution_ready: true,
      backup_branch_exists: false,
      local_main_sync_performed: false,
      next_safe_phase: "v7.26 VCPChat Local Main Sync Execution Record"
    }
  }, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
}
