const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const currentPhase = "v7.46 remote-debug relaunch runtime verification record";
const previousPhase = "v7.45 cdp read-only attempt record";
const originMasterShort = "5a7f5ba";
const localHeadBeforeBatch = "3fdd966";

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
    "docs/198_v7_46_remote_debug_relaunch_runtime_verification_record.md",
    "review_console/embed_contract/vcpchat_remote_debug_relaunch_runtime_verification_record.md",
    "tests/schema_examples/v7_46_remote_debug_relaunch_runtime_verification_record.example.yaml",
    "scripts/validate_v7_46_remote_debug_relaunch_runtime_verification_record.js",
    "docs/197_v7_45_cdp_read_only_attempt_record.md",
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
  assert(missing.length === 0, `Missing v7.46 runtime verification files: ${missing.join(", ")}`);

  const record = read("docs/198_v7_46_remote_debug_relaunch_runtime_verification_record.md");
  const contract = read("review_console/embed_contract/vcpchat_remote_debug_relaunch_runtime_verification_record.md");
  const schema = read("tests/schema_examples/v7_46_remote_debug_relaunch_runtime_verification_record.example.yaml");
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
    "current_head_before_batch: 3fdd966",
    "local_head_before_batch: 3fdd966",
    "origin_master_short: 5a7f5ba",
    "docs/197_v7_45_cdp_read_only_attempt_record.md",
    "BLOCKED before bridge invocation, source read, plugin/API/DailyNote/VCP memory/image, push/tag/release"
  ]);

  const authorizationRecorded = includesAll(currentContents, [
    "authorization_received: true",
    "authorized_by: current_user",
    "authorized_at: \"2026-05-06\"",
    "process_stop_authorized: true",
    "remote_debug_relaunch_authorized: true",
    "unsaved_window_state_loss_risk_accepted_by_user: true",
    "cdp_read_only_access_authorized: true",
    "targets_list_read_authorized: true",
    "runtime_evaluate_authorized: true",
    "bridge_method_invocation_authorized: false",
    "source_read_authorized: false",
    "source_modification_authorized: false"
  ]);

  const relaunchRecorded = includesAll(currentContents, [
    "previous_electron_process_stop_performed: true",
    "previous_electron_process_count_stopped: 6",
    "relaunch_performed: true",
    "relaunch_command_summary: electron_remote_debugging_port_9222_desktop_only",
    "launch_root_recorded_in_git: false",
    "launch_root_ref: redacted_external_vcpchat_root",
    "electron_processes_observed_after_relaunch: true",
    "cdp_endpoint_ref: redacted_local_cdp_9222",
    "cdp_endpoint_accessed_by_this_phase: true",
    "cdp_endpoint_access_succeeded_by_this_phase: true",
    "cdp_targets_list_read_by_this_phase: true",
    "cdp_target_count: 3",
    "selected_target_title: VCPChat",
    "selected_target_type: page",
    "selected_target_url_kind: file"
  ]);

  const runtimeRecorded = includesAll(currentContents, [
    "runtime_evaluate_attempted: true",
    "runtime_evaluate_performed_by_this_phase: true",
    "runtime_evaluate_returned_by_value: true",
    "runtime_evaluate_expression_sanitized: true",
    "typeof_checks",
    "object_keys_checks",
    "bridge_method_presence_boolean_checks",
    "document_title: VCPChat",
    "image_lab_review_type: object",
    "image_lab_review_mount_type: object",
    "image_lab_review_runtime_type: object",
    "prototype_guard_type: undefined",
    "prototype_guard_value_kind: undefined",
    "bridge_method_presence_checked: true",
    "bridge_method_invocation_performed: false",
    "createDraftBundle"
  ]);

  const allowlistMethodsRecorded = includesAll(currentContents, [
    "loadSession: true",
    "previewDraft: true",
    "submitDraft: true",
    "cancel: true",
    "- loadSession",
    "- previewDraft",
    "- submitDraft",
    "- cancel"
  ]);

  const phaseBoundaryRecorded = includesAll(currentContents, [
    "process_stop_authorized_by_this_phase: true",
    "process_stop_performed_by_this_phase: true",
    "remote_debug_relaunch_authorized_by_this_phase: true",
    "remote_debug_relaunch_performed_by_this_phase: true",
    "cdp_read_only_access_authorized_by_this_phase: true",
    "cdp_endpoint_accessed_by_this_phase: true",
    "cdp_endpoint_access_succeeded_by_this_phase: true",
    "cdp_targets_list_read_by_this_phase: true",
    "runtime_evaluate_authorized_by_this_phase: true",
    "runtime_evaluate_attempted_by_this_phase: true",
    "runtime_evaluate_performed_by_this_phase: true",
    "bridge_method_presence_checked_by_this_phase: true",
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
    "webSocketDebuggerUrl",
    "file:///"
  ]);

  const indexesCurrent = includesAll(indexes, [
    currentPhase,
    "docs/198_v7_46_remote_debug_relaunch_runtime_verification_record.md",
    "review_console/embed_contract/vcpchat_remote_debug_relaunch_runtime_verification_record.md",
    "tests/schema_examples/v7_46_remote_debug_relaunch_runtime_verification_record.example.yaml",
    "scripts/validate_v7_46_remote_debug_relaunch_runtime_verification_record.js"
  ]);

  const boardCurrent = includesAll(board, [
    currentPhase,
    "v7.46 local: remote-debug relaunch completed and CDP Runtime.evaluate surface verification passed",
    "Local head before v7.46 batch: 3fdd966",
    "pending local commits before v7.46: 6",
    "Local pending commit chain before v7.46: 8f60ae1 -> 0326150 -> 975da9a -> d728a89 -> b83ccd5 -> 3fdd966",
    "Runtime.evaluate performed by this phase: yes, read-only surface checks only",
    "bridge method invocation performed: no",
    "Without an active A5 authorization package, production actions remain blocked"
  ]);

  const checklistCurrent = includesAll(checklist, [
    "## v7.46 Remote-debug Relaunch Runtime Verification Record 检查",
    "`docs/198_v7_46_remote_debug_relaunch_runtime_verification_record.md` 存在",
    "`review_console/embed_contract/vcpchat_remote_debug_relaunch_runtime_verification_record.md` 存在",
    "`tests/schema_examples/v7_46_remote_debug_relaunch_runtime_verification_record.example.yaml` 存在",
    "`scripts/validate_v7_46_remote_debug_relaunch_runtime_verification_record.js` 存在",
    "remote_debug_relaunch_performed_by_this_phase=true",
    "cdp_endpoint_access_succeeded_by_this_phase=true",
    "runtime_evaluate_performed_by_this_phase=true",
    "bridge_method_invocation_performed=false",
    "`node scripts/validate_v7_46_remote_debug_relaunch_runtime_verification_record.js` 通过"
  ]);

  assert(phaseRecorded, "v7.46 phase and baseline must be recorded.");
  assert(authorizationRecorded, "v7.46 authorization must be recorded.");
  assert(relaunchRecorded, "v7.46 relaunch result must be recorded.");
  assert(runtimeRecorded, "v7.46 Runtime.evaluate result must be recorded.");
  assert(allowlistMethodsRecorded, "v7.46 bridge method presence must be recorded.");
  assert(phaseBoundaryRecorded, "v7.46 phase boundary must be recorded.");
  assert(noForbiddenTrue, "v7.46 must not set forbidden side-effect flags to true.");
  assert(noRawLocalPathOrEndpoint, "v7.46 must not save raw local paths or endpoints.");
  assert(indexesCurrent, "Top-level indexes must reference v7.46 runtime verification record.");
  assert(boardCurrent, "Agent board must be synchronized to v7.46 runtime verification record.");
  assert(checklistCurrent, "Validation checklist must include v7.46 checks.");

  process.stdout.write(`${JSON.stringify({
    passed: true,
    v7_46_remote_debug_relaunch_runtime_verification_record: {
      phase_recorded: phaseRecorded,
      authorization_recorded: authorizationRecorded,
      relaunch_recorded: relaunchRecorded,
      runtime_recorded: runtimeRecorded,
      allowlist_methods_recorded: allowlistMethodsRecorded,
      phase_boundary_recorded: phaseBoundaryRecorded,
      no_forbidden_true_flags: noForbiddenTrue,
      no_raw_local_path_or_endpoint: noRawLocalPathOrEndpoint,
      indexes_current: indexesCurrent,
      agent_board_current: boardCurrent,
      checklist_current: checklistCurrent,
      remote_debug_relaunch_performed_by_this_phase: true,
      cdp_endpoint_access_succeeded_by_this_phase: true,
      cdp_targets_list_read_by_this_phase: true,
      runtime_evaluate_performed_by_this_phase: true,
      bridge_method_presence_checked_by_this_phase: true,
      bridge_method_invocation_performed: false,
      origin_master_short: originMasterShort,
      local_head_before_batch: localHeadBeforeBatch,
      pending_local_commits_before_batch: 6,
      next_safe_phase: "BLOCKED before bridge invocation, source read, plugin/API/DailyNote/VCP memory/image, push/tag/release"
    }
  }, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
}
