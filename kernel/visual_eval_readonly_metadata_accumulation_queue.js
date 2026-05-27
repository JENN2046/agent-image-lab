#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const defaultDrilldownPath = "tests/schema_examples/visual_eval_readonly_review_session_drilldown.example.json";
const defaultBridgePayloadPath = "tests/schema_examples/visual_eval_review_result_review_bridge_payload.example.json";
const defaultAccumulationContractPath = "tests/schema_examples/visual_eval_metadata_accumulation.example.json";
const guard = Object.freeze({
  metadata_only: true,
  read_only: true,
  display_only: true,
  file_write_performed: false,
  approval_write_performed: false,
  accepted_samples_write_performed: false,
  production_candidate_created: false,
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  image_generation_performed: false,
  DailyNote_write_performed: false,
  VCP_memory_write_performed: false,
  memory_write_performed: false,
  Batch_005_started: false,
  production_candidate_002_started: false,
});

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function repoPath(relativePath) {
  const resolved = path.resolve(repoRoot, relativePath);
  const relative = path.relative(repoRoot, resolved);
  assert(!relative.startsWith("..") && !path.isAbsolute(relative), `path escapes repository root: ${relativePath}`);
  return resolved;
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(repoPath(relativePath), "utf8"));
}

function hasAbsoluteOrLoopback(value) {
  if (typeof value === "string") {
    return /(?:[A-Za-z]:[\\/]|\\\\|file:\/\/\/?[A-Za-z]:[\\/]|<synthetic-windows-absolute-path>|(?:https?|wss?):\/\/(?:127\.0\.0\.1|localhost|\[::1\]|::1))/i.test(value);
  }
  if (Array.isArray(value)) return value.some((item) => hasAbsoluteOrLoopback(item));
  if (value && typeof value === "object") return Object.values(value).some((item) => hasAbsoluteOrLoopback(item));
  return false;
}

function buildQueueEntry(record, imageCase, sessionRow, selectedReviewResultId) {
  return {
    review_result_id: record.review_result_id,
    candidate_id: record.candidate_id,
    case_id: record.case_id,
    outcome: record.outcome,
    summary: sessionRow.summary,
    failure_tags: imageCase.failure_tags,
    accepted_metadata_action: record.metadata_accumulation.accepted_metadata_action,
    rejected_metadata_action: record.metadata_accumulation.rejected_metadata_action,
    archive_reference_action: record.metadata_accumulation.archive_reference_action,
    next_review_action: record.metadata_accumulation.next_review_action,
    write_allowed_now: record.write_allowed_now,
    selected: record.review_result_id === selectedReviewResultId,
  };
}

function ensureAllowedAction(contract, field, value) {
  const allowed = contract.allowed_actions?.[field] || [];
  assert(allowed.includes(value), `metadata accumulation action is not allowed: ${field}=${value}`);
}

function loadReadonlyMetadataAccumulationQueue(input) {
  const drilldownPath = (input?.drilldownPath || defaultDrilldownPath).replace(/\\/g, "/");
  const bridgePayloadPath = (input?.bridgePayloadPath || defaultBridgePayloadPath).replace(/\\/g, "/");
  const accumulationContractPath = (input?.accumulationContractPath || defaultAccumulationContractPath).replace(/\\/g, "/");
  const drilldown = input?.drilldown || readJson(drilldownPath);
  const bridgePayload = input?.bridgePayload || readJson(bridgePayloadPath);
  const accumulationContract = input?.accumulationContract || readJson(accumulationContractPath);

  assert(!hasAbsoluteOrLoopback({ drilldown, bridgePayload, accumulationContract }), "metadata accumulation queue sources must not expose absolute local paths or loopback URLs");
  assert(drilldown.drilldown_type === "metadata_only_visual_eval_readonly_review_session_drilldown", "session drilldown type mismatch");
  assert(bridgePayload.payload_type === "metadata_only_visual_eval_review_result_bridge_payload", "bridge payload type mismatch");
  assert(accumulationContract.artifact_type === "metadata_only_visual_eval_metadata_accumulation_contract", "metadata accumulation contract type mismatch");
  assert(drilldown.guard?.metadata_only === true && drilldown.guard?.read_only === true, "drilldown must remain metadata-only/read-only");
  assert(bridgePayload.guard?.metadata_only === true && bridgePayload.guard?.read_only === true, "bridge payload must remain metadata-only/read-only");

  const sessionRows = new Map((bridgePayload.review_session_draft?.review_rows || []).map((row) => [row.review_result_id, row]));
  const imageCases = new Map((bridgePayload.image_case_drafts || []).map((item) => [item.review_result_id, item]));
  const records = bridgePayload.metadata_accumulation_draft?.records || [];
  assert(records.length > 0, "metadata accumulation queue requires records");

  const entries = records.map((record) => {
    const sessionRow = sessionRows.get(record.review_result_id);
    const imageCase = imageCases.get(record.review_result_id);
    assert(sessionRow, `metadata record must resolve to session row: ${record.review_result_id}`);
    assert(imageCase, `metadata record must resolve to image case: ${record.review_result_id}`);
    assert(record.candidate_id === sessionRow.candidate_id && record.candidate_id === imageCase.candidate_id, "metadata record candidate_id must match sources");
    assert(record.case_id === sessionRow.case_id && record.case_id === imageCase.case_id, "metadata record case_id must match sources");
    assert(record.outcome === sessionRow.outcome && record.outcome === imageCase.visible_outcome, "metadata record outcome must match sources");
    assert(record.write_allowed_now === false, "metadata record must remain readonly");
    ensureAllowedAction(accumulationContract, "accepted_metadata_action", record.metadata_accumulation.accepted_metadata_action);
    ensureAllowedAction(accumulationContract, "rejected_metadata_action", record.metadata_accumulation.rejected_metadata_action);
    ensureAllowedAction(accumulationContract, "archive_reference_action", record.metadata_accumulation.archive_reference_action);
    ensureAllowedAction(accumulationContract, "next_review_action", record.metadata_accumulation.next_review_action);
    return buildQueueEntry(record, imageCase, sessionRow, drilldown.selected_review_result_id);
  });

  return {
    queue_id: "visual_eval_readonly_metadata_accumulation_queue_v1_synthetic_001",
    queue_type: "metadata_only_visual_eval_readonly_metadata_accumulation_queue",
    status: "readonly_metadata_accumulation_queue_ready",
    source_session_drilldown: drilldownPath,
    source_bridge_payload: bridgePayloadPath,
    source_accumulation_contract: accumulationContractPath,
    selected_review_result_id: drilldown.selected_review_result_id,
    queue_contract: {
      metadata_only: true,
      read_only: true,
      records_must_resolve_to_session_rows: true,
      records_must_resolve_to_image_cases: true,
      actions_must_be_allowed_by_contract: true,
      write_allowed: false,
    },
    queue_summary: {
      total_records: entries.length,
      accepted_metadata_candidates: entries.filter((entry) => entry.accepted_metadata_action === "keep_as_metadata_candidate").length,
      patch_plan_only: entries.filter((entry) => entry.next_review_action === "write_patch_plan_only").length,
      failure_learning_metadata: entries.filter((entry) => entry.rejected_metadata_action === "keep_as_failure_learning_metadata").length,
      archive_references: entries.filter((entry) => entry.archive_reference_action !== "none").length,
    },
    queues: {
      accepted_metadata_candidates: entries.filter((entry) => entry.accepted_metadata_action === "keep_as_metadata_candidate"),
      patch_plan_only: entries.filter((entry) => entry.next_review_action === "write_patch_plan_only"),
      failure_learning_metadata: entries.filter((entry) => entry.rejected_metadata_action === "keep_as_failure_learning_metadata"),
      archive_references: entries.filter((entry) => entry.archive_reference_action !== "none"),
      next_review_actions: entries.map((entry) => ({
        review_result_id: entry.review_result_id,
        candidate_id: entry.candidate_id,
        case_id: entry.case_id,
        outcome: entry.outcome,
        next_review_action: entry.next_review_action,
        selected: entry.selected,
        write_allowed_now: entry.write_allowed_now,
      })),
    },
    guard: { ...guard },
  };
}

function parseArgValue(argv, flag, fallback) {
  const index = argv.indexOf(flag);
  return index >= 0 ? argv[index + 1] : fallback;
}

function main() {
  const argv = process.argv.slice(2);
  const payload = loadReadonlyMetadataAccumulationQueue({
    drilldownPath: parseArgValue(argv, "--drilldown", defaultDrilldownPath),
    bridgePayloadPath: parseArgValue(argv, "--bridge-payload", defaultBridgePayloadPath),
    accumulationContractPath: parseArgValue(argv, "--accumulation-contract", defaultAccumulationContractPath),
  });
  process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`);
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    process.stderr.write(`${error.stack || error.message}\n`);
    process.exitCode = 1;
  }
}

module.exports = {
  loadReadonlyMetadataAccumulationQueue,
};
