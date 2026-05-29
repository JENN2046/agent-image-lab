#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const validatorId = "runtime_to_review_v1_static_real_entry_viewer";
const htmlPath = "review_console/static_prototype/runtime_v1_real_entry_viewer.html";
const viewerPath = "review_console/static_prototype/runtime_v1_real_entry_viewer.js";
const seedPath = "review_console/static_prototype/runtime_v1_real_entry_session.js";
const adapterPath = "adapters/runtime/review_bridge_runtime_v1_readonly.js";
const fixturePath = "tests/fixtures/runtime_kernel_v1_no_provider_fixture_task.fixture.json";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function repoPath(relativePath) {
  const resolved = path.resolve(root, relativePath);
  const relative = path.relative(root, resolved);
  assert(!relative.startsWith("..") && !path.isAbsolute(relative), `Path escapes repository: ${relativePath}`);
  return resolved;
}

function runNode(args) {
  return childProcess.execFileSync(process.execPath, args, { cwd: root, encoding: "utf8" });
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadSeedSession() {
  const context = {
    window: {},
  };
  context.globalThis = context.window;
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(repoPath(seedPath), "utf8"), context, { filename: seedPath });
  return {
    session: context.window.RUNTIME_V1_REAL_ENTRY_SESSION,
    source: context.window.RUNTIME_V1_REAL_ENTRY_SOURCE,
  };
}

async function buildAdapterSession() {
  const kernel = require(repoPath("kernel/runtime_kernel_v1_real_provider_guarded.js"));
  const adapter = require(repoPath(adapterPath));
  const input = JSON.parse(fs.readFileSync(repoPath(fixturePath), "utf8"));
  const runtimeResult = await kernel.runRuntimeKernelV1(input);
  return adapter.buildRuntimeV1ReadonlyReviewSessionFromRuntimeResult(runtimeResult);
}

function makeFakeDocument() {
  const elements = new Map();
  function element(id) {
    if (!elements.has(id)) elements.set(id, { id, textContent: "", innerHTML: "" });
    return elements.get(id);
  }
  return {
    elements,
    getElementById: element,
  };
}

async function main() {
  [htmlPath, viewerPath, seedPath].forEach((relativePath) => {
    assert(fs.existsSync(repoPath(relativePath)), `${relativePath} missing`);
  });
  runNode(["--check", viewerPath]);
  runNode(["--check", seedPath]);

  const html = fs.readFileSync(repoPath(htmlPath), "utf8");
  assert(html.includes("runtime_v1_real_entry_session.js"), "html must load runtime v1 real-entry seed");
  assert(html.includes("runtime_v1_real_entry_viewer.js"), "html must load runtime v1 real-entry viewer");
  assert(!/<script[^>]+src=["']\.\/mock_data\.js["']/i.test(html), "runtime v1 real-entry viewer must not load mock_data.js");

  const seed = loadSeedSession();
  const viewer = require(repoPath(viewerPath));
  const adapterSession = await buildAdapterSession();

  const validation = viewer.validateRuntimeV1RealEntrySession(seed.session);
  assert(validation.valid === true, `seed session invalid: ${validation.errors.join("; ")}`);
  assert(seed.source.mock_data_js_used === false, "seed must not use mock_data.js");
  assert(seed.source.fetch_performed === false, "seed source must not fetch");
  assert(seed.source.file_write_performed === false, "seed source must not write files");
  assert(seed.source.image_binary_read_performed === false, "seed source must not read image binary");

  [
    "schema",
    "adapter_id",
    "adapter_contract",
    "session_mode",
    "session_id",
    "case_id",
    "task_id",
    "status",
    "current_review_status",
  ].forEach((field) => {
    assert(seed.session[field] === adapterSession[field], `seed.${field} does not match adapter output`);
  });
  Object.keys(adapterSession.display_fields).forEach((field) => {
    assert(seed.session.display_fields[field] === adapterSession.display_fields[field], `display_fields.${field} does not match adapter output`);
  });

  const document = makeFakeDocument();
  const rendered = viewer.renderRuntimeV1RealEntrySession(seed.session, document);
  assert(rendered.valid === true, "rendered view model must be valid");
  assert(document.getElementById("runtimeV1RealEntryStatus").textContent === "readonly_real_session", "status was not rendered");
  assert(document.getElementById("runtimeV1RealEntryFields").innerHTML.includes("runtime_v1_fixture_smoke_001"), "run id was not rendered");
  assert(document.getElementById("runtimeV1RealEntryGuard").innerHTML.includes("image_binary_read_performed"), "guard was not rendered");

  const missing = clone(seed.session);
  delete missing.display_fields.image_sha256;
  assert(viewer.validateRuntimeV1RealEntrySession(missing).valid === false, "missing hash must be blocked");

  const binaryRead = clone(seed.session);
  binaryRead.image_versions[0].image_binary_loaded = true;
  assert(viewer.validateRuntimeV1RealEntrySession(binaryRead).valid === false, "image binary load must be blocked");

  const sideEffect = clone(seed.session);
  sideEffect.guard.provider_contact_performed = true;
  assert(viewer.validateRuntimeV1RealEntrySession(sideEffect).valid === false, "provider side effect must be blocked");

  process.stdout.write(`${JSON.stringify({
    passed: true,
    validator: validatorId,
    html_entry: htmlPath,
    seed_ref: seedPath,
    viewer_ref: viewerPath,
    session_mode: seed.session.session_mode,
    status: seed.session.status,
    source_mode: seed.source.source_mode,
    mock_data_js_used: false,
    fetch_performed: false,
    file_write_performed: false,
    image_binary_read_performed: false,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false,
    accepted_samples_write_performed: false,
    production_candidate_write_performed: false,
    adapter_snapshot_match: true,
    invalid_missing_hash_blocked: true,
    invalid_image_binary_blocked: true,
    invalid_provider_side_effect_blocked: true,
  }, null, 2)}\n`);
}

main().catch((error) => {
  process.stderr.write(`${JSON.stringify({
    passed: false,
    validator: validatorId,
    error: error.message,
  }, null, 2)}\n`);
  process.exitCode = 1;
});
