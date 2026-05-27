#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const defaultSurfacePath = "tests/schema_examples/visual_eval_readonly_review_surface_snapshot.example.json";
const defaultCollectionConsumerPath = "tests/schema_examples/visual_eval_readonly_review_collection_consumer.example.json";
const defaultReviewResultId = "visual_eval_review_result_patch_synthetic_001";
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

function findSurfaceCard(surface, reviewResultId) {
  for (const lane of surface.surface.outcome_lanes || []) {
    const card = (lane.cards || []).find((item) => item.review_result_id === reviewResultId);
    if (card) return { lane, card };
  }
  return null;
}

function findSectionMembership(sections, field, reviewResultId) {
  return (sections || [])
    .filter((section) => (section.card_refs || []).some((ref) => ref.review_result_id === reviewResultId))
    .map((section) => section[field]);
}

function loadReadonlyReviewDetailView(input) {
  const surfacePath = (input?.surfacePath || defaultSurfacePath).replace(/\\/g, "/");
  const collectionConsumerPath = (input?.collectionConsumerPath || defaultCollectionConsumerPath).replace(/\\/g, "/");
  const reviewResultId = input?.reviewResultId || defaultReviewResultId;
  const surface = input?.surface || readJson(surfacePath);
  const collectionConsumer = input?.collectionConsumer || readJson(collectionConsumerPath);

  assert(!hasAbsoluteOrLoopback({ surface, collectionConsumer }), "detail view sources must not expose absolute local paths or loopback URLs");
  assert(surface.surface_snapshot_type === "metadata_only_visual_eval_readonly_review_surface_snapshot", "surface snapshot type mismatch");
  assert(collectionConsumer.consumer_payload_type === "metadata_only_visual_eval_readonly_review_collection_consumer", "collection consumer payload_type mismatch");
  assert(surface.guard?.metadata_only === true && surface.guard?.read_only === true, "surface must be metadata-only/read-only");
  assert(collectionConsumer.guard?.metadata_only === true && collectionConsumer.guard?.read_only === true, "collection consumer must be metadata-only/read-only");
  assert(surface.guard?.provider_contact_performed === false && surface.guard?.memory_write_performed === false, "surface forbidden guards must remain false");
  assert(collectionConsumer.guard?.provider_contact_performed === false && collectionConsumer.guard?.memory_write_performed === false, "collection consumer forbidden guards must remain false");

  const surfaceMatch = findSurfaceCard(surface, reviewResultId);
  assert(surfaceMatch, `selected review_result_id must exist in surface outcome lanes: ${reviewResultId}`);
  const row = (collectionConsumer.collection_rows || []).find((item) => item.review_result_id === reviewResultId);
  assert(row, `selected review_result_id must exist in collection rows: ${reviewResultId}`);
  assert(surfaceMatch.card.candidate_id === row.candidate_id, "detail candidate_id must match collection row");
  assert(surfaceMatch.card.outcome === row.outcome, "detail outcome must match collection row");
  assert(surfaceMatch.card.next_review_action === row.next_review_action, "detail next_review_action must match collection row");
  assert(surfaceMatch.card.metadata_accumulation_action === row.metadata_accumulation_action, "detail metadata_accumulation_action must match collection row");

  return {
    detail_view_id: "visual_eval_readonly_review_detail_view_v1_synthetic_001",
    detail_view_type: "metadata_only_visual_eval_readonly_review_detail_view",
    status: "readonly_detail_view_ready",
    source_surface_snapshot: surfacePath,
    source_collection_consumer: collectionConsumerPath,
    selected_review_result_id: reviewResultId,
    selected_card: {
      ...surfaceMatch.card,
      lane_id: surfaceMatch.lane.lane_id,
      taxonomy_section_membership: findSectionMembership(surface.surface.taxonomy_sections, "taxonomy_tag", reviewResultId),
      next_action_queue_membership: findSectionMembership(surface.surface.next_action_queues, "next_review_action", reviewResultId),
    },
    collection_row_detail: {
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
  const payload = loadReadonlyReviewDetailView({
    surfacePath: parseArgValue(argv, "--surface", defaultSurfacePath),
    collectionConsumerPath: parseArgValue(argv, "--collection-consumer", defaultCollectionConsumerPath),
    reviewResultId: parseArgValue(argv, "--review-result-id", defaultReviewResultId),
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
  defaultReviewResultId,
  loadReadonlyReviewDetailView,
};
