const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const requiredFiles = [
  "tests/schema_examples/review_report_route_summary.example.json",
  "tests/schema_examples/review_report_contract.example.json",
  "tests/schema_examples/pvos_kernel_dry_run_adapter_response.example.json",
  "tests/schema_examples/pvos_kernel_dry_run_adapter_negative_guard_response.example.json",
  "tests/schema_examples/review_report_negative_guard_regression_matrix.example.json"
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

function getByCandidate(items, candidateId, label) {
  const item = items.find((entry) => entry.candidate_id === candidateId);
  assert(item, `${label} must include ${candidateId}.`);
  return item;
}

function assertNoExecutionGuard(guard, label) {
  for (const key of [
    "provider_contact_performed",
    "plugin_call_performed",
    "api_call_performed",
    "daily_note_write_performed",
    "vcp_memory_write_performed",
    "image_generation_performed",
    "output_file_write_performed",
    "accepted_samples_write_performed",
    "production_candidate_created"
  ]) {
    assert(guard[key] === false, `${label} ${key} must be false.`);
  }
}

function assertRouteMatchesReportItem(route, item, label) {
  assert(route.review_outcome === item.review_outcome, `${label} review outcome must match ReviewReport.`);
  assert(route.report_decision === item.report_decision, `${label} report decision must match ReviewReport.`);
  assert(route.report_status === item.report_status, `${label} report status must match ReviewReport.`);
  assert(route.final_route === item.final_route, `${label} final route must match ReviewReport.`);
  assertArrayEqual(route.pass_reasons, item.pass_reasons, `${label} pass reasons must match ReviewReport`);
  assertArrayEqual(route.reject_reasons, item.reject_reasons, `${label} reject reasons must match ReviewReport`);
  assertArrayEqual(route.failure_tags, item.failure_tags, `${label} failure tags must match ReviewReport`);
  assertArrayEqual(route.unknown_failure_tags, item.unknown_failure_tags || [], `${label} unknown failure tags must match ReviewReport`);
  assert(route.evidence_record_id === item.evidence_record_id, `${label} evidence record must match ReviewReport.`);
  assert(route.production_blocker_decision_id === item.production_blocker_decision_id, `${label} production blocker must match ReviewReport.`);
  assertArrayEqual(
    route.memory_blocker_decision_ids,
    item.memory_blocker_decision_ids || [],
    `${label} memory blocker decisions must match ReviewReport`
  );
  assert(route.production_exclusion_record_id === item.production_exclusion_record_id, `${label} production exclusion must match ReviewReport.`);

  assert(route.memory_allowed_output_now === item.memory_report.allowed_output_now, `${label} memory output must match ReviewReport.`);
  assert(route.memory_entry_allowed_now === item.memory_report.memory_entry_allowed_now, `${label} memory entry state must match ReviewReport.`);
  assert(route.memory_draft_allowed === item.memory_report.memory_draft_allowed, `${label} memory draft state must match ReviewReport.`);
  assert(route.memory_forbidden === item.memory_report.memory_forbidden, `${label} memory-forbidden state must match ReviewReport.`);
  assert(
    route.requires_human_memory_approval === item.memory_report.requires_human_memory_approval,
    `${label} memory approval state must match ReviewReport.`
  );
  assert(route.direct_memory_write_performed === false, `${label} direct memory write must be false.`);
  assert(route.daily_note_write_performed === false, `${label} DailyNote write must be false.`);
  assert(route.vcp_memory_write_performed === false, `${label} VCP memory write must be false.`);

  assert(route.production_allowed_output_now === item.production_report.allowed_output_now, `${label} production output must match ReviewReport.`);
  assert(
    route.production_promotion_allowed_now === item.production_report.production_promotion_allowed_now,
    `${label} production promotion state must match ReviewReport.`
  );
  assert(
    route.requires_human_production_approval === item.production_report.requires_human_production_approval,
    `${label} production approval state must match ReviewReport.`
  );
  assert(route.production_candidate_created === false, `${label} production candidate creation must be false.`);
  assert(route.accepted_samples_write_performed === false, `${label} accepted_samples write must be false.`);
  assert(route.never_production === item.production_report.never_production, `${label} never-production state must match ReviewReport.`);

  assert(route.may_enter_memory_now === item.final_controls.may_enter_memory_now, `${label} memory final control must match ReviewReport.`);
  assert(route.may_enter_production_now === item.final_controls.may_enter_production_now, `${label} production final control must match ReviewReport.`);
  assertArrayEqual(route.writes_allowed_now, item.final_controls.writes_allowed_now, `${label} allowed writes must match ReviewReport`);
  assertArrayEqual(route.writes_blocked, item.final_controls.writes_blocked, `${label} blocked writes must match ReviewReport`);
  assertArrayEqual(route.execution_blocked, item.final_controls.execution_blocked, `${label} blocked execution must match ReviewReport`);
}

function assertRouteSemantics(route) {
  assert(route.memory_entry_allowed_now === false, `${route.candidate_id} must not enter memory now.`);
  assert(route.production_promotion_allowed_now === false, `${route.candidate_id} must not enter production now.`);
  assert(route.writes_allowed_now.length === 0, `${route.candidate_id} must allow no writes now.`);
  assert(route.writes_blocked.includes("DailyNote_write"), `${route.candidate_id} must block DailyNote writes.`);
  assert(route.writes_blocked.includes("VCP_memory_write"), `${route.candidate_id} must block VCP memory writes.`);
  assert(route.writes_blocked.includes("accepted_samples_write"), `${route.candidate_id} must block accepted_samples writes.`);
  assert(route.writes_blocked.includes("production_candidate"), `${route.candidate_id} must block production candidate creation.`);
  assert(route.execution_blocked.includes("provider_execution"), `${route.candidate_id} must block provider execution.`);
  assert(route.execution_blocked.includes("plugin_call"), `${route.candidate_id} must block plugin calls.`);
  assert(route.execution_blocked.includes("api_call"), `${route.candidate_id} must block API calls.`);
  assert(route.execution_blocked.includes("image_generation"), `${route.candidate_id} must block image generation.`);

  if (route.review_outcome === "pass") {
    assert(route.route_class === "pass_review_pending", `${route.candidate_id} pass route class must be review pending.`);
    assert(route.pass_reasons.length > 0, `${route.candidate_id} pass route must explain pass reasons.`);
    assert(route.reject_reasons.length === 0, `${route.candidate_id} pass route must not have reject reasons.`);
    assert(route.memory_route === "draft_memory_candidate", `${route.candidate_id} pass route must remain a memory draft.`);
    assert(route.never_production === false, `${route.candidate_id} pass route must not be never-production.`);
  } else {
    assert(route.reject_reasons.length > 0, `${route.candidate_id} reject route must explain reject reasons.`);
    assert(route.pass_reasons.length === 0, `${route.candidate_id} reject route must not have pass reasons.`);
    assert(route.never_production === true, `${route.candidate_id} reject route must be never-production.`);
    assert(route.execution_blocked.includes("production_forever"), `${route.candidate_id} reject route must block production forever.`);
  }

  if (route.route_class === "reject_memory_forbidden") {
    assert(route.memory_route === "forbidden", `${route.candidate_id} memory-forbidden route must use forbidden memory route.`);
    assert(route.memory_draft_allowed === false, `${route.candidate_id} memory-forbidden route must not create memory drafts.`);
    assert(route.memory_forbidden === true, `${route.candidate_id} memory-forbidden route must be memory-forbidden.`);
    assert(route.unknown_failure_tags.includes("unmapped_identity_drift"), `${route.candidate_id} must carry unmapped identity drift.`);
  }
}

function assertGroup(summary, finalRoute, expectedCandidateIds) {
  const group = summary.route_groups.find((item) => item.final_route === finalRoute);
  assert(group, `Route summary must include ${finalRoute} group.`);
  assertArrayEqual(group.candidate_ids, expectedCandidateIds, `${finalRoute} candidate group must match`);
  assert(group.memory_entry_allowed_now === false, `${finalRoute} group must block memory entries now.`);
  assert(group.production_promotion_allowed_now === false, `${finalRoute} group must block production promotion now.`);
  assert(group.writes_allowed_now_count === 0, `${finalRoute} group must allow zero writes.`);
}

function countWhere(items, predicate) {
  return items.filter(predicate).length;
}

function main() {
  const missingFiles = requiredFiles.filter((relativePath) => !exists(relativePath));
  assert(missingFiles.length === 0, `Missing ReviewReport route summary validation files: ${missingFiles.join(", ")}`);

  const summary = parseJson(read("tests/schema_examples/review_report_route_summary.example.json"), "ReviewReport route summary");
  const standaloneReport = parseJson(read("tests/schema_examples/review_report_contract.example.json"), "standalone ReviewReport contract");
  const positiveAdapter = parseJson(read("tests/schema_examples/pvos_kernel_dry_run_adapter_response.example.json"), "positive adapter response");
  const negativeAdapter = parseJson(read("tests/schema_examples/pvos_kernel_dry_run_adapter_negative_guard_response.example.json"), "negative adapter response");
  const negativeMatrix = parseJson(read("tests/schema_examples/review_report_negative_guard_regression_matrix.example.json"), "negative guard matrix");

  assert(summary.status === "local_review_report_route_summary", "ReviewReport route summary must be local_review_report_route_summary.");
  assert(summary.display_only === true, "ReviewReport route summary must be display-only.");
  assert(summary.source_phase === "v14_073_review_report_negative_guard_regression_matrix_gate", "ReviewReport route summary source phase must be v14.073.");
  assert(summary.candidate_routes.length === 4, "ReviewReport route summary must include four candidate routes.");
  assert(summary.route_groups.length === 3, "ReviewReport route summary must include three route groups.");

  const sourceItems = [
    ...positiveAdapter.review_report_contract.report_items,
    ...negativeAdapter.review_report_contract.report_items
  ];

  for (const route of summary.candidate_routes) {
    assertRouteMatchesReportItem(route, getByCandidate(sourceItems, route.candidate_id, "source ReviewReport items"), route.candidate_id);
    assertRouteSemantics(route);
  }

  for (const item of standaloneReport.report_items) {
    const route = getByCandidate(summary.candidate_routes, item.candidate_id, "ReviewReport route summary");
    assert(route.review_outcome === item.review_outcome, `${item.candidate_id} standalone review outcome must match route summary.`);
    assert(route.final_route === item.final_route, `${item.candidate_id} standalone final route must match route summary.`);
    assertArrayEqual(route.pass_reasons, item.pass_reasons, `${item.candidate_id} standalone pass reasons must match route summary`);
    assertArrayEqual(route.reject_reasons, item.reject_reasons, `${item.candidate_id} standalone reject reasons must match route summary`);
  }

  assertGroup(summary, "pass_draft_only_pending_human_review", ["candidate_accept_metadata_001"]);
  assertGroup(summary, "reject_failure_learning_only_never_production", [
    "candidate_reject_metadata_001",
    "candidate_reject_mapped_guard_001"
  ]);
  assertGroup(summary, "reject_memory_forbidden_never_production", ["candidate_reject_unknown_guard_001"]);

  assertArrayEqual(
    summary.candidate_routes
      .filter((route) => route.source_fixture === "negative_review_report_contract")
      .map((route) => route.candidate_id),
    negativeMatrix.expected_consensus.candidate_ids,
    "Negative route candidate IDs must match v14.073 matrix"
  );
  assertArrayEqual(
    summary.candidate_routes
      .filter((route) => route.source_fixture === "negative_review_report_contract" && route.memory_forbidden)
      .map((route) => route.candidate_id),
    negativeMatrix.expected_consensus.memory_forbidden_candidate_ids,
    "Negative memory-forbidden IDs must match v14.073 matrix"
  );
  assertArrayEqual(
    summary.candidate_routes
      .filter((route) => route.source_fixture === "negative_review_report_contract" && route.never_production)
      .map((route) => route.candidate_id),
    negativeMatrix.expected_consensus.never_production_candidate_ids,
    "Negative never-production IDs must match v14.073 matrix"
  );
  assertArrayEqual(
    summary.candidate_routes.flatMap((route) => route.unknown_failure_tags),
    negativeMatrix.expected_consensus.unknown_failure_tags,
    "Unknown failure tags must match v14.073 matrix"
  );

  assert(summary.route_summary.candidate_count === summary.candidate_routes.length, "Route summary candidate count must match routes.");
  assert(summary.route_summary.pass_count === countWhere(summary.candidate_routes, (route) => route.review_outcome === "pass"), "Pass count must match routes.");
  assert(summary.route_summary.reject_count === countWhere(summary.candidate_routes, (route) => route.review_outcome === "reject"), "Reject count must match routes.");
  assert(
    summary.route_summary.memory_draft_allowed_count === countWhere(summary.candidate_routes, (route) => route.memory_draft_allowed),
    "Memory draft count must match routes."
  );
  assert(
    summary.route_summary.memory_forbidden_count === countWhere(summary.candidate_routes, (route) => route.memory_forbidden),
    "Memory-forbidden count must match routes."
  );
  assert(
    summary.route_summary.never_production_count === countWhere(summary.candidate_routes, (route) => route.never_production),
    "Never-production count must match routes."
  );
  assert(
    summary.route_summary.unknown_failure_candidate_count === countWhere(summary.candidate_routes, (route) => route.unknown_failure_tags.length > 0),
    "Unknown failure count must match routes."
  );
  assert(summary.route_summary.memory_entry_allowed_now_count === 0, "No route may enter memory now.");
  assert(summary.route_summary.production_promotion_allowed_now_count === 0, "No route may enter production now.");
  assert(summary.route_summary.writes_allowed_now_count === 0, "No route may allow writes now.");
  assert(summary.route_summary.all_report_items_explained === true, "All report items must be explained.");
  assert(summary.route_summary.all_memory_entries_blocked_now === true, "All memory entries must be blocked now.");
  assert(summary.route_summary.all_production_promotion_blocked_now === true, "All production promotions must be blocked now.");
  assert(summary.route_summary.all_writes_blocked === true, "All writes must be blocked.");
  assert(summary.route_summary.all_provider_execution_blocked === true, "All provider execution must be blocked.");
  assert(summary.route_summary.all_candidates_have_evidence_record === true, "All candidates must have evidence records.");
  assert(summary.route_summary.all_candidates_have_blocker_decision === true, "All candidates must have blocker decisions.");
  assert(summary.route_summary.all_never_production_rejects_have_exclusion === true, "All never-production rejects must have exclusions.");
  assert(summary.route_summary.direct_memory_write_performed === false, "Route summary must not write memory directly.");
  assert(summary.route_summary.daily_note_write_performed === false, "Route summary must not write DailyNote.");
  assert(summary.route_summary.vcp_memory_write_performed === false, "Route summary must not write VCP memory.");
  assert(summary.route_summary.accepted_samples_write_performed === false, "Route summary must not write accepted samples.");
  assert(summary.route_summary.production_candidate_created === false, "Route summary must not create production candidates.");
  assertNoExecutionGuard(summary.no_execution_guard, "ReviewReport route summary no-execution guard");

  const result = {
    passed: true,
    review_report_route_summary: {
      review_report_route_summary_present: true,
      review_report_route_summary_matches_positive_review_report: true,
      review_report_route_summary_matches_negative_review_report: true,
      review_report_route_summary_matches_negative_matrix: true,
      review_report_route_summary_groups_verified: true,
      review_report_route_summary_pass_route_verified: true,
      review_report_route_summary_reject_failure_learning_route_verified: true,
      review_report_route_summary_memory_forbidden_route_verified: true,
      review_report_route_summary_unknown_failure_verified: true,
      review_report_route_summary_memory_entry_blocked: true,
      review_report_route_summary_production_blocked: true,
      review_report_route_summary_never_production_verified: true,
      review_report_route_summary_no_daily_note_write_verified: true,
      review_report_route_summary_no_vcp_memory_write_verified: true,
      review_report_route_summary_no_accepted_samples_write_verified: true,
      review_report_route_summary_no_production_candidate_verified: true,
      review_report_route_summary_no_provider_plugin_api_image_verified: true,
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
