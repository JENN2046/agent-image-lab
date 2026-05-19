#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const repoRoot = path.resolve(__dirname, "..");
const validatorPath = path.join(repoRoot, "scripts", "validate_failure_sample_capsule_registry.js");
const privateRoot = path.join(repoRoot, ".agent_private");

function ensureDir(target) {
  fs.mkdirSync(target, { recursive: true });
}

function writeJson(target, value) {
  ensureDir(path.dirname(target));
  fs.writeFileSync(target, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function makeWorkspace(name) {
  ensureDir(privateRoot);
  const tempRoot = fs.mkdtempSync(path.join(privateRoot, `${name}-`));
  ensureDir(path.join(tempRoot, "asset_archive", "failure_samples"));
  return tempRoot;
}

function runValidator(cwd, args = []) {
  const run = spawnSync(process.execPath, [validatorPath, ...args], {
    cwd,
    encoding: "utf8",
  });
  let parsed = null;
  try {
    parsed = JSON.parse(run.stdout);
  } catch (error) {
    parsed = {
      passed: false,
      status: "validator_output_parse_failed",
      parse_error: error.message,
      stdout: run.stdout,
      stderr: run.stderr,
    };
  }
  return {
    exitCode: run.status,
    stdout: run.stdout,
    stderr: run.stderr,
    result: parsed,
  };
}

function writeMinimalManifest(tempRoot, sampleId, overrides = {}) {
  const root = path.join(tempRoot, "asset_archive", "failure_samples", sampleId);
  ensureDir(root);
  writeJson(path.join(root, "manifest.json"), {
    manifest_type: "git_portable_failure_preview_capsule_manifest",
    version: "v1",
    sample_id: sampleId,
    artifact: {
      preview: {
        path: "preview.webp",
        format: "webp",
        long_edge: 512,
        sha256: overrides.previewSha256 || "0".repeat(64),
      },
      original: {
        required_for_portable_validation: false,
      },
    },
    failure: {
      failure_record: "failure_record.json",
    },
    chain: {
      review_record: "review_record.json",
    },
    production_candidate_allowed: overrides.productionCandidateAllowed ?? false,
    memory_write_allowed: overrides.memoryWriteAllowed ?? false,
    DailyNote_write_allowed: overrides.dailyNoteWriteAllowed ?? false,
  });
  if (overrides.failureRecord !== false) writeJson(path.join(root, "failure_record.json"), { fixture: true });
  if (overrides.reviewRecord !== false) writeJson(path.join(root, "review_record.json"), { fixture: true });
  return root;
}

function expect(condition, check, detail = null) {
  return { check, passed: Boolean(condition), detail };
}

function cleanup(tempRoot) {
  if (!tempRoot.startsWith(privateRoot + path.sep)) {
    throw new Error(`refusing to clean outside .agent_private: ${tempRoot}`);
  }
  fs.rmSync(tempRoot, { recursive: true, force: true });
}

const checks = [];
const workspaces = [];

try {
  const emptyRoot = makeWorkspace("p5d-empty-registry");
  workspaces.push(emptyRoot);
  const emptyDefault = runValidator(emptyRoot);
  checks.push(expect(emptyDefault.exitCode === 0, "empty_registry_default_exits_zero", emptyDefault.exitCode));
  checks.push(expect(emptyDefault.result.passed === true, "empty_registry_default_passed_true", emptyDefault.result.status));
  checks.push(expect(emptyDefault.result.total_samples === 0, "empty_registry_default_total_zero", emptyDefault.result.total_samples));

  const emptyRequireOne = runValidator(emptyRoot, ["--require-at-least=1"]);
  checks.push(expect(emptyRequireOne.exitCode !== 0, "empty_registry_require_one_exits_nonzero", emptyRequireOne.exitCode));
  checks.push(expect(emptyRequireOne.result.passed === false, "empty_registry_require_one_passed_false", emptyRequireOne.result.status));
  checks.push(expect(emptyRequireOne.result.failures?.includes("sample_count_below_required_minimum"), "empty_registry_require_one_reports_minimum_failure", emptyRequireOne.result.failures));
  checks.push(expect(emptyRequireOne.result.failure_class_summary?.registry_configuration === 1, "empty_registry_require_one_classified", emptyRequireOne.result.failure_class_summary));

  const missingManifestRoot = makeWorkspace("p5d-missing-manifest");
  workspaces.push(missingManifestRoot);
  ensureDir(path.join(missingManifestRoot, "asset_archive", "failure_samples", "sample_missing_manifest"));
  const missingManifest = runValidator(missingManifestRoot);
  checks.push(expect(missingManifest.exitCode !== 0, "missing_manifest_exits_nonzero", missingManifest.exitCode));
  checks.push(expect(missingManifest.result.failed_count === 1, "missing_manifest_failed_count_one", missingManifest.result.failed_count));
  checks.push(expect(missingManifest.result.samples?.[0]?.failure_classes?.includes("missing_capsule_manifest"), "missing_manifest_classified", missingManifest.result.samples?.[0]?.failure_classes));

  const missingPreviewRoot = makeWorkspace("p5d-missing-preview");
  workspaces.push(missingPreviewRoot);
  writeMinimalManifest(missingPreviewRoot, "sample_missing_preview");
  const missingPreview = runValidator(missingPreviewRoot);
  checks.push(expect(missingPreview.exitCode !== 0, "missing_preview_exits_nonzero", missingPreview.exitCode));
  checks.push(expect(missingPreview.result.samples?.[0]?.failures?.includes("preview_file_exists"), "missing_preview_reports_preview_file_exists_failure", missingPreview.result.samples?.[0]?.failures));
  checks.push(expect(missingPreview.result.samples?.[0]?.failure_classes?.includes("missing_preview_file"), "missing_preview_classified", missingPreview.result.samples?.[0]?.failure_classes));

  const hashMismatchRoot = makeWorkspace("p5d-hash-mismatch");
  workspaces.push(hashMismatchRoot);
  const hashSampleRoot = writeMinimalManifest(hashMismatchRoot, "sample_hash_mismatch");
  fs.writeFileSync(path.join(hashSampleRoot, "preview.webp"), "not a generated image\n", "utf8");
  const hashMismatch = runValidator(hashMismatchRoot);
  checks.push(expect(hashMismatch.exitCode !== 0, "hash_mismatch_exits_nonzero", hashMismatch.exitCode));
  checks.push(expect(hashMismatch.result.samples?.[0]?.failures?.includes("preview_sha256_matches_manifest"), "hash_mismatch_reports_sha256_failure", hashMismatch.result.samples?.[0]?.failures));
  checks.push(expect(hashMismatch.result.samples?.[0]?.failure_classes?.includes("preview_hash_mismatch"), "hash_mismatch_classified", hashMismatch.result.samples?.[0]?.failure_classes));

  const missingRecordRoot = makeWorkspace("p5d-missing-records");
  workspaces.push(missingRecordRoot);
  writeMinimalManifest(missingRecordRoot, "sample_missing_records", { failureRecord: false, reviewRecord: false });
  const missingRecord = runValidator(missingRecordRoot);
  checks.push(expect(missingRecord.exitCode !== 0, "missing_records_exits_nonzero", missingRecord.exitCode));
  checks.push(expect(missingRecord.result.samples?.[0]?.failures?.includes("failure_record_exists"), "missing_failure_record_reported", missingRecord.result.samples?.[0]?.failures));
  checks.push(expect(missingRecord.result.samples?.[0]?.failures?.includes("review_record_exists"), "missing_review_record_reported", missingRecord.result.samples?.[0]?.failures));
  checks.push(expect(missingRecord.result.samples?.[0]?.failure_classes?.includes("missing_chain_file"), "missing_records_classified", missingRecord.result.samples?.[0]?.failure_classes));

  const guardViolationRoot = makeWorkspace("p5d-guard-violation");
  workspaces.push(guardViolationRoot);
  writeMinimalManifest(guardViolationRoot, "sample_guard_violation", {
    productionCandidateAllowed: true,
    memoryWriteAllowed: true,
    dailyNoteWriteAllowed: true,
  });
  const guardViolation = runValidator(guardViolationRoot);
  checks.push(expect(guardViolation.exitCode !== 0, "guard_violation_exits_nonzero", guardViolation.exitCode));
  checks.push(expect(guardViolation.result.samples?.[0]?.failures?.includes("production_candidate_allowed_false"), "production_candidate_guard_reported", guardViolation.result.samples?.[0]?.failures));
  checks.push(expect(guardViolation.result.samples?.[0]?.failures?.includes("memory_write_allowed_false"), "memory_guard_reported", guardViolation.result.samples?.[0]?.failures));
  checks.push(expect(guardViolation.result.samples?.[0]?.failures?.includes("DailyNote_write_allowed_false"), "dailynote_guard_reported", guardViolation.result.samples?.[0]?.failures));
  checks.push(expect(guardViolation.result.samples?.[0]?.failure_classes?.includes("production_or_memory_guard_violation"), "guard_violation_classified", guardViolation.result.samples?.[0]?.failure_classes));
} finally {
  for (const workspace of workspaces) cleanup(workspace);
}

const failed = checks.filter((check) => !check.passed);
const result = {
  passed: failed.length === 0,
  status: failed.length === 0
    ? "failure_sample_capsule_negative_cases_verified"
    : "failure_sample_capsule_negative_cases_failed",
  check_count: checks.length,
  failed_count: failed.length,
  temp_workspace_root_class: ".agent_private",
  real_failure_capsule_modified: false,
  image_generation_performed: false,
  preview_creation_or_copy_performed: false,
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  DailyNote_write_performed: false,
  VCP_memory_write_performed: false,
  runtime_execution_performed: false,
  real_manifest_read_performed: false,
  real_vcpchat_read_performed: false,
  real_vcptoolbox_read_performed: false,
  push_tag_release_deploy_performed: false,
  checks,
  failures: failed,
};

process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
process.exit(result.passed ? 0 : 1);
