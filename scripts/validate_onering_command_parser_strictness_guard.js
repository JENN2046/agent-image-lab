#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const casesPath = "tests/schema_examples/onering_command_parser_strictness.example.json";

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

function strictCommandTarget(command) {
  if (typeof command !== "string") {
    return null;
  }
  const match = command.match(/^node (scripts\/validate_onering[a-z0-9_]*\.js)$/);
  return match ? match[1] : null;
}

function main() {
  const fixture = readJson(casesPath);
  const packageJson = readJson(fixture.package_ref);
  const manifest = readJson(fixture.manifest_ref);
  const boundary = fixture.runtime_boundary || {};
  const scripts = packageJson.scripts || {};
  const validators = manifest.validators || [];
  const oneringValidators = validators.filter((validator) => validator.domain === fixture.domain);
  const expectedEntries = fixture.expected_entries || [];

  const expectedIds = expectedEntries.map((entry) => entry.manifest_id);
  const actualIds = oneringValidators.map((validator) => validator.id);
  const expectedScriptNames = expectedEntries.map((entry) => entry.npm_script);
  const actualScriptNames = Object.keys(scripts).filter((scriptName) => scriptName.startsWith("validate:onering-"));

  add("fixture_type_expected", fixture.fixture_type === "onering_command_parser_strictness");
  add("expected_entries_non_empty", expectedEntries.length > 0, expectedEntries.length);
  add("package_scripts_present", packageJson.scripts && typeof packageJson.scripts === "object");
  add("manifest_validators_present", Array.isArray(manifest.validators));
  add("onering_manifest_id_set_matches_fixture", sameSet(actualIds, expectedIds), {
    actual: sorted(actualIds),
    expected: sorted(expectedIds),
  });
  add("onering_npm_script_set_matches_fixture", sameSet(actualScriptNames, expectedScriptNames), {
    actual: sorted(actualScriptNames),
    expected: sorted(expectedScriptNames),
  });

  for (const entry of expectedEntries) {
    const manifestEntry = oneringValidators.find((validator) => validator.id === entry.manifest_id);
    const packageCommand = scripts[entry.npm_script];
    const manifestTarget = strictCommandTarget(manifestEntry?.command);
    const packageTarget = strictCommandTarget(packageCommand);

    add(`${entry.manifest_id}_entry_present`, Boolean(manifestEntry));
    add(`${entry.manifest_id}_package_script_exists`, typeof packageCommand === "string", {
      npm_script: entry.npm_script,
      actual: packageCommand,
    });
    add(`${entry.manifest_id}_manifest_command_strict_node_validate_onering_target`, manifestTarget === entry.expected_target, {
      expected: entry.expected_target,
      actual: manifestEntry?.command,
      parsed_target: manifestTarget,
    });
    add(`${entry.manifest_id}_npm_script_command_strict_node_validate_onering_target`, packageTarget === entry.expected_target, {
      expected: entry.expected_target,
      actual: packageCommand,
      parsed_target: packageTarget,
    });
    add(`${entry.manifest_id}_manifest_script_matches_strict_target`, manifestEntry?.script === entry.expected_target, {
      expected: entry.expected_target,
      actual: manifestEntry?.script,
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
    validator: "validate_onering_command_parser_strictness_guard",
    cases: casesPath,
    failed_count: failed.length,
    expected_entry_count: expectedEntries.length,
    actual_validator_count: oneringValidators.length,
    actual_npm_script_count: actualScriptNames.length,
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
    validator: "validate_onering_command_parser_strictness_guard",
    error: error.message,
  }, null, 2)}\n`);
  process.exit(1);
}
