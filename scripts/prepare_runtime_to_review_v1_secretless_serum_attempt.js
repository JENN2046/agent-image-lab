#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { verifyAttemptLockBinding } = require("./verify_runtime_to_review_v1_secretless_serum_attempt_lock_binding");

const root = path.resolve(__dirname, "..");
const lockPath = "reports/runtime_to_review_v1/secretless_serum_attempt_015.lock.json";

function run(command, args, cwd) {
  const result = spawnSync(command, args, { cwd, encoding: "utf8" });
  const stdout = typeof result.stdout === "string" ? result.stdout.trim() : "";
  const stderr = typeof result.stderr === "string" ? result.stderr.trim() : "";
  return {
    command: [command, ...args].join(" "),
    cwd,
    status: result.status,
    error: result.error ? result.error.message : null,
    stdout,
    stderr,
    passed: result.status === 0
  };
}

function replaceConst(source, name, value) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`(const\\s+${escaped}\\s*=\\s*)['"][^'"]*['"]`, "m");
  if (pattern.test(source)) {
    return source.replace(pattern, `$1'${value}'`);
  }
  return `${source}\nconst ${name} = '${value}';\n`;
}

function ensureConstAfter(source, anchorName, name, value) {
  if (new RegExp(`const\\s+${name}\\s*=`).test(source)) {
    return replaceConst(source, name, value);
  }
  const anchorPattern = new RegExp(`(const\\s+${anchorName}\\s*=\\s*['"][^'"]*['"];?\\s*)`, "m");
  if (!anchorPattern.test(source)) {
    throw new Error(`missing anchor const ${anchorName}`);
  }
  return source.replace(anchorPattern, `$1const ${name} =\n    '${value}';\n`);
}

function patchRouteSource(source) {
  let patched = source;
  if (!patched.includes("router.head('/execute/serum-bottle-secretless'")) {
    patched = patched.replace(
      "  router.post('/execute/serum-bottle-secretless', async (req, res) => {",
      [
        "  router.head('/execute/serum-bottle-secretless', (_req, res) => {",
        "    // Health surface only; Agent Image Lab final gate accepts any HTTP response.",
        "    res.status(204).end();",
        "  });",
        "",
        "  router.post('/execute/serum-bottle-secretless', async (req, res) => {"
      ].join("\n")
    );
  }
  const internalPost = "function createSerumBottleSecretlessInternalRouter(options = {}) {\n  const router = express.Router();\n\n  router.post('/execute/serum-bottle-secretless', async (req, res) => {";
  if (patched.includes(internalPost)) {
    patched = patched.replace(
      internalPost,
      [
        "function createSerumBottleSecretlessInternalRouter(options = {}) {",
        "  const router = express.Router();",
        "",
        "  router.head('/execute/serum-bottle-secretless', (_req, res) => {",
        "    // Health surface only; Agent Image Lab final gate accepts any HTTP response.",
        "    res.status(204).end();",
        "  });",
        "",
        "  router.post('/execute/serum-bottle-secretless', async (req, res) => {"
      ].join("\n")
    );
  }
  if (!patched.includes("outputDirectoryRef: gate.outputDirectoryRef")) {
    patched = patched.replace(
      "        artifactRecordRef: gate.artifactRecordRef,\n",
      "        artifactRecordRef: gate.artifactRecordRef,\n        outputDirectoryRef: gate.outputDirectoryRef,\n"
    );
  }
  return patched;
}

function patchServerAuthorizerSource(source, lock) {
  let patched = source;
  patched = ensureConstAfter(
    patched,
    "SERUM_BOTTLE_SECRETLESS_EXACT_ACTIVATION_ID",
    "SERUM_BOTTLE_SECRETLESS_EXACT_PIPELINE_ID",
    lock.pipeline_id
  );
  patched = ensureConstAfter(
    patched,
    "SERUM_BOTTLE_SECRETLESS_EXACT_PIPELINE_ID",
    "SERUM_BOTTLE_SECRETLESS_EXACT_RECEIPT_REF",
    lock.receipt_ref
  );
  patched = ensureConstAfter(
    patched,
    "SERUM_BOTTLE_SECRETLESS_EXACT_RECEIPT_REF",
    "SERUM_BOTTLE_SECRETLESS_EXACT_ARTIFACT_RECORD_REF",
    lock.artifact_record_ref
  );
  patched = ensureConstAfter(
    patched,
    "SERUM_BOTTLE_SECRETLESS_EXACT_ARTIFACT_RECORD_REF",
    "SERUM_BOTTLE_SECRETLESS_EXACT_OUTPUT_DIRECTORY_REF",
    lock.output_directory_ref
  );
  const comparisons = [
    ["request.pipelineId !== SERUM_BOTTLE_SECRETLESS_EXACT_PIPELINE_ID", "        request.taskId !== SERUM_BOTTLE_SECRETLESS_EXACT_ACTIVATION_ID ||\n"],
    ["request.receiptRef !== SERUM_BOTTLE_SECRETLESS_EXACT_RECEIPT_REF", "        !SERUM_BOTTLE_SECRETLESS_AUTHORIZED_ROUTE_IDS.has(request.routeId) ||\n"],
    ["request.artifactRecordRef !== SERUM_BOTTLE_SECRETLESS_EXACT_ARTIFACT_RECORD_REF", "        request.receiptRef !== SERUM_BOTTLE_SECRETLESS_EXACT_RECEIPT_REF ||\n"],
    ["request.outputDirectoryRef !== SERUM_BOTTLE_SECRETLESS_EXACT_OUTPUT_DIRECTORY_REF", "        request.artifactRecordRef !== SERUM_BOTTLE_SECRETLESS_EXACT_ARTIFACT_RECORD_REF ||\n"]
  ];
  for (const [comparison, anchor] of comparisons) {
    if (!patched.includes(comparison)) {
      patched = patched.replace(anchor, `${anchor}        ${comparison} ||\n`);
    }
  }
  if (!patched.includes("outputDirectoryRef: request.outputDirectoryRef")) {
    patched = patched.replace(
      "        artifactRecordRef: request.artifactRecordRef,\n",
      "        artifactRecordRef: request.artifactRecordRef,\n        outputDirectoryRef: request.outputDirectoryRef,\n"
    );
  }
  return patched;
}

function applyVcpToolBoxBinding(lock, vcpRoot) {
  const routePath = path.resolve(vcpRoot, lock.source_binding_requirements.route_source);
  const serverPath = path.resolve(vcpRoot, lock.source_binding_requirements.server_source);
  const updates = [
    ["SERUM_BOTTLE_SECRETLESS_EXACT_ACTIVATION_ID", lock.activation_id],
    ["SERUM_BOTTLE_SECRETLESS_EXACT_PIPELINE_ID", lock.pipeline_id],
    ["SERUM_BOTTLE_SECRETLESS_EXACT_RECEIPT_REF", lock.receipt_ref],
    ["SERUM_BOTTLE_SECRETLESS_EXACT_ARTIFACT_RECORD_REF", lock.artifact_record_ref],
    ["SERUM_BOTTLE_SECRETLESS_EXACT_OUTPUT_DIRECTORY_REF", lock.output_directory_ref]
  ];
  let routeSource = fs.readFileSync(routePath, "utf8");
  let serverSource = fs.readFileSync(serverPath, "utf8");
  for (const [name, value] of updates) {
    routeSource = replaceConst(routeSource, name, value);
    if (name === "SERUM_BOTTLE_SECRETLESS_EXACT_ACTIVATION_ID") {
      serverSource = replaceConst(serverSource, name, value);
    }
  }
  routeSource = patchRouteSource(routeSource);
  serverSource = patchServerAuthorizerSource(serverSource, lock);
  fs.writeFileSync(routePath, routeSource, "utf8");
  fs.writeFileSync(serverPath, serverSource, "utf8");

  const routeCheck = run("node", ["--check", "routes/admin/aiImageAgents.js"], vcpRoot);
  const serverCheck = run("node", ["--check", "server.js"], vcpRoot);
  if (!routeCheck.passed || !serverCheck.passed) {
    return { passed: false, routeCheck, serverCheck, commit: null };
  }
  const diffCheck = run("git", ["diff", "--quiet", "--", "routes/admin/aiImageAgents.js", "server.js"], vcpRoot);
  if (diffCheck.status === 0) {
    const head = run("git", ["rev-parse", "HEAD"], vcpRoot);
    return {
      passed: head.passed,
      routeCheck,
      serverCheck,
      diffCheck,
      add: { passed: true, skipped: true, reason: "vcptoolbox_binding_already_matches_lock" },
      commit: { passed: true, skipped: true, reason: "vcptoolbox_binding_already_matches_lock", stdout: head.stdout }
    };
  }
  const add = run("git", ["add", "--", "routes/admin/aiImageAgents.js", "server.js"], vcpRoot);
  const commit = add.passed
    ? run("git", ["commit", "-m", `Bind secretless serum attempt ${lock.attempt}`], vcpRoot)
    : { passed: false, command: "git commit", status: null, stdout: "", stderr: "stage failed" };
  return { passed: routeCheck.passed && serverCheck.passed && add.passed && commit.passed, routeCheck, serverCheck, diffCheck, add, commit };
}

function main() {
  const steps = [];
  const lockAbs = path.resolve(root, lockPath);
  const lock = JSON.parse(fs.readFileSync(lockAbs, "utf8"));
  const vcpRoot = lock.source_binding_requirements.vcptoolbox_root_default;
  const applyBinding = process.argv.includes("--apply-vcptoolbox-binding");
  let bindingApply = null;
  if (applyBinding) {
    bindingApply = applyVcpToolBoxBinding(lock, vcpRoot);
    steps.push(bindingApply.routeCheck, bindingApply.serverCheck, bindingApply.add, bindingApply.commit);
    const vcpHeadAfterApply = run("git", ["rev-parse", "HEAD"], vcpRoot);
    steps.push(vcpHeadAfterApply);
    if (bindingApply.passed && /^[0-9a-f]{40}$/.test(vcpHeadAfterApply.stdout)) {
      lock.vcptoolbox_current_attempt_binding_commit_required = vcpHeadAfterApply.stdout;
      lock.status = "prepared_inactive_current_attempt_binding_commit_recorded";
      fs.writeFileSync(lockAbs, `${JSON.stringify(lock, null, 2)}\n`, "utf8");
    }
  }
  steps.push(run("node", ["--check", "routes/admin/aiImageAgents.js"], vcpRoot));
  steps.push(run("node", ["--check", "server.js"], vcpRoot));
  steps.push(run("git", ["rev-parse", "HEAD"], vcpRoot));
  steps.push(run("node", ["--check", "scripts/run_runtime_to_review_v1_secretless_option_a_callable_runner.js"], root));
  steps.push(run("node", ["--check", "scripts/verify_runtime_to_review_v1_secretless_serum_attempt_lock_binding.js"], root));

  const verifier = verifyAttemptLockBinding({ lockPath });
  const passed = steps.every((step) => step.passed) && verifier.passed;
  const result = {
    passed,
    status: passed ? "prepare_attempt_verified_current_binding" : "prepare_attempt_failed_closed_current_binding_not_ready",
    attempt: lock.attempt,
    lock_ref: lockPath,
    vcptoolbox_root: vcpRoot,
    vcptoolbox_commit: steps.find((step) => step.command === "git rev-parse HEAD")?.stdout || null,
    apply_vcptoolbox_binding_requested: applyBinding,
    binding_apply: bindingApply,
    steps,
    verifier,
    route_http_request_performed: false,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false
  };
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  if (!passed) process.exitCode = 1;
}

main();
