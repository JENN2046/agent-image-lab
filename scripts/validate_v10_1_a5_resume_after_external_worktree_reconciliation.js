const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const currentPhase = "v10.1 A5 resume after external worktree reconciliation";
const previousPhase = "v10.0 A5 end-to-end activation package readiness";

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
    "docs/200_v10_1_a5_resume_after_external_worktree_reconciliation.md",
    "review_console/embed_contract/v10_1_a5_resume_after_external_worktree_reconciliation.md",
    "tests/schema_examples/v10_1_a5_resume_after_external_worktree_reconciliation.example.yaml",
    "scripts/validate_v10_1_a5_resume_after_external_worktree_reconciliation.js",
    "docs/199_v10_0_a5_end_to_end_activation_package_readiness.md",
    "review_console/embed_contract/v10_0_a5_end_to_end_activation_package.md",
    "tests/schema_examples/v10_0_a5_end_to_end_activation_package.example.yaml",
    "scripts/validate_v10_0_a5_end_to_end_activation_package.js",
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
  assert(missing.length === 0, `Missing v10.1 A5 resume files: ${missing.join(", ")}`);

  const record = read("docs/200_v10_1_a5_resume_after_external_worktree_reconciliation.md");
  const contract = read("review_console/embed_contract/v10_1_a5_resume_after_external_worktree_reconciliation.md");
  const schema = read("tests/schema_examples/v10_1_a5_resume_after_external_worktree_reconciliation.example.yaml");
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
    "docs/199_v10_0_a5_end_to_end_activation_package_readiness.md",
    "rerun A5 preflight after external worktree reconciliation"
  ]);

  const resumeStateRecorded = includesAll(currentContents, [
    "active_a5_authorization_package_present: true",
    "user_will_reconcile_external_worktrees: true",
    "user_reported_external_worktrees_clean: true",
    "external_worktree_reconciliation_performed_by_this_phase: false",
    "external_worktree_recheck_performed_by_this_phase: false",
    "a5_resume_ready: false",
    "a5_execution_started: false",
    "a5_preflight_rerun_required: true",
    "previous_a5_preflight_blocked: true",
    "real_vcpchat_root_provided: true",
    "real_vcptoolbox_root_provided: true",
    "raw_real_paths_recorded_in_git: false",
    "external_target_worktrees_clean_last_observed: false",
    "external_target_worktrees_clean_current: not_rechecked_by_this_phase",
    "vcpchat_worktree_clean_current: not_rechecked_by_this_phase",
    "vcptoolbox_worktree_clean_current: not_rechecked_by_this_phase",
    "production_actions_blocked: true"
  ]);

  const recheckPlanRecorded = includesAll(currentContents, [
    "confirm_agent_image_lab_branch_and_worktree",
    "fetch_remote_and_check_target_branch",
    "confirm_working_branch_still_valid",
    "confirm_tag_absent_locally_and_remotely",
    "confirm_output_directory_has_no_collision",
    "confirm_vcpchat_target_worktree_clean",
    "confirm_vcptoolbox_target_worktree_clean",
    "confirm_no_raw_sensitive_values_would_be_recorded",
    "confirm_bridge_allowlist_unchanged",
    "confirm_submitDraft_still_forbidden",
    "confirm_github_release_still_forbidden"
  ]);

  const carryForwardRecorded = includesAll(currentContents, [
    "mode: single_batch_a5_end_to_end",
    "target_repo: agent_image_lab",
    "target_branch: master",
    "working_branch: codex/a5-complete-delivery-20260507",
    "selected_plugin_id: DoubaoGen",
    "selected_plugin_command: generate",
    "selected_plugin_model: doubao-seedream-5-0-260128",
    "max_plugin_calls: 1",
    "output_directory_ref: runs/a5_complete_delivery_photo_studio_os",
    "overwrite_existing_files_allowed: false",
    "- cancel",
    "- loadSession",
    "- previewDraft",
    "- submitDraft",
    "max_bridge_calls_per_method: 1",
    "max_daily_note_writes: 1",
    "max_vcp_memory_writes: 1",
    "github_release_allowed: false",
    "tag: v10.0.0-a5-complete-delivery-rc1",
    "commit_message: \"feat: complete a5 end-to-end delivery candidate\""
  ]);

  const resumeOrderRecorded = includesAll(currentContents, [
    "repo_reality_recheck",
    "external_worktree_clean_recheck",
    "bridge_smoke_reentry_gate",
    "doubaogen_single_call_gate",
    "memory_write_gate",
    "version_action_gate"
  ]);

  const forbiddenTrueKeys = [
    "external_worktree_reconciliation_performed_by_this_phase",
    "external_worktree_recheck_performed_by_this_phase",
    "a5_resume_ready",
    "a5_execution_started",
    "raw_real_paths_recorded_in_git",
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
    "docs/200_v10_1_a5_resume_after_external_worktree_reconciliation.md",
    "review_console/embed_contract/v10_1_a5_resume_after_external_worktree_reconciliation.md",
    "tests/schema_examples/v10_1_a5_resume_after_external_worktree_reconciliation.example.yaml",
    "scripts/validate_v10_1_a5_resume_after_external_worktree_reconciliation.js",
    "a5_preflight_rerun_required",
    "github_release_allowed: false"
  ]);

  const boardCurrent = includesAll(board, [
    currentPhase,
    "v10.1 local: A5 resume-after-clean package recorded; rerun preflight required",
    "user will reconcile external worktrees: yes",
    "user reported external worktrees clean: yes",
    "A5 resume ready: no",
    "A5 preflight rerun required: yes",
    "No A5 production execution in v10.1"
  ]);

  const checklistCurrent = includesAll(checklist, [
    "## v10.1 A5 Resume After External Worktree Reconciliation 检查",
    "`docs/200_v10_1_a5_resume_after_external_worktree_reconciliation.md` 存在",
    "`review_console/embed_contract/v10_1_a5_resume_after_external_worktree_reconciliation.md` 存在",
    "`tests/schema_examples/v10_1_a5_resume_after_external_worktree_reconciliation.example.yaml` 存在",
    "`scripts/validate_v10_1_a5_resume_after_external_worktree_reconciliation.js` 存在",
    "`a5_preflight_rerun_required=true`",
    "`a5_resume_ready=false`",
    "`external_worktree_recheck_performed_by_this_phase=false`",
    "`github_release_allowed=false`",
    "`node scripts/validate_v10_1_a5_resume_after_external_worktree_reconciliation.js` 通过"
  ]);

  assert(phaseRecorded, "v10.1 A5 resume phase must be recorded.");
  assert(resumeStateRecorded, "v10.1 must record resume state and preflight rerun requirement.");
  assert(recheckPlanRecorded, "v10.1 required preflight recheck plan must be recorded.");
  assert(carryForwardRecorded, "v10.1 must carry forward bounded A5 package fields.");
  assert(resumeOrderRecorded, "v10.1 resume execution order must be recorded.");
  assert(noForbiddenTrue, "v10.1 must not set execution/performed flags to true.");
  assert(noRawSensitiveValues, "v10.1 must not save raw paths or endpoints.");
  assert(indexesCurrent, "Top-level indexes must reference v10.1 A5 resume package.");
  assert(boardCurrent, "Agent board must be synchronized to v10.1 A5 resume package.");
  assert(checklistCurrent, "Validation checklist must include v10.1 A5 resume checks.");

  process.stdout.write(`${JSON.stringify({
    passed: true,
    v10_1_a5_resume_after_external_worktree_reconciliation: {
      phase_recorded: phaseRecorded,
      resume_state_recorded: resumeStateRecorded,
      recheck_plan_recorded: recheckPlanRecorded,
      carry_forward_package_recorded: carryForwardRecorded,
      resume_order_recorded: resumeOrderRecorded,
      no_forbidden_true_flags: noForbiddenTrue,
      no_raw_sensitive_values: noRawSensitiveValues,
      indexes_current: indexesCurrent,
      agent_board_current: boardCurrent,
      checklist_current: checklistCurrent,
      active_a5_authorization_package_present: true,
      user_will_reconcile_external_worktrees: true,
      user_reported_external_worktrees_clean: true,
      external_worktree_recheck_performed_by_this_phase: false,
      a5_preflight_rerun_required: true,
      a5_resume_ready: false,
      a5_execution_started: false,
      github_release_allowed: false,
      next_safe_phase: "rerun A5 preflight after external worktree reconciliation"
    }
  }, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
}
