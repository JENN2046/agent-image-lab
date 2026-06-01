#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const validator = "runtime_to_review_v1_serum_bottle_exact_live_activation_packet_draft";
const draftPath = "reports/runtime_to_review_v1/serum_bottle_exact_live_activation_packet_draft_20260601.json";
const preflightPath = "reports/runtime_to_review_v1/per_packet_owner_runtime_activation_preflight_20260601.json";
const inactivePacketPath = "reports/runtime_to_review_v1/guarded_live_probe_serum_bottle_inactive_preflight_packet_20260601.json";
const ownerRuntimePath = "adapters/runtime/native_doubao_runtime_v1_per_packet_owner_runtime.js";
const delegatePath = "adapters/runtime/native_doubao_runtime_v1_provider_delegate.js";
const runnerPath = "scripts/run_runtime_to_review_v1_guarded_live_probe.js";
const fixturePath = "tests/fixtures/runtime_kernel_v1_real_guarded_serum_bottle_task.fixture.json";
const promptPath = "prompts/image_generation/product_lifestyle_premium_serum_bottle_v1.yaml";
const packageScriptName = "validate:runtime-to-review-serum-bottle-exact-live-activation-draft";
const manifestId = "runtime_to_review_serum_bottle_exact_live_activation_draft";

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
  runNode(["--check", runnerPath]);
  runNode(["--check", ownerRuntimePath]);
  runNode(["--check", "scripts/validate_runtime_to_review_v1_serum_bottle_exact_live_activation_packet_draft.js"]);

  const draft = readJson(draftPath);
  const preflight = readJson(preflightPath);
  const inactivePacket = readJson(inactivePacketPath);
  const fixture = readJson(fixturePath);
  const packageJson = readJson("package.json");
  const manifest = readJson("scripts/validation_manifest.json");
  const ownerRuntime = require(repoPath(ownerRuntimePath));
  const runner = require(repoPath(runnerPath));

  const exactRequest = {
    prompt_package_ref: promptPath,
    output_directory_ref: draft.target_output_directory_ref,
    model: draft.required_model,
    max_images: 1,
    output_scope: "run_directory_only",
    secret_value_read_allowed: false,
    retry_allowed: false,
  };

  check("draft_exists", () => fs.existsSync(repoPath(draftPath)));
  check("schema_and_inactive_status", () =>
    draft.schema === "runtime_to_review_v1_exact_live_activation_packet_draft.v1" &&
    draft.status === "draft_inactive_not_executed" &&
    draft.can_execute_now === false &&
    draft.execution_authorized_by_this_packet === false &&
    draft.live_probe_authorized_by_this_packet === false &&
    draft.requires_separate_owner_activation === true
  );
  check("activation_phrase_is_distinct_from_runner_phrase", () =>
    draft.required_future_owner_confirmation_phrase === "RUNTIME_TO_REVIEW_V1_SERUM_BOTTLE_ONE_PROVIDER_ONE_IMAGE" &&
    draft.runner_confirmation_phrase_still_required === runner.exactConfirmation &&
    draft.required_future_owner_confirmation_phrase !== draft.runner_confirmation_phrase_still_required
  );
  check("source_refs_align", () =>
    draft.source_preflight_ref === preflightPath &&
    draft.source_inactive_packet_ref === inactivePacketPath &&
    draft.owner_runtime_module === ownerRuntimePath &&
    draft.provider_delegate_module === delegatePath &&
    draft.runner === runnerPath &&
    draft.target_fixture_ref === fixturePath &&
    draft.target_prompt_package_ref === promptPath &&
    preflight.target_prompt_package_ref === promptPath &&
    inactivePacket.target_prompt_package_ref === promptPath &&
    fixture.prompt_package_ref === promptPath
  );
  check("output_model_and_runtime_align", () =>
    draft.target_output_directory_ref === "runs/real_generation/runtime_to_review_v1_guarded_live_probe_serum_bottle/" &&
    draft.target_output_directory_ref === preflight.target_output_directory_ref &&
    draft.target_output_directory_ref === inactivePacket.output_directory_ref &&
    draft.required_model === "doubao-seedream-5-0-260128" &&
    ownerRuntime.allowedOutputDirectory === draft.target_output_directory_ref &&
    ownerRuntime.allowedPromptPackageRef === draft.target_prompt_package_ref &&
    ownerRuntime.requiredModel === draft.required_model
  );
  check("current_budget_zero_and_future_budget_capped", () =>
    draft.current_budget.max_provider_calls === 0 &&
    draft.current_budget.max_plugin_calls === 0 &&
    draft.current_budget.max_api_calls === 0 &&
    draft.current_budget.max_images === 0 &&
    draft.current_budget.max_live_probe_attempts === 0 &&
    draft.current_budget.retry_allowed === false &&
    draft.future_activation_budget_ceiling.max_provider_calls === 1 &&
    draft.future_activation_budget_ceiling.max_plugin_calls === 1 &&
    draft.future_activation_budget_ceiling.max_api_calls === 1 &&
    draft.future_activation_budget_ceiling.max_images === 1 &&
    draft.future_activation_budget_ceiling.max_live_probe_attempts === 1 &&
    draft.future_activation_budget_ceiling.retry_allowed === false &&
    draft.future_activation_budget_ceiling.max_runtime_probe_minutes === 10
  );
  check("live_command_shape_is_exact_but_not_authorized", () =>
    Array.isArray(draft.exact_live_command_shape_if_separately_activated) &&
    draft.exact_live_command_shape_if_separately_activated.includes(fixturePath) &&
    draft.exact_live_command_shape_if_separately_activated.includes(delegatePath) &&
    draft.exact_live_command_shape_if_separately_activated.includes(ownerRuntimePath) &&
    draft.exact_live_command_shape_if_separately_activated.includes(runner.exactConfirmation) &&
    draft.exact_live_command_shape_if_separately_activated.includes("1") &&
    !draft.exact_live_command_shape_if_separately_activated.includes("--preflight-only") &&
    draft.can_execute_now === false
  );
  check("preflight_only_command_required", () =>
    Array.isArray(draft.preflight_only_command_required_before_activation) &&
    draft.preflight_only_command_required_before_activation.includes("--preflight-only") &&
    draft.preflight_only_command_required_before_activation.includes(ownerRuntimePath) &&
    draft.preflight_only_command_required_before_activation.includes(runner.exactConfirmation)
  );
  check("receipt_and_review_refs_are_planned_only", () =>
    draft.future_activation_must_write_receipt === true &&
    draft.planned_receipt_ref_if_activated_later === "reports/runtime_to_review_v1/serum_bottle_exact_live_probe_receipt_20260601.json" &&
    draft.planned_review_bridge_ref_if_activated_later === "review_console/live_receipt_bridge/serum_bottle_exact_live_probe_20260601.review_entry.json" &&
    draft.planned_artifact_record_ref_if_activated_later === "reports/runtime_to_review_v1/serum_bottle_exact_live_probe_artifact_record_20260601.json"
  );
  check("output_directory_preflight_is_closed", () =>
    draft.output_directory_preflight_required.directory_ref === draft.target_output_directory_ref &&
    draft.output_directory_preflight_required.must_be_repository_relative === true &&
    draft.output_directory_preflight_required.must_not_contain_traversal === true &&
    draft.output_directory_preflight_required.must_not_be_absolute === true &&
    draft.output_directory_preflight_required.unexpected_existing_files_allowed === false &&
    draft.output_directory_preflight_required.overwrite_existing_files_allowed === false
  );
  check("forbidden_now_all_false", () => Object.values(draft.forbidden_now).every((value) => value === false));
  check("stop_conditions_preserve_no_execution_boundary", () =>
    draft.stop_conditions.includes("can_execute_now remains false") &&
    draft.stop_conditions.includes("missing separate owner activation phrase RUNTIME_TO_REVIEW_V1_SERUM_BOTTLE_ONE_PROVIDER_ONE_IMAGE") &&
    draft.stop_conditions.includes("output directory contains unexpected existing files") &&
    draft.stop_conditions.includes("secret value read or env file content read is required by Agent Image Lab")
  );
  check("required_checks_include_self_and_neighbors", () =>
    draft.required_checks_before_any_future_execution.includes(`npm run ${packageScriptName}`) &&
    draft.required_checks_before_any_future_execution.includes("npm run validate:runtime-to-review-per-packet-owner-runtime") &&
    draft.required_checks_before_any_future_execution.includes("npm run validate:runtime-to-review-per-packet-activation-preflight") &&
    draft.required_checks_before_any_future_execution.includes("npm run validate:runtime-to-review-serum-bottle-inactive-preflight") &&
    draft.required_checks_before_any_future_execution.includes("npm run validate:validation-manifest")
  );
  await checkAsync("owner_runtime_still_fails_closed_for_exact_request", async () => {
    const runtime = ownerRuntime.createSecretlessProviderRuntime({ packetRef: inactivePacketPath });
    const result = await runtime(exactRequest);
    return result.blocker === "per_packet_owner_runtime_live_execution_not_enabled" &&
      result.provider_contact_performed === false &&
      result.plugin_call_performed === false &&
      result.api_call_performed === false &&
      result.image_generation_performed === false &&
      result.output_write_performed === false &&
      result.secret_value_read_performed === false &&
      result.env_file_content_read_performed === false;
  });
  check("package_script_registered", () =>
    packageJson.scripts &&
    packageJson.scripts[packageScriptName] === "node scripts/validate_runtime_to_review_v1_serum_bottle_exact_live_activation_packet_draft.js"
  );
  check("manifest_entry_registered", () => {
    const entry = manifest.validators.find((item) => item.id === manifestId);
    return entry &&
      entry.command === `npm run ${packageScriptName}` &&
      entry.script === "scripts/validate_runtime_to_review_v1_serum_bottle_exact_live_activation_packet_draft.js" &&
      entry.tier === "targeted" &&
      entry.domain === "runtime_to_review" &&
      entry.status === "active" &&
      entry.trigger_paths.includes(draftPath) &&
      entry.trigger_paths.includes(preflightPath) &&
      entry.trigger_paths.includes(ownerRuntimePath) &&
      entry.trigger_paths.includes(inactivePacketPath) &&
      entry.trigger_paths.includes(fixturePath) &&
      entry.trigger_paths.includes(promptPath) &&
      entry.required_for.includes("runtime_to_review_serum_bottle_exact_live_activation_draft_patch");
  });

  process.stdout.write(`${JSON.stringify({
    passed,
    validator,
    draft: draftPath,
    can_execute_now: draft.can_execute_now,
    execution_authorized_by_this_packet: draft.execution_authorized_by_this_packet,
    required_future_owner_confirmation_phrase: draft.required_future_owner_confirmation_phrase,
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
