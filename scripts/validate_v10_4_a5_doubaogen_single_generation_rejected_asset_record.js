const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const currentPhase = "v10.4 A5 DoubaoGen single generation rejected asset record";
const previousPhase = "v10.3 A5 bridge integration smoke record";

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

function main() {
  const requiredFiles = [
    "docs/203_v10_4_a5_doubaogen_single_generation_rejected_asset_record.md",
    "review_console/embed_contract/v10_4_a5_doubaogen_single_generation_rejected_asset_record.md",
    "tests/schema_examples/v10_4_a5_doubaogen_single_generation_rejected_asset_record.example.yaml",
    "scripts/validate_v10_4_a5_doubaogen_single_generation_rejected_asset_record.js",
    "docs/202_v10_3_a5_bridge_integration_smoke_record.md",
    "scripts/validate_v10_3_a5_bridge_integration_smoke_record.js",
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
  assert(missing.length === 0, `Missing v10.4 A5 DoubaoGen rejected asset files: ${missing.join(", ")}`);

  const record = read("docs/203_v10_4_a5_doubaogen_single_generation_rejected_asset_record.md");
  const contract = read("review_console/embed_contract/v10_4_a5_doubaogen_single_generation_rejected_asset_record.md");
  const schema = read("tests/schema_examples/v10_4_a5_doubaogen_single_generation_rejected_asset_record.example.yaml");
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
    "docs/202_v10_3_a5_bridge_integration_smoke_record.md",
    "memory writes remain blocked because the asset was rejected"
  ]);

  const authorizationRecorded = includesAll(currentContents, [
    "a5_production_continuation_authorized_after_human_review: true",
    "selected_plugin_id: DoubaoGen",
    "selected_plugin_command: generate",
    "selected_plugin_model: doubao-seedream-5-0-260128",
    "max_plugin_calls_authorized: 1",
    "overwrite_existing_files_allowed: false",
    "output_directory_ref: runs/a5_complete_delivery_photo_studio_os",
    "gatekeeper_approved: true",
    "review_console_human_approved: true",
    "github_release_allowed: false"
  ]);

  const executionRecorded = includesAll(currentContents, [
    "real_generation_performed: true",
    "actual_plugin_calls: 1",
    "api_called: true",
    "vcp_plugin_called: true",
    "image_file_created: true",
    "generated_asset_count: 1",
    "generated_asset_sha256: 430b313954d1abb72ca32e9ab0778572b288772a1ed073e231822e4d3c544215",
    "raw_plugin_output_saved: false",
    "raw_endpoint_saved: false",
    "raw_runtime_log_saved: false",
    "secret_value_saved: false",
    "image_binary_saved_to_git_or_memory: false"
  ]);

  const reviewRecorded = includesAll(currentContents, [
    "automated_safety_review_performed: true",
    "asset_status: rejected",
    "no_people_or_faces_observed: true",
    "no_private_data_observed: true",
    "readable_text_or_logo_detected: true",
    "brand_or_logo_risk_detected: true",
    "candidate_accepted: false",
    "human_override_applied: false"
  ]);

  const memoryBlockedRecorded = includesAll(currentContents, [
    "memory_write_stage_reached: true",
    "memory_write_allowed_by_authorization: true",
    "memory_write_blocked_by_asset_review: true",
    "daily_note_write_performed: false",
    "vcp_memory_write_performed: false",
    "max_daily_note_writes_observed: 0",
    "max_vcp_memory_writes_observed: 0",
    "memory_delta_only: true",
    "memory_delta_request_generated_by_runner: true",
    "memory_delta_applied: false"
  ]);

  const boundaryRecorded = includesAll(currentContents, [
    "bridge_methods_called_in_v10_4: 0",
    "submitDraft_called: false",
    "additional_plugin_calls_after_review: 0",
    "vcpchat_files_modified_in_v10_4: false",
    "vcptoolbox_files_modified: false",
    "dependency_changed: false",
    "package_manifest_changed: false",
    "lockfile_changed: false",
    "commit_performed: false",
    "tag_performed: false",
    "push_performed: false",
    "pr_created: false",
    "github_release_created: false"
  ]);

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
    "docs/203_v10_4_a5_doubaogen_single_generation_rejected_asset_record.md",
    "review_console/embed_contract/v10_4_a5_doubaogen_single_generation_rejected_asset_record.md",
    "tests/schema_examples/v10_4_a5_doubaogen_single_generation_rejected_asset_record.example.yaml",
    "scripts/validate_v10_4_a5_doubaogen_single_generation_rejected_asset_record.js",
    "actual_plugin_calls: 1",
    "asset_status: rejected",
    "memory_write_blocked_by_asset_review"
  ]);

  const boardCurrentSnapshot = includesAll(board, [
    currentPhase,
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
  const boardCurrent = boardCurrentSnapshot || boardSupersededByV10_5 || boardSupersededByV10_6 || boardSupersededByV10_7;

  const checklistCurrent = includesAll(checklist, [
    "## v10.4 A5 DoubaoGen Single Generation Rejected Asset Record 检查",
    "`docs/203_v10_4_a5_doubaogen_single_generation_rejected_asset_record.md` 存在",
    "`review_console/embed_contract/v10_4_a5_doubaogen_single_generation_rejected_asset_record.md` 存在",
    "`tests/schema_examples/v10_4_a5_doubaogen_single_generation_rejected_asset_record.example.yaml` 存在",
    "`scripts/validate_v10_4_a5_doubaogen_single_generation_rejected_asset_record.js` 存在",
    "`actual_plugin_calls=1`",
    "`asset_status=rejected`",
    "`memory_write_blocked_by_asset_review=true`",
    "`node scripts/validate_v10_4_a5_doubaogen_single_generation_rejected_asset_record.js` 通过"
  ]);

  assert(phaseRecorded, "v10.4 DoubaoGen rejected asset phase must be recorded.");
  assert(authorizationRecorded, "v10.4 must record A5 production continuation authorization boundaries.");
  assert(executionRecorded, "v10.4 must record single DoubaoGen execution result.");
  assert(reviewRecorded, "v10.4 must record automated safety rejection.");
  assert(memoryBlockedRecorded, "v10.4 must record memory writes blocked by rejected asset review.");
  assert(boundaryRecorded, "v10.4 must record boundary and version-action guards.");
  assert(noRawSensitiveValues, "v10.4 must not save raw paths, endpoints, websocket URLs, or runtime logs.");
  assert(indexesCurrent, "Top-level indexes must reference v10.4 DoubaoGen rejected asset record.");
  assert(boardCurrent, "Agent board must retain v10.4 rejected asset state or record a later v10.5/v10.6/v10.7 superseding state.");
  assert(checklistCurrent, "Validation checklist must include v10.4 DoubaoGen rejected asset checks.");

  process.stdout.write(`${JSON.stringify({
    passed: true,
    v10_4_a5_doubaogen_single_generation_rejected_asset_record: {
      phase_recorded: phaseRecorded,
      authorization_recorded: authorizationRecorded,
      execution_recorded: executionRecorded,
      review_recorded: reviewRecorded,
      memory_blocked_recorded: memoryBlockedRecorded,
      boundary_recorded: boundaryRecorded,
      no_raw_sensitive_values: noRawSensitiveValues,
      indexes_current: indexesCurrent,
      agent_board_current: boardCurrent,
      agent_board_current_snapshot: boardCurrentSnapshot,
      agent_board_superseded_by_v10_5: boardSupersededByV10_5,
      agent_board_superseded_by_v10_6: boardSupersededByV10_6,
      agent_board_superseded_by_v10_7: boardSupersededByV10_7,
      checklist_current: checklistCurrent,
      selected_plugin_id: "DoubaoGen",
      actual_plugin_calls: 1,
      generated_asset_count: 1,
      asset_status: "rejected",
      memory_write_blocked_by_asset_review: true,
      daily_note_write_performed: false,
      vcp_memory_write_performed: false,
      next_safe_phase: "new retry authorization or human override review"
    }
  }, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
}
