#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const packageRef = "reports/production_candidate_authorization/2026-05-20_tennis_wallet_production_candidate_A5_authorization_package.json";
const registryRef = "accepted_samples/accepted_sample_registry.yaml";
const categoryRef = "accepted_samples/categories/product_still_life.yaml";
const reviewBridgeRef = "tests/schema_examples/CONTROLLED_VISUAL_PRODUCTION_LOOP_REVIEW_BRIDGE_STATE.example.json";
const expectedSampleId = "accepted_product_still_life_tennis_wallet_001";
const expectedFailureId = "failure_tennis_wallet_v7_21_001";
const expectedAuthorizationId = "AUTH-PENDING-TENNIS-WALLET-PRODUCTION-CANDIDATE-20260520-001";

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
const reviewBridge = readJson(reviewBridgeRef).controlled_visual_production_loop_review_bridge_snapshot;
const registryText = readText(registryRef);
const categoryText = readText(categoryRef);
const checks = [];

function check(name, passed, details) {
  checks.push({ check: name, passed: Boolean(passed), ...(details ? { details } : {}) });
}

check("report_version_v1", authorization.report_version === 1);
check("phase", authorization.phase === "controlled_visual_production_loop_production_candidate_A5_authorization_draft");
check("authorization_id", authorization.authorization_id === expectedAuthorizationId);
check("authorization_inactive", authorization.authorization_state === "draft_not_active");
check("activation_requires_future_user_authorization", authorization.activation_requires_future_user_authorization === true);
check("output_report_path", authorization.output_report_path === packageRef);
check("reviewer_jenn", authorization.reviewer === "Jenn");
check("source_sample_id", authorization.source_sample_id === expectedSampleId);
check("source_failure_sample_id", authorization.source_failure_sample_id === expectedFailureId);
check("source_category", authorization.source_category === "product_still_life");
check("expected_production_candidate_id", authorization.expected_new_production_candidate_id === "accepted_product_still_life_tennis_wallet_001_production_candidate_001");

check("registry_contains_sample", registryText.includes(`sample_id: ${expectedSampleId}`));
check("category_contains_sample", categoryText.includes(`- ${expectedSampleId}`));
check("review_bridge_sample", reviewBridge.accepted_sample_id === expectedSampleId && reviewBridge.failure_sample_id === expectedFailureId);
check("review_bridge_pass_lane_blocked_now", reviewBridge.bridge_rows?.[0]?.sample_id === expectedSampleId && reviewBridge.bridge_rows?.[0]?.production_promotion_allowed_now === false);
check("review_bridge_failure_never_production", reviewBridge.bridge_rows?.[1]?.sample_id === expectedFailureId && reviewBridge.bridge_rows?.[1]?.never_production === true);

const allowedReadRefs = authorization.exact_allowed_read_refs || [];
const allowedWritePaths = authorization.exact_allowed_write_paths || [];
const productionCandidateTargetsPresent = allowedWritePaths.every((ref) => fs.existsSync(path.join(root, ref)));

check("allowed_read_ref_count", allowedReadRefs.length === 8, String(allowedReadRefs.length));
check("allowed_write_path_count", allowedWritePaths.length === 2, String(allowedWritePaths.length));

for (const ref of allowedReadRefs) {
  check(`allowed_read_ref_safe_${ref}`, isSafeProjectRelativePath(ref));
  check(`allowed_read_ref_exists_${ref}`, fs.existsSync(path.join(root, ref)));
}

for (const ref of allowedWritePaths) {
  check(`allowed_write_path_safe_${ref}`, isSafeProjectRelativePath(ref) && ref.startsWith("production/"));
  check(`allowed_write_path_created_${ref}`, fs.existsSync(path.join(root, ref)));
}

check("allowed_plan_target_exact", allowedWritePaths.includes("production/plans/accepted_product_still_life_tennis_wallet_001_production_candidate_001_plan.yaml"));
check("allowed_review_target_exact", allowedWritePaths.includes("production/reviews/accepted_product_still_life_tennis_wallet_001_production_candidate_001_review.md"));

const allowed = authorization.allowed_operations_after_activation || {};
check("read_exact_metadata_refs_only", allowed.read_exact_metadata_refs_only === true);
check("write_exact_plan_yaml_only", allowed.write_exact_plan_yaml_only === true);
check("write_exact_review_markdown_only", allowed.write_exact_review_markdown_only === true);
check("create_parent_directories_for_exact_targets_only", allowed.create_parent_directories_for_exact_targets_only === true);
check("update_existing_targets_blocked", allowed.update_existing_targets_allowed === false);

const required = authorization.required_preconditions || {};
for (const field of [
  "accepted_sample_registry_entry_present",
  "category_index_entry_present",
  "accepted_capsule_review_record_present",
  "accepted_capsule_approval_record_present",
  "durable_archive_baseline_verified",
  "review_bridge_pass_lane_verified",
  "failure_lane_never_production_verified",
  "existing_target_files_absent",
  "memory_write_not_part_of_scope",
]) {
  check(`required_${field}`, required[field] === true);
}

const forbidden = authorization.forbidden_operations || {};
for (const field of [
  "image_binary_read",
  "image_binary_copy",
  "runs_source_modification",
  "accepted_samples_write",
  "failure_samples_write",
  "durable_archive_write",
  "DailyNote_write",
  "VCP_memory_write",
  "provider_contact",
  "plugin_call",
  "api_call",
  "runtime_execution",
  "real_manifest_VCPChat_VCPToolBox_read",
  "push_tag_release_deploy",
  "dependency_change",
  "overwrite_existing_targets",
]) {
  check(`forbidden_${field}`, forbidden[field] === true);
}

check("rollback_exact_targets_only", authorization.rollback_plan?.allowed_cleanup_scope_ref === "exact_allowed_write_paths[]");
check("rollback_no_source_cleanup", authorization.rollback_plan?.source_cleanup_allowed === false && authorization.rollback_plan?.runs_cleanup_allowed === false);
check("rollback_no_unlisted_delete", authorization.rollback_plan?.delete_any_unlisted_path_allowed === false);

const stopConditions = authorization.stop_conditions || [];
check("stop_condition_count", stopConditions.length >= 8, String(stopConditions.length));
check("approval_phrase_present", typeof authorization.exact_future_approval_phrase === "string" && authorization.exact_future_approval_phrase.includes(expectedAuthorizationId));

for (const field of [
  "production_candidate_write_performed",
  "plan_yaml_created",
  "review_markdown_created",
  "image_binary_read_performed",
  "image_binary_copy_performed",
  "runs_source_modification_performed",
  "accepted_samples_write_performed",
  "failure_samples_write_performed",
  "durable_archive_write_performed",
  "DailyNote_write_performed",
  "VCP_memory_write_performed",
  "provider_contact_performed",
  "plugin_call_performed",
  "api_call_performed",
  "runtime_execution_performed",
  "real_manifest_read_performed",
  "real_vcpchat_read_performed",
  "real_vcptoolbox_read_performed",
  "push_tag_release_deploy_performed",
  "dependency_change_performed",
]) {
  check(`execution_${field}_false`, authorization.execution_performed?.[field] === false);
}

const failures = checks.filter((item) => !item.passed);
const result = {
  validator: "validate_controlled_visual_production_loop_production_candidate_authorization",
  version: "v1",
  passed: failures.length === 0,
  status: failures.length === 0
    ? "controlled_visual_production_loop_production_candidate_authorization_verified"
    : "controlled_visual_production_loop_production_candidate_authorization_failed",
  authorization_ref: packageRef,
  authorization_id: authorization.authorization_id,
  authorization_state: authorization.authorization_state,
  source_sample_id: authorization.source_sample_id,
  source_failure_sample_id: authorization.source_failure_sample_id,
  write_path_count: allowedWritePaths.length,
  production_candidate_target_count: allowedWritePaths.filter((ref) => fs.existsSync(path.join(root, ref))).length,
  production_candidate_targets_present: productionCandidateTargetsPresent,
  execution_allowed_now: false,
  production_candidate_write_performed: productionCandidateTargetsPresent,
  image_binary_read_performed: authorization.execution_performed?.image_binary_read_performed,
  image_generation_performed: false,
  DailyNote_write_performed: authorization.execution_performed?.DailyNote_write_performed,
  VCP_memory_write_performed: authorization.execution_performed?.VCP_memory_write_performed,
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
