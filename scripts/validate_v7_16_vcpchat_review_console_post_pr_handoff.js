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
    "docs/168_v7_16_vcpchat_review_console_post_pr_handoff.md",
    "review_console/embed_contract/vcpchat_review_console_post_pr_handoff.md",
    "tests/schema_examples/v7_16_vcpchat_review_console_post_pr_handoff.example.yaml",
    "scripts/validate_v7_16_vcpchat_review_console_post_pr_handoff.js",
    "tests/validation_checklist.md",
    "docs/167_v7_15_vcpchat_review_console_remote_push_authorization.md"
  ];
  const missingFiles = requiredFiles.filter((relativePath) => !exists(relativePath));
  assert(missingFiles.length === 0, `Missing v7.16 post-PR handoff files: ${missingFiles.join(", ")}`);

  const currentRecordFiles = [
    "docs/168_v7_16_vcpchat_review_console_post_pr_handoff.md",
    "review_console/embed_contract/vcpchat_review_console_post_pr_handoff.md",
    "tests/schema_examples/v7_16_vcpchat_review_console_post_pr_handoff.example.yaml"
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
    "v7.16 vcpchat review console post-pr handoff",
    "current_head: 5edd7dc",
    "head_commit_short: 5edd7dc",
    "docs/167_v7_15_vcpchat_review_console_remote_push_authorization.md",
    "v7.17 VCPChat Review Console PR Review Follow-up"
  ]);

  const prStatusRecorded = includesAll(contents, [
    "pr_number: 34",
    "pr_title: \"[codex] add Image Lab Review Console bridge\"",
    "pr_url: \"https://github.com/JENN2046/VCPChat/pull/34\"",
    "pr_state: OPEN",
    "pr_is_draft: true",
    "base_branch: main",
    "base_head_short: c97ff0c",
    "head_branch: codex/image-lab-review-console-bridge",
    "head_commit_short: 426a2a9",
    "pr_created: true",
    "pr_ready_for_review: false",
    "pr_merge_performed: false",
    "vcpchat_main_updated_by_this_phase: false"
  ]);

  const branchProtectionRecorded = includesAll(contents, [
    "direct_push_to_main_attempted_after_explicit_authorization: true",
    "direct_push_to_main_succeeded: false",
    "direct_push_rejected_by_remote_protection: true",
    "VCPChat main 是受保护分支，远端要求通过 pull request 修改。",
    "fallback_branch_created_after_user_authorization: true",
    "fallback_branch_name: codex/image-lab-review-console-bridge",
    "fallback_branch_pushed: true",
    "draft_pr_opened: true"
  ]);

  const prScopeRecorded = includesAll(contents, [
    "candidate_commit: 426a2a9",
    "changed_files_only_inside_allowed_scope: true",
    "main.js",
    "modules/ipc/imageLabReviewHandlers.js",
    "preloads/chat.js",
    "main.html",
    "modules/renderer/imageLabReviewMount.js",
    "package.json",
    "package-lock.json",
    "config.env"
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
    "vcpchat_main_direct_push_performed: false",
    "vcpchat_pr_merge_performed: false",
    "github_release_performed: false"
  ]);

  const handoffBoundaryRecorded = includesAll(contents, [
    "pr_exists: true",
    "pr_is_draft: true",
    "pr_waiting_for_review: true",
    "pr_waiting_for_merge: true",
    "ready_for_review_conversion_requires_separate_authorization: true",
    "merge_requires_separate_authorization: true",
    "post_merge_record_required_if_merged: true",
    "runtime_smoke_test_not_performed: true",
    "stop_here: true",
    "pr_ready_for_review_blocked_until_user_approval: true",
    "pr_merge_blocked_until_user_approval: true"
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
    "vcpchat_main_direct_push_performed",
    "vcpchat_pr_merge_performed",
    "github_release_performed",
    "pr_ready_for_review",
    "vcpchat_main_updated_by_this_phase"
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
    "## v7.16 VCPChat Review Console Post-PR Handoff 检查",
    "docs/168_v7_16_vcpchat_review_console_post_pr_handoff.md",
    "review_console/embed_contract/vcpchat_review_console_post_pr_handoff.md",
    "tests/schema_examples/v7_16_vcpchat_review_console_post_pr_handoff.example.yaml",
    "scripts/validate_v7_16_vcpchat_review_console_post_pr_handoff.js",
    "pr_number=34",
    "pr_is_draft=true",
    "pr_merge_performed=false",
    "vcpchat_main_updated_by_this_phase=false"
  ]);

  assert(phaseRecorded, "v7.16 phase and baseline must be recorded.");
  assert(prStatusRecorded, "v7.16 must record PR status.");
  assert(branchProtectionRecorded, "v7.16 must record protected-branch fallback outcome.");
  assert(prScopeRecorded, "v7.16 must carry forward PR scope.");
  assert(sideEffectGuardRecorded, "v7.16 must record side effect guard.");
  assert(handoffBoundaryRecorded, "v7.16 must record draft PR handoff boundary.");
  assert(noForbiddenTrue, "v7.16 must not set forbidden side-effect flags to true.");
  assert(noRawLocalPath, "v7.16 must not save raw local VCP or user paths.");
  assert(checklistCurrent, "validation checklist must include v7.16 checks.");

  process.stdout.write(`${JSON.stringify({
    passed: true,
    v7_16_post_pr_handoff: {
      phase_recorded: phaseRecorded,
      pr_status_recorded: prStatusRecorded,
      branch_protection_recorded: branchProtectionRecorded,
      pr_scope_recorded: prScopeRecorded,
      side_effect_guard_recorded: sideEffectGuardRecorded,
      handoff_boundary_recorded: handoffBoundaryRecorded,
      no_forbidden_true_flags: noForbiddenTrue,
      no_raw_local_path: noRawLocalPath,
      checklist_current: checklistCurrent,
      pr_number: 34,
      pr_is_draft: true,
      pr_merge_performed: false,
      next_safe_phase: "v7.17 VCPChat Review Console PR Review Follow-up"
    }
  }, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
}
