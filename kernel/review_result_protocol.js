#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { buildKernelRun, loadInput } = require("./pvos_kernel");

const repoRoot = path.resolve(__dirname, "..");
const defaultInputPath = "tests/schema_examples/review_result_protocol_input.example.json";

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

const memoryForbiddenBlockCodes = Object.freeze([
  "unknown_failure_tags_present",
  "private_path_included",
  "provider_payload_included",
  "image_binary_included",
  "external_manifest_included",
  "artifact_refs_not_metadata_only",
  "artifact_ref_not_metadata_only",
]);

function assertObject(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${label} must be an object`);
  }
}

function assertString(value, label) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${label} must be a non-empty string`);
  }
}

function resolveProtocolInputPath(inputPath) {
  assertString(inputPath, "input path");
  if (path.isAbsolute(inputPath) || /^[A-Za-z]:[\\/]/.test(inputPath)) {
    throw new Error("input path must be repository-relative");
  }
  const normalized = inputPath.replace(/\\/g, "/");
  if (!normalized.startsWith("tests/schema_examples/") || normalized.includes("..")) {
    throw new Error("input path must stay under tests/schema_examples/");
  }
  const resolved = path.resolve(repoRoot, normalized);
  const relative = path.relative(repoRoot, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error("input path escapes repository root");
  }
  return resolved;
}

function loadProtocolInput(inputPath) {
  const resolved = resolveProtocolInputPath(inputPath);
  const input = JSON.parse(fs.readFileSync(resolved, "utf8"));
  return normalizeProtocolInput(input);
}

function normalizeProtocolInput(input) {
  assertObject(input, "protocol input");
  assertString(input.review_result_protocol_input_version, "protocol input version");
  assertString(input.protocol_id, "protocol_id");
  assertString(input.kernel_input_ref, "kernel_input_ref");
  assertObject(input.human_review, "human_review");
  assertObject(input.memory_policy, "memory_policy");
  assertObject(input.production_policy, "production_policy");
  if (input.memory_policy.direct_daily_note_write_allowed !== false) {
    throw new Error("memory_policy.direct_daily_note_write_allowed must be false");
  }
  if (input.memory_policy.direct_vcp_memory_write_allowed !== false) {
    throw new Error("memory_policy.direct_vcp_memory_write_allowed must be false");
  }
  if (input.production_policy.human_review_required !== true) {
    throw new Error("production_policy.human_review_required must be true");
  }
  return JSON.parse(JSON.stringify(input));
}

function getCandidateById(kernelRun, candidateId) {
  const candidate = kernelRun.image_candidates.find((item) => item.candidate_id === candidateId);
  if (!candidate) {
    throw new Error(`candidate decision references unknown candidate_id ${candidateId}`);
  }
  return candidate;
}

function getProvenanceBlockCodes(kernelRun) {
  const provenance = kernelRun.provenance_record || {};
  const blockCodes = [];
  if (provenance.provider_payload_included === true) blockCodes.push("provider_payload_included");
  if (provenance.image_binary_included === true) blockCodes.push("image_binary_included");
  if (provenance.private_path_included === true) blockCodes.push("private_path_included");
  if (provenance.external_manifest_included === true) blockCodes.push("external_manifest_included");
  if (provenance.artifact_refs_are_metadata_only !== true) blockCodes.push("artifact_refs_not_metadata_only");
  return blockCodes;
}

function getRubricThresholds(kernelRun) {
  const rubric = kernelRun.review_rubric || {};
  return {
    rubric_id: rubric.rubric_id || "unknown_rubric",
    accept_threshold: Number(rubric.accept_threshold),
    reject_below: Number(rubric.reject_below),
  };
}

function buildMemoryRoute(reviewOutcome, blockCodes, failureTags) {
  const forbiddenCodes = blockCodes.filter((code) => memoryForbiddenBlockCodes.includes(code));
  if (forbiddenCodes.length > 0) {
    return {
      route: "forbidden",
      allowed_to_enter_memory: false,
      memory_entry_type: "none",
      direct_daily_note_write_allowed: false,
      direct_vcp_memory_write_allowed: false,
      direct_write_performed: false,
      requires_human_memory_approval: true,
      reasons: [
        "sensitive_or_unmapped_material_must_not_enter_memory",
        `memory_forbidden_codes:${forbiddenCodes.join(",")}`,
        "memory_delta_requires_desensitized_chinese_summary",
      ],
    };
  }

  if (reviewOutcome === "pass") {
    return {
      route: "draft_memory_candidate",
      allowed_to_enter_memory: true,
      memory_entry_type: "memory_delta_draft",
      direct_daily_note_write_allowed: false,
      direct_vcp_memory_write_allowed: false,
      direct_write_performed: false,
      requires_human_memory_approval: true,
      reasons: [
        "candidate_passed_protocol_review",
        "only_desensitized_chinese_memory_delta_draft_allowed",
        "direct_memory_write_requires_separate_approval",
      ],
    };
  }

  return {
    route: "audit_only_failure_learning",
    allowed_to_enter_memory: true,
    memory_entry_type: "failure_lesson_draft",
    direct_daily_note_write_allowed: false,
    direct_vcp_memory_write_allowed: false,
    direct_write_performed: false,
    requires_human_memory_approval: true,
    reasons: [
      "rejected_candidate_can_only_be_preserved_as_failure_learning",
      `failure_tags:${failureTags.join(",")}`,
      "no_production_memory_promotion_allowed",
    ],
  };
}

function buildProductionRoute(reviewOutcome, permanentBlockCodes) {
  if (permanentBlockCodes.length > 0) {
    return {
      status: "never_production",
      allowed_for_production: false,
      production_candidate: false,
      human_review_required: true,
      permanent_block: true,
      never_production_codes: permanentBlockCodes,
      reasons: [
        "candidate_failed_hard_review_protocol",
        "rejected_or_sensitive_candidates_must_never_enter_production",
      ],
    };
  }

  if (reviewOutcome === "pass") {
    return {
      status: "blocked_until_human_review",
      allowed_for_production: false,
      production_candidate: false,
      human_review_required: true,
      permanent_block: false,
      never_production_codes: [],
      reasons: [
        "protocol_pass_is_not_human_production_approval",
        "production_requires_human_review_and_separate_promotion_gate",
      ],
    };
  }

  return {
    status: "not_production_revision_required",
    allowed_for_production: false,
    production_candidate: false,
    human_review_required: true,
    permanent_block: false,
    never_production_codes: [],
    reasons: [
      "candidate_did_not_pass_protocol_review",
      "revision_required_before_any_future_production_review",
    ],
  };
}

function buildCandidateReviewResult(decision, kernelRun) {
  const candidate = getCandidateById(kernelRun, decision.candidate_id);
  const thresholds = getRubricThresholds(kernelRun);
  const failureTags = Array.isArray(decision.failure_tags) ? decision.failure_tags : [];
  const unknownFailureTags = Array.isArray(decision.unknown_failure_tags) ? decision.unknown_failure_tags : [];
  const provenanceBlockCodes = getProvenanceBlockCodes(kernelRun);
  const artifactMetadataOnly = candidate.artifact_ref_kind === "metadata_only_reference";
  const weightedScore = Number(decision.weighted_score);
  const scoreMeetsAccept = weightedScore >= thresholds.accept_threshold;
  const scoreBelowReject = weightedScore < thresholds.reject_below;

  const rejectReasonCodes = [];
  if (!scoreMeetsAccept) rejectReasonCodes.push("weighted_score_below_accept_threshold");
  if (scoreBelowReject) rejectReasonCodes.push("weighted_score_below_reject_threshold");
  if (failureTags.length > 0) rejectReasonCodes.push("mapped_failure_tags_present");
  if (unknownFailureTags.length > 0) rejectReasonCodes.push("unknown_failure_tags_present");
  if (!artifactMetadataOnly) rejectReasonCodes.push("artifact_ref_not_metadata_only");
  rejectReasonCodes.push(...provenanceBlockCodes);

  const reviewOutcome = decision.accepted === true && rejectReasonCodes.length === 0 ? "pass" : "reject";
  const passReasons =
    reviewOutcome === "pass"
      ? [
          "weighted_score_meets_accept_threshold",
          "no_failure_tags_present",
          "metadata_only_artifact_reference",
          "provenance_is_metadata_only",
        ]
      : [];
  const rejectReasons =
    reviewOutcome === "reject"
      ? rejectReasonCodes.length > 0
        ? rejectReasonCodes
        : ["candidate_not_accepted_by_protocol"]
      : [];

  const permanentBlockCodes = [];
  if (scoreBelowReject) permanentBlockCodes.push("weighted_score_below_reject_threshold");
  if (failureTags.length > 0) permanentBlockCodes.push("mapped_failure_tags_present");
  if (unknownFailureTags.length > 0) permanentBlockCodes.push("unknown_failure_tags_present");
  if (!artifactMetadataOnly) permanentBlockCodes.push("artifact_ref_not_metadata_only");
  permanentBlockCodes.push(...provenanceBlockCodes);

  return {
    candidate_id: candidate.candidate_id,
    shot_id: candidate.shot_id,
    review_outcome: reviewOutcome,
    weighted_score: weightedScore,
    rubric_id: thresholds.rubric_id,
    accept_threshold: thresholds.accept_threshold,
    reject_below: thresholds.reject_below,
    pass_reasons: passReasons,
    reject_reasons: rejectReasons,
    reject_reason_codes: rejectReasons,
    failure_tags: failureTags,
    unknown_failure_tags: unknownFailureTags,
    evidence_summary: {
      artifact_ref_kind: candidate.artifact_ref_kind,
      observations: candidate.observations || [],
      rationale: decision.rationale,
    },
    memory_route: buildMemoryRoute(reviewOutcome, rejectReasonCodes, failureTags),
    production_route: buildProductionRoute(reviewOutcome, permanentBlockCodes),
  };
}

function buildReviewResultProtocolReport(protocolInput, kernelRun) {
  const candidateResults = kernelRun.visual_eval_decision.candidate_decisions.map((decision) =>
    buildCandidateReviewResult(decision, kernelRun)
  );
  const passCount = candidateResults.filter((result) => result.review_outcome === "pass").length;
  const rejectCount = candidateResults.filter((result) => result.review_outcome === "reject").length;
  const neverProductionCount = candidateResults.filter(
    (result) => result.production_route.status === "never_production"
  ).length;

  return {
    review_result_protocol_report_version: "v1",
    protocol_id: protocolInput.protocol_id,
    source_kernel_run_id: kernelRun.run_id,
    task_id: kernelRun.task_id,
    status: "completed_local_protocol_report",
    mode: "local_stdout_only_review_result_protocol",
    candidate_review_results: candidateResults,
    report_summary: {
      candidate_count: candidateResults.length,
      pass_count: passCount,
      reject_count: rejectCount,
      memory_draft_count: candidateResults.filter((result) => result.memory_route.allowed_to_enter_memory).length,
      never_production_count: neverProductionCount,
      direct_memory_write_performed: false,
      production_candidate_created: false,
    },
    review_protocol_guards: {
      every_candidate_has_review_outcome: candidateResults.every((result) => Boolean(result.review_outcome)),
      pass_requires_non_empty_pass_reasons: candidateResults
        .filter((result) => result.review_outcome === "pass")
        .every((result) => result.pass_reasons.length > 0),
      reject_requires_non_empty_reject_reasons: candidateResults
        .filter((result) => result.review_outcome === "reject")
        .every((result) => result.reject_reasons.length > 0),
      every_candidate_has_memory_route: candidateResults.every((result) => Boolean(result.memory_route.route)),
      every_candidate_has_production_route: candidateResults.every((result) =>
        Boolean(result.production_route.status)
      ),
      direct_daily_note_write_performed: false,
      direct_vcp_memory_write_performed: false,
      production_candidate_created: false,
    },
    no_execution_guard: noExecutionGuard,
  };
}

function parseArgs(argv) {
  const args = { input: defaultInputPath };
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
    if (token === "--help" || token === "-h") {
      args.help = true;
      continue;
    }
    throw new Error(`unknown argument: ${token}`);
  }
  return args;
}

function printHelp() {
  process.stdout.write(
    [
      "Usage: node kernel/review_result_protocol.js --input tests/schema_examples/review_result_protocol_input.example.json",
      "",
      "Reads a repository-local review-result protocol fixture, builds the local PVOS kernel run,",
      "and emits a hard pass/reject/memory/production routing report to stdout.",
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
  const report = buildReviewResultProtocolReport(protocolInput, kernelRun);
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
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
  buildCandidateReviewResult,
  buildReviewResultProtocolReport,
  loadProtocolInput,
  normalizeProtocolInput,
  parseArgs,
  resolveProtocolInputPath,
};
