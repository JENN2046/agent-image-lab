const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");

const requiredFiles = [
  "review_console/static_prototype/mock_data.js",
  "review_console/static_prototype/index.html",
  "review_console/static_prototype/app.js",
  "review_console/static_prototype/styles.css",
  "review_console/static_prototype/FIELD_MAPPING.md",
  "adapter_dry_run_lab/fixtures/accepted_request.json",
  "exports/vcptoolbox/Plugin/AgentImageLabAdapter/dry-run-adapter.js",
  "tests/schema_examples/pvos_kernel_dry_run_adapter_response.example.json"
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

function loadStaticMock() {
  const context = {
    window: {}
  };
  vm.runInNewContext(read("review_console/static_prototype/mock_data.js"), context, {
    filename: "review_console/static_prototype/mock_data.js"
  });
  return context.window.REVIEW_CONSOLE_MOCK;
}

function assertGuardClean(guard, label) {
  assert(guard.selected_plugin === null, `${label} must keep selected_plugin null.`);
  assert(guard.max_plugin_calls === 0, `${label} must keep max_plugin_calls 0.`);
  assert(guard.api_called === false, `${label} must keep api_called false.`);
  assert(guard.vcp_plugin_called === false, `${label} must keep vcp_plugin_called false.`);
  assert(guard.daily_note_called === false, `${label} must keep daily_note_called false.`);
  assert(guard.file_write_performed === false, `${label} must keep file_write_performed false.`);
  assert(guard.image_file_created === false, `${label} must keep image_file_created false.`);
  assert(guard.real_execution_allowed === false, `${label} must keep real_execution_allowed false.`);
}

function assertDispatchClean(dispatchPlan, label) {
  assert(dispatchPlan.mode === "dry_run", `${label} must stay dry_run.`);
  assert(dispatchPlan.selected_plugin === null, `${label} must keep selected_plugin null.`);
  assert(dispatchPlan.max_plugin_calls === 0, `${label} must keep max_plugin_calls 0.`);
  assert(dispatchPlan.execution_blocked === true, `${label} must block execution.`);
  assert(dispatchPlan.external_api_allowed === false, `${label} must not allow external API.`);
  assert(dispatchPlan.allow_file_write === false, `${label} must not allow file write.`);
  assert(dispatchPlan.allow_image_binary === false, `${label} must not allow image binary.`);
  assert(dispatchPlan.expected_outputs === 0, `${label} must keep expected_outputs 0.`);
  assert(dispatchPlan.max_outputs === 0, `${label} must keep max_outputs 0.`);
}

function assertActions(handoff) {
  for (const action of ["mark_candidate", "reject_candidate", "request_gatekeeper_review", "request_memory_edit"]) {
    assert(handoff.allowed_actions.includes(action), `Review Console handoff must allow ${action}.`);
  }
  for (const action of ["execute_plugin", "call_api", "write_daily_note", "save_image"]) {
    assert(handoff.forbidden_actions.includes(action), `Review Console handoff must forbid ${action}.`);
  }
}

function assertReviewResultProtocolHandoff(handoff, adapterExample) {
  assert(handoff, "Static mock must expose review_result_protocol_static_handoff.");
  assert(handoff.status === "draft_ready", "Review result protocol static handoff must be draft_ready.");
  assert(handoff.display_only === true, "Review result protocol static handoff must be display-only.");
  assert(
    handoff.review_result_protocol_report_attached === true,
    "Review result protocol static handoff must mark report attached."
  );

  const report = adapterExample.review_result_protocol_report;
  const adapterHandoff = adapterExample.review_result_protocol_handoff_draft;
  assert(report, "PVOS adapter example must include review_result_protocol_report.");
  assert(adapterHandoff, "PVOS adapter example must include review_result_protocol_handoff_draft.");
  assert(
    handoff.report_summary.pass_count === report.report_summary.pass_count,
    "Static protocol handoff pass_count must match adapter report."
  );
  assert(
    handoff.report_summary.reject_count === report.report_summary.reject_count,
    "Static protocol handoff reject_count must match adapter report."
  );
  assert(
    handoff.report_summary.never_production_count === report.report_summary.never_production_count,
    "Static protocol handoff never_production_count must match adapter report."
  );
  assert(
    handoff.report_summary.production_candidate_created === false,
    "Static protocol handoff must not create production candidates."
  );
  assert(
    handoff.report_summary.direct_memory_write_performed === false,
    "Static protocol handoff must not perform direct memory writes."
  );
  for (const field of adapterHandoff.required_review_fields) {
    assert(handoff.required_review_fields.includes(field), `Static protocol handoff must require ${field}.`);
  }

  const passCandidate = handoff.candidate_review_results.find((candidate) => candidate.review_outcome === "pass");
  const rejectCandidate = handoff.candidate_review_results.find((candidate) => candidate.review_outcome === "reject");
  assert(passCandidate, "Static protocol handoff must include a pass candidate.");
  assert(rejectCandidate, "Static protocol handoff must include a reject candidate.");
  assert(passCandidate.pass_reasons.length > 0, "Pass candidate must keep non-empty pass_reasons.");
  assert(passCandidate.reject_reasons.length === 0, "Pass candidate must keep reject_reasons empty.");
  assert(rejectCandidate.reject_reasons.length > 0, "Reject candidate must keep non-empty reject_reasons.");
  assert(rejectCandidate.pass_reasons.length === 0, "Reject candidate must keep pass_reasons empty.");
  assert(passCandidate.memory_route.route === "draft_memory_candidate", "Pass candidate must route to draft memory candidate.");
  assert(
    rejectCandidate.memory_route.route === "audit_only_failure_learning",
    "Reject candidate must route only to failure learning audit."
  );
  assert(passCandidate.memory_route.direct_write_performed === false, "Pass candidate must not write memory directly.");
  assert(rejectCandidate.memory_route.direct_write_performed === false, "Reject candidate must not write memory directly.");
  assert(
    passCandidate.production_route.status === "blocked_until_human_review",
    "Pass candidate must still be blocked until human review."
  );
  assert(
    rejectCandidate.production_route.status === "never_production",
    "Reject candidate must be routed to never_production."
  );
  assert(rejectCandidate.production_route.permanent_block === true, "Reject candidate must be permanently blocked.");
  assert(passCandidate.production_route.production_candidate === false, "Pass candidate must not be a production candidate.");
  assert(rejectCandidate.production_route.production_candidate === false, "Reject candidate must not be a production candidate.");
}

function main() {
  const missingFiles = requiredFiles.filter((relativePath) => !exists(relativePath));
  assert(missingFiles.length === 0, `Missing Review Console adapter handoff files: ${missingFiles.join(", ")}`);

  const mock = loadStaticMock();
  const fixtureHandoff = mock.adapter_dry_run_handoff;
  assert(fixtureHandoff, "Static mock must expose adapter_dry_run_handoff.");

  const acceptedInput = parseJson(read("adapter_dry_run_lab/fixtures/accepted_request.json"), "accepted fixture");
  const adapter = require(path.join(root, "exports/vcptoolbox/Plugin/AgentImageLabAdapter/dry-run-adapter.js"));
  const adapterResponse = adapter.dryRun(acceptedInput).adapter_dry_run_response;
  const pvosAdapterExample = parseJson(
    read("tests/schema_examples/pvos_kernel_dry_run_adapter_response.example.json"),
    "PVOS adapter example"
  );

  assert(adapterResponse.status === "accepted_draft", "Adapter accepted fixture must produce accepted_draft.");
  assert(fixtureHandoff.status === adapterResponse.status, "Static handoff status must match Adapter accepted fixture.");
  assert(
    fixtureHandoff.dispatch_plan_draft.task_id === adapterResponse.dispatch_plan_draft.task_id,
    "Static handoff task_id must match Adapter accepted fixture."
  );
  assert(
    fixtureHandoff.dispatch_plan_draft.dispatch_id === adapterResponse.dispatch_plan_draft.dispatch_id,
    "Static handoff dispatch_id must match Adapter accepted fixture."
  );

  assertDispatchClean(fixtureHandoff.dispatch_plan_draft, "static adapter handoff dispatch");
  assert(fixtureHandoff.gatekeeper_handoff.required === true, "Gatekeeper handoff must be required.");
  assert(fixtureHandoff.gatekeeper_handoff.display_only === true, "Gatekeeper handoff must be display-only.");
  assert(fixtureHandoff.gatekeeper_handoff.approval_to_execute_allowed === false, "Gatekeeper handoff must not allow execution approval.");
  assert(fixtureHandoff.review_console_handoff.required === true, "Review Console handoff must be required.");
  assert(fixtureHandoff.review_console_handoff.display_only === true, "Review Console handoff must be display-only.");
  assertActions(fixtureHandoff.review_console_handoff);
  assert(fixtureHandoff.audit_record.contains_sensitive_original === false, "Audit record must not contain sensitive original.");
  assert(fixtureHandoff.audit_record.max_plugin_calls_observed === 0, "Audit record must observe zero plugin calls.");
  assert(fixtureHandoff.audit_record.external_api_observed === false, "Audit record must observe no external API.");
  assert(fixtureHandoff.audit_record.file_write_observed === false, "Audit record must observe no file write.");
  assert(fixtureHandoff.audit_record.image_binary_observed === false, "Audit record must observe no image binary.");
  assertGuardClean(fixtureHandoff.no_execution_guard, "static adapter handoff guard");
  assertReviewResultProtocolHandoff(mock.review_result_protocol_static_handoff, pvosAdapterExample);

  const appSource = read("review_console/static_prototype/app.js");
  const indexSource = read("review_console/static_prototype/index.html");
  const styleSource = read("review_console/static_prototype/styles.css");
  assert(appSource.includes("adapter_dry_run_handoff"), "Static app must carry adapter_dry_run_handoff into draft output.");
  assert(
    appSource.includes("review_result_protocol_static_handoff"),
    "Static app must carry review_result_protocol_static_handoff into draft output."
  );
  assert(appSource.includes("renderProtocolHandoff"), "Static app must render review protocol handoff.");
  assert(indexSource.includes("protocolCandidateList"), "Static HTML must expose protocol candidate list.");
  assert(indexSource.includes("protocolSummary"), "Static HTML must expose protocol summary.");
  assert(indexSource.includes("protocolGuard"), "Static HTML must expose protocol guard.");
  assert(styleSource.includes(".protocol-panel"), "Static CSS must style protocol panel.");
  assert(styleSource.includes(".protocol-card.reject"), "Static CSS must style rejected protocol cards.");
  assert(appSource.includes("Never production"), "Static app must expose never production summary copy.");
  assert(!/fetch\s*\(|XMLHttpRequest|writeFile|appendFile|fs\.|eval\s*\(|Function\s*\(/.test(appSource), "Static app must not contain forbidden runtime calls.");

  const fieldMapping = read("review_console/static_prototype/FIELD_MAPPING.md");
  for (const text of [
    "v5.3 Adapter Dry-Run Handoff",
    "adapter_dry_run_handoff.status",
    "adapter_dry_run_handoff.dispatch_plan_draft",
    "adapter_dry_run_handoff.review_console_handoff.forbidden_actions",
    "accepted_draft",
    "不等于真实执行授权",
    "v14.041 Review Result Protocol Static Handoff",
    "review_result_protocol_static_handoff.candidate_review_results",
    "never_production",
    "production_candidate_created"
  ]) {
    assert(fieldMapping.includes(text), `FIELD_MAPPING must document ${text}.`);
  }

  const result = {
    passed: true,
    review_console_adapter_handoff: {
      static_handoff_fixture_present: true,
      adapter_fixture_compared: true,
      accepted_draft_status_verified: true,
      dispatch_plan_mapped: true,
      gatekeeper_handoff_mapped: true,
      review_console_handoff_mapped: true,
      audit_record_mapped: true,
      no_execution_guard_verified: true,
      allowed_actions_verified: true,
      forbidden_actions_verified: true,
      review_result_protocol_static_handoff_verified: true,
      review_protocol_pass_reasons_verified: true,
      review_protocol_reject_reasons_verified: true,
      review_protocol_memory_route_verified: true,
      review_protocol_never_production_verified: true,
      review_protocol_production_candidate_blocked: true,
      review_protocol_visible_ui_verified: true,
      review_protocol_candidate_cards_verified: true,
      review_protocol_guard_visible: true,
      static_app_draft_output_current: true,
      field_mapping_current: true,
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
