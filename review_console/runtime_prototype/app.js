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
  queueSearch: document.getElementById("queueSearch"),
  queueSort: document.getElementById("queueSort"),
  queueTotal: document.getElementById("queueTotal"),
  queueVisible: document.getElementById("queueVisible"),
  queueProgress: document.getElementById("queueProgress"),
  queueSelected: document.getElementById("queueSelected"),
  queuePrev: document.getElementById("queuePrev"),
  queueNext: document.getElementById("queueNext"),
  batchShowAuthorizable: document.getElementById("batchShowAuthorizable"),
  batchShowBlocked: document.getElementById("batchShowBlocked"),
  batchShowNext: document.getElementById("batchShowNext"),
  batchSelectVisible: document.getElementById("batchSelectVisible"),
  batchClearSelection: document.getElementById("batchClearSelection"),
  batchMarkReview: document.getElementById("batchMarkReview"),
  batchMarkBlocked: document.getElementById("batchMarkBlocked"),
  batchMarkNoMemory: document.getElementById("batchMarkNoMemory"),
  batchSelectedCount: document.getElementById("batchSelectedCount"),
  batchOperationStatus: document.getElementById("batchOperationStatus"),
  undoLastAction: document.getElementById("undoLastAction"),
  historyStatus: document.getElementById("historyStatus"),
  historyCount: document.getElementById("historyCount"),
  queueList: document.getElementById("queueList"),
  batchTotal: document.getElementById("batchTotal"),
  batchAccepted: document.getElementById("batchAccepted"),
  batchPending: document.getElementById("batchPending"),
  batchWriteRequests: document.getElementById("batchWriteRequests"),
  batchBlocked: document.getElementById("batchBlocked"),
  batchSummary: document.getElementById("batchSummary"),
  batchWriteItems: document.getElementById("batchWriteItems"),
  batchNextItems: document.getElementById("batchNextItems"),
  batchBlockedItems: document.getElementById("batchBlockedItems"),
  batchPreflightItems: document.getElementById("batchPreflightItems"),
  batchReport: document.getElementById("batchReport"),
  batchDecisionStatus: document.getElementById("batchDecisionStatus"),
  batchDecisionReason: document.getElementById("batchDecisionReason"),
  preauthPackageStatus: document.getElementById("preauthPackageStatus"),
  preauthPackageItems: document.getElementById("preauthPackageItems"),
  preauthPackageForbidden: document.getElementById("preauthPackageForbidden"),
  preauthPackageText: document.getElementById("preauthPackageText"),
  sessionTransferStatus: document.getElementById("sessionTransferStatus"),
  sessionTransferCount: document.getElementById("sessionTransferCount"),
  sessionTransferGuard: document.getElementById("sessionTransferGuard"),
  sessionFingerprint: document.getElementById("sessionFingerprint"),
  sessionTransferText: document.getElementById("sessionTransferText"),
  importPreviewStatus: document.getElementById("importPreviewStatus"),
  importPreviewItems: document.getElementById("importPreviewItems"),
  exportSessionDraft: document.getElementById("exportSessionDraft"),
  validateImportDraft: document.getElementById("validateImportDraft"),
  applyImportDraft: document.getElementById("applyImportDraft"),
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
  riskTextArtifact: document.getElementById("riskTextArtifact"),
  riskPersonFace: document.getElementById("riskPersonFace"),
  riskCompositionShift: document.getElementById("riskCompositionShift"),
  riskBrandMark: document.getElementById("riskBrandMark"),
  riskMemoryUnsuitable: document.getElementById("riskMemoryUnsuitable"),
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
  inspectionVerdict: document.getElementById("inspectionVerdict"),
  inspectionChecklist: document.getElementById("inspectionChecklist"),
  inspectionRiskStats: document.getElementById("inspectionRiskStats"),
  inspectionRiskGroups: document.getElementById("inspectionRiskGroups"),
  inspectionReport: document.getElementById("inspectionReport"),
  statusGlossaryList: document.getElementById("statusGlossaryList"),
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
let selectedBatchQueueIds = new Set();
let batchOperationStatusText = "尚未执行批量操作。";
let sessionTransferStatusText = "尚未导出或导入复核会话。";
let historyStatusText = "尚未产生可撤销操作。";
let historyStack = [];
let lastRenderedSnapshot = null;
let isRestoringSnapshot = false;
let sessionImportPreviewState = null;

const riskTagDefinitions = [
  {
    id: "text_artifact",
    label_cn: "文字伪影",
    reason_cn: "存在文字伪影风险，不能进入授权前复核。",
    high_risk: true
  },
  {
    id: "person_or_face",
    label_cn: "人物/人脸风险",
    reason_cn: "存在人物或人脸风险，不能进入授权前复核。",
    high_risk: true
  },
  {
    id: "composition_shift",
    label_cn: "构图偏移",
    reason_cn: "核心构图偏离目标，需要人工复查。",
    high_risk: true
  },
  {
    id: "brand_mark",
    label_cn: "品牌/标记风险",
    reason_cn: "存在品牌、标记或可识别符号风险，不能进入授权前复核。",
    high_risk: true
  },
  {
    id: "memory_unsuitable",
    label_cn: "不适合入记忆",
    reason_cn: "当前候选不适合进入记忆写入申请。",
    high_risk: true
  }
];

const statusGlossary = [
  { key: "draft_only", label_cn: "仅草案", explanation_cn: "只在本地生成可复核内容，不构成授权，也不触发真实执行。" },
  { key: "authorizable", label_cn: "可授权前复核", explanation_cn: "候选已满足本地草案条件，可放入下一份 A5 授权前人工复核包。" },
  { key: "partial_authorizable", label_cn: "部分可授权", explanation_cn: "本批有候选可进入授权前复核，但还有阻塞或风险项需要处理。" },
  { key: "blocked", label_cn: "阻塞", explanation_cn: "候选不能进入归档或授权前复核，必须先处理原因。" },
  { key: "needs_review", label_cn: "待继续评审", explanation_cn: "候选尚未完成全部人工判断或审批。" },
  { key: "write_request", label_cn: "写入申请草案", explanation_cn: "已形成写入申请草案，但没有真实写入 DailyNote/VCP memory。" }
];

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
    memory_content_cn: session.memory_preview.chinese_diary_content || "",
    risk_tags: []
  }));
}

function normalizeRiskTags(value) {
  const allowed = new Set(riskTagDefinitions.map((tag) => tag.id));
  const rawTags = Array.isArray(value) ? value : [];
  return Array.from(new Set(rawTags.filter((tag) => allowed.has(tag))));
}

function riskTagLabel(tagId) {
  return riskTagDefinitions.find((tag) => tag.id === tagId)?.label_cn || tagId;
}

function riskTagsLabel(riskTags) {
  const tags = normalizeRiskTags(riskTags);
  return tags.length > 0 ? tags.map(riskTagLabel).join("、") : "无风险标签";
}

function statusExplanationCn(status) {
  return statusGlossary.find((item) => item.key === status)?.explanation_cn || "该状态需要人工结合上下文判断。";
}

function stableStringify(value) {
  if (value === undefined) return "null";
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  const keys = Object.keys(value).sort();
  return `{${keys.map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(",")}}`;
}

function sessionPayloadForFingerprint(payload) {
  const nextPayload = runtimeGuard.clone(payload || {});
  delete nextPayload.session_fingerprint;
  delete nextPayload.session_fingerprint_cn;
  return nextPayload;
}

function fingerprintString(value) {
  const text = stableStringify(value);
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `fnv1a32:${(hash >>> 0).toString(16).padStart(8, "0")}`;
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
    memory_content_cn: item.memory_content_cn || session.memory_preview.chinese_diary_content || "",
    risk_tags: normalizeRiskTags(item.risk_tags || item.draft_state?.risk_tags)
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
  nextItem.risk_tags = normalizeRiskTags(draftState.risk_tags);
  const reviewState = candidateReviewState(nextItem);
  nextItem.candidate_review_state = reviewState;
  nextItem.preauthorization_status = reviewState.status;
  nextItem.preauthorization_status_cn = reviewState.status_cn;
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

function riskSummaryForItem(item) {
  const tags = normalizeRiskTags(item.risk_tags);
  const highRiskTags = tags.filter((tagId) => riskTagDefinitions.find((tag) => tag.id === tagId)?.high_risk);
  return {
    tags,
    tag_labels_cn: tags.map(riskTagLabel),
    high_risk_tags: highRiskTags,
    high_risk_labels_cn: highRiskTags.map(riskTagLabel),
    blocking: highRiskTags.length > 0,
    reason_cn:
      highRiskTags.length > 0
        ? `存在高风险标签：${highRiskTags.map(riskTagLabel).join("、")}。`
        : "没有高风险标签。"
  };
}

function itemHasBlockingRisk(item) {
  return riskSummaryForItem(item).blocking;
}

function itemHasWriteRequest(item) {
  return (
    item.asset_status === "accepted" &&
    item.human_approved === true &&
    item.memory_approval_status === "approved" &&
    !itemHasBlockingRisk(item)
  );
}

function itemIsBlocked(item) {
  return (
    item.asset_status === "rejected" ||
    item.asset_status === "draft" ||
    (item.asset_status === "accepted" && item.human_approved !== true) ||
    (item.asset_status === "accepted" && item.human_approved === true && item.memory_approval_status !== "approved") ||
    itemHasBlockingRisk(item)
  );
}

function itemNeedsAttention(item) {
  return (
    item.asset_status === "candidate" ||
    item.asset_status === "draft" ||
    item.review_status === "human_reviewing" ||
    (item.asset_status === "accepted" && item.human_approved === true && item.memory_approval_status !== "approved") ||
    itemHasBlockingRisk(item)
  );
}

function candidateReviewState(item) {
  const riskSummary = riskSummaryForItem(item);
  if (riskSummary.blocking) {
    return {
      status: "blocked",
      status_cn: "阻塞：存在高风险标签",
      reason_cn: riskSummary.reason_cn,
      next_action_cn: "先处理风险标签，不能直接进入 A5 授权前复核。"
    };
  }
  if (itemHasWriteRequest(item)) {
    return {
      status: "authorizable",
      status_cn: "可进入 A5 授权前复核",
      reason_cn: "已人工确认，记忆审批通过，并形成写入申请草案。",
      next_action_cn: "纳入 A5 授权前人工复核包草案。"
    };
  }
  if (item.asset_status === "accepted" && item.human_approved !== true) {
    return {
      status: "blocked",
      status_cn: "阻塞：缺少人工批准",
      reason_cn: "资产标记为 accepted，但没有人工明确批准。",
      next_action_cn: "先补齐人工批准，或退回候选状态。"
    };
  }
  if (item.asset_status === "accepted" && item.memory_approval_status !== "approved") {
    return {
      status: "blocked",
      status_cn: "阻塞：缺少记忆审批",
      reason_cn: "资产已人工接受，但记忆审批尚未通过。",
      next_action_cn: "先完成记忆审批，不能直接进入 A5 写入授权。"
    };
  }
  if (item.asset_status === "rejected") {
    return {
      status: "blocked",
      status_cn: "阻塞：已拒收",
      reason_cn: "候选已拒收，不能进入归档或写入授权。",
      next_action_cn: item.next_step_cn || "准备下一轮修正。"
    };
  }
  if (item.asset_status === "draft") {
    return {
      status: "blocked",
      status_cn: "阻塞：仍是草稿",
      reason_cn: "候选仍是草稿，不能进入归档或写入授权。",
      next_action_cn: item.next_step_cn || "继续完善草稿。"
    };
  }
  if (item.asset_status === "candidate" || item.review_status === "human_reviewing") {
    return {
      status: "needs_review",
      status_cn: "待人工继续评审",
      reason_cn: "候选尚未获得完整人工接受和记忆审批。",
      next_action_cn: item.next_step_cn || "继续人工评审。"
    };
  }
  return {
    status: "reviewed",
    status_cn: "已处理",
    reason_cn: "当前没有可执行后续动作。",
    next_action_cn: item.next_step_cn || "保持记录。"
  };
}

function queueBadgeText(item) {
  const badges = [];
  if (itemHasWriteRequest(item)) badges.push("写入申请");
  if (itemIsBlocked(item)) badges.push("阻塞");
  if (itemNeedsAttention(item)) badges.push("下一步");
  if (itemHasBlockingRisk(item)) badges.push("风险");
  return badges.length > 0 ? badges.join(" / ") : "已处理";
}

function queueMatchesFilter(item, filter) {
  if (filter === "all") return true;
  if (filter === "human_reviewing") return item.review_status === "human_reviewing";
  if (filter === "write_request") return itemHasWriteRequest(item);
  if (filter === "blocked") return itemIsBlocked(item);
  if (filter === "next_attention") return itemNeedsAttention(item);
  return item.asset_status === filter;
}

function queueMatchesSearch(item, searchText) {
  const needle = (searchText || "").trim().toLowerCase();
  if (!needle) return true;
  return [
    item.title_cn,
    item.version_id,
    item.priority_cn,
    item.human_note_cn,
    item.issues_cn,
    item.next_step_cn,
    item.preauthorization_status_cn,
    riskTagsLabel(item.risk_tags)
  ]
    .join("\n")
    .toLowerCase()
    .includes(needle);
}

function queueSortRank(item, sortMode) {
  if (sortMode === "authorizable") return itemHasWriteRequest(item) ? 0 : itemIsBlocked(item) ? 2 : 1;
  if (sortMode === "risk") return itemHasBlockingRisk(item) ? 0 : itemIsBlocked(item) ? 1 : 2;
  if (sortMode === "status") return { accepted: 0, candidate: 1, draft: 2, rejected: 3 }[item.asset_status] ?? 9;
  return 0;
}

function sortQueueItems(items, sortMode) {
  const nextItems = [...items];
  if (sortMode === "score_desc") {
    return nextItems.sort((a, b) => b.score - a.score || a.title_cn.localeCompare(b.title_cn, "zh-CN"));
  }
  if (sortMode === "score_asc") {
    return nextItems.sort((a, b) => a.score - b.score || a.title_cn.localeCompare(b.title_cn, "zh-CN"));
  }
  if (["authorizable", "risk", "status"].includes(sortMode)) {
    return nextItems.sort((a, b) => queueSortRank(a, sortMode) - queueSortRank(b, sortMode) || b.score - a.score);
  }
  return nextItems;
}

function filteredQueueItems(queueDraft = queueState) {
  const filter = els.queueFilter.value || "all";
  const searchText = els.queueSearch.value || "";
  const sortMode = els.queueSort.value || "default";
  return sortQueueItems(
    queueDraft.filter((item) => queueMatchesFilter(item, filter) && queueMatchesSearch(item, searchText)),
    sortMode
  );
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
    search_text: els.queueSearch.value || "",
    sort_mode: els.queueSort.value || "default",
    selected_queue_id: selectedQueueId
  };
}

function writeRiskTagsToForm(riskTags) {
  const tags = new Set(normalizeRiskTags(riskTags));
  els.riskTextArtifact.checked = tags.has("text_artifact");
  els.riskPersonFace.checked = tags.has("person_or_face");
  els.riskCompositionShift.checked = tags.has("composition_shift");
  els.riskBrandMark.checked = tags.has("brand_mark");
  els.riskMemoryUnsuitable.checked = tags.has("memory_unsuitable");
}

function readRiskTagsFromForm() {
  const tags = [];
  if (els.riskTextArtifact.checked) tags.push("text_artifact");
  if (els.riskPersonFace.checked) tags.push("person_or_face");
  if (els.riskCompositionShift.checked) tags.push("composition_shift");
  if (els.riskBrandMark.checked) tags.push("brand_mark");
  if (els.riskMemoryUnsuitable.checked) tags.push("memory_unsuitable");
  return tags;
}

function captureRuntimeSnapshot() {
  return {
    queue_state: runtimeGuard.clone(queueState),
    selected_queue_id: selectedQueueId,
    selected_batch_queue_ids: Array.from(selectedBatchQueueIds),
    queue_filter: els.queueFilter.value || "all",
    queue_search: els.queueSearch.value || "",
    queue_sort: els.queueSort.value || "default",
    form_state: {
      version_id: els.versionPicker.value,
      compare_version_id: els.comparePicker.value || "",
      strengths_cn: els.diffStrengths.value,
      issues_cn: els.diffIssues.value,
      next_step_cn: els.diffNext.value,
      score: els.humanScore.value,
      human_note_cn: els.humanComment.value,
      annotation_note_cn: els.annotationNote.value,
      asset_status: els.assetStatus.value,
      human_approved: els.humanApproved.checked,
      memory_content_cn: els.memoryContent.value,
      memory_approval_status: els.memoryApproval.value,
      risk_tags: readRiskTagsFromForm()
    },
    batch_operation_status_text: batchOperationStatusText,
    session_transfer_status_text: sessionTransferStatusText
  };
}

function restoreRuntimeSnapshot(snapshot) {
  if (!snapshot) return;
  isRestoringSnapshot = true;
  queueState = normalizeQueueItems(snapshot.queue_state || []);
  selectedQueueId = queueState.some((item) => item.queue_id === snapshot.selected_queue_id)
    ? snapshot.selected_queue_id
    : queueState[0]?.queue_id || null;
  selectedBatchQueueIds = new Set(
    (snapshot.selected_batch_queue_ids || []).filter((queueId) => queueState.some((item) => item.queue_id === queueId))
  );
  els.queueFilter.value = snapshot.queue_filter || "all";
  els.queueSearch.value = snapshot.queue_search || "";
  els.queueSort.value = snapshot.queue_sort || "default";
  if (snapshot.form_state) {
    els.versionPicker.value = snapshot.form_state.version_id || queueState[0]?.version_id || "";
    els.comparePicker.value = snapshot.form_state.compare_version_id || "";
    els.diffStrengths.value = snapshot.form_state.strengths_cn || "";
    els.diffIssues.value = snapshot.form_state.issues_cn || "";
    els.diffNext.value = snapshot.form_state.next_step_cn || "";
    els.humanScore.value = snapshot.form_state.score || "80";
    els.humanComment.value = snapshot.form_state.human_note_cn || "";
    els.annotationNote.value = snapshot.form_state.annotation_note_cn || "";
    els.assetStatus.value = snapshot.form_state.asset_status || "candidate";
    els.humanApproved.checked = snapshot.form_state.human_approved === true;
    els.memoryContent.value = snapshot.form_state.memory_content_cn || "";
    els.memoryApproval.value = snapshot.form_state.memory_approval_status || "pending";
    writeRiskTagsToForm(snapshot.form_state.risk_tags || []);
  } else {
    loadQueueItemIntoForm(activeQueueItem());
  }
  batchOperationStatusText = snapshot.batch_operation_status_text || "已恢复历史状态。";
  sessionTransferStatusText = snapshot.session_transfer_status_text || sessionTransferStatusText;
  isRestoringSnapshot = false;
}

function pushHistorySnapshot(actionCn) {
  if (isRestoringSnapshot || !lastRenderedSnapshot) return;
  historyStack.push({
    action_cn: actionCn,
    created_at: nowIso(),
    snapshot: runtimeGuard.clone(lastRenderedSnapshot)
  });
  if (historyStack.length > 25) historyStack.shift();
  historyStatusText = `已记录：${actionCn}`;
}

function undoLastHistoryAction() {
  const entry = historyStack.pop();
  if (!entry) {
    historyStatusText = "没有可撤销操作。";
    render();
    return;
  }
  restoreRuntimeSnapshot(entry.snapshot);
  historyStatusText = `已撤销：${entry.action_cn}`;
  render();
}

function trackedRender(actionCn) {
  pushHistorySnapshot(actionCn);
  render();
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
  writeRiskTagsToForm(draftState.risk_tags);
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
    memory_content_cn: els.memoryContent.value.trim(),
    risk_tags: readRiskTagsFromForm()
  };
  item.draft_state = draftState;
  Object.assign(item, draftState);
}

function selectQueueItem(queueId) {
  pushHistorySnapshot(`切换候选：${queueId}`);
  syncActiveQueueItemFromForm();
  selectedQueueId = queueId;
  loadQueueItemIntoForm(activeQueueItem());
  render();
}

function selectAdjacentQueueItem(direction) {
  pushHistorySnapshot(direction > 0 ? "切换到下一张候选" : "切换到上一张候选");
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

function applyQueueFilter(filter) {
  pushHistorySnapshot(`切换筛选：${filter}`);
  syncActiveQueueItemFromForm();
  els.queueFilter.value = filter;
  render();
}

function appendUniqueLine(value, line) {
  const current = (value || "").trim();
  if (!current) return line;
  if (current.includes(line)) return current;
  return `${current}\n${line}`;
}

function selectVisibleQueueItemsForBatch() {
  pushHistorySnapshot("选择当前显示候选");
  syncActiveQueueItemFromForm();
  for (const item of filteredQueueItems(queueState)) {
    selectedBatchQueueIds.add(item.queue_id);
  }
  batchOperationStatusText = `已选择当前显示的 ${selectedBatchQueueIds.size} 个候选。`;
  render();
}

function clearBatchSelection() {
  pushHistorySnapshot("清空批量选择");
  selectedBatchQueueIds = new Set();
  batchOperationStatusText = "已清空批量选择。";
  render();
}

function applyBatchReviewAction(action) {
  pushHistorySnapshot(`批量操作：${action}`);
  syncActiveQueueItemFromForm();
  const selectedIds = Array.from(selectedBatchQueueIds);
  if (selectedIds.length === 0) {
    batchOperationStatusText = "请先选择候选，再执行批量操作。";
    render();
    return;
  }
  const actionMap = {
    review: {
      action_cn: "需要复查",
      next_step_cn: "批量标记：需要人工继续复查。",
      note_cn: "批量备注：进入人工复查队列。"
    },
    blocked: {
      action_cn: "阻塞",
      next_step_cn: "批量标记：阻塞，先处理风险或缺失信息。",
      note_cn: "批量备注：阻塞项，不能进入授权前复核。"
    },
    no_memory: {
      action_cn: "暂不入记忆",
      next_step_cn: "批量标记：候选可继续观察，但暂不提交记忆写入申请。",
      note_cn: "批量备注：暂不入记忆。"
    }
  };
  const actionConfig = actionMap[action];
  if (!actionConfig) return;

  let changedCount = 0;
  let preservedCommentCount = 0;
  queueState = queueState.map((item) => {
    if (!selectedBatchQueueIds.has(item.queue_id)) return item;
    const nextItem = runtimeGuard.clone(item);
    const existingComment = nextItem.human_note_cn || "";
    if (existingComment.trim().length > 0) preservedCommentCount += 1;
    nextItem.human_note_cn = appendUniqueLine(existingComment, actionConfig.note_cn);
    nextItem.next_step_cn = appendUniqueLine(nextItem.next_step_cn || "", actionConfig.next_step_cn);
    if (action === "blocked") {
      nextItem.asset_status = "draft";
      nextItem.review_status = "human_reviewing";
      nextItem.human_approved = false;
      nextItem.memory_approval_status = "pending";
      nextItem.risk_tags = normalizeRiskTags([...(nextItem.risk_tags || []), "memory_unsuitable"]);
    } else if (action === "no_memory") {
      nextItem.asset_status = "candidate";
      nextItem.review_status = "human_reviewing";
      nextItem.human_approved = false;
      nextItem.memory_approval_status = "pending";
      nextItem.risk_tags = normalizeRiskTags([...(nextItem.risk_tags || []), "memory_unsuitable"]);
    } else {
      nextItem.asset_status = nextItem.asset_status === "accepted" ? "candidate" : nextItem.asset_status;
      nextItem.review_status = "human_reviewing";
      nextItem.human_approved = false;
      nextItem.memory_approval_status = "pending";
    }
    nextItem.draft_state = {
      ...queueDraftStateFromItem(nextItem),
      human_note_cn: nextItem.human_note_cn,
      next_step_cn: nextItem.next_step_cn,
      asset_status: nextItem.asset_status,
      review_status: nextItem.review_status,
      human_approved: nextItem.human_approved,
      memory_approval_status: nextItem.memory_approval_status,
      risk_tags: normalizeRiskTags(nextItem.risk_tags)
    };
    changedCount += 1;
    return normalizeQueueItem(nextItem);
  });
  loadQueueItemIntoForm(activeQueueItem());
  batchOperationStatusText = `批量标记${actionConfig.action_cn}：处理 ${changedCount} 个候选，保留原评论 ${preservedCommentCount} 条，只追加备注。`;
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
      memory_content_cn: memoryContent,
      risk_tags: readRiskTagsFromForm()
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
  const writeRequestItems = [];

  for (const item of queueDraft) {
    if (item.asset_status === "accepted") counts.accepted_count += 1;
    if (item.asset_status === "candidate") counts.candidate_count += 1;
    if (item.asset_status === "rejected") counts.rejected_count += 1;
    if (item.asset_status === "draft") counts.draft_count += 1;
    if (item.review_status === "human_reviewing") counts.human_reviewing_count += 1;
    if (itemHasWriteRequest(item)) {
      counts.write_request_count += 1;
      writeRequestItems.push({
        queue_id: item.queue_id,
        title_cn: item.title_cn,
        reason_cn: "已人工确认，并形成记忆写入申请草案。",
        note_cn: item.human_note_cn || ""
      });
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
    } else if (item.asset_status === "accepted" && item.human_approved === true && item.memory_approval_status !== "approved") {
      blockedItems.push({
        queue_id: item.queue_id,
        title_cn: item.title_cn,
        reason_cn: "已人工接受但缺少记忆审批。"
      });
    }
    if (itemHasBlockingRisk(item) && !blockedItems.some((blockedItem) => blockedItem.queue_id === item.queue_id)) {
      blockedItems.push({
        queue_id: item.queue_id,
        title_cn: item.title_cn,
        reason_cn: riskSummaryForItem(item).reason_cn
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
  const acceptedWithoutHumanApprovalCount = queueDraft.filter(
    (item) => item.asset_status === "accepted" && item.human_approved !== true
  ).length;
  const writeRequestWithoutApprovalCount = queueDraft.filter(
    (item) => item.asset_status === "accepted" && item.human_approved === true && item.memory_approval_status !== "approved"
  ).length;
  const noExecutionGuard = runtimeGuard.clone(runtimeGuard.cleanGuard);
  const preflight = {
    no_real_write: true,
    no_execution_guard_clean: runtimeGuard.guardIsClean(noExecutionGuard),
    accepted_without_human_approval_count: acceptedWithoutHumanApprovalCount,
    write_request_without_memory_approval_count: writeRequestWithoutApprovalCount,
    blocked_count: blockedItems.length,
    pending_review_count: counts.human_reviewing_count,
    result_cn:
      acceptedWithoutHumanApprovalCount > 0 || writeRequestWithoutApprovalCount > 0
        ? "存在审批链问题，不能进入后续授权。"
        : blockedItems.length > 0
          ? "可交接，但需要先处理阻塞项。"
          : "批量草案可进入人工复核。"
  };
  const reportLines = [
    `本批共有 ${counts.total_count} 个候选，${counts.accepted_count} 个可接受，${counts.write_request_count} 个形成写入申请草案。`,
    `可进入后续授权：${writeRequestItems.length > 0 ? writeRequestItems.map((item) => `${item.title_cn}（${item.note_cn || item.reason_cn}）`).join("、") : "暂无"}`,
    `阻塞项：${blockedItems.length > 0 ? blockedItems.map((item) => `${item.title_cn}（${item.reason_cn}）`).join("；") : "暂无"}`,
    `下一步处理：${nextAttentionItems.length > 0 ? nextAttentionItems.map((item) => `${item.title_cn}（${item.reason_cn}）`).join("；") : "暂无"}`,
    `预检结论：${preflight.result_cn}`,
    "边界确认：当前没有真实写入，没有插件/API/DailyNote 调用，也没有 VCP memory 写入。"
  ];
  return {
    status_cn: "批量草案可交接",
    counts,
    summary_cn: `共 ${counts.total_count} 个候选：${counts.accepted_count} 个可接受，${counts.candidate_count} 个候选，${counts.rejected_count} 个已拒收，${counts.draft_count} 个草稿；${counts.write_request_count} 个写入申请草案，0 个真实写入。`,
    write_request_items: writeRequestItems,
    next_attention_items: nextAttentionItems,
    blocked_items: blockedItems,
    preflight,
    handoff_report_cn: reportLines.join("\n"),
    boundary_cn: "当前只生成批量评审交接草案，没有调用插件、API、DailyNote，也没有写入 VCP memory。",
    no_execution_guard: noExecutionGuard
  };
}

function buildRiskReviewSummary(queueDraft) {
  const countsByTag = {};
  const groupedItems = [];
  for (const definition of riskTagDefinitions) {
    const items = queueDraft
      .filter((item) => normalizeRiskTags(item.risk_tags).includes(definition.id))
      .map((item) => ({
        queue_id: item.queue_id,
        title_cn: item.title_cn,
        asset_status: item.asset_status,
        reason_cn: definition.reason_cn
      }));
    countsByTag[definition.id] = items.length;
    if (items.length > 0) {
      groupedItems.push({
        tag: definition.id,
        tag_cn: definition.label_cn,
        high_risk: definition.high_risk,
        count: items.length,
        items
      });
    }
  }
  const blockedByRiskItems = queueDraft
    .filter(itemHasBlockingRisk)
    .map((item) => ({
      queue_id: item.queue_id,
      title_cn: item.title_cn,
      risk_tags: normalizeRiskTags(item.risk_tags),
      risk_tags_cn: normalizeRiskTags(item.risk_tags).map(riskTagLabel),
      reason_cn: riskSummaryForItem(item).reason_cn
    }));
  const reportLines = [
    `风险候选：${blockedByRiskItems.length} 个。`,
    `风险分组：${groupedItems.length > 0 ? groupedItems.map((group) => `${group.tag_cn} ${group.count} 个`).join("；") : "暂无"}`,
    "规则：带高风险标签的候选不能进入可授权列表，必须先人工复查或移除风险标签。",
    "边界：风险标签只影响本地草案，不调用插件、API、DailyNote，也不写 VCP memory。"
  ];
  return {
    status: blockedByRiskItems.length > 0 ? "risk_review_required" : "clear",
    status_cn: blockedByRiskItems.length > 0 ? "存在风险候选，需要人工复查" : "未发现风险标签阻塞",
    total_risk_item_count: blockedByRiskItems.length,
    counts_by_tag: countsByTag,
    grouped_items: groupedItems,
    blocked_by_risk_items: blockedByRiskItems,
    report_cn: reportLines.join("\n"),
    boundary_cn: "当前只是本地风险复核草案，没有外部副作用。",
    no_execution_guard: runtimeGuard.clone(runtimeGuard.cleanGuard)
  };
}

function buildBatchDecisionDraft(queueDraft, batchSummary) {
  const authorizableItems = queueDraft.filter(itemHasWriteRequest).map((item) => ({
    queue_id: item.queue_id,
    version_id: item.version_id,
    title_cn: item.title_cn,
    score: item.score,
    human_note_cn: item.human_note_cn || "",
    risk_tags_cn: normalizeRiskTags(item.risk_tags).map(riskTagLabel),
    status_cn: item.candidate_review_state?.status_cn || candidateReviewState(item).status_cn,
    reason_cn: item.candidate_review_state?.reason_cn || candidateReviewState(item).reason_cn
  }));
  const approvalChainProblemCount =
    batchSummary.preflight.accepted_without_human_approval_count +
    batchSummary.preflight.write_request_without_memory_approval_count;
  const boundaryBlocked =
    batchSummary.preflight.no_real_write !== true ||
    batchSummary.preflight.no_execution_guard_clean !== true ||
    approvalChainProblemCount > 0;
  let decision = "needs_local_review";
  let decisionCn = "需要继续本地评审";
  let reasonCn = "当前还没有足够候选进入授权前人工复核。";

  if (boundaryBlocked) {
    decision = "blocked";
    decisionCn = "阻塞，不能进入 A5 授权前复核";
    reasonCn = "批量预检发现审批链或安全边界问题。";
  } else if (authorizableItems.length > 0 && batchSummary.blocked_items.length > 0) {
    decision = "partial_authorizable";
    decisionCn = "部分候选可进入 A5 授权前复核";
    reasonCn = "已有候选形成写入申请草案，但队列中仍存在阻塞项。";
  } else if (authorizableItems.length > 0) {
    decision = "ready_for_preauthorization_review";
    decisionCn = "可进入 A5 授权前人工复核";
    reasonCn = "所有可授权候选均通过本地草案预检。";
  } else if (batchSummary.next_attention_items.length === 0) {
    decision = "no_authorizable_items";
    decisionCn = "暂无可授权候选";
    reasonCn = "队列没有写入申请草案，也没有待处理候选。";
  }

  return {
    status: "draft_only",
    decision,
    decision_cn: decisionCn,
    reason_cn: reasonCn,
    authorizable_count: authorizableItems.length,
    blocked_count: batchSummary.blocked_items.length,
    next_attention_count: batchSummary.next_attention_items.length,
    approval_chain_problem_count: approvalChainProblemCount,
    authorizable_items: authorizableItems,
    blocked_items: batchSummary.blocked_items,
    next_attention_items: batchSummary.next_attention_items,
    preflight: batchSummary.preflight,
    boundary_cn: "当前只是本地批量决策草案，不构成 A5 授权，也不会触发插件、API、DailyNote 或 VCP memory 写入。",
    no_execution_guard: runtimeGuard.clone(runtimeGuard.cleanGuard)
  };
}

function buildA5PreauthorizationReviewPackage(batchDecision, batchSummary, riskSummary) {
  const forbiddenOperations = [
    "调用插件",
    "调用 API",
    "写入 DailyNote",
    "写入 VCP memory",
    "创建或保存图片",
    "读取真实 VCPChat / VCPToolBox",
    "push / tag / release / PR"
  ];
  const authorizableText =
    batchDecision.authorizable_items.length > 0
      ? batchDecision.authorizable_items
          .map((item) => `${item.title_cn}：${item.status_cn}，${item.human_note_cn || item.reason_cn}`)
          .join("\n")
      : "暂无可进入授权前复核的候选。";
  const blockedText =
    batchDecision.blocked_items.length > 0
      ? batchDecision.blocked_items.map((item) => `${item.title_cn}：${item.reason_cn}`).join("\n")
      : "暂无阻塞项。";
  const nextText =
    batchDecision.next_attention_items.length > 0
      ? batchDecision.next_attention_items.map((item) => `${item.title_cn}：${item.reason_cn}`).join("\n")
      : "暂无待处理项。";
  const riskText =
    riskSummary.grouped_items.length > 0
      ? riskSummary.grouped_items
          .map((group) => `${group.tag_cn}：${group.items.map((item) => item.title_cn).join("、")}`)
          .join("\n")
      : "暂无风险分组。";
  const reviewText = [
    "A5 授权前人工复核包草案",
    `批量结论：${batchDecision.decision_cn}`,
    `结论原因：${batchDecision.reason_cn}`,
    `可授权候选：\n${authorizableText}`,
    `阻塞项：\n${blockedText}`,
    `待处理项：\n${nextText}`,
    `风险分组：\n${riskText}`,
    `预检结论：${batchSummary.preflight.result_cn}`,
    "人工需要确认：是否允许另行发起 A5 授权包；本草案本身不构成授权。",
    `禁止动作：${forbiddenOperations.join("、")}。`,
    batchDecision.boundary_cn
  ].join("\n\n");

  return {
    package_status: "draft_only",
    package_status_cn: "仅授权前人工复核草案",
    target_stage: "a5_preauthorization_human_review",
    target_stage_cn: "A5 授权前人工复核",
    batch_decision: {
      decision: batchDecision.decision,
      decision_cn: batchDecision.decision_cn,
      reason_cn: batchDecision.reason_cn
    },
    authorizable_items: batchDecision.authorizable_items,
    blocked_items: batchDecision.blocked_items,
    next_attention_items: batchDecision.next_attention_items,
    risk_grouped_items: riskSummary.grouped_items,
    required_human_action_cn: [
      "人工复核可授权候选是否确实可以进入下一份 A5 授权包。",
      "人工确认阻塞项是否需要先修正或排除。",
      "如需真实执行，必须另行给出完整 A5 授权包。"
    ],
    forbidden_operations_cn: forbiddenOperations,
    preflight: batchSummary.preflight,
    review_text_cn: reviewText,
    boundary_cn: "这只是本地草案，不读取真实 VCP，不调用插件，不写 DailyNote，不写 VCP memory，也不创建图片。",
    no_execution_guard: runtimeGuard.clone(runtimeGuard.cleanGuard)
  };
}

function buildHumanInspectionChecklistDraft(queueDraft, batchSummary, batchDecision, riskSummary) {
  const checklistItems = [
    {
      state: batchSummary.preflight.no_real_write ? "ok" : "warn",
      text_cn: "未发生真实写入"
    },
    {
      state: batchSummary.preflight.no_execution_guard_clean ? "ok" : "warn",
      text_cn: "no-execution guard 干净"
    },
    {
      state: batchDecision.authorizable_count > 0 ? "ok" : "warn",
      text_cn: `可授权候选：${batchDecision.authorizable_count} 个`
    },
    {
      state: batchDecision.blocked_count === 0 ? "ok" : "warn",
      text_cn: `阻塞项：${batchDecision.blocked_count} 个`
    },
    {
      state: riskSummary.total_risk_item_count === 0 ? "ok" : "warn",
      text_cn: `风险候选：${riskSummary.total_risk_item_count} 个`
    }
  ];
  const verdictCn =
    riskSummary.total_risk_item_count > 0 || batchDecision.blocked_count > 0
      ? "本批可局部推进，但需要先处理阻塞和风险候选。"
      : batchDecision.authorizable_count > 0
        ? "本批可进入授权前人工复核。"
        : "本批还没有可进入授权前复核的候选。";
  const reportLines = [
    `验货结论：${verdictCn}`,
    `候选总数：${queueDraft.length}`,
    `可授权候选：${batchDecision.authorizable_count} 个`,
    `阻塞项：${batchDecision.blocked_count} 个`,
    `风险候选：${riskSummary.total_risk_item_count} 个`,
    `下一步：${batchDecision.reason_cn}`,
    "边界：这份清单只是中文验货草案，不构成 A5 授权。"
  ];
  return {
    status: "draft_only",
    verdict_cn: verdictCn,
    checklist_items: checklistItems,
    risk_summary: riskSummary,
    report_cn: reportLines.join("\n"),
    boundary_cn: "当前只是本地中文验货清单草案，没有真实写入或外部调用。",
    no_execution_guard: runtimeGuard.clone(runtimeGuard.cleanGuard)
  };
}

function buildRuntimeSessionExportDraft({
  createdAt,
  reviewQueueDraft,
  batchReviewSummaryDraft,
  batchDecisionDraft,
  riskReviewSummaryDraft,
  a5PreauthorizationReviewPackageDraft,
  humanInspectionChecklistDraft
}) {
  const exportDraft = {
    package_status: "draft_only",
    export_format: "runtime_review_session_v1",
    exported_at: createdAt,
    session_id: session.session_id,
    task_id: session.task_id,
    case_id: session.case_id,
    review_session_snapshot: {
      selected_queue_id: selectedQueueId,
      queue_filter: els.queueFilter.value || "all",
      queue_search: els.queueSearch.value || "",
      queue_sort: els.queueSort.value || "default",
      selected_batch_queue_ids: Array.from(selectedBatchQueueIds),
      review_queue: reviewQueueDraft
    },
    batch_review_summary_draft: batchReviewSummaryDraft,
    batch_decision_draft: batchDecisionDraft,
    risk_review_summary_draft: riskReviewSummaryDraft,
    a5_preauthorization_review_package_draft: a5PreauthorizationReviewPackageDraft,
    human_inspection_checklist_draft: humanInspectionChecklistDraft,
    prototype_guard: runtimeGuard.clone(runtimeGuard.cleanGuard),
    side_effects_performed: false,
    boundary_cn: "这是 Review Console runtime 本地会话导出草案，不写磁盘，不调用插件/API/DailyNote，不写 VCP memory。"
  };
  exportDraft.session_fingerprint = fingerprintString(sessionPayloadForFingerprint(exportDraft));
  exportDraft.session_fingerprint_cn = `会话指纹：${exportDraft.session_fingerprint}`;
  return exportDraft;
}

function validateSessionImportPayload(payload) {
  const errors = [];
  if (!payload || typeof payload !== "object") {
    errors.push("导入内容必须是 JSON 对象。");
  } else {
    if (payload.package_status !== "draft_only") errors.push("只允许导入 draft_only 会话草案。");
    if (payload.export_format !== "runtime_review_session_v1") errors.push("导入格式必须是 runtime_review_session_v1。");
    const expectedFingerprint = fingerprintString(sessionPayloadForFingerprint(payload));
    if (payload.session_fingerprint !== expectedFingerprint) {
      errors.push("会话指纹不匹配。");
    }
    if (payload.side_effects_performed !== false) errors.push("导入草案必须声明 side_effects_performed=false。");
    if (!runtimeGuard.guardIsClean(payload.prototype_guard)) errors.push("prototype_guard 不干净。");
    if (!runtimeGuard.guardIsClean(payload.batch_decision_draft?.no_execution_guard)) {
      errors.push("batch_decision_draft guard 不干净。");
    }
    if (!runtimeGuard.guardIsClean(payload.a5_preauthorization_review_package_draft?.no_execution_guard)) {
      errors.push("A5 授权前复核包 guard 不干净。");
    }
    if (!Array.isArray(payload.review_session_snapshot?.review_queue) || payload.review_session_snapshot.review_queue.length === 0) {
      errors.push("缺少 review_queue。");
    }
    if (
      payload.plugin_called === true ||
      payload.api_called === true ||
      payload.daily_note_called === true ||
      payload.vcp_memory_written === true ||
      payload.image_created === true
    ) {
      errors.push("导入草案包含真实执行标记。");
    }
  }
  const queueCount = Array.isArray(payload?.review_session_snapshot?.review_queue)
    ? payload.review_session_snapshot.review_queue.length
    : 0;
  return {
    passed: errors.length === 0,
    errors,
    queue_count: queueCount,
    status_cn: errors.length === 0 ? `导入草案校验通过，包含 ${queueCount} 个候选。` : `导入草案校验失败：${errors.join("；")}`
  };
}

function buildSessionImportPreview(payload) {
  const validation = validateSessionImportPayload(payload);
  if (!validation.passed) {
    return {
      passed: false,
      status_cn: "导入预览不可用：草案校验失败。",
      changed_items: [],
      errors: validation.errors
    };
  }
  const incomingQueue = normalizeQueueItems(payload.review_session_snapshot.review_queue);
  const changedItems = [];
  for (const incomingItem of incomingQueue) {
    const currentItem = queueState.find((item) => item.queue_id === incomingItem.queue_id);
    if (!currentItem) {
      changedItems.push({
        queue_id: incomingItem.queue_id,
        title_cn: incomingItem.title_cn,
        changes_cn: ["新增候选"]
      });
      continue;
    }
    const changes = [];
    if (currentItem.human_note_cn !== incomingItem.human_note_cn) changes.push("评论");
    if (currentItem.score !== incomingItem.score) changes.push("评分");
    if (currentItem.asset_status !== incomingItem.asset_status) changes.push("资产状态");
    if (currentItem.memory_approval_status !== incomingItem.memory_approval_status) changes.push("记忆审批");
    if (normalizeRiskTags(currentItem.risk_tags).join("|") !== normalizeRiskTags(incomingItem.risk_tags).join("|")) {
      changes.push("风险标签");
    }
    if (changes.length > 0) {
      changedItems.push({
        queue_id: incomingItem.queue_id,
        title_cn: incomingItem.title_cn,
        changes_cn: changes
      });
    }
  }
  const removedItems = queueState
    .filter((item) => !incomingQueue.some((incomingItem) => incomingItem.queue_id === item.queue_id))
    .map((item) => ({
      queue_id: item.queue_id,
      title_cn: item.title_cn,
      changes_cn: ["导入后不再出现"]
    }));
  return {
    passed: true,
    status_cn: `导入预览：${changedItems.length + removedItems.length} 个候选会变化。`,
    changed_items: [...changedItems, ...removedItems],
    errors: []
  };
}

function exportCurrentSessionDraft() {
  syncActiveQueueItemFromForm();
  const draft = buildDraft();
  els.sessionTransferText.value = JSON.stringify(draft.runtime_session_export_draft, null, 2);
  sessionImportPreviewState = buildSessionImportPreview(draft.runtime_session_export_draft);
  sessionTransferStatusText = `已导出本地复核会话草案，包含 ${draft.runtime_session_export_draft.review_session_snapshot.review_queue.length} 个候选。`;
  renderSessionTransfer(draft.runtime_session_export_draft);
}

function parseSessionTransferText() {
  try {
    return {
      payload: JSON.parse(els.sessionTransferText.value || "{}"),
      parse_error: null
    };
  } catch (error) {
    return {
      payload: null,
      parse_error: error.message
    };
  }
}

function validateSessionTransferText() {
  const parsed = parseSessionTransferText();
  if (parsed.parse_error) {
    sessionTransferStatusText = `导入草案校验失败：JSON 无法解析。${parsed.parse_error}`;
    renderSessionTransfer(null);
    return { passed: false, errors: [parsed.parse_error] };
  }
  const validation = validateSessionImportPayload(parsed.payload);
  sessionImportPreviewState = buildSessionImportPreview(parsed.payload);
  sessionTransferStatusText = validation.status_cn;
  renderSessionTransfer(parsed.payload);
  return validation;
}

function applySessionImportDraft() {
  const parsed = parseSessionTransferText();
  if (parsed.parse_error) {
    sessionTransferStatusText = `导入失败：JSON 无法解析。${parsed.parse_error}`;
    render();
    return;
  }
  const validation = validateSessionImportPayload(parsed.payload);
  if (!validation.passed) {
    sessionTransferStatusText = validation.status_cn;
    render();
    return;
  }
  pushHistorySnapshot("恢复导入会话草案");
  sessionImportPreviewState = buildSessionImportPreview(parsed.payload);
  const snapshot = parsed.payload.review_session_snapshot;
  queueState = normalizeQueueItems(snapshot.review_queue);
  selectedBatchQueueIds = new Set(
    (snapshot.selected_batch_queue_ids || []).filter((queueId) => queueState.some((item) => item.queue_id === queueId))
  );
  selectedQueueId = queueState.some((item) => item.queue_id === snapshot.selected_queue_id)
    ? snapshot.selected_queue_id
    : queueState[0].queue_id;
  els.queueFilter.value = snapshot.queue_filter || "all";
  els.queueSearch.value = snapshot.queue_search || "";
  els.queueSort.value = snapshot.queue_sort || "default";
  loadQueueItemIntoForm(activeQueueItem());
  sessionTransferStatusText = `已恢复本地复核会话：${validation.queue_count} 个候选，未执行任何外部动作。`;
  render();
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
  pushHistorySnapshot(`快捷结论：${decision}`);
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
  pushHistorySnapshot(`套用模板：${templateId}`);
  if (templateId === "composition") {
    appendTextareaText(els.diffStrengths, "构图稳定，主体关系清楚。");
    appendTextareaText(els.annotationNote, "构图稳定，可作为候选优势记录。");
  } else if (templateId === "detail_noise") {
    appendTextareaText(els.diffIssues, "细节噪点需要人工复核。");
    appendTextareaText(els.annotationNote, "局部细节仍有噪点风险。");
  } else if (templateId === "text_artifact") {
    appendTextareaText(els.diffIssues, "存在疑似文字伪影，需要谨慎处理。");
    appendTextareaText(els.humanComment, "注意：疑似文字伪影不能自动忽略。");
    els.riskTextArtifact.checked = true;
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
  const riskReviewSummaryDraft = buildRiskReviewSummary(reviewQueueDraft);
  const batchDecisionDraft = buildBatchDecisionDraft(reviewQueueDraft, batchReviewSummaryDraft);
  const a5PreauthorizationReviewPackageDraft = buildA5PreauthorizationReviewPackage(
    batchDecisionDraft,
    batchReviewSummaryDraft,
    riskReviewSummaryDraft
  );
  const humanInspectionChecklistDraft = buildHumanInspectionChecklistDraft(
    reviewQueueDraft,
    batchReviewSummaryDraft,
    batchDecisionDraft,
    riskReviewSummaryDraft
  );
  const runtimeSessionExportDraft = buildRuntimeSessionExportDraft({
    createdAt,
    reviewQueueDraft,
    batchReviewSummaryDraft,
    batchDecisionDraft,
    riskReviewSummaryDraft,
    a5PreauthorizationReviewPackageDraft,
    humanInspectionChecklistDraft
  });

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
    batch_decision_draft: batchDecisionDraft,
    risk_review_summary_draft: riskReviewSummaryDraft,
    a5_preauthorization_review_package_draft: a5PreauthorizationReviewPackageDraft,
    human_inspection_checklist_draft: humanInspectionChecklistDraft,
    runtime_session_export_draft: runtimeSessionExportDraft,
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

function renderStateList(el, items) {
  el.innerHTML = "";
  for (const item of items) {
    const listItem = document.createElement("li");
    listItem.dataset.state = item.state;
    listItem.textContent = item.text_cn;
    el.appendChild(listItem);
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
    button.dataset.writeRequest = String(itemHasWriteRequest(item));
    button.dataset.blocked = String(itemIsBlocked(item));
    button.dataset.nextAttention = String(itemNeedsAttention(item));
    button.dataset.batchSelected = String(selectedBatchQueueIds.has(item.queue_id));
    button.dataset.riskBlocked = String(itemHasBlockingRisk(item));
    const reviewState = item.candidate_review_state || candidateReviewState(item);
    const selectedText = selectedBatchQueueIds.has(item.queue_id) ? "已批量选择 · " : "";
    button.textContent = `${item.title_cn}\n${selectedText}${reviewState.status_cn} · ${assetStatusLabel(item.asset_status)} · ${item.score} 分 · ${riskTagsLabel(item.risk_tags)}\n${queueBadgeText(item)} · ${statusExplanationCn(reviewState.status)}\n${item.issues_cn}`;
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
    els.batchWriteItems,
    batchSummary.write_request_items.length > 0
      ? batchSummary.write_request_items.map((item) => `${item.title_cn}：${item.reason_cn}`)
      : ["暂无可进入后续授权的写入申请草案。"]
  );
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
  renderStateList(els.batchPreflightItems, [
    {
      state: batchSummary.preflight.no_real_write ? "ok" : "warn",
      text_cn: batchSummary.preflight.no_real_write ? "没有真实写入" : "检测到真实写入风险"
    },
    {
      state: batchSummary.preflight.no_execution_guard_clean ? "ok" : "warn",
      text_cn: batchSummary.preflight.no_execution_guard_clean ? "no-execution guard 干净" : "no-execution guard 存在风险"
    },
    {
      state: batchSummary.preflight.accepted_without_human_approval_count === 0 ? "ok" : "warn",
      text_cn: `可接受但缺少人工确认：${batchSummary.preflight.accepted_without_human_approval_count} 个`
    },
    {
      state: batchSummary.preflight.write_request_without_memory_approval_count === 0 ? "ok" : "warn",
      text_cn: `写入申请缺少记忆审批：${batchSummary.preflight.write_request_without_memory_approval_count} 个`
    },
    {
      state: batchSummary.preflight.blocked_count === 0 ? "ok" : "warn",
      text_cn: `阻塞项：${batchSummary.preflight.blocked_count} 个`
    }
  ]);
  els.batchReport.textContent = batchSummary.handoff_report_cn;
}

function renderPreauthorizationPackage(batchDecision, preauthPackage) {
  els.batchDecisionStatus.textContent = batchDecision.decision_cn;
  els.batchDecisionReason.textContent = `${batchDecision.reason_cn} ${batchDecision.boundary_cn}`;
  els.preauthPackageStatus.textContent = preauthPackage.package_status_cn;
  renderList(
    els.preauthPackageItems,
    preauthPackage.authorizable_items.length > 0
      ? preauthPackage.authorizable_items.map((item) => `${item.title_cn}：${item.status_cn}`)
      : ["暂无可授权候选。"]
  );
  renderList(els.preauthPackageForbidden, preauthPackage.forbidden_operations_cn);
  els.preauthPackageText.textContent = preauthPackage.review_text_cn;
}

function renderSessionTransfer(sessionExportDraft) {
  els.sessionTransferStatus.textContent = sessionTransferStatusText;
  if (!sessionExportDraft) {
    els.sessionTransferCount.textContent = "-";
    els.sessionTransferGuard.textContent = "-";
    els.sessionFingerprint.textContent = "-";
    els.importPreviewStatus.textContent = sessionImportPreviewState?.status_cn || "尚未生成导入预览。";
    renderList(els.importPreviewItems, sessionImportPreviewState?.errors?.length ? sessionImportPreviewState.errors : ["暂无导入预览。"]);
    return;
  }
  const queueCount = sessionExportDraft.review_session_snapshot?.review_queue?.length || 0;
  els.sessionTransferCount.textContent = `${queueCount} 个候选`;
  els.sessionTransferGuard.textContent = runtimeGuard.guardIsClean(sessionExportDraft.prototype_guard)
    ? "导出 guard 干净"
    : "导出 guard 存在风险";
  els.sessionFingerprint.textContent = sessionExportDraft.session_fingerprint || "-";
  els.importPreviewStatus.textContent = sessionImportPreviewState?.status_cn || "尚未生成导入预览。";
  const previewItems = sessionImportPreviewState?.changed_items || [];
  renderList(
    els.importPreviewItems,
    previewItems.length > 0
      ? previewItems.map((item) => `${item.title_cn}：${item.changes_cn.join("、")}`)
      : sessionImportPreviewState?.errors?.length
        ? sessionImportPreviewState.errors
        : ["暂无候选变化。"]
  );
}

function renderInspectionSummary(inspectionDraft) {
  els.inspectionVerdict.textContent = inspectionDraft.verdict_cn;
  renderStateList(els.inspectionChecklist, inspectionDraft.checklist_items);
  els.inspectionRiskStats.textContent = inspectionDraft.risk_summary.report_cn;
  renderList(
    els.inspectionRiskGroups,
    inspectionDraft.risk_summary.grouped_items.length > 0
      ? inspectionDraft.risk_summary.grouped_items.map((group) => `${group.tag_cn}：${group.count} 个`)
      : ["暂无风险分组。"]
  );
  els.inspectionReport.textContent = inspectionDraft.report_cn;
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
  const batchDecisionDraft = draft.batch_decision_draft;
  const preauthPackageDraft = draft.a5_preauthorization_review_package_draft;
  const inspectionDraft = draft.human_inspection_checklist_draft;
  const sessionExportDraft = draft.runtime_session_export_draft;
  queueState = normalizeQueueItems(reviewDraft.review_queue);
  renderQueueList(reviewDraft.review_queue);
  renderBatchSummary(batchSummaryDraft);
  renderPreauthorizationPackage(batchDecisionDraft, preauthPackageDraft);
  renderInspectionSummary(inspectionDraft);
  renderSessionTransfer(sessionExportDraft);
  els.batchSelectedCount.textContent = `${selectedBatchQueueIds.size} 个`;
  els.batchOperationStatus.textContent = batchOperationStatusText;
  els.historyStatus.textContent = historyStatusText;
  els.historyCount.textContent = `${historyStack.length} 步`;
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
  renderList(
    els.statusGlossaryList,
    statusGlossary.map((item) => `${item.label_cn}（${item.key}）：${item.explanation_cn}`)
  );
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
  lastRenderedSnapshot = captureRuntimeSnapshot();
}

function init() {
  loadQueueItemIntoForm(activeQueueItem());
  const version = currentVersion();
  els.taskId.textContent = session.task_id;
  els.caseId.textContent = session.case_id;
  els.assetRef.textContent = version.asset_ref;
  els.assetBox.textContent = version.label;
  [els.versionPicker, els.comparePicker, els.diffStrengths, els.diffIssues, els.diffNext, els.humanScore, els.humanComment, els.annotationNote, els.assetStatus, els.humanApproved, els.memoryContent, els.memoryApproval, els.riskTextArtifact, els.riskPersonFace, els.riskCompositionShift, els.riskBrandMark, els.riskMemoryUnsuitable].forEach((el) => {
    el.addEventListener("input", () => trackedRender("编辑评审字段"));
    el.addEventListener("change", () => trackedRender("编辑评审字段"));
  });
  [els.queueFilter, els.queueSearch, els.queueSort].forEach((el) => {
    el.addEventListener("input", () => trackedRender("调整队列检索排序"));
    el.addEventListener("change", () => trackedRender("调整队列检索排序"));
  });
  els.quickCandidate.addEventListener("click", () => applyQuickDecision("candidate"));
  els.quickAccept.addEventListener("click", () => applyQuickDecision("accept"));
  els.quickReject.addEventListener("click", () => applyQuickDecision("reject"));
  els.queuePrev.addEventListener("click", () => selectAdjacentQueueItem(-1));
  els.queueNext.addEventListener("click", () => selectAdjacentQueueItem(1));
  els.batchShowAuthorizable.addEventListener("click", () => applyQueueFilter("write_request"));
  els.batchShowBlocked.addEventListener("click", () => applyQueueFilter("blocked"));
  els.batchShowNext.addEventListener("click", () => applyQueueFilter("next_attention"));
  els.batchSelectVisible.addEventListener("click", selectVisibleQueueItemsForBatch);
  els.batchClearSelection.addEventListener("click", clearBatchSelection);
  els.batchMarkReview.addEventListener("click", () => applyBatchReviewAction("review"));
  els.batchMarkBlocked.addEventListener("click", () => applyBatchReviewAction("blocked"));
  els.batchMarkNoMemory.addEventListener("click", () => applyBatchReviewAction("no_memory"));
  els.undoLastAction.addEventListener("click", undoLastHistoryAction);
  els.exportSessionDraft.addEventListener("click", exportCurrentSessionDraft);
  els.validateImportDraft.addEventListener("click", validateSessionTransferText);
  els.applyImportDraft.addEventListener("click", applySessionImportDraft);
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
