#!/usr/bin/env node
"use strict";

const { spawnSync } = require("node:child_process");
const path = require("node:path");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");
const { validateAllCapsuleManifests } = require("./lib/capsule_manifest_contract");
const {
  FAILURE_CLASS,
} = require("./lib/capsule_status_taxonomy");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);

const files = {
  phaseRecord: "docs/P6B_CAPSULE_REGISTRY_REPORT_V2.md",
  fixture: "tests/schema_examples/P6B_CAPSULE_REGISTRY_REPORT_V2.example.json",
  acceptedValidator: "scripts/validate_preview_capsule_registry.js",
  failureValidator: "scripts/validate_failure_sample_capsule_registry.js",
  dashboardValidator: "scripts/validate_multi_capsule_dashboard.js",
  mvpValidator: "scripts/validate_mvp.ps1",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md"
};

const expected = {
  phase: "p6b_capsule_registry_report_v2",
  reportVersion: "accepted_failure_capsule_registry_report_v2",
  acceptedIds: [
    "accepted_french_summer_rattan_bucket_bag_001",
    "accepted_product_still_life_tennis_wallet_001",
    "accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001"
  ],
  failureIds: [
    "failure_french_summer_rattan_bag_v7_29_001",
    "failure_tennis_wallet_v7_21_001"
  ],
  relations: [
    {
      failure_sample_id: "failure_french_summer_rattan_bag_v7_29_001",
      accepted_sample_id: "accepted_french_summer_rattan_bucket_bag_001"
    },
    {
      failure_sample_id: "failure_tennis_wallet_v7_21_001",
      accepted_sample_id: "accepted_product_still_life_tennis_wallet_001"
    }
  ]
};

function runJsonValidator(relativePath, args = []) {
  const command = process.execPath;
  const result = spawnSync(command, [core.repoPath(relativePath), ...args], {
    cwd: root,
    encoding: "utf8"
  });
  const stdout = result.stdout.trim();
  let parsed = null;
  try {
    parsed = stdout ? JSON.parse(stdout) : null;
  } catch (error) {
    parsed = {
      passed: false,
      status: "json_parse_failed",
      error: error.message,
      stdout
    };
  }
  return {
    command: `node ${relativePath}${args.length ? ` ${args.join(" ")}` : ""}`,
    exit_code: result.status,
    parsed,
    stderr: result.stderr.trim()
  };
}

function rel(rootPath, fileName) {
  return `${rootPath.replace(/\/+$/, "")}/${fileName}`;
}

function readAcceptedSample(row, manifestById = new Map()) {
  const sampleRoot = `asset_archive/accepted_samples/${row.sample_id}`;
  const manifest = core.parseJsonIfExists(rel(sampleRoot, "manifest.json")) || {};
  const manifestContract = manifestById.get(row.sample_id) || {};
  const isDurableArchive = manifest.manifest_type === "accepted_sample_durable_archive_manifest";
  return {
    lane: "accepted",
    sample_id: row.sample_id,
    passed: row.passed === true,
    status: row.status,
    registry_validator_status: "registry_driven_preview_capsules_verified",
    portable_validation_status: row.passed === true ? "passed" : "failed",
    manifest_validation_status: manifestContract.manifest_validation_status || "manifest_contract_not_evaluated",
    manifest_contract_passed: typeof manifestContract.passed === "boolean" ? manifestContract.passed === true : null,
    relation_validation_status: "not_applicable",
    guard_validation_status: row.failure_classes?.includes("production_or_memory_guard_violation") ? "failed" : "passed",
    manifest_ref: rel(sampleRoot, "manifest.json"),
    preview_ref: rel(sampleRoot, manifest.artifact?.preview?.path || "preview.webp"),
    preview_sha256: row.preview_sha256,
    preview_long_edge: row.preview_long_edge,
    chain_refs: isDurableArchive
      ? [
        rel(sampleRoot, manifest.artifact?.original?.path || "original.png"),
        rel(sampleRoot, manifest.artifact?.preview?.path || "preview.webp")
      ]
      : [
        rel(sampleRoot, manifest.chain?.import_record || "import_record.json"),
        rel(sampleRoot, manifest.chain?.review_record || "review_record.json"),
        rel(sampleRoot, manifest.chain?.approval_record || "approval_record.json")
      ],
    resolved_by_accepted_sample: null,
    failure_tags: [],
    failure_classes: row.failure_classes || [],
    failures: row.failures || []
  };
}

function readFailureSample(row, manifestById = new Map()) {
  const sampleRoot = `asset_archive/failure_samples/${row.sample_id}`;
  const manifest = core.parseJsonIfExists(rel(sampleRoot, "manifest.json")) || {};
  const manifestContract = manifestById.get(row.sample_id) || {};
  const failureRecord = core.parseJsonIfExists(rel(sampleRoot, manifest.chain?.failure_record || "failure_record.json")) || {};
  const summary = failureRecord.failure_summary || {};
  return {
    lane: "failure",
    sample_id: row.sample_id,
    passed: row.passed === true,
    status: row.status,
    registry_validator_status: "failure_sample_capsules_verified",
    portable_validation_status: row.passed === true ? "passed" : "failed",
    manifest_validation_status: manifestContract.manifest_validation_status || "manifest_contract_not_evaluated",
    manifest_contract_passed: typeof manifestContract.passed === "boolean" ? manifestContract.passed === true : null,
    relation_validation_status: summary.resolved_by_accepted_sample ? "linked_pending_report_check" : "missing_resolved_by_link",
    guard_validation_status: row.failure_classes?.includes("production_or_memory_guard_violation") ? "failed" : "passed",
    manifest_ref: rel(sampleRoot, "manifest.json"),
    preview_ref: rel(sampleRoot, manifest.artifact?.preview?.path || "preview.webp"),
    preview_sha256: row.preview_sha256,
    preview_long_edge: row.preview_long_edge,
    chain_refs: [
      rel(sampleRoot, manifest.chain?.failure_record || "failure_record.json"),
      rel(sampleRoot, manifest.chain?.review_record || "review_record.json")
    ],
    resolved_by_accepted_sample: summary.resolved_by_accepted_sample || null,
    failure_tags: summary.failure_tags || [],
    final_route: "failure_learning_only_never_production",
    failure_classes: row.failure_classes || [],
    failures: row.failures || []
  };
}

function summarizeClassCounts(rows, relations) {
  return {
    accepted_failed: rows.filter((row) => row.lane === "accepted" && !row.passed).length,
    failure_failed: rows.filter((row) => row.lane === "failure" && !row.passed).length,
    missing_resolved_by_link: relations.filter((relation) => relation.relation_status !== "linked").length,
    production_or_memory_guard_violation: rows.filter((row) =>
      row.failure_classes.includes(FAILURE_CLASS.PRODUCTION_OR_MEMORY_GUARD_VIOLATION)
    ).length,
    missing_chain_file: rows.filter((row) => row.failure_classes.includes(FAILURE_CLASS.MISSING_CHAIN_FILE)).length,
    chain_record_mismatch: rows.filter((row) => row.failure_classes.includes(FAILURE_CLASS.CHAIN_RECORD_MISMATCH)).length,
    manifest_contract_mismatch: rows.filter((row) => row.failure_classes.includes(FAILURE_CLASS.MANIFEST_CONTRACT_MISMATCH)).length,
    preview_hash_mismatch: rows.filter((row) => row.failure_classes.includes(FAILURE_CLASS.PREVIEW_HASH_MISMATCH)).length,
    preview_long_edge_mismatch: rows.filter((row) => row.failure_classes.includes(FAILURE_CLASS.PREVIEW_LONG_EDGE_MISMATCH)).length
  };
}

function buildReport(acceptedRegistry, failureRegistry, manifestContract = null) {
  const manifestById = new Map((manifestContract?.samples || []).map((sample) => [sample.sample_id, sample]));
  const acceptedRows = (acceptedRegistry.samples || []).map((row) => readAcceptedSample(row, manifestById));
  const failureRows = (failureRegistry.samples || []).map((row) => readFailureSample(row, manifestById));
  const rows = acceptedRows.concat(failureRows);
  const acceptedIds = new Set(acceptedRows.map((row) => row.sample_id));
  const resolvedByLinks = failureRows.map((row) => ({
    relation_id: `${row.sample_id}__resolved_by__${row.resolved_by_accepted_sample || "missing"}`,
    failure_sample_id: row.sample_id,
    accepted_sample_id: row.resolved_by_accepted_sample,
    relation_status: row.resolved_by_accepted_sample && acceptedIds.has(row.resolved_by_accepted_sample)
      ? "linked"
      : "missing_accepted_capsule",
    failure_final_route: row.final_route,
    failure_tags: row.failure_tags,
    accepted_is_reusable_positive_example: Boolean(row.resolved_by_accepted_sample && acceptedIds.has(row.resolved_by_accepted_sample)),
    failure_is_never_production: row.final_route === "failure_learning_only_never_production"
  }));
  for (const row of failureRows) {
    const relation = resolvedByLinks.find((item) => item.failure_sample_id === row.sample_id);
    row.relation_validation_status = relation?.relation_status === "linked" ? "linked" : "missing_resolved_by_link";
  }

  const manifestFailedRows = rows.filter((row) => row.manifest_contract_passed !== true);
  const relationFailedRows = [];
  const guardFailedRows = rows.filter((row) => row.guard_validation_status !== "passed");
  const reportFailures = [];
  if (acceptedRegistry.passed !== true) reportFailures.push("accepted_registry_failed");
  if (failureRegistry.passed !== true) reportFailures.push("failure_registry_failed");
  if (manifestContract && manifestContract.passed !== true) reportFailures.push("manifest_contract_failed");
  for (const relation of resolvedByLinks) {
    if (relation.relation_status !== "linked") {
      reportFailures.push(`missing_resolved_by_link:${relation.failure_sample_id}`);
      relationFailedRows.push(relation.failure_sample_id);
    }
  }

  const guard = {
    static_validator_only: true,
    directory_as_registry: true,
    old_runs_source_required_for_portable_validation: false,
    preview_creation_or_copy_performed: false,
    accepted_samples_write_performed: false,
    failure_samples_write_performed: false,
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
    push_tag_release_deploy_performed: false,
    vcp_runtime_integration_proven: false
  };

  return {
    phase: expected.phase,
    passed: reportFailures.length === 0,
    status: reportFailures.length === 0
      ? "accepted_failure_capsule_registry_report_v2_verified"
      : "accepted_failure_capsule_registry_report_v2_failed",
    report_version: expected.reportVersion,
    source_reports: {
      accepted_registry_status: acceptedRegistry.status,
      accepted_registry_report_version: acceptedRegistry.report_version,
      failure_registry_status: failureRegistry.status,
      failure_registry_report_version: failureRegistry.report_version,
      manifest_contract_status: manifestContract?.status || "manifest_contract_not_evaluated",
      manifest_contract_report_version: manifestContract?.report_version || null
    },
    contract_status: {
      registry_passed: acceptedRegistry.passed === true && failureRegistry.passed === true,
      manifest_passed: manifestContract ? manifestContract.passed === true : "not_evaluated",
      relation_passed: relationFailedRows.length === 0,
      guard_passed: guardFailedRows.length === 0,
      overall_passed: reportFailures.length === 0
    },
    totals: {
      accepted: acceptedRows.length,
      failure: failureRows.length,
      total: rows.length,
      passed: rows.filter((row) => row.passed).length,
      failed: rows.filter((row) => !row.passed).length
    },
    accepted_sample_ids: acceptedRows.map((row) => row.sample_id),
    failure_sample_ids: failureRows.map((row) => row.sample_id),
    per_sample_results: rows,
    resolved_by_links: resolvedByLinks,
    failure_class_summary: summarizeClassCounts(rows, resolvedByLinks),
    report_fields: [
      "lane",
      "sample_id",
      "passed",
      "status",
      "registry_validator_status",
      "portable_validation_status",
      "manifest_validation_status",
      "manifest_contract_passed",
      "relation_validation_status",
      "guard_validation_status",
      "manifest_ref",
      "preview_ref",
      "chain_refs",
      "resolved_by_accepted_sample",
      "failure_tags",
      "failure_classes"
    ],
    guard,
    failures: reportFailures
  };
}

function currentBoardBlock(text) {
  return text.split(/\r?\n---\r?\n/)[0];
}

function evaluate(report, fixture, currentSurfaces) {
  const checks = [];
  const add = (check, passed) => checks.push({ check, passed: Boolean(passed) });
  const includesAll = (values, expectedValues) => expectedValues.every((value) => Array.isArray(values) && values.includes(value));

  add("report_passed", report.passed === true);
  add("phase_matches", report.phase === expected.phase);
  add("report_version_matches", report.report_version === expected.reportVersion);
  add("accepted_count_matches", report.totals.accepted === expected.acceptedIds.length);
  add("failure_count_matches", report.totals.failure === expected.failureIds.length);
  add("total_count_matches", report.totals.total === expected.acceptedIds.length + expected.failureIds.length);
  add("all_samples_passed", report.totals.passed === report.totals.total && report.totals.failed === 0);
  add("accepted_ids_match", includesAll(report.accepted_sample_ids, expected.acceptedIds));
  add("failure_ids_match", includesAll(report.failure_sample_ids, expected.failureIds));
  add("resolved_by_links_present", expected.relations.every((expectedRelation) =>
    report.resolved_by_links.some((relation) =>
      relation.failure_sample_id === expectedRelation.failure_sample_id &&
      relation.accepted_sample_id === expectedRelation.accepted_sample_id &&
      relation.relation_status === "linked"
    )
  ));
  add("failure_summary_clean", report.failure_class_summary.accepted_failed === 0 &&
    report.failure_class_summary.failure_failed === 0 &&
    report.failure_class_summary.missing_resolved_by_link === 0 &&
    report.failure_class_summary.production_or_memory_guard_violation === 0);
  add("contract_statuses_pass", report.contract_status.registry_passed === true &&
    report.contract_status.manifest_passed === true &&
    report.contract_status.relation_passed === true &&
    report.contract_status.guard_passed === true &&
    report.contract_status.overall_passed === true);
  add("per_sample_contract_fields_present", report.per_sample_results.every((row) =>
    typeof row.manifest_validation_status === "string" &&
    row.manifest_contract_passed === true &&
    typeof row.relation_validation_status === "string" &&
    typeof row.guard_validation_status === "string"
  ));
  add("old_runs_not_required", report.guard.old_runs_source_required_for_portable_validation === false);
  add("no_write_or_external_guard", report.guard.preview_creation_or_copy_performed === false &&
    report.guard.accepted_samples_write_performed === false &&
    report.guard.failure_samples_write_performed === false &&
    report.guard.provider_contact_performed === false &&
    report.guard.plugin_call_performed === false &&
    report.guard.api_call_performed === false &&
    report.guard.image_generation_performed === false &&
    report.guard.DailyNote_write_performed === false &&
    report.guard.VCP_memory_write_performed === false &&
    report.guard.runtime_execution_performed === false &&
    report.guard.real_manifest_read_performed === false &&
    report.guard.real_vcpchat_read_performed === false &&
    report.guard.real_vcptoolbox_read_performed === false &&
    report.guard.production_candidate_write_performed === false &&
    report.guard.push_tag_release_deploy_performed === false);
  add("fixture_declares_same_phase", fixture.phase === expected.phase);
  add("fixture_declares_same_report_version", fixture.report_version === expected.reportVersion);
  add("fixture_counts_match", fixture.totals.accepted === expected.acceptedIds.length && fixture.totals.failure === expected.failureIds.length && fixture.totals.total === expected.acceptedIds.length + expected.failureIds.length);
  add("current_surfaces_reference_report", currentSurfaces.includes("p6b_capsule_registry_report_v2") &&
    currentSurfaces.includes("scripts/validate_capsule_registry_report_v2.js") &&
    currentSurfaces.includes("accepted_failure_capsule_registry_report_v2"));

  return checks;
}

function main() {
  const acceptedRun = runJsonValidator(files.acceptedValidator);
  const failureRun = runJsonValidator(files.failureValidator, ["--require-at-least=1"]);
  const acceptedRegistry = acceptedRun.parsed || { passed: false, samples: [], status: "missing_accepted_report" };
  const failureRegistry = failureRun.parsed || { passed: false, samples: [], status: "missing_failure_report" };
  const manifestContract = validateAllCapsuleManifests(core);
  const report = buildReport(acceptedRegistry, failureRegistry, manifestContract);

  const fixture = core.parseJsonIfExists(files.fixture)?.capsule_registry_report_v2 || {};
  const currentSurfaces = [
    JSON.stringify(fixture, null, 2),
    ...Object.values(files).filter((file) => core.exists(file)).map((file) => {
      const text = core.read(file);
      return file.startsWith(".agent_board/") ? currentBoardBlock(text) : text;
    })
  ].join("\n");
  const checks = evaluate(report, fixture, currentSurfaces);

  if (acceptedRun.exit_code !== 0) report.failures.push("accepted_registry_validator_exited_nonzero");
  if (failureRun.exit_code !== 0) report.failures.push("failure_registry_validator_exited_nonzero");
  for (const check of checks) {
    if (!check.passed) report.failures.push(`check_failed:${check.check}`);
  }

  report.passed = report.failures.length === 0;
  report.status = report.passed
    ? "accepted_failure_capsule_registry_report_v2_verified"
    : "accepted_failure_capsule_registry_report_v2_failed";

  const output = {
    ...report,
    check_count: checks.length,
    failed_count: checks.filter((check) => !check.passed).length,
    checks,
    validator_runs: {
      accepted: {
        command: acceptedRun.command,
        exit_code: acceptedRun.exit_code,
        passed: acceptedRegistry.passed === true,
        status: acceptedRegistry.status
      },
      failure: {
        command: failureRun.command,
        exit_code: failureRun.exit_code,
        passed: failureRegistry.passed === true,
        status: failureRegistry.status
      }
    }
  };

  process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
  process.exit(output.passed ? 0 : 1);
}

module.exports = {
  buildReport,
  evaluate,
  expected
};

if (require.main === module) {
  main();
}
