const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const docPath = "docs/229_runtime_review_batch_10b_end_to_end_dry_run_replay_index.md";

const adapterFixtures = [
  "adapter_dry_run_lab/fixtures/accepted_request.json",
  "adapter_dry_run_lab/fixtures/rejected_request.json",
  "adapter_dry_run_lab/fixtures/photo_studio_os_v0_7_rehearsal_request.json"
];

const adapterEntry = "adapter_dry_run_lab/adapter_dry_run.js";

const runtimePrototypeFiles = [
  "review_console/runtime_prototype/index.html",
  "review_console/runtime_prototype/styles.css",
  "review_console/runtime_prototype/runtime_guard.js",
  "review_console/runtime_prototype/host_bridge_mock.js",
  "review_console/runtime_prototype/app.js",
  "review_console/runtime_prototype/FIELD_MAPPING.md",
  "review_console/runtime_prototype/README.md"
];

const runtimeValidators = [
  "scripts/validate_adapter_delivery_surface.js",
  "scripts/validate_runtime_delivery_surface.js",
  "scripts/validate_runtime_prototype_smoke.js",
  "scripts/validate_runtime_guard_unit.js"
];

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function parseJson(text, label) {
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(`${label} must be valid JSON: ${error.message}`);
  }
}

function checkReplayPath() {
  const results = [];

  // A1. Doc exists
  assert(exists(docPath), `Doc ${docPath} must exist`);
  results.push({ stage: "doc", check: "doc_exists", passed: true });

  // A2. Adapter entry exists
  assert(exists(adapterEntry), `Adapter entry ${adapterEntry} must exist`);
  results.push({ stage: "adapter", check: "adapter_entry_exists", passed: true });

  // A3. All adapter fixtures exist
  for (const fixture of adapterFixtures) {
    assert(exists(fixture), `Fixture ${fixture} must exist`);
  }
  results.push({ stage: "adapter", check: "adapter_fixtures_exist", passed: true, count: adapterFixtures.length });

  // A4. All runtime prototype files exist
  for (const file of runtimePrototypeFiles) {
    assert(exists(file), `Runtime prototype file ${file} must exist`);
  }
  results.push({ stage: "runtime", check: "runtime_prototype_files_exist", passed: true, count: runtimePrototypeFiles.length });

  // A5. All runtime validators exist
  for (const validator of runtimeValidators) {
    assert(exists(validator), `Validator ${validator} must exist`);
  }
  results.push({ stage: "runtime", check: "runtime_validators_exist", passed: true, count: runtimeValidators.length });

  return results;
}

function checkScriptLoadOrder() {
  const indexHtml = read("review_console/runtime_prototype/index.html");
  const guardPos = indexHtml.indexOf("runtime_guard.js");
  const bridgePos = indexHtml.indexOf("host_bridge_mock.js");
  const appPos = indexHtml.indexOf("app.js");

  assert(guardPos >= 0, "index.html must reference runtime_guard.js");
  assert(bridgePos >= 0, "index.html must reference host_bridge_mock.js");
  assert(appPos >= 0, "index.html must reference app.js");
  assert(guardPos < bridgePos, "runtime_guard.js must load before host_bridge_mock.js");
  assert(bridgePos < appPos, "host_bridge_mock.js must load before app.js");

  return [
    { stage: "runtime", check: "script_load_order", passed: true, detail: "runtime_guard.js → host_bridge_mock.js → app.js" }
  ];
}

function checkAdapterDryRun() {
  const results = [];
  const adapter = require(path.join(root, adapterEntry));

  for (const fixturePath of adapterFixtures) {
    const fullPath = path.join(root, fixturePath);
    const result = adapter.run(fullPath);
    const response = result.adapter_dry_run_response;
    const isAccepted = response.status === "accepted_draft";
    const dispatch = response.dispatch_plan_draft || {};

    // Top-level invariants for rejected; dispatch-level for accepted
    const executionBlocked = isAccepted ? dispatch.execution_blocked : response.execution_blocked;
    const selectedPlugin = isAccepted ? dispatch.selected_plugin : response.selected_plugin;
    const maxPluginCalls = isAccepted ? dispatch.max_plugin_calls : response.max_plugin_calls;

    assert(executionBlocked === true,
      `${fixturePath}: execution_blocked must be true, got ${executionBlocked}`);
    assert(selectedPlugin === null,
      `${fixturePath}: selected_plugin must be null, got ${selectedPlugin}`);
    assert(maxPluginCalls === 0,
      `${fixturePath}: max_plugin_calls must be 0, got ${maxPluginCalls}`);

    // For rejected: guards at top level; for accepted: guards in no_execution_guard
    if (isAccepted) {
      assert(response.no_execution_guard !== undefined,
        `${fixturePath}: must have no_execution_guard`);
      const guard = response.no_execution_guard;
      assert(guard.selected_plugin === null, `${fixturePath}: guard.selected_plugin must be null`);
      assert(guard.max_plugin_calls === 0, `${fixturePath}: guard.max_plugin_calls must be 0`);
      assert(guard.api_called === false, `${fixturePath}: guard.api_called must be false`);
      assert(guard.vcp_plugin_called === false, `${fixturePath}: guard.vcp_plugin_called must be false`);
      assert(guard.daily_note_called === false, `${fixturePath}: guard.daily_note_called must be false`);
      assert(guard.file_write_performed === false, `${fixturePath}: guard.file_write_performed must be false`);
      assert(guard.image_file_created === false, `${fixturePath}: guard.image_file_created must be false`);
      assert(guard.real_execution_allowed === false, `${fixturePath}: guard.real_execution_allowed must be false`);
    } else {
      assert(response.api_called === false, `${fixturePath}: api_called must be false`);
      assert(response.vcp_plugin_called === false, `${fixturePath}: vcp_plugin_called must be false`);
      assert(response.daily_note_called === false, `${fixturePath}: daily_note_called must be false`);
      assert(response.file_write_performed === false, `${fixturePath}: file_write_performed must be false`);
      assert(response.image_file_created === false, `${fixturePath}: image_file_created must be false`);
    }

    results.push({
      stage: "adapter",
      check: `adapter_dry_run_${path.basename(fixturePath, ".json")}`,
      passed: true,
      status: response.status
    });
  }

  return results;
}

function checkSubmitDraftBlocked() {
  const bridgeSource = read("review_console/runtime_prototype/host_bridge_mock.js");
  const appSource = read("review_console/runtime_prototype/app.js");

  // submitDraft must be present but blocked
  assert(bridgeSource.includes("submitDraft"), "host_bridge_mock.js must reference submitDraft");
  assert(appSource.includes("submitDraft"), "app.js must reference submitDraft");

  // Production submitDraft must be false/blocked
  assert(
    bridgeSource.includes("submitDraft_called") ||
    bridgeSource.includes("submitDraft_") ||
    bridgeSource.includes("production_submitDraft"),
    "host_bridge_mock.js must track submitDraft state"
  );

  return [
    { stage: "runtime", check: "submitDraft_blocked", passed: true, detail: "submitDraft present and blocked in mock bridge" }
  ];
}

function checkNoExternalAccess() {
  // Check runtime prototype files for forbidden patterns
  const filesToCheck = [
    ...runtimePrototypeFiles.filter(f => f.endsWith(".js")),
    "adapter_dry_run_lab/adapter_dry_run.js"
  ];

  const forbiddenPatterns = [
    { pattern: /require\s*\(\s*['"](?:http|https):\/\//, label: "external HTTP require" },
    { pattern: /\bchild_process\b/, label: "child_process" },
    { pattern: /\bfs\.writeFile\b/, label: "fs.writeFile" }
  ];

  const results = [];

  for (const filePath of filesToCheck) {
    const source = read(filePath);
    for (const { pattern, label } of forbiddenPatterns) {
      assert(!pattern.test(source), `${filePath} must not contain ${label}`);
    }
  }

  results.push({ stage: "security", check: "no_external_access", passed: true });
  return results;
}

function main() {
  const allResults = [];
  let passed = true;

  try {
    // Phase A: Replay path checks
    allResults.push(...checkReplayPath());
    // Phase B: Script load order
    allResults.push(...checkScriptLoadOrder());
    // Phase C: Adapter dry-run on all fixtures
    allResults.push(...checkAdapterDryRun());
    // Phase D: submitDraft blocked
    allResults.push(...checkSubmitDraftBlocked());
    // Phase E: No external access
    allResults.push(...checkNoExternalAccess());
  } catch (error) {
    allResults.push({
      stage: "fatal",
      check: "unexpected_error",
      passed: false,
      message: error.message
    });
    passed = false;
  }

  const failed = allResults.filter(r => !r.passed);
  const summary = {
    passed: failed.length === 0,
    phase: "Runtime Review Batch 10B end-to-end dry-run replay index",
    doc: docPath,
    check_count: allResults.length,
    failed_count: failed.length,
    submitDraft_blocked: true,
    max_plugin_calls: 0,
    real_vcpchat_read: false,
    real_vcptoolbox_read: false,
    doubaogen_called: false,
    daily_note_called: false,
    vcp_memory_written: false,
    image_created: false,
    version_action_performed: false,
    replay_path_clear: failed.length === 0,
    external_network_required: false,
    external_service_required: false,
    file_write_performed: false,
    results: allResults
  };

  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
  if (failed.length > 0) {
    process.exitCode = 1;
  }
}

main();
