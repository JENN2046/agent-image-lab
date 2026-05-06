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
    "docs/190_v7_38_external_remote_debug_verification_script_creation_preflight.md",
    "review_console/embed_contract/vcpchat_external_remote_debug_verification_script_creation_preflight.md",
    "tests/schema_examples/v7_38_external_remote_debug_verification_script_creation_preflight.example.yaml",
    "scripts/validate_v7_38_external_remote_debug_verification_script_creation_preflight.js",
    "tests/validation_checklist.md",
    "docs/189_v7_37_external_remote_debug_verification_script_authorization_gate.md"
  ];
  const missing = requiredFiles.filter((relativePath) => !exists(relativePath));
  assert(missing.length === 0, `Missing v7.38 external remote-debug verification script creation preflight files: ${missing.join(", ")}`);

  assert(!exists("scripts/run_vcpchat_review_console_remote_debug_smoke.ps1"), "v7.38 must not create the real remote-debug smoke script.");

  const currentFiles = [
    "docs/190_v7_38_external_remote_debug_verification_script_creation_preflight.md",
    "review_console/embed_contract/vcpchat_external_remote_debug_verification_script_creation_preflight.md",
    "tests/schema_examples/v7_38_external_remote_debug_verification_script_creation_preflight.example.yaml"
  ];
  const contents = requiredFiles
    .filter((relativePath) => !relativePath.endsWith(".js"))
    .map((relativePath) => read(relativePath))
    .join("\n");
  const currentContents = currentFiles.map((relativePath) => read(relativePath)).join("\n");
  const checklist = read("tests/validation_checklist.md");

  const phaseRecorded = includesAll(contents, [
    "v7.38 external remote-debug verification script creation preflight",
    "current_head: da18330",
    "head_commit_short: da18330",
    "docs/189_v7_37_external_remote_debug_verification_script_authorization_gate.md",
    "v7.39 External Remote Debug Verification Script Creation Authorization Point"
  ]);

  const scopeRecorded = includesAll(currentContents, [
    "scripts/run_vcpchat_review_console_remote_debug_smoke.ps1",
    "script_exists_before_creation: false",
    "script_created_by_this_phase: false",
    "allowed_future_creation_scope",
    "forbidden_future_creation_scope",
    "任何 VCPChat 文件",
    "任何 VCPToolBox 文件"
  ]);

  const requirementsRecorded = includesAll(currentContents, [
    "must_be_agent_image_lab_local_only: true",
    "must_not_modify_vcpchat: true",
    "must_not_modify_vcptoolbox: true",
    "must_not_auto_launch_vcpchat_on_creation: true",
    "must_not_access_cdp_on_creation: true",
    "must_not_call_bridge_methods_on_creation: true",
    "must_not_call_plugin_or_api_or_dailynote: true",
    "must_default_to_preflight_or_help_only: true"
  ]);

  const interfaceRecorded = includesAll(currentContents, [
    "VcpChatRoot",
    "ExpectedHead",
    "RemoteDebugPort",
    "DryRun",
    "Execute",
    "dry_run: true",
    "execute: false",
    "app_launch: false",
    "cdp_access: false",
    "bridge_method_invocation: false"
  ]);

  const decisionRecorded = includesAll(currentContents, [
    "preflight_result: pass",
    "safe_to_request_script_creation_authorization: true",
    "safe_to_create_script_without_next_authorization: false",
    "safe_to_run_script_without_execution_authorization: false",
    "safe_to_start_vcpchat_now: false",
    "safe_to_access_cdp_now: false",
    "safe_to_modify_vcpchat_now: false"
  ]);

  const stopConditionsRecorded = includesAll(currentContents, [
    "script_path_outside_agent_image_lab: stop",
    "script_would_auto_launch_app_on_creation: stop",
    "script_would_hardcode_local_vcpchat_root: stop",
    "script_would_hardcode_cdp_endpoint: stop",
    "script_would_read_env_or_secret: stop",
    "script_would_call_bridge_methods: stop",
    "script_would_modify_vcpchat: stop",
    "script_would_create_image: stop"
  ]);

  const phaseBoundaryRecorded = includesAll(currentContents, [
    "script_creation_preflight_performed: true",
    "script_creation_authorized_by_this_phase: false",
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
    "script_creation_authorized_by_this_phase",
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
    "## v7.38 External Remote Debug Verification Script Creation Preflight 检查",
    "docs/190_v7_38_external_remote_debug_verification_script_creation_preflight.md",
    "review_console/embed_contract/vcpchat_external_remote_debug_verification_script_creation_preflight.md",
    "tests/schema_examples/v7_38_external_remote_debug_verification_script_creation_preflight.example.yaml",
    "scripts/validate_v7_38_external_remote_debug_verification_script_creation_preflight.js",
    "script_created_by_this_phase=false",
    "safe_to_request_script_creation_authorization=true",
    "v7.39 External Remote Debug Verification Script Creation Authorization Point"
  ]);

  assert(phaseRecorded, "v7.38 phase must be recorded.");
  assert(scopeRecorded, "v7.38 preflight scope must be recorded.");
  assert(requirementsRecorded, "v7.38 script creation requirements must be recorded.");
  assert(interfaceRecorded, "v7.38 future script interface must be recorded.");
  assert(decisionRecorded, "v7.38 creation preflight decision must be recorded.");
  assert(stopConditionsRecorded, "v7.38 stop conditions must be recorded.");
  assert(phaseBoundaryRecorded, "v7.38 phase boundary must be recorded.");
  assert(noForbiddenTrue, "v7.38 must not set authorization or execution flags to true.");
  assert(noRawLocalPath, "v7.38 must not save raw local VCP or user paths.");
  assert(checklistCurrent, "validation checklist must include v7.38 checks.");

  process.stdout.write(`${JSON.stringify({
    passed: true,
    v7_38_external_remote_debug_verification_script_creation_preflight: {
      phase_recorded: phaseRecorded,
      scope_recorded: scopeRecorded,
      requirements_recorded: requirementsRecorded,
      interface_recorded: interfaceRecorded,
      decision_recorded: decisionRecorded,
      stop_conditions_recorded: stopConditionsRecorded,
      phase_boundary_recorded: phaseBoundaryRecorded,
      no_forbidden_true_flags: noForbiddenTrue,
      no_raw_local_path: noRawLocalPath,
      checklist_current: checklistCurrent,
      script_created_by_this_phase: false,
      safe_to_request_script_creation_authorization: true,
      next_safe_phase: "v7.39 External Remote Debug Verification Script Creation Authorization Point"
    }
  }, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
}
