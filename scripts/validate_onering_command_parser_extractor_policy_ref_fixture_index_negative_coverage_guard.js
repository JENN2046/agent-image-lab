#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const casesPath = "tests/schema_examples/onering_command_parser_extractor_policy_ref_fixture_index_negative_coverage.example.json";

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

function readText(relativePath) {
  return fs.readFileSync(repoPath(relativePath), "utf8");
}

function unique(values) {
  return [...new Set(values)];
}

function sorted(values) {
  return [...values].sort();
}

function sameSet(left, right) {
  const a = sorted(left);
  const b = sorted(right);
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

function sameArray(left, right) {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function extractSourceRejectionIds(source) {
  const ids = [];
  const pattern = /pushIf\(\s*rejectionIds\s*,[\s\S]*?,\s*"([a-z0-9_]+)"\s*\)/g;
  let match;
  while ((match = pattern.exec(source))) {
    ids.push(match[1]);
  }
  return ids;
}

function buildCoverageMap(negativeCases) {
  const coverage = new Map();
  for (const testCase of negativeCases) {
    for (const rejectionId of unique(testCase.expected_rejection_ids || [])) {
      if (!coverage.has(rejectionId)) {
        coverage.set(rejectionId, []);
      }
      coverage.get(rejectionId).push(testCase.case_id);
    }
  }
  return coverage;
}

function coverageEntriesToMap(entries) {
  const coverage = new Map();
  for (const entry of entries || []) {
    coverage.set(entry.rejection_id, entry.case_ids || []);
  }
  return coverage;
}

function main() {
  const fixture = readJson(casesPath);
  const negativeFixture = readJson(fixture.negative_fixture_ref);
  const source = readText(fixture.negative_guard_source_ref);
  const boundary = fixture.runtime_boundary || {};
  const sourceRejectionIds = extractSourceRejectionIds(source);
  const uniqueSourceRejectionIds = unique(sourceRejectionIds);
  const expectedSourceRejectionIds = fixture.expected_source_rejection_ids || [];
  const negativeCases = negativeFixture.negative_index_cases || [];
  const positiveControls = negativeFixture.positive_controls || [];
  const actualCoverage = buildCoverageMap(negativeCases);
  const expectedCoverage = coverageEntriesToMap(fixture.expected_rejection_coverage || []);
  const actualCoveredIds = [...actualCoverage.keys()];
  const unknownExpectedIds = actualCoveredIds.filter((id) => !uniqueSourceRejectionIds.includes(id));
  const missingSourceIds = uniqueSourceRejectionIds.filter((id) => !actualCoverage.has(id));
  const duplicateSourceIds = sourceRejectionIds.filter((id, index) => sourceRejectionIds.indexOf(id) !== index);
  const duplicateExpectedIds = expectedSourceRejectionIds.filter((id, index) => expectedSourceRejectionIds.indexOf(id) !== index);
  const duplicateExpectedCoverageIds = (fixture.expected_rejection_coverage || [])
    .map((entry) => entry.rejection_id)
    .filter((id, index, ids) => ids.indexOf(id) !== index);
  const negativeCasesWithoutExpectedRejections = negativeCases
    .filter((testCase) => !Array.isArray(testCase.expected_rejection_ids) || testCase.expected_rejection_ids.length === 0)
    .map((testCase) => testCase.case_id);
  const positiveControlsWithExpectedRejections = positiveControls
    .filter((control) => Array.isArray(control.expected_rejection_ids) && control.expected_rejection_ids.length > 0)
    .map((control) => control.case_id);

  add("fixture_type_expected", fixture.fixture_type === "onering_command_parser_extractor_policy_ref_fixture_index_negative_coverage");
  add("negative_fixture_type_expected", negativeFixture.fixture_type === fixture.expected_negative_fixture_type, {
    expected: fixture.expected_negative_fixture_type,
    actual: negativeFixture.fixture_type,
  });
  add("source_rejection_ids_non_empty", uniqueSourceRejectionIds.length > 0, uniqueSourceRejectionIds.length);
  add("source_rejection_ids_unique", duplicateSourceIds.length === 0, duplicateSourceIds);
  add("expected_source_rejection_ids_unique", duplicateExpectedIds.length === 0, duplicateExpectedIds);
  add("expected_rejection_coverage_ids_unique", duplicateExpectedCoverageIds.length === 0, duplicateExpectedCoverageIds);
  add("source_rejection_ids_match_fixture", sameSet(uniqueSourceRejectionIds, expectedSourceRejectionIds), {
    actual: sorted(uniqueSourceRejectionIds),
    expected: sorted(expectedSourceRejectionIds),
  });
  add("negative_case_count_matches_fixture", negativeCases.length === fixture.expected_negative_index_case_count, {
    actual: negativeCases.length,
    expected: fixture.expected_negative_index_case_count,
  });
  add("positive_control_count_matches_fixture", positiveControls.length === fixture.expected_positive_control_count, {
    actual: positiveControls.length,
    expected: fixture.expected_positive_control_count,
  });
  add("negative_cases_all_have_expected_rejection_ids", negativeCasesWithoutExpectedRejections.length === 0, negativeCasesWithoutExpectedRejections);
  add("positive_controls_do_not_declare_rejection_ids", positiveControlsWithExpectedRejections.length === 0, positiveControlsWithExpectedRejections);
  add("no_unknown_expected_rejection_ids", unknownExpectedIds.length === 0, unknownExpectedIds);
  add("all_source_rejection_ids_covered", missingSourceIds.length === 0, missingSourceIds);
  add("coverage_ids_match_source_ids", sameSet([...expectedCoverage.keys()], expectedSourceRejectionIds), {
    actual: sorted([...expectedCoverage.keys()]),
    expected: sorted(expectedSourceRejectionIds),
  });

  for (const rejectionId of expectedSourceRejectionIds) {
    const actualCaseIds = actualCoverage.get(rejectionId) || [];
    const expectedCaseIds = expectedCoverage.get(rejectionId) || [];
    add(`${rejectionId}_covered_by_bad_case`, actualCaseIds.length > 0, actualCaseIds);
    add(`${rejectionId}_coverage_matches_fixture`, sameArray(actualCaseIds, expectedCaseIds), {
      actual: actualCaseIds,
      expected: expectedCaseIds,
    });
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
    validator: "validate_onering_command_parser_extractor_policy_ref_fixture_index_negative_coverage_guard",
    cases: casesPath,
    failed_count: failed.length,
    source_rejection_id_count: uniqueSourceRejectionIds.length,
    covered_rejection_id_count: actualCoveredIds.length,
    negative_index_case_count: negativeCases.length,
    positive_control_count: positiveControls.length,
    negative_fixture_ref: fixture.negative_fixture_ref,
    negative_guard_source_ref: fixture.negative_guard_source_ref,
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
    validator: "validate_onering_command_parser_extractor_policy_ref_fixture_index_negative_coverage_guard",
    error: error.message,
  }, null, 2)}\n`);
  process.exit(1);
}
