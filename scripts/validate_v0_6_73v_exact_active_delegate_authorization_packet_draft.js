#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const docPath = "docs/vcp_integration/V0_6_73V_EXACT_ACTIVE_DELEGATE_AUTHORIZATION_PACKET_DRAFT.md";
const fixturePath = "tests/schema_examples/v0_6_73v_exact_active_delegate_authorization_packet_draft.example.yaml";
const failFixturePath = "tests/schema_examples/v0_6_73v_exact_active_delegate_authorization_packet_draft_fail.example.yaml";
const uDocPath = "docs/vcp_integration/V0_6_73U_ACTIVE_DELEGATE_AUTHORIZATION_ACTIVATION_PREFLIGHT.md";
const u3DocPath = "docs/vcp_integration/V0_6_73U3_RUNTIME_DELEGATE_BINDING_TEST_HARNESS_NO_PROVIDER.md";

const requiredFiles = [docPath, fixturePath, failFixturePath, uDocPath, u3DocPath];
const requiredTokens = [
  "phase: v0_6_73v_exact_active_delegate_authorization_packet_draft",
  "source_phase: v0_6_73u3_runtime_delegate_binding_test_harness_no_provider",
  "source_status: COMPLETED_VALIDATED_no_provider_harness_passed",
  "result: COMPLETED_VALIDATED",
  "authorization_packet_id: AUTH-ACTIVE-V0-6-73U-BOUND-DELEGATE",
  "authorization_status: draft_not_active",
  "activation_preflight_id: ACT-PREFLIGHT-V0-6-73U",
  "target_execution_phase: v0_6_73_real_vcp_agent_generation_execution_one_shot",
  "source_activation_preflight_ref: docs/vcp_integration/V0_6_73U_ACTIVE_DELEGATE_AUTHORIZATION_ACTIVATION_PREFLIGHT.md",
  "source_no_provider_harness_ref: docs/vcp_integration/V0_6_73U3_RUNTIME_DELEGATE_BINDING_TEST_HARNESS_NO_PROVIDER.md",
  "bridge_id: native_doubao_secretless_provider_runtime_bridge:v0_6_73h",
  "delegate_id: native_doubao_owner_runtime_delegate:v0_6_73_one_shot",
  "delegate_binding_active: false",
  "exact_active_delegate_authorization_present: false",
  "authorization_phrase_active: false",
  "can_execute_now: false",
  "provider_binding_ref: native_doubao:capability:owner-runtime:v0_6_73",
  "provider_binding_ref_redacted: true",
  "provider_binding_ref_is_secret: false",
  "max_provider_calls: 1",
  "max_plugin_calls: 1",
  "max_api_calls: 1",
  "max_images_created: 1",
  "retry_limit: 0",
  "output_directory_ref: runs/real_generation/v0_6_73_real_vcp_agent_generation_one_shot/",
  "receipt_ref: reports/provider_receipts/v0_6_73_real_vcp_agent_generation_one_shot_receipt.json",
  "review_handoff_ref: review_console/live_receipt_bridge/v0_6_73_real_vcp_agent_generation_one_shot/bridge_entry.json",
  "env_file_content_read_allowed: false",
  "secret_value_allowed: false",
  "raw_prompt_payload_allowed: false",
  "raw_provider_payload_retained_allowed: false",
  "accepted_samples_write_allowed: false",
  "production_candidate_write_allowed: false",
  "DailyNote_write_allowed: false",
  "VCP_memory_write_allowed: false",
  "draft_decision: FAIL_CLOSED_DRAFT_NOT_ACTIVE",
  "preflight_passed_for_real_execution: false",
  "runner_must_stop_before_provider_contact: true",
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
  "next_safe_task: v0_6_73w_active_delegate_authorization_validator"
];

const forbiddenPassTokens = [
  "authorization_status: active",
  "delegate_binding_active: true",
  "can_execute_now: true",
  "draft_decision: GO",
  "provider_contact_performed: true",
  "image_generation_performed: true",
  "secret_value_read_performed: true",
  "v0_6_73_execution_allowed: true"
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
  const failFixture = read(failFixturePath);
  const uDoc = read(uDocPath);
  const u3Doc = read(u3DocPath);
  const joined = `${doc}\n${fixture}`;

  for (const token of requiredTokens) {
    addResult(`active_delegate_packet_contains:${token}`, joined.includes(token), token);
  }
  for (const token of forbiddenPassTokens) {
    addResult(`fail_fixture_contains_forbidden_positive:${token}`, failFixture.includes(token), token);
    addResult(`pass_fixture_rejects_forbidden_positive:${token}`, !fixture.includes(token), token);
  }

  addResult("source_u_defines_required_authorization_packet", uDoc.includes("authorization_packet_id: AUTH-ACTIVE-V0-6-73U-BOUND-DELEGATE") &&
    uDoc.includes("authorization_status_required: active"), uDocPath);
  addResult("source_u3_points_to_v", u3Doc.includes("next_safe_task: v0_6_73v_exact_active_delegate_authorization_packet_draft"), u3DocPath);
  addResult("draft_blocks_real_execution", joined.includes("authorization_status: draft_not_active") &&
    joined.includes("draft_decision: FAIL_CLOSED_DRAFT_NOT_ACTIVE") &&
    joined.includes("v0_6_73_execution_allowed: false"), "draft fail closed");

  const passed = errors.length === 0;
  const summary = {
    validator: "validate_v0_6_73v_exact_active_delegate_authorization_packet_draft",
    phase: "v0_6_73v_exact_active_delegate_authorization_packet_draft",
    result: passed ? "COMPLETED_VALIDATED" : "BLOCKED",
    passed,
    check_count: results.length,
    failed_count: errors.length,
    draft_decision: "FAIL_CLOSED_DRAFT_NOT_ACTIVE",
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
    next_safe_task: "v0_6_73w_active_delegate_authorization_validator",
    errors,
    results
  };

  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
  process.exit(passed ? 0 : 1);
}

main();
