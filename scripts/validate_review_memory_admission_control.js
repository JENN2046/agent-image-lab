const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const requiredFiles = [
  "tests/schema_examples/review_memory_admission_control.example.json",
  "tests/schema_examples/review_blocker_arbiter_route_summary.example.json",
  "tests/schema_examples/review_console_blocker_arbiter_draft_output_snapshot.example.json"
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

function assertNoMemoryWrite(admission) {
  assert(admission.memory_entry_allowed_now === false, `${admission.candidate_id} memory entry must be blocked now.`);
  assert(admission.memory_draft_allowed === true, `${admission.candidate_id} memory draft must be allowed.`);
  assert(admission.requires_human_memory_approval === true, `${admission.candidate_id} must require human memory approval.`);
  assert(admission.daily_note_write_allowed === false, `${admission.candidate_id} DailyNote write must not be allowed.`);
  assert(admission.daily_note_write_performed === false, `${admission.candidate_id} DailyNote write must not be performed.`);
  assert(admission.vcp_memory_write_allowed === false, `${admission.candidate_id} VCP memory write must not be allowed.`);
  assert(admission.vcp_memory_write_performed === false, `${admission.candidate_id} VCP memory write must not be performed.`);
  assert(admission.direct_memory_write_performed === false, `${admission.candidate_id} direct memory write must not be performed.`);
  assert(admission.production_candidate_created === false, `${admission.candidate_id} production candidate must not be created.`);
  assert(admission.accepted_samples_write_performed === false, `${admission.candidate_id} accepted_samples write must not be performed.`);
  assert(admission.admission_blockers.includes("human_memory_approval_missing"), `${admission.candidate_id} must block on human memory approval.`);
  assert(admission.admission_blockers.includes("daily_note_direct_write_forbidden"), `${admission.candidate_id} must block direct DailyNote write.`);
  assert(admission.admission_blockers.includes("vcp_memory_write_forbidden"), `${admission.candidate_id} must block VCP memory write.`);
}

function assertAdmission(admission, route) {
  assert(admission.review_outcome === route.review_outcome, `${admission.candidate_id} review outcome must match route summary.`);
  assert(admission.route_summary_final_route === route.final_route, `${admission.candidate_id} final route must match route summary.`);
  assert(admission.memory_route === route.memory_route, `${admission.candidate_id} memory route must match route summary.`);
  assert(admission.memory_decision === route.memory_decision, `${admission.candidate_id} memory decision must match route summary.`);
  assert(admission.memory_destination === route.memory_destination, `${admission.candidate_id} memory destination must match route summary.`);
  assert(admission.memory_entry_allowed_now === route.memory_entry_allowed_now, `${admission.candidate_id} memory entry allowance must match route summary.`);
  assert(admission.memory_draft_allowed === route.memory_draft_allowed, `${admission.candidate_id} memory draft allowance must match route summary.`);
  assert(admission.requires_human_memory_approval === route.requires_human_memory_approval, `${admission.candidate_id} human memory approval must match route summary.`);
  assert(admission.direct_memory_write_performed === route.direct_memory_write_performed, `${admission.candidate_id} direct memory write must match route summary.`);
  assert(admission.production_candidate_created === route.production_candidate_created, `${admission.candidate_id} production candidate state must match route summary.`);
  assert(admission.accepted_samples_write_performed === route.accepted_samples_write_performed, `${admission.candidate_id} accepted_samples state must match route summary.`);
  assert(admission.never_production === route.never_production, `${admission.candidate_id} never-production state must match route summary.`);
  assertNoMemoryWrite(admission);
}

function main() {
  const missingFiles = requiredFiles.filter((relativePath) => !exists(relativePath));
  assert(missingFiles.length === 0, `Missing memory admission validation files: ${missingFiles.join(", ")}`);

  const admission = parseJson(read("tests/schema_examples/review_memory_admission_control.example.json"), "memory admission control");
  const routeSummary = parseJson(read("tests/schema_examples/review_blocker_arbiter_route_summary.example.json"), "route summary");
  const snapshot = parseJson(
    read("tests/schema_examples/review_console_blocker_arbiter_draft_output_snapshot.example.json"),
    "blocker arbiter draft output snapshot"
  );

  assert(admission.status === "local_memory_admission_control", "Memory admission control must be local_memory_admission_control.");
  assert(admission.display_only === true, "Memory admission control must be display-only.");
  assert(admission.source_phase === "v14_063_review_blocker_arbiter_route_summary_gate", "Memory admission control source phase must be v14.063.");
  assert(
    admission.source_route_summary_ref === "tests/schema_examples/review_blocker_arbiter_route_summary.example.json",
    "Memory admission control must cite route summary."
  );
  assert(
    admission.source_snapshot_ref === "tests/schema_examples/review_console_blocker_arbiter_draft_output_snapshot.example.json",
    "Memory admission control must cite blocker arbiter snapshot."
  );
  assert(snapshot.review_blocker_arbiter_static_handoff, "Snapshot must include blocker arbiter static handoff.");
  assert(admission.memory_admissions.length === routeSummary.candidate_routes.length, "Memory admission count must match route summary.");

  for (const memoryAdmission of admission.memory_admissions) {
    assertAdmission(
      memoryAdmission,
      getByCandidate(routeSummary.candidate_routes, memoryAdmission.candidate_id, "route summary")
    );
  }

  const passAdmission = getByCandidate(admission.memory_admissions, "candidate_accept_metadata_001", "memory admission control");
  const rejectAdmission = getByCandidate(admission.memory_admissions, "candidate_reject_metadata_001", "memory admission control");
  const rejectRoute = getByCandidate(routeSummary.candidate_routes, "candidate_reject_metadata_001", "route summary");

  assert(passAdmission.review_outcome === "pass", "Accept metadata admission must be pass.");
  assert(passAdmission.admission_status === "draft_only_pending_human_memory_approval", "Pass admission must remain draft-only pending human memory approval.");
  assert(passAdmission.allowed_output_now === "memory_delta_draft_only", "Pass admission may only create a memory_delta draft.");
  assert(passAdmission.never_production === false, "Pass admission must not mark never-production.");

  assert(rejectAdmission.review_outcome === "reject", "Reject metadata admission must be reject.");
  assert(
    rejectAdmission.admission_status === "failure_learning_draft_only_pending_human_memory_approval",
    "Reject admission must remain failure-learning draft-only pending human memory approval."
  );
  assert(rejectAdmission.allowed_output_now === "failure_lesson_draft_only", "Reject admission may only create a failure lesson draft.");
  assert(rejectAdmission.never_production === true, "Reject admission must preserve never-production.");
  assertArrayEqual(rejectAdmission.failure_tags, rejectRoute.failure_tags, "Reject admission failure tags must match route summary");
  assert(rejectAdmission.admission_blockers.includes("never_production_candidate"), "Reject admission must preserve never-production blocker.");

  assert(admission.admission_summary.candidate_count === 2, "Admission summary must count two candidates.");
  assert(admission.admission_summary.memory_draft_allowed_count === 2, "Admission summary must count two memory drafts.");
  assert(admission.admission_summary.memory_entry_allowed_now_count === 0, "Admission summary must allow zero memory entries now.");
  assert(admission.admission_summary.human_memory_approval_required_count === 2, "Admission summary must require human memory approval twice.");
  assert(admission.admission_summary.daily_note_write_allowed_count === 0, "Admission summary must allow zero DailyNote writes.");
  assert(admission.admission_summary.vcp_memory_write_allowed_count === 0, "Admission summary must allow zero VCP memory writes.");
  assert(admission.admission_summary.never_production_count === routeSummary.route_summary.never_production_count, "Admission summary never-production count must match route summary.");
  assert(admission.admission_summary.direct_memory_write_performed === false, "Admission summary must not write memory directly.");
  assert(admission.admission_summary.production_candidate_created === false, "Admission summary must not create production candidates.");
  assert(admission.admission_summary.accepted_samples_write_performed === false, "Admission summary must not write accepted samples.");
  assert(admission.admission_summary.all_memory_entries_blocked_now === true, "Admission summary must block all memory entries now.");
  assert(admission.admission_summary.all_memory_writes_blocked === true, "Admission summary must block all memory writes.");
  assert(admission.admission_summary.all_production_candidates_blocked === true, "Admission summary must block all production candidates.");
  assertNoExecutionGuard(admission.no_execution_guard, "memory admission no-execution guard");

  const result = {
    passed: true,
    review_memory_admission_control: {
      memory_admission_control_present: true,
      memory_admission_matches_route_summary: true,
      memory_admission_pass_draft_verified: true,
      memory_admission_reject_failure_learning_verified: true,
      memory_admission_human_approval_required: true,
      memory_admission_daily_note_blocked: true,
      memory_admission_vcp_memory_blocked: true,
      memory_admission_no_direct_memory_write_verified: true,
      memory_admission_no_production_candidate_verified: true,
      memory_admission_no_accepted_samples_write_verified: true,
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
