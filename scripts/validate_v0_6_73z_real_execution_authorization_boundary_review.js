#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const docPath = "docs/vcp_integration/V0_6_73Z_REAL_EXECUTION_AUTHORIZATION_BOUNDARY_REVIEW.md";
const fixturePath = "tests/schema_examples/v0_6_73z_real_execution_authorization_boundary_review.example.yaml";
const vDocPath = "docs/vcp_integration/V0_6_73V_EXACT_ACTIVE_DELEGATE_AUTHORIZATION_PACKET_DRAFT.md";
const wDocPath = "docs/vcp_integration/V0_6_73W_ACTIVE_DELEGATE_AUTHORIZATION_VALIDATOR.md";
const xDocPath = "docs/vcp_integration/V0_6_73X_FINAL_LOCAL_READINESS_STOP_LINE_REVIEW.md";
const cDocPath = "docs/vcp_integration/V0_6_73C_SECRETLESS_PROVIDER_RECEIPT_CONTRACT.md";
const dDocPath = "docs/vcp_integration/V0_6_73D_REAL_GENERATION_REVIEW_HANDOFF_CONTRACT.md";
const eDocPath = "docs/vcp_integration/V0_6_73E_ONE_SHOT_EXECUTION_READINESS_PACKET.md";

const requiredFiles = [docPath, fixturePath, vDocPath, wDocPath, xDocPath, cDocPath, dDocPath, eDocPath];
const requiredTokens = [
  "phase: v0_6_73z_real_execution_authorization_boundary_review",
  "source_phase: v0_6_73y_remote_post_push_stop_line_sync",
  "source_status: COMPLETED_VALIDATED_remote_synced_stop_line_preserved",
  "result: COMPLETED_VALIDATED_FINAL_NO_GO",
  "pushed_readiness_head: 213a4e52a97d0b5b19dae52dfda7c142df37ebc6",
  "origin_master_head_at_review: 213a4e52a97d0b5b19dae52dfda7c142df37ebc6",
  "pushed_readiness_head_remote_synced: true",
  "local_head_at_review: 1ba7aee089c1faae299685c8e10ea7e2fe180c9c",
  "local_status_sync_commit_unpushed: true",
  "current_ahead_behind_at_review: 0/1",
  "mvp_passed: true",
  "stop_line_id: STOP-LINE-V0-6-73X",
  "stop_line_still_effective: true",
  "remote_synced_for_pushed_readiness_head: true",
  "current_local_head_synced_to_remote: false",
  "active_delegate_authorization_actual: false",
  "exact_active_delegate_authorization_present: false",
  "authorization_phrase_active: false",
  "receipt_policy_ready: true",
  "output_directory_policy_ready: true",
  "review_handoff_policy_ready: true",
  "secretless_proof_ready: true",
  "real_execution_go_no_go_decision: NO_GO",
  "no_go_reason: exact_active_delegate_authorization_missing_and_authorization_phrase_inactive",
  "v0_6_73_execution_allowed: false",
  "next_safe_task: stop_and_wait_for_exact_real_execution_authorization",
  "required_exact_phase_name_before_real_execution: v0_6_73_real_vcp_agent_generation_execution_one_shot",
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
  "push_performed_in_this_phase: false"
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
  const vDoc = read(vDocPath);
  const wDoc = read(wDocPath);
  const xDoc = read(xDocPath);
  const cDoc = read(cDocPath);
  const dDoc = read(dDocPath);
  const eDoc = read(eDocPath);
  const joined = `${doc}\n${fixture}`;

  for (const token of requiredTokens) {
    addResult(`boundary_review_contains:${token}`, joined.includes(token), token);
  }

  addResult("source_v_remains_draft_not_active", vDoc.includes("authorization_status: draft_not_active") &&
    vDoc.includes("can_execute_now: false"), vDocPath);
  addResult("source_w_remains_fail_closed", wDoc.includes("current_validator_decision: FAIL_CLOSED_DRAFT_NOT_ACTIVE") &&
    wDoc.includes("candidate_active_shape_activates_execution_now: false"), wDocPath);
  addResult("source_x_stop_line_still_blocks_execution", xDoc.includes("stop_line_reached: true") &&
    xDoc.includes("next_green_autopilot_phase_allowed: false"), xDocPath);
  addResult("receipt_policy_still_present", cDoc.includes("future_receipt_path_under_provider_receipts: true") ||
    cDoc.includes("receipt_ref: reports/provider_receipts/v0_6_73_real_vcp_agent_generation_one_shot_receipt.json"), cDocPath);
  addResult("review_handoff_policy_still_present", dDoc.includes("future_review_handoff_ref: review_console/live_receipt_bridge/v0_6_73_real_vcp_agent_generation_one_shot/bridge_entry.json"), dDocPath);
  addResult("one_shot_output_policy_still_present", eDoc.includes("output_directory_ref: runs/real_generation/v0_6_73_real_vcp_agent_generation_one_shot/") &&
    eDoc.includes("review_handoff_contract_present: true"), eDocPath);

  const passed = errors.length === 0;
  const summary = {
    validator: "validate_v0_6_73z_real_execution_authorization_boundary_review",
    phase: "v0_6_73z_real_execution_authorization_boundary_review",
    result: passed ? "COMPLETED_VALIDATED_FINAL_NO_GO" : "BLOCKED",
    passed,
    check_count: results.length,
    failed_count: errors.length,
    pushed_readiness_head_remote_synced: true,
    current_local_head_synced_to_remote: false,
    active_delegate_authorization_actual: false,
    exact_active_delegate_authorization_present: false,
    authorization_phrase_active: false,
    receipt_policy_ready: true,
    output_directory_policy_ready: true,
    review_handoff_policy_ready: true,
    real_execution_go_no_go_decision: "NO_GO",
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
    push_performed_in_this_phase: false,
    v0_6_73_execution_allowed: false,
    next_safe_task: "stop_and_wait_for_exact_real_execution_authorization",
    errors,
    results
  };

  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
  process.exit(passed ? 0 : 1);
}

main();
