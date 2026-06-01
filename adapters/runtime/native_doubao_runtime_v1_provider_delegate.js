#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const sharp = require("sharp");

const nativeRunner = require("../../scripts/run_native_doubao_image_generation.js");
const secretlessBridge = require("../../scripts/native_doubao_secretless_provider_runtime_bridge.js");

const repoRoot = path.resolve(__dirname, "..", "..");
const delegateId = "native_doubao_runtime_v1_provider_delegate";
const exactConfirmation = "RUNTIME_TO_REVIEW_V1_ONE_PROVIDER_ONE_IMAGE";
const defaultOutputDirectory = "runs/real_generation/runtime_to_review_v1_guarded_live_probe/";
const modelRequired = "doubao-seedream-5-0-260128";
const allowedOutputDirectoryRoot = "runs/real_generation/";

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function repoRelativePath(value, label) {
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

function validateRuntimeV1DelegateRequest(request) {
  const issues = [];
  const source = request && typeof request === "object" ? request : {};
  if (source.schema !== "runtime_v1_provider_delegate_request.v1") issues.push("schema_mismatch");
  if (source.provider_route !== "native_doubao_guarded") issues.push("provider_route_must_be_native_doubao_guarded");
  if (source.provider_mode !== "real_guarded") issues.push("provider_mode_must_be_real_guarded");
  if (source.model_required !== modelRequired) issues.push("model_required_mismatch");
  if (source.max_images !== 1) issues.push("max_images_must_be_1");
  if (source.output_scope !== "run_directory_only") issues.push("output_scope_must_be_run_directory_only");
  if (source.secret_value_read_allowed === true) issues.push("secret_value_read_allowed_must_be_false");
  if (source.raw_provider_payload_allowed === true) issues.push("raw_provider_payload_allowed_must_be_false");
  if (source.production_write_allowed === true) issues.push("production_write_allowed_must_be_false");
  if (source.memory_write_allowed === true) issues.push("memory_write_allowed_must_be_false");
  if (typeof source.prompt_package_ref !== "string" || source.prompt_package_ref.trim() === "") {
    issues.push("prompt_package_ref_required");
  }
  if (source.output_directory_ref != null) {
    try {
      const normalizedOutputDirectoryRef = String(source.output_directory_ref).replace(/\\/g, "/");
      const { relative } = repoRelativePath(source.output_directory_ref, "output_directory_ref");
      if (!relative.startsWith(allowedOutputDirectoryRoot)) {
        issues.push("output_directory_ref_must_be_under_runs_real_generation");
      }
      if (!normalizedOutputDirectoryRef.endsWith("/")) {
        issues.push("output_directory_ref_must_end_with_slash");
      }
    } catch (error) {
      issues.push(error.message);
    }
  }
  return {
    passed: issues.length === 0,
    issues,
  };
}

function failClosed(reason, issues = [], observed = {}) {
  return {
    status: "failed_closed",
    delegate_id: delegateId,
    reason,
    issues,
    calls_used: observed.calls_used || { provider: 0, plugin: 0, api: 0 },
    image_count: 0,
    output_files: [],
    provider_contact_performed: observed.provider_contact_performed === true,
    plugin_call_performed: observed.plugin_call_performed === true,
    api_call_performed: observed.api_call_performed === true,
    image_generation_performed: observed.image_generation_performed === true,
    secret_value_read_performed: false,
    env_file_content_read_performed: false,
    production_write_performed: false,
    accepted_samples_write_performed: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false,
  };
}

function mimeFromFormat(format) {
  if (format === "jpeg" || format === "jpg") return "image/jpeg";
  if (format === "png") return "image/png";
  if (format === "webp") return "image/webp";
  return null;
}

function extensionFromFormat(format) {
  if (format === "jpeg" || format === "jpg") return ".jpg";
  if (format === "png") return ".png";
  if (format === "webp") return ".webp";
  return null;
}

function outputRefWithObservedExtension(relativePath, format) {
  const extension = extensionFromFormat(format);
  if (!extension) return relativePath;
  const parsed = path.posix.parse(relativePath.replace(/\\/g, "/"));
  if (parsed.ext.toLowerCase() === extension) return relativePath;
  return path.posix.join(parsed.dir, `${parsed.name}${extension}`);
}

function magicNumber(buffer) {
  return buffer.slice(0, Math.min(buffer.length, 12)).toString("hex");
}

async function inspectOutputFile(relativePath) {
  const { relative, resolved } = repoRelativePath(relativePath, "output file path");
  let buffer = fs.readFileSync(resolved);
  const metadata = await sharp(buffer).metadata();
  const normalizedRelative = outputRefWithObservedExtension(relative, metadata.format);
  if (normalizedRelative !== relative) {
    const normalized = repoRelativePath(normalizedRelative, "normalized output file path");
    if (fs.existsSync(normalized.resolved)) {
      throw new Error("normalized_output_file_already_exists");
    }
    fs.renameSync(resolved, normalized.resolved);
    buffer = fs.readFileSync(normalized.resolved);
    return {
      path: normalized.relative,
      bytes: buffer.length,
      sha256: crypto.createHash("sha256").update(buffer).digest("hex"),
      mime_type: mimeFromFormat(metadata.format),
      dimensions: `${metadata.width}x${metadata.height}`,
      magic_number: magicNumber(buffer),
      extension_normalized_from: relative,
    };
  }
  const format = metadata.format || null;
  return {
    path: relative,
    bytes: buffer.length,
    sha256: crypto.createHash("sha256").update(buffer).digest("hex"),
    mime_type: mimeFromFormat(format),
    dimensions: `${metadata.width}x${metadata.height}`,
    magic_number: magicNumber(buffer),
  };
}

async function normalizeOutputFile(item, outputDirectory) {
  if (typeof item === "string") {
    return inspectOutputFile(path.posix.join(outputDirectory.replace(/\/?$/, "/"), item));
  }
  if (!item || typeof item !== "object") {
    throw new Error("output file entry must be a string or object");
  }

  const rawPath = item.path || item.file;
  const relativePath = rawPath && String(rawPath).includes("/")
    ? rawPath
    : path.posix.join(outputDirectory.replace(/\/?$/, "/"), String(rawPath || ""));
  const hasMetadata = item.sha256 && item.mime_type && item.dimensions;
  if (hasMetadata) {
    const { relative } = repoRelativePath(relativePath, "output file path");
    return {
      path: relative,
      bytes: Number(item.bytes || 0),
      sha256: String(item.sha256),
      mime_type: String(item.mime_type),
      dimensions: String(item.dimensions),
      magic_number: item.magic_number ? String(item.magic_number) : null,
    };
  }
  return inspectOutputFile(relativePath);
}

function candidateOutputFiles(runnerResult) {
  if (Array.isArray(runnerResult.output_files)) return runnerResult.output_files;
  if (runnerResult.adapter_result && Array.isArray(runnerResult.adapter_result.output_files)) {
    return runnerResult.adapter_result.output_files;
  }
  if (runnerResult.runtime_bridge_result && Array.isArray(runnerResult.runtime_bridge_result.output_files)) {
    return runnerResult.runtime_bridge_result.output_files;
  }
  return [];
}

function candidateModelSent(runnerResult, request) {
  return runnerResult.model_sent ||
    runnerResult.model_reported ||
    runnerResult.model_requested ||
    (runnerResult.adapter_result && (runnerResult.adapter_result.model_reported || runnerResult.adapter_result.model_requested)) ||
    (runnerResult.runtime_bridge_result && runnerResult.runtime_bridge_result.model_sent) ||
    request.model_required;
}

function runnerCallsUsed(runnerResult) {
  if (runnerResult.calls_used && typeof runnerResult.calls_used === "object") {
    return {
      provider: Number(runnerResult.calls_used.provider || 0),
      plugin: Number(runnerResult.calls_used.plugin || 0),
      api: Number(runnerResult.calls_used.api || 0),
    };
  }
  const completed = runnerResult.status === "COMPLETED_PROVIDER_IMAGE_CREATED" ||
    runnerResult.status === "completed_provider_image_created";
  return {
    provider: completed ? 1 : 0,
    plugin: completed ? 1 : 0,
    api: completed ? 1 : 0,
  };
}

function buildRunnerOptions(request, options) {
  const outputDirectory = options.outputDirectory || request.output_directory_ref || defaultOutputDirectory;
  return {
    prompt_package_ref: request.prompt_package_ref,
    plugin_profile_ref: "plugins/image_generation/native_doubao_image/plugin.profile.yaml",
    output_directory: outputDirectory,
    model: request.model_required,
    max_plugin_calls: 1,
    max_images_created: 1,
    retry_allowed: false,
    dryRun: false,
    execution_authorized: true,
    a5_activation_ref: "runtime_to_review_v1_guarded_live_probe_exact_confirmation",
    provider_binding_ref: nativeRunner.SECRETLESS_PROVIDER_BINDING_REF,
    provider_binding_ref_redacted: true,
    provider_binding_ref_is_secret: false,
    secretless_runtime_required: true,
    secretless_provider_runtime: options.secretlessProviderRuntime || secretlessBridge.createUnboundSecretlessProviderRuntimeBridge(),
    secretless_delegate_authorization_ref: secretlessBridge.EXPECTED_DELEGATE_AUTHORIZATION_REF,
    secretless_delegate_authorization_status: secretlessBridge.EXPECTED_DELEGATE_AUTHORIZATION_STATUS,
    secretless_delegate_authorization_active: true,
    secretless_delegate_authorization_can_execute_now: true,
  };
}

function createNativeDoubaoRuntimeV1ProviderDelegate(options = {}) {
  const runNative = options.nativeRunner || nativeRunner.run;
  return async function nativeDoubaoRuntimeV1ProviderDelegate(request) {
    const validation = validateRuntimeV1DelegateRequest(request);
    if (!validation.passed) {
      return failClosed("runtime_v1_provider_delegate_request_invalid", validation.issues);
    }

    const runnerOptions = buildRunnerOptions(request, options);
    const runnerResult = await runNative(runnerOptions);
    const success = runnerResult.status === "COMPLETED_PROVIDER_IMAGE_CREATED" ||
      runnerResult.status === "completed_provider_image_created";
    if (!success) {
      const failureIssues = [runnerResult.status || "unknown_runner_status"];
      if (runnerResult.runtime_bridge_result && runnerResult.runtime_bridge_result.blocker) {
        failureIssues.push(`runtime_bridge_blocker:${runnerResult.runtime_bridge_result.blocker}`);
      }
      return failClosed("native_doubao_runner_failed_closed", failureIssues, {
        calls_used: runnerCallsUsed(runnerResult),
        provider_contact_performed: runnerResult.provider_contact_performed === true,
        plugin_call_performed: runnerResult.plugin_call_performed === true,
        api_call_performed: runnerResult.api_call_performed === true,
        image_generation_performed: runnerResult.image_generation_performed === true,
      });
    }

    const outputFiles = await Promise.all(
      candidateOutputFiles(runnerResult).map((item) => normalizeOutputFile(item, runnerOptions.output_directory))
    );
    if (outputFiles.length !== 1) {
      return failClosed("native_doubao_runner_output_file_count_invalid", [`output_file_count:${outputFiles.length}`], {
        calls_used: runnerCallsUsed(runnerResult),
        provider_contact_performed: runnerResult.provider_contact_performed === true,
        plugin_call_performed: runnerResult.plugin_call_performed === true,
        api_call_performed: runnerResult.api_call_performed === true,
        image_generation_performed: runnerResult.image_generation_performed === true,
      });
    }

    return {
      status: "completed_provider_image_created",
      delegate_id: delegateId,
      model_sent: candidateModelSent(runnerResult, request),
      calls_used: runnerCallsUsed(runnerResult),
      image_count: 1,
      output_files: outputFiles,
      provider_contact_performed: true,
      plugin_call_performed: true,
      api_call_performed: true,
      image_generation_performed: true,
      secret_value_read_performed: false,
      env_file_content_read_performed: false,
      production_write_performed: false,
      accepted_samples_write_performed: false,
      DailyNote_write_performed: false,
      VCP_memory_write_performed: false,
      raw_provider_payload_returned: false,
      provider_url_returned: false,
    };
  };
}

const defaultDelegate = createNativeDoubaoRuntimeV1ProviderDelegate();

module.exports = defaultDelegate;
module.exports.delegateId = delegateId;
module.exports.exactConfirmation = exactConfirmation;
module.exports.defaultOutputDirectory = defaultOutputDirectory;
module.exports.validateRuntimeV1DelegateRequest = validateRuntimeV1DelegateRequest;
module.exports.createNativeDoubaoRuntimeV1ProviderDelegate = createNativeDoubaoRuntimeV1ProviderDelegate;
module.exports._private = {
  clone,
  repoRelativePath,
  extensionFromFormat,
  outputRefWithObservedExtension,
  inspectOutputFile,
  normalizeOutputFile,
  candidateOutputFiles,
  buildRunnerOptions,
};
