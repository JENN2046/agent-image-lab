#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const validator = "runtime_to_review_v1_serum_bottle_owner_runtime_binding_design_preflight";
const preflightPath = "reports/runtime_to_review_v1/serum_bottle_owner_runtime_binding_design_preflight_20260601.json";
const inactivePacketPath = "reports/runtime_to_review_v1/guarded_live_probe_serum_bottle_inactive_preflight_packet_20260601.json";
const fixturePath = "tests/fixtures/runtime_kernel_v1_real_guarded_serum_bottle_task.fixture.json";
const promptPath = "prompts/image_generation/product_lifestyle_premium_serum_bottle_v1.yaml";
const currentOwnerRuntimePath = "adapters/runtime/native_doubao_runtime_v1_real_bound_owner_runtime.js";

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

const preflight = readJson(preflightPath);
const inactivePacket = readJson(inactivePacketPath);
const fixture = readJson(fixturePath);
const currentOwnerRuntime = require(repoPath(currentOwnerRuntimePath));

check("preflight_exists", () => fs.existsSync(repoPath(preflightPath)));
check("inactive_packet_exists", () => fs.existsSync(repoPath(inactivePacketPath)));
check("fixture_exists", () => fs.existsSync(repoPath(fixturePath)));
check("prompt_exists", () => fs.existsSync(repoPath(promptPath)));
check("current_owner_runtime_exists", () => fs.existsSync(repoPath(currentOwnerRuntimePath)));
check("schema", () => preflight.schema === "runtime_to_review_v1_owner_runtime_binding_design_preflight.v1");
check("design_only_inactive", () =>
  preflight.status === "prepared_design_only_not_executed" &&
  preflight.can_execute_now === false &&
  preflight.implementation_authorized_by_this_preflight === false &&
  preflight.live_probe_authorized_by_this_preflight === false
);
check("target_refs_align", () =>
  preflight.target_prompt_package_ref === promptPath &&
  preflight.target_runtime_task_fixture_ref === fixturePath &&
  preflight.target_inactive_preflight_packet_ref === inactivePacketPath &&
  inactivePacket.target_prompt_package_ref === promptPath &&
  fixture.prompt_package_ref === promptPath
);
check("current_runtime_stays_apple_bound", () =>
  currentOwnerRuntime.allowedPromptPackageRef === preflight.current_owner_runtime_allowed_prompt_package_ref &&
  currentOwnerRuntime.allowedPromptPackageRef === "prompts/image_generation/neutral_smoke_test_red_apple_v1.yaml" &&
  currentOwnerRuntime.allowedOutputDirectory === preflight.current_owner_runtime_allowed_output_directory
);
check("target_output_is_serum_specific", () =>
  preflight.target_allowed_output_directory === "runs/real_generation/runtime_to_review_v1_guarded_live_probe_serum_bottle/" &&
  inactivePacket.output_directory_ref === preflight.target_allowed_output_directory &&
  preflight.target_allowed_output_directory !== preflight.current_owner_runtime_allowed_output_directory
);
check("two_design_options_recorded", () =>
  Array.isArray(preflight.design_options) &&
  preflight.design_options.length === 2 &&
  preflight.design_options.some((option) => option.option_id === "dedicated_serum_owner_runtime_module") &&
  preflight.design_options.some((option) => option.option_id === "per_packet_exact_binding_factory")
);
check("recommended_design_is_per_packet_and_not_implemented", () =>
  preflight.recommended_design.option_id === "per_packet_exact_binding_factory" &&
  preflight.recommended_design.implementation_status === "not_started" &&
  preflight.recommended_design.implementation_allowed_now === false
);
check("per_packet_design_has_default_closed_guards", () => {
  const perPacket = preflight.design_options.find((option) => option.option_id === "per_packet_exact_binding_factory");
  return perPacket.must_hold.includes("default no-argument behavior must stay failed-closed") &&
    perPacket.must_hold.includes("binding must not accept raw prompt text from CLI arguments") &&
    perPacket.must_hold.includes("binding must reject traversal, absolute paths, unknown prompt refs, and output dirs outside the exact packet");
});
check("future_write_allowlist_is_exact", () =>
  Array.isArray(preflight.recommended_design.future_exact_write_allowlist) &&
  preflight.recommended_design.future_exact_write_allowlist.length === 4 &&
  preflight.recommended_design.future_exact_write_allowlist.includes("adapters/runtime/native_doubao_runtime_v1_per_packet_owner_runtime.js") &&
  preflight.recommended_design.future_exact_write_allowlist.includes("scripts/validate_runtime_to_review_v1_per_packet_owner_runtime_module.js")
);
check("non_execution_boundary_all_false", () =>
  Object.values(preflight.non_execution_boundary).every((value) => value === false)
);
check("stop_conditions_preserve_red_lanes", () =>
  preflight.stop_conditions.includes("secret value read or env file content read is required by Agent Image Lab") &&
  preflight.stop_conditions.includes("provider contact, plugin call, API call, or image generation is requested during design preflight") &&
  preflight.stop_conditions.includes("memory, accepted_samples, production candidate, tag, release, deploy, push, force push, or history rewrite is required")
);

process.stdout.write(`${JSON.stringify({
  passed,
  validator,
  preflight: preflightPath,
  recommended_design: preflight.recommended_design.option_id,
  can_execute_now: preflight.can_execute_now,
  implementation_allowed_now: preflight.recommended_design.implementation_allowed_now,
  current_owner_runtime_allowed_prompt_package_ref: currentOwnerRuntime.allowedPromptPackageRef,
  target_prompt_package_ref: preflight.target_prompt_package_ref,
  target_allowed_output_directory: preflight.target_allowed_output_directory,
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
