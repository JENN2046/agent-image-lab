#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const repoRoot = path.resolve(__dirname, "..");
const validatorPath = path.join(repoRoot, "scripts", "validate_preview_capsule_registry.js");
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
  ensureDir(path.join(tempRoot, "asset_archive", "accepted_samples"));
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

function writeMinimalManifest(tempRoot, sampleId, previewSha256) {
  const root = path.join(tempRoot, "asset_archive", "accepted_samples", sampleId);
  ensureDir(root);
  writeJson(path.join(root, "manifest.json"), {
    manifest_type: "git_portable_preview_capsule_manifest",
    version: "v1",
    sample_id: sampleId,
    artifact: {
      preview: {
        path: "preview.webp",
        format: "webp",
        long_edge: 512,
        width: 512,
        height: 512,
        sha256: previewSha256,
        git_tracked: true,
      },
      original: {
        git_tracked: false,
        sha256_in_manifest: false,
        required_for_portable_validation: false,
      },
    },
    chain: {
      import_record: "import_record.json",
      review_record: "review_record.json",
      approval_record: "approval_record.json",
    },
    guard: {
      provider_contact_performed: false,
      plugin_call_performed: false,
      api_call_performed: false,
      image_generation_performed: false,
      DailyNote_write_performed: false,
      VCP_memory_write_performed: false,
      runtime_execution_performed: false,
      real_manifest_read_performed: false,
      real_vcpchat_read_performed: false,
      real_vcptoolbox_read_performed: false,
    },
  });
  writeJson(path.join(root, "import_record.json"), { fixture: true });
  writeJson(path.join(root, "review_record.json"), { fixture: true });
  writeJson(path.join(root, "approval_record.json"), { fixture: true });
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
  const emptyRoot = makeWorkspace("p2b-empty-registry");
  workspaces.push(emptyRoot);
  const empty = runValidator(emptyRoot);
  checks.push(expect(empty.exitCode !== 0, "empty_registry_exits_nonzero", empty.exitCode));
  checks.push(expect(empty.result.passed === false, "empty_registry_passed_false", empty.result.status));
  checks.push(expect(empty.result.failures?.includes("sample_count_below_required_minimum"), "empty_registry_reports_minimum_failure", empty.result.failures));

  const missingManifestRoot = makeWorkspace("p2b-missing-manifest");
  workspaces.push(missingManifestRoot);
  ensureDir(path.join(missingManifestRoot, "asset_archive", "accepted_samples", "sample_missing_manifest"));
  const missingManifest = runValidator(missingManifestRoot);
  checks.push(expect(missingManifest.exitCode !== 0, "missing_manifest_exits_nonzero", missingManifest.exitCode));
  checks.push(expect(missingManifest.result.failed_count === 1, "missing_manifest_failed_count_one", missingManifest.result.failed_count));
  checks.push(expect(missingManifest.result.samples?.[0]?.status === "preview_capsule_missing", "missing_manifest_status_preview_capsule_missing", missingManifest.result.samples?.[0]));

  const missingPreviewRoot = makeWorkspace("p2b-missing-preview");
  workspaces.push(missingPreviewRoot);
  writeMinimalManifest(missingPreviewRoot, "sample_missing_preview", "0".repeat(64));
  const missingPreview = runValidator(missingPreviewRoot);
  checks.push(expect(missingPreview.exitCode !== 0, "missing_preview_exits_nonzero", missingPreview.exitCode));
  checks.push(expect(missingPreview.result.samples?.[0]?.failures?.includes("preview_file_exists"), "missing_preview_reports_preview_file_exists_failure", missingPreview.result.samples?.[0]?.failures));

  const hashMismatchRoot = makeWorkspace("p2b-hash-mismatch");
  workspaces.push(hashMismatchRoot);
  const hashSampleRoot = writeMinimalManifest(hashMismatchRoot, "sample_hash_mismatch", "0".repeat(64));
  fs.writeFileSync(path.join(hashSampleRoot, "preview.webp"), "not a generated image\n", "utf8");
  const hashMismatch = runValidator(hashMismatchRoot);
  checks.push(expect(hashMismatch.exitCode !== 0, "hash_mismatch_exits_nonzero", hashMismatch.exitCode));
  checks.push(expect(hashMismatch.result.samples?.[0]?.failures?.includes("preview_sha256_matches_manifest"), "hash_mismatch_reports_sha256_failure", hashMismatch.result.samples?.[0]?.failures));

  const currentShaMismatch = runValidator(repoRoot, ["--long-edge=1024"]);
  checks.push(expect(currentShaMismatch.exitCode !== 0, "wrong_long_edge_exits_nonzero", currentShaMismatch.exitCode));
  checks.push(expect(currentShaMismatch.result.samples?.[0]?.failures?.includes("preview_manifest_long_edge_matches"), "wrong_long_edge_reports_manifest_long_edge_failure", currentShaMismatch.result.samples?.[0]?.failures));
  checks.push(expect(currentShaMismatch.result.samples?.[0]?.failures?.includes("preview_file_long_edge_matches"), "wrong_long_edge_reports_file_long_edge_failure", currentShaMismatch.result.samples?.[0]?.failures));
} finally {
  for (const workspace of workspaces) {
    cleanup(workspace);
  }
}

const failed = checks.filter((check) => !check.passed);
const result = {
  passed: failed.length === 0,
  status: failed.length === 0
    ? "registry_preview_capsule_negative_cases_verified"
    : "registry_preview_capsule_negative_cases_failed",
  check_count: checks.length,
  failed_count: failed.length,
  temp_workspace_root_class: ".agent_private",
  real_capsule_modified: false,
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
