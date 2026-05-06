const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const currentPhase = "v7.42 external remote-debug verification script creation authorization package";
const previousPhase = "v7.41 external remote-debug verification script creation record";
const originMasterShort = "5a7f5ba";
const localHeadBeforeBatch = "0326150";
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
    "docs/194_v7_42_external_remote_debug_verification_script_creation_authorization_package.md",
    "review_console/embed_contract/vcpchat_external_remote_debug_verification_script_creation_authorization_package.md",
    "tests/schema_examples/v7_42_external_remote_debug_verification_script_creation_authorization_package.example.yaml",
    "scripts/validate_v7_42_external_remote_debug_verification_script_creation_authorization_package.js",
    "docs/193_v7_41_external_remote_debug_verification_script_creation_record.md",
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
  assert(missing.length === 0, `Missing v7.42 authorization package files: ${missing.join(", ")}`);

  assert(!exists(scriptPath), "v7.42 must not create the real remote-debug smoke script.");

  const record = read("docs/194_v7_42_external_remote_debug_verification_script_creation_authorization_package.md");
  const contract = read("review_console/embed_contract/vcpchat_external_remote_debug_verification_script_creation_authorization_package.md");
  const schema = read("tests/schema_examples/v7_42_external_remote_debug_verification_script_creation_authorization_package.example.yaml");
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
    "current_head_before_batch: 0326150",
    "local_head_before_batch: 0326150",
    "origin_master_short: 5a7f5ba",
    "docs/193_v7_41_external_remote_debug_verification_script_creation_record.md",
    "BLOCKED until explicit script creation authorization"
  ]);

  const packageStateRecorded = includesAll(currentContents, [
    "package_record_created: true",
    "package_template_only: true",
    "package_active: false",
    "user_approved_script_creation_now: false",
    "active_a5_authorization_package_present: false",
    "active_script_creation_authorization_package_present: false",
    "exact_target_confirmed_now: false",
    "executable_script_creation_allowed_now: false",
    "safe_to_create_script_now: false",
    "safe_to_run_script_now: false",
    "safe_to_start_vcpchat_now: false",
    "safe_to_access_cdp_now: false",
    "safe_to_modify_vcpchat_now: false"
  ]);

  const requiredPackageRecorded = includesAll(currentContents, [
    "required_authorization_package",
    "authorization_id",
    "authorized_by",
    "authorized_at",
    "allowed_file_to_create",
    scriptPath,
    "forbidden_files",
    "allowed_creation_actions",
    "forbidden_creation_actions",
    "required_default_behavior",
    "validation_requirements",
    "rollback_path",
    "reviewer",
    "stop_conditions"
  ]);

  const behaviorRecorded = includesAll(currentContents, [
    "dry_run: true",
    "execute: false",
    "app_launch: false",
    "cdp_access: false",
    "bridge_method_invocation: false",
    "writes_outside_workspace: false",
    "launch_vcpchat",
    "access_cdp_endpoint",
    "call_bridge_loadSession",
    "call_bridge_previewDraft",
    "call_bridge_submitDraft",
    "call_bridge_cancel",
    "read_vcpchat_source",
    "modify_vcpchat_source",
    "modify_vcptoolbox_source",
    "call_plugin",
    "call_api",
    "call_dailynote",
    "write_vcp_memory",
    "create_image",
    "install_dependency",
    "push_or_tag_or_release"
  ]);

  const approvalTextRecorded = includesAll(currentContents, [
    "我明确授权创建 Agent Image Lab 本地脚本 scripts/run_vcpchat_review_console_remote_debug_smoke.ps1",
    "脚本必须默认 DryRun=true、Execute=false",
    "不得启动 VCPChat",
    "不得访问 CDP",
    "不得调用 bridge 方法",
    "不得读取或修改 VCPChat/VCPToolBox"
  ]);

  const phaseBoundaryRecorded = includesAll(currentContents, [
    "package_record_created: true",
    "package_active: false",
    "script_creation_authorized_by_this_phase: false",
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
    "tag_created: false",
    "push_performed: false",
    "github_release_performed: false"
  ]);

  const forbiddenTrueKeys = [
    "package_active",
    "user_approved_script_creation_now",
    "active_a5_authorization_package_present",
    "active_script_creation_authorization_package_present",
    "exact_target_confirmed_now",
    "executable_script_creation_allowed_now",
    "safe_to_create_script_now",
    "safe_to_run_script_now",
    "safe_to_start_vcpchat_now",
    "safe_to_access_cdp_now",
    "safe_to_modify_vcpchat_now",
    "script_creation_authorized_by_this_phase",
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
    "tag_created",
    "push_performed",
    "github_release_performed"
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
    "docs/194_v7_42_external_remote_debug_verification_script_creation_authorization_package.md",
    "review_console/embed_contract/vcpchat_external_remote_debug_verification_script_creation_authorization_package.md",
    "tests/schema_examples/v7_42_external_remote_debug_verification_script_creation_authorization_package.example.yaml",
    "scripts/validate_v7_42_external_remote_debug_verification_script_creation_authorization_package.js"
  ]);

  const boardCurrent = includesAll(board, [
    currentPhase,
    "v7.42 local: external remote-debug verification script creation authorization package template recorded",
    "Local head before v7.42 batch: 0326150",
    "pending local commits before v7.42: 2",
    "Local pending commit chain before v7.42: 8f60ae1 -> 0326150",
    "node scripts/validate_v7_42_external_remote_debug_verification_script_creation_authorization_package.js: passed",
    "BLOCKED until explicit script creation authorization",
    "Without an active A5 authorization package, production actions remain blocked"
  ]);

  const checklistCurrent = includesAll(checklist, [
    "## v7.42 External Remote Debug Verification Script Creation Authorization Package 检查",
    "`docs/194_v7_42_external_remote_debug_verification_script_creation_authorization_package.md` 存在",
    "`review_console/embed_contract/vcpchat_external_remote_debug_verification_script_creation_authorization_package.md` 存在",
    "`tests/schema_examples/v7_42_external_remote_debug_verification_script_creation_authorization_package.example.yaml` 存在",
    "`scripts/validate_v7_42_external_remote_debug_verification_script_creation_authorization_package.js` 存在",
    "package_active=false",
    "script_creation_authorized_by_this_phase=false",
    "`node scripts/validate_v7_42_external_remote_debug_verification_script_creation_authorization_package.js` 通过"
  ]);

  assert(phaseRecorded, "v7.42 phase and baseline must be recorded.");
  assert(packageStateRecorded, "v7.42 package state must be recorded.");
  assert(requiredPackageRecorded, "v7.42 required authorization package must be recorded.");
  assert(behaviorRecorded, "v7.42 required and forbidden behavior must be recorded.");
  assert(approvalTextRecorded, "v7.42 approval request text must be recorded.");
  assert(phaseBoundaryRecorded, "v7.42 phase boundary must be recorded.");
  assert(noForbiddenTrue, "v7.42 must not set execution or authorization flags to true.");
  assert(noRawLocalPath, "v7.42 must not save raw local VCP or user paths.");
  assert(indexesCurrent, "Top-level indexes must reference v7.42 authorization package.");
  assert(boardCurrent, "Agent board must be synchronized to v7.42 authorization package.");
  assert(checklistCurrent, "Validation checklist must include v7.42 checks.");

  process.stdout.write(`${JSON.stringify({
    passed: true,
    v7_42_external_remote_debug_verification_script_creation_authorization_package: {
      phase_recorded: phaseRecorded,
      package_state_recorded: packageStateRecorded,
      required_package_recorded: requiredPackageRecorded,
      behavior_recorded: behaviorRecorded,
      approval_text_recorded: approvalTextRecorded,
      phase_boundary_recorded: phaseBoundaryRecorded,
      no_forbidden_true_flags: noForbiddenTrue,
      no_raw_local_path: noRawLocalPath,
      indexes_current: indexesCurrent,
      agent_board_current: boardCurrent,
      checklist_current: checklistCurrent,
      script_exists_now: exists(scriptPath),
      package_active: false,
      script_creation_authorized_by_this_phase: false,
      remote_debug_script_created: false,
      origin_master_short: originMasterShort,
      local_head_before_batch: localHeadBeforeBatch,
      pending_local_commits_before_batch: 2,
      next_safe_phase: "BLOCKED until explicit script creation authorization"
    }
  }, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
}
