const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const runtimeGuardPath = path.join(root, "review_console", "runtime_prototype", "runtime_guard.js");

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function loadRuntimeGuard() {
  const context = vm.createContext({
    window: {},
    JSON,
    Object,
    Array,
    Error
  });
  context.window.window = context.window;
  const source = fs.readFileSync(runtimeGuardPath, "utf8");
  vm.runInContext(source, context, { filename: "runtime_guard.js" });
  return context.window.ImageLabRuntimeGuard;
}

function makeBaseDraft(runtimeGuard) {
  return {
    review_session_draft: {
      audit_log: [
        {
          prototype_guard: runtimeGuard.clone(runtimeGuard.cleanGuard)
        }
      ]
    },
    image_case_draft: {
      asset_status: "candidate",
      human_approval: {
        approved: false
      }
    },
    memory_delta_draft: {
      approval_status: "pending",
      final_decision: {
        should_write_to_vcp: false
      }
    },
    prototype_guard: runtimeGuard.clone(runtimeGuard.cleanGuard)
  };
}

function assertThrows(fn, message) {
  try {
    fn();
  } catch (_error) {
    return;
  }
  throw new Error(message);
}

function main() {
  const runtimeGuard = loadRuntimeGuard();
  assert(runtimeGuard && typeof runtimeGuard === "object", "Runtime guard must load.");
  assert(typeof runtimeGuard.clone === "function", "Runtime guard must expose clone().");
  assert(typeof runtimeGuard.normalizeSession === "function", "Runtime guard must expose normalizeSession().");
  assert(typeof runtimeGuard.guardIsClean === "function", "Runtime guard must expose guardIsClean().");
  assert(typeof runtimeGuard.draftIsSafe === "function", "Runtime guard must expose draftIsSafe().");
  assert(typeof runtimeGuard.assertDraftSafe === "function", "Runtime guard must expose assertDraftSafe().");

  const cleanGuard = runtimeGuard.clone(runtimeGuard.cleanGuard);
  assert(runtimeGuard.guardIsClean(cleanGuard), "Clean guard must pass.");

  const dirtyGuard = runtimeGuard.clone(runtimeGuard.cleanGuard);
  dirtyGuard.api_called = true;
  assert(runtimeGuard.guardIsClean(dirtyGuard) === false, "Dirty guard must fail.");

  const extraKeyGuard = runtimeGuard.clone(runtimeGuard.cleanGuard);
  extraKeyGuard.unexpected_flag = false;
  assert(runtimeGuard.guardIsClean(extraKeyGuard) === false, "Guard with extra keys must fail.");

  const original = {
    nested: {
      value: "original"
    }
  };
  const cloned = runtimeGuard.clone(original);
  cloned.nested.value = "changed";
  assert(original.nested.value === "original", "clone() must deep copy JSON data.");

  const normalized = runtimeGuard.normalizeSession({
    memory_preview: {},
    image_case_seed: {}
  });
  assert(Array.isArray(normalized.image_versions), "normalizeSession() must default image_versions to an array.");
  assert(Array.isArray(normalized.review_queue), "normalizeSession() must default review_queue to an array.");
  assert(Array.isArray(normalized.comments), "normalizeSession() must default comments to an array.");
  assert(Array.isArray(normalized.annotation_notes), "normalizeSession() must default annotation_notes to an array.");
  assert(Array.isArray(normalized.memory_preview.tags), "normalizeSession() must default memory_preview.tags to an array.");
  assert(Array.isArray(normalized.image_case_seed.input_assets), "normalizeSession() must default input_assets to an array.");
  assert(Array.isArray(normalized.image_case_seed.review_ids), "normalizeSession() must default review_ids to an array.");
  assert(Array.isArray(normalized.image_case_seed.strengths_cn), "normalizeSession() must default strengths_cn to an array.");
  assert(Array.isArray(normalized.image_case_seed.weaknesses_cn), "normalizeSession() must default weaknesses_cn to an array.");
  assert(Array.isArray(normalized.image_case_seed.reusable_rules_cn), "normalizeSession() must default reusable_rules_cn to an array.");

  const safeDraft = makeBaseDraft(runtimeGuard);
  assert(runtimeGuard.draftIsSafe(safeDraft), "Base candidate draft must be safe.");
  runtimeGuard.assertDraftSafe(safeDraft);

  const acceptedDraft = runtimeGuard.clone(safeDraft);
  acceptedDraft.image_case_draft.asset_status = "accepted";
  acceptedDraft.image_case_draft.human_approval.approved = true;
  assert(runtimeGuard.draftIsSafe(acceptedDraft), "Accepted draft with approval must be safe.");

  const acceptedWithoutApproval = runtimeGuard.clone(safeDraft);
  acceptedWithoutApproval.image_case_draft.asset_status = "accepted";
  assert(runtimeGuard.draftIsSafe(acceptedWithoutApproval) === false, "Accepted draft without approval must fail.");
  assertThrows(
    () => runtimeGuard.assertDraftSafe(acceptedWithoutApproval),
    "assertDraftSafe() must reject accepted draft without approval."
  );

  const memoryWriteWithoutApproval = runtimeGuard.clone(safeDraft);
  memoryWriteWithoutApproval.memory_delta_draft.final_decision.should_write_to_vcp = true;
  assert(runtimeGuard.draftIsSafe(memoryWriteWithoutApproval) === false, "Memory write without approval must fail.");

  const memoryWriteWithApproval = runtimeGuard.clone(safeDraft);
  memoryWriteWithApproval.memory_delta_draft.approval_status = "approved";
  memoryWriteWithApproval.memory_delta_draft.final_decision.should_write_to_vcp = true;
  assert(runtimeGuard.draftIsSafe(memoryWriteWithApproval), "Memory write with approval must be safe as a request.");

  const dirtyAuditDraft = runtimeGuard.clone(safeDraft);
  dirtyAuditDraft.review_session_draft.audit_log[0].prototype_guard.api_called = true;
  assert(runtimeGuard.draftIsSafe(dirtyAuditDraft) === false, "Dirty audit guard must fail.");

  const missingSectionDraft = runtimeGuard.clone(safeDraft);
  delete missingSectionDraft.memory_delta_draft;
  assert(runtimeGuard.draftIsSafe(missingSectionDraft) === false, "Draft missing required sections must fail.");

  const result = {
    passed: true,
    runtime_guard_unit: {
      clean_guard_passed: true,
      dirty_guard_rejected: true,
      extra_key_guard_rejected: true,
      clone_deep_copy_verified: true,
      normalize_session_defaults_verified: true,
      base_candidate_draft_safe: true,
      accepted_without_approval_rejected: true,
      memory_write_without_approval_rejected: true,
      memory_write_with_approval_allowed_as_request: true,
      dirty_audit_guard_rejected: true,
      missing_required_section_rejected: true
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
