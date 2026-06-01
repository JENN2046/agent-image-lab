#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const validator = "runtime_to_review_v1_serum_bottle_owner_activated_packet";
const packetPath = "reports/runtime_to_review_v1/serum_bottle_owner_activated_live_probe_packet_20260601.json";
const ownerRuntimePath = "adapters/runtime/native_doubao_runtime_v1_serum_bottle_owner_runtime.js";
const delegatePath = "adapters/runtime/native_doubao_runtime_v1_provider_delegate.js";
const runnerPath = "scripts/run_runtime_to_review_v1_guarded_live_probe.js";
const bridgePath = "scripts/native_doubao_secretless_provider_runtime_bridge.js";
const ownerPhrase = "RUNTIME_TO_REVIEW_V1_SERUM_BOTTLE_ONE_PROVIDER_ONE_IMAGE";
const runnerPhrase = "RUNTIME_TO_REVIEW_V1_ONE_PROVIDER_ONE_IMAGE";
const promptRef = "prompts/image_generation/product_lifestyle_premium_serum_bottle_v1.yaml";
const outputDir = "runs/real_generation/runtime_to_review_v1_guarded_live_probe_serum_bottle/";

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

async function check(id, fn) {
  try {
    const ok = await fn();
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

async function main() {
  const packet = readJson(packetPath);
  const ownerRuntime = require(repoPath(ownerRuntimePath));
  const runner = require(repoPath(runnerPath));
  const bridgeSource = fs.readFileSync(repoPath(bridgePath), "utf8");
  const packageJson = readJson("package.json");
  const manifest = readJson("scripts/validation_manifest.json");

  await check("changed_js_syntax_valid", () =>
    runNodeCheck(ownerRuntimePath) &&
    runNodeCheck(bridgePath) &&
    runNodeCheck(runnerPath) &&
    runNodeCheck(delegatePath) &&
    runNodeCheck("scripts/validate_runtime_to_review_v1_serum_bottle_owner_activated_packet.js")
  );
  await check("active_packet_is_exact_and_authorized", () =>
    packet.schema === "runtime_to_review_v1_serum_bottle_owner_activated_live_probe_packet.v1" &&
    packet.can_execute_now === true &&
    packet.decision_authorized_by_this_packet === true &&
    packet.execution_authorized_by_this_packet === true &&
    packet.live_probe_authorized_by_this_packet === true &&
    packet.activated_by_owner_confirmation === ownerPhrase &&
    packet.runner_confirmation_phrase === runnerPhrase
  );
  await check("active_packet_scope_is_one_serum_image", () =>
    packet.target_prompt_package_ref === promptRef &&
    packet.target_output_directory_ref === outputDir &&
    packet.target_product === "premium_serum_bottle" &&
    packet.required_model === "doubao-seedream-5-0-260128" &&
    packet.budget.max_provider_calls === 1 &&
    packet.budget.max_plugin_calls === 1 &&
    packet.budget.max_api_calls === 1 &&
    packet.budget.max_images === 1 &&
    packet.budget.max_live_probe_attempts === 1 &&
    packet.budget.retry_allowed === false &&
    packet.budget.uncapped_cost_allowed === false
  );
  await check("active_packet_uses_serum_owner_runtime", () =>
    packet.owner_runtime_module === ownerRuntimePath &&
    packet.provider_delegate_module === delegatePath &&
    packet.runner === runnerPath &&
    ownerRuntime.moduleId === "native_doubao_runtime_v1_serum_bottle_owner_runtime" &&
    ownerRuntime.activePacketRef === packetPath &&
    ownerRuntime.allowedPromptPackageRef === promptRef &&
    ownerRuntime.allowedOutputDirectory === outputDir &&
    ownerRuntime.ownerConfirmationPhrase === ownerPhrase
  );
  await check("owner_runtime_active_packet_authorization_loads", () => {
    const authorization = ownerRuntime.loadActivePacketAuthorization();
    return authorization.passed === true && authorization.issues.length === 0;
  });
  await check("bridge_allows_serum_prompt_and_output", () =>
    bridgeSource.includes(`"${promptRef}"`) &&
    bridgeSource.includes(`"${outputDir}"`) &&
    bridgeSource.includes("ALLOWED_PROMPT_PACKAGE_REFS.has(request.prompt_package_ref)") &&
    bridgeSource.includes("ALLOWED_OUTPUT_DIRECTORY_REFS.has(request.output_directory_ref)")
  );
  await check("preflight_only_command_passes_without_live_probe", async () => {
    const result = await runner.runLiveProbe({
      input: packet.target_fixture_ref,
      provider_delegate_module: packet.provider_delegate_module,
      owner_runtime_module: packet.owner_runtime_module,
      confirm_live_provider_probe: runnerPhrase,
      max_images: 1,
      preflight_only: true,
    });
    return result.passed === true &&
      result.status === "preflight_only_no_live_probe_executed" &&
      result.preflight_would_pass_with_current_args === true &&
      result.provider_contact_performed === false &&
      result.image_generation_performed === false;
  });
  await check("runtime_readiness_is_secretless_and_side_effect_free", () => {
    const readiness = ownerRuntime.inspectSerumBottleOwnerRuntimeReadiness();
    return readiness.active_packet_valid === true &&
      readiness.env_file_content_read_performed === false &&
      readiness.secret_value_read_performed === false &&
      readiness.provider_contact_performed === false &&
      readiness.image_generation_performed === false;
  });
  await check("stop_conditions_keep_red_lanes", () =>
    packet.stop_conditions.includes("pre-run validator fails") &&
    packet.stop_conditions.includes("target output directory contains unexpected existing files") &&
    packet.stop_conditions.includes("max_images is not exactly 1") &&
    packet.stop_conditions.includes("retry is requested") &&
    packet.stop_conditions.includes("Agent Image Lab must read secret value or env file content directly") &&
    packet.stop_conditions.includes("DailyNote write, VCP memory write, accepted sample promotion, production candidate write, push, tag, release, deploy, force push, history rewrite, delete, or overwrite is required")
  );
  await check("receipt_refs_exact", () =>
    packet.receipt_refs.provider_receipt_ref === "reports/runtime_to_review_v1/serum_bottle_exact_live_probe_receipt_20260601.json" &&
    packet.receipt_refs.artifact_record_ref === "reports/runtime_to_review_v1/serum_bottle_exact_live_probe_artifact_record_20260601.json" &&
    packet.receipt_refs.review_bridge_ref === "review_console/live_receipt_bridge/serum_bottle_exact_live_probe_20260601.review_entry.json" &&
    packet.receipt_required_after_attempt === true
  );
  await check("package_script_registered", () =>
    packageJson.scripts &&
    packageJson.scripts["validate:runtime-to-review-serum-bottle-owner-activated-packet"] === "node scripts/validate_runtime_to_review_v1_serum_bottle_owner_activated_packet.js"
  );
  await check("manifest_entry_registered", () => {
    const entry = manifest.validators.find((item) => item.id === "runtime_to_review_serum_bottle_owner_activated_packet");
    return entry &&
      entry.command === "npm run validate:runtime-to-review-serum-bottle-owner-activated-packet" &&
      entry.script === "scripts/validate_runtime_to_review_v1_serum_bottle_owner_activated_packet.js" &&
      entry.tier === "targeted" &&
      entry.domain === "runtime_to_review" &&
      entry.status === "active" &&
      includesAll(entry.trigger_paths, [packetPath, ownerRuntimePath, bridgePath, "package.json"]) &&
      entry.required_for.includes("runtime_to_review_serum_bottle_owner_activated_packet_patch");
  });

  process.stdout.write(`${JSON.stringify({
    passed,
    validator,
    packet: packetPath,
    active_packet_can_execute_now: packet.can_execute_now,
    owner_runtime_module: ownerRuntimePath,
    target_prompt_package_ref: promptRef,
    target_output_directory_ref: outputDir,
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

main().catch((error) => {
  process.stderr.write(`${JSON.stringify({ passed: false, validator, error: error.message }, null, 2)}\n`);
  process.exitCode = 1;
});
