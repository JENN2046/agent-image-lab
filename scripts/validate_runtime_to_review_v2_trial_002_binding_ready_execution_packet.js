#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const validator = "runtime_to_review_v2_trial_002_binding_ready_execution_packet";
const packetRef = "reports/runtime_to_review_v2/r2r_v2_trial_002_lantern_ecommerce_hero_binding_ready_execution_packet_20260609.json";
const noExecutePacketRef = "reports/runtime_to_review_v2/r2r_v2_trial_002_lantern_ecommerce_hero_activation_packet_no_execute_20260608.json";
const precheckPacketRef = "reports/runtime_to_review_v2/r2r_v2_trial_002_lantern_ecommerce_hero_binding_ready_precheck_packet_20260609.json";
const ailPreflightRef = "reports/runtime_to_review_v2/r2r_v2_trial_002_lantern_ecommerce_hero_ail_side_binding_preflight_20260608.json";
const executionTemplateRef = "reports/runtime_to_review_v2/r2r_v2_trial_002_lantern_ecommerce_hero_execution_preflight_template_20260608.json";
const criteriaRef = "reports/runtime_to_review_v2/r2r_v2_trial_002_lantern_ecommerce_hero_review_criteria_no_execute_20260608.json";
const adapterRef = "adapters/runtime/native_doubao_runtime_v2_trial_002_lantern_ecommerce_broker_dispatch_adapter.js";
const fixtureRef = "tests/fixtures/runtime_kernel_v2_trial_002_lantern_ecommerce_hero_task.fixture.json";
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

function main() {
  const packet = readJson(packetRef);
  const noExecutePacket = readJson(noExecutePacketRef);
  const precheckPacket = readJson(precheckPacketRef);
  const ailPreflight = readJson(ailPreflightRef);
  const executionTemplate = readJson(executionTemplateRef);
  const criteria = readJson(criteriaRef);
  const fixture = readJson(fixtureRef);
  const prompt = fs.readFileSync(repoPath(promptRef), "utf8");
  const adapter = require(repoPath(adapterRef));

  check("syntax_clean", () =>
    runNodeCheck(adapterRef) &&
    runNodeCheck("scripts/validate_runtime_to_review_v2_trial_002_binding_ready_execution_packet.js")
  );
  check("packet_schema_and_true_flag", () =>
    packet.schema === "runtime_to_review_v2_binding_ready_execution_packet.v1" &&
    packet.execution_packet_id === "r2r_v2_trial_002_lantern_ecommerce_hero_binding_ready_execution_packet_20260609" &&
    packet.status === "issued_binding_ready_pending_dispatch" &&
    packet.trial_id === "r2r_v2_trial_002_lantern_ecommerce_hero" &&
    packet.can_execute_now === true &&
    packet.binding_ready === true &&
    packet.dispatch_performed === false &&
    packet.activation_consumed === false &&
    packet.execution_conditions_locked === true
  );
  check("source_refs_exist_and_align", () =>
    packet.source_refs.no_execute_packet_ref === noExecutePacketRef &&
    packet.source_refs.binding_ready_precheck_packet_ref === precheckPacketRef &&
    packet.source_refs.ail_side_binding_preflight_ref === ailPreflightRef &&
    packet.source_refs.execution_preflight_template_ref === executionTemplateRef &&
    packet.source_refs.review_criteria_ref === criteriaRef &&
    packet.source_refs.exact_runtime_binding_adapter_ref === adapterRef &&
    packet.source_refs.runtime_task_fixture_ref === fixtureRef &&
    packet.source_refs.prompt_package_ref === promptRef &&
    fs.existsSync(repoPath(noExecutePacketRef)) &&
    fs.existsSync(repoPath(precheckPacketRef)) &&
    fs.existsSync(repoPath(ailPreflightRef)) &&
    fs.existsSync(repoPath(executionTemplateRef)) &&
    fs.existsSync(repoPath(criteriaRef)) &&
    fs.existsSync(repoPath(adapterRef)) &&
    fs.existsSync(repoPath(fixtureRef)) &&
    fs.existsSync(repoPath(promptRef))
  );
  check("predecessors_remain_non_dispatch_records", () =>
    noExecutePacket.can_execute_now === false &&
    precheckPacket.can_execute_now === false &&
    precheckPacket.binding_ready === false &&
    ailPreflight.can_execute_now === false &&
    executionTemplate.can_execute_now === false
  );
  check("external_vcptoolbox_binding_proof_is_complete", () =>
    packet.external_binding_proof.target_system === "VCPToolBox" &&
    packet.external_binding_proof.repo === "JENN2046/VCPToolBox" &&
    packet.external_binding_proof.local_branch_verified === "main" &&
    packet.external_binding_proof.local_main_head_verified === "ddfc2b1f94616c42712d57e5eb3b3de4fc212b03" &&
    packet.external_binding_proof.origin_main_head_verified === "ddfc2b1f94616c42712d57e5eb3b3de4fc212b03" &&
    packet.external_binding_proof.binding_route_merge_commit === "51bbfad7f53c0acba43eddead1c1508519d2029d" &&
    packet.external_binding_proof.output_ref_agreement_merge_commit === "ddfc2b1f94616c42712d57e5eb3b3de4fc212b03" &&
    packet.external_binding_proof.required_route_path === adapter.routePath &&
    packet.external_binding_proof.route_bound === true &&
    packet.external_binding_proof.internal_authorizer_bound === true &&
    packet.external_binding_proof.restricted_plugin_facade_bound === true &&
    packet.external_binding_proof.native_delegate_binding_bound === true &&
    packet.external_binding_proof.bound_output_directory_enforced === true &&
    packet.external_binding_proof.contract_and_step_output_refs_must_agree === true &&
    packet.external_binding_proof.proof_verified === true
  );
  check("execution_binding_matches_adapter_fixture", () =>
    packet.execution_binding.target_runtime === adapterRef &&
    packet.execution_binding.target_runtime_module_id === adapter.moduleId &&
    packet.execution_binding.activation_package_id === adapter.routeTaskId &&
    packet.execution_binding.prompt_package_ref === adapter.allowedPromptPackageRef &&
    packet.execution_binding.output_directory_ref === adapter.allowedOutputDirectory &&
    packet.execution_binding.path === adapter.routePath &&
    packet.execution_binding.model_required === adapter.requiredModel &&
    packet.execution_binding.resolution === adapter.resolution &&
    fixture.prompt_package_ref === adapter.allowedPromptPackageRef &&
    fixture.output_directory_ref === adapter.allowedOutputDirectory &&
    fixture.max_images === 1 &&
    fixture.retry_allowed === false
  );
  check("secretless_and_no_agent_auth_header", () =>
    packet.execution_binding.secretless_activation_required === true &&
    packet.execution_binding.secretless_bridge_allowlist_validated === true &&
    packet.execution_binding.dispatch_source_must_be_binding_not_payload_plugin_field === true &&
    packet.execution_binding.restricted_plugin_facade_required === true &&
    packet.execution_binding.authorization_header_constructed_by_Agent_Image_Lab === false
  );
  check("budget_one_each_zero_retry", () =>
    packet.single_dispatch_budget.max_route_http_requests === 1 &&
    packet.single_dispatch_budget.max_provider_calls === 1 &&
    packet.single_dispatch_budget.max_plugin_calls === 1 &&
    packet.single_dispatch_budget.max_api_calls === 1 &&
    packet.single_dispatch_budget.max_images === 1 &&
    packet.single_dispatch_budget.max_live_probe_attempts === 1 &&
    packet.single_dispatch_budget.retry_allowed === false
  );
  check("dispatch_command_is_exact_and_waits_for_final_go", () =>
    packet.dispatch_command_after_final_user_go.command === "node" &&
    packet.dispatch_command_after_final_user_go.args.includes("scripts/run_runtime_to_review_v1_guarded_live_probe.js") &&
    packet.dispatch_command_after_final_user_go.args.includes("--input") &&
    packet.dispatch_command_after_final_user_go.args.includes(fixtureRef) &&
    packet.dispatch_command_after_final_user_go.args.includes("--provider-delegate-module") &&
    packet.dispatch_command_after_final_user_go.args.includes("adapters/runtime/native_doubao_runtime_v1_provider_delegate.js") &&
    packet.dispatch_command_after_final_user_go.args.includes("--owner-runtime-module") &&
    packet.dispatch_command_after_final_user_go.args.includes(adapterRef) &&
    packet.dispatch_command_after_final_user_go.args.includes("--confirm-live-provider-probe") &&
    packet.dispatch_command_after_final_user_go.args.includes("RUNTIME_TO_REVIEW_V1_ONE_PROVIDER_ONE_IMAGE") &&
    packet.dispatch_command_after_final_user_go.args.includes("--max-images") &&
    packet.dispatch_command_after_final_user_go.args.includes("1") &&
    packet.dispatch_command_after_final_user_go.requires_separate_final_user_go === true &&
    packet.dispatch_command_after_final_user_go.must_not_add_retry_flags === true &&
    packet.dispatch_command_after_final_user_go.must_not_override_prompt_or_output === true
  );
  check("route_payload_output_refs_are_bound_in_packet_and_adapter", () => {
    const body = adapter._private.routeRequestBody({
      prompt: "PROMPT_PLACEHOLDER",
      model: adapter.requiredModel,
      outputDirectory: adapter.allowedOutputDirectory,
    });
    return packet.route_payload_output_ref_requirements["visual_job_contract.output_directory_ref"] === outputDir &&
      packet.route_payload_output_ref_requirements["plan.steps[0].output_directory_ref"] === outputDir &&
      packet.route_payload_output_ref_requirements.refs_must_be_equal === true &&
      packet.route_payload_output_ref_requirements.refs_must_match_bound_directory === true &&
      body.taskId === adapter.routeTaskId &&
      body.activation.activation_package_id === adapter.routeTaskId &&
      body.visual_job_contract.output_directory_ref === outputDir &&
      body.plan.steps.length === 1 &&
      body.plan.steps[0].output_directory_ref === outputDir &&
      body.plan.steps[0].output_directory_ref === body.visual_job_contract.output_directory_ref;
  });
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
  check("pre_dispatch_checks_include_binding_ready_chain", () =>
    packet.pre_dispatch_checks_required.includes("node scripts/validate_runtime_to_review_v2_trial_002_ail_side_binding_preflight.js") &&
    packet.pre_dispatch_checks_required.includes("node scripts/validate_runtime_to_review_v2_trial_002_binding_ready_precheck_packet.js") &&
    packet.pre_dispatch_checks_required.includes("node scripts/validate_runtime_to_review_v2_trial_002_binding_ready_execution_packet.js") &&
    packet.pre_dispatch_checks_required.includes("node scripts/validate_runtime_to_review_v2_trial_002_activation_packet_no_execute.js") &&
    packet.pre_dispatch_checks_required.includes("node scripts/validate_runtime_to_review_v2_trial_002_review_and_execution_preflight_templates.js") &&
    packet.pre_dispatch_checks_required.includes("node scripts/validate_prompt_schema.js --type prompt_package prompts/image_generation/product_lifestyle_premium_portable_led_camping_lantern_v2.yaml") &&
    packet.pre_dispatch_checks_required.includes("git diff --check")
  );
  check("prompt_and_review_focus_remain_trial_002_lantern", () =>
    criteria.trial_id === packet.trial_id &&
    packet.review_focus_after_generation.includes("lantern_ecommerce_hero_readability") &&
    packet.review_focus_after_generation.includes("full_handle_diffuser_dimmer_body_and_base_visible") &&
    packet.review_focus_after_generation.includes("no_brand_text_logo_watermark_or_readable_label") &&
    prompt.includes("premium portable LED camping lantern") &&
    prompt.includes("full handle, diffuser, dimmer knob, body, and base visible") &&
    prompt.includes("No brand text") &&
    !prompt.includes("serum bottle")
  );
  check("stop_conditions_cover_trial_002_binding_boundaries", () =>
    packet.stop_conditions.includes("external_vcptoolbox_main_not_at_required_binding_proof_commit") &&
    packet.stop_conditions.includes("external_vcptoolbox_output_ref_agreement_missing_or_unproven") &&
    packet.stop_conditions.includes("visual_job_contract_output_directory_ref_not_bound") &&
    packet.stop_conditions.includes("plan_step_output_directory_ref_not_bound") &&
    packet.stop_conditions.includes("visual_job_contract_and_plan_step_output_refs_do_not_match") &&
    packet.stop_conditions.includes("output_directory_exists") &&
    packet.stop_conditions.includes("expected_receipt_or_artifact_record_or_review_bridge_already_exists") &&
    packet.stop_conditions.includes("budget_not_exactly_one_route_one_provider_one_plugin_one_api_one_image") &&
    packet.stop_conditions.includes("retry_requested") &&
    packet.stop_conditions.includes("secret_value_read_required") &&
    packet.stop_conditions.includes("authorization_header_constructed_by_Agent_Image_Lab") &&
    packet.stop_conditions.includes("accepted_samples_or_production_or_memory_write_requested_before_review") &&
    packet.stop_conditions.includes("push_tag_release_deploy_requested")
  );
  check("side_effect_flags_false_at_creation", () => allFalse(packet.side_effect_flags_at_packet_creation));
  check("recommended_next_is_dispatch_after_validators", () =>
    packet.recommended_next === "run_pre_dispatch_validators_then_dispatch_exactly_once_when_user_says_execute_trial_002"
  );

  const output = {
    passed,
    validator,
    packet_ref: packetRef,
    can_execute_now: true,
    binding_ready: true,
    dispatch_performed: false,
    activation_consumed: false,
    route_http_request_performed: false,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    output_write_performed: false,
    external_vcptoolbox_write_performed: false,
    check_count: results.length,
    failed_count: results.filter((result) => !result.passed).length,
    results,
  };
  process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
  if (!passed) process.exitCode = 1;
}

main();
