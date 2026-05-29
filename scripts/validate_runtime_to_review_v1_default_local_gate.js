#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const gateId = "runtime_to_review_v1_default_local_gate";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function runNodeJson(script) {
  const output = childProcess.execFileSync(process.execPath, [script], {
    cwd: root,
    encoding: "utf8",
  });
  return JSON.parse(output);
}

function assertFalse(value, label) {
  assert(value !== true, `${label} must not be true`);
}

function assertNoExternalSideEffects(result, label) {
  [
    "provider_contact_performed",
    "plugin_call_performed",
    "api_call_performed",
    "image_generation_performed",
    "secret_value_read_performed",
    "DailyNote_write_performed",
    "VCP_memory_write_performed",
    "memory_write_performed",
    "accepted_samples_write_performed",
    "production_candidate_write_performed",
  ].forEach((field) => assertFalse(result[field], `${label}.${field}`));
}

function main() {
  const runtime = runNodeJson("scripts/validate_runtime_kernel_v1_real_provider_guarded.js");
  const reviewBridge = runNodeJson("scripts/validate_runtime_review_bridge_v1_readonly.js");
  const decision = runNodeJson("scripts/validate_review_decision_record_v1.js");
  const draft = runNodeJson("scripts/validate_review_draft_registry_v1.js");
  const smoke = runNodeJson("scripts/validate_runtime_to_review_v1_fixture_smoke_flow.js");
  const staticRealEntry = runNodeJson("scripts/validate_runtime_to_review_v1_static_real_entry_viewer.js");

  assert(runtime.passed === true, "runtime kernel v1 validator must pass");
  assert(reviewBridge.passed === true, "runtime review bridge v1 validator must pass");
  assert(decision.passed === true, "review decision record validator must pass");
  assert(draft.passed === true, "review draft registry validator must pass");
  assert(smoke.passed === true, "fixture smoke flow validator must pass");
  assert(staticRealEntry.passed === true, "static real-entry viewer validator must pass");

  assert(runtime.real_provider_call_performed_by_validator === false, "runtime validator must not perform real provider calls");
  assert(runtime.provider_delegate_default_bound === false, "default local gate must not bind a real provider delegate");
  assert(smoke.status === "completed_fixture_runtime_to_review_smoke", "fixture smoke flow status mismatch");
  assert(smoke.provider_failure_failed_closed === true, "default gate must verify provider failure fail-closed");
  assert(smoke.model_mismatch_failed_closed === true, "default gate must verify model mismatch fail-closed");

  [
    ["runtime", runtime],
    ["review_bridge", reviewBridge],
    ["decision", decision],
    ["draft", draft],
    ["smoke", smoke],
    ["static_real_entry", staticRealEntry],
  ].forEach(([label, result]) => assertNoExternalSideEffects(result, label));

  process.stdout.write(`${JSON.stringify({
    passed: true,
    gate_id: gateId,
    mode: "default_local_no_provider_no_external_call",
    included_validators: [
      "validate_runtime_kernel_v1_real_provider_guarded",
      "validate_runtime_review_bridge_v1_readonly",
      "validate_review_decision_record_v1",
      "validate_review_draft_registry_v1",
      "validate_runtime_to_review_v1_fixture_smoke_flow",
      "validate_runtime_to_review_v1_static_real_entry_viewer",
    ],
    real_provider_call_included: false,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    secret_value_read_performed: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false,
    memory_write_performed: false,
    accepted_samples_write_performed: false,
    production_candidate_write_performed: false,
    fixture_smoke_status: smoke.status,
    fixture_smoke_decision: smoke.decision,
    fixture_smoke_draft_type: smoke.draft_type,
    static_real_entry_viewer_status: staticRealEntry.status,
  }, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${JSON.stringify({
    passed: false,
    gate_id: gateId,
    error: error.message,
  }, null, 2)}\n`);
  process.exitCode = 1;
}
