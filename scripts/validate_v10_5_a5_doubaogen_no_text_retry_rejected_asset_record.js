const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const currentPhase = "v10.5 A5 DoubaoGen no-text retry rejected asset record";
const previousPhase = "v10.4 A5 DoubaoGen single generation rejected asset record";

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
    "docs/204_v10_5_a5_doubaogen_no_text_retry_rejected_asset_record.md",
    "review_console/embed_contract/v10_5_a5_doubaogen_no_text_retry_rejected_asset_record.md",
    "tests/schema_examples/v10_5_a5_doubaogen_no_text_retry_rejected_asset_record.example.yaml",
    "scripts/validate_v10_5_a5_doubaogen_no_text_retry_rejected_asset_record.js",
    "docs/203_v10_4_a5_doubaogen_single_generation_rejected_asset_record.md",
    "scripts/validate_v10_4_a5_doubaogen_single_generation_rejected_asset_record.js",
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
  assert(missing.length === 0, `Missing v10.5 A5 DoubaoGen retry files: ${missing.join(", ")}`);

  const record = read("docs/204_v10_5_a5_doubaogen_no_text_retry_rejected_asset_record.md");
  const contract = read("review_console/embed_contract/v10_5_a5_doubaogen_no_text_retry_rejected_asset_record.md");
  const schema = read("tests/schema_examples/v10_5_a5_doubaogen_no_text_retry_rejected_asset_record.example.yaml");
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
    "docs/203_v10_4_a5_doubaogen_single_generation_rejected_asset_record.md",
    "alternate generation strategy, alternate plugin, or human override"
  ]);

  const authorizationRecorded = includesAll(currentContents, [
    "a5_retry_authorization_present: true",
    "retry_phase: v10.5_a5_doubaogen_no_text_retry",
    "selected_plugin_id: DoubaoGen",
    "selected_plugin_command: generate",
    "selected_plugin_model: doubao-seedream-5-0-260128",
    "max_plugin_calls_authorized: 1",
    "overwrite_existing_files_allowed: false",
    "output_directory_ref: runs/a5_complete_delivery_photo_studio_os_retry_no_text",
    "gatekeeper_approved: true",
    "review_console_human_approved: true",
    "daily_note_direct_write_allowed: false",
    "memory_delta_only: true"
  ]);

  const executionRecorded = includesAll(currentContents, [
    "real_generation_performed: true",
    "actual_plugin_calls: 1",
    "api_called: true",
    "vcp_plugin_called: true",
    "image_file_created: true",
    "generated_asset_count: 1",
    "generated_asset_sha256: 06498714e91a17ccd28981e43a1d96b6ccf9b3803f3766c5694e09376c6d892c",
    "raw_plugin_output_saved: false",
    "raw_endpoint_saved: false",
    "raw_runtime_log_saved: false",
    "secret_value_saved: false",
    "image_binary_saved_to_git_or_memory: false"
  ]);

  const reviewRecorded = includesAll(currentContents, [
    "automated_safety_review_performed: true",
    "asset_status: rejected",
    "no_people_or_faces_observed: false",
    "no_private_data_observed: true",
    "readable_text_or_logo_detected: true",
    "brand_or_logo_risk_detected: true",
    "person_or_face_detected: true",
    "product_still_life_requirement_met: false",
    "candidate_accepted: false",
    "human_override_applied: false"
  ]);

  const memoryBlockedRecorded = includesAll(currentContents, [
    "memory_write_stage_reached: true",
    "memory_write_allowed_by_authorization: false",
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
    "bridge_methods_called_in_v10_5: 0",
    "submitDraft_called: false",
    "additional_plugin_calls_after_review: 0",
    "vcpchat_files_modified_in_v10_5: false",
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
    "docs/204_v10_5_a5_doubaogen_no_text_retry_rejected_asset_record.md",
    "review_console/embed_contract/v10_5_a5_doubaogen_no_text_retry_rejected_asset_record.md",
    "tests/schema_examples/v10_5_a5_doubaogen_no_text_retry_rejected_asset_record.example.yaml",
    "scripts/validate_v10_5_a5_doubaogen_no_text_retry_rejected_asset_record.js",
    "actual_plugin_calls: 1",
    "person_or_face_detected",
    "asset_status: rejected"
  ]);

  const boardCurrentSnapshot = includesAll(board, [
    currentPhase,
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
  const boardCurrent = boardCurrentSnapshot || boardSupersededByV10_6 || boardSupersededByV10_7;

  const checklistCurrent = includesAll(checklist, [
    "## v10.5 A5 DoubaoGen No-text Retry Rejected Asset Record 检查",
    "`docs/204_v10_5_a5_doubaogen_no_text_retry_rejected_asset_record.md` 存在",
    "`review_console/embed_contract/v10_5_a5_doubaogen_no_text_retry_rejected_asset_record.md` 存在",
    "`tests/schema_examples/v10_5_a5_doubaogen_no_text_retry_rejected_asset_record.example.yaml` 存在",
    "`scripts/validate_v10_5_a5_doubaogen_no_text_retry_rejected_asset_record.js` 存在",
    "`actual_plugin_calls=1`",
    "`person_or_face_detected=true`",
    "`asset_status=rejected`",
    "`node scripts/validate_v10_5_a5_doubaogen_no_text_retry_rejected_asset_record.js` 通过"
  ]);

  assert(phaseRecorded, "v10.5 DoubaoGen retry phase must be recorded.");
  assert(authorizationRecorded, "v10.5 must record retry authorization boundaries.");
  assert(executionRecorded, "v10.5 must record single DoubaoGen retry execution result.");
  assert(reviewRecorded, "v10.5 must record automated safety rejection with person/text/logo risk.");
  assert(memoryBlockedRecorded, "v10.5 must record memory writes blocked after rejected asset review.");
  assert(boundaryRecorded, "v10.5 must record boundary and version-action guards.");
  assert(noRawSensitiveValues, "v10.5 must not save raw paths, endpoints, websocket URLs, or runtime logs.");
  assert(indexesCurrent, "Top-level indexes must reference v10.5 DoubaoGen retry record.");
  assert(boardCurrent, "Agent board must retain v10.5 retry state or record a later v10.6/v10.7 superseding state.");
  assert(checklistCurrent, "Validation checklist must include v10.5 DoubaoGen retry checks.");

  process.stdout.write(`${JSON.stringify({
    passed: true,
    v10_5_a5_doubaogen_no_text_retry_rejected_asset_record: {
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
      agent_board_superseded_by_v10_6: boardSupersededByV10_6,
      agent_board_superseded_by_v10_7: boardSupersededByV10_7,
      checklist_current: checklistCurrent,
      selected_plugin_id: "DoubaoGen",
      actual_plugin_calls: 1,
      generated_asset_count: 1,
      asset_status: "rejected",
      person_or_face_detected: true,
      readable_text_or_logo_detected: true,
      memory_write_blocked_by_asset_review: true,
      daily_note_write_performed: false,
      vcp_memory_write_performed: false,
      next_safe_phase: "alternate strategy, alternate plugin, or human override review"
    }
  }, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
}
