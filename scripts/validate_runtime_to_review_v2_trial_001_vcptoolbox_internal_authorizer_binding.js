#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const validator = "runtime_to_review_v2_trial_001_vcptoolbox_internal_authorizer_binding";
const vcpToolBoxRoot = "A:/VCP/apps/VCPToolBox";
const serverPath = "server.js";
const routePath = "routes/admin/aiImageAgents.js";
const adapterPath = "adapters/runtime/native_doubao_runtime_v2_trial_001_serum_detail_broker_dispatch_adapter.js";

let passed = true;
const results = [];

function repoPath(relativePath) {
  const resolved = path.resolve(root, relativePath);
  const relative = path.relative(root, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`path escapes repo root: ${relativePath}`);
  }
  return resolved;
}

function vcpPath(relativePath) {
  const resolved = path.resolve(vcpToolBoxRoot, relativePath);
  const relative = path.relative(vcpToolBoxRoot, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`path escapes VCPToolBox root: ${relativePath}`);
  }
  return resolved;
}

function runNodeCheck(cwd, relativePath) {
  childProcess.execFileSync(process.execPath, ["--check", relativePath], {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  return true;
}

async function check(id, fn) {
  try {
    const ok = await fn();
    results.push({ check: id, passed: Boolean(ok) });
    if (!ok) passed = false;
  } catch (error) {
    results.push({ check: id, passed: false, error: error.message });
    passed = false;
  }
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function fakeOptions(overrides = {}) {
  return {
    enableAiImageRealExecution: true,
    enableNativeDoubaoSecretlessRuntimeDelegate: true,
    nativeImageDelegateRegistry: {
      hasCallable(delegateId) {
        return delegateId === "serum_bottle_secretless_doubao_v1";
      },
      async invokeBoundDelegate() {
        throw new Error("validator_should_not_invoke_delegate");
      },
    },
    authorizeSerumBottleSecretlessExecution(request) {
      if (
        request.mode === "r2r_v2_trial_001_serum_detail_control_secretless_internal_execute" &&
        request.activationPackageId === "AUTH-R2R-V2-TRIAL-001-SERUM-DETAIL-CONTROL-20260608-FUTURE-EXECUTION" &&
        request.taskId === "AUTH-R2R-V2-TRIAL-001-SERUM-DETAIL-CONTROL-20260608-FUTURE-EXECUTION" &&
        request.pipelineId === "runtime_to_review_v2_trial_001_serum_detail_control" &&
        request.routeId === "r2r_v2_trial_001_serum_detail_control_secretless" &&
        request.receiptRef === "reports/runtime_to_review_v2/r2r_v2_trial_001_serum_detail_control_receipt.json" &&
        request.artifactRecordRef === "reports/runtime_to_review_v2/r2r_v2_trial_001_serum_detail_control_artifact_record.json" &&
        request.outputDirectoryRef === "runs/real_generation/runtime_to_review_v2_trial_001_serum_detail_control/" &&
        request.budget.maxProviderCalls === 1 &&
        request.budget.maxPluginCalls === 1 &&
        request.budget.maxApiCalls === 1 &&
        request.budget.maxImages === 1 &&
        request.budget.retryAllowed === false &&
        typeof request.nonSecretPayloadHash === "string" &&
        request.nonSecretPayloadHash.length > 0
      ) {
        return {
          ok: true,
          operatorId: "validator-r2r-v2-trial-001-secretless-internal",
          authorizationId: "validator-r2r-v2-trial-001-secretless-auth",
          receiptId: request.receiptRef,
        };
      }
      return { ok: false };
    },
    ...overrides,
  };
}

async function main() {
  const serverSource = fs.readFileSync(vcpPath(serverPath), "utf8");
  const routeSource = fs.readFileSync(vcpPath(routePath), "utf8");
  const adapter = require(repoPath(adapterPath));
  const routeModule = require(vcpPath(routePath));
  const body = adapter._private.routeRequestBody({
    prompt: "PROMPT_PLACEHOLDER",
    model: adapter.requiredModel,
    outputDirectory: adapter.allowedOutputDirectory,
  });

  await check("vcptoolbox_files_exist_and_syntax_clean", () =>
    fs.existsSync(vcpPath(serverPath)) &&
    fs.existsSync(vcpPath(routePath)) &&
    runNodeCheck(vcpToolBoxRoot, serverPath) &&
    runNodeCheck(vcpToolBoxRoot, routePath)
  );
  await check("server_bearer_middleware_skips_exact_loopback_post_to_route_authorizer", () =>
    serverSource.includes("R2R_V2_TRIAL_001_SECRETLESS_INTERNAL_ROUTE_PATH") &&
    serverSource.includes("/internal/ai-image-agents/execute/r2r-v2-trial-001-serum-detail-control") &&
    serverSource.includes("(req.method === 'HEAD' || req.method === 'POST') && isLoopbackSocket(req)") &&
    serverSource.includes("authorizeRuntimeToReviewV2Trial001SecretlessExecution")
  );
  await check("route_mounts_trial_001_restricted_facade", () =>
    routeSource.includes("handleRuntimeToReviewV2Trial001ExecutionRequest") &&
    routeSource.includes("validateRuntimeToReviewV2Trial001ExecutionRequest") &&
    routeSource.includes("r2r_v2_trial_001_serum_detail_control_secretless_internal_execute") &&
    routeSource.includes("R2R_V2_TRIAL_001_EXACT_REVIEW_BRIDGE_REF")
  );
  await check("valid_trial_001_body_passes_exact_route_validation", () => {
    const routeInput = routeModule.normalizeRouteInput(body);
    const result = routeModule.validateRuntimeToReviewV2Trial001ExecutionRequest(body, routeInput, fakeOptions());
    return result.ok === true &&
      result.activationPackageId === "AUTH-R2R-V2-TRIAL-001-SERUM-DETAIL-CONTROL-20260608-FUTURE-EXECUTION" &&
      result.routeId === "r2r_v2_trial_001_serum_detail_control_secretless" &&
      result.outputDirectoryRef === "runs/real_generation/runtime_to_review_v2_trial_001_serum_detail_control/" &&
      result.budget.maxProviderCalls === 1 &&
      result.budget.maxPluginCalls === 1 &&
      result.budget.maxApiCalls === 1 &&
      result.budget.maxImages === 1 &&
      result.budget.retryAllowed === false;
  });
  await check("forbidden_auth_like_payload_fails_before_authorizer", () => {
    const bad = clone(body);
    bad.headers = { Authorization: "Bearer should-not-be-here" };
    const routeInput = routeModule.normalizeRouteInput(bad);
    const result = routeModule.validateRuntimeToReviewV2Trial001ExecutionRequest(bad, routeInput, fakeOptions());
    return result.ok === false &&
      result.status === "r2r_v2_trial_001_payload_contains_forbidden_secret_key";
  });
  await check("wrong_activation_fails_exact_binding", () => {
    const bad = clone(body);
    bad.activation.activation_package_id = "AUTH-R2R-V2-TRIAL-001-DRIFT";
    const routeInput = routeModule.normalizeRouteInput(bad);
    const result = routeModule.validateRuntimeToReviewV2Trial001ExecutionRequest(bad, routeInput, fakeOptions());
    return result.ok === false &&
      result.status === "r2r_v2_trial_001_exact_activation_binding_mismatch";
  });
  await check("wrong_output_fails_exact_binding", () => {
    const bad = clone(body);
    bad.visual_job_contract.output_directory_ref = "runs/real_generation/runtime_to_review_v2_trial_001_other/";
    const routeInput = routeModule.normalizeRouteInput(bad);
    const result = routeModule.validateRuntimeToReviewV2Trial001ExecutionRequest(bad, routeInput, fakeOptions());
    return result.ok === false &&
      result.status === "r2r_v2_trial_001_output_directory_ref_invalid";
  });
  await check("wrong_budget_fails_before_execution", () => {
    const bad = clone(body);
    bad.activation.max_images = 2;
    const routeInput = routeModule.normalizeRouteInput(bad);
    const result = routeModule.validateRuntimeToReviewV2Trial001ExecutionRequest(bad, routeInput, fakeOptions());
    return result.ok === false &&
      result.status === "r2r_v2_trial_001_budget_not_exact";
  });
  await check("missing_delegate_registry_fails_closed", () => {
    const routeInput = routeModule.normalizeRouteInput(body);
    const result = routeModule.validateRuntimeToReviewV2Trial001ExecutionRequest(body, routeInput, fakeOptions({
      nativeImageDelegateRegistry: null,
    }));
    return result.ok === false &&
      result.status === "r2r_v2_trial_001_native_delegate_registry_missing";
  });
  await check("route_handler_denies_when_internal_authorizer_denies_without_delegate_call", async () => {
    const response = await routeModule.handleRuntimeToReviewV2Trial001ExecutionRequest({
      body,
      ip: "127.0.0.1",
      socket: { remoteAddress: "127.0.0.1" },
    }, fakeOptions({
      authorizeSerumBottleSecretlessExecution() {
        return { ok: false };
      },
    }));
    return response.ok === false &&
      response.result.status === "r2r_v2_trial_001_internal_authorization_denied" &&
      response.result.provider_contact_performed === false &&
      response.result.api_call_performed === false &&
      response.result.image_generation_performed === false &&
      response.result.authorization_header_constructed === false;
  });
}

Promise.resolve()
  .then(main)
  .then(() => {
    const output = {
      passed,
      validator,
      vcp_toolbox_root: vcpToolBoxRoot,
      check_count: results.length,
      failed_count: results.filter((result) => !result.passed).length,
      route_http_request_performed: false,
      provider_contact_performed: false,
      plugin_call_performed: false,
      api_call_performed: false,
      image_generation_performed: false,
      secret_value_read_performed: false,
      authorization_header_constructed_by_agent_image_lab: false,
      results,
    };
    process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
    if (!passed) process.exitCode = 1;
  })
  .catch((error) => {
    process.stdout.write(`${JSON.stringify({
      passed: false,
      validator,
      error: error.message,
      results,
    }, null, 2)}\n`);
    process.exitCode = 1;
  });
