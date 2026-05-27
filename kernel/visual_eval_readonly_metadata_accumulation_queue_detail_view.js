#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const defaultSurfacePath = "tests/schema_examples/visual_eval_readonly_metadata_accumulation_queue_surface_snapshot.example.json";
const defaultReviewResultId = "visual_eval_review_result_patch_synthetic_001";
const defaultSectionId = "patch_plan_only";
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

function findSectionCard(surface, sectionId, reviewResultId) {
  const lane = (surface.surface?.section_lanes || []).find((item) => item.section_id === sectionId);
  if (!lane) return null;
  const card = (lane.cards || []).find((item) => item.review_result_id === reviewResultId);
  return card ? { lane, card } : null;
}

function membershipBySection(surface, reviewResultId) {
  return (surface.surface?.section_lanes || [])
    .filter((lane) => (lane.cards || []).some((card) => card.review_result_id === reviewResultId))
    .map((lane) => lane.section_id);
}

function membershipByOutcome(surface, reviewResultId) {
  return (surface.surface?.outcome_lanes || [])
    .filter((lane) => (lane.card_refs || []).some((ref) => ref.review_result_id === reviewResultId))
    .map((lane) => lane.outcome);
}

function membershipByNextAction(surface, reviewResultId) {
  return (surface.surface?.next_action_queues || [])
    .filter((queue) => (queue.card_refs || []).some((ref) => ref.review_result_id === reviewResultId))
    .map((queue) => queue.next_review_action);
}

function loadReadonlyMetadataAccumulationQueueDetailView(input) {
  const surfacePath = (input?.surfacePath || defaultSurfacePath).replace(/\\/g, "/");
  const sectionId = input?.sectionId || defaultSectionId;
  const reviewResultId = input?.reviewResultId || defaultReviewResultId;
  const surface = input?.surface || readJson(surfacePath);

  assert(!hasAbsoluteOrLoopback(surface), "metadata queue detail surface source must not expose absolute local paths or loopback URLs");
  assert(surface.surface_snapshot_type === "metadata_only_visual_eval_readonly_metadata_accumulation_queue_surface_snapshot", "metadata queue surface snapshot type mismatch");
  assert(surface.guard?.metadata_only === true && surface.guard?.read_only === true, "metadata queue surface must be metadata-only/read-only");
  assert(surface.guard?.provider_contact_performed === false && surface.guard?.memory_write_performed === false, "metadata queue surface forbidden guards must remain false");

  const match = findSectionCard(surface, sectionId, reviewResultId);
  assert(match, `selected metadata queue card must exist: ${sectionId}:${reviewResultId}`);
  assert(match.card.selected === true || reviewResultId !== surface.surface?.selected_review_result_id, "selected review result should remain selected in its primary detail lane");

  return {
    detail_view_id: "visual_eval_readonly_metadata_accumulation_queue_detail_view_v1_synthetic_001",
    detail_view_type: "metadata_only_visual_eval_readonly_metadata_accumulation_queue_detail_view",
    status: "readonly_metadata_accumulation_queue_detail_view_ready",
    source_surface_snapshot: surfacePath,
    selected_section_id: sectionId,
    selected_review_result_id: reviewResultId,
    selected_card: {
      ...match.card,
      section_count: match.lane.count,
      section_membership: membershipBySection(surface, reviewResultId),
      outcome_membership: membershipByOutcome(surface, reviewResultId),
      next_action_membership: membershipByNextAction(surface, reviewResultId),
    },
    detail_contract: {
      metadata_only: true,
      read_only: true,
      detail_key: "section_id + review_result_id",
      card_must_resolve_to_surface_section_lane: true,
      selected_patch_plan_must_remain_visible: true,
      write_allowed: false,
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
  const payload = loadReadonlyMetadataAccumulationQueueDetailView({
    surfacePath: parseArgValue(argv, "--surface", defaultSurfacePath),
    sectionId: parseArgValue(argv, "--section-id", defaultSectionId),
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
  defaultSectionId,
  loadReadonlyMetadataAccumulationQueueDetailView,
};
