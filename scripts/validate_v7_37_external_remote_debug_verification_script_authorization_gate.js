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
    "docs/189_v7_37_external_remote_debug_verification_script_authorization_gate.md",
    "review_console/embed_contract/vcpchat_external_remote_debug_verification_script_authorization_gate.md",
    "tests/schema_examples/v7_37_external_remote_debug_verification_script_authorization_gate.example.yaml",
    "scripts/validate_v7_37_external_remote_debug_verification_script_authorization_gate.js",
    "tests/validation_checklist.md",
    "docs/188_v7_36_external_remote_debug_verification_script_plan.md"
  ];
  const missing = requiredFiles.filter((relativePath) => !exists(relativePath));
  assert(missing.length === 0, `Missing v7.37 external remote-debug verification script authorization gate files: ${missing.join(", ")}`);

  const currentFiles = [
    "docs/189_v7_37_external_remote_debug_verification_script_authorization_gate.md",
    "review_console/embed_contract/vcpchat_external_remote_debug_verification_script_authorization_gate.md",
    "tests/schema_examples/v7_37_external_remote_debug_verification_script_authorization_gate.example.yaml"
  ];
  const contents = requiredFiles
    .filter((relativePath) => !relativePath.endsWith(".js"))
    .map((relativePath) => read(relativePath))
    .join("\n");
  const currentContents = currentFiles.map((relativePath) => read(relativePath)).join("\n");
  const checklist = read("tests/validation_checklist.md");

  const phaseRecorded = includesAll(contents, [
    "v7.37 external remote-debug verification script authorization gate",
    "current_head: dcf35ce",
    "head_commit_short: dcf35ce",
    "docs/188_v7_36_external_remote_debug_verification_script_plan.md",
    "v7.38 External Remote Debug Verification Script Creation Preflight"
  ]);

  const principleRecorded = includesAll(currentContents, [
    "external_remote_debug_verification_script_authorization_gate",
    "scripts/run_vcpchat_review_console_remote_debug_smoke.ps1",
    "script_creation_authorized_by_this_phase: false",
    "script_created_by_this_phase: false",
    "app_launch_authorized_by_this_phase: false",
    "cdp_access_authorized_by_this_phase: false",
    "runtime_evaluate_authorized_by_this_phase: false",
    "vcpchat_modification_authorized_by_this_phase: false"
  ]);

  const requiredFieldsRecorded = includesAll(currentContents, [
    "authorization_id",
    "authorized_by",
    "authorized_at",
    "target_head_short",
    "target_root_ref",
    "script_path_to_create",
    "allowed_script_actions",
    "forbidden_script_actions",
    "allowed_output_fields",
    "forbidden_output_fields"
  ]);

  const allowedAndForbiddenRecorded = includesAll(currentContents, [
    "preflight_target_branch_head_worktree",
    "check_remote_debug_port",
    "read_cdp_runtime_evaluate_only",
    "emit_sanitized_json_result",
    "call_bridge_loadSession",
    "call_bridge_previewDraft",
    "call_bridge_submitDraft",
    "call_bridge_cancel",
    "modify_vcpchat_source",
    "raw_local_root",
    "raw_cdp_endpoint",
    "raw_source_code",
    "env_value"
  ]);

  const stopConditionsRecorded = includesAll(currentContents, [
    "dirty_vcpchat_worktree: stop",
    "unexpected_vcpchat_branch: stop",
    "remote_debug_port_occupied: stop",
    "dependency_install_required: stop",
    "env_or_secret_read_required: stop",
    "login_or_credential_prompt_seen: stop",
    "bridge_method_invocation_required: stop",
    "vcpchat_source_modification_required: stop"
  ]);

  const gateDecisionRecorded = includesAll(currentContents, [
    "can_create_script_now: false",
    "can_run_script_now: false",
    "can_start_vcpchat_now: false",
    "can_access_cdp_now: false",
    "can_modify_vcpchat_now: false"
  ]);

  const phaseBoundaryRecorded = includesAll(currentContents, [
    "script_creation_authorized_by_this_phase: false",
    "script_created_by_this_phase: false",
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
    "app_launch_authorized_by_this_phase",
    "app_launch_performed_by_this_phase",
    "remote_debug_authorized_by_this_phase",
    "remote_debug_used_by_this_phase",
    "cdp_access_authorized_by_this_phase",
    "cdp_endpoint_accessed_by_this_phase",
    "runtime_evaluate_authorized_by_this_phase",
    "runtime_evaluate_performed_by_this_phase",
    "vcpchat_modification_authorized_by_this_phase",
    "vcpchat_modified_by_this_phase",
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
    "## v7.37 External Remote Debug Verification Script Authorization Gate 检查",
    "docs/189_v7_37_external_remote_debug_verification_script_authorization_gate.md",
    "review_console/embed_contract/vcpchat_external_remote_debug_verification_script_authorization_gate.md",
    "tests/schema_examples/v7_37_external_remote_debug_verification_script_authorization_gate.example.yaml",
    "scripts/validate_v7_37_external_remote_debug_verification_script_authorization_gate.js",
    "script_creation_authorized_by_this_phase=false",
    "can_create_script_now=false",
    "v7.38 External Remote Debug Verification Script Creation Preflight"
  ]);

  assert(phaseRecorded, "v7.37 phase must be recorded.");
  assert(principleRecorded, "v7.37 authorization principle must be recorded.");
  assert(requiredFieldsRecorded, "v7.37 required future authorization fields must be recorded.");
  assert(allowedAndForbiddenRecorded, "v7.37 allowed and forbidden script fields must be recorded.");
  assert(stopConditionsRecorded, "v7.37 stop conditions must be recorded.");
  assert(gateDecisionRecorded, "v7.37 creation gate decision must be recorded.");
  assert(phaseBoundaryRecorded, "v7.37 phase boundary must be recorded.");
  assert(noForbiddenTrue, "v7.37 must not set authorization or execution flags to true.");
  assert(noRawLocalPath, "v7.37 must not save raw local VCP or user paths.");
  assert(checklistCurrent, "validation checklist must include v7.37 checks.");

  process.stdout.write(`${JSON.stringify({
    passed: true,
    v7_37_external_remote_debug_verification_script_authorization_gate: {
      phase_recorded: phaseRecorded,
      principle_recorded: principleRecorded,
      required_fields_recorded: requiredFieldsRecorded,
      allowed_and_forbidden_recorded: allowedAndForbiddenRecorded,
      stop_conditions_recorded: stopConditionsRecorded,
      gate_decision_recorded: gateDecisionRecorded,
      phase_boundary_recorded: phaseBoundaryRecorded,
      no_forbidden_true_flags: noForbiddenTrue,
      no_raw_local_path: noRawLocalPath,
      checklist_current: checklistCurrent,
      can_create_script_now: false,
      can_run_script_now: false,
      next_safe_phase: "v7.38 External Remote Debug Verification Script Creation Preflight"
    }
  }, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
}
