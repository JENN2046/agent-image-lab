#!/usr/bin/env node
"use strict";

const { buildEvidenceBlockerContract } = require("./evidence_blocker_contract");
const { buildReviewDecisionPackage } = require("./review_decision_package");
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

function byCandidate(items, candidateId) {
  return items.filter((item) => item.candidate_id === candidateId);
}

function firstByCandidate(items, candidateId) {
  return byCandidate(items, candidateId)[0] || null;
}

function finalRouteFor(evidence, productionBlocker, memoryBlockers, exclusion) {
  if (memoryBlockers.length > 0) return "reject_memory_forbidden_never_production";
  if (exclusion) return "reject_failure_learning_only_never_production";
  if (productionBlocker?.blocker_type === "human_review_required") {
    return "pass_draft_only_pending_human_review";
  }
  return "blocked_pending_required_review";
}

function buildCandidateArbitration(evidenceBlockerContract, evidence) {
  const blockers = byCandidate(evidenceBlockerContract.blocker_decisions || [], evidence.candidate_id);
  const productionBlocker =
    blockers.find((item) => item.blocking_scope === "production_promotion") || null;
  const memoryBlockers = blockers.filter((item) => item.blocking_scope === "memory_promotion");
  const productionExclusion = firstByCandidate(
    evidenceBlockerContract.production_exclusion_register || [],
    evidence.candidate_id
  );
  const memoryForbidden = memoryBlockers.length > 0 || evidence.memory_allowed === false;
  const neverProduction = Boolean(productionExclusion);

  return {
    candidate_id: evidence.candidate_id,
    shot_id: evidence.shot_id,
    review_outcome: evidence.review_outcome,
    evidence_record_id: evidence.evidence_record_id,
    evidence_codes: evidence.evidence_codes,
    pass_reasons: evidence.pass_reasons,
    reject_reasons: evidence.reject_reasons,
    production_blocker_decision_id: productionBlocker?.blocker_decision_id || null,
    memory_blocker_decision_ids: memoryBlockers.map((item) => item.blocker_decision_id),
    production_exclusion_record_id: productionExclusion?.exclusion_record_id || null,
    final_route: finalRouteFor(evidence, productionBlocker, memoryBlockers, productionExclusion),
    production_decision: neverProduction ? "block_permanently" : "block_until_human_review",
    production_promotion_allowed_now: false,
    production_candidate_created: false,
    never_production: neverProduction,
    memory_decision: memoryForbidden ? "block_memory_entry" : "block_until_human_memory_approval",
    memory_draft_allowed: memoryForbidden === false && evidence.memory_allowed === true,
    memory_entry_allowed_now: false,
    memory_forbidden: memoryForbidden,
    accepted_samples_write_performed: false,
    direct_memory_write_performed: false,
    blocker_count: blockers.length,
    hard_block_count: blockers.filter((item) => item.permanent_block === true).length,
    requires_human_review: true,
  };
}

function buildReviewBlockerArbiter(evidenceBlockerContract) {
  const candidateArbitrations = (evidenceBlockerContract.evidence_records || []).map((evidence) =>
    buildCandidateArbitration(evidenceBlockerContract, evidence)
  );
  const memoryForbidden = candidateArbitrations.filter((item) => item.memory_forbidden);
  const neverProduction = candidateArbitrations.filter((item) => item.never_production);
  const rejected = candidateArbitrations.filter((item) => item.review_outcome === "reject");
  const passed = candidateArbitrations.filter((item) => item.review_outcome === "pass");
  const productionBlocked = candidateArbitrations.filter(
    (item) => item.production_promotion_allowed_now === false
  );
  const humanReviewRequired = candidateArbitrations.filter((item) => item.requires_human_review);
  const permanentBlocks = candidateArbitrations.filter((item) => item.hard_block_count > 0);

  return {
    review_blocker_arbiter_version: "v1",
    arbiter_id: `review_blocker_arbiter_${evidenceBlockerContract.task_id}`,
    source_evidence_blocker_contract_id: evidenceBlockerContract.contract_id,
    source_decision_package_id: evidenceBlockerContract.source_decision_package_id,
    source_protocol_id: evidenceBlockerContract.source_protocol_id,
    source_kernel_run_id: evidenceBlockerContract.source_kernel_run_id,
    task_id: evidenceBlockerContract.task_id,
    status: "completed_local_blocker_arbiter",
    mode: "local_stdout_only_blocker_arbiter",
    candidate_arbitrations: candidateArbitrations,
    arbiter_summary: {
      candidate_count: candidateArbitrations.length,
      passed_candidate_count: passed.length,
      rejected_candidate_count: rejected.length,
      memory_draft_candidate_count: candidateArbitrations.filter((item) => item.memory_draft_allowed).length,
      memory_forbidden_count: memoryForbidden.length,
      never_production_count: neverProduction.length,
      production_blocked_count: productionBlocked.length,
      permanent_block_count: permanentBlocks.length,
      human_review_required_count: humanReviewRequired.length,
      all_production_blocked: productionBlocked.length === candidateArbitrations.length,
      all_writes_blocked: true,
      direct_memory_write_performed: false,
      production_candidate_created: false,
      accepted_samples_write_performed: false,
    },
    promotion_guard: {
      evidence_required_for_every_candidate:
        candidateArbitrations.length === evidenceBlockerContract.evidence_records.length,
      blocker_required_for_every_candidate: candidateArbitrations.every((item) => item.blocker_count > 0),
      memory_forbidden_prevents_memory: memoryForbidden.every(
        (item) => item.memory_entry_allowed_now === false && item.memory_draft_allowed === false
      ),
      never_production_prevents_production: neverProduction.every(
        (item) => item.production_promotion_allowed_now === false && item.production_candidate_created === false
      ),
      pass_is_not_production_approval: true,
      human_review_required_before_production: true,
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
      "Usage: node kernel/review_blocker_arbiter.js --input tests/schema_examples/review_result_protocol_input.example.json",
      "",
      "Reads a repository-local review-result protocol fixture and emits a local blocker arbiter verdict to stdout.",
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
  const arbiter = buildReviewBlockerArbiter(evidenceBlockerContract);
  process.stdout.write(`${JSON.stringify(arbiter, null, 2)}\n`);
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
  buildReviewBlockerArbiter,
};
