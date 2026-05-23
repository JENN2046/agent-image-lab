#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const YAML = require("yaml");

const root = path.resolve(__dirname, "..");
const phase = "v0_6_24_exact_new_trial_3shot_stability_preflight";
const docPath = "docs/V0_6_24_EXACT_NEW_TRIAL_3SHOT_STABILITY_PREFLIGHT.md";
const planPath = "stability_tests/plans/safe_adult_editorial_portrait_v1_3shot_stability_preflight.yaml";
const registryPath = "stability_tests/three_shot_stability_plan_registry.yaml";
const readmePath = "stability_tests/README.md";
const schemaPath = "schemas/exact_new_trial_3shot_stability_preflight.schema.yaml";
const reportPath = "reports/visual_asset_eval_dry_run/v0_6_24_exact_new_trial_3shot_stability_preflight.json";
const passFixturePath = "tests/schema_examples/exact_new_trial_3shot_stability_preflight.example.json";
const failFixturePath = "tests/schema_examples/exact_new_trial_3shot_stability_preflight_fail.json";

const expectedPrompt = "prompts/image_generation/safe_adult_editorial_portrait_v1.yaml";
const expectedProviderRoute = "image_gen.imagegen";
const sourceAttempt = "v0_3_3_exact_new_trial_002";
const plannedShotIds = [
  "v0_3_3_exact_new_trial_003_shot_1",
  "v0_3_3_exact_new_trial_003_shot_2",
  "v0_3_3_exact_new_trial_003_shot_3"
];

const forbiddenTrueBoundaryFlags = [
  "can_execute_now",
  "provider_call_performed",
  "image_generation_performed",
  "source_002_overwrite_allowed",
  "raw_provider_response_capture_allowed",
  "secret_value_read_allowed",
  "VCP_memory_write_allowed",
  "DailyNote_write_allowed",
  "accepted_sample_auto_promotion_allowed",
  "production_candidate_allowed",
  "push_allowed",
  "push_performed"
];

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

function readYaml(relativePath) {
  return YAML.parse(read(relativePath));
}

function exists(relativePath) {
  return fs.existsSync(repoPath(relativePath));
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function assertNoRawOrSecretPath(value, context) {
  if (typeof value === "string") {
    assert(!/^[A-Za-z]:[\\/]/.test(value), `Raw local drive path found in ${context}`);
    assert(!/\.env(\.|$)|config\.env|token|cookie|secret/i.test(value), `Secret-sensitive token found in ${context}`);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => assertNoRawOrSecretPath(item, `${context}.${index}`));
    return;
  }
  if (value && typeof value === "object") {
    Object.entries(value).forEach(([key, item]) => assertNoRawOrSecretPath(item, `${context}.${key}`));
  }
}

function uniqueValues(items, key) {
  return new Set(items.map((item) => item[key])).size === items.length;
}

function assertNotSource002(value, context) {
  assert(typeof value === "string", `${context} must be a string`);
  assert(!value.includes("v0_3_3_exact_new_trial_002"), `${context} must not reuse or overwrite 002`);
}

function validateShots(shots, context, options = {}) {
  assert(Array.isArray(shots), `${context}.shots must be an array`);
  assert(shots.length === 3, `${context}.shots must contain exactly 3 shots`);
  assert(JSON.stringify(shots.map((shot) => shot.shot_id)) === JSON.stringify(plannedShotIds), `${context}.shots must preserve planned shot ids`);

  for (const field of [
    "output_directory",
    "payload_capture_ref",
    "attempt_result_path",
    "receipt_path",
    "registry_path",
    "review_console_bridge_ref"
  ]) {
    assert(uniqueValues(shots, field), `${context}.${field} values must be unique per shot`);
  }

  for (const shot of shots) {
    assert(shot.status === "planned_not_executed", `${context}.${shot.shot_id}.status mismatch`);
    assert(shot.max_provider_calls === 1, `${context}.${shot.shot_id}.max_provider_calls must be 1`);
    assert(shot.max_image_candidates === 1, `${context}.${shot.shot_id}.max_image_candidates must be 1`);
    assert(shot.retry_allowed === false, `${context}.${shot.shot_id}.retry_allowed must be false`);
    assert(shot.overwrite_existing_files_allowed === false, `${context}.${shot.shot_id}.overwrite_existing_files_allowed must be false`);
    assert(shot.raw_provider_payload_capture_required === true, `${context}.${shot.shot_id}.payload capture must be required`);
    assert(shot.raw_provider_response_capture_allowed === false, `${context}.${shot.shot_id}.raw response capture must be false`);
    assert(shot.requires_independent_receipt === true, `${context}.${shot.shot_id}.independent receipt required`);
    assert(shot.requires_independent_registry === true, `${context}.${shot.shot_id}.independent registry required`);
    assert(shot.requires_independent_payload_capture === true, `${context}.${shot.shot_id}.independent payload capture required`);

    assertNotSource002(shot.output_directory, `${context}.${shot.shot_id}.output_directory`);
    assertNotSource002(shot.payload_capture_ref, `${context}.${shot.shot_id}.payload_capture_ref`);
    assertNotSource002(shot.attempt_result_path, `${context}.${shot.shot_id}.attempt_result_path`);
    assertNotSource002(shot.receipt_path, `${context}.${shot.shot_id}.receipt_path`);
    assertNotSource002(shot.registry_path, `${context}.${shot.shot_id}.registry_path`);
    assertNotSource002(shot.review_console_bridge_ref, `${context}.${shot.shot_id}.review_console_bridge_ref`);

    if (options.checkFuturePathsAbsent) {
      assert(!exists(shot.output_directory), `${context}.${shot.shot_id}.output_directory already exists`);
      assert(!exists(shot.payload_capture_ref), `${context}.${shot.shot_id}.payload_capture_ref already exists`);
      assert(!exists(shot.attempt_result_path), `${context}.${shot.shot_id}.attempt_result_path already exists`);
      assert(!exists(shot.receipt_path), `${context}.${shot.shot_id}.receipt_path already exists`);
      assert(!exists(shot.registry_path), `${context}.${shot.shot_id}.registry_path already exists`);
      assert(!exists(shot.review_console_bridge_ref), `${context}.${shot.shot_id}.review_console_bridge_ref already exists`);
    }
  }
}

function validateBoundary(boundary, context) {
  assert(boundary && typeof boundary === "object", `${context}.boundary missing`);
  for (const flag of forbiddenTrueBoundaryFlags) {
    if (Object.prototype.hasOwnProperty.call(boundary, flag)) {
      assert(boundary[flag] === false, `${context}.boundary.${flag} must remain false`);
    }
  }
  assert(boundary.raw_provider_payload_capture_required_per_shot === true || !Object.prototype.hasOwnProperty.call(boundary, "raw_provider_payload_capture_required_per_shot"), `${context}.boundary.raw_provider_payload_capture_required_per_shot mismatch`);
}

function validateRecord(record, context, options = {}) {
  assert(record && typeof record === "object", `${context} missing`);
  assertNoRawOrSecretPath(record, context);
  assert(record.phase === phase, `${context}.phase mismatch`);
  assert(record.prompt_package_ref === expectedPrompt, `${context}.prompt_package_ref mismatch`);
  assert(record.provider_route === expectedProviderRoute, `${context}.provider_route mismatch`);
  assert(record.source_success_attempt_id === sourceAttempt, `${context}.source_success_attempt_id mismatch`);
  assert(record.shot_count === 3, `${context}.shot_count must be 3`);
  validateShots(record.shots, context, options);
  validateBoundary(record.boundary, context);
}

function validatePlan(plan) {
  const record = plan.three_shot_stability_preflight;
  assert(record.plan_id === "safe_adult_editorial_portrait_v1_3shot_imagegen_stability_preflight", "plan_id mismatch");
  assert(record.status === "preflight_ready_no_generation", "plan status mismatch");
  assert(record.execution_authorized_by_this_record === false, "plan must not authorize execution");
  assert(record.can_execute_now === false, "plan can_execute_now must be false");
  assert(record.target.prompt_package_ref === expectedPrompt, "plan target prompt mismatch");
  assert(record.target.source_success_attempt_id === sourceAttempt, "plan source attempt mismatch");
  assert(record.target.overwrite_source_002_allowed === false, "plan must block 002 overwrite");
  assert(record.provider.provider_route === expectedProviderRoute, "plan provider route mismatch");
  assert(record.provider.provider_tool === expectedProviderRoute, "plan provider tool mismatch");
  assert(record.safety.provider_call_performed === false, "plan provider_call_performed must be false");
  assert(record.safety.image_generation_performed === false, "plan image_generation_performed must be false");
  assert(record.safety.batch_generation_authorized === false, "plan batch generation must be false");
  assert(record.safety.retry_allowed === false, "plan retry must be false");
  assert(record.safety.source_002_overwrite_allowed === false, "plan 002 overwrite must be false");
  assert(record.safety.raw_provider_payload_capture_required_per_shot === true, "plan payload capture must be required per shot");
  assert(record.safety.raw_provider_response_capture_allowed === false, "plan raw response capture must be false");
  assert(record.safety.secret_value_read_allowed === false, "plan secret read must be false");
  assert(record.safety.VCP_memory_write_allowed === false, "plan memory write must be false");
  assert(record.safety.DailyNote_write_allowed === false, "plan DailyNote write must be false");
  assert(record.safety.accepted_sample_auto_promotion_allowed === false, "plan promotion must be false");
  assert(record.safety.production_candidate_allowed === false, "plan production candidate must be false");
  assert(record.safety.push_allowed === false, "plan push must be false");
  validateShots(record.shots, "plan", { checkFuturePathsAbsent: true });
  assert(record.stability_scoring.succeeded_image_generated_3_of_3.rating === "stable_generation_route_candidate", "3/3 scoring mismatch");
  assert(record.stability_scoring.succeeded_image_generated_2_of_3.rating === "conditional_stable_requires_failed_shot_trace_analysis", "2/3 scoring mismatch");
  assert(record.stability_scoring.succeeded_image_generated_0_or_1_of_3.rating === "unstable_stop_generation", "0-1/3 scoring mismatch");
}

function expectFailure(baseRecord, caseId, mutate) {
  const candidate = clone(baseRecord);
  mutate(candidate);
  try {
    validateRecord(candidate, caseId);
  } catch (error) {
    return { case_id: caseId, result: "caught", failure_message: error.message };
  }
  throw new Error(`${caseId} was not caught`);
}

function validateNegativeCases(validRecord, invalidRecord) {
  let invalidFixtureCaught = false;
  try {
    validateRecord(invalidRecord, "invalid_fixture");
  } catch {
    invalidFixtureCaught = true;
  }
  assert(invalidFixtureCaught, "invalid fixture must fail");

  const cases = [
    expectFailure(validRecord, "provider_route_drift", (candidate) => { candidate.provider_route = "other.route"; }),
    expectFailure(validRecord, "prompt_drift", (candidate) => { candidate.prompt_package_ref = "other.yaml"; }),
    expectFailure(validRecord, "source_attempt_drift", (candidate) => { candidate.source_success_attempt_id = "v0_3_3_exact_new_trial_001"; }),
    expectFailure(validRecord, "shot_count_drift", (candidate) => { candidate.shot_count = 2; }),
    expectFailure(validRecord, "missing_shot", (candidate) => { candidate.shots.pop(); }),
    expectFailure(validRecord, "duplicate_payload_path", (candidate) => { candidate.shots[1].payload_capture_ref = candidate.shots[0].payload_capture_ref; }),
    expectFailure(validRecord, "duplicate_receipt_path", (candidate) => { candidate.shots[1].receipt_path = candidate.shots[0].receipt_path; }),
    expectFailure(validRecord, "reuse_002_output", (candidate) => { candidate.shots[0].output_directory = "runs/real_generation/v0_3_3_exact_new_trial_002/"; }),
    expectFailure(validRecord, "retry_allowed", (candidate) => { candidate.shots[0].retry_allowed = true; }),
    expectFailure(validRecord, "overwrite_allowed", (candidate) => { candidate.shots[0].overwrite_existing_files_allowed = true; }),
    expectFailure(validRecord, "raw_response_allowed", (candidate) => { candidate.shots[0].raw_provider_response_capture_allowed = true; }),
    expectFailure(validRecord, "receipt_not_independent", (candidate) => { candidate.shots[0].requires_independent_receipt = false; }),
    expectFailure(validRecord, "registry_not_independent", (candidate) => { candidate.shots[0].requires_independent_registry = false; }),
    expectFailure(validRecord, "payload_not_independent", (candidate) => { candidate.shots[0].requires_independent_payload_capture = false; }),
    expectFailure(validRecord, "can_execute_now", (candidate) => { candidate.boundary.can_execute_now = true; }),
    expectFailure(validRecord, "provider_call_performed", (candidate) => { candidate.boundary.provider_call_performed = true; }),
    expectFailure(validRecord, "image_generation_performed", (candidate) => { candidate.boundary.image_generation_performed = true; }),
    expectFailure(validRecord, "secret_allowed", (candidate) => { candidate.boundary.secret_value_read_allowed = true; }),
    expectFailure(validRecord, "memory_allowed", (candidate) => { candidate.boundary.VCP_memory_write_allowed = true; }),
    expectFailure(validRecord, "push_allowed", (candidate) => { candidate.boundary.push_allowed = true; }),
    expectFailure(validRecord, "raw_local_path", (candidate) => { candidate.plan_ref = "C:\\private\\plan.yaml"; }),
    expectFailure(validRecord, "secret_path", (candidate) => { candidate.plan_ref = ".env"; })
  ];

  return {
    invalid_fixture_failure_caught: invalidFixtureCaught,
    negative_case_count: cases.length,
    caught_negative_case_count: cases.filter((item) => item.result === "caught").length,
    all_negative_cases_caught: cases.every((item) => item.result === "caught")
  };
}

function main() {
  for (const relativePath of [docPath, planPath, registryPath, readmePath, schemaPath, reportPath, passFixturePath, failFixturePath, expectedPrompt]) {
    assert(exists(relativePath), `Missing required file: ${relativePath}`);
  }

  const doc = read(docPath);
  const registry = read(registryPath);
  const readme = read(readmePath);
  const schema = read(schemaPath);
  const plan = readYaml(planPath);
  const reportRecord = readJson(reportPath).exact_new_trial_3shot_stability_preflight;
  const passRecord = readJson(passFixturePath).exact_new_trial_3shot_stability_preflight;
  const failRecord = readJson(failFixturePath).exact_new_trial_3shot_stability_preflight;

  for (const token of [
    "3/3 succeeded_image_generated",
    "2/3 succeeded_image_generated",
    "0-1/3 succeeded_image_generated",
    "no provider call in this preflight",
    "no retry",
    "no overwrite of `002`",
    "no raw provider response capture",
    "no secret read"
  ]) {
    assert(doc.includes(token), `doc missing token: ${token}`);
  }
  assert(registry.includes("safe_adult_editorial_portrait_v1_3shot_imagegen_stability_preflight"), "registry missing new plan id");
  assert(readme.includes("Generation-Path Stability Protocol"), "README missing generation-path protocol section");
  assert(schema.includes("exact_new_trial_3shot_stability_preflight"), "schema missing root id");

  validatePlan(plan);
  validateRecord(reportRecord, "report", { checkFuturePathsAbsent: true });
  validateRecord(passRecord, "pass_fixture");
  const negativeSummary = validateNegativeCases(passRecord, failRecord);

  const output = {
    passed: true,
    validator: "validate_exact_new_trial_3shot_stability_preflight",
    phase,
    plan_ref: planPath,
    report_ref: reportPath,
    prompt_package_ref: reportRecord.prompt_package_ref,
    provider_route: reportRecord.provider_route,
    source_success_attempt_id: reportRecord.source_success_attempt_id,
    shot_count: reportRecord.shot_count,
    planned_shot_ids: reportRecord.shots.map((shot) => shot.shot_id),
    all_shot_paths_unique: true,
    source_002_overwrite_allowed: reportRecord.boundary.source_002_overwrite_allowed,
    provider_call_performed: reportRecord.boundary.provider_call_performed,
    image_generation_performed: reportRecord.boundary.image_generation_performed,
    retry_allowed: reportRecord.boundary.retry_allowed,
    raw_provider_response_capture_allowed: reportRecord.boundary.raw_provider_response_capture_allowed,
    secret_value_read_allowed: reportRecord.boundary.secret_value_read_allowed,
    VCP_memory_write_allowed: reportRecord.boundary.VCP_memory_write_allowed,
    DailyNote_write_allowed: reportRecord.boundary.DailyNote_write_allowed,
    accepted_sample_auto_promotion_allowed: reportRecord.boundary.accepted_sample_auto_promotion_allowed,
    production_candidate_allowed: reportRecord.boundary.production_candidate_allowed,
    push_allowed: reportRecord.boundary.push_allowed,
    future_paths_absent_now: true,
    ...negativeSummary
  };

  console.log(JSON.stringify(output, null, 2));
}

try {
  main();
} catch (error) {
  console.error(error.stack || error.message);
  process.exit(1);
}
