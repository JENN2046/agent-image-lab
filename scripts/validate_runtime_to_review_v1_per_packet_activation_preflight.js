#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const validator = "runtime_to_review_v1_per_packet_activation_preflight";
const preflightPath = "reports/runtime_to_review_v1/per_packet_owner_runtime_activation_preflight_20260601.json";
const ownerRuntimePath = "adapters/runtime/native_doubao_runtime_v1_per_packet_owner_runtime.js";
const packetPath = "reports/runtime_to_review_v1/guarded_live_probe_serum_bottle_inactive_preflight_packet_20260601.json";
const fixturePath = "tests/fixtures/runtime_kernel_v1_real_guarded_serum_bottle_task.fixture.json";
const promptPath = "prompts/image_generation/product_lifestyle_premium_serum_bottle_v1.yaml";
const packageScriptName = "validate:runtime-to-review-per-packet-activation-preflight";
const manifestId = "runtime_to_review_per_packet_activation_preflight";

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

function runNode(args) {
  return childProcess.execFileSync(process.execPath, args, {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
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

async function checkAsync(id, fn) {
  try {
    const ok = await fn();
    results.push({ check: id, passed: Boolean(ok) });
    if (!ok) passed = false;
  } catch (error) {
    results.push({ check: id, passed: false, error: error.message });
    passed = false;
  }
}

async function main() {
  runNode(["--check", ownerRuntimePath]);
  runNode(["--check", "scripts/validate_runtime_to_review_v1_per_packet_activation_preflight.js"]);

  const preflight = readJson(preflightPath);
  const packet = readJson(packetPath);
  const fixture = readJson(fixturePath);
  const packageJson = readJson("package.json");
  const manifest = readJson("scripts/validation_manifest.json");
  const ownerRuntime = require(repoPath(ownerRuntimePath));

  const exactRequest = {
    prompt_package_ref: promptPath,
    output_directory_ref: preflight.target_output_directory_ref,
    model: preflight.required_model,
    max_images: 1,
    output_scope: "run_directory_only",
    secret_value_read_allowed: false,
    retry_allowed: false,
  };

  check("preflight_exists", () => fs.existsSync(repoPath(preflightPath)));
  check("schema_and_inactive_status", () =>
    preflight.schema === "runtime_to_review_v1_per_packet_owner_runtime_activation_preflight.v1" &&
    preflight.status === "prepared_inactive_not_executed" &&
    preflight.can_execute_now === false &&
    preflight.execution_authorized_by_this_packet === false &&
    preflight.live_probe_authorized_by_this_packet === false
  );
  check("exact_refs_align", () =>
    preflight.owner_runtime_module === ownerRuntimePath &&
    preflight.target_packet_ref === packetPath &&
    preflight.target_fixture_ref === fixturePath &&
    preflight.target_prompt_package_ref === promptPath &&
    packet.target_prompt_package_ref === promptPath &&
    fixture.prompt_package_ref === promptPath
  );
  check("exact_output_and_model_align", () =>
    preflight.target_output_directory_ref === "runs/real_generation/runtime_to_review_v1_guarded_live_probe_serum_bottle/" &&
    packet.output_directory_ref === preflight.target_output_directory_ref &&
    preflight.required_model === "doubao-seedream-5-0-260128" &&
    fixture.model_required === preflight.required_model
  );
  check("runtime_module_exports_match_preflight", () =>
    ownerRuntime.moduleId === "native_doubao_runtime_v1_per_packet_owner_runtime" &&
    ownerRuntime.factoryId === preflight.owner_runtime_factory &&
    ownerRuntime.allowedPacketRef === packetPath &&
    ownerRuntime.allowedPromptPackageRef === promptPath &&
    ownerRuntime.allowedOutputDirectory === preflight.target_output_directory_ref &&
    ownerRuntime.requiredModel === preflight.required_model
  );
  check("current_budget_is_zero", () =>
    preflight.current_budget.max_provider_calls === 0 &&
    preflight.current_budget.max_plugin_calls === 0 &&
    preflight.current_budget.max_api_calls === 0 &&
    preflight.current_budget.max_images === 0 &&
    preflight.current_budget.retry_allowed === false
  );
  check("future_budget_is_capped_one_image", () =>
    preflight.future_activation_budget_ceiling.max_provider_calls === 1 &&
    preflight.future_activation_budget_ceiling.max_plugin_calls === 1 &&
    preflight.future_activation_budget_ceiling.max_api_calls === 1 &&
    preflight.future_activation_budget_ceiling.max_images === 1 &&
    preflight.future_activation_budget_ceiling.max_live_probe_attempts === 1 &&
    preflight.future_activation_budget_ceiling.retry_allowed === false
  );
  check("preflight_only_command_is_not_live", () =>
    Array.isArray(preflight.preflight_only_command_shape) &&
    preflight.preflight_only_command_shape.includes("--preflight-only") &&
    preflight.preflight_only_command_shape.includes(ownerRuntimePath) &&
    preflight.preflight_only_command_shape.includes(packet.exact_confirmation_phrase)
  );
  check("future_live_command_is_blocked", () =>
    Array.isArray(preflight.future_live_command_blocked_until) &&
    preflight.future_live_command_blocked_until.includes("a separate exact live activation packet sets can_execute_now true") &&
    Array.isArray(preflight.future_live_command_shape_after_unblock) &&
    preflight.future_live_command_shape_after_unblock.includes(ownerRuntimePath) &&
    !preflight.future_live_command_shape_after_unblock.includes("--preflight-only")
  );
  check("forbidden_now_all_false", () => Object.values(preflight.forbidden_now).every((value) => value === false));
  check("stop_conditions_preserve_failed_closed_boundary", () =>
    preflight.stop_conditions.includes("per-packet owner runtime does not fail closed for the serum binding") &&
    preflight.stop_conditions.includes("raw prompt text is accepted by the owner runtime request") &&
    preflight.stop_conditions.includes("secret value read or env file content read is required")
  );
  await checkAsync("runtime_default_and_bound_blockers_match_preflight", async () => {
    const defaultRuntime = ownerRuntime.createSecretlessProviderRuntime();
    const defaultResult = await defaultRuntime(exactRequest);
    const boundRuntime = ownerRuntime.createSecretlessProviderRuntime({ packetRef: packetPath });
    const boundResult = await boundRuntime(exactRequest);
    return defaultResult.blocker === preflight.owner_runtime_expected_default_blocker &&
      boundResult.blocker === preflight.owner_runtime_expected_bound_blocker &&
      boundResult.provider_contact_performed === false &&
      boundResult.plugin_call_performed === false &&
      boundResult.api_call_performed === false &&
      boundResult.image_generation_performed === false &&
      boundResult.output_write_performed === false &&
      boundResult.secret_value_read_performed === false &&
      boundResult.env_file_content_read_performed === false;
  });
  check("required_validation_names_current_validator", () =>
    preflight.required_local_validation_before_future_activation.includes(`npm run ${packageScriptName}`) &&
    preflight.required_local_validation_before_future_activation.includes("npm run validate:runtime-to-review-per-packet-owner-runtime") &&
    preflight.required_local_validation_before_future_activation.includes("npm run validate:validation-manifest")
  );
  check("package_script_registered", () =>
    packageJson.scripts &&
    packageJson.scripts[packageScriptName] === "node scripts/validate_runtime_to_review_v1_per_packet_activation_preflight.js"
  );
  check("manifest_entry_registered", () => {
    const entry = manifest.validators.find((item) => item.id === manifestId);
    return entry &&
      entry.command === `npm run ${packageScriptName}` &&
      entry.script === "scripts/validate_runtime_to_review_v1_per_packet_activation_preflight.js" &&
      entry.tier === "targeted" &&
      entry.domain === "runtime_to_review" &&
      entry.status === "active" &&
      entry.trigger_paths.includes(preflightPath) &&
      entry.trigger_paths.includes(ownerRuntimePath) &&
      entry.trigger_paths.includes(packetPath) &&
      entry.trigger_paths.includes(fixturePath) &&
      entry.trigger_paths.includes(promptPath) &&
      entry.required_for.includes("runtime_to_review_per_packet_activation_preflight_patch");
  });

  process.stdout.write(`${JSON.stringify({
    passed,
    validator,
    preflight: preflightPath,
    can_execute_now: preflight.can_execute_now,
    owner_runtime_module: preflight.owner_runtime_module,
    expected_default_blocker: preflight.owner_runtime_expected_default_blocker,
    expected_bound_blocker: preflight.owner_runtime_expected_bound_blocker,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    output_write_performed: false,
    secret_value_read_performed: false,
    env_file_content_read_performed: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false,
    accepted_samples_write_performed: false,
    production_candidate_write_performed: false,
    check_count: results.length,
    failed_count: results.filter((result) => !result.passed).length,
    results,
  }, null, 2)}\n`);
  if (!passed) process.exitCode = 1;
}

main().catch((error) => {
  process.stderr.write(`${JSON.stringify({
    passed: false,
    validator,
    error: error.message,
  }, null, 2)}\n`);
  process.exitCode = 1;
});
