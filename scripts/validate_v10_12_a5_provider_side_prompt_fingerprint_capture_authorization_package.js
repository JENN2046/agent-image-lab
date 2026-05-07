const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const currentPhase = "v10.12 A5 provider-side prompt fingerprint capture authorization package";
const previousPhase = "v10.11 A5 prompt handoff diagnostic result";
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
    "docs/211_v10_12_a5_provider_side_prompt_fingerprint_capture_authorization_package.md",
    "integrations/vcp/v10_12_provider_side_prompt_fingerprint_capture_authorization_package.md",
    "review_console/embed_contract/v10_12_a5_provider_side_prompt_fingerprint_capture_authorization_package.md",
    "tests/schema_examples/v10_12_a5_provider_side_prompt_fingerprint_capture_authorization_package.example.yaml",
    "scripts/validate_v10_12_a5_provider_side_prompt_fingerprint_capture_authorization_package.js",
    "docs/210_v10_11_a5_prompt_handoff_diagnostic_result.md",
    "scripts/validate_v10_11_a5_prompt_handoff_diagnostic_result.js",
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
  assert(missing.length === 0, `Missing v10.12 provider-side prompt fingerprint package files: ${missing.join(", ")}`);

  const record = read("docs/211_v10_12_a5_provider_side_prompt_fingerprint_capture_authorization_package.md");
  const packageDoc = read("integrations/vcp/v10_12_provider_side_prompt_fingerprint_capture_authorization_package.md");
  const contract = read("review_console/embed_contract/v10_12_a5_provider_side_prompt_fingerprint_capture_authorization_package.md");
  const schema = read("tests/schema_examples/v10_12_a5_provider_side_prompt_fingerprint_capture_authorization_package.example.yaml");
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

  const currentContents = [record, packageDoc, contract, schema].join("\n");
  const indexes = [readme, manifest, releaseNotes, roadmap, checklist].join("\n");
  const board = [runState, handoff, checkpoint, taskQueue, validationLog, blockers].join("\n");

  const phaseRecorded = includesAll(currentContents, [
    currentPhase,
    previousPhase,
    "docs/210_v10_11_a5_prompt_handoff_diagnostic_result.md",
    "BLOCKED for explicit v10.12 provider-side fingerprint capture activation"
  ]);

  const packageRecorded = includesAll(currentContents, [
    "authorization_status: inactive_package",
    "execution_authorized_by_this_record: false",
    "activation_phrase: \"批准 v10.12 provider侧指纹捕获\"",
    "selected_plugin_id: DoubaoGen",
    "selected_plugin_command: provider_side_prompt_fingerprint_capture",
    "selected_plugin_model: doubao-seedream-5-0-260128",
    "prompt_id: a5_positive_still_life_prompt_v1",
    `expected_prompt_sha256_utf8: ${expectedPromptSha256}`,
    "max_generation_calls_allowed: 0",
    "max_image_outputs_allowed: 0",
    "max_provider_echo_calls_allowed_after_activation: 1",
    "overwrite_existing_files_allowed: false",
    "output_directory_ref: runs/v10_12_provider_side_prompt_fingerprint_capture"
  ]);

  const allowedOperationsRecorded = includesAll(currentContents, [
    "read_ignored_private_binding_file_for_plugin_dir: true",
    "record_raw_plugin_dir_path: false",
    "use_config_env_values_as_runtime_environment_only: true",
    "record_config_env_values: false",
    "build_request_from_locked_prompt: true",
    "compute_local_payload_prompt_sha256: true",
    "perform_provider_echo_if_no_image_generation: true",
    "perform_sanitized_outbound_request_capture_if_no_image_generation: true",
    "record_provider_observed_prompt_sha256: true",
    "record_provider_observed_prompt_text: false",
    "record_raw_request_body: false",
    "record_raw_response_body: false",
    "record_endpoint: false",
    "record_runtime_log: false",
    "create_image: false",
    "call_daily_note: false",
    "write_vcp_memory: false"
  ]);

  const forbiddenOperationsRecorded = includesAll(currentContents, [
    "real_generation: true",
    "image_file_creation: true",
    "daily_note_write: true",
    "vcp_memory_write: true",
    "submitDraft: true",
    "raw_prompt_text_recording: true",
    "raw_request_body_recording: true",
    "raw_response_body_recording: true",
    "raw_endpoint_recording: true",
    "runtime_log_recording: true",
    "secret_value_recording: true",
    "plugin_dir_raw_path_recording: true",
    "commit_tag_push_pr_release: true"
  ]);

  const stopConditionsRecorded = includesAll(record, [
    "activation_phrase_missing: true",
    "prompt_hash_mismatch_before_provider_contact: true",
    "provider_echo_requires_image_generation: true",
    "provider_echo_not_supported_and_capture_would_save_raw_request: true",
    "diagnostic_attempt_count_would_exceed_one: true",
    "output_directory_collision: true",
    "raw_sensitive_value_would_be_recorded: true",
    "endpoint_would_be_recorded: true",
    "runtime_log_would_be_recorded: true",
    "image_file_would_be_created: true"
  ]);

  const noExecutionCurrentRecord = includesAll(currentContents, [
    "execution_authorized_by_this_record: false",
    "provider_echo_performed: false",
    "sanitized_request_capture_performed: false",
    "actual_plugin_calls: 0",
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

  const noForbiddenCurrentExecution = excludesAll(currentContents, [
    "authorization_status: active",
    "execution_authorized_by_this_record: true",
    "provider_echo_performed: true",
    "sanitized_request_capture_performed: true",
    "actual_plugin_calls: 1",
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
    "docs/211_v10_12_a5_provider_side_prompt_fingerprint_capture_authorization_package.md",
    "integrations/vcp/v10_12_provider_side_prompt_fingerprint_capture_authorization_package.md",
    "review_console/embed_contract/v10_12_a5_provider_side_prompt_fingerprint_capture_authorization_package.md",
    "tests/schema_examples/v10_12_a5_provider_side_prompt_fingerprint_capture_authorization_package.example.yaml",
    "scripts/validate_v10_12_a5_provider_side_prompt_fingerprint_capture_authorization_package.js",
    "authorization_status: inactive_package",
    "execution_authorized_by_this_record: false"
  ]);

  const boardCurrent = includesAll(board, [
    currentPhase,
    "v10.12 local: provider-side prompt fingerprint capture authorization package ready",
    "authorization status: inactive package",
    "execution authorized by v10.12: false",
    "provider-side capture not performed"
  ]);

  const checklistCurrent = includesAll(checklist, [
    "## v10.12 A5 Provider-side Prompt Fingerprint Capture Authorization Package 检查",
    "`docs/211_v10_12_a5_provider_side_prompt_fingerprint_capture_authorization_package.md` 存在",
    "`integrations/vcp/v10_12_provider_side_prompt_fingerprint_capture_authorization_package.md` 存在",
    "`review_console/embed_contract/v10_12_a5_provider_side_prompt_fingerprint_capture_authorization_package.md` 存在",
    "`tests/schema_examples/v10_12_a5_provider_side_prompt_fingerprint_capture_authorization_package.example.yaml` 存在",
    "`scripts/validate_v10_12_a5_provider_side_prompt_fingerprint_capture_authorization_package.js` 存在",
    "`authorization_status=inactive_package`",
    "`execution_authorized_by_this_record=false`",
    "`node scripts/validate_v10_12_a5_provider_side_prompt_fingerprint_capture_authorization_package.js` 通过"
  ]);

  assert(phaseRecorded, "v10.12 provider-side prompt fingerprint package phase must be recorded.");
  assert(packageRecorded, "v10.12 must record inactive authorization package boundaries.");
  assert(allowedOperationsRecorded, "v10.12 must record allowed operations after activation.");
  assert(forbiddenOperationsRecorded, "v10.12 must record forbidden operations.");
  assert(stopConditionsRecorded, "v10.12 must record stop conditions.");
  assert(noExecutionCurrentRecord, "v10.12 current record must remain no-execution.");
  assert(noForbiddenCurrentExecution, "v10.12 must not record active execution or version action.");
  assert(noRawSensitiveValues, "v10.12 must not save raw paths, endpoints, websocket URLs, or runtime logs.");
  assert(indexesCurrent, "Top-level indexes must reference v10.12 provider-side prompt fingerprint package.");
  assert(boardCurrent, "Agent board must be synchronized to v10.12 provider-side prompt fingerprint package.");
  assert(checklistCurrent, "Validation checklist must include v10.12 provider-side prompt fingerprint package checks.");

  process.stdout.write(`${JSON.stringify({
    passed: true,
    v10_12_a5_provider_side_prompt_fingerprint_capture_authorization_package: {
      phase_recorded: phaseRecorded,
      package_recorded: packageRecorded,
      allowed_operations_recorded: allowedOperationsRecorded,
      forbidden_operations_recorded: forbiddenOperationsRecorded,
      stop_conditions_recorded: stopConditionsRecorded,
      no_execution_current_record: noExecutionCurrentRecord,
      no_forbidden_current_execution: noForbiddenCurrentExecution,
      no_raw_sensitive_values: noRawSensitiveValues,
      indexes_current: indexesCurrent,
      agent_board_current: boardCurrent,
      checklist_current: checklistCurrent,
      authorization_status: "inactive_package",
      execution_authorized_by_this_record: false,
      max_generation_calls_allowed: 0,
      max_provider_echo_calls_allowed_after_activation: 1,
      provider_side_capture_performed: false,
      next_safe_phase: "explicit v10.12 provider-side fingerprint capture activation"
    }
  }, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
}
