#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const rel = {
  index: "review_console/static_prototype/index.html",
  app: "review_console/static_prototype/app.js",
  mock: "review_console/static_prototype/mock_data.js",
  readme: "review_console/static_prototype/README.md",
  lifecycleReader: "review_console/static_prototype/artifact_lifecycle_state_reader.js",
};

const prohibitedRuntimeApiPatterns = [
  { name: "fetch_call", pattern: /\bfetch\s*\(/ },
  { name: "xml_http_request", pattern: /\bXMLHttpRequest\b/ },
  { name: "send_beacon", pattern: /\bsendBeacon\s*\(/ },
  { name: "local_storage", pattern: /\blocalStorage\b/ },
  { name: "session_storage", pattern: /\bsessionStorage\b/ },
  { name: "indexed_db", pattern: /\bindexedDB\b/ },
  { name: "web_socket", pattern: /\bWebSocket\b/ },
  { name: "event_source", pattern: /\bEventSource\b/ },
  { name: "service_worker", pattern: /\bserviceWorker\b/ },
];

const forbiddenTrueKeyExact = new Set([
  "api_called",
  "daily_note_called",
  "disk_write_performed",
  "image_file_created",
  "vcp_plugin_called",
]);

const forbiddenTrueKeyPatterns = [
  /_performed$/,
  /_called$/,
  /_executed$/,
  /_loaded_or_rendered$/,
  /_write_allowed_now$/,
  /_write_allowed$/,
  /_write_ready$/,
];

function filePath(file) {
  return path.join(root, file);
}

function readText(file) {
  return fs.readFileSync(filePath(file), "utf8");
}

function loadMock() {
  const sandbox = { window: {} };
  vm.runInNewContext(readText(rel.mock), sandbox, { filename: rel.mock, timeout: 1000 });
  return sandbox.window.REVIEW_CONSOLE_MOCK;
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function shouldBeFalseKey(key) {
  return forbiddenTrueKeyExact.has(key) || forbiddenTrueKeyPatterns.some((pattern) => pattern.test(key));
}

function collectForbiddenTrueFlags(value, currentPath = "$", findings = []) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => collectForbiddenTrueFlags(item, `${currentPath}[${index}]`, findings));
    return findings;
  }
  if (!isPlainObject(value)) return findings;

  for (const [key, child] of Object.entries(value)) {
    const childPath = `${currentPath}.${key}`;
    if (child === true && shouldBeFalseKey(key)) {
      findings.push({ path: childPath, key });
    }
    collectForbiddenTrueFlags(child, childPath, findings);
  }
  return findings;
}

function findRuntimeApiHits(text, source) {
  return prohibitedRuntimeApiPatterns
    .filter(({ pattern }) => pattern.test(text))
    .map(({ name }) => ({ source, api: name }));
}

const checks = [];
function add(check, passed, detail = null) {
  checks.push({ check, passed: Boolean(passed), ...(detail === null ? {} : { detail }) });
}

for (const file of Object.values(rel)) {
  add(`file_exists:${file}`, fs.existsSync(filePath(file)) && fs.statSync(filePath(file)).isFile());
}

const index = readText(rel.index);
const app = readText(rel.app);
const mockSource = readText(rel.mock);
const readme = readText(rel.readme);
const lifecycleReader = readText(rel.lifecycleReader);
const mock = loadMock();

add("mock_loaded_from_window_review_console_mock", isPlainObject(mock));
add("index_declares_dry_run_only", index.includes("Dry-run only"));
add("app_uses_static_mock_seed", app.includes("window.REVIEW_CONSOLE_MOCK"));
add("readme_declares_static_mock_boundary", /static|prototype|mock/i.test(readme) && readme.includes("DailyNote") && readme.includes("VCP memory"));
add("import_reader_declares_browser_memory_only", app.includes("browser memory only") && app.includes("No fetch, file write, provider, plugin, API, DailyNote, or VCP memory"));

add("archive_buttons_are_dataset_controls", index.includes('data-archive="accepted"') && index.includes('data-archive="candidate"') && app.includes('setArchiveStatus(button.dataset.archive)'));
add("memory_buttons_are_dataset_controls", index.includes('data-memory="approved"') && index.includes('data-memory="pending"') && app.includes('setMemoryStatus(button.dataset.memory)'));

const runtimeApiHits = [
  ...findRuntimeApiHits(index, rel.index),
  ...findRuntimeApiHits(app, rel.app),
  ...findRuntimeApiHits(mockSource, rel.mock),
  ...findRuntimeApiHits(lifecycleReader, rel.lifecycleReader),
];
add("no_network_or_browser_persistence_api_in_static_runtime", runtimeApiHits.length === 0, runtimeApiHits);

const mockForbiddenTrueFlags = collectForbiddenTrueFlags(mock);
add("mock_side_effect_flags_false", mockForbiddenTrueFlags.length === 0, mockForbiddenTrueFlags.slice(0, 25));

add("static_import_reader_guard_false", [
  "fetch_performed: false",
  "file_write_performed: false",
  "provider_contact_performed: false",
  "plugin_call_performed: false",
  "api_call_performed: false",
  "DailyNote_write_performed: false",
  "vcp_memory_write_performed: false",
].every((token) => app.includes(token)));

add("prototype_guard_blocks_real_actions", [
  "api_called: false",
  "daily_note_called: false",
  "vcp_plugin_called: false",
  "disk_write_performed: false",
  "image_file_created: false",
].every((token) => app.includes(token)));

add("lifecycle_reader_forbidden_guard_fields_present", [
  "fetch_performed",
  "file_write_performed",
  "provider_contact_performed",
  "plugin_call_performed",
  "api_call_performed",
  "DailyNote_write_performed",
  "VCP_memory_write_performed",
  "accepted_samples_write_performed",
  "failure_samples_write_performed",
  "production_candidate_write_performed",
  "real_manifest_read_performed",
  "real_vcpchat_read_performed",
  "real_vcptoolbox_read_performed",
  "push_tag_release_deploy_performed",
].every((token) => lifecycleReader.includes(token)));

const failed = checks.filter((check) => !check.passed);
const output = {
  validator: "validate_review_console_static_mock_boundary",
  phase: "v0_6_84_review_console_static_mock_boundary_validator",
  passed: failed.length === 0,
  status: failed.length === 0 ? "review_console_static_mock_boundary_verified" : "review_console_static_mock_boundary_failed",
  static_mock_only: true,
  browser_runtime_executed: false,
  network_or_persistence_api_count: runtimeApiHits.length,
  mock_forbidden_true_flag_count: mockForbiddenTrueFlags.length,
  checked_files: rel,
  side_effects: {
    fetch_performed: false,
    file_write_performed: false,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false,
    accepted_samples_write_performed: false,
    failure_samples_write_performed: false,
    production_candidate_write_performed: false,
    browser_runtime_validator_executed: false,
  },
  check_count: checks.length,
  failed_count: failed.length,
  checks,
  failures: failed,
};

console.log(JSON.stringify(output, null, 2));
process.exit(output.passed ? 0 : 1);
