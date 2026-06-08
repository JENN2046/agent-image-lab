#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const casesPath = "tests/schema_examples/onering_command_parser_extractor_policy_ref_fixture_index_negative.example.json";

const checks = [];

function add(check, passed, detail) {
  checks.push({
    check,
    passed: Boolean(passed),
    ...(detail === undefined ? {} : { detail }),
  });
}

function repoPath(relativePath) {
  const resolved = path.resolve(root, relativePath);
  const relative = path.relative(root, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`path escapes repository root: ${relativePath}`);
  }
  return resolved;
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(repoPath(relativePath), "utf8"));
}

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

function readJsonMaybe(relativePath) {
  try {
    return { value: readJson(relativePath), error: null };
  } catch (error) {
    return { value: null, error: error.message };
  }
}

function loadCandidate(relativePath, patch) {
  const loaded = readJsonMaybe(relativePath);
  if (loaded.error) {
    return { value: null, error: loaded.error };
  }
  return {
    value: {
      ...cloneJson(loaded.value),
      ...(patch || {}),
    },
    error: null,
  };
}

function pushIf(rejectionIds, condition, id) {
  if (condition) {
    rejectionIds.push(id);
  }
}

function evaluateCase(testCase, baseIndexFixture) {
  const indexFixture = {
    ...cloneJson(baseIndexFixture),
    ...(testCase.candidate_index_fixture || {}),
  };
  const rejectionIds = [];

  const consistency = loadCandidate(
    indexFixture.policy_ref_consistency_fixture_ref,
    testCase.candidate_consistency_fixture
  );
  const negative = loadCandidate(
    indexFixture.policy_ref_negative_fixture_ref,
    testCase.candidate_negative_fixture
  );
  const robustness = loadCandidate(
    indexFixture.robustness_fixture_ref,
    testCase.candidate_robustness_fixture
  );
  const negativeSourceShape = loadCandidate(
    indexFixture.negative_source_shape_fixture_ref,
    testCase.candidate_negative_source_shape_fixture
  );
  const canonical = loadCandidate(
    indexFixture.canonical_fixture_ref,
    testCase.candidate_canonical_fixture
  );

  const consistencyFixture = consistency.value;
  const negativeFixture = negative.value;
  const robustnessFixture = robustness.value;
  const negativeSourceShapeFixture = negativeSourceShape.value;
  const canonicalFixture = canonical.value;

  const canonicalSourceRef = canonicalFixture && canonicalFixture.canonical_fixture_ref;
  const canonicalSource = canonicalSourceRef ? loadCandidate(canonicalSourceRef).value : null;
  const policyRef = negativeSourceShapeFixture && negativeSourceShapeFixture.policy_fixture_ref;
  const policy = policyRef ? loadCandidate(policyRef, testCase.candidate_policy_fixture) : { value: null, error: "policy_fixture_ref missing" };
  const policyFixture = policy.value;

  pushIf(rejectionIds, Boolean(consistency.error), "consistency_fixture_must_be_readable");
  pushIf(rejectionIds, Boolean(negative.error), "negative_fixture_must_be_readable");
  pushIf(rejectionIds, Boolean(robustness.error), "robustness_fixture_must_be_readable");
  pushIf(rejectionIds, Boolean(negativeSourceShape.error), "negative_source_shape_fixture_must_be_readable");
  pushIf(rejectionIds, Boolean(canonical.error), "canonical_fixture_must_be_readable");
  pushIf(rejectionIds, !canonicalSourceRef, "canonical_source_fixture_ref_required");
  pushIf(rejectionIds, Boolean(policy.error), "policy_fixture_must_be_readable");

  pushIf(
    rejectionIds,
    !consistencyFixture || consistencyFixture.fixture_type !== indexFixture.expected_consistency_fixture_type,
    "consistency_fixture_type_must_match_index"
  );
  pushIf(
    rejectionIds,
    !negativeFixture || negativeFixture.fixture_type !== indexFixture.expected_negative_fixture_type,
    "negative_fixture_type_must_match_index"
  );
  pushIf(
    rejectionIds,
    !robustnessFixture || robustnessFixture.fixture_type !== indexFixture.expected_policy_fixture_type,
    "robustness_fixture_type_must_match_index"
  );
  pushIf(
    rejectionIds,
    !negativeSourceShapeFixture || negativeSourceShapeFixture.fixture_type !== indexFixture.expected_negative_source_shape_fixture_type,
    "negative_source_shape_fixture_type_must_match_index"
  );
  pushIf(
    rejectionIds,
    !canonicalFixture || canonicalFixture.fixture_type !== indexFixture.expected_canonical_fixture_type,
    "canonical_fixture_type_must_match_index"
  );
  pushIf(
    rejectionIds,
    !canonicalSource || canonicalSource.fixture_type !== indexFixture.expected_canonical_source_fixture_type,
    "canonical_source_fixture_type_must_match_index"
  );

  const consistencyBackrefOk = Boolean(
    consistencyFixture &&
    consistencyFixture.policy_ref_negative_fixture_ref === indexFixture.policy_ref_negative_fixture_ref
  );
  const negativeBackrefOk = Boolean(
    negativeFixture &&
    negativeFixture.policy_ref_consistency_fixture_ref === indexFixture.policy_ref_consistency_fixture_ref
  );

  pushIf(
    rejectionIds,
    !consistencyBackrefOk,
    "consistency_backref_must_point_to_index_negative_fixture"
  );
  pushIf(
    rejectionIds,
    !negativeBackrefOk,
    "negative_backref_must_point_to_index_consistency_fixture"
  );
  pushIf(
    rejectionIds,
    !(consistencyBackrefOk && negativeBackrefOk),
    "policy_ref_fixtures_must_mutually_reference_index_refs"
  );

  pushIf(
    rejectionIds,
    !consistencyFixture || consistencyFixture.robustness_fixture_ref !== indexFixture.robustness_fixture_ref,
    "consistency_robustness_ref_must_match_index"
  );
  pushIf(
    rejectionIds,
    !negativeFixture || negativeFixture.robustness_fixture_ref !== indexFixture.robustness_fixture_ref,
    "negative_robustness_ref_must_match_index"
  );
  pushIf(
    rejectionIds,
    !consistencyFixture || consistencyFixture.negative_source_shape_fixture_ref !== indexFixture.negative_source_shape_fixture_ref,
    "consistency_negative_source_shape_ref_must_match_index"
  );
  pushIf(
    rejectionIds,
    !negativeFixture || negativeFixture.negative_source_shape_fixture_ref !== indexFixture.negative_source_shape_fixture_ref,
    "negative_negative_source_shape_ref_must_match_index"
  );
  pushIf(
    rejectionIds,
    !consistencyFixture || consistencyFixture.canonical_fixture_ref !== indexFixture.canonical_fixture_ref,
    "consistency_canonical_ref_must_match_index"
  );
  pushIf(
    rejectionIds,
    !negativeFixture || negativeFixture.canonical_fixture_ref !== indexFixture.canonical_fixture_ref,
    "negative_canonical_ref_must_match_index"
  );
  pushIf(
    rejectionIds,
    !consistencyFixture || consistencyFixture.expected_shared_canonical_fixture_ref !== indexFixture.expected_shared_canonical_fixture_ref,
    "consistency_shared_canonical_ref_must_match_index"
  );
  pushIf(
    rejectionIds,
    !negativeFixture || negativeFixture.expected_shared_canonical_fixture_ref !== indexFixture.expected_shared_canonical_fixture_ref,
    "negative_shared_canonical_ref_must_match_index"
  );
  pushIf(
    rejectionIds,
    !robustnessFixture || robustnessFixture.canonical_fixture_ref !== indexFixture.canonical_fixture_ref,
    "robustness_canonical_ref_must_match_index"
  );
  pushIf(
    rejectionIds,
    !negativeSourceShapeFixture || negativeSourceShapeFixture.policy_fixture_ref !== indexFixture.robustness_fixture_ref,
    "negative_source_shape_policy_ref_must_match_index_robustness"
  );
  pushIf(
    rejectionIds,
    !policyFixture || !robustnessFixture || policyFixture.fixture_type !== robustnessFixture.fixture_type,
    "policy_fixture_type_must_match_robustness"
  );
  pushIf(
    rejectionIds,
    !policyFixture || !robustnessFixture || policyFixture.canonical_fixture_ref !== robustnessFixture.canonical_fixture_ref,
    "policy_canonical_ref_must_match_robustness"
  );
  pushIf(
    rejectionIds,
    indexFixture.expected_shared_canonical_fixture_ref !== indexFixture.canonical_fixture_ref,
    "shared_canonical_ref_must_match_index_canonical_ref"
  );

  const commonCanonicalRefs = {
    consistency_canonical_fixture_ref: consistencyFixture && consistencyFixture.canonical_fixture_ref,
    consistency_expected_shared_canonical_fixture_ref: consistencyFixture && consistencyFixture.expected_shared_canonical_fixture_ref,
    negative_canonical_fixture_ref: negativeFixture && negativeFixture.canonical_fixture_ref,
    negative_expected_shared_canonical_fixture_ref: negativeFixture && negativeFixture.expected_shared_canonical_fixture_ref,
    robustness_canonical_fixture_ref: robustnessFixture && robustnessFixture.canonical_fixture_ref,
    policy_canonical_fixture_ref: policyFixture && policyFixture.canonical_fixture_ref,
  };
  pushIf(
    rejectionIds,
    Object.values(commonCanonicalRefs).some((ref) => ref !== indexFixture.canonical_fixture_ref),
    "common_canonical_refs_must_match_index"
  );

  return {
    accepted: rejectionIds.length === 0,
    rejectionIds,
    index_refs: {
      policy_ref_consistency_fixture_ref: indexFixture.policy_ref_consistency_fixture_ref,
      policy_ref_negative_fixture_ref: indexFixture.policy_ref_negative_fixture_ref,
      robustness_fixture_ref: indexFixture.robustness_fixture_ref,
      negative_source_shape_fixture_ref: indexFixture.negative_source_shape_fixture_ref,
      canonical_fixture_ref: indexFixture.canonical_fixture_ref,
      expected_shared_canonical_fixture_ref: indexFixture.expected_shared_canonical_fixture_ref,
    },
    loaded_fixture_types: {
      consistency_fixture_type: consistencyFixture && consistencyFixture.fixture_type,
      negative_fixture_type: negativeFixture && negativeFixture.fixture_type,
      robustness_fixture_type: robustnessFixture && robustnessFixture.fixture_type,
      negative_source_shape_fixture_type: negativeSourceShapeFixture && negativeSourceShapeFixture.fixture_type,
      canonical_fixture_type: canonicalFixture && canonicalFixture.fixture_type,
      canonical_source_fixture_type: canonicalSource && canonicalSource.fixture_type,
      policy_fixture_type: policyFixture && policyFixture.fixture_type,
    },
    common_canonical_refs: commonCanonicalRefs,
  };
}

function main() {
  const fixture = readJson(casesPath);
  const indexFixture = readJson(fixture.index_fixture_ref);
  const boundary = fixture.runtime_boundary || {};
  const negativeCases = fixture.negative_index_cases || [];
  const positiveControls = fixture.positive_controls || [];

  add("fixture_type_expected", fixture.fixture_type === "onering_command_parser_extractor_policy_ref_fixture_index_negative");
  add("index_fixture_type_expected", indexFixture.fixture_type === fixture.expected_index_fixture_type, {
    expected: fixture.expected_index_fixture_type,
    actual: indexFixture.fixture_type,
  });
  add("negative_index_cases_non_empty", negativeCases.length > 0, negativeCases.length);
  add("positive_controls_non_empty", positiveControls.length > 0, positiveControls.length);

  for (const testCase of negativeCases) {
    const result = evaluateCase(testCase, indexFixture);
    const missingExpectedRejections = (testCase.expected_rejection_ids || []).filter(
      (id) => !result.rejectionIds.includes(id)
    );

    add(`${testCase.case_id}_rejected`, result.accepted === false, result);
    add(`${testCase.case_id}_expected_rejection_ids_present`, missingExpectedRejections.length === 0, {
      expected: testCase.expected_rejection_ids,
      actual: result.rejectionIds,
      missing: missingExpectedRejections,
    });
  }

  for (const control of positiveControls) {
    const result = evaluateCase(control, indexFixture);
    add(`${control.case_id}_accepted`, result.accepted === true, result);
  }

  add("no_handler_true", boundary.no_handler === true);
  add("handler_execution_forbidden", boundary.handler_execution_performed === false);
  add("migration_execution_forbidden", boundary.migration_execution_performed === false);
  add("sqlite_file_creation_forbidden", boundary.sqlite_file_created === false);
  add("database_write_forbidden", boundary.database_write_performed === false);
  add("provider_contact_forbidden", boundary.provider_contact_performed === false);
  add("plugin_call_forbidden", boundary.plugin_call_performed === false);
  add("api_call_forbidden", boundary.api_call_performed === false);
  add("image_generation_forbidden", boundary.image_generation_performed === false);
  add("secret_read_forbidden", boundary.secret_value_read_performed === false);

  const failed = checks.filter((check) => !check.passed);
  const output = {
    passed: failed.length === 0,
    validator: "validate_onering_command_parser_extractor_policy_ref_fixture_index_negative_guard",
    cases: casesPath,
    failed_count: failed.length,
    negative_index_case_count: negativeCases.length,
    positive_control_count: positiveControls.length,
    index_fixture_ref: fixture.index_fixture_ref,
    handler_execution_performed: false,
    migration_execution_performed: false,
    sqlite_file_created: false,
    database_write_performed: false,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    secret_value_read_performed: false,
    file_write_performed: false,
    checks,
  };

  process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
  process.exit(output.passed ? 0 : 1);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${JSON.stringify({
    passed: false,
    validator: "validate_onering_command_parser_extractor_policy_ref_fixture_index_negative_guard",
    error: error.message,
  }, null, 2)}\n`);
  process.exit(1);
}
