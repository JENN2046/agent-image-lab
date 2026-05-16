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
  "tests/schema_examples/pvos_kernel_dry_run_adapter_response.example.json",
  "tests/schema_examples/pvos_kernel_dry_run_adapter_negative_guard_response.example.json",
  "tests/schema_examples/review_console_adapter_negative_fixture_draft_output_snapshot.example.json",
  "tests/schema_examples/review_console_blocker_arbiter_draft_output_snapshot.example.json"
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

function assertDeepEqual(actual, expected, message) {
  const actualJson = JSON.stringify(actual, null, 2);
  const expectedJson = JSON.stringify(expected, null, 2);
  assert(actualJson === expectedJson, message);
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

function createFakeElement(initial = {}) {
  const element = {
    children: [],
    dataset: initial.dataset || {},
    value: initial.value || "",
    textContent: initial.textContent || "",
    innerHTML: "",
    title: "",
    className: initial.className || "",
    classList: {
      add() {},
      remove() {},
      toggle() {}
    },
    appendChild(child) {
      this.children.push(child);
      return child;
    },
    addEventListener() {},
    querySelector(selector) {
      if (!this.__queryChildren) this.__queryChildren = {};
      if (!this.__queryChildren[selector]) this.__queryChildren[selector] = createFakeElement();
      return this.__queryChildren[selector];
    }
  };
  return element;
}

function loadRenderedStaticDraft(mock) {
  const elements = new Map();
  const ensureElement = (id, initial = {}) => {
    if (!elements.has(id)) elements.set(id, createFakeElement(initial));
    return elements.get(id);
  };

  for (const id of [
    "versionList",
    "currentVersionScore",
    "scoreControls",
    "aiTotal",
    "humanTotal",
    "finalTotal",
    "commentList",
    "commentText",
    "commentTarget",
    "commentSeverity",
    "addCommentBtn",
    "iterationList",
    "protocolSummary",
    "protocolGuardSummary",
    "protocolCandidateList",
    "protocolGuard",
    "decisionPackageSummary",
    "decisionPackageGuardSummary",
    "decisionPackageDraftList",
    "decisionPackageGuard",
    "evidenceBlockerSummary",
    "evidenceBlockerGuardSummary",
    "evidenceRecordList",
    "blockerDecisionList",
    "evidenceBlockerGuard",
    "blockerArbiterSummary",
    "blockerArbiterGuardSummary",
    "blockerArbiterRouteList",
    "blockerArbiterGuard",
    "reviewReportSummary",
    "reviewReportGuardSummary",
    "reviewReportItemList",
    "reviewReportGuard",
    "adapterNegativeSummary",
    "adapterNegativeGuardSummary",
    "adapterNegativeBlockerList",
    "adapterNegativeGuard",
    "dailyNoteLock",
    "refreshDraftBtn",
    "draftOutput",
    "sessionId",
    "sessionStatus"
  ]) {
    ensureElement(id);
  }
  ensureElement("memoryTitle", { value: mock.review_session.memory_preview.chinese_diary_title });
  ensureElement("memoryContent", { value: mock.review_session.memory_preview.chinese_diary_content });

  const archiveButtons = ["accepted", "candidate", "rejected", "draft"].map((archive) =>
    createFakeElement({ dataset: { archive } })
  );
  const memoryButtons = ["approved", "rejected", "pending"].map((memory) =>
    createFakeElement({ dataset: { memory } })
  );

  const context = {
    window: { REVIEW_CONSOLE_MOCK: mock },
    document: {
      querySelector(selector) {
        if (selector.startsWith("#")) return ensureElement(selector.slice(1));
        throw new Error(`Unsupported static prototype selector: ${selector}`);
      },
      querySelectorAll(selector) {
        if (selector === "[data-archive]") return archiveButtons;
        if (selector === "[data-memory]") return memoryButtons;
        return [];
      },
      createElement() {
        return createFakeElement();
      }
    }
  };

  vm.runInNewContext(read("review_console/static_prototype/app.js"), context, {
    filename: "review_console/static_prototype/app.js"
  });

  return parseJson(ensureElement("draftOutput").value, "rendered Review Console static draft output");
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
  const adapterGuardSummary = adapterExample.review_console_handoff_draft.review_protocol_guard_summary;
  assert(report, "PVOS adapter example must include review_result_protocol_report.");
  assert(adapterHandoff, "PVOS adapter example must include review_result_protocol_handoff_draft.");
  assert(adapterGuardSummary, "PVOS adapter example must include Review Console guard summary.");
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

  const guardSummary = handoff.review_protocol_guard_summary;
  assert(guardSummary, "Static protocol handoff must expose review_protocol_guard_summary.");
  assert(
    guardSummary.never_production_count === adapterGuardSummary.never_production_count,
    "Static guard summary never_production_count must match adapter handoff."
  );
  assertArrayEqual(
    guardSummary.never_production_candidate_ids,
    adapterGuardSummary.never_production_candidate_ids,
    "Static guard summary never_production_candidate_ids must match adapter handoff"
  );
  assert(
    guardSummary.memory_forbidden_count === adapterGuardSummary.memory_forbidden_count,
    "Static guard summary memory_forbidden_count must match adapter handoff."
  );
  assertArrayEqual(
    guardSummary.memory_forbidden_candidate_ids,
    adapterGuardSummary.memory_forbidden_candidate_ids,
    "Static guard summary memory_forbidden_candidate_ids must match adapter handoff"
  );
  assert(
    guardSummary.production_blocked_count === adapterHandoff.production_blocked_count,
    "Static guard summary production_blocked_count must match adapter protocol handoff."
  );
  assert(
    guardSummary.all_production_candidate_creation_blocked === adapterHandoff.all_production_candidate_creation_blocked,
    "Static guard summary must carry all-production-blocked guard."
  );
  assert(
    guardSummary.negative_guard_observed === adapterGuardSummary.negative_guard_observed,
    "Static guard summary negative_guard_observed must match adapter handoff."
  );
  assert(guardSummary.production_candidate_created === false, "Static guard summary must not create production candidates.");
  assert(guardSummary.direct_memory_write_performed === false, "Static guard summary must not perform direct memory writes.");

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

function assertReviewDecisionPackageHandoff(handoff, adapterExample) {
  assert(handoff, "Static mock must expose review_decision_package_static_handoff.");
  assert(handoff.status === "draft_ready", "Review decision package static handoff must be draft_ready.");
  assert(handoff.display_only === true, "Review decision package static handoff must be display-only.");
  assert(
    handoff.review_decision_package_attached === true,
    "Review decision package static handoff must mark decision package attached."
  );

  const decisionPackage = adapterExample.review_decision_package;
  const adapterHandoff = adapterExample.review_decision_package_handoff_draft;
  const adapterGuardSummary = adapterExample.review_console_handoff_draft.review_decision_package_guard_summary;
  assert(decisionPackage, "PVOS adapter example must include review_decision_package.");
  assert(adapterHandoff, "PVOS adapter example must include review_decision_package_handoff_draft.");
  assert(adapterGuardSummary, "PVOS adapter example must include Review Console decision package guard summary.");

  const summary = handoff.decision_summary;
  assert(
    summary.accepted_sample_draft_count === decisionPackage.decision_summary.accepted_sample_draft_count,
    "Static decision package accepted_sample_draft_count must match adapter package."
  );
  assert(
    summary.rejected_sample_draft_count === decisionPackage.decision_summary.rejected_sample_draft_count,
    "Static decision package rejected_sample_draft_count must match adapter package."
  );
  assert(
    summary.memory_delta_draft_count === decisionPackage.decision_summary.memory_delta_draft_count,
    "Static decision package memory_delta_draft_count must match adapter package."
  );
  assert(
    summary.memory_forbidden_count === decisionPackage.decision_summary.memory_forbidden_count,
    "Static decision package memory_forbidden_count must match adapter package."
  );
  assert(
    summary.production_exclusion_count === adapterHandoff.production_exclusion_count,
    "Static decision package production_exclusion_count must match adapter handoff."
  );
  assert(summary.direct_memory_write_performed === false, "Static decision package must not perform direct memory writes.");
  assert(summary.production_candidate_created === false, "Static decision package must not create production candidates.");
  assert(summary.accepted_samples_write_performed === false, "Static decision package must not write accepted samples.");

  assert(
    handoff.accepted_sample_drafts.length === decisionPackage.accepted_sample_drafts.length,
    "Static decision package must carry accepted sample drafts."
  );
  assert(
    handoff.rejected_sample_drafts.length === decisionPackage.rejected_sample_drafts.length,
    "Static decision package must carry rejected sample drafts."
  );
  assert(
    handoff.memory_delta_drafts.length === decisionPackage.memory_delta_drafts.length,
    "Static decision package must carry memory delta drafts."
  );
  assert(
    handoff.memory_forbidden_records.length === decisionPackage.memory_forbidden_records.length,
    "Static decision package must carry memory forbidden records."
  );
  assert(
    handoff.production_exclusion_register.length === decisionPackage.production_exclusion_register.length,
    "Static decision package must carry production exclusion register."
  );

  assertArrayEqual(
    handoff.accepted_sample_drafts.map((draft) => draft.accepted_sample_id),
    adapterHandoff.accepted_sample_ids,
    "Static decision package accepted sample IDs must match adapter handoff"
  );
  assertArrayEqual(
    handoff.rejected_sample_drafts.map((draft) => draft.rejected_sample_id),
    adapterHandoff.rejected_sample_ids,
    "Static decision package rejected sample IDs must match adapter handoff"
  );
  assertArrayEqual(
    handoff.memory_delta_drafts.map((draft) => draft.memory_delta_id),
    adapterHandoff.memory_delta_ids,
    "Static decision package memory delta IDs must match adapter handoff"
  );
  assertArrayEqual(
    handoff.production_exclusion_register.map((record) => record.candidate_id),
    adapterHandoff.production_exclusion_candidate_ids,
    "Static decision package production exclusion IDs must match adapter handoff"
  );
  assertArrayEqual(
    handoff.review_decision_package_guard_summary.production_exclusion_candidate_ids,
    adapterGuardSummary.production_exclusion_candidate_ids,
    "Static decision package guard production exclusion IDs must match Review Console handoff"
  );

  const rejectedRecord = handoff.production_exclusion_register.find(
    (record) => record.candidate_id === "candidate_reject_metadata_001"
  );
  assert(rejectedRecord, "Static decision package must expose candidate_reject_metadata_001 in production exclusions.");
  assert(rejectedRecord.status === "never_production", "Production exclusion must keep never_production status.");
  assert(rejectedRecord.permanent_block === true, "Production exclusion must keep permanent block true.");
  assert(rejectedRecord.production_candidate === false, "Production exclusion must not be a production candidate.");
  assert(
    handoff.promotion_guard.protocol_pass_is_not_production_approval === true,
    "Static decision package must keep protocol-pass-is-not-production-approval guard."
  );
  assert(
    handoff.promotion_guard.every_never_production_candidate_blocked === true,
    "Static decision package must keep every-never-production-candidate-blocked guard."
  );
  assert(
    handoff.promotion_guard.production_candidate_created === false,
    "Static decision package promotion guard must not create production candidates."
  );
  assert(
    handoff.promotion_guard.direct_memory_write_performed === false,
    "Static decision package promotion guard must not write memory directly."
  );
}

function assertEvidenceBlockerContractHandoff(handoff, adapterExample) {
  assert(handoff, "Static mock must expose review_evidence_blocker_contract_static_handoff.");
  assert(handoff.status === "draft_ready", "Evidence blocker contract static handoff must be draft_ready.");
  assert(handoff.display_only === true, "Evidence blocker contract static handoff must be display-only.");
  assert(
    handoff.evidence_blocker_contract_attached === true,
    "Evidence blocker contract static handoff must mark contract attached."
  );

  const contract = adapterExample.evidence_blocker_contract;
  const adapterHandoff = adapterExample.evidence_blocker_contract_handoff_draft;
  const adapterGuardSummary = adapterExample.review_console_handoff_draft.review_evidence_blocker_contract_guard_summary;
  assert(contract, "PVOS adapter example must include evidence_blocker_contract.");
  assert(adapterHandoff, "PVOS adapter example must include evidence_blocker_contract_handoff_draft.");
  assert(adapterGuardSummary, "PVOS adapter example must include Review Console evidence blocker guard summary.");
  assert(
    handoff.evidence_blocker_contract_handoff_id === adapterExample.review_console_handoff_draft.evidence_blocker_contract_handoff_id,
    "Static evidence blocker handoff id must match Review Console adapter handoff."
  );

  const summary = handoff.blocker_summary;
  assert(
    summary.evidence_record_count === contract.blocker_summary.evidence_record_count,
    "Static evidence blocker evidence_record_count must match adapter contract."
  );
  assert(
    summary.blocker_decision_count === contract.blocker_summary.blocker_decision_count,
    "Static evidence blocker blocker_decision_count must match adapter contract."
  );
  assert(
    summary.production_exclusion_count === adapterHandoff.production_exclusion_count,
    "Static evidence blocker production_exclusion_count must match adapter handoff."
  );
  assert(
    summary.permanent_block_count === adapterHandoff.permanent_block_count,
    "Static evidence blocker permanent_block_count must match adapter handoff."
  );
  assert(
    summary.human_review_block_count === adapterHandoff.human_review_block_count,
    "Static evidence blocker human_review_block_count must match adapter handoff."
  );
  assert(
    summary.memory_forbidden_block_count === adapterHandoff.memory_forbidden_block_count,
    "Static evidence blocker memory_forbidden_block_count must match adapter handoff."
  );
  assert(summary.direct_memory_write_performed === false, "Static evidence blocker must not perform direct memory writes.");
  assert(summary.production_candidate_created === false, "Static evidence blocker must not create production candidates.");
  assert(summary.accepted_samples_write_performed === false, "Static evidence blocker must not write accepted samples.");

  assert(
    handoff.evidence_records.length === contract.evidence_records.length,
    "Static evidence blocker must carry evidence records."
  );
  assert(
    handoff.blocker_decisions.length === contract.blocker_decisions.length,
    "Static evidence blocker must carry blocker decisions."
  );
  assert(
    handoff.production_exclusion_register.length === contract.production_exclusion_register.length,
    "Static evidence blocker must carry production exclusion register."
  );
  assertArrayEqual(
    handoff.evidence_records.map((record) => record.candidate_id),
    contract.evidence_records.map((record) => record.candidate_id),
    "Static evidence blocker evidence record candidate IDs must match adapter contract"
  );
  assertArrayEqual(
    handoff.blocker_decisions.map((blocker) => blocker.candidate_id),
    contract.blocker_decisions.map((blocker) => blocker.candidate_id),
    "Static evidence blocker blocker decision candidate IDs must match adapter contract"
  );
  assertArrayEqual(
    handoff.production_exclusion_register.map((record) => record.candidate_id),
    adapterHandoff.production_exclusion_candidate_ids,
    "Static evidence blocker production exclusion IDs must match adapter handoff"
  );

  const passRecord = handoff.evidence_records.find((record) => record.review_outcome === "pass");
  const rejectRecord = handoff.evidence_records.find((record) => record.review_outcome === "reject");
  assert(passRecord, "Static evidence blocker must include a pass evidence record.");
  assert(rejectRecord, "Static evidence blocker must include a reject evidence record.");
  assert(passRecord.evidence_codes.length > 0, "Pass evidence record must carry evidence codes.");
  assert(rejectRecord.evidence_codes.length > 0, "Reject evidence record must carry evidence codes.");
  assert(passRecord.production_candidate === false, "Pass evidence record must not be a production candidate.");
  assert(rejectRecord.production_candidate === false, "Reject evidence record must not be a production candidate.");
  assert(passRecord.direct_write_performed === false, "Pass evidence record must not write directly.");
  assert(rejectRecord.direct_write_performed === false, "Reject evidence record must not write directly.");

  const humanReviewBlocker = handoff.blocker_decisions.find(
    (blocker) => blocker.blocker_type === "human_review_required"
  );
  const productionExclusionBlocker = handoff.blocker_decisions.find(
    (blocker) => blocker.blocker_type === "production_exclusion"
  );
  assert(humanReviewBlocker, "Static evidence blocker must include a human-review blocker.");
  assert(productionExclusionBlocker, "Static evidence blocker must include a production-exclusion blocker.");
  assert(
    humanReviewBlocker.decision === "block_until_required_review",
    "Human-review blocker must block until required review."
  );
  assert(humanReviewBlocker.permanent_block === false, "Human-review blocker must not be permanent.");
  assert(
    productionExclusionBlocker.decision === "block_permanently",
    "Production-exclusion blocker must block permanently."
  );
  assert(productionExclusionBlocker.permanent_block === true, "Production-exclusion blocker must be permanent.");
  assert(productionExclusionBlocker.production_candidate === false, "Production-exclusion blocker must not be production.");

  const guardSummary = handoff.review_evidence_blocker_contract_guard_summary;
  assert(guardSummary, "Static evidence blocker must expose review_evidence_blocker_contract_guard_summary.");
  assert(
    guardSummary.evidence_record_count === adapterGuardSummary.evidence_record_count,
    "Static evidence blocker guard evidence_record_count must match Review Console handoff."
  );
  assert(
    guardSummary.blocker_decision_count === adapterGuardSummary.blocker_decision_count,
    "Static evidence blocker guard blocker_decision_count must match Review Console handoff."
  );
  assert(
    guardSummary.production_exclusion_count === adapterGuardSummary.production_exclusion_count,
    "Static evidence blocker guard production_exclusion_count must match Review Console handoff."
  );
  assertArrayEqual(
    guardSummary.production_exclusion_candidate_ids,
    adapterGuardSummary.production_exclusion_candidate_ids,
    "Static evidence blocker guard production exclusion IDs must match Review Console handoff"
  );
  assert(guardSummary.production_candidate_created === false, "Static evidence blocker guard must not create production candidates.");
  assert(guardSummary.direct_memory_write_performed === false, "Static evidence blocker guard must not write memory directly.");
  assert(guardSummary.accepted_samples_write_performed === false, "Static evidence blocker guard must not write accepted samples.");
  assert(
    guardSummary.every_candidate_has_evidence_record === true,
    "Static evidence blocker guard must prove every candidate has evidence."
  );
  assert(
    guardSummary.every_candidate_has_production_blocker_decision === true,
    "Static evidence blocker guard must prove every candidate has production blocker decision."
  );
  assert(
    guardSummary.every_never_production_candidate_has_exclusion === true,
    "Static evidence blocker guard must prove every never-production candidate has exclusion."
  );

  assert(
    handoff.arbitration_guard.evidence_record_is_not_approval === true,
    "Static evidence blocker must keep evidence-record-is-not-approval guard."
  );
  assert(
    handoff.arbitration_guard.blocker_decision_is_not_write === true,
    "Static evidence blocker must keep blocker-decision-is-not-write guard."
  );
  assert(
    handoff.arbitration_guard.no_production_without_human_review === true,
    "Static evidence blocker must keep no-production-without-human-review guard."
  );
  assert(handoff.arbitration_guard.production_candidate_created === false, "Static evidence blocker must not create production candidates.");
  assert(handoff.arbitration_guard.direct_memory_write_performed === false, "Static evidence blocker must not write memory directly.");
  assert(handoff.arbitration_guard.accepted_samples_write_performed === false, "Static evidence blocker must not write accepted samples.");
}

function assertReviewBlockerArbiterStaticHandoff(handoff, adapterExample) {
  assert(handoff, "Static mock must expose review_blocker_arbiter_static_handoff.");
  assert(handoff.status === "draft_ready", "Review blocker arbiter static handoff must be draft_ready.");
  assert(handoff.display_only === true, "Review blocker arbiter static handoff must be display-only.");
  assert(
    handoff.source_adapter_response_ref === "tests/schema_examples/pvos_kernel_dry_run_adapter_response.example.json",
    "Review blocker arbiter static handoff must cite the PVOS adapter fixture."
  );
  assert(handoff.review_blocker_arbiter_attached === true, "Review blocker arbiter static handoff must mark arbiter attached.");

  const arbiter = adapterExample.review_blocker_arbiter;
  const adapterHandoff = adapterExample.review_blocker_arbiter_handoff_draft;
  const adapterGuardSummary = adapterExample.review_console_handoff_draft.review_blocker_arbiter_guard_summary;
  assert(arbiter, "PVOS adapter example must include review_blocker_arbiter.");
  assert(adapterHandoff, "PVOS adapter example must include review_blocker_arbiter_handoff_draft.");
  assert(adapterGuardSummary, "PVOS adapter example must include Review Console blocker arbiter guard summary.");
  assert(
    handoff.review_blocker_arbiter_handoff_id === adapterExample.review_console_handoff_draft.review_blocker_arbiter_handoff_id,
    "Static blocker arbiter handoff id must match Review Console adapter handoff."
  );
  assert(handoff.arbiter_id === adapterHandoff.arbiter_id, "Static blocker arbiter arbiter_id must match adapter handoff.");
  assert(
    handoff.source_evidence_blocker_contract_id === adapterHandoff.source_evidence_blocker_contract_id,
    "Static blocker arbiter source evidence contract must match adapter handoff."
  );
  assert(
    handoff.candidate_arbitrations.length === arbiter.candidate_arbitrations.length,
    "Static blocker arbiter must carry candidate arbitrations."
  );
  assertDeepEqual(
    handoff.final_route_by_candidate,
    adapterHandoff.final_route_by_candidate,
    "Static blocker arbiter final routes must match adapter handoff."
  );
  assertArrayEqual(
    handoff.production_blocked_candidate_ids,
    adapterHandoff.production_blocked_candidate_ids,
    "Static blocker arbiter production blocked IDs must match adapter handoff"
  );

  const summary = handoff.arbiter_summary;
  for (const key of [
    "candidate_count",
    "passed_candidate_count",
    "rejected_candidate_count",
    "memory_draft_candidate_count",
    "memory_forbidden_count",
    "never_production_count",
    "production_blocked_count",
    "permanent_block_count",
    "human_review_required_count",
  ]) {
    assert(summary[key] === arbiter.arbiter_summary[key], `Static blocker arbiter summary ${key} must match adapter arbiter.`);
  }
  assert(summary.all_production_blocked === true, "Static blocker arbiter must keep all production blocked.");
  assert(summary.all_writes_blocked === true, "Static blocker arbiter must keep all writes blocked.");
  assert(summary.direct_memory_write_performed === false, "Static blocker arbiter must not write memory directly.");
  assert(summary.production_candidate_created === false, "Static blocker arbiter must not create production candidates.");
  assert(summary.accepted_samples_write_performed === false, "Static blocker arbiter must not write accepted samples.");

  const guardSummary = handoff.review_blocker_arbiter_guard_summary;
  for (const key of [
    "candidate_count",
    "memory_forbidden_count",
    "never_production_count",
    "production_blocked_count",
  ]) {
    assert(guardSummary[key] === adapterGuardSummary[key], `Static blocker arbiter guard ${key} must match adapter Review Console guard.`);
  }
  assertArrayEqual(
    guardSummary.memory_forbidden_candidate_ids,
    adapterGuardSummary.memory_forbidden_candidate_ids,
    "Static blocker arbiter memory forbidden IDs must match adapter guard"
  );
  assertArrayEqual(
    guardSummary.never_production_candidate_ids,
    adapterGuardSummary.never_production_candidate_ids,
    "Static blocker arbiter never production IDs must match adapter guard"
  );
  assert(guardSummary.production_promotion_allowed_now === false, "Static blocker arbiter must block production promotion now.");
  assert(guardSummary.memory_entry_allowed_now === false, "Static blocker arbiter must block memory entry now.");
  assert(guardSummary.production_candidate_created === false, "Static blocker arbiter guard must not create production candidates.");
  assert(guardSummary.direct_memory_write_performed === false, "Static blocker arbiter guard must not write memory directly.");
  assert(guardSummary.accepted_samples_write_performed === false, "Static blocker arbiter guard must not write accepted samples.");
  assert(guardSummary.memory_forbidden_prevents_memory === true, "Static blocker arbiter guard must block memory-forbidden memory.");
  assert(guardSummary.never_production_prevents_production === true, "Static blocker arbiter guard must block never-production promotion.");
  assert(guardSummary.human_review_required_before_production === true, "Static blocker arbiter guard must require human review before production.");

  const passRoute = handoff.candidate_arbitrations.find((item) => item.candidate_id === "candidate_accept_metadata_001");
  const rejectRoute = handoff.candidate_arbitrations.find((item) => item.candidate_id === "candidate_reject_metadata_001");
  assert(passRoute, "Static blocker arbiter must include pass candidate route.");
  assert(rejectRoute, "Static blocker arbiter must include reject candidate route.");
  assert(passRoute.final_route === "pass_draft_only_pending_human_review", "Pass candidate must remain pass draft pending human review.");
  assert(passRoute.production_decision === "block_until_human_review", "Pass candidate production must be blocked until human review.");
  assert(passRoute.memory_decision === "block_until_human_memory_approval", "Pass candidate memory must be blocked until human memory approval.");
  assert(passRoute.production_promotion_allowed_now === false, "Pass candidate must not be promotable now.");
  assert(passRoute.memory_entry_allowed_now === false, "Pass candidate must not enter memory now.");
  assert(passRoute.production_candidate_created === false, "Pass candidate must not create production candidate.");
  assert(passRoute.direct_memory_write_performed === false, "Pass candidate must not write memory directly.");
  assert(passRoute.accepted_samples_write_performed === false, "Pass candidate must not write accepted samples.");
  assert(rejectRoute.final_route === "reject_failure_learning_only_never_production", "Reject candidate must remain failure-learning-only never production.");
  assert(rejectRoute.production_decision === "block_permanently", "Reject candidate production must be permanently blocked.");
  assert(rejectRoute.never_production === true, "Reject candidate must stay never production.");
  assert(rejectRoute.production_promotion_allowed_now === false, "Reject candidate must not be promotable now.");
  assert(rejectRoute.memory_entry_allowed_now === false, "Reject candidate must not enter memory now.");
  assert(rejectRoute.production_candidate_created === false, "Reject candidate must not create production candidate.");
  assert(rejectRoute.direct_memory_write_performed === false, "Reject candidate must not write memory directly.");
  assert(rejectRoute.accepted_samples_write_performed === false, "Reject candidate must not write accepted samples.");

  assert(handoff.promotion_guard.evidence_required_for_every_candidate === true, "Static blocker arbiter must require evidence for every candidate.");
  assert(handoff.promotion_guard.blocker_required_for_every_candidate === true, "Static blocker arbiter must require blockers for every candidate.");
  assert(handoff.promotion_guard.memory_forbidden_prevents_memory === true, "Static blocker arbiter must prevent forbidden memory.");
  assert(handoff.promotion_guard.never_production_prevents_production === true, "Static blocker arbiter must prevent never-production promotion.");
  assert(handoff.promotion_guard.pass_is_not_production_approval === true, "Static blocker arbiter must keep pass-is-not-production-approval.");
  assert(handoff.promotion_guard.human_review_required_before_production === true, "Static blocker arbiter must require human review before production.");
  assert(handoff.promotion_guard.production_candidate_created === false, "Static blocker arbiter promotion guard must not create production candidates.");
  assert(handoff.promotion_guard.direct_memory_write_performed === false, "Static blocker arbiter promotion guard must not write memory directly.");
  assert(handoff.promotion_guard.accepted_samples_write_performed === false, "Static blocker arbiter promotion guard must not write accepted samples.");

  for (const key of [
    "provider_contact_performed",
    "plugin_call_performed",
    "api_call_performed",
    "daily_note_write_performed",
    "vcp_memory_write_performed",
    "image_generation_performed",
    "output_file_write_performed",
    "accepted_samples_write_performed",
    "production_candidate_created",
    "external_manifest_read_performed",
    "vcpchat_source_read_performed",
    "vcptoolbox_source_read_performed",
  ]) {
    assert(handoff.no_execution_guard[key] === false, `Static blocker arbiter no-execution guard ${key} must be false.`);
  }
}

function assertReviewReportStaticHandoff(handoff, adapterExample) {
  assert(handoff, "Static mock must expose review_report_static_handoff.");
  assert(handoff.status === "draft_ready", "ReviewReport static handoff must be draft_ready.");
  assert(handoff.display_only === true, "ReviewReport static handoff must be display-only.");
  assert(
    handoff.source_adapter_response_ref === "tests/schema_examples/pvos_kernel_dry_run_adapter_response.example.json",
    "ReviewReport static handoff must cite the PVOS adapter fixture."
  );
  assert(handoff.review_report_contract_attached === true, "ReviewReport static handoff must mark report contract attached.");

  const report = adapterExample.review_report_contract;
  const adapterHandoff = adapterExample.review_report_handoff_draft;
  const adapterGuardSummary = adapterExample.review_console_handoff_draft.review_report_guard_summary;
  assert(report, "PVOS adapter example must include review_report_contract.");
  assert(adapterHandoff, "PVOS adapter example must include review_report_handoff_draft.");
  assert(adapterGuardSummary, "PVOS adapter example must include Review Console review report guard summary.");
  assert(
    handoff.review_report_handoff_id === adapterExample.review_console_handoff_draft.review_report_handoff_id,
    "Static ReviewReport handoff id must match Review Console adapter handoff."
  );
  assert(handoff.review_report_id === adapterHandoff.review_report_id, "Static ReviewReport id must match adapter handoff.");
  assert(
    handoff.source_review_blocker_arbiter_id === adapterHandoff.source_review_blocker_arbiter_id,
    "Static ReviewReport source arbiter must match adapter handoff."
  );
  assert(
    handoff.source_evidence_blocker_contract_id === adapterHandoff.source_evidence_blocker_contract_id,
    "Static ReviewReport source evidence contract must match adapter handoff."
  );
  assert(
    handoff.source_decision_package_id === adapterHandoff.source_decision_package_id,
    "Static ReviewReport source decision package must match adapter handoff."
  );
  assert(
    handoff.source_protocol_id === adapterHandoff.source_protocol_id,
    "Static ReviewReport source protocol must match adapter handoff."
  );
  assert(
    handoff.source_kernel_run_id === adapterHandoff.source_kernel_run_id,
    "Static ReviewReport source kernel run must match adapter handoff."
  );
  assertArrayEqual(
    handoff.required_review_report_fields,
    adapterHandoff.required_review_report_fields,
    "Static ReviewReport required fields must match adapter handoff"
  );
  assertDeepEqual(
    handoff.report_items,
    report.report_items,
    "Static ReviewReport items must match adapter report contract."
  );

  const summary = handoff.report_summary;
  for (const key of [
    "candidate_count",
    "pass_count",
    "reject_count",
    "memory_entry_allowed_now_count",
    "production_promotion_allowed_now_count",
    "writes_allowed_now_count",
    "never_production_count",
  ]) {
    assert(summary[key] === adapterHandoff[key], `Static ReviewReport summary ${key} must match adapter handoff.`);
  }
  assert(summary.report_items_explain_all_candidates === true, "Static ReviewReport must explain all candidates.");
  assert(summary.all_memory_writes_blocked === true, "Static ReviewReport must block all memory writes.");
  assert(summary.all_production_writes_blocked === true, "Static ReviewReport must block all production writes.");
  assert(summary.all_provider_execution_blocked === true, "Static ReviewReport must block all provider execution.");
  assert(summary.all_candidates_have_evidence_record === true, "Static ReviewReport must require evidence for every candidate.");
  assert(summary.all_candidates_have_blocker_decision === true, "Static ReviewReport must require blocker decisions.");

  const guardSummary = handoff.review_report_guard_summary;
  for (const key of [
    "candidate_count",
    "pass_count",
    "reject_count",
    "never_production_count",
    "memory_entry_allowed_now_count",
    "production_promotion_allowed_now_count",
    "writes_allowed_now_count",
  ]) {
    assert(guardSummary[key] === adapterGuardSummary[key], `Static ReviewReport guard ${key} must match adapter guard.`);
  }
  assertArrayEqual(
    guardSummary.never_production_candidate_ids,
    adapterGuardSummary.never_production_candidate_ids,
    "Static ReviewReport never-production IDs must match adapter guard"
  );
  assertArrayEqual(
    guardSummary.memory_forbidden_candidate_ids,
    adapterGuardSummary.memory_forbidden_candidate_ids,
    "Static ReviewReport memory-forbidden IDs must match adapter guard"
  );
  assert(guardSummary.all_memory_writes_blocked === true, "Static ReviewReport guard must block memory writes.");
  assert(guardSummary.all_production_writes_blocked === true, "Static ReviewReport guard must block production writes.");
  assert(guardSummary.all_provider_execution_blocked === true, "Static ReviewReport guard must block provider execution.");
  assert(guardSummary.production_candidate_created === false, "Static ReviewReport guard must not create production candidates.");
  assert(guardSummary.direct_memory_write_performed === false, "Static ReviewReport guard must not write memory directly.");
  assert(guardSummary.daily_note_write_performed === false, "Static ReviewReport guard must not write DailyNote.");
  assert(guardSummary.vcp_memory_write_performed === false, "Static ReviewReport guard must not write VCP memory.");
  assert(guardSummary.accepted_samples_write_performed === false, "Static ReviewReport guard must not write accepted samples.");

  const passItem = handoff.report_items.find((item) => item.candidate_id === "candidate_accept_metadata_001");
  const rejectItem = handoff.report_items.find((item) => item.candidate_id === "candidate_reject_metadata_001");
  assert(passItem, "Static ReviewReport must include pass candidate report item.");
  assert(rejectItem, "Static ReviewReport must include reject candidate report item.");
  assert(passItem.review_outcome === "pass", "Pass ReviewReport item must pass.");
  assert(passItem.pass_reasons.length > 0, "Pass ReviewReport item must explain pass reasons.");
  assert(passItem.reject_reasons.length === 0, "Pass ReviewReport item must not carry reject reasons.");
  assert(passItem.memory_report.memory_entry_allowed_now === false, "Pass ReviewReport item must block memory entry now.");
  assert(passItem.production_report.production_promotion_allowed_now === false, "Pass ReviewReport item must block production now.");
  assert(passItem.production_report.production_candidate_created === false, "Pass ReviewReport item must not create production candidate.");
  assert(passItem.production_report.accepted_samples_write_performed === false, "Pass ReviewReport item must not write accepted samples.");
  assert(passItem.final_controls.may_enter_memory_now === false, "Pass ReviewReport item must not enter memory now.");
  assert(passItem.final_controls.may_enter_production_now === false, "Pass ReviewReport item must not enter production now.");
  assert(passItem.final_controls.writes_allowed_now.length === 0, "Pass ReviewReport item must allow no writes now.");
  assert(rejectItem.review_outcome === "reject", "Reject ReviewReport item must reject.");
  assert(rejectItem.reject_reasons.length > 0, "Reject ReviewReport item must explain reject reasons.");
  assert(rejectItem.pass_reasons.length === 0, "Reject ReviewReport item must not carry pass reasons.");
  assert(rejectItem.failure_tags.includes("lighting_flat"), "Reject ReviewReport item must carry mapped failure tags.");
  assert(rejectItem.production_report.never_production === true, "Reject ReviewReport item must stay never-production.");
  assert(rejectItem.production_report.production_candidate_created === false, "Reject ReviewReport item must not create production candidate.");
  assert(rejectItem.production_report.accepted_samples_write_performed === false, "Reject ReviewReport item must not write accepted samples.");
  assert(rejectItem.memory_report.memory_entry_allowed_now === false, "Reject ReviewReport item must block memory entry now.");
  assert(rejectItem.final_controls.execution_blocked.includes("production_forever"), "Reject ReviewReport item must block production forever.");
  assert(rejectItem.final_controls.writes_allowed_now.length === 0, "Reject ReviewReport item must allow no writes now.");

  for (const key of [
    "provider_contact_performed",
    "plugin_call_performed",
    "api_call_performed",
    "daily_note_write_performed",
    "vcp_memory_write_performed",
    "image_generation_performed",
    "output_file_write_performed",
    "accepted_samples_write_performed",
    "production_candidate_created",
  ]) {
    assert(handoff.no_execution_guard[key] === false, `Static ReviewReport no-execution guard ${key} must be false.`);
  }
}

function assertAdapterNegativeStaticHandoff(handoff, negativeAdapterExample) {
  assert(handoff, "Static mock must expose review_evidence_blocker_adapter_negative_static_handoff.");
  assert(handoff.status === "draft_ready", "Adapter negative static handoff must be draft_ready.");
  assert(handoff.display_only === true, "Adapter negative static handoff must be display-only.");
  assert(
    handoff.source_adapter_response_ref === "tests/schema_examples/pvos_kernel_dry_run_adapter_negative_guard_response.example.json",
    "Adapter negative static handoff must cite the negative adapter fixture."
  );
  assert(
    handoff.source_evidence_blocker_fixture_ref === "tests/schema_examples/evidence_blocker_contract_negative_guard.example.json",
    "Adapter negative static handoff must cite the evidence blocker golden fixture."
  );
  assert(handoff.adapter_negative_guard_observed === true, "Adapter negative static handoff must observe negative guard.");
  assert(handoff.evidence_blocker_contract_embedded === true, "Adapter negative static handoff must mark embedded evidence blocker contract.");
  assert(handoff.evidence_blocker_contract_matches_fixture === true, "Adapter negative static handoff must verify golden fixture match.");

  const adapterHandoff = negativeAdapterExample.evidence_blocker_contract_handoff_draft;
  const adapterGuard = negativeAdapterExample.review_console_handoff_draft.review_evidence_blocker_contract_guard_summary;
  const audit = negativeAdapterExample.audit_record;
  assert(adapterHandoff, "Negative adapter example must include evidence blocker handoff.");
  assert(adapterGuard, "Negative adapter example must include Review Console evidence blocker guard summary.");
  assert(audit, "Negative adapter example must include audit record.");
  assert(
    handoff.evidence_blocker_contract_handoff_id === adapterHandoff.handoff_id,
    "Adapter negative static handoff id must match negative adapter handoff."
  );
  assertArrayEqual(
    handoff.memory_forbidden_candidate_ids,
    adapterHandoff.memory_forbidden_candidate_ids,
    "Adapter negative memory forbidden IDs must match negative adapter handoff"
  );
  assertArrayEqual(
    handoff.production_exclusion_candidate_ids,
    adapterHandoff.production_exclusion_candidate_ids,
    "Adapter negative production exclusion IDs must match negative adapter handoff"
  );
  assertArrayEqual(
    handoff.rejected_candidate_ids,
    negativeAdapterExample.review_console_handoff_draft.rejected_candidate_ids,
    "Adapter negative rejected candidate IDs must match Review Console handoff"
  );

  const guard = handoff.guard_summary;
  for (const key of [
    "evidence_record_count",
    "blocker_decision_count",
    "production_exclusion_count",
    "permanent_block_count",
    "human_review_block_count",
    "memory_forbidden_block_count",
  ]) {
    assert(guard[key] === adapterGuard[key], `Adapter negative guard ${key} must match adapter fixture.`);
  }
  assert(guard.production_candidate_created === false, "Adapter negative guard must not create production candidates.");
  assert(guard.direct_memory_write_performed === false, "Adapter negative guard must not write memory directly.");
  assert(guard.accepted_samples_write_performed === false, "Adapter negative guard must not write accepted samples.");
  assert(guard.every_candidate_has_evidence_record === true, "Adapter negative guard must prove every candidate has evidence.");
  assert(
    guard.every_candidate_has_production_blocker_decision === true,
    "Adapter negative guard must prove every candidate has production blocker."
  );
  assert(
    guard.every_never_production_candidate_has_exclusion === true,
    "Adapter negative guard must prove every never-production candidate has exclusion."
  );

  assert(handoff.audit_summary.accepted_sample_draft_count === audit.accepted_sample_draft_count, "Adapter negative audit accepted count must match.");
  assert(handoff.audit_summary.rejected_sample_draft_count === audit.rejected_sample_draft_count, "Adapter negative audit rejected count must match.");
  assert(handoff.audit_summary.memory_delta_draft_count === audit.memory_delta_draft_count, "Adapter negative audit memory delta count must match.");
  assert(handoff.audit_summary.production_exclusion_count === audit.production_exclusion_count, "Adapter negative audit production exclusion count must match.");
  assert(handoff.audit_summary.never_production_count === audit.never_production_count, "Adapter negative audit never-production count must match.");
  assert(handoff.audit_summary.memory_forbidden_count === audit.memory_forbidden_count, "Adapter negative audit memory forbidden count must match.");
  assert(handoff.audit_summary.selected_plugin === null, "Adapter negative audit must keep selected_plugin null.");
  assert(handoff.audit_summary.max_plugin_calls_observed === 0, "Adapter negative audit must keep plugin calls at zero.");
  assert(handoff.audit_summary.production_candidate_created === false, "Adapter negative audit must not create production candidates.");
  assert(handoff.audit_summary.external_api_observed === false, "Adapter negative audit must not observe external API.");
  assert(handoff.audit_summary.image_generation_observed === false, "Adapter negative audit must not observe image generation.");
  assert(handoff.audit_summary.memory_write_observed === false, "Adapter negative audit must not observe memory write.");

  assert(
    handoff.blocker_highlights.some(
      (item) =>
        item.candidate_id === "candidate_reject_unknown_guard_001" &&
        item.memory_route === "forbidden" &&
        item.production_route === "never_production" &&
        item.production_candidate === false &&
        item.direct_write_performed === false
    ),
    "Adapter negative UI must expose unknown failure as memory forbidden and never production."
  );
  assert(
    handoff.production_exclusion_candidate_ids.includes("candidate_reject_mapped_guard_001") &&
      handoff.production_exclusion_candidate_ids.includes("candidate_reject_unknown_guard_001"),
    "Adapter negative UI must expose both rejected candidates as production exclusions."
  );

  for (const key of [
    "provider_contact_performed",
    "plugin_call_performed",
    "api_call_performed",
    "daily_note_write_performed",
    "vcp_memory_write_performed",
    "image_generation_performed",
    "output_file_write_performed",
    "accepted_samples_write_performed",
    "production_candidate_created",
  ]) {
    assert(handoff.no_execution_guard[key] === false, `Adapter negative no-execution guard ${key} must be false.`);
  }
}

function assertAdapterNegativeDraftOutputSnapshot(snapshot, mock, renderedDraft, negativeAdapterExample) {
  assert(snapshot, "Adapter negative draft output snapshot must exist.");
  assert(snapshot.status === "draft_output_snapshot", "Adapter negative snapshot must be draft_output_snapshot.");
  assert(snapshot.display_only === true, "Adapter negative snapshot must be display-only.");
  assert(
    snapshot.source_phase === "v14_054_review_console_adapter_negative_fixture_ui_binding_gate",
    "Adapter negative snapshot must cite v14.054 as source phase."
  );
  assert(
    snapshot.snapshot_phase === "v14_055_review_console_adapter_negative_fixture_draft_output_snapshot_gate",
    "Adapter negative snapshot must cite v14.055 as snapshot phase."
  );
  assert(
    snapshot.source_adapter_response_ref === "tests/schema_examples/pvos_kernel_dry_run_adapter_negative_guard_response.example.json",
    "Adapter negative snapshot must cite the negative adapter fixture."
  );
  assert(
    snapshot.source_evidence_blocker_fixture_ref === "tests/schema_examples/evidence_blocker_contract_negative_guard.example.json",
    "Adapter negative snapshot must cite the evidence blocker fixture."
  );

  for (const key of snapshot.draft_output_required_keys) {
    assert(Object.prototype.hasOwnProperty.call(renderedDraft, key), `Rendered draft output must include ${key}.`);
  }

  const renderedHandoff = renderedDraft.review_evidence_blocker_adapter_negative_static_handoff;
  const mockHandoff = mock.review_evidence_blocker_adapter_negative_static_handoff;
  const snapshotHandoff = snapshot.review_evidence_blocker_adapter_negative_static_handoff;
  assertDeepEqual(snapshotHandoff, mockHandoff, "Adapter negative snapshot handoff must match static mock handoff.");
  assertDeepEqual(renderedHandoff, snapshotHandoff, "Rendered draft output adapter negative handoff must match snapshot.");
  assertAdapterNegativeStaticHandoff(snapshotHandoff, negativeAdapterExample);

  assertDeepEqual(renderedDraft.prototype_guard, snapshot.prototype_guard, "Rendered draft prototype guard must match snapshot.");
  assert(renderedDraft.prototype_guard.api_called === false, "Rendered draft must not call API.");
  assert(renderedDraft.prototype_guard.daily_note_called === false, "Rendered draft must not call DailyNote.");
  assert(renderedDraft.prototype_guard.vcp_plugin_called === false, "Rendered draft must not call VCP plugin.");
  assert(renderedDraft.prototype_guard.disk_write_performed === false, "Rendered draft must not write disk.");
  assert(renderedDraft.prototype_guard.image_file_created === false, "Rendered draft must not create image files.");

  const assertions = snapshot.snapshot_assertions;
  assert(assertions.adapter_negative_handoff_present_in_draft_output === true, "Snapshot must assert handoff presence.");
  assert(assertions.adapter_negative_guard_observed === renderedHandoff.adapter_negative_guard_observed, "Snapshot must assert negative guard state.");
  assert(
    assertions.evidence_blocker_contract_matches_fixture === renderedHandoff.evidence_blocker_contract_matches_fixture,
    "Snapshot must assert fixture match state."
  );
  assertArrayEqual(
    assertions.memory_forbidden_candidate_ids,
    renderedHandoff.memory_forbidden_candidate_ids,
    "Snapshot memory-forbidden IDs must match rendered draft"
  );
  assertArrayEqual(
    assertions.production_exclusion_candidate_ids,
    renderedHandoff.production_exclusion_candidate_ids,
    "Snapshot production-exclusion IDs must match rendered draft"
  );
  assertArrayEqual(
    assertions.rejected_candidate_ids,
    renderedHandoff.rejected_candidate_ids,
    "Snapshot rejected candidate IDs must match rendered draft"
  );
  assert(assertions.never_production_count === renderedHandoff.audit_summary.never_production_count, "Snapshot never-production count must match.");
  assert(assertions.memory_forbidden_count === renderedHandoff.audit_summary.memory_forbidden_count, "Snapshot memory-forbidden count must match.");
  assert(assertions.production_candidate_created === false, "Snapshot must assert no production candidate.");
  assert(assertions.direct_memory_write_performed === false, "Snapshot must assert no direct memory write.");
  assert(assertions.accepted_samples_write_performed === false, "Snapshot must assert no accepted_samples write.");
  assert(assertions.selected_plugin === null, "Snapshot must assert selected_plugin null.");
  assert(assertions.max_plugin_calls_observed === 0, "Snapshot must assert zero plugin calls.");

  for (const key of [
    "provider_contact_performed",
    "plugin_call_performed",
    "api_call_performed",
    "daily_note_write_performed",
    "vcp_memory_write_performed",
    "image_generation_performed",
    "output_file_write_performed"
  ]) {
    assert(assertions[key] === false, `Snapshot assertion ${key} must be false.`);
    assert(renderedHandoff.no_execution_guard[key] === false, `Rendered draft no-execution guard ${key} must be false.`);
  }
  assert(
    renderedHandoff.no_execution_guard.accepted_samples_write_performed === false,
    "Rendered draft no-execution guard accepted_samples_write_performed must be false."
  );
  assert(
    renderedHandoff.no_execution_guard.production_candidate_created === false,
    "Rendered draft no-execution guard production_candidate_created must be false."
  );
}

function assertReviewBlockerArbiterDraftOutputSnapshot(snapshot, mock, renderedDraft, adapterExample) {
  assert(snapshot, "Review blocker arbiter draft output snapshot must exist.");
  assert(snapshot.status === "draft_output_snapshot", "Review blocker arbiter snapshot must be draft_output_snapshot.");
  assert(snapshot.display_only === true, "Review blocker arbiter snapshot must be display-only.");
  assert(
    snapshot.source_phase === "v14_060_review_console_blocker_arbiter_ui_binding_gate",
    "Review blocker arbiter snapshot must cite v14.060 as source phase."
  );
  assert(
    snapshot.snapshot_phase === "v14_061_review_console_blocker_arbiter_draft_output_snapshot_gate",
    "Review blocker arbiter snapshot must cite v14.061 as snapshot phase."
  );
  assert(
    snapshot.source_adapter_response_ref === "tests/schema_examples/pvos_kernel_dry_run_adapter_response.example.json",
    "Review blocker arbiter snapshot must cite the PVOS adapter fixture."
  );

  for (const key of snapshot.draft_output_required_keys) {
    assert(Object.prototype.hasOwnProperty.call(renderedDraft, key), `Rendered draft output must include ${key}.`);
  }

  const renderedHandoff = renderedDraft.review_blocker_arbiter_static_handoff;
  const mockHandoff = mock.review_blocker_arbiter_static_handoff;
  const snapshotHandoff = snapshot.review_blocker_arbiter_static_handoff;
  assertDeepEqual(snapshotHandoff, mockHandoff, "Review blocker arbiter snapshot handoff must match static mock handoff.");
  assertDeepEqual(renderedHandoff, snapshotHandoff, "Rendered draft output blocker arbiter handoff must match snapshot.");
  assertReviewBlockerArbiterStaticHandoff(snapshotHandoff, adapterExample);

  assertDeepEqual(renderedDraft.prototype_guard, snapshot.prototype_guard, "Rendered draft prototype guard must match blocker arbiter snapshot.");
  assert(renderedDraft.prototype_guard.api_called === false, "Rendered draft must not call API.");
  assert(renderedDraft.prototype_guard.daily_note_called === false, "Rendered draft must not call DailyNote.");
  assert(renderedDraft.prototype_guard.vcp_plugin_called === false, "Rendered draft must not call VCP plugin.");
  assert(renderedDraft.prototype_guard.disk_write_performed === false, "Rendered draft must not write disk.");
  assert(renderedDraft.prototype_guard.image_file_created === false, "Rendered draft must not create image files.");

  const assertions = snapshot.snapshot_assertions;
  assert(assertions.blocker_arbiter_handoff_present_in_draft_output === true, "Snapshot must assert blocker arbiter handoff presence.");
  assert(
    assertions.review_blocker_arbiter_attached === renderedHandoff.review_blocker_arbiter_attached,
    "Snapshot must assert blocker arbiter attachment state."
  );
  assertArrayEqual(
    assertions.candidate_ids,
    renderedHandoff.candidate_arbitrations.map((item) => item.candidate_id),
    "Snapshot candidate IDs must match rendered draft"
  );
  assertArrayEqual(
    assertions.production_blocked_candidate_ids,
    renderedHandoff.production_blocked_candidate_ids,
    "Snapshot production-blocked IDs must match rendered draft"
  );
  assertArrayEqual(
    assertions.never_production_candidate_ids,
    renderedHandoff.review_blocker_arbiter_guard_summary.never_production_candidate_ids,
    "Snapshot never-production IDs must match rendered draft"
  );
  assertDeepEqual(
    assertions.final_route_by_candidate,
    renderedHandoff.final_route_by_candidate,
    "Snapshot final routes must match rendered draft."
  );
  assert(
    assertions.pass_is_not_production_approval === renderedHandoff.promotion_guard.pass_is_not_production_approval,
    "Snapshot must assert pass-is-not-production-approval guard."
  );
  assert(
    assertions.human_review_required_before_production === renderedHandoff.promotion_guard.human_review_required_before_production,
    "Snapshot must assert human-review-before-production guard."
  );
  assert(assertions.production_promotion_allowed_now === false, "Snapshot must assert production promotion is blocked now.");
  assert(assertions.memory_entry_allowed_now === false, "Snapshot must assert memory entry is blocked now.");
  assert(
    renderedHandoff.review_blocker_arbiter_guard_summary.production_promotion_allowed_now === false,
    "Rendered blocker arbiter must block production promotion now."
  );
  assert(
    renderedHandoff.review_blocker_arbiter_guard_summary.memory_entry_allowed_now === false,
    "Rendered blocker arbiter must block memory entry now."
  );
  assert(assertions.production_candidate_created === false, "Snapshot must assert no production candidate.");
  assert(assertions.direct_memory_write_performed === false, "Snapshot must assert no direct memory write.");
  assert(assertions.accepted_samples_write_performed === false, "Snapshot must assert no accepted_samples write.");
  assert(renderedHandoff.arbiter_summary.production_candidate_created === false, "Rendered blocker arbiter must not create production candidates.");
  assert(renderedHandoff.arbiter_summary.direct_memory_write_performed === false, "Rendered blocker arbiter must not write memory directly.");
  assert(renderedHandoff.arbiter_summary.accepted_samples_write_performed === false, "Rendered blocker arbiter must not write accepted samples.");

  for (const key of [
    "provider_contact_performed",
    "plugin_call_performed",
    "api_call_performed",
    "daily_note_write_performed",
    "vcp_memory_write_performed",
    "image_generation_performed",
    "output_file_write_performed"
  ]) {
    assert(assertions[key] === false, `Blocker arbiter snapshot assertion ${key} must be false.`);
    assert(renderedHandoff.no_execution_guard[key] === false, `Rendered blocker arbiter no-execution guard ${key} must be false.`);
  }
  assert(
    renderedHandoff.no_execution_guard.accepted_samples_write_performed === false,
    "Rendered blocker arbiter no-execution guard accepted_samples_write_performed must be false."
  );
  assert(
    renderedHandoff.no_execution_guard.production_candidate_created === false,
    "Rendered blocker arbiter no-execution guard production_candidate_created must be false."
  );
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
  const pvosAdapterNegativeExample = parseJson(
    read("tests/schema_examples/pvos_kernel_dry_run_adapter_negative_guard_response.example.json"),
    "PVOS adapter negative example"
  );
  const adapterNegativeDraftOutputSnapshot = parseJson(
    read("tests/schema_examples/review_console_adapter_negative_fixture_draft_output_snapshot.example.json"),
    "Review Console adapter negative draft output snapshot"
  );
  const reviewBlockerArbiterDraftOutputSnapshot = parseJson(
    read("tests/schema_examples/review_console_blocker_arbiter_draft_output_snapshot.example.json"),
    "Review Console blocker arbiter draft output snapshot"
  );
  const renderedDraftOutput = loadRenderedStaticDraft(mock);

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
  assertReviewDecisionPackageHandoff(mock.review_decision_package_static_handoff, pvosAdapterExample);
  assertEvidenceBlockerContractHandoff(mock.review_evidence_blocker_contract_static_handoff, pvosAdapterExample);
  assertReviewBlockerArbiterStaticHandoff(mock.review_blocker_arbiter_static_handoff, pvosAdapterExample);
  assertDeepEqual(
    renderedDraftOutput.review_blocker_arbiter_static_handoff,
    mock.review_blocker_arbiter_static_handoff,
    "Rendered draft output blocker arbiter handoff must match static mock handoff."
  );
  assertReviewReportStaticHandoff(mock.review_report_static_handoff, pvosAdapterExample);
  assertDeepEqual(
    renderedDraftOutput.review_report_static_handoff,
    mock.review_report_static_handoff,
    "Rendered draft output ReviewReport handoff must match static mock handoff."
  );
  assertAdapterNegativeStaticHandoff(
    mock.review_evidence_blocker_adapter_negative_static_handoff,
    pvosAdapterNegativeExample
  );
  assertAdapterNegativeDraftOutputSnapshot(
    adapterNegativeDraftOutputSnapshot,
    mock,
    renderedDraftOutput,
    pvosAdapterNegativeExample
  );
  assertReviewBlockerArbiterDraftOutputSnapshot(
    reviewBlockerArbiterDraftOutputSnapshot,
    mock,
    renderedDraftOutput,
    pvosAdapterExample
  );

  const appSource = read("review_console/static_prototype/app.js");
  const indexSource = read("review_console/static_prototype/index.html");
  const styleSource = read("review_console/static_prototype/styles.css");
  assert(appSource.includes("adapter_dry_run_handoff"), "Static app must carry adapter_dry_run_handoff into draft output.");
  assert(
    appSource.includes("review_result_protocol_static_handoff"),
    "Static app must carry review_result_protocol_static_handoff into draft output."
  );
  assert(
    appSource.includes("review_decision_package_static_handoff"),
    "Static app must carry review_decision_package_static_handoff into draft output."
  );
  assert(
    appSource.includes("review_evidence_blocker_contract_static_handoff"),
    "Static app must carry review_evidence_blocker_contract_static_handoff into draft output."
  );
  assert(
    appSource.includes("review_blocker_arbiter_static_handoff"),
    "Static app must carry review_blocker_arbiter_static_handoff into draft output."
  );
  assert(
    appSource.includes("review_report_static_handoff"),
    "Static app must carry review_report_static_handoff into draft output."
  );
  assert(
    appSource.includes("review_evidence_blocker_adapter_negative_static_handoff"),
    "Static app must carry review_evidence_blocker_adapter_negative_static_handoff into draft output."
  );
  assert(appSource.includes("renderProtocolHandoff"), "Static app must render review protocol handoff.");
  assert(appSource.includes("renderDecisionPackageHandoff"), "Static app must render review decision package handoff.");
  assert(appSource.includes("renderEvidenceBlockerHandoff"), "Static app must render evidence blocker handoff.");
  assert(appSource.includes("renderReviewBlockerArbiterHandoff"), "Static app must render review blocker arbiter handoff.");
  assert(appSource.includes("renderReviewReportHandoff"), "Static app must render ReviewReport handoff.");
  assert(appSource.includes("renderAdapterNegativeHandoff"), "Static app must render adapter negative handoff.");
  assert(indexSource.includes("protocolCandidateList"), "Static HTML must expose protocol candidate list.");
  assert(indexSource.includes("protocolSummary"), "Static HTML must expose protocol summary.");
  assert(indexSource.includes("protocolGuardSummary"), "Static HTML must expose protocol guard summary.");
  assert(indexSource.includes("protocolGuard"), "Static HTML must expose protocol guard.");
  assert(indexSource.includes("decisionPackageSummary"), "Static HTML must expose decision package summary.");
  assert(indexSource.includes("decisionPackageGuardSummary"), "Static HTML must expose decision package guard summary.");
  assert(indexSource.includes("decisionPackageDraftList"), "Static HTML must expose decision package draft list.");
  assert(indexSource.includes("decisionPackageGuard"), "Static HTML must expose decision package guard.");
  assert(indexSource.includes("evidenceBlockerSummary"), "Static HTML must expose evidence blocker summary.");
  assert(indexSource.includes("evidenceBlockerGuardSummary"), "Static HTML must expose evidence blocker guard summary.");
  assert(indexSource.includes("evidenceRecordList"), "Static HTML must expose evidence record list.");
  assert(indexSource.includes("blockerDecisionList"), "Static HTML must expose blocker decision list.");
  assert(indexSource.includes("evidenceBlockerGuard"), "Static HTML must expose evidence blocker guard.");
  assert(indexSource.includes("blockerArbiterSummary"), "Static HTML must expose blocker arbiter summary.");
  assert(indexSource.includes("blockerArbiterGuardSummary"), "Static HTML must expose blocker arbiter guard summary.");
  assert(indexSource.includes("blockerArbiterRouteList"), "Static HTML must expose blocker arbiter route list.");
  assert(indexSource.includes("blockerArbiterGuard"), "Static HTML must expose blocker arbiter guard.");
  assert(indexSource.includes("reviewReportSummary"), "Static HTML must expose ReviewReport summary.");
  assert(indexSource.includes("reviewReportGuardSummary"), "Static HTML must expose ReviewReport guard summary.");
  assert(indexSource.includes("reviewReportItemList"), "Static HTML must expose ReviewReport item list.");
  assert(indexSource.includes("reviewReportGuard"), "Static HTML must expose ReviewReport guard.");
  assert(indexSource.includes("adapterNegativeSummary"), "Static HTML must expose adapter negative summary.");
  assert(indexSource.includes("adapterNegativeGuardSummary"), "Static HTML must expose adapter negative guard summary.");
  assert(indexSource.includes("adapterNegativeBlockerList"), "Static HTML must expose adapter negative blocker list.");
  assert(indexSource.includes("adapterNegativeGuard"), "Static HTML must expose adapter negative guard.");
  assert(styleSource.includes(".protocol-panel"), "Static CSS must style protocol panel.");
  assert(styleSource.includes(".protocol-card.reject"), "Static CSS must style rejected protocol cards.");
  assert(styleSource.includes(".protocol-guard-summary"), "Static CSS must style protocol guard summary.");
  assert(styleSource.includes(".guard-tile"), "Static CSS must style protocol guard tiles.");
  assert(styleSource.includes(".decision-package-section"), "Static CSS must style decision package section.");
  assert(styleSource.includes(".decision-package-card"), "Static CSS must style decision package cards.");
  assert(styleSource.includes(".evidence-blocker-section"), "Static CSS must style evidence blocker section.");
  assert(styleSource.includes(".evidence-card"), "Static CSS must style evidence cards.");
  assert(styleSource.includes(".blocker-card.permanent"), "Static CSS must style permanent blocker cards.");
  assert(styleSource.includes(".blocker-arbiter-section"), "Static CSS must style blocker arbiter section.");
  assert(styleSource.includes(".blocker-arbiter-card.never-production"), "Static CSS must style never-production blocker arbiter cards.");
  assert(styleSource.includes(".review-report-section"), "Static CSS must style ReviewReport section.");
  assert(styleSource.includes(".review-report-card.never-production"), "Static CSS must style never-production ReviewReport cards.");
  assert(styleSource.includes(".adapter-negative-section"), "Static CSS must style adapter negative section.");
  assert(styleSource.includes(".adapter-negative-card.memory-forbidden"), "Static CSS must style memory-forbidden adapter negative cards.");
  assert(appSource.includes("Never production"), "Static app must expose never production summary copy.");
  assert(appSource.includes("Memory forbidden"), "Static app must expose memory forbidden summary copy.");
  assert(appSource.includes("Negative guard"), "Static app must expose negative guard summary copy.");
  assert(appSource.includes("all production creation blocked"), "Static app must expose production-blocked guard copy.");
  assert(appSource.includes("Accepted drafts"), "Static app must expose accepted draft summary copy.");
  assert(appSource.includes("Rejected drafts"), "Static app must expose rejected draft summary copy.");
  assert(appSource.includes("Memory drafts"), "Static app must expose memory draft summary copy.");
  assert(appSource.includes("Production exclusions"), "Static app must expose production exclusion summary copy.");
  assert(appSource.includes("protocol pass is not production approval"), "Static app must expose production approval guard copy.");
  assert(appSource.includes("Evidence records"), "Static app must expose evidence record summary copy.");
  assert(appSource.includes("Blocker decisions"), "Static app must expose blocker decision summary copy.");
  assert(appSource.includes("Permanent blocks"), "Static app must expose permanent block summary copy.");
  assert(appSource.includes("Human review blocks"), "Static app must expose human review block summary copy.");
  assert(appSource.includes("evidence record is not approval"), "Static app must expose evidence-not-approval guard copy.");
  assert(appSource.includes("blocker decision is not write"), "Static app must expose blocker-not-write guard copy.");
  assert(appSource.includes("no production without human review"), "Static app must expose no-production-without-review guard copy.");
  assert(appSource.includes("Review Blocker Arbiter") || indexSource.includes("Review Blocker Arbiter"), "Static app must expose blocker arbiter copy.");
  assert(appSource.includes("Production blocked ids"), "Static app must expose blocker arbiter production-blocked IDs copy.");
  assert(appSource.includes("pass is not production approval"), "Static app must expose blocker arbiter pass-not-approval copy.");
  assert(appSource.includes("human review required before production"), "Static app must expose blocker arbiter human-review guard copy.");
  assert(appSource.includes("ReviewReport") || indexSource.includes("ReviewReport"), "Static app must expose ReviewReport copy.");
  assert(appSource.includes("Memory entries now"), "Static app must expose ReviewReport memory-entry guard copy.");
  assert(appSource.includes("Production promotions now"), "Static app must expose ReviewReport production guard copy.");
  assert(appSource.includes("Writes allowed now"), "Static app must expose ReviewReport write guard copy.");
  assert(appSource.includes("all report items explain candidates"), "Static app must expose ReviewReport explanation guard copy.");
  assert(appSource.includes("Adapter negative fixture"), "Static app must expose adapter negative fixture copy.");
  assert(appSource.includes("Golden fixture match"), "Static app must expose golden fixture match copy.");
  assert(appSource.includes("Memory forbidden IDs"), "Static app must expose memory-forbidden IDs copy.");
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
    "review_result_protocol_static_handoff.review_protocol_guard_summary",
    "never_production",
    "memory_forbidden_count",
    "negative_guard_observed",
    "production_candidate_created",
    "v14.048 Review Decision Package Static Handoff",
    "review_decision_package_static_handoff.accepted_sample_drafts",
    "review_decision_package_static_handoff.rejected_sample_drafts",
    "review_decision_package_static_handoff.memory_delta_drafts",
    "review_decision_package_static_handoff.production_exclusion_register",
    "review_decision_package_static_handoff.review_decision_package_guard_summary",
    "accepted_samples_write_performed",
    "protocol_pass_is_not_production_approval",
    "v14.051 Evidence Blocker Contract Static Handoff",
    "review_evidence_blocker_contract_static_handoff.evidence_records",
    "review_evidence_blocker_contract_static_handoff.blocker_decisions",
    "review_evidence_blocker_contract_static_handoff.production_exclusion_register",
    "review_evidence_blocker_contract_static_handoff.review_evidence_blocker_contract_guard_summary",
    "evidence_record_is_not_approval",
    "blocker_decision_is_not_write",
    "no_production_without_human_review",
    "v14.060 Review Blocker Arbiter Static Handoff",
    "review_blocker_arbiter_static_handoff",
    "review_blocker_arbiter_handoff_draft",
    "review_console_handoff_draft.review_blocker_arbiter_guard_summary",
    "review_blocker_arbiter_static_handoff.candidate_arbitrations",
    "review_blocker_arbiter_static_handoff.final_route_by_candidate",
    "review_blocker_arbiter_static_handoff.review_blocker_arbiter_guard_summary",
    "pass_draft_only_pending_human_review",
    "reject_failure_learning_only_never_production",
    "production_promotion_allowed_now",
    "memory_entry_allowed_now",
    "v14.069 ReviewReport Static Handoff",
    "review_report_static_handoff.report_items",
    "review_report_static_handoff.report_summary",
    "review_report_static_handoff.review_report_guard_summary",
    "review_report_static_handoff.no_execution_guard",
    "review_report_handoff_draft.required_review_report_fields",
    "reviewReportGuardSummary",
    "reviewReportItemList",
    "all_memory_writes_blocked",
    "v14.061 Review Blocker Arbiter Draft Output Snapshot",
    "review_console_blocker_arbiter_draft_output_snapshot.example.json",
    "blocker_arbiter_handoff_present_in_draft_output",
    "blocker_arbiter_draft_output_snapshot_matches_static_mock",
    "blocker_arbiter_draft_output_snapshot_matches_adapter_fixture",
    "v14.054 Adapter Negative Fixture Static Handoff",
    "review_evidence_blocker_adapter_negative_static_handoff.memory_forbidden_candidate_ids",
    "review_evidence_blocker_adapter_negative_static_handoff.production_exclusion_candidate_ids",
    "review_evidence_blocker_adapter_negative_static_handoff.guard_summary",
    "review_evidence_blocker_adapter_negative_static_handoff.audit_summary",
    "review_evidence_blocker_adapter_negative_static_handoff.evidence_blocker_contract_matches_fixture",
    "adapterNegativeGuardSummary",
    "adapterNegativeGuard",
    "v14.055 Adapter Negative Fixture Draft Output Snapshot",
    "review_console_adapter_negative_fixture_draft_output_snapshot.example.json",
    "adapter_negative_handoff_present_in_draft_output",
    "adapter_negative_draft_output_snapshot_matches_static_mock"
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
      review_protocol_guard_summary_verified: true,
      review_protocol_memory_forbidden_visible: true,
      review_protocol_negative_guard_visible: true,
      review_protocol_production_blocked_visible: true,
      review_protocol_never_production_ids_visible: true,
      review_protocol_visible_ui_verified: true,
      review_protocol_candidate_cards_verified: true,
      review_protocol_guard_visible: true,
      review_decision_package_static_handoff_verified: true,
      review_decision_package_guard_summary_verified: true,
      review_decision_package_accepted_drafts_visible: true,
      review_decision_package_rejected_drafts_visible: true,
      review_decision_package_memory_delta_visible: true,
      review_decision_package_production_exclusion_visible: true,
      review_decision_package_no_production_candidate_verified: true,
      review_decision_package_no_direct_memory_write_verified: true,
      review_decision_package_no_accepted_samples_write_verified: true,
      review_evidence_blocker_contract_static_handoff_verified: true,
      review_evidence_blocker_contract_guard_summary_verified: true,
      evidence_blocker_evidence_records_visible: true,
      evidence_blocker_blocker_decisions_visible: true,
      evidence_blocker_production_exclusion_visible: true,
      evidence_blocker_human_review_block_visible: true,
      evidence_blocker_never_production_visible: true,
      evidence_blocker_arbitration_guard_visible: true,
      evidence_blocker_no_production_candidate_verified: true,
      evidence_blocker_no_direct_memory_write_verified: true,
      evidence_blocker_no_accepted_samples_write_verified: true,
      review_blocker_arbiter_static_handoff_verified: true,
      review_blocker_arbiter_guard_summary_verified: true,
      blocker_arbiter_candidate_routes_visible: true,
      blocker_arbiter_pass_route_visible: true,
      blocker_arbiter_reject_never_production_visible: true,
      blocker_arbiter_production_blocked_visible: true,
      blocker_arbiter_memory_entry_blocked_visible: true,
      blocker_arbiter_no_production_candidate_verified: true,
      blocker_arbiter_no_direct_memory_write_verified: true,
      blocker_arbiter_no_accepted_samples_write_verified: true,
      blocker_arbiter_draft_output_snapshot_present: true,
      blocker_arbiter_draft_output_snapshot_matches_static_mock: true,
      blocker_arbiter_draft_output_snapshot_matches_adapter_fixture: true,
      blocker_arbiter_snapshot_final_routes_verified: true,
      blocker_arbiter_snapshot_production_block_verified: true,
      blocker_arbiter_snapshot_memory_entry_block_verified: true,
      blocker_arbiter_snapshot_no_production_candidate_verified: true,
      blocker_arbiter_snapshot_no_direct_memory_write_verified: true,
      blocker_arbiter_snapshot_no_accepted_samples_write_verified: true,
      review_report_static_handoff_verified: true,
      review_report_guard_summary_verified: true,
      review_report_candidate_items_visible: true,
      review_report_pass_item_explained: true,
      review_report_reject_item_explained: true,
      review_report_memory_entry_blocked_visible: true,
      review_report_production_promotion_blocked_visible: true,
      review_report_never_production_visible: true,
      review_report_draft_output_matches_static_mock: true,
      review_report_no_daily_note_write_verified: true,
      review_report_no_vcp_memory_write_verified: true,
      review_report_no_accepted_samples_write_verified: true,
      review_report_no_production_candidate_verified: true,
      review_report_no_provider_execution_verified: true,
      review_evidence_blocker_adapter_negative_static_handoff_verified: true,
      adapter_negative_fixture_guard_summary_verified: true,
      adapter_negative_memory_forbidden_visible: true,
      adapter_negative_never_production_visible: true,
      adapter_negative_fixture_match_visible: true,
      adapter_negative_no_production_candidate_verified: true,
      adapter_negative_no_direct_memory_write_verified: true,
      adapter_negative_no_accepted_samples_write_verified: true,
      adapter_negative_draft_output_snapshot_present: true,
      adapter_negative_draft_output_snapshot_matches_static_mock: true,
      adapter_negative_draft_output_snapshot_matches_adapter_fixture: true,
      adapter_negative_snapshot_memory_forbidden_verified: true,
      adapter_negative_snapshot_never_production_verified: true,
      adapter_negative_snapshot_no_production_candidate_verified: true,
      adapter_negative_snapshot_no_direct_memory_write_verified: true,
      adapter_negative_snapshot_no_accepted_samples_write_verified: true,
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
