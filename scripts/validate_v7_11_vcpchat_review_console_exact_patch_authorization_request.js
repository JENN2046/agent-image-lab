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
    "docs/163_v7_11_vcpchat_review_console_exact_patch_authorization_request.md",
    "review_console/embed_contract/vcpchat_review_console_exact_patch_authorization_request.md",
    "tests/schema_examples/v7_11_vcpchat_review_console_exact_patch_authorization_request.example.yaml",
    "scripts/validate_v7_11_vcpchat_review_console_exact_patch_authorization_request.js",
    "tests/validation_checklist.md",
    "docs/162_v7_10_vcpchat_review_console_file_level_write_authorization_review.md"
  ];
  const missingFiles = requiredFiles.filter((relativePath) => !exists(relativePath));
  assert(missingFiles.length === 0, `Missing v7.11 exact patch authorization request files: ${missingFiles.join(", ")}`);

  const currentRecordFiles = [
    "docs/163_v7_11_vcpchat_review_console_exact_patch_authorization_request.md",
    "review_console/embed_contract/vcpchat_review_console_exact_patch_authorization_request.md",
    "tests/schema_examples/v7_11_vcpchat_review_console_exact_patch_authorization_request.example.yaml"
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
    "v7.11 vcpchat review console exact patch authorization request",
    "current_head: 76c27eb",
    "head_commit_short: 76c27eb",
    "docs/162_v7_10_vcpchat_review_console_file_level_write_authorization_review.md",
    "v7.12 VCPChat Review Console Exact Patch Execution Preflight"
  ]);

  const targetRecorded = includesAll(contents, [
    "target_repository_name: VCPChat",
    "target_branch_required: main",
    "target_head_before_patch_required: c97ff0c",
    "remote_write_allowed: false",
    "vcpchat_worktree_must_be_clean_before_patch: true",
    "protect_user_owned_changes: true"
  ]);

  const exactScopeRecorded = includesAll(contents, [
    "exact_allowed_write_scope",
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

  const excludedScopeRecorded = includesAll(contents, [
    "explicitly_excluded_files",
    "preloads/shared/apiFactory.js",
    "preloads/shared/catalog.js",
    "preloads/shared/roles.js",
    "renderer.js",
    "package.json",
    "config.env",
    ".env",
    "必须停止并回到授权点"
  ]);

  const hardAuthorizationBoundary = includesAll(contents, [
    "exact_patch_authorization_request_ready: true",
    "awaiting_user_explicit_approval: true",
    "real_vcpchat_write_authorized: false",
    "implementation_allowed: false",
    "approval_is_required_before_real_write: true",
    "ambiguous_continue_is_not_enough: true",
    "stop_here: true",
    "real_write_phase_blocked: true"
  ]);

  const commandGateRecorded = includesAll(contents, [
    "allowed_commands_for_future_patch",
    "git diff --check -- main.js modules/ipc/imageLabReviewHandlers.js preloads/chat.js main.html modules/renderer/imageLabReviewMount.js",
    "node --check modules/ipc/imageLabReviewHandlers.js",
    "node --check modules/renderer/imageLabReviewMount.js",
    "forbidden_commands_and_actions",
    "git reset --hard",
    "git clean -fd",
    "call_plugin",
    "call_external_api",
    "call_daily_note",
    "write_vcp_memory",
    "create_image_file"
  ]);

  const noReadWriteOrExecution = includesAll(currentContents, [
    "additional_vcpchat_read_performed: false",
    "vcpchat_code_modified: false",
    "vcptoolbox_code_modified: false",
    "runtime_code_modified: false",
    "ipc_handler_created: false",
    "preload_runtime_code_created: false",
    "renderer_runtime_code_created: false",
    "api_called: false",
    "vcp_plugin_called: false",
    "daily_note_called: false",
    "image_file_created: false"
  ]);

  const forbiddenTrueKeys = [
    "real_vcpchat_write_authorized",
    "implementation_task_authorized",
    "implementation_allowed",
    "final_write_authorization_ready",
    "runtime_code_modified",
    "vcpchat_code_modified",
    "vcptoolbox_code_modified",
    "additional_vcpchat_read_performed",
    "real_vcptoolbox_source_read",
    "real_manifest_read",
    "ipc_handler_created",
    "preload_runtime_code_created",
    "renderer_runtime_code_created",
    "adapter_execution_entrypoint_created",
    "api_called",
    "vcp_plugin_called",
    "daily_note_called",
    "vcp_memory_written",
    "disk_write_runtime_performed",
    "image_file_created",
    "remote_write_allowed"
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
    "## v7.11 VCPChat Review Console Exact Patch Authorization Request 检查",
    "docs/163_v7_11_vcpchat_review_console_exact_patch_authorization_request.md",
    "review_console/embed_contract/vcpchat_review_console_exact_patch_authorization_request.md",
    "tests/schema_examples/v7_11_vcpchat_review_console_exact_patch_authorization_request.example.yaml",
    "scripts/validate_v7_11_vcpchat_review_console_exact_patch_authorization_request.js",
    "exact_patch_authorization_request_ready=true",
    "awaiting_user_explicit_approval=true",
    "real_vcpchat_write_authorized=false",
    "additional_vcpchat_read_performed=false"
  ]);

  assert(phaseRecorded, "v7.11 phase and baseline must be recorded.");
  assert(targetRecorded, "v7.11 must record exact target and clean worktree requirement.");
  assert(exactScopeRecorded, "v7.11 must record exact allowed write scope.");
  assert(excludedScopeRecorded, "v7.11 must record excluded files and stop condition.");
  assert(hardAuthorizationBoundary, "v7.11 must remain a hard authorization request.");
  assert(commandGateRecorded, "v7.11 must record allowed and forbidden command gates.");
  assert(noReadWriteOrExecution, "v7.11 must remain no-read/no-write/no-execution.");
  assert(noForbiddenTrue, "v7.11 must not set read/write/execution forbidden flags to true.");
  assert(noRawLocalPath, "v7.11 must not save raw local VCP or user paths.");
  assert(checklistCurrent, "validation checklist must include v7.11 checks.");

  process.stdout.write(`${JSON.stringify({
    passed: true,
    v7_11_exact_patch_authorization_request: {
      phase_recorded: phaseRecorded,
      target_recorded: targetRecorded,
      exact_scope_recorded: exactScopeRecorded,
      excluded_scope_recorded: excludedScopeRecorded,
      hard_authorization_boundary: hardAuthorizationBoundary,
      command_gate_recorded: commandGateRecorded,
      no_read_write_or_execution: noReadWriteOrExecution,
      no_forbidden_true_flags: noForbiddenTrue,
      no_raw_local_path: noRawLocalPath,
      checklist_current: checklistCurrent,
      exact_patch_authorization_request_ready: true,
      awaiting_user_explicit_approval: true,
      real_vcpchat_write_authorized: false,
      next_safe_phase: "v7.12 VCPChat Review Console Exact Patch Execution Preflight"
    }
  }, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
}
