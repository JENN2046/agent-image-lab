#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const casesPath = "tests/schema_examples/onering_manifest_status_runtime_class.example.json";

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

function main() {
  const fixture = readJson(casesPath);
  const manifest = readJson(fixture.manifest_ref);
  const boundary = fixture.runtime_boundary || {};
  const validators = manifest.validators || [];
  const oneringValidators = validators.filter((validator) => validator.domain === fixture.domain);
  const expectedEntries = fixture.expected_entries || [];

  const expectedIds = expectedEntries.map((entry) => entry.manifest_id);
  const actualIds = oneringValidators.map((validator) => validator.id);

  add("fixture_type_expected", fixture.fixture_type === "onering_manifest_status_runtime_class");
  add("expected_status_active", fixture.expected_status === "active", fixture.expected_status);
  add("expected_runtime_class_fast", fixture.expected_runtime_class === "fast", fixture.expected_runtime_class);
  add("expected_entries_non_empty", expectedEntries.length > 0, expectedEntries.length);
  add("manifest_validators_present", Array.isArray(manifest.validators));
  add("onering_manifest_id_set_matches_fixture", sameSet(actualIds, expectedIds), {
    actual: sorted(actualIds),
    expected: sorted(expectedIds),
  });

  for (const entry of expectedEntries) {
    const manifestEntry = oneringValidators.find((validator) => validator.id === entry.manifest_id);
    const expectedStatus = entry.status || fixture.expected_status;
    const expectedRuntimeClass = entry.estimated_runtime_class || fixture.expected_runtime_class;

    add(`${entry.manifest_id}_entry_present`, Boolean(manifestEntry));
    add(`${entry.manifest_id}_status_matches`, manifestEntry?.status === expectedStatus, {
      expected: expectedStatus,
      actual: manifestEntry?.status,
    });
    add(`${entry.manifest_id}_runtime_class_matches`, manifestEntry?.estimated_runtime_class === expectedRuntimeClass, {
      expected: expectedRuntimeClass,
      actual: manifestEntry?.estimated_runtime_class,
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
    validator: "validate_onering_manifest_status_runtime_class_guard",
    cases: casesPath,
    failed_count: failed.length,
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
    validator: "validate_onering_manifest_status_runtime_class_guard",
    error: error.message,
  }, null, 2)}\n`);
  process.exit(1);
}
