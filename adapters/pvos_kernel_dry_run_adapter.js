#!/usr/bin/env node
"use strict";

const { buildKernelRun, loadInput } = require("../kernel/pvos_kernel");
const {
  buildReviewResultProtocolReport,
  loadProtocolInput,
} = require("../kernel/review_result_protocol");

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

function buildAdapterResponse(input, protocolInput) {
  const kernelRun = buildKernelRun(input);
  const protocolReport = buildReviewResultProtocolReport(protocolInput, kernelRun);
  const protocolHandoff = buildProtocolHandoff(protocolReport);
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
