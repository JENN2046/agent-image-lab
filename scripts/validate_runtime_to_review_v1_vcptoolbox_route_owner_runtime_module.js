#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const validatorId = "runtime_to_review_v1_vcptoolbox_route_owner_runtime_module";
const ownerRuntimePath = "adapters/runtime/native_doubao_runtime_v1_vcptoolbox_route_owner_runtime.js";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function repoPath(relativePath) {
  const resolved = path.resolve(root, relativePath);
  const relative = path.relative(root, resolved);
  assert(!relative.startsWith("..") && !path.isAbsolute(relative), `path escapes repository: ${relativePath}`);
  return resolved;
}

function runNode(args) {
  return childProcess.execFileSync(process.execPath, args, {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
}

async function main() {
  runNode(["--check", ownerRuntimePath]);
  runNode(["--check", "scripts/validate_runtime_to_review_v1_vcptoolbox_route_owner_runtime_module.js"]);

  const moduleSource = fs.readFileSync(repoPath(ownerRuntimePath), "utf8");
  assert(!moduleSource.includes("AdminPassword"), "module source must not hard-code admin password key names outside one-time env names");
  assert(moduleSource.includes("AGENT_IMAGE_LAB_VCP_ADMIN_USERNAME"), "module must use one-time admin username env");
  assert(moduleSource.includes("AGENT_IMAGE_LAB_VCP_ADMIN_PASSWORD"), "module must use one-time admin password env");
  assert(moduleSource.includes("AGENT_IMAGE_LAB_VCP_ADMIN_BASIC_AUTH_B64"), "module must support one-time basic auth b64 env");
  assert(moduleSource.includes("Authorization: authHeader"), "module must send auth only as request header");
  assert(moduleSource.includes("resolution: \"1440x2560\""), "route owner runtime must use provider-valid 9:16 resolution");
  assert(moduleSource.includes("vcptoolbox_route_doubaogen_invalid_size_min_3686400"), "route owner runtime must classify invalid-size provider errors");
  assert(moduleSource.includes("timeout: 840000"), "route owner runtime HTTP client timeout must be above plugin wrapper timeout");
  assert(moduleSource.includes("vcptoolbox_route_doubaogen_timeout_12m"), "route owner runtime must classify DoubaoGen 12m timeout errors");
  assert(moduleSource.includes("summarizeRouteFailure"), "route owner runtime must expose sanitized route failure summaries");
  assert(moduleSource.includes("Basic <redacted>"), "route owner runtime must redact Basic auth in route summaries");
  assert(!moduleSource.includes("config.env"), "module must not read VCPToolBox config.env");

  const ownerRuntimeModule = require(repoPath(ownerRuntimePath));
  assert(ownerRuntimeModule.moduleId === "native_doubao_runtime_v1_vcptoolbox_route_owner_runtime", "route owner runtime module id mismatch");
  assert(ownerRuntimeModule.routeTaskId === "AUTH-DRAFT-NATIVE-DOUBAO-RUNTIME-TO-REVIEW-V1-20260529-001", "route task id mismatch");
  assert(ownerRuntimeModule.allowedOutputDirectory === "runs/real_generation/runtime_to_review_v1_guarded_live_probe/", "allowed output directory mismatch");
  assert(ownerRuntimeModule.requiredModel === "doubao-seedream-5-0-260128", "required model mismatch");
  assert(typeof ownerRuntimeModule.createSecretlessProviderRuntime === "function", "route owner runtime factory missing");
  assert(typeof ownerRuntimeModule.buildBasicAuthHeader === "function", "basic auth builder missing");

  const missingAuth = ownerRuntimeModule.buildBasicAuthHeader({});
  assert(missingAuth === null, "missing one-time admin auth env must fail closed");
  const userPassAuth = ownerRuntimeModule.buildBasicAuthHeader({
    AGENT_IMAGE_LAB_VCP_ADMIN_USERNAME: "user",
    AGENT_IMAGE_LAB_VCP_ADMIN_PASSWORD: "pass",
  });
  assert(userPassAuth === "Basic dXNlcjpwYXNz", "username/password auth header must be built without printing secret values");
  const b64Auth = ownerRuntimeModule.buildBasicAuthHeader({
    AGENT_IMAGE_LAB_VCP_ADMIN_BASIC_AUTH_B64: "dXNlcjpwYXNz",
  });
  assert(b64Auth === "Basic dXNlcjpwYXNz", "b64 auth env must be accepted");

  const readiness = ownerRuntimeModule.inspectRouteOwnerRuntimeReadiness({});
  assert(readiness.admin_basic_auth_env_present === false, "readiness without auth env must report absent");
  assert(readiness.secret_value_read_performed === false, "readiness must not read secret value");
  assert(readiness.env_file_content_read_performed === false, "readiness must not read env file content");

  const runtime = ownerRuntimeModule.createSecretlessProviderRuntime({ env: {} });
  assert(typeof runtime === "function", "route owner runtime bridge must be callable");
  assert(runtime.secretless_provider_runtime_delegate_bound === true, "route owner runtime bridge must be bound");

  process.stdout.write(`${JSON.stringify({
    passed: true,
    validator: validatorId,
    owner_runtime_module: ownerRuntimePath,
    route_owner_runtime_module_present: true,
    route_task_id: ownerRuntimeModule.routeTaskId,
    exact_output_scope: ownerRuntimeModule.allowedOutputDirectory,
    provider_valid_resolution: "1440x2560",
    invalid_size_error_classified: true,
    route_owner_runtime_timeout_ms: 840000,
    doubaogen_timeout_error_classified: true,
    sanitized_route_failure_summary_present: true,
    admin_basic_auth_env_required: true,
    admin_basic_auth_value_printed: false,
    config_env_read_performed: false,
    real_provider_call_performed: false,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    secret_value_read_performed: false,
    env_file_content_read_performed: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false,
    accepted_samples_write_performed: false,
    production_candidate_write_performed: false,
  }, null, 2)}\n`);
}

main().catch((error) => {
  process.stderr.write(`${JSON.stringify({
    passed: false,
    validator: validatorId,
    error: error.message,
  }, null, 2)}\n`);
  process.exitCode = 1;
});
