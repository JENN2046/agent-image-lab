#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const authorizationId = "AUTH-DRAFT-NATIVE-DOUBAO-SEEDREAM5-RETRY-20260526-005";
const receiptRef = "reports/provider_receipts/v0_6_73_real_vcp_agent_generation_retry_005_receipt.json";
const reviewHandoffRef = "review_console/live_receipt_bridge/v0_6_73_real_vcp_agent_generation_retry_005/bridge_entry.json";
const auditRef = ".agent_private/runtime_audit_store/v0_6_73_real_vcp_agent_generation_retry_005/activation_attempt_005.audit.json";
const outputDirectoryRef = "runs/real_generation/v0_6_73_real_vcp_agent_generation_retry_005/";
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
  assert(fs.existsSync(repoPath(receiptRef)), "retry_005 provider receipt missing");
  assert(fs.existsSync(repoPath(reviewHandoffRef)), "retry_005 review handoff missing");
  assert(fs.existsSync(repoPath(auditRef)), "retry_005 durable audit receipt missing");

  const receipt = readJson(receiptRef);
  const handoff = readJson(reviewHandoffRef);
  const audit = readJson(auditRef);

  assert(receipt.schema === "exact_a5_provider_retry_activation_receipt.v0", "receipt schema mismatch");
  assert(receipt.authorization_id === authorizationId, "authorization id mismatch");
  assert(receipt.execution_status === "BLOCKED_OUTPUT_SCOPE_VIOLATION", "execution status mismatch");
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
  assert(receipt.images_created_total === 1, "total image count mismatch");
  assert(receipt.images_created_inside_authorized_output === 0, "authorized image count must be 0");
  assert(receipt.images_created_outside_authorized_output === 1, "out-of-scope image count must be 1");
  assert(receipt.exact_output_directory_only === false, "exact output directory guard must fail");
  assert(receipt.output_scope_violation === true, "output scope violation must be true");
  assert(receipt.review_eligible === false, "review must be blocked");
  assert(receipt.accepted_candidate_allowed === false, "accepted candidate must be blocked");
  assert(Array.isArray(receipt.out_of_scope_output_files) && receipt.out_of_scope_output_files.length === 1, "out-of-scope output must be recorded once");
  assert(String(receipt.blocker || "").includes("outside the authorized retry_005 output directory"), "blocker must explain output scope violation");
  assert(handoff.review_status === "blocked_output_scope_violation_no_review", "handoff review status mismatch");
  assert(handoff.accepted_candidate === false, "handoff must not accept candidate");
  assert(audit.audit_type === "durable_runtime_audit_record", "audit type mismatch");
  assertNoSecrets(receipt, "receipt");
  assertNoSecrets(handoff, "handoff");
  assertNoSecrets(audit, "audit");

  process.stdout.write(`${JSON.stringify({
    passed: true,
    validator: "validate_exact_a5_provider_retry_005_activation_receipt",
    authorization_id: receipt.authorization_id,
    execution_status: receipt.execution_status,
    provider_calls_used: receipt.provider_plugin_api_calls_used.provider_calls,
    images_created_total: receipt.images_created_total,
    images_created_inside_authorized_output: receipt.images_created_inside_authorized_output,
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
    validator: "validate_exact_a5_provider_retry_005_activation_receipt",
    error: error.message,
  }, null, 2)}\n`);
  process.exitCode = 1;
}
