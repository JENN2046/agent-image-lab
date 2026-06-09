#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const validator = "runtime_to_review_v2_trial_002_rearm_packet_attempt_002";
const packetRef = "reports/runtime_to_review_v2/r2r_v2_trial_002_lantern_ecommerce_hero_rearm_packet_attempt_002_20260609.json";
const bindingReadyPacketRef = "reports/runtime_to_review_v2/r2r_v2_trial_002_lantern_ecommerce_hero_binding_ready_execution_packet_20260609.json";
const attempt001ReceiptRef = "reports/runtime_to_review_v2/r2r_v2_trial_002_lantern_ecommerce_hero_execution_attempt_001_failed_closed_20260609.json";
const precheckPacketRef = "reports/runtime_to_review_v2/r2r_v2_trial_002_lantern_ecommerce_hero_binding_ready_precheck_packet_20260609.json";
const ailPreflightRef = "reports/runtime_to_review_v2/r2r_v2_trial_002_lantern_ecommerce_hero_ail_side_binding_preflight_20260608.json";
const adapterRef = "adapters/runtime/native_doubao_runtime_v2_trial_002_lantern_ecommerce_broker_dispatch_adapter.js";
const fixtureRef = "tests/fixtures/runtime_kernel_v2_trial_002_lantern_ecommerce_hero_task.fixture.json";
const promptRef = "prompts/image_generation/product_lifestyle_premium_portable_led_camping_lantern_v2.yaml";
const outputDir = "runs/real_generation/runtime_to_review_v2_trial_002_lantern_ecommerce_hero/";
const activationId = "AUTH-R2R-V2-TRIAL-002-LANTERN-ECOMMERCE-HERO-20260609-BINDING-READY";

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

async function main() {
  const packet = readJson(packetRef);
  const bindingReadyPacket = readJson(bindingReadyPacketRef);
  const attempt001Receipt = readJson(attempt001ReceiptRef);
  const precheckPacket = readJson(precheckPacketRef);
  const ailPreflight = readJson(ailPreflightRef);
  const fixture = readJson(fixtureRef);
  const adapter = require(repoPath(adapterRef));
  const prompt = fs.readFileSync(repoPath(promptRef), "utf8");

  check("syntax_clean", () =>
    runNodeCheck(adapterRef) &&
    runNodeCheck("scripts/validate_runtime_to_review_v2_trial_002_rearm_packet_attempt_002.js") &&
    runNodeCheck("scripts/validate_runtime_to_review_v2_trial_002_binding_ready_execution_packet.js") &&
    runNodeCheck("scripts/validate_runtime_to_review_v2_trial_002_ail_side_binding_preflight.js")
  );
  check("packet_schema_and_identity", () =>
    packet.schema === "runtime_to_review_v2_rearm_execution_packet.v1" &&
    packet.rearm_packet_id === "r2r_v2_trial_002_lantern_ecommerce_hero_rearm_packet_attempt_002_20260609" &&
    packet.trial_id === "r2r_v2_trial_002_lantern_ecommerce_hero" &&
    packet.status === "issued_rearmed_pending_dispatch" &&
    packet.can_execute_now === true &&
    packet.binding_ready === true &&
    packet.dispatch_performed === false &&
    packet.activation_consumed === false &&
    packet.attempt_id === "attempt_002" &&
    packet.attempt_number === 2
  );
  check("source_refs_exist_and_do_not_reuse_attempt_001", () =>
    packet.source_refs.binding_ready_execution_packet_ref === bindingReadyPacketRef &&
    packet.source_refs.attempt_001_failed_closed_receipt_ref === attempt001ReceiptRef &&
    packet.source_refs.binding_ready_precheck_packet_ref === precheckPacketRef &&
    packet.source_refs.ail_side_binding_preflight_ref === ailPreflightRef &&
    packet.source_refs.runtime_task_fixture_ref === fixtureRef &&
    packet.source_refs.exact_runtime_binding_adapter_ref === adapterRef &&
    packet.source_refs.prompt_package_ref === promptRef &&
    packet.attempt_001_failure_addressed.failed_attempt_consumed === true &&
    packet.attempt_001_failure_addressed.must_not_rerun_attempt_001 === true &&
    packet.dispatch_command_after_final_user_go.must_not_reuse_attempt_001 === true &&
    fs.existsSync(repoPath(bindingReadyPacketRef)) &&
    fs.existsSync(repoPath(attempt001ReceiptRef)) &&
    fs.existsSync(repoPath(precheckPacketRef)) &&
    fs.existsSync(repoPath(ailPreflightRef)) &&
    fs.existsSync(repoPath(fixtureRef)) &&
    fs.existsSync(repoPath(adapterRef)) &&
    fs.existsSync(repoPath(promptRef))
  );
  check("predecessor_state_matches_rearm_reason", () =>
    bindingReadyPacket.can_execute_now === true &&
    bindingReadyPacket.binding_ready === true &&
    bindingReadyPacket.dispatch_performed === false &&
    attempt001Receipt.attempt_id === "attempt_001" &&
    attempt001Receipt.status === "failed_closed_route_unreachable_no_image" &&
    attempt001Receipt.result.delegate_blocker === "r2r_v2_trial_002_broker_route_unreachable" &&
    attempt001Receipt.budget_consumption.attempt_consumed === true &&
    attempt001Receipt.budget_consumption.retry_performed === false &&
    precheckPacket.can_execute_now === false &&
    ailPreflight.can_execute_now === false
  );
  check("runtime_route_rearm_evidence_recorded", () =>
    packet.attempt_001_failure_addressed.route_fix_scope === "runtime_service_rearm_only_no_vcptoolbox_code_change" &&
    packet.attempt_001_failure_addressed.vcptoolbox_branch === "main" &&
    packet.attempt_001_failure_addressed.vcptoolbox_head === "ddfc2b1f94616c42712d57e5eb3b3de4fc212b03" &&
    packet.attempt_001_failure_addressed.pm2_process_restarted === "vcp-main" &&
    Number.isInteger(packet.attempt_001_failure_addressed.pm2_pid_after_restart) &&
    packet.attempt_001_failure_addressed.enabled_runtime_switches.includes("ENABLE_AI_IMAGE_AGENTS_ROUTE=true") &&
    packet.attempt_001_failure_addressed.enabled_runtime_switches.includes("ENABLE_AI_IMAGE_REAL_EXECUTION=true") &&
    packet.attempt_001_failure_addressed.enabled_runtime_switches.includes("ENABLE_NATIVE_DOUBAO_SECRETLESS_RUNTIME_DELEGATE=true") &&
    packet.attempt_001_failure_addressed.route_health_check.method === "HEAD" &&
    packet.attempt_001_failure_addressed.route_health_check.expected_status === 204 &&
    packet.attempt_001_failure_addressed.route_health_check.observed_status === 204
  );
  await checkAsync("trial_002_route_head_is_204_now", async () => {
    const status = await headStatus(packet.attempt_001_failure_addressed.route_health_check.url);
    return status === 204;
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
  check("pre_dispatch_checks_include_rearm_and_previous_chain", () =>
    packet.pre_dispatch_checks_required.includes("node scripts/validate_runtime_to_review_v2_trial_002_rearm_packet_attempt_002.js") &&
    packet.pre_dispatch_checks_required.includes("npm run validate:runtime-to-review-trial-002-binding-ready-execution") &&
    packet.pre_dispatch_checks_required.includes("npm run validate:runtime-to-review-trial-002-attempt-001-failed-closed") &&
    packet.pre_dispatch_checks_required.includes("node scripts/validate_runtime_to_review_v2_trial_002_ail_side_binding_preflight.js") &&
    packet.pre_dispatch_checks_required.includes("git diff --check")
  );
  check("side_effect_flags_are_limited_to_head_probe", () =>
    allFalseExcept(packet.side_effect_flags_at_rearm_creation, ["route_health_head_probe_performed"])
  );
  check("stop_conditions_cover_rearm_boundaries", () =>
    packet.stop_conditions.includes("attempt_001_requested_for_rerun") &&
    packet.stop_conditions.includes("trial_002_route_head_not_204") &&
    packet.stop_conditions.includes("adapter_route_task_id_not_binding_ready_activation") &&
    packet.stop_conditions.includes("output_directory_exists") &&
    packet.stop_conditions.includes("retry_requested") &&
    packet.stop_conditions.includes("secret_value_read_required") &&
    packet.stop_conditions.includes("push_tag_release_deploy_requested")
  );
  check("recommended_next_waits_for_attempt_002_execute_instruction", () =>
    packet.recommended_next === "after_user_explicitly_says_execute_attempt_002_run_pre_dispatch_validators_then_dispatch_attempt_002_exactly_once"
  );

  const output = {
    passed,
    validator,
    packet_ref: packetRef,
    can_execute_now: packet.can_execute_now,
    attempt_id: packet.attempt_id,
    route_head_observed_status: packet.attempt_001_failure_addressed.route_health_check.observed_status,
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
