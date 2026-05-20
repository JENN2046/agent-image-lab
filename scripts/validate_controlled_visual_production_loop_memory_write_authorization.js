#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const packageRef = "reports/memory_write_authorization/2026-05-20_tennis_wallet_memory_write_A5_authorization_package.json";
const registryRef = "accepted_samples/accepted_sample_registry.yaml";
const categoryRef = "accepted_samples/categories/product_still_life.yaml";
const reviewDocRef = "docs/281_v7_24_native_doubao_v3_post_run_review_accepted_candidate.md";
const reviewRecordRef = "asset_archive/accepted_samples/accepted_product_still_life_tennis_wallet_001/review_record.json";
const approvalRecordRef = "asset_archive/accepted_samples/accepted_product_still_life_tennis_wallet_001/approval_record.json";
const memoryBoundaryRef = "docs/v7_49_vcp_memory_write_boundary_spec.md";
const memoryGateRef = "docs/259_v7_4_memory_write_gate_package.md";
const reviewBridgeRef = "tests/schema_examples/CONTROLLED_VISUAL_PRODUCTION_LOOP_REVIEW_BRIDGE_STATE.example.json";
const expectedSampleId = "accepted_product_still_life_tennis_wallet_001";
const expectedFailureId = "failure_tennis_wallet_v7_21_001";
const expectedAuthorizationId = "AUTH-PENDING-TENNIS-WALLET-MEMORY-WRITE-20260520-001";

function readText(ref) {
  return fs.readFileSync(path.join(root, ref), "utf8");
}

function readJson(ref) {
  return JSON.parse(readText(ref));
}

function isSafeProjectRelativePath(value) {
  return typeof value === "string"
    && value.length > 0
    && !path.isAbsolute(value)
    && !/^[A-Za-z]:[\\/]/.test(value)
    && !value.includes("\\")
    && !value.includes("..")
    && !value.includes("*")
    && !value.includes("?");
}

const authorization = readJson(packageRef);
const registryText = readText(registryRef);
const categoryText = readText(categoryRef);
const reviewDocText = readText(reviewDocRef);
const reviewRecord = readJson(reviewRecordRef);
const approvalRecord = readJson(approvalRecordRef);
const boundaryText = readText(memoryBoundaryRef);
const gateText = readText(memoryGateRef);
const reviewBridge = readJson(reviewBridgeRef).controlled_visual_production_loop_review_bridge_snapshot;
const checks = [];

function check(name, passed, details) {
  checks.push({ check: name, passed: Boolean(passed), ...(details ? { details } : {}) });
}

check("report_version_v1", authorization.report_version === 1);
check("phase", authorization.phase === "controlled_visual_production_loop_memory_write_A5_authorization_draft");
check("authorization_id", authorization.authorization_id === expectedAuthorizationId);
check("authorization_inactive", authorization.authorization_state === "draft_not_active");
check("activation_requires_future_user_authorization", authorization.activation_requires_future_user_authorization === true);
check("output_report_path", authorization.output_report_path === packageRef);
check("reviewer_jenn", authorization.reviewer === "Jenn");
check("source_sample_id", authorization.source_sample_id === expectedSampleId);
check("source_failure_sample_id", authorization.source_failure_sample_id === expectedFailureId);
check("source_category", authorization.source_category === "product_still_life");

check("target_systems_exact", Array.isArray(authorization.target_systems)
  && authorization.target_systems.length === 2
  && authorization.target_systems[0] === "DailyNote"
  && authorization.target_systems[1] === "VCP_memory");

check("registry_contains_sample", registryText.includes(`sample_id: ${expectedSampleId}`));
check("registry_memory_suitability_false", registryText.includes("memory_suitability: false"));
check("category_contains_sample", categoryText.includes(`- ${expectedSampleId}`));
check("review_doc_memory_suitability_false", reviewDocText.includes("| memory_suitability | false |"));
check("review_record_sample", reviewRecord.sample_id === expectedSampleId);
check("review_record_memory_suitability_false", reviewRecord.review_summary?.memory_suitability === false);
check("approval_record_sample", approvalRecord.sample_id === expectedSampleId);
check("approval_record_memory_write_false", approvalRecord.approval_state?.memory_write_authorized === false);
check("approval_record_dailynote_false", approvalRecord.approval_state?.DailyNote_write_authorized === false);
check("memory_boundary_requires_independent_a5", boundaryText.includes("memory write 需要独立 A5 授权"));
check("memory_gate_inactive", gateText.includes("status: inactive_gate"));
check("memory_gate_dailynote_false", gateText.includes("daily_note_write_authorized: false"));
check("memory_gate_vcp_false", gateText.includes("memory_write_authorized: false"));
check("review_bridge_sample", reviewBridge.accepted_sample_id === expectedSampleId && reviewBridge.failure_sample_id === expectedFailureId);
check("review_bridge_failure_never_production", reviewBridge.bridge_rows?.[1]?.sample_id === expectedFailureId && reviewBridge.bridge_rows?.[1]?.never_production === true);

const allowedReadRefs = authorization.exact_allowed_read_refs || [];
const futureExternalOps = authorization.exact_future_external_operations || [];

check("allowed_read_ref_count", allowedReadRefs.length === 8, String(allowedReadRefs.length));
check("future_external_operation_count", futureExternalOps.length === 2, String(futureExternalOps.length));

for (const ref of allowedReadRefs) {
  check(`allowed_read_ref_safe_${ref}`, isSafeProjectRelativePath(ref));
  check(`allowed_read_ref_exists_${ref}`, fs.existsSync(path.join(root, ref)));
}

check("future_external_daily_note_exact", futureExternalOps.includes("write_one_DailyNote_entry_in_Chinese_only"));
check("future_external_vcp_memory_exact", futureExternalOps.includes("write_one_VCP_memory_summary_only_after_DailyNote_success"));

const allowed = authorization.allowed_operations_after_activation || {};
check("read_exact_metadata_refs_only", allowed.read_exact_metadata_refs_only === true);
check("write_one_DailyNote_entry_in_Chinese_only", allowed.write_one_DailyNote_entry_in_Chinese_only === true);
check("write_one_VCP_memory_entry_only_after_DailyNote_success", allowed.write_one_VCP_memory_entry_only_after_DailyNote_success === true);
check("use_memory_delta_only_payload_no_binary_or_secret_content", allowed.use_memory_delta_only_payload_no_binary_or_secret_content === true);
check("no_local_project_write", allowed.create_or_update_local_project_files === false);
check("update_existing_external_records_blocked", allowed.update_existing_external_records_allowed === false);

const futureMemoryDelta = authorization.future_memory_delta_requirements || {};
check("source_memory_delta_ref_null", futureMemoryDelta.source_memory_delta_draft_ref === null);
check("future_memory_delta_required", futureMemoryDelta.future_memory_delta_draft_required_before_execution === true);
check("future_memory_delta_chinese_only", futureMemoryDelta.chinese_only === true);
check("future_memory_delta_preserved_original_blocked", futureMemoryDelta.preserved_original_allowed === false);
check("future_memory_delta_direct_daily_note_blocked", futureMemoryDelta.direct_daily_note_write_allowed === false);

const required = authorization.required_preconditions || {};
for (const field of [
  "accepted_sample_registry_entry_present",
  "category_index_entry_present",
  "accepted_capsule_review_record_present",
  "accepted_capsule_approval_record_present",
  "memory_boundary_spec_present",
  "memory_gate_package_present",
  "review_bridge_route_present",
  "source_memory_suitability_false_confirmed",
  "source_memory_write_authorized_false_confirmed"
]) {
  check(`required_${field}`, required[field] === true);
}
check("required_human_override_missing", required.human_override_for_memory_suitability_false_present === false);
check("required_explicit_memory_write_authorization_missing", required.explicit_memory_write_authorization_present === false);
check("required_source_memory_delta_missing", required.source_memory_delta_draft_present === false);

check("current_blocker_count", Array.isArray(authorization.current_blockers) && authorization.current_blockers.length === 5, String(authorization.current_blockers?.length));
for (const blocker of [
  "source_memory_suitability_false",
  "memory_write_authorized_false_in_approval_record",
  "DailyNote_write_authorized_false",
  "human_override_missing",
  "source_memory_delta_draft_missing"
]) {
  check(`current_blocker_${blocker}`, authorization.current_blockers?.includes(blocker) === true);
}

const forbidden = authorization.forbidden_operations || {};
for (const field of [
  "image_binary_read",
  "image_binary_copy",
  "runs_source_modification",
  "accepted_samples_write",
  "failure_samples_write",
  "production_candidate_write",
  "durable_archive_write",
  "local_project_file_write",
  "provider_contact",
  "plugin_call",
  "api_call",
  "runtime_execution",
  "real_manifest_VCPChat_VCPToolBox_read",
  "push_tag_release_deploy",
  "dependency_change"
]) {
  check(`forbidden_${field}`, forbidden[field] === true);
}

const payload = authorization.payload_constraints || {};
check("payload_chinese_daily_note_required", payload.chinese_daily_note_required === true);
check("payload_memory_delta_only_until_override", payload.memory_delta_draft_only_until_human_override === true);
check("payload_no_image_binary", payload.image_binary_included === false);
check("payload_no_secret_or_private_path", payload.raw_secret_or_private_path_allowed === false);
check("payload_no_raw_prompt_response", payload.raw_prompt_or_response_payload_allowed === false);
check("payload_no_customer_private_data", payload.customer_private_data_allowed === false);

check("rollback_mode", authorization.rollback_plan?.mode === "revoke_exact_memory_write_request_only_if_future_execution_fails");
check("rollback_no_local_cleanup", authorization.rollback_plan?.local_project_cleanup_allowed === false);
check("rollback_no_unlisted_delete", authorization.rollback_plan?.delete_any_unlisted_path_allowed === false);
check("rollback_external_revoke_required", authorization.rollback_plan?.external_revoke_required_after_future_write === true);

const stopConditions = authorization.stop_conditions || [];
check("stop_condition_count", stopConditions.length >= 8, String(stopConditions.length));
check("approval_phrase_present", typeof authorization.exact_future_approval_phrase === "string" && authorization.exact_future_approval_phrase.includes(expectedAuthorizationId));

for (const field of [
  "DailyNote_write_performed",
  "VCP_memory_write_performed",
  "direct_memory_write_performed",
  "image_binary_read_performed",
  "image_binary_copy_performed",
  "runs_source_modification_performed",
  "accepted_samples_write_performed",
  "failure_samples_write_performed",
  "production_candidate_write_performed",
  "durable_archive_write_performed",
  "local_project_file_write_performed",
  "provider_contact_performed",
  "plugin_call_performed",
  "api_call_performed",
  "runtime_execution_performed",
  "real_manifest_read_performed",
  "real_vcpchat_read_performed",
  "real_vcptoolbox_read_performed",
  "push_tag_release_deploy_performed",
  "dependency_change_performed"
]) {
  check(`execution_${field}_false`, authorization.execution_performed?.[field] === false);
}

const failures = checks.filter((item) => !item.passed);
const result = {
  validator: "validate_controlled_visual_production_loop_memory_write_authorization",
  version: "v1",
  passed: failures.length === 0,
  status: failures.length === 0
    ? "controlled_visual_production_loop_memory_write_authorization_verified"
    : "controlled_visual_production_loop_memory_write_authorization_failed",
  authorization_ref: packageRef,
  authorization_id: authorization.authorization_id,
  authorization_state: authorization.authorization_state,
  source_sample_id: authorization.source_sample_id,
  source_failure_sample_id: authorization.source_failure_sample_id,
  read_ref_count: allowedReadRefs.length,
  external_operation_count: futureExternalOps.length,
  current_blocker_count: authorization.current_blockers?.length ?? 0,
  human_override_present: required.human_override_for_memory_suitability_false_present === true,
  memory_write_execution_allowed_now: false,
  DailyNote_write_performed: authorization.execution_performed?.DailyNote_write_performed,
  VCP_memory_write_performed: authorization.execution_performed?.VCP_memory_write_performed,
  direct_memory_write_performed: authorization.execution_performed?.direct_memory_write_performed,
  image_generation_performed: false,
  provider_contact_performed: authorization.execution_performed?.provider_contact_performed,
  plugin_call_performed: authorization.execution_performed?.plugin_call_performed,
  api_call_performed: authorization.execution_performed?.api_call_performed,
  runtime_execution_performed: authorization.execution_performed?.runtime_execution_performed,
  real_manifest_read_performed: authorization.execution_performed?.real_manifest_read_performed,
  real_vcpchat_read_performed: authorization.execution_performed?.real_vcpchat_read_performed,
  real_vcptoolbox_read_performed: authorization.execution_performed?.real_vcptoolbox_read_performed,
  push_tag_release_deploy_performed: authorization.execution_performed?.push_tag_release_deploy_performed,
  dependency_change_performed: authorization.execution_performed?.dependency_change_performed,
  check_count: checks.length,
  failed_count: failures.length,
  failures
};

console.log(JSON.stringify(result, null, 2));
process.exit(result.passed ? 0 : 1);
