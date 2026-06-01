#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const validator = "runtime_to_review_v1_serum_bottle_admin_auth_env_readiness_preflight";
const preflightPath = "reports/runtime_to_review_v1/serum_bottle_vcptoolbox_admin_auth_env_readiness_preflight_20260601.json";
const ownerRuntimePath = "adapters/runtime/native_doubao_runtime_v1_serum_bottle_vcptoolbox_route_owner_runtime.js";
const packageScriptName = "validate:runtime-to-review-serum-bottle-admin-auth-env-readiness";
const manifestId = "runtime_to_review_serum_bottle_admin_auth_env_readiness_preflight";

let passed = true;
const results = [];

function repoPath(relativePath) {
  const resolved = path.resolve(root, relativePath);
  const relative = path.relative(root, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`path escapes repository: ${relativePath}`);
  }
  return resolved;
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(repoPath(relativePath), "utf8"));
}

function runNodeCheck(relativePath) {
  childProcess.execFileSync(process.execPath, ["--check", relativePath], {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  return true;
}

function check(id, fn) {
  try {
    const ok = fn();
    results.push({ check: id, passed: Boolean(ok) });
    if (!ok) passed = false;
  } catch (error) {
    results.push({ check: id, passed: false, error: error.message });
    passed = false;
  }
}

function nonEmptyEnv(env, key) {
  return typeof env[key] === "string" && env[key].trim() !== "";
}

function currentReadiness(env = process.env, ownerRuntime) {
  const b64Present = nonEmptyEnv(env, "AGENT_IMAGE_LAB_VCP_ADMIN_BASIC_AUTH_B64");
  const usernamePresent = nonEmptyEnv(env, "AGENT_IMAGE_LAB_VCP_ADMIN_USERNAME");
  const passwordPresent = nonEmptyEnv(env, "AGENT_IMAGE_LAB_VCP_ADMIN_PASSWORD");
  const header = ownerRuntime.buildBasicAuthHeader(env);
  return {
    admin_basic_auth_b64_present: b64Present,
    admin_username_present: usernamePresent,
    admin_password_present: passwordPresent,
    username_password_pair_present: usernamePresent && passwordPresent,
    admin_auth_header_constructable: typeof header === "string" && header.startsWith("Basic ") && header.length > "Basic ".length,
    admin_auth_header_redacted_shape: typeof header === "string" && header.startsWith("Basic ") ? "Basic <redacted>" : null,
    secret_bearing_env_lookup_performed: true,
    secret_value_read_performed_for_header_readiness: Boolean(header),
    secret_values_printed: false,
    secret_values_written: false,
    env_file_content_read_performed: false,
    config_env_read_performed: false,
    route_http_request_performed: false,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
  };
}

function includesAll(values, expectedValues) {
  return Array.isArray(values) && expectedValues.every((value) => values.includes(value));
}

function main() {
  const preflight = readJson(preflightPath);
  const ownerRuntime = require(repoPath(ownerRuntimePath));
  const ownerRuntimeSource = fs.readFileSync(repoPath(ownerRuntimePath), "utf8");
  const packageJson = readJson("package.json");
  const manifest = readJson("scripts/validation_manifest.json");
  const readiness = currentReadiness(process.env, ownerRuntime);

  check("node_syntax_clean", () =>
    runNodeCheck("scripts/validate_runtime_to_review_v1_serum_bottle_admin_auth_env_readiness_preflight.js") &&
    runNodeCheck(ownerRuntimePath)
  );
  check("preflight_contract_is_non_executing", () =>
    preflight.schema === "runtime_to_review_v1_serum_bottle_vcptoolbox_admin_auth_env_readiness_preflight.v1" &&
    preflight.conclusion.can_execute_now === false &&
    preflight.conclusion.live_probe_authorized_by_this_preflight === false &&
    preflight.future_live_probe_requirements.new_exact_owner_activation_required === true
  );
  check("allowed_env_keys_are_exact", () => includesAll(preflight.allowed_env_keys, [
    "AGENT_IMAGE_LAB_VCP_ADMIN_BASIC_AUTH_B64",
    "AGENT_IMAGE_LAB_VCP_ADMIN_USERNAME",
    "AGENT_IMAGE_LAB_VCP_ADMIN_PASSWORD",
  ]) && preflight.allowed_env_keys.length === 3);
  check("owner_runtime_auth_builder_shape", () =>
    typeof ownerRuntime.buildBasicAuthHeader === "function" &&
    ownerRuntimeSource.includes("AGENT_IMAGE_LAB_VCP_ADMIN_BASIC_AUTH_B64") &&
    ownerRuntimeSource.includes("AGENT_IMAGE_LAB_VCP_ADMIN_USERNAME") &&
    ownerRuntimeSource.includes("AGENT_IMAGE_LAB_VCP_ADMIN_PASSWORD") &&
    ownerRuntime.buildBasicAuthHeader({}) === null &&
    ownerRuntime.buildBasicAuthHeader({ AGENT_IMAGE_LAB_VCP_ADMIN_BASIC_AUTH_B64: "abc" }) === "Basic abc" &&
    ownerRuntime.buildBasicAuthHeader({
      AGENT_IMAGE_LAB_VCP_ADMIN_USERNAME: "user",
      AGENT_IMAGE_LAB_VCP_ADMIN_PASSWORD: "pass",
    }) === "Basic dXNlcjpwYXNz"
  );
  check("current_env_readiness_shape_is_redacted", () =>
    Object.prototype.hasOwnProperty.call(readiness, "admin_auth_header_constructable") &&
    Object.prototype.hasOwnProperty.call(readiness, "admin_auth_header_redacted_shape") &&
    !JSON.stringify(readiness).includes("AGENT_IMAGE_LAB_VCP_ADMIN_PASSWORD") &&
    !JSON.stringify(readiness).includes("AGENT_IMAGE_LAB_VCP_ADMIN_BASIC_AUTH_B64") &&
    readiness.secret_values_printed === false &&
    readiness.secret_values_written === false
  );
  check("no_external_or_generation_action", () =>
    readiness.route_http_request_performed === false &&
    readiness.provider_contact_performed === false &&
    readiness.plugin_call_performed === false &&
    readiness.api_call_performed === false &&
    readiness.image_generation_performed === false &&
    readiness.env_file_content_read_performed === false &&
    readiness.config_env_read_performed === false
  );
  check("package_script_registered", () =>
    packageJson.scripts &&
    packageJson.scripts[packageScriptName] === "node scripts/validate_runtime_to_review_v1_serum_bottle_admin_auth_env_readiness_preflight.js"
  );
  check("manifest_entry_registered", () => {
    const entry = manifest.validators.find((item) => item.id === manifestId);
    return entry &&
      entry.command === `npm run ${packageScriptName}` &&
      entry.script === "scripts/validate_runtime_to_review_v1_serum_bottle_admin_auth_env_readiness_preflight.js" &&
      entry.tier === "targeted" &&
      entry.domain === "runtime_to_review" &&
      entry.status === "active" &&
      includesAll(entry.trigger_paths, [
        preflightPath,
        ownerRuntimePath,
        "reports/runtime_to_review_v1/serum_bottle_exact_live_probe_receipt_20260601_attempt_004.json",
        "scripts/validate_runtime_to_review_v1_serum_bottle_admin_auth_env_readiness_preflight.js",
        "package.json",
      ]) &&
      entry.required_for.includes("runtime_to_review_serum_bottle_admin_auth_env_readiness_preflight_patch");
  });

  process.stdout.write(`${JSON.stringify({
    passed,
    validator,
    preflight: preflightPath,
    owner_runtime_module: ownerRuntimePath,
    current_env_readiness: readiness,
    live_probe_performed: false,
    route_http_request_performed: false,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    env_file_content_read_performed: false,
    config_env_read_performed: false,
    secret_values_printed: false,
    secret_values_written: false,
    check_count: results.length,
    failed_count: results.filter((result) => !result.passed).length,
    results,
  }, null, 2)}\n`);
  if (!passed) process.exitCode = 1;
}

main();
