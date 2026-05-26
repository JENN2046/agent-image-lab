#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const files = {
  doc: "docs/V0_6_86_RUNTIME_KERNEL_BACKEND_GAP_MAP.md",
  schema: "schemas/runtime_kernel_backend_gap_map.schema.yaml",
  fixture: "tests/schema_examples/runtime_kernel_backend_gap_map.example.json",
  failFixture: "tests/schema_examples/runtime_kernel_backend_gap_map_fail.example.json",
  mvp: "scripts/validate_mvp.ps1",
  packageJson: "package.json",
};

const requiredRuntimeComponents = [
  "task_intake",
  "policy_gate",
  "executor_interface",
  "artifact_persistence",
  "review_gate",
  "state_transition",
  "audit_record",
];

const requiredBackendComponents = [
  "read_only_case_api",
  "artifact_metadata_api",
  "review_decision_persistence_api",
  "auth_session_boundary",
  "audit_log_store",
];

const forbiddenTrueGuardFields = [
  "real_runtime_kernel_implemented_now",
  "real_backend_implemented_now",
  "provider_contact_performed",
  "plugin_call_performed",
  "api_call_performed",
  "image_generation_performed",
  "output_write_performed",
  "secret_value_read_performed",
  "env_file_content_read_performed",
  "accepted_samples_write_performed",
  "failure_samples_write_performed",
  "production_candidate_write_performed",
  "DailyNote_write_performed",
  "VCP_memory_write_performed",
  "dependency_change_performed",
  "push_tag_release_deploy_performed",
];

const requiredCapabilitySchemaFields = [
  "capability_id",
  "status",
  "evidence_ref",
  "runtime_maturity_claim_allowed",
];

function read(rel) {
  return fs.readFileSync(path.join(root, rel), "utf8");
}

function readJson(rel) {
  return JSON.parse(read(rel));
}

function exists(rel) {
  return fs.existsSync(path.join(root, rel));
}

function includesAll(values, required) {
  return required.every((item) => values.includes(item));
}

function evaluate(record) {
  const gap = record.runtime_kernel_backend_gap_map || {};
  const guard = gap.guard || {};
  const boundary = gap.implementation_boundary || {};
  const capabilities = Array.isArray(gap.current_capabilities) ? gap.current_capabilities : [];

  const identityOk =
    gap.version === "v1" &&
    gap.phase === "v0_6_86_runtime_kernel_backend_gap_map" &&
    gap.status === "completed_gap_map_only" &&
    gap.execution_mode === "local_preflight_gap_map_only";

  const capabilitiesOk =
    capabilities.length >= 4 &&
    capabilities.every((capability) =>
      typeof capability.capability_id === "string" &&
      typeof capability.evidence_ref === "string" &&
      capability.runtime_maturity_claim_allowed === false
    );

  const runtimeGapsOk =
    Array.isArray(gap.missing_runtime_kernel_components) &&
    gap.missing_runtime_kernel_components.length === requiredRuntimeComponents.length &&
    includesAll(gap.missing_runtime_kernel_components, requiredRuntimeComponents);

  const backendGapsOk =
    Array.isArray(gap.missing_backend_components) &&
    gap.missing_backend_components.length === requiredBackendComponents.length &&
    includesAll(gap.missing_backend_components, requiredBackendComponents);

  const boundaryOk =
    boundary.runtime_kernel_code_created === false &&
    boundary.backend_endpoint_created === false &&
    boundary.ipc_preload_renderer_integration_created === false &&
    boundary.database_or_persistent_service_created === false &&
    boundary.provider_execution_performed === false &&
    boundary.runtime_contract_spec_required_before_code === true &&
    boundary.backend_contract_spec_required_before_code === true;

  const validationOk =
    Array.isArray(gap.validation_required) &&
    gap.validation_required.includes("node --check scripts/validate_runtime_kernel_backend_gap_map.js") &&
    gap.validation_required.includes("node scripts/validate_runtime_kernel_backend_gap_map.js") &&
    gap.validation_required.includes("npm run validate:runtime-kernel-gap") &&
    gap.validation_required.includes("npm run validate:mvp");

  const guardOk =
    guard.gap_map_only === true &&
    forbiddenTrueGuardFields.every((field) => guard[field] === false);

  const nextOk = gap.recommended_next_phase === "runtime_contract_spec_before_backend_or_kernel_code";

  return {
    passed: identityOk && capabilitiesOk && runtimeGapsOk && backendGapsOk && boundaryOk && validationOk && guardOk && nextOk,
    identityOk,
    capabilitiesOk,
    runtimeGapsOk,
    backendGapsOk,
    boundaryOk,
    validationOk,
    guardOk,
    nextOk,
  };
}

const checks = [];
function add(check, passed, detail = null) {
  checks.push({ check, passed: Boolean(passed), ...(detail === null ? {} : { detail }) });
}

for (const [key, rel] of Object.entries(files)) {
  add(`${key}_exists`, exists(rel), rel);
}

const doc = read(files.doc);
const schema = read(files.schema);
const fixtureRecord = readJson(files.fixture);
const failRecord = readJson(files.failFixture);
const mvp = read(files.mvp);
const packageJson = readJson(files.packageJson);

const fixtureEval = evaluate(fixtureRecord);
const failEval = evaluate(failRecord);

add("fixture_evaluates_pass", fixtureEval.passed, fixtureEval);
add("fail_fixture_evaluates_fail", failEval.passed === false, failEval);
add("doc_names_all_runtime_gaps", requiredRuntimeComponents.every((component) => doc.includes(component)));
add("doc_names_all_backend_gaps", requiredBackendComponents.every((component) => doc.includes(component)));
add("schema_declares_planning_contract_only", schema.includes("Planning contract only") && schema.includes("real_runtime_kernel_implemented_now"));
add("schema_current_capabilities_declares_object_shape", requiredCapabilitySchemaFields.every((field) => schema.includes(field)) && schema.includes("runtime_maturity_claim_allowed: false"));
add("schema_guard_declares_all_forbidden_fields", forbiddenTrueGuardFields.every((field) => schema.includes(field)));
add("package_script_registered", packageJson.scripts && packageJson.scripts["validate:runtime-kernel-gap"] === "node scripts/validate_runtime_kernel_backend_gap_map.js");
add("mvp_required_file_registered", mvp.includes("scripts/validate_runtime_kernel_backend_gap_map.js"));
add("mvp_validation_invokes_gap_map", mvp.includes("$runtimeKernelBackendGapMapOutput") && mvp.includes("validate_runtime_kernel_backend_gap_map.js"));

const failed = checks.filter((check) => !check.passed);
const output = {
  validator: "validate_runtime_kernel_backend_gap_map",
  phase: "v0_6_86_runtime_kernel_backend_gap_map",
  passed: failed.length === 0,
  status: failed.length === 0 ? "runtime_kernel_backend_gap_map_verified" : "runtime_kernel_backend_gap_map_failed",
  runtime_gap_count: requiredRuntimeComponents.length,
  backend_gap_count: requiredBackendComponents.length,
  implementation_started: false,
  recommended_next_phase: "runtime_contract_spec_before_backend_or_kernel_code",
  side_effects: {
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    secret_value_read_performed: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false,
    dependency_change_performed: false,
    push_tag_release_deploy_performed: false,
  },
  check_count: checks.length,
  failed_count: failed.length,
  checks,
  failures: failed,
};

console.log(JSON.stringify(output, null, 2));
process.exit(output.passed ? 0 : 1);
