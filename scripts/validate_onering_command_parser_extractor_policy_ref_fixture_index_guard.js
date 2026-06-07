#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const casesPath = "tests/schema_examples/onering_command_parser_extractor_policy_ref_fixture_index.example.json";

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

function main() {
  const fixture = readJson(casesPath);
  const consistencyFixture = readJson(fixture.policy_ref_consistency_fixture_ref);
  const negativeFixture = readJson(fixture.policy_ref_negative_fixture_ref);
  const robustnessFixture = readJson(fixture.robustness_fixture_ref);
  const negativeSourceShapeFixture = readJson(fixture.negative_source_shape_fixture_ref);
  const canonicalFixture = readJson(fixture.canonical_fixture_ref);
  const canonicalSourceFixture = readJson(canonicalFixture.canonical_fixture_ref);
  const policyFixture = readJson(negativeSourceShapeFixture.policy_fixture_ref);
  const boundary = fixture.runtime_boundary || {};

  add("fixture_type_expected", fixture.fixture_type === "onering_command_parser_extractor_policy_ref_fixture_index");
  add("consistency_fixture_type_expected", consistencyFixture.fixture_type === fixture.expected_consistency_fixture_type, {
    expected: fixture.expected_consistency_fixture_type,
    actual: consistencyFixture.fixture_type,
  });
  add("negative_fixture_type_expected", negativeFixture.fixture_type === fixture.expected_negative_fixture_type, {
    expected: fixture.expected_negative_fixture_type,
    actual: negativeFixture.fixture_type,
  });
  add("robustness_fixture_type_expected", robustnessFixture.fixture_type === fixture.expected_policy_fixture_type, {
    expected: fixture.expected_policy_fixture_type,
    actual: robustnessFixture.fixture_type,
  });
  add("negative_source_shape_fixture_type_expected", negativeSourceShapeFixture.fixture_type === fixture.expected_negative_source_shape_fixture_type, {
    expected: fixture.expected_negative_source_shape_fixture_type,
    actual: negativeSourceShapeFixture.fixture_type,
  });
  add("canonical_fixture_type_expected", canonicalFixture.fixture_type === fixture.expected_canonical_fixture_type, {
    expected: fixture.expected_canonical_fixture_type,
    actual: canonicalFixture.fixture_type,
  });
  add("canonical_source_fixture_type_expected", canonicalSourceFixture.fixture_type === fixture.expected_canonical_source_fixture_type, {
    expected: fixture.expected_canonical_source_fixture_type,
    actual: canonicalSourceFixture.fixture_type,
  });

  add("consistency_backref_points_to_negative_fixture", consistencyFixture.policy_ref_negative_fixture_ref === fixture.policy_ref_negative_fixture_ref, {
    expected: fixture.policy_ref_negative_fixture_ref,
    actual: consistencyFixture.policy_ref_negative_fixture_ref,
  });
  add("negative_backref_points_to_consistency_fixture", negativeFixture.policy_ref_consistency_fixture_ref === fixture.policy_ref_consistency_fixture_ref, {
    expected: fixture.policy_ref_consistency_fixture_ref,
    actual: negativeFixture.policy_ref_consistency_fixture_ref,
  });
  add("policy_ref_fixtures_mutually_reference_each_other", (
    consistencyFixture.policy_ref_negative_fixture_ref === fixture.policy_ref_negative_fixture_ref &&
    negativeFixture.policy_ref_consistency_fixture_ref === fixture.policy_ref_consistency_fixture_ref
  ), {
    consistency_to_negative: consistencyFixture.policy_ref_negative_fixture_ref,
    negative_to_consistency: negativeFixture.policy_ref_consistency_fixture_ref,
  });

  add("consistency_robustness_ref_matches_index", consistencyFixture.robustness_fixture_ref === fixture.robustness_fixture_ref, {
    expected: fixture.robustness_fixture_ref,
    actual: consistencyFixture.robustness_fixture_ref,
  });
  add("negative_robustness_ref_matches_index", negativeFixture.robustness_fixture_ref === fixture.robustness_fixture_ref, {
    expected: fixture.robustness_fixture_ref,
    actual: negativeFixture.robustness_fixture_ref,
  });
  add("consistency_negative_source_shape_ref_matches_index", consistencyFixture.negative_source_shape_fixture_ref === fixture.negative_source_shape_fixture_ref, {
    expected: fixture.negative_source_shape_fixture_ref,
    actual: consistencyFixture.negative_source_shape_fixture_ref,
  });
  add("negative_negative_source_shape_ref_matches_index", negativeFixture.negative_source_shape_fixture_ref === fixture.negative_source_shape_fixture_ref, {
    expected: fixture.negative_source_shape_fixture_ref,
    actual: negativeFixture.negative_source_shape_fixture_ref,
  });
  add("consistency_canonical_ref_matches_index", consistencyFixture.canonical_fixture_ref === fixture.canonical_fixture_ref, {
    expected: fixture.canonical_fixture_ref,
    actual: consistencyFixture.canonical_fixture_ref,
  });
  add("negative_canonical_ref_matches_index", negativeFixture.canonical_fixture_ref === fixture.canonical_fixture_ref, {
    expected: fixture.canonical_fixture_ref,
    actual: negativeFixture.canonical_fixture_ref,
  });
  add("consistency_shared_canonical_ref_matches_index", consistencyFixture.expected_shared_canonical_fixture_ref === fixture.expected_shared_canonical_fixture_ref, {
    expected: fixture.expected_shared_canonical_fixture_ref,
    actual: consistencyFixture.expected_shared_canonical_fixture_ref,
  });
  add("negative_shared_canonical_ref_matches_index", negativeFixture.expected_shared_canonical_fixture_ref === fixture.expected_shared_canonical_fixture_ref, {
    expected: fixture.expected_shared_canonical_fixture_ref,
    actual: negativeFixture.expected_shared_canonical_fixture_ref,
  });

  add("robustness_canonical_ref_matches_index", robustnessFixture.canonical_fixture_ref === fixture.canonical_fixture_ref, {
    expected: fixture.canonical_fixture_ref,
    actual: robustnessFixture.canonical_fixture_ref,
  });
  add("negative_source_shape_policy_ref_matches_robustness", negativeSourceShapeFixture.policy_fixture_ref === fixture.robustness_fixture_ref, {
    expected: fixture.robustness_fixture_ref,
    actual: negativeSourceShapeFixture.policy_fixture_ref,
  });
  add("policy_fixture_type_matches_robustness", policyFixture.fixture_type === robustnessFixture.fixture_type, {
    expected: robustnessFixture.fixture_type,
    actual: policyFixture.fixture_type,
  });
  add("policy_fixture_canonical_ref_matches_robustness", policyFixture.canonical_fixture_ref === robustnessFixture.canonical_fixture_ref, {
    expected: robustnessFixture.canonical_fixture_ref,
    actual: policyFixture.canonical_fixture_ref,
  });

  add("consistency_expected_canonical_type_matches_actual", consistencyFixture.expected_canonical_fixture_type === canonicalFixture.fixture_type, {
    expected: consistencyFixture.expected_canonical_fixture_type,
    actual: canonicalFixture.fixture_type,
  });
  add("negative_expected_canonical_type_matches_actual", negativeFixture.expected_canonical_fixture_type === canonicalFixture.fixture_type, {
    expected: negativeFixture.expected_canonical_fixture_type,
    actual: canonicalFixture.fixture_type,
  });
  add("negative_expected_consistency_type_matches_actual", negativeFixture.expected_consistency_fixture_type === consistencyFixture.fixture_type, {
    expected: negativeFixture.expected_consistency_fixture_type,
    actual: consistencyFixture.fixture_type,
  });
  add("common_canonical_refs_do_not_drift", [
    consistencyFixture.canonical_fixture_ref,
    consistencyFixture.expected_shared_canonical_fixture_ref,
    negativeFixture.canonical_fixture_ref,
    negativeFixture.expected_shared_canonical_fixture_ref,
    robustnessFixture.canonical_fixture_ref,
    policyFixture.canonical_fixture_ref,
  ].every((ref) => ref === fixture.canonical_fixture_ref), {
    expected: fixture.canonical_fixture_ref,
    actual: {
      consistency_canonical_fixture_ref: consistencyFixture.canonical_fixture_ref,
      consistency_expected_shared_canonical_fixture_ref: consistencyFixture.expected_shared_canonical_fixture_ref,
      negative_canonical_fixture_ref: negativeFixture.canonical_fixture_ref,
      negative_expected_shared_canonical_fixture_ref: negativeFixture.expected_shared_canonical_fixture_ref,
      robustness_canonical_fixture_ref: robustnessFixture.canonical_fixture_ref,
      policy_canonical_fixture_ref: policyFixture.canonical_fixture_ref,
    },
  });

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
    validator: "validate_onering_command_parser_extractor_policy_ref_fixture_index_guard",
    cases: casesPath,
    failed_count: failed.length,
    policy_ref_consistency_fixture_ref: fixture.policy_ref_consistency_fixture_ref,
    policy_ref_negative_fixture_ref: fixture.policy_ref_negative_fixture_ref,
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
    validator: "validate_onering_command_parser_extractor_policy_ref_fixture_index_guard",
    error: error.message,
  }, null, 2)}\n`);
  process.exit(1);
}
