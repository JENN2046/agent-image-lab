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
    "docs/185_v7_33_vcpchat_one_time_remote_debug_runtime_verification_record.md",
    "review_console/embed_contract/vcpchat_one_time_remote_debug_runtime_verification_record.md",
    "tests/schema_examples/v7_33_vcpchat_one_time_remote_debug_runtime_verification_record.example.yaml",
    "scripts/validate_v7_33_vcpchat_one_time_remote_debug_runtime_verification_record.js",
    "tests/validation_checklist.md",
    "docs/184_v7_32_vcpchat_one_time_remote_debug_runtime_verification_preflight.md"
  ];
  const missing = requiredFiles.filter((relativePath) => !exists(relativePath));
  assert(missing.length === 0, `Missing v7.33 remote-debug record files: ${missing.join(", ")}`);

  const currentFiles = [
    "docs/185_v7_33_vcpchat_one_time_remote_debug_runtime_verification_record.md",
    "review_console/embed_contract/vcpchat_one_time_remote_debug_runtime_verification_record.md",
    "tests/schema_examples/v7_33_vcpchat_one_time_remote_debug_runtime_verification_record.example.yaml"
  ];
  const contents = requiredFiles
    .filter((relativePath) => !relativePath.endsWith(".js"))
    .map((relativePath) => read(relativePath))
    .join("\n");
  const currentContents = currentFiles.map((relativePath) => read(relativePath)).join("\n");
  const checklist = read("tests/validation_checklist.md");

  const phaseRecorded = includesAll(contents, [
    "v7.33 vcpchat one-time remote-debug runtime verification record",
    "current_head: fe62ef1",
    "head_commit_short: fe62ef1",
    "docs/184_v7_32_vcpchat_one_time_remote_debug_runtime_verification_preflight.md",
    "v7.34 VCPChat Review Console Runtime Verification Closeout"
  ]);

  const launchRecorded = includesAll(currentContents, [
    "app_launch_performed: true",
    "remote_debug_used: true",
    "cdp_endpoint_accessed: true",
    "runtime_evaluate_performed: true",
    "target_debug_title: VCPChat"
  ]);

  const bridgeRecorded = includesAll(currentContents, [
    "window_image_lab_review_exists: true",
    "image_lab_review_keys:",
    "cancel",
    "loadSession",
    "previewDraft",
    "submitDraft",
    "image_lab_review_extra_keys: []",
    "load_session_type: function",
    "preview_draft_type: function",
    "submit_draft_type: function",
    "cancel_type: function"
  ]);

  const runtimeRecorded = includesAll(currentContents, [
    "image_lab_review_mount_exists: true",
    "image_lab_review_mount_hidden: true",
    "image_lab_review_mount_runtime_status: ready",
    "window_image_lab_review_runtime_exists: true",
    "create_draft_bundle_type: function"
  ]);

  const draftRecorded = includesAll(currentContents, [
    "create_draft_bundle_called: true",
    "bundle_created: true",
    "has_review_session_draft: true",
    "has_image_case_draft: true",
    "has_memory_delta_draft: true",
    "api_called: false",
    "daily_note_called: false",
    "vcp_plugin_called: false",
    "disk_write_performed: false",
    "image_file_created: false"
  ]);

  const bridgeGuardRecorded = includesAll(currentContents, [
    "bridge_load_session_called: false",
    "bridge_preview_draft_called: false",
    "bridge_submit_draft_called: false",
    "bridge_cancel_called: false",
    "review_console_bridge_plugin_called: false",
    "review_console_bridge_api_called: false",
    "review_console_bridge_daily_note_called: false",
    "review_console_bridge_vcp_memory_written: false",
    "review_console_bridge_disk_write_performed: false",
    "review_console_bridge_image_created: false"
  ]);

  const cleanupRecorded = includesAll(currentContents, [
    "launched_process_tree_closed: true",
    "port_9222_no_running_owner_after_cleanup: true",
    "startup_side_effect_observed: true",
    "startup_side_effect_path: .vcp_ready",
    "startup_side_effect_restored: true",
    "vcpchat_worktree_clean_after_restore: true",
    "vcpchat_pushed: false"
  ]);

  const resultRecorded = includesAll(currentContents, [
    "window_level_smoke: passed",
    "renderer_global_smoke: passed",
    "prototype_guard_smoke: passed",
    "repository_cleanliness_restored: true",
    "overall_runtime_smoke_result: passed"
  ]);

  const forbiddenTrueKeys = [
    "bridge_load_session_called",
    "bridge_preview_draft_called",
    "bridge_submit_draft_called",
    "bridge_cancel_called",
    "review_console_bridge_plugin_called",
    "review_console_bridge_api_called",
    "review_console_bridge_daily_note_called",
    "review_console_bridge_vcp_memory_written",
    "review_console_bridge_disk_write_performed",
    "review_console_bridge_image_created",
    "vcpchat_modified_by_codex",
    "test_harness_created",
    "dependency_changed",
    "package_manifest_changed",
    "lockfile_changed",
    "secret_value_copied",
    "raw_local_path_saved",
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
    "## v7.33 VCPChat One-time Remote Debug Runtime Verification Record 检查",
    "docs/185_v7_33_vcpchat_one_time_remote_debug_runtime_verification_record.md",
    "review_console/embed_contract/vcpchat_one_time_remote_debug_runtime_verification_record.md",
    "tests/schema_examples/v7_33_vcpchat_one_time_remote_debug_runtime_verification_record.example.yaml",
    "scripts/validate_v7_33_vcpchat_one_time_remote_debug_runtime_verification_record.js",
    "renderer_global_smoke=passed",
    "prototype_guard_smoke=passed",
    ".vcp_ready"
  ]);

  assert(phaseRecorded, "v7.33 phase must be recorded.");
  assert(launchRecorded, "v7.33 launch and CDP execution must be recorded.");
  assert(bridgeRecorded, "v7.33 bridge verification must be recorded.");
  assert(runtimeRecorded, "v7.33 runtime verification must be recorded.");
  assert(draftRecorded, "v7.33 draft bundle verification must be recorded.");
  assert(bridgeGuardRecorded, "v7.33 bridge invocation guard must be recorded.");
  assert(cleanupRecorded, "v7.33 cleanup state must be recorded.");
  assert(resultRecorded, "v7.33 result must be recorded.");
  assert(noForbiddenTrue, "v7.33 must not set forbidden bridge or repository flags to true.");
  assert(noRawLocalPath, "v7.33 must not save raw local VCP or user paths.");
  assert(checklistCurrent, "validation checklist must include v7.33 checks.");

  process.stdout.write(`${JSON.stringify({
    passed: true,
    v7_33_one_time_remote_debug_runtime_verification_record: {
      phase_recorded: phaseRecorded,
      launch_recorded: launchRecorded,
      bridge_recorded: bridgeRecorded,
      runtime_recorded: runtimeRecorded,
      draft_recorded: draftRecorded,
      bridge_guard_recorded: bridgeGuardRecorded,
      cleanup_recorded: cleanupRecorded,
      result_recorded: resultRecorded,
      no_forbidden_true_flags: noForbiddenTrue,
      no_raw_local_path: noRawLocalPath,
      checklist_current: checklistCurrent,
      renderer_global_smoke: "passed",
      prototype_guard_smoke: "passed",
      overall_runtime_smoke_result: "passed",
      next_safe_phase: "v7.34 VCPChat Review Console Runtime Verification Closeout"
    }
  }, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
}
