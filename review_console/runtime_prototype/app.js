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
  versionPicker: document.getElementById("versionPicker"),
  comparePicker: document.getElementById("comparePicker"),
  comparisonSummary: document.getElementById("comparisonSummary"),
  humanScore: document.getElementById("humanScore"),
  humanScoreOut: document.getElementById("humanScoreOut"),
  humanComment: document.getElementById("humanComment"),
  annotationNote: document.getElementById("annotationNote"),
  assetStatus: document.getElementById("assetStatus"),
  humanApproved: document.getElementById("humanApproved"),
  memoryContent: document.getElementById("memoryContent"),
  memoryApproval: document.getElementById("memoryApproval"),
  hostStatus: document.getElementById("hostStatus"),
  hostSubmittedAt: document.getElementById("hostSubmittedAt"),
  summarySessionStatus: document.getElementById("summarySessionStatus"),
  summaryAssetStatus: document.getElementById("summaryAssetStatus"),
  summaryMemoryStatus: document.getElementById("summaryMemoryStatus"),
  summaryWriteRequest: document.getElementById("summaryWriteRequest"),
  summaryGuard: document.getElementById("summaryGuard"),
  draftOutput: document.getElementById("draftOutput")
};

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
          prototype_guard: runtimeGuard.clone(runtimeGuard.cleanGuard)
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
    prototype_guard: runtimeGuard.clone(runtimeGuard.cleanGuard)
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
  els.summaryMemoryStatus.textContent = memoryStatusLabel(memoryDeltaDraft.approval_status);
  els.summaryWriteRequest.textContent = writeRequestLabel(memoryDeltaDraft.final_decision.should_write_to_vcp);
  els.summaryGuard.textContent = runtimeGuard.guardIsClean(draft.prototype_guard) ? "无外部副作用" : "存在风险";
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
  [els.versionPicker, els.comparePicker, els.humanScore, els.humanComment, els.annotationNote, els.assetStatus, els.humanApproved, els.memoryContent, els.memoryApproval].forEach((el) => {
    el.addEventListener("input", render);
    el.addEventListener("change", render);
  });
  render();
}

init();
