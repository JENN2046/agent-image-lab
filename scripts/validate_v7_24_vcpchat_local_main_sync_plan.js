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
    "docs/176_v7_24_vcpchat_local_main_sync_plan.md",
    "review_console/embed_contract/vcpchat_local_main_sync_plan.md",
    "tests/schema_examples/v7_24_vcpchat_local_main_sync_plan.example.yaml",
    "scripts/validate_v7_24_vcpchat_local_main_sync_plan.js",
    "tests/validation_checklist.md",
    "docs/175_v7_23_vcpchat_review_console_post_merge_record.md"
  ];
  const missing = requiredFiles.filter((relativePath) => !exists(relativePath));
  assert(missing.length === 0, `Missing v7.24 local main sync plan files: ${missing.join(", ")}`);

  const currentFiles = [
    "docs/176_v7_24_vcpchat_local_main_sync_plan.md",
    "review_console/embed_contract/vcpchat_local_main_sync_plan.md",
    "tests/schema_examples/v7_24_vcpchat_local_main_sync_plan.example.yaml"
  ];
  const contents = requiredFiles
    .filter((relativePath) => !relativePath.endsWith(".js"))
    .map((relativePath) => read(relativePath))
    .join("\n");
  const currentContents = currentFiles.map((relativePath) => read(relativePath)).join("\n");
  const checklist = read("tests/validation_checklist.md");

  const phaseRecorded = includesAll(contents, [
    "v7.24 vcpchat local main sync plan",
    "current_head: ae7e5d6",
    "head_commit_short: ae7e5d6",
    "docs/175_v7_23_vcpchat_review_console_post_merge_record.md",
    "v7.25 VCPChat Local Main Sync Execution Preflight"
  ]);

  const syncProblemRecorded = includesAll(contents, [
    "current_local_branch: codex/image-lab-review-console-bridge",
    "current_local_head_short: 426a2a9",
    "local_main_head_short: 426a2a9",
    "local_origin_main_head_short_before_fetch: c97ff0c",
    "remote_main_head_short_observed_via_ls_remote: b320e39",
    "remote_feature_branch_head_short_observed_via_ls_remote: 426a2a9",
    "merge_method: squash"
  ]);

  const strategyRecorded = includesAll(contents, [
    "strategy_name: backup_then_realign_local_main_to_origin_main",
    "future_execution_requires_explicit_authorization: true",
    "preserve_direct_commit_before_realignment: true",
    "preserve_feature_branch: true",
    "git branch backup/vcpchat-main-before-review-console-sync-20260506 main",
    "git fetch origin main codex/image-lab-review-console-bridge",
    "git branch -f main origin/main",
    "git switch main",
    "git pull --ff-only",
    "直接 pull --ff-only 很可能失败"
  ]);

  const stopAndRollbackRecorded = includesAll(contents, [
    "stop_if_worktree_dirty: true",
    "stop_if_backup_branch_already_exists: true",
    "stop_if_remote_main_not_b320e39: true",
    "backup_branch_required_before_main_realign: true",
    "recover_local_main_from_backup_if_needed",
    "force_push_allowed: false",
    "delete_branch_allowed_by_this_phase: false"
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
    "## v7.24 VCPChat Local Main Sync Plan 检查",
    "docs/176_v7_24_vcpchat_local_main_sync_plan.md",
    "review_console/embed_contract/vcpchat_local_main_sync_plan.md",
    "tests/schema_examples/v7_24_vcpchat_local_main_sync_plan.example.yaml",
    "scripts/validate_v7_24_vcpchat_local_main_sync_plan.js",
    "backup_then_realign_local_main_to_origin_main",
    "local_main_sync_performed=false",
    "branch_pointer_changed_by_this_phase=false"
  ]);

  assert(phaseRecorded, "v7.24 phase must be recorded.");
  assert(syncProblemRecorded, "v7.24 sync problem must be recorded.");
  assert(strategyRecorded, "v7.24 strategy must be recorded.");
  assert(stopAndRollbackRecorded, "v7.24 stop and rollback plan must be recorded.");
  assert(sideEffectGuardRecorded, "v7.24 side effect guard must be recorded.");
  assert(noForbiddenTrue, "v7.24 must not set forbidden side-effect flags to true.");
  assert(noRawLocalPath, "v7.24 must not save raw local VCP or user paths.");
  assert(checklistCurrent, "validation checklist must include v7.24 checks.");

  process.stdout.write(`${JSON.stringify({
    passed: true,
    v7_24_local_main_sync_plan: {
      phase_recorded: phaseRecorded,
      sync_problem_recorded: syncProblemRecorded,
      strategy_recorded: strategyRecorded,
      stop_and_rollback_recorded: stopAndRollbackRecorded,
      side_effect_guard_recorded: sideEffectGuardRecorded,
      no_forbidden_true_flags: noForbiddenTrue,
      no_raw_local_path: noRawLocalPath,
      checklist_current: checklistCurrent,
      sync_strategy: "backup_then_realign_local_main_to_origin_main",
      local_main_sync_performed: false,
      next_safe_phase: "v7.25 VCPChat Local Main Sync Execution Preflight"
    }
  }, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
}
