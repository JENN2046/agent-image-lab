#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const validator = "runtime_to_review_v2_trial_001_exact_runtime_binding";
const adapterPath = "adapters/runtime/native_doubao_runtime_v2_trial_001_serum_detail_broker_dispatch_adapter.js";
const bridgePath = "scripts/native_doubao_secretless_provider_runtime_bridge.js";
const runnerPath = "scripts/run_native_doubao_image_generation.js";
const liveRunnerPath = "scripts/run_runtime_to_review_v1_guarded_live_probe.js";
const providerDelegatePath = "adapters/runtime/native_doubao_runtime_v1_provider_delegate.js";
const fixturePath = "tests/fixtures/runtime_kernel_v2_trial_001_serum_detail_control_task.fixture.json";
const promptRef = "prompts/image_generation/product_detail_premium_serum_bottle_v2.yaml";
const outputDir = "runs/real_generation/runtime_to_review_v2_trial_001_serum_detail_control/";

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

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(repoPath(relativePath), "utf8"));
}

function runNodeCheck(relativePath) {
  childProcess.execFileSync(process.execPath, ["--check", relativePath], {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  return true;
}

function check(id, fn) {
  try {
    const ok = fn();
    results.push({ check: id, passed: Boolean(ok) });
    if (!ok) passed = false;
  } catch (error) {
    results.push({ check: id, passed: false, error: error.message });
    passed = false;
  }
}

function allFalse(flags) {
  return flags && Object.values(flags).every((value) => value === false);
}

function main() {
  const adapterSource = fs.readFileSync(repoPath(adapterPath), "utf8");
  const bridgeSource = fs.readFileSync(repoPath(bridgePath), "utf8");
  const promptSource = fs.readFileSync(repoPath(promptRef), "utf8");
  const adapter = require(repoPath(adapterPath));
  const bridge = require(repoPath(bridgePath));
  const runner = require(repoPath(runnerPath));
  const liveRunner = require(repoPath(liveRunnerPath));
  const fixture = readJson(fixturePath);

  check("syntax_clean", () =>
    runNodeCheck(adapterPath) &&
    runNodeCheck("scripts/validate_runtime_to_review_v2_trial_001_exact_runtime_binding.js")
  );
  check("bridge_allowlist_contains_v2_exact_refs", () =>
    bridgeSource.includes(`"${promptRef}"`) &&
    bridgeSource.includes(`"${outputDir}"`)
  );
  check("adapter_exports_exact_v2_scope", () =>
    typeof adapter === "function" &&
    adapter.moduleId === "native_doubao_runtime_v2_trial_001_serum_detail_broker_dispatch_adapter" &&
    adapter.allowedPromptPackageRef === promptRef &&
    adapter.allowedOutputDirectory === outputDir &&
    adapter.vcpToolBoxImageStoreRoot === "A:/VCP/apps/VCPToolBox/image/doubaogen" &&
    adapter.requiredModel === "doubao-seedream-5-0-260128" &&
    adapter.pipelineId === "runtime_to_review_v2_trial_001_serum_detail_control" &&
    adapter.routeTaskId === "AUTH-R2R-V2-TRIAL-001-SERUM-DETAIL-CONTROL-20260608-FUTURE-EXECUTION" &&
    adapter.routePath === "/internal/ai-image-agents/execute/r2r-v2-trial-001-serum-detail-control" &&
    adapter.resolution === "1920x1920"
  );
  check("fixture_matches_exact_v2_scope", () =>
    fixture.prompt_package_ref === promptRef &&
    fixture.output_directory_ref === outputDir &&
    fixture.provider_route === "native_doubao_guarded" &&
    fixture.provider_mode === "real_guarded" &&
    fixture.model_required === adapter.requiredModel &&
    fixture.max_images === 1 &&
    fixture.output_scope === "run_directory_only" &&
    fixture.review_required === true &&
    fixture.secret_value_read_allowed === false &&
    fixture.retry_allowed === false
  );
  check("prompt_is_detail_control_blank_label", () =>
    promptSource.includes("shot_role: product_detail_controlled_studio") &&
    promptSource.includes("product fidelity inspection shot") &&
    promptSource.includes("intentionally blank label") &&
    promptSource.includes("label_panel_intentionally_blank_and_non_readable") &&
    !promptSource.includes("brandable")
  );
  check("adapter_source_has_no_agent_image_lab_auth_header_or_env_secret", () =>
    !adapterSource.includes("AGENT_IMAGE_LAB_VCP_ADMIN") &&
    !adapterSource.includes("Authorization:") &&
    !adapterSource.includes("config.env") &&
    !adapterSource.includes(".env.local") &&
    !adapterSource.includes("process.env")
  );
  check("readiness_is_side_effect_free", () => {
    const readiness = adapter.inspectTrial001BrokerDispatchReadiness();
    return readiness.route_path === adapter.routePath &&
      readiness.output_directory_allowed === outputDir &&
      readiness.prompt_package_allowed === promptRef &&
      readiness.authorization_header_constructed_by_agent_image_lab === false &&
      readiness.secret_value_read_performed === false &&
      readiness.env_file_content_read_performed === false &&
      readiness.provider_contact_performed === false &&
      readiness.plugin_call_performed === false &&
      readiness.api_call_performed === false &&
      readiness.image_generation_performed === false &&
      readiness.output_write_performed === false;
  });
  check("route_body_is_exact_trial_001_binding", () => {
    const body = adapter._private.routeRequestBody({
      prompt: "PROMPT_PLACEHOLDER",
      model: adapter.requiredModel,
      outputDirectory: adapter.allowedOutputDirectory,
    });
    return body.pipelineId === adapter.pipelineId &&
      body.taskId === adapter.routeTaskId &&
      body.dryRun === false &&
      body.confirm === true &&
      body.activation.max_route_http_requests === 1 &&
      body.activation.max_provider_calls === 1 &&
      body.activation.max_plugin_calls === 1 &&
      body.activation.max_api_calls === 1 &&
      body.activation.max_images === 1 &&
      body.activation.retry_allowed === false &&
      body.visual_job_contract.prompt_package_ref === promptRef &&
      body.visual_job_contract.output_directory_ref === outputDir &&
      body.plan.steps.length === 1 &&
      body.plan.steps[0].type === "generate_image" &&
      body.plan.steps[0].plugin === "DoubaoGen" &&
      body.plan.steps[0].prompt === "PROMPT_PLACEHOLDER" &&
      body.plan.steps[0].model === adapter.requiredModel &&
      body.plan.steps[0].resolution === "1920x1920";
  });
  check("adapter_imports_vcptoolbox_doubaogen_refs_to_artifact_store", () =>
    typeof adapter._private.candidateImageRef === "function" &&
    typeof adapter._private.importVcpToolBoxImageToArtifactStore === "function" &&
    typeof adapter._private.inspectOrImportOutputFile === "function" &&
    adapter._private.candidateImageRef({
      result: {
        outputRefs: ["image/doubaogen/example.png"],
      },
    }, outputDir) === `${outputDir}example.png` &&
    adapterSource.includes("COPYFILE_EXCL") &&
    adapterSource.includes("artifact_import_target_already_exists") &&
    adapterSource.includes("vcpToolBoxImageStoreRoot")
  );
  check("secretless_bridge_validates_v2_request", () => {
    const options = {
      prompt_package_ref: promptRef,
      output_directory: outputDir,
      model: adapter.requiredModel,
      max_plugin_calls: 1,
      max_images_created: 1,
      retry_allowed: false,
      dryRun: false,
      execution_authorized: true,
      provider_binding_ref: runner.SECRETLESS_PROVIDER_BINDING_REF,
      provider_binding_ref_redacted: true,
      provider_binding_ref_is_secret: false,
      secretless_runtime_required: true,
      a5_activation_ref: "AUTH-R2R-V2-TRIAL-001-SERUM-DETAIL-CONTROL-20260608-BINDING-READY",
    };
    const preflight = runner.preflightCheck(options);
    const request = bridge.buildSecretlessProviderRuntimeRequest(options, preflight);
    const issues = bridge.validateSecretlessProviderRuntimeRequest(request);
    return preflight.preflight_passed === true &&
      preflight.env_file_content_read_performed === false &&
      preflight.secret_value_read_performed === false &&
      issues.length === 0 &&
      request.prompt_package_ref === promptRef &&
      request.output_directory_ref === outputDir &&
      request.execution_authorized === true;
  });
  check("live_runner_preflight_accepts_exact_modules_without_dispatch", () => {
    const preflight = liveRunner.validatePreflight({
      input: fixturePath,
      provider_delegate_module: providerDelegatePath,
      owner_runtime_module: adapterPath,
      confirm_live_provider_probe: liveRunner.exactConfirmation,
      max_images: 1,
      preflight_only: true,
    });
    return preflight.passed === true && preflight.issues.length === 0;
  });
  check("output_collision_clear", () =>
    !fs.existsSync(repoPath(outputDir)) &&
    !fs.existsSync(repoPath(adapter.receiptRef)) &&
    !fs.existsSync(repoPath(adapter.artifactRecordRef)) &&
    !fs.existsSync(repoPath(adapter.reviewBridgeRef))
  );
  check("created_bridge_is_bound_without_dispatch", () => {
    const runtime = adapter.createSecretlessProviderRuntime();
    return typeof runtime === "function" &&
      runtime.secretless_provider_runtime_delegate_bound === true &&
      runtime.secretless_provider_runtime_bridge_id === bridge.BRIDGE_ID;
  });

  const output = {
    passed,
    validator,
    adapter: adapterPath,
    fixture: fixturePath,
    prompt_package_ref: promptRef,
    output_directory_ref: outputDir,
    route_http_request_performed: false,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    output_write_performed: false,
    secret_value_read_performed: false,
    env_file_content_read_performed: false,
    side_effect_flags_false: allFalse({
      route_http_request_performed: false,
      provider_contact_performed: false,
      plugin_call_performed: false,
      api_call_performed: false,
      image_generation_performed: false,
      output_write_performed: false,
      secret_value_read_performed: false,
      env_file_content_read_performed: false,
    }),
    check_count: results.length,
    failed_count: results.filter((result) => !result.passed).length,
    results,
  };
  process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
  if (!passed) process.exitCode = 1;
}

main();
