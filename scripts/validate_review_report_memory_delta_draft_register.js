const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const requiredFiles = [
  "tests/schema_examples/review_report_memory_delta_draft_register.example.json",
  "tests/schema_examples/review_report_memory_admission_register.example.json"
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

function countWhere(items, predicate) {
  return items.filter(predicate).length;
}

function hasChineseText(value) {
  return typeof value === "string" && /[\u4e00-\u9fff]/.test(value);
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

function assertDraftMatchesAdmission(draft, admission) {
  assert(admission.memory_draft_allowed === true, `${draft.candidate_id} source admission must allow draft.`);
  assert(admission.memory_forbidden === false, `${draft.candidate_id} source admission must not be memory-forbidden.`);
  assert(draft.source_memory_admission_record_id === admission.memory_admission_record_id, `${draft.candidate_id} must cite source memory admission record.`);
  assert(draft.review_outcome === admission.review_outcome, `${draft.candidate_id} review outcome must match memory admission.`);
  assert(draft.route_class === admission.route_class, `${draft.candidate_id} route class must match memory admission.`);
  assert(draft.memory_route === admission.memory_route, `${draft.candidate_id} memory route must match memory admission.`);
  assert(draft.memory_draft_type === admission.memory_draft_type, `${draft.candidate_id} memory draft type must match memory admission.`);
  assertArrayEqual(draft.failure_tags, admission.failure_tags, `${draft.candidate_id} failure tags must match memory admission`);
  assertArrayEqual(draft.unknown_failure_tags, admission.unknown_failure_tags, `${draft.candidate_id} unknown failure tags must match memory admission`);
}

function assertDraftSemantics(draft) {
  assert(draft.memory_delta_draft_id, `${draft.candidate_id} draft must have id.`);
  assert(draft.draft_language === "zh-CN", `${draft.candidate_id} draft must be zh-CN.`);
  assert(hasChineseText(draft.draft_body_zh), `${draft.candidate_id} draft body must contain Chinese text.`);
  assert(draft.draft_status === "draft_pending_human_memory_approval", `${draft.candidate_id} draft must remain pending human memory approval.`);
  assert(draft.human_memory_approval_required === true, `${draft.candidate_id} draft must require human memory approval.`);
  assert(draft.memory_approval_record_required === true, `${draft.candidate_id} draft must require memory approval record.`);
  assert(draft.memory_entry_allowed_now === false, `${draft.candidate_id} draft must not allow memory entry now.`);
  assert(draft.memory_entry_created === false, `${draft.candidate_id} draft must not create memory entry.`);
  assert(draft.direct_memory_write_allowed_now === false, `${draft.candidate_id} draft must not allow direct memory write.`);
  assert(draft.daily_note_write_allowed_now === false, `${draft.candidate_id} draft must not allow DailyNote write.`);
  assert(draft.vcp_memory_write_allowed_now === false, `${draft.candidate_id} draft must not allow VCP memory write.`);
  assert(draft.direct_memory_write_performed === false, `${draft.candidate_id} draft must not write memory directly.`);
  assert(draft.daily_note_write_performed === false, `${draft.candidate_id} draft must not write DailyNote.`);
  assert(draft.vcp_memory_write_performed === false, `${draft.candidate_id} draft must not write VCP memory.`);
  assert(draft.accepted_samples_write_performed === false, `${draft.candidate_id} draft must not write accepted_samples.`);
  assert(draft.production_candidate_created === false, `${draft.candidate_id} draft must not create production candidates.`);
  assert(draft.provider_contact_performed === false, `${draft.candidate_id} draft must not contact provider.`);
  assert(draft.plugin_call_performed === false, `${draft.candidate_id} draft must not call plugin.`);
  assert(draft.api_call_performed === false, `${draft.candidate_id} draft must not call API.`);
  assert(draft.image_generation_performed === false, `${draft.candidate_id} draft must not generate images.`);
  assert(draft.payload_contains_image_binary === false, `${draft.candidate_id} draft must not contain image binary.`);
  assert(draft.asset_reference_metadata_only === true, `${draft.candidate_id} draft must be metadata-only.`);

  if (draft.review_outcome === "pass") {
    assert(draft.draft_kind === "accepted_candidate_memory_delta", `${draft.candidate_id} pass draft must be accepted candidate memory delta.`);
    assert(draft.memory_draft_type === "accepted_candidate_memory_delta_draft", `${draft.candidate_id} pass draft type must match accepted candidate memory delta.`);
  }

  if (draft.review_outcome === "reject") {
    assert(draft.draft_kind === "failure_lesson_memory_delta", `${draft.candidate_id} reject draft must be failure lesson memory delta.`);
    assert(draft.memory_draft_type === "rejected_candidate_failure_lesson_draft", `${draft.candidate_id} reject draft type must match failure lesson.`);
    assert(draft.failure_tags.length > 0, `${draft.candidate_id} reject draft must carry mapped failure tags.`);
    assert(draft.unknown_failure_tags.length === 0, `${draft.candidate_id} draftable reject must not carry unknown failure tags.`);
  }
}

function assertForbiddenMatchesAdmission(record, admission) {
  assert(admission.memory_forbidden === true, `${record.candidate_id} source admission must be memory-forbidden.`);
  assert(admission.memory_draft_allowed === false, `${record.candidate_id} source admission must not allow draft.`);
  assert(record.source_memory_admission_record_id === admission.memory_admission_record_id, `${record.candidate_id} forbidden record must cite source memory admission record.`);
  assert(record.review_outcome === admission.review_outcome, `${record.candidate_id} review outcome must match memory admission.`);
  assert(record.route_class === admission.route_class, `${record.candidate_id} route class must match memory admission.`);
  assert(record.memory_route === admission.memory_route, `${record.candidate_id} memory route must match memory admission.`);
  assert(record.memory_draft_allowed === false, `${record.candidate_id} forbidden record must not allow draft.`);
  assert(record.memory_draft_created === false, `${record.candidate_id} forbidden record must not create draft.`);
  assert(record.memory_forever_blocked === true, `${record.candidate_id} forbidden record must block memory forever.`);
  assert(record.memory_forbidden_reason === "unknown_failure_tags_present", `${record.candidate_id} forbidden reason must cite unknown failure.`);
  assert(record.unknown_failure_tags.length > 0, `${record.candidate_id} forbidden record must carry unknown failure tags.`);
  assert(record.direct_memory_write_performed === false, `${record.candidate_id} forbidden record must not write memory directly.`);
  assert(record.daily_note_write_performed === false, `${record.candidate_id} forbidden record must not write DailyNote.`);
  assert(record.vcp_memory_write_performed === false, `${record.candidate_id} forbidden record must not write VCP memory.`);
  assert(record.accepted_samples_write_performed === false, `${record.candidate_id} forbidden record must not write accepted_samples.`);
  assert(record.production_candidate_created === false, `${record.candidate_id} forbidden record must not create production candidate.`);
}

function main() {
  const missingFiles = requiredFiles.filter((relativePath) => !exists(relativePath));
  assert(missingFiles.length === 0, `Missing ReviewReport memory delta draft register files: ${missingFiles.join(", ")}`);

  const register = parseJson(
    read("tests/schema_examples/review_report_memory_delta_draft_register.example.json"),
    "ReviewReport memory delta draft register"
  );
  const memoryAdmission = parseJson(
    read("tests/schema_examples/review_report_memory_admission_register.example.json"),
    "ReviewReport memory admission register"
  );

  assert(register.status === "local_review_report_memory_delta_draft_register", "Register must be local_review_report_memory_delta_draft_register.");
  assert(register.display_only === true, "Register must be display-only.");
  assert(register.source_phase === "v14_077_review_report_memory_admission_register_gate", "Register source phase must be v14.077.");
  assert(
    register.source_memory_admission_register_ref === "tests/schema_examples/review_report_memory_admission_register.example.json",
    "Register must cite ReviewReport memory admission register."
  );

  const draftableAdmissions = memoryAdmission.memory_admission_records.filter((record) => record.memory_draft_allowed === true);
  const forbiddenAdmissions = memoryAdmission.memory_admission_records.filter((record) => record.memory_forbidden === true);
  assertUniqueCandidateIds(register.memory_delta_draft_records, "memory delta draft register");
  assertUniqueCandidateIds(register.memory_forbidden_records, "memory forbidden register");
  assertArrayEqual(
    register.memory_delta_draft_records.map((record) => record.candidate_id),
    draftableAdmissions.map((record) => record.candidate_id),
    "Memory delta draft candidate set must exactly match draftable memory admissions"
  );
  assertArrayEqual(
    register.memory_forbidden_records.map((record) => record.candidate_id),
    forbiddenAdmissions.map((record) => record.candidate_id),
    "Memory forbidden candidate set must exactly match forbidden memory admissions"
  );

  for (const draft of register.memory_delta_draft_records) {
    const admission = getByCandidate(memoryAdmission.memory_admission_records, draft.candidate_id, "memory admission register");
    assertDraftMatchesAdmission(draft, admission);
    assertDraftSemantics(draft);
  }

  for (const record of register.memory_forbidden_records) {
    const admission = getByCandidate(memoryAdmission.memory_admission_records, record.candidate_id, "memory admission register");
    assertForbiddenMatchesAdmission(record, admission);
  }

  const summary = register.register_summary;
  assert(summary.candidate_count === memoryAdmission.memory_admission_records.length, "Summary candidate count must match memory admission records.");
  assert(summary.memory_delta_draft_count === register.memory_delta_draft_records.length, "Summary memory draft count must match draft records.");
  assert(summary.accepted_candidate_memory_delta_draft_count === countWhere(register.memory_delta_draft_records, (draft) => draft.draft_kind === "accepted_candidate_memory_delta"), "Accepted candidate draft count must match records.");
  assert(summary.failure_lesson_draft_count === countWhere(register.memory_delta_draft_records, (draft) => draft.draft_kind === "failure_lesson_memory_delta"), "Failure lesson draft count must match records.");
  assert(summary.memory_forbidden_record_count === register.memory_forbidden_records.length, "Forbidden record count must match records.");
  assert(summary.all_draft_candidate_ids_unique === true, "Draft candidate ids must be unique.");
  assert(summary.exact_draft_candidate_set_verified === true, "Draft candidate set must be exact.");
  assert(summary.exact_forbidden_candidate_set_verified === true, "Forbidden candidate set must be exact.");
  assert(summary.all_drafts_match_memory_admission_register === true, "All drafts must match memory admission register.");
  assert(summary.all_drafts_language_zh_cn === true, "All drafts must be zh-CN.");
  assert(summary.all_drafts_have_chinese_body === true, "All drafts must have Chinese body.");
  assert(summary.all_drafts_pending_human_memory_approval === true, "All drafts must be pending human memory approval.");
  assert(summary.all_drafts_metadata_only === true, "All drafts must be metadata-only.");
  assert(summary.no_memory_forbidden_draft_created === true, "No memory-forbidden draft may be created.");
  assert(summary.no_memory_entry_allowed_now === true, "No memory entry may be allowed now.");
  assert(summary.no_memory_entry_created === true, "No memory entry may be created.");
  assert(summary.no_direct_memory_write_performed === true, "No direct memory write may be performed.");
  assert(summary.daily_note_write_performed === false, "No DailyNote write may be performed.");
  assert(summary.vcp_memory_write_performed === false, "No VCP memory write may be performed.");
  assert(summary.accepted_samples_write_performed === false, "No accepted_samples write may be performed.");
  assert(summary.production_candidate_created === false, "No production candidate may be created.");
  assert(summary.provider_plugin_api_image_performed === false, "No provider/plugin/API/image effect may be performed.");
  assertNoExecutionGuard(register.no_execution_guard, "ReviewReport memory delta draft register no-execution guard");

  const result = {
    passed: true,
    review_report_memory_delta_draft_register: {
      review_report_memory_delta_draft_register_present: true,
      review_report_memory_delta_draft_candidate_ids_unique: true,
      review_report_memory_delta_draft_exact_candidate_set_verified: true,
      review_report_memory_delta_draft_forbidden_candidate_set_verified: true,
      review_report_memory_delta_draft_matches_memory_admission_register: true,
      review_report_memory_delta_draft_accepted_candidate_draft_verified: true,
      review_report_memory_delta_draft_failure_lesson_draft_verified: true,
      review_report_memory_delta_draft_unknown_failure_forbidden_verified: true,
      review_report_memory_delta_draft_chinese_body_verified: true,
      review_report_memory_delta_draft_human_approval_required: true,
      review_report_memory_delta_draft_no_memory_entry_created: true,
      review_report_memory_delta_draft_no_direct_memory_write_verified: true,
      review_report_memory_delta_draft_no_daily_note_write_verified: true,
      review_report_memory_delta_draft_no_vcp_memory_write_verified: true,
      review_report_memory_delta_draft_no_accepted_samples_write_verified: true,
      review_report_memory_delta_draft_no_production_candidate_verified: true,
      review_report_memory_delta_draft_no_provider_plugin_api_image_verified: true,
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
