#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { verifyAttemptLockBinding, sha256Text } = require("./verify_runtime_to_review_v1_secretless_serum_attempt_lock_binding");
const { patchRouteSource, internalRouterSource, routeSectionHasSerumBottleHead } = require("./prepare_runtime_to_review_v1_secretless_serum_attempt");

const root = path.resolve(__dirname, "..");
const validator = "runtime_to_review_v1_secretless_serum_attempt_015_binding_guard";
const lockPath = "reports/runtime_to_review_v1/secretless_serum_attempt_015.lock.json";
const verifierPath = "scripts/verify_runtime_to_review_v1_secretless_serum_attempt_lock_binding.js";
const preparePath = "scripts/prepare_runtime_to_review_v1_secretless_serum_attempt.js";
const runnerPath = "scripts/run_runtime_to_review_v1_secretless_option_a_callable_runner.js";
const packageScriptName = "validate:runtime-to-review-secretless-serum-attempt-015-binding-guard";
const manifestId = "runtime_to_review_secretless_serum_attempt_015_binding_guard";

let passed = true;
const checks = [];

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
    checks.push({ check: id, passed: Boolean(ok) });
    if (!ok) passed = false;
  } catch (error) {
    checks.push({ check: id, passed: false, error: error.message });
    passed = false;
  }
}

function includesAll(values, expected) {
  return Array.isArray(values) && expected.every((value) => values.includes(value));
}

function runNode(args) {
  const result = spawnSync("node", args, { cwd: root, encoding: "utf8" });
  return {
    status: result.status,
    stdout: typeof result.stdout === "string" ? result.stdout.trim() : "",
    stderr: typeof result.stderr === "string" ? result.stderr.trim() : "",
    error: result.error ? result.error.message : null
  };
}

const lock = readJson(lockPath);
const packageJson = readJson("package.json");
const manifest = readJson("scripts/validation_manifest.json");
const verifierSource = fs.readFileSync(repoPath(verifierPath), "utf8");
const runnerSource = fs.readFileSync(repoPath(runnerPath), "utf8");
const prepareSource = fs.readFileSync(repoPath(preparePath), "utf8");
const verifier = verifyAttemptLockBinding({ lockPath });

check("lock_schema_and_attempt_015", () =>
  lock.schema === "runtime_to_review_v1_secretless_serum_attempt_lock.v1" &&
  lock.attempt === "015" &&
  lock.activation_id === "AUTH-SECRETLESS-SERUM-LIVE-PROBE-20260603-015" &&
  lock.pipeline_id === "secretless-serum-live-probe-attempt-015"
);
check("lock_prompt_hash_matches", () => lock.prompt_sha256 === sha256Text(lock.prompt));
check("lock_collects_single_source_of_truth_refs", () =>
  lock.binding_packet.binding_packet_id === "BINDING-DRAFT-SECRETLESS-OPTION-A-SERUM-20260603-015" &&
  lock.receipt_ref.endsWith("attempt_015.json") &&
  lock.artifact_record_ref.endsWith("attempt_015.json") &&
  lock.output_directory_ref.endsWith("attempt_015/") &&
  lock.route.path === "/internal/ai-image-agents/execute/serum-bottle-secretless" &&
  lock.budget.max_provider_calls === 1 &&
  lock.budget.max_plugin_calls === 1 &&
  lock.budget.max_api_calls === 1 &&
  lock.budget.max_images === 1 &&
  lock.budget.retry_allowed === false
);
check("verifier_requires_current_vcptoolbox_binding_or_fails_closed_without_git", () => {
  const sideEffectsBlocked =
    verifier.route_http_request_performed === false &&
    verifier.provider_contact_performed === false &&
    verifier.plugin_call_performed === false &&
    verifier.api_call_performed === false &&
    verifier.image_generation_performed === false;
  if (!sideEffectsBlocked) return false;
  if (verifier.passed === true) {
    return verifier.status === "attempt_lock_binding_verified" &&
      verifier.vcptoolbox_head === lock.vcptoolbox_current_attempt_binding_commit_required;
  }
  return verifier.status === "attempt_lock_binding_failed_closed";
});
check("verifier_checks_route_and_server_binding_fields", () =>
  includesAll(verifier.checks.map((item) => item.check), [
    "route_passes_output_directory_to_server_authorizer",
    "internal_route_head_surface_present",
    "server_authorizer_enforces_all_attempt_binding_fields",
    "route_binding_activation_id_matches_lock",
    "server_binding_activation_id_matches_lock",
    "route_binding_pipeline_id_matches_lock",
    "server_binding_pipeline_id_matches_lock",
    "route_binding_receipt_ref_matches_lock",
    "server_binding_receipt_ref_matches_lock",
    "route_binding_artifact_record_ref_matches_lock",
    "server_binding_artifact_record_ref_matches_lock",
    "route_binding_output_directory_ref_matches_lock",
    "server_binding_output_directory_ref_matches_lock"
  ])
);
check("runner_has_attempt_015_flag_and_final_gate", () =>
  runnerSource.includes("exactRouteHttpActivationPackageIdAttempt015") &&
  runnerSource.includes("--attempt-015-route-http") &&
  runnerSource.includes("verifyAttemptLockBinding") &&
  runnerSource.includes("secretless_option_a_final_gate_failed_closed_before_post") &&
  runnerSource.includes("secretless_option_a_final_gate_failed_closed_lock_authorization_boundary")
);
check("runner_final_gate_listener_probe_does_not_spend_route_request", () =>
  runnerSource.includes("probeTcpListener(validation.route_http_url)") &&
  runnerSource.includes("tcp_listener_probe_observed_no_route_http_request") &&
  runnerSource.includes("route_http_request_performed: false") &&
  !runnerSource.includes("fetch(validation.route_http_url, { method: \"HEAD\" })") &&
  !runnerSource.includes("fetch(validation.route_http_url, { method: 'HEAD' })")
);
check("runner_final_gate_enforces_lock_authorization_boundary", () => {
  const result = runNode([
    runnerPath,
    "--attempt-015-route-http",
    "--confirm-route-http",
    "--confirmation-phrase",
    "RUNTIME_TO_REVIEW_V1_SECRETLESS_SERUM_BOTTLE_ONE_PROVIDER_ONE_IMAGE"
  ]);
  if (result.status === 0 || !result.stdout) return false;
  const output = JSON.parse(result.stdout);
  return output.status === "secretless_option_a_final_gate_failed_closed_lock_authorization_boundary" &&
    output.result?.lock_authorization?.passed === false &&
    output.result?.listener?.status === "not_checked" &&
    output.route_http_request_performed === false &&
    output.provider_contact_performed === false &&
    output.plugin_call_performed === false &&
    output.api_call_performed === false &&
    output.image_generation_performed === false;
});
check("prepare_script_is_single_command_guarded", () =>
  fs.existsSync(repoPath(preparePath)) &&
  prepareSource.includes("prepare_attempt_failed_closed_current_binding_not_ready") &&
  prepareSource.includes("--apply-vcptoolbox-binding") &&
  prepareSource.includes("routes/admin/aiImageAgents.js") &&
  prepareSource.includes("server.js")
);
check("prepare_apply_is_idempotent_when_binding_already_matches_lock", () =>
  prepareSource.includes("\"diff\", [\"--quiet\"") ||
  (
    prepareSource.includes("\"diff\"") &&
    prepareSource.includes("\"--quiet\"") &&
    prepareSource.includes("vcptoolbox_binding_already_matches_lock")
  )
);
check("prepare_scopes_internal_head_surface_independently", () => {
  const sourceWithAdminHeadOnly = [
    "function createAiImageAgentsAdminRouter() {",
    "  const router = express.Router();",
    "",
    "  router.head('/execute/serum-bottle-secretless', (_req, res) => {",
    "    res.status(204).end();",
    "  });",
    "",
    "  router.post('/execute/serum-bottle-secretless', async (req, res) => {",
    "    res.json({ ok: true });",
    "  });",
    "}",
    "",
    "function createSerumBottleSecretlessInternalRouter(options = {}) {",
    "  const router = express.Router();",
    "",
    "  router.post('/execute/serum-bottle-secretless', async (req, res) => {",
    "    res.json({ ok: true });",
    "  });",
    "}",
    "",
    "// \u2500\u2500 Handler"
  ].join("\n");
  const patched = patchRouteSource(sourceWithAdminHeadOnly);
  const internal = internalRouterSource(patched);
  return routeSectionHasSerumBottleHead(internal) &&
    (patched.match(/router.head\('\/execute\/serum-bottle-secretless'/g) || []).length === 2 &&
    !prepareSource.includes("if (!patched.includes(\"router.head('/execute/serum-bottle-secretless'\"))");
});
check("package_script_registered", () =>
  packageJson.scripts[packageScriptName] === `node ${repoPath(manifestId).includes(":") ? "" : ""}${"scripts/validate_runtime_to_review_v1_secretless_serum_attempt_015_binding_guard.js"}`
);
check("manifest_entry_registered", () => {
  const entry = manifest.validators.find((item) => item.id === manifestId);
  return entry &&
    entry.command === `npm run ${packageScriptName}` &&
    entry.script === "scripts/validate_runtime_to_review_v1_secretless_serum_attempt_015_binding_guard.js" &&
    includesAll(entry.trigger_paths, [
      lockPath,
      verifierPath,
      preparePath,
      runnerPath,
      "package.json",
      "scripts/validation_manifest.json"
    ]);
});

process.stdout.write(`${JSON.stringify({
  passed,
  validator,
  lock_ref: lockPath,
  verifier_status: verifier.status,
  vcptoolbox_head: verifier.vcptoolbox_head,
  route_binding: verifier.route_binding,
  server_binding: verifier.server_binding,
  route_http_request_performed: false,
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  image_generation_performed: false,
  checks
}, null, 2)}\n`);

if (!passed) process.exitCode = 1;
