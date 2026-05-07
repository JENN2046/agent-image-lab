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
      },
      {
        version_id: "v3",
        label: "v1.2 风险复查图",
        asset_ref: "runs/v10_19_compatible_byte_write_real_generation/run_2/review-risk.placeholder",
        thumbnail_ref: null,
        source: "placeholder",
        score: 61
      },
      {
        version_id: "v4",
        label: "v1.3 草稿探索图",
        asset_ref: "runs/photo_studio_os_v0_11_exploration/draft-exploration.placeholder",
        thumbnail_ref: null,
        source: "placeholder",
        score: 73
      }
    ],
    review_queue: [
      {
        queue_id: "queue-v2",
        version_id: "v2",
        compare_version_id: "v1",
        title_cn: "v1.1 修订候选图",
        priority_cn: "高优先级",
        asset_status: "candidate",
        review_status: "human_reviewing",
        score: 88,
        human_approved: false,
        memory_approval_status: "pending",
        human_note_cn: "人工评审确认该版本可作为候选，但仍需保留已知视觉偏差说明。",
        annotation_note_cn: "对比参考版本后，当前版本的主体构图更稳定，仍需留意细节噪点。",
        strengths_cn: "主体构图更稳定，整体可读性更好。",
        issues_cn: "细节噪点仍需保留人工判断。",
        next_step_cn: "若进入正式归档，需要确认记忆写入申请。",
        memory_content_cn: "本次评审保留 Photo Studio OS 真实闭环经验：资产可作为项目推进候选，但必须记录人工覆盖接受和已知视觉偏差。"
      },
      {
        queue_id: "queue-v1",
        version_id: "v1",
        compare_version_id: "",
        title_cn: "v1.0 参考候选图",
        priority_cn: "参考样例",
        asset_status: "accepted",
        review_status: "approved",
        score: 84,
        human_approved: true,
        memory_approval_status: "approved",
        human_note_cn: "参考版本已经人工接受，可作为后续版本的对照基准。",
        annotation_note_cn: "该版本用于确认后续候选是否保留三仪表平衡。",
        strengths_cn: "三仪表结构完整，主视觉关系清楚。",
        issues_cn: "细节锐度和信息密度仍有提升空间。",
        next_step_cn: "作为参考基准保留，不触发真实写入。",
        memory_content_cn: "参考版本只作为评审基准记录，当前 runtime prototype 不写入 DailyNote。"
      },
      {
        queue_id: "queue-v3",
        version_id: "v3",
        compare_version_id: "v2",
        title_cn: "v1.2 风险复查图",
        priority_cn: "需处理",
        asset_status: "rejected",
        review_status: "rejected",
        score: 61,
        human_approved: false,
        memory_approval_status: "rejected",
        human_note_cn: "当前版本存在明显文字伪影和局部细节噪点，暂不接受。",
        annotation_note_cn: "复查重点是文字伪影、边缘噪点和右侧模块拥挤。",
        strengths_cn: "中央仪表仍然保持主视觉位置。",
        issues_cn: "疑似文字伪影明显，局部细节噪点偏高。",
        next_step_cn: "拒收并准备下一轮 prompt 修正。",
        memory_content_cn: "拒收经验只生成草案，不进入长期记忆写入。"
      },
      {
        queue_id: "queue-v4",
        version_id: "v4",
        compare_version_id: "v2",
        title_cn: "v1.3 草稿探索图",
        priority_cn: "低优先级",
        asset_status: "draft",
        review_status: "human_reviewing",
        score: 73,
        human_approved: false,
        memory_approval_status: "pending",
        human_note_cn: "草稿方向可观察，但还不能作为候选归档。",
        annotation_note_cn: "需要继续检查三仪表比例和右侧队列拥挤度。",
        strengths_cn: "整体方向接近 Photo Studio OS，但完成度不足。",
        issues_cn: "视觉密度偏散，局部模块仍需重新整理。",
        next_step_cn: "继续评审草稿，不提交记忆写入申请。",
        memory_content_cn: "草稿探索只保留本地评审记录，不形成写入申请。"
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

  function ackKeysFor(ack) {
    return Object.keys(ack).sort();
  }

  function buildAck(method, draft, acceptedMessage, rejectedMessage) {
    const validationPassed = runtimeGuard.draftIsSafe(draft);
    const ack = {
      selected_method: method,
      accepted_by_host_mock: validationPassed,
      draft_received: Boolean(draft),
      validation_passed: validationPassed,
      bridge_calls_observed: {
        mock_only: true,
        total: 1,
        cancel: 0,
        loadSession: 0,
        previewDraft: method === "previewDraft" ? 1 : 0,
        submitDraft: method === "submitDraft" ? 1 : 0,
        production_submitDraft: 0
      },
      side_effects_performed: false,
      plugin_called: false,
      api_called: false,
      daily_note_called: false,
      vcp_memory_written: false,
      image_created: false,
      received_at: new Date().toISOString(),
      status_cn: validationPassed ? acceptedMessage : rejectedMessage
    };
    ack.ack_keys = ackKeysFor(ack);
    return ack;
  }

  return {
    loadSession() {
      return runtimeGuard.clone(session);
    },
    previewDraft(draft) {
      return buildAck(
        "previewDraft",
        draft,
        "host mock 已生成 previewDraft 安全预览，无外部副作用。",
        "host mock 拒绝 previewDraft：guard 或审批状态不满足要求。"
      );
    },
    submitDraft(draft) {
      return buildAck(
        "submitDraft",
        draft,
        "host mock 已接收安全草案，无外部副作用。",
        "host mock 拒绝草案：guard 或审批状态不满足要求。"
      );
    }
  };
})();
