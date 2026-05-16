#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const schemaPath = "schemas/visual_eval_seed_record.schema.yaml";
const examplePath = "tests/schema_examples/visual_eval_seed_record.example.yaml";

const errors = [];
const results = [];

function repoPath(relativePath) {
  const resolved = path.resolve(root, relativePath);
  const relative = path.relative(root, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`path escapes repository root: ${relativePath}`);
  }
  return resolved;
}

function readFile(relativePath) {
  return fs.readFileSync(repoPath(relativePath), "utf8");
}

function addResult(check, passed, detail) {
  results.push({ check, passed: Boolean(passed), ...(detail ? { detail } : {}) });
  if (!passed) {
    errors.push({ check, detail: detail || "check failed" });
  }
}

function hasField(text, field) {
  return new RegExp(`^\\s*${escapeRegExp(field)}\\s*:`, "m").test(text);
}

function hasExactValue(text, field, value) {
  return new RegExp(`^\\s*${escapeRegExp(field)}\\s*:\\s*${escapeRegExp(value)}\\s*$`, "m").test(text);
}

function hasFalse(text, field) {
  return hasExactValue(text, field, "false");
}

function hasNoTrue(text, field) {
  return !new RegExp(`^\\s*${escapeRegExp(field)}\\s*:\\s*true\\s*$`, "m").test(text);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function listAfterField(text, field) {
  const lines = text.split(/\r?\n/);
  const index = lines.findIndex((line) => new RegExp(`^\\s*${escapeRegExp(field)}\\s*:\\s*$`).test(line));
  if (index === -1) return [];
  const items = [];
  for (let cursor = index + 1; cursor < lines.length; cursor += 1) {
    const line = lines[cursor];
    if (/^\s*-\s+/.test(line)) {
      items.push(line.replace(/^\s*-\s+/, "").trim());
      continue;
    }
    if (/^\s*$/.test(line)) continue;
    if (/^\s*[A-Za-z0-9_]+\s*:/.test(line)) break;
  }
  return items;
}

function validateNoSensitiveMaterial(label, text) {
  const forbidden = [
    { id: "windows_absolute_path", pattern: /[A-Z]:[\\/]/ },
    { id: "private_key", pattern: /BEGIN [A-Z ]*PRIVATE KEY/ },
    { id: "env_file_reference", pattern: /\.env|config\.env/ },
    { id: "image_binary_reference", pattern: /\.(png|jpe?g|webp|gif|psd)\b/i },
    { id: "real_generation_run_path", pattern: /runs\/real_generation/i },
  ];
  for (const rule of forbidden) {
    addResult(`${label}_${rule.id}_absent`, !rule.pattern.test(text), `${rule.pattern}`);
  }
}

let schema = "";
let example = "";

try {
  schema = readFile(schemaPath);
  addResult("schema_file_exists", true);
} catch (error) {
  addResult("schema_file_exists", false, error.message);
}

try {
  example = readFile(examplePath);
  addResult("example_file_exists", true);
} catch (error) {
  addResult("example_file_exists", false, error.message);
}

if (schema) {
  addResult("schema_top_level_key_present", /^visual_eval_seed_record:\s*$/m.test(schema));
  for (const field of [
    "seed_id",
    "source_type",
    "intended_decision",
    "seed_category",
    "linked_rubric_dimensions",
    "linked_failure_tags",
    "review_note",
    "redaction_status",
    "memory_suitability_default",
    "production_candidate_eligible_default",
    "boundary_flags",
  ]) {
    addResult(`schema_field_${field}_present`, hasField(schema, field));
  }
  addResult("schema_source_type_enum_declared", schema.includes("accepted_reference | rejected_reference | synthetic_fixture | redacted_prior_case"));
  addResult("schema_decision_enum_declared", schema.includes("accepted_candidate_reference | rejected_candidate_reference | archive_reference_only | human_review_required"));
  addResult("schema_redaction_enum_declared", schema.includes("redacted_metadata_only | needs_redaction_review | blocked_sensitive_source"));
  addResult("schema_memory_default_false", hasFalse(schema, "memory_suitability_default"));
  addResult("schema_production_default_false", hasFalse(schema, "production_candidate_eligible_default"));
  for (const flag of [
    "image_binary_included",
    "real_provider_payload_included",
    "private_path_included",
    "memory_write_authorized",
    "production_candidate_authorized",
    "plugin_call_authorized",
    "api_call_authorized",
    "daily_note_write_authorized",
  ]) {
    addResult(`schema_boundary_${flag}_false`, hasFalse(schema, flag));
    addResult(`schema_boundary_${flag}_not_true`, hasNoTrue(schema, flag));
  }
  addResult("schema_no_image_binary_path_field", !hasField(schema, "image_binary_path"));
  addResult("schema_no_memory_write_path_field", !hasField(schema, "memory_write_path"));
  validateNoSensitiveMaterial("schema", schema);
}

if (example) {
  addResult("example_top_level_key_present", /^visual_eval_seed_record:\s*$/m.test(example));
  addResult("example_source_type_accepted_reference", hasExactValue(example, "source_type", "accepted_reference"));
  addResult("example_intended_decision_accepted_reference", hasExactValue(example, "intended_decision", "accepted_candidate_reference"));
  addResult("example_redaction_metadata_only", hasExactValue(example, "redaction_status", "redacted_metadata_only"));
  addResult("example_memory_default_false", hasFalse(example, "memory_suitability_default"));
  addResult("example_production_default_false", hasFalse(example, "production_candidate_eligible_default"));
  addResult("example_rubric_dimensions_non_empty", listAfterField(example, "linked_rubric_dimensions").length > 0);
  addResult("example_accepted_reference_allows_empty_failure_tags", /^ {2}linked_failure_tags:\s*\[\]\s*$/m.test(example));
  for (const flag of [
    "image_binary_included",
    "real_provider_payload_included",
    "private_path_included",
    "memory_write_authorized",
    "production_candidate_authorized",
    "plugin_call_authorized",
    "api_call_authorized",
    "daily_note_write_authorized",
  ]) {
    addResult(`example_boundary_${flag}_false`, hasFalse(example, flag));
    addResult(`example_boundary_${flag}_not_true`, hasNoTrue(example, flag));
  }
  validateNoSensitiveMaterial("example", example);
}

const passed = errors.length === 0;
const summary = {
  validator: "validate_visual_eval_seed_record_schema",
  version: "v1",
  passed,
  files_checked: [schemaPath, examplePath],
  check_count: results.length,
  failed_count: errors.length,
  visual_eval_seed_record_schema: {
    schema_file_present: Boolean(schema),
    example_file_present: Boolean(example),
    metadata_only_verified: passed,
    safe_defaults_verified: passed,
    boundary_flags_verified: passed,
    external_network_required: false,
    external_service_required: false,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    memory_write_performed: false,
    file_write_performed: false,
  },
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exitCode = passed ? 0 : 1;
