#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const docPath = "docs/vcp_integration/V0_6_73S_FINAL_REAL_EXECUTION_BOUNDARY_REVIEW.md";
const fixturePath = "tests/schema_examples/v0_6_73s_final_real_execution_boundary_review.example.yaml";
const rDocPath = "docs/vcp_integration/V0_6_73R_REMOTE_POST_PUSH_STATE_SYNC.md";
const oDocPath = "docs/vcp_integration/V0_6_73O_EXACT_REAL_EXECUTION_AUTHORIZATION_PHRASE_DRAFT.md";

const requiredFiles = [docPath, fixturePath, rDocPath, oDocPath];
const requiredTokens = [
  "phase: v0_6_73s_final_real_execution_boundary_review",
  "result: COMPLETED_VALIDATED",
  "final_boundary_review_id: FBR-V0-6-73S",
  "target_execution_phase: v0_6_73_real_vcp_agent_generation_execution_one_shot",
  "source_remote_post_push_sync_ref: docs/vcp_integration/V0_6_73R_REMOTE_POST_PUSH_STATE_SYNC.md",
  "source_push_safety_gate_ref: docs/vcp_integration/V0_6_73Q_PUSH_SAFETY_GATE.md",
  "source_authorization_phrase_ref: docs/vcp_integration/V0_6_73O_EXACT_REAL_EXECUTION_AUTHORIZATION_PHRASE_DRAFT.md",
  "source_go_no_go_review_ref: docs/vcp_integration/V0_6_73N_REAL_EXECUTION_GO_NO_GO_REVIEW.md",
  "remote_synced_at_pushed_head: true",
  "pushed_head: ad1f657ad61b1290ffa24c86ef238e792523fdc7",
  "local_status_sync_commit: f6f20e9a2959603bc0b220a2376803b5f6a26c29",
  "local_ahead_after_status_sync: 1",
  "authorization_phrase_active: false",
  "exact_active_delegate_authorization_present: false",
  "final_real_execution_decision: NO_GO",
  "final_no_go_reason: exact_active_delegate_authorization_missing_and_authorization_phrase_inactive",
  "v0_6_73_execution_allowed: false",
  "one_shot_budget_confirmed_1_1_1_1_retry_0",
  "output_directory_collision_check_passed",
  "receipt_path_collision_check_passed",
  "review_handoff_path_collision_check_passed",
  "human_review_required_true",
  "review_console_required_true",
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
  "next_safe_task: stop_before_real_execution_until_exact_active_delegate_and_exact_human_authorization"
];

const stopConditions = [
  "exact_active_delegate_authorization_present_false",
  "authorization_phrase_active_false",
  "provider_contact_requested_without_final_GO",
  "plugin_call_requested_without_final_GO",
  "api_call_requested_without_final_GO",
  "image_generation_requested_without_final_GO",
  "output_write_requested_without_final_GO",
  "receipt_write_requested_without_final_GO",
  "review_handoff_write_requested_without_final_GO",
  "env_file_read_requested",
  "secret_value_requested",
  "auto_promotion_or_memory_write_requested"
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
  const rDoc = read(rDocPath);
  const oDoc = read(oDocPath);
  const joined = `${doc}\n${fixture}`;

  for (const token of requiredTokens) {
    addResult(`final_boundary_contains:${token}`, joined.includes(token), token);
  }
  for (const token of stopConditions) {
    addResult(`stop_condition:${token}`, doc.includes(token), token);
  }

  addResult("source_r_remote_synced_no_execution", rDoc.includes("remote_synced_current: true") &&
    rDoc.includes("v0_6_73_execution_allowed: false"), rDocPath);
  addResult("source_o_phrase_still_inactive", oDoc.includes("authorization_phrase_active: false") &&
    oDoc.includes("authorization_phrase_draft_only: true"), oDocPath);
  addResult("final_boundary_blocks_execution", joined.includes("final_real_execution_decision: NO_GO") &&
    joined.includes("exact_active_delegate_authorization_present: false") &&
    joined.includes("authorization_phrase_active: false") &&
    joined.includes("v0_6_73_execution_allowed: false"), "final NO_GO");

  const passed = errors.length === 0;
  const summary = {
    validator: "validate_v0_6_73s_final_real_execution_boundary_review",
    phase: "v0_6_73s_final_real_execution_boundary_review",
    result: passed ? "COMPLETED_VALIDATED" : "BLOCKED",
    passed,
    check_count: results.length,
    failed_count: errors.length,
    final_real_execution_decision: "NO_GO",
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
    next_safe_task: "stop_before_real_execution_until_exact_active_delegate_and_exact_human_authorization",
    errors,
    results
  };

  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
  process.exit(passed ? 0 : 1);
}

main();
