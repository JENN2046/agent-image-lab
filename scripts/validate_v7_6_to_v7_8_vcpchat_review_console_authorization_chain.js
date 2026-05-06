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
    "docs/158_v7_6_vcpchat_review_console_first_runtime_integration_scope_fill_gate.md",
    "docs/159_v7_7_vcpchat_review_console_first_runtime_integration_scope_review_gate.md",
    "docs/160_v7_8_vcpchat_review_console_implementation_authorization_point.md",
    "review_console/embed_contract/vcpchat_review_console_first_runtime_integration_scope_fill_gate.md",
    "review_console/embed_contract/vcpchat_review_console_first_runtime_integration_scope_review_gate.md",
    "review_console/embed_contract/vcpchat_review_console_implementation_authorization_point.md",
    "tests/schema_examples/v7_6_vcpchat_review_console_first_runtime_integration_scope_fill_gate.example.yaml",
    "tests/schema_examples/v7_7_vcpchat_review_console_first_runtime_integration_scope_review_gate.example.yaml",
    "tests/schema_examples/v7_8_vcpchat_review_console_implementation_authorization_point.example.yaml",
    "scripts/validate_v7_6_to_v7_8_vcpchat_review_console_authorization_chain.js",
    "tests/validation_checklist.md",
    "docs/157_v7_5_vcpchat_review_console_runtime_integration_authorization_gate.md"
  ];
  const missingFiles = requiredFiles.filter((relativePath) => !exists(relativePath));
  assert(missingFiles.length === 0, `Missing v7.6-v7.8 authorization chain files: ${missingFiles.join(", ")}`);

  const contents = requiredFiles
    .filter((relativePath) => !relativePath.endsWith(".js") || relativePath.includes("validate_v7_6"))
    .map((relativePath) => read(relativePath))
    .join("\n");
  const checklist = read("tests/validation_checklist.md");

  const phasesRecorded = includesAll(contents, [
    "v7.6 vcpchat review console first runtime integration scope fill gate",
    "v7.7 vcpchat review console first runtime integration scope review gate",
    "v7.8 vcpchat review console implementation authorization point",
    "current_head: d7aacb9",
    "head_commit_short: d7aacb9"
  ]);

  const scopeFillRecorded = includesAll(contents, [
    "candidate_read_scope",
    "candidate_write_scope",
    "preloads/chat.js",
    "preloads/shared/apiFactory.js",
    "preloads/shared/roles.js",
    "<repo_relative_main_process_ipc_handler_candidate>",
    "<repo_relative_renderer_mount_candidate>",
    "exact_repo_relative_files_only: true"
  ]);

  const scopeReviewBlocked = includesAll(contents, [
    "blocked_before_real_write_authorization",
    "can_enter_real_vcpchat_write_now: false",
    "requires_additional_authorized_read_only_lookup: true",
    "write_scope_is_exact_enough: false",
    "ipc_handler_slice",
    "renderer_mount_slice"
  ]);

  const authorizationPointStopped = includesAll(contents, [
    "real_vcpchat_write_authorized: false",
    "final_write_authorization_ready: false",
    "missing_fields_that_block_real_write",
    "repo_relative_main_process_ipc_handler_file",
    "repo_relative_renderer_mount_file",
    "stop_here: true",
    "real_write_phase_blocked: true",
    "v7.9 VCPChat Review Console Authorized Source Lookup For Missing Files"
  ]);

  const noExecutionBoundary = includesAll(contents, [
    "implementation_allowed: false",
    "vcpchat_code_modified: false",
    "additional_vcpchat_read_performed: false",
    "api_called: false",
    "vcp_plugin_called: false",
    "daily_note_called: false",
    "image_file_created: false"
  ]);

  const forbiddenTrueKeys = [
    "implementation_allowed",
    "vcpchat_code_modified",
    "vcptoolbox_code_modified",
    "additional_vcpchat_read_performed",
    "real_manifest_read",
    "ipc_handler_created",
    "preload_runtime_code_created",
    "renderer_runtime_code_created",
    "api_called",
    "vcp_plugin_called",
    "daily_note_called",
    "vcp_memory_written",
    "disk_write_runtime_performed",
    "image_file_created",
    "real_vcpchat_write_authorized",
    "final_write_authorization_ready",
    "remote_write_requested",
    "dependency_change_requested",
    "plugin_call_requested",
    "api_call_requested",
    "daily_note_call_requested",
    "image_creation_requested",
    "push_allowed",
    "remote_write_allowed"
  ];
  const noForbiddenTrue = excludesAll(
    contents,
    forbiddenTrueKeys.map((key) => `${key}: true`)
  );

  const checklistCurrent = includesAll(checklist, [
    "## v7.6-v7.8 VCPChat Review Console Authorization Chain 检查",
    "docs/158_v7_6_vcpchat_review_console_first_runtime_integration_scope_fill_gate.md",
    "docs/159_v7_7_vcpchat_review_console_first_runtime_integration_scope_review_gate.md",
    "docs/160_v7_8_vcpchat_review_console_implementation_authorization_point.md",
    "scripts/validate_v7_6_to_v7_8_vcpchat_review_console_authorization_chain.js",
    "real_vcpchat_write_authorized=false",
    "final_write_authorization_ready=false",
    "additional_vcpchat_read_performed=false"
  ]);

  assert(phasesRecorded, "v7.6-v7.8 phases and baseline must be recorded.");
  assert(scopeFillRecorded, "v7.6 scope fill must record candidate files and unresolved placeholders.");
  assert(scopeReviewBlocked, "v7.7 scope review must block real write authorization.");
  assert(authorizationPointStopped, "v7.8 authorization point must stop before real write.");
  assert(noExecutionBoundary, "v7.6-v7.8 must remain no-read/no-write/no-execution.");
  assert(noForbiddenTrue, "v7.6-v7.8 must not set forbidden flags to true.");
  assert(checklistCurrent, "validation checklist must include v7.6-v7.8 checks.");

  process.stdout.write(`${JSON.stringify({
    passed: true,
    v7_6_to_v7_8_authorization_chain: {
      phases_recorded: phasesRecorded,
      scope_fill_recorded: scopeFillRecorded,
      scope_review_blocked: scopeReviewBlocked,
      authorization_point_stopped: authorizationPointStopped,
      no_execution_boundary: noExecutionBoundary,
      no_forbidden_true_flags: noForbiddenTrue,
      checklist_current: checklistCurrent,
      implementation_allowed: false,
      final_write_authorization_ready: false,
      real_vcpchat_write_authorized: false,
      additional_vcpchat_read_performed: false,
      vcpchat_code_modified: false,
      next_safe_phase: "v7.9 VCPChat Review Console Authorized Source Lookup For Missing Files"
    }
  }, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
}
