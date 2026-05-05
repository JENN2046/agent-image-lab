const bridge = window.ImageLabHostBridge;
const session = bridge.loadSession();

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
  draftOutput: document.getElementById("draftOutput")
};

function nowIso() {
  return new Date().toISOString();
}

function currentVersion() {
  return session.image_versions.find((version) => version.version_id === session.current_version_id);
}

function memoryWriteMode(status) {
  if (status === "approved") return "confirmed";
  if (status === "rejected") return "forbidden";
  return "draft";
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
  const score = Number(els.humanScore.value);
  const memoryApproval = approvalPayload();
  const assetStatus = finalAssetStatus();
  const version = currentVersion();

  return {
    review_session_draft: {
      session_id: session.session_id,
      task_id: session.task_id,
      case_id: session.case_id,
      project: session.project,
      current_version_id: version.version_id,
      ai_review: session.ai_review,
      human_review: {
        reviewer_type: "human",
        reviewer_name: "human_reviewer",
        total_score: score,
        note_cn: els.humanComment.value.trim()
      },
      final_review: {
        source: "human_review",
        total_score: score,
        rule_cn: "final_review 优先采用 human_review。"
      },
      archive_decision: {
        asset_status: assetStatus,
        human_approval: {
          approved: els.humanApproved.checked,
          approved_by: els.humanApproved.checked ? "human_reviewer" : null,
          approved_at: els.humanApproved.checked ? nowIso() : null,
          approval_notes_cn: els.humanApproved.checked ? "人工明确批准 accepted。" : "未获得人工正式批准。"
        },
        ai_archive_recommendation_is_final: false
      },
      memory_preview: {
        chinese_diary_title: session.memory_preview.chinese_diary_title,
        chinese_diary_content: els.memoryContent.value.trim(),
        target_notebook: session.memory_preview.target_notebook,
        tags: session.memory_preview.tags,
        safety: session.memory_preview.safety
      },
      memory_approval: memoryApproval,
      audit_log: [
        {
          event: "runtime_prototype_draft_generated",
          actor: "Review_Console_Runtime_Prototype",
          created_at: nowIso(),
          note_cn: "runtime prototype 只生成草案，没有调用外部系统。"
        }
      ]
    },
    image_case_draft: {
      case_id: session.case_id,
      task_id: session.task_id,
      project: session.project,
      output_assets: [version.asset_ref],
      final_score: score,
      asset_status: assetStatus,
      human_approval_required: true,
      image_binary_saved_to_git: false
    },
    memory_delta_draft: {
      delta_id: "memory-delta-v1-2-runtime-prototype-001",
      task_id: session.task_id,
      case_id: session.case_id,
      agent_name: "Review_Console_Runtime_Prototype",
      target_notebook: session.memory_preview.target_notebook,
      write_mode: memoryWriteMode(memoryApproval.status),
      approval_status: memoryApproval.status,
      approved_by: memoryApproval.approved_by,
      approved_at: memoryApproval.approved_at,
      chinese_diary_title: session.memory_preview.chinese_diary_title,
      chinese_diary_content: els.memoryContent.value.trim(),
      tags: session.memory_preview.tags,
      memory_safety: session.memory_preview.safety,
      final_decision: {
        should_write_to_vcp: memoryApproval.status === "approved",
        rejection_reason_cn: memoryApproval.rejection_reason_cn
      }
    },
    prototype_guard: {
      api_called: false,
      daily_note_called: false,
      vcp_plugin_called: false,
      disk_write_performed: false,
      image_file_created: false
    }
  };
}

function render() {
  els.humanScoreOut.textContent = els.humanScore.value;
  els.draftOutput.textContent = JSON.stringify(buildDraft(), null, 2);
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
  bridge.submitDraft(buildDraft());
}

init();

