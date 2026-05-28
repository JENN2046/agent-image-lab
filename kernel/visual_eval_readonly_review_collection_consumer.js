#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const {
  consumerGuard,
  loadReadonlyReviewBundleConsumer,
} = require("./visual_eval_readonly_review_bundle_consumer");

const repoRoot = path.resolve(__dirname, "..");
const defaultCollectionPath = "tests/schema_examples/visual_eval_readonly_review_collection.example.json";
const expectedOutcomes = ["pass", "patch", "reject"];
const expectedSelectedReviewResultId = "visual_eval_review_result_patch_synthetic_001";

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

function sameSet(actual, expected) {
  return Array.isArray(actual) && actual.length === expected.length && expected.every((item) => actual.includes(item));
}

function emptyOutcomeSummary() {
  return Object.fromEntries(expectedOutcomes.map((outcome) => [outcome, 0]));
}

function addOutcomeSummary(target, source) {
  for (const outcome of expectedOutcomes) {
    target[outcome] += source[outcome] || 0;
  }
}

function selectedPatchEntry(row) {
  return {
    selected_patch: true,
    review_result_id: row.review_result_id,
    candidate_id: row.candidate_id,
    session_id: row.session_id,
    case_id: row.case_id,
    outcome: row.outcome,
    next_review_action: row.next_review_action,
    metadata_accumulation_action: row.metadata_accumulation_action,
  };
}

function assertBoundaryFalse(boundary, label) {
  assert(boundary?.metadata_only === true, `${label}.metadata_only must be true`);
  assert(boundary?.read_only === true, `${label}.read_only must be true`);
  for (const field of [
    "provider_contact_performed",
    "plugin_call_performed",
    "api_call_performed",
    "image_generation_performed",
    "memory_written",
    "DailyNote_written",
    "VCP_memory_written",
    "accepted_samples_written",
    "production_candidate_002_started",
    "Batch_005_started",
  ]) {
    assert(boundary[field] === false, `${label}.${field} must be false`);
  }
}

function loadReadonlyReviewCollectionConsumer(input) {
  const collectionPath = (input?.collectionPath || defaultCollectionPath).replace(/\\/g, "/");
  const collection = input?.collection || readJson(collectionPath);
  assert(!hasAbsoluteOrLoopback(collection), "collection must not expose absolute local paths or loopback URLs");
  assert(collection.artifact_type === "metadata_only_visual_eval_readonly_review_collection", "collection artifact_type mismatch");
  assert(collection.version === "v1", "collection version must be v1");
  assertBoundaryFalse(collection.boundary_confirmation, "collection.boundary_confirmation");
  assert(sameSet(collection.collection_contract?.outcome_set, expectedOutcomes), "collection outcome_set must be pass/patch/reject");
  assert(Array.isArray(collection.collection_members) && collection.collection_members.length > 0, "collection_members must be non-empty");

  const aggregate = emptyOutcomeSummary();
  const collectionRows = [];
  const seenBundleIds = new Set();
  const seenResultIds = new Set();

  for (const member of collection.collection_members) {
    assert(member.bundle_path && member.consumer_payload_path, "collection member must include bundle and consumer paths");
    assert(!hasAbsoluteOrLoopback(member), `${member.member_id || "member"} must not expose absolute local paths or loopback URLs`);
    const bundle = readJson(member.bundle_path);
    const expectedConsumer = readJson(member.consumer_payload_path);
    assert(bundle.artifact_id === member.bundle_id, `${member.member_id} bundle_id mismatch`);
    assert(!seenBundleIds.has(bundle.artifact_id), `${member.member_id} duplicate bundle_id`);
    seenBundleIds.add(bundle.artifact_id);

    const generatedConsumer = loadReadonlyReviewBundleConsumer({ bundlePath: member.bundle_path });
    assert(generatedConsumer.consumer_payload_id === member.consumer_payload_id, `${member.member_id} consumer payload id mismatch`);
    assert(JSON.stringify(generatedConsumer) === JSON.stringify(expectedConsumer), `${member.member_id} consumer payload mismatch`);
    assert(generatedConsumer.source_bundle === member.bundle_path, `${member.member_id} source bundle mismatch`);
    assert(generatedConsumer.guard.metadata_only === true, `${member.member_id} consumer must be metadata-only`);
    assert(generatedConsumer.guard.read_only === true, `${member.member_id} consumer must be read-only`);
    assert(generatedConsumer.guard.image_generation_performed === false, `${member.member_id} consumer image generation must be false`);
    assert(generatedConsumer.guard.memory_write_performed === false, `${member.member_id} consumer memory write must be false`);

    addOutcomeSummary(aggregate, generatedConsumer.session.outcome_summary);
    for (const row of generatedConsumer.display_rows) {
      assert(!seenResultIds.has(row.review_result_id), `${member.member_id} duplicate review_result_id ${row.review_result_id}`);
      seenResultIds.add(row.review_result_id);
      collectionRows.push({
        collection_member_id: member.member_id,
        bundle_id: bundle.artifact_id,
        review_result_id: row.review_result_id,
        candidate_id: row.candidate_id,
        session_id: row.session_id,
        case_id: row.case_id,
        outcome: row.outcome,
        summary: row.summary,
        reasons: row.reasons,
        failure_taxonomy: row.failure_taxonomy,
        blocking_watch_items: row.blocking_watch_items,
        next_review_action: row.next_review_action,
        metadata_accumulation_action: row.metadata_accumulation_action,
      });
    }
  }

  assert(JSON.stringify(aggregate) === JSON.stringify(collection.expected_collection_summary?.outcome_summary), "collection outcome summary mismatch");
  assert(collectionRows.length === collection.expected_collection_summary?.display_row_count, "collection display row count mismatch");
  const selectedPatch = collectionRows.find((row) => row.review_result_id === expectedSelectedReviewResultId);
  assert(selectedPatch, "collection selected patch must resolve to a collection row");
  assert(selectedPatch.outcome === "patch", "collection selected patch must have patch outcome");
  assert(selectedPatch.next_review_action === "write_patch_plan_only", "collection selected patch must route to patch plan");

  return {
    consumer_payload_id: "visual_eval_readonly_review_collection_consumer_v1_synthetic_001",
    consumer_payload_type: "metadata_only_visual_eval_readonly_review_collection_consumer",
    status: "readonly_collection_consumer_payload_ready",
    source_collection: collectionPath,
    selected_review_result_id: selectedPatch.review_result_id,
    selected_patch: selectedPatchEntry(selectedPatch),
    collection: {
      collection_id: collection.artifact_id,
      member_count: collection.collection_members.length,
      outcome_summary: aggregate,
      display_row_count: collectionRows.length,
    },
    collection_rows: collectionRows,
    guard: { ...consumerGuard },
  };
}

function parseArgValue(argv, flag, fallback) {
  const index = argv.indexOf(flag);
  return index >= 0 ? argv[index + 1] : fallback;
}

function main() {
  const argv = process.argv.slice(2);
  const payload = loadReadonlyReviewCollectionConsumer({
    collectionPath: parseArgValue(argv, "--collection", defaultCollectionPath),
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
  loadReadonlyReviewCollectionConsumer,
};
