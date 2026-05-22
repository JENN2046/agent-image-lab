#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const phase = "v0_5_3_visual_memory_readonly_plan";
const docPath = "docs/V0_5_3_VISUAL_MEMORY_READONLY_PLAN.md";
const schemaPath = "schemas/visual_memory_readonly_plan.schema.yaml";
const reportPath = "reports/visual_asset_eval_dry_run/v0_5_3_visual_memory_readonly_plan.json";
const passFixturePath = "tests/schema_examples/visual_memory_readonly_plan.example.json";
const failFixturePath = "tests/schema_examples/visual_memory_readonly_plan_fail.example.json";
const replaySetPath = "reports/visual_asset_eval_dry_run/v0_5_2_review_replay_set.json";
const memoryPolicyPath = "docs/VISUAL_SAMPLE_MEMORY_POLICY.md";
const acceptedSchemaPath = "schemas/accepted_sample_record.schema.yaml";
const rejectedSchemaPath = "schemas/rejected_sample_record.schema.yaml";
const mvpPath = "scripts/validate_mvp.ps1";
const slicePath = "scripts/lib/governance_tooling_maintenance_slice.js";

const requiredPlans = [
  "accepted_sample_recall_read_only",
  "rejected_pattern_recall_read_only",
  "style_dna_read_only",
  "no_memory_write",
  "no_DailyNote_write"
];
const falseFlags = [
  "real_memory_read_performed",
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

function validateFalseFlags(container, context) {
  assert(container && typeof container === "object", `${context} missing`);
  for (const flag of falseFlags) {
    assert(container[flag] === false, `${context}.${flag} must remain false`);
  }
}

function sourceEvidence() {
  const replay = readJson(replaySetPath).visual_review_replay_set;
  const memoryPolicy = read(memoryPolicyPath);
  const acceptedSchema = read(acceptedSchemaPath);
  const rejectedSchema = read(rejectedSchemaPath);
  assert(replay.phase === "v0_5_2_visual_review_replay_set", "source replay set phase mismatch");
  assert(replay.replay_consistency.memory_flags_stay_false === true, "source replay memory flags must stay false");
  assert(replay.decision_contract.memory_suitability === false, "source replay memory suitability must stay false");
  assert(memoryPolicy.includes("accepted_sample") && memoryPolicy.includes("rejected_sample"), "memory policy must mention accepted and rejected samples");
  assert(acceptedSchema.includes("accepted_sample"), "accepted sample schema missing");
  assert(rejectedSchema.includes("rejected_sample"), "rejected sample schema missing");
  return { replay };
}

function validateAcceptedRecall(plan) {
  assert(plan && typeof plan === "object", "accepted_sample_recall_read_only missing");
  assert(plan.planned === true, "accepted sample recall must be planned");
  assert(plan.read_only === true, "accepted sample recall must be read-only");
  assertNonEmptyStringArray(plan.lookup_keys, "accepted sample recall lookup keys required");
  assert(plan.lookup_keys.includes("asset_id"), "accepted sample recall must include asset_id lookup");
  assert(plan.lookup_keys.includes("visual_traits"), "accepted sample recall must include visual_traits lookup");
  assert(plan.real_memory_read_performed === false, "accepted sample recall must not read real memory now");
  assert(plan.accepted_sample_created === false, "accepted sample recall must not create accepted sample");
  assert(plan.accepted_sample_auto_promotion === false, "accepted sample recall must not auto-promote accepted sample");
}

function validateRejectedRecall(plan) {
  assert(plan && typeof plan === "object", "rejected_pattern_recall_read_only missing");
  assert(plan.planned === true, "rejected pattern recall must be planned");
  assert(plan.read_only === true, "rejected pattern recall must be read-only");
  assertNonEmptyStringArray(plan.lookup_keys, "rejected pattern recall lookup keys required");
  assert(plan.lookup_keys.includes("failure_taxonomy"), "rejected pattern recall must include failure_taxonomy lookup");
  assert(plan.lookup_keys.includes("correction_hint_ref"), "rejected pattern recall must include correction_hint_ref lookup");
  assert(plan.real_memory_read_performed === false, "rejected pattern recall must not read real memory now");
  assert(plan.rejected_sample_created === false, "rejected pattern recall must not create rejected sample");
  assert(plan.failure_lesson_written === false, "rejected pattern recall must not write failure lessons");
}

function validateStyleDna(plan) {
  assert(plan && typeof plan === "object", "style_dna_read_only missing");
  assert(plan.planned === true, "style DNA recall must be planned");
  assert(plan.read_only === true, "style DNA recall must be read-only");
  assertNonEmptyStringArray(plan.lookup_keys, "style DNA lookup keys required");
  assert(plan.lookup_keys.includes("composition"), "style DNA recall must include composition lookup");
  assert(plan.lookup_keys.includes("lighting"), "style DNA recall must include lighting lookup");
  assert(plan.real_memory_read_performed === false, "style DNA recall must not read real memory now");
  assert(plan.memory_seed_promoted === false, "style DNA recall must not promote memory seeds");
}

function validateMemoryReadOnlyPlan(record) {
  assert(record && typeof record === "object", "visual memory read-only plan missing");
  assertNoSecretOrRawPath(record, "visual_memory_readonly_plan");
  assert(record.version === "v0_1", "version mismatch");
  assert(record.phase === phase, "phase mismatch");
  assert(record.source_review_replay_set_ref === replaySetPath, "source replay set ref mismatch");
  assert(record.source_visual_sample_memory_policy_ref === memoryPolicyPath, "source memory policy ref mismatch");
  assert(record.source_accepted_sample_schema_ref === acceptedSchemaPath, "source accepted sample schema ref mismatch");
  assert(record.source_rejected_sample_schema_ref === rejectedSchemaPath, "source rejected sample schema ref mismatch");
  for (const field of requiredPlans) {
    assert(Object.prototype.hasOwnProperty.call(record, field), `required read-only plan missing: ${field}`);
  }

  sourceEvidence();
  validateAcceptedRecall(record.accepted_sample_recall_read_only);
  validateRejectedRecall(record.rejected_pattern_recall_read_only);
  validateStyleDna(record.style_dna_read_only);

  assert(record.no_memory_write?.enabled === true, "no_memory_write must be enabled");
  assert(record.no_memory_write?.VCP_memory_write_allowed === false, "VCP memory write must not be allowed");
  assert(record.no_memory_write?.memory_seed_promotion_allowed === false, "memory seed promotion must not be allowed");
  assert(record.no_memory_write?.direct_memory_write_allowed === false, "direct memory write must not be allowed");
  assert(record.no_DailyNote_write?.enabled === true, "no_DailyNote_write must be enabled");
  assert(record.no_DailyNote_write?.DailyNote_write_allowed === false, "DailyNote write must not be allowed");
  assert(record.no_DailyNote_write?.DailyNote_draft_allowed === false, "DailyNote draft must not be allowed in this plan");

  assert(record.boundaries?.planning_only === true, "planning_only must be true");
  assert(record.boundaries?.metadata_only === true, "metadata_only must be true");
  assert(record.boundaries?.read_only_plan_only === true, "read_only_plan_only must be true");
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
    validateMemoryReadOnlyPlan(candidate);
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
    validateMemoryReadOnlyPlan(invalidRecord);
  } catch {
    invalidFixtureCaught = true;
  }
  assert(invalidFixtureCaught, "invalid visual memory read-only plan fixture must fail");

  const cases = [
    expectFailure(validRecord, "missing_accepted_sample_recall_fails", (candidate) => {
      delete candidate.accepted_sample_recall_read_only;
    }),
    expectFailure(validRecord, "accepted_sample_recall_not_readonly_fails", (candidate) => {
      candidate.accepted_sample_recall_read_only.read_only = false;
    }),
    expectFailure(validRecord, "rejected_pattern_recall_not_readonly_fails", (candidate) => {
      candidate.rejected_pattern_recall_read_only.read_only = false;
    }),
    expectFailure(validRecord, "style_dna_not_readonly_fails", (candidate) => {
      candidate.style_dna_read_only.read_only = false;
    }),
    expectFailure(validRecord, "real_memory_read_true_fails", (candidate) => {
      candidate.side_effects.real_memory_read_performed = true;
    }),
    expectFailure(validRecord, "accepted_sample_created_true_fails", (candidate) => {
      candidate.accepted_sample_recall_read_only.accepted_sample_created = true;
    }),
    expectFailure(validRecord, "rejected_sample_created_true_fails", (candidate) => {
      candidate.rejected_pattern_recall_read_only.rejected_sample_created = true;
    }),
    expectFailure(validRecord, "failure_lesson_written_true_fails", (candidate) => {
      candidate.rejected_pattern_recall_read_only.failure_lesson_written = true;
    }),
    expectFailure(validRecord, "memory_seed_promoted_true_fails", (candidate) => {
      candidate.style_dna_read_only.memory_seed_promoted = true;
    }),
    expectFailure(validRecord, "vcp_memory_write_allowed_true_fails", (candidate) => {
      candidate.no_memory_write.VCP_memory_write_allowed = true;
    }),
    expectFailure(validRecord, "daily_note_write_allowed_true_fails", (candidate) => {
      candidate.no_DailyNote_write.DailyNote_write_allowed = true;
    }),
    expectFailure(validRecord, "provider_call_true_fails", (candidate) => {
      candidate.side_effects.provider_call_performed = true;
    }),
    expectFailure(validRecord, "image_generation_true_fails", (candidate) => {
      candidate.side_effects.image_generation_performed = true;
    }),
    expectFailure(validRecord, "runtime_call_true_fails", (candidate) => {
      candidate.side_effects.runtime_call_performed = true;
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
      candidate.visual_memory_readonly_plan_id = "C:\\private\\memory.json";
    }),
    expectFailure(validRecord, "secret_env_path_fails", (candidate) => {
      candidate.visual_memory_readonly_plan_id = ".env.local";
    })
  ];

  return {
    invalid_fixture_failure_caught: invalidFixtureCaught,
    negative_case_count: cases.length,
    caught_negative_case_count: cases.filter((item) => item.result === "caught").length,
    all_negative_cases_caught: cases.every((item) => item.result === "caught"),
    missing_accepted_sample_recall_caught: cases.some((item) => item.case_id === "missing_accepted_sample_recall_fails" && item.result === "caught"),
    accepted_sample_readonly_drift_caught: cases.some((item) => item.case_id === "accepted_sample_recall_not_readonly_fails" && item.result === "caught"),
    rejected_pattern_readonly_drift_caught: cases.some((item) => item.case_id === "rejected_pattern_recall_not_readonly_fails" && item.result === "caught"),
    style_dna_readonly_drift_caught: cases.some((item) => item.case_id === "style_dna_not_readonly_fails" && item.result === "caught"),
    real_memory_read_caught: cases.some((item) => item.case_id === "real_memory_read_true_fails" && item.result === "caught"),
    memory_write_caught: cases.some((item) => item.case_id === "vcp_memory_write_allowed_true_fails" && item.result === "caught"),
    daily_note_write_caught: cases.some((item) => item.case_id === "daily_note_write_allowed_true_fails" && item.result === "caught"),
    production_candidate_caught: cases.some((item) => item.case_id === "production_candidate_true_fails" && item.result === "caught"),
    accepted_sample_promotion_caught: cases.some((item) => item.case_id === "accepted_sample_auto_promotion_true_fails" && item.result === "caught"),
    raw_local_path_caught: cases.some((item) => item.case_id === "raw_local_path_fails" && item.result === "caught")
  };
}

function main() {
  const doc = read(docPath);
  const schema = read(schemaPath);
  const mvp = read(mvpPath);
  const slice = read(slicePath);
  const reportRecord = readJson(reportPath).visual_memory_readonly_plan;
  const validRecord = readJson(passFixturePath).visual_memory_readonly_plan;
  const invalidRecord = readJson(failFixturePath).visual_memory_readonly_plan;

  assert(doc.includes("accepted_sample_recall_read_only"), "doc must mention accepted sample recall read-only");
  assert(doc.includes("rejected_pattern_recall_read_only"), "doc must mention rejected pattern recall read-only");
  assert(doc.includes("style_dna_read_only"), "doc must mention style DNA read-only");
  assert(doc.includes("no_memory_write"), "doc must mention no_memory_write");
  assert(doc.includes("no_DailyNote_write"), "doc must mention no_DailyNote_write");
  assert(schema.includes("visual_memory_readonly_plan"), "schema must define visual memory read-only plan");
  assert(mvp.includes("validate_visual_memory_readonly_plan.js"), "MVP validator wiring missing");
  assert(slice.includes("EXPECTED_V0_5_3_VISUAL_MEMORY_READONLY_PLAN_SLICE"), "exact-slice wiring missing");

  validateMemoryReadOnlyPlan(reportRecord);
  validateMemoryReadOnlyPlan(validRecord);
  const negativeCaseSummary = validateNegativeCases(validRecord, invalidRecord);

  const output = {
    passed: true,
    validator: "validate_visual_memory_readonly_plan",
    phase,
    memory_readonly_doc_present: true,
    memory_readonly_schema_present: true,
    memory_readonly_report_present: true,
    memory_readonly_fixture_present: true,
    memory_readonly_fail_fixture_present: true,
    source_review_replay_set_verified: true,
    source_visual_sample_memory_policy_verified: true,
    accepted_sample_recall_read_only: true,
    rejected_pattern_recall_read_only: true,
    style_dna_read_only: true,
    no_memory_write: true,
    no_DailyNote_write: true,
    real_memory_read_performed: false,
    invalid_fixture_failure_caught: negativeCaseSummary.invalid_fixture_failure_caught,
    negative_case_count: negativeCaseSummary.negative_case_count,
    caught_negative_case_count: negativeCaseSummary.caught_negative_case_count,
    all_negative_cases_caught: negativeCaseSummary.all_negative_cases_caught,
    missing_accepted_sample_recall_caught: negativeCaseSummary.missing_accepted_sample_recall_caught,
    accepted_sample_readonly_drift_caught: negativeCaseSummary.accepted_sample_readonly_drift_caught,
    rejected_pattern_readonly_drift_caught: negativeCaseSummary.rejected_pattern_readonly_drift_caught,
    style_dna_readonly_drift_caught: negativeCaseSummary.style_dna_readonly_drift_caught,
    real_memory_read_caught: negativeCaseSummary.real_memory_read_caught,
    memory_write_caught: negativeCaseSummary.memory_write_caught,
    daily_note_write_caught: negativeCaseSummary.daily_note_write_caught,
    production_candidate_caught: negativeCaseSummary.production_candidate_caught,
    accepted_sample_promotion_caught: negativeCaseSummary.accepted_sample_promotion_caught,
    raw_local_path_caught: negativeCaseSummary.raw_local_path_caught,
    planning_only: true,
    metadata_only: true,
    read_only_plan_only: true,
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
