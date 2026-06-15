#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const docRef = "docs/generic_image_execution_endpoint_gate_no_execute.md";
const fixtureRef = "tests/schema_examples/generic_image_execution_endpoint_gate_no_execute.example.json";
const thinIngressFixtureRef = "tests/schema_examples/compatibility_route_thin_ingress_plan_no_execute.example.json";
const brokerProposalFixtureRef = "tests/schema_examples/vcptoolbox_image_execution_broker_implementation_proposal_no_execute.example.json";
const followupFixtureRef = "tests/schema_examples/vcptoolbox_image_execution_broker_followup_plan.example.json";

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
const fixture = readJson(fixtureRef).generic_image_execution_endpoint_gate_no_execute;
const thinIngress = readJson(thinIngressFixtureRef).compatibility_route_thin_ingress_plan_no_execute;
const brokerProposal = readJson(brokerProposalFixtureRef).vcptoolbox_image_execution_broker_implementation_proposal_no_execute;
const followup = readJson(followupFixtureRef).vcptoolbox_image_execution_broker_followup_plan;
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

const contract = fixture.gate_contract;
const gate = fixture.gate;
const endpoint = "/internal/agent-image-lab/executions/run";

check("doc_exists", () => doc.length > 0);
check("fixture_phase_matches_doc", () => doc.includes(fixture.phase));
check("parent_refs_exist", () =>
  fixture.parent_thin_ingress_plan_ref === "docs/compatibility_route_thin_ingress_plan_no_execute.md" &&
  fixture.parent_broker_proposal_ref === "docs/vcptoolbox_image_execution_broker_implementation_proposal_no_execute.md" &&
  fixture.parent_plan_ref === "docs/vcptoolbox_image_execution_broker_followup_plan.md" &&
  exists(fixture.parent_thin_ingress_plan_ref) &&
  exists(fixture.parent_broker_proposal_ref) &&
  exists(fixture.parent_plan_ref) &&
  Object.values(fixture.source_refs).every((ref) => exists(ref))
);
check("status_is_no_execute_endpoint_gate", () =>
  fixture.status === "local_generic_endpoint_gate_no_execute" &&
  contract.authority_status === "migration_gate_only_no_enablement" &&
  contract.generic_endpoint_candidate === endpoint &&
  contract.generic_endpoint_enabled_now === false &&
  contract.migration_allowed_now === false &&
  contract.route_http_allowed_by_this_gate === false &&
  contract.external_repo_write_allowed_by_this_gate === false &&
  contract.provider_plugin_api_image_allowed_by_this_gate === false &&
  contract.secret_value_read_allowed === false &&
  fixture.automatic_real_execution_allowed_by_this_gate === false &&
  fixture.external_repo_write_allowed_by_this_gate === false &&
  fixture.generic_endpoint_enablement_allowed_by_this_gate === false &&
  doc.includes("It is not the enablement.")
);
check("contract_required_fields_match_gate_shape", () =>
  [
    "gate_id",
    "generic_endpoint_candidate",
    "generic_endpoint_enabled_now",
    "migration_allowed_now",
    "current_compatibility_routes",
    "comparable_evidence_gate",
    "pre_enable_requirements",
    "endpoint_request_envelope",
    "forbidden_payload_authority",
    "migration_stages",
    "rollback_or_route_restore_plan",
    "validation_plan",
    "future_authorization_packet_requirements",
    "stop_conditions",
    "execution_boundary",
  ].every((field) => contract.required_fields.includes(field) && Object.prototype.hasOwnProperty.call(gate, field))
);
check("endpoint_matches_thin_ingress_candidate_and_remains_disabled", () =>
  gate.generic_endpoint_candidate === thinIngress.generic_endpoint_migration_gate.generic_endpoint_candidate &&
  thinIngress.generic_endpoint_migration_gate.generic_endpoint_enabled_now === false &&
  thinIngress.generic_endpoint_migration_gate.migration_allowed_now === false &&
  gate.generic_endpoint_enabled_now === false &&
  gate.migration_allowed_now === false
);
check("compatibility_routes_match_thin_ingress_refs_and_remain_shims", () => {
  const thinRoutes = thinIngress.compatibility_routes;
  return gate.current_compatibility_routes.length === 2 &&
    gate.current_compatibility_routes.every((route) => {
      const matching = thinRoutes.find((thinRoute) => thinRoute.trial_id === route.trial_id);
      return matching &&
        matching.route_id_or_endpoint_ref === route.route_id_or_endpoint_ref &&
        matching.current_status === route.status &&
        matching.route_replacement_allowed_now === false &&
        route.replacement_allowed_now === false;
    }) &&
    contract.current_task_specific_endpoint_remains_as_shim === true &&
    contract.compatibility_routes_remain_shims === true &&
    doc.includes("The generic endpoint cannot remove these shims in this gate.");
});
check("comparable_evidence_gate_distinguishes_design_from_enablement", () =>
  gate.comparable_evidence_gate.minimum_rule.includes("at_least_two_v2_trials_with_comparable_artifact_review_evidence") &&
  gate.comparable_evidence_gate.minimum_rule.includes("or_one_trial_exposes_clear_repeated_runtime_boundary") &&
  gate.comparable_evidence_gate.design_evidence_present === true &&
  gate.comparable_evidence_gate.endpoint_enablement_evidence_sufficient_now === false &&
  gate.comparable_evidence_gate.evidence_refs.includes("reports/runtime_to_review_v2/r2r_v2_trial_001_serum_detail_control_artifact_record.json") &&
  gate.comparable_evidence_gate.evidence_refs.includes("reports/runtime_to_review_v2/r2r_v2_trial_002_lantern_ecommerce_hero_artifact_record.json") &&
  gate.comparable_evidence_gate.remaining_enablement_gap.includes("exact VCPToolBox broker implementation authorization packet") &&
  gate.comparable_evidence_gate.remaining_enablement_gap.includes("validated VCPToolBox broker implementation") &&
  doc.includes("The two V2 trials justify defining this migration gate.") &&
  doc.includes("enable the endpoint.")
);
check("pre_enable_requirements_chain_prior_contracts_and_external_auth", () =>
  gate.pre_enable_requirements.includes("generation_channel_contract_preflight_validated") &&
  gate.pre_enable_requirements.includes("image_run_capability_binding_preflight_template_validated") &&
  gate.pre_enable_requirements.includes("compatibility_route_thin_ingress_plan_validated") &&
  gate.pre_enable_requirements.includes("vcptoolbox_image_execution_broker_implementation_proposal_validated") &&
  gate.pre_enable_requirements.includes("generic_image_execution_endpoint_gate_validated") &&
  gate.pre_enable_requirements.includes("exact_external_repo_authorization_packet_issued") &&
  gate.pre_enable_requirements.includes("VCPToolBox_broker_implementation_validated") &&
  gate.pre_enable_requirements.includes("payload_cannot_select_provider_plugin_api_delegate_model_output_retry") &&
  brokerProposal.proposal.future_authorization_packet_requirements.can_execute_now === false
);
check("endpoint_request_envelope_allows_refs_only", () => {
  const envelope = gate.endpoint_request_envelope;
  return [
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
  ].every((field) => envelope.allowed_ref_fields.includes(field)) &&
    envelope.payload_may_include_business_prompt_text === false &&
    envelope.payload_may_include_raw_prompt_text === false &&
    envelope.payload_may_include_provider_or_plugin_config === false &&
    envelope.payload_may_select_dispatch_target === false &&
    envelope.payload_may_override_output_path === false &&
    envelope.payload_may_override_retry_or_budget === false &&
    envelope.authorization_header_constructed_by_AIL === false &&
    doc.includes("The endpoint request may carry refs. It must not carry dispatch power.");
});
check("forbidden_payload_authority_covers_dispatch_output_and_memory", () =>
  [
    "provider_id_selection",
    "plugin_id_selection",
    "api_id_selection",
    "delegate_id_selection",
    "model_selection",
    "output_directory_selection",
    "receipt_target_selection",
    "review_queue_target_selection",
    "retry_or_budget_selection",
    "arbitrary_pluginManager_access",
    "raw_prompt_or_raw_request_storage",
    "accepted_samples_or_production_candidate_write",
    "DailyNote_or_VCP_memory_write",
  ].every((item) => gate.forbidden_payload_authority.includes(item))
);
check("migration_stages_do_not_skip_external_exact_gate", () => {
  const statuses = Object.fromEntries(gate.migration_stages.map((stage) => [stage.stage_id, stage.status]));
  return gate.migration_stages.length === 5 &&
    statuses.stage_0_current === "active_now" &&
    statuses.stage_1_no_execute_generic_gate === "completed_by_this_gate_when_validated" &&
    statuses.stage_2_external_repo_authorized_implementation === "future_exact_gate_required" &&
    statuses.stage_3_external_repo_validation === "future_exact_gate_required" &&
    statuses.stage_4_controlled_migration === "future_exact_gate_required";
});
check("rollback_plan_requires_route_restore_without_force_history", () =>
  gate.rollback_or_route_restore_plan.required_before_enable === true &&
  gate.rollback_or_route_restore_plan.minimum_required.includes("exact VCPToolBox files changed by endpoint implementation") &&
  gate.rollback_or_route_restore_plan.minimum_required.includes("exact route restore plan for each task-specific compatibility route") &&
  gate.rollback_or_route_restore_plan.minimum_required.includes("no force push or history rewrite") &&
  gate.rollback_or_route_restore_plan.minimum_required.includes("route fallback must preserve Trial 001 and Trial 002 binding refs")
);
check("validation_plan_chains_local_and_future_external_checks", () =>
  gate.validation_plan.local_AIL_no_execute_validation.includes("npm run validate:generic-image-execution-endpoint-gate-no-execute") &&
  gate.validation_plan.local_AIL_no_execute_validation.includes("npm run validate:vcptoolbox-image-execution-broker-implementation-proposal-no-execute") &&
  gate.validation_plan.local_AIL_no_execute_validation.includes("npm run validate:compatibility-route-thin-ingress-plan-no-execute") &&
  gate.validation_plan.local_AIL_no_execute_validation.includes("npm run validate:image-run-capability-binding-preflight-template") &&
  gate.validation_plan.local_AIL_no_execute_validation.includes("npm run validate:generation-channel-contract-preflight") &&
  gate.validation_plan.local_AIL_no_execute_validation.includes("npm run validate:vcptoolbox-image-execution-broker-followup-plan") &&
  gate.validation_plan.future_external_repo_validation_required.includes("compatibility route fallback tests") &&
  gate.validation_plan.future_external_repo_validation_required.includes("git diff --check inside VCPToolBox")
);
check("future_authorization_packet_blocks_enablement_now", () =>
  gate.future_authorization_packet_requirements.can_execute_now === false &&
  gate.future_authorization_packet_requirements.required_before_any_endpoint_enablement.includes("exact local VCPToolBox workspace path verified without secret reads") &&
  gate.future_authorization_packet_requirements.required_before_any_endpoint_enablement.includes("exact allowed external files") &&
  gate.future_authorization_packet_requirements.required_before_any_endpoint_enablement.includes("exact route and broker implementation scope") &&
  gate.future_authorization_packet_requirements.required_before_any_endpoint_enablement.includes("rollback_or_route_restore_plan") &&
  gate.future_authorization_packet_requirements.required_before_any_endpoint_enablement.includes("no secret/env/config reads") &&
  gate.future_authorization_packet_requirements.required_before_any_endpoint_enablement.includes("no push/tag/release/deploy")
);
check("stop_conditions_cover_red_boundaries", () =>
  fixture.gate_stop_conditions.includes("generic_endpoint_enablement_requested") &&
  fixture.gate_stop_conditions.includes("task_specific_route_removal_or_replacement_requested") &&
  fixture.gate_stop_conditions.includes("external_vcptoolbox_read_or_write_without_exact_authorization_packet") &&
  fixture.gate_stop_conditions.includes("route_http_request_requested") &&
  fixture.gate_stop_conditions.includes("provider_plugin_api_or_image_generation_requested") &&
  fixture.gate_stop_conditions.includes("payload_dispatch_authority_requested") &&
  fixture.gate_stop_conditions.includes("secret_value_read_required") &&
  fixture.gate_stop_conditions.includes("dependency_or_lockfile_change_requested_without_exact_package_action_list") &&
  fixture.gate_stop_conditions.includes("commit_push_tag_release_deploy_requested") &&
  doc.includes("enable `/internal/agent-image-lab/executions/run`") &&
  doc.includes("remove, replace, or disable task-specific compatibility routes") &&
  doc.includes("read `.env`, secrets, cookies, tokens")
);
check("followup_wp5_is_completed_by_this_gate", () => {
  const wp5 = followup.work_packages.find((wp) => wp.work_package_id === "generic_image_execution_endpoint_gate");
  return wp5 &&
    wp5.status === "completed_validated_no_execute_gate_20260610" &&
    wp5.completion_refs.includes(docRef) &&
    wp5.completion_refs.includes(fixtureRef) &&
    wp5.completion_refs.includes("scripts/validate_generic_image_execution_endpoint_gate_no_execute.js") &&
    wp5.generic_endpoint_candidate === endpoint &&
    wp5.generic_endpoint_enabled_now === false &&
    wp5.migration_allowed_now === false;
});
check("execution_boundary_flags_false", () => allFlagsFalse(fixture.execution_boundary));
check("doc_boundary_flags_present", () =>
  Object.keys(fixture.execution_boundary).every((key) => doc.includes(`${key}: false`))
);
check("recommended_next_is_external_repo_authorization_after_split", () =>
  fixture.completed_previous === "prepare_ail_core_vcp_adapter_split_plan_no_execute" &&
  fixture.completion_refs.includes("docs/ail_core_vcp_adapter_split_plan_no_execute.md") &&
  fixture.completion_refs.includes("tests/schema_examples/ail_core_vcp_adapter_split_plan_no_execute.example.json") &&
  fixture.completion_refs.includes("scripts/validate_ail_core_vcp_adapter_split_plan_no_execute.js") &&
  fixture.completion_refs.every((ref) => exists(ref)) &&
  fixture.recommended_next === "prepare_vcptoolbox_image_execution_broker_external_repo_authorization_packet_no_execute" &&
  doc.includes("prepare_vcptoolbox_image_execution_broker_external_repo_authorization_packet_no_execute")
);

const failed = results.filter((result) => !result.passed);
const output = {
  passed: failed.length === 0,
  validator: "generic_image_execution_endpoint_gate_no_execute",
  phase: fixture.phase,
  doc_ref: docRef,
  fixture_ref: fixtureRef,
  check_count: results.length,
  failed_count: failed.length,
  generic_endpoint_enabled: false,
  migration_allowed_now: false,
  route_http_request_performed: false,
  external_VCPToolBox_read_performed: false,
  external_VCPToolBox_write_performed: false,
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  image_generation_performed: false,
  secret_value_read_performed: false,
  dependency_change_performed: false,
  file_write_performed: false,
  results,
};

console.log(JSON.stringify(output, null, 2));
if (failed.length > 0) process.exit(1);
