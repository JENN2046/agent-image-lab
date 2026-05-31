#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const adapterPath = "adapters/runtime/provider_preflight_no_provider_call.js";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function repoPath(relativePath) {
  const resolved = path.resolve(root, relativePath);
  const relative = path.relative(root, resolved);
  assert(!relative.startsWith("..") && !path.isAbsolute(relative), `Path escapes repository: ${relativePath}`);
  return resolved;
}

function runNode(args) {
  return execFileSync(process.execPath, args, {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    timeout: 30000,
  });
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function assertFalse(value, label) {
  assert(value === false, `${label} must be false`);
}

function assertPacket(packet, label) {
  assert(packet.packet_schema === "provider_preflight_no_provider_call.v0", `${label} packet schema mismatch`);
  assert(packet.adapter_id === "provider_preflight_no_provider_call_v0", `${label} adapter id mismatch`);
  assert(packet.phase === "provider_preflight_no_provider_call", `${label} phase mismatch`);
  assert(packet.lane === "Green", `${label} lane mismatch`);
  assert(packet.can_execute_now === false, `${label} can_execute_now must be false`);
  assert(packet.selected_provider.provider_id === "NativeDoubaoImage", `${label} provider id mismatch`);
  assert(packet.selected_provider.provider_binding_ref === "native_doubao:capability:owner-runtime:<redacted>", `${label} binding ref must be redacted`);
  assert(packet.selected_provider.provider_binding_ref_redacted === true, `${label} binding ref redacted must be true`);
  assert(packet.selected_provider.provider_binding_ref_is_secret === false, `${label} binding ref secret must be false`);
  assert(packet.selected_provider.secretless_runtime_required === true, `${label} secretless runtime required mismatch`);
  assert(packet.output_directory_or_write_target.startsWith("runs/real_generation/"), `${label} output target root mismatch`);
  assert(packet.max_call_count.provider_calls === 0, `${label} provider call budget must be 0`);
  assert(packet.max_call_count.plugin_calls === 0, `${label} plugin call budget must be 0`);
  assert(packet.max_call_count.api_calls === 0, `${label} api call budget must be 0`);
  assert(packet.max_call_count.image_candidates === 0, `${label} image candidate budget must be 0`);
  assert(packet.max_write_count === 0, `${label} max write count must be 0`);
  assert(packet.max_cost_when_applicable.amount === 0, `${label} cost must be 0`);
  assert(packet.max_cost_when_applicable.cost_unknown_is_red === true, `${label} unknown cost must be Red`);
  assert(packet.runner_preflight.preflight_passed === true, `${label} runner preflight must pass`);
  assert(packet.runner_preflight.secretless_binding_mode === true, `${label} secretless mode must be true`);
  assert(packet.runner_preflight.env_file_exists === null, `${label} env file must not be inspected in secretless mode`);
  assert(packet.runner_preflight.env_fields_present === 0, `${label} env field count must be 0 in secretless mode`);
  assert(packet.runner_preflight.env_file_content_read_performed === false, `${label} env content read must be false`);
  assert(packet.runner_preflight.secret_value_read_performed === false, `${label} secret read must be false`);

  [
    "provider_contact_allowed_now",
    "plugin_call_allowed_now",
    "api_call_allowed_now",
    "image_generation_allowed_now",
    "secret_value_read_allowed",
    "env_file_content_read_allowed",
    "output_write_allowed_now",
    "production_write_allowed_now",
    "accepted_samples_write_allowed_now",
    "DailyNote_write_allowed_now",
    "VCP_memory_write_allowed_now",
    "push_tag_release_deploy_allowed_now",
  ].forEach((field) => assertFalse(packet.guard[field], `${label}.guard.${field}`));

  for (const [field, value] of Object.entries(packet.side_effect_flags)) {
    assertFalse(value, `${label}.side_effect_flags.${field}`);
  }
}

function expectFailure(caseId, fn) {
  try {
    fn();
  } catch (_error) {
    return { case_id: caseId, result: "caught" };
  }
  throw new Error(`${caseId} was not caught`);
}

function main() {
  const skipAdapterCli = process.argv.includes("--skip-adapter-cli");
  assert(fs.existsSync(repoPath(adapterPath)), "provider preflight adapter missing");
  runNode(["--check", adapterPath]);

  const adapter = require(repoPath(adapterPath));
  assert(typeof adapter.buildProviderPreflightPacket === "function", "buildProviderPreflightPacket export missing");
  assert(typeof adapter.validateProviderPreflightPacket === "function", "validateProviderPreflightPacket export missing");

  const packet = adapter.buildProviderPreflightPacket();
  assertPacket(packet, "direct");
  assert(adapter.validateProviderPreflightPacket(packet) === true, "direct packet should validate");

  if (!skipAdapterCli) {
    const cliPacket = JSON.parse(runNode([adapterPath]));
    assertPacket(cliPacket, "cli");
  }

  const negativeCases = [
    expectFailure("can_execute_now_true_rejected", () => {
      const dirty = clone(packet);
      dirty.can_execute_now = true;
      adapter.validateProviderPreflightPacket(dirty);
    }),
    expectFailure("provider_call_budget_rejected", () => {
      const dirty = clone(packet);
      dirty.max_call_count.provider_calls = 1;
      adapter.validateProviderPreflightPacket(dirty);
    }),
    expectFailure("secret_read_allowed_rejected", () => {
      const dirty = clone(packet);
      dirty.guard.secret_value_read_allowed = true;
      adapter.validateProviderPreflightPacket(dirty);
    }),
    expectFailure("side_effect_flag_true_rejected", () => {
      const dirty = clone(packet);
      dirty.side_effect_flags.provider_contact_performed = true;
      adapter.validateProviderPreflightPacket(dirty);
    }),
    expectFailure("unredacted_binding_rejected", () => {
      const dirty = clone(packet);
      dirty.selected_provider.provider_binding_ref = adapter.expectedProviderBindingRef;
      adapter.validateProviderPreflightPacket(dirty);
    }),
    expectFailure("unsafe_output_target_rejected", () => {
      const dirty = clone(packet);
      dirty.output_directory_or_write_target = "tmp/provider-output";
      adapter.validateProviderPreflightPacket(dirty);
    }),
    expectFailure("runner_secretless_mode_false_rejected", () => {
      const dirty = clone(packet);
      dirty.runner_preflight.secretless_binding_mode = false;
      adapter.validateProviderPreflightPacket(dirty);
    }),
    expectFailure("env_content_read_rejected", () => {
      const dirty = clone(packet);
      dirty.runner_preflight.env_file_content_read_performed = true;
      adapter.validateProviderPreflightPacket(dirty);
    }),
  ];

  console.log(JSON.stringify({
    passed: true,
    validator: "validate_provider_preflight_no_provider_call",
    adapter_id: packet.adapter_id,
    packet_schema: packet.packet_schema,
    provider_id: packet.selected_provider.provider_id,
    provider_case_id: packet.selected_provider.provider_case_id,
    can_execute_now: false,
    provider_binding_ref_redacted: true,
    provider_binding_ref_is_secret: false,
    secretless_runtime_required: true,
    provider_calls_budget: packet.max_call_count.provider_calls,
    plugin_calls_budget: packet.max_call_count.plugin_calls,
    api_calls_budget: packet.max_call_count.api_calls,
    image_candidates_budget: packet.max_call_count.image_candidates,
    max_write_count: packet.max_write_count,
    cost_amount: packet.max_cost_when_applicable.amount,
    runner_preflight_passed: packet.runner_preflight.preflight_passed,
    runner_secretless_binding_mode: packet.runner_preflight.secretless_binding_mode,
    negative_case_count: negativeCases.length,
    caught_negative_case_count: negativeCases.filter((item) => item.result === "caught").length,
    all_negative_cases_caught: negativeCases.every((item) => item.result === "caught"),
    adapter_cli_skipped: skipAdapterCli,
    adapter_cli_deferred_to_full_validator: skipAdapterCli,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    env_file_content_read_performed: false,
    secret_value_read_performed: false,
    output_write_performed: false,
    production_write_performed: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false,
  }, null, 2));
}

try {
  main();
} catch (error) {
  console.error(JSON.stringify({
    passed: false,
    validator: "validate_provider_preflight_no_provider_call",
    error: error.message,
  }, null, 2));
  process.exitCode = 1;
}
