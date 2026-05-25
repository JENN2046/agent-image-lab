#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const docPath = "docs/vcp_integration/V0_6_73AA_ACTIVE_DELEGATE_AUTHORIZATION_ACTIVATION_RECORD.md";
const fixturePath = "tests/schema_examples/v0_6_73aa_active_delegate_authorization_activation_record.example.yaml";
const failPath = "tests/schema_examples/v0_6_73aa_active_delegate_authorization_activation_record_fail.example.yaml";
const oDocPath = "docs/vcp_integration/V0_6_73O_EXACT_REAL_EXECUTION_AUTHORIZATION_PHRASE_DRAFT.md";
const wCandidatePath = "tests/schema_examples/v0_6_73w_active_delegate_authorization_candidate.example.yaml";
const zDocPath = "docs/vcp_integration/V0_6_73Z_REAL_EXECUTION_AUTHORIZATION_BOUNDARY_REVIEW.md";

const exactPhrase = "I authorize v0_6_73_real_vcp_agent_generation_execution_one_shot now, using the exact active NativeDoubao bound delegate authorization packet, with max_provider_calls=1, max_plugin_calls=1, max_api_calls=1, max_images_created=1, retry_limit=0, output_directory_ref=runs/real_generation/v0_6_73_real_vcp_agent_generation_one_shot/, receipt_ref=reports/provider_receipts/v0_6_73_real_vcp_agent_generation_one_shot_receipt.json, review_handoff_ref=review_console/live_receipt_bridge/v0_6_73_real_vcp_agent_generation_one_shot/bridge_entry.json, human_review_required=true, review_console_required=true, no secret value exposure, and no automatic accepted_samples, production_candidate, DailyNote, or VCP memory write.";

const requiredFiles = [docPath, fixturePath, failPath, oDocPath, wCandidatePath, zDocPath];
const requiredTokens = [
  "phase: v0_6_73aa_active_delegate_authorization_activation_record",
  "source_phase: v0_6_73z_real_execution_authorization_boundary_review",
  "source_status: COMPLETED_VALIDATED_FINAL_NO_GO",
  "result: COMPLETED_VALIDATED_ACTIVE_DELEGATE_AUTHORIZATION_ACTUAL",
  "authorization_packet_id: AUTH-ACTIVE-V0-6-73U-BOUND-DELEGATE",
  "authorization_status: active_exact_human_authorized",
  "activation_record_id: ACT-AUTH-V0-6-73AA",
  "activation_preflight_id: ACT-PREFLIGHT-V0-6-73U",
  "target_execution_phase: v0_6_73_real_vcp_agent_generation_execution_one_shot",
  "bridge_id: native_doubao_secretless_provider_runtime_bridge:v0_6_73h",
  "delegate_id: native_doubao_owner_runtime_delegate:v0_6_73_one_shot",
  "owner_process: VCPToolBox_or_owner_authorized_provider_runtime",
  "secret_owner_process: VCPToolBox_or_owner_authorized_provider_runtime",
  "provider_binding_ref: native_doubao:capability:owner-runtime:v0_6_73",
  "provider_binding_ref_redacted: true",
  "provider_binding_ref_is_secret: false",
  "delegate_binding_active: true",
  "active_delegate_authorization_actual: true",
  "exact_active_delegate_authorization_present: true",
  "authorization_phrase_provided: true",
  "authorization_phrase_active_for_execution: false",
  "final_go_no_go_review_required_after_activation: true",
  "pre_provider_contact_preflight_rerun_required: true",
  "can_execute_now: false",
  "real_execution_go_no_go_decision: NO_GO_PENDING_FINAL_REVIEW",
  "v0_6_73_execution_allowed: false",
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
  "next_safe_task: v0_6_73ab_post_activation_real_execution_go_no_go_review"
];

const failTokens = [
  "authorization_packet_id: wrong_packet",
  "activation_preflight_id: wrong_preflight",
  "target_execution_phase: wrong_phase",
  "bridge_id: wrong_bridge",
  "delegate_id: wrong_delegate",
  "provider_binding_ref_redacted: false",
  "provider_binding_ref_is_secret: true",
  "authorization_phrase_active_for_execution: true",
  "can_execute_now: true",
  "v0_6_73_execution_allowed: true",
  "max_provider_calls: 2",
  "retry_limit: 1",
  "secret_value_allowed: true",
  "env_file_content_read_allowed: true"
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
  const oDoc = read(oDocPath);
  const candidate = read(wCandidatePath);
  const zDoc = read(zDocPath);
  const joined = `${doc}\n${fixture}`;

  for (const token of requiredTokens) {
    addResult(`activation_record_contains:${token}`, joined.includes(token), token);
  }
  for (const token of failTokens) {
    addResult(`fail_fixture_contains:${token}`, fail.includes(token), token);
  }

  addResult("exact_phrase_matches_v0_6_73o", doc.includes(exactPhrase) && oDoc.includes(exactPhrase), "exact v0.6.73o phrase");
  addResult("source_candidate_was_active_shape", candidate.includes("authorization_status: active") &&
    candidate.includes("delegate_binding_active: true") &&
    candidate.includes("exact_active_delegate_authorization_present: true"), wCandidatePath);
  addResult("source_z_was_no_go_before_activation", zDoc.includes("real_execution_go_no_go_decision: NO_GO") &&
    zDoc.includes("active_delegate_authorization_actual: false"), zDocPath);
  addResult("activation_does_not_execute", joined.includes("active_delegate_authorization_actual: true") &&
    joined.includes("authorization_phrase_active_for_execution: false") &&
    joined.includes("can_execute_now: false") &&
    joined.includes("v0_6_73_execution_allowed: false"), "activation is not execution");

  const passed = errors.length === 0;
  const summary = {
    validator: "validate_v0_6_73aa_active_delegate_authorization_activation_record",
    phase: "v0_6_73aa_active_delegate_authorization_activation_record",
    result: passed ? "COMPLETED_VALIDATED_ACTIVE_DELEGATE_AUTHORIZATION_ACTUAL" : "BLOCKED",
    passed,
    check_count: results.length,
    failed_count: errors.length,
    active_delegate_authorization_actual: true,
    exact_active_delegate_authorization_present: true,
    authorization_phrase_provided: true,
    authorization_phrase_active_for_execution: false,
    can_execute_now: false,
    real_execution_go_no_go_decision: "NO_GO_PENDING_FINAL_REVIEW",
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
    next_safe_task: "v0_6_73ab_post_activation_real_execution_go_no_go_review",
    errors,
    results
  };

  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
  process.exit(passed ? 0 : 1);
}

main();
