const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const currentPhase = "v10.0 A5 end-to-end activation package readiness";
const previousPhase = "v7.46 remote-debug relaunch runtime verification record";

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
    "docs/199_v10_0_a5_end_to_end_activation_package_readiness.md",
    "review_console/embed_contract/v10_0_a5_end_to_end_activation_package.md",
    "tests/schema_examples/v10_0_a5_end_to_end_activation_package.example.yaml",
    "scripts/validate_v10_0_a5_end_to_end_activation_package.js",
    "docs/198_v7_46_remote_debug_relaunch_runtime_verification_record.md",
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
  assert(missing.length === 0, `Missing v10.0 A5 activation package files: ${missing.join(", ")}`);

  const record = read("docs/199_v10_0_a5_end_to_end_activation_package_readiness.md");
  const contract = read("review_console/embed_contract/v10_0_a5_end_to_end_activation_package.md");
  const schema = read("tests/schema_examples/v10_0_a5_end_to_end_activation_package.example.yaml");
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
    "docs/198_v7_46_remote_debug_relaunch_runtime_verification_record.md",
    "BLOCKED until external target worktrees are clean or explicitly reconciled"
  ]);

  const activationBlocked = includesAll(currentContents, [
    "activation_package_recorded: true",
    "active_a5_authorization_package_present: true",
    "activation_ready: false",
    "a5_execution_started: false",
    "a5_preflight_started: true",
    "a5_preflight_blocked: true",
    "real_vcpchat_root_provided: true",
    "real_vcptoolbox_root_provided: true",
    "raw_real_paths_recorded_in_git: false",
    "external_target_worktrees_clean: false",
    "vcpchat_worktree_clean: false",
    "vcptoolbox_worktree_clean: false",
    "production_actions_blocked: true"
  ]);

  const packageFieldsRecorded = includesAll(currentContents, [
    "mode: single_batch_a5_end_to_end",
    "target_repo: agent_image_lab",
    "target_branch: master",
    "working_branch: codex/a5-complete-delivery-20260507",
    "pr_target_branch: master",
    "selected_plugin_id: DoubaoGen",
    "selected_plugin_command: generate",
    "selected_plugin_model: doubao-seedream-5-0-260128",
    "max_plugin_calls: 1",
    "output_directory_ref: runs/a5_complete_delivery_photo_studio_os",
    "overwrite_existing_files_allowed: false",
    "max_bridge_calls_per_method: 1",
    "daily_note_write_allowed: true",
    "vcp_memory_write_allowed: true",
    "max_daily_note_writes: 1",
    "max_vcp_memory_writes: 1",
    "github_release_allowed: false",
    "tag: v10.0.0-a5-complete-delivery-rc1",
    "commit_message: \"feat: complete a5 end-to-end delivery candidate\""
  ]);

  const bridgePolicyRecorded = includesAll(currentContents, [
    "- cancel",
    "- loadSession",
    "- previewDraft",
    "- submitDraft",
    "bridge_methods_forbidden",
    "bridge_submitDraft_required"
  ]);

  const executionPlanRecorded = includesAll(currentContents, [
    "a5_preflight",
    "vcpchat_runtime_bridge_verification",
    "review_console_runtime_handoff",
    "doubaogen_single_real_generation",
    "review_and_archive_decision",
    "daily_note_and_vcp_memory_write",
    "delivery_candidate_closeout",
    "version_actions"
  ]);

  const forbiddenOutputsRecorded = includesAll(currentContents, [
    "raw_local_path",
    "raw_endpoint",
    "raw_websocket_url",
    "raw_runtime_log",
    "raw_ipc_payload",
    "raw_plugin_output",
    "raw_source_code",
    "secret",
    "token",
    "cookie",
    "password",
    "customer_private_data",
    "image_binary_in_git_or_memory"
  ]);

  const forbiddenTrueKeys = [
    "activation_ready",
    "a5_execution_started",
    "raw_real_paths_recorded_in_git",
    "external_target_worktrees_clean",
    "vcpchat_worktree_clean",
    "vcptoolbox_worktree_clean",
    "vcpchat_source_read",
    "vcpchat_modified_by_this_phase",
    "vcptoolbox_source_read",
    "vcptoolbox_modified_by_this_phase",
    "bridge_method_invocation_performed",
    "bridge_cancel_called",
    "bridge_load_session_called",
    "bridge_preview_draft_called",
    "bridge_submit_draft_called",
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
    "docs/199_v10_0_a5_end_to_end_activation_package_readiness.md",
    "review_console/embed_contract/v10_0_a5_end_to_end_activation_package.md",
    "tests/schema_examples/v10_0_a5_end_to_end_activation_package.example.yaml",
    "scripts/validate_v10_0_a5_end_to_end_activation_package.js",
    "github_release_allowed: false"
  ]);

  const boardCurrent = includesAll(board, [
    currentPhase,
    "v10.0 local: A5 end-to-end activation package readiness recorded and preflight blocked",
    "active A5 authorization package present: yes",
    "real_vcpchat_root provided: yes",
    "real_vcptoolbox_root provided: yes",
    "A5 execution started: no",
    "A5 production execution remains blocked until external target worktrees are clean or explicitly reconciled"
  ]);

  const checklistCurrent = includesAll(checklist, [
    "## v10.0 A5 End-to-end Activation Package Readiness 检查",
    "`docs/199_v10_0_a5_end_to_end_activation_package_readiness.md` 存在",
    "`review_console/embed_contract/v10_0_a5_end_to_end_activation_package.md` 存在",
    "`tests/schema_examples/v10_0_a5_end_to_end_activation_package.example.yaml` 存在",
    "`scripts/validate_v10_0_a5_end_to_end_activation_package.js` 存在",
    "`active_a5_authorization_package_present=true`",
    "`activation_ready=false`",
    "`a5_preflight_blocked=true`",
    "`a5_execution_started=false`",
    "`github_release_allowed=false`",
    "`node scripts/validate_v10_0_a5_end_to_end_activation_package.js` 通过"
  ]);

  assert(phaseRecorded, "v10.0 A5 activation package phase must be recorded.");
  assert(activationBlocked, "v10.0 must record that A5 activation is blocked until required fields are supplied.");
  assert(packageFieldsRecorded, "v10.0 required A5 package fields must be recorded.");
  assert(bridgePolicyRecorded, "v10.0 bridge method policy must be recorded.");
  assert(executionPlanRecorded, "v10.0 A5 execution plan stages must be recorded.");
  assert(forbiddenOutputsRecorded, "v10.0 forbidden outputs must be recorded.");
  assert(noForbiddenTrue, "v10.0 readiness must not set execution/performed flags to true.");
  assert(noRawSensitiveValues, "v10.0 readiness must not save raw paths or endpoints.");
  assert(indexesCurrent, "Top-level indexes must reference v10.0 A5 activation package readiness.");
  assert(boardCurrent, "Agent board must be synchronized to v10.0 A5 activation package readiness.");
  assert(checklistCurrent, "Validation checklist must include v10.0 A5 activation package checks.");

  process.stdout.write(`${JSON.stringify({
    passed: true,
    v10_0_a5_end_to_end_activation_package: {
      phase_recorded: phaseRecorded,
      activation_blocked: activationBlocked,
      required_package_fields_recorded: packageFieldsRecorded,
      bridge_policy_recorded: bridgePolicyRecorded,
      execution_plan_recorded: executionPlanRecorded,
      forbidden_outputs_recorded: forbiddenOutputsRecorded,
      no_forbidden_true_flags: noForbiddenTrue,
      no_raw_sensitive_values: noRawSensitiveValues,
      indexes_current: indexesCurrent,
      agent_board_current: boardCurrent,
      checklist_current: checklistCurrent,
      active_a5_authorization_package_present: true,
      activation_ready: false,
      a5_execution_started: false,
      a5_preflight_blocked: true,
      external_target_worktrees_clean: false,
      missing_required_fields: [],
      github_release_allowed: false,
      next_safe_phase: "BLOCKED until external target worktrees are clean or explicitly reconciled"
    }
  }, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
}
