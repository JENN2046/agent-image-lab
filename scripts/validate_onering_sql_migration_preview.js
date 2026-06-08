#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const contractPath = "tests/schema_examples/onering_sql_hash_contract.example.json";
const previewPath = "tests/schema_examples/onering_sql_migration_preview.example.json";
const negativeCasesPath = "tests/schema_examples/onering_sql_migration_preview_negative_cases.example.json";

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

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function stableJson(value) {
  if (Array.isArray(value)) {
    return `[${value.map(stableJson).join(",")}]`;
  }
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableJson(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function sha256(value) {
  return `sha256:${crypto.createHash("sha256").update(value, "utf8").digest("hex")}`;
}

function setByPath(target, pathExpression, value) {
  const parts = pathExpression.split(".");
  let current = target;
  for (const part of parts.slice(0, -1)) {
    current = current[part];
  }
  current[parts[parts.length - 1]] = value;
}

function removeStatementIncluding(target, needle) {
  target.migration_preview.statements = target.migration_preview.statements.filter((statement) => !statement.includes(needle));
  target.migration_preview.statement_count = target.migration_preview.statements.length;
}

function columnSql(column) {
  const constraints = column.constraints.length > 0 ? ` ${column.constraints.join(" ")}` : "";
  return `${column.name} ${column.type}${constraints}`;
}

function buildPreviewStatements(contract) {
  const statements = [];
  for (const table of contract.sql_contract.tables) {
    statements.push(`CREATE TABLE IF NOT EXISTS ${table.name} (${table.columns.map(columnSql).join(", ")});`);
    for (const index of table.indexes) {
      const unique = index.unique ? "UNIQUE " : "";
      statements.push(`CREATE ${unique}INDEX IF NOT EXISTS ${index.name} ON ${table.name} (${index.columns.join(", ")});`);
    }
  }
  statements.push("PRAGMA user_version = 1;");
  return statements;
}

function extractCreatedTables(statements) {
  return statements
    .map((statement) => /^CREATE TABLE IF NOT EXISTS ([a-z0-9_]+) /i.exec(statement)?.[1])
    .filter(Boolean)
    .sort();
}

function validatePreview(preview, contract) {
  const localChecks = [];
  const record = (check, passed, detail) => {
    localChecks.push({ check, passed: Boolean(passed), ...(detail === undefined ? {} : { detail }) });
  };

  const expectedStatements = buildPreviewStatements(contract);
  const previewStatements = preview.migration_preview?.statements || [];
  const contractTables = contract.sql_contract.tables.map((table) => table.name).sort();
  const previewTables = extractCreatedTables(previewStatements);
  const boundary = preview.preview_boundary || {};

  record("fixture_type_expected", preview.fixture_type === "onering_sql_migration_preview");
  record("source_contract_ref_expected", preview.source_contract === contractPath);
  record("source_contract_id_matches", preview.source_contract_id === contract.contract_id);
  record("source_migration_id_matches", preview.source_migration_id === contract.sql_contract.migration_id);
  record("source_ddl_hash_matches_contract", preview.source_ddl_hash === contract.sql_contract.ddl_hash);
  record("engine_sqlite_expected", preview.migration_preview?.engine === contract.sql_contract.engine && preview.migration_preview?.engine === "sqlite");
  record("preview_mode_only", preview.migration_preview?.mode === "preview_only");
  record("preview_statement_count_matches", preview.migration_preview?.statement_count === previewStatements.length, preview.migration_preview?.statement_count);
  record("preview_statements_match_contract", stableJson(previewStatements) === stableJson(expectedStatements), expectedStatements);
  record("preview_tables_match_contract", stableJson(previewTables) === stableJson(contractTables), { previewTables, contractTables });
  record("preview_hash_matches_statements", preview.migration_preview?.preview_hash === sha256(stableJson(previewStatements)), sha256(stableJson(previewStatements)));

  record("no_handler_true", boundary.no_handler === true);
  record("handler_files_untouched", boundary.handler_files_touched === false);
  record("handler_execution_forbidden", boundary.handler_execution_performed === false);
  record("migration_execution_forbidden", boundary.migration_execution_performed === false);
  record("sqlite_file_creation_forbidden", boundary.sqlite_file_created === false);
  record("database_write_forbidden", boundary.database_write_performed === false);
  record("provider_contact_forbidden", boundary.provider_contact_performed === false);
  record("plugin_call_forbidden", boundary.plugin_call_performed === false);
  record("api_call_forbidden", boundary.api_call_performed === false);
  record("image_generation_forbidden", boundary.image_generation_performed === false);
  record("secret_read_forbidden", boundary.secret_value_read_performed === false);

  record("request_identity_matches_contract", preview.request_identity_preview?.request_identity === contract.request_contract.request_identity);
  record("snapshot_hash_matches_contract", preview.request_identity_preview?.snapshot_hash === contract.snapshot_contract.snapshot_hash);
  record("temp_key_hash_matches_contract", preview.request_identity_preview?.temp_key_hash === contract.temp_store_contract.entries[0].temp_key_hash);
  record("temp_store_persistent_store_forbidden", preview.temp_store_preview?.persistent_store_allowed === false);
  record("preview_temp_write_forbidden", preview.temp_store_preview?.preview_temp_write_allowed === false);
  record("temp_store_ttl_max_bounded", Number.isInteger(preview.temp_store_preview?.ttl_seconds_max) && preview.temp_store_preview.ttl_seconds_max <= 3600);
  record("temp_store_entry_count_matches_contract", preview.temp_store_preview?.source_temp_entries === contract.temp_store_contract.entries.length);
  record("temp_store_all_entries_purgeable", preview.temp_store_preview?.all_entries_purgeable === contract.temp_store_contract.entries.every((entry) => entry.purgeable === true));

  return localChecks;
}

function applyMutation(preview, negativeCase) {
  const mutated = clone(preview);
  if (negativeCase.mutation?.path) {
    setByPath(mutated, negativeCase.mutation.path, negativeCase.mutation.value);
  }
  if (negativeCase.mutation?.remove_statement_including) {
    removeStatementIncluding(mutated, negativeCase.mutation.remove_statement_including);
  }
  return mutated;
}

function main() {
  const contract = readJson(contractPath);
  const preview = readJson(previewPath);
  const negativeCases = readJson(negativeCasesPath);

  validatePreview(preview, contract).forEach((check) => add(check.check, check.passed, check.detail));
  add("negative_cases_fixture_type_expected", negativeCases.fixture_type === "onering_sql_migration_preview_negative_cases");
  add("negative_cases_source_fixture_expected", negativeCases.source_fixture === previewPath);

  for (const negativeCase of negativeCases.cases || []) {
    const mutatedChecks = validatePreview(applyMutation(preview, negativeCase), contract);
    const expected = mutatedChecks.find((check) => check.check === negativeCase.expected_failure);
    add(`negative_${negativeCase.case_id}_caught`, expected && expected.passed === false, expected);
  }

  const failed = checks.filter((check) => !check.passed);
  const output = {
    passed: failed.length === 0,
    validator: "validate_onering_sql_migration_preview",
    source_contract: contractPath,
    fixture: previewPath,
    negative_cases: negativeCasesPath,
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
    validator: "validate_onering_sql_migration_preview",
    error: error.message,
  }, null, 2)}\n`);
  process.exit(1);
}
