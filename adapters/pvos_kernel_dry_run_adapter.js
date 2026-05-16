#!/usr/bin/env node
"use strict";

const { buildKernelRun, loadInput } = require("../kernel/pvos_kernel");
const {
  buildReviewResultProtocolReport,
  loadProtocolInput,
} = require("../kernel/review_result_protocol");
const { buildReviewDecisionPackage } = require("../kernel/review_decision_package");
const { buildEvidenceBlockerContract } = require("../kernel/evidence_blocker_contract");

const defaultInputPath = "tests/schema_examples/pvos_kernel_input.example.json";
const defaultProtocolInputPath = "tests/schema_examples/review_result_protocol_input.example.json";

const adapterGuard = Object.freeze({
  execution_authorized: false,
  provider_contact_allowed: false,
  plugin_call_allowed: false,
  api_call_allowed: false,
  daily_note_write_allowed: false,
  vcp_memory_write_allowed: false,
  image_generation_allowed: false,
  output_file_write_allowed: false,
  accepted_samples_write_allowed: false,
  production_candidate_write_allowed: false,
  external_manifest_read_allowed: false,
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  daily_note_write_performed: false,
  vcp_memory_write_performed: false,
  image_generation_performed: false,
  output_file_write_performed: false,
  accepted_samples_write_performed: false,
  production_candidate_created: false,
  external_manifest_read_performed: false,
  vcpchat_source_read_performed: false,
  vcptoolbox_source_read_performed: false,
});

function parseArgs(argv) {
  const args = { input: defaultInputPath, protocolInput: defaultProtocolInputPath };
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--input") {
      args.input = argv[index + 1];
      index += 1;
      continue;
    }
    if (token.startsWith("--input=")) {
      args.input = token.slice("--input=".length);
      continue;
    }
    if (token === "--protocol-input") {
      args.protocolInput = argv[index + 1];
      index += 1;
      continue;
    }
    if (token.startsWith("--protocol-input=")) {
      args.protocolInput = token.slice("--protocol-input=".length);
      continue;
    }
    if (token === "--help" || token === "-h") {
      args.help = true;
      continue;
    }
    throw new Error(`unknown argument: ${token}`);
  }
  return args;
}

function buildProtocolHandoff(protocolReport) {
  const candidateResults = protocolReport.candidate_review_results || [];
  const neverProductionCandidateIds = candidateResults
    .filter((candidate) => candidate.production_route?.status === "never_production")
    .map((candidate) => candidate.candidate_id);
  const memoryForbiddenCandidateIds = candidateResults
    .filter((candidate) => candidate.memory_route?.route === "forbidden")
    .map((candidate) => candidate.candidate_id);
  const productionBlockedCount = candidateResults.filter(
    (candidate) => candidate.production_route?.production_candidate === false
  ).length;

  return {
    handoff_id: `review_protocol_handoff_${protocolReport.task_id}`,
    protocol_id: protocolReport.protocol_id,
    source_kernel_run_id: protocolReport.source_kernel_run_id,
    status: "draft_ready",
    candidate_count: protocolReport.report_summary.candidate_count,
    pass_count: protocolReport.report_summary.pass_count,
    reject_count: protocolReport.report_summary.reject_count,
    never_production_count: protocolReport.report_summary.never_production_count,
    never_production_candidate_ids: neverProductionCandidateIds,
    memory_forbidden_count: memoryForbiddenCandidateIds.length,
    memory_forbidden_candidate_ids: memoryForbiddenCandidateIds,
    production_blocked_count: productionBlockedCount,
    all_production_candidate_creation_blocked: productionBlockedCount === candidateResults.length,
    negative_guard_observed:
      protocolReport.report_summary.pass_count === 0 &&
      protocolReport.report_summary.reject_count === candidateResults.length &&
      protocolReport.report_summary.never_production_count === candidateResults.length,
    production_candidate_created: false,
    direct_memory_write_performed: false,
    required_review_fields: [
      "review_outcome",
      "pass_reasons",
      "reject_reasons",
      "memory_route",
      "production_route",
    ],
  };
}

function buildDecisionPackageHandoff(decisionPackage) {
  const acceptedSampleIds = decisionPackage.accepted_sample_drafts.map((sample) => sample.accepted_sample_id);
  const rejectedSampleIds = decisionPackage.rejected_sample_drafts.map((sample) => sample.rejected_sample_id);
  const memoryDeltaIds = decisionPackage.memory_delta_drafts.map((draft) => draft.memory_delta_id);
  const memoryForbiddenCandidateIds = decisionPackage.memory_forbidden_records.map((record) => record.candidate_id);
  const productionExclusionCandidateIds = decisionPackage.production_exclusion_register.map((record) => record.candidate_id);

  return {
    handoff_id: `review_decision_package_handoff_${decisionPackage.task_id}`,
    package_id: decisionPackage.package_id,
    source_protocol_id: decisionPackage.source_protocol_id,
    source_kernel_run_id: decisionPackage.source_kernel_run_id,
    status: "draft_ready",
    accepted_sample_draft_count: decisionPackage.decision_summary.accepted_sample_draft_count,
    rejected_sample_draft_count: decisionPackage.decision_summary.rejected_sample_draft_count,
    memory_delta_draft_count: decisionPackage.decision_summary.memory_delta_draft_count,
    memory_forbidden_count: decisionPackage.decision_summary.memory_forbidden_count,
    production_exclusion_count: decisionPackage.production_exclusion_register.length,
    accepted_sample_ids: acceptedSampleIds,
    rejected_sample_ids: rejectedSampleIds,
    memory_delta_ids: memoryDeltaIds,
    memory_forbidden_candidate_ids: memoryForbiddenCandidateIds,
    production_exclusion_candidate_ids: productionExclusionCandidateIds,
    direct_memory_write_performed: false,
    production_candidate_created: false,
    accepted_samples_write_performed: false,
    protocol_pass_is_not_production_approval:
      decisionPackage.promotion_guard.protocol_pass_is_not_production_approval,
    every_never_production_candidate_blocked:
      decisionPackage.promotion_guard.every_never_production_candidate_blocked,
    required_decision_fields: [
      "accepted_sample_drafts",
      "rejected_sample_drafts",
      "memory_delta_drafts",
      "memory_forbidden_records",
      "production_exclusion_register",
      "promotion_guard",
    ],
  };
}

function buildEvidenceBlockerContractHandoff(evidenceBlockerContract) {
  const productionExclusionCandidateIds = evidenceBlockerContract.production_exclusion_register.map(
    (record) => record.candidate_id
  );
  const memoryForbiddenCandidateIds = evidenceBlockerContract.blocker_decisions
    .filter((decision) => decision.blocker_type === "memory_forbidden")
    .map((decision) => decision.candidate_id);
  const humanReviewBlockedCandidateIds = evidenceBlockerContract.blocker_decisions
    .filter((decision) => decision.blocker_type === "human_review_required")
    .map((decision) => decision.candidate_id);

  return {
    handoff_id: `evidence_blocker_contract_handoff_${evidenceBlockerContract.task_id}`,
    contract_id: evidenceBlockerContract.contract_id,
    source_decision_package_id: evidenceBlockerContract.source_decision_package_id,
    source_protocol_id: evidenceBlockerContract.source_protocol_id,
    source_kernel_run_id: evidenceBlockerContract.source_kernel_run_id,
    status: "draft_ready",
    evidence_record_count: evidenceBlockerContract.blocker_summary.evidence_record_count,
    blocker_decision_count: evidenceBlockerContract.blocker_summary.blocker_decision_count,
    production_exclusion_count: evidenceBlockerContract.blocker_summary.production_exclusion_count,
    permanent_block_count: evidenceBlockerContract.blocker_summary.permanent_block_count,
    human_review_block_count: evidenceBlockerContract.blocker_summary.human_review_block_count,
    memory_forbidden_block_count: evidenceBlockerContract.blocker_summary.memory_forbidden_block_count,
    human_review_blocked_candidate_ids: humanReviewBlockedCandidateIds,
    memory_forbidden_candidate_ids: memoryForbiddenCandidateIds,
    production_exclusion_candidate_ids: productionExclusionCandidateIds,
    direct_memory_write_performed: false,
    production_candidate_created: false,
    accepted_samples_write_performed: false,
    evidence_record_is_not_approval:
      evidenceBlockerContract.arbitration_guard.evidence_record_is_not_approval,
    blocker_decision_is_not_write:
      evidenceBlockerContract.arbitration_guard.blocker_decision_is_not_write,
    every_candidate_has_evidence_record:
      evidenceBlockerContract.arbitration_guard.every_candidate_has_evidence_record,
    every_candidate_has_production_blocker_decision:
      evidenceBlockerContract.arbitration_guard.every_candidate_has_production_blocker_decision,
    every_never_production_candidate_has_exclusion:
      evidenceBlockerContract.arbitration_guard.every_never_production_candidate_has_exclusion,
    no_production_without_human_review:
      evidenceBlockerContract.arbitration_guard.no_production_without_human_review,
    required_evidence_blocker_fields: [
      "evidence_records",
      "blocker_decisions",
      "production_exclusion_register",
      "blocker_summary",
      "arbitration_guard",
    ],
  };
}

function buildAdapterResponse(input, protocolInput) {
  const kernelRun = buildKernelRun(input);
  const protocolReport = buildReviewResultProtocolReport(protocolInput, kernelRun);
  const protocolHandoff = buildProtocolHandoff(protocolReport);
  const decisionPackage = buildReviewDecisionPackage(protocolReport);
  const decisionPackageHandoff = buildDecisionPackageHandoff(decisionPackage);
  const evidenceBlockerContract = buildEvidenceBlockerContract(decisionPackage);
  const evidenceBlockerContractHandoff = buildEvidenceBlockerContractHandoff(evidenceBlockerContract);
  const acceptedCandidateIds = kernelRun.accepted_samples.map((sample) => sample.candidate_id);
  const rejectedCandidateIds = kernelRun.rejected_samples.map((sample) => sample.candidate_id);

  return {
    pvos_kernel_dry_run_adapter_response_version: "v1",
    adapter_id: "pvos_kernel_dry_run_adapter",
    request_id: `pvos_adapter_request_${kernelRun.task_id}`,
    status: "accepted_draft",
    mode: "local_no_execution_adapter_contract",
    kernel_run: kernelRun,
    review_result_protocol_report: protocolReport,
    review_result_protocol_handoff_draft: protocolHandoff,
    review_decision_package: decisionPackage,
    review_decision_package_handoff_draft: decisionPackageHandoff,
    evidence_blocker_contract: evidenceBlockerContract,
    evidence_blocker_contract_handoff_draft: evidenceBlockerContractHandoff,
    vcp_adapter_handoff_draft: {
      handoff_id: `vcp_handoff_${kernelRun.task_id}`,
      target_platform: "VCP_adapter_future",
      adapter_boundary: "local_dry_run_contract_only",
      input_reference: kernelRun.provenance_record.source_fixture_ref,
      selected_plugin: null,
      fallback_plugins: [],
      max_plugin_calls: 0,
      execution_authorized: false,
      provider_contact_allowed: false,
      plugin_call_allowed: false,
      api_call_allowed: false,
      output_write_allowed: false,
      expected_outputs: 0,
    },
    review_console_handoff_draft: {
      review_session_id: `review_session_${kernelRun.task_id}`,
      display_only: true,
      status: "draft_ready",
      accepted_candidate_ids: acceptedCandidateIds,
      rejected_candidate_ids: rejectedCandidateIds,
      allowed_actions: [
        "review_candidate_scores",
        "compare_accepted_rejected_routes",
        "request_revision_plan",
      ],
      forbidden_actions: [
        "execute_plugin",
        "call_api",
        "write_daily_note",
        "save_image",
        "write_accepted_samples",
      ],
      human_review_required_for_production: true,
      memory_write_requires_separate_approval: true,
      review_result_protocol_report_attached: true,
      review_result_protocol_handoff_id: protocolHandoff.handoff_id,
      review_decision_package_attached: true,
      review_decision_package_handoff_id: decisionPackageHandoff.handoff_id,
      evidence_blocker_contract_attached: true,
      evidence_blocker_contract_handoff_id: evidenceBlockerContractHandoff.handoff_id,
      required_review_fields: protocolHandoff.required_review_fields,
      review_protocol_guard_summary: {
        never_production_count: protocolHandoff.never_production_count,
        never_production_candidate_ids: protocolHandoff.never_production_candidate_ids,
        memory_forbidden_count: protocolHandoff.memory_forbidden_count,
        memory_forbidden_candidate_ids: protocolHandoff.memory_forbidden_candidate_ids,
        production_candidate_created: false,
        direct_memory_write_performed: false,
        negative_guard_observed: protocolHandoff.negative_guard_observed,
      },
      review_decision_package_guard_summary: {
        accepted_sample_draft_count: decisionPackageHandoff.accepted_sample_draft_count,
        rejected_sample_draft_count: decisionPackageHandoff.rejected_sample_draft_count,
        memory_delta_draft_count: decisionPackageHandoff.memory_delta_draft_count,
        memory_forbidden_count: decisionPackageHandoff.memory_forbidden_count,
        production_exclusion_count: decisionPackageHandoff.production_exclusion_count,
        production_exclusion_candidate_ids: decisionPackageHandoff.production_exclusion_candidate_ids,
        production_candidate_created: false,
        direct_memory_write_performed: false,
        accepted_samples_write_performed: false,
      },
      review_evidence_blocker_contract_guard_summary: {
        evidence_record_count: evidenceBlockerContractHandoff.evidence_record_count,
        blocker_decision_count: evidenceBlockerContractHandoff.blocker_decision_count,
        production_exclusion_count: evidenceBlockerContractHandoff.production_exclusion_count,
        permanent_block_count: evidenceBlockerContractHandoff.permanent_block_count,
        human_review_block_count: evidenceBlockerContractHandoff.human_review_block_count,
        memory_forbidden_block_count: evidenceBlockerContractHandoff.memory_forbidden_block_count,
        production_exclusion_candidate_ids: evidenceBlockerContractHandoff.production_exclusion_candidate_ids,
        production_candidate_created: false,
        direct_memory_write_performed: false,
        accepted_samples_write_performed: false,
        every_candidate_has_evidence_record:
          evidenceBlockerContractHandoff.every_candidate_has_evidence_record,
        every_candidate_has_production_blocker_decision:
          evidenceBlockerContractHandoff.every_candidate_has_production_blocker_decision,
        every_never_production_candidate_has_exclusion:
          evidenceBlockerContractHandoff.every_never_production_candidate_has_exclusion,
      },
    },
    provenance_handoff_draft: {
      provenance_record_id: kernelRun.provenance_record.provenance_record_id,
      source_fixture_ref: kernelRun.provenance_record.source_fixture_ref,
      provider_payload_included: false,
      image_binary_included: false,
      private_path_included: false,
      artifact_refs_are_metadata_only: true,
    },
    audit_record: {
      audit_id: `adapter_audit_${kernelRun.task_id}`,
      status: "draft_only",
      summary_zh: "PVOS dry-run adapter 仅把本地内核运行结果映射为 VCP 与审片台草案，不执行生产动作。",
      selected_plugin: null,
      max_plugin_calls_observed: 0,
      external_api_observed: false,
      output_file_write_observed: false,
      image_generation_observed: false,
      memory_write_observed: false,
      review_result_protocol_observed: true,
      review_decision_package_observed: true,
      evidence_blocker_contract_observed: true,
      accepted_sample_draft_count: decisionPackageHandoff.accepted_sample_draft_count,
      rejected_sample_draft_count: decisionPackageHandoff.rejected_sample_draft_count,
      memory_delta_draft_count: decisionPackageHandoff.memory_delta_draft_count,
      production_exclusion_count: decisionPackageHandoff.production_exclusion_count,
      evidence_record_count: evidenceBlockerContractHandoff.evidence_record_count,
      blocker_decision_count: evidenceBlockerContractHandoff.blocker_decision_count,
      permanent_block_count: evidenceBlockerContractHandoff.permanent_block_count,
      memory_forbidden_block_count: evidenceBlockerContractHandoff.memory_forbidden_block_count,
      production_candidate_created: false,
      never_production_count: protocolReport.report_summary.never_production_count,
      memory_forbidden_count: protocolHandoff.memory_forbidden_count,
      negative_guard_observed: protocolHandoff.negative_guard_observed,
    },
    no_execution_guard: adapterGuard,
  };
}

function printHelp() {
  process.stdout.write(
    [
      "Usage: node adapters/pvos_kernel_dry_run_adapter.js --input tests/schema_examples/pvos_kernel_input.example.json",
      "       node adapters/pvos_kernel_dry_run_adapter.js --protocol-input tests/schema_examples/review_result_protocol_input.example.json",
      "",
      "Builds a local PVOS kernel run and maps it to VCP/Review Console handoff drafts.",
      "It writes JSON to stdout only and performs no provider, plugin, API, image, memory, or output-file action.",
    ].join("\n") + "\n"
  );
}

function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  if (args.help) {
    printHelp();
    return;
  }
  const input = loadInput(args.input);
  const protocolInput = loadProtocolInput(args.protocolInput);
  if (protocolInput.kernel_input_ref !== args.input.replace(/\\/g, "/")) {
    throw new Error("protocol input kernel_input_ref must match adapter input");
  }
  const response = buildAdapterResponse(input, protocolInput);
  process.stdout.write(`${JSON.stringify(response, null, 2)}\n`);
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  }
}

module.exports = {
  buildAdapterResponse,
  parseArgs,
};
