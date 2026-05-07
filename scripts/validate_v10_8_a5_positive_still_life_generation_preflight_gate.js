const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const currentPhase = "v10.8 A5 positive still-life generation preflight gate";
const previousPhase = "v10.7 A5 safer prompt review package";
const expectedPrompt = "明亮摄影棚桌面静物摄影。画面中心是一枚无标识相机镜头，周围摆放柔光灯板、空白色块卡、纯色亚克力几何片和干净浅灰桌面。所有物体表面保持空白、干净、无标记。真实产品摄影，高级柔光，简洁构图，留出干净背景。";

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

function extractPrompt(content) {
  const match = content.match(/prompt_cn:\s*"([^"]+)"/);
  return match ? match[1] : "";
}

function main() {
  const requiredFiles = [
    "docs/207_v10_8_a5_positive_still_life_generation_preflight_gate.md",
    "review_console/embed_contract/v10_8_a5_positive_still_life_generation_preflight_gate.md",
    "tests/schema_examples/v10_8_a5_positive_still_life_generation_preflight_gate.example.yaml",
    "scripts/validate_v10_8_a5_positive_still_life_generation_preflight_gate.js",
    "docs/206_v10_7_a5_safer_prompt_review_package.md",
    "scripts/validate_v10_7_a5_safer_prompt_review_package.js",
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
  assert(missing.length === 0, `Missing v10.8 preflight gate files: ${missing.join(", ")}`);

  const record = read("docs/207_v10_8_a5_positive_still_life_generation_preflight_gate.md");
  const contract = read("review_console/embed_contract/v10_8_a5_positive_still_life_generation_preflight_gate.md");
  const schema = read("tests/schema_examples/v10_8_a5_positive_still_life_generation_preflight_gate.example.yaml");
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
  const prompt = extractPrompt(record);

  const phaseRecorded = includesAll(currentContents, [
    currentPhase,
    previousPhase,
    "docs/206_v10_7_a5_safer_prompt_review_package.md",
    "BLOCKED for explicit prompt approval plus separate real generation authorization"
  ]);

  const promptLockRecorded = includesAll(currentContents, [
    "prompt_id: a5_positive_still_life_prompt_v1",
    "prompt_approved_by_user: false",
    "prompt_locked_for_future_authorization: true",
    "prompt_must_not_be_auto_edited: true",
    `prompt_cn: "${expectedPrompt}"`
  ]);

  const authorizationGateRecorded = includesAll(currentContents, [
    "real_generation_authorization_present: false",
    "next_real_generation_allowed_by_this_record: false",
    "user_prompt_approval_required: true",
    "separate_real_generation_authorization_required: true",
    "- prompt_approved",
    "- selected_plugin_id",
    "- selected_plugin_command",
    "- selected_plugin_model",
    "- max_plugin_calls",
    "- input_reference",
    "- output_directory_ref",
    "- overwrite_existing_files_allowed",
    "- rollback_plan",
    "- gatekeeper_approved",
    "- review_console_human_approved",
    "- daily_note_direct_write_allowed",
    "- memory_delta_only"
  ]);

  const preflightLockRecorded = includesAll(currentContents, [
    "selected_plugin_id_required: DoubaoGen",
    "selected_plugin_command_required: generate",
    "selected_plugin_model_required: doubao-seedream-5-0-260128",
    "max_plugin_calls_required: 1",
    "output_directory_ref_recommended: runs/a5_positive_still_life_prompt_v1",
    "overwrite_existing_files_allowed_required: false",
    "rollback_plan_required: true",
    "gatekeeper_approved_required: true",
    "review_console_human_approved_required: true",
    "daily_note_direct_write_allowed_required: false",
    "memory_delta_only_required: true",
    "output_directory_must_be_empty_or_new: true"
  ]);

  const noExecutionGuardRecorded = includesAll(currentContents, [
    "plugin_called: false",
    "api_called: false",
    "daily_note_called: false",
    "vcp_memory_written: false",
    "image_created: false",
    "bridge_called: false",
    "submitDraft_called: false",
    "commit_performed: false",
    "tag_performed: false",
    "push_performed: false",
    "pr_created: false",
    "github_release_created: false"
  ]);

  const stopConditionsRecorded = includesAll(record, [
    "missing_prompt_approval: true",
    "missing_generation_authorization: true",
    "output_directory_collision: true",
    "max_plugin_calls_not_one: true",
    "overwrite_requested: true",
    "memory_write_requested_before_accepted_asset: true",
    "submitDraft_requested: true",
    "raw_sensitive_value_would_be_recorded: true"
  ]);

  const promptMatchesExpected = prompt === expectedPrompt;
  const noForbiddenTrueExecution = excludesAll(currentContents, [
    "real_generation_performed: true",
    "api_" + "called: true",
    "vcp_plugin_" + "called: true",
    "daily_note_write_performed: true",
    "vcp_memory_write_performed: true",
    "image_file_created: true",
    "bridge_called: true",
    "submitDraft_called: true",
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
    "docs/207_v10_8_a5_positive_still_life_generation_preflight_gate.md",
    "review_console/embed_contract/v10_8_a5_positive_still_life_generation_preflight_gate.md",
    "tests/schema_examples/v10_8_a5_positive_still_life_generation_preflight_gate.example.yaml",
    "scripts/validate_v10_8_a5_positive_still_life_generation_preflight_gate.js",
    "prompt_locked_for_future_authorization",
    "next_real_generation_allowed_by_this_record=false"
  ]);

  const boardCurrent = includesAll(board, [
    currentPhase,
    "v10.8 local: positive still-life generation preflight gate ready",
    "prompt locked for future authorization",
    "real generation still blocked",
    "separate generation authorization required"
  ]);

  const checklistCurrent = includesAll(checklist, [
    "## v10.8 A5 Positive Still-life Generation Preflight Gate 检查",
    "`docs/207_v10_8_a5_positive_still_life_generation_preflight_gate.md` 存在",
    "`review_console/embed_contract/v10_8_a5_positive_still_life_generation_preflight_gate.md` 存在",
    "`tests/schema_examples/v10_8_a5_positive_still_life_generation_preflight_gate.example.yaml` 存在",
    "`scripts/validate_v10_8_a5_positive_still_life_generation_preflight_gate.js` 存在",
    "`prompt_locked_for_future_authorization=true`",
    "`next_real_generation_allowed_by_this_record=false`",
    "`node scripts/validate_v10_8_a5_positive_still_life_generation_preflight_gate.js` 通过"
  ]);

  assert(phaseRecorded, "v10.8 preflight gate phase must be recorded.");
  assert(promptLockRecorded, "v10.8 must record the locked prompt.");
  assert(promptMatchesExpected, "v10.8 locked prompt must match v10.7 candidate exactly.");
  assert(authorizationGateRecorded, "v10.8 must record required authorization gate fields.");
  assert(preflightLockRecorded, "v10.8 must record preflight lock values.");
  assert(noExecutionGuardRecorded, "v10.8 must record no-execution guard.");
  assert(stopConditionsRecorded, "v10.8 must record stop conditions.");
  assert(noForbiddenTrueExecution, "v10.8 must not record real execution or version action.");
  assert(noRawSensitiveValues, "v10.8 must not save raw paths, endpoints, websocket URLs, or runtime logs.");
  assert(indexesCurrent, "Top-level indexes must reference v10.8 preflight gate.");
  assert(boardCurrent, "Agent board must be synchronized to v10.8 preflight gate.");
  assert(checklistCurrent, "Validation checklist must include v10.8 preflight gate checks.");

  process.stdout.write(`${JSON.stringify({
    passed: true,
    v10_8_a5_positive_still_life_generation_preflight_gate: {
      phase_recorded: phaseRecorded,
      prompt_lock_recorded: promptLockRecorded,
      prompt_matches_expected: promptMatchesExpected,
      authorization_gate_recorded: authorizationGateRecorded,
      preflight_lock_recorded: preflightLockRecorded,
      no_execution_guard_recorded: noExecutionGuardRecorded,
      stop_conditions_recorded: stopConditionsRecorded,
      no_forbidden_true_execution: noForbiddenTrueExecution,
      no_raw_sensitive_values: noRawSensitiveValues,
      indexes_current: indexesCurrent,
      agent_board_current: boardCurrent,
      checklist_current: checklistCurrent,
      prompt_locked_for_future_authorization: true,
      next_real_generation_allowed_by_this_record: false,
      user_prompt_approval_required: true,
      separate_real_generation_authorization_required: true,
      next_safe_phase: "explicit prompt approval plus separate real generation authorization"
    }
  }, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
}
