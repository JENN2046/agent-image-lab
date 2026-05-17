#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const inputRef = "tests/schema_examples/v14_149_authorization_package_compiler_input.example.yaml";

function repoPath(relativePath) {
  const resolved = path.resolve(root, relativePath);
  const relative = path.relative(root, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`path escapes repository root: ${relativePath}`);
  }
  return resolved;
}

function read(relativePath) {
  return fs.readFileSync(repoPath(relativePath), "utf8");
}

function token(text, value) {
  return text.includes(value);
}

const input = read(inputRef);
const sampleId = "accepted_womens_resort_relaxed_knit_codex_v2_001";
const sourceArtifact =
  "runs/real_generation/v14_105_codex_session_womens_resort_relaxed_knit_final_candidate/codex_session_womens_resort_relaxed_knit_final_v2.png";
const importRecord =
  "runs/real_generation/v14_105_codex_session_womens_resort_relaxed_knit_final_candidate/resort_relaxed_knit_final_import_record.json";
const reviewRecord = "docs/v14_105_codex_session_womens_resort_relaxed_knit_final_review.md";
const approvalRecord = "docs/v14_107_womens_resort_relaxed_knit_accepted_sample_closeout.md";
const archiveRoot = `asset_archive/accepted/fashion_lookbook_portrait/${sampleId}/`;
const archiveManifest = `${archiveRoot}archive_manifest.yaml`;
const productionPlan = "production/plans/womens_resort_relaxed_knit_codex_v2_production_candidate_001_plan.yaml";
const productionReview = "production/reviews/womens_resort_relaxed_knit_codex_v2_production_candidate_001_review.md";
const memoryDraft = "tests/schema_examples/v14_148_memory_delta_draft_package.example.yaml";

const validationRequired = [
  "git diff --check",
  "node scripts/validate_agent_board_state.js",
  "powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1",
  "powershell -ExecutionPolicy Bypass -File scripts/validate-agent-image-lab-local.ps1",
];

function packageBase(kind, authorizationId, status = "prepared_not_granted") {
  return {
    kind,
    authorization_id: authorizationId,
    package_status: status,
    execution_authorized_by_this_package: false,
    execution_performed: false,
    validation_required: validationRequired,
  };
}

const packages = [
  {
    ...packageBase("durable_archive", "AUTH-PENDING-WOMENS-RESORT-KNIT-DURABLE-ARCHIVE-20260517-001"),
    target_systems: ["Agent Image Lab local asset_archive"],
    exact_allowed_paths: [sourceArtifact, importRecord, "docs/v14_131_real_artifact_validation_and_accepted_sample_recoverability_gate.md", archiveRoot, archiveManifest],
    allowed_operations: ["read_source_artifact_binary_once", "compute_sha256", "copy_one_image_binary_to_allowed_archive_path", "write_archive_manifest_yaml"],
    forbidden_operations: ["provider_API_plugin_MCP_call", "image_generation", "production_candidate_write", "DailyNote_write", "VCP_memory_write", "real_manifest_VCPChat_VCPToolBox_read", "push_tag_release_deploy"],
  },
  {
    ...packageBase("production_candidate", "AUTH-PENDING-WOMENS-RESORT-KNIT-PRODUCTION-CANDIDATE-20260517-001"),
    target_systems: ["Agent Image Lab local production metadata"],
    exact_allowed_paths: ["accepted_samples/accepted_sample_registry.yaml", "accepted_samples/categories/fashion_lookbook_portrait.yaml", reviewRecord, approvalRecord, productionPlan, productionReview],
    allowed_operations: ["write_production_candidate_plan_yaml", "write_production_candidate_review_summary"],
    forbidden_operations: ["image_binary_copy", "runs_source_image_modification", "provider_API_plugin_MCP_call", "image_generation", "DailyNote_write", "VCP_memory_write", "real_manifest_VCPChat_VCPToolBox_read", "push_tag_release_deploy"],
  },
  {
    ...packageBase("memory_write", "AUTH-PENDING-WOMENS-RESORT-KNIT-MEMORY-WRITE-20260517-001"),
    target_systems: ["DailyNote", "VCP memory"],
    exact_allowed_paths: [memoryDraft, reviewRecord, "accepted_samples/accepted_sample_registry.yaml"],
    allowed_operations: ["read_memory_delta_draft", "write_one_DailyNote_entry", "write_one_VCP_memory_entry_if_DailyNote_write_succeeds"],
    forbidden_operations: ["image_binary_read_or_copy", "runs_source_image_modification", "production_candidate_write", "accepted_samples_write", "failure_samples_write", "provider_API_plugin_MCP_call", "image_generation", "real_manifest_VCPChat_VCPToolBox_read", "push_tag_release_deploy"],
  },
  {
    ...packageBase("manifest_read", "AUTH-PENDING-VCP-MANIFEST-READ-20260517-001", "prepared_incomplete_not_granted"),
    target_systems: ["future real VCP manifest"],
    exact_allowed_paths: [],
    missing_required_fields: ["exact_real_manifest_path"],
    allowed_operations: ["read_one_explicit_manifest_file_after_Jenn_provides_exact_path"],
    forbidden_operations: ["read_directory_tree", "read_VCPChat_source", "read_VCPToolBox_source", "plugin_API_MCP_call", "runtime_integration", "write_files", "push_tag_release_deploy"],
  },
];

const summary = {
  authorization_package_compiler: "v14_149_authorization_package_compiler",
  version: "v1",
  input_ref: inputRef,
  input_verified: token(input, sampleId) && token(input, "compiled_package_count: 4"),
  package_count: packages.length,
  package_kinds: packages.map((pkg) => pkg.kind),
  packages,
  split_guards: {
    durable_archive_is_not_production_candidate: true,
    production_candidate_is_not_memory_write: true,
    memory_write_is_not_manifest_read: true,
    manifest_read_is_not_runtime_integration: true,
  },
  authorization_granted_by_compiler: false,
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  mcp_runtime_performed: false,
  image_generation_performed: false,
  real_manifest_read_performed: false,
  real_vcpchat_read_performed: false,
  real_vcptoolbox_read_performed: false,
  archive_manifest_written: false,
  image_binary_copy_performed: false,
  production_candidate_write_performed: false,
  daily_note_write_performed: false,
  vcp_memory_write_performed: false,
  output_file_write_performed: false,
  push_tag_release_deploy_performed: false,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
