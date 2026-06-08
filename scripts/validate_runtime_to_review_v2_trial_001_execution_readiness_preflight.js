#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const preflightRef = "reports/runtime_to_review_v2/r2r_v2_trial_001_serum_detail_control_execution_readiness_preflight_20260608.json";
const packetRef = "reports/runtime_to_review_v2/r2r_v2_trial_001_serum_detail_control_activation_packet_no_execute_20260608.json";
const planRef = "docs/runtime_to_review_v2_multi_prompt_controlled_trial_plan.md";
const promptRef = "prompts/image_generation/product_detail_premium_serum_bottle_v2.yaml";
const sourcePromptRef = "prompts/image_generation/product_lifestyle_premium_serum_bottle_v1.yaml";

function repoPath(ref) {
  const resolved = path.resolve(repoRoot, ref);
  const relative = path.relative(repoRoot, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`path escapes repo root: ${ref}`);
  }
  return resolved;
}

function readJson(ref) {
  return JSON.parse(fs.readFileSync(repoPath(ref), "utf8"));
}

function readText(ref) {
  return fs.readFileSync(repoPath(ref), "utf8");
}

function isRepoRelative(ref) {
  return typeof ref === "string" &&
    ref.trim() !== "" &&
    !path.isAbsolute(ref) &&
    !ref.split(/[\\/]/).includes("..");
}

function allFlagsFalse(flags) {
  return flags && Object.values(flags).every((value) => value === false);
}

const preflight = readJson(preflightRef);
const packet = readJson(packetRef);
const plan = readText(planRef);
const prompt = readText(promptRef);
const results = [];

function check(name, predicate) {
  let passed = false;
  let detail = null;
  try {
    passed = Boolean(predicate());
  } catch (error) {
    detail = error.message;
  }
  results.push(detail ? { check: name, passed, detail } : { check: name, passed });
}

check("preflight_schema_and_status", () =>
  preflight.schema === "runtime_to_review_v2_trial_execution_readiness_preflight.v1" &&
  preflight.status === "passed_preflight_no_execute" &&
  preflight.trial_id === "r2r_v2_trial_001_serum_detail_control"
);
check("source_refs_exist_and_align", () =>
  preflight.source_refs.plan_ref === planRef &&
  preflight.source_refs.no_execute_packet_ref === packetRef &&
  preflight.source_refs.prompt_package_ref === promptRef &&
  preflight.source_refs.source_attempt_018_prompt_ref === sourcePromptRef &&
  fs.existsSync(repoPath(planRef)) &&
  fs.existsSync(repoPath(packetRef)) &&
  fs.existsSync(repoPath(promptRef)) &&
  fs.existsSync(repoPath(sourcePromptRef))
);
check("plan_mentions_trial_and_no_execute", () =>
  plan.includes("r2r_v2_trial_001_serum_detail_control") &&
  plan.includes("This plan does not execute any trial.")
);
check("current_packet_remains_no_execute", () =>
  packet.status === "prepared_no_execute" &&
  packet.can_execute_now === false &&
  preflight.readiness_result.ready_to_execute_from_current_packet === false &&
  preflight.readiness_result.ready_to_create_future_execution_packet === true
);
check("packet_state_matches_preflight", () =>
  preflight.packet_state_checked.packet_status === packet.status &&
  preflight.packet_state_checked.can_execute_now === packet.can_execute_now &&
  preflight.packet_state_checked.prompt_package_ref_matches_trial_001_v2 === true &&
  packet.visual_job_contract.prompt_package_ref === promptRef &&
  packet.visual_job_contract.source_prompt_package_ref === sourcePromptRef &&
  packet.trial.shot_role === "product_detail_controlled_studio" &&
  preflight.packet_state_checked.review_required_before_archive === packet.review_policy.human_review_required_before_archive &&
  preflight.packet_state_checked.accepted_samples_write_allowed_by_current_packet === packet.review_policy.accepted_samples_write_allowed_by_this_packet &&
  preflight.packet_state_checked.production_candidate_write_allowed_by_current_packet === packet.review_policy.production_candidate_write_allowed_by_this_packet &&
  preflight.packet_state_checked.memory_write_default === packet.review_policy.memory_write_default
);
check("prompt_encodes_detail_control_and_blank_label_only", () =>
  prompt.includes("prompt_package_id: product_detail_premium_serum_bottle_v2") &&
  prompt.includes("shot_role: product_detail_controlled_studio") &&
  prompt.includes("product fidelity inspection shot") &&
  prompt.includes("not a broad ecommerce hero scene") &&
  prompt.includes("intentionally blank label") &&
  prompt.includes("label_panel_intentionally_blank_and_non_readable") &&
  !prompt.includes("brandable") &&
  preflight.prompt_state_checked.label_choice === "intentionally_blank_label_only" &&
  preflight.prompt_state_checked.blank_label_required === true &&
  preflight.prompt_state_checked.readable_text_or_logo_allowed === false &&
  preflight.prompt_state_checked.decorative_label_mark_allowed === false &&
  preflight.prompt_state_checked.brandable_wording_allowed === false
);
check("visual_constraints_match_packet", () =>
  packet.visual_job_contract.constraints.blank_label_required === true &&
  packet.visual_job_contract.constraints.readable_text_or_logo_allowed === false &&
  packet.visual_job_contract.constraints.decorative_label_mark_allowed === false &&
  packet.visual_job_contract.constraints.secret_value_read_allowed === false &&
  packet.visual_job_contract.constraints.max_images === 1 &&
  packet.visual_job_contract.constraints.retry_allowed === false
);
check("budget_one_each_no_retry", () =>
  packet.budget.max_provider_calls === 1 &&
  packet.budget.max_plugin_calls === 1 &&
  packet.budget.max_api_calls === 1 &&
  packet.budget.max_images === 1 &&
  packet.budget.retry_allowed === false &&
  preflight.future_execution_budget_ceiling.max_route_http_requests === 1 &&
  preflight.future_execution_budget_ceiling.max_provider_calls === packet.budget.max_provider_calls &&
  preflight.future_execution_budget_ceiling.max_plugin_calls === packet.budget.max_plugin_calls &&
  preflight.future_execution_budget_ceiling.max_api_calls === packet.budget.max_api_calls &&
  preflight.future_execution_budget_ceiling.max_images === packet.budget.max_images &&
  preflight.future_execution_budget_ceiling.retry_allowed === false
);
check("output_refs_are_repo_relative", () =>
  isRepoRelative(packet.output_policy.output_directory_ref) &&
  isRepoRelative(packet.output_policy.expected_receipt_ref) &&
  isRepoRelative(packet.output_policy.expected_artifact_record_ref) &&
  isRepoRelative(packet.output_policy.expected_review_bridge_ref) &&
  isRepoRelative(preflight.output_collision_check.output_directory_ref) &&
  isRepoRelative(preflight.output_collision_check.expected_receipt_ref) &&
  isRepoRelative(preflight.output_collision_check.expected_artifact_record_ref) &&
  isRepoRelative(preflight.output_collision_check.expected_review_bridge_ref)
);
check("output_collision_state_is_currently_clear", () =>
  preflight.output_collision_check.output_directory_ref === packet.output_policy.output_directory_ref &&
  preflight.output_collision_check.output_directory_exists_at_preflight === false &&
  !fs.existsSync(repoPath(packet.output_policy.output_directory_ref)) &&
  preflight.output_collision_check.expected_receipt_ref === packet.output_policy.expected_receipt_ref &&
  preflight.output_collision_check.expected_receipt_exists_at_preflight === false &&
  !fs.existsSync(repoPath(packet.output_policy.expected_receipt_ref)) &&
  preflight.output_collision_check.expected_artifact_record_ref === packet.output_policy.expected_artifact_record_ref &&
  preflight.output_collision_check.expected_artifact_record_exists_at_preflight === false &&
  !fs.existsSync(repoPath(packet.output_policy.expected_artifact_record_ref)) &&
  preflight.output_collision_check.expected_review_bridge_ref === packet.output_policy.expected_review_bridge_ref &&
  preflight.output_collision_check.expected_review_bridge_exists_at_preflight === false &&
  !fs.existsSync(repoPath(packet.output_policy.expected_review_bridge_ref)) &&
  preflight.output_collision_check.overwrite_existing_files_allowed === false &&
  packet.output_policy.overwrite_existing_files_allowed === false
);
check("future_execution_packet_requirements_are_guarded", () => {
  const req = preflight.future_execution_packet_requirements;
  return req.must_be_separate_file === true &&
    req.must_reference_this_preflight === true &&
    req.must_reference_no_execute_packet === true &&
    req.must_keep_can_execute_now_false_until_exact_v2_runtime_binding_exists === true &&
    req.must_flip_can_execute_now_true_only_in_a_new_binding_ready_execution_packet === true &&
    req.must_keep_budget_one_provider_one_plugin_one_api_one_image === true &&
    req.must_keep_retry_allowed_false === true &&
    req.must_recheck_output_directory_absent_immediately_before_dispatch === true &&
    req.must_use_secretless_activation === true &&
    req.must_use_binding_source_not_payload_plugin_field === true &&
    req.must_write_receipt_and_artifact_record_after_dispatch === true &&
    req.must_route_output_to_generated_unreviewed_review_queue === true &&
    req.must_not_write_accepted_samples_production_or_memory_before_human_review === true;
});
check("review_focus_is_detail_and_blank_label", () =>
  preflight.review_focus_after_generation.includes("intentionally_blank_label_boundary") &&
  preflight.review_focus_after_generation.includes("cap_and_bottle_geometry") &&
  preflight.review_focus_after_generation.includes("material_reflection_control") &&
  preflight.review_focus_after_generation.includes("no_readable_text_logo_or_decorative_mark") &&
  preflight.review_focus_after_generation.includes("full_bottle_visible_from_pipette_to_base") &&
  preflight.review_focus_after_generation.includes("no_cropped_bottle_bottom") &&
  packet.review_policy.review_focus.includes("intentionally_blank_label_boundary") &&
  packet.review_policy.review_focus.includes("no_readable_text_logo_or_decorative_mark")
);
check("stop_conditions_cover_collision_budget_secret_and_writes", () =>
  preflight.stop_conditions.includes("prompt_package_ref_changed") &&
  preflight.stop_conditions.includes("prompt_contains_brandable_or_brand_label_generation_request") &&
  preflight.stop_conditions.includes("no_execute_packet_can_execute_now_is_true") &&
  preflight.stop_conditions.includes("future_execution_packet_missing") &&
  preflight.stop_conditions.includes("output_directory_exists") &&
  preflight.stop_conditions.includes("expected_receipt_or_artifact_record_or_review_bridge_already_exists") &&
  preflight.stop_conditions.includes("budget_not_exactly_one_provider_one_plugin_one_api_one_image") &&
  preflight.stop_conditions.includes("retry_requested") &&
  preflight.stop_conditions.includes("secret_value_read_required") &&
  preflight.stop_conditions.includes("accepted_samples_or_production_or_memory_write_requested_before_review") &&
  preflight.stop_conditions.includes("push_tag_release_deploy_requested")
);
check("side_effect_flags_false", () =>
  allFlagsFalse(packet.side_effect_flags) &&
  allFlagsFalse(preflight.side_effect_flags)
);
check("validation_declares_self_and_core_gates", () =>
  preflight.validation_required.includes("node scripts/validate_runtime_to_review_v2_multi_prompt_controlled_trial_plan.js") &&
  preflight.validation_required.includes("node scripts/validate_prompt_schema.js --type prompt_package prompts/image_generation/product_detail_premium_serum_bottle_v2.yaml") &&
  preflight.validation_required.includes("node scripts/validate_runtime_to_review_v2_trial_001_activation_packet_no_execute.js") &&
  preflight.validation_required.includes("node scripts/validate_runtime_to_review_v2_trial_001_execution_readiness_preflight.js") &&
  preflight.validation_required.includes("node scripts/validate_agent_board_state.js") &&
  preflight.validation_required.includes("git diff --check")
);
check("recommended_next_is_future_execution_packet_not_execution", () =>
  preflight.recommended_next === "create_separate_future_execution_packet_for_trial_001_only_if_ready_to_run_one_provider_one_image" &&
  packet.recommended_next === "review_this_packet_then_create_a_separate_future_execution_packet_only_if_trial_001_should_run"
);

const failed = results.filter((result) => !result.passed);
const output = {
  passed: failed.length === 0,
  validator: "runtime_to_review_v2_trial_001_execution_readiness_preflight",
  preflight_ref: preflightRef,
  packet_ref: packetRef,
  check_count: results.length,
  failed_count: failed.length,
  route_http_request_performed: false,
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  image_generation_performed: false,
  file_write_performed: false,
  results,
};

console.log(JSON.stringify(output, null, 2));
if (failed.length > 0) process.exit(1);
