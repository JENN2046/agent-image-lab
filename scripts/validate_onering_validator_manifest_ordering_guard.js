#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const casesPath = "tests/schema_examples/onering_validator_manifest_ordering.example.json";

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

function runDryRun(fixture) {
  const output = execFileSync(process.execPath, [
    repoPath(fixture.runner),
    ...(fixture.dry_run_args || []),
  ], {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  return JSON.parse(output);
}

function sameArray(left, right) {
  return Array.isArray(left) &&
    Array.isArray(right) &&
    left.length === right.length &&
    left.every((value, index) => value === right[index]);
}

function main() {
  const fixture = readJson(casesPath);
  const boundary = fixture.runtime_boundary || {};
  const dryRun = runDryRun(fixture);

  add("fixture_type_expected", fixture.fixture_type === "onering_validator_manifest_ordering");
  add("expected_commands_non_empty", Array.isArray(fixture.expected_selected_commands) && fixture.expected_selected_commands.length > 0, fixture.expected_selected_commands?.length);
  add("dry_run_passed", dryRun.passed === true, dryRun);
  add("dry_run_scope_onering_targeted", dryRun.tier === "targeted" && dryRun.domain === "onering_contract" && dryRun.dry_run === true, dryRun);
  add("selected_count_matches_expected", dryRun.selected_command_count === fixture.expected_selected_commands.length, {
    actual: dryRun.selected_command_count,
    expected: fixture.expected_selected_commands.length,
  });
  add("selected_commands_exact_order", sameArray(dryRun.selected_commands, fixture.expected_selected_commands), {
    actual: dryRun.selected_commands,
    expected: fixture.expected_selected_commands,
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
    validator: "validate_onering_validator_manifest_ordering_guard",
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
    validator: "validate_onering_validator_manifest_ordering_guard",
    error: error.message,
  }, null, 2)}\n`);
  process.exit(1);
}
