const PROTOTYPE_GUARD = Object.freeze({
  api_called: false,
  daily_note_called: false,
  vcp_plugin_called: false,
  disk_write_performed: false,
  image_file_created: false
});

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function requireBridge(hostBridge) {
  if (!hostBridge || typeof hostBridge.loadSession !== "function" || typeof hostBridge.submitDraft !== "function") {
    throw new Error("ImageLabHostBridge is unavailable or incomplete.");
  }
  return hostBridge;
}

function requireArray(value, fallback = []) {
  return Array.isArray(value) ? value : fallback;
}

function normalizeSession(rawSession) {
  const nextSession = clone(rawSession);
  nextSession.image_versions = requireArray(nextSession.image_versions);
  nextSession.comments = requireArray(nextSession.comments);
  nextSession.annotation_notes = requireArray(nextSession.annotation_notes);
  nextSession.memory_preview = nextSession.memory_preview || {};
  nextSession.memory_preview.tags = requireArray(nextSession.memory_preview.tags);
  nextSession.memory_preview.safety = nextSession.memory_preview.safety || {};
  nextSession.image_case_seed = nextSession.image_case_seed || {};
  nextSession.image_case_seed.input_assets = requireArray(nextSession.image_case_seed.input_assets);
  nextSession.image_case_seed.review_ids = requireArray(nextSession.image_case_seed.review_ids);
  nextSession.image_case_seed.strengths_cn = requireArray(nextSession.image_case_seed.strengths_cn);
  nextSession.image_case_seed.weaknesses_cn = requireArray(nextSession.image_case_seed.weaknesses_cn);
  nextSession.image_case_seed.reusable_rules_cn = requireArray(nextSession.image_case_seed.reusable_rules_cn);
  return nextSession;
}

const bridge = requireBridge(window.ImageLabHostBridge);
const session = normalizeSession(bridge.loadSession());

const els = {
  taskId: document.getElementById("taskId"),
  caseId: document.getElementById("caseId"),
  assetRef: document.getElementById("assetRef"),
  assetBox: document.getElementById("assetBox"),
  humanScore: document.getElementById("humanScore"),
  humanScoreOut: document.getElementById("humanScoreOut"),
  humanComment: document.getElementById("humanComment"),
  assetStatus: document.getElementById("assetStatus"),
  humanApproved: document.getElementById("humanApproved"),
  memoryContent: document.getElementById("memoryContent"),
  memoryApproval: document.getElementById("memoryApproval"),
  hostStatus: document.getElementById("hostStatus"),
  hostSubmittedAt: document.getElementById("hostSubmittedAt"),
  draftOutput: document.getElementById("draftOutput")
};

function nowIso() {
  return new Date().toISOString();
}

function currentVersion() {
  return session.image_versions.find((version) => version.version_id === session.current_version_id) || session.image_versions[0];
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

  return {
    review_session_draft: {
      session_id: session.session_id,
      task_id: session.task_id,
      case_id: session.case_id,
      project: session.project,
      status: reviewSessionStatus(assetStatus),
      image_versions: session.image_versions,
      current_version_id: version.version_id,
      compare_version_id: session.compare_version_id,
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
      annotation_notes: session.annotation_notes,
      version_comparison: session.version_comparison,
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
          prototype_guard: clone(PROTOTYPE_GUARD)
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
    prototype_guard: clone(PROTOTYPE_GUARD)
  };
}

function guardIsClean(guard) {
  return Boolean(
    guard &&
      Object.entries(PROTOTYPE_GUARD).every(([key, value]) => guard[key] === value)
  );
}

function assertDraftSafe(draft) {
  if (!draft.review_session_draft || !draft.image_case_draft || !draft.memory_delta_draft) {
    throw new Error("Draft is missing required sections.");
  }
  if (!guardIsClean(draft.prototype_guard)) {
    throw new Error("Draft prototype_guard indicates a side effect.");
  }
  const auditGuard = draft.review_session_draft.audit_log?.[0]?.prototype_guard;
  if (!guardIsClean(auditGuard)) {
    throw new Error("Draft audit guard indicates a side effect.");
  }
  if (draft.image_case_draft.asset_status === "accepted" && draft.image_case_draft.human_approval.approved !== true) {
    throw new Error("Accepted asset requires explicit human approval.");
  }
  if (
    draft.memory_delta_draft.final_decision.should_write_to_vcp === true &&
    draft.memory_delta_draft.approval_status !== "approved"
  ) {
    throw new Error("Memory write request requires approved memory status.");
  }
}

function submitDraftToHost(draft) {
  assertDraftSafe(draft);
  const ack = bridge.submitDraft(clone(draft));
  if (!ack || ack.side_effects_performed !== false || ack.accepted_by_host_mock !== true) {
    throw new Error("Host bridge rejected the draft or reported a side effect.");
  }
  return ack;
}

function render() {
  const draft = buildDraft();
  els.humanScoreOut.textContent = els.humanScore.value;
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
  [els.humanScore, els.humanComment, els.assetStatus, els.humanApproved, els.memoryContent, els.memoryApproval].forEach((el) => {
    el.addEventListener("input", render);
    el.addEventListener("change", render);
  });
  render();
}

init();
