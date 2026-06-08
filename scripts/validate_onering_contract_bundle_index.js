#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const bundlePath = "tests/schema_examples/onering_contract_bundle_index.example.json";
const contractPath = "tests/schema_examples/onering_sql_hash_contract.example.json";
const previewPath = "tests/schema_examples/onering_sql_migration_preview.example.json";
const hashIdentityDriftPath = "tests/schema_examples/onering_hash_identity_drift_cases.example.json";
const previewDriftPath = "tests/schema_examples/onering_sql_migration_preview_drift_cases.example.json";
const manifestPath = "scripts/validation_manifest.json";
const packagePath = "package.json";

const expectedMemberIds = [
  "onering_sql_hash_contract",
  "onering_hash_identity_drift_guard",
  "onering_sql_migration_preview",
  "onering_sql_migration_preview_drift_guard",
];

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

function sameSet(left, right) {
  return Array.isArray(left) &&
    Array.isArray(right) &&
    left.length === right.length &&
    left.every((value) => right.includes(value));
}

function manifestEntryById(manifest, id) {
  return (manifest.validators || []).find((entry) => entry.id === id);
}

function assertHashRef(name, expected, actual) {
  add(`hash_ref_${name}_matches`, expected === actual, { expected, actual });
}

function main() {
  const bundle = readJson(bundlePath);
  const contract = readJson(contractPath);
  const preview = readJson(previewPath);
  const hashIdentityDrift = readJson(hashIdentityDriftPath);
  const previewDrift = readJson(previewDriftPath);
  const manifest = readJson(manifestPath);
  const packageJson = readJson(packagePath);
  const scripts = packageJson.scripts || {};
  const boundary = bundle.runtime_boundary || {};
  const members = bundle.members || [];
  const memberIds = members.map((member) => member.validator_id);

  add("fixture_type_expected", bundle.fixture_type === "onering_contract_bundle_index");
  add("bundle_has_four_members", members.length === expectedMemberIds.length, members.length);
  add("bundle_member_ids_expected", sameSet(memberIds, expectedMemberIds), memberIds);
  add("source_contract_ref_expected", bundle.source_contract === contractPath);
  add("source_preview_ref_expected", bundle.source_preview === previewPath);
  add("drift_fixture_source_contract_expected", hashIdentityDrift.source_contract === contractPath);
  add("preview_drift_source_contract_expected", previewDrift.source_contract === contractPath);
  add("preview_drift_source_preview_expected", previewDrift.source_preview === previewPath);

  assertHashRef("contract_id", bundle.hash_refs?.contract_id, contract.contract_id);
  assertHashRef("migration_id", bundle.hash_refs?.migration_id, contract.sql_contract?.migration_id);
  assertHashRef("ddl_hash", bundle.hash_refs?.ddl_hash, contract.sql_contract?.ddl_hash);
  assertHashRef("request_hash", bundle.hash_refs?.request_hash, contract.request_contract?.request_hash);
  assertHashRef("request_identity", bundle.hash_refs?.request_identity, contract.request_contract?.request_identity);
  assertHashRef("snapshot_hash", bundle.hash_refs?.snapshot_hash, contract.snapshot_contract?.snapshot_hash);
  assertHashRef("temp_key_hash", bundle.hash_refs?.temp_key_hash, contract.temp_store_contract?.entries?.[0]?.temp_key_hash);
  assertHashRef("preview_hash", bundle.hash_refs?.preview_hash, preview.migration_preview?.preview_hash);

  add("preview_source_contract_ref_expected", preview.source_contract === contractPath);
  add("preview_source_contract_id_matches_hash_ref", preview.source_contract_id === bundle.hash_refs?.contract_id);
  add("preview_source_migration_id_matches_hash_ref", preview.source_migration_id === bundle.hash_refs?.migration_id);
  add("preview_source_ddl_hash_matches_hash_ref", preview.source_ddl_hash === bundle.hash_refs?.ddl_hash);
  add("preview_request_identity_matches_hash_ref", preview.request_identity_preview?.request_identity === bundle.hash_refs?.request_identity);
  add("preview_snapshot_hash_matches_hash_ref", preview.request_identity_preview?.snapshot_hash === bundle.hash_refs?.snapshot_hash);
  add("preview_temp_key_hash_matches_hash_ref", preview.request_identity_preview?.temp_key_hash === bundle.hash_refs?.temp_key_hash);

  for (const member of members) {
    const entry = manifestEntryById(manifest, member.validator_id);
    add(`member_${member.validator_id}_manifest_entry_present`, Boolean(entry));
    add(`member_${member.validator_id}_script_exists`, fs.existsSync(repoPath(member.script)), member.script);
    add(`member_${member.validator_id}_npm_script_matches`, scripts[member.npm_script] === `node ${member.script}`, scripts[member.npm_script]);
    add(`member_${member.validator_id}_manifest_script_matches`, entry?.script === member.script, entry?.script);
    add(`member_${member.validator_id}_manifest_command_matches`, entry?.command === `node ${member.script}`, entry?.command);
    add(`member_${member.validator_id}_manifest_trigger_paths_match`, sameSet(entry?.trigger_paths, member.manifest_trigger_paths), {
      expected: member.manifest_trigger_paths,
      actual: entry?.trigger_paths,
    });

    for (const fixture of member.fixtures || []) {
      add(`member_${member.validator_id}_fixture_exists_${fixture}`, fs.existsSync(repoPath(fixture)));
      add(`member_${member.validator_id}_fixture_in_manifest_${fixture}`, entry?.trigger_paths?.includes(fixture));
    }

    for (const hashRef of member.hash_refs || []) {
      add(`member_${member.validator_id}_hash_ref_indexed_${hashRef}`, Object.prototype.hasOwnProperty.call(bundle.hash_refs || {}, hashRef));
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
    validator: "validate_onering_contract_bundle_index",
    bundle: bundlePath,
    member_count: members.length,
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
    validator: "validate_onering_contract_bundle_index",
    error: error.message,
  }, null, 2)}\n`);
  process.exit(1);
}
