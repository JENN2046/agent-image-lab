#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const YAML = require("yaml");

const root = path.resolve(__dirname, "..");
const casesPath = "tests/schema_examples/onering_mixed_change_closeout_cases.example.json";

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

function sameArray(left, right) {
  return Array.isArray(left) &&
    Array.isArray(right) &&
    left.length === right.length &&
    left.every((value, index) => value === right[index]);
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
  const closeoutRecommendation = closeout?.validation?.recommender || {};
  const closeoutCommands = closeoutRecommendation.next_commands || [];

  add(`${testCase.case_id}_has_onering_file`, testCase.changed_files.some(isOneRingSchemaExample), testCase.changed_files);
  add(`${testCase.case_id}_has_non_onering_schema_file`, testCase.changed_files.some(isNonOneRingSchemaExample), testCase.changed_files);
  add(`${testCase.case_id}_recommender_passed`, recommender.passed === true, recommender);
  add(`${testCase.case_id}_closeout_command_source`, closeoutRecommendation.command === "npm run recommend:validation:next-commands", closeoutRecommendation.command);
  add(`${testCase.case_id}_closeout_summary_path`, closeoutRecommendation.source === "validation_decision_summary.next_commands", closeoutRecommendation.source);
  add(`${testCase.case_id}_primary_profile_mvp`, closeoutRecommendation.primary_profile === fixture.expected_primary_profile, closeoutRecommendation.primary_profile);
  add(`${testCase.case_id}_primary_command_mvp`, closeoutRecommendation.primary_command === fixture.expected_primary_command, closeoutRecommendation.primary_command);
  add(`${testCase.case_id}_primary_profile_matches_recommender`, closeoutRecommendation.primary_profile === recommender.primary_profile, {
    closeout: closeoutRecommendation.primary_profile,
    recommender: recommender.primary_profile,
  });
  add(`${testCase.case_id}_primary_command_matches_recommender`, closeoutRecommendation.primary_command === recommender.primary_command, {
    closeout: closeoutRecommendation.primary_command,
    recommender: recommender.primary_command,
  });
  add(`${testCase.case_id}_next_commands_match_recommender`, sameArray(closeoutCommands, recommender.next_commands), {
    closeout: closeoutCommands,
    recommender: recommender.next_commands,
  });
  add(`${testCase.case_id}_deferred_commands_match_recommender`, JSON.stringify(closeoutRecommendation.deferred_commands || []) === JSON.stringify(recommender.deferred_commands || []), {
    closeout: closeoutRecommendation.deferred_commands || [],
    recommender: recommender.deferred_commands || [],
  });

  for (const command of fixture.required_commands || []) {
    add(`${testCase.case_id}_required_command_${command}`, closeoutCommands.includes(command), closeoutCommands);
  }
  for (const command of fixture.forbidden_commands || []) {
    add(`${testCase.case_id}_forbidden_command_absent_${command}`, !closeoutCommands.includes(command), closeoutCommands);
  }
  for (const command of testCase.expected_onering_commands || []) {
    add(`${testCase.case_id}_expected_onering_command_preserved_${command}`, closeoutCommands.includes(command), closeoutCommands);
  }

  add(`${testCase.case_id}_usage_decision_followed`, closeoutRecommendation.usage_decision === "followed", closeoutRecommendation.usage_decision);
}

function main() {
  const fixture = readJson(casesPath);
  const boundary = fixture.runtime_boundary || {};

  add("fixture_type_expected", fixture.fixture_type === "onering_mixed_change_closeout_cases");
  add("cases_non_empty", Array.isArray(fixture.cases) && fixture.cases.length > 0, fixture.cases?.length);
  add("expected_summary_path_locked", fixture.expected_summary_path === "validation.recommender.next_commands", fixture.expected_summary_path);

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
    validator: "validate_onering_mixed_change_closeout_guard",
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
    validator: "validate_onering_mixed_change_closeout_guard",
    error: error.message,
  }, null, 2)}\n`);
  process.exit(1);
}
