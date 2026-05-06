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
    "docs/162_v7_10_vcpchat_review_console_file_level_write_authorization_review.md",
    "review_console/embed_contract/vcpchat_review_console_file_level_write_authorization_review.md",
    "tests/schema_examples/v7_10_vcpchat_review_console_file_level_write_authorization_review.example.yaml",
    "scripts/validate_v7_10_vcpchat_review_console_file_level_write_authorization_review.js",
    "tests/validation_checklist.md",
    "docs/161_v7_9_vcpchat_review_console_authorized_source_lookup_for_missing_files.md"
  ];
  const missingFiles = requiredFiles.filter((relativePath) => !exists(relativePath));
  assert(missingFiles.length === 0, `Missing v7.10 file-level authorization review files: ${missingFiles.join(", ")}`);

  const currentRecordFiles = [
    "docs/162_v7_10_vcpchat_review_console_file_level_write_authorization_review.md",
    "review_console/embed_contract/vcpchat_review_console_file_level_write_authorization_review.md",
    "tests/schema_examples/v7_10_vcpchat_review_console_file_level_write_authorization_review.example.yaml"
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
    "v7.10 vcpchat review console file-level write authorization review",
    "current_head: 1298fef",
    "head_commit_short: 1298fef",
    "docs/161_v7_9_vcpchat_review_console_authorized_source_lookup_for_missing_files.md",
    "v7.11 VCPChat Review Console Exact Patch Authorization Request"
  ]);

  const finalScopeRecorded = includesAll(contents, [
    "final_allowed_write_scope_candidate",
    "exact_repo_relative_files_only: true",
    "directories_allowed_as_write_scope: false",
    "glob_patterns_allowed: false",
    "implicit_adjacent_files_allowed: false",
    "main.js",
    "modules/ipc/imageLabReviewHandlers.js",
    "preloads/chat.js",
    "main.html",
    "modules/renderer/imageLabReviewMount.js"
  ]);

  const conditionalScopeExcluded = includesAll(contents, [
    "conditional_files_require_separate_authorization",
    "preloads/shared/apiFactory.js",
    "preloads/shared/catalog.js",
    "preloads/shared/roles.js",
    "renderer.js",
    "不得默认纳入写入范围"
  ]);

  const noAdditionalReadOrWrite = includesAll(contents, [
    "source_lookup_reused_from_v7_9: true",
    "additional_vcpchat_read_performed: false",
    "source_write_performed: false",
    "vcpchat_code_modified: false",
    "vcptoolbox_code_modified: false",
    "real_vcpchat_write_authorized: false",
    "implementation_allowed: false",
    "final_write_authorization_ready: false"
  ]);

  const authorizationTemplateReady = includesAll(contents, [
    "required_user_authorization_template",
    "target_repository: VCPChat",
    "target_branch: main",
    "target_commit_before_patch: c97ff0c",
    "explicit_user_approval_required_before_real_write: true",
    "no_plugin_call: true",
    "no_api_call: true",
    "no_daily_note_call: true",
    "no_vcp_memory_write: true",
    "no_image_creation: true"
  ]);

  const forbiddenTrueKeys = [
    "source_write_performed",
    "vcpchat_code_modified",
    "vcptoolbox_code_modified",
    "additional_vcpchat_read_performed",
    "real_vcpchat_write_authorized",
    "implementation_task_authorized",
    "implementation_allowed",
    "final_write_authorization_ready",
    "runtime_code_modified",
    "ipc_handler_created",
    "preload_runtime_code_created",
    "renderer_runtime_code_created",
    "adapter_execution_entrypoint_created",
    "api_called",
    "vcp_plugin_called",
    "daily_note_called",
    "vcp_memory_written",
    "disk_write_runtime_performed",
    "image_file_created"
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
    "## v7.10 VCPChat Review Console File-level Write Authorization Review 检查",
    "docs/162_v7_10_vcpchat_review_console_file_level_write_authorization_review.md",
    "review_console/embed_contract/vcpchat_review_console_file_level_write_authorization_review.md",
    "tests/schema_examples/v7_10_vcpchat_review_console_file_level_write_authorization_review.example.yaml",
    "scripts/validate_v7_10_vcpchat_review_console_file_level_write_authorization_review.js",
    "final_allowed_write_scope_ready_for_user_authorization=true",
    "additional_vcpchat_read_performed=false",
    "real_vcpchat_write_authorized=false",
    "vcpchat_code_modified=false"
  ]);

  assert(phaseRecorded, "v7.10 phase and baseline must be recorded.");
  assert(finalScopeRecorded, "v7.10 must record exact final allowed write scope candidate.");
  assert(conditionalScopeExcluded, "v7.10 must exclude conditional files from default write scope.");
  assert(noAdditionalReadOrWrite, "v7.10 must not read or write real VCPChat.");
  assert(authorizationTemplateReady, "v7.10 must prepare a future user authorization template.");
  assert(noForbiddenTrue, "v7.10 must not set read/write/execution forbidden flags to true.");
  assert(noRawLocalPath, "v7.10 must not save raw local VCP or user paths.");
  assert(checklistCurrent, "validation checklist must include v7.10 checks.");

  process.stdout.write(`${JSON.stringify({
    passed: true,
    v7_10_file_level_write_authorization_review: {
      phase_recorded: phaseRecorded,
      final_scope_recorded: finalScopeRecorded,
      conditional_scope_excluded: conditionalScopeExcluded,
      no_additional_read_or_write: noAdditionalReadOrWrite,
      authorization_template_ready: authorizationTemplateReady,
      no_forbidden_true_flags: noForbiddenTrue,
      no_raw_local_path: noRawLocalPath,
      checklist_current: checklistCurrent,
      final_allowed_write_scope_ready_for_user_authorization: true,
      real_vcpchat_write_authorized: false,
      vcpchat_code_modified: false,
      next_safe_phase: "v7.11 VCPChat Review Console Exact Patch Authorization Request"
    }
  }, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
}
