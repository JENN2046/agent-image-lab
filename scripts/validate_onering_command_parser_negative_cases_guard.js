#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const casesPath = "tests/schema_examples/onering_command_parser_negative_cases.example.json";

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

function strictCommandTarget(command) {
  if (typeof command !== "string") {
    return null;
  }
  const match = command.match(/^node (scripts\/validate_onering[a-z0-9_]*\.js)$/);
  return match ? match[1] : null;
}

function main() {
  const fixture = readJson(casesPath);
  const boundary = fixture.runtime_boundary || {};
  const negativeCases = fixture.negative_cases || [];
  const positiveControls = fixture.positive_controls || [];
  const requiredCategories = fixture.required_negative_categories || [];
  const actualCategories = new Set(negativeCases.map((entry) => entry.category));

  add("fixture_type_expected", fixture.fixture_type === "onering_command_parser_negative_cases");
  add("negative_cases_non_empty", negativeCases.length > 0, negativeCases.length);
  add("positive_controls_non_empty", positiveControls.length > 0, positiveControls.length);

  for (const category of requiredCategories) {
    add(`required_negative_category_present:${category}`, actualCategories.has(category), {
      required_category: category,
      actual_categories: [...actualCategories].sort(),
    });
  }

  for (const entry of negativeCases) {
    const parsedTarget = strictCommandTarget(entry.command);
    add(`${entry.id}_rejected`, parsedTarget === null, {
      category: entry.category,
      command: entry.command,
      parsed_target: parsedTarget,
      reason: entry.reason,
    });
  }

  for (const entry of positiveControls) {
    const parsedTarget = strictCommandTarget(entry.command);
    add(`${entry.id}_accepted`, parsedTarget === entry.expected_target, {
      command: entry.command,
      expected_target: entry.expected_target,
      parsed_target: parsedTarget,
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
    validator: "validate_onering_command_parser_negative_cases_guard",
    cases: casesPath,
    failed_count: failed.length,
    negative_case_count: negativeCases.length,
    positive_control_count: positiveControls.length,
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
    validator: "validate_onering_command_parser_negative_cases_guard",
    error: error.message,
  }, null, 2)}\n`);
  process.exit(1);
}
