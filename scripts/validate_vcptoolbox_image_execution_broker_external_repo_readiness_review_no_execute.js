#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const docRef = "docs/vcptoolbox_image_execution_broker_external_repo_readiness_review_no_execute.md";
const fixtureRef = "tests/schema_examples/vcptoolbox_image_execution_broker_external_repo_readiness_review_no_execute.example.json";
const authFixtureRef = "tests/schema_examples/vcptoolbox_image_execution_broker_external_repo_authorization_packet_no_execute.example.json";
const proposalFixtureRef = "tests/schema_examples/vcptoolbox_image_execution_broker_implementation_proposal_no_execute.example.json";
const splitFixtureRef = "tests/schema_examples/ail_core_vcp_adapter_split_plan_no_execute.example.json";
const followupFixtureRef = "tests/schema_examples/vcptoolbox_image_execution_broker_followup_plan.example.json";
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
const fixture = readJson(fixtureRef).vcptoolbox_image_execution_broker_external_repo_readiness_review_no_execute;
const authPacket = readJson(authFixtureRef).vcptoolbox_image_execution_broker_external_repo_authorization_packet_no_execute;
const proposal = readJson(proposalFixtureRef).vcptoolbox_image_execution_broker_implementation_proposal_no_execute;
const splitPlan = readJson(splitFixtureRef).ail_core_vcp_adapter_split_plan_no_execute;
const followup = readJson(followupFixtureRef).vcptoolbox_image_execution_broker_followup_plan;
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

function objectContainsWindowsAbsolutePath(value) {
  if (typeof value === "string") return /[A-Za-z]:[\\/]/.test(value) || /^\\\\/.test(value);
  if (Array.isArray(value)) return value.some((item) => objectContainsWindowsAbsolutePath(item));
  if (value && typeof value === "object") {
    return Object.values(value).some((item) => objectContainsWindowsAbsolutePath(item));
  }
  return false;
}

const contract = fixture.readiness_contract;
const review = fixture.readiness_review;
const authCandidatePaths = authPacket.authorization_packet.candidate_external_files.map((entry) => entry.path);
const proposalCandidatePaths = proposal.proposal.candidate_external_files.map((entry) => entry.path);
const nextReadPreflight = "prepare_vcptoolbox_image_execution_broker_external_repo_read_preflight_no_execute";
const readAuthorizationDocRef = "docs/vcptoolbox_image_execution_broker_external_repo_read_authorization_packet_no_execute.md";
const receiptTemplateDocRef = "docs/vcptoolbox_image_execution_broker_external_repo_exact_read_receipt_template_no_execute.md";
const receiptTemplateFixtureRef = "tests/schema_examples/vcptoolbox_image_execution_broker_external_repo_exact_read_receipt_template_no_execute.example.json";
const nextExactRead = "perform_vcptoolbox_image_execution_broker_external_repo_exact_read_with_receipt_only_after_separate_authorization";

check("doc_exists", () => doc.length > 0);
check("fixture_phase_matches_doc", () => doc.includes(fixture.phase));
check("parent_refs_exist", () =>
  fixture.parent_authorization_packet_ref === "docs/vcptoolbox_image_execution_broker_external_repo_authorization_packet_no_execute.md" &&
  fixture.parent_split_plan_ref === "docs/ail_core_vcp_adapter_split_plan_no_execute.md" &&
  fixture.parent_followup_plan_ref === "docs/vcptoolbox_image_execution_broker_followup_plan.md" &&
  exists(fixture.parent_authorization_packet_ref) &&
  exists(fixture.parent_split_plan_ref) &&
  exists(fixture.parent_followup_plan_ref) &&
  Object.values(fixture.source_refs).every((ref) => exists(ref))
);
check("status_is_no_execute_readiness_review", () =>
  fixture.status === "local_external_repo_readiness_review_no_execute" &&
  contract.authority_status === "readiness_review_only_no_external_access" &&
  contract.readiness_result === "pass_ready_for_read_preflight_template" &&
  contract.can_execute_now === false &&
  contract.external_repo_read_allowed_now === false &&
  contract.external_repo_write_allowed_now === false &&
  contract.route_http_allowed_now === false &&
  contract.provider_plugin_api_image_allowed_now === false &&
  contract.secret_value_read_allowed === false &&
  contract.dependency_change_allowed === false &&
  contract.push_allowed === false &&
  doc.includes("It is still not permission to touch VCPToolBox")
);
check("required_fields_cover_review_shape", () =>
  [
    "review_id",
    "target_system",
    "target_repo",
    "target_branch_required_before_future_write",
    "reviewed_authorization_packet_ref",
    "readiness_result",
    "local_readiness_criteria",
    "deliberate_not_checked",
    "blocking_items_for_real_external_read",
    "blocking_items_for_real_external_write",
    "next_read_preflight_template_requirements",
    "execution_boundary",
  ].every((field) => contract.required_fields.includes(field) && Object.prototype.hasOwnProperty.call(review, field))
);
check("target_matches_authorization_packet_and_proposal", () =>
  contract.target_system === "VCPToolBox" &&
  contract.target_repo === "JENN2046/VCPToolBox" &&
  contract.target_branch_required_before_future_write === "main" &&
  review.target_system === authPacket.authorization_packet.target_system &&
  review.target_repo === authPacket.authorization_packet.target_repo &&
  review.target_repo === proposal.proposal.target_repo &&
  review.target_branch_required_before_future_write === authPacket.authorization_packet.target_branch_required_before_future_write &&
  review.target_branch_required_before_future_write === proposal.proposal.target_branch_required_before_future_write
);
check("candidate_external_files_match_packet_and_proposal", () =>
  review.candidate_external_files_reviewed_from_packet.length === 6 &&
  sameStringSet(review.candidate_external_files_reviewed_from_packet, authCandidatePaths) &&
  sameStringSet(review.candidate_external_files_reviewed_from_packet, proposalCandidatePaths) &&
  review.allowlist_status === "exact_candidate_only" &&
  review.external_file_existence_checked_now === false
);
check("local_criteria_pass_only_for_template_preparation", () => {
  const criteria = review.local_readiness_criteria;
  return criteria.target_repo_and_system_are_explicit === "pass" &&
    criteria.candidate_external_file_allowlist_is_exact === "pass" &&
    criteria.candidate_external_file_count === 6 &&
    criteria.candidate_external_files_match_implementation_proposal === "pass" &&
    criteria.forbidden_external_actions_cover_secrets_dependencies_dispatch_runtime_and_git === "pass" &&
    criteria.future_read_scope_is_bounded_and_secretless === "pass" &&
    criteria.future_write_envelope_is_bounded_and_separately_confirmed === "pass" &&
    criteria.local_validation_commands_are_explicit === "pass" &&
    criteria.rollback_or_cleanup_plan_is_present === "pass" &&
    criteria.stop_conditions_cover_red_boundaries === "pass" &&
    criteria.raw_private_local_vcptoolbox_path_recorded === false &&
    criteria.external_access_performed_by_review === false &&
    doc.includes("local contract readiness: pass") &&
    doc.includes("real external read readiness: blocked");
});
check("deliberate_unknowns_are_not_pretended_verified", () =>
  review.deliberate_not_checked.exact_local_VCPToolBox_workspace_path === "not_checked_by_this_review" &&
  review.deliberate_not_checked.VCPToolBox_current_branch === "not_checked_by_this_review" &&
  review.deliberate_not_checked.VCPToolBox_current_head === "not_checked_by_this_review" &&
  review.deliberate_not_checked.VCPToolBox_remote_head === "not_checked_by_this_review" &&
  review.deliberate_not_checked.candidate_external_file_existence_or_absence === "not_checked_by_this_review" &&
  review.deliberate_not_checked.package_or_test_commands_inside_VCPToolBox === "not_checked_by_this_review" &&
  doc.includes("pretending they were") &&
  doc.includes("verified")
);
check("no_blocker_for_template_but_real_read_blockers_remain", () =>
  Array.isArray(review.blocking_items_for_read_preflight_template) &&
  review.blocking_items_for_read_preflight_template.length === 0 &&
  review.blocking_items_for_real_external_read.includes("exact_local_VCPToolBox_workspace_path_not_verified") &&
  review.blocking_items_for_real_external_read.includes("VCPToolBox_branch_and_head_not_verified") &&
  review.blocking_items_for_real_external_read.includes("VCPToolBox_remote_head_not_verified") &&
  review.blocking_items_for_real_external_read.includes("candidate_external_files_not_checked") &&
  review.blocking_items_for_real_external_read.includes("secretless_read_scope_not_yet_issued_as_exact_preflight")
);
check("read_preflight_recorded_but_no_external_access", () =>
  fixture.read_preflight_ref === "docs/vcptoolbox_image_execution_broker_external_repo_read_preflight_no_execute.md" &&
  fixture.read_preflight_status === "completed_validated_no_execute_preflight_20260610" &&
  fixture.preflight_result === "ready_for_separate_exact_read_authorization_packet" &&
  fixture.real_external_read_still_allowed_now === false &&
  fixture.real_external_write_still_allowed_now === false &&
  review.read_preflight_ref === fixture.read_preflight_ref &&
  review.read_preflight_status === fixture.read_preflight_status &&
  review.preflight_result === fixture.preflight_result &&
  readPreflight.read_preflight_contract.preflight_result === "ready_for_separate_exact_read_authorization_packet" &&
  readPreflight.external_repo_read_allowed_by_this_preflight === false &&
  readPreflight.external_repo_write_allowed_by_this_preflight === false &&
  exists(fixture.read_preflight_ref) &&
  doc.includes("does not approve the real") &&
  doc.includes("external repository read")
);
check("real_write_blockers_remain", () =>
  review.blocking_items_for_real_external_write.includes("real_external_read_not_performed") &&
  review.blocking_items_for_real_external_write.includes("VCPToolBox_context_not_summarized") &&
  review.blocking_items_for_real_external_write.includes("exact_write_packet_not_issued") &&
  review.blocking_items_for_real_external_write.includes("external_validation_commands_not_discovered") &&
  review.blocking_items_for_real_external_write.includes("separate_write_confirmation_not_present")
);
check("next_read_preflight_template_requirements_are_bounded", () => {
  const requirements = review.next_read_preflight_template_requirements;
  return requirements.recommended_next === nextReadPreflight &&
    requirements.can_execute_now === false &&
    requirements.read_allowed_by_this_review_now === false &&
    requirements.must_define_before_any_real_read.includes("exact external repository workspace target without printing private path") &&
    requirements.must_define_before_any_real_read.includes("exact branch/head/status commands") &&
    requirements.must_define_before_any_real_read.includes("exact candidate file read allowlist") &&
    requirements.must_define_before_any_real_read.includes("exact forbidden secret/private/log paths") &&
    requirements.must_define_before_any_real_read.includes("sanitized-summary-only output rule") &&
    requirements.must_define_before_any_real_read.includes("validation command for the preflight packet") &&
    requirements.must_not_include.includes("raw secret values") &&
    requirements.must_not_include.includes("raw private local VCPToolBox path") &&
    requirements.must_not_include.includes("route HTTP request") &&
    requirements.must_not_include.includes("provider/plugin/API/image execution") &&
    requirements.must_not_include.includes("external repo write") &&
    requirements.must_not_include.includes("commit/push/tag/release/deploy");
});
check("authorization_packet_has_advanced_to_exact_read_after_read_authorization", () =>
  authPacket.readiness_review_ref === docRef &&
  authPacket.read_preflight_ref === "docs/vcptoolbox_image_execution_broker_external_repo_read_preflight_no_execute.md" &&
  authPacket.read_authorization_packet_ref === readAuthorizationDocRef &&
  authPacket.completed_previous === "prepare_vcptoolbox_image_execution_broker_external_repo_read_authorization_packet_no_execute" &&
  authPacket.recommended_next === nextExactRead &&
  authPacket.external_repo_read_allowed_by_this_packet === false &&
  authPacket.external_repo_write_allowed_by_this_packet === false
);
check("split_plan_records_readiness_before_read_preflight", () =>
  splitPlan.source_refs.external_repo_readiness_review_ref === docRef &&
  splitPlan.source_refs.external_repo_read_preflight_ref === "docs/vcptoolbox_image_execution_broker_external_repo_read_preflight_no_execute.md" &&
  splitPlan.source_refs.external_repo_read_authorization_packet_ref === readAuthorizationDocRef &&
  splitPlan.source_refs.external_repo_exact_read_receipt_template_ref === receiptTemplateDocRef &&
  splitPlan.split_plan.pre_implementation_requirements.includes("vcptoolbox_image_execution_broker_external_repo_readiness_review_validated") &&
  splitPlan.split_plan.pre_implementation_requirements.includes("vcptoolbox_image_execution_broker_external_repo_read_preflight_validated") &&
  splitPlan.split_plan.pre_implementation_requirements.includes("vcptoolbox_image_execution_broker_external_repo_read_authorization_packet_validated") &&
  splitPlan.split_plan.pre_implementation_requirements.includes("vcptoolbox_image_execution_broker_external_repo_exact_read_receipt_template_validated") &&
  splitPlan.split_plan.validation_plan.local_AIL_no_execute_validation.includes("npm run validate:vcptoolbox-image-execution-broker-external-repo-readiness-review-no-execute") &&
  splitPlan.split_plan.validation_plan.local_AIL_no_execute_validation.includes("npm run validate:vcptoolbox-image-execution-broker-external-repo-read-preflight-no-execute") &&
  splitPlan.split_plan.validation_plan.local_AIL_no_execute_validation.includes("npm run validate:vcptoolbox-image-execution-broker-external-repo-read-authorization-packet-no-execute") &&
  splitPlan.split_plan.validation_plan.local_AIL_no_execute_validation.includes("npm run validate:vcptoolbox-image-execution-broker-external-repo-exact-read-receipt-template-no-execute") &&
  splitPlan.completed_previous === "prepare_vcptoolbox_image_execution_broker_external_repo_exact_read_receipt_template_no_execute" &&
  splitPlan.recommended_next === nextExactRead
);
check("followup_wp8_is_completed_by_this_review", () => {
  const wp8 = followup.work_packages.find((wp) => wp.work_package_id === "vcptoolbox_image_execution_broker_external_repo_readiness_review");
  return wp8 &&
    wp8.status === "completed_validated_no_execute_review_20260610" &&
    wp8.target_system === "VCPToolBox" &&
    wp8.target_repo === "JENN2046/VCPToolBox" &&
    wp8.readiness_result === "pass_ready_for_read_preflight_template" &&
    wp8.external_repo_read_allowed_now === false &&
    wp8.external_repo_write_allowed_now === false &&
    wp8.can_execute_now === false &&
    wp8.completion_refs.includes(docRef) &&
    wp8.completion_refs.includes(fixtureRef) &&
    wp8.completion_refs.includes("scripts/validate_vcptoolbox_image_execution_broker_external_repo_readiness_review_no_execute.js") &&
    wp8.completion_refs.every((ref) => exists(ref));
});
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
check("stop_rules_cover_read_write_secrets_runtime_memory_and_git", () =>
  doc.includes("Read or modify VCPToolBox instead of preparing a local no-execute read-preflight template") &&
  doc.includes("raw private local VCPToolBox path") &&
  doc.includes("Read `.env`, secrets, cookies, tokens") &&
  doc.includes("Change dependencies, package managers, lockfiles") &&
  doc.includes("Enable `/internal/agent-image-lab/executions/run`") &&
  doc.includes("Call route HTTP, provider, plugin, API, or image generation") &&
  doc.includes("Write accepted samples, production candidate metadata") &&
  doc.includes("Commit, push, tag, release, deploy")
);
check("no_private_windows_path_recorded_in_fixture", () => objectContainsWindowsAbsolutePath(fixture) === false);
check("recommended_next_is_exact_read_after_read_authorization_packet", () =>
  fixture.read_authorization_packet_ref === readAuthorizationDocRef &&
  fixture.read_authorization_packet_status === "completed_validated_no_execute_packet_20260610" &&
  fixture.packet_result === "ready_for_separate_exact_read_execution_with_receipt" &&
  readAuthPacket.parent_readiness_review_ref === docRef &&
  readAuthPacket.completed_previous === "prepare_vcptoolbox_image_execution_broker_external_repo_exact_read_receipt_template_no_execute" &&
  readAuthPacket.recommended_next === nextExactRead &&
  fixture.completed_previous === "prepare_vcptoolbox_image_execution_broker_external_repo_read_authorization_packet_no_execute" &&
  fixture.recommended_next === nextExactRead &&
  fixture.automatic_real_execution_allowed_by_this_review === false &&
  fixture.external_repo_read_allowed_by_this_review === false &&
  fixture.external_repo_write_allowed_by_this_review === false &&
  fixture.broker_implementation_allowed_by_this_review === false &&
  fixture.generic_endpoint_enablement_allowed_by_this_review === false &&
  doc.includes(nextExactRead)
);

const failed = results.filter((result) => !result.passed);
const output = {
  passed: failed.length === 0,
  validator: "vcptoolbox_image_execution_broker_external_repo_readiness_review_no_execute",
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
