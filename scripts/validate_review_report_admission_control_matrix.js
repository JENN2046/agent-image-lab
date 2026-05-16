const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const requiredFiles = [
  "tests/schema_examples/review_report_admission_control_matrix.example.json",
  "tests/schema_examples/review_report_route_summary.example.json"
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

function countWhere(items, predicate) {
  return items.filter(predicate).length;
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

function assertAdmissionMatchesRoute(row, route) {
  assert(row.route_class === route.route_class, `${row.candidate_id} route class must match route summary.`);
  assert(row.review_outcome === route.review_outcome, `${row.candidate_id} review outcome must match route summary.`);
  assert(row.final_route === route.final_route, `${row.candidate_id} final route must match route summary.`);
  assert(row.memory_allowed_output_now === route.memory_allowed_output_now, `${row.candidate_id} memory output must match route summary.`);
  assert(row.memory_draft_allowed === route.memory_draft_allowed, `${row.candidate_id} memory draft state must match route summary.`);
  assert(row.memory_forbidden === route.memory_forbidden, `${row.candidate_id} memory-forbidden state must match route summary.`);
  assert(row.memory_entry_allowed_now === route.memory_entry_allowed_now, `${row.candidate_id} memory entry state must match route summary.`);
  assert(
    row.requires_human_memory_approval === route.requires_human_memory_approval,
    `${row.candidate_id} human memory approval must match route summary.`
  );
  assert(row.production_allowed_output_now === route.production_allowed_output_now, `${row.candidate_id} production output must match route summary.`);
  assert(
    row.production_promotion_allowed_now === route.production_promotion_allowed_now,
    `${row.candidate_id} production promotion state must match route summary.`
  );
  assert(
    row.requires_human_production_approval === route.requires_human_production_approval,
    `${row.candidate_id} human production approval must match route summary.`
  );
  assert(row.never_production === route.never_production, `${row.candidate_id} never-production must match route summary.`);
  assert(row.production_exclusion_record_id === route.production_exclusion_record_id, `${row.candidate_id} production exclusion must match route summary.`);
  assertArrayEqual(row.writes_allowed_now, route.writes_allowed_now, `${row.candidate_id} allowed writes must match route summary`);
  assertArrayEqual(row.writes_blocked_now, route.writes_blocked, `${row.candidate_id} blocked writes must match route summary`);
  assertArrayEqual(row.execution_blocked_now, route.execution_blocked, `${row.candidate_id} blocked execution must match route summary`);
}

function assertAdmissionSemantics(row, route) {
  assert(row.memory_entry_allowed_now === false, `${row.candidate_id} must not enter memory now.`);
  assert(row.direct_memory_write_allowed_now === false, `${row.candidate_id} must block direct memory writes now.`);
  assert(row.daily_note_write_allowed_now === false, `${row.candidate_id} must block DailyNote writes now.`);
  assert(row.vcp_memory_write_allowed_now === false, `${row.candidate_id} must block VCP memory writes now.`);
  assert(row.production_promotion_allowed_now === false, `${row.candidate_id} must block production promotion now.`);
  assert(row.production_candidate_allowed_now === false, `${row.candidate_id} must block production candidates now.`);
  assert(row.accepted_samples_write_allowed_now === false, `${row.candidate_id} must block accepted_samples writes now.`);
  assert(row.writes_allowed_now.length === 0, `${row.candidate_id} must allow zero writes now.`);

  for (const blockedWrite of ["DailyNote_write", "VCP_memory_write", "direct_memory_write", "accepted_samples_write", "production_candidate"]) {
    assert(row.writes_blocked_now.includes(blockedWrite), `${row.candidate_id} must block ${blockedWrite}.`);
  }
  for (const blockedExecution of ["provider_execution", "plugin_call", "api_call", "image_generation", "deployment_or_release"]) {
    assert(row.execution_blocked_now.includes(blockedExecution), `${row.candidate_id} must block ${blockedExecution}.`);
  }

  if (row.review_outcome === "pass") {
    assert(row.matrix_verdict === "pass_candidate_draft_review_only_no_write_now", `${row.candidate_id} pass verdict must be draft-review-only.`);
    assert(row.memory_admission_state === "blocked_pending_human_memory_approval", `${row.candidate_id} pass memory admission must wait for approval.`);
    assert(
      row.production_admission_state === "blocked_pending_human_review_and_separate_promotion_gate",
      `${row.candidate_id} pass production admission must wait for review and a separate gate.`
    );
    assert(row.memory_entry_potential_after_human_approval === true, `${row.candidate_id} pass route may only be reconsidered after memory approval.`);
    assert(row.production_reconsideration_after_separate_gate === true, `${row.candidate_id} pass route may only be reconsidered after a separate promotion gate.`);
    assert(row.never_production === false, `${row.candidate_id} pass route must not be never-production.`);
  } else {
    assert(row.production_admission_state === "forbidden_permanently", `${row.candidate_id} reject production must be permanently forbidden.`);
    assert(row.production_reconsideration_after_separate_gate === false, `${row.candidate_id} reject route must not be reconsidered for production.`);
    assert(row.never_production === true, `${row.candidate_id} reject route must be never-production.`);
    assert(row.execution_blocked_now.includes("production_forever"), `${row.candidate_id} reject route must block production forever.`);
    assert(row.production_exclusion_record_id !== null, `${row.candidate_id} reject route must carry production exclusion.`);
  }

  if (route.unknown_failure_tags.length > 0) {
    assert(row.matrix_verdict === "unknown_failure_memory_forbidden_never_production", `${row.candidate_id} unknown failure verdict must forbid memory.`);
    assert(row.memory_admission_state === "forbidden_permanently", `${row.candidate_id} unknown failure memory must be forbidden permanently.`);
    assert(row.memory_draft_allowed === false, `${row.candidate_id} unknown failure must not create memory drafts.`);
    assert(row.memory_entry_potential_after_human_approval === false, `${row.candidate_id} unknown failure must not become memory-eligible.`);
    assert(row.memory_forbidden === true, `${row.candidate_id} unknown failure must be memory-forbidden.`);
    assertArrayEqual(row.unknown_failure_tags, route.unknown_failure_tags, `${row.candidate_id} unknown failure tags must match route summary`);
  } else if (row.review_outcome === "reject") {
    assert(
      row.matrix_verdict === "reject_failure_learning_memory_draft_only_never_production",
      `${row.candidate_id} mapped reject verdict must be failure-learning only.`
    );
    assert(row.memory_admission_state === "blocked_pending_human_memory_approval", `${row.candidate_id} mapped reject memory must wait for approval.`);
    assert(row.memory_draft_allowed === true, `${row.candidate_id} mapped reject may only create a draft.`);
    assert(row.memory_forbidden === false, `${row.candidate_id} mapped reject should not be memory-forbidden.`);
    assert(row.memory_entry_potential_after_human_approval === true, `${row.candidate_id} mapped reject memory remains approval-gated.`);
  }
}

function main() {
  const missingFiles = requiredFiles.filter((relativePath) => !exists(relativePath));
  assert(missingFiles.length === 0, `Missing ReviewReport admission control matrix files: ${missingFiles.join(", ")}`);

  const matrix = parseJson(
    read("tests/schema_examples/review_report_admission_control_matrix.example.json"),
    "ReviewReport admission control matrix"
  );
  const routeSummary = parseJson(read("tests/schema_examples/review_report_route_summary.example.json"), "ReviewReport route summary");

  assert(matrix.status === "local_review_report_admission_control_matrix", "ReviewReport admission matrix must be local_review_report_admission_control_matrix.");
  assert(matrix.display_only === true, "ReviewReport admission matrix must be display-only.");
  assert(matrix.source_phase === "v14_074_review_report_route_summary_gate", "ReviewReport admission matrix source phase must be v14.074.");
  assert(
    matrix.source_route_summary_ref === "tests/schema_examples/review_report_route_summary.example.json",
    "ReviewReport admission matrix must cite ReviewReport route summary."
  );
  assert(matrix.candidate_admissions.length === routeSummary.candidate_routes.length, "Admission row count must match route summary.");

  for (const row of matrix.candidate_admissions) {
    const route = getByCandidate(routeSummary.candidate_routes, row.candidate_id, "ReviewReport route summary");
    assertAdmissionMatchesRoute(row, route);
    assertAdmissionSemantics(row, route);
  }

  assert(matrix.matrix_summary.candidate_count === matrix.candidate_admissions.length, "Matrix candidate count must match rows.");
  assert(matrix.matrix_summary.pass_candidate_count === countWhere(matrix.candidate_admissions, (row) => row.review_outcome === "pass"), "Pass count must match rows.");
  assert(matrix.matrix_summary.reject_candidate_count === countWhere(matrix.candidate_admissions, (row) => row.review_outcome === "reject"), "Reject count must match rows.");
  assert(matrix.matrix_summary.memory_draft_allowed_count === countWhere(matrix.candidate_admissions, (row) => row.memory_draft_allowed), "Memory draft count must match rows.");
  assert(matrix.matrix_summary.memory_forbidden_count === countWhere(matrix.candidate_admissions, (row) => row.memory_forbidden), "Memory-forbidden count must match rows.");
  assert(matrix.matrix_summary.memory_entry_allowed_now_count === 0, "No memory entry may be admitted now.");
  assert(
    matrix.matrix_summary.memory_entry_potential_after_human_approval_count ===
      countWhere(matrix.candidate_admissions, (row) => row.memory_entry_potential_after_human_approval),
    "Memory future approval count must match rows."
  );
  assert(matrix.matrix_summary.production_promotion_allowed_now_count === 0, "No production promotion may be admitted now.");
  assert(matrix.matrix_summary.production_candidate_allowed_now_count === 0, "No production candidate may be created now.");
  assert(matrix.matrix_summary.accepted_samples_write_allowed_now_count === 0, "No accepted_samples write may be admitted now.");
  assert(
    matrix.matrix_summary.production_reconsideration_candidate_count ===
      countWhere(matrix.candidate_admissions, (row) => row.production_reconsideration_after_separate_gate),
    "Production reconsideration count must match rows."
  );
  assert(matrix.matrix_summary.never_production_count === routeSummary.route_summary.never_production_count, "Never-production count must match route summary.");
  assert(
    matrix.matrix_summary.unknown_failure_memory_forbidden_count === countWhere(matrix.candidate_admissions, (row) => row.unknown_failure_tags && row.unknown_failure_tags.length > 0),
    "Unknown failure memory-forbidden count must match rows."
  );
  assert(matrix.matrix_summary.human_memory_approval_required_count === matrix.candidate_admissions.length, "Every row must require human memory approval.");
  assert(
    matrix.matrix_summary.human_production_approval_required_count === countWhere(matrix.candidate_admissions, (row) => row.requires_human_production_approval),
    "Human production approval count must match rows."
  );
  assert(matrix.matrix_summary.all_memory_writes_blocked_now === true, "All memory writes must be blocked now.");
  assert(matrix.matrix_summary.all_production_writes_blocked_now === true, "All production writes must be blocked now.");
  assert(matrix.matrix_summary.all_accepted_samples_writes_blocked_now === true, "All accepted_samples writes must be blocked now.");
  assert(matrix.matrix_summary.all_provider_execution_blocked_now === true, "All provider execution must be blocked now.");
  assert(matrix.matrix_summary.all_rejects_never_production === true, "All rejects must be never-production.");
  assert(matrix.matrix_summary.all_unknown_failures_memory_forbidden === true, "All unknown failures must be memory-forbidden.");
  assert(matrix.matrix_summary.all_current_writes_blocked === true, "All current writes must be blocked.");
  assertNoExecutionGuard(matrix.no_execution_guard, "ReviewReport admission control matrix no-execution guard");

  const result = {
    passed: true,
    review_report_admission_control_matrix: {
      review_report_admission_matrix_present: true,
      review_report_admission_matrix_matches_route_summary: true,
      review_report_admission_pass_draft_review_only_verified: true,
      review_report_admission_reject_failure_learning_verified: true,
      review_report_admission_unknown_memory_forbidden_verified: true,
      review_report_admission_memory_entry_blocked_now: true,
      review_report_admission_production_blocked_now: true,
      review_report_admission_accepted_samples_blocked_now: true,
      review_report_admission_never_production_verified: true,
      review_report_admission_no_daily_note_write_verified: true,
      review_report_admission_no_vcp_memory_write_verified: true,
      review_report_admission_no_accepted_samples_write_verified: true,
      review_report_admission_no_production_candidate_verified: true,
      review_report_admission_no_provider_plugin_api_image_verified: true,
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
