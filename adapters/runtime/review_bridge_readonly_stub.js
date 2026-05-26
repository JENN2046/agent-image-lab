#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "../..");
const defaultInputPath = "tests/fixtures/runtime_kernel_v0_green_task.fixture.json";

const bridgeGuard = Object.freeze({
  read_only: true,
  display_only: true,
  fetch_performed: false,
  file_write_performed: false,
  approval_write_performed: false,
  archive_write_performed: false,
  accepted_samples_write_performed: false,
  production_candidate_created: false,
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  image_generation_performed: false,
  DailyNote_write_performed: false,
  VCP_memory_write_performed: false,
  secret_value_read_performed: false,
  push_tag_release_deploy_performed: false,
});

const reviewInvariants = Object.freeze([
  "Review bridge is read-only and display-only.",
  "Human review is required before approval.",
  "Approval, archive, accepted_samples, production, and memory writes are blocked.",
  "Provider, plugin, API, and image generation actions are blocked.",
  "Runtime audit and artifact metadata are displayed as evidence, not production proof.",
]);

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

function sanitizeId(value) {
  assertString(value, "id");
  return value.replace(/[^A-Za-z0-9_-]+/g, "_").replace(/^_+|_+$/g, "");
}

function assertFalseFlags(source, fields, label) {
  for (const field of fields) {
    if (source[field] === true) {
      throw new Error(`${label}.${field} must be false`);
    }
  }
}

function validateRuntimeResult(runtimeResult) {
  assertObject(runtimeResult, "runtimeResult");
  assertString(runtimeResult.task_id, "runtimeResult.task_id");
  if (runtimeResult.final_state !== "completed_stub") {
    throw new Error("review bridge requires completed_stub runtime result");
  }
  assertObject(runtimeResult.intake, "runtimeResult.intake");
  assertObject(runtimeResult.intake.task, "runtimeResult.intake.task");
  assertObject(runtimeResult.artifact_adapter, "runtimeResult.artifact_adapter");
  assertObject(runtimeResult.artifact_adapter.handoff_record, "runtimeResult.artifact_adapter.handoff_record");
  assertObject(runtimeResult.audit_record, "runtimeResult.audit_record");
  assertObject(runtimeResult.transition, "runtimeResult.transition");
  assertObject(runtimeResult.review, "runtimeResult.review");

  if (runtimeResult.artifact_adapter.handoff_record.next_allowed_adapter !== "review_bridge_readonly_stub") {
    throw new Error("artifact handoff must allow review_bridge_readonly_stub next");
  }
  if (runtimeResult.review.review_decision !== "stub_review_pending") {
    throw new Error("review bridge requires stub_review_pending review decision");
  }
  assertFalseFlags(runtimeResult.audit_record.side_effect_flags || {}, Object.keys(runtimeResult.audit_record.side_effect_flags || {}), "audit_record.side_effect_flags");
}

function buildReviewSessionDraft(runtimeResult, imageCaseDraft) {
  const taskId = runtimeResult.task_id;
  const caseId = imageCaseDraft.case_id;
  const versionId = `${caseId}:version:fixture`;

  return {
    session_id: `review_session_${sanitizeId(taskId)}`,
    task_id: taskId,
    case_id: caseId,
    project: "agent-image-lab",
    status: "draft",
    image_versions: [
      {
        version_id: versionId,
        label: "Runtime fixture artifact",
        asset_ref: imageCaseDraft.fixture_asset_ref,
        thumbnail_ref: null,
        source: "placeholder",
        score: null,
      },
    ],
    current_version_id: versionId,
    compare_version_id: null,
    ai_review: {
      status: "not_run",
      score: null,
      recommendation: "pending_human_review",
    },
    human_review: {
      status: "pending",
      approved: false,
      reviewer_ref: runtimeResult.review.reviewer_ref || null,
    },
    final_review: {
      status: "pending_human_review",
      accepted_candidate: false,
      commercial_delivery_ready: false,
    },
    comments: [],
    annotation_notes: [],
    version_comparison: {
      status: "not_applicable_single_version",
    },
    approval: {
      status: "not_requested",
      approve_reject_write_allowed_now: false,
    },
    archive_decision: {
      status: "not_ready",
      archive_write_allowed_now: false,
    },
    memory_preview: {
      chinese_diary_title: "待人工审片的运行时样例",
      chinese_diary_content: "该记录仅为本地只读审片草案，尚未进入记忆写入流程。",
      target_notebook: "not_selected",
      maid: null,
      tags: ["runtime_stub", "review_pending", "readonly_bridge"],
      safety: {
        preview_only: true,
        DailyNote_write_performed: false,
        VCP_memory_write_performed: false,
      },
    },
    memory_approval: {
      status: "not_required",
      approved_by: null,
      approved_at: null,
      rejection_reason_cn: null,
    },
    next_iteration: {
      status: "pending_human_review",
      allowed_next_local_action: "inspect_readonly_case",
    },
    audit_log: [
      {
        event: "runtime_stub_completed",
        audit_id: runtimeResult.audit_record.audit_id,
        final_state: runtimeResult.final_state,
        state_path: clone(runtimeResult.transition.path),
      },
      {
        event: "review_bridge_readonly_stub_created",
        adapter_id: "review_bridge_readonly_stub_v0",
        writes_allowed_now: false,
      },
    ],
    invariants: [...reviewInvariants],
  };
}

function buildImageCaseDraft(runtimeResult) {
  const handoff = runtimeResult.artifact_adapter.handoff_record;
  const task = runtimeResult.intake.task;
  const artifactId = handoff.artifact_id;
  const caseId = `image_case_${sanitizeId(artifactId)}`;

  return {
    case_id: caseId,
    task_id: runtimeResult.task_id,
    artifact_id: artifactId,
    artifact_kind: handoff.artifact_kind,
    prompt_ref: handoff.prompt_ref || task.input.prompt_ref,
    fixture_asset_ref: handoff.fixture_asset_ref || task.input.fixture_asset_ref,
    persisted_ref: handoff.persisted_ref,
    persisted_hash: handoff.persisted_hash,
    capsule_plan: clone(handoff.capsule_plan || {}),
    runtime_final_state: runtimeResult.final_state,
    runtime_state_path: clone(runtimeResult.transition.path),
    audit_id: runtimeResult.audit_record.audit_id,
    review_status: "pending_human_review",
    accepted_candidate: false,
    commercial_delivery_ready: false,
    memory_suitability: "deferred",
    read_model: {
      source_task_ref: "intake.task",
      source_artifact_handoff_ref: "artifact_adapter.handoff_record",
      source_audit_ref: "audit_record",
      source_transition_ref: "transition",
      source_review_ref: "review",
    },
    allowed_actions: [
      "inspect_runtime_state",
      "inspect_artifact_metadata",
      "inspect_audit_summary",
      "open_readonly_case_view",
    ],
    forbidden_actions: [
      "approve",
      "reject",
      "write_archive",
      "write_accepted_samples",
      "write_production_candidate",
      "write_memory",
      "call_provider",
      "call_plugin",
      "call_api",
      "generate_image",
    ],
  };
}

function buildReviewBridgeReadonlyStub(runtimeResult) {
  validateRuntimeResult(runtimeResult);
  const imageCaseDraft = buildImageCaseDraft(runtimeResult);
  const reviewSessionDraft = buildReviewSessionDraft(runtimeResult, imageCaseDraft);

  return {
    state: "review_bridge_readonly_stubbed",
    adapter_id: "review_bridge_readonly_stub_v0",
    adapter_contract: "runtime_kernel_v0_contract.review_bridge_readonly.v0",
    input_refs: {
      task: "intake.task",
      artifact_handoff: "artifact_adapter.handoff_record",
      audit_record: "audit_record",
      transition: "transition",
      review: "review",
    },
    output_ref: `review-console://${runtimeResult.task_id}/readonly_stub`,
    display_only: true,
    writes_allowed_now: false,
    approve_reject_write_allowed_now: false,
    disk_write_performed: false,
    production_write_performed: false,
    provider_contact_performed: false,
    image_generation_performed: false,
    review_console_case_data: {
      image_case_draft: imageCaseDraft,
      review_session_draft: reviewSessionDraft,
    },
    guard: { ...bridgeGuard },
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

function main() {
  const { runRuntimeKernelV0 } = require("../../kernel/runtime_kernel_v0");
  const inputPath = resolveInputPath(process.argv.slice(2));
  const task = JSON.parse(fs.readFileSync(inputPath, "utf8"));
  const runtimeResult = runRuntimeKernelV0(task);
  const bridge = buildReviewBridgeReadonlyStub(runtimeResult);
  console.log(JSON.stringify(bridge, null, 2));
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(JSON.stringify({
      adapter_id: "review_bridge_readonly_stub_v0",
      passed: false,
      error: error.message,
      guard: { ...bridgeGuard },
    }, null, 2));
    process.exitCode = 1;
  }
}

module.exports = {
  bridgeGuard,
  reviewInvariants,
  buildReviewBridgeReadonlyStub,
  normalizeRepoRelativePath,
  resolveInputPath,
};
