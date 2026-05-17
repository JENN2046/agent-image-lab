#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const kernelPath = "kernel/pvos_kernel.js";
const kernelReadmePath = "kernel/README.md";
const schemaPath = "schemas/pvos_kernel_run.schema.yaml";
const inputFixturePath = "tests/schema_examples/pvos_kernel_input.example.json";
const outputExamplePath = "tests/schema_examples/pvos_kernel_run.example.json";

const errors = [];
const results = [];

const requiredDomainModels = [
  "ShotPlan",
  "Shot",
  "PromptLineage",
  "ImageCandidate",
  "ReviewRubric",
  "VisualEvalDecision",
  "FailureTaxonomy",
  "AcceptedSample",
  "RejectedSample",
  "ReviewReport",
  "ProvenanceRecord",
  "EvalSeed",
  "RunManifest",
];

const falseGuardFields = [
  "provider_contact_performed",
  "plugin_call_performed",
  "api_call_performed",
  "daily_note_write_performed",
  "vcp_memory_write_performed",
  "image_generation_performed",
  "disk_write_performed",
  "accepted_samples_write_performed",
  "external_manifest_read_performed",
  "vcpchat_source_read_performed",
  "vcptoolbox_source_read_performed",
];

function repoPath(relativePath) {
  const resolved = path.resolve(root, relativePath);
  const relative = path.relative(root, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`path escapes repository root: ${relativePath}`);
  }
  return resolved;
}

function readFile(relativePath) {
  return fs.readFileSync(repoPath(relativePath), "utf8");
}

function addResult(check, passed, detail) {
  results.push({ check, passed: Boolean(passed), ...(detail ? { detail } : {}) });
  if (!passed) {
    errors.push({ check, detail: detail || "check failed" });
  }
}

function validateNoSensitiveMaterial(label, text) {
  const forbidden = [
    { id: "windows_absolute_path", pattern: /[A-Z]:[\\/]/ },
    { id: "private_key", pattern: /BEGIN [A-Z ]*PRIVATE KEY/ },
    { id: "env_file_reference", pattern: /\.env|config\.env/i },
    { id: "image_binary_reference", pattern: /\.(png|jpe?g|webp|gif|psd)\b/i },
    { id: "real_generation_run_path", pattern: /runs\/real_generation/i },
    { id: "accepted_samples_path", pattern: /accepted_samples\//i },
    { id: "external_url", pattern: /https?:\/\//i },
    { id: "real_manifest_ref", pattern: /real[_ -]?manifest/i },
    { id: "vcpchat_source_ref", pattern: /VCPChat source|real VCPChat/i },
    { id: "vcptoolbox_source_ref", pattern: /VCPToolBox source|real VCPToolBox/i },
  ];
  for (const rule of forbidden) {
    addResult(`${label}_${rule.id}_absent`, !rule.pattern.test(text), `${rule.pattern}`);
  }
}

function runNodeCheck(relativePath) {
  const result = childProcess.spawnSync(process.execPath, ["--check", repoPath(relativePath)], {
    cwd: root,
    encoding: "utf8",
  });
  addResult(`${relativePath}_node_check_passed`, result.status === 0, result.stderr || result.stdout);
}

function runKernel() {
  const result = childProcess.spawnSync(
    process.execPath,
    [repoPath(kernelPath), "--input", inputFixturePath],
    { cwd: root, encoding: "utf8" }
  );
  addResult("kernel_cli_exit_zero", result.status === 0, result.stderr || result.stdout);
  addResult("kernel_cli_stderr_empty", result.stderr.trim() === "", result.stderr);
  if (result.status !== 0) return null;
  try {
    return JSON.parse(result.stdout);
  } catch (error) {
    addResult("kernel_cli_stdout_json_parseable", false, error.message);
    return null;
  }
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function throwsWith(fn, pattern) {
  try {
    fn();
    return false;
  } catch (error) {
    return pattern.test(error.message);
  }
}

function runKernelHardeningProbes() {
  const kernel = require(repoPath(kernelPath));
  const base = JSON.parse(readFile(inputFixturePath));

  const duplicateCandidate = clone(base);
  duplicateCandidate.candidates[1].candidate_id = duplicateCandidate.candidates[0].candidate_id;
  addResult(
    "kernel_rejects_duplicate_candidate_id",
    throwsWith(() => kernel.normalizeInput(duplicateCandidate), /candidate\.candidate_id must be unique/)
  );

  const nonMetadataArtifact = clone(base);
  nonMetadataArtifact.candidates[0].artifact_ref_kind = "file_reference";
  addResult(
    "kernel_rejects_non_metadata_artifact_kind",
    throwsWith(() => kernel.normalizeInput(nonMetadataArtifact), /artifact_ref_kind must be metadata_only_reference/)
  );

  const absoluteArtifact = clone(base);
  absoluteArtifact.candidates[0].artifact_ref = "C:\\private\\candidate.png";
  addResult(
    "kernel_rejects_private_or_image_artifact_ref",
    throwsWith(() => kernel.normalizeInput(absoluteArtifact), /artifact_ref contains forbidden/)
  );

  const pathLikeArtifact = clone(base);
  pathLikeArtifact.candidates[0].artifact_ref = "asset_archive/candidates/candidate_001";
  addResult(
    "kernel_rejects_path_like_artifact_ref",
    throwsWith(() => kernel.normalizeInput(pathLikeArtifact), /artifact_ref contains forbidden path_separator/)
  );
}

function hasAllFields(object, fields, label) {
  for (const field of fields) {
    addResult(`${label}_${field}_present`, Object.prototype.hasOwnProperty.call(object, field));
  }
}

function validateRun(run) {
  hasAllFields(
    run,
    [
      "pvos_kernel_run_version",
      "run_id",
      "task_id",
      "mode",
      "status",
      "domain_model_refs",
      "task_envelope_draft",
      "shot_plan",
      "shots",
      "prompt_lineage",
      "prompt_package_ref",
      "dispatch_plan_draft",
      "image_candidates",
      "review_rubric",
      "failure_taxonomy",
      "visual_eval_decision",
      "accepted_samples",
      "rejected_samples",
      "review_report",
      "image_case_draft",
      "memory_delta_draft",
      "provenance_record",
      "eval_seed",
      "run_manifest",
      "visual_loop_state",
      "no_execution_guard",
    ],
    "run"
  );

  addResult("run_version_v1", run.pvos_kernel_run_version === "v1", run.pvos_kernel_run_version);
  addResult("run_mode_stdout_only", run.mode === "local_stdout_only_kernel", run.mode);
  addResult("run_status_completed_local_draft", run.status === "completed_local_draft", run.status);

  for (const model of requiredDomainModels) {
    addResult(`domain_model_${model}_present`, Array.isArray(run.domain_model_refs) && run.domain_model_refs.includes(model));
    addResult(
      `manifest_domain_model_${model}_present`,
      Array.isArray(run.run_manifest?.domain_model_refs) && run.run_manifest.domain_model_refs.includes(model)
    );
  }

  addResult("shots_non_empty", Array.isArray(run.shots) && run.shots.length > 0);
  addResult("image_candidates_two", Array.isArray(run.image_candidates) && run.image_candidates.length === 2);
  addResult("accepted_samples_one", Array.isArray(run.accepted_samples) && run.accepted_samples.length === 1);
  addResult("rejected_samples_one", Array.isArray(run.rejected_samples) && run.rejected_samples.length === 1);
  addResult("failure_taxonomy_non_empty", Array.isArray(run.failure_taxonomy) && run.failure_taxonomy.length >= 3);
  addResult(
    "decision_has_candidate_decisions",
    Array.isArray(run.visual_eval_decision?.candidate_decisions) && run.visual_eval_decision.candidate_decisions.length === 2
  );
  addResult(
    "decision_accept_and_reject",
    run.visual_eval_decision?.candidate_decisions?.some((decision) => decision.decision === "accepted_candidate_reference") &&
      run.visual_eval_decision?.candidate_decisions?.some((decision) => decision.decision === "rejected_candidate_reference")
  );

  for (const flag of falseGuardFields) {
    addResult(`no_execution_guard_${flag}_false`, run.no_execution_guard?.[flag] === false, String(run.no_execution_guard?.[flag]));
    addResult(
      `run_manifest_boundary_${flag}_false`,
      run.run_manifest?.boundary_flags?.[flag] === false,
      String(run.run_manifest?.boundary_flags?.[flag])
    );
  }

  addResult("dispatch_plan_execution_not_authorized", run.dispatch_plan_draft?.execution_authorized === false);
  addResult("dispatch_plan_max_plugin_calls_zero", run.dispatch_plan_draft?.max_plugin_calls === 0);
  addResult("memory_delta_draft_not_written", run.memory_delta_draft?.direct_write_performed === false);
  addResult("provenance_metadata_only", run.provenance_record?.artifact_refs_are_metadata_only === true);
  addResult("provenance_no_provider_payload", run.provenance_record?.provider_payload_included === false);
  addResult("provenance_no_image_binary", run.provenance_record?.image_binary_included === false);
  validateNoSensitiveMaterial("kernel_run_stdout", JSON.stringify(run));
}

function validateSchemaText(schema) {
  for (const model of requiredDomainModels) {
    addResult(`schema_domain_model_${model}_listed`, schema.includes(`- ${model}`));
  }
  for (const flag of falseGuardFields) {
    addResult(`schema_guard_${flag}_false`, new RegExp(`${flag}: false`).test(schema));
  }
  addResult("schema_stdout_policy_declared", /output_channel: stdout/.test(schema));
  addResult("schema_output_file_write_blocked", /output_file_write_allowed: false/.test(schema));
  validateNoSensitiveMaterial("schema", schema);
}

function validateExampleOutput(example) {
  addResult("output_example_version_v1", example.pvos_kernel_run_version === "v1");
  addResult("output_example_stdout_mode", example.mode === "local_stdout_only_kernel");
  for (const model of requiredDomainModels) {
    addResult(`output_example_domain_model_${model}_present`, example.domain_model_refs?.includes(model));
  }
  addResult("output_example_accept_count_one", example.review_report?.accepted_count === 1);
  addResult("output_example_reject_count_one", example.review_report?.rejected_count === 1);
  for (const flag of falseGuardFields) {
    addResult(`output_example_guard_${flag}_false`, example.no_execution_guard?.[flag] === false);
  }
  validateNoSensitiveMaterial("output_example", JSON.stringify(example));
}

for (const file of [kernelPath, kernelReadmePath, schemaPath, inputFixturePath, outputExamplePath]) {
  addResult(`${file}_exists`, fs.existsSync(repoPath(file)), file);
}

runNodeCheck(kernelPath);
runNodeCheck("scripts/validate_pvos_kernel_minimal.js");

let schemaText = "";
try {
  schemaText = readFile(schemaPath);
  validateSchemaText(schemaText);
} catch (error) {
  addResult("schema_readable", false, error.message);
}

try {
  validateNoSensitiveMaterial("input_fixture", readFile(inputFixturePath));
} catch (error) {
  addResult("input_fixture_readable", false, error.message);
}

try {
  const outputExample = JSON.parse(readFile(outputExamplePath));
  validateExampleOutput(outputExample);
} catch (error) {
  addResult("output_example_parseable", false, error.message);
}

const run = runKernel();
if (run) {
  addResult("kernel_cli_stdout_json_parseable", true);
  validateRun(run);
}

try {
  runKernelHardeningProbes();
} catch (error) {
  addResult("kernel_hardening_probes_completed", false, error.message);
}

const passed = errors.length === 0;
const summary = {
  validator: "validate_pvos_kernel_minimal",
  version: "v1",
  passed,
  files_checked: [kernelPath, kernelReadmePath, schemaPath, inputFixturePath, outputExamplePath],
  check_count: results.length,
  failed_count: errors.length,
  pvos_kernel: {
    kernel_cli_present: fs.existsSync(repoPath(kernelPath)),
    schema_present: fs.existsSync(repoPath(schemaPath)),
    input_fixture_present: fs.existsSync(repoPath(inputFixturePath)),
    output_example_present: fs.existsSync(repoPath(outputExamplePath)),
    stdout_only: true,
    external_network_required: false,
    external_service_required: false,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    daily_note_write_performed: false,
    vcp_memory_write_performed: false,
    disk_write_performed: false,
  },
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exitCode = passed ? 0 : 1;
