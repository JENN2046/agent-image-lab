#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { createRecoverabilityCore } = require("../../lib/artifact_recoverability_core");
const { validateCapsuleManifest } = require("../../lib/capsule_manifest_contract");

const repoRoot = path.resolve(__dirname, "../../..");
const privateRoot = path.join(repoRoot, ".agent_private");

function ensureDir(target) { fs.mkdirSync(target, { recursive: true }); }
function writeJson(target, value) { ensureDir(path.dirname(target)); fs.writeFileSync(target, `${JSON.stringify(value, null, 2)}\n`, "utf8"); }
function writeWebpStub(target) { ensureDir(path.dirname(target)); fs.writeFileSync(target, Buffer.from("not-a-webp")); }
function makeWorkspace(name) { ensureDir(privateRoot); return fs.mkdtempSync(path.join(privateRoot, `${name}-`)); }
function cleanup(workspace) {
  if (!workspace.startsWith(privateRoot + path.sep)) throw new Error(`refusing to clean outside .agent_private: ${workspace}`);
  fs.rmSync(workspace, { recursive: true, force: true });
}
function expect(condition, check, detail = null) { return { check, passed: Boolean(condition), ...(detail === null ? {} : { detail }) }; }

function baseManifest(sampleId, lane, sha256 = "0".repeat(64)) {
  const failure = lane === "failure";
  return {
    manifest_type: failure ? "git_portable_failure_sample_capsule_manifest" : "git_portable_preview_capsule_manifest",
    version: "v1",
    sample_id: sampleId,
    artifact: { preview: { path: "preview.webp", format: "webp", long_edge: 512, width: 512, height: 512, sha256, git_tracked: true }, original: { git_tracked: false, required_for_portable_validation: false, sha256_in_manifest: false } },
    chain: failure ? { failure_record: "failure_record.json", review_record: "review_record.json" } : { import_record: "import_record.json", review_record: "review_record.json", approval_record: "approval_record.json" },
    production_candidate_allowed: failure ? false : undefined,
    memory_write_allowed: failure ? false : undefined,
    DailyNote_write_allowed: failure ? false : undefined,
    guard: { provider_contact_performed: false, plugin_call_performed: false, api_call_performed: false, image_generation_performed: false, DailyNote_write_performed: false, VCP_memory_write_performed: false, runtime_execution_performed: false, real_manifest_read_performed: false, real_vcpchat_read_performed: false, real_vcptoolbox_read_performed: false }
  };
}

function writeChain(root, sampleId, lane) {
  const guard = { provider_contact_performed: false, plugin_call_performed: false, api_call_performed: false, image_generation_performed: false, DailyNote_write_performed: false, VCP_memory_write_performed: false, runtime_execution_performed: false, real_manifest_read_performed: false, real_vcpchat_read_performed: false, real_vcptoolbox_read_performed: false };
  if (lane === "accepted") {
    writeJson(path.join(root, "import_record.json"), { record_type: "git_portable_preview_capsule_import_record", sample_id: sampleId, guard });
    writeJson(path.join(root, "review_record.json"), { record_type: "git_portable_preview_capsule_review_record", sample_id: sampleId, guard });
    writeJson(path.join(root, "approval_record.json"), { record_type: "git_portable_preview_capsule_approval_record", sample_id: sampleId, guard });
  } else {
    writeJson(path.join(root, "failure_record.json"), { record_type: "git_portable_failure_sample_capsule_failure_record", sample_id: sampleId, guard });
    writeJson(path.join(root, "review_record.json"), { record_type: "git_portable_failure_sample_capsule_review_record", sample_id: sampleId, review_summary: { final_route: "failure_learning_only_never_production" }, guard });
  }
}

const checks = [];
const workspaces = [];

try {
  const missingManifest = makeWorkspace("manifest-missing");
  workspaces.push(missingManifest);
  ensureDir(path.join(missingManifest, "asset_archive", "accepted_samples", "sample_missing_manifest"));
  let core = createRecoverabilityCore(missingManifest);
  let result = validateCapsuleManifest(core, "accepted", "sample_missing_manifest");
  checks.push(expect(result.passed === false, "missing_manifest_fails", result));
  checks.push(expect(result.failure_classes.includes("missing_capsule_manifest"), "missing_manifest_classified", result.failure_classes));

  const sampleMismatch = makeWorkspace("manifest-sample-mismatch");
  workspaces.push(sampleMismatch);
  let root = path.join(sampleMismatch, "asset_archive", "accepted_samples", "sample_manifest_mismatch");
  writeJson(path.join(root, "manifest.json"), { ...baseManifest("other_sample", "accepted") });
  writeWebpStub(path.join(root, "preview.webp"));
  writeChain(root, "sample_manifest_mismatch", "accepted");
  core = createRecoverabilityCore(sampleMismatch);
  result = validateCapsuleManifest(core, "accepted", "sample_manifest_mismatch");
  checks.push(expect(result.passed === false, "sample_id_mismatch_fails", result.failures));
  checks.push(expect(result.failure_classes.includes("manifest_contract_mismatch"), "sample_id_mismatch_classified", result.failure_classes));

  const missingPreview = makeWorkspace("manifest-missing-preview");
  workspaces.push(missingPreview);
  root = path.join(missingPreview, "asset_archive", "accepted_samples", "sample_missing_preview");
  writeJson(path.join(root, "manifest.json"), baseManifest("sample_missing_preview", "accepted"));
  writeChain(root, "sample_missing_preview", "accepted");
  core = createRecoverabilityCore(missingPreview);
  result = validateCapsuleManifest(core, "accepted", "sample_missing_preview");
  checks.push(expect(result.passed === false, "missing_preview_fails", result.failures));
  checks.push(expect(result.failure_classes.includes("missing_preview_file"), "missing_preview_classified", result.failure_classes));

  const guardViolation = makeWorkspace("manifest-guard-violation");
  workspaces.push(guardViolation);
  root = path.join(guardViolation, "asset_archive", "failure_samples", "failure_guard_violation");
  const manifest = baseManifest("failure_guard_violation", "failure");
  manifest.memory_write_allowed = true;
  manifest.guard.VCP_memory_write_performed = true;
  writeJson(path.join(root, "manifest.json"), manifest);
  writeWebpStub(path.join(root, "preview.webp"));
  writeChain(root, "failure_guard_violation", "failure");
  core = createRecoverabilityCore(guardViolation);
  result = validateCapsuleManifest(core, "failure", "failure_guard_violation");
  checks.push(expect(result.passed === false, "guard_violation_fails", result.failures));
  checks.push(expect(result.failure_classes.includes("production_or_memory_guard_violation"), "guard_violation_classified", result.failure_classes));
} finally {
  for (const workspace of workspaces) cleanup(workspace);
}

const failed = checks.filter((check) => !check.passed);
const output = {
  validator: "validate_capsule_manifest_contract_negative_cases",
  version: "v1",
  passed: failed.length === 0,
  status: failed.length === 0 ? "capsule_manifest_contract_negative_cases_verified" : "capsule_manifest_contract_negative_cases_failed",
  fixture_count: 4,
  check_count: checks.length,
  failed_count: failed.length,
  temp_workspace_root_class: ".agent_private",
  real_capsule_modified: false,
  preview_creation_or_copy_performed: false,
  image_generation_performed: false,
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
console.log(JSON.stringify(output, null, 2));
process.exit(output.passed ? 0 : 1);
