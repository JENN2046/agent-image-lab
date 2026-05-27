#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const defaultSessionDrilldownPath = "tests/schema_examples/visual_eval_readonly_review_session_drilldown.example.json";
const defaultMetadataNavigationPath = "tests/schema_examples/visual_eval_readonly_metadata_accumulation_queue_detail_navigation.example.json";
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

function assertGuardClosed(source, label) {
  assert(source?.metadata_only === true, `${label} must be metadata-only`);
  assert(source?.read_only === true, `${label} must be read-only`);
  for (const [field, value] of Object.entries(source || {})) {
    if (field === "metadata_only" || field === "read_only" || field === "display_only") continue;
    assert(value === false, `${label} guard must remain false: ${field}`);
  }
}

function selectedNavigationItems(metadataNavigation, selectedReviewResultId) {
  return (metadataNavigation.navigation_items || []).filter((item) => item.review_result_id === selectedReviewResultId);
}

function unique(values) {
  return [...new Set(values)];
}

function loadReadonlyReviewWorkspace(input) {
  const sessionDrilldownPath = (input?.sessionDrilldownPath || defaultSessionDrilldownPath).replace(/\\/g, "/");
  const metadataNavigationPath = (input?.metadataNavigationPath || defaultMetadataNavigationPath).replace(/\\/g, "/");
  const sessionDrilldown = input?.sessionDrilldown || readJson(sessionDrilldownPath);
  const metadataNavigation = input?.metadataNavigation || readJson(metadataNavigationPath);

  assert(!hasAbsoluteOrLoopback({ sessionDrilldown, metadataNavigation }), "readonly workspace sources must not expose absolute local paths or loopback URLs");
  assert(sessionDrilldown.drilldown_type === "metadata_only_visual_eval_readonly_review_session_drilldown", "session drilldown type mismatch");
  assert(metadataNavigation.navigation_type === "metadata_only_visual_eval_readonly_metadata_accumulation_queue_detail_navigation", "metadata queue navigation type mismatch");
  assertGuardClosed(sessionDrilldown.guard, "session drilldown");
  assertGuardClosed(metadataNavigation.guard, "metadata queue navigation");

  const selectedReviewResultId = sessionDrilldown.selected_review_result_id;
  const selectedMetadataDetail = metadataNavigation.selected_detail;
  const selectedMetadataItems = selectedNavigationItems(metadataNavigation, selectedReviewResultId);
  const selectedMetadataItem = (metadataNavigation.navigation_items || []).find((item) => item.navigation_key === metadataNavigation.selected_navigation_key);

  assert(selectedMetadataDetail?.selected_review_result_id === selectedReviewResultId, "metadata selected detail must match session selected review result");
  assert(selectedMetadataItem?.review_result_id === selectedReviewResultId, "metadata selected navigation item must match session selected review result");
  assert(selectedMetadataItems.length > 0, "selected result must exist in metadata queue navigation");
  assert(sessionDrilldown.selected_review_row?.outcome === selectedMetadataDetail.selected_card?.outcome, "selected outcome must match across session and metadata queue");
  assert(sessionDrilldown.selected_image_case?.case_id === selectedMetadataDetail.selected_card?.case_id, "selected case_id must match across session and metadata queue");
  assert(sessionDrilldown.selected_metadata_accumulation?.metadata_accumulation?.next_review_action === selectedMetadataDetail.selected_card?.next_review_action, "selected next action must match across session and metadata queue");

  const selectedFailureTags = unique([
    ...(sessionDrilldown.selected_review_row?.failure_tags || []),
    ...(sessionDrilldown.selected_image_case?.failure_tags || []),
    ...(selectedMetadataDetail.selected_card?.failure_tags || []),
  ]);
  const outcomeTabs = (sessionDrilldown.sibling_case_refs || []).map((item) => ({
    outcome: item.visible_outcome,
    review_result_id: item.review_result_id,
    case_id: item.case_id,
    candidate_id: item.candidate_id,
    selected: item.selected,
    metadata_queue_sections: selectedNavigationItems(metadataNavigation, item.review_result_id).map((navItem) => navItem.section_id),
  }));

  return {
    workspace_id: "visual_eval_readonly_review_workspace_v1_synthetic_001",
    workspace_type: "metadata_only_visual_eval_readonly_review_workspace",
    status: "readonly_review_workspace_ready",
    source_session_drilldown: sessionDrilldownPath,
    source_metadata_queue_navigation: metadataNavigationPath,
    selected_review_result_id: selectedReviewResultId,
    workspace_contract: {
      metadata_only: true,
      read_only: true,
      consumes_review_session_drilldown: true,
      consumes_metadata_accumulation_queue_navigation: true,
      selected_result_must_match_across_sources: true,
      outcome_taxonomy_next_action_must_match: true,
      route_action: "render_readonly_review_workspace_only",
      write_allowed: false,
    },
    review_session_panel: {
      session_id: sessionDrilldown.session_id,
      selected_review_result_id: selectedReviewResultId,
      outcome_summary: sessionDrilldown.session_panel?.outcome_summary,
      outcome_tabs: outcomeTabs,
    },
    selected_result_panel: {
      review_result_id: selectedReviewResultId,
      candidate_id: sessionDrilldown.selected_review_row?.candidate_id,
      case_id: sessionDrilldown.selected_image_case?.case_id,
      outcome: sessionDrilldown.selected_review_row?.outcome,
      confidence_band: sessionDrilldown.selected_review_row?.confidence_band,
      summary: sessionDrilldown.selected_review_row?.summary,
      next_review_action: selectedMetadataDetail.selected_card?.next_review_action,
      metadata_accumulation_actions: selectedMetadataDetail.selected_card?.metadata_actions,
    },
    taxonomy_panel: {
      taxonomy_ref: sessionDrilldown.selected_review_row?.taxonomy_ref,
      taxonomy_refs: sessionDrilldown.selected_image_case?.taxonomy_refs || [],
      failure_tags: selectedFailureTags,
    },
    image_case_panel: {
      case_id: sessionDrilldown.selected_image_case?.case_id,
      visible_outcome: sessionDrilldown.selected_image_case?.visible_outcome,
      review_status: sessionDrilldown.selected_image_case?.review_status,
      patch_required: sessionDrilldown.selected_image_case?.patch_required,
      never_production: sessionDrilldown.selected_image_case?.never_production,
      bounded_patch_scope: sessionDrilldown.selected_image_case?.bounded_patch_scope,
      blocking_watch_items: sessionDrilldown.selected_image_case?.blocking_watch_items,
    },
    metadata_queue_panel: {
      selected_navigation_key: metadataNavigation.selected_navigation_key,
      selected_section_id: selectedMetadataDetail.selected_section_id,
      section_membership: selectedMetadataDetail.selected_card?.section_membership || [],
      outcome_membership: selectedMetadataDetail.selected_card?.outcome_membership || [],
      next_action_membership: selectedMetadataDetail.selected_card?.next_action_membership || [],
      navigation_item_count: (metadataNavigation.navigation_items || []).length,
      selected_result_navigation_keys: selectedMetadataItems.map((item) => item.navigation_key),
    },
    readonly_route_guard_summary: {
      route_action: "render_readonly_review_workspace_only",
      write_allowed: false,
      provider_contact_performed: false,
      plugin_call_performed: false,
      api_call_performed: false,
      image_generation_performed: false,
      memory_write_performed: false,
      production_candidate_002_started: false,
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
  const payload = loadReadonlyReviewWorkspace({
    sessionDrilldownPath: parseArgValue(argv, "--session-drilldown", defaultSessionDrilldownPath),
    metadataNavigationPath: parseArgValue(argv, "--metadata-navigation", defaultMetadataNavigationPath),
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
  loadReadonlyReviewWorkspace,
};
