#!/usr/bin/env node
"use strict";

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
  external_manifest_read_allowed: false,
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  daily_note_write_performed: false,
  vcp_memory_write_performed: false,
  image_generation_performed: false,
  output_file_write_performed: false,
  accepted_samples_write_performed: false,
  external_manifest_read_performed: false,
  vcpchat_source_read_performed: false,
  vcptoolbox_source_read_performed: false,
});

function memorySummaryFor(candidate) {
  if (candidate.memory_route.route === "draft_memory_candidate") {
    return "候选图通过本地审片协议，只能生成待人工审批的中文记忆草案，不能直接写入 DailyNote 或 VCP 记忆。";
  }
  if (candidate.memory_route.route === "audit_only_failure_learning") {
    return "候选图未通过本地审片协议，只能作为失败学习草案保留，不能进入 production 记忆。";
  }
  return "候选图包含未映射或敏感风险，只能留在审计中，不得进入长期记忆。";
}

function buildMemoryDeltaDraft(candidate) {
  return {
    memory_delta_id: `memory_delta_${candidate.candidate_id}`,
    candidate_id: candidate.candidate_id,
    shot_id: candidate.shot_id,
    status: "draft",
    language: "zh-CN",
    route: candidate.memory_route.route,
    memory_entry_type: candidate.memory_route.memory_entry_type,
    allowed_to_enter_memory: true,
    direct_daily_note_write_allowed: false,
    direct_vcp_memory_write_allowed: false,
    direct_write_performed: false,
    requires_human_memory_approval: true,
    summary_zh: memorySummaryFor(candidate),
    reasons: candidate.memory_route.reasons,
  };
}

function buildMemoryForbiddenRecord(candidate) {
  return {
    candidate_id: candidate.candidate_id,
    shot_id: candidate.shot_id,
    route: "forbidden",
    allowed_to_enter_memory: false,
    direct_write_performed: false,
    requires_human_memory_approval: true,
    reasons: candidate.memory_route.reasons,
  };
}

function buildAcceptedSampleDraft(candidate) {
  return {
    accepted_sample_id: `accepted_${candidate.candidate_id}`,
    candidate_id: candidate.candidate_id,
    shot_id: candidate.shot_id,
    review_outcome: candidate.review_outcome,
    pass_reasons: candidate.pass_reasons,
    write_performed: false,
    production_candidate: false,
    production_status: candidate.production_route.status,
    memory_route: candidate.memory_route.route,
  };
}

function buildRejectedSampleDraft(candidate) {
  return {
    rejected_sample_id: `rejected_${candidate.candidate_id}`,
    candidate_id: candidate.candidate_id,
    shot_id: candidate.shot_id,
    review_outcome: candidate.review_outcome,
    reject_reasons: candidate.reject_reasons,
    failure_tags: candidate.failure_tags,
    unknown_failure_tags: candidate.unknown_failure_tags,
    write_performed: false,
    production_candidate: false,
    production_status: candidate.production_route.status,
    memory_route: candidate.memory_route.route,
  };
}

function buildProductionExclusion(candidate) {
  return {
    candidate_id: candidate.candidate_id,
    shot_id: candidate.shot_id,
    status: "never_production",
    permanent_block: true,
    production_candidate: false,
    never_production_codes: candidate.production_route.never_production_codes,
    reasons: candidate.production_route.reasons,
  };
}

function buildReviewDecisionPackage(protocolReport) {
  const candidates = protocolReport.candidate_review_results || [];
  const accepted = candidates.filter((candidate) => candidate.review_outcome === "pass");
  const rejected = candidates.filter((candidate) => candidate.review_outcome === "reject");
  const memoryAllowed = candidates.filter((candidate) => candidate.memory_route.allowed_to_enter_memory === true);
  const memoryForbidden = candidates.filter((candidate) => candidate.memory_route.allowed_to_enter_memory === false);
  const neverProduction = candidates.filter((candidate) => candidate.production_route.status === "never_production");

  return {
    review_decision_package_version: "v1",
    package_id: `review_decision_package_${protocolReport.task_id}`,
    source_protocol_id: protocolReport.protocol_id,
    source_kernel_run_id: protocolReport.source_kernel_run_id,
    task_id: protocolReport.task_id,
    status: "completed_local_decision_package",
    mode: "local_stdout_only_review_decision_package",
    candidate_decision_records: candidates.map((candidate) => ({
      candidate_id: candidate.candidate_id,
      shot_id: candidate.shot_id,
      review_outcome: candidate.review_outcome,
      pass_reasons: candidate.pass_reasons,
      reject_reasons: candidate.reject_reasons,
      memory_route: candidate.memory_route,
      production_route: candidate.production_route,
    })),
    accepted_sample_drafts: accepted.map(buildAcceptedSampleDraft),
    rejected_sample_drafts: rejected.map(buildRejectedSampleDraft),
    memory_delta_drafts: memoryAllowed.map(buildMemoryDeltaDraft),
    memory_forbidden_records: memoryForbidden.map(buildMemoryForbiddenRecord),
    production_exclusion_register: neverProduction.map(buildProductionExclusion),
    decision_summary: {
      candidate_count: candidates.length,
      pass_count: accepted.length,
      reject_count: rejected.length,
      accepted_sample_draft_count: accepted.length,
      rejected_sample_draft_count: rejected.length,
      memory_delta_draft_count: memoryAllowed.length,
      memory_forbidden_count: memoryForbidden.length,
      never_production_count: neverProduction.length,
      direct_memory_write_performed: false,
      production_candidate_created: false,
      accepted_samples_write_performed: false,
    },
    promotion_guard: {
      protocol_pass_is_not_production_approval: true,
      every_never_production_candidate_blocked: neverProduction.every(
        (candidate) =>
          candidate.production_route.production_candidate === false &&
          candidate.production_route.permanent_block === true
      ),
      production_candidate_creation_allowed: false,
      production_candidate_created: false,
      memory_write_allowed_without_human_approval: false,
      direct_memory_write_performed: false,
    },
    no_execution_guard: noExecutionGuard,
  };
}

function printHelp() {
  process.stdout.write(
    [
      "Usage: node kernel/review_decision_package.js --input tests/schema_examples/review_result_protocol_input.example.json",
      "",
      "Reads a repository-local review-result protocol fixture and emits a local decision package to stdout.",
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
  process.stdout.write(`${JSON.stringify(decisionPackage, null, 2)}\n`);
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
  buildReviewDecisionPackage,
};
