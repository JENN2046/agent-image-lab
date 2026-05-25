#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const docPath = "docs/vcp_integration/V0_6_73AB_POST_ACTIVATION_REAL_EXECUTION_GO_NO_GO_REVIEW.md";
const fixturePath = "tests/schema_examples/v0_6_73ab_post_activation_real_execution_go_no_go_review.example.yaml";
const failPath = "tests/schema_examples/v0_6_73ab_post_activation_real_execution_go_no_go_review_fail.example.yaml";
const aaDocPath = "docs/vcp_integration/V0_6_73AA_ACTIVE_DELEGATE_AUTHORIZATION_ACTIVATION_RECORD.md";
const zDocPath = "docs/vcp_integration/V0_6_73Z_REAL_EXECUTION_AUTHORIZATION_BOUNDARY_REVIEW.md";

const requiredFiles = [docPath, fixturePath, failPath, aaDocPath, zDocPath];
const requiredTokens = [
  "phase: v0_6_73ab_post_activation_real_execution_go_no_go_review",
  "source_phase: v0_6_73aa_active_delegate_authorization_activation_record",
  "source_status: COMPLETED_VALIDATED_ACTIVE_DELEGATE_AUTHORIZATION_ACTUAL",
  "result: COMPLETED_VALIDATED_NO_GO_POST_ACTIVATION",
  "source_local_activation_commit: 243fc2a08ea73d70e451ca9103289e0db6061f11",
  "origin_master_head_at_review: 0c2ab81c494c3637f45cfcc6eb4b887d32f52d2a",
  "current_ahead_behind_at_review: 0/1",
  "local_activation_commit_remote_synced: false",
  "authorization_packet_id: AUTH-ACTIVE-V0-6-73U-BOUND-DELEGATE",
  "authorization_status: active_exact_human_authorized",
  "activation_record_id: ACT-AUTH-V0-6-73AA",
  "activation_preflight_id: ACT-PREFLIGHT-V0-6-73U",
  "target_execution_phase: v0_6_73_real_vcp_agent_generation_execution_one_shot",
  "bridge_id: native_doubao_secretless_provider_runtime_bridge:v0_6_73h",
  "delegate_id: native_doubao_owner_runtime_delegate:v0_6_73_one_shot",
  "provider_binding_ref: native_doubao:capability:owner-runtime:v0_6_73",
  "provider_binding_ref_redacted: true",
  "provider_binding_ref_is_secret: false",
  "delegate_binding_active: true",
  "active_delegate_authorization_actual: true",
  "exact_active_delegate_authorization_present: true",
  "authorization_phrase_provided: true",
  "authorization_phrase_active_for_execution: false",
  "receipt_policy_ready: true",
  "output_directory_policy_ready: true",
  "review_handoff_policy_ready: true",
  "human_review_required: true",
  "review_console_required: true",
  "max_provider_calls: 1",
  "max_plugin_calls: 1",
  "max_api_calls: 1",
  "max_images_created: 1",
  "retry_limit: 0",
  "real_execution_go_no_go_decision: NO_GO",
  "no_go_reason: active_delegate_activation_commit_not_remote_synced_and_authorization_phrase_not_active_for_execution",
  "can_execute_now: false",
  "v0_6_73_execution_allowed: false",
  "runner_must_stop_before_provider_contact: true",
  "runner_must_stop_before_plugin_call: true",
  "runner_must_stop_before_api_call: true",
  "runner_must_stop_before_image_generation: true",
  "runner_must_stop_before_output_write: true",
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
  "next_safe_task: push_activation_record_then_repeat_final_go_no_go_or_activate_exact_execution_phrase_after_remote_sync"
];

const failTokens = [
  "local_activation_commit_remote_synced: true",
  "authorization_packet_id: wrong_packet",
  "activation_preflight_id: wrong_preflight",
  "target_execution_phase: wrong_phase",
  "bridge_id: wrong_bridge",
  "delegate_id: wrong_delegate",
  "provider_binding_ref_redacted: false",
  "provider_binding_ref_is_secret: true",
  "authorization_phrase_active_for_execution: true",
  "real_execution_go_no_go_decision: GO",
  "can_execute_now: true",
  "v0_6_73_execution_allowed: true",
  "runner_must_stop_before_provider_contact: false",
  "provider_contact_performed: true",
  "secret_value_read_performed: true"
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
  const fail = read(failPath);
  const aaDoc = read(aaDocPath);
  const zDoc = read(zDocPath);
  const joined = `${doc}\n${fixture}`;

  for (const token of requiredTokens) {
    addResult(`post_activation_review_contains:${token}`, joined.includes(token), token);
  }
  for (const token of failTokens) {
    addResult(`fail_fixture_contains:${token}`, fail.includes(token), token);
  }

  addResult("source_aa_records_active_delegate_actual", aaDoc.includes("active_delegate_authorization_actual: true") &&
    aaDoc.includes("exact_active_delegate_authorization_present: true") &&
    aaDoc.includes("authorization_phrase_active_for_execution: false") &&
    aaDoc.includes("can_execute_now: false"), aaDocPath);
  addResult("source_z_was_no_go_before_activation", zDoc.includes("real_execution_go_no_go_decision: NO_GO") &&
    zDoc.includes("exact_active_delegate_authorization_present: false"), zDocPath);
  addResult("review_keeps_execution_fail_closed", joined.includes("real_execution_go_no_go_decision: NO_GO") &&
    joined.includes("local_activation_commit_remote_synced: false") &&
    joined.includes("authorization_phrase_active_for_execution: false") &&
    joined.includes("v0_6_73_execution_allowed: false"), "post-activation review remains NO_GO");
  addResult("review_does_not_perform_side_effects", joined.includes("provider_contact_performed: false") &&
    joined.includes("plugin_call_performed: false") &&
    joined.includes("api_call_performed: false") &&
    joined.includes("image_generation_performed: false") &&
    joined.includes("output_write_performed: false") &&
    joined.includes("secret_value_read_performed: false") &&
    joined.includes("VCP_memory_write_performed: false"), "all side-effect flags false");

  const passed = errors.length === 0;
  const summary = {
    validator: "validate_v0_6_73ab_post_activation_real_execution_go_no_go_review",
    phase: "v0_6_73ab_post_activation_real_execution_go_no_go_review",
    result: passed ? "COMPLETED_VALIDATED_NO_GO_POST_ACTIVATION" : "BLOCKED",
    passed,
    check_count: results.length,
    failed_count: errors.length,
    local_activation_commit_remote_synced: false,
    active_delegate_authorization_actual: true,
    exact_active_delegate_authorization_present: true,
    authorization_phrase_provided: true,
    authorization_phrase_active_for_execution: false,
    can_execute_now: false,
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
    push_performed: false,
    v0_6_73_execution_allowed: false,
    next_safe_task: "push_activation_record_then_repeat_final_go_no_go_or_activate_exact_execution_phrase_after_remote_sync",
    errors,
    results
  };

  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
  process.exit(passed ? 0 : 1);
}

main();
