const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const currentPhase = "v10.9 A5 positive still-life generation rejected asset record";
const previousPhase = "v10.8 A5 positive still-life generation preflight gate";

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
    "docs/208_v10_9_a5_positive_still_life_generation_rejected_asset_record.md",
    "review_console/embed_contract/v10_9_a5_positive_still_life_generation_rejected_asset_record.md",
    "tests/schema_examples/v10_9_a5_positive_still_life_generation_rejected_asset_record.example.yaml",
    "scripts/validate_v10_9_a5_positive_still_life_generation_rejected_asset_record.js",
    "docs/207_v10_8_a5_positive_still_life_generation_preflight_gate.md",
    "scripts/validate_v10_8_a5_positive_still_life_generation_preflight_gate.js",
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
  assert(missing.length === 0, `Missing v10.9 positive still-life rejected asset files: ${missing.join(", ")}`);

  const record = read("docs/208_v10_9_a5_positive_still_life_generation_rejected_asset_record.md");
  const contract = read("review_console/embed_contract/v10_9_a5_positive_still_life_generation_rejected_asset_record.md");
  const schema = read("tests/schema_examples/v10_9_a5_positive_still_life_generation_rejected_asset_record.example.yaml");
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
    "docs/207_v10_8_a5_positive_still_life_generation_preflight_gate.md",
    "alternate generation strategy, alternate plugin, or human override"
  ]);

  const authorizationRecorded = includesAll(currentContents, [
    "short_approval_template_used: true",
    "short_approval_phrase: \"批准 v10.8 静物单次生成\"",
    "private_plugin_dir_binding_used: true",
    "private_plugin_dir_raw_path_saved: false",
    "selected_plugin_id: DoubaoGen",
    "selected_plugin_command: generate",
    "selected_plugin_model: doubao-seedream-5-0-260128",
    "max_plugin_calls_authorized: 1",
    "prompt_id: a5_positive_still_life_prompt_v1",
    "prompt_auto_edited: false",
    "overwrite_existing_files_allowed: false",
    "output_directory_ref: runs/a5_positive_still_life_prompt_v1",
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
    "generated_asset_ref: runs/a5_positive_still_life_prompt_v1/image/doubaogen/35bc0610-3f7c-4295-887b-8b2a2dcf8999.jpg",
    "generated_asset_sha256: 4a6aff4ff19127d8e817439ee585fa7eaf55874a1c6408abb3b76bde9e67092f",
    "generated_asset_bytes: 336179",
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
    "readable_text_or_logo_detected: false",
    "brand_or_logo_risk_detected: false",
    "person_or_face_detected: true",
    "product_still_life_requirement_met: false",
    "prompt_subject_match: false",
    "camera_lens_subject_present: false",
    "studio_tabletop_still_life_present: false",
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
    "bridge_methods_called_in_v10_9: 0",
    "submitDraft_called: false",
    "additional_plugin_calls_after_review: 0",
    "vcpchat_files_modified_in_v10_9: false",
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
    "docs/208_v10_9_a5_positive_still_life_generation_rejected_asset_record.md",
    "review_console/embed_contract/v10_9_a5_positive_still_life_generation_rejected_asset_record.md",
    "tests/schema_examples/v10_9_a5_positive_still_life_generation_rejected_asset_record.example.yaml",
    "scripts/validate_v10_9_a5_positive_still_life_generation_rejected_asset_record.js",
    "actual_plugin_calls: 1",
    "person_or_face_detected",
    "prompt_subject_match: false",
    "asset_status: rejected"
  ]);

  const boardCurrentSnapshot = includesAll(board, [
    currentPhase,
    "v10.9 local: positive still-life generation completed and asset rejected by safety review",
    "actual plugin calls observed in v10.9: 1",
    "generated asset status in v10.9: rejected",
    "person/face and prompt mismatch detected"
  ]);
  const boardSupersededByV10_10 = includesAll(board, [
    "v10.10 A5 prompt handoff diagnostic preflight",
    "v10.10 local: prompt handoff diagnostic preflight ready",
    "max plugin calls allowed in v10.10: 0",
    "no generation in v10.10",
    "diagnostic authorization still inactive"
  ]);
  const boardCurrent = boardCurrentSnapshot || boardSupersededByV10_10;

  const checklistCurrent = includesAll(checklist, [
    "## v10.9 A5 Positive Still-life Generation Rejected Asset Record 检查",
    "`docs/208_v10_9_a5_positive_still_life_generation_rejected_asset_record.md` 存在",
    "`review_console/embed_contract/v10_9_a5_positive_still_life_generation_rejected_asset_record.md` 存在",
    "`tests/schema_examples/v10_9_a5_positive_still_life_generation_rejected_asset_record.example.yaml` 存在",
    "`scripts/validate_v10_9_a5_positive_still_life_generation_rejected_asset_record.js` 存在",
    "`actual_plugin_calls=1`",
    "`person_or_face_detected=true`",
    "`prompt_subject_match=false`",
    "`asset_status=rejected`",
    "`node scripts/validate_v10_9_a5_positive_still_life_generation_rejected_asset_record.js` 通过"
  ]);

  assert(phaseRecorded, "v10.9 positive still-life generation phase must be recorded.");
  assert(authorizationRecorded, "v10.9 must record short approval and generation authorization boundaries.");
  assert(executionRecorded, "v10.9 must record single DoubaoGen execution result.");
  assert(reviewRecorded, "v10.9 must record safety rejection with person/face and prompt mismatch.");
  assert(memoryBlockedRecorded, "v10.9 must record memory writes blocked after rejected asset review.");
  assert(boundaryRecorded, "v10.9 must record boundary and version-action guards.");
  assert(noRawSensitiveValues, "v10.9 must not save raw paths, endpoints, websocket URLs, or runtime logs.");
  assert(indexesCurrent, "Top-level indexes must reference v10.9 positive still-life rejected asset record.");
  assert(boardCurrent, "Agent board must be synchronized to v10.9 rejected asset state or record a later v10.10 superseding state.");
  assert(checklistCurrent, "Validation checklist must include v10.9 positive still-life rejected asset checks.");

  process.stdout.write(`${JSON.stringify({
    passed: true,
    v10_9_a5_positive_still_life_generation_rejected_asset_record: {
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
      agent_board_superseded_by_v10_10: boardSupersededByV10_10,
      checklist_current: checklistCurrent,
      selected_plugin_id: "DoubaoGen",
      prompt_id: "a5_positive_still_life_prompt_v1",
      actual_plugin_calls: 1,
      generated_asset_count: 1,
      asset_status: "rejected",
      person_or_face_detected: true,
      prompt_subject_match: false,
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
