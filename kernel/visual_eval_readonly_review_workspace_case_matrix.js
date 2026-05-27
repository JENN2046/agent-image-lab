#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const defaultWorkspacePath = "tests/schema_examples/visual_eval_readonly_review_workspace.example.json";
const defaultCollectionConsumerPath = "tests/schema_examples/visual_eval_readonly_review_collection_consumer.example.json";
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

function sameSet(actual, expected) {
  return Array.isArray(actual) && actual.length === expected.length && expected.every((item) => actual.includes(item));
}

function navigationItemsFor(metadataNavigation, reviewResultId) {
  return (metadataNavigation.navigation_items || []).filter((item) => item.review_result_id === reviewResultId);
}

function buildCaseRow(row, workspace, metadataNavigation) {
  const tab = (workspace.review_session_panel?.outcome_tabs || []).find((item) => item.review_result_id === row.review_result_id);
  const navItems = navigationItemsFor(metadataNavigation, row.review_result_id);
  assert(tab, `workspace outcome tab missing for ${row.review_result_id}`);
  assert(navItems.length > 0, `metadata navigation missing for ${row.review_result_id}`);
  assert(tab.outcome === row.outcome, `workspace outcome mismatch for ${row.review_result_id}`);
  assert(tab.case_id === row.case_id, `workspace case_id mismatch for ${row.review_result_id}`);
  assert(tab.candidate_id === row.candidate_id, `workspace candidate_id mismatch for ${row.review_result_id}`);
  assert(navItems.every((item) => item.outcome === row.outcome), `metadata navigation outcome mismatch for ${row.review_result_id}`);
  assert(navItems.every((item) => item.case_id === row.case_id), `metadata navigation case_id mismatch for ${row.review_result_id}`);
  assert(navItems.every((item) => item.next_review_action === row.next_review_action), `metadata navigation next action mismatch for ${row.review_result_id}`);

  return {
    review_result_id: row.review_result_id,
    candidate_id: row.candidate_id,
    case_id: row.case_id,
    outcome: row.outcome,
    selected: row.review_result_id === workspace.selected_review_result_id,
    summary: row.summary,
    reasons: row.reasons,
    failure_taxonomy: row.failure_taxonomy,
    blocking_watch_items: row.blocking_watch_items,
    next_review_action: row.next_review_action,
    metadata_accumulation_action: row.metadata_accumulation_action,
    metadata_queue_sections: navItems.map((item) => item.section_id),
    metadata_navigation_keys: navItems.map((item) => item.navigation_key),
    route_action: "render_readonly_review_workspace_case_matrix_row_only",
    write_allowed: false,
  };
}

function loadReadonlyReviewWorkspaceCaseMatrix(input) {
  const workspacePath = (input?.workspacePath || defaultWorkspacePath).replace(/\\/g, "/");
  const collectionConsumerPath = (input?.collectionConsumerPath || defaultCollectionConsumerPath).replace(/\\/g, "/");
  const metadataNavigationPath = (input?.metadataNavigationPath || defaultMetadataNavigationPath).replace(/\\/g, "/");
  const workspace = input?.workspace || readJson(workspacePath);
  const collectionConsumer = input?.collectionConsumer || readJson(collectionConsumerPath);
  const metadataNavigation = input?.metadataNavigation || readJson(metadataNavigationPath);

  assert(!hasAbsoluteOrLoopback({ workspace, collectionConsumer, metadataNavigation }), "case matrix sources must not expose absolute local paths or loopback URLs");
  assert(workspace.workspace_type === "metadata_only_visual_eval_readonly_review_workspace", "workspace type mismatch");
  assert(collectionConsumer.consumer_payload_type === "metadata_only_visual_eval_readonly_review_collection_consumer", "collection consumer type mismatch");
  assert(metadataNavigation.navigation_type === "metadata_only_visual_eval_readonly_metadata_accumulation_queue_detail_navigation", "metadata navigation type mismatch");
  assertGuardClosed(workspace.guard, "workspace");
  assertGuardClosed(collectionConsumer.guard, "collection consumer");
  assertGuardClosed(metadataNavigation.guard, "metadata navigation");

  const rows = (collectionConsumer.collection_rows || []).map((row) => buildCaseRow(row, workspace, metadataNavigation));
  assert(rows.length === 3, "case matrix requires exactly three rows");
  assert(sameSet(rows.map((row) => row.outcome), ["pass", "patch", "reject"]), "case matrix outcomes must be pass/patch/reject");
  assert(rows.filter((row) => row.selected).length === 1, "case matrix requires exactly one selected row");

  return {
    matrix_id: "visual_eval_readonly_review_workspace_case_matrix_v1_synthetic_001",
    matrix_type: "metadata_only_visual_eval_readonly_review_workspace_case_matrix",
    status: "readonly_review_workspace_case_matrix_ready",
    source_workspace: workspacePath,
    source_collection_consumer: collectionConsumerPath,
    source_metadata_queue_navigation: metadataNavigationPath,
    selected_review_result_id: workspace.selected_review_result_id,
    matrix_contract: {
      metadata_only: true,
      read_only: true,
      consumes_workspace: true,
      consumes_collection_consumer: true,
      consumes_metadata_queue_navigation: true,
      every_case_must_have_metadata_queue_sections: true,
      outcomes_must_cover_pass_patch_reject: true,
      route_action: "render_readonly_review_workspace_case_matrix_only",
      write_allowed: false,
    },
    outcome_summary: collectionConsumer.collection?.outcome_summary,
    case_rows: rows,
    indexes: {
      by_outcome: Object.fromEntries(rows.map((row) => [row.outcome, row.review_result_id])),
      by_next_review_action: rows.reduce((acc, row) => {
        acc[row.next_review_action] = acc[row.next_review_action] || [];
        acc[row.next_review_action].push(row.review_result_id);
        return acc;
      }, {}),
      by_metadata_section: rows.reduce((acc, row) => {
        for (const section of row.metadata_queue_sections) {
          acc[section] = acc[section] || [];
          acc[section].push(row.review_result_id);
        }
        return acc;
      }, {}),
    },
    readonly_route_guard_summary: {
      route_action: "render_readonly_review_workspace_case_matrix_only",
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
  const payload = loadReadonlyReviewWorkspaceCaseMatrix({
    workspacePath: parseArgValue(argv, "--workspace", defaultWorkspacePath),
    collectionConsumerPath: parseArgValue(argv, "--collection-consumer", defaultCollectionConsumerPath),
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
  loadReadonlyReviewWorkspaceCaseMatrix,
};
