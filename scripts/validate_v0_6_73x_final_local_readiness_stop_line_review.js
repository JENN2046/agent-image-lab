#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const docPath = "docs/vcp_integration/V0_6_73X_FINAL_LOCAL_READINESS_STOP_LINE_REVIEW.md";
const fixturePath = "tests/schema_examples/v0_6_73x_final_local_readiness_stop_line_review.example.yaml";
const wDocPath = "docs/vcp_integration/V0_6_73W_ACTIVE_DELEGATE_AUTHORIZATION_VALIDATOR.md";

const requiredFiles = [docPath, fixturePath, wDocPath];
const requiredTokens = [
  "phase: v0_6_73x_final_local_readiness_stop_line_review",
  "source_phase: v0_6_73w_active_delegate_authorization_validator",
  "source_status: COMPLETED_VALIDATED_fail_closed_validator_only",
  "result: COMPLETED_VALIDATED_STOP_LINE_REACHED",
  "local_chain_head_before_x: f7962f8",
  "origin_master_head: ad1f657ad61b1290ffa24c86ef238e792523fdc7",
  "local_ahead_count_before_x: 7",
  "latest_completed_phase: v0_6_73w_active_delegate_authorization_validator",
  "latest_validator_decision: FAIL_CLOSED_DRAFT_NOT_ACTIVE",
  "candidate_active_shape_validates: true",
  "candidate_active_shape_activates_execution_now: false",
  "stop_line_id: STOP-LINE-V0-6-73X",
  "stop_line_reached: true",
  "stop_reason: next_meaningful_actions_are_push_or_real_execution_authorization",
  "next_green_autopilot_phase_allowed: false",
  "push_requires_exact_user_phrase: git push origin master",
  "real_execution_requires_exact_phase_authorization: v0_6_73_real_vcp_agent_generation_execution_one_shot",
  "active_delegate_activation_requires_exact_human_authorization: true",
  "provider_contact_allowed_now: false",
  "image_generation_allowed_now: false",
  "id: push_local_readiness_chain",
  "id: stop_without_push",
  "id: request_exact_active_delegate_activation",
  "id: request_real_execution",
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
  "next_safe_task: stop_and_wait_for_human_boundary_decision"
];

const completedPhases = [
  "v0_6_73r_remote_post_push_state_sync",
  "v0_6_73s_final_real_execution_boundary_review",
  "v0_6_73t_next_phase_selection_gate",
  "v0_6_73u_active_delegate_authorization_activation_preflight",
  "v0_6_73u3_runtime_delegate_binding_test_harness_no_provider",
  "v0_6_73v_exact_active_delegate_authorization_packet_draft",
  "v0_6_73w_active_delegate_authorization_validator"
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
  const wDoc = read(wDocPath);
  const joined = `${doc}\n${fixture}`;

  for (const token of requiredTokens) {
    addResult(`stop_line_contains:${token}`, joined.includes(token), token);
  }
  for (const phase of completedPhases) {
    addResult(`completed_phase_listed:${phase}`, doc.includes(phase), phase);
  }

  addResult("source_w_fail_closed", wDoc.includes("current_validator_decision: FAIL_CLOSED_DRAFT_NOT_ACTIVE") &&
    wDoc.includes("next_safe_task: v0_6_73x_final_local_readiness_stop_line_review"), wDocPath);
  addResult("stop_line_blocks_green_continuation", joined.includes("next_green_autopilot_phase_allowed: false") &&
    joined.includes("next_safe_task: stop_and_wait_for_human_boundary_decision"), "stop line");
  addResult("stop_line_blocks_execution", joined.includes("provider_contact_allowed_now: false") &&
    joined.includes("image_generation_allowed_now: false") &&
    joined.includes("v0_6_73_execution_allowed: false"), "execution blocked");

  const passed = errors.length === 0;
  const summary = {
    validator: "validate_v0_6_73x_final_local_readiness_stop_line_review",
    phase: "v0_6_73x_final_local_readiness_stop_line_review",
    result: passed ? "COMPLETED_VALIDATED_STOP_LINE_REACHED" : "BLOCKED",
    passed,
    check_count: results.length,
    failed_count: errors.length,
    stop_line_reached: true,
    next_green_autopilot_phase_allowed: false,
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
    next_safe_task: "stop_and_wait_for_human_boundary_decision",
    errors,
    results
  };

  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
  process.exit(passed ? 0 : 1);
}

main();
