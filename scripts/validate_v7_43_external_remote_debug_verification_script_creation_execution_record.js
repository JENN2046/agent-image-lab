const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const currentPhase = "v7.43 external remote-debug verification script creation execution record";
const previousPhase = "v7.42 external remote-debug verification script creation authorization package";
const originMasterShort = "5a7f5ba";
const localHeadBeforeBatch = "975da9a";
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
    scriptPath,
    "docs/195_v7_43_external_remote_debug_verification_script_creation_execution_record.md",
    "review_console/embed_contract/vcpchat_external_remote_debug_verification_script_creation_execution_record.md",
    "tests/schema_examples/v7_43_external_remote_debug_verification_script_creation_execution_record.example.yaml",
    "scripts/validate_v7_43_external_remote_debug_verification_script_creation_execution_record.js",
    "docs/194_v7_42_external_remote_debug_verification_script_creation_authorization_package.md",
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
  assert(missing.length === 0, `Missing v7.43 script creation files: ${missing.join(", ")}`);

  const script = read(scriptPath);
  const record = read("docs/195_v7_43_external_remote_debug_verification_script_creation_execution_record.md");
  const contract = read("review_console/embed_contract/vcpchat_external_remote_debug_verification_script_creation_execution_record.md");
  const schema = read("tests/schema_examples/v7_43_external_remote_debug_verification_script_creation_execution_record.example.yaml");
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
    "current_head_before_batch: 975da9a",
    "local_head_before_batch: 975da9a",
    "origin_master_short: 5a7f5ba",
    "docs/194_v7_42_external_remote_debug_verification_script_creation_authorization_package.md",
    "BLOCKED until explicit remote-debug script execution authorization"
  ]);

  const authorizationRecorded = includesAll(currentContents, [
    "authorization_received: true",
    "authorized_by: current_user",
    "authorized_at: \"2026-05-06\"",
    "script_creation_only: true",
    "execution_authorized: false",
    "launch_vcpchat",
    "access_cdp",
    "call_bridge_methods",
    "read_or_modify_vcpchat",
    "read_or_modify_vcptoolbox",
    "push_or_tag_or_release"
  ]);

  const scriptInterfaceRecorded = includesAll(script, [
    "[CmdletBinding()]",
    "[string]$VcpChatRoot = \"\"",
    "[string]$ExpectedHead = \"\"",
    "[int]$RemoteDebugPort = 9222",
    "[bool]$DryRun = $true",
    "[bool]$Execute = $false",
    "[string]$OutputJson = \"\"",
    "ConvertTo-Json -Depth 8",
    "execution_blocked = $true",
    "app_launch_performed = $false",
    "remote_debug_used = $false",
    "cdp_access_performed = $false",
    "bridge_method_invocation_performed = $false",
    "vcpchat_source_read = $false",
    "vcptoolbox_source_read = $false",
    "output_file_written = $false"
  ]);

  const createdScriptRecorded = includesAll(currentContents, [
    `path: ${scriptPath}`,
    "created_by_this_phase: true",
    "default_dry_run: true",
    "default_execute: false",
    "preflight_only_in_this_version: true",
    "emits_sanitized_json_to_stdout: true",
    "writes_output_file: false",
    "launches_vcpchat: false",
    "accesses_cdp: false",
    "calls_bridge_methods: false",
    "reads_vcpchat_source: false",
    "modifies_vcpchat_source: false",
    "reads_vcptoolbox_source: false",
    "modifies_vcptoolbox_source: false"
  ]);

  const phaseBoundaryRecorded = includesAll(currentContents, [
    "script_creation_authorized_by_this_phase: true",
    "remote_debug_script_created: true",
    "script_run_by_this_phase: false",
    "app_launch_authorized_by_this_phase: false",
    "app_launch_performed_by_this_phase: false",
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

  const forbiddenScriptPatterns = [
    "Start-Process",
    "Invoke-WebRequest",
    "Invoke-RestMethod",
    "System.Net.WebClient",
    "System.Net.Http",
    "TcpClient",
    "WebSocket",
    "Get-Content $VcpChatRoot",
    "Set-Content",
    "Out-File",
    "New-Item",
    "Remove-Item",
    "git ",
    "npm ",
    "loadSession",
    "previewDraft",
    "submitDraft",
    "cancel(",
    "http://",
    "https://",
    "ws://",
    "127.0.0.1",
    "localhost"
  ];
  const scriptHasNoForbiddenRuntime = excludesAll(script, forbiddenScriptPatterns);

  const forbiddenFalseKeys = [
    "script_run_by_this_phase",
    "app_launch_authorized_by_this_phase",
    "app_launch_performed_by_this_phase",
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
  const noForbiddenTrue = excludesExactTrueFlags(currentContents, forbiddenFalseKeys);

  const noRawLocalPath = excludesAll(currentContents + "\n" + script, [
    "A:\\VCP",
    "A:/VCP",
    "C:\\Users",
    "C:/Users"
  ]);

  const indexesCurrent = includesAll(indexes, [
    currentPhase,
    "scripts/run_vcpchat_review_console_remote_debug_smoke.ps1",
    "docs/195_v7_43_external_remote_debug_verification_script_creation_execution_record.md",
    "review_console/embed_contract/vcpchat_external_remote_debug_verification_script_creation_execution_record.md",
    "tests/schema_examples/v7_43_external_remote_debug_verification_script_creation_execution_record.example.yaml",
    "scripts/validate_v7_43_external_remote_debug_verification_script_creation_execution_record.js"
  ]);

  const boardCurrent = includesAll(board, [
    currentPhase,
    "v7.43 local: remote-debug smoke script created as dry-run-only local script after explicit user authorization",
    "Local head before v7.43 batch: 975da9a",
    "pending local commits before v7.43: 3",
    "Local pending commit chain before v7.43: 8f60ae1 -> 0326150 -> 975da9a",
    "node scripts/validate_v7_43_external_remote_debug_verification_script_creation_execution_record.js: passed",
    "execution remains blocked",
    "Without an active A5 authorization package, production actions remain blocked"
  ]);

  const checklistCurrent = includesAll(checklist, [
    "## v7.43 External Remote Debug Verification Script Creation Execution Record 检查",
    "`scripts/run_vcpchat_review_console_remote_debug_smoke.ps1` 存在",
    "`docs/195_v7_43_external_remote_debug_verification_script_creation_execution_record.md` 存在",
    "`review_console/embed_contract/vcpchat_external_remote_debug_verification_script_creation_execution_record.md` 存在",
    "`tests/schema_examples/v7_43_external_remote_debug_verification_script_creation_execution_record.example.yaml` 存在",
    "`scripts/validate_v7_43_external_remote_debug_verification_script_creation_execution_record.js` 存在",
    "script_creation_authorized_by_this_phase=true",
    "remote_debug_script_created=true",
    "script_run_by_this_phase=false",
    "`node scripts/validate_v7_43_external_remote_debug_verification_script_creation_execution_record.js` 通过"
  ]);

  assert(phaseRecorded, "v7.43 phase and baseline must be recorded.");
  assert(authorizationRecorded, "v7.43 creation authorization must be recorded.");
  assert(scriptInterfaceRecorded, "v7.43 script must expose safe dry-run interface.");
  assert(createdScriptRecorded, "v7.43 created script properties must be recorded.");
  assert(phaseBoundaryRecorded, "v7.43 phase boundary must be recorded.");
  assert(scriptHasNoForbiddenRuntime, "v7.43 script must not include launch/network/file-write/runtime bridge operations.");
  assert(noForbiddenTrue, "v7.43 must not set execution side-effect flags to true.");
  assert(noRawLocalPath, "v7.43 must not save raw local VCP or user paths.");
  assert(indexesCurrent, "Top-level indexes must reference v7.43 script creation execution record.");
  assert(boardCurrent, "Agent board must be synchronized to v7.43 script creation execution record.");
  assert(checklistCurrent, "Validation checklist must include v7.43 checks.");

  process.stdout.write(`${JSON.stringify({
    passed: true,
    v7_43_external_remote_debug_verification_script_creation_execution_record: {
      phase_recorded: phaseRecorded,
      authorization_recorded: authorizationRecorded,
      script_interface_recorded: scriptInterfaceRecorded,
      created_script_recorded: createdScriptRecorded,
      phase_boundary_recorded: phaseBoundaryRecorded,
      script_has_no_forbidden_runtime: scriptHasNoForbiddenRuntime,
      no_forbidden_true_flags: noForbiddenTrue,
      no_raw_local_path: noRawLocalPath,
      indexes_current: indexesCurrent,
      agent_board_current: boardCurrent,
      checklist_current: checklistCurrent,
      script_exists_now: exists(scriptPath),
      remote_debug_script_created: true,
      script_run_by_this_phase: false,
      origin_master_short: originMasterShort,
      local_head_before_batch: localHeadBeforeBatch,
      pending_local_commits_before_batch: 3,
      next_safe_phase: "BLOCKED until explicit remote-debug script execution authorization"
    }
  }, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
}
