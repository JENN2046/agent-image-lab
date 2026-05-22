#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const phase = "v0_3_7d_visual_asset_eval_v0_1_gate";
const docPath = "docs/VISUAL_ASSET_EVAL_V0_1.md";
const schemaPath = "schemas/visual_asset_review_report.schema.yaml";
const fixturePath = "tests/schema_examples/visual_asset_review_report.example.json";
const mvpPath = "scripts/validate_mvp.ps1";
const slicePath = "scripts/lib/governance_tooling_maintenance_slice.js";

const requiredDimensions = [
  "composition",
  "lighting",
  "material_realism",
  "product_fidelity",
  "commercial_fitness",
  "AI_artifact_risk",
  "memory_suitability"
];

const requiredQuestionKeys = [
  "why_did_it_pass",
  "why_was_it_rejected",
  "failed_dimension",
  "commercial_use_suitability",
  "accepted_sample_eligibility",
  "memory_seed_eligibility"
];

const falseBoundaryFlags = [
  "image_binary_included",
  "raw_local_path_included",
  "image_binary_read_performed",
  "provider_call_performed",
  "image_generation_performed",
  "DailyNote_write_performed",
  "VCP_memory_write_performed",
  "runtime_call_performed",
  "secret_value_read_performed",
  "accepted_sample_created",
  "memory_seed_created",
  "production_candidate_created",
  "push_performed"
];

const verdicts = new Set(["pass", "watch", "fail"]);
const outcomes = new Set(["pass", "reject", "needs_revision"]);
const commercialSuitability = new Set(["suitable", "needs_revision", "not_suitable"]);

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

function assertNonEmptyString(value, message) {
  assert(typeof value === "string" && value.trim().length > 0, message);
}

function validateNoRawOrBinaryPath(value, context) {
  if (typeof value === "string") {
    assert(!/^[A-Za-z]:[\\/]/.test(value), `Raw local drive path found in ${context}`);
    assert(!/\.env(\.|$)|config\.env/i.test(value), `Secret/env path reference found in ${context}`);
    assert(!/\.(png|jpe?g|gif|webp|psd|tiff?)$/i.test(value), `Image binary path found in ${context}`);
    assert(!value.includes("/.codex/generated_images/"), `Codex generated image path found in ${context}`);
    assert(!value.includes("\\.codex\\generated_images\\"), `Codex generated image path found in ${context}`);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => validateNoRawOrBinaryPath(item, `${context}.${index}`));
    return;
  }
  if (value && typeof value === "object") {
    Object.entries(value).forEach(([key, item]) => validateNoRawOrBinaryPath(item, `${context}.${key}`));
  }
}

function validateDimension(name, value) {
  assert(value && typeof value === "object", `Missing dimension object: ${name}`);
  assert(Number.isInteger(value.score) && value.score >= 0 && value.score <= 5, `Dimension score out of range: ${name}`);
  assert(verdicts.has(value.verdict), `Dimension verdict invalid: ${name}`);
  assertNonEmptyString(value.rationale, `Dimension rationale missing: ${name}`);
}

function validateReport(report) {
  validateNoRawOrBinaryPath(report, "visual_asset_review_report");
  assert(report.report_version === "v0_1", "report_version must be v0_1");
  assert(report.phase === phase, "phase mismatch");
  assert(report.asset_ref?.image_binary_included === false, "asset_ref must not include image binary");
  assert(report.asset_ref?.raw_local_path_included === false, "asset_ref must not include raw local path");
  assert(report.asset_ref?.asset_path_redacted === true, "asset path must be redacted");

  assert(report.evaluation_dimensions && typeof report.evaluation_dimensions === "object", "evaluation_dimensions missing");
  for (const dimension of requiredDimensions) {
    validateDimension(dimension, report.evaluation_dimensions[dimension]);
  }

  const decision = report.decision;
  assert(decision && typeof decision === "object", "decision missing");
  assert(outcomes.has(decision.review_outcome), "review_outcome invalid");
  assert(commercialSuitability.has(decision.commercial_use_suitability), "commercial_use_suitability invalid");
  assert(Array.isArray(decision.pass_reason_codes), "pass_reason_codes must be an array");
  assert(Array.isArray(decision.rejection_reason_codes), "rejection_reason_codes must be an array");
  if (decision.review_outcome === "pass") {
    assert(decision.pass_reason_codes.length > 0, "pass outcome requires pass reasons");
  } else {
    assert(decision.rejection_reason_codes.length > 0, "reject/needs_revision requires rejection reasons");
    assert(requiredDimensions.includes(decision.primary_failure_dimension), "reject/needs_revision requires primary failure dimension");
  }

  for (const key of requiredQuestionKeys) {
    assert(Object.prototype.hasOwnProperty.call(report.required_questions, key), `required question missing: ${key}`);
    if (key !== "failed_dimension") {
      assertNonEmptyString(report.required_questions[key], `required question answer missing: ${key}`);
    }
  }

  const promotions = report.promotion_recommendations;
  assert(promotions.accepted_sample.accepted_sample === false, "accepted_sample field flip is forbidden");
  assert(promotions.accepted_sample.actual_accepted_sample_created === false, "accepted_sample creation is forbidden");
  assert(promotions.accepted_sample.human_accepted === false, "human_accepted must remain false in v0.1 fixture");
  assert(promotions.accepted_sample.accepted_gate_id === null, "accepted_gate_id must not be active in v0.1 fixture");
  assert(promotions.accepted_sample.requires.includes("accepted_gate_id"), "accepted_sample requires accepted_gate_id");

  assert(promotions.memory_seed.memory_seed === false, "memory_seed field flip is forbidden");
  assert(promotions.memory_seed.actual_memory_seed_created === false, "memory_seed creation is forbidden");
  assert(promotions.memory_seed.memory_gate_id === null, "memory_gate_id must not be active in v0.1 fixture");
  assert(promotions.memory_seed.memory_write_allowed_now === false, "memory_write_allowed_now must remain false");
  assert(promotions.memory_seed.requires.includes("memory_gate_id"), "memory_seed requires memory_gate_id");

  assert(promotions.production_candidate.eligible === false, "production_candidate eligibility must remain false");
  assert(promotions.production_candidate.production_candidate === false, "production_candidate field flip is forbidden");
  assert(promotions.production_candidate.actual_production_candidate_created === false, "production_candidate creation is forbidden");

  for (const flag of falseBoundaryFlags) {
    assert(report.boundary_flags[flag] === false, `boundary flag must remain false: ${flag}`);
  }
}

function expectFailure(baseReport, caseId, mutate) {
  const candidate = clone(baseReport);
  mutate(candidate);
  try {
    validateReport(candidate);
  } catch (error) {
    return {
      case_id: caseId,
      result: "caught",
      failure_message: error.message
    };
  }
  throw new Error(`${caseId} was not caught`);
}

function validateNegativeCases(report) {
  const cases = [
    expectFailure(report, "missing_required_dimension_fails", (candidate) => {
      delete candidate.evaluation_dimensions.composition;
    }),
    expectFailure(report, "dimension_score_out_of_range_fails", (candidate) => {
      candidate.evaluation_dimensions.lighting.score = 6;
    }),
    expectFailure(report, "dimension_missing_rationale_fails", (candidate) => {
      candidate.evaluation_dimensions.material_realism.rationale = "";
    }),
    expectFailure(report, "pass_without_pass_reason_fails", (candidate) => {
      candidate.decision.review_outcome = "pass";
      candidate.decision.pass_reason_codes = [];
      candidate.decision.primary_failure_dimension = null;
    }),
    expectFailure(report, "reject_without_rejection_reason_fails", (candidate) => {
      candidate.decision.rejection_reason_codes = [];
    }),
    expectFailure(report, "reject_without_primary_failure_dimension_fails", (candidate) => {
      candidate.decision.primary_failure_dimension = null;
    }),
    expectFailure(report, "accepted_sample_field_flip_fails", (candidate) => {
      candidate.promotion_recommendations.accepted_sample.accepted_sample = true;
    }),
    expectFailure(report, "memory_seed_field_flip_fails", (candidate) => {
      candidate.promotion_recommendations.memory_seed.memory_seed = true;
    }),
    expectFailure(report, "memory_seed_without_memory_gate_fails", (candidate) => {
      candidate.promotion_recommendations.memory_seed.memory_write_allowed_now = true;
    }),
    expectFailure(report, "production_candidate_field_flip_fails", (candidate) => {
      candidate.promotion_recommendations.production_candidate.production_candidate = true;
    }),
    expectFailure(report, "side_effect_flag_drift_fails", (candidate) => {
      candidate.boundary_flags.provider_call_performed = true;
    }),
    expectFailure(report, "raw_local_path_fails", (candidate) => {
      candidate.asset_ref.source_path = "C:\\Users\\617\\secret.png";
    }),
    expectFailure(report, "image_binary_path_fails", (candidate) => {
      candidate.asset_ref.image_path = "runs/real_generation/example.png";
    })
  ];

  return {
    negative_case_count: cases.length,
    caught_negative_case_count: cases.filter((item) => item.result === "caught").length,
    all_negative_cases_caught: cases.every((item) => item.result === "caught")
  };
}

function validateTextSurfaces() {
  const doc = read(docPath);
  const schema = read(schemaPath);
  const mvp = read(mvpPath);
  const slice = read(slicePath);
  const combined = `${doc}\n${schema}`;

  for (const token of [
    phase,
    "Visual Asset Eval v0.1",
    "why_did_it_pass",
    "why_was_it_rejected",
    "failed_dimension",
    "commercial_use_suitability",
    "accepted_sample_eligibility",
    "memory_seed_eligibility",
    "accepted_gate_id",
    "memory_gate_id",
    "memory_write_allowed_now",
    "production_candidate: false"
  ]) {
    assert(combined.includes(token), `visual asset eval text missing token: ${token}`);
  }
  for (const dimension of requiredDimensions) {
    assert(combined.includes(dimension), `visual asset eval missing dimension: ${dimension}`);
  }
  assert(mvp.includes("scripts/validate_visual_asset_eval_v0_1.js"), "MVP validator wiring missing");
  assert(slice.includes("v0_3_7d_visual_asset_eval_v0_1_slice"), "exact slice wiring missing");
}

function main() {
  validateTextSurfaces();
  const report = readJson(fixturePath).visual_asset_review_report;
  validateReport(report);
  const negativeCaseSummary = validateNegativeCases(report);

  const output = {
    passed: true,
    validator: "validate_visual_asset_eval_v0_1",
    phase,
    visual_asset_eval_v0_1_defined: true,
    review_report_schema_present: fs.existsSync(repoPath(schemaPath)),
    review_report_fixture_present: fs.existsSync(repoPath(fixturePath)),
    required_dimension_count: requiredDimensions.length,
    required_dimensions: requiredDimensions,
    required_questions_answered: requiredQuestionKeys.every((key) => Object.prototype.hasOwnProperty.call(report.required_questions, key)),
    pass_reject_reason_model_present: true,
    commercial_fitness_present: true,
    accepted_sample_gate_required: true,
    memory_seed_gate_required: true,
    production_candidate_blocked: true,
    negative_case_count: negativeCaseSummary.negative_case_count,
    caught_negative_case_count: negativeCaseSummary.caught_negative_case_count,
    all_negative_cases_caught: negativeCaseSummary.all_negative_cases_caught,
    image_binary_read_performed: false,
    provider_call_performed: false,
    image_generation_performed: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false,
    runtime_call_performed: false,
    secret_value_read_performed: false,
    accepted_sample_created: false,
    memory_seed_created: false,
    production_candidate_created: false,
    commit_performed: false,
    push_performed: false
  };

  process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    process.stderr.write(`${error.stack || error.message}\n`);
    process.exit(1);
  }
}

module.exports = {
  validateReport,
  validateNegativeCases
};
