#!/usr/bin/env node
"use strict";

const {
  buildReviewDecisionPackage,
} = require("./review_decision_package");
const {
  buildReviewResultProtocolReport,
  loadProtocolInput,
  parseArgs,
} = require("./review_result_protocol");
const { buildKernelRun, loadInput } = require("./pvos_kernel");

const noExecutionGuard = Object.freeze({
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

function buildEvidenceRecord(candidate) {
  const evidenceCodes =
    candidate.review_outcome === "pass" ? candidate.pass_reasons : candidate.reject_reasons;
  return {
    evidence_record_id: `evidence_${candidate.candidate_id}`,
    candidate_id: candidate.candidate_id,
    shot_id: candidate.shot_id,
    evidence_scope:
      candidate.review_outcome === "pass" ? "candidate_acceptance_evidence" : "candidate_rejection_evidence",
    review_outcome: candidate.review_outcome,
    evidence_codes: evidenceCodes,
    pass_reasons: candidate.pass_reasons,
    reject_reasons: candidate.reject_reasons,
    memory_route: candidate.memory_route.route,
    memory_allowed: candidate.memory_route.allowed_to_enter_memory === true,
    production_route: candidate.production_route.status,
    production_allowed: candidate.production_route.allowed_for_production === true,
    production_candidate: candidate.production_route.production_candidate === true,
    direct_write_performed: false,
  };
}

function productionBlockerType(route) {
  if (route.status === "never_production") return "production_exclusion";
  if (route.status === "blocked_until_human_review") return "human_review_required";
  return "revision_required";
}

function productionBlockerDecision(candidate) {
  const route = candidate.production_route;
  const permanentBlock = route.permanent_block === true;
  return {
    blocker_decision_id: `blocker_production_${candidate.candidate_id}`,
    candidate_id: candidate.candidate_id,
    shot_id: candidate.shot_id,
    blocker_type: productionBlockerType(route),
    blocking_scope: "production_promotion",
    decision:
      route.status === "never_production" ? "block_permanently" : "block_until_required_review",
    severity: permanentBlock ? "hard_block" : "approval_required",
    permanent_block: permanentBlock,
    reversible_by_human_review: permanentBlock === false,
    requires_human_review: true,
    production_candidate: false,
    reason_codes: permanentBlock ? route.never_production_codes : route.reasons,
    direct_write_performed: false,
  };
}

function memoryBlockerDecision(record) {
  return {
    blocker_decision_id: `blocker_memory_${record.candidate_id}`,
    candidate_id: record.candidate_id,
    shot_id: record.shot_id,
    blocker_type: "memory_forbidden",
    blocking_scope: "memory_promotion",
    decision: "block_memory_entry",
    severity: "hard_block",
    permanent_block: true,
    reversible_by_human_review: false,
    requires_human_review: true,
    production_candidate: false,
    reason_codes: record.reasons,
    direct_write_performed: false,
  };
}

function productionExclusionRecord(record) {
  return {
    exclusion_record_id: `production_exclusion_${record.candidate_id}`,
    candidate_id: record.candidate_id,
    shot_id: record.shot_id,
    status: record.status,
    permanent_block: record.permanent_block,
    production_candidate: false,
    never_production_codes: record.never_production_codes,
    reasons: record.reasons,
    source_blocker_decision_id: `blocker_production_${record.candidate_id}`,
  };
}

function buildEvidenceBlockerContract(decisionPackage) {
  const candidates = decisionPackage.candidate_decision_records || [];
  const evidenceRecords = candidates.map(buildEvidenceRecord);
  const productionBlockers = candidates.map(productionBlockerDecision);
  const memoryBlockers = (decisionPackage.memory_forbidden_records || []).map(memoryBlockerDecision);
  const blockerDecisions = [...productionBlockers, ...memoryBlockers];
  const productionExclusions = (decisionPackage.production_exclusion_register || []).map(
    productionExclusionRecord
  );
  const permanentBlocks = blockerDecisions.filter((decision) => decision.permanent_block === true);
  const humanReviewBlocks = blockerDecisions.filter(
    (decision) => decision.blocking_scope === "production_promotion" && decision.requires_human_review === true
  );
  const productionExclusionIds = new Set(
    productionExclusions.map((record) => record.candidate_id)
  );
  const everyNeverProductionCandidateHasExclusion = candidates
    .filter((candidate) => candidate.production_route?.status === "never_production")
    .every((candidate) => productionExclusionIds.has(candidate.candidate_id));
  const everyProductionExclusionHasBlocker = productionExclusions.every((record) =>
    blockerDecisions.some(
      (decision) =>
        decision.blocker_decision_id === record.source_blocker_decision_id &&
        decision.permanent_block === true
    )
  );

  return {
    evidence_blocker_contract_version: "v1",
    contract_id: `evidence_blocker_contract_${decisionPackage.task_id}`,
    source_decision_package_id: decisionPackage.package_id,
    source_protocol_id: decisionPackage.source_protocol_id,
    source_kernel_run_id: decisionPackage.source_kernel_run_id,
    task_id: decisionPackage.task_id,
    status: "completed_local_evidence_blocker_contract",
    mode: "local_stdout_only_evidence_blocker_contract",
    evidence_records: evidenceRecords,
    blocker_decisions: blockerDecisions,
    production_exclusion_register: productionExclusions,
    blocker_summary: {
      candidate_count: candidates.length,
      evidence_record_count: evidenceRecords.length,
      blocker_decision_count: blockerDecisions.length,
      production_exclusion_count: productionExclusions.length,
      permanent_block_count: permanentBlocks.length,
      human_review_block_count: humanReviewBlocks.length,
      memory_forbidden_block_count: memoryBlockers.length,
      direct_memory_write_performed: false,
      production_candidate_created: false,
      accepted_samples_write_performed: false,
    },
    arbitration_guard: {
      evidence_record_is_not_approval: true,
      blocker_decision_is_not_write: true,
      every_candidate_has_evidence_record: evidenceRecords.length === candidates.length,
      every_candidate_has_production_blocker_decision:
        productionBlockers.length === candidates.length,
      every_never_production_candidate_has_exclusion:
        everyNeverProductionCandidateHasExclusion && everyProductionExclusionHasBlocker,
      no_production_without_human_review: true,
      production_candidate_created: false,
      direct_memory_write_performed: false,
      accepted_samples_write_performed: false,
    },
    no_execution_guard: noExecutionGuard,
  };
}

function printHelp() {
  process.stdout.write(
    [
      "Usage: node kernel/evidence_blocker_contract.js --input tests/schema_examples/review_result_protocol_input.example.json",
      "",
      "Reads a repository-local review-result protocol fixture and emits a local evidence/blocker contract to stdout.",
      "It performs no provider, plugin, API, image, DailyNote, VCP memory, production, or output-file action.",
    ].join("\n") + "\n"
  );
}

function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  if (args.help) {
    printHelp();
    return;
  }
  const protocolInput = loadProtocolInput(args.input);
  const kernelInput = loadInput(protocolInput.kernel_input_ref);
  const kernelRun = buildKernelRun(kernelInput);
  const protocolReport = buildReviewResultProtocolReport(protocolInput, kernelRun);
  const decisionPackage = buildReviewDecisionPackage(protocolReport);
  const contract = buildEvidenceBlockerContract(decisionPackage);
  process.stdout.write(`${JSON.stringify(contract, null, 2)}\n`);
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
  buildEvidenceBlockerContract,
};
