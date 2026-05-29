#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const {
  validateReviewDecisionRecord,
  normalizeRepoRelativePath,
} = require("./review_decision_record_v1");

const repoRoot = path.resolve(__dirname, "../..");
const helperId = "review_draft_registry_v1";
const registrySchema = "review_draft_registry_record.v1";

const draftTypeByDecision = Object.freeze({
  accept_sample_draft: "accepted_sample_draft",
  reject_sample_draft: "rejected_sample_draft",
  request_rework: "rework_sample_draft",
  invalid_artifact: "rejected_sample_draft",
  provider_link_success_evidence_only: "no_registry_draft",
});

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
  source_image_moved_or_copied: false,
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

function sanitizeId(value) {
  assertString(value, "id");
  const safe = value.replace(/[^A-Za-z0-9_-]+/g, "_").replace(/^_+|_+$/g, "");
  if (!safe) throw new Error("id must contain at least one safe character");
  return safe;
}

function buildDraftId(decisionRecord, draftType) {
  return `${draftType}_${sanitizeId(decisionRecord.decision_id)}`;
}

function validateDraftableDecisionRecord(decisionRecord) {
  validateReviewDecisionRecord(decisionRecord);
  if (decisionRecord.decision !== "provider_link_success_evidence_only") {
    assertString(decisionRecord.artifact_sha256, "review_decision_record.artifact_sha256");
  }
}

function buildReviewDraftRegistryRecord(decisionRecord) {
  validateDraftableDecisionRecord(decisionRecord);
  const draftType = draftTypeByDecision[decisionRecord.decision];
  if (!draftType) {
    throw new Error("decision cannot be mapped to draft registry");
  }
  const createsDraft = draftType !== "no_registry_draft";
  const record = {
    schema: registrySchema,
    helper_id: helperId,
    draft_id: buildDraftId(decisionRecord, draftType),
    draft_type: draftType,
    source_decision_id: decisionRecord.decision_id,
    source_decision: decisionRecord.decision,
    artifact_record_ref: decisionRecord.artifact_record_ref,
    artifact_sha256: decisionRecord.artifact_sha256,
    artifact_dimensions: decisionRecord.artifact_dimensions,
    audit_receipt_ref: decisionRecord.audit_receipt_ref,
    review_decision_ref: decisionRecord.source_review_session_ref,
    reviewer_note_ref: decisionRecord.source_review_session_ref,
    production_candidate: false,
    production_candidate_write_performed: false,
    accepted_samples_write_performed: false,
    memory_write_performed: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false,
    metadata_only: true,
    image_binary_copied: false,
    image_binary_read_performed: false,
    source_image_moved_or_copied: false,
    formal_registry_write_performed: false,
    created_at: decisionRecord.created_at,
    route_summary: {
      accepted_draft_created: decisionRecord.decision === "accept_sample_draft",
      rejected_draft_created: decisionRecord.decision === "reject_sample_draft" || decisionRecord.decision === "invalid_artifact",
      rework_draft_created: decisionRecord.decision === "request_rework",
      no_registry_draft_reason: createsDraft ? null : "provider_link_success_evidence_only",
    },
    side_effect_flags: { ...cleanSideEffectFlags },
  };
  validateReviewDraftRegistryRecord(record);
  return record;
}

function validateReviewDraftRegistryRecord(record) {
  assertObject(record, "review_draft_registry_record");
  if (record.schema !== registrySchema) {
    throw new Error("review_draft_registry_record schema mismatch");
  }
  [
    "draft_id",
    "draft_type",
    "source_decision_id",
    "source_decision",
    "artifact_record_ref",
    "audit_receipt_ref",
    "created_at",
  ].forEach((field) => assertString(record[field], `review_draft_registry_record.${field}`));
  if (!Object.values(draftTypeByDecision).includes(record.draft_type)) {
    throw new Error("draft_type is not allowed");
  }
  if (record.draft_type !== "no_registry_draft") {
    assertString(record.artifact_sha256, "review_draft_registry_record.artifact_sha256");
  }
  assertFalse(record.production_candidate, "review_draft_registry_record.production_candidate");
  assertFalse(record.production_candidate_write_performed, "review_draft_registry_record.production_candidate_write_performed");
  assertFalse(record.accepted_samples_write_performed, "review_draft_registry_record.accepted_samples_write_performed");
  assertFalse(record.memory_write_performed, "review_draft_registry_record.memory_write_performed");
  assertFalse(record.DailyNote_write_performed, "review_draft_registry_record.DailyNote_write_performed");
  assertFalse(record.VCP_memory_write_performed, "review_draft_registry_record.VCP_memory_write_performed");
  assertFalse(record.image_binary_copied, "review_draft_registry_record.image_binary_copied");
  assertFalse(record.image_binary_read_performed, "review_draft_registry_record.image_binary_read_performed");
  assertFalse(record.source_image_moved_or_copied, "review_draft_registry_record.source_image_moved_or_copied");
  assertFalse(record.formal_registry_write_performed, "review_draft_registry_record.formal_registry_write_performed");
  Object.entries(record.side_effect_flags || {}).forEach(([field, value]) => {
    assertFalse(value, `review_draft_registry_record.side_effect_flags.${field}`);
  });
  return true;
}

function draftOutputPath(record, outputDir) {
  validateReviewDraftRegistryRecord(record);
  const baseDir = outputDir || "review_console/draft_registry";
  const { normalized, resolved } = normalizeRepoRelativePath(baseDir, "outputDir");
  if (!normalized.startsWith("review_console/draft_registry/") && normalized !== "review_console/draft_registry") {
    throw new Error("outputDir must be under review_console/draft_registry");
  }
  return path.join(resolved, `${sanitizeId(record.draft_id)}.json`);
}

function writeReviewDraftRegistryRecord(record, options = {}) {
  const outputPath = draftOutputPath(record, options.outputDir);
  if (fs.existsSync(outputPath) && options.overwrite !== true) {
    throw new Error("review draft registry record already exists and overwrite is not allowed");
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
  const args = { write: false, output_dir: null };
  for (let index = 0; index < argv.length; index += 1) {
    const item = argv[index];
    if (item === "--decision-record") args.decision_record = argv[++index];
    else if (item === "--output-dir") args.output_dir = argv[++index];
    else if (item === "--write") args.write = true;
    else if (item === "--help") args.help = true;
    else throw new Error(`Unknown argument: ${item}`);
  }
  return args;
}

function printHelp() {
  process.stdout.write([
    "Usage: node adapters/runtime/review_draft_registry_v1.js --decision-record review_console/review_decisions/<run>/decision_record.json",
    "",
    "Builds a metadata-only accepted/rejected/rework draft registry record from review_decision_record.v1.",
    "Use --write --output-dir review_console/draft_registry/<run_id> to persist locally.",
  ].join("\n") + "\n");
}

function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  if (args.help) {
    printHelp();
    return;
  }
  if (!args.decision_record) {
    throw new Error("--decision-record is required");
  }
  const { resolved } = normalizeRepoRelativePath(args.decision_record, "--decision-record");
  const decisionRecord = JSON.parse(fs.readFileSync(resolved, "utf8"));
  const record = buildReviewDraftRegistryRecord(decisionRecord);
  const output = args.write
    ? { record, write_result: writeReviewDraftRegistryRecord(record, { outputDir: args.output_dir }) }
    : { record, write_result: null };
  process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
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
  helperId,
  registrySchema,
  draftTypeByDecision,
  cleanSideEffectFlags,
  buildReviewDraftRegistryRecord,
  validateReviewDraftRegistryRecord,
  writeReviewDraftRegistryRecord,
};
