#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const authorizationId = "AUTH-DRAFT-NATIVE-DOUBAO-SEEDREAM5-RETRY-20260526-006";
const receiptRef = "reports/provider_receipts/v0_6_73_real_vcp_agent_generation_retry_006_receipt.json";
const reviewHandoffRef = "review_console/live_receipt_bridge/v0_6_73_real_vcp_agent_generation_retry_006/bridge_entry.json";
const auditRef = ".agent_private/runtime_audit_store/v0_6_73_real_vcp_agent_generation_retry_006/activation_attempt_006.audit.json";
const outputDirectoryRef = "runs/real_generation/v0_6_73_real_vcp_agent_generation_retry_006/";
const requiredModel = "doubao-seedream-5-0-260128";

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

function assertNoSecrets(value, label) {
  const text = JSON.stringify(value);
  assert(!/Basic\s+[A-Za-z0-9+/=._~-]+/i.test(text), `${label} must not include Basic auth material`);
  assert(!/Bearer\s+[A-Za-z0-9._~+/-]+/i.test(text), `${label} must not include bearer token`);
  assert(!/sk-[A-Za-z0-9_-]{8,}/.test(text), `${label} must not include sk-* token pattern`);
  assert(!/AKLT[A-Za-z0-9_-]{8,}/.test(text), `${label} must not include provider key pattern`);
}

function main() {
  assert(fs.existsSync(repoPath(receiptRef)), "retry_006 provider receipt missing");
  assert(fs.existsSync(repoPath(reviewHandoffRef)), "retry_006 review handoff missing");
  assert(fs.existsSync(repoPath(auditRef)), "retry_006 durable audit receipt missing");

  const receipt = readJson(receiptRef);
  const handoff = readJson(reviewHandoffRef);
  const audit = readJson(auditRef);

  assert(receipt.schema === "exact_a5_provider_retry_activation_receipt.v0", "receipt schema mismatch");
  assert(receipt.authorization_id === authorizationId, "authorization id mismatch");
  assert(receipt.execution_status === "COMPLETED_PROVIDER_IMAGE_CREATED", "execution status mismatch");
  assert(receipt.retry_count === 1, "retry count must be 1");
  assert(receipt.further_retry_allowed === false, "further retry must be false");
  assert(receipt.provider_contact_attempted === true, "provider contact must be attempted");
  assert(receipt.model_sent === requiredModel, "sent model mismatch");
  assert(receipt.resolution_sent === "1920x2048", "resolution mismatch");
  assert(receipt.non_target_model_observed === false, "non-target model must not be observed");
  assert(receipt.output_directory_ref === outputDirectoryRef, "output directory mismatch");
  assert(receipt.provider_plugin_api_calls_used.admin_route_calls === 1, "admin route count mismatch");
  assert(receipt.provider_plugin_api_calls_used.provider_calls === 1, "provider count mismatch");
  assert(receipt.provider_plugin_api_calls_used.plugin_calls === 1, "plugin count mismatch");
  assert(receipt.provider_plugin_api_calls_used.api_calls === 1, "api count mismatch");
  assert(receipt.image_count === 1, "image count must be 1");
  assert(receipt.image_budget_respected === true, "image budget must be respected");
  assert(receipt.exact_output_directory_only === true, "exact output directory guard must pass");
  assert(receipt.output_scope_violation === false, "output scope violation must be false");
  assert(receipt.review_eligible === true, "review must be eligible");
  assert(receipt.accepted_candidate_allowed === false, "auto-accept must remain false");
  assert(Array.isArray(receipt.image_files) && receipt.image_files.length === 1, "one image file must be recorded");
  assert(receipt.image_files[0].path.startsWith(outputDirectoryRef), "image must be under authorized output directory");
  assert(fs.existsSync(repoPath(receipt.image_files[0].path)), "recorded image file missing");
  assert(receipt.forbidden_writes.daily_note === false, "DailyNote write must be false");
  assert(receipt.forbidden_writes.vcp_memory === false, "VCP memory write must be false");
  assert(receipt.forbidden_writes.accepted_samples === false, "accepted samples write must be false");
  assert(receipt.forbidden_writes.production_candidate === false, "production candidate write must be false");
  assert(receipt.forbidden_writes.push_tag_release_deploy === false, "push/tag/release/deploy must be false");
  assert(handoff.review_status === "ready_for_human_review", "handoff review status mismatch");
  assert(handoff.accepted_candidate === false, "handoff must not auto-accept candidate");
  assert(audit.audit_type === "durable_runtime_audit_record", "audit type mismatch");
  assertNoSecrets(receipt, "receipt");
  assertNoSecrets(handoff, "handoff");
  assertNoSecrets(audit, "audit");

  process.stdout.write(`${JSON.stringify({
    passed: true,
    validator: "validate_exact_a5_provider_retry_006_activation_receipt",
    authorization_id: receipt.authorization_id,
    execution_status: receipt.execution_status,
    provider_calls_used: receipt.provider_plugin_api_calls_used.provider_calls,
    images_created: receipt.image_count,
    image_file: receipt.image_files[0].path,
    output_scope_violation: receipt.output_scope_violation,
    review_eligible: receipt.review_eligible,
    further_retry_allowed: receipt.further_retry_allowed,
  }, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${JSON.stringify({
    passed: false,
    validator: "validate_exact_a5_provider_retry_006_activation_receipt",
    error: error.message,
  }, null, 2)}\n`);
  process.exitCode = 1;
}
