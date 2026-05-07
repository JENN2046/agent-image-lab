const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const currentPhase = "v10.3 A5 bridge integration smoke record";
const previousPhase = "v10.2 A5 bridge smoke blocked record";

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
    "docs/202_v10_3_a5_bridge_integration_smoke_record.md",
    "review_console/embed_contract/v10_3_a5_bridge_integration_smoke_record.md",
    "tests/schema_examples/v10_3_a5_bridge_integration_smoke_record.example.yaml",
    "scripts/validate_v10_3_a5_bridge_integration_smoke_record.js",
    "docs/201_v10_2_a5_bridge_smoke_blocked_record.md",
    "scripts/validate_v10_2_a5_bridge_smoke_blocked_record.js",
    "README.md",
    "MANIFEST.md",
    "RELEASE_NOTES.md",
    "docs/00_project_roadmap.md",
    "tests/validation_checklist.md",
    ".agent_board/RUN_STATE.md",
    ".agent_board/HANDOFF.md",
    ".agent_board/CHECKPOINT.md",
    ".agent_board/TASK_QUEUE.md",
    ".agent_board/VALIDATION_LOG.md",
    ".agent_board/BLOCKERS.md"
  ];
  const missing = requiredFiles.filter((relativePath) => !exists(relativePath));
  assert(missing.length === 0, `Missing v10.3 A5 bridge integration smoke files: ${missing.join(", ")}`);

  const record = read("docs/202_v10_3_a5_bridge_integration_smoke_record.md");
  const contract = read("review_console/embed_contract/v10_3_a5_bridge_integration_smoke_record.md");
  const schema = read("tests/schema_examples/v10_3_a5_bridge_integration_smoke_record.example.yaml");
  const checklist = read("tests/validation_checklist.md");
  const readme = read("README.md");
  const manifest = read("MANIFEST.md");
  const releaseNotes = read("RELEASE_NOTES.md");
  const roadmap = read("docs/00_project_roadmap.md");
  const runState = read(".agent_board/RUN_STATE.md");
  const handoff = read(".agent_board/HANDOFF.md");
  const checkpoint = read(".agent_board/CHECKPOINT.md");
  const taskQueue = read(".agent_board/TASK_QUEUE.md");
  const validationLog = read(".agent_board/VALIDATION_LOG.md");
  const blockers = read(".agent_board/BLOCKERS.md");

  const currentContents = [record, contract, schema].join("\n");
  const indexes = [readme, manifest, releaseNotes, roadmap, checklist].join("\n");
  const board = [runState, handoff, checkpoint, taskQueue, validationLog, blockers].join("\n");

  const phaseRecorded = includesAll(currentContents, [
    currentPhase,
    previousPhase,
    "docs/201_v10_2_a5_bridge_smoke_blocked_record.md",
    "BLOCKED for human review before DoubaoGen"
  ]);

  const authorizationRecorded = includesAll(currentContents, [
    "vcpchat_bridge_file_set_authorized: true",
    "authorization_mode: read_and_modify_minimal_bridge_file_set",
    "raw_vcpchat_root_recorded_in_git: false",
    "modified_vcpchat_file_count: 1",
    "modified_vcpchat_file_ref: redacted_vcpchat_renderer_file",
    "dependency_changed: false",
    "package_manifest_changed: false",
    "lockfile_changed: false"
  ]);

  const bridgePatchRecorded = includesAll(currentContents, [
    "no_write_bridge_exposed: true",
    "imageLabReview_present_after_patch: true",
    "imageLabReviewRuntime_present_after_patch: true",
    "imageLabReviewMount_present_after_patch: true",
    "cancel: true",
    "loadSession: true",
    "previewDraft: true",
    "submitDraft: true",
    "submitDraft_behavior: rejected_no_write",
    "plugin_call_capability_added: false",
    "api_call_capability_added: false",
    "daily_note_write_capability_added: false",
    "vcp_memory_write_capability_added: false",
    "image_creation_capability_added: false"
  ]);

  const strictSmokeRecorded = includesAll(currentContents, [
    "strict_allowlist_smoke_performed: true",
    "- cancel",
    "- loadSession",
    "- previewDraft",
    "bridge_calls_observed: 3",
    "submitDraft_called: false",
    "cancel_ack_status: accepted",
    "loadSession_ack_status: accepted",
    "previewDraft_ack_status: accepted",
    "side_effects_performed: false",
    "plugin_called: false",
    "api_called: false",
    "daily_note_called: false",
    "daily_note_written: false",
    "vcp_memory_written: false",
    "image_created: false",
    "output_file_written: false"
  ]);

  const deviationRecorded = includesAll(currentContents, [
    "initial_submitDraft_rejection_probe_performed: true",
    "initial_submitDraft_probe_result: rejected_no_write",
    "initial_submitDraft_external_side_effects: false",
    "strict_allowlist_smoke_reran_after_deviation: true",
    "human_review_required_before_production_continuation: true",
    "doubaogen_continuation_blocked: true"
  ]);

  const cleanupRecorded = includesAll(currentContents, [
    "remote_debug_runtime_started_for_smoke: true",
    "remote_debug_runtime_closed_after_smoke: true",
    "cdp_port_still_listening_after_cleanup: false",
    "startup_marker_side_effect_restored: true",
    "raw_endpoint_recorded_in_git: false",
    "raw_websocket_url_recorded_in_git: false",
    "raw_runtime_log_recorded_in_git: false"
  ]);

  const forbiddenTrueKeys = [
    "dependency_changed",
    "package_manifest_changed",
    "lockfile_changed",
    "plugin_call_capability_added",
    "api_call_capability_added",
    "daily_note_write_capability_added",
    "vcp_memory_write_capability_added",
    "image_creation_capability_added",
    "side_effects_performed",
    "plugin_called",
    "api_called",
    "daily_note_called",
    "daily_note_written",
    "vcp_memory_written",
    "image_created",
    "output_file_written"
  ];
  const noForbiddenTrue = excludesExactTrueFlags(currentContents, forbiddenTrueKeys);

  const noRawSensitiveValues = excludesAll(currentContents, [
    "A:\\",
    "A:/",
    "C:\\",
    "C:/",
    "http://",
    "https://",
    "ws://",
    "127.0.0.1",
    "localhost",
    "webSocketDebuggerUrl",
    "file:///"
  ]);

  const indexesCurrent = includesAll(indexes, [
    currentPhase,
    "docs/202_v10_3_a5_bridge_integration_smoke_record.md",
    "review_console/embed_contract/v10_3_a5_bridge_integration_smoke_record.md",
    "tests/schema_examples/v10_3_a5_bridge_integration_smoke_record.example.yaml",
    "scripts/validate_v10_3_a5_bridge_integration_smoke_record.js",
    "bridge_calls_observed: 3",
    "human_review_required_before_production_continuation"
  ]);

  const boardCurrentSnapshot = includesAll(board, [
    currentPhase,
    "v10.3 local: VCPChat no-write bridge integration smoke passed with human review gate",
    "strict bridge calls observed: 3",
    "initial submitDraft rejection probe performed: yes",
    "DoubaoGen continuation blocked pending human review"
  ]);
  const boardSupersededByV10_4 = includesAll(board, [
    "v10.4 A5 DoubaoGen single generation rejected asset record",
    "v10.4 local: DoubaoGen single generation completed and asset rejected by safety review",
    "actual plugin calls observed: 1",
    "generated asset status: rejected",
    "memory writes blocked by asset review"
  ]);
  const boardSupersededByV10_5 = includesAll(board, [
    "v10.5 A5 DoubaoGen no-text retry rejected asset record",
    "v10.5 local: DoubaoGen no-text retry completed and asset rejected by safety review",
    "actual plugin calls observed in v10.5: 1",
    "generated asset status in v10.5: rejected",
    "person/text/logo risks detected"
  ]);
  const boardSupersededByV10_6 = includesAll(board, [
    "v10.6 A5 prompt failure analysis and safer strategy",
    "v10.6 local: prompt failure analyzed and safer positive-only strategy recorded",
    "next prompt preview required before real generation",
    "no real generation in v10.6",
    "alternate strategy blocked pending user review"
  ]);
  const boardSupersededByV10_7 = includesAll(board, [
    "v10.7 A5 safer prompt review package",
    "v10.7 local: safer prompt review package ready",
    "prompt risky terms absent",
    "real generation still blocked",
    "user prompt approval required"
  ]);
  const boardCurrent = boardCurrentSnapshot || boardSupersededByV10_4 || boardSupersededByV10_5 || boardSupersededByV10_6 || boardSupersededByV10_7;

  const checklistCurrent = includesAll(checklist, [
    "## v10.3 A5 Bridge Integration Smoke Record 检查",
    "`docs/202_v10_3_a5_bridge_integration_smoke_record.md` 存在",
    "`review_console/embed_contract/v10_3_a5_bridge_integration_smoke_record.md` 存在",
    "`tests/schema_examples/v10_3_a5_bridge_integration_smoke_record.example.yaml` 存在",
    "`scripts/validate_v10_3_a5_bridge_integration_smoke_record.js` 存在",
    "`strict_allowlist_smoke_performed=true`",
    "`bridge_calls_observed=3`",
    "`submitDraft_called=false`",
    "`human_review_required_before_production_continuation=true`",
    "`node scripts/validate_v10_3_a5_bridge_integration_smoke_record.js` 通过"
  ]);

  assert(phaseRecorded, "v10.3 bridge integration smoke phase must be recorded.");
  assert(authorizationRecorded, "v10.3 must record VCPChat bridge file-set authorization.");
  assert(bridgePatchRecorded, "v10.3 must record no-write bridge patch result.");
  assert(strictSmokeRecorded, "v10.3 must record strict allowlist smoke result.");
  assert(deviationRecorded, "v10.3 must record initial submitDraft rejection probe deviation.");
  assert(cleanupRecorded, "v10.3 must record runtime cleanup.");
  assert(noForbiddenTrue, "v10.3 must not set no-write guard flags to true.");
  assert(noRawSensitiveValues, "v10.3 must not save raw paths, endpoints, websocket URLs, or runtime logs.");
  assert(indexesCurrent, "Top-level indexes must reference v10.3 bridge integration smoke record.");
  assert(boardCurrent, "Agent board must retain v10.3 bridge integration smoke state or record a later v10.4/v10.5/v10.6/v10.7 superseding state.");
  assert(checklistCurrent, "Validation checklist must include v10.3 bridge integration smoke checks.");

  process.stdout.write(`${JSON.stringify({
    passed: true,
    v10_3_a5_bridge_integration_smoke_record: {
      phase_recorded: phaseRecorded,
      authorization_recorded: authorizationRecorded,
      bridge_patch_recorded: bridgePatchRecorded,
      strict_smoke_recorded: strictSmokeRecorded,
      deviation_recorded: deviationRecorded,
      cleanup_recorded: cleanupRecorded,
      no_forbidden_true_flags: noForbiddenTrue,
      no_raw_sensitive_values: noRawSensitiveValues,
      indexes_current: indexesCurrent,
      agent_board_current: boardCurrent,
      agent_board_current_snapshot: boardCurrentSnapshot,
      agent_board_superseded_by_v10_4: boardSupersededByV10_4,
      agent_board_superseded_by_v10_5: boardSupersededByV10_5,
      agent_board_superseded_by_v10_6: boardSupersededByV10_6,
      agent_board_superseded_by_v10_7: boardSupersededByV10_7,
      checklist_current: checklistCurrent,
      no_write_bridge_exposed: true,
      strict_allowlist_smoke_performed: true,
      bridge_calls_observed: 3,
      submitDraft_called: false,
      initial_submitDraft_rejection_probe_performed: true,
      human_review_required_before_production_continuation: true,
      doubaogen_continuation_blocked: true,
      next_safe_phase: "human review before A5 production continuation"
    }
  }, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
}
