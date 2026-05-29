#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const kernelPath = "kernel/runtime_kernel_v1_real_provider_guarded.js";
const fixturePath = "tests/fixtures/runtime_kernel_v1_no_provider_fixture_task.fixture.json";
const realGuardedFixturePath = "tests/fixtures/runtime_kernel_v1_real_guarded_task.fixture.json";

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
  return execFileSync(process.execPath, args, {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
}

function assertFalse(value, label) {
  assert(value === false, `${label} must be false`);
}

function assertCleanBridge(entry, label) {
  assert(entry.schema === "runtime_v1_review_bridge_entry.v1", `${label} review bridge schema mismatch`);
  assert(entry.display_only === true, `${label} review bridge must be display_only`);
  assert(entry.metadata_only === true, `${label} review bridge must be metadata_only`);
  assert(entry.current_review_status === "pending_human_review", `${label} review status mismatch`);
  [
    "image_binary_read_performed",
    "file_write_performed",
    "provider_contact_performed",
    "plugin_call_performed",
    "api_call_performed",
    "image_generation_performed",
    "accepted_samples_write_performed",
    "production_candidate_write_performed",
    "DailyNote_write_performed",
    "VCP_memory_write_performed",
  ].forEach((field) => assertFalse(entry[field], `${label}.${field}`));
}

function assertArtifactRecord(record, label, expected) {
  assert(record.schema === "runtime_v1_artifact_record.v1", `${label} artifact schema mismatch`);
  assert(record.task_id === expected.task_id, `${label} artifact task mismatch`);
  assert(record.source_prompt_package_ref === expected.prompt_package_ref, `${label} prompt ref mismatch`);
  assert(record.provider_route === expected.provider_route, `${label} provider route mismatch`);
  assert(record.model_required === "doubao-seedream-5-0-260128", `${label} model_required mismatch`);
  assert(record.status === expected.status, `${label} artifact status mismatch`);
  assert(record.audit_receipt_ref.endsWith("/audit_receipt.json"), `${label} audit receipt ref mismatch`);
  assert(record.review_bridge_ref === expected.review_bridge_ref, `${label} review bridge ref mismatch`);
  assert(Array.isArray(record.output_files), `${label} output_files must be array`);
}

function assertAuditReceipt(receipt, label, expected) {
  assert(receipt.schema === "runtime_v1_audit_receipt.v1", `${label} receipt schema mismatch`);
  assert(receipt.kernel_id === "runtime_kernel_v1_real_provider_guarded", `${label} kernel mismatch`);
  assert(receipt.contract_id === "runtime_kernel_v1_contract", `${label} contract mismatch`);
  assert(receipt.contract_version === "v1.0", `${label} version mismatch`);
  assert(receipt.status === expected.status, `${label} receipt status mismatch`);
  assert(receipt.task_id === expected.task_id, `${label} receipt task mismatch`);
  assert(receipt.provider_mode === expected.provider_mode, `${label} receipt provider mode mismatch`);
  assert(receipt.output_scope === "run_directory_only", `${label} output scope mismatch`);
  assert(receipt.overwrite_existing_files_allowed === false, `${label} overwrite must be false`);
  assert(receipt.secret_handling.secret_value_read_allowed === false, `${label} secret read allowed must be false`);
  assert(receipt.secret_handling.secret_value_read_performed === false, `${label} secret read performed must be false`);
  assert(receipt.secret_handling.env_file_content_read_performed === false, `${label} env file read must be false`);
  assert(receipt.forbidden_writes.accepted_samples === false, `${label} accepted_samples write must be false`);
  assert(receipt.forbidden_writes.production_candidate === false, `${label} production write must be false`);
  assert(receipt.forbidden_writes.daily_note === false, `${label} DailyNote write must be false`);
  assert(receipt.forbidden_writes.vcp_memory === false, `${label} VCP memory write must be false`);
}

function assertRuntimeResult(result, label, expected) {
  assert(result.kernel_id === "runtime_kernel_v1_real_provider_guarded", `${label} kernel id mismatch`);
  assert(result.version === "v1", `${label} version mismatch`);
  assert(result.contract.contract_id === "runtime_kernel_v1_contract", `${label} contract id mismatch`);
  assert(result.status === expected.status, `${label} status mismatch`);
  assert(result.task_id === expected.task_id, `${label} task id mismatch`);
  assert(result.image_count === expected.image_count, `${label} image_count mismatch`);
  assert(result.calls_used.provider === expected.calls.provider, `${label} provider calls mismatch`);
  assert(result.calls_used.plugin === expected.calls.plugin, `${label} plugin calls mismatch`);
  assert(result.calls_used.api === expected.calls.api, `${label} api calls mismatch`);
  assert(result.audit_receipt_ref.endsWith("/audit_receipt.json"), `${label} audit ref mismatch`);
  assert(result.artifact_record_ref === expected.artifact_record_ref, `${label} artifact ref mismatch`);
  assert(result.review_bridge_ref === expected.review_bridge_ref, `${label} review bridge ref mismatch`);
  assertArtifactRecord(result.artifact_record, label, expected.artifact);
  assertAuditReceipt(result.audit_receipt, label, expected.receipt);
  if (expected.review_bridge_ref) {
    assertCleanBridge(result.review_bridge_entry, label);
  } else {
    assert(result.review_bridge_entry === null, `${label} review bridge must be null`);
  }
}

function buildFakeProviderDelegate() {
  return async function fakeProviderDelegate(request) {
    assert(request.schema === "runtime_v1_provider_delegate_request.v1", "delegate request schema mismatch");
    assert(request.secret_value_read_allowed === false, "delegate request must forbid secret value reads");
    assert(request.output_scope === "run_directory_only", "delegate request scope mismatch");
    return {
      status: "COMPLETED_PROVIDER_IMAGE_CREATED",
      model_sent: request.model_required,
      image_count: 1,
      calls_used: {
        provider: 1,
        plugin: 1,
        api: 1,
      },
      output_files: [
        {
          path: "runs/real_generation/runtime_v1_validator_fake/image/fake-runtime-v1-provider-output.png",
          bytes: 123,
          sha256: "fake-runtime-v1-provider-output-sha256",
          mime_type: "image/png",
          dimensions: "1920x2048"
        }
      ],
      provider_contact_performed: true,
      plugin_call_performed: true,
      api_call_performed: true,
      image_generation_performed: true,
      secret_value_read_performed: false,
      env_file_content_read_performed: false,
      accepted_samples_write_performed: false,
      production_write_performed: false,
      DailyNote_write_performed: false,
      VCP_memory_write_performed: false
    };
  };
}

async function main() {
  assert(fs.existsSync(repoPath(kernelPath)), "kernel v1 file missing");
  assert(fs.existsSync(repoPath(fixturePath)), "runtime v1 fixture missing");
  assert(fs.existsSync(repoPath(realGuardedFixturePath)), "runtime v1 real guarded fixture missing");
  runNode(["--check", kernelPath]);

  const kernel = require(repoPath(kernelPath));
  const fixtureTask = readJson(fixturePath);
  const guardedTask = readJson(realGuardedFixturePath);

  const fixtureResult = await kernel.runRuntimeKernelV1(fixtureTask);
  assertRuntimeResult(fixtureResult, "fixture", {
    status: "completed_fixture_artifact",
    task_id: "runtime-v1-fixture-task-001",
    image_count: 1,
    calls: { provider: 0, plugin: 0, api: 0 },
    artifact_record_ref: "runtime-to-review-v1://runtime_v1_fixture_smoke_001/artifact_record.json",
    review_bridge_ref: "runtime-to-review-v1://runtime_v1_fixture_smoke_001/review_bridge_entry.json",
    artifact: {
      task_id: "runtime-v1-fixture-task-001",
      prompt_package_ref: "prompts/image_generation/neutral_smoke_test_red_apple_v1.yaml",
      provider_route: "no_provider_fixture",
      status: "review_pending",
      review_bridge_ref: "runtime-to-review-v1://runtime_v1_fixture_smoke_001/review_bridge_entry.json",
    },
    receipt: {
      status: "completed_fixture_artifact",
      task_id: "runtime-v1-fixture-task-001",
      provider_mode: "no_provider_fixture",
    },
  });

  const fixtureCliResult = JSON.parse(runNode([kernelPath, "--input", fixturePath]));
  assertRuntimeResult(fixtureCliResult, "fixture cli", {
    status: "completed_fixture_artifact",
    task_id: "runtime-v1-fixture-task-001",
    image_count: 1,
    calls: { provider: 0, plugin: 0, api: 0 },
    artifact_record_ref: "runtime-to-review-v1://runtime_v1_fixture_smoke_001/artifact_record.json",
    review_bridge_ref: "runtime-to-review-v1://runtime_v1_fixture_smoke_001/review_bridge_entry.json",
    artifact: {
      task_id: "runtime-v1-fixture-task-001",
      prompt_package_ref: "prompts/image_generation/neutral_smoke_test_red_apple_v1.yaml",
      provider_route: "no_provider_fixture",
      status: "review_pending",
      review_bridge_ref: "runtime-to-review-v1://runtime_v1_fixture_smoke_001/review_bridge_entry.json",
    },
    receipt: {
      status: "completed_fixture_artifact",
      task_id: "runtime-v1-fixture-task-001",
      provider_mode: "no_provider_fixture",
    },
  });

  const noDelegateResult = await kernel.runRuntimeKernelV1(guardedTask);
  assertRuntimeResult(noDelegateResult, "no delegate", {
    status: "failed_closed",
    task_id: "runtime-v1-real-guarded-task-001",
    image_count: 0,
    calls: { provider: 0, plugin: 0, api: 0 },
    artifact_record_ref: null,
    review_bridge_ref: null,
    artifact: {
      task_id: "runtime-v1-real-guarded-task-001",
      prompt_package_ref: "prompts/image_generation/neutral_smoke_test_red_apple_v1.yaml",
      provider_route: "native_doubao_guarded",
      status: "failed",
      review_bridge_ref: null,
    },
    receipt: {
      status: "failed_closed",
      task_id: "runtime-v1-real-guarded-task-001",
      provider_mode: "real_guarded",
    },
  });
  assert(noDelegateResult.stop_reason === "provider_delegate_not_bound", "real guarded no delegate must fail closed");

  const fakeProviderResult = await kernel.runRuntimeKernelV1(guardedTask, {
    providerDelegate: buildFakeProviderDelegate(),
  });
  assertRuntimeResult(fakeProviderResult, "fake provider", {
    status: "completed_provider_image_created",
    task_id: "runtime-v1-real-guarded-task-001",
    image_count: 1,
    calls: { provider: 1, plugin: 1, api: 1 },
    artifact_record_ref: "runtime-to-review-v1://runtime_v1_real_guarded_smoke_001/artifact_record.json",
    review_bridge_ref: "runtime-to-review-v1://runtime_v1_real_guarded_smoke_001/review_bridge_entry.json",
    artifact: {
      task_id: "runtime-v1-real-guarded-task-001",
      prompt_package_ref: "prompts/image_generation/neutral_smoke_test_red_apple_v1.yaml",
      provider_route: "native_doubao_guarded",
      status: "review_pending",
      review_bridge_ref: "runtime-to-review-v1://runtime_v1_real_guarded_smoke_001/review_bridge_entry.json",
    },
    receipt: {
      status: "completed_provider_image_created",
      task_id: "runtime-v1-real-guarded-task-001",
      provider_mode: "real_guarded",
    },
  });

  const badModelResult = await kernel.runRuntimeKernelV1(guardedTask, {
    providerDelegate: async () => ({
      status: "COMPLETED_PROVIDER_IMAGE_CREATED",
      model_sent: "wrong-model",
      image_count: 1,
      calls_used: { provider: 1, plugin: 1, api: 1 },
      output_files: [
        {
          path: "runs/real_generation/runtime_v1_validator_fake/image/bad-model.png",
          sha256: "bad-model-sha256",
          mime_type: "image/png",
          dimensions: "1920x2048"
        }
      ],
      provider_contact_performed: true,
      plugin_call_performed: true,
      api_call_performed: true,
      image_generation_performed: true
    }),
  });
  assert(badModelResult.status === "failed_closed", "bad delegate model must fail closed");
  assert(badModelResult.stop_reason === "provider_delegate_result_invalid", "bad delegate stop reason mismatch");

  const invalidInputResult = await kernel.runRuntimeKernelV1({
    ...fixtureTask,
    task_id: "runtime-v1-invalid-max-images",
    max_images: 2,
  });
  assert(invalidInputResult.status === "failed_closed", "invalid max_images must fail closed");
  assert(invalidInputResult.stop_reason === "input_validation_failed", "invalid input stop reason mismatch");

  console.log(JSON.stringify({
    passed: true,
    validator: "validate_runtime_kernel_v1_real_provider_guarded",
    kernel_id: "runtime_kernel_v1_real_provider_guarded",
    contract_id: "runtime_kernel_v1_contract",
    fixture_status: fixtureResult.status,
    no_delegate_status: noDelegateResult.status,
    fake_provider_status: fakeProviderResult.status,
    bad_model_failed_closed: true,
    invalid_input_failed_closed: true,
    artifact_record_schema_verified: true,
    audit_receipt_schema_verified: true,
    review_bridge_real_entry_metadata_only_verified: true,
    provider_delegate_default_bound: false,
    real_provider_call_performed_by_validator: false,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    secret_value_read_performed: false,
    env_file_content_read_performed: false,
    production_write_performed: false,
    accepted_samples_write_performed: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false
  }, null, 2));
}

main().catch((error) => {
  console.error(JSON.stringify({
    passed: false,
    validator: "validate_runtime_kernel_v1_real_provider_guarded",
    error: error.message,
  }, null, 2));
  process.exitCode = 1;
});
