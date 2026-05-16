const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const scanFixturePath = "tests/schema_examples/review_console_blocker_arbiter_boundary_scan.example.json";
const expectedPhase = "v14_057_review_console_blocker_arbiter_boundary_scan_gate";
const expectedSourcePhase = "v14_056_review_console_blocker_arbiter_regression_matrix_gate";
const expectedTargets = [
  "tests/schema_examples/review_console_blocker_arbiter_regression_matrix.example.json",
  "scripts/validate_review_console_blocker_arbiter_regression_matrix.js",
  "docs/v14_056_review_console_blocker_arbiter_regression_matrix_gate.md"
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

function normalizeRepoPath(relativePath) {
  assert(typeof relativePath === "string" && relativePath.trim() === relativePath, "Scan target must be a trimmed string.");
  assert(relativePath.length > 0, "Scan target must not be empty.");
  assert(!path.isAbsolute(relativePath), `Scan target must be repo-relative: ${relativePath}`);
  const normalized = relativePath.replace(/\\/g, "/");
  assert(!normalized.startsWith("../"), `Scan target must not escape repository root: ${relativePath}`);
  assert(!normalized.includes("/../"), `Scan target must not contain parent traversal: ${relativePath}`);
  const resolved = path.resolve(root, normalized);
  assert(
    resolved === root || resolved.startsWith(`${root}${path.sep}`),
    `Scan target resolved outside repository root: ${relativePath}`
  );
  return normalized;
}

function assertExactTargetAllowlist(scanTargets) {
  const normalizedTargets = scanTargets.map(normalizeRepoPath);
  assert(normalizedTargets.length === expectedTargets.length, "Boundary scan target count must match exact allowlist.");
  for (const target of normalizedTargets) {
    assert(expectedTargets.includes(target), `Boundary scan target is not allowlisted: ${target}`);
  }
  for (const target of expectedTargets) {
    assert(normalizedTargets.includes(target), `Boundary scan missing allowlisted target: ${target}`);
  }
  return normalizedTargets;
}

function assertTargetPathBoundary(relativePath) {
  const blockedFragments = [
    ".env",
    "config.env",
    "runs/",
    "accepted_samples/",
    "VCPChat/",
    "VCPToolBox/",
    "vcpchat/",
    "vcptoolbox/"
  ];
  for (const fragment of blockedFragments) {
    assert(!relativePath.includes(fragment), `Boundary scan target must not reference ${fragment}: ${relativePath}`);
  }
}

function loadMatrixFixture() {
  return parseJson(
    read("tests/schema_examples/review_console_blocker_arbiter_regression_matrix.example.json"),
    "blocker arbiter regression matrix"
  );
}

function assertArrayEqual(actual, expected, message) {
  assert(Array.isArray(actual), `${message}: actual value must be an array.`);
  assert(Array.isArray(expected), `${message}: expected value must be an array.`);
  assert(actual.length === expected.length, `${message}: array length mismatch.`);
  expected.forEach((item) => {
    assert(actual.includes(item), `${message}: missing ${item}.`);
  });
}

function assertRegressionMatrixStillLocked(matrix) {
  assert(matrix.phase === expectedSourcePhase, "Regression matrix phase must remain v14.056.");
  assert(matrix.status === "local_regression_matrix", "Regression matrix must remain local_regression_matrix.");
  assert(matrix.display_only === true, "Regression matrix must remain display-only.");
  assert(matrix.expected_consensus.surface_count === matrix.surfaces.length, "Regression matrix surface count must match consensus.");
  for (const surface of matrix.surfaces) {
    assertArrayEqual(
      surface.memory_forbidden_candidate_ids,
      matrix.expected_consensus.memory_forbidden_candidate_ids,
      `${surface.surface_id} memory-forbidden IDs must remain locked`
    );
    assertArrayEqual(
      surface.never_production_candidate_ids,
      matrix.expected_consensus.never_production_candidate_ids,
      `${surface.surface_id} never-production IDs must remain locked`
    );
    assertArrayEqual(
      surface.production_exclusion_candidate_ids,
      matrix.expected_consensus.production_exclusion_candidate_ids,
      `${surface.surface_id} production-exclusion IDs must remain locked`
    );
    assert(surface.production_candidate_created === false, `${surface.surface_id} must not create production candidates.`);
    assert(surface.direct_memory_write_performed === false, `${surface.surface_id} must not write memory directly.`);
    assert(surface.accepted_samples_write_performed === false, `${surface.surface_id} must not write accepted samples.`);
    assert(surface.provider_plugin_api_image_effects === false, `${surface.surface_id} must not perform provider/plugin/API/image effects.`);
    assert(surface.selected_plugin === null, `${surface.surface_id} must keep selected_plugin null.`);
    assert(surface.max_plugin_calls_observed === 0, `${surface.surface_id} must observe zero plugin calls.`);
  }
  for (const key of [
    "production_candidate_created",
    "direct_memory_write_performed",
    "accepted_samples_write_performed",
    "provider_contact_performed",
    "plugin_call_performed",
    "api_call_performed",
    "daily_note_write_performed",
    "vcp_memory_write_performed",
    "image_generation_performed",
    "output_file_write_performed"
  ]) {
    assert(matrix.expected_consensus[key] === false, `Regression matrix consensus ${key} must remain false.`);
  }
  assert(matrix.expected_consensus.selected_plugin === null, "Regression matrix consensus selected_plugin must remain null.");
  assert(matrix.expected_consensus.max_plugin_calls_observed === 0, "Regression matrix consensus max_plugin_calls_observed must remain 0.");
}

function main() {
  assert(exists(scanFixturePath), `Missing boundary scan fixture: ${scanFixturePath}`);
  const scan = parseJson(read(scanFixturePath), "blocker arbiter boundary scan fixture");

  assert(scan.phase === expectedPhase, "Boundary scan fixture must declare v14.057 phase.");
  assert(scan.status === "local_boundary_scan", "Boundary scan fixture must be local_boundary_scan.");
  assert(scan.display_only === true, "Boundary scan fixture must be display-only.");
  assert(
    scan.source_phase === expectedSourcePhase,
    "Boundary scan source phase must be v14.056."
  );
  assert(scan.scan_targets.length === scan.expected_result.target_count, "Boundary scan target count must match expected result.");

  const scanTargets = assertExactTargetAllowlist(scan.scan_targets);
  scanTargets.forEach(assertTargetPathBoundary);

  const missingTargets = scanTargets.filter((relativePath) => !exists(relativePath));
  assert(missingTargets.length === 0, `Missing boundary scan targets: ${missingTargets.join(", ")}`);

  const targetContents = scanTargets.map((relativePath) => ({
    relativePath,
    content: read(relativePath)
  }));

  for (const ref of scan.required_allowed_refs) {
    assert(
      targetContents.some((target) => target.content.includes(ref)),
      `Boundary scan targets must retain allowed local ref: ${ref}`
    );
  }

  const forbiddenMatches = [];
  for (const target of targetContents) {
    for (const item of scan.forbidden_patterns) {
      const regex = new RegExp(item.pattern, "i");
      if (regex.test(target.content)) {
        forbiddenMatches.push({
          target: target.relativePath,
          label: item.label
        });
      }
    }
  }

  assert(
    forbiddenMatches.length === scan.expected_result.forbidden_match_count,
    `Boundary scan found forbidden matches: ${JSON.stringify(forbiddenMatches)}`
  );

  assert(scan.expected_result.boundary_scan_passed === true, "Boundary scan expected_result must pass.");
  assert(scan.expected_result.regression_matrix_rechecked === true, "Boundary scan must expect regression matrix recheck.");
  assertRegressionMatrixStillLocked(loadMatrixFixture());

  for (const key of [
    "provider_contact_performed",
    "plugin_call_performed",
    "api_call_performed",
    "daily_note_write_performed",
    "vcp_memory_write_performed",
    "image_generation_performed",
    "output_file_write_performed",
    "external_network_required",
    "external_service_required",
    "file_write_performed"
  ]) {
    assert(scan.expected_result[key] === false, `Boundary scan expected_result ${key} must be false.`);
  }

  const result = {
    passed: true,
    review_console_blocker_arbiter_boundary_scan: {
      blocker_arbiter_boundary_scan_present: true,
      blocker_arbiter_boundary_targets_verified: true,
      blocker_arbiter_boundary_scan_allowed_refs_verified: true,
      blocker_arbiter_no_env_reference_verified: true,
      blocker_arbiter_no_real_manifest_reference_verified: true,
      blocker_arbiter_no_vcp_source_reference_verified: true,
      blocker_arbiter_no_runs_or_accepted_samples_path_verified: true,
      blocker_arbiter_no_image_binary_reference_verified: true,
      blocker_arbiter_no_network_or_process_execution_verified: true,
      blocker_arbiter_no_write_api_verified: true,
      blocker_arbiter_no_provider_plugin_api_image_effects: true,
      blocker_arbiter_regression_matrix_validator_rechecked: true,
      external_network_required: false,
      external_service_required: false,
      file_write_performed: false
    }
  };

  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
}
