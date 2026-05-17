#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const pipelinePath = "kernel/pvos_evidence_collector_blocker_pipeline.js";
const schemaPath = "schemas/pvos_evidence_collector_blocker_pipeline.schema.yaml";
const examplePath =
  "tests/schema_examples/pvos_evidence_collector_blocker_pipeline.example.json";
const defaultInputPath = "tests/schema_examples/pvos_kernel_input.example.json";
const defaultProtocolInputPath =
  "tests/schema_examples/review_result_protocol_input.example.json";
const negativeInputPath =
  "tests/schema_examples/pvos_kernel_negative_guard_input.example.json";
const negativeProtocolInputPath =
  "tests/schema_examples/review_result_protocol_negative_guard_input.example.json";

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

function sameMembers(actual, expected) {
  if (!Array.isArray(actual) || !Array.isArray(expected)) return false;
  return JSON.stringify([...actual].sort()) === JSON.stringify([...expected].sort());
}

function runNodeCheck(relativePath) {
  const result = childProcess.spawnSync(process.execPath, ["--check", repoPath(relativePath)], {
    cwd: root,
    encoding: "utf8",
  });
  addResult(`${relativePath}_node_check_passed`, result.status === 0, result.stderr || result.stdout);
}

function runPipeline(inputPath, protocolInputPath, label) {
  const result = childProcess.spawnSync(
    process.execPath,
    [repoPath(pipelinePath), "--input", inputPath, "--protocol-input", protocolInputPath],
    { cwd: root, encoding: "utf8" }
  );
  addResult(`${label}_pipeline_cli_exit_zero`, result.status === 0, result.stderr || result.stdout);
  addResult(`${label}_pipeline_cli_stderr_empty`, result.stderr.trim() === "", result.stderr);
  if (result.status !== 0) return null;
  try {
    const parsed = JSON.parse(result.stdout);
    addResult(`${label}_pipeline_cli_stdout_json_parseable`, true);
    return parsed;
  } catch (error) {
    addResult(`${label}_pipeline_cli_stdout_json_parseable`, false, error.message);
    return null;
  }
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

function validateGuard(response, label) {
  for (const flag of falseGuardFields) {
    addResult(`${label}_guard_${flag}_false`, response.no_execution_guard?.[flag] === false);
  }
  const handoffGuard = response.review_console_handoff_draft?.guard_summary || {};
  addResult(`${label}_handoff_no_production_candidate`, handoffGuard.production_candidate_created === false);
  addResult(`${label}_handoff_no_direct_memory_write`, handoffGuard.direct_memory_write_performed === false);
  addResult(`${label}_handoff_no_daily_note_write`, handoffGuard.daily_note_write_performed === false);
  addResult(`${label}_handoff_no_vcp_memory_write`, handoffGuard.vcp_memory_write_performed === false);
  addResult(`${label}_handoff_no_accepted_samples_write`, handoffGuard.accepted_samples_write_performed === false);
  addResult(`${label}_handoff_all_memory_writes_blocked`, handoffGuard.all_memory_writes_blocked === true);
  addResult(`${label}_handoff_all_production_writes_blocked`, handoffGuard.all_production_writes_blocked === true);
  addResult(`${label}_handoff_all_provider_execution_blocked`, handoffGuard.all_provider_execution_blocked === true);
}

function validatePipelineResponse(response, label, expected) {
  const outputs = response.outputs || {};
  const evidenceRecords = outputs.evidence_records || [];
  const blockerDecisions = outputs.blocker_decisions || [];
  const reviewReport = outputs.review_report || {};
  const memoryDeltaDrafts = outputs.memory_delta_drafts || [];
  const productionExclusionDrafts = outputs.production_exclusion_drafts || [];
  const summary = response.pipeline_summary || {};
  const refs = response.output_refs || {};
  const fixtureApproval = response.fixture_approval || {};
  const reviewHandoff = response.review_console_handoff_draft || {};
  const handoffGuard = reviewHandoff.guard_summary || {};

  addResult(`${label}_version_v1`, response.pvos_evidence_collector_blocker_pipeline_version === "v1");
  addResult(`${label}_status_completed`, response.status === "completed_local_pipeline_draft");
  addResult(`${label}_mode_stdout_only`, response.mode === "local_stdout_only_evidence_collector_blocker_pipeline");
  addResult(`${label}_approved_local_fixture`, fixtureApproval.approved_local_fixture === true);
  addResult(`${label}_allowed_fixture_pair`, fixtureApproval.allowed_fixture_pair === true);
  addResult(`${label}_fixture_input_expected`, fixtureApproval.input_ref === expected.inputRef);
  addResult(`${label}_fixture_protocol_expected`, fixtureApproval.protocol_input_ref === expected.protocolInputRef);
  addResult(`${label}_fixture_no_provider_payload`, fixtureApproval.provider_payload_included === false);
  addResult(`${label}_fixture_no_image_binary`, fixtureApproval.image_binary_included === false);
  addResult(`${label}_fixture_no_private_path`, fixtureApproval.private_path_included === false);

  addResult(`${label}_evidence_records_present`, evidenceRecords.length === expected.evidenceRecordCount);
  addResult(`${label}_blocker_decisions_present`, blockerDecisions.length === expected.blockerDecisionCount);
  addResult(`${label}_review_report_present`, Boolean(reviewReport.review_report_id));
  addResult(`${label}_review_report_items_present`, reviewReport.report_items?.length === expected.reviewReportItemCount);
  addResult(`${label}_memory_delta_drafts_present`, memoryDeltaDrafts.length === expected.memoryDeltaDraftCount);
  addResult(`${label}_production_exclusion_drafts_present`, productionExclusionDrafts.length === expected.productionExclusionCount);

  addResult(`${label}_every_candidate_has_evidence`, reviewReport.report_summary?.all_candidates_have_evidence_record === true);
  addResult(`${label}_every_candidate_has_blocker`, reviewReport.report_summary?.all_candidates_have_blocker_decision === true);
  addResult(`${label}_review_report_blocks_memory_now`, reviewReport.report_summary?.memory_entry_allowed_now_count === 0);
  addResult(`${label}_review_report_blocks_production_now`, reviewReport.report_summary?.production_promotion_allowed_now_count === 0);
  addResult(`${label}_review_report_blocks_all_writes`, reviewReport.report_summary?.writes_allowed_now_count === 0);

  addResult(`${label}_summary_candidate_count`, summary.candidate_count === expected.candidateCount);
  addResult(`${label}_summary_evidence_count`, summary.evidence_record_count === expected.evidenceRecordCount);
  addResult(`${label}_summary_blocker_count`, summary.blocker_decision_count === expected.blockerDecisionCount);
  addResult(`${label}_summary_review_report_count`, summary.review_report_item_count === expected.reviewReportItemCount);
  addResult(`${label}_summary_memory_delta_count`, summary.memory_delta_draft_count === expected.memoryDeltaDraftCount);
  addResult(`${label}_summary_production_exclusion_count`, summary.production_exclusion_draft_count === expected.productionExclusionCount);
  addResult(`${label}_summary_memory_forbidden_count`, summary.memory_forbidden_count === expected.memoryForbiddenCount);
  addResult(`${label}_summary_never_production_count`, summary.never_production_count === expected.neverProductionCount);
  addResult(`${label}_summary_memory_blocked_now`, summary.no_memory_entry_allowed_now === true);
  addResult(`${label}_summary_production_blocked_now`, summary.no_production_promotion_allowed_now === true);
  addResult(`${label}_summary_outputs_drafts`, summary.all_outputs_are_drafts === true);
  addResult(`${label}_summary_stdout_only`, summary.stdout_only === true);
  addResult(`${label}_summary_local_only`, summary.local_only === true);

  addResult(`${label}_refs_evidence_count`, refs.evidence_record_ids?.length === expected.evidenceRecordCount);
  addResult(`${label}_refs_blocker_count`, refs.blocker_decision_ids?.length === expected.blockerDecisionCount);
  addResult(`${label}_refs_review_report_id_matches`, refs.review_report_id === reviewReport.review_report_id);
  addResult(`${label}_refs_memory_delta_count`, refs.memory_delta_ids?.length === expected.memoryDeltaDraftCount);
  addResult(`${label}_refs_production_exclusion_count`, refs.production_exclusion_record_ids?.length === expected.productionExclusionCount);
  addResult(
    `${label}_refs_production_exclusion_ids_non_empty`,
    (refs.production_exclusion_record_ids || []).every((id) => typeof id === "string" && id.length > 0)
  );
  addResult(`${label}_refs_never_production_expected`, sameMembers(refs.never_production_candidate_ids, expected.neverProductionCandidateIds));
  addResult(`${label}_refs_memory_forbidden_expected`, sameMembers(refs.memory_forbidden_candidate_ids, expected.memoryForbiddenCandidateIds));

  addResult(`${label}_handoff_id_present`, typeof reviewHandoff.handoff_id === "string" && reviewHandoff.handoff_id.startsWith("pvos_evidence_collector_blocker_pipeline_handoff_"));
  addResult(`${label}_handoff_display_only`, reviewHandoff.display_only === true);
  addResult(`${label}_handoff_draft_ready`, reviewHandoff.status === "draft_ready");
  addResult(`${label}_handoff_evidence_attached`, reviewHandoff.evidence_blocker_contract_attached === true);
  addResult(`${label}_handoff_arbiter_attached`, reviewHandoff.review_blocker_arbiter_attached === true);
  addResult(`${label}_handoff_review_report_attached`, reviewHandoff.review_report_contract_attached === true);
  addResult(`${label}_handoff_memory_delta_attached`, reviewHandoff.memory_delta_drafts_attached === true);
  addResult(`${label}_handoff_production_exclusion_attached`, reviewHandoff.production_exclusion_drafts_attached === true);
  addResult(`${label}_handoff_guard_evidence_count`, handoffGuard.evidence_record_count === expected.evidenceRecordCount);
  addResult(`${label}_handoff_guard_blocker_count`, handoffGuard.blocker_decision_count === expected.blockerDecisionCount);
  addResult(`${label}_handoff_guard_review_report_count`, handoffGuard.review_report_item_count === expected.reviewReportItemCount);

  validateGuard(response, label);
  validateNoSensitiveMaterial(label, JSON.stringify(response));
}

function validateExampleFixture(example) {
  const summary = example.pipeline_summary || {};
  const refs = example.output_refs || {};
  const fixtureApproval = example.fixture_approval || {};
  const handoff = example.review_console_handoff_draft || {};
  const handoffGuard = handoff.guard_summary || {};

  addResult("example_version_v1", example.pvos_evidence_collector_blocker_pipeline_version === "v1");
  addResult("example_status_completed", example.status === "completed_local_pipeline_draft");
  addResult("example_mode_stdout_only", example.mode === "local_stdout_only_evidence_collector_blocker_pipeline");
  addResult("example_approved_local_fixture", fixtureApproval.approved_local_fixture === true);
  addResult("example_allowed_fixture_pair", fixtureApproval.allowed_fixture_pair === true);
  addResult("example_input_ref_expected", fixtureApproval.input_ref === defaultInputPath);
  addResult("example_protocol_ref_expected", fixtureApproval.protocol_input_ref === defaultProtocolInputPath);
  addResult("example_evidence_ref_count", refs.evidence_record_ids?.length === 2);
  addResult("example_blocker_ref_count", refs.blocker_decision_ids?.length === 2);
  addResult("example_memory_delta_ref_count", refs.memory_delta_ids?.length === 2);
  addResult("example_production_exclusion_ref_count", refs.production_exclusion_record_ids?.length === 1);
  addResult("example_never_production_ids_expected", sameMembers(refs.never_production_candidate_ids, ["candidate_reject_metadata_001"]));
  addResult("example_memory_forbidden_ids_empty", sameMembers(refs.memory_forbidden_candidate_ids, []));
  addResult("example_handoff_display_only", handoff.display_only === true);
  addResult("example_handoff_draft_ready", handoff.status === "draft_ready");
  addResult("example_handoff_evidence_attached", handoff.evidence_blocker_contract_attached === true);
  addResult("example_handoff_arbiter_attached", handoff.review_blocker_arbiter_attached === true);
  addResult("example_handoff_review_report_attached", handoff.review_report_contract_attached === true);
  addResult("example_handoff_memory_delta_attached", handoff.memory_delta_drafts_attached === true);
  addResult("example_handoff_production_exclusion_attached", handoff.production_exclusion_drafts_attached === true);
  addResult("example_handoff_guard_evidence_count", handoffGuard.evidence_record_count === 2);
  addResult("example_handoff_guard_blocker_count", handoffGuard.blocker_decision_count === 2);
  addResult("example_handoff_guard_review_report_count", handoffGuard.review_report_item_count === 2);
  addResult("example_handoff_guard_memory_delta_count", handoffGuard.memory_delta_draft_count === 2);
  addResult("example_handoff_guard_production_exclusion_count", handoffGuard.production_exclusion_draft_count === 1);
  addResult("example_handoff_guard_no_production_candidate", handoffGuard.production_candidate_created === false);
  addResult("example_handoff_guard_no_direct_memory_write", handoffGuard.direct_memory_write_performed === false);
  addResult("example_handoff_guard_no_daily_note_write", handoffGuard.daily_note_write_performed === false);
  addResult("example_handoff_guard_no_vcp_memory_write", handoffGuard.vcp_memory_write_performed === false);
  addResult("example_handoff_guard_no_accepted_samples_write", handoffGuard.accepted_samples_write_performed === false);
  addResult("example_summary_candidate_count", summary.candidate_count === 2);
  addResult("example_summary_evidence_count", summary.evidence_record_count === 2);
  addResult("example_summary_blocker_count", summary.blocker_decision_count === 2);
  addResult("example_summary_review_report_count", summary.review_report_item_count === 2);
  addResult("example_summary_memory_delta_count", summary.memory_delta_draft_count === 2);
  addResult("example_summary_production_exclusion_count", summary.production_exclusion_draft_count === 1);
  addResult("example_summary_stdout_only", summary.stdout_only === true);
  addResult("example_summary_local_only", summary.local_only === true);
  validateGuard(example, "example");
  validateNoSensitiveMaterial("example", JSON.stringify(example));
}

for (const relativePath of [
  pipelinePath,
  schemaPath,
  examplePath,
  defaultInputPath,
  defaultProtocolInputPath,
  negativeInputPath,
  negativeProtocolInputPath,
]) {
  addResult(`${relativePath}_exists`, fs.existsSync(repoPath(relativePath)), relativePath);
}

runNodeCheck(pipelinePath);
runNodeCheck("scripts/validate_pvos_evidence_collector_blocker_pipeline.js");

try {
  const schema = readFile(schemaPath);
  addResult("schema_version_declared", /version: v1/.test(schema));
  addResult("schema_approved_local_fixture_declared", /approved_local_fixture: true/.test(schema));
  addResult("schema_evidence_records_declared", /evidence_records: array/.test(schema));
  addResult("schema_blocker_decisions_declared", /blocker_decisions: array/.test(schema));
  addResult("schema_review_report_declared", /review_report: object/.test(schema));
  addResult("schema_memory_delta_drafts_declared", /memory_delta_drafts: array/.test(schema));
  addResult("schema_production_exclusion_drafts_declared", /production_exclusion_drafts: array/.test(schema));
  addResult("schema_handoff_declared", /review_console_handoff:/.test(schema));
  addResult("schema_no_execution_guard_declared", /provider_contact_performed: false/.test(schema));
  validateNoSensitiveMaterial("schema", schema);
} catch (error) {
  addResult("schema_readable", false, error.message);
}

try {
  const example = parseJson(examplePath);
  validateExampleFixture(example);
} catch (error) {
  addResult("example_parseable", false, error.message);
}

const response = runPipeline(defaultInputPath, defaultProtocolInputPath, "pipeline");
if (response) {
  validatePipelineResponse(response, "pipeline", {
    inputRef: defaultInputPath,
    protocolInputRef: defaultProtocolInputPath,
    candidateCount: 2,
    evidenceRecordCount: 2,
    blockerDecisionCount: 2,
    reviewReportItemCount: 2,
    memoryDeltaDraftCount: 2,
    productionExclusionCount: 1,
    memoryForbiddenCount: 0,
    neverProductionCount: 1,
    neverProductionCandidateIds: ["candidate_reject_metadata_001"],
    memoryForbiddenCandidateIds: [],
  });
}

const negativeResponse = runPipeline(negativeInputPath, negativeProtocolInputPath, "negative_guard_pipeline");
if (negativeResponse) {
  validatePipelineResponse(negativeResponse, "negative_guard_pipeline", {
    inputRef: negativeInputPath,
    protocolInputRef: negativeProtocolInputPath,
    candidateCount: 2,
    evidenceRecordCount: 2,
    blockerDecisionCount: 3,
    reviewReportItemCount: 2,
    memoryDeltaDraftCount: 1,
    productionExclusionCount: 2,
    memoryForbiddenCount: 1,
    neverProductionCount: 2,
    neverProductionCandidateIds: [
      "candidate_reject_mapped_guard_001",
      "candidate_reject_unknown_guard_001",
    ],
    memoryForbiddenCandidateIds: ["candidate_reject_unknown_guard_001"],
  });
}

const passed = errors.length === 0;
const summary = {
  validator: "validate_pvos_evidence_collector_blocker_pipeline",
  version: "v1",
  passed,
  files_checked: [
    pipelinePath,
    schemaPath,
    examplePath,
    defaultInputPath,
    defaultProtocolInputPath,
    negativeInputPath,
    negativeProtocolInputPath,
  ],
  check_count: results.length,
  failed_count: errors.length,
  pvos_evidence_collector_blocker_pipeline: {
    pipeline_cli_present: fs.existsSync(repoPath(pipelinePath)),
    schema_present: fs.existsSync(repoPath(schemaPath)),
    example_present: fs.existsSync(repoPath(examplePath)),
    approved_fixture_allowlist_verified: true,
    evidence_records_verified: true,
    blocker_decisions_verified: true,
    review_report_verified: true,
    memory_delta_drafts_verified: true,
    production_exclusion_drafts_verified: true,
    review_console_handoff_verified: true,
    negative_guard_memory_forbidden_verified: true,
    negative_guard_never_production_verified: true,
    stdout_only: true,
    local_only: true,
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
