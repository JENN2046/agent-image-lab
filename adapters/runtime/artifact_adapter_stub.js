#!/usr/bin/env node
"use strict";

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

function buildArtifactAdapterStub(task, persistence) {
  assertObject(task, "task");
  assertObject(persistence, "persistence");
  assertString(task.task_id, "task.task_id");
  assertString(persistence.persisted_ref, "persistence.persisted_ref");
  assertString(persistence.persisted_hash, "persistence.persisted_hash");
  assertObject(persistence.artifact_record, "persistence.artifact_record");

  const artifactRecord = persistence.artifact_record;
  assertString(artifactRecord.artifact_id, "persistence.artifact_record.artifact_id");
  assertString(artifactRecord.artifact_kind, "persistence.artifact_record.artifact_kind");

  return {
    state: "artifact_adapter_stubbed",
    adapter_id: "artifact_adapter_stub_v0",
    adapter_contract: "runtime_kernel_v0_contract.artifact_adapter.v0",
    input_ref: "persistence.artifact_record",
    output_ref: `adapter://${task.task_id}/artifact_adapter_stub`,
    writes_allowed_now: false,
    disk_write_performed: false,
    production_write_performed: false,
    provider_contact_performed: false,
    image_generation_performed: false,
    handoff_record: {
      handoff_id: `${task.task_id}:artifact_adapter_stub:v0`,
      task_id: task.task_id,
      artifact_id: artifactRecord.artifact_id,
      artifact_kind: artifactRecord.artifact_kind,
      persisted_ref: persistence.persisted_ref,
      persisted_hash: persistence.persisted_hash,
      prompt_ref: artifactRecord.prompt_ref || null,
      fixture_asset_ref: artifactRecord.fixture_asset_ref || null,
      capsule_plan: clone(artifactRecord.capsule_plan || {}),
      next_allowed_adapter: "review_bridge_readonly_stub",
      real_artifact_write_allowed_now: false,
    },
  };
}

module.exports = {
  buildArtifactAdapterStub,
};
