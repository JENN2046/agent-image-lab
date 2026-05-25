#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const docPath = "docs/vcp_integration/V0_6_73AD_REMOTE_SYNCED_FINAL_EXECUTION_PHRASE_ACTIVATION_REVIEW.md";
const fixturePath = "tests/schema_examples/v0_6_73ad_remote_synced_final_execution_phrase_activation_review.example.yaml";
const failPath = "tests/schema_examples/v0_6_73ad_remote_synced_final_execution_phrase_activation_review_fail.example.yaml";
const aaDocPath = "docs/vcp_integration/V0_6_73AA_ACTIVE_DELEGATE_AUTHORIZATION_ACTIVATION_RECORD.md";
const abDocPath = "docs/vcp_integration/V0_6_73AB_POST_ACTIVATION_REAL_EXECUTION_GO_NO_GO_REVIEW.md";
const oDocPath = "docs/vcp_integration/V0_6_73O_EXACT_REAL_EXECUTION_AUTHORIZATION_PHRASE_DRAFT.md";

const requiredFiles = [docPath, fixturePath, failPath, aaDocPath, abDocPath, oDocPath];
const requiredTokens = [
  "phase: v0_6_73ad_remote_synced_final_execution_phrase_activation_review",
  "source_phase: v0_6_73ac_push_active_delegate_activation_and_post_activation_review",
  "source_status: COMPLETED_VALIDATED_REMOTE_SYNCED",
  "result: COMPLETED_VALIDATED_PHRASE_ACTIVATION_ALLOWED_NEXT_NOT_ACTIVE",
  "remote_synced_execution_contract_head: 7ef3b015a3b56ba6da161e9f2e2c8cc0aa4da0bd",
  "origin_master_head_at_review: 7ef3b015a3b56ba6da161e9f2e2c8cc0aa4da0bd",
  "remote_synced_execution_contract_head_matches_origin_master: true",
  "current_local_head_at_review: d7f2dece65cb5dcb35851e0589e59f772593ab6a",
  "current_local_head_is_status_sync_only_ahead: true",
  "current_ahead_behind_at_review: 0/1",
  "npm_validate_mvp_after_push: passed",
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
  "can_promote_exact_phrase_to_active_for_execution: true",
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
  "phrase_activation_review_decision: ALLOW_NEXT_EXACT_ACTIVATION_RECORD",
  "phrase_activation_record_required_before_execution: true",
  "authorization_phrase_active_for_execution_after_this_review: false",
  "real_execution_go_no_go_decision: NO_GO_UNTIL_PHRASE_ACTIVATION_RECORD_AND_FINAL_PRE_PROVIDER_CHECK",
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
  "next_safe_task: v0_6_73ae_exact_execution_phrase_active_for_execution_record"
];

const failTokens = [
  "remote_synced_execution_contract_head_matches_origin_master: false",
  "authorization_packet_id: wrong_packet",
  "activation_preflight_id: wrong_preflight",
  "target_execution_phase: wrong_phase",
  "bridge_id: wrong_bridge",
  "delegate_id: wrong_delegate",
  "provider_binding_ref_redacted: false",
  "provider_binding_ref_is_secret: true",
  "active_delegate_authorization_actual: false",
  "exact_active_delegate_authorization_present: false",
  "authorization_phrase_provided: false",
  "authorization_phrase_active_for_execution: true",
  "can_promote_exact_phrase_to_active_for_execution: false",
  "phrase_activation_review_decision: BLOCK",
  "authorization_phrase_active_for_execution_after_this_review: true",
  "real_execution_go_no_go_decision: GO",
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
  const aaDoc = read(aaDocPath);
  const abDoc = read(abDocPath);
  const oDoc = read(oDocPath);
  const joined = `${doc}\n${fixture}`;

  for (const token of requiredTokens) {
    addResult(`activation_review_contains:${token}`, joined.includes(token), token);
  }
  for (const token of failTokens) {
    addResult(`fail_fixture_contains:${token}`, fail.includes(token), token);
  }

  addResult("source_aa_records_active_delegate_actual", aaDoc.includes("active_delegate_authorization_actual: true") &&
    aaDoc.includes("exact_active_delegate_authorization_present: true") &&
    aaDoc.includes("authorization_phrase_provided: true"), aaDocPath);
  addResult("source_ab_was_no_go_before_remote_sync", abDoc.includes("real_execution_go_no_go_decision: NO_GO") &&
    abDoc.includes("local_activation_commit_remote_synced: false"), abDocPath);
  addResult("source_phrase_draft_has_exact_execution_phrase", oDoc.includes("v0_6_73_real_vcp_agent_generation_execution_one_shot") &&
    oDoc.includes("max_provider_calls=1") &&
    oDoc.includes("no secret value exposure"), oDocPath);
  addResult("review_allows_next_activation_but_not_execution", joined.includes("can_promote_exact_phrase_to_active_for_execution: true") &&
    joined.includes("authorization_phrase_active_for_execution_after_this_review: false") &&
    joined.includes("can_execute_now: false") &&
    joined.includes("v0_6_73_execution_allowed: false"), "activation allowed next, execution remains closed");
  addResult("review_does_not_perform_side_effects", joined.includes("provider_contact_performed: false") &&
    joined.includes("plugin_call_performed: false") &&
    joined.includes("api_call_performed: false") &&
    joined.includes("image_generation_performed: false") &&
    joined.includes("output_write_performed: false") &&
    joined.includes("secret_value_read_performed: false") &&
    joined.includes("VCP_memory_write_performed: false"), "all side-effect flags false");

  const passed = errors.length === 0;
  const summary = {
    validator: "validate_v0_6_73ad_remote_synced_final_execution_phrase_activation_review",
    phase: "v0_6_73ad_remote_synced_final_execution_phrase_activation_review",
    result: passed ? "COMPLETED_VALIDATED_PHRASE_ACTIVATION_ALLOWED_NEXT_NOT_ACTIVE" : "BLOCKED",
    passed,
    check_count: results.length,
    failed_count: errors.length,
    remote_synced_execution_contract_head_matches_origin_master: true,
    active_delegate_authorization_actual: true,
    exact_active_delegate_authorization_present: true,
    authorization_phrase_provided: true,
    authorization_phrase_active_for_execution: false,
    can_promote_exact_phrase_to_active_for_execution: true,
    authorization_phrase_active_for_execution_after_this_review: false,
    can_execute_now: false,
    real_execution_go_no_go_decision: "NO_GO_UNTIL_PHRASE_ACTIVATION_RECORD_AND_FINAL_PRE_PROVIDER_CHECK",
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
    next_safe_task: "v0_6_73ae_exact_execution_phrase_active_for_execution_record",
    errors,
    results
  };

  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
  process.exit(passed ? 0 : 1);
}

main();
