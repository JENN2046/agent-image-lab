#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const phase = "v0_5_9_visual_memory_readonly_query_contract";
const docPath = "docs/V0_5_9_VISUAL_MEMORY_READONLY_QUERY_CONTRACT.md";
const schemaPath = "schemas/visual_memory_readonly_query_contract.schema.yaml";
const reportPath = "reports/visual_asset_eval_dry_run/v0_5_9_visual_memory_readonly_query_contract.json";
const passFixturePath = "tests/schema_examples/visual_memory_readonly_query_contract.example.json";
const failFixturePath = "tests/schema_examples/visual_memory_readonly_query_contract_fail.example.json";
const sourcePlanPath = "reports/visual_asset_eval_dry_run/v0_5_3_visual_memory_readonly_plan.json";
const memoryPolicyPath = "docs/VISUAL_SAMPLE_MEMORY_POLICY.md";
const acceptedSchemaPath = "schemas/accepted_sample_record.schema.yaml";
const rejectedSchemaPath = "schemas/rejected_sample_record.schema.yaml";
const mvpPath = "scripts/validate_mvp.ps1";
const slicePath = "scripts/lib/governance_tooling_maintenance_slice.js";

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

function validateSourceEvidence() {
  const sourcePlan = readJson(sourcePlanPath).visual_memory_readonly_plan;
  const memoryPolicy = read(memoryPolicyPath);
  const acceptedSchema = read(acceptedSchemaPath);
  const rejectedSchema = read(rejectedSchemaPath);
  assert(sourcePlan.phase === "v0_5_3_visual_memory_readonly_plan", "source visual memory readonly plan phase mismatch");
  assert(sourcePlan.accepted_sample_recall_read_only?.read_only === true, "source accepted sample recall must stay read-only");
  assert(sourcePlan.rejected_pattern_recall_read_only?.read_only === true, "source rejected pattern recall must stay read-only");
  assert(sourcePlan.style_dna_read_only?.read_only === true, "source style DNA recall must stay read-only");
  assert(sourcePlan.no_memory_write?.VCP_memory_write_allowed === false, "source no_memory_write must block VCP memory writes");
  assert(memoryPolicy.includes("accepted_sample") && memoryPolicy.includes("rejected_sample"), "memory policy must mention accepted and rejected samples");
  assert(acceptedSchema.includes("accepted_sample"), "accepted sample schema missing");
  assert(rejectedSchema.includes("rejected_sample"), "rejected sample schema missing");
}

function validateAcceptedQuery(query) {
  assert(query && typeof query === "object", "accepted_sample_readonly_query missing");
  assert(query.enabled === true, "accepted sample readonly query must be enabled");
  assert(query.read_only === true, "accepted sample readonly query must be read-only");
  assert(query.query_shape_only === true, "accepted sample readonly query must stay query-shape-only");
  assert(query.returns_metadata_only === true, "accepted sample readonly query must return metadata only");
  assert(query.execution_allowed_now === false, "accepted sample readonly query must not be executable now");
  assert(query.query_scope === "accepted_sample_registry_readonly_future_gate", "accepted sample readonly query scope mismatch");
  assertNonEmptyStringArray(query.lookup_keys, "accepted sample readonly query lookup keys required");
  assert(query.lookup_keys.includes("asset_id"), "accepted sample readonly query must include asset_id");
  assert(query.lookup_keys.includes("review_report_ref"), "accepted sample readonly query must include review_report_ref");
  assert(query.lookup_keys.includes("visual_traits"), "accepted sample readonly query must include visual_traits");
  assert(query.real_memory_read_performed === false, "accepted sample readonly query must not read real memory now");
  assert(query.accepted_sample_created === false, "accepted sample readonly query must not create accepted samples");
  assert(query.accepted_sample_auto_promotion === false, "accepted sample readonly query must not auto-promote accepted samples");
}

function validateRejectedQuery(query) {
  assert(query && typeof query === "object", "rejected_pattern_readonly_query missing");
  assert(query.enabled === true, "rejected pattern readonly query must be enabled");
  assert(query.read_only === true, "rejected pattern readonly query must be read-only");
  assert(query.query_shape_only === true, "rejected pattern readonly query must stay query-shape-only");
  assert(query.returns_metadata_only === true, "rejected pattern readonly query must return metadata only");
  assert(query.execution_allowed_now === false, "rejected pattern readonly query must not be executable now");
  assert(query.query_scope === "rejected_pattern_learning_readonly_future_gate", "rejected pattern readonly query scope mismatch");
  assertNonEmptyStringArray(query.lookup_keys, "rejected pattern readonly query lookup keys required");
  assert(query.lookup_keys.includes("failure_taxonomy"), "rejected pattern readonly query must include failure_taxonomy");
  assert(query.lookup_keys.includes("correction_hint"), "rejected pattern readonly query must include correction_hint");
  assert(query.lookup_keys.includes("do_not_reuse_conditions"), "rejected pattern readonly query must include do_not_reuse_conditions");
  assert(query.real_memory_read_performed === false, "rejected pattern readonly query must not read real memory now");
  assert(query.rejected_sample_created === false, "rejected pattern readonly query must not create rejected samples");
  assert(query.failure_lesson_written === false, "rejected pattern readonly query must not write failure lessons");
}

function validateStyleDnaQuery(query) {
  assert(query && typeof query === "object", "style_dna_readonly_query missing");
  assert(query.enabled === true, "style DNA readonly query must be enabled");
  assert(query.read_only === true, "style DNA readonly query must be read-only");
  assert(query.query_shape_only === true, "style DNA readonly query must stay query-shape-only");
  assert(query.returns_metadata_only === true, "style DNA readonly query must return metadata only");
  assert(query.execution_allowed_now === false, "style DNA readonly query must not be executable now");
  assert(query.query_scope === "style_dna_reference_readonly_future_gate", "style DNA readonly query scope mismatch");
  assertNonEmptyStringArray(query.lookup_keys, "style DNA readonly query lookup keys required");
  assert(query.lookup_keys.includes("composition"), "style DNA readonly query must include composition");
  assert(query.lookup_keys.includes("lighting"), "style DNA readonly query must include lighting");
  assert(query.lookup_keys.includes("material_realism"), "style DNA readonly query must include material_realism");
  assert(query.lookup_keys.includes("commercial_fitness"), "style DNA readonly query must include commercial_fitness");
  assert(query.real_memory_read_performed === false, "style DNA readonly query must not read real memory now");
  assert(query.memory_seed_promoted === false, "style DNA readonly query must not promote memory seeds");
}

function validateRecord(record) {
  assert(record && typeof record === "object", "visual memory readonly query contract missing");
  assertNoSecretOrRawPath(record, "visual_memory_readonly_query_contract");
  assert(record.version === "v0_1", "version mismatch");
  assert(record.phase === phase, "phase mismatch");
  assert(record.source_visual_memory_readonly_plan_ref === sourcePlanPath, "source visual memory readonly plan ref mismatch");
  assert(record.source_visual_sample_memory_policy_ref === memoryPolicyPath, "source visual sample memory policy ref mismatch");
  assert(record.source_accepted_sample_schema_ref === acceptedSchemaPath, "source accepted sample schema ref mismatch");
  assert(record.source_rejected_sample_schema_ref === rejectedSchemaPath, "source rejected sample schema ref mismatch");

  validateSourceEvidence();
  validateAcceptedQuery(record.accepted_sample_readonly_query);
  validateRejectedQuery(record.rejected_pattern_readonly_query);
  validateStyleDnaQuery(record.style_dna_readonly_query);

  assert(record.no_write_flags?.enabled === true, "no_write_flags must be enabled");
  assert(record.no_write_flags?.VCP_memory_write_allowed === false, "VCP memory write must not be allowed");
  assert(record.no_write_flags?.DailyNote_write_allowed === false, "DailyNote write must not be allowed");
  assert(record.no_write_flags?.accepted_sample_promotion_allowed === false, "accepted sample promotion must not be allowed");
  assert(record.no_write_flags?.memory_seed_promotion_allowed === false, "memory seed promotion must not be allowed");
  assert(record.no_write_flags?.production_candidate_write_allowed === false, "production candidate write must not be allowed");

  assert(record.boundaries?.metadata_only === true, "metadata_only must be true");
  assert(record.boundaries?.readonly_query_contract_only === true, "readonly_query_contract_only must be true");
  assert(record.boundaries?.query_contract_dry_run_only === true, "query_contract_dry_run_only must be true");
  assert(record.boundaries?.no_live_memory_access === true, "no_live_memory_access must be true");
  assert(record.boundaries?.real_executor_implemented_now === false, "real executor must remain false");
  assert(record.boundaries?.Push_L2_exercised === false, "Push_L2 must remain false");
  validateFalseFlags(record.boundaries, "boundaries");
  validateFalseFlags(record.side_effects, "side_effects");
}

function expectFailure(baseRecord, caseId, mutate) {
  const candidate = clone(baseRecord);
  mutate(candidate);
  try {
    validateRecord(candidate);
  } catch (error) {
    return { case_id: caseId, result: "caught", failure_message: error.message };
  }
  throw new Error(`${caseId} was not caught`);
}

function validateNegativeCases(validRecord, invalidRecord) {
  let invalidFixtureCaught = false;
  try {
    validateRecord(invalidRecord);
  } catch {
    invalidFixtureCaught = true;
  }
  assert(invalidFixtureCaught, "invalid visual memory readonly query contract fixture must fail");

  const cases = [
    expectFailure(validRecord, "accepted_sample_query_not_readonly_fails", (candidate) => { candidate.accepted_sample_readonly_query.read_only = false; }),
    expectFailure(validRecord, "rejected_pattern_query_not_readonly_fails", (candidate) => { candidate.rejected_pattern_readonly_query.read_only = false; }),
    expectFailure(validRecord, "style_dna_query_not_readonly_fails", (candidate) => { candidate.style_dna_readonly_query.read_only = false; }),
    expectFailure(validRecord, "accepted_sample_query_execution_allowed_fails", (candidate) => { candidate.accepted_sample_readonly_query.execution_allowed_now = true; }),
    expectFailure(validRecord, "rejected_pattern_query_execution_allowed_fails", (candidate) => { candidate.rejected_pattern_readonly_query.execution_allowed_now = true; }),
    expectFailure(validRecord, "style_dna_query_execution_allowed_fails", (candidate) => { candidate.style_dna_readonly_query.execution_allowed_now = true; }),
    expectFailure(validRecord, "accepted_sample_promotion_allowed_true_fails", (candidate) => { candidate.no_write_flags.accepted_sample_promotion_allowed = true; }),
    expectFailure(validRecord, "memory_seed_promotion_allowed_true_fails", (candidate) => { candidate.no_write_flags.memory_seed_promotion_allowed = true; }),
    expectFailure(validRecord, "memory_write_allowed_true_fails", (candidate) => { candidate.no_write_flags.VCP_memory_write_allowed = true; }),
    expectFailure(validRecord, "daily_note_write_allowed_true_fails", (candidate) => { candidate.no_write_flags.DailyNote_write_allowed = true; }),
    expectFailure(validRecord, "real_memory_read_true_fails", (candidate) => { candidate.side_effects.real_memory_read_performed = true; }),
    expectFailure(validRecord, "provider_call_true_fails", (candidate) => { candidate.side_effects.provider_call_performed = true; }),
    expectFailure(validRecord, "image_generation_true_fails", (candidate) => { candidate.side_effects.image_generation_performed = true; }),
    expectFailure(validRecord, "runtime_call_true_fails", (candidate) => { candidate.side_effects.runtime_call_performed = true; }),
    expectFailure(validRecord, "production_candidate_true_fails", (candidate) => { candidate.side_effects.production_candidate_created = true; }),
    expectFailure(validRecord, "accepted_sample_auto_promotion_true_fails", (candidate) => { candidate.side_effects.accepted_sample_auto_promotion = true; }),
    expectFailure(validRecord, "memory_seed_promoted_true_fails", (candidate) => { candidate.side_effects.memory_seed_promoted = true; }),
    expectFailure(validRecord, "push_l2_exercised_true_fails", (candidate) => { candidate.boundaries.Push_L2_exercised = true; }),
    expectFailure(validRecord, "raw_local_path_fails", (candidate) => { candidate.visual_memory_readonly_query_contract_id = "C:\\private\\memory.json"; }),
    expectFailure(validRecord, "secret_env_path_fails", (candidate) => { candidate.visual_memory_readonly_query_contract_id = ".env.local"; })
  ];

  return {
    invalid_fixture_failure_caught: invalidFixtureCaught,
    negative_case_count: cases.length,
    caught_negative_case_count: cases.filter((item) => item.result === "caught").length,
    all_negative_cases_caught: cases.every((item) => item.result === "caught"),
    accepted_sample_query_readonly_caught: cases.some((item) => item.case_id === "accepted_sample_query_not_readonly_fails" && item.result === "caught"),
    rejected_pattern_query_readonly_caught: cases.some((item) => item.case_id === "rejected_pattern_query_not_readonly_fails" && item.result === "caught"),
    style_dna_query_readonly_caught: cases.some((item) => item.case_id === "style_dna_query_not_readonly_fails" && item.result === "caught"),
    no_write_flags_caught: cases.some((item) => item.case_id === "memory_write_allowed_true_fails" && item.result === "caught"),
    daily_note_write_caught: cases.some((item) => item.case_id === "daily_note_write_allowed_true_fails" && item.result === "caught"),
    real_memory_read_caught: cases.some((item) => item.case_id === "real_memory_read_true_fails" && item.result === "caught"),
    provider_call_caught: cases.some((item) => item.case_id === "provider_call_true_fails" && item.result === "caught"),
    image_generation_caught: cases.some((item) => item.case_id === "image_generation_true_fails" && item.result === "caught"),
    runtime_call_caught: cases.some((item) => item.case_id === "runtime_call_true_fails" && item.result === "caught"),
    raw_local_path_caught: cases.some((item) => item.case_id === "raw_local_path_fails" && item.result === "caught")
  };
}

function main() {
  const doc = read(docPath);
  const schema = read(schemaPath);
  const mvp = read(mvpPath);
  const slice = read(slicePath);
  const reportRecord = readJson(reportPath).visual_memory_readonly_query_contract;
  const validRecord = readJson(passFixturePath).visual_memory_readonly_query_contract;
  const invalidRecord = readJson(failFixturePath).visual_memory_readonly_query_contract;

  for (const token of [
    "accepted_sample_readonly_query",
    "rejected_pattern_readonly_query",
    "style_dna_readonly_query",
    "no_write_flags"
  ]) {
    assert(doc.includes(token), `doc missing token: ${token}`);
  }
  assert(schema.includes("visual_memory_readonly_query_contract"), "schema must define visual_memory_readonly_query_contract");
  assert(mvp.includes("validate_visual_memory_readonly_query_contract.js"), "MVP validator wiring missing");
  assert(slice.includes("EXPECTED_V0_5_9_VISUAL_MEMORY_READONLY_QUERY_CONTRACT_SLICE"), "exact-slice wiring missing");

  validateRecord(reportRecord);
  validateRecord(validRecord);
  const negativeCaseSummary = validateNegativeCases(validRecord, invalidRecord);

  const output = {
    passed: true,
    validator: "validate_visual_memory_readonly_query_contract",
    phase,
    readonly_query_doc_present: true,
    readonly_query_schema_present: true,
    readonly_query_report_present: true,
    readonly_query_fixture_present: true,
    readonly_query_fail_fixture_present: true,
    source_visual_memory_readonly_plan_verified: true,
    source_visual_sample_memory_policy_verified: true,
    accepted_sample_readonly_query: true,
    rejected_pattern_readonly_query: true,
    style_dna_readonly_query: true,
    no_write_flags: true,
    real_memory_read_performed: false,
    invalid_fixture_failure_caught: negativeCaseSummary.invalid_fixture_failure_caught,
    negative_case_count: negativeCaseSummary.negative_case_count,
    caught_negative_case_count: negativeCaseSummary.caught_negative_case_count,
    all_negative_cases_caught: negativeCaseSummary.all_negative_cases_caught,
    accepted_sample_query_readonly_caught: negativeCaseSummary.accepted_sample_query_readonly_caught,
    rejected_pattern_query_readonly_caught: negativeCaseSummary.rejected_pattern_query_readonly_caught,
    style_dna_query_readonly_caught: negativeCaseSummary.style_dna_query_readonly_caught,
    no_write_flags_caught: negativeCaseSummary.no_write_flags_caught,
    daily_note_write_caught: negativeCaseSummary.daily_note_write_caught,
    real_memory_read_caught: negativeCaseSummary.real_memory_read_caught,
    provider_call_caught: negativeCaseSummary.provider_call_caught,
    image_generation_caught: negativeCaseSummary.image_generation_caught,
    runtime_call_caught: negativeCaseSummary.runtime_call_caught,
    raw_local_path_caught: negativeCaseSummary.raw_local_path_caught,
    metadata_only: true,
    readonly_query_contract_only: true,
    query_contract_dry_run_only: true,
    no_live_memory_access: true,
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
