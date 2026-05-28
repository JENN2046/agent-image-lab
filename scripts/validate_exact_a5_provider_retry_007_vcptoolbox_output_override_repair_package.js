#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const repairPackagePath = "docs/EXACT_A5_PROVIDER_RETRY_007_VCPTOOLBOX_OUTPUT_OVERRIDE_REPAIR_PACKAGE.md";
const activationDocPath = "docs/EXACT_A5_PROVIDER_RETRY_007_ACTIVATION_PACKET_DRAFT.md";
const preflightDocPath = "docs/EXACT_A5_PROVIDER_RETRY_007_PREFLIGHT_DECISION.md";
const activationAdapterPath = "adapters/runtime/exact_a5_provider_retry_007_activation_packet_draft.js";
const activationValidatorPath = "scripts/validate_exact_a5_provider_retry_007_activation_packet_draft.js";
const vcptoolboxRoot = "A:\\VCP\\apps\\VCPToolBox";
const vcptoolboxRoutePath = path.join(vcptoolboxRoot, "routes", "admin", "aiImageAgents.js");
const vcptoolboxRouteTestPath = path.join(vcptoolboxRoot, "tests", "aiImageAgentsRoute.test.js");

const authorizationId = "AUTH-DRAFT-NATIVE-DOUBAO-SEEDREAM5-RETRY-20260527-007";
const retry007OutputRoot = "A:\\agent-image-lab\\agent-image-lab-v0.2\\runs\\real_generation\\v0_6_73_real_vcp_agent_generation_retry_007";
const validatorName = "validate_exact_a5_provider_retry_007_vcptoolbox_output_override_repair_package";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function repoPath(relativePath) {
  const resolved = path.resolve(root, relativePath);
  const relative = path.relative(root, resolved);
  assert(!relative.startsWith("..") && !path.isAbsolute(relative), `Path escapes repository: ${relativePath}`);
  return resolved;
}

function readRepo(relativePath) {
  return fs.readFileSync(repoPath(relativePath), "utf8");
}

function includesAll(text, tokens, label) {
  for (const token of tokens) {
    assert(text.includes(token), `${label} missing token: ${token}`);
  }
}

function assertFalseTokens(text, tokens, label) {
  for (const token of tokens) {
    assert(!text.includes(token), `${label} forbidden token present: ${token}`);
  }
}

function validateRepairPackage(text) {
  includesAll(text, [
    "phase: exact_a5_provider_retry_007_vcptoolbox_output_override_repair_package",
    "status: repair_package_only",
    "can_apply_now: false",
    "real_vcptoolbox_patch_allowed_now: false",
    "real_provider_execution_allowed_now: false",
    authorizationId,
    "A:\\VCP\\apps\\VCPToolBox\\routes\\admin\\aiImageAgents.js",
    "A:\\VCP\\apps\\VCPToolBox\\tests\\aiImageAgentsRoute.test.js",
    "A:\\VCP\\apps\\VCPToolBox\\server.js",
    "A:\\VCP\\apps\\VCPToolBox\\modules\\aiImageExecutionAdapter.js",
    "A:\\VCP\\apps\\VCPToolBox\\modules\\aiImagePipelineExecutor.js",
    "A:\\VCP\\apps\\VCPToolBox\\Plugin\\DoubaoGen\\",
    "new_runner_allowed: false",
    "new_module_allowed: false",
    "dependency_change_allowed: false",
    "target_constant: AUTHORIZED_DOUBAO_PROJECT_BASE_PATH_OVERRIDES",
    `key: ${authorizationId}`,
    `value: ${retry007OutputRoot}`,
    "aiImageAgents execute route forwards exact retry 007 Doubao project base path override",
    `expected_task_id: ${authorizationId}`,
    `expected_output_root: ${retry007OutputRoot}`,
    "node --check routes\\admin\\aiImageAgents.js",
    "node --test tests\\aiImageAgentsRoute.test.js",
    "node --test tests\\aiImageExecutionAdapter.test.js",
    "provider_contact_performed: false",
    "plugin_call_performed: false",
    "api_call_performed: false",
    "image_generation_performed: false",
    "secret_value_read_performed: false",
    "real_vcptoolbox_modified: false",
    "real_vcptoolbox_executed: false",
    "new_runner_created: false",
    "exact VCPToolBox patch authorization is missing",
    "target route no longer uses AUTHORIZED_DOUBAO_PROJECT_BASE_PATH_OVERRIDES",
    "This phrase does not authorize `retry_007` provider execution",
  ], "repair package");

  assertFalseTokens(text, [
    "can_apply_now: true",
    "real_vcptoolbox_patch_allowed_now: true",
    "real_provider_execution_allowed_now: true",
    "new_runner_allowed: true",
    "new_module_allowed: true",
    "dependency_change_allowed: true",
    "provider_contact_performed: true",
    "image_generation_performed: true",
    "secret_value_read_performed: true",
    "real_vcptoolbox_modified: true",
    "real_vcptoolbox_executed: true",
  ], "repair package");
}

function validateLinkedSurfaces() {
  const activationDoc = readRepo(activationDocPath);
  const preflightDoc = readRepo(preflightDocPath);
  const activationAdapter = readRepo(activationAdapterPath);
  const activationValidator = readRepo(activationValidatorPath);

  includesAll(activationDoc, [
    `execution_surface_repair_package: ${repairPackagePath}`,
    "VCPToolBox retry_007 output override repair applied and validated",
    "VCPToolBox node --test tests\\aiImageAgentsRoute.test.js",
    "vcptoolbox_retry_007_output_override_repair_applied: false",
  ], "activation doc");

  includesAll(preflightDoc, [
    "review_status: blocked_by_missing_retry_007_output_override",
    `repair_package_ref: ${repairPackagePath}`,
    "current_route_authorizes_retry_007_output_override: false",
    "provider_execution_allowed_now: false",
  ], "preflight doc");

  includesAll(activationAdapter, [
    `const outputOverrideRepairPackageRef = "${repairPackagePath}"`,
    "blocked_pending_vcptoolbox_retry_007_output_override_repair",
    "real_vcptoolbox_patch_allowed_now: false",
    "current_route_authorizes_retry_007_output_override: false",
    retry007OutputRoot.replace(/\\/g, "\\\\"),
    "VCPToolBox retry_007 output override repair applied and validated",
    "VCPToolBox retry_007 output override repair has not been applied and validated",
  ], "activation adapter");

  includesAll(activationValidator, [
    `const repairPackagePath = "${repairPackagePath}"`,
    "execution_surface_repair_marked_allowed_rejected",
    "execution_surface_route_ready_rejected",
    "current_route_authorizes_retry_007_output_override",
  ], "activation validator");
}

function validateOptionalVcpToolBoxSurface() {
  if (!fs.existsSync(vcptoolboxRoutePath) || !fs.existsSync(vcptoolboxRouteTestPath)) {
    return {
      vcptoolbox_available: false,
      vcptoolbox_surface_checked: false,
      current_route_authorizes_retry_007_output_override: null,
    };
  }

  const route = fs.readFileSync(vcptoolboxRoutePath, "utf8");
  const routeTest = fs.readFileSync(vcptoolboxRouteTestPath, "utf8");

  includesAll(route, [
    "AUTHORIZED_DOUBAO_PROJECT_BASE_PATH_OVERRIDES",
    "AUTH-DRAFT-NATIVE-DOUBAO-SEEDREAM5-RETRY-20260526-003",
    "AUTH-DRAFT-NATIVE-DOUBAO-SEEDREAM5-RETRY-20260526-004",
    "AUTH-DRAFT-NATIVE-DOUBAO-SEEDREAM5-RETRY-20260526-005",
    "AUTH-DRAFT-NATIVE-DOUBAO-SEEDREAM5-RETRY-20260526-006",
    "resolveAuthorizedDoubaoProjectBasePathOverride",
  ], "VCPToolBox route");

  includesAll(routeTest, [
    "forwards exact retry 003 Doubao project base path override",
    "forwards exact retry 004 Doubao project base path override",
    "forwards exact retry 005 Doubao project base path override",
    "forwards exact retry 006 Doubao project base path override",
    "rejects unapproved Doubao project base path override",
  ], "VCPToolBox route test");

  const routeAuthorizesRetry007 = route.includes(authorizationId) && route.includes(retry007OutputRoot);
  assert(routeAuthorizesRetry007 === false, "Current VCPToolBox route unexpectedly authorizes retry_007; repair package status must be updated before activation");

  return {
    vcptoolbox_available: true,
    vcptoolbox_surface_checked: true,
    current_route_authorizes_retry_007_output_override: routeAuthorizesRetry007,
  };
}

function main() {
  assert(fs.existsSync(repoPath(repairPackagePath)), "repair package missing");
  validateRepairPackage(readRepo(repairPackagePath));
  validateLinkedSurfaces();
  const vcptoolboxSurface = validateOptionalVcpToolBoxSurface();

  console.log(JSON.stringify({
    passed: true,
    validator: validatorName,
    repair_package_ref: repairPackagePath,
    authorization_id: authorizationId,
    required_output_root: retry007OutputRoot,
    can_apply_now: false,
    real_vcptoolbox_patch_allowed_now: false,
    real_provider_execution_allowed_now: false,
    ...vcptoolboxSurface,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    secret_value_read_performed: false,
    env_file_content_read_performed: false,
    real_vcptoolbox_modified: false,
    real_vcptoolbox_executed: false,
    new_runner_created: false,
  }, null, 2));
}

try {
  main();
} catch (error) {
  console.error(JSON.stringify({
    passed: false,
    validator: validatorName,
    error: error.message,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    secret_value_read_performed: false,
    real_vcptoolbox_modified: false,
    real_vcptoolbox_executed: false,
  }, null, 2));
  process.exitCode = 1;
}
