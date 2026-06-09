#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const validator = "runtime_to_review_v2_trial_002_binding_ready_precheck_packet";
const packetRef = "reports/runtime_to_review_v2/r2r_v2_trial_002_lantern_ecommerce_hero_binding_ready_precheck_packet_20260609.json";
const noExecutePacketRef = "reports/runtime_to_review_v2/r2r_v2_trial_002_lantern_ecommerce_hero_activation_packet_no_execute_20260608.json";
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
  const ailPreflight = readJson(ailPreflightRef);
  const executionTemplate = readJson(executionTemplateRef);
  const criteria = readJson(criteriaRef);
  const fixture = readJson(fixtureRef);
  const prompt = fs.readFileSync(repoPath(promptRef), "utf8");
  const adapter = require(repoPath(adapterRef));

  check("syntax_clean", () =>
    runNodeCheck("scripts/validate_runtime_to_review_v2_trial_002_binding_ready_precheck_packet.js")
  );
  check("packet_schema_and_blocked_precheck_state", () =>
    packet.schema === "runtime_to_review_v2_binding_ready_precheck_packet.v1" &&
    packet.packet_id === "r2r_v2_trial_002_lantern_ecommerce_hero_binding_ready_precheck_packet_20260609" &&
    packet.status === "prepared_binding_ready_precheck_blocked_external_route_pending" &&
    packet.trial_id === "r2r_v2_trial_002_lantern_ecommerce_hero" &&
    packet.can_execute_now === false &&
    packet.binding_ready === false &&
    packet.dispatch_performed === false &&
    packet.activation_consumed === false &&
    packet.execution_conditions_locked === true
  );
  check("source_refs_exist_and_align", () =>
    packet.source_refs.no_execute_packet_ref === noExecutePacketRef &&
    packet.source_refs.ail_side_binding_preflight_ref === ailPreflightRef &&
    packet.source_refs.execution_preflight_template_ref === executionTemplateRef &&
    packet.source_refs.review_criteria_ref === criteriaRef &&
    packet.source_refs.adapter_ref === adapterRef &&
    packet.source_refs.fixture_ref === fixtureRef &&
    packet.source_refs.prompt_package_ref === promptRef &&
    fs.existsSync(repoPath(noExecutePacketRef)) &&
    fs.existsSync(repoPath(ailPreflightRef)) &&
    fs.existsSync(repoPath(executionTemplateRef)) &&
    fs.existsSync(repoPath(criteriaRef)) &&
    fs.existsSync(repoPath(adapterRef)) &&
    fs.existsSync(repoPath(fixtureRef)) &&
    fs.existsSync(repoPath(promptRef))
  );
  check("predecessors_remain_non_executable", () =>
    noExecutePacket.can_execute_now === false &&
    ailPreflight.can_execute_now === false &&
    ailPreflight.binding_ready === false &&
    executionTemplate.can_execute_now === false &&
    executionTemplate.binding_ready === false &&
    executionTemplate.future_dispatch_command_after_external_binding_and_binding_ready_packet.must_not_run_from_this_template === true
  );
  check("candidate_binding_ready_packet_is_future_only", () =>
    packet.candidate_binding_ready_packet_requirements.schema === "runtime_to_review_v2_binding_ready_execution_packet.v1" &&
    packet.candidate_binding_ready_packet_requirements.future_can_execute_now === true &&
    packet.candidate_binding_ready_packet_requirements.future_binding_ready === true &&
    packet.candidate_binding_ready_packet_requirements.future_dispatch_performed === false &&
    packet.candidate_binding_ready_packet_requirements.future_activation_consumed === false &&
    packet.candidate_binding_ready_packet_requirements.must_not_be_issued_until_all_prechecks_pass === true
  );
  check("external_binding_remains_unproven_blocker", () =>
    packet.blocking_reason_before_binding_ready === "external_vcptoolbox_trial_002_internal_route_and_authorizer_not_bound" &&
    packet.external_binding_precheck.target_system === "VCPToolBox" &&
    packet.external_binding_precheck.required_route_path === adapter.routePath &&
    packet.external_binding_precheck.current_result === "not_verified_in_agent_image_lab" &&
    packet.external_binding_precheck.proof_required_before_future_can_execute_now === true &&
    packet.external_binding_precheck.proof_must_be_separate_from_this_packet === true
  );
  check("exact_execution_binding_matches_adapter_fixture", () =>
    packet.exact_execution_binding_if_unblocked_later.target_runtime === adapterRef &&
    packet.exact_execution_binding_if_unblocked_later.target_runtime_module_id === adapter.moduleId &&
    packet.exact_execution_binding_if_unblocked_later.prompt_package_ref === adapter.allowedPromptPackageRef &&
    packet.exact_execution_binding_if_unblocked_later.output_directory_ref === adapter.allowedOutputDirectory &&
    packet.exact_execution_binding_if_unblocked_later.path === adapter.routePath &&
    packet.exact_execution_binding_if_unblocked_later.model_required === adapter.requiredModel &&
    packet.exact_execution_binding_if_unblocked_later.resolution === adapter.resolution &&
    fixture.prompt_package_ref === adapter.allowedPromptPackageRef &&
    fixture.output_directory_ref === adapter.allowedOutputDirectory &&
    fixture.max_images === 1 &&
    fixture.retry_allowed === false
  );
  check("secretless_and_no_agent_auth_header", () =>
    packet.exact_execution_binding_if_unblocked_later.secretless_activation_required === true &&
    packet.exact_execution_binding_if_unblocked_later.secretless_bridge_allowlist_validated === true &&
    packet.exact_execution_binding_if_unblocked_later.restricted_plugin_facade_required === true &&
    packet.exact_execution_binding_if_unblocked_later.authorization_header_constructed_by_Agent_Image_Lab === false
  );
  check("budget_one_each_zero_retry", () =>
    packet.single_dispatch_budget_if_unblocked_later.max_route_http_requests === 1 &&
    packet.single_dispatch_budget_if_unblocked_later.max_provider_calls === 1 &&
    packet.single_dispatch_budget_if_unblocked_later.max_plugin_calls === 1 &&
    packet.single_dispatch_budget_if_unblocked_later.max_api_calls === 1 &&
    packet.single_dispatch_budget_if_unblocked_later.max_images === 1 &&
    packet.single_dispatch_budget_if_unblocked_later.max_live_probe_attempts === 1 &&
    packet.single_dispatch_budget_if_unblocked_later.retry_allowed === false
  );
  check("dispatch_command_is_future_only_and_non_retrying", () =>
    packet.dispatch_command_after_future_binding_ready_packet_and_final_user_go.command === "node" &&
    packet.dispatch_command_after_future_binding_ready_packet_and_final_user_go.args.includes("scripts/run_runtime_to_review_v1_guarded_live_probe.js") &&
    packet.dispatch_command_after_future_binding_ready_packet_and_final_user_go.args.includes(fixtureRef) &&
    packet.dispatch_command_after_future_binding_ready_packet_and_final_user_go.args.includes(adapterRef) &&
    packet.dispatch_command_after_future_binding_ready_packet_and_final_user_go.args.includes("RUNTIME_TO_REVIEW_V1_ONE_PROVIDER_ONE_IMAGE") &&
    packet.dispatch_command_after_future_binding_ready_packet_and_final_user_go.args.includes("1") &&
    packet.dispatch_command_after_future_binding_ready_packet_and_final_user_go.must_not_run_from_this_precheck_packet === true &&
    packet.dispatch_command_after_future_binding_ready_packet_and_final_user_go.must_not_add_retry_flags === true &&
    packet.dispatch_command_after_future_binding_ready_packet_and_final_user_go.must_not_override_prompt_or_output === true &&
    packet.dispatch_command_after_future_binding_ready_packet_and_final_user_go.requires_separate_binding_ready_packet_with_can_execute_now_true === true
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
  check("prechecks_cover_current_validator_chain", () => {
    const commands = packet.prechecks_required_before_future_binding_ready_packet
      .map((item) => item.command)
      .filter(Boolean);
    return commands.includes("node scripts/validate_runtime_to_review_v2_trial_002_ail_side_binding_preflight.js") &&
      commands.includes("node scripts/validate_runtime_to_review_v2_trial_002_activation_packet_no_execute.js") &&
      commands.includes("node scripts/validate_runtime_to_review_v2_trial_002_review_and_execution_preflight_templates.js") &&
      commands.includes("node scripts/validate_prompt_schema.js --type prompt_package prompts/image_generation/product_lifestyle_premium_portable_led_camping_lantern_v2.yaml") &&
      commands.includes("git diff --check");
  });
  check("prechecks_keep_external_binding_as_required", () =>
    packet.prechecks_required_before_future_binding_ready_packet.some((item) =>
      item.check === "external_vcptoolbox_trial_002_route_and_authorizer_bound" &&
      item.current_result === "not_verified_in_agent_image_lab" &&
      item.must_be_true_before_future_can_execute_now === true
    )
  );
  check("prompt_and_review_criteria_still_match_lantern", () =>
    criteria.trial_id === packet.trial_id &&
    prompt.includes("premium portable LED camping lantern") &&
    prompt.includes("full handle, diffuser, dimmer knob, body, and base visible") &&
    prompt.includes("No brand text") &&
    !prompt.includes("serum bottle")
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
  check("hard_stops_cover_red_boundaries", () =>
    packet.hard_stop_before_future_binding_ready_packet.includes("external_vcptoolbox_trial_002_route_binding_missing_or_unproven") &&
    packet.hard_stop_before_future_binding_ready_packet.includes("external_vcptoolbox_authorizer_binding_missing_or_unproven") &&
    packet.hard_stop_before_future_binding_ready_packet.includes("output_directory_exists") &&
    packet.hard_stop_before_future_binding_ready_packet.includes("expected_receipt_or_artifact_record_or_review_bridge_already_exists") &&
    packet.hard_stop_before_future_binding_ready_packet.includes("budget_not_exactly_one_route_one_provider_one_plugin_one_api_one_image") &&
    packet.hard_stop_before_future_binding_ready_packet.includes("retry_requested") &&
    packet.hard_stop_before_future_binding_ready_packet.includes("secret_value_read_required") &&
    packet.hard_stop_before_future_binding_ready_packet.includes("authorization_header_constructed_by_Agent_Image_Lab") &&
    packet.hard_stop_before_future_binding_ready_packet.includes("accepted_samples_or_archive_or_production_or_memory_write_requested_before_review") &&
    packet.hard_stop_before_future_binding_ready_packet.includes("push_tag_release_deploy_requested")
  );
  check("side_effect_flags_false_at_creation", () => allFalse(packet.side_effect_flags_at_packet_creation));
  check("recommended_next_requires_external_binding_proof", () =>
    packet.recommended_next === "obtain_or_prepare_separate_external_vcptoolbox_trial_002_route_authorizer_binding_proof_before_issuing_binding_ready_execution_packet"
  );

  const output = {
    passed,
    validator,
    packet_ref: packetRef,
    can_execute_now: false,
    binding_ready: false,
    blocking_reason_before_binding_ready: packet.blocking_reason_before_binding_ready,
    check_count: results.length,
    failed_count: results.filter((result) => !result.passed).length,
    route_http_request_performed: false,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    output_write_performed: false,
    external_vcptoolbox_write_performed: false,
    results,
  };
  process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
  if (!passed) process.exitCode = 1;
}

main();
