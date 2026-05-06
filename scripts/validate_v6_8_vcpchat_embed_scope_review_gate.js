const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const currentPhase = "v6.8 vcpchat embed scope review gate";
const previousPhase = "v6.7 vcpchat embed minimal patch scope";
const currentHead = "be4ea6e";
const nextPhase = "v6.9 VCPChat Embed Implementation Authorization Request";

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
    "docs/150_v6_8_vcpchat_embed_scope_review_gate.md",
    "review_console/embed_contract/vcpchat_embed_scope_review_gate.md",
    "tests/schema_examples/v6_8_vcpchat_embed_scope_review_gate.example.yaml",
    "scripts/validate_v6_8_vcpchat_embed_scope_review_gate.js",
    "tests/validation_checklist.md",
    "docs/149_v6_7_vcpchat_embed_minimal_patch_scope.md",
    "review_console/embed_contract/vcpchat_embed_minimal_patch_scope.md",
    "docs/148_v6_6_vcpchat_embed_implementation_preflight.md",
    "review_console/embed_contract/host_bridge_contract_v2.md",
    "review_console/embed_contract/memory_handoff_runtime_status.md"
  ];
  const missingFiles = requiredFiles.filter((relativePath) => !exists(relativePath));
  assert(missingFiles.length === 0, `Missing v6.8 scope review gate evidence: ${missingFiles.join(", ")}`);

  const doc = read("docs/150_v6_8_vcpchat_embed_scope_review_gate.md");
  const contract = read("review_console/embed_contract/vcpchat_embed_scope_review_gate.md");
  const schema = read("tests/schema_examples/v6_8_vcpchat_embed_scope_review_gate.example.yaml");
  const checklist = read("tests/validation_checklist.md");
  const combined = `${doc}\n${contract}\n${schema}`;

  const baselineRecorded = includesAll(combined, [
    currentPhase,
    previousPhase,
    `current_head: ${currentHead}`,
    `head_commit_short: ${currentHead}`,
    nextPhase,
    "review_gate_only: true",
    "implementation_not_authorized_by_this_record: true",
    "no_runtime_code_change_required: true",
    "no_external_read_required: true",
    "no_real_target_path_filled: true"
  ]);

  const evidenceRecorded = includesAll(combined, [
    "docs/149_v6_7_vcpchat_embed_minimal_patch_scope.md",
    "review_console/embed_contract/vcpchat_embed_minimal_patch_scope.md",
    "docs/148_v6_6_vcpchat_embed_implementation_preflight.md",
    "review_console/embed_contract/host_bridge_contract_v2.md",
    "review_console/embed_contract/memory_handoff_runtime_status.md"
  ]);

  const inputRecorded = includesAll(combined, [
    "scope_review_input",
    "scope_request_id: scope-v6-8-placeholder-001",
    "scope_request_status: placeholder_only",
    "source_read_authorized: false",
    "source_read_performed: false",
    "real_target_path_submitted: false",
    "raw_real_path_stored: false",
    "implementation_allowed_before_review: false"
  ]);

  const checksRecorded = includesAll(combined, [
    "required_review_checks",
    "scope_is_minimal",
    "target_category_valid",
    "raw_private_path_absent",
    "no_secret_or_customer_data",
    "no_execution_path_added",
    "electron_boundary_preserved",
    "rollback_plan_present",
    "validation_plan_present",
    "user_owned_change_check_planned"
  ]);

  const routesRecorded = includesAll(combined, [
    "approve_for_implementation_authorization_request",
    "request_scope_revision",
    "reject_scope",
    "approval_to_implement: false",
    "approval_to_read_source: false",
    "implementation_authorization_request",
    "scope_revision_required",
    "scope_rejected"
  ]);

  const rejectionRecorded = includesAll(combined, [
    "raw_private_path_or_secret_present",
    "broad_vcpchat_refactor_requested",
    "plugin_execution_or_daily_note_write_in_scope",
    "external_api_or_image_save_in_scope",
    "target_files_unclear",
    "rollback_plan_missing",
    "validation_plan_missing",
    "user_owned_change_check_missing"
  ]);

  const forbiddenTrueKeys = [
    "implementation_authorization_granted",
    "implementation_allowed",
    "source_read_authorized",
    "source_read_performed",
    "real_target_path_submitted",
    "raw_real_path_stored",
    "implementation_allowed_before_review",
    "real_target_paths_filled",
    "raw_private_path_stored",
    "real_vcpchat_source_read",
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
    "image_file_created"
  ];
  const noForbiddenTrue = excludesAll(
    combined,
    forbiddenTrueKeys.map((key) => `${key}: ${String(Boolean(1))}`)
  );

  const checklistCurrent = includesAll(checklist, [
    "## v6.8 VCPChat Embed Scope Review Gate 检查",
    "docs/150_v6_8_vcpchat_embed_scope_review_gate.md",
    "review_console/embed_contract/vcpchat_embed_scope_review_gate.md",
    "tests/schema_examples/v6_8_vcpchat_embed_scope_review_gate.example.yaml",
    "scripts/validate_v6_8_vcpchat_embed_scope_review_gate.js",
    currentPhase,
    currentHead,
    "implementation_authorization_granted=false",
    "approval_to_implement=false",
    "source_read_authorized=false",
    nextPhase
  ]);

  assert(baselineRecorded, "v6.8 must record current baseline and v6.7 context.");
  assert(evidenceRecorded, "v6.8 must record source evidence.");
  assert(inputRecorded, "v6.8 must record scope review input.");
  assert(checksRecorded, "v6.8 must record required review checks.");
  assert(routesRecorded, "v6.8 must record decision routes.");
  assert(rejectionRecorded, "v6.8 must record rejection conditions.");
  assert(noForbiddenTrue, "v6.8 review gate must not set forbidden read/write/execute/image flags to true.");
  assert(checklistCurrent, "validation checklist must include v6.8 checks.");

  const result = {
    passed: true,
    vcpchat_embed_scope_review_gate: {
      version: "v6.8",
      current_phase: currentPhase,
      current_head: currentHead,
      previous_phase: previousPhase,
      recommended_next_phase: nextPhase,
      evidence_recorded: evidenceRecorded,
      scope_review_input_recorded: inputRecorded,
      required_review_checks_recorded: checksRecorded,
      decision_routes_recorded: routesRecorded,
      rejection_conditions_recorded: rejectionRecorded,
      no_forbidden_true_flags: noForbiddenTrue,
      checklist_current: checklistCurrent,
      review_gate_only: true,
      implementation_authorization_granted: false,
      implementation_allowed: false,
      source_read_authorized: false,
      source_read_performed: false,
      real_target_paths_filled: false,
      real_vcpchat_source_read: false,
      real_vcptoolbox_source_read: false,
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
