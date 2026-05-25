#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const docPath = "docs/vcp_integration/V0_6_73P_LOCAL_AGGREGATE_READINESS_REVIEW.md";
const fixturePath = "tests/schema_examples/v0_6_73p_local_aggregate_readiness_review.example.yaml";
const oDocPath = "docs/vcp_integration/V0_6_73O_EXACT_REAL_EXECUTION_AUTHORIZATION_PHRASE_DRAFT.md";
const nDocPath = "docs/vcp_integration/V0_6_73N_REAL_EXECUTION_GO_NO_GO_REVIEW.md";
const mDocPath = "docs/vcp_integration/V0_6_73M_BOUND_DELEGATE_PREFLIGHT_VALIDATOR.md";
const lDocPath = "docs/vcp_integration/V0_6_73L_BOUND_DELEGATE_AUTHORIZATION_PACKET_DRAFT.md";

const requiredFiles = [docPath, fixturePath, oDocPath, nDocPath, mDocPath, lDocPath];
const requiredTokens = [
  "phase: v0_6_73p_local_aggregate_readiness_review",
  "result: COMPLETED_VALIDATED",
  "aggregate_review_id: AGG-V0-6-73P-LOCAL-READINESS",
  "local_head_at_review: ffd327eba38c35b33921f872063090d4184718d7",
  "remote_baseline_ref: origin/master",
  "remote_baseline_commit: 551ba04",
  "local_ahead_count: 5",
  "remote_behind_count: 0",
  "remote_synced_current: false",
  "target_execution_phase: v0_6_73_real_vcp_agent_generation_execution_one_shot",
  "aggregate_decision: READY_FOR_PUSH_SAFETY_GATE_ONLY",
  "real_execution_decision: NO_GO",
  "real_execution_no_go_reason: remote_not_synced_and_exact_active_delegate_authorization_missing",
  "v0_6_73_execution_allowed: false",
  "phase: v0_6_73k_remote_post_push_state_sync",
  "phase: v0_6_73l_bound_delegate_authorization_packet_draft",
  "phase: v0_6_73m_bound_delegate_preflight_validator",
  "phase: v0_6_73n_real_execution_go_no_go_review",
  "phase: v0_6_73o_exact_real_execution_authorization_phrase_draft",
  "mvp_validation_current: passed",
  "governance_slice_self_check_current: passed",
  "bound_delegate_authorization_packet_draft_present: true",
  "bound_delegate_preflight_fail_closed_present: true",
  "real_execution_go_no_go_review_present: true",
  "exact_authorization_phrase_draft_present: true",
  "authorization_phrase_active: false",
  "exact_active_delegate_authorization_present: false",
  "go_no_go_decision: NO_GO",
  "output_directory_policy_current: passed",
  "receipt_policy_current: passed",
  "review_handoff_policy_current: passed",
  "secretless_proof_current: passed",
  "push_safety_gate_required_next: true",
  "v0_6_73q_push_safety_gate_passed",
  "user_explicit_git_push_origin_master_if_push_is_desired",
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
  "next_safe_task: v0_6_73q_push_safety_gate"
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
  const oDoc = read(oDocPath);
  const nDoc = read(nDocPath);
  const mDoc = read(mDocPath);
  const lDoc = read(lDocPath);
  const joined = `${doc}\n${fixture}`;

  for (const token of requiredTokens) {
    addResult(`aggregate_contains:${token}`, joined.includes(token), token);
  }

  addResult("source_o_phrase_inactive", oDoc.includes("authorization_phrase_active: false") &&
    oDoc.includes("current_go_no_go_decision: NO_GO"), oDocPath);
  addResult("source_n_no_go_current", nDoc.includes("go_no_go_decision: NO_GO") &&
    nDoc.includes("remote_synced_current: false") &&
    nDoc.includes("exact_active_delegate_authorization_present: false"), nDocPath);
  addResult("source_m_fail_closed_current", mDoc.includes("preflight_decision: FAIL_CLOSED_BOUND_DELEGATE_AUTHORIZATION_MISSING") &&
    mDoc.includes("runner_must_stop_before_provider_contact: true"), mDocPath);
  addResult("source_l_draft_inactive_current", lDoc.includes("authorization_status: draft_not_active") &&
    lDoc.includes("delegate_binding_active: false") &&
    lDoc.includes("can_execute_now: false"), lDocPath);
  addResult("aggregate_stops_at_push_safety_gate", joined.includes("aggregate_decision: READY_FOR_PUSH_SAFETY_GATE_ONLY") &&
    joined.includes("next_safe_task: v0_6_73q_push_safety_gate") &&
    joined.includes("push_performed: false"), "push boundary");

  const passed = errors.length === 0;
  const summary = {
    validator: "validate_v0_6_73p_local_aggregate_readiness_review",
    phase: "v0_6_73p_local_aggregate_readiness_review",
    result: passed ? "COMPLETED_VALIDATED" : "BLOCKED",
    passed,
    check_count: results.length,
    failed_count: errors.length,
    aggregate_decision: "READY_FOR_PUSH_SAFETY_GATE_ONLY",
    real_execution_decision: "NO_GO",
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
    next_safe_task: "v0_6_73q_push_safety_gate",
    errors,
    results
  };

  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
  process.exit(passed ? 0 : 1);
}

main();
