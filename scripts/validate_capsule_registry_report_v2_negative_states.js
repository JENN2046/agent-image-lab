#!/usr/bin/env node
"use strict";

const path = require("node:path");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");
const { buildReport } = require("./validate_capsule_registry_report_v2");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);

const files = {
  phaseRecord: "docs/P6G_REGISTRY_REPORT_V2_NEGATIVE_STATE_DESIGN.md",
  fixture: "tests/schema_examples/P6G_REGISTRY_REPORT_V2_NEGATIVE_STATES.example.json",
  reportValidator: "scripts/validate_capsule_registry_report_v2.js",
  negativeValidator: "scripts/validate_capsule_registry_report_v2_negative_states.js",
  mvpValidator: "scripts/validate_mvp.ps1",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md"
};

const acceptedOk = {
  passed: true,
  status: "registry_driven_preview_capsules_verified",
  report_version: "v2",
  samples: [
    {
      sample_id: "accepted_french_summer_rattan_bucket_bag_001",
      passed: true,
      status: "git_portable_preview_evidence_verified",
      preview_sha256: "a".repeat(64),
      preview_long_edge: 512,
      failure_classes: [],
      failures: []
    }
  ]
};

const failureOk = {
  passed: true,
  status: "failure_sample_capsules_verified",
  report_version: "v1",
  samples: [
    {
      sample_id: "failure_french_summer_rattan_bag_v7_29_001",
      passed: true,
      status: "git_portable_failure_preview_evidence_verified",
      preview_sha256: "b".repeat(64),
      preview_long_edge: 512,
      failure_classes: [],
      failures: []
    }
  ]
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function expect(condition, check, detail = null) {
  return { check, passed: Boolean(condition), ...(detail === null ? {} : { detail }) };
}

function currentBoardBlock(text) {
  return text.split(/\r?\n---\r?\n/)[0];
}

function scenario(name, acceptedRegistry, failureRegistry) {
  return {
    name,
    report: buildReport(acceptedRegistry, failureRegistry)
  };
}

const checks = [];

for (const [key, relativePath] of Object.entries(files)) {
  checks.push(expect(core.exists(relativePath), `${key}_exists`, relativePath));
}

const acceptedFailed = clone(acceptedOk);
acceptedFailed.passed = false;
acceptedFailed.status = "registry_driven_preview_capsules_failed";
acceptedFailed.samples[0].passed = false;
acceptedFailed.samples[0].status = "preview_capsule_missing";
acceptedFailed.samples[0].failure_classes = ["missing_capsule_manifest"];
acceptedFailed.samples[0].failures = ["manifest_exists"];

const failureFailed = clone(failureOk);
failureFailed.passed = false;
failureFailed.status = "failure_sample_capsules_failed";
failureFailed.samples[0].passed = false;
failureFailed.samples[0].status = "failure_preview_capsule_failed";
failureFailed.samples[0].failure_classes = ["missing_chain_file", "preview_hash_mismatch"];
failureFailed.samples[0].failures = ["failure_record_exists", "preview_sha256_matches_manifest"];

const missingResolvedBy = clone(failureOk);
missingResolvedBy.samples[0].sample_id = "failure_without_resolution_001";

const guardViolation = clone(failureOk);
guardViolation.samples[0].passed = false;
guardViolation.samples[0].failure_classes = ["production_or_memory_guard_violation"];
guardViolation.samples[0].failures = ["production_candidate_allowed_false"];
guardViolation.passed = false;
guardViolation.status = "failure_sample_capsules_failed";

const scenarios = [
  scenario("accepted_registry_failure", acceptedFailed, failureOk),
  scenario("failure_registry_failure", acceptedOk, failureFailed),
  scenario("missing_resolved_by_link", acceptedOk, missingResolvedBy),
  scenario("production_or_memory_guard_violation", acceptedOk, guardViolation)
];

const byName = Object.fromEntries(scenarios.map((item) => [item.name, item.report]));

checks.push(expect(byName.accepted_registry_failure.passed === false, "accepted_registry_failure_fails_closed", byName.accepted_registry_failure.failures));
checks.push(expect(byName.accepted_registry_failure.failures.includes("accepted_registry_failed"), "accepted_registry_failure_reported", byName.accepted_registry_failure.failures));
checks.push(expect(byName.accepted_registry_failure.failure_class_summary.accepted_failed === 1, "accepted_failed_summary_counted", byName.accepted_registry_failure.failure_class_summary));
checks.push(expect(byName.accepted_registry_failure.failure_class_summary.missing_resolved_by_link === 0, "accepted_failure_does_not_invent_missing_link", byName.accepted_registry_failure.failure_class_summary));

checks.push(expect(byName.failure_registry_failure.passed === false, "failure_registry_failure_fails_closed", byName.failure_registry_failure.failures));
checks.push(expect(byName.failure_registry_failure.failures.includes("failure_registry_failed"), "failure_registry_failure_reported", byName.failure_registry_failure.failures));
checks.push(expect(byName.failure_registry_failure.failure_class_summary.failure_failed === 1, "failure_failed_summary_counted", byName.failure_registry_failure.failure_class_summary));
checks.push(expect(byName.failure_registry_failure.failure_class_summary.missing_chain_file === 1, "missing_chain_file_summary_counted", byName.failure_registry_failure.failure_class_summary));
checks.push(expect(byName.failure_registry_failure.failure_class_summary.preview_hash_mismatch === 1, "preview_hash_mismatch_summary_counted", byName.failure_registry_failure.failure_class_summary));

checks.push(expect(byName.missing_resolved_by_link.passed === false, "missing_resolved_by_link_fails_closed", byName.missing_resolved_by_link.failures));
checks.push(expect(byName.missing_resolved_by_link.failures.includes("missing_resolved_by_link:failure_without_resolution_001"), "missing_resolved_by_link_reported_by_sample", byName.missing_resolved_by_link.failures));
checks.push(expect(byName.missing_resolved_by_link.failure_class_summary.missing_resolved_by_link === 1, "missing_resolved_by_link_summary_counted", byName.missing_resolved_by_link.failure_class_summary));
checks.push(expect(byName.missing_resolved_by_link.resolved_by_links[0].relation_status === "missing_accepted_capsule", "missing_resolved_by_link_relation_status", byName.missing_resolved_by_link.resolved_by_links[0]));

checks.push(expect(byName.production_or_memory_guard_violation.passed === false, "guard_violation_fails_closed", byName.production_or_memory_guard_violation.failures));
checks.push(expect(byName.production_or_memory_guard_violation.failure_class_summary.production_or_memory_guard_violation === 1, "guard_violation_summary_counted", byName.production_or_memory_guard_violation.failure_class_summary));
checks.push(expect(byName.production_or_memory_guard_violation.failure_class_summary.failure_failed === 1, "guard_violation_counts_as_failure_failed", byName.production_or_memory_guard_violation.failure_class_summary));

for (const item of scenarios) {
  checks.push(expect(item.report.guard.old_runs_source_required_for_portable_validation === false, `${item.name}_old_runs_not_required`, item.report.guard));
  checks.push(expect(item.report.guard.provider_contact_performed === false &&
    item.report.guard.plugin_call_performed === false &&
    item.report.guard.api_call_performed === false &&
    item.report.guard.image_generation_performed === false &&
    item.report.guard.DailyNote_write_performed === false &&
    item.report.guard.VCP_memory_write_performed === false &&
    item.report.guard.runtime_execution_performed === false &&
    item.report.guard.real_manifest_read_performed === false &&
    item.report.guard.real_vcpchat_read_performed === false &&
    item.report.guard.real_vcptoolbox_read_performed === false &&
    item.report.guard.production_candidate_write_performed === false &&
    item.report.guard.push_tag_release_deploy_performed === false,
    `${item.name}_no_external_or_a5_guard`,
    item.report.guard));
}

const fixture = core.parseJson(files.fixture).capsule_registry_report_v2_negative_states;
checks.push(expect(fixture.phase === "p6g_registry_report_v2_negative_state_design", "fixture_phase_matches", fixture.phase));
checks.push(expect(fixture.negative_state_classes.includes("missing_resolved_by_link"), "fixture_declares_missing_link_class", fixture.negative_state_classes));
checks.push(expect(fixture.negative_state_classes.includes("production_or_memory_guard_violation"), "fixture_declares_guard_class", fixture.negative_state_classes));
checks.push(expect(fixture.no_third_capsule_creation === true, "fixture_blocks_third_capsule_creation", fixture.no_third_capsule_creation));

const currentSurfaces = Object.values(files).filter((file) => core.exists(file)).map((file) => {
  const text = core.read(file);
  return file.startsWith(".agent_board/") ? currentBoardBlock(text) : text;
}).join("\n");
for (const token of [
  "p6g_registry_report_v2_negative_state_design",
  "validate_capsule_registry_report_v2_negative_states",
  "missing_resolved_by_link",
  "production_or_memory_guard_violation",
  "no third"
]) {
  checks.push(expect(currentSurfaces.includes(token), `current_surfaces_token_${token}_present`));
}

const failed = checks.filter((check) => !check.passed);
const guard = {
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
  production_candidate_write_performed: false,
  push_tag_release_deploy_performed: false
};
const result = {
  validator: "validate_capsule_registry_report_v2_negative_states",
  version: "v1",
  phase: "p6g_registry_report_v2_negative_state_design",
  passed: failed.length === 0,
  status: failed.length === 0
    ? "capsule_registry_report_v2_negative_states_verified"
    : "capsule_registry_report_v2_negative_states_failed",
  check_count: checks.length,
  failed_count: failed.length,
  scenario_count: scenarios.length,
  negative_state_classes: [
    "accepted_registry_failed",
    "failure_registry_failed",
    "missing_resolved_by_link",
    "missing_chain_file",
    "preview_hash_mismatch",
    "production_or_memory_guard_violation"
  ],
  no_real_capsule_modified: true,
  no_third_capsule_creation: true,
  guard,
  ...guard,
  checks,
  failures: failed
};

process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
process.exit(result.passed ? 0 : 1);
