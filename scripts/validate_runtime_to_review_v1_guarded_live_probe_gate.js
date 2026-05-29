#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const gateId = "runtime_to_review_v1_guarded_live_probe_gate";
const runnerPath = "scripts/run_runtime_to_review_v1_guarded_live_probe.js";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function repoPath(relativePath) {
  const resolved = path.resolve(root, relativePath);
  const relative = path.relative(root, resolved);
  assert(!relative.startsWith("..") && !path.isAbsolute(relative), `Path escapes repository: ${relativePath}`);
  return resolved;
}

function runNode(args, allowFailure = false) {
  try {
    return childProcess.execFileSync(process.execPath, args, {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
  } catch (error) {
    if (allowFailure) return error.stdout.toString();
    throw error;
  }
}

function main() {
  assert(fs.existsSync(repoPath(runnerPath)), "guarded live probe runner missing");
  runNode(["--check", runnerPath]);
  runNode(["--check", "scripts/validate_runtime_to_review_v1_guarded_live_probe_gate.js"]);

  const runner = require(repoPath(runnerPath));
  assert(runner.exactConfirmation === "RUNTIME_TO_REVIEW_V1_ONE_PROVIDER_ONE_IMAGE", "exact confirmation mismatch");
  assert(runner.validatePreflight({ max_images: 1 }).passed === false, "missing delegate and confirmation must fail preflight");
  assert(runner.validatePreflight({
    max_images: 2,
    provider_delegate_module: "scripts/validate_runtime_to_review_v1_guarded_live_probe_gate.js",
    confirm_live_provider_probe: runner.exactConfirmation,
  }).passed === false, "max_images above one must fail preflight");

  const blockedOutput = JSON.parse(runNode([runnerPath], true));
  assert(blockedOutput.status === "blocked_live_probe_not_executed", "runner without exact args must block");
  assert(blockedOutput.real_provider_call_performed === false, "blocked runner must not call provider");
  assert(blockedOutput.secret_value_read_performed_by_runner === false, "blocked runner must not read secrets");

  const preflightOnly = JSON.parse(runNode([runnerPath, "--preflight-only"]));
  assert(preflightOnly.status === "preflight_only_no_live_probe_executed", "preflight-only status mismatch");
  assert(preflightOnly.real_provider_call_performed === false, "preflight-only must not call provider");
  assert(preflightOnly.image_generation_performed === false, "preflight-only must not generate image");

  const packageJson = JSON.parse(fs.readFileSync(repoPath("package.json"), "utf8"));
  const scripts = packageJson.scripts || {};
  assert(scripts["validate:runtime-to-review-default-local"] === "node scripts/validate_runtime_to_review_v1_default_local_gate.js", "default local script missing");
  assert(scripts["validate:runtime-to-review-evidence"] === "node scripts/validate_runtime_to_review_v1_evidence_gate.js", "evidence script missing");
  assert(scripts["validate:runtime-to-review-guarded-live-probe-gate"] === "node scripts/validate_runtime_to_review_v1_guarded_live_probe_gate.js", "live probe gate script missing");
  assert(scripts["runtime-to-review:guarded-live-probe"] === "node scripts/run_runtime_to_review_v1_guarded_live_probe.js", "explicit live probe runner script missing");
  assert(!scripts["validate:runtime-to-review-default-local"].includes("run_runtime_to_review_v1_guarded_live_probe"), "default local validation must not call live probe runner");

  process.stdout.write(`${JSON.stringify({
    passed: true,
    gate_id: gateId,
    mode: "guarded_live_probe_gate_no_live_call",
    exact_confirmation_required: runner.exactConfirmation,
    default_local_excludes_live_probe: true,
    explicit_live_probe_runner_present: true,
    live_probe_executed_by_validator: false,
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
  }, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${JSON.stringify({
    passed: false,
    gate_id: gateId,
    error: error.message,
  }, null, 2)}\n`);
  process.exitCode = 1;
}
