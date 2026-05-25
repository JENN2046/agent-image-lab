#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const docPath = "docs/vcp_integration/V0_6_73L_BOUND_DELEGATE_AUTHORIZATION_PACKET_DRAFT.md";
const fixturePath = "tests/schema_examples/v0_6_73l_bound_delegate_authorization_packet_draft.example.yaml";
const iDocPath = "docs/vcp_integration/V0_6_73I_EXACT_BRIDGE_DELEGATE_AUTHORIZATION_OR_STOP_BEFORE_REAL_EXECUTION_RETRY.md";

const requiredFiles = [docPath, fixturePath, iDocPath];
const requiredTokens = [
  "phase: v0_6_73l_bound_delegate_authorization_packet_draft",
  "result: COMPLETED_VALIDATED",
  "authorization_packet_id: AUTH-DRAFT-V0-6-73L-BOUND-DELEGATE",
  "authorization_status: draft_not_active",
  "delegate_binding_active: false",
  "can_execute_now: false",
  "requires_future_explicit_human_activation: true",
  "target_execution_phase: v0_6_73_real_vcp_agent_generation_execution_one_shot",
  "bridge_id: native_doubao_secretless_provider_runtime_bridge:v0_6_73h",
  "delegate_id: native_doubao_owner_runtime_delegate:v0_6_73_one_shot",
  "delegate_authorization_ref: docs/vcp_integration/V0_6_73L_BOUND_DELEGATE_AUTHORIZATION_PACKET_DRAFT.md",
  "delegate_authorization_status_when_active: authorized_by_exact_bound_delegate_authorization_packet",
  "owner_process: VCPToolBox_or_owner_authorized_provider_runtime",
  "secret_owner_process: VCPToolBox_or_owner_authorized_provider_runtime",
  "provider_binding_ref: native_doubao:capability:owner-runtime:v0_6_73",
  "provider_binding_ref_redacted: true",
  "provider_binding_ref_is_secret: false",
  "selected_route: NativeDoubaoImage_one_shot_project_plugin",
  "selected_plugin_id: NativeDoubaoImage",
  "provider_id: NativeDoubaoImage",
  "model: doubao-seedream-5-0-260128",
  "prompt_package_ref: prompts/image_generation/neutral_smoke_test_red_apple_v1.yaml",
  "output_directory_ref: runs/real_generation/v0_6_73_real_vcp_agent_generation_one_shot/",
  "receipt_ref: reports/provider_receipts/v0_6_73_real_vcp_agent_generation_one_shot_receipt.json",
  "review_handoff_ref: review_console/live_receipt_bridge/v0_6_73_real_vcp_agent_generation_one_shot/bridge_entry.json",
  "max_provider_calls: 1",
  "max_plugin_calls: 1",
  "max_api_calls: 1",
  "max_images_created: 1",
  "retry_limit: 0",
  "overwrite_existing_files_allowed: false",
  "raw_prompt_payload_allowed: false",
  "raw_provider_payload_retained_allowed: false",
  "secret_value_allowed: false",
  "env_file_content_read_allowed: false",
  "private_absolute_path_allowed: false",
  "accepted_samples_write_allowed: false",
  "production_candidate_write_allowed: false",
  "DailyNote_write_allowed: false",
  "VCP_memory_write_allowed: false",
  "human_review_required: true",
  "review_console_required: true",
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
  "v0_6_73_execution_allowed: false",
  "next_safe_task: v0_6_73m_bound_delegate_preflight_validator"
];

const requiredStopConditions = [
  "authorization_status_not_active",
  "delegate_binding_active_false",
  "delegate_id_mismatch",
  "bridge_id_mismatch",
  "provider_binding_ref_not_redacted",
  "secret_value_required",
  "env_file_read_required",
  "output_directory_not_exact",
  "receipt_path_not_exact",
  "review_handoff_path_not_exact",
  "budget_exceeded",
  "retry_requested",
  "raw_prompt_payload_requested",
  "raw_provider_payload_retention_requested",
  "private_absolute_path_requested",
  "overwrite_existing_files_requested",
  "human_review_gate_missing"
];

const requiredSecretlessProofTokens = [
  "provider_binding_ref_is_capability_handle: true",
  "provider_binding_ref_redacted_in_agent_image_lab: true",
  "secret_value_transferred_to_agent_image_lab: false",
  "env_file_content_read_by_agent_image_lab: false",
  "raw_provider_payload_retained_by_agent_image_lab: false",
  "bridge_delegate_must_be_controlled_marker: true",
  "bound_delegate_requires_exact_authorization: true",
  "arbitrary_runtime_function_allowed: false"
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

  const joined = `${read(docPath)}\n${read(fixturePath)}`;
  for (const token of requiredTokens) {
    addResult(`packet_contains:${token}`, joined.includes(token), token);
  }
  for (const token of requiredStopConditions) {
    addResult(`stop_condition:${token}`, joined.includes(token), token);
  }
  for (const token of requiredSecretlessProofTokens) {
    addResult(`secretless_proof:${token}`, joined.includes(token), token);
  }

  addResult("authorization_packet_is_draft_inactive", joined.includes("authorization_status: draft_not_active") &&
    joined.includes("delegate_binding_active: false") &&
    joined.includes("can_execute_now: false"), "draft inactive");
  addResult("one_shot_budget_locked", joined.includes("max_provider_calls: 1") &&
    joined.includes("max_plugin_calls: 1") &&
    joined.includes("max_api_calls: 1") &&
    joined.includes("max_images_created: 1") &&
    joined.includes("retry_limit: 0"), "one-shot budget");
  addResult("paths_are_project_relative_and_exact", joined.includes("output_directory_ref: runs/real_generation/v0_6_73_real_vcp_agent_generation_one_shot/") &&
    joined.includes("receipt_ref: reports/provider_receipts/v0_6_73_real_vcp_agent_generation_one_shot_receipt.json") &&
    joined.includes("review_handoff_ref: review_console/live_receipt_bridge/v0_6_73_real_vcp_agent_generation_one_shot/bridge_entry.json"), "exact refs");
  addResult("no_secret_or_raw_payload_allowed", joined.includes("secret_value_allowed: false") &&
    joined.includes("env_file_content_read_allowed: false") &&
    joined.includes("raw_prompt_payload_allowed: false") &&
    joined.includes("raw_provider_payload_retained_allowed: false") &&
    joined.includes("private_absolute_path_allowed: false"), "secretless boundaries");
  addResult("i_gate_still_documents_arbitrary_runtime_block", read(iDocPath).includes("arbitrary_runtime_function_allowed: false") &&
    read(iDocPath).includes("bound_delegate_without_exact_authorization_allowed: false"), iDocPath);

  const passed = errors.length === 0;
  const summary = {
    validator: "validate_v0_6_73l_bound_delegate_authorization_packet_draft",
    phase: "v0_6_73l_bound_delegate_authorization_packet_draft",
    result: passed ? "COMPLETED_VALIDATED" : "BLOCKED",
    passed,
    check_count: results.length,
    failed_count: errors.length,
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
    next_safe_task: "v0_6_73m_bound_delegate_preflight_validator",
    errors,
    results
  };

  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
  process.exit(passed ? 0 : 1);
}

main();
