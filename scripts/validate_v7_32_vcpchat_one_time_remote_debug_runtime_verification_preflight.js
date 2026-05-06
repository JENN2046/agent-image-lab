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

function excludesExactTrueFlags(content, keys) {
  const lines = content.split(/\r?\n/).map((line) => line.trim());
  return keys.every((key) => !lines.some((line) => line === `${key}: true`));
}

function main() {
  const requiredFiles = [
    "docs/184_v7_32_vcpchat_one_time_remote_debug_runtime_verification_preflight.md",
    "review_console/embed_contract/vcpchat_one_time_remote_debug_runtime_verification_preflight.md",
    "tests/schema_examples/v7_32_vcpchat_one_time_remote_debug_runtime_verification_preflight.example.yaml",
    "scripts/validate_v7_32_vcpchat_one_time_remote_debug_runtime_verification_preflight.js",
    "tests/validation_checklist.md",
    "docs/183_v7_31_vcpchat_renderer_global_verification_gate.md"
  ];
  const missing = requiredFiles.filter((relativePath) => !exists(relativePath));
  assert(missing.length === 0, `Missing v7.32 remote-debug preflight files: ${missing.join(", ")}`);

  const currentFiles = [
    "docs/184_v7_32_vcpchat_one_time_remote_debug_runtime_verification_preflight.md",
    "review_console/embed_contract/vcpchat_one_time_remote_debug_runtime_verification_preflight.md",
    "tests/schema_examples/v7_32_vcpchat_one_time_remote_debug_runtime_verification_preflight.example.yaml"
  ];
  const contents = requiredFiles
    .filter((relativePath) => !relativePath.endsWith(".js"))
    .map((relativePath) => read(relativePath))
    .join("\n");
  const currentContents = currentFiles.map((relativePath) => read(relativePath)).join("\n");
  const checklist = read("tests/validation_checklist.md");

  const phaseRecorded = includesAll(contents, [
    "v7.32 vcpchat one-time remote-debug runtime verification preflight",
    "current_head: 49ffae2",
    "head_commit_short: 49ffae2",
    "docs/183_v7_31_vcpchat_renderer_global_verification_gate.md",
    "v7.33 VCPChat One-time Remote Debug Runtime Verification Execution"
  ]);

  const commandRecorded = includesAll(currentContents, [
    "--remote-debugging-port=9222",
    "--desktop-only",
    "remote_debug_port: 9222",
    "command_execution_performed_by_this_phase: false",
    "remote_debug_port_opened_by_this_phase: false"
  ]);

  const cdpPolicyRecorded = includesAll(currentContents, [
    "http://127.0.0.1:9222/json",
    "endpoint_access_performed_by_this_phase: false",
    "Runtime.evaluate",
    "Page.navigate",
    "DOM.setAttributeValue",
    "Input.dispatchKeyEvent",
    "不得调用 bridge loadSession / previewDraft / submitDraft / cancel"
  ]);

  const assertionsRecorded = includesAll(currentContents, [
    "window.imageLabReview",
    "window.imageLabReview.loadSession",
    "window.imageLabReview.previewDraft",
    "window.imageLabReview.submitDraft",
    "window.imageLabReview.cancel",
    "imageLabReviewMount",
    "window.imageLabReviewRuntime",
    "review_session_draft",
    "image_case_draft",
    "memory_delta_draft",
    "api_called=false",
    "image_file_created=false"
  ]);

  const cleanupRecorded = includesAll(currentContents, [
    "close_launched_process_tree: true",
    "restore_vcpchat_worktree_if_startup_touches_known_readiness_file: true",
    "verify_vcpchat_worktree_clean_after_cleanup: true"
  ]);

  const sideEffectGuardRecorded = includesAll(currentContents, [
    "app_launch_performed_by_this_phase: false",
    "remote_debug_used_by_this_phase: false",
    "cdp_endpoint_accessed_by_this_phase: false",
    "runtime_evaluate_performed_by_this_phase: false",
    "vcpchat_modified_by_this_phase: false",
    "test_harness_created_by_this_phase: false",
    "review_console_bridge_load_session_called: false",
    "review_console_bridge_preview_draft_called: false",
    "review_console_bridge_submit_draft_called: false",
    "review_console_bridge_cancel_called: false",
    "review_console_bridge_plugin_called: false",
    "review_console_bridge_api_called: false",
    "review_console_bridge_daily_note_called: false",
    "review_console_bridge_vcp_memory_written: false",
    "review_console_bridge_disk_write_performed: false",
    "review_console_bridge_image_created: false",
    "dependency_changed: false",
    "package_manifest_changed: false",
    "lockfile_changed: false",
    "vcpchat_pushed: false",
    "branch_deleted: false",
    "github_release_performed: false"
  ]);

  const forbiddenTrueKeys = [
    "app_launch_performed_by_this_phase",
    "remote_debug_used_by_this_phase",
    "cdp_endpoint_accessed_by_this_phase",
    "runtime_evaluate_performed_by_this_phase",
    "vcpchat_modified_by_this_phase",
    "test_harness_created_by_this_phase",
    "review_console_bridge_load_session_called",
    "review_console_bridge_preview_draft_called",
    "review_console_bridge_submit_draft_called",
    "review_console_bridge_cancel_called",
    "review_console_bridge_plugin_called",
    "review_console_bridge_api_called",
    "review_console_bridge_daily_note_called",
    "review_console_bridge_vcp_memory_written",
    "review_console_bridge_disk_write_performed",
    "review_console_bridge_image_created",
    "dependency_changed",
    "package_manifest_changed",
    "lockfile_changed",
    "vcpchat_pushed",
    "branch_deleted",
    "github_release_performed"
  ];
  const noForbiddenTrue = excludesExactTrueFlags(currentContents, forbiddenTrueKeys);

  const noRawLocalPath = excludesAll(currentContents, [
    "A:\\VCP",
    "A:/VCP",
    "C:\\Users",
    "C:/Users"
  ]);

  const checklistCurrent = includesAll(checklist, [
    "## v7.32 VCPChat One-time Remote Debug Runtime Verification Preflight 检查",
    "docs/184_v7_32_vcpchat_one_time_remote_debug_runtime_verification_preflight.md",
    "review_console/embed_contract/vcpchat_one_time_remote_debug_runtime_verification_preflight.md",
    "tests/schema_examples/v7_32_vcpchat_one_time_remote_debug_runtime_verification_preflight.example.yaml",
    "scripts/validate_v7_32_vcpchat_one_time_remote_debug_runtime_verification_preflight.js",
    "--remote-debugging-port=9222",
    "remote_debug_used_by_this_phase=false",
    "v7.33 VCPChat One-time Remote Debug Runtime Verification Execution"
  ]);

  assert(phaseRecorded, "v7.32 phase must be recorded.");
  assert(commandRecorded, "v7.32 command must be recorded.");
  assert(cdpPolicyRecorded, "v7.32 CDP policy must be recorded.");
  assert(assertionsRecorded, "v7.32 assertions must be recorded.");
  assert(cleanupRecorded, "v7.32 cleanup requirements must be recorded.");
  assert(sideEffectGuardRecorded, "v7.32 side effect guard must be recorded.");
  assert(noForbiddenTrue, "v7.32 must not set execution flags to true.");
  assert(noRawLocalPath, "v7.32 must not save raw local VCP or user paths.");
  assert(checklistCurrent, "validation checklist must include v7.32 checks.");

  process.stdout.write(`${JSON.stringify({
    passed: true,
    v7_32_one_time_remote_debug_runtime_verification_preflight: {
      phase_recorded: phaseRecorded,
      command_recorded: commandRecorded,
      cdp_policy_recorded: cdpPolicyRecorded,
      assertions_recorded: assertionsRecorded,
      cleanup_recorded: cleanupRecorded,
      side_effect_guard_recorded: sideEffectGuardRecorded,
      no_forbidden_true_flags: noForbiddenTrue,
      no_raw_local_path: noRawLocalPath,
      checklist_current: checklistCurrent,
      candidate_remote_debug_port: 9222,
      app_launch_performed_by_this_phase: false,
      remote_debug_used_by_this_phase: false,
      next_safe_phase: "v7.33 VCPChat One-time Remote Debug Runtime Verification Execution"
    }
  }, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
}
