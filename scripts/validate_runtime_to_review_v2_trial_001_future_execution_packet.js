#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const packetRef = "reports/runtime_to_review_v2/r2r_v2_trial_001_serum_detail_control_future_execution_packet_20260608.json";
const preflightRef = "reports/runtime_to_review_v2/r2r_v2_trial_001_serum_detail_control_execution_readiness_preflight_20260608.json";
const noExecuteRef = "reports/runtime_to_review_v2/r2r_v2_trial_001_serum_detail_control_activation_packet_no_execute_20260608.json";
const promptRef = "prompts/image_generation/product_detail_premium_serum_bottle_v2.yaml";
const sourcePromptRef = "prompts/image_generation/product_lifestyle_premium_serum_bottle_v1.yaml";
const knownRuntimeRef = "adapters/runtime/native_doubao_runtime_v1_serum_bottle_vcptoolbox_route_owner_runtime.js";

function repoPath(ref) {
  const resolved = path.resolve(repoRoot, ref);
  const relative = path.relative(repoRoot, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`path escapes repository root: ${ref}`);
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

function allFalse(flags) {
  return flags && Object.values(flags).every((value) => value === false);
}

const packet = readJson(packetRef);
const preflight = readJson(preflightRef);
const noExecute = readJson(noExecuteRef);
const prompt = readText(promptRef);
const knownRuntime = readText(knownRuntimeRef);
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

check("packet_schema_and_status", () =>
  packet.schema === "runtime_to_review_v2_future_execution_packet.v1" &&
  packet.execution_packet_id === "r2r_v2_trial_001_serum_detail_control_future_execution_packet_20260608" &&
  packet.status === "issued_pending_exact_runtime_binding_no_dispatch" &&
  packet.trial_id === "r2r_v2_trial_001_serum_detail_control" &&
  packet.execution_conditions_locked === true &&
  packet.can_execute_now === false &&
  packet.dispatch_performed === false &&
  packet.activation_consumed === false
);
check("source_refs_align", () =>
  packet.source_refs.readiness_preflight_ref === preflightRef &&
  packet.source_refs.no_execute_packet_ref === noExecuteRef &&
  packet.source_refs.prompt_package_ref === promptRef &&
  packet.source_refs.source_attempt_018_prompt_ref === sourcePromptRef &&
  packet.source_refs.known_current_serum_runtime_ref === knownRuntimeRef &&
  fs.existsSync(repoPath(preflightRef)) &&
  fs.existsSync(repoPath(noExecuteRef)) &&
  fs.existsSync(repoPath(promptRef)) &&
  fs.existsSync(repoPath(sourcePromptRef)) &&
  fs.existsSync(repoPath(knownRuntimeRef))
);
check("source_packets_still_safe", () =>
  preflight.status === "passed_preflight_no_execute" &&
  preflight.readiness_result.ready_to_create_future_execution_packet === true &&
  preflight.readiness_result.ready_to_execute_from_current_packet === false &&
  noExecute.status === "prepared_no_execute" &&
  noExecute.can_execute_now === false
);
check("visual_job_contract_matches_no_execute_packet", () =>
  packet.visual_job_contract.contract_id === noExecute.visual_job_contract.contract_id &&
  packet.visual_job_contract.prompt_package_ref === promptRef &&
  packet.visual_job_contract.source_prompt_package_ref === sourcePromptRef &&
  packet.visual_job_contract.shot_role === noExecute.trial.shot_role &&
  packet.visual_job_contract.prompt_package_reuse_policy === noExecute.visual_job_contract.prompt_package_reuse_policy &&
  packet.visual_job_contract.constraints.blank_label_required === true &&
  packet.visual_job_contract.constraints.readable_text_or_logo_allowed === false &&
  packet.visual_job_contract.constraints.decorative_label_mark_allowed === false &&
  packet.visual_job_contract.constraints.max_images === 1 &&
  packet.visual_job_contract.constraints.retry_allowed === false &&
  packet.visual_job_contract.constraints.secret_value_read_allowed === false
);
check("prompt_is_v2_detail_blank_label_not_brandable", () =>
  prompt.includes("prompt_package_id: product_detail_premium_serum_bottle_v2") &&
  prompt.includes("shot_role: product_detail_controlled_studio") &&
  prompt.includes("product fidelity inspection shot") &&
  prompt.includes("intentionally blank label") &&
  prompt.includes("label_panel_intentionally_blank_and_non_readable") &&
  !prompt.includes("brandable")
);
check("current_runtime_binding_gap_is_recorded", () =>
  knownRuntime.includes(`allowedPromptPackageRef = "${sourcePromptRef}"`) &&
  !knownRuntime.includes(`allowedPromptPackageRef = "${promptRef}"`) &&
  packet.execution_binding.known_current_runtime_binding_status === "blocked_prompt_ref_mismatch" &&
  packet.execution_binding.known_current_runtime_allowed_prompt_ref === sourcePromptRef &&
  packet.execution_binding.required_prompt_ref === promptRef &&
  packet.reason_can_execute_now_is_false.includes("current known serum runtime binding still allows only")
);
check("execution_binding_is_exactly_single_future_target", () =>
  packet.execution_binding.lane === "Amber_B_provider_image" &&
  packet.execution_binding.activation_package_id === "AUTH-R2R-V2-TRIAL-001-SERUM-DETAIL-CONTROL-20260608-FUTURE-EXECUTION" &&
  packet.execution_binding.required_confirmation_phrase === "RUNTIME_TO_REVIEW_V2_TRIAL_001_ONE_PROVIDER_ONE_IMAGE" &&
  packet.execution_binding.target_runtime_required === "exact_v2_secretless_image_execution_broker_or_exact_v2_serum_detail_route" &&
  packet.execution_binding.provider_route === "native_doubao_guarded" &&
  packet.execution_binding.provider_mode === "real_guarded" &&
  packet.execution_binding.provider_id === "doubao" &&
  packet.execution_binding.plugin_id === "DoubaoGen" &&
  packet.execution_binding.api_id === "generate_image" &&
  packet.execution_binding.model_required === "doubao-seedream-5-0-260128" &&
  packet.execution_binding.secretless_activation_required === true &&
  packet.execution_binding.dispatch_source_must_be_binding_not_payload_plugin_field === true &&
  packet.execution_binding.restricted_plugin_facade_required === true &&
  packet.execution_binding.exact_runtime_binding_required_before_dispatch === true &&
  packet.execution_binding.route_http_allowed_after_exact_binding === true &&
  packet.execution_binding.method_after_exact_binding === "POST" &&
  packet.execution_binding.route_origin_after_exact_binding === "http://127.0.0.1:6005" &&
  packet.execution_binding.route_path_after_exact_binding === "/internal/ai-image-agents/execute/r2r-v2-trial-001-serum-detail-control"
);
check("budget_is_one_call_one_image_no_retry", () =>
  packet.single_dispatch_budget.max_route_http_requests === 1 &&
  packet.single_dispatch_budget.max_provider_calls === 1 &&
  packet.single_dispatch_budget.max_plugin_calls === 1 &&
  packet.single_dispatch_budget.max_api_calls === 1 &&
  packet.single_dispatch_budget.max_images === 1 &&
  packet.single_dispatch_budget.max_live_probe_attempts === 1 &&
  packet.single_dispatch_budget.retry_allowed === false
);
check("output_policy_matches_no_execute_and_has_no_collision", () =>
  packet.output_policy.output_directory_ref === noExecute.output_policy.output_directory_ref &&
  packet.output_policy.expected_receipt_ref === noExecute.output_policy.expected_receipt_ref &&
  packet.output_policy.expected_artifact_record_ref === noExecute.output_policy.expected_artifact_record_ref &&
  packet.output_policy.expected_review_bridge_ref === noExecute.output_policy.expected_review_bridge_ref &&
  packet.output_policy.overwrite_existing_files_allowed === false &&
  packet.output_policy.initial_status_after_generation === "generated_unreviewed" &&
  packet.output_policy.review_queue_required_before_archive === true &&
  isRepoRelative(packet.output_policy.output_directory_ref) &&
  isRepoRelative(packet.output_policy.expected_receipt_ref) &&
  isRepoRelative(packet.output_policy.expected_artifact_record_ref) &&
  isRepoRelative(packet.output_policy.expected_review_bridge_ref) &&
  !fs.existsSync(repoPath(packet.output_policy.output_directory_ref)) &&
  !fs.existsSync(repoPath(packet.output_policy.expected_receipt_ref)) &&
  !fs.existsSync(repoPath(packet.output_policy.expected_artifact_record_ref)) &&
  !fs.existsSync(repoPath(packet.output_policy.expected_review_bridge_ref))
);
check("post_dispatch_writes_are_review_first", () =>
  packet.post_dispatch_required_writes_if_successful.receipt_required === true &&
  packet.post_dispatch_required_writes_if_successful.artifact_record_required === true &&
  packet.post_dispatch_required_writes_if_successful.review_bridge_required === true &&
  packet.post_dispatch_required_writes_if_successful.accepted_samples_write_allowed === false &&
  packet.post_dispatch_required_writes_if_successful.production_candidate_write_allowed === false &&
  packet.post_dispatch_required_writes_if_successful.DailyNote_write_allowed === false &&
  packet.post_dispatch_required_writes_if_successful.VCP_memory_write_allowed === false &&
  packet.post_dispatch_required_writes_if_successful.memory_candidate_allowed_after_human_review === true
);
check("pre_dispatch_checks_include_binding_gap_and_core_validators", () =>
  packet.pre_dispatch_checks_required.includes("node scripts/validate_runtime_to_review_v2_multi_prompt_controlled_trial_plan.js") &&
  packet.pre_dispatch_checks_required.includes("node scripts/validate_prompt_schema.js --type prompt_package prompts/image_generation/product_detail_premium_serum_bottle_v2.yaml") &&
  packet.pre_dispatch_checks_required.includes("node scripts/validate_runtime_to_review_v2_trial_001_activation_packet_no_execute.js") &&
  packet.pre_dispatch_checks_required.includes("node scripts/validate_runtime_to_review_v2_trial_001_execution_readiness_preflight.js") &&
  packet.pre_dispatch_checks_required.includes("node scripts/validate_runtime_to_review_v2_trial_001_future_execution_packet.js") &&
  packet.pre_dispatch_checks_required.includes("exact_v2_runtime_binding_validator_to_be_added_before_dispatch") &&
  packet.pre_dispatch_checks_required.includes("git diff --check")
);
check("review_focus_has_expected_items", () =>
  packet.review_focus_after_generation.includes("intentionally_blank_label_boundary") &&
  packet.review_focus_after_generation.includes("cap_and_bottle_geometry") &&
  packet.review_focus_after_generation.includes("material_reflection_control") &&
  packet.review_focus_after_generation.includes("no_readable_text_logo_or_decorative_mark") &&
  packet.review_focus_after_generation.includes("full_bottle_visible_from_pipette_to_base") &&
  packet.review_focus_after_generation.includes("no_cropped_bottle_bottom")
);
check("stop_conditions_cover_real_execution_boundaries", () =>
  packet.stop_conditions.includes("exact_v2_runtime_binding_missing") &&
  packet.stop_conditions.includes("known_current_serum_runtime_still_points_to_v1_prompt") &&
  packet.stop_conditions.includes("prompt_contains_brandable_or_brand_label_generation_request") &&
  packet.stop_conditions.includes("output_directory_exists") &&
  packet.stop_conditions.includes("expected_receipt_or_artifact_record_or_review_bridge_already_exists") &&
  packet.stop_conditions.includes("budget_not_exactly_one_route_one_provider_one_plugin_one_api_one_image") &&
  packet.stop_conditions.includes("retry_requested") &&
  packet.stop_conditions.includes("secret_value_read_required") &&
  packet.stop_conditions.includes("authorization_header_constructed_by_Agent_Image_Lab") &&
  packet.stop_conditions.includes("accepted_samples_or_production_or_memory_write_requested_before_review") &&
  packet.stop_conditions.includes("push_tag_release_deploy_requested")
);
check("side_effect_flags_false_at_creation", () => allFalse(packet.side_effect_flags_at_packet_creation));
check("recommended_next_is_binding_ready_packet", () =>
  packet.recommended_next === "create_exact_v2_runtime_binding_or_broker_dispatch_adapter_then_flip_can_execute_now_in_a_new_binding_ready_execution_packet"
);

const failed = results.filter((result) => !result.passed);
const output = {
  passed: failed.length === 0,
  validator: "runtime_to_review_v2_trial_001_future_execution_packet",
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
