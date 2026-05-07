window.ImageLabHostBridge = (() => {
  const runtimeGuard = window.ImageLabRuntimeGuard;
  if (!runtimeGuard || typeof runtimeGuard.clone !== "function" || typeof runtimeGuard.draftIsSafe !== "function") {
    throw new Error("ImageLabRuntimeGuard is unavailable or incomplete.");
  }

  const session = {
    session_id: "session-v1-2-runtime-prototype-001",
    task_id: "ail-v1-2-runtime-prototype-001",
    case_id: "case-v1-2-runtime-prototype-001",
    project: "Agent Image Lab",
    status: "human_reviewing",
    image_versions: [
      {
        version_id: "v1",
        label: "v1.0 参考候选图",
        asset_ref: "runs/photo_studio_os_v0_10_doubao_retry/image/doubaogen/accepted-image.placeholder",
        thumbnail_ref: null,
        source: "placeholder",
        score: 84
      },
      {
        version_id: "v2",
        label: "v1.1 修订候选图",
        asset_ref: "runs/v10_19_compatible_byte_write_real_generation/run_1/accepted-candidate.placeholder",
        thumbnail_ref: null,
        source: "placeholder",
        score: 88
      }
    ],
    current_version_id: "v2",
    compare_version_id: "v1",
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
      current_version_id: "v2",
      compare_version_id: "v1",
      summary_cn: "当前 runtime prototype 展示多版本占位资产引用，不加载图片二进制。"
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
    adapter_dry_run_handoff: {
      status_cn: "仅草案交接",
      gatekeeper_summary_cn: "当前 runtime prototype 只能生成评审草案，不能执行插件、API、DailyNote、图片保存或记忆写入。",
      selected_plugin: null,
      max_plugin_calls: 0,
      execution_blocked: true,
      allowed_actions_cn: ["标记候选", "拒收", "请求复查", "生成本地草案"],
      forbidden_actions_cn: ["调用插件", "调用 API", "写入 DailyNote", "写入 VCP memory", "保存或创建图片"],
      no_execution_guard: {
        api_called: false,
        daily_note_called: false,
        vcp_plugin_called: false,
        disk_write_performed: false,
        image_file_created: false
      }
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

  return {
    loadSession() {
      return runtimeGuard.clone(session);
    },
    submitDraft(draft) {
      const validationPassed = runtimeGuard.draftIsSafe(draft);
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
