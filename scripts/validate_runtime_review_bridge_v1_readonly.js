#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const adapterPath = "adapters/runtime/review_bridge_runtime_v1_readonly.js";
const kernelPath = "kernel/runtime_kernel_v1_real_provider_guarded.js";
const fixturePath = "tests/fixtures/runtime_kernel_v1_no_provider_fixture_task.fixture.json";
const realGuardedPath = "tests/fixtures/runtime_kernel_v1_real_guarded_task.fixture.json";

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

function assertReadonlyRuntimeV1Session(session, runtimeResult, label) {
  assert(session.schema === "runtime_v1_readonly_review_session.v1", `${label} schema mismatch`);
  assert(session.adapter_id === "review_bridge_runtime_v1_readonly", `${label} adapter id mismatch`);
  assert(session.adapter_contract === "runtime_kernel_v1_contract.review_bridge_readonly.v1", `${label} contract mismatch`);
  assert(session.session_mode === "runtime_v1_real_entry_readonly", `${label} mode mismatch`);
  assert(session.status === "readonly_real_session", `${label} status mismatch`);
  assert(session.task_id === runtimeResult.task_id, `${label} task id mismatch`);
  assert(session.current_review_status === "pending_human_review", `${label} review status mismatch`);
  assert(session.display_fields.run_id === runtimeResult.review_bridge_entry.run_id, `${label} run id mismatch`);
  assert(session.display_fields.prompt_package_ref === runtimeResult.review_bridge_entry.source_prompt_package_ref, `${label} prompt ref mismatch`);
  assert(session.display_fields.provider_route === runtimeResult.review_bridge_entry.provider_route, `${label} provider route mismatch`);
  assert(session.display_fields.model_required === runtimeResult.review_bridge_entry.model_required, `${label} model required mismatch`);
  assert(session.display_fields.model_sent === runtimeResult.review_bridge_entry.model_sent, `${label} model sent mismatch`);
  assert(session.display_fields.image_dimensions === runtimeResult.review_bridge_entry.image_dimensions, `${label} dimensions mismatch`);
  assert(session.display_fields.image_sha256 === runtimeResult.review_bridge_entry.image_sha256, `${label} hash mismatch`);
  assert(session.display_fields.audit_receipt_ref === runtimeResult.audit_receipt_ref, `${label} audit ref mismatch`);
  assert(session.display_fields.artifact_record_ref === runtimeResult.artifact_record_ref, `${label} artifact ref mismatch`);
  assert(session.image_versions.length === 1, `${label} image version count mismatch`);
  assert(session.image_versions[0].image_binary_loaded === false, `${label} image binary must not load`);
  assert(session.audit_summary.status === runtimeResult.audit_receipt.status, `${label} audit status mismatch`);
  assert(session.guard.read_only === true, `${label} guard read_only mismatch`);
  assert(session.guard.display_only === true, `${label} guard display_only mismatch`);
  [
    "image_binary_read_performed",
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
  ].forEach((field) => assert(session.guard[field] === false, `${label}.guard.${field} must be false`));
  assert(session.forbidden_actions.includes("read_image_binary"), `${label} must forbid image binary reads`);
  assert(session.forbidden_actions.includes("write_production_candidate"), `${label} must forbid production candidate writes`);
  assert(session.forbidden_actions.includes("write_memory"), `${label} must forbid memory writes`);
}

function fakeProviderDelegate(request) {
  return {
    status: "completed_provider_image_created",
    model_sent: request.model_required,
    calls_used: { provider: 1, plugin: 1, api: 1 },
    image_count: 1,
    output_files: [
      {
        path: "runs/real_generation/runtime_v1_validator_fake/image/fake-output.png",
        bytes: 1200,
        sha256: "a".repeat(64),
        mime_type: "image/png",
        dimensions: "1024x1024",
        magic_number: "89504e47",
      },
    ],
    provider_contact_performed: true,
    plugin_call_performed: true,
    api_call_performed: true,
    image_generation_performed: true,
    secret_value_read_performed: false,
    env_file_content_read_performed: false,
    production_write_performed: false,
    accepted_samples_write_performed: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false,
  };
}

async function main() {
  assert(fs.existsSync(repoPath(adapterPath)), "runtime v1 readonly review bridge adapter missing");
  assert(fs.existsSync(repoPath(kernelPath)), "runtime v1 kernel missing");
  runNode(["--check", adapterPath]);
  runNode(["--check", kernelPath]);

  const adapter = require(repoPath(adapterPath));
  const kernel = require(repoPath(kernelPath));
  assert(typeof adapter.buildRuntimeV1ReadonlyReviewSessionFromRuntimeResult === "function", "adapter export missing");

  const fixtureResult = await kernel.runRuntimeKernelV1(readJson(fixturePath));
  assert(fixtureResult.status === "completed_fixture_artifact", "fixture runtime result mismatch");
  const fixtureSession = adapter.buildRuntimeV1ReadonlyReviewSessionFromRuntimeResult(fixtureResult);
  assertReadonlyRuntimeV1Session(fixtureSession, fixtureResult, "fixture");

  const cliSession = JSON.parse(runNode([adapterPath, "--input", fixturePath]));
  assertReadonlyRuntimeV1Session(cliSession, fixtureResult, "cli fixture");

  const realGuardedResult = await kernel.runRuntimeKernelV1(readJson(realGuardedPath), {
    providerDelegate: fakeProviderDelegate,
  });
  assert(realGuardedResult.status === "completed_provider_image_created", "fake provider runtime result mismatch");
  const realGuardedSession = adapter.buildRuntimeV1ReadonlyReviewSessionFromRuntimeResult(realGuardedResult);
  assertReadonlyRuntimeV1Session(realGuardedSession, realGuardedResult, "fake provider");

  const failedClosed = await kernel.runRuntimeKernelV1(readJson(realGuardedPath));
  assert(failedClosed.status === "failed_closed", "no delegate must fail closed");

  const negativeCases = [
    expectFailure("failed_closed_result_rejected", () => adapter.buildRuntimeV1ReadonlyReviewSessionFromRuntimeResult(failedClosed)),
    expectFailure("missing_bridge_hash_rejected", () => {
      const dirty = clone(fixtureResult);
      delete dirty.review_bridge_entry.image_sha256;
      adapter.buildRuntimeV1ReadonlyReviewSessionFromRuntimeResult(dirty);
    }),
    expectFailure("image_binary_read_rejected", () => {
      const dirty = clone(fixtureResult);
      dirty.review_bridge_entry.image_binary_read_performed = true;
      adapter.buildRuntimeV1ReadonlyReviewSessionFromRuntimeResult(dirty);
    }),
    expectFailure("audit_secret_read_rejected", () => {
      const dirty = clone(fixtureResult);
      dirty.audit_receipt.secret_handling.secret_value_read_performed = true;
      adapter.buildRuntimeV1ReadonlyReviewSessionFromRuntimeResult(dirty);
    }),
    expectFailure("artifact_hash_mismatch_rejected", () => {
      const dirty = clone(fixtureResult);
      dirty.artifact_record.sha256 = "b".repeat(64);
      adapter.buildRuntimeV1ReadonlyReviewSessionFromRuntimeResult(dirty);
    }),
  ];

  console.log(JSON.stringify({
    passed: true,
    validator: "validate_runtime_review_bridge_v1_readonly",
    adapter_id: adapter.adapterId,
    fixture_status: fixtureSession.status,
    fake_provider_status: realGuardedSession.status,
    display_fields_verified: true,
    readonly_real_session_verified: true,
    image_binary_read_performed: false,
    file_write_performed: false,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false,
    production_candidate_write_performed: false,
    negative_case_count: negativeCases.length,
    caught_negative_case_count: negativeCases.filter((item) => item.result === "caught").length,
    all_negative_cases_caught: negativeCases.every((item) => item.result === "caught"),
  }, null, 2));
}

main().catch((error) => {
  console.error(JSON.stringify({
    passed: false,
    validator: "validate_runtime_review_bridge_v1_readonly",
    error: error.message,
  }, null, 2));
  process.exitCode = 1;
});
