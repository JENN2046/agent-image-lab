#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const validator = "runtime_to_review_v2_trial_002_review_and_execution_preflight_templates";
const reviewTemplateRef = "reports/runtime_to_review_v2/r2r_v2_trial_002_lantern_ecommerce_hero_review_instruction_template_20260608.json";
const executionTemplateRef = "reports/runtime_to_review_v2/r2r_v2_trial_002_lantern_ecommerce_hero_execution_preflight_template_20260608.json";
const noExecutePacketRef = "reports/runtime_to_review_v2/r2r_v2_trial_002_lantern_ecommerce_hero_activation_packet_no_execute_20260608.json";
const criteriaRef = "reports/runtime_to_review_v2/r2r_v2_trial_002_lantern_ecommerce_hero_review_criteria_no_execute_20260608.json";
const ailPreflightRef = "reports/runtime_to_review_v2/r2r_v2_trial_002_lantern_ecommerce_hero_ail_side_binding_preflight_20260608.json";
const promptRef = "prompts/image_generation/product_lifestyle_premium_portable_led_camping_lantern_v2.yaml";
const outputDir = "runs/real_generation/runtime_to_review_v2_trial_002_lantern_ecommerce_hero/";

const results = [];

function repoPath(ref) {
  const resolved = path.resolve(root, ref);
  const relative = path.relative(root, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`path escapes repository root: ${ref}`);
  }
  return resolved;
}

function readJson(ref) {
  return JSON.parse(fs.readFileSync(repoPath(ref), "utf8"));
}

function exists(ref) {
  return fs.existsSync(repoPath(ref));
}

function allFalse(flags) {
  return flags && Object.values(flags).every((value) => value === false);
}

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

const reviewTemplate = readJson(reviewTemplateRef);
const executionTemplate = readJson(executionTemplateRef);
const noExecutePacket = readJson(noExecutePacketRef);
const criteria = readJson(criteriaRef);
const ailPreflight = readJson(ailPreflightRef);

check("source_files_exist", () =>
  [reviewTemplateRef, executionTemplateRef, noExecutePacketRef, criteriaRef, ailPreflightRef, promptRef].every(exists)
);
check("review_template_schema_and_status", () =>
  reviewTemplate.schema === "runtime_to_review_v2_review_instruction_template.v1" &&
  reviewTemplate.status === "prepared_review_instruction_template_no_execution" &&
  reviewTemplate.trial_id === "r2r_v2_trial_002_lantern_ecommerce_hero"
);
check("execution_template_schema_and_blocked_status", () =>
  executionTemplate.schema === "runtime_to_review_v2_execution_preflight_template.v1" &&
  executionTemplate.status === "prepared_execution_preflight_template_blocked_external_route_pending" &&
  executionTemplate.trial_id === "r2r_v2_trial_002_lantern_ecommerce_hero" &&
  executionTemplate.can_execute_now === false &&
  executionTemplate.binding_ready === false &&
  executionTemplate.dispatch_performed === false &&
  executionTemplate.activation_consumed === false
);
check("refs_align_to_existing_trial_002_surfaces", () =>
  reviewTemplate.source_refs.no_execute_packet_ref === noExecutePacketRef &&
  reviewTemplate.source_refs.review_criteria_ref === criteriaRef &&
  reviewTemplate.source_refs.ail_side_binding_preflight_ref === ailPreflightRef &&
  reviewTemplate.source_refs.prompt_package_ref === promptRef &&
  executionTemplate.source_refs.no_execute_packet_ref === noExecutePacketRef &&
  executionTemplate.source_refs.ail_side_binding_preflight_ref === ailPreflightRef &&
  executionTemplate.source_refs.review_instruction_template_ref === reviewTemplateRef &&
  executionTemplate.source_refs.prompt_package_ref === promptRef
);
check("existing_packets_remain_non_executable", () =>
  noExecutePacket.can_execute_now === false &&
  ailPreflight.can_execute_now === false &&
  ailPreflight.binding_ready === false &&
  ailPreflight.blocking_reason_before_binding_ready === "external_vcptoolbox_trial_002_internal_route_and_authorizer_not_bound"
);
check("review_instruction_contains_plain_language_and_questions", () =>
  Array.isArray(reviewTemplate.review_context_plain_language_zh) &&
  reviewTemplate.review_context_plain_language_zh.length >= 4 &&
  Array.isArray(reviewTemplate.review_questions_zh) &&
  reviewTemplate.review_questions_zh.length >= 7 &&
  reviewTemplate.review_questions_zh.some((item) => item.includes("手柄")) &&
  reviewTemplate.review_questions_zh.some((item) => item.includes("VCPToolBox binding"))
);
check("review_decision_options_are_complete", () => {
  const decisions = reviewTemplate.review_decision_options.map((item) => item.decision);
  return decisions.includes("accepted_candidate") &&
    decisions.includes("needs_prompt_or_binding_revision") &&
    decisions.includes("rejected_candidate");
});
check("review_minimum_bar_matches_criteria", () =>
  reviewTemplate.minimum_acceptance_bar.modern_premium_led_camping_lantern_read === criteria.minimum_acceptance_bar.modern_premium_led_camping_lantern_read &&
  reviewTemplate.minimum_acceptance_bar.full_handle_diffuser_body_control_and_base_visible === criteria.minimum_acceptance_bar.full_handle_diffuser_body_control_and_base_visible &&
  reviewTemplate.minimum_acceptance_bar.no_people_hands_fire_smoke === criteria.minimum_acceptance_bar.no_people_hands_fire_smoke &&
  reviewTemplate.minimum_acceptance_bar.no_readable_brand_text_logo_or_watermark === criteria.minimum_acceptance_bar.no_readable_brand_text_logo_or_watermark
);
check("review_template_blocks_promotion_and_memory_writes", () =>
  reviewTemplate.post_review_boundaries.accepted_samples_write_allowed_by_review_template === false &&
  reviewTemplate.post_review_boundaries.durable_archive_write_allowed_by_review_template === false &&
  reviewTemplate.post_review_boundaries.production_candidate_write_allowed_by_review_template === false &&
  reviewTemplate.post_review_boundaries.DailyNote_write_allowed_by_review_template === false &&
  reviewTemplate.post_review_boundaries.VCP_memory_write_allowed_by_review_template === false &&
  reviewTemplate.post_review_boundaries.Codex_memory_write_allowed_by_review_template === false &&
  reviewTemplate.post_review_boundaries.separate_promotion_gate_required_after_acceptance === true
);
check("execution_budget_is_one_each_zero_retry", () =>
  executionTemplate.execution_budget_if_unblocked_later.max_route_http_requests === 1 &&
  executionTemplate.execution_budget_if_unblocked_later.max_provider_calls === 1 &&
  executionTemplate.execution_budget_if_unblocked_later.max_plugin_calls === 1 &&
  executionTemplate.execution_budget_if_unblocked_later.max_api_calls === 1 &&
  executionTemplate.execution_budget_if_unblocked_later.max_images === 1 &&
  executionTemplate.execution_budget_if_unblocked_later.retry_allowed === false
);
check("execution_template_preserves_external_route_blocker", () =>
  executionTemplate.blocking_reason === "external_vcptoolbox_trial_002_internal_route_and_authorizer_not_bound" &&
  executionTemplate.required_preflight_checks_before_future_can_execute_now.some((item) =>
    item.check === "external_vcptoolbox_trial_002_route_and_authorizer_bound" &&
    item.current_result === "blocked_not_bound" &&
    item.must_be_true_before_execution === true
  )
);
check("future_command_is_marked_do_not_run_from_template", () =>
  executionTemplate.future_dispatch_command_after_external_binding_and_binding_ready_packet.must_not_run_from_this_template === true &&
  executionTemplate.future_dispatch_command_after_external_binding_and_binding_ready_packet.requires_separate_binding_ready_packet_with_can_execute_now_true === true &&
  executionTemplate.future_dispatch_command_after_external_binding_and_binding_ready_packet.must_not_add_retry_flags === true &&
  executionTemplate.future_dispatch_command_after_external_binding_and_binding_ready_packet.must_not_override_prompt_or_output === true
);
check("output_collision_targets_absent", () =>
  executionTemplate.required_preflight_checks_before_future_can_execute_now
    .find((item) => item.check === "output_collision_clear")
    .paths_must_not_exist.every((ref) => !exists(ref))
);
check("success_artifacts_are_review_first", () =>
  executionTemplate.required_success_artifacts_after_future_dispatch.receipt_ref === "reports/runtime_to_review_v2/r2r_v2_trial_002_lantern_ecommerce_hero_receipt.json" &&
  executionTemplate.required_success_artifacts_after_future_dispatch.artifact_record_ref === "reports/runtime_to_review_v2/r2r_v2_trial_002_lantern_ecommerce_hero_artifact_record.json" &&
  executionTemplate.required_success_artifacts_after_future_dispatch.review_bridge_ref === "review_console/live_receipt_bridge/r2r_v2_trial_002_lantern_ecommerce_hero/bridge_entry.json" &&
  executionTemplate.required_success_artifacts_after_future_dispatch.initial_status === "generated_unreviewed" &&
  executionTemplate.required_success_artifacts_after_future_dispatch.human_review_required_before_promotion === true
);
check("side_effect_flags_false", () =>
  allFalse(reviewTemplate.side_effect_flags) &&
  allFalse(executionTemplate.side_effect_flags_at_template_creation)
);
check("recommended_next_stays_no_execute", () =>
  reviewTemplate.recommended_next === "use_this_template_only_after_a_future_trial_002_success_receipt_and_review_bridge_exist" &&
  executionTemplate.recommended_next === "do_not_execute_from_this_template; when_external_route_is_bound_issue_separate_binding_ready_packet"
);

const failed = results.filter((result) => !result.passed);
const output = {
  passed: failed.length === 0,
  validator,
  review_template_ref: reviewTemplateRef,
  execution_template_ref: executionTemplateRef,
  can_execute_now: false,
  blocking_reason: executionTemplate.blocking_reason,
  check_count: results.length,
  failed_count: failed.length,
  route_http_request_performed: false,
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  image_generation_performed: false,
  output_write_performed: false,
  external_vcptoolbox_write_performed: false,
  results
};

process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
if (failed.length > 0) process.exit(1);
