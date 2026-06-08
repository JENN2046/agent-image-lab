#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const packetRef = "reports/runtime_to_review_v2/r2r_v2_trial_002_lantern_ecommerce_hero_activation_packet_no_execute_20260608.json";
const criteriaRef = "reports/runtime_to_review_v2/r2r_v2_trial_002_lantern_ecommerce_hero_review_criteria_no_execute_20260608.json";
const planRef = "docs/runtime_to_review_v2_multi_prompt_controlled_trial_plan.md";
const fixtureRef = "tests/schema_examples/runtime_to_review_v2_multi_prompt_controlled_trial_plan.example.json";
const promptRef = "prompts/image_generation/product_lifestyle_premium_portable_led_camping_lantern_v2.yaml";
const sourcePromptRef = "prompts/image_generation/product_lifestyle_premium_portable_led_camping_lantern_v1.yaml";

function repoPath(ref) {
  const resolved = path.resolve(repoRoot, ref);
  const relative = path.relative(repoRoot, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`path escapes repository root: ${ref}`);
  }
  return resolved;
}

function readText(ref) {
  return fs.readFileSync(repoPath(ref), "utf8");
}

function readJson(ref) {
  return JSON.parse(readText(ref));
}

function isRepoRelative(ref) {
  return typeof ref === "string" &&
    ref.trim() !== "" &&
    !path.isAbsolute(ref) &&
    !ref.split(/[\\/]/).includes("..");
}

function allFlagsFalse(flags) {
  return Object.values(flags || {}).every((value) => value === false);
}

function includesAll(values, required) {
  return required.every((item) => values.includes(item));
}

const packet = readJson(packetRef);
const criteria = readJson(criteriaRef);
const plan = readText(planRef);
const fixture = readJson(fixtureRef).runtime_to_review_v2_multi_prompt_controlled_trial_plan;
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

check("packet_schema_and_status", () =>
  packet.schema === "runtime_to_review_v2_activation_packet_no_execute.v1" &&
  packet.status === "prepared_no_execute" &&
  packet.can_execute_now === false
);
check("criteria_schema_and_status", () =>
  criteria.schema === "runtime_to_review_v2_review_criteria_no_execute.v1" &&
  criteria.status === "prepared_no_execute_review_criteria"
);
check("source_plan_and_fixture_include_trial_002", () =>
  packet.source_plan_ref === planRef &&
  criteria.source_plan_ref === planRef &&
  plan.includes("r2r_v2_trial_002_lantern_ecommerce_hero") &&
  fixture.trials[1].trial_id === "r2r_v2_trial_002_lantern_ecommerce_hero"
);
check("trial_identity", () =>
  packet.trial.trial_id === "r2r_v2_trial_002_lantern_ecommerce_hero" &&
  packet.trial.trial_sequence === 2 &&
  packet.trial.product_family === "premium_portable_led_camping_lantern" &&
  packet.trial.shot_role === "ecommerce_square_hero"
);
check("prompt_refs_exist_and_match_plan", () =>
  packet.visual_job_contract.prompt_package_ref === promptRef &&
  packet.visual_job_contract.source_prompt_package_ref === sourcePromptRef &&
  criteria.prompt_package_ref === promptRef &&
  fixture.trials[1].prompt_package_ref === promptRef &&
  fs.existsSync(repoPath(promptRef)) &&
  fs.existsSync(repoPath(sourcePromptRef))
);
check("prompt_file_encodes_lantern_hero_constraints", () =>
  prompt.includes("package_id: product_lifestyle_premium_portable_led_camping_lantern_v2") &&
  prompt.includes("selected_product: premium_portable_led_camping_lantern") &&
  prompt.includes("shot_role: premium_outdoor_lifestyle_hero_product_shot") &&
  prompt.includes("full handle, diffuser, dimmer knob, body, and base visible") &&
  prompt.includes("no people") &&
  prompt.includes("no hands") &&
  prompt.includes("no open flame") &&
  prompt.includes("no smoke")
);
check("visual_contract_locks_one_safe_product", () =>
  packet.visual_job_contract.subject === "premium portable LED camping lantern" &&
  packet.visual_job_contract.constraints.max_images === 1 &&
  packet.visual_job_contract.constraints.retry_allowed === false &&
  packet.visual_job_contract.constraints.single_product_only === true &&
  packet.visual_job_contract.constraints.people_hands_faces_allowed === false &&
  packet.visual_job_contract.constraints.open_flame_or_smoke_allowed === false &&
  packet.visual_job_contract.constraints.readable_text_or_logo_allowed === false &&
  packet.visual_job_contract.constraints.extra_lanterns_allowed === false &&
  packet.visual_job_contract.constraints.secret_value_read_allowed === false
);
check("shot_plan_records_transfer_watch_items", () =>
  packet.shot_plan.shot_count === 1 &&
  packet.shot_plan.primary_shot.shot_id === "lantern_ecommerce_square_hero_001" &&
  packet.shot_plan.primary_shot.risk_watch_items.some((item) => item.includes("wrong product drift")) &&
  packet.shot_plan.primary_shot.risk_watch_items.some((item) => item.includes("cropped or impossible handle"))
);
check("review_policy_blocks_promotion_and_memory_writes", () =>
  packet.review_policy.criteria_ref === criteriaRef &&
  packet.review_policy.required_status_after_generation === "generated_unreviewed" &&
  packet.review_policy.human_review_required_before_archive === true &&
  packet.review_policy.accepted_samples_write_allowed_by_this_packet === false &&
  packet.review_policy.production_candidate_write_allowed_by_this_packet === false &&
  packet.review_policy.memory_write_default === false &&
  includesAll(packet.review_policy.review_focus, [
    "centered_product_scale",
    "control_position_readability",
    "cylindrical_geometry",
    "no_people_hands_fire_smoke"
  ])
);
check("criteria_minimum_bar_is_specific", () =>
  criteria.minimum_acceptance_bar.modern_premium_led_camping_lantern_read === true &&
  criteria.minimum_acceptance_bar.full_handle_diffuser_body_control_and_base_visible === true &&
  criteria.minimum_acceptance_bar.no_people_hands_fire_smoke === true &&
  criteria.minimum_acceptance_bar.no_readable_brand_text_logo_or_watermark === true
);
check("criteria_scoring_weights_sum_to_one", () => {
  const total = Object.values(criteria.scoring_rubric).reduce((sum, item) => sum + item.weight, 0);
  return Math.abs(total - 1) < 0.00001;
});
check("criteria_has_actionable_watch_items", () =>
  criteria.watch_items.length >= 8 &&
  criteria.watch_items.some((item) => item.includes("diffuser")) &&
  criteria.watch_items.some((item) => item.includes("drifts into flashlight"))
);
check("execution_binding_future_only", () =>
  packet.execution_binding.lane === "Amber_B_provider_image_future_only" &&
  packet.execution_binding.secretless_activation_required === true &&
  packet.execution_binding.exact_future_activation_id === "AUTH-PENDING-R2R-V2-TRIAL-002-LANTERN-ECOMMERCE-HERO-20260608" &&
  packet.execution_binding.exact_future_confirmation_phrase === "RUNTIME_TO_REVIEW_V2_TRIAL_002_ONE_PROVIDER_ONE_IMAGE" &&
  packet.execution_binding.binding_ready_packet_required_before_execution === true
);
check("budget_one_each_zero_retry", () =>
  packet.budget.max_provider_calls === 1 &&
  packet.budget.max_plugin_calls === 1 &&
  packet.budget.max_api_calls === 1 &&
  packet.budget.max_images === 1 &&
  packet.budget.retry_allowed === false &&
  packet.budget.max_live_probe_attempts === 1
);
check("output_policy_repo_relative_and_absent", () =>
  isRepoRelative(packet.output_policy.output_directory_ref) &&
  isRepoRelative(packet.output_policy.expected_artifact_record_ref) &&
  isRepoRelative(packet.output_policy.expected_receipt_ref) &&
  isRepoRelative(packet.output_policy.expected_review_bridge_ref) &&
  packet.output_policy.overwrite_existing_files_allowed === false &&
  !fs.existsSync(repoPath(packet.output_policy.output_directory_ref))
);
check("future_review_refs_match_packet_output_policy", () =>
  criteria.post_generation_required_review_refs.expected_artifact_record_ref === packet.output_policy.expected_artifact_record_ref &&
  criteria.post_generation_required_review_refs.expected_receipt_ref === packet.output_policy.expected_receipt_ref &&
  criteria.post_generation_required_review_refs.expected_review_bridge_ref === packet.output_policy.expected_review_bridge_ref
);
check("stop_conditions_include_no_execute_boundaries", () =>
  includesAll(packet.stop_conditions, [
    "output_directory_already_exists",
    "missing_exact_activation_packet",
    "can_execute_now_not_true_in_a_future_binding_ready_packet",
    "retry_requested",
    "secret_value_read_required",
    "accepted_samples_or_production_or_memory_write_requested",
    "push_tag_release_deploy_requested"
  ])
);
check("side_effect_flags_false", () => allFlagsFalse(packet.side_effect_flags) && allFlagsFalse(criteria.side_effect_flags));
check("validation_commands_registered", () =>
  packet.validation_required.includes("node scripts/validate_runtime_to_review_v2_multi_prompt_controlled_trial_plan.js") &&
  packet.validation_required.includes("node scripts/validate_prompt_schema.js --type prompt_package prompts/image_generation/product_lifestyle_premium_portable_led_camping_lantern_v2.yaml") &&
  packet.validation_required.includes("node scripts/validate_runtime_to_review_v2_trial_002_activation_packet_no_execute.js") &&
  packet.validation_required.includes("git diff --check")
);
check("recommended_next_does_not_execute", () =>
  packet.recommended_next === "review_this_packet_and_criteria_then_create_a_separate_binding_ready_execution_packet_only_if_trial_002_should_run" &&
  criteria.recommended_next === "validate_trial_002_packet_and_criteria_then_wait_for_separate_one_image_execution_decision"
);

const failed = results.filter((result) => !result.passed);
const output = {
  passed: failed.length === 0,
  validator: "runtime_to_review_v2_trial_002_activation_packet_no_execute",
  packet_ref: packetRef,
  criteria_ref: criteriaRef,
  prompt_ref: promptRef,
  check_count: results.length,
  failed_count: failed.length,
  route_http_request_performed: false,
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  image_generation_performed: false,
  file_write_performed: false,
  results
};

process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
if (failed.length > 0) process.exit(1);
