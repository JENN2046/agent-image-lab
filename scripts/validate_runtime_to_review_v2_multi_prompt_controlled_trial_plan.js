#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const docRef = "docs/runtime_to_review_v2_multi_prompt_controlled_trial_plan.md";
const fixtureRef = "tests/schema_examples/runtime_to_review_v2_multi_prompt_controlled_trial_plan.example.json";
const trial001PromptRef = "prompts/image_generation/product_detail_premium_serum_bottle_v2.yaml";
const oldSerumHeroPromptRef = "prompts/image_generation/product_lifestyle_premium_serum_bottle_v1.yaml";

function readText(ref) {
  return fs.readFileSync(path.join(repoRoot, ref), "utf8");
}

function readJson(ref) {
  return JSON.parse(readText(ref));
}

const doc = readText(docRef);
const fixture = readJson(fixtureRef).runtime_to_review_v2_multi_prompt_controlled_trial_plan;
const trial001Prompt = readText(trial001PromptRef);
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

function allFlagsFalse(flags) {
  return Object.values(flags).every((value) => value === false);
}

check("doc_exists", () => doc.length > 0);
check("fixture_phase_matches_doc", () => doc.includes(fixture.phase));
check("status_is_no_execute", () => fixture.status === "local_plan_no_execute" && doc.includes("This plan does not execute any trial."));
check("attempt_018_closed_out", () => fixture.attempt_018_status === "accepted_sample_registered_and_closed_out");
check("attempt_019_not_recommended", () => fixture.attempt_019_recommended_now === false && doc.includes("attempt_019_recommended_now: false"));
check("broker_direction_recorded", () =>
  doc.includes("VCPToolBox Image Execution Broker") &&
  doc.includes("VisualJobContract / ShotPlan / ReviewPolicy") &&
  doc.includes("Restricted Plugin Facade")
);
check("trial_count_three", () => fixture.trial_count === 3 && fixture.trials.length === 3);
check("execute_one_trial_at_a_time", () => fixture.execute_one_trial_at_a_time === true);
check("budget_one_each_no_retry", () =>
  fixture.default_budget_per_trial.max_provider_calls === 1 &&
  fixture.default_budget_per_trial.max_plugin_calls === 1 &&
  fixture.default_budget_per_trial.max_api_calls === 1 &&
  fixture.default_budget_per_trial.max_images === 1 &&
  fixture.default_budget_per_trial.retry_allowed === false
);
check("trial_ids_unique", () => new Set(fixture.trials.map((trial) => trial.trial_id)).size === fixture.trials.length);
check("trial_001_serum_detail", () =>
  fixture.trials[0].trial_id === "r2r_v2_trial_001_serum_detail_control" &&
  fixture.trials[0].prompt_package_ref === trial001PromptRef &&
  fixture.trials[0].source_prompt_package_ref === oldSerumHeroPromptRef &&
  fixture.trials[0].prompt_revision_policy === "derive_from_attempt_018_success_but_rewrite_for_detail_control"
);
check("trial_001_does_not_reuse_hero_prompt_as_execution_prompt", () =>
  fixture.trials[0].prompt_package_ref !== fixture.trials[0].source_prompt_package_ref &&
  fixture.trials[0].prompt_package_ref !== oldSerumHeroPromptRef
);
check("trial_001_prompt_encodes_detail_shot_role", () =>
  trial001Prompt.includes("prompt_package_id: product_detail_premium_serum_bottle_v2") &&
  trial001Prompt.includes("shot_role: product_detail_controlled_studio") &&
  trial001Prompt.includes("not a broad ecommerce hero scene") &&
  trial001Prompt.includes("full_bottle_visible_from_pipette_to_base") &&
  trial001Prompt.includes("intentionally blank label") &&
  trial001Prompt.includes("label_panel_intentionally_blank_and_non_readable") &&
  !trial001Prompt.includes("brandable")
);
check("trial_001_review_focus_uses_single_blank_label_choice", () =>
  fixture.trials[0].review_policy_focus.includes("intentionally_blank_label_boundary") &&
  fixture.trials[0].review_policy_focus.includes("no_readable_text_logo_or_decorative_mark") &&
  !fixture.trials[0].review_policy_focus.includes("label_or_no_label_boundary") &&
  !fixture.trials[0].review_policy_focus.includes("no_text_logo_unless_explicit")
);
check("trial_002_lantern", () =>
  fixture.trials[1].trial_id === "r2r_v2_trial_002_lantern_ecommerce_hero" &&
  fixture.trials[1].product_family === "premium_portable_led_camping_lantern"
);
check("trial_003_bag_support", () =>
  fixture.trials[2].trial_id === "r2r_v2_trial_003_bag_support_logic" &&
  fixture.trials[2].review_policy_focus.includes("support_logic")
);
check("all_trial_prompt_refs_are_project_relative", () =>
  fixture.trials.every((trial) =>
    typeof trial.prompt_package_ref === "string" &&
    !path.isAbsolute(trial.prompt_package_ref) &&
    !trial.prompt_package_ref.split(/[\\/]/).includes("..")
  )
);
check("all_trial_prompt_refs_exist", () =>
  fixture.trials.every((trial) => fs.existsSync(path.join(repoRoot, trial.prompt_package_ref)))
);
check("boundary_flags_false", () => allFlagsFalse(fixture.execution_boundary));
check("doc_boundary_flags_present", () =>
  Object.keys(fixture.execution_boundary).every((key) => doc.includes(`${key}: false`))
);
check("future_activation_packet_cannot_execute", () =>
  fixture.required_future_activation_packet.lane === "Amber_B_provider_image" &&
  fixture.required_future_activation_packet.can_execute_now === false &&
  fixture.required_future_activation_packet.secret_value_read_allowed === false &&
  fixture.required_future_activation_packet.overwrite_existing_files_allowed === false
);
check("recommended_next_is_trial_001_preparation", () =>
  fixture.recommended_next === "prepare_r2r_v2_trial_001_serum_detail_control_activation_packet_no_execute" &&
  fixture.automatic_real_execution_allowed_by_this_plan === false
);
check("stop_rules_present", () => doc.includes("## Stop Rules") && doc.includes("The output directory already exists"));
check("broker_extraction_rule_present", () => doc.includes("Do not extract a full broker after one more image."));

const failed = results.filter((result) => !result.passed);
const output = {
  passed: failed.length === 0,
  validator: "runtime_to_review_v2_multi_prompt_controlled_trial_plan",
  phase: fixture.phase,
  doc_ref: docRef,
  fixture_ref: fixtureRef,
  check_count: results.length,
  failed_count: failed.length,
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  image_generation_performed: false,
  file_write_performed: false,
  results,
};

console.log(JSON.stringify(output, null, 2));
if (failed.length > 0) process.exit(1);
