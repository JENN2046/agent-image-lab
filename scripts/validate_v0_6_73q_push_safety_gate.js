#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const docPath = "docs/vcp_integration/V0_6_73Q_PUSH_SAFETY_GATE.md";
const fixturePath = "tests/schema_examples/v0_6_73q_push_safety_gate.example.yaml";
const pDocPath = "docs/vcp_integration/V0_6_73P_LOCAL_AGGREGATE_READINESS_REVIEW.md";

const requiredFiles = [docPath, fixturePath, pDocPath];
const pendingFiles = [
  ".agent_board/BLOCKERS.md",
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  "docs/vcp_integration/V0_6_73L_BOUND_DELEGATE_AUTHORIZATION_PACKET_DRAFT.md",
  "docs/vcp_integration/V0_6_73M_BOUND_DELEGATE_PREFLIGHT_VALIDATOR.md",
  "docs/vcp_integration/V0_6_73N_REAL_EXECUTION_GO_NO_GO_REVIEW.md",
  "docs/vcp_integration/V0_6_73O_EXACT_REAL_EXECUTION_AUTHORIZATION_PHRASE_DRAFT.md",
  "docs/vcp_integration/V0_6_73P_LOCAL_AGGREGATE_READINESS_REVIEW.md",
  "scripts/lib/governance_tooling_maintenance_slice.js",
  "scripts/validate_v0_6_73l_bound_delegate_authorization_packet_draft.js",
  "scripts/validate_v0_6_73m_bound_delegate_preflight_validator.js",
  "scripts/validate_v0_6_73n_real_execution_go_no_go_review.js",
  "scripts/validate_v0_6_73o_exact_real_execution_authorization_phrase_draft.js",
  "scripts/validate_v0_6_73p_local_aggregate_readiness_review.js",
  "tests/schema_examples/v0_6_73l_bound_delegate_authorization_packet_draft.example.yaml",
  "tests/schema_examples/v0_6_73m_bound_delegate_preflight_validator.example.yaml",
  "tests/schema_examples/v0_6_73m_bound_delegate_preflight_validator_fail.example.yaml",
  "tests/schema_examples/v0_6_73n_real_execution_go_no_go_review.example.yaml",
  "tests/schema_examples/v0_6_73o_exact_real_execution_authorization_phrase_draft.example.yaml",
  "tests/schema_examples/v0_6_73p_local_aggregate_readiness_review.example.yaml"
];

const requiredTokens = [
  "phase: v0_6_73q_push_safety_gate",
  "result: COMPLETED_VALIDATED",
  "push_safety_gate_id: PSG-V0-6-73Q",
  "target_remote: origin",
  "target_branch: master",
  "candidate_head_before_q_commit: d0acce6de7556f2aa6a878fb5751780cfe477d94",
  "remote_baseline_commit: 551ba04",
  "ahead_count_before_q_commit: 6",
  "behind_count_before_q_commit: 0",
  "working_tree_clean_before_q_commit: true",
  "staged_files_before_q_commit: 0",
  "push_performed: false",
  "push_allowed_now: false",
  "explicit_push_authorization_required: git push origin master",
  "push_recommendation: wait_for_explicit_git_push_origin_master",
  "post_push_required_phase_if_authorized: v0_6_73r_remote_post_push_state_sync",
  "real_execution_after_push_allowed: false",
  "v0_6_73_execution_allowed: false",
  "pending_file_count_before_q: 22",
  "fast_forward_expected: true",
  "docs_schema_fixture_validator_status_only: true",
  "package_json_changed: false",
  "dependency_lock_changed: false",
  "env_file_changed: false",
  "secret_file_changed: false",
  "generated_image_added: false",
  "runs_real_generation_added: false",
  "accepted_samples_changed: false",
  "production_candidate_changed: false",
  "provider_receipt_added: false",
  "review_handoff_added: false",
  "memory_file_changed: false",
  "output_artifact_added: false",
  "destructive_action_performed: false",
  "push_boundary_status: waiting_for_explicit_user_authorization",
  "verify_remote_head_matches_pushed_head",
  "verify_ahead_behind_0_0",
  "run_npm_validate_mvp_after_push",
  "run_v0_6_73r_remote_post_push_state_sync",
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
  "next_safe_task: wait_for_explicit_git_push_origin_master"
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
  const pDoc = read(pDocPath);
  const joined = `${doc}\n${fixture}`;

  for (const token of requiredTokens) {
    addResult(`push_safety_contains:${token}`, joined.includes(token), token);
  }
  for (const file of pendingFiles) {
    addResult(`pending_file_listed:${file}`, doc.includes(`  - ${file}`), file);
  }

  addResult("source_p_ready_only_for_push_safety", pDoc.includes("aggregate_decision: READY_FOR_PUSH_SAFETY_GATE_ONLY") &&
    pDoc.includes("real_execution_decision: NO_GO") &&
    pDoc.includes("next_safe_task: v0_6_73q_push_safety_gate"), pDocPath);
  addResult("push_boundary_requires_exact_user_phrase", joined.includes("push_allowed_now: false") &&
    joined.includes("explicit_push_authorization_required: git push origin master") &&
    joined.includes("next_safe_task: wait_for_explicit_git_push_origin_master"), "push boundary");
  addResult("forbidden_artifact_classes_all_false", [
    "package_json_changed: false",
    "dependency_lock_changed: false",
    "env_file_changed: false",
    "secret_file_changed: false",
    "generated_image_added: false",
    "runs_real_generation_added: false",
    "accepted_samples_changed: false",
    "production_candidate_changed: false",
    "provider_receipt_added: false",
    "review_handoff_added: false",
    "memory_file_changed: false",
    "output_artifact_added: false"
  ].every((token) => joined.includes(token)), "forbidden artifact classes");

  const passed = errors.length === 0;
  const summary = {
    validator: "validate_v0_6_73q_push_safety_gate",
    phase: "v0_6_73q_push_safety_gate",
    result: passed ? "COMPLETED_VALIDATED" : "BLOCKED",
    passed,
    check_count: results.length,
    failed_count: errors.length,
    push_allowed_now: false,
    push_recommendation: "wait_for_explicit_git_push_origin_master",
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
    next_safe_task: "wait_for_explicit_git_push_origin_master",
    errors,
    results
  };

  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
  process.exit(passed ? 0 : 1);
}

main();
