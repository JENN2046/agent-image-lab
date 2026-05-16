const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const requiredFiles = [
  "tests/schema_examples/review_report_production_exclusion_register.example.json",
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

function assertExclusionMatchesAdmission(record, admission, route) {
  assert(record.review_outcome === "reject", `${record.candidate_id} exclusion must only contain rejected candidates.`);
  assert(record.review_outcome === admission.review_outcome, `${record.candidate_id} review outcome must match admission matrix.`);
  assert(record.review_outcome === route.review_outcome, `${record.candidate_id} review outcome must match route summary.`);
  assert(record.route_class === admission.route_class, `${record.candidate_id} route class must match admission matrix.`);
  assert(record.final_route === admission.final_route, `${record.candidate_id} final route must match admission matrix.`);
  assert(record.final_route === route.final_route, `${record.candidate_id} final route must match route summary.`);
  assert(record.production_exclusion_record_id === admission.production_exclusion_record_id, `${record.candidate_id} exclusion id must match admission matrix.`);
  assert(record.production_exclusion_record_id === route.production_exclusion_record_id, `${record.candidate_id} exclusion id must match route summary.`);
  assert(record.memory_forbidden === admission.memory_forbidden, `${record.candidate_id} memory-forbidden state must match admission matrix.`);
  assert(record.memory_admission_state === admission.memory_admission_state, `${record.candidate_id} memory admission state must match admission matrix.`);
  assert(record.production_admission_state === admission.production_admission_state, `${record.candidate_id} production admission state must match admission matrix.`);
  assert(record.matrix_verdict === admission.matrix_verdict, `${record.candidate_id} matrix verdict must match admission matrix.`);
  assertArrayEqual(record.failure_tags, route.failure_tags, `${record.candidate_id} failure tags must match route summary`);
  assertArrayEqual(record.unknown_failure_tags, route.unknown_failure_tags, `${record.candidate_id} unknown failure tags must match route summary`);
}

function assertExclusionSemantics(record) {
  assert(record.status === "never_production", `${record.candidate_id} exclusion status must be never_production.`);
  assert(record.permanent_block === true, `${record.candidate_id} must be permanently blocked.`);
  assert(record.production_admission_state === "forbidden_permanently", `${record.candidate_id} production admission must be forbidden permanently.`);
  assert(record.production_candidate_allowed_now === false, `${record.candidate_id} must not allow production candidates now.`);
  assert(record.production_promotion_allowed_now === false, `${record.candidate_id} must not allow production promotion now.`);
  assert(record.accepted_samples_write_allowed_now === false, `${record.candidate_id} must not allow accepted_samples writes now.`);
  assert(record.production_reconsideration_after_separate_gate === false, `${record.candidate_id} must not allow production reconsideration.`);
  assert(record.exclusion_removal_allowed_by_this_gate === false, `${record.candidate_id} exclusion removal must not be allowed by this gate.`);
  assert(record.direct_memory_write_performed === false, `${record.candidate_id} must not write memory directly.`);
  assert(record.daily_note_write_performed === false, `${record.candidate_id} must not write DailyNote.`);
  assert(record.vcp_memory_write_performed === false, `${record.candidate_id} must not write VCP memory.`);
  assert(record.production_candidate_created === false, `${record.candidate_id} must not create production candidates.`);
  assert(record.accepted_samples_write_performed === false, `${record.candidate_id} must not write accepted_samples.`);
  assert(record.blocked_destinations.includes("production_forever"), `${record.candidate_id} must block production forever.`);
  assert(record.blocked_destinations.includes("accepted_samples_write"), `${record.candidate_id} must block accepted_samples.`);
  assert(record.blocked_destinations.includes("production_candidate"), `${record.candidate_id} must block production candidates.`);
  assert(record.blocked_destinations.includes("provider_execution"), `${record.candidate_id} must block provider execution.`);

  if (record.memory_forbidden) {
    assert(record.memory_admission_state === "forbidden_permanently", `${record.candidate_id} memory-forbidden exclusion must forbid memory permanently.`);
    assert(record.blocked_destinations.includes("memory_forever"), `${record.candidate_id} memory-forbidden exclusion must block memory forever.`);
    assert(record.unknown_failure_tags.includes("unmapped_identity_drift"), `${record.candidate_id} memory-forbidden exclusion must carry unknown failure tag.`);
    assert(record.never_production_codes.includes("unknown_failure_tags_present"), `${record.candidate_id} memory-forbidden exclusion must cite unknown failure.`);
  }
}

function main() {
  const missingFiles = requiredFiles.filter((relativePath) => !exists(relativePath));
  assert(missingFiles.length === 0, `Missing ReviewReport production exclusion register files: ${missingFiles.join(", ")}`);

  const register = parseJson(
    read("tests/schema_examples/review_report_production_exclusion_register.example.json"),
    "ReviewReport production exclusion register"
  );
  const admissionMatrix = parseJson(
    read("tests/schema_examples/review_report_admission_control_matrix.example.json"),
    "ReviewReport admission control matrix"
  );
  const routeSummary = parseJson(read("tests/schema_examples/review_report_route_summary.example.json"), "ReviewReport route summary");

  assert(register.status === "local_review_report_production_exclusion_register", "Register must be local_review_report_production_exclusion_register.");
  assert(register.display_only === true, "Register must be display-only.");
  assert(register.source_phase === "v14_075_review_report_admission_control_matrix_gate", "Register source phase must be v14.075.");
  assert(
    register.source_admission_matrix_ref === "tests/schema_examples/review_report_admission_control_matrix.example.json",
    "Register must cite ReviewReport admission matrix."
  );
  assert(
    register.source_route_summary_ref === "tests/schema_examples/review_report_route_summary.example.json",
    "Register must cite ReviewReport route summary."
  );

  const rejectedAdmissions = admissionMatrix.candidate_admissions.filter((row) => row.review_outcome === "reject");
  const passAdmissions = admissionMatrix.candidate_admissions.filter((row) => row.review_outcome === "pass");
  assert(register.exclusion_records.length === rejectedAdmissions.length, "Every rejected admission row must be registered as an exclusion.");
  assert(register.non_exclusion_records.length === passAdmissions.length, "Every pass admission row must be a non-exclusion record.");

  for (const record of register.exclusion_records) {
    const admission = getByCandidate(admissionMatrix.candidate_admissions, record.candidate_id, "admission matrix");
    const route = getByCandidate(routeSummary.candidate_routes, record.candidate_id, "route summary");
    assertExclusionMatchesAdmission(record, admission, route);
    assertExclusionSemantics(record);
  }

  for (const record of register.non_exclusion_records) {
    const admission = getByCandidate(admissionMatrix.candidate_admissions, record.candidate_id, "admission matrix");
    assert(record.review_outcome === "pass", `${record.candidate_id} non-exclusion must be pass.`);
    assert(admission.never_production === false, `${record.candidate_id} pass admission must not be never-production.`);
    assert(record.production_promotion_allowed_now === false, `${record.candidate_id} pass non-exclusion must still block production now.`);
    assert(record.production_candidate_allowed_now === false, `${record.candidate_id} pass non-exclusion must still block production candidates now.`);
    assert(record.production_reconsideration_after_separate_gate === true, `${record.candidate_id} pass non-exclusion may only be reconsidered after a separate gate.`);
  }

  assert(register.register_summary.candidate_count === admissionMatrix.candidate_admissions.length, "Register candidate count must match admission matrix.");
  assert(register.register_summary.exclusion_count === register.exclusion_records.length, "Register exclusion count must match records.");
  assert(register.register_summary.non_exclusion_count === register.non_exclusion_records.length, "Register non-exclusion count must match records.");
  assert(register.register_summary.reject_exclusion_count === rejectedAdmissions.length, "Reject exclusion count must match rejected admissions.");
  assert(register.register_summary.pass_exclusion_count === 0, "No pass candidate may be in the exclusion register.");
  assert(register.register_summary.memory_forbidden_exclusion_count === countWhere(register.exclusion_records, (record) => record.memory_forbidden), "Memory-forbidden exclusion count must match records.");
  assert(
    register.register_summary.unknown_failure_exclusion_count === countWhere(register.exclusion_records, (record) => record.unknown_failure_tags.length > 0),
    "Unknown failure exclusion count must match records."
  );
  assert(register.register_summary.all_rejects_registered === true, "All rejects must be registered.");
  assert(register.register_summary.no_pass_candidates_registered === true, "No pass candidates may be registered.");
  assert(register.register_summary.all_exclusions_never_production === true, "All exclusions must be never-production.");
  assert(register.register_summary.all_exclusions_have_record_id === true, "All exclusions must have record IDs.");
  assert(register.register_summary.all_exclusions_block_production_forever === true, "All exclusions must block production forever.");
  assert(register.register_summary.all_exclusions_block_accepted_samples === true, "All exclusions must block accepted_samples.");
  assert(register.register_summary.all_exclusions_block_production_candidate === true, "All exclusions must block production candidates.");
  assert(register.register_summary.all_unknown_failures_memory_forbidden === true, "All unknown failures must be memory-forbidden.");
  assert(register.register_summary.exclusion_removal_allowed_by_this_gate === false, "This gate must not allow exclusion removal.");
  assert(register.register_summary.production_candidate_created === false, "Register must not create production candidates.");
  assert(register.register_summary.accepted_samples_write_performed === false, "Register must not write accepted_samples.");
  assert(register.register_summary.direct_memory_write_performed === false, "Register must not write memory directly.");
  assert(register.register_summary.daily_note_write_performed === false, "Register must not write DailyNote.");
  assert(register.register_summary.vcp_memory_write_performed === false, "Register must not write VCP memory.");
  assertNoExecutionGuard(register.no_execution_guard, "ReviewReport production exclusion register no-execution guard");

  const result = {
    passed: true,
    review_report_production_exclusion_register: {
      review_report_production_exclusion_register_present: true,
      review_report_production_exclusion_matches_admission_matrix: true,
      review_report_production_exclusion_matches_route_summary: true,
      review_report_production_exclusion_all_rejects_registered: true,
      review_report_production_exclusion_no_pass_registered: true,
      review_report_production_exclusion_never_production_verified: true,
      review_report_production_exclusion_unknown_memory_forbidden_verified: true,
      review_report_production_exclusion_removal_blocked: true,
      review_report_production_exclusion_no_daily_note_write_verified: true,
      review_report_production_exclusion_no_vcp_memory_write_verified: true,
      review_report_production_exclusion_no_accepted_samples_write_verified: true,
      review_report_production_exclusion_no_production_candidate_verified: true,
      review_report_production_exclusion_no_provider_plugin_api_image_verified: true,
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
