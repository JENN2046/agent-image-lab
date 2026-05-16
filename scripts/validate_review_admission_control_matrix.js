const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const requiredFiles = [
  "tests/schema_examples/review_admission_control_matrix.example.json",
  "tests/schema_examples/review_memory_admission_control.example.json",
  "tests/schema_examples/review_production_admission_control.example.json",
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

function assertMatrixRow(row, route, memoryAdmission, productionAdmission) {
  assert(row.review_outcome === route.review_outcome, `${row.candidate_id} review outcome must match route summary.`);
  assert(row.review_outcome === memoryAdmission.review_outcome, `${row.candidate_id} review outcome must match memory admission.`);
  assert(row.review_outcome === productionAdmission.review_outcome, `${row.candidate_id} review outcome must match production admission.`);
  assert(row.final_route === route.final_route, `${row.candidate_id} final route must match route summary.`);
  assert(row.memory_allowed_output_now === memoryAdmission.allowed_output_now, `${row.candidate_id} memory output must match memory admission.`);
  assert(row.memory_entry_allowed_now === memoryAdmission.memory_entry_allowed_now, `${row.candidate_id} memory entry allowance must match memory admission.`);
  assert(row.requires_human_memory_approval === memoryAdmission.requires_human_memory_approval, `${row.candidate_id} human memory approval must match memory admission.`);
  assert(row.production_allowed_output_now === productionAdmission.allowed_output_now, `${row.candidate_id} production output must match production admission.`);
  assert(row.production_promotion_allowed_now === productionAdmission.production_promotion_allowed_now, `${row.candidate_id} production promotion must match production admission.`);
  assert(row.requires_human_production_approval === productionAdmission.requires_human_production_approval, `${row.candidate_id} human production approval must match production admission.`);
  assert(row.never_production === route.never_production, `${row.candidate_id} never-production must match route summary.`);
  assert(row.never_production === memoryAdmission.never_production, `${row.candidate_id} never-production must match memory admission.`);
  assert(row.never_production === productionAdmission.never_production, `${row.candidate_id} never-production must match production admission.`);
  assert(row.writes_allowed_now.length === 0, `${row.candidate_id} must allow no writes now.`);
  for (const blockedWrite of ["DailyNote_write", "VCP_memory_write", "direct_memory_write", "accepted_samples_write", "production_candidate"]) {
    assert(row.writes_blocked.includes(blockedWrite), `${row.candidate_id} must block ${blockedWrite}.`);
  }
  for (const blockedExecution of ["provider_execution", "plugin_call", "api_call", "image_generation", "deployment_or_release"]) {
    assert(row.execution_blocked.includes(blockedExecution), `${row.candidate_id} must block ${blockedExecution}.`);
  }
}

function main() {
  const missingFiles = requiredFiles.filter((relativePath) => !exists(relativePath));
  assert(missingFiles.length === 0, `Missing admission matrix validation files: ${missingFiles.join(", ")}`);

  const matrix = parseJson(read("tests/schema_examples/review_admission_control_matrix.example.json"), "admission control matrix");
  const memoryAdmission = parseJson(read("tests/schema_examples/review_memory_admission_control.example.json"), "memory admission control");
  const productionAdmission = parseJson(read("tests/schema_examples/review_production_admission_control.example.json"), "production admission control");
  const routeSummary = parseJson(read("tests/schema_examples/review_blocker_arbiter_route_summary.example.json"), "route summary");

  assert(matrix.status === "local_admission_control_matrix", "Admission control matrix must be local_admission_control_matrix.");
  assert(matrix.display_only === true, "Admission control matrix must be display-only.");
  assert(matrix.source_phase === "v14_065_review_production_admission_control_gate", "Admission control matrix source phase must be v14.065.");
  assert(
    matrix.source_memory_admission_ref === "tests/schema_examples/review_memory_admission_control.example.json",
    "Admission control matrix must cite memory admission control."
  );
  assert(
    matrix.source_production_admission_ref === "tests/schema_examples/review_production_admission_control.example.json",
    "Admission control matrix must cite production admission control."
  );
  assert(matrix.candidate_matrix.length === routeSummary.candidate_routes.length, "Matrix candidate count must match route summary.");
  assert(matrix.candidate_matrix.length === memoryAdmission.memory_admissions.length, "Matrix candidate count must match memory admission.");
  assert(matrix.candidate_matrix.length === productionAdmission.production_admissions.length, "Matrix candidate count must match production admission.");

  for (const row of matrix.candidate_matrix) {
    assertMatrixRow(
      row,
      getByCandidate(routeSummary.candidate_routes, row.candidate_id, "route summary"),
      getByCandidate(memoryAdmission.memory_admissions, row.candidate_id, "memory admission control"),
      getByCandidate(productionAdmission.production_admissions, row.candidate_id, "production admission control")
    );
  }

  const passRow = getByCandidate(matrix.candidate_matrix, "candidate_accept_metadata_001", "admission control matrix");
  const rejectRow = getByCandidate(matrix.candidate_matrix, "candidate_reject_metadata_001", "admission control matrix");
  const rejectRoute = getByCandidate(routeSummary.candidate_routes, "candidate_reject_metadata_001", "route summary");

  assert(passRow.matrix_verdict === "pass_candidate_draft_only_no_memory_write_no_production", "Pass row must be draft-only with no memory write or production.");
  assert(passRow.memory_allowed_output_now === "memory_delta_draft_only", "Pass row must allow only memory_delta draft.");
  assert(passRow.production_allowed_output_now === "review_pending_candidate_only", "Pass row must remain review-pending.");
  assert(passRow.never_production === false, "Pass row must not be never-production.");

  assert(rejectRow.matrix_verdict === "reject_candidate_failure_learning_only_never_production", "Reject row must be failure-learning only and never-production.");
  assert(rejectRow.memory_allowed_output_now === "failure_lesson_draft_only", "Reject row must allow only failure lesson draft.");
  assert(rejectRow.production_allowed_output_now === "failure_learning_only", "Reject row production output must be failure-learning only.");
  assert(rejectRow.never_production === true, "Reject row must be never-production.");
  assert(rejectRow.production_exclusion_record_id === rejectRoute.production_exclusion_record_id, "Reject row production exclusion record must match route summary.");
  assertArrayEqual(rejectRow.failure_tags, rejectRoute.failure_tags, "Reject row failure tags must match route summary");
  assert(rejectRow.execution_blocked.includes("production_forever"), "Reject row must block production forever.");

  assert(matrix.matrix_summary.candidate_count === 2, "Matrix summary must count two candidates.");
  assert(matrix.matrix_summary.pass_candidate_count === 1, "Matrix summary must count one pass candidate.");
  assert(matrix.matrix_summary.reject_candidate_count === 1, "Matrix summary must count one reject candidate.");
  assert(matrix.matrix_summary.memory_entry_allowed_now_count === 0, "Matrix summary must allow zero memory entries now.");
  assert(matrix.matrix_summary.production_promotion_allowed_now_count === 0, "Matrix summary must allow zero production promotions now.");
  assert(matrix.matrix_summary.writes_allowed_now_count === 0, "Matrix summary must allow zero writes now.");
  assert(matrix.matrix_summary.never_production_count === routeSummary.route_summary.never_production_count, "Matrix summary never-production count must match route summary.");
  assert(matrix.matrix_summary.human_memory_approval_required_count === memoryAdmission.admission_summary.human_memory_approval_required_count, "Matrix summary human memory approval count must match memory admission.");
  assert(matrix.matrix_summary.human_production_approval_required_count === productionAdmission.admission_summary.human_production_approval_required_count, "Matrix summary human production approval count must match production admission.");
  assert(matrix.matrix_summary.all_memory_writes_blocked === true, "Matrix summary must block all memory writes.");
  assert(matrix.matrix_summary.all_production_writes_blocked === true, "Matrix summary must block all production writes.");
  assert(matrix.matrix_summary.all_provider_execution_blocked === true, "Matrix summary must block all provider execution.");
  assert(matrix.matrix_summary.all_candidates_have_consistent_admission === true, "Matrix summary must mark candidate admissions consistent.");
  assertNoExecutionGuard(matrix.no_execution_guard, "admission matrix no-execution guard");

  const result = {
    passed: true,
    review_admission_control_matrix: {
      admission_matrix_present: true,
      admission_matrix_matches_memory_admission: true,
      admission_matrix_matches_production_admission: true,
      admission_matrix_pass_candidate_draft_only_verified: true,
      admission_matrix_reject_candidate_failure_learning_never_production_verified: true,
      admission_matrix_all_memory_writes_blocked: true,
      admission_matrix_all_production_writes_blocked: true,
      admission_matrix_no_provider_execution_verified: true,
      admission_matrix_no_accepted_samples_write_verified: true,
      admission_matrix_no_production_candidate_verified: true,
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
