const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const currentPhase = "v7.44 remote-debug script run and vcpchat launch record";
const previousPhase = "v7.43 external remote-debug verification script creation execution record";
const originMasterShort = "5a7f5ba";
const localHeadBeforeBatch = "d728a89";

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
    "docs/196_v7_44_remote_debug_script_run_and_vcpchat_launch_record.md",
    "review_console/embed_contract/vcpchat_remote_debug_script_run_and_launch_record.md",
    "tests/schema_examples/v7_44_remote_debug_script_run_and_vcpchat_launch_record.example.yaml",
    "scripts/validate_v7_44_remote_debug_script_run_and_vcpchat_launch_record.js",
    "scripts/run_vcpchat_review_console_remote_debug_smoke.ps1",
    "docs/195_v7_43_external_remote_debug_verification_script_creation_execution_record.md",
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
  assert(missing.length === 0, `Missing v7.44 launch record files: ${missing.join(", ")}`);

  const record = read("docs/196_v7_44_remote_debug_script_run_and_vcpchat_launch_record.md");
  const contract = read("review_console/embed_contract/vcpchat_remote_debug_script_run_and_launch_record.md");
  const schema = read("tests/schema_examples/v7_44_remote_debug_script_run_and_vcpchat_launch_record.example.yaml");
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
    "current_head_before_batch: d728a89",
    "local_head_before_batch: d728a89",
    "origin_master_short: 5a7f5ba",
    "docs/195_v7_43_external_remote_debug_verification_script_creation_execution_record.md",
    "BLOCKED until explicit CDP access and bridge runtime verification authorization"
  ]);

  const authorizationRecorded = includesAll(currentContents, [
    "authorization_received: true",
    "authorized_by: current_user",
    "authorized_at: \"2026-05-06\"",
    "run_remote_debug_script",
    "launch_vcpchat",
    "access_cdp",
    "call_bridge_methods",
    "read_or_modify_vcpchat",
    "push_or_tag_or_release"
  ]);

  const scriptRunRecorded = includesAll(currentContents, [
    "path: scripts/run_vcpchat_review_console_remote_debug_smoke.ps1",
    "command_mode: default",
    "exit_code: 0",
    "dry_run: true",
    "execute_requested: false",
    "execution_blocked: true",
    "app_launch_performed_by_script: false",
    "remote_debug_used_by_script: false",
    "cdp_access_performed_by_script: false",
    "bridge_method_invocation_performed_by_script: false",
    "output_file_written_by_script: false",
    "vcpchat_root_supplied: false"
  ]);

  const launchRecorded = includesAll(currentContents, [
    "launch_authorized_by_user: true",
    "launch_attempted: true",
    "launch_command: npm run start:desktop:utf8",
    "launch_root_recorded_in_git: false",
    "launch_root_ref: redacted_external_vcpchat_root",
    "start_process_returned: true",
    "electron_processes_observed_after_launch: true",
    "cdp_port_9222_listening_observed: false",
    "app_launch_performed_by_this_phase: true"
  ]);

  const phaseBoundaryRecorded = includesAll(currentContents, [
    "script_run_by_this_phase: true",
    "script_dry_run_result_only: true",
    "app_launch_authorized_by_this_phase: true",
    "app_launch_performed_by_this_phase: true",
    "remote_debug_authorized_by_this_phase: false",
    "remote_debug_used_by_this_phase: false",
    "cdp_access_authorized_by_this_phase: false",
    "cdp_endpoint_accessed_by_this_phase: false",
    "runtime_evaluate_authorized_by_this_phase: false",
    "runtime_evaluate_performed_by_this_phase: false",
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
    "remote_debug_authorized_by_this_phase",
    "remote_debug_used_by_this_phase",
    "cdp_access_authorized_by_this_phase",
    "cdp_endpoint_accessed_by_this_phase",
    "runtime_evaluate_authorized_by_this_phase",
    "runtime_evaluate_performed_by_this_phase",
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

  const noRawLocalPath = excludesAll(currentContents, [
    "A:\\VCP",
    "A:/VCP",
    "C:\\Users",
    "C:/Users",
    "http://",
    "https://",
    "ws://",
    "127.0.0.1",
    "localhost"
  ]);

  const indexesCurrent = includesAll(indexes, [
    currentPhase,
    "docs/196_v7_44_remote_debug_script_run_and_vcpchat_launch_record.md",
    "review_console/embed_contract/vcpchat_remote_debug_script_run_and_launch_record.md",
    "tests/schema_examples/v7_44_remote_debug_script_run_and_vcpchat_launch_record.example.yaml",
    "scripts/validate_v7_44_remote_debug_script_run_and_vcpchat_launch_record.js"
  ]);

  const boardCurrent = includesAll(board, [
    currentPhase,
    "v7.44 local: remote-debug smoke script ran in dry-run blocked mode and VCPChat launched",
    "Local head before v7.44 batch: d728a89",
    "pending local commits before v7.44: 4",
    "Local pending commit chain before v7.44: 8f60ae1 -> 0326150 -> 975da9a -> d728a89",
    "node scripts/validate_v7_44_remote_debug_script_run_and_vcpchat_launch_record.js: passed",
    "CDP access remains blocked",
    "Without an active A5 authorization package, production actions remain blocked"
  ]);

  const checklistCurrent = includesAll(checklist, [
    "## v7.44 Remote Debug Script Run And VCPChat Launch Record 检查",
    "`docs/196_v7_44_remote_debug_script_run_and_vcpchat_launch_record.md` 存在",
    "`review_console/embed_contract/vcpchat_remote_debug_script_run_and_launch_record.md` 存在",
    "`tests/schema_examples/v7_44_remote_debug_script_run_and_vcpchat_launch_record.example.yaml` 存在",
    "`scripts/validate_v7_44_remote_debug_script_run_and_vcpchat_launch_record.js` 存在",
    "script_run_by_this_phase=true",
    "app_launch_performed_by_this_phase=true",
    "cdp_endpoint_accessed_by_this_phase=false",
    "`node scripts/validate_v7_44_remote_debug_script_run_and_vcpchat_launch_record.js` 通过"
  ]);

  assert(phaseRecorded, "v7.44 phase and baseline must be recorded.");
  assert(authorizationRecorded, "v7.44 execution authorization must be recorded.");
  assert(scriptRunRecorded, "v7.44 script run result must be recorded.");
  assert(launchRecorded, "v7.44 VCPChat launch result must be recorded.");
  assert(phaseBoundaryRecorded, "v7.44 phase boundary must be recorded.");
  assert(noForbiddenTrue, "v7.44 must not set forbidden side-effect flags to true.");
  assert(noRawLocalPath, "v7.44 must not save raw local paths or endpoints.");
  assert(indexesCurrent, "Top-level indexes must reference v7.44 launch record.");
  assert(boardCurrent, "Agent board must be synchronized to v7.44 launch record.");
  assert(checklistCurrent, "Validation checklist must include v7.44 checks.");

  process.stdout.write(`${JSON.stringify({
    passed: true,
    v7_44_remote_debug_script_run_and_vcpchat_launch_record: {
      phase_recorded: phaseRecorded,
      authorization_recorded: authorizationRecorded,
      script_run_recorded: scriptRunRecorded,
      launch_recorded: launchRecorded,
      phase_boundary_recorded: phaseBoundaryRecorded,
      no_forbidden_true_flags: noForbiddenTrue,
      no_raw_local_path_or_endpoint: noRawLocalPath,
      indexes_current: indexesCurrent,
      agent_board_current: boardCurrent,
      checklist_current: checklistCurrent,
      script_run_by_this_phase: true,
      app_launch_performed_by_this_phase: true,
      remote_debug_used_by_this_phase: false,
      cdp_endpoint_accessed_by_this_phase: false,
      bridge_method_invocation_performed: false,
      origin_master_short: originMasterShort,
      local_head_before_batch: localHeadBeforeBatch,
      pending_local_commits_before_batch: 4,
      next_safe_phase: "BLOCKED until explicit CDP access and bridge runtime verification authorization"
    }
  }, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
}
