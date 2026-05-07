const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const currentPhase = "v10.26 real DailyNote/VCP memory write closeout";
const savedFileName = "2026-05-07-14_58_55-v10-25-run-1-memory-write.txt";
const savedFileSha256 = "16669cd5cc1a03188e89a62dd0298ea6175dbed7cad162430484ec1ee1af171c";

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
    "docs/212_v10_26_real_dailynote_write_closeout.md",
    "review_console/embed_contract/v10_26_real_dailynote_write_closeout.md",
    "tests/schema_examples/v10_26_real_dailynote_write_closeout.example.yaml",
    "scripts/validate_v10_26_real_dailynote_write_closeout.js",
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
  assert(missing.length === 0, `Missing v10.26 closeout files: ${missing.join(", ")}`);

  const record = read("docs/212_v10_26_real_dailynote_write_closeout.md");
  const handoff = read("review_console/embed_contract/v10_26_real_dailynote_write_closeout.md");
  const schema = read("tests/schema_examples/v10_26_real_dailynote_write_closeout.example.yaml");
  const validator = read("scripts/validate_v10_26_real_dailynote_write_closeout.js");
  const readme = read("README.md");
  const manifest = read("MANIFEST.md");
  const releaseNotes = read("RELEASE_NOTES.md");
  const roadmap = read("docs/00_project_roadmap.md");
  const checklist = read("tests/validation_checklist.md");
  const runState = read(".agent_board/RUN_STATE.md");
  const boardHandoff = read(".agent_board/HANDOFF.md");
  const checkpoint = read(".agent_board/CHECKPOINT.md");
  const taskQueue = read(".agent_board/TASK_QUEUE.md");
  const validationLog = read(".agent_board/VALIDATION_LOG.md");
  const blockers = read(".agent_board/BLOCKERS.md");

  const currentContents = [record, handoff, schema].join("\n");
  const indexes = [readme, manifest, releaseNotes, roadmap, checklist].join("\n");
  const board = [runState, boardHandoff, checkpoint, taskQueue, validationLog, blockers].join("\n");

  const writeResultRecorded = includesAll(currentContents, [
    currentPhase,
    "selected_plugin_id: DailyNoteWrite",
    "selected_entry_ref: Plugin/DailyNoteWrite/daily-note-write.js",
    "target_notebook: Image_Case_Archive",
    "authorized_write_calls: 1",
    "actual_write_calls: 1",
    "plugin_exit_code: 0",
    "plugin_reported_status: success",
    `saved_file_name: ${savedFileName}`,
    `saved_file_sha256: ${savedFileSha256}`,
    "saved_file_length: 1439",
    "read_only_existence_check_match_count: 1"
  ]);

  const realWriteRecorded = includesAll(currentContents, [
    "daily_note_call_performed: true",
    "vcp_memory_write_performed: true",
    "actual_write_performed: true"
  ]);

  const postWriteGuardRecorded = includesAll(currentContents, [
    "v10_25_single_real_write_authorization_consumed: true",
    "additional_daily_note_write_authorized: false",
    "additional_vcp_memory_write_authorized: false",
    "retry_performed: false",
    "second_write_performed: false",
    "submitDraft_called: false",
    "plugin_or_api_generation_called: false",
    "image_created_in_this_phase: false",
    "commit_performed: false",
    "tag_performed: false",
    "push_performed: false",
    "pr_created: false",
    "release_created: false"
  ]);

  const sanitizationRecorded = includesAll(currentContents, [
    "raw_saved_path_printed: false",
    "raw_saved_path_recorded: false",
    "raw_stdout_recorded: false",
    "raw_stderr_recorded: false",
    "runtime_log_recorded: false",
    "secret_value_recorded: false",
    "private_plugin_path_recorded: false",
    "endpoint_recorded: false",
    "image_binary_embedded_in_memory: false"
  ]);

  const noRawExternalPaths = excludesAll(currentContents, [
    "A:\\",
    "A:/",
    "C:\\",
    "C:/",
    "KNOWLEDGEBASE_ROOT_PATH",
    "API_Key",
    "API_URL",
    "config.env"
  ]);

  const indexesCurrent = includesAll(indexes, [
    currentPhase,
    "docs/212_v10_26_real_dailynote_write_closeout.md",
    "review_console/embed_contract/v10_26_real_dailynote_write_closeout.md",
    "tests/schema_examples/v10_26_real_dailynote_write_closeout.example.yaml",
    "scripts/validate_v10_26_real_dailynote_write_closeout.js",
    "actual_write_calls=1",
    "DailyNoteWrite"
  ]);

  const boardCurrent = includesAll(board, [
    "v10.25 real DailyNote/VCP memory write",
    "v10.25 completed one real DailyNote/VCP memory write",
    "v10.25 single real write authorization was consumed",
    "completed_validated_real_write"
  ]);

  const checklistCurrent = includesAll(checklist, [
    "## v10.26 Real DailyNote/VCP Memory Write Closeout 检查",
    "node scripts/validate_v10_26_real_dailynote_write_closeout.js"
  ]);

  assert(writeResultRecorded, "v10.26 closeout must record the sanitized write result.");
  assert(realWriteRecorded, "v10.26 closeout must record that the real write occurred.");
  assert(postWriteGuardRecorded, "v10.26 closeout must record post-write guard boundaries.");
  assert(sanitizationRecorded, "v10.26 closeout must record sanitization boundaries.");
  assert(noRawExternalPaths, "v10.26 closeout must not include raw external paths or config markers.");
  assert(indexesCurrent, "Top-level indexes must include v10.26 closeout references.");
  assert(boardCurrent, ".agent_board must record v10.25/v10.26 post-write state.");
  assert(checklistCurrent, "Validation checklist must include v10.26 checks.");
  assert(validator.includes(savedFileSha256), "Validator must pin the saved file sha256.");

  process.stdout.write(`${JSON.stringify({
    passed: true,
    v10_26_real_dailynote_write_closeout: {
      current_phase: currentPhase,
      actual_write_calls: 1,
      plugin_reported_status: "success",
      saved_file_name: savedFileName,
      saved_file_sha256: savedFileSha256,
      raw_path_recorded: false,
      retry_performed: false,
      second_write_performed: false,
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
