#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { buildArtifactAdapterStub } = require("../adapters/runtime/artifact_adapter_stub");

const repoRoot = path.resolve(__dirname, "..");
const defaultInputPath = "tests/fixtures/runtime_kernel_v0_green_task.fixture.json";
const auditOutputRoot = ".agent_private/runtime_kernel_v0/audits";
const kernelId = "runtime_kernel_v0_no_provider";
const contractId = "runtime_kernel_v0_contract";
const contractVersion = "v0.2";

const sideEffectFlags = Object.freeze({
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  image_generation_performed: false,
  forbidden_disk_write_performed: false,
  production_write_performed: false,
  secret_value_read_performed: false,
  env_file_content_read_performed: false,
  push_tag_release_deploy_performed: false,
});

const kernelComponents = Object.freeze([
  "task_intake",
  "policy_gate",
  "executor_interface",
  "artifact_persistence",
  "artifact_adapter_stub",
  "review_gate",
  "state_transition",
  "audit_record",
]);

const runtimeContract = Object.freeze({
  contract_id: contractId,
  contract_version: contractVersion,
  kernel_id: kernelId,
  task_input: {
    task_type: "fixture.visual_generation.no_provider.v0",
    required_root_fields: ["task_id", "task_type", "input", "policy", "review"],
    required_input_fields: ["prompt_ref", "fixture_asset_ref", "artifact_capsule_plan"],
    required_policy_allowed_capabilities: ["local_fixture_execution", "in_memory_artifact_persistence"],
    blocked_capability_classes: [
      "provider_contact",
      "plugin_call",
      "api_call",
      "image_generation",
      "production_write",
      "disk_write",
    ],
    required_review_stub_decision: "mark_review_pending",
  },
  output_envelope: {
    required_root_fields: [
      "kernel_id",
      "version",
      "contract",
      "task_id",
      "final_state",
      "intake",
      "policy",
      "transition",
      "audit_record",
    ],
    green_required_fields: ["execution", "persistence", "artifact_adapter", "review"],
    red_forbidden_fields: ["execution", "persistence", "artifact_adapter", "review"],
    terminal_states: ["completed_stub", "blocked_red"],
  },
  adapter_slots: {
    artifact_adapter: {
      status: "stub_available",
      input_ref: "persistence.artifact_record",
      output_ref: "artifact_adapter.handoff_record",
      writes_allowed_now: false,
      adapter_id: "artifact_adapter_stub_v0",
    },
    review_bridge: {
      status: "planned_next_adapter",
      input_ref: "review",
      output_ref: "review.review_decision",
      writes_allowed_now: false,
    },
    provider_adapter: {
      status: "blocked_until_explicit_provider_phase",
      input_ref: "execution.output.provider_output_ref",
      calls_allowed_now: false,
    },
  },
  audit_write: {
    optional_cli_flag: "--audit-output",
    payload_schema: "runtime_kernel_v0.audit_write.v0",
    allowed_output_root: auditOutputRoot,
    git_ignored_required: true,
    overwrite_existing_allowed: false,
  },
  side_effect_policy: {
    forbidden_flags: Object.keys(sideEffectFlags),
    allowed_local_side_effects: ["audit_write_performed"],
    provider_contact_allowed_now: false,
    image_generation_allowed_now: false,
    production_write_allowed_now: false,
  },
});

function getRuntimeContract() {
  return clone(runtimeContract);
}

function assertObject(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${label} must be an object`);
  }
}

function assertString(value, label) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${label} must be a non-empty string`);
  }
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function stableHash(value) {
  const text = JSON.stringify(value);
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `fnv1a32:${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

function intakeTask(rawTask) {
  assertObject(rawTask, "task");
  assertString(rawTask.task_id, "task.task_id");
  assertString(rawTask.task_type, "task.task_type");
  assertObject(rawTask.input, "task.input");
  assertObject(rawTask.policy, "task.policy");
  assertObject(rawTask.review, "task.review");

  if (rawTask.task_type !== "fixture.visual_generation.no_provider.v0") {
    throw new Error("task.task_type must be fixture.visual_generation.no_provider.v0");
  }

  return {
    accepted: true,
    state: "queued",
    task: clone(rawTask),
  };
}

function policyGate(intake) {
  const task = intake.task;
  const policy = task.policy;
  const requested = Array.isArray(policy.requested_capabilities) ? policy.requested_capabilities : [];
  const forbidden = Array.isArray(policy.forbidden_capabilities) ? policy.forbidden_capabilities : [];
  const allowed = Array.isArray(policy.allowed_capabilities) ? policy.allowed_capabilities : [];

  const blockedRequests = requested.filter((capability) => forbidden.includes(capability));
  const providerLikeRequests = requested.filter((capability) =>
    ["provider_contact", "plugin_call", "api_call", "image_generation", "production_write", "disk_write"].includes(capability)
  );
  const missingAllowed = ["local_fixture_execution", "in_memory_artifact_persistence"].filter(
    (capability) => !allowed.includes(capability)
  );

  const passed = blockedRequests.length === 0 && providerLikeRequests.length === 0 && missingAllowed.length === 0;
  return {
    passed,
    state: passed ? "gated" : "blocked_red",
    blocked_reasons: [
      ...blockedRequests.map((capability) => `requested_forbidden_capability:${capability}`),
      ...providerLikeRequests.map((capability) => `provider_side_effect_capability_blocked:${capability}`),
      ...missingAllowed.map((capability) => `missing_allowed_capability:${capability}`),
    ],
    allowed_capabilities: allowed,
    forbidden_capabilities: forbidden,
  };
}

function executeNoProviderFixture(task) {
  const input = task.input;
  assertString(input.prompt_ref, "task.input.prompt_ref");
  assertString(input.fixture_asset_ref, "task.input.fixture_asset_ref");
  assertObject(input.artifact_capsule_plan, "task.input.artifact_capsule_plan");

  return {
    state: "executed_stub",
    executor_id: "local_no_provider_executor_stub_v0",
    output: {
      artifact_id: `${task.task_id}:artifact:fixture`,
      artifact_kind: "fixture_visual_artifact_reference",
      prompt_ref: input.prompt_ref,
      fixture_asset_ref: input.fixture_asset_ref,
      capsule_plan: clone(input.artifact_capsule_plan),
      provider_output_ref: null,
      provider_contact_performed: false,
      image_generation_performed: false,
    },
  };
}

function persistArtifactInMemory(task, execution) {
  const persistedRef = `memory://${task.task_id}/artifact/fixture`;
  return {
    state: "artifact_recorded",
    persistence_id: "artifact_persistence_stub_v0",
    persisted_ref: persistedRef,
    persisted_hash: stableHash(execution.output),
    disk_write_performed: false,
    artifact_record: clone(execution.output),
  };
}

function reviewGate(task, persisted) {
  const review = task.review;
  const decision = review.stub_decision;
  if (decision !== "mark_review_pending") {
    throw new Error("task.review.stub_decision must be mark_review_pending");
  }
  return {
    state: "review_pending",
    review_decision: "stub_review_pending",
    completed_by_stub: true,
    reviewer_ref: review.reviewer_ref || "local_fixture_reviewer",
    artifact_ref: persisted.persisted_ref,
  };
}

function stateTransition(states) {
  const terminalState = "completed_stub";
  return {
    state: terminalState,
    path: [
      states.intake.state,
      states.policy.state,
      states.execution?.state,
      states.persistence?.state,
      states.artifactAdapter?.state,
      states.review.state,
      terminalState,
    ].filter(Boolean),
  };
}

function buildAuditRecord(task, states) {
  const finalState = states.transition.state;
  return {
    audit_id: `${task.task_id}:audit:v0`,
    task_id: task.task_id,
    kernel_id: kernelId,
    contract_id: contractId,
    contract_version: contractVersion,
    kernel_components: [...kernelComponents],
    state_path: states.transition.path,
    final_state: finalState,
    blocked_red: finalState === "blocked_red",
    executor_ran: Boolean(states.execution),
    side_effect_flags: { ...sideEffectFlags },
    next_adapter_slots: {
      artifact_adapter: states.artifactAdapter ? "stub_available" : "not_run",
      review_bridge: "planned_next_adapter",
      provider: "blocked_until_explicit_provider_phase",
    },
  };
}

function runRuntimeKernelV0(rawTask) {
  const intake = intakeTask(rawTask);
  const policy = policyGate(intake);

  if (!policy.passed) {
    const transition = {
      state: "blocked_red",
      path: [intake.state, policy.state],
    };
    return {
      kernel_id: kernelId,
      version: "v0",
      contract: getRuntimeContract(),
      task_id: intake.task.task_id,
      final_state: "blocked_red",
      intake,
      policy,
      transition,
      audit_record: buildAuditRecord(intake.task, {
        intake,
        policy,
        review: { state: "review_skipped" },
        transition,
      }),
    };
  }

  const execution = executeNoProviderFixture(intake.task);
  const persistence = persistArtifactInMemory(intake.task, execution);
  const artifactAdapter = buildArtifactAdapterStub(intake.task, persistence);
  const review = reviewGate(intake.task, persistence);
  const transition = stateTransition({ intake, policy, execution, persistence, artifactAdapter, review });
  const auditRecord = buildAuditRecord(intake.task, { intake, policy, execution, persistence, artifactAdapter, review, transition });

  return {
    kernel_id: kernelId,
    version: "v0",
    contract: getRuntimeContract(),
    task_id: intake.task.task_id,
    final_state: transition.state,
    intake,
    policy,
    execution,
    persistence,
    artifact_adapter: artifactAdapter,
    review,
    transition,
    audit_record: auditRecord,
  };
}

function normalizeRepoRelativePath(value, label) {
  assertString(value, label);
  if (path.isAbsolute(value)) {
    throw new Error(`${label} must be a repository-relative path`);
  }
  const normalized = value.replace(/\\/g, "/");
  if (normalized.split("/").includes("..")) {
    throw new Error(`${label} must not contain traversal segments`);
  }
  const resolved = path.resolve(repoRoot, normalized);
  const relative = path.relative(repoRoot, resolved).replace(/\\/g, "/");
  if (relative.startsWith("../") || relative === ".." || path.isAbsolute(relative)) {
    throw new Error(`${label} escapes repository root`);
  }
  return {
    normalized: relative,
    resolved,
  };
}

function resolveInputPath(argv) {
  const inputIndex = argv.indexOf("--input");
  const inputPath = inputIndex >= 0 ? argv[inputIndex + 1] : defaultInputPath;
  const { normalized, resolved } = normalizeRepoRelativePath(inputPath, "--input");
  if (!normalized.startsWith("tests/fixtures/")) {
    throw new Error("--input must be a repository-relative path under tests/fixtures/");
  }
  return resolved;
}

function resolveAuditOutputPath(argv) {
  const outputIndex = argv.indexOf("--audit-output");
  if (outputIndex < 0) {
    return null;
  }
  const outputPath = argv[outputIndex + 1];
  const { normalized, resolved } = normalizeRepoRelativePath(outputPath, "--audit-output");
  const allowedPrefix = `${auditOutputRoot}/`;
  if (!normalized.startsWith(allowedPrefix)) {
    throw new Error(`--audit-output must be under ${auditOutputRoot}/`);
  }
  if (!normalized.endsWith(".json")) {
    throw new Error("--audit-output must end with .json");
  }
  return {
    normalized,
    resolved,
  };
}

function buildAuditWritePayload(result, outputPath) {
  return {
    audit_write_schema: "runtime_kernel_v0.audit_write.v0",
    audit_output_path: outputPath,
    kernel_id: result.kernel_id,
    version: result.version,
    contract: clone(result.contract),
    task_id: result.task_id,
    final_state: result.final_state,
    transition: clone(result.transition),
    policy: clone(result.policy),
    audit_record: clone(result.audit_record),
    side_effect_flags: { ...sideEffectFlags },
    allowed_local_side_effects: {
      audit_write_performed: true,
      disk_write_kind: "local_ignored_audit_record",
      audit_output_path: outputPath,
      git_ignored_required: true,
    },
    audit_write_performed: true,
    disk_write_kind: "local_ignored_audit_record",
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    forbidden_disk_write_performed: false,
    production_write_performed: false,
    secret_value_read_performed: false,
  };
}

function writeAuditRecord(result, auditOutput) {
  assertObject(result, "result");
  assertObject(auditOutput, "auditOutput");
  assertString(auditOutput.normalized, "auditOutput.normalized");
  assertString(auditOutput.resolved, "auditOutput.resolved");

  const payload = buildAuditWritePayload(result, auditOutput.normalized);
  fs.mkdirSync(path.dirname(auditOutput.resolved), { recursive: true });
  fs.writeFileSync(auditOutput.resolved, `${JSON.stringify(payload, null, 2)}\n`, { flag: "wx" });
  return {
    performed: true,
    path: auditOutput.normalized,
    kernel_id: result.kernel_id,
    task_id: result.task_id,
    final_state: result.final_state,
    git_ignored_required: true,
    audit_write_performed: true,
    disk_write_kind: "local_ignored_audit_record",
    forbidden_disk_write_performed: false,
    provider_contact_performed: false,
    image_generation_performed: false,
    production_write_performed: false,
  };
}

function main() {
  const argv = process.argv.slice(2);
  const inputPath = resolveInputPath(argv);
  const auditOutput = resolveAuditOutputPath(argv);
  const task = JSON.parse(fs.readFileSync(inputPath, "utf8"));
  const result = runRuntimeKernelV0(task);
  if (auditOutput) {
    result.audit_write = writeAuditRecord(result, auditOutput);
  }
  console.log(JSON.stringify(result, null, 2));
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(JSON.stringify({
      kernel_id: "runtime_kernel_v0_no_provider",
      passed: false,
      error: error.message,
      side_effect_flags: { ...sideEffectFlags },
    }, null, 2));
    process.exitCode = 1;
  }
}

module.exports = {
  kernelId,
  contractId,
  contractVersion,
  runtimeContract,
  kernelComponents,
  sideEffectFlags,
  getRuntimeContract,
  intakeTask,
  policyGate,
  executeNoProviderFixture,
  persistArtifactInMemory,
  reviewGate,
  stateTransition,
  buildAuditRecord,
  runRuntimeKernelV0,
  normalizeRepoRelativePath,
  resolveAuditOutputPath,
  buildAuditWritePayload,
  writeAuditRecord,
};
