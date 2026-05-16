const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const requiredFiles = [
  "tests/schema_examples/review_report_memory_admission_register.example.json",
  "tests/schema_examples/review_report_admission_control_matrix.example.json",
  "tests/schema_examples/review_report_route_summary.example.json",
  "tests/schema_examples/review_report_production_exclusion_register.example.json"
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

function assertUniqueCandidateIds(items, label) {
  const seen = new Set();
  for (const item of items) {
    assert(item.candidate_id, `${label} entry must include candidate_id.`);
    assert(!seen.has(item.candidate_id), `${label} must not duplicate ${item.candidate_id}.`);
    seen.add(item.candidate_id);
  }
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

function assertRecordMatchesSources(record, admission, route, productionExclusionRegister) {
  assert(record.review_outcome === admission.review_outcome, `${record.candidate_id} review outcome must match admission matrix.`);
  assert(record.review_outcome === route.review_outcome, `${record.candidate_id} review outcome must match route summary.`);
  assert(record.route_class === admission.route_class, `${record.candidate_id} route class must match admission matrix.`);
  assert(record.route_class === route.route_class, `${record.candidate_id} route class must match route summary.`);
  assert(record.final_route === admission.final_route, `${record.candidate_id} final route must match admission matrix.`);
  assert(record.final_route === route.final_route, `${record.candidate_id} final route must match route summary.`);
  assert(record.memory_route === route.memory_route, `${record.candidate_id} memory route must match route summary.`);
  assert(record.memory_admission_state === admission.memory_admission_state, `${record.candidate_id} memory admission state must match admission matrix.`);
  assert(record.memory_allowed_output_now === admission.memory_allowed_output_now, `${record.candidate_id} memory output must match admission matrix.`);
  assert(record.memory_allowed_output_now === route.memory_allowed_output_now, `${record.candidate_id} memory output must match route summary.`);
  assert(record.memory_draft_allowed === admission.memory_draft_allowed, `${record.candidate_id} memory draft state must match admission matrix.`);
  assert(record.memory_draft_allowed === route.memory_draft_allowed, `${record.candidate_id} memory draft state must match route summary.`);
  assert(record.memory_forbidden === admission.memory_forbidden, `${record.candidate_id} memory-forbidden state must match admission matrix.`);
  assert(record.memory_forbidden === route.memory_forbidden, `${record.candidate_id} memory-forbidden state must match route summary.`);
  assert(record.memory_entry_allowed_now === admission.memory_entry_allowed_now, `${record.candidate_id} memory entry state must match admission matrix.`);
  assert(record.memory_entry_allowed_now === route.memory_entry_allowed_now, `${record.candidate_id} memory entry state must match route summary.`);
  assert(record.memory_entry_potential_after_human_approval === admission.memory_entry_potential_after_human_approval, `${record.candidate_id} memory future potential must match admission matrix.`);
  assert(record.requires_human_memory_approval === admission.requires_human_memory_approval, `${record.candidate_id} human memory approval state must match admission matrix.`);
  assert(record.requires_human_memory_approval === route.requires_human_memory_approval, `${record.candidate_id} human memory approval state must match route summary.`);
  assert(record.direct_memory_write_allowed_now === admission.direct_memory_write_allowed_now, `${record.candidate_id} direct memory write allowance must match admission matrix.`);
  assert(record.daily_note_write_allowed_now === admission.daily_note_write_allowed_now, `${record.candidate_id} DailyNote write allowance must match admission matrix.`);
  assert(record.vcp_memory_write_allowed_now === admission.vcp_memory_write_allowed_now, `${record.candidate_id} VCP memory write allowance must match admission matrix.`);
  assert(record.direct_memory_write_performed === route.direct_memory_write_performed, `${record.candidate_id} direct memory write performed flag must match route summary.`);
  assert(record.daily_note_write_performed === route.daily_note_write_performed, `${record.candidate_id} DailyNote performed flag must match route summary.`);
  assert(record.vcp_memory_write_performed === route.vcp_memory_write_performed, `${record.candidate_id} VCP memory performed flag must match route summary.`);
  assert(record.production_exclusion_record_id === admission.production_exclusion_record_id, `${record.candidate_id} production exclusion id must match admission matrix.`);
  assert(record.production_exclusion_record_id === route.production_exclusion_record_id, `${record.candidate_id} production exclusion id must match route summary.`);
  assert(record.production_admission_state === admission.production_admission_state, `${record.candidate_id} production admission state must match admission matrix.`);
  assert(record.accepted_samples_write_allowed_now === admission.accepted_samples_write_allowed_now, `${record.candidate_id} accepted_samples write allowance must match admission matrix.`);
  assert(record.production_candidate_allowed_now === admission.production_candidate_allowed_now, `${record.candidate_id} production candidate allowance must match admission matrix.`);
  assert(record.matrix_verdict === admission.matrix_verdict, `${record.candidate_id} matrix verdict must match admission matrix.`);
  assertArrayEqual(record.failure_tags, route.failure_tags, `${record.candidate_id} failure tags must match route summary`);
  assertArrayEqual(record.unknown_failure_tags, route.unknown_failure_tags, `${record.candidate_id} unknown failure tags must match route summary`);
  assertArrayEqual(record.writes_allowed_now, admission.writes_allowed_now, `${record.candidate_id} writes_allowed_now must match admission matrix`);

  const exclusion = productionExclusionRegister.exclusion_records.find((item) => item.candidate_id === record.candidate_id);
  const nonExclusion = productionExclusionRegister.non_exclusion_records.find((item) => item.candidate_id === record.candidate_id);
  if (record.review_outcome === "reject") {
    assert(exclusion, `${record.candidate_id} rejected memory record must have production exclusion source.`);
    assert(record.production_exclusion_record_id === exclusion.production_exclusion_record_id, `${record.candidate_id} production exclusion id must match exclusion register.`);
  } else {
    assert(nonExclusion, `${record.candidate_id} pass memory record must have non-exclusion source.`);
    assert(record.production_exclusion_record_id === null, `${record.candidate_id} pass memory record must not have production exclusion id.`);
  }
}

function assertMemorySemantics(record) {
  assert(record.memory_entry_allowed_now === false, `${record.candidate_id} must not allow memory entry now.`);
  assert(record.memory_write_allowed_now === false, `${record.candidate_id} must not allow memory write now.`);
  assert(record.direct_memory_write_allowed_now === false, `${record.candidate_id} must not allow direct memory write now.`);
  assert(record.daily_note_write_allowed_now === false, `${record.candidate_id} must not allow DailyNote write now.`);
  assert(record.vcp_memory_write_allowed_now === false, `${record.candidate_id} must not allow VCP memory write now.`);
  assert(record.direct_memory_write_performed === false, `${record.candidate_id} must not write memory directly.`);
  assert(record.daily_note_write_performed === false, `${record.candidate_id} must not write DailyNote.`);
  assert(record.vcp_memory_write_performed === false, `${record.candidate_id} must not write VCP memory.`);
  assert(record.accepted_samples_write_allowed_now === false, `${record.candidate_id} must not allow accepted_samples writes.`);
  assert(record.production_candidate_allowed_now === false, `${record.candidate_id} must not allow production candidates.`);
  assert(Array.isArray(record.writes_allowed_now) && record.writes_allowed_now.length === 0, `${record.candidate_id} must allow no writes now.`);
  for (const destination of ["DailyNote_write", "VCP_memory_write", "direct_memory_write", "accepted_samples_write", "production_candidate", "provider_execution"]) {
    assert(record.blocked_destinations.includes(destination), `${record.candidate_id} must block ${destination}.`);
  }

  if (record.memory_forbidden) {
    assert(record.memory_admission_state === "forbidden_permanently", `${record.candidate_id} memory-forbidden record must be forbidden permanently.`);
    assert(record.memory_allowed_output_now === "none", `${record.candidate_id} memory-forbidden record must allow no memory output.`);
    assert(record.memory_draft_allowed === false, `${record.candidate_id} memory-forbidden record must not allow drafts.`);
    assert(record.memory_entry_potential_after_human_approval === false, `${record.candidate_id} memory-forbidden record must not become memory after human approval.`);
    assert(record.memory_forever_blocked === true, `${record.candidate_id} memory-forbidden record must block memory forever.`);
    assert(record.blocked_destinations.includes("memory_forever"), `${record.candidate_id} must block memory forever.`);
    assert(record.unknown_failure_tags.length > 0, `${record.candidate_id} memory-forbidden record must carry unknown failure tags.`);
  } else {
    assert(record.memory_admission_state === "blocked_pending_human_memory_approval", `${record.candidate_id} memory draft record must remain pending human approval.`);
    assert(record.memory_allowed_output_now !== "none", `${record.candidate_id} memory draft record must name an allowed draft output.`);
    assert(record.memory_draft_allowed === true, `${record.candidate_id} memory draft record must allow draft output.`);
    assert(record.memory_entry_potential_after_human_approval === true, `${record.candidate_id} memory draft record must remain human-approval gated.`);
    assert(record.requires_human_memory_approval === true, `${record.candidate_id} memory draft record must require human approval.`);
    assert(record.memory_approval_record_required === true, `${record.candidate_id} memory draft record must require approval record.`);
    assert(record.memory_forever_blocked === false, `${record.candidate_id} memory draft record must not block memory forever.`);
  }

  if (record.review_outcome === "pass") {
    assert(record.memory_draft_type === "accepted_candidate_memory_delta_draft", `${record.candidate_id} pass record must be accepted candidate memory delta draft.`);
    assert(record.memory_allowed_output_now === "memory_delta_draft_only", `${record.candidate_id} pass record must only allow memory_delta draft.`);
  }

  if (record.review_outcome === "reject" && !record.memory_forbidden) {
    assert(record.memory_draft_type === "rejected_candidate_failure_lesson_draft", `${record.candidate_id} mapped reject must be failure lesson draft.`);
    assert(record.memory_allowed_output_now === "failure_lesson_draft_only", `${record.candidate_id} mapped reject must only allow failure lesson draft.`);
  }
}

function main() {
  const missingFiles = requiredFiles.filter((relativePath) => !exists(relativePath));
  assert(missingFiles.length === 0, `Missing ReviewReport memory admission register files: ${missingFiles.join(", ")}`);

  const register = parseJson(
    read("tests/schema_examples/review_report_memory_admission_register.example.json"),
    "ReviewReport memory admission register"
  );
  const admissionMatrix = parseJson(
    read("tests/schema_examples/review_report_admission_control_matrix.example.json"),
    "ReviewReport admission control matrix"
  );
  const routeSummary = parseJson(read("tests/schema_examples/review_report_route_summary.example.json"), "ReviewReport route summary");
  const productionExclusionRegister = parseJson(
    read("tests/schema_examples/review_report_production_exclusion_register.example.json"),
    "ReviewReport production exclusion register"
  );

  assert(register.status === "local_review_report_memory_admission_register", "Register must be local_review_report_memory_admission_register.");
  assert(register.display_only === true, "Register must be display-only.");
  assert(register.source_phase === "v14_076_review_report_production_exclusion_register_gate", "Register source phase must be v14.076.");
  assert(
    register.source_admission_matrix_ref === "tests/schema_examples/review_report_admission_control_matrix.example.json",
    "Register must cite ReviewReport admission matrix."
  );
  assert(
    register.source_route_summary_ref === "tests/schema_examples/review_report_route_summary.example.json",
    "Register must cite ReviewReport route summary."
  );
  assert(
    register.source_production_exclusion_register_ref === "tests/schema_examples/review_report_production_exclusion_register.example.json",
    "Register must cite ReviewReport production exclusion register."
  );
  assert(register.memory_admission_records.length === admissionMatrix.candidate_admissions.length, "Every admission matrix candidate must have a memory admission record.");
  assertUniqueCandidateIds(admissionMatrix.candidate_admissions, "admission matrix");
  assertUniqueCandidateIds(routeSummary.candidate_routes, "route summary");
  assertUniqueCandidateIds(register.memory_admission_records, "memory admission register");
  assertArrayEqual(
    register.memory_admission_records.map((record) => record.candidate_id),
    admissionMatrix.candidate_admissions.map((admission) => admission.candidate_id),
    "Memory admission register candidate set must exactly match admission matrix"
  );
  assertArrayEqual(
    register.memory_admission_records.map((record) => record.candidate_id),
    routeSummary.candidate_routes.map((route) => route.candidate_id),
    "Memory admission register candidate set must exactly match route summary"
  );

  for (const record of register.memory_admission_records) {
    const admission = getByCandidate(admissionMatrix.candidate_admissions, record.candidate_id, "admission matrix");
    const route = getByCandidate(routeSummary.candidate_routes, record.candidate_id, "route summary");
    assertRecordMatchesSources(record, admission, route, productionExclusionRegister);
    assertMemorySemantics(record);
  }

  const summary = register.register_summary;
  assert(summary.candidate_count === register.memory_admission_records.length, "Summary candidate count must match records.");
  assert(summary.memory_draft_allowed_count === countWhere(register.memory_admission_records, (record) => record.memory_draft_allowed), "Memory draft count must match records.");
  assert(summary.memory_forbidden_count === countWhere(register.memory_admission_records, (record) => record.memory_forbidden), "Memory forbidden count must match records.");
  assert(summary.memory_entry_allowed_now_count === 0, "No memory entries may be allowed now.");
  assert(summary.memory_entry_potential_after_human_approval_count === countWhere(register.memory_admission_records, (record) => record.memory_entry_potential_after_human_approval), "Future human approval count must match records.");
  assert(summary.accepted_candidate_memory_delta_draft_count === countWhere(register.memory_admission_records, (record) => record.memory_draft_type === "accepted_candidate_memory_delta_draft"), "Accepted memory draft count must match records.");
  assert(summary.failure_lesson_draft_count === countWhere(register.memory_admission_records, (record) => record.memory_draft_type === "rejected_candidate_failure_lesson_draft"), "Failure lesson draft count must match records.");
  assert(summary.unknown_failure_memory_forbidden_count === countWhere(register.memory_admission_records, (record) => record.memory_forbidden && record.unknown_failure_tags.length > 0), "Unknown failure memory-forbidden count must match records.");
  assert(summary.all_records_match_admission_matrix === true, "All records must match admission matrix.");
  assert(summary.all_records_match_route_summary === true, "All records must match route summary.");
  assert(summary.all_records_match_production_exclusion_register === true, "All records must match production exclusion register.");
  assert(summary.all_memory_writes_blocked_now === true, "All memory writes must be blocked now.");
  assert(summary.all_memory_drafts_require_human_approval === true, "All draftable memory records must require human approval.");
  assert(summary.all_unknown_failures_memory_forbidden === true, "All unknown failures must be memory-forbidden.");
  assert(summary.no_memory_entry_allowed_now === true, "No memory entry may be allowed now.");
  assert(summary.no_direct_memory_write_performed === true, "Direct memory writes must not be performed.");
  assert(summary.daily_note_write_performed === false, "DailyNote writes must not be performed.");
  assert(summary.vcp_memory_write_performed === false, "VCP memory writes must not be performed.");
  assert(summary.accepted_samples_write_performed === false, "accepted_samples writes must not be performed.");
  assert(summary.production_candidate_created === false, "Production candidates must not be created.");
  assert(summary.provider_plugin_api_image_performed === false, "Provider/plugin/API/image effects must not be performed.");
  assertNoExecutionGuard(register.no_execution_guard, "ReviewReport memory admission register no-execution guard");

  const result = {
    passed: true,
    review_report_memory_admission_register: {
      review_report_memory_admission_register_present: true,
      review_report_memory_admission_candidate_ids_unique: true,
      review_report_memory_admission_exact_candidate_set_verified: true,
      review_report_memory_admission_matches_admission_matrix: true,
      review_report_memory_admission_matches_route_summary: true,
      review_report_memory_admission_matches_production_exclusion_register: true,
      review_report_memory_admission_memory_delta_draft_only_verified: true,
      review_report_memory_admission_failure_lesson_draft_only_verified: true,
      review_report_memory_admission_unknown_failure_memory_forbidden_verified: true,
      review_report_memory_admission_memory_entry_blocked_now: true,
      review_report_memory_admission_all_drafts_require_human_approval: true,
      review_report_memory_admission_no_direct_memory_write_verified: true,
      review_report_memory_admission_no_daily_note_write_verified: true,
      review_report_memory_admission_no_vcp_memory_write_verified: true,
      review_report_memory_admission_no_accepted_samples_write_verified: true,
      review_report_memory_admission_no_production_candidate_verified: true,
      review_report_memory_admission_no_provider_plugin_api_image_verified: true,
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
