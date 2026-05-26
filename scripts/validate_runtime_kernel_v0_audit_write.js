#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const kernelPath = "kernel/runtime_kernel_v0.js";
const greenFixturePath = "tests/fixtures/runtime_kernel_v0_green_task.fixture.json";
const redFixturePath = "tests/fixtures/runtime_kernel_v0_red_task.fixture.json";
const auditRoot = ".agent_private/runtime_kernel_v0/audits";
const greenAuditPath = `${auditRoot}/runtime_kernel_v0_green_audit_write.actual.json`;
const redAuditPath = `${auditRoot}/runtime_kernel_v0_red_audit_write.actual.json`;
const forbiddenAuditPath = "tests/fixtures/runtime_kernel_v0_forbidden_audit_write.actual.json";
const traversalAuditPath = `${auditRoot}/../runtime_kernel_v0_traversal_audit_write.actual.json`;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function repoPath(relativePath) {
  const resolved = path.resolve(root, relativePath);
  const relative = path.relative(root, resolved);
  assert(!relative.startsWith("..") && !path.isAbsolute(relative), `Path escapes repository: ${relativePath}`);
  return resolved;
}

function run(command, args, options = {}) {
  return execFileSync(command, args, {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    ...options,
  });
}

function runNode(args) {
  return run("node", args);
}

function assertGitIgnored(relativePath) {
  const output = run("git", ["check-ignore", "--verbose", "--", relativePath]).trim();
  assert(output.includes("/.agent_private/") || output.includes(".agent_private"), `${relativePath} must be ignored by .gitignore`);
  return output;
}

function safeUnlinkAudit(relativePath) {
  assert(relativePath.startsWith(`${auditRoot}/`), `Refusing to remove outside audit root: ${relativePath}`);
  assert(relativePath.endsWith(".json"), `Refusing to remove non-json audit file: ${relativePath}`);
  const target = repoPath(relativePath);
  if (fs.existsSync(target)) {
    fs.unlinkSync(target);
  }
}

function tryRemoveEmptyAuditDirs() {
  for (const relativePath of [auditRoot, ".agent_private/runtime_kernel_v0"]) {
    try {
      fs.rmdirSync(repoPath(relativePath));
    } catch {
      // The directory may pre-exist or contain unrelated ignored files.
    }
  }
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(repoPath(relativePath), "utf8"));
}

function assertCleanFlags(flags, label) {
  const dirty = Object.entries(flags || {}).filter(([, value]) => value !== false);
  assert(dirty.length === 0, `${label} side effects must all be false: ${dirty.map(([key]) => key).join(", ")}`);
}

function assertContract(contract, label) {
  assert(contract.contract_id === "runtime_kernel_v0_contract", `${label} contract id mismatch`);
  assert(contract.contract_version === "v0.1", `${label} contract version mismatch`);
  assert(contract.kernel_id === "runtime_kernel_v0_no_provider", `${label} contract kernel id mismatch`);
  assert(contract.adapter_slots.artifact_adapter.output_ref === "persistence.persisted_ref", `${label} artifact adapter output ref mismatch`);
  assert(contract.adapter_slots.review_bridge.input_ref === "review", `${label} review bridge input ref mismatch`);
  assert(contract.adapter_slots.provider_adapter.calls_allowed_now === false, `${label} provider adapter calls must be false`);
  assert(contract.audit_write.allowed_output_root === auditRoot, `${label} audit output root mismatch`);
  assert(contract.audit_write.overwrite_existing_allowed === false, `${label} audit overwrite must be false`);
  assert(contract.side_effect_policy.allowed_local_side_effects.includes("audit_write_performed"), `${label} allowed audit write side effect missing`);
}

function assertAuditPayload(payload, expected) {
  assert(payload.audit_write_schema === "runtime_kernel_v0.audit_write.v0", `${expected.label} schema mismatch`);
  assert(payload.audit_output_path === expected.path, `${expected.label} output path mismatch`);
  assert(payload.kernel_id === "runtime_kernel_v0_no_provider", `${expected.label} kernel id mismatch`);
  assert(payload.version === "v0", `${expected.label} version mismatch`);
  assertContract(payload.contract, `${expected.label} payload`);
  assert(payload.task_id === expected.taskId, `${expected.label} task id mismatch`);
  assert(payload.final_state === expected.finalState, `${expected.label} final state mismatch`);
  assert(payload.audit_record.final_state === expected.finalState, `${expected.label} audit final state mismatch`);
  assert(payload.audit_record.executor_ran === expected.executorRan, `${expected.label} executor flag mismatch`);
  assert(JSON.stringify(payload.transition.path) === JSON.stringify(expected.pathStates), `${expected.label} transition path mismatch`);
  assertCleanFlags(payload.side_effect_flags, `${expected.label} payload`);
  assertCleanFlags(payload.audit_record.side_effect_flags, `${expected.label} audit`);
  assert(payload.side_effect_flags.forbidden_disk_write_performed === false, `${expected.label} forbidden disk write must be false`);
  assert(payload.audit_record.side_effect_flags.forbidden_disk_write_performed === false, `${expected.label} audit forbidden disk write must be false`);
  assert(payload.side_effect_flags.disk_write_performed === undefined, `${expected.label} legacy disk_write_performed must not appear in side_effect_flags`);
  assert(payload.audit_record.side_effect_flags.disk_write_performed === undefined, `${expected.label} legacy disk_write_performed must not appear in audit side_effect_flags`);
  assert(payload.allowed_local_side_effects.audit_write_performed === true, `${expected.label} allowed audit write must be true`);
  assert(payload.allowed_local_side_effects.disk_write_kind === "local_ignored_audit_record", `${expected.label} allowed disk write kind mismatch`);
  assert(payload.allowed_local_side_effects.audit_output_path === expected.path, `${expected.label} allowed audit output path mismatch`);
  assert(payload.audit_write_performed === true, `${expected.label} audit_write_performed must be true`);
  assert(payload.disk_write_kind === "local_ignored_audit_record", `${expected.label} disk_write_kind mismatch`);
  assert(payload.forbidden_disk_write_performed === false, `${expected.label} forbidden_disk_write_performed must be false`);
  assert(payload.provider_contact_performed === false, `${expected.label} provider contact must be false`);
  assert(payload.plugin_call_performed === false, `${expected.label} plugin call must be false`);
  assert(payload.api_call_performed === false, `${expected.label} api call must be false`);
  assert(payload.image_generation_performed === false, `${expected.label} image generation must be false`);
  assert(payload.production_write_performed === false, `${expected.label} production write must be false`);
  assert(payload.secret_value_read_performed === false, `${expected.label} secret read must be false`);
}

function assertCliAuditWrite(result, expected) {
  assert(result.audit_write.performed === true, `${expected.label} audit write must be performed`);
  assertContract(result.contract, `${expected.label} cli`);
  assert(result.audit_write.path === expected.path, `${expected.label} audit write path mismatch`);
  assert(result.audit_write.final_state === expected.finalState, `${expected.label} audit write final state mismatch`);
  assert(result.audit_write.git_ignored_required === true, `${expected.label} audit write must require git ignore`);
  assert(result.audit_write.audit_write_performed === true, `${expected.label} audit_write_performed must be true`);
  assert(result.audit_write.disk_write_kind === "local_ignored_audit_record", `${expected.label} disk_write_kind mismatch`);
  assert(result.audit_write.forbidden_disk_write_performed === false, `${expected.label} forbidden_disk_write_performed must be false`);
  assert(result.audit_write.provider_contact_performed === false, `${expected.label} audit write provider contact must be false`);
  assert(result.audit_write.image_generation_performed === false, `${expected.label} audit write image generation must be false`);
  assert(result.audit_write.production_write_performed === false, `${expected.label} audit write production write must be false`);
}

function assertForbiddenAuditPathRejected() {
  assert(!fs.existsSync(repoPath(forbiddenAuditPath)), "forbidden audit test target unexpectedly exists before validation");
  let rejected = false;
  try {
    runNode([kernelPath, "--input", greenFixturePath, "--audit-output", forbiddenAuditPath]);
  } catch (error) {
    rejected = true;
    const stderr = String(error.stderr || "");
    assert(stderr.includes("--audit-output must be under"), "forbidden audit path rejection reason mismatch");
  }
  assert(rejected, "forbidden audit output path must be rejected");
  assert(!fs.existsSync(repoPath(forbiddenAuditPath)), "forbidden audit path must not be written");
}

function assertTraversalAuditPathRejected() {
  let rejected = false;
  try {
    runNode([kernelPath, "--input", greenFixturePath, "--audit-output", traversalAuditPath]);
  } catch (error) {
    rejected = true;
    const stderr = String(error.stderr || "");
    assert(stderr.includes("must not contain traversal segments"), "traversal audit path rejection reason mismatch");
  }
  assert(rejected, "traversal audit output path must be rejected");
}

function main() {
  assert(fs.existsSync(repoPath(kernelPath)), "kernel file missing");
  assert(fs.existsSync(repoPath(greenFixturePath)), "green fixture missing");
  assert(fs.existsSync(repoPath(redFixturePath)), "red fixture missing");

  safeUnlinkAudit(greenAuditPath);
  safeUnlinkAudit(redAuditPath);

  const ignoreEvidence = assertGitIgnored(`${auditRoot}/probe.json`);
  runNode(["--check", kernelPath]);

  const greenCli = JSON.parse(runNode([kernelPath, "--input", greenFixturePath, "--audit-output", greenAuditPath]));
  const greenPayload = readJson(greenAuditPath);
  const greenExpected = {
    label: "green",
    path: greenAuditPath,
    taskId: "runtime-v0-green-task-001",
    finalState: "completed_stub",
    executorRan: true,
    pathStates: ["queued", "gated", "executed_stub", "artifact_recorded", "review_pending", "completed_stub"],
  };
  assertCliAuditWrite(greenCli, greenExpected);
  assertAuditPayload(greenPayload, greenExpected);

  const redCli = JSON.parse(runNode([kernelPath, "--input", redFixturePath, "--audit-output", redAuditPath]));
  const redPayload = readJson(redAuditPath);
  const redExpected = {
    label: "red",
    path: redAuditPath,
    taskId: "runtime-v0-red-task-001",
    finalState: "blocked_red",
    executorRan: false,
    pathStates: ["queued", "blocked_red"],
  };
  assertCliAuditWrite(redCli, redExpected);
  assertAuditPayload(redPayload, redExpected);

  assertForbiddenAuditPathRejected();
  assertTraversalAuditPathRejected();

  safeUnlinkAudit(greenAuditPath);
  safeUnlinkAudit(redAuditPath);
  tryRemoveEmptyAuditDirs();

  const greenRemoved = !fs.existsSync(repoPath(greenAuditPath));
  const redRemoved = !fs.existsSync(repoPath(redAuditPath));
  assert(greenRemoved, "green audit output must be cleaned");
  assert(redRemoved, "red audit output must be cleaned");

  console.log(JSON.stringify({
    passed: true,
    validator: "validate_runtime_kernel_v0_audit_write",
    contract_id: greenPayload.contract.contract_id,
    contract_version: greenPayload.contract.contract_version,
    audit_directory: `${auditRoot}/`,
    audit_path_ignored: true,
    audit_ignore_evidence: ignoreEvidence,
    green_audit: {
      output_path: greenAuditPath,
      final_state: greenPayload.final_state,
      executor_ran: greenPayload.audit_record.executor_ran,
      side_effect_flags_clean: true,
      audit_write_performed: true,
      disk_write_kind: "local_ignored_audit_record",
      forbidden_disk_write_performed: false,
    },
    red_audit: {
      output_path: redAuditPath,
      final_state: redPayload.final_state,
      executor_ran: redPayload.audit_record.executor_ran,
      side_effect_flags_clean: true,
      audit_write_performed: true,
      disk_write_kind: "local_ignored_audit_record",
      forbidden_disk_write_performed: false,
    },
    forbidden_audit_path_rejected: true,
    traversal_audit_path_rejected: true,
    cleanup: {
      green_audit_file_removed: greenRemoved,
      red_audit_file_removed: redRemoved,
    },
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    production_write_performed: false,
    secret_value_read_performed: false,
  }, null, 2));
}

try {
  main();
} catch (error) {
  console.error(JSON.stringify({
    passed: false,
    validator: "validate_runtime_kernel_v0_audit_write",
    error: error.message,
  }, null, 2));
  process.exitCode = 1;
}
