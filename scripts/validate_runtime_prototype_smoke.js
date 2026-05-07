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
  add("queueTotal");
  add("queueVisible");
  add("queueProgress");
  add("queueSelected");
  add("queuePrev");
  add("queueNext");
  add("queueList");
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
  const requiredMethods = ["clone", "normalizeSession", "guardIsClean", "draftIsSafe", "assertDraftSafe"];
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
  assert(elements.get("hostStatus").textContent.includes("已接收安全草案"), "Initial host ack must be accepted.");
  assert(elements.get("hostSubmittedAt").textContent !== "-", "Initial host submit timestamp must be present.");
  assert(elements.get("boundaryBanner").textContent.includes("没有真实写入"), "Boundary banner must show no real write.");
  assert(elements.get("reviewCardStatus").textContent === "人工评审中", "Review card must show Chinese review status.");
  assert(elements.get("assetCardStatus").textContent === "候选", "Asset card must show Chinese asset status.");
  assert(elements.get("memoryCardDecision").textContent === "未形成写入申请", "Memory card must show no write request.");
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
  assert(elements.get("summaryWriteRequest").textContent === "未形成写入申请", "Initial summary must show no write request.");
  assert(elements.get("summaryGuard").textContent === "无外部副作用", "Initial summary must show clean guard.");
  assert(elements.get("summaryNextAction").textContent === "继续人工确认或补充标注", "Initial summary must show next action.");
  assert(initialDraft.review_session_draft.review_preflight.human_comment_present === true, "Initial preflight must record human comment presence.");
  assert(initialDraft.review_session_draft.review_preflight.chinese_memory_content_detected === true, "Initial preflight must detect Chinese memory content.");
  assert(initialDraft.review_session_draft.review_preflight.real_write_performed === false, "Initial preflight must record no real write.");
  assert(initialDraft.review_session_draft.version_comparison.strengths_cn.includes("主体构图"), "Version strengths must enter the draft.");
  assert(initialDraft.review_session_draft.version_comparison.issues_cn.includes("细节噪点"), "Version issues must enter the draft.");
  assert(initialDraft.review_session_draft.version_comparison.next_step_cn.includes("写入申请"), "Version next step must enter the draft.");
  assert(elements.get("memoryPreviewTitle").textContent.length > 0, "Memory preview title must render.");
  assert(elements.get("memoryPreviewDecision").textContent === "未形成写入申请", "Memory preview must show no write request initially.");
  assert(elements.get("checkHumanComment").dataset.state === "ok", "Human comment checklist must pass initially.");
  assert(elements.get("checkMemoryContent").dataset.state === "ok", "Memory content checklist must pass initially.");
  assert(elements.get("checkWriteBoundary").dataset.state === "ok", "Write boundary checklist must pass initially.");
  assert(initialDraft.review_session_draft.current_version_id === "v2", "Initial current version must be v2.");
  assert(initialDraft.review_session_draft.compare_version_id === "v1", "Initial compare version must be v1.");
  assert(initialDraft.review_session_draft.selected_queue_id === "queue-v2", "Initial selected queue id must be queue-v2.");
  assert(initialDraft.review_session_draft.review_queue.length === 4, "Initial review queue must contain four candidates.");
  assert(elements.get("queueTotal").textContent === "4", "Queue total must render.");
  assert(elements.get("queueVisible").textContent === "4", "Queue visible count must render all candidates initially.");
  assert(elements.get("queueProgress").textContent === "1 / 4", "Queue progress must render initial position.");
  assert(elements.get("queueSelected").textContent === "v1.1 修订候选图", "Queue selected label must render.");
  assert(elements.get("queuePrev").disabled === true, "Initial queue previous button must be disabled at the first item.");
  assert(elements.get("queueNext").disabled === false, "Initial queue next button must be enabled.");
  assert(elements.get("queueList").children.length === 4, "Queue list must render four candidate buttons.");
  assert(initialDraft.review_session_draft.annotation_notes.length === 1, "Initial annotation note must be included.");
  assert(
    initialDraft.review_session_draft.version_comparison.summary_cn.includes("v1.1 修订候选图"),
    "Initial comparison summary must name the current version."
  );
  assert(initialDraft.image_case_draft.human_approval.approved === false, "Initial human approval must be false.");
  assert(initialDraft.memory_delta_draft.write_mode === "draft", "Initial memory write mode must be draft.");
  assert(initialDraft.memory_delta_draft.final_decision.should_write_to_vcp === false, "Initial memory write request must be false.");
  assert(runtimeGuard.guardIsClean(initialDraft.prototype_guard), "Initial prototype guard must be clean.");

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
  assert(elements.get("summarySessionStatus").textContent === "已批准", "Approved summary must show approved review status.");
  assert(elements.get("summaryAssetStatus").textContent === "可接受", "Approved summary must show accepted asset status.");
  assert(elements.get("summaryMemoryStatus").textContent === "已批准写入申请", "Approved summary must show approved memory status.");
  assert(elements.get("summaryWriteRequest").textContent === "已形成写入申请，仍未真实写入", "Approved summary must show write request without real write.");
  assert(elements.get("summaryNextAction").textContent === "可进入人工验货与后续写入授权", "Approved summary must show next action.");
  assert(approvedDraft.review_session_draft.next_action_cn === "可进入人工验货与后续写入授权", "Approved draft must include Chinese next action.");
  assert(approvedDraft.review_session_draft.acceptance_verdict.status_cn === "图像可接受，等待写入授权", "Approved draft must include write-authorization verdict.");
  assert(elements.get("memoryPreviewDecision").textContent === "已形成写入申请，仍未真实写入", "Approved memory preview must show write request without real write.");
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

  const result = {
    passed: true,
    initial: {
      asset_status: initialDraft.image_case_draft.asset_status,
      current_version_id: initialDraft.review_session_draft.current_version_id,
      compare_version_id: initialDraft.review_session_draft.compare_version_id,
      annotation_notes_count: initialDraft.review_session_draft.annotation_notes.length,
      memory_write_mode: initialDraft.memory_delta_draft.write_mode,
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
      queue_click_updates_selected_id: rejectedSelectionDraft.review_session_draft.selected_queue_id === "queue-v3",
      queue_click_updates_current_version: rejectedSelectionDraft.review_session_draft.current_version_id === "v3",
      queue_return_restores_current_version: returnedQueueDraft.review_session_draft.current_version_id === "v2",
      next_button_updates_current_version: nextQueueDraft.review_session_draft.current_version_id === "v1",
      previous_button_restores_current_version: previousQueueDraft.review_session_draft.current_version_id === "v2",
      progress_summary_visible: elements.get("queueProgress").textContent.includes("/")
    },
    adapter_handoff: {
      execution_blocked: initialDraft.adapter_dry_run_handoff_draft.execution_blocked,
      max_plugin_calls: initialDraft.adapter_dry_run_handoff_draft.max_plugin_calls,
      plugin_call_forbidden: initialDraft.adapter_dry_run_handoff_draft.forbidden_actions_cn.includes("调用插件")
    },
    approved: {
      asset_status: approvedDraft.image_case_draft.asset_status,
      memory_write_mode: approvedDraft.memory_delta_draft.write_mode,
      should_write_to_vcp: approvedDraft.memory_delta_draft.final_decision.should_write_to_vcp
    },
    version_selection: {
      current_version_id_updates: singleVersionDraft.review_session_draft.current_version_id === "v1",
      compare_version_can_clear: singleVersionDraft.review_session_draft.compare_version_id === null,
      output_asset_follows_selected_version: singleVersionDraft.image_case_draft.output_assets[0].includes("accepted-image.placeholder")
    },
    rejection_checks: {
      dirty_guard_rejected: badGuardAck.accepted_by_host_mock === false,
      dirty_audit_guard_rejected: badAuditGuardAck.accepted_by_host_mock === false,
      accepted_without_approval_rejected: badApprovalAck.accepted_by_host_mock === false
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
