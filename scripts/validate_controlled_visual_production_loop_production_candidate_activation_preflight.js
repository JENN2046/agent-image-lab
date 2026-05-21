#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const files = {
  preflight: "reports/production_candidate_authorization/2026-05-21_tennis_wallet_production_candidate_A5_activation_preflight.json",
  phaseRecord: "docs/CONTROLLED_VISUAL_PRODUCTION_LOOP_PRODUCTION_CANDIDATE_ACTIVATION_PREFLIGHT.md",
  authorization: "reports/production_candidate_authorization/2026-05-20_tennis_wallet_production_candidate_A5_authorization_package.json",
  reviewBridge: "tests/schema_examples/CONTROLLED_VISUAL_PRODUCTION_LOOP_REVIEW_BRIDGE_STATE.example.json",
  fullArchiveManifest: "tests/schema_examples/full_asset_archive_manifest.example.json",
  mvpWiring: "scripts/validate_mvp_capsule_product_core.ps1",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
  roadmap: "docs/00_project_roadmap.md"
};

const expected = {
  phase: "controlled_visual_production_loop_production_candidate_activation_preflight",
  preflightId: "PREFLIGHT-TENNIS-WALLET-PRODUCTION-CANDIDATE-20260521-001",
  authorizationId: "AUTH-PENDING-TENNIS-WALLET-PRODUCTION-CANDIDATE-20260520-001",
  sampleId: "accepted_product_still_life_tennis_wallet_001",
  failureId: "failure_tennis_wallet_v7_21_001",
  candidateId: "accepted_product_still_life_tennis_wallet_001_production_candidate_001",
  next: "explicit_local_commit_instruction_for_19_file_post_activation_slice"
};

function readText(ref) {
  return fs.readFileSync(path.join(root, ref), "utf8");
}

function readJson(ref) {
  return JSON.parse(readText(ref));
}

function exists(ref) {
  return fs.existsSync(path.join(root, ref));
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

const results = [];
const failures = [];
function add(check, passed, detail = null) {
  results.push({ check, passed: Boolean(passed), ...(detail === null ? {} : { detail }) });
  if (!passed) failures.push({ check, ...(detail === null ? {} : { detail }) });
}

const preflight = readJson(files.preflight);
const authorization = readJson(files.authorization);
const reviewBridge = readJson(files.reviewBridge).controlled_visual_production_loop_review_bridge_snapshot;
const fullArchiveManifest = readJson(files.fullArchiveManifest);
const phaseRecord = readText(files.phaseRecord);
const mvpWiring = readText(files.mvpWiring);
const runState = readText(files.runState);
const taskQueue = readText(files.taskQueue);
const checkpoint = readText(files.checkpoint);
const handoff = readText(files.handoff);
const roadmap = readText(files.roadmap);

add("phase_record_exists", exists(files.phaseRecord));
add("report_version", preflight.report_version === 1);
add("phase", preflight.phase === expected.phase);
add("preflight_id", preflight.preflight_id === expected.preflightId);
add("authorization_id", preflight.authorization_id === expected.authorizationId);
add("authorization_package_ref", preflight.authorization_package_ref === files.authorization);
add("preflight_state", preflight.preflight_state === "ready_for_explicit_activation");
add("activation_state_after_preflight", preflight.activation_state_after_preflight === "activated_metadata_written");
add("reviewer", preflight.reviewer === "Jenn");
add("source_sample_id", preflight.source_sample_id === expected.sampleId);
add("source_failure_sample_id", preflight.source_failure_sample_id === expected.failureId);
add("expected_candidate_id", preflight.expected_new_production_candidate_id === expected.candidateId);

add("decision_ready_for_explicit_A5_activation", preflight.activation_decision?.ready_for_explicit_A5_activation === true);
add("decision_execution_not_authorized", preflight.activation_decision?.execution_authorized_by_this_preflight === false);
add("decision_write_not_allowed_now", preflight.activation_decision?.production_candidate_write_allowed_now === false);
add("decision_requires_future_phrase", preflight.activation_decision?.requires_exact_future_approval_phrase === true);

add("source_authorization_inactive", authorization.authorization_state === preflight.source_package_requirements?.authorization_state_required);
add("source_authorization_future_auth_required", authorization.activation_requires_future_user_authorization === true);
add("source_authorization_update_existing_blocked", authorization.allowed_operations_after_activation?.update_existing_targets_allowed === false);
add("source_read_ref_count", authorization.exact_allowed_read_refs?.length === preflight.source_package_requirements?.exact_read_ref_count_required);
add("source_write_path_count", authorization.exact_allowed_write_paths?.length === preflight.source_package_requirements?.exact_write_path_count_required);
add("preflight_read_refs_match_source", JSON.stringify(preflight.exact_allowed_read_refs) === JSON.stringify(authorization.exact_allowed_read_refs));
add("preflight_write_paths_match_source", JSON.stringify(preflight.exact_allowed_future_write_paths) === JSON.stringify(authorization.exact_allowed_write_paths));

for (const ref of preflight.exact_allowed_read_refs || []) {
  add(`read_ref_safe_${ref}`, isSafeProjectRelativePath(ref));
  add(`read_ref_exists_${ref}`, exists(ref));
}

for (const ref of preflight.exact_allowed_future_write_paths || []) {
  add(`write_path_safe_${ref}`, isSafeProjectRelativePath(ref) && ref.startsWith("production/"));
  add(`write_target_created_${ref}`, exists(ref));
}

add("review_bridge_route_matches", reviewBridge.accepted_sample_id === expected.sampleId && reviewBridge.failure_sample_id === expected.failureId);
add("review_bridge_pass_lane_blocked_now", reviewBridge.bridge_rows?.[0]?.sample_id === expected.sampleId && reviewBridge.bridge_rows?.[0]?.production_promotion_allowed_now === false);
add("review_bridge_failure_never_production", reviewBridge.bridge_rows?.[1]?.sample_id === expected.failureId && reviewBridge.bridge_rows?.[1]?.never_production === true);
add("full_archive_verified", fullArchiveManifest.original_asset?.verification_status === "verified_durable_archive_git_tracked");

for (const [field, value] of Object.entries(preflight.preflight_checks || {})) {
  add(`preflight_check_${field}`, value === true);
}

add("approval_phrase_ref", preflight.activation_phrase_ref === "authorization_package.exact_future_approval_phrase");
add(
  "approval_phrase_prefix_matches_source",
  typeof authorization.exact_future_approval_phrase === "string"
    && authorization.exact_future_approval_phrase.startsWith(preflight.required_future_activation_phrase_prefix)
);
add("post_activation_validation_includes_preflight", preflight.post_activation_required_validation?.includes("node scripts/validate_controlled_visual_production_loop_production_candidate_activation_preflight.js"));
add("hard_stop_count", (preflight.hard_stop_before_future_activation || []).length >= 6, String((preflight.hard_stop_before_future_activation || []).length));

for (const field of [
  "A5_activation_performed",
  "production_candidate_write_performed",
  "plan_yaml_created",
  "review_markdown_created"
]) {
  add(`execution_${field}_true`, preflight.execution_performed?.[field] === true);
}

for (const [field, value] of Object.entries(preflight.execution_performed || {})) {
  if ([
    "A5_activation_performed",
    "production_candidate_write_performed",
    "plan_yaml_created",
    "review_markdown_created"
  ].includes(field)) {
    continue;
  }
  add(`execution_${field}_false`, value === false);
}

for (const token of [
  expected.phase,
  files.preflight,
  files.authorization,
  expected.next
]) {
  add(`phase_record_token_${token}`, phaseRecord.includes(token));
  add(`run_state_token_${token}`, runState.includes(token));
  add(`task_queue_token_${token}`, taskQueue.includes(token));
  add(`checkpoint_token_${token}`, checkpoint.includes(token));
  add(`handoff_token_${token}`, handoff.includes(token));
  add(`roadmap_token_${token}`, roadmap.includes(token));
}

add("mvp_wiring_token", mvpWiring.includes("validate_controlled_visual_production_loop_production_candidate_activation_preflight.js"));

const output = {
  validator: "validate_controlled_visual_production_loop_production_candidate_activation_preflight",
  version: "v1",
  passed: failures.length === 0,
  status: failures.length === 0
    ? "controlled_visual_production_loop_production_candidate_activation_preflight_verified"
    : "controlled_visual_production_loop_production_candidate_activation_preflight_failed",
  preflight_id: preflight.preflight_id,
  authorization_id: preflight.authorization_id,
  preflight_state: preflight.preflight_state,
  activation_state_after_preflight: preflight.activation_state_after_preflight,
  ready_for_explicit_A5_activation: preflight.activation_decision?.ready_for_explicit_A5_activation,
  execution_authorized_by_this_preflight: preflight.activation_decision?.execution_authorized_by_this_preflight,
  production_candidate_write_allowed_now: preflight.activation_decision?.production_candidate_write_allowed_now,
  exact_read_ref_count: (preflight.exact_allowed_read_refs || []).length,
  exact_future_write_path_count: (preflight.exact_allowed_future_write_paths || []).length,
  production_candidate_target_count: (preflight.exact_allowed_future_write_paths || []).filter((ref) => exists(ref)).length,
  production_candidate_targets_present: (preflight.exact_allowed_future_write_paths || []).every((ref) => exists(ref)),
  A5_activation_performed: preflight.execution_performed?.A5_activation_performed,
  production_candidate_write_performed: preflight.execution_performed?.production_candidate_write_performed,
  image_generation_performed: false,
  image_binary_read_performed: preflight.execution_performed?.image_binary_read_performed,
  DailyNote_write_performed: preflight.execution_performed?.DailyNote_write_performed,
  VCP_memory_write_performed: preflight.execution_performed?.VCP_memory_write_performed,
  provider_contact_performed: preflight.execution_performed?.provider_contact_performed,
  plugin_call_performed: preflight.execution_performed?.plugin_call_performed,
  api_call_performed: preflight.execution_performed?.api_call_performed,
  runtime_execution_performed: preflight.execution_performed?.runtime_execution_performed,
  real_manifest_read_performed: preflight.execution_performed?.real_manifest_read_performed,
  real_vcpchat_read_performed: preflight.execution_performed?.real_vcpchat_read_performed,
  real_vcptoolbox_read_performed: preflight.execution_performed?.real_vcptoolbox_read_performed,
  push_tag_release_deploy_performed: preflight.execution_performed?.push_tag_release_deploy_performed,
  dependency_change_performed: preflight.execution_performed?.dependency_change_performed,
  recommended_next: preflight.recommended_next,
  check_count: results.length,
  failed_count: failures.length,
  failures,
  checks: results
};

console.log(JSON.stringify(output, null, 2));
process.exit(output.passed ? 0 : 1);
