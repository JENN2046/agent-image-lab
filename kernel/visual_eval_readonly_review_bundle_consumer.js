#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const defaultBundlePath = "tests/schema_examples/visual_eval_readonly_review_bundle.example.json";
const expectedOutcomes = ["pass", "patch", "reject"];
const forbiddenGuardKeys = [
  "production_candidate_allowed_now",
  "accepted_samples_write_allowed_now",
  "memory_write_allowed_now",
  "provider_retry_allowed_now",
  "image_generation_allowed_now",
];
const consumerGuard = Object.freeze({
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

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function hasAbsoluteOrLoopback(value) {
  if (typeof value === "string") {
    return /(?:[A-Za-z]:[\\/]|\\\\|file:\/\/\/?[A-Za-z]:[\\/]|<synthetic-windows-absolute-path>|(?:https?|wss?):\/\/(?:127\.0\.0\.1|localhost|\[::1\]|::1))/i.test(value);
  }
  if (Array.isArray(value)) return value.some((item) => hasAbsoluteOrLoopback(item));
  if (value && typeof value === "object") return Object.values(value).some((item) => hasAbsoluteOrLoopback(item));
  return false;
}

function assertRouteGuardsFalse(routeGuards, label) {
  assert(routeGuards && typeof routeGuards === "object" && !Array.isArray(routeGuards), `${label}.route_guards must be an object`);
  for (const key of forbiddenGuardKeys) {
    assert(routeGuards[key] === false, `${label}.route_guards.${key} must be false`);
  }
  for (const key of Object.keys(routeGuards)) {
    assert(forbiddenGuardKeys.includes(key), `${label}.route_guards.${key} is unknown`);
  }
}

function buildTaxonomyIndex(taxonomy) {
  const tags = new Map();
  for (const category of taxonomy.categories || []) {
    for (const tag of category.failure_tags || []) {
      tags.set(tag.tag_id, {
        tag_id: tag.tag_id,
        category_id: category.category_id,
        severity: tag.severity,
        default_outcome: tag.default_outcome,
      });
    }
  }
  return tags;
}

function byId(items, field) {
  return new Map((items || []).map((item) => [item[field], item]));
}

function selectReasons(record) {
  if (record.outcome === "pass") return clone(record.pass_reasons);
  if (record.outcome === "patch") return clone(record.patch_reasons);
  return clone(record.reject_reasons);
}

function selectPrimaryAction(metadata) {
  if (metadata.accepted_metadata_action !== "none") return metadata.accepted_metadata_action;
  if (metadata.rejected_metadata_action !== "none") return metadata.rejected_metadata_action;
  return metadata.archive_reference_action;
}

function loadReadonlyReviewBundleConsumer(input) {
  const bundlePath = input?.bundlePath || defaultBundlePath;
  const bundle = input?.bundle || readJson(bundlePath);
  assert(!hasAbsoluteOrLoopback(bundle), "bundle must not expose absolute local paths or loopback URLs");
  assert(bundle.artifact_type === "metadata_only_visual_eval_readonly_review_bundle", "bundle artifact_type mismatch");
  assert(bundle.boundary_confirmation?.metadata_only === true, "bundle must be metadata-only");
  assert(bundle.boundary_confirmation?.read_only === true, "bundle must be read-only");

  const refs = bundle.source_refs;
  const protocol = readJson(refs.review_result_protocol);
  const taxonomy = readJson(refs.taxonomy);
  const accumulation = readJson(refs.metadata_accumulation);
  const bridgePayload = readJson(refs.bridge_payload);
  assert(!hasAbsoluteOrLoopback({ protocol, taxonomy, accumulation, bridgePayload }), "source artifacts must not expose absolute local paths or loopback URLs");

  const protocolByResult = byId(protocol.review_results, "review_result_id");
  const bundleByResult = byId(bundle.readonly_artifacts.review_results, "review_result_id");
  const imageCaseByResult = byId(bundle.readonly_artifacts.image_case_drafts, "review_result_id");
  const accumulationByResult = byId(bundle.readonly_artifacts.metadata_accumulation_draft.records, "review_result_id");
  const bridgeRowByResult = byId(bridgePayload.review_bridge_readable_payload.review_rows, "review_result_id");
  const taxonomyIndex = buildTaxonomyIndex(taxonomy);
  assertRouteGuardsFalse(bundle.readonly_artifacts.review_session_draft.route_guards, "bundle.review_session_draft");

  const displayRows = bundle.readonly_artifacts.review_session_draft.review_result_ids.map((reviewResultId) => {
    const record = protocolByResult.get(reviewResultId);
    const bundleRecord = bundleByResult.get(reviewResultId);
    const imageCase = imageCaseByResult.get(reviewResultId);
    const accumulationRecord = accumulationByResult.get(reviewResultId);
    const bridgeRow = bridgeRowByResult.get(reviewResultId);
    assert(record && bundleRecord && imageCase && accumulationRecord && bridgeRow, `${reviewResultId} must resolve across all bundle artifacts`);
    assert(record.candidate_id === bundleRecord.candidate_id && record.candidate_id === imageCase.candidate_id, `${reviewResultId} candidate_id mismatch`);
    assert(record.outcome === bundleRecord.outcome && record.outcome === imageCase.visible_outcome && record.outcome === bridgeRow.outcome, `${reviewResultId} outcome mismatch`);
    assert(record.metadata_accumulation.next_review_action === imageCase.next_review_action, `${reviewResultId} next review action mismatch`);
    assert(accumulationRecord.write_allowed_now === false, `${reviewResultId} accumulation record must be read-only`);
    assertRouteGuardsFalse(record.route_guards, reviewResultId);

    const taxonomyDisplay = (record.failure_tags || []).map((tag) => {
      const taxonomyEntry = taxonomyIndex.get(tag);
      assert(taxonomyEntry, `${reviewResultId} unknown taxonomy tag: ${tag}`);
      return taxonomyEntry;
    });

    return {
      review_result_id: reviewResultId,
      candidate_id: record.candidate_id,
      session_id: record.session_id,
      case_id: record.case_id,
      outcome: record.outcome,
      summary: record.summary,
      reasons: selectReasons(record),
      positive_reasons: clone(record.positive_reasons),
      failure_taxonomy: taxonomyDisplay,
      blocking_watch_items: clone(record.blocking_watch_items),
      watch_items: clone(record.watch_items),
      next_review_action: record.metadata_accumulation.next_review_action,
      metadata_accumulation_action: selectPrimaryAction(record.metadata_accumulation),
      never_production_reason: record.never_production_reason,
    };
  });

  const outcomeSummary = Object.fromEntries(expectedOutcomes.map((outcome) => [
    outcome,
    displayRows.filter((row) => row.outcome === outcome).length,
  ]));

  return {
    consumer_payload_id: "visual_eval_readonly_review_bundle_consumer_v1_synthetic_001",
    consumer_payload_type: "metadata_only_visual_eval_readonly_review_bundle_consumer",
    status: "readonly_consumer_payload_ready",
    source_bundle: bundlePath,
    session: {
      session_id: bundle.readonly_artifacts.review_session_draft.session_id,
      status: bundle.readonly_artifacts.review_session_draft.status,
      outcome_summary: outcomeSummary,
      display_row_count: displayRows.length,
    },
    display_rows: displayRows,
    guard: { ...consumerGuard },
  };
}

function parseArgValue(argv, flag, fallback) {
  const index = argv.indexOf(flag);
  return index >= 0 ? argv[index + 1] : fallback;
}

function main() {
  const argv = process.argv.slice(2);
  const payload = loadReadonlyReviewBundleConsumer({
    bundlePath: parseArgValue(argv, "--bundle", defaultBundlePath),
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
  consumerGuard,
  loadReadonlyReviewBundleConsumer,
};
