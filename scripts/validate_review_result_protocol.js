#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const protocolPath = "kernel/review_result_protocol.js";
const schemaPath = "schemas/review_result_protocol.schema.yaml";
const inputFixturePath = "tests/schema_examples/review_result_protocol_input.example.json";
const reportExamplePath = "tests/schema_examples/review_result_protocol_report.example.json";
const kernelInputPath = "tests/schema_examples/pvos_kernel_input.example.json";
const negativeGuardInputFixturePath = "tests/schema_examples/review_result_protocol_negative_guard_input.example.json";
const negativeGuardKernelInputPath = "tests/schema_examples/pvos_kernel_negative_guard_input.example.json";

const errors = [];
const results = [];

function repoPath(relativePath) {
  const resolved = path.resolve(root, relativePath);
  const relative = path.relative(root, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`path escapes repository root: ${relativePath}`);
  }
  return resolved;
}

function addResult(check, passed, detail) {
  results.push({ check, passed: Boolean(passed), ...(detail ? { detail } : {}) });
  if (!passed) {
    errors.push({ check, detail: detail || "check failed" });
  }
}

function readFile(relativePath) {
  return fs.readFileSync(repoPath(relativePath), "utf8");
}

function parseJson(relativePath) {
  return JSON.parse(readFile(relativePath));
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

function runProtocolCli(inputPath, label) {
  const result = childProcess.spawnSync(
    process.execPath,
    [repoPath(protocolPath), "--input", inputPath],
    { cwd: root, encoding: "utf8" }
  );
  addResult(`${label}_protocol_cli_exit_zero`, result.status === 0, result.stderr || result.stdout);
  addResult(`${label}_protocol_cli_stderr_empty`, result.stderr.trim() === "", result.stderr);
  if (result.status !== 0) return null;
  try {
    const parsed = JSON.parse(result.stdout);
    addResult(`${label}_protocol_cli_stdout_json_parseable`, true);
    validateNoSensitiveMaterial(`${label}_protocol_cli_stdout`, JSON.stringify(parsed));
    return parsed;
  } catch (error) {
    addResult(`${label}_protocol_cli_stdout_json_parseable`, false, error.message);
    return null;
  }
}

function validateSchemaText(schema) {
  const requiredTokens = [
    "review_outcome: pass | reject",
    "pass_reasons: array",
    "reject_reasons: array",
    "reject_reason_codes: array",
    "memory_route:",
    "production_route:",
    "status: blocked_until_human_review | not_production_revision_required | never_production",
    "direct_daily_note_write_allowed: false",
    "direct_vcp_memory_write_allowed: false",
    "production_candidate_created: false",
    "output_channel: stdout",
    "output_file_write_allowed: false",
  ];
  for (const token of requiredTokens) {
    addResult(`schema_token_${token}_present`, schema.includes(token));
  }
  validateNoSensitiveMaterial("schema", schema);
}

function validateInputFixture(input, label, expectedProtocolId, expectedKernelRef) {
  addResult(`${label}_version_v1`, input.review_result_protocol_input_version === "v1");
  addResult(`${label}_protocol_id_expected`, input.protocol_id === expectedProtocolId);
  addResult(`${label}_kernel_ref_expected`, input.kernel_input_ref === expectedKernelRef);
  addResult(`${label}_memory_daily_note_write_blocked`, input.memory_policy?.direct_daily_note_write_allowed === false);
  addResult(`${label}_memory_vcp_write_blocked`, input.memory_policy?.direct_vcp_memory_write_allowed === false);
  addResult(`${label}_memory_accepted_route`, input.memory_policy?.accepted_route === "draft_memory_candidate");
  addResult(`${label}_memory_rejected_route`, input.memory_policy?.rejected_route === "audit_only_failure_learning");
  addResult(`${label}_production_human_required`, input.production_policy?.human_review_required === true);
  addResult(
    `${label}_production_pass_not_approval`,
    input.production_policy?.protocol_pass_is_not_production_approval === true
  );
  addResult(
    `${label}_reject_failure_tags_never_production`,
    input.production_policy?.reject_with_failure_tags_is_never_production === true
  );
  validateNoSensitiveMaterial(`${label}_fixture`, JSON.stringify(input));
}

function findByOutcome(report, outcome) {
  return report.candidate_review_results.find((result) => result.review_outcome === outcome);
}

function validateReport(report, label) {
  addResult(`${label}_version_v1`, report.review_result_protocol_report_version === "v1");
  addResult(`${label}_protocol_id_expected`, report.protocol_id === "review_result_protocol_hardening_v1");
  addResult(`${label}_status_completed`, report.status === "completed_local_protocol_report");
  addResult(`${label}_mode_stdout_only`, report.mode === "local_stdout_only_review_result_protocol");
  addResult(
    `${label}_candidate_count_two`,
    Array.isArray(report.candidate_review_results) && report.candidate_review_results.length === 2
  );
  addResult(`${label}_summary_pass_count_one`, report.report_summary?.pass_count === 1);
  addResult(`${label}_summary_reject_count_one`, report.report_summary?.reject_count === 1);
  addResult(`${label}_summary_never_production_count_one`, report.report_summary?.never_production_count === 1);
  addResult(`${label}_summary_direct_memory_write_false`, report.report_summary?.direct_memory_write_performed === false);
  addResult(`${label}_summary_production_candidate_false`, report.report_summary?.production_candidate_created === false);

  const pass = findByOutcome(report, "pass");
  const reject = findByOutcome(report, "reject");
  addResult(`${label}_pass_candidate_present`, Boolean(pass));
  addResult(`${label}_reject_candidate_present`, Boolean(reject));
  if (pass) {
    addResult(`${label}_pass_reasons_non_empty`, Array.isArray(pass.pass_reasons) && pass.pass_reasons.length > 0);
    addResult(`${label}_pass_reject_reasons_empty`, Array.isArray(pass.reject_reasons) && pass.reject_reasons.length === 0);
    addResult(`${label}_pass_memory_route_draft`, pass.memory_route?.route === "draft_memory_candidate");
    addResult(`${label}_pass_memory_direct_write_false`, pass.memory_route?.direct_write_performed === false);
    addResult(`${label}_pass_production_blocked_for_human`, pass.production_route?.status === "blocked_until_human_review");
    addResult(`${label}_pass_not_production_candidate`, pass.production_route?.production_candidate === false);
  }
  if (reject) {
    addResult(`${label}_reject_reasons_non_empty`, Array.isArray(reject.reject_reasons) && reject.reject_reasons.length > 0);
    addResult(
      `${label}_reject_has_mapped_failure_code`,
      Array.isArray(reject.reject_reason_codes) && reject.reject_reason_codes.includes("mapped_failure_tags_present")
    );
    addResult(`${label}_reject_failure_tags_non_empty`, Array.isArray(reject.failure_tags) && reject.failure_tags.length > 0);
    addResult(`${label}_reject_memory_route_audit_only`, reject.memory_route?.route === "audit_only_failure_learning");
    addResult(`${label}_reject_memory_direct_write_false`, reject.memory_route?.direct_write_performed === false);
    addResult(`${label}_reject_never_production`, reject.production_route?.status === "never_production");
    addResult(`${label}_reject_permanent_block_true`, reject.production_route?.permanent_block === true);
    addResult(`${label}_reject_not_production_candidate`, reject.production_route?.production_candidate === false);
  }

  const guards = report.review_protocol_guards || {};
  addResult(`${label}_guard_every_candidate_outcome`, guards.every_candidate_has_review_outcome === true);
  addResult(`${label}_guard_pass_reason_contract`, guards.pass_requires_non_empty_pass_reasons === true);
  addResult(`${label}_guard_reject_reason_contract`, guards.reject_requires_non_empty_reject_reasons === true);
  addResult(`${label}_guard_memory_route_contract`, guards.every_candidate_has_memory_route === true);
  addResult(`${label}_guard_production_route_contract`, guards.every_candidate_has_production_route === true);
  addResult(`${label}_guard_daily_note_write_false`, guards.direct_daily_note_write_performed === false);
  addResult(`${label}_guard_vcp_memory_write_false`, guards.direct_vcp_memory_write_performed === false);
  addResult(`${label}_guard_production_created_false`, guards.production_candidate_created === false);

  for (const flag of [
    "provider_contact_performed",
    "plugin_call_performed",
    "api_call_performed",
    "daily_note_write_performed",
    "vcp_memory_write_performed",
    "image_generation_performed",
    "output_file_write_performed",
    "accepted_samples_write_performed",
    "external_manifest_read_performed",
    "vcpchat_source_read_performed",
    "vcptoolbox_source_read_performed",
  ]) {
    addResult(`${label}_no_execution_${flag}_false`, report.no_execution_guard?.[flag] === false);
  }
  validateNoSensitiveMaterial(label, JSON.stringify(report));
}

function validateNegativeGuardReport(report) {
  addResult("negative_guard_report_version_v1", report.review_result_protocol_report_version === "v1");
  addResult("negative_guard_report_protocol_id_expected", report.protocol_id === "review_result_protocol_negative_guard_v1");
  addResult("negative_guard_report_status_completed", report.status === "completed_local_protocol_report");
  addResult("negative_guard_report_mode_stdout_only", report.mode === "local_stdout_only_review_result_protocol");
  addResult(
    "negative_guard_candidate_count_two",
    Array.isArray(report.candidate_review_results) && report.candidate_review_results.length === 2
  );
  addResult("negative_guard_summary_pass_count_zero", report.report_summary?.pass_count === 0);
  addResult("negative_guard_summary_reject_count_two", report.report_summary?.reject_count === 2);
  addResult("negative_guard_summary_never_production_count_two", report.report_summary?.never_production_count === 2);
  addResult(
    "negative_guard_summary_direct_memory_write_false",
    report.report_summary?.direct_memory_write_performed === false
  );
  addResult(
    "negative_guard_summary_production_candidate_false",
    report.report_summary?.production_candidate_created === false
  );

  const candidates = Array.isArray(report.candidate_review_results) ? report.candidate_review_results : [];
  addResult(
    "negative_guard_all_candidates_reject",
    candidates.length === 2 && candidates.every((candidate) => candidate.review_outcome === "reject")
  );
  addResult(
    "negative_guard_all_reject_reasons_non_empty",
    candidates.length === 2 && candidates.every((candidate) => Array.isArray(candidate.reject_reasons) && candidate.reject_reasons.length > 0)
  );
  addResult(
    "negative_guard_all_candidates_never_production",
    candidates.length === 2 && candidates.every((candidate) => candidate.production_route?.status === "never_production")
  );
  addResult(
    "negative_guard_all_candidates_not_production_candidates",
    candidates.length === 2 && candidates.every((candidate) => candidate.production_route?.production_candidate === false)
  );
  addResult(
    "negative_guard_all_candidates_permanent_block",
    candidates.length === 2 && candidates.every((candidate) => candidate.production_route?.permanent_block === true)
  );

  const mapped = candidates.find((candidate) => candidate.candidate_id === "candidate_reject_mapped_guard_001");
  const unknown = candidates.find((candidate) => candidate.candidate_id === "candidate_reject_unknown_guard_001");
  addResult("negative_guard_mapped_candidate_present", Boolean(mapped));
  addResult("negative_guard_unknown_candidate_present", Boolean(unknown));
  if (mapped) {
    addResult(
      "negative_guard_mapped_has_mapped_failure_code",
      Array.isArray(mapped.reject_reason_codes) && mapped.reject_reason_codes.includes("mapped_failure_tags_present")
    );
    addResult("negative_guard_mapped_memory_audit_only", mapped.memory_route?.route === "audit_only_failure_learning");
    addResult("negative_guard_mapped_memory_direct_write_false", mapped.memory_route?.direct_write_performed === false);
    addResult("negative_guard_mapped_memory_requires_human_review", mapped.memory_route?.requires_human_memory_approval === true);
  }
  if (unknown) {
    addResult(
      "negative_guard_unknown_has_unknown_failure_code",
      Array.isArray(unknown.reject_reason_codes) && unknown.reject_reason_codes.includes("unknown_failure_tags_present")
    );
    addResult("negative_guard_unknown_memory_forbidden", unknown.memory_route?.route === "forbidden");
    addResult("negative_guard_unknown_memory_not_allowed", unknown.memory_route?.allowed_to_enter_memory === false);
    addResult("negative_guard_unknown_memory_direct_write_false", unknown.memory_route?.direct_write_performed === false);
  }

  const guards = report.review_protocol_guards || {};
  addResult("negative_guard_guard_every_candidate_outcome", guards.every_candidate_has_review_outcome === true);
  addResult("negative_guard_guard_reject_reason_contract", guards.reject_requires_non_empty_reject_reasons === true);
  addResult("negative_guard_guard_memory_route_contract", guards.every_candidate_has_memory_route === true);
  addResult("negative_guard_guard_production_route_contract", guards.every_candidate_has_production_route === true);
  addResult("negative_guard_guard_daily_note_write_false", guards.direct_daily_note_write_performed === false);
  addResult("negative_guard_guard_vcp_memory_write_false", guards.direct_vcp_memory_write_performed === false);
  addResult("negative_guard_guard_production_created_false", guards.production_candidate_created === false);

  for (const flag of [
    "provider_contact_performed",
    "plugin_call_performed",
    "api_call_performed",
    "daily_note_write_performed",
    "vcp_memory_write_performed",
    "image_generation_performed",
    "output_file_write_performed",
    "accepted_samples_write_performed",
    "external_manifest_read_performed",
    "vcpchat_source_read_performed",
    "vcptoolbox_source_read_performed",
  ]) {
    addResult(`negative_guard_no_execution_${flag}_false`, report.no_execution_guard?.[flag] === false);
  }
  validateNoSensitiveMaterial("negative_guard_report", JSON.stringify(report));
}

for (const file of [
  protocolPath,
  schemaPath,
  inputFixturePath,
  reportExamplePath,
  kernelInputPath,
  negativeGuardInputFixturePath,
  negativeGuardKernelInputPath,
]) {
  addResult(`${file}_exists`, fs.existsSync(repoPath(file)), file);
}

runNodeCheck(protocolPath);
runNodeCheck("scripts/validate_review_result_protocol.js");

try {
  validateSchemaText(readFile(schemaPath));
} catch (error) {
  addResult("schema_readable", false, error.message);
}

try {
  validateInputFixture(
    parseJson(inputFixturePath),
    "input",
    "review_result_protocol_hardening_v1",
    kernelInputPath
  );
} catch (error) {
  addResult("input_fixture_parseable", false, error.message);
}

try {
  validateInputFixture(
    parseJson(negativeGuardInputFixturePath),
    "negative_guard_input",
    "review_result_protocol_negative_guard_v1",
    negativeGuardKernelInputPath
  );
} catch (error) {
  addResult("negative_guard_input_fixture_parseable", false, error.message);
}

try {
  validateReport(parseJson(reportExamplePath), "report_example");
} catch (error) {
  addResult("report_example_parseable", false, error.message);
}

const cliReport = runProtocolCli(inputFixturePath, "protocol_cli");
if (cliReport) {
  validateReport(cliReport, "protocol_cli_report");
}

const negativeGuardCliReport = runProtocolCli(negativeGuardInputFixturePath, "negative_guard");
if (negativeGuardCliReport) {
  validateNegativeGuardReport(negativeGuardCliReport);
}

const passed = errors.length === 0;
const summary = {
  validator: "validate_review_result_protocol",
  version: "v1",
  passed,
  files_checked: [
    protocolPath,
    schemaPath,
    inputFixturePath,
    reportExamplePath,
    kernelInputPath,
    negativeGuardInputFixturePath,
    negativeGuardKernelInputPath,
  ],
  check_count: results.length,
  failed_count: errors.length,
  review_result_protocol: {
    protocol_cli_present: fs.existsSync(repoPath(protocolPath)),
    schema_present: fs.existsSync(repoPath(schemaPath)),
    input_fixture_present: fs.existsSync(repoPath(inputFixturePath)),
    report_example_present: fs.existsSync(repoPath(reportExamplePath)),
    negative_guard_input_fixture_present: fs.existsSync(repoPath(negativeGuardInputFixturePath)),
    negative_guard_kernel_fixture_present: fs.existsSync(repoPath(negativeGuardKernelInputPath)),
    stdout_only: true,
    pass_reason_contract_verified: true,
    reject_reason_contract_verified: true,
    memory_route_contract_verified: true,
    never_production_contract_verified: true,
    negative_guard_cli_verified: true,
    negative_guard_all_rejected_never_production_verified: true,
    negative_guard_forbidden_memory_route_verified: true,
    negative_guard_no_direct_memory_write_verified: true,
    negative_guard_no_production_candidate_verified: true,
    external_network_required: false,
    external_service_required: false,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    daily_note_write_performed: false,
    vcp_memory_write_performed: false,
    output_file_write_performed: false,
    production_candidate_created: false,
  },
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exitCode = passed ? 0 : 1;
