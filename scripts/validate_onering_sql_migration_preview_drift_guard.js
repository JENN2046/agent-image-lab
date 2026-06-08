#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const contractPath = "tests/schema_examples/onering_sql_hash_contract.example.json";
const previewPath = "tests/schema_examples/onering_sql_migration_preview.example.json";
const driftCasesPath = "tests/schema_examples/onering_sql_migration_preview_drift_cases.example.json";

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

function findTable(contract, tableName) {
  return contract.sql_contract.tables.find((table) => table.name === tableName);
}

function applyContractMutation(contract, mutation) {
  const mutated = clone(contract);
  if (mutation.path) {
    setByPath(mutated, mutation.path, mutation.value);
  }
  if (mutation.add_column) {
    const table = findTable(mutated, mutation.add_column.table);
    table.columns.push(mutation.add_column.column);
  }
  if (mutation.add_index) {
    const table = findTable(mutated, mutation.add_index.table);
    table.indexes.push(mutation.add_index.index);
  }
  if (mutation.set_column_type) {
    const table = findTable(mutated, mutation.set_column_type.table);
    const column = table.columns.find((item) => item.name === mutation.set_column_type.column);
    column.type = mutation.set_column_type.type;
  }
  if (mutation.path !== "sql_contract.ddl_hash") {
    mutated.sql_contract.ddl_hash = ddlHash(mutated.sql_contract);
  }
  return mutated;
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

function ddlText(sqlContract) {
  return sqlContract.tables.map((table) => {
    const columns = table.columns.map(columnSql).join(", ");
    const indexes = table.indexes.map((index) => {
      const unique = index.unique ? "UNIQUE " : "";
      return `CREATE ${unique}INDEX ${index.name} ON ${table.name} (${index.columns.join(", ")});`;
    }).join(" ");
    return `CREATE TABLE ${table.name} (${columns}); ${indexes}`;
  }).join("\n");
}

function ddlHash(sqlContract) {
  return sha256(ddlText(sqlContract));
}

function validatePreviewAgainstContract(preview, contract) {
  const localChecks = [];
  const record = (check, passed, detail) => {
    localChecks.push({ check, passed: Boolean(passed), ...(detail === undefined ? {} : { detail }) });
  };

  const expectedStatements = buildPreviewStatements(contract);
  const previewStatements = preview.migration_preview?.statements || [];

  record("source_contract_id_matches", preview.source_contract_id === contract.contract_id);
  record("source_migration_id_matches", preview.source_migration_id === contract.sql_contract.migration_id);
  record("source_ddl_hash_matches_contract", preview.source_ddl_hash === contract.sql_contract.ddl_hash, {
    preview_source_ddl_hash: preview.source_ddl_hash,
    contract_ddl_hash: contract.sql_contract.ddl_hash,
  });
  record("preview_statements_match_contract", stableJson(previewStatements) === stableJson(expectedStatements));
  record("preview_hash_matches_statements", preview.migration_preview?.preview_hash === sha256(stableJson(previewStatements)));
  record("request_identity_matches_contract", preview.request_identity_preview?.request_identity === contract.request_contract.request_identity);
  record("snapshot_hash_matches_contract", preview.request_identity_preview?.snapshot_hash === contract.snapshot_contract.snapshot_hash);
  record("temp_key_hash_matches_contract", preview.request_identity_preview?.temp_key_hash === contract.temp_store_contract.entries[0].temp_key_hash);

  return localChecks;
}

function main() {
  const contract = readJson(contractPath);
  const preview = readJson(previewPath);
  const driftCases = readJson(driftCasesPath);
  const boundary = driftCases.runtime_boundary || {};

  add("fixture_type_expected", driftCases.fixture_type === "onering_sql_migration_preview_drift_cases");
  add("source_contract_expected", driftCases.source_contract === contractPath);
  add("source_preview_expected", driftCases.source_preview === previewPath);
  add("no_handler_true", boundary.no_handler === true);
  add("handler_execution_forbidden", boundary.handler_execution_performed === false);
  add("migration_execution_forbidden", boundary.migration_execution_performed === false);
  add("sqlite_file_creation_forbidden", boundary.sqlite_file_created === false);
  add("database_write_forbidden", boundary.database_write_performed === false);
  add("secret_read_forbidden", boundary.secret_value_read_performed === false);

  const baselineChecks = validatePreviewAgainstContract(preview, contract);
  const baselineFailed = baselineChecks.filter((check) => !check.passed);
  add("baseline_preview_in_sync", baselineFailed.length === 0, baselineFailed);

  for (const driftCase of driftCases.drift_cases || []) {
    const driftedContract = applyContractMutation(contract, driftCase.contract_mutation);
    const driftChecks = validatePreviewAgainstContract(preview, driftedContract);
    for (const expectedFailure of driftCase.expected_failures || []) {
      const found = driftChecks.find((check) => check.check === expectedFailure);
      add(`drift_${driftCase.case_id}_${expectedFailure}_caught`, found && found.passed === false, found);
    }
  }

  const failed = checks.filter((check) => !check.passed);
  const output = {
    passed: failed.length === 0,
    validator: "validate_onering_sql_migration_preview_drift_guard",
    source_contract: contractPath,
    source_preview: previewPath,
    drift_cases: driftCasesPath,
    failed_count: failed.length,
    handler_execution_performed: false,
    migration_execution_performed: false,
    sqlite_file_created: false,
    database_write_performed: false,
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
    validator: "validate_onering_sql_migration_preview_drift_guard",
    error: error.message,
  }, null, 2)}\n`);
  process.exit(1);
}
