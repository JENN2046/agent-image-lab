const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const runtimeRoot = path.join(root, "review_console", "runtime_prototype");

class FakeElement {
  constructor(id, initial = {}) {
    this.id = id;
    this.textContent = initial.textContent || "";
    this.value = initial.value || "";
    this.checked = Boolean(initial.checked);
    this.dataset = {};
    this.children = [];
    this._innerHTML = "";
    this.listeners = new Map();
  }

  set innerHTML(value) {
    this._innerHTML = String(value);
    if (value === "") {
      this.children = [];
      this.textContent = "";
    }
  }

  get innerHTML() {
    return this._innerHTML;
  }

  appendChild(child) {
    this.children.push(child);
    this.textContent = this.children.map((item) => item.textContent).join("\n");
    return child;
  }

  addEventListener(type, listener) {
    const listeners = this.listeners.get(type) || [];
    listeners.push(listener);
    this.listeners.set(type, listeners);
  }

  dispatchEvent(event) {
    const listeners = this.listeners.get(event.type) || [];
    for (const listener of listeners) {
      listener.call(this, event);
    }
  }
}

function createRuntimeContext() {
  const elements = new Map();
  const add = (id, initial) => {
    const element = new FakeElement(id, initial);
    elements.set(id, element);
    return element;
  };

  add("taskId");
  add("caseId");
  add("assetRef");
  add("assetBox");
  add("boundaryBanner");
  add("versionPicker", { value: "v2" });
  add("comparePicker", { value: "v1" });
  add("comparisonSummary");
  add("queueFilter", { value: "all" });
  add("queueSearch", { value: "" });
  add("queueSort", { value: "default" });
  add("queueTotal");
  add("queueVisible");
  add("queueProgress");
  add("queueSelected");
  add("queuePrev");
  add("queueNext");
  add("batchShowAuthorizable");
  add("batchShowBlocked");
  add("batchShowNext");
  add("batchSelectVisible");
  add("batchClearSelection");
  add("batchMarkReview");
  add("batchMarkBlocked");
  add("batchMarkNoMemory");
  add("batchSelectedCount");
  add("batchOperationStatus");
  add("undoLastAction");
  add("historyStatus");
  add("historyCount");
  add("queueList");
  add("batchTotal");
  add("batchAccepted");
  add("batchPending");
  add("batchWriteRequests");
  add("batchBlocked");
  add("batchSummary");
  add("batchWriteItems");
  add("batchNextItems");
  add("batchBlockedItems");
  add("batchPreflightItems");
  add("batchReport");
  add("batchDecisionStatus");
  add("batchDecisionReason");
  add("preauthPackageStatus");
  add("preauthPackageItems");
  add("preauthPackageForbidden");
  add("preauthPackageText");
  add("authCapsuleStatus");
  add("authCapsuleCount");
  add("authCapsuleBoundary");
  add("authCapsuleTypes");
  add("authCapsuleForbidden");
  add("authCapsuleSanitization");
  add("authCapsuleRollback");
  add("authCapsuleText");
  add("deliveryPackageStatus");
  add("deliveryPackageCandidate");
  add("deliveryPackageHash");
  add("deliveryPackageScoreBand");
  add("deliveryPackageRisk");
  add("deliveryPackageHumanApproval");
  add("deliveryPackageMemoryPreview");
  add("deliveryPackageRules");
  add("deliveryPackageBoundary");
  add("overrideDecisionSource");
  add("overrideReason");
  add("overrideDeviation");
  add("overridePromptCompliance");
  add("overrideMemorySuitability");
  add("overrideBoundary");
  add("traceabilityTotal");
  add("traceabilityAccepted");
  add("traceabilityAcceptedCandidate");
  add("traceabilityHumanOverride");
  add("traceabilityRejected");
  add("traceabilityNeedsHumanReview");
  add("traceabilityPromptComplete");
  add("traceabilityMemorySuitable");
  add("traceabilitySummary");
  add("traceabilityBoundary");
  add("traceabilityList");
  add("sessionTransferStatus");
  add("sessionTransferCount");
  add("sessionTransferGuard");
  add("sessionFingerprint");
  add("sessionTransferText");
  add("importPreviewStatus");
  add("importPreviewItems");
  add("exportSessionDraft");
  add("validateImportDraft");
  add("applyImportDraft");
  add("diffStrengths", { value: "主体构图更稳定，整体可读性更好。" });
  add("diffIssues", { value: "细节噪点仍需保留人工判断。" });
  add("diffNext", { value: "若进入正式归档，需要确认记忆写入申请。" });
  add("humanScore", { value: "84" });
  add("humanScoreOut", { textContent: "84" });
  add("humanComment", { value: "人工评审确认该版本可作为候选，但仍需保留已知视觉偏差说明。" });
  add("annotationNote", { value: "对比参考版本后，当前版本的主体构图更稳定，仍需留意细节噪点。" });
  add("tplComposition");
  add("tplDetailNoise");
  add("tplTextArtifact");
  add("tplNeedsRetry");
  add("tplCandidateNoMemory");
  add("riskTextArtifact");
  add("riskPersonFace");
  add("riskCompositionShift");
  add("riskBrandMark");
  add("riskMemoryUnsuitable");
  add("assetStatus", { value: "candidate" });
  add("quickCandidate");
  add("quickAccept");
  add("quickReject");
  add("humanApproved", { checked: false });
  add("memoryContent", { value: "本次评审保留 Photo Studio OS 真实闭环经验：资产可作为项目推进候选，但必须记录人工覆盖接受和已知视觉偏差。" });
  add("memoryApproval", { value: "pending" });
  add("memoryPreviewTitle");
  add("memoryPreviewTarget");
  add("memoryPreviewDecision");
  add("memoryPreviewBody");
  add("memoryCompletionRequested");
  add("memoryCompletionAuthorized");
  add("memoryCompletionPerformed");
  add("memoryCompletionLocationVerified");
  add("memoryCompletionHashMatched");
  add("memoryCompletionPluginSufficient");
  add("memoryCompletionBoundary");
  add("hostStatus", { textContent: "等待中" });
  add("hostSubmittedAt", { textContent: "-" });
  add("verdictTitle");
  add("verdictReasons");
  add("summarySessionStatus");
  add("summaryAssetStatus");
  add("summaryScoreBand");
  add("summaryMemoryStatus");
  add("summaryWriteRequest");
  add("summaryGuard");
  add("summaryNextAction");
  add("runtimeStateUnified");
  add("runtimeStateAsset");
  add("runtimeStateMemory");
  add("runtimeStateDelivery");
  add("runtimeStateOverride");
  add("runtimeStateMismatches");
  add("runtimeStateBoundary");
  add("inspectionVerdict");
  add("inspectionChecklist");
  add("inspectionRiskStats");
  add("inspectionRiskGroups");
  add("inspectionReport");
  add("statusGlossaryList");
  add("checkHumanComment");
  add("checkMemoryContent");
  add("checkHumanDecision");
  add("checkGuard");
  add("checkWriteBoundary");
  add("handoffStatus");
  add("handoffExecution");
  add("handoffPluginCalls");
  add("handoffSummary");
  add("handoffAllowed");
  add("handoffForbidden");
  add("viewReadable");
  add("viewTechnical");
  add("readableDraft");
  add("reviewCardStatus");
  add("reviewCardScore");
  add("reviewCardVerdict");
  add("reviewCardComment");
  add("assetCardStatus");
  add("assetCardVersion");
  add("assetCardNext");
  add("assetCardDiff");
  add("memoryCardTitle");
  add("memoryCardTarget");
  add("memoryCardDecision");
  add("memoryCardBody");
  add("memoryCardBoundary");
  add("commitScopeStatus");
  add("commitScopeBranch");
  add("commitScopeStaged");
  add("commitScopeRemote");
  add("commitScopeRuntime");
  add("commitScopeValidators");
  add("commitScopeDocs");
  add("commitScopeAgentBoard");
  add("commitScopeUntracked");
  add("commitScopeRollback");
  add("bridgeRoundtripStatus");
  add("bridgeRoundtripMethods");
  add("bridgeRoundtripCalls");
  add("bridgeRoundtripAck");
  add("bridgeRoundtripGuards");
  add("bridgeRoundtripBoundary");
  add("realBridgeAuthStatus");
  add("realBridgeAuthMethods");
  add("realBridgeAuthRequired");
  add("realBridgeAuthForbidden");
  add("realBridgeAuthBoundary");
  add("promptReliabilityStatus");
  add("promptReliabilityHash");
  add("promptReliabilityRules");
  add("promptReliabilityFailures");
  add("promptReliabilityBoundary");
  add("memoryCompletionCandidateStatus");
  add("memoryCompletionCandidateCriteria");
  add("memoryCompletionCandidateObserved");
  add("memoryCompletionCandidateFailures");
  add("memoryCompletionCandidateBoundary");
  add("generationRetryGateStatus");
  add("generationRetryGatePlugin");
  add("generationRetryGatePrompt");
  add("generationRetryGateGuards");
  add("generationRetryGateAuthorization");
  add("generationRetryGateBoundary");
  add("memoryWriteAuthStatus");
  add("memoryWriteAuthCounts");
  add("memoryWriteAuthRules");
  add("memoryWriteAuthReject");
  add("memoryWriteAuthBoundary");
  add("assetArchiveCandidateStatus");
  add("assetArchiveCandidateFields");
  add("assetArchiveCandidateCloseouts");
  add("assetArchiveCandidateBoundary");
  add("draftOutput");

  const context = {
    window: {},
    document: {
      getElementById(id) {
        if (!elements.has(id)) {
          throw new Error(`Missing fake DOM element: ${id}`);
        }
        return elements.get(id);
      },
      createElement(tagName) {
        return new FakeElement(tagName);
      }
    },
    Event: class Event {
      constructor(type, init = {}) {
        this.type = type;
        this.bubbles = Boolean(init.bubbles);
      }
    },
    Date,
    Error,
    JSON,
    Object,
    Number,
    Boolean,
    Array,
    Map
  };

  context.window.window = context.window;
  context.window.document = context.document;
  context.window.Event = context.Event;
  return { context: vm.createContext(context), elements };
}

function runScript(context, fileName) {
  const source = fs.readFileSync(path.join(runtimeRoot, fileName), "utf8");
  vm.runInContext(source, context, { filename: fileName });
}

function readIndexScriptOrder() {
  const html = fs.readFileSync(path.join(runtimeRoot, "index.html"), "utf8");
  const scriptPattern = /<script\b[^>]*\bsrc=["']\.\/([^"']+)["'][^>]*><\/script>/gi;
  return Array.from(html.matchAll(scriptPattern), (match) => match[1]);
}

function assertExpectedScriptOrder(scriptOrder) {
  const expectedOrder = ["runtime_guard.js", "host_bridge_mock.js", "app.js"];
  assert(
    scriptOrder.length === expectedOrder.length &&
      expectedOrder.every((fileName, index) => scriptOrder[index] === fileName),
    `Runtime index.html script order must be ${expectedOrder.join(" -> ")}.`
  );
}

function assertRuntimeGuardApi(runtimeGuard) {
  const requiredMethods = [
    "clone",
    "normalizeSession",
    "guardIsClean",
    "guardsAreClean",
    "executionFlagsAreFalse",
    "inactiveAuthorizationCapsulesAreSafe",
    "runtimeReviewStateIsSafe",
    "localCommitScopePlanIsSafe",
    "bridgeMockRoundtripCandidateIsSafe",
    "realBridgeAuthorizationPackageIsSafe",
    "pluginReliabilityPromptDisciplineIsSafe",
    "memoryWriteCompletionCandidateIsSafe",
    "singleRealGenerationRetryGateIsSafe",
    "realMemoryWriteAuthorizationPackageIsSafe",
    "assetArchiveCandidateIsSafe",
    "draftSideSurfacesAreSafe",
    "draftIsSafe",
    "assertDraftSafe"
  ];
  assert(runtimeGuard && typeof runtimeGuard.cleanGuard === "object", "Runtime guard must expose cleanGuard.");
  for (const method of requiredMethods) {
    assert(typeof runtimeGuard[method] === "function", `Runtime guard must expose ${method}().`);
  }
}

function parseDraft(elements) {
  return JSON.parse(elements.get("draftOutput").textContent);
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function dispatchChange(elements, id) {
  elements.get(id).dispatchEvent({ type: "change" });
}

function dispatchClick(elements, id) {
  elements.get(id).dispatchEvent({ type: "click" });
}

function dispatchElementClick(element) {
  element.dispatchEvent({ type: "click" });
}

function main() {
  const { context, elements } = createRuntimeContext();
  const scriptOrder = readIndexScriptOrder();
  assertExpectedScriptOrder(scriptOrder);
  for (const fileName of scriptOrder) {
    runScript(context, fileName);
  }
  const runtimeGuard = context.window.ImageLabRuntimeGuard;
  assertRuntimeGuardApi(runtimeGuard);

  const initialDraft = parseDraft(elements);
  assert(elements.get("hostStatus").textContent.includes("previewDraft 安全预览"), "Initial host preview ack must be accepted.");
  assert(elements.get("hostSubmittedAt").textContent !== "-", "Initial host submit timestamp must be present.");
  assert(elements.get("boundaryBanner").textContent.includes("没有真实写入"), "Boundary banner must show no real write.");
  assert(elements.get("reviewCardStatus").textContent === "人工评审中", "Review card must show Chinese review status.");
  assert(elements.get("assetCardStatus").textContent === "候选", "Asset card must show Chinese asset status.");
  assert(elements.get("memoryCardDecision").textContent === "已形成写入申请，仍未真实写入", "Memory card must show write request state.");
  assert(elements.get("draftOutput").hidden === true, "Technical draft must be hidden by default.");
  assert(elements.get("handoffStatus").textContent === "仅草案交接", "Handoff status must render.");
  assert(elements.get("handoffExecution").textContent === "已阻止真实执行", "Handoff execution block must render.");
  assert(initialDraft.adapter_dry_run_handoff_draft.execution_blocked === true, "Adapter handoff draft must block execution.");
  assert(initialDraft.adapter_dry_run_handoff_draft.max_plugin_calls === 0, "Adapter handoff draft must allow zero plugin calls.");
  assert(initialDraft.adapter_dry_run_handoff_draft.forbidden_actions_cn.includes("调用插件"), "Adapter handoff must forbid plugin calls.");
  assert(initialDraft.image_case_draft.asset_status === "candidate", "Initial asset status must be candidate.");
  assert(elements.get("summarySessionStatus").textContent === "人工评审中", "Initial summary must show Chinese review status.");
  assert(elements.get("summaryAssetStatus").textContent === "候选", "Initial summary must show Chinese asset status.");
  assert(elements.get("summaryScoreBand").textContent === "可推进候选", "Initial summary must show score band.");
  assert(elements.get("verdictTitle").textContent === "可以作为候选继续评审", "Initial verdict must be candidate-friendly.");
  assert(initialDraft.review_session_draft.acceptance_verdict.status_cn === "可以作为候选继续评审", "Initial draft must include acceptance verdict.");
  assert(elements.get("summaryMemoryStatus").textContent === "待审批", "Initial summary must show Chinese memory status.");
  assert(elements.get("summaryWriteRequest").textContent === "已形成写入申请，仍未真实写入", "Initial summary must show write request state.");
  assert(elements.get("summaryGuard").textContent === "无外部副作用", "Initial summary must show clean guard.");
  assert(elements.get("summaryNextAction").textContent === "继续人工确认或补充标注", "Initial summary must show next action.");
  assert(initialDraft.review_session_draft.review_preflight.human_comment_present === true, "Initial preflight must record human comment presence.");
  assert(initialDraft.review_session_draft.review_preflight.chinese_memory_content_detected === true, "Initial preflight must detect Chinese memory content.");
  assert(initialDraft.review_session_draft.review_preflight.real_write_performed === false, "Initial preflight must record no real write.");
  assert(initialDraft.review_session_draft.version_comparison.strengths_cn.includes("主体构图"), "Version strengths must enter the draft.");
  assert(initialDraft.review_session_draft.version_comparison.issues_cn.includes("细节噪点"), "Version issues must enter the draft.");
  assert(initialDraft.review_session_draft.version_comparison.next_step_cn.includes("写入申请"), "Version next step must enter the draft.");
  assert(elements.get("memoryPreviewTitle").textContent.length > 0, "Memory preview title must render.");
  assert(elements.get("memoryPreviewDecision").textContent === "已形成写入申请，仍未真实写入", "Memory preview must show write request state initially.");
  assert(initialDraft.memory_completion_state_draft.write_requested === true, "Initial memory completion state must record write requested.");
  assert(initialDraft.memory_completion_state_draft.write_authorized === false, "Initial memory completion state must record no authorization.");
  assert(initialDraft.memory_completion_state_draft.write_performed === false, "Initial memory completion state must record no write performed.");
  assert(initialDraft.memory_completion_state_draft.canonical_location_verified === false, "Initial memory completion state must record no location verification.");
  assert(initialDraft.memory_completion_state_draft.canonical_hash_matched === false, "Initial memory completion state must record no hash match.");
  assert(initialDraft.memory_completion_state_draft.plugin_success_sufficient === false, "Initial memory completion state must record plugin success insufficiency.");
  assert(elements.get("memoryCompletionRequested").textContent === "已形成写入请求", "Initial memory completion requested state must render.");
  assert(elements.get("memoryCompletionAuthorized").textContent === "尚未获得写入授权", "Initial memory completion authorization must render.");
  assert(elements.get("memoryCompletionPerformed").textContent === "尚未真实写入", "Initial memory completion performed state must render.");
  assert(elements.get("memoryCompletionLocationVerified").textContent === "目标位置未验证", "Initial memory completion location state must render.");
  assert(elements.get("memoryCompletionHashMatched").textContent === "写入哈希未匹配", "Initial memory completion hash state must render.");
  assert(
    elements.get("memoryCompletionPluginSufficient").textContent === "false（插件 success 不足以代表完成）",
    "Initial memory completion plugin sufficiency must render."
  );
  assert(
    elements.get("memoryCompletionBoundary").textContent === "当前只拆分写入请求、授权、执行与校验，不执行真实写入。",
    "Initial memory completion boundary must render."
  );
  assert(
    elements.get("deliveryPackageMemoryPreview").textContent.includes("已形成写入申请"),
    "Delivery package memory preview must show write request state."
  );
  assert(
    initialDraft.accepted_candidate_delivery_package_draft.memory_delta_preview.completion_state.write_requested === true,
    "Delivery package memory preview must include the completion state."
  );
  assert(elements.get("checkHumanComment").dataset.state === "ok", "Human comment checklist must pass initially.");
  assert(elements.get("checkMemoryContent").dataset.state === "ok", "Memory content checklist must pass initially.");
  assert(elements.get("checkWriteBoundary").dataset.state === "ok", "Write boundary checklist must pass initially.");
  assert(initialDraft.review_session_draft.current_version_id === "v2", "Initial current version must be v2.");
  assert(initialDraft.review_session_draft.compare_version_id === "v1", "Initial compare version must be v1.");
  assert(initialDraft.review_session_draft.selected_queue_id === "queue-v2", "Initial selected queue id must be queue-v2.");
  assert(initialDraft.review_session_draft.review_queue.length === 4, "Initial review queue must contain four candidates.");
  assert(
    initialDraft.review_session_draft.review_queue.every((item) => item.draft_state && item.draft_state.version_id),
    "Every queue item must expose an independent draft_state."
  );
  assert(
    initialDraft.review_session_draft.review_queue.every((item) => item.candidate_review_state && item.preauthorization_status),
    "Every queue item must expose candidate review state and preauthorization status."
  );
  assert(elements.get("queueTotal").textContent === "4", "Queue total must render.");
  assert(elements.get("queueVisible").textContent === "4", "Queue visible count must render all candidates initially.");
  assert(elements.get("queueProgress").textContent === "1 / 4", "Queue progress must render initial position.");
  assert(elements.get("queueSelected").textContent === "v1.1 修订候选图", "Queue selected label must render.");
  assert(elements.get("queuePrev").disabled === true, "Initial queue previous button must be disabled at the first item.");
  assert(elements.get("queueNext").disabled === false, "Initial queue next button must be enabled.");
  assert(elements.get("queueList").children.length === 4, "Queue list must render four candidate buttons.");
  assert(elements.get("historyCount").textContent === "0 步", "Initial undo history must be empty.");
  assert(elements.get("historyStatus").textContent.includes("尚未产生"), "Initial history status must be readable.");
  assert(elements.get("statusGlossaryList").children.length >= 6, "Status glossary must render Chinese explanations.");
  assert(
    initialDraft.runtime_session_export_draft.session_fingerprint.startsWith("fnv1a32:"),
    "Initial runtime session export must include a stable fingerprint."
  );
  assert(
    elements.get("sessionFingerprint").textContent === initialDraft.runtime_session_export_draft.session_fingerprint,
    "Session fingerprint must render in the transfer panel."
  );
  elements.get("queueSearch").value = "风险复查图";
  dispatchChange(elements, "queueSearch");
  assert(elements.get("queueVisible").textContent === "1", "Queue search must filter to one matching candidate.");
  assert(elements.get("queueList").children[0].dataset.queueId === "queue-v3", "Queue search must find queue-v3 by Chinese title.");
  elements.get("queueSearch").value = "";
  dispatchChange(elements, "queueSearch");
  elements.get("queueSort").value = "score_desc";
  dispatchChange(elements, "queueSort");
  assert(elements.get("queueList").children[0].dataset.queueId === "queue-v2", "Score-desc sort must place the highest score first.");
  elements.get("queueSort").value = "score_asc";
  dispatchChange(elements, "queueSort");
  assert(elements.get("queueList").children[0].dataset.queueId === "queue-v3", "Score-asc sort must place the lowest score first.");
  elements.get("queueSort").value = "default";
  dispatchChange(elements, "queueSort");
  elements.get("humanComment").value = "撤销测试评论：这句话应被撤销。";
  dispatchChange(elements, "humanComment");
  assert(parseDraft(elements).review_session_draft.human_review.note_cn.includes("撤销测试评论"), "Edited comment must enter draft before undo.");
  dispatchClick(elements, "undoLastAction");
  assert(!parseDraft(elements).review_session_draft.human_review.note_cn.includes("撤销测试评论"), "Undo must restore the previous comment draft.");
  assert(elements.get("historyStatus").textContent.includes("已撤销"), "Undo status must explain the reverted action.");
  assert(initialDraft.batch_review_summary_draft.counts.total_count === 4, "Batch summary must count four candidates.");
  assert(initialDraft.batch_review_summary_draft.counts.accepted_count === 1, "Batch summary must count one accepted item initially.");
  assert(initialDraft.batch_review_summary_draft.counts.human_reviewing_count === 2, "Batch summary must count two pending review items initially.");
  assert(initialDraft.batch_review_summary_draft.counts.write_request_count === 1, "Batch summary must count one write request draft initially.");
  assert(initialDraft.batch_review_summary_draft.counts.blocked_count === 2, "Batch summary must count rejected and draft blockers.");
  assert(initialDraft.batch_review_summary_draft.write_request_items.length === 1, "Batch details must list one write request item initially.");
  assert(initialDraft.batch_review_summary_draft.preflight.no_real_write === true, "Batch preflight must record no real write.");
  assert(initialDraft.batch_review_summary_draft.preflight.no_execution_guard_clean === true, "Batch preflight must record clean guard.");
  assert(initialDraft.batch_review_summary_draft.preflight.accepted_without_human_approval_count === 0, "Batch preflight must catch accepted items without approval.");
  assert(initialDraft.batch_review_summary_draft.handoff_report_cn.includes("边界确认"), "Batch report must include boundary confirmation.");
  assert(runtimeGuard.guardIsClean(initialDraft.batch_review_summary_draft.no_execution_guard), "Batch summary guard must remain clean.");
  assert(initialDraft.batch_decision_draft.status === "draft_only", "Batch decision must be draft only.");
  assert(initialDraft.batch_decision_draft.decision === "partial_authorizable", "Batch decision must allow partial preauthorization review initially.");
  assert(initialDraft.batch_decision_draft.authorizable_items.length === 1, "Batch decision must list one authorizable item initially.");
  assert(initialDraft.batch_decision_draft.blocked_items.length === 2, "Batch decision must list two blockers initially.");
  assert(runtimeGuard.guardIsClean(initialDraft.batch_decision_draft.no_execution_guard), "Batch decision guard must remain clean.");
  assert(
    initialDraft.a5_preauthorization_review_package_draft.package_status === "draft_only",
    "A5 preauthorization package must be draft only."
  );
  assert(
    initialDraft.a5_preauthorization_review_package_draft.forbidden_operations_cn.includes("调用插件"),
    "A5 preauthorization package must forbid plugin calls."
  );
  assert(
    initialDraft.a5_preauthorization_review_package_draft.review_text_cn.includes("不构成授权"),
    "A5 preauthorization package must state that it is not authorization."
  );
  assert(
    runtimeGuard.guardIsClean(initialDraft.a5_preauthorization_review_package_draft.no_execution_guard),
    "A5 preauthorization package guard must remain clean."
  );
  assert(
    initialDraft.inactive_authorization_capsules_draft.authorization_status === "inactive_package",
    "Inactive authorization capsules must remain inactive."
  );
  assert(
    initialDraft.inactive_authorization_capsules_draft.capsules.length === 5,
    "Inactive authorization capsules must include five capsule types."
  );
  assert(
    initialDraft.inactive_authorization_capsules_draft.capsules.every((capsule) => capsule.activation_required === true),
    "Every inactive authorization capsule must require explicit activation."
  );
  assert(
    initialDraft.inactive_authorization_capsules_draft.capsules.every((capsule) => capsule.execution_flags.plugin_called === false),
    "Inactive authorization capsules must not mark plugin calls."
  );
  assert(
    runtimeGuard.guardIsClean(initialDraft.inactive_authorization_capsules_draft.no_execution_guard),
    "Inactive authorization capsule package guard must remain clean."
  );
  assert(elements.get("authCapsuleStatus").textContent === "inactive_package", "Authorization capsule status must render inactive.");
  assert(elements.get("authCapsuleCount").textContent === "5 个", "Authorization capsule count must render.");
  assert(elements.get("authCapsuleTypes").children.length === 5, "Authorization capsule type list must render.");
  assert(elements.get("authCapsuleForbidden").textContent.includes("raw endpoint"), "Authorization capsule forbidden outputs must render.");
  assert(elements.get("authCapsuleBoundary").textContent.includes("未激活授权胶囊"), "Authorization capsule boundary must render.");
  assert(
    initialDraft.accepted_candidate_delivery_package_draft.package_status === "draft_only",
    "Accepted candidate delivery package must be draft only."
  );
  assert(
    initialDraft.accepted_candidate_delivery_package_draft.submitDraft_called === false,
    "Accepted candidate delivery package must declare submitDraft_called=false."
  );
  assert(
    initialDraft.accepted_candidate_delivery_package_draft.side_effects_performed === false,
    "Accepted candidate delivery package must declare no side effects."
  );
  assert(
    runtimeGuard.guardIsClean(initialDraft.accepted_candidate_delivery_package_draft.no_execution_guard),
    "Accepted candidate delivery package guard must remain clean."
  );
  assert(
    initialDraft.accepted_candidate_delivery_package_draft.sanitized_asset_hash.startsWith("fnv1a32:"),
    "Accepted candidate delivery package must include a sanitized asset hash."
  );
  assert(
    initialDraft.accepted_candidate_delivery_package_draft.memory_delta_preview.body_cn.includes("Photo Studio OS"),
    "Accepted candidate delivery package must include memory delta preview."
  );
  assert(
    initialDraft.human_override_traceability_draft.package_status === "draft_only",
    "Human override traceability must be draft only."
  );
  assert(
    initialDraft.human_override_traceability_draft.prompt_compliance_complete === false,
    "Human override traceability must not claim complete prompt compliance for known deviations."
  );
  assert(
    initialDraft.human_override_traceability_draft.memory_suitable === false,
    "Initial human override traceability must not mark memory suitable before approval."
  );
  assert(
    runtimeGuard.guardIsClean(initialDraft.human_override_traceability_draft.no_execution_guard),
    "Human override traceability guard must remain clean."
  );
  assert(
    elements.get("traceabilityTotal").textContent === String(initialDraft.human_override_traceability_draft.traceability_counts.total),
    "Traceability total must render."
  );
  assert(
    elements.get("traceabilityList").children.length === initialDraft.human_override_traceability_draft.traceability_items.length,
    "Traceability list must render every row."
  );
  assert(
    elements.get("traceabilityList").children[0].dataset.deliveryPackage === "true",
    "Traceability list must begin with the delivery package row."
  );
  assert(
    elements.get("traceabilityList").textContent.includes("已接受候选"),
    "Traceability list must show the delivery package as accepted candidate."
  );
  assert(
    elements.get("traceabilitySummary").textContent.includes("追踪记录"),
    "Traceability summary must render."
  );
  assert(
    elements.get("traceabilityBoundary").textContent.includes("不触发真实执行"),
    "Traceability boundary must render."
  );
  assert(elements.get("deliveryPackageStatus").textContent.includes("交付包草案"), "Delivery package status must render.");
  assert(elements.get("deliveryPackageHash").textContent.startsWith("fnv1a32:"), "Delivery package sanitized hash must render.");
  assert(elements.get("deliveryPackageBoundary").textContent.includes("submitDraft_called=false"), "Delivery package boundary must render.");
  assert(elements.get("overrideDecisionSource").textContent.includes("人工评审表单"), "Override decision source must render.");
  assert(elements.get("overridePromptCompliance").textContent.includes("不能声明"), "Override prompt compliance summary must render.");
  assert(initialDraft.risk_review_summary_draft.status === "clear", "Initial risk summary must be clear.");
  assert(initialDraft.risk_review_summary_draft.total_risk_item_count === 0, "Initial risk summary must have zero risk items.");
  assert(initialDraft.human_inspection_checklist_draft.status === "draft_only", "Inspection checklist must be draft only.");
  assert(initialDraft.human_inspection_checklist_draft.report_cn.includes("验货结论"), "Inspection checklist must include Chinese report.");
  assert(initialDraft.runtime_session_export_draft.export_format === "runtime_review_session_v1", "Runtime session export must expose v1 format.");
  assert(initialDraft.runtime_session_export_draft.package_status === "draft_only", "Runtime session export must be draft only.");
  assert(initialDraft.runtime_session_export_draft.side_effects_performed === false, "Runtime session export must declare no side effects.");
  assert(runtimeGuard.guardIsClean(initialDraft.runtime_session_export_draft.prototype_guard), "Runtime session export guard must remain clean.");
  assert(
    initialDraft.runtime_review_state_draft.convergence_status === "converged",
    "Initial runtime review state must be converged."
  );
  assert(
    initialDraft.runtime_review_state_draft.normalized_state.asset_state_key === "candidate",
    "Initial runtime review state must keep candidate separate from memory status."
  );
  assert(
    initialDraft.runtime_review_state_draft.mismatch_items_cn.length === 0,
    "Initial runtime review state must have no mismatches."
  );
  assert(
    elements.get("runtimeStateUnified").textContent.includes("候选"),
    "Runtime state unified summary must render candidate state."
  );
  assert(
    elements.get("runtimeStateMismatches").textContent.includes("未发现状态矛盾"),
    "Runtime state mismatch list must render clean state."
  );
  assert(
    initialDraft.local_commit_scope_plan_draft.plan_status === "local_commit_scope_candidate",
    "Local commit scope plan must be a local candidate only."
  );
  assert(initialDraft.local_commit_scope_plan_draft.staged_changes_present === false, "Local commit scope must not mark staged changes.");
  assert(initialDraft.local_commit_scope_plan_draft.commit_allowed === false, "Local commit scope must not authorize commit.");
  assert(initialDraft.local_commit_scope_plan_draft.push_allowed === false, "Local commit scope must not authorize push.");
  assert(
    elements.get("commitScopeStatus").textContent.includes("本地提交范围"),
    "Commit scope status must render."
  );
  assert(elements.get("commitScopeStaged").textContent === "无 staged changes", "Commit scope staged state must render.");
  assert(elements.get("commitScopeRemote").textContent === "远端/版本动作未授权", "Commit scope remote boundary must render.");
  assert(elements.get("commitScopeRuntime").children.length >= 4, "Commit scope runtime group must render.");
  assert(elements.get("commitScopeRollback").textContent.includes("不要使用破坏性历史回滚"), "Commit scope rollback guidance must render.");
  assert(
    initialDraft.bridge_mock_roundtrip_candidate_draft.roundtrip_status === "mock_roundtrip_candidate",
    "Bridge mock roundtrip must be a local candidate only."
  );
  assert(
    initialDraft.bridge_mock_roundtrip_candidate_draft.bridge_mode === "project_local_mock",
    "Bridge mock roundtrip must stay project-local mock."
  );
  assert(
    initialDraft.bridge_mock_roundtrip_candidate_draft.bridge_calls_observed.mock_only === true,
    "Bridge mock roundtrip must mark calls mock-only."
  );
  assert(
    initialDraft.bridge_mock_roundtrip_candidate_draft.bridge_calls_observed.loadSession === 1,
    "Bridge mock roundtrip must record one loadSession fixture."
  );
  assert(
    initialDraft.bridge_mock_roundtrip_candidate_draft.bridge_calls_observed.previewDraft === 1,
    "Bridge mock roundtrip must record one previewDraft fixture."
  );
  assert(
    initialDraft.bridge_mock_roundtrip_candidate_draft.bridge_calls_observed.submitDraft === 0,
    "Bridge mock roundtrip must not call submitDraft."
  );
  assert(
    initialDraft.bridge_mock_roundtrip_candidate_draft.plugin_called === false &&
      initialDraft.bridge_mock_roundtrip_candidate_draft.api_called === false &&
      initialDraft.bridge_mock_roundtrip_candidate_draft.daily_note_called === false &&
      initialDraft.bridge_mock_roundtrip_candidate_draft.vcp_memory_written === false &&
      initialDraft.bridge_mock_roundtrip_candidate_draft.image_created === false,
    "Bridge mock roundtrip must keep all write/real execution flags false."
  );
  assert(elements.get("bridgeRoundtripStatus").textContent.includes("项目内 mock 回环候选"), "Bridge roundtrip status must render.");
  assert(elements.get("bridgeRoundtripMethods").textContent.includes("loadSession -> previewDraft"), "Bridge methods must render.");
  assert(elements.get("bridgeRoundtripCalls").textContent.includes("submitDraft=0"), "Bridge call counts must render submitDraft=0.");
  assert(elements.get("bridgeRoundtripAck").textContent.includes("previewDraft"), "Bridge ack summary must render previewDraft.");
  assert(elements.get("bridgeRoundtripBoundary").textContent.includes("不连接 CDP"), "Bridge roundtrip boundary must render no-CDP state.");
  assert(
    initialDraft.real_bridge_authorization_package_draft.authorization_status === "inactive_package",
    "Real bridge authorization package must stay inactive."
  );
  assert(
    initialDraft.real_bridge_authorization_package_draft.allowed_methods.join("|") === "cancel|loadSession|previewDraft",
    "Real bridge authorization package must allow only cancel/loadSession/previewDraft."
  );
  assert(
    initialDraft.real_bridge_authorization_package_draft.forbidden_methods.includes("submitDraft"),
    "Real bridge authorization package must forbid submitDraft."
  );
  assert(
    initialDraft.real_bridge_authorization_package_draft.production_bridge_invocation_performed === false &&
      initialDraft.real_bridge_authorization_package_draft.real_cdp_called === false,
    "Real bridge authorization package must not mark real bridge or CDP calls."
  );
  assert(elements.get("realBridgeAuthStatus").textContent.includes("inactive_package"), "Real bridge auth status must render.");
  assert(elements.get("realBridgeAuthMethods").textContent.includes("previewDraft"), "Real bridge methods must render.");
  assert(elements.get("realBridgeAuthForbidden").textContent.includes("raw CDP target"), "Real bridge forbidden outputs must render.");
  assert(elements.get("realBridgeAuthBoundary").textContent.includes("不启动 VCPChat"), "Real bridge boundary must render no-launch state.");
  assert(
    initialDraft.plugin_reliability_prompt_discipline_draft.reliability_status === "local_prompt_reliability_candidate",
    "Plugin reliability prompt discipline must be a local candidate."
  );
  assert(
    initialDraft.plugin_reliability_prompt_discipline_draft.prompt_hash.startsWith("fnv1a32:"),
    "Plugin reliability prompt discipline must include prompt hash."
  );
  assert(
    initialDraft.plugin_reliability_prompt_discipline_draft.max_plugin_calls_allowed === 0,
    "Plugin reliability prompt discipline must allow zero plugin calls."
  );
  assert(
    initialDraft.plugin_reliability_prompt_discipline_draft.provider_side_capture.authorization_status === "inactive_package",
    "Provider-side capture must stay inactive."
  );
  assert(elements.get("promptReliabilityStatus").textContent.includes("prompt discipline"), "Prompt reliability status must render.");
  assert(elements.get("promptReliabilityHash").textContent.includes("doubao-seedream"), "Prompt reliability hash/model must render.");
  assert(elements.get("promptReliabilityFailures").textContent.includes("模型遵循失败"), "Prompt reliability failure taxonomy must render.");
  assert(elements.get("promptReliabilityBoundary").textContent.includes("不调用 DoubaoGen"), "Prompt reliability boundary must render no-plugin state.");
  assert(
    initialDraft.memory_write_completion_candidate_draft.candidate_status === "memory_write_completion_preflight_candidate",
    "Memory write completion candidate must be a local preflight candidate."
  );
  assert(
    initialDraft.memory_write_completion_candidate_draft.completion_criteria.plugin_success_sufficient === false,
    "Memory write completion candidate must keep plugin success insufficient."
  );
  assert(
    initialDraft.memory_write_completion_candidate_draft.observed_state.writer_executed === false &&
      initialDraft.memory_write_completion_candidate_draft.observed_state.canonical_target_exists === false &&
      initialDraft.memory_write_completion_candidate_draft.observed_state.canonical_target_hash_matches === false,
    "Memory write completion candidate must keep observed completion false."
  );
  assert(elements.get("memoryCompletionCandidateStatus").textContent.includes("记忆写入完成候选"), "Memory completion candidate status must render.");
  assert(elements.get("memoryCompletionCandidateCriteria").textContent.includes("plugin success 充分：false"), "Memory completion criteria must render plugin insufficiency.");
  assert(elements.get("memoryCompletionCandidateObserved").textContent.includes("writer_executed=false"), "Memory completion observed state must render.");
  assert(elements.get("memoryCompletionCandidateBoundary").textContent.includes("不调用 DailyNote"), "Memory completion boundary must render no-write state.");
  assert(
    initialDraft.single_real_generation_retry_gate_draft.gate_status === "single_real_generation_retry_gate_inactive",
    "Single real generation retry gate must stay inactive."
  );
  assert(
    initialDraft.single_real_generation_retry_gate_draft.selected_plugin_id === "DoubaoGen" &&
      initialDraft.single_real_generation_retry_gate_draft.max_plugin_calls_per_run === 1 &&
      initialDraft.single_real_generation_retry_gate_draft.plugin_calls_observed === 0,
    "Single real generation retry gate must define one future call but observe zero current calls."
  );
  assert(
    initialDraft.single_real_generation_retry_gate_draft.real_generation_performed === false &&
      initialDraft.single_real_generation_retry_gate_draft.image_created === false &&
      initialDraft.single_real_generation_retry_gate_draft.memory_write_block.memory_write_allowed_by_this_record === false,
    "Single real generation retry gate must keep generation/image/memory false."
  );
  assert(elements.get("generationRetryGateStatus").textContent.includes("inactive_package"), "Generation retry gate status must render.");
  assert(elements.get("generationRetryGatePlugin").textContent.includes("DoubaoGen"), "Generation retry gate plugin/model must render.");
  assert(elements.get("generationRetryGatePrompt").textContent.includes("prompt hash"), "Generation retry gate prompt hash must render.");
  assert(elements.get("generationRetryGateGuards").textContent.includes("image_created=false"), "Generation retry gate guards must render no-image state.");
  assert(elements.get("generationRetryGateBoundary").textContent.includes("不调用 DoubaoGen"), "Generation retry gate boundary must render no-plugin state.");
  assert(
    initialDraft.real_memory_write_authorization_package_draft.authorization_status === "inactive_package",
    "Real memory write authorization package must stay inactive."
  );
  assert(
    initialDraft.real_memory_write_authorization_package_draft.max_daily_note_writes === 1 &&
      initialDraft.real_memory_write_authorization_package_draft.max_vcp_memory_writes === 1 &&
      initialDraft.real_memory_write_authorization_package_draft.no_success_fabrication_rule === true,
    "Real memory write authorization package must define single-write limits and no-success-fabrication rule."
  );
  assert(
    initialDraft.real_memory_write_authorization_package_draft.daily_note_called === false &&
      initialDraft.real_memory_write_authorization_package_draft.vcp_memory_written === false,
    "Real memory write authorization package must keep write flags false."
  );
  assert(elements.get("memoryWriteAuthStatus").textContent.includes("inactive_package"), "Memory write auth status must render.");
  assert(elements.get("memoryWriteAuthCounts").textContent.includes("max_daily_note_writes=1"), "Memory write auth counts must render.");
  assert(elements.get("memoryWriteAuthRules").textContent.includes("中文脱敏摘要"), "Memory write auth rules must render.");
  assert(elements.get("memoryWriteAuthReject").textContent.includes("no_success_fabrication_rule=true"), "Memory write auth reject path must render.");
  assert(elements.get("memoryWriteAuthBoundary").textContent.includes("不调用 DailyNote"), "Memory write auth boundary must render no-write state.");
  assert(
    initialDraft.asset_archive_candidate_draft.archive_status === "asset_archive_candidate_no_binary",
    "Asset archive candidate must be metadata-only no-binary."
  );
  assert(
    initialDraft.asset_archive_candidate_draft.binary_storage_allowed === false &&
      initialDraft.asset_archive_candidate_draft.git_binary_stored === false &&
      initialDraft.asset_archive_candidate_draft.memory_binary_stored === false,
    "Asset archive candidate must keep binary storage false."
  );
  assert(
    initialDraft.asset_archive_candidate_draft.closeout_templates.length === 3 &&
      initialDraft.asset_archive_candidate_draft.archived_fields.includes("asset_hash"),
    "Asset archive candidate must include closeout templates and archive fields."
  );
  assert(elements.get("assetArchiveCandidateStatus").textContent.includes("资产归档候选"), "Asset archive candidate status must render.");
  assert(elements.get("assetArchiveCandidateFields").textContent.includes("binary_storage_allowed=false"), "Asset archive fields must render no-binary state.");
  assert(elements.get("assetArchiveCandidateCloseouts").textContent.includes("rejected"), "Asset archive closeout templates must render.");
  assert(elements.get("assetArchiveCandidateBoundary").textContent.includes("不保存图片二进制"), "Asset archive boundary must render no-binary state.");
  assert(elements.get("batchTotal").textContent === "4", "Batch total must render.");
  assert(elements.get("batchAccepted").textContent === "1", "Batch accepted count must render.");
  assert(elements.get("batchPending").textContent === "2", "Batch pending count must render.");
  assert(elements.get("batchWriteRequests").textContent === "1", "Batch write request count must render.");
  assert(elements.get("batchBlocked").textContent === "2", "Batch blocked count must render.");
  assert(elements.get("batchSummary").textContent.includes("0 个真实写入"), "Batch summary must show no real write.");
  assert(elements.get("batchWriteItems").children.length === 1, "Batch write item details must render initially.");
  assert(elements.get("batchNextItems").children.length === 2, "Batch next items must render pending queue items.");
  assert(elements.get("batchBlockedItems").children.length === 2, "Batch blocked items must render blockers.");
  assert(elements.get("batchPreflightItems").children.length === 5, "Batch preflight checklist must render.");
  assert(elements.get("batchPreflightItems").children[0].dataset.state === "ok", "Batch preflight no-real-write item must pass.");
  assert(elements.get("batchReport").textContent.includes("可进入后续授权"), "Batch report must render readable handoff text.");
  assert(elements.get("batchDecisionStatus").textContent.includes("部分候选"), "Batch decision status must render.");
  assert(elements.get("batchDecisionReason").textContent.includes("不构成 A5 授权"), "Batch decision reason must render boundary text.");
  assert(elements.get("preauthPackageStatus").textContent === "仅授权前人工复核草案", "Preauthorization package status must render.");
  assert(elements.get("preauthPackageItems").children.length === 1, "Preauthorization package item list must render initially.");
  assert(elements.get("preauthPackageForbidden").children.length >= 5, "Preauthorization package forbidden list must render.");
  assert(elements.get("preauthPackageText").textContent.includes("A5 授权前人工复核包草案"), "Preauthorization package text must render.");
  assert(elements.get("inspectionVerdict").textContent.includes("阻塞"), "Inspection verdict must render Chinese batch status.");
  assert(elements.get("inspectionChecklist").children.length === 5, "Inspection checklist must render five items.");
  assert(elements.get("inspectionRiskStats").textContent.includes("风险候选"), "Inspection risk stats must render.");
  assert(elements.get("inspectionRiskGroups").children.length === 1, "Inspection risk group empty state must render.");
  assert(elements.get("sessionTransferStatus").textContent.includes("尚未"), "Session transfer status must render initial state.");
  assert(elements.get("sessionTransferCount").textContent === "4 个候选", "Session transfer count must render current export count.");
  assert(elements.get("sessionTransferGuard").textContent === "导出 guard 干净", "Session transfer guard must render clean state.");
  assert(elements.get("batchSelectedCount").textContent === "0 个", "Batch selected count must start at zero.");
  assert(elements.get("batchOperationStatus").textContent.includes("尚未"), "Batch operation status must render initial text.");
  assert(initialDraft.review_session_draft.annotation_notes.length === 1, "Initial annotation note must be included.");
  assert(
    initialDraft.review_session_draft.version_comparison.summary_cn.includes("v1.1 修订候选图"),
    "Initial comparison summary must name the current version."
  );
  assert(initialDraft.image_case_draft.human_approval.approved === false, "Initial human approval must be false.");
  assert(initialDraft.memory_delta_draft.write_mode === "draft", "Initial memory write mode must be draft.");
  assert(initialDraft.memory_delta_draft.final_decision.should_write_to_vcp === false, "Initial memory write request must be false.");
  assert(runtimeGuard.guardIsClean(initialDraft.prototype_guard), "Initial prototype guard must be clean.");

  dispatchClick(elements, "exportSessionDraft");
  const exportedSessionPayload = JSON.parse(elements.get("sessionTransferText").value);
  assert(exportedSessionPayload.export_format === "runtime_review_session_v1", "Export button must write session export JSON.");
  assert(exportedSessionPayload.review_session_snapshot.review_queue.length === 4, "Exported session must include four candidates.");
  assert(exportedSessionPayload.session_fingerprint.startsWith("fnv1a32:"), "Exported session must include a fingerprint.");
  assert(
    elements.get("sessionFingerprint").textContent === exportedSessionPayload.session_fingerprint,
    "Exported fingerprint must render in the session panel."
  );
  assert(elements.get("sessionTransferStatus").textContent.includes("已导出"), "Export button must update session status.");
  dispatchClick(elements, "validateImportDraft");
  assert(elements.get("sessionTransferStatus").textContent.includes("校验通过"), "Import validation must accept the exported session.");
  assert(elements.get("importPreviewStatus").textContent.includes("0 个候选会变化"), "Import preview must render unchanged exported session.");
  const legacyV1Payload = runtimeGuard.clone(exportedSessionPayload);
  [
    "batch_decision_draft",
    "a5_preauthorization_review_package_draft",
    "human_override_traceability_draft",
    "accepted_candidate_delivery_package_draft",
    "inactive_authorization_capsules_draft",
    "runtime_review_state_draft",
    "local_commit_scope_plan_draft",
    "bridge_mock_roundtrip_candidate_draft",
    "real_bridge_authorization_package_draft",
    "plugin_reliability_prompt_discipline_draft",
    "memory_write_completion_candidate_draft",
    "single_real_generation_retry_gate_draft",
    "real_memory_write_authorization_package_draft",
    "asset_archive_candidate_draft"
  ].forEach((fieldName) => {
    delete legacyV1Payload[fieldName];
  });
  legacyV1Payload.session_fingerprint = context.fingerprintString(
    context.sessionPayloadForFingerprint(legacyV1Payload)
  );
  legacyV1Payload.session_fingerprint_cn = `会话指纹：${legacyV1Payload.session_fingerprint}`;
  elements.get("sessionTransferText").value = JSON.stringify(legacyV1Payload);
  dispatchClick(elements, "validateImportDraft");
  assert(
    elements.get("sessionTransferStatus").textContent.includes("校验通过"),
    "Import validation must accept legacy v1 exports without newly added draft blocks."
  );
  const tamperedFingerprintPayload = runtimeGuard.clone(exportedSessionPayload);
  tamperedFingerprintPayload.review_session_snapshot.review_queue[0].human_note_cn = "篡改后的评论但保留旧指纹。";
  elements.get("sessionTransferText").value = JSON.stringify(tamperedFingerprintPayload);
  dispatchClick(elements, "validateImportDraft");
  assert(elements.get("sessionTransferStatus").textContent.includes("指纹不匹配"), "Import validation must reject a stale fingerprint.");
  assert(elements.get("importPreviewStatus").textContent.includes("不可用"), "Import preview must stop when fingerprint validation fails.");
  const dirtySessionPayload = runtimeGuard.clone(exportedSessionPayload);
  dirtySessionPayload.prototype_guard.api_called = true;
  elements.get("sessionTransferText").value = JSON.stringify(dirtySessionPayload);
  dispatchClick(elements, "validateImportDraft");
  assert(elements.get("sessionTransferStatus").textContent.includes("校验失败"), "Import validation must reject dirty guard.");
  const dirtySessionGuardRejected = elements.get("sessionTransferStatus").textContent.includes("校验失败");
  elements.get("sessionTransferText").value = JSON.stringify(exportedSessionPayload);
  dispatchClick(elements, "applyImportDraft");
  assert(elements.get("sessionTransferStatus").textContent.includes("已恢复"), "Apply import must restore the exported session.");
  assert(parseDraft(elements).review_session_draft.selected_queue_id === "queue-v2", "Imported session must keep selected queue id.");

  dispatchClick(elements, "batchShowAuthorizable");
  assert(elements.get("queueFilter").value === "write_request", "Authorizable batch shortcut must select write-request filter.");
  assert(elements.get("queueVisible").textContent === "1", "Authorizable batch shortcut must show one item initially.");
  dispatchClick(elements, "batchShowBlocked");
  assert(elements.get("queueFilter").value === "blocked", "Blocked batch shortcut must select blocked filter.");
  assert(elements.get("queueVisible").textContent === "2", "Blocked batch shortcut must show two items initially.");
  dispatchClick(elements, "batchShowNext");
  assert(elements.get("queueFilter").value === "next_attention", "Next batch shortcut must select next-attention filter.");
  assert(elements.get("queueVisible").textContent === "2", "Next batch shortcut must show two items initially.");
  elements.get("queueFilter").value = "all";
  dispatchChange(elements, "queueFilter");

  elements.get("queueFilter").value = "write_request";
  dispatchChange(elements, "queueFilter");
  const writeRequestButtons = elements.get("queueList").children;
  assert(elements.get("queueVisible").textContent === "1", "Write request filter must show one candidate initially.");
  assert(writeRequestButtons.length === 1, "Write request filter must render one candidate button initially.");
  assert(writeRequestButtons[0].dataset.queueId === "queue-v1", "Write request filter must start with queue-v1.");
  assert(writeRequestButtons[0].dataset.writeRequest === "true", "Write request queue card must expose write-request marker.");
  assert(elements.get("queueProgress").textContent === "- / 1", "Write request filter must show active item outside filter initially.");
  elements.get("queueFilter").value = "blocked";
  dispatchChange(elements, "queueFilter");
  const blockedQueueButtons = elements.get("queueList").children;
  assert(elements.get("queueVisible").textContent === "2", "Blocked filter must show rejected and draft candidates.");
  assert(blockedQueueButtons.length === 2, "Blocked filter must render two candidate buttons.");
  assert(blockedQueueButtons.some((child) => child.dataset.queueId === "queue-v3"), "Blocked filter must include rejected item.");
  assert(blockedQueueButtons.some((child) => child.dataset.queueId === "queue-v4"), "Blocked filter must include draft item.");
  assert(blockedQueueButtons.every((child) => child.dataset.blocked === "true"), "Blocked queue cards must expose blocked marker.");
  elements.get("queueFilter").value = "next_attention";
  dispatchChange(elements, "queueFilter");
  const nextAttentionButtons = elements.get("queueList").children;
  assert(elements.get("queueVisible").textContent === "2", "Next-attention filter must show candidate and draft items.");
  assert(nextAttentionButtons.length === 2, "Next-attention filter must render two candidate buttons.");
  assert(nextAttentionButtons.some((child) => child.dataset.queueId === "queue-v2"), "Next-attention filter must include queue-v2.");
  assert(nextAttentionButtons.some((child) => child.dataset.queueId === "queue-v4"), "Next-attention filter must include queue-v4.");
  assert(nextAttentionButtons.every((child) => child.dataset.nextAttention === "true"), "Next-attention cards must expose next-attention marker.");
  elements.get("queueFilter").value = "all";
  dispatchChange(elements, "queueFilter");

  elements.get("queueFilter").value = "rejected";
  dispatchChange(elements, "queueFilter");
  const rejectedQueueButtons = elements.get("queueList").children;
  assert(elements.get("queueVisible").textContent === "1", "Rejected queue filter must show one candidate.");
  assert(elements.get("queueProgress").textContent === "- / 1", "Filtered progress must show when active item is outside filter.");
  assert(rejectedQueueButtons.length === 1, "Rejected queue filter must render one candidate button.");
  assert(rejectedQueueButtons[0].textContent.includes("已拒收"), "Rejected queue button must show rejected status.");
  dispatchElementClick(rejectedQueueButtons[0]);
  const rejectedSelectionDraft = parseDraft(elements);
  assert(rejectedSelectionDraft.review_session_draft.selected_queue_id === "queue-v3", "Queue click must select queue-v3.");
  assert(rejectedSelectionDraft.review_session_draft.current_version_id === "v3", "Queue click must switch current version to v3.");
  assert(rejectedSelectionDraft.image_case_draft.asset_status === "rejected", "Rejected queue item must load rejected asset status.");
  assert(rejectedSelectionDraft.review_session_draft.queue_progress.active_index === 1, "Rejected selection progress must enter draft.");
  assert(elements.get("queueProgress").textContent === "1 / 1", "Rejected selection must show filtered progress.");
  assert(elements.get("queuePrev").disabled === true, "Previous button must be disabled for single filtered item.");
  assert(elements.get("queueNext").disabled === true, "Next button must be disabled for single filtered item.");
  assert(elements.get("queueSelected").textContent === "v1.2 风险复查图", "Queue selected label must update after click.");
  elements.get("queueFilter").value = "all";
  dispatchChange(elements, "queueFilter");
  const queueV2Button = elements.get("queueList").children.find((child) => child.dataset.queueId === "queue-v2");
  assert(queueV2Button, "All queue filter must include queue-v2.");
  dispatchElementClick(queueV2Button);
  const returnedQueueDraft = parseDraft(elements);
  assert(returnedQueueDraft.review_session_draft.selected_queue_id === "queue-v2", "Queue click must return to queue-v2.");
  assert(returnedQueueDraft.review_session_draft.current_version_id === "v2", "Queue click must restore current version v2.");
  assert(elements.get("queueProgress").textContent === "1 / 4", "Returned queue progress must show first position.");
  dispatchClick(elements, "queueNext");
  const nextQueueDraft = parseDraft(elements);
  assert(nextQueueDraft.review_session_draft.selected_queue_id === "queue-v1", "Next queue button must select queue-v1.");
  assert(nextQueueDraft.review_session_draft.current_version_id === "v1", "Next queue button must switch to v1.");
  assert(elements.get("queueProgress").textContent === "2 / 4", "Next queue button must advance progress.");
  dispatchClick(elements, "queuePrev");
  const previousQueueDraft = parseDraft(elements);
  assert(previousQueueDraft.review_session_draft.selected_queue_id === "queue-v2", "Previous queue button must return to queue-v2.");
  assert(previousQueueDraft.review_session_draft.current_version_id === "v2", "Previous queue button must switch back to v2.");
  elements.get("humanScore").value = "92";
  dispatchChange(elements, "humanScore");
  elements.get("humanComment").value = "队列状态保持测试：v2 的人工评论不能被 v1 覆盖。";
  dispatchChange(elements, "humanComment");
  elements.get("humanApproved").checked = true;
  dispatchChange(elements, "humanApproved");
  elements.get("memoryApproval").value = "approved";
  dispatchChange(elements, "memoryApproval");
  const editedQueueDraft = parseDraft(elements);
  const editedQueueV2 = editedQueueDraft.review_session_draft.review_queue.find((item) => item.queue_id === "queue-v2");
  assert(editedQueueV2.draft_state.score === 92, "Edited queue-v2 draft_state must store score.");
  assert(editedQueueV2.draft_state.human_approved === true, "Edited queue-v2 draft_state must store human approval.");
  assert(editedQueueV2.draft_state.memory_approval_status === "approved", "Edited queue-v2 draft_state must store memory approval.");
  assert(editedQueueV2.draft_state.human_note_cn.includes("状态保持测试"), "Edited queue-v2 draft_state must store human comment.");
  assert(editedQueueDraft.batch_review_summary_draft.counts.accepted_count === 2, "Batch summary must update accepted count after editing v2.");
  assert(editedQueueDraft.batch_review_summary_draft.counts.write_request_count === 2, "Batch summary must update write request count after editing v2.");
  assert(editedQueueDraft.batch_review_summary_draft.write_request_items.length === 2, "Batch details must update write request items after editing v2.");
  assert(editedQueueDraft.batch_review_summary_draft.handoff_report_cn.includes("队列状态保持测试"), "Batch report must include edited candidate context.");
  assert(editedQueueDraft.batch_decision_draft.authorizable_items.length === 2, "Batch decision must update authorizable item count after editing v2.");
  assert(
    editedQueueDraft.a5_preauthorization_review_package_draft.authorizable_items.length === 2,
    "A5 preauthorization package must update authorizable item count after editing v2."
  );
  assert(
    editedQueueDraft.a5_preauthorization_review_package_draft.review_text_cn.includes("队列状态保持测试"),
    "A5 preauthorization package must include edited candidate context."
  );
  assert(
    editedQueueDraft.accepted_candidate_delivery_package_draft.delivery_readiness === "accepted_candidate_ready",
    "Accepted delivery package must become ready after human and memory approval."
  );
  assert(
    editedQueueDraft.accepted_candidate_delivery_package_draft.human_approval_summary.approved === true,
    "Accepted delivery package must carry human approval summary."
  );
  assert(
    editedQueueDraft.accepted_candidate_delivery_package_draft.memory_delta_preview.approval_status === "approved",
    "Accepted delivery package must carry memory approval preview."
  );
  assert(
    editedQueueDraft.human_override_traceability_draft.override_performed === true,
    "Human override traceability must record accepted-with-deviation override."
  );
  assert(
    editedQueueDraft.human_override_traceability_draft.memory_suitable === true,
    "Human override traceability must mark memory suitable after approval and clean risk."
  );
  assert(
    editedQueueDraft.runtime_review_state_draft.normalized_state.asset_state_key === "accepted_by_human_override",
    "Runtime review state must classify approved-with-deviation as accepted_by_human_override."
  );
  assert(
    editedQueueDraft.runtime_review_state_draft.normalized_state.memory_status === "approved",
    "Runtime review state must keep memory approval as a separate status."
  );
  assert(
    editedQueueDraft.runtime_review_state_draft.normalized_state.write_performed === false,
    "Runtime review state must not mark real write performed after approval."
  );
  assert(
    elements.get("deliveryPackageStatus").textContent.includes("accepted 候选"),
    "Delivery package UI must show readiness after approval."
  );
  assert(
    elements.get("overrideMemorySuitability").textContent.includes("满足写入申请草案条件"),
    "Override traceability UI must show memory suitability after approval."
  );
  assert(
    elements.get("traceabilityHumanOverride").textContent === String(editedQueueDraft.human_override_traceability_draft.traceability_counts.human_override),
    "Traceability human override count must update after approval."
  );
  assert(
    elements.get("traceabilityList").textContent.includes("人工覆盖接受"),
    "Traceability matrix must show human override wording after approval."
  );
  assert(
    elements.get("traceabilityList").children.length === editedQueueDraft.human_override_traceability_draft.traceability_items.length,
    "Traceability list row count must stay in sync after approval."
  );
  assert(
    elements.get("runtimeStateUnified").textContent.includes("人工覆盖接受"),
    "Runtime state UI must render accepted-by-human-override after approval with deviation."
  );
  assert(elements.get("batchAccepted").textContent === "2", "Batch accepted count must update in UI.");
  assert(elements.get("batchWriteRequests").textContent === "2", "Batch write request count must update in UI.");
  assert(elements.get("batchWriteItems").children.length === 2, "Batch write item details must update in UI.");
  assert(elements.get("batchReport").textContent.includes("队列状态保持测试"), "Batch report UI must include edited candidate context.");
  assert(elements.get("preauthPackageItems").children.length === 2, "Preauthorization package UI must update item count.");
  assert(elements.get("preauthPackageText").textContent.includes("队列状态保持测试"), "Preauthorization package UI must include edited candidate context.");
  elements.get("queueFilter").value = "write_request";
  dispatchChange(elements, "queueFilter");
  const updatedWriteRequestButtons = elements.get("queueList").children;
  assert(elements.get("queueVisible").textContent === "2", "Write request filter must update after editing v2.");
  assert(updatedWriteRequestButtons.some((child) => child.dataset.queueId === "queue-v2"), "Write request filter must include edited queue-v2.");
  assert(updatedWriteRequestButtons.some((child) => child.dataset.queueId === "queue-v1"), "Write request filter must still include queue-v1.");
  elements.get("queueFilter").value = "all";
  dispatchChange(elements, "queueFilter");
  elements.get("riskTextArtifact").checked = true;
  dispatchChange(elements, "riskTextArtifact");
  const riskBlockedDraft = parseDraft(elements);
  const riskBlockedQueueV2 = riskBlockedDraft.review_session_draft.review_queue.find((item) => item.queue_id === "queue-v2");
  assert(riskBlockedQueueV2.preauthorization_status === "blocked", "High-risk candidate must be blocked from preauthorization.");
  assert(riskBlockedDraft.batch_review_summary_draft.counts.write_request_count === 1, "High-risk accepted candidate must leave write-request list.");
  assert(riskBlockedDraft.risk_review_summary_draft.total_risk_item_count === 1, "Risk summary must count high-risk candidate.");
  assert(riskBlockedDraft.a5_preauthorization_review_package_draft.risk_grouped_items.length === 1, "Preauthorization package must group risk items.");
  assert(elements.get("inspectionRiskGroups").textContent.includes("文字伪影"), "Inspection UI must show risk group.");
  elements.get("riskTextArtifact").checked = false;
  dispatchChange(elements, "riskTextArtifact");
  const riskClearedDraft = parseDraft(elements);
  assert(riskClearedDraft.batch_review_summary_draft.counts.write_request_count === 2, "Clearing risk tag must restore write request eligibility.");

  dispatchClick(elements, "exportSessionDraft");
  const editedSessionPayload = JSON.parse(elements.get("sessionTransferText").value);
  elements.get("humanComment").value = "临时覆盖：这句话应被导入恢复覆盖。";
  dispatchChange(elements, "humanComment");
  assert(parseDraft(elements).review_session_draft.human_review.note_cn.includes("临时覆盖"), "Temporary edit must enter current draft before import.");
  elements.get("sessionTransferText").value = JSON.stringify(editedSessionPayload);
  dispatchClick(elements, "validateImportDraft");
  assert(elements.get("importPreviewStatus").textContent.includes("候选会变化"), "Import preview must summarize changed candidates.");
  assert(elements.get("importPreviewItems").textContent.includes("评论"), "Import preview must name changed comment fields.");
  dispatchClick(elements, "applyImportDraft");
  const restoredImportDraft = parseDraft(elements);
  assert(restoredImportDraft.review_session_draft.human_review.note_cn.includes("状态保持测试"), "Import restore must recover exported comment.");
  assert(!restoredImportDraft.review_session_draft.human_review.note_cn.includes("临时覆盖"), "Import restore must remove temporary overwritten comment.");

  dispatchClick(elements, "queueNext");
  const queueV1Draft = parseDraft(elements);
  assert(queueV1Draft.review_session_draft.selected_queue_id === "queue-v1", "Queue next must select queue-v1 for isolation check.");
  assert(elements.get("humanComment").value.includes("参考版本"), "Queue-v1 form must keep its own comment.");
  assert(!elements.get("humanComment").value.includes("状态保持测试"), "Queue-v1 form must not inherit queue-v2 comment.");
  dispatchClick(elements, "queuePrev");
  const restoredQueueDraft = parseDraft(elements);
  assert(restoredQueueDraft.review_session_draft.selected_queue_id === "queue-v2", "Queue previous must restore queue-v2 after isolation check.");
  assert(elements.get("humanScore").value === "92", "Queue-v2 score must survive switching away and back.");
  assert(elements.get("humanComment").value.includes("状态保持测试"), "Queue-v2 comment must survive switching away and back.");
  assert(elements.get("humanApproved").checked === true, "Queue-v2 approval checkbox must survive switching away and back.");
  assert(elements.get("memoryApproval").value === "approved", "Queue-v2 memory approval must survive switching away and back.");

  dispatchClick(elements, "tplTextArtifact");
  const templatedDraft = parseDraft(elements);
  assert(templatedDraft.review_session_draft.human_review.note_cn.includes("疑似文字伪影"), "Template button must append Chinese review note.");
  assert(templatedDraft.review_session_draft.version_comparison.issues_cn.includes("疑似文字伪影"), "Template button must append issue text.");

  dispatchClick(elements, "quickAccept");

  const approvedDraft = parseDraft(elements);
  assert(approvedDraft.image_case_draft.asset_status === "accepted", "Approved asset status must become accepted.");
  assert(approvedDraft.image_case_draft.human_approval.approved === true, "Approved human approval must be true.");
  assert(approvedDraft.memory_delta_draft.write_mode === "confirmed", "Approved memory write mode must be confirmed.");
  assert(approvedDraft.memory_delta_draft.final_decision.should_write_to_vcp === true, "Approved memory write request must be true.");
  assert(approvedDraft.memory_completion_state_draft.write_requested === true, "Approved memory completion state must keep write requested true.");
  assert(approvedDraft.memory_completion_state_draft.write_authorized === true, "Approved memory completion state must record authorization.");
  assert(approvedDraft.memory_completion_state_draft.write_performed === false, "Approved memory completion state must stay no-write.");
  assert(elements.get("summarySessionStatus").textContent === "已批准", "Approved summary must show approved review status.");
  assert(elements.get("summaryAssetStatus").textContent === "可接受", "Approved summary must show accepted asset status.");
  assert(elements.get("summaryMemoryStatus").textContent === "已批准写入申请", "Approved summary must show approved memory status.");
  assert(elements.get("summaryWriteRequest").textContent === "已形成写入申请，仍未真实写入", "Approved summary must show write request without real write.");
  assert(elements.get("summaryNextAction").textContent === "可进入人工验货与后续写入授权", "Approved summary must show next action.");
  assert(approvedDraft.review_session_draft.next_action_cn === "可进入人工验货与后续写入授权", "Approved draft must include Chinese next action.");
  assert(approvedDraft.review_session_draft.acceptance_verdict.status_cn === "图像可接受，等待写入授权", "Approved draft must include write-authorization verdict.");
  assert(elements.get("memoryPreviewDecision").textContent === "已形成写入申请，仍未真实写入", "Approved memory preview must show write request without real write.");
  assert(elements.get("memoryCompletionRequested").textContent === "已形成写入请求", "Approved memory completion requested state must render.");
  assert(elements.get("memoryCompletionAuthorized").textContent === "已获得写入授权", "Approved memory completion authorization must render.");
  assert(elements.get("memoryCompletionPerformed").textContent === "尚未真实写入", "Approved memory completion performed state must stay false.");
  assert(elements.get("memoryCompletionLocationVerified").textContent === "目标位置未验证", "Approved memory completion location state must stay false.");
  assert(elements.get("memoryCompletionHashMatched").textContent === "写入哈希未匹配", "Approved memory completion hash state must stay false.");
  assert(
    elements.get("memoryCompletionPluginSufficient").textContent === "false（插件 success 不足以代表完成）",
    "Approved memory completion plugin sufficiency must stay false."
  );
  assert(approvedDraft.review_session_draft.review_preflight.accepted_has_human_approval === true, "Approved preflight must confirm human approval.");
  assert(approvedDraft.review_session_draft.review_preflight.prototype_guard_clean === true, "Approved preflight must confirm clean guard.");
  assert(runtimeGuard.guardIsClean(approvedDraft.prototype_guard), "Approved prototype guard must remain clean.");
  assert(runtimeGuard.guardIsClean(approvedDraft.review_session_draft.audit_log[0].prototype_guard), "Approved audit guard must remain clean.");

  dispatchClick(elements, "viewTechnical");
  assert(elements.get("readableDraft").hidden === true, "Readable draft must hide in technical view.");
  assert(elements.get("draftOutput").hidden === false, "Technical draft must show after switching views.");
  dispatchClick(elements, "viewReadable");
  assert(elements.get("readableDraft").hidden === false, "Readable draft must show after switching back.");

  dispatchClick(elements, "quickReject");
  const rejectedDraft = parseDraft(elements);
  assert(rejectedDraft.image_case_draft.asset_status === "rejected", "Reject quick action must set rejected asset status.");
  assert(rejectedDraft.memory_delta_draft.write_mode === "forbidden", "Reject quick action must forbid memory write mode.");

  elements.get("versionPicker").value = "v1";
  dispatchChange(elements, "versionPicker");
  elements.get("comparePicker").value = "";
  dispatchChange(elements, "comparePicker");
  const singleVersionDraft = parseDraft(elements);
  assert(singleVersionDraft.review_session_draft.current_version_id === "v1", "Version picker must update current_version_id.");
  assert(singleVersionDraft.review_session_draft.compare_version_id === null, "Empty compare picker must clear compare_version_id.");
  assert(singleVersionDraft.image_case_draft.output_assets[0].includes("accepted-image.placeholder"), "Output asset must follow selected version.");

  const badGuardDraft = runtimeGuard.clone(approvedDraft);
  badGuardDraft.prototype_guard.api_called = true;
  const badGuardAck = context.window.ImageLabHostBridge.submitDraft(badGuardDraft);
  assert(badGuardAck.accepted_by_host_mock === false, "Host mock must reject dirty prototype guard.");

  const badAuditGuardDraft = runtimeGuard.clone(approvedDraft);
  badAuditGuardDraft.review_session_draft.audit_log[0].prototype_guard.api_called = true;
  const badAuditGuardAck = context.window.ImageLabHostBridge.submitDraft(badAuditGuardDraft);
  assert(badAuditGuardAck.accepted_by_host_mock === false, "Host mock must reject dirty audit guard.");

  const badApprovalDraft = runtimeGuard.clone(approvedDraft);
  badApprovalDraft.image_case_draft.human_approval.approved = false;
  const badApprovalAck = context.window.ImageLabHostBridge.submitDraft(badApprovalDraft);
  assert(badApprovalAck.accepted_by_host_mock === false, "Host mock must reject accepted asset without approval.");

  const badDeliveryPackageDraft = runtimeGuard.clone(approvedDraft);
  badDeliveryPackageDraft.accepted_candidate_delivery_package_draft.submitDraft_called = true;
  const badDeliveryPackageAck = context.window.ImageLabHostBridge.submitDraft(badDeliveryPackageDraft);
  assert(badDeliveryPackageAck.accepted_by_host_mock === false, "Host mock must reject dirty delivery package draft.");

  const activeCapsuleDraft = runtimeGuard.clone(approvedDraft);
  activeCapsuleDraft.inactive_authorization_capsules_draft.capsules[0].authorization_status = "active";
  const activeCapsuleAck = context.window.ImageLabHostBridge.submitDraft(activeCapsuleDraft);
  assert(activeCapsuleAck.accepted_by_host_mock === false, "Host mock must reject activated authorization capsule draft.");

  const stateMismatchDraft = runtimeGuard.clone(approvedDraft);
  stateMismatchDraft.runtime_review_state_draft.mismatch_items_cn.push("测试矛盾。");
  const stateMismatchAck = context.window.ImageLabHostBridge.submitDraft(stateMismatchDraft);
  assert(stateMismatchAck.accepted_by_host_mock === false, "Host mock must reject runtime state mismatch draft.");

  const stagedCommitScopeDraft = runtimeGuard.clone(approvedDraft);
  stagedCommitScopeDraft.local_commit_scope_plan_draft.staged_changes_present = true;
  const stagedCommitScopeAck = context.window.ImageLabHostBridge.submitDraft(stagedCommitScopeDraft);
  assert(stagedCommitScopeAck.accepted_by_host_mock === false, "Host mock must reject staged commit-scope draft.");

  const dirtyBridgeRoundtripDraft = runtimeGuard.clone(approvedDraft);
  dirtyBridgeRoundtripDraft.bridge_mock_roundtrip_candidate_draft.bridge_calls_observed.submitDraft = 1;
  const dirtyBridgeRoundtripAck = context.window.ImageLabHostBridge.previewDraft(dirtyBridgeRoundtripDraft);
  assert(dirtyBridgeRoundtripAck.accepted_by_host_mock === false, "Host mock previewDraft must reject dirty bridge roundtrip draft.");

  const activeRealBridgeDraft = runtimeGuard.clone(approvedDraft);
  activeRealBridgeDraft.real_bridge_authorization_package_draft.authorization_status = "active";
  const activeRealBridgeAck = context.window.ImageLabHostBridge.previewDraft(activeRealBridgeDraft);
  assert(activeRealBridgeAck.accepted_by_host_mock === false, "Host mock previewDraft must reject active real bridge package.");

  const dirtyPromptReliabilityDraft = runtimeGuard.clone(approvedDraft);
  dirtyPromptReliabilityDraft.plugin_reliability_prompt_discipline_draft.max_plugin_calls_allowed = 1;
  const dirtyPromptReliabilityAck = context.window.ImageLabHostBridge.previewDraft(dirtyPromptReliabilityDraft);
  assert(dirtyPromptReliabilityAck.accepted_by_host_mock === false, "Host mock previewDraft must reject prompt reliability with plugin calls.");

  const dirtyMemoryCompletionCandidateDraft = runtimeGuard.clone(approvedDraft);
  dirtyMemoryCompletionCandidateDraft.memory_write_completion_candidate_draft.write_complete_declared = true;
  const dirtyMemoryCompletionCandidateAck = context.window.ImageLabHostBridge.previewDraft(dirtyMemoryCompletionCandidateDraft);
  assert(
    dirtyMemoryCompletionCandidateAck.accepted_by_host_mock === false,
    "Host mock previewDraft must reject memory completion candidate with completed write."
  );

  const dirtyGenerationRetryGateDraft = runtimeGuard.clone(approvedDraft);
  dirtyGenerationRetryGateDraft.single_real_generation_retry_gate_draft.plugin_calls_observed = 1;
  const dirtyGenerationRetryGateAck = context.window.ImageLabHostBridge.previewDraft(dirtyGenerationRetryGateDraft);
  assert(dirtyGenerationRetryGateAck.accepted_by_host_mock === false, "Host mock previewDraft must reject retry gate with observed plugin call.");

  const dirtyMemoryWriteAuthDraft = runtimeGuard.clone(approvedDraft);
  dirtyMemoryWriteAuthDraft.real_memory_write_authorization_package_draft.daily_note_called = true;
  const dirtyMemoryWriteAuthAck = context.window.ImageLabHostBridge.previewDraft(dirtyMemoryWriteAuthDraft);
  assert(dirtyMemoryWriteAuthAck.accepted_by_host_mock === false, "Host mock previewDraft must reject memory authorization with write call.");

  const dirtyAssetArchiveDraft = runtimeGuard.clone(approvedDraft);
  dirtyAssetArchiveDraft.asset_archive_candidate_draft.binary_storage_allowed = true;
  const dirtyAssetArchiveAck = context.window.ImageLabHostBridge.previewDraft(dirtyAssetArchiveDraft);
  assert(dirtyAssetArchiveAck.accepted_by_host_mock === false, "Host mock previewDraft must reject asset archive with binary storage.");

  elements.get("queueFilter").value = "all";
  dispatchChange(elements, "queueFilter");
  dispatchClick(elements, "batchSelectVisible");
  assert(elements.get("batchSelectedCount").textContent === "4 个", "Batch select visible must select all visible candidates.");
  assert(elements.get("queueList").children.every((child) => child.dataset.batchSelected === "true"), "Queue cards must expose batch-selected marker.");
  dispatchClick(elements, "batchMarkBlocked");
  const batchMarkedDraft = parseDraft(elements);
  assert(
    batchMarkedDraft.review_session_draft.review_queue.every((item) => item.risk_tags.includes("memory_unsuitable")),
    "Batch blocked action must tag selected candidates as memory unsuitable."
  );
  assert(elements.get("batchOperationStatus").textContent.includes("保留原评论"), "Batch action must report preserved comments.");
  const batchMarkedV2 = batchMarkedDraft.review_session_draft.review_queue.find((item) => item.queue_id === "queue-v2");
  assert(batchMarkedV2.human_note_cn.includes("状态保持测试"), "Batch action must preserve edited candidate comments.");
  assert(batchMarkedV2.human_note_cn.includes("批量备注"), "Batch action must append batch note instead of replacing comments.");
  dispatchClick(elements, "batchClearSelection");
  assert(elements.get("batchSelectedCount").textContent === "0 个", "Batch clear selection must clear selected candidates.");

  const result = {
    passed: true,
    initial: {
      asset_status: initialDraft.image_case_draft.asset_status,
      current_version_id: initialDraft.review_session_draft.current_version_id,
      compare_version_id: initialDraft.review_session_draft.compare_version_id,
      annotation_notes_count: initialDraft.review_session_draft.annotation_notes.length,
      memory_write_mode: initialDraft.memory_delta_draft.write_mode,
      memory_completion_requested: initialDraft.memory_completion_state_draft.write_requested,
      memory_completion_authorized: initialDraft.memory_completion_state_draft.write_authorized,
      host_ack: elements.get("hostStatus").textContent
    },
    summary: {
      initial_review_status_cn: "人工评审中",
      approved_review_status_cn: "已批准",
      write_request_cn: elements.get("summaryWriteRequest").textContent,
      guard_cn: elements.get("summaryGuard").textContent
    },
    preflight_checks: {
      human_comment_present: initialDraft.review_session_draft.review_preflight.human_comment_present,
      chinese_memory_content_detected: initialDraft.review_session_draft.review_preflight.chinese_memory_content_detected,
      accepted_has_human_approval: approvedDraft.review_session_draft.review_preflight.accepted_has_human_approval,
      real_write_performed: approvedDraft.review_session_draft.review_preflight.real_write_performed
    },
    quick_actions: {
      accept_sets_asset_accepted: approvedDraft.image_case_draft.asset_status === "accepted",
      reject_sets_memory_forbidden: rejectedDraft.memory_delta_draft.write_mode === "forbidden"
    },
    draft_view_switch: {
      technical_view_available: elements.get("draftOutput").textContent.includes("review_session_draft"),
      readable_view_cn: ["人工评审中", "已批准", "已拒收"].includes(elements.get("reviewCardStatus").textContent)
    },
    review_queue: {
      queue_count: initialDraft.review_session_draft.review_queue.length,
      filter_rejected_count: 1,
      search_filters_queue: true,
      score_sort_available: true,
      undo_restores_comment: true,
      queue_click_updates_selected_id: rejectedSelectionDraft.review_session_draft.selected_queue_id === "queue-v3",
      queue_click_updates_current_version: rejectedSelectionDraft.review_session_draft.current_version_id === "v3",
      queue_return_restores_current_version: returnedQueueDraft.review_session_draft.current_version_id === "v2",
      next_button_updates_current_version: nextQueueDraft.review_session_draft.current_version_id === "v1",
      previous_button_restores_current_version: previousQueueDraft.review_session_draft.current_version_id === "v2",
      progress_summary_visible: elements.get("queueProgress").textContent.includes("/"),
      independent_draft_state_present: initialDraft.review_session_draft.review_queue.every((item) => Boolean(item.draft_state)),
      draft_state_preserves_score: editedQueueV2.draft_state.score === 92,
      draft_state_preserves_comment: editedQueueV2.draft_state.human_note_cn.includes("状态保持测试"),
      switch_restore_preserves_comment: restoredQueueDraft.review_session_draft.human_review.note_cn.includes("状态保持测试")
    },
    batch_review_summary: {
      total_count: initialDraft.batch_review_summary_draft.counts.total_count,
      initial_write_request_count: initialDraft.batch_review_summary_draft.counts.write_request_count,
      updated_write_request_count: editedQueueDraft.batch_review_summary_draft.counts.write_request_count,
      blocked_count: initialDraft.batch_review_summary_draft.counts.blocked_count,
      write_request_filter_updates: updatedWriteRequestButtons.length === 2,
      blocked_filter_count: blockedQueueButtons.length,
      next_attention_filter_count: nextAttentionButtons.length,
      no_execution_guard_clean: runtimeGuard.guardIsClean(initialDraft.batch_review_summary_draft.no_execution_guard),
      no_real_write_cn: elements.get("batchSummary").textContent.includes("0 个真实写入")
    },
    batch_decision: {
      initial_decision: initialDraft.batch_decision_draft.decision,
      initial_authorizable_count: initialDraft.batch_decision_draft.authorizable_items.length,
      updated_authorizable_count: editedQueueDraft.batch_decision_draft.authorizable_items.length,
      preauthorization_package_draft_only:
        initialDraft.a5_preauthorization_review_package_draft.package_status === "draft_only",
      preauthorization_package_forbids_plugin:
        initialDraft.a5_preauthorization_review_package_draft.forbidden_operations_cn.includes("调用插件")
    },
    inactive_authorization_capsules: {
      authorization_status: initialDraft.inactive_authorization_capsules_draft.authorization_status,
      capsule_count: initialDraft.inactive_authorization_capsules_draft.capsule_count,
      activation_required: initialDraft.inactive_authorization_capsules_draft.capsules.every(
        (capsule) => capsule.activation_required === true
      ),
      no_execution_guard_clean: runtimeGuard.guardIsClean(initialDraft.inactive_authorization_capsules_draft.no_execution_guard)
    },
    runtime_review_state: {
      initial_convergence_status: initialDraft.runtime_review_state_draft.convergence_status,
      initial_asset_state_key: initialDraft.runtime_review_state_draft.normalized_state.asset_state_key,
      approved_asset_state_key: editedQueueDraft.runtime_review_state_draft.normalized_state.asset_state_key,
      mismatch_count: initialDraft.runtime_review_state_draft.mismatch_items_cn.length,
      memory_status_separate: editedQueueDraft.runtime_review_state_draft.normalized_state.memory_status === "approved"
    },
    local_commit_scope_plan: {
      plan_status: initialDraft.local_commit_scope_plan_draft.plan_status,
      staged_changes_present: initialDraft.local_commit_scope_plan_draft.staged_changes_present,
      commit_allowed: initialDraft.local_commit_scope_plan_draft.commit_allowed,
      push_allowed: initialDraft.local_commit_scope_plan_draft.push_allowed,
      scope_group_count: initialDraft.local_commit_scope_plan_draft.scope_groups.length
    },
    bridge_mock_roundtrip_candidate: {
      roundtrip_status: initialDraft.bridge_mock_roundtrip_candidate_draft.roundtrip_status,
      bridge_mode: initialDraft.bridge_mock_roundtrip_candidate_draft.bridge_mode,
      mock_only: initialDraft.bridge_mock_roundtrip_candidate_draft.bridge_calls_observed.mock_only,
      load_session_calls: initialDraft.bridge_mock_roundtrip_candidate_draft.bridge_calls_observed.loadSession,
      preview_draft_calls: initialDraft.bridge_mock_roundtrip_candidate_draft.bridge_calls_observed.previewDraft,
      submit_draft_calls: initialDraft.bridge_mock_roundtrip_candidate_draft.bridge_calls_observed.submitDraft,
      no_execution_guard_clean: runtimeGuard.guardIsClean(initialDraft.bridge_mock_roundtrip_candidate_draft.no_execution_guard)
    },
    real_bridge_authorization_package: {
      authorization_status: initialDraft.real_bridge_authorization_package_draft.authorization_status,
      allowed_methods: initialDraft.real_bridge_authorization_package_draft.allowed_methods,
      submitDraft_forbidden: initialDraft.real_bridge_authorization_package_draft.forbidden_methods.includes("submitDraft"),
      real_cdp_called: initialDraft.real_bridge_authorization_package_draft.real_cdp_called,
      production_bridge_invocation_performed:
        initialDraft.real_bridge_authorization_package_draft.production_bridge_invocation_performed
    },
    plugin_reliability_prompt_discipline: {
      reliability_status: initialDraft.plugin_reliability_prompt_discipline_draft.reliability_status,
      prompt_hash_present: initialDraft.plugin_reliability_prompt_discipline_draft.prompt_hash.startsWith("fnv1a32:"),
      max_plugin_calls_allowed: initialDraft.plugin_reliability_prompt_discipline_draft.max_plugin_calls_allowed,
      provider_capture_inactive:
        initialDraft.plugin_reliability_prompt_discipline_draft.provider_side_capture.authorization_status === "inactive_package",
      failure_taxonomy_count: initialDraft.plugin_reliability_prompt_discipline_draft.failure_taxonomy.length
    },
    memory_write_completion_candidate: {
      candidate_status: initialDraft.memory_write_completion_candidate_draft.candidate_status,
      plugin_success_sufficient:
        initialDraft.memory_write_completion_candidate_draft.completion_criteria.plugin_success_sufficient,
      writer_executed: initialDraft.memory_write_completion_candidate_draft.observed_state.writer_executed,
      canonical_target_exists: initialDraft.memory_write_completion_candidate_draft.observed_state.canonical_target_exists,
      write_complete_declared: initialDraft.memory_write_completion_candidate_draft.write_complete_declared
    },
    single_real_generation_retry_gate: {
      gate_status: initialDraft.single_real_generation_retry_gate_draft.gate_status,
      selected_plugin_id: initialDraft.single_real_generation_retry_gate_draft.selected_plugin_id,
      max_plugin_calls_per_run: initialDraft.single_real_generation_retry_gate_draft.max_plugin_calls_per_run,
      plugin_calls_observed: initialDraft.single_real_generation_retry_gate_draft.plugin_calls_observed,
      real_generation_performed: initialDraft.single_real_generation_retry_gate_draft.real_generation_performed
    },
    real_memory_write_authorization_package: {
      authorization_status: initialDraft.real_memory_write_authorization_package_draft.authorization_status,
      max_daily_note_writes: initialDraft.real_memory_write_authorization_package_draft.max_daily_note_writes,
      max_vcp_memory_writes: initialDraft.real_memory_write_authorization_package_draft.max_vcp_memory_writes,
      daily_note_called: initialDraft.real_memory_write_authorization_package_draft.daily_note_called,
      no_success_fabrication_rule: initialDraft.real_memory_write_authorization_package_draft.no_success_fabrication_rule
    },
    asset_archive_candidate: {
      archive_status: initialDraft.asset_archive_candidate_draft.archive_status,
      asset_status_classification: initialDraft.asset_archive_candidate_draft.asset_status_classification,
      binary_storage_allowed: initialDraft.asset_archive_candidate_draft.binary_storage_allowed,
      closeout_template_count: initialDraft.asset_archive_candidate_draft.closeout_templates.length
    },
    accepted_candidate_delivery_package: {
      package_status: initialDraft.accepted_candidate_delivery_package_draft.package_status,
      submitDraft_called: initialDraft.accepted_candidate_delivery_package_draft.submitDraft_called,
      sanitized_asset_hash_present:
        initialDraft.accepted_candidate_delivery_package_draft.sanitized_asset_hash.startsWith("fnv1a32:"),
      memory_delta_preview_present: Boolean(initialDraft.accepted_candidate_delivery_package_draft.memory_delta_preview.body_cn),
      approved_readiness: editedQueueDraft.accepted_candidate_delivery_package_draft.delivery_readiness,
      no_execution_guard_clean:
        runtimeGuard.guardIsClean(initialDraft.accepted_candidate_delivery_package_draft.no_execution_guard)
    },
    human_override_traceability: {
      package_status: initialDraft.human_override_traceability_draft.package_status,
      prompt_compliance_complete: initialDraft.human_override_traceability_draft.prompt_compliance_complete,
      override_recorded_after_approval: editedQueueDraft.human_override_traceability_draft.override_performed,
      memory_suitable_after_approval: editedQueueDraft.human_override_traceability_draft.memory_suitable,
      traceability_item_count: editedQueueDraft.human_override_traceability_draft.traceability_items.length,
      traceability_counts: editedQueueDraft.human_override_traceability_draft.traceability_counts,
      no_execution_guard_clean: runtimeGuard.guardIsClean(initialDraft.human_override_traceability_draft.no_execution_guard)
    },
    session_transfer: {
      export_format: exportedSessionPayload.export_format,
      fingerprint_present: exportedSessionPayload.session_fingerprint.startsWith("fnv1a32:"),
      stale_fingerprint_rejected: true,
      import_preview_available: elements.get("importPreviewStatus").textContent.includes("候选"),
      dirty_guard_rejected: dirtySessionGuardRejected,
      import_restores_comment: restoredImportDraft.review_session_draft.human_review.note_cn.includes("状态保持测试")
    },
    risk_review: {
      risk_blocks_preauthorization: riskBlockedQueueV2.preauthorization_status === "blocked",
      risk_write_request_count: riskBlockedDraft.batch_review_summary_draft.counts.write_request_count,
      risk_group_count: riskBlockedDraft.a5_preauthorization_review_package_draft.risk_grouped_items.length
    },
    batch_actions: {
      batch_marked_count: batchMarkedDraft.review_session_draft.review_queue.length,
      batch_note_preserved: batchMarkedV2.human_note_cn.includes("状态保持测试"),
      selection_clear_works: elements.get("batchSelectedCount").textContent === "0 个"
    },
    adapter_handoff: {
      execution_blocked: initialDraft.adapter_dry_run_handoff_draft.execution_blocked,
      max_plugin_calls: initialDraft.adapter_dry_run_handoff_draft.max_plugin_calls,
      plugin_call_forbidden: initialDraft.adapter_dry_run_handoff_draft.forbidden_actions_cn.includes("调用插件")
    },
    approved: {
      asset_status: approvedDraft.image_case_draft.asset_status,
      memory_write_mode: approvedDraft.memory_delta_draft.write_mode,
      should_write_to_vcp: approvedDraft.memory_delta_draft.final_decision.should_write_to_vcp,
      memory_completion_requested: approvedDraft.memory_completion_state_draft.write_requested,
      memory_completion_authorized: approvedDraft.memory_completion_state_draft.write_authorized,
      memory_completion_performed: approvedDraft.memory_completion_state_draft.write_performed
    },
    version_selection: {
      current_version_id_updates: singleVersionDraft.review_session_draft.current_version_id === "v1",
      compare_version_can_clear: singleVersionDraft.review_session_draft.compare_version_id === null,
      output_asset_follows_selected_version: singleVersionDraft.image_case_draft.output_assets[0].includes("accepted-image.placeholder")
    },
    rejection_checks: {
      dirty_guard_rejected: badGuardAck.accepted_by_host_mock === false,
      dirty_audit_guard_rejected: badAuditGuardAck.accepted_by_host_mock === false,
      accepted_without_approval_rejected: badApprovalAck.accepted_by_host_mock === false,
      delivery_package_submit_rejected: badDeliveryPackageAck.accepted_by_host_mock === false,
      active_authorization_capsule_rejected: activeCapsuleAck.accepted_by_host_mock === false,
      runtime_state_mismatch_rejected: stateMismatchAck.accepted_by_host_mock === false,
      staged_commit_scope_rejected: stagedCommitScopeAck.accepted_by_host_mock === false,
      dirty_bridge_roundtrip_rejected: dirtyBridgeRoundtripAck.accepted_by_host_mock === false,
      active_real_bridge_package_rejected: activeRealBridgeAck.accepted_by_host_mock === false,
      dirty_prompt_reliability_rejected: dirtyPromptReliabilityAck.accepted_by_host_mock === false,
      dirty_memory_completion_candidate_rejected: dirtyMemoryCompletionCandidateAck.accepted_by_host_mock === false
    },
    runtime_contract: {
      script_order: scriptOrder,
      script_order_verified: true,
      runtime_guard_api_verified: true
    },
    prototype_guard_clean: runtimeGuard.guardIsClean(approvedDraft.prototype_guard)
  };

  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
}
