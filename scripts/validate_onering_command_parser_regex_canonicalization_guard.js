#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const casesPath = "tests/schema_examples/onering_command_parser_regex_canonicalization.example.json";

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

function readText(relativePath) {
  return fs.readFileSync(repoPath(relativePath), "utf8");
}

function extractCommandMatchRegexSource(sourceText) {
  const match = sourceText.match(/command\.match\(\/(.+)\/\);/);
  return match ? match[1] : null;
}

function canonicalizeParserRegexSource(regexSource) {
  if (typeof regexSource !== "string") {
    return null;
  }
  return regexSource
    .replaceAll("\\/", "/")
    .replace(/^\^node \(scripts\/validate_onering/, "^node scripts/validate_onering")
    .replace(/\\\.js\)\$$/, "\\.js$");
}

function main() {
  const fixture = readJson(casesPath);
  const canonicalFixture = readJson(fixture.canonical_fixture_ref);
  const boundary = fixture.runtime_boundary || {};
  const parserSources = fixture.parser_sources || [];
  const expectedRegex = canonicalFixture.expected_allowed_command_regex;

  add("fixture_type_expected", fixture.fixture_type === "onering_command_parser_regex_canonicalization");
  add("canonical_fixture_type_expected", canonicalFixture.fixture_type === fixture.expected_canonical_fixture_type, {
    expected: fixture.expected_canonical_fixture_type,
    actual: canonicalFixture.fixture_type,
  });
  add("expected_regex_present", typeof expectedRegex === "string" && expectedRegex.length > 0, expectedRegex);
  add("parser_sources_non_empty", parserSources.length > 0, parserSources.length);

  for (const parserSource of parserSources) {
    const sourceText = readText(parserSource.source_ref);
    const parserRegexSource = extractCommandMatchRegexSource(sourceText);
    const canonicalizedRegex = canonicalizeParserRegexSource(parserRegexSource);

    add(`${parserSource.id}_parser_source_present`, sourceText.length > 0, parserSource.source_ref);
    add(`${parserSource.id}_parser_regex_literal_present`, typeof parserRegexSource === "string", parserRegexSource);
    add(`${parserSource.id}_parser_regex_literal_matches_expected_source`, parserRegexSource === fixture.expected_parser_regex_literal_source, {
      expected: fixture.expected_parser_regex_literal_source,
      actual: parserRegexSource,
    });
    add(`${parserSource.id}_parser_regex_canonicalizes_to_fixture_regex`, canonicalizedRegex === expectedRegex, {
      expected: expectedRegex,
      actual: canonicalizedRegex,
      parser_regex_source: parserRegexSource,
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
    validator: "validate_onering_command_parser_regex_canonicalization_guard",
    cases: casesPath,
    failed_count: failed.length,
    parser_source_count: parserSources.length,
    canonical_fixture_ref: fixture.canonical_fixture_ref,
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
    validator: "validate_onering_command_parser_regex_canonicalization_guard",
    error: error.message,
  }, null, 2)}\n`);
  process.exit(1);
}
