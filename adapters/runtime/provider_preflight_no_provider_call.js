#!/usr/bin/env node
"use strict";

const path = require("node:path");

const repoRoot = path.resolve(__dirname, "../..");
const adapterId = "provider_preflight_no_provider_call_v0";
const packetSchema = "provider_preflight_no_provider_call.v0";
const defaultProviderCaseId = "neutral_smoke_test_red_apple_secretless_bridge";
const expectedProviderBindingRef = "native_doubao:capability:owner-runtime:v0_6_73";
const redactedProviderBindingRef = "native_doubao:capability:owner-runtime:<redacted>";

const preflightGuard = Object.freeze({
  preflight_only: true,
  can_execute_now: false,
  provider_contact_allowed_now: false,
  plugin_call_allowed_now: false,
  api_call_allowed_now: false,
  image_generation_allowed_now: false,
  secret_value_read_allowed: false,
  env_file_content_read_allowed: false,
  output_write_allowed_now: false,
  production_write_allowed_now: false,
  accepted_samples_write_allowed_now: false,
  DailyNote_write_allowed_now: false,
  VCP_memory_write_allowed_now: false,
  push_tag_release_deploy_allowed_now: false,
});

const sideEffectFlags = Object.freeze({
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  image_generation_performed: false,
  env_file_content_read_performed: false,
  secret_value_read_performed: false,
  output_write_performed: false,
  production_write_performed: false,
  accepted_samples_write_performed: false,
  DailyNote_write_performed: false,
  VCP_memory_write_performed: false,
  push_tag_release_deploy_performed: false,
});

function assertObject(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${label} must be an object`);
  }
}

function assertString(value, label) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${label} must be a non-empty string`);
  }
}

function normalizeRepoRelativePath(value, label) {
  assertString(value, label);
  if (path.isAbsolute(value) || /^[A-Za-z]:[\\/]/.test(value)) {
    throw new Error(`${label} must be a repository-relative path`);
  }
  const normalized = value.replace(/\\/g, "/");
  if (normalized.split("/").includes("..")) {
    throw new Error(`${label} must not contain traversal segments`);
  }
  const resolved = path.resolve(repoRoot, normalized);
  const relative = path.relative(repoRoot, resolved).replace(/\\/g, "/");
  if (relative.startsWith("../") || relative === ".." || path.isAbsolute(relative)) {
    throw new Error(`${label} escapes repository root`);
  }
  return relative;
}

function assertFalseFlags(flags, label) {
  for (const [field, value] of Object.entries(flags || {})) {
    if (value === true) {
      throw new Error(`${label}.${field} must be false`);
    }
  }
}

function loadProviderCase(caseId = defaultProviderCaseId) {
  const runner = require("../../scripts/run_native_doubao_image_generation");
  const registry = runner.loadRunnerCaseRegistry();
  if (!registry.loaded) {
    throw new Error("native provider runner case registry must be available");
  }
  const selected = registry.cases.find((item) => item.case_id === caseId);
  if (!selected) {
    throw new Error(`provider runner case not found: ${caseId}`);
  }
  return selected;
}

function buildRunnerOptions(providerCase, overrides = {}) {
  return {
    runner_case_id: providerCase.case_id,
    prompt_package_ref: providerCase.prompt_package_ref,
    plugin_profile_ref: providerCase.plugin_profile_ref,
    output_directory: providerCase.output_directory,
    model: providerCase.model,
    max_plugin_calls: providerCase.max_plugin_calls,
    max_images_created: providerCase.max_images_created,
    retry_allowed: providerCase.retry_allowed === true,
    dryRun: true,
    execution_authorized: false,
    provider_binding_ref: expectedProviderBindingRef,
    provider_binding_ref_redacted: true,
    provider_binding_ref_is_secret: false,
    secretless_runtime_required: true,
    ...overrides,
  };
}

function buildProviderPreflightPacket(options = {}) {
  const providerCase = options.provider_case || loadProviderCase(options.provider_case_id || defaultProviderCaseId);
  assertObject(providerCase, "provider_case");
  assertString(providerCase.case_id, "provider_case.case_id");
  assertString(providerCase.prompt_package_ref, "provider_case.prompt_package_ref");
  assertString(providerCase.plugin_profile_ref, "provider_case.plugin_profile_ref");
  assertString(providerCase.output_directory, "provider_case.output_directory");
  assertString(providerCase.model, "provider_case.model");

  const promptRef = normalizeRepoRelativePath(providerCase.prompt_package_ref, "provider_case.prompt_package_ref");
  const pluginProfileRef = normalizeRepoRelativePath(providerCase.plugin_profile_ref, "provider_case.plugin_profile_ref");
  const outputDirectoryRef = normalizeRepoRelativePath(providerCase.output_directory, "provider_case.output_directory");
  if (!outputDirectoryRef.startsWith("runs/real_generation/")) {
    throw new Error("provider_case.output_directory must stay under runs/real_generation/");
  }
  if (providerCase.max_plugin_calls !== 1) {
    throw new Error("provider_case.max_plugin_calls must be 1");
  }
  if (providerCase.max_images_created !== 1) {
    throw new Error("provider_case.max_images_created must be 1");
  }
  if (providerCase.retry_allowed === true) {
    throw new Error("provider_case.retry_allowed must be false");
  }
  if (providerCase.provider_contact_authorized === true) {
    throw new Error("provider_case.provider_contact_authorized must be false for no-provider-call preflight");
  }
  if (providerCase.secret_value_required_for_preflight === true) {
    throw new Error("provider_case.secret_value_required_for_preflight must be false");
  }

  const runner = require("../../scripts/run_native_doubao_image_generation");
  const runnerOptions = buildRunnerOptions(providerCase, options.runner_overrides || {});
  const runnerPreflight = runner.preflightCheck(runnerOptions);
  if (runnerPreflight.preflight_passed !== true) {
    throw new Error(`runner preflight must pass without provider call: ${runnerPreflight.issues.join("; ")}`);
  }
  if (runnerPreflight.secretless_binding_mode !== true) {
    throw new Error("runner preflight must use secretless binding mode");
  }
  if (runnerPreflight.env_file_content_read_performed !== false || runnerPreflight.secret_value_read_performed !== false) {
    throw new Error("runner preflight must not read env content or secret values");
  }

  const packet = {
    packet_schema: packetSchema,
    adapter_id: adapterId,
    phase: "provider_preflight_no_provider_call",
    lane: "Green",
    status: "provider_preflight_ready_no_provider_call",
    intent: "prepare future provider execution without contacting provider or reading secrets",
    can_execute_now: false,
    selected_provider: {
      provider_id: "NativeDoubaoImage",
      provider_case_id: providerCase.case_id,
      provider_binding_ref: redactedProviderBindingRef,
      provider_binding_ref_redacted: true,
      provider_binding_ref_is_secret: false,
      secretless_runtime_required: true,
    },
    target_systems: [
      "local_repository_fixture_only",
      "future_owner_authorized_provider_runtime",
    ],
    exact_allowed_paths_or_objects: [
      promptRef,
      pluginProfileRef,
      outputDirectoryRef,
      "configs/native_doubao_runner_cases.json",
      "scripts/run_native_doubao_image_generation.js",
      "scripts/native_doubao_secretless_provider_runtime_bridge.js",
      "adapters/image_generation/native_doubao_adapter.js",
      "plugins/image_generation/native_doubao_image/native_doubao_image.js",
    ],
    forbidden_paths_or_objects: [
      ".env",
      ".env.local",
      ".env.*.local",
      "configs/local_secrets/",
      "external repositories",
      "real VCPChat source",
      "real VCPToolBox source",
      "production candidate outputs",
      "accepted_samples",
    ],
    allowed_commands_or_operations: [
      "node scripts/validate_provider_preflight_no_provider_call.js",
      "node scripts/run_native_doubao_image_generation.js --case-id=neutral_smoke_test_red_apple_secretless_bridge --dry-run=true --secretless-runtime-required=true --provider-binding-ref=<redacted>",
    ],
    max_call_count: {
      provider_calls: 0,
      plugin_calls: 0,
      api_calls: 0,
      image_candidates: 0,
      runtime_probe_minutes: 0,
    },
    max_write_count: 0,
    max_cost_when_applicable: {
      amount: 0,
      currency: "not_applicable",
      cost_tracking_required: true,
      cost_unknown_is_red: true,
    },
    selected_plugin_id: "NativeDoubaoImage",
    command: "preflight_only_no_provider_call",
    model: providerCase.model,
    input_reference: promptRef,
    output_directory_or_write_target: outputDirectoryRef,
    rollback_or_cleanup_plan: "No provider, image, memory, or production output is created; rollback is deleting this local preflight packet and validator changes before commit.",
    validation_required: [
      "node scripts/validate_provider_preflight_no_provider_call.js",
      "npm run validate:provider-preflight",
    ],
    stop_conditions: [
      "provider contact becomes required",
      "secret value read becomes required",
      "output write becomes required",
      "cost is unknown or non-zero",
      "side-effect flag changes to true",
      "runner preflight fails",
      "user requests push/tag/release/deploy without explicit authorization packet",
    ],
    evidence_to_record: [
      "provider preflight packet",
      "runner preflight result",
      "side-effect flags",
      "negative case validation",
      "status surface receipt",
    ],
    runner_preflight: {
      preflight_passed: runnerPreflight.preflight_passed,
      secretless_binding_mode: true,
      provider_binding_ref: redactedProviderBindingRef,
      provider_binding_ref_redacted: true,
      provider_binding_ref_is_secret: false,
      env_fields_present: 0,
      env_file_exists: null,
      env_file_content_read_performed: false,
      secret_value_read_performed: false,
      issues: [],
    },
    guard: { ...preflightGuard },
    side_effect_flags: { ...sideEffectFlags },
  };

  validateProviderPreflightPacket(packet);
  return packet;
}

function validateProviderPreflightPacket(packet) {
  assertObject(packet, "packet");
  if (packet.packet_schema !== packetSchema) {
    throw new Error("packet_schema mismatch");
  }
  if (packet.adapter_id !== adapterId) {
    throw new Error("adapter_id mismatch");
  }
  if (packet.lane !== "Green") {
    throw new Error("provider preflight no-provider-call lane must be Green");
  }
  if (packet.can_execute_now !== false) {
    throw new Error("can_execute_now must be false");
  }
  assertObject(packet.selected_provider, "packet.selected_provider");
  if (packet.selected_provider.provider_binding_ref !== redactedProviderBindingRef) {
    throw new Error("provider binding ref must be redacted");
  }
  if (packet.selected_provider.provider_binding_ref_redacted !== true) {
    throw new Error("provider binding ref must be marked redacted");
  }
  if (packet.selected_provider.provider_binding_ref_is_secret !== false) {
    throw new Error("provider binding ref must be non-secret");
  }
  if (packet.selected_provider.secretless_runtime_required !== true) {
    throw new Error("secretless runtime must be required");
  }
  if (!Array.isArray(packet.exact_allowed_paths_or_objects) || packet.exact_allowed_paths_or_objects.length === 0) {
    throw new Error("exact allowed paths are required");
  }
  for (const item of packet.exact_allowed_paths_or_objects) {
    normalizeRepoRelativePath(item, "exact_allowed_paths_or_objects item");
  }
  if (!packet.output_directory_or_write_target.startsWith("runs/real_generation/")) {
    throw new Error("output target must be under runs/real_generation/");
  }
  if (packet.max_call_count.provider_calls !== 0 || packet.max_call_count.plugin_calls !== 0 || packet.max_call_count.api_calls !== 0) {
    throw new Error("provider/plugin/api call budgets must be 0");
  }
  if (packet.max_call_count.image_candidates !== 0 || packet.max_write_count !== 0) {
    throw new Error("image and write budgets must be 0");
  }
  if (packet.max_cost_when_applicable.amount !== 0 || packet.max_cost_when_applicable.cost_unknown_is_red !== true) {
    throw new Error("cost must be zero and unknown cost must be Red");
  }
  assertObject(packet.guard, "packet.guard");
  for (const [field, value] of Object.entries(preflightGuard)) {
    if (packet.guard[field] !== value) {
      throw new Error(`guard.${field} mismatch`);
    }
  }
  assertObject(packet.side_effect_flags, "packet.side_effect_flags");
  assertFalseFlags(packet.side_effect_flags, "packet.side_effect_flags");
  assertObject(packet.runner_preflight, "packet.runner_preflight");
  if (packet.runner_preflight.preflight_passed !== true || packet.runner_preflight.secretless_binding_mode !== true) {
    throw new Error("runner preflight must pass in secretless mode");
  }
  if (packet.runner_preflight.env_file_content_read_performed !== false || packet.runner_preflight.secret_value_read_performed !== false) {
    throw new Error("runner preflight must not read env content or secrets");
  }
  if (!Array.isArray(packet.stop_conditions) || packet.stop_conditions.length < 4) {
    throw new Error("stop_conditions must be explicit");
  }
  if (!Array.isArray(packet.validation_required) || !packet.validation_required.includes("npm run validate:provider-preflight")) {
    throw new Error("validation_required must include npm run validate:provider-preflight");
  }
  return true;
}

function main() {
  const packet = buildProviderPreflightPacket();
  console.log(JSON.stringify(packet, null, 2));
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(JSON.stringify({
      adapter_id: adapterId,
      passed: false,
      error: error.message,
      guard: { ...preflightGuard },
      side_effect_flags: { ...sideEffectFlags },
    }, null, 2));
    process.exitCode = 1;
  }
}

module.exports = {
  adapterId,
  packetSchema,
  defaultProviderCaseId,
  expectedProviderBindingRef,
  redactedProviderBindingRef,
  preflightGuard,
  sideEffectFlags,
  normalizeRepoRelativePath,
  loadProviderCase,
  buildRunnerOptions,
  buildProviderPreflightPacket,
  validateProviderPreflightPacket,
};
