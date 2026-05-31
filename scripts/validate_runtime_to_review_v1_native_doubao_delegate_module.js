#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const validatorId = "runtime_to_review_v1_native_doubao_delegate_module";
const delegatePath = "adapters/runtime/native_doubao_runtime_v1_provider_delegate.js";
const liveProbeRunnerPath = "scripts/run_runtime_to_review_v1_guarded_live_probe.js";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function repoPath(relativePath) {
  const resolved = path.resolve(root, relativePath);
  const relative = path.relative(root, resolved);
  assert(!relative.startsWith("..") && !path.isAbsolute(relative), `path escapes repository: ${relativePath}`);
  return resolved;
}

function runNode(args, allowFailure = false) {
  try {
    return childProcess.execFileSync(process.execPath, args, {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
  } catch (error) {
    if (allowFailure) return error.stdout.toString();
    throw error;
  }
}

function parseJson(text) {
  return JSON.parse(text.trim());
}

function baseDelegateRequest(overrides = {}) {
  return {
    schema: "runtime_v1_provider_delegate_request.v1",
    task_id: "runtime-v1-real-guarded-task-001",
    prompt_package_ref: "prompts/image_generation/neutral_smoke_test_red_apple_v1.yaml",
    provider_route: "native_doubao_guarded",
    provider_mode: "real_guarded",
    model_required: "doubao-seedream-5-0-260128",
    max_images: 1,
    output_scope: "run_directory_only",
    secret_value_read_allowed: false,
    raw_provider_payload_allowed: false,
    production_write_allowed: false,
    memory_write_allowed: false,
    ...overrides,
  };
}

async function main() {
  runNode(["--check", delegatePath]);
  runNode(["--check", "scripts/validate_runtime_to_review_v1_native_doubao_delegate_module.js"]);

  const delegateModule = require(repoPath(delegatePath));
  const liveProbeRunner = require(repoPath(liveProbeRunnerPath));
  const kernel = require(repoPath("kernel/runtime_kernel_v1_real_provider_guarded.js"));

  assert(typeof delegateModule === "function", "delegate module must export a function");
  assert(delegateModule.delegateId === "native_doubao_runtime_v1_provider_delegate", "delegate id mismatch");
  assert(delegateModule.exactConfirmation === liveProbeRunner.exactConfirmation, "delegate exact confirmation must match live runner");
  assert(delegateModule._private.outputRefWithObservedExtension(
    "runs/real_generation/runtime_to_review_v1_guarded_live_probe/image/doubaogen/example.png",
    "jpeg"
  ).endsWith("/example.jpg"), "delegate must map jpeg bytes away from .png extension");
  assert(delegateModule._private.outputRefWithObservedExtension(
    "runs/real_generation/runtime_to_review_v1_guarded_live_probe/image/doubaogen/example.webp",
    "webp"
  ).endsWith("/example.webp"), "delegate must keep matching webp extension");

  const validRequest = baseDelegateRequest();
  const requestValidation = delegateModule.validateRuntimeV1DelegateRequest(validRequest);
  assert(requestValidation.passed === true, "valid runtime v1 delegate request should pass");
  const badRequestValidation = delegateModule.validateRuntimeV1DelegateRequest(baseDelegateRequest({ max_images: 2 }));
  assert(badRequestValidation.passed === false, "max_images above one must fail delegate validation");

  const unboundResult = await delegateModule(validRequest);
  assert(unboundResult.status === "failed_closed", "default unbound delegate must fail closed");
  assert(unboundResult.provider_contact_performed === false, "unbound delegate must not contact provider");
  assert(unboundResult.plugin_call_performed === false, "unbound delegate must not call plugin");
  assert(unboundResult.api_call_performed === false, "unbound delegate must not call API");
  assert(unboundResult.image_generation_performed === false, "unbound delegate must not generate image");
  assert(unboundResult.secret_value_read_performed === false, "unbound delegate must not read secrets");

  const fakeSuccessDelegate = delegateModule.createNativeDoubaoRuntimeV1ProviderDelegate({
    async nativeRunner(options) {
      return {
        status: "completed_provider_image_created",
        model_sent: options.model,
        calls_used: { provider: 1, plugin: 1, api: 1 },
        image_count: 1,
        output_files: [{
          path: "runs/real_generation/runtime_to_review_v1_guarded_live_probe/fake-provider-output.png",
          bytes: 68,
          sha256: "1d79731a4db187c2d8b8d56d57a2d694dc9ee81da1cf2f146a64ab3bd220893c",
          mime_type: "image/png",
          dimensions: "1x1",
          magic_number: "89504e470d0a1a0a",
        }],
        provider_contact_performed: true,
        plugin_call_performed: true,
        api_call_performed: true,
        image_generation_performed: true,
        secret_value_read_performed: false,
        env_file_content_read_performed: false,
      };
    },
  });
  const fakeDelegateResult = await fakeSuccessDelegate(validRequest);
  assert(fakeDelegateResult.status === "completed_provider_image_created", "fake runner success must normalize to completed provider status");
  assert(fakeDelegateResult.calls_used.provider === 1, "fake runner provider call count mismatch");
  assert(fakeDelegateResult.output_files.length === 1, "fake runner output file metadata missing");

  const fakeContactFailureDelegate = delegateModule.createNativeDoubaoRuntimeV1ProviderDelegate({
    async nativeRunner() {
      return {
        status: "failed_closed",
        calls_used: { provider: 1, plugin: 1, api: 1 },
        provider_contact_performed: true,
        plugin_call_performed: true,
        api_call_performed: true,
        image_generation_performed: false,
        runtime_bridge_result: {
          blocker: "vcptoolbox_route_doubaogen_timeout_4m",
        },
      };
    },
  });
  const fakeContactFailureResult = await fakeContactFailureDelegate(validRequest);
  assert(fakeContactFailureResult.status === "failed_closed", "fake contacted failure must remain failed closed");
  assert(fakeContactFailureResult.calls_used.provider === 1, "failed contacted delegate must preserve provider call count");
  assert(fakeContactFailureResult.calls_used.plugin === 1, "failed contacted delegate must preserve plugin call count");
  assert(fakeContactFailureResult.calls_used.api === 1, "failed contacted delegate must preserve api call count");
  assert(fakeContactFailureResult.provider_contact_performed === true, "failed contacted delegate must preserve provider contact flag");

  const runtimeTask = require(repoPath("tests/fixtures/runtime_kernel_v1_real_guarded_task.fixture.json"));
  const runtimeResult = await kernel.runRuntimeKernelV1(runtimeTask, { providerDelegate: fakeSuccessDelegate });
  assert(runtimeResult.status === "completed_provider_image_created", "runtime v1 must accept fake success delegate shape");
  assert(runtimeResult.audit_receipt.calls_used.provider === 1, "runtime receipt provider call count mismatch");
  assert(runtimeResult.audit_receipt.secret_handling.secret_value_read_performed === false, "runtime receipt must record no secret read");

  const exactPreflight = liveProbeRunner.validatePreflight({
    max_images: 1,
    provider_delegate_module: delegatePath,
    confirm_live_provider_probe: liveProbeRunner.exactConfirmation,
  });
  assert(exactPreflight.passed === true, "delegate module plus exact confirmation must pass live runner preflight");
  const wrongPhrasePreflight = liveProbeRunner.validatePreflight({
    max_images: 1,
    provider_delegate_module: delegatePath,
    confirm_live_provider_probe: "WRONG_CONFIRMATION",
  });
  assert(wrongPhrasePreflight.passed === false, "wrong confirmation phrase must fail preflight");

  const preflightOnly = parseJson(runNode([
    liveProbeRunnerPath,
    "--provider-delegate-module",
    delegatePath,
    "--confirm-live-provider-probe",
    liveProbeRunner.exactConfirmation,
    "--preflight-only",
  ]));
  assert(preflightOnly.preflight_would_pass_with_current_args === true, "preflight-only should pass with delegate and exact phrase");
  assert(preflightOnly.real_provider_call_performed === false, "preflight-only must not contact provider");
  assert(preflightOnly.image_generation_performed === false, "preflight-only must not generate image");

  process.stdout.write(`${JSON.stringify({
    passed: true,
    validator: validatorId,
    delegate_module: delegatePath,
    delegate_id: delegateModule.delegateId,
    exact_confirmation_required: liveProbeRunner.exactConfirmation,
    default_delegate_status: unboundResult.status,
    default_delegate_fails_closed_without_bound_owner_runtime: true,
    fake_success_runtime_status: runtimeResult.status,
    output_extension_normalized_from_observed_format: true,
    exact_phrase_preflight_passed: true,
    wrong_phrase_preflight_blocked: true,
    live_probe_executed_by_validator: false,
    real_provider_call_performed: false,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    secret_value_read_performed: false,
    env_file_content_read_performed: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false,
    accepted_samples_write_performed: false,
    production_candidate_write_performed: false,
  }, null, 2)}\n`);
}

main().catch((error) => {
  process.stderr.write(`${JSON.stringify({
    passed: false,
    validator: validatorId,
    error: error.message,
  }, null, 2)}\n`);
  process.exitCode = 1;
});
