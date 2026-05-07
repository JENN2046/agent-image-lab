const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const currentPhase = "v10.27 DailyNoteWrite root path correction";

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
    "docs/213_v10_27_dailynotewrite_root_path_correction.md",
    "review_console/embed_contract/v10_27_dailynotewrite_root_path_correction.md",
    "tests/schema_examples/v10_27_dailynotewrite_root_path_correction.example.yaml",
    "scripts/validate_v10_27_dailynotewrite_root_path_correction.js",
    "README.md",
    "MANIFEST.md",
    "RELEASE_NOTES.md",
    "docs/00_project_roadmap.md",
    "tests/validation_checklist.md",
    ".agent_board/RUN_STATE.md",
    ".agent_board/HANDOFF.md",
    ".agent_board/TASK_QUEUE.md",
    ".agent_board/VALIDATION_LOG.md",
    ".agent_board/BLOCKERS.md"
  ];
  const missing = requiredFiles.filter((relativePath) => !exists(relativePath));
  assert(missing.length === 0, `Missing v10.27 root path correction files: ${missing.join(", ")}`);

  const record = read("docs/213_v10_27_dailynotewrite_root_path_correction.md");
  const handoff = read("review_console/embed_contract/v10_27_dailynotewrite_root_path_correction.md");
  const schema = read("tests/schema_examples/v10_27_dailynotewrite_root_path_correction.example.yaml");
  const readme = read("README.md");
  const manifest = read("MANIFEST.md");
  const releaseNotes = read("RELEASE_NOTES.md");
  const roadmap = read("docs/00_project_roadmap.md");
  const checklist = read("tests/validation_checklist.md");
  const runState = read(".agent_board/RUN_STATE.md");
  const boardHandoff = read(".agent_board/HANDOFF.md");
  const taskQueue = read(".agent_board/TASK_QUEUE.md");
  const validationLog = read(".agent_board/VALIDATION_LOG.md");
  const blockers = read(".agent_board/BLOCKERS.md");

  const currentContents = [record, handoff, schema].join("\n");
  const indexes = [readme, manifest, releaseNotes, roadmap, checklist].join("\n");
  const board = [runState, boardHandoff, taskQueue, validationLog, blockers].join("\n");

  const correctionRecorded = includesAll(currentContents, [
    currentPhase,
    "affected_writer: DailyNoteWrite",
    "affected_key: KNOWLEDGEBASE_ROOT_PATH",
    "previous_root_class: plugin_dir_dailynote",
    "corrected_root_class: vcp_root_dailynote",
    "correction_scope: single root-path config key",
    "future_write_root_expected: vcp_root_dailynote"
  ]);

  const noWriteRecorded = includesAll(currentContents, [
    "dailynotewrite_rerun_performed: false",
    "daily_note_write_performed_in_v10_27: false",
    "vcp_memory_write_performed_in_v10_27: false",
    "plugin_or_api_generation_called: false",
    "image_created_in_this_phase: false",
    "submitDraft_called: false",
    "existing_file_overwritten: false"
  ]);

  const sanitizationRecorded = includesAll(currentContents, [
    "raw_config_value_printed: false",
    "raw_config_value_recorded: false",
    "raw_external_path_recorded: false",
    "secret_value_printed: false",
    "secret_value_recorded: false",
    "endpoint_printed: false",
    "runtime_log_recorded: false"
  ]);

  const noRawExternalPaths = excludesAll(currentContents, [
    "A:\\",
    "A:/",
    "C:\\",
    "C:/",
    "API_Key",
    "API_URL",
    "SECRET",
    "TOKEN="
  ]);

  const indexesCurrent = includesAll(indexes, [
    currentPhase,
    "docs/213_v10_27_dailynotewrite_root_path_correction.md",
    "review_console/embed_contract/v10_27_dailynotewrite_root_path_correction.md",
    "tests/schema_examples/v10_27_dailynotewrite_root_path_correction.example.yaml",
    "scripts/validate_v10_27_dailynotewrite_root_path_correction.js",
    "vcp_root_dailynote",
    "DailyNoteWrite"
  ]);

  const boardCurrent = includesAll(board, [
    "v10.27 DailyNoteWrite root path correction",
    "plugin_dir_dailynote",
    "vcp_root_dailynote",
    "without rerunning DailyNoteWrite",
    "completed_root_path_corrected"
  ]);

  const checklistCurrent = includesAll(checklist, [
    "## v10.27 DailyNoteWrite Root Path Correction 检查",
    "node scripts/validate_v10_27_dailynotewrite_root_path_correction.js"
  ]);

  assert(correctionRecorded, "v10.27 must record the root path correction.");
  assert(noWriteRecorded, "v10.27 must record that no writer rerun or new write occurred.");
  assert(sanitizationRecorded, "v10.27 must record sanitization boundaries.");
  assert(noRawExternalPaths, "v10.27 must not record raw external paths or secrets.");
  assert(indexesCurrent, "Top-level indexes must include v10.27 root path correction references.");
  assert(boardCurrent, ".agent_board must record v10.27 correction state.");
  assert(checklistCurrent, "Validation checklist must include v10.27 checks.");

  process.stdout.write(`${JSON.stringify({
    passed: true,
    v10_27_dailynotewrite_root_path_correction: {
      current_phase: currentPhase,
      previous_root_class: "plugin_dir_dailynote",
      corrected_root_class: "vcp_root_dailynote",
      dailynotewrite_rerun_performed: false,
      daily_note_write_performed_in_v10_27: false,
      raw_config_value_recorded: false,
      raw_external_path_recorded: false,
      no_forbidden_followup_action: true
    }
  }, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
}
