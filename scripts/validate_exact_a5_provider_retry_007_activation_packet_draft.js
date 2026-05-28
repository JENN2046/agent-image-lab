#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const adapterPath = "adapters/runtime/exact_a5_provider_retry_007_activation_packet_draft.js";
const repairPackagePath = "docs/EXACT_A5_PROVIDER_RETRY_007_VCPTOOLBOX_OUTPUT_OVERRIDE_REPAIR_PACKAGE.md";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function repoPath(relativePath) {
  const resolved = path.resolve(root, relativePath);
  const relative = path.relative(root, resolved);
  assert(!relative.startsWith("..") && !path.isAbsolute(relative), `Path escapes repository: ${relativePath}`);
  return resolved;
}

function runNode(args) {
  return execFileSync(process.execPath, args, {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    timeout: 30000,
  });
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function assertPacket(packet, label) {
  assert(packet.packet_schema === "exact_a5_provider_retry_007_activation_packet_draft.v0", `${label} schema mismatch`);
  assert(packet.adapter_id === "exact_a5_provider_retry_007_activation_packet_draft_v0", `${label} adapter mismatch`);
  assert(packet.authorization_id === "AUTH-DRAFT-NATIVE-DOUBAO-SEEDREAM5-RETRY-20260527-007", `${label} authorization id mismatch`);
  assert(packet.authorization_status === "draft_not_active", `${label} must remain inactive draft`);
  assert(packet.authorization_active === false, `${label} authorization_active must be false`);
  assert(packet.can_execute_now === false, `${label} can_execute_now must be false`);
  assert(packet.requires_exact_user_activation === true, `${label} exact activation must be required`);
  assert(packet.activation_phrase_status === "draft_phrase_not_owner_issued", `${label} activation phrase must stay draft-only`);
  assert(packet.exact_activation_phrase.includes(packet.authorization_id), `${label} activation phrase must name authorization id`);
  assert(packet.exact_activation_phrase.includes("doubao-seedream-5-0-260128"), `${label} activation phrase must state Seedream 5 model`);
  assert(packet.exact_activation_phrase.includes("禁止读取 secret 值"), `${label} activation phrase must forbid secret reads`);
  assert(packet.source_preflight_decision.candidate_authorization_id === packet.authorization_id, `${label} preflight authorization id mismatch`);
  assert(packet.source_preflight_decision.authorization_status === "not_issued", `${label} preflight must remain not issued`);
  assert(packet.source_preflight_decision.authorization_active === false, `${label} preflight authorization_active must be false`);
  assert(packet.source_preflight_decision.can_execute_now === false, `${label} preflight can_execute_now must be false`);
  assert(packet.source_preflight_decision.provider_execution_allowed_now === false, `${label} preflight provider execution must be false`);
  assert(packet.source_preflight_decision.exact_activation_phrase_issued === false, `${label} preflight phrase issued must be false`);
  assert(packet.execution_surface_precondition.status === "satisfied_vcptoolbox_retry_007_output_override_repair_applied", `${label} execution surface status mismatch`);
  assert(packet.execution_surface_precondition.repair_package_ref === repairPackagePath, `${label} repair package ref mismatch`);
  assert(packet.execution_surface_precondition.real_vcptoolbox_patch_allowed_now === false, `${label} VCPToolBox patch must not be allowed now`);
  assert(packet.execution_surface_precondition.vcptoolbox_retry_007_output_override_repair_applied === true, `${label} repair must be applied`);
  assert(packet.execution_surface_precondition.vcptoolbox_retry_007_output_override_repair_validated === true, `${label} repair must be validated`);
  assert(packet.execution_surface_precondition.current_route_authorizes_retry_007_output_override === true, `${label} route must authorize retry_007 after repair`);
  assert(packet.execution_surface_precondition.current_route_test_covers_retry_007_output_override === true, `${label} route test must cover retry_007 after repair`);
  assert(packet.execution_surface_precondition.required_vcptoolbox_head_reviewed === "94f2f597_plus_authorized_local_two_file_repair", `${label} reviewed VCPToolBox head mismatch`);
  assert(packet.execution_surface_precondition.required_authorization_id === packet.authorization_id, `${label} execution surface auth id mismatch`);
  assert(packet.execution_surface_precondition.required_output_root === "A:\\agent-image-lab\\agent-image-lab-v0.2\\runs\\real_generation\\v0_6_73_real_vcp_agent_generation_retry_007", `${label} execution surface output root mismatch`);
  assert(packet.execution_surface_precondition.can_execute_provider_before_repair === false, `${label} provider must not execute before repair`);
  assert(packet.prior_real_execution_evidence.last_attempt_authorization_id === "AUTH-DRAFT-NATIVE-DOUBAO-SEEDREAM5-RETRY-20260526-006", `${label} retry_006 authorization anchor mismatch`);
  assert(packet.prior_real_execution_evidence.last_attempt_status === "COMPLETED_PROVIDER_IMAGE_CREATED", `${label} retry_006 status mismatch`);
  assert(packet.prior_real_execution_evidence.provider_evidence_integrity_validator === "npm run validate:provider-evidence-integrity", `${label} provider evidence gate missing`);
  assert(packet.selected_provider.provider_id === "NativeDoubaoImage", `${label} provider mismatch`);
  assert(packet.selected_provider.model === "doubao-seedream-5-0-260128", `${label} selected model mismatch`);
  assert(packet.selected_provider.provider_binding_ref === "native_doubao:capability:owner-runtime:<redacted>", `${label} binding ref must be redacted`);
  assert(packet.activation_budget.max_provider_calls === 1, `${label} provider call budget mismatch`);
  assert(packet.activation_budget.max_plugin_calls === 1, `${label} plugin call budget mismatch`);
  assert(packet.activation_budget.max_api_calls === 1, `${label} api call budget mismatch`);
  assert(packet.activation_budget.max_images_created === 1, `${label} image budget mismatch`);
  assert(packet.activation_budget.retry_allowed === false, `${label} retry must be false`);
  assert(packet.activation_budget.max_retry_count === 0, `${label} max retry must be 0`);
  assert(packet.allowed_operation_when_activated.command_template.includes("--model=doubao-seedream-5-0-260128"), `${label} command template must pass model`);
  assert(packet.allowed_operation_when_activated.output_directory_ref === "runs/real_generation/v0_6_73_real_vcp_agent_generation_retry_007", `${label} output dir mismatch`);
  assert(packet.allowed_operation_when_activated.provider_receipt_ref === "reports/provider_receipts/v0_6_73_real_vcp_agent_generation_retry_007_receipt.json", `${label} receipt ref mismatch`);
  assert(packet.allowed_operation_when_activated.review_handoff_ref === "review_console/live_receipt_bridge/v0_6_73_real_vcp_agent_generation_retry_007/bridge_entry.json", `${label} review handoff ref mismatch`);
  assert(packet.allowed_operation_when_activated.durable_audit_store_root === ".agent_private/runtime_audit_store/v0_6_73_real_vcp_agent_generation_retry_007", `${label} audit ref mismatch`);
  assert(!packet.allowed_operation_when_activated.output_directory_ref.includes("retry_006"), `${label} must not reuse retry_006 output dir`);
  assert(packet.write_boundaries_when_activated.overwrite_existing_files_allowed === false, `${label} overwrite must be false`);
  assert(packet.write_boundaries_when_activated.production_candidate_write_allowed === false, `${label} production write must be false`);
  assert(packet.write_boundaries_when_activated.accepted_samples_write_allowed === false, `${label} accepted samples write must be false`);
  assert(packet.write_boundaries_when_activated.DailyNote_write_allowed === false, `${label} DailyNote write must be false`);
  assert(packet.write_boundaries_when_activated.VCP_memory_write_allowed === false, `${label} VCP memory write must be false`);
  assert(packet.validation_required_before_activation.includes("node scripts/validate_exact_a5_provider_retry_007_activation_packet_draft.js"), `${label} activation draft validator missing`);
  assert(packet.validation_required_before_activation.includes("node scripts/validate_exact_a5_provider_retry_007_vcptoolbox_output_override_repair_package.js"), `${label} repair package validator missing`);
  assert(packet.validation_required_before_activation.includes("VCPToolBox retry_007 output override repair applied and validated"), `${label} VCPToolBox repair gate missing`);
  assert(packet.validation_required_before_activation.includes("VCPToolBox node --test tests\\aiImageAgentsRoute.test.js"), `${label} VCPToolBox route test gate missing`);
  assert(packet.validation_required_before_activation.includes("npm run validate:all"), `${label} full validation gate missing`);
  for (const [field, value] of Object.entries(packet.current_side_effect_flags)) {
    assert(value === false, `${label} current_side_effect_flags.${field} must be false`);
  }
}

function expectFailure(caseId, fn) {
  try {
    fn();
  } catch (_error) {
    return { case_id: caseId, result: "caught" };
  }
  throw new Error(`${caseId} was not caught`);
}

function main() {
  assert(fs.existsSync(repoPath(adapterPath)), "retry_007 activation packet adapter missing");
  assert(fs.existsSync(repoPath(repairPackagePath)), "retry_007 VCPToolBox output override repair package missing");
  runNode(["--check", adapterPath]);

  const adapter = require(repoPath(adapterPath));
  assert(typeof adapter.buildExactA5ProviderRetry007ActivationPacketDraft === "function", "builder export missing");
  assert(typeof adapter.validateExactA5ProviderRetry007ActivationPacketDraft === "function", "validator export missing");

  const packet = adapter.buildExactA5ProviderRetry007ActivationPacketDraft();
  assertPacket(packet, "direct");
  assert(adapter.validateExactA5ProviderRetry007ActivationPacketDraft(packet) === true, "direct packet should validate");

  const repairPackage = fs.readFileSync(repoPath(repairPackagePath), "utf8");
  for (const token of [
    "phase: exact_a5_provider_retry_007_vcptoolbox_output_override_repair_package",
    "status: repair_applied_and_validated",
    "repair_applied: true",
    "repair_validated: true",
    "real_vcptoolbox_patch_allowed_now: false",
    "real_provider_execution_allowed_now: false",
    "A:\\VCP\\apps\\VCPToolBox\\routes\\admin\\aiImageAgents.js",
    "A:\\VCP\\apps\\VCPToolBox\\tests\\aiImageAgentsRoute.test.js",
    "AUTH-DRAFT-NATIVE-DOUBAO-SEEDREAM5-RETRY-20260527-007",
    "A:\\agent-image-lab\\agent-image-lab-v0.2\\runs\\real_generation\\v0_6_73_real_vcp_agent_generation_retry_007",
    "new_runner_allowed: false",
    "provider_contact_performed: false",
    "secret_value_read_performed: false",
    "node --test tests\\aiImageAgentsRoute.test.js",
    "This phrase did not authorize `retry_007` provider execution",
  ]) {
    assert(repairPackage.includes(token), `repair package token missing: ${token}`);
  }

  const cliPacket = JSON.parse(runNode([adapterPath]));
  assertPacket(cliPacket, "cli");

  const integrity = JSON.parse(runNode(["scripts/validate_provider_evidence_integrity_contract.js"]));
  assert(integrity.passed === true, "provider evidence integrity validator must pass");

  const negativeCases = [
    expectFailure("authorization_active_true_rejected", () => {
      const dirty = clone(packet);
      dirty.authorization_active = true;
      adapter.validateExactA5ProviderRetry007ActivationPacketDraft(dirty);
    }),
    expectFailure("can_execute_true_rejected", () => {
      const dirty = clone(packet);
      dirty.can_execute_now = true;
      adapter.validateExactA5ProviderRetry007ActivationPacketDraft(dirty);
    }),
    expectFailure("activation_phrase_drift_rejected", () => {
      const dirty = clone(packet);
      dirty.exact_activation_phrase = "授权执行 retry_007";
      adapter.validateExactA5ProviderRetry007ActivationPacketDraft(dirty);
    }),
    expectFailure("source_preflight_phrase_issued_rejected", () => {
      const dirty = clone(packet);
      dirty.source_preflight_decision.exact_activation_phrase_issued = true;
      adapter.validateExactA5ProviderRetry007ActivationPacketDraft(dirty);
    }),
    expectFailure("execution_surface_repair_marked_allowed_rejected", () => {
      const dirty = clone(packet);
      dirty.execution_surface_precondition.real_vcptoolbox_patch_allowed_now = true;
      adapter.validateExactA5ProviderRetry007ActivationPacketDraft(dirty);
    }),
    expectFailure("execution_surface_repair_applied_false_rejected", () => {
      const dirty = clone(packet);
      dirty.execution_surface_precondition.vcptoolbox_retry_007_output_override_repair_applied = false;
      adapter.validateExactA5ProviderRetry007ActivationPacketDraft(dirty);
    }),
    expectFailure("execution_surface_route_missing_rejected", () => {
      const dirty = clone(packet);
      dirty.execution_surface_precondition.current_route_authorizes_retry_007_output_override = false;
      adapter.validateExactA5ProviderRetry007ActivationPacketDraft(dirty);
    }),
    expectFailure("wrong_model_rejected", () => {
      const dirty = clone(packet);
      dirty.selected_provider.model = "doubao-seedream-3-0-t2i-250415";
      adapter.validateExactA5ProviderRetry007ActivationPacketDraft(dirty);
    }),
    expectFailure("wrong_output_directory_rejected", () => {
      const dirty = clone(packet);
      dirty.allowed_operation_when_activated.output_directory_ref = "runs/real_generation/v0_6_73_real_vcp_agent_generation_retry_006";
      adapter.validateExactA5ProviderRetry007ActivationPacketDraft(dirty);
    }),
    expectFailure("retry_allowed_rejected", () => {
      const dirty = clone(packet);
      dirty.activation_budget.retry_allowed = true;
      adapter.validateExactA5ProviderRetry007ActivationPacketDraft(dirty);
    }),
    expectFailure("provider_budget_overrun_rejected", () => {
      const dirty = clone(packet);
      dirty.activation_budget.max_provider_calls = 2;
      adapter.validateExactA5ProviderRetry007ActivationPacketDraft(dirty);
    }),
    expectFailure("full_validation_gate_missing_rejected", () => {
      const dirty = clone(packet);
      dirty.validation_required_before_activation = dirty.validation_required_before_activation.filter((command) => command !== "npm run validate:all");
      adapter.validateExactA5ProviderRetry007ActivationPacketDraft(dirty);
    }),
    expectFailure("current_side_effect_true_rejected", () => {
      const dirty = clone(packet);
      dirty.current_side_effect_flags.provider_contact_performed = true;
      adapter.validateExactA5ProviderRetry007ActivationPacketDraft(dirty);
    }),
  ];

  console.log(JSON.stringify({
    passed: true,
    validator: "validate_exact_a5_provider_retry_007_activation_packet_draft",
    adapter_id: packet.adapter_id,
    packet_schema: packet.packet_schema,
    authorization_id: packet.authorization_id,
    authorization_status: packet.authorization_status,
    authorization_active: packet.authorization_active,
    can_execute_now: packet.can_execute_now,
    activation_phrase_status: packet.activation_phrase_status,
    exact_activation_phrase_present: typeof packet.exact_activation_phrase === "string" && packet.exact_activation_phrase.includes(packet.authorization_id),
    required_model: packet.selected_provider.model,
    source_preflight_decision_status: packet.source_preflight_decision.decision_status,
    source_preflight_authorization_status: packet.source_preflight_decision.authorization_status,
    source_preflight_phrase_issued: packet.source_preflight_decision.exact_activation_phrase_issued,
    retry_006_evidence_anchor: packet.prior_real_execution_evidence.last_attempt_authorization_id,
    retry_007_output_directory_ref: packet.allowed_operation_when_activated.output_directory_ref,
    retry_007_provider_receipt_ref: packet.allowed_operation_when_activated.provider_receipt_ref,
    execution_surface_precondition_status: packet.execution_surface_precondition.status,
    repair_package_ref: packet.execution_surface_precondition.repair_package_ref,
    repair_applied: packet.execution_surface_precondition.vcptoolbox_retry_007_output_override_repair_applied,
    repair_validated: packet.execution_surface_precondition.vcptoolbox_retry_007_output_override_repair_validated,
    current_route_authorizes_retry_007_output_override: packet.execution_surface_precondition.current_route_authorizes_retry_007_output_override,
    current_route_test_covers_retry_007_output_override: packet.execution_surface_precondition.current_route_test_covers_retry_007_output_override,
    max_provider_calls_when_activated: packet.activation_budget.max_provider_calls,
    retry_allowed: packet.activation_budget.retry_allowed,
    provider_evidence_integrity_gate_passed: integrity.passed,
    negative_case_count: negativeCases.length,
    caught_negative_case_count: negativeCases.filter((item) => item.result === "caught").length,
    all_negative_cases_caught: negativeCases.every((item) => item.result === "caught"),
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    env_file_content_read_performed: false,
    secret_value_read_performed: false,
    output_write_performed: false,
    production_write_performed: false,
    accepted_samples_write_performed: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false,
  }, null, 2));
}

try {
  main();
} catch (error) {
  console.error(JSON.stringify({
    passed: false,
    validator: "validate_exact_a5_provider_retry_007_activation_packet_draft",
    error: error.message,
  }, null, 2));
  process.exitCode = 1;
}
