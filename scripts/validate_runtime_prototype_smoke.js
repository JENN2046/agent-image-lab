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
    this.listeners = new Map();
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
  add("humanScore", { value: "84" });
  add("humanScoreOut", { textContent: "84" });
  add("humanComment", { value: "人工评审确认该版本可作为候选，但仍需保留已知视觉偏差说明。" });
  add("assetStatus", { value: "candidate" });
  add("humanApproved", { checked: false });
  add("memoryContent", { value: "本次评审保留 Photo Studio OS 真实闭环经验：资产可作为项目推进候选，但必须记录人工覆盖接受和已知视觉偏差。" });
  add("memoryApproval", { value: "pending" });
  add("hostStatus", { textContent: "waiting" });
  add("hostSubmittedAt", { textContent: "-" });
  add("draftOutput");

  const context = {
    window: {},
    document: {
      getElementById(id) {
        if (!elements.has(id)) {
          throw new Error(`Missing fake DOM element: ${id}`);
        }
        return elements.get(id);
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
  assert(initialDraft.image_case_draft.asset_status === "candidate", "Initial asset status must be candidate.");
  assert(initialDraft.image_case_draft.human_approval.approved === false, "Initial human approval must be false.");
  assert(initialDraft.memory_delta_draft.write_mode === "draft", "Initial memory write mode must be draft.");
  assert(initialDraft.memory_delta_draft.final_decision.should_write_to_vcp === false, "Initial memory write request must be false.");
  assert(runtimeGuard.guardIsClean(initialDraft.prototype_guard), "Initial prototype guard must be clean.");

  elements.get("humanApproved").checked = true;
  dispatchChange(elements, "humanApproved");
  elements.get("memoryApproval").value = "approved";
  dispatchChange(elements, "memoryApproval");

  const approvedDraft = parseDraft(elements);
  assert(approvedDraft.image_case_draft.asset_status === "accepted", "Approved asset status must become accepted.");
  assert(approvedDraft.image_case_draft.human_approval.approved === true, "Approved human approval must be true.");
  assert(approvedDraft.memory_delta_draft.write_mode === "confirmed", "Approved memory write mode must be confirmed.");
  assert(approvedDraft.memory_delta_draft.final_decision.should_write_to_vcp === true, "Approved memory write request must be true.");
  assert(runtimeGuard.guardIsClean(approvedDraft.prototype_guard), "Approved prototype guard must remain clean.");
  assert(runtimeGuard.guardIsClean(approvedDraft.review_session_draft.audit_log[0].prototype_guard), "Approved audit guard must remain clean.");

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
      memory_write_mode: initialDraft.memory_delta_draft.write_mode,
      host_ack: elements.get("hostStatus").textContent
    },
    approved: {
      asset_status: approvedDraft.image_case_draft.asset_status,
      memory_write_mode: approvedDraft.memory_delta_draft.write_mode,
      should_write_to_vcp: approvedDraft.memory_delta_draft.final_decision.should_write_to_vcp
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
