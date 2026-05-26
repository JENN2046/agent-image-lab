#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");

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

function readText(file) {
  return fs.readFileSync(relPath(file), "utf8");
}

function run(command, args, options = {}) {
  return execFileSync(command, args, {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    timeout: options.timeout || 10000,
  });
}

function nodeCheck(file) {
  run(process.execPath, ["--check", file]);
  return true;
}

function fileExists(file) {
  try {
    return fs.statSync(relPath(file)).isFile();
  } catch (_error) {
    return false;
  }
}

function requireModule(file) {
  require(relPath(file));
  return true;
}

function safeCheck(name, fn) {
  try {
    add(name, fn());
  } catch (error) {
    add(name, false, error.message);
  }
}

safeCheck("package_json_parseable", () => {
  const pkg = JSON.parse(readText("package.json"));
  return pkg.name === "agent-image-lab" && pkg.type === "commonjs";
});

[
  "package.json",
  "scripts/create_preview_capsule.js",
  "scripts/validate_preview_capsule.js",
  "scripts/serve_review_console_static.js",
  "scripts/agent_image_lab_read_only_adapter.js",
  "scripts/run_native_doubao_image_generation.js",
  "scripts/run_exact_a5_provider_execution_packet.js",
  "scripts/validate_exact_a5_provider_execution_activation_receipt.js",
  "adapters/image_generation/native_doubao_adapter.js",
  "adapters/runtime/review_bridge_readonly_stub.js",
  "adapters/runtime/durable_audit_store.js",
  "adapters/runtime/provider_preflight_no_provider_call.js",
  "adapters/runtime/exact_a5_provider_execution_packet_draft.js",
  "plugins/image_generation/native_doubao_image/native_doubao_image.js",
  "review_console/static_prototype/index.html",
  "review_console/static_prototype/app.js",
  "review_console/static_prototype/mock_data.js",
].forEach((file) => {
  safeCheck(`file_exists:${file}`, () => fileExists(file));
});

[
  "scripts/create_preview_capsule.js",
  "scripts/agent_image_lab_read_only_adapter.js",
  "scripts/run_native_doubao_image_generation.js",
  "scripts/run_exact_a5_provider_execution_packet.js",
  "scripts/serve_review_console_static.js",
  "adapters/image_generation/native_doubao_adapter.js",
  "adapters/runtime/review_bridge_readonly_stub.js",
  "adapters/runtime/durable_audit_store.js",
  "adapters/runtime/provider_preflight_no_provider_call.js",
  "adapters/runtime/exact_a5_provider_execution_packet_draft.js",
].forEach((file) => {
  safeCheck(`core_js_require:${file}`, () => requireModule(file));
});

safeCheck("review_console_app_node_check", () => nodeCheck("review_console/static_prototype/app.js"));
safeCheck("static_server_node_check", () => nodeCheck("scripts/serve_review_console_static.js"));

safeCheck("static_server_path_traversal_guard", () => {
  const server = require(relPath("scripts/serve_review_console_static.js"));
  const normal = server.resolveRequestPath("/");
  const traversal = server.resolveRequestPath("/..%2Fpackage.json");
  const encodedTraversal = server.resolveRequestPath("/%2e%2e/package.json");
  return Boolean(normal.filePath) && traversal.errorStatus === 403 && encodedTraversal.errorStatus === 403;
});

safeCheck("env_local_not_git_tracked", () => {
  const tracked = run("git", ["ls-files", "--", ".env.local"]).trim();
  return tracked.length === 0;
});

safeCheck("runs_ignore_rules_block_new_image_binaries", () => {
  const ignored = run("git", ["check-ignore", "--no-index", "runs/real_generation/example/out.png"]).trim();
  return ignored === "runs/real_generation/example/out.png";
});

const failed = checks.filter((check) => !check.passed);
const output = {
  passed: failed.length === 0,
  validator: "validate_smoke",
  check_count: checks.length,
  failed_count: failed.length,
  provider_contact_performed: false,
  secret_value_read_performed: false,
  image_generation_performed: false,
  checks,
};

process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
process.exit(output.passed ? 0 : 1);
