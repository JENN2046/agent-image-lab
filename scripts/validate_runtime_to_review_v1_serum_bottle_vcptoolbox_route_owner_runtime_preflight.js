#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const validator = "runtime_to_review_v1_serum_bottle_vcptoolbox_route_owner_runtime_preflight";
const ownerRuntimePath = "adapters/runtime/native_doubao_runtime_v1_serum_bottle_vcptoolbox_route_owner_runtime.js";
const preflightPath = "reports/runtime_to_review_v1/serum_bottle_vcptoolbox_route_owner_runtime_preflight_20260601.json";
const serumFixturePath = "tests/fixtures/runtime_kernel_v1_real_guarded_serum_bottle_task.fixture.json";
const packageScriptName = "validate:runtime-to-review-serum-bottle-vcptoolbox-route-owner-preflight";
const manifestId = "runtime_to_review_serum_bottle_vcptoolbox_route_owner_runtime_preflight";

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

function includesAll(values, expectedValues) {
  return Array.isArray(values) && expectedValues.every((value) => values.includes(value));
}

function allFalse(object) {
  return object && Object.values(object).every((value) => value === false);
}

function main() {
  const ownerRuntimeSource = fs.readFileSync(repoPath(ownerRuntimePath), "utf8");
  const ownerRuntime = require(repoPath(ownerRuntimePath));
  const preflight = readJson(preflightPath);
  const serumFixture = readJson(serumFixturePath);
  const packageJson = readJson("package.json");
  const manifest = readJson("scripts/validation_manifest.json");

  check("node_syntax_clean", () =>
    runNodeCheck(ownerRuntimePath) &&
    runNodeCheck("scripts/validate_runtime_to_review_v1_serum_bottle_vcptoolbox_route_owner_runtime_preflight.js")
  );
  check("preflight_is_non_executing", () =>
    preflight.schema === "runtime_to_review_v1_serum_bottle_vcptoolbox_route_owner_runtime_preflight.v1" &&
    preflight.status === "completed_local_preflight_no_execution" &&
    preflight.conclusion.can_execute_now === false &&
    preflight.conclusion.new_trial_authorized_now === false &&
    preflight.conclusion.future_live_probe_requires_new_exact_activation === true &&
    allFalse(preflight.actions_not_performed)
  );
  check("owner_runtime_exports_serum_scope", () =>
    ownerRuntime.moduleId === "native_doubao_runtime_v1_serum_bottle_vcptoolbox_route_owner_runtime" &&
    ownerRuntime.allowedPromptPackageRef === serumFixture.prompt_package_ref &&
    ownerRuntime.allowedOutputDirectory === serumFixture.output_directory_ref &&
    ownerRuntime.requiredModel === serumFixture.model_required &&
    ownerRuntime.routeTaskId === "RUNTIME-TO-REVIEW-V1-SERUM-BOTTLE-VCPTOOLBOX-ROUTE-001" &&
    ownerRuntime.pipelineId === "runtime_v1_serum_bottle_vcptoolbox_route_001"
  );
  check("owner_runtime_uses_route_not_direct_child", () =>
    ownerRuntimeSource.includes("admin_api/ai-image-agents/execute") &&
    ownerRuntimeSource.includes("type: \"generate_image\"") &&
    ownerRuntimeSource.includes("plugin: \"DoubaoGen\"") &&
    ownerRuntimeSource.includes("resolution: \"1440x2560\"") &&
    ownerRuntimeSource.includes("Authorization: authHeader") &&
    !ownerRuntimeSource.includes("pluginManager.processToolCall") &&
    !ownerRuntimeSource.includes("scripts/vcptoolbox_doubao_owner_runtime_child") &&
    !ownerRuntimeSource.includes("config.env")
  );
  check("readiness_is_local_and_secretless", () => {
    const readiness = ownerRuntime.inspectRouteOwnerRuntimeReadiness({});
    return readiness.admin_basic_auth_env_present === false &&
      readiness.admin_basic_auth_value_printed === false &&
      readiness.secret_value_read_performed === false &&
      readiness.env_file_content_read_performed === false &&
      readiness.provider_contact_performed === false &&
      readiness.plugin_call_performed === false &&
      readiness.api_call_performed === false &&
      readiness.image_generation_performed === false &&
      readiness.output_directory_allowed === serumFixture.output_directory_ref &&
      readiness.prompt_package_allowed === serumFixture.prompt_package_ref &&
      readiness.plan_resolution === "1440x2560";
  });
  check("route_body_is_serum_scoped_without_http", () => {
    const body = ownerRuntime._private.routeRequestBody({
      prompt: "SERUM_PROMPT_PLACEHOLDER",
      model: ownerRuntime.requiredModel,
      outputDirectory: ownerRuntime.allowedOutputDirectory,
    });
    return body.pipelineId === ownerRuntime.pipelineId &&
      body.taskId === ownerRuntime.routeTaskId &&
      body.dryRun === false &&
      body.confirm === true &&
      body.plan.steps.length === 1 &&
      body.plan.steps[0].type === "generate_image" &&
      body.plan.steps[0].plugin === "DoubaoGen" &&
      body.plan.steps[0].prompt === "SERUM_PROMPT_PLACEHOLDER" &&
      body.plan.steps[0].model === ownerRuntime.requiredModel &&
      body.plan.steps[0].resolution === "1440x2560" &&
      body.context.doubaoProjectBasePathOverride.replace(/\\/g, "/").endsWith(ownerRuntime.allowedOutputDirectory.replace(/\/$/, ""));
  });
  check("future_activation_gate_recorded", () =>
    preflight.required_future_activation.owner_phrase === "RUNTIME_TO_REVIEW_V1_SERUM_BOTTLE_ONE_PROVIDER_ONE_IMAGE" &&
    preflight.required_future_activation.runner_confirmation_phrase === "RUNTIME_TO_REVIEW_V1_ONE_PROVIDER_ONE_IMAGE" &&
    preflight.required_future_activation.max_images === 1 &&
    preflight.required_future_activation.retry_allowed === false &&
    preflight.required_future_activation.overwrite_existing_files_allowed === false
  );
  check("stop_conditions_preserve_no_execution_boundary", () => includesAll(preflight.stop_conditions, [
    "running a live probe",
    "invoking realBoundOwnerRuntimeDelegate",
    "issuing an HTTP request to the VCPToolBox route",
    "reading config.env or any secret value",
    "modifying real VCPToolBox or VCPChat",
  ]));
  check("package_script_registered", () =>
    packageJson.scripts &&
    packageJson.scripts[packageScriptName] === "node scripts/validate_runtime_to_review_v1_serum_bottle_vcptoolbox_route_owner_runtime_preflight.js"
  );
  check("manifest_entry_registered", () => {
    const entry = manifest.validators.find((item) => item.id === manifestId);
    return entry &&
      entry.command === `npm run ${packageScriptName}` &&
      entry.script === "scripts/validate_runtime_to_review_v1_serum_bottle_vcptoolbox_route_owner_runtime_preflight.js" &&
      entry.tier === "targeted" &&
      entry.domain === "runtime_to_review" &&
      entry.status === "active" &&
      includesAll(entry.trigger_paths, [
        ownerRuntimePath,
        preflightPath,
        serumFixturePath,
        "prompts/image_generation/product_lifestyle_premium_serum_bottle_v1.yaml",
        "package.json",
      ]) &&
      entry.required_for.includes("runtime_to_review_serum_bottle_vcptoolbox_route_owner_runtime_preflight_patch");
  });

  process.stdout.write(`${JSON.stringify({
    passed,
    validator,
    owner_runtime_module: ownerRuntimePath,
    preflight: preflightPath,
    can_execute_now: false,
    live_probe_performed: false,
    route_http_request_performed: false,
    owner_runtime_delegate_invoked: false,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    secret_value_read_performed: false,
    env_file_content_read_performed: false,
    check_count: results.length,
    failed_count: results.filter((result) => !result.passed).length,
    results,
  }, null, 2)}\n`);
  if (!passed) process.exitCode = 1;
}

main();
