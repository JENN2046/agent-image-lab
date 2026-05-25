#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const docPath = "docs/vcp_integration/V0_6_73T_NEXT_PHASE_SELECTION_GATE.md";
const fixturePath = "tests/schema_examples/v0_6_73t_next_phase_selection_gate.example.yaml";
const sDocPath = "docs/vcp_integration/V0_6_73S_FINAL_REAL_EXECUTION_BOUNDARY_REVIEW.md";

const requiredFiles = [docPath, fixturePath, sDocPath];
const requiredTokens = [
  "phase: v0_6_73t_next_phase_selection_gate",
  "source_phase: v0_6_73s_final_real_execution_boundary_review",
  "source_status: COMPLETED_VALIDATED_final_NO_GO",
  "result: COMPLETED_VALIDATED",
  "local_head_before_selection_gate: 747857301938f2ae5ac32704e754e48728151b7c",
  "origin_master_head: ad1f657ad61b1290ffa24c86ef238e792523fdc7",
  "local_ahead_count: 2",
  "remote_push_deferred_by_user: true",
  "final_real_execution_decision: NO_GO",
  "exact_active_delegate_authorization_present: false",
  "authorization_phrase_active: false",
  "v0_6_73_execution_allowed: false",
  "id: v0_6_73u_active_delegate_authorization_activation_preflight",
  "id: v0_6_73u2_push_local_status_sync_commits",
  "id: v0_6_73u3_runtime_delegate_binding_test_harness_no_provider",
  "id: v0_6_73u4_stop_and_wait_for_human_real_execution_decision",
  "recommended_next_phase: v0_6_73u_active_delegate_authorization_activation_preflight",
  "selected_by_default_for_autopilot: true",
  "requires_push_before_start: false",
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
  "next_safe_task: v0_6_73u_active_delegate_authorization_activation_preflight"
];

const stopConditions = [
  "request_to_push_without_exact_git_push_origin_master",
  "request_to_execute_v0_6_73_real_generation_without_active_delegate_and_active_phrase",
  "provider_contact_requested_in_selection_gate",
  "plugin_call_requested_in_selection_gate",
  "api_call_requested_in_selection_gate",
  "image_generation_requested_in_selection_gate",
  "image_binary_read_requested_in_selection_gate",
  "output_write_requested_in_selection_gate",
  "env_file_read_requested_in_selection_gate",
  "secret_value_requested_in_selection_gate"
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
  const sDoc = read(sDocPath);
  const joined = `${doc}\n${fixture}`;

  for (const token of requiredTokens) {
    addResult(`selection_gate_contains:${token}`, joined.includes(token), token);
  }
  for (const token of stopConditions) {
    addResult(`stop_condition:${token}`, doc.includes(token), token);
  }

  addResult("source_s_final_boundary_no_go", sDoc.includes("final_real_execution_decision: NO_GO") &&
    sDoc.includes("exact_active_delegate_authorization_present: false") &&
    sDoc.includes("authorization_phrase_active: false") &&
    sDoc.includes("v0_6_73_execution_allowed: false"), sDocPath);
  addResult("selection_defaults_to_local_preflight_not_push", joined.includes("requires_push_before_start: false") &&
    joined.includes("remote_push_deferred_by_user: true") &&
    joined.includes("push_performed: false"), "selection no push");
  addResult("selection_blocks_real_execution", joined.includes("final_real_execution_decision: NO_GO") &&
    joined.includes("provider_contact_performed: false") &&
    joined.includes("image_generation_performed: false") &&
    joined.includes("v0_6_73_execution_allowed: false"), "selection boundary");

  const passed = errors.length === 0;
  const summary = {
    validator: "validate_v0_6_73t_next_phase_selection_gate",
    phase: "v0_6_73t_next_phase_selection_gate",
    result: passed ? "COMPLETED_VALIDATED" : "BLOCKED",
    passed,
    check_count: results.length,
    failed_count: errors.length,
    recommended_next_phase: "v0_6_73u_active_delegate_authorization_activation_preflight",
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
    errors,
    results
  };

  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
  process.exit(passed ? 0 : 1);
}

main();
