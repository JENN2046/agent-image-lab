#!/usr/bin/env node
"use strict";

const path = require("node:path");
const retry007Preflight = require("./exact_a5_provider_retry_007_preflight_decision_packet");

const repoRoot = path.resolve(__dirname, "../..");
const adapterId = "exact_a5_provider_retry_007_activation_packet_draft_v0";
const packetSchema = "exact_a5_provider_retry_007_activation_packet_draft.v0";
const authorizationId = "AUTH-DRAFT-NATIVE-DOUBAO-SEEDREAM5-RETRY-20260527-007";
const requiredModel = "doubao-seedream-5-0-260128";
const outputOverrideRepairPackageRef = "docs/EXACT_A5_PROVIDER_RETRY_007_VCPTOOLBOX_OUTPUT_OVERRIDE_REPAIR_PACKAGE.md";
const exactActivationPhrase = "我授权执行 AUTH-DRAFT-NATIVE-DOUBAO-SEEDREAM5-RETRY-20260527-007：NativeDoubao Seedream 5 retry_007 单次真实生成，最多 1 次 provider/plugin/API 调用，最多 1 张图，禁止再次重试，必须传入 model=doubao-seedream-5-0-260128，禁止读取 secret 值，禁止写 DailyNote/VCP memory/accepted_samples/production_candidate，输出仅限 runs/real_generation/v0_6_73_real_vcp_agent_generation_retry_007/，执行后写 retry_007 provider receipt、review handoff、durable audit record。";

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
    if (value === true) throw new Error(`${label}.${field} must be false before activation`);
  }
}

function buildExactA5ProviderRetry007ActivationPacketDraft(options = {}) {
  const preflightPacket = options.preflight_decision_packet ||
    retry007Preflight.buildExactA5ProviderRetry007PreflightDecisionPacket();
  retry007Preflight.validateExactA5ProviderRetry007PreflightDecisionPacket(preflightPacket);

  const boundaries = preflightPacket.retry_007_candidate_boundaries;
  const promptRef = normalizeRepoRelativePath(boundaries.prompt_package_ref, "prompt package ref");
  const outputDirectory = normalizeRepoRelativePath(boundaries.output_directory_ref, "retry_007 output directory");
  const providerReceiptRef = normalizeRepoRelativePath(boundaries.provider_receipt_ref, "retry_007 provider receipt");
  const reviewHandoffRef = normalizeRepoRelativePath(boundaries.review_handoff_ref, "retry_007 review handoff");
  const durableAuditNamespace = normalizeRepoRelativePath(boundaries.durable_audit_store_root, "retry_007 durable audit root");

  const packet = {
    packet_schema: packetSchema,
    adapter_id: adapterId,
    authorization_id: authorizationId,
    phase: "exact_a5_provider_retry_007_activation_packet_draft",
    lane: "Amber_B_provider_image_retry_007_when_activated",
    authorization_status: "draft_not_active",
    authorization_active: false,
    can_execute_now: false,
    requires_exact_user_activation: true,
    activation_phrase_status: "draft_phrase_not_owner_issued",
    exact_activation_phrase: exactActivationPhrase,
    source_preflight_decision_ref: "adapters/runtime/exact_a5_provider_retry_007_preflight_decision_packet.js",
    source_preflight_decision: {
      decision_id: preflightPacket.decision_id,
      decision_status: preflightPacket.decision_status,
      authorization_status: preflightPacket.authorization_status,
      authorization_active: preflightPacket.authorization_active,
      can_execute_now: preflightPacket.can_execute_now,
      exact_activation_phrase_issued: preflightPacket.exact_activation_phrase_issued,
      candidate_authorization_id: preflightPacket.candidate_authorization_id,
      provider_execution_allowed_now: preflightPacket.provider_execution_allowed_now,
    },
    execution_surface_precondition: {
      status: "satisfied_vcptoolbox_retry_007_output_override_repair_applied",
      repair_package_ref: outputOverrideRepairPackageRef,
      external_repo_write_allowed_now: false,
      real_vcptoolbox_patch_allowed_now: false,
      vcptoolbox_retry_007_output_override_repair_applied: true,
      vcptoolbox_retry_007_output_override_repair_validated: true,
      current_route_authorizes_retry_007_output_override: true,
      current_route_test_covers_retry_007_output_override: true,
      required_vcptoolbox_repo: "A:\\VCP\\apps\\VCPToolBox",
      required_vcptoolbox_head_reviewed: "94f2f597_plus_authorized_local_two_file_repair",
      required_route_file: "A:\\VCP\\apps\\VCPToolBox\\routes\\admin\\aiImageAgents.js",
      required_test_file: "A:\\VCP\\apps\\VCPToolBox\\tests\\aiImageAgentsRoute.test.js",
      required_authorization_id: authorizationId,
      required_output_root: "A:\\agent-image-lab\\agent-image-lab-v0.2\\runs\\real_generation\\v0_6_73_real_vcp_agent_generation_retry_007",
      can_execute_provider_before_repair: false,
    },
    prior_real_execution_evidence: {
      ...preflightPacket.prior_real_execution_evidence,
    },
    selected_provider: {
      provider_id: preflightPacket.selected_provider_candidate.provider_id,
      provider_case_id: preflightPacket.selected_provider_candidate.provider_case_id,
      selected_plugin_id: preflightPacket.selected_provider_candidate.selected_plugin_id,
      command: "generate",
      model: requiredModel,
      provider_binding_ref: preflightPacket.selected_provider_candidate.provider_binding_ref,
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
      "runs/real_generation/v0_6_73_real_vcp_agent_generation_retry_006/",
      "reports/provider_receipts/v0_6_73_real_vcp_agent_generation_retry_006_receipt.json",
      "review_console/live_receipt_bridge/v0_6_73_real_vcp_agent_generation_retry_006/",
      "raw provider payload retention",
      "push/tag/release/deploy",
    ],
    allowed_operation_when_activated: {
      operation: "single_native_doubao_seedream5_retry_007_real_generation",
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
      "npm run validate:core",
      "npm run validate:public-disclosure",
      "npm run validate:mvp",
      "npm run validate:provider-evidence-integrity",
      "npm run validate:all",
      "node scripts/validate_exact_a5_provider_retry_007_activation_packet_draft.js",
      "node scripts/validate_exact_a5_provider_retry_007_vcptoolbox_output_override_repair_package.js",
      "VCPToolBox retry_007 output override repair applied and validated",
      "VCPToolBox node --check routes\\admin\\aiImageAgents.js",
      "VCPToolBox node --test tests\\aiImageAgentsRoute.test.js",
      "VCPToolBox node --test tests\\aiImageExecutionAdapter.test.js",
      "git diff --check",
    ],
    validation_required_after_activation: [
      "retry_007 provider receipt schema validation",
      "retry_007 review handoff schema validation",
      "retry_007 durable audit record validation",
      "provider evidence integrity validation",
      "human review required before production promotion",
    ],
    stop_conditions: [
      "exact activation phrase missing or changed",
      "authorization_id mismatch",
      "source preflight decision no longer matches retry_007 boundaries",
      "VCPToolBox retry_007 output override repair validation is missing or stale",
      "required model is not doubao-seedream-5-0-260128",
      "provider binding ref is not redacted in repository output",
      "provider binding value is treated as secret or printed",
      "secret value read is required",
      "env file content read is required",
      "provider/plugin/API call budget would exceed 1",
      "more than one image would be created",
      "any retry beyond retry_007 would be required",
      "output path already exists or overwrite would be required",
      "retry_006 output, receipt, review, or audit refs would be reused",
      "raw provider payload retention is requested",
      "DailyNote/VCP memory/accepted_samples/production write is requested",
      "push/tag/release/deploy is requested",
      "cost is unknown in a way the owner cannot accept",
    ],
    rollback_or_cleanup_plan: [
      "If draft remains inactive, revert local packet/docs/validator changes before commit.",
      "If activated and provider call fails before output, record failed retry_007 receipt and stop without another retry.",
      "If activated and one image is created, keep it under retry_007 output, write sanitized receipt/review/audit records, and require human review before any promotion.",
      "No automatic deletion of generated output is authorized by this draft.",
    ],
    evidence_to_record_when_activated: [
      "provider call count",
      "plugin call count",
      "api call count",
      "image count",
      "explicit Seedream 5 model value",
      "sanitized retry_007 provider receipt",
      "review handoff entry",
      "durable audit record",
      "human review pending state",
    ],
    current_side_effect_flags: { ...currentSideEffectFlags },
  };

  validateExactA5ProviderRetry007ActivationPacketDraft(packet);
  return packet;
}

function validateExactA5ProviderRetry007ActivationPacketDraft(packet) {
  assertObject(packet, "packet");
  if (packet.packet_schema !== packetSchema) throw new Error("packet_schema mismatch");
  if (packet.adapter_id !== adapterId) throw new Error("adapter_id mismatch");
  if (packet.authorization_id !== authorizationId) throw new Error("authorization_id mismatch");
  if (packet.authorization_status !== "draft_not_active" || packet.authorization_active !== false) {
    throw new Error("retry_007 activation packet must remain draft_not_active");
  }
  if (packet.can_execute_now !== false || packet.requires_exact_user_activation !== true) {
    throw new Error("retry_007 activation packet must require exact user activation");
  }
  if (packet.activation_phrase_status !== "draft_phrase_not_owner_issued") {
    throw new Error("activation phrase must remain draft-only");
  }
  if (packet.exact_activation_phrase !== exactActivationPhrase) throw new Error("exact activation phrase mismatch");
  if (!packet.exact_activation_phrase.includes(authorizationId) ||
      !packet.exact_activation_phrase.includes(requiredModel) ||
      !packet.exact_activation_phrase.includes("runs/real_generation/v0_6_73_real_vcp_agent_generation_retry_007/")) {
    throw new Error("exact activation phrase must name authorization id, model, and output directory");
  }
  assertObject(packet.source_preflight_decision, "packet.source_preflight_decision");
  if (packet.source_preflight_decision.candidate_authorization_id !== authorizationId ||
      packet.source_preflight_decision.authorization_status !== "not_issued" ||
      packet.source_preflight_decision.authorization_active !== false ||
      packet.source_preflight_decision.can_execute_now !== false ||
      packet.source_preflight_decision.provider_execution_allowed_now !== false ||
      packet.source_preflight_decision.exact_activation_phrase_issued !== false) {
    throw new Error("source preflight decision must remain inactive and non-executable");
  }
  assertObject(packet.prior_real_execution_evidence, "packet.prior_real_execution_evidence");
  if (packet.prior_real_execution_evidence.last_attempt_authorization_id !== "AUTH-DRAFT-NATIVE-DOUBAO-SEEDREAM5-RETRY-20260526-006" ||
      packet.prior_real_execution_evidence.last_attempt_status !== "COMPLETED_PROVIDER_IMAGE_CREATED" ||
      packet.prior_real_execution_evidence.provider_evidence_integrity_validator !== "npm run validate:provider-evidence-integrity") {
    throw new Error("retry_006 evidence anchor mismatch");
  }
  assertObject(packet.execution_surface_precondition, "packet.execution_surface_precondition");
  if (packet.execution_surface_precondition.status !== "satisfied_vcptoolbox_retry_007_output_override_repair_applied" ||
      packet.execution_surface_precondition.repair_package_ref !== outputOverrideRepairPackageRef ||
      packet.execution_surface_precondition.external_repo_write_allowed_now !== false ||
      packet.execution_surface_precondition.real_vcptoolbox_patch_allowed_now !== false ||
      packet.execution_surface_precondition.vcptoolbox_retry_007_output_override_repair_applied !== true ||
      packet.execution_surface_precondition.vcptoolbox_retry_007_output_override_repair_validated !== true ||
      packet.execution_surface_precondition.current_route_authorizes_retry_007_output_override !== true ||
      packet.execution_surface_precondition.current_route_test_covers_retry_007_output_override !== true ||
      packet.execution_surface_precondition.required_vcptoolbox_head_reviewed !== "94f2f597_plus_authorized_local_two_file_repair" ||
      packet.execution_surface_precondition.required_route_file !== "A:\\VCP\\apps\\VCPToolBox\\routes\\admin\\aiImageAgents.js" ||
      packet.execution_surface_precondition.required_test_file !== "A:\\VCP\\apps\\VCPToolBox\\tests\\aiImageAgentsRoute.test.js" ||
      packet.execution_surface_precondition.required_authorization_id !== authorizationId ||
      packet.execution_surface_precondition.required_output_root !== "A:\\agent-image-lab\\agent-image-lab-v0.2\\runs\\real_generation\\v0_6_73_real_vcp_agent_generation_retry_007" ||
      packet.execution_surface_precondition.can_execute_provider_before_repair !== false) {
    throw new Error("retry_007 VCPToolBox output override repair precondition mismatch");
  }
  assertObject(packet.selected_provider, "packet.selected_provider");
  if (packet.selected_provider.provider_id !== "NativeDoubaoImage" ||
      packet.selected_provider.model !== requiredModel ||
      packet.selected_provider.provider_binding_ref !== "native_doubao:capability:owner-runtime:<redacted>" ||
      packet.selected_provider.provider_binding_ref_is_secret !== false) {
    throw new Error("selected provider boundary mismatch");
  }
  const refs = packet.allowed_operation_when_activated;
  if (refs.required_model !== requiredModel ||
      !refs.command_template.includes(`--model=${requiredModel}`) ||
      refs.output_directory_ref !== "runs/real_generation/v0_6_73_real_vcp_agent_generation_retry_007" ||
      refs.provider_receipt_ref !== "reports/provider_receipts/v0_6_73_real_vcp_agent_generation_retry_007_receipt.json" ||
      refs.review_handoff_ref !== "review_console/live_receipt_bridge/v0_6_73_real_vcp_agent_generation_retry_007/bridge_entry.json" ||
      refs.durable_audit_store_root !== ".agent_private/runtime_audit_store/v0_6_73_real_vcp_agent_generation_retry_007") {
    throw new Error("retry_007 output, receipt, review, or audit refs mismatch");
  }
  if (refs.provider_receipt_ref.includes("retry_006") ||
      refs.output_directory_ref.includes("retry_006") ||
      refs.review_handoff_ref.includes("retry_006")) {
    throw new Error("retry_007 packet must not reuse retry_006 refs");
  }
  if (packet.activation_budget.max_provider_calls !== 1 ||
      packet.activation_budget.max_plugin_calls !== 1 ||
      packet.activation_budget.max_api_calls !== 1 ||
      packet.activation_budget.max_images_created !== 1 ||
      packet.activation_budget.retry_allowed !== false ||
      packet.activation_budget.max_retry_count !== 0) {
    throw new Error("retry_007 activation budget must be one-shot with no retry");
  }
  if (packet.current_budget_before_activation.provider_calls !== 0 ||
      packet.current_budget_before_activation.plugin_calls !== 0 ||
      packet.current_budget_before_activation.api_calls !== 0 ||
      packet.current_budget_before_activation.image_candidates !== 0 ||
      packet.current_budget_before_activation.output_writes !== 0) {
    throw new Error("current budget before activation must be zero");
  }
  for (const item of packet.exact_allowed_paths_or_objects) {
    normalizeRepoRelativePath(item, "exact_allowed_paths_or_objects item");
  }
  if (packet.write_boundaries_when_activated.overwrite_existing_files_allowed !== false ||
      packet.write_boundaries_when_activated.production_candidate_write_allowed !== false ||
      packet.write_boundaries_when_activated.accepted_samples_write_allowed !== false ||
      packet.write_boundaries_when_activated.DailyNote_write_allowed !== false ||
      packet.write_boundaries_when_activated.VCP_memory_write_allowed !== false) {
    throw new Error("forbidden write boundaries must stay false");
  }
  for (const required of [
    "npm run validate:core",
    "npm run validate:public-disclosure",
    "npm run validate:mvp",
    "npm run validate:provider-evidence-integrity",
    "npm run validate:all",
    "node scripts/validate_exact_a5_provider_retry_007_activation_packet_draft.js",
    "node scripts/validate_exact_a5_provider_retry_007_vcptoolbox_output_override_repair_package.js",
    "VCPToolBox retry_007 output override repair applied and validated",
    "VCPToolBox node --check routes\\admin\\aiImageAgents.js",
    "VCPToolBox node --test tests\\aiImageAgentsRoute.test.js",
    "VCPToolBox node --test tests\\aiImageExecutionAdapter.test.js",
    "git diff --check",
  ]) {
    if (!packet.validation_required_before_activation.includes(required)) {
      throw new Error(`validation requirement missing: ${required}`);
    }
  }
  const stopText = packet.stop_conditions.join("\n");
  for (const required of [
    "exact activation phrase",
    "VCPToolBox retry_007 output override repair",
    requiredModel,
    "secret value read",
    "env file content read",
    "budget would exceed 1",
    "more than one image",
    "beyond retry_007",
    "output path already exists",
    "retry_006",
    "raw provider payload",
    "DailyNote/VCP memory",
    "push/tag/release/deploy",
  ]) {
    if (!stopText.includes(required)) throw new Error(`stop condition missing: ${required}`);
  }
  assertFalseFlags(packet.current_side_effect_flags, "packet.current_side_effect_flags");
  return true;
}

function main() {
  const packet = buildExactA5ProviderRetry007ActivationPacketDraft();
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
  outputOverrideRepairPackageRef,
  exactActivationPhrase,
  requiredModel,
  currentSideEffectFlags,
  buildExactA5ProviderRetry007ActivationPacketDraft,
  validateExactA5ProviderRetry007ActivationPacketDraft,
};
