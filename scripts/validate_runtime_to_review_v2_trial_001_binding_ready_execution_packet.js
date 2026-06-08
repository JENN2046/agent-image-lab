#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const validator = "runtime_to_review_v2_trial_001_binding_ready_execution_packet";
const packetRef = "reports/runtime_to_review_v2/r2r_v2_trial_001_serum_detail_control_binding_ready_execution_packet_20260608.json";
const futurePacketRef = "reports/runtime_to_review_v2/r2r_v2_trial_001_serum_detail_control_future_execution_packet_20260608.json";
const adapterRef = "adapters/runtime/native_doubao_runtime_v2_trial_001_serum_detail_broker_dispatch_adapter.js";
const fixtureRef = "tests/fixtures/runtime_kernel_v2_trial_001_serum_detail_control_task.fixture.json";
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
  const futurePacket = readJson(futurePacketRef);
  const fixture = readJson(fixtureRef);
  const prompt = fs.readFileSync(repoPath(promptRef), "utf8");
  const adapter = require(repoPath(adapterRef));

  check("packet_schema_and_true_flag", () =>
    packet.schema === "runtime_to_review_v2_binding_ready_execution_packet.v1" &&
    packet.execution_packet_id === "r2r_v2_trial_001_serum_detail_control_binding_ready_execution_packet_20260608" &&
    packet.status === "issued_binding_ready_pending_dispatch" &&
    packet.trial_id === "r2r_v2_trial_001_serum_detail_control" &&
    packet.can_execute_now === true &&
    packet.binding_ready === true &&
    packet.dispatch_performed === false &&
    packet.activation_consumed === false &&
    packet.execution_conditions_locked === true
  );
  check("source_refs_exist_and_align", () =>
    packet.source_refs.future_execution_packet_ref === futurePacketRef &&
    packet.source_refs.exact_runtime_binding_adapter_ref === adapterRef &&
    packet.source_refs.runtime_task_fixture_ref === fixtureRef &&
    packet.source_refs.prompt_package_ref === promptRef &&
    fs.existsSync(repoPath(futurePacketRef)) &&
    fs.existsSync(repoPath(adapterRef)) &&
    fs.existsSync(repoPath(fixtureRef)) &&
    fs.existsSync(repoPath(promptRef))
  );
  check("future_packet_is_predecessor_not_dispatch", () =>
    futurePacket.status === "issued_pending_exact_runtime_binding_no_dispatch" &&
    futurePacket.can_execute_now === false &&
    futurePacket.dispatch_performed === false
  );
  check("binding_matches_adapter_and_fixture", () =>
    packet.execution_binding.target_runtime === adapterRef &&
    packet.execution_binding.target_runtime_module_id === adapter.moduleId &&
    packet.execution_binding.prompt_package_ref === adapter.allowedPromptPackageRef &&
    packet.execution_binding.output_directory_ref === adapter.allowedOutputDirectory &&
    fixture.prompt_package_ref === adapter.allowedPromptPackageRef &&
    fixture.output_directory_ref === adapter.allowedOutputDirectory &&
    fixture.max_images === 1 &&
    fixture.retry_allowed === false
  );
  check("execution_binding_is_exact_and_secretless", () =>
    packet.execution_binding.lane === "Amber_B_provider_image" &&
    packet.execution_binding.owner_confirmation_phrase === "RUNTIME_TO_REVIEW_V2_TRIAL_001_ONE_PROVIDER_ONE_IMAGE" &&
    packet.execution_binding.runner_confirmation_phrase === "RUNTIME_TO_REVIEW_V1_ONE_PROVIDER_ONE_IMAGE" &&
    packet.execution_binding.provider_route === "native_doubao_guarded" &&
    packet.execution_binding.provider_mode === "real_guarded" &&
    packet.execution_binding.provider_id === "doubao" &&
    packet.execution_binding.plugin_id === "DoubaoGen" &&
    packet.execution_binding.api_id === "generate_image" &&
    packet.execution_binding.model_required === "doubao-seedream-5-0-260128" &&
    packet.execution_binding.resolution === "1920x1920" &&
    packet.execution_binding.secretless_activation_required === true &&
    packet.execution_binding.secretless_bridge_allowlist_validated === true &&
    packet.execution_binding.dispatch_source_must_be_binding_not_payload_plugin_field === true &&
    packet.execution_binding.restricted_plugin_facade_required === true &&
    packet.execution_binding.route_http_allowed === true &&
    packet.execution_binding.method === "POST" &&
    packet.execution_binding.origin === "http://127.0.0.1:6005" &&
    packet.execution_binding.path === adapter.routePath &&
    packet.execution_binding.authorization_header_constructed_by_Agent_Image_Lab === false
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
  check("dispatch_command_is_exact_and_non_retrying", () =>
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
    packet.dispatch_command_after_final_user_go.must_not_add_retry_flags === true &&
    packet.dispatch_command_after_final_user_go.must_not_override_prompt_or_output === true
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
    packet.pre_dispatch_checks_required.includes("node scripts/validate_runtime_to_review_v2_trial_001_exact_runtime_binding.js") &&
    packet.pre_dispatch_checks_required.includes("node scripts/validate_runtime_to_review_v2_trial_001_binding_ready_execution_packet.js") &&
    packet.pre_dispatch_checks_required.includes("node scripts/validate_runtime_to_review_v2_trial_001_future_execution_packet.js") &&
    packet.pre_dispatch_checks_required.includes("node scripts/validate_runtime_to_review_v2_trial_001_execution_readiness_preflight.js") &&
    packet.pre_dispatch_checks_required.includes("node scripts/validate_runtime_to_review_v2_trial_001_activation_packet_no_execute.js") &&
    packet.pre_dispatch_checks_required.includes("git diff --check")
  );
  check("review_focus_and_prompt_remain_correct", () =>
    packet.review_focus_after_generation.includes("intentionally_blank_label_boundary") &&
    packet.review_focus_after_generation.includes("cap_and_bottle_geometry") &&
    packet.review_focus_after_generation.includes("material_reflection_control") &&
    packet.review_focus_after_generation.includes("no_readable_text_logo_or_decorative_mark") &&
    packet.review_focus_after_generation.includes("full_bottle_visible_from_pipette_to_base") &&
    packet.review_focus_after_generation.includes("no_cropped_bottle_bottom") &&
    prompt.includes("intentionally blank label") &&
    !prompt.includes("brandable")
  );
  check("stop_conditions_cover_red_boundaries", () =>
    packet.stop_conditions.includes("exact_v2_runtime_binding_validator_fails") &&
    packet.stop_conditions.includes("binding_ready_packet_validator_fails") &&
    packet.stop_conditions.includes("output_directory_exists") &&
    packet.stop_conditions.includes("budget_not_exactly_one_route_one_provider_one_plugin_one_api_one_image") &&
    packet.stop_conditions.includes("retry_requested") &&
    packet.stop_conditions.includes("secret_value_read_required") &&
    packet.stop_conditions.includes("authorization_header_constructed_by_Agent_Image_Lab") &&
    packet.stop_conditions.includes("accepted_samples_or_production_or_memory_write_requested_before_review") &&
    packet.stop_conditions.includes("push_tag_release_deploy_requested")
  );
  check("side_effect_flags_false_at_creation", () => allFalse(packet.side_effect_flags_at_packet_creation));
  check("recommended_next_is_dispatch_after_validators", () =>
    packet.recommended_next === "run_pre_dispatch_validators_then_dispatch_exactly_once_when_user_says_execute_trial_001"
  );

  const output = {
    passed,
    validator,
    packet_ref: packetRef,
    check_count: results.length,
    failed_count: results.filter((result) => !result.passed).length,
    route_http_request_performed: false,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    file_write_performed: false,
    results,
  };
  process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
  if (!passed) process.exitCode = 1;
}

main();
