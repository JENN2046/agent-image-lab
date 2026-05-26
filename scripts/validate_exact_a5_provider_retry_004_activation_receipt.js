#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const authorizationId = "AUTH-DRAFT-NATIVE-DOUBAO-SEEDREAM5-RETRY-20260526-004";
const receiptRef = "reports/provider_receipts/v0_6_73_real_vcp_agent_generation_retry_004_receipt.json";
const reviewHandoffRef = "review_console/live_receipt_bridge/v0_6_73_real_vcp_agent_generation_retry_004/bridge_entry.json";
const auditRef = ".agent_private/runtime_audit_store/v0_6_73_real_vcp_agent_generation_retry_004/activation_attempt_004.audit.json";
const outputDirectoryRef = "runs/real_generation/v0_6_73_real_vcp_agent_generation_retry_004/";
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
  assert(fs.existsSync(repoPath(receiptRef)), "retry_004 provider receipt missing");
  assert(fs.existsSync(repoPath(reviewHandoffRef)), "retry_004 review handoff missing");
  assert(fs.existsSync(repoPath(auditRef)), "retry_004 durable audit receipt missing");

  const receipt = readJson(receiptRef);
  const handoff = readJson(reviewHandoffRef);
  const audit = readJson(auditRef);

  assert(receipt.schema === "exact_a5_provider_retry_activation_receipt.v0", "receipt schema mismatch");
  assert(receipt.authorization_id === authorizationId, "authorization id mismatch");
  assert(receipt.execution_status === "BLOCKED_PROVIDER_OR_PLUGIN_RUNTIME_FAILED", "execution status mismatch");
  assert(receipt.retry_count === 1, "retry count must be 1");
  assert(receipt.further_retry_allowed === false, "further retry must be false");
  assert(receipt.retry_authorization_consumed === true, "retry authorization must be consumed");
  assert(receipt.provider_contact_attempted === true, "provider contact must be attempted");
  assert(receipt.model_required === requiredModel, "required model mismatch");
  assert(receipt.model_sent === requiredModel, "sent model mismatch");
  assert(receipt.explicit_model_no_fallback_required === true, "explicit no-fallback guard mismatch");
  assert(receipt.non_target_model_observed === false, "non-target model must not be observed");
  assert(receipt.output_directory_ref === outputDirectoryRef, "output directory mismatch");
  assert(receipt.provider_plugin_api_calls_used.admin_route_calls === 1, "admin route call count mismatch");
  assert(receipt.provider_plugin_api_calls_used.provider_calls === 1, "provider call count mismatch");
  assert(receipt.provider_plugin_api_calls_used.plugin_calls === 1, "plugin call count mismatch");
  assert(receipt.provider_plugin_api_calls_used.api_calls === 1, "api call count mismatch");
  assert(receipt.image_count === 0, "image count must be 0");
  assert(Array.isArray(receipt.image_files) && receipt.image_files.length === 0, "image files must be empty");
  assert(receipt.local_admin_route.http_status === 200, "HTTP status mismatch");
  assert(receipt.local_admin_route.summary.safety_action === "allow", "safety action mismatch");
  assert(String(receipt.blocker || "").includes("image size must be at least 3686400 pixels"), "blocker must capture provider size constraint");
  assert(!String(receipt.blocker || "").includes("doubao-seedream-3-0-t2i-250415"), "blocker must not contain old fallback model");
  assert(receipt.forbidden_writes.daily_note === false, "DailyNote write must be false");
  assert(receipt.forbidden_writes.vcp_memory === false, "VCP memory write must be false");
  assert(receipt.forbidden_writes.accepted_samples === false, "accepted samples write must be false");
  assert(receipt.forbidden_writes.production_candidate === false, "production candidate write must be false");
  assert(receipt.forbidden_writes.push_tag_release_deploy === false, "push/tag/release/deploy must be false");

  assert(handoff.bridge_type === "review_handoff", "handoff bridge type mismatch");
  assert(audit.audit_type === "durable_runtime_audit_record", "audit type mismatch");
  assertNoSecrets(receipt, "receipt");
  assertNoSecrets(handoff, "handoff");
  assertNoSecrets(audit, "audit");

  process.stdout.write(`${JSON.stringify({
    passed: true,
    validator: "validate_exact_a5_provider_retry_004_activation_receipt",
    authorization_id: receipt.authorization_id,
    execution_status: receipt.execution_status,
    provider_calls_used: receipt.provider_plugin_api_calls_used.provider_calls,
    images_created: receipt.image_count,
    model_sent: receipt.model_sent,
    non_target_model_observed: receipt.non_target_model_observed,
    blocker_type: "provider_size_constraint",
    further_retry_allowed: receipt.further_retry_allowed,
  }, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${JSON.stringify({
    passed: false,
    validator: "validate_exact_a5_provider_retry_004_activation_receipt",
    error: error.message,
  }, null, 2)}\n`);
  process.exitCode = 1;
}
