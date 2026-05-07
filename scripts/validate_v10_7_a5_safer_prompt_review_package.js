const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const currentPhase = "v10.7 A5 safer prompt review package";
const previousPhase = "v10.6 A5 prompt failure analysis and safer strategy";
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
    "docs/206_v10_7_a5_safer_prompt_review_package.md",
    "review_console/embed_contract/v10_7_a5_safer_prompt_review_package.md",
    "tests/schema_examples/v10_7_a5_safer_prompt_review_package.example.yaml",
    "scripts/validate_v10_7_a5_safer_prompt_review_package.js",
    "docs/205_v10_6_a5_prompt_failure_analysis_and_safer_strategy.md",
    "scripts/validate_v10_6_a5_prompt_failure_analysis_and_safer_strategy.js",
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
  assert(missing.length === 0, `Missing v10.7 safer prompt review files: ${missing.join(", ")}`);

  const record = read("docs/206_v10_7_a5_safer_prompt_review_package.md");
  const contract = read("review_console/embed_contract/v10_7_a5_safer_prompt_review_package.md");
  const schema = read("tests/schema_examples/v10_7_a5_safer_prompt_review_package.example.yaml");
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
    "docs/205_v10_6_a5_prompt_failure_analysis_and_safer_strategy.md",
    "BLOCKED for user approval of prompt plus separate real generation authorization"
  ]);

  const promptRecorded = includesAll(currentContents, [
    "prompt_id: a5_positive_still_life_prompt_v1",
    `prompt_cn: "${expectedPrompt}"`,
    "execution_authorized: false",
    "prompt_preview_performed: true",
    "prompt_string_scanned: true",
    "positive_subjects_only: true"
  ]);

  const promptMatchesExpected = prompt === expectedPrompt;
  const riskyTerms = [
    "OS",
    "app",
    "software",
    "interface",
    "UI",
    "cover",
    "logo",
    "brand",
    "screen",
    "monitor",
    "person",
    "portrait",
    "Photo Studio"
  ];
  const promptRiskyTermsAbsent = riskyTerms.every((term) => !prompt.includes(term));
  const promptLengthReasonable = prompt.length >= 50 && prompt.length <= 180;

  const scanRecorded = includesAll(currentContents, [
    "risky_english_terms_absent: true",
    "uses_photo_studio_os_name: false",
    "uses_software_or_ui_terms: false",
    "uses_cover_or_brand_terms: false",
    "uses_people_terms: false",
    "uses_screen_or_monitor_terms: false",
    "negative_prompt_overload: false",
    "prompt_length_reasonable: true"
  ]);

  const gateRecorded = includesAll(currentContents, [
    "user_prompt_approval_required: true",
    "next_real_generation_allowed_by_this_record: false",
    "next_real_generation_requires_new_authorization: true",
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
    "docs/206_v10_7_a5_safer_prompt_review_package.md",
    "review_console/embed_contract/v10_7_a5_safer_prompt_review_package.md",
    "tests/schema_examples/v10_7_a5_safer_prompt_review_package.example.yaml",
    "scripts/validate_v10_7_a5_safer_prompt_review_package.js",
    "a5_positive_still_life_prompt_v1",
    "prompt_preview_performed"
  ]);

  const boardCurrentSnapshot = includesAll(board, [
    currentPhase,
    "v10.7 local: safer prompt review package ready",
    "prompt risky terms absent",
    "real generation still blocked",
    "user prompt approval required"
  ]);
  const boardSupersededByV10_8 = includesAll(board, [
    "v10.8 A5 positive still-life generation preflight gate",
    "v10.8 local: positive still-life generation preflight gate ready",
    "prompt locked for future authorization",
    "real generation still blocked",
    "separate generation authorization required"
  ]);
  const boardCurrent = boardCurrentSnapshot || boardSupersededByV10_8;

  const checklistCurrent = includesAll(checklist, [
    "## v10.7 A5 Safer Prompt Review Package 检查",
    "`docs/206_v10_7_a5_safer_prompt_review_package.md` 存在",
    "`review_console/embed_contract/v10_7_a5_safer_prompt_review_package.md` 存在",
    "`tests/schema_examples/v10_7_a5_safer_prompt_review_package.example.yaml` 存在",
    "`scripts/validate_v10_7_a5_safer_prompt_review_package.js` 存在",
    "`prompt_risky_terms_absent=true`",
    "`next_real_generation_allowed_by_this_record=false`",
    "`node scripts/validate_v10_7_a5_safer_prompt_review_package.js` 通过"
  ]);

  assert(phaseRecorded, "v10.7 prompt review phase must be recorded.");
  assert(promptRecorded, "v10.7 must record safer prompt preview.");
  assert(promptMatchesExpected, "v10.7 prompt must match the reviewed candidate exactly.");
  assert(promptRiskyTermsAbsent, "v10.7 prompt must not include risky English trigger terms.");
  assert(promptLengthReasonable, "v10.7 prompt length must stay reasonable.");
  assert(scanRecorded, "v10.7 must record prompt scan result.");
  assert(gateRecorded, "v10.7 must record approval gate.");
  assert(noForbiddenTrueExecution, "v10.7 must not record new real execution or version action.");
  assert(noRawSensitiveValues, "v10.7 must not save raw paths, endpoints, websocket URLs, or runtime logs.");
  assert(indexesCurrent, "Top-level indexes must reference v10.7 safer prompt review package.");
  assert(boardCurrent, "Agent board must be synchronized to v10.7 safer prompt review package or record a later v10.8 superseding state.");
  assert(checklistCurrent, "Validation checklist must include v10.7 safer prompt checks.");

  process.stdout.write(`${JSON.stringify({
    passed: true,
    v10_7_a5_safer_prompt_review_package: {
      phase_recorded: phaseRecorded,
      prompt_recorded: promptRecorded,
      prompt_matches_expected: promptMatchesExpected,
      prompt_risky_terms_absent: promptRiskyTermsAbsent,
      prompt_length_reasonable: promptLengthReasonable,
      scan_recorded: scanRecorded,
      gate_recorded: gateRecorded,
      no_forbidden_true_execution: noForbiddenTrueExecution,
      no_raw_sensitive_values: noRawSensitiveValues,
      indexes_current: indexesCurrent,
      agent_board_current: boardCurrent,
      agent_board_current_snapshot: boardCurrentSnapshot,
      agent_board_superseded_by_v10_8: boardSupersededByV10_8,
      checklist_current: checklistCurrent,
      prompt_id: "a5_positive_still_life_prompt_v1",
      next_real_generation_allowed_by_this_record: false,
      user_prompt_approval_required: true,
      next_safe_phase: "user prompt approval plus separate real generation authorization"
    }
  }, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
}
