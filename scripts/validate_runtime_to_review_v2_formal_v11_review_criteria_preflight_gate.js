#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const validator = "runtime_to_review_v2_formal_v11_review_criteria_preflight_gate";
const gateRef = "reports/runtime_to_review_v2/r2r_v2_formal_v11_review_criteria_preflight_gate_20260616.json";
const promptRef = "prompts/image_generation/product_lifestyle_premium_portable_led_camping_lantern_v11.yaml";
const sourceCriteriaRef = "reports/runtime_to_review_v2/r2r_v2_trial_002_lantern_ecommerce_hero_review_criteria_no_execute_20260608.json";
const reviewDecisionRef = "reports/runtime_to_review_v2/r2r_v2_trial_002_lantern_ecommerce_hero_review_decision_accepted_candidate_20260609.json";
const previewRef = "reports/runtime_to_review_v2/r2r_v2_review_feedback_prompt_patch_preview_20260616.json";
const selectionRef = "reports/runtime_to_review_v2/r2r_v2_review_feedback_fresh_prompt_target_selection_20260616.json";
const visualEvalRef = "reports/runtime_to_review_v2/r2r_v2_visual_eval_min_repeatable_fixture_set_20260616.json";
const routingRef = "reports/runtime_to_review_v2/r2r_v2_review_feedback_routing_min_fixture_20260615.json";

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

function readText(relativePath) {
  return fs.readFileSync(repoPath(relativePath), "utf8");
}

function readJson(relativePath) {
  return JSON.parse(readText(relativePath));
}

function runNodeCheck(relativePath) {
  childProcess.execFileSync(process.execPath, ["--check", relativePath], {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  return true;
}

function runValidator(relativePath) {
  childProcess.execFileSync(process.execPath, [relativePath], {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  return true;
}

function includesAllText(text, tokens) {
  return tokens.every((token) => text.includes(token));
}

function includesAllArray(values, tokens) {
  const text = (values || []).join("\n");
  return includesAllText(text, tokens);
}

function allFalse(flags) {
  return flags && Object.values(flags).every((value) => value === false);
}

function weightTotal(rubric) {
  return Object.values(rubric || {}).reduce((sum, item) => sum + Number(item.weight || 0), 0);
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
  const gate = readJson(gateRef);
  const prompt = readText(promptRef);
  const sourceCriteria = readJson(sourceCriteriaRef);
  const reviewDecision = readJson(reviewDecisionRef);
  const preview = readJson(previewRef);
  const selection = readJson(selectionRef);
  const visualEval = readJson(visualEvalRef);
  const routing = readJson(routingRef);
  const currentState = readText("CURRENT_STATE.md");
  const roadmap = readText("docs/RUNTIME_TO_PRODUCTION_LANDING_ROADMAP.md");

  check("syntax_clean", () =>
    runNodeCheck("scripts/validate_runtime_to_review_v2_formal_v11_review_criteria_preflight_gate.js")
  );
  check("formal_v11_prompt_package_validator_passes", () =>
    runValidator("scripts/validate_runtime_to_review_v2_formal_v11_prompt_package.js")
  );
  check("gate_schema_identity_and_status", () =>
    gate.schema === "runtime_to_review_v2_formal_v11_review_criteria_preflight_gate.v1" &&
    gate.gate_id === "r2r_v2_formal_v11_review_criteria_preflight_gate_20260616" &&
    gate.status === "prepared_no_provider_review_criteria_preflight_gate"
  );
  check("source_refs_exist_and_align", () =>
    gate.source_refs.formal_v11_prompt_package_ref === promptRef &&
    gate.source_refs.source_review_criteria_ref === sourceCriteriaRef &&
    gate.source_refs.source_review_decision_ref === reviewDecisionRef &&
    gate.source_refs.prompt_patch_preview_ref === previewRef &&
    gate.source_refs.fresh_prompt_target_selection_ref === selectionRef &&
    gate.source_refs.visual_eval_min_repeatable_fixture_ref === visualEvalRef &&
    gate.source_refs.feedback_routing_fixture_ref === routingRef &&
    fs.existsSync(repoPath(promptRef)) &&
    fs.existsSync(repoPath(sourceCriteriaRef)) &&
    fs.existsSync(repoPath(reviewDecisionRef)) &&
    fs.existsSync(repoPath(previewRef)) &&
    fs.existsSync(repoPath(selectionRef)) &&
    fs.existsSync(repoPath(visualEvalRef)) &&
    fs.existsSync(repoPath(routingRef))
  );
  check("target_prompt_package_matches_formal_v11", () =>
    gate.target_prompt_package.path === promptRef &&
    gate.target_prompt_package.package_id === "product_lifestyle_premium_portable_led_camping_lantern_v11" &&
    gate.target_prompt_package.version === "v11" &&
    gate.target_prompt_package.existing_v3_overwrite_allowed === false &&
    prompt.includes("package_id: product_lifestyle_premium_portable_led_camping_lantern_v11") &&
    prompt.includes("version: v11") &&
    prompt.includes("scene_route_policy: keep wider scene hero route separate")
  );
  check("lineage_matches_trial_002_feedback_chain", () =>
    sourceCriteria.schema === "runtime_to_review_v2_review_criteria_no_execute.v1" &&
    sourceCriteria.prompt_package_ref === "prompts/image_generation/product_lifestyle_premium_portable_led_camping_lantern_v2.yaml" &&
    reviewDecision.decision === "accepted_candidate" &&
    reviewDecision.commercial_delivery_ready === false &&
    preview.decision_context.review_outcome === "pass_with_warnings" &&
    selection.future_prompt_package_contract.future_prompt_package_ref === promptRef &&
    visualEval.aggregate.core_outcomes_covered.includes("pass") &&
    routing.routing_cases.some((item) => item.case_id === "trial_002_accepted_candidate_watch_items_to_next_prompt")
  );
  check("minimum_acceptance_bar_carries_formal_v11_criteria", () =>
    gate.minimum_acceptance_bar.selected_product_correct === true &&
    gate.minimum_acceptance_bar.strict_ecommerce_sku_main_image_direction_present === true &&
    gate.minimum_acceptance_bar.product_dominance_72_to_82_percent === true &&
    gate.minimum_acceptance_bar.cleaner_background_less_scene_detail === true &&
    gate.minimum_acceptance_bar.scene_hero_route_not_overwritten === true &&
    gate.minimum_acceptance_bar.foreground_surface_secondary === true &&
    gate.minimum_acceptance_bar.surface_reflection_not_main_subject === true &&
    gate.minimum_acceptance_bar.lower_body_detail_readable === true &&
    gate.minimum_acceptance_bar.side_control_knob_visible === true &&
    gate.minimum_acceptance_bar.handle_geometry_attached_and_plausible === true
  );
  check("scoring_rubric_is_complete_and_weighted", () =>
    Math.abs(weightTotal(gate.scoring_rubric) - 1) < 0.000001 &&
    Object.keys(gate.scoring_rubric).length === 5 &&
    Object.values(gate.scoring_rubric).every((item) => Array.isArray(item.pass_if) && item.pass_if.length >= 3)
  );
  check("watch_items_match_formal_v11_prompt", () =>
    includesAllArray(gate.watch_items_from_formal_v11, [
      "cleaner background",
      "foreground surface",
      "surface reflection",
      "lower body detail",
      "side control knob",
      "attached handle geometry",
      "wide scene hero route",
      "no readable brand text",
    ]) &&
    includesAllText(prompt, [
      "cleaner background",
      "foreground_surface_secondary: true",
      "surface_reflection_not_main_subject: true",
      "lower_body_detail_readable: true",
      "side_control_knob_visible: true",
      "handle_geometry_attached_and_plausible: true",
    ])
  );
  check("review_decision_contract_stays_metadata_only", () =>
    gate.review_decision_contract.allowed_review_outcomes.join(",") === "pass,patch,reject" &&
    gate.review_decision_contract.production_promotion_allowed_by_this_gate === false &&
    gate.review_decision_contract.memory_write_allowed_by_this_gate === false &&
    gate.review_decision_contract.route_actions.pass === "create_metadata_only_accept_sample_draft_candidate_after_human_review" &&
    gate.review_decision_contract.route_actions.patch === "patch_prompt_or_review_criteria_without_opening_production" &&
    gate.review_decision_contract.route_actions.reject === "stop_current_v11_route_or_open_new_shot_plan"
  );
  check("pre_live_probe_gate_requires_separate_exact_authorization", () =>
    gate.pre_live_probe_gate.live_probe_allowed_now === false &&
    gate.pre_live_probe_gate.separate_exact_live_authorization_required === true &&
    gate.pre_live_probe_gate.required_future_exact_phrase === "RUNTIME_TO_REVIEW_V1_ONE_PROVIDER_ONE_IMAGE" &&
    gate.pre_live_probe_gate.required_prompt_package_ref === promptRef &&
    gate.pre_live_probe_gate.required_review_criteria_gate_ref === gateRef &&
    gate.pre_live_probe_gate.required_owner_vcptoolbox_root === "explicit_owner_provided_root_only" &&
    gate.pre_live_probe_gate.max_provider_calls === 1 &&
    gate.pre_live_probe_gate.max_plugin_calls === 1 &&
    gate.pre_live_probe_gate.max_api_calls === 1 &&
    gate.pre_live_probe_gate.max_image_candidates === 1 &&
    gate.pre_live_probe_gate.secret_value_read_allowed === false &&
    gate.pre_live_probe_gate.raw_private_data_print_allowed === false
  );
  check("stop_conditions_block_red_lane_expansion", () =>
    includesAllArray(gate.pre_live_probe_gate.stop_conditions, [
      "missing explicit owner-provided VCPToolBox root",
      "wrong exact phrase",
      "provider/plugin/API/image budget above one",
      "read secret/env/config raw values",
      "accepted_samples, production, archive, DailyNote, or VCP memory",
      "validation failure requiring non-obvious judgment",
    ])
  );
  check("current_state_and_roadmap_name_gate", () =>
    currentState.includes("review_feedback_formal_v11_review_criteria_preflight_gate") &&
    currentState.includes(gateRef) &&
    currentState.includes("formal v11 review criteria/preflight gate now carries the v11 watch items") &&
    roadmap.includes("runtime_to_review_v2_formal_v11_review_criteria_preflight_gate") &&
    roadmap.includes(gateRef) &&
    roadmap.includes("live probe 仍需 separate exact authorization")
  );
  check("side_effect_flags_all_false", () => allFalse(gate.side_effect_flags));
  check("recommended_next_waits_for_exact_live_authorization", () =>
    gate.recommended_next === "review_formal_v11_criteria_preflight_then_wait_for_separate_exact_live_probe_authorization"
  );

  const output = {
    passed,
    validator,
    gate_ref: gateRef,
    formal_v11_prompt_package_ref: promptRef,
    source_review_criteria_ref: sourceCriteriaRef,
    live_probe_allowed_now: false,
    separate_exact_live_authorization_required: true,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    output_write_performed: false,
    image_binary_read_performed: false,
    accepted_samples_write_performed: false,
    production_candidate_write_performed: false,
    archive_write_performed: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false,
    secret_value_read_performed: false,
    check_count: results.length,
    failed_count: results.filter((result) => !result.passed).length,
    results,
  };

  process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
  if (!passed) process.exitCode = 1;
}

main();
