#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const validator = "runtime_to_review_v2_visual_eval_min_repeatable_fixture_set";
const fixtureRef = "reports/runtime_to_review_v2/r2r_v2_visual_eval_min_repeatable_fixture_set_20260616.json";
const routingRef = "reports/runtime_to_review_v2/r2r_v2_review_feedback_routing_min_fixture_20260615.json";
const decisionRef = "reports/runtime_to_review_v2/r2r_v2_trial_002_lantern_ecommerce_hero_review_decision_accepted_candidate_20260609.json";
const criteriaRef = "reports/runtime_to_review_v2/r2r_v2_trial_002_lantern_ecommerce_hero_review_criteria_no_execute_20260608.json";
const rubricRef = "docs/VISUAL_EVAL_RUBRIC.md";
const currentStateRef = "CURRENT_STATE.md";

const requiredDimensions = [
  "subject_integrity",
  "composition",
  "lighting",
  "material_realism",
  "commercial_usability",
  "brand_or_style_fit",
  "ai_artifact_risk",
  "production_readiness",
  "memory_suitability",
];
const requiredOutcomes = ["pass", "patch", "reject"];
const requiredNoteFields = [
  "summary",
  "positive_reasons",
  "watch_items",
  "failure_tags",
  "archive_or_next_step_action",
];

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

function allFalseExceptMetadata(flags) {
  return flags &&
    Object.entries(flags).every(([key, value]) => key === "metadata_only" ? value === true : value === false);
}

function sameSet(values, expected) {
  const valueSet = new Set(values || []);
  return expected.length === valueSet.size && expected.every((item) => valueSet.has(item));
}

function hasRequiredNotes(reviewCase) {
  const notes = reviewCase.required_notes || {};
  return requiredNoteFields.every((field) => {
    if (Array.isArray(notes[field])) return notes[field].length >= 0;
    return typeof notes[field] === "string" && notes[field].length > 0;
  });
}

function scoreValues(reviewCase) {
  return Object.values(reviewCase.dimension_scores || {}).map((entry) => entry.score);
}

function scoresAreValid(reviewCase, min, max) {
  const dimensionKeys = Object.keys(reviewCase.dimension_scores || {});
  return sameSet(dimensionKeys, requiredDimensions) &&
    Object.values(reviewCase.dimension_scores || {}).every((entry) =>
      Number.isInteger(entry.score) &&
      entry.score >= min &&
      entry.score <= max &&
      typeof entry.rationale === "string" &&
      entry.rationale.length > 0
    );
}

function main() {
  const fixture = readJson(fixtureRef);
  const routing = readJson(routingRef);
  const decision = readJson(decisionRef);
  const criteria = readJson(criteriaRef);
  const rubric = readText(rubricRef);
  const currentState = readText(currentStateRef);
  const cases = fixture.cases || [];
  const caseByOutcome = Object.fromEntries(cases.map((item) => [item.core_outcome, item]));
  const routingById = Object.fromEntries((routing.routing_cases || []).map((item) => [item.case_id, item]));
  const passCase = caseByOutcome.pass;
  const patchCase = caseByOutcome.patch;
  const rejectCase = caseByOutcome.reject;

  check("syntax_clean", () =>
    runNodeCheck("scripts/validate_runtime_to_review_v2_visual_eval_min_repeatable_fixture_set.js")
  );
  check("fixture_schema_identity_and_policy", () =>
    fixture.schema === "runtime_to_review_v2_visual_eval_min_repeatable_fixture_set.v1" &&
    fixture.fixture_id === "r2r_v2_visual_eval_min_repeatable_fixture_set_20260616" &&
    fixture.status === "prepared_metadata_only_green_fixture_set" &&
    fixture.fixture_policy.metadata_only === true &&
    fixture.fixture_policy.provider_execution_allowed_now === false &&
    fixture.fixture_policy.image_generation_allowed_now === false &&
    fixture.fixture_policy.live_probe_allowed_now === false
  );
  check("source_refs_exist_and_align", () =>
    fixture.source_refs.visual_eval_rubric_ref === rubricRef &&
    fixture.source_refs.current_state_ref === currentStateRef &&
    fixture.source_refs.review_feedback_routing_fixture_ref === routingRef &&
    fixture.source_refs.trial_002_review_decision_ref === decisionRef &&
    fixture.source_refs.trial_002_review_criteria_ref === criteriaRef &&
    fs.existsSync(repoPath(rubricRef)) &&
    fs.existsSync(repoPath(currentStateRef)) &&
    fs.existsSync(repoPath(routingRef)) &&
    fs.existsSync(repoPath(decisionRef)) &&
    fs.existsSync(repoPath(criteriaRef))
  );
  check("rubric_dimensions_match_document", () =>
    sameSet(fixture.rubric_dimensions, requiredDimensions) &&
    requiredDimensions.every((dimension) => rubric.includes(`### \`${dimension}\``))
  );
  check("score_policy_covers_core_outcomes_and_notes", () =>
    fixture.score_policy.score_min === 0 &&
    fixture.score_policy.score_max === 5 &&
    fixture.score_policy.pass_with_warnings_allowed_as_decision_note === true &&
    sameSet(fixture.score_policy.core_outcomes, requiredOutcomes) &&
    sameSet(fixture.score_policy.notes_required, requiredNoteFields)
  );
  check("case_set_covers_pass_patch_reject_once", () =>
    cases.length === 3 &&
    sameSet(cases.map((item) => item.core_outcome), requiredOutcomes) &&
    fixture.aggregate.case_count === cases.length &&
    sameSet(fixture.aggregate.core_outcomes_covered, requiredOutcomes)
  );
  check("all_cases_have_valid_scores_and_required_notes", () =>
    cases.every((item) =>
      scoresAreValid(item, fixture.score_policy.score_min, fixture.score_policy.score_max) &&
      hasRequiredNotes(item) &&
      item.commercial_delivery_ready === false &&
      item.routing_alignment.execution_allowed_now === false &&
      item.routing_alignment.memory_or_production_allowed_now === false
    ) &&
    fixture.aggregate.all_rubric_dimensions_covered_per_case === true &&
    fixture.aggregate.all_cases_have_required_notes === true
  );
  check("pass_case_maps_tracked_trial_002_review_to_watch_items", () => {
    const scores = scoreValues(passCase);
    const highScoreCount = scores.filter((score) => score >= 4).length;
    const passRouting = routingById[passCase.source_routing_case_id];
    return passCase.source_type === "tracked_review_decision" &&
      passCase.source_decision_ref === decisionRef &&
      decision.decision === "accepted_candidate" &&
      criteria.trial_id === decision.trial_id &&
      passCase.decision_note === "pass_with_warnings" &&
      passCase.routing_alignment.expected_route_action === passRouting.next_route.route_action &&
      passCase.routing_alignment.expected_shot_decision === passRouting.next_route.shot_decision &&
      Math.min(...scores) >= 3 &&
      highScoreCount >= 8 &&
      passCase.required_notes.watch_items.some((item) => item.includes("cleaner background")) &&
      decision.watch_items_for_next_gate.some((item) => item.includes("cleaner background")) &&
      fixture.aggregate.pass_case_carries_watch_items_forward === true;
  });
  check("patch_case_uses_borderline_scores_and_keeps_route_alive", () => {
    const scores = scoreValues(patchCase);
    const patchRouting = routingById[patchCase.source_routing_case_id];
    return patchCase.source_type === "synthetic_patch_fixture" &&
      patchCase.decision_note === "bounded_fixable_weakness" &&
      scores.some((score) => score === 3) &&
      scores.every((score) => score >= 3) &&
      patchCase.required_notes.failure_tags.includes("material_reading_borderline") &&
      patchCase.required_notes.failure_tags.includes("composition_fixable") &&
      patchCase.routing_alignment.expected_route_action === patchRouting.next_route.route_action &&
      patchCase.routing_alignment.expected_shot_decision === patchRouting.next_route.shot_decision &&
      fixture.aggregate.patch_case_keeps_route_alive_without_execution === true;
  });
  check("reject_case_uses_critical_low_scores_and_resets_route", () => {
    const scores = scoreValues(rejectCase);
    const rejectRouting = routingById[rejectCase.source_routing_case_id];
    return rejectCase.source_type === "synthetic_negative_fixture" &&
      rejectCase.decision_note === "critical_route_failure" &&
      scores.some((score) => score <= 2) &&
      rejectCase.dimension_scores.subject_integrity.score <= 2 &&
      rejectCase.dimension_scores.production_readiness.score <= 2 &&
      rejectCase.required_notes.failure_tags.includes("wrong_product_identity") &&
      rejectCase.required_notes.failure_tags.includes("brand_or_text_contamination") &&
      rejectCase.routing_alignment.expected_route_action === rejectRouting.next_route.route_action &&
      rejectCase.routing_alignment.expected_shot_decision === rejectRouting.next_route.shot_decision &&
      fixture.aggregate.reject_case_stops_or_switches_shot_before_retry === true;
  });
  check("current_state_names_min_repeatable_eval_priority", () =>
    currentState.includes("Turn `docs/VISUAL_EVAL_RUBRIC.md` into a minimum repeatable eval fixture set")
  );
  check("side_effect_flags_and_policy_are_closed", () =>
    allFalseExceptMetadata(fixture.side_effect_flags) &&
    fixture.fixture_policy.image_binary_read_allowed_now === false &&
    fixture.fixture_policy.accepted_samples_write_allowed_now === false &&
    fixture.fixture_policy.production_candidate_write_allowed_now === false &&
    fixture.fixture_policy.memory_write_allowed_now === false &&
    fixture.fixture_policy.daily_note_write_allowed_now === false &&
    fixture.aggregate.no_case_allows_execution_now === true &&
    fixture.aggregate.no_case_allows_memory_or_production_now === true
  );
  check("recommended_next_stays_pre_live_probe", () =>
    fixture.recommended_next === "use_min_repeatable_visual_eval_fixture_set_as_review_evidence_before_selecting_any_new_prompt_target_or_live_probe"
  );

  const output = {
    passed,
    validator,
    fixture_ref: fixtureRef,
    case_count: cases.length,
    outcomes: cases.map((item) => item.core_outcome),
    dimensions_per_case: requiredDimensions.length,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    image_binary_read_performed: false,
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
