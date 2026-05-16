const mock = window.REVIEW_CONSOLE_MOCK;
const scoreModel = mock.score_model;

const state = {
  session_id: mock.review_session.session_id,
  task_id: mock.review_session.task_id,
  case_id: mock.review_session.case_id,
  project: mock.review_session.project,
  status: mock.review_session.status,
  currentVersionId: mock.review_session.current_version_id,
  compareVersionId: mock.review_session.compare_version_id,
  image_versions: mock.review_session.image_versions,
  ai_review: mock.review_session.ai_review,
  human_review: mock.review_session.human_review,
  comments: [...mock.review_session.comments],
  annotation_notes: mock.review_session.annotation_notes,
  version_comparison: mock.review_session.version_comparison,
  approval: mock.review_session.approval,
  assetStatus: mock.review_session.archive_decision.asset_status,
  memoryStatus: mock.review_session.memory_approval.status,
  memory_preview: mock.review_session.memory_preview,
  next_iteration: mock.review_session.next_iteration,
  audit_log: mock.review_session.audit_log,
  adapter_dry_run_handoff: mock.adapter_dry_run_handoff,
  review_result_protocol_static_handoff: mock.review_result_protocol_static_handoff,
  review_decision_package_static_handoff: mock.review_decision_package_static_handoff,
  review_evidence_blocker_contract_static_handoff: mock.review_evidence_blocker_contract_static_handoff,
  review_blocker_arbiter_static_handoff: mock.review_blocker_arbiter_static_handoff,
  review_report_static_handoff: mock.review_report_static_handoff,
  review_report_negative_guard_static_handoff: mock.review_report_negative_guard_static_handoff,
  review_evidence_blocker_adapter_negative_static_handoff: mock.review_evidence_blocker_adapter_negative_static_handoff,
  humanScores: { ...mock.review_session.human_review.breakdown }
};

const qs = (selector) => document.querySelector(selector);
const qsa = (selector) => Array.from(document.querySelectorAll(selector));

function totalFrom(values, scoreIndex) {
  return scoreModel.reduce((sum, item) => {
    const key = item[0];
    return sum + (values ? Number(values[key] || 0) : Number(item[scoreIndex] || 0));
  }, 0);
}

function currentVersion() {
  return state.image_versions.find((version) => version.version_id === state.currentVersionId);
}

function nowIso() {
  return new Date().toISOString();
}

function renderVersions() {
  const root = qs("#versionList");
  root.innerHTML = "";
  state.image_versions.forEach((version) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `version-item${version.version_id === state.currentVersionId ? " is-active" : ""}`;
    button.innerHTML = `
      <span>
        <strong>${version.label}</strong>
        <small>${version.asset_ref}</small>
      </span>
      <span>${version.score}</span>
    `;
    button.addEventListener("click", () => {
      state.currentVersionId = version.version_id;
      renderAll();
    });
    root.appendChild(button);
  });

  qs("#currentVersionScore").textContent = currentVersion().score;
}

function renderScores() {
  const root = qs("#scoreControls");
  root.innerHTML = "";
  scoreModel.forEach(([key, label, max, ai]) => {
    const row = document.createElement("label");
    row.className = "score-row";
    row.innerHTML = `
      <span>${label}</span>
      <input type="range" min="0" max="${max}" value="${state.humanScores[key]}" data-score-key="${key}" />
      <output>${state.humanScores[key]} / ${max}</output>
    `;
    row.querySelector("input").addEventListener("input", (event) => {
      state.humanScores[key] = Number(event.target.value);
      row.querySelector("output").textContent = `${state.humanScores[key]} / ${max}`;
      updateTotals();
      renderDraft();
    });
    row.title = `AI 初评：${ai} / ${max}`;
    root.appendChild(row);
  });
  updateTotals();
}

function updateTotals() {
  const aiTotal = totalFrom(null, 3);
  const humanTotal = totalFrom(state.humanScores);
  qs("#aiTotal").textContent = aiTotal;
  qs("#humanTotal").textContent = humanTotal;
  qs("#finalTotal").textContent = humanTotal;
}

function renderComments() {
  const root = qs("#commentList");
  root.innerHTML = "";
  state.comments.forEach((comment) => {
    const item = document.createElement("article");
    item.className = `comment-item ${comment.severity}`;
    item.innerHTML = `
      <strong>${comment.target} / ${comment.severity}</strong>
      <p>${comment.comment_cn}</p>
      <small>${comment.author} · ${comment.created_at} · ${comment.status}</small>
    `;
    root.appendChild(item);
  });
}

function addComment() {
  const text = qs("#commentText").value.trim();
  if (!text) return;
  state.comments.unshift({
    comment_id: `comment-${String(state.comments.length + 1).padStart(3, "0")}`,
    author: "human_reviewer",
    author_type: "human",
    target: qs("#commentTarget").value,
    severity: qs("#commentSeverity").value,
    comment_cn: text,
    status: "open",
    created_at: nowIso()
  });
  qs("#commentText").value = "";
  renderComments();
  renderDraft();
}

function archiveActionFor(status) {
  if (status === "accepted") return "approve_archive";
  if (status === "candidate") return "mark_candidate";
  if (status === "rejected") return "reject_archive";
  return "request_iteration";
}

function setArchiveStatus(status) {
  state.assetStatus = status;
  state.approval.archive_action = archiveActionFor(status);
  qsa("[data-archive]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.archive === status);
  });
  renderDraft();
}

function setMemoryStatus(status) {
  state.memoryStatus = status;
  state.approval.memory_action = status === "approved" ? "approve_memory_write" : "request_memory_edit";
  if (status === "rejected") {
    state.approval.memory_action = "reject_memory_write";
  }
  qsa("[data-memory]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.memory === status);
  });
  const lock = qs("#dailyNoteLock");
  if (status === "approved") {
    lock.textContent = "DailyNote request unlocked: 仅生成已审批写入申请，仍不直接调用 DailyNote。";
    lock.classList.add("approved");
  } else {
    lock.textContent = "DailyNote locked: memory_approval.status 不是 approved。";
    lock.classList.remove("approved");
  }
  renderDraft();
}

function renderIteration() {
  const root = qs("#iterationList");
  root.innerHTML = "";
  state.next_iteration.revision_advice_cn.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    root.appendChild(li);
  });
}

function renderProtocolHandoff() {
  const handoff = state.review_result_protocol_static_handoff;
  const summary = handoff.report_summary;
  const guardSummary = handoff.review_protocol_guard_summary;
  qs("#protocolSummary").innerHTML = `
    <span>Pass <strong>${summary.pass_count}</strong></span>
    <span>Reject <strong>${summary.reject_count}</strong></span>
    <span>Never production <strong>${summary.never_production_count}</strong></span>
  `;

  qs("#protocolGuardSummary").innerHTML = `
    <article class="guard-tile">
      <span>Memory forbidden</span>
      <strong>${guardSummary.memory_forbidden_count}</strong>
    </article>
    <article class="guard-tile">
      <span>Production blocked</span>
      <strong>${guardSummary.production_blocked_count}</strong>
    </article>
    <article class="guard-tile">
      <span>Negative guard</span>
      <strong>${guardSummary.negative_guard_observed}</strong>
    </article>
    <article class="guard-tile wide">
      <span>Never production ids</span>
      <strong>${guardSummary.never_production_candidate_ids.join(", ")}</strong>
    </article>
  `;

  const root = qs("#protocolCandidateList");
  root.innerHTML = "";
  handoff.candidate_review_results.forEach((candidate) => {
    const activeReasons = candidate.review_outcome === "pass" ? candidate.pass_reasons : candidate.reject_reasons;
    const card = document.createElement("article");
    card.className = `protocol-card ${candidate.review_outcome}`;
    card.innerHTML = `
      <div class="protocol-card-head">
        <strong>${candidate.candidate_id}</strong>
        <span>${candidate.review_outcome}</span>
      </div>
      <ul>${activeReasons.map((reason) => `<li>${reason}</li>`).join("")}</ul>
      <dl>
        <div><dt>Memory</dt><dd>${candidate.memory_route.route}</dd></div>
        <div><dt>Production</dt><dd>${candidate.production_route.status}</dd></div>
      </dl>
    `;
    root.appendChild(card);
  });

  qs("#protocolGuard").innerHTML = `
    <span>direct memory write: ${summary.direct_memory_write_performed}</span>
    <span>production candidate created: ${summary.production_candidate_created}</span>
    <span>all production creation blocked: ${guardSummary.all_production_candidate_creation_blocked}</span>
    <span>memory forbidden ids: ${guardSummary.memory_forbidden_candidate_ids.join(", ") || "none"}</span>
  `;
}

function renderDecisionPackageHandoff() {
  const handoff = state.review_decision_package_static_handoff;
  const summary = handoff.decision_summary;
  const guardSummary = handoff.review_decision_package_guard_summary;
  qs("#decisionPackageSummary").innerHTML = `
    <span>Accepted drafts <strong>${summary.accepted_sample_draft_count}</strong></span>
    <span>Rejected drafts <strong>${summary.rejected_sample_draft_count}</strong></span>
    <span>Memory drafts <strong>${summary.memory_delta_draft_count}</strong></span>
    <span>Production exclusions <strong>${summary.production_exclusion_count}</strong></span>
  `;

  qs("#decisionPackageGuardSummary").innerHTML = `
    <article class="guard-tile">
      <span>Accepted samples write</span>
      <strong>${guardSummary.accepted_samples_write_performed}</strong>
    </article>
    <article class="guard-tile">
      <span>Direct memory write</span>
      <strong>${guardSummary.direct_memory_write_performed}</strong>
    </article>
    <article class="guard-tile">
      <span>Production candidate</span>
      <strong>${guardSummary.production_candidate_created}</strong>
    </article>
    <article class="guard-tile wide">
      <span>Production exclusion ids</span>
      <strong>${guardSummary.production_exclusion_candidate_ids.join(", ")}</strong>
    </article>
  `;

  const root = qs("#decisionPackageDraftList");
  root.innerHTML = "";
  const draftGroups = [
    {
      label: "Accepted sample drafts",
      items: handoff.accepted_sample_drafts.map((draft) => ({
        id: draft.accepted_sample_id,
        meta: draft.candidate_id,
        status: `write=${draft.write_performed} production=${draft.production_candidate}`
      }))
    },
    {
      label: "Rejected sample drafts",
      items: handoff.rejected_sample_drafts.map((draft) => ({
        id: draft.rejected_sample_id,
        meta: draft.candidate_id,
        status: `write=${draft.write_performed} production=${draft.production_candidate}`
      }))
    },
    {
      label: "Memory delta drafts",
      items: handoff.memory_delta_drafts.map((draft) => ({
        id: draft.memory_delta_id,
        meta: draft.language,
        status: `status=${draft.status} direct_write=${draft.direct_write_performed}`
      }))
    },
    {
      label: "Production exclusion register",
      items: handoff.production_exclusion_register.map((record) => ({
        id: record.candidate_id,
        meta: record.status,
        status: `permanent=${record.permanent_block} production=${record.production_candidate}`
      }))
    }
  ];

  draftGroups.forEach((group) => {
    const card = document.createElement("article");
    card.className = "decision-package-card";
    card.innerHTML = `
      <strong>${group.label}</strong>
      <ul>
        ${group.items.map((item) => `<li><span>${item.id}</span><small>${item.meta} · ${item.status}</small></li>`).join("")}
      </ul>
    `;
    root.appendChild(card);
  });

  qs("#decisionPackageGuard").innerHTML = `
    <span>protocol pass is not production approval: ${handoff.promotion_guard.protocol_pass_is_not_production_approval}</span>
    <span>every never-production candidate blocked: ${handoff.promotion_guard.every_never_production_candidate_blocked}</span>
    <span>memory forbidden count: ${summary.memory_forbidden_count}</span>
  `;
}

function renderEvidenceBlockerHandoff() {
  const handoff = state.review_evidence_blocker_contract_static_handoff;
  const summary = handoff.blocker_summary;
  const guardSummary = handoff.review_evidence_blocker_contract_guard_summary;
  qs("#evidenceBlockerSummary").innerHTML = `
    <span>Evidence records <strong>${summary.evidence_record_count}</strong></span>
    <span>Blocker decisions <strong>${summary.blocker_decision_count}</strong></span>
    <span>Permanent blocks <strong>${summary.permanent_block_count}</strong></span>
    <span>Human review blocks <strong>${summary.human_review_block_count}</strong></span>
  `;

  qs("#evidenceBlockerGuardSummary").innerHTML = `
    <article class="guard-tile">
      <span>Production exclusions</span>
      <strong>${guardSummary.production_exclusion_count}</strong>
    </article>
    <article class="guard-tile">
      <span>Memory forbidden blocks</span>
      <strong>${guardSummary.memory_forbidden_block_count}</strong>
    </article>
    <article class="guard-tile">
      <span>Production candidate</span>
      <strong>${guardSummary.production_candidate_created}</strong>
    </article>
    <article class="guard-tile wide">
      <span>Production exclusion ids</span>
      <strong>${guardSummary.production_exclusion_candidate_ids.join(", ")}</strong>
    </article>
  `;

  const evidenceRoot = qs("#evidenceRecordList");
  evidenceRoot.innerHTML = "";
  handoff.evidence_records.forEach((record) => {
    const card = document.createElement("article");
    card.className = `evidence-card ${record.review_outcome}`;
    card.innerHTML = `
      <div class="protocol-card-head">
        <strong>${record.candidate_id}</strong>
        <span>${record.review_outcome}</span>
      </div>
      <ul>${record.evidence_codes.map((code) => `<li>${code}</li>`).join("")}</ul>
      <dl>
        <div><dt>Production candidate</dt><dd>${record.production_candidate}</dd></div>
        <div><dt>Direct write</dt><dd>${record.direct_write_performed}</dd></div>
      </dl>
    `;
    evidenceRoot.appendChild(card);
  });

  const blockerRoot = qs("#blockerDecisionList");
  blockerRoot.innerHTML = "";
  handoff.blocker_decisions.forEach((blocker) => {
    const card = document.createElement("article");
    card.className = `blocker-card ${blocker.permanent_block ? "permanent" : "temporary"}`;
    card.innerHTML = `
      <div class="protocol-card-head">
        <strong>${blocker.candidate_id}</strong>
        <span>${blocker.decision}</span>
      </div>
      <dl>
        <div><dt>Type</dt><dd>${blocker.blocker_type}</dd></div>
        <div><dt>Scope</dt><dd>${blocker.blocking_scope}</dd></div>
        <div><dt>Permanent</dt><dd>${blocker.permanent_block}</dd></div>
        <div><dt>Production candidate</dt><dd>${blocker.production_candidate}</dd></div>
      </dl>
    `;
    blockerRoot.appendChild(card);
  });

  qs("#evidenceBlockerGuard").innerHTML = `
    <span>evidence record is not approval: ${handoff.arbitration_guard.evidence_record_is_not_approval}</span>
    <span>blocker decision is not write: ${handoff.arbitration_guard.blocker_decision_is_not_write}</span>
    <span>every candidate has evidence record: ${handoff.arbitration_guard.every_candidate_has_evidence_record}</span>
    <span>every candidate has production blocker: ${handoff.arbitration_guard.every_candidate_has_production_blocker_decision}</span>
    <span>every never-production candidate has exclusion: ${handoff.arbitration_guard.every_never_production_candidate_has_exclusion}</span>
    <span>no production without human review: ${handoff.arbitration_guard.no_production_without_human_review}</span>
  `;
}

function renderReviewBlockerArbiterHandoff() {
  const handoff = state.review_blocker_arbiter_static_handoff;
  const summary = handoff.arbiter_summary;
  const guardSummary = handoff.review_blocker_arbiter_guard_summary;

  qs("#blockerArbiterSummary").innerHTML = `
    <span>Candidates <strong>${summary.candidate_count}</strong></span>
    <span>Production blocked <strong>${summary.production_blocked_count}</strong></span>
    <span>Human review <strong>${summary.human_review_required_count}</strong></span>
    <span>Permanent blocks <strong>${summary.permanent_block_count}</strong></span>
  `;

  qs("#blockerArbiterGuardSummary").innerHTML = `
    <article class="guard-tile">
      <span>Memory forbidden</span>
      <strong>${guardSummary.memory_forbidden_count}</strong>
    </article>
    <article class="guard-tile">
      <span>Never production</span>
      <strong>${guardSummary.never_production_count}</strong>
    </article>
    <article class="guard-tile">
      <span>Production candidate</span>
      <strong>${guardSummary.production_candidate_created}</strong>
    </article>
    <article class="guard-tile wide">
      <span>Never production ids</span>
      <strong>${guardSummary.never_production_candidate_ids.join(", ")}</strong>
    </article>
    <article class="guard-tile wide">
      <span>Production blocked ids</span>
      <strong>${handoff.production_blocked_candidate_ids.join(", ")}</strong>
    </article>
  `;

  const root = qs("#blockerArbiterRouteList");
  root.innerHTML = "";
  handoff.candidate_arbitrations.forEach((item) => {
    const card = document.createElement("article");
    card.className = `blocker-arbiter-card ${item.never_production ? "never-production" : "human-review"}`;
    card.innerHTML = `
      <div class="protocol-card-head">
        <strong>${item.candidate_id}</strong>
        <span>${item.final_route}</span>
      </div>
      <dl>
        <div><dt>Evidence</dt><dd>${item.evidence_record_id}</dd></div>
        <div><dt>Production blocker</dt><dd>${item.production_blocker_decision_id}</dd></div>
        <div><dt>Production decision</dt><dd>${item.production_decision}</dd></div>
        <div><dt>Memory decision</dt><dd>${item.memory_decision}</dd></div>
        <div><dt>Memory forbidden</dt><dd>${item.memory_forbidden}</dd></div>
        <div><dt>Never production</dt><dd>${item.never_production}</dd></div>
      </dl>
    `;
    root.appendChild(card);
  });

  qs("#blockerArbiterGuard").innerHTML = `
    <span>review blocker arbiter attached: ${handoff.review_blocker_arbiter_attached}</span>
    <span>production promotion allowed now: ${guardSummary.production_promotion_allowed_now}</span>
    <span>memory entry allowed now: ${guardSummary.memory_entry_allowed_now}</span>
    <span>memory forbidden prevents memory: ${guardSummary.memory_forbidden_prevents_memory}</span>
    <span>never production prevents production: ${guardSummary.never_production_prevents_production}</span>
    <span>pass is not production approval: ${handoff.promotion_guard.pass_is_not_production_approval}</span>
    <span>human review required before production: ${guardSummary.human_review_required_before_production}</span>
    <span>all writes blocked: ${summary.all_writes_blocked}</span>
  `;
}

function renderReviewReportHandoff() {
  const handoff = state.review_report_static_handoff;
  const summary = handoff.report_summary;
  const guardSummary = handoff.review_report_guard_summary;

  qs("#reviewReportSummary").innerHTML = `
    <span>ReviewReport <strong>${handoff.review_report_contract_attached}</strong></span>
    <span>Candidates <strong>${summary.candidate_count}</strong></span>
    <span>Pass <strong>${summary.pass_count}</strong></span>
    <span>Reject <strong>${summary.reject_count}</strong></span>
    <span>Never production <strong>${summary.never_production_count}</strong></span>
  `;

  qs("#reviewReportGuardSummary").innerHTML = `
    <article class="guard-tile">
      <span>Memory entries now</span>
      <strong>${guardSummary.memory_entry_allowed_now_count}</strong>
    </article>
    <article class="guard-tile">
      <span>Production promotions now</span>
      <strong>${guardSummary.production_promotion_allowed_now_count}</strong>
    </article>
    <article class="guard-tile">
      <span>Writes allowed now</span>
      <strong>${guardSummary.writes_allowed_now_count}</strong>
    </article>
    <article class="guard-tile wide">
      <span>Never production ids</span>
      <strong>${guardSummary.never_production_candidate_ids.join(", ") || "none"}</strong>
    </article>
  `;

  const root = qs("#reviewReportItemList");
  root.innerHTML = "";
  handoff.report_items.forEach((item) => {
    const card = document.createElement("article");
    card.className = `review-report-card ${item.production_report.never_production ? "never-production" : "pending-review"}`;
    card.innerHTML = `
      <div class="protocol-card-head">
        <strong>${item.candidate_id}</strong>
        <span>${item.report_decision}</span>
      </div>
      <dl>
        <div><dt>Review outcome</dt><dd>${item.review_outcome}</dd></div>
        <div><dt>Final route</dt><dd>${item.final_route}</dd></div>
        <div><dt>Evidence</dt><dd>${item.evidence_record_id}</dd></div>
        <div><dt>Production blocker</dt><dd>${item.production_blocker_decision_id}</dd></div>
        <div><dt>Memory output</dt><dd>${item.memory_report.allowed_output_now}</dd></div>
        <div><dt>Production output</dt><dd>${item.production_report.allowed_output_now}</dd></div>
        <div><dt>Memory now</dt><dd>${item.memory_report.memory_entry_allowed_now}</dd></div>
        <div><dt>Production now</dt><dd>${item.production_report.production_promotion_allowed_now}</dd></div>
        <div><dt>Never production</dt><dd>${item.production_report.never_production}</dd></div>
        <div><dt>Writes blocked</dt><dd>${item.final_controls.writes_blocked.join(", ")}</dd></div>
      </dl>
    `;
    root.appendChild(card);
  });

  qs("#reviewReportGuard").innerHTML = `
    <span>all report items explain candidates: ${summary.report_items_explain_all_candidates}</span>
    <span>all memory writes blocked: ${summary.all_memory_writes_blocked}</span>
    <span>all production writes blocked: ${summary.all_production_writes_blocked}</span>
    <span>all provider execution blocked: ${summary.all_provider_execution_blocked}</span>
    <span>DailyNote write: ${guardSummary.daily_note_write_performed}</span>
    <span>VCP memory write: ${guardSummary.vcp_memory_write_performed}</span>
    <span>accepted_samples write: ${guardSummary.accepted_samples_write_performed}</span>
    <span>production candidate created: ${guardSummary.production_candidate_created}</span>
  `;
}

function renderNegativeReviewReportHandoff() {
  const handoff = state.review_report_negative_guard_static_handoff;
  const summary = handoff.report_summary;
  const guardSummary = handoff.review_report_guard_summary;

  qs("#negativeReviewReportSummary").innerHTML = `
    <span>Negative ReviewReport <strong>${handoff.negative_guard_observed}</strong></span>
    <span>Candidates <strong>${summary.candidate_count}</strong></span>
    <span>Reject <strong>${summary.reject_count}</strong></span>
    <span>Memory forbidden <strong>${guardSummary.memory_forbidden_candidate_ids.length}</strong></span>
    <span>Never production <strong>${summary.never_production_count}</strong></span>
  `;

  qs("#negativeReviewReportGuardSummary").innerHTML = `
    <article class="guard-tile">
      <span>Memory entries now</span>
      <strong>${guardSummary.memory_entry_allowed_now_count}</strong>
    </article>
    <article class="guard-tile">
      <span>Production promotions now</span>
      <strong>${guardSummary.production_promotion_allowed_now_count}</strong>
    </article>
    <article class="guard-tile">
      <span>Writes allowed now</span>
      <strong>${guardSummary.writes_allowed_now_count}</strong>
    </article>
    <article class="guard-tile wide">
      <span>Memory forbidden ids</span>
      <strong>${guardSummary.memory_forbidden_candidate_ids.join(", ") || "none"}</strong>
    </article>
    <article class="guard-tile wide">
      <span>Never production ids</span>
      <strong>${guardSummary.never_production_candidate_ids.join(", ") || "none"}</strong>
    </article>
  `;

  const root = qs("#negativeReviewReportItemList");
  root.innerHTML = "";
  handoff.report_items.forEach((item) => {
    const card = document.createElement("article");
    const statusClass = item.memory_report.memory_forbidden ? "memory-forbidden" : "never-production";
    card.className = `review-report-card ${statusClass}`;
    card.innerHTML = `
      <div class="protocol-card-head">
        <strong>${item.candidate_id}</strong>
        <span>${item.report_decision}</span>
      </div>
      <dl>
        <div><dt>Review outcome</dt><dd>${item.review_outcome}</dd></div>
        <div><dt>Final route</dt><dd>${item.final_route}</dd></div>
        <div><dt>Evidence</dt><dd>${item.evidence_record_id}</dd></div>
        <div><dt>Production blocker</dt><dd>${item.production_blocker_decision_id}</dd></div>
        <div><dt>Memory blockers</dt><dd>${item.memory_blocker_decision_ids.join(", ") || "none"}</dd></div>
        <div><dt>Failure tags</dt><dd>${item.failure_tags.join(", ") || "none"}</dd></div>
        <div><dt>Unknown failure tags</dt><dd>${item.unknown_failure_tags.join(", ") || "none"}</dd></div>
        <div><dt>Memory output</dt><dd>${item.memory_report.allowed_output_now}</dd></div>
        <div><dt>Production output</dt><dd>${item.production_report.allowed_output_now}</dd></div>
        <div><dt>Memory forbidden</dt><dd>${item.memory_report.memory_forbidden}</dd></div>
        <div><dt>Never production</dt><dd>${item.production_report.never_production}</dd></div>
        <div><dt>Writes allowed now</dt><dd>${item.final_controls.writes_allowed_now.length}</dd></div>
        <div><dt>Execution blocked</dt><dd>${item.final_controls.execution_blocked.join(", ")}</dd></div>
      </dl>
    `;
    root.appendChild(card);
  });

  qs("#negativeReviewReportGuard").innerHTML = `
    <span>all report items explain candidates: ${summary.report_items_explain_all_candidates}</span>
    <span>all memory writes blocked: ${summary.all_memory_writes_blocked}</span>
    <span>all production writes blocked: ${summary.all_production_writes_blocked}</span>
    <span>all provider execution blocked: ${summary.all_provider_execution_blocked}</span>
    <span>DailyNote write: ${guardSummary.daily_note_write_performed}</span>
    <span>VCP memory write: ${guardSummary.vcp_memory_write_performed}</span>
    <span>accepted_samples write: ${guardSummary.accepted_samples_write_performed}</span>
    <span>production candidate created: ${guardSummary.production_candidate_created}</span>
  `;
}

function renderAdapterNegativeHandoff() {
  const handoff = state.review_evidence_blocker_adapter_negative_static_handoff;
  const guard = handoff.guard_summary;
  const audit = handoff.audit_summary;

  qs("#adapterNegativeSummary").innerHTML = `
    <span>Adapter negative fixture <strong>${handoff.adapter_negative_guard_observed}</strong></span>
    <span>Golden fixture match <strong>${handoff.evidence_blocker_contract_matches_fixture}</strong></span>
    <span>Never production <strong>${audit.never_production_count}</strong></span>
    <span>Memory forbidden <strong>${audit.memory_forbidden_count}</strong></span>
  `;

  qs("#adapterNegativeGuardSummary").innerHTML = `
    <article class="guard-tile">
      <span>Production exclusions</span>
      <strong>${guard.production_exclusion_count}</strong>
    </article>
    <article class="guard-tile">
      <span>Memory forbidden blocks</span>
      <strong>${guard.memory_forbidden_block_count}</strong>
    </article>
    <article class="guard-tile">
      <span>Production candidate</span>
      <strong>${guard.production_candidate_created}</strong>
    </article>
    <article class="guard-tile wide">
      <span>Memory forbidden IDs</span>
      <strong>${handoff.memory_forbidden_candidate_ids.join(", ")}</strong>
    </article>
    <article class="guard-tile wide">
      <span>Production exclusion IDs</span>
      <strong>${handoff.production_exclusion_candidate_ids.join(", ")}</strong>
    </article>
  `;

  const root = qs("#adapterNegativeBlockerList");
  root.innerHTML = "";
  handoff.blocker_highlights.forEach((item) => {
    const card = document.createElement("article");
    card.className = `adapter-negative-card ${item.memory_route === "forbidden" ? "memory-forbidden" : "never-production"}`;
    card.innerHTML = `
      <div class="protocol-card-head">
        <strong>${item.candidate_id}</strong>
        <span>${item.decision}</span>
      </div>
      <dl>
        <div><dt>Memory route</dt><dd>${item.memory_route}</dd></div>
        <div><dt>Production route</dt><dd>${item.production_route}</dd></div>
        <div><dt>Blocker</dt><dd>${item.blocker_type}</dd></div>
        <div><dt>Direct write</dt><dd>${item.direct_write_performed}</dd></div>
      </dl>
    `;
    root.appendChild(card);
  });

  qs("#adapterNegativeGuard").innerHTML = `
    <span>embedded evidence blocker contract: ${handoff.evidence_blocker_contract_embedded}</span>
    <span>matches golden fixture: ${handoff.evidence_blocker_contract_matches_fixture}</span>
    <span>every candidate has evidence record: ${guard.every_candidate_has_evidence_record}</span>
    <span>every candidate has production blocker: ${guard.every_candidate_has_production_blocker_decision}</span>
    <span>every never-production candidate has exclusion: ${guard.every_never_production_candidate_has_exclusion}</span>
    <span>selected plugin: ${audit.selected_plugin}</span>
    <span>max plugin calls: ${audit.max_plugin_calls_observed}</span>
  `;
}

function approvalPayload() {
  if (state.memoryStatus === "approved") {
    return {
      status: "approved",
      approved_by: "human_reviewer",
      approved_at: nowIso(),
      rejection_reason_cn: null
    };
  }
  if (state.memoryStatus === "rejected") {
    return {
      status: "rejected",
      approved_by: null,
      approved_at: null,
      rejection_reason_cn: "记忆正文仍需人工改写后再提交。"
    };
  }
  return {
    status: "pending",
    approved_by: null,
    approved_at: null,
    rejection_reason_cn: null
  };
}

function memoryWriteMode(memoryApproval) {
  if (memoryApproval.status === "approved") return "confirmed";
  if (memoryApproval.status === "rejected") return "forbidden";
  return "draft";
}

function buildReviewSession(memoryApproval, humanTotal) {
  return {
    session_id: state.session_id,
    task_id: state.task_id,
    case_id: state.case_id,
    project: state.project,
    status: state.status,
    image_versions: state.image_versions,
    current_version_id: state.currentVersionId,
    compare_version_id: state.compareVersionId,
    ai_review: {
      ...state.ai_review,
      total_score: totalFrom(null, 3),
      note_cn: "AI 初评仅供参考，人工评分覆盖 AI 评分。"
    },
    human_review: {
      ...state.human_review,
      total_score: humanTotal,
      breakdown: state.humanScores
    },
    final_review: {
      source: "human_review",
      total_score: humanTotal,
      rule_cn: "final_review 必须优先采用 human_review。"
    },
    comments: state.comments,
    annotation_notes: state.annotation_notes,
    version_comparison: state.version_comparison,
    approval: state.approval,
    archive_decision: {
      asset_status: state.assetStatus,
      human_approval_required: true,
      ai_archive_recommendation_is_final: false,
      note_cn: "AI 的 archive_recommendation 只是建议，不能替代人工批准。"
    },
    memory_preview: {
      chinese_diary_title: qs("#memoryTitle").value,
      chinese_diary_content: qs("#memoryContent").value,
      target_notebook: state.memory_preview.target_notebook,
      maid: state.memory_preview.maid,
      tags: state.memory_preview.tags,
      safety: state.memory_preview.safety
    },
    memory_approval: memoryApproval,
    next_iteration: state.next_iteration,
    audit_log: [
      ...state.audit_log,
      {
        event: "static_draft_rendered",
        actor: "Review_Console_Static_Prototype",
        created_at: nowIso(),
        note_cn: "仅在浏览器内刷新草案文本，未调用 DailyNote、API 或 VCP 插件。"
      }
    ]
  };
}

function buildImageCase(humanTotal) {
  const approvedAsset = state.assetStatus === "accepted";
  return {
    case_id: state.case_id,
    project: state.project,
    task_id: state.task_id,
    image_type: "Photo Studio OS dashboard",
    input_assets: mock.image_case_seed.input_assets,
    output_assets: [currentVersion().asset_ref],
    plugin_used: null,
    prompt_package_id: mock.image_case_seed.prompt_package_id,
    review_ids: mock.image_case_seed.review_ids,
    final_score: humanTotal,
    asset_status: state.assetStatus,
    human_approval: {
      approved: approvedAsset,
      approved_by: approvedAsset ? "human_reviewer" : null,
      approved_at: approvedAsset ? nowIso() : null,
      approval_notes_cn: approvedAsset ? "人工批准后才允许 accepted。" : "未人工批准，不能标记 accepted。"
    },
    strengths_cn: mock.image_case_seed.strengths_cn,
    weaknesses_cn: mock.image_case_seed.weaknesses_cn,
    reusable_rules_cn: mock.image_case_seed.reusable_rules_cn,
    memory_entries: ["delta-photo-studio-os-review-001"],
    git_promotion_candidate: false
  };
}

function buildMemoryDelta(memoryApproval) {
  const writeMode = memoryWriteMode(memoryApproval);
  return {
    delta_id: "delta-photo-studio-os-review-001",
    task_id: state.task_id,
    case_id: state.case_id,
    created_at: nowIso(),
    agent_name: "Review_Console_Static_Prototype",
    agent_role: "static_review_console_mock",
    project: state.project,
    memory_type: "style_review_lesson",
    target_notebook: state.memory_preview.target_notebook,
    write_mode: writeMode,
    importance: "medium",
    approval_required: true,
    approval_status: memoryApproval.status,
    approved_by: memoryApproval.approved_by,
    approved_at: memoryApproval.approved_at,
    source: {
      source_type: "review_session_static_prototype",
      source_ids: [state.session_id, state.case_id]
    },
    chinese_diary_title: qs("#memoryTitle").value,
    chinese_diary_content: qs("#memoryContent").value,
    preserved_original: {
      prompt_en: null,
      plugin_name: null,
      model_name: null,
      file_ref: currentVersion().asset_ref
    },
    tags: state.memory_preview.tags,
    visibility: "audit",
    memory_safety: {
      ...state.memory_preview.safety,
      safety_notes_cn: "静态原型 mock 数据不包含密钥、私密路径、客户隐私或图片二进制。"
    },
    promotion: {
      sync_to_git_candidate: false,
      promoted_to_git: false,
      git_target_file: null,
      promotion_reason_cn: null
    },
    final_decision: {
      should_write_to_vcp: memoryApproval.status === "approved",
      should_show_in_review_console: true,
      rejection_reason_cn: memoryApproval.rejection_reason_cn
    }
  };
}

function renderDraft() {
  const memoryApproval = approvalPayload();
  const humanTotal = totalFrom(state.humanScores);
  const draft = {
    adapter_dry_run_handoff: state.adapter_dry_run_handoff,
    review_result_protocol_static_handoff: state.review_result_protocol_static_handoff,
    review_decision_package_static_handoff: state.review_decision_package_static_handoff,
    review_evidence_blocker_contract_static_handoff: state.review_evidence_blocker_contract_static_handoff,
    review_blocker_arbiter_static_handoff: state.review_blocker_arbiter_static_handoff,
    review_report_static_handoff: state.review_report_static_handoff,
    review_report_negative_guard_static_handoff: state.review_report_negative_guard_static_handoff,
    review_evidence_blocker_adapter_negative_static_handoff: state.review_evidence_blocker_adapter_negative_static_handoff,
    review_session: buildReviewSession(memoryApproval, humanTotal),
    image_case: buildImageCase(humanTotal),
    memory_delta: buildMemoryDelta(memoryApproval),
    prototype_guard: {
      api_called: false,
      daily_note_called: false,
      vcp_plugin_called: false,
      disk_write_performed: false,
      image_file_created: false
    }
  };
  qs("#draftOutput").value = JSON.stringify(draft, null, 2);
}

function renderAll() {
  qs("#sessionId").textContent = state.session_id;
  qs("#sessionStatus").textContent = state.status;
  renderVersions();
  renderScores();
  renderComments();
  renderIteration();
  renderProtocolHandoff();
  renderDecisionPackageHandoff();
  renderEvidenceBlockerHandoff();
  renderReviewBlockerArbiterHandoff();
  renderReviewReportHandoff();
  renderNegativeReviewReportHandoff();
  renderAdapterNegativeHandoff();
  renderDraft();
}

qs("#addCommentBtn").addEventListener("click", addComment);
qs("#refreshDraftBtn").addEventListener("click", renderDraft);
qsa("[data-archive]").forEach((button) => {
  button.addEventListener("click", () => setArchiveStatus(button.dataset.archive));
});
qsa("[data-memory]").forEach((button) => {
  button.addEventListener("click", () => setMemoryStatus(button.dataset.memory));
});
qs("#memoryTitle").addEventListener("input", renderDraft);
qs("#memoryContent").addEventListener("input", renderDraft);

renderAll();
