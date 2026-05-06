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
    "docs/164_v7_12_vcpchat_review_console_exact_patch_execution_preflight.md",
    "review_console/embed_contract/vcpchat_review_console_exact_patch_execution_preflight.md",
    "tests/schema_examples/v7_12_vcpchat_review_console_exact_patch_execution_preflight.example.yaml",
    "scripts/validate_v7_12_vcpchat_review_console_exact_patch_execution_preflight.js",
    "tests/validation_checklist.md",
    "docs/163_v7_11_vcpchat_review_console_exact_patch_authorization_request.md"
  ];
  const missingFiles = requiredFiles.filter((relativePath) => !exists(relativePath));
  assert(missingFiles.length === 0, `Missing v7.12 exact patch execution preflight files: ${missingFiles.join(", ")}`);

  const currentRecordFiles = [
    "docs/164_v7_12_vcpchat_review_console_exact_patch_execution_preflight.md",
    "review_console/embed_contract/vcpchat_review_console_exact_patch_execution_preflight.md",
    "tests/schema_examples/v7_12_vcpchat_review_console_exact_patch_execution_preflight.example.yaml"
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
    "v7.12 vcpchat review console exact patch execution preflight",
    "current_head: 2837828",
    "head_commit_short: 2837828",
    "docs/163_v7_11_vcpchat_review_console_exact_patch_authorization_request.md",
    "v7.13 VCPChat Review Console First Runtime Patch Implementation Authorization"
  ]);

  const targetPreflightRecorded = includesAll(contents, [
    "expected_branch: main",
    "observed_branch: main",
    "expected_head_short: c97ff0c",
    "observed_head_short: c97ff0c",
    "branch_matches_expected: true",
    "head_matches_expected: true",
    "worktree_clean: true",
    "remote_write_allowed: false"
  ]);

  const fileBoundaryRecorded = includesAll(contents, [
    "exact_file_boundary_check",
    "exact_repo_relative_files_only: true",
    "main.js",
    "observed_exists: true",
    "modules/ipc/imageLabReviewHandlers.js",
    "expected_state: new_file_expected",
    "observed_exists: false",
    "preloads/chat.js",
    "main.html",
    "modules/renderer/imageLabReviewMount.js",
    "preflight_result: pass"
  ]);

  const readBoundaryRecorded = includesAll(contents, [
    "vcpchat_git_status_checked: true",
    "vcpchat_branch_and_head_checked: true",
    "exact_file_existence_checked: true",
    "source_code_body_read_performed: false",
    "env_or_secret_file_read: false",
    "raw_source_code_copied: false",
    "raw_local_path_saved: false"
  ]);

  const hardStopRecorded = includesAll(contents, [
    "preflight_passed: true",
    "awaiting_final_real_write_approval: true",
    "real_vcpchat_write_authorized_by_this_record: false",
    "real_vcpchat_write_performed: false",
    "implementation_allowed: false",
    "approval_is_required_before_real_write: true",
    "ambiguous_continue_is_not_enough: true",
    "stop_here: true",
    "real_write_phase_blocked: true"
  ]);

  const forbiddenTrueKeys = [
    "real_vcpchat_write_authorized",
    "real_vcpchat_write_authorized_by_this_record",
    "real_vcpchat_write_performed",
    "implementation_task_authorized",
    "implementation_allowed",
    "final_write_authorization_ready",
    "runtime_code_modified",
    "vcpchat_code_modified",
    "vcptoolbox_code_modified",
    "source_code_body_read_performed",
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
    "## v7.12 VCPChat Review Console Exact Patch Execution Preflight 检查",
    "docs/164_v7_12_vcpchat_review_console_exact_patch_execution_preflight.md",
    "review_console/embed_contract/vcpchat_review_console_exact_patch_execution_preflight.md",
    "tests/schema_examples/v7_12_vcpchat_review_console_exact_patch_execution_preflight.example.yaml",
    "scripts/validate_v7_12_vcpchat_review_console_exact_patch_execution_preflight.js",
    "preflight_passed=true",
    "observed_head_short=c97ff0c",
    "real_vcpchat_write_performed=false",
    "source_code_body_read_performed=false"
  ]);

  assert(phaseRecorded, "v7.12 phase and baseline must be recorded.");
  assert(targetPreflightRecorded, "v7.12 must record target branch/head/worktree preflight.");
  assert(fileBoundaryRecorded, "v7.12 must record exact file boundary preflight.");
  assert(readBoundaryRecorded, "v7.12 must record read boundary.");
  assert(hardStopRecorded, "v7.12 must remain a hard stop before real write.");
  assert(noForbiddenTrue, "v7.12 must not set write/execution forbidden flags to true.");
  assert(noRawLocalPath, "v7.12 must not save raw local VCP or user paths.");
  assert(checklistCurrent, "validation checklist must include v7.12 checks.");

  process.stdout.write(`${JSON.stringify({
    passed: true,
    v7_12_exact_patch_execution_preflight: {
      phase_recorded: phaseRecorded,
      target_preflight_recorded: targetPreflightRecorded,
      file_boundary_recorded: fileBoundaryRecorded,
      read_boundary_recorded: readBoundaryRecorded,
      hard_stop_recorded: hardStopRecorded,
      no_forbidden_true_flags: noForbiddenTrue,
      no_raw_local_path: noRawLocalPath,
      checklist_current: checklistCurrent,
      preflight_passed: true,
      real_vcpchat_write_performed: false,
      next_safe_phase: "v7.13 VCPChat Review Console First Runtime Patch Implementation Authorization"
    }
  }, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
}
