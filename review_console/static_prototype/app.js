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
