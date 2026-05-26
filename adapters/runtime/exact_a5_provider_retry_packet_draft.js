#!/usr/bin/env node
"use strict";

const path = require("node:path");
const providerPreflight = require("./provider_preflight_no_provider_call");

const repoRoot = path.resolve(__dirname, "../..");
const adapterId = "exact_a5_provider_retry_packet_draft_v0";
const packetSchema = "exact_a5_provider_retry_packet_draft.v0";
const authorizationId = "AUTH-DRAFT-NATIVE-DOUBAO-SEEDREAM5-RETRY-20260526-002";
const requiredModel = "doubao-seedream-5-0-260128";
const previousAuthorizationId = "AUTH-DRAFT-NATIVE-DOUBAO-ONE-SHOT-20260526-001";
const exactActivationPhrase = "我授权执行 AUTH-DRAFT-NATIVE-DOUBAO-SEEDREAM5-RETRY-20260526-002：NativeDoubao Seedream 5 单次真实重试，最多 1 次 provider/plugin/API 调用，最多 1 张图，禁止再次重试，必须传入 model=doubao-seedream-5-0-260128，禁止读取 secret 值，禁止写 DailyNote/VCP memory/accepted_samples/production_candidate，输出仅限 runs/real_generation/v0_6_73_real_vcp_agent_generation_retry_002/，执行后写 retry provider receipt、review handoff、durable audit record。";

const currentSideEffectFlags = Object.freeze({
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  image_generation_performed: false,
  env_file_content_read_performed: false,
  secret_value_read_performed: false,
  output_write_performed: false,
  provider_receipt_write_performed: false,
  review_handoff_write_performed: false,
  durable_audit_write_performed: false,
  production_write_performed: false,
  accepted_samples_write_performed: false,
  DailyNote_write_performed: false,
  VCP_memory_write_performed: false,
  push_tag_release_deploy_performed: false,
});

function assertObject(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${label} must be an object`);
  }
}

function assertString(value, label) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${label} must be a non-empty string`);
  }
}

function normalizeRepoRelativePath(value, label) {
  assertString(value, label);
  if (path.isAbsolute(value) || /^[A-Za-z]:[\\/]/.test(value)) {
    throw new Error(`${label} must be a repository-relative path`);
  }
  const normalized = value.replace(/\\/g, "/").replace(/\/+$/, "");
  if (normalized.split("/").includes("..")) {
    throw new Error(`${label} must not contain traversal segments`);
  }
  const resolved = path.resolve(repoRoot, normalized);
  const relative = path.relative(repoRoot, resolved).replace(/\\/g, "/");
  if (relative.startsWith("../") || relative === ".." || path.isAbsolute(relative)) {
    throw new Error(`${label} escapes repository root`);
  }
  return relative;
}

function assertFalseFlags(flags, label) {
  for (const [field, value] of Object.entries(flags || {})) {
    if (value === true) {
      throw new Error(`${label}.${field} must be false before retry activation`);
    }
  }
}

function buildExactA5ProviderRetryPacketDraft(options = {}) {
  const preflightPacket = options.preflight_packet || providerPreflight.buildProviderPreflightPacket();
  providerPreflight.validateProviderPreflightPacket(preflightPacket);

  const promptRef = normalizeRepoRelativePath(preflightPacket.input_reference, "preflight input reference");
  const outputDirectory = "runs/real_generation/v0_6_73_real_vcp_agent_generation_retry_002";
  const providerReceiptRef = "reports/provider_receipts/v0_6_73_real_vcp_agent_generation_retry_002_receipt.json";
  const reviewHandoffRef = "review_console/live_receipt_bridge/v0_6_73_real_vcp_agent_generation_retry_002/bridge_entry.json";
  const durableAuditNamespace = ".agent_private/runtime_audit_store/v0_6_73_real_vcp_agent_generation_retry_002";

  const packet = {
    packet_schema: packetSchema,
    adapter_id: adapterId,
    authorization_id: authorizationId,
    phase: "exact_a5_provider_retry_packet_draft",
    lane: "Amber_B_provider_image_retry_when_activated",
    authorization_status: "draft_not_active",
    authorization_active: false,
    can_execute_now: false,
    requires_exact_user_activation: true,
    exact_activation_phrase: exactActivationPhrase,
    previous_attempt: {
      previous_authorization_id: previousAuthorizationId,
      previous_attempt_status: "BLOCKED_PROVIDER_RUNTIME_DELEGATE_FAILED",
      previous_provider_calls_used: 1,
      previous_plugin_calls_used: 1,
      previous_api_calls_used: 1,
      previous_images_created: 0,
      previous_retry_performed: false,
      previous_blocker: "provider reported model or endpoint doubao-seedream-3-0-t2i-250415 does not exist or is not accessible",
      previous_authorization_consumed: true,
    },
    prerequisite_fix: {
      fix_status: "completed_validated",
      target_repo: "A:\\VCP\\apps\\VCPToolBox",
      model_passthrough_fix_ref: "A:\\VCP\\apps\\VCPToolBox\\modules\\aiImageExecutionAdapter.js",
      model_passthrough_test_ref: "A:\\VCP\\apps\\VCPToolBox\\tests\\aiImageExecutionAdapter.test.js",
      required_model: requiredModel,
      validation_refs: [
        "node --check modules\\aiImageExecutionAdapter.js",
        "node --test tests\\aiImageExecutionAdapter.test.js",
      ],
    },
    selected_provider: {
      provider_id: preflightPacket.selected_provider.provider_id,
      provider_case_id: preflightPacket.selected_provider.provider_case_id,
      selected_plugin_id: preflightPacket.selected_plugin_id,
      command: "generate",
      model: requiredModel,
      provider_binding_ref: preflightPacket.selected_provider.provider_binding_ref,
      provider_binding_ref_redacted: true,
      provider_binding_ref_is_secret: false,
      secretless_runtime_required: true,
      secret_owner_process: "VCPToolBox_or_owner_authorized_provider_runtime",
    },
    target_systems: [
      "owner_authorized_provider_runtime",
      "NativeDoubaoImage",
      "local_runtime_artifact_review_audit_chain",
    ],
    exact_allowed_paths_or_objects: [
      promptRef,
      "plugins/image_generation/native_doubao_image/plugin.profile.yaml",
      "scripts/run_native_doubao_image_generation.js",
      "scripts/native_doubao_secretless_provider_runtime_bridge.js",
      "adapters/image_generation/native_doubao_adapter.js",
      "plugins/image_generation/native_doubao_image/native_doubao_image.js",
      outputDirectory,
      providerReceiptRef,
      reviewHandoffRef,
      durableAuditNamespace,
    ],
    forbidden_paths_or_objects: [
      ".env",
      ".env.local",
      ".env.*.local",
      "configs/local_secrets/",
      "accepted_samples/",
      "production_candidate",
      "previous one-shot output path",
      "external repositories except the already-fixed local VCPToolBox source tree",
      "real VCPChat source mutation",
      "raw provider payload retention",
      "push/tag/release/deploy",
    ],
    allowed_operation_when_activated: {
      operation: "single_native_doubao_seedream5_real_retry",
      execute_one_action_only_per_loop: true,
      command_template: "node scripts/run_native_doubao_image_generation.js --case-id=neutral_smoke_test_red_apple_secretless_bridge --dry-run=false --execution-authorized=true --secretless-runtime-required=true --provider-binding-ref=<owner-runtime-handle> --provider-binding-ref-redacted=true --provider-binding-ref-is-secret=false --model=doubao-seedream-5-0-260128",
      prompt_package_ref: promptRef,
      required_model: requiredModel,
      output_directory_ref: outputDirectory,
      provider_receipt_ref: providerReceiptRef,
      review_handoff_ref: reviewHandoffRef,
      durable_audit_store_root: durableAuditNamespace,
    },
    activation_budget: {
      max_provider_calls: 1,
      max_plugin_calls: 1,
      max_api_calls: 1,
      max_images_created: 1,
      retry_allowed: false,
      max_retry_count: 0,
      max_runtime_probe_minutes: 10,
      max_cost_amount: "owner_runtime_account_metered",
      cost_unknown_is_red: true,
    },
    current_budget_before_activation: {
      provider_calls: 0,
      plugin_calls: 0,
      api_calls: 0,
      image_candidates: 0,
      output_writes: 0,
      cost_amount: 0,
    },
    write_boundaries_when_activated: {
      output_directory_ref: outputDirectory,
      provider_receipt_ref: providerReceiptRef,
      review_handoff_ref: reviewHandoffRef,
      durable_audit_store_root: durableAuditNamespace,
      overwrite_existing_files_allowed: false,
      production_candidate_write_allowed: false,
      accepted_samples_write_allowed: false,
      DailyNote_write_allowed: false,
      VCP_memory_write_allowed: false,
      push_tag_release_deploy_allowed: false,
    },
    validation_required_before_activation: [
      "npm run validate:provider-preflight",
      "node scripts/validate_v0_6_73am_vcptoolbox_real_runtime_binding_no_provider_verify_and_agent_lab_sync.js",
      "node scripts/validate_v0_6_73an_vcptoolbox_runtime_dry_run_no_provider_verify.js",
      "npm run validate:exact-a5-provider-retry-packet",
      "git diff --check",
    ],
    validation_required_after_activation: [
      "provider retry receipt schema validation",
      "review handoff schema validation",
      "durable audit record validation",
      "human review required before production promotion",
    ],
    stop_conditions: [
      "exact activation phrase missing or changed",
      "authorization_id mismatch",
      "required model is not doubao-seedream-5-0-260128",
      "VCPToolBox model passthrough fix is unavailable or reverted",
      "provider binding ref is not redacted in repository output",
      "provider binding value is treated as secret or printed",
      "secret value read is required",
      "env file content read is required",
      "provider/plugin/API call budget would exceed 1",
      "more than one image would be created",
      "any retry beyond this single attempt would be required",
      "output path already exists or overwrite would be required",
      "raw provider payload retention is requested",
      "DailyNote/VCP memory/accepted_samples/production write is requested",
      "push/tag/release/deploy is requested",
      "cost is unknown in a way the owner cannot accept",
    ],
    rollback_or_cleanup_plan: [
      "If draft remains inactive, revert local packet/docs/validator changes before commit.",
      "If activated and provider call fails before output, record failed retry receipt and stop without another retry.",
      "If activated and one image is created, keep it under ignored runs/ output, write sanitized retry receipt/review/audit records, and require human review before any promotion.",
      "No automatic deletion of generated output is authorized by this draft.",
    ],
    evidence_to_record_when_activated: [
      "provider call count",
      "plugin call count",
      "api call count",
      "image count",
      "explicit Seedream 5 model value",
      "sanitized retry provider receipt",
      "review handoff entry",
      "durable audit record",
      "human review pending state",
    ],
    current_side_effect_flags: { ...currentSideEffectFlags },
  };

  validateExactA5ProviderRetryPacketDraft(packet);
  return packet;
}

function validateExactA5ProviderRetryPacketDraft(packet) {
  assertObject(packet, "packet");
  if (packet.packet_schema !== packetSchema) throw new Error("packet_schema mismatch");
  if (packet.adapter_id !== adapterId) throw new Error("adapter_id mismatch");
  if (packet.authorization_id !== authorizationId) throw new Error("authorization_id mismatch");
  if (packet.authorization_status !== "draft_not_active" || packet.authorization_active !== false) {
    throw new Error("packet must remain draft_not_active");
  }
  if (packet.can_execute_now !== false || packet.requires_exact_user_activation !== true) {
    throw new Error("packet must require exact user activation");
  }
  if (packet.exact_activation_phrase !== exactActivationPhrase) throw new Error("exact activation phrase mismatch");
  if (!packet.exact_activation_phrase.includes(authorizationId) || !packet.exact_activation_phrase.includes(requiredModel)) {
    throw new Error("exact activation phrase must name authorization id and required model");
  }
  assertObject(packet.previous_attempt, "packet.previous_attempt");
  if (packet.previous_attempt.previous_authorization_id !== previousAuthorizationId ||
      packet.previous_attempt.previous_authorization_consumed !== true ||
      packet.previous_attempt.previous_provider_calls_used !== 1 ||
      packet.previous_attempt.previous_plugin_calls_used !== 1 ||
      packet.previous_attempt.previous_api_calls_used !== 1 ||
      packet.previous_attempt.previous_images_created !== 0) {
    throw new Error("previous consumed attempt evidence mismatch");
  }
  if (!String(packet.previous_attempt.previous_blocker).includes("doubao-seedream-3-0-t2i-250415")) {
    throw new Error("previous blocker must record the old model endpoint failure");
  }
  assertObject(packet.prerequisite_fix, "packet.prerequisite_fix");
  if (packet.prerequisite_fix.required_model !== requiredModel ||
      packet.prerequisite_fix.fix_status !== "completed_validated") {
    throw new Error("model passthrough prerequisite fix mismatch");
  }
  assertObject(packet.selected_provider, "packet.selected_provider");
  if (packet.selected_provider.model !== requiredModel ||
      packet.allowed_operation_when_activated.required_model !== requiredModel ||
      !packet.allowed_operation_when_activated.command_template.includes(`--model=${requiredModel}`)) {
    throw new Error("required Seedream 5 model must be enforced");
  }
  if (packet.selected_provider.provider_binding_ref !== providerPreflight.redactedProviderBindingRef) {
    throw new Error("provider binding ref must be redacted");
  }
  if (packet.activation_budget.max_provider_calls !== 1 ||
      packet.activation_budget.max_plugin_calls !== 1 ||
      packet.activation_budget.max_api_calls !== 1 ||
      packet.activation_budget.max_images_created !== 1) {
    throw new Error("activation budget must be one-shot");
  }
  if (packet.activation_budget.retry_allowed !== false || packet.activation_budget.max_retry_count !== 0) {
    throw new Error("retry must be forbidden");
  }
  for (const item of packet.exact_allowed_paths_or_objects) {
    normalizeRepoRelativePath(item, "exact_allowed_paths_or_objects item");
  }
  const refs = packet.allowed_operation_when_activated;
  if (refs.output_directory_ref !== "runs/real_generation/v0_6_73_real_vcp_agent_generation_retry_002" ||
      refs.provider_receipt_ref !== "reports/provider_receipts/v0_6_73_real_vcp_agent_generation_retry_002_receipt.json" ||
      refs.review_handoff_ref !== "review_console/live_receipt_bridge/v0_6_73_real_vcp_agent_generation_retry_002/bridge_entry.json" ||
      refs.durable_audit_store_root !== ".agent_private/runtime_audit_store/v0_6_73_real_vcp_agent_generation_retry_002") {
    throw new Error("retry_002 output, receipt, review, and audit refs must be exact");
  }
  if (refs.output_directory_ref.includes("one_shot") ||
      refs.provider_receipt_ref.includes("one_shot") ||
      refs.review_handoff_ref.includes("one_shot")) {
    throw new Error("retry packet must not reuse previous one-shot refs");
  }
  if (packet.write_boundaries_when_activated.overwrite_existing_files_allowed !== false ||
      packet.write_boundaries_when_activated.production_candidate_write_allowed !== false ||
      packet.write_boundaries_when_activated.accepted_samples_write_allowed !== false ||
      packet.write_boundaries_when_activated.DailyNote_write_allowed !== false ||
      packet.write_boundaries_when_activated.VCP_memory_write_allowed !== false) {
    throw new Error("forbidden write boundaries must stay false");
  }
  assertFalseFlags(packet.current_side_effect_flags, "packet.current_side_effect_flags");
  const stopText = packet.stop_conditions.join("\n");
  for (const required of [
    "exact activation phrase",
    requiredModel,
    "secret value read",
    "env file content read",
    "budget would exceed 1",
    "more than one image",
    "retry beyond this single attempt",
    "output path already exists",
    "raw provider payload",
    "DailyNote/VCP memory",
    "push/tag/release/deploy",
  ]) {
    if (!stopText.includes(required)) {
      throw new Error(`stop condition missing: ${required}`);
    }
  }
  if (!packet.validation_required_before_activation.includes("npm run validate:exact-a5-provider-retry-packet")) {
    throw new Error("retry packet validator must be required before activation");
  }
  return true;
}

function main() {
  const packet = buildExactA5ProviderRetryPacketDraft();
  console.log(JSON.stringify(packet, null, 2));
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(JSON.stringify({
      adapter_id: adapterId,
      passed: false,
      error: error.message,
      current_side_effect_flags: { ...currentSideEffectFlags },
    }, null, 2));
    process.exitCode = 1;
  }
}

module.exports = {
  adapterId,
  packetSchema,
  authorizationId,
  exactActivationPhrase,
  requiredModel,
  previousAuthorizationId,
  currentSideEffectFlags,
  buildExactA5ProviderRetryPacketDraft,
  validateExactA5ProviderRetryPacketDraft,
};
