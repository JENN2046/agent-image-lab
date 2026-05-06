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
    "docs/178_v7_26_vcpchat_local_main_sync_execution_record.md",
    "review_console/embed_contract/vcpchat_local_main_sync_execution_record.md",
    "tests/schema_examples/v7_26_vcpchat_local_main_sync_execution_record.example.yaml",
    "scripts/validate_v7_26_vcpchat_local_main_sync_execution_record.js",
    "tests/validation_checklist.md",
    "docs/177_v7_25_vcpchat_local_main_sync_execution_preflight.md"
  ];
  const missing = requiredFiles.filter((relativePath) => !exists(relativePath));
  assert(missing.length === 0, `Missing v7.26 local main sync execution record files: ${missing.join(", ")}`);

  const currentFiles = [
    "docs/178_v7_26_vcpchat_local_main_sync_execution_record.md",
    "review_console/embed_contract/vcpchat_local_main_sync_execution_record.md",
    "tests/schema_examples/v7_26_vcpchat_local_main_sync_execution_record.example.yaml"
  ];
  const contents = requiredFiles
    .filter((relativePath) => !relativePath.endsWith(".js"))
    .map((relativePath) => read(relativePath))
    .join("\n");
  const currentContents = currentFiles.map((relativePath) => read(relativePath)).join("\n");
  const checklist = read("tests/validation_checklist.md");

  const phaseRecorded = includesAll(contents, [
    "v7.26 vcpchat local main sync execution record",
    "current_head: e5df41d",
    "head_commit_short: e5df41d",
    "docs/177_v7_25_vcpchat_local_main_sync_execution_preflight.md",
    "v7.27 VCPChat Runtime Smoke Test Preflight"
  ]);

  const commandRecorded = includesAll(contents, [
    "explicit_user_authorization_received: true",
    "git branch backup/vcpchat-main-before-review-console-sync-20260506 main",
    "git fetch origin main:refs/remotes/origin/main codex/image-lab-review-console-bridge:refs/remotes/origin/codex/image-lab-review-console-bridge",
    "git branch -f main origin/main",
    "git switch main",
    "command_result: success"
  ]);

  const afterSyncRecorded = includesAll(contents, [
    "current_local_branch: main",
    "current_local_head_short: b320e39",
    "local_main_head_short: b320e39",
    "local_origin_main_head_short_after_fetch: b320e39",
    "backup_branch_head_short: 426a2a9",
    "feature_branch_head_short: 426a2a9",
    "worktree_clean_after_sync: true"
  ]);

  const preservationRecorded = includesAll(contents, [
    "backup_branch_created: true",
    "feature_branch_preserved: true",
    "backup_branch_deleted: false",
    "feature_branch_deleted: false",
    "local_direct_commit_preserved_in_backup_branch: true",
    "local_direct_commit_preserved_in_feature_branch: true"
  ]);

  const allowedSyncEffectsRecorded = includesAll(currentContents, [
    "git_fetch_performed: true",
    "git_switch_performed: true",
    "local_main_sync_performed: true",
    "branch_pointer_changed_by_this_phase: true",
    "backup_branch_created_by_this_phase: true"
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
    "## v7.26 VCPChat Local Main Sync Execution Record 检查",
    "docs/178_v7_26_vcpchat_local_main_sync_execution_record.md",
    "review_console/embed_contract/vcpchat_local_main_sync_execution_record.md",
    "tests/schema_examples/v7_26_vcpchat_local_main_sync_execution_record.example.yaml",
    "scripts/validate_v7_26_vcpchat_local_main_sync_execution_record.js",
    "local_main_head_short=b320e39",
    "backup_branch_created=true",
    "feature_branch_deleted=false"
  ]);

  assert(phaseRecorded, "v7.26 phase must be recorded.");
  assert(commandRecorded, "v7.26 commands must be recorded.");
  assert(afterSyncRecorded, "v7.26 after-sync state must be recorded.");
  assert(preservationRecorded, "v7.26 preservation guarantees must be recorded.");
  assert(allowedSyncEffectsRecorded, "v7.26 allowed sync effects must be recorded.");
  assert(sideEffectGuardRecorded, "v7.26 side effect guard must be recorded.");
  assert(noForbiddenTrue, "v7.26 must not set forbidden side-effect flags to true.");
  assert(noRawLocalPath, "v7.26 must not save raw local VCP or user paths.");
  assert(checklistCurrent, "validation checklist must include v7.26 checks.");

  process.stdout.write(`${JSON.stringify({
    passed: true,
    v7_26_local_main_sync_execution_record: {
      phase_recorded: phaseRecorded,
      command_recorded: commandRecorded,
      after_sync_recorded: afterSyncRecorded,
      preservation_recorded: preservationRecorded,
      allowed_sync_effects_recorded: allowedSyncEffectsRecorded,
      side_effect_guard_recorded: sideEffectGuardRecorded,
      no_forbidden_true_flags: noForbiddenTrue,
      no_raw_local_path: noRawLocalPath,
      checklist_current: checklistCurrent,
      local_main_head_short: "b320e39",
      backup_branch_created: true,
      feature_branch_deleted: false,
      next_safe_phase: "v7.27 VCPChat Runtime Smoke Test Preflight"
    }
  }, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
}
