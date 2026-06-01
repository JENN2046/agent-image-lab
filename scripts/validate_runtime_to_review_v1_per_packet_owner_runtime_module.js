#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const validator = "runtime_to_review_v1_per_packet_owner_runtime_module";
const modulePath = "adapters/runtime/native_doubao_runtime_v1_per_packet_owner_runtime.js";
const currentOwnerRuntimePath = "adapters/runtime/native_doubao_runtime_v1_real_bound_owner_runtime.js";
const packetPath = "reports/runtime_to_review_v1/guarded_live_probe_serum_bottle_inactive_preflight_packet_20260601.json";
const designPreflightPath = "reports/runtime_to_review_v1/serum_bottle_owner_runtime_binding_design_preflight_20260601.json";
const fixturePath = "tests/fixtures/runtime_kernel_v1_real_guarded_serum_bottle_task.fixture.json";
const promptPath = "prompts/image_generation/product_lifestyle_premium_serum_bottle_v1.yaml";
const packagePath = "package.json";
const manifestPath = "scripts/validation_manifest.json";
const packageScriptName = "validate:runtime-to-review-per-packet-owner-runtime";
const manifestId = "runtime_to_review_per_packet_owner_runtime";

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
  runNode(["--check", modulePath]);
  runNode(["--check", "scripts/validate_runtime_to_review_v1_per_packet_owner_runtime_module.js"]);

  const perPacketRuntime = require(repoPath(modulePath));
  const currentOwnerRuntime = require(repoPath(currentOwnerRuntimePath));
  const packet = readJson(packetPath);
  const designPreflight = readJson(designPreflightPath);
  const fixture = readJson(fixturePath);
  const packageJson = readJson(packagePath);
  const manifest = readJson(manifestPath);
  const moduleSource = fs.readFileSync(repoPath(modulePath), "utf8");

  const validRequest = {
    prompt_package_ref: perPacketRuntime.allowedPromptPackageRef,
    output_directory_ref: perPacketRuntime.allowedOutputDirectory,
    model: perPacketRuntime.requiredModel,
    max_images: 1,
    output_scope: "run_directory_only",
    secret_value_read_allowed: false,
    retry_allowed: false,
  };

  check("module_exists", () => fs.existsSync(repoPath(modulePath)));
  check("module_exports", () =>
    typeof perPacketRuntime === "function" &&
    perPacketRuntime.moduleId === "native_doubao_runtime_v1_per_packet_owner_runtime" &&
    perPacketRuntime.factoryId === "per_packet_exact_binding_factory" &&
    typeof perPacketRuntime.per_packet_exact_binding_factory === "function" &&
    typeof perPacketRuntime.createSecretlessProviderRuntime === "function" &&
    typeof perPacketRuntime.loadAndValidatePacketBinding === "function"
  );
  check("exact_constants", () =>
    perPacketRuntime.allowedPacketRef === packetPath &&
    perPacketRuntime.allowedFixtureRef === fixturePath &&
    perPacketRuntime.allowedPromptPackageRef === promptPath &&
    perPacketRuntime.allowedOutputDirectory === "runs/real_generation/runtime_to_review_v1_guarded_live_probe_serum_bottle/" &&
    perPacketRuntime.requiredModel === "doubao-seedream-5-0-260128" &&
    perPacketRuntime.expectedConfirmation === "RUNTIME_TO_REVIEW_V1_ONE_PROVIDER_ONE_IMAGE"
  );
  check("source_has_no_live_provider_execution_path", () =>
    !moduleSource.includes("child_process") &&
    !moduleSource.includes("execFile") &&
    !moduleSource.includes("runDoubaoPlugin") &&
    !moduleSource.includes("runNative") &&
    !moduleSource.includes("dotenv") &&
    !moduleSource.includes("config.env") &&
    !moduleSource.includes("process.env") &&
    !moduleSource.includes("sharp")
  );
  check("source_failed_closed_language_present", () =>
    moduleSource.includes("BLOCKED_PER_PACKET_OWNER_RUNTIME_FAILED_CLOSED") &&
    moduleSource.includes("per_packet_owner_runtime_live_execution_not_enabled") &&
    moduleSource.includes("packet_ref_required_for_exact_binding_factory")
  );
  check("packet_fixture_prompt_align", () =>
    packet.target_prompt_package_ref === promptPath &&
    packet.output_directory_ref === perPacketRuntime.allowedOutputDirectory &&
    fixture.prompt_package_ref === promptPath &&
    fixture.model_required === perPacketRuntime.requiredModel &&
    fixture.max_images === 1 &&
    fs.existsSync(repoPath(promptPath))
  );
  check("design_preflight_selected_this_module", () =>
    designPreflight.recommended_design.option_id === "per_packet_exact_binding_factory" &&
    designPreflight.recommended_design.future_exact_write_allowlist.includes(modulePath) &&
    designPreflight.recommended_design.future_exact_write_allowlist.includes("scripts/validate_runtime_to_review_v1_per_packet_owner_runtime_module.js")
  );
  check("current_apple_owner_runtime_unchanged", () =>
    currentOwnerRuntime.allowedPromptPackageRef === "prompts/image_generation/neutral_smoke_test_red_apple_v1.yaml" &&
    currentOwnerRuntime.allowedOutputDirectory === "runs/real_generation/runtime_to_review_v1_guarded_live_probe/" &&
    currentOwnerRuntime.allowedPromptPackageRef !== perPacketRuntime.allowedPromptPackageRef
  );
  check("packet_binding_validates_exact_serum_packet", () => {
    const validation = perPacketRuntime.loadAndValidatePacketBinding({ packetRef: packetPath });
    return validation.passed === true &&
      validation.binding.prompt_package_ref === promptPath &&
      validation.binding.output_directory_ref === perPacketRuntime.allowedOutputDirectory &&
      validation.binding.can_execute_now === false;
  });
  check("default_no_arg_factory_fails_closed", () => {
    const factory = perPacketRuntime.per_packet_exact_binding_factory();
    return factory.can_execute_now === false &&
      factory.live_execution_enabled === false &&
      factory.packet_binding_validation.passed === false &&
      factory.packet_binding_validation.issues.includes("packet_ref_required_for_exact_binding_factory");
  });
  check("bad_packet_refs_are_rejected", () => {
    const wrong = perPacketRuntime.loadAndValidatePacketBinding({ packetRef: fixturePath });
    let traversalRejected = false;
    let absoluteRejected = false;
    try {
      perPacketRuntime.loadAndValidatePacketBinding({ packetRef: "../outside.json" });
    } catch {
      traversalRejected = true;
    }
    try {
      perPacketRuntime.loadAndValidatePacketBinding({ packetRef: path.resolve(root, packetPath) });
    } catch {
      absoluteRejected = true;
    }
    return wrong.passed === false &&
      wrong.issues.includes("packet_ref_not_exactly_allowed") &&
      traversalRejected &&
      absoluteRejected;
  });
  check("packet_mutation_rejected", () => {
    const mutatedPrompt = { ...packet, target_prompt_package_ref: "prompts/image_generation/neutral_smoke_test_red_apple_v1.yaml" };
    const mutatedOutput = { ...packet, output_directory_ref: "runs/real_generation/runtime_to_review_v1_guarded_live_probe/" };
    const mutatedAuth = { ...packet, can_execute_now: true };
    return perPacketRuntime.validatePacketBinding(mutatedPrompt, { fixture }).passed === false &&
      perPacketRuntime.validatePacketBinding(mutatedOutput, { fixture }).passed === false &&
      perPacketRuntime.validatePacketBinding(mutatedAuth, { fixture }).passed === false;
  });
  check("readiness_is_failed_closed_and_side_effect_free", () => {
    const readiness = perPacketRuntime.inspectPerPacketOwnerRuntimeReadiness();
    return readiness.packet_binding_passed === true &&
      readiness.can_execute_now === false &&
      readiness.live_execution_enabled === false &&
      readiness.default_failed_closed === true &&
      readiness.provider_contact_performed === false &&
      readiness.plugin_call_performed === false &&
      readiness.api_call_performed === false &&
      readiness.image_generation_performed === false &&
      readiness.output_write_performed === false &&
      readiness.secret_value_read_performed === false &&
      readiness.env_file_content_read_performed === false;
  });
  await checkAsync("valid_bound_runtime_still_blocks_live_execution", async () => {
    const runtime = perPacketRuntime.createSecretlessProviderRuntime({ packetRef: packetPath });
    const result = await runtime(validRequest);
    return typeof runtime === "function" &&
      runtime.per_packet_owner_runtime_failed_closed === true &&
      runtime.per_packet_binding_loaded === true &&
      result.status === "BLOCKED_PER_PACKET_OWNER_RUNTIME_FAILED_CLOSED" &&
      result.blocker === "per_packet_owner_runtime_live_execution_not_enabled" &&
      result.request_validation_passed === true &&
      result.packet_binding_passed === true &&
      result.calls_used.provider === 0 &&
      result.provider_contact_performed === false &&
      result.plugin_call_performed === false &&
      result.api_call_performed === false &&
      result.image_generation_performed === false &&
      result.output_write_performed === false;
  });
  await checkAsync("invalid_requests_fail_closed_without_side_effects", async () => {
    const runtime = perPacketRuntime.createSecretlessProviderRuntime({ packetRef: packetPath });
    const wrongPrompt = await runtime({ ...validRequest, prompt_package_ref: "prompts/image_generation/neutral_smoke_test_red_apple_v1.yaml" });
    const rawPrompt = await runtime({ ...validRequest, prompt: "raw prompt text must not be accepted" });
    const wrongOutput = await runtime({ ...validRequest, output_directory_ref: "runs/real_generation/runtime_to_review_v1_guarded_live_probe/" });
    return wrongPrompt.blocker === "per_packet_owner_runtime_request_invalid" &&
      rawPrompt.blocker === "per_packet_owner_runtime_request_invalid" &&
      wrongOutput.blocker === "per_packet_owner_runtime_request_invalid" &&
      wrongPrompt.provider_contact_performed === false &&
      rawPrompt.provider_contact_performed === false &&
      wrongOutput.output_write_performed === false;
  });
  await checkAsync("default_runtime_call_fails_closed_without_packet", async () => {
    const runtime = perPacketRuntime.createSecretlessProviderRuntime();
    const result = await runtime(validRequest);
    return runtime.per_packet_binding_loaded === false &&
      result.blocker === "per_packet_exact_binding_packet_missing_or_invalid" &&
      result.packet_binding_passed === false &&
      result.provider_contact_performed === false &&
      result.image_generation_performed === false;
  });
  check("package_script_registered", () =>
    packageJson.scripts &&
    packageJson.scripts[packageScriptName] === "node scripts/validate_runtime_to_review_v1_per_packet_owner_runtime_module.js"
  );
  check("manifest_entry_registered", () => {
    const entry = manifest.validators.find((item) => item.id === manifestId);
    return entry &&
      entry.command === `npm run ${packageScriptName}` &&
      entry.script === "scripts/validate_runtime_to_review_v1_per_packet_owner_runtime_module.js" &&
      entry.tier === "targeted" &&
      entry.domain === "runtime_to_review" &&
      entry.status === "active" &&
      entry.trigger_paths.includes(modulePath) &&
      entry.trigger_paths.includes(packetPath) &&
      entry.trigger_paths.includes(fixturePath) &&
      entry.trigger_paths.includes(promptPath) &&
      entry.trigger_paths.includes(packagePath) &&
      entry.required_for.includes("runtime_to_review_per_packet_owner_runtime_patch");
  });

  process.stdout.write(`${JSON.stringify({
    passed,
    validator,
    module: modulePath,
    packet: packetPath,
    prompt_package_ref: perPacketRuntime.allowedPromptPackageRef,
    output_directory_ref: perPacketRuntime.allowedOutputDirectory,
    can_execute_now: false,
    live_execution_enabled: false,
    default_failed_closed: true,
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
