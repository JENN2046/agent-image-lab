#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const packetRef = "reports/runtime_to_review_v2/r2r_v2_trial_001_serum_detail_control_activation_packet_no_execute_20260608.json";
const planRef = "docs/runtime_to_review_v2_multi_prompt_controlled_trial_plan.md";
const trial001PromptRef = "prompts/image_generation/product_detail_premium_serum_bottle_v2.yaml";
const oldSerumHeroPromptRef = "prompts/image_generation/product_lifestyle_premium_serum_bottle_v1.yaml";

function repoPath(ref) {
  return path.join(repoRoot, ref);
}

function readJson(ref) {
  return JSON.parse(fs.readFileSync(repoPath(ref), "utf8"));
}

const packet = readJson(packetRef);
const plan = fs.readFileSync(repoPath(planRef), "utf8");
const trial001Prompt = fs.readFileSync(repoPath(trial001PromptRef), "utf8");
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

function isRepoRelative(ref) {
  return typeof ref === "string" &&
    ref.trim() !== "" &&
    !path.isAbsolute(ref) &&
    !ref.split(/[\\/]/).includes("..");
}

function allFlagsFalse(flags) {
  return Object.values(flags).every((value) => value === false);
}

check("packet_schema", () => packet.schema === "runtime_to_review_v2_activation_packet_no_execute.v1");
check("packet_status_no_execute", () => packet.status === "prepared_no_execute" && packet.can_execute_now === false);
check("source_plan_exists_and_mentions_trial", () =>
  packet.source_plan_ref === planRef &&
  plan.includes("r2r_v2_trial_001_serum_detail_control")
);
check("trial_identity", () =>
  packet.trial.trial_id === "r2r_v2_trial_001_serum_detail_control" &&
  packet.trial.trial_sequence === 1 &&
  packet.trial.product_family === "premium_skincare_serum"
);
check("not_attempt_019_loop", () => packet.trial.purpose.includes("without creating a new serum attempt-019 loop"));
check("visual_job_contract_prompt_ref_exists", () =>
  packet.visual_job_contract.prompt_package_ref === trial001PromptRef &&
  packet.visual_job_contract.source_prompt_package_ref === oldSerumHeroPromptRef &&
  fs.existsSync(repoPath(packet.visual_job_contract.prompt_package_ref))
);
check("visual_job_contract_does_not_reuse_hero_prompt_as_execution_prompt", () =>
  packet.visual_job_contract.prompt_package_ref !== packet.visual_job_contract.source_prompt_package_ref &&
  packet.visual_job_contract.prompt_package_ref !== oldSerumHeroPromptRef &&
  packet.visual_job_contract.prompt_package_reuse_policy === "derive_from_attempt_018_serum_prompt_package_but_rewrite_for_product_detail_control"
);
check("prompt_file_encodes_detail_control", () =>
  trial001Prompt.includes("prompt_package_id: product_detail_premium_serum_bottle_v2") &&
  trial001Prompt.includes("shot_role: product_detail_controlled_studio") &&
  trial001Prompt.includes("not a broad ecommerce hero scene") &&
  trial001Prompt.includes("product fidelity inspection shot") &&
  trial001Prompt.includes("full_bottle_visible_from_pipette_to_base") &&
  trial001Prompt.includes("intentionally blank label") &&
  trial001Prompt.includes("label_panel_intentionally_blank_and_non_readable") &&
  !trial001Prompt.includes("brandable")
);
check("visual_constraints_safe", () =>
  packet.visual_job_contract.constraints.max_images === 1 &&
  packet.visual_job_contract.constraints.retry_allowed === false &&
  packet.visual_job_contract.constraints.secret_value_read_allowed === false &&
  packet.visual_job_contract.constraints.blank_label_required === true &&
  packet.visual_job_contract.constraints.readable_text_or_logo_allowed === false &&
  packet.visual_job_contract.constraints.decorative_label_mark_allowed === false
);
check("shot_plan_one_shot", () =>
  packet.shot_plan.shot_count === 1 &&
  packet.shot_plan.primary_shot.risk_watch_items.includes("cropped bottle bottom")
);
check("review_policy_blocks_writes", () =>
  packet.review_policy.human_review_required_before_archive === true &&
  packet.review_policy.accepted_samples_write_allowed_by_this_packet === false &&
  packet.review_policy.production_candidate_write_allowed_by_this_packet === false &&
  packet.review_policy.memory_write_default === false &&
  packet.review_policy.review_focus.includes("intentionally_blank_label_boundary") &&
  packet.review_policy.review_focus.includes("no_readable_text_logo_or_decorative_mark") &&
  !packet.review_policy.review_focus.includes("label_or_no_label_boundary") &&
  !packet.review_policy.review_focus.includes("no_text_logo_unless_explicit")
);
check("execution_binding_is_future_and_secretless", () =>
  packet.execution_binding.lane === "Amber_B_provider_image" &&
  packet.execution_binding.secretless_activation_required === true &&
  packet.execution_binding.exact_future_activation_id === "AUTH-PENDING-R2R-V2-TRIAL-001-SERUM-DETAIL-CONTROL-20260608" &&
  packet.execution_binding.dispatch_source_must_be_binding_not_payload_plugin_field === true &&
  packet.execution_binding.restricted_plugin_facade_required === true
);
check("budget_one_each_no_retry", () =>
  packet.budget.max_provider_calls === 1 &&
  packet.budget.max_plugin_calls === 1 &&
  packet.budget.max_api_calls === 1 &&
  packet.budget.max_images === 1 &&
  packet.budget.retry_allowed === false &&
  packet.budget.max_live_probe_attempts === 1
);
check("output_policy_repo_relative", () =>
  isRepoRelative(packet.output_policy.output_directory_ref) &&
  isRepoRelative(packet.output_policy.expected_artifact_record_ref) &&
  isRepoRelative(packet.output_policy.expected_receipt_ref) &&
  isRepoRelative(packet.output_policy.expected_review_bridge_ref)
);
check("output_directory_absent_for_no_overwrite", () =>
  packet.output_policy.output_directory_ref.endsWith("/") &&
  packet.output_policy.overwrite_existing_files_allowed === false &&
  !fs.existsSync(repoPath(packet.output_policy.output_directory_ref))
);
check("stop_conditions_include_core_red_boundaries", () =>
  packet.stop_conditions.includes("output_directory_already_exists") &&
  packet.stop_conditions.includes("secret_value_read_required") &&
  packet.stop_conditions.includes("push_tag_release_deploy_requested")
);
check("side_effect_flags_false", () => allFlagsFalse(packet.side_effect_flags));
check("validation_commands_registered", () =>
  packet.validation_required.includes("node scripts/validate_runtime_to_review_v2_multi_prompt_controlled_trial_plan.js") &&
  packet.validation_required.includes("node scripts/validate_prompt_schema.js --type prompt_package prompts/image_generation/product_detail_premium_serum_bottle_v2.yaml") &&
  packet.validation_required.includes("node scripts/validate_runtime_to_review_v2_trial_001_activation_packet_no_execute.js") &&
  packet.validation_required.includes("git diff --check")
);
check("no_live_execution_claim", () =>
  packet.recommended_next === "review_this_packet_then_create_a_separate_future_execution_packet_only_if_trial_001_should_run"
);

const failed = results.filter((result) => !result.passed);
const output = {
  passed: failed.length === 0,
  validator: "runtime_to_review_v2_trial_001_activation_packet_no_execute",
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
