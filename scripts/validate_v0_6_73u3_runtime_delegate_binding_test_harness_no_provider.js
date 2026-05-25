#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const docPath = "docs/vcp_integration/V0_6_73U3_RUNTIME_DELEGATE_BINDING_TEST_HARNESS_NO_PROVIDER.md";
const fixturePath = "tests/schema_examples/v0_6_73u3_runtime_delegate_binding_test_harness_no_provider.example.yaml";
const harnessPath = "scripts/native_doubao_delegate_binding_test_harness_no_provider.js";
const uDocPath = "docs/vcp_integration/V0_6_73U_ACTIVE_DELEGATE_AUTHORIZATION_ACTIVATION_PREFLIGHT.md";
const hDocPath = "docs/vcp_integration/V0_6_73H_SECRETLESS_PROVIDER_RUNTIME_BRIDGE.md";

const harness = require(path.join(root, harnessPath));

const requiredFiles = [docPath, fixturePath, harnessPath, uDocPath, hDocPath];
const requiredTokens = [
  "phase: v0_6_73u3_runtime_delegate_binding_test_harness_no_provider",
  "source_phase: v0_6_73u_active_delegate_authorization_activation_preflight",
  "source_status: COMPLETED_VALIDATED_fail_closed_activation_preflight_only",
  "result: COMPLETED_VALIDATED",
  "harness_id: HARNESS-V0-6-73U3-NO-PROVIDER",
  "harness_script_ref: scripts/native_doubao_delegate_binding_test_harness_no_provider.js",
  "validator_ref: scripts/validate_v0_6_73u3_runtime_delegate_binding_test_harness_no_provider.js",
  "accepted_delegate_shape: controlled_bridge_marker_with_exact_authorization_only",
  "arbitrary_runtime_allowed: false",
  "unbound_controlled_bridge_allowed_to_fail_closed: true",
  "exact_active_delegate_authorization_present: false",
  "v0_6_73_execution_allowed: false",
  "id: missing_secretless_provider_runtime",
  "expected_status: BLOCKED_SECRETLESS_RUNTIME_NOT_CALLABLE",
  "id: arbitrary_uncontrolled_runtime_rejected_before_call",
  "expected_status: BLOCKED_SECRETLESS_PROVIDER_RUNTIME_DELEGATE_AUTHORIZATION_REQUIRED",
  "id: arbitrary_uncontrolled_runtime_not_invoked",
  "expected_status: NOT_INVOKED",
  "id: controlled_unbound_bridge_fails_closed",
  "expected_status: BLOCKED_PROVIDER_RUNTIME_DELEGATE_NOT_BOUND",
  "id: bad_provider_binding_ref_blocks_preflight",
  "expected_status: BLOCKED_PREFLIGHT_FAILED",
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
  "next_safe_task: v0_6_73v_exact_active_delegate_authorization_packet_draft"
];

const expectedCaseIds = [
  "missing_secretless_provider_runtime",
  "arbitrary_uncontrolled_runtime_rejected_before_call",
  "arbitrary_uncontrolled_runtime_not_invoked",
  "controlled_unbound_bridge_fails_closed",
  "bad_provider_binding_ref_blocks_preflight"
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

async function main() {
  for (const file of requiredFiles) {
    addResult(`file_exists:${file}`, fs.existsSync(repoPath(file)), file);
  }

  const joined = `${read(docPath)}\n${read(fixturePath)}`;
  const harnessSource = read(harnessPath);
  const uDoc = read(uDocPath);
  const hDoc = read(hDocPath);

  for (const token of requiredTokens) {
    addResult(`harness_contract_contains:${token}`, joined.includes(token), token);
  }

  addResult("harness_exports_runHarness", typeof harness.runHarness === "function", harnessPath);
  addResult("harness_source_has_no_env_loader", !harnessSource.includes("loadEnvLocal(") && !harnessSource.includes("readFileSync(ENV_LOCAL_PATH"), harnessPath);
  addResult("harness_source_uses_secretless_runner_only", harnessSource.includes("secretless_runtime_required: true") &&
    harnessSource.includes("provider_binding_ref_redacted: true") &&
    harnessSource.includes("provider_binding_ref_is_secret: false"), harnessPath);

  const harnessResult = await harness.runHarness();
  addResult("harness_passed", harnessResult.passed === true, harnessResult);
  addResult("harness_case_count_exact", harnessResult.case_count === 5, harnessResult.case_count);
  for (const id of expectedCaseIds) {
    addResult(`harness_case_present:${id}`, harnessResult.cases.some((item) => item.id === id && item.passed === true), id);
  }
  addResult("harness_rejects_arbitrary_runtime", harnessResult.arbitrary_runtime_allowed === false &&
    harnessResult.cases.some((item) => item.id === "arbitrary_uncontrolled_runtime_not_invoked" && item.actual_status === "NOT_INVOKED"), harnessResult.cases);
  addResult("harness_all_external_flags_false", harnessResult.provider_contact_performed === false &&
    harnessResult.plugin_call_performed === false &&
    harnessResult.api_call_performed === false &&
    harnessResult.image_generation_performed === false &&
    harnessResult.image_binary_read_performed === false &&
    harnessResult.output_write_performed === false &&
    harnessResult.env_file_content_read_performed === false &&
    harnessResult.secret_value_read_performed === false, harnessResult);

  addResult("source_u_points_to_u3", uDoc.includes("next_safe_task: v0_6_73u3_runtime_delegate_binding_test_harness_no_provider"), uDocPath);
  addResult("source_h_unbound_bridge_no_external_effects", hDoc.includes("unbound_bridge_status: BLOCKED_PROVIDER_RUNTIME_DELEGATE_NOT_BOUND") &&
    hDoc.includes("provider_contact_performed: false") &&
    hDoc.includes("image_generation_performed: false"), hDocPath);

  const passed = errors.length === 0;
  const summary = {
    validator: "validate_v0_6_73u3_runtime_delegate_binding_test_harness_no_provider",
    phase: "v0_6_73u3_runtime_delegate_binding_test_harness_no_provider",
    result: passed ? "COMPLETED_VALIDATED" : "BLOCKED",
    passed,
    check_count: results.length,
    failed_count: errors.length,
    harness_passed: harnessResult.passed === true,
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
    next_safe_task: "v0_6_73v_exact_active_delegate_authorization_packet_draft",
    errors,
    results
  };

  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
  process.exit(passed ? 0 : 1);
}

main().catch((error) => {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exit(1);
});
