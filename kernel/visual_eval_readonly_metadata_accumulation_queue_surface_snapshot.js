#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const defaultQueryPath = "tests/schema_examples/visual_eval_readonly_metadata_accumulation_queue_query.example.json";
const defaultConsumerPath = "tests/schema_examples/visual_eval_readonly_metadata_accumulation_queue_consumer.example.json";
const expectedSections = [
  "accepted_metadata_candidates",
  "patch_plan_only",
  "failure_learning_metadata",
  "archive_references",
  "next_review_actions",
];
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

function buildItemMap(consumer) {
  const rows = new Map();
  for (const section of consumer.sections || []) {
    for (const item of section.items || []) {
      rows.set(`${section.section_id}:${item.review_result_id}`, item);
    }
  }
  return rows;
}

function resolveRef(ref, rowsByKey) {
  const item = rowsByKey.get(`${ref.section_id}:${ref.review_result_id}`);
  assert(item, `metadata queue surface ref must resolve: ${ref.section_id}:${ref.review_result_id}`);
  assert(item.candidate_id === ref.candidate_id, `metadata queue surface candidate mismatch: ${ref.review_result_id}`);
  assert(item.case_id === ref.case_id, `metadata queue surface case mismatch: ${ref.review_result_id}`);
  assert(item.outcome === ref.outcome, `metadata queue surface outcome mismatch: ${ref.review_result_id}`);
  return {
    section_id: ref.section_id,
    review_result_id: ref.review_result_id,
    candidate_id: ref.candidate_id,
    case_id: ref.case_id,
    outcome: ref.outcome,
    selected: ref.selected === true,
    next_review_action: item.next_review_action,
    metadata_actions: item.metadata_actions,
    failure_tags: item.failure_tags || [],
  };
}

function refsToCards(refs, rowsByKey) {
  return (refs || []).map((ref) => resolveRef(ref, rowsByKey));
}

function loadReadonlyMetadataAccumulationQueueSurfaceSnapshot(input) {
  const queryPath = (input?.queryPath || defaultQueryPath).replace(/\\/g, "/");
  const consumerPath = (input?.consumerPath || defaultConsumerPath).replace(/\\/g, "/");
  const query = input?.query || readJson(queryPath);
  const consumer = input?.consumer || readJson(consumerPath);

  assert(!hasAbsoluteOrLoopback({ query, consumer }), "metadata queue surface sources must not expose absolute local paths or loopback URLs");
  assert(query.query_payload_type === "metadata_only_visual_eval_readonly_metadata_accumulation_queue_query", "metadata queue query payload_type mismatch");
  assert(consumer.consumer_payload_type === "metadata_only_visual_eval_readonly_metadata_accumulation_queue_consumer", "metadata queue consumer payload_type mismatch");
  assert(query.guard?.metadata_only === true && query.guard?.read_only === true, "metadata queue query must be metadata-only/read-only");
  assert(consumer.guard?.metadata_only === true && consumer.guard?.read_only === true, "metadata queue consumer must be metadata-only/read-only");
  assert(query.guard?.image_generation_performed === false && query.guard?.memory_write_performed === false, "metadata queue query forbidden guards must remain false");
  assert(consumer.guard?.image_generation_performed === false && consumer.guard?.memory_write_performed === false, "metadata queue consumer forbidden guards must remain false");

  const rowsByKey = buildItemMap(consumer);
  const sectionLanes = expectedSections.map((sectionId) => {
    const cards = refsToCards(query.indexes.by_section[sectionId], rowsByKey);
    return { section_id: sectionId, count: cards.length, cards };
  });
  const outcomeLanes = expectedOutcomes.map((outcome) => ({
    outcome,
    count: (query.indexes.by_outcome[outcome] || []).length,
    card_refs: refsToCards(query.indexes.by_outcome[outcome], rowsByKey).map(({ section_id, review_result_id, candidate_id, outcome: cardOutcome, selected }) => ({
      section_id,
      review_result_id,
      candidate_id,
      outcome: cardOutcome,
      selected,
    })),
  }));
  const nextActionQueues = Object.entries(query.indexes.by_next_review_action || {}).map(([action, refs]) => ({
    next_review_action: action,
    count: refs.length,
    card_refs: refsToCards(refs, rowsByKey).map(({ section_id, review_result_id, candidate_id, outcome, selected }) => ({
      section_id,
      review_result_id,
      candidate_id,
      outcome,
      selected,
    })),
  }));
  const selectedItems = refsToCards(query.indexes.selected_items || [], rowsByKey);

  return {
    surface_snapshot_id: "visual_eval_readonly_metadata_accumulation_queue_surface_snapshot_v1_synthetic_001",
    surface_snapshot_type: "metadata_only_visual_eval_readonly_metadata_accumulation_queue_surface_snapshot",
    status: "readonly_metadata_accumulation_queue_surface_snapshot_ready",
    source_query: queryPath,
    source_queue_consumer: consumerPath,
    snapshot_contract: {
      metadata_only: true,
      read_only: true,
      surface_sections: [
        "section_lanes",
        "outcome_lanes",
        "next_action_queues",
        "selected_items",
      ],
      cards_must_resolve_to_queue_consumer_items: true,
      selected_patch_plan_must_be_visible: true,
      write_allowed: false,
    },
    surface: {
      total_records: consumer.dashboard_summary.total_records,
      total_section_items: sectionLanes.reduce((sum, lane) => sum + lane.count, 0),
      selected_review_result_id: consumer.dashboard_summary.selected_review_result_id,
      section_lanes: sectionLanes,
      outcome_lanes: outcomeLanes,
      next_action_queues: nextActionQueues,
      selected_items: selectedItems,
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
  const payload = loadReadonlyMetadataAccumulationQueueSurfaceSnapshot({
    queryPath: parseArgValue(argv, "--query", defaultQueryPath),
    consumerPath: parseArgValue(argv, "--queue-consumer", defaultConsumerPath),
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
  loadReadonlyMetadataAccumulationQueueSurfaceSnapshot,
};
