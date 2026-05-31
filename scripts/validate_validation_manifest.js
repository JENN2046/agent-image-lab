#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const manifestPath = path.join(root, "scripts", "validation_manifest.json");
const allowedTiers = new Set(["smoke", "mvp", "targeted", "archive"]);
const allowedStatuses = new Set(["active", "historical", "deprecated"]);
const allowedRuntimeClasses = new Set(["fast", "medium", "slow"]);

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

function fileExists(relativePath) {
  return fs.existsSync(repoPath(relativePath));
}

function main() {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const validators = manifest.validators || [];
  const ids = validators.map((entry) => entry.id);
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);

  add("schema_version_v1", manifest.schema_version === "validation_manifest_v1");
  add("policy_does_not_replace_mvp", manifest.policy?.does_not_replace_validate_mvp === true);
  add("policy_no_external_side_effects", [
    "no_provider_contact",
    "no_api_call",
    "no_image_generation",
    "no_secret_value_read",
    "tracked_assets_not_slimmed",
  ].every((key) => manifest.policy?.[key] === true));
  add("validators_non_empty", validators.length > 0, validators.length);
  add("validator_ids_unique", duplicateIds.length === 0, duplicateIds);
  add("smoke_entry_present", validators.some((entry) => entry.id === "smoke" && entry.tier === "smoke"));
  add("mvp_entry_present", validators.some((entry) => entry.id === "mvp_core" && entry.tier === "mvp"));
  add("agent_board_entry_present", validators.some((entry) => entry.id === "agent_board_state"));

  for (const entry of validators) {
    add(`validator_${entry.id}_has_command`, typeof entry.command === "string" && entry.command.length > 0);
    add(`validator_${entry.id}_script_exists`, typeof entry.script === "string" && fileExists(entry.script), entry.script);
    add(`validator_${entry.id}_tier_valid`, allowedTiers.has(entry.tier), entry.tier);
    add(`validator_${entry.id}_status_valid`, allowedStatuses.has(entry.status), entry.status);
    add(`validator_${entry.id}_runtime_class_valid`, allowedRuntimeClasses.has(entry.estimated_runtime_class), entry.estimated_runtime_class);
    add(`validator_${entry.id}_domain_present`, typeof entry.domain === "string" && entry.domain.length > 0);
    add(`validator_${entry.id}_trigger_paths_present`, Array.isArray(entry.trigger_paths) && entry.trigger_paths.length > 0);
    add(`validator_${entry.id}_required_for_present`, Array.isArray(entry.required_for) && entry.required_for.length > 0);
  }

  const failed = checks.filter((check) => !check.passed);
  const output = {
    passed: failed.length === 0,
    validator: "validate_validation_manifest",
    manifest_ref: "scripts/validation_manifest.json",
    validator_count: validators.length,
    failed_count: failed.length,
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
    validator: "validate_validation_manifest",
    error: error.message,
  }, null, 2)}\n`);
  process.exit(1);
}
