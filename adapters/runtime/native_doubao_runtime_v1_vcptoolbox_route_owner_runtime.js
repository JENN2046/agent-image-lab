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
const moduleId = "native_doubao_runtime_v1_vcptoolbox_route_owner_runtime";
const allowedOutputDirectory = "runs/real_generation/runtime_to_review_v1_guarded_live_probe/";
const allowedPromptPackageRef = "prompts/image_generation/neutral_smoke_test_red_apple_v1.yaml";
const requiredModel = "doubao-seedream-5-0-260128";
const routeTaskId = "AUTH-DRAFT-NATIVE-DOUBAO-RUNTIME-TO-REVIEW-V1-20260529-001";
const defaultRouteUrl = "http://127.0.0.1:6006/admin_api/ai-image-agents/execute";

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

function buildBasicAuthHeader(env = process.env) {
  if (typeof env.AGENT_IMAGE_LAB_VCP_ADMIN_BASIC_AUTH_B64 === "string" && env.AGENT_IMAGE_LAB_VCP_ADMIN_BASIC_AUTH_B64.trim()) {
    return `Basic ${env.AGENT_IMAGE_LAB_VCP_ADMIN_BASIC_AUTH_B64.trim()}`;
  }
  const user = typeof env.AGENT_IMAGE_LAB_VCP_ADMIN_USERNAME === "string"
    ? env.AGENT_IMAGE_LAB_VCP_ADMIN_USERNAME
    : "";
  const pass = typeof env.AGENT_IMAGE_LAB_VCP_ADMIN_PASSWORD === "string"
    ? env.AGENT_IMAGE_LAB_VCP_ADMIN_PASSWORD
    : "";
  if (!user || !pass) return null;
  return `Basic ${Buffer.from(`${user}:${pass}`, "utf8").toString("base64")}`;
}

function inspectRouteOwnerRuntimeReadiness(env = process.env) {
  return {
    module_id: moduleId,
    route_url: defaultRouteUrl,
    route_task_id: routeTaskId,
    output_directory_allowed: allowedOutputDirectory,
    prompt_package_allowed: allowedPromptPackageRef,
    model_required: requiredModel,
    admin_basic_auth_env_present: Boolean(buildBasicAuthHeader(env)),
    admin_basic_auth_value_printed: false,
    secret_value_read_performed: false,
    env_file_content_read_performed: false,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
  };
}

function postJson(urlString, body, headers = {}) {
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
        ...headers,
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
      resolve({ ok: false, statusCode: 0, body: { error: "vcptoolbox_route_timeout" } });
    });
    request.on("error", () => {
      resolve({ ok: false, statusCode: 0, body: { error: "vcptoolbox_route_unreachable" } });
    });
    request.end(payload);
  });
}

function routeRequestBody({ prompt, model, outputDirectory }) {
  return {
    pipelineId: "runtime_v1_real_guarded_smoke_001",
    taskId: routeTaskId,
    dryRun: false,
    confirm: true,
    operator: "agent-image-lab-runtime-v1",
    context: {
      doubaoProjectBasePathOverride: path.resolve(repoRoot, outputDirectory),
    },
    plan: {
      steps: [{
        type: "generate_image",
        plugin: "DoubaoGen",
        prompt,
        model,
        resolution: "1440x2560",
      }],
    },
  };
}

function candidateImageRef(routeResponse, outputDirectory) {
  const result = routeResponse && routeResponse.result && typeof routeResponse.result === "object"
    ? routeResponse.result
    : {};
  const images = Array.isArray(result.images) ? result.images : [];
  const first = images[0] || null;
  if (!first) return null;
  const raw = first.path || first.file || first.filename || null;
  if (!raw || typeof raw !== "string") return null;
  const normalized = raw.replace(/\\/g, "/").replace(/^\/+/, "");
  if (normalized.includes("/")) {
    return path.posix.join(outputDirectory.replace(/\/?$/, "/"), normalized);
  }
  return path.posix.join(outputDirectory.replace(/\/?$/, "/"), "image", "doubaogen", normalized);
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
  if (Array.isArray(result.errors)) {
    const safeErrors = result.errors.map(sanitizeRouteText).filter(Boolean).slice(0, 3);
    if (safeErrors.length > 0) parts.push(`result_errors:${safeErrors.join("|")}`);
  }
  return parts.join(";").slice(0, 600);
}

function routeBlocker(response) {
  if (!response || response.statusCode === 0) return "vcptoolbox_route_unreachable";
  if (response.statusCode === 401) return "vcptoolbox_admin_basic_auth_required";
  const body = response.body || {};
  const result = body.result || {};
  const errors = Array.isArray(result.errors) ? result.errors.join("; ") : "";
  const text = `${result.error || ""} ${body.error || ""} ${result.status || ""} ${errors}`;
  if (text.includes("image size must be at least 3686400")) {
    return "vcptoolbox_route_doubaogen_invalid_size_min_3686400";
  }
  if (text.includes("请求超时(12分钟)") || text.includes("请求超时(4分钟)")) {
    return "vcptoolbox_route_doubaogen_timeout_12m";
  }
  if (text.includes("DoubaoGen Plugin Error")) {
    return "vcptoolbox_route_doubaogen_plugin_error";
  }
  const baseBlocker = sanitizeRouteText(result.error || body.error || result.status) ||
    "vcptoolbox_route_execution_failed_closed";
  return `${baseBlocker}::${summarizeRouteFailure(response)}`;
}

function routeLikelyContactedProvider(response) {
  const result = response && response.body && response.body.result ? response.body.result : {};
  const errors = Array.isArray(result.errors) ? result.errors.join("; ") : "";
  return errors.includes("Request id:") ||
    errors.includes("DoubaoGen Plugin Error") ||
    errors.includes("API");
}

async function realBoundOwnerRuntimeDelegate(request, options = {}) {
  const issues = secretlessBridge.validateSecretlessProviderRuntimeRequest(request);
  if (issues.length > 0) {
    return failClosed("real_bound_owner_runtime_request_invalid");
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

  const authHeader = buildBasicAuthHeader(options.env || process.env);
  if (!authHeader) {
    return failClosed("vcptoolbox_admin_basic_auth_env_missing");
  }

  const output = repoRelativePath(request.output_directory_ref, "output directory");
  fs.mkdirSync(output.resolved, { recursive: true });

  const response = await postJson(options.routeUrl || defaultRouteUrl, routeRequestBody({
    prompt,
    model: request.model,
    outputDirectory: request.output_directory_ref,
  }), {
    Authorization: authHeader,
  });

  if (!response.ok || !response.body || response.body.ok !== true) {
    const contactedProvider = routeLikelyContactedProvider(response);
    return failClosed(routeBlocker(response), {
      provider_contact_performed: contactedProvider,
      plugin_call_performed: response.statusCode !== 401 && response.statusCode !== 0,
      api_call_performed: contactedProvider,
      calls_used: contactedProvider
        ? { provider: 1, plugin: 1, api: 1 }
        : { provider: 0, plugin: response.statusCode !== 401 && response.statusCode !== 0 ? 1 : 0, api: 0 },
    });
  }

  const outputRef = candidateImageRef(response.body, request.output_directory_ref);
  if (!outputRef) {
    return failClosed("vcptoolbox_route_output_file_missing", {
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
    return failClosed("vcptoolbox_route_output_file_invalid", {
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
      delegateOwner: "agent_image_lab_runtime_v1_vcptoolbox_route_owner_runtime",
      delegateAuthorizationRef: secretlessBridge.EXPECTED_DELEGATE_AUTHORIZATION_REF,
      delegateAuthorizationStatus: secretlessBridge.EXPECTED_DELEGATE_AUTHORIZATION_STATUS,
    }
  );
}

module.exports = createSecretlessProviderRuntime;
module.exports.moduleId = moduleId;
module.exports.createSecretlessProviderRuntime = createSecretlessProviderRuntime;
module.exports.realBoundOwnerRuntimeDelegate = realBoundOwnerRuntimeDelegate;
module.exports.inspectRouteOwnerRuntimeReadiness = inspectRouteOwnerRuntimeReadiness;
module.exports.buildBasicAuthHeader = buildBasicAuthHeader;
module.exports.allowedOutputDirectory = allowedOutputDirectory;
module.exports.allowedPromptPackageRef = allowedPromptPackageRef;
module.exports.requiredModel = requiredModel;
module.exports.routeTaskId = routeTaskId;
module.exports.defaultRouteUrl = defaultRouteUrl;
module.exports.env_file_content_read_performed = false;
module.exports.secret_value_read_performed = false;
