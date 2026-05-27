#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const defaultReviewResultPath = "tests/schema_examples/visual_eval_review_result_protocol.example.json";
const defaultTaxonomyPath = "tests/schema_examples/visual_eval_failure_taxonomy.example.json";
const defaultAccumulationPath = "tests/schema_examples/visual_eval_metadata_accumulation.example.json";

const routeGuardKeys = [
  "production_candidate_allowed_now",
  "accepted_samples_write_allowed_now",
  "memory_write_allowed_now",
  "provider_retry_allowed_now",
  "image_generation_allowed_now",
];
const expectedOutcomes = ["pass", "patch", "reject"];
const bridgeGuard = Object.freeze({
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

function sanitizeId(value) {
  assert(typeof value === "string" && value.trim(), "id must be a non-empty string");
  return value.replace(/[^A-Za-z0-9_-]+/g, "_").replace(/^_+|_+$/g, "");
}

function assertNoAbsoluteLocalPath(value, label) {
  if (typeof value === "string") {
    assert(!/(?:[A-Za-z]:[\\/]|\\\\|file:\/\/\/?[A-Za-z]:[\\/])/.test(value), `${label} must not contain an absolute local path`);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => assertNoAbsoluteLocalPath(item, `${label}.${index}`));
    return;
  }
  if (value && typeof value === "object") {
    Object.entries(value).forEach(([key, item]) => assertNoAbsoluteLocalPath(item, `${label}.${key}`));
  }
}

function assertAllRouteGuardsFalse(routeGuards, label) {
  assert(routeGuards && typeof routeGuards === "object" && !Array.isArray(routeGuards), `${label}.route_guards must be an object`);
  const keys = Object.keys(routeGuards);
  assert(keys.length === routeGuardKeys.length, `${label}.route_guards key count mismatch`);
  for (const key of keys) {
    assert(routeGuardKeys.includes(key), `${label}.route_guards unknown key: ${key}`);
  }
  for (const key of routeGuardKeys) {
    assert(routeGuards[key] === false, `${label}.route_guards.${key} must be false`);
  }
}

function buildTaxonomyTagSet(taxonomyArtifact) {
  assert(taxonomyArtifact.artifact_type === "canonical_visual_eval_failure_taxonomy", "taxonomy artifact_type mismatch");
  assert(taxonomyArtifact.canonical_status === "canonical_metadata_only", "taxonomy must be canonical_metadata_only");
  assertAllRouteGuardsFalse(taxonomyArtifact.route_guards, "taxonomy");
  const tagSet = new Set();
  for (const category of taxonomyArtifact.categories || []) {
    for (const tag of category.failure_tags || []) {
      tagSet.add(tag.tag_id);
    }
  }
  assert(tagSet.size > 0, "taxonomy must expose failure tags");
  return tagSet;
}

function validateReviewResultFixture(reviewResultFixture, taxonomyArtifact, accumulationArtifact, refs) {
  assertNoAbsoluteLocalPath(reviewResultFixture, "review_result_fixture");
  assert(reviewResultFixture.fixture_type === "metadata_only_visual_eval_review_result_protocol", "review result fixture_type mismatch");
  assert(Array.isArray(reviewResultFixture.review_results), "review_results must be an array");
  assert(accumulationArtifact.source_review_result_protocol === refs.reviewResultPath, "accumulation source protocol mismatch");
  assert(accumulationArtifact.source_taxonomy === refs.taxonomyPath, "accumulation source taxonomy mismatch");
  assertAllRouteGuardsFalse(accumulationArtifact.route_guards, "metadata_accumulation");

  const taxonomyTags = buildTaxonomyTagSet(taxonomyArtifact);
  const outcomes = reviewResultFixture.review_results.map((record) => record.outcome);
  assert(expectedOutcomes.every((outcome) => outcomes.includes(outcome)) && outcomes.length === expectedOutcomes.length, "outcome set must be exactly pass, patch, reject");

  for (const record of reviewResultFixture.review_results) {
    assert(typeof record.session_id === "string" && record.session_id.trim(), `${record.review_result_id}.session_id is required`);
    assert(typeof record.case_id === "string" && record.case_id.trim(), `${record.review_result_id}.case_id is required`);
    assert(record.taxonomy_ref === refs.taxonomyPath, `${record.review_result_id}.taxonomy_ref must point to canonical taxonomy`);
    assert(record.accumulation_ref === refs.accumulationPath, `${record.review_result_id}.accumulation_ref must point to canonical accumulation contract`);
    assert(expectedOutcomes.includes(record.outcome), `unknown outcome: ${record.outcome}`);
    assertAllRouteGuardsFalse(record.route_guards, record.review_result_id);
    for (const taxonomyRef of record.taxonomy_refs || []) {
      assert(taxonomyRef === refs.taxonomyPath, `taxonomy ref must point to canonical taxonomy: ${taxonomyRef}`);
    }
    for (const tag of record.failure_tags || []) {
      assert(taxonomyTags.has(tag), `unknown failure tag: ${tag}`);
    }
  }
}

function summarizeOutcomes(reviewResults) {
  const summary = { pass: 0, patch: 0, reject: 0 };
  for (const record of reviewResults) {
    summary[record.outcome] += 1;
  }
  return summary;
}

function buildReviewRow(record) {
  return {
    review_result_id: record.review_result_id,
    candidate_id: record.candidate_id,
    session_id: record.session_id,
    case_id: record.case_id,
    taxonomy_ref: record.taxonomy_ref,
    accumulation_ref: record.accumulation_ref,
    outcome: record.outcome,
    confidence_band: record.confidence_band,
    summary: record.summary,
    failure_tags: clone(record.failure_tags),
    taxonomy_refs: clone(record.taxonomy_refs),
    route_guards: clone(record.route_guards),
  };
}

function buildImageCaseDraft(record) {
  return {
    case_id: record.case_id,
    session_id: record.session_id,
    candidate_id: record.candidate_id,
    review_result_id: record.review_result_id,
    source_ref: record.source_ref,
    visible_outcome: record.outcome,
    review_status: `metadata_only_${record.outcome}`,
    patch_required: record.outcome === "patch",
    never_production: record.outcome === "reject",
    failure_tags: clone(record.failure_tags),
    taxonomy_refs: clone(record.taxonomy_refs),
    bounded_patch_scope: clone(record.bounded_patch_scope),
    blocking_watch_items: clone(record.blocking_watch_items),
    route_guards: clone(record.route_guards),
  };
}

function buildMetadataAccumulationRecord(record) {
  return {
    review_result_id: record.review_result_id,
    session_id: record.session_id,
    case_id: record.case_id,
    candidate_id: record.candidate_id,
    accumulation_ref: record.accumulation_ref,
    outcome: record.outcome,
    metadata_accumulation: clone(record.metadata_accumulation),
    write_allowed_now: false,
    consumer_status: "readonly_draft",
  };
}

function buildVisualEvalReviewResultBridgePayload(input) {
  const refs = {
    reviewResultPath: input.reviewResultPath || defaultReviewResultPath,
    taxonomyPath: input.taxonomyPath || defaultTaxonomyPath,
    accumulationPath: input.accumulationPath || defaultAccumulationPath,
  };
  const reviewResultFixture = input.reviewResultFixture || readJson(refs.reviewResultPath);
  const taxonomyArtifact = input.taxonomyArtifact || readJson(refs.taxonomyPath);
  const accumulationArtifact = input.accumulationArtifact || readJson(refs.accumulationPath);
  validateReviewResultFixture(reviewResultFixture, taxonomyArtifact, accumulationArtifact, refs);

  const reviewRows = reviewResultFixture.review_results.map(buildReviewRow);
  const imageCaseDrafts = reviewResultFixture.review_results.map(buildImageCaseDraft);
  const outcomeSummary = summarizeOutcomes(reviewResultFixture.review_results);
  const sessionIds = [...new Set(reviewResultFixture.review_results.map((record) => record.session_id))];
  assert(sessionIds.length === 1, "review_result fixture must describe exactly one readonly session");

  return {
    payload_id: "visual_eval_review_result_bridge_payload_v1_synthetic_001",
    payload_type: "metadata_only_visual_eval_review_result_bridge_payload",
    status: "readonly_bridge_payload_ready",
    source_refs: {
      review_result_protocol: refs.reviewResultPath,
      taxonomy: refs.taxonomyPath,
      metadata_accumulation: refs.accumulationPath,
    },
    outcome_summary: outcomeSummary,
    review_bridge_readable_payload: {
      display_only: true,
      review_rows: reviewRows,
    },
    review_session_draft: {
      session_id: sessionIds[0],
      status: "draft_readonly",
      outcome_summary: outcomeSummary,
      final_outcomes_visible: expectedOutcomes,
      review_rows: reviewRows,
      route_guards: clone(reviewResultFixture.shared_route_guards),
    },
    image_case_drafts: imageCaseDrafts,
    metadata_accumulation_draft: {
      source_contract: refs.accumulationPath,
      status: "draft_readonly",
      records: reviewResultFixture.review_results.map(buildMetadataAccumulationRecord),
      route_guards: clone(accumulationArtifact.route_guards),
    },
    guard: { ...bridgeGuard },
  };
}

function parseArgValue(argv, flag, fallback) {
  const index = argv.indexOf(flag);
  return index >= 0 ? argv[index + 1] : fallback;
}

function main() {
  const argv = process.argv.slice(2);
  const payload = buildVisualEvalReviewResultBridgePayload({
    reviewResultPath: parseArgValue(argv, "--input", defaultReviewResultPath),
    taxonomyPath: parseArgValue(argv, "--taxonomy", defaultTaxonomyPath),
    accumulationPath: parseArgValue(argv, "--metadata-accumulation", defaultAccumulationPath),
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
  bridgeGuard,
  buildVisualEvalReviewResultBridgePayload,
  validateReviewResultFixture,
};
