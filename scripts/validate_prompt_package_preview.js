#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const phase = "v0_5_1_prompt_package_preview";
const docPath = "docs/V0_5_1_PROMPT_PACKAGE_PREVIEW.md";
const schemaPath = "schemas/prompt_package_preview.schema.yaml";
const reportPath = "reports/visual_asset_eval_dry_run/v0_5_1_prompt_package_preview.json";
const passFixturePath = "tests/schema_examples/prompt_package_preview.example.json";
const failFixturePath = "tests/schema_examples/prompt_package_preview_fail.example.json";
const promptCorrectionHintPath = "tests/schema_examples/visual_prompt_correction_hint.example.json";
const readinessPacketPath = "reports/visual_asset_eval_dry_run/v0_5_0_controlled_generation_readiness_packet.json";
const mvpPath = "scripts/validate_mvp.ps1";
const slicePath = "scripts/lib/governance_tooling_maintenance_slice.js";

const requiredPreviewFields = [
  "positive_constraints",
  "negative_constraints",
  "avoid_fragments",
  "expected_visual_change",
  "risk_notes"
];
const falseFlags = [
  "provider_call_performed",
  "image_generation_performed",
  "VCP_memory_write_performed",
  "DailyNote_write_performed",
  "runtime_call_performed",
  "secret_value_read_performed",
  "production_candidate_created",
  "accepted_sample_auto_promotion",
  "memory_seed_promoted",
  "package_dependency_change_performed",
  "commit_performed",
  "push_performed"
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function repoPath(relativePath) {
  const resolved = path.resolve(root, relativePath);
  const relative = path.relative(root, resolved);
  assert(!relative.startsWith("..") && !path.isAbsolute(relative), `Path escapes repository: ${relativePath}`);
  return resolved;
}

function read(relativePath) {
  return fs.readFileSync(repoPath(relativePath), "utf8");
}

function readJson(relativePath) {
  return JSON.parse(read(relativePath));
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function assertNoSecretOrRawPath(value, context) {
  if (typeof value === "string") {
    assert(!/^[A-Za-z]:[\\/]/.test(value), `Raw local drive path found in ${context}`);
    assert(!/\.env(\.|$)|config\.env/i.test(value), `Secret/env path reference found in ${context}`);
    assert(!value.includes("/.codex/generated_images/"), `Generated image path found in ${context}`);
    assert(!value.includes("\\.codex\\generated_images\\"), `Generated image path found in ${context}`);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => assertNoSecretOrRawPath(item, `${context}.${index}`));
    return;
  }
  if (value && typeof value === "object") {
    Object.entries(value).forEach(([key, item]) => assertNoSecretOrRawPath(item, `${context}.${key}`));
  }
}

function assertNonEmptyStringArray(value, message) {
  assert(Array.isArray(value) && value.length > 0, message);
  value.forEach((item) => assert(typeof item === "string" && item.trim().length > 0, message));
}

function assertNonEmptyString(value, message) {
  assert(typeof value === "string" && value.trim().length > 0, message);
}

function validateFalseFlags(container, context) {
  assert(container && typeof container === "object", `${context} missing`);
  for (const flag of falseFlags) {
    assert(container[flag] === false, `${context}.${flag} must remain false`);
  }
}

function sourceEvidence() {
  const hints = readJson(promptCorrectionHintPath).visual_prompt_correction_hints;
  const readiness = readJson(readinessPacketPath).controlled_generation_readiness_packet;
  assert(hints.phase === "v0_4_3_review_to_prompt_correction_hint", "source prompt correction hint phase mismatch");
  assert(Array.isArray(hints.hints) && hints.hints.length > 0, "source prompt correction hints missing");
  assert(readiness.phase === "v0_5_0_controlled_generation_readiness_packet", "source readiness packet phase mismatch");
  assert(readiness.prompt_package_preview.generation_dispatch_allowed === false, "source readiness must not dispatch generation");
  assert(readiness.max_generation_calls.actual_generation_calls === 0, "source readiness actual generation calls must remain zero");
  assert(readiness.output_policy.preview_only === true, "source readiness output policy must remain preview-only");
  assert(readiness.no_memory_by_default.enabled === true, "source readiness must keep no-memory default");
  return { hints, readiness };
}

function validatePromptPreviewRecord(record) {
  assert(record && typeof record === "object", "prompt package preview missing");
  assertNoSecretOrRawPath(record, "prompt_package_preview");
  assert(record.version === "v0_1", "version mismatch");
  assert(record.phase === phase, "phase mismatch");
  assert(record.source_prompt_correction_hint_ref === promptCorrectionHintPath, "source prompt correction hint ref mismatch");
  assert(record.source_readiness_packet_ref === readinessPacketPath, "source readiness packet ref mismatch");
  for (const field of requiredPreviewFields) {
    assert(Object.prototype.hasOwnProperty.call(record, field), `required preview field missing: ${field}`);
  }

  const { hints, readiness } = sourceEvidence();
  const sourceHint = hints.hints.find((hint) => hint.taxonomy_category_id === record.selected_taxonomy_category);
  assert(sourceHint, "selected taxonomy category must exist in correction hints");
  assert(record.selected_taxonomy_category === readiness.prompt_package_preview.selected_taxonomy_category, "selected taxonomy category must match readiness preview");

  assertNonEmptyStringArray(record.positive_constraints, "positive_constraints must be non-empty");
  assertNonEmptyStringArray(record.negative_constraints, "negative_constraints must be non-empty");
  assertNonEmptyStringArray(record.avoid_fragments, "avoid_fragments must be non-empty");
  assertNonEmptyStringArray(record.risk_notes, "risk_notes must be non-empty");
  assert(sourceHint.prompt_constraints_to_add.every((item) => record.positive_constraints.includes(item)), "positive constraints must include correction hint constraints");
  assert(record.positive_constraints.includes(sourceHint.composition_adjustment), "positive constraints must include composition adjustment");
  assert(record.positive_constraints.includes(sourceHint.material_adjustment), "positive constraints must include material adjustment");
  assert(sourceHint.prompt_fragments_to_avoid.every((item) => record.avoid_fragments.includes(item)), "avoid fragments must include correction hint avoid fragments");
  assert(record.negative_constraints.some((item) => /Do not dispatch/i.test(item)), "negative constraints must block provider dispatch");
  assert(record.negative_constraints.some((item) => /generated image/i.test(item)), "negative constraints must block generated-image claims");

  const visualChange = record.expected_visual_change;
  assert(visualChange && typeof visualChange === "object", "expected_visual_change missing");
  assertNonEmptyString(visualChange.summary, "expected visual change summary missing");
  assert(visualChange.composition_adjustment === sourceHint.composition_adjustment, "composition adjustment must match correction hint");
  assert(visualChange.lighting_adjustment === sourceHint.lighting_adjustment, "lighting adjustment must match correction hint");
  assert(visualChange.material_adjustment === sourceHint.material_adjustment, "material adjustment must match correction hint");
  assert(visualChange.output_claimed === false, "prompt preview must not claim an output exists");

  assert(record.boundaries?.metadata_only === true, "metadata_only must be true");
  assert(record.boundaries?.dry_run_only === true, "dry_run_only must be true");
  assert(record.boundaries?.prompt_preview_only === true, "prompt_preview_only must be true");
  assert(record.boundaries?.actual_generation_calls === 0, "actual generation calls must remain zero");
  assert(record.boundaries?.image_binary_read_performed === false, "image binary read must remain false");
  assert(record.boundaries?.real_executor_implemented_now === false, "real executor must not be implemented");
  assert(record.boundaries?.Push_L2_exercised === false, "Push_L2 must not be exercised");
  validateFalseFlags(record.boundaries, "boundaries");
  validateFalseFlags(record.side_effects, "side_effects");
}

function expectFailure(baseRecord, caseId, mutate) {
  const candidate = clone(baseRecord);
  mutate(candidate);
  try {
    validatePromptPreviewRecord(candidate);
  } catch (error) {
    return {
      case_id: caseId,
      result: "caught",
      failure_message: error.message
    };
  }
  throw new Error(`${caseId} was not caught`);
}

function validateNegativeCases(validRecord, invalidRecord) {
  let invalidFixtureCaught = false;
  try {
    validatePromptPreviewRecord(invalidRecord);
  } catch {
    invalidFixtureCaught = true;
  }
  assert(invalidFixtureCaught, "invalid prompt package preview fixture must fail");

  const cases = [
    expectFailure(validRecord, "missing_positive_constraints_fails", (candidate) => {
      candidate.positive_constraints = [];
    }),
    expectFailure(validRecord, "missing_negative_constraints_fails", (candidate) => {
      candidate.negative_constraints = [];
    }),
    expectFailure(validRecord, "missing_avoid_fragments_fails", (candidate) => {
      candidate.avoid_fragments = [];
    }),
    expectFailure(validRecord, "missing_expected_visual_change_fails", (candidate) => {
      delete candidate.expected_visual_change;
    }),
    expectFailure(validRecord, "expected_visual_change_output_claimed_fails", (candidate) => {
      candidate.expected_visual_change.output_claimed = true;
    }),
    expectFailure(validRecord, "missing_risk_notes_fails", (candidate) => {
      candidate.risk_notes = [];
    }),
    expectFailure(validRecord, "taxonomy_drift_fails", (candidate) => {
      candidate.selected_taxonomy_category = "lighting_failure";
    }),
    expectFailure(validRecord, "composition_adjustment_drift_fails", (candidate) => {
      candidate.expected_visual_change.composition_adjustment = "Change the composition arbitrarily.";
    }),
    expectFailure(validRecord, "actual_generation_calls_nonzero_fails", (candidate) => {
      candidate.boundaries.actual_generation_calls = 1;
    }),
    expectFailure(validRecord, "provider_call_true_fails", (candidate) => {
      candidate.side_effects.provider_call_performed = true;
    }),
    expectFailure(validRecord, "image_generation_true_fails", (candidate) => {
      candidate.side_effects.image_generation_performed = true;
    }),
    expectFailure(validRecord, "vcp_memory_write_true_fails", (candidate) => {
      candidate.side_effects.VCP_memory_write_performed = true;
    }),
    expectFailure(validRecord, "daily_note_write_true_fails", (candidate) => {
      candidate.side_effects.DailyNote_write_performed = true;
    }),
    expectFailure(validRecord, "production_candidate_true_fails", (candidate) => {
      candidate.side_effects.production_candidate_created = true;
    }),
    expectFailure(validRecord, "accepted_sample_auto_promotion_true_fails", (candidate) => {
      candidate.side_effects.accepted_sample_auto_promotion = true;
    }),
    expectFailure(validRecord, "push_l2_exercised_true_fails", (candidate) => {
      candidate.boundaries.Push_L2_exercised = true;
    }),
    expectFailure(validRecord, "raw_local_path_fails", (candidate) => {
      candidate.prompt_preview_id = "C:\\private\\prompt.txt";
    }),
    expectFailure(validRecord, "secret_env_path_fails", (candidate) => {
      candidate.prompt_preview_id = ".env.local";
    })
  ];

  return {
    invalid_fixture_failure_caught: invalidFixtureCaught,
    negative_case_count: cases.length,
    caught_negative_case_count: cases.filter((item) => item.result === "caught").length,
    all_negative_cases_caught: cases.every((item) => item.result === "caught"),
    positive_constraints_caught: cases.some((item) => item.case_id === "missing_positive_constraints_fails" && item.result === "caught"),
    negative_constraints_caught: cases.some((item) => item.case_id === "missing_negative_constraints_fails" && item.result === "caught"),
    avoid_fragments_caught: cases.some((item) => item.case_id === "missing_avoid_fragments_fails" && item.result === "caught"),
    expected_visual_change_caught: cases.some((item) => item.case_id === "missing_expected_visual_change_fails" && item.result === "caught"),
    risk_notes_caught: cases.some((item) => item.case_id === "missing_risk_notes_fails" && item.result === "caught"),
    taxonomy_drift_caught: cases.some((item) => item.case_id === "taxonomy_drift_fails" && item.result === "caught"),
    actual_generation_call_caught: cases.some((item) => item.case_id === "actual_generation_calls_nonzero_fails" && item.result === "caught"),
    provider_call_caught: cases.some((item) => item.case_id === "provider_call_true_fails" && item.result === "caught"),
    image_generation_caught: cases.some((item) => item.case_id === "image_generation_true_fails" && item.result === "caught"),
    memory_write_caught: cases.some((item) => item.case_id === "vcp_memory_write_true_fails" && item.result === "caught"),
    raw_local_path_caught: cases.some((item) => item.case_id === "raw_local_path_fails" && item.result === "caught")
  };
}

function main() {
  const doc = read(docPath);
  const schema = read(schemaPath);
  const mvp = read(mvpPath);
  const slice = read(slicePath);
  const reportRecord = readJson(reportPath).prompt_package_preview;
  const validRecord = readJson(passFixturePath).prompt_package_preview;
  const invalidRecord = readJson(failFixturePath).prompt_package_preview;

  assert(doc.includes("positive_constraints"), "doc must mention positive_constraints");
  assert(doc.includes("negative_constraints"), "doc must mention negative_constraints");
  assert(doc.includes("avoid_fragments"), "doc must mention avoid_fragments");
  assert(doc.includes("expected_visual_change"), "doc must mention expected_visual_change");
  assert(doc.includes("risk_notes"), "doc must mention risk_notes");
  assert(schema.includes("prompt_package_preview"), "schema must define prompt package preview");
  assert(mvp.includes("validate_prompt_package_preview.js"), "MVP validator wiring missing");
  assert(slice.includes("EXPECTED_V0_5_1_PROMPT_PACKAGE_PREVIEW_SLICE"), "exact-slice wiring missing");

  validatePromptPreviewRecord(reportRecord);
  validatePromptPreviewRecord(validRecord);
  const negativeCaseSummary = validateNegativeCases(validRecord, invalidRecord);

  const output = {
    passed: true,
    validator: "validate_prompt_package_preview",
    phase,
    prompt_preview_doc_present: true,
    prompt_preview_schema_present: true,
    prompt_preview_report_present: true,
    prompt_preview_fixture_present: true,
    prompt_preview_fail_fixture_present: true,
    source_prompt_correction_hint_verified: true,
    source_readiness_packet_verified: true,
    positive_constraints_present: true,
    negative_constraints_present: true,
    avoid_fragments_present: true,
    expected_visual_change_present: true,
    risk_notes_present: true,
    correction_hint_constraints_reused: true,
    readiness_taxonomy_bound: true,
    output_claimed: false,
    actual_generation_calls: 0,
    invalid_fixture_failure_caught: negativeCaseSummary.invalid_fixture_failure_caught,
    negative_case_count: negativeCaseSummary.negative_case_count,
    caught_negative_case_count: negativeCaseSummary.caught_negative_case_count,
    all_negative_cases_caught: negativeCaseSummary.all_negative_cases_caught,
    positive_constraints_caught: negativeCaseSummary.positive_constraints_caught,
    negative_constraints_caught: negativeCaseSummary.negative_constraints_caught,
    avoid_fragments_caught: negativeCaseSummary.avoid_fragments_caught,
    expected_visual_change_caught: negativeCaseSummary.expected_visual_change_caught,
    risk_notes_caught: negativeCaseSummary.risk_notes_caught,
    taxonomy_drift_caught: negativeCaseSummary.taxonomy_drift_caught,
    actual_generation_call_caught: negativeCaseSummary.actual_generation_call_caught,
    provider_call_caught: negativeCaseSummary.provider_call_caught,
    image_generation_caught: negativeCaseSummary.image_generation_caught,
    memory_write_caught: negativeCaseSummary.memory_write_caught,
    raw_local_path_caught: negativeCaseSummary.raw_local_path_caught,
    metadata_only: true,
    dry_run_only: true,
    prompt_preview_only: true,
    image_binary_read_performed: false,
    Push_L2_exercised: false,
    real_executor_implemented_now: false,
    provider_call_performed: false,
    image_generation_performed: false,
    VCP_memory_write_performed: false,
    DailyNote_write_performed: false,
    runtime_call_performed: false,
    secret_value_read_performed: false,
    production_candidate_created: false,
    accepted_sample_auto_promotion: false,
    memory_seed_promoted: false,
    package_dependency_change_performed: false,
    commit_performed: false,
    push_performed: false
  };
  console.log(JSON.stringify(output, null, 2));
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
