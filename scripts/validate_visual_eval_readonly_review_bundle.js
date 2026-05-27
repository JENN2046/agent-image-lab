#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const bundlePath = "tests/schema_examples/visual_eval_readonly_review_bundle.example.json";
const negativeCasesPath = "tests/schema_examples/visual_eval_readonly_review_bundle_negative_cases.example.json";
const reviewResultPath = "tests/schema_examples/visual_eval_review_result_protocol.example.json";
const taxonomyPath = "tests/schema_examples/visual_eval_failure_taxonomy.example.json";
const accumulationPath = "tests/schema_examples/visual_eval_metadata_accumulation.example.json";
const bridgePayloadPath = "tests/schema_examples/visual_eval_review_result_review_bridge_payload.example.json";
const protocolValidatorPath = "scripts/validate_visual_eval_review_result_protocol.js";
const bridgeValidatorPath = "scripts/validate_visual_eval_review_result_review_bridge_wiring.js";

const expectedOutcomes = ["pass", "patch", "reject"];
const expectedRouteGuardKeys = [
  "production_candidate_allowed_now",
  "accepted_samples_write_allowed_now",
  "memory_write_allowed_now",
  "provider_retry_allowed_now",
  "image_generation_allowed_now",
];
const expectedNegativeCases = new Map([
  ["dangling_taxonomy_ref", "bundle_taxonomy_ref_mismatch"],
  ["session_candidate_id_mismatch", "session_candidate_ids_mismatch"],
  ["outcome_next_action_conflict", "metadata_accumulation_mismatch"],
  ["image_case_next_action_reintroduced", "image_case_next_action_over_owned"],
  ["write_guard_true", "route_guard_must_be_false"],
  ["absolute_local_path", "absolute_local_path_forbidden"],
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

function runNode(args) {
  return execFileSync(process.execPath, args, { cwd: root, encoding: "utf8" });
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function addResult(check, passed, detail) {
  const result = { check, passed: Boolean(passed) };
  if (detail) result.detail = detail;
  results.push(result);
  if (!passed) errors.push({ check, detail: detail || "check failed" });
}

function createContext() {
  const localErrors = [];
  return {
    fail(code, detail) {
      localErrors.push({ code, detail });
    },
    get ok() {
      return localErrors.length === 0;
    },
    get codes() {
      return localErrors.map((error) => error.code);
    },
    get errors() {
      return localErrors;
    },
  };
}

function hasAbsoluteOrLoopback(value) {
  if (typeof value === "string") {
    return /(?:[A-Za-z]:[\\/]|\\\\|file:\/\/\/?[A-Za-z]:[\\/]|<synthetic-windows-absolute-path>|(?:https?|wss?):\/\/(?:127\.0\.0\.1|localhost|\[::1\]|::1))/i.test(value);
  }
  if (Array.isArray(value)) return value.some((item) => hasAbsoluteOrLoopback(item));
  if (value && typeof value === "object") return Object.values(value).some((item) => hasAbsoluteOrLoopback(item));
  return false;
}

function sameArray(actual, expected) {
  return Array.isArray(actual) && actual.length === expected.length && expected.every((item) => actual.includes(item));
}

function assertRouteGuardsFalse(routeGuards, ctx, label) {
  if (!routeGuards || typeof routeGuards !== "object" || Array.isArray(routeGuards)) {
    ctx.fail("route_guards_required", `${label}: route_guards must be an object`);
    return;
  }
  const keys = Object.keys(routeGuards);
  for (const key of keys) {
    if (!expectedRouteGuardKeys.includes(key)) {
      ctx.fail("unknown_route_guard_key_forbidden", `${label}: unknown route guard ${key}`);
    }
  }
  for (const key of expectedRouteGuardKeys) {
    if (routeGuards[key] !== false) {
      ctx.fail("route_guard_must_be_false", `${label}: ${key} must be false`);
    }
  }
}

function byId(items, field) {
  return new Map((items || []).map((item) => [item[field], item]));
}

function validateSourceRefs(bundle, ctx) {
  const refs = bundle.source_refs || {};
  if (refs.review_result_protocol !== reviewResultPath) {
    ctx.fail("bundle_review_result_ref_mismatch", "review result protocol ref mismatch");
  }
  if (refs.taxonomy !== taxonomyPath) {
    ctx.fail("bundle_taxonomy_ref_mismatch", "taxonomy ref mismatch");
  }
  if (refs.metadata_accumulation !== accumulationPath) {
    ctx.fail("bundle_accumulation_ref_mismatch", "metadata accumulation ref mismatch");
  }
  if (refs.bridge_payload !== bridgePayloadPath) {
    ctx.fail("bundle_bridge_payload_ref_mismatch", "bridge payload ref mismatch");
  }
  for (const ref of Object.values(refs)) {
    if (typeof ref !== "string" || !fs.existsSync(repoPath(ref))) {
      ctx.fail("bundle_source_ref_missing", `missing source ref: ${ref}`);
    }
  }
}

function validateBoundary(bundle, ctx) {
  if (bundle.boundary_confirmation?.metadata_only !== true || bundle.boundary_confirmation?.read_only !== true) {
    ctx.fail("bundle_readonly_boundary_required", "bundle must be metadata-only and readonly");
  }
  const falseFields = [
    "provider_contact_performed",
    "plugin_call_performed",
    "api_call_performed",
    "image_generation_performed",
    "memory_written",
    "DailyNote_written",
    "VCP_memory_written",
    "accepted_samples_written",
    "production_candidate_002_started",
    "Batch_005_started",
  ];
  for (const field of falseFields) {
    if (bundle.boundary_confirmation?.[field] !== false) {
      ctx.fail("forbidden_boundary_flag_must_be_false", `${field} must be false`);
    }
  }
}

function validateBundle(bundle, refs) {
  const ctx = createContext();
  if (!bundle || typeof bundle !== "object" || Array.isArray(bundle)) {
    ctx.fail("bundle_object_required", "bundle root must be an object");
    return ctx;
  }
  if (bundle.artifact_type !== "metadata_only_visual_eval_readonly_review_bundle") {
    ctx.fail("bundle_artifact_type_expected", "artifact_type mismatch");
  }
  if (bundle.version !== "v1") {
    ctx.fail("bundle_version_expected", "version must be v1");
  }
  if (hasAbsoluteOrLoopback(bundle)) {
    ctx.fail("absolute_local_path_forbidden", "bundle must not contain absolute local paths or loopback URLs");
  }
  validateSourceRefs(bundle, ctx);
  validateBoundary(bundle, ctx);

  const reviewResults = bundle.readonly_artifacts?.review_results || [];
  const session = bundle.readonly_artifacts?.review_session_draft || {};
  const imageCases = bundle.readonly_artifacts?.image_case_drafts || [];
  const bridge = bundle.readonly_artifacts?.bridge_readable_payload || {};
  const accumulationDraft = bundle.readonly_artifacts?.metadata_accumulation_draft || {};

  if (!sameArray(reviewResults.map((record) => record.outcome), expectedOutcomes)) {
    ctx.fail("bundle_outcome_set_mismatch", "bundle outcomes must be pass, patch, reject");
  }
  assertRouteGuardsFalse(session.route_guards, ctx, "review_session_draft");

  const protocolByReviewResult = byId(refs.protocol.review_results, "review_result_id");
  const bridgeRowsByReviewResult = byId(refs.bridge.review_bridge_readable_payload?.review_rows, "review_result_id");
  const bridgeCasesByCase = byId(refs.bridge.image_case_drafts, "case_id");
  const reviewResultsById = byId(reviewResults, "review_result_id");

  for (const record of reviewResults) {
    const source = protocolByReviewResult.get(record.review_result_id);
    const bridgeRow = bridgeRowsByReviewResult.get(record.review_result_id);
    if (!source || !bridgeRow) {
      ctx.fail("bundle_review_result_dangling", `${record.review_result_id} is not present in protocol and bridge payload`);
      continue;
    }
    for (const field of ["candidate_id", "session_id", "case_id", "outcome", "taxonomy_ref", "accumulation_ref"]) {
      if (record[field] !== source[field] || record[field] !== bridgeRow[field]) {
        ctx.fail("bundle_review_result_field_mismatch", `${record.review_result_id}: ${field} mismatch`);
      }
    }
  }

  if (session.session_id !== refs.bridge.review_session_draft?.session_id) {
    ctx.fail("session_id_mismatch", "session_id must match bridge payload");
  }
  if (!sameArray(session.review_result_ids, reviewResults.map((record) => record.review_result_id))) {
    ctx.fail("session_review_result_ids_mismatch", "session review_result_ids must match bundle review results");
  }
  if (!sameArray(session.candidate_ids, reviewResults.map((record) => record.candidate_id))) {
    ctx.fail("session_candidate_ids_mismatch", "session candidate_ids must match bundle review results");
  }
  if (!sameArray(session.visible_outcomes, expectedOutcomes)) {
    ctx.fail("session_visible_outcomes_mismatch", "session visible outcomes must be pass, patch, reject");
  }

  for (const imageCase of imageCases) {
    const record = reviewResultsById.get(imageCase.review_result_id);
    const bridgeCase = bridgeCasesByCase.get(imageCase.case_id);
    if (!record || !bridgeCase) {
      ctx.fail("image_case_ref_dangling", `${imageCase.case_id} is not backed by review result and bridge payload`);
      continue;
    }
    if (
      imageCase.candidate_id !== record.candidate_id ||
      imageCase.session_id !== record.session_id ||
      imageCase.visible_outcome !== record.outcome ||
      imageCase.visible_outcome !== bridgeCase.visible_outcome
    ) {
      ctx.fail("image_case_ref_mismatch", `${imageCase.case_id} does not match review result and bridge payload`);
    }
    if (Object.prototype.hasOwnProperty.call(imageCase, "next_review_action")) {
      ctx.fail("image_case_next_action_over_owned", `${imageCase.case_id} must not own next_review_action`);
    }
  }

  if (bridge.payload_ref !== bridgePayloadPath || bridge.payload_id !== refs.bridge.payload_id) {
    ctx.fail("bundle_bridge_payload_ref_mismatch", "bridge payload summary must reference the canonical payload");
  }
  if (bridge.review_row_count !== refs.bridge.review_bridge_readable_payload?.review_rows?.length) {
    ctx.fail("bundle_bridge_row_count_mismatch", "bridge row count mismatch");
  }
  for (const outcome of expectedOutcomes) {
    if (bridge.outcome_summary?.[outcome] !== refs.bridge.outcome_summary?.[outcome]) {
      ctx.fail("bundle_bridge_outcome_summary_mismatch", `${outcome} count mismatch`);
    }
  }

  if (accumulationDraft.source_contract !== accumulationPath) {
    ctx.fail("metadata_accumulation_contract_mismatch", "metadata accumulation source contract mismatch");
  }
  for (const item of accumulationDraft.records || []) {
    const source = protocolByReviewResult.get(item.review_result_id);
    const bridgeRecord = (refs.bridge.metadata_accumulation_draft?.records || []).find(
      (record) => record.review_result_id === item.review_result_id
    );
    if (!source || !bridgeRecord) {
      ctx.fail("metadata_accumulation_ref_dangling", `${item.review_result_id} missing source accumulation record`);
      continue;
    }
    const expected = source.metadata_accumulation;
    for (const field of [
      "accepted_metadata_action",
      "rejected_metadata_action",
      "archive_reference_action",
      "next_review_action",
    ]) {
      if (item[field] !== expected[field] || item[field] !== bridgeRecord.metadata_accumulation?.[field]) {
        ctx.fail("metadata_accumulation_mismatch", `${item.review_result_id}: ${field} mismatch`);
      }
    }
    if (item.write_allowed_now !== false || bridgeRecord.write_allowed_now !== false) {
      ctx.fail("metadata_accumulation_write_must_be_false", `${item.review_result_id}: write_allowed_now must be false`);
    }
  }

  return ctx;
}

function setByPath(target, fieldPath, value) {
  const segments = fieldPath.split(".");
  let cursor = target;
  for (let index = 0; index < segments.length - 1; index += 1) {
    const segment = segments[index];
    const nextSegment = segments[index + 1];
    if (Array.isArray(cursor)) {
      cursor = cursor[Number(segment)];
    } else {
      if (!(segment in cursor)) {
        cursor[segment] = /^\d+$/.test(nextSegment) ? [] : {};
      }
      cursor = cursor[segment];
    }
  }
  const last = segments[segments.length - 1];
  if (Array.isArray(cursor)) cursor[Number(last)] = value;
  else cursor[last] = value;
}

function validateNegativeCases(bundle, negativeCases, refs) {
  addResult("negative_cases_fixture_type_expected", negativeCases.fixture_type === "metadata_only_visual_eval_readonly_review_bundle_negative_cases", negativeCases.fixture_type);
  addResult("negative_cases_source_bundle_expected", negativeCases.source_bundle === bundlePath);
  addResult("negative_cases_array_present", Array.isArray(negativeCases.negative_cases) && negativeCases.negative_cases.length === expectedNegativeCases.size);

  for (const [caseId, expectedCode] of expectedNegativeCases.entries()) {
    const negativeCase = (negativeCases.negative_cases || []).find((item) => item.case_id === caseId);
    addResult(`negative_case_${caseId}_present`, Boolean(negativeCase));
    addResult(`negative_case_${caseId}_expected_code`, negativeCase?.expected_failure_code === expectedCode, negativeCase?.expected_failure_code);
    if (!negativeCase) continue;
    const mutated = clone(bundle);
    setByPath(mutated, negativeCase.mutation.field, clone(negativeCase.mutation.value));
    const result = validateBundle(mutated, refs);
    addResult(`negative_case_${caseId}_fails_closed`, result.ok === false, result.ok ? "unexpected pass" : result.codes.join(", "));
    addResult(`negative_case_${caseId}_expected_failure_code`, result.codes.includes(expectedCode), result.codes.join(", "));
  }
}

function main() {
  for (const file of [bundlePath, negativeCasesPath, reviewResultPath, taxonomyPath, accumulationPath, bridgePayloadPath]) {
    addResult(`${file}_exists`, fs.existsSync(repoPath(file)), file);
  }
  runNode(["--check", protocolValidatorPath]);
  runNode(["--check", bridgeValidatorPath]);
  runNode([protocolValidatorPath]);
  runNode([bridgeValidatorPath]);

  const bundle = readJson(bundlePath);
  const negativeCases = readJson(negativeCasesPath);
  const refs = {
    protocol: readJson(reviewResultPath),
    taxonomy: readJson(taxonomyPath),
    accumulation: readJson(accumulationPath),
    bridge: readJson(bridgePayloadPath),
  };

  addResult("bundle_json_parseable", true);
  addResult("negative_cases_json_parseable", true);
  const result = validateBundle(bundle, refs);
  addResult("readonly_bundle_positive_case_passes", result.ok, result.errors.map((error) => `${error.code}: ${error.detail}`).join("; "));
  validateNegativeCases(bundle, negativeCases, refs);

  const passed = errors.length === 0;
  process.stdout.write(`${JSON.stringify({
    validator: "validate_visual_eval_readonly_review_bundle",
    version: "v1",
    passed,
    files_checked: [bundlePath, negativeCasesPath, reviewResultPath, taxonomyPath, accumulationPath, bridgePayloadPath],
    bundle_validated: true,
    negative_cases_validated: true,
    cross_artifact_refs_validated: true,
    failed_count: errors.length,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    memory_written: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false,
    production_candidate_002_started: false,
    Batch_005_started: false,
    errors,
    results,
  }, null, 2)}\n`);
  process.exitCode = passed ? 0 : 1;
}

try {
  main();
} catch (error) {
  errors.push({ check: "validator_exception", detail: error.message });
  process.stderr.write(`${JSON.stringify({
    validator: "validate_visual_eval_readonly_review_bundle",
    passed: false,
    errors,
  }, null, 2)}\n`);
  process.exitCode = 1;
}
