#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const casesPath = "tests/schema_examples/onering_command_parser_regex_source_consistency.example.json";

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
  const boundary = fixture.runtime_boundary || {};
  const expectedRegex = fixture.expected_allowed_command_regex;
  const sourceFixtures = fixture.source_fixtures || [];
  const positiveControls = fixture.positive_controls || [];
  const negativeControls = fixture.negative_controls || [];

  add("fixture_type_expected", fixture.fixture_type === "onering_command_parser_regex_source_consistency");
  add("expected_regex_present", typeof expectedRegex === "string" && expectedRegex.length > 0, expectedRegex);
  add("source_fixtures_non_empty", sourceFixtures.length > 0, sourceFixtures.length);
  add("positive_controls_non_empty", positiveControls.length > 0, positiveControls.length);
  add("negative_controls_non_empty", negativeControls.length > 0, negativeControls.length);

  let regex = null;
  try {
    regex = new RegExp(expectedRegex);
    add("expected_regex_compiles", true);
  } catch (error) {
    add("expected_regex_compiles", false, error.message);
  }

  for (const source of sourceFixtures) {
    const sourceFixture = readJson(source.fixture_ref);
    const actualRegex = sourceFixture.allowed_command_regex;

    add(`${source.id}_fixture_type_matches`, sourceFixture.fixture_type === source.expected_fixture_type, {
      expected: source.expected_fixture_type,
      actual: sourceFixture.fixture_type,
    });
    add(`${source.id}_allowed_command_regex_present`, typeof actualRegex === "string" && actualRegex.length > 0, actualRegex);
    add(`${source.id}_allowed_command_regex_matches_expected`, actualRegex === expectedRegex, {
      expected: expectedRegex,
      actual: actualRegex,
    });
  }

  if (regex) {
    for (const control of positiveControls) {
      add(`${control.id}_accepted_by_shared_regex`, regex.test(control.command) === true, {
        command: control.command,
        regex: expectedRegex,
      });
    }

    for (const control of negativeControls) {
      add(`${control.id}_rejected_by_shared_regex`, regex.test(control.command) === false, {
        command: control.command,
        regex: expectedRegex,
        reason: control.reason,
      });
    }
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
    validator: "validate_onering_command_parser_regex_source_consistency_guard",
    cases: casesPath,
    failed_count: failed.length,
    source_fixture_count: sourceFixtures.length,
    positive_control_count: positiveControls.length,
    negative_control_count: negativeControls.length,
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
    validator: "validate_onering_command_parser_regex_source_consistency_guard",
    error: error.message,
  }, null, 2)}\n`);
  process.exit(1);
}
