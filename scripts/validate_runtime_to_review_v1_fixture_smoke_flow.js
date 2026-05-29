#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const smokePath = "scripts/run_runtime_to_review_v1_fixture_smoke_flow.js";
const fixturePath = "tests/fixtures/runtime_kernel_v1_no_provider_fixture_task.fixture.json";

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
  return childProcess.execFileSync(process.execPath, args, { cwd: root, encoding: "utf8" });
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function expectFailure(caseId, fn) {
  try {
    fn();
  } catch (_error) {
    return { case_id: caseId, result: "caught" };
  }
  throw new Error(`${caseId} was not caught`);
}

function assertSmokeResult(result, label) {
  assert(result.schema === "runtime_to_review_v1_fixture_smoke_flow_result.v1", `${label} schema mismatch`);
  assert(result.flow_id === "runtime_to_review_v1_fixture_smoke_flow", `${label} flow id mismatch`);
  assert(result.status === "completed_fixture_runtime_to_review_smoke", `${label} status mismatch`);
  assert(result.runtime_status === "completed_fixture_artifact", `${label} runtime status mismatch`);
  assert(result.review_session_status === "readonly_real_session", `${label} session status mismatch`);
  assert(result.decision === "request_rework", `${label} decision mismatch`);
  assert(result.draft_type === "rework_sample_draft", `${label} draft type mismatch`);
  assert(result.metadata_only === true, `${label} metadata_only mismatch`);
  assert(result.writes_performed === false, `${label} must not write files`);
  assert(result.calls_used.provider === 0, `${label} provider call count mismatch`);
  assert(result.calls_used.plugin === 0, `${label} plugin call count mismatch`);
  assert(result.calls_used.api === 0, `${label} api call count mismatch`);
  assert(result.image_count === 1, `${label} image count mismatch`);
  assert(result.output_scope === "run_directory_only", `${label} output scope mismatch`);
  [
    "prompt_fixture_loaded",
    "runtime_v1_completed_fixture_artifact",
    "artifact_record_created",
    "audit_receipt_created",
    "review_bridge_entry_created",
    "readonly_review_session_created",
    "review_decision_record_built",
    "draft_registry_record_built",
  ].forEach((stage) => assert(result.stages.includes(stage), `${label} missing stage ${stage}`));
  [
    "provider_contact_performed",
    "plugin_call_performed",
    "api_call_performed",
    "image_generation_performed",
    "image_binary_read_performed",
    "accepted_samples_write_performed",
    "production_candidate_write_performed",
    "DailyNote_write_performed",
    "VCP_memory_write_performed",
    "memory_write_performed",
  ].forEach((field) => {
    assert(result[field] === false, `${label}.${field} must be false`);
    assert(result.side_effect_flags[field] === false, `${label}.side_effect_flags.${field} must be false`);
  });
}

async function main() {
  assert(fs.existsSync(repoPath(smokePath)), "fixture smoke flow runner missing");
  runNode(["--check", smokePath]);
  runNode(["--check", "scripts/validate_runtime_to_review_v1_fixture_smoke_flow.js"]);

  const smoke = require(repoPath(smokePath));
  const kernel = require(repoPath("kernel/runtime_kernel_v1_real_provider_guarded.js"));
  const bridge = require(repoPath("adapters/runtime/review_bridge_runtime_v1_readonly.js"));
  const decisions = require(repoPath("adapters/runtime/review_decision_record_v1.js"));
  const drafts = require(repoPath("adapters/runtime/review_draft_registry_v1.js"));

  const result = await smoke.runRuntimeToReviewV1FixtureSmokeFlow({
    input: fixturePath,
    decision: "request_rework",
    reviewer_note: "Fixture smoke validator decision.",
    created_at: "2026-05-29T00:00:00.000Z",
  });
  assertSmokeResult(result, "module_smoke");

  const cliResult = JSON.parse(runNode([smokePath, "--input", fixturePath, "--decision", "request_rework", "--reviewer-note", "Fixture smoke validator decision.", "--created-at", "2026-05-29T00:00:00.000Z"]));
  assertSmokeResult(cliResult, "cli_smoke");

  const fixtureTask = readJson(fixturePath);
  const runtimeResult = await kernel.runRuntimeKernelV1(fixtureTask);
  const session = bridge.buildRuntimeV1ReadonlyReviewSessionFromRuntimeResult(runtimeResult);
  const decisionRecord = decisions.buildReviewDecisionRecordFromRuntimeV1Session(session, {
    decision: "request_rework",
    reviewer_note: "Fixture smoke validator decision.",
    created_at: "2026-05-29T00:00:00.000Z",
  });
  const draftRecord = drafts.buildReviewDraftRegistryRecord(decisionRecord);
  assert(draftRecord.draft_type === "rework_sample_draft", "request_rework must create rework draft");

  const providerFailure = await kernel.runRuntimeKernelV1({
    ...fixtureTask,
    provider_route: "native_doubao_guarded",
    provider_mode: "real_guarded",
  });
  assert(providerFailure.status === "failed_closed", "real provider path without delegate must fail closed");

  const modelMismatch = await kernel.runRuntimeKernelV1({
    ...fixtureTask,
    provider_route: "native_doubao_guarded",
    provider_mode: "real_guarded",
  }, {
    providerDelegate: () => ({
      status: "completed_provider_image_created",
      model_sent: "wrong-model",
      calls_used: { provider: 1, plugin: 1, api: 1 },
      image_count: 1,
      output_files: [
        {
          path: "runs/real_generation/runtime_v1_validator_fake/image/fake-output.png",
          sha256: "d".repeat(64),
          mime_type: "image/png",
          dimensions: "1024x1024",
        },
      ],
      provider_contact_performed: true,
      plugin_call_performed: true,
      api_call_performed: true,
      image_generation_performed: true,
    }),
  });
  assert(modelMismatch.status === "failed_closed", "model mismatch must fail closed");

  const negativeCases = [
    expectFailure("failed_runtime_not_reviewable", () => bridge.buildRuntimeV1ReadonlyReviewSessionFromRuntimeResult(providerFailure)),
    expectFailure("missing_artifact_output_rejected", () => {
      const dirty = clone(runtimeResult);
      dirty.artifact_record.output_files = [];
      bridge.buildRuntimeV1ReadonlyReviewSessionFromRuntimeResult(dirty);
    }),
    expectFailure("invalid_mime_metadata_rejected", () => {
      const dirty = clone(runtimeResult);
      dirty.artifact_record.output_files[0].mime_type = "";
      bridge.buildRuntimeV1ReadonlyReviewSessionFromRuntimeResult(dirty);
    }),
    expectFailure("invalid_review_decision_rejected", () => decisions.buildReviewDecisionRecordFromRuntimeV1Session(session, {
      decision: "ship_to_production",
      reviewer_note: "Invalid decision must fail.",
    })),
    expectFailure("forbidden_production_flag_rejected", () => {
      const dirty = clone(decisionRecord);
      dirty.production_candidate = true;
      decisions.validateReviewDecisionRecord(dirty);
    }),
    expectFailure("forbidden_memory_write_rejected", () => {
      const dirty = clone(draftRecord);
      dirty.memory_write_performed = true;
      drafts.validateReviewDraftRegistryRecord(dirty);
    }),
  ];

  console.log(JSON.stringify({
    passed: true,
    validator: "validate_runtime_to_review_v1_fixture_smoke_flow",
    flow_id: result.flow_id,
    status: result.status,
    runtime_status: result.runtime_status,
    review_session_status: result.review_session_status,
    decision: result.decision,
    draft_type: result.draft_type,
    provider_failure_failed_closed: providerFailure.status === "failed_closed",
    model_mismatch_failed_closed: modelMismatch.status === "failed_closed",
    file_write_performed: false,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    image_binary_read_performed: false,
    accepted_samples_write_performed: false,
    production_candidate_write_performed: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false,
    memory_write_performed: false,
    negative_case_count: negativeCases.length,
    caught_negative_case_count: negativeCases.filter((item) => item.result === "caught").length,
    all_negative_cases_caught: negativeCases.every((item) => item.result === "caught"),
  }, null, 2));
}

main().catch((error) => {
  console.error(JSON.stringify({
    passed: false,
    validator: "validate_runtime_to_review_v1_fixture_smoke_flow",
    error: error.message,
  }, null, 2));
  process.exitCode = 1;
});
