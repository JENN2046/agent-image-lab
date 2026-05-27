#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const adapterPath = "adapters/runtime/exact_a5_provider_retry_007_preflight_decision_packet.js";

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
  assert(packet.packet_schema === "exact_a5_provider_retry_007_preflight_decision_packet.v0", `${label} schema mismatch`);
  assert(packet.adapter_id === "exact_a5_provider_retry_007_preflight_decision_packet_v0", `${label} adapter mismatch`);
  assert(packet.decision_id === "P2.2-RETRY-007-PREFLIGHT-DECISION-20260527", `${label} decision id mismatch`);
  assert(packet.candidate_authorization_id === "AUTH-DRAFT-NATIVE-DOUBAO-SEEDREAM5-RETRY-20260527-007", `${label} candidate authorization mismatch`);
  assert(packet.decision_status === "hold_pending_owner_decision", `${label} decision status mismatch`);
  assert(packet.authorization_status === "not_issued", `${label} authorization must not be issued`);
  assert(packet.authorization_active === false, `${label} authorization_active must be false`);
  assert(packet.can_execute_now === false, `${label} can_execute_now must be false`);
  assert(packet.provider_execution_allowed_now === false, `${label} provider execution must be false`);
  assert(packet.exact_activation_phrase_issued === false, `${label} activation phrase must not be issued`);
  assert(packet.exact_activation_phrase === null, `${label} activation phrase must be null`);
  assert(packet.requires_separate_owner_authorization === true, `${label} separate authorization required`);
  assert(packet.requires_new_activation_packet_before_execution === true, `${label} new activation packet required`);
  assert(packet.prior_real_execution_evidence.last_attempt_authorization_id === "AUTH-DRAFT-NATIVE-DOUBAO-SEEDREAM5-RETRY-20260526-006", `${label} retry_006 anchor mismatch`);
  assert(packet.prior_real_execution_evidence.last_attempt_status === "COMPLETED_PROVIDER_IMAGE_CREATED", `${label} retry_006 status mismatch`);
  assert(packet.prior_real_execution_evidence.artifact_integrity_validator === "npm run validate:retry-006-artifact-integrity", `${label} artifact validator missing`);
  assert(packet.prior_real_execution_evidence.provider_evidence_integrity_validator === "npm run validate:provider-evidence-integrity", `${label} evidence integrity validator missing`);
  assert(packet.selected_provider_candidate.provider_id === "NativeDoubaoImage", `${label} provider mismatch`);
  assert(packet.selected_provider_candidate.required_model === "doubao-seedream-5-0-260128", `${label} required model mismatch`);
  assert(packet.selected_provider_candidate.provider_binding_ref === "native_doubao:capability:owner-runtime:<redacted>", `${label} provider binding must be redacted`);
  assert(packet.retry_007_candidate_boundaries.output_directory_ref === "runs/real_generation/v0_6_73_real_vcp_agent_generation_retry_007", `${label} output dir mismatch`);
  assert(packet.retry_007_candidate_boundaries.provider_receipt_ref === "reports/provider_receipts/v0_6_73_real_vcp_agent_generation_retry_007_receipt.json", `${label} receipt ref mismatch`);
  assert(packet.retry_007_candidate_boundaries.review_handoff_ref === "review_console/live_receipt_bridge/v0_6_73_real_vcp_agent_generation_retry_007/bridge_entry.json", `${label} handoff ref mismatch`);
  assert(packet.retry_007_candidate_boundaries.durable_audit_store_root === ".agent_private/runtime_audit_store/v0_6_73_real_vcp_agent_generation_retry_007", `${label} audit ref mismatch`);
  assert(packet.retry_007_candidate_boundaries.max_provider_calls_if_later_authorized === 1, `${label} provider budget mismatch`);
  assert(packet.retry_007_candidate_boundaries.max_images_if_later_authorized === 1, `${label} image budget mismatch`);
  assert(packet.retry_007_candidate_boundaries.retry_allowed_after_retry_007 === false, `${label} retry must remain false`);
  assert(packet.required_validation_before_any_future_activation.includes("npm run validate:core"), `${label} core gate missing`);
  assert(packet.required_validation_before_any_future_activation.includes("npm run validate:public-disclosure"), `${label} disclosure gate missing`);
  assert(packet.required_validation_before_any_future_activation.includes("npm run validate:provider-evidence-integrity"), `${label} provider evidence gate missing`);
  assert(packet.required_validation_before_any_future_activation.includes("npm run validate:all"), `${label} full gate missing`);
  assert(packet.forbidden_now.includes("provider contact"), `${label} provider contact forbidden-now missing`);
  assert(packet.forbidden_now.includes("image generation"), `${label} image generation forbidden-now missing`);
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
  assert(fs.existsSync(repoPath(adapterPath)), "retry_007 preflight decision adapter missing");
  runNode(["--check", adapterPath]);

  const adapter = require(repoPath(adapterPath));
  assert(typeof adapter.buildExactA5ProviderRetry007PreflightDecisionPacket === "function", "builder export missing");
  assert(typeof adapter.validateExactA5ProviderRetry007PreflightDecisionPacket === "function", "validator export missing");

  const packet = adapter.buildExactA5ProviderRetry007PreflightDecisionPacket();
  assertPacket(packet, "direct");
  assert(adapter.validateExactA5ProviderRetry007PreflightDecisionPacket(packet) === true, "direct packet should validate");

  const cliPacket = JSON.parse(runNode([adapterPath]));
  assertPacket(cliPacket, "cli");

  const integrity = JSON.parse(runNode(["scripts/validate_provider_evidence_integrity_contract.js"]));
  assert(integrity.passed === true, "provider evidence integrity validator must pass");

  const negativeCases = [
    expectFailure("can_execute_true_rejected", () => {
      const dirty = clone(packet);
      dirty.can_execute_now = true;
      adapter.validateExactA5ProviderRetry007PreflightDecisionPacket(dirty);
    }),
    expectFailure("activation_phrase_issued_rejected", () => {
      const dirty = clone(packet);
      dirty.exact_activation_phrase_issued = true;
      dirty.exact_activation_phrase = "我授权执行 retry_007";
      adapter.validateExactA5ProviderRetry007PreflightDecisionPacket(dirty);
    }),
    expectFailure("wrong_model_rejected", () => {
      const dirty = clone(packet);
      dirty.selected_provider_candidate.required_model = "doubao-seedream-3-0-t2i-250415";
      adapter.validateExactA5ProviderRetry007PreflightDecisionPacket(dirty);
    }),
    expectFailure("wrong_output_directory_rejected", () => {
      const dirty = clone(packet);
      dirty.retry_007_candidate_boundaries.output_directory_ref = "runs/real_generation/v0_6_73_real_vcp_agent_generation_retry_006";
      adapter.validateExactA5ProviderRetry007PreflightDecisionPacket(dirty);
    }),
    expectFailure("retry_allowed_rejected", () => {
      const dirty = clone(packet);
      dirty.retry_007_candidate_boundaries.retry_allowed_after_retry_007 = true;
      adapter.validateExactA5ProviderRetry007PreflightDecisionPacket(dirty);
    }),
    expectFailure("provider_evidence_gate_missing_rejected", () => {
      const dirty = clone(packet);
      dirty.required_validation_before_any_future_activation = dirty.required_validation_before_any_future_activation.filter((command) => command !== "npm run validate:provider-evidence-integrity");
      adapter.validateExactA5ProviderRetry007PreflightDecisionPacket(dirty);
    }),
    expectFailure("current_side_effect_true_rejected", () => {
      const dirty = clone(packet);
      dirty.current_side_effect_flags.provider_contact_performed = true;
      adapter.validateExactA5ProviderRetry007PreflightDecisionPacket(dirty);
    }),
  ];

  console.log(JSON.stringify({
    passed: true,
    validator: "validate_exact_a5_provider_retry_007_preflight_decision",
    adapter_id: packet.adapter_id,
    packet_schema: packet.packet_schema,
    decision_id: packet.decision_id,
    candidate_authorization_id: packet.candidate_authorization_id,
    decision_status: packet.decision_status,
    authorization_status: packet.authorization_status,
    authorization_active: packet.authorization_active,
    can_execute_now: packet.can_execute_now,
    exact_activation_phrase_issued: packet.exact_activation_phrase_issued,
    required_model: packet.selected_provider_candidate.required_model,
    retry_007_output_directory_ref: packet.retry_007_candidate_boundaries.output_directory_ref,
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
    validator: "validate_exact_a5_provider_retry_007_preflight_decision",
    error: error.message,
  }, null, 2));
  process.exitCode = 1;
}
