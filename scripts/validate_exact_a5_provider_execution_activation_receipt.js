#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const activation = require("./run_exact_a5_provider_execution_packet");

const root = path.resolve(__dirname, "..");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function repoPath(relativePath) {
  const resolved = path.resolve(root, relativePath);
  const relative = path.relative(root, resolved);
  assert(!relative.startsWith("..") && !path.isAbsolute(relative), `Path escapes repository: ${relativePath}`);
  return resolved;
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(repoPath(relativePath), "utf8"));
}

function assertFalse(value, label) {
  assert(value === false, `${label} must be false`);
}

function assertNoSecrets(value, label) {
  const text = JSON.stringify(value);
  assert(!text.includes("DOUBAO_IMAGE_API_KEY"), `${label} must not include env key names as secret material`);
  assert(!/sk-[A-Za-z0-9]/.test(text), `${label} must not include sk-* token pattern`);
  assert(!/Bearer\s+/i.test(text), `${label} must not include bearer token`);
  assert(!text.includes("Authorization:"), `${label} must not include Authorization header`);
}

function main() {
  assert(fs.existsSync(repoPath(activation.receiptRef)), "provider receipt missing");
  assert(fs.existsSync(repoPath(activation.reviewHandoffRef)), "review handoff missing");
  assert(fs.existsSync(repoPath(activation.auditRef)), "durable audit receipt missing");

  const receipt = readJson(activation.receiptRef);
  const handoff = readJson(activation.reviewHandoffRef);
  const audit = readJson(activation.auditRef);

  assert(receipt.receipt_schema === "exact_a5_provider_execution_activation_receipt.v0", "receipt schema mismatch");
  assert(receipt.authorization_id === activation.expectedAuthorizationId, "receipt authorization id mismatch");
  assert(receipt.activation_phrase_matched === true, "activation phrase must be matched");
  assert(receipt.provider_binding_ref === "native_doubao:capability:owner-runtime:<redacted>", "provider binding ref must stay redacted");
  assert(receipt.provider_binding_ref_redacted === true, "provider binding ref redacted mismatch");
  assert(receipt.provider_binding_ref_is_secret === false, "provider binding ref must be non-secret");
  assert(receipt.budget.max_provider_calls === 1, "provider budget mismatch");
  assert(receipt.budget.max_plugin_calls === 1, "plugin budget mismatch");
  assert(receipt.budget.max_api_calls === 1, "api budget mismatch");
  assert(receipt.budget.max_images_created === 1, "image budget mismatch");
  assert(receipt.budget.retry_allowed === false, "retry must be false");
  assert(receipt.counts.provider_calls_used <= 1, "provider calls over budget");
  assert(receipt.counts.plugin_calls_used <= 1, "plugin calls over budget");
  assert(receipt.counts.api_calls_used <= 1, "api calls over budget");
  assert(receipt.counts.images_created <= 1, "images over budget");
  assert(receipt.output_directory_ref === "runs/real_generation/v0_6_73_real_vcp_agent_generation_one_shot/", "output directory mismatch");
  assertFalse(receipt.side_effect_flags.env_file_content_read_performed, "receipt env read");
  assertFalse(receipt.side_effect_flags.secret_value_read_performed, "receipt secret read");
  assertFalse(receipt.side_effect_flags.production_write_performed, "receipt production write");
  assertFalse(receipt.side_effect_flags.accepted_samples_write_performed, "receipt accepted samples write");
  assertFalse(receipt.side_effect_flags.DailyNote_write_performed, "receipt DailyNote write");
  assertFalse(receipt.side_effect_flags.VCP_memory_write_performed, "receipt VCP memory write");
  assertFalse(receipt.side_effect_flags.push_tag_release_deploy_performed, "receipt push/tag/release/deploy");
  assertFalse(receipt.retry_performed, "receipt retry");
  assertFalse(receipt.raw_provider_payload_retained, "raw provider payload retention");
  assertFalse(receipt.secret_value_recorded, "secret value recorded");

  assert(handoff.review_handoff_schema === "exact_a5_provider_execution_review_handoff.v0", "handoff schema mismatch");
  assert(handoff.provider_receipt_ref === activation.receiptRef, "handoff receipt ref mismatch");
  assert(handoff.accepted_candidate === false, "handoff must not accept candidate automatically");
  assert(handoff.commercial_delivery_ready === false, "handoff must not be commercial ready");

  assert(audit.audit_schema === "exact_a5_provider_execution_activation_audit.v0", "audit schema mismatch");
  assert(audit.provider_receipt_ref === activation.receiptRef, "audit receipt ref mismatch");
  assert(audit.review_handoff_ref === activation.reviewHandoffRef, "audit handoff ref mismatch");

  assertNoSecrets(receipt, "receipt");
  assertNoSecrets(handoff, "handoff");
  assertNoSecrets(audit, "audit");

  process.stdout.write(`${JSON.stringify({
    passed: true,
    validator: "validate_exact_a5_provider_execution_activation_receipt",
    authorization_id: receipt.authorization_id,
    execution_status: receipt.execution_status,
    execution_blocked_fail_closed: receipt.execution_blocked_fail_closed,
    receipt_ref: activation.receiptRef,
    review_handoff_ref: activation.reviewHandoffRef,
    durable_audit_ref: activation.auditRef,
    provider_calls_used: receipt.counts.provider_calls_used,
    plugin_calls_used: receipt.counts.plugin_calls_used,
    api_calls_used: receipt.counts.api_calls_used,
    images_created: receipt.counts.images_created,
    provider_contact_performed: receipt.side_effect_flags.provider_contact_performed,
    plugin_call_performed: receipt.side_effect_flags.plugin_call_performed,
    api_call_performed: receipt.side_effect_flags.api_call_performed,
    image_generation_performed: receipt.side_effect_flags.image_generation_performed,
    env_file_content_read_performed: false,
    secret_value_read_performed: false,
    retry_performed: false,
    production_write_performed: false,
    accepted_samples_write_performed: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false,
  }, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${JSON.stringify({
    passed: false,
    validator: "validate_exact_a5_provider_execution_activation_receipt",
    error: error.message,
  }, null, 2)}\n`);
  process.exitCode = 1;
}
