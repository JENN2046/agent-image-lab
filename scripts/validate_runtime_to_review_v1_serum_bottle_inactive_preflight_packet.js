#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const YAML = require("yaml");

const root = path.resolve(__dirname, "..");
const validator = "runtime_to_review_v1_serum_bottle_inactive_preflight_packet";
const packetPath = "reports/runtime_to_review_v1/guarded_live_probe_serum_bottle_inactive_preflight_packet_20260601.json";
const fixturePath = "tests/fixtures/runtime_kernel_v1_real_guarded_serum_bottle_task.fixture.json";
const promptPath = "prompts/image_generation/product_lifestyle_premium_serum_bottle_v1.yaml";
const runnerPath = "scripts/run_runtime_to_review_v1_guarded_live_probe.js";
const ownerRuntimePath = "adapters/runtime/native_doubao_runtime_v1_real_bound_owner_runtime.js";
const delegatePath = "adapters/runtime/native_doubao_runtime_v1_provider_delegate.js";

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

function readYaml(relativePath) {
  return YAML.parse(fs.readFileSync(repoPath(relativePath), "utf8"));
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

const packet = readJson(packetPath);
const fixture = readJson(fixturePath);
const promptPackage = readYaml(promptPath);
const runner = require(repoPath(runnerPath));
const ownerRuntime = require(repoPath(ownerRuntimePath));
const delegate = require(repoPath(delegatePath));

check("packet_exists", () => fs.existsSync(repoPath(packetPath)));
check("fixture_exists", () => fs.existsSync(repoPath(fixturePath)));
check("prompt_exists", () => fs.existsSync(repoPath(promptPath)));
check("runner_exists", () => fs.existsSync(repoPath(runnerPath)));
check("owner_runtime_exists", () => fs.existsSync(repoPath(ownerRuntimePath)));
check("delegate_exists", () => fs.existsSync(repoPath(delegatePath)));
check("packet_schema", () => packet.schema === "runtime_to_review_v1_guarded_live_probe_preflight_packet.v1");
check("packet_inactive", () =>
  packet.status === "prepared_inactive_not_executed" &&
  packet.can_execute_now === false &&
  packet.execution_authorized_by_this_packet === false
);
check("target_prompt_bound", () =>
  packet.target_prompt_package_ref === promptPath &&
  fixture.prompt_package_ref === promptPath &&
  packet.target_prompt_package_id === "product_lifestyle_premium_serum_bottle_v1"
);
check("serum_prompt_has_runner_fields", () =>
  typeof promptPackage.prompt === "string" &&
  promptPackage.prompt.trim().length > 0 &&
  typeof promptPackage.positive_prompt === "string" &&
  promptPackage.positive_prompt.trim().length > 0 &&
  typeof promptPackage.negative_prompt === "string" &&
  promptPackage.negative_prompt.trim().length > 0
);
check("serum_prompt_no_execution_flags", () =>
  promptPackage.A5_authorization_required_later === true &&
  promptPackage.plugin_call_allowed_by_this_file === false &&
  promptPackage.provider_contact_allowed_by_this_file === false &&
  promptPackage.image_generation_allowed_by_this_file === false &&
  promptPackage.memory_write_allowed === false &&
  promptPackage.runs_output_creation_allowed === false
);
check("fixture_is_real_guarded_one_image_review_required", () =>
  fixture.provider_route === "native_doubao_guarded" &&
  fixture.provider_mode === "real_guarded" &&
  fixture.model_required === "doubao-seedream-5-0-260128" &&
  fixture.max_images === 1 &&
  fixture.output_scope === "run_directory_only" &&
  fixture.review_required === true &&
  fixture.secret_value_read_allowed === false
);
check("current_owner_runtime_prompt_allowlist_blocks_serum", () =>
  ownerRuntime.allowedPromptPackageRef === "prompts/image_generation/neutral_smoke_test_red_apple_v1.yaml" &&
  ownerRuntime.allowedPromptPackageRef !== packet.target_prompt_package_ref &&
  packet.can_execute_now === false
);
check("current_delegate_output_binding_not_reused_as_serum_ready", () =>
  delegate.defaultOutputDirectory === "runs/real_generation/runtime_to_review_v1_guarded_live_probe/" &&
  packet.output_directory_ref === "runs/real_generation/runtime_to_review_v1_guarded_live_probe_serum_bottle/"
);
check("future_command_shape_stays_blocked", () =>
  Array.isArray(packet.future_live_command_shape_after_unblock) &&
  packet.future_live_command_shape_after_unblock.includes("<serum-bottle-capable-owner-runtime-module>") &&
  Array.isArray(packet.future_live_command_blocked_until) &&
  packet.future_live_command_blocked_until.includes("owner runtime has an exact serum-bottle prompt allowlist or equivalent per-packet prompt binding")
);
check("exact_confirmation_matches_runner", () =>
  packet.exact_confirmation_phrase === "RUNTIME_TO_REVIEW_V1_ONE_PROVIDER_ONE_IMAGE" &&
  packet.exact_confirmation_phrase === runner.exactConfirmation
);
check("budget_one_provider_one_image_no_retry", () =>
  packet.budget.max_provider_calls === 1 &&
  packet.budget.max_plugin_calls === 1 &&
  packet.budget.max_api_calls === 1 &&
  packet.budget.max_images === 1 &&
  packet.budget.max_live_probe_attempts === 1 &&
  packet.budget.retry_allowed === false
);
check("forbidden_now_all_false", () => Object.values(packet.forbidden_now).every((value) => value === false));
check("stop_conditions_include_allowlist_and_secret", () =>
  packet.stop_conditions.includes("current owner runtime still only allows neutral red apple prompt package") &&
  packet.stop_conditions.includes("secret value read required by Agent Image Lab")
);

process.stdout.write(`${JSON.stringify({
  passed,
  validator,
  packet: packetPath,
  fixture: fixturePath,
  target_prompt_package_ref: packet.target_prompt_package_ref,
  can_execute_now: packet.can_execute_now,
  owner_runtime_current_allowed_prompt_package_ref: ownerRuntime.allowedPromptPackageRef,
  serum_prompt_blocked_by_current_owner_runtime_allowlist: ownerRuntime.allowedPromptPackageRef !== packet.target_prompt_package_ref,
  current_delegate_default_output_directory: delegate.defaultOutputDirectory,
  requested_serum_output_directory: packet.output_directory_ref,
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  image_generation_performed: false,
  secret_value_read_performed: false,
  DailyNote_write_performed: false,
  VCP_memory_write_performed: false,
  accepted_samples_write_performed: false,
  production_candidate_write_performed: false,
  check_count: results.length,
  failed_count: results.filter((result) => !result.passed).length,
  results,
}, null, 2)}\n`);
if (!passed) process.exitCode = 1;
