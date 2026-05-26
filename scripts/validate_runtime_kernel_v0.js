#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const greenFixturePath = "tests/fixtures/runtime_kernel_v0_green_task.fixture.json";
const redFixturePath = "tests/fixtures/runtime_kernel_v0_red_task.fixture.json";
const kernelPath = "kernel/runtime_kernel_v0.js";

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

function assertCleanSideEffects(flags, label) {
  const dirty = Object.entries(flags || {}).filter(([, value]) => value !== false);
  assert(dirty.length === 0, `${label} side effects must all be false: ${dirty.map(([key]) => key).join(", ")}`);
}

function validateGreenAudit(result, label) {
  assert(result.kernel_id === "runtime_kernel_v0_no_provider", `${label} kernel id mismatch`);
  assert(result.version === "v0", `${label} version mismatch`);
  assert(result.task_id === "runtime-v0-green-task-001", `${label} task id mismatch`);
  assert(result.final_state === "completed_stub", `${label} final state must be completed_stub`);
  assert(result.intake.state === "queued", `${label} intake state mismatch`);
  assert(result.policy.state === "gated", `${label} policy state mismatch`);
  assert(result.policy.passed === true, `${label} policy must pass`);
  assert(result.execution.state === "executed_stub", `${label} execution state mismatch`);
  assert(result.execution.executor_id === "local_no_provider_executor_stub_v0", `${label} executor id mismatch`);
  assert(result.execution.output.provider_contact_performed === false, `${label} provider contact must be false`);
  assert(result.execution.output.image_generation_performed === false, `${label} image generation must be false`);
  assert(result.persistence.state === "artifact_recorded", `${label} persistence state mismatch`);
  assert(result.persistence.persistence_id === "artifact_persistence_stub_v0", `${label} persistence id mismatch`);
  assert(result.persistence.persisted_ref === "memory://runtime-v0-green-task-001/artifact/fixture", `${label} persisted ref mismatch`);
  assert(result.persistence.disk_write_performed === false, `${label} disk write must be false`);
  assert(result.review.state === "review_pending", `${label} review state mismatch`);
  assert(result.review.review_decision === "stub_review_pending", `${label} review decision mismatch`);
  assert(result.transition.state === "completed_stub", `${label} transition final state mismatch`);
  assert(JSON.stringify(result.transition.path) === JSON.stringify([
    "queued",
    "gated",
    "executed_stub",
    "artifact_recorded",
    "review_pending",
    "completed_stub",
  ]), `${label} transition path mismatch`);
  assert(result.audit_record.final_state === "completed_stub", `${label} audit final state mismatch`);
  assert(result.audit_record.blocked_red === false, `${label} audit must not be blocked red`);
  assert(result.audit_record.executor_ran === true, `${label} audit must record executor ran`);
  assert(result.audit_record.kernel_components.length === 7, `${label} audit must include seven kernel components`);
  [
    "task_intake",
    "policy_gate",
    "executor_interface",
    "artifact_persistence",
    "review_gate",
    "state_transition",
    "audit_record",
  ].forEach((component) => {
    assert(result.audit_record.kernel_components.includes(component), `${label} missing component ${component}`);
  });
  assertCleanSideEffects(result.audit_record.side_effect_flags, label);
  assert(result.audit_record.side_effect_flags.forbidden_disk_write_performed === false, `${label} forbidden disk write must be false`);
  assert(result.audit_record.side_effect_flags.disk_write_performed === undefined, `${label} legacy disk_write_performed must not appear in audit side_effect_flags`);
}

function validateRedAudit(result) {
  assert(result.kernel_id === "runtime_kernel_v0_no_provider", "red kernel id mismatch");
  assert(result.task_id === "runtime-v0-red-task-001", "red task id mismatch");
  assert(result.final_state === "blocked_red", "red final state must be blocked_red");
  assert(result.intake.state === "queued", "red intake state mismatch");
  assert(result.policy.state === "blocked_red", "red policy state mismatch");
  assert(result.policy.passed === false, "red policy must fail");
  assert(result.policy.blocked_reasons.some((reason) => reason.includes("provider_contact")), "red block reason must mention provider_contact");
  assert(result.execution === undefined, "red task must not execute executor");
  assert(result.persistence === undefined, "red task must not persist artifact");
  assert(result.review === undefined, "red task must not run review gate");
  assert(JSON.stringify(result.transition.path) === JSON.stringify(["queued", "blocked_red"]), "red transition path mismatch");
  assert(result.audit_record.final_state === "blocked_red", "red audit final state mismatch");
  assert(result.audit_record.blocked_red === true, "red audit must mark blocked red");
  assert(result.audit_record.executor_ran === false, "red audit must record executor did not run");
  assertCleanSideEffects(result.audit_record.side_effect_flags, "red");
  assert(result.audit_record.side_effect_flags.forbidden_disk_write_performed === false, "red forbidden disk write must be false");
  assert(result.audit_record.side_effect_flags.disk_write_performed === undefined, "red legacy disk_write_performed must not appear in audit side_effect_flags");
}

function main() {
  assert(fs.existsSync(repoPath(kernelPath)), "kernel file missing");
  assert(fs.existsSync(repoPath(greenFixturePath)), "green fixture missing");
  assert(fs.existsSync(repoPath(redFixturePath)), "red fixture missing");

  runNode(["--check", kernelPath]);
  const kernel = require(repoPath(kernelPath));

  const greenTask = readJson(greenFixturePath);
  const redTask = readJson(redFixturePath);

  const greenResult = kernel.runRuntimeKernelV0(greenTask);
  validateGreenAudit(greenResult, "green direct");

  const greenCliResult = JSON.parse(runNode([kernelPath, "--input", greenFixturePath]));
  validateGreenAudit(greenCliResult, "green cli");

  const redResult = kernel.runRuntimeKernelV0(redTask);
  validateRedAudit(redResult);

  const redCliResult = JSON.parse(runNode([kernelPath, "--input", redFixturePath]));
  validateRedAudit(redCliResult);

  console.log(JSON.stringify({
    passed: true,
    validator: "validate_runtime_kernel_v0",
    kernel_id: "runtime_kernel_v0_no_provider",
    green_fixture: greenFixturePath,
    red_fixture: redFixturePath,
    green_final_state: greenResult.final_state,
    green_transition_path: greenResult.transition.path,
    red_final_state: redResult.final_state,
    red_transition_path: redResult.transition.path,
    red_executor_ran: redResult.audit_record.executor_ran,
    provider_contact_performed: false,
    image_generation_performed: false,
    forbidden_disk_write_performed: false,
    production_write_performed: false,
  }, null, 2));
}

try {
  main();
} catch (error) {
  console.error(JSON.stringify({
    passed: false,
    validator: "validate_runtime_kernel_v0",
    error: error.message,
  }, null, 2));
  process.exitCode = 1;
}
