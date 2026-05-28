(function initReadonlyOperatorConsole(global) {
  const SELECTED_REVIEW_RESULT_ID = "visual_eval_review_result_patch_synthetic_001";

  const SOURCE_REFS = [
    "tests/schema_examples/visual_eval_readonly_review_collection_consumer.example.json",
    "tests/schema_examples/visual_eval_readonly_review_collection_query.example.json",
    "tests/schema_examples/visual_eval_readonly_review_detail_view.example.json",
    "tests/schema_examples/visual_eval_readonly_review_detail_navigation.example.json",
    "tests/schema_examples/visual_eval_readonly_review_session_drilldown.example.json",
    "tests/schema_examples/visual_eval_readonly_metadata_accumulation_queue_surface_snapshot.example.json"
  ];

  const OUTCOME_LABELS = {
    pass: "通过",
    patch: "需修",
    reject: "拒绝"
  };

  const FIELD_LABELS = {
    candidate: "候选图",
    next_action: "下一步",
    metadata: "元数据去向",
    write_allowed: "允许写入",
    why_patch: "需修原因",
    why_reject: "拒绝原因",
    blocking: "阻塞点",
    metadata_lanes: "元数据队列",
    never_production: "永不进生产",
    write_allowed_now: "当前可写",
    metadata_only: "仅元数据",
    read_only: "只读",
    static_ui_only: "静态页面",
    fetch_performed: "网络读取",
    file_write_performed: "文件写入",
    provider_contact_performed: "Provider 调用",
    plugin_call_performed: "插件调用",
    api_call_performed: "API 调用",
    image_generation_performed: "图像生成",
    DailyNote_write_performed: "DailyNote 写入",
    VCP_memory_write_performed: "VCP 记忆写入",
    memory_write_performed: "记忆写入",
    production_candidate_002_started: "生产候选启动",
    Batch_005_started: "Batch 启动"
  };

  const STATUS_LABELS = {
    draft_ready: "只读可查看"
  };

  const TOKEN_LABELS = {
    queue_for_future_human_review: "排队复看",
    write_patch_plan_only: "只写补丁计划",
    defer_until_taxonomy_update: "等 taxonomy 更新",
    keep_as_metadata_candidate: "保留为可用元数据候选",
    metadata_only_reference: "仅作为元数据参考",
    keep_as_failure_learning_metadata: "保留为失败学习样本",
    patch_plan_only: "补丁计划",
    archive_references: "归档引用",
    next_review_actions: "下一步动作",
    failure_learning_metadata: "失败学习元数据",
    accepted_metadata_candidates: "可接受元数据候选",
    material_failed: "材质失败",
    lighting_failed: "光照失败",
    subject_drift: "主体漂移",
    commercial_unusable: "商用不可用",
    material_realism_watch: "材质真实感待处理",
    lighting_consistency_watch: "光照一致性待处理",
    severe_subject_drift: "严重主体漂移",
    "material realism needs correction": "材质真实感需要修正",
    "lighting consistency needs correction": "光照一致性需要修正",
    "subject drift blocks reliable product identity": "主体漂移，商品身份不可靠",
    "commercial unusability blocks delivery readiness": "商用不可用，不能交付"
  };

  function fallbackRows() {
    return [
      {
        review_result_id: "visual_eval_review_result_pass_synthetic_001",
        candidate_id: "synthetic_product_still_life_pass_001",
        case_id: "visual_eval_image_case_pass_synthetic_001",
        outcome: "pass",
        summary: "Synthetic candidate meets core product readability and has only non-blocking watch items.",
        reasons: ["product_identity_preserved", "commercial_readability_plausible", "no_major_artifact_recorded"],
        taxonomy_tags: [],
        blocking_watch_items: [],
        next_review_action: "queue_for_future_human_review",
        metadata_accumulation_action: "keep_as_metadata_candidate",
        metadata_queue_sections: ["accepted_metadata_candidates", "archive_references", "next_review_actions"],
        write_allowed: false
      },
      {
        review_result_id: SELECTED_REVIEW_RESULT_ID,
        candidate_id: "synthetic_product_still_life_patch_001",
        case_id: "visual_eval_image_case_patch_synthetic_001",
        outcome: "patch",
        summary: "Synthetic candidate has useful composition but requires bounded correction before pass.",
        reasons: ["material realism needs correction", "lighting consistency needs correction"],
        taxonomy_tags: ["material_failed", "lighting_failed"],
        blocking_watch_items: ["material_realism_watch", "lighting_consistency_watch"],
        next_review_action: "write_patch_plan_only",
        metadata_accumulation_action: "metadata_only_reference",
        metadata_queue_sections: ["patch_plan_only", "archive_references", "next_review_actions"],
        write_allowed: false
      },
      {
        review_result_id: "visual_eval_review_result_reject_synthetic_001",
        candidate_id: "synthetic_product_still_life_reject_001",
        case_id: "visual_eval_image_case_reject_synthetic_001",
        outcome: "reject",
        summary: "Synthetic candidate fails product identity or commercial usability and must remain never-production.",
        reasons: [
          "subject drift blocks reliable product identity",
          "commercial unusability blocks delivery readiness"
        ],
        taxonomy_tags: ["subject_drift", "commercial_unusable"],
        blocking_watch_items: ["severe_subject_drift", "commercial_unusable"],
        next_review_action: "defer_until_taxonomy_update",
        metadata_accumulation_action: "keep_as_failure_learning_metadata",
        metadata_queue_sections: ["failure_learning_metadata", "archive_references", "next_review_actions"],
        write_allowed: false
      }
    ];
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[char]);
  }

  function asList(items) {
    return Array.isArray(items) ? items : [];
  }

  function tagsHtml(items) {
    const tags = asList(items);
    if (tags.length === 0) return '<span class="tag">无</span>';
    return tags.map((item) => `<span class="tag">${escapeHtml(item)}</span>`).join("");
  }

  function fieldLabel(key) {
    return FIELD_LABELS[key] || key;
  }

  function yesNo(value) {
    return value === true ? "是" : value === false ? "否" : value;
  }

  function shortId(value) {
    return String(value || "")
      .replace("visual_eval_review_result_", "")
      .replace("synthetic_product_still_life_", "")
      .replace("_synthetic_", "_");
  }

  function explainToken(value) {
    const label = TOKEN_LABELS[value];
    return label ? `${label}（${value}）` : value;
  }

  function operatorSummary(row) {
    if (row.outcome === "pass") {
      return "可通过：商品识别和商用可读性成立，后续只需排队复看。";
    }
    if (row.outcome === "patch") {
      return "先处理：构图可用，但材质真实感和光照一致性仍阻塞通过。";
    }
    if (row.outcome === "reject") {
      return "拒绝：主体漂移或商用不可用，必须保持永不进生产。";
    }
    return row.summary;
  }

  function rowRefs(rows, outcome) {
    return rows
      .filter((row) => row.outcome === outcome)
      .map((row) => ({
        review_result_id: row.review_result_id,
        candidate_id: row.candidate_id,
        outcome: row.outcome
      }));
  }

  function buildReadonlyOperatorState(source) {
    const handoff = source?.visual_eval_readonly_review_corpus_renderer_static_handoff || {};
    const rows = asList(handoff.display_rows).length > 0 ? handoff.display_rows : fallbackRows();
    const byId = new Map(rows.map((row) => [row.review_result_id, row]));
    const selected = byId.get(SELECTED_REVIEW_RESULT_ID);
    const reject = rows.find((row) => row.outcome === "reject");
    return {
      console_id: "readonly_operator_console_static_surface_v1",
      status: "draft_ready",
      display_only: true,
      selected_review_result_id: SELECTED_REVIEW_RESULT_ID,
      selected_patch: {
        selected_patch: true,
        review_result_id: SELECTED_REVIEW_RESULT_ID,
        candidate_id: selected?.candidate_id,
        session_id: "visual_eval_review_session_synthetic_bundle_001",
        case_id: selected?.case_id,
        outcome: selected?.outcome,
        next_review_action: selected?.next_review_action,
        metadata_accumulation_action: selected?.metadata_accumulation_action
      },
      overview: {
        pass: rowRefs(rows, "pass"),
        patch: rowRefs(rows, "patch"),
        reject: rowRefs(rows, "reject")
      },
      selected_patch_drilldown: {
        row: selected,
        why_patch: asList(selected?.reasons),
        blocking_watch_items: asList(selected?.blocking_watch_items),
        taxonomy_tags: asList(selected?.taxonomy_tags),
        next_review_action: selected?.next_review_action,
        metadata_lanes: asList(selected?.metadata_queue_sections),
        write_allowed_now: selected?.write_allowed === true ? true : false,
        cross_layer_consistency: [
          "collection_consumer.selected_review_result_id",
          "collection_query.selected_patch",
          "detail_view.selected_card",
          "detail_navigation.selected_detail",
          "session_drilldown.selected_review_row",
          "metadata_queue.patch_plan_only",
          "metadata_queue_surface.selected_items"
        ]
      },
      reject_constraint_trace: {
        row: reject,
        why_reject: asList(reject?.reasons),
        failure_taxonomy: asList(reject?.taxonomy_tags),
        blocking_watch_items: asList(reject?.blocking_watch_items),
        next_review_action: reject?.next_review_action,
        metadata_lanes: asList(reject?.metadata_queue_sections),
        never_production: true,
        write_allowed_now: reject?.write_allowed === true ? true : false
      },
      operator_friction: [
        "JSON artifact 链已经稳定，但人工扫读仍需要跨多层文件。",
        "selected patch 入口显式可见；collection_rows 内部行仍不单独标 selected。",
        "metadata queue 为机器索引重复展示同一对象，人工阅读时需要折叠。",
        "轻量 card/ref 有时不带完整 taxonomy，需要回 detail row 或 section card。"
      ],
      source_refs: SOURCE_REFS,
      boundary: {
        metadata_only: true,
        read_only: true,
        static_ui_only: true,
        fetch_performed: false,
        file_write_performed: false,
        provider_contact_performed: false,
        plugin_call_performed: false,
        api_call_performed: false,
        image_generation_performed: false,
        DailyNote_write_performed: false,
        VCP_memory_write_performed: false,
        memory_write_performed: false,
        production_candidate_002_started: false,
        Batch_005_started: false
      }
    };
  }

  const OPERATOR_STATE = buildReadonlyOperatorState(global.REVIEW_CONSOLE_MOCK || {});

  function detailList(items) {
    return Object.entries(items).map(([key, value]) => `
      <div>
        <dt>${escapeHtml(fieldLabel(key))}</dt>
        <dd>${Array.isArray(value) ? escapeHtml(value.map(explainToken).join(", ") || "无") : escapeHtml(explainToken(yesNo(value)))}</dd>
      </div>
    `).join("");
  }

  function renderReviewCard(row, selectedId) {
    const selectedClass = row.review_result_id === selectedId ? " is-selected" : "";
    const selectedMark = row.review_result_id === selectedId ? '<span class="selected-mark">当前先看</span>' : "";
    return `
      <article class="review-card overview-row ${escapeHtml(row.outcome)}${selectedClass}">
        <div class="status-badge ${escapeHtml(row.outcome)}">${escapeHtml(OUTCOME_LABELS[row.outcome] || row.outcome)}</div>
        <div class="overview-main">
          <div class="card-head">
            <strong title="${escapeHtml(row.review_result_id)}">${escapeHtml(shortId(row.review_result_id))}</strong>
            ${selectedMark}
          </div>
          <p>${escapeHtml(operatorSummary(row))}</p>
        </div>
        <div class="overview-meta">
          <span title="${escapeHtml(row.candidate_id)}">候选图：${escapeHtml(shortId(row.candidate_id))}</span>
          <span>下一步：${escapeHtml(explainToken(row.next_review_action))}</span>
          <span>元数据：${escapeHtml(explainToken(row.metadata_accumulation_action))}</span>
        </div>
      </article>
    `;
  }

  function renderOutcomeBoard(state, root) {
    const board = root.querySelector("#outcomeBoard");
    const lanes = ["pass", "patch", "reject"];
    board.innerHTML = lanes.map((outcome) => {
      const refs = state.overview[outcome] || [];
      const rows = refs.map((ref) => {
        const sourceRow = OPERATOR_STATE.selected_patch_drilldown.row?.review_result_id === ref.review_result_id
          ? OPERATOR_STATE.selected_patch_drilldown.row
          : OPERATOR_STATE.reject_constraint_trace.row?.review_result_id === ref.review_result_id
            ? OPERATOR_STATE.reject_constraint_trace.row
            : fallbackRows().find((item) => item.review_result_id === ref.review_result_id);
        return renderReviewCard(sourceRow || ref, state.selected_review_result_id);
      }).join("");
      return `
        ${rows}
      `;
    }).join("");
  }

  function renderSelectedPatch(state, root) {
    const row = state.selected_patch_drilldown.row;
    root.querySelector("#selectedAction").textContent = `下一步：${explainToken(state.selected_patch_drilldown.next_review_action)}`;
    root.querySelector("#selectedPatchPanel").innerHTML = `
      <article class="detail-card primary">
        <div class="card-head">
          <strong title="${escapeHtml(row.review_result_id)}">${escapeHtml(shortId(row.review_result_id))}</strong>
          <span title="${escapeHtml(row.candidate_id)}">${escapeHtml(shortId(row.candidate_id))}</span>
        </div>
        <p>${escapeHtml(operatorSummary(row))}</p>
        <div class="tag-row">${tagsHtml(state.selected_patch_drilldown.taxonomy_tags)}</div>
        <dl class="detail-list">
          ${detailList({
            why_patch: state.selected_patch_drilldown.why_patch,
            blocking: state.selected_patch_drilldown.blocking_watch_items,
            metadata_lanes: state.selected_patch_drilldown.metadata_lanes,
            write_allowed_now: state.selected_patch_drilldown.write_allowed_now
          })}
        </dl>
      </article>
      <article class="detail-card guard">
        <div class="card-head">
          <strong>跨层选中一致</strong>
          <span>已对齐</span>
        </div>
        <div class="tag-row">${tagsHtml(state.selected_patch_drilldown.cross_layer_consistency)}</div>
      </article>
    `;
  }

  function renderRejectGuard(state, root) {
    const row = state.reject_constraint_trace.row;
    root.querySelector("#rejectAction").textContent = `下一步：${explainToken(state.reject_constraint_trace.next_review_action)}`;
    root.querySelector("#rejectGuardPanel").innerHTML = `
      <article class="detail-card danger">
        <div class="hard-warning">硬约束：永不进生产，只能进入失败学习元数据。</div>
        <div class="card-head">
          <strong title="${escapeHtml(row.review_result_id)}">${escapeHtml(shortId(row.review_result_id))}</strong>
          <span title="${escapeHtml(row.candidate_id)}">${escapeHtml(shortId(row.candidate_id))}</span>
        </div>
        <p>${escapeHtml(operatorSummary(row))}</p>
        <div class="tag-row">${tagsHtml(state.reject_constraint_trace.failure_taxonomy)}</div>
        <dl class="detail-list">
          ${detailList({
            why_reject: state.reject_constraint_trace.why_reject,
            blocking: state.reject_constraint_trace.blocking_watch_items,
            metadata_lanes: state.reject_constraint_trace.metadata_lanes,
            never_production: state.reject_constraint_trace.never_production,
            write_allowed_now: state.reject_constraint_trace.write_allowed_now
          })}
        </dl>
      </article>
    `;
  }

  function renderMeta(state, root) {
    root.querySelector("#frictionLog").innerHTML = state.operator_friction.map((item) => `
      <article class="note-card">
        <p>${escapeHtml(item)}</p>
      </article>
    `).join("");
    root.querySelector("#sourceRefs").innerHTML = state.source_refs
      .map((ref) => `<span>${escapeHtml(ref)}</span>`)
      .join("");
    root.querySelector("#boundaryStrip").innerHTML = [
      "只读",
      "禁止写入",
      "无外部调用",
      "无图像生成"
    ].map((item) => `<span>${escapeHtml(item)}</span>`).join("");
  }

  function renderReadonlyOperatorConsole(state, root) {
    root.querySelector("#operatorStatus").textContent = `状态：${STATUS_LABELS[state.status] || state.status}`;
    root.querySelector("#operatorSelectedId").textContent = `当前：${shortId(state.selected_review_result_id)}`;
    root.querySelector("#operatorSelectedId").title = state.selected_review_result_id;
    root.querySelector("#overviewCounts").innerHTML = ["pass", "patch", "reject"]
      .map((outcome) => `<span>${OUTCOME_LABELS[outcome]}：${state.overview[outcome].length}</span>`)
      .join("");
    renderOutcomeBoard(state, root);
    renderSelectedPatch(state, root);
    renderRejectGuard(state, root);
    renderMeta(state, root);
  }

  if (typeof document !== "undefined") {
    renderReadonlyOperatorConsole(OPERATOR_STATE, document);
  }

  global.READONLY_OPERATOR_CONSOLE_STATE = OPERATOR_STATE;
  global.buildReadonlyOperatorState = buildReadonlyOperatorState;

  if (typeof module !== "undefined") {
    module.exports = {
      OPERATOR_STATE,
      buildReadonlyOperatorState,
      fallbackRows
    };
  }
})(typeof window !== "undefined" ? window : globalThis);
