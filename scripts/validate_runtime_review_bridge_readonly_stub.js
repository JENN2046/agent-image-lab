#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const adapterPath = "adapters/runtime/review_bridge_readonly_stub.js";
const kernelPath = "kernel/runtime_kernel_v0.js";
const greenFixturePath = "tests/fixtures/runtime_kernel_v0_green_task.fixture.json";
const redFixturePath = "tests/fixtures/runtime_kernel_v0_red_task.fixture.json";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function repoPath(relativePath) {
  const resolved = path.resolve(root, relativePath);
  const relative = path.relative(root, resolved);
  assert(!relative.startsWith("..") && !path.isAbsolute(relative), `Path escapes repository: ${relativePath}`);
  return resolved;
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(repoPath(relativePath), "utf8"));
}

function runNode(args) {
  return execFileSync(process.execPath, args, { cwd: root, encoding: "utf8" });
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function assertFalse(value, label) {
  assert(value === false, `${label} must be false`);
}

function assertBridgeGuard(guard, label) {
  assert(guard.read_only === true, `${label} read_only must be true`);
  assert(guard.display_only === true, `${label} display_only must be true`);
  [
    "fetch_performed",
    "file_write_performed",
    "approval_write_performed",
    "archive_write_performed",
    "accepted_samples_write_performed",
    "production_candidate_created",
    "provider_contact_performed",
    "plugin_call_performed",
    "api_call_performed",
    "image_generation_performed",
    "DailyNote_write_performed",
    "VCP_memory_write_performed",
    "secret_value_read_performed",
    "push_tag_release_deploy_performed",
  ].forEach((field) => assertFalse(guard[field], `${label}.${field}`));
}

function assertReadonlyBridge(runtimeResult, bridge, label) {
  assert(bridge.state === "review_bridge_readonly_stubbed", `${label} state mismatch`);
  assert(bridge.adapter_id === "review_bridge_readonly_stub_v0", `${label} adapter id mismatch`);
  assert(bridge.adapter_contract === "runtime_kernel_v0_contract.review_bridge_readonly.v0", `${label} contract mismatch`);
  assert(bridge.output_ref === `review-console://${runtimeResult.task_id}/readonly_stub`, `${label} output ref mismatch`);
  assert(bridge.display_only === true, `${label} display_only must be true`);
  assert(bridge.writes_allowed_now === false, `${label} writes must be false`);
  assert(bridge.approve_reject_write_allowed_now === false, `${label} approve/reject write must be false`);
  assertFalse(bridge.disk_write_performed, `${label}.disk_write_performed`);
  assertFalse(bridge.production_write_performed, `${label}.production_write_performed`);
  assertFalse(bridge.provider_contact_performed, `${label}.provider_contact_performed`);
  assertFalse(bridge.image_generation_performed, `${label}.image_generation_performed`);
  assertBridgeGuard(bridge.guard, `${label}.guard`);

  const caseDraft = bridge.review_console_case_data.image_case_draft;
  const sessionDraft = bridge.review_console_case_data.review_session_draft;
  const handoff = runtimeResult.artifact_adapter.handoff_record;

  assert(caseDraft.task_id === runtimeResult.task_id, `${label} case task id mismatch`);
  assert(caseDraft.artifact_id === handoff.artifact_id, `${label} case artifact id mismatch`);
  assert(caseDraft.artifact_kind === handoff.artifact_kind, `${label} case artifact kind mismatch`);
  assert(caseDraft.prompt_ref === handoff.prompt_ref, `${label} case prompt ref mismatch`);
  assert(caseDraft.fixture_asset_ref === handoff.fixture_asset_ref, `${label} case fixture asset ref mismatch`);
  assert(caseDraft.persisted_ref === handoff.persisted_ref, `${label} case persisted ref mismatch`);
  assert(caseDraft.persisted_hash === handoff.persisted_hash, `${label} case hash mismatch`);
  assert(caseDraft.audit_id === runtimeResult.audit_record.audit_id, `${label} case audit id mismatch`);
  assert(caseDraft.runtime_final_state === "completed_stub", `${label} final state mismatch`);
  assert(JSON.stringify(caseDraft.runtime_state_path) === JSON.stringify(runtimeResult.transition.path), `${label} state path mismatch`);
  assert(caseDraft.review_status === "pending_human_review", `${label} review status mismatch`);
  assert(caseDraft.accepted_candidate === false, `${label} accepted candidate must be false`);
  assert(caseDraft.commercial_delivery_ready === false, `${label} delivery ready must be false`);
  assert(caseDraft.memory_suitability === "deferred", `${label} memory suitability mismatch`);
  assert(caseDraft.forbidden_actions.includes("write_production_candidate"), `${label} must forbid production candidate`);
  assert(caseDraft.forbidden_actions.includes("write_memory"), `${label} must forbid memory write`);
  assert(caseDraft.forbidden_actions.includes("generate_image"), `${label} must forbid image generation`);

  assert(sessionDraft.session_id === `review_session_${runtimeResult.task_id}`, `${label} session id mismatch`);
  assert(sessionDraft.task_id === runtimeResult.task_id, `${label} session task id mismatch`);
  assert(sessionDraft.case_id === caseDraft.case_id, `${label} session case id mismatch`);
  assert(sessionDraft.project === "agent-image-lab", `${label} project mismatch`);
  assert(sessionDraft.status === "draft", `${label} session status mismatch`);
  assert(sessionDraft.image_versions.length === 1, `${label} image version count mismatch`);
  assert(sessionDraft.image_versions[0].asset_ref === handoff.fixture_asset_ref, `${label} image version asset ref mismatch`);
  assert(sessionDraft.image_versions[0].source === "placeholder", `${label} image version source mismatch`);
  assert(sessionDraft.current_version_id === sessionDraft.image_versions[0].version_id, `${label} current version mismatch`);
  assert(sessionDraft.ai_review.status === "not_run", `${label} ai review status mismatch`);
  assert(sessionDraft.human_review.status === "pending", `${label} human review status mismatch`);
  assert(sessionDraft.final_review.status === "pending_human_review", `${label} final review status mismatch`);
  assert(sessionDraft.approval.approve_reject_write_allowed_now === false, `${label} approval write must be false`);
  assert(sessionDraft.archive_decision.archive_write_allowed_now === false, `${label} archive write must be false`);
  assert(sessionDraft.memory_approval.status === "not_required", `${label} memory approval status mismatch`);
  assert(sessionDraft.memory_preview.safety.DailyNote_write_performed === false, `${label} DailyNote safety mismatch`);
  assert(sessionDraft.memory_preview.safety.VCP_memory_write_performed === false, `${label} VCP memory safety mismatch`);
  assert(sessionDraft.audit_log.some((entry) => entry.audit_id === runtimeResult.audit_record.audit_id), `${label} audit log missing runtime audit`);
  assert(sessionDraft.invariants.includes("Review bridge is read-only and display-only."), `${label} invariant missing`);
}

function expectFailure(caseId, fn) {
  try {
    fn();
  } catch (_error) {
    return {
      case_id: caseId,
      result: "caught",
    };
  }
  throw new Error(`${caseId} was not caught`);
}

function main() {
  assert(fs.existsSync(repoPath(adapterPath)), "review bridge adapter missing");
  assert(fs.existsSync(repoPath(kernelPath)), "kernel file missing");
  runNode(["--check", adapterPath]);
  runNode(["--check", kernelPath]);

  const adapter = require(repoPath(adapterPath));
  const kernel = require(repoPath(kernelPath));
  assert(typeof adapter.buildReviewBridgeReadonlyStub === "function", "buildReviewBridgeReadonlyStub export missing");

  const greenResult = kernel.runRuntimeKernelV0(readJson(greenFixturePath));
  const greenBridge = adapter.buildReviewBridgeReadonlyStub(greenResult);
  assertReadonlyBridge(greenResult, greenBridge, "green direct");

  const cliBridge = JSON.parse(runNode([adapterPath, "--input", greenFixturePath]));
  assertReadonlyBridge(greenResult, cliBridge, "green cli");

  const redResult = kernel.runRuntimeKernelV0(readJson(redFixturePath));
  assert(redResult.final_state === "blocked_red", "red fixture sanity mismatch");

  const negativeCases = [
    expectFailure("red_runtime_result_rejected", () => adapter.buildReviewBridgeReadonlyStub(redResult)),
    expectFailure("side_effect_flag_true_rejected", () => {
      const dirty = clone(greenResult);
      dirty.audit_record.side_effect_flags.provider_contact_performed = true;
      adapter.buildReviewBridgeReadonlyStub(dirty);
    }),
    expectFailure("artifact_next_adapter_drift_rejected", () => {
      const dirty = clone(greenResult);
      dirty.artifact_adapter.handoff_record.next_allowed_adapter = "provider_adapter";
      adapter.buildReviewBridgeReadonlyStub(dirty);
    }),
    expectFailure("review_decision_drift_rejected", () => {
      const dirty = clone(greenResult);
      dirty.review.review_decision = "approved";
      adapter.buildReviewBridgeReadonlyStub(dirty);
    }),
  ];

  console.log(JSON.stringify({
    passed: true,
    validator: "validate_runtime_review_bridge_readonly_stub",
    adapter_id: greenBridge.adapter_id,
    adapter_state: greenBridge.state,
    review_session_id: greenBridge.review_console_case_data.review_session_draft.session_id,
    image_case_id: greenBridge.review_console_case_data.image_case_draft.case_id,
    display_only: true,
    writes_allowed_now: false,
    approve_reject_write_allowed_now: false,
    provider_contact_performed: false,
    image_generation_performed: false,
    production_write_performed: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false,
    red_review_bridge_ran: false,
    negative_case_count: negativeCases.length,
    caught_negative_case_count: negativeCases.filter((item) => item.result === "caught").length,
    all_negative_cases_caught: negativeCases.every((item) => item.result === "caught"),
  }, null, 2));
}

try {
  main();
} catch (error) {
  console.error(JSON.stringify({
    passed: false,
    validator: "validate_runtime_review_bridge_readonly_stub",
    error: error.message,
  }, null, 2));
  process.exitCode = 1;
}
