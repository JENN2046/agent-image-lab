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
    "docs/166_v7_14_vcpchat_review_console_post_commit_record.md",
    "review_console/embed_contract/vcpchat_review_console_post_commit_record.md",
    "tests/schema_examples/v7_14_vcpchat_review_console_post_commit_record.example.yaml",
    "scripts/validate_v7_14_vcpchat_review_console_post_commit_record.js",
    "tests/validation_checklist.md",
    "docs/165_v7_13_vcpchat_review_console_first_runtime_patch_implementation_record.md"
  ];
  const missingFiles = requiredFiles.filter((relativePath) => !exists(relativePath));
  assert(missingFiles.length === 0, `Missing v7.14 post-commit record files: ${missingFiles.join(", ")}`);

  const currentRecordFiles = [
    "docs/166_v7_14_vcpchat_review_console_post_commit_record.md",
    "review_console/embed_contract/vcpchat_review_console_post_commit_record.md",
    "tests/schema_examples/v7_14_vcpchat_review_console_post_commit_record.example.yaml"
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
    "v7.14 vcpchat review console post-commit record",
    "current_head: a1959d3",
    "head_commit_short: a1959d3",
    "docs/165_v7_13_vcpchat_review_console_first_runtime_patch_implementation_record.md",
    "v7.15 VCPChat Review Console Remote Push Authorization"
  ]);

  const commitRecorded = includesAll(contents, [
    "previous_head_short: c97ff0c",
    "post_commit_head_short: 426a2a9",
    "post_commit_subject: \"feat: add image lab review console bridge\"",
    "vcpchat_local_commit_performed: true",
    "vcpchat_status_after_commit: \"main...origin/main [ahead 1]\"",
    "vcpchat_remote_push_performed: false",
    "vcpchat_remote_push_allowed: false"
  ]);

  const committedScopeRecorded = includesAll(contents, [
    "committed_files_only_inside_allowed_scope: true",
    "main.js",
    "modules/ipc/imageLabReviewHandlers.js",
    "preloads/chat.js",
    "main.html",
    "modules/renderer/imageLabReviewMount.js",
    "files_explicitly_not_modified",
    "renderer.js",
    "preloads/shared/apiFactory.js",
    "package.json",
    "config.env",
    ".env"
  ]);

  const verificationRecorded = includesAll(contents, [
    "pre_commit_validation_passed: true",
    "post_commit_status_checked: true",
    "post_commit_log_checked: true",
    "agent_image_lab_record_validation_passed: true",
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
    "vcpchat_remote_push_performed: false",
    "vcpchat_release_performed: false"
  ]);

  const pushBoundaryRecorded = includesAll(contents, [
    "vcpchat_commit_is_local_only: true",
    "vcpchat_remote_still_at_previous_head: c97ff0c",
    "vcpchat_remote_push_requires_separate_user_authorization: true",
    "runtime_smoke_test_not_performed: true",
    "vcpchat_remote_push_blocked_until_user_approval: true"
  ]);

  const forbiddenTrueKeys = [
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
    "vcpchat_remote_push_performed",
    "vcpchat_remote_push_allowed",
    "vcpchat_release_performed"
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
    "## v7.14 VCPChat Review Console Post-commit Record 检查",
    "docs/166_v7_14_vcpchat_review_console_post_commit_record.md",
    "review_console/embed_contract/vcpchat_review_console_post_commit_record.md",
    "tests/schema_examples/v7_14_vcpchat_review_console_post_commit_record.example.yaml",
    "scripts/validate_v7_14_vcpchat_review_console_post_commit_record.js",
    "post_commit_head_short=426a2a9",
    "vcpchat_local_commit_performed=true",
    "vcpchat_remote_push_performed=false",
    "main...origin/main [ahead 1]"
  ]);

  assert(phaseRecorded, "v7.14 phase and baseline must be recorded.");
  assert(commitRecorded, "v7.14 must record VCPChat local commit state.");
  assert(committedScopeRecorded, "v7.14 must record committed scope.");
  assert(verificationRecorded, "v7.14 must record validation carried forward.");
  assert(sideEffectGuardRecorded, "v7.14 must record side effect guard.");
  assert(pushBoundaryRecorded, "v7.14 must stop before VCPChat remote push.");
  assert(noForbiddenTrue, "v7.14 must not set forbidden side-effect flags to true.");
  assert(noRawLocalPath, "v7.14 must not save raw local VCP or user paths.");
  assert(checklistCurrent, "validation checklist must include v7.14 checks.");

  process.stdout.write(`${JSON.stringify({
    passed: true,
    v7_14_post_commit_record: {
      phase_recorded: phaseRecorded,
      commit_recorded: commitRecorded,
      committed_scope_recorded: committedScopeRecorded,
      verification_recorded: verificationRecorded,
      side_effect_guard_recorded: sideEffectGuardRecorded,
      push_boundary_recorded: pushBoundaryRecorded,
      no_forbidden_true_flags: noForbiddenTrue,
      no_raw_local_path: noRawLocalPath,
      checklist_current: checklistCurrent,
      vcpchat_local_commit: "426a2a9",
      vcpchat_remote_push_performed: false,
      next_safe_phase: "v7.15 VCPChat Review Console Remote Push Authorization"
    }
  }, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
}
