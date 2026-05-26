#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const runner = require("./run_native_doubao_image_generation");
const packetBuilder = require("../adapters/runtime/exact_a5_provider_execution_packet_draft");

const root = path.resolve(__dirname, "..");
const expectedAuthorizationId = "AUTH-DRAFT-NATIVE-DOUBAO-ONE-SHOT-20260526-001";
const expectedActivationPhrase = packetBuilder.exactActivationPhrase;
const receiptRef = "reports/provider_receipts/v0_6_73_real_vcp_agent_generation_one_shot_receipt.json";
const reviewHandoffRef = "review_console/live_receipt_bridge/v0_6_73_real_vcp_agent_generation_one_shot/bridge_entry.json";
const auditRef = ".agent_private/runtime_audit_store/v0_6_73_real_vcp_agent_generation_one_shot/activation_attempt_001.audit.json";

function assertObject(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${label} must be an object`);
  }
}

function normalizeRepoRelativePath(value, label) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${label} must be a non-empty string`);
  }
  if (path.isAbsolute(value) || /^[A-Za-z]:[\\/]/.test(value)) {
    throw new Error(`${label} must be repository-relative`);
  }
  const normalized = value.replace(/\\/g, "/");
  if (normalized.split("/").includes("..")) {
    throw new Error(`${label} must not contain traversal segments`);
  }
  const resolved = path.resolve(root, normalized);
  const relative = path.relative(root, resolved).replace(/\\/g, "/");
  if (relative.startsWith("../") || relative === ".." || path.isAbsolute(relative)) {
    throw new Error(`${label} escapes repository root`);
  }
  return { normalized: relative, resolved };
}

function writeJson(relativePath, payload, { overwrite = false } = {}) {
  const target = normalizeRepoRelativePath(relativePath, "write target");
  fs.mkdirSync(path.dirname(target.resolved), { recursive: true });
  fs.writeFileSync(target.resolved, `${JSON.stringify(payload, null, 2)}\n`, { flag: overwrite ? "w" : "wx" });
  return target.normalized;
}

function parseActivationPhrase(argv) {
  const index = argv.indexOf("--activation-phrase");
  if (index < 0) {
    return "";
  }
  return argv[index + 1] || "";
}

function buildProviderRunOptions(packet) {
  return {
    runner_case_id: packet.selected_provider.provider_case_id,
    prompt_package_ref: packet.allowed_operation_when_activated.prompt_package_ref,
    plugin_profile_ref: "plugins/image_generation/native_doubao_image/plugin.profile.yaml",
    output_directory: `${packet.allowed_operation_when_activated.output_directory_ref}/`,
    model: packet.selected_provider.model,
    max_plugin_calls: packet.activation_budget.max_plugin_calls,
    max_images_created: packet.activation_budget.max_images_created,
    retry_allowed: false,
    dryRun: false,
    execution_authorized: true,
    a5_activation_ref: packet.authorization_id,
    provider_binding_ref: packetBuilder.exactActivationPhrase.includes(packet.authorization_id)
      ? packetBuilder.buildExactA5ProviderExecutionPacketDraft().selected_provider.provider_binding_ref.replace("<redacted>", "v0_6_73")
      : null,
    provider_binding_ref_redacted: true,
    provider_binding_ref_is_secret: false,
    secretless_runtime_required: true,
  };
}

function sanitizeRunnerResult(result) {
  assertObject(result, "runner result");
  return {
    status: result.status || "UNKNOWN",
    runner: result.runner || "run_native_doubao_image_generation",
    plugin_id: result.plugin_id || "NativeDoubaoImage",
    runner_case_id: result.runner_case_id || null,
    provider_binding_ref_redacted: result.provider_binding_ref_redacted === true,
    provider_binding_ref_is_secret: result.provider_binding_ref_is_secret === true ? true : false,
    required_runtime_owner: result.required_runtime_owner || "VCPToolBox_or_owner_authorized_provider_runtime",
    required_runtime_contract: result.required_runtime_contract || "secretless_provider_runtime_function",
    blocker: result.runtime_bridge_result?.blocker ||
      result.delegate_authorization?.blocker ||
      (result.status === "BLOCKED_SECRETLESS_RUNTIME_NOT_CALLABLE" ? "secretless_provider_runtime_not_callable" : null),
    api_call_performed: result.api_call_performed === true,
    plugin_call_performed: result.plugin_call_performed === true,
    provider_contact_performed: result.provider_contact_performed === true,
    image_generation_performed: result.image_generation_performed === true || result.image_created === true,
    image_created: result.image_created === true,
    image_count: result.adapter_result?.image_count || 0,
    output_write_performed: result.output_write_performed === true,
    local_files_written_count: result.adapter_result?.local_files_written_count || 0,
    output_files: Array.isArray(result.adapter_result?.output_files) ? result.adapter_result.output_files : [],
    env_file_content_read_performed: result.env_file_content_read_performed === true,
    secret_value_read_performed: result.secret_value_read_performed === true,
    raw_provider_payload_retained: result.raw_provider_payload_retained === true,
    human_review_required_now: result.human_review_required_now === true,
  };
}

async function runActivation({ activationPhrase }) {
  if (activationPhrase !== expectedActivationPhrase) {
    throw new Error("exact activation phrase mismatch");
  }

  const packet = packetBuilder.buildExactA5ProviderExecutionPacketDraft();
  packetBuilder.validateExactA5ProviderExecutionPacketDraft(packet);
  if (packet.authorization_id !== expectedAuthorizationId) {
    throw new Error("authorization id mismatch");
  }

  const runOptions = buildProviderRunOptions(packet);
  const rawResult = await runner.run(runOptions);
  const result = sanitizeRunnerResult(rawResult);

  const budget = {
    max_provider_calls: 1,
    max_plugin_calls: 1,
    max_api_calls: 1,
    max_images_created: 1,
    retry_allowed: false,
    retry_count: 0,
  };

  const counts = {
    provider_calls_used: result.provider_contact_performed ? 1 : 0,
    plugin_calls_used: result.plugin_call_performed ? 1 : 0,
    api_calls_used: result.api_call_performed ? 1 : 0,
    images_created: result.image_generation_performed ? Math.max(1, result.image_count || 0) : 0,
    output_files_written: result.output_write_performed ? result.local_files_written_count : 0,
  };

  const sideEffects = {
    provider_contact_performed: result.provider_contact_performed,
    plugin_call_performed: result.plugin_call_performed,
    api_call_performed: result.api_call_performed,
    image_generation_performed: result.image_generation_performed,
    env_file_content_read_performed: result.env_file_content_read_performed,
    secret_value_read_performed: result.secret_value_read_performed,
    output_write_performed: result.output_write_performed,
    production_write_performed: false,
    accepted_samples_write_performed: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false,
    push_tag_release_deploy_performed: false,
  };

  const executionStatus = result.status;
  const noImage = counts.images_created === 0;
  const receipt = {
    receipt_schema: "exact_a5_provider_execution_activation_receipt.v0",
    authorization_id: packet.authorization_id,
    activation_phrase_matched: true,
    execution_status: executionStatus,
    execution_completed: result.image_generation_performed === true,
    execution_blocked_fail_closed: !result.provider_contact_performed && noImage,
    selected_provider_id: packet.selected_provider.provider_id,
    provider_case_id: packet.selected_provider.provider_case_id,
    model: packet.selected_provider.model,
    prompt_package_ref: packet.allowed_operation_when_activated.prompt_package_ref,
    output_directory_ref: `${packet.allowed_operation_when_activated.output_directory_ref}/`,
    provider_binding_ref: packet.selected_provider.provider_binding_ref,
    provider_binding_ref_redacted: true,
    provider_binding_ref_is_secret: false,
    budget,
    counts,
    runner_result: result,
    side_effect_flags: sideEffects,
    receipt_ref: receiptRef,
    review_handoff_ref: reviewHandoffRef,
    durable_audit_ref: auditRef,
    retry_performed: false,
    raw_provider_payload_retained: false,
    secret_value_recorded: false,
    human_review_required_before_promotion: true,
  };

  const reviewHandoff = {
    review_handoff_schema: "exact_a5_provider_execution_review_handoff.v0",
    authorization_id: packet.authorization_id,
    execution_status: executionStatus,
    review_status: result.image_generation_performed ? "pending_human_review" : "blocked_no_image_to_review",
    provider_receipt_ref: receiptRef,
    output_directory_ref: `${packet.allowed_operation_when_activated.output_directory_ref}/`,
    output_files: result.output_files,
    image_created: result.image_generation_performed,
    accepted_candidate: false,
    commercial_delivery_ready: false,
    memory_suitability: "deferred",
    side_effect_flags: sideEffects,
  };

  const audit = {
    audit_schema: "exact_a5_provider_execution_activation_audit.v0",
    authorization_id: packet.authorization_id,
    execution_status: executionStatus,
    provider_receipt_ref: receiptRef,
    review_handoff_ref: reviewHandoffRef,
    side_effect_flags: sideEffects,
    counts,
    blocker: result.blocker,
  };

  writeJson(receiptRef, receipt, { overwrite: true });
  writeJson(reviewHandoffRef, reviewHandoff, { overwrite: true });
  writeJson(auditRef, audit, { overwrite: true });

  return {
    passed: true,
    runner: "run_exact_a5_provider_execution_packet",
    authorization_id: packet.authorization_id,
    activation_phrase_matched: true,
    execution_status: executionStatus,
    execution_blocked_fail_closed: receipt.execution_blocked_fail_closed,
    receipt_ref: receiptRef,
    review_handoff_ref: reviewHandoffRef,
    durable_audit_ref: auditRef,
    provider_contact_performed: sideEffects.provider_contact_performed,
    plugin_call_performed: sideEffects.plugin_call_performed,
    api_call_performed: sideEffects.api_call_performed,
    image_generation_performed: sideEffects.image_generation_performed,
    env_file_content_read_performed: sideEffects.env_file_content_read_performed,
    secret_value_read_performed: sideEffects.secret_value_read_performed,
    output_write_performed: sideEffects.output_write_performed,
    retry_performed: false,
  };
}

if (require.main === module) {
  runActivation({ activationPhrase: parseActivationPhrase(process.argv.slice(2)) })
    .then((result) => {
      process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    })
    .catch((error) => {
      process.stderr.write(`${JSON.stringify({
        passed: false,
        runner: "run_exact_a5_provider_execution_packet",
        error: error.message,
        provider_contact_performed: false,
        image_generation_performed: false,
        secret_value_read_performed: false,
      }, null, 2)}\n`);
      process.exitCode = 1;
    });
}

module.exports = {
  expectedAuthorizationId,
  expectedActivationPhrase,
  receiptRef,
  reviewHandoffRef,
  auditRef,
  runActivation,
};
