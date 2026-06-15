#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const docRef = "docs/ail_core_vcp_adapter_split_plan_no_execute.md";
const fixtureRef = "tests/schema_examples/ail_core_vcp_adapter_split_plan_no_execute.example.json";
const endpointFixtureRef = "tests/schema_examples/generic_image_execution_endpoint_gate_no_execute.example.json";
const followupFixtureRef = "tests/schema_examples/vcptoolbox_image_execution_broker_followup_plan.example.json";
const readinessFixtureRef = "tests/schema_examples/vcptoolbox_image_execution_broker_external_repo_readiness_review_no_execute.example.json";
const readPreflightFixtureRef = "tests/schema_examples/vcptoolbox_image_execution_broker_external_repo_read_preflight_no_execute.example.json";
const readAuthFixtureRef = "tests/schema_examples/vcptoolbox_image_execution_broker_external_repo_read_authorization_packet_no_execute.example.json";
const receiptTemplateFixtureRef = "tests/schema_examples/vcptoolbox_image_execution_broker_external_repo_exact_read_receipt_template_no_execute.example.json";

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
const fixture = readJson(fixtureRef).ail_core_vcp_adapter_split_plan_no_execute;
const endpointGate = readJson(endpointFixtureRef).generic_image_execution_endpoint_gate_no_execute;
const followup = readJson(followupFixtureRef).vcptoolbox_image_execution_broker_followup_plan;
const readinessReview = readJson(readinessFixtureRef).vcptoolbox_image_execution_broker_external_repo_readiness_review_no_execute;
const readPreflight = readJson(readPreflightFixtureRef).vcptoolbox_image_execution_broker_external_repo_read_preflight_no_execute;
const readAuthPacket = readJson(readAuthFixtureRef).vcptoolbox_image_execution_broker_external_repo_read_authorization_packet_no_execute;
const receiptTemplate = readJson(receiptTemplateFixtureRef).vcptoolbox_image_execution_broker_external_repo_exact_read_receipt_template_no_execute;
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

const contract = fixture.split_contract;
const split = fixture.split_plan;
const readAuthorizationDocRef = "docs/vcptoolbox_image_execution_broker_external_repo_read_authorization_packet_no_execute.md";
const receiptTemplateDocRef = "docs/vcptoolbox_image_execution_broker_external_repo_exact_read_receipt_template_no_execute.md";
const nextExactRead = "perform_vcptoolbox_image_execution_broker_external_repo_exact_read_with_receipt_only_after_separate_authorization";

check("doc_exists", () => doc.length > 0);
check("fixture_phase_matches_doc", () => doc.includes(fixture.phase));
check("parent_refs_exist", () =>
  fixture.parent_endpoint_gate_ref === "docs/generic_image_execution_endpoint_gate_no_execute.md" &&
  fixture.parent_plan_ref === "docs/vcptoolbox_image_execution_broker_followup_plan.md" &&
  exists(fixture.parent_endpoint_gate_ref) &&
  exists(fixture.parent_plan_ref) &&
  Object.values(fixture.source_refs).every((ref) => exists(ref))
);
check("status_is_no_execute_split_plan", () =>
  fixture.status === "local_split_plan_no_execute" &&
  contract.authority_status === "split_plan_only_no_runtime_implementation" &&
  contract.adapter_code_write_allowed_now === false &&
  contract.broker_implementation_allowed_now === false &&
  contract.generic_endpoint_enablement_allowed_now === false &&
  contract.external_repo_write_allowed_now === false &&
  contract.route_http_allowed_now === false &&
  contract.provider_plugin_api_image_allowed_now === false &&
  contract.secret_value_read_allowed === false &&
  fixture.automatic_real_execution_allowed_by_this_plan === false &&
  fixture.external_repo_read_allowed_by_this_plan === false &&
  fixture.external_repo_write_allowed_by_this_plan === false &&
  fixture.adapter_code_write_allowed_by_this_plan === false &&
  doc.includes("does not implement adapter code")
);
check("required_fields_cover_split_shape", () =>
  [
    "split_plan_id",
    "ail_core_owns",
    "vcp_adapter_owns",
    "shared_refs",
    "forbidden_cross_boundary_moves",
    "object_boundary_matrix",
    "data_flow",
    "pre_implementation_requirements",
    "validation_plan",
    "future_authorization_packet_requirements",
    "stop_conditions",
    "execution_boundary",
  ].every((field) => contract.required_fields.includes(field) && Object.prototype.hasOwnProperty.call(split, field))
);
check("ownership_rule_matches_followup_roles", () =>
  split.ownership_rule.ail_core_plain_meaning === "visual truth and production judgment" &&
  split.ownership_rule.vcp_adapter_plain_meaning === "execution transport and evidence refs" &&
  split.ownership_rule.route_plain_meaning === "transport only" &&
  split.ownership_rule.broker_plain_meaning === "VCPToolBox-side execution coordinator" &&
  split.ownership_rule.payload_plain_meaning === "refs only, not dispatch authority" &&
  followup.design_rules.route_role === "transport_only" &&
  followup.design_rules.broker_role === "execution_coordinator"
);
check("ail_core_owns_visual_review_archive_memory_objects", () =>
  [
    "ProductBrief",
    "ShotPlan",
    "PromptLineage",
    "VisualJobContract",
    "ReviewPolicy",
    "ImageCandidate",
    "ReviewReport",
    "AcceptedCandidate",
    "ArchivePolicy",
    "MemorySuitabilityDecision",
  ].every((item) => split.ail_core_owns.includes(item)) &&
  doc.includes("AIL Core fields must stay visual, review, archive, or memory-suitability") &&
  doc.includes("oriented")
);
check("vcp_adapter_owns_execution_refs_and_mappings_only", () =>
  [
    "activation_binding_refs",
    "ImageRunCapability refs",
    "route_id_or_generic_endpoint_ref",
    "broker_request_mapping",
    "restricted_plugin_facade_boundary_ref",
    "output_policy_ref_mapping",
    "receipt evidence mapping",
    "artifact_record_ref_mapping",
    "review_bridge_ref_mapping",
    "external_authorization_packet_refs",
  ].every((item) => split.vcp_adapter_owns.includes(item)) &&
  doc.includes("VCP Adapter fields must stay refs and mapping only")
);
check("shared_refs_are_identity_and_evidence_not_dispatch", () =>
  [
    "visual_job_contract_ref",
    "canonical_contract_hash_ref",
    "image_run_capability_binding_preflight_ref",
    "artifact_receipt_gate_ref",
    "review_queue_gate_ref",
    "memory_candidate_gate_ref",
  ].every((item) => split.shared_refs.includes(item)) &&
  doc.includes("Shared refs are identity and evidence handles")
);
check("forbidden_cross_boundary_moves_block_dispatch_and_review_drift", () =>
  split.forbidden_cross_boundary_moves.includes("moving_provider_plugin_api_selection_into_AIL_Core") &&
  split.forbidden_cross_boundary_moves.includes("moving_secret_or_auth_header_construction_into_AIL_Core") &&
  split.forbidden_cross_boundary_moves.includes("moving_review_decision_authority_into_VCP_Adapter") &&
  split.forbidden_cross_boundary_moves.includes("moving_memory_write_decision_into_VCP_Adapter") &&
  split.forbidden_cross_boundary_moves.includes("allowing_generic_endpoint_payload_to_override_bound_refs")
);
check("object_boundary_matrix_keeps_ail_core_without_dispatch", () => {
  const matrix = split.object_boundary_matrix;
  return matrix.ProductBrief.owner === "AIL_Core" &&
    matrix.ProductBrief.dispatch_authority === false &&
    matrix.ShotPlan.owner === "AIL_Core" &&
    matrix.ShotPlan.dispatch_authority === false &&
    matrix.PromptLineage.raw_prompt_storage_allowed === false &&
    matrix.VisualJobContract.owner === "AIL_Core" &&
    matrix.VisualJobContract.dispatch_authority === false &&
    matrix.VisualJobContract.allowed_adapter_refs.includes("image_run_capability_ref") &&
    matrix.VisualJobContract.allowed_adapter_refs.includes("expected_receipt_ref");
});
check("object_boundary_matrix_keeps_vcp_adapter_refs_only", () => {
  const matrix = split.object_boundary_matrix;
  return matrix.ImageRunCapabilityRef.owner === "VCP_Adapter" &&
    matrix.ImageRunCapabilityRef.source_of_truth === "VCPToolBox_binding_preflight" &&
    matrix.ImageRunCapabilityRef.payload_override_allowed === false &&
    matrix.BrokerRequestMapping.owner === "VCP_Adapter" &&
    matrix.BrokerRequestMapping.allowed_input === "refs_from_VisualJobContract_and_binding_preflight" &&
    matrix.BrokerRequestMapping.payload_provider_plugin_api_override_allowed === false &&
    matrix.ArtifactReceiptMapping.raw_plugin_output_storage_allowed === false;
});
check("review_and_memory_authority_remain_ail_core", () => {
  const matrix = split.object_boundary_matrix;
  return matrix.ReviewReport.owner === "AIL_Core" &&
    matrix.ReviewReport.production_admission_authority === true &&
    matrix.MemorySuitabilityDecision.owner === "AIL_Core" &&
    matrix.MemorySuitabilityDecision.default_memory_write_allowed === false;
});
check("data_flow_links_visual_to_adapter_to_review_without_execution", () =>
  split.data_flow[0] === "AIL Core ProductBrief / ShotPlan / ReviewPolicy" &&
  split.data_flow.includes("VCP Adapter binding refs and broker request mapping") &&
  split.data_flow.includes("future VCPToolBox Image Execution Broker") &&
  split.data_flow.includes("AIL Core ReviewReport") &&
  split.data_flow.includes("AcceptedCandidate / ArchivePolicy / MemorySuitabilityDecision gates")
);
check("pre_implementation_requirements_chain_prior_gates", () =>
  split.pre_implementation_requirements.includes("ail_core_vcp_adapter_split_plan_validated") &&
  split.pre_implementation_requirements.includes("generic_image_execution_endpoint_gate_validated") &&
  split.pre_implementation_requirements.includes("vcptoolbox_image_execution_broker_implementation_proposal_validated") &&
  split.pre_implementation_requirements.includes("vcptoolbox_image_execution_broker_external_repo_authorization_packet_validated") &&
  split.pre_implementation_requirements.includes("vcptoolbox_image_execution_broker_external_repo_readiness_review_validated") &&
  split.pre_implementation_requirements.includes("vcptoolbox_image_execution_broker_external_repo_read_preflight_validated") &&
  split.pre_implementation_requirements.includes("vcptoolbox_image_execution_broker_external_repo_read_authorization_packet_validated") &&
  split.pre_implementation_requirements.includes("vcptoolbox_image_execution_broker_external_repo_exact_read_receipt_template_validated") &&
  split.pre_implementation_requirements.includes("exact_external_repo_read_preflight_prepared_before_VCPToolBox_read") &&
  split.pre_implementation_requirements.includes("exact_external_repo_read_authorization_packet_prepared_before_VCPToolBox_read") &&
  split.pre_implementation_requirements.includes("exact_external_repo_read_receipt_template_prepared_before_VCPToolBox_read") &&
  split.pre_implementation_requirements.includes("exact_external_repo_authorization_packet_issued_before_VCPToolBox_write") &&
  split.pre_implementation_requirements.includes("exact_adapter_file_allowlist_defined_before_code_write") &&
  endpointGate.gate.generic_endpoint_enabled_now === false &&
  readinessReview.readiness_contract.readiness_result === "pass_ready_for_read_preflight_template" &&
  readPreflight.read_preflight_contract.preflight_result === "ready_for_separate_exact_read_authorization_packet" &&
  readAuthPacket.read_authorization_contract.packet_result === "ready_for_separate_exact_read_execution_with_receipt" &&
  receiptTemplate.receipt_template_contract.template_result === "ready_for_future_exact_read_receipt_population"
);
check("validation_plan_records_local_and_future_code_checks", () =>
  split.validation_plan.local_AIL_no_execute_validation.includes("npm run validate:ail-core-vcp-adapter-split-plan-no-execute") &&
  split.validation_plan.local_AIL_no_execute_validation.includes("npm run validate:vcptoolbox-image-execution-broker-external-repo-authorization-packet-no-execute") &&
  split.validation_plan.local_AIL_no_execute_validation.includes("npm run validate:vcptoolbox-image-execution-broker-external-repo-readiness-review-no-execute") &&
  split.validation_plan.local_AIL_no_execute_validation.includes("npm run validate:vcptoolbox-image-execution-broker-external-repo-read-preflight-no-execute") &&
  split.validation_plan.local_AIL_no_execute_validation.includes("npm run validate:vcptoolbox-image-execution-broker-external-repo-read-authorization-packet-no-execute") &&
  split.validation_plan.local_AIL_no_execute_validation.includes("npm run validate:vcptoolbox-image-execution-broker-external-repo-exact-read-receipt-template-no-execute") &&
  split.validation_plan.local_AIL_no_execute_validation.includes("npm run validate:generic-image-execution-endpoint-gate-no-execute") &&
  split.validation_plan.local_AIL_no_execute_validation.includes("npm run validate:vcptoolbox-image-execution-broker-followup-plan") &&
  split.validation_plan.local_AIL_no_execute_validation.includes("npm run validate:validation-manifest") &&
  split.validation_plan.future_code_validation_required.includes("exact adapter boundary tests proving AIL Core cannot choose provider/plugin/API") &&
  split.validation_plan.future_code_validation_required.includes("exact adapter mapping tests proving refs pass through unchanged") &&
  split.validation_plan.future_code_validation_required.includes("exact ReviewReport tests proving review/archive/memory decisions remain AIL-owned")
);
check("future_authorization_packet_blocks_code_and_external_write_now", () =>
  split.future_authorization_packet_requirements.can_execute_now === false &&
  split.future_authorization_packet_requirements.required_before_any_code_or_external_repo_write.includes("exact allowed local AIL adapter files if local implementation is proposed") &&
  split.future_authorization_packet_requirements.required_before_any_code_or_external_repo_write.includes("exact allowed external VCPToolBox files if external implementation is proposed") &&
  split.future_authorization_packet_requirements.required_before_any_code_or_external_repo_write.includes("rollback_or_cleanup_plan") &&
  split.future_authorization_packet_requirements.required_before_any_code_or_external_repo_write.includes("no secret/env/config reads") &&
  split.future_authorization_packet_requirements.required_before_any_code_or_external_repo_write.includes("no provider/plugin/API/image call") &&
  split.future_authorization_packet_requirements.required_before_any_code_or_external_repo_write.includes("no push/tag/release/deploy")
);
check("stop_conditions_cover_red_boundaries", () =>
  fixture.split_stop_conditions.includes("adapter_broker_route_ipc_preload_renderer_or_provider_executor_code_write_requested") &&
  fixture.split_stop_conditions.includes("external_vcptoolbox_read_or_write_without_exact_authorization_packet") &&
  fixture.split_stop_conditions.includes("generic_endpoint_enablement_requested") &&
  fixture.split_stop_conditions.includes("route_http_request_requested") &&
  fixture.split_stop_conditions.includes("provider_plugin_api_or_image_generation_requested") &&
  fixture.split_stop_conditions.includes("ail_core_or_payload_dispatch_authority_requested") &&
  fixture.split_stop_conditions.includes("review_archive_or_memory_authority_moved_to_vcp_adapter") &&
  fixture.split_stop_conditions.includes("secret_value_read_required") &&
  fixture.split_stop_conditions.includes("commit_push_tag_release_deploy_requested") &&
  doc.includes("write adapter, broker, route, IPC, preload, renderer, or provider executor code") &&
  doc.includes("move review, archive, accepted sample, or memory-write authority into VCP Adapter")
);
check("followup_wp6_is_completed_by_this_plan", () => {
  const wp6 = followup.work_packages.find((wp) => wp.work_package_id === "ail_core_vcp_adapter_split_plan");
  return wp6 &&
    wp6.status === "completed_validated_no_execute_plan_20260610" &&
    wp6.completion_refs.includes(docRef) &&
    wp6.completion_refs.includes(fixtureRef) &&
    wp6.completion_refs.includes("scripts/validate_ail_core_vcp_adapter_split_plan_no_execute.js") &&
    wp6.ail_core_owns.includes("ProductBrief") &&
    wp6.ail_core_owns.includes("MemorySuitabilityDecision") &&
    wp6.vcp_adapter_owns.includes("broker request mapping") &&
    wp6.vcp_adapter_owns.includes("receipt evidence mapping");
});
check("execution_boundary_flags_false", () => allFlagsFalse(fixture.execution_boundary));
check("doc_boundary_flags_present", () =>
  Object.keys(fixture.execution_boundary).every((key) => doc.includes(`${key}: false`))
);
check("recommended_next_is_exact_read_after_read_authorization_packet", () =>
  fixture.source_refs.external_repo_readiness_review_ref === "docs/vcptoolbox_image_execution_broker_external_repo_readiness_review_no_execute.md" &&
  fixture.source_refs.external_repo_read_preflight_ref === "docs/vcptoolbox_image_execution_broker_external_repo_read_preflight_no_execute.md" &&
  fixture.source_refs.external_repo_read_authorization_packet_ref === readAuthorizationDocRef &&
  fixture.source_refs.external_repo_exact_read_receipt_template_ref === receiptTemplateDocRef &&
  fixture.completed_previous === "prepare_vcptoolbox_image_execution_broker_external_repo_exact_read_receipt_template_no_execute" &&
  fixture.recommended_next === nextExactRead &&
  doc.includes(nextExactRead)
);

const failed = results.filter((result) => !result.passed);
const output = {
  passed: failed.length === 0,
  validator: "ail_core_vcp_adapter_split_plan_no_execute",
  phase: fixture.phase,
  doc_ref: docRef,
  fixture_ref: fixtureRef,
  check_count: results.length,
  failed_count: failed.length,
  adapter_code_write_performed: false,
  broker_implementation_performed: false,
  generic_endpoint_enabled: false,
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
