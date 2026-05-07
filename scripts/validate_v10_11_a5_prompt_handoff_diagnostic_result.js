const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const currentPhase = "v10.11 A5 prompt handoff diagnostic result";
const previousPhase = "v10.10 A5 prompt handoff diagnostic preflight";
const expectedPromptSha256 = "f9967d3348a24db6a55652a4c7661f4385aa85c4287b45cba420c9495dece9b6";

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
    "docs/210_v10_11_a5_prompt_handoff_diagnostic_result.md",
    "review_console/embed_contract/v10_11_a5_prompt_handoff_diagnostic_result.md",
    "tests/schema_examples/v10_11_a5_prompt_handoff_diagnostic_result.example.yaml",
    "scripts/validate_v10_11_a5_prompt_handoff_diagnostic_result.js",
    "docs/209_v10_10_a5_prompt_handoff_diagnostic_preflight.md",
    "scripts/validate_v10_10_a5_prompt_handoff_diagnostic_preflight.js",
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
  assert(missing.length === 0, `Missing v10.11 prompt handoff diagnostic files: ${missing.join(", ")}`);

  const record = read("docs/210_v10_11_a5_prompt_handoff_diagnostic_result.md");
  const contract = read("review_console/embed_contract/v10_11_a5_prompt_handoff_diagnostic_result.md");
  const schema = read("tests/schema_examples/v10_11_a5_prompt_handoff_diagnostic_result.example.yaml");
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
    "docs/209_v10_10_a5_prompt_handoff_diagnostic_preflight.md",
    "provider-side echo, alternate plugin, prompt redesign, or real generation authorization"
  ]);

  const authorizationRecorded = includesAll(currentContents, [
    "approval_phrase: \"批准 v10.10 传参诊断\"",
    "diagnostic_type: sanitized_request_preflight",
    "prompt_id: a5_positive_still_life_prompt_v1",
    `expected_prompt_sha256_utf8: ${expectedPromptSha256}`,
    "selected_plugin_id: DoubaoGen",
    "selected_plugin_command: generate",
    "selected_plugin_model: doubao-seedream-5-0-260128",
    "max_plugin_calls_authorized: 0",
    "api_call_allowed: false",
    "vcp_plugin_call_allowed: false",
    "image_creation_allowed: false",
    "config_env_value_read_allowed: false"
  ]);

  const diagnosticRecorded = includesAll(currentContents, [
    "diagnostic_performed: true",
    "prompt_source_record_checked: docs/207_v10_8_a5_positive_still_life_generation_preflight_gate.md",
    "prompt_text_recorded_here: false",
    "prompt_chars_observed: 100",
    `prompt_sha256_utf8: ${expectedPromptSha256}`,
    "prompt_hash_matches_expected: true",
    "prompt_id_matches_v10_9: true",
    "prompt_auto_edited_in_v10_9: false",
    "local_runner_file_checked: scripts/run_v0_7_photo_studio_os_real_execution.ps1",
    "local_runner_payload_prompt_source: InputReference",
    "local_runner_payload_model_source: ModelOverride",
    "local_runner_prompt_rewrite_detected: false",
    "private_binding_file_exists: true",
    "private_binding_file_content_read: false",
    "real_plugin_dir_read: false",
    "config_env_value_read: false"
  ]);

  const boundaryRecorded = includesAll(currentContents, [
    "actual_plugin_calls: 0",
    "api_called: false",
    "vcp_plugin_called: false",
    "image_created: false",
    "output_directory_written: false",
    "raw_request_body_saved: false",
    "raw_plugin_output_saved: false",
    "raw_endpoint_saved: false",
    "raw_runtime_log_saved: false",
    "secret_value_saved: false",
    "daily_note_called: false",
    "vcp_memory_written: false",
    "submitDraft_called: false",
    "commit_performed: false",
    "tag_performed: false",
    "push_performed: false",
    "pr_created: false",
    "github_release_created: false"
  ]);

  const interpretationRecorded = includesAll(currentContents, [
    "prompt_text_wrong_in_repo: false",
    "local_prompt_hash_mismatch: false",
    "local_runner_handoff_mismatch_detected: false",
    "provider_side_request_observed: false",
    "root_cause_fully_known: false",
    "model_adherence_failure_still_possible: true",
    "provider_or_plugin_side_handoff_failure_not_ruled_out: true"
  ]);

  const noForbiddenTrueExecution = excludesAll(currentContents, [
    "actual_plugin_calls: 1",
    "api_" + "called: true",
    "vcp_plugin_" + "called: true",
    "image_created: true",
    "output_directory_written: true",
    "daily_note_" + "called: true",
    "vcp_memory_written: true",
    "submitDraft_called: true",
    "commit_performed: true",
    "tag_performed: true",
    "push_performed: true",
    "pr_created: true",
    "github_release_created: true",
    "raw_request_body_saved: true",
    "raw_endpoint_saved: true",
    "raw_runtime_log_saved: true",
    "secret_value_saved: true"
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
    "docs/210_v10_11_a5_prompt_handoff_diagnostic_result.md",
    "review_console/embed_contract/v10_11_a5_prompt_handoff_diagnostic_result.md",
    "tests/schema_examples/v10_11_a5_prompt_handoff_diagnostic_result.example.yaml",
    "scripts/validate_v10_11_a5_prompt_handoff_diagnostic_result.js",
    "prompt_hash_matches_expected: true",
    "actual_plugin_calls: 0",
    "provider_side_request_observed: false"
  ]);

  const boardCurrentSnapshot = includesAll(board, [
    currentPhase,
    "v10.11 local: prompt handoff diagnostic completed",
    "prompt hash matches expected",
    "actual plugin calls observed in v10.11: 0",
    "provider-side request remains unobserved"
  ]);
  const boardSupersededByV10_12 = includesAll(board, [
    "v10.12 A5 provider-side prompt fingerprint capture authorization package",
    "v10.12 local: provider-side prompt fingerprint capture authorization package ready",
    "authorization status: inactive package",
    "execution authorized by v10.12: false",
    "provider-side capture not performed"
  ]);
  const boardCurrent = boardCurrentSnapshot || boardSupersededByV10_12;

  const checklistCurrent = includesAll(checklist, [
    "## v10.11 A5 Prompt Handoff Diagnostic Result 检查",
    "`docs/210_v10_11_a5_prompt_handoff_diagnostic_result.md` 存在",
    "`review_console/embed_contract/v10_11_a5_prompt_handoff_diagnostic_result.md` 存在",
    "`tests/schema_examples/v10_11_a5_prompt_handoff_diagnostic_result.example.yaml` 存在",
    "`scripts/validate_v10_11_a5_prompt_handoff_diagnostic_result.js` 存在",
    "`prompt_hash_matches_expected=true`",
    "`actual_plugin_calls=0`",
    "`provider_side_request_observed=false`",
    "`node scripts/validate_v10_11_a5_prompt_handoff_diagnostic_result.js` 通过"
  ]);

  assert(phaseRecorded, "v10.11 diagnostic result phase must be recorded.");
  assert(authorizationRecorded, "v10.11 must record diagnostic authorization boundaries.");
  assert(diagnosticRecorded, "v10.11 must record diagnostic result.");
  assert(boundaryRecorded, "v10.11 must record no-generation boundary.");
  assert(interpretationRecorded, "v10.11 must record interpretation limits.");
  assert(noForbiddenTrueExecution, "v10.11 must not record real execution or version action.");
  assert(noRawSensitiveValues, "v10.11 must not save raw paths, endpoints, websocket URLs, or runtime logs.");
  assert(indexesCurrent, "Top-level indexes must reference v10.11 diagnostic result.");
  assert(boardCurrent, "Agent board must be synchronized to v10.11 diagnostic result or record a later v10.12 superseding state.");
  assert(checklistCurrent, "Validation checklist must include v10.11 diagnostic result checks.");

  process.stdout.write(`${JSON.stringify({
    passed: true,
    v10_11_a5_prompt_handoff_diagnostic_result: {
      phase_recorded: phaseRecorded,
      authorization_recorded: authorizationRecorded,
      diagnostic_recorded: diagnosticRecorded,
      boundary_recorded: boundaryRecorded,
      interpretation_recorded: interpretationRecorded,
      no_forbidden_true_execution: noForbiddenTrueExecution,
      no_raw_sensitive_values: noRawSensitiveValues,
      indexes_current: indexesCurrent,
      agent_board_current: boardCurrent,
      agent_board_current_snapshot: boardCurrentSnapshot,
      agent_board_superseded_by_v10_12: boardSupersededByV10_12,
      checklist_current: checklistCurrent,
      prompt_hash_matches_expected: true,
      local_runner_prompt_rewrite_detected: false,
      actual_plugin_calls: 0,
      api_called: false,
      image_created: false,
      provider_side_request_observed: false,
      root_cause_fully_known: false,
      next_safe_phase: "provider-side echo or alternate plugin strategy under new authorization"
    }
  }, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
}
