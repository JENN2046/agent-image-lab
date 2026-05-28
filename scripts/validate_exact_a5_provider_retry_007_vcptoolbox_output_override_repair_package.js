#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const repairPackagePath = "docs/EXACT_A5_PROVIDER_RETRY_007_VCPTOOLBOX_OUTPUT_OVERRIDE_REPAIR_PACKAGE.md";
const patchPreviewScriptPath = "scripts/preview_exact_a5_provider_retry_007_vcptoolbox_output_override_patch.js";
const activationDocPath = "docs/EXACT_A5_PROVIDER_RETRY_007_ACTIVATION_PACKET_DRAFT.md";
const preflightDocPath = "docs/EXACT_A5_PROVIDER_RETRY_007_PREFLIGHT_DECISION.md";
const activationAdapterPath = "adapters/runtime/exact_a5_provider_retry_007_activation_packet_draft.js";
const activationValidatorPath = "scripts/validate_exact_a5_provider_retry_007_activation_packet_draft.js";
const vcptoolboxRoot = "A:\\VCP\\apps\\VCPToolBox";
const vcptoolboxRoutePath = path.join(vcptoolboxRoot, "routes", "admin", "aiImageAgents.js");
const vcptoolboxRouteTestPath = path.join(vcptoolboxRoot, "tests", "aiImageAgentsRoute.test.js");

const authorizationId = "AUTH-DRAFT-NATIVE-DOUBAO-SEEDREAM5-RETRY-20260527-007";
const retry007OutputRoot = "A:\\agent-image-lab\\agent-image-lab-v0.2\\runs\\real_generation\\v0_6_73_real_vcp_agent_generation_retry_007";
const retry007OutputRootSource = retry007OutputRoot.replace(/\\/g, "\\\\");
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
    "status: repair_applied_and_validated",
    "can_apply_now: false",
    "real_vcptoolbox_patch_allowed_now: false",
    "real_provider_execution_allowed_now: false",
    "repair_authorization_phrase_issued_by_owner: true",
    "repair_applied: true",
    "repair_validated: true",
    `patch_preview_script: ${patchPreviewScriptPath}`,
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
    "current_route_authorizes_retry_007_output_override: true",
    "current_route_test_covers_retry_007_output_override: true",
    "missing_allowlist_entry: none",
    "node scripts\\preview_exact_a5_provider_retry_007_vcptoolbox_output_override_patch.js",
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
    "real_vcptoolbox_authorized_two_file_repair_performed: true",
    "real_vcptoolbox_modified_files_count: 2",
    "real_vcptoolbox_provider_runtime_executed: false",
    "real_vcptoolbox_route_tests_executed: true",
    "new_runner_created: false",
    "retry_007 exact provider activation phrase is missing",
    "target route no longer authorizes the exact retry_007 output override",
    "This phrase did not authorize `retry_007` provider execution",
  ], "repair package");

  assertFalseTokens(text, [
    "status: repair_package_only",
    "can_apply_now: true",
    "real_vcptoolbox_patch_allowed_now: true",
    "real_provider_execution_allowed_now: true",
    "new_runner_allowed: true",
    "new_module_allowed: true",
    "dependency_change_allowed: true",
    "provider_contact_performed: true",
    "image_generation_performed: true",
    "secret_value_read_performed: true",
    "real_vcptoolbox_provider_runtime_executed: true",
  ], "repair package");
}

function validatePatchPreview() {
  const previewScriptFullPath = repoPath(patchPreviewScriptPath);
  assert(fs.existsSync(previewScriptFullPath), "patch preview script missing");
  const preview = require(previewScriptFullPath).buildPreview();

  assert(preview.passed === true, "patch preview must pass");
  assert(preview.preview_id === "exact_a5_provider_retry_007_vcptoolbox_output_override_patch_preview", "patch preview id mismatch");
  assert(preview.mode === "applied_state_patch_preview_only", "patch preview mode mismatch");
  assert(preview.repair_package_ref === repairPackagePath, "patch preview repair package ref mismatch");
  assert(preview.can_apply_now === false, "patch preview must not be directly executable");
  assert(preview.repair_already_applied === true, "patch preview must detect the applied repair");
  assert(preview.exact_authorization_required === false, "patch preview must not require another repair authorization once applied");
  assert(preview.real_vcptoolbox_patch_allowed_now === false, "patch preview must not allow VCPToolBox patch now");
  assert(preview.provider_execution_allowed_now === false, "patch preview must not allow provider execution");
  assert(Array.isArray(preview.allowed_vcptoolbox_files_if_separately_authorized), "patch preview allowed file list missing");
  assert(preview.allowed_vcptoolbox_files_if_separately_authorized.length === 2, "patch preview must keep exactly two allowed VCPToolBox files");
  assert(preview.allowed_vcptoolbox_files_if_separately_authorized.includes(vcptoolboxRoutePath), "patch preview route path mismatch");
  assert(preview.allowed_vcptoolbox_files_if_separately_authorized.includes(vcptoolboxRouteTestPath), "patch preview route test path mismatch");
  assert(preview.forbidden_vcptoolbox_files.includes(path.join(vcptoolboxRoot, "server.js")), "patch preview must forbid server.js");
  assert(preview.forbidden_vcptoolbox_files.includes(path.join(vcptoolboxRoot, "modules", "aiImageExecutionAdapter.js")), "patch preview must forbid adapter module");
  assert(preview.forbidden_vcptoolbox_files.includes(path.join(vcptoolboxRoot, "Plugin", "DoubaoGen")), "patch preview must forbid DoubaoGen edits");
  assert(preview.route_delta_preview.add_exact_entry.key === authorizationId, "patch preview route key mismatch");
  assert(preview.route_delta_preview.add_exact_entry.value === retry007OutputRoot, "patch preview route value mismatch");
  assert(preview.route_delta_preview.add_exact_entry.source_preview.includes(authorizationId), "patch preview route source missing authorization id");
  assert(preview.route_delta_preview.add_exact_entry.source_preview.includes(retry007OutputRootSource), "patch preview route source missing escaped output root");
  assert(preview.route_test_delta_preview.add_test_name === "aiImageAgents execute route forwards exact retry 007 Doubao project base path override", "patch preview test name mismatch");
  assert(preview.route_test_delta_preview.expected_task_id === authorizationId, "patch preview test task id mismatch");
  assert(preview.route_test_delta_preview.expected_output_root === retry007OutputRoot, "patch preview test output root mismatch");
  assert(preview.route_test_delta_preview.source_preview.includes(authorizationId), "patch preview test source missing authorization id");
  assert(preview.route_test_delta_preview.source_preview.includes(retry007OutputRootSource), "patch preview test source missing escaped output root");
  assert(preview.route_test_delta_preview.preserve_negative_test === true, "patch preview must preserve negative route test");
  assert(preview.side_effects.dry_run_only === true, "patch preview must be dry-run only");
  for (const [field, value] of Object.entries(preview.side_effects)) {
    if (field !== "dry_run_only") {
      assert(value === false, `patch preview side effect must be false: ${field}`);
    }
  }

  if (preview.current_surface.vcptoolbox_available === true) {
    assert(preview.current_surface.route_file_exists === true, "patch preview must see VCPToolBox route when repo is available");
    assert(preview.current_surface.route_test_file_exists === true, "patch preview must see VCPToolBox route test when repo is available");
    assert(preview.current_surface.status === "retry_007_output_override_applied_and_tested_surface_present", "patch preview current surface status mismatch");
    assert(preview.current_surface.route_has_output_override_constant === true, "patch preview route constant missing");
    assert(preview.current_surface.route_has_retry_006_anchor === true, "patch preview route retry_006 anchor missing");
    assert(preview.current_surface.route_test_has_retry_006_anchor === true, "patch preview route test retry_006 anchor missing");
    assert(preview.current_surface.current_route_authorizes_retry_007_output_override === true, "patch preview must detect retry_007 route authorization");
    assert(preview.current_surface.current_route_test_covers_retry_007_output_override === true, "patch preview must detect retry_007 route test coverage");
  }

  return preview;
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
    "vcptoolbox_retry_007_output_override_repair_applied: true",
    "current_route_authorizes_retry_007_output_override: true",
  ], "activation doc");

  includesAll(preflightDoc, [
    "review_status: ready_after_retry_007_output_override_repair_applied",
    `repair_package_ref: ${repairPackagePath}`,
    "current_route_authorizes_retry_007_output_override: true",
    "current_route_test_covers_retry_007_output_override: true",
    "provider_execution_allowed_now: false",
  ], "preflight doc");

  includesAll(activationAdapter, [
    `const outputOverrideRepairPackageRef = "${repairPackagePath}"`,
    "satisfied_vcptoolbox_retry_007_output_override_repair_applied",
    "real_vcptoolbox_patch_allowed_now: false",
    "vcptoolbox_retry_007_output_override_repair_applied: true",
    "current_route_authorizes_retry_007_output_override: true",
    "current_route_test_covers_retry_007_output_override: true",
    retry007OutputRoot.replace(/\\/g, "\\\\"),
    "VCPToolBox retry_007 output override repair applied and validated",
    "VCPToolBox retry_007 output override repair validation is missing or stale",
  ], "activation adapter");

  includesAll(activationValidator, [
    `const repairPackagePath = "${repairPackagePath}"`,
    "execution_surface_repair_marked_allowed_rejected",
    "execution_surface_route_missing_rejected",
    "current_route_authorizes_retry_007_output_override",
  ], "activation validator");
}

function validateOptionalVcpToolBoxSurface() {
  if (!fs.existsSync(vcptoolboxRoutePath) || !fs.existsSync(vcptoolboxRouteTestPath)) {
    return {
      vcptoolbox_available: false,
      vcptoolbox_surface_checked: false,
      current_route_authorizes_retry_007_output_override: null,
      current_route_test_covers_retry_007_output_override: null,
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
    authorizationId,
    "resolveAuthorizedDoubaoProjectBasePathOverride",
  ], "VCPToolBox route");

  includesAll(routeTest, [
    "forwards exact retry 003 Doubao project base path override",
    "forwards exact retry 004 Doubao project base path override",
    "forwards exact retry 005 Doubao project base path override",
    "forwards exact retry 006 Doubao project base path override",
    "forwards exact retry 007 Doubao project base path override",
    "rejects unapproved Doubao project base path override",
  ], "VCPToolBox route test");

  const routeAuthorizesRetry007 = route.includes(authorizationId) &&
    (route.includes(retry007OutputRoot) || route.includes(retry007OutputRootSource));
  const routeTestCoversRetry007 = routeTest.includes("forwards exact retry 007 Doubao project base path override") &&
    routeTest.includes(authorizationId) &&
    (routeTest.includes(retry007OutputRoot) || routeTest.includes(retry007OutputRootSource));
  assert(routeAuthorizesRetry007 === true, "Current VCPToolBox route must authorize retry_007 after repair");
  assert(routeTestCoversRetry007 === true, "Current VCPToolBox route test must cover retry_007 after repair");

  return {
    vcptoolbox_available: true,
    vcptoolbox_surface_checked: true,
    current_route_authorizes_retry_007_output_override: routeAuthorizesRetry007,
    current_route_test_covers_retry_007_output_override: routeTestCoversRetry007,
  };
}

function main() {
  assert(fs.existsSync(repoPath(repairPackagePath)), "repair package missing");
  validateRepairPackage(readRepo(repairPackagePath));
  const patchPreview = validatePatchPreview();
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
    patch_preview_script: patchPreviewScriptPath,
    patch_preview_id: patchPreview.preview_id,
    patch_preview_mode: patchPreview.mode,
    patch_preview_validated: true,
    ...vcptoolboxSurface,
    repair_applied: true,
    repair_validated: true,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    secret_value_read_performed: false,
    env_file_content_read_performed: false,
    real_vcptoolbox_write_performed_by_validator: false,
    real_vcptoolbox_provider_runtime_executed: false,
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
    real_vcptoolbox_write_performed_by_validator: false,
    real_vcptoolbox_provider_runtime_executed: false,
  }, null, 2));
  process.exitCode = 1;
}
