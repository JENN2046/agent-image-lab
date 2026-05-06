const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const currentPhase = "v7.5 vcpchat review console runtime integration authorization gate";
const previousPhase = "v7.4 vcpchat review console renderer mount design gate";
const currentHead = "2fa9ab3";
const nextPhase = "v7.6 VCPChat Review Console First Runtime Integration Scope Fill Gate";

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function includesAll(content, values) {
  return values.every((value) => content.includes(value));
}

function excludesAll(content, values) {
  return values.every((value) => !content.includes(value));
}

function main() {
  const requiredFiles = [
    "docs/157_v7_5_vcpchat_review_console_runtime_integration_authorization_gate.md",
    "review_console/embed_contract/vcpchat_review_console_runtime_integration_authorization_gate.md",
    "tests/schema_examples/v7_5_vcpchat_review_console_runtime_integration_authorization_gate.example.yaml",
    "scripts/validate_v7_5_vcpchat_review_console_runtime_integration_authorization_gate.js",
    "tests/validation_checklist.md",
    "docs/156_v7_4_vcpchat_review_console_renderer_mount_design_gate.md",
    "review_console/embed_contract/vcpchat_review_console_renderer_mount_design_gate.md",
    "review_console/embed_contract/vcpchat_review_console_ipc_handler_design_gate.md",
    "review_console/embed_contract/vcpchat_review_console_preload_design_gate.md"
  ];
  const missingFiles = requiredFiles.filter((relativePath) => !exists(relativePath));
  assert(missingFiles.length === 0, `Missing v7.5 runtime integration authorization gate evidence: ${missingFiles.join(", ")}`);

  const doc = read("docs/157_v7_5_vcpchat_review_console_runtime_integration_authorization_gate.md");
  const contract = read("review_console/embed_contract/vcpchat_review_console_runtime_integration_authorization_gate.md");
  const schema = read("tests/schema_examples/v7_5_vcpchat_review_console_runtime_integration_authorization_gate.example.yaml");
  const checklist = read("tests/validation_checklist.md");
  const combined = `${doc}\n${contract}\n${schema}`;

  const baselineRecorded = includesAll(combined, [
    currentPhase,
    previousPhase,
    `current_head: ${currentHead}`,
    `head_commit_short: ${currentHead}`,
    nextPhase,
    "authorization_gate_only: true",
    "implementation_not_authorized_by_this_record: true",
    "no_runtime_code_change_required: true",
    "no_external_read_required: true",
    "no_vcpchat_write_allowed: true"
  ]);

  const authorizationShapeRecorded = includesAll(combined, [
    "required_authorization_request_shape",
    "authorization_request_id",
    "target_repository_ref",
    "target_branch_ref",
    "target_commit_before_patch",
    "implementation_task_id",
    "allowed_read_scope",
    "allowed_write_scope",
    "exact_files_to_modify",
    "exact_commands_allowed",
    "validation_commands",
    "rollback_plan"
  ]);

  const exactScopeRecorded = includesAll(combined, [
    "exact_scope_requirements",
    "repo_relative_paths_only: true",
    "directories_as_write_scope_allowed: false",
    "glob_write_scope_allowed: false",
    "implicit_neighbor_files_allowed: false",
    "install_commands_allowed_by_default: false",
    "destructive_commands_allowed: false",
    "validation_gap_must_be_reported: true",
    "git_reset_hard_allowed: false",
    "git_clean_allowed: false"
  ]);

  const safetyRecorded = includesAll(combined, [
    "required_safety_confirmations",
    "contextIsolation_must_remain_true: true",
    "nodeIntegration_must_remain_false: true",
    "preload_exposes_only_imageLabReview: true",
    "broad_electronAPI_reuse_for_review_console: false",
    "broad_chatAPI_exposure_for_review_console: false",
    "sender_validation_required: true",
    "payload_validation_required: true",
    "ack_contract_required: true",
    "prototype_guard_required: true",
    "accepted_requires_human_approval: true"
  ]);

  const stopConditionsRecorded = includesAll(combined, [
    "required_stop_conditions",
    "unlisted_file_needed",
    "secret_or_env_file_encountered",
    "dependency_install_needed",
    "package_manifest_change_needed",
    "plugin_call_needed",
    "api_call_needed",
    "daily_note_write_needed",
    "image_file_creation_needed",
    "vcpchat_user_owned_changes_detected"
  ]);

  const implementationBlocked = includesAll(combined, [
    "authorization_template_added: true",
    "implementation_task_authorized: false",
    "implementation_allowed: false",
    "vcpchat_code_modified: false",
    "additional_vcpchat_read_performed: false",
    "can_push_vcpchat_remote: false",
    "can_call_plugin: false",
    "can_call_external_api: false",
    "can_call_daily_note: false",
    "can_write_vcp_memory: false",
    "can_create_image_file: false"
  ]);

  const forbiddenTrueKeys = [
    "implementation_task_authorized",
    "implementation_allowed",
    "runtime_code_modified",
    "vcpchat_code_modified",
    "vcptoolbox_code_modified",
    "github_release_published",
    "release_assets_uploaded",
    "additional_vcpchat_read_performed",
    "real_vcptoolbox_source_read",
    "real_manifest_read",
    "ipc_handler_created",
    "preload_runtime_code_created",
    "renderer_runtime_code_created",
    "adapter_execution_entrypoint_created",
    "api_called",
    "vcp_plugin_called",
    "daily_note_called",
    "vcp_memory_written",
    "disk_write_runtime_performed",
    "image_file_created",
    "can_push_vcpchat_remote",
    "can_publish_release",
    "can_call_plugin",
    "can_call_external_api",
    "can_call_daily_note",
    "can_write_vcp_memory",
    "can_create_image_file",
    "remote_write_allowed_by_default",
    "directories_as_write_scope_allowed",
    "glob_write_scope_allowed",
    "implicit_neighbor_files_allowed",
    "install_commands_allowed_by_default",
    "destructive_commands_allowed",
    "git_reset_hard_allowed",
    "git_clean_allowed"
  ];
  const noForbiddenTrue = excludesAll(
    combined,
    forbiddenTrueKeys.map((key) => `${key}: ${String(Boolean(1))}`)
  );

  const checklistCurrent = includesAll(checklist, [
    "## v7.5 VCPChat Review Console Runtime Integration Authorization Gate 检查",
    "docs/157_v7_5_vcpchat_review_console_runtime_integration_authorization_gate.md",
    "review_console/embed_contract/vcpchat_review_console_runtime_integration_authorization_gate.md",
    "tests/schema_examples/v7_5_vcpchat_review_console_runtime_integration_authorization_gate.example.yaml",
    "scripts/validate_v7_5_vcpchat_review_console_runtime_integration_authorization_gate.js",
    currentPhase,
    currentHead,
    "精确授权门槛",
    "allowed_write_scope",
    "required_stop_conditions",
    "additional_vcpchat_read_performed=false",
    nextPhase
  ]);

  assert(baselineRecorded, "v7.5 must record current baseline and v7.4 context.");
  assert(authorizationShapeRecorded, "v7.5 must record required authorization request shape.");
  assert(exactScopeRecorded, "v7.5 must record exact scope requirements.");
  assert(safetyRecorded, "v7.5 must record required safety confirmations.");
  assert(stopConditionsRecorded, "v7.5 must record required stop conditions.");
  assert(implementationBlocked, "v7.5 must keep implementation blocked.");
  assert(noForbiddenTrue, "v7.5 must not set forbidden read/write/execute/image flags to true.");
  assert(checklistCurrent, "validation checklist must include v7.5 checks.");

  const result = {
    passed: true,
    vcpchat_review_console_runtime_integration_authorization_gate: {
      version: "v7.5",
      current_phase: currentPhase,
      current_head: currentHead,
      previous_phase: previousPhase,
      recommended_next_phase: nextPhase,
      authorization_shape_recorded: authorizationShapeRecorded,
      exact_scope_recorded: exactScopeRecorded,
      safety_recorded: safetyRecorded,
      stop_conditions_recorded: stopConditionsRecorded,
      implementation_blocked: implementationBlocked,
      no_forbidden_true_flags: noForbiddenTrue,
      checklist_current: checklistCurrent,
      authorization_gate_only: true,
      implementation_allowed: false,
      additional_vcpchat_read_performed: false,
      vcpchat_code_modified: false,
      ipc_handler_created: false,
      preload_runtime_code_created: false,
      renderer_runtime_code_created: false,
      api_called: false,
      vcp_plugin_called: false,
      daily_note_called: false,
      image_file_created: false
    }
  };

  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
}
