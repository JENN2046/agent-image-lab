#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const runner = require("./run_native_doubao_image_generation.js");

const docPath = "docs/vcp_integration/V0_6_73AI_REAL_VCP_AGENT_GENERATION_EXECUTION_ONE_SHOT_ATTEMPT.md";
const fixturePath = "tests/schema_examples/v0_6_73ai_real_vcp_agent_generation_execution_one_shot_attempt.example.yaml";
const receiptPath = "reports/provider_receipts/v0_6_73_real_vcp_agent_generation_one_shot_receipt.json";
const outputDir = "runs/real_generation/v0_6_73_real_vcp_agent_generation_one_shot";
const reviewHandoffPath = "review_console/live_receipt_bridge/v0_6_73_real_vcp_agent_generation_one_shot/bridge_entry.json";

const requiredTokens = [
  "phase: v0_6_73ai_real_vcp_agent_generation_execution_one_shot_attempt",
  "task_id: v0_6_73_real_vcp_agent_generation_execution_one_shot",
  "source_phase: v0_6_73ah_current_head_final_pre_provider_go_no_go",
  "result: BLOCKED_VALIDATED_SECRETLESS_RUNTIME_NOT_CALLABLE",
  "runner_status: BLOCKED_SECRETLESS_RUNTIME_NOT_CALLABLE",
  "secretless_provider_runtime_supplied: false",
  "provider_contact_performed: false",
  "plugin_call_performed: false",
  "api_call_performed: false",
  "image_generation_performed: false",
  "output_write_performed: false",
  "receipt_write_performed: true",
  "review_handoff_write_performed: false",
  "secret_value_read_performed: false",
  "raw_provider_payload_recorded: false",
  "successful_generation_receipt_written: false",
  "sanitized_blocked_execution_receipt_written: true",
  "old_remote_sync_blocker_resolved: true",
  "current_blocker: secretless_provider_runtime_not_callable"
];

function readText(file) {
  return fs.readFileSync(file, "utf8");
}

function addResult(results, check, passed, detail) {
  results.push({ check, passed: passed === true, detail });
}

function hasAll(text, tokens) {
  return tokens.filter((token) => !text.includes(token));
}

async function main() {
  const results = [];
  const doc = readText(docPath);
  const fixture = readText(fixturePath);
  const receipt = JSON.parse(readText(receiptPath));

  addResult(results, "doc_required_tokens", hasAll(doc, requiredTokens).length === 0, hasAll(doc, requiredTokens));
  addResult(results, "fixture_required_tokens", hasAll(fixture, requiredTokens).length === 0, hasAll(fixture, requiredTokens));
  addResult(results, "receipt_phase", receipt.phase === "v0_6_73ai_real_vcp_agent_generation_execution_one_shot_attempt", receipt.phase);
  addResult(results, "receipt_task_id", receipt.task_id === "v0_6_73_real_vcp_agent_generation_execution_one_shot", receipt.task_id);
  addResult(results, "receipt_result", receipt.result === "BLOCKED_VALIDATED_SECRETLESS_RUNTIME_NOT_CALLABLE", receipt.result);
  addResult(results, "receipt_runner_status", receipt.runner_status === "BLOCKED_SECRETLESS_RUNTIME_NOT_CALLABLE", receipt.runner_status);
  addResult(results, "receipt_counts_zero", receipt.provider_contact_count === 0 && receipt.plugin_call_count === 0 && receipt.api_call_count === 0 && receipt.image_count === 0, {
    provider_contact_count: receipt.provider_contact_count,
    plugin_call_count: receipt.plugin_call_count,
    api_call_count: receipt.api_call_count,
    image_count: receipt.image_count
  });
  addResult(results, "receipt_boundaries_false", [
    "provider_contact_performed",
    "plugin_call_performed",
    "api_call_performed",
    "image_generation_performed",
    "image_binary_read_performed",
    "output_write_performed",
    "review_handoff_write_performed",
    "DailyNote_write_performed",
    "VCP_memory_write_performed",
    "accepted_samples_write_performed",
    "production_candidate_write_performed",
    "secret_value_read_performed",
    "raw_provider_payload_recorded",
    "raw_stdout_stderr_recorded",
    "raw_endpoint_recorded",
    "raw_response_recorded",
    "b64_json_recorded",
    "secret_recorded",
    "private_absolute_path_recorded"
  ].every((key) => receipt[key] === false), receipt);
  addResult(results, "receipt_write_is_blocked_receipt_only", receipt.receipt_write_performed === true && receipt.successful_generation_receipt_written === false && receipt.sanitized_blocked_execution_receipt_written === true, {
    receipt_write_performed: receipt.receipt_write_performed,
    successful_generation_receipt_written: receipt.successful_generation_receipt_written,
    sanitized_blocked_execution_receipt_written: receipt.sanitized_blocked_execution_receipt_written
  });
  addResult(results, "no_output_directory_created", !fs.existsSync(outputDir), outputDir);
  addResult(results, "no_review_handoff_created", !fs.existsSync(reviewHandoffPath), reviewHandoffPath);

  const runnerResult = await runner.run({
    prompt_package_ref: "prompts/image_generation/neutral_smoke_test_red_apple_v1.yaml",
    plugin_profile_ref: "plugins/image_generation/native_doubao_image/plugin.profile.yaml",
    output_directory: "runs/real_generation/v0_6_73_real_vcp_agent_generation_one_shot/",
    model: "doubao-seedream-5-0-260128",
    max_plugin_calls: 1,
    max_images_created: 1,
    retry_allowed: false,
    dryRun: false,
    execution_authorized: true,
    a5_activation_ref: "docs/vcp_integration/V0_6_73F_EXACT_A5_EXECUTION_AUTHORIZATION_DRAFT.md",
    provider_binding_ref: runner.SECRETLESS_PROVIDER_BINDING_REF,
    provider_binding_ref_redacted: true,
    provider_binding_ref_is_secret: false,
    secretless_runtime_required: true
  });
  addResult(results, "runner_fails_closed_without_runtime", runnerResult.status === "BLOCKED_SECRETLESS_RUNTIME_NOT_CALLABLE", runnerResult.status);
  addResult(results, "runner_no_external_side_effects", [
    "provider_contact_performed",
    "plugin_call_performed",
    "api_call_performed",
    "image_generation_performed",
    "image_binary_read_performed",
    "output_write_performed",
    "env_file_content_read_performed",
    "secret_value_read_performed"
  ].every((key) => runnerResult[key] === false), runnerResult);
  addResult(results, "runner_preflight_secretless", runnerResult.preflight && runnerResult.preflight.preflight_passed === true && runnerResult.preflight.secretless_binding_mode === true, runnerResult.preflight);

  const failures = results.filter((item) => !item.passed);
  const output = {
    validator: "validate_v0_6_73ai_real_vcp_agent_generation_execution_one_shot_attempt",
    passed: failures.length === 0,
    status: failures.length === 0 ? "v0_6_73ai_one_shot_attempt_blocked_validated" : "failed",
    check_count: results.length,
    failed_count: failures.length,
    checks: results,
    failures
  };
  process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
  process.exitCode = output.passed ? 0 : 1;
}

main().catch((error) => {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exit(1);
});
