#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const gateId = "runtime_to_review_v1_evidence_validation_gate";

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

function main() {
  const retry006Artifact = runNodeJson("scripts/validate_retry_006_artifact_integrity.js");
  const retry007Artifact = runNodeJson("scripts/validate_retry_007_artifact_integrity.js");
  const retry007Receipt = runNodeJson("scripts/validate_exact_a5_provider_retry_007_activation_receipt.js");
  const providerEvidence = runNodeJson("scripts/validate_provider_evidence_integrity_contract.js");
  const decision = runNodeJson("scripts/validate_review_decision_record_v1.js");
  const draft = runNodeJson("scripts/validate_review_draft_registry_v1.js");

  [
    ["retry006Artifact", retry006Artifact],
    ["retry007Artifact", retry007Artifact],
    ["retry007Receipt", retry007Receipt],
    ["providerEvidence", providerEvidence],
    ["decision", decision],
    ["draft", draft],
  ].forEach(([label, result]) => assert(result.passed === true, `${label} must pass`));

  assert(retry007Receipt.local_review_decision === "provider_link_success_evidence_only", "retry 007 decision must remain evidence-only");
  assert(retry007Receipt.accepted_sample_candidate === false, "retry 007 must not be accepted sample candidate");
  assert(retry007Receipt.fresh_clone_private_audit_required === false, "retry 007 evidence gate must not require private audit files");
  assert(decision.retry_007_regression_decision === "provider_link_success_evidence_only", "retry 007 decision regression mismatch");
  assert(decision.retry_007_not_accepted_sample === true, "retry 007 must not be accepted sample");
  assert(decision.retry_007_not_production_candidate === true, "retry 007 must not be production candidate");
  assert(draft.retry_007_draft_type === "no_registry_draft", "retry 007 must not create registry draft");
  assert(draft.retry_007_accepted_draft_created === false, "retry 007 must not create accepted draft");

  [
    ["retry007Receipt", retry007Receipt],
    ["providerEvidence", providerEvidence],
    ["decision", decision],
    ["draft", draft],
  ].forEach(([label, result]) => {
    [
      "provider_contact_performed",
      "plugin_call_performed",
      "api_call_performed",
      "image_generation_performed",
      "secret_value_read_performed",
      "DailyNote_write_performed",
      "VCP_memory_write_performed",
      "accepted_samples_write_performed",
      "production_candidate_write_performed",
      "memory_write_performed",
    ].forEach((field) => assertFalse(result[field], `${label}.${field}`));
  });

  process.stdout.write(`${JSON.stringify({
    passed: true,
    gate_id: gateId,
    mode: "existing_evidence_validation_no_external_call",
    included_validators: [
      "validate_retry_006_artifact_integrity",
      "validate_retry_007_artifact_integrity",
      "validate_exact_a5_provider_retry_007_activation_receipt",
      "validate_provider_evidence_integrity_contract",
      "validate_review_decision_record_v1",
      "validate_review_draft_registry_v1",
    ],
    existing_receipt_and_artifact_evidence_only: true,
    retry_007_decision: retry007Receipt.local_review_decision,
    retry_007_registry_draft_type: draft.retry_007_draft_type,
    real_provider_call_included: false,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    secret_value_read_performed: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false,
    accepted_samples_write_performed: false,
    production_candidate_write_performed: false,
    memory_write_performed: false,
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
