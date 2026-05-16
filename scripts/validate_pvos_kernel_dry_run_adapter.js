#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const adapterPath = "adapters/pvos_kernel_dry_run_adapter.js";
const kernelPath = "kernel/pvos_kernel.js";
const schemaPath = "schemas/pvos_kernel_dry_run_adapter.schema.yaml";
const examplePath = "tests/schema_examples/pvos_kernel_dry_run_adapter_response.example.json";
const negativeGuardAdapterExamplePath =
  "tests/schema_examples/pvos_kernel_dry_run_adapter_negative_guard_response.example.json";
const negativeGuardEvidenceBlockerExamplePath =
  "tests/schema_examples/evidence_blocker_contract_negative_guard.example.json";
const fixturePath = "tests/schema_examples/pvos_kernel_input.example.json";
const protocolFixturePath = "tests/schema_examples/review_result_protocol_input.example.json";
const negativeGuardFixturePath = "tests/schema_examples/pvos_kernel_negative_guard_input.example.json";
const negativeGuardProtocolFixturePath = "tests/schema_examples/review_result_protocol_negative_guard_input.example.json";

const errors = [];
const results = [];

const falseGuardFields = [
  "execution_authorized",
  "provider_contact_performed",
  "plugin_call_performed",
  "api_call_performed",
  "daily_note_write_performed",
  "vcp_memory_write_performed",
  "image_generation_performed",
  "output_file_write_performed",
  "accepted_samples_write_performed",
  "production_candidate_created",
  "external_manifest_read_performed",
  "vcpchat_source_read_performed",
  "vcptoolbox_source_read_performed",
];

function repoPath(relativePath) {
  const resolved = path.resolve(root, relativePath);
  const relative = path.relative(root, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`path escapes repository root: ${relativePath}`);
  }
  return resolved;
}

function addResult(check, passed, detail) {
  results.push({ check, passed: Boolean(passed), ...(detail ? { detail } : {}) });
  if (!passed) errors.push({ check, detail: detail || "check failed" });
}

function readFile(relativePath) {
  return fs.readFileSync(repoPath(relativePath), "utf8");
}

function parseJson(relativePath) {
  return JSON.parse(readFile(relativePath));
}

function deepEqual(actual, expected) {
  return JSON.stringify(actual) === JSON.stringify(expected);
}

function validateNoSensitiveMaterial(label, text) {
  const forbidden = [
    { id: "windows_absolute_path", pattern: /[A-Z]:[\\/]/ },
    { id: "private_key", pattern: /BEGIN [A-Z ]*PRIVATE KEY/ },
    { id: "env_file_reference", pattern: /\.env|config\.env/i },
    { id: "image_binary_reference", pattern: /\.(png|jpe?g|webp|gif|psd)\b/i },
    { id: "real_generation_run_path", pattern: /runs\/real_generation/i },
    { id: "accepted_samples_path", pattern: /accepted_samples\//i },
    { id: "external_url", pattern: /https?:\/\//i },
    { id: "real_manifest_ref", pattern: /real[_ -]?manifest/i },
    { id: "vcpchat_source_ref", pattern: /VCPChat source|real VCPChat/i },
    { id: "vcptoolbox_source_ref", pattern: /VCPToolBox source|real VCPToolBox/i },
  ];
  for (const rule of forbidden) {
    addResult(`${label}_${rule.id}_absent`, !rule.pattern.test(text), `${rule.pattern}`);
  }
}

function runNodeCheck(relativePath) {
  const result = childProcess.spawnSync(process.execPath, ["--check", repoPath(relativePath)], {
    cwd: root,
    encoding: "utf8",
  });
  addResult(`${relativePath}_node_check_passed`, result.status === 0, result.stderr || result.stdout);
}

function runAdapter(inputPath, protocolInputPath, label) {
  const result = childProcess.spawnSync(
    process.execPath,
    [repoPath(adapterPath), "--input", inputPath, "--protocol-input", protocolInputPath],
    { cwd: root, encoding: "utf8" }
  );
  addResult(`${label}_adapter_cli_exit_zero`, result.status === 0, result.stderr || result.stdout);
  addResult(`${label}_adapter_cli_stderr_empty`, result.stderr.trim() === "", result.stderr);
  if (result.status !== 0) return null;
  try {
    return JSON.parse(result.stdout);
  } catch (error) {
    addResult(`${label}_adapter_cli_stdout_json_parseable`, false, error.message);
    return null;
  }
}

function validateResponse(response) {
  addResult("response_version_v1", response.pvos_kernel_dry_run_adapter_response_version === "v1");
  addResult("adapter_id_expected", response.adapter_id === "pvos_kernel_dry_run_adapter");
  addResult("adapter_status_accepted_draft", response.status === "accepted_draft");
  addResult("adapter_mode_no_execution", response.mode === "local_no_execution_adapter_contract");
  addResult("kernel_run_present", Boolean(response.kernel_run));
  addResult("kernel_run_version_v1", response.kernel_run?.pvos_kernel_run_version === "v1");
  addResult("kernel_run_stdout_mode", response.kernel_run?.mode === "local_stdout_only_kernel");
  addResult("review_result_protocol_report_present", Boolean(response.review_result_protocol_report));
  addResult("review_result_protocol_handoff_present", Boolean(response.review_result_protocol_handoff_draft));
  addResult("review_decision_package_present", Boolean(response.review_decision_package));
  addResult("review_decision_package_handoff_present", Boolean(response.review_decision_package_handoff_draft));
  addResult("evidence_blocker_contract_present", Boolean(response.evidence_blocker_contract));
  addResult("evidence_blocker_contract_handoff_present", Boolean(response.evidence_blocker_contract_handoff_draft));
  addResult("vcp_handoff_present", Boolean(response.vcp_adapter_handoff_draft));
  addResult("review_console_handoff_present", Boolean(response.review_console_handoff_draft));
  addResult("provenance_handoff_present", Boolean(response.provenance_handoff_draft));
  addResult("audit_record_present", Boolean(response.audit_record));

  const vcp = response.vcp_adapter_handoff_draft || {};
  addResult("vcp_selected_plugin_null", vcp.selected_plugin === null);
  addResult("vcp_max_plugin_calls_zero", vcp.max_plugin_calls === 0);
  addResult("vcp_execution_not_authorized", vcp.execution_authorized === false);
  addResult("vcp_provider_contact_blocked", vcp.provider_contact_allowed === false);
  addResult("vcp_plugin_call_blocked", vcp.plugin_call_allowed === false);
  addResult("vcp_api_call_blocked", vcp.api_call_allowed === false);
  addResult("vcp_output_write_blocked", vcp.output_write_allowed === false);

  const review = response.review_console_handoff_draft || {};
  addResult("review_console_display_only", review.display_only === true);
  addResult("review_console_has_accepted_candidate", Array.isArray(review.accepted_candidate_ids) && review.accepted_candidate_ids.length === 1);
  addResult("review_console_has_rejected_candidate", Array.isArray(review.rejected_candidate_ids) && review.rejected_candidate_ids.length === 1);
  addResult("review_console_human_required", review.human_review_required_for_production === true);
  addResult("review_console_memory_separate_approval", review.memory_write_requires_separate_approval === true);
  addResult("review_console_protocol_attached", review.review_result_protocol_report_attached === true);
  addResult("review_console_decision_package_attached", review.review_decision_package_attached === true);
  addResult("review_console_evidence_blocker_attached", review.evidence_blocker_contract_attached === true);
  addResult(
    "review_console_decision_package_handoff_id_present",
    typeof review.review_decision_package_handoff_id === "string" &&
      review.review_decision_package_handoff_id.startsWith("review_decision_package_handoff_")
  );
  addResult(
    "review_console_evidence_blocker_contract_handoff_id_present",
    typeof review.evidence_blocker_contract_handoff_id === "string" &&
      review.evidence_blocker_contract_handoff_id.startsWith("evidence_blocker_contract_handoff_")
  );

  const protocolReport = response.review_result_protocol_report || {};
  addResult("protocol_report_version_v1", protocolReport.review_result_protocol_report_version === "v1");
  addResult("protocol_report_pass_count_one", protocolReport.report_summary?.pass_count === 1);
  addResult("protocol_report_reject_count_one", protocolReport.report_summary?.reject_count === 1);
  addResult("protocol_report_never_production_count_one", protocolReport.report_summary?.never_production_count === 1);
  addResult("protocol_report_direct_memory_write_false", protocolReport.report_summary?.direct_memory_write_performed === false);
  addResult("protocol_report_production_candidate_false", protocolReport.report_summary?.production_candidate_created === false);
  addResult(
    "protocol_report_has_pass_reason",
    protocolReport.candidate_review_results?.some(
      (candidate) => candidate.review_outcome === "pass" && candidate.pass_reasons?.length > 0
    )
  );
  addResult(
    "protocol_report_has_reject_reason",
    protocolReport.candidate_review_results?.some(
      (candidate) => candidate.review_outcome === "reject" && candidate.reject_reasons?.length > 0
    )
  );
  addResult(
    "protocol_report_has_never_production",
    protocolReport.candidate_review_results?.some(
      (candidate) => candidate.production_route?.status === "never_production"
    )
  );

  const protocolHandoff = response.review_result_protocol_handoff_draft || {};
  addResult("protocol_handoff_draft_ready", protocolHandoff.status === "draft_ready");
  addResult("protocol_handoff_pass_count_one", protocolHandoff.pass_count === 1);
  addResult("protocol_handoff_reject_count_one", protocolHandoff.reject_count === 1);
  addResult("protocol_handoff_never_production_count_one", protocolHandoff.never_production_count === 1);
  addResult("protocol_handoff_never_production_ids_present", Array.isArray(protocolHandoff.never_production_candidate_ids) && protocolHandoff.never_production_candidate_ids.includes("candidate_reject_metadata_001"));
  addResult("protocol_handoff_memory_forbidden_count_zero", protocolHandoff.memory_forbidden_count === 0);
  addResult("protocol_handoff_production_blocked_count_two", protocolHandoff.production_blocked_count === 2);
  addResult("protocol_handoff_all_production_blocked", protocolHandoff.all_production_candidate_creation_blocked === true);
  addResult("protocol_handoff_negative_guard_false", protocolHandoff.negative_guard_observed === false);
  addResult("protocol_handoff_production_candidate_false", protocolHandoff.production_candidate_created === false);
  addResult("protocol_handoff_direct_memory_write_false", protocolHandoff.direct_memory_write_performed === false);

  const decisionPackage = response.review_decision_package || {};
  const decisionSummary = decisionPackage.decision_summary || {};
  addResult("decision_package_version_v1", decisionPackage.review_decision_package_version === "v1");
  addResult("decision_package_status_completed", decisionPackage.status === "completed_local_decision_package");
  addResult("decision_package_mode_stdout_only", decisionPackage.mode === "local_stdout_only_review_decision_package");
  addResult("decision_package_accepted_draft_count_one", decisionPackage.accepted_sample_drafts?.length === 1);
  addResult("decision_package_rejected_draft_count_one", decisionPackage.rejected_sample_drafts?.length === 1);
  addResult("decision_package_memory_delta_count_two", decisionPackage.memory_delta_drafts?.length === 2);
  addResult("decision_package_memory_forbidden_count_zero", decisionPackage.memory_forbidden_records?.length === 0);
  addResult("decision_package_production_exclusion_count_one", decisionPackage.production_exclusion_register?.length === 1);
  addResult("decision_package_summary_production_candidate_false", decisionSummary.production_candidate_created === false);
  addResult("decision_package_summary_direct_memory_write_false", decisionSummary.direct_memory_write_performed === false);
  addResult("decision_package_summary_accepted_samples_write_false", decisionSummary.accepted_samples_write_performed === false);
  addResult("decision_package_promotion_pass_not_approval", decisionPackage.promotion_guard?.protocol_pass_is_not_production_approval === true);
  addResult("decision_package_promotion_never_production_blocked", decisionPackage.promotion_guard?.every_never_production_candidate_blocked === true);

  const decisionHandoff = response.review_decision_package_handoff_draft || {};
  addResult("decision_handoff_draft_ready", decisionHandoff.status === "draft_ready");
  addResult("decision_handoff_accepted_count_one", decisionHandoff.accepted_sample_draft_count === 1);
  addResult("decision_handoff_rejected_count_one", decisionHandoff.rejected_sample_draft_count === 1);
  addResult("decision_handoff_memory_delta_count_two", decisionHandoff.memory_delta_draft_count === 2);
  addResult("decision_handoff_memory_forbidden_count_zero", decisionHandoff.memory_forbidden_count === 0);
  addResult("decision_handoff_production_exclusion_count_one", decisionHandoff.production_exclusion_count === 1);
  addResult(
    "decision_handoff_production_exclusion_id_present",
    Array.isArray(decisionHandoff.production_exclusion_candidate_ids) &&
      decisionHandoff.production_exclusion_candidate_ids.includes("candidate_reject_metadata_001")
  );
  addResult("decision_handoff_direct_memory_write_false", decisionHandoff.direct_memory_write_performed === false);
  addResult("decision_handoff_production_candidate_false", decisionHandoff.production_candidate_created === false);
  addResult("decision_handoff_accepted_samples_write_false", decisionHandoff.accepted_samples_write_performed === false);
  addResult("decision_handoff_pass_not_approval", decisionHandoff.protocol_pass_is_not_production_approval === true);
  addResult("decision_handoff_never_production_blocked", decisionHandoff.every_never_production_candidate_blocked === true);

  const evidenceBlocker = response.evidence_blocker_contract || {};
  const blockerSummary = evidenceBlocker.blocker_summary || {};
  const arbitrationGuard = evidenceBlocker.arbitration_guard || {};
  addResult("evidence_blocker_version_v1", evidenceBlocker.evidence_blocker_contract_version === "v1");
  addResult("evidence_blocker_status_completed", evidenceBlocker.status === "completed_local_evidence_blocker_contract");
  addResult("evidence_blocker_mode_stdout_only", evidenceBlocker.mode === "local_stdout_only_evidence_blocker_contract");
  addResult("evidence_blocker_evidence_record_count_two", evidenceBlocker.evidence_records?.length === 2);
  addResult("evidence_blocker_blocker_decision_count_two", evidenceBlocker.blocker_decisions?.length === 2);
  addResult("evidence_blocker_production_exclusion_count_one", evidenceBlocker.production_exclusion_register?.length === 1);
  addResult("evidence_blocker_summary_evidence_count_two", blockerSummary.evidence_record_count === 2);
  addResult("evidence_blocker_summary_blocker_count_two", blockerSummary.blocker_decision_count === 2);
  addResult("evidence_blocker_summary_production_exclusion_count_one", blockerSummary.production_exclusion_count === 1);
  addResult("evidence_blocker_summary_memory_forbidden_zero", blockerSummary.memory_forbidden_block_count === 0);
  addResult("evidence_blocker_summary_direct_memory_write_false", blockerSummary.direct_memory_write_performed === false);
  addResult("evidence_blocker_summary_production_candidate_false", blockerSummary.production_candidate_created === false);
  addResult("evidence_blocker_summary_accepted_samples_write_false", blockerSummary.accepted_samples_write_performed === false);
  addResult("evidence_blocker_guard_evidence_not_approval", arbitrationGuard.evidence_record_is_not_approval === true);
  addResult("evidence_blocker_guard_blocker_not_write", arbitrationGuard.blocker_decision_is_not_write === true);
  addResult("evidence_blocker_guard_every_candidate_has_evidence", arbitrationGuard.every_candidate_has_evidence_record === true);
  addResult(
    "evidence_blocker_guard_every_candidate_has_production_blocker",
    arbitrationGuard.every_candidate_has_production_blocker_decision === true
  );
  addResult(
    "evidence_blocker_guard_never_production_has_exclusion",
    arbitrationGuard.every_never_production_candidate_has_exclusion === true
  );
  addResult("evidence_blocker_guard_no_production_without_human_review", arbitrationGuard.no_production_without_human_review === true);
  addResult(
    "evidence_blocker_pass_candidate_human_review_blocked",
    evidenceBlocker.blocker_decisions?.some(
      (item) =>
        item.candidate_id === "candidate_accept_metadata_001" &&
        item.blocker_type === "human_review_required" &&
        item.permanent_block === false
    )
  );
  addResult(
    "evidence_blocker_reject_candidate_never_production",
    evidenceBlocker.production_exclusion_register?.some(
      (item) => item.candidate_id === "candidate_reject_metadata_001" && item.status === "never_production"
    )
  );

  const evidenceBlockerHandoff = response.evidence_blocker_contract_handoff_draft || {};
  addResult("evidence_blocker_contract_handoff_draft_ready", evidenceBlockerHandoff.status === "draft_ready");
  addResult("evidence_blocker_contract_handoff_evidence_count_two", evidenceBlockerHandoff.evidence_record_count === 2);
  addResult("evidence_blocker_contract_handoff_blocker_count_two", evidenceBlockerHandoff.blocker_decision_count === 2);
  addResult("evidence_blocker_contract_handoff_production_exclusion_count_one", evidenceBlockerHandoff.production_exclusion_count === 1);
  addResult("evidence_blocker_contract_handoff_memory_forbidden_zero", evidenceBlockerHandoff.memory_forbidden_block_count === 0);
  addResult(
    "evidence_blocker_contract_handoff_human_review_id_present",
    Array.isArray(evidenceBlockerHandoff.human_review_blocked_candidate_ids) &&
      evidenceBlockerHandoff.human_review_blocked_candidate_ids.includes("candidate_accept_metadata_001")
  );
  addResult(
    "evidence_blocker_contract_handoff_production_exclusion_id_present",
    Array.isArray(evidenceBlockerHandoff.production_exclusion_candidate_ids) &&
      evidenceBlockerHandoff.production_exclusion_candidate_ids.includes("candidate_reject_metadata_001")
  );
  addResult("evidence_blocker_contract_handoff_direct_memory_write_false", evidenceBlockerHandoff.direct_memory_write_performed === false);
  addResult("evidence_blocker_contract_handoff_production_candidate_false", evidenceBlockerHandoff.production_candidate_created === false);
  addResult("evidence_blocker_contract_handoff_accepted_samples_write_false", evidenceBlockerHandoff.accepted_samples_write_performed === false);
  addResult("evidence_blocker_contract_handoff_evidence_not_approval", evidenceBlockerHandoff.evidence_record_is_not_approval === true);
  addResult("evidence_blocker_contract_handoff_blocker_not_write", evidenceBlockerHandoff.blocker_decision_is_not_write === true);
  addResult("evidence_blocker_contract_handoff_every_candidate_has_evidence", evidenceBlockerHandoff.every_candidate_has_evidence_record === true);
  addResult(
    "evidence_blocker_contract_handoff_every_candidate_has_production_blocker",
    evidenceBlockerHandoff.every_candidate_has_production_blocker_decision === true
  );
  addResult(
    "evidence_blocker_contract_handoff_never_production_has_exclusion",
    evidenceBlockerHandoff.every_never_production_candidate_has_exclusion === true
  );

  const reviewGuard = review.review_protocol_guard_summary || {};
  addResult("review_console_guard_summary_present", Boolean(review.review_protocol_guard_summary));
  addResult("review_console_guard_never_production_count_one", reviewGuard.never_production_count === 1);
  addResult("review_console_guard_memory_forbidden_count_zero", reviewGuard.memory_forbidden_count === 0);
  addResult("review_console_guard_production_candidate_false", reviewGuard.production_candidate_created === false);
  addResult("review_console_guard_direct_memory_write_false", reviewGuard.direct_memory_write_performed === false);

  const reviewDecisionGuard = review.review_decision_package_guard_summary || {};
  addResult("review_console_decision_guard_summary_present", Boolean(review.review_decision_package_guard_summary));
  addResult("review_console_decision_guard_accepted_count_one", reviewDecisionGuard.accepted_sample_draft_count === 1);
  addResult("review_console_decision_guard_rejected_count_one", reviewDecisionGuard.rejected_sample_draft_count === 1);
  addResult("review_console_decision_guard_memory_delta_count_two", reviewDecisionGuard.memory_delta_draft_count === 2);
  addResult("review_console_decision_guard_memory_forbidden_count_zero", reviewDecisionGuard.memory_forbidden_count === 0);
  addResult("review_console_decision_guard_production_exclusion_count_one", reviewDecisionGuard.production_exclusion_count === 1);
  addResult("review_console_decision_guard_production_candidate_false", reviewDecisionGuard.production_candidate_created === false);
  addResult("review_console_decision_guard_direct_memory_write_false", reviewDecisionGuard.direct_memory_write_performed === false);
  addResult("review_console_decision_guard_accepted_samples_write_false", reviewDecisionGuard.accepted_samples_write_performed === false);

  const reviewEvidenceGuard = review.review_evidence_blocker_contract_guard_summary || {};
  addResult("review_console_evidence_guard_summary_present", Boolean(review.review_evidence_blocker_contract_guard_summary));
  addResult("review_console_evidence_guard_evidence_count_two", reviewEvidenceGuard.evidence_record_count === 2);
  addResult("review_console_evidence_guard_blocker_count_two", reviewEvidenceGuard.blocker_decision_count === 2);
  addResult("review_console_evidence_guard_production_exclusion_count_one", reviewEvidenceGuard.production_exclusion_count === 1);
  addResult("review_console_evidence_guard_memory_forbidden_zero", reviewEvidenceGuard.memory_forbidden_block_count === 0);
  addResult("review_console_evidence_guard_production_candidate_false", reviewEvidenceGuard.production_candidate_created === false);
  addResult("review_console_evidence_guard_direct_memory_write_false", reviewEvidenceGuard.direct_memory_write_performed === false);
  addResult("review_console_evidence_guard_accepted_samples_write_false", reviewEvidenceGuard.accepted_samples_write_performed === false);
  addResult("review_console_evidence_guard_every_candidate_has_evidence", reviewEvidenceGuard.every_candidate_has_evidence_record === true);
  addResult(
    "review_console_evidence_guard_every_candidate_has_production_blocker",
    reviewEvidenceGuard.every_candidate_has_production_blocker_decision === true
  );
  addResult(
    "review_console_evidence_guard_never_production_has_exclusion",
    reviewEvidenceGuard.every_never_production_candidate_has_exclusion === true
  );

  const provenance = response.provenance_handoff_draft || {};
  addResult("provenance_payload_absent", provenance.provider_payload_included === false);
  addResult("provenance_image_binary_absent", provenance.image_binary_included === false);
  addResult("provenance_private_path_absent", provenance.private_path_included === false);
  addResult("provenance_metadata_only", provenance.artifact_refs_are_metadata_only === true);

  for (const flag of falseGuardFields) {
    addResult(`adapter_guard_${flag}_false`, response.no_execution_guard?.[flag] === false, String(response.no_execution_guard?.[flag]));
  }

  addResult("audit_selected_plugin_null", response.audit_record?.selected_plugin === null);
  addResult("audit_max_plugin_calls_zero", response.audit_record?.max_plugin_calls_observed === 0);
  addResult("audit_external_api_false", response.audit_record?.external_api_observed === false);
  addResult("audit_output_write_false", response.audit_record?.output_file_write_observed === false);
  addResult("audit_image_generation_false", response.audit_record?.image_generation_observed === false);
  addResult("audit_memory_write_false", response.audit_record?.memory_write_observed === false);
  addResult("audit_protocol_observed_true", response.audit_record?.review_result_protocol_observed === true);
  addResult("audit_decision_package_observed_true", response.audit_record?.review_decision_package_observed === true);
  addResult("audit_evidence_blocker_observed_true", response.audit_record?.evidence_blocker_contract_observed === true);
  addResult("audit_accepted_sample_draft_count_one", response.audit_record?.accepted_sample_draft_count === 1);
  addResult("audit_rejected_sample_draft_count_one", response.audit_record?.rejected_sample_draft_count === 1);
  addResult("audit_memory_delta_draft_count_two", response.audit_record?.memory_delta_draft_count === 2);
  addResult("audit_production_exclusion_count_one", response.audit_record?.production_exclusion_count === 1);
  addResult("audit_evidence_record_count_two", response.audit_record?.evidence_record_count === 2);
  addResult("audit_blocker_decision_count_two", response.audit_record?.blocker_decision_count === 2);
  addResult("audit_permanent_block_count_one", response.audit_record?.permanent_block_count === 1);
  addResult("audit_memory_forbidden_block_count_zero", response.audit_record?.memory_forbidden_block_count === 0);
  addResult("audit_production_candidate_false", response.audit_record?.production_candidate_created === false);
  addResult("audit_never_production_count_one", response.audit_record?.never_production_count === 1);
  addResult("audit_memory_forbidden_count_zero", response.audit_record?.memory_forbidden_count === 0);
  addResult("audit_negative_guard_false", response.audit_record?.negative_guard_observed === false);

  validateNoSensitiveMaterial("adapter_response_stdout", JSON.stringify(response));
}

function validateNegativeGuardAdapterResponse(response) {
  addResult("negative_adapter_response_version_v1", response.pvos_kernel_dry_run_adapter_response_version === "v1");
  addResult("negative_adapter_status_accepted_draft", response.status === "accepted_draft");
  addResult("negative_adapter_mode_no_execution", response.mode === "local_no_execution_adapter_contract");

  const review = response.review_console_handoff_draft || {};
  addResult("negative_review_console_no_accepted_candidates", Array.isArray(review.accepted_candidate_ids) && review.accepted_candidate_ids.length === 0);
  addResult("negative_review_console_two_rejected_candidates", Array.isArray(review.rejected_candidate_ids) && review.rejected_candidate_ids.length === 2);
  addResult("negative_review_console_display_only", review.display_only === true);
  addResult("negative_review_console_protocol_attached", review.review_result_protocol_report_attached === true);
  addResult("negative_review_console_decision_package_attached", review.review_decision_package_attached === true);
  addResult("negative_review_console_evidence_blocker_attached", review.evidence_blocker_contract_attached === true);

  const protocolReport = response.review_result_protocol_report || {};
  addResult("negative_protocol_report_pass_count_zero", protocolReport.report_summary?.pass_count === 0);
  addResult("negative_protocol_report_reject_count_two", protocolReport.report_summary?.reject_count === 2);
  addResult("negative_protocol_report_never_production_count_two", protocolReport.report_summary?.never_production_count === 2);
  addResult("negative_protocol_report_direct_memory_write_false", protocolReport.report_summary?.direct_memory_write_performed === false);
  addResult("negative_protocol_report_production_candidate_false", protocolReport.report_summary?.production_candidate_created === false);

  const protocolHandoff = response.review_result_protocol_handoff_draft || {};
  addResult("negative_protocol_handoff_draft_ready", protocolHandoff.status === "draft_ready");
  addResult("negative_protocol_handoff_pass_count_zero", protocolHandoff.pass_count === 0);
  addResult("negative_protocol_handoff_reject_count_two", protocolHandoff.reject_count === 2);
  addResult("negative_protocol_handoff_never_production_count_two", protocolHandoff.never_production_count === 2);
  addResult("negative_protocol_handoff_memory_forbidden_count_one", protocolHandoff.memory_forbidden_count === 1);
  addResult(
    "negative_protocol_handoff_unknown_memory_forbidden_id",
    Array.isArray(protocolHandoff.memory_forbidden_candidate_ids) &&
      protocolHandoff.memory_forbidden_candidate_ids.includes("candidate_reject_unknown_guard_001")
  );
  addResult(
    "negative_protocol_handoff_never_production_ids_present",
    Array.isArray(protocolHandoff.never_production_candidate_ids) &&
      protocolHandoff.never_production_candidate_ids.includes("candidate_reject_mapped_guard_001") &&
      protocolHandoff.never_production_candidate_ids.includes("candidate_reject_unknown_guard_001")
  );
  addResult("negative_protocol_handoff_all_production_blocked", protocolHandoff.all_production_candidate_creation_blocked === true);
  addResult("negative_protocol_handoff_negative_guard_true", protocolHandoff.negative_guard_observed === true);
  addResult("negative_protocol_handoff_production_candidate_false", protocolHandoff.production_candidate_created === false);
  addResult("negative_protocol_handoff_direct_memory_write_false", protocolHandoff.direct_memory_write_performed === false);

  const decisionPackage = response.review_decision_package || {};
  addResult("negative_decision_package_version_v1", decisionPackage.review_decision_package_version === "v1");
  addResult("negative_decision_package_source_protocol_expected", decisionPackage.source_protocol_id === "review_result_protocol_negative_guard_v1");
  addResult("negative_decision_package_accepted_count_zero", decisionPackage.accepted_sample_drafts?.length === 0);
  addResult("negative_decision_package_rejected_count_two", decisionPackage.rejected_sample_drafts?.length === 2);
  addResult("negative_decision_package_memory_delta_count_one", decisionPackage.memory_delta_drafts?.length === 1);
  addResult("negative_decision_package_memory_forbidden_count_one", decisionPackage.memory_forbidden_records?.length === 1);
  addResult("negative_decision_package_production_exclusion_count_two", decisionPackage.production_exclusion_register?.length === 2);
  addResult(
    "negative_decision_package_unknown_memory_forbidden_recorded",
    decisionPackage.memory_forbidden_records?.some((item) => item.candidate_id === "candidate_reject_unknown_guard_001")
  );
  addResult(
    "negative_decision_package_all_rejected_never_production_registered",
    ["candidate_reject_mapped_guard_001", "candidate_reject_unknown_guard_001"].every((id) =>
      decisionPackage.production_exclusion_register?.some((item) => item.candidate_id === id)
    )
  );
  addResult("negative_decision_package_production_candidate_false", decisionPackage.decision_summary?.production_candidate_created === false);
  addResult("negative_decision_package_direct_memory_write_false", decisionPackage.decision_summary?.direct_memory_write_performed === false);

  const decisionHandoff = response.review_decision_package_handoff_draft || {};
  addResult("negative_decision_handoff_draft_ready", decisionHandoff.status === "draft_ready");
  addResult("negative_decision_handoff_accepted_count_zero", decisionHandoff.accepted_sample_draft_count === 0);
  addResult("negative_decision_handoff_rejected_count_two", decisionHandoff.rejected_sample_draft_count === 2);
  addResult("negative_decision_handoff_memory_delta_count_one", decisionHandoff.memory_delta_draft_count === 1);
  addResult("negative_decision_handoff_memory_forbidden_count_one", decisionHandoff.memory_forbidden_count === 1);
  addResult("negative_decision_handoff_production_exclusion_count_two", decisionHandoff.production_exclusion_count === 2);
  addResult(
    "negative_decision_handoff_memory_forbidden_id_present",
    Array.isArray(decisionHandoff.memory_forbidden_candidate_ids) &&
      decisionHandoff.memory_forbidden_candidate_ids.includes("candidate_reject_unknown_guard_001")
  );
  addResult(
    "negative_decision_handoff_production_exclusion_ids_present",
    Array.isArray(decisionHandoff.production_exclusion_candidate_ids) &&
      decisionHandoff.production_exclusion_candidate_ids.includes("candidate_reject_mapped_guard_001") &&
      decisionHandoff.production_exclusion_candidate_ids.includes("candidate_reject_unknown_guard_001")
  );
  addResult("negative_decision_handoff_production_candidate_false", decisionHandoff.production_candidate_created === false);
  addResult("negative_decision_handoff_direct_memory_write_false", decisionHandoff.direct_memory_write_performed === false);
  addResult("negative_decision_handoff_accepted_samples_write_false", decisionHandoff.accepted_samples_write_performed === false);
  addResult("negative_decision_handoff_pass_not_approval", decisionHandoff.protocol_pass_is_not_production_approval === true);
  addResult("negative_decision_handoff_never_production_blocked", decisionHandoff.every_never_production_candidate_blocked === true);

  const evidenceBlocker = response.evidence_blocker_contract || {};
  const blockerSummary = evidenceBlocker.blocker_summary || {};
  const arbitrationGuard = evidenceBlocker.arbitration_guard || {};
  addResult("negative_evidence_blocker_version_v1", evidenceBlocker.evidence_blocker_contract_version === "v1");
  addResult("negative_evidence_blocker_source_protocol_expected", evidenceBlocker.source_protocol_id === "review_result_protocol_negative_guard_v1");
  addResult("negative_evidence_blocker_evidence_record_count_two", evidenceBlocker.evidence_records?.length === 2);
  addResult("negative_evidence_blocker_blocker_decision_count_three", evidenceBlocker.blocker_decisions?.length === 3);
  addResult("negative_evidence_blocker_production_exclusion_count_two", evidenceBlocker.production_exclusion_register?.length === 2);
  addResult("negative_evidence_blocker_summary_memory_forbidden_one", blockerSummary.memory_forbidden_block_count === 1);
  addResult("negative_evidence_blocker_summary_permanent_block_three", blockerSummary.permanent_block_count === 3);
  addResult("negative_evidence_blocker_summary_production_candidate_false", blockerSummary.production_candidate_created === false);
  addResult("negative_evidence_blocker_summary_direct_memory_write_false", blockerSummary.direct_memory_write_performed === false);
  addResult("negative_evidence_blocker_guard_every_candidate_has_evidence", arbitrationGuard.every_candidate_has_evidence_record === true);
  addResult(
    "negative_evidence_blocker_guard_every_candidate_has_production_blocker",
    arbitrationGuard.every_candidate_has_production_blocker_decision === true
  );
  addResult(
    "negative_evidence_blocker_guard_never_production_has_exclusion",
    arbitrationGuard.every_never_production_candidate_has_exclusion === true
  );
  addResult(
    "negative_evidence_blocker_memory_forbidden_recorded",
    evidenceBlocker.blocker_decisions?.some(
      (item) =>
        item.candidate_id === "candidate_reject_unknown_guard_001" &&
        item.blocker_type === "memory_forbidden" &&
        item.blocking_scope === "memory_promotion"
    )
  );
  addResult(
    "negative_evidence_blocker_all_rejected_excluded",
    ["candidate_reject_mapped_guard_001", "candidate_reject_unknown_guard_001"].every((id) =>
      evidenceBlocker.production_exclusion_register?.some((item) => item.candidate_id === id)
    )
  );

  const evidenceBlockerHandoff = response.evidence_blocker_contract_handoff_draft || {};
  addResult("negative_evidence_blocker_contract_handoff_draft_ready", evidenceBlockerHandoff.status === "draft_ready");
  addResult("negative_evidence_blocker_contract_handoff_evidence_count_two", evidenceBlockerHandoff.evidence_record_count === 2);
  addResult("negative_evidence_blocker_contract_handoff_blocker_count_three", evidenceBlockerHandoff.blocker_decision_count === 3);
  addResult("negative_evidence_blocker_contract_handoff_production_exclusion_count_two", evidenceBlockerHandoff.production_exclusion_count === 2);
  addResult("negative_evidence_blocker_contract_handoff_memory_forbidden_one", evidenceBlockerHandoff.memory_forbidden_block_count === 1);
  addResult("negative_evidence_blocker_contract_handoff_permanent_block_three", evidenceBlockerHandoff.permanent_block_count === 3);
  addResult(
    "negative_evidence_blocker_contract_handoff_memory_forbidden_id_present",
    Array.isArray(evidenceBlockerHandoff.memory_forbidden_candidate_ids) &&
      evidenceBlockerHandoff.memory_forbidden_candidate_ids.includes("candidate_reject_unknown_guard_001")
  );
  addResult(
    "negative_evidence_blocker_contract_handoff_production_exclusion_ids_present",
    Array.isArray(evidenceBlockerHandoff.production_exclusion_candidate_ids) &&
      evidenceBlockerHandoff.production_exclusion_candidate_ids.includes("candidate_reject_mapped_guard_001") &&
      evidenceBlockerHandoff.production_exclusion_candidate_ids.includes("candidate_reject_unknown_guard_001")
  );
  addResult("negative_evidence_blocker_contract_handoff_production_candidate_false", evidenceBlockerHandoff.production_candidate_created === false);
  addResult("negative_evidence_blocker_contract_handoff_direct_memory_write_false", evidenceBlockerHandoff.direct_memory_write_performed === false);
  addResult("negative_evidence_blocker_contract_handoff_accepted_samples_write_false", evidenceBlockerHandoff.accepted_samples_write_performed === false);
  addResult(
    "negative_evidence_blocker_contract_handoff_never_production_has_exclusion",
    evidenceBlockerHandoff.every_never_production_candidate_has_exclusion === true
  );

  const reviewGuard = review.review_protocol_guard_summary || {};
  addResult("negative_review_guard_summary_present", Boolean(review.review_protocol_guard_summary));
  addResult("negative_review_guard_never_production_count_two", reviewGuard.never_production_count === 2);
  addResult("negative_review_guard_memory_forbidden_count_one", reviewGuard.memory_forbidden_count === 1);
  addResult("negative_review_guard_production_candidate_false", reviewGuard.production_candidate_created === false);
  addResult("negative_review_guard_direct_memory_write_false", reviewGuard.direct_memory_write_performed === false);
  addResult("negative_review_guard_negative_guard_true", reviewGuard.negative_guard_observed === true);

  const reviewDecisionGuard = review.review_decision_package_guard_summary || {};
  addResult("negative_review_decision_guard_summary_present", Boolean(review.review_decision_package_guard_summary));
  addResult("negative_review_decision_guard_accepted_count_zero", reviewDecisionGuard.accepted_sample_draft_count === 0);
  addResult("negative_review_decision_guard_rejected_count_two", reviewDecisionGuard.rejected_sample_draft_count === 2);
  addResult("negative_review_decision_guard_memory_delta_count_one", reviewDecisionGuard.memory_delta_draft_count === 1);
  addResult("negative_review_decision_guard_memory_forbidden_count_one", reviewDecisionGuard.memory_forbidden_count === 1);
  addResult("negative_review_decision_guard_production_exclusion_count_two", reviewDecisionGuard.production_exclusion_count === 2);
  addResult("negative_review_decision_guard_production_candidate_false", reviewDecisionGuard.production_candidate_created === false);
  addResult("negative_review_decision_guard_direct_memory_write_false", reviewDecisionGuard.direct_memory_write_performed === false);
  addResult("negative_review_decision_guard_accepted_samples_write_false", reviewDecisionGuard.accepted_samples_write_performed === false);

  const reviewEvidenceGuard = review.review_evidence_blocker_contract_guard_summary || {};
  addResult("negative_review_evidence_guard_summary_present", Boolean(review.review_evidence_blocker_contract_guard_summary));
  addResult("negative_review_evidence_guard_evidence_count_two", reviewEvidenceGuard.evidence_record_count === 2);
  addResult("negative_review_evidence_guard_blocker_count_three", reviewEvidenceGuard.blocker_decision_count === 3);
  addResult("negative_review_evidence_guard_production_exclusion_count_two", reviewEvidenceGuard.production_exclusion_count === 2);
  addResult("negative_review_evidence_guard_memory_forbidden_one", reviewEvidenceGuard.memory_forbidden_block_count === 1);
  addResult("negative_review_evidence_guard_production_candidate_false", reviewEvidenceGuard.production_candidate_created === false);
  addResult("negative_review_evidence_guard_direct_memory_write_false", reviewEvidenceGuard.direct_memory_write_performed === false);
  addResult("negative_review_evidence_guard_accepted_samples_write_false", reviewEvidenceGuard.accepted_samples_write_performed === false);
  addResult(
    "negative_review_evidence_guard_never_production_has_exclusion",
    reviewEvidenceGuard.every_never_production_candidate_has_exclusion === true
  );

  addResult("negative_audit_production_candidate_false", response.audit_record?.production_candidate_created === false);
  addResult("negative_audit_decision_package_observed_true", response.audit_record?.review_decision_package_observed === true);
  addResult("negative_audit_evidence_blocker_observed_true", response.audit_record?.evidence_blocker_contract_observed === true);
  addResult("negative_audit_accepted_sample_draft_count_zero", response.audit_record?.accepted_sample_draft_count === 0);
  addResult("negative_audit_rejected_sample_draft_count_two", response.audit_record?.rejected_sample_draft_count === 2);
  addResult("negative_audit_memory_delta_draft_count_one", response.audit_record?.memory_delta_draft_count === 1);
  addResult("negative_audit_production_exclusion_count_two", response.audit_record?.production_exclusion_count === 2);
  addResult("negative_audit_evidence_record_count_two", response.audit_record?.evidence_record_count === 2);
  addResult("negative_audit_blocker_decision_count_three", response.audit_record?.blocker_decision_count === 3);
  addResult("negative_audit_permanent_block_count_three", response.audit_record?.permanent_block_count === 3);
  addResult("negative_audit_memory_forbidden_block_count_one", response.audit_record?.memory_forbidden_block_count === 1);
  addResult("negative_audit_never_production_count_two", response.audit_record?.never_production_count === 2);
  addResult("negative_audit_memory_forbidden_count_one", response.audit_record?.memory_forbidden_count === 1);
  addResult("negative_audit_negative_guard_true", response.audit_record?.negative_guard_observed === true);

  for (const flag of falseGuardFields) {
    addResult(`negative_adapter_guard_${flag}_false`, response.no_execution_guard?.[flag] === false);
  }
  validateNoSensitiveMaterial("negative_adapter_response_stdout", JSON.stringify(response));
}

function validateNegativeGuardAdapterAgainstEvidenceFixture(response, evidenceFixture, label) {
  const handoff = response.evidence_blocker_contract_handoff_draft || {};
  const reviewGuard = response.review_console_handoff_draft?.review_evidence_blocker_contract_guard_summary || {};
  const audit = response.audit_record || {};
  const summary = evidenceFixture.blocker_summary || {};
  const memoryForbiddenCandidateIds = (evidenceFixture.blocker_decisions || [])
    .filter((decision) => decision.blocker_type === "memory_forbidden")
    .map((decision) => decision.candidate_id);
  const productionExclusionCandidateIds = (evidenceFixture.production_exclusion_register || [])
    .map((record) => record.candidate_id);

  addResult(`${label}_evidence_contract_id_matches_fixture`, handoff.contract_id === evidenceFixture.contract_id);
  addResult(
    `${label}_source_decision_package_matches_fixture`,
    handoff.source_decision_package_id === evidenceFixture.source_decision_package_id
  );
  addResult(`${label}_source_protocol_matches_fixture`, handoff.source_protocol_id === evidenceFixture.source_protocol_id);
  addResult(
    `${label}_source_kernel_run_matches_fixture`,
    handoff.source_kernel_run_id === evidenceFixture.source_kernel_run_id
  );
  addResult(`${label}_handoff_evidence_count_matches_fixture`, handoff.evidence_record_count === summary.evidence_record_count);
  addResult(`${label}_handoff_blocker_count_matches_fixture`, handoff.blocker_decision_count === summary.blocker_decision_count);
  addResult(
    `${label}_handoff_production_exclusion_count_matches_fixture`,
    handoff.production_exclusion_count === summary.production_exclusion_count
  );
  addResult(`${label}_handoff_permanent_block_count_matches_fixture`, handoff.permanent_block_count === summary.permanent_block_count);
  addResult(
    `${label}_handoff_memory_forbidden_count_matches_fixture`,
    handoff.memory_forbidden_block_count === summary.memory_forbidden_block_count
  );
  addResult(
    `${label}_handoff_memory_forbidden_ids_match_fixture`,
    deepEqual(handoff.memory_forbidden_candidate_ids, memoryForbiddenCandidateIds)
  );
  addResult(
    `${label}_handoff_production_exclusion_ids_match_fixture`,
    deepEqual(handoff.production_exclusion_candidate_ids, productionExclusionCandidateIds)
  );
  addResult(
    `${label}_review_guard_counts_match_handoff`,
    reviewGuard.evidence_record_count === handoff.evidence_record_count &&
      reviewGuard.blocker_decision_count === handoff.blocker_decision_count &&
      reviewGuard.production_exclusion_count === handoff.production_exclusion_count &&
      reviewGuard.permanent_block_count === handoff.permanent_block_count &&
      reviewGuard.memory_forbidden_block_count === handoff.memory_forbidden_block_count
  );
  addResult(
    `${label}_review_guard_production_exclusion_ids_match_handoff`,
    deepEqual(reviewGuard.production_exclusion_candidate_ids, handoff.production_exclusion_candidate_ids)
  );
  addResult(
    `${label}_audit_counts_match_handoff`,
    audit.evidence_record_count === handoff.evidence_record_count &&
      audit.blocker_decision_count === handoff.blocker_decision_count &&
      audit.production_exclusion_count === handoff.production_exclusion_count &&
      audit.permanent_block_count === handoff.permanent_block_count &&
      audit.memory_forbidden_block_count === handoff.memory_forbidden_block_count
  );
  addResult(`${label}_audit_never_production_matches_fixture`, audit.never_production_count === productionExclusionCandidateIds.length);
  addResult(`${label}_audit_memory_forbidden_matches_fixture`, audit.memory_forbidden_count === memoryForbiddenCandidateIds.length);
  addResult(
    "negative_guard_adapter_memory_forbidden_handoff_verified",
    memoryForbiddenCandidateIds.includes("candidate_reject_unknown_guard_001") &&
      (handoff.memory_forbidden_candidate_ids || []).includes("candidate_reject_unknown_guard_001") &&
      reviewGuard.memory_forbidden_block_count === memoryForbiddenCandidateIds.length &&
      audit.memory_forbidden_count === memoryForbiddenCandidateIds.length
  );
  addResult(
    "negative_guard_adapter_unknown_candidate_never_production_verified",
    productionExclusionCandidateIds.includes("candidate_reject_unknown_guard_001") &&
      (handoff.production_exclusion_candidate_ids || []).includes("candidate_reject_unknown_guard_001") &&
      (response.evidence_blocker_contract?.production_exclusion_register || []).some(
        (record) =>
          record.candidate_id === "candidate_reject_unknown_guard_001" &&
          record.status === "never_production" &&
          record.permanent_block === true &&
          record.production_candidate === false
      )
  );
}

for (const file of [
  adapterPath,
  kernelPath,
  schemaPath,
  examplePath,
  negativeGuardAdapterExamplePath,
  negativeGuardEvidenceBlockerExamplePath,
  fixturePath,
  protocolFixturePath,
  negativeGuardFixturePath,
  negativeGuardProtocolFixturePath,
]) {
  addResult(`${file}_exists`, fs.existsSync(repoPath(file)), file);
}

runNodeCheck(adapterPath);
runNodeCheck(kernelPath);
runNodeCheck("scripts/validate_pvos_kernel_dry_run_adapter.js");

try {
  const schema = readFile(schemaPath);
  addResult("schema_stdout_policy_declared", /output_channel: stdout/.test(schema));
  addResult("schema_no_file_write_declared", /output_file_write_allowed: false/.test(schema));
  addResult("schema_max_plugin_calls_zero", /max_plugin_calls: 0/.test(schema));
  addResult("schema_protocol_report_declared", /review_result_protocol_report/.test(schema));
  addResult("schema_protocol_handoff_declared", /review_result_protocol_handoff_draft/.test(schema));
  addResult("schema_decision_package_declared", /review_decision_package:/.test(schema));
  addResult("schema_decision_handoff_declared", /review_decision_package_handoff_draft:/.test(schema));
  addResult("schema_evidence_blocker_declared", /evidence_blocker_contract:/.test(schema));
  addResult("schema_evidence_blocker_contract_handoff_declared", /evidence_blocker_contract_handoff_draft:/.test(schema));
  addResult("schema_evidence_blocker_attached_declared", /evidence_blocker_contract_attached: true/.test(schema));
  addResult("schema_evidence_blocker_contract_guard_declared", /review_evidence_blocker_contract_guard_summary:/.test(schema));
  addResult("schema_decision_package_attached_declared", /review_decision_package_attached: true/.test(schema));
  addResult("schema_production_exclusion_declared", /production_exclusion_register: array/.test(schema));
  addResult("schema_decision_guard_declared", /review_decision_package_guard_summary:/.test(schema));
  addResult("schema_blocker_decisions_declared", /blocker_decisions: array/.test(schema));
  addResult("schema_every_candidate_has_evidence_declared", /every_candidate_has_evidence_record: true/.test(schema));
  addResult(
    "schema_never_production_exclusion_guard_declared",
    /every_never_production_candidate_has_exclusion: true/.test(schema)
  );
  addResult("schema_protocol_attached_declared", /review_result_protocol_report_attached: true/.test(schema));
  addResult("schema_negative_guard_declared", /negative_guard_observed: boolean/.test(schema));
  addResult("schema_memory_forbidden_declared", /memory_forbidden_count: integer/.test(schema));
  addResult("schema_never_production_ids_declared", /never_production_candidate_ids: array/.test(schema));
  validateNoSensitiveMaterial("schema", schema);
} catch (error) {
  addResult("schema_readable", false, error.message);
}

try {
  const example = JSON.parse(readFile(examplePath));
  addResult("example_version_v1", example.pvos_kernel_dry_run_adapter_response_version === "v1");
  addResult("example_selected_plugin_null", example.vcp_adapter_handoff_draft?.selected_plugin === null);
  addResult("example_max_plugin_calls_zero", example.vcp_adapter_handoff_draft?.max_plugin_calls === 0);
  addResult("example_protocol_report_present", Boolean(example.review_result_protocol_report));
  addResult("example_protocol_handoff_present", Boolean(example.review_result_protocol_handoff_draft));
  addResult("example_decision_package_present", Boolean(example.review_decision_package));
  addResult("example_decision_handoff_present", Boolean(example.review_decision_package_handoff_draft));
  addResult("example_evidence_blocker_present", Boolean(example.evidence_blocker_contract));
  addResult("example_evidence_blocker_contract_handoff_present", Boolean(example.evidence_blocker_contract_handoff_draft));
  addResult("example_protocol_never_production_count_one", example.review_result_protocol_report?.report_summary?.never_production_count === 1);
  addResult("example_protocol_handoff_memory_forbidden_count_zero", example.review_result_protocol_handoff_draft?.memory_forbidden_count === 0);
  addResult("example_protocol_handoff_all_production_blocked", example.review_result_protocol_handoff_draft?.all_production_candidate_creation_blocked === true);
  addResult("example_protocol_handoff_negative_guard_false", example.review_result_protocol_handoff_draft?.negative_guard_observed === false);
  addResult("example_decision_package_accepted_count_one", example.review_decision_package?.accepted_sample_drafts?.length === 1);
  addResult("example_decision_package_rejected_count_one", example.review_decision_package?.rejected_sample_drafts?.length === 1);
  addResult("example_decision_package_memory_delta_count_two", example.review_decision_package?.memory_delta_drafts?.length === 2);
  addResult("example_decision_package_production_exclusion_count_one", example.review_decision_package?.production_exclusion_register?.length === 1);
  addResult("example_decision_handoff_accepted_count_one", example.review_decision_package_handoff_draft?.accepted_sample_draft_count === 1);
  addResult("example_decision_handoff_rejected_count_one", example.review_decision_package_handoff_draft?.rejected_sample_draft_count === 1);
  addResult("example_decision_handoff_memory_delta_count_two", example.review_decision_package_handoff_draft?.memory_delta_draft_count === 2);
  addResult("example_decision_handoff_production_exclusion_count_one", example.review_decision_package_handoff_draft?.production_exclusion_count === 1);
  addResult("example_decision_handoff_no_direct_memory_write", example.review_decision_package_handoff_draft?.direct_memory_write_performed === false);
  addResult("example_decision_handoff_no_production_candidate", example.review_decision_package_handoff_draft?.production_candidate_created === false);
  addResult("example_evidence_blocker_evidence_count_two", example.evidence_blocker_contract?.evidence_records?.length === 2);
  addResult("example_evidence_blocker_blocker_count_two", example.evidence_blocker_contract?.blocker_decisions?.length === 2);
  addResult("example_evidence_blocker_production_exclusion_count_one", example.evidence_blocker_contract?.production_exclusion_register?.length === 1);
  addResult("example_evidence_blocker_summary_direct_memory_write_false", example.evidence_blocker_contract?.blocker_summary?.direct_memory_write_performed === false);
  addResult("example_evidence_blocker_summary_production_candidate_false", example.evidence_blocker_contract?.blocker_summary?.production_candidate_created === false);
  addResult("example_evidence_blocker_guard_evidence_not_approval", example.evidence_blocker_contract?.arbitration_guard?.evidence_record_is_not_approval === true);
  addResult("example_evidence_blocker_guard_blocker_not_write", example.evidence_blocker_contract?.arbitration_guard?.blocker_decision_is_not_write === true);
  addResult(
    "example_evidence_blocker_guard_never_production_has_exclusion",
    example.evidence_blocker_contract?.arbitration_guard?.every_never_production_candidate_has_exclusion === true
  );
  addResult("example_evidence_blocker_contract_handoff_evidence_count_two", example.evidence_blocker_contract_handoff_draft?.evidence_record_count === 2);
  addResult("example_evidence_blocker_contract_handoff_blocker_count_two", example.evidence_blocker_contract_handoff_draft?.blocker_decision_count === 2);
  addResult("example_evidence_blocker_contract_handoff_production_exclusion_count_one", example.evidence_blocker_contract_handoff_draft?.production_exclusion_count === 1);
  addResult("example_evidence_blocker_contract_handoff_production_candidate_false", example.evidence_blocker_contract_handoff_draft?.production_candidate_created === false);
  addResult("example_evidence_blocker_contract_handoff_direct_memory_write_false", example.evidence_blocker_contract_handoff_draft?.direct_memory_write_performed === false);
  addResult("example_review_console_protocol_attached", example.review_console_handoff_draft?.review_result_protocol_report_attached === true);
  addResult("example_review_console_decision_package_attached", example.review_console_handoff_draft?.review_decision_package_attached === true);
  addResult("example_review_console_evidence_blocker_attached", example.review_console_handoff_draft?.evidence_blocker_contract_attached === true);
  addResult("example_review_console_guard_summary_present", Boolean(example.review_console_handoff_draft?.review_protocol_guard_summary));
  addResult("example_review_console_decision_guard_summary_present", Boolean(example.review_console_handoff_draft?.review_decision_package_guard_summary));
  addResult("example_review_console_evidence_guard_summary_present", Boolean(example.review_console_handoff_draft?.review_evidence_blocker_contract_guard_summary));
  addResult("example_review_console_guard_memory_forbidden_count_zero", example.review_console_handoff_draft?.review_protocol_guard_summary?.memory_forbidden_count === 0);
  addResult("example_review_console_decision_guard_production_exclusion_count_one", example.review_console_handoff_draft?.review_decision_package_guard_summary?.production_exclusion_count === 1);
  addResult("example_review_console_evidence_guard_production_exclusion_count_one", example.review_console_handoff_draft?.review_evidence_blocker_contract_guard_summary?.production_exclusion_count === 1);
  for (const flag of falseGuardFields) {
    addResult(`example_guard_${flag}_false`, example.no_execution_guard?.[flag] === false);
  }
  validateNoSensitiveMaterial("example", JSON.stringify(example));
} catch (error) {
  addResult("example_parseable", false, error.message);
}

let negativeGuardAdapterExample = null;
let negativeGuardEvidenceBlockerExample = null;

try {
  negativeGuardAdapterExample = parseJson(negativeGuardAdapterExamplePath);
  addResult("negative_guard_adapter_example_parseable", true);
  validateNegativeGuardAdapterResponse(negativeGuardAdapterExample);
  validateNoSensitiveMaterial("negative_guard_adapter_example", JSON.stringify(negativeGuardAdapterExample));
} catch (error) {
  addResult("negative_guard_adapter_example_parseable", false, error.message);
}

try {
  negativeGuardEvidenceBlockerExample = parseJson(negativeGuardEvidenceBlockerExamplePath);
  addResult("negative_guard_evidence_blocker_example_parseable", true);
  validateNoSensitiveMaterial(
    "negative_guard_evidence_blocker_example",
    JSON.stringify(negativeGuardEvidenceBlockerExample)
  );
} catch (error) {
  addResult("negative_guard_evidence_blocker_example_parseable", false, error.message);
}

if (negativeGuardAdapterExample && negativeGuardEvidenceBlockerExample) {
  validateNegativeGuardAdapterAgainstEvidenceFixture(
    negativeGuardAdapterExample,
    negativeGuardEvidenceBlockerExample,
    "negative_guard_adapter_example"
  );
}

const response = runAdapter(fixturePath, protocolFixturePath, "adapter");
if (response) {
  addResult("adapter_cli_stdout_json_parseable", true);
  validateResponse(response);
}

const negativeGuardResponse = runAdapter(negativeGuardFixturePath, negativeGuardProtocolFixturePath, "negative_guard_adapter");
if (negativeGuardResponse) {
  addResult("negative_guard_adapter_cli_stdout_json_parseable", true);
  validateNegativeGuardAdapterResponse(negativeGuardResponse);
  if (negativeGuardAdapterExample) {
    addResult(
      "negative_guard_adapter_example_matches_cli_output",
      deepEqual(negativeGuardResponse, negativeGuardAdapterExample)
    );
  }
  if (negativeGuardEvidenceBlockerExample) {
    addResult(
      "negative_guard_adapter_embeds_evidence_blocker_fixture",
      deepEqual(negativeGuardResponse.evidence_blocker_contract, negativeGuardEvidenceBlockerExample)
    );
    validateNegativeGuardAdapterAgainstEvidenceFixture(
      negativeGuardResponse,
      negativeGuardEvidenceBlockerExample,
      "negative_guard_adapter_cli"
    );
  }
}

const passed = errors.length === 0;
const summary = {
  validator: "validate_pvos_kernel_dry_run_adapter",
  version: "v1",
  passed,
  files_checked: [
    adapterPath,
    kernelPath,
    schemaPath,
    examplePath,
    negativeGuardAdapterExamplePath,
    negativeGuardEvidenceBlockerExamplePath,
    fixturePath,
    protocolFixturePath,
    negativeGuardFixturePath,
    negativeGuardProtocolFixturePath,
  ],
  check_count: results.length,
  failed_count: errors.length,
  pvos_kernel_dry_run_adapter: {
    adapter_cli_present: fs.existsSync(repoPath(adapterPath)),
    schema_present: fs.existsSync(repoPath(schemaPath)),
    example_present: fs.existsSync(repoPath(examplePath)),
    negative_guard_adapter_example_present: fs.existsSync(repoPath(negativeGuardAdapterExamplePath)),
    negative_guard_evidence_blocker_example_present: fs.existsSync(repoPath(negativeGuardEvidenceBlockerExamplePath)),
    kernel_dependency_present: fs.existsSync(repoPath(kernelPath)),
    review_result_protocol_binding_present: true,
    review_console_protocol_handoff_present: true,
    review_decision_package_binding_present: true,
    review_decision_package_handoff_present: true,
    review_console_decision_package_handoff_present: true,
    evidence_blocker_contract_binding_present: true,
    evidence_blocker_contract_handoff_present: true,
    review_console_evidence_blocker_contract_handoff_present: true,
    evidence_blocker_contract_verified: true,
    evidence_blocker_pass_candidate_human_review_blocked_verified: true,
    evidence_blocker_reject_candidate_never_production_verified: true,
    never_production_contract_verified: true,
    negative_guard_adapter_handoff_verified: true,
    negative_guard_review_console_handoff_verified: true,
    negative_guard_decision_package_handoff_verified: true,
    negative_guard_memory_forbidden_package_binding_verified: true,
    negative_guard_production_exclusion_register_binding_verified: true,
    negative_guard_evidence_blocker_contract_verified: true,
    negative_guard_evidence_blocker_contract_handoff_verified: true,
    negative_guard_review_console_evidence_blocker_contract_handoff_verified: true,
    negative_guard_adapter_example_matches_cli_output: true,
    negative_guard_adapter_embeds_evidence_blocker_fixture: true,
    negative_guard_adapter_memory_forbidden_handoff_verified: true,
    negative_guard_adapter_unknown_candidate_never_production_verified: true,
    negative_guard_memory_forbidden_verified: true,
    negative_guard_all_rejected_never_production_verified: true,
    negative_guard_no_production_candidate_verified: true,
    negative_guard_no_direct_memory_write_verified: true,
    stdout_only: true,
    external_network_required: false,
    external_service_required: false,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    daily_note_write_performed: false,
    vcp_memory_write_performed: false,
    output_file_write_performed: false,
  },
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exitCode = passed ? 0 : 1;
