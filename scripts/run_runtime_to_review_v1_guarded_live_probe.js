#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const runnerId = "runtime_to_review_v1_guarded_live_probe_runner";
const exactConfirmation = "RUNTIME_TO_REVIEW_V1_ONE_PROVIDER_ONE_IMAGE";
const defaultInput = "tests/fixtures/runtime_kernel_v1_real_guarded_task.fixture.json";

function assertString(value, label) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${label} must be a non-empty string`);
  }
}

function normalizeRepoRelativePath(value, label) {
  assertString(value, label);
  if (path.isAbsolute(value)) {
    throw new Error(`${label} must be repository-relative`);
  }
  const normalized = value.replace(/\\/g, "/");
  if (normalized.split("/").includes("..")) {
    throw new Error(`${label} must not contain traversal`);
  }
  const resolved = path.resolve(repoRoot, normalized);
  const relative = path.relative(repoRoot, resolved).replace(/\\/g, "/");
  if (relative.startsWith("../") || relative === ".." || path.isAbsolute(relative)) {
    throw new Error(`${label} escapes repository root`);
  }
  return { normalized: relative, resolved };
}

function parseArgs(argv) {
  const args = {
    input: defaultInput,
    max_images: 1,
    preflight_only: false,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const item = argv[index];
    if (item === "--input") args.input = argv[++index];
    else if (item === "--provider-delegate-module") args.provider_delegate_module = argv[++index];
    else if (item === "--owner-runtime-module") args.owner_runtime_module = argv[++index];
    else if (item === "--confirm-live-provider-probe") args.confirm_live_provider_probe = argv[++index];
    else if (item === "--max-images") args.max_images = Number(argv[++index]);
    else if (item === "--preflight-only") args.preflight_only = true;
    else if (item === "--help") args.help = true;
    else throw new Error(`Unknown argument: ${item}`);
  }
  return args;
}

function printHelp() {
  process.stdout.write([
    "Usage:",
    `  node scripts/run_runtime_to_review_v1_guarded_live_probe.js --provider-delegate-module <repo-relative-module> --confirm-live-provider-probe ${exactConfirmation}`,
    "",
    "Runs runtime v1 real_guarded only when an injected provider delegate module and exact confirmation are both present.",
    "The runner itself does not read secret values; the injected delegate owns provider access and must return structured runtime_v1 provider result metadata.",
    "Use --owner-runtime-module <repo-relative-module> to inject a controlled secretless owner runtime into delegate factories that support it.",
    "Use --preflight-only for a no-call gate check.",
  ].join("\n") + "\n");
}

function blockedPreflight(reason, extra = {}) {
  return {
    passed: false,
    runner_id: runnerId,
    status: "blocked_live_probe_not_executed",
    reason,
    exact_confirmation_required: exactConfirmation,
    provider_delegate_module_required: true,
    max_images: 1,
    output_scope: "run_directory_only",
    real_provider_call_performed: false,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    secret_value_read_performed_by_runner: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false,
    accepted_samples_write_performed: false,
    production_candidate_write_performed: false,
    ...extra,
  };
}

function validatePreflight(args) {
  const issues = [];
  if (args.max_images !== 1) issues.push("max_images_must_be_1");
  if (args.confirm_live_provider_probe !== exactConfirmation) issues.push("exact_confirmation_missing_or_wrong");
  if (!args.provider_delegate_module) issues.push("provider_delegate_module_missing");
  if (args.provider_delegate_module) {
    try {
      const { normalized, resolved } = normalizeRepoRelativePath(args.provider_delegate_module, "--provider-delegate-module");
      if (!normalized.endsWith(".js")) issues.push("provider_delegate_module_must_be_js");
      if (!fs.existsSync(resolved)) issues.push("provider_delegate_module_missing_on_disk");
    } catch (error) {
      issues.push(error.message);
    }
  }
  if (args.owner_runtime_module) {
    try {
      const { normalized, resolved } = normalizeRepoRelativePath(args.owner_runtime_module, "--owner-runtime-module");
      if (!normalized.endsWith(".js")) issues.push("owner_runtime_module_must_be_js");
      if (!fs.existsSync(resolved)) issues.push("owner_runtime_module_missing_on_disk");
    } catch (error) {
      issues.push(error.message);
    }
  }
  return {
    passed: issues.length === 0,
    issues,
  };
}

async function runLiveProbe(args) {
  const preflight = validatePreflight(args);
  if (args.preflight_only) {
    return {
      passed: true,
      runner_id: runnerId,
      status: "preflight_only_no_live_probe_executed",
      exact_confirmation_required: exactConfirmation,
      exact_confirmation_present: args.confirm_live_provider_probe === exactConfirmation,
      provider_delegate_module_present: Boolean(args.provider_delegate_module),
      owner_runtime_module_present: Boolean(args.owner_runtime_module),
      preflight_would_pass_with_current_args: preflight.passed,
      preflight_issues: preflight.issues,
      real_provider_call_performed: false,
      provider_contact_performed: false,
      plugin_call_performed: false,
      api_call_performed: false,
      image_generation_performed: false,
      secret_value_read_performed_by_runner: false,
      DailyNote_write_performed: false,
      VCP_memory_write_performed: false,
      accepted_samples_write_performed: false,
      production_candidate_write_performed: false,
    };
  }
  if (!preflight.passed) {
    return blockedPreflight(preflight.issues.join(","), {
      preflight_issues: preflight.issues,
    });
  }

  const { resolved: inputPath } = normalizeRepoRelativePath(args.input, "--input");
  const { resolved: delegatePath, normalized: delegateRef } = normalizeRepoRelativePath(args.provider_delegate_module, "--provider-delegate-module");
  const delegateModule = require(delegatePath);
  let providerDelegate = delegateModule;
  let ownerRuntimeRef = null;
  if (args.owner_runtime_module) {
    const { resolved: ownerRuntimePath, normalized } = normalizeRepoRelativePath(args.owner_runtime_module, "--owner-runtime-module");
    ownerRuntimeRef = normalized;
    const ownerRuntimeModule = require(ownerRuntimePath);
    const createOwnerRuntime = typeof ownerRuntimeModule === "function"
      ? ownerRuntimeModule
      : ownerRuntimeModule.createSecretlessProviderRuntime;
    if (typeof createOwnerRuntime !== "function") {
      throw new Error("owner runtime module must export a function or createSecretlessProviderRuntime");
    }
    if (!delegateModule || typeof delegateModule.createNativeDoubaoRuntimeV1ProviderDelegate !== "function") {
      throw new Error("provider delegate module must export createNativeDoubaoRuntimeV1ProviderDelegate when owner runtime module is supplied");
    }
    providerDelegate = delegateModule.createNativeDoubaoRuntimeV1ProviderDelegate({
      secretlessProviderRuntime: createOwnerRuntime(),
    });
  }
  if (typeof providerDelegate !== "function") {
    throw new Error("provider delegate module must export a function");
  }

  const { runRuntimeKernelV1 } = require("../kernel/runtime_kernel_v1_real_provider_guarded");
  const task = JSON.parse(fs.readFileSync(inputPath, "utf8"));
  const runtimeResult = await runRuntimeKernelV1(task, { providerDelegate });
  return {
    passed: runtimeResult.status === "completed_provider_image_created",
    runner_id: runnerId,
    status: runtimeResult.status === "completed_provider_image_created"
      ? "completed_provider_image_created"
      : "failed_closed",
    provider_delegate_module: delegateRef,
    owner_runtime_module: ownerRuntimeRef,
    runtime_result: runtimeResult,
    calls_used: runtimeResult.calls_used,
    image_count: runtimeResult.image_count,
    stop_reason: runtimeResult.stop_reason,
    secret_value_read_performed_by_runner: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false,
    accepted_samples_write_performed: false,
    production_candidate_write_performed: false,
  };
}

async function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  if (args.help) {
    printHelp();
    return;
  }
  const result = await runLiveProbe(args);
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  if (result.passed !== true) process.exitCode = 2;
}

if (require.main === module) {
  main().catch((error) => {
    process.stderr.write(`${JSON.stringify({
      passed: false,
      runner_id: runnerId,
      status: "failed_closed",
      error: error.message,
      real_provider_call_performed: false,
      secret_value_read_performed_by_runner: false,
    }, null, 2)}\n`);
    process.exitCode = 1;
  });
}

module.exports = {
  runnerId,
  exactConfirmation,
  defaultInput,
  validatePreflight,
  runLiveProbe,
};
