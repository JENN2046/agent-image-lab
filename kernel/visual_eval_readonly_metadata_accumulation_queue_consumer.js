#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const defaultQueuePath = "tests/schema_examples/visual_eval_readonly_metadata_accumulation_queue.example.json";
const expectedSections = [
  "accepted_metadata_candidates",
  "patch_plan_only",
  "failure_learning_metadata",
  "archive_references",
  "next_review_actions",
];
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

function summarizeEntry(entry) {
  return {
    review_result_id: entry.review_result_id,
    candidate_id: entry.candidate_id,
    case_id: entry.case_id,
    outcome: entry.outcome,
    summary: entry.summary,
    failure_tags: entry.failure_tags || [],
    next_review_action: entry.next_review_action,
    metadata_actions: {
      accepted_metadata_action: entry.accepted_metadata_action || "none",
      rejected_metadata_action: entry.rejected_metadata_action || "none",
      archive_reference_action: entry.archive_reference_action || "none",
    },
    selected: entry.selected === true,
    write_allowed_now: entry.write_allowed_now,
  };
}

function sectionFromQueue(queue, sectionId) {
  const items = (queue.queues?.[sectionId] || []).map(summarizeEntry);
  return {
    section_id: sectionId,
    item_count: items.length,
    selected_count: items.filter((item) => item.selected).length,
    items,
  };
}

function loadReadonlyMetadataAccumulationQueueConsumer(input) {
  const queuePath = (input?.queuePath || defaultQueuePath).replace(/\\/g, "/");
  const queue = input?.queue || readJson(queuePath);
  assert(!hasAbsoluteOrLoopback(queue), "metadata accumulation queue consumer source must not expose absolute local paths or loopback URLs");
  assert(queue.queue_type === "metadata_only_visual_eval_readonly_metadata_accumulation_queue", "metadata accumulation queue type mismatch");
  assert(queue.queue_contract?.metadata_only === true, "metadata accumulation queue must be metadata-only");
  assert(queue.queue_contract?.read_only === true, "metadata accumulation queue must be read-only");
  assert(queue.queue_contract?.write_allowed === false, "metadata accumulation queue must not allow writes");
  assert(queue.guard?.memory_write_performed === false, "metadata accumulation queue memory write must be false");
  assert(queue.guard?.provider_contact_performed === false, "metadata accumulation queue provider contact must be false");
  assert(queue.guard?.image_generation_performed === false, "metadata accumulation queue image generation must be false");

  const sections = expectedSections.map((sectionId) => sectionFromQueue(queue, sectionId));
  const selectedPatchPlan = sections
    .find((section) => section.section_id === "patch_plan_only")
    .items.find((item) => item.review_result_id === queue.selected_review_result_id && item.selected === true);
  assert(selectedPatchPlan, "selected patch plan item must be visible to the queue consumer");

  return {
    consumer_payload_id: "visual_eval_readonly_metadata_accumulation_queue_consumer_v1_synthetic_001",
    consumer_payload_type: "metadata_only_visual_eval_readonly_metadata_accumulation_queue_consumer",
    status: "readonly_metadata_accumulation_queue_consumer_ready",
    source_queue: queuePath,
    display_contract: {
      metadata_only: true,
      read_only: true,
      queue_sections: expectedSections,
      queue_items_must_remain_readonly: true,
      selected_patch_plan_must_be_visible: true,
      write_allowed: false,
    },
    dashboard_summary: {
      total_records: queue.queue_summary.total_records,
      accepted_metadata_candidates: queue.queue_summary.accepted_metadata_candidates,
      patch_plan_only: queue.queue_summary.patch_plan_only,
      failure_learning_metadata: queue.queue_summary.failure_learning_metadata,
      archive_references: queue.queue_summary.archive_references,
      next_review_actions: queue.queues.next_review_actions.length,
      selected_review_result_id: queue.selected_review_result_id,
      selected_next_review_action: selectedPatchPlan.next_review_action,
    },
    sections,
    selected_patch_plan: selectedPatchPlan,
    guard: { ...guard },
  };
}

function parseArgValue(argv, flag, fallback) {
  const index = argv.indexOf(flag);
  return index >= 0 ? argv[index + 1] : fallback;
}

function main() {
  const argv = process.argv.slice(2);
  const payload = loadReadonlyMetadataAccumulationQueueConsumer({
    queuePath: parseArgValue(argv, "--queue", defaultQueuePath),
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
  loadReadonlyMetadataAccumulationQueueConsumer,
};
