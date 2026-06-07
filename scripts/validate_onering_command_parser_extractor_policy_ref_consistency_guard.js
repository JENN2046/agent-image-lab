#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const casesPath = "tests/schema_examples/onering_command_parser_extractor_policy_ref_consistency.example.json";

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
  const robustnessFixture = readJson(fixture.robustness_fixture_ref);
  const negativeSourceShapeFixture = readJson(fixture.negative_source_shape_fixture_ref);
  const policyFixture = readJson(negativeSourceShapeFixture.policy_fixture_ref);
  const canonicalFixture = readJson(fixture.canonical_fixture_ref);
  const boundary = fixture.runtime_boundary || {};

  add("fixture_type_expected", fixture.fixture_type === "onering_command_parser_extractor_policy_ref_consistency");
  add("robustness_fixture_type_expected", robustnessFixture.fixture_type === fixture.expected_robustness_fixture_type, {
    expected: fixture.expected_robustness_fixture_type,
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
  add("negative_policy_fixture_ref_matches_robustness_fixture_ref", negativeSourceShapeFixture.policy_fixture_ref === fixture.robustness_fixture_ref, {
    expected: fixture.robustness_fixture_ref,
    actual: negativeSourceShapeFixture.policy_fixture_ref,
  });
  add("negative_policy_fixture_ref_matches_expected", negativeSourceShapeFixture.policy_fixture_ref === fixture.expected_policy_fixture_ref, {
    expected: fixture.expected_policy_fixture_ref,
    actual: negativeSourceShapeFixture.policy_fixture_ref,
  });
  add("negative_policy_fixture_type_matches_robustness", policyFixture.fixture_type === robustnessFixture.fixture_type, {
    expected: robustnessFixture.fixture_type,
    actual: policyFixture.fixture_type,
  });
  add("robustness_canonical_ref_matches_expected", robustnessFixture.canonical_fixture_ref === fixture.expected_shared_canonical_fixture_ref, {
    expected: fixture.expected_shared_canonical_fixture_ref,
    actual: robustnessFixture.canonical_fixture_ref,
  });
  add("robustness_canonical_ref_matches_fixture_canonical_ref", robustnessFixture.canonical_fixture_ref === fixture.canonical_fixture_ref, {
    expected: fixture.canonical_fixture_ref,
    actual: robustnessFixture.canonical_fixture_ref,
  });
  add("negative_policy_canonical_ref_matches_robustness_canonical_ref", policyFixture.canonical_fixture_ref === robustnessFixture.canonical_fixture_ref, {
    expected: robustnessFixture.canonical_fixture_ref,
    actual: policyFixture.canonical_fixture_ref,
  });
  add("negative_expected_canonical_type_matches_robustness", negativeSourceShapeFixture.expected_canonical_fixture_type === robustnessFixture.expected_canonical_fixture_type, {
    expected: robustnessFixture.expected_canonical_fixture_type,
    actual: negativeSourceShapeFixture.expected_canonical_fixture_type,
  });
  add("robustness_expected_canonical_type_matches_actual", robustnessFixture.expected_canonical_fixture_type === canonicalFixture.fixture_type, {
    expected: robustnessFixture.expected_canonical_fixture_type,
    actual: canonicalFixture.fixture_type,
  });
  add("negative_expected_canonical_type_matches_actual", negativeSourceShapeFixture.expected_canonical_fixture_type === canonicalFixture.fixture_type, {
    expected: negativeSourceShapeFixture.expected_canonical_fixture_type,
    actual: canonicalFixture.fixture_type,
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
    validator: "validate_onering_command_parser_extractor_policy_ref_consistency_guard",
    cases: casesPath,
    failed_count: failed.length,
    robustness_fixture_ref: fixture.robustness_fixture_ref,
    negative_source_shape_fixture_ref: fixture.negative_source_shape_fixture_ref,
    negative_policy_fixture_ref: negativeSourceShapeFixture.policy_fixture_ref,
    shared_canonical_fixture_ref: robustnessFixture.canonical_fixture_ref,
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
    validator: "validate_onering_command_parser_extractor_policy_ref_consistency_guard",
    error: error.message,
  }, null, 2)}\n`);
  process.exit(1);
}
