#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const defaultNavigationPath = "tests/schema_examples/visual_eval_readonly_review_detail_navigation.example.json";
const defaultBridgePayloadPath = "tests/schema_examples/visual_eval_review_result_review_bridge_payload.example.json";
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

function assertRouteGuardsClosed(routeGuards, label) {
  for (const [field, value] of Object.entries(routeGuards || {})) {
    assert(value === false, `${label} route guard must remain false: ${field}`);
  }
}

function loadReadonlyReviewSessionDrilldown(input) {
  const navigationPath = (input?.navigationPath || defaultNavigationPath).replace(/\\/g, "/");
  const bridgePayloadPath = (input?.bridgePayloadPath || defaultBridgePayloadPath).replace(/\\/g, "/");
  const navigation = input?.navigation || readJson(navigationPath);
  const bridgePayload = input?.bridgePayload || readJson(bridgePayloadPath);

  assert(!hasAbsoluteOrLoopback({ navigation, bridgePayload }), "session drilldown sources must not expose absolute local paths or loopback URLs");
  assert(navigation.navigation_type === "metadata_only_visual_eval_readonly_review_detail_navigation", "navigation type mismatch");
  assert(bridgePayload.payload_type === "metadata_only_visual_eval_review_result_bridge_payload", "bridge payload type mismatch");
  assert(navigation.guard?.metadata_only === true && navigation.guard?.read_only === true, "navigation must remain metadata-only/read-only");
  assert(bridgePayload.guard?.metadata_only === true && bridgePayload.guard?.read_only === true, "bridge payload must remain metadata-only/read-only");

  const selectedId = navigation.selected_review_result_id;
  const selectedDetail = navigation.selected_detail;
  const navigationItemByResultId = new Map((navigation.navigation_items || []).map((item) => [item.review_result_id, item]));
  const session = bridgePayload.review_session_draft;
  const sessionRow = (session.review_rows || []).find((row) => row.review_result_id === selectedId);
  const imageCase = (bridgePayload.image_case_drafts || []).find((item) => item.review_result_id === selectedId);
  const metadataRecord = (bridgePayload.metadata_accumulation_draft?.records || []).find((item) => item.review_result_id === selectedId);

  assert(selectedDetail?.selected_review_result_id === selectedId, "selected detail must match selected review_result_id");
  assert(sessionRow, `selected review_result_id must exist in review_session_draft: ${selectedId}`);
  assert(imageCase, `selected review_result_id must exist in image_case_drafts: ${selectedId}`);
  assert(metadataRecord, `selected review_result_id must exist in metadata_accumulation_draft: ${selectedId}`);
  assert(sessionRow.candidate_id === selectedDetail.collection_row_detail?.candidate_id, "session candidate_id must match selected detail");
  assert(imageCase.candidate_id === sessionRow.candidate_id, "image case candidate_id must match session row");
  assert(metadataRecord.candidate_id === sessionRow.candidate_id, "metadata record candidate_id must match session row");
  assert(imageCase.case_id === sessionRow.case_id, "image case case_id must match session row");
  assert(metadataRecord.case_id === sessionRow.case_id, "metadata record case_id must match session row");
  assert(imageCase.visible_outcome === sessionRow.outcome, "image case outcome must match session row");
  assert(metadataRecord.outcome === sessionRow.outcome, "metadata outcome must match session row");
  assert(metadataRecord.metadata_accumulation?.next_review_action === selectedDetail.collection_row_detail?.next_review_action, "metadata next action must match selected detail");
  assertRouteGuardsClosed(session.route_guards, "session");
  assertRouteGuardsClosed(imageCase.route_guards, "image case");
  assertRouteGuardsClosed(bridgePayload.metadata_accumulation_draft?.route_guards, "metadata accumulation");
  assert(metadataRecord.write_allowed_now === false, "metadata record must remain readonly");

  return {
    drilldown_id: "visual_eval_readonly_review_session_drilldown_v1_synthetic_001",
    drilldown_type: "metadata_only_visual_eval_readonly_review_session_drilldown",
    status: "readonly_session_drilldown_ready",
    source_detail_navigation: navigationPath,
    source_bridge_payload: bridgePayloadPath,
    selected_review_result_id: selectedId,
    session_id: session.session_id,
    drilldown_contract: {
      metadata_only: true,
      read_only: true,
      selected_result_must_resolve_to_session_row: true,
      selected_result_must_resolve_to_image_case: true,
      selected_result_must_resolve_to_metadata_record: true,
      sibling_cases_visible: true,
      write_allowed: false,
    },
    session_panel: {
      session_id: session.session_id,
      status: session.status,
      outcome_summary: session.outcome_summary,
      final_outcomes_visible: session.final_outcomes_visible,
      selected_review_result_id: selectedId,
      review_result_ids: (session.review_rows || []).map((row) => row.review_result_id),
    },
    selected_review_row: {
      review_result_id: sessionRow.review_result_id,
      candidate_id: sessionRow.candidate_id,
      case_id: sessionRow.case_id,
      outcome: sessionRow.outcome,
      confidence_band: sessionRow.confidence_band,
      summary: sessionRow.summary,
      failure_tags: sessionRow.failure_tags,
      taxonomy_ref: sessionRow.taxonomy_ref,
      accumulation_ref: sessionRow.accumulation_ref,
    },
    selected_image_case: {
      case_id: imageCase.case_id,
      candidate_id: imageCase.candidate_id,
      visible_outcome: imageCase.visible_outcome,
      review_status: imageCase.review_status,
      patch_required: imageCase.patch_required,
      never_production: imageCase.never_production,
      failure_tags: imageCase.failure_tags,
      taxonomy_refs: imageCase.taxonomy_refs,
      bounded_patch_scope: imageCase.bounded_patch_scope,
      blocking_watch_items: imageCase.blocking_watch_items,
      next_review_action: selectedDetail.collection_row_detail.next_review_action,
    },
    selected_metadata_accumulation: {
      review_result_id: metadataRecord.review_result_id,
      candidate_id: metadataRecord.candidate_id,
      case_id: metadataRecord.case_id,
      outcome: metadataRecord.outcome,
      metadata_accumulation: metadataRecord.metadata_accumulation,
      write_allowed_now: metadataRecord.write_allowed_now,
      consumer_status: metadataRecord.consumer_status,
    },
    sibling_case_refs: (bridgePayload.image_case_drafts || []).map((item) => ({
      review_result_id: item.review_result_id,
      case_id: item.case_id,
      candidate_id: item.candidate_id,
      visible_outcome: item.visible_outcome,
      next_review_action: navigationItemByResultId.get(item.review_result_id)?.next_review_action,
      selected: item.review_result_id === selectedId,
    })),
    guard: { ...guard },
  };
}

function parseArgValue(argv, flag, fallback) {
  const index = argv.indexOf(flag);
  return index >= 0 ? argv[index + 1] : fallback;
}

function main() {
  const argv = process.argv.slice(2);
  const payload = loadReadonlyReviewSessionDrilldown({
    navigationPath: parseArgValue(argv, "--navigation", defaultNavigationPath),
    bridgePayloadPath: parseArgValue(argv, "--bridge-payload", defaultBridgePayloadPath),
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
  loadReadonlyReviewSessionDrilldown,
};
