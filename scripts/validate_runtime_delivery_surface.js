const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const runtimeRoot = path.join(root, "review_console", "runtime_prototype");

const runtimeFiles = [
  "index.html",
  "styles.css",
  "runtime_guard.js",
  "host_bridge_mock.js",
  "app.js",
  "FIELD_MAPPING.md",
  "README.md"
];

const expectedScriptOrder = ["runtime_guard.js", "host_bridge_mock.js", "app.js"];
const expectedDomIds = [
  "taskId",
  "caseId",
  "assetRef",
  "assetBox",
  "queueFilter",
  "queueSearch",
  "queueSort",
  "queueTotal",
  "queueVisible",
  "queueProgress",
  "queueSelected",
  "queuePrev",
  "queueNext",
  "batchShowAuthorizable",
  "batchShowBlocked",
  "batchShowNext",
  "batchSelectVisible",
  "batchClearSelection",
  "batchMarkReview",
  "batchMarkBlocked",
  "batchMarkNoMemory",
  "batchSelectedCount",
  "batchOperationStatus",
  "undoLastAction",
  "historyStatus",
  "historyCount",
  "queueList",
  "batchTotal",
  "batchAccepted",
  "batchPending",
  "batchWriteRequests",
  "batchBlocked",
  "batchSummary",
  "batchWriteItems",
  "batchNextItems",
  "batchBlockedItems",
  "batchPreflightItems",
  "batchReport",
  "batchDecisionStatus",
  "batchDecisionReason",
  "preauthPackageStatus",
  "preauthPackageItems",
  "preauthPackageForbidden",
  "preauthPackageText",
  "authCapsuleStatus",
  "authCapsuleCount",
  "authCapsuleBoundary",
  "authCapsuleTypes",
  "authCapsuleForbidden",
  "authCapsuleSanitization",
  "authCapsuleRollback",
  "authCapsuleText",
  "deliveryPackageStatus",
  "deliveryPackageCandidate",
  "deliveryPackageHash",
  "deliveryPackageScoreBand",
  "deliveryPackageRisk",
  "deliveryPackageHumanApproval",
  "deliveryPackageMemoryPreview",
  "deliveryPackageRules",
  "deliveryPackageBoundary",
  "overrideDecisionSource",
  "overrideReason",
  "overrideDeviation",
  "overridePromptCompliance",
  "overrideMemorySuitability",
  "overrideBoundary",
  "traceabilityTotal",
  "traceabilityAccepted",
  "traceabilityAcceptedCandidate",
  "traceabilityHumanOverride",
  "traceabilityRejected",
  "traceabilityNeedsHumanReview",
  "traceabilityPromptComplete",
  "traceabilityMemorySuitable",
  "traceabilitySummary",
  "traceabilityBoundary",
  "traceabilityList",
  "sessionTransferStatus",
  "sessionTransferCount",
  "sessionTransferGuard",
  "sessionFingerprint",
  "sessionTransferText",
  "importPreviewStatus",
  "importPreviewItems",
  "exportSessionDraft",
  "validateImportDraft",
  "applyImportDraft",
  "humanScore",
  "humanScoreOut",
  "humanComment",
  "riskTextArtifact",
  "riskPersonFace",
  "riskCompositionShift",
  "riskBrandMark",
  "riskMemoryUnsuitable",
  "assetStatus",
  "humanApproved",
  "memoryContent",
  "memoryApproval",
  "inspectionVerdict",
  "runtimeStateUnified",
  "runtimeStateAsset",
  "runtimeStateMemory",
  "runtimeStateDelivery",
  "runtimeStateOverride",
  "runtimeStateMismatches",
  "runtimeStateBoundary",
  "inspectionChecklist",
  "inspectionRiskStats",
  "inspectionRiskGroups",
  "inspectionReport",
  "statusGlossaryList",
  "memoryCompletionRequested",
  "memoryCompletionAuthorized",
  "memoryCompletionPerformed",
  "memoryCompletionLocationVerified",
  "memoryCompletionHashMatched",
  "memoryCompletionPluginSufficient",
  "memoryCompletionBoundary",
  "hostStatus",
  "hostSubmittedAt",
  "commitScopeStatus",
  "commitScopeBranch",
  "commitScopeStaged",
  "commitScopeRemote",
  "commitScopeRuntime",
  "commitScopeValidators",
  "commitScopeDocs",
  "commitScopeAgentBoard",
  "commitScopeUntracked",
  "commitScopeRollback",
  "bridgeRoundtripStatus",
  "bridgeRoundtripMethods",
  "bridgeRoundtripCalls",
  "bridgeRoundtripAck",
  "bridgeRoundtripGuards",
  "bridgeRoundtripBoundary",
  "realBridgeAuthStatus",
  "realBridgeAuthMethods",
  "realBridgeAuthRequired",
  "realBridgeAuthForbidden",
  "realBridgeAuthBoundary",
  "promptReliabilityStatus",
  "promptReliabilityHash",
  "promptReliabilityRules",
  "promptReliabilityFailures",
  "promptReliabilityBoundary",
  "memoryCompletionCandidateStatus",
  "memoryCompletionCandidateCriteria",
  "memoryCompletionCandidateObserved",
  "memoryCompletionCandidateFailures",
  "memoryCompletionCandidateBoundary",
  "generationRetryGateStatus",
  "generationRetryGatePlugin",
  "generationRetryGatePrompt",
  "generationRetryGateGuards",
  "generationRetryGateAuthorization",
  "generationRetryGateBoundary",
  "memoryWriteAuthStatus",
  "memoryWriteAuthCounts",
  "memoryWriteAuthRules",
  "memoryWriteAuthReject",
  "memoryWriteAuthBoundary",
  "assetArchiveCandidateStatus",
  "assetArchiveCandidateFields",
  "assetArchiveCandidateCloseouts",
  "assetArchiveCandidateBoundary",
  "draftOutput"
];

function readRuntime(fileName) {
  return fs.readFileSync(path.join(runtimeRoot, fileName), "utf8");
}

function existsRuntime(fileName) {
  return fs.existsSync(path.join(runtimeRoot, fileName));
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function includesAll(content, values) {
  return values.every((value) => content.includes(value));
}

function scriptOrderFromHtml(html) {
  const scriptPattern = /<script\b[^>]*\bsrc=["']\.\/([^"']+)["'][^>]*><\/script>/gi;
  return Array.from(html.matchAll(scriptPattern), (match) => match[1]);
}

function hasExternalUrl(content) {
  return /https?:\/\//i.test(content) || /<script\b[^>]*\bsrc=["'](?!\.\/)/i.test(content);
}

function hasForbiddenRuntimeCall(content) {
  return [
    "fetch(",
    "XMLHttpRequest",
    "localStorage",
    "sessionStorage",
    "indexedDB",
    "ipcRenderer",
    "require(",
    "writeFile",
    "appendFile"
  ].some((pattern) => content.includes(pattern));
}

function main() {
  const missingRuntimeFiles = runtimeFiles.filter((fileName) => !existsRuntime(fileName));
  assert(missingRuntimeFiles.length === 0, `Missing runtime prototype files: ${missingRuntimeFiles.join(", ")}`);

  const indexHtml = readRuntime("index.html");
  const runtimeReadme = readRuntime("README.md");
  const fieldMapping = readRuntime("FIELD_MAPPING.md");
  const appJs = readRuntime("app.js");
  const hostBridge = readRuntime("host_bridge_mock.js");
  const runtimeGuard = readRuntime("runtime_guard.js");
  const styles = readRuntime("styles.css");
  const combinedRuntimeSource = [indexHtml, appJs, hostBridge, runtimeGuard, styles].join("\n");

  const scriptOrder = scriptOrderFromHtml(indexHtml);
  const scriptOrderVerified =
    scriptOrder.length === expectedScriptOrder.length &&
    expectedScriptOrder.every((fileName, index) => scriptOrder[index] === fileName);
  const stylesheetPresent = indexHtml.includes('<link rel="stylesheet" href="./styles.css"');
  const domSurfacePresent = expectedDomIds.every((id) => indexHtml.includes(`id="${id}"`));
  const noExternalAssets = !hasExternalUrl(combinedRuntimeSource);
  const noForbiddenRuntimeCalls = !hasForbiddenRuntimeCall(combinedRuntimeSource);
  const readmeBoundaryCurrent = includesAll(runtimeReadme, [
    "不接真实 VCPChat",
    "不接真实 VCPToolBox",
    "不调用 VCP 插件",
    "不调用 API",
    "不调用 DailyNote",
    "不写磁盘",
    "Memory Completion State Split",
    "Human Override 可追踪性矩阵",
    "未激活授权胶囊",
    "Runtime 状态收敛",
    "本地提交范围计划",
    "Bridge Mock Roundtrip",
    "Real Bridge Authorization Package",
    "Plugin Reliability and Prompt Discipline",
    "Memory Write Completion Candidate",
    "Single Real Generation Retry Gate",
    "Real Memory Write Authorization Package",
    "Asset Archive Candidate",
    "v5.1 Runtime Delivery Surface"
  ]);
  const fieldMappingCurrent = includesAll(fieldMapping, [
    "review_session_draft",
    "image_case_draft",
    "memory_delta_draft",
    "memory_completion_state_draft",
    "write_requested",
    "write_authorized",
    "write_performed",
    "canonical_location_verified",
    "canonical_hash_matched",
    "plugin_success_sufficient",
    "boundary_cn",
    "accepted_candidate_delivery_package_draft",
    "human_override_traceability_draft",
    "inactive_authorization_capsules_draft",
    "runtime_review_state_draft",
    "local_commit_scope_plan_draft",
    "bridge_mock_roundtrip_candidate_draft",
    "real_bridge_authorization_package_draft",
    "plugin_reliability_prompt_discipline_draft",
    "memory_write_completion_candidate_draft",
    "single_real_generation_retry_gate_draft",
    "real_memory_write_authorization_package_draft",
    "asset_archive_candidate_draft",
    "authorization_status",
    "inactive_package",
    "convergence_status",
    "commit_allowed",
    "mock_roundtrip_candidate",
    "project_local_mock",
    "previewDraft",
    "real_bridge_authorization_package",
    "local_prompt_reliability_candidate",
    "memory_write_completion_preflight_candidate",
    "single_real_generation_retry_gate_inactive",
    "real_memory_write_authorization_package",
    "asset_archive_candidate_no_binary",
    "metadata_only_no_binary",
    "plugin_success_wrong_location",
    "traceability_items",
    "traceability_counts",
    "traceability_summary_cn",
    "traceability_boundary_cn",
    "prototype_guard",
    "Host Submit Ack"
  ]);
  const hostAckSurfacePresent = includesAll(indexHtml + appJs + hostBridge, [
    "hostStatus",
    "hostSubmittedAt",
    "accepted_by_host_mock",
    "previewDraft",
    "side_effects_performed"
  ]);
  const validationCommandCurrent = runtimeReadme.includes("node scripts\\validate_runtime_delivery_surface.js");

  assert(scriptOrderVerified, `Runtime script order must be ${expectedScriptOrder.join(" -> ")}.`);
  assert(stylesheetPresent, "Runtime prototype must load its local stylesheet.");
  assert(domSurfacePresent, "Runtime prototype DOM surface must expose all expected IDs.");
  assert(noExternalAssets, "Runtime prototype must not load external URLs.");
  assert(noForbiddenRuntimeCalls, "Runtime prototype must not include forbidden runtime calls.");
  assert(readmeBoundaryCurrent, "Runtime README must declare no-execution boundaries and v5.1 delivery surface.");
  assert(fieldMappingCurrent, "Runtime FIELD_MAPPING must cover draft and guard surfaces.");
  assert(hostAckSurfacePresent, "Runtime prototype must expose host ack surface.");
  assert(validationCommandCurrent, "Runtime README must include the v5.1 delivery surface validation command.");

  const result = {
    passed: true,
    runtime_delivery_surface: {
      runtime_file_count: runtimeFiles.length,
      runtime_files_present: true,
      script_order_verified: scriptOrderVerified,
      stylesheet_present: stylesheetPresent,
      dom_surface_id_count: expectedDomIds.length,
      dom_surface_present: domSurfacePresent,
      host_ack_surface_present: hostAckSurfacePresent,
      field_mapping_current: fieldMappingCurrent,
      readme_boundary_current: readmeBoundaryCurrent,
      validation_command_current: validationCommandCurrent,
      external_assets_loaded: false,
      forbidden_runtime_calls_present: false,
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
