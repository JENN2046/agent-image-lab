#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const docRef = "docs/vcptoolbox_image_execution_broker_implementation_proposal_no_execute.md";
const fixtureRef = "tests/schema_examples/vcptoolbox_image_execution_broker_implementation_proposal_no_execute.example.json";
const thinIngressFixtureRef = "tests/schema_examples/compatibility_route_thin_ingress_plan_no_execute.example.json";
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
const fixture = readJson(fixtureRef).vcptoolbox_image_execution_broker_implementation_proposal_no_execute;
const thinIngress = readJson(thinIngressFixtureRef).compatibility_route_thin_ingress_plan_no_execute;
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

const contract = fixture.proposal_contract;
const proposal = fixture.proposal;

check("doc_exists", () => doc.length > 0);
check("fixture_phase_matches_doc", () => doc.includes(fixture.phase));
check("parent_refs_exist", () =>
  fixture.parent_thin_ingress_plan_ref === "docs/compatibility_route_thin_ingress_plan_no_execute.md" &&
  fixture.parent_plan_ref === "docs/vcptoolbox_image_execution_broker_followup_plan.md" &&
  exists(fixture.parent_thin_ingress_plan_ref) &&
  exists(fixture.parent_plan_ref) &&
  Object.values(fixture.source_refs).every((ref) => exists(ref))
);
check("status_is_no_execute_external_repo_proposal", () =>
  fixture.status === "local_external_repo_implementation_proposal_no_execute" &&
  contract.authority_status === "proposal_only_no_external_write" &&
  contract.external_repo_write_allowed_now === false &&
  contract.route_http_allowed_now === false &&
  contract.provider_plugin_api_image_allowed_now === false &&
  contract.secret_value_read_allowed === false &&
  fixture.automatic_real_execution_allowed_by_this_proposal === false &&
  fixture.external_repo_write_allowed_by_this_proposal === false &&
  doc.includes("It does not read VCPToolBox, modify VCPToolBox")
);
check("target_system_and_repo_are_explicit", () =>
  contract.target_system === "VCPToolBox" &&
  contract.target_repo === "JENN2046/VCPToolBox" &&
  contract.target_branch_required_before_future_write === "main" &&
  proposal.target_system === contract.target_system &&
  proposal.target_repo === contract.target_repo &&
  proposal.target_branch_required_before_future_write === contract.target_branch_required_before_future_write
);
check("required_fields_cover_external_repo_packet", () =>
  [
    "proposal_id",
    "target_system",
    "target_repo",
    "target_branch_required_before_future_write",
    "external_repo_write_allowed_now",
    "implementation_intent",
    "candidate_external_files",
    "forbidden_external_files_or_actions",
    "required_broker_components",
    "required_contract_inputs",
    "required_runtime_guards",
    "required_outputs",
    "validation_plan",
    "rollback_or_cleanup_plan",
    "future_authorization_packet_requirements",
    "stop_conditions",
    "execution_boundary",
  ].every((field) => contract.required_fields.includes(field) && Object.prototype.hasOwnProperty.call(proposal, field))
);
check("implementation_intent_matches_followup_roles", () =>
  proposal.implementation_intent.broker_role === followup.design_rules.broker_role &&
  proposal.implementation_intent.activation_role === followup.design_rules.activation_role &&
  proposal.implementation_intent.visual_job_contract_role === followup.design_rules.visual_job_contract_role &&
  proposal.implementation_intent.restricted_plugin_facade_role === followup.design_rules.restricted_facade_role &&
  proposal.implementation_intent.delegate_role === followup.design_rules.delegate_role &&
  proposal.implementation_intent.artifact_receipt_role === followup.design_rules.artifact_receipt_role &&
  proposal.implementation_intent.review_queue_role === followup.design_rules.review_queue_role &&
  proposal.implementation_intent.memory_candidate_role === followup.design_rules.memory_candidate_role
);
check("candidate_external_files_are_exact_and_limited", () => {
  const paths = proposal.candidate_external_files.map((entry) => entry.path);
  return proposal.candidate_external_files.length === 6 &&
    paths.includes("services/agentImageLab/ImageExecutionBroker.js") &&
    paths.includes("services/agentImageLab/ImageRunCapabilityRegistry.js") &&
    paths.includes("services/agentImageLab/RestrictedPluginFacade.js") &&
    paths.includes("services/agentImageLab/ArtifactReceiptWriter.js") &&
    paths.includes("routes/agentImageLabImageExecution.js") &&
    paths.includes("tests/agentImageLab/imageExecutionBroker.test.js") &&
    proposal.candidate_external_files.every((entry) => ["add", "add_or_update"].includes(entry.action));
});
check("forbidden_external_actions_cover_red_boundaries", () =>
  [
    "broad_repository_rewrite",
    "package_manager_or_dependency_change",
    "secret_or_env_file_read",
    "credential_or_token_edit",
    "full_pluginManager_exposure_to_route",
    "arbitrary_provider_plugin_api_payload_dispatch",
    "route_http_probe",
    "provider_plugin_api_or_image_call",
    "push_tag_release_deploy",
    "force_push_history_rewrite_or_destructive_action",
  ].every((item) => proposal.forbidden_external_files_or_actions.includes(item))
);
check("required_broker_components_keep_dispatch_authority_internal", () => {
  const components = proposal.required_broker_components;
  return components.internal_authorizer.activation_id_ref_required === true &&
    components.internal_authorizer.canonical_contract_hash_ref_required === true &&
    components.internal_authorizer.secret_value_read_allowed === false &&
    components.capability_registry.ImageRunCapabilityBindingPreflight_ref_required === true &&
    components.capability_registry.VCPToolBox_internal_binding_is_authoritative === true &&
    components.capability_registry.payload_dispatch_authority === false &&
    components.restricted_plugin_facade.allowed_plugin_ref === "DoubaoGen" &&
    components.restricted_plugin_facade.allowed_api_ref === "generate_image" &&
    components.restricted_plugin_facade.max_calls === 1 &&
    components.restricted_plugin_facade.full_pluginManager_exposed_to_route === false &&
    components.artifact_receipt_writer.receipt_ref_required === true &&
    components.artifact_receipt_writer.artifact_record_ref_required === true &&
    components.artifact_receipt_writer.review_bridge_ref_required === true &&
    components.review_queue_bridge.generated_unreviewed_default === true &&
    components.review_queue_bridge.human_review_required_before_archive_or_memory === true &&
    components.memory_candidate_gate.mapping_only_allowed === true &&
    components.memory_candidate_gate.memory_write_default === false;
});
check("required_contract_inputs_include_prior_gates", () =>
  [
    "VisualJobContract.v1",
    "ImageRunCapabilityBindingPreflight.v1",
    "CompatibilityRouteThinIngressPlan.v1",
    "RestrictedPluginFacadeBoundary.v1",
    "ArtifactReceiptGate.v1",
    "ReviewQueueGate.v1",
    "MemoryCandidateGate.v1",
  ].every((item) => proposal.required_contract_inputs.includes(item))
);
check("runtime_guards_match_thin_ingress_and_binding_limits", () => {
  const guards = proposal.required_runtime_guards;
  return guards.max_route_http_requests === 1 &&
    guards.max_provider_calls === 1 &&
    guards.max_plugin_calls === 1 &&
    guards.max_api_calls === 1 &&
    guards.max_images === 1 &&
    guards.retry_allowed === false &&
    guards.overwrite_existing_files_allowed === false &&
    guards.secret_value_read_allowed === false &&
    guards.output_directory_must_match_bound_contract_ref === true &&
    guards.payload_provider_plugin_api_override_allowed === false &&
    guards.authorization_header_constructed_by_AIL === false &&
    thinIngress.thin_ingress_contract.route_http_allowed_by_this_plan === false &&
    thinIngress.thin_ingress_contract.provider_dispatch_allowed_by_route === false;
});
check("required_outputs_include_receipt_artifact_review_validation", () =>
  proposal.required_outputs.includes("receipt_ref") &&
  proposal.required_outputs.includes("artifact_record_ref") &&
  proposal.required_outputs.includes("review_bridge_ref") &&
  proposal.required_outputs.includes("validation_receipt_for_external_repo_write")
);
check("validation_plan_chains_local_validators", () =>
  proposal.validation_plan.local_AIL_pre_authorization_validation.includes("npm run validate:vcptoolbox-image-execution-broker-implementation-proposal-no-execute") &&
  proposal.validation_plan.local_AIL_pre_authorization_validation.includes("npm run validate:compatibility-route-thin-ingress-plan-no-execute") &&
  proposal.validation_plan.local_AIL_pre_authorization_validation.includes("npm run validate:image-run-capability-binding-preflight-template") &&
  proposal.validation_plan.local_AIL_pre_authorization_validation.includes("npm run validate:generation-channel-contract-preflight") &&
  proposal.validation_plan.local_AIL_pre_authorization_validation.includes("npm run validate:vcptoolbox-image-execution-broker-followup-plan") &&
  proposal.validation_plan.future_external_repo_validation_required.includes("git diff --check inside VCPToolBox")
);
check("rollback_plan_required_before_future_write", () =>
  proposal.rollback_or_cleanup_plan.required_before_future_write === true &&
  proposal.rollback_or_cleanup_plan.minimum_required.includes("exact file list to revert") &&
  proposal.rollback_or_cleanup_plan.minimum_required.includes("no force push or history rewrite") &&
  proposal.rollback_or_cleanup_plan.minimum_required.includes("restore task-specific compatibility routes if generic endpoint migration fails")
);
check("future_authorization_packet_blocks_execution_now", () =>
  proposal.future_authorization_packet_requirements.can_execute_now === false &&
  proposal.future_authorization_packet_requirements.required_before_any_external_write.includes("exact local VCPToolBox workspace path verified without secret reads") &&
  proposal.future_authorization_packet_requirements.required_before_any_external_write.includes("exact allowed external files") &&
  proposal.future_authorization_packet_requirements.required_before_any_external_write.includes("rollback_or_cleanup_plan") &&
  proposal.future_authorization_packet_requirements.required_before_any_external_write.includes("no secret/env/config reads") &&
  proposal.future_authorization_packet_requirements.required_before_any_external_write.includes("no provider/plugin/API/image call") &&
  proposal.future_authorization_packet_requirements.required_before_any_external_write.includes("no push/tag/release/deploy")
);
check("proposal_stop_conditions_cover_red_boundaries", () =>
  fixture.proposal_stop_conditions.includes("external_vcptoolbox_read_or_write_without_exact_authorization_packet") &&
  fixture.proposal_stop_conditions.includes("secret_value_read_required") &&
  fixture.proposal_stop_conditions.includes("dependency_or_lockfile_change_requested_without_exact_package_action_list") &&
  fixture.proposal_stop_conditions.includes("real_route_or_broker_implementation_requested") &&
  fixture.proposal_stop_conditions.includes("route_http_request_requested") &&
  fixture.proposal_stop_conditions.includes("provider_plugin_api_or_image_generation_requested") &&
  fixture.proposal_stop_conditions.includes("payload_dispatch_authority_requested") &&
  fixture.proposal_stop_conditions.includes("commit_push_tag_release_deploy_requested") &&
  doc.includes("read or modify VCPToolBox without a separate exact external-repo authorization packet") &&
  doc.includes("change dependencies, package managers, lockfiles")
);
check("execution_boundary_flags_false", () => allFlagsFalse(fixture.execution_boundary));
check("doc_boundary_flags_present", () =>
  Object.keys(fixture.execution_boundary).every((key) => doc.includes(`${key}: false`))
);
check("recommended_next_is_generic_endpoint_gate", () =>
  fixture.completed_previous === "prepare_vcptoolbox_image_execution_broker_implementation_proposal_no_execute" &&
  fixture.recommended_next === "prepare_generic_image_execution_endpoint_gate_no_execute" &&
  doc.includes("prepare_generic_image_execution_endpoint_gate_no_execute")
);

const failed = results.filter((result) => !result.passed);
const output = {
  passed: failed.length === 0,
  validator: "vcptoolbox_image_execution_broker_implementation_proposal_no_execute",
  phase: fixture.phase,
  doc_ref: docRef,
  fixture_ref: fixtureRef,
  check_count: results.length,
  failed_count: failed.length,
  external_VCPToolBox_read_performed: false,
  external_VCPToolBox_write_performed: false,
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  image_generation_performed: false,
  route_http_request_performed: false,
  secret_value_read_performed: false,
  dependency_change_performed: false,
  file_write_performed: false,
  results,
};

console.log(JSON.stringify(output, null, 2));
if (failed.length > 0) process.exit(1);
