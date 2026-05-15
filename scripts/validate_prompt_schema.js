#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const VALIDATOR = "validate_prompt_schema";
const VERSION = "v1";

function usage() {
  return [
    "Usage:",
    "  node scripts/validate_prompt_schema.js --manifest <manifest.json>",
    "  node scripts/validate_prompt_schema.js --type <artifact_type> <file> [<file> ...]",
  ].join("\n");
}

function failSetup(message, extra) {
  const summary = {
    validator: VALIDATOR,
    version: VERSION,
    mode: "setup",
    passed: false,
    errors: [{ rule: "validator_setup", message }],
    provider_contact_performed: false,
    image_generation_performed: false,
    env_local_read: false,
    file_mutation_performed: false,
    git_operation_performed: false,
    ...(extra || {}),
  };
  console.log(JSON.stringify(summary, null, 2));
  process.exit(2);
}

function resolveInside(baseDir, candidate) {
  const resolved = path.resolve(baseDir, candidate);
  const normalizedBase = path.resolve(baseDir);
  const relative = path.relative(normalizedBase, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`path escapes allowed root: ${candidate}`);
  }
  return resolved;
}

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function hasLine(text, pattern) {
  return pattern.test(text);
}

function hasField(text, field) {
  return new RegExp(`^${escapeRegExp(field)}\\s*:`, "im").test(text);
}

function hasFalse(text, field) {
  return new RegExp(`^${escapeRegExp(field)}\\s*:\\s*false\\b`, "im").test(text);
}

function hasTrue(text, field) {
  return new RegExp(`^${escapeRegExp(field)}\\s*:\\s*true\\b`, "im").test(text);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeBlock(value) {
  return value
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .join("\n")
    .trim();
}

function extractLiteralBlock(text, key) {
  const lines = text.split(/\r?\n/);
  const startIndex = lines.findIndex((line) => new RegExp(`^${escapeRegExp(key)}\\s*:\\s*\\|\\s*$`).test(line));
  if (startIndex === -1) return null;
  const block = [];
  for (let index = startIndex + 1; index < lines.length; index += 1) {
    const line = lines[index];
    if (/^\S/.test(line) && /^[A-Za-z0-9_]+:/.test(line)) break;
    if (line.startsWith("  ")) {
      block.push(line.slice(2));
    } else if (line.trim() === "") {
      block.push("");
    } else {
      break;
    }
  }
  return normalizeBlock(block.join("\n"));
}

function artifactResult(file, type, expected) {
  return {
    file,
    type,
    expected,
    observed: "pass",
    errors: [],
    warnings: [],
    infos: [],
  };
}

function addError(result, rule, message) {
  result.errors.push({ rule, severity: "ERROR", message });
}

function addWarning(result, rule, message) {
  result.warnings.push({ rule, severity: "WARN", message });
}

function requireField(result, text, field, rule) {
  if (!hasField(text, field)) addError(result, rule || `${field}_present`, `${field} is required`);
}

function requireFalse(result, text, field, rule) {
  if (!hasFalse(text, field)) addError(result, rule || `${field}_false`, `${field}: false is required`);
}

function requireTrue(result, text, field, rule) {
  if (!hasTrue(text, field)) addError(result, rule || `${field}_true`, `${field}: true is required`);
}

function requireWatchItemsOrDeclaredNone(result, text) {
  if (hasField(text, "watch_items") || hasField(text, "watch_items_none")) return;
  if (hasTrue(text, "legacy_watch_items_exception")) {
    addWarning(result, "legacy_review_missing_watch_items", "legacy review declares a watch-items exception");
    return;
  }
  addError(result, "watch_items_present_or_none_declared", "watch_items or watch_items_none is required");
}

function validatePromptPackage(result, text) {
  const promptBlock = extractLiteralBlock(text, "prompt");
  const positiveBlock = extractLiteralBlock(text, "positive_prompt");
  const negativeBlock = extractLiteralBlock(text, "negative_prompt");

  if (!hasLine(text, /^prompt\s*:\s*\|\s*$/m)) {
    addError(result, "prompt_literal_block_independent", "prompt: | must be present on its own line");
  }
  if (!hasLine(text, /^positive_prompt\s*:\s*\|\s*$/m)) {
    addError(result, "positive_prompt_literal_block_independent", "positive_prompt: | must be present on its own line");
  }
  if (!hasLine(text, /^negative_prompt\s*:\s*\|\s*$/m)) {
    addError(result, "negative_prompt_literal_block_independent", "negative_prompt: | must be present on its own line");
  }
  if (promptBlock && positiveBlock && promptBlock !== positiveBlock) {
    addError(result, "prompt_positive_prompt_synchronized", "prompt and positive_prompt literal blocks must match");
  }

  requireField(result, text, "prompt", "runner_canonical_prompt_field_present");
  requireField(result, text, "product_identity");
  requireField(result, text, "selected_product");
  requireField(result, text, "locked_structure");

  if (!hasField(text, "product_brief_ref")) {
    if (hasTrue(text, "legacy_exception")) {
      addWarning(result, "product_brief_ref_present_or_legacy_exception", "legacy exception allows missing product_brief_ref");
    } else {
      addError(result, "product_brief_ref_present_or_legacy_exception", "product_brief_ref is required unless legacy_exception is true");
    }
  }

  requireField(result, text, "material_constraints");
  requireField(result, text, "structure_constraints");
  requireField(result, text, "scene_constraints");
  requireField(result, text, "forbidden_elements");
  requireField(result, text, "acceptance_criteria");
  requireField(result, text, "human_review_checklist");
  requireFalse(result, text, "provider_contact_allowed");
  requireFalse(result, text, "image_generation_allowed");
  requireFalse(result, text, "memory_write_allowed");
  requireFalse(result, text, "production_candidate_002_allowed");

  if (hasField(text, "approved_product") || hasField(text, "provider_calls_max")) {
    addError(result, "prompt_package_is_not_A5_authorization", "prompt package must not contain A5 authorization fields");
  }
}

function validateProductBrief(result, text) {
  requireField(result, text, "selected_product");
  requireField(result, text, "product_identity");
  requireField(result, text, "structure_lock");
  requireField(result, text, "material_texture_description");
  requireField(result, text, "packaging_label_boundary");
  requireField(result, text, "visual_goal");
  requireField(result, text, "risk_matrix");
  requireField(result, text, "negative_constraints");
  requireField(result, text, "acceptance_criteria_draft");
}

function validateStaticReview(result, text) {
  requireField(result, text, "reviewed_artifact_ref");
  requireField(result, text, "static_review_result");
  requireWatchItemsOrDeclaredNone(result, text);
  requireFalse(result, text, "A5_authorization_created");
  requireFalse(result, text, "provider_contact");
  requireFalse(result, text, "image_generation");
  requireFalse(result, text, "memory_write");
}

function validateA5Authorization(result, text) {
  requireField(result, text, "approved_product");
  requireField(result, text, "approved_prompt_package");
  requireField(result, text, "output_directory");
  requireField(result, text, "provider_calls_max");
  requireField(result, text, "generation_attempts_max");
  requireField(result, text, "output_images_max");
  requireFalse(result, text, "auto_retry");
  requireTrue(result, text, "stop_after_generation");
  requireField(result, text, "secret_read_boundary");
  requireFalse(result, text, "A5_execution_started");
  requireFalse(result, text, "provider_contact");
}

function validateHumanReview(result, text) {
  requireField(result, text, "reviewed_output");
  requireField(result, text, "asset_status");
  requireField(result, text, "accepted_candidate");
  requireField(result, text, "commercial_delivery_ready");
  requireField(result, text, "memory_suitability");
  requireField(result, text, "key_findings");
  if (hasTrue(text, "generation_success")) {
    requireTrue(result, text, "local_persistence_verified");
  }
  requireFalse(result, text, "memory_write");
  requireFalse(result, text, "accepted_samples_written");
}

function validateAcceptedCandidateEvidence(result, text) {
  requireField(result, text, "source_output");
  requireField(result, text, "prompt_package");
  requireField(result, text, "asset_status");
  requireField(result, text, "accepted_candidate");
  requireField(result, text, "commercial_delivery_ready");
  requireField(result, text, "memory_suitability");
  requireTrue(result, text, "evidence_package_created");
  requireFalse(result, text, "output_image_added_to_git");
  requireFalse(result, text, "accepted_samples_written");
  requireFalse(result, text, "memory_write_performed");
  requireFalse(result, text, "production_candidate_002_started");
}

function validateRouteLevel(result, text) {
  requireField(result, text, "machine_validator_implemented");
  requireField(result, text, "existing_artifacts_migrated");
  requireFalse(result, text, "provider_contact");
  requireFalse(result, text, "image_generation");
  requireFalse(result, text, "memory_write");
  requireFalse(result, text, "production_candidate_002");
  requireField(result, text, "recommended_next");
  requireFalse(result, text, "next_phase_started");
}

function validateText(file, type, text, expected) {
  const result = artifactResult(file, type, expected || "pass");
  const validators = {
    prompt_package: validatePromptPackage,
    product_brief: validateProductBrief,
    static_review: validateStaticReview,
    A5_authorization: validateA5Authorization,
    human_review: validateHumanReview,
    accepted_candidate_evidence: validateAcceptedCandidateEvidence,
    route_level: validateRouteLevel,
  };
  const validator = validators[type];
  if (!validator) {
    addError(result, "artifact_type_supported", `unsupported artifact type: ${type}`);
  } else {
    validator(result, text);
  }
  result.observed = result.errors.length > 0 ? "fail" : result.warnings.length > 0 ? "warn" : "pass";
  result.expected_matched = result.observed === result.expected;
  return result;
}

function loadManifest(manifestPath) {
  let raw;
  try {
    raw = readText(manifestPath);
  } catch (error) {
    failSetup(`manifest could not be read: ${error.message}`, { manifest: manifestPath });
  }
  let manifest;
  try {
    manifest = JSON.parse(raw);
  } catch (error) {
    failSetup(`manifest is not valid JSON: ${error.message}`, { manifest: manifestPath });
  }
  if (!Array.isArray(manifest.fixtures)) {
    failSetup("manifest.fixtures must be an array", { manifest: manifestPath });
  }
  return manifest;
}

function runManifest(manifestArg) {
  const repoRoot = process.cwd();
  const manifestPath = resolveInside(repoRoot, manifestArg);
  const manifestDir = path.dirname(manifestPath);
  const manifest = loadManifest(manifestPath);
  const results = [];
  const setupErrors = [];

  for (const fixture of manifest.fixtures) {
    if (!fixture || typeof fixture.path !== "string" || typeof fixture.type !== "string" || typeof fixture.expected !== "string") {
      setupErrors.push({ rule: "manifest_fixture_shape", message: "fixture entries require path, type, and expected" });
      continue;
    }
    let fixturePath;
    try {
      fixturePath = resolveInside(manifestDir, fixture.path);
    } catch (error) {
      setupErrors.push({ rule: "manifest_fixture_path", file: fixture.path, message: error.message });
      continue;
    }
    if (!fs.existsSync(fixturePath)) {
      setupErrors.push({ rule: "manifest_fixture_missing", file: fixture.path, message: "listed fixture file is missing" });
      continue;
    }
    const text = readText(fixturePath);
    const result = validateText(fixture.path, fixture.type, text, fixture.expected);
    results.push(result);
  }

  const expectedFailures = results.filter((result) => !result.expected_matched);
  const warningsTotal = results.reduce((sum, result) => sum + result.warnings.length, 0);
  const errorsTotal = results.reduce((sum, result) => sum + result.errors.length, 0);
  const passed = setupErrors.length === 0 && expectedFailures.length === 0;
  const summary = {
    validator: VALIDATOR,
    version: VERSION,
    mode: "manifest",
    manifest: path.relative(repoRoot, manifestPath).replace(/\\/g, "/"),
    passed,
    fixtures_checked: results.length,
    expected_matched_count: results.length - expectedFailures.length,
    expected_mismatch_count: expectedFailures.length,
    setup_error_count: setupErrors.length,
    warnings_total: warningsTotal,
    fixture_errors_total: errorsTotal,
    provider_contact_performed: false,
    image_generation_performed: false,
    env_local_read: false,
    file_mutation_performed: false,
    git_operation_performed: false,
    setup_errors: setupErrors,
    results,
  };
  console.log(JSON.stringify(summary, null, 2));
  process.exit(passed ? 0 : 1);
}

function runExplicitFiles(args) {
  const typeIndex = args.indexOf("--type");
  if (typeIndex === -1 || !args[typeIndex + 1]) failSetup(usage());
  const type = args[typeIndex + 1];
  const files = args.filter((arg, index) => index !== typeIndex && index !== typeIndex + 1 && !arg.startsWith("--"));
  if (files.length === 0) failSetup(usage());
  const repoRoot = process.cwd();
  const results = files.map((file) => {
    const filePath = resolveInside(repoRoot, file);
    if (!fs.existsSync(filePath)) {
      const result = artifactResult(file, type, "pass");
      addError(result, "explicit_file_missing", "file is missing");
      result.observed = "fail";
      result.expected_matched = false;
      return result;
    }
    return validateText(file, type, readText(filePath), "pass");
  });
  const errorsTotal = results.reduce((sum, result) => sum + result.errors.length, 0);
  const warningsTotal = results.reduce((sum, result) => sum + result.warnings.length, 0);
  const summary = {
    validator: VALIDATOR,
    version: VERSION,
    mode: "explicit_files",
    passed: errorsTotal === 0,
    files_checked: results.length,
    errors_total: errorsTotal,
    warnings_total: warningsTotal,
    provider_contact_performed: false,
    image_generation_performed: false,
    env_local_read: false,
    file_mutation_performed: false,
    git_operation_performed: false,
    results,
  };
  console.log(JSON.stringify(summary, null, 2));
  process.exit(errorsTotal === 0 ? 0 : 1);
}

const args = process.argv.slice(2);
const manifestIndex = args.indexOf("--manifest");
if (manifestIndex !== -1) {
  if (!args[manifestIndex + 1]) failSetup(usage());
  runManifest(args[manifestIndex + 1]);
} else {
  runExplicitFiles(args);
}
