#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..", "..");
const moduleId = "native_doubao_runtime_v1_per_packet_owner_runtime";
const factoryId = "per_packet_exact_binding_factory";
const packetSchema = "runtime_to_review_v1_guarded_live_probe_preflight_packet.v1";
const allowedPacketRef = "reports/runtime_to_review_v1/guarded_live_probe_serum_bottle_inactive_preflight_packet_20260601.json";
const allowedFixtureRef = "tests/fixtures/runtime_kernel_v1_real_guarded_serum_bottle_task.fixture.json";
const allowedPromptPackageRef = "prompts/image_generation/product_lifestyle_premium_serum_bottle_v1.yaml";
const allowedOutputDirectory = "runs/real_generation/runtime_to_review_v1_guarded_live_probe_serum_bottle/";
const requiredModel = "doubao-seedream-5-0-260128";
const expectedConfirmation = "RUNTIME_TO_REVIEW_V1_ONE_PROVIDER_ONE_IMAGE";

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function normalizeRepoRelativePath(value, label) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${label} must be a non-empty string`);
  }
  if (path.isAbsolute(value)) {
    throw new Error(`${label} must be repository-relative`);
  }
  const normalized = value.replace(/\\/g, "/");
  if (normalized.split("/").includes("..")) {
    throw new Error(`${label} must not contain traversal`);
  }
  const resolved = path.resolve(repoRoot, normalized);
  const relative = path.relative(repoRoot, resolved).replace(/\\/g, "/");
  if (relative.startsWith("../") || relative === ".." || path.isAbsolute(relative)) {
    throw new Error(`${label} escapes repository root`);
  }
  return { relative, resolved };
}

function isExactRepoPath(value, expected) {
  try {
    const relative = normalizeRepoRelativePath(value, "repo path").relative;
    if (expected.endsWith("/")) {
      return `${relative.replace(/\/+$/, "")}/` === expected;
    }
    return relative === expected;
  } catch {
    return false;
  }
}

function safeReadJson(relativePath) {
  const { relative, resolved } = normalizeRepoRelativePath(relativePath, "json ref");
  if (relative !== allowedPacketRef && relative !== allowedFixtureRef) {
    throw new Error("json ref is not in this module's exact allowlist");
  }
  return JSON.parse(fs.readFileSync(resolved, "utf8"));
}

function addIssue(issues, condition, issue) {
  if (!condition) issues.push(issue);
}

function validatePacketBinding(packet, options = {}) {
  const issues = [];
  const source = packet && typeof packet === "object" && !Array.isArray(packet) ? packet : {};
  const fixture = options.fixture && typeof options.fixture === "object" ? options.fixture : null;

  addIssue(issues, source.schema === packetSchema, "packet_schema_mismatch");
  addIssue(issues, source.packet_id === "runtime_to_review_v1_guarded_live_probe_serum_bottle_inactive_preflight_20260601", "packet_id_mismatch");
  addIssue(issues, source.can_execute_now === false, "packet_can_execute_now_must_be_false_for_local_factory");
  addIssue(issues, source.execution_authorized_by_this_packet === false, "packet_must_not_authorize_execution");
  addIssue(issues, source.exact_confirmation_phrase === expectedConfirmation, "confirmation_phrase_mismatch");
  addIssue(issues, isExactRepoPath(source.required_future_input_fixture, allowedFixtureRef), "fixture_ref_mismatch");
  addIssue(issues, isExactRepoPath(source.target_prompt_package_ref, allowedPromptPackageRef), "target_prompt_package_ref_mismatch");
  addIssue(issues, source.owner_runtime_current_allowed_prompt_package_ref === "prompts/image_generation/neutral_smoke_test_red_apple_v1.yaml", "current_owner_runtime_prompt_ref_mismatch");
  addIssue(issues, source.target_prompt_package_ref !== source.owner_runtime_current_allowed_prompt_package_ref, "packet_must_not_claim_current_apple_runtime_is_serum_ready");
  addIssue(issues, isExactRepoPath(source.output_directory_ref, allowedOutputDirectory), "output_directory_ref_mismatch");
  addIssue(issues, source.target_prompt_package_ref && source.target_prompt_package_ref.startsWith("prompts/image_generation/"), "prompt_ref_must_be_under_prompts_image_generation");
  addIssue(issues, source.output_directory_ref && source.output_directory_ref.startsWith("runs/real_generation/runtime_to_review_v1_guarded_live_probe_serum_bottle/"), "output_dir_must_be_serum_bottle_scope");
  addIssue(issues, source.budget && source.budget.max_provider_calls === 1, "max_provider_calls_must_be_1");
  addIssue(issues, source.budget && source.budget.max_plugin_calls === 1, "max_plugin_calls_must_be_1");
  addIssue(issues, source.budget && source.budget.max_api_calls === 1, "max_api_calls_must_be_1");
  addIssue(issues, source.budget && source.budget.max_images === 1, "max_images_must_be_1");
  addIssue(issues, source.budget && source.budget.retry_allowed === false, "retry_must_be_false");

  if (fixture) {
    addIssue(issues, fixture.prompt_package_ref === allowedPromptPackageRef, "fixture_prompt_package_ref_mismatch");
    addIssue(issues, fixture.model_required === requiredModel, "fixture_model_required_mismatch");
    addIssue(issues, fixture.max_images === 1, "fixture_max_images_must_be_1");
    addIssue(issues, fixture.output_scope === "run_directory_only", "fixture_output_scope_mismatch");
    addIssue(issues, fixture.secret_value_read_allowed === false, "fixture_secret_value_read_allowed_must_be_false");
  }

  return {
    passed: issues.length === 0,
    issues,
    binding: issues.length === 0
      ? Object.freeze({
        packet_ref: options.packetRef || allowedPacketRef,
        fixture_ref: allowedFixtureRef,
        prompt_package_ref: allowedPromptPackageRef,
        output_directory_ref: allowedOutputDirectory,
        model_required: requiredModel,
        can_execute_now: false,
        execution_authorized_by_this_packet: false,
      })
      : null,
  };
}

function loadAndValidatePacketBinding(options = {}) {
  const packetRef = options.packetRef || allowedPacketRef;
  const packetPath = normalizeRepoRelativePath(packetRef, "packet ref");
  if (packetPath.relative !== allowedPacketRef) {
    return {
      passed: false,
      issues: ["packet_ref_not_exactly_allowed"],
      binding: null,
    };
  }
  const packet = options.packet || safeReadJson(packetPath.relative);
  const fixture = options.fixture || safeReadJson(allowedFixtureRef);
  return validatePacketBinding(packet, {
    fixture,
    packetRef: packetPath.relative,
  });
}

function failClosed(blocker, details = {}) {
  return {
    module_id: moduleId,
    factory_id: factoryId,
    status: "BLOCKED_PER_PACKET_OWNER_RUNTIME_FAILED_CLOSED",
    blocker,
    request_validation_passed: details.request_validation_passed === true,
    request_validation_issues: Array.isArray(details.request_validation_issues) ? [...details.request_validation_issues] : [],
    packet_binding_passed: details.packet_binding_passed === true,
    packet_binding_issues: Array.isArray(details.packet_binding_issues) ? [...details.packet_binding_issues] : [],
    prompt_package_ref: details.prompt_package_ref || allowedPromptPackageRef,
    output_directory_ref: details.output_directory_ref || allowedOutputDirectory,
    model_sent: details.model_sent || requiredModel,
    calls_used: { provider: 0, plugin: 0, api: 0 },
    image_count: 0,
    output_files: [],
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    image_binary_read_performed: false,
    output_write_performed: false,
    forbidden_disk_write_performed: false,
    production_write_performed: false,
    accepted_samples_write_performed: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false,
    secret_value_read_performed: false,
    env_file_content_read_performed: false,
    raw_prompt_payload_included: false,
    raw_provider_payload_returned: false,
    provider_url_returned: false,
    human_review_required_now: false,
    sanitized_result_metadata_only: true,
  };
}

function validateRuntimeRequestAgainstBinding(request, binding) {
  const issues = [];
  const source = request && typeof request === "object" && !Array.isArray(request) ? request : {};
  const model = source.model || source.model_required || source.model_requested || null;
  addIssue(issues, source.prompt_package_ref === binding.prompt_package_ref, "request_prompt_package_ref_mismatch");
  addIssue(issues, model === binding.model_required, "request_model_mismatch");
  addIssue(issues, source.max_images === 1 || source.max_images_created === 1, "request_max_images_must_be_1");
  addIssue(issues, source.output_scope === undefined || source.output_scope === "run_directory_only", "request_output_scope_mismatch");
  addIssue(issues, source.output_directory_ref === binding.output_directory_ref || source.output_directory === binding.output_directory_ref, "request_output_directory_mismatch");
  addIssue(issues, source.secret_value_read_allowed !== true, "request_secret_value_read_allowed_must_not_be_true");
  addIssue(issues, source.raw_prompt_payload === undefined && source.prompt === undefined && source.positive_prompt === undefined, "request_must_not_include_raw_prompt_text");
  addIssue(issues, source.retry_allowed !== true, "request_retry_must_not_be_true");
  return {
    passed: issues.length === 0,
    issues,
  };
}

function createFailedClosedRuntime(bindingValidation) {
  const runtime = async function perPacketExactBindingFailedClosedRuntime(request) {
    if (!bindingValidation || bindingValidation.passed !== true || !bindingValidation.binding) {
      return failClosed("per_packet_exact_binding_packet_missing_or_invalid", {
        packet_binding_passed: false,
        packet_binding_issues: bindingValidation && Array.isArray(bindingValidation.issues)
          ? bindingValidation.issues
          : ["packet_binding_not_loaded"],
      });
    }
    const requestValidation = validateRuntimeRequestAgainstBinding(request, bindingValidation.binding);
    if (!requestValidation.passed) {
      return failClosed("per_packet_owner_runtime_request_invalid", {
        request_validation_passed: false,
        request_validation_issues: requestValidation.issues,
        packet_binding_passed: true,
        prompt_package_ref: request && request.prompt_package_ref,
        output_directory_ref: request && (request.output_directory_ref || request.output_directory),
        model_sent: request && (request.model || request.model_required || request.model_requested),
      });
    }
    return failClosed("per_packet_owner_runtime_live_execution_not_enabled", {
      request_validation_passed: true,
      packet_binding_passed: true,
      prompt_package_ref: bindingValidation.binding.prompt_package_ref,
      output_directory_ref: bindingValidation.binding.output_directory_ref,
      model_sent: bindingValidation.binding.model_required,
    });
  };
  Object.defineProperties(runtime, {
    per_packet_exact_binding_factory_id: { value: factoryId },
    per_packet_owner_runtime_module_id: { value: moduleId },
    per_packet_owner_runtime_failed_closed: { value: true },
    per_packet_owner_runtime_delegate_bound: { value: false },
    per_packet_binding_loaded: { value: bindingValidation && bindingValidation.passed === true },
    per_packet_prompt_package_ref: { value: bindingValidation && bindingValidation.binding ? bindingValidation.binding.prompt_package_ref : null },
    per_packet_output_directory_ref: { value: bindingValidation && bindingValidation.binding ? bindingValidation.binding.output_directory_ref : null },
  });
  return runtime;
}

function per_packet_exact_binding_factory(options = {}) {
  let bindingValidation;
  if (!options || Object.keys(options).length === 0) {
    bindingValidation = {
      passed: false,
      issues: ["packet_ref_required_for_exact_binding_factory"],
      binding: null,
    };
  } else {
    bindingValidation = loadAndValidatePacketBinding(options);
  }
  return {
    module_id: moduleId,
    factory_id: factoryId,
    status: bindingValidation.passed ? "prepared_failed_closed_runtime" : "failed_closed_packet_binding_invalid",
    can_execute_now: false,
    live_execution_enabled: false,
    packet_binding_validation: {
      passed: bindingValidation.passed,
      issues: [...bindingValidation.issues],
      binding: bindingValidation.binding ? clone(bindingValidation.binding) : null,
    },
    createSecretlessProviderRuntime() {
      return createFailedClosedRuntime(bindingValidation);
    },
  };
}

function createSecretlessProviderRuntime(options = {}) {
  return per_packet_exact_binding_factory(options).createSecretlessProviderRuntime();
}

function inspectPerPacketOwnerRuntimeReadiness(options = {}) {
  const bindingValidation = options.skipPacketRead === true
    ? { passed: false, issues: ["packet_read_skipped"], binding: null }
    : loadAndValidatePacketBinding(options);
  return {
    module_id: moduleId,
    factory_id: factoryId,
    packet_ref_allowed: allowedPacketRef,
    packet_binding_passed: bindingValidation.passed,
    packet_binding_issues: [...bindingValidation.issues],
    prompt_package_allowed: allowedPromptPackageRef,
    output_directory_allowed: allowedOutputDirectory,
    model_required: requiredModel,
    can_execute_now: false,
    live_execution_enabled: false,
    default_failed_closed: true,
    env_file_content_read_performed: false,
    secret_value_read_performed: false,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    output_write_performed: false,
  };
}

module.exports = createSecretlessProviderRuntime;
module.exports.moduleId = moduleId;
module.exports.factoryId = factoryId;
module.exports.packetSchema = packetSchema;
module.exports.allowedPacketRef = allowedPacketRef;
module.exports.allowedFixtureRef = allowedFixtureRef;
module.exports.allowedPromptPackageRef = allowedPromptPackageRef;
module.exports.allowedOutputDirectory = allowedOutputDirectory;
module.exports.requiredModel = requiredModel;
module.exports.expectedConfirmation = expectedConfirmation;
module.exports.per_packet_exact_binding_factory = per_packet_exact_binding_factory;
module.exports.createSecretlessProviderRuntime = createSecretlessProviderRuntime;
module.exports.inspectPerPacketOwnerRuntimeReadiness = inspectPerPacketOwnerRuntimeReadiness;
module.exports.loadAndValidatePacketBinding = loadAndValidatePacketBinding;
module.exports.validatePacketBinding = validatePacketBinding;
module.exports.validateRuntimeRequestAgainstBinding = validateRuntimeRequestAgainstBinding;
module.exports.env_file_content_read_performed = false;
module.exports.secret_value_read_performed = false;
module.exports.provider_contact_performed = false;
module.exports.plugin_call_performed = false;
module.exports.api_call_performed = false;
module.exports.image_generation_performed = false;
