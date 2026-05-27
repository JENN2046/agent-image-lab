#!/usr/bin/env node
"use strict";

const path = require("node:path");
const providerPreflight = require("./provider_preflight_no_provider_call");

const repoRoot = path.resolve(__dirname, "../..");
const adapterId = "exact_a5_provider_retry_007_preflight_decision_packet_v0";
const packetSchema = "exact_a5_provider_retry_007_preflight_decision_packet.v0";
const decisionId = "P2.2-RETRY-007-PREFLIGHT-DECISION-20260527";
const candidateAuthorizationId = "AUTH-DRAFT-NATIVE-DOUBAO-SEEDREAM5-RETRY-20260527-007";
const requiredModel = "doubao-seedream-5-0-260128";

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
    throw new Error(`${label} must be repository-relative`);
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
    if (value === true) throw new Error(`${label}.${field} must be false in preflight decision`);
  }
}

function buildExactA5ProviderRetry007PreflightDecisionPacket(options = {}) {
  const preflightPacket = options.preflight_packet || providerPreflight.buildProviderPreflightPacket();
  providerPreflight.validateProviderPreflightPacket(preflightPacket);
  const promptRef = normalizeRepoRelativePath(preflightPacket.input_reference, "preflight input reference");
  const outputDirectory = "runs/real_generation/v0_6_73_real_vcp_agent_generation_retry_007";
  const providerReceiptRef = "reports/provider_receipts/v0_6_73_real_vcp_agent_generation_retry_007_receipt.json";
  const reviewHandoffRef = "review_console/live_receipt_bridge/v0_6_73_real_vcp_agent_generation_retry_007/bridge_entry.json";
  const durableAuditNamespace = ".agent_private/runtime_audit_store/v0_6_73_real_vcp_agent_generation_retry_007";

  const packet = {
    packet_schema: packetSchema,
    adapter_id: adapterId,
    decision_id: decisionId,
    phase: "p2_2_retry_007_preflight_decision",
    lane: "Amber_B_provider_image_preflight_decision_only",
    decision_status: "hold_pending_owner_decision",
    candidate_authorization_id: candidateAuthorizationId,
    authorization_status: "not_issued",
    authorization_active: false,
    can_execute_now: false,
    provider_execution_allowed_now: false,
    exact_activation_phrase_issued: false,
    exact_activation_phrase: null,
    requires_separate_owner_authorization: true,
    requires_new_activation_packet_before_execution: true,
    purpose: "Decide whether retry_007 is worth authorizing after P1/P2 evidence governance gates are stable; do not execute provider from this packet.",
    stability_prerequisites: {
      public_disclosure_gate_required: "npm run validate:public-disclosure",
      runtime_core_gate_required: "npm run validate:core",
      mvp_gate_required: "npm run validate:mvp",
      provider_evidence_integrity_gate_required: "npm run validate:provider-evidence-integrity",
      full_archive_gate_required: "npm run validate:all",
      p2_0_validation_gate_semantics_required: true,
      p2_1_provider_evidence_integrity_required: true,
    },
    prior_real_execution_evidence: {
      last_attempt_authorization_id: "AUTH-DRAFT-NATIVE-DOUBAO-SEEDREAM5-RETRY-20260526-006",
      last_attempt_pipeline_id: "v0_6_73_real_vcp_agent_generation_retry_006",
      last_attempt_status: "COMPLETED_PROVIDER_IMAGE_CREATED",
      last_attempt_model: requiredModel,
      last_attempt_output_scope_violation: false,
      last_attempt_review_eligible: true,
      artifact_integrity_validator: "npm run validate:retry-006-artifact-integrity",
      provider_evidence_integrity_validator: "npm run validate:provider-evidence-integrity",
    },
    selected_provider_candidate: {
      provider_id: preflightPacket.selected_provider.provider_id,
      provider_case_id: preflightPacket.selected_provider.provider_case_id,
      selected_plugin_id: preflightPacket.selected_plugin_id,
      command: "generate",
      required_model: requiredModel,
      provider_binding_ref: preflightPacket.selected_provider.provider_binding_ref,
      provider_binding_ref_redacted: true,
      provider_binding_ref_is_secret: false,
      secretless_runtime_required: true,
      secret_owner_process: "VCPToolBox_or_owner_authorized_provider_runtime",
    },
    retry_007_candidate_boundaries: {
      prompt_package_ref: promptRef,
      output_directory_ref: outputDirectory,
      provider_receipt_ref: providerReceiptRef,
      review_handoff_ref: reviewHandoffRef,
      durable_audit_store_root: durableAuditNamespace,
      max_provider_calls_if_later_authorized: 1,
      max_plugin_calls_if_later_authorized: 1,
      max_api_calls_if_later_authorized: 1,
      max_images_if_later_authorized: 1,
      retry_allowed_after_retry_007: false,
      max_retry_count_after_retry_007: 0,
      overwrite_existing_files_allowed: false,
    },
    owner_decision_options: [
      {
        decision: "hold",
        result: "keep retry_007 inactive; no provider contact",
      },
      {
        decision: "reject",
        result: "close retry_007 as not worth the evidence/cost risk",
      },
      {
        decision: "authorize_future_exact_packet",
        result: "create or activate a separate exact retry_007 execution packet with an exact activation phrase",
      },
    ],
    forbidden_now: [
      "provider contact",
      "plugin call",
      "API call",
      "image generation",
      "secret value read",
      "env file content read",
      "output write",
      "provider receipt write",
      "review handoff write",
      "durable audit write",
      "accepted_samples write",
      "production_candidate write",
      "DailyNote write",
      "VCP memory write",
      "push/tag/release/deploy",
    ],
    required_validation_before_any_future_activation: [
      "npm run validate:core",
      "npm run validate:public-disclosure",
      "npm run validate:mvp",
      "npm run validate:provider-evidence-integrity",
      "npm run validate:all",
      "git diff --check",
    ],
    stop_conditions_for_future_activation: [
      "P1/P2 gates fail or are unverified",
      "public disclosure scan finds local path, loopback URL, secret-like string, or raw prompt",
      "provider evidence integrity validator fails",
      "retry_006 artifact integrity no longer matches recorded hash/MIME/dimensions/Git status",
      "exact activation phrase is missing",
      "candidate authorization id mismatch",
      "required model is not doubao-seedream-5-0-260128",
      "provider binding ref would be printed or stored as a secret value",
      "output directory exists and overwrite would be required",
      "budget would exceed one provider/plugin/API call or one image",
      "any automatic retry is requested",
    ],
    current_side_effect_flags: { ...currentSideEffectFlags },
  };

  validateExactA5ProviderRetry007PreflightDecisionPacket(packet);
  return packet;
}

function validateExactA5ProviderRetry007PreflightDecisionPacket(packet) {
  assertObject(packet, "packet");
  if (packet.packet_schema !== packetSchema) throw new Error("packet_schema mismatch");
  if (packet.adapter_id !== adapterId) throw new Error("adapter_id mismatch");
  if (packet.decision_id !== decisionId) throw new Error("decision_id mismatch");
  if (packet.candidate_authorization_id !== candidateAuthorizationId) throw new Error("candidate authorization id mismatch");
  if (packet.authorization_status !== "not_issued") throw new Error("authorization must not be issued by this packet");
  if (packet.authorization_active !== false || packet.can_execute_now !== false || packet.provider_execution_allowed_now !== false) {
    throw new Error("retry_007 preflight decision must not execute now");
  }
  if (packet.exact_activation_phrase_issued !== false || packet.exact_activation_phrase !== null) {
    throw new Error("retry_007 preflight decision must not issue an activation phrase");
  }
  if (packet.requires_separate_owner_authorization !== true || packet.requires_new_activation_packet_before_execution !== true) {
    throw new Error("retry_007 must require separate future authorization");
  }
  if (packet.prior_real_execution_evidence.last_attempt_authorization_id !== "AUTH-DRAFT-NATIVE-DOUBAO-SEEDREAM5-RETRY-20260526-006") {
    throw new Error("retry_006 evidence anchor mismatch");
  }
  if (packet.prior_real_execution_evidence.last_attempt_status !== "COMPLETED_PROVIDER_IMAGE_CREATED") {
    throw new Error("retry_006 status mismatch");
  }
  if (packet.selected_provider_candidate.required_model !== requiredModel) throw new Error("required model mismatch");
  if (packet.selected_provider_candidate.provider_binding_ref !== "native_doubao:capability:owner-runtime:<redacted>") {
    throw new Error("provider binding ref must remain redacted");
  }
  if (packet.retry_007_candidate_boundaries.output_directory_ref !== "runs/real_generation/v0_6_73_real_vcp_agent_generation_retry_007") {
    throw new Error("retry_007 output directory mismatch");
  }
  if (!packet.retry_007_candidate_boundaries.provider_receipt_ref.includes("retry_007_receipt.json")) {
    throw new Error("retry_007 receipt ref mismatch");
  }
  if (packet.retry_007_candidate_boundaries.retry_allowed_after_retry_007 !== false) throw new Error("future retry must be false");
  if (packet.retry_007_candidate_boundaries.max_provider_calls_if_later_authorized !== 1) throw new Error("provider call budget mismatch");
  if (!packet.required_validation_before_any_future_activation.includes("npm run validate:provider-evidence-integrity")) {
    throw new Error("provider evidence integrity validation is required before future activation");
  }
  if (!packet.required_validation_before_any_future_activation.includes("npm run validate:all")) {
    throw new Error("full archive validation is required before future activation");
  }
  assertFalseFlags(packet.current_side_effect_flags, "current_side_effect_flags");
  return true;
}

if (require.main === module) {
  process.stdout.write(`${JSON.stringify(buildExactA5ProviderRetry007PreflightDecisionPacket(), null, 2)}\n`);
}

module.exports = {
  buildExactA5ProviderRetry007PreflightDecisionPacket,
  validateExactA5ProviderRetry007PreflightDecisionPacket,
};
