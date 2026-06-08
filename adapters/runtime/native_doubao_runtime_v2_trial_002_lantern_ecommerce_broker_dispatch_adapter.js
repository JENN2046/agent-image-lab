#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");
const crypto = require("node:crypto");
const sharp = require("sharp");
const YAML = require("yaml");

const secretlessBridge = require("../../scripts/native_doubao_secretless_provider_runtime_bridge.js");

const repoRoot = path.resolve(__dirname, "..", "..");
const moduleId = "native_doubao_runtime_v2_trial_002_lantern_ecommerce_broker_dispatch_adapter";
const allowedPromptPackageRef = "prompts/image_generation/product_lifestyle_premium_portable_led_camping_lantern_v2.yaml";
const allowedOutputDirectory = "runs/real_generation/runtime_to_review_v2_trial_002_lantern_ecommerce_hero/";
const requiredModel = "doubao-seedream-5-0-260128";
const routeTaskId = "AUTH-R2R-V2-TRIAL-002-LANTERN-ECOMMERCE-HERO-20260608-FUTURE-EXECUTION";
const pipelineId = "runtime_to_review_v2_trial_002_lantern_ecommerce_hero";
const defaultRouteUrl = "http://127.0.0.1:6005/internal/ai-image-agents/execute/r2r-v2-trial-002-lantern-ecommerce-hero";
const routePath = "/internal/ai-image-agents/execute/r2r-v2-trial-002-lantern-ecommerce-hero";
const reviewBridgeRef = "review_console/live_receipt_bridge/r2r_v2_trial_002_lantern_ecommerce_hero/bridge_entry.json";
const receiptRef = "reports/runtime_to_review_v2/r2r_v2_trial_002_lantern_ecommerce_hero_receipt.json";
const artifactRecordRef = "reports/runtime_to_review_v2/r2r_v2_trial_002_lantern_ecommerce_hero_artifact_record.json";
const resolution = "1920x1920";
const vcpToolBoxImageStoreRoot = "A:/VCP/apps/VCPToolBox/image/doubaogen";

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function failClosed(blocker, details = {}) {
  return {
    bridge_id: secretlessBridge.BRIDGE_ID,
    module_id: moduleId,
    status: "BLOCKED_R2R_V2_TRIAL_002_BROKER_DISPATCH_FAILED_CLOSED",
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
  const normalized = value.replace(/\\/g, "/");
  if (path.isAbsolute(normalized) || normalized.split("/").includes("..")) {
    throw new Error(`${label} must be repository-relative and must not contain traversal`);
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

function inspectTrial002BrokerDispatchReadiness() {
  return {
    module_id: moduleId,
    pipeline_id: pipelineId,
    route_task_id: routeTaskId,
    route_url: defaultRouteUrl,
    route_path: routePath,
    output_directory_allowed: allowedOutputDirectory,
    prompt_package_allowed: allowedPromptPackageRef,
    model_required: requiredModel,
    selected_plugin_id: "DoubaoGen",
    provider_id: "doubao",
    api_id: "generate_image",
    plan_step_type: "generate_image",
    plan_resolution: resolution,
    secretless_activation_required: true,
    authorization_header_constructed_by_agent_image_lab: false,
    admin_basic_auth_value_printed: false,
    secret_value_read_performed: false,
    env_file_content_read_performed: false,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    output_write_performed: false,
    external_vcptoolbox_route_binding_required: true,
  };
}

function routeRequestBody({ prompt, model, outputDirectory }) {
  return {
    pipelineId,
    taskId: routeTaskId,
    dryRun: false,
    confirm: true,
    operator: "agent-image-lab-runtime-v2",
    activation: {
      activation_package_id: routeTaskId,
      confirmation_phrase: "RUNTIME_TO_REVIEW_V2_TRIAL_002_ONE_PROVIDER_ONE_IMAGE",
      max_route_http_requests: 1,
      max_provider_calls: 1,
      max_plugin_calls: 1,
      max_api_calls: 1,
      max_images: 1,
      retry_allowed: false,
    },
    visual_job_contract: {
      trial_id: "r2r_v2_trial_002_lantern_ecommerce_hero",
      prompt_package_ref: allowedPromptPackageRef,
      output_directory_ref: outputDirectory,
      review_bridge_ref: reviewBridgeRef,
      receipt_ref: receiptRef,
      artifact_record_ref: artifactRecordRef,
    },
    plan: {
      steps: [{
        type: "generate_image",
        plugin: "DoubaoGen",
        prompt,
        model,
        resolution,
      }],
    },
  };
}

function postJson(urlString, body) {
  const url = new URL(urlString);
  const payload = JSON.stringify(body);
  return new Promise((resolve) => {
    const request = http.request({
      method: "POST",
      hostname: url.hostname,
      port: url.port || 80,
      path: `${url.pathname}${url.search}`,
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(payload),
      },
      timeout: 840000,
    }, (response) => {
      let data = "";
      response.setEncoding("utf8");
      response.on("data", (chunk) => { data += chunk; });
      response.on("end", () => {
        let parsed = null;
        try {
          parsed = data ? JSON.parse(data) : null;
        } catch {
          parsed = null;
        }
        resolve({
          ok: response.statusCode >= 200 && response.statusCode < 300,
          statusCode: response.statusCode,
          body: parsed,
        });
      });
    });
    request.on("timeout", () => {
      request.destroy();
      resolve({ ok: false, statusCode: 0, body: { error: "r2r_v2_trial_002_broker_route_timeout" } });
    });
    request.on("error", () => {
      resolve({ ok: false, statusCode: 0, body: { error: "r2r_v2_trial_002_broker_route_unreachable" } });
    });
    request.end(payload);
  });
}

function sanitizeRouteText(value) {
  if (value === null || value === undefined) return "";
  return String(value)
    .replace(/Basic\s+[A-Za-z0-9+/=._-]+/gi, "Basic <redacted>")
    .replace(/Bearer\s+[A-Za-z0-9+/=._-]+/gi, "Bearer <redacted>")
    .replace(/([A-Za-z]:\\)[^\s"'`]+/g, "<redacted-path>")
    .replace(/https?:\/\/[^\s"'`]+/gi, "<redacted-url>")
    .replace(/(api[_-]?key|token|secret|password|authorization)\s*[:=]\s*[^,\s"'`]+/gi, "$1=<redacted>")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 180);
}

function summarizeRouteFailure(response) {
  const body = response && response.body && typeof response.body === "object" ? response.body : {};
  const result = body.result && typeof body.result === "object" ? body.result : {};
  const parts = [`http_${response && Number.isFinite(response.statusCode) ? response.statusCode : 0}`];
  for (const [label, value] of [
    ["body_status", body.status],
    ["body_error", body.error],
    ["body_message", body.message],
    ["result_status", result.status],
    ["result_error", result.error],
    ["result_message", result.message],
  ]) {
    const safe = sanitizeRouteText(value);
    if (safe) parts.push(`${label}:${safe}`);
  }
  return parts.join(";").slice(0, 600);
}

function routeBlocker(response) {
  if (!response || response.statusCode === 0) return "r2r_v2_trial_002_broker_route_unreachable";
  const body = response.body || {};
  const result = body.result || {};
  const baseBlocker = sanitizeRouteText(result.error || body.error || result.status) ||
    "r2r_v2_trial_002_broker_route_failed_closed";
  return `${baseBlocker}::${summarizeRouteFailure(response)}`;
}

function routeLikelyContactedProvider(response) {
  const result = response && response.body && response.body.result ? response.body.result : {};
  const errors = Array.isArray(result.errors) ? result.errors.join("; ") : "";
  return errors.includes("Request id:") ||
    errors.includes("DoubaoGen Plugin Error") ||
    errors.includes("API");
}

function candidateImageRef(routeResponse, outputDirectory) {
  const result = routeResponse && routeResponse.result && typeof routeResponse.result === "object"
    ? routeResponse.result
    : {};
  const refs = [];
  if (Array.isArray(result.outputRefs)) refs.push(...result.outputRefs);
  if (Array.isArray(result.output_refs)) refs.push(...result.output_refs);
  const images = Array.isArray(result.images) ? result.images : [];
  for (const image of images) {
    refs.push(
      image && image.outputRef,
      image && image.output_ref,
      image && image.path,
      image && image.file,
      image && image.filename,
      image && image.filePath,
      image && image.localPath
    );
  }
  const raw = refs.find((ref) => typeof ref === "string" && ref.trim() !== "");
  if (!raw || typeof raw !== "string") return null;
  const normalized = raw.replace(/\\/g, "/").replace(/^\/+/, "");
  if (normalized.startsWith(outputDirectory)) return normalized;
  if (normalized.startsWith("image/doubaogen/")) {
    return path.posix.join(outputDirectory.replace(/\/?$/, "/"), path.posix.basename(normalized));
  }
  if (normalized.includes("/")) return path.posix.join(outputDirectory.replace(/\/?$/, "/"), path.posix.basename(normalized));
  return path.posix.join(outputDirectory.replace(/\/?$/, "/"), "image", "doubaogen", normalized);
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

function resolveVcpToolBoxDoubaoSource(fileRef, options = {}) {
  const normalized = String(fileRef || "").replace(/\\/g, "/").replace(/^\/+/, "");
  const filename = path.posix.basename(normalized);
  if (
    !filename ||
    filename !== normalized.split("/").pop() ||
    filename.includes("\0") ||
    filename.includes(":") ||
    filename === "." ||
    filename === ".."
  ) {
    return null;
  }
  const storeRoot = options.vcpToolBoxImageStoreRoot || vcpToolBoxImageStoreRoot;
  const source = path.resolve(storeRoot, filename);
  const relative = path.relative(storeRoot, source);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    return null;
  }
  return fs.existsSync(source) ? source : null;
}

function importVcpToolBoxImageToArtifactStore(fileRef, outputDirectory, options = {}) {
  const source = resolveVcpToolBoxDoubaoSource(fileRef, options);
  if (!source) return null;
  const output = repoRelativePath(outputDirectory, "output directory");
  const filename = path.posix.basename(String(fileRef).replace(/\\/g, "/"));
  const targetRef = path.posix.join(output.relative.replace(/\/?$/, "/"), filename);
  const target = repoRelativePath(targetRef, "artifact import target");
  const targetRelativeToOutput = path.relative(output.resolved, target.resolved);
  if (targetRelativeToOutput.startsWith("..") || path.isAbsolute(targetRelativeToOutput)) {
    throw new Error("artifact_import_target_escapes_output_directory");
  }
  if (fs.existsSync(target.resolved)) {
    throw new Error("artifact_import_target_already_exists");
  }
  fs.mkdirSync(path.dirname(target.resolved), { recursive: true });
  fs.copyFileSync(source, target.resolved, fs.constants.COPYFILE_EXCL);
  return target.relative;
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

async function inspectOrImportOutputFile(fileRef, outputDirectory, options = {}) {
  try {
    return await inspectOutputFile(fileRef);
  } catch (error) {
    if (error && error.code !== "ENOENT") {
      throw error;
    }
  }
  const importedRef = importVcpToolBoxImageToArtifactStore(fileRef, outputDirectory, options);
  if (!importedRef) {
    throw new Error("artifact_import_source_missing");
  }
  return inspectOutputFile(importedRef);
}

async function realBoundOwnerRuntimeDelegate(request, options = {}) {
  const issues = secretlessBridge.validateSecretlessProviderRuntimeRequest(request);
  if (issues.length > 0) return failClosed("r2r_v2_trial_002_secretless_request_invalid");
  if (request.output_directory_ref !== allowedOutputDirectory) {
    return failClosed("r2r_v2_trial_002_output_directory_not_allowed");
  }
  if (request.prompt_package_ref !== allowedPromptPackageRef) {
    return failClosed("r2r_v2_trial_002_prompt_package_not_allowed");
  }
  if (request.model !== requiredModel) {
    return failClosed("r2r_v2_trial_002_model_not_allowed", { model_sent: request.model || null });
  }

  let prompt;
  try {
    prompt = resolvePromptText(request.prompt_package_ref);
  } catch {
    return failClosed("r2r_v2_trial_002_prompt_package_invalid");
  }

  const output = repoRelativePath(request.output_directory_ref, "output directory");
  fs.mkdirSync(output.resolved, { recursive: true });

  const post = typeof options.postJson === "function" ? options.postJson : postJson;
  const response = await post(options.routeUrl || defaultRouteUrl, routeRequestBody({
    prompt,
    model: request.model,
    outputDirectory: request.output_directory_ref,
  }));

  if (!response.ok || !response.body || response.body.ok !== true) {
    const contactedProvider = routeLikelyContactedProvider(response);
    return failClosed(routeBlocker(response), {
      provider_contact_performed: contactedProvider,
      plugin_call_performed: response.statusCode !== 0,
      api_call_performed: contactedProvider,
      calls_used: contactedProvider
        ? { provider: 1, plugin: 1, api: 1 }
        : { provider: 0, plugin: response.statusCode !== 0 ? 1 : 0, api: 0 },
    });
  }

  const outputRef = candidateImageRef(response.body, request.output_directory_ref);
  if (!outputRef) {
    return failClosed("r2r_v2_trial_002_output_file_missing", {
      provider_contact_performed: true,
      plugin_call_performed: true,
      api_call_performed: true,
      image_generation_performed: true,
      calls_used: { provider: 1, plugin: 1, api: 1 },
    });
  }

  let inspected;
  try {
    inspected = await inspectOrImportOutputFile(outputRef, request.output_directory_ref, options);
  } catch {
    return failClosed("r2r_v2_trial_002_output_file_invalid", {
      provider_contact_performed: true,
      plugin_call_performed: true,
      api_call_performed: true,
      image_generation_performed: true,
      calls_used: { provider: 1, plugin: 1, api: 1 },
    });
  }

  return {
    bridge_id: secretlessBridge.BRIDGE_ID,
    module_id: moduleId,
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
      delegateOwner: "agent_image_lab_runtime_v2_trial_002_lantern_ecommerce_broker_dispatch_adapter",
      delegateAuthorizationRef: secretlessBridge.EXPECTED_DELEGATE_AUTHORIZATION_REF,
      delegateAuthorizationStatus: secretlessBridge.EXPECTED_DELEGATE_AUTHORIZATION_STATUS,
    }
  );
}

module.exports = createSecretlessProviderRuntime;
module.exports.moduleId = moduleId;
module.exports.createSecretlessProviderRuntime = createSecretlessProviderRuntime;
module.exports.realBoundOwnerRuntimeDelegate = realBoundOwnerRuntimeDelegate;
module.exports.inspectTrial002BrokerDispatchReadiness = inspectTrial002BrokerDispatchReadiness;
module.exports.allowedPromptPackageRef = allowedPromptPackageRef;
module.exports.allowedOutputDirectory = allowedOutputDirectory;
module.exports.requiredModel = requiredModel;
module.exports.routeTaskId = routeTaskId;
module.exports.pipelineId = pipelineId;
module.exports.defaultRouteUrl = defaultRouteUrl;
module.exports.routePath = routePath;
module.exports.resolution = resolution;
module.exports.receiptRef = receiptRef;
module.exports.artifactRecordRef = artifactRecordRef;
module.exports.reviewBridgeRef = reviewBridgeRef;
module.exports.vcpToolBoxImageStoreRoot = vcpToolBoxImageStoreRoot;
module.exports._private = {
  repoRelativePath,
  resolvePromptText,
  routeRequestBody,
  candidateImageRef,
  routeBlocker,
  resolveVcpToolBoxDoubaoSource,
  importVcpToolBoxImageToArtifactStore,
  inspectOrImportOutputFile,
  outputRefWithObservedExtension,
};
