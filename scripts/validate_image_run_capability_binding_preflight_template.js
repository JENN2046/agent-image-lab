#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const docRef = "docs/image_run_capability_binding_preflight_template.md";
const fixtureRef = "tests/schema_examples/image_run_capability_binding_preflight_template.example.json";
const generationFixtureRef = "tests/schema_examples/generation_channel_contract_preflight.example.json";

function readText(ref) {
  return fs.readFileSync(path.join(repoRoot, ref), "utf8");
}

function readJson(ref) {
  return JSON.parse(readText(ref));
}

function exists(ref) {
  return fs.existsSync(path.join(repoRoot, ref));
}

const doc = readText(docRef);
const fixture = readJson(fixtureRef).image_run_capability_binding_preflight_template;
const generationFixture = readJson(generationFixtureRef).generation_channel_contract_preflight;
const results = [];

function check(name, predicate) {
  let passed = false;
  let detail = null;
  try {
    passed = Boolean(predicate());
  } catch (error) {
    detail = error.message;
  }
  results.push(detail ? { check: name, passed, detail } : { check: name, passed });
}

function allFlagsFalse(flags) {
  return Object.values(flags).every((value) => value === false);
}

function arraysEqual(left, right) {
  return Array.isArray(left) &&
    Array.isArray(right) &&
    left.length === right.length &&
    left.every((value, index) => value === right[index]);
}

function loadBinding(ref) {
  return readJson(ref);
}

const contract = fixture.binding_template_contract;
const templates = fixture.trial_binding_templates;
const snapshotsByTrial = new Map(
  generationFixture.trial_contract_snapshots.map((snapshot) => [snapshot.trial_id, snapshot])
);

check("doc_exists", () => doc.length > 0);
check("fixture_phase_matches_doc", () => doc.includes(fixture.phase));
check("parent_refs_exist", () =>
  fixture.parent_contract_ref === "docs/generation_channel_contract_preflight.md" &&
  fixture.parent_plan_ref === "docs/vcptoolbox_image_execution_broker_followup_plan.md" &&
  exists(fixture.parent_contract_ref) &&
  exists(fixture.parent_plan_ref)
);
check("status_is_no_execute_template", () =>
  fixture.status === "local_binding_template_no_execute" &&
  contract.authority_status === "proposed_binding_template_only" &&
  contract.can_execute_now === false &&
  contract.route_http_allowed_by_template === false &&
  contract.external_repo_write_allowed_by_template === false &&
  fixture.automatic_real_execution_allowed_by_this_template === false &&
  fixture.external_repo_write_allowed_by_this_template === false &&
  doc.includes("The template is deliberately not executable")
);
check("dispatch_authority_is_vcptoolbox_not_payload", () =>
  contract.dispatch_authority === "VCPToolBox_internal_binding" &&
  contract.ail_payload_dispatch_authority === false &&
  doc.includes("AIL payload") &&
  doc.includes("must not")
);
check("required_fields_cover_binding_gates", () =>
  [
    "binding_preflight_id",
    "capability_ref_id",
    "activation_id_ref",
    "visual_job_contract_ref",
    "canonical_contract_hash_ref",
    "route_id_or_endpoint_ref",
    "binding_packet_ref",
    "provider_id_ref",
    "plugin_id_ref",
    "api_id_ref",
    "delegate_id_ref",
    "model_allowlist",
    "budget",
    "output_policy_ref",
    "restricted_plugin_facade_boundary_ref",
    "artifact_receipt_gate_ref",
    "review_queue_gate_ref",
    "memory_candidate_gate_ref",
    "stop_conditions",
    "execution_boundary",
  ].every((field) => contract.required_fields.includes(field))
);
check("stable_binding_values_are_single_doubao_path", () => {
  const stable = contract.stable_binding_values;
  return stable.provider_id_ref === "doubao" &&
    stable.plugin_id_ref === "DoubaoGen" &&
    stable.api_id_ref === "generate_image" &&
    stable.delegate_id_ref === "native_doubao_runtime_v1_provider_delegate" &&
    arraysEqual(stable.model_allowlist, ["doubao-seedream-5-0-260128"]) &&
    stable.budget.max_route_http_requests === 1 &&
    stable.budget.max_provider_calls === 1 &&
    stable.budget.max_plugin_calls === 1 &&
    stable.budget.max_api_calls === 1 &&
    stable.budget.max_images === 1 &&
    stable.budget.retry_allowed === false;
});
check("two_trial_templates_present", () =>
  templates.length === 2 &&
  templates[0].trial_id === "r2r_v2_trial_001_serum_detail_control" &&
  templates[1].trial_id === "r2r_v2_trial_002_lantern_ecommerce_hero"
);
check("each_template_has_required_fields", () =>
  templates.every((template) =>
    contract.required_fields.every((field) => Object.prototype.hasOwnProperty.call(template, field))
  )
);

function templateMatchesGenerationSnapshot(template) {
  const snapshot = snapshotsByTrial.get(template.trial_id);
  if (!snapshot) return false;
  const visualJob = snapshot.visual_job_contract;
  const capability = snapshot.image_run_capability_ref;

  return template.capability_ref_id === capability.capability_ref_id &&
    template.activation_id_ref === capability.activation_id_ref &&
    template.visual_job_contract_ref === visualJob.contract_id &&
    template.canonical_contract_hash_ref === "required_from_visual_job_contract" &&
    template.route_id_or_endpoint_ref === capability.route_id_or_endpoint_ref &&
    template.binding_packet_ref === capability.binding_packet_ref &&
    template.provider_id_ref === capability.provider_id_ref &&
    template.plugin_id_ref === capability.plugin_id_ref &&
    template.api_id_ref === capability.api_id_ref &&
    template.delegate_id_ref === capability.delegate_id_ref &&
    arraysEqual(template.model_allowlist, capability.model_allowlist) &&
    template.output_policy_ref.output_directory_ref === visualJob.output_directory_ref &&
    template.output_policy_ref.expected_receipt_ref === visualJob.expected_receipt_ref &&
    template.output_policy_ref.expected_artifact_record_ref === visualJob.expected_artifact_record_ref &&
    template.output_policy_ref.expected_review_bridge_ref === visualJob.expected_review_bridge_ref &&
    capability.payload_must_not_dispatch_arbitrary_plugin_api === true;
}

function templateMatchesBindingPacket(template) {
  const packet = loadBinding(template.binding_packet_ref);
  const binding = packet.execution_binding;
  const budget = packet.single_dispatch_budget;
  const outputPolicy = packet.output_policy;
  const commandArgs = packet.dispatch_command_after_final_user_go.args;

  return packet.schema === "runtime_to_review_v2_binding_ready_execution_packet.v1" &&
    packet.trial_id === template.trial_id &&
    packet.binding_ready === true &&
    packet.dispatch_performed === false &&
    template.can_execute_now === false &&
    packet.can_execute_now === true &&
    template.route_http_allowed_by_this_template === false &&
    binding.route_http_allowed === true &&
    template.external_vcptoolbox_write_allowed_by_this_template === false &&
    binding.activation_package_id === template.activation_id_ref &&
    binding.path === template.route_id_or_endpoint_ref &&
    binding.provider_id === template.provider_id_ref &&
    binding.plugin_id === template.plugin_id_ref &&
    binding.api_id === template.api_id_ref &&
    binding.model_required === template.model_allowlist[0] &&
    commandArgs.includes("adapters/runtime/native_doubao_runtime_v1_provider_delegate.js") &&
    template.delegate_id_ref === "native_doubao_runtime_v1_provider_delegate" &&
    binding.dispatch_source_must_be_binding_not_payload_plugin_field === true &&
    binding.restricted_plugin_facade_required === true &&
    binding.authorization_header_constructed_by_Agent_Image_Lab === false &&
    budget.max_route_http_requests === template.budget.max_route_http_requests &&
    budget.max_provider_calls === template.budget.max_provider_calls &&
    budget.max_plugin_calls === template.budget.max_plugin_calls &&
    budget.max_api_calls === template.budget.max_api_calls &&
    budget.max_images === template.budget.max_images &&
    budget.retry_allowed === template.budget.retry_allowed &&
    outputPolicy.output_scope === template.output_policy_ref.output_scope &&
    outputPolicy.output_directory_ref === template.output_policy_ref.output_directory_ref &&
    outputPolicy.overwrite_existing_files_allowed === false &&
    outputPolicy.expected_receipt_ref === template.output_policy_ref.expected_receipt_ref &&
    outputPolicy.expected_artifact_record_ref === template.output_policy_ref.expected_artifact_record_ref &&
    outputPolicy.expected_review_bridge_ref === template.output_policy_ref.expected_review_bridge_ref &&
    outputPolicy.initial_status_after_generation === "generated_unreviewed" &&
    outputPolicy.review_queue_required_before_archive === true;
}

function templateHasNoExecuteGates(template) {
  const facade = template.restricted_plugin_facade_boundary_ref;
  const review = template.review_queue_gate_ref.default_post_review_writes;
  const memory = template.memory_candidate_gate_ref;
  return template.dispatch_authority === "VCPToolBox_internal_binding" &&
    template.ail_payload_dispatch_authority === false &&
    template.can_execute_now === false &&
    template.route_http_allowed_by_this_template === false &&
    template.external_vcptoolbox_write_allowed_by_this_template === false &&
    template.budget.max_route_http_requests === 1 &&
    template.budget.max_provider_calls === 1 &&
    template.budget.max_plugin_calls === 1 &&
    template.budget.max_api_calls === 1 &&
    template.budget.max_images === 1 &&
    template.budget.retry_allowed === false &&
    template.output_policy_ref.overwrite_existing_files_allowed === false &&
    facade.allowed_plugin_ref === "DoubaoGen" &&
    facade.allowed_api_ref === "generate_image" &&
    facade.allowed_delegate_ref === "native_doubao_runtime_v1_provider_delegate" &&
    facade.max_calls === 1 &&
    facade.distributed_fallback === false &&
    facade.manifest_scan_during_request === false &&
    facade.arbitrary_plugin_name === false &&
    facade.arbitrary_api_name === false &&
    facade.full_pluginManager_exposed_to_route === false &&
    template.artifact_receipt_gate_ref.receipt_ref === template.output_policy_ref.expected_receipt_ref &&
    template.artifact_receipt_gate_ref.artifact_record_ref === template.output_policy_ref.expected_artifact_record_ref &&
    template.artifact_receipt_gate_ref.review_bridge_ref === template.output_policy_ref.expected_review_bridge_ref &&
    template.review_queue_gate_ref.human_review_required_before_archive_or_memory === true &&
    review.accepted_samples_write_allowed === false &&
    review.production_candidate_write_allowed === false &&
    review.DailyNote_write_allowed === false &&
    review.VCP_memory_write_allowed === false &&
    memory.mapping_only_allowed === true &&
    memory.memory_write_default === false &&
    memory.required_for_actual_write.includes("separate_memory_authorization_gate") &&
    template.stop_conditions === "template_stop_conditions" &&
    template.execution_boundary === "execution_boundary";
}

check("templates_match_generation_channel_snapshots", () =>
  templates.every((template) => templateMatchesGenerationSnapshot(template))
);
check("templates_match_historical_binding_packets_as_refs_only", () =>
  templates.every((template) => templateMatchesBindingPacket(template))
);
check("templates_keep_no_execute_gates", () =>
  templates.every((template) => templateHasNoExecuteGates(template))
);
check("required_pre_execution_validation_is_recorded", () =>
  templates.every((template) =>
    template.required_pre_execution_validation.includes("npm run validate:image-run-capability-binding-preflight-template") &&
    template.required_pre_execution_validation.includes("npm run validate:generation-channel-contract-preflight")
  )
);
check("stop_conditions_cover_red_boundaries", () =>
  fixture.template_stop_conditions.includes("external_vcptoolbox_write_requested") &&
  fixture.template_stop_conditions.includes("real_route_or_broker_implementation_requested") &&
  fixture.template_stop_conditions.includes("route_http_request_requested") &&
  fixture.template_stop_conditions.includes("provider_plugin_api_or_image_generation_requested") &&
  fixture.template_stop_conditions.includes("secret_value_read_required") &&
  fixture.template_stop_conditions.includes("push_tag_release_deploy_requested") &&
  fixture.template_stop_conditions.includes("force_push_history_rewrite_or_destructive_action_requested") &&
  doc.includes("modify VCPToolBox or another external repository") &&
  doc.includes("call a route HTTP endpoint, provider, plugin, API, or image generator") &&
  doc.includes("read `.env`, secrets, cookies, tokens") &&
  doc.includes("push, tag, release, deploy")
);
check("execution_boundary_flags_false", () => allFlagsFalse(fixture.execution_boundary));
check("doc_boundary_flags_present", () =>
  Object.keys(fixture.execution_boundary).every((key) => doc.includes(`${key}: false`))
);
check("recommended_next_is_generic_endpoint_gate_after_broker_proposal", () =>
  fixture.completed_previous === "prepare_vcptoolbox_image_execution_broker_implementation_proposal_no_execute" &&
  fixture.completion_refs.includes("docs/vcptoolbox_image_execution_broker_implementation_proposal_no_execute.md") &&
  fixture.completion_refs.includes("tests/schema_examples/vcptoolbox_image_execution_broker_implementation_proposal_no_execute.example.json") &&
  fixture.completion_refs.includes("scripts/validate_vcptoolbox_image_execution_broker_implementation_proposal_no_execute.js") &&
  fixture.completion_refs.every((ref) => exists(ref)) &&
  fixture.recommended_next === "prepare_generic_image_execution_endpoint_gate_no_execute" &&
  doc.includes("prepare_generic_image_execution_endpoint_gate_no_execute")
);

const failed = results.filter((result) => !result.passed);
const output = {
  passed: failed.length === 0,
  validator: "image_run_capability_binding_preflight_template",
  phase: fixture.phase,
  doc_ref: docRef,
  fixture_ref: fixtureRef,
  check_count: results.length,
  failed_count: failed.length,
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  image_generation_performed: false,
  route_http_request_performed: false,
  real_VCPToolBox_read_performed: false,
  external_VCPToolBox_write_performed: false,
  secret_value_read_performed: false,
  file_write_performed: false,
  results,
};

console.log(JSON.stringify(output, null, 2));
if (failed.length > 0) process.exit(1);
