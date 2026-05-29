#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const sharp = require("sharp");
const YAML = require("yaml");

const secretlessBridge = require("../../scripts/native_doubao_secretless_provider_runtime_bridge.js");

const repoRoot = path.resolve(__dirname, "..", "..");
const moduleId = "native_doubao_runtime_v1_real_bound_owner_runtime";
const defaultVcpToolBoxRootCandidates = [
  "A:\\VCP\\apps\\VCPToolBox",
  "A:\\VCP\\VCPToolBox",
];
const ownerRuntimeChildScript = path.join(repoRoot, "scripts", "vcptoolbox_doubao_owner_runtime_child.js");
const pluginRelativePath = path.join("Plugin", "DoubaoGen", "DoubaoGen.js");
const pluginConfigRelativePath = path.join("Plugin", "DoubaoGen", "config.env");
const allowedOutputDirectory = "runs/real_generation/runtime_to_review_v1_guarded_live_probe/";
const allowedPromptPackageRef = "prompts/image_generation/neutral_smoke_test_red_apple_v1.yaml";
const requiredModel = "doubao-seedream-5-0-260128";
const safeChildEnvKeys = Object.freeze([
  "PATH",
  "Path",
  "SystemRoot",
  "WINDIR",
  "TEMP",
  "TMP",
]);

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function failClosed(blocker, details = {}) {
  return {
    bridge_id: secretlessBridge.BRIDGE_ID,
    status: "BLOCKED_REAL_BOUND_OWNER_RUNTIME_FAILED_CLOSED",
    blocker,
    provider_contact_performed: details.provider_contact_performed === true,
    plugin_call_performed: details.plugin_call_performed === true,
    api_call_performed: details.api_call_performed === true,
    image_generation_performed: details.image_generation_performed === true,
    output_write_performed: details.output_write_performed === true,
    calls_used: details.calls_used || { provider: 0, plugin: 0, api: 0 },
    image_count: 0,
    model_sent: details.model_sent || requiredModel,
    output_files: [],
    human_review_required_now: false,
  };
}

function repoRelativePath(value, label) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${label} must be a non-empty string`);
  }
  if (path.isAbsolute(value)) {
    const relativeFromRepo = path.relative(repoRoot, value).replace(/\\/g, "/");
    if (relativeFromRepo.startsWith("../") || relativeFromRepo === ".." || path.isAbsolute(relativeFromRepo)) {
      throw new Error(`${label} escapes repository root`);
    }
    return {
      relative: relativeFromRepo,
      resolved: value,
    };
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

function resolvePromptText(promptPackageRef) {
  if (promptPackageRef !== allowedPromptPackageRef) {
    throw new Error("prompt_package_ref_not_allowed");
  }
  const { resolved } = repoRelativePath(promptPackageRef, "prompt package ref");
  const parsed = YAML.parse(fs.readFileSync(resolved, "utf8"));
  if (!parsed || typeof parsed.prompt !== "string" || parsed.prompt.trim() === "") {
    throw new Error("prompt_package_missing_prompt");
  }
  return parsed.prompt.trim();
}

function resolveVcpToolBoxRoot(options = {}) {
  const requested = options.vcpToolBoxRoot || process.env.AGENT_IMAGE_LAB_VCPTOOLBOX_ROOT;
  if (requested) return path.resolve(requested);
  const existingCandidate = defaultVcpToolBoxRootCandidates.find((candidate) => fs.existsSync(candidate));
  return path.resolve(existingCandidate || defaultVcpToolBoxRootCandidates[0]);
}

function inspectRealBoundOwnerRuntimeReadiness(options = {}) {
  const vcpToolBoxRoot = resolveVcpToolBoxRoot(options);
  const pluginEntry = path.join(vcpToolBoxRoot, pluginRelativePath);
  const pluginConfig = path.join(vcpToolBoxRoot, pluginConfigRelativePath);
  const pluginManifest = path.join(vcpToolBoxRoot, "Plugin", "DoubaoGen", "plugin-manifest.json");
  return {
    module_id: moduleId,
    vcp_toolbox_root_ref: "owner_configured_vcptoolbox_root",
    plugin_entry_present: fs.existsSync(pluginEntry),
    plugin_config_present: fs.existsSync(pluginConfig),
    plugin_manifest_present: fs.existsSync(pluginManifest),
    output_directory_allowed: allowedOutputDirectory,
    prompt_package_allowed: allowedPromptPackageRef,
    model_required: requiredModel,
    env_file_content_read_performed: false,
    secret_value_read_performed: false,
    config_env_read_performed: false,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
  };
}

function categorizePluginError(parsed) {
  const rawError = parsed && typeof parsed.error === "string" ? parsed.error : "";
  const rawCode = parsed && typeof parsed.error_code === "string" ? parsed.error_code : "";
  const errorPayload = `${rawCode} ${rawError}`;
  if (rawError.includes("VOLCENGINE_API_KEY")) {
    return {
      blocker: "vcptoolbox_doubaogen_runtime_env_key_missing",
      provider_contact_performed: false,
      api_call_performed: false,
    };
  }
  if (rawCode === "vcptoolbox_owner_runtime_child_timeout_4m" || rawError.includes("请求超时(4分钟)") || rawError.includes("请求超时") || rawError.includes("timeout")) {
    return {
      blocker: "vcptoolbox_owner_runtime_child_timeout_4m",
      provider_contact_performed: false,
      api_call_performed: false,
    };
  }
  if (rawCode === "vcptoolbox_owner_runtime_child_invalid_request" || rawError.includes("请求参数错误") || rawError.includes("image size must be at least")) {
    return {
      blocker: "vcptoolbox_owner_runtime_child_invalid_request",
      provider_contact_performed: false,
      api_call_performed: false,
    };
  }
  if (rawError.includes("认证失败") || rawError.includes("配额") || rawError.includes("API错误")) {
    return {
      blocker: "vcptoolbox_doubaogen_provider_api_failed_closed",
      provider_contact_performed: true,
      api_call_performed: true,
    };
  }
  if (errorPayload.includes("DoubaoGen Plugin Error")) {
    return {
      blocker: "vcptoolbox_doubaogen_plugin_returned_error",
      provider_contact_performed: true,
      api_call_performed: false,
    };
  }
  return {
    blocker: rawCode || "vcptoolbox_doubaogen_plugin_returned_error",
    provider_contact_performed: false,
    api_call_performed: false,
  };
}

function parsePluginStdout(stdout) {
  try {
    return JSON.parse(stdout);
  } catch {
    return null;
  }
}

function buildSafeChildEnv(baseEnv = process.env) {
  const env = {};
  for (const key of safeChildEnvKeys) {
    if (typeof baseEnv[key] === "string" && baseEnv[key]) {
      env[key] = baseEnv[key];
    }
  }
  return env;
}

function buildDoubaoPluginChildEnv({ outputDirectory, model, vcpToolBoxRoot }) {
  const env = buildSafeChildEnv();
  env.PROJECT_BASE_PATH = outputDirectory;
  env.DEFAULT_RESPONSE_FORMAT = "b64_json";
  env.SEEDREAM_MODEL_ID = model;
  env.DebugMode = "false";
  env.DOTENV_CONFIG_PATH = path.join(vcpToolBoxRoot, pluginConfigRelativePath);
  env.DOTENV_CONFIG_QUIET = "true";
  return env;
}

function runDoubaoPlugin({ vcpToolBoxRoot, prompt, model, outputDirectory }) {
  const pluginEntry = path.join(vcpToolBoxRoot, pluginRelativePath);
  const pluginConfig = path.join(vcpToolBoxRoot, pluginConfigRelativePath);
  if (!fs.existsSync(pluginEntry)) {
    return Promise.resolve({
      ok: false,
      blocker: "vcptoolbox_doubaogen_plugin_entry_missing",
      provider_contact_performed: false,
      plugin_call_performed: false,
      api_call_performed: false,
    });
  }
  if (!fs.existsSync(pluginConfig)) {
    return Promise.resolve({
      ok: false,
      blocker: "vcptoolbox_doubaogen_plugin_config_missing",
      provider_contact_performed: false,
      plugin_call_performed: false,
      api_call_performed: false,
    });
  }

  const output = repoRelativePath(outputDirectory, "output directory");
  fs.mkdirSync(output.resolved, { recursive: true });
  if (!fs.existsSync(ownerRuntimeChildScript)) {
    return Promise.resolve({
      ok: false,
      blocker: "vcptoolbox_owner_runtime_child_script_missing",
      provider_contact_performed: false,
      plugin_call_performed: false,
      api_call_performed: false,
    });
  }

  const childRequest = {
    vcpToolBoxRoot,
    prompt,
    model,
    outputDirectory: output.resolved,
    taskId: "runtime-v1-real-guarded-task-001",
    invocationId: "runtime_v1_real_guarded_smoke_001",
  };

  const childEnv = buildDoubaoPluginChildEnv({
    outputDirectory: output.resolved,
    model,
    vcpToolBoxRoot,
  });

  return new Promise((resolve) => {
    const child = childProcess.execFile(
      process.execPath,
      [ownerRuntimeChildScript],
      {
        cwd: repoRoot,
        env: childEnv,
        encoding: "utf8",
        timeout: 300000,
        maxBuffer: 100 * 1024 * 1024,
        windowsHide: true,
      },
      (error, stdout) => {
        const parsed = parsePluginStdout(stdout);
        if (parsed && parsed.status === "success") {
          resolve({
            ok: true,
            blocker: null,
            result: parsed.result || null,
            provider_contact_performed: true,
            plugin_call_performed: true,
            api_call_performed: true,
          });
          return;
        }

      if (parsed && parsed.status === "error") {
          const category = categorizePluginError({
            error_code: parsed.error_code || "",
            error: parsed.error || "",
          });
          let childBlocker = category.blocker || "vcptoolbox_owner_runtime_child_failed";
          if (parsed.provider_config_key_present === false && parsed.error_code === "vcptoolbox_owner_runtime_child_failed") {
            childBlocker = "vcptoolbox_owner_runtime_child_failed_config_key_missing";
          }
          resolve({
            ok: false,
            blocker: childBlocker || category.blocker,
            provider_contact_performed: category.provider_contact_performed === true || parsed.provider_contact_performed === true,
            plugin_call_performed: true,
            api_call_performed: category.api_call_performed === true || parsed.api_call_performed === true,
          });
          return;
        }

        if (error) {
          resolve({
            ok: false,
            blocker: "vcptoolbox_doubaogen_plugin_failed_closed",
            provider_contact_performed: false,
            plugin_call_performed: true,
            api_call_performed: false,
          });
          return;
        }

        resolve({
          ok: false,
          blocker: "vcptoolbox_doubaogen_plugin_stdout_not_json",
          provider_contact_performed: false,
          plugin_call_performed: true,
          api_call_performed: false,
        });
      }
    );
    child.stdin.end(JSON.stringify(childRequest));
  });
}

function candidateOutputRef(pluginResult, outputDirectory) {
  const details = pluginResult && pluginResult.details && typeof pluginResult.details === "object"
    ? pluginResult.details
    : {};
  const serverPath = typeof details.serverPath === "string" ? details.serverPath : null;
  const localPath = typeof details.localPath === "string" ? details.localPath : null;
  if (localPath) return localPath;
  if (serverPath) return path.posix.join(outputDirectory.replace(/\/?$/, "/"), serverPath.replace(/\\/g, "/"));
  return null;
}

function mimeFromFormat(format) {
  if (format === "jpeg" || format === "jpg") return "image/jpeg";
  if (format === "png") return "image/png";
  if (format === "webp") return "image/webp";
  return null;
}

async function inspectOutputFile(fileRef) {
  const { relative, resolved } = repoRelativePath(fileRef, "output file");
  const buffer = fs.readFileSync(resolved);
  const metadata = await sharp(buffer).metadata();
  return {
    path: relative,
    bytes: buffer.length,
    sha256: crypto.createHash("sha256").update(buffer).digest("hex"),
    mime_type: mimeFromFormat(metadata.format),
    dimensions: `${metadata.width}x${metadata.height}`,
    magic_number: buffer.slice(0, Math.min(buffer.length, 12)).toString("hex"),
  };
}

async function realBoundOwnerRuntimeDelegate(request, options = {}) {
  const issues = secretlessBridge.validateSecretlessProviderRuntimeRequest(request);
  if (issues.length > 0) {
    return failClosed("real_bound_owner_runtime_request_invalid", { calls_used: { provider: 0, plugin: 0, api: 0 } });
  }
  if (request.output_directory_ref !== allowedOutputDirectory) {
    return failClosed("real_bound_owner_runtime_output_directory_not_allowed");
  }
  if (request.model !== requiredModel) {
    return failClosed("real_bound_owner_runtime_model_not_allowed", { model_sent: request.model || null });
  }

  let prompt;
  try {
    prompt = resolvePromptText(request.prompt_package_ref);
  } catch {
    return failClosed("real_bound_owner_runtime_prompt_package_invalid");
  }

  const pluginCall = await runDoubaoPlugin({
    vcpToolBoxRoot: resolveVcpToolBoxRoot(options),
    prompt,
    model: request.model,
    outputDirectory: request.output_directory_ref,
  });

  if (pluginCall.ok !== true) {
    return failClosed(pluginCall.blocker || "real_bound_owner_runtime_plugin_failed_closed", {
      provider_contact_performed: pluginCall.provider_contact_performed === true,
      plugin_call_performed: pluginCall.plugin_call_performed === true,
      api_call_performed: pluginCall.api_call_performed === true,
      calls_used: pluginCall.provider_contact_performed
        ? { provider: 1, plugin: 1, api: 1 }
        : { provider: 0, plugin: 0, api: 0 },
    });
  }

  const outputRef = candidateOutputRef(pluginCall.result, request.output_directory_ref);
  if (!outputRef) {
    return failClosed("real_bound_owner_runtime_output_file_missing", {
      provider_contact_performed: true,
      plugin_call_performed: true,
      api_call_performed: true,
      image_generation_performed: true,
      calls_used: { provider: 1, plugin: 1, api: 1 },
    });
  }

  let inspected;
  try {
    inspected = await inspectOutputFile(outputRef);
  } catch {
    return failClosed("real_bound_owner_runtime_output_file_invalid", {
      provider_contact_performed: true,
      plugin_call_performed: true,
      api_call_performed: true,
      image_generation_performed: true,
      calls_used: { provider: 1, plugin: 1, api: 1 },
    });
  }

  return {
    bridge_id: secretlessBridge.BRIDGE_ID,
    status: "completed_provider_image_created",
    blocker: null,
    provider_contact_performed: true,
    plugin_call_performed: true,
    api_call_performed: true,
    image_generation_performed: true,
    output_write_performed: true,
    calls_used: { provider: 1, plugin: 1, api: 1 },
    image_count: 1,
    model_sent: request.model,
    output_files: [inspected],
    human_review_required_now: true,
  };
}

function createSecretlessProviderRuntime(options = {}) {
  return secretlessBridge.createBoundSecretlessProviderRuntimeBridge(
    (request) => realBoundOwnerRuntimeDelegate(clone(request), options),
    {
      delegateOwner: "agent_image_lab_runtime_v1_real_bound_owner_runtime",
      delegateAuthorizationRef: secretlessBridge.EXPECTED_DELEGATE_AUTHORIZATION_REF,
      delegateAuthorizationStatus: secretlessBridge.EXPECTED_DELEGATE_AUTHORIZATION_STATUS,
    }
  );
}

module.exports = createSecretlessProviderRuntime;
module.exports.moduleId = moduleId;
module.exports.createSecretlessProviderRuntime = createSecretlessProviderRuntime;
module.exports.realBoundOwnerRuntimeDelegate = realBoundOwnerRuntimeDelegate;
module.exports.inspectRealBoundOwnerRuntimeReadiness = inspectRealBoundOwnerRuntimeReadiness;
module.exports.allowedOutputDirectory = allowedOutputDirectory;
module.exports.allowedPromptPackageRef = allowedPromptPackageRef;
module.exports.requiredModel = requiredModel;
module.exports.buildSafeChildEnv = buildSafeChildEnv;
module.exports.buildDoubaoPluginChildEnv = buildDoubaoPluginChildEnv;
module.exports.env_file_content_read_performed = false;
module.exports.secret_value_read_performed = false;
