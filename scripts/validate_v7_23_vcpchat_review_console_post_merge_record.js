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
    "docs/175_v7_23_vcpchat_review_console_post_merge_record.md",
    "review_console/embed_contract/vcpchat_review_console_post_merge_record.md",
    "tests/schema_examples/v7_23_vcpchat_review_console_post_merge_record.example.yaml",
    "scripts/validate_v7_23_vcpchat_review_console_post_merge_record.js",
    "tests/validation_checklist.md",
    "docs/174_v7_22_vcpchat_review_console_merge_pr_execution_record.md"
  ];
  const missing = requiredFiles.filter((relativePath) => !exists(relativePath));
  assert(missing.length === 0, `Missing v7.23 post-merge record files: ${missing.join(", ")}`);

  const currentFiles = [
    "docs/175_v7_23_vcpchat_review_console_post_merge_record.md",
    "review_console/embed_contract/vcpchat_review_console_post_merge_record.md",
    "tests/schema_examples/v7_23_vcpchat_review_console_post_merge_record.example.yaml"
  ];
  const contents = requiredFiles
    .filter((relativePath) => !relativePath.endsWith(".js"))
    .map((relativePath) => read(relativePath))
    .join("\n");
  const currentContents = currentFiles.map((relativePath) => read(relativePath)).join("\n");
  const checklist = read("tests/validation_checklist.md");

  const phaseRecorded = includesAll(contents, [
    "v7.23 vcpchat review console post-merge record",
    "current_head: 534704f",
    "head_commit_short: 534704f",
    "docs/174_v7_22_vcpchat_review_console_merge_pr_execution_record.md",
    "v7.24 VCPChat Local Main Sync Plan"
  ]);

  const remoteMergeRecorded = includesAll(contents, [
    "pr_state: MERGED",
    "merge_method: squash",
    "merge_commit_short: b320e39",
    "remote_main_head_short: b320e39",
    "source_branch_head_short: 426a2a9",
    "remote_feature_branch_still_exists: true"
  ]);

  const localStateRecorded = includesAll(contents, [
    "current_local_branch: codex/image-lab-review-console-bridge",
    "current_local_head_short: 426a2a9",
    "local_main_head_short: 426a2a9",
    "local_origin_main_head_short_before_fetch: c97ff0c",
    "remote_main_observed_via_ls_remote_short: b320e39",
    "local_remote_tracking_main_is_stale: true",
    "local_main_is_not_synced_to_remote_squash_merge: true"
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
    "git_pull_performed: false",
    "branch_deleted: false",
    "github_release_performed: false"
  ]);

  const forbiddenTrueKeys = [
    "plugin_called",
    "api_called",
    "daily_note_called",
    "vcp_memory_written",
    "image_created",
    "local_main_sync_performed",
    "git_fetch_performed",
    "git_pull_performed",
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
    "## v7.23 VCPChat Review Console Post-merge Record 检查",
    "docs/175_v7_23_vcpchat_review_console_post_merge_record.md",
    "review_console/embed_contract/vcpchat_review_console_post_merge_record.md",
    "tests/schema_examples/v7_23_vcpchat_review_console_post_merge_record.example.yaml",
    "scripts/validate_v7_23_vcpchat_review_console_post_merge_record.js",
    "remote_main_head_short=b320e39",
    "local_origin_main_head_short_before_fetch=c97ff0c",
    "local_main_sync_performed=false"
  ]);

  assert(phaseRecorded, "v7.23 phase must be recorded.");
  assert(remoteMergeRecorded, "v7.23 remote merge state must be recorded.");
  assert(localStateRecorded, "v7.23 local VCPChat state must be recorded.");
  assert(sideEffectGuardRecorded, "v7.23 side effect guard must be recorded.");
  assert(noForbiddenTrue, "v7.23 must not set forbidden side-effect flags to true.");
  assert(noRawLocalPath, "v7.23 must not save raw local VCP or user paths.");
  assert(checklistCurrent, "validation checklist must include v7.23 checks.");

  process.stdout.write(`${JSON.stringify({
    passed: true,
    v7_23_post_merge_record: {
      phase_recorded: phaseRecorded,
      remote_merge_recorded: remoteMergeRecorded,
      local_state_recorded: localStateRecorded,
      side_effect_guard_recorded: sideEffectGuardRecorded,
      no_forbidden_true_flags: noForbiddenTrue,
      no_raw_local_path: noRawLocalPath,
      checklist_current: checklistCurrent,
      remote_main_head_short: "b320e39",
      local_main_sync_performed: false,
      next_safe_phase: "v7.24 VCPChat Local Main Sync Plan"
    }
  }, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
}
