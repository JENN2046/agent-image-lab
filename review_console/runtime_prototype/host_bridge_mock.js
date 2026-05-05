window.ImageLabHostBridge = (() => {
  const cleanGuard = {
    api_called: false,
    daily_note_called: false,
    vcp_plugin_called: false,
    disk_write_performed: false,
    image_file_created: false
  };

  const session = {
    session_id: "session-v1-2-runtime-prototype-001",
    task_id: "ail-v1-2-runtime-prototype-001",
    case_id: "case-v1-2-runtime-prototype-001",
    project: "Agent Image Lab",
    status: "human_reviewing",
    image_versions: [
      {
        version_id: "v1",
        label: "v1.0 accepted reference",
        asset_ref: "runs/photo_studio_os_v0_10_doubao_retry/image/doubaogen/accepted-image.placeholder",
        thumbnail_ref: null,
        source: "placeholder",
        score: 84
      }
    ],
    current_version_id: "v1",
    compare_version_id: null,
    ai_review: {
      reviewer_type: "ai",
      reviewer_name: "Critic_Agent",
      total_score: 81,
      archive_recommendation: "candidate",
      note_cn: "AI 评分只作为建议。"
    },
    comments: [
      {
        comment_id: "comment-v1-2-seed-001",
        author: "Critic_Agent",
        body_cn: "AI 建议保留为候选，最终结论必须等待人工评审。"
      }
    ],
    annotation_notes: [],
    version_comparison: {
      current_version_id: "v1",
      compare_version_id: null,
      summary_cn: "当前 runtime prototype 只展示单版本占位资产引用，不加载图片二进制。"
    },
    approval: {
      status: "pending",
      approved_by: null,
      approved_at: null,
      approval_notes_cn: "等待人工审批。"
    },
    archive_decision: {
      asset_status: "candidate",
      ai_archive_recommendation_is_final: false
    },
    memory_preview: {
      chinese_diary_title: "Photo Studio OS v1.0 人工接受经验",
      chinese_diary_content: "本次评审只生成中文记忆草案，不写入 DailyNote。",
      target_notebook: "Photo_Studio_OS_Style_Memory",
      maid: null,
      tags: ["PhotoStudioOS", "v1.0", "人工接受"],
      safety: {
        contains_secret: false,
        contains_private_path: false,
        contains_customer_private_data: false,
        contains_image_binary: false,
        safety_notes_cn: "占位样例不包含敏感信息或图片二进制。"
      }
    },
    next_iteration: {
      action: "keep_candidate",
      note_cn: "如需进入真实 VCPChat 子窗口或 DailyNote 写入，必须走独立授权。"
    },
    image_case_seed: {
      image_type: "Photo Studio OS dashboard",
      input_assets: ["references/photo_studio_os/accepted-reference.placeholder"],
      plugin_used: null,
      prompt_package_id: "prompt-package-photo-studio-os-placeholder",
      review_ids: ["review-v1-2-runtime-prototype-001"],
      strengths_cn: ["保留人工覆盖 AI 评分的闭环记录。"],
      weaknesses_cn: ["当前仍是占位资产引用，不代表真实图片验收。"],
      reusable_rules_cn: ["未人工批准时不得把资产状态标记为 accepted。"],
      git_promotion_candidate: false
    }
  };

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function guardIsClean(guard) {
    return Boolean(
      guard &&
        Object.entries(cleanGuard).every(([key, value]) => guard[key] === value)
    );
  }

  function draftIsSafe(draft) {
    if (!draft || typeof draft !== "object") return false;
    if (!draft.review_session_draft || !draft.image_case_draft || !draft.memory_delta_draft) return false;
    if (!guardIsClean(draft.prototype_guard)) return false;

    const auditEntry = draft.review_session_draft.audit_log?.[0];
    if (!guardIsClean(auditEntry?.prototype_guard)) return false;

    const imageCase = draft.image_case_draft;
    if (imageCase.asset_status === "accepted" && imageCase.human_approval?.approved !== true) {
      return false;
    }

    const memoryDelta = draft.memory_delta_draft;
    if (
      memoryDelta.final_decision?.should_write_to_vcp === true &&
      memoryDelta.approval_status !== "approved"
    ) {
      return false;
    }

    return true;
  }

  return {
    loadSession() {
      return clone(session);
    },
    submitDraft(draft) {
      const validationPassed = draftIsSafe(draft);
      return {
        accepted_by_host_mock: validationPassed,
        draft_received: Boolean(draft),
        validation_passed: validationPassed,
        side_effects_performed: false,
        received_at: new Date().toISOString(),
        status_cn: validationPassed ? "host mock 已接收安全草案，无外部副作用。" : "host mock 拒绝草案：guard 或审批状态不满足要求。"
      };
    }
  };
})();
