#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const validator = "runtime_to_review_v1_secretless_serum_route_redesign_preflight";
const designPath = "reports/runtime_to_review_v1/secretless_serum_route_redesign_preflight_20260602.json";
const packageScriptName = "validate:runtime-to-review-secretless-serum-route-redesign-preflight";
const manifestId = "runtime_to_review_secretless_serum_route_redesign_preflight";
const validatorPath = "scripts/validate_runtime_to_review_v1_secretless_serum_route_redesign_preflight.js";

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

function optionById(design, id) {
  return design.candidate_routes.find((route) => route.option_id === id);
}

function main() {
  const design = readJson(designPath);
  const packageJson = readJson("package.json");
  const manifest = readJson("scripts/validation_manifest.json");
  const validatorSource = fs.readFileSync(repoPath(validatorPath), "utf8");
  const processEnvToken = "process" + ".env";
  const buildHeaderToken = "build" + "BasicAuthHeader";
  const authorizationHeaderToken = "Authorization" + ":";

  check("design_package_schema_and_status", () =>
    design.schema === "runtime_to_review_v1_secretless_serum_route_redesign_preflight.v1" &&
    design.preflight_id === "secretless_serum_route_redesign_preflight_20260602" &&
    design.lane === "Green_local_design_preflight" &&
    ["design_preflight_draft_pending_validation", "completed_validated_local_design_preflight"].includes(design.status)
  );
  check("current_secret_dependency_is_named", () =>
    design.current_secret_bearing_dependency.current_blocker === "runtime_bridge_blocker:vcptoolbox_admin_basic_auth_env_missing" &&
    design.current_secret_bearing_dependency.route_owner_runtime_ref === "adapters/runtime/native_doubao_runtime_v1_serum_bottle_vcptoolbox_route_owner_runtime.js" &&
    design.current_secret_bearing_dependency.why_admin_auth_is_required_now.includes("Basic Authorization header") &&
    design.current_secret_bearing_dependency.why_agent_image_lab_header_construction_is_not_preferred.length >= 3
  );
  check("candidate_routes_complete", () => {
    const ids = design.candidate_routes.map((route) => route.option_id);
    return includesAll(ids, ["A", "B", "C", "D"]) &&
      design.candidate_routes.length === 4 &&
      design.candidate_routes.every((route) =>
        typeof route.agent_image_lab_touches_secret === "boolean" &&
        typeof route.requires_external_repo_modification === "boolean" &&
        typeof route.can_preserve_one_provider_one_plugin_one_api_one_image_no_retry === "boolean" &&
        typeof route.receipt_strategy === "string" &&
        typeof route.rollback_cleanup === "string" &&
        Array.isArray(route.stop_conditions) &&
        Array.isArray(route.validator_can_prove) &&
        Array.isArray(route.validator_cannot_prove)
      );
  });
  check("preferred_route_is_secretless_option_a", () => {
    const optionA = optionById(design, "A");
    const optionD = optionById(design, "D");
    return design.preferred_route.option_id === "A" &&
      design.preferred_route.requires_future_external_authorization === true &&
      optionA &&
      optionA.agent_image_lab_touches_secret === false &&
      optionA.requires_external_repo_modification === true &&
      optionA.external_repo_modification_authorization === "future_exact_vcptoolbox_authorization_required" &&
      optionA.can_preserve_one_provider_one_plugin_one_api_one_image_no_retry === true &&
      optionA.route_status === "preferred" &&
      optionD &&
      optionD.agent_image_lab_touches_secret === true &&
      optionD.route_status === "fallback_not_recommended";
  });
  check("all_execution_flags_false", () =>
    allFalse(design.non_execution_boundary) &&
    design.non_execution_boundary.can_execute_now === false &&
    design.non_execution_boundary.live_probe_performed === false &&
    design.non_execution_boundary.provider_contact_performed === false &&
    design.non_execution_boundary.plugin_call_performed === false &&
    design.non_execution_boundary.api_call_performed === false &&
    design.non_execution_boundary.image_generation_performed === false
  );
  check("validator_does_not_read_admin_env_or_construct_header", () =>
    !validatorSource.includes(processEnvToken) &&
    !validatorSource.includes(buildHeaderToken) &&
    !validatorSource.includes(authorizationHeaderToken) &&
    design.non_execution_boundary.current_admin_auth_env_values_read === false &&
    design.non_execution_boundary.env_file_content_read_performed === false &&
    design.non_execution_boundary.config_env_read_performed === false &&
    design.non_execution_boundary.authorization_header_constructed === false
  );
  check("existing_serum_receipts_and_artifacts_still_exist", () =>
    design.evidence_preservation.existing_serum_bottle_evidence_must_not_move_or_rename === true &&
    design.evidence_preservation.immutable_refs_checked_by_validator.every((relativePath) =>
      fs.existsSync(repoPath(relativePath))
    )
  );
  check("future_external_modification_requires_exact_authorization", () =>
    design.future_authorization_boundary.external_vcptoolbox_modification_allowed_now === false &&
    design.future_authorization_boundary.external_vcptoolbox_modification_requires_exact_authorization === true &&
    design.future_authorization_boundary.future_live_probe_requires_new_exact_activation === true &&
    design.future_authorization_boundary.future_live_probe_requires_secretless_route_exists === true &&
    design.future_authorization_boundary.max_provider_calls === 1 &&
    design.future_authorization_boundary.max_plugin_calls === 1 &&
    design.future_authorization_boundary.max_api_calls === 1 &&
    design.future_authorization_boundary.max_images === 1 &&
    design.future_authorization_boundary.retry_allowed === false
  );
  check("validator_contract_declares_limits", () =>
    design.validator_contract.validator_ref === validatorPath &&
    design.validator_contract.package_script === packageScriptName &&
    design.validator_contract.manifest_id === manifestId &&
    includesAll(design.validator_contract.can_prove, [
      "design package exists and has the expected schema",
      "preferred route does not require Agent Image Lab secret contact",
      "all current execution/live/provider/plugin/API/image flags are false",
      "current admin auth env values were not read by this design stage",
      "known serum-bottle receipt and artifact refs still exist",
      "future external VCPToolBox modification requires exact authorization",
      "package.json and validation_manifest register the validator"
    ]) &&
    includesAll(design.validator_contract.cannot_prove, [
      "VCPToolBox has implemented the preferred interface",
      "future external repository changes are approved",
      "future provider/plugin/API/image execution will succeed",
      "future runtime behavior without a live probe"
    ])
  );
  check("conclusion_is_non_executing_secretless_route_selection", () =>
    design.conclusion.can_execute_now === false &&
    design.conclusion.current_permission === "cannot_run_live_probe_now" &&
    design.conclusion.current_route_selection === "secretless_redesign_preferred" &&
    design.conclusion.preferred_route === "Option A - VCPToolBox internal authorized execution interface"
  );
  check("package_script_registered", () =>
    packageJson.scripts &&
    packageJson.scripts[packageScriptName] === `node ${validatorPath}`
  );
  check("manifest_entry_registered", () => {
    const entry = manifest.validators.find((item) => item.id === manifestId);
    return entry &&
      entry.command === `npm run ${packageScriptName}` &&
      entry.script === validatorPath &&
      entry.tier === "targeted" &&
      entry.domain === "runtime_to_review" &&
      entry.status === "active" &&
      entry.estimated_runtime_class === "fast" &&
      includesAll(entry.trigger_paths, [
        designPath,
        validatorPath,
        "reports/runtime_to_review_v1/serum_bottle_vcptoolbox_route_owner_runtime_preflight_20260601.json",
        "reports/runtime_to_review_v1/serum_bottle_vcptoolbox_admin_auth_env_readiness_preflight_20260601.json",
        ".agent_board/HANDOFF.md",
        ".agent_board/RUN_STATE.md",
        ".agent_board/TASK_QUEUE.md",
        ".agent_board/CHECKPOINT.md",
        "package.json",
        "scripts/validation_manifest.json"
      ]) &&
      entry.required_for.includes("runtime_to_review_secretless_serum_route_redesign_preflight_patch");
  });

  process.stdout.write(`${JSON.stringify({
    passed,
    validator,
    design: designPath,
    preferred_route: design.preferred_route.option_id,
    can_execute_now: false,
    current_permission: design.conclusion.current_permission,
    current_route_selection: design.conclusion.current_route_selection,
    external_vcptoolbox_modification_allowed_now: false,
    external_vcptoolbox_modification_requires_exact_authorization: true,
    current_admin_auth_env_values_read: false,
    authorization_header_constructed: false,
    live_probe_performed: false,
    route_http_request_performed: false,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    output_write_performed: false,
    env_file_content_read_performed: false,
    config_env_read_performed: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false,
    check_count: results.length,
    failed_count: results.filter((result) => !result.passed).length,
    results,
  }, null, 2)}\n`);
  if (!passed) process.exitCode = 1;
}

main();
