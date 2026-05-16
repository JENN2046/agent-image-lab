const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const requiredFiles = [
  "tests/schema_examples/review_report_protocol_final_closeout.example.json",
  "tests/schema_examples/review_report_route_summary.example.json",
  "tests/schema_examples/review_report_admission_control_matrix.example.json",
  "tests/schema_examples/review_report_production_exclusion_register.example.json",
  "tests/schema_examples/review_report_memory_admission_register.example.json",
  "tests/schema_examples/review_report_memory_delta_draft_register.example.json"
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

function parseJson(text, label) {
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(`${label} must be valid JSON: ${error.message}`);
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

function assertUniqueCandidateIds(items, label) {
  const seen = new Set();
  for (const item of items) {
    assert(item.candidate_id, `${label} entry must include candidate_id.`);
    assert(!seen.has(item.candidate_id), `${label} must not duplicate ${item.candidate_id}.`);
    seen.add(item.candidate_id);
  }
}

function getByCandidate(items, candidateId, label) {
  const item = items.find((entry) => entry.candidate_id === candidateId);
  assert(item, `${label} must include ${candidateId}.`);
  return item;
}

function candidateIds(items) {
  return items.map((item) => item.candidate_id);
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

function assertRecordBindings(record, sources) {
  const route = getByCandidate(sources.routeSummary.candidate_routes, record.candidate_id, "route summary");
  const admission = getByCandidate(sources.admissionMatrix.candidate_admissions, record.candidate_id, "admission matrix");
  const memoryAdmission = getByCandidate(sources.memoryAdmission.memory_admission_records, record.candidate_id, "memory admission register");
  const productionExclusion = sources.productionExclusion.exclusion_records.find((item) => item.candidate_id === record.candidate_id);
  const productionNonExclusion = sources.productionExclusion.non_exclusion_records.find((item) => item.candidate_id === record.candidate_id);
  const memoryDraft = sources.memoryDeltaDraft.memory_delta_draft_records.find((item) => item.candidate_id === record.candidate_id);
  const memoryForbidden = sources.memoryDeltaDraft.memory_forbidden_records.find((item) => item.candidate_id === record.candidate_id);

  assert(record.review_outcome === route.review_outcome, `${record.candidate_id} review outcome must match route summary.`);
  assert(record.review_outcome === admission.review_outcome, `${record.candidate_id} review outcome must match admission matrix.`);
  assert(record.route_class === route.route_class, `${record.candidate_id} route class must match route summary.`);
  assert(record.route_class === admission.route_class, `${record.candidate_id} route class must match admission matrix.`);
  assert(record.final_route === route.final_route, `${record.candidate_id} final route must match route summary.`);
  assert(record.final_route === admission.final_route, `${record.candidate_id} final route must match admission matrix.`);
  assert(record.evidence_record_id === route.evidence_record_id, `${record.candidate_id} evidence record id must match route summary.`);
  assert(record.production_blocker_decision_id === route.production_blocker_decision_id, `${record.candidate_id} production blocker id must match route summary.`);
  assert(record.production_exclusion_record_id === route.production_exclusion_record_id, `${record.candidate_id} production exclusion id must match route summary.`);
  assert(record.production_exclusion_record_id === admission.production_exclusion_record_id, `${record.candidate_id} production exclusion id must match admission matrix.`);
  assert(record.memory_admission_record_id === memoryAdmission.memory_admission_record_id, `${record.candidate_id} memory admission id must match memory admission register.`);
  assert(record.never_production === admission.never_production, `${record.candidate_id} never-production flag must match admission matrix.`);
  assert(record.may_enter_memory_now === false, `${record.candidate_id} must not enter memory now.`);
  assert(record.may_enter_production_now === false, `${record.candidate_id} must not enter production now.`);
  assert(record.accepted_samples_write_performed === false, `${record.candidate_id} must not write accepted_samples.`);
  assert(record.production_candidate_created === false, `${record.candidate_id} must not create production candidate.`);
  assert(record.direct_memory_write_performed === false, `${record.candidate_id} must not write memory directly.`);
  assert(record.daily_note_write_performed === false, `${record.candidate_id} must not write DailyNote.`);
  assert(record.vcp_memory_write_performed === false, `${record.candidate_id} must not write VCP memory.`);
  assert(record.provider_contact_performed === false, `${record.candidate_id} must not contact provider.`);
  assert(record.plugin_call_performed === false, `${record.candidate_id} must not call plugin.`);
  assert(record.api_call_performed === false, `${record.candidate_id} must not call API.`);
  assert(record.image_generation_performed === false, `${record.candidate_id} must not generate images.`);

  if (record.review_outcome === "pass") {
    assert(productionNonExclusion, `${record.candidate_id} pass closeout must match non-exclusion record.`);
    assert(!productionExclusion, `${record.candidate_id} pass closeout must not have production exclusion.`);
    assert(memoryDraft, `${record.candidate_id} pass closeout must have memory draft.`);
    assert(record.memory_delta_draft_id === memoryDraft.memory_delta_draft_id, `${record.candidate_id} memory draft id must match draft register.`);
    assert(record.memory_forbidden_record_id === null, `${record.candidate_id} pass closeout must not have memory-forbidden record.`);
    assert(record.memory_output_final === "accepted_candidate_memory_delta_draft_pending_human_approval", `${record.candidate_id} pass memory output must be accepted draft.`);
    assert(record.final_production_state === "blocked_pending_human_review_and_separate_promotion_gate", `${record.candidate_id} pass production must remain gated.`);
  }

  if (record.review_outcome === "reject" && record.route_class === "reject_failure_learning") {
    assert(productionExclusion, `${record.candidate_id} mapped reject must have production exclusion.`);
    assert(memoryDraft, `${record.candidate_id} mapped reject must have failure lesson draft.`);
    assert(record.production_exclusion_record_id === productionExclusion.production_exclusion_record_id, `${record.candidate_id} production exclusion id must match register.`);
    assert(record.memory_delta_draft_id === memoryDraft.memory_delta_draft_id, `${record.candidate_id} memory draft id must match draft register.`);
    assert(record.memory_forbidden_record_id === null, `${record.candidate_id} mapped reject must not have memory-forbidden record.`);
    assert(record.memory_output_final === "failure_lesson_memory_delta_draft_pending_human_approval", `${record.candidate_id} mapped reject memory output must be failure lesson draft.`);
    assert(record.final_production_state === "forbidden_permanently", `${record.candidate_id} mapped reject production must be forbidden permanently.`);
  }

  if (record.route_class === "reject_memory_forbidden") {
    assert(productionExclusion, `${record.candidate_id} unknown reject must have production exclusion.`);
    assert(!memoryDraft, `${record.candidate_id} unknown reject must not have memory draft.`);
    assert(memoryForbidden, `${record.candidate_id} unknown reject must have memory-forbidden record.`);
    assert(record.memory_delta_draft_id === null, `${record.candidate_id} unknown reject memory draft id must be null.`);
    assert(record.memory_forbidden_record_id === memoryForbidden.memory_forbidden_record_id, `${record.candidate_id} memory forbidden id must match draft register.`);
    assert(record.memory_output_final === "memory_forbidden_no_draft", `${record.candidate_id} unknown reject memory output must be forbidden.`);
    assert(record.final_memory_state === "forbidden_permanently", `${record.candidate_id} unknown reject memory must be forbidden permanently.`);
    assert(record.memory_forever_blocked === true, `${record.candidate_id} unknown reject must block memory forever.`);
  }
}

function main() {
  const missingFiles = requiredFiles.filter((relativePath) => !exists(relativePath));
  assert(missingFiles.length === 0, `Missing ReviewReport final closeout files: ${missingFiles.join(", ")}`);

  const closeout = parseJson(
    read("tests/schema_examples/review_report_protocol_final_closeout.example.json"),
    "ReviewReport protocol final closeout"
  );
  const sources = {
    routeSummary: parseJson(read("tests/schema_examples/review_report_route_summary.example.json"), "ReviewReport route summary"),
    admissionMatrix: parseJson(read("tests/schema_examples/review_report_admission_control_matrix.example.json"), "ReviewReport admission matrix"),
    productionExclusion: parseJson(read("tests/schema_examples/review_report_production_exclusion_register.example.json"), "ReviewReport production exclusion register"),
    memoryAdmission: parseJson(read("tests/schema_examples/review_report_memory_admission_register.example.json"), "ReviewReport memory admission register"),
    memoryDeltaDraft: parseJson(read("tests/schema_examples/review_report_memory_delta_draft_register.example.json"), "ReviewReport memory delta draft register")
  };

  assert(closeout.status === "local_review_report_protocol_final_closeout", "Closeout status must be local_review_report_protocol_final_closeout.");
  assert(closeout.display_only === true, "Closeout must be display-only.");
  assert(closeout.source_phase === "v14_078_review_report_memory_delta_draft_register_gate", "Closeout source phase must be v14.078.");
  for (const [key, relativePath] of Object.entries(closeout.source_refs)) {
    assert(requiredFiles.includes(relativePath), `Closeout source ref ${key} must point to a required local file.`);
  }
  assert(closeout.protocol_chain.length === 5, "Closeout protocol chain must include five ReviewReport gates.");
  closeout.protocol_chain.forEach((item) => {
    assert(item.verified === true, `${item.phase} must be verified.`);
  });

  assertUniqueCandidateIds(closeout.candidate_closeout_records, "final closeout");
  assertUniqueCandidateIds(sources.routeSummary.candidate_routes, "route summary");
  assertUniqueCandidateIds(sources.admissionMatrix.candidate_admissions, "admission matrix");
  assertUniqueCandidateIds(sources.productionExclusion.exclusion_records, "production exclusion records");
  assertUniqueCandidateIds(sources.productionExclusion.non_exclusion_records, "production non-exclusion records");
  assertUniqueCandidateIds(sources.memoryAdmission.memory_admission_records, "memory admission register");
  assertUniqueCandidateIds(sources.memoryDeltaDraft.memory_delta_draft_records, "memory delta draft register");
  assertUniqueCandidateIds(sources.memoryDeltaDraft.memory_forbidden_records, "memory forbidden register");
  assertArrayEqual(
    candidateIds(closeout.candidate_closeout_records),
    candidateIds(sources.routeSummary.candidate_routes),
    "Final closeout candidate set must match route summary"
  );
  assertArrayEqual(
    candidateIds(closeout.candidate_closeout_records),
    candidateIds(sources.admissionMatrix.candidate_admissions),
    "Final closeout candidate set must match admission matrix"
  );
  assertArrayEqual(
    candidateIds(closeout.candidate_closeout_records),
    candidateIds(sources.productionExclusion.exclusion_records).concat(candidateIds(sources.productionExclusion.non_exclusion_records)),
    "Final closeout candidate set must match production exclusion plus non-exclusion records"
  );
  assertArrayEqual(
    candidateIds(closeout.candidate_closeout_records),
    candidateIds(sources.memoryAdmission.memory_admission_records),
    "Final closeout candidate set must match memory admission register"
  );
  assertArrayEqual(
    candidateIds(closeout.candidate_closeout_records),
    candidateIds(sources.memoryDeltaDraft.memory_delta_draft_records).concat(candidateIds(sources.memoryDeltaDraft.memory_forbidden_records)),
    "Final closeout candidate set must match memory draft plus forbidden records"
  );

  closeout.candidate_closeout_records.forEach((record) => {
    assertRecordBindings(record, sources);
  });

  const summary = closeout.closeout_summary;
  assert(summary.candidate_count === closeout.candidate_closeout_records.length, "Summary candidate count must match records.");
  assert(summary.pass_count === countWhere(closeout.candidate_closeout_records, (record) => record.review_outcome === "pass"), "Summary pass count must match records.");
  assert(summary.reject_count === countWhere(closeout.candidate_closeout_records, (record) => record.review_outcome === "reject"), "Summary reject count must match records.");
  assert(summary.never_production_count === countWhere(closeout.candidate_closeout_records, (record) => record.never_production), "Summary never-production count must match records.");
  assert(summary.production_exclusion_count === sources.productionExclusion.exclusion_records.length, "Summary production exclusion count must match register.");
  assert(summary.memory_delta_draft_count === sources.memoryDeltaDraft.memory_delta_draft_records.length, "Summary memory draft count must match register.");
  assert(summary.memory_forbidden_count === sources.memoryDeltaDraft.memory_forbidden_records.length, "Summary memory forbidden count must match register.");
  assert(summary.unknown_failure_count === countWhere(closeout.candidate_closeout_records, (record) => record.route_class === "reject_memory_forbidden"), "Summary unknown failure count must match records.");
  for (const key of [
    "all_candidates_explained",
    "all_review_routes_closed",
    "evidence_record_binding_verified",
    "blocker_decision_binding_verified",
    "production_exclusion_binding_verified",
    "memory_admission_binding_verified",
    "memory_delta_draft_binding_verified",
    "all_current_memory_writes_blocked",
    "all_current_production_writes_blocked",
    "all_current_provider_plugin_api_image_blocked",
    "all_unknown_failures_memory_forbidden",
    "all_rejects_never_production",
    "pass_candidate_requires_separate_human_promotion_gate",
    "closeout_is_local_only"
  ]) {
    assert(summary[key] === true, `Closeout summary ${key} must be true.`);
  }
  assert(summary.push_performed === false, "Closeout must not push.");
  assert(summary.tag_created === false, "Closeout must not create tag.");
  assert(summary.release_created === false, "Closeout must not create release.");
  assertNoExecutionGuard(closeout.no_execution_guard, "ReviewReport final closeout no-execution guard");

  const result = {
    passed: true,
    review_report_protocol_final_closeout: {
      review_report_protocol_final_closeout_present: true,
      review_report_protocol_final_closeout_candidate_ids_unique: true,
      review_report_protocol_final_closeout_exact_candidate_set_verified: true,
      review_report_protocol_final_closeout_route_summary_binding_verified: true,
      review_report_protocol_final_closeout_admission_binding_verified: true,
      review_report_protocol_final_closeout_production_exclusion_binding_verified: true,
      review_report_protocol_final_closeout_memory_admission_binding_verified: true,
      review_report_protocol_final_closeout_memory_delta_draft_binding_verified: true,
      review_report_protocol_final_closeout_pass_path_verified: true,
      review_report_protocol_final_closeout_mapped_reject_path_verified: true,
      review_report_protocol_final_closeout_unknown_failure_path_verified: true,
      review_report_protocol_final_closeout_no_memory_write_verified: true,
      review_report_protocol_final_closeout_no_production_write_verified: true,
      review_report_protocol_final_closeout_no_provider_plugin_api_image_verified: true,
      review_report_protocol_final_closeout_local_only_verified: true,
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
