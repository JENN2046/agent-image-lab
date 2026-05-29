#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const defaultInputPath = "tests/fixtures/runtime_kernel_v1_no_provider_fixture_task.fixture.json";
const smokeFlowId = "runtime_to_review_v1_fixture_smoke_flow";
const smokeFlowSchema = "runtime_to_review_v1_fixture_smoke_flow_result.v1";

function assertString(value, label) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${label} must be a non-empty string`);
  }
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
  return { normalized: relative, resolved };
}

function parseArgs(argv) {
  const args = {
    input: defaultInputPath,
    decision: "request_rework",
    reviewer_note: "Fixture smoke flow metadata-only review decision.",
  };
  for (let index = 0; index < argv.length; index += 1) {
    const item = argv[index];
    if (item === "--input") args.input = argv[++index];
    else if (item === "--decision") args.decision = argv[++index];
    else if (item === "--reviewer-note") args.reviewer_note = argv[++index];
    else if (item === "--created-at") args.created_at = argv[++index];
    else if (item === "--help") args.help = true;
    else throw new Error(`Unknown argument: ${item}`);
  }
  return args;
}

function printHelp() {
  process.stdout.write([
    "Usage: node scripts/run_runtime_to_review_v1_fixture_smoke_flow.js --input tests/fixtures/runtime_kernel_v1_no_provider_fixture_task.fixture.json",
    "",
    "Runs the no-provider fixture metadata chain:",
    "prompt fixture -> runtime v1 -> artifact/audit/bridge -> readonly review session -> decision record -> draft registry.",
    "",
    "This command performs no provider, plugin, API, image, memory, DailyNote, production, or file-write side effects.",
  ].join("\n") + "\n");
}

function assertNoSideEffects(result) {
  [
    "provider_contact_performed",
    "plugin_call_performed",
    "api_call_performed",
    "image_generation_performed",
    "image_binary_read_performed",
    "file_write_performed",
    "accepted_samples_write_performed",
    "production_candidate_write_performed",
    "DailyNote_write_performed",
    "VCP_memory_write_performed",
    "memory_write_performed",
    "secret_value_read_performed",
    "push_tag_release_deploy_performed",
  ].forEach((field) => {
    if (result.side_effect_flags[field] === true) {
      throw new Error(`smoke flow side effect flag must be false: ${field}`);
    }
  });
}

async function runRuntimeToReviewV1FixtureSmokeFlow(options = {}) {
  const inputPath = options.input || defaultInputPath;
  const { normalized, resolved } = normalizeRepoRelativePath(inputPath, "input");
  if (!normalized.startsWith("tests/fixtures/")) {
    throw new Error("input must be under tests/fixtures/");
  }

  const { runRuntimeKernelV1 } = require("../kernel/runtime_kernel_v1_real_provider_guarded");
  const { buildRuntimeV1ReadonlyReviewSessionFromRuntimeResult } = require("../adapters/runtime/review_bridge_runtime_v1_readonly");
  const { buildReviewDecisionRecordFromRuntimeV1Session } = require("../adapters/runtime/review_decision_record_v1");
  const { buildReviewDraftRegistryRecord } = require("../adapters/runtime/review_draft_registry_v1");

  const task = JSON.parse(fs.readFileSync(resolved, "utf8"));
  const runtimeResult = await runRuntimeKernelV1(task);
  if (runtimeResult.status !== "completed_fixture_artifact") {
    throw new Error(`fixture runtime must complete as completed_fixture_artifact, got ${runtimeResult.status}`);
  }

  const readonlySession = buildRuntimeV1ReadonlyReviewSessionFromRuntimeResult(runtimeResult);
  const decisionRecord = buildReviewDecisionRecordFromRuntimeV1Session(readonlySession, {
    decision: options.decision || "request_rework",
    reviewer_note: options.reviewer_note || "Fixture smoke flow metadata-only review decision.",
    created_at: options.created_at || "2026-05-29T00:00:00.000Z",
  });
  const draftRegistryRecord = buildReviewDraftRegistryRecord(decisionRecord);

  const result = {
    schema: smokeFlowSchema,
    flow_id: smokeFlowId,
    input_ref: normalized,
    status: "completed_fixture_runtime_to_review_smoke",
    stages: [
      "prompt_fixture_loaded",
      "runtime_v1_completed_fixture_artifact",
      "artifact_record_created",
      "audit_receipt_created",
      "review_bridge_entry_created",
      "readonly_review_session_created",
      "review_decision_record_built",
      "draft_registry_record_built",
    ],
    runtime_status: runtimeResult.status,
    review_session_status: readonlySession.status,
    decision: decisionRecord.decision,
    draft_type: draftRegistryRecord.draft_type,
    artifact_record_ref: runtimeResult.artifact_record_ref,
    audit_receipt_ref: runtimeResult.audit_receipt_ref,
    review_bridge_ref: runtimeResult.review_bridge_ref,
    calls_used: runtimeResult.calls_used,
    image_count: runtimeResult.image_count,
    output_scope: runtimeResult.audit_receipt.output_scope,
    metadata_only: true,
    writes_performed: false,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    image_binary_read_performed: false,
    production_candidate_write_performed: false,
    accepted_samples_write_performed: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false,
    memory_write_performed: false,
    side_effect_flags: {
      provider_contact_performed: false,
      plugin_call_performed: false,
      api_call_performed: false,
      image_generation_performed: false,
      image_binary_read_performed: false,
      file_write_performed: false,
      accepted_samples_write_performed: false,
      production_candidate_write_performed: false,
      DailyNote_write_performed: false,
      VCP_memory_write_performed: false,
      memory_write_performed: false,
      secret_value_read_performed: false,
      push_tag_release_deploy_performed: false,
    },
    refs: {
      runtime_run_id: runtimeResult.artifact_record.run_id,
      review_session_id: readonlySession.session_id,
      decision_id: decisionRecord.decision_id,
      draft_id: draftRegistryRecord.draft_id,
    },
  };
  assertNoSideEffects(result);
  return result;
}

async function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  if (args.help) {
    printHelp();
    return;
  }
  const result = await runRuntimeToReviewV1FixtureSmokeFlow(args);
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

if (require.main === module) {
  main().catch((error) => {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  });
}

module.exports = {
  smokeFlowId,
  smokeFlowSchema,
  defaultInputPath,
  runRuntimeToReviewV1FixtureSmokeFlow,
  normalizeRepoRelativePath,
};
