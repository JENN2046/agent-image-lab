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
    "docs/161_v7_9_vcpchat_review_console_authorized_source_lookup_for_missing_files.md",
    "review_console/embed_contract/vcpchat_review_console_authorized_source_lookup_for_missing_files.md",
    "tests/schema_examples/v7_9_vcpchat_review_console_authorized_source_lookup_for_missing_files.example.yaml",
    "scripts/validate_v7_9_vcpchat_review_console_authorized_source_lookup_for_missing_files.js",
    "tests/validation_checklist.md"
  ];
  const missingFiles = requiredFiles.filter((relativePath) => !exists(relativePath));
  assert(missingFiles.length === 0, `Missing v7.9 authorized source lookup files: ${missingFiles.join(", ")}`);

  const recordFiles = requiredFiles.filter((relativePath) => !relativePath.endsWith(".js"));
  const contents = recordFiles
    .map((relativePath) => read(relativePath))
    .join("\n");
  const checklist = read("tests/validation_checklist.md");

  const phaseRecorded = includesAll(contents, [
    "v7.9 vcpchat review console authorized source lookup for missing files",
    "current_head: 6cd5bbd",
    "head_commit_short: 6cd5bbd",
    "target_head_short: c97ff0c",
    "v7.10 VCPChat Review Console File-level Write Authorization Review"
  ]);

  const missingFilesResolved = includesAll(contents, [
    "missing_main_process_ipc_handler_file_resolved: true",
    "missing_renderer_mount_file_resolved: true",
    "main_process_ipc_handler_file: modules/ipc/imageLabReviewHandlers.js",
    "renderer_mount_file: modules/renderer/imageLabReviewMount.js",
    "dedicated_handler_file_exists_now: false",
    "dedicated_mount_file_exists_now: false"
  ]);

  const candidateScopeRecorded = includesAll(contents, [
    "future_allowed_write_scope_candidate",
    "main.js",
    "modules/ipc/imageLabReviewHandlers.js",
    "preloads/chat.js",
    "main.html",
    "modules/renderer/imageLabReviewMount.js",
    "conditional_write_scope_candidate",
    "renderer.js"
  ]);

  const authorizedReadOnlyLookup = includesAll(contents, [
    "source_lookup_authorized_by_user: true",
    "source_lookup_performed: true",
    "source_lookup_read_only: true",
    "authorized_source_lookup_only: true",
    "additional_vcpchat_read_performed: true",
    "real_vcpchat_source_lookup_performed: true"
  ]);

  const noWriteOrExecutionBoundary = includesAll(contents, [
    "source_write_performed: false",
    "real_vcpchat_source_write_performed: false",
    "vcpchat_code_modified: false",
    "vcptoolbox_code_modified: false",
    "raw_local_path_saved: false",
    "raw_source_code_copied: false",
    "implementation_allowed: false",
    "final_write_authorization_ready: false",
    "api_called: false",
    "vcp_plugin_called: false",
    "daily_note_called: false",
    "image_file_created: false"
  ]);

  const forbiddenTrueKeys = [
    "source_write_performed",
    "real_vcpchat_source_write_performed",
    "vcpchat_code_modified",
    "vcptoolbox_code_modified",
    "raw_local_path_saved",
    "raw_source_code_copied",
    "env_file_read",
    "config_env_read",
    "secret_file_read",
    "token_or_cookie_read",
    "package_scripts_executed",
    "npm_install_executed",
    "plugin_called",
    "api_called",
    "daily_note_called",
    "vcp_memory_written",
    "image_file_created",
    "implementation_allowed",
    "final_write_authorization_ready",
    "runtime_code_modified",
    "ipc_handler_created",
    "preload_runtime_code_created",
    "renderer_runtime_code_created",
    "adapter_execution_entrypoint_created"
  ];
  const noForbiddenTrue = excludesAll(
    contents,
    forbiddenTrueKeys.map((key) => `${key}: true`)
  );

  const noRawLocalPath = excludesAll(contents, [
    "A:\\VCP",
    "A:/VCP",
    "C:\\Users",
    "C:/Users"
  ]);

  const checklistCurrent = includesAll(checklist, [
    "## v7.9 VCPChat Review Console Authorized Source Lookup For Missing Files 检查",
    "docs/161_v7_9_vcpchat_review_console_authorized_source_lookup_for_missing_files.md",
    "review_console/embed_contract/vcpchat_review_console_authorized_source_lookup_for_missing_files.md",
    "tests/schema_examples/v7_9_vcpchat_review_console_authorized_source_lookup_for_missing_files.example.yaml",
    "scripts/validate_v7_9_vcpchat_review_console_authorized_source_lookup_for_missing_files.js",
    "additional_vcpchat_read_performed=true",
    "real_vcpchat_source_lookup_performed=true",
    "source_write_performed=false",
    "vcpchat_code_modified=false"
  ]);

  assert(phaseRecorded, "v7.9 phase and baseline must be recorded.");
  assert(missingFilesResolved, "v7.9 must resolve missing IPC handler and renderer mount files.");
  assert(candidateScopeRecorded, "v7.9 must record future candidate scopes.");
  assert(authorizedReadOnlyLookup, "v7.9 must record authorized read-only source lookup.");
  assert(noWriteOrExecutionBoundary, "v7.9 must remain no-write/no-execution.");
  assert(noForbiddenTrue, "v7.9 must not set write/execution forbidden flags to true.");
  assert(noRawLocalPath, "v7.9 must not save raw local VCP or user paths.");
  assert(checklistCurrent, "validation checklist must include v7.9 checks.");

  process.stdout.write(`${JSON.stringify({
    passed: true,
    v7_9_authorized_source_lookup: {
      phase_recorded: phaseRecorded,
      missing_files_resolved: missingFilesResolved,
      candidate_scope_recorded: candidateScopeRecorded,
      authorized_read_only_lookup: authorizedReadOnlyLookup,
      no_write_or_execution_boundary: noWriteOrExecutionBoundary,
      no_forbidden_true_flags: noForbiddenTrue,
      no_raw_local_path: noRawLocalPath,
      checklist_current: checklistCurrent,
      source_lookup_performed: true,
      source_write_performed: false,
      vcpchat_code_modified: false,
      next_safe_phase: "v7.10 VCPChat Review Console File-level Write Authorization Review"
    }
  }, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
}
