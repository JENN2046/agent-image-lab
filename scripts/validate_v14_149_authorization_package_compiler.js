#!/usr/bin/env node
"use strict";

const { execFileSync } = require("node:child_process");
const path = require("node:path");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);

const files = {
  phaseRecord: "docs/v14_149_authorization_package_compiler.md",
  compilerSchema: "schemas/authorization_package_compiler.schema.yaml",
  compilerInput: "tests/schema_examples/v14_149_authorization_package_compiler_input.example.yaml",
  compiler: "scripts/compile_v14_149_authorization_packages.js",
  v14_146_validator: "scripts/validate_v14_146_durable_archive_dry_run_manifest.js",
  v14_147_validator: "scripts/validate_v14_147_production_candidate_eligibility_preflight.js",
  v14_148_validator: "scripts/validate_v14_148_memory_delta_draft_package.js",
  currentValidator: "scripts/validate_v14_149_authorization_package_compiler.js",
  mvpValidator: "scripts/validate_mvp.ps1",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
  validationLog: ".agent_board/VALIDATION_LOG.md",
};

const requiredKinds = ["durable_archive", "production_candidate", "memory_write", "manifest_read"];
const requiredValidation = [
  "git diff --check",
  "node scripts/validate_agent_board_state.js",
  "powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1",
  "powershell -ExecutionPolicy Bypass -File scripts/validate-agent-image-lab-local.ps1",
];

const results = [];
const errors = [];

function addResult(check, passed, detail) {
  results.push({ check, passed: Boolean(passed), ...(detail ? { detail } : {}) });
  if (!passed) errors.push({ check, detail: detail || "check failed" });
}

function requireToken(label, text, token) {
  addResult(`${label}_token_${token}_present`, text.includes(token));
}

function forbidPattern(label, text, pattern) {
  addResult(`${label}_forbidden_${pattern}_absent`, !pattern.test(text), `${pattern}`);
}

function runJson(scriptPath) {
  return JSON.parse(execFileSync(process.execPath, [scriptPath], { cwd: root, encoding: "utf8" }));
}

function evaluatePackages(packages) {
  const kinds = packages.map((pkg) => pkg.kind);
  const allKindsPresent = requiredKinds.every((kind) => kinds.includes(kind));
  const allNotGranted = packages.every((pkg) => pkg.execution_authorized_by_this_package === false && pkg.execution_performed === false);
  const allHaveValidation = packages.every((pkg) =>
    requiredValidation.every((command) => Array.isArray(pkg.validation_required) && pkg.validation_required.includes(command))
  );
  const archive = packages.find((pkg) => pkg.kind === "durable_archive");
  const production = packages.find((pkg) => pkg.kind === "production_candidate");
  const memory = packages.find((pkg) => pkg.kind === "memory_write");
  const manifest = packages.find((pkg) => pkg.kind === "manifest_read");
  const split =
    archive &&
    production &&
    memory &&
    manifest &&
    !archive.allowed_operations.includes("write_production_candidate_plan_yaml") &&
    !production.allowed_operations.includes("write_one_DailyNote_entry") &&
    !memory.allowed_operations.includes("write_archive_manifest_yaml") &&
    manifest.package_status === "prepared_incomplete_not_granted" &&
    Array.isArray(manifest.exact_allowed_paths) &&
    manifest.exact_allowed_paths.length === 0 &&
    Array.isArray(manifest.missing_required_fields) &&
    manifest.missing_required_fields.includes("exact_real_manifest_path");
  return {
    passed: packages.length === 4 && allKindsPresent && allNotGranted && allHaveValidation && Boolean(split),
    allKindsPresent,
    allNotGranted,
    allHaveValidation,
    split: Boolean(split),
  };
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, core.exists(relativePath), relativePath);
}

const phaseRecord = core.read(files.phaseRecord);
const schema = core.read(files.compilerSchema);
const input = core.read(files.compilerInput);
const compilerSource = core.read(files.compiler);
const packageSurfaces = [phaseRecord, schema, input, compilerSource].join("\n");
const currentSurfaces = [
  phaseRecord,
  schema,
  input,
  compilerSource,
  core.read(files.runState),
  core.read(files.taskQueue),
  core.read(files.checkpoint),
  core.read(files.handoff),
  core.read(files.validationLog),
  core.read(files.mvpValidator),
].join("\n");

for (const token of [
  "authorization_package_compiler:",
  "compiler_type: a5_authorization_package_compiler",
  "execution_mode: local_stdout_only",
  "authorization_granted_by_compiler: false",
  "output_file_write_allowed: false",
  "required_count: 4",
  "durable_archive_is_not_production_candidate: true",
  "manifest_read_is_not_runtime_integration: true",
]) {
  requireToken("compiler_schema", schema, token);
}

for (const token of [
  "phase: v14_149_authorization_package_compiler",
  "compiled_package_count: 4",
  "- durable_archive",
  "- production_candidate",
  "- memory_write",
  "- manifest_read",
  "exact_real_manifest_path_provided: false",
  "package_status: prepared_incomplete_not_granted",
]) {
  requireToken("compiler_input", input, token);
}

let compilerOutput = null;
let v14_146 = null;
let v14_147 = null;
let v14_148 = null;
try {
  compilerOutput = runJson(files.compiler);
  addResult("compiler_runs_and_outputs_json", compilerOutput.authorization_package_compiler === "v14_149_authorization_package_compiler");
} catch (error) {
  addResult("compiler_runs_and_outputs_json", false, error.message);
  compilerOutput = { packages: [] };
}

try {
  v14_146 = runJson(files.v14_146_validator);
  addResult("v14_146_durable_archive_dry_run_still_passes", v14_146.passed === true);
} catch (error) {
  addResult("v14_146_durable_archive_dry_run_still_passes", false, error.message);
}

try {
  v14_147 = runJson(files.v14_147_validator);
  addResult("v14_147_production_candidate_preflight_still_passes", v14_147.passed === true);
} catch (error) {
  addResult("v14_147_production_candidate_preflight_still_passes", false, error.message);
}

try {
  v14_148 = runJson(files.v14_148_validator);
  addResult("v14_148_memory_delta_draft_package_still_passes", v14_148.passed === true);
} catch (error) {
  addResult("v14_148_memory_delta_draft_package_still_passes", false, error.message);
}

const packages = Array.isArray(compilerOutput.packages) ? compilerOutput.packages : [];
const packageEvaluation = evaluatePackages(packages);
addResult("compiled_package_count_is_four", packages.length === 4, `${packages.length}`);
addResult("compiled_package_kinds_present", packageEvaluation.allKindsPresent, JSON.stringify(compilerOutput.package_kinds || []));
addResult("compiled_packages_not_granted", packageEvaluation.allNotGranted);
addResult("compiled_packages_have_required_validation", packageEvaluation.allHaveValidation);
addResult("compiled_packages_are_split", packageEvaluation.split);
addResult("compiler_evaluation_passes", packageEvaluation.passed, JSON.stringify(packageEvaluation));

const grantedPackage = evaluatePackages(packages.map((pkg, index) => (index === 0 ? { ...pkg, execution_authorized_by_this_package: true } : pkg)));
const mergedArchiveProduction = evaluatePackages(
  packages.map((pkg) =>
    pkg.kind === "durable_archive"
      ? { ...pkg, allowed_operations: [...pkg.allowed_operations, "write_production_candidate_plan_yaml"] }
      : pkg
  )
);
const missingValidation = evaluatePackages(packages.map((pkg, index) => (index === 0 ? { ...pkg, validation_required: [] } : pkg)));
const manifestWithNoPath = packages.find((pkg) => pkg.kind === "manifest_read");
const manifestIncomplete = manifestWithNoPath?.package_status === "prepared_incomplete_not_granted" && manifestWithNoPath?.exact_allowed_paths?.length === 0;
const externalExecutionOperation = packages.some((pkg) => pkg.allowed_operations.some((operation) => /provider|plugin|MCP|push|deploy/i.test(operation)));

addResult("negative_case_granted_package_blocks_compiler", grantedPackage.passed === false && grantedPackage.allNotGranted === false);
addResult("negative_case_merged_archive_and_production_candidate_blocks_compiler", mergedArchiveProduction.passed === false && mergedArchiveProduction.split === false);
addResult("negative_case_missing_validation_command_blocks_package", missingValidation.passed === false && missingValidation.allHaveValidation === false);
addResult("negative_case_manifest_read_without_exact_path_stays_incomplete", manifestIncomplete === true);
addResult("negative_case_external_execution_operation_blocks_compiler", externalExecutionOperation === false);

for (const token of [
  "phase: v14_149_authorization_package_compiler",
  "authorization_package_compiler_created: true",
  "compiled_package_count: 4",
  "durable_archive_package_status: prepared_not_granted",
  "production_candidate_package_status: prepared_not_granted",
  "memory_write_package_status: prepared_not_granted",
  "manifest_read_package_status: prepared_incomplete_not_granted",
  "manifest_read_missing_exact_real_manifest_path: true",
  "authorization_granted_by_this_record: false",
  "output_file_write_performed: false",
  "artifact_recoverability_is_not_vcp_runtime_integration: true",
  "vcp_runtime_integration_proven: false",
]) {
  requireToken("phase_record", phaseRecord, token);
}

for (const token of [
  "scripts/compile_v14_149_authorization_packages.js",
  "scripts/validate_v14_149_authorization_package_compiler.js",
  "docs/v14_149_authorization_package_compiler.md",
  "schemas/authorization_package_compiler.schema.yaml",
  "tests/schema_examples/v14_149_authorization_package_compiler_input.example.yaml",
  "v14_149_authorization_package_compiler",
  "authorization_package_compiler_created: true",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

forbidPattern("current_surfaces", currentSurfaces, /authorization_granted_by_this_record:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /authorization_granted_by_compiler:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /execution_authorized_by_this_package:\s+true/i);
forbidPattern("package_surfaces", packageSurfaces, /execution_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /provider_contact_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /plugin_call_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /api_call_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /mcp_runtime_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /image_generation_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /real_manifest_read_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /real_vcpchat_read_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /real_vcptoolbox_read_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /archive_manifest_written:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /image_binary_copy_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /production_candidate_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /DailyNote_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /VCP_memory_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /push_tag_release_deploy_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /vcp_runtime_integration_proven:\s+true/i);

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_149_authorization_package_compiler",
  version: "v1",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  authorization_package_compiler_created: true,
  compiled_package_count: packages.length,
  compiled_package_kinds: compilerOutput.package_kinds || [],
  durable_archive_package_status: packages.find((pkg) => pkg.kind === "durable_archive")?.package_status || null,
  production_candidate_package_status: packages.find((pkg) => pkg.kind === "production_candidate")?.package_status || null,
  memory_write_package_status: packages.find((pkg) => pkg.kind === "memory_write")?.package_status || null,
  manifest_read_package_status: packages.find((pkg) => pkg.kind === "manifest_read")?.package_status || null,
  manifest_read_missing_exact_real_manifest_path: manifestIncomplete,
  output_file_write_performed: false,
  v14_146_durable_archive_dry_run_still_passes: v14_146?.passed === true,
  v14_147_production_candidate_preflight_still_passes: v14_147?.passed === true,
  v14_148_memory_delta_draft_package_still_passes: v14_148?.passed === true,
  negative_case_granted_package_blocks_compiler: grantedPackage.passed === false && grantedPackage.allNotGranted === false,
  negative_case_merged_archive_and_production_candidate_blocks_compiler: mergedArchiveProduction.passed === false && mergedArchiveProduction.split === false,
  negative_case_missing_validation_command_blocks_package: missingValidation.passed === false && missingValidation.allHaveValidation === false,
  negative_case_manifest_read_without_exact_path_stays_incomplete: manifestIncomplete === true,
  negative_case_external_execution_operation_blocks_compiler: externalExecutionOperation === false,
  artifact_recoverability_is_not_vcp_runtime_integration: true,
  vcp_runtime_integration_proven: false,
  authorization_granted_by_this_record: false,
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
  push_tag_release_deploy_performed: false,
  file_write_performed: false,
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(passed ? 0 : 1);
