#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const contractPath = "tests/schema_examples/onering_sql_hash_contract.example.json";
const driftCasesPath = "tests/schema_examples/onering_hash_identity_drift_cases.example.json";

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
    current = /^\d+$/.test(part) ? current[Number(part)] : current[part];
  }
  const last = parts[parts.length - 1];
  current[/^\d+$/.test(last) ? Number(last) : last] = value;
}

function validateHashIdentityContract(contract) {
  const localChecks = [];
  const record = (check, passed, detail) => {
    localChecks.push({ check, passed: Boolean(passed), ...(detail === undefined ? {} : { detail }) });
  };

  const requestBodyHash = sha256(stableJson(contract.request_contract?.request?.body));
  const identityPayload = {
    contract_id: contract.request_contract?.request?.contract_id,
    idempotency_key: contract.request_contract?.request?.idempotency_key,
    request_hash: contract.request_contract?.request_hash,
    route: contract.request_contract?.request?.route,
  };
  const requestIdentity = sha256(stableJson(identityPayload));
  const snapshotHash = sha256(stableJson(contract.snapshot_contract?.payload));
  const tempEntry = contract.temp_store_contract?.entries?.[0];
  const tempKeyHash = sha256(stableJson({
    namespace: tempEntry?.namespace,
    request_identity: tempEntry?.request_identity,
    slot: tempEntry?.slot,
  }));
  const boundary = contract.runtime_boundary || {};

  record("contract_fixture_type_expected", contract.fixture_type === "onering_sql_hash_contract");
  record("request_hash_matches_canonical_body", contract.request_contract?.request_hash === requestBodyHash, requestBodyHash);
  record("request_identity_matches_contract", contract.request_contract?.request_identity === requestIdentity, requestIdentity);
  record("snapshot_payload_request_identity_matches", contract.snapshot_contract?.payload?.request_identity === requestIdentity);
  record("snapshot_hash_matches_canonical_payload", contract.snapshot_contract?.snapshot_hash === snapshotHash, snapshotHash);
  record("temp_store_payload_hash_matches_snapshot", tempEntry?.payload_hash === snapshotHash);
  record("temp_store_request_identity_matches", tempEntry?.request_identity === requestIdentity);
  record("temp_store_key_hash_matches_contract", tempEntry?.temp_key_hash === tempKeyHash, tempKeyHash);
  record("handler_execution_forbidden", boundary.handler_execution_performed === false);
  record("provider_contact_forbidden", boundary.provider_contact_performed === false);
  record("plugin_call_forbidden", boundary.plugin_call_performed === false);
  record("api_call_forbidden", boundary.api_call_performed === false);
  record("image_generation_forbidden", boundary.image_generation_performed === false);
  record("secret_read_forbidden", boundary.secret_value_read_performed === false);

  return localChecks;
}

function applyMutation(contract, driftCase) {
  const mutated = clone(contract);
  setByPath(mutated, driftCase.contract_mutation.path, driftCase.contract_mutation.value);
  return mutated;
}

function main() {
  const contract = readJson(contractPath);
  const driftCases = readJson(driftCasesPath);
  const boundary = driftCases.runtime_boundary || {};

  add("fixture_type_expected", driftCases.fixture_type === "onering_hash_identity_drift_cases");
  add("source_contract_expected", driftCases.source_contract === contractPath);
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

  const baselineChecks = validateHashIdentityContract(contract);
  const baselineFailed = baselineChecks.filter((check) => !check.passed);
  add("baseline_hash_identity_in_sync", baselineFailed.length === 0, baselineFailed);

  for (const driftCase of driftCases.drift_cases || []) {
    const driftedContract = applyMutation(contract, driftCase);
    const driftChecks = validateHashIdentityContract(driftedContract);
    for (const expectedFailure of driftCase.expected_failures || []) {
      const found = driftChecks.find((check) => check.check === expectedFailure);
      add(`drift_${driftCase.case_id}_${expectedFailure}_caught`, found && found.passed === false, found);
    }
  }

  const failed = checks.filter((check) => !check.passed);
  const output = {
    passed: failed.length === 0,
    validator: "validate_onering_hash_identity_drift_guard",
    source_contract: contractPath,
    drift_cases: driftCasesPath,
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
    validator: "validate_onering_hash_identity_drift_guard",
    error: error.message,
  }, null, 2)}\n`);
  process.exit(1);
}
