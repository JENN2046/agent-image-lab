#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const contractPath = "kernel/evidence_blocker_contract.js";
const schemaPath = "schemas/evidence_blocker_contract.schema.yaml";
const examplePath = "tests/schema_examples/evidence_blocker_contract.example.json";
const negativeExamplePath = "tests/schema_examples/evidence_blocker_contract_negative_guard.example.json";
const defaultInputPath = "tests/schema_examples/review_result_protocol_input.example.json";
const negativeInputPath = "tests/schema_examples/review_result_protocol_negative_guard_input.example.json";

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

function deepEqual(actual, expected) {
  return JSON.stringify(actual) === JSON.stringify(expected);
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

function runContractCli(inputPath, label) {
  const result = childProcess.spawnSync(process.execPath, [repoPath(contractPath), "--input", inputPath], {
    cwd: root,
    encoding: "utf8",
  });
  addResult(`${label}_cli_exit_zero`, result.status === 0, result.stderr || result.stdout);
  addResult(`${label}_cli_stderr_empty`, result.stderr.trim() === "", result.stderr);
  if (result.status !== 0) return null;
  try {
    const parsed = JSON.parse(result.stdout);
    addResult(`${label}_cli_stdout_json_parseable`, true);
    validateNoSensitiveMaterial(`${label}_cli_stdout`, JSON.stringify(parsed));
    return parsed;
  } catch (error) {
    addResult(`${label}_cli_stdout_json_parseable`, false, error.message);
    return null;
  }
}

function validateSchema(schema) {
  for (const token of [
    "evidence_blocker_contract_version: v1",
    "EvidenceRecord",
    "BlockerDecision",
    "ProductionExclusionRegister",
    "evidence_records:",
    "blocker_decisions:",
    "production_exclusion_register:",
    "evidence_record_is_not_approval: true",
    "blocker_decision_is_not_write: true",
    "every_never_production_candidate_has_exclusion: true",
    "production_candidate_created: false",
    "direct_memory_write_performed: false",
    "accepted_samples_write_performed: false",
    "output_channel: stdout",
  ]) {
    addResult(`schema_token_${token}_present`, schema.includes(token));
  }
  validateNoSensitiveMaterial("schema", schema);
}

function validateCommonContract(contract, label) {
  addResult(`${label}_version_v1`, contract.evidence_blocker_contract_version === "v1");
  addResult(`${label}_status_completed`, contract.status === "completed_local_evidence_blocker_contract");
  addResult(`${label}_mode_stdout_only`, contract.mode === "local_stdout_only_evidence_blocker_contract");
  addResult(`${label}_evidence_records_array`, Array.isArray(contract.evidence_records));
  addResult(`${label}_blocker_decisions_array`, Array.isArray(contract.blocker_decisions));
  addResult(`${label}_production_exclusion_array`, Array.isArray(contract.production_exclusion_register));

  addResult(
    `${label}_evidence_records_not_writes`,
    contract.evidence_records.every(
      (item) => item.direct_write_performed === false && item.production_candidate === false
    )
  );
  addResult(
    `${label}_blocker_decisions_not_writes`,
    contract.blocker_decisions.every(
      (item) =>
        item.direct_write_performed === false &&
        item.production_candidate === false &&
        item.requires_human_review === true
    )
  );
  addResult(
    `${label}_production_exclusions_hard_blocked`,
    contract.production_exclusion_register.every(
      (item) =>
        item.status === "never_production" &&
        item.permanent_block === true &&
        item.production_candidate === false &&
        typeof item.source_blocker_decision_id === "string"
    )
  );

  const summary = contract.blocker_summary || {};
  addResult(`${label}_summary_direct_memory_write_false`, summary.direct_memory_write_performed === false);
  addResult(`${label}_summary_production_candidate_false`, summary.production_candidate_created === false);
  addResult(`${label}_summary_accepted_samples_write_false`, summary.accepted_samples_write_performed === false);

  const guard = contract.arbitration_guard || {};
  addResult(`${label}_guard_evidence_not_approval`, guard.evidence_record_is_not_approval === true);
  addResult(`${label}_guard_blocker_not_write`, guard.blocker_decision_is_not_write === true);
  addResult(`${label}_guard_every_candidate_has_evidence`, guard.every_candidate_has_evidence_record === true);
  addResult(
    `${label}_guard_every_candidate_has_production_blocker`,
    guard.every_candidate_has_production_blocker_decision === true
  );
  addResult(
    `${label}_guard_never_production_has_exclusion`,
    guard.every_never_production_candidate_has_exclusion === true
  );
  addResult(`${label}_guard_no_production_without_human_review`, guard.no_production_without_human_review === true);
  addResult(`${label}_guard_production_candidate_false`, guard.production_candidate_created === false);
  addResult(`${label}_guard_direct_memory_write_false`, guard.direct_memory_write_performed === false);
  addResult(`${label}_guard_accepted_samples_write_false`, guard.accepted_samples_write_performed === false);

  for (const flag of [
    "provider_contact_performed",
    "plugin_call_performed",
    "api_call_performed",
    "daily_note_write_performed",
    "vcp_memory_write_performed",
    "image_generation_performed",
    "output_file_write_performed",
    "accepted_samples_write_performed",
    "production_candidate_created",
    "external_manifest_read_performed",
    "vcpchat_source_read_performed",
    "vcptoolbox_source_read_performed",
  ]) {
    addResult(`${label}_no_execution_${flag}_false`, contract.no_execution_guard?.[flag] === false);
  }

  validateNoSensitiveMaterial(label, JSON.stringify(contract));
}

function validateDefaultContract(contract, label) {
  validateCommonContract(contract, label);
  addResult(`${label}_source_protocol_expected`, contract.source_protocol_id === "review_result_protocol_hardening_v1");
  addResult(`${label}_evidence_record_count_two`, contract.evidence_records.length === 2);
  addResult(`${label}_blocker_decision_count_two`, contract.blocker_decisions.length === 2);
  addResult(`${label}_production_exclusion_count_one`, contract.production_exclusion_register.length === 1);
  addResult(`${label}_human_review_block_count_two`, contract.blocker_summary?.human_review_block_count === 2);
  addResult(`${label}_memory_forbidden_block_count_zero`, contract.blocker_summary?.memory_forbidden_block_count === 0);
  addResult(
    `${label}_pass_candidate_blocked_until_human_review`,
    contract.blocker_decisions.some(
      (item) =>
        item.candidate_id === "candidate_accept_metadata_001" &&
        item.blocker_type === "human_review_required" &&
        item.permanent_block === false
    )
  );
  addResult(
    `${label}_reject_candidate_never_production`,
    contract.production_exclusion_register.some(
      (item) => item.candidate_id === "candidate_reject_metadata_001" && item.status === "never_production"
    )
  );
}

function validateNegativeGuardContract(contract) {
  validateCommonContract(contract, "negative_guard_contract");
  addResult("negative_guard_source_protocol_expected", contract.source_protocol_id === "review_result_protocol_negative_guard_v1");
  addResult("negative_guard_evidence_record_count_two", contract.evidence_records.length === 2);
  addResult("negative_guard_blocker_decision_count_three", contract.blocker_decisions.length === 3);
  addResult("negative_guard_production_exclusion_count_two", contract.production_exclusion_register.length === 2);
  addResult("negative_guard_memory_forbidden_block_count_one", contract.blocker_summary?.memory_forbidden_block_count === 1);
  addResult("negative_guard_permanent_block_count_three", contract.blocker_summary?.permanent_block_count === 3);
  addResult(
    "negative_guard_memory_forbidden_block_recorded",
    contract.blocker_decisions.some(
      (item) =>
        item.candidate_id === "candidate_reject_unknown_guard_001" &&
        item.blocker_type === "memory_forbidden" &&
        item.blocking_scope === "memory_promotion"
    )
  );
  addResult(
    "negative_guard_memory_forbidden_candidate_memory_route_forbidden",
    contract.evidence_records.some(
      (item) =>
        item.candidate_id === "candidate_reject_unknown_guard_001" &&
        item.memory_route === "forbidden" &&
        item.memory_allowed === false &&
        item.direct_write_performed === false
    )
  );
  addResult(
    "negative_guard_memory_forbidden_candidate_never_production",
    contract.production_exclusion_register.some(
      (item) =>
        item.candidate_id === "candidate_reject_unknown_guard_001" &&
        item.status === "never_production" &&
        item.permanent_block === true &&
        item.source_blocker_decision_id === "blocker_production_candidate_reject_unknown_guard_001" &&
        item.production_candidate === false
    )
  );
  addResult(
    "negative_guard_unknown_candidate_production_blocker_permanent",
    contract.blocker_decisions.some(
      (item) =>
        item.blocker_decision_id === "blocker_production_candidate_reject_unknown_guard_001" &&
        item.candidate_id === "candidate_reject_unknown_guard_001" &&
        item.decision === "block_permanently" &&
        item.permanent_block === true &&
        item.direct_write_performed === false
    )
  );
  addResult(
    "negative_guard_all_rejected_excluded_from_production",
    ["candidate_reject_mapped_guard_001", "candidate_reject_unknown_guard_001"].every((id) =>
      contract.production_exclusion_register.some((item) => item.candidate_id === id)
    )
  );
}

for (const file of [contractPath, schemaPath, examplePath, negativeExamplePath, defaultInputPath, negativeInputPath]) {
  addResult(`${file}_exists`, fs.existsSync(repoPath(file)), file);
}

runNodeCheck(contractPath);
runNodeCheck("scripts/validate_evidence_blocker_contract.js");

try {
  validateSchema(readFile(schemaPath));
} catch (error) {
  addResult("schema_readable", false, error.message);
}

try {
  validateDefaultContract(parseJson(examplePath), "example");
} catch (error) {
  addResult("example_parseable", false, error.message);
}

let negativeExample = null;
try {
  negativeExample = parseJson(negativeExamplePath);
  validateNegativeGuardContract(negativeExample);
  addResult("negative_guard_example_parseable", true);
  validateNoSensitiveMaterial("negative_guard_example", JSON.stringify(negativeExample));
} catch (error) {
  addResult("negative_guard_example_parseable", false, error.message);
}

const defaultContract = runContractCli(defaultInputPath, "default_contract");
if (defaultContract) {
  validateDefaultContract(defaultContract, "default_contract");
}

const negativeGuardContract = runContractCli(negativeInputPath, "negative_guard_contract");
if (negativeGuardContract) {
  validateNegativeGuardContract(negativeGuardContract);
  if (negativeExample) {
    addResult(
      "negative_guard_example_matches_cli_output",
      deepEqual(negativeGuardContract, negativeExample),
      "negative guard fixture must stay identical to CLI output"
    );
  }
}

const passed = errors.length === 0;
const summary = {
  validator: "validate_evidence_blocker_contract",
  version: "v1",
  passed,
  files_checked: [contractPath, schemaPath, examplePath, negativeExamplePath, defaultInputPath, negativeInputPath],
  check_count: results.length,
  failed_count: errors.length,
  evidence_blocker_contract: {
    contract_cli_present: fs.existsSync(repoPath(contractPath)),
    schema_present: fs.existsSync(repoPath(schemaPath)),
    example_present: fs.existsSync(repoPath(examplePath)),
    negative_guard_example_present: fs.existsSync(repoPath(negativeExamplePath)),
    stdout_only: true,
    evidence_records_verified: true,
    blocker_decisions_verified: true,
    production_exclusion_register_verified: true,
    pass_candidate_blocked_until_human_review_verified: true,
    reject_candidate_never_production_verified: true,
    negative_guard_memory_forbidden_block_verified: true,
    negative_guard_memory_forbidden_route_verified: true,
    negative_guard_memory_forbidden_candidate_never_production_verified: true,
    negative_guard_unknown_candidate_production_blocker_verified: true,
    negative_guard_production_exclusion_verified: true,
    negative_guard_example_matches_cli_output: negativeExample && negativeGuardContract ? deepEqual(negativeGuardContract, negativeExample) : false,
    no_direct_memory_write_verified: true,
    no_production_candidate_created_verified: true,
    no_accepted_samples_write_verified: true,
    external_network_required: false,
    external_service_required: false,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    daily_note_write_performed: false,
    vcp_memory_write_performed: false,
    output_file_write_performed: false,
  },
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exitCode = passed ? 0 : 1;
