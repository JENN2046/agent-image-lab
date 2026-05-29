#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "../..");
const defaultInputPath = "tests/fixtures/runtime_kernel_v1_no_provider_fixture_task.fixture.json";
const recordSchema = "review_decision_record.v1";
const helperId = "review_decision_record_v1";
const allowedDecisions = Object.freeze([
  "accept_sample_draft",
  "reject_sample_draft",
  "request_rework",
  "provider_link_success_evidence_only",
  "invalid_artifact",
]);

const cleanSideEffectFlags = Object.freeze({
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  image_generation_performed: false,
  image_binary_read_performed: false,
  file_write_performed: false,
  accepted_samples_write_performed: false,
  production_candidate_write_performed: false,
  DailyNote_write_performed: false,
  VCP_memory_write_performed: false,
  memory_write_performed: false,
  secret_value_read_performed: false,
  push_tag_release_deploy_performed: false,
});

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

function assertFalse(value, label) {
  if (value === true) {
    throw new Error(`${label} must be false`);
  }
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function sanitizeId(value) {
  assertString(value, "id");
  const safe = value.replace(/[^A-Za-z0-9_-]+/g, "_").replace(/^_+|_+$/g, "");
  if (!safe) throw new Error("id must contain at least one safe character");
  return safe;
}

function normalizeRepoRelativePath(value, label) {
  assertString(value, label);
  if (path.isAbsolute(value)) {
    throw new Error(`${label} must be a repository-relative path`);
  }
  const normalized = value.replace(/\\/g, "/");
  if (normalized.split("/").includes("..")) {
    throw new Error(`${label} must not contain traversal segments`);
  }
  const resolved = path.resolve(repoRoot, normalized);
  const relative = path.relative(repoRoot, resolved).replace(/\\/g, "/");
  if (relative.startsWith("../") || relative === ".." || path.isAbsolute(relative)) {
    throw new Error(`${label} escapes repository root`);
  }
  return { normalized: relative, resolved };
}

function validateDecisionEnum(decision) {
  assertString(decision, "decision");
  if (!allowedDecisions.includes(decision)) {
    throw new Error(`decision must be one of: ${allowedDecisions.join(", ")}`);
  }
}

function buildDecisionId({ artifactRecordRef, decision, createdAt }) {
  return `decision_${sanitizeId(`${artifactRecordRef}_${decision}_${createdAt}`)}`.slice(0, 180);
}

function buildReviewDecisionRecord(input) {
  assertObject(input, "review_decision_input");
  assertString(input.artifact_record_ref, "artifact_record_ref");
  assertString(input.audit_receipt_ref, "audit_receipt_ref");
  assertString(input.reviewer_note, "reviewer_note");
  validateDecisionEnum(input.decision);

  const createdAt = input.created_at || new Date().toISOString();
  assertString(createdAt, "created_at");
  const decisionId = input.decision_id || buildDecisionId({
    artifactRecordRef: input.artifact_record_ref,
    decision: input.decision,
    createdAt,
  });

  const record = {
    schema: recordSchema,
    helper_id: helperId,
    decision_id: decisionId,
    artifact_record_ref: input.artifact_record_ref,
    audit_receipt_ref: input.audit_receipt_ref,
    artifact_sha256: input.artifact_sha256 || null,
    artifact_dimensions: input.artifact_dimensions || null,
    source_review_session_ref: input.source_review_session_ref || null,
    reviewer_note: input.reviewer_note,
    decision: input.decision,
    production_candidate: false,
    memory_write_performed: false,
    accepted_samples_write_performed: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false,
    created_at: createdAt,
    metadata_only: true,
    image_binary_copied: false,
    image_binary_read_performed: false,
    source_image_moved_or_copied: false,
    formal_registry_write_performed: false,
    side_effect_flags: { ...cleanSideEffectFlags },
  };

  validateReviewDecisionRecord(record);
  return record;
}

function buildReviewDecisionRecordFromRuntimeV1Session(session, decisionInput) {
  assertObject(session, "runtime_v1_readonly_review_session");
  assertObject(session.display_fields, "runtime_v1_readonly_review_session.display_fields");
  return buildReviewDecisionRecord({
    artifact_record_ref: session.display_fields.artifact_record_ref,
    audit_receipt_ref: session.display_fields.audit_receipt_ref,
    artifact_sha256: session.display_fields.image_sha256,
    artifact_dimensions: session.display_fields.image_dimensions,
    source_review_session_ref: session.session_id,
    ...decisionInput,
  });
}

function buildRetry007EvidenceOnlyDecisionRecord({ receipt, reviewNote }) {
  assertObject(receipt, "retry_007_receipt");
  assertObject(reviewNote, "retry_007_review_note");
  if (reviewNote.decision !== "provider_link_success_evidence_only") {
    throw new Error("retry_007 review note must remain provider_link_success_evidence_only");
  }
  if (reviewNote.accepted_sample_candidate === true || reviewNote.production_candidate === true) {
    throw new Error("retry_007 review note must not be accepted or production");
  }

  return buildReviewDecisionRecord({
    decision_id: "decision_v0_6_73_retry_007_provider_link_success_evidence_only",
    artifact_record_ref: `${receipt.receipt_refs?.review_handoff || "review_console/live_receipt_bridge/v0_6_73_real_vcp_agent_generation_retry_007/bridge_entry.json"}#output_files[0]`,
    audit_receipt_ref: receipt.receipt_refs?.provider_receipt || "reports/provider_receipts/v0_6_73_real_vcp_agent_generation_retry_007_receipt.json",
    artifact_sha256: receipt.output_files?.[0]?.sha256 || receipt.image_files?.[0]?.sha256,
    artifact_dimensions: receipt.output_files?.[0]
      ? `${receipt.output_files[0].width}x${receipt.output_files[0].height}`
      : null,
    source_review_session_ref: "review_console/live_receipt_bridge/v0_6_73_real_vcp_agent_generation_retry_007/review_note.json",
    reviewer_note: reviewNote.human_review_summary_cn || reviewNote.notes,
    decision: "provider_link_success_evidence_only",
    created_at: reviewNote.reviewed_at,
  });
}

function validateReviewDecisionRecord(record) {
  assertObject(record, "review_decision_record");
  if (record.schema !== recordSchema) {
    throw new Error("review_decision_record schema mismatch");
  }
  [
    "decision_id",
    "artifact_record_ref",
    "audit_receipt_ref",
    "reviewer_note",
    "created_at",
  ].forEach((field) => assertString(record[field], `review_decision_record.${field}`));
  validateDecisionEnum(record.decision);
  assertFalse(record.production_candidate, "review_decision_record.production_candidate");
  assertFalse(record.memory_write_performed, "review_decision_record.memory_write_performed");
  assertFalse(record.accepted_samples_write_performed, "review_decision_record.accepted_samples_write_performed");
  assertFalse(record.DailyNote_write_performed, "review_decision_record.DailyNote_write_performed");
  assertFalse(record.VCP_memory_write_performed, "review_decision_record.VCP_memory_write_performed");
  assertFalse(record.image_binary_copied, "review_decision_record.image_binary_copied");
  assertFalse(record.image_binary_read_performed, "review_decision_record.image_binary_read_performed");
  assertFalse(record.source_image_moved_or_copied, "review_decision_record.source_image_moved_or_copied");
  assertFalse(record.formal_registry_write_performed, "review_decision_record.formal_registry_write_performed");

  const flags = record.side_effect_flags || {};
  for (const field of Object.keys(cleanSideEffectFlags)) {
    assertFalse(flags[field], `review_decision_record.side_effect_flags.${field}`);
  }
  return true;
}

function decisionOutputPath(record, outputDir) {
  validateReviewDecisionRecord(record);
  const baseDir = outputDir || "review_console/review_decisions";
  const { normalized, resolved } = normalizeRepoRelativePath(baseDir, "outputDir");
  if (!normalized.startsWith("review_console/review_decisions/") && normalized !== "review_console/review_decisions") {
    throw new Error("outputDir must be under review_console/review_decisions");
  }
  return path.join(resolved, `${sanitizeId(record.decision_id)}.json`);
}

function writeReviewDecisionRecord(record, options = {}) {
  const outputPath = decisionOutputPath(record, options.outputDir);
  if (fs.existsSync(outputPath) && options.overwrite !== true) {
    throw new Error("review decision record already exists and overwrite is not allowed");
  }
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(record, null, 2)}\n`, "utf8");
  return {
    output_path: path.relative(repoRoot, outputPath).replace(/\\/g, "/"),
    file_write_performed: true,
    metadata_only: true,
  };
}

function parseArgs(argv) {
  const args = {
    decision: "request_rework",
    reviewer_note: "Metadata-only local review decision record.",
    write: false,
    output_dir: null,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const item = argv[index];
    if (item === "--input") args.input = argv[++index];
    else if (item === "--decision") args.decision = argv[++index];
    else if (item === "--reviewer-note") args.reviewer_note = argv[++index];
    else if (item === "--created-at") args.created_at = argv[++index];
    else if (item === "--output-dir") args.output_dir = argv[++index];
    else if (item === "--write") args.write = true;
    else if (item === "--help") args.help = true;
    else throw new Error(`Unknown argument: ${item}`);
  }
  return args;
}

function printHelp() {
  process.stdout.write([
    "Usage: node adapters/runtime/review_decision_record_v1.js --input tests/fixtures/runtime_kernel_v1_no_provider_fixture_task.fixture.json --decision request_rework --reviewer-note \"...\"",
    "",
    "Builds a metadata-only review_decision_record.v1 from a runtime v1 readonly review session.",
    "Use --write --output-dir review_console/review_decisions/<run_id> to persist the JSON record locally.",
  ].join("\n") + "\n");
}

async function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  if (args.help) {
    printHelp();
    return;
  }
  const { runRuntimeKernelV1 } = require("../../kernel/runtime_kernel_v1_real_provider_guarded");
  const { buildRuntimeV1ReadonlyReviewSessionFromRuntimeResult } = require("./review_bridge_runtime_v1_readonly");
  const { resolved } = normalizeRepoRelativePath(args.input || defaultInputPath, "--input");
  const task = JSON.parse(fs.readFileSync(resolved, "utf8"));
  const runtimeResult = await runRuntimeKernelV1(task);
  const session = buildRuntimeV1ReadonlyReviewSessionFromRuntimeResult(runtimeResult);
  const record = buildReviewDecisionRecordFromRuntimeV1Session(session, {
    decision: args.decision,
    reviewer_note: args.reviewer_note,
    created_at: args.created_at,
  });
  const output = args.write
    ? { record, write_result: writeReviewDecisionRecord(record, { outputDir: args.output_dir }) }
    : { record, write_result: null };
  process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
}

if (require.main === module) {
  main().catch((error) => {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  });
}

module.exports = {
  recordSchema,
  helperId,
  allowedDecisions,
  cleanSideEffectFlags,
  buildReviewDecisionRecord,
  buildReviewDecisionRecordFromRuntimeV1Session,
  buildRetry007EvidenceOnlyDecisionRecord,
  validateReviewDecisionRecord,
  writeReviewDecisionRecord,
  normalizeRepoRelativePath,
};
