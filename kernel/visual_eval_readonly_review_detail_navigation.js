#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const {
  defaultReviewResultId,
  loadReadonlyReviewDetailView,
} = require("./visual_eval_readonly_review_detail_view");

const repoRoot = path.resolve(__dirname, "..");
const defaultSurfacePath = "tests/schema_examples/visual_eval_readonly_review_surface_snapshot.example.json";
const defaultCollectionConsumerPath = "tests/schema_examples/visual_eval_readonly_review_collection_consumer.example.json";
const detailKernelPath = "kernel/visual_eval_readonly_review_detail_view.js";
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

function flattenSurfaceCards(surface) {
  return (surface.surface?.outcome_lanes || []).flatMap((lane) =>
    (lane.cards || []).map((card) => ({
      ...card,
      lane_id: lane.lane_id,
    }))
  );
}

function buildNavigationItem(card, selectedReviewResultId) {
  return {
    review_result_id: card.review_result_id,
    candidate_id: card.candidate_id,
    case_id: card.case_id,
    lane_id: card.lane_id,
    outcome: card.outcome,
    summary: card.summary,
    taxonomy_tags: card.taxonomy_tags,
    next_review_action: card.next_review_action,
    metadata_accumulation_action: card.metadata_accumulation_action,
    selected: card.review_result_id === selectedReviewResultId,
    detail_selector: {
      detail_kernel: detailKernelPath,
      review_result_id: card.review_result_id,
      route_action: "load_readonly_detail_only",
      write_allowed: false,
    },
  };
}

function loadReadonlyReviewDetailNavigation(input) {
  const surfacePath = (input?.surfacePath || defaultSurfacePath).replace(/\\/g, "/");
  const collectionConsumerPath = (input?.collectionConsumerPath || defaultCollectionConsumerPath).replace(/\\/g, "/");
  const selectedReviewResultId = input?.selectedReviewResultId || defaultReviewResultId;
  const surface = input?.surface || readJson(surfacePath);
  const collectionConsumer = input?.collectionConsumer || readJson(collectionConsumerPath);

  assert(!hasAbsoluteOrLoopback({ surface, collectionConsumer }), "navigation sources must not expose absolute local paths or loopback URLs");
  assert(surface.surface_snapshot_type === "metadata_only_visual_eval_readonly_review_surface_snapshot", "surface snapshot type mismatch");
  assert(collectionConsumer.consumer_payload_type === "metadata_only_visual_eval_readonly_review_collection_consumer", "collection consumer payload_type mismatch");
  assert(surface.guard?.metadata_only === true && surface.guard?.read_only === true, "surface must remain metadata-only/read-only");
  assert(collectionConsumer.guard?.metadata_only === true && collectionConsumer.guard?.read_only === true, "collection consumer must remain metadata-only/read-only");

  const cards = flattenSurfaceCards(surface);
  assert(cards.length > 0, "navigation requires at least one surface card");
  assert(cards.some((card) => card.review_result_id === selectedReviewResultId), `selected review_result_id must exist in navigation: ${selectedReviewResultId}`);

  const navigationItems = cards.map((card) => buildNavigationItem(card, selectedReviewResultId));
  for (const item of navigationItems) {
    loadReadonlyReviewDetailView({
      surfacePath,
      collectionConsumerPath,
      reviewResultId: item.review_result_id,
      surface,
      collectionConsumer,
    });
  }

  return {
    navigation_id: "visual_eval_readonly_review_detail_navigation_v1_synthetic_001",
    navigation_type: "metadata_only_visual_eval_readonly_review_detail_navigation",
    status: "readonly_detail_navigation_ready",
    source_surface_snapshot: surfacePath,
    source_collection_consumer: collectionConsumerPath,
    source_detail_kernel: detailKernelPath,
    selected_review_result_id: selectedReviewResultId,
    navigation_contract: {
      metadata_only: true,
      read_only: true,
      all_navigation_items_detail_loadable: true,
      selection_must_resolve_to_detail: true,
      route_action: "load_readonly_detail_only",
      write_allowed: false,
    },
    available_outcomes: ["pass", "patch", "reject"],
    navigation_items: navigationItems,
    selected_detail: loadReadonlyReviewDetailView({
      surfacePath,
      collectionConsumerPath,
      reviewResultId: selectedReviewResultId,
      surface,
      collectionConsumer,
    }),
    guard: { ...guard },
  };
}

function parseArgValue(argv, flag, fallback) {
  const index = argv.indexOf(flag);
  return index >= 0 ? argv[index + 1] : fallback;
}

function main() {
  const argv = process.argv.slice(2);
  const payload = loadReadonlyReviewDetailNavigation({
    surfacePath: parseArgValue(argv, "--surface", defaultSurfacePath),
    collectionConsumerPath: parseArgValue(argv, "--collection-consumer", defaultCollectionConsumerPath),
    selectedReviewResultId: parseArgValue(argv, "--selected-review-result-id", defaultReviewResultId),
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
  loadReadonlyReviewDetailNavigation,
};
