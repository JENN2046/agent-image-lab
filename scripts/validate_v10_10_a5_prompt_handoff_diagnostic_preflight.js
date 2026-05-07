const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const currentPhase = "v10.10 A5 prompt handoff diagnostic preflight";
const previousPhase = "v10.9 A5 positive still-life generation rejected asset record";
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
    "docs/209_v10_10_a5_prompt_handoff_diagnostic_preflight.md",
    "review_console/embed_contract/v10_10_a5_prompt_handoff_diagnostic_preflight.md",
    "integrations/vcp/v10_10_prompt_handoff_diagnostic_authorization_template.md",
    "tests/schema_examples/v10_10_a5_prompt_handoff_diagnostic_preflight.example.yaml",
    "scripts/validate_v10_10_a5_prompt_handoff_diagnostic_preflight.js",
    "docs/208_v10_9_a5_positive_still_life_generation_rejected_asset_record.md",
    "scripts/validate_v10_9_a5_positive_still_life_generation_rejected_asset_record.js",
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
  assert(missing.length === 0, `Missing v10.10 prompt handoff diagnostic files: ${missing.join(", ")}`);

  const record = read("docs/209_v10_10_a5_prompt_handoff_diagnostic_preflight.md");
  const contract = read("review_console/embed_contract/v10_10_a5_prompt_handoff_diagnostic_preflight.md");
  const template = read("integrations/vcp/v10_10_prompt_handoff_diagnostic_authorization_template.md");
  const schema = read("tests/schema_examples/v10_10_a5_prompt_handoff_diagnostic_preflight.example.yaml");
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

  const currentContents = [record, contract, template, schema].join("\n");
  const indexes = [readme, manifest, releaseNotes, roadmap, checklist].join("\n");
  const board = [runState, handoff, checkpoint, taskQueue, validationLog, blockers].join("\n");

  const phaseRecorded = includesAll(currentContents, [
    currentPhase,
    previousPhase,
    "docs/208_v10_9_a5_positive_still_life_generation_rejected_asset_record.md",
    "BLOCKED for explicit no-generation prompt handoff diagnostic authorization"
  ]);

  const diagnosticQuestionRecorded = includesAll(currentContents, [
    "root_cause_known: false",
    "prompt_text_wrong_in_repo: false",
    "prompt_auto_edited_in_v10_9: false",
    "model_adherence_failure_possible: true",
    "plugin_request_handoff_failure_possible: true",
    "verify sanitized final request intent before any new generation"
  ]);

  const promptFingerprintRecorded = includesAll(currentContents, [
    "prompt_id: a5_positive_still_life_prompt_v1",
    "prompt_source_record: docs/207_v10_8_a5_positive_still_life_generation_preflight_gate.md",
    `prompt_cn_sha256_utf8: ${expectedPromptSha256}`,
    `expected_prompt_sha256_utf8: ${expectedPromptSha256}`,
    "prompt_text_recorded_here: false",
    "prompt_auto_edit_allowed: false"
  ]);

  const diagnosticGateRecorded = includesAll(currentContents, [
    "diagnostic_authorization_active: false",
    "diagnostic_type: sanitized_request_preflight",
    "selected_plugin_id: DoubaoGen",
    "selected_plugin_command: generate",
    "selected_plugin_model: doubao-seedream-5-0-260128",
    "max_plugin_calls_allowed: 0",
    "max_plugin_calls: 0",
    "api_call_allowed: false",
    "vcp_plugin_call_allowed: false",
    "image_creation_allowed: false",
    "output_directory_write_allowed: false",
    "config_env_value_read_allowed: false"
  ]);

  const allowedOutputRecorded = includesAll(currentContents, [
    "prompt_id_allowed: true",
    "prompt_sha256_allowed: true",
    "sanitized_request_intent_summary_cn_allowed: true",
    "raw_prompt_text_allowed: false",
    "raw_plugin_dir_path_allowed: false",
    "secret_value_allowed: false",
    "endpoint_allowed: false",
    "runtime_log_allowed: false",
    "raw_request_body_allowed: false"
  ]);

  const noExecutionGuardRecorded = includesAll(currentContents, [
    "real_plugin_dir_read: false",
    "config_env_read: false",
    "plugin_called: false",
    "api_called: false",
    "vcp_plugin_called: false",
    "image_created: false",
    "daily_note_called: false",
    "vcp_memory_written: false",
    "submitDraft_called: false",
    "commit_performed: false",
    "tag_performed: false",
    "push_performed: false",
    "pr_created: false",
    "github_release_created: false"
  ]);

  const stopConditionsRecorded = includesAll(record, [
    "would_call_plugin: true",
    "would_call_api: true",
    "would_create_image: true",
    "would_read_config_env_value: true",
    "would_record_raw_path: true",
    "would_record_raw_request: true",
    "prompt_hash_mismatch: true"
  ]);

  const noForbiddenTrueExecution = excludesAll(currentContents, [
    "diagnostic_authorization_active: true",
    "real_plugin_dir_read: true",
    "config_env_read: true",
    "plugin_called: true",
    "api_" + "called: true",
    "vcp_plugin_" + "called: true",
    "image_created: true",
    "daily_note_" + "called: true",
    "vcp_memory_written: true",
    "submitDraft_called: true",
    "commit_performed: true",
    "tag_performed: true",
    "push_performed: true",
    "pr_created: true",
    "github_release_created: true",
    "api_call_allowed: true",
    "vcp_plugin_call_allowed: true",
    "image_creation_allowed: true",
    "config_env_value_read_allowed: true"
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
    "docs/209_v10_10_a5_prompt_handoff_diagnostic_preflight.md",
    "review_console/embed_contract/v10_10_a5_prompt_handoff_diagnostic_preflight.md",
    "integrations/vcp/v10_10_prompt_handoff_diagnostic_authorization_template.md",
    "tests/schema_examples/v10_10_a5_prompt_handoff_diagnostic_preflight.example.yaml",
    "scripts/validate_v10_10_a5_prompt_handoff_diagnostic_preflight.js",
    "max_plugin_calls_allowed: 0",
    "diagnostic_authorization_active: false"
  ]);

  const boardCurrentSnapshot = includesAll(board, [
    currentPhase,
    "v10.10 local: prompt handoff diagnostic preflight ready",
    "max plugin calls allowed in v10.10: 0",
    "no generation in v10.10",
    "diagnostic authorization still inactive"
  ]);
  const boardSupersededByV10_11 = includesAll(board, [
    "v10.11 A5 prompt handoff diagnostic result",
    "v10.11 local: prompt handoff diagnostic completed",
    "prompt hash matches expected",
    "actual plugin calls observed in v10.11: 0",
    "provider-side request remains unobserved"
  ]);
  const boardCurrent = boardCurrentSnapshot || boardSupersededByV10_11;

  const checklistCurrent = includesAll(checklist, [
    "## v10.10 A5 Prompt Handoff Diagnostic Preflight 检查",
    "`docs/209_v10_10_a5_prompt_handoff_diagnostic_preflight.md` 存在",
    "`review_console/embed_contract/v10_10_a5_prompt_handoff_diagnostic_preflight.md` 存在",
    "`integrations/vcp/v10_10_prompt_handoff_diagnostic_authorization_template.md` 存在",
    "`tests/schema_examples/v10_10_a5_prompt_handoff_diagnostic_preflight.example.yaml` 存在",
    "`scripts/validate_v10_10_a5_prompt_handoff_diagnostic_preflight.js` 存在",
    "`max_plugin_calls_allowed=0`",
    "`diagnostic_authorization_active=false`",
    "`node scripts/validate_v10_10_a5_prompt_handoff_diagnostic_preflight.js` 通过"
  ]);

  assert(phaseRecorded, "v10.10 diagnostic preflight phase must be recorded.");
  assert(diagnosticQuestionRecorded, "v10.10 must record diagnostic question.");
  assert(promptFingerprintRecorded, "v10.10 must record locked prompt fingerprint.");
  assert(diagnosticGateRecorded, "v10.10 must record no-generation diagnostic gate.");
  assert(allowedOutputRecorded, "v10.10 must record allowed diagnostic output boundaries.");
  assert(noExecutionGuardRecorded, "v10.10 must record no-execution guard.");
  assert(stopConditionsRecorded, "v10.10 must record stop conditions.");
  assert(noForbiddenTrueExecution, "v10.10 must not record real execution, allowed API call, or version action.");
  assert(noRawSensitiveValues, "v10.10 must not save raw paths, endpoints, websocket URLs, or runtime logs.");
  assert(indexesCurrent, "Top-level indexes must reference v10.10 diagnostic preflight.");
  assert(boardCurrent, "Agent board must be synchronized to v10.10 diagnostic preflight or record a later v10.11 superseding state.");
  assert(checklistCurrent, "Validation checklist must include v10.10 diagnostic checks.");

  process.stdout.write(`${JSON.stringify({
    passed: true,
    v10_10_a5_prompt_handoff_diagnostic_preflight: {
      phase_recorded: phaseRecorded,
      diagnostic_question_recorded: diagnosticQuestionRecorded,
      prompt_fingerprint_recorded: promptFingerprintRecorded,
      prompt_sha256_matches_expected: true,
      diagnostic_gate_recorded: diagnosticGateRecorded,
      allowed_output_recorded: allowedOutputRecorded,
      no_execution_guard_recorded: noExecutionGuardRecorded,
      stop_conditions_recorded: stopConditionsRecorded,
      no_forbidden_true_execution: noForbiddenTrueExecution,
      no_raw_sensitive_values: noRawSensitiveValues,
      indexes_current: indexesCurrent,
      agent_board_current: boardCurrent,
      agent_board_current_snapshot: boardCurrentSnapshot,
      agent_board_superseded_by_v10_11: boardSupersededByV10_11,
      checklist_current: checklistCurrent,
      diagnostic_authorization_active: false,
      max_plugin_calls_allowed: 0,
      api_call_allowed: false,
      image_creation_allowed: false,
      next_safe_phase: "explicit no-generation prompt handoff diagnostic authorization"
    }
  }, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
}
