function requireRuntimeGuard(runtimeGuard) {
  if (
    !runtimeGuard ||
    typeof runtimeGuard.clone !== "function" ||
    typeof runtimeGuard.normalizeSession !== "function" ||
    typeof runtimeGuard.assertDraftSafe !== "function"
  ) {
    throw new Error("运行安全检查模块不可用或不完整。");
  }
  return runtimeGuard;
}

function requireBridge(hostBridge) {
  if (!hostBridge || typeof hostBridge.loadSession !== "function" || typeof hostBridge.submitDraft !== "function") {
    throw new Error("主程序桥接模块不可用或不完整。");
  }
  return hostBridge;
}

const runtimeGuard = requireRuntimeGuard(window.ImageLabRuntimeGuard);
const bridge = requireBridge(window.ImageLabHostBridge);
const session = runtimeGuard.normalizeSession(bridge.loadSession());

const els = {
  taskId: document.getElementById("taskId"),
  caseId: document.getElementById("caseId"),
  assetRef: document.getElementById("assetRef"),
  assetBox: document.getElementById("assetBox"),
  boundaryBanner: document.getElementById("boundaryBanner"),
  versionPicker: document.getElementById("versionPicker"),
  comparePicker: document.getElementById("comparePicker"),
  comparisonSummary: document.getElementById("comparisonSummary"),
  diffStrengths: document.getElementById("diffStrengths"),
  diffIssues: document.getElementById("diffIssues"),
  diffNext: document.getElementById("diffNext"),
  humanScore: document.getElementById("humanScore"),
  humanScoreOut: document.getElementById("humanScoreOut"),
  humanComment: document.getElementById("humanComment"),
  annotationNote: document.getElementById("annotationNote"),
  assetStatus: document.getElementById("assetStatus"),
  quickCandidate: document.getElementById("quickCandidate"),
  quickAccept: document.getElementById("quickAccept"),
  quickReject: document.getElementById("quickReject"),
  humanApproved: document.getElementById("humanApproved"),
  memoryContent: document.getElementById("memoryContent"),
  memoryApproval: document.getElementById("memoryApproval"),
  memoryPreviewTitle: document.getElementById("memoryPreviewTitle"),
  memoryPreviewTarget: document.getElementById("memoryPreviewTarget"),
  memoryPreviewDecision: document.getElementById("memoryPreviewDecision"),
  memoryPreviewBody: document.getElementById("memoryPreviewBody"),
  hostStatus: document.getElementById("hostStatus"),
  hostSubmittedAt: document.getElementById("hostSubmittedAt"),
  verdictTitle: document.getElementById("verdictTitle"),
  verdictReasons: document.getElementById("verdictReasons"),
  summarySessionStatus: document.getElementById("summarySessionStatus"),
  summaryAssetStatus: document.getElementById("summaryAssetStatus"),
  summaryScoreBand: document.getElementById("summaryScoreBand"),
  summaryMemoryStatus: document.getElementById("summaryMemoryStatus"),
  summaryWriteRequest: document.getElementById("summaryWriteRequest"),
  summaryGuard: document.getElementById("summaryGuard"),
  summaryNextAction: document.getElementById("summaryNextAction"),
  checkHumanComment: document.getElementById("checkHumanComment"),
  checkMemoryContent: document.getElementById("checkMemoryContent"),
  checkHumanDecision: document.getElementById("checkHumanDecision"),
  checkGuard: document.getElementById("checkGuard"),
  checkWriteBoundary: document.getElementById("checkWriteBoundary"),
  viewReadable: document.getElementById("viewReadable"),
  viewTechnical: document.getElementById("viewTechnical"),
  readableDraft: document.getElementById("readableDraft"),
  draftOutput: document.getElementById("draftOutput")
};

let activeDraftView = "readable";

function nowIso() {
  return new Date().toISOString();
}

function currentVersion() {
  const selectedVersionId = els.versionPicker.value || session.current_version_id;
  return session.image_versions.find((version) => version.version_id === selectedVersionId) || session.image_versions[0];
}

function compareVersion() {
  if (!els.comparePicker.value) return null;
  return session.image_versions.find((version) => version.version_id === els.comparePicker.value) || null;
}

function memoryWriteMode(status) {
  if (status === "approved") return "confirmed";
  if (status === "rejected") return "forbidden";
  return "draft";
}

function reviewSessionStatus(assetStatus) {
  if (assetStatus === "accepted") return "approved";
  if (assetStatus === "rejected") return "rejected";
  return "human_reviewing";
}

function assetStatusLabel(status) {
  const labels = {
    accepted: "可接受",
    candidate: "候选",
    rejected: "已拒收",
    draft: "草稿"
  };
  return labels[status] || status;
}

function reviewStatusLabel(status) {
  const labels = {
    approved: "已批准",
    rejected: "已拒收",
    human_reviewing: "人工评审中"
  };
  return labels[status] || status;
}

function memoryStatusLabel(status) {
  const labels = {
    approved: "已批准写入申请",
    rejected: "已拒绝写入申请",
    pending: "待审批"
  };
  return labels[status] || status;
}

function writeRequestLabel(shouldWrite) {
  return shouldWrite ? "已形成写入申请，仍未真实写入" : "未形成写入申请";
}

function scoreBandLabel(score) {
  if (score >= 90) return "强候选";
  if (score >= 80) return "可推进候选";
  if (score >= 60) return "需要修改";
  return "建议拒收";
}

function nextActionLabel({ assetStatus, memoryStatus, guardClean }) {
  if (!guardClean) return "先处理安全边界风险";
  if (assetStatus === "rejected") return "记录拒收原因，准备下一轮修改";
  if (assetStatus === "accepted" && memoryStatus === "approved") return "可进入人工验货与后续写入授权";
  if (assetStatus === "accepted") return "补齐记忆审批，再进入写入授权";
  if (assetStatus === "candidate") return "继续人工确认或补充标注";
  return "继续评审草稿";
}

function buildAcceptanceVerdict({ assetStatus, memoryStatus, score, preflightChecks }) {
  const reasons = [];
  if (!preflightChecks.prototype_guard_clean) {
    reasons.push("安全边界存在风险，不能继续验收。");
  }
  if (!preflightChecks.human_comment_present) {
    reasons.push("还缺人工评论。");
  }
  if (!preflightChecks.memory_content_present || !preflightChecks.chinese_memory_content_detected) {
    reasons.push("还缺中文记忆正文。");
  }
  if (!preflightChecks.accepted_has_human_approval) {
    reasons.push("标记可接受前必须先人工确认。");
  }
  if (memoryStatus === "approved") {
    reasons.push("只形成写入申请，当前没有真实写入。");
  }

  if (reasons.some((reason) => reason.includes("不能继续") || reason.includes("还缺") || reason.includes("必须"))) {
    return {
      status_cn: "暂不通过验货",
      reasons_cn: reasons
    };
  }
  if (assetStatus === "rejected") {
    return {
      status_cn: "不能接受",
      reasons_cn: ["当前资产已被人工拒收。"]
    };
  }
  if (assetStatus === "accepted" && memoryStatus === "approved") {
    return {
      status_cn: "图像可接受，等待写入授权",
      reasons_cn: reasons
    };
  }
  if (assetStatus === "accepted") {
    return {
      status_cn: "图像可接受，记忆待审批",
      reasons_cn: ["人工已确认图像可接受，但记忆写入申请尚未批准。"]
    };
  }
  if (score >= 80) {
    return {
      status_cn: "可以作为候选继续评审",
      reasons_cn: ["评分达到可推进候选区间。"]
    };
  }
  return {
    status_cn: "需要继续修改",
    reasons_cn: ["评分尚未达到可推进候选区间。"]
  };
}

function safeText(value, fallback) {
  const text = (value || "").trim();
  return text || fallback;
}

function hasChineseText(value) {
  return /[\u4e00-\u9fff]/.test(value || "");
}

function buildPreflightChecks({ humanReview, memoryContent, assetStatus, humanApproval, draftGuard }) {
  return {
    human_comment_present: humanReview.note_cn.length >= 6,
    memory_content_present: memoryContent.length >= 10,
    chinese_memory_content_detected: hasChineseText(memoryContent),
    accepted_has_human_approval: assetStatus !== "accepted" || humanApproval.approved === true,
    prototype_guard_clean: runtimeGuard.guardIsClean(draftGuard),
    real_write_performed: false
  };
}

function setChecklistItem(el, passed, okText, warnText) {
  el.dataset.state = passed ? "ok" : "warn";
  el.textContent = passed ? okText : warnText;
}

function setDraftView(view) {
  activeDraftView = view;
  const readableActive = activeDraftView === "readable";
  els.viewReadable.dataset.active = String(readableActive);
  els.viewTechnical.dataset.active = String(!readableActive);
  els.readableDraft.hidden = !readableActive;
  els.draftOutput.hidden = readableActive;
}

function applyQuickDecision(decision) {
  if (decision === "accept") {
    els.humanApproved.checked = true;
    els.assetStatus.value = "candidate";
    els.memoryApproval.value = "approved";
  } else if (decision === "reject") {
    els.humanApproved.checked = false;
    els.assetStatus.value = "rejected";
    els.memoryApproval.value = "rejected";
  } else {
    els.humanApproved.checked = false;
    els.assetStatus.value = "candidate";
    els.memoryApproval.value = "pending";
  }
  render();
}

function finalAssetStatus() {
  if (els.humanApproved.checked) return "accepted";
  return els.assetStatus.value;
}

function approvalPayload() {
  if (els.memoryApproval.value === "approved") {
    return {
      status: "approved",
      approved_by: "human_reviewer",
      approved_at: nowIso(),
      rejection_reason_cn: null
    };
  }
  if (els.memoryApproval.value === "rejected") {
    return {
      status: "rejected",
      approved_by: null,
      approved_at: null,
      rejection_reason_cn: "记忆正文需要重新编辑后再提交。"
    };
  }
  return {
    status: "pending",
    approved_by: null,
    approved_at: null,
    rejection_reason_cn: null
  };
}

function buildDraft() {
  const createdAt = nowIso();
  const score = Number(els.humanScore.value);
  const memoryApproval = approvalPayload();
  const assetStatus = finalAssetStatus();
  const version = currentVersion();
  const comparisonVersion = compareVersion();
  const memoryDeltaId = "memory-delta-v1-2-runtime-prototype-001";
  const humanApproval = {
    approved: els.humanApproved.checked,
    approved_by: els.humanApproved.checked ? "human_reviewer" : null,
    approved_at: els.humanApproved.checked ? createdAt : null,
    approval_notes_cn: els.humanApproved.checked ? "人工明确批准 accepted。" : "未获得人工正式批准。"
  };
  const humanReview = {
    reviewer_type: "human",
    reviewer_name: "human_reviewer",
    total_score: score,
    note_cn: els.humanComment.value.trim()
  };
  const memoryContent = els.memoryContent.value.trim();
  const annotationText = els.annotationNote.value.trim();
  const strengthsText = safeText(els.diffStrengths.value, "暂无新增改进点。");
  const issuesText = safeText(els.diffIssues.value, "暂无新增风险点。");
  const nextStepText = safeText(els.diffNext.value, "继续人工评审。");
  const draftGuard = runtimeGuard.clone(runtimeGuard.cleanGuard);
  const preflightChecks = buildPreflightChecks({
    humanReview,
    memoryContent,
    assetStatus,
    humanApproval,
    draftGuard
  });
  const acceptanceVerdict = buildAcceptanceVerdict({
    assetStatus,
    memoryStatus: memoryApproval.status,
    score,
    preflightChecks
  });
  const annotationNotes = annotationText
    ? [
        ...session.annotation_notes,
        {
          note_id: "annotation-v1-2-runtime-human-001",
          author: "human_reviewer",
          body_cn: annotationText,
          current_version_id: version.version_id,
          compare_version_id: comparisonVersion?.version_id || null
        }
      ]
    : session.annotation_notes;
  const versionComparison = {
    current_version_id: version.version_id,
    compare_version_id: comparisonVersion?.version_id || null,
    strengths_cn: strengthsText,
    issues_cn: issuesText,
    next_step_cn: nextStepText,
    summary_cn: comparisonVersion
      ? `人工正在对比 ${version.label} 与 ${comparisonVersion.label}。${annotationText}`
      : `人工正在单独评审 ${version.label}。${annotationText}`
  };

  return {
    review_session_draft: {
      session_id: session.session_id,
      task_id: session.task_id,
      case_id: session.case_id,
      project: session.project,
      status: reviewSessionStatus(assetStatus),
      image_versions: session.image_versions,
      current_version_id: version.version_id,
      compare_version_id: comparisonVersion?.version_id || null,
      ai_review: session.ai_review,
      human_review: humanReview,
      final_review: {
        source: "human_review",
        total_score: score,
        note_cn: humanReview.note_cn,
        rule_cn: "final_review 优先采用 human_review。"
      },
      comments: [
        ...session.comments,
        {
          comment_id: "comment-v1-2-runtime-human-001",
          author: "human_reviewer",
          body_cn: humanReview.note_cn
        }
      ],
      annotation_notes: annotationNotes,
      version_comparison: versionComparison,
      review_preflight: preflightChecks,
      acceptance_verdict: acceptanceVerdict,
      next_action_cn: nextActionLabel({
        assetStatus,
        memoryStatus: memoryApproval.status,
        guardClean: preflightChecks.prototype_guard_clean
      }),
      approval: {
        status: humanApproval.approved ? "approved" : "pending",
        approved_by: humanApproval.approved_by,
        approved_at: humanApproval.approved_at,
        approval_notes_cn: humanApproval.approval_notes_cn
      },
      archive_decision: {
        asset_status: assetStatus,
        human_approval: humanApproval,
        ai_archive_recommendation_is_final: false
      },
      memory_preview: {
        chinese_diary_title: session.memory_preview.chinese_diary_title,
        chinese_diary_content: memoryContent,
        target_notebook: session.memory_preview.target_notebook,
        maid: session.memory_preview.maid,
        tags: session.memory_preview.tags,
        safety: session.memory_preview.safety
      },
      memory_approval: memoryApproval,
      next_iteration: session.next_iteration,
      audit_log: [
        {
          event: "runtime_prototype_draft_generated",
          actor: "Review_Console_Runtime_Prototype",
          created_at: createdAt,
          note_cn: "runtime prototype 只生成草案，没有调用外部系统。",
          prototype_guard: runtimeGuard.clone(draftGuard)
        }
      ]
    },
    image_case_draft: {
      case_id: session.case_id,
      task_id: session.task_id,
      project: session.project,
      image_type: session.image_case_seed.image_type,
      input_assets: session.image_case_seed.input_assets,
      output_assets: [version.asset_ref],
      plugin_used: session.image_case_seed.plugin_used,
      prompt_package_id: session.image_case_seed.prompt_package_id,
      review_ids: session.image_case_seed.review_ids,
      final_score: score,
      asset_status: assetStatus,
      human_approval: humanApproval,
      strengths_cn: session.image_case_seed.strengths_cn,
      weaknesses_cn: session.image_case_seed.weaknesses_cn,
      reusable_rules_cn: session.image_case_seed.reusable_rules_cn,
      memory_entries: [memoryDeltaId],
      git_promotion_candidate: session.image_case_seed.git_promotion_candidate
    },
    memory_delta_draft: {
      delta_id: memoryDeltaId,
      task_id: session.task_id,
      case_id: session.case_id,
      created_at: createdAt,
      agent_name: "Review_Console_Runtime_Prototype",
      agent_role: "runtime_prototype",
      project: session.project,
      memory_type: "style_review_handoff",
      target_notebook: session.memory_preview.target_notebook,
      write_mode: memoryWriteMode(memoryApproval.status),
      importance: "medium",
      approval_required: true,
      approval_status: memoryApproval.status,
      approved_by: memoryApproval.approved_by,
      approved_at: memoryApproval.approved_at,
      source: {
        source_type: "review_console_runtime_prototype",
        source_ids: [session.session_id, session.task_id, session.case_id]
      },
      chinese_diary_title: session.memory_preview.chinese_diary_title,
      chinese_diary_content: memoryContent,
      preserved_original: {
        prompt_en: null,
        plugin_name: null,
        model_name: null,
        file_ref: version.asset_ref
      },
      tags: session.memory_preview.tags,
      visibility: "audit",
      memory_safety: session.memory_preview.safety,
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
    },
    prototype_guard: runtimeGuard.clone(draftGuard)
  };
}

function buildReadableDraft(draft) {
  const reviewDraft = draft.review_session_draft;
  const imageCaseDraft = draft.image_case_draft;
  const memoryDeltaDraft = draft.memory_delta_draft;
  const lines = [
    `评审状态：${reviewStatusLabel(reviewDraft.status)}`,
    `资产结论：${assetStatusLabel(imageCaseDraft.asset_status)}`,
    `当前版本：${reviewDraft.current_version_id}`,
    `对比版本：${reviewDraft.compare_version_id || "不对比"}`,
    `人工评分：${reviewDraft.final_review.total_score}`,
    `人工评论：${reviewDraft.final_review.note_cn || "未填写"}`,
    `改进点：${reviewDraft.version_comparison.strengths_cn}`,
    `风险点：${reviewDraft.version_comparison.issues_cn}`,
    `下一步：${reviewDraft.version_comparison.next_step_cn}`,
    `记忆标题：${memoryDeltaDraft.chinese_diary_title}`,
    `记忆正文：${memoryDeltaDraft.chinese_diary_content || "未填写"}`,
    `记忆状态：${memoryStatusLabel(memoryDeltaDraft.approval_status)}`,
    `写入申请：${writeRequestLabel(memoryDeltaDraft.final_decision.should_write_to_vcp)}`,
    `安全边界：${runtimeGuard.guardIsClean(draft.prototype_guard) ? "无外部副作用" : "存在风险"}`
  ];
  return lines.join("\n");
}

function submitDraftToHost(draft) {
  runtimeGuard.assertDraftSafe(draft);
  const ack = bridge.submitDraft(runtimeGuard.clone(draft));
  if (!ack || ack.side_effects_performed !== false || ack.accepted_by_host_mock !== true) {
    throw new Error("主程序桥接拒绝草案，或报告了外部副作用。");
  }
  return ack;
}

function render() {
  const draft = buildDraft();
  const version = currentVersion();
  const comparisonVersion = compareVersion();
  const reviewDraft = draft.review_session_draft;
  const imageCaseDraft = draft.image_case_draft;
  const memoryDeltaDraft = draft.memory_delta_draft;
  els.humanScoreOut.textContent = els.humanScore.value;
  els.assetRef.textContent = version.asset_ref;
  els.assetBox.textContent = comparisonVersion
    ? `${version.label}\nvs\n${comparisonVersion.label}`
    : version.label;
  els.comparisonSummary.textContent = reviewDraft.version_comparison.summary_cn;
  els.summarySessionStatus.textContent = reviewStatusLabel(reviewDraft.status);
  els.summaryAssetStatus.textContent = assetStatusLabel(imageCaseDraft.asset_status);
  els.summaryScoreBand.textContent = scoreBandLabel(reviewDraft.final_review.total_score);
  els.summaryMemoryStatus.textContent = memoryStatusLabel(memoryDeltaDraft.approval_status);
  els.summaryWriteRequest.textContent = writeRequestLabel(memoryDeltaDraft.final_decision.should_write_to_vcp);
  els.summaryGuard.textContent = runtimeGuard.guardIsClean(draft.prototype_guard) ? "无外部副作用" : "存在风险";
  els.summaryNextAction.textContent = reviewDraft.next_action_cn;
  els.verdictTitle.textContent = reviewDraft.acceptance_verdict.status_cn;
  els.verdictReasons.innerHTML = "";
  for (const reason of reviewDraft.acceptance_verdict.reasons_cn) {
    const item = document.createElement("li");
    item.textContent = reason;
    els.verdictReasons.appendChild(item);
  }
  els.boundaryBanner.textContent = "安全边界：只生成本地草案，没有真实写入，没有插件或 API 调用。";
  els.memoryPreviewTitle.textContent = memoryDeltaDraft.chinese_diary_title || "-";
  els.memoryPreviewTarget.textContent = memoryDeltaDraft.target_notebook || "-";
  els.memoryPreviewDecision.textContent = writeRequestLabel(memoryDeltaDraft.final_decision.should_write_to_vcp);
  els.memoryPreviewBody.textContent = memoryDeltaDraft.chinese_diary_content || "未填写中文记忆正文。";
  els.checkHumanComment && setChecklistItem(
    els.checkHumanComment,
    reviewDraft.review_preflight.human_comment_present,
    "人工评论已填写",
    "需要补充人工评论"
  );
  els.checkMemoryContent && setChecklistItem(
    els.checkMemoryContent,
    reviewDraft.review_preflight.memory_content_present && reviewDraft.review_preflight.chinese_memory_content_detected,
    "中文记忆正文已填写",
    "需要补充中文记忆正文"
  );
  els.checkHumanDecision && setChecklistItem(
    els.checkHumanDecision,
    reviewDraft.review_preflight.accepted_has_human_approval,
    "资产结论与人工确认一致",
    "标记可接受前需要人工确认"
  );
  els.checkGuard && setChecklistItem(
    els.checkGuard,
    reviewDraft.review_preflight.prototype_guard_clean,
    "安全边界正常",
    "安全边界存在风险"
  );
  els.checkWriteBoundary && setChecklistItem(
    els.checkWriteBoundary,
    reviewDraft.review_preflight.real_write_performed === false,
    "没有真实写入 DailyNote/VCP memory",
    "检测到真实写入风险"
  );
  els.readableDraft.textContent = buildReadableDraft(draft);
  els.draftOutput.textContent = JSON.stringify(draft, null, 2);
  try {
    const ack = submitDraftToHost(draft);
    els.hostStatus.textContent = ack.status_cn;
    els.hostSubmittedAt.textContent = ack.received_at;
  } catch (error) {
    els.hostStatus.textContent = error.message;
    els.hostSubmittedAt.textContent = "-";
  }
}

function init() {
  const version = currentVersion();
  els.taskId.textContent = session.task_id;
  els.caseId.textContent = session.case_id;
  els.assetRef.textContent = version.asset_ref;
  els.assetBox.textContent = version.label;
  [els.versionPicker, els.comparePicker, els.diffStrengths, els.diffIssues, els.diffNext, els.humanScore, els.humanComment, els.annotationNote, els.assetStatus, els.humanApproved, els.memoryContent, els.memoryApproval].forEach((el) => {
    el.addEventListener("input", render);
    el.addEventListener("change", render);
  });
  els.quickCandidate.addEventListener("click", () => applyQuickDecision("candidate"));
  els.quickAccept.addEventListener("click", () => applyQuickDecision("accept"));
  els.quickReject.addEventListener("click", () => applyQuickDecision("reject"));
  els.viewReadable.addEventListener("click", () => {
    setDraftView("readable");
    render();
  });
  els.viewTechnical.addEventListener("click", () => {
    setDraftView("technical");
    render();
  });
  setDraftView("readable");
  render();
}

init();
