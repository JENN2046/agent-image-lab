#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const validator = "runtime_to_review_v2_trial_002_rearm_packet_attempt_003";
const packetRef = "reports/runtime_to_review_v2/r2r_v2_trial_002_lantern_ecommerce_hero_rearm_packet_attempt_003_20260609.json";
const bindingReadyPacketRef = "reports/runtime_to_review_v2/r2r_v2_trial_002_lantern_ecommerce_hero_binding_ready_execution_packet_20260609.json";
const attempt001ReceiptRef = "reports/runtime_to_review_v2/r2r_v2_trial_002_lantern_ecommerce_hero_execution_attempt_001_failed_closed_20260609.json";
const attempt002RearmPacketRef = "reports/runtime_to_review_v2/r2r_v2_trial_002_lantern_ecommerce_hero_rearm_packet_attempt_002_20260609.json";
const attempt002ReceiptRef = "reports/runtime_to_review_v2/r2r_v2_trial_002_lantern_ecommerce_hero_execution_attempt_002_failed_closed_20260609.json";
const precheckPacketRef = "reports/runtime_to_review_v2/r2r_v2_trial_002_lantern_ecommerce_hero_binding_ready_precheck_packet_20260609.json";
const ailPreflightRef = "reports/runtime_to_review_v2/r2r_v2_trial_002_lantern_ecommerce_hero_ail_side_binding_preflight_20260608.json";
const adapterRef = "adapters/runtime/native_doubao_runtime_v2_trial_002_lantern_ecommerce_broker_dispatch_adapter.js";
const fixtureRef = "tests/fixtures/runtime_kernel_v2_trial_002_lantern_ecommerce_hero_task.fixture.json";
const promptRef = "prompts/image_generation/product_lifestyle_premium_portable_led_camping_lantern_v2.yaml";
const outputDir = "runs/real_generation/runtime_to_review_v2_trial_002_lantern_ecommerce_hero/";
const activationId = "AUTH-R2R-V2-TRIAL-002-LANTERN-ECOMMERCE-HERO-20260609-BINDING-READY";
const vcpToolboxRoot = "A:/AGENTS_OS_Workspace/runtime/VCPToolBox";

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
  const resolved = path.resolve(vcpToolboxRoot, relativePath);
  const relative = path.relative(vcpToolboxRoot, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`path escapes VCPToolBox root: ${relativePath}`);
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

function runVcpNodeCheck(relativePath) {
  childProcess.execFileSync(process.execPath, ["--check", relativePath], {
    cwd: vcpToolboxRoot,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  return true;
}

function gitOutput(args, cwd) {
  return childProcess.execFileSync("git", args, {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

function isRepoRelative(ref) {
  return typeof ref === "string" &&
    ref.trim() !== "" &&
    !path.isAbsolute(ref) &&
    !ref.split(/[\\/]/).includes("..");
}

function allFalseExcept(flags, allowedTrueKeys) {
  const allowed = new Set(allowedTrueKeys);
  return flags && Object.entries(flags).every(([key, value]) => {
    if (allowed.has(key)) return value === true;
    return value === false;
  });
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

function headStatus(urlString) {
  const url = new URL(urlString);
  return new Promise((resolve) => {
    const request = http.request({
      method: "HEAD",
      hostname: url.hostname,
      port: url.port || 80,
      path: `${url.pathname}${url.search}`,
      timeout: 5000,
    }, (response) => {
      response.resume();
      response.on("end", () => resolve(response.statusCode || 0));
    });
    request.on("timeout", () => {
      request.destroy();
      resolve(0);
    });
    request.on("error", () => resolve(0));
    request.end();
  });
}

function postInvalidNoGenerationProbe(urlString) {
  const url = new URL(urlString);
  const payload = JSON.stringify({
    probe: "trial002_bearer_bypass_no_generation",
    no_generation_expected: true,
  });
  return new Promise((resolve) => {
    const request = http.request({
      method: "POST",
      hostname: url.hostname,
      port: url.port || 80,
      path: `${url.pathname}${url.search}`,
      timeout: 5000,
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(payload),
      },
    }, (response) => {
      let body = "";
      response.setEncoding("utf8");
      response.on("data", (chunk) => {
        body += chunk;
      });
      response.on("end", () => {
        let parsed = null;
        try {
          parsed = JSON.parse(body);
        } catch (_error) {
          parsed = null;
        }
        resolve({ statusCode: response.statusCode || 0, body, parsed });
      });
    });
    request.on("timeout", () => {
      request.destroy();
      resolve({ statusCode: 0, body: "", parsed: null });
    });
    request.on("error", (error) => resolve({ statusCode: 0, body: error.message, parsed: null }));
    request.write(payload);
    request.end();
  });
}

async function main() {
  const packet = readJson(packetRef);
  const bindingReadyPacket = readJson(bindingReadyPacketRef);
  const attempt001Receipt = readJson(attempt001ReceiptRef);
  const attempt002RearmPacket = readJson(attempt002RearmPacketRef);
  const attempt002Receipt = readJson(attempt002ReceiptRef);
  const precheckPacket = readJson(precheckPacketRef);
  const ailPreflight = readJson(ailPreflightRef);
  const fixture = readJson(fixtureRef);
  const adapter = require(repoPath(adapterRef));
  const prompt = fs.readFileSync(repoPath(promptRef), "utf8");
  const vcpServer = fs.readFileSync(vcpPath("server.js"), "utf8");
  const vcpBindingTest = fs.readFileSync(vcpPath("tests/aiImageAgentsServerBinding.test.js"), "utf8");

  check("syntax_clean", () =>
    runNodeCheck(adapterRef) &&
    runNodeCheck("scripts/validate_runtime_to_review_v2_trial_002_rearm_packet_attempt_003.js") &&
    runNodeCheck("scripts/validate_runtime_to_review_v2_trial_002_binding_ready_execution_packet.js") &&
    runNodeCheck("scripts/validate_runtime_to_review_v2_trial_002_ail_side_binding_preflight.js") &&
    runVcpNodeCheck("server.js") &&
    runVcpNodeCheck("tests/aiImageAgentsServerBinding.test.js")
  );
  check("packet_schema_and_identity", () =>
    packet.schema === "runtime_to_review_v2_rearm_execution_packet.v1" &&
    packet.rearm_packet_id === "r2r_v2_trial_002_lantern_ecommerce_hero_rearm_packet_attempt_003_20260609" &&
    packet.trial_id === "r2r_v2_trial_002_lantern_ecommerce_hero" &&
    packet.status === "issued_rearmed_pending_dispatch" &&
    packet.can_execute_now === true &&
    packet.binding_ready === true &&
    packet.dispatch_performed === false &&
    packet.activation_consumed === false &&
    packet.attempt_id === "attempt_003" &&
    packet.attempt_number === 3
  );
  check("source_refs_exist_and_previous_attempts_are_consumed", () =>
    packet.source_refs.binding_ready_execution_packet_ref === bindingReadyPacketRef &&
    packet.source_refs.attempt_001_failed_closed_receipt_ref === attempt001ReceiptRef &&
    packet.source_refs.attempt_002_rearm_packet_ref === attempt002RearmPacketRef &&
    packet.source_refs.attempt_002_failed_closed_receipt_ref === attempt002ReceiptRef &&
    packet.source_refs.binding_ready_precheck_packet_ref === precheckPacketRef &&
    packet.source_refs.ail_side_binding_preflight_ref === ailPreflightRef &&
    packet.source_refs.runtime_task_fixture_ref === fixtureRef &&
    packet.source_refs.exact_runtime_binding_adapter_ref === adapterRef &&
    packet.source_refs.prompt_package_ref === promptRef &&
    packet.previous_attempts_consumed.attempt_001.failed_attempt_consumed === true &&
    packet.previous_attempts_consumed.attempt_001.must_not_rerun === true &&
    packet.previous_attempts_consumed.attempt_002.failed_attempt_consumed === true &&
    packet.previous_attempts_consumed.attempt_002.must_not_rerun === true &&
    packet.dispatch_command_after_final_user_go.must_not_reuse_attempt_001 === true &&
    packet.dispatch_command_after_final_user_go.must_not_reuse_attempt_002 === true &&
    fs.existsSync(repoPath(bindingReadyPacketRef)) &&
    fs.existsSync(repoPath(attempt001ReceiptRef)) &&
    fs.existsSync(repoPath(attempt002RearmPacketRef)) &&
    fs.existsSync(repoPath(attempt002ReceiptRef)) &&
    fs.existsSync(repoPath(precheckPacketRef)) &&
    fs.existsSync(repoPath(ailPreflightRef)) &&
    fs.existsSync(repoPath(fixtureRef)) &&
    fs.existsSync(repoPath(adapterRef)) &&
    fs.existsSync(repoPath(promptRef))
  );
  check("predecessor_state_matches_attempt_003_reason", () =>
    bindingReadyPacket.can_execute_now === true &&
    bindingReadyPacket.binding_ready === true &&
    bindingReadyPacket.dispatch_performed === false &&
    attempt001Receipt.attempt_id === "attempt_001" &&
    attempt001Receipt.status === "failed_closed_route_unreachable_no_image" &&
    attempt001Receipt.budget_consumption.attempt_consumed === true &&
    attempt002RearmPacket.attempt_id === "attempt_002" &&
    attempt002RearmPacket.can_execute_now === true &&
    attempt002Receipt.attempt_id === "attempt_002" &&
    attempt002Receipt.status === "failed_closed_bearer_required_no_image" &&
    attempt002Receipt.result.delegate_blocker === "runtime_bridge_blocker_unauthorized_bearer_required_http_401" &&
    attempt002Receipt.budget_consumption.attempt_consumed === true &&
    attempt002Receipt.budget_consumption.retry_performed === false &&
    precheckPacket.can_execute_now === false &&
    ailPreflight.can_execute_now === false
  );
  check("vcptoolbox_git_state_matches_recorded_patch", () =>
    packet.vcptoolbox_bearer_bypass_correction.workspace === vcpToolboxRoot &&
    packet.vcptoolbox_bearer_bypass_correction.branch === "main" &&
    packet.vcptoolbox_bearer_bypass_correction.head === "ddfc2b1f94616c42712d57e5eb3b3de4fc212b03" &&
    packet.vcptoolbox_bearer_bypass_correction.origin_main === "ddfc2b1f94616c42712d57e5eb3b3de4fc212b03" &&
    packet.vcptoolbox_bearer_bypass_correction.worktree_clean_after_patch === false &&
    packet.vcptoolbox_bearer_bypass_correction.local_patch_uncommitted === true &&
    packet.vcptoolbox_bearer_bypass_correction.changed_files.includes("server.js") &&
    packet.vcptoolbox_bearer_bypass_correction.changed_files.includes("tests/aiImageAgentsServerBinding.test.js") &&
    gitOutput(["branch", "--show-current"], vcpToolboxRoot) === "main" &&
    gitOutput(["rev-parse", "HEAD"], vcpToolboxRoot) === packet.vcptoolbox_bearer_bypass_correction.head &&
    gitOutput(["status", "--short"], vcpToolboxRoot).includes("M server.js") &&
    gitOutput(["status", "--short"], vcpToolboxRoot).includes("M tests/aiImageAgentsServerBinding.test.js")
  );
  check("vcptoolbox_patch_scope_is_trial_002_post_only", () =>
    vcpServer.includes("function isRuntimeToReviewV2Trial002SecretlessInternalRoute(req)") &&
    vcpServer.includes("req.path === R2R_V2_TRIAL_002_SECRETLESS_INTERNAL_ROUTE_PATH") &&
    vcpServer.includes("const isAllowedSecretlessInternalHead") &&
    vcpServer.includes("req.method === 'HEAD' && isLoopbackSocket(req)") &&
    vcpServer.includes("const isAllowedTrial002SecretlessInternalPost") &&
    vcpServer.includes("req.method === 'POST'") &&
    vcpServer.includes("isRuntimeToReviewV2Trial002SecretlessInternalRoute(req)") &&
    vcpServer.includes("isLoopbackSocket(req)") &&
    !vcpServer.includes("req.method === 'HEAD' || req.method === 'POST'") &&
    packet.vcptoolbox_bearer_bypass_correction.authorization_scope.global_bearer_bypass_for_all_admin_routes === false &&
    packet.vcptoolbox_bearer_bypass_correction.authorization_scope.all_secretless_post_routes_bypassed === false &&
    packet.vcptoolbox_bearer_bypass_correction.authorization_scope.trial_001_post_remains_behind_bearer === true &&
    packet.vcptoolbox_bearer_bypass_correction.authorization_scope.serum_bottle_post_remains_behind_bearer === true &&
    packet.vcptoolbox_bearer_bypass_correction.authorization_scope.trial_002_loopback_post_allowed_to_route_level_secretless_authorizer === true &&
    packet.vcptoolbox_bearer_bypass_correction.authorization_scope.non_loopback_trial_002_post_allowed === false
  );
  check("vcptoolbox_binding_test_protects_patch_scope", () =>
    vcpBindingTest.includes("runtime-to-review Trial 001 internal POST remains behind bearer auth") &&
    vcpBindingTest.includes("runtime-to-review Trial 002 internal POST reaches route-level secretless authorizer") &&
    vcpBindingTest.includes("isRuntimeToReviewV2Trial002SecretlessInternalRoute") &&
    vcpBindingTest.includes("isAllowedTrial002SecretlessInternalPost")
  );
  check("vcptoolbox_validation_commands_recorded", () =>
    packet.vcptoolbox_bearer_bypass_correction.validated_commands.includes("node --check server.js") &&
    packet.vcptoolbox_bearer_bypass_correction.validated_commands.includes("node --check tests/aiImageAgentsServerBinding.test.js") &&
    packet.vcptoolbox_bearer_bypass_correction.validated_commands.includes("node --test tests/aiImageAgentsServerBinding.test.js") &&
    packet.vcptoolbox_bearer_bypass_correction.validated_commands.includes("node --test tests/aiImageAgentsRoute.test.js") &&
    packet.vcptoolbox_bearer_bypass_correction.pm2_process_restarted === "vcp-main" &&
    Number.isInteger(packet.vcptoolbox_bearer_bypass_correction.pm2_pid_after_restart)
  );
  await checkAsync("trial_002_route_head_is_204_now", async () => {
    const status = await headStatus(packet.vcptoolbox_bearer_bypass_correction.route_health_check.url);
    return status === 204 &&
      packet.vcptoolbox_bearer_bypass_correction.route_health_check.expected_status === 204 &&
      packet.vcptoolbox_bearer_bypass_correction.route_health_check.observed_status === 204;
  });
  await checkAsync("trial_002_invalid_post_reaches_route_authorizer_without_generation", async () => {
    const probe = await postInvalidNoGenerationProbe(packet.vcptoolbox_bearer_bypass_correction.route_level_post_probe.url);
    const result = probe.parsed && probe.parsed.result ? probe.parsed.result : {};
    return probe.statusCode !== 401 &&
      probe.statusCode === 200 &&
      result.status === "r2r_v2_trial_002_payload_unknown_fields" &&
      result.provider_contact_performed === false &&
      result.plugin_call_performed === false &&
      result.api_call_performed === false &&
      result.image_generation_performed === false &&
      result.output_write_performed === false &&
      result.secret_value_read_performed === false &&
      result.authorization_header_constructed === false &&
      packet.vcptoolbox_bearer_bypass_correction.route_level_post_probe.observed_status === 200 &&
      packet.vcptoolbox_bearer_bypass_correction.route_level_post_probe.observed_body_status === "r2r_v2_trial_002_payload_unknown_fields";
  });
  check("adapter_and_route_body_use_binding_ready_activation", () => {
    const body = adapter._private.routeRequestBody({
      prompt: "PROMPT_PLACEHOLDER",
      model: adapter.requiredModel,
      outputDirectory: adapter.allowedOutputDirectory,
    });
    return adapter.routeTaskId === activationId &&
      packet.runtime_binding_correction.exact_activation_package_id === activationId &&
      packet.execution_binding.activation_package_id === activationId &&
      bindingReadyPacket.execution_binding.activation_package_id === activationId &&
      body.taskId === activationId &&
      body.activation.activation_package_id === activationId &&
      body.visual_job_contract.output_directory_ref === outputDir &&
      body.plan.steps[0].output_directory_ref === outputDir &&
      body.plan.steps[0].output_directory_ref === body.visual_job_contract.output_directory_ref;
  });
  check("execution_binding_matches_adapter_fixture_prompt", () =>
    packet.execution_binding.target_runtime === adapterRef &&
    packet.execution_binding.target_runtime_module_id === adapter.moduleId &&
    packet.execution_binding.prompt_package_ref === adapter.allowedPromptPackageRef &&
    packet.execution_binding.output_directory_ref === adapter.allowedOutputDirectory &&
    packet.execution_binding.model_required === adapter.requiredModel &&
    packet.execution_binding.resolution === adapter.resolution &&
    packet.execution_binding.authorization_header_constructed_by_Agent_Image_Lab === false &&
    fixture.prompt_package_ref === adapter.allowedPromptPackageRef &&
    fixture.output_directory_ref === adapter.allowedOutputDirectory &&
    fixture.max_images === 1 &&
    fixture.retry_allowed === false &&
    prompt.includes("premium portable LED camping lantern") &&
    prompt.includes("No brand text") &&
    !prompt.includes("serum bottle")
  );
  check("budget_is_one_route_one_provider_one_plugin_one_api_one_image_zero_retry", () =>
    packet.single_dispatch_budget.max_route_http_requests === 1 &&
    packet.single_dispatch_budget.max_provider_calls === 1 &&
    packet.single_dispatch_budget.max_plugin_calls === 1 &&
    packet.single_dispatch_budget.max_api_calls === 1 &&
    packet.single_dispatch_budget.max_images === 1 &&
    packet.single_dispatch_budget.max_live_probe_attempts === 1 &&
    packet.single_dispatch_budget.retry_allowed === false
  );
  check("dispatch_command_is_exact_and_requires_final_go", () =>
    packet.dispatch_command_after_final_user_go.command === "node" &&
    packet.dispatch_command_after_final_user_go.args.includes("scripts/run_runtime_to_review_v1_guarded_live_probe.js") &&
    packet.dispatch_command_after_final_user_go.args.includes(fixtureRef) &&
    packet.dispatch_command_after_final_user_go.args.includes("adapters/runtime/native_doubao_runtime_v1_provider_delegate.js") &&
    packet.dispatch_command_after_final_user_go.args.includes(adapterRef) &&
    packet.dispatch_command_after_final_user_go.args.includes("RUNTIME_TO_REVIEW_V1_ONE_PROVIDER_ONE_IMAGE") &&
    packet.dispatch_command_after_final_user_go.args.includes("1") &&
    packet.dispatch_command_after_final_user_go.requires_separate_final_user_go === true &&
    packet.dispatch_command_after_final_user_go.must_not_add_retry_flags === true &&
    packet.dispatch_command_after_final_user_go.must_not_override_prompt_or_output === true
  );
  check("output_collision_stop_is_clear_now", () =>
    packet.readiness_assertions.output_directory_exists === false &&
    packet.readiness_assertions.expected_success_receipt_ref_exists === false &&
    packet.readiness_assertions.expected_artifact_record_ref_exists === false &&
    packet.readiness_assertions.expected_review_bridge_ref_exists === false &&
    isRepoRelative(packet.execution_binding.output_directory_ref) &&
    !fs.existsSync(repoPath(outputDir)) &&
    !fs.existsSync(repoPath("reports/runtime_to_review_v2/r2r_v2_trial_002_lantern_ecommerce_hero_receipt.json")) &&
    !fs.existsSync(repoPath("reports/runtime_to_review_v2/r2r_v2_trial_002_lantern_ecommerce_hero_artifact_record.json")) &&
    !fs.existsSync(repoPath("review_console/live_receipt_bridge/r2r_v2_trial_002_lantern_ecommerce_hero/bridge_entry.json"))
  );
  check("post_dispatch_writes_are_review_first", () =>
    packet.post_dispatch_required_writes_if_successful.receipt_required === true &&
    packet.post_dispatch_required_writes_if_successful.artifact_record_required === true &&
    packet.post_dispatch_required_writes_if_successful.review_bridge_required === true &&
    packet.post_dispatch_required_writes_if_successful.accepted_samples_write_allowed === false &&
    packet.post_dispatch_required_writes_if_successful.production_candidate_write_allowed === false &&
    packet.post_dispatch_required_writes_if_successful.DailyNote_write_allowed === false &&
    packet.post_dispatch_required_writes_if_successful.VCP_memory_write_allowed === false
  );
  check("pre_dispatch_checks_include_attempt_003_and_previous_chain", () =>
    packet.pre_dispatch_checks_required.includes("node scripts/validate_runtime_to_review_v2_trial_002_rearm_packet_attempt_003.js") &&
    packet.pre_dispatch_checks_required.includes("npm run validate:runtime-to-review-trial-002-binding-ready-execution") &&
    packet.pre_dispatch_checks_required.includes("npm run validate:runtime-to-review-trial-002-attempt-001-failed-closed") &&
    packet.pre_dispatch_checks_required.includes("npm run validate:runtime-to-review-trial-002-attempt-002-failed-closed") &&
    packet.pre_dispatch_checks_required.includes("node scripts/validate_runtime_to_review_v2_trial_002_ail_side_binding_preflight.js") &&
    packet.pre_dispatch_checks_required.includes("git diff --check")
  );
  check("side_effect_flags_are_limited_to_head_and_invalid_post_probe", () =>
    allFalseExcept(packet.side_effect_flags_at_rearm_creation, [
      "route_health_head_probe_performed",
      "route_invalid_post_authorizer_probe_performed",
    ])
  );
  check("stop_conditions_cover_attempt_003_boundaries", () =>
    packet.stop_conditions.includes("attempt_001_requested_for_rerun") &&
    packet.stop_conditions.includes("attempt_002_requested_for_rerun") &&
    packet.stop_conditions.includes("trial_002_route_head_not_204") &&
    packet.stop_conditions.includes("trial_002_route_invalid_post_returns_bearer_401") &&
    packet.stop_conditions.includes("vcptoolbox_trial_002_post_bypass_patch_missing_or_wider_than_trial_002") &&
    packet.stop_conditions.includes("output_directory_exists") &&
    packet.stop_conditions.includes("retry_requested") &&
    packet.stop_conditions.includes("secret_value_read_required") &&
    packet.stop_conditions.includes("push_tag_release_deploy_requested")
  );
  check("recommended_next_waits_for_attempt_003_execute_instruction", () =>
    packet.recommended_next === "after_user_explicitly_says_execute_attempt_003_run_pre_dispatch_validators_then_dispatch_attempt_003_exactly_once"
  );

  const output = {
    passed,
    validator,
    packet_ref: packetRef,
    can_execute_now: packet.can_execute_now,
    attempt_id: packet.attempt_id,
    route_head_observed_status: packet.vcptoolbox_bearer_bypass_correction.route_health_check.observed_status,
    invalid_post_observed_status: packet.vcptoolbox_bearer_bypass_correction.route_level_post_probe.observed_status,
    invalid_post_observed_body_status: packet.vcptoolbox_bearer_bypass_correction.route_level_post_probe.observed_body_status,
    dispatch_performed: packet.dispatch_performed,
    route_post_dispatch_performed: false,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    output_write_performed: false,
    check_count: results.length,
    failed_count: results.filter((result) => !result.passed).length,
    results,
  };
  process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
  if (!passed) process.exitCode = 1;
}

main().catch((error) => {
  passed = false;
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
});
