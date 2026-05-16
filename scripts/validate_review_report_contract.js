const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const requiredFiles = [
  "tests/schema_examples/review_report_contract.example.json",
  "tests/schema_examples/review_admission_control_matrix.example.json",
  "tests/schema_examples/review_blocker_arbiter_route_summary.example.json"
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

function assertReportItem(item, route, matrixRow) {
  assert(item.review_outcome === route.review_outcome, `${item.candidate_id} review outcome must match route summary.`);
  assert(item.review_outcome === matrixRow.review_outcome, `${item.candidate_id} review outcome must match admission matrix.`);
  assert(item.final_route === route.final_route, `${item.candidate_id} final route must match route summary.`);
  assert(item.final_route === matrixRow.final_route, `${item.candidate_id} final route must match admission matrix.`);
  assertArrayEqual(item.pass_reasons, route.pass_reasons, `${item.candidate_id} pass reasons must match route summary`);
  assertArrayEqual(item.reject_reasons, route.reject_reasons, `${item.candidate_id} reject reasons must match route summary`);
  assertArrayEqual(item.failure_tags, route.failure_tags, `${item.candidate_id} failure tags must match route summary`);
  assert(item.evidence_record_id === route.evidence_record_id, `${item.candidate_id} evidence record must match route summary.`);
  assert(item.production_blocker_decision_id === route.production_blocker_decision_id, `${item.candidate_id} blocker decision must match route summary.`);
  assert(item.production_exclusion_record_id === route.production_exclusion_record_id, `${item.candidate_id} production exclusion record must match route summary.`);

  assert(item.memory_report.allowed_output_now === matrixRow.memory_allowed_output_now, `${item.candidate_id} memory output must match admission matrix.`);
  assert(item.memory_report.memory_entry_allowed_now === matrixRow.memory_entry_allowed_now, `${item.candidate_id} memory entry allowance must match admission matrix.`);
  assert(item.memory_report.requires_human_memory_approval === matrixRow.requires_human_memory_approval, `${item.candidate_id} human memory approval must match admission matrix.`);
  assert(item.memory_report.direct_memory_write_performed === false, `${item.candidate_id} direct memory write must be false.`);
  assert(item.memory_report.daily_note_write_performed === false, `${item.candidate_id} DailyNote write must be false.`);
  assert(item.memory_report.vcp_memory_write_performed === false, `${item.candidate_id} VCP memory write must be false.`);

  assert(item.production_report.allowed_output_now === matrixRow.production_allowed_output_now, `${item.candidate_id} production output must match admission matrix.`);
  assert(item.production_report.production_promotion_allowed_now === matrixRow.production_promotion_allowed_now, `${item.candidate_id} production promotion must match admission matrix.`);
  assert(item.production_report.requires_human_production_approval === matrixRow.requires_human_production_approval, `${item.candidate_id} human production approval must match admission matrix.`);
  assert(item.production_report.never_production === matrixRow.never_production, `${item.candidate_id} never-production must match admission matrix.`);
  assert(item.production_report.production_candidate_created === false, `${item.candidate_id} production candidate must be false.`);
  assert(item.production_report.accepted_samples_write_performed === false, `${item.candidate_id} accepted_samples write must be false.`);

  assert(item.final_controls.may_enter_memory_now === false, `${item.candidate_id} must not enter memory now.`);
  assert(item.final_controls.may_enter_production_now === false, `${item.candidate_id} must not enter production now.`);
  assert(item.final_controls.writes_allowed_now.length === 0, `${item.candidate_id} must allow no writes now.`);
  assertArrayEqual(item.final_controls.writes_blocked, matrixRow.writes_blocked, `${item.candidate_id} blocked writes must match admission matrix`);
  assertArrayEqual(item.final_controls.execution_blocked, matrixRow.execution_blocked, `${item.candidate_id} blocked execution must match admission matrix`);
}

function main() {
  const missingFiles = requiredFiles.filter((relativePath) => !exists(relativePath));
  assert(missingFiles.length === 0, `Missing review report validation files: ${missingFiles.join(", ")}`);

  const report = parseJson(read("tests/schema_examples/review_report_contract.example.json"), "review report contract");
  const matrix = parseJson(read("tests/schema_examples/review_admission_control_matrix.example.json"), "admission control matrix");
  const routeSummary = parseJson(read("tests/schema_examples/review_blocker_arbiter_route_summary.example.json"), "route summary");

  assert(report.status === "local_review_report_contract", "Review report must be local_review_report_contract.");
  assert(report.display_only === true, "Review report must be display-only.");
  assert(report.source_phase === "v14_066_review_admission_control_matrix_gate", "Review report source phase must be v14.066.");
  assert(
    report.source_admission_matrix_ref === "tests/schema_examples/review_admission_control_matrix.example.json",
    "Review report must cite admission matrix."
  );
  assert(
    report.source_route_summary_ref === "tests/schema_examples/review_blocker_arbiter_route_summary.example.json",
    "Review report must cite route summary."
  );
  assert(report.report_items.length === routeSummary.candidate_routes.length, "Report item count must match route summary.");
  assert(report.report_items.length === matrix.candidate_matrix.length, "Report item count must match admission matrix.");

  for (const item of report.report_items) {
    assertReportItem(
      item,
      getByCandidate(routeSummary.candidate_routes, item.candidate_id, "route summary"),
      getByCandidate(matrix.candidate_matrix, item.candidate_id, "admission control matrix")
    );
  }

  const passItem = getByCandidate(report.report_items, "candidate_accept_metadata_001", "review report");
  const rejectItem = getByCandidate(report.report_items, "candidate_reject_metadata_001", "review report");

  assert(passItem.review_outcome === "pass", "Pass report item must be pass.");
  assert(passItem.report_decision === "pass_to_draft_review_queue", "Pass report item must route to draft review queue.");
  assert(passItem.report_status === "draft_report_pending_human_review", "Pass report item must remain pending human review.");
  assert(passItem.pass_reasons.length > 0, "Pass report item must explain pass reasons.");
  assert(passItem.reject_reasons.length === 0, "Pass report item must not have reject reasons.");
  assert(passItem.production_report.never_production === false, "Pass report item must not be never-production.");

  assert(rejectItem.review_outcome === "reject", "Reject report item must be reject.");
  assert(rejectItem.report_decision === "reject_to_failure_learning_never_production", "Reject report item must route to failure learning and never-production.");
  assert(rejectItem.report_status === "draft_report_failure_learning_only", "Reject report item must remain failure-learning draft only.");
  assert(rejectItem.reject_reasons.length > 0, "Reject report item must explain reject reasons.");
  assert(rejectItem.pass_reasons.length === 0, "Reject report item must not have pass reasons.");
  assert(rejectItem.failure_tags.length > 0, "Reject report item must include failure tags.");
  assert(rejectItem.production_report.never_production === true, "Reject report item must be never-production.");
  assert(rejectItem.final_controls.execution_blocked.includes("production_forever"), "Reject report item must block production forever.");

  assert(report.report_summary.candidate_count === 2, "Report summary must count two candidates.");
  assert(report.report_summary.pass_count === 1, "Report summary must count one pass.");
  assert(report.report_summary.reject_count === 1, "Report summary must count one reject.");
  assert(report.report_summary.report_items_explain_all_candidates === true, "Report summary must explain all candidates.");
  assert(report.report_summary.memory_entry_allowed_now_count === 0, "Report summary must allow zero memory entries now.");
  assert(report.report_summary.production_promotion_allowed_now_count === 0, "Report summary must allow zero production promotions now.");
  assert(report.report_summary.writes_allowed_now_count === 0, "Report summary must allow zero writes now.");
  assert(report.report_summary.never_production_count === routeSummary.route_summary.never_production_count, "Report summary never-production count must match route summary.");
  assert(report.report_summary.all_memory_writes_blocked === true, "Report summary must block all memory writes.");
  assert(report.report_summary.all_production_writes_blocked === true, "Report summary must block all production writes.");
  assert(report.report_summary.all_provider_execution_blocked === true, "Report summary must block provider execution.");
  assert(report.report_summary.all_candidates_have_evidence_record === true, "Report summary must require evidence records.");
  assert(report.report_summary.all_candidates_have_blocker_decision === true, "Report summary must require blocker decisions.");
  assertNoExecutionGuard(report.no_execution_guard, "review report no-execution guard");

  const result = {
    passed: true,
    review_report_contract: {
      review_report_contract_present: true,
      review_report_matches_route_summary: true,
      review_report_matches_admission_matrix: true,
      review_report_pass_candidate_explained: true,
      review_report_reject_candidate_explained: true,
      review_report_memory_entry_blocked: true,
      review_report_production_blocked: true,
      review_report_never_production_verified: true,
      review_report_no_direct_memory_write_verified: true,
      review_report_no_accepted_samples_write_verified: true,
      review_report_no_production_candidate_verified: true,
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
