#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
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

function idRef(row) {
  return {
    review_result_id: row.review_result_id,
    candidate_id: row.candidate_id,
    outcome: row.outcome,
  };
}

function buildIndex(rows, keyFn) {
  const index = {};
  for (const row of rows) {
    const keys = keyFn(row).filter(Boolean);
    for (const key of keys) {
      if (!index[key]) index[key] = [];
      index[key].push(idRef(row));
    }
  }
  return Object.fromEntries(Object.entries(index).sort(([left], [right]) => left.localeCompare(right)));
}

function loadReadonlyReviewCollectionQuery(input) {
  const collectionConsumerPath = (input?.collectionConsumerPath || defaultCollectionConsumerPath).replace(/\\/g, "/");
  const collectionConsumer = input?.collectionConsumer || readJson(collectionConsumerPath);
  assert(!hasAbsoluteOrLoopback(collectionConsumer), "collection consumer must not expose absolute local paths or loopback URLs");
  assert(collectionConsumer.consumer_payload_type === "metadata_only_visual_eval_readonly_review_collection_consumer", "collection consumer payload_type mismatch");
  assert(collectionConsumer.guard?.metadata_only === true, "collection consumer must be metadata-only");
  assert(collectionConsumer.guard?.read_only === true, "collection consumer must be read-only");
  assert(collectionConsumer.guard?.image_generation_performed === false, "collection consumer image generation must be false");
  assert(collectionConsumer.guard?.memory_write_performed === false, "collection consumer memory write must be false");

  const rows = collectionConsumer.collection_rows || [];
  assert(rows.length > 0, "collection rows must be non-empty");
  const rowIds = new Set(rows.map((row) => row.review_result_id));
  assert(rowIds.size === rows.length, "collection rows must have unique review_result_id");

  const byOutcome = buildIndex(rows, (row) => [row.outcome]);
  assert(expectedOutcomes.every((outcome) => Array.isArray(byOutcome[outcome]) && byOutcome[outcome].length > 0), "outcome index must cover pass/patch/reject");

  const byTaxonomyTag = buildIndex(rows, (row) => (row.failure_taxonomy || []).map((tag) => tag.tag_id));
  const byNextReviewAction = buildIndex(rows, (row) => [row.next_review_action]);
  const byMetadataAccumulationAction = buildIndex(rows, (row) => [row.metadata_accumulation_action]);

  return {
    query_payload_id: "visual_eval_readonly_review_collection_query_v1_synthetic_001",
    query_payload_type: "metadata_only_visual_eval_readonly_review_collection_query",
    status: "readonly_collection_query_payload_ready",
    source_collection_consumer: collectionConsumerPath,
    query_contract: {
      metadata_only: true,
      read_only: true,
      indexed_fields: [
        "outcome",
        "failure_taxonomy.tag_id",
        "next_review_action",
        "metadata_accumulation_action"
      ],
      row_refs_must_resolve_to_collection_rows: true
    },
    indexes: {
      by_outcome: byOutcome,
      by_taxonomy_tag: byTaxonomyTag,
      by_next_review_action: byNextReviewAction,
      by_metadata_accumulation_action: byMetadataAccumulationAction
    },
    guard: { ...guard }
  };
}

function parseArgValue(argv, flag, fallback) {
  const index = argv.indexOf(flag);
  return index >= 0 ? argv[index + 1] : fallback;
}

function main() {
  const argv = process.argv.slice(2);
  const payload = loadReadonlyReviewCollectionQuery({
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
  loadReadonlyReviewCollectionQuery,
};
