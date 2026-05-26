#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { execFileSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const sampleId = "accepted_french_summer_rattan_bucket_bag_001";
const checks = [];

function relPath(file) {
  return path.join(root, file);
}

function add(check, passed, detail) {
  checks.push({
    check,
    passed: Boolean(passed),
    ...(detail === undefined ? {} : { detail }),
  });
}

function runNode(args, timeout = 30000) {
  return execFileSync(process.execPath, args, {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    timeout,
  });
}

function parseJson(text) {
  return JSON.parse(text.trim());
}

function assertNoExternalEffects(result) {
  const forbidden = [
    "provider_contact_performed",
    "plugin_call_performed",
    "api_call_performed",
    "image_generation_performed",
    "secret_value_read_performed",
    "env_file_content_read_performed",
    "DailyNote_write_performed",
    "VCP_memory_write_performed",
    "output_write_performed",
  ];
  return forbidden.every((key) => result[key] !== true);
}

function safeCheck(name, fn) {
  try {
    add(name, fn());
  } catch (error) {
    add(name, false, error.message);
  }
}

safeCheck("create_preview_capsule_plan_only", () => {
  const result = parseJson(runNode(["scripts/create_preview_capsule.js", `--sample-id=${sampleId}`]));
  return result.passed === true &&
    result.mode === "plan_only" &&
    result.writes_performed === false &&
    result.confirm_create_required === true &&
    result.guard.provider_contact_performed === false &&
    result.guard.image_generation_performed === false;
});

safeCheck("validate_preview_capsule_existing_capsule", () => {
  const result = parseJson(runNode(["scripts/validate_preview_capsule.js", `--sample-id=${sampleId}`, "--long-edge=512"]));
  return result.passed === true &&
    result.status === "git_portable_preview_evidence_verified" &&
    result.previewLongEdge === 512 &&
    result.failures.length === 0;
});

safeCheck("read_only_adapter_blocks_write_intent", () => {
  const adapter = require(relPath("scripts/agent_image_lab_read_only_adapter.js"));
  const response = adapter.processRequest({
    schema_version: "v1",
    request_id: "mvp_core_write_block_001",
    bridge_mode: "read_only",
    payload_type: "text_only_refs",
    case_id: "french_summer_rattan_bag_v3_production_candidate_001",
    requested_resources: ["project_state"],
    write_intent: true,
  });
  return response.status === "blocked" &&
    response.blocked_reasons.includes("write_intent_detected") &&
    response.external_side_effects.vcp_call_performed === false &&
    response.external_side_effects.vcp_memory_write_performed === false;
});

safeCheck("native_doubao_runner_dry_run_no_api", () => {
  const result = parseJson(runNode([
    "scripts/run_native_doubao_image_generation.js",
    "--case-id=tennis_wallet_hero_v2_preflight",
    "--dry-run=true",
  ]));
  return result.status === "DRY_RUN_ONLY" &&
    result.provider_contact_performed === false &&
    result.api_call_performed === false &&
    result.image_generation_performed === false &&
    result.secret_value_read_performed === false;
});

safeCheck("native_doubao_adapter_fail_closed_without_authorization", () => {
  const output = runNode([
    "-e",
    [
      "const adapter = require('./adapters/image_generation/native_doubao_adapter.js');",
      "adapter.run({ dryRun: false, promptPackageRef: 'prompts/image_generation/product_still_life_tennis_wallet_hero_v2.yaml', outputDirectory: 'runs/real_generation/tennis_wallet_hero_v2_preflight', maxPluginCalls: 1, maxImagesCreated: 1 })",
      ".then((result) => { console.log(JSON.stringify(result)); process.exit(result.status === 'BLOCKED_A5_REQUIRED' ? 0 : 1); })",
      ".catch((error) => { console.error(error.stack || error.message); process.exit(1); });",
    ].join(" "),
  ]);
  const result = parseJson(output);
  return result.status === "BLOCKED_A5_REQUIRED";
});

safeCheck("review_console_static_mock_basic_structure", () => {
  const mockSource = fs.readFileSync(relPath("review_console/static_prototype/mock_data.js"), "utf8");
  const appSource = fs.readFileSync(relPath("review_console/static_prototype/app.js"), "utf8");
  const sandbox = { window: {} };
  vm.runInNewContext(mockSource, sandbox, { filename: "mock_data.js", timeout: 1000 });
  const mock = sandbox.window.REVIEW_CONSOLE_MOCK;
  return mock &&
    Array.isArray(mock.score_model) &&
    mock.portable_preview_capsule_evidence &&
    mock.portable_preview_capsule_evidence.sample_id === sampleId &&
    appSource.includes("window.REVIEW_CONSOLE_MOCK");
});

const failed = checks.filter((check) => !check.passed);
const output = {
  passed: failed.length === 0,
  validator: "validate_mvp_core",
  check_count: checks.length,
  failed_count: failed.length,
  scope: "mvp_product_core_only",
  excludes_agent_board: true,
  excludes_governance_docs_phase_ledger: true,
  provider_contact_performed: false,
  secret_value_read_performed: false,
  image_generation_performed: false,
  checks,
};

const sideEffectLeak = !assertNoExternalEffects(output);
if (sideEffectLeak) {
  output.passed = false;
  output.failed_count += 1;
  output.checks.push({ check: "mvp_core_side_effect_flags_false", passed: false });
} else {
  output.checks.push({ check: "mvp_core_side_effect_flags_false", passed: true });
  output.check_count += 1;
}

process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
process.exit(output.passed ? 0 : 1);
