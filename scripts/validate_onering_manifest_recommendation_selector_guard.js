#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const casesPath = "tests/schema_examples/onering_manifest_recommendation_selector_cases.example.json";
const recommenderScript = "scripts/recommend_validation_for_changed_files.js";
const manifestPath = "scripts/validation_manifest.json";

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

function runTargetedPlan() {
  const output = execFileSync(process.execPath, [
    repoPath("scripts/run_validation_manifest_tier.js"),
    "--tier",
    "targeted",
    "--domain",
    "onering_contract",
    "--dry-run",
  ], {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  return JSON.parse(output);
}

function manifestEntryById(manifest, id) {
  return (manifest.validators || []).find((entry) => entry.id === id);
}

function sameSet(left, right) {
  return Array.isArray(left) &&
    Array.isArray(right) &&
    left.length === right.length &&
    left.every((value) => right.includes(value));
}

function validateCase(testCase, cases, manifest) {
  const result = runRecommender(testCase.changed_files);
  const expectedValidatorIds = [...new Set([
    ...(testCase.expected_validator_ids || []),
    "onering_manifest_recommendation_selector_guard",
  ])];
  const expectedCommands = expectedValidatorIds
    .map((id) => manifestEntryById(manifest, id)?.command)
    .filter(Boolean);
  const matchedIds = (result.matches || [])
    .filter((entry) => entry.domain === "onering_contract")
    .map((entry) => entry.id);

  add(`${testCase.case_id}_recommender_passed`, result.passed === true);
  add(`${testCase.case_id}_primary_profile_targeted`, result.recommended_validation_profile?.primary_profile === cases.expected_primary_profile, result.recommended_validation_profile?.primary_profile);
  add(`${testCase.case_id}_primary_command_targeted_plan`, result.recommended_validation_profile?.primary_command === cases.expected_primary_command, result.recommended_validation_profile?.primary_command);
  add(`${testCase.case_id}_manifest_coverage_all_files_matched`, result.manifest_coverage?.all_files_matched === true, result.manifest_coverage);
  add(`${testCase.case_id}_matched_onering_validator_ids`, sameSet(matchedIds, expectedValidatorIds), {
    expected: expectedValidatorIds,
    actual: matchedIds,
  });

  for (const command of cases.expected_base_commands || []) {
    add(`${testCase.case_id}_base_command_selected_${command}`, (result.recommended_commands || []).includes(command), result.recommended_commands);
  }

  for (const command of expectedCommands) {
    add(`${testCase.case_id}_validator_command_selected_${command}`, (result.recommended_commands || []).includes(command), result.recommended_commands);
  }

  for (const expectedId of expectedValidatorIds) {
    const entry = manifestEntryById(manifest, expectedId);
    add(`${testCase.case_id}_manifest_entry_present_${expectedId}`, Boolean(entry));
    for (const changedFile of testCase.changed_files || []) {
      add(`${testCase.case_id}_trigger_path_covers_${expectedId}_${changedFile}`, entry?.trigger_paths?.includes(changedFile), entry?.trigger_paths);
    }
  }
}

function main() {
  const cases = readJson(casesPath);
  const manifest = readJson(manifestPath);
  const boundary = cases.runtime_boundary || {};
  const targetedPlan = runTargetedPlan();
  const expectedTargetedCommands = (cases.cases || [])
    .flatMap((testCase) => testCase.expected_validator_ids || [])
    .filter((id, index, ids) => ids.indexOf(id) === index)
    .map((id) => manifestEntryById(manifest, id)?.command)
    .filter(Boolean);

  add("fixture_type_expected", cases.fixture_type === "onering_manifest_recommendation_selector_cases");
  add("cases_non_empty", Array.isArray(cases.cases) && cases.cases.length > 0, cases.cases?.length);
  add("targeted_plan_onering_domain_passed", targetedPlan.passed === true, targetedPlan);
  add("targeted_plan_onering_domain_only", targetedPlan.domain === "onering_contract" && targetedPlan.tier === "targeted", targetedPlan);
  for (const command of expectedTargetedCommands) {
    add(`targeted_plan_selects_${command}`, (targetedPlan.selected_commands || []).includes(command), targetedPlan.selected_commands);
  }

  for (const testCase of cases.cases || []) {
    validateCase(testCase, cases, manifest);
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
    validator: "validate_onering_manifest_recommendation_selector_guard",
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
    validator: "validate_onering_manifest_recommendation_selector_guard",
    error: error.message,
  }, null, 2)}\n`);
  process.exit(1);
}
