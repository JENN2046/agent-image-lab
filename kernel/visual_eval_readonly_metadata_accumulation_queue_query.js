#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const defaultQueueConsumerPath = "tests/schema_examples/visual_eval_readonly_metadata_accumulation_queue_consumer.example.json";
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

function itemRef(sectionId, item) {
  return {
    section_id: sectionId,
    review_result_id: item.review_result_id,
    candidate_id: item.candidate_id,
    case_id: item.case_id,
    outcome: item.outcome,
    selected: item.selected === true,
  };
}

function addIndexRef(index, key, ref) {
  if (!key) return;
  if (!index[key]) index[key] = [];
  index[key].push(ref);
}

function sortedIndex(index) {
  return Object.fromEntries(Object.entries(index).sort(([left], [right]) => left.localeCompare(right)));
}

function loadReadonlyMetadataAccumulationQueueQuery(input) {
  const queueConsumerPath = (input?.queueConsumerPath || defaultQueueConsumerPath).replace(/\\/g, "/");
  const consumer = input?.queueConsumer || readJson(queueConsumerPath);
  assert(!hasAbsoluteOrLoopback(consumer), "metadata accumulation queue consumer must not expose absolute local paths or loopback URLs");
  assert(consumer.consumer_payload_type === "metadata_only_visual_eval_readonly_metadata_accumulation_queue_consumer", "metadata accumulation queue consumer type mismatch");
  assert(consumer.guard?.metadata_only === true, "metadata accumulation queue consumer must be metadata-only");
  assert(consumer.guard?.read_only === true, "metadata accumulation queue consumer must be read-only");
  assert(consumer.guard?.image_generation_performed === false, "metadata accumulation queue consumer image generation must be false");
  assert(consumer.guard?.memory_write_performed === false, "metadata accumulation queue consumer memory write must be false");

  const sections = consumer.sections || [];
  assert(expectedSections.every((sectionId) => sections.some((section) => section.section_id === sectionId)), "metadata accumulation queue consumer sections incomplete");

  const bySection = {};
  const byOutcome = {};
  const byNextReviewAction = {};
  const byMetadataAction = {};
  const byFailureTag = {};
  const selectedItems = [];
  const seenRefs = new Set();

  for (const section of sections) {
    assert(expectedSections.includes(section.section_id), `unexpected metadata queue section: ${section.section_id}`);
    assert(section.item_count === (section.items || []).length, `section item_count mismatch: ${section.section_id}`);
    for (const item of section.items || []) {
      const ref = itemRef(section.section_id, item);
      const refKey = `${section.section_id}:${item.review_result_id}`;
      assert(!seenRefs.has(refKey), `duplicate section item ref: ${refKey}`);
      seenRefs.add(refKey);
      addIndexRef(bySection, section.section_id, ref);
      addIndexRef(byOutcome, item.outcome, ref);
      addIndexRef(byNextReviewAction, item.next_review_action, ref);
      for (const action of Object.values(item.metadata_actions || {})) {
        if (action && action !== "none") addIndexRef(byMetadataAction, action, ref);
      }
      for (const tag of item.failure_tags || []) {
        addIndexRef(byFailureTag, tag, ref);
      }
      if (item.selected === true) selectedItems.push(ref);
    }
  }

  assert(expectedOutcomes.every((outcome) => Array.isArray(byOutcome[outcome]) && byOutcome[outcome].length > 0), "metadata queue query outcome index must cover pass/patch/reject");
  assert(Array.isArray(bySection.patch_plan_only) && bySection.patch_plan_only.some((ref) => ref.selected), "metadata queue query must expose selected patch plan");

  return {
    query_payload_id: "visual_eval_readonly_metadata_accumulation_queue_query_v1_synthetic_001",
    query_payload_type: "metadata_only_visual_eval_readonly_metadata_accumulation_queue_query",
    status: "readonly_metadata_accumulation_queue_query_payload_ready",
    source_queue_consumer: queueConsumerPath,
    query_contract: {
      metadata_only: true,
      read_only: true,
      indexed_fields: [
        "section_id",
        "outcome",
        "next_review_action",
        "metadata_actions.*",
        "failure_tags",
        "selected",
      ],
      item_refs_must_resolve_to_consumer_sections: true,
      write_allowed: false,
    },
    indexes: {
      by_section: sortedIndex(bySection),
      by_outcome: sortedIndex(byOutcome),
      by_next_review_action: sortedIndex(byNextReviewAction),
      by_metadata_action: sortedIndex(byMetadataAction),
      by_failure_tag: sortedIndex(byFailureTag),
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
  const payload = loadReadonlyMetadataAccumulationQueueQuery({
    queueConsumerPath: parseArgValue(argv, "--queue-consumer", defaultQueueConsumerPath),
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
  loadReadonlyMetadataAccumulationQueueQuery,
};
