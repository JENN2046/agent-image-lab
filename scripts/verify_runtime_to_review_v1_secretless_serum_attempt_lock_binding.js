#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const repoRoot = path.resolve(__dirname, "..");
const defaultLockPath = "reports/runtime_to_review_v1/secretless_serum_attempt_015.lock.json";
const defaultVcpToolBoxRoot = "A:\\VCP\\apps\\VCPToolBox";

function repoPath(relativePath) {
  const resolved = path.resolve(repoRoot, relativePath);
  const relative = path.relative(repoRoot, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`path escapes repository: ${relativePath}`);
  }
  return resolved;
}

function readJsonFile(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function sha256Text(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function gitHead(cwd) {
  const result = spawnSync("git", ["rev-parse", "HEAD"], { cwd, encoding: "utf8" });
  if (result.status !== 0) return null;
  return result.stdout.trim();
}

function extractConstString(source, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`const\\s+${escaped}\\s*=\\s*['"]([^'"]+)['"]`, "m");
  const match = source.match(pattern);
  return match ? match[1] : null;
}

function extractRouteBinding(routeSource) {
  return {
    activation_id: extractConstString(routeSource, "SERUM_BOTTLE_SECRETLESS_EXACT_ACTIVATION_ID"),
    pipeline_id: extractConstString(routeSource, "SERUM_BOTTLE_SECRETLESS_EXACT_PIPELINE_ID"),
    receipt_ref: extractConstString(routeSource, "SERUM_BOTTLE_SECRETLESS_EXACT_RECEIPT_REF"),
    artifact_record_ref: extractConstString(routeSource, "SERUM_BOTTLE_SECRETLESS_EXACT_ARTIFACT_RECORD_REF"),
    output_directory_ref: extractConstString(routeSource, "SERUM_BOTTLE_SECRETLESS_EXACT_OUTPUT_DIRECTORY_REF")
  };
}

function extractServerBinding(serverSource) {
  return {
    activation_id: extractConstString(serverSource, "SERUM_BOTTLE_SECRETLESS_EXACT_ACTIVATION_ID"),
    pipeline_id: extractConstString(serverSource, "SERUM_BOTTLE_SECRETLESS_EXACT_PIPELINE_ID"),
    receipt_ref: extractConstString(serverSource, "SERUM_BOTTLE_SECRETLESS_EXACT_RECEIPT_REF"),
    artifact_record_ref: extractConstString(serverSource, "SERUM_BOTTLE_SECRETLESS_EXACT_ARTIFACT_RECORD_REF"),
    output_directory_ref: extractConstString(serverSource, "SERUM_BOTTLE_SECRETLESS_EXACT_OUTPUT_DIRECTORY_REF")
  };
}

function serverBindingIsEnforced(serverSource) {
  const requiredComparisons = [
    "request.activationPackageId !== SERUM_BOTTLE_SECRETLESS_EXACT_ACTIVATION_ID",
    "request.taskId !== SERUM_BOTTLE_SECRETLESS_EXACT_ACTIVATION_ID",
    "request.pipelineId !== SERUM_BOTTLE_SECRETLESS_EXACT_PIPELINE_ID",
    "request.receiptRef !== SERUM_BOTTLE_SECRETLESS_EXACT_RECEIPT_REF",
    "request.artifactRecordRef !== SERUM_BOTTLE_SECRETLESS_EXACT_ARTIFACT_RECORD_REF",
    "request.outputDirectoryRef !== SERUM_BOTTLE_SECRETLESS_EXACT_OUTPUT_DIRECTORY_REF"
  ];
  return requiredComparisons.every((snippet) => serverSource.includes(snippet));
}

function routeBindingIsPassedToAuthorizer(routeSource) {
  return routeSource.includes("outputDirectoryRef: gate.outputDirectoryRef");
}

function internalRouteHeadSurfaceExists(routeSource) {
  const internalRouterStart = routeSource.indexOf("function createSerumBottleSecretlessInternalRouter(options = {})");
  if (internalRouterStart === -1) return false;
  const internalRouterEnd = routeSource.indexOf("// \u2500\u2500 Handler", internalRouterStart);
  const internalRouterSource = internalRouterEnd === -1
    ? routeSource.slice(internalRouterStart)
    : routeSource.slice(internalRouterStart, internalRouterEnd);
  return internalRouterSource.includes("router.head('/execute/serum-bottle-secretless'") &&
    internalRouterSource.includes("router.post('/execute/serum-bottle-secretless'");
}

function expectedBindingFromLock(lock) {
  return {
    activation_id: lock.activation_id,
    pipeline_id: lock.pipeline_id,
    receipt_ref: lock.receipt_ref,
    artifact_record_ref: lock.artifact_record_ref,
    output_directory_ref: lock.output_directory_ref
  };
}

function pathExistsPending(relativePath) {
  const target = repoPath(relativePath);
  return !fs.existsSync(target);
}

function verifyAttemptLockBinding(options = {}) {
  const lockPath = options.lockPath || defaultLockPath;
  const lockAbs = path.isAbsolute(lockPath) ? lockPath : repoPath(lockPath);
  const lockText = fs.readFileSync(lockAbs, "utf8");
  const lock = JSON.parse(lockText);
  const vcpRoot = options.vcpToolBoxRoot || lock.source_binding_requirements?.vcptoolbox_root_default || defaultVcpToolBoxRoot;
  const routeSourceRel = lock.source_binding_requirements?.route_source || "routes/admin/aiImageAgents.js";
  const serverSourceRel = lock.source_binding_requirements?.server_source || "server.js";
  const routeSourcePath = path.resolve(vcpRoot, routeSourceRel);
  const serverSourcePath = path.resolve(vcpRoot, serverSourceRel);
  const checks = [];

  function check(id, ok, detail = {}) {
    checks.push({ check: id, passed: Boolean(ok), ...detail });
  }

  const lockHash = sha256Text(lockText);
  const ailHead = gitHead(repoRoot);
  const vcpHead = fs.existsSync(vcpRoot) ? gitHead(vcpRoot) : null;
  const expected = expectedBindingFromLock(lock);

  check("lock_schema", lock.schema === "runtime_to_review_v1_secretless_serum_attempt_lock.v1", { lock_id: lock.lock_id });
  check("lock_prompt_hash", lock.prompt_sha256 === sha256Text(lock.prompt || ""), { prompt_sha256: lock.prompt_sha256 });
  check("ail_head_matches_lock_or_is_prepare_placeholder",
    lock.agent_image_lab_commit_required === ailHead ||
    (!options.strictCommits && lock.agent_image_lab_commit_required === "resolved_by_prepare_attempt_after_local_commit"),
    { expected: lock.agent_image_lab_commit_required, actual: ailHead });
  check("vcptoolbox_head_matches_current_attempt_binding_commit",
    lock.vcptoolbox_current_attempt_binding_commit_required === vcpHead,
    { expected: lock.vcptoolbox_current_attempt_binding_commit_required, actual: vcpHead });
  check("vcptoolbox_binding_commit_is_not_placeholder",
    /^[0-9a-f]{40}$/.test(String(lock.vcptoolbox_current_attempt_binding_commit_required || "")),
    { value: lock.vcptoolbox_current_attempt_binding_commit_required });

  const routeSource = fs.existsSync(routeSourcePath) ? fs.readFileSync(routeSourcePath, "utf8") : null;
  const serverSource = fs.existsSync(serverSourcePath) ? fs.readFileSync(serverSourcePath, "utf8") : null;
  check("vcptoolbox_route_source_readable", Boolean(routeSource), { route_source: routeSourcePath });
  check("vcptoolbox_server_source_readable", Boolean(serverSource), { server_source: serverSourcePath });

  const routeBinding = routeSource ? extractRouteBinding(routeSource) : {};
  const serverBinding = serverSource ? extractServerBinding(serverSource) : {};
  check("route_passes_output_directory_to_server_authorizer",
    Boolean(routeSource && routeBindingIsPassedToAuthorizer(routeSource)));
  check("internal_route_head_surface_present",
    Boolean(routeSource && internalRouteHeadSurfaceExists(routeSource)));
  check("server_authorizer_enforces_all_attempt_binding_fields",
    Boolean(serverSource && serverBindingIsEnforced(serverSource)));
  for (const [field, expectedValue] of Object.entries(expected)) {
    check(`route_binding_${field}_matches_lock`, routeBinding[field] === expectedValue, {
      expected: expectedValue,
      actual: routeBinding[field] || null
    });
    check(`server_binding_${field}_matches_lock`, serverBinding[field] === expectedValue, {
      expected: expectedValue,
      actual: serverBinding[field] || null
    });
    check(`route_server_${field}_same_attempt`, routeBinding[field] === serverBinding[field], {
      route: routeBinding[field] || null,
      server: serverBinding[field] || null
    });
  }

  check("receipt_path_pending", pathExistsPending(lock.receipt_ref), { receipt_ref: lock.receipt_ref });
  check("artifact_record_path_pending", pathExistsPending(lock.artifact_record_ref), { artifact_record_ref: lock.artifact_record_ref });
  check("output_directory_pending", pathExistsPending(lock.output_directory_ref), { output_directory_ref: lock.output_directory_ref });
  check("no_route_http_authorized_by_lock", lock.authorization_boundary?.route_http_allowed_by_this_lock === false);
  check("separate_exact_activation_required", lock.authorization_boundary?.separate_exact_activation_required === true);

  const passed = checks.every((item) => item.passed);
  return {
    passed,
    ok: passed,
    status: passed ? "attempt_lock_binding_verified" : "attempt_lock_binding_failed_closed",
    lock_id: lock.lock_id,
    attempt: lock.attempt,
    lock_path: path.relative(repoRoot, lockAbs).replace(/\\/g, "/"),
    lock_sha256: lockHash,
    agent_image_lab_head: ailHead,
    vcptoolbox_root: vcpRoot,
    vcptoolbox_head: vcpHead,
    route_binding: routeBinding,
    server_binding: serverBinding,
    expected_binding: expected,
    route_http_request_performed: false,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    checks
  };
}

function parseArgs(argv) {
  const options = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--lock") {
      options.lockPath = argv[index + 1];
      index += 1;
    } else if (arg === "--vcptoolbox-root") {
      options.vcpToolBoxRoot = argv[index + 1];
      index += 1;
    }
  }
  return options;
}

if (require.main === module) {
  try {
    const result = verifyAttemptLockBinding(parseArgs(process.argv.slice(2)));
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    if (!result.passed) process.exitCode = 1;
  } catch (error) {
    process.stdout.write(`${JSON.stringify({
      passed: false,
      ok: false,
      status: "attempt_lock_binding_verifier_unhandled_error_failed_closed",
      error: error instanceof Error ? error.message : String(error),
      route_http_request_performed: false,
      provider_contact_performed: false,
      plugin_call_performed: false,
      api_call_performed: false,
      image_generation_performed: false
    }, null, 2)}\n`);
    process.exitCode = 1;
  }
}

module.exports = {
  defaultLockPath,
  verifyAttemptLockBinding,
  extractRouteBinding,
  extractServerBinding,
  routeBindingIsPassedToAuthorizer,
  serverBindingIsEnforced,
  sha256Text
};
