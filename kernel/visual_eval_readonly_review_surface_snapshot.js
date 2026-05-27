#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const defaultQueryPath = "tests/schema_examples/visual_eval_readonly_review_collection_query.example.json";
const defaultCollectionConsumerPath = "tests/schema_examples/visual_eval_readonly_review_collection_consumer.example.json";
const expectedOutcomes = ["pass", "patch", "reject"];
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

function cardFromRow(row) {
  return {
    review_result_id: row.review_result_id,
    candidate_id: row.candidate_id,
    case_id: row.case_id,
    outcome: row.outcome,
    summary: row.summary,
    reason_count: (row.reasons || []).length,
    taxonomy_tags: (row.failure_taxonomy || []).map((tag) => tag.tag_id),
    blocking_watch_items: row.blocking_watch_items,
    next_review_action: row.next_review_action,
    metadata_accumulation_action: row.metadata_accumulation_action,
  };
}

function buildRowMap(collectionConsumer) {
  return new Map((collectionConsumer.collection_rows || []).map((row) => [row.review_result_id, row]));
}

function refsToCards(refs, rowsById) {
  return (refs || []).map((ref) => {
    const row = rowsById.get(ref.review_result_id);
    assert(row, `surface row ref must resolve: ${ref.review_result_id}`);
    assert(row.candidate_id === ref.candidate_id, `surface row candidate mismatch: ${ref.review_result_id}`);
    assert(row.outcome === ref.outcome, `surface row outcome mismatch: ${ref.review_result_id}`);
    return cardFromRow(row);
  });
}

function refsToCardRefs(refs, rowsById) {
  return (refs || []).map((ref) => {
    const row = rowsById.get(ref.review_result_id);
    assert(row, `surface row ref must resolve: ${ref.review_result_id}`);
    assert(row.candidate_id === ref.candidate_id, `surface row candidate mismatch: ${ref.review_result_id}`);
    assert(row.outcome === ref.outcome, `surface row outcome mismatch: ${ref.review_result_id}`);
    return {
      review_result_id: row.review_result_id,
      candidate_id: row.candidate_id,
      outcome: row.outcome,
    };
  });
}

function loadReadonlyReviewSurfaceSnapshot(input) {
  const queryPath = (input?.queryPath || defaultQueryPath).replace(/\\/g, "/");
  const collectionConsumerPath = (input?.collectionConsumerPath || defaultCollectionConsumerPath).replace(/\\/g, "/");
  const query = input?.query || readJson(queryPath);
  const collectionConsumer = input?.collectionConsumer || readJson(collectionConsumerPath);

  assert(!hasAbsoluteOrLoopback({ query, collectionConsumer }), "surface sources must not expose absolute local paths or loopback URLs");
  assert(query.query_payload_type === "metadata_only_visual_eval_readonly_review_collection_query", "query payload_type mismatch");
  assert(collectionConsumer.consumer_payload_type === "metadata_only_visual_eval_readonly_review_collection_consumer", "collection consumer payload_type mismatch");
  assert(query.guard?.metadata_only === true && query.guard?.read_only === true, "query must be metadata-only/read-only");
  assert(collectionConsumer.guard?.metadata_only === true && collectionConsumer.guard?.read_only === true, "collection consumer must be metadata-only/read-only");
  assert(query.guard?.image_generation_performed === false && query.guard?.memory_write_performed === false, "query forbidden guards must remain false");
  assert(collectionConsumer.guard?.image_generation_performed === false && collectionConsumer.guard?.memory_write_performed === false, "collection consumer forbidden guards must remain false");

  const rowsById = buildRowMap(collectionConsumer);
  const outcomeLanes = expectedOutcomes.map((outcome) => ({
    lane_id: `outcome_${outcome}`,
    outcome,
    count: (query.indexes.by_outcome[outcome] || []).length,
    cards: refsToCards(query.indexes.by_outcome[outcome], rowsById),
  }));

  const taxonomySections = Object.entries(query.indexes.by_taxonomy_tag || {}).map(([tagId, refs]) => ({
    taxonomy_tag: tagId,
    count: refs.length,
    card_refs: refsToCardRefs(refs, rowsById),
  }));

  const nextActionQueues = Object.entries(query.indexes.by_next_review_action || {}).map(([action, refs]) => ({
    next_review_action: action,
    count: refs.length,
    card_refs: refsToCardRefs(refs, rowsById),
  }));

  return {
    surface_snapshot_id: "visual_eval_readonly_review_surface_snapshot_v1_synthetic_001",
    surface_snapshot_type: "metadata_only_visual_eval_readonly_review_surface_snapshot",
    status: "readonly_surface_snapshot_ready",
    source_query: queryPath,
    source_collection_consumer: collectionConsumerPath,
    snapshot_contract: {
      metadata_only: true,
      read_only: true,
      surface_sections: [
        "outcome_lanes",
        "taxonomy_sections",
        "next_action_queues"
      ],
      cards_must_resolve_to_collection_rows: true,
      cards_must_preserve_outcome_and_next_action: true
    },
    surface: {
      collection_id: collectionConsumer.collection.collection_id,
      total_cards: collectionConsumer.collection.display_row_count,
      outcome_summary: collectionConsumer.collection.outcome_summary,
      outcome_lanes: outcomeLanes,
      taxonomy_sections: taxonomySections,
      next_action_queues: nextActionQueues
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
  const payload = loadReadonlyReviewSurfaceSnapshot({
    queryPath: parseArgValue(argv, "--query", defaultQueryPath),
    collectionConsumerPath: parseArgValue(argv, "--collection-consumer", defaultCollectionConsumerPath),
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
  loadReadonlyReviewSurfaceSnapshot,
};
