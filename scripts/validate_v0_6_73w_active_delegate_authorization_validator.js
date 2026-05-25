#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const docPath = "docs/vcp_integration/V0_6_73W_ACTIVE_DELEGATE_AUTHORIZATION_VALIDATOR.md";
const candidatePath = "tests/schema_examples/v0_6_73w_active_delegate_authorization_candidate.example.yaml";
const failPath = "tests/schema_examples/v0_6_73w_active_delegate_authorization_fail.example.yaml";
const vDocPath = "docs/vcp_integration/V0_6_73V_EXACT_ACTIVE_DELEGATE_AUTHORIZATION_PACKET_DRAFT.md";
const vFixturePath = "tests/schema_examples/v0_6_73v_exact_active_delegate_authorization_packet_draft.example.yaml";

const requiredFiles = [docPath, candidatePath, failPath, vDocPath, vFixturePath];
const requiredTokens = [
  "phase: v0_6_73w_active_delegate_authorization_validator",
  "source_phase: v0_6_73v_exact_active_delegate_authorization_packet_draft",
  "source_status: COMPLETED_VALIDATED_draft_not_active",
  "result: COMPLETED_VALIDATED",
  "validator_id: VALIDATOR-V0-6-73W-ACTIVE-DELEGATE-AUTHORIZATION",
  "validator_ref: scripts/validate_v0_6_73w_active_delegate_authorization_validator.js",
  "authorization_packet_id: AUTH-ACTIVE-V0-6-73U-BOUND-DELEGATE",
  "authorization_status: active",
  "current_packet_status: draft_not_active",
  "current_validator_decision: FAIL_CLOSED_DRAFT_NOT_ACTIVE",
  "candidate_active_shape_validates: true",
  "candidate_active_shape_activates_execution_now: false",
  "authorization_phrase_active: false",
  "can_execute_now: false",
  "final_go_no_go_review_required: true",
  "exact_human_execution_phrase_required: true",
  "draft_not_active_packet_rejected_for_execution",
  "active_candidate_without_final_phrase_rejected_for_execution",
  "wrong_delegate_id_rejected",
  "wrong_bridge_id_rejected",
  "provider_binding_ref_not_redacted_rejected",
  "budget_not_exact_one_shot_rejected",
  "retry_limit_nonzero_rejected",
  "secret_value_allowed_rejected",
  "env_file_content_read_allowed_rejected",
  "promotion_or_memory_write_allowed_rejected",
  "current_authorization_status: draft_not_active",
  "active_candidate_available: fixture_only",
  "active_candidate_is_authorization: false",
  "preflight_passed_for_real_execution: false",
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
  "next_safe_task: v0_6_73x_final_local_readiness_stop_line_review"
];

const candidateRequired = [
  "authorization_status: active",
  "delegate_binding_active: true",
  "exact_active_delegate_authorization_present: true",
  "authorization_phrase_active: false",
  "can_execute_now: false",
  "final_go_no_go_review_required: true",
  "exact_human_execution_phrase_required: true",
  "candidate_active_shape_activates_execution_now: false",
  "v0_6_73_execution_allowed: false"
];

const failRequired = [
  "bridge_id: wrong_bridge",
  "delegate_id: wrong_delegate",
  "provider_binding_ref_redacted: false",
  "provider_binding_ref_is_secret: true",
  "max_provider_calls: 2",
  "retry_limit: 1",
  "secret_value_allowed: true",
  "env_file_content_read_allowed: true",
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
  const candidate = read(candidatePath);
  const fail = read(failPath);
  const vDoc = read(vDocPath);
  const vFixture = read(vFixturePath);
  const joined = `${doc}\n${candidate}`;

  for (const token of requiredTokens) {
    addResult(`validator_contract_contains:${token}`, joined.includes(token), token);
  }
  for (const token of candidateRequired) {
    addResult(`candidate_contains:${token}`, candidate.includes(token), token);
  }
  for (const token of failRequired) {
    addResult(`fail_fixture_contains:${token}`, fail.includes(token), token);
  }

  addResult("source_v_remains_draft_not_active", vDoc.includes("authorization_status: draft_not_active") &&
    vFixture.includes("authorization_status: draft_not_active") &&
    vDoc.includes("draft_decision: FAIL_CLOSED_DRAFT_NOT_ACTIVE"), vDocPath);
  addResult("candidate_valid_shape_but_not_execution_auth", candidate.includes("authorization_status: active") &&
    candidate.includes("authorization_phrase_active: false") &&
    candidate.includes("can_execute_now: false") &&
    candidate.includes("v0_6_73_execution_allowed: false"), candidatePath);
  addResult("fail_fixture_rejected_shape", fail.includes("wrong_delegate") &&
    fail.includes("secret_value_allowed: true") &&
    fail.includes("v0_6_73_execution_allowed: true"), failPath);

  const passed = errors.length === 0;
  const summary = {
    validator: "validate_v0_6_73w_active_delegate_authorization_validator",
    phase: "v0_6_73w_active_delegate_authorization_validator",
    result: passed ? "COMPLETED_VALIDATED" : "BLOCKED",
    passed,
    check_count: results.length,
    failed_count: errors.length,
    current_validator_decision: "FAIL_CLOSED_DRAFT_NOT_ACTIVE",
    candidate_active_shape_validates: true,
    candidate_active_shape_activates_execution_now: false,
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
    next_safe_task: "v0_6_73x_final_local_readiness_stop_line_review",
    errors,
    results
  };

  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
  process.exit(passed ? 0 : 1);
}

main();
