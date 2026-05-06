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
    "docs/165_v7_13_vcpchat_review_console_first_runtime_patch_implementation_record.md",
    "review_console/embed_contract/vcpchat_review_console_first_runtime_patch_implementation_record.md",
    "tests/schema_examples/v7_13_vcpchat_review_console_first_runtime_patch_implementation_record.example.yaml",
    "scripts/validate_v7_13_vcpchat_review_console_first_runtime_patch_implementation_record.js",
    "tests/validation_checklist.md",
    "docs/164_v7_12_vcpchat_review_console_exact_patch_execution_preflight.md"
  ];
  const missingFiles = requiredFiles.filter((relativePath) => !exists(relativePath));
  assert(missingFiles.length === 0, `Missing v7.13 implementation record files: ${missingFiles.join(", ")}`);

  const currentRecordFiles = [
    "docs/165_v7_13_vcpchat_review_console_first_runtime_patch_implementation_record.md",
    "review_console/embed_contract/vcpchat_review_console_first_runtime_patch_implementation_record.md",
    "tests/schema_examples/v7_13_vcpchat_review_console_first_runtime_patch_implementation_record.example.yaml"
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
    "v7.13 vcpchat review console first runtime patch implementation record",
    "current_head: eb7819d",
    "head_commit_short: eb7819d",
    "docs/164_v7_12_vcpchat_review_console_exact_patch_execution_preflight.md",
    "v7.14 VCPChat Review Console Commit Authorization"
  ]);

  const authorizationRecorded = includesAll(contents, [
    "user_explicit_authorization_received_for_v7_13: true",
    "target_repository_name: VCPChat",
    "target_branch_observed: main",
    "target_head_before_patch_short: c97ff0c",
    "target_worktree_was_clean_before_patch: true",
    "allowed_write_scope_was_exact: true"
  ]);

  const scopeRecorded = includesAll(contents, [
    "vcpchat_worktree_has_authorized_local_changes: true",
    "changed_files_only_inside_allowed_scope: true",
    "main.js",
    "modules/ipc/imageLabReviewHandlers.js",
    "preloads/chat.js",
    "main.html",
    "modules/renderer/imageLabReviewMount.js",
    "files_explicitly_not_modified",
    "renderer.js",
    "package.json",
    "config.env",
    ".env"
  ]);

  const patchSummaryRecorded = includesAll(contents, [
    "imageLabReviewHandlers",
    "loadSession",
    "previewDraft",
    "submitDraft",
    "cancel",
    "window.imageLabReview",
    "review_session_draft",
    "image_case_draft",
    "memory_delta_draft",
    "prototype_guard"
  ]);

  const validationRecorded = includesAll(contents, [
    "syntax_checks_passed: true",
    "changed_file_boundary_check_passed: true",
    "added_line_forbidden_call_scan_passed: true",
    "new_file_forbidden_call_scan_passed: true",
    "git diff --check -- main.js modules/ipc/imageLabReviewHandlers.js preloads/chat.js main.html modules/renderer/imageLabReviewMount.js"
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
    "vcpchat_commit_performed: false",
    "vcpchat_remote_push_performed: false"
  ]);

  const commitBoundaryRecorded = includesAll(contents, [
    "vcpchat_patch_candidate_ready_for_review: true",
    "vcpchat_commit_requires_user_authorization: true",
    "vcpchat_commit_performed: false",
    "recommended_vcpchat_commit_message: \"feat: add image lab review console bridge\"",
    "vcpchat_commit_blocked_until_user_approval: true",
    "vcpchat_remote_push_blocked: true"
  ]);

  const forbiddenTrueKeys = [
    "api_called",
    "daily_note_called",
    "vcp_memory_written",
    "dependency_changed",
    "package_manifest_changed",
    "lockfile_changed",
    "env_or_secret_file_read",
    "secret_value_copied",
    "raw_local_path_saved",
    "vcpchat_commit_performed",
    "vcpchat_remote_push_performed",
    "vcpchat_remote_write_allowed"
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
    "## v7.13 VCPChat Review Console First Runtime Patch Implementation Record 检查",
    "docs/165_v7_13_vcpchat_review_console_first_runtime_patch_implementation_record.md",
    "review_console/embed_contract/vcpchat_review_console_first_runtime_patch_implementation_record.md",
    "tests/schema_examples/v7_13_vcpchat_review_console_first_runtime_patch_implementation_record.example.yaml",
    "scripts/validate_v7_13_vcpchat_review_console_first_runtime_patch_implementation_record.js",
    "vcpchat_worktree_has_authorized_local_changes=true",
    "changed_files_only_inside_allowed_scope=true",
    "vcpchat_commit_performed=false",
    "vcpchat_remote_push_performed=false"
  ]);

  assert(phaseRecorded, "v7.13 phase and baseline must be recorded.");
  assert(authorizationRecorded, "v7.13 must record explicit authorization and target.");
  assert(scopeRecorded, "v7.13 must record exact changed scope.");
  assert(patchSummaryRecorded, "v7.13 must record patch summary.");
  assert(validationRecorded, "v7.13 must record validation results.");
  assert(sideEffectGuardRecorded, "v7.13 must record side effect guard.");
  assert(commitBoundaryRecorded, "v7.13 must stop before VCPChat commit.");
  assert(noForbiddenTrue, "v7.13 must not set forbidden side-effect flags to true.");
  assert(noRawLocalPath, "v7.13 must not save raw local VCP or user paths.");
  assert(checklistCurrent, "validation checklist must include v7.13 checks.");

  process.stdout.write(`${JSON.stringify({
    passed: true,
    v7_13_first_runtime_patch_implementation_record: {
      phase_recorded: phaseRecorded,
      authorization_recorded: authorizationRecorded,
      scope_recorded: scopeRecorded,
      patch_summary_recorded: patchSummaryRecorded,
      validation_recorded: validationRecorded,
      side_effect_guard_recorded: sideEffectGuardRecorded,
      commit_boundary_recorded: commitBoundaryRecorded,
      no_forbidden_true_flags: noForbiddenTrue,
      no_raw_local_path: noRawLocalPath,
      checklist_current: checklistCurrent,
      vcpchat_patch_candidate_ready_for_review: true,
      vcpchat_commit_performed: false,
      next_safe_phase: "v7.14 VCPChat Review Console Commit Authorization"
    }
  }, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
}
