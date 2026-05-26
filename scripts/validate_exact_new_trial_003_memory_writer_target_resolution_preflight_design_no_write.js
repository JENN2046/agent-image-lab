#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const files = {
  phaseRecord: "docs/V0_6_93_EXACT_NEW_TRIAL_003_MEMORY_WRITER_TARGET_RESOLUTION_PREFLIGHT_DESIGN_NO_WRITE.md",
  report: "reports/visual_asset_eval_dry_run/v0_6_93_exact_new_trial_003_memory_writer_target_resolution_preflight_design_no_write.json",
  receipt: "reports/memory_write_receipts/v0_3_3_exact_new_trial_003_shot_2_memory_writer_target_resolution_preflight_design_no_write.json",
  passFixture: "tests/schema_examples/exact_new_trial_003_memory_writer_target_resolution_preflight_design_no_write.example.json",
  failFixture: "tests/schema_examples/exact_new_trial_003_memory_writer_target_resolution_preflight_design_no_write_fail.example.json",
  blockedReport: "reports/visual_asset_eval_dry_run/v0_6_62_exact_new_trial_003_amber_c_memory_write_target_resolution_blocked.json",
  blockedReceipt: "reports/memory_write_receipts/v0_3_3_exact_new_trial_003_shot_2_amber_c_memory_write_target_resolution_blocked.json",
  readinessReport: "reports/visual_asset_eval_dry_run/v0_6_61_exact_new_trial_003_chinese_memory_entry_readiness_preflight_no_write.json",
  exactTargetsPackage: "reports/memory_target_packages/v0_3_3_exact_new_trial_003_shot_2_exact_allowed_memory_targets.json",
  payloadRefreshPackage: "reports/memory_write_payloads/v0_3_3_exact_new_trial_003_shot_2_daily_note_vcp_memory_write_payload_refresh_package.json",
  canonicalGuard: "docs/214_v10_28_dailynote_canonical_location_guard.md"
};

const expected = {
  phase: "v0_6_93_exact_new_trial_003_memory_writer_target_resolution_preflight_design_no_write",
  sourcePhase: "v0_6_62_exact_new_trial_003_amber_c_memory_write_target_resolution_blocked",
  sampleId: "accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001",
  candidateId: "v0_3_3_exact_new_trial_003_shot_2",
  category: "fashion_lookbook_portrait",
  approvedBy: "Jenn",
  artifactSha256: "8bd7b81a916f0f6333392562d84e32368a3f28dd6a6456fc2f9e49d835a62c3b",
  contractId: "exact_new_trial_003_memory_writer_target_contract_v1",
  recommendedNext: "prepare_exact_non_secret_memory_writer_target_packet_or_pause"
};

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function repoPath(relativePath) {
  const resolved = path.resolve(root, relativePath);
  const relative = path.relative(root, resolved);
  assert(!relative.startsWith("..") && !path.isAbsolute(relative), `Path escapes repository: ${relativePath}`);
  return resolved;
}

function exists(relativePath) {
  return fs.existsSync(repoPath(relativePath));
}

function read(relativePath) {
  return fs.readFileSync(repoPath(relativePath), "utf8");
}

function readJson(relativePath) {
  return JSON.parse(read(relativePath));
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function assertNoRawLocalDrivePath(value, context) {
  if (typeof value === "string") {
    assert(!/^[A-Za-z]:[\\/]/.test(value), `Raw local drive path found in ${context}`);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => assertNoRawLocalDrivePath(item, `${context}.${index}`));
    return;
  }
  if (value && typeof value === "object") {
    Object.entries(value).forEach(([key, item]) => assertNoRawLocalDrivePath(item, `${context}.${key}`));
  }
}

function includesAll(values, required) {
  return required.every((item) => values.includes(item));
}

function validateSourceRefs(record) {
  const refs = record.source_refs || {};
  assert(refs.blocked_report === files.blockedReport, "blocked report ref mismatch");
  assert(refs.blocked_receipt === files.blockedReceipt, "blocked receipt ref mismatch");
  assert(refs.readiness_report === files.readinessReport, "readiness report ref mismatch");
  assert(refs.exact_allowed_targets_package === files.exactTargetsPackage, "exact targets ref mismatch");
  assert(refs.payload_refresh_package === files.payloadRefreshPackage, "payload refresh ref mismatch");
  assert(refs.dailynote_canonical_location_guard === files.canonicalGuard, "canonical guard ref mismatch");

  const blocked = readJson(files.blockedReport).exact_new_trial_003_amber_c_memory_write_target_resolution_blocked;
  assert(blocked.phase === expected.sourcePhase, "source blocked phase mismatch");
  assert(blocked.target_resolution.exact_writer_target_resolved === false, "source blocker must remain unresolved");
  assert(blocked.blocked_red_item.red_lane_stop_condition_reached === true, "source blocker must remain Red stop");
  assert(read(files.canonicalGuard).includes("canonical"), "canonical guard doc must be present");
}

function validateCommon(record, context) {
  assert(record && typeof record === "object", `${context} missing`);
  assertNoRawLocalDrivePath(record, context);

  const target = record.target || {};
  const source = record.source_blocker_reconciliation || {};
  const design = record.preflight_design || {};
  const limits = design.required_limits || {};
  const goNoGo = record.go_no_go || {};
  const guard = record.guard || {};

  assert(record.version === "v1", `${context} version mismatch`);
  assert(record.phase === expected.phase, `${context} phase mismatch`);
  assert(record.status === "completed_validated_memory_writer_target_resolution_preflight_design_no_write", `${context} status mismatch`);
  assert(record.execution_mode === "memory_writer_target_resolution_preflight_design_no_write", `${context} execution mode mismatch`);
  assert(record.lane_attempted === "Green_design_only", `${context} lane attempted mismatch`);
  assert(record.lane_executed === "Green_design_only", `${context} lane executed mismatch`);
  assert(record.source_phase === expected.sourcePhase, `${context} source phase mismatch`);
  assert(target.sample_id === expected.sampleId, `${context} sample mismatch`);
  assert(target.candidate_id === expected.candidateId, `${context} candidate mismatch`);
  assert(target.category === expected.category, `${context} category mismatch`);
  assert(target.approved_by === expected.approvedBy, `${context} approver mismatch`);
  assert(target.artifact_sha256 === expected.artifactSha256, `${context} hash mismatch`);

  assert(source.source_blocker_report_present === true, `${context} source blocker missing`);
  assert(source.source_blocker_phase === expected.sourcePhase, `${context} source blocker phase mismatch`);
  assert(source.authorization_missing_is_blocker === false, `${context} must not claim authorization blocker`);
  assert(source.writer_target_resolution_missing_is_blocker === true, `${context} must preserve writer blocker`);
  assert(source.source_exact_writer_target_resolved === false, `${context} source target must remain unresolved`);
  assert(source.source_next_auto_step_allowed === false, `${context} source auto step must remain blocked`);

  assert(design.contract_id === expected.contractId, `${context} contract mismatch`);
  assert(design.current_selected_writer_tool_or_command === null, `${context} must not select writer`);
  assert(design.current_selected_writer_kind === null, `${context} must not select writer kind`);
  assert(design.exact_writer_target_resolved_now === false, `${context} must not resolve writer`);
  assert(design.memory_write_can_execute_now === false, `${context} must not allow memory write`);
  assert(
    includesAll(design.acceptable_future_writer_kinds || [], [
      "repository_local_writer_script_no_secret_read",
      "installed_connector_tool_exact_write",
      "owner_provided_non_secret_command_wrapper"
    ]),
    `${context} acceptable writer kinds incomplete`
  );
  assert(
    includesAll(design.required_target_packet_fields || [], [
      "selected_writer_tool_or_command",
      "writer_kind",
      "exact_daily_note_target_id",
      "exact_vcp_memory_target_id",
      "canonical_daily_note_root_preflight",
      "post_write_daily_note_canonical_target_proof",
      "post_write_daily_note_content_hash_proof",
      "rollback_or_cleanup_plan",
      "receipt_path",
      "stop_conditions"
    ]),
    `${context} required target fields incomplete`
  );
  assert(
    includesAll(design.required_post_write_evidence || [], [
      "DailyNote canonical target proof",
      "DailyNote content hash proof",
      "VCP memory receipt id or immutable receipt ref",
      "bounded write count receipt"
    ]),
    `${context} post-write evidence incomplete`
  );
  assert(limits.max_write_entries === 2, `${context} max write entries mismatch`);
  assert(limits.max_plugin_calls === 1, `${context} max plugin calls mismatch`);
  assert(limits.max_api_calls === 0, `${context} max api calls mismatch`);
  assert(limits.secret_value_read_allowed === false, `${context} secret read must be false`);
  assert(limits.raw_private_data_print_allowed === false, `${context} raw private print must be false`);
  assert(limits.overwrite_existing_entries_allowed === false, `${context} overwrite must be false`);

  assert(
    includesAll(record.forbidden_resolution_paths || [], [
      "read_env_or_secret_files",
      "print_raw_private_paths",
      "broad_vcpchat_or_vcptoolbox_write",
      "generic_plugin_success_without_canonical_hash",
      "dependency_install_or_change_without_exact_package_action_list",
      "push_tag_release_deploy",
      "external_repository_modification"
    ]),
    `${context} forbidden paths incomplete`
  );

  assert(goNoGo.target_resolution_design_completed === true, `${context} design must complete`);
  assert(goNoGo.exact_writer_target_resolved_now === false, `${context} go/no-go target must be unresolved`);
  assert(goNoGo.memory_write_can_execute_now === false, `${context} go/no-go memory write must be false`);
  assert(goNoGo.next_auto_step_allowed === false, `${context} go/no-go next auto must be false`);

  for (const [key, value] of Object.entries(guard)) {
    if (key === "design_only") {
      assert(value === true, `${context} guard.design_only must be true`);
    } else {
      assert(value === false, `${context} guard.${key} must be false`);
    }
  }

  assert(record.recommended_next === expected.recommendedNext, `${context} recommended next mismatch`);
  assert(record.recommended_next_auto_execution_allowed === false, `${context} auto execution must be false`);
  validateSourceRefs(record);
}

function validateReceipt(receipt) {
  assert(receipt.phase === expected.phase, "receipt phase mismatch");
  assert(receipt.receipt_type === "green_no_write_memory_writer_target_resolution_design_receipt", "receipt type mismatch");
  assert(receipt.status === "completed_validated_memory_writer_target_resolution_preflight_design_no_write", "receipt status mismatch");
  assert(receipt.lane_attempted === "Green_design_only", "receipt attempted lane mismatch");
  assert(receipt.lane_executed === "Green_design_only", "receipt executed lane mismatch");
  assert(receipt.source_phase === expected.sourcePhase, "receipt source phase mismatch");
  assert(receipt.target_sample_id === expected.sampleId, "receipt sample mismatch");
  assert(receipt.target_candidate_id === expected.candidateId, "receipt candidate mismatch");
  assert(receipt.artifact_sha256 === expected.artifactSha256, "receipt hash mismatch");
  assert(receipt.calls_used.plugin_calls === 0, "receipt plugin calls must be zero");
  assert(receipt.calls_used.api_calls === 0, "receipt api calls must be zero");
  assert(receipt.calls_used.memory_write_entries === 0, "receipt memory writes must be zero");
  assert(receipt.writer_resolution_result.target_resolution_design_completed === true, "receipt design must complete");
  assert(receipt.writer_resolution_result.exact_writer_target_resolved_now === false, "receipt target must remain unresolved");
  assert(receipt.writer_resolution_result.selected_writer_tool_or_command === null, "receipt must not select writer");
  assert(receipt.writer_resolution_result.memory_write_can_execute_now === false, "receipt memory write must be false");
  assert(receipt.next_auto_step_allowed === false, "receipt next auto must be false");
  assert(receipt.recommended_next === expected.recommendedNext, "receipt recommended next mismatch");
  for (const [key, value] of Object.entries(receipt.guard || {})) {
    assert(value === false, `receipt guard.${key} must be false`);
  }
}

function expectFailure(baseRecord, caseId, mutate) {
  const candidate = clone(baseRecord);
  mutate(candidate);
  try {
    validateCommon(candidate, caseId);
  } catch (error) {
    return { case_id: caseId, result: "caught", failure_message: error.message };
  }
  throw new Error(`${caseId} was not caught`);
}

function main() {
  for (const relativePath of Object.values(files)) {
    assert(exists(relativePath), `Missing required file: ${relativePath}`);
  }

  const phaseText = read(files.phaseRecord);
  const report = readJson(files.report).exact_new_trial_003_memory_writer_target_resolution_preflight_design_no_write;
  const receipt = readJson(files.receipt).memory_writer_target_resolution_preflight_design_no_write;
  const passFixture = readJson(files.passFixture).exact_new_trial_003_memory_writer_target_resolution_preflight_design_no_write;
  const failFixture = readJson(files.failFixture).exact_new_trial_003_memory_writer_target_resolution_preflight_design_no_write;

  for (const token of [
    `phase: ${expected.phase}`,
    "exact_writer_target_resolved_now: false",
    "memory_write_can_execute_now: false",
    "DailyNote_write_performed: false",
    "VCP_memory_write_performed: false",
    expected.recommendedNext
  ]) {
    assert(phaseText.includes(token), `phase record missing token: ${token}`);
  }

  validateCommon(report, "report");
  validateCommon(passFixture, "pass_fixture");
  validateReceipt(receipt);

  let failFixtureCaught = false;
  try {
    validateCommon(failFixture, "fail_fixture");
  } catch {
    failFixtureCaught = true;
  }
  assert(failFixtureCaught, "fail fixture must fail");

  const negativeCases = [
    expectFailure(passFixture, "authorization_blocker_overclaim_fails", (candidate) => {
      candidate.source_blocker_reconciliation.authorization_missing_is_blocker = true;
    }),
    expectFailure(passFixture, "writer_selected_overclaim_fails", (candidate) => {
      candidate.preflight_design.current_selected_writer_tool_or_command = "some_writer";
    }),
    expectFailure(passFixture, "target_resolved_overclaim_fails", (candidate) => {
      candidate.preflight_design.exact_writer_target_resolved_now = true;
    }),
    expectFailure(passFixture, "memory_write_allowed_fails", (candidate) => {
      candidate.go_no_go.memory_write_can_execute_now = true;
    }),
    expectFailure(passFixture, "secret_allowed_fails", (candidate) => {
      candidate.preflight_design.required_limits.secret_value_read_allowed = true;
    }),
    expectFailure(passFixture, "canonical_hash_evidence_missing_fails", (candidate) => {
      candidate.preflight_design.required_post_write_evidence = ["DailyNote canonical target proof"];
    }),
    expectFailure(passFixture, "forbidden_env_path_missing_fails", (candidate) => {
      candidate.forbidden_resolution_paths = candidate.forbidden_resolution_paths.filter((item) => item !== "read_env_or_secret_files");
    }),
    expectFailure(passFixture, "dailynote_write_claim_fails", (candidate) => {
      candidate.guard.DailyNote_write_performed = true;
    }),
    expectFailure(passFixture, "vcp_memory_write_claim_fails", (candidate) => {
      candidate.guard.VCP_memory_write_performed = true;
    }),
    expectFailure(passFixture, "next_auto_allowed_fails", (candidate) => {
      candidate.recommended_next_auto_execution_allowed = true;
    })
  ];

  const output = {
    phase: report.phase,
    passed: true,
    status: report.status,
    target_sample_id: report.target.sample_id,
    target_candidate_id: report.target.candidate_id,
    source_phase: report.source_phase,
    target_resolution_design_completed: report.go_no_go.target_resolution_design_completed,
    exact_writer_target_resolved_now: report.go_no_go.exact_writer_target_resolved_now,
    memory_write_can_execute_now: report.go_no_go.memory_write_can_execute_now,
    next_auto_step_allowed: report.go_no_go.next_auto_step_allowed,
    DailyNote_write_performed: report.guard.DailyNote_write_performed,
    VCP_memory_write_performed: report.guard.VCP_memory_write_performed,
    secret_value_read_performed: report.guard.secret_value_read_performed,
    negative_case_count: negativeCases.length,
    caught_negative_case_count: negativeCases.filter((item) => item.result === "caught").length,
    all_negative_cases_caught: negativeCases.every((item) => item.result === "caught"),
    recommended_next: report.recommended_next,
    recommended_next_auto_execution_allowed: report.recommended_next_auto_execution_allowed
  };

  console.log(JSON.stringify(output, null, 2));
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
}
