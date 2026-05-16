#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const schemaPath = "schemas/visual_eval_seed_record.schema.yaml";
const examples = [
  {
    role: "accepted",
    path: "tests/schema_examples/visual_eval_seed_record.example.yaml",
    sourceType: "accepted_reference",
    intendedDecision: "accepted_candidate_reference",
    requireFailureTags: false,
  },
  {
    role: "rejected",
    path: "tests/schema_examples/visual_eval_seed_record.rejected.example.yaml",
    sourceType: "synthetic_fixture",
    intendedDecision: "rejected_candidate_reference",
    requireFailureTags: true,
  },
];

const errors = [];
const results = [];
const presentExamples = new Set();

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

function validateBoundaryFlags(label, text) {
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
    addResult(`${label}_boundary_${flag}_false`, hasFalse(text, flag));
    addResult(`${label}_boundary_${flag}_not_true`, hasNoTrue(text, flag));
  }
}

function validateSchema(schema) {
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
  validateBoundaryFlags("schema", schema);
  addResult("schema_no_image_binary_path_field", !hasField(schema, "image_binary_path"));
  addResult("schema_no_memory_write_path_field", !hasField(schema, "memory_write_path"));
  validateNoSensitiveMaterial("schema", schema);
}

function validateExample(exampleDef, text) {
  const label = `${exampleDef.role}_example`;
  addResult(`${label}_top_level_key_present`, /^visual_eval_seed_record:\s*$/m.test(text));
  addResult(`${label}_source_type_expected`, hasExactValue(text, "source_type", exampleDef.sourceType), exampleDef.sourceType);
  addResult(`${label}_intended_decision_expected`, hasExactValue(text, "intended_decision", exampleDef.intendedDecision), exampleDef.intendedDecision);
  addResult(`${label}_redaction_metadata_only`, hasExactValue(text, "redaction_status", "redacted_metadata_only"));
  addResult(`${label}_memory_default_false`, hasFalse(text, "memory_suitability_default"));
  addResult(`${label}_production_default_false`, hasFalse(text, "production_candidate_eligible_default"));
  addResult(`${label}_rubric_dimensions_non_empty`, listAfterField(text, "linked_rubric_dimensions").length > 0);
  const failureTags = listAfterField(text, "linked_failure_tags");
  if (exampleDef.requireFailureTags) {
    addResult(`${label}_failure_tags_non_empty`, failureTags.length > 0);
    addResult(`${label}_review_note_rejection_context`, /^ {2}review_note:\s*".*(rejected|failure|defect|artifact|mismatch)/im.test(text));
  } else {
    addResult(`${label}_failure_tags_empty_allowed`, /^ {2}linked_failure_tags:\s*\[\]\s*$/m.test(text));
  }
  validateBoundaryFlags(label, text);
  validateNoSensitiveMaterial(label, text);
}

let schema = "";

try {
  schema = readFile(schemaPath);
  addResult("schema_file_exists", true);
} catch (error) {
  addResult("schema_file_exists", false, error.message);
}

if (schema) validateSchema(schema);

for (const exampleDef of examples) {
  let text = "";
  try {
    text = readFile(exampleDef.path);
    presentExamples.add(exampleDef.role);
    addResult(`${exampleDef.role}_example_file_exists`, true);
  } catch (error) {
    addResult(`${exampleDef.role}_example_file_exists`, false, error.message);
  }
  if (text) validateExample(exampleDef, text);
}

const passed = errors.length === 0;
const summary = {
  validator: "validate_visual_eval_seed_record_schema",
  version: "v2",
  passed,
  files_checked: [schemaPath, ...examples.map((exampleDef) => exampleDef.path)],
  check_count: results.length,
  failed_count: errors.length,
  visual_eval_seed_record_schema: {
    schema_file_present: Boolean(schema),
    example_file_present: presentExamples.size === examples.length,
    accepted_example_present: presentExamples.has("accepted"),
    rejected_example_present: presentExamples.has("rejected"),
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
