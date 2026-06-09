#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const validator = "runtime_to_review_v2_trial_002_ail_side_binding_preflight";
const packetRef = "reports/runtime_to_review_v2/r2r_v2_trial_002_lantern_ecommerce_hero_ail_side_binding_preflight_20260608.json";
const noExecutePacketRef = "reports/runtime_to_review_v2/r2r_v2_trial_002_lantern_ecommerce_hero_activation_packet_no_execute_20260608.json";
const criteriaRef = "reports/runtime_to_review_v2/r2r_v2_trial_002_lantern_ecommerce_hero_review_criteria_no_execute_20260608.json";
const adapterRef = "adapters/runtime/native_doubao_runtime_v2_trial_002_lantern_ecommerce_broker_dispatch_adapter.js";
const bridgeRef = "scripts/native_doubao_secretless_provider_runtime_bridge.js";
const fixtureRef = "tests/fixtures/runtime_kernel_v2_trial_002_lantern_ecommerce_hero_task.fixture.json";
const runnerRef = "scripts/run_native_doubao_image_generation.js";
const liveRunnerRef = "scripts/run_runtime_to_review_v1_guarded_live_probe.js";
const providerDelegateRef = "adapters/runtime/native_doubao_runtime_v1_provider_delegate.js";
const promptRef = "prompts/image_generation/product_lifestyle_premium_portable_led_camping_lantern_v2.yaml";
const outputDir = "runs/real_generation/runtime_to_review_v2_trial_002_lantern_ecommerce_hero/";

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

function isRepoRelative(ref) {
  return typeof ref === "string" &&
    ref.trim() !== "" &&
    !path.isAbsolute(ref) &&
    !ref.split(/[\\/]/).includes("..");
}

function allFalse(flags) {
  return flags && Object.values(flags).every((value) => value === false);
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

async function checkAsync(id, fn) {
  try {
    const ok = await fn();
    results.push({ check: id, passed: Boolean(ok) });
    if (!ok) passed = false;
  } catch (error) {
    results.push({ check: id, passed: false, error: error.message });
    passed = false;
  }
}

function trial002RuntimeRequest(bridge, runner, adapter) {
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
    a5_activation_ref: "AUTH-R2R-V2-TRIAL-002-LANTERN-ECOMMERCE-HERO-20260608-AIL-SIDE-PREFLIGHT",
  };
  const preflight = runner.preflightCheck(options);
  return bridge.buildSecretlessProviderRuntimeRequest(options, preflight);
}

async function main() {
  const packet = readJson(packetRef);
  const noExecutePacket = readJson(noExecutePacketRef);
  const criteria = readJson(criteriaRef);
  const fixture = readJson(fixtureRef);
  const adapterSource = fs.readFileSync(repoPath(adapterRef), "utf8");
  const bridgeSource = fs.readFileSync(repoPath(bridgeRef), "utf8");
  const promptSource = fs.readFileSync(repoPath(promptRef), "utf8");
  const adapter = require(repoPath(adapterRef));
  const bridge = require(repoPath(bridgeRef));
  const runner = require(repoPath(runnerRef));
  const liveRunner = require(repoPath(liveRunnerRef));

  check("syntax_clean", () =>
    runNodeCheck(adapterRef) &&
    runNodeCheck("scripts/validate_runtime_to_review_v2_trial_002_ail_side_binding_preflight.js")
  );
  check("packet_schema_and_blocked_state", () =>
    packet.schema === "runtime_to_review_v2_ail_side_binding_preflight.v1" &&
    packet.status === "issued_ail_side_exact_binding_preflight_external_route_pending" &&
    packet.trial_id === "r2r_v2_trial_002_lantern_ecommerce_hero" &&
    packet.can_execute_now === false &&
    packet.binding_ready === false &&
    packet.dispatch_performed === false &&
    packet.activation_consumed === false &&
    packet.execution_conditions_locked === true
  );
  check("source_refs_exist_and_align", () =>
    packet.source_refs.no_execute_packet_ref === noExecutePacketRef &&
    packet.source_refs.review_criteria_ref === criteriaRef &&
    packet.source_refs.ail_runtime_binding_adapter_ref === adapterRef &&
    packet.source_refs.runtime_task_fixture_ref === fixtureRef &&
    packet.source_refs.prompt_package_ref === promptRef &&
    fs.existsSync(repoPath(noExecutePacketRef)) &&
    fs.existsSync(repoPath(criteriaRef)) &&
    fs.existsSync(repoPath(adapterRef)) &&
    fs.existsSync(repoPath(fixtureRef)) &&
    fs.existsSync(repoPath(promptRef))
  );
  check("no_execute_predecessor_remains_no_execute", () =>
    noExecutePacket.status === "prepared_no_execute" &&
    noExecutePacket.can_execute_now === false &&
    noExecutePacket.trial.trial_id === packet.trial_id
  );
  check("bridge_allowlist_contains_trial_002_refs", () =>
    bridgeSource.includes(`"${promptRef}"`) &&
    bridgeSource.includes(`"${outputDir}"`)
  );
  check("adapter_exports_exact_trial_002_scope", () =>
    typeof adapter === "function" &&
    adapter.moduleId === "native_doubao_runtime_v2_trial_002_lantern_ecommerce_broker_dispatch_adapter" &&
    adapter.allowedPromptPackageRef === promptRef &&
    adapter.allowedOutputDirectory === outputDir &&
    adapter.vcpToolBoxImageStoreRoot === "A:/VCP/apps/VCPToolBox/image/doubaogen" &&
    adapter.requiredModel === "doubao-seedream-5-0-260128" &&
    adapter.pipelineId === "runtime_to_review_v2_trial_002_lantern_ecommerce_hero" &&
    adapter.routeTaskId === "AUTH-R2R-V2-TRIAL-002-LANTERN-ECOMMERCE-HERO-20260609-BINDING-READY" &&
    adapter.routePath === "/internal/ai-image-agents/execute/r2r-v2-trial-002-lantern-ecommerce-hero" &&
    adapter.resolution === "1920x1920"
  );
  check("fixture_matches_exact_trial_002_scope", () =>
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
  check("prompt_encodes_lantern_hero_not_serum", () =>
    promptSource.includes("package_id: product_lifestyle_premium_portable_led_camping_lantern_v2") &&
    promptSource.includes("premium portable LED camping lantern") &&
    promptSource.includes("full handle, diffuser, dimmer knob, body, and base visible") &&
    promptSource.includes("No brand text") &&
    !promptSource.includes("product_detail_controlled_studio") &&
    !promptSource.includes("serum bottle")
  );
  check("adapter_source_has_no_agent_image_lab_auth_header_or_env_secret", () =>
    !adapterSource.includes("AGENT_IMAGE_LAB_VCP_ADMIN") &&
    !adapterSource.includes("Authorization:") &&
    !adapterSource.includes("config.env") &&
    !adapterSource.includes(".env.local") &&
    !adapterSource.includes("process.env")
  );
  check("readiness_is_side_effect_free_and_external_route_pending", () => {
    const readiness = adapter.inspectTrial002BrokerDispatchReadiness();
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
      readiness.output_write_performed === false &&
      readiness.external_vcptoolbox_route_binding_required === true;
  });
  check("route_body_is_exact_trial_002_binding", () => {
    const body = adapter._private.routeRequestBody({
      prompt: "PROMPT_PLACEHOLDER",
      model: adapter.requiredModel,
      outputDirectory: adapter.allowedOutputDirectory,
    });
    return body.pipelineId === adapter.pipelineId &&
      body.taskId === adapter.routeTaskId &&
      body.activation.activation_package_id === adapter.routeTaskId &&
      body.activation.confirmation_phrase === "RUNTIME_TO_REVIEW_V2_TRIAL_002_ONE_PROVIDER_ONE_IMAGE" &&
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
      body.plan.steps[0].resolution === "1920x1920" &&
      body.plan.steps[0].output_directory_ref === outputDir &&
      body.plan.steps[0].output_directory_ref === body.visual_job_contract.output_directory_ref;
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
  check("secretless_bridge_validates_trial_002_request", () => {
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
      a5_activation_ref: "AUTH-R2R-V2-TRIAL-002-LANTERN-ECOMMERCE-HERO-20260608-AIL-SIDE-PREFLIGHT",
    };
    const preflight = runner.preflightCheck(options);
    const request = trial002RuntimeRequest(bridge, runner, adapter);
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
      input: fixtureRef,
      provider_delegate_module: providerDelegateRef,
      owner_runtime_module: adapterRef,
      confirm_live_provider_probe: liveRunner.exactConfirmation,
      max_images: 1,
      preflight_only: true,
    });
    return preflight.passed === true && preflight.issues.length === 0;
  });
  check("packet_binding_matches_adapter_and_fixture", () =>
    packet.ail_side_execution_binding.target_runtime === adapterRef &&
    packet.ail_side_execution_binding.target_runtime_module_id === adapter.moduleId &&
    packet.ail_side_execution_binding.prompt_package_ref === adapter.allowedPromptPackageRef &&
    packet.ail_side_execution_binding.output_directory_ref === adapter.allowedOutputDirectory &&
    packet.ail_side_execution_binding.path === adapter.routePath &&
    packet.ail_side_execution_binding.external_vcptoolbox_route_binding_required === true &&
    packet.ail_side_execution_binding.external_vcptoolbox_route_binding_present === false &&
    fixture.prompt_package_ref === adapter.allowedPromptPackageRef &&
    fixture.output_directory_ref === adapter.allowedOutputDirectory
  );
  check("output_policy_and_collision_clear", () =>
    packet.output_policy.output_directory_ref === outputDir &&
    packet.output_policy.overwrite_existing_files_allowed === false &&
    packet.output_policy.expected_receipt_ref === adapter.receiptRef &&
    packet.output_policy.expected_artifact_record_ref === adapter.artifactRecordRef &&
    packet.output_policy.expected_review_bridge_ref === adapter.reviewBridgeRef &&
    packet.output_policy.initial_status_after_generation === "generated_unreviewed" &&
    packet.output_policy.review_queue_required_before_archive === true &&
    isRepoRelative(packet.output_policy.output_directory_ref) &&
    isRepoRelative(packet.output_policy.expected_receipt_ref) &&
    isRepoRelative(packet.output_policy.expected_artifact_record_ref) &&
    isRepoRelative(packet.output_policy.expected_review_bridge_ref) &&
    !fs.existsSync(repoPath(outputDir)) &&
    !fs.existsSync(repoPath(adapter.receiptRef)) &&
    !fs.existsSync(repoPath(adapter.artifactRecordRef)) &&
    !fs.existsSync(repoPath(adapter.reviewBridgeRef))
  );
  check("budget_one_each_no_retry", () =>
    packet.single_dispatch_budget.max_route_http_requests === 1 &&
    packet.single_dispatch_budget.max_provider_calls === 1 &&
    packet.single_dispatch_budget.max_plugin_calls === 1 &&
    packet.single_dispatch_budget.max_api_calls === 1 &&
    packet.single_dispatch_budget.max_images === 1 &&
    packet.single_dispatch_budget.max_live_probe_attempts === 1 &&
    packet.single_dispatch_budget.retry_allowed === false
  );
  check("dispatch_command_is_future_only_and_non_retrying", () =>
    packet.future_dispatch_command_after_external_binding_and_final_user_go.command === "node" &&
    packet.future_dispatch_command_after_external_binding_and_final_user_go.args.includes("scripts/run_runtime_to_review_v1_guarded_live_probe.js") &&
    packet.future_dispatch_command_after_external_binding_and_final_user_go.args.includes(fixtureRef) &&
    packet.future_dispatch_command_after_external_binding_and_final_user_go.args.includes(adapterRef) &&
    packet.future_dispatch_command_after_external_binding_and_final_user_go.args.includes("RUNTIME_TO_REVIEW_V1_ONE_PROVIDER_ONE_IMAGE") &&
    packet.future_dispatch_command_after_external_binding_and_final_user_go.args.includes("--max-images") &&
    packet.future_dispatch_command_after_external_binding_and_final_user_go.args.includes("1") &&
    packet.future_dispatch_command_after_external_binding_and_final_user_go.must_not_add_retry_flags === true &&
    packet.future_dispatch_command_after_external_binding_and_final_user_go.must_not_override_prompt_or_output === true
  );
  check("review_refs_align_with_criteria", () =>
    criteria.post_generation_required_review_refs.expected_artifact_record_ref === packet.output_policy.expected_artifact_record_ref &&
    criteria.post_generation_required_review_refs.expected_receipt_ref === packet.output_policy.expected_receipt_ref &&
    criteria.post_generation_required_review_refs.expected_review_bridge_ref === packet.output_policy.expected_review_bridge_ref
  );
  check("post_dispatch_writes_are_review_first", () =>
    packet.post_dispatch_required_writes_if_successful.receipt_required === true &&
    packet.post_dispatch_required_writes_if_successful.artifact_record_required === true &&
    packet.post_dispatch_required_writes_if_successful.review_bridge_required === true &&
    packet.post_dispatch_required_writes_if_successful.accepted_samples_write_allowed === false &&
    packet.post_dispatch_required_writes_if_successful.production_candidate_write_allowed === false &&
    packet.post_dispatch_required_writes_if_successful.DailyNote_write_allowed === false &&
    packet.post_dispatch_required_writes_if_successful.VCP_memory_write_allowed === false &&
    packet.post_dispatch_required_writes_if_successful.memory_candidate_allowed_after_human_review === true
  );
  check("stop_conditions_keep_external_binding_as_blocker", () =>
    packet.blocking_reason_before_binding_ready === "external_vcptoolbox_trial_002_internal_route_and_authorizer_not_bound" &&
    packet.stop_conditions.includes("external_vcptoolbox_trial_002_route_binding_missing") &&
    packet.stop_conditions.includes("output_directory_exists") &&
    packet.stop_conditions.includes("budget_not_exactly_one_route_one_provider_one_plugin_one_api_one_image") &&
    packet.stop_conditions.includes("retry_requested") &&
    packet.stop_conditions.includes("secret_value_read_required") &&
    packet.stop_conditions.includes("authorization_header_constructed_by_Agent_Image_Lab") &&
    packet.stop_conditions.includes("accepted_samples_or_production_or_memory_write_requested_before_review") &&
    packet.stop_conditions.includes("push_tag_release_deploy_requested")
  );
  check("side_effect_flags_false_at_creation", () => allFalse(packet.side_effect_flags_at_packet_creation));
  check("created_bridge_is_bound_without_dispatch", () => {
    const runtime = adapter.createSecretlessProviderRuntime();
    return typeof runtime === "function" &&
      runtime.secretless_provider_runtime_delegate_bound === true &&
      runtime.secretless_provider_runtime_bridge_id === bridge.BRIDGE_ID;
  });
  await checkAsync("failed_route_does_not_create_output_directory", async () => {
    if (fs.existsSync(repoPath(outputDir))) return false;
    const request = trial002RuntimeRequest(bridge, runner, adapter);
    const result = await adapter.realBoundOwnerRuntimeDelegate(request, {
      postJson: async () => ({
        ok: false,
        statusCode: 0,
        body: { ok: false, error: "test_route_missing" },
      }),
    });
    return result.status === "BLOCKED_R2R_V2_TRIAL_002_BROKER_DISPATCH_FAILED_CLOSED" &&
      result.blocker === "r2r_v2_trial_002_broker_route_unreachable" &&
      result.output_write_performed === false &&
      result.provider_contact_performed === false &&
      result.plugin_call_performed === false &&
      result.api_call_performed === false &&
      result.image_generation_performed === false &&
      result.calls_used.provider === 0 &&
      result.calls_used.plugin === 0 &&
      result.calls_used.api === 0 &&
      !fs.existsSync(repoPath(outputDir));
  });
  await checkAsync("existing_output_directory_stops_before_dispatch", async () => {
    const outputPath = repoPath(outputDir);
    if (fs.existsSync(outputPath)) return false;
    let postCalled = false;
    try {
      fs.mkdirSync(outputPath, { recursive: true });
      const request = trial002RuntimeRequest(bridge, runner, adapter);
      const result = await adapter.realBoundOwnerRuntimeDelegate(request, {
        postJson: async () => {
          postCalled = true;
          return {
            ok: true,
            statusCode: 200,
            body: { ok: true, outputRefs: [`${outputDir}should_not_be_used.png`] },
          };
        },
      });
      return result.status === "BLOCKED_R2R_V2_TRIAL_002_BROKER_DISPATCH_FAILED_CLOSED" &&
        result.blocker === "r2r_v2_trial_002_output_directory_exists" &&
        postCalled === false &&
        result.output_write_performed === false &&
        result.provider_contact_performed === false &&
        result.plugin_call_performed === false &&
        result.api_call_performed === false &&
        result.image_generation_performed === false &&
        result.calls_used.provider === 0 &&
        result.calls_used.plugin === 0 &&
        result.calls_used.api === 0;
    } finally {
      if (fs.existsSync(outputPath)) {
        fs.rmdirSync(outputPath);
      }
    }
  });
  check("recommended_next_is_external_binding_then_binding_ready_packet", () =>
    packet.recommended_next === "bind_trial_002_internal_route_and_authorizer_in_vcptoolbox_then_issue_binding_ready_execution_packet_with_can_execute_now_true"
  );

  const output = {
    passed,
    validator,
    packet_ref: packetRef,
    adapter: adapterRef,
    fixture: fixtureRef,
    prompt_package_ref: promptRef,
    output_directory_ref: outputDir,
    can_execute_now: false,
    blocking_reason_before_binding_ready: packet.blocking_reason_before_binding_ready,
    route_http_request_performed: false,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    output_write_performed: false,
    secret_value_read_performed: false,
    env_file_content_read_performed: false,
    check_count: results.length,
    failed_count: results.filter((result) => !result.passed).length,
    results,
  };
  process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
  if (!passed) process.exitCode = 1;
}

main().catch((error) => {
  passed = false;
  results.push({ check: "validator_uncaught_error", passed: false, error: error.message });
  process.stdout.write(`${JSON.stringify({
    passed,
    validator,
    packet_ref: packetRef,
    check_count: results.length,
    failed_count: results.filter((result) => !result.passed).length,
    results,
  }, null, 2)}\n`);
  process.exitCode = 1;
});
