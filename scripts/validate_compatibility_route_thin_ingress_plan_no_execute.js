#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const docRef = "docs/compatibility_route_thin_ingress_plan_no_execute.md";
const fixtureRef = "tests/schema_examples/compatibility_route_thin_ingress_plan_no_execute.example.json";
const bindingTemplateRef = "tests/schema_examples/image_run_capability_binding_preflight_template.example.json";

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
const fixture = readJson(fixtureRef).compatibility_route_thin_ingress_plan_no_execute;
const bindingTemplate = readJson(bindingTemplateRef).image_run_capability_binding_preflight_template;
const bindingTemplatesByTrial = new Map(
  bindingTemplate.trial_binding_templates.map((template) => [template.trial_id, template])
);
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

function loadBinding(ref) {
  return readJson(ref);
}

const contract = fixture.thin_ingress_contract;
const routes = fixture.compatibility_routes;

check("doc_exists", () => doc.length > 0);
check("fixture_phase_matches_doc", () => doc.includes(fixture.phase));
check("parent_refs_exist", () =>
  fixture.parent_binding_template_ref === "docs/image_run_capability_binding_preflight_template.md" &&
  fixture.parent_plan_ref === "docs/vcptoolbox_image_execution_broker_followup_plan.md" &&
  exists(fixture.parent_binding_template_ref) &&
  exists(fixture.parent_plan_ref) &&
  Object.values(fixture.source_refs).every((ref) => exists(ref))
);
check("status_is_no_execute_thin_ingress_plan", () =>
  fixture.status === "local_thin_ingress_plan_no_execute" &&
  contract.authority_status === "compatibility_plan_only" &&
  contract.route_http_allowed_by_this_plan === false &&
  contract.external_repo_write_allowed_by_this_plan === false &&
  fixture.automatic_real_execution_allowed_by_this_plan === false &&
  fixture.external_repo_write_allowed_by_this_plan === false &&
  doc.includes("It does not implement a route")
);
check("route_role_is_identity_and_transport_only", () =>
  contract.route_role === "identity_and_transport_only" &&
  contract.current_endpoint_status === "compatibility_shim_until_broker_ready" &&
  doc.includes("transport and identity admission only")
);
check("route_dispatch_authority_is_false", () =>
  contract.provider_dispatch_allowed_by_route === false &&
  contract.plugin_dispatch_allowed_by_route === false &&
  contract.api_dispatch_allowed_by_route === false &&
  contract.output_path_decision_allowed_by_route === false &&
  contract.retry_decision_allowed_by_route === false
);
check("required_fields_cover_route_binding_gates", () =>
  [
    "route_id_or_endpoint_ref",
    "route_identity",
    "activation_id_ref",
    "visual_job_contract_ref",
    "canonical_contract_hash_ref",
    "image_run_capability_binding_preflight_ref",
    "binding_packet_ref",
    "output_policy_ref",
    "restricted_plugin_facade_boundary_ref",
    "artifact_receipt_gate_ref",
    "review_queue_gate_ref",
    "memory_candidate_gate_ref",
    "thin_ingress_constraints",
    "migration_gate",
    "stop_conditions",
    "execution_boundary",
  ].every((field) => contract.required_fields.includes(field))
);
check("allowed_behavior_is_ref_transport_only", () =>
  fixture.allowed_thin_ingress_behavior.includes("accept_activation_id_ref_as_identifier") &&
  fixture.allowed_thin_ingress_behavior.includes("accept_visual_job_contract_ref_as_identifier") &&
  fixture.allowed_thin_ingress_behavior.includes("accept_image_run_capability_binding_preflight_ref_as_identifier") &&
  fixture.allowed_thin_ingress_behavior.includes("reject_payload_supplied_provider_plugin_api_delegate_model_output_retry_overrides")
);
check("forbidden_route_authority_is_complete", () =>
  [
    "provider_id_selection",
    "plugin_id_selection",
    "api_id_selection",
    "delegate_id_selection",
    "model_selection",
    "output_directory_selection",
    "retry_or_budget_selection",
    "DailyNote_or_VCP_memory_write",
    "secret_or_auth_header_construction_by_AIL",
    "full_pluginManager_access",
  ].every((item) => fixture.forbidden_route_authority.includes(item))
);
check("two_current_compatibility_routes_present", () =>
  routes.length === 2 &&
  routes[0].trial_id === "r2r_v2_trial_001_serum_detail_control" &&
  routes[1].trial_id === "r2r_v2_trial_002_lantern_ecommerce_hero"
);
check("generic_endpoint_is_future_not_enabled", () =>
  contract.generic_endpoint_candidate === "/internal/agent-image-lab/executions/run" &&
  contract.generic_endpoint_enabled_now === false &&
  fixture.generic_endpoint_migration_gate.generic_endpoint_candidate === contract.generic_endpoint_candidate &&
  fixture.generic_endpoint_migration_gate.generic_endpoint_enabled_now === false &&
  fixture.generic_endpoint_migration_gate.migration_allowed_now === false &&
  fixture.generic_endpoint_migration_gate.required_before_enable.includes("VCPToolBox_broker_implementation_packet_exactly_authorized") &&
  fixture.generic_endpoint_migration_gate.required_before_enable.includes("rollback_or_route_restore_plan_present") &&
  doc.includes("generic_endpoint_enabled_now: false")
);

function routeMatchesBindingTemplate(route) {
  const template = bindingTemplatesByTrial.get(route.trial_id);
  if (!template) return false;
  return route.route_id_or_endpoint_ref === template.route_id_or_endpoint_ref &&
    route.activation_id_ref === template.activation_id_ref &&
    route.visual_job_contract_ref === template.visual_job_contract_ref &&
    route.canonical_contract_hash_ref === template.canonical_contract_hash_ref &&
    route.image_run_capability_binding_preflight_ref === template.binding_preflight_id &&
    route.binding_packet_ref === template.binding_packet_ref &&
    route.output_policy_ref.output_directory_ref === template.output_policy_ref.output_directory_ref &&
    route.output_policy_ref.expected_receipt_ref === template.output_policy_ref.expected_receipt_ref &&
    route.output_policy_ref.expected_artifact_record_ref === template.output_policy_ref.expected_artifact_record_ref &&
    route.output_policy_ref.expected_review_bridge_ref === template.output_policy_ref.expected_review_bridge_ref;
}

function routeMatchesHistoricalBindingPacket(route) {
  const packet = loadBinding(route.binding_packet_ref);
  const binding = packet.execution_binding;
  return packet.schema === "runtime_to_review_v2_binding_ready_execution_packet.v1" &&
    packet.trial_id === route.trial_id &&
    packet.dispatch_performed === false &&
    binding.path === route.route_id_or_endpoint_ref &&
    binding.activation_package_id === route.activation_id_ref &&
    binding.dispatch_source_must_be_binding_not_payload_plugin_field === true &&
    binding.restricted_plugin_facade_required === true &&
    binding.authorization_header_constructed_by_Agent_Image_Lab === false;
}

function routeKeepsThinIngressBoundary(route) {
  const constraints = route.thin_ingress_constraints;
  return route.current_status === "compatibility_shim_until_broker_ready" &&
    route.route_replacement_allowed_now === false &&
    constraints.route_role === "identity_and_transport_only" &&
    constraints.provider_dispatch_allowed_by_route === false &&
    constraints.plugin_dispatch_allowed_by_route === false &&
    constraints.api_dispatch_allowed_by_route === false &&
    constraints.payload_override_allowed === false &&
    constraints.secret_or_auth_header_construction_by_AIL === false &&
    constraints.full_pluginManager_access === false &&
    route.migration_gate === "generic_endpoint_migration_gate" &&
    route.stop_conditions === "thin_ingress_stop_conditions" &&
    route.execution_boundary === "execution_boundary";
}

check("routes_match_binding_preflight_templates", () =>
  routes.every((route) => routeMatchesBindingTemplate(route))
);
check("routes_match_historical_binding_packets_as_refs_only", () =>
  routes.every((route) => routeMatchesHistoricalBindingPacket(route))
);
check("routes_keep_thin_ingress_boundary", () =>
  routes.every((route) => routeKeepsThinIngressBoundary(route))
);
check("stop_conditions_cover_red_boundaries", () =>
  fixture.thin_ingress_stop_conditions.includes("external_vcptoolbox_write_requested") &&
  fixture.thin_ingress_stop_conditions.includes("real_route_or_broker_implementation_requested") &&
  fixture.thin_ingress_stop_conditions.includes("route_http_request_requested") &&
  fixture.thin_ingress_stop_conditions.includes("provider_plugin_api_or_image_generation_requested") &&
  fixture.thin_ingress_stop_conditions.includes("route_dispatch_authority_requested") &&
  fixture.thin_ingress_stop_conditions.includes("generic_endpoint_enablement_without_separate_gate") &&
  fixture.thin_ingress_stop_conditions.includes("secret_value_read_required") &&
  fixture.thin_ingress_stop_conditions.includes("push_tag_release_deploy_requested") &&
  doc.includes("modify VCPToolBox or another external repository") &&
  doc.includes("call a route HTTP endpoint, provider, plugin, API, or image generator") &&
  doc.includes("enable the generic endpoint without a separate migration gate")
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
  validator: "compatibility_route_thin_ingress_plan_no_execute",
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
