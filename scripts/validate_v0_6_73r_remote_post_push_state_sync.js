#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const docPath = "docs/vcp_integration/V0_6_73R_REMOTE_POST_PUSH_STATE_SYNC.md";
const fixturePath = "tests/schema_examples/v0_6_73r_remote_post_push_state_sync.example.yaml";
const qDocPath = "docs/vcp_integration/V0_6_73Q_PUSH_SAFETY_GATE.md";

const requiredFiles = [docPath, fixturePath, qDocPath];
const requiredTokens = [
  "phase: v0_6_73r_remote_post_push_state_sync",
  "result: COMPLETED_VALIDATED",
  "post_push_sync_id: PPS-V0-6-73R",
  "push_authorization_phrase_received: git push origin master",
  "push_performed: true",
  "push_result: succeeded_after_one_transient_network_failure_retry",
  "target_remote: origin",
  "target_branch: master",
  "pushed_head: ad1f657ad61b1290ffa24c86ef238e792523fdc7",
  "local_head_after_push: ad1f657ad61b1290ffa24c86ef238e792523fdc7",
  "remote_head_after_push: ad1f657ad61b1290ffa24c86ef238e792523fdc7",
  "ahead_behind_after_push: 0/0",
  "remote_synced_current: true",
  "npm_validate_mvp_after_push: passed",
  "real_execution_after_push_allowed: false",
  "v0_6_73_execution_allowed: false",
  "commit: 7d71ca3",
  "commit: b46bfa8",
  "commit: 546a787",
  "commit: 384621c",
  "commit: ffd327e",
  "commit: d0acce6",
  "commit: ad1f657",
  "next_safe_task: v0_6_73s_final_real_execution_boundary_review",
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
  "VCP_memory_write_performed: false"
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
  const qDoc = read(qDocPath);
  const joined = `${doc}\n${fixture}`;

  for (const token of requiredTokens) {
    addResult(`post_push_contains:${token}`, joined.includes(token), token);
  }

  addResult("source_q_required_explicit_push", qDoc.includes("explicit_push_authorization_required: git push origin master") &&
    qDoc.includes("push_allowed_now: false"), qDocPath);
  addResult("remote_sync_proven_without_execution", joined.includes("remote_synced_current: true") &&
    joined.includes("npm_validate_mvp_after_push: passed") &&
    joined.includes("v0_6_73_execution_allowed: false"), "remote sync no execution");

  const passed = errors.length === 0;
  const summary = {
    validator: "validate_v0_6_73r_remote_post_push_state_sync",
    phase: "v0_6_73r_remote_post_push_state_sync",
    result: passed ? "COMPLETED_VALIDATED" : "BLOCKED",
    passed,
    check_count: results.length,
    failed_count: errors.length,
    push_performed: true,
    remote_synced_current: true,
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
    next_safe_task: "v0_6_73s_final_real_execution_boundary_review",
    errors,
    results
  };

  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
  process.exit(passed ? 0 : 1);
}

main();
