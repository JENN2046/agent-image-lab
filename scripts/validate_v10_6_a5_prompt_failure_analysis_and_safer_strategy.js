const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const currentPhase = "v10.6 A5 prompt failure analysis and safer strategy";
const previousPhase = "v10.5 A5 DoubaoGen no-text retry rejected asset record";

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
    "docs/205_v10_6_a5_prompt_failure_analysis_and_safer_strategy.md",
    "review_console/embed_contract/v10_6_a5_prompt_failure_analysis_and_safer_strategy.md",
    "tests/schema_examples/v10_6_a5_prompt_failure_analysis_and_safer_strategy.example.yaml",
    "scripts/validate_v10_6_a5_prompt_failure_analysis_and_safer_strategy.js",
    "docs/204_v10_5_a5_doubaogen_no_text_retry_rejected_asset_record.md",
    "scripts/validate_v10_5_a5_doubaogen_no_text_retry_rejected_asset_record.js",
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
  assert(missing.length === 0, `Missing v10.6 prompt strategy files: ${missing.join(", ")}`);

  const record = read("docs/205_v10_6_a5_prompt_failure_analysis_and_safer_strategy.md");
  const contract = read("review_console/embed_contract/v10_6_a5_prompt_failure_analysis_and_safer_strategy.md");
  const schema = read("tests/schema_examples/v10_6_a5_prompt_failure_analysis_and_safer_strategy.example.yaml");
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
    "docs/204_v10_5_a5_doubaogen_no_text_retry_rejected_asset_record.md",
    "BLOCKED for user review of safer prompt before any new real generation"
  ]);

  const accountabilityRecorded = includesAll(currentContents, [
    "v10_5_prompt_template_authored_by_agent: true",
    "user_authorized_retry_from_agent_template: true",
    "prompt_design_failure_acknowledged: true",
    "next_real_generation_requires_prompt_preview: true"
  ]);

  const failureAnalysisRecorded = includesAll(currentContents, [
    "failed_attempts_reviewed:",
    "- v10.4",
    "- v10.5",
    "readable_text_or_logo_detected: true",
    "person_or_face_detected: true",
    "brand_or_logo_risk_detected: true",
    "asset_status: rejected",
    "negative_prompt_overload",
    "software_interface",
    "abstract_ui_shapes"
  ]);

  const strategyRecorded = includesAll(currentContents, [
    "strategy_name: positive_only_unbranded_still_life",
    "direct_doubaogen_cover_retry_recommended: false",
    "next_prompt_must_be_shown_to_user_before_execution: true",
    "positive_subjects_only:",
    "unmarked_camera_lens",
    "blank_color_blocks",
    "plain_geometric_acrylic_shapes",
    "negative_terms_must_not_dominate_prompt: true"
  ]);

  const candidatePromptRecorded = includesAll(currentContents, [
    "candidate_prompt_draft:",
    "execution_authorized: false",
    "uses_photo_studio_os_name: false",
    "uses_software_or_ui_terms: false",
    "uses_cover_or_brand_terms: false",
    "uses_people_terms: false",
    "positive_subjects_only: true"
  ]);

  const gateRecorded = includesAll(currentContents, [
    "next_real_generation_allowed_by_this_record: false",
    "next_real_generation_requires_new_authorization: true",
    "prompt_preview_required_before_real_call: true",
    "memory_write_allowed_before_accepted_asset: false",
    "submitDraft_allowed: false",
    "commit_tag_push_pr_release_allowed_by_this_record: false"
  ]);

  const noForbiddenTrueExecution = excludesAll(currentContents, [
    "real_generation_performed: true",
    "api_" + "called: true",
    "vcp_plugin_" + "called: true",
    "daily_note_write_performed: true",
    "vcp_memory_write_performed: true",
    "image_file_created: true",
    "commit_performed: true",
    "tag_performed: true",
    "push_performed: true",
    "pr_created: true",
    "github_release_created: true"
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
    "docs/205_v10_6_a5_prompt_failure_analysis_and_safer_strategy.md",
    "review_console/embed_contract/v10_6_a5_prompt_failure_analysis_and_safer_strategy.md",
    "tests/schema_examples/v10_6_a5_prompt_failure_analysis_and_safer_strategy.example.yaml",
    "scripts/validate_v10_6_a5_prompt_failure_analysis_and_safer_strategy.js",
    "prompt_design_failure_acknowledged",
    "positive_only_unbranded_still_life"
  ]);

  const boardCurrentSnapshot = includesAll(board, [
    currentPhase,
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
  const boardCurrent = boardCurrentSnapshot || boardSupersededByV10_7;

  const checklistCurrent = includesAll(checklist, [
    "## v10.6 A5 Prompt Failure Analysis And Safer Strategy 检查",
    "`docs/205_v10_6_a5_prompt_failure_analysis_and_safer_strategy.md` 存在",
    "`review_console/embed_contract/v10_6_a5_prompt_failure_analysis_and_safer_strategy.md` 存在",
    "`tests/schema_examples/v10_6_a5_prompt_failure_analysis_and_safer_strategy.example.yaml` 存在",
    "`scripts/validate_v10_6_a5_prompt_failure_analysis_and_safer_strategy.js` 存在",
    "`prompt_design_failure_acknowledged=true`",
    "`next_real_generation_allowed_by_this_record=false`",
    "`node scripts/validate_v10_6_a5_prompt_failure_analysis_and_safer_strategy.js` 通过"
  ]);

  assert(phaseRecorded, "v10.6 prompt strategy phase must be recorded.");
  assert(accountabilityRecorded, "v10.6 must record prompt accountability.");
  assert(failureAnalysisRecorded, "v10.6 must record failure analysis.");
  assert(strategyRecorded, "v10.6 must record safer prompt strategy.");
  assert(candidatePromptRecorded, "v10.6 must record candidate prompt as non-executable draft.");
  assert(gateRecorded, "v10.6 must record next authorization gate.");
  assert(noForbiddenTrueExecution, "v10.6 must not record new real execution or version action.");
  assert(noRawSensitiveValues, "v10.6 must not save raw paths, endpoints, websocket URLs, or runtime logs.");
  assert(indexesCurrent, "Top-level indexes must reference v10.6 prompt strategy record.");
  assert(boardCurrent, "Agent board must retain v10.6 prompt strategy state or record a later v10.7 superseding state.");
  assert(checklistCurrent, "Validation checklist must include v10.6 prompt strategy checks.");

  process.stdout.write(`${JSON.stringify({
    passed: true,
    v10_6_a5_prompt_failure_analysis_and_safer_strategy: {
      phase_recorded: phaseRecorded,
      accountability_recorded: accountabilityRecorded,
      failure_analysis_recorded: failureAnalysisRecorded,
      strategy_recorded: strategyRecorded,
      candidate_prompt_recorded: candidatePromptRecorded,
      gate_recorded: gateRecorded,
      no_forbidden_true_execution: noForbiddenTrueExecution,
      no_raw_sensitive_values: noRawSensitiveValues,
      indexes_current: indexesCurrent,
      agent_board_current: boardCurrent,
      agent_board_current_snapshot: boardCurrentSnapshot,
      agent_board_superseded_by_v10_7: boardSupersededByV10_7,
      checklist_current: checklistCurrent,
      prompt_design_failure_acknowledged: true,
      next_real_generation_allowed_by_this_record: false,
      next_prompt_preview_required_before_execution: true,
      next_safe_phase: "user review of safer positive-only prompt"
    }
  }, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
}
