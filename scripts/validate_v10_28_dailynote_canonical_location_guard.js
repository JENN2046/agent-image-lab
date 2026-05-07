const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const currentPhase = "v10.28 DailyNote canonical location guard";

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
    "docs/214_v10_28_dailynote_canonical_location_guard.md",
    "review_console/embed_contract/v10_28_dailynote_canonical_location_guard.md",
    "tests/schema_examples/v10_28_dailynote_canonical_location_guard.example.yaml",
    "scripts/validate_v10_28_dailynote_canonical_location_guard.js",
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
  assert(missing.length === 0, `Missing v10.28 canonical location guard files: ${missing.join(", ")}`);

  const record = read("docs/214_v10_28_dailynote_canonical_location_guard.md");
  const handoff = read("review_console/embed_contract/v10_28_dailynote_canonical_location_guard.md");
  const schema = read("tests/schema_examples/v10_28_dailynote_canonical_location_guard.example.yaml");
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

  const successDefinitionRecorded = includesAll(currentContents, [
    currentPhase,
    "plugin_success_required: true",
    "plugin_success_sufficient: false",
    "writer_root_class_required_before_write: vcp_root_dailynote",
    "canonical_target_file_exists_required: true",
    "canonical_target_hash_match_required: true",
    "wrong_location_file_is_success: false",
    "wrong_location_requires_status: plugin_success_wrong_location"
  ]);

  const prePostGuardRecorded = includesAll(currentContents, [
    "root_recomputation_required: true",
    "expected_root_class: vcp_root_dailynote",
    "output_location_must_be_canonical: true",
    "canonical_location_check_required: true",
    "canonical_file_hash_required: true",
    "wrong_plugin_local_location_check_required: true",
    "success_record_requires_canonical_location: true",
    "success_record_requires_hash_match: true"
  ]);

  const failureHandlingRecorded = includesAll(currentContents, [
    "status: plugin_success_wrong_location",
    "declare_vcp_memory_write_complete: false",
    "copy_or_move_allowed_without_authorization: false",
    "retry_allowed_without_authorization: false",
    "status: rejected_integrity_mismatch"
  ]);

  const boundaryRecorded = includesAll(currentContents, [
    "external_config_read_performed: false",
    "dailynotewrite_rerun_performed: false",
    "daily_note_write_performed_in_v10_28: false",
    "vcp_memory_write_performed_in_v10_28: false",
    "plugin_or_api_generation_called: false",
    "image_created_in_this_phase: false",
    "raw_config_value_recorded: false",
    "raw_external_path_recorded: false",
    "commit_performed: false",
    "release_created: false"
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
    "docs/214_v10_28_dailynote_canonical_location_guard.md",
    "review_console/embed_contract/v10_28_dailynote_canonical_location_guard.md",
    "tests/schema_examples/v10_28_dailynote_canonical_location_guard.example.yaml",
    "scripts/validate_v10_28_dailynote_canonical_location_guard.js",
    "plugin_success_sufficient=false",
    "canonical_target_hash_match_required"
  ]);

  const boardCurrent = includesAll(board, [
    "v10.28 DailyNote canonical location guard",
    "plugin_success_sufficient=false",
    "canonical_target_hash_match_required",
    "plugin_success_wrong_location",
    "completed_validated_local_guard"
  ]);

  const checklistCurrent = includesAll(checklist, [
    "## v10.28 DailyNote Canonical Location Guard 检查",
    "node scripts/validate_v10_28_dailynote_canonical_location_guard.js"
  ]);

  assert(successDefinitionRecorded, "v10.28 must record the hardened success definition.");
  assert(prePostGuardRecorded, "v10.28 must record pre-write and post-write guards.");
  assert(failureHandlingRecorded, "v10.28 must record wrong-location and hash-mismatch failure handling.");
  assert(boundaryRecorded, "v10.28 must record no-execution boundaries.");
  assert(noRawExternalPaths, "v10.28 must not record raw external paths or secrets.");
  assert(indexesCurrent, "Top-level indexes must include v10.28 canonical location guard references.");
  assert(boardCurrent, ".agent_board must record v10.28 guard state.");
  assert(checklistCurrent, "Validation checklist must include v10.28 checks.");

  process.stdout.write(`${JSON.stringify({
    passed: true,
    v10_28_dailynote_canonical_location_guard: {
      current_phase: currentPhase,
      plugin_success_sufficient: false,
      writer_root_class_required_before_write: "vcp_root_dailynote",
      canonical_target_hash_match_required: true,
      wrong_location_requires_status: "plugin_success_wrong_location",
      daily_note_write_performed_in_v10_28: false,
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
