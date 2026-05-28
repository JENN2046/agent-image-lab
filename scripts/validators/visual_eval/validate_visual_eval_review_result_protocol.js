#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "../../..");
const protocolFixturePath = "tests/schema_examples/visual_eval_review_result_protocol.example.json";
const negativeCasesPath = "tests/schema_examples/visual_eval_review_result_protocol_negative_cases.example.json";
const taxonomyArtifactPath = "tests/schema_examples/visual_eval_failure_taxonomy.example.json";
const metadataAccumulationPath = "tests/schema_examples/visual_eval_metadata_accumulation.example.json";

const expectedFixtureType = "metadata_only_visual_eval_review_result_protocol";
const expectedNegativeFixtureType = "metadata_only_visual_eval_review_result_protocol_negative_cases";
const expectedOutcomes = ["pass", "patch", "reject"];
const expectedFrozenFields = [
  "review_result_id",
  "candidate_id",
  "session_id",
  "case_id",
  "source_ref",
  "taxonomy_ref",
  "accumulation_ref",
  "outcome",
  "confidence_band",
  "reviewer_role",
  "reviewed_at",
  "summary",
  "positive_reasons",
  "pass_reasons",
  "patch_reasons",
  "reject_reasons",
  "watch_items",
  "remaining_watch_items",
  "failure_tags",
  "taxonomy_refs",
  "bounded_patch_scope",
  "blocking_watch_items",
  "never_production_reason",
  "route_guards",
  "metadata_accumulation",
];
const expectedRouteGuardKeys = [
  "production_candidate_allowed_now",
  "accepted_samples_write_allowed_now",
  "memory_write_allowed_now",
  "provider_retry_allowed_now",
  "image_generation_allowed_now",
];
const allowedMetadataActions = {
  accepted_metadata_action: [
    "none",
    "keep_as_metadata_candidate",
    "queue_for_future_human_review",
    "archive_as_positive_reference",
  ],
  rejected_metadata_action: [
    "none",
    "keep_as_failure_learning_metadata",
    "archive_as_negative_reference",
    "defer_until_taxonomy_update",
  ],
  archive_reference_action: [
    "none",
    "metadata_only_reference",
    "archive_as_positive_reference",
    "archive_as_negative_reference",
  ],
  next_review_action: [
    "queue_for_future_human_review",
    "write_patch_plan_only",
    "defer_until_taxonomy_update",
  ],
};
const expectedTaxonomyCategories = [
  "subject_identity",
  "commercial_usability",
  "material_realism",
  "lighting_consistency",
  "composition",
  "edge_or_mask_artifact",
  "background_contamination",
  "style_mismatch",
  "brand_mismatch",
  "other_blocking_failure",
];
const expectedSeverityLevels = ["blocking", "patchable", "advisory"];
const expectedAccumulationRecordKinds = [
  "accepted_metadata_candidate",
  "rejected_failure_learning_metadata",
  "archive_reference_action",
  "next_review_action",
];
let knownTaxonomyRefs = new Set([taxonomyArtifactPath]);
let knownFailureTags = new Set();
const expectedNegativeCases = new Map([
  ["missing_reject_failure_tags", "reject_failure_tags_required"],
  ["patch_missing_blocking_watch_items", "patch_blocking_watch_items_required"],
  ["pass_with_reject_reasons", "pass_reject_reasons_must_be_empty"],
  ["write_guard_memory_true", "route_guard_must_be_false"],
  ["absolute_local_source_ref", "absolute_local_path_forbidden"],
  ["unknown_taxonomy_ref", "unknown_taxonomy_ref_forbidden"],
  ["unknown_primary_taxonomy_ref", "unknown_taxonomy_ref_forbidden"],
  ["unknown_accumulation_ref", "unknown_accumulation_ref_forbidden"],
  ["unknown_failure_tag", "unknown_failure_tag_forbidden"],
  ["reject_missing_never_production_reason", "reject_never_production_reason_required"],
  ["unknown_route_guard_key", "unknown_route_guard_key_forbidden"],
  ["illegal_metadata_accumulation_action", "illegal_metadata_accumulation_action"],
]);

const results = [];
const errors = [];

function repoPath(relativePath) {
  const resolved = path.resolve(root, relativePath);
  const relative = path.relative(root, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`path escapes repository root: ${relativePath}`);
  }
  return resolved;
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(repoPath(relativePath), "utf8"));
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function sameSet(actual, expected) {
  return (
    Array.isArray(actual) &&
    actual.length === expected.length &&
    expected.every((item) => actual.includes(item))
  );
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isNonEmptyArray(value) {
  return Array.isArray(value) && value.length > 0;
}

function hasAbsoluteLocalPath(value) {
  if (typeof value === "string") {
    return /(?:[A-Za-z]:[\\/]|\\\\|file:\/\/\/?[A-Za-z]:[\\/]|<synthetic-windows-absolute-path>)/.test(value);
  }
  if (Array.isArray(value)) {
    return value.some((item) => hasAbsoluteLocalPath(item));
  }
  if (value && typeof value === "object") {
    return Object.values(value).some((item) => hasAbsoluteLocalPath(item));
  }
  return false;
}

function createContext() {
  const localErrors = [];
  const localCodes = [];
  return {
    fail(code, detail) {
      localCodes.push(code);
      localErrors.push({ code, detail });
    },
    get ok() {
      return localErrors.length === 0;
    },
    get codes() {
      return localCodes;
    },
    get errors() {
      return localErrors;
    },
  };
}

function addResult(check, passed, detail) {
  const result = { check, passed: Boolean(passed) };
  if (detail) result.detail = detail;
  results.push(result);
  if (!passed) {
    errors.push({ check, detail: detail || "check failed" });
  }
}

function validateRouteGuards(routeGuards, ctx, label) {
  if (!routeGuards || typeof routeGuards !== "object" || Array.isArray(routeGuards)) {
    ctx.fail("route_guards_required", `${label}: route_guards must be an object`);
    return;
  }

  const keys = Object.keys(routeGuards);
  for (const key of keys) {
    if (!expectedRouteGuardKeys.includes(key)) {
      ctx.fail("unknown_route_guard_key_forbidden", `${label}: unexpected route guard ${key}`);
    }
  }
  for (const key of expectedRouteGuardKeys) {
    if (!(key in routeGuards)) {
      ctx.fail("route_guard_key_missing", `${label}: missing route guard ${key}`);
    } else if (routeGuards[key] !== false) {
      ctx.fail("route_guard_must_be_false", `${label}: ${key} must be false`);
    }
  }
}

function validateMetadataAccumulation(metadata, ctx, label) {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    ctx.fail("metadata_accumulation_required", `${label}: metadata_accumulation must be an object`);
    return;
  }

  const keys = Object.keys(metadata);
  for (const key of keys) {
    if (!Object.prototype.hasOwnProperty.call(allowedMetadataActions, key)) {
      ctx.fail("illegal_metadata_accumulation_action", `${label}: unexpected metadata action key ${key}`);
    }
  }
  for (const [key, allowed] of Object.entries(allowedMetadataActions)) {
    if (!allowed.includes(metadata[key])) {
      ctx.fail("illegal_metadata_accumulation_action", `${label}: ${key} has illegal value ${metadata[key]}`);
    }
  }
}

function validateTaxonomyRefs(refs, ctx, label, required) {
  if (!Array.isArray(refs)) {
    ctx.fail("taxonomy_refs_required", `${label}: taxonomy_refs must be an array`);
    return;
  }
  if (required && refs.length === 0) {
    ctx.fail("reject_taxonomy_refs_required", `${label}: taxonomy_refs required`);
  }
  for (const ref of refs) {
    if (!isNonEmptyString(ref)) {
      ctx.fail("taxonomy_ref_non_empty", `${label}: taxonomy ref must be non-empty`);
    } else if (!knownTaxonomyRefs.has(ref)) {
      ctx.fail("unknown_taxonomy_ref_forbidden", `${label}: unknown taxonomy ref ${ref}`);
    }
  }
}

function validateCanonicalArtifactRefs(record, ctx, label) {
  if (record.taxonomy_ref !== taxonomyArtifactPath) {
    ctx.fail("unknown_taxonomy_ref_forbidden", `${label}: taxonomy_ref must point to ${taxonomyArtifactPath}`);
  }
  if (record.accumulation_ref !== metadataAccumulationPath) {
    ctx.fail("unknown_accumulation_ref_forbidden", `${label}: accumulation_ref must point to ${metadataAccumulationPath}`);
  }
  if (Array.isArray(record.taxonomy_refs)) {
    for (const ref of record.taxonomy_refs) {
      if (ref !== record.taxonomy_ref) {
        ctx.fail("taxonomy_refs_must_match_primary_ref", `${label}: taxonomy_refs entry does not match taxonomy_ref`);
      }
    }
  }
}

function validateFailureTags(tags, ctx, label) {
  if (!Array.isArray(tags)) {
    ctx.fail("failure_tags_array_required", `${label}: failure_tags must be an array`);
    return;
  }
  for (const tag of tags) {
    if (!isNonEmptyString(tag)) {
      ctx.fail("failure_tag_non_empty", `${label}: failure tag must be non-empty`);
    } else if (!knownFailureTags.has(tag)) {
      ctx.fail("unknown_failure_tag_forbidden", `${label}: unknown failure tag ${tag}`);
    }
  }
}

function validateReviewResult(record, ctx) {
  const label = record?.review_result_id || "<missing-review-result-id>";
  if (!record || typeof record !== "object" || Array.isArray(record)) {
    ctx.fail("review_result_object_required", "review result must be an object");
    return;
  }

  for (const field of expectedFrozenFields) {
    if (!Object.prototype.hasOwnProperty.call(record, field)) {
      ctx.fail("review_result_required_field_missing", `${label}: missing ${field}`);
    }
  }

  if (!expectedOutcomes.includes(record.outcome)) {
    ctx.fail("unknown_outcome_forbidden", `${label}: unsupported outcome ${record.outcome}`);
  }
  if (!isNonEmptyString(record.review_result_id)) {
    ctx.fail("review_result_id_required", `${label}: review_result_id required`);
  }
  if (!isNonEmptyString(record.candidate_id)) {
    ctx.fail("candidate_id_required", `${label}: candidate_id required`);
  }
  if (!isNonEmptyString(record.session_id)) {
    ctx.fail("session_id_required", `${label}: session_id required`);
  }
  if (!isNonEmptyString(record.case_id)) {
    ctx.fail("case_id_required", `${label}: case_id required`);
  }
  if (!isNonEmptyString(record.source_ref)) {
    ctx.fail("source_ref_required", `${label}: source_ref required`);
  }
  if (hasAbsoluteLocalPath(record.source_ref)) {
    ctx.fail("absolute_local_path_forbidden", `${label}: source_ref must be repo-relative or redacted`);
  }

  validateRouteGuards(record.route_guards, ctx, label);
  validateMetadataAccumulation(record.metadata_accumulation, ctx, label);
  validateCanonicalArtifactRefs(record, ctx, label);
  validateTaxonomyRefs(record.taxonomy_refs, ctx, label, record.outcome === "reject");
  validateFailureTags(record.failure_tags, ctx, label);

  if (record.outcome === "pass") {
    if (!isNonEmptyArray(record.pass_reasons)) {
      ctx.fail("pass_reasons_required", `${label}: pass requires pass_reasons`);
    }
    if (Array.isArray(record.reject_reasons) && record.reject_reasons.length > 0) {
      ctx.fail("pass_reject_reasons_must_be_empty", `${label}: pass must not carry reject_reasons`);
    }
    if (record.never_production_reason !== null) {
      ctx.fail("pass_never_production_reason_must_be_null", `${label}: pass never_production_reason must be null`);
    }
  }

  if (record.outcome === "patch") {
    if (!isNonEmptyArray(record.patch_reasons)) {
      ctx.fail("patch_reasons_required", `${label}: patch requires patch_reasons`);
    }
    if (!isNonEmptyArray(record.blocking_watch_items)) {
      ctx.fail("patch_blocking_watch_items_required", `${label}: patch requires blocking_watch_items`);
    }
    if (!isNonEmptyArray(record.bounded_patch_scope)) {
      ctx.fail("patch_bounded_patch_scope_required", `${label}: patch requires bounded_patch_scope`);
    }
    if (record.never_production_reason !== null) {
      ctx.fail("patch_never_production_reason_must_be_null", `${label}: patch never_production_reason must be null`);
    }
    if (
      record.metadata_accumulation?.accepted_metadata_action !== "none" ||
      record.metadata_accumulation?.rejected_metadata_action !== "none"
    ) {
      ctx.fail("patch_metadata_accumulation_write_action_forbidden", `${label}: patch cannot open accepted or rejected metadata write routes`);
    }
  }

  if (record.outcome === "reject") {
    if (!isNonEmptyArray(record.reject_reasons)) {
      ctx.fail("reject_reasons_required", `${label}: reject requires reject_reasons`);
    }
    if (!isNonEmptyArray(record.failure_tags)) {
      ctx.fail("reject_failure_tags_required", `${label}: reject requires failure_tags`);
    }
    if (!isNonEmptyArray(record.taxonomy_refs)) {
      ctx.fail("reject_taxonomy_refs_required", `${label}: reject requires taxonomy_refs`);
    }
    if (!isNonEmptyString(record.never_production_reason)) {
      ctx.fail("reject_never_production_reason_required", `${label}: reject requires never_production_reason`);
    }
  }
}

function validateFixture(fixture) {
  const ctx = createContext();

  if (!fixture || typeof fixture !== "object" || Array.isArray(fixture)) {
    ctx.fail("fixture_object_required", "fixture root must be an object");
    return ctx;
  }
  if (fixture.fixture_type !== expectedFixtureType) {
    ctx.fail("fixture_type_expected", `fixture_type must be ${expectedFixtureType}`);
  }
  if (!fixture.protocol_freeze || fixture.protocol_freeze.protocol_status !== "frozen_validator_ready") {
    ctx.fail("protocol_freeze_expected", "protocol must be frozen_validator_ready");
  }
  if (!sameSet(fixture.frozen_field_set, expectedFrozenFields)) {
    ctx.fail("frozen_field_set_exact", "frozen_field_set must match the v1 review result fields exactly");
  }
  if (!sameSet(fixture.route_guard_contract?.allowed_route_guard_keys, expectedRouteGuardKeys)) {
    ctx.fail("route_guard_contract_exact", "route_guard_contract must match exact key set");
  }
  if (fixture.route_guard_contract?.all_route_guard_values_must_be_false !== true) {
    ctx.fail("route_guard_values_must_be_false_contract", "route guard contract must require false values");
  }
  if (fixture.canonical_artifact_refs?.taxonomy_ref !== taxonomyArtifactPath) {
    ctx.fail("canonical_taxonomy_ref_expected", "canonical_artifact_refs.taxonomy_ref must point to the taxonomy artifact");
  }
  if (fixture.canonical_artifact_refs?.accumulation_ref !== metadataAccumulationPath) {
    ctx.fail("canonical_accumulation_ref_expected", "canonical_artifact_refs.accumulation_ref must point to the metadata accumulation artifact");
  }
  if (fixture.cross_reference_contract?.review_result_id_unique !== true) {
    ctx.fail("cross_reference_contract_expected", "review_result_id uniqueness must be required");
  }
  if (fixture.cross_reference_contract?.candidate_id_unique !== true) {
    ctx.fail("cross_reference_contract_expected", "candidate_id uniqueness must be required");
  }
  if (fixture.cross_reference_contract?.case_id_unique !== true) {
    ctx.fail("cross_reference_contract_expected", "case_id uniqueness must be required");
  }
  if (hasAbsoluteLocalPath(fixture)) {
    ctx.fail("absolute_local_path_forbidden", "fixture must not contain absolute local paths");
  }
  if (!Array.isArray(fixture.review_results)) {
    ctx.fail("review_results_array_required", "review_results must be an array");
    return ctx;
  }

  const outcomes = fixture.review_results.map((record) => record?.outcome);
  if (!sameSet(outcomes, expectedOutcomes)) {
    ctx.fail("outcome_set_exact_pass_patch_reject", "outcome set must be exactly pass, patch, reject");
  }
  for (const field of ["review_result_id", "candidate_id", "case_id"]) {
    const values = fixture.review_results.map((record) => record?.[field]);
    if (new Set(values).size !== values.length) {
      ctx.fail("cross_reference_id_uniqueness_required", `${field} values must be unique`);
    }
  }

  for (const record of fixture.review_results) {
    validateReviewResult(record, ctx);
  }
  return ctx;
}

function validateTaxonomyArtifact(taxonomy) {
  const ctx = createContext();
  const tagSet = new Set();

  if (!taxonomy || typeof taxonomy !== "object" || Array.isArray(taxonomy)) {
    ctx.fail("taxonomy_artifact_object_required", "taxonomy artifact root must be an object");
    return { ctx, tagSet };
  }
  if (taxonomy.artifact_type !== "canonical_visual_eval_failure_taxonomy") {
    ctx.fail("taxonomy_artifact_type_expected", "taxonomy artifact_type must be canonical_visual_eval_failure_taxonomy");
  }
  if (taxonomy.version !== "v1") {
    ctx.fail("taxonomy_version_v1_required", "taxonomy version must be v1");
  }
  if (taxonomy.canonical_status !== "canonical_metadata_only") {
    ctx.fail("taxonomy_canonical_status_required", "taxonomy must be canonical_metadata_only");
  }
  if (!sameSet(taxonomy.required_categories, expectedTaxonomyCategories)) {
    ctx.fail("taxonomy_required_categories_exact", "taxonomy required_categories must match v1 category set");
  }
  if (!sameSet(taxonomy.severity_levels, expectedSeverityLevels)) {
    ctx.fail("taxonomy_severity_levels_exact", "taxonomy severity levels must be blocking, patchable, advisory");
  }
  if (hasAbsoluteLocalPath(taxonomy)) {
    ctx.fail("absolute_local_path_forbidden", "taxonomy artifact must not contain absolute local paths");
  }
  validateRouteGuards(taxonomy.route_guards, ctx, "taxonomy_artifact");

  if (!Array.isArray(taxonomy.categories)) {
    ctx.fail("taxonomy_categories_array_required", "taxonomy categories must be an array");
    return { ctx, tagSet };
  }

  const categoryIds = taxonomy.categories.map((category) => category?.category_id);
  if (!sameSet(categoryIds, expectedTaxonomyCategories)) {
    ctx.fail("taxonomy_categories_exact", "taxonomy categories must match v1 category set");
  }

  for (const category of taxonomy.categories) {
    const label = category?.category_id || "<missing-category-id>";
    if (!expectedTaxonomyCategories.includes(category?.category_id)) {
      ctx.fail("unknown_taxonomy_category_forbidden", `unknown taxonomy category ${label}`);
    }
    if (!isNonEmptyString(category?.definition)) {
      ctx.fail("taxonomy_category_definition_required", `${label}: definition required`);
    }
    if (!Array.isArray(category?.failure_tags) || category.failure_tags.length === 0) {
      ctx.fail("taxonomy_category_failure_tags_required", `${label}: failure_tags required`);
      continue;
    }
    for (const tag of category.failure_tags) {
      if (!isNonEmptyString(tag?.tag_id)) {
        ctx.fail("taxonomy_failure_tag_id_required", `${label}: tag_id required`);
        continue;
      }
      if (tagSet.has(tag.tag_id)) {
        ctx.fail("taxonomy_duplicate_failure_tag_forbidden", `${label}: duplicate tag ${tag.tag_id}`);
      }
      tagSet.add(tag.tag_id);
      if (!expectedSeverityLevels.includes(tag.severity)) {
        ctx.fail("taxonomy_failure_tag_severity_expected", `${tag.tag_id}: invalid severity ${tag.severity}`);
      }
      if (!expectedOutcomes.includes(tag.default_outcome)) {
        ctx.fail("taxonomy_failure_tag_default_outcome_expected", `${tag.tag_id}: invalid outcome ${tag.default_outcome}`);
      }
    }
  }

  return { ctx, tagSet };
}

function validateMetadataAccumulationArtifact(artifact) {
  const ctx = createContext();

  if (!artifact || typeof artifact !== "object" || Array.isArray(artifact)) {
    ctx.fail("metadata_accumulation_artifact_object_required", "metadata accumulation artifact root must be an object");
    return ctx;
  }
  if (artifact.artifact_type !== "metadata_only_visual_eval_metadata_accumulation_contract") {
    ctx.fail("metadata_accumulation_artifact_type_expected", "metadata accumulation artifact_type mismatch");
  }
  if (artifact.version !== "v1") {
    ctx.fail("metadata_accumulation_version_v1_required", "metadata accumulation version must be v1");
  }
  if (artifact.source_review_result_protocol !== protocolFixturePath) {
    ctx.fail("metadata_accumulation_protocol_ref_expected", "metadata accumulation source protocol mismatch");
  }
  if (artifact.source_taxonomy !== taxonomyArtifactPath) {
    ctx.fail("metadata_accumulation_taxonomy_ref_expected", "metadata accumulation source taxonomy mismatch");
  }
  if (hasAbsoluteLocalPath(artifact)) {
    ctx.fail("absolute_local_path_forbidden", "metadata accumulation artifact must not contain absolute local paths");
  }
  validateRouteGuards(artifact.route_guards, ctx, "metadata_accumulation_artifact");

  for (const [key, expected] of Object.entries(allowedMetadataActions)) {
    if (!sameSet(artifact.allowed_actions?.[key], expected)) {
      ctx.fail("metadata_accumulation_action_allowlist_exact", `${key}: allowlist mismatch`);
    }
  }

  if (!Array.isArray(artifact.accumulation_records)) {
    ctx.fail("metadata_accumulation_records_array_required", "accumulation_records must be an array");
    return ctx;
  }
  const recordKinds = artifact.accumulation_records.map((record) => record?.record_kind);
  if (!sameSet(recordKinds, expectedAccumulationRecordKinds)) {
    ctx.fail("metadata_accumulation_record_kinds_exact", "accumulation record kinds must match v1 set");
  }
  for (const record of artifact.accumulation_records) {
    const label = record?.record_kind || "<missing-record-kind>";
    if (record.write_allowed_now !== false) {
      ctx.fail("metadata_accumulation_write_must_be_false", `${label}: write_allowed_now must be false`);
    }
    const allowedActionKnown = Object.values(allowedMetadataActions).some((allowed) =>
      allowed.includes(record?.allowed_action)
    );
    if (!allowedActionKnown) {
      ctx.fail("illegal_metadata_accumulation_action", `${label}: unknown allowed_action ${record?.allowed_action}`);
    }
    if (!isNonEmptyString(record.consumer_intent)) {
      ctx.fail("metadata_accumulation_consumer_intent_required", `${label}: consumer_intent required`);
    }
  }
  return ctx;
}

function setByPath(target, fieldPath, value) {
  const segments = fieldPath.split(".");
  let cursor = target;
  for (let index = 0; index < segments.length - 1; index += 1) {
    const segment = segments[index];
    if (!cursor[segment] || typeof cursor[segment] !== "object" || Array.isArray(cursor[segment])) {
      cursor[segment] = {};
    }
    cursor = cursor[segment];
  }
  cursor[segments[segments.length - 1]] = value;
}

function applyMutation(fixture, negativeCase) {
  const record = fixture.review_results.find(
    (item) => item.review_result_id === negativeCase.target_review_result_id
  );
  if (!record) {
    throw new Error(`negative case target not found: ${negativeCase.target_review_result_id}`);
  }
  setByPath(record, negativeCase.mutation.field, clone(negativeCase.mutation.value));
}

function validateNegativeCaseFixture(negativeCases) {
  addResult(
    "negative_cases_fixture_type_expected",
    negativeCases.fixture_type === expectedNegativeFixtureType,
    negativeCases.fixture_type
  );
  addResult("negative_cases_source_fixture_expected", negativeCases.source_fixture === protocolFixturePath);
  addResult("negative_cases_protocol_v1", negativeCases.protocol_version === "v1");
  addResult(
    "negative_cases_array_present",
    Array.isArray(negativeCases.negative_cases) && negativeCases.negative_cases.length === expectedNegativeCases.size
  );

  const cases = Array.isArray(negativeCases.negative_cases) ? negativeCases.negative_cases : [];
  for (const [caseId, expectedCode] of expectedNegativeCases.entries()) {
    const item = cases.find((candidate) => candidate.case_id === caseId);
    addResult(`negative_case_${caseId}_present`, Boolean(item));
    addResult(
      `negative_case_${caseId}_expected_code`,
      item?.expected_failure_code === expectedCode,
      item?.expected_failure_code
    );
  }
}

function runNegativeCases(protocolFixture, negativeCases) {
  const cases = negativeCases.negative_cases || [];
  for (const negativeCase of cases) {
    const mutated = clone(protocolFixture);
    applyMutation(mutated, negativeCase);
    const result = validateFixture(mutated);
    addResult(
      `negative_case_${negativeCase.case_id}_fails_closed`,
      result.ok === false,
      result.ok ? "negative case unexpectedly passed" : result.codes.join(", ")
    );
    addResult(
      `negative_case_${negativeCase.case_id}_expected_failure_code`,
      result.codes.includes(negativeCase.expected_failure_code),
      result.codes.join(", ")
    );
  }
}

for (const file of [protocolFixturePath, negativeCasesPath, taxonomyArtifactPath, metadataAccumulationPath]) {
  addResult(`${file}_exists`, fs.existsSync(repoPath(file)), file);
}

let protocolFixture = null;
let negativeCases = null;
let taxonomyArtifact = null;
let metadataAccumulationArtifact = null;

try {
  taxonomyArtifact = readJson(taxonomyArtifactPath);
  addResult("taxonomy_artifact_json_parseable", true);
} catch (error) {
  addResult("taxonomy_artifact_json_parseable", false, error.message);
}

try {
  metadataAccumulationArtifact = readJson(metadataAccumulationPath);
  addResult("metadata_accumulation_artifact_json_parseable", true);
} catch (error) {
  addResult("metadata_accumulation_artifact_json_parseable", false, error.message);
}

try {
  protocolFixture = readJson(protocolFixturePath);
  addResult("protocol_fixture_json_parseable", true);
} catch (error) {
  addResult("protocol_fixture_json_parseable", false, error.message);
}

try {
  negativeCases = readJson(negativeCasesPath);
  addResult("negative_cases_json_parseable", true);
} catch (error) {
  addResult("negative_cases_json_parseable", false, error.message);
}

if (taxonomyArtifact) {
  const result = validateTaxonomyArtifact(taxonomyArtifact);
  knownFailureTags = result.tagSet;
  knownTaxonomyRefs = new Set([taxonomyArtifactPath]);
  addResult(
    "taxonomy_artifact_canonical_case_passes",
    result.ctx.ok,
    result.ctx.errors.map((error) => `${error.code}: ${error.detail}`).join("; ")
  );
  addResult(
    "taxonomy_failure_tags_registered",
    knownFailureTags.size > 0,
    `${knownFailureTags.size} tags`
  );
}

if (metadataAccumulationArtifact) {
  const result = validateMetadataAccumulationArtifact(metadataAccumulationArtifact);
  addResult(
    "metadata_accumulation_artifact_case_passes",
    result.ok,
    result.errors.map((error) => `${error.code}: ${error.detail}`).join("; ")
  );
}

if (protocolFixture) {
  const result = validateFixture(protocolFixture);
  addResult(
    "protocol_fixture_positive_case_passes",
    result.ok,
    result.errors.map((error) => `${error.code}: ${error.detail}`).join("; ")
  );
}

if (negativeCases) {
  validateNegativeCaseFixture(negativeCases);
}

if (protocolFixture && negativeCases) {
  try {
    runNegativeCases(protocolFixture, negativeCases);
  } catch (error) {
    addResult("negative_case_runner_completed", false, error.message);
  }
}

const passed = errors.length === 0;
const summary = {
  validator: "validate_visual_eval_review_result_protocol",
  version: "v1",
  passed,
  files_checked: [protocolFixturePath, negativeCasesPath, taxonomyArtifactPath, metadataAccumulationPath],
  positive_fixture_validated: Boolean(protocolFixture),
  negative_cases_validated: Boolean(negativeCases),
  taxonomy_artifact_validated: Boolean(taxonomyArtifact),
  metadata_accumulation_artifact_validated: Boolean(metadataAccumulationArtifact),
  outcome_set_expected: expectedOutcomes,
  route_guard_keys_expected: expectedRouteGuardKeys,
  known_taxonomy_refs: [...knownTaxonomyRefs],
  known_failure_tag_count: knownFailureTags.size,
  check_count: results.length,
  failed_count: errors.length,
  metadata_only_boundaries: {
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    memory_written: false,
    daily_note_written: false,
    vcp_memory_written: false,
    production_candidate_002_started: false,
    batch_005_started: false,
    runtime_execution_performed: false,
  },
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exitCode = passed ? 0 : 1;
