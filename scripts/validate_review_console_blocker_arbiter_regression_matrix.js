const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");

const requiredFiles = [
  "review_console/static_prototype/mock_data.js",
  "tests/schema_examples/review_console_blocker_arbiter_regression_matrix.example.json",
  "tests/schema_examples/review_console_adapter_negative_fixture_draft_output_snapshot.example.json",
  "tests/schema_examples/pvos_kernel_dry_run_adapter_negative_guard_response.example.json",
  "tests/schema_examples/evidence_blocker_contract_negative_guard.example.json"
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

function assertArrayEqual(actual, expected, message) {
  assert(Array.isArray(actual), `${message}: actual value must be an array.`);
  assert(Array.isArray(expected), `${message}: expected value must be an array.`);
  assert(actual.length === expected.length, `${message}: array length mismatch.`);
  expected.forEach((item) => {
    assert(actual.includes(item), `${message}: missing ${item}.`);
  });
}

function parseJson(text, label) {
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(`${label} must be valid JSON: ${error.message}`);
  }
}

function loadStaticMock() {
  const context = { window: {} };
  vm.runInNewContext(read("review_console/static_prototype/mock_data.js"), context, {
    filename: "review_console/static_prototype/mock_data.js"
  });
  return context.window.REVIEW_CONSOLE_MOCK;
}

function getSurface(matrix, surfaceId) {
  const surface = matrix.surfaces.find((item) => item.surface_id === surfaceId);
  assert(surface, `Matrix must include ${surfaceId} surface.`);
  return surface;
}

function assertSurfaceConsensus(surface, consensus) {
  assertArrayEqual(
    surface.memory_forbidden_candidate_ids,
    consensus.memory_forbidden_candidate_ids,
    `${surface.surface_id} memory-forbidden IDs must match consensus`
  );
  assertArrayEqual(
    surface.never_production_candidate_ids,
    consensus.never_production_candidate_ids,
    `${surface.surface_id} never-production IDs must match consensus`
  );
  assertArrayEqual(
    surface.production_exclusion_candidate_ids,
    consensus.production_exclusion_candidate_ids,
    `${surface.surface_id} production-exclusion IDs must match consensus`
  );
  assert(surface.production_candidate_created === false, `${surface.surface_id} must not create production candidates.`);
  assert(surface.direct_memory_write_performed === false, `${surface.surface_id} must not write memory directly.`);
  assert(surface.accepted_samples_write_performed === false, `${surface.surface_id} must not write accepted samples.`);
  assert(surface.provider_plugin_api_image_effects === false, `${surface.surface_id} must not perform provider/plugin/API/image effects.`);
  assert(surface.selected_plugin === null, `${surface.surface_id} must keep selected_plugin null.`);
  assert(surface.max_plugin_calls_observed === 0, `${surface.surface_id} must observe zero plugin calls.`);
}

function assertProtocolSurface(surface, adapterFixture) {
  const guard = adapterFixture.review_console_handoff_draft.review_protocol_guard_summary;
  const report = adapterFixture.review_result_protocol_report.report_summary;
  assertArrayEqual(surface.memory_forbidden_candidate_ids, guard.memory_forbidden_candidate_ids, "Protocol memory-forbidden IDs must match adapter fixture");
  assertArrayEqual(surface.never_production_candidate_ids, guard.never_production_candidate_ids, "Protocol never-production IDs must match adapter fixture");
  assert(report.production_candidate_created === false, "Protocol report must not create production candidates.");
  assert(report.direct_memory_write_performed === false, "Protocol report must not write memory directly.");
}

function assertDecisionPackageSurface(surface, adapterFixture) {
  const handoff = adapterFixture.review_decision_package_handoff_draft;
  const decision = adapterFixture.review_decision_package;
  assertArrayEqual(surface.memory_forbidden_candidate_ids, handoff.memory_forbidden_candidate_ids, "Decision package memory-forbidden IDs must match adapter fixture");
  assertArrayEqual(surface.production_exclusion_candidate_ids, handoff.production_exclusion_candidate_ids, "Decision package production-exclusion IDs must match adapter fixture");
  assertArrayEqual(surface.never_production_candidate_ids, handoff.production_exclusion_candidate_ids, "Decision package never-production IDs must match production exclusions");
  assert(decision.decision_summary.production_candidate_created === false, "Decision package must not create production candidates.");
  assert(decision.decision_summary.direct_memory_write_performed === false, "Decision package must not write memory directly.");
  assert(decision.decision_summary.accepted_samples_write_performed === false, "Decision package must not write accepted samples.");
}

function assertEvidenceBlockerSurface(surface, evidenceFixture) {
  const contract = evidenceFixture.evidence_blocker_contract || evidenceFixture;
  const summary = contract.blocker_summary;
  const memoryForbiddenIds = contract.blocker_decisions
    .filter((item) => item.blocker_type === "memory_forbidden")
    .map((item) => item.candidate_id);
  const productionExclusionIds = contract.production_exclusion_register.map((item) => item.candidate_id);
  assertArrayEqual(surface.memory_forbidden_candidate_ids, memoryForbiddenIds, "Evidence blocker memory-forbidden IDs must match fixture");
  assertArrayEqual(surface.production_exclusion_candidate_ids, productionExclusionIds, "Evidence blocker production-exclusion IDs must match fixture");
  assertArrayEqual(surface.never_production_candidate_ids, productionExclusionIds, "Evidence blocker never-production IDs must match exclusions");
  assert(summary.production_candidate_created === false, "Evidence blocker must not create production candidates.");
  assert(summary.direct_memory_write_performed === false, "Evidence blocker must not write memory directly.");
  assert(summary.accepted_samples_write_performed === false, "Evidence blocker must not write accepted samples.");
}

function assertAdapterNegativeSurface(surface, adapterFixture) {
  const handoff = adapterFixture.evidence_blocker_contract_handoff_draft;
  const guard = adapterFixture.review_console_handoff_draft.review_evidence_blocker_contract_guard_summary;
  const audit = adapterFixture.audit_record;
  assertArrayEqual(surface.memory_forbidden_candidate_ids, handoff.memory_forbidden_candidate_ids, "Adapter negative memory-forbidden IDs must match fixture");
  assertArrayEqual(surface.production_exclusion_candidate_ids, handoff.production_exclusion_candidate_ids, "Adapter negative production-exclusion IDs must match fixture");
  assertArrayEqual(surface.never_production_candidate_ids, handoff.production_exclusion_candidate_ids, "Adapter negative never-production IDs must match exclusions");
  assert(guard.memory_forbidden_block_count === surface.memory_forbidden_candidate_ids.length, "Adapter negative guard must count memory-forbidden blocks.");
  assert(audit.selected_plugin === null, "Adapter negative audit must keep selected_plugin null.");
  assert(audit.max_plugin_calls_observed === 0, "Adapter negative audit must observe zero plugin calls.");
  assert(audit.production_candidate_created === false, "Adapter negative audit must not create production candidates.");
  assert(audit.external_api_observed === false, "Adapter negative audit must not observe API calls.");
  assert(audit.image_generation_observed === false, "Adapter negative audit must not observe image generation.");
  assert(audit.memory_write_observed === false, "Adapter negative audit must not observe memory writes.");
}

function assertDraftSnapshotSurface(surface, snapshot) {
  const handoff = snapshot.review_evidence_blocker_adapter_negative_static_handoff;
  assertArrayEqual(surface.memory_forbidden_candidate_ids, handoff.memory_forbidden_candidate_ids, "Draft snapshot memory-forbidden IDs must match snapshot");
  assertArrayEqual(surface.production_exclusion_candidate_ids, handoff.production_exclusion_candidate_ids, "Draft snapshot production-exclusion IDs must match snapshot");
  assertArrayEqual(surface.never_production_candidate_ids, handoff.production_exclusion_candidate_ids, "Draft snapshot never-production IDs must match exclusions");
  assert(handoff.guard_summary.production_candidate_created === false, "Draft snapshot must not create production candidates.");
  assert(handoff.guard_summary.direct_memory_write_performed === false, "Draft snapshot must not write memory directly.");
  assert(handoff.guard_summary.accepted_samples_write_performed === false, "Draft snapshot must not write accepted samples.");
  assert(handoff.no_execution_guard.plugin_call_performed === false, "Draft snapshot must not call plugins.");
  assert(handoff.no_execution_guard.api_call_performed === false, "Draft snapshot must not call APIs.");
  assert(handoff.no_execution_guard.image_generation_performed === false, "Draft snapshot must not generate images.");
}

function assertStaticMockNotLoosened(mock, consensus) {
  const handoff = mock.review_evidence_blocker_adapter_negative_static_handoff;
  assertArrayEqual(handoff.memory_forbidden_candidate_ids, consensus.memory_forbidden_candidate_ids, "Static mock memory-forbidden IDs must match consensus");
  assertArrayEqual(handoff.production_exclusion_candidate_ids, consensus.production_exclusion_candidate_ids, "Static mock production-exclusion IDs must match consensus");
  assert(handoff.guard_summary.production_candidate_created === false, "Static mock must not create production candidates.");
  assert(handoff.guard_summary.direct_memory_write_performed === false, "Static mock must not write memory directly.");
  assert(handoff.guard_summary.accepted_samples_write_performed === false, "Static mock must not write accepted samples.");
  assert(handoff.audit_summary.selected_plugin === null, "Static mock must keep selected_plugin null.");
  assert(handoff.audit_summary.max_plugin_calls_observed === 0, "Static mock must observe zero plugin calls.");
}

function main() {
  const missingFiles = requiredFiles.filter((relativePath) => !exists(relativePath));
  assert(missingFiles.length === 0, `Missing blocker arbiter regression matrix files: ${missingFiles.join(", ")}`);

  const mock = loadStaticMock();
  const matrix = parseJson(
    read("tests/schema_examples/review_console_blocker_arbiter_regression_matrix.example.json"),
    "blocker arbiter regression matrix"
  );
  const snapshot = parseJson(
    read("tests/schema_examples/review_console_adapter_negative_fixture_draft_output_snapshot.example.json"),
    "adapter negative draft output snapshot"
  );
  const adapterFixture = parseJson(
    read("tests/schema_examples/pvos_kernel_dry_run_adapter_negative_guard_response.example.json"),
    "adapter negative fixture"
  );
  const evidenceFixture = parseJson(
    read("tests/schema_examples/evidence_blocker_contract_negative_guard.example.json"),
    "evidence blocker negative fixture"
  );

  assert(matrix.status === "local_regression_matrix", "Blocker arbiter matrix must be local_regression_matrix.");
  assert(matrix.display_only === true, "Blocker arbiter matrix must be display-only.");
  assert(matrix.source_phase === "v14_055_review_console_adapter_negative_fixture_draft_output_snapshot_gate", "Matrix source phase must be v14.055.");
  assert(matrix.expected_consensus.surface_count === matrix.surfaces.length, "Matrix surface count must match consensus.");

  for (const surfaceId of ["protocol", "decision_package", "evidence_blocker", "adapter_negative", "draft_output_snapshot"]) {
    assertSurfaceConsensus(getSurface(matrix, surfaceId), matrix.expected_consensus);
  }

  assertProtocolSurface(getSurface(matrix, "protocol"), adapterFixture);
  assertDecisionPackageSurface(getSurface(matrix, "decision_package"), adapterFixture);
  assertEvidenceBlockerSurface(getSurface(matrix, "evidence_blocker"), evidenceFixture);
  assertAdapterNegativeSurface(getSurface(matrix, "adapter_negative"), adapterFixture);
  assertDraftSnapshotSurface(getSurface(matrix, "draft_output_snapshot"), snapshot);
  assertStaticMockNotLoosened(mock, matrix.expected_consensus);

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
    assert(matrix.expected_consensus[key] === false, `Matrix consensus ${key} must be false.`);
  }
  assert(matrix.expected_consensus.selected_plugin === null, "Matrix consensus selected_plugin must be null.");
  assert(matrix.expected_consensus.max_plugin_calls_observed === 0, "Matrix consensus max_plugin_calls_observed must be 0.");

  const result = {
    passed: true,
    review_console_blocker_arbiter_regression_matrix: {
      blocker_arbiter_matrix_present: true,
      blocker_arbiter_surface_consensus_verified: true,
      blocker_arbiter_protocol_surface_verified: true,
      blocker_arbiter_decision_package_surface_verified: true,
      blocker_arbiter_evidence_blocker_surface_verified: true,
      blocker_arbiter_adapter_negative_surface_verified: true,
      blocker_arbiter_draft_output_snapshot_surface_verified: true,
      blocker_arbiter_memory_forbidden_verified: true,
      blocker_arbiter_never_production_verified: true,
      blocker_arbiter_production_exclusion_verified: true,
      blocker_arbiter_no_production_candidate_verified: true,
      blocker_arbiter_no_direct_memory_write_verified: true,
      blocker_arbiter_no_accepted_samples_write_verified: true,
      blocker_arbiter_no_provider_plugin_api_image_verified: true,
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
