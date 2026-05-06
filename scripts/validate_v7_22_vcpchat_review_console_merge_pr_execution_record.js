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
    "docs/174_v7_22_vcpchat_review_console_merge_pr_execution_record.md",
    "review_console/embed_contract/vcpchat_review_console_merge_pr_execution_record.md",
    "tests/schema_examples/v7_22_vcpchat_review_console_merge_pr_execution_record.example.yaml",
    "scripts/validate_v7_22_vcpchat_review_console_merge_pr_execution_record.js",
    "tests/validation_checklist.md",
    "docs/173_v7_21_vcpchat_review_console_merge_authorization_preflight.md"
  ];
  const missingFiles = requiredFiles.filter((relativePath) => !exists(relativePath));
  assert(missingFiles.length === 0, `Missing v7.22 merge PR execution record files: ${missingFiles.join(", ")}`);

  const currentRecordFiles = [
    "docs/174_v7_22_vcpchat_review_console_merge_pr_execution_record.md",
    "review_console/embed_contract/vcpchat_review_console_merge_pr_execution_record.md",
    "tests/schema_examples/v7_22_vcpchat_review_console_merge_pr_execution_record.example.yaml"
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
    "v7.22 vcpchat review console merge pr execution record",
    "current_head: 0a06036",
    "head_commit_short: 0a06036",
    "docs/173_v7_21_vcpchat_review_console_merge_authorization_preflight.md",
    "v7.23 VCPChat Review Console Post-merge Record"
  ]);

  const authorizationRecorded = includesAll(contents, [
    "explicit_user_authorization_received: true",
    "我明确授权以 squash 方式 merge VCPChat PR #34，且不删除 feature branch。",
    "gh pr merge 34 --squash --delete-branch=false",
    "command_result: success",
    "merge_method: squash",
    "feature_branch_delete_requested: false",
    "feature_branch_deleted: false"
  ]);

  const mergeResultRecorded = includesAll(contents, [
    "pr_state_after: MERGED",
    "merged_at_utc: \"2026-05-06T06:32:52Z\"",
    "source_head_branch: codex/image-lab-review-console-bridge",
    "source_head_commit_short: 426a2a9",
    "source_head_commit_oid: 426a2a9204b52d5434ac005c716738c713aaa7ae",
    "previous_remote_main_short: c97ff0c",
    "remote_main_after_merge_short: b320e39",
    "remote_main_after_merge_oid: b320e39ffa527a81aca65c9228c20936a04f5ed8",
    "feature_branch_remote_still_exists: true"
  ]);

  const localStateRecorded = includesAll(contents, [
    "vcpchat_current_local_branch: codex/image-lab-review-console-bridge",
    "vcpchat_current_local_head_short: 426a2a9",
    "local_main_sync_performed_by_this_phase: false",
    "local_origin_main_fetch_performed_by_this_phase: false",
    "local_branch_cleanup_performed_by_this_phase: false",
    "本地 main / origin/main 同步应作为后续独立阶段处理"
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
    "pr_merge_performed: true",
    "feature_branch_deleted: false",
    "vcpchat_code_modified_by_this_phase: false",
    "github_release_performed: false",
    "tag_created_by_this_phase: false"
  ]);

  const nextGateRecorded = includesAll(contents, [
    "merge_complete: true",
    "post_merge_record_required: true",
    "local_vcpchat_main_sync_required: true",
    "runtime_smoke_test_not_performed: true",
    "release_requires_separate_authorization: true",
    "不代表本地 VCPChat `main` 已同步"
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
    "feature_branch_deleted",
    "vcpchat_code_modified_by_this_phase",
    "github_release_performed",
    "tag_created_by_this_phase",
    "local_main_sync_performed_by_this_phase",
    "local_origin_main_fetch_performed_by_this_phase",
    "local_branch_cleanup_performed_by_this_phase"
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
    "## v7.22 VCPChat Review Console Merge PR Execution Record 检查",
    "docs/174_v7_22_vcpchat_review_console_merge_pr_execution_record.md",
    "review_console/embed_contract/vcpchat_review_console_merge_pr_execution_record.md",
    "tests/schema_examples/v7_22_vcpchat_review_console_merge_pr_execution_record.example.yaml",
    "scripts/validate_v7_22_vcpchat_review_console_merge_pr_execution_record.js",
    "pr_state_after=MERGED",
    "remote_main_after_merge_short=b320e39",
    "feature_branch_deleted=false",
    "local_main_sync_performed_by_this_phase=false"
  ]);

  assert(phaseRecorded, "v7.22 phase and baseline must be recorded.");
  assert(authorizationRecorded, "v7.22 must record authorization and command.");
  assert(mergeResultRecorded, "v7.22 must record merge result.");
  assert(localStateRecorded, "v7.22 must record local repository state.");
  assert(sideEffectGuardRecorded, "v7.22 must record side effect guard.");
  assert(nextGateRecorded, "v7.22 must record next gate.");
  assert(noForbiddenTrue, "v7.22 must not set forbidden side-effect flags to true.");
  assert(noRawLocalPath, "v7.22 must not save raw local VCP or user paths.");
  assert(checklistCurrent, "validation checklist must include v7.22 checks.");

  process.stdout.write(`${JSON.stringify({
    passed: true,
    v7_22_merge_pr_execution_record: {
      phase_recorded: phaseRecorded,
      authorization_recorded: authorizationRecorded,
      merge_result_recorded: mergeResultRecorded,
      local_state_recorded: localStateRecorded,
      side_effect_guard_recorded: sideEffectGuardRecorded,
      next_gate_recorded: nextGateRecorded,
      no_forbidden_true_flags: noForbiddenTrue,
      no_raw_local_path: noRawLocalPath,
      checklist_current: checklistCurrent,
      pr_number: 34,
      pr_state_after: "MERGED",
      remote_main_after_merge_short: "b320e39",
      feature_branch_deleted: false,
      next_safe_phase: "v7.23 VCPChat Review Console Post-merge Record"
    }
  }, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
}
