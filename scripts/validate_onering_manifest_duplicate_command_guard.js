#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const casesPath = "tests/schema_examples/onering_manifest_duplicate_command.example.json";

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

function sorted(values) {
  return [...values].sort((left, right) => left.localeCompare(right));
}

function sameSet(left, right) {
  const sortedLeft = sorted(left);
  const sortedRight = sorted(right);
  return sortedLeft.length === sortedRight.length &&
    sortedLeft.every((value, index) => value === sortedRight[index]);
}

function duplicateValues(values) {
  const counts = new Map();
  for (const value of values) {
    counts.set(value, (counts.get(value) || 0) + 1);
  }
  return [...counts.entries()]
    .filter(([, count]) => count > 1)
    .map(([value, count]) => ({ value, count }));
}

function main() {
  const fixture = readJson(casesPath);
  const manifest = readJson(fixture.manifest_ref);
  const boundary = fixture.runtime_boundary || {};
  const validators = manifest.validators || [];
  const oneringValidators = validators.filter((validator) => validator.domain === fixture.domain);
  const actualCommands = oneringValidators.map((validator) => validator.command);
  const expectedCommands = fixture.expected_commands || [];
  const duplicateCommands = duplicateValues(actualCommands);

  add("fixture_type_expected", fixture.fixture_type === "onering_manifest_duplicate_command");
  add("manifest_validators_present", Array.isArray(manifest.validators));
  add("expected_commands_non_empty", expectedCommands.length > 0, expectedCommands.length);
  add("onering_command_set_matches_fixture", sameSet(actualCommands, expectedCommands), {
    actual: sorted(actualCommands),
    expected: sorted(expectedCommands),
  });
  add("onering_command_count_matches_fixture", actualCommands.length === expectedCommands.length, {
    actual: actualCommands.length,
    expected: expectedCommands.length,
  });
  add("onering_unique_command_count_matches_validator_count", new Set(actualCommands).size === actualCommands.length, {
    validator_count: actualCommands.length,
    unique_command_count: new Set(actualCommands).size,
  });
  add("onering_duplicate_commands_absent", duplicateCommands.length === 0, duplicateCommands);

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
    validator: "validate_onering_manifest_duplicate_command_guard",
    cases: casesPath,
    failed_count: failed.length,
    expected_command_count: expectedCommands.length,
    actual_command_count: actualCommands.length,
    duplicate_command_count: duplicateCommands.length,
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
    validator: "validate_onering_manifest_duplicate_command_guard",
    error: error.message,
  }, null, 2)}\n`);
  process.exit(1);
}
