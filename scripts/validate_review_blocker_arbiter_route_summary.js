const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const requiredFiles = [
  "tests/schema_examples/review_blocker_arbiter_route_summary.example.json",
  "tests/schema_examples/review_console_blocker_arbiter_draft_output_snapshot.example.json",
  "tests/schema_examples/pvos_kernel_dry_run_adapter_response.example.json"
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

function assertCandidateRoute(route, snapshotRoute, adapterRoute, protocolRoute) {
  assert(route.review_outcome === snapshotRoute.review_outcome, `${route.candidate_id} review outcome must match snapshot.`);
  assert(route.review_outcome === adapterRoute.review_outcome, `${route.candidate_id} review outcome must match adapter arbiter.`);
  assert(route.final_route === snapshotRoute.final_route, `${route.candidate_id} final route must match snapshot.`);
  assert(route.final_route === adapterRoute.final_route, `${route.candidate_id} final route must match adapter arbiter.`);
  assert(route.production_decision === snapshotRoute.production_decision, `${route.candidate_id} production decision must match snapshot.`);
  assert(route.production_decision === adapterRoute.production_decision, `${route.candidate_id} production decision must match adapter arbiter.`);
  assert(route.memory_decision === snapshotRoute.memory_decision, `${route.candidate_id} memory decision must match snapshot.`);
  assert(route.memory_decision === adapterRoute.memory_decision, `${route.candidate_id} memory decision must match adapter arbiter.`);
  assert(route.evidence_record_id === snapshotRoute.evidence_record_id, `${route.candidate_id} evidence record must match snapshot.`);
  assert(route.production_blocker_decision_id === snapshotRoute.production_blocker_decision_id, `${route.candidate_id} blocker decision must match snapshot.`);
  assert(route.production_exclusion_record_id === snapshotRoute.production_exclusion_record_id, `${route.candidate_id} production exclusion record must match snapshot.`);
  assertArrayEqual(route.pass_reasons, protocolRoute.pass_reasons, `${route.candidate_id} pass reasons must match protocol report`);
  assertArrayEqual(route.reject_reasons, protocolRoute.reject_reasons, `${route.candidate_id} reject reasons must match protocol report`);
  assertArrayEqual(route.failure_tags, protocolRoute.failure_tags, `${route.candidate_id} failure tags must match protocol report`);

  assert(route.memory_draft_allowed === snapshotRoute.memory_draft_allowed, `${route.candidate_id} memory draft allowance must match snapshot.`);
  assert(route.memory_entry_allowed_now === false, `${route.candidate_id} memory entry must be blocked now.`);
  assert(route.production_promotion_allowed_now === false, `${route.candidate_id} production promotion must be blocked now.`);
  assert(route.requires_human_review === true, `${route.candidate_id} must require human review.`);
  assert(route.requires_human_memory_approval === true, `${route.candidate_id} must require human memory approval.`);
  assert(route.direct_memory_write_performed === false, `${route.candidate_id} must not write memory directly.`);
  assert(route.production_candidate_created === false, `${route.candidate_id} must not create a production candidate.`);
  assert(route.accepted_samples_write_performed === false, `${route.candidate_id} must not write accepted samples.`);
}

function main() {
  const missingFiles = requiredFiles.filter((relativePath) => !exists(relativePath));
  assert(missingFiles.length === 0, `Missing route summary validation files: ${missingFiles.join(", ")}`);

  const summary = parseJson(read("tests/schema_examples/review_blocker_arbiter_route_summary.example.json"), "route summary");
  const snapshot = parseJson(
    read("tests/schema_examples/review_console_blocker_arbiter_draft_output_snapshot.example.json"),
    "blocker arbiter draft output snapshot"
  );
  const adapter = parseJson(
    read("tests/schema_examples/pvos_kernel_dry_run_adapter_response.example.json"),
    "PVOS adapter response"
  );

  assert(summary.status === "local_route_summary", "Route summary must be local_route_summary.");
  assert(summary.display_only === true, "Route summary must be display-only.");
  assert(summary.source_phase === "v14_062_review_console_blocker_arbiter_regression_matrix_refresh_gate", "Route summary source phase must be v14.062.");
  assert(
    summary.source_snapshot_ref === "tests/schema_examples/review_console_blocker_arbiter_draft_output_snapshot.example.json",
    "Route summary must cite blocker arbiter snapshot."
  );
  assert(
    summary.source_adapter_response_ref === "tests/schema_examples/pvos_kernel_dry_run_adapter_response.example.json",
    "Route summary must cite PVOS adapter response."
  );

  const snapshotHandoff = snapshot.review_blocker_arbiter_static_handoff;
  const adapterArbiter = adapter.review_blocker_arbiter;
  const protocolReport = adapter.review_result_protocol_report;
  assert(snapshotHandoff, "Snapshot must include review_blocker_arbiter_static_handoff.");
  assert(adapterArbiter, "Adapter response must include review_blocker_arbiter.");
  assert(protocolReport, "Adapter response must include review_result_protocol_report.");
  assert(summary.candidate_routes.length === snapshotHandoff.candidate_arbitrations.length, "Route summary candidate count must match snapshot.");

  for (const route of summary.candidate_routes) {
    assertCandidateRoute(
      route,
      getByCandidate(snapshotHandoff.candidate_arbitrations, route.candidate_id, "snapshot candidate arbitrations"),
      getByCandidate(adapterArbiter.candidate_arbitrations, route.candidate_id, "adapter arbiter candidate arbitrations"),
      getByCandidate(protocolReport.candidate_review_results, route.candidate_id, "protocol report candidate results")
    );
  }

  const passRoute = getByCandidate(summary.candidate_routes, "candidate_accept_metadata_001", "route summary");
  const rejectRoute = getByCandidate(summary.candidate_routes, "candidate_reject_metadata_001", "route summary");
  assert(passRoute.review_outcome === "pass", "Accept metadata candidate must pass.");
  assert(passRoute.pass_reasons.length > 0, "Pass route must explain why it passed.");
  assert(passRoute.reject_reasons.length === 0, "Pass route must have no reject reasons.");
  assert(passRoute.memory_route === "draft_memory_candidate", "Pass route must remain draft memory candidate.");
  assert(passRoute.production_destination === "blocked_until_human_review", "Pass route production must be blocked until human review.");
  assert(passRoute.never_production === false, "Pass route must not be permanently never-production.");
  assert(rejectRoute.review_outcome === "reject", "Reject metadata candidate must reject.");
  assert(rejectRoute.reject_reasons.length > 0, "Reject route must explain why it was rejected.");
  assert(rejectRoute.pass_reasons.length === 0, "Reject route must have no pass reasons.");
  assert(rejectRoute.failure_tags.length > 0, "Reject route must carry failure tags.");
  assert(rejectRoute.memory_route === "audit_only_failure_learning", "Reject route must remain failure-learning only.");
  assert(rejectRoute.production_destination === "never_production", "Reject route production destination must be never-production.");
  assert(rejectRoute.never_production === true, "Reject route must be permanently never-production.");

  assert(summary.route_summary.candidate_count === 2, "Route summary must count two candidates.");
  assert(summary.route_summary.pass_count === 1, "Route summary must count one pass.");
  assert(summary.route_summary.reject_count === 1, "Route summary must count one reject.");
  assert(summary.route_summary.memory_draft_candidate_count === 2, "Route summary must count two memory drafts.");
  assert(summary.route_summary.memory_entry_blocked_now_count === 2, "Route summary must block both memory entries now.");
  assert(summary.route_summary.production_blocked_count === snapshotHandoff.arbiter_summary.production_blocked_count, "Route summary production blocked count must match snapshot.");
  assert(summary.route_summary.never_production_count === snapshotHandoff.arbiter_summary.never_production_count, "Route summary never-production count must match snapshot.");
  assert(summary.route_summary.human_review_required_count === snapshotHandoff.arbiter_summary.human_review_required_count, "Route summary human review count must match snapshot.");
  assert(summary.route_summary.all_production_blocked === true, "Route summary must block all production.");
  assert(summary.route_summary.all_memory_entries_blocked_now === true, "Route summary must block all memory entries now.");
  assert(summary.route_summary.all_writes_blocked === true, "Route summary must block all writes.");
  assert(summary.route_summary.direct_memory_write_performed === false, "Route summary must not write memory directly.");
  assert(summary.route_summary.production_candidate_created === false, "Route summary must not create production candidates.");
  assert(summary.route_summary.accepted_samples_write_performed === false, "Route summary must not write accepted samples.");
  assertNoExecutionGuard(summary.no_execution_guard, "route summary no-execution guard");

  const result = {
    passed: true,
    review_blocker_arbiter_route_summary: {
      route_summary_present: true,
      route_summary_matches_snapshot: true,
      route_summary_matches_adapter_arbiter: true,
      route_summary_pass_reason_verified: true,
      route_summary_reject_reason_verified: true,
      route_summary_memory_rules_verified: true,
      route_summary_production_rules_verified: true,
      route_summary_never_production_verified: true,
      route_summary_no_production_candidate_verified: true,
      route_summary_no_direct_memory_write_verified: true,
      route_summary_no_accepted_samples_write_verified: true,
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
