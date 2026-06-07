#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "../../..");
const files = {
  doc: "docs/review_console_asset_archive_readonly_preview_adapter_contract.md",
  fixture: "tests/schema_examples/ASSET_ARCHIVE_READONLY_PREVIEW_ADAPTER_CONTRACT.example.json",
  validator: "scripts/validators/review_console/validate_asset_archive_readonly_preview_adapter_contract.js"
};

const expectedAllowedPatterns = [
  "asset_archive/accepted_samples/{sample_id}/manifest.json",
  "asset_archive/accepted_samples/{sample_id}/preview.webp",
  "asset_archive/failure_samples/{sample_id}/manifest.json",
  "asset_archive/failure_samples/{sample_id}/preview.webp"
];

const expectedFallbackSkins = [
  "product_still_life",
  "editorial_portrait",
  "evidence_blocker"
];

const falseGuardKeys = [
  "real_asset_archive_read_performed",
  "asset_archive_manifest_read_performed",
  "asset_archive_preview_binary_read_performed",
  "asset_archive_original_binary_read_performed",
  "asset_archive_directory_listing_performed",
  "preview_loaded_or_rendered",
  "preview_creation_or_copy_performed",
  "fetch_performed",
  "file_write_performed",
  "source_image_binary_read_performed",
  "hash_extraction_performed",
  "dimensions_extraction_performed",
  "provider_contact_performed",
  "plugin_call_performed",
  "api_call_performed",
  "image_generation_performed",
  "DailyNote_write_performed",
  "VCP_memory_write_performed",
  "accepted_samples_write_performed",
  "failure_samples_write_performed",
  "production_candidate_write_performed",
  "real_manifest_read_performed",
  "real_vcpchat_read_performed",
  "real_vcptoolbox_read_performed",
  "push_tag_release_deploy_performed"
];

const checks = [];
const failures = [];

function relPath(rel) {
  return path.join(root, rel);
}

function readText(rel) {
  return fs.readFileSync(relPath(rel), "utf8");
}

function readJson(rel) {
  return JSON.parse(readText(rel));
}

function addResult(check, passed, detail = null) {
  const result = { check, passed: Boolean(passed), ...(detail === null ? {} : { detail }) };
  checks.push(result);
  if (!result.passed) failures.push(result);
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function arrayEquals(left, right) {
  return Array.isArray(left) &&
    left.length === right.length &&
    left.every((value, index) => value === right[index]);
}

function hasPlaceholderAssetArchiveRef(value, lane, suffix) {
  if (typeof value !== "string") return false;
  const prefix = lane === "failure" ? "asset_archive/failure_samples/" : "asset_archive/accepted_samples/";
  return value.startsWith(prefix) && value.endsWith(`${suffix}.placeholder`) && !value.includes("..");
}

function evaluate(contract) {
  const guard = isPlainObject(contract.guard) ? contract.guard : {};
  const records = Array.isArray(contract.preview_records) ? contract.preview_records : [];
  const gate = isPlainObject(contract.future_probe_gate) ? contract.future_probe_gate : {};
  const mapping = isPlainObject(contract.preview_display_state_mapping) ? contract.preview_display_state_mapping : {};

  const identityOk =
    contract.phase === "review_console_asset_archive_readonly_preview_adapter_contract_draft" &&
    contract.contract_status === "draft_no_real_read" &&
    contract.adapter_id === "asset_archive_readonly_preview_adapter_v0" &&
    contract.draft_output_key === "asset_archive_readonly_preview_adapter_state" &&
    contract.consumer_contract === "preview_display_state" &&
    contract.execution_mode === "local_contract_no_real_asset_archive_read" &&
    contract.source_mode === "asset_archive_repo_relative_preview_refs_to_preview_display_state" &&
    contract.can_execute_now === false;

  const readBoundaryOk =
    arrayEquals(contract.future_allowed_read_ref_patterns, expectedAllowedPatterns) &&
    Array.isArray(contract.forbidden_ref_patterns) &&
    contract.forbidden_ref_patterns.includes("asset_archive/**") &&
    contract.forbidden_ref_patterns.includes("asset_archive/original_assets/**") &&
    contract.forbidden_ref_patterns.includes("runs/**") &&
    contract.max_manifest_reads === 3 &&
    contract.max_preview_loads === 3;

  const recordsOk =
    records.length === 3 &&
    records.some((record) => record.lane === "failure") &&
    records.every((record) =>
      typeof record.adapter_preview_id === "string" &&
      record.adapter_preview_id.startsWith("asset-archive-readonly-preview-") &&
      ["accepted", "failure"].includes(record.lane) &&
      typeof record.source_sample_id === "string" &&
      hasPlaceholderAssetArchiveRef(record.manifest_ref, record.lane, "manifest.json") &&
      hasPlaceholderAssetArchiveRef(record.preview_ref, record.lane, "preview.webp") &&
      ["image/webp", "image/jpeg", "image/png"].includes(record.preview_mime_type) &&
      isPlainObject(record.preview_dimensions) &&
      Number.isInteger(record.preview_dimensions.width) &&
      Number.isInteger(record.preview_dimensions.height) &&
      expectedFallbackSkins.includes(record.css_skin_fallback) &&
      record.adapter_output_ref_only === true &&
      record.source_manifest_read_performed === false &&
      record.preview_loaded_or_rendered === false &&
      record.preview_binary_read_performed === false &&
      record.asset_archive_write_performed === false
    );

  const mappingOk =
    mapping.target_draft_output_key === "preview_display_state" &&
    mapping.adapter_preview_id_to_preview_id === true &&
    mapping.source_sample_id_to_version_id === true &&
    mapping.preview_ref_to_thumbnail_ref_future_only === true &&
    mapping.css_skin_fallback_to_skin_id === true &&
    mapping.preserve_current_review_session_version === true &&
    mapping.do_not_infer_archive_approval === true &&
    mapping.do_not_infer_production_candidate_readiness === true &&
    mapping.do_not_infer_memory_readiness === true;

  const gateOk =
    gate.gate_status === "prepared_not_authorized" &&
    gate.can_execute_now === false &&
    gate.requires_separate_exact_read_gate === true &&
    gate.allowed_operation === "read_existing_preview_refs_only" &&
    gate.max_manifest_reads === 3 &&
    gate.max_preview_loads === 3 &&
    gate.receipt_required === true &&
    gate.stop_on_absolute_path === true &&
    gate.stop_on_secret_or_private_raw_data === true &&
    gate.stop_on_write_requirement === true;

  const guardTrueOk =
    guard.contract_draft_only === true &&
    guard.read_only_intent === true &&
    guard.adapter_output_ref_only === true;

  const guardFalseOk = falseGuardKeys.every((key) => guard[key] === false);

  return {
    passed: identityOk && readBoundaryOk && recordsOk && mappingOk && gateOk && guardTrueOk && guardFalseOk,
    identityOk,
    readBoundaryOk,
    recordsOk,
    mappingOk,
    gateOk,
    guardTrueOk,
    guardFalseOk
  };
}

for (const [key, rel] of Object.entries(files)) {
  addResult(`${key}_exists`, fs.existsSync(relPath(rel)) && fs.statSync(relPath(rel)).isFile(), rel);
}

const doc = readText(files.doc);
const validatorSource = readText(files.validator);
const fixture = readJson(files.fixture).asset_archive_readonly_preview_adapter_contract;
const baseEval = evaluate(fixture);

addResult("contract_fixture_passes", baseEval.passed, baseEval);

const readClaim = clone(fixture);
readClaim.guard.asset_archive_manifest_read_performed = true;
readClaim.preview_records[0].source_manifest_read_performed = true;
addResult("negative_case_manifest_read_claim_fails", evaluate(readClaim).passed === false);

const previewLoadClaim = clone(fixture);
previewLoadClaim.guard.preview_loaded_or_rendered = true;
previewLoadClaim.preview_records[0].preview_loaded_or_rendered = true;
addResult("negative_case_preview_loaded_claim_fails", evaluate(previewLoadClaim).passed === false);

const broadAllowlist = clone(fixture);
broadAllowlist.future_allowed_read_ref_patterns = ["asset_archive/**"];
addResult("negative_case_broad_asset_archive_glob_fails", evaluate(broadAllowlist).readBoundaryOk === false);

const concreteRef = clone(fixture);
concreteRef.preview_records[0].preview_ref = "asset_archive/accepted_samples/sample_readonly_preview_accepted_001/preview.webp";
addResult("negative_case_non_placeholder_preview_ref_fails", evaluate(concreteRef).recordsOk === false);

for (const token of [
  "adapter_id: asset_archive_readonly_preview_adapter_v0",
  "contract_status: draft_no_real_read",
  "draft_output_key: asset_archive_readonly_preview_adapter_state",
  "consumer_contract: preview_display_state",
  "can_execute_now: false",
  "no `asset_archive/` directory read",
  "node scripts/validate_asset_archive_readonly_preview_adapter_contract.js"
]) {
  addResult(`doc_token_${token}`, doc.includes(token));
}

for (const token of [
  "asset_archive_readonly_preview_adapter_contract",
  "future_allowed_read_ref_patterns",
  "preview_display_state_mapping",
  "future_probe_gate",
  "real_asset_archive_read_performed",
  "asset_archive_manifest_read_performed",
  "preview_loaded_or_rendered"
]) {
  addResult(`fixture_token_${token}`, JSON.stringify(fixture).includes(token));
}

const forbiddenArchiveOpenPatterns = [
  "fs." + "readdirSync(path.join(root, " + JSON.stringify("asset_archive") + ")",
  "fs." + "readFileSync(path.join(root, " + JSON.stringify("asset_archive")
];
addResult(
  "validator_does_not_open_real_asset_archive",
  forbiddenArchiveOpenPatterns.every((pattern) => !validatorSource.includes(pattern))
);

const passed = failures.length === 0;
const output = {
  validator: "validate_asset_archive_readonly_preview_adapter_contract",
  version: "v1",
  passed,
  status: passed ? "asset_archive_readonly_preview_adapter_contract_verified" : "asset_archive_readonly_preview_adapter_contract_failed",
  draft_output_key: fixture.draft_output_key,
  adapter_id: fixture.adapter_id,
  contract_status: fixture.contract_status,
  can_execute_now: fixture.can_execute_now,
  preview_record_count: fixture.preview_records.length,
  max_manifest_reads: fixture.max_manifest_reads,
  max_preview_loads: fixture.max_preview_loads,
  real_asset_archive_read_performed: fixture.guard.real_asset_archive_read_performed,
  asset_archive_manifest_read_performed: fixture.guard.asset_archive_manifest_read_performed,
  asset_archive_preview_binary_read_performed: fixture.guard.asset_archive_preview_binary_read_performed,
  preview_loaded_or_rendered: fixture.guard.preview_loaded_or_rendered,
  file_write_performed: fixture.guard.file_write_performed,
  provider_contact_performed: fixture.guard.provider_contact_performed,
  plugin_call_performed: fixture.guard.plugin_call_performed,
  api_call_performed: fixture.guard.api_call_performed,
  image_generation_performed: fixture.guard.image_generation_performed,
  DailyNote_write_performed: fixture.guard.DailyNote_write_performed,
  VCP_memory_write_performed: fixture.guard.VCP_memory_write_performed,
  production_candidate_write_performed: fixture.guard.production_candidate_write_performed,
  check_count: checks.length,
  failed_count: failures.length,
  checks,
  failures
};

console.log(JSON.stringify(output, null, 2));
process.exit(passed ? 0 : 1);
