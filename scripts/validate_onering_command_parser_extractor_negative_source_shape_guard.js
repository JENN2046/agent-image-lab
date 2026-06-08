#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const casesPath = "tests/schema_examples/onering_command_parser_extractor_negative_source_shape.example.json";

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

function countMatches(sourceText, pattern) {
  return [...sourceText.matchAll(pattern)].length;
}

function directCommandMatchSources(sourceText) {
  return [...sourceText.matchAll(/command\.match\(\/(.+)\/\);/g)].map((match) => match[1]);
}

function evaluateSourceShape(sourceText, policyFixture, canonicalFixture) {
  const directMatches = directCommandMatchSources(sourceText);
  const commandMatchCount = countMatches(sourceText, /command\.match\(/g);
  const rejectionIds = [];
  const forbiddenMatches = [];

  if (directMatches.length !== policyFixture.expected_direct_command_match_count) {
    rejectionIds.push("direct_command_match_literal_count_mismatch");
  }

  if (commandMatchCount !== policyFixture.expected_command_match_call_count) {
    rejectionIds.push("command_match_call_count_mismatch");
  }

  if (directMatches[0] !== canonicalFixture.expected_parser_regex_literal_source) {
    rejectionIds.push("direct_regex_source_mismatch");
  }

  for (const forbidden of policyFixture.forbidden_source_patterns || []) {
    const count = countMatches(sourceText, new RegExp(forbidden.pattern, "g"));
    if (count > 0) {
      rejectionIds.push(`forbidden:${forbidden.id}`);
      forbiddenMatches.push({
        id: forbidden.id,
        count,
      });
    }
  }

  return {
    accepted: rejectionIds.length === 0,
    rejectionIds,
    directMatches,
    commandMatchCount,
    forbiddenMatches,
  };
}

function main() {
  const fixture = readJson(casesPath);
  const policyFixture = readJson(fixture.policy_fixture_ref);
  const canonicalFixture = readJson(policyFixture.canonical_fixture_ref);
  const boundary = fixture.runtime_boundary || {};
  const negativeCases = fixture.negative_source_shapes || [];
  const positiveControls = fixture.positive_controls || [];

  add("fixture_type_expected", fixture.fixture_type === "onering_command_parser_extractor_negative_source_shape");
  add("policy_fixture_type_expected", policyFixture.fixture_type === fixture.expected_policy_fixture_type, {
    expected: fixture.expected_policy_fixture_type,
    actual: policyFixture.fixture_type,
  });
  add("canonical_fixture_type_expected", canonicalFixture.fixture_type === fixture.expected_canonical_fixture_type, {
    expected: fixture.expected_canonical_fixture_type,
    actual: canonicalFixture.fixture_type,
  });
  add("negative_source_shapes_non_empty", negativeCases.length > 0, negativeCases.length);
  add("positive_controls_non_empty", positiveControls.length > 0, positiveControls.length);

  for (const testCase of negativeCases) {
    const result = evaluateSourceShape(testCase.source_text, policyFixture, canonicalFixture);
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
    const result = evaluateSourceShape(control.source_text, policyFixture, canonicalFixture);
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
    validator: "validate_onering_command_parser_extractor_negative_source_shape_guard",
    cases: casesPath,
    failed_count: failed.length,
    negative_source_shape_count: negativeCases.length,
    positive_control_count: positiveControls.length,
    policy_fixture_ref: fixture.policy_fixture_ref,
    canonical_fixture_ref: policyFixture.canonical_fixture_ref,
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
    validator: "validate_onering_command_parser_extractor_negative_source_shape_guard",
    error: error.message,
  }, null, 2)}\n`);
  process.exit(1);
}
