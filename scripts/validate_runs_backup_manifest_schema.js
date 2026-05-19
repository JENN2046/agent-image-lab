#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const files = {
  schema: "schemas/runs_backup_manifest.schema.yaml",
  example: "tests/schema_examples/runs_backup_manifest.example.json",
  protocol: "docs/CAPSULE_RUNS_BACKUP_RESTORE_PROTOCOL.md",
};

function readText(relPath) {
  return fs.readFileSync(path.join(root, relPath), "utf8");
}

function readJson(relPath) {
  return JSON.parse(readText(relPath));
}

const schema = readText(files.schema);
const example = readJson(files.example);
const protocol = readText(files.protocol);
const checks = [];
const add = (check, passed, detail = null) => checks.push({ check, passed: Boolean(passed), ...(detail === null ? {} : { detail }) });

add("schema_exists", schema.includes("schema_id: runs_backup_manifest_v1"));
add("example_manifest_version", example.manifest_version === "runs_backup_manifest_v1");
add("source_root_runs", example.source_project_relative_root === "runs/");
add("restore_root_runs", example.restore_target_project_relative_root === "runs/");
add("selected_paths_project_relative", example.selected_path_list.every((item) => item.startsWith("runs/") && !path.isAbsolute(item)));
add("fake_paths_only", example.guard.fake_sample_paths_only === true && example.selected_path_list.every((item) => item.includes("example_") || item.includes("fake_")));
add("hash_not_recorded_without_binary_read", example.hash_algorithm === "not_recorded_no_binary_read");
add("dimensions_not_recorded_without_binary_read", example.dimensions_recording_policy === "not_recorded_no_binary_read");
add("verification_requires_authorization", example.verification_authorization_required === true);
for (const field of ["absolute_source_path", "absolute_backup_path", "secret", "token", "cookie", "password", "api_key", "provider_credential", "raw_chat_history", "customer_private_data", "image_binary_inline", "base64_image", "preview_binary"]) {
  add(`forbidden_field_${field}_null`, Object.prototype.hasOwnProperty.call(example.forbidden_fields, field) && example.forbidden_fields[field] === null);
  add(`schema_mentions_forbidden_${field}`, schema.includes(field));
}
for (const field of ["actual_runs_scan_performed", "runs_mutation_performed", "image_binary_read_performed", "real_image_hashing_performed", "preview_generation_performed", "cloud_drive_read_performed", "cloud_drive_write_performed", "provider_contact_performed", "plugin_call_performed", "api_call_performed", "DailyNote_write_performed", "VCP_memory_write_performed", "production_candidate_write_performed"]) {
  add(`guard_${field}_false`, example.guard[field] === false);
  add(`schema_guard_${field}`, schema.includes(field));
}
add("cloud_drive_user_manual_allowed", example.cloud_drive_boundary.user_manual_backup_allowed === true);
add("cloud_drive_no_read_write", example.cloud_drive_boundary.cloud_drive_read_performed === false && example.cloud_drive_boundary.cloud_drive_write_performed === false);
add("protocol_ref_present", protocol.includes("runs_backup_manifest.json"));

const failed = checks.filter((check) => !check.passed);
const output = {
  validator: "validate_runs_backup_manifest_schema",
  version: "v1",
  passed: failed.length === 0,
  status: failed.length === 0 ? "runs_backup_manifest_schema_verified" : "runs_backup_manifest_schema_failed",
  schema_ref: files.schema,
  example_ref: files.example,
  actual_runs_scan_performed: false,
  runs_mutation_performed: false,
  image_binary_read_performed: false,
  real_image_hashing_performed: false,
  preview_generation_performed: false,
  cloud_drive_read_performed: false,
  cloud_drive_write_performed: false,
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  DailyNote_write_performed: false,
  VCP_memory_write_performed: false,
  production_candidate_write_performed: false,
  check_count: checks.length,
  failed_count: failed.length,
  checks,
  failures: failed,
};
console.log(JSON.stringify(output, null, 2));
process.exit(output.passed ? 0 : 1);
