#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const casesPath = "tests/schema_examples/onering_command_parser_extractor_robustness.example.json";

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

function countMatches(sourceText, pattern) {
  return [...sourceText.matchAll(pattern)].length;
}

function directCommandMatchSources(sourceText) {
  return [...sourceText.matchAll(/command\.match\(\/(.+)\/\);/g)].map((match) => match[1]);
}

function main() {
  const fixture = readJson(casesPath);
  const canonicalFixture = readJson(fixture.canonical_fixture_ref);
  const boundary = fixture.runtime_boundary || {};
  const parserSources = canonicalFixture.parser_sources || [];
  const forbiddenPatterns = fixture.forbidden_source_patterns || [];

  add("fixture_type_expected", fixture.fixture_type === "onering_command_parser_extractor_robustness");
  add("canonical_fixture_type_expected", canonicalFixture.fixture_type === fixture.expected_canonical_fixture_type, {
    expected: fixture.expected_canonical_fixture_type,
    actual: canonicalFixture.fixture_type,
  });
  add("parser_sources_non_empty", parserSources.length > 0, parserSources.length);
  add("forbidden_patterns_non_empty", forbiddenPatterns.length > 0, forbiddenPatterns.length);

  for (const parserSource of parserSources) {
    const sourceText = readText(parserSource.source_ref);
    const directMatches = directCommandMatchSources(sourceText);
    const commandMatchCount = countMatches(sourceText, /command\.match\(/g);

    add(`${parserSource.id}_source_present`, sourceText.length > 0, parserSource.source_ref);
    add(`${parserSource.id}_single_direct_command_match_literal`, directMatches.length === fixture.expected_direct_command_match_count, {
      expected: fixture.expected_direct_command_match_count,
      actual: directMatches.length,
      matches: directMatches,
    });
    add(`${parserSource.id}_single_command_match_call`, commandMatchCount === fixture.expected_command_match_call_count, {
      expected: fixture.expected_command_match_call_count,
      actual: commandMatchCount,
    });
    add(`${parserSource.id}_direct_regex_source_matches_canonical_fixture`, directMatches[0] === canonicalFixture.expected_parser_regex_literal_source, {
      expected: canonicalFixture.expected_parser_regex_literal_source,
      actual: directMatches[0],
    });

    for (const forbidden of forbiddenPatterns) {
      const count = countMatches(sourceText, new RegExp(forbidden.pattern, "g"));
      add(`${parserSource.id}_forbidden_pattern_absent:${forbidden.id}`, count === 0, {
        pattern: forbidden.pattern,
        count,
        reason: forbidden.reason,
      });
    }
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
    validator: "validate_onering_command_parser_extractor_robustness_guard",
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
    validator: "validate_onering_command_parser_extractor_robustness_guard",
    error: error.message,
  }, null, 2)}\n`);
  process.exit(1);
}
