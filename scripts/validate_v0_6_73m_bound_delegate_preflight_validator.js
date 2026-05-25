#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const docPath = "docs/vcp_integration/V0_6_73M_BOUND_DELEGATE_PREFLIGHT_VALIDATOR.md";
const passFixturePath = "tests/schema_examples/v0_6_73m_bound_delegate_preflight_validator.example.yaml";
const failFixturePath = "tests/schema_examples/v0_6_73m_bound_delegate_preflight_validator_fail.example.yaml";
const lDocPath = "docs/vcp_integration/V0_6_73L_BOUND_DELEGATE_AUTHORIZATION_PACKET_DRAFT.md";
const lFixturePath = "tests/schema_examples/v0_6_73l_bound_delegate_authorization_packet_draft.example.yaml";

const requiredFiles = [docPath, passFixturePath, failFixturePath, lDocPath, lFixturePath];
const requiredTokens = [
  "phase: v0_6_73m_bound_delegate_preflight_validator",
  "result: COMPLETED_VALIDATED",
  "preflight_contract_id: PFC-V0-6-73M-BOUND-DELEGATE",
  "source_authorization_packet_ref: docs/vcp_integration/V0_6_73L_BOUND_DELEGATE_AUTHORIZATION_PACKET_DRAFT.md",
  "source_authorization_packet_id: AUTH-DRAFT-V0-6-73L-BOUND-DELEGATE",
  "target_execution_phase: v0_6_73_real_vcp_agent_generation_execution_one_shot",
  "runner_policy: fail_closed_until_exact_active_bound_delegate_authorization",
  "exact_active_delegate_authorization_present: false",
  "authorization_status_required_for_execution: active_exact_human_authorized",
  "current_authorization_status: draft_not_active",
  "delegate_binding_active_required_for_execution: true",
  "current_delegate_binding_active: false",
  "can_execute_now: false",
  "preflight_decision: FAIL_CLOSED_BOUND_DELEGATE_AUTHORIZATION_MISSING",
  "provider_contact_allowed: false",
  "plugin_call_allowed: false",
  "api_call_allowed: false",
  "image_generation_allowed: false",
  "output_write_allowed: false",
  "receipt_write_allowed: false",
  "review_handoff_write_allowed: false",
  "runner_must_stop_before_provider_contact: true",
  "authorization_status: active_exact_human_authorized",
  "delegate_binding_active: true",
  "exact_human_activation_phrase_names_phase: v0_6_73_real_vcp_agent_generation_execution_one_shot",
  "bridge_id: native_doubao_secretless_provider_runtime_bridge:v0_6_73h",
  "delegate_id: native_doubao_owner_runtime_delegate:v0_6_73_one_shot",
  "provider_binding_ref_redacted: true",
  "provider_binding_ref_is_secret: false",
  "output_directory_ref: runs/real_generation/v0_6_73_real_vcp_agent_generation_one_shot/",
  "receipt_ref: reports/provider_receipts/v0_6_73_real_vcp_agent_generation_one_shot_receipt.json",
  "review_handoff_ref: review_console/live_receipt_bridge/v0_6_73_real_vcp_agent_generation_one_shot/bridge_entry.json",
  "max_provider_calls: 1",
  "max_plugin_calls: 1",
  "max_api_calls: 1",
  "max_images_created: 1",
  "retry_limit: 0",
  "human_review_required: true",
  "review_console_required: true",
  "expected_decision: FAIL_CLOSED_BOUND_DELEGATE_AUTHORIZATION_MISSING",
  "expected_rejection: unsafe_allows_provider_contact_without_exact_active_delegate_authorization",
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
  "v0_6_73_execution_allowed: false",
  "next_safe_task: v0_6_73n_real_execution_go_no_go_review"
];

const rejectionTokens = [
  "exact_active_delegate_authorization_present_false",
  "authorization_status_is_draft_not_active",
  "delegate_binding_active_false",
  "can_execute_now_false",
  "exact_human_activation_phrase_missing",
  "target_execution_phase_mismatch",
  "bridge_id_mismatch",
  "delegate_id_mismatch",
  "provider_binding_ref_not_redacted",
  "provider_binding_ref_is_secret_true",
  "output_directory_ref_not_exact",
  "receipt_ref_not_exact",
  "review_handoff_ref_not_exact",
  "max_provider_calls_not_one",
  "retry_limit_not_zero",
  "human_review_required_false",
  "review_console_required_false",
  "provider_contact_requested_before_preflight_pass"
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

function containsAll(text, tokens) {
  return tokens.every((token) => text.includes(token));
}

function main() {
  for (const file of requiredFiles) {
    addResult(`file_exists:${file}`, fs.existsSync(repoPath(file)), file);
  }

  const doc = read(docPath);
  const passFixture = read(passFixturePath);
  const failFixture = read(failFixturePath);
  const lPacket = `${read(lDocPath)}\n${read(lFixturePath)}`;
  const joined = `${doc}\n${passFixture}`;

  for (const token of requiredTokens) {
    addResult(`contract_contains:${token}`, joined.includes(token), token);
  }
  for (const token of rejectionTokens) {
    addResult(`rejection_case:${token}`, doc.includes(token), token);
  }

  addResult("source_l_packet_remains_draft_inactive", lPacket.includes("authorization_status: draft_not_active") &&
    lPacket.includes("delegate_binding_active: false") &&
    lPacket.includes("can_execute_now: false"), "v0.6.73l draft inactive");
  addResult("preflight_pass_fixture_is_fail_closed", passFixture.includes("exact_active_delegate_authorization_present: false") &&
    passFixture.includes("current_authorization_status: draft_not_active") &&
    passFixture.includes("current_delegate_binding_active: false") &&
    passFixture.includes("can_execute_now: false") &&
    passFixture.includes("preflight_decision: FAIL_CLOSED_BOUND_DELEGATE_AUTHORIZATION_MISSING") &&
    passFixture.includes("runner_must_stop_before_provider_contact: true"), passFixturePath);
  addResult("unsafe_fail_fixture_is_detectably_rejected", failFixture.includes("expected_rejection: unsafe_allows_provider_contact_without_exact_active_delegate_authorization") &&
    failFixture.includes("exact_active_delegate_authorization_present: false") &&
    failFixture.includes("current_authorization_status: draft_not_active") &&
    failFixture.includes("current_delegate_binding_active: false") &&
    failFixture.includes("can_execute_now: true") &&
    failFixture.includes("provider_contact_allowed: true") &&
    failFixture.includes("runner_must_stop_before_provider_contact: false"), failFixturePath);
  addResult("runner_allows_no_side_effect_without_active_authorization", containsAll(passFixture, [
    "provider_contact_allowed: false",
    "plugin_call_allowed: false",
    "api_call_allowed: false",
    "image_generation_allowed: false",
    "output_write_allowed: false",
    "receipt_write_allowed: false",
    "review_handoff_write_allowed: false"
  ]), "all execution side effects false");

  const passed = errors.length === 0;
  const summary = {
    validator: "validate_v0_6_73m_bound_delegate_preflight_validator",
    phase: "v0_6_73m_bound_delegate_preflight_validator",
    result: passed ? "COMPLETED_VALIDATED" : "BLOCKED",
    passed,
    check_count: results.length,
    failed_count: errors.length,
    preflight_decision: "FAIL_CLOSED_BOUND_DELEGATE_AUTHORIZATION_MISSING",
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
    v0_6_73_execution_allowed: false,
    next_safe_task: "v0_6_73n_real_execution_go_no_go_review",
    errors,
    results
  };

  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
  process.exit(passed ? 0 : 1);
}

main();
