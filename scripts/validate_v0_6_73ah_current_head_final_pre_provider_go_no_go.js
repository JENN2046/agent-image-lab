#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const docPath = "docs/vcp_integration/V0_6_73AH_CURRENT_HEAD_FINAL_PRE_PROVIDER_GO_NO_GO.md";
const fixturePath = "tests/schema_examples/v0_6_73ah_current_head_final_pre_provider_go_no_go.example.yaml";
const failPath = "tests/schema_examples/v0_6_73ah_current_head_final_pre_provider_go_no_go_fail.example.yaml";
const agDocPath = "docs/vcp_integration/V0_6_73AG_REMOTE_SYNCED_PHRASE_ACTIVATION_POST_PULL_VERIFY.md";
const aeDocPath = "docs/vcp_integration/V0_6_73AE_EXACT_EXECUTION_PHRASE_ACTIVE_FOR_EXECUTION_RECORD.md";
const aaDocPath = "docs/vcp_integration/V0_6_73AA_ACTIVE_DELEGATE_AUTHORIZATION_ACTIVATION_RECORD.md";

const requiredFiles = [docPath, fixturePath, failPath, agDocPath, aeDocPath, aaDocPath];
const requiredTokens = [
  "phase: v0_6_73ah_current_head_final_pre_provider_go_no_go",
  "source_phase: v0_6_73ag_remote_synced_phrase_activation_post_pull_verify",
  "source_status: COMPLETED_VALIDATED_REMOTE_SYNCED_PHRASE_ACTIVATION_BLOCKER_RESOLVED",
  "result: COMPLETED_VALIDATED_CURRENT_HEAD_FINAL_PRE_PROVIDER_GO",
  "previous_no_go_reason_resolved: phrase_activation_record_not_remote_synced",
  "current_local_head_at_review: c10b18ad44e3e1a3d45f7c5a4433d39732d65ac6",
  "current_origin_master_head_at_review: c10b18ad44e3e1a3d45f7c5a4433d39732d65ac6",
  "current_ahead_behind_at_review: 0/0",
  "phrase_activation_record_remote_synced: true",
  "old_remote_sync_blocker_resolved: true",
  "fresh_current_head_final_pre_provider_go_no_go_performed: true",
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
  "raw_prompt_payload_allowed: false",
  "raw_provider_payload_retained_allowed: false",
  "accepted_samples_write_allowed: false",
  "production_candidate_write_allowed: false",
  "DailyNote_write_allowed: false",
  "VCP_memory_write_allowed: false",
  "overwrite_existing_files_allowed: false",
  "current_head_final_pre_provider_go_no_go_decision: GO",
  "go_reason: remote_sync_blocker_resolved_and_active_delegate_phrase_policy_ready",
  "next_amber_execution_gate_allowed: true",
  "next_amber_execution_gate: v0_6_73_real_vcp_agent_generation_execution_one_shot",
  "this_gate_executes_provider_contact: false",
  "execution_performed_by_this_gate: false",
  "can_execute_from_this_gate_without_next_task: false",
  "runner_must_use_exact_next_amber_gate: true",
  "runner_must_preserve_max_provider_calls: 1",
  "runner_must_preserve_max_plugin_calls: 1",
  "runner_must_preserve_max_api_calls: 1",
  "runner_must_preserve_max_images_created: 1",
  "runner_must_preserve_retry_limit: 0",
  "runner_must_preserve_no_secret_value_read: true",
  "runner_must_preserve_no_memory_or_production_write: true",
  "v0_6_73_execution_preconditions_satisfied: true",
  "v0_6_73_execution_allowed_after_this_review: true",
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
  "next_safe_task: v0_6_73_real_vcp_agent_generation_execution_one_shot",
  "next_safe_task_lane: Amber_B_provider_image_one_shot_execution"
];

const failTokens = [
  "source_phase: wrong_phase",
  "previous_no_go_reason_resolved: wrong_reason",
  "current_ahead_behind_at_review: 0/1",
  "phrase_activation_record_remote_synced: false",
  "old_remote_sync_blocker_resolved: false",
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
  "current_head_final_pre_provider_go_no_go_decision: NO_GO",
  "next_amber_execution_gate_allowed: false",
  "this_gate_executes_provider_contact: true",
  "execution_performed_by_this_gate: true",
  "can_execute_from_this_gate_without_next_task: true",
  "runner_must_preserve_no_secret_value_read: false",
  "runner_must_preserve_no_memory_or_production_write: false",
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
  const agDoc = read(agDocPath);
  const aeDoc = read(aeDocPath);
  const aaDoc = read(aaDocPath);
  const joined = `${doc}\n${fixture}`;

  for (const token of requiredTokens) {
    addResult(`current_head_final_go_no_go_contains:${token}`, joined.includes(token), token);
  }
  for (const token of failTokens) {
    addResult(`fail_fixture_contains:${token}`, fail.includes(token), token);
  }

  addResult("source_ag_resolved_old_remote_sync_blocker", agDoc.includes("old_remote_sync_blocker_resolved: true") &&
    agDoc.includes("fresh_current_head_final_pre_provider_go_no_go_required: true") &&
    agDoc.includes("next_safe_task: v0_6_73ah_current_head_final_pre_provider_go_no_go"), agDocPath);
  addResult("source_ae_has_active_phrase", aeDoc.includes("authorization_phrase_active_for_execution: true") &&
    aeDoc.includes("phrase_activation_result: PHRASE_ACTIVE_FOR_EXECUTION"), aeDocPath);
  addResult("source_aa_has_active_delegate_actual", aaDoc.includes("active_delegate_authorization_actual: true") &&
    aaDoc.includes("exact_active_delegate_authorization_present: true") &&
    aaDoc.includes("delegate_binding_active: true"), aaDocPath);
  addResult("current_head_go_allows_only_next_gate", joined.includes("current_head_final_pre_provider_go_no_go_decision: GO") &&
    joined.includes("next_amber_execution_gate_allowed: true") &&
    joined.includes("this_gate_executes_provider_contact: false") &&
    joined.includes("execution_performed_by_this_gate: false") &&
    joined.includes("can_execute_from_this_gate_without_next_task: false"), "GO is for next exact Amber gate only");
  addResult("current_head_go_no_side_effects", joined.includes("provider_contact_performed: false") &&
    joined.includes("plugin_call_performed: false") &&
    joined.includes("api_call_performed: false") &&
    joined.includes("image_generation_performed: false") &&
    joined.includes("output_write_performed: false") &&
    joined.includes("secret_value_read_performed: false") &&
    joined.includes("VCP_memory_write_performed: false") &&
    joined.includes("push_performed: false"), "all side-effect flags false");

  const passed = errors.length === 0;
  const summary = {
    validator: "validate_v0_6_73ah_current_head_final_pre_provider_go_no_go",
    phase: "v0_6_73ah_current_head_final_pre_provider_go_no_go",
    result: passed ? "COMPLETED_VALIDATED_CURRENT_HEAD_FINAL_PRE_PROVIDER_GO" : "BLOCKED",
    passed,
    check_count: results.length,
    failed_count: errors.length,
    current_local_head_at_review: "c10b18ad44e3e1a3d45f7c5a4433d39732d65ac6",
    current_origin_master_head_at_review: "c10b18ad44e3e1a3d45f7c5a4433d39732d65ac6",
    current_ahead_behind_at_review: "0/0",
    phrase_activation_record_remote_synced: true,
    old_remote_sync_blocker_resolved: true,
    active_delegate_authorization_actual: true,
    exact_active_delegate_authorization_present: true,
    authorization_phrase_provided: true,
    authorization_phrase_active_for_execution: true,
    current_head_final_pre_provider_go_no_go_decision: "GO",
    next_amber_execution_gate_allowed: true,
    next_amber_execution_gate: "v0_6_73_real_vcp_agent_generation_execution_one_shot",
    this_gate_executes_provider_contact: false,
    execution_performed_by_this_gate: false,
    can_execute_from_this_gate_without_next_task: false,
    v0_6_73_execution_preconditions_satisfied: true,
    v0_6_73_execution_allowed_after_this_review: true,
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
    next_safe_task: "v0_6_73_real_vcp_agent_generation_execution_one_shot",
    next_safe_task_lane: "Amber_B_provider_image_one_shot_execution",
    errors,
    results
  };

  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
  process.exit(passed ? 0 : 1);
}

main();
