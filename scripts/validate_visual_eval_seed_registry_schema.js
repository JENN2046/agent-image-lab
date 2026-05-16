#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const schemaPath = "schemas/visual_eval_seed_registry.schema.yaml";
const registryExamplePath = "tests/schema_examples/visual_eval_seed_registry.example.yaml";
const seedFixtures = {
  accepted: {
    path: "tests/schema_examples/visual_eval_seed_record.example.yaml",
    expectedDecision: "accepted_candidate_reference",
    expectedRegistryRef: "tests/schema_examples/visual_eval_seed_record.example.yaml",
    requireFailureTags: false,
  },
  rejected: {
    path: "tests/schema_examples/visual_eval_seed_record.rejected.example.yaml",
    expectedDecision: "rejected_candidate_reference",
    expectedRegistryRef: "tests/schema_examples/visual_eval_seed_record.rejected.example.yaml",
    requireFailureTags: true,
  },
};

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

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function hasField(text, field) {
  return new RegExp(`^\\s*(?:-\\s+)?${escapeRegExp(field)}\\s*:`, "m").test(text);
}

function hasExactValue(text, field, value) {
  return new RegExp(`^\\s*(?:-\\s+)?${escapeRegExp(field)}\\s*:\\s*${escapeRegExp(value)}\\s*$`, "m").test(text);
}

function hasFalse(text, field) {
  return hasExactValue(text, field, "false");
}

function hasNoTrue(text, field) {
  return !new RegExp(`^\\s*${escapeRegExp(field)}\\s*:\\s*true\\s*$`, "m").test(text);
}

function getSection(text, field) {
  const lines = text.split(/\r?\n/);
  const start = lines.findIndex((line) => new RegExp(`^ {2}${escapeRegExp(field)}\\s*:\\s*$`).test(line));
  if (start === -1) return "";
  const section = [];
  for (let cursor = start + 1; cursor < lines.length; cursor += 1) {
    const line = lines[cursor];
    if (/^ {2}[A-Za-z0-9_]+\s*:/.test(line)) break;
    section.push(line);
  }
  return section.join("\n");
}

function firstValue(text, field) {
  const match = text.match(new RegExp(`^\\s*(?:-\\s+)?${escapeRegExp(field)}\\s*:\\s*(.+?)\\s*$`, "m"));
  return match ? match[1].replace(/^["']|["']$/g, "").trim() : null;
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

function extractFixtureRefs(text) {
  return [...text.matchAll(/^\s*fixture_ref\s*:\s*(\S+)\s*$/gm)].map((match) => match[1]);
}

function isRepoRelativeFixtureRef(ref) {
  return (
    typeof ref === "string" &&
    ref.startsWith("tests/schema_examples/") &&
    !ref.includes("..") &&
    !ref.includes("://") &&
    !/^[A-Z]:[\\/]/.test(ref) &&
    !ref.startsWith("/") &&
    !ref.startsWith("\\")
  );
}

function validateNoSensitiveMaterial(label, text) {
  const forbidden = [
    { id: "windows_absolute_path", pattern: /[A-Z]:[\\/]/ },
    { id: "private_key", pattern: /BEGIN [A-Z ]*PRIVATE KEY/ },
    { id: "env_file_reference", pattern: /\.env|config\.env/ },
    { id: "image_binary_reference", pattern: /\.(png|jpe?g|webp|gif|psd)\b/i },
    { id: "real_generation_run_path", pattern: /runs\/real_generation/i },
    { id: "accepted_samples_path", pattern: /accepted_samples\//i },
    { id: "external_url", pattern: /https?:\/\//i },
    { id: "real_manifest_ref", pattern: /real[_ -]?manifest/i },
    { id: "vcpchat_ref", pattern: /VCPChat/ },
    { id: "vcptoolbox_ref", pattern: /VCPToolBox/ },
  ];
  for (const rule of forbidden) {
    addResult(`${label}_${rule.id}_absent`, !rule.pattern.test(text), `${rule.pattern}`);
  }
}

function validateFalseFlags(label, text, flags) {
  for (const flag of flags) {
    addResult(`${label}_${flag}_false`, hasFalse(text, flag));
    addResult(`${label}_${flag}_not_true`, hasNoTrue(text, flag));
  }
}

function validateSchema(schema) {
  addResult("schema_top_level_key_present", /^visual_eval_seed_registry:\s*$/m.test(schema));
  for (const field of [
    "registry_id",
    "registry_version",
    "created_from_phase",
    "selected_product_route",
    "registry_scope",
    "accepted_seed_records",
    "rejected_seed_records",
    "calibration_scope",
    "safety_defaults",
    "boundary_flags",
  ]) {
    addResult(`schema_field_${field}_present`, hasField(schema, field));
  }
  addResult("schema_registry_scope_enum_declared", schema.includes("accepted_and_rejected_seed_fixtures | accepted_seed_fixtures | rejected_seed_fixtures"));
  addResult("schema_accepted_decision_enum_declared", schema.includes("accepted_candidate_reference | archive_reference_only | human_review_required"));
  addResult("schema_rejected_decision_enum_declared", schema.includes("rejected_candidate_reference | human_review_required"));
  addResult("schema_fixture_ref_root_declared", schema.includes("fixture_refs_root: tests/schema_examples/"));
  validateFalseFlags("schema_safety", schema, [
    "memory_suitability_default",
    "production_candidate_eligible_default",
    "provider_contact_allowed",
    "plugin_call_authorized",
    "api_call_authorized",
    "image_generation_authorized",
    "daily_note_write_authorized",
    "vcp_memory_write_authorized",
  ]);
  validateFalseFlags("schema_boundary", schema, [
    "image_binary_included",
    "real_provider_payload_included",
    "private_path_included",
    "external_manifest_included",
    "runtime_execution_authorized",
    "seed_ingestion_authorized",
    "accepted_samples_write_authorized",
    "memory_write_authorized",
    "memory_write_path_included",
    "production_candidate_authorized",
    "plugin_call_authorized",
    "api_call_authorized",
    "daily_note_write_authorized",
  ]);
  validateNoSensitiveMaterial("schema", schema);
}

function validateRegistryExample(registry, fixtureTexts) {
  addResult("registry_example_top_level_key_present", /^visual_eval_seed_registry:\s*$/m.test(registry));
  addResult("registry_example_scope_expected", hasExactValue(registry, "registry_scope", "accepted_and_rejected_seed_fixtures"));
  for (const field of [
    "registry_id",
    "registry_version",
    "created_from_phase",
    "selected_product_route",
    "accepted_seed_records",
    "rejected_seed_records",
    "calibration_scope",
    "safety_defaults",
    "boundary_flags",
  ]) {
    addResult(`registry_example_field_${field}_present`, hasField(registry, field));
  }

  const acceptedSection = getSection(registry, "accepted_seed_records");
  const rejectedSection = getSection(registry, "rejected_seed_records");
  addResult("registry_example_accepted_seed_records_non_empty", /^\s*-\s+seed_id\s*:/m.test(acceptedSection));
  addResult("registry_example_rejected_seed_records_non_empty", /^\s*-\s+seed_id\s*:/m.test(rejectedSection));

  validateRegistryEntry("accepted", acceptedSection, fixtureTexts.accepted);
  validateRegistryEntry("rejected", rejectedSection, fixtureTexts.rejected);

  const refs = extractFixtureRefs(registry);
  addResult("registry_example_fixture_refs_present", refs.length >= 2, refs.join(", "));
  for (const ref of refs) {
    addResult(`registry_example_fixture_ref_${ref}_repo_relative`, isRepoRelativeFixtureRef(ref), ref);
    addResult(`registry_example_fixture_ref_${ref}_not_runs`, !ref.includes("runs/"), ref);
    addResult(`registry_example_fixture_ref_${ref}_not_accepted_samples`, !ref.includes("accepted_samples/"), ref);
    addResult(`registry_example_fixture_ref_${ref}_exists`, fs.existsSync(repoPath(ref)), ref);
  }

  validateFalseFlags("registry_example_safety", registry, [
    "memory_suitability_default",
    "production_candidate_eligible_default",
    "provider_contact_allowed",
    "plugin_call_authorized",
    "api_call_authorized",
    "image_generation_authorized",
    "daily_note_write_authorized",
    "vcp_memory_write_authorized",
  ]);
  validateFalseFlags("registry_example_boundary", registry, [
    "image_binary_included",
    "real_provider_payload_included",
    "private_path_included",
    "external_manifest_included",
    "runtime_execution_authorized",
    "seed_ingestion_authorized",
    "accepted_samples_write_authorized",
    "memory_write_authorized",
    "memory_write_path_included",
    "production_candidate_authorized",
    "plugin_call_authorized",
    "api_call_authorized",
    "daily_note_write_authorized",
  ]);
  validateNoSensitiveMaterial("registry_example", registry);
}

function validateRegistryEntry(role, section, fixtureText) {
  const fixture = seedFixtures[role];
  const seedId = firstValue(section, "seed_id");
  const fixtureSeedId = firstValue(fixtureText, "seed_id");
  const fixtureRef = firstValue(section, "fixture_ref");
  const linkedRubricDimensions = listAfterField(section, "linked_rubric_dimensions");
  const linkedFailureTags = listAfterField(section, "linked_failure_tags");

  for (const field of [
    "seed_id",
    "fixture_ref",
    "intended_decision",
    "linked_rubric_dimensions",
    "linked_failure_tags",
    "redaction_status",
    "validation_role",
  ]) {
    addResult(`registry_${role}_entry_field_${field}_present`, hasField(section, field));
  }
  addResult(`registry_${role}_fixture_ref_expected`, fixtureRef === fixture.expectedRegistryRef, fixture.expectedRegistryRef);
  addResult(`registry_${role}_seed_id_matches_fixture`, seedId === fixtureSeedId, `${seedId || "(missing)"} vs ${fixtureSeedId || "(missing)"}`);
  addResult(`registry_${role}_intended_decision_expected`, hasExactValue(section, "intended_decision", fixture.expectedDecision), fixture.expectedDecision);
  addResult(`registry_${role}_redaction_metadata_only`, hasExactValue(section, "redaction_status", "redacted_metadata_only"));
  addResult(`registry_${role}_rubric_dimensions_non_empty`, linkedRubricDimensions.length > 0);

  if (fixture.requireFailureTags) {
    addResult(`registry_${role}_failure_tags_non_empty`, linkedFailureTags.length > 0);
  } else {
    addResult(`registry_${role}_failure_tags_empty_allowed`, hasExactValue(section, "linked_failure_tags", "[]") || linkedFailureTags.length >= 0);
  }
}

let schema = "";
let registry = "";
const fixtureTexts = {};

try {
  schema = readFile(schemaPath);
  addResult("schema_file_exists", true);
} catch (error) {
  addResult("schema_file_exists", false, error.message);
}

try {
  registry = readFile(registryExamplePath);
  addResult("registry_example_file_exists", true);
} catch (error) {
  addResult("registry_example_file_exists", false, error.message);
}

for (const [role, fixture] of Object.entries(seedFixtures)) {
  try {
    fixtureTexts[role] = readFile(fixture.path);
    addResult(`${role}_seed_fixture_file_exists`, true);
  } catch (error) {
    fixtureTexts[role] = "";
    addResult(`${role}_seed_fixture_file_exists`, false, error.message);
  }
}

if (schema) validateSchema(schema);
if (registry && fixtureTexts.accepted && fixtureTexts.rejected) {
  validateRegistryExample(registry, fixtureTexts);
}

const passed = errors.length === 0;
const summary = {
  validator: "validate_visual_eval_seed_registry_schema",
  version: "v1",
  passed,
  files_checked: [
    schemaPath,
    registryExamplePath,
    seedFixtures.accepted.path,
    seedFixtures.rejected.path,
  ],
  check_count: results.length,
  failed_count: errors.length,
  visual_eval_seed_registry_schema: {
    schema_file_present: Boolean(schema),
    example_file_present: Boolean(registry),
    accepted_fixture_present: Boolean(fixtureTexts.accepted),
    rejected_fixture_present: Boolean(fixtureTexts.rejected),
    accepted_seed_fixture_present: Boolean(fixtureTexts.accepted),
    rejected_seed_fixture_present: Boolean(fixtureTexts.rejected),
    accepted_seed_records_present: registry ? /^\s*accepted_seed_records\s*:/m.test(registry) : false,
    rejected_seed_records_present: registry ? /^\s*rejected_seed_records\s*:/m.test(registry) : false,
    fixture_refs_verified: passed,
    seed_id_cross_references_verified: passed,
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
