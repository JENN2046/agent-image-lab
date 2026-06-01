#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const validator = "runtime_to_review_v1_vcptoolbox_doubaogen_direct_child_failure_diagnostic";
const diagnosticPath = "reports/runtime_to_review_v1/vcptoolbox_doubaogen_direct_child_failure_diagnostic_20260601.json";
const receiptPath = "reports/runtime_to_review_v1/serum_bottle_exact_live_probe_receipt_20260601_attempt_003.json";
const directChildPath = "scripts/vcptoolbox_doubao_owner_runtime_child.js";
const serumOwnerRuntimePath = "adapters/runtime/native_doubao_runtime_v1_serum_bottle_owner_runtime.js";
const routeOwnerRuntimePath = "adapters/runtime/native_doubao_runtime_v1_vcptoolbox_route_owner_runtime.js";
const packageScriptName = "validate:runtime-to-review-vcptoolbox-direct-child-diagnostic";
const manifestId = "runtime_to_review_vcptoolbox_doubaogen_direct_child_failure_diagnostic";

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

function allFalse(object) {
  return object && Object.values(object).every((value) => value === false);
}

function main() {
  const diagnostic = readJson(diagnosticPath);
  const receipt = readJson(receiptPath);
  const directChildSource = fs.readFileSync(repoPath(directChildPath), "utf8");
  const serumOwnerSource = fs.readFileSync(repoPath(serumOwnerRuntimePath), "utf8");
  const routeOwnerSource = fs.readFileSync(repoPath(routeOwnerRuntimePath), "utf8");
  const packageJson = readJson("package.json");
  const manifest = readJson("scripts/validation_manifest.json");

  check("diagnostic_is_non_executing", () =>
    diagnostic.schema === "runtime_to_review_v1_vcptoolbox_doubaogen_direct_child_failure_diagnostic.v1" &&
    diagnostic.status === "completed_local_diagnostic_no_live_probe" &&
    diagnostic.source_blocker === "runtime_bridge_blocker:vcptoolbox_owner_runtime_child_failed_config_key_present" &&
    diagnostic.conclusion.new_trial_authorized_now === false &&
    diagnostic.conclusion.future_live_probe_requires_new_exact_activation === true &&
    allFalse(diagnostic.actions_not_performed)
  );
  check("attempt_003_boundary_matches_receipt", () =>
    receipt.status === "failed_closed" &&
    receipt.failure_category === "vcptoolbox_owner_runtime_child_failed_config_key_present_closed" &&
    receipt.provider_contact_performed === false &&
    receipt.plugin_call_performed === true &&
    receipt.api_call_performed === false &&
    receipt.image_generation_performed === false &&
    diagnostic.attempt_003_boundary.provider_config_key_present === true &&
    diagnostic.attempt_003_boundary.retry_allowed === false
  );
  check("direct_child_shape_recorded_from_source", () =>
    directChildSource.includes("pluginManager.processToolCall") &&
    directChildSource.includes("\"DoubaoGen\"") &&
    directChildSource.includes("command: \"generate\"") &&
    directChildSource.includes("resolution: \"1920x2048\"") &&
    directChildSource.includes("watermark: false") &&
    directChildSource.includes("requestSource: \"agent-image-lab-runtime-v1-owner-child\"") &&
    directChildSource.includes("doubaoProjectBasePathOverride: request.outputDirectory") &&
    diagnostic.direct_child_path.tool_call_payload.resolution === "1920x2048"
  );
  check("direct_child_loads_config_only_in_child_and_reports_presence", () =>
    directChildSource.includes("\"Plugin\", \"DoubaoGen\", \"config.env\"") &&
    directChildSource.includes("provider_config_key_present") &&
    directChildSource.includes("Boolean(process.env.VOLCENGINE_API_KEY)") &&
    serumOwnerSource.includes("vcptoolbox_owner_runtime_child_failed_config_key_present")
  );
  check("route_owner_runtime_shape_recorded_from_source", () =>
    routeOwnerSource.includes("admin_api/ai-image-agents/execute") &&
    routeOwnerSource.includes("type: \"generate_image\"") &&
    routeOwnerSource.includes("plugin: \"DoubaoGen\"") &&
    routeOwnerSource.includes("resolution: \"1440x2560\"") &&
    routeOwnerSource.includes("Authorization: authHeader") &&
    !routeOwnerSource.includes("config.env") &&
    diagnostic.route_owner_runtime_path.plan_resolution === "1440x2560" &&
    diagnostic.route_owner_runtime_path.does_not_read_config_env === true
  );
  check("decision_prefers_route_preflight_not_live_probe", () =>
    diagnostic.decision.direct_child_path_recommended_for_next_live_attempt === false &&
    diagnostic.decision.route_owner_runtime_is_preferred_next_design === true &&
    diagnostic.decision.next_non_executing_task === "prepare_serum_bottle_vcptoolbox_route_owner_runtime_preflight" &&
    diagnostic.decision.next_live_attempt_authorized_now === false &&
    diagnostic.route_owner_runtime_path.serum_scope_ready_now === false &&
    diagnostic.route_owner_runtime_path.serum_route_runtime_required_before_next_execution === true
  );
  check("required_next_preflight_is_complete", () => includesAll(diagnostic.required_next_preflight_before_any_new_real_attempt, [
    "create or adapt a serum-bottle VCPToolBox route owner runtime with exact serum prompt/output scope",
    "validate it does not read config.env or secret values in Agent Image Lab",
    "validate route request body uses DoubaoGen generate_image with the serum prompt, required model, one image, and provider-valid resolution",
    "require a new exact owner activation before any live attempt",
  ]));
  check("stop_conditions_preserve_red_lanes", () => includesAll(diagnostic.stop_conditions, [
    "running another live probe from this diagnostic",
    "running scripts/vcptoolbox_doubao_owner_runtime_child.js diagnosticOnly against real VCPToolBox",
    "reading config.env or any secret value",
    "modifying real VCPToolBox or VCPChat",
  ]));
  check("package_script_registered", () =>
    packageJson.scripts &&
    packageJson.scripts[packageScriptName] === "node scripts/validate_runtime_to_review_v1_vcptoolbox_doubaogen_direct_child_failure_diagnostic.js"
  );
  check("manifest_entry_registered", () => {
    const entry = manifest.validators.find((item) => item.id === manifestId);
    return entry &&
      entry.command === `npm run ${packageScriptName}` &&
      entry.script === "scripts/validate_runtime_to_review_v1_vcptoolbox_doubaogen_direct_child_failure_diagnostic.js" &&
      entry.tier === "targeted" &&
      entry.domain === "runtime_to_review" &&
      entry.status === "active" &&
      includesAll(entry.trigger_paths, [
        diagnosticPath,
        receiptPath,
        directChildPath,
        serumOwnerRuntimePath,
        routeOwnerRuntimePath,
        "package.json",
      ]) &&
      entry.required_for.includes("runtime_to_review_vcptoolbox_doubaogen_direct_child_failure_diagnostic_patch");
  });

  process.stdout.write(`${JSON.stringify({
    passed,
    validator,
    diagnostic: diagnosticPath,
    source_blocker: diagnostic.source_blocker,
    preferred_next_path: diagnostic.conclusion.preferred_next_path,
    live_probe_performed: false,
    child_diagnostic_only_process_executed: false,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    secret_value_read_performed: false,
    env_file_content_read_performed: false,
    check_count: results.length,
    failed_count: results.filter((result) => !result.passed).length,
    results,
  }, null, 2)}\n`);
  if (!passed) process.exitCode = 1;
}

main();
