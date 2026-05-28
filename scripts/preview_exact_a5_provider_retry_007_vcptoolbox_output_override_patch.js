#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const previewId = "exact_a5_provider_retry_007_vcptoolbox_output_override_patch_preview";
const vcptoolboxRoot = "A:\\VCP\\apps\\VCPToolBox";
const routeRelativePath = path.join("routes", "admin", "aiImageAgents.js");
const routeTestRelativePath = path.join("tests", "aiImageAgentsRoute.test.js");
const routePath = path.join(vcptoolboxRoot, routeRelativePath);
const routeTestPath = path.join(vcptoolboxRoot, routeTestRelativePath);
const authorizationId = "AUTH-DRAFT-NATIVE-DOUBAO-SEEDREAM5-RETRY-20260527-007";
const retry007OutputRoot = "A:\\agent-image-lab\\agent-image-lab-v0.2\\runs\\real_generation\\v0_6_73_real_vcp_agent_generation_retry_007";
const retry006AuthorizationId = "AUTH-DRAFT-NATIVE-DOUBAO-SEEDREAM5-RETRY-20260526-006";
const retry006OutputRoot = "A:\\agent-image-lab\\agent-image-lab-v0.2\\runs\\real_generation\\v0_6_73_real_vcp_agent_generation_retry_006";
const routeTestName = "aiImageAgents execute route forwards exact retry 007 Doubao project base path override";
const repairPackageRef = "docs/EXACT_A5_PROVIDER_RETRY_007_VCPTOOLBOX_OUTPUT_OVERRIDE_REPAIR_PACKAGE.md";

function toSourcePathLiteral(value) {
  return value.replace(/\\/g, "\\\\");
}

function jsSingleQuoted(value) {
  return `'${toSourcePathLiteral(value).replace(/'/g, "\\'")}'`;
}

function readIfExists(filePath) {
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, "utf8");
}

function containsRouteAuthorization(routeText) {
  if (!routeText) return false;
  return routeText.includes(authorizationId) &&
    (routeText.includes(retry007OutputRoot) || routeText.includes(toSourcePathLiteral(retry007OutputRoot)));
}

function containsRouteTestCoverage(routeTestText) {
  if (!routeTestText) return false;
  return routeTestText.includes(routeTestName) &&
    routeTestText.includes(authorizationId) &&
    (routeTestText.includes(retry007OutputRoot) || routeTestText.includes(toSourcePathLiteral(retry007OutputRoot)));
}

function buildRouteEntryPreview() {
  return [
    `  ${jsSingleQuoted(authorizationId)}:`,
    `    ${jsSingleQuoted(retry007OutputRoot)},`,
  ].join("\n");
}

function buildRouteInsertionAnchorPreview() {
  return [
    `  ${jsSingleQuoted(retry006AuthorizationId)}:`,
    `    ${jsSingleQuoted(retry006OutputRoot)},`,
  ].join("\n");
}

function buildRouteTestPreview() {
  return [
    `test('${routeTestName}', async () => {`,
    "    const calls = [];",
    `    const exactOutputRoot = ${jsSingleQuoted(retry007OutputRoot)};`,
    "",
    "    await withRouteModule({",
    "        async executeAiImagePipelineV2(input, options) {",
    "            calls.push({ input, options });",
    "            return { ok: true, mode: 'real_execution' };",
    "        }",
    "    }, async ({ handleAiImagePipelineRequest }) => {",
    "        const pluginManager = {",
    "            getPlugin(name) {",
    "                return name === 'DoubaoGen' ? { name: 'DoubaoGen' } : null;",
    "            },",
    "            processToolCall() {}",
    "        };",
    "",
    "        const result = await handleAiImagePipelineRequest({",
    "            ip: '::ffff:10.0.0.15',",
    "            adminAuthUser: 'admin-root',",
    "            body: {",
    "                pipelineId: 'pipe-11',",
    `                taskId: ${jsSingleQuoted(authorizationId)},`,
    "                dryRun: false,",
    "                confirm: true,",
    "                context: {",
    "                    doubaoProjectBasePathOverride: exactOutputRoot",
    "                },",
    "                plan: {",
    "                    steps: [{ type: 'generate_image', plugin: 'DoubaoGen', prompt: 'test' }]",
    "                }",
    "            }",
    "        }, {",
    "            pluginManager",
    "        });",
    "",
    "        assert.equal(result.ok, true);",
    "        assert.equal(calls.length, 1);",
    "        assert.equal(calls[0].options.executionContext.doubaoProjectBasePathOverride, exactOutputRoot);",
    "    });",
    "});",
  ].join("\n");
}

function buildPreview() {
  const routeText = readIfExists(routePath);
  const routeTestText = readIfExists(routeTestPath);
  const vcptoolboxAvailable = fs.existsSync(vcptoolboxRoot);
  const routeFileExists = routeText !== null;
  const routeTestFileExists = routeTestText !== null;
  const routeCurrentlyAuthorizesRetry007 = containsRouteAuthorization(routeText);
  const testCurrentlyCoversRetry007 = containsRouteTestCoverage(routeTestText);

  return {
    passed: true,
    preview_id: previewId,
    mode: "dry_run_patch_preview_only",
    repair_package_ref: repairPackageRef,
    can_apply_now: false,
    exact_authorization_required: true,
    real_vcptoolbox_patch_allowed_now: false,
    provider_execution_allowed_now: false,
    vcptoolbox_root: vcptoolboxRoot,
    allowed_vcptoolbox_files_if_separately_authorized: [
      routePath,
      routeTestPath,
    ],
    forbidden_vcptoolbox_files: [
      path.join(vcptoolboxRoot, "server.js"),
      path.join(vcptoolboxRoot, "modules", "aiImageExecutionAdapter.js"),
      path.join(vcptoolboxRoot, "modules", "aiImagePipelineExecutor.js"),
      path.join(vcptoolboxRoot, "Plugin", "DoubaoGen"),
      path.join(vcptoolboxRoot, ".env"),
      path.join(vcptoolboxRoot, "config.env"),
    ],
    current_surface: {
      vcptoolbox_available: vcptoolboxAvailable,
      route_file_exists: routeFileExists,
      route_test_file_exists: routeTestFileExists,
      route_has_output_override_constant: Boolean(routeText && routeText.includes("AUTHORIZED_DOUBAO_PROJECT_BASE_PATH_OVERRIDES")),
      route_has_retry_006_anchor: Boolean(routeText && routeText.includes(retry006AuthorizationId) && routeText.includes(toSourcePathLiteral(retry006OutputRoot))),
      route_test_has_retry_006_anchor: Boolean(routeTestText && routeTestText.includes("forwards exact retry 006 Doubao project base path override")),
      current_route_authorizes_retry_007_output_override: routeCurrentlyAuthorizesRetry007,
      current_route_test_covers_retry_007_output_override: testCurrentlyCoversRetry007,
    },
    route_delta_preview: {
      target_constant: "AUTHORIZED_DOUBAO_PROJECT_BASE_PATH_OVERRIDES",
      insert_after_authorization_id: retry006AuthorizationId,
      insert_after_source_preview: buildRouteInsertionAnchorPreview(),
      add_exact_entry: {
        key: authorizationId,
        value: retry007OutputRoot,
        source_preview: buildRouteEntryPreview(),
      },
    },
    route_test_delta_preview: {
      insert_before_test_name: "aiImageAgents execute route rejects unapproved Doubao project base path override",
      add_test_name: routeTestName,
      expected_task_id: authorizationId,
      expected_output_root: retry007OutputRoot,
      source_preview: buildRouteTestPreview(),
      preserve_negative_test: true,
    },
    side_effects: {
      dry_run_only: true,
      file_write_performed: false,
      real_vcptoolbox_modified: false,
      real_vcptoolbox_executed: false,
      provider_contact_performed: false,
      plugin_call_performed: false,
      api_call_performed: false,
      image_generation_performed: false,
      secret_value_read_performed: false,
      env_file_content_read_performed: false,
      new_runner_created: false,
      dependency_change_performed: false,
      tag_release_deploy_performed: false,
    },
  };
}

if (require.main === module) {
  process.stdout.write(`${JSON.stringify(buildPreview(), null, 2)}\n`);
}

module.exports = {
  previewId,
  vcptoolboxRoot,
  routePath,
  routeTestPath,
  authorizationId,
  retry007OutputRoot,
  routeTestName,
  buildPreview,
};
