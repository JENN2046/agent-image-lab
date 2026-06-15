#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const docRef = "docs/vcptoolbox_image_execution_broker_followup_plan.md";
const fixtureRef = "tests/schema_examples/vcptoolbox_image_execution_broker_followup_plan.example.json";
const sourceDraftRef = "docs/vcptoolbox_image_execution_broker_design_input_sanitized.md";
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

const doc = readText(docRef);
const fixture = readJson(fixtureRef).vcptoolbox_image_execution_broker_followup_plan;
const results = [];
const receiptTemplateDocRef = "docs/vcptoolbox_image_execution_broker_external_repo_exact_read_receipt_template_no_execute.md";
const receiptTemplateFixtureRef = "tests/schema_examples/vcptoolbox_image_execution_broker_external_repo_exact_read_receipt_template_no_execute.example.json";
const receiptTemplateValidatorRef = "scripts/validate_vcptoolbox_image_execution_broker_external_repo_exact_read_receipt_template_no_execute.js";

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

function containsWindowsAbsolutePath(value) {
  if (typeof value === "string") {
    return /(?:^|[^A-Za-z0-9_])(?:[A-Za-z]:[\\/]|\\\\[^\\/\s]+[\\/][^\\/\s]+)/.test(value);
  }
  if (Array.isArray(value)) return value.some((item) => containsWindowsAbsolutePath(item));
  if (value && typeof value === "object") {
    return Object.values(value).some((item) => containsWindowsAbsolutePath(item));
  }
  return false;
}

const sourceDraft = readText(sourceDraftRef);

check("doc_exists", () => doc.length > 0);
check("fixture_phase_matches_doc", () => doc.includes(fixture.phase));
check("source_draft_is_recorded_read_only", () =>
  fixture.source_draft === sourceDraftRef &&
  fixture.source_draft_use === "sanitized_repo_local_design_input" &&
  fixture.source_draft_private_path_recorded === false &&
  exists(sourceDraftRef) &&
  sourceDraft.includes("private_local_path_recorded: false") &&
  sourceDraft.includes("source_draft_use: sanitized_repo_local_design_input") &&
  sourceDraft.includes("Route = transport") &&
  doc.includes("source_draft_use: sanitized_repo_local_design_input") &&
  doc.includes("source_draft_private_path_recorded: false") &&
  !containsWindowsAbsolutePath({ doc, fixture, sourceDraft })
);
check("status_is_adopted_no_execute", () =>
  fixture.status === "adopted_local_plan_no_execute" &&
  doc.includes("This plan does not execute any runtime action.")
);
check("current_state_mentions_v2_trials", () =>
  fixture.current_runtime_to_review_state.v2_trial_002 === "generated_reviewed_memory_candidate_preflighted" &&
  fixture.current_runtime_to_review_state.v2_trial_003 === "not_started"
);
check("target_architecture_records_broker_chain", () =>
  doc.includes("VisualJobContract / ShotPlan / ReviewPolicy") &&
  doc.includes("VCPToolBox Image Execution Broker") &&
  doc.includes("ImageRunCapability Registry") &&
  doc.includes("Restricted Plugin Facade")
);
check("design_rules_capture_channel_roles", () =>
  fixture.design_rules.route_role === "transport_only" &&
  fixture.design_rules.activation_role === "permission_only" &&
  fixture.design_rules.visual_job_contract_role === "visual_intent_and_constraints" &&
  fixture.design_rules.broker_role === "execution_coordinator" &&
  fixture.design_rules.delegate_role === "provider_boundary" &&
  fixture.design_rules.memory_candidate_role === "delayed_reviewed_non_default"
);
check("payload_does_not_dispatch_arbitrary_plugin_api", () =>
  fixture.design_rules.payload_dispatch_rule === "payload_must_not_select_arbitrary_plugin_or_api" &&
  doc.includes("must not become") &&
  doc.includes("provider") &&
  doc.includes("plugin") &&
  doc.includes("api")
);
check("eleven_work_packages_defined", () => fixture.work_packages.length === 11);
check("wp1_is_ail_generation_channel_contract_preflight", () => {
  const wp1 = fixture.work_packages[0];
  return wp1.work_package_id === "ail_generation_channel_contract_preflight_no_execute" &&
    wp1.lane === "Green" &&
    wp1.status === "completed_validated_20260609" &&
    wp1.expected_outputs.includes("docs/generation_channel_contract_preflight.md") &&
    wp1.completion_refs.includes("docs/generation_channel_contract_preflight.md") &&
    wp1.forbidden.includes("image_generation") &&
    wp1.forbidden.includes("external_VCPToolBox_modification");
});
check("wp2_binds_image_run_capability_completed", () => {
  const wp2 = fixture.work_packages[1];
  return wp2.work_package_id === "image_run_capability_binding_preflight_template" &&
    wp2.lane === "Green" &&
    wp2.status === "completed_validated_20260610" &&
    wp2.completion_refs.includes("docs/image_run_capability_binding_preflight_template.md") &&
    wp2.completion_refs.includes("tests/schema_examples/image_run_capability_binding_preflight_template.example.json") &&
    wp2.completion_refs.includes("scripts/validate_image_run_capability_binding_preflight_template.js") &&
    wp2.completion_refs.every((ref) => exists(ref)) &&
    doc.includes("ImageRunCapability binding packet");
});
check("wp3_keeps_compatibility_route_as_completed_thin_ingress", () => {
  const wp3 = fixture.work_packages[2];
  return wp3.work_package_id === "compatibility_route_thin_ingress_plan" &&
    wp3.status === "completed_validated_20260610" &&
    wp3.generic_endpoint_candidate === "/internal/agent-image-lab/executions/run" &&
    wp3.current_endpoint_status === "compatibility_shim_until_broker_ready" &&
    wp3.completion_refs.includes("docs/compatibility_route_thin_ingress_plan_no_execute.md") &&
    wp3.completion_refs.includes("tests/schema_examples/compatibility_route_thin_ingress_plan_no_execute.example.json") &&
    wp3.completion_refs.includes("scripts/validate_compatibility_route_thin_ingress_plan_no_execute.js") &&
    wp3.completion_refs.every((ref) => exists(ref));
});
check("wp4_external_repo_write_proposal_completed_but_write_still_gated", () => {
  const wp4 = fixture.work_packages[3];
  return wp4.work_package_id === "vcptoolbox_image_execution_broker_implementation_proposal" &&
    wp4.lane === "Red_until_external_repo_write_is_exactly_authorized" &&
    wp4.status === "completed_validated_no_execute_proposal_20260610" &&
    wp4.completion_refs.includes("docs/vcptoolbox_image_execution_broker_implementation_proposal_no_execute.md") &&
    wp4.completion_refs.includes("tests/schema_examples/vcptoolbox_image_execution_broker_implementation_proposal_no_execute.example.json") &&
    wp4.completion_refs.includes("scripts/validate_vcptoolbox_image_execution_broker_implementation_proposal_no_execute.js") &&
    wp4.completion_refs.every((ref) => exists(ref)) &&
    doc.includes("exact external repository target");
});
check("wp5_defers_generic_endpoint_until_evidence", () =>
  fixture.work_packages[4].work_package_id === "generic_image_execution_endpoint_gate" &&
  fixture.work_packages[4].status === "completed_validated_no_execute_gate_20260610" &&
  fixture.work_packages[4].generic_endpoint_candidate === "/internal/agent-image-lab/executions/run" &&
  fixture.work_packages[4].generic_endpoint_enabled_now === false &&
  fixture.work_packages[4].migration_allowed_now === false &&
  fixture.work_packages[4].minimum_evidence.includes("at_least_two_v2_trials_with_comparable_artifact_review_evidence") &&
  fixture.work_packages[4].compatibility_rule === "current_task_specific_endpoint_remains_as_shim" &&
  fixture.work_packages[4].completion_refs.includes("docs/generic_image_execution_endpoint_gate_no_execute.md") &&
  fixture.work_packages[4].completion_refs.includes("tests/schema_examples/generic_image_execution_endpoint_gate_no_execute.example.json") &&
  fixture.work_packages[4].completion_refs.includes("scripts/validate_generic_image_execution_endpoint_gate_no_execute.js") &&
  fixture.work_packages[4].completion_refs.every((ref) => exists(ref)) &&
  doc.includes("current_task_specific_endpoint_remains_as_shim")
);
check("wp6_keeps_core_adapter_split_future", () =>
  fixture.work_packages[5].work_package_id === "ail_core_vcp_adapter_split_plan" &&
  fixture.work_packages[5].status === "completed_validated_no_execute_plan_20260610" &&
  fixture.work_packages[5].completion_refs.includes("docs/ail_core_vcp_adapter_split_plan_no_execute.md") &&
  fixture.work_packages[5].completion_refs.includes("tests/schema_examples/ail_core_vcp_adapter_split_plan_no_execute.example.json") &&
  fixture.work_packages[5].completion_refs.includes("scripts/validate_ail_core_vcp_adapter_split_plan_no_execute.js") &&
  fixture.work_packages[5].completion_refs.every((ref) => exists(ref)) &&
  fixture.work_packages[5].ail_core_owns.includes("ProductBrief") &&
  fixture.work_packages[5].ail_core_owns.includes("MemorySuitabilityDecision") &&
  fixture.work_packages[5].vcp_adapter_owns.includes("broker request mapping") &&
  fixture.work_packages[5].vcp_adapter_owns.includes("receipt evidence mapping") &&
    doc.includes("AIL Core / VCP Adapter Split")
);
check("wp7_external_repo_authorization_packet_completed_but_no_access", () =>
  fixture.work_packages[6].work_package_id === "vcptoolbox_image_execution_broker_external_repo_authorization_packet" &&
  fixture.work_packages[6].lane === "Red_until_external_repo_read_or_write_is_exactly_authorized" &&
  fixture.work_packages[6].status === "completed_validated_no_execute_packet_20260610" &&
  fixture.work_packages[6].target_system === "VCPToolBox" &&
  fixture.work_packages[6].target_repo === "JENN2046/VCPToolBox" &&
  fixture.work_packages[6].target_branch_required_before_future_write === "main" &&
  fixture.work_packages[6].external_repo_read_allowed_now === false &&
  fixture.work_packages[6].external_repo_write_allowed_now === false &&
  fixture.work_packages[6].can_execute_now === false &&
  fixture.work_packages[6].completion_refs.includes("docs/vcptoolbox_image_execution_broker_external_repo_authorization_packet_no_execute.md") &&
  fixture.work_packages[6].completion_refs.includes("tests/schema_examples/vcptoolbox_image_execution_broker_external_repo_authorization_packet_no_execute.example.json") &&
  fixture.work_packages[6].completion_refs.includes("scripts/validate_vcptoolbox_image_execution_broker_external_repo_authorization_packet_no_execute.js") &&
  fixture.work_packages[6].completion_refs.every((ref) => exists(ref)) &&
  doc.includes("VCPToolBox External Repo Authorization Packet")
);
check("wp8_external_repo_readiness_review_completed_but_no_access", () =>
  fixture.work_packages[7].work_package_id === "vcptoolbox_image_execution_broker_external_repo_readiness_review" &&
  fixture.work_packages[7].lane === "Green_local_readiness_review_only" &&
  fixture.work_packages[7].status === "completed_validated_no_execute_review_20260610" &&
  fixture.work_packages[7].target_system === "VCPToolBox" &&
  fixture.work_packages[7].target_repo === "JENN2046/VCPToolBox" &&
  fixture.work_packages[7].readiness_result === "pass_ready_for_read_preflight_template" &&
  fixture.work_packages[7].external_repo_read_allowed_now === false &&
  fixture.work_packages[7].external_repo_write_allowed_now === false &&
  fixture.work_packages[7].can_execute_now === false &&
  fixture.work_packages[7].completion_refs.includes("docs/vcptoolbox_image_execution_broker_external_repo_readiness_review_no_execute.md") &&
  fixture.work_packages[7].completion_refs.includes("tests/schema_examples/vcptoolbox_image_execution_broker_external_repo_readiness_review_no_execute.example.json") &&
  fixture.work_packages[7].completion_refs.includes("scripts/validate_vcptoolbox_image_execution_broker_external_repo_readiness_review_no_execute.js") &&
  fixture.work_packages[7].completion_refs.every((ref) => exists(ref)) &&
  doc.includes("VCPToolBox External Repo Readiness Review")
);
check("wp9_external_repo_read_preflight_completed_but_no_access", () =>
  fixture.work_packages[8].work_package_id === "vcptoolbox_image_execution_broker_external_repo_read_preflight" &&
  fixture.work_packages[8].lane === "Green_local_read_preflight_template_only" &&
  fixture.work_packages[8].status === "completed_validated_no_execute_preflight_20260610" &&
  fixture.work_packages[8].target_system === "VCPToolBox" &&
  fixture.work_packages[8].target_repo === "JENN2046/VCPToolBox" &&
  fixture.work_packages[8].preflight_result === "ready_for_separate_exact_read_authorization_packet" &&
  fixture.work_packages[8].allowed_future_git_command_count === 5 &&
  fixture.work_packages[8].allowed_future_file_read_count === 6 &&
  fixture.work_packages[8].external_repo_read_allowed_now === false &&
  fixture.work_packages[8].external_repo_write_allowed_now === false &&
  fixture.work_packages[8].can_execute_now === false &&
  fixture.work_packages[8].completion_refs.includes("docs/vcptoolbox_image_execution_broker_external_repo_read_preflight_no_execute.md") &&
  fixture.work_packages[8].completion_refs.includes("tests/schema_examples/vcptoolbox_image_execution_broker_external_repo_read_preflight_no_execute.example.json") &&
  fixture.work_packages[8].completion_refs.includes("scripts/validate_vcptoolbox_image_execution_broker_external_repo_read_preflight_no_execute.js") &&
  fixture.work_packages[8].completion_refs.every((ref) => exists(ref)) &&
  doc.includes("VCPToolBox External Repo Read Preflight")
);
check("wp10_external_repo_read_authorization_packet_completed_but_no_access", () =>
  fixture.work_packages[9].work_package_id === "vcptoolbox_image_execution_broker_external_repo_read_authorization_packet" &&
  fixture.work_packages[9].lane === "Green_local_read_authorization_packet_only" &&
  fixture.work_packages[9].status === "completed_validated_no_execute_packet_20260610" &&
  fixture.work_packages[9].target_system === "VCPToolBox" &&
  fixture.work_packages[9].target_repo === "JENN2046/VCPToolBox" &&
  fixture.work_packages[9].packet_result === "ready_for_separate_exact_read_execution_with_receipt" &&
  fixture.work_packages[9].allowed_future_git_command_count === 5 &&
  fixture.work_packages[9].allowed_future_file_read_count === 6 &&
  fixture.work_packages[9].external_repo_read_allowed_now === false &&
  fixture.work_packages[9].external_repo_write_allowed_now === false &&
  fixture.work_packages[9].read_receipt_written_now === false &&
  fixture.work_packages[9].can_execute_now === false &&
  fixture.work_packages[9].completion_refs.includes("docs/vcptoolbox_image_execution_broker_external_repo_read_authorization_packet_no_execute.md") &&
  fixture.work_packages[9].completion_refs.includes("tests/schema_examples/vcptoolbox_image_execution_broker_external_repo_read_authorization_packet_no_execute.example.json") &&
  fixture.work_packages[9].completion_refs.includes("scripts/validate_vcptoolbox_image_execution_broker_external_repo_read_authorization_packet_no_execute.js") &&
  fixture.work_packages[9].completion_refs.every((ref) => exists(ref)) &&
    doc.includes("VCPToolBox External Repo Read Authorization Packet")
);
check("wp11_external_repo_exact_read_receipt_template_completed_but_no_access", () =>
  fixture.work_packages[10].work_package_id === "vcptoolbox_image_execution_broker_external_repo_exact_read_receipt_template" &&
  fixture.work_packages[10].lane === "Green_local_exact_read_receipt_template_only" &&
  fixture.work_packages[10].status === "completed_validated_no_execute_template_20260610" &&
  fixture.work_packages[10].target_system === "VCPToolBox" &&
  fixture.work_packages[10].target_repo === "JENN2046/VCPToolBox" &&
  fixture.work_packages[10].receipt_template_result === "ready_for_future_exact_read_receipt_population" &&
  fixture.work_packages[10].receipt_target_directory === "reports/external_repo_reads/" &&
  fixture.work_packages[10].allowed_future_git_command_count === 5 &&
  fixture.work_packages[10].allowed_future_file_read_count === 6 &&
  fixture.work_packages[10].external_repo_read_allowed_now === false &&
  fixture.work_packages[10].external_repo_write_allowed_now === false &&
  fixture.work_packages[10].read_receipt_written_now === false &&
  fixture.work_packages[10].can_execute_now === false &&
  fixture.work_packages[10].completion_refs.includes(receiptTemplateDocRef) &&
  fixture.work_packages[10].completion_refs.includes(receiptTemplateFixtureRef) &&
  fixture.work_packages[10].completion_refs.includes(receiptTemplateValidatorRef) &&
  fixture.work_packages[10].completion_refs.every((ref) => exists(ref)) &&
  doc.includes("VCPToolBox External Repo Exact Read Receipt Template")
);
check("boundary_flags_false", () => allFlagsFalse(fixture.execution_boundary));
check("doc_boundary_flags_present", () =>
  Object.keys(fixture.execution_boundary).every((key) => doc.includes(`${key}: false`))
);
check("stop_rules_cover_red_boundaries", () =>
  doc.includes("write outside this repository") &&
  doc.includes("modify VCPToolBox without an exact external-repo packet") &&
  doc.includes("read secret values") &&
  doc.includes("call a provider, plugin, API, route HTTP endpoint, or image generator") &&
  doc.includes("push, tag, release, deploy")
);
check("recommended_next_is_exact_read_after_receipt_template", () =>
  fixture.completed_previous === "prepare_vcptoolbox_image_execution_broker_external_repo_exact_read_receipt_template_no_execute" &&
  fixture.completion_refs.includes(receiptTemplateDocRef) &&
  fixture.completion_refs.includes(receiptTemplateFixtureRef) &&
  fixture.completion_refs.includes(receiptTemplateValidatorRef) &&
  fixture.completion_refs.every((ref) => exists(ref)) &&
  fixture.recommended_next === nextExactRead &&
  fixture.automatic_real_execution_allowed_by_this_plan === false &&
  fixture.external_repo_read_allowed_by_this_plan === false &&
  fixture.external_repo_write_allowed_by_this_plan === false &&
  fixture.generic_endpoint_enablement_allowed_by_this_plan === false &&
  fixture.adapter_code_write_allowed_by_this_plan === false &&
  doc.includes(nextExactRead)
);

const failed = results.filter((result) => !result.passed);
const output = {
  passed: failed.length === 0,
  validator: "vcptoolbox_image_execution_broker_followup_plan",
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
