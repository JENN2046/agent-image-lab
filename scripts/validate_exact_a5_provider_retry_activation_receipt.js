#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const authorizationId = "AUTH-DRAFT-NATIVE-DOUBAO-SEEDREAM5-RETRY-20260526-002";
const receiptRef = "reports/provider_receipts/v0_6_73_real_vcp_agent_generation_retry_002_receipt.json";
const reviewHandoffRef = "review_console/live_receipt_bridge/v0_6_73_real_vcp_agent_generation_retry_002/bridge_entry.json";
const auditRef = ".agent_private/runtime_audit_store/v0_6_73_real_vcp_agent_generation_retry_002/activation_attempt_002.audit.json";
const routeAuditRef = ".agent_private/runtime_audit_store/v0_6_73_real_vcp_agent_generation_retry_002/vcptoolbox_route_audit.jsonl";

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
  assert(fs.existsSync(repoPath(receiptRef)), "retry provider receipt missing");
  assert(fs.existsSync(repoPath(reviewHandoffRef)), "retry review handoff missing");
  assert(fs.existsSync(repoPath(auditRef)), "retry durable audit receipt missing");
  assert(fs.existsSync(repoPath(routeAuditRef)), "retry route audit missing");

  const receipt = readJson(receiptRef);
  const handoff = readJson(reviewHandoffRef);
  const audit = readJson(auditRef);

  assert(receipt.receipt_schema === "exact_a5_provider_retry_activation_receipt.v0", "receipt schema mismatch");
  assert(receipt.authorization_id === authorizationId, "receipt authorization id mismatch");
  assert(receipt.activation_phrase_matched === true, "activation phrase must be matched");
  assert(receipt.previous_authorization_consumed === true, "previous authorization must be consumed");
  assert(receipt.execution_status === "BLOCKED_PLUGIN_NOT_FOUND_BEFORE_PROVIDER_CONTACT", "execution status mismatch");
  assert(receipt.execution_completed === false, "execution must not be completed");
  assert(receipt.execution_blocked_fail_closed === true, "execution must fail closed");
  assert(receipt.model === "doubao-seedream-5-0-260128", "model mismatch");
  assert(receipt.output_directory_ref === "runs/real_generation/v0_6_73_real_vcp_agent_generation_retry_002/", "output directory mismatch");
  assert(receipt.provider_binding_ref === "native_doubao:capability:owner-runtime:<redacted>", "provider binding ref must stay redacted");
  assert(receipt.provider_binding_ref_redacted === true, "provider binding ref redacted mismatch");
  assert(receipt.provider_binding_ref_is_secret === false, "provider binding ref must be non-secret");
  assert(receipt.budget.max_provider_calls === 1, "provider budget mismatch");
  assert(receipt.budget.max_plugin_calls === 1, "plugin budget mismatch");
  assert(receipt.budget.max_api_calls === 1, "api budget mismatch");
  assert(receipt.budget.max_images_created === 1, "image budget mismatch");
  assert(receipt.budget.retry_allowed === false, "retry must be false");
  assert(receipt.counts.provider_calls_used === 0, "provider calls must be 0 because plugin was not found");
  assert(receipt.counts.plugin_calls_used === 0, "plugin calls must be 0 because plugin was not found");
  assert(receipt.counts.api_calls_used === 0, "api calls must be 0 because plugin was not found");
  assert(receipt.counts.images_created === 0, "images created must be 0");
  assert(receipt.counts.output_files_written === 0, "output files written must be 0");
  assert(String(receipt.blocker || "").includes("Plugin \"DoubaoGen\" not found"), "blocker must identify missing DoubaoGen plugin");
  assert(receipt.retry_performed === true, "authorized retry attempt must be recorded");
  assert(receipt.retry_count === 1, "retry count must be 1");
  assert(receipt.further_retry_allowed === false, "further retry must be false");
  assertFalse(receipt.side_effect_flags.provider_contact_performed, "receipt provider contact");
  assertFalse(receipt.side_effect_flags.plugin_call_performed, "receipt plugin call");
  assertFalse(receipt.side_effect_flags.api_call_performed, "receipt api call");
  assertFalse(receipt.side_effect_flags.image_generation_performed, "receipt image generation");
  assertFalse(receipt.side_effect_flags.env_file_content_read_performed, "receipt env read");
  assertFalse(receipt.side_effect_flags.secret_value_read_performed, "receipt secret read");
  assertFalse(receipt.side_effect_flags.output_write_performed, "receipt output write");
  assertFalse(receipt.side_effect_flags.production_write_performed, "receipt production write");
  assertFalse(receipt.side_effect_flags.accepted_samples_write_performed, "receipt accepted samples write");
  assertFalse(receipt.side_effect_flags.DailyNote_write_performed, "receipt DailyNote write");
  assertFalse(receipt.side_effect_flags.VCP_memory_write_performed, "receipt VCP memory write");
  assertFalse(receipt.side_effect_flags.push_tag_release_deploy_performed, "receipt push/tag/release/deploy");
  assertFalse(receipt.raw_provider_payload_retained, "raw provider payload retention");
  assertFalse(receipt.secret_value_recorded, "secret value recorded");

  assert(handoff.review_handoff_schema === "exact_a5_provider_retry_review_handoff.v0", "handoff schema mismatch");
  assert(handoff.provider_receipt_ref === receiptRef, "handoff receipt ref mismatch");
  assert(handoff.review_status === "blocked_no_image_to_review", "handoff review status mismatch");
  assert(handoff.accepted_candidate === false, "handoff must not accept candidate automatically");
  assert(handoff.commercial_delivery_ready === false, "handoff must not be commercial ready");

  assert(audit.audit_schema === "exact_a5_provider_retry_activation_audit.v0", "audit schema mismatch");
  assert(audit.provider_receipt_ref === receiptRef, "audit receipt ref mismatch");
  assert(audit.review_handoff_ref === reviewHandoffRef, "audit handoff ref mismatch");
  assert(audit.route_audit_ref === routeAuditRef, "audit route audit ref mismatch");

  assertNoSecrets(receipt, "receipt");
  assertNoSecrets(handoff, "handoff");
  assertNoSecrets(audit, "audit");

  process.stdout.write(`${JSON.stringify({
    passed: true,
    validator: "validate_exact_a5_provider_retry_activation_receipt",
    authorization_id: receipt.authorization_id,
    execution_status: receipt.execution_status,
    execution_blocked_fail_closed: receipt.execution_blocked_fail_closed,
    receipt_ref: receiptRef,
    review_handoff_ref: reviewHandoffRef,
    durable_audit_ref: auditRef,
    route_audit_ref: routeAuditRef,
    provider_calls_used: receipt.counts.provider_calls_used,
    plugin_calls_used: receipt.counts.plugin_calls_used,
    api_calls_used: receipt.counts.api_calls_used,
    images_created: receipt.counts.images_created,
    output_files_written: receipt.counts.output_files_written,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    env_file_content_read_performed: false,
    secret_value_read_performed: false,
    retry_performed: true,
    further_retry_allowed: false,
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
    validator: "validate_exact_a5_provider_retry_activation_receipt",
    error: error.message,
  }, null, 2)}\n`);
  process.exitCode = 1;
}
