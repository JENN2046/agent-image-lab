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
const moduleId = "native_doubao_runtime_v1_serum_bottle_owner_runtime";
const activePacketRef = "reports/runtime_to_review_v1/serum_bottle_owner_activated_live_probe_packet_20260601.json";
const ownerRuntimeChildScript = path.join(repoRoot, "scripts", "vcptoolbox_doubao_owner_runtime_child.js");
const pluginRelativePath = path.join("Plugin", "DoubaoGen", "DoubaoGen.js");
const pluginConfigRelativePath = path.join("Plugin", "DoubaoGen", "config.env");
const allowedOutputDirectory = "runs/real_generation/runtime_to_review_v1_guarded_live_probe_serum_bottle/";
const allowedPromptPackageRef = "prompts/image_generation/product_lifestyle_premium_serum_bottle_v1.yaml";
const requiredModel = "doubao-seedream-5-0-260128";
const ownerConfirmationPhrase = "RUNTIME_TO_REVIEW_V1_SERUM_BOTTLE_ONE_PROVIDER_ONE_IMAGE";
const runnerConfirmationPhrase = "RUNTIME_TO_REVIEW_V1_ONE_PROVIDER_ONE_IMAGE";
const defaultVcpToolBoxRootCandidates = [
  "A:\\VCP\\apps\\VCPToolBox",
  "A:\\VCP\\VCPToolBox",
];
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

function repoRelativePath(value, label) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${label} must be a non-empty string`);
  }
  if (path.isAbsolute(value)) {
    const relativeFromRepo = path.relative(repoRoot, value).replace(/\\/g, "/");
    if (relativeFromRepo.startsWith("../") || relativeFromRepo === ".." || path.isAbsolute(relativeFromRepo)) {
      throw new Error(`${label} escapes repository root`);
    }
    return { relative: relativeFromRepo, resolved: value };
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

function failClosed(blocker, details = {}) {
  return {
    bridge_id: secretlessBridge.BRIDGE_ID,
    status: "BLOCKED_SERUM_BOTTLE_OWNER_RUNTIME_FAILED_CLOSED",
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

function readJson(relativePath) {
  const { resolved } = repoRelativePath(relativePath, "json ref");
  return JSON.parse(fs.readFileSync(resolved, "utf8"));
}

function validateActivePacket(packet) {
  const issues = [];
  const source = packet && typeof packet === "object" && !Array.isArray(packet) ? packet : {};
  if (source.schema !== "runtime_to_review_v1_serum_bottle_owner_activated_live_probe_packet.v1") issues.push("packet_schema_mismatch");
  if (source.can_execute_now !== true) issues.push("can_execute_now_must_be_true");
  if (source.execution_authorized_by_this_packet !== true) issues.push("execution_authorized_by_this_packet_must_be_true");
  if (source.live_probe_authorized_by_this_packet !== true) issues.push("live_probe_authorized_by_this_packet_must_be_true");
  if (source.activated_by_owner_confirmation !== ownerConfirmationPhrase) issues.push("owner_confirmation_phrase_mismatch");
  if (source.runner_confirmation_phrase !== runnerConfirmationPhrase) issues.push("runner_confirmation_phrase_mismatch");
  if (source.owner_runtime_module !== "adapters/runtime/native_doubao_runtime_v1_serum_bottle_owner_runtime.js") issues.push("owner_runtime_module_mismatch");
  if (source.target_prompt_package_ref !== allowedPromptPackageRef) issues.push("prompt_package_ref_mismatch");
  if (source.target_output_directory_ref !== allowedOutputDirectory) issues.push("output_directory_ref_mismatch");
  if (source.required_model !== requiredModel) issues.push("required_model_mismatch");
  if (!source.budget || source.budget.max_provider_calls !== 1 || source.budget.max_images !== 1 || source.budget.retry_allowed !== false) {
    issues.push("budget_must_be_one_provider_one_image_no_retry");
  }
  return {
    passed: issues.length === 0,
    issues,
  };
}

function loadActivePacketAuthorization() {
  try {
    const packet = readJson(activePacketRef);
    return validateActivePacket(packet);
  } catch (error) {
    return { passed: false, issues: [error.message] };
  }
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

function categorizePluginError(parsed) {
  const rawError = parsed && typeof parsed.error === "string" ? parsed.error : "";
  const rawCode = parsed && typeof parsed.error_code === "string" ? parsed.error_code : "";
  if (rawError.includes("VOLCENGINE_API_KEY")) {
    return { blocker: "vcptoolbox_doubaogen_runtime_env_key_missing", provider_contact_performed: false, api_call_performed: false };
  }
  if (rawCode.includes("timeout") || rawError.includes("请求超时") || rawError.includes("timeout")) {
    return { blocker: "vcptoolbox_owner_runtime_child_timeout", provider_contact_performed: false, api_call_performed: false };
  }
  if (rawError.includes("认证失败") || rawError.includes("配额") || rawError.includes("API错误")) {
    return { blocker: "vcptoolbox_doubaogen_provider_api_failed_closed", provider_contact_performed: true, api_call_performed: true };
  }
  if (rawError.includes("DoubaoGen Plugin Error")) {
    return { blocker: "vcptoolbox_doubaogen_plugin_returned_error", provider_contact_performed: true, api_call_performed: false };
  }
  return { blocker: rawCode || "vcptoolbox_doubaogen_plugin_returned_error", provider_contact_performed: false, api_call_performed: false };
}

function parsePluginStdout(stdout) {
  try {
    return JSON.parse(stdout);
  } catch {
    return null;
  }
}

function runDoubaoPlugin({ vcpToolBoxRoot, prompt, model, outputDirectory }) {
  const pluginEntry = path.join(vcpToolBoxRoot, pluginRelativePath);
  const pluginConfig = path.join(vcpToolBoxRoot, pluginConfigRelativePath);
  if (!fs.existsSync(pluginEntry)) {
    return Promise.resolve({ ok: false, blocker: "vcptoolbox_doubaogen_plugin_entry_missing", provider_contact_performed: false, plugin_call_performed: false, api_call_performed: false });
  }
  if (!fs.existsSync(pluginConfig)) {
    return Promise.resolve({ ok: false, blocker: "vcptoolbox_doubaogen_plugin_config_missing", provider_contact_performed: false, plugin_call_performed: false, api_call_performed: false });
  }

  const output = repoRelativePath(outputDirectory, "output directory");
  fs.mkdirSync(output.resolved, { recursive: true });
  if (!fs.existsSync(ownerRuntimeChildScript)) {
    return Promise.resolve({ ok: false, blocker: "vcptoolbox_owner_runtime_child_script_missing", provider_contact_performed: false, plugin_call_performed: false, api_call_performed: false });
  }

  const childRequest = {
    vcpToolBoxRoot,
    prompt,
    model,
    outputDirectory: output.resolved,
    taskId: "runtime-v1-serum-bottle-task-001",
    invocationId: "runtime_v1_serum_bottle_001",
  };

  return new Promise((resolve) => {
    const child = childProcess.execFile(
      process.execPath,
      [ownerRuntimeChildScript],
      {
        cwd: repoRoot,
        env: buildDoubaoPluginChildEnv({ outputDirectory: output.resolved, model, vcpToolBoxRoot }),
        encoding: "utf8",
        timeout: 300000,
        maxBuffer: 100 * 1024 * 1024,
        windowsHide: true,
      },
      (error, stdout) => {
        const parsed = parsePluginStdout(stdout);
        if (parsed && parsed.status === "success") {
          resolve({ ok: true, blocker: null, result: parsed.result || null, provider_contact_performed: true, plugin_call_performed: true, api_call_performed: true });
          return;
        }
        if (parsed && parsed.status === "error") {
          const category = categorizePluginError(parsed);
          resolve({
            ok: false,
            blocker: category.blocker,
            provider_contact_performed: category.provider_contact_performed === true || parsed.provider_contact_performed === true,
            plugin_call_performed: true,
            api_call_performed: category.api_call_performed === true || parsed.api_call_performed === true,
          });
          return;
        }
        resolve({
          ok: false,
          blocker: error ? "vcptoolbox_doubaogen_plugin_failed_closed" : "vcptoolbox_doubaogen_plugin_stdout_not_json",
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
  const details = pluginResult && pluginResult.details && typeof pluginResult.details === "object" ? pluginResult.details : {};
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

async function inspectOutputFile(fileRef) {
  const { relative, resolved } = repoRelativePath(fileRef, "output file");
  let buffer = fs.readFileSync(resolved);
  const metadata = await sharp(buffer).metadata();
  const normalizedRelative = outputRefWithObservedExtension(relative, metadata.format);
  if (normalizedRelative !== relative) {
    const normalized = repoRelativePath(normalizedRelative, "normalized output file");
    if (fs.existsSync(normalized.resolved)) throw new Error("normalized_output_file_already_exists");
    fs.renameSync(resolved, normalized.resolved);
    buffer = fs.readFileSync(normalized.resolved);
    return {
      path: normalized.relative,
      bytes: buffer.length,
      sha256: crypto.createHash("sha256").update(buffer).digest("hex"),
      mime_type: mimeFromFormat(metadata.format),
      dimensions: `${metadata.width}x${metadata.height}`,
      magic_number: buffer.slice(0, Math.min(buffer.length, 12)).toString("hex"),
      extension_normalized_from: relative,
    };
  }
  return {
    path: relative,
    bytes: buffer.length,
    sha256: crypto.createHash("sha256").update(buffer).digest("hex"),
    mime_type: mimeFromFormat(metadata.format),
    dimensions: `${metadata.width}x${metadata.height}`,
    magic_number: buffer.slice(0, Math.min(buffer.length, 12)).toString("hex"),
  };
}

async function serumBottleOwnerRuntimeDelegate(request, options = {}) {
  const authorization = loadActivePacketAuthorization();
  if (authorization.passed !== true) {
    return failClosed("serum_bottle_active_packet_missing_or_invalid", { calls_used: { provider: 0, plugin: 0, api: 0 } });
  }
  const issues = secretlessBridge.validateSecretlessProviderRuntimeRequest(request);
  if (issues.length > 0) {
    return failClosed("serum_bottle_owner_runtime_request_invalid", { calls_used: { provider: 0, plugin: 0, api: 0 } });
  }
  if (request.output_directory_ref !== allowedOutputDirectory) {
    return failClosed("serum_bottle_output_directory_not_allowed");
  }
  if (request.model !== requiredModel) {
    return failClosed("serum_bottle_model_not_allowed", { model_sent: request.model || null });
  }

  let prompt;
  try {
    prompt = resolvePromptText(request.prompt_package_ref);
  } catch {
    return failClosed("serum_bottle_prompt_package_invalid");
  }

  const pluginCall = await runDoubaoPlugin({
    vcpToolBoxRoot: resolveVcpToolBoxRoot(options),
    prompt,
    model: request.model,
    outputDirectory: request.output_directory_ref,
  });

  if (pluginCall.ok !== true) {
    return failClosed(pluginCall.blocker || "serum_bottle_plugin_failed_closed", {
      provider_contact_performed: pluginCall.provider_contact_performed === true,
      plugin_call_performed: pluginCall.plugin_call_performed === true,
      api_call_performed: pluginCall.api_call_performed === true,
      calls_used: pluginCall.provider_contact_performed
        ? { provider: 1, plugin: 1, api: 1 }
        : { provider: 0, plugin: pluginCall.plugin_call_performed === true ? 1 : 0, api: 0 },
    });
  }

  const outputRef = candidateOutputRef(pluginCall.result, request.output_directory_ref);
  if (!outputRef) {
    return failClosed("serum_bottle_output_file_missing", {
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
    return failClosed("serum_bottle_output_file_invalid", {
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
    (request) => serumBottleOwnerRuntimeDelegate(clone(request), options),
    {
      delegateOwner: "agent_image_lab_runtime_v1_serum_bottle_owner_runtime",
      delegateAuthorizationRef: secretlessBridge.EXPECTED_DELEGATE_AUTHORIZATION_REF,
      delegateAuthorizationStatus: secretlessBridge.EXPECTED_DELEGATE_AUTHORIZATION_STATUS,
    }
  );
}

function inspectSerumBottleOwnerRuntimeReadiness(options = {}) {
  const vcpToolBoxRoot = resolveVcpToolBoxRoot(options);
  const authorization = loadActivePacketAuthorization();
  return {
    module_id: moduleId,
    active_packet_ref: activePacketRef,
    active_packet_valid: authorization.passed,
    active_packet_issues: authorization.issues,
    plugin_entry_present: fs.existsSync(path.join(vcpToolBoxRoot, pluginRelativePath)),
    plugin_config_present: fs.existsSync(path.join(vcpToolBoxRoot, pluginConfigRelativePath)),
    output_directory_allowed: allowedOutputDirectory,
    prompt_package_allowed: allowedPromptPackageRef,
    model_required: requiredModel,
    env_file_content_read_performed: false,
    secret_value_read_performed: false,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
  };
}

module.exports = createSecretlessProviderRuntime;
module.exports.moduleId = moduleId;
module.exports.createSecretlessProviderRuntime = createSecretlessProviderRuntime;
module.exports.serumBottleOwnerRuntimeDelegate = serumBottleOwnerRuntimeDelegate;
module.exports.inspectSerumBottleOwnerRuntimeReadiness = inspectSerumBottleOwnerRuntimeReadiness;
module.exports.loadActivePacketAuthorization = loadActivePacketAuthorization;
module.exports.validateActivePacket = validateActivePacket;
module.exports.allowedOutputDirectory = allowedOutputDirectory;
module.exports.allowedPromptPackageRef = allowedPromptPackageRef;
module.exports.requiredModel = requiredModel;
module.exports.activePacketRef = activePacketRef;
module.exports.ownerConfirmationPhrase = ownerConfirmationPhrase;
module.exports.runnerConfirmationPhrase = runnerConfirmationPhrase;
module.exports.buildSafeChildEnv = buildSafeChildEnv;
module.exports.buildDoubaoPluginChildEnv = buildDoubaoPluginChildEnv;
module.exports._private = {
  outputRefWithObservedExtension,
  inspectOutputFile,
};
module.exports.env_file_content_read_performed = false;
module.exports.secret_value_read_performed = false;
