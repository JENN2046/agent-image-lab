#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { verifyAttemptLockBinding } = require("./verify_runtime_to_review_v1_secretless_serum_attempt_lock_binding");

const runnerId = "runtime_to_review_v1_secretless_option_a_callable_runner";
const repoRoot = path.resolve(__dirname, "..");
const exactActivationPackageId = "AUTH-DRAFT-SECRETLESS-SERUM-LIVE-PROBE-20260603-001";
const exactRouteHttpActivationPackageId = "AUTH-SECRETLESS-SERUM-LIVE-PROBE-20260603-003";
const exactRouteHttpActivationPackageIdAttempt004 = "AUTH-SECRETLESS-SERUM-LIVE-PROBE-20260603-004";
const exactRouteHttpActivationPackageIdAttempt005 = "AUTH-SECRETLESS-SERUM-LIVE-PROBE-20260603-005";
const exactRouteHttpActivationPackageIdAttempt006 = "AUTH-SECRETLESS-SERUM-LIVE-PROBE-20260603-006";
const exactRouteHttpActivationPackageIdAttempt007 = "AUTH-SECRETLESS-SERUM-LIVE-PROBE-20260603-007";
const exactRouteHttpActivationPackageIdAttempt008 = "AUTH-SECRETLESS-SERUM-LIVE-PROBE-20260603-008";
const exactRouteHttpActivationPackageIdAttempt009 = "AUTH-SECRETLESS-SERUM-LIVE-PROBE-20260603-009";
const exactRouteHttpActivationPackageIdAttempt010 = "AUTH-SECRETLESS-SERUM-LIVE-PROBE-20260603-010";
const exactRouteHttpActivationPackageIdAttempt011 = "AUTH-SECRETLESS-SERUM-LIVE-PROBE-20260603-011";
const exactRouteHttpActivationPackageIdAttempt012 = "AUTH-SECRETLESS-SERUM-LIVE-PROBE-20260603-012";
const exactRouteHttpActivationPackageIdAttempt013 = "AUTH-SECRETLESS-SERUM-LIVE-PROBE-20260603-013";
const exactRouteHttpActivationPackageIdAttempt014 = "AUTH-SECRETLESS-SERUM-LIVE-PROBE-20260603-014";
const exactRouteHttpActivationPackageIdAttempt015 = "AUTH-SECRETLESS-SERUM-LIVE-PROBE-20260603-015";
const exactRouteHttpActivationPackageIdAttempt016 = "AUTH-SECRETLESS-SERUM-LIVE-PROBE-20260603-016";
const exactConfirmationPhrase = "RUNTIME_TO_REVIEW_V1_SECRETLESS_SERUM_BOTTLE_ONE_PROVIDER_ONE_IMAGE";
const exactRouteHttpMethod = "POST";
const exactRouteHttpPath = "/admin_api/ai-image-agents/execute/serum-bottle-secretless";
const exactRouteHttpEndpointSource = "VCPToolBox bcb8219a server.js mounts /admin_api/ai-image-agents and routes/admin/aiImageAgents.js defines POST /execute/serum-bottle-secretless";
const exactRouteHttpPathAttempt005 = "/internal/ai-image-agents/execute/serum-bottle-secretless";
const exactRouteHttpEndpointSourceAttempt005 = "VCPToolBox f8ba23130f714e1e1d7641f5f89726846aaf8bb2 server.js mounts loopback-only /internal/ai-image-agents and routes/admin/aiImageAgents.js defines POST /execute/serum-bottle-secretless";
const exactRouteHttpEndpointSourceAttempt006 = "VCPToolBox d0d5c104ae741e7be993cf1c760126bea9a44567 server.js mounts loopback-only /internal/ai-image-agents, injects pluginManager and internal authorizer into routeOptions, and routes/admin/aiImageAgents.js defines POST /execute/serum-bottle-secretless";
const exactRouteHttpEndpointSourceAttempt007 = "VCPToolBox 9e3817320f36d3c5735d476a238a2251cbf50b32 mounts loopback-only /internal/ai-image-agents, requires exact attempt-007 activation binding, NativeImageDelegateRegistry serum_bottle_secretless_doubao_v1, strict canonical secretless payload validation, route/runtime/delegate flags, and routes/admin/aiImageAgents.js defines POST /execute/serum-bottle-secretless";
const exactRouteHttpEndpointSourceAttempt008 = "VCPToolBox 603bbcdfc4c43479ba2aea9dc1915945c7d64e77 mounts loopback-only /internal/ai-image-agents, requires exact attempt-008 activation binding, NativeImageDelegateRegistry serum_bottle_secretless_doubao_v1, strict canonical secretless payload validation, route/runtime/delegate flags, and routes/admin/aiImageAgents.js defines POST /execute/serum-bottle-secretless";
const exactRouteHttpEndpointSourceAttempt009 = "VCPToolBox 32e5c2a7de9edb7e243671a5a18b517caafc8645 mounts loopback-only /internal/ai-image-agents, requires exact attempt-009 activation binding, NativeImageDelegateRegistry serum_bottle_secretless_doubao_v1, strict canonical secretless payload validation, route/runtime/delegate flags, and allows exact internal secretless pipeline execution past the old AIGENT env gate";
const exactRouteHttpEndpointSourceAttempt010 = "VCPToolBox 39275a211964986b97fdb0d81119851353592071 mounts loopback-only /internal/ai-image-agents, requires exact attempt-010 activation binding, NativeImageDelegateRegistry serum_bottle_secretless_doubao_v1, strict canonical secretless payload validation, route/runtime/delegate flags, and allows exact internal secretless pipeline execution past the old AIGENT env gate";
const exactRouteHttpEndpointSourceAttempt011 = "VCPToolBox 76ee3f2345d8fe490f6104bd0e670a5bebb99db2 mounts loopback-only /internal/ai-image-agents, requires exact attempt-011 activation binding, NativeImageDelegateRegistry serum_bottle_secretless_doubao_v1, strict canonical secretless payload validation, route/runtime/delegate flags, allows exact internal secretless pipeline execution past the old AIGENT env gate, and fixes the native Doubao secretless delegate size to 1920x1920";
const exactRouteHttpEndpointSourceAttempt012 = "VCPToolBox 24b9f887b77c1db48da2d23d6ef9fb9cd080ea83 mounts loopback-only /internal/ai-image-agents, requires exact attempt-012 activation binding, NativeImageDelegateRegistry serum_bottle_secretless_doubao_v1, strict canonical secretless payload validation, route/runtime/delegate flags, allows exact internal secretless pipeline execution past the old AIGENT env gate, and keeps the native Doubao secretless delegate size fixed to 1920x1920";
const exactRouteHttpEndpointSourceAttempt013 = "VCPToolBox 82b83028efaa2dcefa19edb03b6a8b3854941090 mounts loopback-only /internal/ai-image-agents, requires exact attempt-013 activation binding in route and server authorizer, NativeImageDelegateRegistry serum_bottle_secretless_doubao_v1, strict canonical secretless payload validation, route/runtime/delegate flags, allows exact internal secretless pipeline execution past the old AIGENT env gate, and keeps the native Doubao secretless delegate size fixed to 1920x1920";
const exactRouteHttpEndpointSourceAttempt014 = "VCPToolBox 549a26abc7d34e973c9d1ac6d4491aa8d92e88f1 mounts loopback-only /internal/ai-image-agents, requires exact attempt-014 activation binding in route and server authorizer, NativeImageDelegateRegistry serum_bottle_secretless_doubao_v1, strict canonical secretless payload validation, route/runtime/delegate flags, allows exact internal secretless pipeline execution past the old AIGENT env gate, keeps the native Doubao secretless delegate size fixed to 1920x1920, and records generated artifact sha256/mime/dimensions from restricted local artifact evidence when provider metadata is missing";
const exactRouteHttpEndpointSourceAttempt015 = "VCPToolBox current-attempt binding commit must match reports/runtime_to_review_v1/secretless_serum_attempt_015.lock.json; route/server source binding verifier must prove activation, pipeline, receipt, artifact, and output refs are all attempt-015 before POST";
const exactRouteHttpEndpointSourceAttempt016 = "VCPToolBox current-attempt binding commit must match reports/runtime_to_review_v1/secretless_serum_attempt_016.lock.json; route/server source binding verifier must prove activation, pipeline, receipt, artifact, and output refs are all attempt-016 before POST";
const vcptoolboxRequiredCommitAttempt007 = "9e3817320f36d3c5735d476a238a2251cbf50b32";
const vcptoolboxRequiredCommitAttempt008 = "603bbcdfc4c43479ba2aea9dc1915945c7d64e77";
const vcptoolboxRequiredCommitAttempt009 = "32e5c2a7de9edb7e243671a5a18b517caafc8645";
const vcptoolboxRequiredCommitAttempt010 = "39275a211964986b97fdb0d81119851353592071";
const vcptoolboxRequiredCommitAttempt011 = "76ee3f2345d8fe490f6104bd0e670a5bebb99db2";
const vcptoolboxRequiredCommitAttempt012 = "24b9f887b77c1db48da2d23d6ef9fb9cd080ea83";
const vcptoolboxRequiredCommitAttempt013 = "82b83028efaa2dcefa19edb03b6a8b3854941090";
const vcptoolboxRequiredCommitAttempt014 = "549a26abc7d34e973c9d1ac6d4491aa8d92e88f1";
const vcptoolboxRequiredCommitAttempt015 =
  "resolved_by_prepare_attempt_after_vcptoolbox_binding_commit";
const vcptoolboxRequiredCommitAttempt016 =
  "resolved_by_prepare_attempt_after_vcptoolbox_binding_commit";
const agentImageLabRunnerRequiredCommitAttempt007 =
  "resolved_by_separate_exact_activation_after_local_commit";
const agentImageLabRunnerRequiredCommitAttempt008 =
  "resolved_by_separate_exact_activation_after_local_commit";
const agentImageLabRunnerRequiredCommitAttempt009 =
  "resolved_by_separate_exact_activation_after_local_commit";
const agentImageLabRunnerRequiredCommitAttempt010 =
  "resolved_by_separate_exact_activation_after_local_commit";
const agentImageLabRunnerRequiredCommitAttempt011 =
  "resolved_by_separate_exact_activation_after_local_commit";
const agentImageLabRunnerRequiredCommitAttempt012 =
  "resolved_by_separate_exact_activation_after_local_commit";
const agentImageLabRunnerRequiredCommitAttempt013 =
  "resolved_by_separate_exact_activation_after_local_commit";
const agentImageLabRunnerRequiredCommitAttempt014 =
  "resolved_by_separate_exact_activation_after_local_commit";
const agentImageLabRunnerRequiredCommitAttempt015 =
  "resolved_by_prepare_attempt_after_local_commit";
const agentImageLabRunnerRequiredCommitAttempt016 =
  "resolved_by_prepare_attempt_after_local_commit";
const bindingPacketIdAttempt007 = "BINDING-DRAFT-SECRETLESS-OPTION-A-SERUM-20260603-007";
const bindingPacketIdAttempt008 = "BINDING-DRAFT-SECRETLESS-OPTION-A-SERUM-20260603-008";
const bindingPacketIdAttempt009 = "BINDING-DRAFT-SECRETLESS-OPTION-A-SERUM-20260603-009";
const bindingPacketIdAttempt010 = "BINDING-DRAFT-SECRETLESS-OPTION-A-SERUM-20260603-010";
const bindingPacketIdAttempt011 = "BINDING-DRAFT-SECRETLESS-OPTION-A-SERUM-20260603-011";
const bindingPacketIdAttempt012 = "BINDING-DRAFT-SECRETLESS-OPTION-A-SERUM-20260603-012";
const bindingPacketIdAttempt013 = "BINDING-DRAFT-SECRETLESS-OPTION-A-SERUM-20260603-013";
const bindingPacketIdAttempt014 = "BINDING-DRAFT-SECRETLESS-OPTION-A-SERUM-20260603-014";
const bindingPacketIdAttempt015 = "BINDING-DRAFT-SECRETLESS-OPTION-A-SERUM-20260603-015";
const bindingPacketIdAttempt016 = "BINDING-DRAFT-SECRETLESS-OPTION-A-SERUM-20260603-016";
const bindingPacketRefAttempt007 =
  "reports/runtime_to_review_v1/secretless_option_a_exact_binding_packet_draft_20260603_attempt_007.json";
const bindingPacketRefAttempt008 =
  "reports/runtime_to_review_v1/secretless_option_a_exact_binding_packet_draft_20260603_attempt_008.json";
const bindingPacketRefAttempt009 =
  "reports/runtime_to_review_v1/secretless_option_a_exact_binding_packet_draft_20260603_attempt_009.json";
const bindingPacketRefAttempt010 =
  "reports/runtime_to_review_v1/secretless_option_a_exact_binding_packet_draft_20260603_attempt_010.json";
const bindingPacketRefAttempt011 =
  "reports/runtime_to_review_v1/secretless_option_a_exact_binding_packet_draft_20260603_attempt_011.json";
const bindingPacketRefAttempt012 =
  "reports/runtime_to_review_v1/secretless_option_a_exact_binding_packet_draft_20260603_attempt_012.json";
const bindingPacketRefAttempt013 =
  "reports/runtime_to_review_v1/secretless_option_a_exact_binding_packet_draft_20260603_attempt_013.json";
const bindingPacketRefAttempt014 =
  "reports/runtime_to_review_v1/secretless_option_a_exact_binding_packet_draft_20260603_attempt_014.json";
const bindingPacketRefAttempt015 =
  "reports/runtime_to_review_v1/secretless_option_a_exact_binding_packet_draft_20260603_attempt_015.json";
const bindingPacketRefAttempt016 =
  "reports/runtime_to_review_v1/secretless_option_a_exact_binding_packet_draft_20260603_attempt_016.json";
const receiptRefAttempt007 =
  "reports/runtime_to_review_v1/secretless_serum_live_probe_receipt_20260603_attempt_007.json";
const receiptRefAttempt008 =
  "reports/runtime_to_review_v1/secretless_serum_live_probe_receipt_20260603_attempt_008.json";
const receiptRefAttempt009 =
  "reports/runtime_to_review_v1/secretless_serum_live_probe_receipt_20260603_attempt_009.json";
const receiptRefAttempt010 =
  "reports/runtime_to_review_v1/secretless_serum_live_probe_receipt_20260603_attempt_010.json";
const receiptRefAttempt011 =
  "reports/runtime_to_review_v1/secretless_serum_live_probe_receipt_20260603_attempt_011.json";
const receiptRefAttempt012 =
  "reports/runtime_to_review_v1/secretless_serum_live_probe_receipt_20260603_attempt_012.json";
const receiptRefAttempt013 =
  "reports/runtime_to_review_v1/secretless_serum_live_probe_receipt_20260603_attempt_013.json";
const receiptRefAttempt014 =
  "reports/runtime_to_review_v1/secretless_serum_live_probe_receipt_20260603_attempt_014.json";
const receiptRefAttempt015 =
  "reports/runtime_to_review_v1/secretless_serum_live_probe_receipt_20260603_attempt_015.json";
const receiptRefAttempt016 =
  "reports/runtime_to_review_v1/secretless_serum_live_probe_receipt_20260603_attempt_016.json";
const artifactRecordRefAttempt007 =
  "reports/runtime_to_review_v1/secretless_serum_live_probe_artifact_record_20260603_attempt_007.json";
const artifactRecordRefAttempt008 =
  "reports/runtime_to_review_v1/secretless_serum_live_probe_artifact_record_20260603_attempt_008.json";
const artifactRecordRefAttempt009 =
  "reports/runtime_to_review_v1/secretless_serum_live_probe_artifact_record_20260603_attempt_009.json";
const artifactRecordRefAttempt010 =
  "reports/runtime_to_review_v1/secretless_serum_live_probe_artifact_record_20260603_attempt_010.json";
const artifactRecordRefAttempt011 =
  "reports/runtime_to_review_v1/secretless_serum_live_probe_artifact_record_20260603_attempt_011.json";
const artifactRecordRefAttempt012 =
  "reports/runtime_to_review_v1/secretless_serum_live_probe_artifact_record_20260603_attempt_012.json";
const artifactRecordRefAttempt013 =
  "reports/runtime_to_review_v1/secretless_serum_live_probe_artifact_record_20260603_attempt_013.json";
const artifactRecordRefAttempt014 =
  "reports/runtime_to_review_v1/secretless_serum_live_probe_artifact_record_20260603_attempt_014.json";
const artifactRecordRefAttempt015 =
  "reports/runtime_to_review_v1/secretless_serum_live_probe_artifact_record_20260603_attempt_015.json";
const artifactRecordRefAttempt016 =
  "reports/runtime_to_review_v1/secretless_serum_live_probe_artifact_record_20260603_attempt_016.json";
const outputDirectoryRefAttempt007 =
  "runs/real_generation/runtime_to_review_v1_guarded_live_probe_serum_bottle_secretless_attempt_007/";
const outputDirectoryRefAttempt008 =
  "runs/real_generation/runtime_to_review_v1_guarded_live_probe_serum_bottle_secretless_attempt_008/";
const outputDirectoryRefAttempt009 =
  "runs/real_generation/runtime_to_review_v1_guarded_live_probe_serum_bottle_secretless_attempt_009/";
const outputDirectoryRefAttempt010 =
  "runs/real_generation/runtime_to_review_v1_guarded_live_probe_serum_bottle_secretless_attempt_010/";
const outputDirectoryRefAttempt011 =
  "runs/real_generation/runtime_to_review_v1_guarded_live_probe_serum_bottle_secretless_attempt_011/";
const outputDirectoryRefAttempt012 =
  "runs/real_generation/runtime_to_review_v1_guarded_live_probe_serum_bottle_secretless_attempt_012/";
const outputDirectoryRefAttempt013 =
  "runs/real_generation/runtime_to_review_v1_guarded_live_probe_serum_bottle_secretless_attempt_013/";
const outputDirectoryRefAttempt014 =
  "runs/real_generation/runtime_to_review_v1_guarded_live_probe_serum_bottle_secretless_attempt_014/";
const outputDirectoryRefAttempt015 =
  "runs/real_generation/runtime_to_review_v1_guarded_live_probe_serum_bottle_secretless_attempt_015/";
const outputDirectoryRefAttempt016 =
  "runs/real_generation/runtime_to_review_v1_guarded_live_probe_serum_bottle_secretless_attempt_016/";
const promptAttempt012 =
  "premium skincare serum bottle product hero image, one full bottle centered vertically, product fills most of a square frame, frosted translucent glass bottle with warm amber serum inside, elegant metallic gold dropper cap, blank satin cream label panel with no readable text and no logo, refined white and soft warm gray studio background, subtle grounded reflection, clean cosmetic studio lighting, realistic glass thickness and edge highlights, high-end ecommerce beauty product photography";
const promptAttempt014 =
  "premium skincare serum bottle product hero image, complete full bottle fully visible from gold dropper top to rounded glass base, generous bottom margin below the bottle, no cropping, one centered bottle occupying most of a square frame, frosted translucent glass bottle with warm amber serum inside, elegant metallic gold dropper cap, blank satin cream label panel with no readable text and no logo, refined white and soft warm gray studio background, subtle grounded reflection, clean cosmetic studio lighting, realistic glass thickness and edge highlights, high-end ecommerce beauty product photography";
const promptAttempt015 = promptAttempt014;
const attemptLockRefAttempt015 =
  "reports/runtime_to_review_v1/secretless_serum_attempt_015.lock.json";
const attemptLockRefAttempt016 =
  "reports/runtime_to_review_v1/secretless_serum_attempt_016.lock.json";

function readAttemptLock(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), "utf8"));
}

function routeDefaultsFromAttemptLock(relativePath) {
  const lock = readAttemptLock(relativePath);
  return {
    activationPackageId: lock.activation_id,
    routeHttpMethod: lock.route?.method || exactRouteHttpMethod,
    routeHttpPath: lock.route?.path || exactRouteHttpPath,
    routeHttpOrigin: lock.route?.origin || null,
    pipelineId: lock.pipeline_id,
    taskId: lock.activation_id,
    prompt: lock.prompt,
    receiptRef: lock.receipt_ref,
    artifactRecordRef: lock.artifact_record_ref,
    outputDirectoryRef: lock.output_directory_ref,
    routeId: lock.route?.route_id || "serum_bottle_vcptoolbox_route_owner_runtime",
    attemptLockRef: relativePath
  };
}

function configFromAttemptLock(relativePath) {
  const lock = readAttemptLock(relativePath);
  const receiptId = path.basename(lock.receipt_ref, ".json");
  const artifactRecordId = path.basename(lock.artifact_record_ref, ".json");
  return Object.freeze({
    activationPackageId: lock.activation_id,
    bindingPacketId: lock.binding_packet?.binding_packet_id,
    bindingPacketRef: lock.binding_packet?.binding_packet_ref,
    receiptRef: lock.receipt_ref,
    receiptId,
    artifactRecordRef: lock.artifact_record_ref,
    artifactRecordId,
    outputDirectoryRef: lock.output_directory_ref,
    agentImageLabRunnerRequiredCommit: lock.agent_image_lab_commit_required,
    vcptoolboxRequiredCommit: lock.vcptoolbox_current_attempt_binding_commit_required,
    attemptLockRef: relativePath
  });
}

const allowedNonSecretPayloadFields = Object.freeze([
  "task_id",
  "route_id",
  "target_product",
  "prompt_package_ref",
  "model_id",
  "max_provider_calls",
  "max_plugin_calls",
  "max_api_calls",
  "max_images",
  "retry_allowed",
  "receipt_ref",
  "artifact_record_ref",
  "output_directory_ref",
  "non_secret_payload_hash"
]);

const forbiddenPayloadKeysNormalized = Object.freeze([
  "adminusername",
  "adminpassword",
  "basicauthheader",
  "authorizationheader",
  "authorization",
  "basicauth",
  "auth",
  "bearertoken",
  "token",
  "secretenvvarvalue",
  "apikey",
  "accesstoken",
  "refreshtoken",
  "password",
  "cookie",
  "headers"
]);

const defaultInput = Object.freeze({
  activationPackageId: exactActivationPackageId,
  confirmationPhrase: exactConfirmationPhrase,
  taskId: "secretless_serum_live_probe_future_attempt",
  routeId: "vcptoolbox_option_a_secretless_internal_authorized_execution_interface",
  targetProduct: "premium_serum_bottle",
  promptPackageRef: "prompts/image_generation/product_lifestyle_premium_serum_bottle_v1.yaml",
  modelId: "doubao-seedream-5-0-260128",
  maxProviderCalls: 1,
  maxPluginCalls: 1,
  maxApiCalls: 1,
  maxImages: 1,
  retryAllowed: false,
  receiptRef: "reports/runtime_to_review_v1/secretless_serum_live_probe_receipt_FUTURE_ATTEMPT.json",
  artifactRecordRef: "reports/runtime_to_review_v1/secretless_serum_live_probe_artifact_record_FUTURE_ATTEMPT.json",
  outputDirectoryRef: "runs/real_generation/runtime_to_review_v1_guarded_live_probe_serum_bottle_secretless/"
});

const defaultRouteHttpInput = Object.freeze({
  activationPackageId: exactRouteHttpActivationPackageId,
  confirmationPhrase: exactConfirmationPhrase,
  routeHttpMethod: exactRouteHttpMethod,
  routeHttpPath: exactRouteHttpPath,
  routeHttpEndpointSource: exactRouteHttpEndpointSource,
  pipelineId: "secretless-serum-live-probe-attempt-003",
  taskId: exactRouteHttpActivationPackageId,
  routeId: "serum_bottle_vcptoolbox_route_owner_runtime",
  prompt: "premium serum bottle product image, clean cosmetic studio lighting, one bottle, no text overlay",
  modelId: "doubao-seedream-5-0-260128",
  maxProviderCalls: 1,
  maxPluginCalls: 1,
  maxApiCalls: 1,
  maxImages: 1,
  retryAllowed: false,
  receiptRef: "reports/runtime_to_review_v1/secretless_serum_live_probe_receipt_20260603_attempt_003.json",
  artifactRecordRef: "reports/runtime_to_review_v1/secretless_serum_live_probe_artifact_record_20260603_attempt_003.json",
  outputDirectoryRef: "runs/real_generation/runtime_to_review_v1_guarded_live_probe_serum_bottle_secretless_attempt_003/"
});

const defaultRouteHttpInputAttempt004 = Object.freeze({
  ...defaultRouteHttpInput,
  activationPackageId: exactRouteHttpActivationPackageIdAttempt004,
  pipelineId: "secretless-serum-live-probe-attempt-004",
  taskId: exactRouteHttpActivationPackageIdAttempt004,
  receiptRef: "reports/runtime_to_review_v1/secretless_serum_live_probe_receipt_20260603_attempt_004.json",
  artifactRecordRef: "reports/runtime_to_review_v1/secretless_serum_live_probe_artifact_record_20260603_attempt_004.json",
  outputDirectoryRef: "runs/real_generation/runtime_to_review_v1_guarded_live_probe_serum_bottle_secretless_attempt_004/"
});

const defaultRouteHttpInputAttempt005 = Object.freeze({
  ...defaultRouteHttpInput,
  activationPackageId: exactRouteHttpActivationPackageIdAttempt005,
  routeHttpPath: exactRouteHttpPathAttempt005,
  routeHttpEndpointSource: exactRouteHttpEndpointSourceAttempt005,
  pipelineId: "secretless-serum-live-probe-attempt-005",
  taskId: exactRouteHttpActivationPackageIdAttempt005,
  receiptRef: "reports/runtime_to_review_v1/secretless_serum_live_probe_receipt_20260603_attempt_005.json",
  artifactRecordRef: "reports/runtime_to_review_v1/secretless_serum_live_probe_artifact_record_20260603_attempt_005.json",
  outputDirectoryRef: "runs/real_generation/runtime_to_review_v1_guarded_live_probe_serum_bottle_secretless_attempt_005/"
});

const defaultRouteHttpInputAttempt006 = Object.freeze({
  ...defaultRouteHttpInputAttempt005,
  activationPackageId: exactRouteHttpActivationPackageIdAttempt006,
  routeHttpEndpointSource: exactRouteHttpEndpointSourceAttempt006,
  pipelineId: "secretless-serum-live-probe-attempt-006",
  taskId: exactRouteHttpActivationPackageIdAttempt006,
  receiptRef: "reports/runtime_to_review_v1/secretless_serum_live_probe_receipt_20260603_attempt_006.json",
  artifactRecordRef: "reports/runtime_to_review_v1/secretless_serum_live_probe_artifact_record_20260603_attempt_006.json",
  outputDirectoryRef: "runs/real_generation/runtime_to_review_v1_guarded_live_probe_serum_bottle_secretless_attempt_006/"
});

const defaultRouteHttpInputAttempt007 = Object.freeze({
  ...defaultRouteHttpInputAttempt006,
  activationPackageId: exactRouteHttpActivationPackageIdAttempt007,
  routeHttpEndpointSource: exactRouteHttpEndpointSourceAttempt007,
  pipelineId: "secretless-serum-live-probe-attempt-007",
  taskId: exactRouteHttpActivationPackageIdAttempt007,
  receiptRef: "reports/runtime_to_review_v1/secretless_serum_live_probe_receipt_20260603_attempt_007.json",
  artifactRecordRef: "reports/runtime_to_review_v1/secretless_serum_live_probe_artifact_record_20260603_attempt_007.json",
  outputDirectoryRef: outputDirectoryRefAttempt007
});

const defaultRouteHttpInputAttempt008 = Object.freeze({
  ...defaultRouteHttpInputAttempt007,
  activationPackageId: exactRouteHttpActivationPackageIdAttempt008,
  routeHttpEndpointSource: exactRouteHttpEndpointSourceAttempt008,
  pipelineId: "secretless-serum-live-probe-attempt-008",
  taskId: exactRouteHttpActivationPackageIdAttempt008,
  receiptRef: receiptRefAttempt008,
  artifactRecordRef: artifactRecordRefAttempt008,
  outputDirectoryRef: outputDirectoryRefAttempt008
});

const defaultRouteHttpInputAttempt009 = Object.freeze({
  ...defaultRouteHttpInputAttempt008,
  activationPackageId: exactRouteHttpActivationPackageIdAttempt009,
  routeHttpEndpointSource: exactRouteHttpEndpointSourceAttempt009,
  pipelineId: "secretless-serum-live-probe-attempt-009",
  taskId: exactRouteHttpActivationPackageIdAttempt009,
  receiptRef: receiptRefAttempt009,
  artifactRecordRef: artifactRecordRefAttempt009,
  outputDirectoryRef: outputDirectoryRefAttempt009
});

const defaultRouteHttpInputAttempt010 = Object.freeze({
  ...defaultRouteHttpInputAttempt009,
  activationPackageId: exactRouteHttpActivationPackageIdAttempt010,
  routeHttpEndpointSource: exactRouteHttpEndpointSourceAttempt010,
  pipelineId: "secretless-serum-live-probe-attempt-010",
  taskId: exactRouteHttpActivationPackageIdAttempt010,
  receiptRef: receiptRefAttempt010,
  artifactRecordRef: artifactRecordRefAttempt010,
  outputDirectoryRef: outputDirectoryRefAttempt010
});

const defaultRouteHttpInputAttempt011 = Object.freeze({
  ...defaultRouteHttpInputAttempt010,
  activationPackageId: exactRouteHttpActivationPackageIdAttempt011,
  routeHttpEndpointSource: exactRouteHttpEndpointSourceAttempt011,
  pipelineId: "secretless-serum-live-probe-attempt-011",
  taskId: exactRouteHttpActivationPackageIdAttempt011,
  receiptRef: receiptRefAttempt011,
  artifactRecordRef: artifactRecordRefAttempt011,
  outputDirectoryRef: outputDirectoryRefAttempt011
});

const defaultRouteHttpInputAttempt012 = Object.freeze({
  ...defaultRouteHttpInputAttempt011,
  activationPackageId: exactRouteHttpActivationPackageIdAttempt012,
  routeHttpEndpointSource: exactRouteHttpEndpointSourceAttempt012,
  pipelineId: "secretless-serum-live-probe-attempt-012",
  taskId: exactRouteHttpActivationPackageIdAttempt012,
  prompt: promptAttempt012,
  receiptRef: receiptRefAttempt012,
  artifactRecordRef: artifactRecordRefAttempt012,
  outputDirectoryRef: outputDirectoryRefAttempt012
});

const defaultRouteHttpInputAttempt013 = Object.freeze({
  ...defaultRouteHttpInputAttempt012,
  activationPackageId: exactRouteHttpActivationPackageIdAttempt013,
  routeHttpEndpointSource: exactRouteHttpEndpointSourceAttempt013,
  pipelineId: "secretless-serum-live-probe-attempt-013",
  taskId: exactRouteHttpActivationPackageIdAttempt013,
  receiptRef: receiptRefAttempt013,
  artifactRecordRef: artifactRecordRefAttempt013,
  outputDirectoryRef: outputDirectoryRefAttempt013
});

const defaultRouteHttpInputAttempt014 = Object.freeze({
  ...defaultRouteHttpInputAttempt013,
  activationPackageId: exactRouteHttpActivationPackageIdAttempt014,
  routeHttpEndpointSource: exactRouteHttpEndpointSourceAttempt014,
  pipelineId: "secretless-serum-live-probe-attempt-014",
  taskId: exactRouteHttpActivationPackageIdAttempt014,
  prompt: promptAttempt014,
  receiptRef: receiptRefAttempt014,
  artifactRecordRef: artifactRecordRefAttempt014,
  outputDirectoryRef: outputDirectoryRefAttempt014
});

const defaultRouteHttpInputAttempt015 = Object.freeze({
  ...routeDefaultsFromAttemptLock(attemptLockRefAttempt015),
  routeHttpEndpointSource: exactRouteHttpEndpointSourceAttempt015
});

const defaultRouteHttpInputAttempt016 = Object.freeze({
  ...routeDefaultsFromAttemptLock(attemptLockRefAttempt016),
  routeHttpEndpointSource: exactRouteHttpEndpointSourceAttempt016
});

const allowedExactRouteHttpActivationPackageIds = Object.freeze([
  exactRouteHttpActivationPackageId,
  exactRouteHttpActivationPackageIdAttempt004,
  exactRouteHttpActivationPackageIdAttempt005,
  exactRouteHttpActivationPackageIdAttempt006,
  exactRouteHttpActivationPackageIdAttempt007,
  exactRouteHttpActivationPackageIdAttempt008,
  exactRouteHttpActivationPackageIdAttempt009,
  exactRouteHttpActivationPackageIdAttempt010,
  exactRouteHttpActivationPackageIdAttempt011,
  exactRouteHttpActivationPackageIdAttempt012,
  exactRouteHttpActivationPackageIdAttempt013,
  exactRouteHttpActivationPackageIdAttempt014,
  exactRouteHttpActivationPackageIdAttempt015,
  exactRouteHttpActivationPackageIdAttempt016
]);

function routeHttpDefaultsForActivationPackage(activationPackageId) {
  if (activationPackageId === exactRouteHttpActivationPackageIdAttempt016) {
    return defaultRouteHttpInputAttempt016;
  }
  if (activationPackageId === exactRouteHttpActivationPackageIdAttempt015) {
    return defaultRouteHttpInputAttempt015;
  }
  if (activationPackageId === exactRouteHttpActivationPackageIdAttempt014) {
    return defaultRouteHttpInputAttempt014;
  }
  if (activationPackageId === exactRouteHttpActivationPackageIdAttempt013) {
    return defaultRouteHttpInputAttempt013;
  }
  if (activationPackageId === exactRouteHttpActivationPackageIdAttempt012) {
    return defaultRouteHttpInputAttempt012;
  }
  if (activationPackageId === exactRouteHttpActivationPackageIdAttempt011) {
    return defaultRouteHttpInputAttempt011;
  }
  if (activationPackageId === exactRouteHttpActivationPackageIdAttempt010) {
    return defaultRouteHttpInputAttempt010;
  }
  if (activationPackageId === exactRouteHttpActivationPackageIdAttempt009) {
    return defaultRouteHttpInputAttempt009;
  }
  if (activationPackageId === exactRouteHttpActivationPackageIdAttempt008) {
    return defaultRouteHttpInputAttempt008;
  }
  if (activationPackageId === exactRouteHttpActivationPackageIdAttempt007) {
    return defaultRouteHttpInputAttempt007;
  }
  if (activationPackageId === exactRouteHttpActivationPackageIdAttempt006) {
    return defaultRouteHttpInputAttempt006;
  }
  if (activationPackageId === exactRouteHttpActivationPackageIdAttempt005) {
    return defaultRouteHttpInputAttempt005;
  }
  if (activationPackageId === exactRouteHttpActivationPackageIdAttempt004) {
    return defaultRouteHttpInputAttempt004;
  }
  return defaultRouteHttpInput;
}

function routeHttpDefaultsForInput(input = {}) {
  if (input.attemptLockRef) {
    return {
      ...routeDefaultsFromAttemptLock(input.attemptLockRef),
      routeHttpEndpointSource: `VCPToolBox current-attempt binding commit must match ${input.attemptLockRef}; route/server source binding verifier must prove activation, pipeline, receipt, artifact, and output refs are all the same attempt before POST`
    };
  }
  return routeHttpDefaultsForActivationPackage(input.activationPackageId);
}

function exactAttemptConfigForValidation(validation = {}) {
  if (validation.attempt_lock_ref) {
    return configFromAttemptLock(validation.attempt_lock_ref);
  }
  return exactAttemptReceiptArtifactConfigs[validation.activation_package_id];
}

function normalizePayloadKey(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]/g, "");
}

function canonicalJson(value) {
  if (Array.isArray(value)) {
    return `[${value.map((item) => canonicalJson(item)).join(",")}]`;
  }
  if (value && typeof value === "object") {
    const keys = Object.keys(value).sort();
    return `{${keys.map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function valueFor(input, camelName, snakeName) {
  if (Object.prototype.hasOwnProperty.call(input, camelName)) return input[camelName];
  if (Object.prototype.hasOwnProperty.call(input, snakeName)) return input[snakeName];
  return defaultInput[camelName];
}

function hashPayload(payloadWithoutHash) {
  return crypto.createHash("sha256").update(canonicalJson(payloadWithoutHash)).digest("hex");
}

function buildNonSecretPayload(input = {}) {
  const payloadWithoutHash = {
    task_id: valueFor(input, "taskId", "task_id"),
    route_id: valueFor(input, "routeId", "route_id"),
    target_product: valueFor(input, "targetProduct", "target_product"),
    prompt_package_ref: valueFor(input, "promptPackageRef", "prompt_package_ref"),
    model_id: valueFor(input, "modelId", "model_id"),
    max_provider_calls: valueFor(input, "maxProviderCalls", "max_provider_calls"),
    max_plugin_calls: valueFor(input, "maxPluginCalls", "max_plugin_calls"),
    max_api_calls: valueFor(input, "maxApiCalls", "max_api_calls"),
    max_images: valueFor(input, "maxImages", "max_images"),
    retry_allowed: valueFor(input, "retryAllowed", "retry_allowed"),
    receipt_ref: valueFor(input, "receiptRef", "receipt_ref"),
    artifact_record_ref: valueFor(input, "artifactRecordRef", "artifact_record_ref"),
    output_directory_ref: valueFor(input, "outputDirectoryRef", "output_directory_ref")
  };
  return {
    ...payloadWithoutHash,
    non_secret_payload_hash: hashPayload(payloadWithoutHash)
  };
}

function buildExactRouteHttpBody(input = {}) {
  const bodyWithoutHash = {
    pipeline_id: valueFor(input, "pipelineId", "pipeline_id"),
    task_id: valueFor(input, "taskId", "task_id"),
    route_id: valueFor(input, "routeId", "route_id"),
    max_provider_calls: valueFor(input, "maxProviderCalls", "max_provider_calls"),
    max_plugin_calls: valueFor(input, "maxPluginCalls", "max_plugin_calls"),
    max_api_calls: valueFor(input, "maxApiCalls", "max_api_calls"),
    max_images: valueFor(input, "maxImages", "max_images"),
    retry_allowed: valueFor(input, "retryAllowed", "retry_allowed"),
    receipt_ref: valueFor(input, "receiptRef", "receipt_ref"),
    artifact_record_ref: valueFor(input, "artifactRecordRef", "artifact_record_ref"),
    plan: {
      steps: [
        {
          type: "generate_image",
          plugin: "DoubaoGen",
          prompt: valueFor(input, "prompt", "prompt"),
          model: valueFor(input, "modelId", "model_id"),
          output_directory_ref: valueFor(input, "outputDirectoryRef", "output_directory_ref")
        }
      ]
    }
  };
  return {
    ...bodyWithoutHash,
    non_secret_payload_hash: hashPayload(bodyWithoutHash)
  };
}

function collectForbiddenPayloadKeys(body, rootPath = "body") {
  const found = [];

  function visit(node, currentPath) {
    if (Array.isArray(node)) {
      node.forEach((item, index) => visit(item, `${currentPath}[${index}]`));
      return;
    }
    if (!node || typeof node !== "object") return;

    Object.entries(node).forEach(([key, value]) => {
      const keyPath = `${currentPath}.${key}`;
      const normalizedKey = normalizePayloadKey(key);
      if (forbiddenPayloadKeysNormalized.includes(normalizedKey)) {
        found.push({ path: keyPath, key, normalized_key: normalizedKey });
      }
      visit(value, keyPath);
    });
  }

  visit(body, rootPath);
  return found;
}

function baseBoundary() {
  return {
    route_http_request_performed: false,
    live_probe_performed: false,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    image_count: 0,
    output_write_performed: false,
    output_refs: [],
    secret_value_read_performed: false,
    env_file_content_read_performed: false,
    config_env_read_performed: false,
    authorization_header_constructed_by_agent_image_lab: false,
    authorizer_call_count: 0,
    executor_call_count: 0,
    retry_performed: false,
    calls_used: {
      provider: 0,
      plugin: 0,
      api: 0,
      image: 0,
      route_http_request: 0
    }
  };
}

function validateRunnerInput(input = {}) {
  const body = input.body || input.payload || buildNonSecretPayload(input);
  const payload = input.payload || (input.body ? null : buildNonSecretPayload(input));
  const forbiddenPayloadKeys = collectForbiddenPayloadKeys(body);
  const payloadKeys = payload ? Object.keys(payload) : Object.keys(body || {});
  const unknownPayloadKeys = payloadKeys.filter((key) => !allowedNonSecretPayloadFields.includes(key));
  const missingPayloadKeys = allowedNonSecretPayloadFields.filter((key) => !payloadKeys.includes(key));
  const failures = [];
  const boundary = baseBoundary();
  const routeHttpRequested = Boolean(input.confirmRouteHttp || input.allowRouteHttp || input.routeHttpRequested);

  if (forbiddenPayloadKeys.length > 0) {
    failures.push({
      status: "secretless_option_a_payload_contains_forbidden_secret_key",
      reason: "payload contains a forbidden secret-bearing key",
      forbiddenPayloadKeys
    });
  }
  if (unknownPayloadKeys.length > 0) {
    failures.push({
      status: "secretless_option_a_payload_contains_unknown_key",
      reason: "payload contains fields outside the exact non-secret allowlist",
      unknownPayloadKeys
    });
  }
  if (missingPayloadKeys.length > 0) {
    failures.push({
      status: "secretless_option_a_payload_missing_required_key",
      reason: "payload is missing required non-secret fields",
      missingPayloadKeys
    });
  }
  if (payload) {
    const expectedHash = hashPayload(Object.fromEntries(
      Object.entries(payload).filter(([key]) => key !== "non_secret_payload_hash")
    ));
    if (payload.non_secret_payload_hash !== expectedHash) {
      failures.push({
        status: "secretless_option_a_payload_hash_mismatch",
        reason: "non-secret payload hash does not match payload content"
      });
    }
    if (
      payload.max_provider_calls !== 1 ||
      payload.max_plugin_calls !== 1 ||
      payload.max_api_calls !== 1 ||
      payload.max_images !== 1 ||
      payload.retry_allowed !== false
    ) {
      failures.push({
        status: "secretless_option_a_budget_drift",
        reason: "budget must remain one provider / one plugin / one API / one image / no retry"
      });
    }
  }
  if (routeHttpRequested) {
    failures.push({
      status: "secretless_option_a_route_http_not_allowed_by_current_task",
      reason: "current local runner implementation task does not authorize route HTTP"
    });
  }

  const firstFailure = failures[0];
  return {
    ok: failures.length === 0,
    status: firstFailure ? firstFailure.status : "secretless_option_a_callable_runner_input_validated",
    reason: firstFailure ? firstFailure.reason : "input validates for local preflight-only runner path",
    runner_id: runnerId,
    activation_package_id: input.activationPackageId || defaultInput.activationPackageId,
    confirmation_phrase_received: input.confirmationPhrase || defaultInput.confirmationPhrase,
    allowed_non_secret_payload_fields: [...allowedNonSecretPayloadFields],
    forbidden_payload_keys_detected: forbiddenPayloadKeys,
    failures,
    payload,
    ...boundary
  };
}

function normalizeRouteHttpOrigin(value) {
  if (typeof value !== "string" || !value.trim()) return null;
  const trimmed = value.trim().replace(/\/+$/, "");
  const parsed = new URL(trimmed);
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error("routeHttpOrigin must use http or https");
  }
  if (parsed.pathname !== "/" || parsed.search || parsed.hash) {
    throw new Error("routeHttpOrigin must be an origin only");
  }
  return parsed.origin;
}

function validateExactRouteHttpTransportInput(input = {}) {
  const routeHttpDefaults = routeHttpDefaultsForInput(input);
  if (input.attemptLockRef && !input.activationPackageId) {
    input.activationPackageId = routeHttpDefaults.activationPackageId;
  }
  const body = input.body || input.payload || buildExactRouteHttpBody({
    ...routeHttpDefaults,
    ...input
  });
  const forbiddenPayloadKeys = collectForbiddenPayloadKeys(body);
  const failures = [];
  const boundary = baseBoundary();
  const expectedMethod = routeHttpDefaults.routeHttpMethod || exactRouteHttpMethod;
  const expectedPath = routeHttpDefaults.routeHttpPath || exactRouteHttpPath;
  const expectedEndpointSource = routeHttpDefaults.routeHttpEndpointSource || exactRouteHttpEndpointSource;
  const method = input.routeHttpMethod || input.method || expectedMethod;
  const pathValue = input.routeHttpPath || input.path || expectedPath;
  let origin = null;

  try {
    origin = normalizeRouteHttpOrigin(input.routeHttpOrigin || input.origin || routeHttpDefaults.routeHttpOrigin);
  } catch (error) {
    failures.push({
      status: "secretless_option_a_route_http_origin_invalid",
      reason: error.message
    });
  }

  if (!origin) {
    failures.push({
      status: "secretless_option_a_route_http_origin_missing",
      reason: "exact route HTTP origin must be provided by a new activation; runner must not guess host or port"
    });
  }
  if (
    !input.attemptLockRef &&
    !allowedExactRouteHttpActivationPackageIds.includes(input.activationPackageId)
  ) {
    failures.push({
      status: "secretless_option_a_activation_package_mismatch",
      reason: "route HTTP transport requires an allowed exact activation package"
    });
  }
  if (input.attemptLockRef && routeHttpDefaults.activationPackageId !== input.activationPackageId) {
    failures.push({
      status: "secretless_option_a_activation_package_mismatch",
      reason: "route HTTP transport activation package must match the supplied attempt lock"
    });
  }
  if (!input.preflightOnly && input.confirmationPhrase !== exactConfirmationPhrase) {
    failures.push({
      status: "secretless_option_a_confirmation_phrase_missing",
      reason: "exact owner confirmation phrase is required"
    });
  }
  if (method !== expectedMethod) {
    failures.push({
      status: "secretless_option_a_route_http_method_mismatch",
      reason: "route HTTP method must match the activation-specific VCPToolBox route evidence"
    });
  }
  if (pathValue !== expectedPath) {
    failures.push({
      status: "secretless_option_a_route_http_path_mismatch",
      reason: "route HTTP path must match the activation-specific VCPToolBox route evidence"
    });
  }
  if (forbiddenPayloadKeys.length > 0) {
    failures.push({
      status: "secretless_option_a_payload_contains_forbidden_secret_key",
      reason: "payload contains a forbidden secret-bearing key",
      forbiddenPayloadKeys
    });
  }
  if (
    body.route_id !== "serum_bottle_vcptoolbox_route_owner_runtime" &&
    body.route_id !== "serum_bottle_secretless_option_a" &&
    body.route_id !== "secretless_serum_option_a"
  ) {
    failures.push({
      status: "secretless_option_a_route_scope_not_authorized",
      reason: "route_id is not one of the VCPToolBox bcb8219a secretless serum route ids"
    });
  }
  if (
    body.max_provider_calls !== 1 ||
    body.max_plugin_calls !== 1 ||
    body.max_api_calls !== 1 ||
    body.max_images !== 1 ||
    body.retry_allowed !== false
  ) {
    failures.push({
      status: "secretless_option_a_budget_drift",
      reason: "budget must remain one provider / one plugin / one API / one image / no retry"
    });
  }
  const steps = Array.isArray(body.plan && body.plan.steps) ? body.plan.steps : [];
  if (
    steps.length !== 1 ||
    !steps[0] ||
    steps[0].plugin !== "DoubaoGen" ||
    steps[0].type !== "generate_image"
  ) {
    failures.push({
      status: "secretless_option_a_plugin_scope_not_authorized",
      reason: "plan.steps must contain exactly one DoubaoGen generate_image step"
    });
  }

  return {
    ok: failures.length === 0,
    status: failures[0] ? failures[0].status : "secretless_option_a_route_http_transport_input_validated",
    reason: failures[0] ? failures[0].reason : "input validates for exact route HTTP transport",
    runner_id: runnerId,
    activation_package_id: input.activationPackageId || null,
    confirmation_phrase_received: input.confirmationPhrase || null,
    route_http_method: method,
    route_http_path: pathValue,
    route_http_origin: origin,
    route_http_url: origin ? `${origin}${pathValue}` : null,
    endpoint_source: expectedEndpointSource,
    attempt_lock_ref: input.attemptLockRef || null,
    forbidden_payload_keys_detected: forbiddenPayloadKeys,
    failures,
    body,
    ...boundary
  };
}

function runSecretlessOptionACallableRunner(input = {}) {
  const preflightOnly = Boolean(input.preflightOnly);
  const validation = validateRunnerInput(input);
  const boundary = baseBoundary();

  if (!validation.ok) {
    return {
      ok: false,
      passed: false,
      runner_id: runnerId,
      status: validation.status,
      result: {
        status: validation.status,
        reason: validation.reason,
        validation,
        ...boundary
      },
      ...boundary
    };
  }

  if (preflightOnly) {
    return {
      ok: true,
      passed: true,
      runner_id: runnerId,
      status: "secretless_option_a_callable_runner_preflight_only_passed_no_route_http",
      result: {
        status: "secretless_option_a_callable_runner_preflight_only_passed_no_route_http",
        payload: validation.payload,
        validation,
        ...boundary
      },
      ...boundary
    };
  }

  return {
    ok: false,
    passed: false,
    runner_id: runnerId,
    status: "secretless_option_a_callable_runner_failed_closed_route_http_not_authorized",
    result: {
      status: "secretless_option_a_callable_runner_failed_closed_route_http_not_authorized",
      reason: "current task implemented the local runner surface only; route HTTP requires a new exact activation and explicit callable binding",
      validation,
      ...boundary
    },
    ...boundary
  };
}

const exactAttemptReceiptArtifactConfigs = Object.freeze({
  [exactRouteHttpActivationPackageIdAttempt007]: Object.freeze({
    activationPackageId: exactRouteHttpActivationPackageIdAttempt007,
    bindingPacketId: bindingPacketIdAttempt007,
    bindingPacketRef: bindingPacketRefAttempt007,
    receiptRef: receiptRefAttempt007,
    receiptId: "secretless_serum_live_probe_receipt_20260603_attempt_007",
    artifactRecordRef: artifactRecordRefAttempt007,
    artifactRecordId: "secretless_serum_live_probe_artifact_record_20260603_attempt_007",
    outputDirectoryRef: outputDirectoryRefAttempt007,
    agentImageLabRunnerRequiredCommit: agentImageLabRunnerRequiredCommitAttempt007,
    vcptoolboxRequiredCommit: vcptoolboxRequiredCommitAttempt007
  }),
  [exactRouteHttpActivationPackageIdAttempt008]: Object.freeze({
    activationPackageId: exactRouteHttpActivationPackageIdAttempt008,
    bindingPacketId: bindingPacketIdAttempt008,
    bindingPacketRef: bindingPacketRefAttempt008,
    receiptRef: receiptRefAttempt008,
    receiptId: "secretless_serum_live_probe_receipt_20260603_attempt_008",
    artifactRecordRef: artifactRecordRefAttempt008,
    artifactRecordId: "secretless_serum_live_probe_artifact_record_20260603_attempt_008",
    outputDirectoryRef: outputDirectoryRefAttempt008,
    agentImageLabRunnerRequiredCommit: agentImageLabRunnerRequiredCommitAttempt008,
    vcptoolboxRequiredCommit: vcptoolboxRequiredCommitAttempt008
  }),
  [exactRouteHttpActivationPackageIdAttempt009]: Object.freeze({
    activationPackageId: exactRouteHttpActivationPackageIdAttempt009,
    bindingPacketId: bindingPacketIdAttempt009,
    bindingPacketRef: bindingPacketRefAttempt009,
    receiptRef: receiptRefAttempt009,
    receiptId: "secretless_serum_live_probe_receipt_20260603_attempt_009",
    artifactRecordRef: artifactRecordRefAttempt009,
    artifactRecordId: "secretless_serum_live_probe_artifact_record_20260603_attempt_009",
    outputDirectoryRef: outputDirectoryRefAttempt009,
    agentImageLabRunnerRequiredCommit: agentImageLabRunnerRequiredCommitAttempt009,
    vcptoolboxRequiredCommit: vcptoolboxRequiredCommitAttempt009
  }),
  [exactRouteHttpActivationPackageIdAttempt010]: Object.freeze({
    activationPackageId: exactRouteHttpActivationPackageIdAttempt010,
    bindingPacketId: bindingPacketIdAttempt010,
    bindingPacketRef: bindingPacketRefAttempt010,
    receiptRef: receiptRefAttempt010,
    receiptId: "secretless_serum_live_probe_receipt_20260603_attempt_010",
    artifactRecordRef: artifactRecordRefAttempt010,
    artifactRecordId: "secretless_serum_live_probe_artifact_record_20260603_attempt_010",
    outputDirectoryRef: outputDirectoryRefAttempt010,
    agentImageLabRunnerRequiredCommit: agentImageLabRunnerRequiredCommitAttempt010,
    vcptoolboxRequiredCommit: vcptoolboxRequiredCommitAttempt010
  }),
  [exactRouteHttpActivationPackageIdAttempt011]: Object.freeze({
    activationPackageId: exactRouteHttpActivationPackageIdAttempt011,
    bindingPacketId: bindingPacketIdAttempt011,
    bindingPacketRef: bindingPacketRefAttempt011,
    receiptRef: receiptRefAttempt011,
    receiptId: "secretless_serum_live_probe_receipt_20260603_attempt_011",
    artifactRecordRef: artifactRecordRefAttempt011,
    artifactRecordId: "secretless_serum_live_probe_artifact_record_20260603_attempt_011",
    outputDirectoryRef: outputDirectoryRefAttempt011,
    agentImageLabRunnerRequiredCommit: agentImageLabRunnerRequiredCommitAttempt011,
    vcptoolboxRequiredCommit: vcptoolboxRequiredCommitAttempt011
  }),
  [exactRouteHttpActivationPackageIdAttempt012]: Object.freeze({
    activationPackageId: exactRouteHttpActivationPackageIdAttempt012,
    bindingPacketId: bindingPacketIdAttempt012,
    bindingPacketRef: bindingPacketRefAttempt012,
    receiptRef: receiptRefAttempt012,
    receiptId: "secretless_serum_live_probe_receipt_20260603_attempt_012",
    artifactRecordRef: artifactRecordRefAttempt012,
    artifactRecordId: "secretless_serum_live_probe_artifact_record_20260603_attempt_012",
    outputDirectoryRef: outputDirectoryRefAttempt012,
    agentImageLabRunnerRequiredCommit: agentImageLabRunnerRequiredCommitAttempt012,
    vcptoolboxRequiredCommit: vcptoolboxRequiredCommitAttempt012
  }),
  [exactRouteHttpActivationPackageIdAttempt013]: Object.freeze({
    activationPackageId: exactRouteHttpActivationPackageIdAttempt013,
    bindingPacketId: bindingPacketIdAttempt013,
    bindingPacketRef: bindingPacketRefAttempt013,
    receiptRef: receiptRefAttempt013,
    receiptId: "secretless_serum_live_probe_receipt_20260603_attempt_013",
    artifactRecordRef: artifactRecordRefAttempt013,
    artifactRecordId: "secretless_serum_live_probe_artifact_record_20260603_attempt_013",
    outputDirectoryRef: outputDirectoryRefAttempt013,
    agentImageLabRunnerRequiredCommit: agentImageLabRunnerRequiredCommitAttempt013,
    vcptoolboxRequiredCommit: vcptoolboxRequiredCommitAttempt013
  }),
  [exactRouteHttpActivationPackageIdAttempt014]: Object.freeze({
    activationPackageId: exactRouteHttpActivationPackageIdAttempt014,
    bindingPacketId: bindingPacketIdAttempt014,
    bindingPacketRef: bindingPacketRefAttempt014,
    receiptRef: receiptRefAttempt014,
    receiptId: "secretless_serum_live_probe_receipt_20260603_attempt_014",
    artifactRecordRef: artifactRecordRefAttempt014,
    artifactRecordId: "secretless_serum_live_probe_artifact_record_20260603_attempt_014",
    outputDirectoryRef: outputDirectoryRefAttempt014,
    agentImageLabRunnerRequiredCommit: agentImageLabRunnerRequiredCommitAttempt014,
    vcptoolboxRequiredCommit: vcptoolboxRequiredCommitAttempt014
  }),
  [exactRouteHttpActivationPackageIdAttempt015]: Object.freeze({
    activationPackageId: exactRouteHttpActivationPackageIdAttempt015,
    bindingPacketId: bindingPacketIdAttempt015,
    bindingPacketRef: bindingPacketRefAttempt015,
    receiptRef: receiptRefAttempt015,
    receiptId: "secretless_serum_live_probe_receipt_20260603_attempt_015",
    artifactRecordRef: artifactRecordRefAttempt015,
    artifactRecordId: "secretless_serum_live_probe_artifact_record_20260603_attempt_015",
    outputDirectoryRef: outputDirectoryRefAttempt015,
    agentImageLabRunnerRequiredCommit: agentImageLabRunnerRequiredCommitAttempt015,
    vcptoolboxRequiredCommit: vcptoolboxRequiredCommitAttempt015,
    attemptLockRef: attemptLockRefAttempt015
  }),
  [exactRouteHttpActivationPackageIdAttempt016]: Object.freeze({
    activationPackageId: exactRouteHttpActivationPackageIdAttempt016,
    bindingPacketId: bindingPacketIdAttempt016,
    bindingPacketRef: bindingPacketRefAttempt016,
    receiptRef: receiptRefAttempt016,
    receiptId: "secretless_serum_live_probe_receipt_20260603_attempt_016",
    artifactRecordRef: artifactRecordRefAttempt016,
    artifactRecordId: "secretless_serum_live_probe_artifact_record_20260603_attempt_016",
    outputDirectoryRef: outputDirectoryRefAttempt016,
    agentImageLabRunnerRequiredCommit: agentImageLabRunnerRequiredCommitAttempt016,
    vcptoolboxRequiredCommit: vcptoolboxRequiredCommitAttempt016,
    attemptLockRef: attemptLockRefAttempt016
  })
});

async function runAttemptFinalGate(validation, config) {
  if (!config || !config.attemptLockRef) {
    return {
      passed: true,
      status: "secretless_option_a_final_gate_not_required_for_legacy_attempt"
    };
  }

  const sourceBinding = verifyAttemptLockBinding({
    lockPath: config.attemptLockRef,
    strictCommits: true
  });
  const lock = readAttemptLock(config.attemptLockRef);
  const lockAuthorization = {
    passed:
      lock.authorization_boundary?.can_execute_now === true &&
      lock.authorization_boundary?.route_http_allowed_by_this_lock === true &&
      lock.authorization_boundary?.separate_exact_activation_required === false,
    can_execute_now: lock.authorization_boundary?.can_execute_now === true,
    route_http_allowed_by_this_lock: lock.authorization_boundary?.route_http_allowed_by_this_lock === true,
    separate_exact_activation_required: lock.authorization_boundary?.separate_exact_activation_required === true,
    status: "lock_authorization_boundary_checked"
  };
  const listener = {
    passed: false,
    status: "not_checked",
    http_status: null
  };

  if (lockAuthorization.passed !== true) {
    return {
      passed: false,
      status: "secretless_option_a_final_gate_failed_closed_lock_authorization_boundary",
      lock_ref: config.attemptLockRef,
      lock_sha256: sourceBinding.lock_sha256,
      agent_image_lab_head: sourceBinding.agent_image_lab_head,
      vcptoolbox_head: sourceBinding.vcptoolbox_head,
      lock_authorization: lockAuthorization,
      listener,
      surface: listener,
      source_binding: sourceBinding,
      pending_output_paths: {
        receipt_ref: config.receiptRef,
        artifact_record_ref: config.artifactRecordRef,
        output_directory_ref: config.outputDirectoryRef
      },
      route_http_request_performed: false,
      live_probe_performed: false,
      provider_contact_performed: false,
      plugin_call_performed: false,
      api_call_performed: false,
      image_generation_performed: false,
      image_count: 0,
      output_write_performed: false,
      output_refs: [],
      calls_used: baseBoundary().calls_used
    };
  }

  try {
    const response = await fetch(validation.route_http_url, { method: "HEAD" });
    listener.passed = Number.isInteger(response.status) &&
      response.status >= 100 &&
      response.status < 600;
    listener.status = listener.passed
      ? "listener_surface_http_response_observed"
      : "listener_surface_failed_closed";
    listener.http_status = response.status;
    listener.expected_status = "any_http_response";
  } catch (error) {
    listener.status = "listener_fetch_failed_closed";
    listener.error = error instanceof Error ? error.message : String(error);
  }

  const passed = sourceBinding.passed === true && listener.passed === true;
  return {
    passed,
    status: passed
      ? "secretless_option_a_final_gate_passed"
      : "secretless_option_a_final_gate_failed_closed_before_post",
    lock_ref: config.attemptLockRef,
    lock_sha256: sourceBinding.lock_sha256,
    agent_image_lab_head: sourceBinding.agent_image_lab_head,
    vcptoolbox_head: sourceBinding.vcptoolbox_head,
    lock_authorization: lockAuthorization,
    listener,
    surface: listener,
    source_binding: sourceBinding,
    pending_output_paths: {
      receipt_ref: config.receiptRef,
      artifact_record_ref: config.artifactRecordRef,
      output_directory_ref: config.outputDirectoryRef
    },
    route_http_request_performed: false,
    live_probe_performed: false,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    image_count: 0,
    output_write_performed: false,
    output_refs: [],
    calls_used: baseBoundary().calls_used
  };
}

function repoPathForExactAttempt(relativePath, expectedRelativePath) {
  if (relativePath !== expectedRelativePath) {
    throw new Error(`exact attempt may only write ${expectedRelativePath}`);
  }

  const resolved = path.resolve(repoRoot, relativePath);
  const relative = path.relative(repoRoot, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`exact attempt path escapes repository: ${relativePath}`);
  }

  return resolved;
}

function writeJsonNoOverwrite(relativePath, expectedRelativePath, payload) {
  const target = repoPathForExactAttempt(relativePath, expectedRelativePath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, `${JSON.stringify(payload, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
}

function summarizeRouteResult(json) {
  const result = json && json.result && typeof json.result === "object"
    ? json.result
    : {};
  const evidence = result.serumBottleSecretlessRuntimeEvidence &&
    typeof result.serumBottleSecretlessRuntimeEvidence === "object"
    ? result.serumBottleSecretlessRuntimeEvidence
    : {};

  return {
    ok: json && json.ok === true,
    route_result_status: result.status || null,
    route_result_mode: result.mode || null,
    delegate_id: evidence.delegateId || null,
    provider_id: evidence.providerId || null,
    plugin_id: evidence.pluginId || null,
    api_id: evidence.apiId || null,
    internal_command: evidence.internalCommand || null,
    provider_calls: Number(evidence.providerCalls) || 0,
    plugin_calls: Number(evidence.pluginCalls) || 0,
    api_calls: Number(evidence.apiCalls) || 0,
    images: Number(evidence.images) || 0,
    artifact: evidence.artifact || null
  };
}

function buildAttemptReceiptAndArtifact(execution, validation, json, responseStatus, config) {
  const body = validation.body;
  const routeSummary = summarizeRouteResult(json);
  const succeeded = execution.ok === true;
  const providerConsumed = execution.calls_used.provider > 0;
  const resultStatus = succeeded
    ? "succeeded"
    : providerConsumed
      ? "failed_after_provider_budget_consumed"
      : "failed_closed_before_provider_call";

  const boundary = {
    secret_value_read_performed: false,
    env_file_content_read_performed: false,
    config_env_read_performed: false,
    authorization_header_constructed_by_agent_image_lab: false,
    old_admin_auth_route_used: false,
    retry_performed: false,
    push_tag_release_deploy_performed: false
  };

  const receipt = {
    schema: "runtime_to_review_v1_secretless_serum_live_probe_receipt.v3",
    receipt_id: config.receiptId,
    activation_package_id: config.activationPackageId,
    binding_packet_id: config.bindingPacketId,
    binding_packet_ref: config.bindingPacketRef,
    agent_image_lab_runner_required_commit: config.agentImageLabRunnerRequiredCommit,
    vcptoolbox_required_commit: config.vcptoolboxRequiredCommit,
    status: resultStatus,
    result: succeeded ? "succeeded" : "failed_closed",
    activation_attempt_consumed: true,
    route_http_transport: {
      origin: validation.route_http_origin,
      method: validation.route_http_method,
      path: validation.route_http_path,
      endpoint_source: validation.endpoint_source
    },
    payload_summary: {
      pipeline_id: body.pipeline_id,
      task_id: body.task_id,
      route_id: body.route_id,
      max_provider_calls: body.max_provider_calls,
      max_plugin_calls: body.max_plugin_calls,
      max_api_calls: body.max_api_calls,
      max_images: body.max_images,
      retry_allowed: body.retry_allowed,
      receipt_ref: body.receipt_ref,
      artifact_record_ref: body.artifact_record_ref,
      output_directory_ref: body.plan.steps[0].output_directory_ref,
      non_secret_payload_hash: body.non_secret_payload_hash
    },
    route_http_request_performed: execution.route_http_request_performed,
    live_probe_performed: execution.live_probe_performed,
    provider_contact_performed: execution.provider_contact_performed,
    plugin_call_performed: execution.plugin_call_performed,
    api_call_performed: execution.api_call_performed,
    image_generation_performed: execution.image_generation_performed,
    image_count: execution.image_count,
    output_write_performed: execution.output_write_performed,
    output_refs: execution.output_refs,
    calls_used: execution.calls_used,
    route_response_status_code: responseStatus,
    route_response_summary: routeSummary,
    receipt_write_performed: true,
    artifact_record_ref: config.artifactRecordRef,
    boundary
  };

  const artifact = {
    schema: "runtime_to_review_v1_secretless_serum_live_probe_artifact_record.v3",
    artifact_record_id: config.artifactRecordId,
    activation_package_id: config.activationPackageId,
    receipt_ref: config.receiptRef,
    status: succeeded ? "artifact_recorded" : "failed_no_artifact_created",
    result: resultStatus,
    artifact_created: succeeded && execution.image_count === 1,
    output_directory_ref: config.outputDirectoryRef,
    output_refs: execution.output_refs,
    provider_contact_performed: execution.provider_contact_performed,
    plugin_call_performed: execution.plugin_call_performed,
    api_call_performed: execution.api_call_performed,
    image_generation_performed: execution.image_generation_performed,
    image_count: execution.image_count,
    output_write_performed: execution.output_write_performed,
    route_response_summary: routeSummary,
    artifact_evidence: routeSummary.artifact,
    boundary
  };

  return { receipt, artifact };
}

function writeAttemptReceiptAndArtifact(execution, validation, json, responseStatus) {
  const config = exactAttemptConfigForValidation(validation);
  if (!config) {
    return { receipt_write_performed: false, artifact_record_write_performed: false };
  }

  const records = buildAttemptReceiptAndArtifact(execution, validation, json, responseStatus, config);
  writeJsonNoOverwrite(config.receiptRef, config.receiptRef, records.receipt);
  writeJsonNoOverwrite(config.artifactRecordRef, config.artifactRecordRef, records.artifact);
  return {
    receipt_write_performed: true,
    artifact_record_write_performed: true,
    receipt_ref: config.receiptRef,
    artifact_record_ref: config.artifactRecordRef
  };
}

async function runSecretlessOptionAExactRouteHttpTransport(input = {}) {
  const validation = validateExactRouteHttpTransportInput(input);
  const boundary = baseBoundary();

  if (!validation.ok) {
    return {
      ok: false,
      passed: false,
      runner_id: runnerId,
      status: validation.status,
      result: {
        status: validation.status,
        reason: validation.reason,
        validation,
        ...boundary
      },
      ...boundary
    };
  }

  if (input.preflightOnly) {
    return {
      ok: true,
      passed: true,
      runner_id: runnerId,
      status: "secretless_option_a_route_http_preflight_only_passed_no_route_http",
      route_http_request_performed: false,
      live_probe_performed: false,
      provider_contact_performed: false,
      plugin_call_performed: false,
      api_call_performed: false,
      image_generation_performed: false,
      image_count: 0,
      output_write_performed: false,
      output_refs: [],
      secret_value_read_performed: false,
      env_file_content_read_performed: false,
      config_env_read_performed: false,
      authorization_header_constructed_by_agent_image_lab: false,
      authorizer_call_count: 0,
      executor_call_count: 0,
      retry_performed: false,
      calls_used: boundary.calls_used,
      validation
    };
  }

  const config = exactAttemptConfigForValidation(validation);
  const finalGate = await runAttemptFinalGate(validation, config);
  if (finalGate.passed !== true) {
    return {
      ok: false,
      passed: false,
      runner_id: runnerId,
      status: finalGate.status,
      result: finalGate,
      ...baseBoundary()
    };
  }

  let response = null;
  let text = "";
  let json = null;
  let fetchError = null;

  try {
    response = await fetch(validation.route_http_url, {
      method: exactRouteHttpMethod,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(validation.body)
    });
    text = await response.text();
  } catch (error) {
    fetchError = error;
  }

  if (fetchError) {
    json = {
      ok: false,
      result: {
        status: "secretless_option_a_route_http_fetch_failed_closed",
        reason: fetchError instanceof Error ? fetchError.message : String(fetchError)
      }
    };
  } else {
    try {
      json = text ? JSON.parse(text) : null;
    } catch (error) {
      json = {
        ok: false,
        result: {
          status: "secretless_option_a_route_http_response_parse_failed_closed",
          reason: error instanceof Error ? error.message : String(error)
        }
      };
    }
  }

  const routeSummaryForExecution = summarizeRouteResult(json);
  const routeResult = json && json.result && typeof json.result === "object"
    ? json.result
    : {};

  const execution = {
    ok: Boolean(response && response.ok && json && json.ok === true),
    passed: Boolean(response && response.ok && json && json.ok === true),
    runner_id: runnerId,
    status: response && response.ok ? "secretless_option_a_route_http_response_received" : "secretless_option_a_route_http_response_not_ok",
    route_http_request_performed: true,
    live_probe_performed: true,
    provider_contact_performed: routeSummaryForExecution.provider_calls > 0 || routeResult.provider_contact_performed === true,
    plugin_call_performed: routeSummaryForExecution.plugin_calls > 0 || routeResult.plugin_call_performed === true,
    api_call_performed: routeSummaryForExecution.api_calls > 0 || routeResult.api_call_performed === true,
    image_generation_performed: routeSummaryForExecution.images > 0 || routeResult.image_generation_performed === true,
    image_count: routeSummaryForExecution.images || Number(routeResult.image_count) || 0,
    output_write_performed: Boolean(routeResult.output_write_performed),
    output_refs: Array.isArray(routeResult.output_refs) ? routeResult.output_refs : [],
    secret_value_read_performed: false,
    env_file_content_read_performed: false,
    config_env_read_performed: false,
    authorization_header_constructed_by_agent_image_lab: false,
    authorizer_call_count: 0,
    executor_call_count: 0,
    retry_performed: false,
    calls_used: {
      provider: routeSummaryForExecution.provider_calls || (routeResult.provider_contact_performed === true ? 1 : 0),
      plugin: routeSummaryForExecution.plugin_calls || (routeResult.plugin_call_performed === true ? 1 : 0),
      api: routeSummaryForExecution.api_calls || (routeResult.api_call_performed === true ? 1 : 0),
      image: routeSummaryForExecution.images || Number(routeResult.image_count) || 0,
      route_http_request: 1
    },
    result: json,
    validation
  };

  const writeResult = writeAttemptReceiptAndArtifact(
    execution,
    validation,
    json,
    response ? response.status : null
  );

  return {
    ...execution,
    ...writeResult
  };
}

function applyAttemptRouteDefaults(input) {
  if (input.routeHttpFromLock === true && input.attemptLockRef && !input.activationPackageId) {
    input.activationPackageId = routeDefaultsFromAttemptLock(input.attemptLockRef).activationPackageId;
    return input;
  }
  if (input.attempt015RouteHttp === true && !input.activationPackageId) {
    input.activationPackageId = exactRouteHttpActivationPackageIdAttempt015;
  } else if (input.attempt016RouteHttp === true && !input.activationPackageId) {
    input.activationPackageId = exactRouteHttpActivationPackageIdAttempt016;
  } else if (input.attempt014RouteHttp === true && !input.activationPackageId) {
    input.activationPackageId = exactRouteHttpActivationPackageIdAttempt014;
  } else if (input.attempt013RouteHttp === true && !input.activationPackageId) {
    input.activationPackageId = exactRouteHttpActivationPackageIdAttempt013;
  } else if (input.attempt012RouteHttp === true && !input.activationPackageId) {
    input.activationPackageId = exactRouteHttpActivationPackageIdAttempt012;
  } else if (input.attempt011RouteHttp === true && !input.activationPackageId) {
    input.activationPackageId = exactRouteHttpActivationPackageIdAttempt011;
  } else if (input.attempt010RouteHttp === true && !input.activationPackageId) {
    input.activationPackageId = exactRouteHttpActivationPackageIdAttempt010;
  } else if (input.attempt009RouteHttp === true && !input.activationPackageId) {
    input.activationPackageId = exactRouteHttpActivationPackageIdAttempt009;
  } else if (input.attempt008RouteHttp === true && !input.activationPackageId) {
    input.activationPackageId = exactRouteHttpActivationPackageIdAttempt008;
  } else if (input.attempt007RouteHttp === true && !input.activationPackageId) {
    input.activationPackageId = exactRouteHttpActivationPackageIdAttempt007;
  } else if (input.attempt006RouteHttp === true && !input.activationPackageId) {
    input.activationPackageId = exactRouteHttpActivationPackageIdAttempt006;
  } else if (input.attempt005RouteHttp === true && !input.activationPackageId) {
    input.activationPackageId = exactRouteHttpActivationPackageIdAttempt005;
  } else if (input.attempt004RouteHttp === true && !input.activationPackageId) {
    input.activationPackageId = exactRouteHttpActivationPackageIdAttempt004;
  } else if (input.attempt003RouteHttp === true && !input.activationPackageId) {
    input.activationPackageId = exactRouteHttpActivationPackageId;
  }

  return input;
}

function parseArgs(argv) {
  const input = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--preflight-only") {
      input.preflightOnly = true;
    } else if (arg === "--confirm-route-http" || arg === "--allow-route-http") {
      input.confirmRouteHttp = true;
    } else if (arg === "--activation-package-id") {
      input.activationPackageId = argv[index + 1];
      index += 1;
    } else if (arg === "--attempt-lock") {
      input.attemptLockRef = argv[index + 1];
      index += 1;
    } else if (arg === "--route-http-from-lock") {
      input.routeHttpFromLock = true;
    } else if (arg === "--confirmation-phrase") {
      input.confirmationPhrase = argv[index + 1];
      index += 1;
    } else if (arg === "--model-id") {
      input.modelId = argv[index + 1];
      index += 1;
    } else if (arg === "--receipt-ref") {
      input.receiptRef = argv[index + 1];
      index += 1;
    } else if (arg === "--artifact-record-ref") {
      input.artifactRecordRef = argv[index + 1];
      index += 1;
    } else if (arg === "--output-directory-ref") {
      input.outputDirectoryRef = argv[index + 1];
      index += 1;
    } else if (arg === "--payload-json") {
      input.body = JSON.parse(argv[index + 1]);
      index += 1;
    } else if (arg === "--attempt-003-route-http") {
      input.attempt003RouteHttp = true;
    } else if (arg === "--attempt-004-route-http") {
      input.attempt004RouteHttp = true;
    } else if (arg === "--attempt-005-route-http") {
      input.attempt005RouteHttp = true;
    } else if (arg === "--attempt-006-route-http") {
      input.attempt006RouteHttp = true;
    } else if (arg === "--attempt-007-route-http") {
      input.attempt007RouteHttp = true;
    } else if (arg === "--attempt-008-route-http") {
      input.attempt008RouteHttp = true;
    } else if (arg === "--attempt-009-route-http") {
      input.attempt009RouteHttp = true;
    } else if (arg === "--attempt-010-route-http") {
      input.attempt010RouteHttp = true;
    } else if (arg === "--attempt-011-route-http") {
      input.attempt011RouteHttp = true;
    } else if (arg === "--attempt-012-route-http") {
      input.attempt012RouteHttp = true;
    } else if (arg === "--attempt-013-route-http") {
      input.attempt013RouteHttp = true;
    } else if (arg === "--attempt-014-route-http") {
      input.attempt014RouteHttp = true;
    } else if (arg === "--attempt-015-route-http") {
      input.attempt015RouteHttp = true;
    } else if (arg === "--attempt-016-route-http") {
      input.attempt016RouteHttp = true;
    } else if (arg === "--route-http-origin") {
      input.routeHttpOrigin = argv[index + 1];
      index += 1;
    } else if (arg === "--route-http-method") {
      input.routeHttpMethod = argv[index + 1];
      index += 1;
    } else if (arg === "--route-http-path") {
      input.routeHttpPath = argv[index + 1];
      index += 1;
    } else if (arg === "--prompt") {
      input.prompt = argv[index + 1];
      index += 1;
    } else if (arg === "--pipeline-id") {
      input.pipelineId = argv[index + 1];
      index += 1;
    } else if (arg === "--task-id") {
      input.taskId = argv[index + 1];
      index += 1;
    }
  }
  return applyAttemptRouteDefaults(input);
}

if (require.main === module) {
  const input = parseArgs(process.argv.slice(2));
  const run = input.routeHttpFromLock || input.attempt003RouteHttp || input.attempt004RouteHttp || input.attempt005RouteHttp || input.attempt006RouteHttp || input.attempt007RouteHttp || input.attempt008RouteHttp || input.attempt009RouteHttp || input.attempt010RouteHttp || input.attempt011RouteHttp || input.attempt012RouteHttp || input.attempt013RouteHttp || input.attempt014RouteHttp || input.attempt015RouteHttp || input.attempt016RouteHttp
    ? runSecretlessOptionAExactRouteHttpTransport(input)
    : Promise.resolve(runSecretlessOptionACallableRunner(input));
  run.then((result) => {
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    if (!result.passed) process.exitCode = 1;
  }).catch((error) => {
    process.stdout.write(`${JSON.stringify({
      ok: false,
      passed: false,
      runner_id: runnerId,
      status: "secretless_option_a_callable_runner_unhandled_error",
      error: error instanceof Error ? error.message : String(error),
      ...baseBoundary()
    }, null, 2)}\n`);
    process.exitCode = 1;
  });
}

module.exports = {
  runnerId,
  exactActivationPackageId,
  exactRouteHttpActivationPackageId,
  exactRouteHttpActivationPackageIdAttempt004,
  exactRouteHttpActivationPackageIdAttempt005,
  exactRouteHttpActivationPackageIdAttempt006,
  exactRouteHttpActivationPackageIdAttempt007,
  exactRouteHttpActivationPackageIdAttempt008,
  exactRouteHttpActivationPackageIdAttempt009,
  exactRouteHttpActivationPackageIdAttempt010,
  exactRouteHttpActivationPackageIdAttempt011,
  exactRouteHttpActivationPackageIdAttempt012,
  exactRouteHttpActivationPackageIdAttempt013,
  exactRouteHttpActivationPackageIdAttempt014,
  exactRouteHttpActivationPackageIdAttempt015,
  exactRouteHttpActivationPackageIdAttempt016,
  exactConfirmationPhrase,
  exactRouteHttpMethod,
  exactRouteHttpPath,
  exactRouteHttpEndpointSource,
  exactRouteHttpPathAttempt005,
  exactRouteHttpEndpointSourceAttempt005,
  exactRouteHttpEndpointSourceAttempt006,
  exactRouteHttpEndpointSourceAttempt007,
  exactRouteHttpEndpointSourceAttempt008,
  exactRouteHttpEndpointSourceAttempt009,
  exactRouteHttpEndpointSourceAttempt010,
  exactRouteHttpEndpointSourceAttempt011,
  exactRouteHttpEndpointSourceAttempt012,
  exactRouteHttpEndpointSourceAttempt013,
  exactRouteHttpEndpointSourceAttempt014,
  exactRouteHttpEndpointSourceAttempt015,
  exactRouteHttpEndpointSourceAttempt016,
  defaultInput,
  defaultRouteHttpInput,
  defaultRouteHttpInputAttempt004,
  defaultRouteHttpInputAttempt005,
  defaultRouteHttpInputAttempt006,
  defaultRouteHttpInputAttempt007,
  defaultRouteHttpInputAttempt008,
  defaultRouteHttpInputAttempt009,
  defaultRouteHttpInputAttempt010,
  defaultRouteHttpInputAttempt011,
  defaultRouteHttpInputAttempt012,
  defaultRouteHttpInputAttempt013,
  defaultRouteHttpInputAttempt014,
  defaultRouteHttpInputAttempt015,
  defaultRouteHttpInputAttempt016,
  allowedExactRouteHttpActivationPackageIds,
  attemptLockRefAttempt015,
  attemptLockRefAttempt016,
  allowedNonSecretPayloadFields,
  forbiddenPayloadKeysNormalized,
  normalizePayloadKey,
  collectForbiddenPayloadKeys,
  buildNonSecretPayload,
  buildExactRouteHttpBody,
  validateRunnerInput,
  validateExactRouteHttpTransportInput,
  runSecretlessOptionACallableRunner,
  runSecretlessOptionAExactRouteHttpTransport,
  runAttemptFinalGate,
  applyAttemptRouteDefaults,
  parseArgs
};
