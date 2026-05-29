#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const authorizationId = "AUTH-DRAFT-NATIVE-DOUBAO-SEEDREAM5-RETRY-20260527-007";
const receiptRef = "reports/provider_receipts/v0_6_73_real_vcp_agent_generation_retry_007_receipt.json";
const reviewHandoffRef = "review_console/live_receipt_bridge/v0_6_73_real_vcp_agent_generation_retry_007/bridge_entry.json";
const reviewNoteRef = "review_console/live_receipt_bridge/v0_6_73_real_vcp_agent_generation_retry_007/review_note.json";
const auditRef = ".agent_private/runtime_audit_store/v0_6_73_real_vcp_agent_generation_retry_007/activation_attempt_007.audit.json";
const outputDirectoryRef = "runs/real_generation/v0_6_73_real_vcp_agent_generation_retry_007/";
const requiredModel = "doubao-seedream-5-0-260128";

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

function assertNoSecrets(value, label) {
  const text = JSON.stringify(value);
  assert(!/Basic\s+[A-Za-z0-9+/=._~-]+/i.test(text), `${label} must not include Basic auth material`);
  assert(!/Bearer\s+[A-Za-z0-9._~+/-]+/i.test(text), `${label} must not include bearer token`);
  assert(!/sk-[A-Za-z0-9_-]{8,}/.test(text), `${label} must not include sk-* token pattern`);
  assert(!/AKLT[A-Za-z0-9_-]{8,}/.test(text), `${label} must not include provider key pattern`);
}

function assertNoAbsoluteLocalPath(value, label) {
  const text = JSON.stringify(value);
  assert(!/[A-Z]:[\\/]/.test(text), `${label} must not expose Windows absolute paths`);
}

function runArtifactIntegrityValidator() {
  const output = execFileSync(process.execPath, ["scripts/validate_retry_007_artifact_integrity.js"], {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  return JSON.parse(output);
}

function main() {
  assert(fs.existsSync(repoPath(receiptRef)), "retry_007 provider receipt missing");
  assert(fs.existsSync(repoPath(reviewHandoffRef)), "retry_007 review handoff missing");
  assert(fs.existsSync(repoPath(reviewNoteRef)), "retry_007 local review note missing");

  const receipt = readJson(receiptRef);
  const handoff = readJson(reviewHandoffRef);
  const reviewNote = readJson(reviewNoteRef);
  const privateAuditPresent = fs.existsSync(repoPath(auditRef));
  const audit = privateAuditPresent ? readJson(auditRef) : null;

  assert(receipt.schema === "exact_a5_provider_retry_activation_receipt.v0", "receipt schema mismatch");
  assert(receipt.authorization_id === authorizationId, "authorization id mismatch");
  assert(receipt.execution_status === "COMPLETED_PROVIDER_IMAGE_CREATED", "execution status mismatch");
  assert(receipt.retry_count === 1, "retry count must be 1");
  assert(receipt.further_retry_allowed === false, "further retry must be false");
  assert(receipt.provider_contact_attempted === true, "provider contact must be attempted");
  assert(receipt.model_sent === requiredModel, "sent model mismatch");
  assert(receipt.resolution_sent === "1920x2048", "resolution mismatch");
  assert(receipt.non_target_model_observed === false, "non-target model must not be observed");
  assert(receipt.output_directory_ref === outputDirectoryRef, "output directory mismatch");
  assert(receipt.output_directory_abs === "<redacted-local-path>", "output directory abs must be redacted");
  assert(receipt.doubao_project_base_path_override_ref === "<redacted-local-path>", "PROJECT_BASE_PATH ref must be redacted");
  assert(receipt.provider_plugin_api_calls_used.admin_route_calls === 1, "admin route count mismatch");
  assert(receipt.provider_plugin_api_calls_used.provider_calls === 1, "provider count mismatch");
  assert(receipt.provider_plugin_api_calls_used.plugin_calls === 1, "plugin count mismatch");
  assert(receipt.provider_plugin_api_calls_used.api_calls === 1, "api count mismatch");
  assert(receipt.image_count === 1, "image count must be 1");
  assert(receipt.image_budget_respected === true, "image budget must be respected");
  assert(receipt.exact_output_directory_only === true, "exact output directory guard must pass");
  assert(receipt.output_scope_violation === false, "output scope violation must be false");
  assert(receipt.review_eligible === true, "review must be eligible");
  assert(receipt.accepted_candidate_allowed === false, "auto-accept must remain false");
  assert(receipt.receipt_refs.durable_audit_record === auditRef, "durable audit ref mismatch");
  assert(Array.isArray(receipt.image_files) && receipt.image_files.length === 1, "one image file must be recorded");
  assert(receipt.image_files[0].path.startsWith(outputDirectoryRef), "image must be under authorized output directory");
  assert(fs.existsSync(repoPath(receipt.image_files[0].path)), "recorded image file missing");
  const integrity = runArtifactIntegrityValidator();
  assert(integrity.passed === true, "retry_007 artifact integrity validator must pass");
  assert(receipt.forbidden_writes.daily_note === false, "DailyNote write must be false");
  assert(receipt.forbidden_writes.vcp_memory === false, "VCP memory write must be false");
  assert(receipt.forbidden_writes.accepted_samples === false, "accepted samples write must be false");
  assert(receipt.forbidden_writes.production_candidate === false, "production candidate write must be false");
  assert(receipt.forbidden_writes.push_tag_release_deploy === false, "push/tag/release/deploy must be false");
  assert(receipt.secret_handling.secret_values_read_by_codex === false, "Codex secret read must be false");
  assert(receipt.secret_handling.env_or_secret_file_content_read_by_codex === false, "Codex env/secret file read must be false");
  assert(receipt.secret_handling.secret_values_printed === false, "secret values must not be printed");
  assert(receipt.secret_handling.secret_values_written === false, "secret values must not be written");
  assert(handoff.review_status === "ready_for_human_review", "handoff review status mismatch");
  assert(handoff.accepted_candidate === false, "handoff must not auto-accept candidate");
  assert(reviewNote.schema === "local_image_review_note.v0", "review note schema mismatch");
  assert(reviewNote.source_generation_authorization_id === authorizationId, "review note source authorization mismatch");
  assert(reviewNote.image_ref === receipt.image_files[0].path, "review note image ref mismatch");
  assert(reviewNote.prompt_package_ref === receipt.prompt_package_ref, "review note prompt ref mismatch");
  assert(reviewNote.acceptance_gate.prompt_subject_match === true, "review note subject match should be true");
  assert(reviewNote.acceptance_gate.vertical_9_16_composition === false, "review note must record 9:16 mismatch");
  assert(reviewNote.acceptance_gate.passed === false, "review note acceptance gate must fail");
  assert(reviewNote.decision === "provider_link_success_evidence_only", "review note decision mismatch");
  assert(reviewNote.review_status === "reviewed_not_accepted_sample", "review note status mismatch");
  assert(reviewNote.accepted_sample_candidate === false, "review note must not mark accepted sample candidate");
  assert(reviewNote.production_candidate === false, "review note must not mark production candidate");
  assert(reviewNote.accepted_samples_write_performed === false, "review note accepted_samples write must be false");
  assert(reviewNote.production_candidate_write_performed === false, "review note production write must be false");
  assert(reviewNote.DailyNote_write_performed === false, "review note DailyNote write must be false");
  assert(reviewNote.VCP_memory_write_performed === false, "review note VCP memory write must be false");
  if (audit) {
    assert(audit.audit_type === "durable_runtime_audit_record", "audit type mismatch");
  }
  assertNoSecrets(receipt, "receipt");
  assertNoSecrets(handoff, "handoff");
  assertNoSecrets(reviewNote, "review note");
  if (audit) assertNoSecrets(audit, "audit");
  assertNoAbsoluteLocalPath(receipt, "receipt");
  assertNoAbsoluteLocalPath(handoff, "handoff");
  assertNoAbsoluteLocalPath(reviewNote, "review note");
  if (audit) assertNoAbsoluteLocalPath(audit, "audit");

  process.stdout.write(`${JSON.stringify({
    passed: true,
    validator: "validate_exact_a5_provider_retry_007_activation_receipt",
    authorization_id: receipt.authorization_id,
    execution_status: receipt.execution_status,
    provider_calls_used: receipt.provider_plugin_api_calls_used.provider_calls,
    images_created: receipt.image_count,
    image_file: receipt.image_files[0].path,
    artifact_sha256: integrity.sha256,
    artifact_mime_type: integrity.mime_type,
    artifact_width: integrity.width,
    artifact_height: integrity.height,
    artifact_git_tracked: integrity.git_tracked,
    artifact_git_ignored: integrity.git_ignored,
    public_absolute_paths_absent: integrity.public_absolute_paths_absent,
    output_scope_violation: receipt.output_scope_violation,
    review_eligible: receipt.review_eligible,
    local_review_decision: reviewNote.decision,
    accepted_sample_candidate: reviewNote.accepted_sample_candidate,
    prompt_9_16_gate_passed: reviewNote.acceptance_gate.vertical_9_16_composition,
    durable_audit_private_ref_recorded: true,
    durable_audit_private_file_present: privateAuditPresent,
    fresh_clone_private_audit_required: false,
    further_retry_allowed: receipt.further_retry_allowed,
  }, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${JSON.stringify({
    passed: false,
    validator: "validate_exact_a5_provider_retry_007_activation_receipt",
    error: error.message,
  }, null, 2)}\n`);
  process.exitCode = 1;
}
