#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const phase = "v0_3_7e_visual_sample_memory_policy_gate";
const docPath = "docs/VISUAL_SAMPLE_MEMORY_POLICY.md";
const acceptedSchemaPath = "schemas/accepted_sample_record.schema.yaml";
const rejectedSchemaPath = "schemas/rejected_sample_record.schema.yaml";
const acceptedFixturePath = "tests/schema_examples/accepted_sample_record.example.json";
const rejectedFixturePath = "tests/schema_examples/rejected_sample_record.example.json";
const mvpPath = "scripts/validate_mvp.ps1";
const slicePath = "scripts/lib/governance_tooling_maintenance_slice.js";

const reviewDimensions = new Set([
  "composition",
  "lighting",
  "material_realism",
  "product_fidelity",
  "commercial_fitness",
  "AI_artifact_risk",
  "memory_suitability"
]);

const falseFlags = [
  "provider_call_performed",
  "image_generation_performed",
  "DailyNote_write_performed",
  "VCP_memory_write_performed",
  "runtime_call_performed",
  "secret_value_read_performed",
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

function assertNonEmptyString(value, message) {
  assert(typeof value === "string" && value.trim().length > 0, message);
}

function assertNonEmptyArray(value, message) {
  assert(Array.isArray(value) && value.length > 0, message);
}

function validateNoRawOrBinaryPath(value, context) {
  if (typeof value === "string") {
    assert(!/^[A-Za-z]:[\\/]/.test(value), `Raw local drive path found in ${context}`);
    assert(!/\.env(\.|$)|config\.env/i.test(value), `Secret/env path reference found in ${context}`);
    assert(!/\.(png|jpe?g|gif|webp|psd|tiff?)$/i.test(value), `Image binary path found in ${context}`);
    assert(!value.includes("/.codex/generated_images/"), `Generated image path found in ${context}`);
    assert(!value.includes("\\.codex\\generated_images\\"), `Generated image path found in ${context}`);
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

function validateSharedBoundaries(record, context) {
  validateNoRawOrBinaryPath(record, context);
  assert(record.schema_only === true, `${context} must remain schema_only`);
  assert(record.asset_ref?.image_binary_included === false, `${context} must not include image binaries`);
  assert(record.asset_ref?.raw_local_path_included === false, `${context} must not include raw local paths`);
  assert(record.memory_route?.memory_seed === false, `${context} must not create memory_seed`);
  assert(record.memory_route?.memory_gate_id === null, `${context} must not activate memory_gate_id`);
  assert(record.memory_route?.memory_write_allowed_now === false, `${context} must not allow memory write now`);
  assert(record.promotion_boundaries?.accepted_sample_auto_promotion === false, `${context} must not auto-promote accepted_sample`);
  assert(record.promotion_boundaries?.accepted_sample_created === false, `${context} must not create accepted_sample`);
  assert(record.promotion_boundaries?.production_candidate === false, `${context} must not set production_candidate`);
  assert(record.promotion_boundaries?.production_candidate_created === false, `${context} must not create production_candidate`);
  for (const flag of falseFlags) {
    assert(record.side_effect_flags?.[flag] === false, `${context} side-effect flag must remain false: ${flag}`);
  }
}

function validateAcceptedSampleRecord(record) {
  validateSharedBoundaries(record, "accepted_sample_record");
  assert(record.record_version === "v0_1", "accepted record_version must be v0_1");
  assert(record.phase === phase, "accepted phase mismatch");
  assert(record.record_type === "accepted_sample", "accepted record_type mismatch");
  assertNonEmptyString(record.accepted_gate_id, "accepted sample requires accepted_gate_id");
  assert(record.human_accepted === true, "accepted sample requires human_accepted:true");
  assertNonEmptyString(record.review_report_ref, "accepted sample requires review_report_ref");
  assert(record.visual_traits && typeof record.visual_traits === "object", "accepted sample requires visual_traits");
  for (const dimension of reviewDimensions) {
    assertNonEmptyString(record.visual_traits[dimension], `accepted visual_traits missing: ${dimension}`);
  }
  assertNonEmptyArray(record.reuse_conditions, "accepted sample requires reuse_conditions");
  assert(record.promotion_boundaries.accepted_registry_entry_created === false, "accepted registry entry must not be created");
  assert(record.promotion_boundaries.requires_separate_production_gate === true, "accepted sample requires separate production gate");
}

function validateRejectedSampleRecord(record) {
  validateSharedBoundaries(record, "rejected_sample_record");
  assert(record.record_version === "v0_1", "rejected record_version must be v0_1");
  assert(record.phase === phase, "rejected phase mismatch");
  assert(record.record_type === "rejected_sample", "rejected record_type mismatch");
  assertNonEmptyString(record.review_report_ref, "rejected sample requires review_report_ref");
  assertNonEmptyString(record.rejection_reason, "rejected sample requires rejection_reason");
  assert(record.failure_taxonomy && typeof record.failure_taxonomy === "object", "rejected sample requires failure_taxonomy");
  assert(reviewDimensions.has(record.failure_taxonomy.primary_failure_dimension), "rejected sample requires valid primary failure dimension");
  assertNonEmptyArray(record.failure_taxonomy.reason_codes, "rejected sample requires failure reason codes");
  assertNonEmptyString(record.correction_hint, "rejected sample requires correction_hint");
  assertNonEmptyArray(record.do_not_reuse_conditions, "rejected sample requires do_not_reuse_conditions");
}

function expectFailure(record, caseId, validate, mutate) {
  const candidate = clone(record);
  mutate(candidate);
  try {
    validate(candidate);
  } catch (error) {
    return {
      case_id: caseId,
      result: "caught",
      failure_message: error.message
    };
  }
  throw new Error(`${caseId} was not caught`);
}

function validateNegativeCases(acceptedRecord, rejectedRecord) {
  const cases = [
    expectFailure(acceptedRecord, "accepted_without_gate_fails", validateAcceptedSampleRecord, (candidate) => {
      candidate.accepted_gate_id = "";
    }),
    expectFailure(acceptedRecord, "accepted_without_human_acceptance_fails", validateAcceptedSampleRecord, (candidate) => {
      candidate.human_accepted = false;
    }),
    expectFailure(acceptedRecord, "accepted_without_review_report_ref_fails", validateAcceptedSampleRecord, (candidate) => {
      candidate.review_report_ref = "";
    }),
    expectFailure(acceptedRecord, "accepted_without_visual_traits_fails", validateAcceptedSampleRecord, (candidate) => {
      delete candidate.visual_traits;
    }),
    expectFailure(acceptedRecord, "accepted_without_reuse_conditions_fails", validateAcceptedSampleRecord, (candidate) => {
      candidate.reuse_conditions = [];
    }),
    expectFailure(rejectedRecord, "rejected_without_rejection_reason_fails", validateRejectedSampleRecord, (candidate) => {
      candidate.rejection_reason = "";
    }),
    expectFailure(rejectedRecord, "rejected_without_failure_taxonomy_fails", validateRejectedSampleRecord, (candidate) => {
      delete candidate.failure_taxonomy;
    }),
    expectFailure(rejectedRecord, "rejected_without_correction_hint_fails", validateRejectedSampleRecord, (candidate) => {
      candidate.correction_hint = "";
    }),
    expectFailure(rejectedRecord, "rejected_without_do_not_reuse_conditions_fails", validateRejectedSampleRecord, (candidate) => {
      candidate.do_not_reuse_conditions = [];
    }),
    expectFailure(acceptedRecord, "memory_write_flag_drift_fails", validateAcceptedSampleRecord, (candidate) => {
      candidate.side_effect_flags.VCP_memory_write_performed = true;
    }),
    expectFailure(rejectedRecord, "daily_note_flag_drift_fails", validateRejectedSampleRecord, (candidate) => {
      candidate.side_effect_flags.DailyNote_write_performed = true;
    }),
    expectFailure(acceptedRecord, "production_candidate_field_flip_fails", validateAcceptedSampleRecord, (candidate) => {
      candidate.promotion_boundaries.production_candidate = true;
    }),
    expectFailure(rejectedRecord, "raw_local_path_fails", validateRejectedSampleRecord, (candidate) => {
      candidate.asset_ref.raw_path = "C:\\Users\\617\\sample.png";
    }),
    expectFailure(acceptedRecord, "image_binary_path_fails", validateAcceptedSampleRecord, (candidate) => {
      candidate.asset_ref.image_path = "runs/real_generation/sample.png";
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
  const acceptedSchema = read(acceptedSchemaPath);
  const rejectedSchema = read(rejectedSchemaPath);
  const mvp = read(mvpPath);
  const slice = read(slicePath);
  const combined = `${doc}\n${acceptedSchema}\n${rejectedSchema}`;

  for (const token of [
    phase,
    "accepted_sample_record",
    "rejected_sample_record",
    "accepted_gate_id",
    "human_accepted: true",
    "review_report_ref",
    "visual_traits",
    "reuse_conditions",
    "rejection_reason",
    "failure_taxonomy",
    "correction_hint",
    "do_not_reuse_conditions",
    "VCP_memory_write_performed: false",
    "DailyNote_write_performed: false",
    "accepted_sample_auto_promotion: false",
    "production_candidate: false"
  ]) {
    assert(combined.includes(token), `visual sample memory text missing token: ${token}`);
  }

  assert(mvp.includes("scripts/validate_visual_sample_memory_policy.js"), "MVP validator wiring missing");
  assert(slice.includes("v0_3_7e_visual_sample_memory_policy_slice"), "exact slice wiring missing");
}

function main() {
  validateTextSurfaces();
  const acceptedRecord = readJson(acceptedFixturePath).accepted_sample_record;
  const rejectedRecord = readJson(rejectedFixturePath).rejected_sample_record;
  validateAcceptedSampleRecord(acceptedRecord);
  validateRejectedSampleRecord(rejectedRecord);
  const negativeCaseSummary = validateNegativeCases(acceptedRecord, rejectedRecord);

  const output = {
    passed: true,
    validator: "validate_visual_sample_memory_policy",
    phase,
    visual_sample_memory_policy_defined: true,
    accepted_sample_record_schema_present: fs.existsSync(repoPath(acceptedSchemaPath)),
    rejected_sample_record_schema_present: fs.existsSync(repoPath(rejectedSchemaPath)),
    accepted_sample_record_fixture_present: fs.existsSync(repoPath(acceptedFixturePath)),
    rejected_sample_record_fixture_present: fs.existsSync(repoPath(rejectedFixturePath)),
    accepted_sample_requires_gate_and_human_acceptance: true,
    accepted_sample_requires_review_report_ref: true,
    accepted_sample_requires_visual_traits: true,
    accepted_sample_requires_reuse_conditions: true,
    rejected_sample_requires_rejection_reason: true,
    rejected_sample_requires_failure_taxonomy: true,
    rejected_sample_requires_correction_hint: true,
    rejected_sample_requires_do_not_reuse_conditions: true,
    schema_only: true,
    memory_write_blocked: true,
    daily_note_write_blocked: true,
    accepted_sample_auto_promotion_blocked: true,
    production_candidate_blocked: true,
    negative_case_count: negativeCaseSummary.negative_case_count,
    caught_negative_case_count: negativeCaseSummary.caught_negative_case_count,
    all_negative_cases_caught: negativeCaseSummary.all_negative_cases_caught,
    provider_call_performed: false,
    image_generation_performed: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false,
    runtime_call_performed: false,
    secret_value_read_performed: false,
    accepted_sample_created: false,
    rejected_sample_created: false,
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
  validateAcceptedSampleRecord,
  validateRejectedSampleRecord,
  validateNegativeCases
};
