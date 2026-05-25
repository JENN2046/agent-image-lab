#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const docPath = "docs/vcp_integration/V0_6_73U_ACTIVE_DELEGATE_AUTHORIZATION_ACTIVATION_PREFLIGHT.md";
const fixturePath = "tests/schema_examples/v0_6_73u_active_delegate_authorization_activation_preflight.example.yaml";
const failFixturePath = "tests/schema_examples/v0_6_73u_active_delegate_authorization_activation_preflight_fail.example.yaml";
const tDocPath = "docs/vcp_integration/V0_6_73T_NEXT_PHASE_SELECTION_GATE.md";
const lDocPath = "docs/vcp_integration/V0_6_73L_BOUND_DELEGATE_AUTHORIZATION_PACKET_DRAFT.md";
const mDocPath = "docs/vcp_integration/V0_6_73M_BOUND_DELEGATE_PREFLIGHT_VALIDATOR.md";
const sDocPath = "docs/vcp_integration/V0_6_73S_FINAL_REAL_EXECUTION_BOUNDARY_REVIEW.md";

const requiredFiles = [docPath, fixturePath, failFixturePath, tDocPath, lDocPath, mDocPath, sDocPath];
const requiredTokens = [
  "phase: v0_6_73u_active_delegate_authorization_activation_preflight",
  "source_phase: v0_6_73t_next_phase_selection_gate",
  "source_status: COMPLETED_VALIDATED_selection_opened",
  "result: COMPLETED_VALIDATED",
  "activation_preflight_id: ACT-PREFLIGHT-V0-6-73U",
  "target_execution_phase: v0_6_73_real_vcp_agent_generation_execution_one_shot",
  "source_selection_gate_ref: docs/vcp_integration/V0_6_73T_NEXT_PHASE_SELECTION_GATE.md",
  "source_delegate_draft_ref: docs/vcp_integration/V0_6_73L_BOUND_DELEGATE_AUTHORIZATION_PACKET_DRAFT.md",
  "source_delegate_preflight_ref: docs/vcp_integration/V0_6_73M_BOUND_DELEGATE_PREFLIGHT_VALIDATOR.md",
  "source_final_boundary_review_ref: docs/vcp_integration/V0_6_73S_FINAL_REAL_EXECUTION_BOUNDARY_REVIEW.md",
  "activation_status: preflight_only_not_active",
  "delegate_binding_active: false",
  "exact_active_delegate_authorization_present: false",
  "authorization_phrase_active: false",
  "can_execute_now: false",
  "runner_policy: fail_closed_until_activation_preflight_and_final_authorization_pass",
  "authorization_packet_id: AUTH-ACTIVE-V0-6-73U-BOUND-DELEGATE",
  "authorization_status_required: active",
  "activation_preflight_id_required: ACT-PREFLIGHT-V0-6-73U",
  "bridge_id_required: native_doubao_secretless_provider_runtime_bridge:v0_6_73h",
  "delegate_id_required: native_doubao_owner_runtime_delegate:v0_6_73_one_shot",
  "provider_binding_ref_required: native_doubao:capability:owner-runtime:v0_6_73",
  "provider_binding_ref_redacted_required: true",
  "provider_binding_ref_is_secret_required: false",
  "max_provider_calls_required: 1",
  "max_plugin_calls_required: 1",
  "max_api_calls_required: 1",
  "max_images_created_required: 1",
  "retry_limit_required: 0",
  "output_directory_ref_required: runs/real_generation/v0_6_73_real_vcp_agent_generation_one_shot/",
  "receipt_ref_required: reports/provider_receipts/v0_6_73_real_vcp_agent_generation_one_shot_receipt.json",
  "review_handoff_ref_required: review_console/live_receipt_bridge/v0_6_73_real_vcp_agent_generation_one_shot/bridge_entry.json",
  "env_file_content_read_allowed: false",
  "secret_value_allowed: false",
  "raw_prompt_payload_allowed: false",
  "raw_provider_payload_retained_allowed: false",
  "accepted_samples_write_allowed: false",
  "production_candidate_write_allowed: false",
  "DailyNote_write_allowed: false",
  "VCP_memory_write_allowed: false",
  "preflight_decision: FAIL_CLOSED_ACTIVATION_NOT_ACTIVE",
  "preflight_passed_for_real_execution: false",
  "failure_reason: active_authorization_packet_absent_and_final_phrase_inactive",
  "runner_must_stop_before_provider_contact: true",
  "runner_must_stop_before_plugin_call: true",
  "runner_must_stop_before_api_call: true",
  "runner_must_stop_before_image_generation: true",
  "runner_must_stop_before_output_write: true",
  "provider_contact_performed: false",
  "plugin_call_performed: false",
  "api_call_performed: false",
  "image_generation_performed: false",
  "image_binary_read_performed: false",
  "output_write_performed: false",
  "receipt_write_performed: false",
  "review_handoff_write_performed: false",
  "env_file_content_read_performed: false",
  "secret_value_read_performed: false",
  "accepted_samples_write_performed: false",
  "production_candidate_write_performed: false",
  "DailyNote_write_performed: false",
  "VCP_memory_write_performed: false",
  "push_performed: false",
  "v0_6_73_execution_allowed: false",
  "next_safe_task: v0_6_73u3_runtime_delegate_binding_test_harness_no_provider"
];

const stopConditions = [
  "active_authorization_packet_absent",
  "authorization_status_not_active",
  "activation_preflight_id_mismatch",
  "target_execution_phase_mismatch",
  "bridge_id_mismatch",
  "delegate_id_mismatch",
  "provider_binding_ref_not_redacted",
  "provider_binding_ref_marked_secret",
  "budget_not_exact_one_shot",
  "retry_limit_not_zero",
  "output_directory_not_exact",
  "receipt_path_not_exact",
  "review_handoff_path_not_exact",
  "human_review_gate_missing",
  "review_console_gate_missing",
  "env_file_read_allowed",
  "secret_value_allowed",
  "raw_payload_retention_allowed",
  "promotion_or_memory_write_allowed"
];

const forbiddenPassTokens = [
  "activation_status: active",
  "delegate_binding_active: true",
  "can_execute_now: true",
  "preflight_decision: GO",
  "provider_contact_performed: true",
  "image_generation_performed: true",
  "secret_value_read_performed: true",
  "v0_6_73_execution_allowed: true"
];

const results = [];
const errors = [];

function repoPath(relativePath) {
  return path.join(root, relativePath);
}

function read(relativePath) {
  return fs.readFileSync(repoPath(relativePath), "utf8");
}

function addResult(check, passed, detail) {
  results.push({ check, passed: Boolean(passed), detail });
  if (!passed) errors.push({ check, detail });
}

function main() {
  for (const file of requiredFiles) {
    addResult(`file_exists:${file}`, fs.existsSync(repoPath(file)), file);
  }

  const doc = read(docPath);
  const fixture = read(fixturePath);
  const failFixture = read(failFixturePath);
  const tDoc = read(tDocPath);
  const lDoc = read(lDocPath);
  const mDoc = read(mDocPath);
  const sDoc = read(sDocPath);
  const joined = `${doc}\n${fixture}`;

  for (const token of requiredTokens) {
    addResult(`activation_preflight_contains:${token}`, joined.includes(token), token);
  }
  for (const token of stopConditions) {
    addResult(`stop_condition:${token}`, doc.includes(token), token);
  }
  for (const token of forbiddenPassTokens) {
    addResult(`fail_fixture_contains_forbidden_positive:${token}`, failFixture.includes(token), token);
    addResult(`pass_fixture_rejects_forbidden_positive:${token}`, !fixture.includes(token), token);
  }

  addResult("source_t_recommends_u", tDoc.includes("recommended_next_phase: v0_6_73u_active_delegate_authorization_activation_preflight") &&
    tDoc.includes("requires_provider_contact: false"), tDocPath);
  addResult("source_l_delegate_draft_inactive", lDoc.includes("authorization_status: draft_not_active") &&
    lDoc.includes("delegate_binding_active: false") &&
    lDoc.includes("can_execute_now: false"), lDocPath);
  addResult("source_m_fail_closed", mDoc.includes("preflight_decision: FAIL_CLOSED_BOUND_DELEGATE_AUTHORIZATION_MISSING") &&
    mDoc.includes("runner_must_stop_before_provider_contact: true"), mDocPath);
  addResult("source_s_final_no_go", sDoc.includes("final_real_execution_decision: NO_GO") &&
    sDoc.includes("authorization_phrase_active: false") &&
    sDoc.includes("exact_active_delegate_authorization_present: false"), sDocPath);
  addResult("activation_preflight_blocks_execution", joined.includes("preflight_passed_for_real_execution: false") &&
    joined.includes("runner_must_stop_before_provider_contact: true") &&
    joined.includes("v0_6_73_execution_allowed: false"), "fail closed");

  const passed = errors.length === 0;
  const summary = {
    validator: "validate_v0_6_73u_active_delegate_authorization_activation_preflight",
    phase: "v0_6_73u_active_delegate_authorization_activation_preflight",
    result: passed ? "COMPLETED_VALIDATED" : "BLOCKED",
    passed,
    check_count: results.length,
    failed_count: errors.length,
    preflight_decision: "FAIL_CLOSED_ACTIVATION_NOT_ACTIVE",
    preflight_passed_for_real_execution: false,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    image_binary_read_performed: false,
    output_write_performed: false,
    receipt_write_performed: false,
    review_handoff_write_performed: false,
    env_file_content_read_performed: false,
    secret_value_read_performed: false,
    accepted_samples_write_performed: false,
    production_candidate_write_performed: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false,
    push_performed: false,
    v0_6_73_execution_allowed: false,
    next_safe_task: "v0_6_73u3_runtime_delegate_binding_test_harness_no_provider",
    errors,
    results
  };

  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
  process.exit(passed ? 0 : 1);
}

main();
