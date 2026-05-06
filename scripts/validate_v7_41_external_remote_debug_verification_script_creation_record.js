const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const currentPhase = "v7.41 external remote-debug verification script creation record";
const previousPhase = "v7.40 local A4/A5 autonomy mode alignment";
const originMasterShort = "5a7f5ba";
const localHeadBeforeBatch = "8f60ae1";
const scriptPath = "scripts/run_vcpchat_review_console_remote_debug_smoke.ps1";

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

function excludesExactTrueFlags(content, keys) {
  const lines = content.split(/\r?\n/).map((line) => line.trim());
  return keys.every((key) => !lines.some((line) => line === `${key}: true`));
}

function main() {
  const requiredFiles = [
    "docs/193_v7_41_external_remote_debug_verification_script_creation_record.md",
    "review_console/embed_contract/vcpchat_external_remote_debug_verification_script_creation_record.md",
    "tests/schema_examples/v7_41_external_remote_debug_verification_script_creation_record.example.yaml",
    "scripts/validate_v7_41_external_remote_debug_verification_script_creation_record.js",
    "docs/192_v7_40_local_a4_a5_autonomy_alignment.md",
    "docs/191_v7_39_external_remote_debug_verification_script_creation_authorization_point.md",
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
  assert(missing.length === 0, `Missing v7.41 script creation record files: ${missing.join(", ")}`);

  const record = read("docs/193_v7_41_external_remote_debug_verification_script_creation_record.md");
  const contract = read("review_console/embed_contract/vcpchat_external_remote_debug_verification_script_creation_record.md");
  const schema = read("tests/schema_examples/v7_41_external_remote_debug_verification_script_creation_record.example.yaml");
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
    "current_head_before_batch: 8f60ae1",
    "local_head_before_batch: 8f60ae1",
    "origin_master_short: 5a7f5ba",
    "docs/192_v7_40_local_a4_a5_autonomy_alignment.md",
    "docs/191_v7_39_external_remote_debug_verification_script_creation_authorization_point.md",
    "v7.42 External Remote Debug Verification Script Creation Authorization Package"
  ]);

  const creationDecisionRecorded = includesAll(currentContents, [
    `script_path_under_review: ${scriptPath}`,
    "original_target_phase_from_v7_39: \"v7.40 External Remote Debug Verification Script Creation Record\"",
    "actual_current_phase: \"v7.41 External Remote Debug Verification Script Creation Record\"",
    "creation_record_created: true",
    "script_created_by_this_phase: false",
    "script_creation_deferred: true",
    "safe_to_create_script_now: false",
    "safe_to_run_script_now: false",
    "safe_to_start_vcpchat_now: false",
    "safe_to_access_cdp_now: false",
    "safe_to_modify_vcpchat_now: false"
  ]);

  const authorizationGapRecorded = includesAll(currentContents, [
    "active_a5_authorization_package_present: false",
    "active_script_creation_authorization_package_present: false",
    "executable_script_creation_allowed_now: false",
    "app_launch_allowed_now: false",
    "cdp_access_allowed_now: false",
    "reviewer_confirmed_now: false",
    "rollback_path_confirmed_now: false",
    "stop_conditions_confirmed_now: false"
  ]);

  const futurePackageRecorded = includesAll(currentContents, [
    "future_creation_authorization_package",
    "authorization_id",
    "authorized_by",
    "authorized_at",
    "allowed_file_to_create",
    scriptPath,
    "required_default_behavior",
    "dry_run: true",
    "execute: false",
    "app_launch: false",
    "cdp_access: false",
    "bridge_method_invocation: false",
    "must_not_embed_raw_local_paths",
    "must_not_embed_raw_cdp_endpoint",
    "must_not_read_env_or_secret_on_creation",
    "must_not_auto_launch_vcpchat",
    "must_not_modify_vcpchat",
    "must_emit_sanitized_json_only",
    "rollback_path",
    "reviewer",
    "stop_conditions"
  ]);

  const phaseBoundaryRecorded = includesAll(currentContents, [
    "creation_record_created: true",
    "remote_debug_script_created: false",
    "script_run_by_this_phase: false",
    "app_launch_authorized_by_this_phase: false",
    "app_launch_performed_by_this_phase: false",
    "remote_debug_authorized_by_this_phase: false",
    "remote_debug_used_by_this_phase: false",
    "cdp_access_authorized_by_this_phase: false",
    "cdp_endpoint_accessed_by_this_phase: false",
    "runtime_evaluate_authorized_by_this_phase: false",
    "runtime_evaluate_performed_by_this_phase: false",
    "bridge_load_session_called: false",
    "bridge_preview_draft_called: false",
    "bridge_submit_draft_called: false",
    "bridge_cancel_called: false",
    "plugin_called: false",
    "api_called: false",
    "daily_note_called: false",
    "vcp_memory_written: false",
    "image_created: false",
    "dependency_changed: false",
    "package_manifest_changed: false",
    "lockfile_changed: false",
    "vcpchat_modified_by_this_phase: false",
    "vcptoolbox_modified_by_this_phase: false",
    "vcpchat_pushed: false",
    "tag_created: false",
    "push_performed: false",
    "github_release_performed: false"
  ]);

  const forbiddenTrueKeys = [
    "remote_debug_script_created",
    "script_run_by_this_phase",
    "app_launch_authorized_by_this_phase",
    "app_launch_performed_by_this_phase",
    "remote_debug_authorized_by_this_phase",
    "remote_debug_used_by_this_phase",
    "cdp_access_authorized_by_this_phase",
    "cdp_endpoint_accessed_by_this_phase",
    "runtime_evaluate_authorized_by_this_phase",
    "runtime_evaluate_performed_by_this_phase",
    "bridge_load_session_called",
    "bridge_preview_draft_called",
    "bridge_submit_draft_called",
    "bridge_cancel_called",
    "plugin_called",
    "api_called",
    "daily_note_called",
    "vcp_memory_written",
    "image_created",
    "dependency_changed",
    "package_manifest_changed",
    "lockfile_changed",
    "vcpchat_modified_by_this_phase",
    "vcptoolbox_modified_by_this_phase",
    "vcpchat_pushed",
    "tag_created",
    "push_performed",
    "github_release_performed",
    "active_a5_authorization_package_present",
    "active_script_creation_authorization_package_present",
    "executable_script_creation_allowed_now",
    "app_launch_allowed_now",
    "cdp_access_allowed_now"
  ];
  const noForbiddenTrue = excludesExactTrueFlags(currentContents, forbiddenTrueKeys);

  const noRawLocalPath = excludesAll(currentContents, [
    "A:\\VCP",
    "A:/VCP",
    "C:\\Users",
    "C:/Users"
  ]);

  const indexesCurrent = includesAll(indexes, [
    currentPhase,
    "docs/193_v7_41_external_remote_debug_verification_script_creation_record.md",
    "review_console/embed_contract/vcpchat_external_remote_debug_verification_script_creation_record.md",
    "tests/schema_examples/v7_41_external_remote_debug_verification_script_creation_record.example.yaml",
    "scripts/validate_v7_41_external_remote_debug_verification_script_creation_record.js"
  ]);

  const boardCurrent = includesAll(board, [
    currentPhase,
    "v7.41 local: external remote-debug verification script creation record deferred real script creation",
    "Local head before v7.41 batch: 8f60ae1",
    "pending local commits before v7.41: 1",
    "Local pending commit chain before v7.41: 8f60ae1",
    "node scripts/validate_v7_41_external_remote_debug_verification_script_creation_record.js: passed",
    "v7.41 local commit: commit 0326150 records remote-debug script creation deferral",
    "Without an active A5 authorization package, production actions remain blocked"
  ]);

  const checklistCurrent = includesAll(checklist, [
    "## v7.41 External Remote Debug Verification Script Creation Record 检查",
    "`docs/193_v7_41_external_remote_debug_verification_script_creation_record.md` 存在",
    "`review_console/embed_contract/vcpchat_external_remote_debug_verification_script_creation_record.md` 存在",
    "`tests/schema_examples/v7_41_external_remote_debug_verification_script_creation_record.example.yaml` 存在",
    "`scripts/validate_v7_41_external_remote_debug_verification_script_creation_record.js` 存在",
    "remote_debug_script_created=false",
    "script_creation_deferred=true",
    "`node scripts/validate_v7_41_external_remote_debug_verification_script_creation_record.js` 通过"
  ]);

  assert(phaseRecorded, "v7.41 phase and baseline must be recorded.");
  assert(creationDecisionRecorded, "v7.41 creation decision must be recorded.");
  assert(authorizationGapRecorded, "v7.41 authorization gap must be recorded.");
  assert(futurePackageRecorded, "v7.41 future creation authorization package must be recorded.");
  assert(phaseBoundaryRecorded, "v7.41 phase boundary must be recorded.");
  assert(noForbiddenTrue, "v7.41 must not set execution or authorization gap flags to true.");
  assert(noRawLocalPath, "v7.41 must not save raw local VCP or user paths.");
  assert(indexesCurrent, "Top-level indexes must reference v7.41 creation record.");
  assert(boardCurrent, "Agent board must be synchronized to v7.41 creation record.");
  assert(checklistCurrent, "Validation checklist must include v7.41 checks.");

  process.stdout.write(`${JSON.stringify({
    passed: true,
    v7_41_external_remote_debug_verification_script_creation_record: {
      phase_recorded: phaseRecorded,
      creation_decision_recorded: creationDecisionRecorded,
      authorization_gap_recorded: authorizationGapRecorded,
      future_package_recorded: futurePackageRecorded,
      phase_boundary_recorded: phaseBoundaryRecorded,
      no_forbidden_true_flags: noForbiddenTrue,
      no_raw_local_path: noRawLocalPath,
      indexes_current: indexesCurrent,
      agent_board_current: boardCurrent,
      checklist_current: checklistCurrent,
      script_exists_now: exists(scriptPath),
      remote_debug_script_created: false,
      script_creation_deferred: true,
      origin_master_short: originMasterShort,
      local_head_before_batch: localHeadBeforeBatch,
      pending_local_commits_before_batch: 1,
      next_safe_phase: "v7.42 External Remote Debug Verification Script Creation Authorization Package"
    }
  }, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
}
