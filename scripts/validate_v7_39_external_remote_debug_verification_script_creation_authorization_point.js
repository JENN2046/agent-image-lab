const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

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
    "docs/191_v7_39_external_remote_debug_verification_script_creation_authorization_point.md",
    "review_console/embed_contract/vcpchat_external_remote_debug_verification_script_creation_authorization_point.md",
    "tests/schema_examples/v7_39_external_remote_debug_verification_script_creation_authorization_point.example.yaml",
    "scripts/validate_v7_39_external_remote_debug_verification_script_creation_authorization_point.js",
    "tests/validation_checklist.md",
    "docs/190_v7_38_external_remote_debug_verification_script_creation_preflight.md"
  ];
  const missing = requiredFiles.filter((relativePath) => !exists(relativePath));
  assert(missing.length === 0, `Missing v7.39 external remote-debug verification script creation authorization point files: ${missing.join(", ")}`);

  assert(!exists("scripts/run_vcpchat_review_console_remote_debug_smoke.ps1"), "v7.39 must not create the real remote-debug smoke script.");

  const currentFiles = [
    "docs/191_v7_39_external_remote_debug_verification_script_creation_authorization_point.md",
    "review_console/embed_contract/vcpchat_external_remote_debug_verification_script_creation_authorization_point.md",
    "tests/schema_examples/v7_39_external_remote_debug_verification_script_creation_authorization_point.example.yaml"
  ];
  const contents = requiredFiles
    .filter((relativePath) => !relativePath.endsWith(".js"))
    .map((relativePath) => read(relativePath))
    .join("\n");
  const currentContents = currentFiles.map((relativePath) => read(relativePath)).join("\n");
  const checklist = read("tests/validation_checklist.md");

  const phaseRecorded = includesAll(contents, [
    "v7.39 external remote-debug verification script creation authorization point",
    "current_head: 374294b",
    "head_commit_short: 374294b",
    "docs/190_v7_38_external_remote_debug_verification_script_creation_preflight.md",
    "v7.40 External Remote Debug Verification Script Creation Record"
  ]);

  const decisionRecorded = includesAll(currentContents, [
    "script_path_under_review: scripts/run_vcpchat_review_console_remote_debug_smoke.ps1",
    "should_create_script: true",
    "create_in_this_phase: false",
    "script_created_by_this_phase: false",
    "decision_scope: \"authorize_next_creation_phase_only\"",
    "requires_next_phase_creation_record: true",
    "safe_to_create_in_next_phase_after_boundary_check: true",
    "safe_to_run_after_creation: false",
    "safe_to_start_vcpchat_after_creation: false",
    "safe_to_access_cdp_after_creation: false"
  ]);

  const scopeRecorded = includesAll(currentContents, [
    "allowed_file_to_create",
    "scripts/run_vcpchat_review_console_remote_debug_smoke.ps1",
    "allowed_record_files",
    "docs/192_v7_40_external_remote_debug_verification_script_creation_record.md",
    "任何 VCPChat 文件",
    "任何 VCPToolBox 文件",
    "任何 package manifest 或 lockfile"
  ]);

  const propertiesRecorded = includesAll(currentContents, [
    "script_must_default_to_dry_run: true",
    "script_must_require_explicit_execute_switch_for_future_runtime: true",
    "script_must_not_launch_vcpchat_without_execute_authorization: true",
    "script_must_not_access_cdp_without_execute_authorization: true",
    "script_must_not_call_bridge_methods: true",
    "script_must_not_modify_vcpchat: true",
    "script_must_not_install_dependencies: true",
    "script_must_emit_sanitized_json: true"
  ]);

  const interfaceRecorded = includesAll(currentContents, [
    "VcpChatRoot",
    "ExpectedHead",
    "RemoteDebugPort",
    "DryRun",
    "Execute",
    "OutputJson",
    "DryRun: true",
    "Execute: false",
    "help_or_dry_run_only: true",
    "app_launch_on_creation: false",
    "cdp_access_on_creation: false",
    "bridge_method_invocation_on_creation: false"
  ]);

  const stopConditionsRecorded = includesAll(currentContents, [
    "target_file_already_exists_with_unknown_content: stop",
    "required_output_would_include_raw_local_path: stop",
    "required_output_would_include_raw_cdp_endpoint: stop",
    "script_would_auto_launch_vcpchat: stop",
    "script_would_access_cdp_during_creation: stop",
    "script_would_call_bridge_methods: stop",
    "script_would_modify_vcpchat: stop",
    "secret_or_private_config_needed: stop"
  ]);

  const phaseBoundaryRecorded = includesAll(currentContents, [
    "creation_authorization_point_recorded: true",
    "should_create_script: true",
    "create_in_this_phase: false",
    "script_created_by_this_phase: false",
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
    "vcpchat_pushed: false",
    "github_release_performed: false"
  ]);

  const forbiddenTrueKeys = [
    "create_in_this_phase",
    "script_created_by_this_phase",
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
    "vcpchat_pushed",
    "github_release_performed"
  ];
  const noForbiddenTrue = excludesExactTrueFlags(currentContents, forbiddenTrueKeys);

  const noRawLocalPath = excludesAll(currentContents, [
    "A:\\VCP",
    "A:/VCP",
    "C:\\Users",
    "C:/Users"
  ]);

  const checklistCurrent = includesAll(checklist, [
    "## v7.39 External Remote Debug Verification Script Creation Authorization Point 检查",
    "docs/191_v7_39_external_remote_debug_verification_script_creation_authorization_point.md",
    "review_console/embed_contract/vcpchat_external_remote_debug_verification_script_creation_authorization_point.md",
    "tests/schema_examples/v7_39_external_remote_debug_verification_script_creation_authorization_point.example.yaml",
    "scripts/validate_v7_39_external_remote_debug_verification_script_creation_authorization_point.js",
    "should_create_script=true",
    "create_in_this_phase=false",
    "v7.40 External Remote Debug Verification Script Creation Record"
  ]);

  assert(phaseRecorded, "v7.39 phase must be recorded.");
  assert(decisionRecorded, "v7.39 creation decision must be recorded.");
  assert(scopeRecorded, "v7.39 authorized next creation scope must be recorded.");
  assert(propertiesRecorded, "v7.39 required script creation properties must be recorded.");
  assert(interfaceRecorded, "v7.39 future script interface must be recorded.");
  assert(stopConditionsRecorded, "v7.39 creation stop conditions must be recorded.");
  assert(phaseBoundaryRecorded, "v7.39 phase boundary must be recorded.");
  assert(noForbiddenTrue, "v7.39 must not set execution flags to true.");
  assert(noRawLocalPath, "v7.39 must not save raw local VCP or user paths.");
  assert(checklistCurrent, "validation checklist must include v7.39 checks.");

  process.stdout.write(`${JSON.stringify({
    passed: true,
    v7_39_external_remote_debug_verification_script_creation_authorization_point: {
      phase_recorded: phaseRecorded,
      decision_recorded: decisionRecorded,
      scope_recorded: scopeRecorded,
      properties_recorded: propertiesRecorded,
      interface_recorded: interfaceRecorded,
      stop_conditions_recorded: stopConditionsRecorded,
      phase_boundary_recorded: phaseBoundaryRecorded,
      no_forbidden_true_flags: noForbiddenTrue,
      no_raw_local_path: noRawLocalPath,
      checklist_current: checklistCurrent,
      should_create_script: true,
      script_created_by_this_phase: false,
      next_safe_phase: "v7.40 External Remote Debug Verification Script Creation Record"
    }
  }, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
}
