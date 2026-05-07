const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const currentPhase = "v10.2 A5 bridge smoke blocked record";
const previousPhase = "v10.1 A5 resume after external worktree reconciliation";

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
    "docs/201_v10_2_a5_bridge_smoke_blocked_record.md",
    "review_console/embed_contract/v10_2_a5_bridge_smoke_blocked_record.md",
    "tests/schema_examples/v10_2_a5_bridge_smoke_blocked_record.example.yaml",
    "scripts/validate_v10_2_a5_bridge_smoke_blocked_record.js",
    "docs/200_v10_1_a5_resume_after_external_worktree_reconciliation.md",
    "scripts/validate_v10_1_a5_resume_after_external_worktree_reconciliation.js",
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
  assert(missing.length === 0, `Missing v10.2 A5 bridge smoke blocked files: ${missing.join(", ")}`);

  const record = read("docs/201_v10_2_a5_bridge_smoke_blocked_record.md");
  const contract = read("review_console/embed_contract/v10_2_a5_bridge_smoke_blocked_record.md");
  const schema = read("tests/schema_examples/v10_2_a5_bridge_smoke_blocked_record.example.yaml");
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
    "docs/200_v10_1_a5_resume_after_external_worktree_reconciliation.md",
    "BLOCKED until VCPChat exposes imageLabReview bridge"
  ]);

  const preflightPassed = includesAll(currentContents, [
    "preflight_recheck_performed: true",
    "agent_image_lab_branch_valid: true",
    "origin_master_sync_count: \"0 0\"",
    "target_tag_absent: true",
    "output_directory_collision: false",
    "external_target_worktrees_rechecked: true",
    "vcpchat_worktree_clean_current: true",
    "vcptoolbox_worktree_clean_current: true",
    "raw_real_paths_recorded_in_git: false",
    "github_release_allowed: false"
  ]);

  const runtimeRecorded = includesAll(currentContents, [
    "vcpchat_remote_debug_launch_attempted: true",
    "vcpchat_remote_debug_launch_succeeded: true",
    "cdp_endpoint_access_succeeded: true",
    "cdp_targets_list_read: true",
    "cdp_target_count: 3",
    "raw_cdp_endpoint_recorded_in_git: false",
    "raw_websocket_url_recorded_in_git: false",
    "raw_runtime_log_recorded_in_git: false",
    "runtime_cleanup_attempted: true",
    "cdp_port_still_listening_after_cleanup: false"
  ]);

  const bridgeBlocked = includesAll(currentContents, [
    "selected_method: cancel",
    "max_bridge_calls: 1",
    "bridge_calls_observed: 0",
    "bridge_surface_checked: true",
    "bridge_surface_missing: true",
    "checked_page_targets: 3",
    "imageLabReview_present: false",
    "imageLabReviewRuntime_present: false",
    "imageLabReviewMount_present: false",
    "bridge_method_invocation_performed: false",
    "bridge_cancel_called: false",
    "bridge_load_session_called: false",
    "bridge_preview_draft_called: false",
    "bridge_submit_draft_called: false",
    "ack_summary_recorded: false"
  ]);

  const forbiddenTrueKeys = [
    "a5_execution_started",
    "side_effects_performed",
    "plugin_called",
    "api_called",
    "daily_note_called",
    "daily_note_written",
    "vcp_memory_written",
    "image_created",
    "output_file_written",
    "commit_performed",
    "tag_created",
    "push_performed",
    "pr_created",
    "github_release_performed"
  ];
  const noForbiddenTrue = excludesExactTrueFlags(currentContents, forbiddenTrueKeys);

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
    "docs/201_v10_2_a5_bridge_smoke_blocked_record.md",
    "review_console/embed_contract/v10_2_a5_bridge_smoke_blocked_record.md",
    "tests/schema_examples/v10_2_a5_bridge_smoke_blocked_record.example.yaml",
    "scripts/validate_v10_2_a5_bridge_smoke_blocked_record.js",
    "bridge_calls_observed: 0",
    "github_release_allowed: false"
  ]);

  const boardCurrent = includesAll(board, [
    currentPhase,
    "v10.2 local: A5 clean preflight passed; bridge smoke blocked because imageLabReview surface is missing",
    "bridge calls observed: 0",
    "VCPChat bridge surface missing: yes",
    "No DoubaoGen, DailyNote, VCP memory, image, commit, tag, push, PR, or release in v10.2"
  ]);

  const checklistCurrent = includesAll(checklist, [
    "## v10.2 A5 Bridge Smoke Blocked Record 检查",
    "`docs/201_v10_2_a5_bridge_smoke_blocked_record.md` 存在",
    "`review_console/embed_contract/v10_2_a5_bridge_smoke_blocked_record.md` 存在",
    "`tests/schema_examples/v10_2_a5_bridge_smoke_blocked_record.example.yaml` 存在",
    "`scripts/validate_v10_2_a5_bridge_smoke_blocked_record.js` 存在",
    "`preflight_recheck_performed=true`",
    "`bridge_calls_observed=0`",
    "`bridge_surface_missing=true`",
    "`github_release_allowed=false`",
    "`node scripts/validate_v10_2_a5_bridge_smoke_blocked_record.js` 通过"
  ]);

  assert(phaseRecorded, "v10.2 bridge smoke blocked phase must be recorded.");
  assert(preflightPassed, "v10.2 must record clean A5 preflight recheck.");
  assert(runtimeRecorded, "v10.2 must record runtime launch and cleanup result.");
  assert(bridgeBlocked, "v10.2 must record bridge surface missing and zero bridge calls.");
  assert(noForbiddenTrue, "v10.2 must not set production/action flags to true.");
  assert(noRawSensitiveValues, "v10.2 must not save raw paths, endpoints, websocket URLs, or runtime logs.");
  assert(indexesCurrent, "Top-level indexes must reference v10.2 bridge smoke blocked record.");
  assert(boardCurrent, "Agent board must be synchronized to v10.2 bridge smoke blocked record.");
  assert(checklistCurrent, "Validation checklist must include v10.2 bridge smoke blocked checks.");

  process.stdout.write(`${JSON.stringify({
    passed: true,
    v10_2_a5_bridge_smoke_blocked_record: {
      phase_recorded: phaseRecorded,
      preflight_passed: preflightPassed,
      runtime_recorded: runtimeRecorded,
      bridge_blocked: bridgeBlocked,
      no_forbidden_true_flags: noForbiddenTrue,
      no_raw_sensitive_values: noRawSensitiveValues,
      indexes_current: indexesCurrent,
      agent_board_current: boardCurrent,
      checklist_current: checklistCurrent,
      preflight_recheck_performed: true,
      external_target_worktrees_clean_current: true,
      selected_method: "cancel",
      max_bridge_calls: 1,
      bridge_calls_observed: 0,
      bridge_surface_missing: true,
      plugin_called: false,
      daily_note_written: false,
      vcp_memory_written: false,
      image_created: false,
      github_release_allowed: false,
      next_safe_phase: "BLOCKED until VCPChat exposes imageLabReview bridge or an explicit VCPChat bridge integration file-set authorization is provided"
    }
  }, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
}
