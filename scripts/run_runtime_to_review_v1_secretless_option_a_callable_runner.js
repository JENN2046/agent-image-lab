#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");

const runnerId = "runtime_to_review_v1_secretless_option_a_callable_runner";
const exactActivationPackageId = "AUTH-DRAFT-SECRETLESS-SERUM-LIVE-PROBE-20260603-001";
const exactRouteHttpActivationPackageId = "AUTH-SECRETLESS-SERUM-LIVE-PROBE-20260603-003";
const exactRouteHttpActivationPackageIdAttempt004 = "AUTH-SECRETLESS-SERUM-LIVE-PROBE-20260603-004";
const exactRouteHttpActivationPackageIdAttempt005 = "AUTH-SECRETLESS-SERUM-LIVE-PROBE-20260603-005";
const exactRouteHttpActivationPackageIdAttempt006 = "AUTH-SECRETLESS-SERUM-LIVE-PROBE-20260603-006";
const exactRouteHttpActivationPackageIdAttempt007 = "AUTH-SECRETLESS-SERUM-LIVE-PROBE-20260603-007";
const exactConfirmationPhrase = "RUNTIME_TO_REVIEW_V1_SECRETLESS_SERUM_BOTTLE_ONE_PROVIDER_ONE_IMAGE";
const exactRouteHttpMethod = "POST";
const exactRouteHttpPath = "/admin_api/ai-image-agents/execute/serum-bottle-secretless";
const exactRouteHttpEndpointSource = "VCPToolBox bcb8219a server.js mounts /admin_api/ai-image-agents and routes/admin/aiImageAgents.js defines POST /execute/serum-bottle-secretless";
const exactRouteHttpPathAttempt005 = "/internal/ai-image-agents/execute/serum-bottle-secretless";
const exactRouteHttpEndpointSourceAttempt005 = "VCPToolBox f8ba23130f714e1e1d7641f5f89726846aaf8bb2 server.js mounts loopback-only /internal/ai-image-agents and routes/admin/aiImageAgents.js defines POST /execute/serum-bottle-secretless";
const exactRouteHttpEndpointSourceAttempt006 = "VCPToolBox d0d5c104ae741e7be993cf1c760126bea9a44567 server.js mounts loopback-only /internal/ai-image-agents, injects pluginManager and internal authorizer into routeOptions, and routes/admin/aiImageAgents.js defines POST /execute/serum-bottle-secretless";
const exactRouteHttpEndpointSourceAttempt007 = "VCPToolBox 0d10ff306b20abd1aac00389711f0a67d01ece58 mounts loopback-only /internal/ai-image-agents, requires NativeImageDelegateRegistry serum_bottle_secretless_doubao_v1, strict canonical secretless payload validation, route/runtime/delegate flags, and routes/admin/aiImageAgents.js defines POST /execute/serum-bottle-secretless";

const allowedNonSecretPayloadFields = Object.freeze([
  "task_id",
  "route_id",
  "target_product",
  "prompt_package_ref",
  "model_id",
  "max_provider_calls",
  "max_plugin_calls",
  "max_api_calls",
  "max_images",
  "retry_allowed",
  "receipt_ref",
  "artifact_record_ref",
  "output_directory_ref",
  "non_secret_payload_hash"
]);

const forbiddenPayloadKeysNormalized = Object.freeze([
  "adminusername",
  "adminpassword",
  "basicauthheader",
  "authorizationheader",
  "authorization",
  "basicauth",
  "auth",
  "bearertoken",
  "token",
  "secretenvvarvalue",
  "apikey",
  "accesstoken",
  "refreshtoken",
  "password",
  "cookie",
  "headers"
]);

const defaultInput = Object.freeze({
  activationPackageId: exactActivationPackageId,
  confirmationPhrase: exactConfirmationPhrase,
  taskId: "secretless_serum_live_probe_future_attempt",
  routeId: "vcptoolbox_option_a_secretless_internal_authorized_execution_interface",
  targetProduct: "premium_serum_bottle",
  promptPackageRef: "prompts/image_generation/product_lifestyle_premium_serum_bottle_v1.yaml",
  modelId: "doubao-seedream-5-0-260128",
  maxProviderCalls: 1,
  maxPluginCalls: 1,
  maxApiCalls: 1,
  maxImages: 1,
  retryAllowed: false,
  receiptRef: "reports/runtime_to_review_v1/secretless_serum_live_probe_receipt_FUTURE_ATTEMPT.json",
  artifactRecordRef: "reports/runtime_to_review_v1/secretless_serum_live_probe_artifact_record_FUTURE_ATTEMPT.json",
  outputDirectoryRef: "runs/real_generation/runtime_to_review_v1_guarded_live_probe_serum_bottle_secretless/"
});

const defaultRouteHttpInput = Object.freeze({
  activationPackageId: exactRouteHttpActivationPackageId,
  confirmationPhrase: exactConfirmationPhrase,
  routeHttpMethod: exactRouteHttpMethod,
  routeHttpPath: exactRouteHttpPath,
  routeHttpEndpointSource: exactRouteHttpEndpointSource,
  pipelineId: "secretless-serum-live-probe-attempt-003",
  taskId: exactRouteHttpActivationPackageId,
  routeId: "serum_bottle_vcptoolbox_route_owner_runtime",
  prompt: "premium serum bottle product image, clean cosmetic studio lighting, one bottle, no text overlay",
  modelId: "doubao-seedream-5-0-260128",
  maxProviderCalls: 1,
  maxPluginCalls: 1,
  maxApiCalls: 1,
  maxImages: 1,
  retryAllowed: false,
  receiptRef: "reports/runtime_to_review_v1/secretless_serum_live_probe_receipt_20260603_attempt_003.json",
  artifactRecordRef: "reports/runtime_to_review_v1/secretless_serum_live_probe_artifact_record_20260603_attempt_003.json",
  outputDirectoryRef: "runs/real_generation/runtime_to_review_v1_guarded_live_probe_serum_bottle_secretless_attempt_003/"
});

const defaultRouteHttpInputAttempt004 = Object.freeze({
  ...defaultRouteHttpInput,
  activationPackageId: exactRouteHttpActivationPackageIdAttempt004,
  pipelineId: "secretless-serum-live-probe-attempt-004",
  taskId: exactRouteHttpActivationPackageIdAttempt004,
  receiptRef: "reports/runtime_to_review_v1/secretless_serum_live_probe_receipt_20260603_attempt_004.json",
  artifactRecordRef: "reports/runtime_to_review_v1/secretless_serum_live_probe_artifact_record_20260603_attempt_004.json",
  outputDirectoryRef: "runs/real_generation/runtime_to_review_v1_guarded_live_probe_serum_bottle_secretless_attempt_004/"
});

const defaultRouteHttpInputAttempt005 = Object.freeze({
  ...defaultRouteHttpInput,
  activationPackageId: exactRouteHttpActivationPackageIdAttempt005,
  routeHttpPath: exactRouteHttpPathAttempt005,
  routeHttpEndpointSource: exactRouteHttpEndpointSourceAttempt005,
  pipelineId: "secretless-serum-live-probe-attempt-005",
  taskId: exactRouteHttpActivationPackageIdAttempt005,
  receiptRef: "reports/runtime_to_review_v1/secretless_serum_live_probe_receipt_20260603_attempt_005.json",
  artifactRecordRef: "reports/runtime_to_review_v1/secretless_serum_live_probe_artifact_record_20260603_attempt_005.json",
  outputDirectoryRef: "runs/real_generation/runtime_to_review_v1_guarded_live_probe_serum_bottle_secretless_attempt_005/"
});

const defaultRouteHttpInputAttempt006 = Object.freeze({
  ...defaultRouteHttpInputAttempt005,
  activationPackageId: exactRouteHttpActivationPackageIdAttempt006,
  routeHttpEndpointSource: exactRouteHttpEndpointSourceAttempt006,
  pipelineId: "secretless-serum-live-probe-attempt-006",
  taskId: exactRouteHttpActivationPackageIdAttempt006,
  receiptRef: "reports/runtime_to_review_v1/secretless_serum_live_probe_receipt_20260603_attempt_006.json",
  artifactRecordRef: "reports/runtime_to_review_v1/secretless_serum_live_probe_artifact_record_20260603_attempt_006.json",
  outputDirectoryRef: "runs/real_generation/runtime_to_review_v1_guarded_live_probe_serum_bottle_secretless_attempt_006/"
});

const defaultRouteHttpInputAttempt007 = Object.freeze({
  ...defaultRouteHttpInputAttempt006,
  activationPackageId: exactRouteHttpActivationPackageIdAttempt007,
  routeHttpEndpointSource: exactRouteHttpEndpointSourceAttempt007,
  pipelineId: "secretless-serum-live-probe-attempt-007",
  taskId: exactRouteHttpActivationPackageIdAttempt007,
  receiptRef: "reports/runtime_to_review_v1/secretless_serum_live_probe_receipt_20260603_attempt_007.json",
  artifactRecordRef: "reports/runtime_to_review_v1/secretless_serum_live_probe_artifact_record_20260603_attempt_007.json",
  outputDirectoryRef: "runs/real_generation/runtime_to_review_v1_guarded_live_probe_serum_bottle_secretless_attempt_007/"
});

const allowedExactRouteHttpActivationPackageIds = Object.freeze([
  exactRouteHttpActivationPackageId,
  exactRouteHttpActivationPackageIdAttempt004,
  exactRouteHttpActivationPackageIdAttempt005,
  exactRouteHttpActivationPackageIdAttempt006,
  exactRouteHttpActivationPackageIdAttempt007
]);

function routeHttpDefaultsForActivationPackage(activationPackageId) {
  if (activationPackageId === exactRouteHttpActivationPackageIdAttempt007) {
    return defaultRouteHttpInputAttempt007;
  }
  if (activationPackageId === exactRouteHttpActivationPackageIdAttempt006) {
    return defaultRouteHttpInputAttempt006;
  }
  if (activationPackageId === exactRouteHttpActivationPackageIdAttempt005) {
    return defaultRouteHttpInputAttempt005;
  }
  if (activationPackageId === exactRouteHttpActivationPackageIdAttempt004) {
    return defaultRouteHttpInputAttempt004;
  }
  return defaultRouteHttpInput;
}

function normalizePayloadKey(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]/g, "");
}

function canonicalJson(value) {
  if (Array.isArray(value)) {
    return `[${value.map((item) => canonicalJson(item)).join(",")}]`;
  }
  if (value && typeof value === "object") {
    const keys = Object.keys(value).sort();
    return `{${keys.map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function valueFor(input, camelName, snakeName) {
  if (Object.prototype.hasOwnProperty.call(input, camelName)) return input[camelName];
  if (Object.prototype.hasOwnProperty.call(input, snakeName)) return input[snakeName];
  return defaultInput[camelName];
}

function hashPayload(payloadWithoutHash) {
  return crypto.createHash("sha256").update(canonicalJson(payloadWithoutHash)).digest("hex");
}

function buildNonSecretPayload(input = {}) {
  const payloadWithoutHash = {
    task_id: valueFor(input, "taskId", "task_id"),
    route_id: valueFor(input, "routeId", "route_id"),
    target_product: valueFor(input, "targetProduct", "target_product"),
    prompt_package_ref: valueFor(input, "promptPackageRef", "prompt_package_ref"),
    model_id: valueFor(input, "modelId", "model_id"),
    max_provider_calls: valueFor(input, "maxProviderCalls", "max_provider_calls"),
    max_plugin_calls: valueFor(input, "maxPluginCalls", "max_plugin_calls"),
    max_api_calls: valueFor(input, "maxApiCalls", "max_api_calls"),
    max_images: valueFor(input, "maxImages", "max_images"),
    retry_allowed: valueFor(input, "retryAllowed", "retry_allowed"),
    receipt_ref: valueFor(input, "receiptRef", "receipt_ref"),
    artifact_record_ref: valueFor(input, "artifactRecordRef", "artifact_record_ref"),
    output_directory_ref: valueFor(input, "outputDirectoryRef", "output_directory_ref")
  };
  return {
    ...payloadWithoutHash,
    non_secret_payload_hash: hashPayload(payloadWithoutHash)
  };
}

function buildExactRouteHttpBody(input = {}) {
  const bodyWithoutHash = {
    pipeline_id: valueFor(input, "pipelineId", "pipeline_id"),
    task_id: valueFor(input, "taskId", "task_id"),
    route_id: valueFor(input, "routeId", "route_id"),
    max_provider_calls: valueFor(input, "maxProviderCalls", "max_provider_calls"),
    max_plugin_calls: valueFor(input, "maxPluginCalls", "max_plugin_calls"),
    max_api_calls: valueFor(input, "maxApiCalls", "max_api_calls"),
    max_images: valueFor(input, "maxImages", "max_images"),
    retry_allowed: valueFor(input, "retryAllowed", "retry_allowed"),
    receipt_ref: valueFor(input, "receiptRef", "receipt_ref"),
    artifact_record_ref: valueFor(input, "artifactRecordRef", "artifact_record_ref"),
    plan: {
      steps: [
        {
          type: "generate_image",
          plugin: "DoubaoGen",
          prompt: valueFor(input, "prompt", "prompt"),
          model: valueFor(input, "modelId", "model_id"),
          output_directory_ref: valueFor(input, "outputDirectoryRef", "output_directory_ref")
        }
      ]
    }
  };
  return {
    ...bodyWithoutHash,
    non_secret_payload_hash: hashPayload(bodyWithoutHash)
  };
}

function collectForbiddenPayloadKeys(body, rootPath = "body") {
  const found = [];

  function visit(node, currentPath) {
    if (Array.isArray(node)) {
      node.forEach((item, index) => visit(item, `${currentPath}[${index}]`));
      return;
    }
    if (!node || typeof node !== "object") return;

    Object.entries(node).forEach(([key, value]) => {
      const keyPath = `${currentPath}.${key}`;
      const normalizedKey = normalizePayloadKey(key);
      if (forbiddenPayloadKeysNormalized.includes(normalizedKey)) {
        found.push({ path: keyPath, key, normalized_key: normalizedKey });
      }
      visit(value, keyPath);
    });
  }

  visit(body, rootPath);
  return found;
}

function baseBoundary() {
  return {
    route_http_request_performed: false,
    live_probe_performed: false,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    image_count: 0,
    output_write_performed: false,
    output_refs: [],
    secret_value_read_performed: false,
    env_file_content_read_performed: false,
    config_env_read_performed: false,
    authorization_header_constructed_by_agent_image_lab: false,
    authorizer_call_count: 0,
    executor_call_count: 0,
    retry_performed: false,
    calls_used: {
      provider: 0,
      plugin: 0,
      api: 0,
      image: 0,
      route_http_request: 0
    }
  };
}

function validateRunnerInput(input = {}) {
  const body = input.body || input.payload || buildNonSecretPayload(input);
  const payload = input.payload || (input.body ? null : buildNonSecretPayload(input));
  const forbiddenPayloadKeys = collectForbiddenPayloadKeys(body);
  const payloadKeys = payload ? Object.keys(payload) : Object.keys(body || {});
  const unknownPayloadKeys = payloadKeys.filter((key) => !allowedNonSecretPayloadFields.includes(key));
  const missingPayloadKeys = allowedNonSecretPayloadFields.filter((key) => !payloadKeys.includes(key));
  const failures = [];
  const boundary = baseBoundary();
  const routeHttpRequested = Boolean(input.confirmRouteHttp || input.allowRouteHttp || input.routeHttpRequested);

  if (forbiddenPayloadKeys.length > 0) {
    failures.push({
      status: "secretless_option_a_payload_contains_forbidden_secret_key",
      reason: "payload contains a forbidden secret-bearing key",
      forbiddenPayloadKeys
    });
  }
  if (unknownPayloadKeys.length > 0) {
    failures.push({
      status: "secretless_option_a_payload_contains_unknown_key",
      reason: "payload contains fields outside the exact non-secret allowlist",
      unknownPayloadKeys
    });
  }
  if (missingPayloadKeys.length > 0) {
    failures.push({
      status: "secretless_option_a_payload_missing_required_key",
      reason: "payload is missing required non-secret fields",
      missingPayloadKeys
    });
  }
  if (payload) {
    const expectedHash = hashPayload(Object.fromEntries(
      Object.entries(payload).filter(([key]) => key !== "non_secret_payload_hash")
    ));
    if (payload.non_secret_payload_hash !== expectedHash) {
      failures.push({
        status: "secretless_option_a_payload_hash_mismatch",
        reason: "non-secret payload hash does not match payload content"
      });
    }
    if (
      payload.max_provider_calls !== 1 ||
      payload.max_plugin_calls !== 1 ||
      payload.max_api_calls !== 1 ||
      payload.max_images !== 1 ||
      payload.retry_allowed !== false
    ) {
      failures.push({
        status: "secretless_option_a_budget_drift",
        reason: "budget must remain one provider / one plugin / one API / one image / no retry"
      });
    }
  }
  if (routeHttpRequested) {
    failures.push({
      status: "secretless_option_a_route_http_not_allowed_by_current_task",
      reason: "current local runner implementation task does not authorize route HTTP"
    });
  }

  const firstFailure = failures[0];
  return {
    ok: failures.length === 0,
    status: firstFailure ? firstFailure.status : "secretless_option_a_callable_runner_input_validated",
    reason: firstFailure ? firstFailure.reason : "input validates for local preflight-only runner path",
    runner_id: runnerId,
    activation_package_id: input.activationPackageId || defaultInput.activationPackageId,
    confirmation_phrase_received: input.confirmationPhrase || defaultInput.confirmationPhrase,
    allowed_non_secret_payload_fields: [...allowedNonSecretPayloadFields],
    forbidden_payload_keys_detected: forbiddenPayloadKeys,
    failures,
    payload,
    ...boundary
  };
}

function normalizeRouteHttpOrigin(value) {
  if (typeof value !== "string" || !value.trim()) return null;
  const trimmed = value.trim().replace(/\/+$/, "");
  const parsed = new URL(trimmed);
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error("routeHttpOrigin must use http or https");
  }
  if (parsed.pathname !== "/" || parsed.search || parsed.hash) {
    throw new Error("routeHttpOrigin must be an origin only");
  }
  return parsed.origin;
}

function validateExactRouteHttpTransportInput(input = {}) {
  const routeHttpDefaults = routeHttpDefaultsForActivationPackage(input.activationPackageId);
  const body = input.body || input.payload || buildExactRouteHttpBody({
    ...routeHttpDefaults,
    ...input
  });
  const forbiddenPayloadKeys = collectForbiddenPayloadKeys(body);
  const failures = [];
  const boundary = baseBoundary();
  const expectedMethod = routeHttpDefaults.routeHttpMethod || exactRouteHttpMethod;
  const expectedPath = routeHttpDefaults.routeHttpPath || exactRouteHttpPath;
  const expectedEndpointSource = routeHttpDefaults.routeHttpEndpointSource || exactRouteHttpEndpointSource;
  const method = input.routeHttpMethod || input.method || expectedMethod;
  const pathValue = input.routeHttpPath || input.path || expectedPath;
  let origin = null;

  try {
    origin = normalizeRouteHttpOrigin(input.routeHttpOrigin || input.origin);
  } catch (error) {
    failures.push({
      status: "secretless_option_a_route_http_origin_invalid",
      reason: error.message
    });
  }

  if (!origin) {
    failures.push({
      status: "secretless_option_a_route_http_origin_missing",
      reason: "exact route HTTP origin must be provided by a new activation; runner must not guess host or port"
    });
  }
  if (!allowedExactRouteHttpActivationPackageIds.includes(input.activationPackageId)) {
    failures.push({
      status: "secretless_option_a_activation_package_mismatch",
      reason: "route HTTP transport requires an allowed exact activation package"
    });
  }
  if (input.confirmationPhrase !== exactConfirmationPhrase) {
    failures.push({
      status: "secretless_option_a_confirmation_phrase_missing",
      reason: "exact owner confirmation phrase is required"
    });
  }
  if (method !== expectedMethod) {
    failures.push({
      status: "secretless_option_a_route_http_method_mismatch",
      reason: "route HTTP method must match the activation-specific VCPToolBox route evidence"
    });
  }
  if (pathValue !== expectedPath) {
    failures.push({
      status: "secretless_option_a_route_http_path_mismatch",
      reason: "route HTTP path must match the activation-specific VCPToolBox route evidence"
    });
  }
  if (forbiddenPayloadKeys.length > 0) {
    failures.push({
      status: "secretless_option_a_payload_contains_forbidden_secret_key",
      reason: "payload contains a forbidden secret-bearing key",
      forbiddenPayloadKeys
    });
  }
  if (
    body.route_id !== "serum_bottle_vcptoolbox_route_owner_runtime" &&
    body.route_id !== "serum_bottle_secretless_option_a" &&
    body.route_id !== "secretless_serum_option_a"
  ) {
    failures.push({
      status: "secretless_option_a_route_scope_not_authorized",
      reason: "route_id is not one of the VCPToolBox bcb8219a secretless serum route ids"
    });
  }
  if (
    body.max_provider_calls !== 1 ||
    body.max_plugin_calls !== 1 ||
    body.max_api_calls !== 1 ||
    body.max_images !== 1 ||
    body.retry_allowed !== false
  ) {
    failures.push({
      status: "secretless_option_a_budget_drift",
      reason: "budget must remain one provider / one plugin / one API / one image / no retry"
    });
  }
  const steps = Array.isArray(body.plan && body.plan.steps) ? body.plan.steps : [];
  if (
    steps.length !== 1 ||
    !steps[0] ||
    steps[0].plugin !== "DoubaoGen" ||
    steps[0].type !== "generate_image"
  ) {
    failures.push({
      status: "secretless_option_a_plugin_scope_not_authorized",
      reason: "plan.steps must contain exactly one DoubaoGen generate_image step"
    });
  }

  return {
    ok: failures.length === 0,
    status: failures[0] ? failures[0].status : "secretless_option_a_route_http_transport_input_validated",
    reason: failures[0] ? failures[0].reason : "input validates for exact route HTTP transport",
    runner_id: runnerId,
    activation_package_id: input.activationPackageId || null,
    confirmation_phrase_received: input.confirmationPhrase || null,
    route_http_method: method,
    route_http_path: pathValue,
    route_http_origin: origin,
    route_http_url: origin ? `${origin}${pathValue}` : null,
    endpoint_source: expectedEndpointSource,
    forbidden_payload_keys_detected: forbiddenPayloadKeys,
    failures,
    body,
    ...boundary
  };
}

function runSecretlessOptionACallableRunner(input = {}) {
  const preflightOnly = Boolean(input.preflightOnly);
  const validation = validateRunnerInput(input);
  const boundary = baseBoundary();

  if (!validation.ok) {
    return {
      ok: false,
      passed: false,
      runner_id: runnerId,
      status: validation.status,
      result: {
        status: validation.status,
        reason: validation.reason,
        validation,
        ...boundary
      },
      ...boundary
    };
  }

  if (preflightOnly) {
    return {
      ok: true,
      passed: true,
      runner_id: runnerId,
      status: "secretless_option_a_callable_runner_preflight_only_passed_no_route_http",
      result: {
        status: "secretless_option_a_callable_runner_preflight_only_passed_no_route_http",
        payload: validation.payload,
        validation,
        ...boundary
      },
      ...boundary
    };
  }

  return {
    ok: false,
    passed: false,
    runner_id: runnerId,
    status: "secretless_option_a_callable_runner_failed_closed_route_http_not_authorized",
    result: {
      status: "secretless_option_a_callable_runner_failed_closed_route_http_not_authorized",
      reason: "current task implemented the local runner surface only; route HTTP requires a new exact activation and explicit callable binding",
      validation,
      ...boundary
    },
    ...boundary
  };
}

async function runSecretlessOptionAExactRouteHttpTransport(input = {}) {
  const validation = validateExactRouteHttpTransportInput(input);
  const boundary = baseBoundary();

  if (!validation.ok) {
    return {
      ok: false,
      passed: false,
      runner_id: runnerId,
      status: validation.status,
      result: {
        status: validation.status,
        reason: validation.reason,
        validation,
        ...boundary
      },
      ...boundary
    };
  }

  const response = await fetch(validation.route_http_url, {
    method: exactRouteHttpMethod,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(validation.body)
  });
  const text = await response.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch (error) {
    json = {
      parse_error: error instanceof Error ? error.message : String(error),
      raw_text: text
    };
  }

  return {
    ok: response.ok && json && json.ok === true,
    passed: response.ok && json && json.ok === true,
    runner_id: runnerId,
    status: response.ok ? "secretless_option_a_route_http_response_received" : "secretless_option_a_route_http_response_not_ok",
    route_http_request_performed: true,
    live_probe_performed: true,
    provider_contact_performed: Boolean(json && json.result && json.result.provider_contact_performed),
    plugin_call_performed: Boolean(json && json.result && json.result.plugin_call_performed),
    api_call_performed: Boolean(json && json.result && json.result.api_call_performed),
    image_generation_performed: Boolean(json && json.result && json.result.image_generation_performed),
    image_count: Number(json && json.result && json.result.image_count) || 0,
    output_write_performed: Boolean(json && json.result && json.result.output_write_performed),
    output_refs: Array.isArray(json && json.result && json.result.output_refs) ? json.result.output_refs : [],
    secret_value_read_performed: false,
    env_file_content_read_performed: false,
    config_env_read_performed: false,
    authorization_header_constructed_by_agent_image_lab: false,
    authorizer_call_count: 0,
    executor_call_count: 0,
    retry_performed: false,
    calls_used: {
      provider: Boolean(json && json.result && json.result.provider_contact_performed) ? 1 : 0,
      plugin: Boolean(json && json.result && json.result.plugin_call_performed) ? 1 : 0,
      api: Boolean(json && json.result && json.result.api_call_performed) ? 1 : 0,
      image: Number(json && json.result && json.result.image_count) || 0,
      route_http_request: 1
    },
    result: json,
    validation
  };
}

function parseArgs(argv) {
  const input = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--preflight-only") {
      input.preflightOnly = true;
    } else if (arg === "--confirm-route-http" || arg === "--allow-route-http") {
      input.confirmRouteHttp = true;
    } else if (arg === "--activation-package-id") {
      input.activationPackageId = argv[index + 1];
      index += 1;
    } else if (arg === "--confirmation-phrase") {
      input.confirmationPhrase = argv[index + 1];
      index += 1;
    } else if (arg === "--model-id") {
      input.modelId = argv[index + 1];
      index += 1;
    } else if (arg === "--receipt-ref") {
      input.receiptRef = argv[index + 1];
      index += 1;
    } else if (arg === "--artifact-record-ref") {
      input.artifactRecordRef = argv[index + 1];
      index += 1;
    } else if (arg === "--output-directory-ref") {
      input.outputDirectoryRef = argv[index + 1];
      index += 1;
    } else if (arg === "--payload-json") {
      input.body = JSON.parse(argv[index + 1]);
      index += 1;
    } else if (arg === "--attempt-003-route-http") {
      input.attempt003RouteHttp = true;
    } else if (arg === "--attempt-004-route-http") {
      input.attempt004RouteHttp = true;
    } else if (arg === "--attempt-005-route-http") {
      input.attempt005RouteHttp = true;
    } else if (arg === "--attempt-006-route-http") {
      input.attempt006RouteHttp = true;
    } else if (arg === "--attempt-007-route-http") {
      input.attempt007RouteHttp = true;
    } else if (arg === "--route-http-origin") {
      input.routeHttpOrigin = argv[index + 1];
      index += 1;
    } else if (arg === "--route-http-method") {
      input.routeHttpMethod = argv[index + 1];
      index += 1;
    } else if (arg === "--route-http-path") {
      input.routeHttpPath = argv[index + 1];
      index += 1;
    } else if (arg === "--prompt") {
      input.prompt = argv[index + 1];
      index += 1;
    } else if (arg === "--pipeline-id") {
      input.pipelineId = argv[index + 1];
      index += 1;
    } else if (arg === "--task-id") {
      input.taskId = argv[index + 1];
      index += 1;
    }
  }
  return input;
}

if (require.main === module) {
  const input = parseArgs(process.argv.slice(2));
  const run = input.attempt003RouteHttp || input.attempt004RouteHttp || input.attempt005RouteHttp || input.attempt006RouteHttp || input.attempt007RouteHttp
    ? runSecretlessOptionAExactRouteHttpTransport(input)
    : Promise.resolve(runSecretlessOptionACallableRunner(input));
  run.then((result) => {
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    if (!result.passed) process.exitCode = 1;
  }).catch((error) => {
    process.stdout.write(`${JSON.stringify({
      ok: false,
      passed: false,
      runner_id: runnerId,
      status: "secretless_option_a_callable_runner_unhandled_error",
      error: error instanceof Error ? error.message : String(error),
      ...baseBoundary()
    }, null, 2)}\n`);
    process.exitCode = 1;
  });
}

module.exports = {
  runnerId,
  exactActivationPackageId,
  exactRouteHttpActivationPackageId,
  exactRouteHttpActivationPackageIdAttempt004,
  exactRouteHttpActivationPackageIdAttempt005,
  exactRouteHttpActivationPackageIdAttempt006,
  exactRouteHttpActivationPackageIdAttempt007,
  exactConfirmationPhrase,
  exactRouteHttpMethod,
  exactRouteHttpPath,
  exactRouteHttpEndpointSource,
  exactRouteHttpPathAttempt005,
  exactRouteHttpEndpointSourceAttempt005,
  exactRouteHttpEndpointSourceAttempt006,
  exactRouteHttpEndpointSourceAttempt007,
  defaultInput,
  defaultRouteHttpInput,
  defaultRouteHttpInputAttempt004,
  defaultRouteHttpInputAttempt005,
  defaultRouteHttpInputAttempt006,
  defaultRouteHttpInputAttempt007,
  allowedExactRouteHttpActivationPackageIds,
  allowedNonSecretPayloadFields,
  forbiddenPayloadKeysNormalized,
  normalizePayloadKey,
  collectForbiddenPayloadKeys,
  buildNonSecretPayload,
  buildExactRouteHttpBody,
  validateRunnerInput,
  validateExactRouteHttpTransportInput,
  runSecretlessOptionACallableRunner,
  runSecretlessOptionAExactRouteHttpTransport
};
