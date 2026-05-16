window.REVIEW_CONSOLE_MOCK = {
  score_model: [
    ["composition", "构图与空间关系", 15, 11, 10],
    ["subject_clarity", "主体清晰度", 10, 8, 9],
    ["style_consistency", "风格一致性", 15, 12, 12],
    ["premium_quality", "高级感 / 商业质感", 15, 12, 12],
    ["detail_control", "细节控制", 10, 7, 8],
    ["color_light", "色彩与光线", 10, 8, 8],
    ["text_ui_readability", "文字 / UI 可读性", 10, 7, 7],
    ["iteration_potential", "迭代潜力", 10, 8, 8],
    ["asset_value", "资产沉淀价值", 5, 3, 2]
  ],
  review_session: {
    session_id: "session-photo-studio-os-001",
    task_id: "task-photo-studio-os-001",
    case_id: "case-photo-studio-os-dashboard-001",
    project: "Agent Image Lab v0.2",
    status: "human_reviewing",
    image_versions: [
      {
        version_id: "v1",
        label: "初版构图",
        asset_ref: "asset_archive/candidates/photo_studio_os_v1.placeholder",
        thumbnail_ref: null,
        source: "placeholder",
        score: 78
      },
      {
        version_id: "v2",
        label: "候选版本",
        asset_ref: "asset_archive/candidates/photo_studio_os_v2.placeholder",
        thumbnail_ref: null,
        source: "placeholder",
        score: 84
      }
    ],
    current_version_id: "v2",
    compare_version_id: "v1",
    ai_review: {
      reviewer_type: "ai",
      reviewer_name: "Critic_Agent",
      total_score: 81,
      archive_recommendation: "candidate",
      memory_write_recommendation: true,
      note_cn: "AI 初评仅供参考，不能替代人工批准。"
    },
    human_review: {
      reviewer_type: "human",
      reviewer_name: "human_reviewer",
      total_score: 84,
      breakdown: {
        composition: 10,
        subject_clarity: 9,
        style_consistency: 12,
        premium_quality: 12,
        detail_control: 8,
        color_light: 8,
        text_ui_readability: 7,
        iteration_potential: 8,
        asset_value: 2
      },
      note_cn: "人工评分覆盖 AI 评分。"
    },
    final_review: {
      source: "human_review",
      total_score: 84,
      rule_cn: "final_review 必须优先采用 human_review。"
    },
    comments: [
      {
        comment_id: "comment-001",
        author: "human_reviewer",
        author_type: "human",
        target: "composition",
        severity: "high",
        comment_cn: "右侧小仪表距离侧栏太近，破坏三仪表横向平衡。",
        status: "open",
        created_at: "2026-05-04T11:40:00+08:00"
      }
    ],
    annotation_notes: [
      {
        note_id: "annotation-note-001",
        target: "right_gauge_spacing",
        note_cn: "MVP 只记录文字批注，不做图上坐标绘制。",
        severity: "medium"
      }
    ],
    version_comparison: {
      base_version_id: "v1",
      current_version_id: "v2",
      summary_cn: "候选版本保留中央仪表焦点，但右侧小仪表仍需外移。",
      score_delta: 6
    },
    approval: {
      archive_action: "mark_candidate",
      memory_action: "request_memory_edit",
      approved_by: null,
      approved_at: null,
      note_cn: "当前仍为候选，不代表正式入库。"
    },
    archive_decision: {
      asset_status: "candidate",
      human_approval_required: true,
      ai_archive_recommendation_is_final: false,
      note_cn: "AI 的 archive_recommendation 只是建议。"
    },
    memory_preview: {
      chinese_diary_title: "Photo Studio OS 三仪表构图经验",
      chinese_diary_content: "本次评审确认三仪表需要保持横向平衡，中央大仪表是视觉焦点，右侧小仪表不得贴近右侧栏。",
      target_notebook: "Photo_Studio_OS_Style_Memory",
      maid: null,
      tags: ["PhotoStudioOS", "三仪表", "高级黑"],
      safety: {
        contains_secret: false,
        contains_private_path: false,
        contains_customer_private_data: false,
        contains_image_binary: false
      }
    },
    memory_approval: {
      status: "pending",
      approved_by: null,
      approved_at: null,
      rejection_reason_cn: null
    },
    next_iteration: {
      continue_iteration: true,
      revision_advice_cn: [
        "保留三仪表中心构图，只微调右侧小仪表与侧栏距离。",
        "压低过强蓝光，保留深冷蓝底色和冷白细字体。",
        "保持下方 Project Execution / Activity Timeline / AI Inspection Feed 的扫描节奏。"
      ]
    },
    audit_log: [
      {
        event: "mock_session_loaded",
        actor: "Review_Console_Static_Prototype",
        created_at: "2026-05-04T11:45:00+08:00",
        note_cn: "静态原型加载 mock 数据，未调用外部系统。"
      }
    ]
  },
  adapter_dry_run_handoff: {
    request_id: "dry-run-request-lab-accepted-001",
    status: "accepted_draft",
    dispatch_plan_draft: {
      dispatch_id: "dispatch-task-phase-d-lab-accepted-001",
      task_id: "task-phase-d-lab-accepted-001",
      mode: "dry_run",
      selected_plugin: null,
      fallback_plugins: [],
      capability_matrix_status: "manifest_reviewed_safe",
      reason_cn: "仅生成 dry-run 调度草案；未选择真实插件，未调用插件或 API。",
      dry_run_required: true,
      approval_required: true,
      execution_blocked: true,
      external_api_allowed: false,
      gatekeeper_required: true,
      review_console_required: true,
      allow_file_write: false,
      allow_image_binary: false,
      max_plugin_calls: 0,
      expected_outputs: 0,
      max_outputs: 0
    },
    gatekeeper_handoff: {
      required: true,
      display_only: true,
      risk_level: "medium",
      risk_summary_cn: "当前仅为 dry-run 草案，不能执行插件、调用 API、写 DailyNote 或保存图片。",
      blocked_actions: [
        "execute",
        "call_plugin",
        "call_api",
        "write_daily_note",
        "write_image_file"
      ],
      approval_to_execute_allowed: false
    },
    review_console_handoff: {
      required: true,
      display_only: true,
      allowed_actions: [
        "mark_candidate",
        "reject_candidate",
        "request_gatekeeper_review",
        "request_memory_edit"
      ],
      forbidden_actions: [
        "execute_plugin",
        "call_api",
        "write_daily_note",
        "save_image"
      ]
    },
    audit_record: {
      audit_summary_cn: "仅完成 Adapter dry-run 草案生成，未调用插件、API、DailyNote 或文件写入。",
      contains_sensitive_original: false,
      max_plugin_calls_observed: 0,
      external_api_observed: false,
      file_write_observed: false,
      image_binary_observed: false
    },
    no_execution_guard: {
      selected_plugin: null,
      max_plugin_calls: 0,
      api_called: false,
      vcp_plugin_called: false,
      daily_note_called: false,
      file_write_performed: false,
      image_file_created: false,
      real_execution_allowed: false
    }
  },
  review_result_protocol_static_handoff: {
    source_adapter_response_ref: "tests/schema_examples/pvos_kernel_dry_run_adapter_response.example.json",
    status: "draft_ready",
    display_only: true,
    review_result_protocol_report_attached: true,
    required_review_fields: [
      "review_outcome",
      "pass_reasons",
      "reject_reasons",
      "memory_route",
      "production_route"
    ],
    candidate_review_results: [
      {
        candidate_id: "candidate_accept_metadata_001",
        review_outcome: "pass",
        pass_reasons: [
          "weighted_score_meets_accept_threshold",
          "no_failure_tags_present"
        ],
        reject_reasons: [],
        memory_route: {
          route: "draft_memory_candidate",
          direct_write_performed: false,
          requires_human_memory_approval: true
        },
        production_route: {
          status: "blocked_until_human_review",
          production_candidate: false,
          allowed_for_production: false,
          human_review_required: true
        }
      },
      {
        candidate_id: "candidate_reject_metadata_001",
        review_outcome: "reject",
        pass_reasons: [],
        reject_reasons: [
          "weighted_score_below_accept_threshold",
          "weighted_score_below_reject_threshold",
          "mapped_failure_tags_present"
        ],
        memory_route: {
          route: "audit_only_failure_learning",
          direct_write_performed: false,
          requires_human_memory_approval: true
        },
        production_route: {
          status: "never_production",
          production_candidate: false,
          allowed_for_production: false,
          human_review_required: true,
          permanent_block: true
        }
      }
    ],
    report_summary: {
      pass_count: 1,
      reject_count: 1,
      never_production_count: 1,
      direct_memory_write_performed: false,
      production_candidate_created: false
    },
    review_protocol_guard_summary: {
      never_production_count: 1,
      never_production_candidate_ids: [
        "candidate_reject_metadata_001"
      ],
      memory_forbidden_count: 0,
      memory_forbidden_candidate_ids: [],
      production_blocked_count: 2,
      all_production_candidate_creation_blocked: true,
      production_candidate_created: false,
      direct_memory_write_performed: false,
      negative_guard_observed: false
    },
    protocol_guards: {
      pass_requires_non_empty_pass_reasons: true,
      reject_requires_non_empty_reject_reasons: true,
      every_candidate_has_memory_route: true,
      every_candidate_has_production_route: true,
      direct_memory_write_performed: false,
      production_candidate_created: false
    }
  },
  review_decision_package_static_handoff: {
    source_adapter_response_ref: "tests/schema_examples/pvos_kernel_dry_run_adapter_response.example.json",
    status: "draft_ready",
    display_only: true,
    review_decision_package_attached: true,
    accepted_sample_drafts: [
      {
        accepted_sample_id: "accepted_candidate_accept_metadata_001",
        candidate_id: "candidate_accept_metadata_001",
        write_performed: false,
        production_candidate: false
      }
    ],
    rejected_sample_drafts: [
      {
        rejected_sample_id: "rejected_candidate_reject_metadata_001",
        candidate_id: "candidate_reject_metadata_001",
        write_performed: false,
        production_candidate: false
      }
    ],
    memory_delta_drafts: [
      {
        memory_delta_id: "memory_delta_candidate_accept_metadata_001",
        status: "draft",
        language: "zh-CN",
        direct_write_performed: false
      },
      {
        memory_delta_id: "memory_delta_candidate_reject_metadata_001",
        status: "draft",
        language: "zh-CN",
        direct_write_performed: false
      }
    ],
    memory_forbidden_records: [],
    production_exclusion_register: [
      {
        candidate_id: "candidate_reject_metadata_001",
        status: "never_production",
        permanent_block: true,
        production_candidate: false
      }
    ],
    decision_summary: {
      accepted_sample_draft_count: 1,
      rejected_sample_draft_count: 1,
      memory_delta_draft_count: 2,
      memory_forbidden_count: 0,
      production_exclusion_count: 1,
      direct_memory_write_performed: false,
      production_candidate_created: false,
      accepted_samples_write_performed: false
    },
    review_decision_package_guard_summary: {
      accepted_sample_draft_count: 1,
      rejected_sample_draft_count: 1,
      memory_delta_draft_count: 2,
      memory_forbidden_count: 0,
      production_exclusion_count: 1,
      production_exclusion_candidate_ids: [
        "candidate_reject_metadata_001"
      ],
      production_candidate_created: false,
      direct_memory_write_performed: false,
      accepted_samples_write_performed: false
    },
    promotion_guard: {
      protocol_pass_is_not_production_approval: true,
      every_never_production_candidate_blocked: true,
      production_candidate_created: false,
      direct_memory_write_performed: false
    }
  },
  image_case_seed: {
    input_assets: ["asset_archive/references/photo_studio_os_reference.placeholder"],
    prompt_package_id: "prompt-package-photo-studio-os-001",
    review_ids: ["review-photo-studio-os-001"],
    strengths_cn: [
      "整体高级黑方向正确，中央仪表焦点明确。",
      "冷白 UI 与深冷蓝底色符合 Photo Studio OS 基调。"
    ],
    weaknesses_cn: [
      "右侧小仪表距离右侧栏太近，破坏三仪表横向平衡。",
      "局部蓝光偏强，需要避免过度蓝光。"
    ],
    reusable_rules_cn: [
      "三仪表横向距离必须平衡。",
      "右侧仪表不得贴近侧栏。"
    ]
  }
};
