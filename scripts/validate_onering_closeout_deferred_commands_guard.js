#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const YAML = require("yaml");

const root = path.resolve(__dirname, "..");
const casesPath = "tests/schema_examples/onering_closeout_deferred_commands_cases.example.json";

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

function runNodeJson(scriptPath, args) {
  const output = execFileSync(process.execPath, [
    repoPath(scriptPath),
    ...args,
  ], {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  return JSON.parse(output);
}

function runCloseoutSummary(scriptPath, files) {
  const output = execFileSync(process.execPath, [
    repoPath(scriptPath),
    "--files",
    files.join(","),
  ], {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  return YAML.parse(output);
}

function sameJson(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function isOneRingSchemaExample(file) {
  return /^tests\/schema_examples\/onering_.*\.example\.json$/.test(file);
}

function isNonOneRingSchemaExample(file) {
  return file.startsWith("tests/schema_examples/") && !isOneRingSchemaExample(file);
}

function validateCase(testCase, fixture) {
  const recommender = runNodeJson(fixture.recommender, [
    "--files",
    testCase.changed_files.join(","),
    "--next-commands=json",
  ]);
  const closeout = runCloseoutSummary(fixture.closeout_helper, testCase.changed_files);
  const closeoutDeferred = closeout?.validation?.recommender?.deferred_commands || [];
  const recommenderDeferred = recommender.deferred_commands || [];
  const expectedDeferred = closeoutDeferred.find((entry) =>
    entry.command === fixture.expected_deferred_command &&
      entry.deferred_to_command === fixture.expected_deferred_to_command
  );

  add(`${testCase.case_id}_has_onering_file`, testCase.changed_files.some(isOneRingSchemaExample), testCase.changed_files);
  add(`${testCase.case_id}_has_non_onering_schema_file`, testCase.changed_files.some(isNonOneRingSchemaExample), testCase.changed_files);
  add(`${testCase.case_id}_recommender_passed`, recommender.passed === true, recommender);
  add(`${testCase.case_id}_closeout_deferred_commands_match_recommender`, sameJson(closeoutDeferred, recommenderDeferred), {
    closeout: closeoutDeferred,
    recommender: recommenderDeferred,
  });
  add(`${testCase.case_id}_expected_archive_capsule_deferred_present`, Boolean(expectedDeferred), closeoutDeferred);
  add(`${testCase.case_id}_expected_deferred_matched_files_preserved`, sameJson(expectedDeferred?.matched_files || [], testCase.changed_files), expectedDeferred);
}

function main() {
  const fixture = readJson(casesPath);
  const boundary = fixture.runtime_boundary || {};

  add("fixture_type_expected", fixture.fixture_type === "onering_closeout_deferred_commands_cases");
  add("cases_non_empty", Array.isArray(fixture.cases) && fixture.cases.length > 0, fixture.cases?.length);
  add("expected_summary_path_locked", fixture.expected_summary_path === "validation.recommender.deferred_commands", fixture.expected_summary_path);

  for (const testCase of fixture.cases || []) {
    validateCase(testCase, fixture);
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
    validator: "validate_onering_closeout_deferred_commands_guard",
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
    validator: "validate_onering_closeout_deferred_commands_guard",
    error: error.message,
  }, null, 2)}\n`);
  process.exit(1);
}
