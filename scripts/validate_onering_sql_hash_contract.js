#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const fixturePath = "tests/schema_examples/onering_sql_hash_contract.example.json";
const negativeCasesPath = "tests/schema_examples/onering_sql_hash_contract_negative_cases.example.json";

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

function removeTable(target, tableName) {
  target.sql_contract.tables = target.sql_contract.tables.filter((table) => table.name !== tableName);
}

function ddlText(sqlContract) {
  return sqlContract.tables.map((table) => {
    const columns = table.columns.map((column) => {
      const constraints = column.constraints.length > 0 ? ` ${column.constraints.join(" ")}` : "";
      return `${column.name} ${column.type}${constraints}`;
    }).join(", ");
    const indexes = table.indexes.map((index) => {
      const unique = index.unique ? "UNIQUE " : "";
      return `CREATE ${unique}INDEX ${index.name} ON ${table.name} (${index.columns.join(", ")});`;
    }).join(" ");
    return `CREATE TABLE ${table.name} (${columns}); ${indexes}`;
  }).join("\n");
}

function validateContract(fixture) {
  const localChecks = [];
  const record = (check, passed, detail) => {
    localChecks.push({ check, passed: Boolean(passed), ...(detail === undefined ? {} : { detail }) });
  };

  const requiredTables = ["onering_requests", "onering_snapshots", "onering_temp_store"];
  const tableNames = (fixture.sql_contract?.tables || []).map((table) => table.name);
  const boundary = fixture.runtime_boundary || {};

  record("fixture_type_expected", fixture.fixture_type === "onering_sql_hash_contract");
  record("contract_id_expected", fixture.contract_id === "onering_sql_hash_contract_v0_1");
  record("sqlite_engine_expected", fixture.sql_contract?.engine === "sqlite");
  record("sql_required_tables_present", requiredTables.every((table) => tableNames.includes(table)), tableNames);
  record("sql_no_extra_tables", tableNames.every((table) => requiredTables.includes(table)), tableNames);

  const requestTable = fixture.sql_contract?.tables?.find((table) => table.name === "onering_requests");
  const snapshotTable = fixture.sql_contract?.tables?.find((table) => table.name === "onering_snapshots");
  const tempTable = fixture.sql_contract?.tables?.find((table) => table.name === "onering_temp_store");
  record("request_identity_primary_key", requestTable?.columns?.some((column) => column.name === "request_identity" && column.constraints.includes("PRIMARY KEY")));
  record("snapshot_hash_primary_key", snapshotTable?.columns?.some((column) => column.name === "snapshot_hash" && column.constraints.includes("PRIMARY KEY")));
  record("temp_key_hash_primary_key", tempTable?.columns?.some((column) => column.name === "temp_key_hash" && column.constraints.includes("PRIMARY KEY")));
  record("temp_store_purgeable_check", tempTable?.columns?.some((column) => column.name === "purgeable" && column.constraints.includes("CHECK (purgeable = 1)")));

  record("handlers_not_touched", boundary.handlers_touched === false);
  record("handler_execution_forbidden", boundary.handler_execution_performed === false);
  record("provider_contact_forbidden", boundary.provider_contact_performed === false);
  record("plugin_call_forbidden", boundary.plugin_call_performed === false);
  record("api_call_forbidden", boundary.api_call_performed === false);
  record("image_generation_forbidden", boundary.image_generation_performed === false);
  record("secret_read_forbidden", boundary.secret_value_read_performed === false);

  const requestBodyHash = sha256(stableJson(fixture.request_contract?.request?.body));
  record("request_hash_matches_canonical_body", fixture.request_contract?.request_hash === requestBodyHash, requestBodyHash);

  const identityPayload = {
    contract_id: fixture.request_contract?.request?.contract_id,
    idempotency_key: fixture.request_contract?.request?.idempotency_key,
    request_hash: fixture.request_contract?.request_hash,
    route: fixture.request_contract?.request?.route,
  };
  const requestIdentity = sha256(stableJson(identityPayload));
  record("request_identity_matches_contract", fixture.request_contract?.request_identity === requestIdentity, requestIdentity);
  record("snapshot_payload_request_identity_matches", fixture.snapshot_contract?.payload?.request_identity === requestIdentity);

  const snapshotPayload = clone(fixture.snapshot_contract?.payload);
  const snapshotHash = sha256(stableJson(snapshotPayload));
  record("snapshot_hash_matches_canonical_payload", fixture.snapshot_contract?.snapshot_hash === snapshotHash, snapshotHash);

  const tempEntry = fixture.temp_store_contract?.entries?.[0];
  const tempKeyPayload = {
    namespace: tempEntry?.namespace,
    request_identity: tempEntry?.request_identity,
    slot: tempEntry?.slot,
  };
  const tempKeyHash = sha256(stableJson(tempKeyPayload));
  record("temp_store_key_hash_matches_contract", tempEntry?.temp_key_hash === tempKeyHash, tempKeyHash);
  record("temp_store_payload_hash_matches_snapshot", tempEntry?.payload_hash === snapshotHash);
  record("temp_store_request_identity_matches", tempEntry?.request_identity === requestIdentity);
  record("temp_store_persistent_store_forbidden", fixture.temp_store_contract?.persistent_store_allowed === false);
  record("temp_store_git_tracked_forbidden", fixture.temp_store_contract?.git_tracked_allowed === false);
  record("temp_store_overwrite_forbidden", fixture.temp_store_contract?.overwrite_existing_allowed === false);
  record("temp_store_ttl_bounded", Number.isInteger(tempEntry?.ttl_seconds) && tempEntry.ttl_seconds > 0 && tempEntry.ttl_seconds <= 3600, tempEntry?.ttl_seconds);
  record("temp_store_purgeable_true", tempEntry?.purgeable === true);

  const ddlHash = sha256(ddlText(fixture.sql_contract));
  record("ddl_hash_matches_sql_contract", fixture.sql_contract?.ddl_hash === ddlHash, ddlHash);

  return localChecks;
}

function applyMutation(fixture, negativeCase) {
  const mutated = clone(fixture);
  if (negativeCase.mutation?.path) {
    setByPath(mutated, negativeCase.mutation.path, negativeCase.mutation.value);
  }
  if (negativeCase.mutation?.remove_table) {
    removeTable(mutated, negativeCase.mutation.remove_table);
  }
  return mutated;
}

function main() {
  const fixture = readJson(fixturePath);
  const negativeCases = readJson(negativeCasesPath);
  const positiveChecks = validateContract(fixture);
  positiveChecks.forEach((check) => add(check.check, check.passed, check.detail));

  add("negative_cases_fixture_type_expected", negativeCases.fixture_type === "onering_sql_hash_contract_negative_cases");
  add("negative_cases_source_fixture_expected", negativeCases.source_fixture === fixturePath);

  for (const negativeCase of negativeCases.cases || []) {
    const mutatedChecks = validateContract(applyMutation(fixture, negativeCase));
    const expected = mutatedChecks.find((check) => check.check === negativeCase.expected_failure);
    add(`negative_${negativeCase.case_id}_caught`, expected && expected.passed === false, expected);
  }

  const failed = checks.filter((check) => !check.passed);
  const output = {
    passed: failed.length === 0,
    validator: "validate_onering_sql_hash_contract",
    fixture: fixturePath,
    negative_cases: negativeCasesPath,
    failed_count: failed.length,
    handler_execution_performed: false,
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
    validator: "validate_onering_sql_hash_contract",
    error: error.message,
  }, null, 2)}\n`);
  process.exit(1);
}
