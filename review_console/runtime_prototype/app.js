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
  if (
    !hostBridge ||
    typeof hostBridge.loadSession !== "function" ||
    typeof hostBridge.previewDraft !== "function" ||
    typeof hostBridge.submitDraft !== "function"
  ) {
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
  authCapsuleStatus: document.getElementById("authCapsuleStatus"),
  authCapsuleCount: document.getElementById("authCapsuleCount"),
  authCapsuleBoundary: document.getElementById("authCapsuleBoundary"),
  authCapsuleTypes: document.getElementById("authCapsuleTypes"),
  authCapsuleForbidden: document.getElementById("authCapsuleForbidden"),
  authCapsuleSanitization: document.getElementById("authCapsuleSanitization"),
  authCapsuleRollback: document.getElementById("authCapsuleRollback"),
  authCapsuleText: document.getElementById("authCapsuleText"),
  deliveryPackageStatus: document.getElementById("deliveryPackageStatus"),
  deliveryPackageCandidate: document.getElementById("deliveryPackageCandidate"),
  deliveryPackageHash: document.getElementById("deliveryPackageHash"),
  deliveryPackageScoreBand: document.getElementById("deliveryPackageScoreBand"),
  deliveryPackageRisk: document.getElementById("deliveryPackageRisk"),
  deliveryPackageHumanApproval: document.getElementById("deliveryPackageHumanApproval"),
  deliveryPackageMemoryPreview: document.getElementById("deliveryPackageMemoryPreview"),
  deliveryPackageRules: document.getElementById("deliveryPackageRules"),
  deliveryPackageBoundary: document.getElementById("deliveryPackageBoundary"),
  overrideDecisionSource: document.getElementById("overrideDecisionSource"),
  overrideReason: document.getElementById("overrideReason"),
  overrideDeviation: document.getElementById("overrideDeviation"),
  overridePromptCompliance: document.getElementById("overridePromptCompliance"),
  overrideMemorySuitability: document.getElementById("overrideMemorySuitability"),
  overrideBoundary: document.getElementById("overrideBoundary"),
  traceabilityTotal: document.getElementById("traceabilityTotal"),
  traceabilityAccepted: document.getElementById("traceabilityAccepted"),
  traceabilityAcceptedCandidate: document.getElementById("traceabilityAcceptedCandidate"),
  traceabilityHumanOverride: document.getElementById("traceabilityHumanOverride"),
  traceabilityRejected: document.getElementById("traceabilityRejected"),
  traceabilityNeedsHumanReview: document.getElementById("traceabilityNeedsHumanReview"),
  traceabilityPromptComplete: document.getElementById("traceabilityPromptComplete"),
  traceabilityMemorySuitable: document.getElementById("traceabilityMemorySuitable"),
  traceabilitySummary: document.getElementById("traceabilitySummary"),
  traceabilityBoundary: document.getElementById("traceabilityBoundary"),
  traceabilityList: document.getElementById("traceabilityList"),
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
  memoryCompletionRequested: document.getElementById("memoryCompletionRequested"),
  memoryCompletionAuthorized: document.getElementById("memoryCompletionAuthorized"),
  memoryCompletionPerformed: document.getElementById("memoryCompletionPerformed"),
  memoryCompletionLocationVerified: document.getElementById("memoryCompletionLocationVerified"),
  memoryCompletionHashMatched: document.getElementById("memoryCompletionHashMatched"),
  memoryCompletionPluginSufficient: document.getElementById("memoryCompletionPluginSufficient"),
  memoryCompletionBoundary: document.getElementById("memoryCompletionBoundary"),
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
  runtimeStateUnified: document.getElementById("runtimeStateUnified"),
  runtimeStateAsset: document.getElementById("runtimeStateAsset"),
  runtimeStateMemory: document.getElementById("runtimeStateMemory"),
  runtimeStateDelivery: document.getElementById("runtimeStateDelivery"),
  runtimeStateOverride: document.getElementById("runtimeStateOverride"),
  runtimeStateMismatches: document.getElementById("runtimeStateMismatches"),
  runtimeStateBoundary: document.getElementById("runtimeStateBoundary"),
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
  commitScopeStatus: document.getElementById("commitScopeStatus"),
  commitScopeBranch: document.getElementById("commitScopeBranch"),
  commitScopeStaged: document.getElementById("commitScopeStaged"),
  commitScopeRemote: document.getElementById("commitScopeRemote"),
  commitScopeRuntime: document.getElementById("commitScopeRuntime"),
  commitScopeValidators: document.getElementById("commitScopeValidators"),
  commitScopeDocs: document.getElementById("commitScopeDocs"),
  commitScopeAgentBoard: document.getElementById("commitScopeAgentBoard"),
  commitScopeUntracked: document.getElementById("commitScopeUntracked"),
  commitScopeRollback: document.getElementById("commitScopeRollback"),
  bridgeRoundtripStatus: document.getElementById("bridgeRoundtripStatus"),
  bridgeRoundtripMethods: document.getElementById("bridgeRoundtripMethods"),
  bridgeRoundtripCalls: document.getElementById("bridgeRoundtripCalls"),
  bridgeRoundtripAck: document.getElementById("bridgeRoundtripAck"),
  bridgeRoundtripGuards: document.getElementById("bridgeRoundtripGuards"),
  bridgeRoundtripBoundary: document.getElementById("bridgeRoundtripBoundary"),
  realBridgeAuthStatus: document.getElementById("realBridgeAuthStatus"),
  realBridgeAuthMethods: document.getElementById("realBridgeAuthMethods"),
  realBridgeAuthRequired: document.getElementById("realBridgeAuthRequired"),
  realBridgeAuthForbidden: document.getElementById("realBridgeAuthForbidden"),
  realBridgeAuthBoundary: document.getElementById("realBridgeAuthBoundary"),
  promptReliabilityStatus: document.getElementById("promptReliabilityStatus"),
  promptReliabilityHash: document.getElementById("promptReliabilityHash"),
  promptReliabilityRules: document.getElementById("promptReliabilityRules"),
  promptReliabilityFailures: document.getElementById("promptReliabilityFailures"),
  promptReliabilityBoundary: document.getElementById("promptReliabilityBoundary"),
  memoryCompletionCandidateStatus: document.getElementById("memoryCompletionCandidateStatus"),
  memoryCompletionCandidateCriteria: document.getElementById("memoryCompletionCandidateCriteria"),
  memoryCompletionCandidateObserved: document.getElementById("memoryCompletionCandidateObserved"),
  memoryCompletionCandidateFailures: document.getElementById("memoryCompletionCandidateFailures"),
  memoryCompletionCandidateBoundary: document.getElementById("memoryCompletionCandidateBoundary"),
  generationRetryGateStatus: document.getElementById("generationRetryGateStatus"),
  generationRetryGatePlugin: document.getElementById("generationRetryGatePlugin"),
  generationRetryGatePrompt: document.getElementById("generationRetryGatePrompt"),
  generationRetryGateGuards: document.getElementById("generationRetryGateGuards"),
  generationRetryGateAuthorization: document.getElementById("generationRetryGateAuthorization"),
  generationRetryGateBoundary: document.getElementById("generationRetryGateBoundary"),
  memoryWriteAuthStatus: document.getElementById("memoryWriteAuthStatus"),
  memoryWriteAuthCounts: document.getElementById("memoryWriteAuthCounts"),
  memoryWriteAuthRules: document.getElementById("memoryWriteAuthRules"),
  memoryWriteAuthReject: document.getElementById("memoryWriteAuthReject"),
  memoryWriteAuthBoundary: document.getElementById("memoryWriteAuthBoundary"),
  assetArchiveCandidateStatus: document.getElementById("assetArchiveCandidateStatus"),
  assetArchiveCandidateFields: document.getElementById("assetArchiveCandidateFields"),
  assetArchiveCandidateCloseouts: document.getElementById("assetArchiveCandidateCloseouts"),
  assetArchiveCandidateBoundary: document.getElementById("assetArchiveCandidateBoundary"),
  draftOutput: document.getElementById("draftOutput"),
  // v6 Product Runtime
  v6TaskId: document.getElementById("v6TaskId"),
  v6TaskGoalInput: document.getElementById("v6TaskGoalInput"),
  v6TaskStageSelect: document.getElementById("v6TaskStageSelect"),
  v6TaskOwnerSelect: document.getElementById("v6TaskOwnerSelect"),
  v6TaskNextInput: document.getElementById("v6TaskNextInput"),
  v6TaskBlockedInput: document.getElementById("v6TaskBlockedInput"),
  v6TaskSessionInput: document.getElementById("v6TaskSessionInput"),
  v6TaskGuard: document.getElementById("v6TaskGuard"),
  v6TaskStage: document.getElementById("v6TaskStage"),
  v6TaskOwner: document.getElementById("v6TaskOwner"),
  v6AssetRef: document.getElementById("v6AssetRef"),
  v6AssetHash: document.getElementById("v6AssetHash"),
  v6AssetStatus: document.getElementById("v6AssetStatus"),
  v6AssetScore: document.getElementById("v6AssetScore"),
  v6AssetDecision: document.getElementById("v6AssetDecision"),
  v6AssetMemorySuitability: document.getElementById("v6AssetMemorySuitability"),
  v6AssetCaseId: document.getElementById("v6AssetCaseId"),
  v6AssetCount: document.getElementById("v6AssetCount"),
  v6SessionId: document.getElementById("v6SessionId"),
  v6SessionFingerprint: document.getElementById("v6SessionFingerprint"),
  v6SessionDraftOnly: document.getElementById("v6SessionDraftOnly"),
  v6SessionSideEffects: document.getElementById("v6SessionSideEffects"),
  v6SessionExportable: document.getElementById("v6SessionExportable"),
  v6SessionImportCompatible: document.getElementById("v6SessionImportCompatible"),
  v6SessionTaskId: document.getElementById("v6SessionTaskId"),
  v6SessionAssetRefs: document.getElementById("v6SessionAssetRefs"),
  // v6.3 Session Store Interaction
  v6SessionTaskIdInput: document.getElementById("v6SessionTaskIdInput"),
  v6SessionAssetRefsInput: document.getElementById("v6SessionAssetRefsInput"),
  v6SessionImportStatusSelect: document.getElementById("v6SessionImportStatusSelect"),
  v6SessionReasonInput: document.getElementById("v6SessionReasonInput"),
  v6SessionRestoreCheck: document.getElementById("v6SessionRestoreCheck"),
  v6SessionTaskIdRead: document.getElementById("v6SessionTaskIdRead"),
  v6SessionAssetRefsRead: document.getElementById("v6SessionAssetRefsRead"),
  v6SessionImportStatusRead: document.getElementById("v6SessionImportStatusRead"),
  v6SessionReasonRead: document.getElementById("v6SessionReasonRead"),
  v6SessionRestoreRead: document.getElementById("v6SessionRestoreRead"),
  v6SessionListCount: document.getElementById("v6SessionListCount"),
  v6SessionVisibleCount: document.getElementById("v6SessionVisibleCount"),
  // v6.2 Asset Index Interaction
  v6AssetFilterSelect: document.getElementById("v6AssetFilterSelect"),
  v6AssetFilterCount: document.getElementById("v6AssetFilterCount"),
  v6AssetEntryId: document.getElementById("v6AssetEntryId"),
  v6AssetRefInput: document.getElementById("v6AssetRefInput"),
  v6AssetHashInput: document.getElementById("v6AssetHashInput"),
  v6AssetStatusSelect: document.getElementById("v6AssetStatusSelect"),
  v6AssetScoreInput: document.getElementById("v6AssetScoreInput"),
  v6AssetDecisionSelect: document.getElementById("v6AssetDecisionSelect"),
  v6AssetMemorySelect: document.getElementById("v6AssetMemorySelect"),
  v6AssetCaseInput: document.getElementById("v6AssetCaseInput"),
  v6AssetRefRead: document.getElementById("v6AssetRefRead"),
  v6AssetHashRead: document.getElementById("v6AssetHashRead"),
  v6AssetStatusRead: document.getElementById("v6AssetStatusRead"),
  v6AssetScoreRead: document.getElementById("v6AssetScoreRead"),
  v6AssetDecisionRead: document.getElementById("v6AssetDecisionRead"),
  v6AssetMemoryRead: document.getElementById("v6AssetMemoryRead"),
  v6AssetCaseRead: document.getElementById("v6AssetCaseRead"),
  v6AssetVisibleCount: document.getElementById("v6AssetVisibleCount"),
  // v6.4 Memory Queue Interaction
  v6MQMemoryItemId: document.getElementById("v6MQMemoryItemId"),
  v6MQLinkedTaskId: document.getElementById("v6MQLinkedTaskId"),
  v6MQLinkedAssetRef: document.getElementById("v6MQLinkedAssetRef"),
  v6MQLinkedSessionId: document.getElementById("v6MQLinkedSessionId"),
  v6MQDiaryTitle: document.getElementById("v6MQDiaryTitle"),
  v6MQDiaryPreview: document.getElementById("v6MQDiaryPreview"),
  v6MQApprovalSelect: document.getElementById("v6MQApprovalSelect"),
  v6MQReviewerRoleSelect: document.getElementById("v6MQReviewerRoleSelect"),
  v6MQShouldWriteCheck: document.getElementById("v6MQShouldWriteCheck"),
  v6MQBlockReasonInput: document.getElementById("v6MQBlockReasonInput"),
  v6MQRejectReasonInput: document.getElementById("v6MQRejectReasonInput"),
  v6MQMemoryItemIdRead: document.getElementById("v6MQMemoryItemIdRead"),
  v6MQLinkedTaskIdRead: document.getElementById("v6MQLinkedTaskIdRead"),
  v6MQLinkedAssetRefRead: document.getElementById("v6MQLinkedAssetRefRead"),
  v6MQLinkedSessionIdRead: document.getElementById("v6MQLinkedSessionIdRead"),
  v6MQApprovalRead: document.getElementById("v6MQApprovalRead"),
  v6MQReviewerRoleRead: document.getElementById("v6MQReviewerRoleRead"),
  v6MQShouldWriteRead: document.getElementById("v6MQShouldWriteRead"),
  v6MQWriteAuthorizedRead: document.getElementById("v6MQWriteAuthorizedRead"),
  v6MQWritePerformedRead: document.getElementById("v6MQWritePerformedRead"),
  v6MQCanonicalLocationRead: document.getElementById("v6MQCanonicalLocationRead"),
  v6MQCountTotal: document.getElementById("v6MQCountTotal"),
  v6MQCountPending: document.getElementById("v6MQCountPending"),
  v6MQCountApproved: document.getElementById("v6MQCountApproved"),
  v6MQCountRejected: document.getElementById("v6MQCountRejected"),
  v6MQCountBlocked: document.getElementById("v6MQCountBlocked"),
  v6MQBoundaryText: document.getElementById("v6MQBoundaryText"),
  v6DispatchId: document.getElementById("v6DispatchId"),
  v6DispatchSelectPlugin: document.getElementById("v6DispatchSelectPlugin"),
  v6DispatchPluginName: document.getElementById("v6DispatchPluginName"),
  v6DispatchInputMode: document.getElementById("v6DispatchInputMode"),
  v6DispatchOutputMode: document.getElementById("v6DispatchOutputMode"),
  v6DispatchFallbackDisplay: document.getElementById("v6DispatchFallbackDisplay"),
  v6DispatchReasonCn: document.getElementById("v6DispatchReasonCn"),
  v6DispatchParamKey: document.getElementById("v6DispatchParamKey"),
  v6DispatchParamValue: document.getElementById("v6DispatchParamValue"),
  v6DispatchExpectedOutputs: document.getElementById("v6DispatchExpectedOutputs"),
  v6DispatchMaxOutputs: document.getElementById("v6DispatchMaxOutputs"),
  v6DispatchPreview: document.getElementById("v6DispatchPreview"),
  v6DispatchDryRunRequired: document.getElementById("v6DispatchDryRunRequired"),
  v6DispatchExecBlocked: document.getElementById("v6DispatchExecBlocked"),
  v6DispatchMaxCalls: document.getElementById("v6DispatchMaxCalls"),
  v6DispatchAllowWrite: document.getElementById("v6DispatchAllowWrite"),
  v6DispatchAllowBinary: document.getElementById("v6DispatchAllowBinary"),
  v6DispatchRiskLevel: document.getElementById("v6DispatchRiskLevel"),
  v6DispatchForbiddenDisplay: document.getElementById("v6DispatchForbiddenDisplay"),
  v6DispatchLinkedTaskId: document.getElementById("v6DispatchLinkedTaskId"),
  v6DispatchGatekeeperRequired: document.getElementById("v6DispatchGatekeeperRequired"),
  v6DispatchGatekeeperStatus: document.getElementById("v6DispatchGatekeeperStatus"),
  v6DispatchStatus: document.getElementById("v6DispatchStatus"),
  v6DispatchTraceState: document.getElementById("v6DispatchTraceState"),
  v6DispatchBoundaryText: document.getElementById("v6DispatchBoundaryText")
};

let activeDraftView = "readable";
let selectedBatchQueueIds = new Set();
let batchOperationStatusText = "尚未执行批量操作。";
let sessionTransferStatusText = "尚未导出或导入复核会话。";
let historyStatusText = "尚未产生可撤销操作。";
let historyStack = [];

// Plugin Dashboard — local draft-only plugin candidates (not real directory scan)
const pluginCandidates = [
  { plugin_id: "DoubaoGen", display_name: "DoubaoGen", input_mode: "text_image", output_mode: "image" },
  { plugin_id: "GPTImageGen", display_name: "GPTImageGen", input_mode: "text_image", output_mode: "image" },
  { plugin_id: "AgentImageLabAdapter", display_name: "Agent Image Lab Adapter", input_mode: "plan", output_mode: "review" }
];
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
  { key: "write_request", label_cn: "写入申请草案", explanation_cn: "已形成写入申请草案，但没有真实写入 DailyNote/VCP memory。" },
  { key: "accepted_candidate", label_cn: "已接受候选", explanation_cn: "候选已进入可接受的交付草案，但仍保持 no-write 和可追踪状态。" },
  { key: "delivery_package", label_cn: "交付包草案", explanation_cn: "汇总候选引用、脱敏哈希、评分、风险、人工批准和记忆预览，仍不执行写入。" },
  { key: "human_override", label_cn: "人工覆盖轨迹", explanation_cn: "记录人工接受来源、覆盖理由、已知偏差、prompt 符合度和是否适合进入记忆。" },
  { key: "inactive_package", label_cn: "未激活授权包", explanation_cn: "未来真实动作的可复核模板；没有用户单独激活前不能执行。" },
  { key: "runtime_state_converged", label_cn: "运行状态已收敛", explanation_cn: "资产、记忆、交付和人工覆盖状态被拆分展示，且没有互相矛盾。" },
  { key: "commit_scope_plan", label_cn: "提交范围计划", explanation_cn: "只描述本地待提交范围，不 stage、不 commit、不 tag、不 push。" },
  { key: "bridge_mock_roundtrip", label_cn: "Bridge mock 回环", explanation_cn: "只用项目内 mock 证明 loadSession 到 previewDraft 的无写入回执，不调用真实 VCPChat/CDP。" },
  { key: "real_bridge_authorization", label_cn: "真实 Bridge 授权包", explanation_cn: "只准备未来真实 bridge 调用授权模板，未激活前不能启动 VCPChat、CDP 或 bridge。" },
  { key: "prompt_reliability", label_cn: "Prompt 可靠性", explanation_cn: "把 prompt registry、lint、模型锁和失败分类变成可验证本地草案，不调用插件。" },
  { key: "memory_completion_candidate", label_cn: "记忆完成候选", explanation_cn: "把真实记忆写入完成判定拆成请求、授权、执行、canonical 位置和哈希匹配，不真实写入。" },
  { key: "generation_retry_gate", label_cn: "真实重试授权门", explanation_cn: "只准备未来单插件单次真实生成重试的授权模板，当前不调用插件、不创建图片。" },
  { key: "memory_write_authorization", label_cn: "真实记忆写入授权包", explanation_cn: "只准备未来 DailyNote/VCP memory 单写授权模板，当前不执行写入。" },
  { key: "asset_archive_candidate", label_cn: "资产归档候选", explanation_cn: "只归档资产 ref、hash、评分、摘要和规则，不保存图片二进制。" }
];

const inactiveAuthorizationCapsuleDefinitions = Object.freeze([
  {
    type: "real_generation_retry",
    title_cn: "真实生图重试授权胶囊",
    allowed_actions_cn: ["单插件单次真实生成", "受控输出目录 ref", "失败时仅删除本次新建输出文件"],
    forbidden_actions_cn: ["多次插件调用", "覆盖既有文件", "未审片直接写记忆"],
    max_call_counts: { plugin_calls: 1, bridge_calls: 0, daily_note_writes: 0, vcp_memory_writes: 0 }
  },
  {
    type: "memory_write",
    title_cn: "DailyNote / VCP memory 写入授权胶囊",
    allowed_actions_cn: ["中文脱敏正文写入申请", "最多一次 DailyNote 写入", "最多一次 VCP memory 写入"],
    forbidden_actions_cn: ["图片二进制写入记忆", "raw plugin output 写入记忆", "未验证 canonical 位置就标记完成"],
    max_call_counts: { plugin_calls: 0, bridge_calls: 0, daily_note_writes: 1, vcp_memory_writes: 1 }
  },
  {
    type: "vcpchat_bridge_call",
    title_cn: "VCPChat bridge 调用授权胶囊",
    allowed_actions_cn: ["cancel", "loadSession", "previewDraft"],
    forbidden_actions_cn: ["submitDraft", "保存 raw CDP endpoint", "保存 raw IPC payload"],
    max_call_counts: { plugin_calls: 0, bridge_calls: 3, daily_note_writes: 0, vcp_memory_writes: 0 }
  },
  {
    type: "provider_prompt_fingerprint_capture",
    title_cn: "Provider-side prompt fingerprint 捕获授权胶囊",
    allowed_actions_cn: ["脱敏 prompt 指纹", "脱敏模型匹配摘要", "零插件调用诊断"],
    forbidden_actions_cn: ["保存 raw request body", "保存 endpoint", "保存 token/cookie/password"],
    max_call_counts: { plugin_calls: 0, bridge_calls: 0, daily_note_writes: 0, vcp_memory_writes: 0 }
  },
  {
    type: "version_action",
    title_cn: "commit / tag / push / PR 版本动作授权胶囊",
    allowed_actions_cn: ["按文件组 stage", "本地 commit", "显式授权后 tag/push/PR"],
    forbidden_actions_cn: ["git add .", "force push", "release 发布"],
    max_call_counts: { plugin_calls: 0, bridge_calls: 0, daily_note_writes: 0, vcp_memory_writes: 0 }
  }
]);

const sharedForbiddenOutputsCn = Object.freeze([
  "raw local path",
  "raw endpoint",
  "raw websocket url",
  "raw runtime log",
  "raw IPC payload",
  "raw plugin output",
  "raw source code",
  "secret / token / cookie / password",
  "customer private data",
  "image binary in Git or memory"
]);

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

function memoryCompletionStateLabel(shouldWrite) {
  return shouldWrite ? "已形成写入请求" : "尚未形成写入请求";
}

function memoryAuthorizationStateLabel(isAuthorized) {
  return isAuthorized ? "已获得写入授权" : "尚未获得写入授权";
}

function memoryExecutionStateLabel(isPerformed) {
  return isPerformed ? "已真实写入" : "尚未真实写入";
}

function pluginSuccessSufficientLabel(isSufficient) {
  return isSufficient ? "true（错误）" : "false（插件 success 不足以代表完成）";
}

function buildMemoryCompletionState(memoryContent, memoryApproval) {
  const writeRequested = memoryContent.trim().length > 0;
  const writeAuthorized = memoryApproval.status === "approved";
  return {
    write_requested: writeRequested,
    write_authorized: writeAuthorized,
    write_performed: false,
    canonical_location_verified: false,
    canonical_hash_matched: false,
    plugin_success_sufficient: false,
    write_requested_cn: memoryCompletionStateLabel(writeRequested),
    write_authorized_cn:
      writeAuthorized
        ? memoryAuthorizationStateLabel(true)
        : memoryApproval.status === "rejected"
          ? "写入授权已拒绝"
          : memoryAuthorizationStateLabel(false),
    write_performed_cn: memoryExecutionStateLabel(false),
    canonical_location_verified_cn: "目标位置未验证",
    canonical_hash_matched_cn: "写入哈希未匹配",
    plugin_success_sufficient_cn: pluginSuccessSufficientLabel(false),
    boundary_cn: "当前只拆分写入请求、授权、执行与校验，不执行真实写入。"
  };
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

function buildInactiveAuthorizationCapsulesDraft({ createdAt, batchDecision, batchSummary, riskSummary }) {
  const candidateLinks = batchDecision.authorizable_items.map((item) => ({
    queue_id: item.queue_id,
    version_id: item.version_id,
    title_cn: item.title_cn,
    status_cn: item.status_cn
  }));
  const capsules = inactiveAuthorizationCapsuleDefinitions.map((definition, index) => {
    const capsuleId = `inactive-auth-${definition.type}-${String(index + 1).padStart(2, "0")}`;
    return {
      capsule_id: capsuleId,
      capsule_type: definition.type,
      title_cn: definition.title_cn,
      authorization_status: "inactive_package",
      activation_required: true,
      activation_rule_cn: "必须由用户在新消息中明确激活；本地草案不能自动升级为真实授权。",
      candidate_refs: candidateLinks,
      allowed_actions_cn: definition.allowed_actions_cn,
      forbidden_actions_cn: [...definition.forbidden_actions_cn, ...sharedForbiddenOutputsCn],
      max_call_counts: definition.max_call_counts,
      rollback_plan_cn:
        "只允许回滚本次胶囊对应的新建本地草案或本次运行新建输出；禁止破坏用户已有工作，禁止跨目录删除。",
      sanitization_rules_cn: [
        "仓库、记忆、PR 文本和交接文档只保存脱敏 ref。",
        "不得保存 raw 路径、endpoint、websocket、runtime log、IPC payload、插件输出、源码片段或密钥。",
        "不得把图片二进制写入 Git、DailyNote 或 VCP memory。"
      ],
      execution_flags: {
        bridge_called: false,
        plugin_called: false,
        api_called: false,
        daily_note_called: false,
        vcp_memory_written: false,
        image_created: false,
        commit_performed: false,
        tag_performed: false,
        push_performed: false,
        pr_created: false,
        release_created: false
      },
      no_execution_guard: runtimeGuard.clone(runtimeGuard.cleanGuard)
    };
  });
  return {
    package_status: "draft_only",
    authorization_status: "inactive_package",
    created_at: createdAt,
    capsule_count: capsules.length,
    candidate_count: candidateLinks.length,
    batch_decision_cn: batchDecision.decision_cn,
    risk_summary_cn: riskSummary.report_cn,
    preflight_result_cn: batchSummary.preflight.result_cn,
    capsules,
    forbidden_outputs_cn: sharedForbiddenOutputsCn,
    activation_boundary_cn:
      "这些只是未激活授权胶囊。它们把未来真实动作变成可审查模板，但不会调用 bridge、插件、API、DailyNote、VCP memory、图片生成或远端版本动作。",
    side_effects_performed: false,
    no_execution_guard: runtimeGuard.clone(runtimeGuard.cleanGuard)
  };
}

function humanDecisionSourceForItem(item) {
  if (item.asset_status === "accepted" && item.human_approved === true) return "human_review_override";
  if (item.asset_status === "candidate" && item.human_approved === true) return "human_review_candidate_accept";
  if (item.asset_status === "rejected") return "human_review_reject";
  return "human_review_pending";
}

function traceabilityClassForItem(item, riskSummary) {
  const hasDeviation =
    Boolean((item.issues_cn || "").trim()) ||
    Boolean((item.annotation_note_cn || "").trim()) ||
    riskSummary.high_risk_tags.length > 0;
  if (item.asset_status === "rejected") {
    return {
      key: "rejected",
      label_cn: "已拒收",
      reason_cn: "已拒收候选，不能进入交付或记忆写入。"
    };
  }
  if (item.asset_status === "accepted" && item.human_approved === true) {
    if (hasDeviation) {
      return {
        key: "human_override",
        label_cn: "人工覆盖接受",
        reason_cn: "人工接受覆盖了已知偏差或 AI 建议差异。"
      };
    }
    return {
      key: "accepted",
      label_cn: "已接受",
      reason_cn: "已接受且未记录额外覆盖偏差。"
    };
  }
  if (item.asset_status === "candidate" && item.human_approved === true) {
    return {
      key: "accepted_candidate",
      label_cn: "已接受候选",
      reason_cn: "候选已获得人工接受，但尚未形成最终 accepted 记忆写入状态。"
    };
  }
  return {
    key: "needs_human_review",
    label_cn: "待人工复核",
    reason_cn: "候选仍需人工继续判断或审批。"
  };
}

function buildTraceabilityEntryFromItem(item, { createdAt, isDeliveryPackage = false } = {}) {
  const riskSummary = riskSummaryForItem(item);
  const traceabilityClass = traceabilityClassForItem(item, riskSummary);
  const promptComplianceComplete = traceabilityClass.key === "accepted" && riskSummary.blocking === false;
  const memorySuitable = itemHasWriteRequest(item);
  const knownDeviationSummaryCn =
    [
      (item.issues_cn || "").trim(),
      (item.annotation_note_cn || "").trim(),
      riskSummary.high_risk_labels_cn.length > 0 ? `风险标签：${riskSummary.high_risk_labels_cn.join("、")}` : ""
    ]
      .filter(Boolean)
      .join("；") || "未记录已知偏差。";
  const overrideReasonCn =
    traceabilityClass.key === "human_override"
      ? "人工接受覆盖了已知偏差或与 AI 建议不一致的判断。"
      : traceabilityClass.key === "accepted"
        ? "人工接受与已知风险和偏差记录一致。"
        : traceabilityClass.key === "accepted_candidate"
          ? "候选已获得人工接受，仍需后续记忆或归档确认。"
          : traceabilityClass.key === "rejected"
            ? "候选已拒收，需要下一轮修正。"
            : "候选仍需人工复核。";
  return {
    queue_id: item.queue_id || "delivery-package",
    title_cn: item.title_cn || item.selected_candidate_title_cn || "交付包草案",
    traceability_class_key: traceabilityClass.key,
    traceability_class_cn: traceabilityClass.label_cn,
    human_decision_source: humanDecisionSourceForItem(item),
    human_decision_source_cn:
      item.asset_status === "accepted" && item.human_approved === true
        ? "人工接受"
        : item.asset_status === "rejected"
          ? "人工拒收"
          : "待人工复核",
    human_decision_at: createdAt || nowIso(),
    override_reason_cn: overrideReasonCn,
    known_deviation_summary_cn: knownDeviationSummaryCn,
    prompt_compliance_complete: promptComplianceComplete,
    prompt_compliance_summary_cn: promptComplianceComplete
      ? "prompt compliance 完整。"
      : "仍存在已知偏差或未达到完整 prompt compliance。",
    memory_suitable: memorySuitable,
    memory_suitability_summary_cn: memorySuitable
      ? "适合进入记忆写入申请草案。"
      : "不适合进入真实记忆写入。",
    review_status_cn: item.candidate_review_state?.status_cn || candidateReviewState(item).status_cn,
    asset_status_cn: assetStatusLabel(item.asset_status),
    risk_summary_cn: riskSummary.reason_cn,
    is_delivery_package_row: isDeliveryPackage
  };
}

function buildHumanOverrideTraceabilityMatrix(queueDraft, createdAt, deliveryPackageDraft, selectedItem = null) {
  const deliverySeed = deliveryPackageDraft || selectedItem || queueDraft[0] || {};
  const deliveryRow = buildTraceabilityEntryFromItem(
    {
      queue_id: "delivery-package",
      title_cn: deliverySeed.selected_candidate_title_cn || deliverySeed.title_cn || "交付包草案",
      asset_status: deliverySeed.selected_candidate_asset_status || deliverySeed.asset_status || "candidate",
      human_approved: deliverySeed.human_approval_summary?.approved ?? deliverySeed.human_approved ?? false,
      memory_approval_status: deliverySeed.memory_delta_preview?.approval_status || deliverySeed.memory_approval_status || "draft",
      issues_cn: deliverySeed.risk_summary_cn || deliverySeed.issues_cn || "",
      annotation_note_cn: deliverySeed.human_override_summary_cn || deliverySeed.annotation_note_cn || "",
      candidate_review_state: {
        status_cn: deliverySeed.candidate_review_state?.status_cn || "已接受候选草案"
      }
    },
    { createdAt, isDeliveryPackage: true }
  );
  deliveryRow.traceability_class_key = "accepted_candidate";
  deliveryRow.traceability_class_cn = "已接受候选";
  deliveryRow.human_decision_source = "delivery_package_draft";
  deliveryRow.human_decision_source_cn = "交付包草案";
  deliveryRow.override_reason_cn = "已接受候选交付包草案，保持 no-write 和可追踪状态。";
  deliveryRow.known_deviation_summary_cn = deliverySeed.human_override_summary_cn || "未记录已知偏差。";
  deliveryRow.prompt_compliance_complete =
    deliverySeed.delivery_readiness === "accepted_candidate_ready" ||
    (deliverySeed.asset_status === "accepted" && deliverySeed.human_approved === true);
  deliveryRow.prompt_compliance_summary_cn = deliveryRow.prompt_compliance_complete
    ? "交付包草案满足当前可追踪条件。"
    : "交付包草案尚未满足完成条件。";
  deliveryRow.memory_suitable =
    deliverySeed.memory_delta_preview?.approval_status === "approved" ||
    deliverySeed.memory_approval_status === "approved";
  deliveryRow.memory_suitability_summary_cn = deliveryRow.memory_suitable
    ? "交付包草案对应记忆预览已获批准。"
    : "交付包草案对应记忆预览尚未获批准。";

  const queueRows = queueDraft.map((item) => buildTraceabilityEntryFromItem(item, { createdAt }));
  const traceabilityItems = [deliveryRow, ...queueRows];
  const counts = traceabilityItems.reduce(
    (acc, item) => {
      acc.total += 1;
      acc[item.traceability_class_key] = (acc[item.traceability_class_key] || 0) + 1;
      if (item.prompt_compliance_complete) acc.prompt_complete += 1;
      if (item.memory_suitable) acc.memory_suitable += 1;
      return acc;
    },
    {
      total: 0,
      accepted: 0,
      accepted_candidate: 0,
      human_override: 0,
      rejected: 0,
      needs_human_review: 0,
      prompt_complete: 0,
      memory_suitable: 0
    }
  );
  const summaryParts = [
    `共 ${counts.total} 条追踪记录，${counts.accepted} 条已接受，${counts.accepted_candidate} 条已接受候选，${counts.human_override} 条人工覆盖接受，${counts.rejected} 条已拒收，${counts.needs_human_review} 条待人工复核。`,
    `prompt compliance 完整 ${counts.prompt_complete} 条，适合进入记忆 ${counts.memory_suitable} 条。`
  ];
  return {
    status: "draft_only",
    traceability_items: traceabilityItems,
    traceability_counts: counts,
    traceability_summary_cn: summaryParts.join(" "),
    traceability_boundary_cn: "该矩阵只提供本地审片可读、可导出、可验证摘要，不触发真实执行。",
    no_execution_guard: runtimeGuard.clone(runtimeGuard.cleanGuard)
  };
}

function buildHumanOverrideTraceabilityDraft({
  createdAt,
  queueDraft,
  selectedItem,
  version,
  score,
  assetStatus,
  memoryApproval,
  humanApproval,
  humanReview,
  annotationText,
  issuesText,
  riskSummary,
  deliveryPackageDraft
}) {
  const matrixDraft = buildHumanOverrideTraceabilityMatrix(queueDraft, createdAt, deliveryPackageDraft, selectedItem);
  const knownDeviationParts = [
    issuesText,
    annotationText,
    riskSummary.tag_labels_cn.length > 0 ? `风险标签：${riskSummary.tag_labels_cn.join("、")}` : ""
  ].filter(Boolean);
  const knownDeviationSummary = knownDeviationParts.length > 0 ? knownDeviationParts.join("；") : "未记录已知偏差。";
  const promptComplianceComplete =
    assetStatus === "accepted" &&
    riskSummary.blocking === false &&
    knownDeviationParts.length === 0 &&
    score >= 90;
  const memorySuitable = itemHasWriteRequest(selectedItem);
  const humanOverridePerformed = assetStatus === "accepted" && humanApproval.approved === true && promptComplianceComplete === false;
  const overrideReason = humanOverridePerformed
    ? "人工接受该候选，但保留已知视觉偏差说明；这是人工覆盖接受，不是完美 prompt compliance。"
    : assetStatus === "accepted"
      ? "人工接受候选，未发现需要覆盖记录的偏差。"
      : "尚未形成 accepted 级人工覆盖接受。";

  return {
    package_status: "draft_only",
    traceability_id: `human-override-${selectedItem.queue_id}`,
    traceability_matrix_status: matrixDraft.status,
    selected_queue_id: selectedItem.queue_id,
    selected_version_id: version.version_id,
    human_decision_source: "review_console_human_form",
    human_decision_source_cn: "Review Console 人工评审表单",
    human_decision_at: humanApproval.approved_at || createdAt,
    human_approved: humanApproval.approved,
    memory_approval_status: memoryApproval.status,
    score,
    review_score_band: scoreBandLabel(score),
    override_performed: humanOverridePerformed,
    override_reason_cn: overrideReason,
    known_deviation_summary_cn: knownDeviationSummary,
    prompt_compliance_complete: promptComplianceComplete,
    prompt_compliance_summary_cn: promptComplianceComplete
      ? "当前未记录阻塞风险或已知偏差，可视为 prompt compliance 完整。"
      : "当前仍记录已知偏差或未进入 accepted 状态，不能声明 prompt compliance 完整。",
    memory_suitable: memorySuitable,
    memory_suitability_summary_cn: memorySuitable
      ? "人工接受、记忆审批和风险预检均满足写入申请草案条件。"
      : "尚未满足写入申请草案条件，不适合进入真实记忆写入。",
    human_note_cn: humanReview.note_cn,
    summary_cn: `${selectedItem.title_cn}：${overrideReason}`,
    traceability_items: matrixDraft.traceability_items,
    traceability_counts: matrixDraft.traceability_counts,
    traceability_summary_cn: matrixDraft.traceability_summary_cn,
    traceability_boundary_cn: matrixDraft.traceability_boundary_cn,
    side_effects_performed: false,
    plugin_called: false,
    api_called: false,
    daily_note_called: false,
    vcp_memory_written: false,
    image_created: false,
    no_execution_guard: runtimeGuard.clone(runtimeGuard.cleanGuard)
  };
}

function buildAcceptedCandidateDeliveryPackageDraft({
  createdAt,
  selectedItem,
  version,
  score,
  assetStatus,
  memoryApproval,
  humanApproval,
  memoryContent,
  memoryDeltaId,
  riskSummary,
  humanOverrideTraceabilityDraft
}) {
  const candidateReady =
    assetStatus === "accepted" &&
    humanApproval.approved === true &&
    memoryApproval.status === "approved" &&
    riskSummary.blocking === false;
  const reusableRules = runtimeGuard.requireArray(session.image_case_seed.reusable_rules_cn);
  const riskSummaryCn = riskSummary.tag_labels_cn.length > 0
    ? `${riskSummary.reason_cn} 风险标签：${riskSummary.tag_labels_cn.join("、")}。`
    : "未标记高风险标签。";
  const memoryCompletionState = buildMemoryCompletionState(memoryContent, memoryApproval);
  const memoryPreview = {
    delta_id: memoryDeltaId,
    title_cn: session.memory_preview.chinese_diary_title,
    target_notebook: session.memory_preview.target_notebook,
    write_mode: memoryWriteMode(memoryApproval.status),
    approval_status: memoryApproval.status,
    should_write_to_vcp: memoryApproval.status === "approved",
    body_cn: memoryContent,
    source_ids: [session.session_id, session.task_id, session.case_id],
    completion_state: memoryCompletionState
  };
  const packageText = [
    "Accepted candidate delivery package draft",
    `候选：${selectedItem.title_cn}`,
    `候选引用：${version.asset_ref}`,
    `脱敏哈希：${fingerprintString({ asset_ref: version.asset_ref, version_id: version.version_id })}`,
    `评分：${score}（${scoreBandLabel(score)}）`,
    `风险：${riskSummaryCn}`,
    `人工批准：${humanApproval.approved ? "已批准" : "未批准"}`,
    `记忆预览：${memoryPreview.write_mode} / ${memoryPreview.approval_status}`,
    `记忆完成：${memoryPreview.completion_state.write_requested_cn} / ${memoryPreview.completion_state.write_authorized_cn} / ${memoryPreview.completion_state.write_performed_cn}`,
    `完成边界：${memoryPreview.completion_state.plugin_success_sufficient_cn}`,
    `可复用规则：${reusableRules.length > 0 ? reusableRules.join("；") : "暂无"}`,
    "边界：draft_only=true，submitDraft_called=false，不调用插件/API/DailyNote/VCP memory，不创建图片。"
  ].join("\n");

  return {
    package_status: "draft_only",
    package_status_cn: "accepted candidate 交付包草案",
    delivery_readiness: candidateReady ? "accepted_candidate_ready" : "not_ready",
    delivery_readiness_cn: candidateReady ? "accepted 候选可进入后续交付复核" : "尚未满足 accepted 交付条件",
    created_at: createdAt,
    selected_queue_id: selectedItem.queue_id,
    selected_candidate_ref: version.asset_ref,
    selected_candidate_version_id: version.version_id,
    selected_candidate_title_cn: selectedItem.title_cn,
    sanitized_asset_hash: fingerprintString({ asset_ref: version.asset_ref, version_id: version.version_id }),
    review_score: score,
    review_score_band: scoreBandLabel(score),
    risk_summary_cn: riskSummaryCn,
    human_approval_summary: {
      approved: humanApproval.approved,
      approved_by: humanApproval.approved_by,
      approved_at: humanApproval.approved_at,
      approval_notes_cn: humanApproval.approval_notes_cn
    },
    human_approval_summary_cn: humanApproval.approved ? "人工已明确批准 accepted。" : "尚未获得人工 accepted 批准。",
    memory_delta_preview: memoryPreview,
    reusable_rule_summary_cn: reusableRules.length > 0 ? reusableRules.join("；") : "暂无可复用规则。",
    human_override_traceability_ref: humanOverrideTraceabilityDraft.traceability_id,
    human_override_summary_cn: humanOverrideTraceabilityDraft.summary_cn,
    review_text_cn: packageText,
    draft_only: true,
    submitDraft_called: false,
    side_effects_performed: false,
    plugin_called: false,
    api_called: false,
    daily_note_called: false,
    vcp_memory_written: false,
    image_created: false,
    no_execution_guard: runtimeGuard.clone(runtimeGuard.cleanGuard)
  };
}

function unifiedAssetStateKey({
  assetStatus,
  selectedRiskSummary,
  humanApproval,
  humanOverrideTraceabilityDraft,
  acceptedCandidateDeliveryPackageDraft
}) {
  if (selectedRiskSummary.blocking) return "blocked";
  if (assetStatus === "rejected") return "rejected";
  if (humanOverrideTraceabilityDraft.override_performed) return "accepted_by_human_override";
  if (acceptedCandidateDeliveryPackageDraft.delivery_readiness === "accepted_candidate_ready") {
    return "accepted_candidate";
  }
  if (assetStatus === "accepted" && humanApproval.approved === true) return "accepted_candidate";
  return "candidate";
}

function unifiedAssetStateLabel(stateKey) {
  const labels = {
    candidate: "候选",
    accepted_candidate: "已接受候选",
    accepted_by_human_override: "人工覆盖接受",
    rejected: "已拒收",
    blocked: "阻塞"
  };
  return labels[stateKey] || stateKey;
}

function buildRuntimeReviewStateDraft({
  createdAt,
  reviewQueueDraft,
  selectedItem,
  assetStatus,
  memoryApproval,
  memoryCompletionState,
  humanApproval,
  selectedRiskSummary,
  acceptedCandidateDeliveryPackageDraft,
  humanOverrideTraceabilityDraft
}) {
  const stateKey = unifiedAssetStateKey({
    assetStatus,
    selectedRiskSummary,
    humanApproval,
    humanOverrideTraceabilityDraft,
    acceptedCandidateDeliveryPackageDraft
  });
  const mismatchItems = [];
  if (memoryCompletionState.write_authorized === true && memoryCompletionState.write_requested !== true) {
    mismatchItems.push("记忆已授权但没有写入请求。");
  }
  if (memoryCompletionState.write_authorized === true && memoryCompletionState.write_performed === true) {
    mismatchItems.push("no-write prototype 中不能同时声明已授权且已真实写入。");
  }
  if (humanOverrideTraceabilityDraft.override_performed === true && humanOverrideTraceabilityDraft.prompt_compliance_complete === true) {
    mismatchItems.push("人工覆盖接受不能被当作 prompt compliance 完成。");
  }
  if (assetStatus === "accepted" && humanApproval.approved !== true) {
    mismatchItems.push("资产 accepted 必须有人工批准。");
  }
  if (memoryApproval.status !== "approved" && acceptedCandidateDeliveryPackageDraft.delivery_readiness === "accepted_candidate_ready") {
    mismatchItems.push("交付包 ready 不能缺少记忆审批。");
  }
  if (selectedRiskSummary.blocking && acceptedCandidateDeliveryPackageDraft.delivery_readiness === "accepted_candidate_ready") {
    mismatchItems.push("存在阻塞风险时不能声明交付包 ready。");
  }

  return {
    package_status: "draft_only",
    convergence_status: mismatchItems.length === 0 ? "converged" : "mismatch_detected",
    convergence_status_cn: mismatchItems.length === 0 ? "运行状态已收敛" : "运行状态存在矛盾",
    created_at: createdAt,
    selected_queue_id: selectedItem.queue_id,
    selected_title_cn: selectedItem.title_cn,
    normalized_state: {
      asset_state_key: stateKey,
      asset_state_cn: unifiedAssetStateLabel(stateKey),
      review_status: reviewSessionStatus(assetStatus),
      review_status_cn: reviewStatusLabel(reviewSessionStatus(assetStatus)),
      memory_status: memoryApproval.status,
      memory_status_cn: memoryStatusLabel(memoryApproval.status),
      write_requested: memoryCompletionState.write_requested,
      write_authorized: memoryCompletionState.write_authorized,
      write_performed: memoryCompletionState.write_performed,
      delivery_readiness: acceptedCandidateDeliveryPackageDraft.delivery_readiness,
      delivery_readiness_cn: acceptedCandidateDeliveryPackageDraft.delivery_readiness_cn,
      human_override_performed: humanOverrideTraceabilityDraft.override_performed,
      prompt_compliance_complete: humanOverrideTraceabilityDraft.prompt_compliance_complete
    },
    queue_state_counts: {
      total: reviewQueueDraft.length,
      candidate: reviewQueueDraft.filter((item) => item.asset_status === "candidate").length,
      accepted: reviewQueueDraft.filter((item) => item.asset_status === "accepted").length,
      rejected: reviewQueueDraft.filter((item) => item.asset_status === "rejected").length,
      blocked: reviewQueueDraft.filter(itemIsBlocked).length
    },
    mismatch_items_cn: mismatchItems,
    summary_cn:
      mismatchItems.length === 0
        ? `${selectedItem.title_cn} 当前为${unifiedAssetStateLabel(stateKey)}；资产状态、记忆状态、交付包和人工覆盖轨迹已分离展示。`
        : `检测到 ${mismatchItems.length} 个状态矛盾，需要先修正本地草案。`,
    boundary_cn: "状态收敛只解释本地 Review Console 草案，不代表真实执行、真实写入或 submitDraft 生产调用。",
    side_effects_performed: false,
    no_execution_guard: runtimeGuard.clone(runtimeGuard.cleanGuard)
  };
}

function buildLocalCommitScopePlanDraft({ createdAt, runtimeReviewStateDraft }) {
  return {
    package_status: "draft_only",
    plan_status: "local_commit_scope_candidate",
    plan_status_cn: "本地提交范围候选计划",
    created_at: createdAt,
    branch_ref: "codex/runtime-review-followup",
    staged_changes_present: false,
    commit_allowed: false,
    tag_allowed: false,
    push_allowed: false,
    pr_allowed: false,
    release_allowed: false,
    scope_groups: [
      {
        group_id: "runtime_prototype",
        title_cn: "Runtime Review Console prototype",
        files_cn: [
          "review_console/runtime_prototype/app.js",
          "review_console/runtime_prototype/index.html",
          "review_console/runtime_prototype/host_bridge_mock.js",
          "review_console/runtime_prototype/runtime_guard.js",
          "review_console/runtime_prototype/styles.css",
          "review_console/runtime_prototype/FIELD_MAPPING.md",
          "review_console/runtime_prototype/README.md"
        ]
      },
      {
        group_id: "validators",
        title_cn: "Runtime and local scope validators",
        files_cn: [
          "scripts/validate_runtime_guard_unit.js",
          "scripts/validate_runtime_prototype_smoke.js",
          "scripts/validate_runtime_delivery_surface.js",
          "scripts/validate_runtime_prototype_suite.js",
          "scripts/validate_local_commit_scope.js",
          "scripts/validate_mvp.ps1"
        ]
      },
      {
        group_id: "docs_indexes",
        title_cn: "Docs, indexes, roadmap and checklist",
        files_cn: [
          "README.md",
          "MANIFEST.md",
          "RELEASE_NOTES.md",
          "docs/00_project_roadmap.md",
          "docs/215_runtime_review_followup_requirements_audit.md",
          "docs/216_runtime_review_long_task_delivery_plan.md",
          "docs/217_runtime_review_batch_3a_3b_3c_local_stabilization.md",
          "docs/218_runtime_review_batch_4a_bridge_mock_roundtrip.md",
          "docs/219_runtime_review_batch_4b_5a_6a_local_readiness.md",
          "docs/220_runtime_review_batch_5b_6b_7a_local_gate_archive.md",
          "tests/validation_checklist.md"
        ]
      },
      {
        group_id: "agent_board",
        title_cn: "Agent board handoff state",
        files_cn: [
          ".agent_board/RUN_STATE.md",
          ".agent_board/TASK_QUEUE.md",
          ".agent_board/CHECKPOINT.md",
          ".agent_board/HANDOFF.md",
          ".agent_board/VALIDATION_LOG.md"
        ]
      }
    ],
    intentionally_untracked_refs: [
      "docs/215_runtime_review_followup_requirements_audit.md",
      "docs/216_runtime_review_long_task_delivery_plan.md",
      "docs/217_runtime_review_batch_3a_3b_3c_local_stabilization.md",
      "docs/218_runtime_review_batch_4a_bridge_mock_roundtrip.md",
      "docs/219_runtime_review_batch_4b_5a_6a_local_readiness.md",
      "docs/220_runtime_review_batch_5b_6b_7a_local_gate_archive.md"
    ],
    rollback_guidance_cn: [
      "按文件组审查 diff 后再决定是否 stage。",
      "若某一组不进入本次提交，只从 stage 范围排除该组；不要使用破坏性历史回滚或清理命令。",
      "任何 commit、tag、push、PR 都必须等待新的显式版本动作授权。"
    ],
    validation_required_cn: [
      "git diff --check",
      "node scripts/validate_local_commit_scope.js",
      "node scripts/validate_runtime_prototype_suite.js",
      "powershell -ExecutionPolicy Bypass -File scripts\\validate_mvp.ps1",
      "powershell -ExecutionPolicy Bypass -File scripts\\validate-agent-image-lab-local.ps1"
    ],
    runtime_state_ref: {
      convergence_status: runtimeReviewStateDraft.convergence_status,
      selected_queue_id: runtimeReviewStateDraft.selected_queue_id,
      asset_state_key: runtimeReviewStateDraft.normalized_state.asset_state_key
    },
    boundary_cn: "该计划只整理本地提交范围；没有执行 git add、commit、tag、push、PR 或 release。",
    side_effects_performed: false,
    no_execution_guard: runtimeGuard.clone(runtimeGuard.cleanGuard)
  };
}

function noWriteFlags() {
  return {
    side_effects_performed: false,
    plugin_called: false,
    api_called: false,
    daily_note_called: false,
    vcp_memory_written: false,
    image_created: false
  };
}

function buildBridgeAckSummary({ method, ackKeys, acceptedByHostMock = true, validationPassed = true }) {
  return {
    selected_method: method,
    mock_only: true,
    accepted_by_host_mock: acceptedByHostMock,
    validation_passed: validationPassed,
    ack_keys: ackKeys,
    bridge_calls_observed: {
      mock_only: true,
      total: 1,
      cancel: 0,
      loadSession: method === "loadSession" ? 1 : 0,
      previewDraft: method === "previewDraft" ? 1 : 0,
      submitDraft: 0,
      production_submitDraft: 0
    },
    ...noWriteFlags()
  };
}

function buildBridgeMockRoundtripCandidateDraft({
  createdAt,
  adapterHandoffDraft,
  reviewQueueDraft,
  runtimeReviewStateDraft,
  acceptedCandidateDeliveryPackageDraft
}) {
  const loadSessionFixture = {
    fixture_id: "bridge-mock-load-session-seed",
    source: "host_bridge_mock.loadSession",
    session_ref: session.session_id,
    task_ref: session.task_id,
    case_ref: session.case_id,
    queue_count: reviewQueueDraft.length,
    current_version_id: session.current_version_id,
    compare_version_id: session.compare_version_id,
    guard_clean: true
  };
  const previewDraftFixture = {
    fixture_id: "bridge-mock-preview-draft-seed",
    source: "review_console_runtime_draft",
    selected_queue_id: runtimeReviewStateDraft.selected_queue_id,
    asset_state_key: runtimeReviewStateDraft.normalized_state.asset_state_key,
    delivery_readiness: acceptedCandidateDeliveryPackageDraft.delivery_readiness,
    memory_write_performed: false,
    submitDraft_called: false,
    guard_clean: true
  };
  const ackSummaries = [
    buildBridgeAckSummary({
      method: "loadSession",
      ackKeys: ["session_id", "task_id", "case_id", "image_versions", "review_queue", "adapter_dry_run_handoff"]
    }),
    buildBridgeAckSummary({
      method: "previewDraft",
      ackKeys: [
        "selected_method",
        "accepted_by_host_mock",
        "draft_received",
        "validation_passed",
        "bridge_calls_observed",
        "side_effects_performed",
        "plugin_called",
        "api_called",
        "daily_note_called",
        "vcp_memory_written",
        "image_created",
        "received_at",
        "status_cn"
      ]
    })
  ];

  return {
    package_status: "draft_only",
    package_status_cn: "Bridge mock roundtrip 候选草案",
    roundtrip_status: "mock_roundtrip_candidate",
    roundtrip_status_cn: "项目内 mock 回环候选",
    created_at: createdAt,
    bridge_mode: "project_local_mock",
    source_fixture_policy: "project_local_fixtures_only",
    flow_cn: "Adapter dry-run handoff -> Review Console runtime draft -> host bridge mock previewDraft。",
    selected_methods: ["loadSession", "previewDraft"],
    forbidden_methods: ["submitDraft"],
    max_bridge_calls_per_method: 1,
    bridge_calls_observed: {
      mock_only: true,
      total: 2,
      cancel: 0,
      loadSession: 1,
      previewDraft: 1,
      submitDraft: 0,
      production_submitDraft: 0
    },
    adapter_handoff_ref: {
      status_cn: adapterHandoffDraft.status_cn,
      selected_plugin: adapterHandoffDraft.selected_plugin,
      max_plugin_calls: adapterHandoffDraft.max_plugin_calls,
      execution_blocked: adapterHandoffDraft.execution_blocked
    },
    load_session_fixture: loadSessionFixture,
    preview_draft_fixture: previewDraftFixture,
    ack_summaries: ackSummaries,
    production_bridge_invocation_performed: false,
    real_cdp_called: false,
    submitDraft_called: false,
    ...noWriteFlags(),
    boundary_cn:
      "Batch 4A 只验证项目内 mock roundtrip，不读取真实 VCPChat/VCPToolBox，不连接 CDP，不调用真实 bridge，不调用 production submitDraft。",
    no_execution_guard: runtimeGuard.clone(runtimeGuard.cleanGuard)
  };
}

function buildRealBridgeAuthorizationPackageDraft({ createdAt, bridgeMockRoundtripCandidateDraft }) {
  return {
    package_status: "draft_only",
    authorization_status: "inactive_package",
    package_status_cn: "真实 bridge 授权包草案",
    target_stage: "real_bridge_authorization_package",
    created_at: createdAt,
    activation_required: true,
    activation_rule_cn: "必须由用户另行提供完整真实 bridge 授权消息；本草案不能自动激活。",
    target_root_refs: {
      vcpchat_root_ref_policy: "user_supplied_at_activation_only",
      vcptoolbox_root_ref_policy: "not_required_for_bridge_smoke",
      raw_path_stored: false
    },
    allowed_methods: ["cancel", "loadSession", "previewDraft"],
    forbidden_methods: ["submitDraft"],
    max_bridge_calls_per_method: 1,
    required_authorization_fields: [
      "mode",
      "real_vcpchat_root_ref",
      "allowed_methods",
      "forbidden_methods",
      "max_bridge_calls_per_method",
      "sanitization_rules",
      "rollback_plan",
      "no_execution_guard"
    ],
    forbidden_outputs_cn: [
      ...sharedForbiddenOutputsCn,
      "raw CDP target",
      "raw websocket url",
      "raw IPC payload",
      "raw source snippet"
    ],
    preflight_checks_cn: [
      "真实 VCPChat root 只能在执行授权消息中提供，仓库只保存脱敏 ref。",
      "调用前必须确认 allowlist 只包含 cancel、loadSession、previewDraft。",
      "submitDraft 必须保持禁止，直到另行授权提交语义。",
      "调用记录只能保存中文脱敏 ack 摘要和 no-write flags。"
    ],
    rollback_plan_cn: [
      "若真实 bridge smoke 失败，只保留脱敏失败记录。",
      "若本次运行启动了本地进程，只清理本次启动的进程句柄记录，不修改配置。",
      "不删除用户文件，不改 VCPChat/VCPToolBox 源码，不写 DailyNote/VCP memory。"
    ],
    bridge_mock_roundtrip_ref: {
      roundtrip_status: bridgeMockRoundtripCandidateDraft.roundtrip_status,
      bridge_mode: bridgeMockRoundtripCandidateDraft.bridge_mode,
      previewDraft_calls: bridgeMockRoundtripCandidateDraft.bridge_calls_observed.previewDraft,
      submitDraft_calls: bridgeMockRoundtripCandidateDraft.bridge_calls_observed.submitDraft
    },
    execution_authorized_by_this_record: false,
    production_bridge_invocation_performed: false,
    real_cdp_called: false,
    source_read_performed: false,
    submitDraft_allowed: false,
    submitDraft_called: false,
    ...noWriteFlags(),
    no_execution_guard: runtimeGuard.clone(runtimeGuard.cleanGuard),
    boundary_cn:
      "Batch 4B 只准备真实 bridge 授权包草案，不启动 VCPChat，不连接 CDP，不调用真实 bridge，不读取外部源码。"
  };
}

function buildPluginReliabilityPromptDisciplineDraft({ createdAt, selectedRiskSummary }) {
  const promptFamily = {
    prompt_family_id: "photo_studio_os_positive_still_life_no_text",
    title_cn: "Photo Studio OS 正向静物无文字 prompt 家族",
    selected_plugin_id: "DoubaoGen",
    requested_model: "doubao-seedream-5-0-260128",
    allowed_subjects_cn: ["真实相机镜头", "摄影灯", "色卡", "干净桌面", "抽象几何界面形状", "柔和光影"],
    banned_subjects_cn: ["人物", "脸", "人体", "文字", "字母", "数字", "logo", "品牌标识", "水印", "屏幕文字"],
    prompt_lint_rules_cn: [
      "必须用正向静物主体开头，避免把禁止项写成主要画面描述。",
      "禁止人物、脸、人体、肖像或屏幕里的人。",
      "禁止任何文字、字母、数字、logo、品牌标识、水印和标签。",
      "必须声明纯产品静物摄影，且不出现可读或不可读文字形状。",
      "必须记录 prompt hash，后续真实调用前复核 hash 是否一致。"
    ]
  };
  const promptHash = fingerprintString({
    prompt_family_id: promptFamily.prompt_family_id,
    allowed_subjects_cn: promptFamily.allowed_subjects_cn,
    banned_subjects_cn: promptFamily.banned_subjects_cn,
    requested_model: promptFamily.requested_model
  });
  return {
    package_status: "draft_only",
    reliability_status: "local_prompt_reliability_candidate",
    package_status_cn: "插件可靠性与 prompt discipline 草案",
    created_at: createdAt,
    prompt_registry_status: "local_registry_candidate",
    prompt_families: [promptFamily],
    prompt_hash: promptHash,
    model_lock: {
      selected_plugin_id: promptFamily.selected_plugin_id,
      requested_model: promptFamily.requested_model,
      sanitized_plugin_reported_model: null,
      model_match_status: "not_observed_no_plugin_call",
      model_lock_required_before_real_retry: true
    },
    lint_result: {
      status: "lint_rules_defined_no_prompt_execution",
      banned_subject_count: promptFamily.banned_subjects_cn.length,
      rule_count: promptFamily.prompt_lint_rules_cn.length,
      current_selected_risk_summary_cn: selectedRiskSummary.reason_cn
    },
    failure_taxonomy: [
      { key: "prompt_design_failure", label_cn: "prompt 设计失败", rule_cn: "禁止项写法诱发模型补全或主体漂移。" },
      { key: "model_compliance_failure", label_cn: "模型遵循失败", rule_cn: "handoff 正确但模型仍生成禁止内容。" },
      { key: "plugin_handoff_failure", label_cn: "插件传参失败", rule_cn: "runner 层 prompt hash 正确但 provider 侧未知。" },
      { key: "provider_side_unknown", label_cn: "provider 侧未知", rule_cn: "未获得 provider-side 指纹捕获授权时保持未知。" }
    ],
    provider_side_capture: {
      authorization_status: "inactive_package",
      execution_authorized_by_this_record: false,
      raw_request_capture_allowed: false,
      sanitized_fingerprint_only: true
    },
    max_plugin_calls_allowed: 0,
    plugin_called: false,
    api_called: false,
    image_created: false,
    side_effects_performed: false,
    no_execution_guard: runtimeGuard.clone(runtimeGuard.cleanGuard),
    boundary_cn:
      "Batch 5A 只建立 prompt registry、lint、模型锁和失败分类；不调用 DoubaoGen，不调用 API，不创建图片。"
  };
}

function buildMemoryWriteCompletionCandidateDraft({ createdAt, memoryCompletionState, memoryDeltaDraft }) {
  const observedState = {
    write_requested: memoryCompletionState.write_requested,
    write_authorized: memoryCompletionState.write_authorized,
    writer_executed: false,
    canonical_target_exists: false,
    canonical_target_hash_matches: false,
    write_complete_declared: false
  };
  return {
    package_status: "draft_only",
    candidate_status: "memory_write_completion_preflight_candidate",
    package_status_cn: "记忆写入完成候选草案",
    created_at: createdAt,
    target_notebook_ref: memoryDeltaDraft.target_notebook || "memory_target_ref_pending",
    completion_required_sequence: [
      "write_requested",
      "write_authorized",
      "writer_executed",
      "canonical_target_exists",
      "canonical_target_hash_matches"
    ],
    observed_state: observedState,
    completion_criteria: {
      write_requested_required: true,
      write_authorized_required: true,
      writer_executed_required: true,
      canonical_target_exists_required: true,
      canonical_target_hash_matches_required: true,
      plugin_success_sufficient: false
    },
    wrong_location_classification: {
      class_key: "plugin_success_wrong_location",
      applies_when_cn: "插件返回 success 但 canonical 位置不存在或 hash 不匹配。",
      completion_allowed: false
    },
    failure_closeout_template_cn: [
      "若 writer 未执行，记录 memory_write_not_performed。",
      "若 canonical 位置不存在，记录 plugin_success_wrong_location。",
      "若 hash 不匹配，记录 canonical_hash_mismatch。",
      "任一失败都不得伪造 memory write complete。"
    ],
    sensitive_storage_policy_cn: [
      "只保存 notebook/category ref，不保存 raw 私密路径。",
      "不保存 raw plugin output、endpoint、runtime log、secret 或图片二进制。",
      "中文正文必须先通过脱敏检查。"
    ],
    daily_note_called: false,
    vcp_memory_written: false,
    write_complete_declared: false,
    side_effects_performed: false,
    no_execution_guard: runtimeGuard.clone(runtimeGuard.cleanGuard),
    boundary_cn:
      "Batch 6A 只准备记忆写入完成判定候选，不调用 DailyNote，不写 VCP memory，不读取外部配置。"
  };
}

function buildSingleRealGenerationRetryGateDraft({
  createdAt,
  pluginReliabilityPromptDisciplineDraft,
  acceptedCandidateDeliveryPackageDraft,
  runtimeReviewStateDraft
}) {
  const modelLock = pluginReliabilityPromptDisciplineDraft.model_lock || {};
  const promptFamily = pluginReliabilityPromptDisciplineDraft.prompt_families[0] || {};
  return {
    package_status: "draft_only",
    gate_status: "single_real_generation_retry_gate_inactive",
    package_status_cn: "单次真实生图重试授权门草案",
    authorization_status: "inactive_package",
    target_stage: "single_real_generation_retry_gate",
    created_at: createdAt,
    selected_plugin_id: "DoubaoGen",
    selected_plugin_command: "generate",
    requested_model: modelLock.requested_model || "doubao-seedream-5-0-260128",
    prompt_family_ref: promptFamily.prompt_family_id || "photo_studio_os_positive_still_life_no_text",
    prompt_hash: pluginReliabilityPromptDisciplineDraft.prompt_hash,
    max_plugin_calls_per_run: 1,
    plugin_calls_observed: 0,
    output_directory_policy: {
      output_directory_ref: "runs/photo_studio_os_single_retry_gate",
      raw_path_stored: false,
      overwrite_existing_files_allowed: false
    },
    required_authorization_fields: [
      "phase",
      "selected_plugin_id",
      "selected_plugin_command",
      "selected_plugin_model",
      "max_plugin_calls",
      "input_reference",
      "output_directory_ref",
      "overwrite_existing_files_allowed",
      "rollback_plan",
      "gatekeeper_approved",
      "review_console_human_approved",
      "no_execution_guard"
    ],
    prompt_policy_cn: [
      "必须复用已登记 prompt_family_ref 和 prompt_hash，真实调用前再次确认 hash。",
      "只允许 Photo Studio OS 产品静物安全任务。",
      "禁止人物、脸、人体、品牌、logo、文字、水印、隐私信息。",
      "真实输出只能进入受控 output_directory_ref，不覆盖既有文件。"
    ],
    future_run_summary_schema: {
      plugin_call_count_observed_required: true,
      output_asset_ref_required: true,
      output_hash_required: true,
      sanitized_plugin_summary_required: true,
      raw_plugin_output_allowed: false,
      image_binary_in_git_or_memory_allowed: false
    },
    future_review_intake: {
      review_console_can_receive_summary: true,
      allowed_asset_statuses: ["accepted_candidate", "needs_human_review", "rejected"],
      current_delivery_readiness: acceptedCandidateDeliveryPackageDraft.delivery_readiness,
      current_runtime_asset_state: runtimeReviewStateDraft.normalized_state.asset_state_key
    },
    memory_write_block: {
      memory_write_allowed_by_this_record: false,
      requires_accepted_candidate: true,
      requires_memory_approval: true,
      requires_safety_review_passed: true,
      direct_daily_note_write_allowed: false,
      direct_vcp_memory_write_allowed: false
    },
    rollback_plan_cn: [
      "失败时只删除本次 output_directory_ref 下新建的输出文件。",
      "保留脱敏失败记录和 prompt hash。",
      "不改配置，不写 DailyNote，不写 VCP memory。"
    ],
    forbidden_outputs_cn: sharedForbiddenOutputsCn,
    execution_authorized_by_this_record: false,
    real_generation_performed: false,
    api_called: false,
    plugin_called: false,
    image_created: false,
    daily_note_called: false,
    vcp_memory_written: false,
    side_effects_performed: false,
    no_execution_guard: runtimeGuard.clone(runtimeGuard.cleanGuard),
    boundary_cn:
      "Batch 5B 只准备单次真实生图重试授权门，不调用 DoubaoGen，不调用 API，不创建图片，不写记忆。"
  };
}

function buildRealMemoryWriteAuthorizationPackageDraft({
  createdAt,
  memoryWriteCompletionCandidateDraft,
  memoryCompletionState,
  memoryDeltaDraft
}) {
  return {
    package_status: "draft_only",
    package_status_cn: "真实记忆写入授权包草案",
    authorization_status: "inactive_package",
    target_stage: "real_memory_write_authorization_package",
    created_at: createdAt,
    max_daily_note_writes: 1,
    max_vcp_memory_writes: 1,
    max_retry_attempts: 1,
    target_refs: {
      notebook_ref: memoryDeltaDraft.target_notebook || "memory_target_ref_pending",
      category_ref: memoryDeltaDraft.memory_type || "style_review_handoff",
      raw_path_stored: false
    },
    required_authorization_fields: [
      "phase",
      "daily_note_write_allowed",
      "vcp_memory_write_allowed",
      "max_daily_note_writes",
      "max_vcp_memory_writes",
      "chinese_desensitized_body",
      "canonical_target_ref",
      "rollback_plan",
      "no_success_fabrication_rule",
      "no_execution_guard"
    ],
    content_rules_cn: [
      "正文必须是中文脱敏摘要。",
      "不得包含 raw local path、endpoint、runtime log、plugin output、secret、token、cookie、password。",
      "不得包含图片二进制、客户隐私或未脱敏原文。",
      "写入失败不得伪造成功；最多一次安全重试，超过需另行授权。"
    ],
    reject_path_cn: [
      "正文非中文或疑似未脱敏时拒绝写入。",
      "缺少 canonical target ref 时拒绝写入。",
      "DailyNote 或 VCP memory 任一写入失败时记录失败，不伪造完成。",
      "canonical target 不存在或 hash 不匹配时标记为 plugin_success_wrong_location。"
    ],
    no_success_fabrication_rule: true,
    completion_preflight_ref: {
      candidate_status: memoryWriteCompletionCandidateDraft.candidate_status,
      plugin_success_sufficient: memoryWriteCompletionCandidateDraft.completion_criteria.plugin_success_sufficient,
      write_requested: memoryCompletionState.write_requested,
      write_authorized: memoryCompletionState.write_authorized,
      writer_executed: false,
      canonical_target_exists: false,
      canonical_target_hash_matches: false
    },
    execution_authorized_by_this_record: false,
    daily_note_write_authorized_by_this_record: false,
    vcp_memory_write_authorized_by_this_record: false,
    plugin_called: false,
    api_called: false,
    image_created: false,
    daily_note_called: false,
    vcp_memory_written: false,
    write_complete_declared: false,
    side_effects_performed: false,
    no_execution_guard: runtimeGuard.clone(runtimeGuard.cleanGuard),
    boundary_cn:
      "Batch 6B 只准备下一次真实记忆单写授权包，不调用 DailyNote，不写 VCP memory，不读取外部配置。"
  };
}

function archiveClassificationForAsset({ assetStatus, humanApproval, acceptedCandidateDeliveryPackageDraft, riskSummary }) {
  if (assetStatus === "rejected") return "rejected";
  if (acceptedCandidateDeliveryPackageDraft.delivery_readiness === "accepted_candidate_ready") return "accepted_candidate";
  if (assetStatus === "accepted" && humanApproval.approved === true && riskSummary.blocking === false) return "accepted_candidate";
  return "needs_human_review";
}

function buildAssetArchiveCandidateDraft({
  createdAt,
  selectedItem,
  version,
  score,
  assetStatus,
  humanApproval,
  selectedRiskSummary,
  acceptedCandidateDeliveryPackageDraft,
  humanOverrideTraceabilityDraft
}) {
  const classification = archiveClassificationForAsset({
    assetStatus,
    humanApproval,
    acceptedCandidateDeliveryPackageDraft,
    riskSummary: selectedRiskSummary
  });
  return {
    package_status: "draft_only",
    archive_status: "asset_archive_candidate_no_binary",
    package_status_cn: "资产归档候选草案",
    created_at: createdAt,
    archive_policy: "metadata_only_no_binary",
    selected_queue_id: selectedItem.queue_id,
    output_path_ref: version.asset_ref,
    raw_output_path_stored: false,
    asset_hash: acceptedCandidateDeliveryPackageDraft.sanitized_asset_hash,
    review_score: score,
    review_score_band: scoreBandLabel(score),
    asset_status_classification: classification,
    sanitized_review_summary_cn: `${selectedItem.title_cn}：${selectedRiskSummary.reason_cn}`,
    reusable_rules_cn: runtimeGuard.requireArray(session.image_case_seed.reusable_rules_cn),
    human_override_reason_cn: humanOverrideTraceabilityDraft.override_reason_cn,
    archived_fields: [
      "output_path_ref",
      "asset_hash",
      "review_score",
      "sanitized_review_summary_cn",
      "reusable_rules_cn",
      "human_override_reason_cn"
    ],
    closeout_templates: [
      {
        asset_status: "accepted_candidate",
        template_cn: "记录 ref、hash、评分、通过规则和人工批准摘要；允许进入后续交付候选，但不写图片二进制。"
      },
      {
        asset_status: "needs_human_review",
        template_cn: "记录 ref、hash、待复核原因和下一步；不得进入记忆写入。"
      },
      {
        asset_status: "rejected",
        template_cn: "记录 ref、hash、拒收原因和可复用规避规则；不得进入记忆写入或交付候选。"
      }
    ],
    current_closeout: {
      asset_status: classification,
      memory_write_allowed: classification === "accepted_candidate" && acceptedCandidateDeliveryPackageDraft.memory_delta_preview.approval_status === "approved",
      image_binary_in_git_allowed: false,
      image_binary_in_memory_allowed: false
    },
    binary_storage_allowed: false,
    git_binary_stored: false,
    memory_binary_stored: false,
    side_effects_performed: false,
    plugin_called: false,
    api_called: false,
    daily_note_called: false,
    vcp_memory_written: false,
    image_created: false,
    no_execution_guard: runtimeGuard.clone(runtimeGuard.cleanGuard),
    boundary_cn:
      "Batch 7A 只准备资产归档候选模板；只保存 ref、hash、评分、摘要和规则，不保存图片二进制，不写记忆。"
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
  humanInspectionChecklistDraft,
  humanOverrideTraceabilityDraft,
  acceptedCandidateDeliveryPackageDraft,
  inactiveAuthorizationCapsulesDraft,
  runtimeReviewStateDraft,
  localCommitScopePlanDraft,
  bridgeMockRoundtripCandidateDraft,
  realBridgeAuthorizationPackageDraft,
  pluginReliabilityPromptDisciplineDraft,
  memoryWriteCompletionCandidateDraft,
  singleRealGenerationRetryGateDraft,
  realMemoryWriteAuthorizationPackageDraft,
  assetArchiveCandidateDraft,
  v6ProductRuntimeDraft
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
    human_override_traceability_draft: humanOverrideTraceabilityDraft,
    accepted_candidate_delivery_package_draft: acceptedCandidateDeliveryPackageDraft,
    inactive_authorization_capsules_draft: inactiveAuthorizationCapsulesDraft,
    runtime_review_state_draft: runtimeReviewStateDraft,
    local_commit_scope_plan_draft: localCommitScopePlanDraft,
    bridge_mock_roundtrip_candidate_draft: bridgeMockRoundtripCandidateDraft,
    real_bridge_authorization_package_draft: realBridgeAuthorizationPackageDraft,
    plugin_reliability_prompt_discipline_draft: pluginReliabilityPromptDisciplineDraft,
    memory_write_completion_candidate_draft: memoryWriteCompletionCandidateDraft,
    single_real_generation_retry_gate_draft: singleRealGenerationRetryGateDraft,
    real_memory_write_authorization_package_draft: realMemoryWriteAuthorizationPackageDraft,
    asset_archive_candidate_draft: assetArchiveCandidateDraft,
    v6_product_runtime_draft: v6ProductRuntimeDraft,
    prototype_guard: runtimeGuard.clone(runtimeGuard.cleanGuard),
    side_effects_performed: false,
    boundary_cn: "这是 Review Console runtime 本地会话导出草案，不写磁盘，不调用插件/API/DailyNote，不写 VCP memory。"
  };
  exportDraft.session_fingerprint = fingerprintString(sessionPayloadForFingerprint(exportDraft));
  exportDraft.session_fingerprint_cn = `会话指纹：${exportDraft.session_fingerprint}`;
  return exportDraft;
}

const optionalImportGuardFields = [
  ["batch_decision_draft", "batch_decision_draft guard 不干净。"],
  ["a5_preauthorization_review_package_draft", "A5 授权前复核包 guard 不干净。"],
  ["human_override_traceability_draft", "人工覆盖轨迹 guard 不干净。"],
  ["accepted_candidate_delivery_package_draft", "accepted candidate 交付包 guard 不干净。"],
  ["inactive_authorization_capsules_draft", "未激活授权胶囊 guard 不干净。"],
  ["runtime_review_state_draft", "runtime review state guard 不干净。"],
  ["local_commit_scope_plan_draft", "local commit scope plan guard 不干净。"],
  ["bridge_mock_roundtrip_candidate_draft", "bridge mock roundtrip candidate guard 不干净。"],
  ["real_bridge_authorization_package_draft", "real bridge authorization package guard 不干净。"],
  ["plugin_reliability_prompt_discipline_draft", "plugin reliability prompt discipline guard 不干净。"],
  ["memory_write_completion_candidate_draft", "memory write completion candidate guard 不干净。"],
  ["single_real_generation_retry_gate_draft", "single real generation retry gate guard 不干净。"],
  ["real_memory_write_authorization_package_draft", "real memory write authorization package guard 不干净。"],
  ["asset_archive_candidate_draft", "asset archive candidate guard 不干净。"]
];

function optionalImportGuardIsClean(payload, fieldName) {
  const draft = payload?.[fieldName];
  if (draft === undefined) return true;
  if (!Object.prototype.hasOwnProperty.call(draft, "no_execution_guard")) return true;
  return runtimeGuard.guardIsClean(draft.no_execution_guard);
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
    for (const [fieldName, errorMessage] of optionalImportGuardFields) {
      if (!optionalImportGuardIsClean(payload, fieldName)) {
        errors.push(errorMessage);
      }
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

function buildV6ProductRuntimeDraft(createdAt) {
  const selectedItem = activeQueueItem();
  const sessionId = selectedItem?.session_id || `v6-session-${Date.now()}`;
  const taskId = selectedItem?.task_id || `task-${Date.now()}`;
  const caseId = selectedItem?.case_id || null;
  const visualGoal = els.v6TaskGoalInput.value.trim() || "未填写视觉目标";
  const stage = els.v6TaskStageSelect.value;
  const owner = els.v6TaskOwnerSelect.value;
  const nextAction = els.v6TaskNextInput.value.trim() || "未指定下一步";
  const blockedReason = els.v6TaskBlockedInput.value.trim() || null;
  const linkedSession = els.v6TaskSessionInput.value.trim() || sessionId;

  return {
    layer_name: "v6_product_runtime",
    layer_status: "draft_only",
    created_at: createdAt,
    no_execution_guard: runtimeGuard.clone(runtimeGuard.cleanGuard),

    task_panel: {
      task_id: taskId,
      visual_goal_cn: visualGoal,
      current_stage: stage,
      owner_role: owner,
      next_action: nextAction,
      blocked_reason_cn: blockedReason,
      linked_review_session_id: linkedSession,
      draft_only: true,
      side_effects_performed: false
    },

    asset_index: function () {
      var ref = els.v6AssetRefInput.value.trim() || "asset-draft-001";
      var hash = els.v6AssetHashInput.value.trim() || null;
      var status = els.v6AssetStatusSelect.value;
      var scoreRaw = els.v6AssetScoreInput.value.trim();
      var score = scoreRaw !== "" ? Number(scoreRaw) : null;
      if (score !== null && (isNaN(score) || score < 0 || score > 100)) { score = null; }
      var decision = els.v6AssetDecisionSelect.value;
      var memory = els.v6AssetMemorySelect.value;
      var caseId = els.v6AssetCaseInput.value.trim() || null;
      var filterVal = els.v6AssetFilterSelect.value;

      var entries = [{
        asset_id: "draft-001",
        asset_ref: ref,
        asset_hash: hash,
        asset_status: status,
        review_score: score,
        human_decision: decision,
        memory_suitability: memory,
        linked_case_id: caseId,
        linked_task_id: selectedItem ? (selectedItem.task_id || null) : null,
        source: "manual_draft",
        binary_stored: false,
        raw_path_stored: false,
        created_at: createdAt,
        updated_at: createdAt
      }];
      return {
        draft_only: true,
        side_effects_performed: false,
        no_execution_guard: runtimeGuard.clone(runtimeGuard.cleanGuard),
        filter_status: filterVal,
        entries: entries,
        total_entries: entries.length,
        indexed_count: 0,
        searchable: true
      };
    }(),

    session_store: function () {
      var rawRefs = els.v6SessionAssetRefsInput.value.trim();
      var assetRefs = rawRefs ? rawRefs.split(",").map(function (s) { return s.trim(); }).filter(function (s) { return s; }) : (caseId ? ["asset-" + caseId + "-001"] : []);
      var taskIdVal = els.v6SessionTaskIdInput.value.trim() || taskId;
      var importStatus = els.v6SessionImportStatusSelect.value;
      var reasonCn = els.v6SessionReasonInput.value.trim() || null;
      var restoreCand = els.v6SessionRestoreCheck.checked;
      var now = createdAt;
      return {
        session_id: sessionId,
        fingerprint: null,
        draft_only: true,
        side_effects_performed: false,
        no_execution_guard: runtimeGuard.clone(runtimeGuard.cleanGuard),
        current_session: {
          session_id: sessionId,
          fingerprint: null,
          linked_task_id: taskIdVal,
          linked_asset_refs: assetRefs,
          export_ready: true,
          import_compatible: true,
          restore_candidate: restoreCand,
          created_at: now,
          updated_at: now
        },
        import_preview: {
          status: importStatus,
          reason_cn: reasonCn,
          candidate_session_id: null,
          candidate_fingerprint: null,
          side_effects_performed: false
        },
        session_list: {
          entries: [{
            session_id: sessionId,
            fingerprint: null,
            linked_task_id: taskIdVal,
            linked_asset_refs: assetRefs,
            source: "current_runtime",
            restore_candidate: restoreCand,
            stale: false,
            tampered: false,
            incompatible: false,
            raw_payload_stored: false,
            disk_write_performed: false,
            created_at: now,
            updated_at: now
          }],
          total_entries: 1,
          visible_count: 1
        },
        boundary_cn: "所有变更保持 draft_only。raw_payload_stored=false, disk_write_performed=false, 无磁盘写入。"
      };
    }(),

    memory_queue: function () {
        var memItemId = els.v6MQMemoryItemId.value.trim() || "mem-item-" + Date.now();
        var linkedTaskId = els.v6MQLinkedTaskId.value.trim() || taskId;
        var linkedAssetRef = els.v6MQLinkedAssetRef.value.trim() || null;
        var linkedSessionId = els.v6MQLinkedSessionId.value.trim() || sessionId;
        var diaryTitle = els.v6MQDiaryTitle.value.trim() || "记忆草案条目";
        var diaryPreview = els.v6MQDiaryPreview.value.trim() || "未填写中文记忆正文预览。";
        var approvalStatus = els.v6MQApprovalSelect.value;
        var reviewerRole = els.v6MQReviewerRoleSelect.value;
        var shouldWriteToVcp = els.v6MQShouldWriteCheck.checked;
        var blockReasonCn = els.v6MQBlockReasonInput.value.trim() || null;
        var rejectReasonCn = els.v6MQRejectReasonInput.value.trim() || null;
        var now = createdAt;

        var entries = [{
          memory_item_id: memItemId,
          linked_task_id: linkedTaskId,
          linked_asset_ref: linkedAssetRef,
          linked_session_id: linkedSessionId,
          chinese_diary_title: diaryTitle,
          chinese_diary_content_preview: diaryPreview,
          approval_status: approvalStatus,
          reviewer_role: reviewerRole,
          should_write_to_vcp: shouldWriteToVcp,
          write_authorized: false,
          write_performed: false,
          canonical_location_verified: false,
          canonical_hash_matched: false,
          block_reason_cn: blockReasonCn,
          reject_reason_cn: rejectReasonCn,
          contains_secret: false,
          contains_private_path: false,
          contains_customer_private_data: false,
          image_binary_included: false,
          raw_payload_stored: false,
          created_at: now,
          updated_at: now
        }];

        var pendCount = 0, apprCount = 0, rejCount = 0, blkCount = 0;
        for (var i2 = 0; i2 < entries.length; i2++) {
          var s = entries[i2].approval_status;
          if (s === "pending") { pendCount++; }
          else if (s === "approved") { apprCount++; }
          else if (s === "rejected") { rejCount++; }
          else if (s === "blocked") { blkCount++; }
        }

        return {
          draft_only: true,
          side_effects_performed: false,
          no_execution_guard: runtimeGuard.clone(runtimeGuard.cleanGuard),
          queue_status: "draft_queue",
          entries: entries,
          counts: {
            total: entries.length,
            pending: pendCount,
            approved: apprCount,
            rejected: rejCount,
            blocked: blkCount
          },
          boundary_cn: "所有行为保持 draft_only / no-execution。write_authorized=false, write_performed=false, canonical_location_verified=false。should_write_to_vcp 只代表未来写入申请意图，不代表已写入。"
        };
      }(),

    dispatch_plan_draft: function () {
        var selPluginId = els.v6DispatchSelectPlugin.value;
        var selPlugin = pluginCandidates.find(function (p) { return p.plugin_id === selPluginId; }) || pluginCandidates[0];
        var paramKey = els.v6DispatchParamKey.value.trim() || "prompt";
        var paramVal = els.v6DispatchParamValue.value.trim() || "";
        var expectedOut = parseInt(els.v6DispatchExpectedOutputs.value, 10) || 1;
        var maxOut = parseInt(els.v6DispatchMaxOutputs.value, 10) || 1;

        return {
          draft_only: true,
          side_effects_performed: false,
          no_execution_guard: runtimeGuard.clone(runtimeGuard.cleanGuard),

          dispatch_id: "dispatch-" + Date.now(),
          linked_task_id: els.v6DispatchLinkedTaskId.value.trim() || taskId,

          selected_plugin: {
            plugin_id: selPlugin.plugin_id,
            display_name: els.v6DispatchPluginName.value.trim() || selPlugin.display_name,
            input_mode: selPlugin.input_mode,
            output_mode: selPlugin.output_mode,
            source: "local_draft_fixture",
            real_manifest_loaded: false,
            real_plugin_available_confirmed: false
          },

          fallback_plugins: pluginCandidates
            .filter(function (p) { return p.plugin_id !== selPluginId; })
            .map(function (p) { return { plugin_id: p.plugin_id, display_name: p.display_name, reason_cn: "", source: "local_draft_fixture" }; }),

          reason_cn: els.v6DispatchReasonCn.value.trim() || "",

          parameters: [{
            key: paramKey,
            value_preview: paramVal,
            value_source: "manual_draft",
            raw_secret_stored: false,
            raw_endpoint_stored: false,
            raw_path_stored: false
          }],

          expected_outputs: expectedOut,
          max_outputs: maxOut,

          dry_run_required: true,
          execution_blocked: true,
          max_plugin_calls: 0,
          allow_file_write: false,
          allow_image_binary: false,
          risk_level: "low",
          gatekeeper_required: true,
          gatekeeper_status: "required",
          dispatch_status: "draft",
          trace_state: "dispatch_draft",

          forbidden_actions: ["execute", "generate", "run", "call_plugin", "write_memory", "write_image_file"],

          boundary_cn: "所有行为保持 draft_only / no-execution。dry_run_required=true, execution_blocked=true, max_plugin_calls=0, real_manifest_loaded=false, raw_secret/endpoint/path stored=false。"
        };
      }()
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
  const memoryCompletionState = buildMemoryCompletionState(memoryContent, memoryApproval);
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
  const selectedDraftItem = reviewQueueDraft.find((item) => item.queue_id === selectedQueueId) || reviewQueueDraft[0];
  const selectedRiskSummary = riskSummaryForItem(selectedDraftItem);
  const batchReviewSummaryDraft = buildBatchReviewSummary(reviewQueueDraft);
  const riskReviewSummaryDraft = buildRiskReviewSummary(reviewQueueDraft);
  const batchDecisionDraft = buildBatchDecisionDraft(reviewQueueDraft, batchReviewSummaryDraft);
  const a5PreauthorizationReviewPackageDraft = buildA5PreauthorizationReviewPackage(
    batchDecisionDraft,
    batchReviewSummaryDraft,
    riskReviewSummaryDraft
  );
  const inactiveAuthorizationCapsulesDraft = buildInactiveAuthorizationCapsulesDraft({
    createdAt,
    batchDecision: batchDecisionDraft,
    batchSummary: batchReviewSummaryDraft,
    riskSummary: riskReviewSummaryDraft
  });
  const humanInspectionChecklistDraft = buildHumanInspectionChecklistDraft(
    reviewQueueDraft,
    batchReviewSummaryDraft,
    batchDecisionDraft,
    riskReviewSummaryDraft
  );
  const humanOverrideTraceabilityDraft = buildHumanOverrideTraceabilityDraft({
    createdAt,
    queueDraft: reviewQueueDraft,
    selectedItem: selectedDraftItem,
    version,
    score,
    assetStatus,
    memoryApproval,
    humanApproval,
    humanReview,
    annotationText,
    issuesText,
    riskSummary: selectedRiskSummary
  });
  const acceptedCandidateDeliveryPackageDraft = buildAcceptedCandidateDeliveryPackageDraft({
    createdAt,
    selectedItem: selectedDraftItem,
    version,
    score,
    assetStatus,
    memoryApproval,
    humanApproval,
    memoryContent,
    memoryDeltaId,
    riskSummary: selectedRiskSummary,
    humanOverrideTraceabilityDraft
  });
  const runtimeReviewStateDraft = buildRuntimeReviewStateDraft({
    createdAt,
    reviewQueueDraft,
    selectedItem: selectedDraftItem,
    assetStatus,
    memoryApproval,
    memoryCompletionState,
    humanApproval,
    selectedRiskSummary,
    acceptedCandidateDeliveryPackageDraft,
    humanOverrideTraceabilityDraft
  });
  const localCommitScopePlanDraft = buildLocalCommitScopePlanDraft({
    createdAt,
    runtimeReviewStateDraft
  });
  const adapterDryRunHandoffDraft = runtimeGuard.clone(session.adapter_dry_run_handoff);
  const bridgeMockRoundtripCandidateDraft = buildBridgeMockRoundtripCandidateDraft({
    createdAt,
    adapterHandoffDraft: adapterDryRunHandoffDraft,
    reviewQueueDraft,
    runtimeReviewStateDraft,
    acceptedCandidateDeliveryPackageDraft
  });
  const realBridgeAuthorizationPackageDraft = buildRealBridgeAuthorizationPackageDraft({
    createdAt,
    bridgeMockRoundtripCandidateDraft
  });
  const pluginReliabilityPromptDisciplineDraft = buildPluginReliabilityPromptDisciplineDraft({
    createdAt,
    selectedRiskSummary
  });
  const memoryWriteCompletionCandidateDraft = buildMemoryWriteCompletionCandidateDraft({
    createdAt,
    memoryCompletionState,
    memoryDeltaDraft: {
      target_notebook: session.memory_preview.target_notebook
    }
  });
  const singleRealGenerationRetryGateDraft = buildSingleRealGenerationRetryGateDraft({
    createdAt,
    pluginReliabilityPromptDisciplineDraft,
    acceptedCandidateDeliveryPackageDraft,
    runtimeReviewStateDraft
  });
  const realMemoryWriteAuthorizationPackageDraft = buildRealMemoryWriteAuthorizationPackageDraft({
    createdAt,
    memoryWriteCompletionCandidateDraft,
    memoryCompletionState,
    memoryDeltaDraft: {
      target_notebook: session.memory_preview.target_notebook,
      memory_type: "style_review_handoff"
    }
  });
  const assetArchiveCandidateDraft = buildAssetArchiveCandidateDraft({
    createdAt,
    selectedItem: selectedDraftItem,
    version,
    score,
    assetStatus,
    humanApproval,
    selectedRiskSummary,
    acceptedCandidateDeliveryPackageDraft,
    humanOverrideTraceabilityDraft
  });

  const v6Draft = buildV6ProductRuntimeDraft(createdAt);

  const runtimeSessionExportDraft = buildRuntimeSessionExportDraft({
    createdAt,
    reviewQueueDraft,
    batchReviewSummaryDraft,
    batchDecisionDraft,
    riskReviewSummaryDraft,
    a5PreauthorizationReviewPackageDraft,
    humanInspectionChecklistDraft,
    humanOverrideTraceabilityDraft,
    acceptedCandidateDeliveryPackageDraft,
    inactiveAuthorizationCapsulesDraft,
    runtimeReviewStateDraft,
    localCommitScopePlanDraft,
    bridgeMockRoundtripCandidateDraft,
    realBridgeAuthorizationPackageDraft,
    pluginReliabilityPromptDisciplineDraft,
    memoryWriteCompletionCandidateDraft,
    singleRealGenerationRetryGateDraft,
    realMemoryWriteAuthorizationPackageDraft,
    assetArchiveCandidateDraft,
    v6ProductRuntimeDraft: v6Draft
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
    inactive_authorization_capsules_draft: inactiveAuthorizationCapsulesDraft,
    human_inspection_checklist_draft: humanInspectionChecklistDraft,
    human_override_traceability_draft: humanOverrideTraceabilityDraft,
    accepted_candidate_delivery_package_draft: acceptedCandidateDeliveryPackageDraft,
    runtime_review_state_draft: runtimeReviewStateDraft,
    local_commit_scope_plan_draft: localCommitScopePlanDraft,
    bridge_mock_roundtrip_candidate_draft: bridgeMockRoundtripCandidateDraft,
    real_bridge_authorization_package_draft: realBridgeAuthorizationPackageDraft,
    plugin_reliability_prompt_discipline_draft: pluginReliabilityPromptDisciplineDraft,
    memory_write_completion_candidate_draft: memoryWriteCompletionCandidateDraft,
    single_real_generation_retry_gate_draft: singleRealGenerationRetryGateDraft,
    real_memory_write_authorization_package_draft: realMemoryWriteAuthorizationPackageDraft,
    asset_archive_candidate_draft: assetArchiveCandidateDraft,
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
    memory_completion_state_draft: memoryCompletionState,
    adapter_dry_run_handoff_draft: adapterDryRunHandoffDraft,
    v6_product_runtime_draft: v6Draft,
    prototype_guard: runtimeGuard.clone(draftGuard)
  };
}

function previewDraftWithHost(draft) {
  runtimeGuard.assertDraftSafe(draft);
  const ack = bridge.previewDraft(runtimeGuard.clone(draft));
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

function traceabilityRowText(row) {
  const scopeLabel = row.is_delivery_package_row ? "交付包草案" : "队列追踪项";
  return [
    `${scopeLabel} · ${row.traceability_class_cn} · ${row.title_cn} (${row.queue_id})`,
    `资产：${row.asset_status_cn} · 评审：${row.review_status_cn}`,
    `来源：${row.human_decision_source_cn} · 时间：${row.human_decision_at}`,
    `原因：${row.override_reason_cn}`,
    `偏差：${row.known_deviation_summary_cn}`,
    `prompt：${row.prompt_compliance_summary_cn}`,
    `记忆：${row.memory_suitability_summary_cn}`
  ].join("\n");
}

function renderTraceabilityList(el, items) {
  el.innerHTML = "";
  if (!Array.isArray(items) || items.length === 0) {
    const empty = document.createElement("li");
    empty.className = "traceability-empty";
    empty.textContent = "暂无可追踪条目。";
    el.appendChild(empty);
    return;
  }
  for (const row of items) {
    const listItem = document.createElement("li");
    listItem.dataset.traceabilityClass = row.traceability_class_key;
    listItem.dataset.promptComplete = String(row.prompt_compliance_complete);
    listItem.dataset.memorySuitable = String(row.memory_suitable);
    listItem.dataset.deliveryPackage = String(row.is_delivery_package_row);
    listItem.textContent = traceabilityRowText(row);
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

function renderInactiveAuthorizationCapsules(capsulePackage) {
  els.authCapsuleStatus.textContent = capsulePackage.authorization_status;
  els.authCapsuleCount.textContent = `${capsulePackage.capsule_count} 个`;
  els.authCapsuleBoundary.textContent = capsulePackage.activation_boundary_cn;
  renderList(
    els.authCapsuleTypes,
    capsulePackage.capsules.map(
      (capsule) => `${capsule.title_cn}：${capsule.authorization_status}，候选 ${capsule["candidate_refs"].length} 个`
    )
  );
  renderList(els.authCapsuleForbidden, capsulePackage.forbidden_outputs_cn);
  renderList(els.authCapsuleSanitization, capsulePackage.capsules[0]?.sanitization_rules_cn || []);
  renderList(
    els.authCapsuleRollback,
    Array.from(new Set(capsulePackage.capsules.map((capsule) => capsule.rollback_plan_cn)))
  );
  els.authCapsuleText.textContent = JSON.stringify(capsulePackage, null, 2);
}

function renderDeliveryPackage(deliveryPackage) {
  els.deliveryPackageStatus.textContent = `${deliveryPackage.package_status_cn} / ${deliveryPackage.delivery_readiness_cn}`;
  els.deliveryPackageCandidate.textContent = `${deliveryPackage.selected_candidate_title_cn} (${deliveryPackage.selected_candidate_version_id})`;
  els.deliveryPackageHash.textContent = deliveryPackage.sanitized_asset_hash;
  els.deliveryPackageScoreBand.textContent = `${deliveryPackage.review_score} / 100，${deliveryPackage.review_score_band}`;
  els.deliveryPackageRisk.textContent = deliveryPackage.risk_summary_cn;
  els.deliveryPackageHumanApproval.textContent = deliveryPackage.human_approval_summary_cn;
  const deliveryMemoryCompletionState = deliveryPackage.memory_delta_preview.completion_state || {};
  els.deliveryPackageMemoryPreview.textContent = `${deliveryPackage.memory_delta_preview.title_cn}；${writeRequestLabel(
    deliveryMemoryCompletionState.write_requested ?? deliveryPackage.memory_delta_preview.should_write_to_vcp
  )}`;
  els.deliveryPackageRules.textContent = deliveryPackage.reusable_rule_summary_cn;
  els.deliveryPackageBoundary.textContent = "draft_only=true；submitDraft_called=false；没有真实插件/API/DailyNote/VCP memory/图片动作。";
}

function renderRuntimeReviewState(runtimeReviewState) {
  const state = runtimeReviewState.normalized_state;
  els.runtimeStateUnified.textContent = `${state.asset_state_cn} / ${runtimeReviewState.convergence_status_cn}`;
  els.runtimeStateAsset.textContent = `${state.review_status_cn} / ${state.asset_state_key}`;
  els.runtimeStateMemory.textContent = `${state.memory_status_cn}；${writeRequestLabel(state.write_requested)}；真实写入=${state.write_performed}`;
  els.runtimeStateDelivery.textContent = `${state.delivery_readiness_cn}`;
  els.runtimeStateOverride.textContent = state.human_override_performed
    ? "已记录人工覆盖接受，不能声明 prompt compliance 完整"
    : "未记录人工覆盖接受";
  renderList(
    els.runtimeStateMismatches,
    runtimeReviewState.mismatch_items_cn.length > 0 ? runtimeReviewState.mismatch_items_cn : ["未发现状态矛盾。"]
  );
  els.runtimeStateBoundary.textContent = `${runtimeReviewState.summary_cn} ${runtimeReviewState.boundary_cn}`;
}

function renderHumanOverrideTraceability(traceability) {
  const counts = traceability.traceability_counts || {};
  els.overrideDecisionSource.textContent = traceability.human_decision_source_cn;
  els.overrideReason.textContent = traceability.override_reason_cn;
  els.overrideDeviation.textContent = traceability.known_deviation_summary_cn;
  els.overridePromptCompliance.textContent = traceability.prompt_compliance_summary_cn;
  els.overrideMemorySuitability.textContent = traceability.memory_suitability_summary_cn;
  els.overrideBoundary.textContent = "人工覆盖轨迹只用于本地审计，不触发真实 submitDraft、DailyNote 或 VCP memory 写入。";
  els.traceabilityTotal.textContent = String(counts.total || 0);
  els.traceabilityAccepted.textContent = String(counts.accepted || 0);
  els.traceabilityAcceptedCandidate.textContent = String(counts.accepted_candidate || 0);
  els.traceabilityHumanOverride.textContent = String(counts.human_override || 0);
  els.traceabilityRejected.textContent = String(counts.rejected || 0);
  els.traceabilityNeedsHumanReview.textContent = String(counts.needs_human_review || 0);
  els.traceabilityPromptComplete.textContent = String(counts.prompt_complete || 0);
  els.traceabilityMemorySuitable.textContent = String(counts.memory_suitable || 0);
  els.traceabilitySummary.textContent = traceability.traceability_summary_cn;
  els.traceabilityBoundary.textContent = traceability.traceability_boundary_cn;
  renderTraceabilityList(els.traceabilityList, traceability.traceability_items);
}

function renderLocalCommitScopePlan(commitScopePlan) {
  const scopeById = Object.fromEntries(commitScopePlan.scope_groups.map((group) => [group.group_id, group]));
  els.commitScopeStatus.textContent = commitScopePlan.plan_status_cn;
  els.commitScopeBranch.textContent = commitScopePlan.branch_ref;
  els.commitScopeStaged.textContent = commitScopePlan.staged_changes_present ? "存在 staged changes" : "无 staged changes";
  els.commitScopeRemote.textContent =
    commitScopePlan.tag_allowed || commitScopePlan.push_allowed || commitScopePlan.pr_allowed || commitScopePlan.release_allowed
      ? "存在远端/版本动作风险"
      : "远端/版本动作未授权";
  renderList(els.commitScopeRuntime, scopeById.runtime_prototype?.files_cn || []);
  renderList(els.commitScopeValidators, scopeById.validators?.files_cn || []);
  renderList(els.commitScopeDocs, scopeById.docs_indexes?.files_cn || []);
  renderList(els.commitScopeAgentBoard, scopeById.agent_board?.files_cn || []);
  renderList(els.commitScopeUntracked, commitScopePlan.intentionally_untracked_refs);
  renderList(els.commitScopeRollback, commitScopePlan.rollback_guidance_cn);
}

function renderBridgeMockRoundtrip(roundtripDraft) {
  els.bridgeRoundtripStatus.textContent = `${roundtripDraft.roundtrip_status_cn} / ${roundtripDraft.bridge_mode}`;
  renderList(els.bridgeRoundtripMethods, [
    `允许：${roundtripDraft.selected_methods.join(" -> ")}`,
    `禁止：${roundtripDraft.forbidden_methods.join("、")}`
  ]);
  const calls = roundtripDraft.bridge_calls_observed;
  renderList(els.bridgeRoundtripCalls, [
    `mock_only=${calls.mock_only}`,
    `loadSession=${calls.loadSession}`,
    `previewDraft=${calls.previewDraft}`,
    `submitDraft=${calls.submitDraft}`,
    `production_submitDraft=${calls.production_submitDraft}`
  ]);
  renderList(
    els.bridgeRoundtripAck,
    roundtripDraft.ack_summaries.map(
      (ack) => `${ack.selected_method}：keys=${ack.ack_keys.join(", ")}；side_effects=${ack.side_effects_performed}`
    )
  );
  renderList(els.bridgeRoundtripGuards, [
    `plugin_called=${roundtripDraft.plugin_called}`,
    `api_called=${roundtripDraft.api_called}`,
    `daily_note_called=${roundtripDraft.daily_note_called}`,
    `vcp_memory_written=${roundtripDraft.vcp_memory_written}`,
    `image_created=${roundtripDraft.image_created}`,
    `guard_clean=${runtimeGuard.guardIsClean(roundtripDraft.no_execution_guard)}`
  ]);
  els.bridgeRoundtripBoundary.textContent = roundtripDraft.boundary_cn;
}

function renderRealBridgeAuthorizationPackage(packageDraft) {
  els.realBridgeAuthStatus.textContent = `${packageDraft.package_status_cn} / ${packageDraft.authorization_status}`;
  renderList(els.realBridgeAuthMethods, [
    `允许方法：${packageDraft.allowed_methods.join("、")}`,
    `禁止方法：${packageDraft.forbidden_methods.join("、")}`,
    `每方法最大调用：${packageDraft.max_bridge_calls_per_method}`
  ]);
  renderList(els.realBridgeAuthRequired, packageDraft.required_authorization_fields);
  renderList(els.realBridgeAuthForbidden, packageDraft.forbidden_outputs_cn);
  els.realBridgeAuthBoundary.textContent = packageDraft.boundary_cn;
}

function renderPluginReliabilityPromptDiscipline(draft) {
  const family = draft.prompt_families[0] || {};
  els.promptReliabilityStatus.textContent = `${draft.package_status_cn} / ${draft.reliability_status}`;
  els.promptReliabilityHash.textContent = `${draft.prompt_hash} / ${draft.model_lock.requested_model}`;
  renderList(
    els.promptReliabilityRules,
    [...(family.prompt_lint_rules_cn || []), `禁止项数量：${draft.lint_result.banned_subject_count}`]
  );
  renderList(els.promptReliabilityFailures, draft.failure_taxonomy.map((item) => `${item.label_cn}：${item.rule_cn}`));
  els.promptReliabilityBoundary.textContent = draft.boundary_cn;
}

function renderMemoryWriteCompletionCandidate(draft) {
  els.memoryCompletionCandidateStatus.textContent = `${draft.package_status_cn} / ${draft.candidate_status}`;
  renderList(els.memoryCompletionCandidateCriteria, [
    `请求必须存在：${draft.completion_criteria.write_requested_required}`,
    `授权必须存在：${draft.completion_criteria.write_authorized_required}`,
    `writer 必须执行：${draft.completion_criteria.writer_executed_required}`,
    `canonical 位置必须存在：${draft.completion_criteria.canonical_target_exists_required}`,
    `canonical hash 必须匹配：${draft.completion_criteria.canonical_target_hash_matches_required}`,
    `plugin success 充分：${draft.completion_criteria.plugin_success_sufficient}`
  ]);
  renderList(
    els.memoryCompletionCandidateObserved,
    Object.entries(draft.observed_state).map(([key, value]) => `${key}=${value}`)
  );
  renderList(els.memoryCompletionCandidateFailures, draft.failure_closeout_template_cn);
  els.memoryCompletionCandidateBoundary.textContent = draft.boundary_cn;
}

function renderSingleRealGenerationRetryGate(draft) {
  els.generationRetryGateStatus.textContent = `${draft.package_status_cn} / ${draft.authorization_status}`;
  renderList(els.generationRetryGatePlugin, [
    `插件：${draft.selected_plugin_id}`,
    `命令：${draft.selected_plugin_command}`,
    `模型：${draft.requested_model}`,
    `未来最大调用：${draft.max_plugin_calls_per_run}`,
    `已观察调用：${draft.plugin_calls_observed}`
  ]);
  renderList(els.generationRetryGatePrompt, [
    `prompt family：${draft.prompt_family_ref}`,
    `prompt hash：${draft.prompt_hash}`,
    ...draft.prompt_policy_cn
  ]);
  renderList(els.generationRetryGateGuards, [
    `overwrite_existing_files_allowed=${draft.output_directory_policy.overwrite_existing_files_allowed}`,
    `raw_path_stored=${draft.output_directory_policy.raw_path_stored}`,
    `real_generation_performed=${draft.real_generation_performed}`,
    `image_created=${draft.image_created}`,
    `memory_write_allowed_by_this_record=${draft.memory_write_block.memory_write_allowed_by_this_record}`
  ]);
  renderList(els.generationRetryGateAuthorization, draft.required_authorization_fields);
  els.generationRetryGateBoundary.textContent = draft.boundary_cn;
}

function renderRealMemoryWriteAuthorizationPackage(draft) {
  els.memoryWriteAuthStatus.textContent = `${draft.package_status_cn} / ${draft.authorization_status}`;
  renderList(els.memoryWriteAuthCounts, [
    `max_daily_note_writes=${draft.max_daily_note_writes}`,
    `max_vcp_memory_writes=${draft.max_vcp_memory_writes}`,
    `max_retry_attempts=${draft.max_retry_attempts}`,
    `raw_path_stored=${draft.target_refs["raw_path_stored"]}`
  ]);
  renderList(els.memoryWriteAuthRules, draft.content_rules_cn);
  renderList(els.memoryWriteAuthReject, [
    ...draft.reject_path_cn,
    `no_success_fabrication_rule=${draft.no_success_fabrication_rule}`,
    `plugin_success_sufficient=${draft.completion_preflight_ref.plugin_success_sufficient}`
  ]);
  els.memoryWriteAuthBoundary.textContent = draft.boundary_cn;
}

function renderAssetArchiveCandidate(draft) {
  els.assetArchiveCandidateStatus.textContent = `${draft.package_status_cn} / ${draft.asset_status_classification}`;
  renderList(els.assetArchiveCandidateFields, [
    `archive_policy=${draft.archive_policy}`,
    `output_path_ref=${draft.output_path_ref}`,
    `asset_hash=${draft.asset_hash}`,
    `score=${draft.review_score} / ${draft.review_score_band}`,
    `raw_output_path_stored=${draft.raw_output_path_stored}`,
    `binary_storage_allowed=${draft.binary_storage_allowed}`
  ]);
  renderList(
    els.assetArchiveCandidateCloseouts,
    draft.closeout_templates.map((item) => `${item.asset_status}：${item.template_cn}`)
  );
  els.assetArchiveCandidateBoundary.textContent = `${draft.sanitized_review_summary_cn} ${draft.boundary_cn}`;
}

function renderV6ProductRuntime(draft) {
  const v6 = draft.v6_product_runtime_draft;
  if (!v6) { return; }

  // Task Panel — sync form inputs with draft
  const tp = v6.task_panel;
  if (els.v6TaskGoalInput.value !== tp.visual_goal_cn && tp.visual_goal_cn !== "未填写视觉目标") {
    els.v6TaskGoalInput.value = tp.visual_goal_cn;
  }
  els.v6TaskStageSelect.value = tp.current_stage;
  els.v6TaskOwnerSelect.value = tp.owner_role;
  if (els.v6TaskNextInput.value !== tp.next_action && tp.next_action !== "未指定下一步") {
    els.v6TaskNextInput.value = tp.next_action;
  }
  if (tp.blocked_reason_cn) els.v6TaskBlockedInput.value = tp.blocked_reason_cn;
  if (tp.linked_review_session_id) els.v6TaskSessionInput.value = tp.linked_review_session_id;

  // Readout
  els.v6TaskId.textContent = tp.task_id || "-";
  els.v6TaskStage.textContent = tp.current_stage;
  els.v6TaskOwner.textContent = tp.owner_role;
  els.v6TaskGuard.textContent = (tp.draft_only && !tp.side_effects_performed) ? "clean" : "dirty";

  // Asset Index — sync form readout from draft
  const assetEntry = v6.asset_index.entries[0] || {};
  const filterStatus = v6.asset_index.filter_status || "all";
  els.v6AssetRefRead.textContent = assetEntry.asset_ref || "-";
  els.v6AssetHashRead.textContent = assetEntry.asset_hash || "未设置";
  els.v6AssetStatusRead.textContent = assetEntry.asset_status || "-";
  els.v6AssetScoreRead.textContent = assetEntry.review_score != null ? String(assetEntry.review_score) : "null";
  els.v6AssetDecisionRead.textContent = assetEntry.human_decision || "-";
  els.v6AssetMemoryRead.textContent = assetEntry.memory_suitability || "-";
  els.v6AssetCaseRead.textContent = assetEntry.linked_case_id || "-";

  // Filter visible count
  var visibleCount = 0;
  var allEntries = v6.asset_index.entries || [];
  for (var ei = 0; ei < allEntries.length; ei++) {
    var e = allEntries[ei];
    var match = false;
    if (filterStatus === "all") { match = true; }
    else if (filterStatus === "memory_suitable") { match = e.memory_suitability === "suitable"; }
    else { match = e.asset_status === filterStatus; }
    if (match) { visibleCount++; }
  }
  els.v6AssetVisibleCount.textContent = visibleCount + "/" + allEntries.length;
  els.v6AssetFilterCount.textContent = allEntries.length + " total, " + visibleCount + " visible (filter: " + filterStatus + ")";

  // Sync backward: if the entry's field differs from form, update form (draft -> input)
  if (els.v6AssetRefInput.value !== assetEntry.asset_ref && assetEntry.asset_ref && assetEntry.asset_ref !== "asset-draft-001") {
    els.v6AssetRefInput.value = assetEntry.asset_ref;
  }
  if (assetEntry.asset_hash && els.v6AssetHashInput.value !== assetEntry.asset_hash) {
    els.v6AssetHashInput.value = assetEntry.asset_hash;
  }
  els.v6AssetStatusSelect.value = assetEntry.asset_status || "draft";
  if (assetEntry.review_score != null) {
    els.v6AssetScoreInput.value = assetEntry.review_score;
  }
  els.v6AssetDecisionSelect.value = assetEntry.human_decision || "pending";
  els.v6AssetMemorySelect.value = assetEntry.memory_suitability || "not_evaluated";
  if (assetEntry.linked_case_id && els.v6AssetCaseInput.value !== assetEntry.linked_case_id) {
    els.v6AssetCaseInput.value = assetEntry.linked_case_id;
  }
  els.v6AssetFilterSelect.value = filterStatus;

  // Session Store — readout only (form→builder sync happens via draft→render)
  var ss = v6.session_store;
  var cs = ss.current_session || {};
  var ip = ss.import_preview || {};
  var sl = ss.session_list || {};

  els.v6SessionId.textContent = cs.session_id || "-";
  els.v6SessionFingerprint.textContent = cs.fingerprint || "待计算";
  els.v6SessionExportable.textContent = cs.export_ready ? "是" : "否";
  els.v6SessionImportCompatible.textContent = cs.import_compatible ? "是" : "否";
  els.v6SessionListCount.textContent = String(sl.total_entries != null ? sl.total_entries : 0);
  els.v6SessionTaskIdRead.textContent = cs.linked_task_id || "-";
  els.v6SessionAssetRefsRead.textContent = Array.isArray(cs.linked_asset_refs) ? cs.linked_asset_refs.join(", ") : "-";
  els.v6SessionImportStatusRead.textContent = ip.status || "not_loaded";
  els.v6SessionReasonRead.textContent = ip.reason_cn || "-";
  els.v6SessionRestoreRead.textContent = cs.restore_candidate ? "是" : "否";
  els.v6SessionVisibleCount.textContent = (sl.visible_count != null ? sl.visible_count : 0) + "/" + (sl.total_entries != null ? sl.total_entries : 0);

  // v6.4 Memory Queue — sync form inputs and readout from draft
  var mq = v6.memory_queue;
  if (mq) {
    var mqEntry = (mq.entries && mq.entries[0]) || {};
    els.v6MQMemoryItemId.value = mqEntry.memory_item_id || "mem-item-" + Date.now();
    if (mqEntry.linked_task_id) els.v6MQLinkedTaskId.value = mqEntry.linked_task_id;
    if (mqEntry.linked_asset_ref) els.v6MQLinkedAssetRef.value = mqEntry.linked_asset_ref;
    if (mqEntry.linked_session_id) els.v6MQLinkedSessionId.value = mqEntry.linked_session_id;
    if (mqEntry.chinese_diary_title) els.v6MQDiaryTitle.value = mqEntry.chinese_diary_title;
    if (mqEntry.chinese_diary_content_preview) els.v6MQDiaryPreview.value = mqEntry.chinese_diary_content_preview;
    els.v6MQApprovalSelect.value = mqEntry.approval_status || "pending";
    els.v6MQReviewerRoleSelect.value = mqEntry.reviewer_role || "ImageLab_Master";
    els.v6MQShouldWriteCheck.checked = mqEntry.should_write_to_vcp === true;
    if (mqEntry.block_reason_cn) els.v6MQBlockReasonInput.value = mqEntry.block_reason_cn;
    if (mqEntry.reject_reason_cn) els.v6MQRejectReasonInput.value = mqEntry.reject_reason_cn;

    els.v6MQMemoryItemIdRead.textContent = mqEntry.memory_item_id || "-";
    els.v6MQLinkedTaskIdRead.textContent = mqEntry.linked_task_id || "-";
    els.v6MQLinkedAssetRefRead.textContent = mqEntry.linked_asset_ref || "-";
    els.v6MQLinkedSessionIdRead.textContent = mqEntry.linked_session_id || "-";
    els.v6MQApprovalRead.textContent = mqEntry.approval_status || "pending";
    els.v6MQReviewerRoleRead.textContent = mqEntry.reviewer_role || "ImageLab_Master";
    els.v6MQShouldWriteRead.textContent = mqEntry.should_write_to_vcp ? "true（未来写入申请意图）" : "false";
    els.v6MQWriteAuthorizedRead.textContent = "false";
    els.v6MQWritePerformedRead.textContent = "false";
    els.v6MQCanonicalLocationRead.textContent = "false";

    var cnts = mq.counts || {};
    els.v6MQCountTotal.textContent = String(cnts.total != null ? cnts.total : 0);
    els.v6MQCountPending.textContent = String(cnts.pending != null ? cnts.pending : 0);
    els.v6MQCountApproved.textContent = String(cnts.approved != null ? cnts.approved : 0);
    els.v6MQCountRejected.textContent = String(cnts.rejected != null ? cnts.rejected : 0);
    els.v6MQCountBlocked.textContent = String(cnts.blocked != null ? cnts.blocked : 0);
    els.v6MQBoundaryText.textContent = mq.boundary_cn || "所有行为保持 draft_only / no-execution。";
  }

  // v6.8 Plugin Dashboard — sync dispatch_plan_draft readout
  var dpd = v6.dispatch_plan_draft;
  if (dpd) {
    els.v6DispatchId.textContent = dpd.dispatch_id || "-";
    els.v6DispatchLinkedTaskId.textContent = dpd.linked_task_id || "-";
    els.v6DispatchSelectPlugin.value = dpd.selected_plugin.plugin_id || "";
    els.v6DispatchPluginName.value = dpd.selected_plugin.display_name || "";
    els.v6DispatchInputMode.value = dpd.selected_plugin.input_mode || "";
    els.v6DispatchOutputMode.value = dpd.selected_plugin.output_mode || "";
    if (dpd.fallback_plugins && dpd.fallback_plugins.length > 0) {
      els.v6DispatchFallbackDisplay.textContent = dpd.fallback_plugins.map(function (f) { return f.plugin_id; }).join(", ");
    }
    els.v6DispatchReasonCn.value = dpd.reason_cn || "";
    if (dpd.parameters && dpd.parameters[0]) {
      els.v6DispatchParamKey.value = dpd.parameters[0].key || "";
      els.v6DispatchParamValue.value = dpd.parameters[0].value_preview || "";
      els.v6DispatchPreview.textContent = dpd.parameters[0].key + ": " + dpd.parameters[0].value_preview;
    }
    els.v6DispatchExpectedOutputs.value = String(dpd.expected_outputs || 1);
    els.v6DispatchMaxOutputs.value = String(dpd.max_outputs || 1);
    els.v6DispatchDryRunRequired.textContent = dpd.dry_run_required ? "true" : "false";
    els.v6DispatchExecBlocked.textContent = dpd.execution_blocked ? "true" : "false";
    els.v6DispatchMaxCalls.textContent = String(dpd.max_plugin_calls);
    els.v6DispatchAllowWrite.textContent = dpd.allow_file_write ? "true" : "false";
    els.v6DispatchAllowBinary.textContent = dpd.allow_image_binary ? "true" : "false";
    els.v6DispatchRiskLevel.textContent = dpd.risk_level || "low";
    if (dpd.forbidden_actions && dpd.forbidden_actions.length > 0) {
      els.v6DispatchForbiddenDisplay.textContent = dpd.forbidden_actions.join(", ");
    }
    els.v6DispatchGatekeeperRequired.textContent = dpd.gatekeeper_required ? "true" : "false";
    els.v6DispatchGatekeeperStatus.value = dpd.gatekeeper_status || "required";
    els.v6DispatchStatus.value = dpd.dispatch_status || "draft";
    els.v6DispatchTraceState.value = dpd.trace_state || "dispatch_draft";
    els.v6DispatchBoundaryText.textContent = dpd.boundary_cn || "所有行为保持 draft_only / no-execution。";
  }
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
  const memoryCompletionState = draft.memory_completion_state_draft;
  const handoffDraft = draft.adapter_dry_run_handoff_draft;
  const batchSummaryDraft = draft.batch_review_summary_draft;
  const batchDecisionDraft = draft.batch_decision_draft;
  const preauthPackageDraft = draft.a5_preauthorization_review_package_draft;
  const inactiveAuthorizationCapsulesDraft = draft.inactive_authorization_capsules_draft;
  const inspectionDraft = draft.human_inspection_checklist_draft;
  const humanOverrideTraceabilityDraft = draft.human_override_traceability_draft;
  const acceptedCandidateDeliveryPackageDraft = draft.accepted_candidate_delivery_package_draft;
  const runtimeReviewStateDraft = draft.runtime_review_state_draft;
  const localCommitScopePlanDraft = draft.local_commit_scope_plan_draft;
  const bridgeMockRoundtripCandidateDraft = draft.bridge_mock_roundtrip_candidate_draft;
  const realBridgeAuthorizationPackageDraft = draft.real_bridge_authorization_package_draft;
  const pluginReliabilityPromptDisciplineDraft = draft.plugin_reliability_prompt_discipline_draft;
  const memoryWriteCompletionCandidateDraft = draft.memory_write_completion_candidate_draft;
  const singleRealGenerationRetryGateDraft = draft.single_real_generation_retry_gate_draft;
  const realMemoryWriteAuthorizationPackageDraft = draft.real_memory_write_authorization_package_draft;
  const assetArchiveCandidateDraft = draft.asset_archive_candidate_draft;
  const sessionExportDraft = draft.runtime_session_export_draft;
  queueState = normalizeQueueItems(reviewDraft.review_queue);
  renderQueueList(reviewDraft.review_queue);
  renderBatchSummary(batchSummaryDraft);
  renderPreauthorizationPackage(batchDecisionDraft, preauthPackageDraft);
  renderInactiveAuthorizationCapsules(inactiveAuthorizationCapsulesDraft);
  renderInspectionSummary(inspectionDraft);
  renderHumanOverrideTraceability(humanOverrideTraceabilityDraft);
  renderDeliveryPackage(acceptedCandidateDeliveryPackageDraft);
  renderRuntimeReviewState(runtimeReviewStateDraft);
  renderLocalCommitScopePlan(localCommitScopePlanDraft);
  renderBridgeMockRoundtrip(bridgeMockRoundtripCandidateDraft);
  renderRealBridgeAuthorizationPackage(realBridgeAuthorizationPackageDraft);
  renderPluginReliabilityPromptDiscipline(pluginReliabilityPromptDisciplineDraft);
  renderMemoryWriteCompletionCandidate(memoryWriteCompletionCandidateDraft);
  renderSingleRealGenerationRetryGate(singleRealGenerationRetryGateDraft);
  renderRealMemoryWriteAuthorizationPackage(realMemoryWriteAuthorizationPackageDraft);
  renderAssetArchiveCandidate(assetArchiveCandidateDraft);
  renderSessionTransfer(sessionExportDraft);
  renderV6ProductRuntime(draft);
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
  els.summaryWriteRequest.textContent = writeRequestLabel(memoryCompletionState.write_requested);
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
  els.memoryPreviewDecision.textContent = writeRequestLabel(memoryCompletionState.write_requested);
  els.memoryPreviewBody.textContent = memoryDeltaDraft.chinese_diary_content || "未填写中文记忆正文。";
  els.memoryCompletionRequested.textContent = memoryCompletionState.write_requested_cn;
  els.memoryCompletionAuthorized.textContent = memoryCompletionState.write_authorized_cn;
  els.memoryCompletionPerformed.textContent = memoryCompletionState.write_performed_cn;
  els.memoryCompletionLocationVerified.textContent = memoryCompletionState.canonical_location_verified_cn;
  els.memoryCompletionHashMatched.textContent = memoryCompletionState.canonical_hash_matched_cn;
  els.memoryCompletionPluginSufficient.textContent = memoryCompletionState.plugin_success_sufficient_cn;
  els.memoryCompletionBoundary.textContent = memoryCompletionState.boundary_cn;
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
  els.memoryCardDecision.textContent = writeRequestLabel(memoryCompletionState.write_requested);
  els.memoryCardBody.textContent = memoryDeltaDraft.chinese_diary_content || "未填写中文记忆正文。";
  els.memoryCardBoundary.textContent = "当前只是写入申请草案，没有真实写入。";
  els.draftOutput.textContent = JSON.stringify(draft, null, 2);
  try {
    const ack = previewDraftWithHost(draft);
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
  // v6.2 Asset Index interaction listeners
  [els.v6AssetRefInput, els.v6AssetHashInput, els.v6AssetScoreInput, els.v6AssetCaseInput, els.v6AssetStatusSelect, els.v6AssetDecisionSelect, els.v6AssetMemorySelect, els.v6AssetFilterSelect].forEach(el => {
    if (el) {
      el.addEventListener("input", () => { trackedRender("编辑 Asset Index"); });
      el.addEventListener("change", () => { trackedRender("编辑 Asset Index"); });
    }
  });

  // v6.3 Session Store interaction listeners
  [els.v6SessionTaskIdInput, els.v6SessionAssetRefsInput, els.v6SessionImportStatusSelect, els.v6SessionReasonInput, els.v6SessionRestoreCheck].forEach(el => {
    if (el) {
      el.addEventListener("input", () => { trackedRender("编辑 Session Store"); });
      el.addEventListener("change", () => { trackedRender("编辑 Session Store"); });
    }
  });

  // v6.4 Memory Queue interaction listeners
  [els.v6MQLinkedTaskId, els.v6MQLinkedAssetRef, els.v6MQLinkedSessionId, els.v6MQDiaryTitle, els.v6MQDiaryPreview, els.v6MQApprovalSelect, els.v6MQReviewerRoleSelect, els.v6MQShouldWriteCheck, els.v6MQBlockReasonInput, els.v6MQRejectReasonInput].forEach(el => {
    if (el) {
      el.addEventListener("input", () => { trackedRender("编辑 Memory Queue"); });
      el.addEventListener("change", () => { trackedRender("编辑 Memory Queue"); });
    }
  });

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
