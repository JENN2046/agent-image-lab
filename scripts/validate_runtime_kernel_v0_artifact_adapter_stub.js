#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const adapterPath = "adapters/runtime/artifact_adapter_stub.js";
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
  return execFileSync("node", args, { cwd: root, encoding: "utf8" });
}

function assertArtifactAdapterStub(result, label) {
  assert(result.contract.contract_version === "v0.2", `${label} contract version mismatch`);
  assert(result.contract.adapter_slots.artifact_adapter.status === "stub_available", `${label} artifact adapter slot must be stub_available`);
  assert(result.contract.adapter_slots.artifact_adapter.writes_allowed_now === false, `${label} artifact adapter writes must be false`);
  assert(result.artifact_adapter.state === "artifact_adapter_stubbed", `${label} artifact adapter state mismatch`);
  assert(result.artifact_adapter.adapter_id === "artifact_adapter_stub_v0", `${label} adapter id mismatch`);
  assert(result.artifact_adapter.adapter_contract === "runtime_kernel_v0_contract.artifact_adapter.v0", `${label} adapter contract mismatch`);
  assert(result.artifact_adapter.input_ref === "persistence.artifact_record", `${label} adapter input ref mismatch`);
  assert(result.artifact_adapter.output_ref === `adapter://${result.task_id}/artifact_adapter_stub`, `${label} adapter output ref mismatch`);
  assert(result.artifact_adapter.writes_allowed_now === false, `${label} writes_allowed_now must be false`);
  assert(result.artifact_adapter.disk_write_performed === false, `${label} disk write must be false`);
  assert(result.artifact_adapter.production_write_performed === false, `${label} production write must be false`);
  assert(result.artifact_adapter.provider_contact_performed === false, `${label} provider contact must be false`);
  assert(result.artifact_adapter.image_generation_performed === false, `${label} image generation must be false`);

  const handoff = result.artifact_adapter.handoff_record;
  assert(handoff.handoff_id === `${result.task_id}:artifact_adapter_stub:v0`, `${label} handoff id mismatch`);
  assert(handoff.task_id === result.task_id, `${label} handoff task id mismatch`);
  assert(handoff.artifact_id === result.persistence.artifact_record.artifact_id, `${label} handoff artifact id mismatch`);
  assert(handoff.artifact_kind === result.persistence.artifact_record.artifact_kind, `${label} handoff artifact kind mismatch`);
  assert(handoff.persisted_ref === result.persistence.persisted_ref, `${label} handoff persisted ref mismatch`);
  assert(handoff.persisted_hash === result.persistence.persisted_hash, `${label} handoff hash mismatch`);
  assert(handoff.next_allowed_adapter === "review_bridge_readonly_stub", `${label} next adapter mismatch`);
  assert(handoff.real_artifact_write_allowed_now === false, `${label} real artifact write must be false`);
  assert(result.transition.path.includes("artifact_adapter_stubbed"), `${label} transition must include artifact adapter`);
  assert(result.audit_record.next_adapter_slots.artifact_adapter === "stub_available", `${label} audit adapter slot mismatch`);
}

function main() {
  assert(fs.existsSync(repoPath(adapterPath)), "artifact adapter stub file missing");
  assert(fs.existsSync(repoPath(kernelPath)), "kernel file missing");
  runNode(["--check", adapterPath]);
  runNode(["--check", kernelPath]);

  const adapter = require(repoPath(adapterPath));
  assert(typeof adapter.buildArtifactAdapterStub === "function", "buildArtifactAdapterStub export missing");

  const kernel = require(repoPath(kernelPath));
  const greenResult = kernel.runRuntimeKernelV0(readJson(greenFixturePath));
  assertArtifactAdapterStub(greenResult, "green direct");

  const greenCliResult = JSON.parse(runNode([kernelPath, "--input", greenFixturePath]));
  assertArtifactAdapterStub(greenCliResult, "green cli");

  const redResult = kernel.runRuntimeKernelV0(readJson(redFixturePath));
  assert(redResult.final_state === "blocked_red", "red final state mismatch");
  assert(redResult.artifact_adapter === undefined, "red task must not run artifact adapter");

  console.log(JSON.stringify({
    passed: true,
    validator: "validate_runtime_kernel_v0_artifact_adapter_stub",
    adapter_id: greenResult.artifact_adapter.adapter_id,
    adapter_state: greenResult.artifact_adapter.state,
    contract_version: greenResult.contract.contract_version,
    handoff_record_created: true,
    real_artifact_write_allowed_now: false,
    disk_write_performed: false,
    provider_contact_performed: false,
    image_generation_performed: false,
    production_write_performed: false,
    red_artifact_adapter_ran: false,
  }, null, 2));
}

try {
  main();
} catch (error) {
  console.error(JSON.stringify({
    passed: false,
    validator: "validate_runtime_kernel_v0_artifact_adapter_stub",
    error: error.message,
  }, null, 2));
  process.exitCode = 1;
}
