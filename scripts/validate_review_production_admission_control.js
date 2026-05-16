const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const requiredFiles = [
  "tests/schema_examples/review_production_admission_control.example.json",
  "tests/schema_examples/review_memory_admission_control.example.json",
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

function assertProductionBlocked(admission) {
  assert(admission.production_promotion_allowed_now === false, `${admission.candidate_id} production promotion must be blocked now.`);
  assert(admission.production_candidate_allowed_now === false, `${admission.candidate_id} production candidate must not be allowed now.`);
  assert(admission.production_candidate_created === false, `${admission.candidate_id} production candidate must not be created.`);
  assert(admission.accepted_samples_write_allowed === false, `${admission.candidate_id} accepted_samples write must not be allowed.`);
  assert(admission.accepted_samples_write_performed === false, `${admission.candidate_id} accepted_samples write must not be performed.`);
  assert(admission.admission_blockers.includes("accepted_samples_write_forbidden"), `${admission.candidate_id} must block accepted_samples writes.`);
  assert(admission.admission_blockers.includes("production_candidate_creation_forbidden"), `${admission.candidate_id} must block production candidate creation.`);
}

function assertAdmission(admission, route, memoryAdmission) {
  assert(admission.review_outcome === route.review_outcome, `${admission.candidate_id} review outcome must match route summary.`);
  assert(admission.review_outcome === memoryAdmission.review_outcome, `${admission.candidate_id} review outcome must match memory admission.`);
  assert(admission.route_summary_final_route === route.final_route, `${admission.candidate_id} final route must match route summary.`);
  assert(admission.production_decision === route.production_decision, `${admission.candidate_id} production decision must match route summary.`);
  assert(admission.production_destination === route.production_destination, `${admission.candidate_id} production destination must match route summary.`);
  assert(admission.production_promotion_allowed_now === route.production_promotion_allowed_now, `${admission.candidate_id} production promotion allowance must match route summary.`);
  assert(admission.requires_human_review === route.requires_human_review, `${admission.candidate_id} human review requirement must match route summary.`);
  assert(admission.production_candidate_created === route.production_candidate_created, `${admission.candidate_id} production candidate state must match route summary.`);
  assert(admission.accepted_samples_write_performed === route.accepted_samples_write_performed, `${admission.candidate_id} accepted_samples state must match route summary.`);
  assert(admission.never_production === route.never_production, `${admission.candidate_id} never-production state must match route summary.`);
  assert(admission.production_candidate_created === memoryAdmission.production_candidate_created, `${admission.candidate_id} production candidate state must match memory admission.`);
  assert(admission.accepted_samples_write_performed === memoryAdmission.accepted_samples_write_performed, `${admission.candidate_id} accepted_samples state must match memory admission.`);
  assertProductionBlocked(admission);
}

function main() {
  const missingFiles = requiredFiles.filter((relativePath) => !exists(relativePath));
  assert(missingFiles.length === 0, `Missing production admission validation files: ${missingFiles.join(", ")}`);

  const admission = parseJson(read("tests/schema_examples/review_production_admission_control.example.json"), "production admission control");
  const memoryAdmission = parseJson(read("tests/schema_examples/review_memory_admission_control.example.json"), "memory admission control");
  const routeSummary = parseJson(read("tests/schema_examples/review_blocker_arbiter_route_summary.example.json"), "route summary");

  assert(admission.status === "local_production_admission_control", "Production admission control must be local_production_admission_control.");
  assert(admission.display_only === true, "Production admission control must be display-only.");
  assert(admission.source_phase === "v14_064_review_memory_admission_control_gate", "Production admission control source phase must be v14.064.");
  assert(
    admission.source_route_summary_ref === "tests/schema_examples/review_blocker_arbiter_route_summary.example.json",
    "Production admission control must cite route summary."
  );
  assert(
    admission.source_memory_admission_ref === "tests/schema_examples/review_memory_admission_control.example.json",
    "Production admission control must cite memory admission control."
  );
  assert(admission.production_admissions.length === routeSummary.candidate_routes.length, "Production admission count must match route summary.");
  assert(admission.production_admissions.length === memoryAdmission.memory_admissions.length, "Production admission count must match memory admission.");

  for (const productionAdmission of admission.production_admissions) {
    assertAdmission(
      productionAdmission,
      getByCandidate(routeSummary.candidate_routes, productionAdmission.candidate_id, "route summary"),
      getByCandidate(memoryAdmission.memory_admissions, productionAdmission.candidate_id, "memory admission control")
    );
  }

  const passAdmission = getByCandidate(admission.production_admissions, "candidate_accept_metadata_001", "production admission control");
  const rejectAdmission = getByCandidate(admission.production_admissions, "candidate_reject_metadata_001", "production admission control");
  const rejectRoute = getByCandidate(routeSummary.candidate_routes, "candidate_reject_metadata_001", "route summary");

  assert(passAdmission.review_outcome === "pass", "Accept metadata production admission must be pass.");
  assert(passAdmission.admission_status === "blocked_until_human_review", "Pass production admission must be blocked until human review.");
  assert(passAdmission.requires_human_production_approval === true, "Pass production admission must require human production approval.");
  assert(passAdmission.production_exclusion_record_required === false, "Pass production admission must not require exclusion record.");
  assert(passAdmission.production_exclusion_record_id === null, "Pass production admission must not create exclusion record.");
  assert(passAdmission.allowed_output_now === "review_pending_candidate_only", "Pass production admission may only remain review-pending.");
  assert(passAdmission.admission_blockers.includes("human_review_missing"), "Pass production admission must block on human review.");
  assert(passAdmission.admission_blockers.includes("human_production_approval_missing"), "Pass production admission must block on production approval.");
  assert(passAdmission.never_production === false, "Pass production admission must not be permanently never-production.");

  assert(rejectAdmission.review_outcome === "reject", "Reject metadata production admission must be reject.");
  assert(rejectAdmission.admission_status === "permanently_blocked_never_production", "Reject production admission must be permanently blocked.");
  assert(rejectAdmission.requires_human_production_approval === false, "Reject production admission must not be promotable by production approval.");
  assert(rejectAdmission.production_exclusion_record_required === true, "Reject production admission must require an exclusion record.");
  assert(rejectAdmission.production_exclusion_record_id === rejectRoute.production_exclusion_record_id, "Reject production exclusion record must match route summary.");
  assert(rejectAdmission.allowed_output_now === "failure_learning_only", "Reject production admission may only route to failure learning.");
  assert(rejectAdmission.never_production === true, "Reject production admission must be never-production.");
  assertArrayEqual(rejectAdmission.failure_tags, rejectRoute.failure_tags, "Reject production admission failure tags must match route summary");
  assert(rejectAdmission.admission_blockers.includes("review_rejected"), "Reject production admission must block rejected review.");
  assert(rejectAdmission.admission_blockers.includes("mapped_failure_tags_present"), "Reject production admission must block mapped failure tags.");
  assert(rejectAdmission.admission_blockers.includes("never_production_candidate"), "Reject production admission must block never-production candidate.");

  assert(admission.admission_summary.candidate_count === 2, "Admission summary must count two candidates.");
  assert(admission.admission_summary.production_promotion_allowed_now_count === 0, "Admission summary must allow zero promotions now.");
  assert(admission.admission_summary.production_candidate_allowed_now_count === 0, "Admission summary must allow zero production candidates now.");
  assert(admission.admission_summary.production_candidate_created_count === 0, "Admission summary must create zero production candidates.");
  assert(admission.admission_summary.accepted_samples_write_allowed_count === 0, "Admission summary must allow zero accepted_samples writes.");
  assert(admission.admission_summary.accepted_samples_write_performed_count === 0, "Admission summary must perform zero accepted_samples writes.");
  assert(admission.admission_summary.blocked_until_human_review_count === 1, "Admission summary must count one human-review block.");
  assert(admission.admission_summary.permanently_blocked_count === 1, "Admission summary must count one permanent block.");
  assert(admission.admission_summary.never_production_count === routeSummary.route_summary.never_production_count, "Admission summary never-production count must match route summary.");
  assert(admission.admission_summary.human_review_required_count === routeSummary.route_summary.human_review_required_count, "Admission summary human review count must match route summary.");
  assert(admission.admission_summary.human_production_approval_required_count === 1, "Admission summary must require one human production approval.");
  assert(admission.admission_summary.all_production_blocked === true, "Admission summary must block all production.");
  assert(admission.admission_summary.all_accepted_samples_writes_blocked === true, "Admission summary must block all accepted_samples writes.");
  assert(admission.admission_summary.all_provider_execution_blocked === true, "Admission summary must block all provider execution.");
  assertNoExecutionGuard(admission.no_execution_guard, "production admission no-execution guard");

  const result = {
    passed: true,
    review_production_admission_control: {
      production_admission_control_present: true,
      production_admission_matches_route_summary: true,
      production_admission_matches_memory_admission: true,
      production_admission_pass_blocked_until_human_review_verified: true,
      production_admission_reject_never_production_verified: true,
      production_admission_no_production_candidate_verified: true,
      production_admission_no_accepted_samples_write_verified: true,
      production_admission_provider_execution_blocked: true,
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
