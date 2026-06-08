#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const casesPath = "tests/schema_examples/onering_selector_negative_cases.example.json";
const recommenderScript = "scripts/recommend_validation_for_changed_files.js";

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

function runRecommender(files) {
  const output = execFileSync(process.execPath, [
    repoPath(recommenderScript),
    "--files",
    files.join(","),
  ], {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  return JSON.parse(output);
}

function validateCase(testCase, fixture) {
  const result = runRecommender(testCase.changed_files);
  const commands = result.recommended_commands || [];
  const oneringMatches = (result.matches || []).filter((entry) => entry.domain === "onering_contract");

  add(`${testCase.case_id}_recommender_passed`, result.passed === true);
  add(`${testCase.case_id}_primary_profile_mvp`, result.recommended_validation_profile?.primary_profile === fixture.expected_primary_profile, result.recommended_validation_profile?.primary_profile);
  add(`${testCase.case_id}_primary_command_mvp`, result.recommended_validation_profile?.primary_command === fixture.expected_primary_command, result.recommended_validation_profile?.primary_command);
  add(`${testCase.case_id}_manifest_coverage_all_files_matched`, result.manifest_coverage?.all_files_matched === true, result.manifest_coverage);
  add(`${testCase.case_id}_mvp_recommended`, result.mvp_recommended === true, result.mvp_recommended);
  add(`${testCase.case_id}_daily_not_recommended`, result.active_recommended === false, result.active_recommended);
  add(`${testCase.case_id}_no_onering_matches`, oneringMatches.length === 0, oneringMatches);

  for (const changedFile of testCase.changed_files || []) {
    add(`${testCase.case_id}_file_is_non_onering_schema_example_${changedFile}`, changedFile.startsWith("tests/schema_examples/") && !/\/onering_/.test(changedFile), changedFile);
    add(`${testCase.case_id}_matched_file_${changedFile}`, result.manifest_coverage?.matched_files?.includes(changedFile), result.manifest_coverage);
  }

  for (const command of fixture.required_commands || []) {
    add(`${testCase.case_id}_required_command_${command}`, commands.includes(command), commands);
  }
  for (const command of fixture.forbidden_commands || []) {
    add(`${testCase.case_id}_forbidden_command_absent_${command}`, !commands.includes(command), commands);
  }
}

function main() {
  const fixture = readJson(casesPath);
  const boundary = fixture.runtime_boundary || {};

  add("fixture_type_expected", fixture.fixture_type === "onering_selector_negative_cases");
  add("cases_non_empty", Array.isArray(fixture.cases) && fixture.cases.length > 0, fixture.cases?.length);

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
    validator: "validate_onering_selector_negative_cases_guard",
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
    validator: "validate_onering_selector_negative_cases_guard",
    error: error.message,
  }, null, 2)}\n`);
  process.exit(1);
}
