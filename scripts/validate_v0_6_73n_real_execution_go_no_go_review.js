#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const docPath = "docs/vcp_integration/V0_6_73N_REAL_EXECUTION_GO_NO_GO_REVIEW.md";
const fixturePath = "tests/schema_examples/v0_6_73n_real_execution_go_no_go_review.example.yaml";
const mDocPath = "docs/vcp_integration/V0_6_73M_BOUND_DELEGATE_PREFLIGHT_VALIDATOR.md";
const cDocPath = "docs/vcp_integration/V0_6_73C_SECRETLESS_PROVIDER_RECEIPT_CONTRACT.md";
const dDocPath = "docs/vcp_integration/V0_6_73D_REAL_GENERATION_REVIEW_HANDOFF_CONTRACT.md";
const eDocPath = "docs/vcp_integration/V0_6_73E_ONE_SHOT_EXECUTION_READINESS_PACKET.md";

const requiredFiles = [docPath, fixturePath, mDocPath, cDocPath, dDocPath, eDocPath];
const requiredTokens = [
  "phase: v0_6_73n_real_execution_go_no_go_review",
  "result: COMPLETED_VALIDATED",
  "go_no_go_review_id: GNG-V0-6-73N-REAL-EXECUTION",
  "target_execution_phase: v0_6_73_real_vcp_agent_generation_execution_one_shot",
  "source_preflight_contract_ref: docs/vcp_integration/V0_6_73M_BOUND_DELEGATE_PREFLIGHT_VALIDATOR.md",
  "source_authorization_packet_ref: docs/vcp_integration/V0_6_73L_BOUND_DELEGATE_AUTHORIZATION_PACKET_DRAFT.md",
  "one_shot_readiness_packet_ref: docs/vcp_integration/V0_6_73E_ONE_SHOT_EXECUTION_READINESS_PACKET.md",
  "receipt_contract_ref: docs/vcp_integration/V0_6_73C_SECRETLESS_PROVIDER_RECEIPT_CONTRACT.md",
  "review_handoff_contract_ref: docs/vcp_integration/V0_6_73D_REAL_GENERATION_REVIEW_HANDOFF_CONTRACT.md",
  "remote_synced_required: true",
  "remote_synced_current: false",
  "mvp_validation_required: true",
  "mvp_validation_current: passed",
  "delegate_lock_required: true",
  "delegate_lock_current: passed_fail_closed",
  "exact_active_delegate_authorization_required: true",
  "exact_active_delegate_authorization_present: false",
  "output_directory_policy_required: true",
  "output_directory_policy_current: passed",
  "receipt_policy_required: true",
  "receipt_policy_current: passed",
  "review_handoff_policy_required: true",
  "review_handoff_policy_current: passed",
  "secretless_proof_required: true",
  "secretless_proof_current: passed",
  "human_review_required: true",
  "review_console_required: true",
  "go_no_go_decision: NO_GO",
  "no_go_reason: remote_not_synced_and_exact_active_delegate_authorization_missing",
  "v0_6_73_execution_allowed: false",
  "preflight_decision: FAIL_CLOSED_BOUND_DELEGATE_AUTHORIZATION_MISSING",
  "runner_must_stop_before_provider_contact: true",
  "future_receipt_ref: reports/provider_receipts/v0_6_73_real_vcp_agent_generation_one_shot_receipt.json",
  "future_review_handoff_ref: review_console/live_receipt_bridge/v0_6_73_real_vcp_agent_generation_one_shot/bridge_entry.json",
  "output_directory_ref: runs/real_generation/v0_6_73_real_vcp_agent_generation_one_shot/",
  "future_max_provider_calls: 1",
  "future_max_plugin_calls: 1",
  "future_max_api_calls: 1",
  "future_max_images_created: 1",
  "push_local_readiness_commits_and_verify_remote_synced",
  "exact_active_bound_delegate_authorization_present",
  "exact_human_activation_phrase_names_v0_6_73_real_vcp_agent_generation_execution_one_shot",
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
  "next_safe_task: v0_6_73o_exact_real_execution_authorization_phrase_draft"
];

const stopConditions = [
  "remote_synced_current_false",
  "exact_active_delegate_authorization_present_false",
  "authorization_status_not_active_exact_human_authorized",
  "delegate_binding_active_false",
  "provider_contact_requested_before_go",
  "plugin_call_requested_before_go",
  "api_call_requested_before_go",
  "image_generation_requested_before_go",
  "output_write_requested_before_go",
  "receipt_write_requested_before_go",
  "review_handoff_write_requested_before_go",
  "env_file_read_requested",
  "secret_value_requested",
  "raw_provider_payload_retention_requested",
  "human_review_gate_missing"
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
  const joined = `${doc}\n${fixture}`;
  const mDoc = read(mDocPath);
  const cDoc = read(cDocPath);
  const dDoc = read(dDocPath);
  const eDoc = read(eDocPath);

  for (const token of requiredTokens) {
    addResult(`go_no_go_contains:${token}`, joined.includes(token), token);
  }
  for (const token of stopConditions) {
    addResult(`stop_condition:${token}`, doc.includes(token), token);
  }

  addResult("source_m_preflight_still_fail_closed", mDoc.includes("preflight_decision: FAIL_CLOSED_BOUND_DELEGATE_AUTHORIZATION_MISSING") &&
    mDoc.includes("exact_active_delegate_authorization_present: false") &&
    mDoc.includes("runner_must_stop_before_provider_contact: true"), mDocPath);
  addResult("receipt_contract_path_policy_still_present", cDoc.includes("future_receipt_ref: reports/provider_receipts/v0_6_73_real_vcp_agent_generation_one_shot_receipt.json") &&
    cDoc.includes("receipt_records_counts_not_secrets: true") &&
    cDoc.includes("raw_provider_payload_recorded_allowed: false"), cDocPath);
  addResult("review_handoff_policy_still_present", dDoc.includes("future_review_handoff_ref: review_console/live_receipt_bridge/v0_6_73_real_vcp_agent_generation_one_shot/bridge_entry.json") &&
    dDoc.includes("human_review_receives_sanitized_metadata_only: true") &&
    dDoc.includes("image_binary_embedded_in_handoff_allowed: false"), dDocPath);
  addResult("one_shot_readiness_policy_still_present", eDoc.includes("output_directory_ref: runs/real_generation/v0_6_73_real_vcp_agent_generation_one_shot/") &&
    eDoc.includes("future_max_provider_calls: 1") &&
    eDoc.includes("future_max_plugin_calls: 1") &&
    eDoc.includes("future_max_api_calls: 1") &&
    eDoc.includes("future_max_images_created: 1"), eDocPath);
  addResult("no_go_blocks_execution", joined.includes("go_no_go_decision: NO_GO") &&
    joined.includes("remote_synced_current: false") &&
    joined.includes("exact_active_delegate_authorization_present: false") &&
    joined.includes("v0_6_73_execution_allowed: false"), "NO_GO review");

  const passed = errors.length === 0;
  const summary = {
    validator: "validate_v0_6_73n_real_execution_go_no_go_review",
    phase: "v0_6_73n_real_execution_go_no_go_review",
    result: passed ? "COMPLETED_VALIDATED" : "BLOCKED",
    passed,
    check_count: results.length,
    failed_count: errors.length,
    go_no_go_decision: "NO_GO",
    no_go_reason: "remote_not_synced_and_exact_active_delegate_authorization_missing",
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
    next_safe_task: "v0_6_73o_exact_real_execution_authorization_phrase_draft",
    errors,
    results
  };

  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
  process.exit(passed ? 0 : 1);
}

main();
