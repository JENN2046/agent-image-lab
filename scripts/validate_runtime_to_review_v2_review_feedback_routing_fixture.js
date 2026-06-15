#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const validator = "runtime_to_review_v2_review_feedback_routing_fixture";
const fixtureRef = "reports/runtime_to_review_v2/r2r_v2_review_feedback_routing_min_fixture_20260615.json";
const trial002DecisionRef = "reports/runtime_to_review_v2/r2r_v2_trial_002_lantern_ecommerce_hero_review_decision_accepted_candidate_20260609.json";
const trial002CriteriaRef = "reports/runtime_to_review_v2/r2r_v2_trial_002_lantern_ecommerce_hero_review_criteria_no_execute_20260608.json";
const visualRubricRef = "docs/VISUAL_EVAL_RUBRIC.md";
const currentStateRef = "CURRENT_STATE.md";
const promptRef = "prompts/image_generation/product_lifestyle_premium_portable_led_camping_lantern_v2.yaml";

let passed = true;
const results = [];

function repoPath(relativePath) {
  const resolved = path.resolve(root, relativePath);
  const relative = path.relative(root, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`path escapes repo root: ${relativePath}`);
  }
  return resolved;
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(repoPath(relativePath), "utf8"));
}

function readText(relativePath) {
  return fs.readFileSync(repoPath(relativePath), "utf8");
}

function runNodeCheck(relativePath) {
  childProcess.execFileSync(process.execPath, ["--check", relativePath], {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  return true;
}

function allFalse(flags) {
  return flags && Object.values(flags).every((value) => value === false);
}

function check(id, fn) {
  try {
    const ok = fn();
    results.push({ check: id, passed: Boolean(ok) });
    if (!ok) passed = false;
  } catch (error) {
    results.push({ check: id, passed: false, error: error.message });
    passed = false;
  }
}

function main() {
  const fixture = readJson(fixtureRef);
  const decision = readJson(trial002DecisionRef);
  const criteria = readJson(trial002CriteriaRef);
  const rubric = readText(visualRubricRef);
  const currentState = readText(currentStateRef);
  const prompt = readText(promptRef);
  const cases = fixture.routing_cases || [];
  const acceptedCase = cases.find((item) => item.case_id === "trial_002_accepted_candidate_watch_items_to_next_prompt");
  const rejectedCase = cases.find((item) => item.case_id === "synthetic_rejected_identity_drift_to_shot_reset");
  const patchCase = cases.find((item) => item.case_id === "synthetic_patch_material_or_composition_to_prompt_patch");

  check("syntax_clean", () =>
    runNodeCheck("scripts/validate_runtime_to_review_v2_review_feedback_routing_fixture.js")
  );
  check("fixture_schema_and_identity", () =>
    fixture.schema === "runtime_to_review_v2_review_feedback_routing_fixture.v1" &&
    fixture.fixture_id === "r2r_v2_review_feedback_routing_min_fixture_20260615" &&
    fixture.status === "prepared_metadata_only_green_fixture" &&
    fixture.routing_policy.metadata_only === true &&
    fixture.routing_policy.next_prompt_or_shot_decision_required_before_new_live_probe === true
  );
  check("source_refs_exist_and_align", () =>
    fixture.source_refs.visual_eval_rubric_ref === visualRubricRef &&
    fixture.source_refs.current_state_ref === currentStateRef &&
    fixture.source_refs.trial_002_review_decision_ref === trial002DecisionRef &&
    fixture.source_refs.trial_002_review_criteria_ref === trial002CriteriaRef &&
    fixture.source_refs.trial_002_prompt_package_ref === promptRef &&
    fs.existsSync(repoPath(visualRubricRef)) &&
    fs.existsSync(repoPath(currentStateRef)) &&
    fs.existsSync(repoPath(trial002DecisionRef)) &&
    fs.existsSync(repoPath(trial002CriteriaRef)) &&
    fs.existsSync(repoPath(promptRef))
  );
  check("current_state_names_feedback_routing_priority", () =>
    currentState.includes("make accepted/rejected samples affect the next prompt or shot decision") &&
    currentState.includes("Turn `docs/VISUAL_EVAL_RUBRIC.md` into a minimum repeatable eval fixture set")
  );
  check("visual_rubric_dimensions_are_real", () => {
    const dimensions = new Set(cases.flatMap((item) => item.rubric_dimensions_used || []));
    return dimensions.size >= 9 &&
      [...dimensions].every((dimension) => rubric.includes(`### \`${dimension}\``));
  });
  check("tracked_accepted_case_matches_trial_002_review_decision", () =>
    acceptedCase &&
    acceptedCase.source_type === "tracked_review_decision" &&
    acceptedCase.source_decision_ref === trial002DecisionRef &&
    acceptedCase.review_decision === decision.decision &&
    acceptedCase.review_decision === "accepted_candidate" &&
    acceptedCase.commercial_delivery_ready === decision.commercial_delivery_ready &&
    acceptedCase.commercial_delivery_ready === false &&
    criteria.trial_id === decision.trial_id &&
    prompt.includes("premium portable LED camping lantern")
  );
  check("accepted_watch_items_become_prompt_or_shot_delta", () => {
    const carry = acceptedCase.next_route.review_watch_items_carried_forward.join("\n");
    const tighten = acceptedCase.next_route.prompt_delta.tighten.join("\n");
    const preserve = acceptedCase.next_route.prompt_delta.preserve.join("\n");
    return acceptedCase.next_route.route_action === "continue_same_product_family_with_tightened_prompt_constraints" &&
      acceptedCase.next_route.shot_decision.includes("split_strict_sku_main_image") &&
      acceptedCase.next_route.execution_allowed_now === false &&
      decision.watch_items_for_next_gate.some((item) => item.includes("cleaner background")) &&
      carry.includes("cleaner background") &&
      tighten.includes("cleaner background") &&
      tighten.includes("reduce foreground table dominance") &&
      preserve.includes("side control") &&
      preserve.includes("no readable brand text");
  });
  check("rejected_case_stops_or_switches_shot", () =>
    rejectedCase &&
    rejectedCase.review_outcome === "reject" &&
    rejectedCase.next_route.route_action === "stop_current_route_and_open_new_shot_plan" &&
    rejectedCase.next_route.shot_decision === "reset_shot_plan_before_any_new_provider_run" &&
    rejectedCase.next_route.execution_allowed_now === false &&
    rejectedCase.next_route.prompt_delta.tighten.includes("rewrite subject identity before retry") &&
    rejectedCase.next_route.prompt_delta.avoid.includes("reusing the rejected shot as an accepted-sample seed")
  );
  check("patch_case_requires_prompt_patch_not_route_reset", () =>
    patchCase &&
    patchCase.review_outcome === "patch" &&
    patchCase.next_route.route_action === "patch_prompt_constraints_without_opening_new_product_route" &&
    patchCase.next_route.shot_decision === "keep_product_route_change_prompt_and_review_criteria" &&
    patchCase.next_route.execution_allowed_now === false &&
    patchCase.next_route.prompt_delta.tighten.includes("make material character explicit") &&
    patchCase.next_route.prompt_delta.avoid.includes("new provider run before prompt patch preview is reviewed")
  );
  check("aggregate_proves_non_noop_routing", () =>
    fixture.aggregate.case_count === cases.length &&
    fixture.aggregate.tracked_accepted_case_count === 1 &&
    fixture.aggregate.synthetic_negative_case_count === 2 &&
    fixture.aggregate.accepted_routes_change_prompt_or_shot === true &&
    fixture.aggregate.rejected_routes_stop_or_switch_shot === true &&
    fixture.aggregate.patch_routes_require_prompt_patch === true &&
    fixture.aggregate.no_case_allows_execution_now === true &&
    fixture.aggregate.no_case_allows_memory_or_production_now === true
  );
  check("all_runtime_and_write_side_effects_false", () =>
    allFalse(fixture.side_effect_flags) &&
    fixture.routing_policy.provider_execution_allowed_now === false &&
    fixture.routing_policy.image_generation_allowed_now === false &&
    fixture.routing_policy.accepted_samples_write_allowed_now === false &&
    fixture.routing_policy.production_candidate_write_allowed_now === false &&
    fixture.routing_policy.memory_write_allowed_now === false &&
    fixture.routing_policy.daily_note_write_allowed_now === false
  );
  check("recommended_next_is_prompt_patch_preview", () =>
    fixture.recommended_next === "draft_next_prompt_patch_preview_from_review_feedback_routing_before_any_new_live_probe"
  );

  const output = {
    passed,
    validator,
    fixture_ref: fixtureRef,
    case_count: cases.length,
    accepted_case_route_action: acceptedCase?.next_route?.route_action,
    rejected_case_route_action: rejectedCase?.next_route?.route_action,
    patch_case_route_action: patchCase?.next_route?.route_action,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    output_write_performed: false,
    accepted_samples_write_performed: false,
    production_candidate_write_performed: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false,
    check_count: results.length,
    failed_count: results.filter((result) => !result.passed).length,
    results,
  };
  process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
  if (!passed) process.exitCode = 1;
}

main();
