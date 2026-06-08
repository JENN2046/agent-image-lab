#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "../../..");
const files = {
  doc: "docs/review_console_asset_archive_exact_read_activation_package.md",
  fixture: "tests/schema_examples/ASSET_ARCHIVE_EXACT_READ_ACTIVATION_PACKAGE.example.json",
  probeGateFixture: "tests/schema_examples/ASSET_ARCHIVE_EXACT_READ_PREVIEW_PROBE_GATE.example.json",
  validator: "scripts/validators/review_console/validate_asset_archive_exact_read_activation_package.js"
};

const falseGuardKeys = [
  "can_execute_now",
  "actual_read_execution_authorized_now",
  "real_asset_archive_read_performed",
  "asset_archive_directory_listing_performed",
  "asset_archive_manifest_read_performed",
  "asset_archive_preview_binary_read_performed",
  "asset_archive_original_binary_read_performed",
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

function pathLooksSafeRepoRelative(value) {
  return typeof value === "string" &&
    !value.includes("..") &&
    !value.includes("*") &&
    !value.includes("\\") &&
    !value.startsWith("/") &&
    !/^[A-Za-z]:/.test(value) &&
    !value.startsWith("http://") &&
    !value.startsWith("https://") &&
    !value.startsWith("file://");
}

function expectedManifestForPreview(previewRef) {
  return previewRef.replace(/\/preview\.webp$/, "/manifest.json");
}

function selectedKey(item) {
  return `${item.lane}:${item.sample_id}:${item.manifest_ref}:${item.preview_ref}:${item.css_skin_fallback}`;
}

function evaluate(pkg, gate) {
  const refs = Array.isArray(pkg.selected_preview_refs) ? pkg.selected_preview_refs : [];
  const gateRefs = Array.isArray(gate.selected_preview_refs) ? gate.selected_preview_refs : [];
  const budget = isPlainObject(pkg.future_execution_budget) ? pkg.future_execution_budget : {};
  const receipt = isPlainObject(pkg.receipt_plan) ? pkg.receipt_plan : {};
  const rollback = isPlainObject(pkg.rollback_plan) ? pkg.rollback_plan : {};
  const stops = isPlainObject(pkg.stop_conditions) ? pkg.stop_conditions : {};
  const guard = isPlainObject(pkg.guard) ? pkg.guard : {};

  const identityOk =
    pkg.phase === "review_console_asset_archive_exact_read_activation_package" &&
    pkg.package_status === "prepared_execute_decision_required" &&
    pkg.package_type === "exact_read_activation_package" &&
    pkg.source_probe_gate_ref === "docs/review_console_asset_archive_exact_read_preview_probe_gate.md" &&
    pkg.source_probe_gate_fixture_ref === "tests/schema_examples/ASSET_ARCHIVE_EXACT_READ_PREVIEW_PROBE_GATE.example.json" &&
    pkg.fixture_ref === "tests/schema_examples/ASSET_ARCHIVE_EXACT_READ_ACTIVATION_PACKAGE.example.json" &&
    pkg.execution_mode === "activation_package_no_read_execution" &&
    pkg.can_execute_now === false &&
    pkg.actual_read_execution_authorized_now === false &&
    pkg.read_execution_decision_state === "undecided" &&
    pkg.explicit_execute_question === "Execute the exact-read preview probe now for the 3 selected refs, yes or no?";

  const gateConsistencyOk =
    refs.length === gateRefs.length &&
    refs.length === 3 &&
    arrayEquals(refs.map(selectedKey), gateRefs.map(selectedKey));

  const refsOk =
    refs.length === 3 &&
    refs.every((item) =>
      typeof item.activation_ref_id === "string" &&
      item.activation_ref_id.startsWith("activation-exact-read-") &&
      typeof item.preview_probe_id === "string" &&
      item.preview_probe_id.startsWith("exact-read-preview-probe-") &&
      ["accepted", "failure"].includes(item.lane) &&
      typeof item.sample_id === "string" &&
      item.preview_ref.startsWith(item.lane === "failure" ? "asset_archive/failure_samples/" : "asset_archive/accepted_samples/") &&
      item.preview_ref.endsWith("/preview.webp") &&
      item.manifest_ref === expectedManifestForPreview(item.preview_ref) &&
      pathLooksSafeRepoRelative(item.preview_ref) &&
      pathLooksSafeRepoRelative(item.manifest_ref) &&
      ["product_still_life", "studio_dashboard", "evidence_blocker"].includes(item.css_skin_fallback) &&
      item.planned_operation_if_activated === "read_manifest_then_load_preview_once" &&
      item.existence_verified_now === false &&
      item.manifest_read_performed === false &&
      item.preview_binary_read_performed === false &&
      item.preview_loaded_or_rendered === false
    );

  const budgetOk =
    budget.max_manifest_reads === 3 &&
    budget.max_preview_loads === 3 &&
    budget.max_directory_listings === 0 &&
    budget.max_original_asset_reads === 0 &&
    budget.max_writes_before_receipt === 0 &&
    budget.retry_allowed === false &&
    budget.fallback_to_glob_allowed === false &&
    budget.provider_plugin_api_allowed === false &&
    budget.allowed_operation_if_activated === "read_selected_manifest_and_preview_refs_once";

  const receiptOk =
    receipt.receipt_required_if_executed === true &&
    receipt.receipt_write_authorized_now === false &&
    receipt.planned_receipt_ref === "reports/review_console_asset_archive_readonly_preview_probe/asset_archive_exact_read_preview_probe_receipt_20260607.json" &&
    pathLooksSafeRepoRelative(receipt.planned_receipt_ref) &&
    Array.isArray(receipt.receipt_must_record) &&
    receipt.receipt_must_record.includes("selected_refs_repeated_exactly") &&
    receipt.receipt_must_record.includes("guard_flags");

  const rollbackOk =
    rollback.no_persistent_state_before_execution === true &&
    rollback.if_executed_drop_in_memory_preview_overlay === true &&
    rollback.restore_css_skin_only_preview_display_fallback === true &&
    rollback.no_asset_archive_cleanup_needed_because_no_writes_allowed === true;

  const stopsOk = [
    "stop_on_fourth_ref",
    "stop_on_directory_listing_need",
    "stop_on_broad_asset_archive_glob",
    "stop_on_original_asset_read_need",
    "stop_on_runs_source_image_read_need",
    "stop_on_write_need_before_receipt",
    "stop_on_provider_plugin_api_need",
    "stop_on_daily_note_or_vcp_memory_need",
    "stop_on_production_candidate_write_need",
    "stop_on_secret_or_absolute_path"
  ].every((key) => stops[key] === true);

  const guardTrueOk =
    guard.activation_package_only === true &&
    guard.read_only_intent === true &&
    guard.execute_decision_required === true;

  const guardFalseOk = falseGuardKeys.every((key) => guard[key] === false);

  return {
    passed: identityOk && gateConsistencyOk && refsOk && budgetOk && receiptOk && rollbackOk && stopsOk && guardTrueOk && guardFalseOk,
    identityOk,
    gateConsistencyOk,
    refsOk,
    budgetOk,
    receiptOk,
    rollbackOk,
    stopsOk,
    guardTrueOk,
    guardFalseOk
  };
}

for (const [key, rel] of Object.entries(files)) {
  addResult(`${key}_exists`, fs.existsSync(relPath(rel)) && fs.statSync(relPath(rel)).isFile(), rel);
}

const doc = readText(files.doc);
const validatorSource = readText(files.validator);
const fixture = readJson(files.fixture).asset_archive_exact_read_activation_package;
const gate = readJson(files.probeGateFixture).asset_archive_exact_read_preview_probe_gate;
const baseEval = evaluate(fixture, gate);

addResult("activation_package_fixture_passes", baseEval.passed, baseEval);

const executeNow = clone(fixture);
executeNow.can_execute_now = true;
executeNow.guard.can_execute_now = true;
addResult("negative_case_can_execute_now_fails", evaluate(executeNow, gate).passed === false);

const authorizedNow = clone(fixture);
authorizedNow.actual_read_execution_authorized_now = true;
authorizedNow.guard.actual_read_execution_authorized_now = true;
addResult("negative_case_actual_read_authorized_now_fails", evaluate(authorizedNow, gate).passed === false);

const mismatchedRef = clone(fixture);
mismatchedRef.selected_preview_refs[0].preview_ref = "asset_archive/accepted_samples/other_sample/preview.webp";
mismatchedRef.selected_preview_refs[0].manifest_ref = "asset_archive/accepted_samples/other_sample/manifest.json";
addResult("negative_case_probe_gate_ref_mismatch_fails", evaluate(mismatchedRef, gate).gateConsistencyOk === false);

const missingReceipt = clone(fixture);
missingReceipt.receipt_plan.planned_receipt_ref = "";
addResult("negative_case_missing_receipt_ref_fails", evaluate(missingReceipt, gate).receiptOk === false);

const readClaim = clone(fixture);
readClaim.guard.asset_archive_manifest_read_performed = true;
readClaim.selected_preview_refs[0].manifest_read_performed = true;
addResult("negative_case_manifest_read_claim_fails", evaluate(readClaim, gate).passed === false);

for (const token of [
  "package_status: prepared_execute_decision_required",
  "can_execute_now: false",
  "actual_read_execution_authorized_now: false",
  "read_execution_decision_state: undecided",
  "Execute the exact-read preview probe now for the 3 selected refs, yes or no?",
  "node scripts/validate_asset_archive_exact_read_activation_package.js"
]) {
  addResult(`doc_token_${token}`, doc.includes(token));
}

for (const token of [
  "asset_archive_exact_read_activation_package",
  "selected_preview_refs",
  "future_execution_budget",
  "receipt_plan",
  "rollback_plan",
  "stop_conditions",
  "actual_read_execution_authorized_now",
  "real_asset_archive_read_performed"
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
  validator: "validate_asset_archive_exact_read_activation_package",
  version: "v1",
  passed,
  status: passed ? "asset_archive_exact_read_activation_package_verified" : "asset_archive_exact_read_activation_package_failed",
  package_status: fixture.package_status,
  can_execute_now: fixture.can_execute_now,
  actual_read_execution_authorized_now: fixture.actual_read_execution_authorized_now,
  read_execution_decision_state: fixture.read_execution_decision_state,
  selected_preview_ref_count: fixture.selected_preview_refs.length,
  selected_preview_refs: fixture.selected_preview_refs.map((item) => item.preview_ref),
  planned_receipt_ref: fixture.receipt_plan.planned_receipt_ref,
  real_asset_archive_read_performed: fixture.guard.real_asset_archive_read_performed,
  asset_archive_directory_listing_performed: fixture.guard.asset_archive_directory_listing_performed,
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
