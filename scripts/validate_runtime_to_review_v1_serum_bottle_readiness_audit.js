#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const validator = "runtime_to_review_v1_serum_bottle_readiness_audit";
const auditPath = "reports/runtime_to_review_v1/serum_bottle_readiness_audit_20260601.json";
const inactivePacketPath = "reports/runtime_to_review_v1/guarded_live_probe_serum_bottle_inactive_preflight_packet_20260601.json";
const bindingDesignPath = "reports/runtime_to_review_v1/serum_bottle_owner_runtime_binding_design_preflight_20260601.json";
const perPacketPreflightPath = "reports/runtime_to_review_v1/per_packet_owner_runtime_activation_preflight_20260601.json";
const activationDraftPath = "reports/runtime_to_review_v1/serum_bottle_exact_live_activation_packet_draft_20260601.json";
const outputGatePath = "reports/runtime_to_review_v1/serum_bottle_output_directory_preflight_gate_20260601.json";
const decisionPath = "reports/runtime_to_review_v1/serum_bottle_live_activation_decision_packet_draft_20260601.json";
const checklistPath = "reports/runtime_to_review_v1/serum_bottle_owner_activation_confirmation_checklist_20260601.json";
const futureTemplatePath = "reports/runtime_to_review_v1/serum_bottle_future_active_probe_packet_template_20260601.json";
const outputDir = "runs/real_generation/runtime_to_review_v1_guarded_live_probe_serum_bottle/";
const ownerPhrase = "RUNTIME_TO_REVIEW_V1_SERUM_BOTTLE_ONE_PROVIDER_ONE_IMAGE";
const runnerPhrase = "RUNTIME_TO_REVIEW_V1_ONE_PROVIDER_ONE_IMAGE";
const packageScriptName = "validate:runtime-to-review-serum-bottle-readiness-audit";
const manifestId = "runtime_to_review_serum_bottle_readiness_audit";

let passed = true;
const results = [];

function repoPath(relativePath) {
  const resolved = path.resolve(root, relativePath);
  const relative = path.relative(root, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`path escapes repository: ${relativePath}`);
  }
  return resolved;
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(repoPath(relativePath), "utf8"));
}

function check(id, fn) {
  try {
    const ok = fn();
    results.push({ check: id, passed: Boolean(ok) });
    if (!ok) passed = false;
  } catch (error) {
    results.push({ check: id, passed: false, error: error.message });
    passed = false;
  }
}

function includesAll(values, expectedValues) {
  return Array.isArray(values) && expectedValues.every((value) => values.includes(value));
}

function main() {
  const audit = readJson(auditPath);
  const inactivePacket = readJson(inactivePacketPath);
  const bindingDesign = readJson(bindingDesignPath);
  const perPacketPreflight = readJson(perPacketPreflightPath);
  const activationDraft = readJson(activationDraftPath);
  const outputGate = readJson(outputGatePath);
  const decision = readJson(decisionPath);
  const checklist = readJson(checklistPath);
  const futureTemplate = readJson(futureTemplatePath);
  const packageJson = readJson("package.json");
  const manifest = readJson("scripts/validation_manifest.json");

  check("audit_exists", () => fs.existsSync(repoPath(auditPath)));
  check("schema_and_inactive_status", () =>
    audit.schema === "runtime_to_review_v1_serum_bottle_readiness_audit.v1" &&
    audit.status === "draft_inactive_not_executed" &&
    audit.can_execute_now === false &&
    audit.audit_authorizes_execution === false &&
    audit.decision_authorized_by_this_audit === false &&
    audit.execution_authorized_by_this_audit === false &&
    audit.live_probe_authorized_by_this_audit === false
  );
  check("scope_locks_exact_future_boundary", () =>
    audit.audit_scope.target_product === "premium_serum_bottle" &&
    audit.audit_scope.target_output_directory_ref === outputDir &&
    audit.audit_scope.required_future_owner_confirmation_phrase === ownerPhrase &&
    audit.audit_scope.runner_confirmation_phrase_still_required === runnerPhrase &&
    audit.audit_scope.single_provider_required === true &&
    audit.audit_scope.single_image_required === true &&
    audit.audit_scope.overwrite_existing_files_allowed === false
  );
  check("source_refs_include_full_chain", () => includesAll(audit.source_refs, [
    inactivePacketPath,
    bindingDesignPath,
    perPacketPreflightPath,
    activationDraftPath,
    outputGatePath,
    decisionPath,
    checklistPath,
    futureTemplatePath,
    "package.json",
    "scripts/validation_manifest.json",
  ]));
  check("upstream_chain_still_inactive", () =>
    inactivePacket.can_execute_now === false &&
    perPacketPreflight.can_execute_now === false &&
    activationDraft.can_execute_now === false &&
    outputGate.can_execute_now === false &&
    decision.can_execute_now === false &&
    checklist.can_execute_now === false &&
    futureTemplate.can_execute_now === false &&
    futureTemplate.template_authorizes_execution === false &&
    checklist.checklist_authorizes_execution === false
  );
  check("upstream_output_and_phrases_aligned", () =>
    inactivePacket.output_directory_ref === outputDir &&
    bindingDesign.target_allowed_output_directory === outputDir &&
    perPacketPreflight.target_output_directory_ref === outputDir &&
    activationDraft.target_output_directory_ref === outputDir &&
    outputGate.target_output_directory_ref === outputDir &&
    decision.target_output_directory_ref === outputDir &&
    checklist.target_output_directory_ref === outputDir &&
    futureTemplate.target_output_directory_ref === outputDir &&
    activationDraft.required_future_owner_confirmation_phrase === ownerPhrase &&
    decision.required_future_owner_confirmation_phrase === ownerPhrase &&
    checklist.required_future_owner_confirmation_phrase === ownerPhrase &&
    futureTemplate.required_future_owner_confirmation_phrase === ownerPhrase &&
    checklist.runner_confirmation_phrase_still_required === runnerPhrase &&
    futureTemplate.runner_confirmation_phrase_still_required === runnerPhrase
  );
  check("audit_records_no_side_effects", () =>
    audit.actions_not_performed.file_modification_during_audit === false &&
    audit.actions_not_performed.provider_contact_performed === false &&
    audit.actions_not_performed.plugin_call_performed === false &&
    audit.actions_not_performed.api_call_performed === false &&
    audit.actions_not_performed.image_generation_performed === false &&
    audit.actions_not_performed.output_directory_created === false &&
    audit.actions_not_performed.image_file_written === false &&
    audit.actions_not_performed.secret_value_read_performed === false &&
    audit.actions_not_performed.DailyNote_write_performed === false &&
    audit.actions_not_performed.VCP_memory_write_performed === false &&
    audit.actions_not_performed.push_performed === false
  );
  check("pass_warning_block_counts_match_conclusion", () =>
    audit.pass_findings.length === 8 &&
    audit.warnings.length === audit.audit_conclusion.warning_count &&
    audit.block_findings.length === audit.audit_conclusion.block_count &&
    audit.audit_conclusion.result === "pass_with_warnings" &&
    audit.audit_conclusion.block_count === 0 &&
    audit.audit_conclusion.warning_count === 3 &&
    audit.audit_conclusion.future_one_image_probe_boundary_consistent === true &&
    audit.audit_conclusion.current_chain_inactive === true &&
    audit.audit_conclusion.future_execution_requires_separate_active_packet === true
  );
  check("warnings_are_non_blocking_and_expected", () => {
    const warningIds = audit.warnings.map((warning) => warning.id);
    return includesAll(warningIds, [
      "future_fenced_true_values_present",
      "binding_design_contains_old_and_new_output_dirs",
      "validators_not_rerun_during_read_only_audit",
    ]) && audit.warnings.every((warning) => warning.severity === "warning" && warning.current_blocking_effect === "none");
  });
  check("future_execution_requirements_preserved", () => includesAll(audit.future_execution_still_requires, [
    "A separate owner-issued active packet, not this audit report.",
    `Exact owner phrase ${ownerPhrase}.`,
    `Exact runner phrase ${runnerPhrase}.`,
    "Immediate rerun of all pre-run validators before any live provider attempt.",
    "Target output directory missing or empty at activation time.",
    "overwrite_existing_files_allowed=false.",
    "One provider path, one image, one live probe attempt, and no retry.",
  ]));
  check("package_script_registered", () =>
    packageJson.scripts &&
    packageJson.scripts[packageScriptName] === "node scripts/validate_runtime_to_review_v1_serum_bottle_readiness_audit.js"
  );
  check("manifest_entry_registered", () => {
    const entry = manifest.validators.find((item) => item.id === manifestId);
    return entry &&
      entry.command === `npm run ${packageScriptName}` &&
      entry.script === "scripts/validate_runtime_to_review_v1_serum_bottle_readiness_audit.js" &&
      entry.tier === "targeted" &&
      entry.domain === "runtime_to_review" &&
      entry.status === "active" &&
      entry.estimated_runtime_class === "fast" &&
      includesAll(entry.trigger_paths, [
        auditPath,
        "scripts/validate_runtime_to_review_v1_serum_bottle_readiness_audit.js",
        inactivePacketPath,
        bindingDesignPath,
        perPacketPreflightPath,
        activationDraftPath,
        outputGatePath,
        decisionPath,
        checklistPath,
        futureTemplatePath,
        "package.json",
      ]) &&
      entry.required_for.includes("runtime_to_review_serum_bottle_readiness_audit_patch");
  });

  process.stdout.write(`${JSON.stringify({
    passed,
    validator,
    audit: auditPath,
    can_execute_now: audit.can_execute_now,
    audit_authorizes_execution: audit.audit_authorizes_execution,
    audit_conclusion: audit.audit_conclusion.result,
    block_count: audit.audit_conclusion.block_count,
    warning_count: audit.audit_conclusion.warning_count,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    output_write_performed: false,
    directory_creation_performed: false,
    secret_value_read_performed: false,
    env_file_content_read_performed: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false,
    accepted_samples_write_performed: false,
    production_candidate_write_performed: false,
    check_count: results.length,
    failed_count: results.filter((result) => !result.passed).length,
    results,
  }, null, 2)}\n`);
  if (!passed) process.exitCode = 1;
}

main();
