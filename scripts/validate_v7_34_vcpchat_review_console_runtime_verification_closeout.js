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
    "docs/186_v7_34_vcpchat_review_console_runtime_verification_closeout.md",
    "review_console/embed_contract/vcpchat_review_console_runtime_verification_closeout.md",
    "tests/schema_examples/v7_34_vcpchat_review_console_runtime_verification_closeout.example.yaml",
    "scripts/validate_v7_34_vcpchat_review_console_runtime_verification_closeout.js",
    "tests/validation_checklist.md",
    "docs/185_v7_33_vcpchat_one_time_remote_debug_runtime_verification_record.md"
  ];
  const missing = requiredFiles.filter((relativePath) => !exists(relativePath));
  assert(missing.length === 0, `Missing v7.34 runtime verification closeout files: ${missing.join(", ")}`);

  const currentFiles = [
    "docs/186_v7_34_vcpchat_review_console_runtime_verification_closeout.md",
    "review_console/embed_contract/vcpchat_review_console_runtime_verification_closeout.md",
    "tests/schema_examples/v7_34_vcpchat_review_console_runtime_verification_closeout.example.yaml"
  ];
  const contents = requiredFiles
    .filter((relativePath) => !relativePath.endsWith(".js"))
    .map((relativePath) => read(relativePath))
    .join("\n");
  const currentContents = currentFiles.map((relativePath) => read(relativePath)).join("\n");
  const checklist = read("tests/validation_checklist.md");

  const phaseRecorded = includesAll(contents, [
    "v7.34 vcpchat review console runtime verification closeout",
    "current_head: c3e191b",
    "head_commit_short: c3e191b",
    "docs/185_v7_33_vcpchat_one_time_remote_debug_runtime_verification_record.md",
    "v7.35 VCPChat Review Console Runtime Follow-up Planning"
  ]);

  const evidenceRecorded = includesAll(currentContents, [
    "v7_30_window_level_smoke: passed",
    "v7_33_renderer_global_smoke: passed",
    "v7_33_prototype_guard_smoke: passed",
    "v7_33_overall_runtime_smoke_result: passed"
  ]);

  const surfaceRecorded = includesAll(currentContents, [
    "window_image_lab_review_exists: true",
    "loadSession",
    "previewDraft",
    "submitDraft",
    "cancel",
    "image_lab_review_extra_keys: []",
    "image_lab_review_mount_exists: true",
    "image_lab_review_mount_runtime_status: ready",
    "window_image_lab_review_runtime_exists: true",
    "create_draft_bundle_available: true",
    "review_session_draft_available: true",
    "image_case_draft_available: true",
    "memory_delta_draft_available: true"
  ]);

  const guardRecorded = includesAll(currentContents, [
    "api_called: false",
    "daily_note_called: false",
    "vcp_plugin_called: false",
    "disk_write_performed: false",
    "image_file_created: false",
    "bridge_load_session_called: false",
    "bridge_preview_draft_called: false",
    "bridge_submit_draft_called: false",
    "bridge_cancel_called: false"
  ]);

  const sideEffectRecorded = includesAll(currentContents, [
    "side_effect_path: .vcp_ready",
    "v7.30",
    "v7.33",
    "restored_after_each_test: true",
    "vcpchat_worktree_clean_after_restore: true"
  ]);

  const decisionRecorded = includesAll(currentContents, [
    "review_console_bridge_runtime_verified: true",
    "verification_method: one_time_remote_debug_runtime_evaluate",
    "safe_to_mark_bridge_runtime_verified: true",
    "safe_to_claim_production_e2e: false"
  ]);

  const cleanStateRecorded = includesAll(currentContents, [
    "vcpchat_head_after_verification: b320e39",
    "vcpchat_worktree_clean_after_verification: true",
    "remote_debug_port_left_open: false",
    "launched_process_tree_left_running: false",
    "vcpchat_pushed: false",
    "vcpchat_modified_by_v7_34: false",
    "dependency_changed: false"
  ]);

  const forbiddenTrueKeys = [
    "safe_to_claim_production_e2e",
    "remote_debug_port_left_open",
    "launched_process_tree_left_running",
    "vcpchat_pushed",
    "vcpchat_modified_by_v7_34",
    "dependency_changed",
    "review_console_bridge_plugin_called",
    "review_console_bridge_api_called",
    "review_console_bridge_daily_note_called",
    "review_console_bridge_vcp_memory_written",
    "review_console_bridge_disk_write_performed",
    "review_console_bridge_image_created"
  ];
  const noForbiddenTrue = excludesExactTrueFlags(currentContents, forbiddenTrueKeys);

  const noRawLocalPath = excludesAll(currentContents, [
    "A:\\VCP",
    "A:/VCP",
    "C:\\Users",
    "C:/Users"
  ]);

  const checklistCurrent = includesAll(checklist, [
    "## v7.34 VCPChat Review Console Runtime Verification Closeout 检查",
    "docs/186_v7_34_vcpchat_review_console_runtime_verification_closeout.md",
    "review_console/embed_contract/vcpchat_review_console_runtime_verification_closeout.md",
    "tests/schema_examples/v7_34_vcpchat_review_console_runtime_verification_closeout.example.yaml",
    "scripts/validate_v7_34_vcpchat_review_console_runtime_verification_closeout.js",
    "review_console_bridge_runtime_verified=true",
    "safe_to_claim_production_e2e=false",
    ".vcp_ready"
  ]);

  assert(phaseRecorded, "v7.34 phase must be recorded.");
  assert(evidenceRecorded, "v7.34 evidence summary must be recorded.");
  assert(surfaceRecorded, "v7.34 verified runtime surface must be recorded.");
  assert(guardRecorded, "v7.34 guard result must be recorded.");
  assert(sideEffectRecorded, "v7.34 known runtime side effect must be recorded.");
  assert(decisionRecorded, "v7.34 closeout decision must be recorded.");
  assert(cleanStateRecorded, "v7.34 clean repository/process state must be recorded.");
  assert(noForbiddenTrue, "v7.34 must not set forbidden flags to true.");
  assert(noRawLocalPath, "v7.34 must not save raw local VCP or user paths.");
  assert(checklistCurrent, "validation checklist must include v7.34 checks.");

  process.stdout.write(`${JSON.stringify({
    passed: true,
    v7_34_review_console_runtime_verification_closeout: {
      phase_recorded: phaseRecorded,
      evidence_recorded: evidenceRecorded,
      surface_recorded: surfaceRecorded,
      guard_recorded: guardRecorded,
      side_effect_recorded: sideEffectRecorded,
      decision_recorded: decisionRecorded,
      clean_state_recorded: cleanStateRecorded,
      no_forbidden_true_flags: noForbiddenTrue,
      no_raw_local_path: noRawLocalPath,
      checklist_current: checklistCurrent,
      review_console_bridge_runtime_verified: true,
      safe_to_claim_production_e2e: false,
      next_safe_phase: "v7.35 VCPChat Review Console Runtime Follow-up Planning"
    }
  }, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
}
