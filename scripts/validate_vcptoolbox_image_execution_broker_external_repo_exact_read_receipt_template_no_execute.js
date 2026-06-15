#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const docRef = "docs/vcptoolbox_image_execution_broker_external_repo_exact_read_receipt_template_no_execute.md";
const fixtureRef = "tests/schema_examples/vcptoolbox_image_execution_broker_external_repo_exact_read_receipt_template_no_execute.example.json";
const readAuthDocRef = "docs/vcptoolbox_image_execution_broker_external_repo_read_authorization_packet_no_execute.md";
const readAuthFixtureRef = "tests/schema_examples/vcptoolbox_image_execution_broker_external_repo_read_authorization_packet_no_execute.example.json";
const followupFixtureRef = "tests/schema_examples/vcptoolbox_image_execution_broker_followup_plan.example.json";
const splitFixtureRef = "tests/schema_examples/ail_core_vcp_adapter_split_plan_no_execute.example.json";
const nextExactRead = "perform_vcptoolbox_image_execution_broker_external_repo_exact_read_with_receipt_only_after_separate_authorization";

function readText(ref) {
  return fs.readFileSync(path.join(repoRoot, ref), "utf8");
}

function readJson(ref) {
  return JSON.parse(readText(ref));
}

function exists(ref) {
  return fs.existsSync(path.join(repoRoot, ref));
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

const doc = readText(docRef);
const fixture = readJson(fixtureRef).vcptoolbox_image_execution_broker_external_repo_exact_read_receipt_template_no_execute;
const readAuth = readJson(readAuthFixtureRef).vcptoolbox_image_execution_broker_external_repo_read_authorization_packet_no_execute;
const followup = readJson(followupFixtureRef).vcptoolbox_image_execution_broker_followup_plan;
const splitPlan = readJson(splitFixtureRef).ail_core_vcp_adapter_split_plan_no_execute;
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

const contract = fixture.receipt_template_contract;
const target = fixture.future_receipt_target;
const matrix = fixture.candidate_file_matrix_template;
const readAuthPacket = readAuth.read_authorization_packet;
const readAuthCandidatePaths = readAuthPacket.authorized_future_file_reads.map((entry) => entry.path);
const templateCandidatePaths = matrix.entries.map((entry) => entry.path);
const readAuthCommandIds = readAuthPacket.authorized_future_git_commands.map((entry) => entry.id);
const templateCommandIds = fixture.authorized_future_git_commands.map((entry) => entry.id);
const requiredFutureFields = [
  "receipt_schema_id",
  "read_packet_id",
  "read_authorization_packet_ref",
  "receipt_template_ref",
  "target_system",
  "target_repo",
  "workspace_verified_without_printing_private_path",
  "workspace_private_path_recorded",
  "current_branch",
  "current_head",
  "remote_tracking_head_or_unavailable",
  "working_tree_status_summary",
  "allowed_git_commands_used",
  "allowed_file_reads_used",
  "candidate_file_matrix",
  "forbidden_paths_attempted",
  "sanitized_summary_only",
  "secret_value_read_performed",
  "raw_source_copied_into_AIL",
  "external_write_performed",
  "route_http_request_performed",
  "provider_plugin_api_image_performed",
  "dependency_change_performed",
  "read_receipt_written",
  "next_write_gate_allowed",
  "stop_reason",
  "validation_summary",
];

check("doc_exists", () => doc.length > 0);
check("fixture_phase_matches_doc", () => doc.includes(fixture.phase));
check("parent_refs_exist", () =>
  fixture.parent_read_authorization_packet_ref === readAuthDocRef &&
  fixture.parent_followup_plan_ref === "docs/vcptoolbox_image_execution_broker_followup_plan.md" &&
  exists(fixture.parent_read_authorization_packet_ref) &&
  exists(fixture.parent_followup_plan_ref) &&
  Object.values(fixture.source_refs).every((ref) => exists(ref))
);
check("status_is_no_execute_receipt_template", () =>
  fixture.status === "local_exact_read_receipt_template_no_execute" &&
  contract.authority_status === "exact_read_receipt_template_only_no_external_access" &&
  contract.template_result === "ready_for_future_exact_read_receipt_population" &&
  contract.can_execute_now === false &&
  contract.external_repo_read_allowed_now === false &&
  contract.external_repo_write_allowed_now === false &&
  contract.receipt_write_allowed_now === false &&
  contract.receipt_population_allowed_now === false &&
  contract.route_http_allowed_now === false &&
  contract.provider_plugin_api_image_allowed_now === false &&
  contract.secret_value_read_allowed === false &&
  contract.dependency_change_allowed === false &&
  contract.raw_source_copy_allowed === false &&
  contract.private_path_print_allowed === false &&
  contract.push_allowed === false &&
  doc.includes("It does not perform the read, write a receipt")
);
check("target_matches_read_authorization_packet", () =>
  contract.target_system === "VCPToolBox" &&
  contract.target_repo === "JENN2046/VCPToolBox" &&
  contract.target_system === readAuth.read_authorization_contract.target_system &&
  contract.target_repo === readAuth.read_authorization_contract.target_repo
);
check("required_future_receipt_fields_are_locked", () =>
  requiredFutureFields.every((field) => contract.required_fields.includes(field)) &&
  contract.required_fields.length === requiredFutureFields.length &&
  doc.includes("required_fields") &&
  doc.includes("workspace_private_path_recorded") &&
  doc.includes("next_write_gate_allowed")
);
check("future_receipt_target_matches_read_authorization_contract", () =>
  target.target_directory === readAuthPacket.read_receipt_contract.future_receipt_target_directory &&
  target.target_write_allowed_now === false &&
  target.overwrite_existing_receipt_allowed === false &&
  target.receipt_must_reference_this_template === true &&
  target.receipt_must_reference_read_authorization_packet === true &&
  doc.includes("overwrite historical receipts")
);
check("authorized_git_commands_match_read_authorization_exactly", () =>
  sameStringSet(templateCommandIds, readAuthCommandIds) &&
  fixture.authorized_future_git_commands.length === 5 &&
  fixture.authorized_future_git_commands.every((entry) =>
    readAuthPacket.authorized_future_git_commands.some((source) =>
      source.id === entry.id && source.command_template === entry.command_template
    )
  ) &&
  doc.includes("No `git fetch`") &&
  doc.includes("history rewrite may appear in the receipt")
);
check("candidate_matrix_matches_read_authorization_six_path_allowlist", () =>
  matrix.entries.length === 6 &&
  sameStringSet(templateCandidatePaths, readAuthCandidatePaths) &&
  matrix.entries.every((entry) =>
    entry.if_missing === "record_absent_without_creating" &&
    entry.raw_source_included === false &&
    entry.secret_value_detected_or_read === false &&
    entry.exists === "to_be_recorded_at_execution_time" &&
    entry.read_attempted === "to_be_recorded_at_execution_time"
  ) &&
  doc.includes("exactly these six candidate paths")
);
check("candidate_matrix_entry_fields_are_complete", () =>
  [
    "path",
    "exists",
    "read_attempted",
    "if_missing",
    "summary_fields",
    "missing_or_conflict_notes",
    "raw_source_included",
    "secret_value_detected_or_read",
  ].every((field) => matrix.entry_required_fields.includes(field)) &&
  matrix.entries.every((entry) =>
    matrix.entry_required_fields.every((field) => Object.prototype.hasOwnProperty.call(entry, field))
  )
);
check("allowed_summary_fields_match_read_authorization_policy", () =>
  JSON.stringify(matrix.allowed_summary_fields) === JSON.stringify(readAuthPacket.sanitized_output_policy.allowed_summary_fields) &&
  matrix.entries.every((entry) => JSON.stringify(entry.summary_fields) === JSON.stringify(matrix.allowed_summary_fields)) &&
  matrix.allowed_summary_fields.includes("dispatch_authority_risk_summary") &&
  matrix.allowed_summary_fields.includes("missing_or_conflict_notes")
);
check("forbidden_receipt_fields_block_source_private_secret_and_patch_content", () =>
  [
    "raw_source_text",
    "raw_private_paths",
    "raw_secret_values",
    "raw_env_values",
    "full_file_dump",
    "unrelated_file_content",
    "write_patch",
    "generated_artifact_path_with_content",
    "package_or_lockfile_content",
  ].every((field) => fixture.forbidden_receipt_fields.includes(field)) &&
  doc.includes("The receipt is evidence, not a source mirror")
);
check("required_false_evidence_flags_all_false", () =>
  allFlagsFalse(fixture.required_false_evidence_flags) &&
  Object.prototype.hasOwnProperty.call(fixture.required_false_evidence_flags, "workspace_private_path_recorded") &&
  Object.prototype.hasOwnProperty.call(fixture.required_false_evidence_flags, "next_write_gate_allowed")
);
check("future_receipt_validation_rules_require_no_drift", () =>
  fixture.future_receipt_validation_rules.includes("receipt_schema_id equals vcptoolbox_image_execution_broker_external_repo_exact_read_receipt.v1") &&
  fixture.future_receipt_validation_rules.includes(`read_authorization_packet_ref matches ${readAuthDocRef}`) &&
  fixture.future_receipt_validation_rules.includes(`receipt_template_ref matches ${docRef}`) &&
  fixture.future_receipt_validation_rules.includes("allowed_git_commands_used contains only the five authorized command ids") &&
  fixture.future_receipt_validation_rules.includes("candidate_file_matrix contains exactly the six authorized candidate paths") &&
  fixture.future_receipt_validation_rules.includes("forbidden_paths_attempted is an empty array") &&
  fixture.future_receipt_validation_rules.includes("next_write_gate_allowed is false")
);
check("read_authorization_packet_points_to_template", () =>
  readAuth.source_refs.external_repo_exact_read_receipt_template_ref === docRef &&
  readAuth.exact_read_receipt_template_ref === docRef &&
  readAuth.exact_read_receipt_template_status === "completed_validated_no_execute_template_20260610" &&
  readAuth.receipt_template_result === "ready_for_future_exact_read_receipt_population" &&
  readAuth.read_authorization_packet.read_receipt_contract.receipt_template_ref === docRef &&
  readAuth.read_authorization_packet.read_receipt_contract.required_fields.includes("receipt_template_ref") &&
  readAuth.read_authorization_packet.validation_plan.local_AIL_no_execute_validation.includes("npm run validate:vcptoolbox-image-execution-broker-external-repo-exact-read-receipt-template-no-execute")
);
check("followup_wp11_records_completed_template", () => {
  const wp11 = followup.work_packages.find((wp) => wp.work_package_id === "vcptoolbox_image_execution_broker_external_repo_exact_read_receipt_template");
  return followup.work_packages.length === 11 &&
    wp11 &&
    wp11.lane === "Green_local_exact_read_receipt_template_only" &&
    wp11.status === "completed_validated_no_execute_template_20260610" &&
    wp11.target_system === "VCPToolBox" &&
    wp11.target_repo === "JENN2046/VCPToolBox" &&
    wp11.receipt_template_result === "ready_for_future_exact_read_receipt_population" &&
    wp11.allowed_future_git_command_count === 5 &&
    wp11.allowed_future_file_read_count === 6 &&
    wp11.external_repo_read_allowed_now === false &&
    wp11.external_repo_write_allowed_now === false &&
    wp11.read_receipt_written_now === false &&
    wp11.can_execute_now === false &&
    wp11.completion_refs.includes(docRef) &&
    wp11.completion_refs.includes(fixtureRef) &&
    wp11.completion_refs.includes("scripts/validate_vcptoolbox_image_execution_broker_external_repo_exact_read_receipt_template_no_execute.js") &&
    wp11.completion_refs.every((ref) => exists(ref));
});
check("split_plan_records_receipt_template_before_external_read", () =>
  splitPlan.source_refs.external_repo_exact_read_receipt_template_ref === docRef &&
  splitPlan.split_plan.pre_implementation_requirements.includes("vcptoolbox_image_execution_broker_external_repo_exact_read_receipt_template_validated") &&
  splitPlan.split_plan.validation_plan.local_AIL_no_execute_validation.includes("npm run validate:vcptoolbox-image-execution-broker-external-repo-exact-read-receipt-template-no-execute") &&
  splitPlan.completed_previous === "prepare_vcptoolbox_image_execution_broker_external_repo_exact_read_receipt_template_no_execute" &&
  splitPlan.recommended_next === nextExactRead
);
check("followup_recommended_next_remains_exact_read_after_separate_authorization", () =>
  followup.completed_previous === "prepare_vcptoolbox_image_execution_broker_external_repo_exact_read_receipt_template_no_execute" &&
  followup.completion_refs.includes(docRef) &&
  followup.completion_refs.includes(fixtureRef) &&
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
check("recommended_next_is_exact_read_with_fixed_receipt_only_after_separate_authorization", () =>
  fixture.completed_previous === "prepare_vcptoolbox_image_execution_broker_external_repo_exact_read_receipt_template_no_execute" &&
  fixture.recommended_next === nextExactRead &&
  fixture.automatic_real_execution_allowed_by_this_template === false &&
  fixture.external_repo_read_performed_by_this_template === false &&
  fixture.external_repo_write_allowed_by_this_template === false &&
  fixture.read_receipt_written_by_this_template === false &&
  fixture.broker_implementation_allowed_by_this_template === false &&
  fixture.generic_endpoint_enablement_allowed_by_this_template === false &&
  doc.includes(nextExactRead)
);

const failed = results.filter((result) => !result.passed);
const output = {
  passed: failed.length === 0,
  validator: "vcptoolbox_image_execution_broker_external_repo_exact_read_receipt_template_no_execute",
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
  receipt_population_performed_now: false,
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
