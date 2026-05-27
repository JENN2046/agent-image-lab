#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const {
  defaultReviewResultId,
  defaultSectionId,
  loadReadonlyMetadataAccumulationQueueDetailView,
} = require("./visual_eval_readonly_metadata_accumulation_queue_detail_view");

const repoRoot = path.resolve(__dirname, "..");
const defaultSurfacePath = "tests/schema_examples/visual_eval_readonly_metadata_accumulation_queue_surface_snapshot.example.json";
const detailKernelPath = "kernel/visual_eval_readonly_metadata_accumulation_queue_detail_view.js";
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

function flattenSectionCards(surface) {
  return (surface.surface?.section_lanes || []).flatMap((lane) =>
    (lane.cards || []).map((card) => ({ ...card, section_id: lane.section_id }))
  );
}

function buildNavigationItem(card, selectedKey) {
  const key = `${card.section_id}:${card.review_result_id}`;
  return {
    navigation_key: key,
    section_id: card.section_id,
    review_result_id: card.review_result_id,
    candidate_id: card.candidate_id,
    case_id: card.case_id,
    outcome: card.outcome,
    selected: key === selectedKey,
    next_review_action: card.next_review_action,
    metadata_actions: card.metadata_actions,
    failure_tags: card.failure_tags || [],
    detail_selector: {
      detail_kernel: detailKernelPath,
      section_id: card.section_id,
      review_result_id: card.review_result_id,
      route_action: "load_readonly_metadata_queue_detail_only",
      write_allowed: false,
    },
  };
}

function loadReadonlyMetadataAccumulationQueueDetailNavigation(input) {
  const surfacePath = (input?.surfacePath || defaultSurfacePath).replace(/\\/g, "/");
  const selectedSectionId = input?.selectedSectionId || defaultSectionId;
  const selectedReviewResultId = input?.selectedReviewResultId || defaultReviewResultId;
  const surface = input?.surface || readJson(surfacePath);
  const selectedKey = `${selectedSectionId}:${selectedReviewResultId}`;

  assert(!hasAbsoluteOrLoopback(surface), "metadata queue navigation source must not expose absolute local paths or loopback URLs");
  assert(surface.surface_snapshot_type === "metadata_only_visual_eval_readonly_metadata_accumulation_queue_surface_snapshot", "metadata queue surface snapshot type mismatch");
  assert(surface.guard?.metadata_only === true && surface.guard?.read_only === true, "metadata queue surface must be metadata-only/read-only");

  const cards = flattenSectionCards(surface);
  assert(cards.length > 0, "metadata queue navigation requires section cards");
  assert(cards.some((card) => `${card.section_id}:${card.review_result_id}` === selectedKey), `selected metadata queue key must exist: ${selectedKey}`);

  const navigationItems = cards.map((card) => buildNavigationItem(card, selectedKey));
  for (const item of navigationItems) {
    loadReadonlyMetadataAccumulationQueueDetailView({
      surfacePath,
      surface,
      sectionId: item.section_id,
      reviewResultId: item.review_result_id,
    });
  }

  return {
    navigation_id: "visual_eval_readonly_metadata_accumulation_queue_detail_navigation_v1_synthetic_001",
    navigation_type: "metadata_only_visual_eval_readonly_metadata_accumulation_queue_detail_navigation",
    status: "readonly_metadata_accumulation_queue_detail_navigation_ready",
    source_surface_snapshot: surfacePath,
    source_detail_kernel: detailKernelPath,
    selected_navigation_key: selectedKey,
    navigation_contract: {
      metadata_only: true,
      read_only: true,
      detail_key: "section_id + review_result_id",
      all_navigation_items_detail_loadable: true,
      selection_must_resolve_to_detail: true,
      route_action: "load_readonly_metadata_queue_detail_only",
      write_allowed: false,
    },
    navigation_items: navigationItems,
    selected_detail: loadReadonlyMetadataAccumulationQueueDetailView({
      surfacePath,
      surface,
      sectionId: selectedSectionId,
      reviewResultId: selectedReviewResultId,
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
  const payload = loadReadonlyMetadataAccumulationQueueDetailNavigation({
    surfacePath: parseArgValue(argv, "--surface", defaultSurfacePath),
    selectedSectionId: parseArgValue(argv, "--selected-section-id", defaultSectionId),
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
  loadReadonlyMetadataAccumulationQueueDetailNavigation,
};
