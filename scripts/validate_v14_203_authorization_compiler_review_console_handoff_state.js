#!/usr/bin/env node
"use strict";

const path = require("node:path");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);

const files = {
  phaseRecord: "docs/v14_203_authorization_compiler_review_console_handoff_state.md",
  fixture: "tests/schema_examples/v14_203_authorization_compiler_review_console_handoff_state.example.json",
  sourceBlockerArbiter: "tests/schema_examples/v14_202_authorization_package_blocker_arbiter_contract.example.json",
  sourceCoverageCloseout: "tests/schema_examples/v14_201_authorization_package_compiler_coverage_closeout.example.json",
  mvpValidator: "scripts/validate_mvp.ps1",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
};

const results = [];
const errors = [];

function addResult(check, passed, detail) {
  results.push({ check, passed: Boolean(passed), ...(detail ? { detail } : {}) });
  if (!passed) errors.push({ check, detail: detail || "check failed" });
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function requireToken(label, text, token) {
  addResult(`${label}_token_${token}_present`, text.includes(token));
}

function sameList(left, right) {
  return left.length === right.length && left.every((item) => right.includes(item));
}

function evaluate(input, sourceBlockerArbiter, sourceCoverageCloseout) {
  const arbiter = sourceBlockerArbiter.authorization_package_blocker_arbiter_contract || {};
  const coverage = sourceCoverageCloseout.authorization_package_compiler_coverage_closeout || {};
  const decisions = arbiter.blocker_decisions || [];
  const cards = input.package_cards || [];
  const guard = input.guard || {};
  const display = input.display_contract || {};

  const decisionTypes = decisions.map((entry) => entry.package_type);
  const cardTypes = cards.map((entry) => entry.package_type);

  const sourceOk =
    input.source_blocker_arbiter_ref === files.sourceBlockerArbiter &&
    input.source_coverage_closeout_ref === files.sourceCoverageCloseout &&
    arbiter.arbiter_status === "all_package_types_blocked_pending_exact_authorization" &&
    arbiter.package_type_count === 5 &&
    arbiter.all_execution_allowed_now === false &&
    coverage.coverage_status === "complete_local_blocked_coverage" &&
    coverage.package_type_count_covered === 5;

  const packageOk =
    input.phase === "v14_203_authorization_compiler_review_console_handoff_state" &&
    input.execution_mode === "review_console_static_handoff_state_only" &&
    input.handoff_state_status === "static_ready_no_runtime" &&
    input.package_card_count === 5 &&
    cards.length === 5 &&
    new Set(cardTypes).size === 5 &&
    sameList(cardTypes, decisionTypes);

  const displayOk =
    display.read_model_only === true &&
    display.read_only === true &&
    display.fetch_allowed === false &&
    display.file_write_allowed === false &&
    display.runtime_integration_allowed === false &&
    display.ipc_preload_renderer_integration_allowed === false &&
    display.package_execution_allowed === false;

  const cardsOk = cards.every((card) => {
    const decision = decisions.find((entry) => entry.package_type === card.package_type);
    return (
      decision &&
      card.card_status === "blocked_pending_exact_authorization" &&
      card.blocker_code === decision.blocker_code &&
      card.execution_allowed_now === false &&
      card.source_blocker_decision_ref === `v14_202:${card.package_type}` &&
      card.review_console_action === "display_blocker_and_required_fields_only" &&
      String(card.next_authorization_class || "").startsWith("Jenn exact A5") &&
      Array.isArray(card.missing_requirements) &&
      sameList(card.missing_requirements, decision.package_specific_required || [])
    );
  });

  const validationOk =
    (input.validation_required || []).includes("git diff --check") &&
    (input.validation_required || []).includes("node scripts/validate_v14_202_authorization_package_blocker_arbiter_contract.js") &&
    (input.validation_required || []).includes("node scripts/validate_v14_201_authorization_package_compiler_coverage_closeout.js") &&
    (input.validation_required || []).includes("node scripts/validate_agent_board_state.js") &&
    (input.validation_required || []).includes("powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1");

  const noExecution =
    guard.review_console_handoff_state_only === true &&
    guard.authorization_execution_performed === false &&
    guard.package_execution_performed === false &&
    guard.accepted_samples_write_performed === false &&
    guard.manifest_read_performed === false &&
    guard.durable_archive_copy_performed === false &&
    guard.production_candidate_write_performed === false &&
    guard.failure_samples_write_performed === false &&
    guard.DailyNote_write_performed === false &&
    guard.VCP_memory_write_performed === false;

  const noExternal =
    guard.provider_contact_performed === false &&
    guard.plugin_call_performed === false &&
    guard.api_call_performed === false &&
    guard.mcp_runtime_performed === false &&
    guard.fetch_performed === false &&
    guard.file_write_performed === false &&
    guard.review_console_runtime_integration_performed === false &&
    guard.ipc_preload_renderer_integration_performed === false &&
    guard.real_manifest_read_performed === false &&
    guard.real_vcpchat_read_performed === false &&
    guard.real_vcptoolbox_read_performed === false &&
    guard.push_tag_release_deploy_performed === false;

  const noRuntimeClaim =
    guard.artifact_recoverability_is_not_vcp_runtime_integration === true &&
    guard.vcp_runtime_integration_proven === false;

  return {
    passed: sourceOk && packageOk && displayOk && cardsOk && validationOk && noExecution && noExternal && noRuntimeClaim,
    sourceOk,
    packageOk,
    displayOk,
    cardsOk,
    validationOk,
    noExecution,
    noExternal,
    noRuntimeClaim,
  };
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, core.exists(relativePath), relativePath);
}

const fixture = core.parseJson(files.fixture).review_console_authorization_handoff_state;
const sourceBlockerArbiter = core.parseJson(files.sourceBlockerArbiter);
const sourceCoverageCloseout = core.parseJson(files.sourceCoverageCloseout);
const phaseRecord = core.read(files.phaseRecord);
const currentSurfaces = [
  phaseRecord,
  JSON.stringify(fixture, null, 2),
  core.read(files.runState),
  core.read(files.taskQueue),
  core.read(files.checkpoint),
  core.read(files.handoff),
  core.read(files.mvpValidator),
].join("\n");

const baseEval = evaluate(fixture, sourceBlockerArbiter, sourceCoverageCloseout);
addResult("review_console_authorization_handoff_state_evaluation_passes", baseEval.passed);

const missingPackageCard = clone(fixture);
missingPackageCard.package_cards = missingPackageCard.package_cards.filter((entry) => entry.package_type !== "manifest_read");
const executionAllowedCard = clone(fixture);
executionAllowedCard.package_cards[0].execution_allowed_now = true;
const missingSourceContract = clone(fixture);
missingSourceContract.source_blocker_arbiter_ref = "missing-source-contract.json";
const runtimeFlag = clone(fixture);
runtimeFlag.guard.review_console_runtime_integration_performed = true;
const vcpchatReadFlag = clone(fixture);
vcpchatReadFlag.guard.real_vcpchat_read_performed = true;
const memoryWriteFlag = clone(fixture);
memoryWriteFlag.guard.VCP_memory_write_performed = true;

const missingPackageCardEval = evaluate(missingPackageCard, sourceBlockerArbiter, sourceCoverageCloseout);
const executionAllowedCardEval = evaluate(executionAllowedCard, sourceBlockerArbiter, sourceCoverageCloseout);
const missingSourceContractEval = evaluate(missingSourceContract, sourceBlockerArbiter, sourceCoverageCloseout);
const runtimeFlagEval = evaluate(runtimeFlag, sourceBlockerArbiter, sourceCoverageCloseout);
const vcpchatReadFlagEval = evaluate(vcpchatReadFlag, sourceBlockerArbiter, sourceCoverageCloseout);
const memoryWriteFlagEval = evaluate(memoryWriteFlag, sourceBlockerArbiter, sourceCoverageCloseout);

addResult("negative_case_missing_package_card_fails", missingPackageCardEval.passed === false && missingPackageCardEval.packageOk === false);
addResult("negative_case_execution_allowed_card_fails", executionAllowedCardEval.passed === false && executionAllowedCardEval.cardsOk === false);
addResult("negative_case_missing_source_contract_fails", missingSourceContractEval.passed === false && missingSourceContractEval.sourceOk === false);
addResult("negative_case_runtime_flag_fails", runtimeFlagEval.passed === false && runtimeFlagEval.noExternal === false);
addResult("negative_case_vcpchat_read_flag_fails", vcpchatReadFlagEval.passed === false && vcpchatReadFlagEval.noExternal === false);
addResult("negative_case_memory_write_flag_fails", memoryWriteFlagEval.passed === false && memoryWriteFlagEval.noExecution === false);

for (const token of [
  "handoff_state_status: static_ready_no_runtime",
  "package_card_count: 5",
  "runtime_integration_allowed: false",
  "package_execution_performed: false",
  "real_vcpchat_read_performed: false",
  "real_vcptoolbox_read_performed: false",
  "VCP_memory_write_performed: false",
  "vcp_runtime_integration_proven: false",
]) {
  requireToken("phase_record", phaseRecord, token);
}

for (const token of [
  "scripts/validate_v14_203_authorization_compiler_review_console_handoff_state.js",
  "tests/schema_examples/v14_203_authorization_compiler_review_console_handoff_state.example.json",
  "docs/v14_203_authorization_compiler_review_console_handoff_state.md",
  "v14_203_authorization_compiler_review_console_handoff_state",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_203_authorization_compiler_review_console_handoff_state",
  version: "v1",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  handoff_state_status: fixture.handoff_state_status,
  package_card_count: fixture.package_card_count,
  runtime_integration_allowed: fixture.display_contract.runtime_integration_allowed,
  package_execution_allowed: fixture.display_contract.package_execution_allowed,
  review_console_handoff_state_only: fixture.guard.review_console_handoff_state_only,
  authorization_execution_performed: fixture.guard.authorization_execution_performed,
  package_execution_performed: fixture.guard.package_execution_performed,
  accepted_samples_write_performed: fixture.guard.accepted_samples_write_performed,
  manifest_read_performed: fixture.guard.manifest_read_performed,
  durable_archive_copy_performed: fixture.guard.durable_archive_copy_performed,
  production_candidate_write_performed: fixture.guard.production_candidate_write_performed,
  failure_samples_write_performed: fixture.guard.failure_samples_write_performed,
  daily_note_write_performed: fixture.guard.DailyNote_write_performed,
  vcp_memory_write_performed: fixture.guard.VCP_memory_write_performed,
  provider_contact_performed: fixture.guard.provider_contact_performed,
  plugin_call_performed: fixture.guard.plugin_call_performed,
  api_call_performed: fixture.guard.api_call_performed,
  mcp_runtime_performed: fixture.guard.mcp_runtime_performed,
  fetch_performed: fixture.guard.fetch_performed,
  file_write_performed: fixture.guard.file_write_performed,
  review_console_runtime_integration_performed: fixture.guard.review_console_runtime_integration_performed,
  ipc_preload_renderer_integration_performed: fixture.guard.ipc_preload_renderer_integration_performed,
  real_manifest_read_performed: fixture.guard.real_manifest_read_performed,
  real_vcpchat_read_performed: fixture.guard.real_vcpchat_read_performed,
  real_vcptoolbox_read_performed: fixture.guard.real_vcptoolbox_read_performed,
  push_tag_release_deploy_performed: fixture.guard.push_tag_release_deploy_performed,
  artifact_recoverability_is_not_vcp_runtime_integration: true,
  vcp_runtime_integration_proven: false,
  negative_case_missing_package_card_fails:
    missingPackageCardEval.passed === false && missingPackageCardEval.packageOk === false,
  negative_case_execution_allowed_card_fails:
    executionAllowedCardEval.passed === false && executionAllowedCardEval.cardsOk === false,
  negative_case_missing_source_contract_fails:
    missingSourceContractEval.passed === false && missingSourceContractEval.sourceOk === false,
  negative_case_runtime_flag_fails: runtimeFlagEval.passed === false && runtimeFlagEval.noExternal === false,
  negative_case_vcpchat_read_flag_fails: vcpchatReadFlagEval.passed === false && vcpchatReadFlagEval.noExternal === false,
  negative_case_memory_write_flag_fails: memoryWriteFlagEval.passed === false && memoryWriteFlagEval.noExecution === false,
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(passed ? 0 : 1);
