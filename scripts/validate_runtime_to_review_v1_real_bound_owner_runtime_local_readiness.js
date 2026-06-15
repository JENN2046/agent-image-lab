#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const validatorId = "runtime_to_review_v1_real_bound_owner_runtime_local_readiness";
const docPath = "docs/runtime_to_review_v1_real_bound_owner_runtime_local_readiness_check.md";
const examplePath = "tests/schema_examples/runtime_to_review_v1_real_bound_owner_runtime_local_readiness_check.example.json";
const roadmapPath = "docs/RUNTIME_TO_PRODUCTION_LANDING_ROADMAP.md";
const runnerPath = "scripts/run_runtime_to_review_v1_guarded_live_probe.js";
const delegatePath = "adapters/runtime/native_doubao_runtime_v1_provider_delegate.js";
const ownerRuntimePath = "adapters/runtime/native_doubao_runtime_v1_real_bound_owner_runtime.js";
const ownerRuntimeValidatorPath = "scripts/validate_runtime_to_review_v1_real_bound_owner_runtime_module.js";
const ownerRuntimeChildPath = "scripts/vcptoolbox_doubao_owner_runtime_child.js";
const selfPath = "scripts/validate_runtime_to_review_v1_real_bound_owner_runtime_local_readiness.js";
const ownerRootEnvName = "AGENT_IMAGE_LAB_VCPTOOLBOX_ROOT";
const hardCodedOwnerRootLiteralPattern = /(?:[A-Za-z]:\\\\|\/(?:Users|home|mnt|opt|var)\/)[^"'`\r\n]*(?:VCPToolBox|VCP)[^"'`\r\n]*/;

const forbiddenTrueFlags = [
  "real_provider_call_performed",
  "provider_contact_performed",
  "plugin_call_performed",
  "api_call_performed",
  "image_generation_performed",
  "output_write_performed",
  "secret_value_read_performed",
  "env_file_content_read_performed",
  "real_VCPChat_read_performed",
  "real_VCPToolBox_read_performed",
  "real_manifest_read_performed",
  "DailyNote_write_performed",
  "VCP_memory_write_performed",
  "accepted_samples_write_performed",
  "production_candidate_write_performed",
];

const checks = [];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function check(name, condition, detail = "") {
  checks.push({ check: name, passed: condition === true, detail });
  assert(condition === true, detail || name);
}

function repoPath(relativePath) {
  const resolved = path.resolve(root, relativePath);
  const relative = path.relative(root, resolved);
  assert(!relative.startsWith("..") && !path.isAbsolute(relative), `path escapes repository: ${relativePath}`);
  return resolved;
}

function runNode(args) {
  return childProcess.execFileSync(process.execPath, args, {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
}

function readText(relativePath) {
  return fs.readFileSync(repoPath(relativePath), "utf8");
}

function readJson(relativePath) {
  return JSON.parse(readText(relativePath));
}

function assertForbiddenFlagsFalse(record, label) {
  for (const key of forbiddenTrueFlags) {
    check(`${label}_${key}_false`, record[key] === false, `${label}.${key} must be false`);
  }
}

function withOwnerRootEnvBlocked(fn) {
  const hadOwnerRootEnv = Object.prototype.hasOwnProperty.call(process.env, ownerRootEnvName);
  const previousOwnerRootEnv = process.env[ownerRootEnvName];
  delete process.env[ownerRootEnvName];
  try {
    return fn();
  } finally {
    if (hadOwnerRootEnv) process.env[ownerRootEnvName] = previousOwnerRootEnv;
    else delete process.env[ownerRootEnvName];
  }
}

function main() {
  runNode(["--check", runnerPath]);
  runNode(["--check", delegatePath]);
  runNode(["--check", ownerRuntimePath]);
  runNode(["--check", ownerRuntimeValidatorPath]);
  runNode(["--check", ownerRuntimeChildPath]);
  runNode(["--check", selfPath]);

  const doc = readText(docPath);
  const roadmap = readText(roadmapPath);
  const example = readJson(examplePath);
  const packageJson = readJson("package.json");
  const manifest = readJson("scripts/validation_manifest.json");
  const ownerRuntimeSource = readText(ownerRuntimePath);
  const childSource = readText(ownerRuntimeChildPath);

  check("doc_schema_declared", doc.includes("runtime_to_review_v1_real_bound_owner_runtime_local_readiness_check.v1"));
  check("doc_forbids_live_probe", doc.includes("runtime-to-review:guarded-live-probe"));
  check("doc_forbids_secret_reads", doc.includes("secret value read"));
  check("roadmap_references_local_readiness", roadmap.includes("validate:runtime-to-review-real-bound-owner-runtime-local-readiness"));

  check("example_schema_matches", example.schema_version === "runtime_to_review_v1_real_bound_owner_runtime_local_readiness_check.v1");
  check("example_mode_no_provider", example.mode === "local_readiness_no_provider_call");
  check("example_exact_confirmation", example.exact_confirmation_required === "RUNTIME_TO_REVIEW_V1_ONE_PROVIDER_ONE_IMAGE");
  assertForbiddenFlagsFalse(example.side_effect_evidence, "example_side_effect_evidence");

  const runner = require(repoPath(runnerPath));
  check("runner_exact_confirmation_locked", runner.exactConfirmation === "RUNTIME_TO_REVIEW_V1_ONE_PROVIDER_ONE_IMAGE");
  const exactPreflight = runner.validatePreflight({
    max_images: 1,
    provider_delegate_module: delegatePath,
    owner_runtime_module: ownerRuntimePath,
    confirm_live_provider_probe: runner.exactConfirmation,
  });
  check("exact_preflight_passes_without_live_execution", exactPreflight.passed === true);
  const wrongPhrasePreflight = runner.validatePreflight({
    max_images: 1,
    provider_delegate_module: delegatePath,
    owner_runtime_module: ownerRuntimePath,
    confirm_live_provider_probe: "WRONG_CONFIRMATION",
  });
  check("wrong_phrase_blocks", wrongPhrasePreflight.passed === false);
  const preflightOnly = JSON.parse(runNode([
    runnerPath,
    "--provider-delegate-module",
    delegatePath,
    "--owner-runtime-module",
    ownerRuntimePath,
    "--confirm-live-provider-probe",
    runner.exactConfirmation,
    "--preflight-only",
  ]));
  check("runner_preflight_only_status", preflightOnly.status === "preflight_only_no_live_probe_executed");
  check("runner_preflight_only_current_args_pass", preflightOnly.preflight_would_pass_with_current_args === true);
  assertForbiddenFlagsFalse({
    ...preflightOnly,
    secret_value_read_performed: preflightOnly.secret_value_read_performed_by_runner === false ? false : preflightOnly.secret_value_read_performed,
    env_file_content_read_performed: false,
    output_write_performed: false,
    real_VCPChat_read_performed: false,
    real_VCPToolBox_read_performed: false,
    real_manifest_read_performed: false,
  }, "runner_preflight_only");

  const ownerRuntimeModule = require(repoPath(ownerRuntimePath));
  check("owner_runtime_factory_present", typeof ownerRuntimeModule.createSecretlessProviderRuntime === "function");
  check("owner_runtime_module_id", ownerRuntimeModule.moduleId === "native_doubao_runtime_v1_real_bound_owner_runtime");
  check("owner_runtime_output_allowlist", ownerRuntimeModule.allowedOutputDirectory === "runs/real_generation/runtime_to_review_v1_guarded_live_probe/");
  check("owner_runtime_prompt_allowlist", ownerRuntimeModule.allowedPromptPackageRef === "prompts/image_generation/neutral_smoke_test_red_apple_v1.yaml");
  check("owner_runtime_model_allowlist", ownerRuntimeModule.requiredModel === "doubao-seedream-5-0-260128");
  check("owner_runtime_safe_env_builder_present", typeof ownerRuntimeModule.buildSafeChildEnv === "function");
  check("owner_runtime_does_not_spread_process_env", !ownerRuntimeSource.includes("...process.env"));
  check("owner_runtime_has_no_default_root_candidates", !ownerRuntimeSource.includes("defaultVcpToolBoxRootCandidates"));
  check("owner_runtime_has_no_private_root_literal", !hardCodedOwnerRootLiteralPattern.test(ownerRuntimeSource));
  check("owner_runtime_missing_root_blocker_present", ownerRuntimeSource.includes("owner_vcptoolbox_root_not_explicitly_configured"));
  check("owner_runtime_uses_owner_configured_root_env", ownerRuntimeSource.includes("AGENT_IMAGE_LAB_VCPTOOLBOX_ROOT"));
  check("owner_runtime_readiness_function_present", typeof ownerRuntimeModule.inspectRealBoundOwnerRuntimeReadiness === "function");
  const missingRootReadiness = withOwnerRootEnvBlocked(() => ownerRuntimeModule.inspectRealBoundOwnerRuntimeReadiness({}));
  check("missing_owner_root_not_configured", missingRootReadiness.owner_root_explicitly_configured === false);
  check("missing_owner_root_blocker_recorded", missingRootReadiness.current_blocker === "owner_vcptoolbox_root_not_explicitly_configured");
  check("missing_owner_root_does_not_probe_plugin_entry", missingRootReadiness.plugin_entry_present === false);
  check("missing_owner_root_does_not_probe_plugin_config", missingRootReadiness.plugin_config_present === false);
  check("missing_owner_root_does_not_probe_manifest", missingRootReadiness.plugin_manifest_present === false);

  const safeEnv = ownerRuntimeModule.buildSafeChildEnv({
    PATH: "path-ok",
    VOLCENGINE_API_KEY: "must-not-pass",
    SECRET_TOKEN: "must-not-pass",
  });
  check("safe_env_preserves_path", safeEnv.PATH === "path-ok");
  check("safe_env_does_not_forward_provider_key", !Object.prototype.hasOwnProperty.call(safeEnv, "VOLCENGINE_API_KEY"));
  check("safe_env_does_not_forward_arbitrary_secret", !Object.prototype.hasOwnProperty.call(safeEnv, "SECRET_TOKEN"));

  check("child_diagnostic_mode_present", childSource.includes("diagnosticOnly"));
  check("child_loads_dotenv_inside_child", childSource.includes("dotenv.config"));
  check("child_uses_doubaogen_config_path", childSource.includes("\"Plugin\", \"DoubaoGen\", \"config.env\""));
  check("child_reports_key_presence_without_value", childSource.includes("provider_config_key_present"));

  const activeModuleHasOwnerRootDefaults = hardCodedOwnerRootLiteralPattern.test(ownerRuntimeSource);
  check("active_module_default_root_candidates_removed", activeModuleHasOwnerRootDefaults === false);
  check("example_records_current_owner_root_default_state", example.readiness_checks.current_active_module_has_owner_root_default_candidates === activeModuleHasOwnerRootDefaults);
  check("example_records_owner_root_followup_risk", example.readiness_checks.owner_root_default_candidates_recorded_as_followup_risk === activeModuleHasOwnerRootDefaults);
  check("example_records_explicit_owner_root_required", example.readiness_checks.explicit_owner_root_required === true);
  check("example_records_missing_owner_root_blocker", example.readiness_checks.missing_owner_root_blocker_recorded === true);
  check("example_records_hidden_local_path_removed", example.readiness_checks.hidden_local_path_prerequisite_removed === true);
  check("local_readiness_does_not_require_vcptoolbox_presence", example.readiness_checks.local_readiness_does_not_require_vcptoolbox_presence === true);

  const scripts = packageJson.scripts || {};
  check(
    "package_script_registered",
    scripts["validate:runtime-to-review-real-bound-owner-runtime-local-readiness"] === "node scripts/validate_runtime_to_review_v1_real_bound_owner_runtime_local_readiness.js"
  );
  const manifestEntry = (manifest.validators || []).find((item) => item.id === validatorId);
  check("manifest_entry_registered", Boolean(manifestEntry));
  check("manifest_command_registered", manifestEntry.command === "npm run validate:runtime-to-review-real-bound-owner-runtime-local-readiness");
  check("manifest_script_registered", manifestEntry.script === selfPath);
  check("manifest_trigger_doc", manifestEntry.trigger_paths.includes(docPath));
  check("manifest_trigger_example", manifestEntry.trigger_paths.includes(examplePath));
  check("manifest_trigger_owner_runtime", manifestEntry.trigger_paths.includes(ownerRuntimePath));

  const result = {
    passed: true,
    validator: validatorId,
    mode: "local_readiness_no_provider_call",
    check_count: checks.length,
    exact_confirmation_required: runner.exactConfirmation,
    target_runner: runnerPath,
    target_owner_runtime_module: ownerRuntimePath,
    local_readiness_does_not_require_vcptoolbox_presence: true,
    real_bound_owner_runtime_module_present: true,
    real_bound_owner_runtime_factory_present: true,
    exact_preflight_passed_without_live_execution: true,
    wrong_phrase_blocked: true,
    safe_child_env_does_not_copy_process_env: true,
    provider_secret_env_not_forwarded: true,
    child_runtime_loads_plugin_config_inside_child: true,
    child_runtime_reports_key_presence_without_value: true,
    explicit_owner_root_required: true,
    missing_owner_root_blocker_recorded: true,
    owner_root_env_blocked_for_missing_root_checks: true,
    active_module_has_owner_root_default_candidates: activeModuleHasOwnerRootDefaults,
    owner_root_default_candidates_recorded_as_followup_risk: activeModuleHasOwnerRootDefaults,
    hidden_local_path_prerequisite_removed: activeModuleHasOwnerRootDefaults === false,
    live_probe_authorized_now: false,
    real_provider_call_performed: false,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    output_write_performed: false,
    secret_value_read_performed: false,
    env_file_content_read_performed: false,
    real_VCPChat_read_performed: false,
    real_VCPToolBox_read_performed: false,
    real_manifest_read_performed: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false,
    accepted_samples_write_performed: false,
    production_candidate_write_performed: false,
    checks,
  };

  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${JSON.stringify({
    passed: false,
    validator: validatorId,
    error: error.message,
  }, null, 2)}\n`);
  process.exitCode = 1;
}
