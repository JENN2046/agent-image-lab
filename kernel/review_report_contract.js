#!/usr/bin/env node
"use strict";

const { buildEvidenceBlockerContract } = require("./evidence_blocker_contract");
const { buildReviewDecisionPackage } = require("./review_decision_package");
const { buildReviewBlockerArbiter } = require("./review_blocker_arbiter");
const {
  buildReviewResultProtocolReport,
  loadProtocolInput,
  parseArgs,
} = require("./review_result_protocol");
const { buildKernelRun, loadInput } = require("./pvos_kernel");

const noExecutionGuard = Object.freeze({
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  daily_note_write_performed: false,
  vcp_memory_write_performed: false,
  image_generation_performed: false,
  output_file_write_performed: false,
  accepted_samples_write_performed: false,
  production_candidate_created: false,
});

const blockedWrites = Object.freeze([
  "DailyNote_write",
  "VCP_memory_write",
  "direct_memory_write",
  "accepted_samples_write",
  "production_candidate",
]);

const blockedExecution = Object.freeze([
  "provider_execution",
  "plugin_call",
  "api_call",
  "image_generation",
  "deployment_or_release",
]);

function reportDecisionFor(arbitration) {
  if (arbitration.review_outcome === "pass") return "pass_to_draft_review_queue";
  if (arbitration.memory_forbidden === true) return "reject_to_memory_forbidden_never_production";
  if (arbitration.never_production === true) return "reject_to_failure_learning_never_production";
  return "block_pending_required_review";
}

function reportStatusFor(arbitration) {
  if (arbitration.review_outcome === "pass") return "draft_report_pending_human_review";
  if (arbitration.memory_forbidden === true) return "draft_report_memory_forbidden_never_production";
  if (arbitration.never_production === true) return "draft_report_failure_learning_only";
  return "draft_report_blocked_pending_required_review";
}

function memoryAllowedOutputFor(arbitration) {
  if (arbitration.memory_forbidden === true) return "none";
  if (arbitration.review_outcome === "reject") return "failure_lesson_draft_only";
  return "memory_delta_draft_only";
}

function productionAllowedOutputFor(arbitration) {
  if (arbitration.never_production === true) return "failure_learning_only";
  return "review_pending_candidate_only";
}

function buildReportItem(arbitration, protocolCandidate = {}) {
  const executionBlocked = [...blockedExecution];
  if (arbitration.never_production === true) {
    executionBlocked.push("production_forever");
  }

  return {
    candidate_id: arbitration.candidate_id,
    shot_id: arbitration.shot_id,
    review_outcome: arbitration.review_outcome,
    report_decision: reportDecisionFor(arbitration),
    report_status: reportStatusFor(arbitration),
    final_route: arbitration.final_route,
    pass_reasons: arbitration.pass_reasons || [],
    reject_reasons: arbitration.reject_reasons || [],
    failure_tags: protocolCandidate.failure_tags || [],
    unknown_failure_tags: protocolCandidate.unknown_failure_tags || [],
    evidence_record_id: arbitration.evidence_record_id,
    production_blocker_decision_id: arbitration.production_blocker_decision_id,
    memory_blocker_decision_ids: arbitration.memory_blocker_decision_ids || [],
    production_exclusion_record_id: arbitration.production_exclusion_record_id,
    memory_report: {
      allowed_output_now: memoryAllowedOutputFor(arbitration),
      memory_entry_allowed_now: false,
      memory_draft_allowed: arbitration.memory_draft_allowed === true,
      memory_forbidden: arbitration.memory_forbidden === true,
      requires_human_memory_approval: true,
      direct_memory_write_performed: false,
      daily_note_write_performed: false,
      vcp_memory_write_performed: false,
    },
    production_report: {
      allowed_output_now: productionAllowedOutputFor(arbitration),
      production_promotion_allowed_now: false,
      requires_human_production_approval: arbitration.never_production !== true,
      production_candidate_created: false,
      accepted_samples_write_performed: false,
      never_production: arbitration.never_production === true,
    },
    final_controls: {
      may_enter_memory_now: false,
      may_enter_production_now: false,
      writes_allowed_now: [],
      writes_blocked: [...blockedWrites],
      execution_blocked: executionBlocked,
    },
  };
}

function buildReportSummary(reportItems) {
  const passItems = reportItems.filter((item) => item.review_outcome === "pass");
  const rejectItems = reportItems.filter((item) => item.review_outcome === "reject");
  const neverProductionItems = reportItems.filter((item) => item.production_report.never_production);

  return {
    candidate_count: reportItems.length,
    pass_count: passItems.length,
    reject_count: rejectItems.length,
    report_items_explain_all_candidates: reportItems.every(
      (item) =>
        (item.review_outcome === "pass" && item.pass_reasons.length > 0) ||
        (item.review_outcome === "reject" && item.reject_reasons.length > 0)
    ),
    memory_entry_allowed_now_count: 0,
    production_promotion_allowed_now_count: 0,
    writes_allowed_now_count: 0,
    never_production_count: neverProductionItems.length,
    all_memory_writes_blocked: true,
    all_production_writes_blocked: true,
    all_provider_execution_blocked: true,
    all_candidates_have_evidence_record: reportItems.every((item) => Boolean(item.evidence_record_id)),
    all_candidates_have_blocker_decision: reportItems.every((item) =>
      Boolean(item.production_blocker_decision_id)
    ),
  };
}

function buildReviewReportContract(reviewBlockerArbiter, options = {}) {
  const protocolCandidates = options.protocolReport?.candidate_review_results || [];
  const protocolByCandidate = new Map(
    protocolCandidates.map((candidate) => [candidate.candidate_id, candidate])
  );
  const reportItems = (reviewBlockerArbiter.candidate_arbitrations || []).map((arbitration) =>
    buildReportItem(arbitration, protocolByCandidate.get(arbitration.candidate_id))
  );

  return {
    review_report_contract_version: "v1",
    review_report_id: `review_report_${reviewBlockerArbiter.task_id}`,
    phase: options.phase || "v14_068_review_report_adapter_handoff_gate",
    source_phase: options.sourcePhase || "v14_067_review_report_contract_gate",
    status: "completed_local_review_report_contract",
    mode: "local_stdout_only_review_report_contract",
    display_only: true,
    source_review_blocker_arbiter_id: reviewBlockerArbiter.arbiter_id,
    source_evidence_blocker_contract_id: reviewBlockerArbiter.source_evidence_blocker_contract_id,
    source_decision_package_id: reviewBlockerArbiter.source_decision_package_id,
    source_protocol_id: reviewBlockerArbiter.source_protocol_id,
    source_kernel_run_id: reviewBlockerArbiter.source_kernel_run_id,
    task_id: reviewBlockerArbiter.task_id,
    report_items: reportItems,
    report_summary: buildReportSummary(reportItems),
    no_execution_guard: noExecutionGuard,
  };
}

function printHelp() {
  process.stdout.write(
    [
      "Usage: node kernel/review_report_contract.js --input tests/schema_examples/review_result_protocol_input.example.json",
      "",
      "Builds a local ReviewReport contract from the review blocker arbiter and emits JSON to stdout.",
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
  const evidenceBlockerContract = buildEvidenceBlockerContract(decisionPackage);
  const reviewBlockerArbiter = buildReviewBlockerArbiter(evidenceBlockerContract);
  const reviewReportContract = buildReviewReportContract(reviewBlockerArbiter, { protocolReport });
  process.stdout.write(`${JSON.stringify(reviewReportContract, null, 2)}\n`);
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
  buildReviewReportContract,
};
