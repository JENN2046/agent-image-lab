#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");

const runnerId = "runtime_to_review_v1_secretless_option_a_callable_runner";
const exactActivationPackageId = "AUTH-DRAFT-SECRETLESS-SERUM-LIVE-PROBE-20260603-001";
const exactConfirmationPhrase = "RUNTIME_TO_REVIEW_V1_SECRETLESS_SERUM_BOTTLE_ONE_PROVIDER_ONE_IMAGE";

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
    }
  }
  return input;
}

if (require.main === module) {
  const result = runSecretlessOptionACallableRunner(parseArgs(process.argv.slice(2)));
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  if (!result.passed) process.exitCode = 1;
}

module.exports = {
  runnerId,
  exactActivationPackageId,
  exactConfirmationPhrase,
  defaultInput,
  allowedNonSecretPayloadFields,
  forbiddenPayloadKeysNormalized,
  normalizePayloadKey,
  collectForbiddenPayloadKeys,
  buildNonSecretPayload,
  validateRunnerInput,
  runSecretlessOptionACallableRunner
};
