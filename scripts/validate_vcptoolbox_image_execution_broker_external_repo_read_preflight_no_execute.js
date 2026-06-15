#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const docRef = "docs/vcptoolbox_image_execution_broker_external_repo_read_preflight_no_execute.md";
const fixtureRef = "tests/schema_examples/vcptoolbox_image_execution_broker_external_repo_read_preflight_no_execute.example.json";
const readinessFixtureRef = "tests/schema_examples/vcptoolbox_image_execution_broker_external_repo_readiness_review_no_execute.example.json";
const authFixtureRef = "tests/schema_examples/vcptoolbox_image_execution_broker_external_repo_authorization_packet_no_execute.example.json";
const readAuthFixtureRef = "tests/schema_examples/vcptoolbox_image_execution_broker_external_repo_read_authorization_packet_no_execute.example.json";
const proposalFixtureRef = "tests/schema_examples/vcptoolbox_image_execution_broker_implementation_proposal_no_execute.example.json";
const splitFixtureRef = "tests/schema_examples/ail_core_vcp_adapter_split_plan_no_execute.example.json";
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
const fixture = readJson(fixtureRef).vcptoolbox_image_execution_broker_external_repo_read_preflight_no_execute;
const readinessReview = readJson(readinessFixtureRef).vcptoolbox_image_execution_broker_external_repo_readiness_review_no_execute;
const authPacket = readJson(authFixtureRef).vcptoolbox_image_execution_broker_external_repo_authorization_packet_no_execute;
const readAuthPacket = readJson(readAuthFixtureRef).vcptoolbox_image_execution_broker_external_repo_read_authorization_packet_no_execute;
const proposal = readJson(proposalFixtureRef).vcptoolbox_image_execution_broker_implementation_proposal_no_execute;
const splitPlan = readJson(splitFixtureRef).ail_core_vcp_adapter_split_plan_no_execute;
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

const contract = fixture.read_preflight_contract;
const preflight = fixture.read_preflight;
const preflightCandidatePaths = preflight.allowed_future_file_reads.map((entry) => entry.path);
const readinessCandidatePaths = readinessReview.readiness_review.candidate_external_files_reviewed_from_packet;
const authCandidatePaths = authPacket.authorization_packet.candidate_external_files.map((entry) => entry.path);
const proposalCandidatePaths = proposal.proposal.candidate_external_files.map((entry) => entry.path);
const readAuthorizationDocRef = "docs/vcptoolbox_image_execution_broker_external_repo_read_authorization_packet_no_execute.md";
const receiptTemplateDocRef = "docs/vcptoolbox_image_execution_broker_external_repo_exact_read_receipt_template_no_execute.md";
const receiptTemplateFixtureRef = "tests/schema_examples/vcptoolbox_image_execution_broker_external_repo_exact_read_receipt_template_no_execute.example.json";
const nextExactRead = "perform_vcptoolbox_image_execution_broker_external_repo_exact_read_with_receipt_only_after_separate_authorization";

check("doc_exists", () => doc.length > 0);
check("fixture_phase_matches_doc", () => doc.includes(fixture.phase));
check("parent_refs_exist", () =>
  fixture.parent_readiness_review_ref === "docs/vcptoolbox_image_execution_broker_external_repo_readiness_review_no_execute.md" &&
  fixture.parent_authorization_packet_ref === "docs/vcptoolbox_image_execution_broker_external_repo_authorization_packet_no_execute.md" &&
  fixture.parent_followup_plan_ref === "docs/vcptoolbox_image_execution_broker_followup_plan.md" &&
  exists(fixture.parent_readiness_review_ref) &&
  exists(fixture.parent_authorization_packet_ref) &&
  exists(fixture.parent_followup_plan_ref) &&
  Object.values(fixture.source_refs).every((ref) => exists(ref))
);
check("status_is_no_execute_read_preflight", () =>
  fixture.status === "local_external_repo_read_preflight_no_execute" &&
  contract.authority_status === "read_preflight_template_only_no_external_access" &&
  contract.preflight_result === "ready_for_separate_exact_read_authorization_packet" &&
  contract.can_execute_now === false &&
  contract.external_repo_read_allowed_now === false &&
  contract.external_repo_write_allowed_now === false &&
  contract.route_http_allowed_now === false &&
  contract.provider_plugin_api_image_allowed_now === false &&
  contract.secret_value_read_allowed === false &&
  contract.dependency_change_allowed === false &&
  contract.push_allowed === false &&
  doc.includes("It does not approve or perform that read")
);
check("required_fields_cover_preflight_shape", () =>
  [
    "preflight_id",
    "target_system",
    "target_repo",
    "workspace_target_policy",
    "allowed_future_git_commands",
    "allowed_future_file_reads",
    "forbidden_future_reads_or_actions",
    "max_read_budget",
    "sanitized_output_policy",
    "read_receipt_requirements",
    "validation_plan",
    "stop_conditions",
    "execution_boundary",
  ].every((field) => contract.required_fields.includes(field) && Object.prototype.hasOwnProperty.call(preflight, field))
);
check("target_matches_parent_packets", () =>
  contract.target_system === "VCPToolBox" &&
  contract.target_repo === "JENN2046/VCPToolBox" &&
  contract.target_branch_required_before_future_write === "main" &&
  preflight.target_system === authPacket.authorization_packet.target_system &&
  preflight.target_repo === authPacket.authorization_packet.target_repo &&
  preflight.target_repo === readinessReview.readiness_review.target_repo &&
  preflight.target_repo === proposal.proposal.target_repo &&
  preflight.target_branch_required_before_future_write === authPacket.authorization_packet.target_branch_required_before_future_write
);
check("workspace_target_policy_uses_placeholder_without_private_path", () => {
  const policy = preflight.workspace_target_policy;
  return policy.workspace_ref === "VCPTOOLBOX_WORKSPACE_RESOLVED_AT_EXECUTION_TIME" &&
    policy.private_local_path_recorded_now === false &&
    policy.raw_private_path_print_allowed === false &&
    policy.path_must_be_verified_without_secret_reads === true &&
    policy.workspace_must_be_git_repo === true &&
    policy.expected_remote_repo === "JENN2046/VCPToolBox" &&
    policy.expected_future_write_branch === "main" &&
    doc.includes("must not store that private path");
});
check("allowed_future_git_commands_are_exact_and_non_networked", () => {
  const commandById = Object.fromEntries(preflight.allowed_future_git_commands.map((entry) => [entry.id, entry.command_template]));
  return preflight.allowed_future_git_commands.length === 5 &&
    commandById.current_branch === "git -C <VCPTOOLBOX_WORKSPACE> branch --show-current" &&
    commandById.working_tree_status === "git -C <VCPTOOLBOX_WORKSPACE> status --short" &&
    commandById.current_head === "git -C <VCPTOOLBOX_WORKSPACE> rev-parse HEAD" &&
    commandById.remote_tracking_head === "git -C <VCPTOOLBOX_WORKSPACE> rev-parse origin/main" &&
    commandById.recent_history === "git -C <VCPTOOLBOX_WORKSPACE> log --oneline --decorate -n 10" &&
    preflight.allowed_future_git_commands.every((entry) => !entry.command_template.includes("fetch")) &&
    doc.includes("No `git fetch`") &&
    doc.includes("history rewrite is allowed by this preflight");
});
check("allowed_future_file_reads_match_all_parent_candidate_allowlists", () =>
  preflight.allowed_future_file_reads.length === 6 &&
  preflight.allowed_future_file_reads.every((entry) => entry.if_missing === "record_absent_without_creating") &&
  sameStringSet(preflightCandidatePaths, readinessCandidatePaths) &&
  sameStringSet(preflightCandidatePaths, authCandidatePaths) &&
  sameStringSet(preflightCandidatePaths, proposalCandidatePaths)
);
check("forbidden_reads_cover_secrets_private_package_broad_runtime_and_git_writes", () =>
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
  ].every((item) => preflight.forbidden_future_reads_or_actions.includes(item))
);
check("read_budget_is_narrower_than_authorization_packet", () =>
  preflight.max_read_budget.max_git_commands === 5 &&
  preflight.max_read_budget.max_candidate_source_files === 6 &&
  preflight.max_read_budget.max_external_source_file_reads === 6 &&
  preflight.max_read_budget.max_external_read_operations_total === 11 &&
  preflight.max_read_budget.max_retry_per_failed_read === 0 &&
  preflight.max_read_budget.network_access_allowed === false &&
  preflight.max_read_budget.external_write_allowed === false &&
  authPacket.authorization_packet.future_read_preflight.max_external_read_files === 20 &&
  preflight.max_read_budget.max_external_source_file_reads < authPacket.authorization_packet.future_read_preflight.max_external_read_files
);
check("sanitized_output_policy_blocks_raw_source_and_private_data", () => {
  const policy = preflight.sanitized_output_policy;
  return policy.raw_source_copy_into_AIL_allowed === false &&
    policy.raw_private_local_path_allowed === false &&
    policy.secret_value_print_allowed === false &&
    policy.full_file_dump_allowed === false &&
    policy.allowed_summary_fields.includes("dispatch_authority_risk_summary") &&
    policy.allowed_summary_fields.includes("missing_or_conflict_notes") &&
    policy.forbidden_summary_fields.includes("raw_secret_values") &&
    policy.forbidden_summary_fields.includes("raw_private_paths") &&
    policy.forbidden_summary_fields.includes("full_source_text") &&
    doc.includes("not a copy of VCPToolBox source");
});
check("read_receipt_requires_safety_evidence_and_no_write_gate", () => {
  const receipt = preflight.read_receipt_requirements;
  return receipt.receipt_required_after_future_read === true &&
    receipt.required_fields.includes("workspace_verified_without_printing_private_path") &&
    receipt.required_fields.includes("candidate_file_matrix") &&
    receipt.required_fields.includes("forbidden_paths_attempted") &&
    receipt.required_fields.includes("secret_value_read_performed") &&
    receipt.required_fields.includes("raw_source_copied_into_AIL") &&
    receipt.required_fields.includes("external_write_performed") &&
    receipt.required_fields.includes("sanitized_summary_only") &&
    receipt.next_write_gate_allowed === false &&
    receipt.next_write_gate_requires_separate_packet === true;
});
check("validation_plan_chains_local_and_future_read_receipt_checks", () =>
  preflight.validation_plan.local_AIL_no_execute_validation.includes("npm run validate:vcptoolbox-image-execution-broker-external-repo-read-preflight-no-execute") &&
  preflight.validation_plan.local_AIL_no_execute_validation.includes("npm run validate:vcptoolbox-image-execution-broker-external-repo-readiness-review-no-execute") &&
  preflight.validation_plan.local_AIL_no_execute_validation.includes("npm run validate:vcptoolbox-image-execution-broker-external-repo-authorization-packet-no-execute") &&
  preflight.validation_plan.local_AIL_no_execute_validation.includes("npm run validate:vcptoolbox-image-execution-broker-followup-plan") &&
  preflight.validation_plan.local_AIL_no_execute_validation.includes("npm run validate:ail-core-vcp-adapter-split-plan-no-execute") &&
  preflight.validation_plan.local_AIL_no_execute_validation.includes("npm run validate:validation-manifest") &&
  preflight.validation_plan.future_external_read_validation_required.includes("exact read receipt validates allowed git commands only") &&
  preflight.validation_plan.future_external_read_validation_required.includes("exact candidate file matrix matches six-path allowlist") &&
  preflight.validation_plan.future_external_read_validation_required.includes("forbidden path attempts equal empty list") &&
  preflight.validation_plan.future_external_read_validation_required.includes("secret_value_read_performed is false") &&
  preflight.validation_plan.future_external_read_validation_required.includes("raw_source_copied_into_AIL is false") &&
  preflight.validation_plan.future_external_read_validation_required.includes("external_write_performed is false")
);
check("stop_conditions_cover_no_execute_red_boundaries", () =>
  fixture.read_preflight_stop_conditions.includes("actual_external_vcptoolbox_read_requested") &&
  fixture.read_preflight_stop_conditions.includes("raw_private_local_vcptoolbox_path_storage_or_print_requested") &&
  fixture.read_preflight_stop_conditions.includes("secret_env_cookie_token_private_config_log_package_lock_or_raw_private_data_read_required") &&
  fixture.read_preflight_stop_conditions.includes("external_file_outside_six_path_candidate_allowlist_requested") &&
  fixture.read_preflight_stop_conditions.includes("raw_vcptoolbox_source_copy_into_ail_requested") &&
  fixture.read_preflight_stop_conditions.includes("external_repo_write_requested") &&
  fixture.read_preflight_stop_conditions.includes("dependency_package_manager_or_lockfile_change_requested") &&
  fixture.read_preflight_stop_conditions.includes("route_http_request_requested") &&
  fixture.read_preflight_stop_conditions.includes("provider_plugin_api_or_image_generation_requested") &&
  fixture.read_preflight_stop_conditions.includes("commit_push_tag_release_deploy_requested") &&
  doc.includes("Actually read VCPToolBox instead of preparing or validating this local no-execute preflight") &&
  doc.includes("Read files outside the six candidate file allowlist")
);
check("followup_wp9_is_completed_by_this_preflight", () => {
  const wp9 = followup.work_packages.find((wp) => wp.work_package_id === "vcptoolbox_image_execution_broker_external_repo_read_preflight");
  return wp9 &&
    wp9.status === "completed_validated_no_execute_preflight_20260610" &&
    wp9.target_system === "VCPToolBox" &&
    wp9.target_repo === "JENN2046/VCPToolBox" &&
    wp9.preflight_result === "ready_for_separate_exact_read_authorization_packet" &&
    wp9.external_repo_read_allowed_now === false &&
    wp9.external_repo_write_allowed_now === false &&
    wp9.can_execute_now === false &&
    wp9.allowed_future_git_command_count === 5 &&
    wp9.allowed_future_file_read_count === 6 &&
    wp9.completion_refs.includes(docRef) &&
    wp9.completion_refs.includes(fixtureRef) &&
    wp9.completion_refs.includes("scripts/validate_vcptoolbox_image_execution_broker_external_repo_read_preflight_no_execute.js") &&
    wp9.completion_refs.every((ref) => exists(ref));
});
check("readiness_authorization_and_read_auth_packets_advanced_to_exact_read", () =>
  readinessReview.read_preflight_ref === docRef &&
  readinessReview.read_authorization_packet_ref === readAuthorizationDocRef &&
  readinessReview.completed_previous === "prepare_vcptoolbox_image_execution_broker_external_repo_read_authorization_packet_no_execute" &&
  readinessReview.recommended_next === nextExactRead &&
  readinessReview.external_repo_read_allowed_by_this_review === false &&
  authPacket.read_preflight_ref === docRef &&
  authPacket.read_authorization_packet_ref === readAuthorizationDocRef &&
  authPacket.completed_previous === "prepare_vcptoolbox_image_execution_broker_external_repo_read_authorization_packet_no_execute" &&
  authPacket.recommended_next === nextExactRead &&
  authPacket.external_repo_read_allowed_by_this_packet === false &&
  readAuthPacket.parent_read_preflight_ref === docRef &&
  readAuthPacket.completed_previous === "prepare_vcptoolbox_image_execution_broker_external_repo_exact_read_receipt_template_no_execute" &&
  readAuthPacket.recommended_next === nextExactRead &&
  readAuthPacket.external_repo_read_performed_by_this_packet === false
);
check("split_plan_records_read_preflight_before_external_read", () =>
  splitPlan.source_refs.external_repo_read_preflight_ref === docRef &&
  splitPlan.source_refs.external_repo_read_authorization_packet_ref === readAuthorizationDocRef &&
  splitPlan.source_refs.external_repo_exact_read_receipt_template_ref === receiptTemplateDocRef &&
  splitPlan.split_plan.pre_implementation_requirements.includes("vcptoolbox_image_execution_broker_external_repo_read_preflight_validated") &&
  splitPlan.split_plan.pre_implementation_requirements.includes("vcptoolbox_image_execution_broker_external_repo_read_authorization_packet_validated") &&
  splitPlan.split_plan.pre_implementation_requirements.includes("vcptoolbox_image_execution_broker_external_repo_exact_read_receipt_template_validated") &&
  splitPlan.split_plan.validation_plan.local_AIL_no_execute_validation.includes("npm run validate:vcptoolbox-image-execution-broker-external-repo-read-preflight-no-execute") &&
  splitPlan.split_plan.validation_plan.local_AIL_no_execute_validation.includes("npm run validate:vcptoolbox-image-execution-broker-external-repo-read-authorization-packet-no-execute") &&
  splitPlan.split_plan.validation_plan.local_AIL_no_execute_validation.includes("npm run validate:vcptoolbox-image-execution-broker-external-repo-exact-read-receipt-template-no-execute") &&
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
check("recommended_next_is_exact_read_after_read_authorization_packet", () =>
  fixture.read_authorization_packet_ref === readAuthorizationDocRef &&
  fixture.read_authorization_packet_status === "completed_validated_no_execute_packet_20260610" &&
  fixture.packet_result === "ready_for_separate_exact_read_execution_with_receipt" &&
  fixture.completed_previous === "prepare_vcptoolbox_image_execution_broker_external_repo_read_authorization_packet_no_execute" &&
  fixture.recommended_next === nextExactRead &&
  fixture.automatic_real_execution_allowed_by_this_preflight === false &&
  fixture.external_repo_read_allowed_by_this_preflight === false &&
  fixture.external_repo_write_allowed_by_this_preflight === false &&
  fixture.broker_implementation_allowed_by_this_preflight === false &&
  fixture.generic_endpoint_enablement_allowed_by_this_preflight === false &&
  doc.includes(nextExactRead)
);

const failed = results.filter((result) => !result.passed);
const output = {
  passed: failed.length === 0,
  validator: "vcptoolbox_image_execution_broker_external_repo_read_preflight_no_execute",
  phase: fixture.phase,
  doc_ref: docRef,
  fixture_ref: fixtureRef,
  check_count: results.length,
  failed_count: failed.length,
  external_VCPToolBox_read_performed: false,
  external_VCPToolBox_write_performed: false,
  external_repo_branch_or_head_checked: false,
  external_repo_target_files_checked: false,
  external_repo_package_or_test_commands_discovered: false,
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
