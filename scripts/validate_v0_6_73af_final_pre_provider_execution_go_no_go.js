#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const docPath = "docs/vcp_integration/V0_6_73AF_FINAL_PRE_PROVIDER_EXECUTION_GO_NO_GO.md";
const fixturePath = "tests/schema_examples/v0_6_73af_final_pre_provider_execution_go_no_go.example.yaml";
const failPath = "tests/schema_examples/v0_6_73af_final_pre_provider_execution_go_no_go_fail.example.yaml";
const aeDocPath = "docs/vcp_integration/V0_6_73AE_EXACT_EXECUTION_PHRASE_ACTIVE_FOR_EXECUTION_RECORD.md";
const adDocPath = "docs/vcp_integration/V0_6_73AD_REMOTE_SYNCED_FINAL_EXECUTION_PHRASE_ACTIVATION_REVIEW.md";

const requiredFiles = [docPath, fixturePath, failPath, aeDocPath, adDocPath];
const requiredTokens = [
  "phase: v0_6_73af_final_pre_provider_execution_go_no_go",
  "source_phase: v0_6_73ae_exact_execution_phrase_active_for_execution_record",
  "source_status: COMPLETED_VALIDATED_PHRASE_ACTIVE_PRE_PROVIDER_STOP",
  "result: COMPLETED_VALIDATED_FINAL_PRE_PROVIDER_NO_GO",
  "remote_synced_execution_contract_head: 7ef3b015a3b56ba6da161e9f2e2c8cc0aa4da0bd",
  "origin_master_head_at_review: 7ef3b015a3b56ba6da161e9f2e2c8cc0aa4da0bd",
  "local_head_at_review: 3cc70309e849f0990bcb9caf9e7ab5268d9fac3c",
  "current_ahead_behind_at_review: 0/3",
  "phrase_activation_record_remote_synced: false",
  "authorization_packet_id: AUTH-ACTIVE-V0-6-73U-BOUND-DELEGATE",
  "authorization_status: active_exact_human_authorized",
  "activation_record_id: ACT-AUTH-V0-6-73AA",
  "phrase_activation_record_id: ACT-PHRASE-V0-6-73AE",
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
  "authorization_phrase_active_for_execution: true",
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
  "secret_value_allowed: false",
  "env_file_content_read_allowed: false",
  "accepted_samples_write_allowed: false",
  "production_candidate_write_allowed: false",
  "DailyNote_write_allowed: false",
  "VCP_memory_write_allowed: false",
  "final_pre_provider_go_no_go_decision: NO_GO",
  "no_go_reason: phrase_activation_record_not_remote_synced",
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
  "next_safe_task: v0_6_73ag_push_phrase_activation_chain_and_post_push_verify"
];

const failTokens = [
  "phrase_activation_record_remote_synced: true",
  "authorization_packet_id: wrong_packet",
  "activation_preflight_id: wrong_preflight",
  "phrase_activation_record_id: wrong_phrase_record",
  "target_execution_phase: wrong_phase",
  "bridge_id: wrong_bridge",
  "delegate_id: wrong_delegate",
  "provider_binding_ref_redacted: false",
  "provider_binding_ref_is_secret: true",
  "active_delegate_authorization_actual: false",
  "exact_active_delegate_authorization_present: false",
  "authorization_phrase_provided: false",
  "authorization_phrase_active_for_execution: false",
  "final_pre_provider_go_no_go_decision: GO",
  "can_execute_now: true",
  "v0_6_73_execution_allowed: true",
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
  const aeDoc = read(aeDocPath);
  const adDoc = read(adDocPath);
  const joined = `${doc}\n${fixture}`;

  for (const token of requiredTokens) {
    addResult(`final_pre_provider_review_contains:${token}`, joined.includes(token), token);
  }
  for (const token of failTokens) {
    addResult(`fail_fixture_contains:${token}`, fail.includes(token), token);
  }

  addResult("source_ae_has_phrase_active_but_stop", aeDoc.includes("authorization_phrase_active_for_execution: true") &&
    aeDoc.includes("final_pre_provider_go_no_go_required: true") &&
    aeDoc.includes("can_execute_now: false"), aeDocPath);
  addResult("source_ad_allowed_phrase_activation", adDoc.includes("can_promote_exact_phrase_to_active_for_execution: true") &&
    adDoc.includes("v0_6_73_execution_allowed: false"), adDocPath);
  addResult("final_review_no_go_due_to_remote_sync", joined.includes("phrase_activation_record_remote_synced: false") &&
    joined.includes("final_pre_provider_go_no_go_decision: NO_GO") &&
    joined.includes("no_go_reason: phrase_activation_record_not_remote_synced"), "remote sync required");
  addResult("final_review_does_not_perform_side_effects", joined.includes("provider_contact_performed: false") &&
    joined.includes("plugin_call_performed: false") &&
    joined.includes("api_call_performed: false") &&
    joined.includes("image_generation_performed: false") &&
    joined.includes("output_write_performed: false") &&
    joined.includes("secret_value_read_performed: false") &&
    joined.includes("VCP_memory_write_performed: false"), "all side-effect flags false");

  const passed = errors.length === 0;
  const summary = {
    validator: "validate_v0_6_73af_final_pre_provider_execution_go_no_go",
    phase: "v0_6_73af_final_pre_provider_execution_go_no_go",
    result: passed ? "COMPLETED_VALIDATED_FINAL_PRE_PROVIDER_NO_GO" : "BLOCKED",
    passed,
    check_count: results.length,
    failed_count: errors.length,
    phrase_activation_record_remote_synced: false,
    active_delegate_authorization_actual: true,
    exact_active_delegate_authorization_present: true,
    authorization_phrase_provided: true,
    authorization_phrase_active_for_execution: true,
    final_pre_provider_go_no_go_decision: "NO_GO",
    no_go_reason: "phrase_activation_record_not_remote_synced",
    can_execute_now: false,
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
    next_safe_task: "v0_6_73ag_push_phrase_activation_chain_and_post_push_verify",
    errors,
    results
  };

  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
  process.exit(passed ? 0 : 1);
}

main();
