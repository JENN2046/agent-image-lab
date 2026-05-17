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
  artifact_recoverability_dashboard_evidence: {
    dashboard_evidence_version: "v1",
    evidence_source: "v14_131_real_artifact_validator",
    evidence_record_ref: "docs/v14_131_real_artifact_validation_and_accepted_sample_recoverability_gate.md",
    accepted_sample_id: "accepted_womens_resort_relaxed_knit_codex_v2_001",
    import_record_ref: "runs/real_generation/v14_105_codex_session_womens_resort_relaxed_knit_final_candidate/resort_relaxed_knit_final_import_record.json",
    artifact_ref: "runs/real_generation/v14_105_codex_session_womens_resort_relaxed_knit_final_candidate/codex_session_womens_resort_relaxed_knit_final_v2.png",
    verified_sha256: "9d23208d05427b02ffc177664c1918ed73bf57831a9694be16522fe9a8f3c910",
    verified_dimensions: "1254x1254",
    verified_mime: "image/png",
    review_record_ref: "docs/v14_105_codex_session_womens_resort_relaxed_knit_final_review.md",
    human_approval_record_ref: "docs/v14_107_womens_resort_relaxed_knit_accepted_sample_closeout.md",
    category_index_ref: "accepted_samples/categories/fashion_lookbook_portrait.yaml",
    accepted_registry_ref: "accepted_samples/accepted_sample_registry.yaml",
    recoverability_status: "workspace_local_verified",
    artifact_locator_scope: "project_relative_runs",
    verification_mode: "local_file_hash",
    portable_after_clone: false,
    artifact_recoverability_is_not_vcp_runtime_integration: true,
    vcp_runtime_integration_proven: false,
    dashboard_progress_basis: "real_artifact_recoverability_evidence",
    project_master_plan_progress_allowed: false,
    documentation_token_progress_allowed: false,
    product_status_promotion_allowed_from_dashboard: false,
    negative_case_hash_mismatch_fails: true,
    negative_case_missing_artifact_fails: true,
    negative_case_missing_human_approval_fails: true,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    mcp_runtime_performed: false,
    image_generation_performed: false,
    file_write_performed: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false,
    failure_samples_write_performed: false,
    production_candidate_created: false,
    real_manifest_read_performed: false,
    real_vcpchat_read_performed: false,
    real_vcptoolbox_read_performed: false
  },
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
  review_evidence_blocker_contract_static_handoff: {
    source_adapter_response_ref: "tests/schema_examples/pvos_kernel_dry_run_adapter_response.example.json",
    status: "draft_ready",
    display_only: true,
    evidence_blocker_contract_attached: true,
    evidence_blocker_contract_handoff_id: "evidence_blocker_contract_handoff_portable_lantern_local_fixture_001",
    evidence_records: [
      {
        candidate_id: "candidate_accept_metadata_001",
        review_outcome: "pass",
        evidence_codes: [
          "weighted_score_meets_accept_threshold",
          "no_failure_tags_present"
        ],
        production_candidate: false,
        direct_write_performed: false
      },
      {
        candidate_id: "candidate_reject_metadata_001",
        review_outcome: "reject",
        evidence_codes: [
          "weighted_score_below_accept_threshold",
          "weighted_score_below_reject_threshold",
          "mapped_failure_tags_present"
        ],
        production_candidate: false,
        direct_write_performed: false
      }
    ],
    blocker_decisions: [
      {
        candidate_id: "candidate_accept_metadata_001",
        blocker_type: "human_review_required",
        blocking_scope: "production_promotion",
        decision: "block_until_required_review",
        permanent_block: false,
        production_candidate: false,
        direct_write_performed: false
      },
      {
        candidate_id: "candidate_reject_metadata_001",
        blocker_type: "production_exclusion",
        blocking_scope: "production_promotion",
        decision: "block_permanently",
        permanent_block: true,
        production_candidate: false,
        direct_write_performed: false
      }
    ],
    production_exclusion_register: [
      {
        candidate_id: "candidate_reject_metadata_001",
        status: "never_production",
        permanent_block: true,
        production_candidate: false
      }
    ],
    blocker_summary: {
      evidence_record_count: 2,
      blocker_decision_count: 2,
      production_exclusion_count: 1,
      permanent_block_count: 1,
      human_review_block_count: 2,
      memory_forbidden_block_count: 0,
      direct_memory_write_performed: false,
      production_candidate_created: false,
      accepted_samples_write_performed: false
    },
    review_evidence_blocker_contract_guard_summary: {
      evidence_record_count: 2,
      blocker_decision_count: 2,
      production_exclusion_count: 1,
      permanent_block_count: 1,
      human_review_block_count: 2,
      memory_forbidden_block_count: 0,
      production_exclusion_candidate_ids: [
        "candidate_reject_metadata_001"
      ],
      production_candidate_created: false,
      direct_memory_write_performed: false,
      accepted_samples_write_performed: false,
      every_candidate_has_evidence_record: true,
      every_candidate_has_production_blocker_decision: true,
      every_never_production_candidate_has_exclusion: true
    },
    arbitration_guard: {
      evidence_record_is_not_approval: true,
      blocker_decision_is_not_write: true,
      every_candidate_has_evidence_record: true,
      every_candidate_has_production_blocker_decision: true,
      every_never_production_candidate_has_exclusion: true,
      no_production_without_human_review: true,
      production_candidate_created: false,
      direct_memory_write_performed: false,
      accepted_samples_write_performed: false
    }
  },
  review_blocker_arbiter_static_handoff: {
    source_adapter_response_ref: "tests/schema_examples/pvos_kernel_dry_run_adapter_response.example.json",
    status: "draft_ready",
    display_only: true,
    review_blocker_arbiter_attached: true,
    review_blocker_arbiter_handoff_id: "review_blocker_arbiter_handoff_portable_lantern_local_fixture_001",
    arbiter_id: "review_blocker_arbiter_portable_lantern_local_fixture_001",
    source_evidence_blocker_contract_id: "evidence_blocker_contract_portable_lantern_local_fixture_001",
    candidate_arbitrations: [
      {
        candidate_id: "candidate_accept_metadata_001",
        review_outcome: "pass",
        evidence_record_id: "evidence_candidate_accept_metadata_001",
        production_blocker_decision_id: "blocker_production_candidate_accept_metadata_001",
        memory_blocker_decision_ids: [],
        production_exclusion_record_id: null,
        final_route: "pass_draft_only_pending_human_review",
        production_decision: "block_until_human_review",
        memory_decision: "block_until_human_memory_approval",
        memory_forbidden: false,
        never_production: false,
        production_promotion_allowed_now: false,
        memory_entry_allowed_now: false,
        memory_draft_allowed: true,
        requires_human_review: true,
        production_candidate_created: false,
        direct_memory_write_performed: false,
        accepted_samples_write_performed: false
      },
      {
        candidate_id: "candidate_reject_metadata_001",
        review_outcome: "reject",
        evidence_record_id: "evidence_candidate_reject_metadata_001",
        production_blocker_decision_id: "blocker_production_candidate_reject_metadata_001",
        memory_blocker_decision_ids: [],
        production_exclusion_record_id: "production_exclusion_candidate_reject_metadata_001",
        final_route: "reject_failure_learning_only_never_production",
        production_decision: "block_permanently",
        memory_decision: "block_until_human_memory_approval",
        memory_forbidden: false,
        never_production: true,
        production_promotion_allowed_now: false,
        memory_entry_allowed_now: false,
        memory_draft_allowed: true,
        requires_human_review: true,
        production_candidate_created: false,
        direct_memory_write_performed: false,
        accepted_samples_write_performed: false
      }
    ],
    arbiter_summary: {
      candidate_count: 2,
      passed_candidate_count: 1,
      rejected_candidate_count: 1,
      memory_draft_candidate_count: 2,
      memory_forbidden_count: 0,
      never_production_count: 1,
      production_blocked_count: 2,
      permanent_block_count: 1,
      human_review_required_count: 2,
      all_production_blocked: true,
      all_writes_blocked: true,
      direct_memory_write_performed: false,
      production_candidate_created: false,
      accepted_samples_write_performed: false
    },
    review_blocker_arbiter_guard_summary: {
      candidate_count: 2,
      memory_forbidden_count: 0,
      never_production_count: 1,
      production_blocked_count: 2,
      memory_forbidden_candidate_ids: [],
      never_production_candidate_ids: [
        "candidate_reject_metadata_001"
      ],
      production_promotion_allowed_now: false,
      memory_entry_allowed_now: false,
      production_candidate_created: false,
      direct_memory_write_performed: false,
      accepted_samples_write_performed: false,
      memory_forbidden_prevents_memory: true,
      never_production_prevents_production: true,
      human_review_required_before_production: true
    },
    production_blocked_candidate_ids: [
      "candidate_accept_metadata_001",
      "candidate_reject_metadata_001"
    ],
    promotion_guard: {
      evidence_required_for_every_candidate: true,
      blocker_required_for_every_candidate: true,
      memory_forbidden_prevents_memory: true,
      never_production_prevents_production: true,
      pass_is_not_production_approval: true,
      human_review_required_before_production: true,
      production_candidate_created: false,
      direct_memory_write_performed: false,
      accepted_samples_write_performed: false
    },
    final_route_by_candidate: [
      {
        candidate_id: "candidate_accept_metadata_001",
        final_route: "pass_draft_only_pending_human_review",
        production_decision: "block_until_human_review",
        memory_decision: "block_until_human_memory_approval",
        memory_forbidden: false,
        never_production: false
      },
      {
        candidate_id: "candidate_reject_metadata_001",
        final_route: "reject_failure_learning_only_never_production",
        production_decision: "block_permanently",
        memory_decision: "block_until_human_memory_approval",
        memory_forbidden: false,
        never_production: true
      }
    ],
    no_execution_guard: {
      provider_contact_allowed: false,
      plugin_call_allowed: false,
      api_call_allowed: false,
      daily_note_write_allowed: false,
      vcp_memory_write_allowed: false,
      image_generation_allowed: false,
      output_file_write_allowed: false,
      accepted_samples_write_allowed: false,
      production_candidate_write_allowed: false,
      external_manifest_read_allowed: false,
      provider_contact_performed: false,
      plugin_call_performed: false,
      api_call_performed: false,
      daily_note_write_performed: false,
      vcp_memory_write_performed: false,
      image_generation_performed: false,
      output_file_write_performed: false,
      accepted_samples_write_performed: false,
      production_candidate_created: false,
      external_manifest_read_performed: false,
      vcpchat_source_read_performed: false,
      vcptoolbox_source_read_performed: false
    }
  },
  review_report_static_handoff: {
    "source_adapter_response_ref": "tests/schema_examples/pvos_kernel_dry_run_adapter_response.example.json",
    "status": "draft_ready",
    "display_only": true,
    "review_report_contract_attached": true,
    "review_report_handoff_id": "review_report_handoff_portable_lantern_local_fixture_001",
    "review_report_id": "review_report_portable_lantern_local_fixture_001",
    "source_review_blocker_arbiter_id": "review_blocker_arbiter_portable_lantern_local_fixture_001",
    "source_evidence_blocker_contract_id": "evidence_blocker_contract_portable_lantern_local_fixture_001",
    "source_decision_package_id": "review_decision_package_portable_lantern_local_fixture_001",
    "source_protocol_id": "review_result_protocol_hardening_v1",
    "source_kernel_run_id": "pvos_kernel_run_portable_lantern_local_fixture_001",
    "required_review_report_fields": [
      "report_items",
      "report_summary",
      "memory_report",
      "production_report",
      "final_controls",
      "no_execution_guard"
    ],
    "report_items": [
      {
        "candidate_id": "candidate_accept_metadata_001",
        "shot_id": "shot_hero_tabletop_001",
        "review_outcome": "pass",
        "report_decision": "pass_to_draft_review_queue",
        "report_status": "draft_report_pending_human_review",
        "final_route": "pass_draft_only_pending_human_review",
        "pass_reasons": [
          "weighted_score_meets_accept_threshold",
          "no_failure_tags_present",
          "metadata_only_artifact_reference",
          "provenance_is_metadata_only"
        ],
        "reject_reasons": [],
        "failure_tags": [],
        "unknown_failure_tags": [],
        "evidence_record_id": "evidence_candidate_accept_metadata_001",
        "production_blocker_decision_id": "blocker_production_candidate_accept_metadata_001",
        "memory_blocker_decision_ids": [],
        "production_exclusion_record_id": null,
        "memory_report": {
          "allowed_output_now": "memory_delta_draft_only",
          "memory_entry_allowed_now": false,
          "memory_draft_allowed": true,
          "memory_forbidden": false,
          "requires_human_memory_approval": true,
          "direct_memory_write_performed": false,
          "daily_note_write_performed": false,
          "vcp_memory_write_performed": false
        },
        "production_report": {
          "allowed_output_now": "review_pending_candidate_only",
          "production_promotion_allowed_now": false,
          "requires_human_production_approval": true,
          "production_candidate_created": false,
          "accepted_samples_write_performed": false,
          "never_production": false
        },
        "final_controls": {
          "may_enter_memory_now": false,
          "may_enter_production_now": false,
          "writes_allowed_now": [],
          "writes_blocked": [
            "DailyNote_write",
            "VCP_memory_write",
            "direct_memory_write",
            "accepted_samples_write",
            "production_candidate"
          ],
          "execution_blocked": [
            "provider_execution",
            "plugin_call",
            "api_call",
            "image_generation",
            "deployment_or_release"
          ]
        }
      },
      {
        "candidate_id": "candidate_reject_metadata_001",
        "shot_id": "shot_hero_tabletop_001",
        "review_outcome": "reject",
        "report_decision": "reject_to_failure_learning_never_production",
        "report_status": "draft_report_failure_learning_only",
        "final_route": "reject_failure_learning_only_never_production",
        "pass_reasons": [],
        "reject_reasons": [
          "weighted_score_below_accept_threshold",
          "weighted_score_below_reject_threshold",
          "mapped_failure_tags_present"
        ],
        "failure_tags": [
          "lighting_flat",
          "composition_imbalance"
        ],
        "unknown_failure_tags": [],
        "evidence_record_id": "evidence_candidate_reject_metadata_001",
        "production_blocker_decision_id": "blocker_production_candidate_reject_metadata_001",
        "memory_blocker_decision_ids": [],
        "production_exclusion_record_id": "production_exclusion_candidate_reject_metadata_001",
        "memory_report": {
          "allowed_output_now": "failure_lesson_draft_only",
          "memory_entry_allowed_now": false,
          "memory_draft_allowed": true,
          "memory_forbidden": false,
          "requires_human_memory_approval": true,
          "direct_memory_write_performed": false,
          "daily_note_write_performed": false,
          "vcp_memory_write_performed": false
        },
        "production_report": {
          "allowed_output_now": "failure_learning_only",
          "production_promotion_allowed_now": false,
          "requires_human_production_approval": false,
          "production_candidate_created": false,
          "accepted_samples_write_performed": false,
          "never_production": true
        },
        "final_controls": {
          "may_enter_memory_now": false,
          "may_enter_production_now": false,
          "writes_allowed_now": [],
          "writes_blocked": [
            "DailyNote_write",
            "VCP_memory_write",
            "direct_memory_write",
            "accepted_samples_write",
            "production_candidate"
          ],
          "execution_blocked": [
            "provider_execution",
            "plugin_call",
            "api_call",
            "image_generation",
            "deployment_or_release",
            "production_forever"
          ]
        }
      }
    ],
    "report_summary": {
      "candidate_count": 2,
      "pass_count": 1,
      "reject_count": 1,
      "report_items_explain_all_candidates": true,
      "memory_entry_allowed_now_count": 0,
      "production_promotion_allowed_now_count": 0,
      "writes_allowed_now_count": 0,
      "never_production_count": 1,
      "all_memory_writes_blocked": true,
      "all_production_writes_blocked": true,
      "all_provider_execution_blocked": true,
      "all_candidates_have_evidence_record": true,
      "all_candidates_have_blocker_decision": true
    },
    "review_report_guard_summary": {
      "candidate_count": 2,
      "pass_count": 1,
      "reject_count": 1,
      "never_production_count": 1,
      "memory_entry_allowed_now_count": 0,
      "production_promotion_allowed_now_count": 0,
      "writes_allowed_now_count": 0,
      "never_production_candidate_ids": [
        "candidate_reject_metadata_001"
      ],
      "memory_forbidden_candidate_ids": [],
      "all_memory_writes_blocked": true,
      "all_production_writes_blocked": true,
      "all_provider_execution_blocked": true,
      "production_candidate_created": false,
      "direct_memory_write_performed": false,
      "daily_note_write_performed": false,
      "vcp_memory_write_performed": false,
      "accepted_samples_write_performed": false
    },
    "no_execution_guard": {
      "provider_contact_performed": false,
      "plugin_call_performed": false,
      "api_call_performed": false,
      "daily_note_write_performed": false,
      "vcp_memory_write_performed": false,
      "image_generation_performed": false,
      "output_file_write_performed": false,
      "accepted_samples_write_performed": false,
      "production_candidate_created": false
    }
  },
  review_report_negative_guard_static_handoff: {
    source_adapter_response_ref: "tests/schema_examples/pvos_kernel_dry_run_adapter_negative_guard_response.example.json",
    status: "draft_ready",
    display_only: true,
    negative_guard_observed: true,
    review_report_contract_attached: true,
    review_report_handoff_id: "review_report_handoff_negative_guard_local_fixture_001",
    review_report_id: "review_report_negative_guard_local_fixture_001",
    source_review_blocker_arbiter_id: "review_blocker_arbiter_negative_guard_local_fixture_001",
    source_evidence_blocker_contract_id: "evidence_blocker_contract_negative_guard_local_fixture_001",
    source_decision_package_id: "review_decision_package_negative_guard_local_fixture_001",
    source_protocol_id: "review_result_protocol_negative_guard_v1",
    source_kernel_run_id: "pvos_kernel_run_negative_guard_local_fixture_001",
    required_review_report_fields: [
      "report_items",
      "report_summary",
      "memory_report",
      "production_report",
      "final_controls",
      "no_execution_guard"
    ],
    report_items: [
      {
        candidate_id: "candidate_reject_mapped_guard_001",
        shot_id: "shot_negative_guard_hero_001",
        review_outcome: "reject",
        report_decision: "reject_to_failure_learning_never_production",
        report_status: "draft_report_failure_learning_only",
        final_route: "reject_failure_learning_only_never_production",
        pass_reasons: [],
        reject_reasons: [
          "weighted_score_below_accept_threshold",
          "weighted_score_below_reject_threshold",
          "mapped_failure_tags_present"
        ],
        failure_tags: [
          "lighting_flat",
          "composition_imbalance"
        ],
        unknown_failure_tags: [],
        evidence_record_id: "evidence_candidate_reject_mapped_guard_001",
        production_blocker_decision_id: "blocker_production_candidate_reject_mapped_guard_001",
        memory_blocker_decision_ids: [],
        production_exclusion_record_id: "production_exclusion_candidate_reject_mapped_guard_001",
        memory_report: {
          allowed_output_now: "failure_lesson_draft_only",
          memory_entry_allowed_now: false,
          memory_draft_allowed: true,
          memory_forbidden: false,
          requires_human_memory_approval: true,
          direct_memory_write_performed: false,
          daily_note_write_performed: false,
          vcp_memory_write_performed: false
        },
        production_report: {
          allowed_output_now: "failure_learning_only",
          production_promotion_allowed_now: false,
          requires_human_production_approval: false,
          production_candidate_created: false,
          accepted_samples_write_performed: false,
          never_production: true
        },
        final_controls: {
          may_enter_memory_now: false,
          may_enter_production_now: false,
          writes_allowed_now: [],
          writes_blocked: [
            "DailyNote_write",
            "VCP_memory_write",
            "direct_memory_write",
            "accepted_samples_write",
            "production_candidate"
          ],
          execution_blocked: [
            "provider_execution",
            "plugin_call",
            "api_call",
            "image_generation",
            "deployment_or_release",
            "production_forever"
          ]
        }
      },
      {
        candidate_id: "candidate_reject_unknown_guard_001",
        shot_id: "shot_negative_guard_hero_001",
        review_outcome: "reject",
        report_decision: "reject_to_memory_forbidden_never_production",
        report_status: "draft_report_memory_forbidden_never_production",
        final_route: "reject_memory_forbidden_never_production",
        pass_reasons: [],
        reject_reasons: [
          "weighted_score_below_accept_threshold",
          "weighted_score_below_reject_threshold",
          "mapped_failure_tags_present",
          "unknown_failure_tags_present"
        ],
        failure_tags: [
          "unmapped_identity_drift"
        ],
        unknown_failure_tags: [
          "unmapped_identity_drift"
        ],
        evidence_record_id: "evidence_candidate_reject_unknown_guard_001",
        production_blocker_decision_id: "blocker_production_candidate_reject_unknown_guard_001",
        memory_blocker_decision_ids: [
          "blocker_memory_candidate_reject_unknown_guard_001"
        ],
        production_exclusion_record_id: "production_exclusion_candidate_reject_unknown_guard_001",
        memory_report: {
          allowed_output_now: "none",
          memory_entry_allowed_now: false,
          memory_draft_allowed: false,
          memory_forbidden: true,
          requires_human_memory_approval: true,
          direct_memory_write_performed: false,
          daily_note_write_performed: false,
          vcp_memory_write_performed: false
        },
        production_report: {
          allowed_output_now: "failure_learning_only",
          production_promotion_allowed_now: false,
          requires_human_production_approval: false,
          production_candidate_created: false,
          accepted_samples_write_performed: false,
          never_production: true
        },
        final_controls: {
          may_enter_memory_now: false,
          may_enter_production_now: false,
          writes_allowed_now: [],
          writes_blocked: [
            "DailyNote_write",
            "VCP_memory_write",
            "direct_memory_write",
            "accepted_samples_write",
            "production_candidate"
          ],
          execution_blocked: [
            "provider_execution",
            "plugin_call",
            "api_call",
            "image_generation",
            "deployment_or_release",
            "production_forever"
          ]
        }
      }
    ],
    report_summary: {
      candidate_count: 2,
      pass_count: 0,
      reject_count: 2,
      report_items_explain_all_candidates: true,
      memory_entry_allowed_now_count: 0,
      production_promotion_allowed_now_count: 0,
      writes_allowed_now_count: 0,
      never_production_count: 2,
      all_memory_writes_blocked: true,
      all_production_writes_blocked: true,
      all_provider_execution_blocked: true,
      all_candidates_have_evidence_record: true,
      all_candidates_have_blocker_decision: true
    },
    review_report_guard_summary: {
      candidate_count: 2,
      pass_count: 0,
      reject_count: 2,
      never_production_count: 2,
      memory_entry_allowed_now_count: 0,
      production_promotion_allowed_now_count: 0,
      writes_allowed_now_count: 0,
      never_production_candidate_ids: [
        "candidate_reject_mapped_guard_001",
        "candidate_reject_unknown_guard_001"
      ],
      memory_forbidden_candidate_ids: [
        "candidate_reject_unknown_guard_001"
      ],
      all_memory_writes_blocked: true,
      all_production_writes_blocked: true,
      all_provider_execution_blocked: true,
      production_candidate_created: false,
      direct_memory_write_performed: false,
      daily_note_write_performed: false,
      vcp_memory_write_performed: false,
      accepted_samples_write_performed: false
    },
    no_execution_guard: {
      provider_contact_performed: false,
      plugin_call_performed: false,
      api_call_performed: false,
      daily_note_write_performed: false,
      vcp_memory_write_performed: false,
      image_generation_performed: false,
      output_file_write_performed: false,
      accepted_samples_write_performed: false,
      production_candidate_created: false
    }
  },
  review_evidence_blocker_adapter_negative_static_handoff: {
    source_adapter_response_ref: "tests/schema_examples/pvos_kernel_dry_run_adapter_negative_guard_response.example.json",
    source_evidence_blocker_fixture_ref: "tests/schema_examples/evidence_blocker_contract_negative_guard.example.json",
    status: "draft_ready",
    display_only: true,
    adapter_negative_guard_observed: true,
    evidence_blocker_contract_embedded: true,
    evidence_blocker_contract_matches_fixture: true,
    evidence_blocker_contract_handoff_id: "evidence_blocker_contract_handoff_negative_guard_local_fixture_001",
    memory_forbidden_candidate_ids: [
      "candidate_reject_unknown_guard_001"
    ],
    production_exclusion_candidate_ids: [
      "candidate_reject_mapped_guard_001",
      "candidate_reject_unknown_guard_001"
    ],
    rejected_candidate_ids: [
      "candidate_reject_mapped_guard_001",
      "candidate_reject_unknown_guard_001"
    ],
    guard_summary: {
      evidence_record_count: 2,
      blocker_decision_count: 3,
      production_exclusion_count: 2,
      permanent_block_count: 3,
      human_review_block_count: 2,
      memory_forbidden_block_count: 1,
      production_candidate_created: false,
      direct_memory_write_performed: false,
      accepted_samples_write_performed: false,
      every_candidate_has_evidence_record: true,
      every_candidate_has_production_blocker_decision: true,
      every_never_production_candidate_has_exclusion: true
    },
    audit_summary: {
      accepted_sample_draft_count: 0,
      rejected_sample_draft_count: 2,
      memory_delta_draft_count: 1,
      production_exclusion_count: 2,
      never_production_count: 2,
      memory_forbidden_count: 1,
      selected_plugin: null,
      max_plugin_calls_observed: 0,
      production_candidate_created: false,
      external_api_observed: false,
      image_generation_observed: false,
      memory_write_observed: false
    },
    blocker_highlights: [
      {
        candidate_id: "candidate_reject_mapped_guard_001",
        review_outcome: "reject",
        memory_route: "audit_only_failure_learning",
        production_route: "never_production",
        blocker_type: "production_exclusion",
        decision: "block_permanently",
        permanent_block: true,
        production_candidate: false,
        direct_write_performed: false
      },
      {
        candidate_id: "candidate_reject_unknown_guard_001",
        review_outcome: "reject",
        memory_route: "forbidden",
        production_route: "never_production",
        blocker_type: "memory_forbidden",
        decision: "block_memory_entry",
        permanent_block: true,
        production_candidate: false,
        direct_write_performed: false
      }
    ],
    no_execution_guard: {
      provider_contact_performed: false,
      plugin_call_performed: false,
      api_call_performed: false,
      daily_note_write_performed: false,
      vcp_memory_write_performed: false,
      image_generation_performed: false,
      output_file_write_performed: false,
      accepted_samples_write_performed: false,
      production_candidate_created: false
    }
  },
  codex_session_import_record_seed: {
    source_ref: "runs/real_generation/v14_105_codex_session_womens_resort_relaxed_knit_final_candidate/resort_relaxed_knit_final_import_record.json",
    codex_session_image_import: {
      import_version: "v1",
      import_id: "v14_105_codex_session_womens_resort_relaxed_knit_final_v2",
      provider_id: "codex_session_image",
      import_mode: "manual_session_import",
      status: "review_linked",
      source: {
        codex_session_generation: true,
        codex_image_direct_call_allowed: false,
        mcp_runtime_allowed: false,
        provider_api_call_allowed: false,
        project_script_generation_allowed: false,
        image_generation_by_script: false,
        human_session_action_required: true
      },
      prompt_package_ref: "session_prompt_inline:womens_resort_relaxed_knit_final_v2",
      prompt_package_id: "womens_resort_relaxed_knit_final_v2",
      imported_asset: {
        output_directory_ref: "runs/real_generation/v14_105_codex_session_womens_resort_relaxed_knit_final_candidate/",
        file_name: "codex_session_womens_resort_relaxed_knit_final_v2.png",
        relative_path: "runs/real_generation/v14_105_codex_session_womens_resort_relaxed_knit_final_candidate/codex_session_womens_resort_relaxed_knit_final_v2.png",
        mime_type: "image/png",
        width_px: 1254,
        height_px: 1254,
        aspect_ratio: "1:1",
        sha256: "9d23208d05427b02ffc177664c1918ed73bf57831a9694be16522fe9a8f3c910",
        local_file_verified: true,
        copied_by_project_script: false
      },
      review_bridge: {
        image_case_id: "v14_105_womens_resort_relaxed_knit_final_v2",
        review_status: "pending_human_review",
        accepted_candidate: false,
        commercial_delivery_ready: false,
        memory_suitability: "deferred",
        review_record_ref: "docs/v14_105_codex_session_womens_resort_relaxed_knit_final_review.md"
      },
      no_execution_guard: {
        provider_contact_allowed: false,
        plugin_call_allowed: false,
        api_call_allowed: false,
        image_generation_allowed_by_project: false,
        env_local_secret_value_read_allowed: false,
        DailyNote_write_allowed: false,
        VCP_memory_write_allowed: false,
        accepted_samples_write_allowed: false,
        production_candidate_write_allowed: false,
        real_manifest_read_allowed: false,
        real_VCPChat_read_allowed: false,
        real_VCPToolBox_read_allowed: false,
        push_tag_release_deploy_allowed: false,
        provider_contact_performed_by_project: false,
        plugin_call_performed_by_project: false,
        api_call_performed_by_project: false,
        image_generation_performed_by_project: false,
        env_local_secret_value_read_performed: false,
        DailyNote_write_performed: false,
        VCP_memory_write_performed: false,
        accepted_samples_write_performed: false,
        production_candidate_write_performed: false,
        real_manifest_read_performed: false,
        real_VCPChat_read_performed: false,
        real_VCPToolBox_read_performed: false,
        push_tag_release_deploy_performed: false
      }
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
