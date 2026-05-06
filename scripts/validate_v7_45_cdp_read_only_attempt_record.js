const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const currentPhase = "v7.45 cdp read-only attempt record";
const previousPhase = "v7.44 remote-debug script run and vcpchat launch record";
const originMasterShort = "5a7f5ba";
const localHeadBeforeBatch = "b83ccd5";

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
    "docs/197_v7_45_cdp_read_only_attempt_record.md",
    "review_console/embed_contract/vcpchat_cdp_read_only_attempt_record.md",
    "tests/schema_examples/v7_45_cdp_read_only_attempt_record.example.yaml",
    "scripts/validate_v7_45_cdp_read_only_attempt_record.js",
    "docs/196_v7_44_remote_debug_script_run_and_vcpchat_launch_record.md",
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
  assert(missing.length === 0, `Missing v7.45 CDP attempt files: ${missing.join(", ")}`);

  const record = read("docs/197_v7_45_cdp_read_only_attempt_record.md");
  const contract = read("review_console/embed_contract/vcpchat_cdp_read_only_attempt_record.md");
  const schema = read("tests/schema_examples/v7_45_cdp_read_only_attempt_record.example.yaml");
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
    "current_head_before_batch: b83ccd5",
    "local_head_before_batch: b83ccd5",
    "origin_master_short: 5a7f5ba",
    "docs/196_v7_44_remote_debug_script_run_and_vcpchat_launch_record.md",
    "BLOCKED until explicit VCPChat remote-debug relaunch authorization"
  ]);

  const authorizationRecorded = includesAll(currentContents, [
    "authorization_received: true",
    "authorized_by: current_user",
    "authorized_at: \"2026-05-06\"",
    "cdp_read_only_access_authorized: true",
    "targets_list_read_authorized: true",
    "runtime_evaluate_authorized: true",
    "window.imageLabReview",
    "imageLabReviewMount",
    "imageLabReviewRuntime",
    "prototype_guard",
    "bridge_method_invocation_authorized: false"
  ]);

  const cdpAttemptRecorded = includesAll(currentContents, [
    "endpoint_ref: redacted_local_cdp_9222",
    "endpoint_http_request_attempted: true",
    "endpoint_http_request_succeeded: false",
    "endpoint_failure_kind: HttpRequestException",
    "cdp_targets_list_read: false",
    "cdp_target_count: 0",
    "electron_processes_observed: true",
    "electron_process_count: 6",
    "electron_owned_listening_connection_count: 0",
    "runtime_evaluate_attempted: false",
    "runtime_evaluate_performed: false",
    "reason_runtime_evaluate_not_performed: no_available_cdp_target"
  ]);

  const phaseBoundaryRecorded = includesAll(currentContents, [
    "cdp_read_only_access_authorized_by_this_phase: true",
    "cdp_endpoint_access_attempted_by_this_phase: true",
    "cdp_endpoint_access_succeeded_by_this_phase: false",
    "cdp_targets_list_read_by_this_phase: false",
    "runtime_evaluate_authorized_by_this_phase: true",
    "runtime_evaluate_attempted_by_this_phase: false",
    "runtime_evaluate_performed_by_this_phase: false",
    "bridge_method_invocation_authorized_by_this_phase: false",
    "bridge_method_invocation_performed: false",
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
    "vcpchat_source_read: false",
    "vcpchat_modified_by_this_phase: false",
    "vcptoolbox_source_read: false",
    "vcptoolbox_modified_by_this_phase: false",
    "output_file_written: false",
    "tag_created: false",
    "push_performed: false",
    "github_release_performed: false"
  ]);

  const forbiddenTrueKeys = [
    "cdp_endpoint_access_succeeded_by_this_phase",
    "cdp_targets_list_read_by_this_phase",
    "runtime_evaluate_attempted_by_this_phase",
    "runtime_evaluate_performed_by_this_phase",
    "bridge_method_invocation_authorized_by_this_phase",
    "bridge_method_invocation_performed",
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
    "vcpchat_source_read",
    "vcpchat_modified_by_this_phase",
    "vcptoolbox_source_read",
    "vcptoolbox_modified_by_this_phase",
    "output_file_written",
    "tag_created",
    "push_performed",
    "github_release_performed"
  ];
  const noForbiddenTrue = excludesExactTrueFlags(currentContents, forbiddenTrueKeys);

  const noRawLocalPathOrEndpoint = excludesAll(currentContents, [
    "A:\\VCP",
    "A:/VCP",
    "C:\\Users",
    "C:/Users",
    "http://",
    "https://",
    "ws://",
    "127.0.0.1",
    "localhost",
    "webSocketDebuggerUrl"
  ]);

  const indexesCurrent = includesAll(indexes, [
    currentPhase,
    "docs/197_v7_45_cdp_read_only_attempt_record.md",
    "review_console/embed_contract/vcpchat_cdp_read_only_attempt_record.md",
    "tests/schema_examples/v7_45_cdp_read_only_attempt_record.example.yaml",
    "scripts/validate_v7_45_cdp_read_only_attempt_record.js"
  ]);

  const boardCurrent = includesAll(board, [
    currentPhase,
    "v7.45 local: CDP read-only access attempted but no available CDP endpoint",
    "Local head before v7.45 batch: b83ccd5",
    "pending local commits before v7.45: 5",
    "Local pending commit chain before v7.45: 8f60ae1 -> 0326150 -> 975da9a -> d728a89 -> b83ccd5",
    "node scripts/validate_v7_45_cdp_read_only_attempt_record.js: passed",
    "CDP access remains blocked",
    "Without an active A5 authorization package, production actions remain blocked"
  ]);

  const checklistCurrent = includesAll(checklist, [
    "## v7.45 CDP Read-only Attempt Record 检查",
    "`docs/197_v7_45_cdp_read_only_attempt_record.md` 存在",
    "`review_console/embed_contract/vcpchat_cdp_read_only_attempt_record.md` 存在",
    "`tests/schema_examples/v7_45_cdp_read_only_attempt_record.example.yaml` 存在",
    "`scripts/validate_v7_45_cdp_read_only_attempt_record.js` 存在",
    "cdp_endpoint_access_attempted_by_this_phase=true",
    "cdp_endpoint_access_succeeded_by_this_phase=false",
    "runtime_evaluate_performed_by_this_phase=false",
    "`node scripts/validate_v7_45_cdp_read_only_attempt_record.js` 通过"
  ]);

  assert(phaseRecorded, "v7.45 phase and baseline must be recorded.");
  assert(authorizationRecorded, "v7.45 authorization must be recorded.");
  assert(cdpAttemptRecorded, "v7.45 CDP attempt result must be recorded.");
  assert(phaseBoundaryRecorded, "v7.45 phase boundary must be recorded.");
  assert(noForbiddenTrue, "v7.45 must not set forbidden side-effect flags to true.");
  assert(noRawLocalPathOrEndpoint, "v7.45 must not save raw local paths or endpoints.");
  assert(indexesCurrent, "Top-level indexes must reference v7.45 CDP attempt record.");
  assert(boardCurrent, "Agent board must be synchronized to v7.45 CDP attempt record.");
  assert(checklistCurrent, "Validation checklist must include v7.45 checks.");

  process.stdout.write(`${JSON.stringify({
    passed: true,
    v7_45_cdp_read_only_attempt_record: {
      phase_recorded: phaseRecorded,
      authorization_recorded: authorizationRecorded,
      cdp_attempt_recorded: cdpAttemptRecorded,
      phase_boundary_recorded: phaseBoundaryRecorded,
      no_forbidden_true_flags: noForbiddenTrue,
      no_raw_local_path_or_endpoint: noRawLocalPathOrEndpoint,
      indexes_current: indexesCurrent,
      agent_board_current: boardCurrent,
      checklist_current: checklistCurrent,
      cdp_endpoint_access_attempted_by_this_phase: true,
      cdp_endpoint_access_succeeded_by_this_phase: false,
      cdp_targets_list_read_by_this_phase: false,
      runtime_evaluate_performed_by_this_phase: false,
      bridge_method_invocation_performed: false,
      origin_master_short: originMasterShort,
      local_head_before_batch: localHeadBeforeBatch,
      pending_local_commits_before_batch: 5,
      next_safe_phase: "BLOCKED until explicit VCPChat remote-debug relaunch authorization"
    }
  }, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
}
