#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const authorizationId = "AUTH-DRAFT-NATIVE-DOUBAO-SEEDREAM5-RETRY-20260526-003";
const receiptRef = "reports/provider_receipts/v0_6_73_real_vcp_agent_generation_retry_003_receipt.json";
const reviewHandoffRef = "review_console/live_receipt_bridge/v0_6_73_real_vcp_agent_generation_retry_003/bridge_entry.json";
const auditRef = ".agent_private/runtime_audit_store/v0_6_73_real_vcp_agent_generation_retry_003/activation_attempt_003.audit.json";
const outputDirectoryRef = "runs/real_generation/v0_6_73_real_vcp_agent_generation_retry_003/";
const redactedLocalPath = "<redacted-local-path>";
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
  assert(!text.includes("Authorization:"), `${label} must not include Authorization header`);
}

function assertNoAbsoluteLocalPath(value, label) {
  const text = JSON.stringify(value);
  assert(!/[A-Z]:[\\/]/.test(text), `${label} must not expose Windows absolute paths`);
}

function main() {
  assert(fs.existsSync(repoPath(receiptRef)), "retry_003 provider receipt missing");
  assert(fs.existsSync(repoPath(reviewHandoffRef)), "retry_003 review handoff missing");
  assert(fs.existsSync(repoPath(auditRef)), "retry_003 durable audit receipt missing");

  const receipt = readJson(receiptRef);
  const handoff = readJson(reviewHandoffRef);
  const audit = readJson(auditRef);

  assert(receipt.schema === "exact_a5_provider_retry_activation_receipt.v0", "receipt schema mismatch");
  assert(receipt.authorization_id === authorizationId, "receipt authorization id mismatch");
  assert(receipt.pipeline_id === "v0_6_73_real_vcp_agent_generation_retry_003", "pipeline id mismatch");
  assert(receipt.execution_status === "BLOCKED_PROVIDER_OR_PLUGIN_RUNTIME_FAILED", "execution status mismatch");
  assert(receipt.dry_run === false, "receipt must record dry_run=false");
  assert(receipt.retry_count === 1, "retry count must be 1");
  assert(receipt.further_retry_allowed === false, "further retry must be false");
  assert(receipt.retry_authorization_consumed === true, "retry authorization must be consumed after provider path was reached");
  assert(receipt.provider_contact_attempted === true, "provider contact must be recorded as attempted");
  assert(receipt.model_required === requiredModel, "required model mismatch");
  assert(receipt.model_sent === requiredModel, "sent model mismatch");
  assert(receipt.output_directory_ref === outputDirectoryRef, "output directory ref mismatch");
  assert(receipt.output_directory_abs === redactedLocalPath, "output directory abs must be redacted");
  assert(receipt.doubao_project_base_path_override_ref === redactedLocalPath, "PROJECT_BASE_PATH override must be redacted");
  assert(receipt.exact_output_directory_only === true, "output directory guard mismatch");
  assert(receipt.provider_plugin_api_call_budget.max_provider_calls === 1, "provider budget mismatch");
  assert(receipt.provider_plugin_api_call_budget.max_plugin_calls === 1, "plugin budget mismatch");
  assert(receipt.provider_plugin_api_call_budget.max_api_calls === 1, "api budget mismatch");
  assert(receipt.provider_plugin_api_call_budget.max_images === 1, "image budget mismatch");
  assert(receipt.provider_plugin_api_calls_used.provider_calls === 1, "provider calls used mismatch");
  assert(receipt.provider_plugin_api_calls_used.plugin_calls === 1, "plugin calls used mismatch");
  assert(receipt.provider_plugin_api_calls_used.api_calls === 1, "api calls used mismatch");
  assert(receipt.image_count === 0, "images created must be 0");
  assert(receipt.image_budget_respected === true, "image budget must be respected");
  assert(Array.isArray(receipt.image_files) && receipt.image_files.length === 0, "image files must be empty");
  assert(Array.isArray(receipt.output_files), "output files must be an array");
  assert(receipt.forbidden_writes.daily_note === false, "DailyNote write must be false");
  assert(receipt.forbidden_writes.vcp_memory === false, "VCP memory write must be false");
  assert(receipt.forbidden_writes.accepted_samples === false, "accepted samples write must be false");
  assert(receipt.forbidden_writes.production_candidate === false, "production candidate write must be false");
  assert(receipt.forbidden_writes.push_tag_release_deploy === false, "push/tag/release/deploy must be false");
  assert(receipt.secret_handling.secret_values_printed === false, "secret values must not be printed");
  assert(receipt.secret_handling.secret_values_written === false, "secret values must not be written");
  assert(receipt.local_admin_route.http_status === 200, "admin route HTTP status mismatch");
  assert(receipt.local_admin_route.route_reached === true, "admin route must be reached");
  assert(receipt.local_admin_route.summary.mode === "real_execution", "route mode mismatch");
  assert(receipt.local_admin_route.summary.safety_action === "allow", "safety action must be allow");
  assert(String(receipt.blocker || "").includes("doubao-seedream-3-0-t2i-250415"), "blocker must capture provider-side default-model fallback");
  assert(String(receipt.blocker || "").includes("does not exist or you do not have access to it"), "blocker must capture provider/model access failure");
  assert(receipt.receipt_refs.provider_receipt === receiptRef, "receipt ref mismatch");
  assert(receipt.receipt_refs.review_handoff === reviewHandoffRef, "review handoff ref mismatch");
  assert(receipt.receipt_refs.durable_audit_record === auditRef, "audit ref mismatch");

  assert(handoff.schema === receipt.schema, "handoff schema mismatch");
  assert(handoff.authorization_id === authorizationId, "handoff authorization id mismatch");
  assert(handoff.bridge_type === "review_handoff", "handoff bridge type mismatch");
  assert(handoff.image_count === 0, "handoff image count must be 0");
  assert(audit.schema === receipt.schema, "audit schema mismatch");
  assert(audit.authorization_id === authorizationId, "audit authorization id mismatch");
  assert(audit.audit_type === "durable_runtime_audit_record", "audit type mismatch");

  assertNoSecrets(receipt, "receipt");
  assertNoSecrets(handoff, "handoff");
  assertNoSecrets(audit, "audit");
  assertNoAbsoluteLocalPath(receipt, "receipt");
  assertNoAbsoluteLocalPath(handoff, "handoff");
  assertNoAbsoluteLocalPath(audit, "audit");

  process.stdout.write(`${JSON.stringify({
    passed: true,
    validator: "validate_exact_a5_provider_retry_003_activation_receipt",
    authorization_id: receipt.authorization_id,
    execution_status: receipt.execution_status,
    provider_contact_attempted: receipt.provider_contact_attempted,
    provider_calls_used: receipt.provider_plugin_api_calls_used.provider_calls,
    plugin_calls_used: receipt.provider_plugin_api_calls_used.plugin_calls,
    api_calls_used: receipt.provider_plugin_api_calls_used.api_calls,
    images_created: receipt.image_count,
    model_sent: receipt.model_sent,
    output_directory_ref: receipt.output_directory_ref,
    further_retry_allowed: receipt.further_retry_allowed,
    blocked_on_provider_default_model_fallback: true,
  }, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${JSON.stringify({
    passed: false,
    validator: "validate_exact_a5_provider_retry_003_activation_receipt",
    error: error.message,
  }, null, 2)}\n`);
  process.exitCode = 1;
}
