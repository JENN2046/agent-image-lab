#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const casesPath = "tests/schema_examples/onering_command_parser_extractor_policy_ref_negative_fixture.example.json";

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

function evaluateCase(testCase, fixture, sourceFixtures) {
  const negativeFixture = {
    ...cloneJson(sourceFixtures.negativeSourceShapeFixture),
    ...(testCase.candidate_negative_source_shape_fixture || {}),
  };
  const robustnessFixture = {
    ...cloneJson(sourceFixtures.robustnessFixture),
    ...(testCase.candidate_robustness_fixture || {}),
  };
  const policyFixture = readJson(negativeFixture.policy_fixture_ref);
  const canonicalFixture = sourceFixtures.canonicalFixture;
  const rejectionIds = [];

  if (negativeFixture.policy_fixture_ref !== fixture.robustness_fixture_ref) {
    rejectionIds.push("policy_ref_must_equal_robustness_fixture_ref");
  }

  if (policyFixture.fixture_type !== fixture.expected_policy_fixture_type) {
    rejectionIds.push("policy_ref_type_must_be_robustness");
  }

  if (robustnessFixture.canonical_fixture_ref !== fixture.expected_shared_canonical_fixture_ref) {
    rejectionIds.push("robustness_canonical_ref_must_equal_shared_canonical_ref");
  }

  if (robustnessFixture.canonical_fixture_ref !== fixture.canonical_fixture_ref) {
    rejectionIds.push("robustness_canonical_ref_must_equal_fixture_canonical_ref");
  }

  if (policyFixture.canonical_fixture_ref !== robustnessFixture.canonical_fixture_ref) {
    rejectionIds.push("policy_canonical_ref_must_equal_robustness_canonical_ref");
  }

  if (negativeFixture.expected_canonical_fixture_type !== robustnessFixture.expected_canonical_fixture_type) {
    rejectionIds.push("negative_expected_canonical_type_must_match_robustness");
  }

  if (robustnessFixture.expected_canonical_fixture_type !== canonicalFixture.fixture_type) {
    rejectionIds.push("robustness_expected_canonical_type_must_match_canonical_fixture");
  }

  if (negativeFixture.expected_canonical_fixture_type !== canonicalFixture.fixture_type) {
    rejectionIds.push("negative_expected_canonical_type_must_match_canonical_fixture");
  }

  return {
    accepted: rejectionIds.length === 0,
    rejectionIds,
    policy_fixture_ref: negativeFixture.policy_fixture_ref,
    policy_fixture_type: policyFixture.fixture_type,
    robustness_canonical_fixture_ref: robustnessFixture.canonical_fixture_ref,
    policy_canonical_fixture_ref: policyFixture.canonical_fixture_ref || null,
    negative_expected_canonical_fixture_type: negativeFixture.expected_canonical_fixture_type,
    robustness_expected_canonical_fixture_type: robustnessFixture.expected_canonical_fixture_type,
  };
}

function main() {
  const fixture = readJson(casesPath);
  const robustnessFixture = readJson(fixture.robustness_fixture_ref);
  const negativeSourceShapeFixture = readJson(fixture.negative_source_shape_fixture_ref);
  const consistencyFixture = readJson(fixture.policy_ref_consistency_fixture_ref);
  const canonicalFixture = readJson(fixture.canonical_fixture_ref);
  const boundary = fixture.runtime_boundary || {};
  const negativeCases = fixture.negative_ref_cases || [];
  const positiveControls = fixture.positive_controls || [];
  const sourceFixtures = {
    robustnessFixture,
    negativeSourceShapeFixture,
    canonicalFixture,
  };

  add("fixture_type_expected", fixture.fixture_type === "onering_command_parser_extractor_policy_ref_negative_fixture");
  add("robustness_fixture_type_expected", robustnessFixture.fixture_type === fixture.expected_policy_fixture_type, {
    expected: fixture.expected_policy_fixture_type,
    actual: robustnessFixture.fixture_type,
  });
  add("negative_source_shape_fixture_type_expected", negativeSourceShapeFixture.fixture_type === fixture.expected_negative_source_shape_fixture_type, {
    expected: fixture.expected_negative_source_shape_fixture_type,
    actual: negativeSourceShapeFixture.fixture_type,
  });
  add("consistency_fixture_type_expected", consistencyFixture.fixture_type === fixture.expected_consistency_fixture_type, {
    expected: fixture.expected_consistency_fixture_type,
    actual: consistencyFixture.fixture_type,
  });
  add("canonical_fixture_type_expected", canonicalFixture.fixture_type === fixture.expected_canonical_fixture_type, {
    expected: fixture.expected_canonical_fixture_type,
    actual: canonicalFixture.fixture_type,
  });
  add("negative_ref_cases_non_empty", negativeCases.length > 0, negativeCases.length);
  add("positive_controls_non_empty", positiveControls.length > 0, positiveControls.length);

  for (const testCase of negativeCases) {
    const result = evaluateCase(testCase, fixture, sourceFixtures);
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
    const result = evaluateCase(control, fixture, sourceFixtures);
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
    validator: "validate_onering_command_parser_extractor_policy_ref_negative_fixture_guard",
    cases: casesPath,
    failed_count: failed.length,
    negative_ref_case_count: negativeCases.length,
    positive_control_count: positiveControls.length,
    robustness_fixture_ref: fixture.robustness_fixture_ref,
    negative_source_shape_fixture_ref: fixture.negative_source_shape_fixture_ref,
    shared_canonical_fixture_ref: fixture.canonical_fixture_ref,
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
    validator: "validate_onering_command_parser_extractor_policy_ref_negative_fixture_guard",
    error: error.message,
  }, null, 2)}\n`);
  process.exit(1);
}
