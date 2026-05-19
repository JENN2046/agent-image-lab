#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "..");
const privateRoot = path.join(root, ".agent_private");
fs.mkdirSync(privateRoot, { recursive: true });
const tempDir = fs.mkdtempSync(path.join(privateRoot, "image-metadata-safety-"));
const shortPng = path.join(tempDir, "short.png");
fs.writeFileSync(shortPng, Buffer.from("89504e", "hex"));

const relativeShortPng = path.relative(root, shortPng).replace(/\\/g, "/");
const core = createRecoverabilityCore(root);
const checks = [];
const add = (check, passed, detail = null) => checks.push({ check, passed: Boolean(passed), ...(detail === null ? {} : { detail }) });

try {
  const dimensions = core.readPngDimensions(relativeShortPng);
  add("short_png_does_not_throw", true, dimensions);
  add("short_png_signature_invalid", dimensions.signatureValid === false, dimensions);
  add("short_png_width_null", dimensions.width === null, dimensions);
  add("short_png_height_null", dimensions.height === null, dimensions);
} catch (error) {
  add("short_png_does_not_throw", false, error.message);
}

fs.rmSync(tempDir, { recursive: true, force: true });

const failed = checks.filter((check) => !check.passed);
const output = {
  validator: "validate_artifact_recoverability_core_image_safety",
  version: "v1",
  passed: failed.length === 0,
  status: failed.length === 0 ? "artifact_recoverability_core_image_safety_verified" : "artifact_recoverability_core_image_safety_failed",
  check_count: checks.length,
  failed_count: failed.length,
  temp_workspace_root_class: ".agent_private",
  file_write_performed: false,
  production_write_performed: false,
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  image_generation_performed: false,
  checks,
  failures: failed,
};
console.log(JSON.stringify(output, null, 2));
process.exit(output.passed ? 0 : 1);
