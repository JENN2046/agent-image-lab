#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const docRef = "docs/vcptoolbox_image_execution_broker_external_repo_read_authorization_packet_no_execute.md";
const fixtureRef = "tests/schema_examples/vcptoolbox_image_execution_broker_external_repo_read_authorization_packet_no_execute.example.json";
const readPreflightFixtureRef = "tests/schema_examples/vcptoolbox_image_execution_broker_external_repo_read_preflight_no_execute.example.json";
const readinessFixtureRef = "tests/schema_examples/vcptoolbox_image_execution_broker_external_repo_readiness_review_no_execute.example.json";
const authFixtureRef = "tests/schema_examples/vcptoolbox_image_execution_broker_external_repo_authorization_packet_no_execute.example.json";
const proposalFixtureRef = "tests/schema_examples/vcptoolbox_image_execution_broker_implementation_proposal_no_execute.example.json";
const splitFixtureRef = "tests/schema_examples/ail_core_vcp_adapter_split_plan_no_execute.example.json";
const followupFixtureRef = "tests/schema_examples/vcptoolbox_image_execution_broker_followup_plan.example.json";
const receiptTemplateDocRef = "docs/vcptoolbox_image_execution_broker_external_repo_exact_read_receipt_template_no_execute.md";
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
const fixture = readJson(fixtureRef).vcptoolbox_image_execution_broker_external_repo_read_authorization_packet_no_execute;
const readPreflight = readJson(readPreflightFixtureRef).vcptoolbox_image_execution_broker_external_repo_read_preflight_no_execute;
const readinessReview = readJson(readinessFixtureRef).vcptoolbox_image_execution_broker_external_repo_readiness_review_no_execute;
const authPacket = readJson(authFixtureRef).vcptoolbox_image_execution_broker_external_repo_authorization_packet_no_execute;
const proposal = readJson(proposalFixtureRef).vcptoolbox_image_execution_broker_implementation_proposal_no_execute;
const splitPlan = readJson(splitFixtureRef).ail_core_vcp_adapter_split_plan_no_execute;
const followup = readJson(followupFixtureRef).vcptoolbox_image_execution_broker_followup_plan;
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

function sameStringSet(left, right) {
  return left.length === right.length && left.every((item) => right.includes(item));
}

function objectContainsWindowsAbsolutePath(value) {
  if (typeof value === "string") return /[A-Za-z]:[\\/]/.test(value) || /^\\\\/.test(value);
  if (Array.isArray(value)) return value.some((item) => objectContainsWindowsAbsolutePath(item));
  if (value && typeof value === "object") {
    return Object.values(value).some((item) => objectContainsWindowsAbsolutePath(item));
  }
  return false;
}

const contract = fixture.read_authorization_contract;
const packet = fixture.read_authorization_packet;
const preflight = readPreflight.read_preflight;
const packetCandidatePaths = packet.authorized_future_file_reads.map((entry) => entry.path);
const preflightCandidatePaths = preflight.allowed_future_file_reads.map((entry) => entry.path);
const readinessCandidatePaths = readinessReview.readiness_review.candidate_external_files_reviewed_from_packet;
const authCandidatePaths = authPacket.authorization_packet.candidate_external_files.map((entry) => entry.path);
const proposalCandidatePaths = proposal.proposal.candidate_external_files.map((entry) => entry.path);
const nextExactRead = "perform_vcptoolbox_image_execution_broker_external_repo_exact_read_with_receipt_only_after_separate_authorization";

check("doc_exists", () => doc.length > 0);
check("fixture_phase_matches_doc", () => doc.includes(fixture.phase));
check("parent_refs_exist", () =>
  fixture.parent_read_preflight_ref === "docs/vcptoolbox_image_execution_broker_external_repo_read_preflight_no_execute.md" &&
  fixture.parent_readiness_review_ref === "docs/vcptoolbox_image_execution_broker_external_repo_readiness_review_no_execute.md" &&
  fixture.parent_authorization_packet_ref === "docs/vcptoolbox_image_execution_broker_external_repo_authorization_packet_no_execute.md" &&
  fixture.parent_followup_plan_ref === "docs/vcptoolbox_image_execution_broker_followup_plan.md" &&
  exists(fixture.parent_read_preflight_ref) &&
  exists(fixture.parent_readiness_review_ref) &&
  exists(fixture.parent_authorization_packet_ref) &&
  exists(fixture.parent_followup_plan_ref) &&
  Object.values(fixture.source_refs).every((ref) => exists(ref))
);
check("status_is_no_execute_read_authorization_packet", () =>
  fixture.status === "local_external_repo_read_authorization_packet_no_execute" &&
  contract.authority_status === "read_authorization_packet_only_no_external_access" &&
  contract.packet_result === "ready_for_separate_exact_read_execution_with_receipt" &&
  contract.can_execute_now === false &&
  contract.external_repo_read_allowed_now === false &&
  contract.external_repo_write_allowed_now === false &&
  contract.route_http_allowed_now === false &&
  contract.provider_plugin_api_image_allowed_now === false &&
  contract.secret_value_read_allowed === false &&
  contract.dependency_change_allowed === false &&
  contract.push_allowed === false &&
  doc.includes("It does not perform or approve that read in this no-execute phase")
);
check("required_fields_cover_packet_shape", () =>
  [
    "packet_id",
    "target_system",
    "target_repo",
    "workspace_target_policy",
    "requested_future_operation",
    "authorized_future_git_commands",
    "authorized_future_file_reads",
    "forbidden_future_reads_or_actions",
    "max_read_budget",
    "sanitized_output_policy",
    "read_execution_sequence",
    "read_receipt_contract",
    "validation_plan",
    "stop_conditions",
    "execution_boundary",
  ].every((field) => contract.required_fields.includes(field) && Object.prototype.hasOwnProperty.call(packet, field))
);
check("target_matches_parent_packets", () =>
  contract.target_system === "VCPToolBox" &&
  contract.target_repo === "JENN2046/VCPToolBox" &&
  contract.target_branch_required_before_future_write === "main" &&
  packet.target_system === preflight.target_system &&
  packet.target_repo === preflight.target_repo &&
  packet.target_repo === authPacket.authorization_packet.target_repo &&
  packet.target_repo === readinessReview.readiness_review.target_repo &&
  packet.target_repo === proposal.proposal.target_repo &&
  packet.target_branch_required_before_future_write === preflight.target_branch_required_before_future_write
);
check("requested_future_operation_is_single_read_only_action", () => {
  const op = packet.requested_future_operation;
  return op.operation_id === "vcptoolbox_image_execution_broker_exact_external_repo_read" &&
    op.operation_type === "exact_external_repo_read_only" &&
    op.one_action_only === true &&
    op.future_operation_requires_separate_execution_confirmation === true &&
    op.future_write_requires_separate_confirmation === true &&
    op.no_external_access_granted_by_this_packet_now === true &&
    op.future_read_output === "sanitized_read_receipt_only" &&
    doc.includes("A read receipt is not a write") &&
    doc.includes("approval");
});
check("workspace_target_policy_matches_preflight_without_private_path", () => {
  const policy = packet.workspace_target_policy;
  const preflightPolicy = preflight.workspace_target_policy;
  return JSON.stringify(policy) === JSON.stringify(preflightPolicy) &&
    policy.workspace_ref === "VCPTOOLBOX_WORKSPACE_RESOLVED_AT_EXECUTION_TIME" &&
    policy.private_local_path_recorded_now === false &&
    policy.raw_private_path_print_allowed === false &&
    doc.includes("must not store or print that private path");
});
check("authorized_git_commands_match_read_preflight_exactly", () =>
  JSON.stringify(packet.authorized_future_git_commands) === JSON.stringify(preflight.allowed_future_git_commands) &&
  packet.authorized_future_git_commands.length === 5 &&
  packet.authorized_future_git_commands.every((entry) => !entry.command_template.includes("fetch")) &&
  doc.includes("No `git fetch`") &&
  doc.includes("history rewrite is authorized by this packet")
);
check("authorized_file_reads_match_read_preflight_and_parent_allowlists", () =>
  packet.authorized_future_file_reads.length === 6 &&
  packet.authorized_future_file_reads.every((entry) => entry.if_missing === "record_absent_without_creating") &&
  sameStringSet(packetCandidatePaths, preflightCandidatePaths) &&
  sameStringSet(packetCandidatePaths, readinessCandidatePaths) &&
  sameStringSet(packetCandidatePaths, authCandidatePaths) &&
  sameStringSet(packetCandidatePaths, proposalCandidatePaths) &&
  doc.includes("complete future source-file read allowlist")
);
check("forbidden_reads_match_preflight_and_cover_red_boundaries", () =>
  JSON.stringify(packet.forbidden_future_reads_or_actions) === JSON.stringify(preflight.forbidden_future_reads_or_actions) &&
  [
    ".env",
    "config.env",
    "secrets",
    "credentials",
    "tokens",
    "cookies",
    "private_configs",
    "logs",
    "raw_private_data",
    "package_json_or_lockfile_read",
    "node_modules_or_dependency_tree_read",
    "unrelated_source_tree_read",
    "broad_repository_scan",
    "raw_source_copy_into_AIL",
    "route_http_probe",
    "provider_plugin_api_or_image_call",
    "generic_endpoint_enablement",
    "accepted_samples_or_production_candidate_write",
    "DailyNote_or_VCP_memory_write",
    "generated_image_or_run_artifact_write",
    "dependency_or_package_manager_change",
    "external_repo_write",
    "external_repo_commit_push_tag_release_deploy",
    "force_push_history_rewrite_or_destructive_action",
  ].every((item) => packet.forbidden_future_reads_or_actions.includes(item))
);
check("read_budget_matches_read_preflight_and_is_narrow", () =>
  JSON.stringify(packet.max_read_budget) === JSON.stringify(preflight.max_read_budget) &&
  packet.max_read_budget.max_git_commands === 5 &&
  packet.max_read_budget.max_external_source_file_reads === 6 &&
  packet.max_read_budget.max_external_read_operations_total === 11 &&
  packet.max_read_budget.max_retry_per_failed_read === 0 &&
  packet.max_read_budget.network_access_allowed === false &&
  packet.max_read_budget.external_write_allowed === false
);
check("sanitized_output_policy_matches_read_preflight", () =>
  JSON.stringify(packet.sanitized_output_policy) === JSON.stringify(preflight.sanitized_output_policy) &&
  packet.sanitized_output_policy.raw_source_copy_into_AIL_allowed === false &&
  packet.sanitized_output_policy.raw_private_local_path_allowed === false &&
  packet.sanitized_output_policy.secret_value_print_allowed === false &&
  packet.sanitized_output_policy.full_file_dump_allowed === false &&
  packet.sanitized_output_policy.allowed_summary_fields.includes("dispatch_authority_risk_summary") &&
  packet.sanitized_output_policy.forbidden_summary_fields.includes("full_source_text") &&
  doc.includes("must") &&
  doc.includes("not copy VCPToolBox source into AIL")
);
check("read_execution_sequence_stops_after_sanitized_receipt", () =>
  JSON.stringify(packet.read_execution_sequence) === JSON.stringify([
    "verify_workspace_without_printing_private_path",
    "run_exact_authorized_git_commands",
    "read_only_authorized_candidate_files_if_present",
    "record_missing_candidate_files_as_absent",
    "produce_sanitized_read_receipt",
    "stop_before_any_write_or_runtime_action",
  ]) &&
  doc.includes("stop_before_any_write_or_runtime_action")
);
check("read_receipt_contract_requires_safety_evidence_and_blocks_write_gate", () => {
  const receipt = packet.read_receipt_contract;
  return receipt.future_receipt_required === true &&
    receipt.future_receipt_target_directory === "reports/external_repo_reads/" &&
    receipt.receipt_template_ref === receiptTemplateDocRef &&
    receipt.receipt_write_allowed_now === false &&
    receipt.required_fields.includes("receipt_schema_id") &&
    receipt.required_fields.includes("read_authorization_packet_ref") &&
    receipt.required_fields.includes("receipt_template_ref") &&
    receipt.required_fields.includes("workspace_verified_without_printing_private_path") &&
    receipt.required_fields.includes("workspace_private_path_recorded") &&
    receipt.required_fields.includes("allowed_git_commands_used") &&
    receipt.required_fields.includes("allowed_file_reads_used") &&
    receipt.required_fields.includes("forbidden_paths_attempted") &&
    receipt.required_fields.includes("secret_value_read_performed") &&
    receipt.required_fields.includes("raw_source_copied_into_AIL") &&
    receipt.required_fields.includes("external_write_performed") &&
    receipt.required_fields.includes("route_http_request_performed") &&
    receipt.required_fields.includes("provider_plugin_api_image_performed") &&
    receipt.required_fields.includes("dependency_change_performed") &&
    receipt.required_fields.includes("read_receipt_written") &&
    receipt.required_fields.includes("sanitized_summary_only") &&
    receipt.required_fields.includes("stop_reason") &&
    receipt.required_fields.includes("validation_summary") &&
    receipt.next_write_gate_allowed === false &&
    receipt.next_write_gate_requires_separate_packet === true &&
    receiptTemplate.future_receipt_target.target_directory === receipt.future_receipt_target_directory;
});
check("validation_plan_chains_local_packet_and_future_receipt_checks", () =>
  packet.validation_plan.local_AIL_no_execute_validation.includes("npm run validate:vcptoolbox-image-execution-broker-external-repo-read-authorization-packet-no-execute") &&
  packet.validation_plan.local_AIL_no_execute_validation.includes("npm run validate:vcptoolbox-image-execution-broker-external-repo-exact-read-receipt-template-no-execute") &&
  packet.validation_plan.local_AIL_no_execute_validation.includes("npm run validate:vcptoolbox-image-execution-broker-external-repo-read-preflight-no-execute") &&
  packet.validation_plan.local_AIL_no_execute_validation.includes("npm run validate:vcptoolbox-image-execution-broker-external-repo-readiness-review-no-execute") &&
  packet.validation_plan.local_AIL_no_execute_validation.includes("npm run validate:vcptoolbox-image-execution-broker-external-repo-authorization-packet-no-execute") &&
  packet.validation_plan.local_AIL_no_execute_validation.includes("npm run validate:vcptoolbox-image-execution-broker-followup-plan") &&
  packet.validation_plan.local_AIL_no_execute_validation.includes("npm run validate:ail-core-vcp-adapter-split-plan-no-execute") &&
  packet.validation_plan.local_AIL_no_execute_validation.includes("npm run validate:validation-manifest") &&
  packet.validation_plan.future_external_read_receipt_validation_required.includes("exact read receipt validates allowed git commands only") &&
  packet.validation_plan.future_external_read_receipt_validation_required.includes("exact candidate file matrix matches six-path allowlist") &&
  packet.validation_plan.future_external_read_receipt_validation_required.includes("next_write_gate_allowed is false")
);
check("stop_conditions_cover_no_execute_and_red_boundaries", () =>
  fixture.read_authorization_stop_conditions.includes("actual_external_vcptoolbox_read_requested_in_no_execute_phase") &&
  fixture.read_authorization_stop_conditions.includes("future_read_execution_without_separate_instruction_requested") &&
  fixture.read_authorization_stop_conditions.includes("raw_private_local_vcptoolbox_path_storage_or_print_requested") &&
  fixture.read_authorization_stop_conditions.includes("secret_env_cookie_token_private_config_log_package_lock_or_raw_private_data_read_required") &&
  fixture.read_authorization_stop_conditions.includes("external_file_outside_six_path_candidate_allowlist_requested") &&
  fixture.read_authorization_stop_conditions.includes("raw_vcptoolbox_source_copy_into_ail_requested") &&
  fixture.read_authorization_stop_conditions.includes("external_repo_write_requested") &&
  fixture.read_authorization_stop_conditions.includes("route_http_request_requested") &&
  fixture.read_authorization_stop_conditions.includes("provider_plugin_api_or_image_generation_requested") &&
  fixture.read_authorization_stop_conditions.includes("commit_push_tag_release_deploy_requested") &&
  doc.includes("Execute the future read without a separate exact execution instruction") &&
  doc.includes("Write accepted samples, production candidate metadata")
);
check("followup_wp10_is_completed_by_this_packet", () => {
  const wp10 = followup.work_packages.find((wp) => wp.work_package_id === "vcptoolbox_image_execution_broker_external_repo_read_authorization_packet");
  return wp10 &&
    wp10.status === "completed_validated_no_execute_packet_20260610" &&
    wp10.target_system === "VCPToolBox" &&
    wp10.target_repo === "JENN2046/VCPToolBox" &&
    wp10.packet_result === "ready_for_separate_exact_read_execution_with_receipt" &&
    wp10.allowed_future_git_command_count === 5 &&
    wp10.allowed_future_file_read_count === 6 &&
    wp10.external_repo_read_allowed_now === false &&
    wp10.external_repo_write_allowed_now === false &&
    wp10.can_execute_now === false &&
    wp10.completion_refs.includes(docRef) &&
    wp10.completion_refs.includes(fixtureRef) &&
    wp10.completion_refs.includes("scripts/validate_vcptoolbox_image_execution_broker_external_repo_read_authorization_packet_no_execute.js") &&
    wp10.completion_refs.every((ref) => exists(ref));
});
check("parent_artifacts_advance_to_exact_read_next", () =>
  readPreflight.read_authorization_packet_ref === docRef &&
  readPreflight.completed_previous === "prepare_vcptoolbox_image_execution_broker_external_repo_read_authorization_packet_no_execute" &&
  readPreflight.recommended_next === nextExactRead &&
  readinessReview.read_authorization_packet_ref === docRef &&
  readinessReview.completed_previous === "prepare_vcptoolbox_image_execution_broker_external_repo_read_authorization_packet_no_execute" &&
  readinessReview.recommended_next === nextExactRead &&
  authPacket.read_authorization_packet_ref === docRef &&
  authPacket.completed_previous === "prepare_vcptoolbox_image_execution_broker_external_repo_read_authorization_packet_no_execute" &&
  authPacket.recommended_next === nextExactRead &&
  splitPlan.source_refs.external_repo_read_authorization_packet_ref === docRef &&
  splitPlan.source_refs.external_repo_exact_read_receipt_template_ref === receiptTemplateDocRef &&
  splitPlan.completed_previous === "prepare_vcptoolbox_image_execution_broker_external_repo_exact_read_receipt_template_no_execute" &&
  splitPlan.recommended_next === nextExactRead
);
check("followup_recommended_next_is_exact_read_after_receipt_template", () =>
  followup.completed_previous === "prepare_vcptoolbox_image_execution_broker_external_repo_exact_read_receipt_template_no_execute" &&
  followup.completion_refs.includes(receiptTemplateDocRef) &&
  followup.completion_refs.includes(receiptTemplateFixtureRef) &&
  followup.completion_refs.includes("scripts/validate_vcptoolbox_image_execution_broker_external_repo_exact_read_receipt_template_no_execute.js") &&
  followup.recommended_next === nextExactRead &&
  followup.external_repo_read_allowed_by_this_plan === false &&
  followup.external_repo_write_allowed_by_this_plan === false
);
check("execution_boundary_flags_false", () => allFlagsFalse(fixture.execution_boundary));
check("doc_boundary_flags_present", () =>
  Object.keys(fixture.execution_boundary).every((key) => doc.includes(`${key}: false`))
);
check("no_private_windows_path_recorded_in_fixture", () => objectContainsWindowsAbsolutePath(fixture) === false);
check("recommended_next_is_exact_read_receipt_only_after_separate_authorization", () =>
  fixture.source_refs.external_repo_exact_read_receipt_template_ref === receiptTemplateDocRef &&
  fixture.exact_read_receipt_template_ref === receiptTemplateDocRef &&
  fixture.exact_read_receipt_template_status === "completed_validated_no_execute_template_20260610" &&
  fixture.receipt_template_result === "ready_for_future_exact_read_receipt_population" &&
  fixture.completed_previous === "prepare_vcptoolbox_image_execution_broker_external_repo_exact_read_receipt_template_no_execute" &&
  fixture.recommended_next === nextExactRead &&
  fixture.automatic_real_execution_allowed_by_this_packet === false &&
  fixture.external_repo_read_performed_by_this_packet === false &&
  fixture.external_repo_write_allowed_by_this_packet === false &&
  fixture.broker_implementation_allowed_by_this_packet === false &&
  fixture.generic_endpoint_enablement_allowed_by_this_packet === false &&
  doc.includes(nextExactRead)
);

const failed = results.filter((result) => !result.passed);
const output = {
  passed: failed.length === 0,
  validator: "vcptoolbox_image_execution_broker_external_repo_read_authorization_packet_no_execute",
  phase: fixture.phase,
  doc_ref: docRef,
  fixture_ref: fixtureRef,
  check_count: results.length,
  failed_count: failed.length,
  external_VCPToolBox_read_performed: false,
  external_VCPToolBox_write_performed: false,
  external_repo_branch_or_head_checked: false,
  external_repo_target_files_checked: false,
  read_receipt_written_now: false,
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
