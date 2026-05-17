#!/usr/bin/env node
"use strict";

const { buildAdapterResponse } = require("../adapters/pvos_kernel_dry_run_adapter");
const { loadInput } = require("./pvos_kernel");
const { loadProtocolInput } = require("./review_result_protocol");

const defaultInputPath = "tests/schema_examples/pvos_kernel_input.example.json";
const defaultProtocolInputPath = "tests/schema_examples/review_result_protocol_input.example.json";

const approvedFixturePairs = Object.freeze([
  Object.freeze({
    input: defaultInputPath,
    protocolInput: defaultProtocolInputPath,
    fixture_status: "approved_local_fixture",
  }),
  Object.freeze({
    input: "tests/schema_examples/pvos_kernel_negative_guard_input.example.json",
    protocolInput:
      "tests/schema_examples/review_result_protocol_negative_guard_input.example.json",
    fixture_status: "approved_local_negative_guard_fixture",
  }),
]);

function normalizeRef(ref) {
  return String(ref || "").replace(/\\/g, "/");
}

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

function getApprovedFixturePair(inputRef, protocolInputRef) {
  const normalizedInput = normalizeRef(inputRef);
  const normalizedProtocolInput = normalizeRef(protocolInputRef);
  return approvedFixturePairs.find(
    (pair) =>
      pair.input === normalizedInput && pair.protocolInput === normalizedProtocolInput
  );
}

function assertApprovedFixturePair(inputRef, protocolInputRef) {
  const pair = getApprovedFixturePair(inputRef, protocolInputRef);
  if (!pair) {
    throw new Error(
      "pipeline only accepts approved repository-local PVOS fixture pairs"
    );
  }
  return pair;
}

function extractCandidateIds(records) {
  return records.map((record) => record.candidate_id);
}

function buildEvidenceCollectorBlockerPipeline(input, protocolInput, options = {}) {
  const inputRef = normalizeRef(options.inputRef || defaultInputPath);
  const protocolInputRef = normalizeRef(
    options.protocolInputRef || defaultProtocolInputPath
  );
  const fixturePair = assertApprovedFixturePair(inputRef, protocolInputRef);

  if (normalizeRef(protocolInput.kernel_input_ref) !== inputRef) {
    throw new Error("protocol input kernel_input_ref must match pipeline input");
  }

  const adapterResponse = buildAdapterResponse(input, protocolInput);
  const evidenceBlocker = adapterResponse.evidence_blocker_contract;
  const arbiter = adapterResponse.review_blocker_arbiter;
  const reviewReport = adapterResponse.review_report_contract;
  const decisionPackage = adapterResponse.review_decision_package;
  const reviewConsoleHandoff = adapterResponse.review_console_handoff_draft;
  const evidenceRecords = evidenceBlocker.evidence_records || [];
  const blockerDecisions = evidenceBlocker.blocker_decisions || [];
  const memoryDeltaDrafts = decisionPackage.memory_delta_drafts || [];
  const productionExclusionDrafts =
    decisionPackage.production_exclusion_register || [];

  return {
    pvos_evidence_collector_blocker_pipeline_version: "v1",
    pipeline_id: `pvos_evidence_collector_blocker_pipeline_${adapterResponse.kernel_run.task_id}`,
    source_adapter_id: adapterResponse.adapter_id,
    source_kernel_run_id: adapterResponse.kernel_run.run_id,
    source_protocol_id: adapterResponse.review_result_protocol_report.protocol_id,
    source_decision_package_id: decisionPackage.package_id,
    source_evidence_blocker_contract_id: evidenceBlocker.contract_id,
    source_review_blocker_arbiter_id: arbiter.arbiter_id,
    source_review_report_id: reviewReport.review_report_id,
    task_id: adapterResponse.kernel_run.task_id,
    status: "completed_local_pipeline_draft",
    mode: "local_stdout_only_evidence_collector_blocker_pipeline",
    fixture_approval: {
      source: "project_schema_examples_allowlist",
      fixture_status: fixturePair.fixture_status,
      approved_local_fixture: true,
      input_ref: inputRef,
      protocol_input_ref: protocolInputRef,
      allowed_fixture_pair: true,
      provider_payload_included: false,
      image_binary_included: false,
      private_path_included: false,
    },
    outputs: {
      evidence_records: evidenceRecords,
      blocker_decisions: blockerDecisions,
      review_report: reviewReport,
      memory_delta_drafts: memoryDeltaDrafts,
      production_exclusion_drafts: productionExclusionDrafts,
    },
    output_refs: {
      evidence_record_ids: evidenceRecords.map((record) => record.evidence_record_id),
      blocker_decision_ids: blockerDecisions.map(
        (decision) => decision.blocker_decision_id
      ),
      review_report_id: reviewReport.review_report_id,
      memory_delta_ids: memoryDeltaDrafts.map((draft) => draft.memory_delta_id),
      production_exclusion_record_ids: productionExclusionDrafts.map(
        (record) => record.exclusion_record_id || `production_exclusion_${record.candidate_id}`
      ),
      production_exclusion_candidate_ids:
        extractCandidateIds(productionExclusionDrafts),
      memory_forbidden_candidate_ids:
        adapterResponse.review_report_handoff_draft.memory_forbidden_candidate_ids,
      never_production_candidate_ids:
        adapterResponse.review_report_handoff_draft.never_production_candidate_ids,
    },
    review_console_handoff_draft: {
      handoff_id: `pvos_evidence_collector_blocker_pipeline_handoff_${adapterResponse.kernel_run.task_id}`,
      source_review_console_handoff_id: reviewConsoleHandoff.review_session_id,
      display_only: true,
      status: "draft_ready",
      evidence_blocker_contract_attached: true,
      review_blocker_arbiter_attached: true,
      review_report_contract_attached: true,
      memory_delta_drafts_attached: true,
      production_exclusion_drafts_attached: true,
      allowed_actions: reviewConsoleHandoff.allowed_actions,
      forbidden_actions: reviewConsoleHandoff.forbidden_actions,
      guard_summary: {
        evidence_record_count: evidenceRecords.length,
        blocker_decision_count: blockerDecisions.length,
        review_report_item_count: reviewReport.report_items.length,
        memory_delta_draft_count: memoryDeltaDrafts.length,
        production_exclusion_draft_count: productionExclusionDrafts.length,
        all_candidates_have_evidence_record:
          reviewReport.report_summary.all_candidates_have_evidence_record,
        all_candidates_have_blocker_decision:
          reviewReport.report_summary.all_candidates_have_blocker_decision,
        all_memory_writes_blocked:
          reviewReport.report_summary.all_memory_writes_blocked,
        all_production_writes_blocked:
          reviewReport.report_summary.all_production_writes_blocked,
        all_provider_execution_blocked:
          reviewReport.report_summary.all_provider_execution_blocked,
        production_candidate_created: false,
        direct_memory_write_performed: false,
        daily_note_write_performed: false,
        vcp_memory_write_performed: false,
        accepted_samples_write_performed: false,
      },
    },
    pipeline_summary: {
      candidate_count: reviewReport.report_summary.candidate_count,
      evidence_record_count: evidenceRecords.length,
      blocker_decision_count: blockerDecisions.length,
      review_report_item_count: reviewReport.report_items.length,
      memory_delta_draft_count: memoryDeltaDrafts.length,
      production_exclusion_draft_count: productionExclusionDrafts.length,
      memory_forbidden_count:
        adapterResponse.review_report_handoff_draft.memory_forbidden_candidate_ids
          .length,
      never_production_count: reviewReport.report_summary.never_production_count,
      no_memory_entry_allowed_now:
        reviewReport.report_summary.memory_entry_allowed_now_count === 0,
      no_production_promotion_allowed_now:
        reviewReport.report_summary.production_promotion_allowed_now_count === 0,
      all_outputs_are_drafts: true,
      stdout_only: true,
      local_only: true,
    },
    no_execution_guard: adapterResponse.no_execution_guard,
  };
}

function printHelp() {
  process.stdout.write(
    [
      "Usage: node kernel/pvos_evidence_collector_blocker_pipeline.js --input tests/schema_examples/pvos_kernel_input.example.json",
      "       node kernel/pvos_evidence_collector_blocker_pipeline.js --protocol-input tests/schema_examples/review_result_protocol_input.example.json",
      "",
      "Builds the minimal local PVOS evidence collector + blocker arbiter pipeline from approved repository fixtures.",
      "It writes JSON to stdout only and performs no provider, plugin, API, image, memory, DailyNote, production, or output-file action.",
    ].join("\n") + "\n"
  );
}

function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  if (args.help) {
    printHelp();
    return;
  }
  const inputRef = normalizeRef(args.input);
  const protocolInputRef = normalizeRef(args.protocolInput);
  assertApprovedFixturePair(inputRef, protocolInputRef);
  const input = loadInput(inputRef);
  const protocolInput = loadProtocolInput(protocolInputRef);
  const response = buildEvidenceCollectorBlockerPipeline(input, protocolInput, {
    inputRef,
    protocolInputRef,
  });
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
  approvedFixturePairs,
  assertApprovedFixturePair,
  buildEvidenceCollectorBlockerPipeline,
  parseArgs,
};
