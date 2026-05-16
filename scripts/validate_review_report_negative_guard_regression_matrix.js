const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");

const requiredFiles = [
  "review_console/static_prototype/mock_data.js",
  "tests/schema_examples/review_report_negative_guard_regression_matrix.example.json",
  "tests/schema_examples/pvos_kernel_dry_run_adapter_negative_guard_response.example.json",
  "tests/schema_examples/review_console_review_report_negative_guard_draft_output_snapshot.example.json"
];

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function assertArrayEqual(actual, expected, message) {
  assert(Array.isArray(actual), `${message}: actual value must be an array.`);
  assert(Array.isArray(expected), `${message}: expected value must be an array.`);
  assert(actual.length === expected.length, `${message}: array length mismatch.`);
  expected.forEach((item) => {
    assert(actual.includes(item), `${message}: missing ${item}.`);
  });
}

function parseJson(text, label) {
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(`${label} must be valid JSON: ${error.message}`);
  }
}

function loadStaticMock() {
  const context = { window: {} };
  vm.runInNewContext(read("review_console/static_prototype/mock_data.js"), context, {
    filename: "review_console/static_prototype/mock_data.js"
  });
  return context.window.REVIEW_CONSOLE_MOCK;
}

function getSurface(matrix, surfaceId) {
  const surface = matrix.surfaces.find((item) => item.surface_id === surfaceId);
  assert(surface, `Matrix must include ${surfaceId} surface.`);
  return surface;
}

function reportItemsToCandidateIds(reportItems) {
  return reportItems.map((item) => item.candidate_id);
}

function reportItemsToRejectIds(reportItems) {
  return reportItems.filter((item) => item.review_outcome === "reject").map((item) => item.candidate_id);
}

function reportItemsToFinalRoutes(reportItems) {
  return reportItems.map((item) => item.final_route);
}

function reportItemsToUnknownFailureTags(reportItems) {
  return reportItems.flatMap((item) => item.unknown_failure_tags);
}

function assertNoExecution(surface, label) {
  for (const key of [
    "production_candidate_created",
    "direct_memory_write_performed",
    "daily_note_write_performed",
    "vcp_memory_write_performed",
    "accepted_samples_write_performed"
  ]) {
    assert(surface[key] === false, `${label} ${key} must be false.`);
  }
  assert(surface.provider_plugin_api_image_effects === false, `${label} provider/plugin/API/image effects must be false.`);
  assert(surface.selected_plugin === null, `${label} selected_plugin must be null.`);
  assert(surface.max_plugin_calls_observed === 0, `${label} max_plugin_calls_observed must be 0.`);
}

function assertSurfaceConsensus(surface, consensus) {
  assertArrayEqual(surface.candidate_ids, consensus.candidate_ids, `${surface.surface_id} candidate IDs must match consensus`);
  assertArrayEqual(surface.reject_candidate_ids, consensus.reject_candidate_ids, `${surface.surface_id} reject IDs must match consensus`);
  assertArrayEqual(
    surface.memory_forbidden_candidate_ids,
    consensus.memory_forbidden_candidate_ids,
    `${surface.surface_id} memory-forbidden IDs must match consensus`
  );
  assertArrayEqual(
    surface.never_production_candidate_ids,
    consensus.never_production_candidate_ids,
    `${surface.surface_id} never-production IDs must match consensus`
  );
  assertArrayEqual(surface.final_routes, consensus.final_routes, `${surface.surface_id} final routes must match consensus`);
  assertArrayEqual(
    surface.unknown_failure_tags,
    consensus.unknown_failure_tags,
    `${surface.surface_id} unknown failure tags must match consensus`
  );
  assert(
    surface.memory_entry_allowed_now_count === consensus.memory_entry_allowed_now_count,
    `${surface.surface_id} memory-entry count must match consensus.`
  );
  assert(
    surface.production_promotion_allowed_now_count === consensus.production_promotion_allowed_now_count,
    `${surface.surface_id} production-promotion count must match consensus.`
  );
  assert(surface.writes_allowed_now_count === consensus.writes_allowed_now_count, `${surface.surface_id} write count must match consensus.`);
  assertNoExecution(surface, surface.surface_id);
}

function assertSurfaceMatchesHandoff(surface, handoff, label) {
  const reportItems = handoff.report_items;
  const guard = handoff.review_report_guard_summary;
  assertArrayEqual(surface.candidate_ids, reportItemsToCandidateIds(reportItems), `${label} candidate IDs must match report items`);
  assertArrayEqual(surface.reject_candidate_ids, reportItemsToRejectIds(reportItems), `${label} reject IDs must match report items`);
  assertArrayEqual(
    surface.memory_forbidden_candidate_ids,
    guard.memory_forbidden_candidate_ids,
    `${label} memory-forbidden IDs must match guard`
  );
  assertArrayEqual(surface.never_production_candidate_ids, guard.never_production_candidate_ids, `${label} never-production IDs must match guard`);
  assertArrayEqual(surface.final_routes, reportItemsToFinalRoutes(reportItems), `${label} final routes must match report items`);
  assertArrayEqual(surface.unknown_failure_tags, reportItemsToUnknownFailureTags(reportItems), `${label} unknown failure tags must match report items`);
  assert(surface.memory_entry_allowed_now_count === guard.memory_entry_allowed_now_count, `${label} memory-entry count must match guard.`);
  assert(
    surface.production_promotion_allowed_now_count === guard.production_promotion_allowed_now_count,
    `${label} production-promotion count must match guard.`
  );
  assert(surface.writes_allowed_now_count === guard.writes_allowed_now_count, `${label} write count must match guard.`);
  assert(guard.production_candidate_created === false, `${label} guard must not create production candidates.`);
  assert(guard.direct_memory_write_performed === false, `${label} guard must not write memory directly.`);
  assert(guard.daily_note_write_performed === false, `${label} guard must not write DailyNote.`);
  assert(guard.vcp_memory_write_performed === false, `${label} guard must not write VCP memory.`);
  assert(guard.accepted_samples_write_performed === false, `${label} guard must not write accepted samples.`);

  for (const item of reportItems) {
    assert(item.review_outcome === "reject", `${label} report item ${item.candidate_id} must be rejected.`);
    assert(item.production_report.never_production === true, `${label} report item ${item.candidate_id} must be never-production.`);
    assert(item.production_report.production_candidate_created === false, `${label} report item ${item.candidate_id} must not create production candidate.`);
    assert(
      item.production_report.accepted_samples_write_performed === false,
      `${label} report item ${item.candidate_id} must not write accepted samples.`
    );
    assert(item.memory_report.memory_entry_allowed_now === false, `${label} report item ${item.candidate_id} must not enter memory now.`);
    assert(item.final_controls.writes_allowed_now.length === 0, `${label} report item ${item.candidate_id} must allow no writes now.`);
    assert(
      item.final_controls.execution_blocked.includes("production_forever"),
      `${label} report item ${item.candidate_id} must block production forever.`
    );
  }

  const unknownItem = reportItems.find((item) => item.candidate_id === "candidate_reject_unknown_guard_001");
  assert(unknownItem, `${label} must include unknown failure rejected item.`);
  assert(unknownItem.final_route === "reject_memory_forbidden_never_production", `${label} unknown item must use memory-forbidden route.`);
  assert(unknownItem.memory_report.memory_forbidden === true, `${label} unknown item must be memory-forbidden.`);
  assert(unknownItem.memory_report.memory_draft_allowed === false, `${label} unknown item must not create memory draft.`);
  assert(unknownItem.unknown_failure_tags.includes("unmapped_identity_drift"), `${label} unknown item must carry unmapped_identity_drift.`);
}

function assertAdapterReviewReportSurface(surface, adapterFixture) {
  const handoff = {
    report_items: adapterFixture.review_report_contract.report_items,
    review_report_guard_summary: adapterFixture.review_console_handoff_draft.review_report_guard_summary
  };
  assertSurfaceMatchesHandoff(surface, handoff, "adapter review report contract");
}

function assertConsoleGuardSurface(surface, adapterFixture) {
  const reportItems = adapterFixture.review_report_contract.report_items;
  const guard = adapterFixture.review_console_handoff_draft.review_report_guard_summary;
  assertArrayEqual(surface.memory_forbidden_candidate_ids, guard.memory_forbidden_candidate_ids, "Review Console guard memory-forbidden IDs must match adapter guard");
  assertArrayEqual(surface.never_production_candidate_ids, guard.never_production_candidate_ids, "Review Console guard never-production IDs must match adapter guard");
  assertArrayEqual(surface.candidate_ids, reportItemsToCandidateIds(reportItems), "Review Console guard candidate IDs must match report items");
  assertArrayEqual(surface.reject_candidate_ids, reportItemsToRejectIds(reportItems), "Review Console guard reject IDs must match report items");
  assertArrayEqual(surface.final_routes, reportItemsToFinalRoutes(reportItems), "Review Console guard final routes must match report items");
  assertArrayEqual(surface.unknown_failure_tags, reportItemsToUnknownFailureTags(reportItems), "Review Console guard unknown failure tags must match report items");
  assert(surface.production_candidate_created === guard.production_candidate_created, "Review Console guard production candidate state must match.");
  assert(surface.direct_memory_write_performed === guard.direct_memory_write_performed, "Review Console guard direct memory state must match.");
  assert(surface.daily_note_write_performed === guard.daily_note_write_performed, "Review Console guard DailyNote state must match.");
  assert(surface.vcp_memory_write_performed === guard.vcp_memory_write_performed, "Review Console guard VCP memory state must match.");
  assert(surface.accepted_samples_write_performed === guard.accepted_samples_write_performed, "Review Console guard accepted_samples state must match.");
}

function assertSnapshotSurface(surface, snapshot) {
  assert(snapshot.status === "draft_output_snapshot", "Negative ReviewReport snapshot must be a draft output snapshot.");
  assert(snapshot.display_only === true, "Negative ReviewReport snapshot must be display-only.");
  assert(snapshot.snapshot_assertions.review_report_negative_guard_handoff_present_in_draft_output === true, "Snapshot must assert handoff presence.");
  assertSurfaceMatchesHandoff(surface, snapshot.review_report_negative_guard_static_handoff, "negative ReviewReport draft output snapshot");
  assertArrayEqual(
    surface.memory_forbidden_candidate_ids,
    snapshot.snapshot_assertions.memory_forbidden_candidate_ids,
    "Snapshot surface memory-forbidden IDs must match snapshot assertions"
  );
  assertArrayEqual(
    surface.never_production_candidate_ids,
    snapshot.snapshot_assertions.never_production_candidate_ids,
    "Snapshot surface never-production IDs must match snapshot assertions"
  );
  assertArrayEqual(surface.final_routes, snapshot.snapshot_assertions.final_routes, "Snapshot surface final routes must match snapshot assertions");
  assertArrayEqual(
    surface.unknown_failure_tags,
    snapshot.snapshot_assertions.unknown_failure_tags,
    "Snapshot surface unknown failure tags must match snapshot assertions"
  );
}

function main() {
  const missingFiles = requiredFiles.filter((relativePath) => !exists(relativePath));
  assert(missingFiles.length === 0, `Missing ReviewReport negative guard regression matrix files: ${missingFiles.join(", ")}`);

  const mock = loadStaticMock();
  const matrix = parseJson(
    read("tests/schema_examples/review_report_negative_guard_regression_matrix.example.json"),
    "ReviewReport negative guard regression matrix"
  );
  const adapterFixture = parseJson(
    read("tests/schema_examples/pvos_kernel_dry_run_adapter_negative_guard_response.example.json"),
    "PVOS adapter negative fixture"
  );
  const snapshot = parseJson(
    read("tests/schema_examples/review_console_review_report_negative_guard_draft_output_snapshot.example.json"),
    "Review Console negative ReviewReport draft output snapshot"
  );

  assert(matrix.status === "local_regression_matrix", "ReviewReport negative guard matrix must be local_regression_matrix.");
  assert(matrix.display_only === true, "ReviewReport negative guard matrix must be display-only.");
  assert(matrix.source_phase === "v14_072_review_report_negative_guard_draft_output_snapshot_gate", "Matrix source phase must be v14.072.");
  assert(matrix.expected_consensus.surface_count === matrix.surfaces.length, "Matrix surface count must match consensus.");

  for (const surface of matrix.surfaces) {
    assertSurfaceConsensus(surface, matrix.expected_consensus);
  }

  assertAdapterReviewReportSurface(getSurface(matrix, "adapter_review_report_contract"), adapterFixture);
  assertConsoleGuardSurface(getSurface(matrix, "review_console_handoff_guard"), adapterFixture);
  assertSurfaceMatchesHandoff(
    getSurface(matrix, "static_mock_negative_review_report"),
    mock.review_report_negative_guard_static_handoff,
    "static mock negative ReviewReport"
  );
  assertSnapshotSurface(getSurface(matrix, "draft_output_snapshot_negative_review_report"), snapshot);

  for (const key of [
    "production_candidate_created",
    "direct_memory_write_performed",
    "daily_note_write_performed",
    "vcp_memory_write_performed",
    "accepted_samples_write_performed",
    "provider_contact_performed",
    "plugin_call_performed",
    "api_call_performed",
    "image_generation_performed",
    "output_file_write_performed"
  ]) {
    assert(matrix.expected_consensus[key] === false, `Matrix consensus ${key} must be false.`);
  }
  assert(matrix.expected_consensus.selected_plugin === null, "Matrix consensus selected_plugin must be null.");
  assert(matrix.expected_consensus.max_plugin_calls_observed === 0, "Matrix consensus max_plugin_calls_observed must be 0.");

  const result = {
    passed: true,
    review_report_negative_guard_regression_matrix: {
      review_report_negative_guard_matrix_present: true,
      review_report_negative_guard_surface_consensus_verified: true,
      review_report_negative_guard_adapter_contract_surface_verified: true,
      review_report_negative_guard_console_guard_surface_verified: true,
      review_report_negative_guard_static_mock_surface_verified: true,
      review_report_negative_guard_draft_snapshot_surface_verified: true,
      review_report_negative_guard_reject_routes_verified: true,
      review_report_negative_guard_memory_forbidden_verified: true,
      review_report_negative_guard_never_production_verified: true,
      review_report_negative_guard_unknown_failure_verified: true,
      review_report_negative_guard_no_daily_note_write_verified: true,
      review_report_negative_guard_no_vcp_memory_write_verified: true,
      review_report_negative_guard_no_accepted_samples_write_verified: true,
      review_report_negative_guard_no_production_candidate_verified: true,
      review_report_negative_guard_no_provider_plugin_api_image_verified: true,
      external_network_required: false,
      external_service_required: false,
      file_write_performed: false
    }
  };

  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
}
