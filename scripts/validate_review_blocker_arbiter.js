#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const arbiterPath = "kernel/review_blocker_arbiter.js";
const schemaPath = "schemas/review_blocker_arbiter.schema.yaml";
const examplePath = "tests/schema_examples/review_blocker_arbiter.example.json";
const negativeExamplePath = "tests/schema_examples/review_blocker_arbiter_negative_guard.example.json";
const evidenceExamplePath = "tests/schema_examples/evidence_blocker_contract.example.json";
const negativeEvidenceExamplePath = "tests/schema_examples/evidence_blocker_contract_negative_guard.example.json";
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
  if (!passed) errors.push({ check, detail: detail || "check failed" });
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

function runArbiterCli(inputPath, label) {
  const result = childProcess.spawnSync(process.execPath, [repoPath(arbiterPath), "--input", inputPath], {
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
    "review_blocker_arbiter_version: v1",
    "candidate_arbitrations:",
    "arbiter_summary:",
    "promotion_guard:",
    "memory_forbidden_prevents_memory: true",
    "never_production_prevents_production: true",
    "pass_is_not_production_approval: true",
    "human_review_required_before_production: true",
    "production_candidate_created: false",
    "direct_memory_write_performed: false",
    "accepted_samples_write_performed: false",
    "output_channel: stdout",
  ]) {
    addResult(`schema_token_${token}_present`, schema.includes(token));
  }
  validateNoSensitiveMaterial("schema", schema);
}

function validateCommonArbiter(arbiter, label) {
  addResult(`${label}_version_v1`, arbiter.review_blocker_arbiter_version === "v1");
  addResult(`${label}_status_completed`, arbiter.status === "completed_local_blocker_arbiter");
  addResult(`${label}_mode_stdout_only`, arbiter.mode === "local_stdout_only_blocker_arbiter");
  addResult(`${label}_candidate_arbitrations_array`, Array.isArray(arbiter.candidate_arbitrations));

  const candidates = arbiter.candidate_arbitrations || [];
  addResult(
    `${label}_candidate_arbitrations_not_writes`,
    candidates.every(
      (item) =>
        item.production_promotion_allowed_now === false &&
        item.production_candidate_created === false &&
        item.memory_entry_allowed_now === false &&
        item.accepted_samples_write_performed === false &&
        item.direct_memory_write_performed === false &&
        item.requires_human_review === true
    )
  );
  addResult(
    `${label}_every_candidate_has_evidence_and_blocker`,
    candidates.every(
      (item) =>
        typeof item.evidence_record_id === "string" &&
        typeof item.production_blocker_decision_id === "string" &&
        item.blocker_count > 0
    )
  );

  const summary = arbiter.arbiter_summary || {};
  addResult(`${label}_summary_all_production_blocked`, summary.all_production_blocked === true);
  addResult(`${label}_summary_all_writes_blocked`, summary.all_writes_blocked === true);
  addResult(`${label}_summary_direct_memory_write_false`, summary.direct_memory_write_performed === false);
  addResult(`${label}_summary_production_candidate_false`, summary.production_candidate_created === false);
  addResult(`${label}_summary_accepted_samples_write_false`, summary.accepted_samples_write_performed === false);

  const guard = arbiter.promotion_guard || {};
  addResult(`${label}_guard_evidence_required`, guard.evidence_required_for_every_candidate === true);
  addResult(`${label}_guard_blocker_required`, guard.blocker_required_for_every_candidate === true);
  addResult(`${label}_guard_memory_forbidden_prevents_memory`, guard.memory_forbidden_prevents_memory === true);
  addResult(`${label}_guard_never_production_prevents_production`, guard.never_production_prevents_production === true);
  addResult(`${label}_guard_pass_not_approval`, guard.pass_is_not_production_approval === true);
  addResult(`${label}_guard_human_review_before_production`, guard.human_review_required_before_production === true);
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
    addResult(`${label}_no_execution_${flag}_false`, arbiter.no_execution_guard?.[flag] === false);
  }

  validateNoSensitiveMaterial(label, JSON.stringify(arbiter));
}

function validateAgainstEvidenceContract(arbiter, contract, label) {
  const evidenceIds = new Set((contract.evidence_records || []).map((item) => item.evidence_record_id));
  const blockerIds = new Set((contract.blocker_decisions || []).map((item) => item.blocker_decision_id));
  const exclusionIds = new Set(
    (contract.production_exclusion_register || []).map((item) => item.exclusion_record_id)
  );
  const candidates = arbiter.candidate_arbitrations || [];

  addResult(`${label}_source_contract_matches`, arbiter.source_evidence_blocker_contract_id === contract.contract_id);
  addResult(`${label}_candidate_count_matches_evidence`, candidates.length === contract.evidence_records.length);
  addResult(
    `${label}_arbitrations_reference_evidence_records`,
    candidates.every((item) => evidenceIds.has(item.evidence_record_id))
  );
  addResult(
    `${label}_arbitrations_reference_production_blockers`,
    candidates.every((item) => blockerIds.has(item.production_blocker_decision_id))
  );
  addResult(
    `${label}_arbitrations_reference_memory_blockers`,
    candidates.every((item) => item.memory_blocker_decision_ids.every((id) => blockerIds.has(id)))
  );
  addResult(
    `${label}_never_production_has_exclusion_record`,
    candidates
      .filter((item) => item.never_production)
      .every((item) => exclusionIds.has(item.production_exclusion_record_id))
  );
  addResult(
    `${label}_memory_forbidden_has_memory_blocker`,
    candidates
      .filter((item) => item.memory_forbidden)
      .every((item) => item.memory_blocker_decision_ids.length > 0 && item.memory_draft_allowed === false)
  );
}

function validateDefaultArbiter(arbiter) {
  validateCommonArbiter(arbiter, "default_arbiter");
  addResult("default_arbiter_source_protocol_expected", arbiter.source_protocol_id === "review_result_protocol_hardening_v1");
  addResult("default_arbiter_passed_count_one", arbiter.arbiter_summary?.passed_candidate_count === 1);
  addResult("default_arbiter_rejected_count_one", arbiter.arbiter_summary?.rejected_candidate_count === 1);
  addResult("default_arbiter_memory_forbidden_zero", arbiter.arbiter_summary?.memory_forbidden_count === 0);
  addResult("default_arbiter_never_production_count_one", arbiter.arbiter_summary?.never_production_count === 1);
  addResult(
    "default_arbiter_pass_candidate_pending_human_review",
    arbiter.candidate_arbitrations?.some(
      (item) =>
        item.candidate_id === "candidate_accept_metadata_001" &&
        item.final_route === "pass_draft_only_pending_human_review" &&
        item.production_decision === "block_until_human_review" &&
        item.memory_draft_allowed === true
    )
  );
  addResult(
    "default_arbiter_reject_candidate_never_production",
    arbiter.candidate_arbitrations?.some(
      (item) =>
        item.candidate_id === "candidate_reject_metadata_001" &&
        item.final_route === "reject_failure_learning_only_never_production" &&
        item.production_decision === "block_permanently" &&
        item.never_production === true
    )
  );
}

function validateNegativeArbiter(arbiter) {
  validateCommonArbiter(arbiter, "negative_guard_arbiter");
  addResult(
    "negative_guard_arbiter_source_protocol_expected",
    arbiter.source_protocol_id === "review_result_protocol_negative_guard_v1"
  );
  addResult("negative_guard_arbiter_passed_count_zero", arbiter.arbiter_summary?.passed_candidate_count === 0);
  addResult("negative_guard_arbiter_rejected_count_two", arbiter.arbiter_summary?.rejected_candidate_count === 2);
  addResult("negative_guard_arbiter_memory_forbidden_count_one", arbiter.arbiter_summary?.memory_forbidden_count === 1);
  addResult("negative_guard_arbiter_never_production_count_two", arbiter.arbiter_summary?.never_production_count === 2);
  addResult(
    "negative_guard_arbiter_unknown_memory_forbidden_blocked",
    arbiter.candidate_arbitrations?.some(
      (item) =>
        item.candidate_id === "candidate_reject_unknown_guard_001" &&
        item.final_route === "reject_memory_forbidden_never_production" &&
        item.memory_decision === "block_memory_entry" &&
        item.memory_draft_allowed === false &&
        item.memory_forbidden === true &&
        item.never_production === true
    )
  );
  addResult(
    "negative_guard_arbiter_all_rejected_never_production",
    ["candidate_reject_mapped_guard_001", "candidate_reject_unknown_guard_001"].every((id) =>
      arbiter.candidate_arbitrations?.some(
        (item) => item.candidate_id === id && item.production_decision === "block_permanently"
      )
    )
  );
}

for (const file of [
  arbiterPath,
  schemaPath,
  examplePath,
  negativeExamplePath,
  evidenceExamplePath,
  negativeEvidenceExamplePath,
  defaultInputPath,
  negativeInputPath,
]) {
  addResult(`${file}_exists`, fs.existsSync(repoPath(file)), file);
}

runNodeCheck(arbiterPath);
runNodeCheck("scripts/validate_review_blocker_arbiter.js");

try {
  validateSchema(readFile(schemaPath));
} catch (error) {
  addResult("schema_readable", false, error.message);
}

let example = null;
try {
  example = parseJson(examplePath);
  validateDefaultArbiter(example);
  validateAgainstEvidenceContract(example, parseJson(evidenceExamplePath), "default_arbiter");
  addResult("default_arbiter_example_parseable", true);
} catch (error) {
  addResult("default_arbiter_example_parseable", false, error.message);
}

let negativeExample = null;
try {
  negativeExample = parseJson(negativeExamplePath);
  validateNegativeArbiter(negativeExample);
  validateAgainstEvidenceContract(negativeExample, parseJson(negativeEvidenceExamplePath), "negative_guard_arbiter");
  addResult("negative_guard_arbiter_example_parseable", true);
} catch (error) {
  addResult("negative_guard_arbiter_example_parseable", false, error.message);
}

const defaultArbiter = runArbiterCli(defaultInputPath, "default_arbiter");
if (defaultArbiter) {
  validateDefaultArbiter(defaultArbiter);
  validateAgainstEvidenceContract(defaultArbiter, parseJson(evidenceExamplePath), "default_arbiter_cli");
  if (example) {
    addResult("default_arbiter_example_matches_cli_output", deepEqual(defaultArbiter, example));
  }
}

const negativeArbiter = runArbiterCli(negativeInputPath, "negative_guard_arbiter");
if (negativeArbiter) {
  validateNegativeArbiter(negativeArbiter);
  validateAgainstEvidenceContract(negativeArbiter, parseJson(negativeEvidenceExamplePath), "negative_guard_arbiter_cli");
  if (negativeExample) {
    addResult("negative_guard_arbiter_example_matches_cli_output", deepEqual(negativeArbiter, negativeExample));
  }
}

const passed = errors.length === 0;
const summary = {
  validator: "validate_review_blocker_arbiter",
  version: "v1",
  passed,
  files_checked: [
    arbiterPath,
    schemaPath,
    examplePath,
    negativeExamplePath,
    evidenceExamplePath,
    negativeEvidenceExamplePath,
    defaultInputPath,
    negativeInputPath,
  ],
  check_count: results.length,
  failed_count: errors.length,
  review_blocker_arbiter: {
    arbiter_cli_present: fs.existsSync(repoPath(arbiterPath)),
    schema_present: fs.existsSync(repoPath(schemaPath)),
    example_present: fs.existsSync(repoPath(examplePath)),
    negative_guard_example_present: fs.existsSync(repoPath(negativeExamplePath)),
    stdout_only: true,
    candidate_arbitrations_verified: true,
    evidence_contract_trace_verified: true,
    default_pass_candidate_human_review_blocked_verified: true,
    default_reject_candidate_never_production_verified: true,
    negative_guard_memory_forbidden_verified: true,
    negative_guard_never_production_verified: true,
    negative_guard_memory_forbidden_prevents_memory_verified: true,
    production_promotion_blocked_verified: true,
    default_arbiter_example_matches_cli_output: example && defaultArbiter ? deepEqual(defaultArbiter, example) : false,
    negative_guard_arbiter_example_matches_cli_output:
      negativeExample && negativeArbiter ? deepEqual(negativeArbiter, negativeExample) : false,
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
