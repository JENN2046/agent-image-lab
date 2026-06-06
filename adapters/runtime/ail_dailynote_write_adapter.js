#!/usr/bin/env node
"use strict";

const path = require("node:path");

const adapterId = "ail_dailynote_write_adapter_v1";
const envelopeSchema = "ail_dailynote_write_envelope.v1";
const executionAuditSchema = "ail_dailynote_write_execution_audit_stub.v1";
const rollbackSchema = "ail_dailynote_write_rollback_or_revoke_plan.v1";
const selectedPluginId = "DailyNoteWrite";
const expectedRootClass = "vcp_root_dailynote";
const defaultMaidName = "Archivist_Agent";

const guard = Object.freeze({
  preflight_only: true,
  can_execute_now: false,
  calls_vcptoolbox_plugin_now: false,
  reads_vcp_config_now: false,
  reads_secret_value_now: false,
  writes_daily_note_now: false,
  writes_vcp_memory_now: false,
  writes_file_now: false,
  image_binary_allowed: false,
  raw_payload_allowed: false,
  raw_private_path_allowed: false,
  plugin_success_sufficient: false,
  canonical_root_preflight_required: true,
  canonical_target_file_check_required: true,
  canonical_hash_match_required: true,
});

const sideEffectFlags = Object.freeze({
  DailyNoteWrite_called: false,
  DailyNote_write_performed: false,
  VCP_memory_write_performed: false,
  file_write_performed: false,
  VCPToolBox_config_read_performed: false,
  secret_value_read_performed: false,
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  image_generation_performed: false,
  image_binary_read_performed: false,
  accepted_samples_write_performed: false,
  production_candidate_write_performed: false,
  push_tag_release_deploy_performed: false,
});

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

function assertBoolean(value, label) {
  if (typeof value !== "boolean") {
    throw new Error(`${label} must be a boolean`);
  }
}

function assertFalseFlags(source, label) {
  assertObject(source, label);
  for (const [field, value] of Object.entries(source)) {
    if (value === true) {
      throw new Error(`${label}.${field} must be false`);
    }
  }
}

function unwrapMemoryDelta(input) {
  assertObject(input, "memory_delta_input");
  return input.memory_delta && typeof input.memory_delta === "object" ? input.memory_delta : input;
}

function hasChineseText(value) {
  return /[\u3400-\u9fff]/.test(value || "");
}

function sanitizePathComponent(value, label) {
  assertString(value, label);
  const trimmed = value.trim();
  if (/^[A-Za-z]:[\\/]/.test(trimmed) || path.isAbsolute(trimmed)) {
    throw new Error(`${label} must not be an absolute path`);
  }
  if (trimmed.includes("/") || trimmed.includes("\\") || trimmed.includes("..")) {
    throw new Error(`${label} must be a single safe path component`);
  }
  return trimmed.replace(/[<>:"/\\|?*\u0000-\u001f]+/g, "_").replace(/\s+/g, "_").slice(0, 96);
}

function assertProjectRelativeRef(value, label) {
  if (value == null || value === "") return null;
  assertString(value, label);
  const normalized = value.replace(/\\/g, "/");
  if (/^[A-Za-z]:\//.test(normalized) || normalized.startsWith("/") || normalized.includes("../")) {
    throw new Error(`${label} must be project-relative and sanitized`);
  }
  return normalized;
}

function normalizeTags(tags) {
  if (!Array.isArray(tags) || tags.length === 0) {
    throw new Error("memory_delta.tags must be a non-empty array");
  }
  return tags.map((tag, index) => {
    assertString(tag, `memory_delta.tags[${index}]`);
    return tag.trim().replace(/[,\u3001\uff0c]+/g, " ");
  });
}

function ensureTagLine(content, tags) {
  const body = content.trim();
  const normalizedTags = tags.join(", ");
  const tagLine = `Tag: ${normalizedTags}`;
  if (/^Tag:\s*.+$/im.test(body.split(/\r?\n/).slice(-1)[0] || "")) {
    return body.replace(/^Tag:\s*.+$/im, tagLine);
  }
  return `${body}\n\n${tagLine}`;
}

function validateMemoryDelta(memoryDelta) {
  const delta = unwrapMemoryDelta(memoryDelta);
  assertString(delta.delta_id, "memory_delta.delta_id");
  assertString(delta.task_id, "memory_delta.task_id");
  assertString(delta.agent_name, "memory_delta.agent_name");
  assertString(delta.target_notebook, "memory_delta.target_notebook");
  assertString(delta.chinese_diary_title, "memory_delta.chinese_diary_title");
  assertString(delta.chinese_diary_content, "memory_delta.chinese_diary_content");
  if (!hasChineseText(delta.chinese_diary_content)) {
    throw new Error("memory_delta.chinese_diary_content must contain Chinese text");
  }
  if (delta.write_mode !== "confirmed") {
    throw new Error("memory_delta.write_mode must be confirmed before DailyNoteWrite payload creation");
  }
  if (delta.approval_status !== "approved") {
    throw new Error("memory_delta.approval_status must be approved");
  }
  assertString(delta.approved_by, "memory_delta.approved_by");
  assertString(delta.approved_at, "memory_delta.approved_at");
  assertObject(delta.memory_safety, "memory_delta.memory_safety");
  for (const field of ["contains_secret", "contains_private_path", "contains_customer_private_data", "contains_image_binary"]) {
    assertBoolean(delta.memory_safety[field], `memory_delta.memory_safety.${field}`);
    if (delta.memory_safety[field] !== false) {
      throw new Error(`memory_delta.memory_safety.${field} must be false`);
    }
  }
  assertObject(delta.final_decision, "memory_delta.final_decision");
  if (delta.final_decision.should_write_to_vcp !== true) {
    throw new Error("memory_delta.final_decision.should_write_to_vcp must be true");
  }
  if (delta.preserved_original && typeof delta.preserved_original === "object") {
    assertProjectRelativeRef(delta.preserved_original.file_ref, "memory_delta.preserved_original.file_ref");
  }
  normalizeTags(delta.tags);
  return delta;
}

function validateAuthorization(authorization) {
  assertObject(authorization, "authorization");
  assertString(authorization.authorization_id, "authorization.authorization_id");
  assertString(authorization.authorized_by, "authorization.authorized_by");
  assertString(authorization.authorized_at, "authorization.authorized_at");
  if (authorization.selected_plugin_id !== selectedPluginId) {
    throw new Error(`authorization.selected_plugin_id must be ${selectedPluginId}`);
  }
  if (authorization.daily_note_write_authorized !== true) {
    throw new Error("authorization.daily_note_write_authorized must be true");
  }
  if (authorization.vcp_memory_write_authorized !== true) {
    throw new Error("authorization.vcp_memory_write_authorized must be true");
  }
  if (authorization.write_command_permission !== true) {
    throw new Error("authorization.write_command_permission must be true");
  }
  if (authorization.expected_root_class !== expectedRootClass) {
    throw new Error(`authorization.expected_root_class must be ${expectedRootClass}`);
  }
  if (authorization.max_write_entries !== 1) {
    throw new Error("authorization.max_write_entries must be 1");
  }
  if (authorization.overwrite_existing_files_allowed !== false) {
    throw new Error("authorization.overwrite_existing_files_allowed must be false");
  }
  if (authorization.secret_value_read_allowed !== false) {
    throw new Error("authorization.secret_value_read_allowed must be false");
  }
  return authorization;
}

function buildDailyNoteWritePayload(memoryDelta) {
  const delta = validateMemoryDelta(memoryDelta);
  const tags = normalizeTags(delta.tags);
  const targetNotebook = sanitizePathComponent(delta.target_notebook, "memory_delta.target_notebook");
  const maid = sanitizePathComponent(delta.agent_name || defaultMaidName, "memory_delta.agent_name");
  const dateString = delta.approved_at.slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    throw new Error("memory_delta.approved_at must start with YYYY-MM-DD");
  }
  const title = delta.chinese_diary_title.trim();
  const contentText = ensureTagLine(`${title}\n\n${delta.chinese_diary_content}`, tags);
  const fileName = `${sanitizePathComponent(delta.delta_id, "memory_delta.delta_id")}.txt`;
  return {
    maidName: `[${targetNotebook}]${maid}`,
    dateString,
    contentText,
    fileName,
  };
}

function buildExecutionAuditStub(memoryDelta, authorization) {
  const delta = validateMemoryDelta(memoryDelta);
  const auth = validateAuthorization(authorization);
  return {
    schema: executionAuditSchema,
    status: "prepared_no_write",
    authorization_id: auth.authorization_id,
    memory_delta_id: delta.delta_id,
    selected_plugin_id: selectedPluginId,
    expected_root_class: expectedRootClass,
    DailyNoteWrite_called: false,
    plugin_exit_code: null,
    plugin_reported_status: null,
    saved_file_name: null,
    saved_file_sha256: null,
    canonical_target_file_exists: false,
    canonical_target_hash_match: false,
    actual_write_performed: false,
    wrong_location_file_is_success: false,
    side_effect_flags: { ...sideEffectFlags },
  };
}

function buildRollbackOrRevokePlan(memoryDelta, authorization) {
  const delta = validateMemoryDelta(memoryDelta);
  const auth = validateAuthorization(authorization);
  return {
    schema: rollbackSchema,
    status: "prepared_for_future_write",
    authorization_id: auth.authorization_id,
    memory_delta_id: delta.delta_id,
    if_no_write_performed: "No rollback is required; discard the generated envelope and audit stub.",
    if_plugin_success_wrong_location: "Do not mark memory complete; stop for human-approved repair or revoke path.",
    if_hash_mismatch: "Do not retry automatically; mark rejected_integrity_mismatch and request human decision.",
    if_user_revokes_after_success: "Create a separate revocation/tombstone record; do not delete canonical memory silently.",
    destructive_cleanup_allowed_now: false,
  };
}

function buildDailyNoteWriteEnvelope(input) {
  assertObject(input, "input");
  const delta = validateMemoryDelta(input.memory_delta || input);
  const auth = validateAuthorization(input.authorization || {});
  const payload = buildDailyNoteWritePayload(delta);
  const envelope = {
    schema: envelopeSchema,
    adapter_id: adapterId,
    status: "payload_ready_no_write",
    lane: "Amber_C_memory_preflight",
    can_execute_now: false,
    selected_plugin: {
      plugin_id: selectedPluginId,
      plugin_type: "synchronous_stdio",
      command: "node daily-note-write.js",
      command_resolved_now: false,
      root_class_expected: expectedRootClass,
    },
    memory_delta_ref: delta.delta_id,
    authorization_id: auth.authorization_id,
    target_notebook: delta.target_notebook,
    daily_note_write_payload: payload,
    execution_audit_stub: buildExecutionAuditStub(delta, auth),
    rollback_or_revoke_plan: buildRollbackOrRevokePlan(delta, auth),
    guard: { ...guard },
    side_effect_flags: { ...sideEffectFlags },
    validation_required: [
      "node scripts/validate_ail_dailynote_write_adapter.js",
      "canonical root preflight before any future plugin call",
      "canonical target file exists after future plugin call",
      "canonical target sha256 matches expected content after future plugin call",
    ],
    stop_conditions: [
      "memory_delta is not confirmed and approved",
      "safety flag is true",
      "authorization is missing or broad",
      "writer root cannot be proven as vcp_root_dailynote",
      "secret value or raw private path would be read or printed",
      "plugin success occurs without canonical file/hash validation",
    ],
  };
  validateDailyNoteWriteEnvelope(envelope);
  return envelope;
}

function validateDailyNoteWriteEnvelope(envelope) {
  assertObject(envelope, "envelope");
  if (envelope.schema !== envelopeSchema) throw new Error("envelope.schema mismatch");
  if (envelope.adapter_id !== adapterId) throw new Error("envelope.adapter_id mismatch");
  if (envelope.can_execute_now !== false) throw new Error("envelope.can_execute_now must be false");
  if (envelope.selected_plugin.plugin_id !== selectedPluginId) throw new Error("selected plugin mismatch");
  if (envelope.selected_plugin.root_class_expected !== expectedRootClass) throw new Error("root class mismatch");
  assertObject(envelope.daily_note_write_payload, "envelope.daily_note_write_payload");
  assertString(envelope.daily_note_write_payload.maidName, "payload.maidName");
  assertString(envelope.daily_note_write_payload.dateString, "payload.dateString");
  assertString(envelope.daily_note_write_payload.contentText, "payload.contentText");
  assertString(envelope.daily_note_write_payload.fileName, "payload.fileName");
  if (!envelope.daily_note_write_payload.maidName.startsWith("[")) {
    throw new Error("payload.maidName must include notebook folder syntax");
  }
  if (!/^Tag:\s*.+$/m.test(envelope.daily_note_write_payload.contentText.split(/\r?\n/).slice(-1)[0] || "")) {
    throw new Error("payload.contentText must end with a normalized Tag line");
  }
  assertObject(envelope.execution_audit_stub, "envelope.execution_audit_stub");
  if (envelope.execution_audit_stub.schema !== executionAuditSchema) throw new Error("execution audit schema mismatch");
  if (envelope.execution_audit_stub.actual_write_performed !== false) throw new Error("audit actual_write_performed must be false");
  if (envelope.execution_audit_stub.wrong_location_file_is_success !== false) throw new Error("wrong location cannot be success");
  assertFalseFlags(envelope.execution_audit_stub.side_effect_flags, "audit.side_effect_flags");
  assertObject(envelope.rollback_or_revoke_plan, "envelope.rollback_or_revoke_plan");
  if (envelope.rollback_or_revoke_plan.schema !== rollbackSchema) throw new Error("rollback schema mismatch");
  if (envelope.rollback_or_revoke_plan.destructive_cleanup_allowed_now !== false) throw new Error("destructive cleanup must be false");
  for (const [field, value] of Object.entries(guard)) {
    if (envelope.guard[field] !== value) throw new Error(`guard.${field} mismatch`);
  }
  assertFalseFlags(envelope.side_effect_flags, "envelope.side_effect_flags");
  return true;
}

function main() {
  const fixture = require("../../tests/fixtures/ail_dailynote_write_adapter_attempt_018_confirmed.fixture.json");
  const envelope = buildDailyNoteWriteEnvelope(fixture);
  console.log(JSON.stringify(envelope, null, 2));
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(JSON.stringify({
      adapter_id: adapterId,
      passed: false,
      error: error.message,
      guard: { ...guard },
      side_effect_flags: { ...sideEffectFlags },
    }, null, 2));
    process.exitCode = 1;
  }
}

module.exports = {
  adapterId,
  envelopeSchema,
  executionAuditSchema,
  rollbackSchema,
  selectedPluginId,
  expectedRootClass,
  guard,
  sideEffectFlags,
  validateMemoryDelta,
  validateAuthorization,
  buildDailyNoteWritePayload,
  buildExecutionAuditStub,
  buildRollbackOrRevokePlan,
  buildDailyNoteWriteEnvelope,
  validateDailyNoteWriteEnvelope,
};
