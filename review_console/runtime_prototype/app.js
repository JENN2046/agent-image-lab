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
  queueFilter: document.getElementById("queueFilter"),
  queueTotal: document.getElementById("queueTotal"),
  queueVisible: document.getElementById("queueVisible"),
  queueProgress: document.getElementById("queueProgress"),
  queueSelected: document.getElementById("queueSelected"),
  queuePrev: document.getElementById("queuePrev"),
  queueNext: document.getElementById("queueNext"),
  queueList: document.getElementById("queueList"),
  batchTotal: document.getElementById("batchTotal"),
  batchAccepted: document.getElementById("batchAccepted"),
  batchPending: document.getElementById("batchPending"),
  batchWriteRequests: document.getElementById("batchWriteRequests"),
  batchBlocked: document.getElementById("batchBlocked"),
  batchSummary: document.getElementById("batchSummary"),
  batchNextItems: document.getElementById("batchNextItems"),
  batchBlockedItems: document.getElementById("batchBlockedItems"),
  diffStrengths: document.getElementById("diffStrengths"),
  diffIssues: document.getElementById("diffIssues"),
  diffNext: document.getElementById("diffNext"),
  humanScore: document.getElementById("humanScore"),
  humanScoreOut: document.getElementById("humanScoreOut"),
  humanComment: document.getElementById("humanComment"),
  annotationNote: document.getElementById("annotationNote"),
  tplComposition: document.getElementById("tplComposition"),
  tplDetailNoise: document.getElementById("tplDetailNoise"),
  tplTextArtifact: document.getElementById("tplTextArtifact"),
  tplNeedsRetry: document.getElementById("tplNeedsRetry"),
  tplCandidateNoMemory: document.getElementById("tplCandidateNoMemory"),
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
  handoffStatus: document.getElementById("handoffStatus"),
  handoffExecution: document.getElementById("handoffExecution"),
  handoffPluginCalls: document.getElementById("handoffPluginCalls"),
  handoffSummary: document.getElementById("handoffSummary"),
  handoffAllowed: document.getElementById("handoffAllowed"),
  handoffForbidden: document.getElementById("handoffForbidden"),
  viewReadable: document.getElementById("viewReadable"),
  viewTechnical: document.getElementById("viewTechnical"),
  readableDraft: document.getElementById("readableDraft"),
  reviewCardStatus: document.getElementById("reviewCardStatus"),
  reviewCardScore: document.getElementById("reviewCardScore"),
  reviewCardVerdict: document.getElementById("reviewCardVerdict"),
  reviewCardComment: document.getElementById("reviewCardComment"),
  assetCardStatus: document.getElementById("assetCardStatus"),
  assetCardVersion: document.getElementById("assetCardVersion"),
  assetCardNext: document.getElementById("assetCardNext"),
  assetCardDiff: document.getElementById("assetCardDiff"),
  memoryCardTitle: document.getElementById("memoryCardTitle"),
  memoryCardTarget: document.getElementById("memoryCardTarget"),
  memoryCardDecision: document.getElementById("memoryCardDecision"),
  memoryCardBody: document.getElementById("memoryCardBody"),
  memoryCardBoundary: document.getElementById("memoryCardBoundary"),
  draftOutput: document.getElementById("draftOutput")
};

let activeDraftView = "readable";
let queueState = normalizeQueueItems(
  session.review_queue.length > 0 ? runtimeGuard.clone(session.review_queue) : buildDefaultQueueFromVersions()
);
let selectedQueueId = (queueState.find((item) => item.version_id === session.current_version_id) || queueState[0] || {}).queue_id || null;

function buildDefaultQueueFromVersions() {
  return session.image_versions.map((version, index) => ({
    queue_id: `queue-${version.version_id}`,
    version_id: version.version_id,
    compare_version_id: index > 0 ? session.image_versions[0]?.version_id || "" : "",
    title_cn: version.label,
    priority_cn: index === 0 ? "参考样例" : "待评审",
    asset_status: "candidate",
    review_status: "human_reviewing",
    score: version.score || 80,
    human_approved: false,
    memory_approval_status: "pending",
    human_note_cn: "等待人工评审。",
    annotation_note_cn: "",
    strengths_cn: "暂无新增改进点。",
    issues_cn: "暂无新增风险点。",
    next_step_cn: "继续人工评审。",
    memory_content_cn: session.memory_preview.chinese_diary_content || ""
  }));
}

function queueDraftStateFromItem(item) {
  return {
    version_id: item.version_id,
    compare_version_id: item.compare_version_id || "",
    asset_status: item.asset_status || "candidate",
    review_status: item.review_status || reviewSessionStatus(item.asset_status || "candidate"),
    score: Number(item.score || 80),
    human_approved: item.human_approved === true,
    memory_approval_status: item.memory_approval_status || "pending",
    human_note_cn: item.human_note_cn || "等待人工评审。",
    annotation_note_cn: item.annotation_note_cn || "",
    strengths_cn: item.strengths_cn || "暂无新增改进点。",
    issues_cn: item.issues_cn || "暂无新增风险点。",
    next_step_cn: item.next_step_cn || "继续人工评审。",
    memory_content_cn: item.memory_content_cn || session.memory_preview.chinese_diary_content || ""
  };
}

function normalizeQueueItem(item) {
  const nextItem = runtimeGuard.clone(item);
  const draftState = {
    ...queueDraftStateFromItem(nextItem),
    ...(nextItem.draft_state || {})
  };
  nextItem.draft_state = draftState;
  nextItem.version_id = draftState.version_id;
  nextItem.compare_version_id = draftState.compare_version_id;
  nextItem.asset_status = draftState.asset_status;
  nextItem.review_status = draftState.review_status;
  nextItem.score = draftState.score;
  nextItem.human_approved = draftState.human_approved;
  nextItem.memory_approval_status = draftState.memory_approval_status;
  nextItem.human_note_cn = draftState.human_note_cn;
  nextItem.annotation_note_cn = draftState.annotation_note_cn;
  nextItem.strengths_cn = draftState.strengths_cn;
  nextItem.issues_cn = draftState.issues_cn;
  nextItem.next_step_cn = draftState.next_step_cn;
  nextItem.memory_content_cn = draftState.memory_content_cn;
  return nextItem;
}

function normalizeQueueItems(items) {
  return items.map(normalizeQueueItem);
}

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

function activeQueueItem() {
  return queueState.find((item) => item.queue_id === selectedQueueId) || queueState[0] || null;
}

function queueStatusLabel(item) {
  if (item.review_status === "human_reviewing") return "待评审";
  return reviewStatusLabel(item.review_status) || assetStatusLabel(item.asset_status);
}

function itemHasWriteRequest(item) {
  return item.asset_status === "accepted" && item.human_approved === true && item.memory_approval_status === "approved";
}

function itemIsBlocked(item) {
  return (
    item.asset_status === "rejected" ||
    item.asset_status === "draft" ||
    (item.asset_status === "accepted" && item.human_approved !== true)
  );
}

function itemNeedsAttention(item) {
  return item.asset_status === "candidate" || item.asset_status === "draft" || item.review_status === "human_reviewing";
}

function queueMatchesFilter(item, filter) {
  if (filter === "all") return true;
  if (filter === "human_reviewing") return item.review_status === "human_reviewing";
  if (filter === "write_request") return itemHasWriteRequest(item);
  if (filter === "blocked") return itemIsBlocked(item);
  if (filter === "next_attention") return itemNeedsAttention(item);
  return item.asset_status === filter;
}

function filteredQueueItems(queueDraft = queueState) {
  const filter = els.queueFilter.value || "all";
  return queueDraft.filter((item) => queueMatchesFilter(item, filter));
}

function buildQueueProgress(queueDraft) {
  const filter = els.queueFilter.value || "all";
  const filteredItems = filteredQueueItems(queueDraft);
  const activeIndex = filteredItems.findIndex((item) => item.queue_id === selectedQueueId);
  return {
    filter,
    total_count: queueDraft.length,
    visible_count: filteredItems.length,
    active_index: activeIndex >= 0 ? activeIndex + 1 : null,
    selected_queue_id: selectedQueueId
  };
}

function loadQueueItemIntoForm(item) {
  if (!item) return;
  const draftState = item.draft_state || queueDraftStateFromItem(item);
  els.versionPicker.value = draftState.version_id;
  els.comparePicker.value = draftState.compare_version_id || "";
  els.diffStrengths.value = draftState.strengths_cn || "暂无新增改进点。";
  els.diffIssues.value = draftState.issues_cn || "暂无新增风险点。";
  els.diffNext.value = draftState.next_step_cn || "继续人工评审。";
  els.humanScore.value = String(draftState.score || 80);
  els.humanComment.value = draftState.human_note_cn || "等待人工评审。";
  els.annotationNote.value = draftState.annotation_note_cn || "";
  els.assetStatus.value = draftState.asset_status === "accepted" ? "candidate" : draftState.asset_status || "candidate";
  els.humanApproved.checked = draftState.asset_status === "accepted" || draftState.human_approved === true;
  els.memoryApproval.value = draftState.memory_approval_status || "pending";
  els.memoryContent.value = draftState.memory_content_cn || session.memory_preview.chinese_diary_content || "";
}

function syncActiveQueueItemFromForm() {
  const item = activeQueueItem();
  if (!item) return;
  const assetStatus = finalAssetStatus();
  const draftState = {
    version_id: els.versionPicker.value || item.version_id,
    compare_version_id: els.comparePicker.value || "",
    asset_status: assetStatus,
    review_status: reviewSessionStatus(assetStatus),
    score: Number(els.humanScore.value),
    human_approved: els.humanApproved.checked,
    memory_approval_status: els.memoryApproval.value,
    human_note_cn: els.humanComment.value.trim(),
    annotation_note_cn: els.annotationNote.value.trim(),
    strengths_cn: safeText(els.diffStrengths.value, "暂无新增改进点。"),
    issues_cn: safeText(els.diffIssues.value, "暂无新增风险点。"),
    next_step_cn: safeText(els.diffNext.value, "继续人工评审。"),
    memory_content_cn: els.memoryContent.value.trim()
  };
  item.draft_state = draftState;
  Object.assign(item, draftState);
}

function selectQueueItem(queueId) {
  syncActiveQueueItemFromForm();
  selectedQueueId = queueId;
  loadQueueItemIntoForm(activeQueueItem());
  render();
}

function selectAdjacentQueueItem(direction) {
  syncActiveQueueItemFromForm();
  const filteredItems = filteredQueueItems(queueState);
  if (filteredItems.length === 0) return;
  const currentIndex = filteredItems.findIndex((item) => item.queue_id === selectedQueueId);
  const nextIndex =
    currentIndex < 0
      ? 0
      : Math.max(0, Math.min(filteredItems.length - 1, currentIndex + direction));
  selectedQueueId = filteredItems[nextIndex].queue_id;
  loadQueueItemIntoForm(activeQueueItem());
  render();
}

function buildQueueDraft({
  version,
  comparisonVersion,
  score,
  assetStatus,
  memoryApproval,
  humanReview,
  annotationText,
  strengthsText,
  issuesText,
  nextStepText,
  memoryContent
}) {
  return queueState.map((item) => {
    if (item.queue_id !== selectedQueueId) return normalizeQueueItem(item);
    const draftState = {
      version_id: version.version_id,
      compare_version_id: comparisonVersion?.version_id || "",
      asset_status: assetStatus,
      review_status: reviewSessionStatus(assetStatus),
      score,
      human_approved: els.humanApproved.checked,
      memory_approval_status: memoryApproval.status,
      human_note_cn: humanReview.note_cn,
      annotation_note_cn: annotationText,
      strengths_cn: strengthsText,
      issues_cn: issuesText,
      next_step_cn: nextStepText,
      memory_content_cn: memoryContent
    };
    const nextItem = {
      ...runtimeGuard.clone(item),
      ...draftState,
      draft_state: draftState
    };
    return normalizeQueueItem(nextItem);
  });
}

function buildBatchReviewSummary(queueDraft) {
  const counts = {
    total_count: queueDraft.length,
    accepted_count: 0,
    candidate_count: 0,
    rejected_count: 0,
    draft_count: 0,
    human_reviewing_count: 0,
    write_request_count: 0,
    blocked_count: 0
  };
  const nextAttentionItems = [];
  const blockedItems = [];

  for (const item of queueDraft) {
    if (item.asset_status === "accepted") counts.accepted_count += 1;
    if (item.asset_status === "candidate") counts.candidate_count += 1;
    if (item.asset_status === "rejected") counts.rejected_count += 1;
    if (item.asset_status === "draft") counts.draft_count += 1;
    if (item.review_status === "human_reviewing") counts.human_reviewing_count += 1;
    if (itemHasWriteRequest(item)) {
      counts.write_request_count += 1;
    }
    if (item.asset_status === "rejected") {
      blockedItems.push({
        queue_id: item.queue_id,
        title_cn: item.title_cn,
        reason_cn: "已拒收，需要下一轮修正。"
      });
    } else if (item.asset_status === "draft") {
      blockedItems.push({
        queue_id: item.queue_id,
        title_cn: item.title_cn,
        reason_cn: "仍是草稿，不能进入归档。"
      });
    } else if (item.asset_status === "accepted" && item.human_approved !== true) {
      blockedItems.push({
        queue_id: item.queue_id,
        title_cn: item.title_cn,
        reason_cn: "标记可接受但缺少人工确认。"
      });
    }
    if (itemNeedsAttention(item)) {
      nextAttentionItems.push({
        queue_id: item.queue_id,
        title_cn: item.title_cn,
        reason_cn: item.next_step_cn || "继续人工评审。"
      });
    }
  }

  counts.blocked_count = blockedItems.length;
  return {
    status_cn: "批量草案可交接",
    counts,
    summary_cn: `共 ${counts.total_count} 个候选：${counts.accepted_count} 个可接受，${counts.candidate_count} 个候选，${counts.rejected_count} 个已拒收，${counts.draft_count} 个草稿；${counts.write_request_count} 个写入申请草案，0 个真实写入。`,
    next_attention_items: nextAttentionItems,
    blocked_items: blockedItems,
    boundary_cn: "当前只生成批量评审交接草案，没有调用插件、API、DailyNote，也没有写入 VCP memory。",
    no_execution_guard: runtimeGuard.clone(runtimeGuard.cleanGuard)
  };
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

function appendTextareaText(textarea, text) {
  const current = textarea.value.trim();
  textarea.value = current ? `${current}\n${text}` : text;
}

function applyTemplate(templateId) {
  if (templateId === "composition") {
    appendTextareaText(els.diffStrengths, "构图稳定，主体关系清楚。");
    appendTextareaText(els.annotationNote, "构图稳定，可作为候选优势记录。");
  } else if (templateId === "detail_noise") {
    appendTextareaText(els.diffIssues, "细节噪点需要人工复核。");
    appendTextareaText(els.annotationNote, "局部细节仍有噪点风险。");
  } else if (templateId === "text_artifact") {
    appendTextareaText(els.diffIssues, "存在疑似文字伪影，需要谨慎处理。");
    appendTextareaText(els.humanComment, "注意：疑似文字伪影不能自动忽略。");
  } else if (templateId === "needs_retry") {
    appendTextareaText(els.diffNext, "建议进入下一轮重跑或修 prompt。");
    els.assetStatus.value = "draft";
    els.humanApproved.checked = false;
  } else if (templateId === "candidate_no_memory") {
    appendTextareaText(els.diffNext, "可作为候选继续评审，但暂不提交记忆写入申请。");
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
  const reviewQueueDraft = buildQueueDraft({
    version,
    comparisonVersion,
    score,
    assetStatus,
    memoryApproval,
    humanReview,
    annotationText,
    strengthsText,
    issuesText,
    nextStepText,
    memoryContent
  });
  const batchReviewSummaryDraft = buildBatchReviewSummary(reviewQueueDraft);

  return {
    review_session_draft: {
      session_id: session.session_id,
      task_id: session.task_id,
      case_id: session.case_id,
      project: session.project,
      status: reviewSessionStatus(assetStatus),
      selected_queue_id: selectedQueueId,
      review_queue: reviewQueueDraft,
      queue_progress: buildQueueProgress(reviewQueueDraft),
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
    batch_review_summary_draft: batchReviewSummaryDraft,
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
    adapter_dry_run_handoff_draft: runtimeGuard.clone(session.adapter_dry_run_handoff),
    prototype_guard: runtimeGuard.clone(draftGuard)
  };
}

function submitDraftToHost(draft) {
  runtimeGuard.assertDraftSafe(draft);
  const ack = bridge.submitDraft(runtimeGuard.clone(draft));
  if (!ack || ack.side_effects_performed !== false || ack.accepted_by_host_mock !== true) {
    throw new Error("主程序桥接拒绝草案，或报告了外部副作用。");
  }
  return ack;
}

function renderList(el, items) {
  el.innerHTML = "";
  for (const text of items) {
    const item = document.createElement("li");
    item.textContent = text;
    el.appendChild(item);
  }
}

function renderQueueList(queueDraft) {
  const filteredItems = filteredQueueItems(queueDraft);
  const activeItem = queueDraft.find((item) => item.queue_id === selectedQueueId) || queueDraft[0] || null;
  const activeIndex = filteredItems.findIndex((item) => item.queue_id === selectedQueueId);
  els.queueTotal.textContent = String(queueDraft.length);
  els.queueVisible.textContent = String(filteredItems.length);
  els.queueProgress.textContent = activeIndex >= 0 ? `${activeIndex + 1} / ${filteredItems.length}` : `- / ${filteredItems.length}`;
  els.queueSelected.textContent = activeItem ? activeItem.title_cn : "-";
  els.queuePrev.disabled = activeIndex <= 0;
  els.queueNext.disabled = activeIndex < 0 || activeIndex >= filteredItems.length - 1;
  els.queueList.innerHTML = "";
  if (filteredItems.length === 0) {
    const empty = document.createElement("p");
    empty.className = "queue-empty";
    empty.textContent = "没有符合筛选条件的候选。";
    els.queueList.appendChild(empty);
    return;
  }
  for (const item of filteredItems) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "queue-item";
    button.dataset.queueId = item.queue_id;
    button.dataset.active = String(item.queue_id === selectedQueueId);
    button.dataset.status = item.asset_status;
    button.textContent = `${item.title_cn}\n${queueStatusLabel(item)} · ${assetStatusLabel(item.asset_status)} · ${item.score} 分 · ${item.priority_cn}\n${item.issues_cn}`;
    button.addEventListener("click", () => selectQueueItem(item.queue_id));
    els.queueList.appendChild(button);
  }
}

function renderBatchSummary(batchSummary) {
  const counts = batchSummary.counts;
  els.batchTotal.textContent = String(counts.total_count);
  els.batchAccepted.textContent = String(counts.accepted_count);
  els.batchPending.textContent = String(counts.human_reviewing_count);
  els.batchWriteRequests.textContent = String(counts.write_request_count);
  els.batchBlocked.textContent = String(counts.blocked_count);
  els.batchSummary.textContent = `${batchSummary.summary_cn} ${batchSummary.boundary_cn}`;
  renderList(
    els.batchNextItems,
    batchSummary.next_attention_items.map((item) => `${item.title_cn}：${item.reason_cn}`)
  );
  renderList(
    els.batchBlockedItems,
    batchSummary.blocked_items.length > 0
      ? batchSummary.blocked_items.map((item) => `${item.title_cn}：${item.reason_cn}`)
      : ["没有阻塞项。"]
  );
}

function render() {
  const draft = buildDraft();
  const version = currentVersion();
  const comparisonVersion = compareVersion();
  const reviewDraft = draft.review_session_draft;
  const imageCaseDraft = draft.image_case_draft;
  const memoryDeltaDraft = draft.memory_delta_draft;
  const handoffDraft = draft.adapter_dry_run_handoff_draft;
  const batchSummaryDraft = draft.batch_review_summary_draft;
  queueState = normalizeQueueItems(reviewDraft.review_queue);
  renderQueueList(reviewDraft.review_queue);
  renderBatchSummary(batchSummaryDraft);
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
  els.handoffStatus.textContent = handoffDraft.status_cn;
  els.handoffExecution.textContent = handoffDraft.execution_blocked ? "已阻止真实执行" : "存在执行风险";
  els.handoffPluginCalls.textContent = `${handoffDraft.max_plugin_calls} 次`;
  els.handoffSummary.textContent = handoffDraft.gatekeeper_summary_cn;
  renderList(els.handoffAllowed, handoffDraft.allowed_actions_cn);
  renderList(els.handoffForbidden, handoffDraft.forbidden_actions_cn);
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
  els.reviewCardStatus.textContent = reviewStatusLabel(reviewDraft.status);
  els.reviewCardScore.textContent = `${reviewDraft.final_review.total_score} / 100`;
  els.reviewCardVerdict.textContent = reviewDraft.acceptance_verdict.status_cn;
  els.reviewCardComment.textContent = reviewDraft.final_review.note_cn || "未填写人工评论。";
  els.assetCardStatus.textContent = assetStatusLabel(imageCaseDraft.asset_status);
  els.assetCardVersion.textContent = reviewDraft.current_version_id;
  els.assetCardNext.textContent = reviewDraft.version_comparison.next_step_cn;
  els.assetCardDiff.textContent = `改进点：${reviewDraft.version_comparison.strengths_cn}\n风险点：${reviewDraft.version_comparison.issues_cn}`;
  els.memoryCardTitle.textContent = memoryDeltaDraft.chinese_diary_title || "-";
  els.memoryCardTarget.textContent = memoryDeltaDraft.target_notebook || "-";
  els.memoryCardDecision.textContent = writeRequestLabel(memoryDeltaDraft.final_decision.should_write_to_vcp);
  els.memoryCardBody.textContent = memoryDeltaDraft.chinese_diary_content || "未填写中文记忆正文。";
  els.memoryCardBoundary.textContent = "当前只是写入申请草案，没有真实写入。";
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
  loadQueueItemIntoForm(activeQueueItem());
  const version = currentVersion();
  els.taskId.textContent = session.task_id;
  els.caseId.textContent = session.case_id;
  els.assetRef.textContent = version.asset_ref;
  els.assetBox.textContent = version.label;
  [els.versionPicker, els.comparePicker, els.queueFilter, els.diffStrengths, els.diffIssues, els.diffNext, els.humanScore, els.humanComment, els.annotationNote, els.assetStatus, els.humanApproved, els.memoryContent, els.memoryApproval].forEach((el) => {
    el.addEventListener("input", render);
    el.addEventListener("change", render);
  });
  els.quickCandidate.addEventListener("click", () => applyQuickDecision("candidate"));
  els.quickAccept.addEventListener("click", () => applyQuickDecision("accept"));
  els.quickReject.addEventListener("click", () => applyQuickDecision("reject"));
  els.queuePrev.addEventListener("click", () => selectAdjacentQueueItem(-1));
  els.queueNext.addEventListener("click", () => selectAdjacentQueueItem(1));
  els.tplComposition.addEventListener("click", () => applyTemplate("composition"));
  els.tplDetailNoise.addEventListener("click", () => applyTemplate("detail_noise"));
  els.tplTextArtifact.addEventListener("click", () => applyTemplate("text_artifact"));
  els.tplNeedsRetry.addEventListener("click", () => applyTemplate("needs_retry"));
  els.tplCandidateNoMemory.addEventListener("click", () => applyTemplate("candidate_no_memory"));
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
