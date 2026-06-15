#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const docRef = "docs/vcptoolbox_image_execution_broker_external_repo_authorization_packet_no_execute.md";
const fixtureRef = "tests/schema_examples/vcptoolbox_image_execution_broker_external_repo_authorization_packet_no_execute.example.json";
const proposalFixtureRef = "tests/schema_examples/vcptoolbox_image_execution_broker_implementation_proposal_no_execute.example.json";
const splitFixtureRef = "tests/schema_examples/ail_core_vcp_adapter_split_plan_no_execute.example.json";
const followupFixtureRef = "tests/schema_examples/vcptoolbox_image_execution_broker_followup_plan.example.json";
const readinessFixtureRef = "tests/schema_examples/vcptoolbox_image_execution_broker_external_repo_readiness_review_no_execute.example.json";
const readPreflightFixtureRef = "tests/schema_examples/vcptoolbox_image_execution_broker_external_repo_read_preflight_no_execute.example.json";
const readAuthFixtureRef = "tests/schema_examples/vcptoolbox_image_execution_broker_external_repo_read_authorization_packet_no_execute.example.json";

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
const fixture = readJson(fixtureRef).vcptoolbox_image_execution_broker_external_repo_authorization_packet_no_execute;
const proposal = readJson(proposalFixtureRef).vcptoolbox_image_execution_broker_implementation_proposal_no_execute;
const splitPlan = readJson(splitFixtureRef).ail_core_vcp_adapter_split_plan_no_execute;
const followup = readJson(followupFixtureRef).vcptoolbox_image_execution_broker_followup_plan;
const readinessReview = readJson(readinessFixtureRef).vcptoolbox_image_execution_broker_external_repo_readiness_review_no_execute;
const readPreflight = readJson(readPreflightFixtureRef).vcptoolbox_image_execution_broker_external_repo_read_preflight_no_execute;
const readAuthPacket = readJson(readAuthFixtureRef).vcptoolbox_image_execution_broker_external_repo_read_authorization_packet_no_execute;
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

function sameStringSet(left, right) {
  return left.length === right.length && left.every((item) => right.includes(item));
}

const contract = fixture.authorization_contract;
const packet = fixture.authorization_packet;
const proposalPacket = proposal.proposal;
const readAuthorizationDocRef = "docs/vcptoolbox_image_execution_broker_external_repo_read_authorization_packet_no_execute.md";
const nextExactRead = "perform_vcptoolbox_image_execution_broker_external_repo_exact_read_with_receipt_only_after_separate_authorization";

check("doc_exists", () => doc.length > 0);
check("fixture_phase_matches_doc", () => doc.includes(fixture.phase));
check("parent_refs_exist", () =>
  fixture.parent_split_plan_ref === "docs/ail_core_vcp_adapter_split_plan_no_execute.md" &&
  fixture.parent_proposal_ref === "docs/vcptoolbox_image_execution_broker_implementation_proposal_no_execute.md" &&
  fixture.parent_plan_ref === "docs/vcptoolbox_image_execution_broker_followup_plan.md" &&
  exists(fixture.parent_split_plan_ref) &&
  exists(fixture.parent_proposal_ref) &&
  exists(fixture.parent_plan_ref) &&
  Object.values(fixture.source_refs).every((ref) => exists(ref))
);
check("status_is_no_execute_authorization_packet", () =>
  fixture.status === "local_external_repo_authorization_packet_no_execute" &&
  contract.authority_status === "authorization_packet_only_no_external_access" &&
  contract.can_execute_now === false &&
  contract.external_repo_read_allowed_now === false &&
  contract.external_repo_write_allowed_now === false &&
  contract.route_http_allowed_now === false &&
  contract.provider_plugin_api_image_allowed_now === false &&
  contract.secret_value_read_allowed === false &&
  contract.dependency_change_allowed === false &&
  contract.push_allowed === false &&
  doc.includes("not that future decision")
);
check("readiness_review_recorded_but_no_external_access", () =>
  fixture.source_refs.external_repo_readiness_review_ref === "docs/vcptoolbox_image_execution_broker_external_repo_readiness_review_no_execute.md" &&
  fixture.readiness_review_ref === "docs/vcptoolbox_image_execution_broker_external_repo_readiness_review_no_execute.md" &&
  fixture.readiness_review_status === "completed_validated_no_execute_review_20260610" &&
  fixture.readiness_result === "pass_ready_for_read_preflight_template" &&
  fixture.source_refs.external_repo_read_preflight_ref === "docs/vcptoolbox_image_execution_broker_external_repo_read_preflight_no_execute.md" &&
  fixture.read_preflight_ref === "docs/vcptoolbox_image_execution_broker_external_repo_read_preflight_no_execute.md" &&
  fixture.read_preflight_status === "completed_validated_no_execute_preflight_20260610" &&
  fixture.preflight_result === "ready_for_separate_exact_read_authorization_packet" &&
  fixture.read_authorization_packet_ref === readAuthorizationDocRef &&
  fixture.read_authorization_packet_status === "completed_validated_no_execute_packet_20260610" &&
  fixture.packet_result === "ready_for_separate_exact_read_execution_with_receipt" &&
  fixture.real_external_read_still_allowed_now === false &&
  fixture.real_external_write_still_allowed_now === false &&
  readinessReview.readiness_contract.readiness_result === "pass_ready_for_read_preflight_template" &&
  readinessReview.external_repo_read_allowed_by_this_review === false &&
  readinessReview.external_repo_write_allowed_by_this_review === false &&
  readPreflight.read_preflight_contract.preflight_result === "ready_for_separate_exact_read_authorization_packet" &&
  readPreflight.external_repo_read_allowed_by_this_preflight === false &&
  readPreflight.external_repo_write_allowed_by_this_preflight === false &&
  readAuthPacket.read_authorization_contract.packet_result === "ready_for_separate_exact_read_execution_with_receipt" &&
  readAuthPacket.external_repo_read_performed_by_this_packet === false &&
  readAuthPacket.external_repo_write_allowed_by_this_packet === false &&
  exists(fixture.readiness_review_ref) &&
  exists(fixture.read_preflight_ref) &&
  exists(fixture.read_authorization_packet_ref) &&
  doc.includes("does not execute") &&
  doc.includes("approve VCPToolBox access")
);
check("target_system_repo_and_branch_match_proposal", () =>
  contract.target_system === "VCPToolBox" &&
  contract.target_repo === "JENN2046/VCPToolBox" &&
  contract.target_branch_required_before_future_write === "main" &&
  packet.target_system === proposalPacket.target_system &&
  packet.target_repo === proposalPacket.target_repo &&
  packet.target_branch_required_before_future_write === proposalPacket.target_branch_required_before_future_write
);
check("required_fields_cover_authorization_packet_shape", () =>
  [
    "packet_id",
    "target_system",
    "target_repo",
    "target_branch_required_before_future_write",
    "requested_future_operation",
    "candidate_external_files",
    "forbidden_external_files_or_actions",
    "required_pre_authorization_evidence",
    "future_read_preflight",
    "future_write_envelope",
    "future_validation_plan",
    "rollback_or_cleanup_plan",
    "stop_conditions",
    "execution_boundary",
  ].every((field) => contract.required_fields.includes(field) && Object.prototype.hasOwnProperty.call(packet, field))
);
check("requested_future_operation_splits_read_and_write", () =>
  packet.requested_future_operation.operation_type === "exact_external_repo_read_then_bounded_write_proposal" &&
  packet.requested_future_operation.future_execution_requires_separate_confirmation === true &&
  packet.requested_future_operation.future_write_requires_separate_confirmation === true &&
  packet.requested_future_operation.no_external_access_granted_by_this_packet === true &&
  doc.includes("A read result is not a write approval")
);
check("candidate_external_files_match_implementation_proposal", () => {
  const packetPaths = packet.candidate_external_files.map((entry) => entry.path);
  const proposalPaths = proposalPacket.candidate_external_files.map((entry) => entry.path);
  return packet.candidate_external_files.length === 6 &&
    sameStringSet(packetPaths, proposalPaths) &&
    packet.candidate_external_files.every((entry) =>
      proposalPacket.candidate_external_files.some((proposalEntry) =>
        proposalEntry.path === entry.path &&
        proposalEntry.action === entry.action &&
        proposalEntry.purpose === entry.purpose
      )
    );
});
check("forbidden_external_actions_cover_red_boundaries", () =>
  [
    "broad_repository_rewrite",
    "package_manager_or_dependency_change",
    "package_json_or_lockfile_change",
    "secret_or_env_file_read",
    "credential_or_token_edit",
    "cookie_or_private_config_read",
    "log_or_raw_private_data_read",
    "full_pluginManager_exposure_to_route",
    "arbitrary_provider_plugin_api_payload_dispatch",
    "route_http_probe",
    "provider_plugin_api_or_image_call",
    "generic_endpoint_enablement",
    "accepted_samples_or_production_candidate_write",
    "DailyNote_or_VCP_memory_write",
    "generated_image_or_run_artifact_write",
    "external_repo_commit_push_tag_release_deploy",
    "force_push_history_rewrite_or_destructive_action",
  ].every((item) => packet.forbidden_external_files_or_actions.includes(item))
);
check("pre_authorization_evidence_chains_all_prior_local_gates", () =>
  [
    "generation_channel_contract_preflight_validated",
    "image_run_capability_binding_preflight_template_validated",
    "compatibility_route_thin_ingress_plan_validated",
    "vcptoolbox_image_execution_broker_implementation_proposal_validated",
    "generic_image_execution_endpoint_gate_validated",
    "ail_core_vcp_adapter_split_plan_validated",
  ].every((item) => packet.required_pre_authorization_evidence.local_ail_gates.includes(item)) &&
  splitPlan.split_plan.pre_implementation_requirements.includes("exact_external_repo_authorization_packet_issued_before_VCPToolBox_write")
);
check("future_external_read_evidence_required_but_not_performed_now", () => {
  const evidence = packet.required_pre_authorization_evidence;
  return evidence.future_external_repo_read_evidence_required.includes("exact_local_VCPToolBox_workspace_path_verified_without_secret_reads") &&
    evidence.future_external_repo_read_evidence_required.includes("VCPToolBox_current_branch_verified") &&
    evidence.future_external_repo_read_evidence_required.includes("VCPToolBox_remote_head_verified") &&
    evidence.future_external_repo_read_evidence_required.includes("exact_target_files_existence_or_absence_checked") &&
    evidence.future_external_repo_read_evidence_required.includes("no_secret_env_cookie_token_private_config_or_log_read") &&
    evidence.current_packet_external_evidence_status.exact_local_VCPToolBox_workspace_path_recorded_now === false &&
    evidence.current_packet_external_evidence_status.VCPToolBox_branch_or_head_checked_now === false &&
    evidence.current_packet_external_evidence_status.external_target_files_checked_now === false &&
    doc.includes("must not") &&
    doc.includes("private local VCPToolBox path")
});
check("future_read_preflight_is_bounded_and_secretless", () =>
  packet.future_read_preflight.can_execute_now === false &&
  packet.future_read_preflight.read_allowed_by_this_packet_now === false &&
  packet.future_read_preflight.allowed_future_read_scope.includes("git branch --show-current in exact VCPToolBox workspace") &&
  packet.future_read_preflight.allowed_future_read_scope.includes("git status --short in exact VCPToolBox workspace") &&
  packet.future_read_preflight.allowed_future_read_scope.includes("git log --oneline --decorate -n 10 in exact VCPToolBox workspace") &&
  packet.future_read_preflight.allowed_future_read_scope.includes("read candidate external files only if they exist") &&
  packet.future_read_preflight.forbidden_future_read_scope.includes(".env") &&
  packet.future_read_preflight.forbidden_future_read_scope.includes("tokens") &&
  packet.future_read_preflight.forbidden_future_read_scope.includes("raw private data") &&
  packet.future_read_preflight.max_external_read_files === 20 &&
  packet.future_read_preflight.raw_source_copy_into_AIL_allowed === false &&
  packet.future_read_preflight.sanitized_summary_only === true
);
check("future_write_envelope_blocks_write_now_and_limits_future_scope", () => {
  const envelope = packet.future_write_envelope;
  return envelope.can_execute_now === false &&
    envelope.write_allowed_by_this_packet_now === false &&
    envelope.future_external_repo_write_requires_separate_confirmation === true &&
    envelope.exact_allowed_files_must_match_candidate_external_files === true &&
    envelope.max_write_files === packet.candidate_external_files.length &&
    envelope.overwrite_existing_files_allowed === false &&
    envelope.dependency_manifest_change_allowed === false &&
    envelope.lockfile_change_allowed === false &&
    envelope.generated_artifact_write_allowed === false &&
    envelope.route_http_allowed_during_write === false &&
    envelope.provider_plugin_api_image_allowed_during_write === false &&
    envelope.memory_write_allowed_during_write === false &&
    envelope.commit_allowed === false &&
    envelope.push_allowed === false;
});
check("validation_plan_records_local_and_future_external_checks", () =>
  packet.future_validation_plan.local_AIL_packet_validation.includes("npm run validate:vcptoolbox-image-execution-broker-external-repo-authorization-packet-no-execute") &&
  packet.future_validation_plan.local_AIL_packet_validation.includes("npm run validate:ail-core-vcp-adapter-split-plan-no-execute") &&
  packet.future_validation_plan.local_AIL_packet_validation.includes("npm run validate:vcptoolbox-image-execution-broker-followup-plan") &&
  packet.future_validation_plan.local_AIL_packet_validation.includes("npm run validate:vcptoolbox-image-execution-broker-implementation-proposal-no-execute") &&
  packet.future_validation_plan.local_AIL_packet_validation.includes("npm run validate:validation-manifest") &&
  packet.future_validation_plan.future_external_repo_validation_required.includes("route/broker unit tests proving payload cannot select provider/plugin/API") &&
  packet.future_validation_plan.future_external_repo_validation_required.includes("ImageRunCapability registry tests proving VCPToolBox binding refs are authoritative") &&
  packet.future_validation_plan.future_external_repo_validation_required.includes("RestrictedPluginFacade tests proving no full pluginManager exposure") &&
  packet.future_validation_plan.future_external_repo_validation_required.includes("memory candidate tests proving no default memory write") &&
  packet.future_validation_plan.future_external_repo_validation_required.includes("git diff --check inside VCPToolBox")
);
check("rollback_plan_is_required_before_future_write", () =>
  packet.rollback_or_cleanup_plan.required_before_future_write === true &&
  packet.rollback_or_cleanup_plan.minimum_required.includes("exact file list to revert") &&
  packet.rollback_or_cleanup_plan.minimum_required.includes("exact test files to revert") &&
  packet.rollback_or_cleanup_plan.minimum_required.includes("no dependency or lockfile rollback unless exact package action is authorized") &&
  packet.rollback_or_cleanup_plan.minimum_required.includes("no force push or history rewrite") &&
  packet.rollback_or_cleanup_plan.minimum_required.includes("restore task-specific compatibility routes if generic endpoint migration fails") &&
  packet.rollback_or_cleanup_plan.current_packet_cleanup_required === false
);
check("stop_conditions_cover_external_repo_and_execution_boundaries", () =>
  fixture.authorization_packet_stop_conditions.includes("external_vcptoolbox_read_or_write_without_separate_exact_authorization") &&
  fixture.authorization_packet_stop_conditions.includes("raw_private_local_vcptoolbox_path_storage_requested") &&
  fixture.authorization_packet_stop_conditions.includes("secret_env_cookie_token_private_config_log_or_raw_private_data_read_required") &&
  fixture.authorization_packet_stop_conditions.includes("dependency_package_or_lockfile_change_requested_without_exact_package_action_list") &&
  fixture.authorization_packet_stop_conditions.includes("external_file_outside_candidate_allowlist_requested") &&
  fixture.authorization_packet_stop_conditions.includes("payload_dispatch_authority_requested") &&
  fixture.authorization_packet_stop_conditions.includes("generic_endpoint_enablement_requested") &&
  fixture.authorization_packet_stop_conditions.includes("route_http_request_requested") &&
  fixture.authorization_packet_stop_conditions.includes("provider_plugin_api_or_image_generation_requested") &&
  fixture.authorization_packet_stop_conditions.includes("commit_push_tag_release_deploy_requested") &&
  doc.includes("write files outside the candidate external file allowlist") &&
  doc.includes("enable `/internal/agent-image-lab/executions/run`")
);
check("followup_wp7_is_completed_by_this_packet", () => {
  const wp7 = followup.work_packages.find((wp) => wp.work_package_id === "vcptoolbox_image_execution_broker_external_repo_authorization_packet");
  return wp7 &&
    wp7.status === "completed_validated_no_execute_packet_20260610" &&
    wp7.completion_refs.includes(docRef) &&
    wp7.completion_refs.includes(fixtureRef) &&
    wp7.completion_refs.includes("scripts/validate_vcptoolbox_image_execution_broker_external_repo_authorization_packet_no_execute.js") &&
    wp7.external_repo_read_allowed_now === false &&
    wp7.external_repo_write_allowed_now === false &&
    wp7.can_execute_now === false;
});
check("execution_boundary_flags_false", () => allFlagsFalse(fixture.execution_boundary));
check("doc_boundary_flags_present", () =>
  Object.keys(fixture.execution_boundary).every((key) => doc.includes(`${key}: false`))
);
check("recommended_next_is_exact_read_after_read_authorization_packet", () =>
  fixture.completed_previous === "prepare_vcptoolbox_image_execution_broker_external_repo_read_authorization_packet_no_execute" &&
  fixture.recommended_next === nextExactRead &&
  fixture.automatic_real_execution_allowed_by_this_packet === false &&
  fixture.external_repo_read_allowed_by_this_packet === false &&
  fixture.external_repo_write_allowed_by_this_packet === false &&
  fixture.broker_implementation_allowed_by_this_packet === false &&
  fixture.generic_endpoint_enablement_allowed_by_this_packet === false &&
  doc.includes(nextExactRead)
);

const failed = results.filter((result) => !result.passed);
const output = {
  passed: failed.length === 0,
  validator: "vcptoolbox_image_execution_broker_external_repo_authorization_packet_no_execute",
  phase: fixture.phase,
  doc_ref: docRef,
  fixture_ref: fixtureRef,
  check_count: results.length,
  failed_count: failed.length,
  external_VCPToolBox_read_performed: false,
  external_VCPToolBox_write_performed: false,
  external_repo_branch_or_head_checked: false,
  external_repo_target_files_checked: false,
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
